import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.create();

describe("Vault Liquidation V2 Security", function () {
  async function deploySystem() {
    const [
      admin,
      user,
      liquidator,
      attacker,
    ] = await ethers.getSigners();

    // -----------------------------
    // AUSD
    // -----------------------------

    const AUSD =
      await ethers.getContractFactory(
        "AUSDStablecoin"
      );

    const ausd =
      await AUSD.deploy(
        admin.address,
        0
      );

    await ausd.waitForDeployment();

    // -----------------------------
    // ORACLE
    // -----------------------------

    const Oracle =
      await ethers.getContractFactory(
        "PriceOracle"
      );

    const oracle =
      await Oracle.deploy(
        admin.address
      );

    await oracle.waitForDeployment();

    // Initial ETH price = $3,000
    await oracle.setETHPrice(
      ethers.parseUnits("3000", 8)
    );

    // -----------------------------
    // VAULT
    // -----------------------------

    const Vault =
      await ethers.getContractFactory(
        "Vault"
      );

    const vault =
      await Vault.deploy(
        admin.address,
        await ausd.getAddress(),
        await oracle.getAddress()
      );

    await vault.waitForDeployment();

    // -----------------------------
    // AUSD ROLES
    // -----------------------------

    const MINTER_ROLE =
      await ausd.MINTER_ROLE();

    const BURNER_ROLE =
      await ausd.BURNER_ROLE();

    await ausd.grantRole(
      MINTER_ROLE,
      await vault.getAddress()
    );

    await ausd.grantRole(
      BURNER_ROLE,
      await vault.getAddress()
    );

    return {
      admin,
      user,
      liquidator,
      attacker,
      ausd,
      oracle,
      vault,
    };
  }

  // ------------------------------------------------
  // HEALTHY POSITION
  // ------------------------------------------------

  it(
    "should reject liquidation of a healthy position",
    async function () {
      const {
        user,
        liquidator,
        vault,
        ausd,
      } = await deploySystem();

      await vault
        .connect(user)
        .depositETH({
          value: ethers.parseEther("1"),
        });

      const debt =
        ethers.parseEther("1000");

      await vault
        .connect(user)
        .borrowAUSD(debt);

      // Give liquidator AUSD so the
      // burn itself is not the reason
      // for the revert.
      const MINTER_ROLE =
        await ausd.MINTER_ROLE();

      await ausd.grantRole(
        MINTER_ROLE,
        await liquidator.address
      );

      await ausd
        .connect(liquidator)
        .mint(
          liquidator.address,
          debt
        );

      await expect(
        vault
          .connect(liquidator)
          .liquidate(
            user.address,
            ethers.parseEther("100")
          )
      ).to.be.revert(ethers);
    }
  );

  // ------------------------------------------------
  // LIQUIDATION AFTER PRICE CRASH
  // ------------------------------------------------

  it(
    "should allow liquidation when position reaches 75% LTV",
    async function () {
      const {
        user,
        liquidator,
        vault,
        oracle,
        ausd,
      } = await deploySystem();

      await vault
        .connect(user)
        .depositETH({
          value: ethers.parseEther("1"),
        });

      const debt =
        ethers.parseEther("1500");

      await vault
        .connect(user)
        .borrowAUSD(debt);

      // ETH falls from $3,000 to $2,000.
      // $1,500 debt / $2,000 collateral = 75%.
      await oracle.setETHPrice(
        ethers.parseUnits("2000", 8)
      );

      const MINTER_ROLE =
        await ausd.MINTER_ROLE();

      await ausd.grantRole(
        MINTER_ROLE,
        liquidator.address
      );

      await ausd
        .connect(liquidator)
        .mint(
          liquidator.address,
          ethers.parseEther("750")
        );

      await expect(
        vault
          .connect(liquidator)
          .liquidate(
            user.address,
            ethers.parseEther("750")
          )
      ).not.to.be.revert(ethers);
    }
  );

  // ------------------------------------------------
  // CLOSE FACTOR
  // ------------------------------------------------

  it(
    "should enforce the 50% liquidation close factor",
    async function () {
      const {
        user,
        liquidator,
        vault,
        oracle,
        ausd,
      } = await deploySystem();

      await vault
        .connect(user)
        .depositETH({
          value: ethers.parseEther("1"),
        });

      const debt =
        ethers.parseEther("1500");

      await vault
        .connect(user)
        .borrowAUSD(debt);

      await oracle.setETHPrice(
        ethers.parseUnits("2000", 8)
      );

      const MINTER_ROLE =
        await ausd.MINTER_ROLE();

      await ausd.grantRole(
        MINTER_ROLE,
        liquidator.address
      );

      await ausd
        .connect(liquidator)
        .mint(
          liquidator.address,
          ethers.parseEther("1500")
        );

      // Maximum allowed = 750 AUSD.
      await expect(
        vault
          .connect(liquidator)
          .liquidate(
            user.address,
            ethers.parseEther("751")
          )
      ).to.be.revert(ethers);
    }
  );

  // ------------------------------------------------
  // LIQUIDATION BONUS
  // ------------------------------------------------

  it(
    "should apply the 5% liquidation bonus",
    async function () {
      const {
        user,
        liquidator,
        vault,
        oracle,
        ausd,
      } = await deploySystem();

      await vault
        .connect(user)
        .depositETH({
          value: ethers.parseEther("1"),
        });

      const debt =
        ethers.parseEther("1500");

      await vault
        .connect(user)
        .borrowAUSD(debt);

      await oracle.setETHPrice(
        ethers.parseUnits("2000", 8)
      );

      const liquidationAmount =
        ethers.parseEther("750");

      const MINTER_ROLE =
        await ausd.MINTER_ROLE();

      await ausd.grantRole(
        MINTER_ROLE,
        liquidator.address
      );

      await ausd
        .connect(liquidator)
        .mint(
          liquidator.address,
          liquidationAmount
        );

      const before =
        await ethers.provider.getBalance(
          liquidator.address
        );

      const tx =
        await vault
          .connect(liquidator)
          .liquidate(
            user.address,
            liquidationAmount
          );

      const receipt =
        await tx.wait();

      const after =
        await ethers.provider.getBalance(
          liquidator.address
        );

      const gasUsed =
        receipt!.gasUsed;

      const gasPrice =
        receipt!.gasPrice;

      const gasCost =
        gasUsed * gasPrice;

      // 750 AUSD × 105% = $787.50
      // At $2,000 ETH = 0.39375 ETH.
      const expectedCollateral =
        ethers.parseEther("0.39375");

      expect(
        after + gasCost - before
      ).to.equal(
        expectedCollateral
      );
    }
  );

  // ------------------------------------------------
  // DEBT ACCOUNTING
  // ------------------------------------------------

  it(
    "should reduce user debt by the liquidation amount",
    async function () {
      const {
        user,
        liquidator,
        vault,
        oracle,
        ausd,
      } = await deploySystem();

      await vault
        .connect(user)
        .depositETH({
          value: ethers.parseEther("1"),
        });

      await vault
        .connect(user)
        .borrowAUSD(
          ethers.parseEther("1500")
        );

      await oracle.setETHPrice(
        ethers.parseUnits("2000", 8)
      );

      const liquidationAmount =
        ethers.parseEther("750");

      const MINTER_ROLE =
        await ausd.MINTER_ROLE();

      await ausd.grantRole(
        MINTER_ROLE,
        liquidator.address
      );

      await ausd
        .connect(liquidator)
        .mint(
          liquidator.address,
          liquidationAmount
        );

      await vault
        .connect(liquidator)
        .liquidate(
          user.address,
          liquidationAmount
        );

      expect(
        await vault.ausdDebt(
          user.address
        )
      ).to.equal(
        ethers.parseEther("750")
      );
    }
  );

  // ------------------------------------------------
  // COLLATERAL ACCOUNTING
  // ------------------------------------------------

  it(
    "should reduce collateral by the seized amount",
    async function () {
      const {
        user,
        liquidator,
        vault,
        oracle,
        ausd,
      } = await deploySystem();

      await vault
        .connect(user)
        .depositETH({
          value: ethers.parseEther("1"),
        });

      await vault
        .connect(user)
        .borrowAUSD(
          ethers.parseEther("1500")
        );

      await oracle.setETHPrice(
        ethers.parseUnits("2000", 8)
      );

      const liquidationAmount =
        ethers.parseEther("750");

      const MINTER_ROLE =
        await ausd.MINTER_ROLE();

      await ausd.grantRole(
        MINTER_ROLE,
        liquidator.address
      );

      await ausd
        .connect(liquidator)
        .mint(
          liquidator.address,
          liquidationAmount
        );

      await vault
        .connect(liquidator)
        .liquidate(
          user.address,
          liquidationAmount
        );

      const remaining =
        await vault.ethCollateral(
          user.address
        );

      expect(remaining).to.equal(
        ethers.parseEther("0.60625")
      );
    }
  );

  // ------------------------------------------------
  // ZERO LIQUIDATION
  // ------------------------------------------------

  it(
    "should reject zero liquidation",
    async function () {
      const {
        user,
        liquidator,
        vault,
      } = await deploySystem();

      await expect(
        vault
          .connect(liquidator)
          .liquidate(
            user.address,
            0
          )
      ).to.be.revert(ethers);
    }
  );

  // ------------------------------------------------
  // INVALID USER
  // ------------------------------------------------

  it(
    "should reject liquidation of the zero address",
    async function () {
      const {
        liquidator,
        vault,
      } = await deploySystem();

      await expect(
        vault
          .connect(liquidator)
          .liquidate(
            ethers.ZeroAddress,
            ethers.parseEther("1")
          )
      ).to.be.revert(ethers);
    }
  );

  // ------------------------------------------------
  // STALE ORACLE
  // ------------------------------------------------

  it(
    "should reject liquidation when the oracle price is stale",
    async function () {
      const {
        user,
        liquidator,
        vault,
        oracle,
        ausd,
      } = await deploySystem();

      await vault
        .connect(user)
        .depositETH({
          value: ethers.parseEther("1"),
        });

      await vault
        .connect(user)
        .borrowAUSD(
          ethers.parseEther("1500")
        );

      await oracle.setETHPrice(
        ethers.parseUnits("2000", 8)
      );

      const MINTER_ROLE =
        await ausd.MINTER_ROLE();

      await ausd.grantRole(
        MINTER_ROLE,
        liquidator.address
      );

      await ausd
        .connect(liquidator)
        .mint(
          liquidator.address,
          ethers.parseEther("750")
        );

      // Use the same max-age configuration
      // already used by the oracle tests.
      const maxAge =
        await oracle.maxPriceAge();

      await ethers.provider.send(
        "evm_increaseTime",
        [Number(maxAge) + 1]
      );

      await ethers.provider.send(
        "evm_mine"
      );

      await expect(
        vault
          .connect(liquidator)
          .liquidate(
            user.address,
            ethers.parseEther("750")
          )
      ).to.be.revert(ethers);
    }
  );
});
