import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.create();

describe("Vault V2 Security", function () {
  async function deploySystem() {
    const [
      admin,
      user,
      attacker,
      user2,
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

    await oracle.setETHPrice(
      ethers.parseUnits(
        "3000",
        8
      )
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
      attacker,
      user2,
      ausd,
      oracle,
      vault,
    };
  }

  // ------------------------------------------------
  // DEPLOYMENT
  // ------------------------------------------------

  it(
    "should deploy with correct references",
    async function () {
      const {
        admin,
        ausd,
        oracle,
        vault,
      } = await deploySystem();

      expect(
        await vault.owner()
      ).to.equal(
        admin.address
      );

      expect(
        await vault.ausd()
      ).to.equal(
        await ausd.getAddress()
      );

      expect(
        await vault.priceOracle()
      ).to.equal(
        await oracle.getAddress()
      );
    }
  );

  // ------------------------------------------------
  // ETH DEPOSIT
  // ------------------------------------------------

  it(
    "should accept ETH deposits",
    async function () {
      const {
        user,
        vault,
      } = await deploySystem();

      const amount =
        ethers.parseEther("1");

      await vault
        .connect(user)
        .depositETH({
          value: amount,
        });

      expect(
        await vault.ethCollateral(
          user.address
        )
      ).to.equal(amount);

      expect(
        await vault.totalETHCollateral()
      ).to.equal(amount);
    }
  );

  it(
    "should reject zero ETH deposits",
    async function () {
      const {
        user,
        vault,
      } = await deploySystem();

      await expect(
        vault
          .connect(user)
          .depositETH({
            value: 0,
          })
      ).to.be.revert(ethers);
    }
  );

  // ------------------------------------------------
  // BORROW LIMIT
  // ------------------------------------------------

  it(
    "should calculate 66% maximum LTV",
    async function () {
      const {
        user,
        vault,
      } = await deploySystem();

      await vault
        .connect(user)
        .depositETH({
          value: ethers.parseEther("1"),
        });

      const maxDebt =
        await vault.maximumDebt(
          user.address
        );

      expect(maxDebt).to.equal(
        ethers.parseEther("1980")
      );
    }
  );

  it(
    "should allow borrowing within LTV",
    async function () {
      const {
        user,
        vault,
        ausd,
      } = await deploySystem();

      await vault
        .connect(user)
        .depositETH({
          value: ethers.parseEther("1"),
        });

      const amount =
        ethers.parseEther("1000");

      await vault
        .connect(user)
        .borrowAUSD(
          amount
        );

      expect(
        await ausd.balanceOf(
          user.address
        )
      ).to.equal(amount);

      expect(
        await vault.ausdDebt(
          user.address
        )
      ).to.equal(amount);
    }
  );

  it(
    "should reject borrowing above maximum LTV",
    async function () {
      const {
        user,
        vault,
      } = await deploySystem();

      await vault
        .connect(user)
        .depositETH({
          value: ethers.parseEther("1"),
        });

      await expect(
        vault
          .connect(user)
          .borrowAUSD(
            ethers.parseEther("1980.01")
          )
      ).to.be.revert(ethers);
    }
  );

  // ------------------------------------------------
  // UNAUTHORIZED BORROW
  // ------------------------------------------------

  it(
    "should not allow an attacker to borrow against another user's collateral",
    async function () {
      const {
        user,
        attacker,
        vault,
      } = await deploySystem();

      await vault
        .connect(user)
        .depositETH({
          value: ethers.parseEther("10"),
        });

      await expect(
        vault
          .connect(attacker)
          .borrowAUSD(
            ethers.parseEther("1000")
          )
      ).to.be.revert(ethers);
    }
  );

  // ------------------------------------------------
  // REPAYMENT
  // ------------------------------------------------

  it(
    "should repay AUSD debt",
    async function () {
      const {
        user,
        vault,
      } = await deploySystem();

      await vault
        .connect(user)
        .depositETH({
          value: ethers.parseEther("1"),
        });

      const amount =
        ethers.parseEther("1000");

      await vault
        .connect(user)
        .borrowAUSD(
          amount
        );

      await vault
        .connect(user)
        .repayAUSD(
          amount
        );

      expect(
        await vault.ausdDebt(
          user.address
        )
      ).to.equal(0);

      expect(
        await vault.totalAUSDDebt()
      ).to.equal(0);
    }
  );

  // ------------------------------------------------
  // WITHDRAWAL
  // ------------------------------------------------

  it(
    "should allow full withdrawal when debt is zero",
    async function () {
      const {
        user,
        vault,
      } = await deploySystem();

      const amount =
        ethers.parseEther("1");

      await vault
        .connect(user)
        .depositETH({
          value: amount,
        });

      await vault
        .connect(user)
        .withdrawETH(
          amount
        );

      expect(
        await vault.ethCollateral(
          user.address
        )
      ).to.equal(0);

      expect(
        await vault.totalETHCollateral()
      ).to.equal(0);
    }
  );

  it(
    "should reject unsafe collateral withdrawal",
    async function () {
      const {
        user,
        vault,
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

      await expect(
        vault
          .connect(user)
          .withdrawETH(
            ethers.parseEther("0.3")
          )
      ).to.be.revert(ethers);
    }
  );

  // ------------------------------------------------
  // PAUSE
  // ------------------------------------------------

  it(
    "should allow owner to pause",
    async function () {
      const {
        admin,
        vault,
      } = await deploySystem();

      await vault
        .connect(admin)
        .pause();

      expect(
        await vault.paused()
      ).to.equal(true);
    }
  );

  it(
    "should reject deposits while paused",
    async function () {
      const {
        admin,
        user,
        vault,
      } = await deploySystem();

      await vault
        .connect(admin)
        .pause();

      await expect(
        vault
          .connect(user)
          .depositETH({
            value:
              ethers.parseEther("1"),
          })
      ).to.be.revert(ethers);
    }
  );

  it(
    "should reject borrowing while paused",
    async function () {
      const {
        admin,
        user,
        vault,
      } = await deploySystem();

      await vault
        .connect(user)
        .depositETH({
          value:
            ethers.parseEther("1"),
        });

      await vault
        .connect(admin)
        .pause();

      await expect(
        vault
          .connect(user)
          .borrowAUSD(
            ethers.parseEther("100")
          )
      ).to.be.revert(ethers);
    }
  );

  it(
    "should reject withdrawals while paused",
    async function () {
      const {
        admin,
        user,
        vault,
      } = await deploySystem();

      await vault
        .connect(user)
        .depositETH({
          value:
            ethers.parseEther("1"),
        });

      await vault
        .connect(admin)
        .pause();

      await expect(
        vault
          .connect(user)
          .withdrawETH(
            ethers.parseEther("0.1")
          )
      ).to.be.revert(ethers);
    }
  );

  // ------------------------------------------------
  // ORACLE STALENESS
  // ------------------------------------------------

  it(
    "should reject borrowing when the oracle price is stale",
    async function () {
      const {
        user,
        vault,
        oracle,
      } = await deploySystem();

      await vault
        .connect(user)
        .depositETH({
          value:
            ethers.parseEther("1"),
        });

      await ethers.provider.send(
        "evm_increaseTime",
        [3601]
      );

      await ethers.provider.send(
        "evm_mine"
      );

      await expect(
        vault
          .connect(user)
          .borrowAUSD(
            ethers.parseEther("100")
          )
      ).to.be.revert(ethers);
    }
  );

  // ------------------------------------------------
  // REPAY BOUNDARY
  // ------------------------------------------------

  it(
    "should reject repayment above debt",
    async function () {
      const {
        user,
        vault,
      } = await deploySystem();

      await vault
        .connect(user)
        .depositETH({
          value:
            ethers.parseEther("1"),
        });

      await vault
        .connect(user)
        .borrowAUSD(
          ethers.parseEther("500")
        );

      await expect(
        vault
          .connect(user)
          .repayAUSD(
            ethers.parseEther("501")
          )
      ).to.be.revert(ethers);
    }
  );

  // ------------------------------------------------
  // ZERO VALUES
  // ------------------------------------------------

  it(
    "should reject zero borrowing",
    async function () {
      const {
        user,
        vault,
      } = await deploySystem();

      await vault
        .connect(user)
        .depositETH({
          value:
            ethers.parseEther("1"),
        });

      await expect(
        vault
          .connect(user)
          .borrowAUSD(0)
      ).to.be.revert(ethers);
    }
  );

  it(
    "should reject zero repayment",
    async function () {
      const {
        user,
        vault,
      } = await deploySystem();

      await expect(
        vault
          .connect(user)
          .repayAUSD(0)
      ).to.be.revert(ethers);
    }
  );

  it(
    "should reject zero withdrawal",
    async function () {
      const {
        user,
        vault,
      } = await deploySystem();

      await expect(
        vault
          .connect(user)
          .withdrawETH(0)
      ).to.be.revert(ethers);
    }
  );

  // ------------------------------------------------
  // HEALTH
  // ------------------------------------------------

  it(
    "should report a debt-free position as healthy",
    async function () {
      const {
        user,
        vault,
      } = await deploySystem();

      expect(
        await vault.isHealthy(
          user.address
        )
      ).to.equal(true);
    }
  );

  it(
    "should report a properly collateralized position as healthy",
    async function () {
      const {
        user,
        vault,
      } = await deploySystem();

      await vault
        .connect(user)
        .depositETH({
          value:
            ethers.parseEther("1"),
        });

      await vault
        .connect(user)
        .borrowAUSD(
          ethers.parseEther("1000")
        );

      expect(
        await vault.isHealthy(
          user.address
        )
      ).to.equal(true);
    }
  );
});
