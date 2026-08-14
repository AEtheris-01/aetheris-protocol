import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.create();

describe("AUSDStablecoin V2 Security", function () {
  async function deployAUSD() {
    const [admin, minter, burner, user] =
      await ethers.getSigners();

    const AUSD = await ethers.getContractFactory(
      "AUSDStablecoin"
    );

    const adminDelay = 24 * 60 * 60;

    const ausd = await AUSD.deploy(
      admin.address,
      adminDelay
    );

    await ausd.waitForDeployment();

    return {
      ausd,
      admin,
      minter,
      burner,
      user,
    };
  }

  it("should assign DEFAULT_ADMIN_ROLE to the initial admin", async function () {
    const { ausd, admin } =
      await deployAUSD();

    const role =
      await ausd.DEFAULT_ADMIN_ROLE();

    expect(
      await ausd.hasRole(
        role,
        admin.address
      )
    ).to.equal(true);
  });

  it("should reject minting from an unauthorized account", async function () {
    const { ausd, user } =
      await deployAUSD();

    await expect(
      ausd.connect(user).mint(
        user.address,
        ethers.parseEther("100")
      )
    ).to.be.revert(ethers);
  });

  it("should allow an authorized minter to mint", async function () {
    const {
      ausd,
      admin,
      minter,
      user,
    } = await deployAUSD();

    const MINTER_ROLE =
      await ausd.MINTER_ROLE();

    await ausd
      .connect(admin)
      .grantRole(
        MINTER_ROLE,
        minter.address
      );

    await ausd
      .connect(minter)
      .mint(
        user.address,
        ethers.parseEther("100")
      );

    expect(
      await ausd.balanceOf(user.address)
    ).to.equal(
      ethers.parseEther("100")
    );
  });

  it("should reject minting after minter role is revoked", async function () {
    const {
      ausd,
      admin,
      minter,
      user,
    } = await deployAUSD();

    const MINTER_ROLE =
      await ausd.MINTER_ROLE();

    await ausd
      .connect(admin)
      .grantRole(
        MINTER_ROLE,
        minter.address
      );

    await ausd
      .connect(admin)
      .revokeRole(
        MINTER_ROLE,
        minter.address
      );

    await expect(
      ausd.connect(minter).mint(
        user.address,
        ethers.parseEther("100")
      )
    ).to.be.revert(ethers);
  });

  it("should allow an authorized burner to burn", async function () {
    const {
      ausd,
      admin,
      minter,
      burner,
      user,
    } = await deployAUSD();

    const MINTER_ROLE =
      await ausd.MINTER_ROLE();

    const BURNER_ROLE =
      await ausd.BURNER_ROLE();

    await ausd
      .connect(admin)
      .grantRole(
        MINTER_ROLE,
        minter.address
      );

    await ausd
      .connect(admin)
      .grantRole(
        BURNER_ROLE,
        burner.address
      );

    const amount =
      ethers.parseEther("100");

    await ausd
      .connect(minter)
      .mint(
        user.address,
        amount
      );

    await ausd
      .connect(burner)
      .burn(
        user.address,
        ethers.parseEther("40")
      );

    expect(
      await ausd.balanceOf(user.address)
    ).to.equal(
      ethers.parseEther("60")
    );
  });

  it("should reject burning from an unauthorized account", async function () {
    const {
      ausd,
      admin,
      minter,
      user,
    } = await deployAUSD();

    const MINTER_ROLE =
      await ausd.MINTER_ROLE();

    await ausd
      .connect(admin)
      .grantRole(
        MINTER_ROLE,
        minter.address
      );

    await ausd
      .connect(minter)
      .mint(
        user.address,
        ethers.parseEther("100")
      );

    await expect(
      ausd.connect(user).burn(
        user.address,
        ethers.parseEther("50")
      )
    ).to.be.revert(ethers);
  });

  it("should reject zero-address mint", async function () {
    const {
      ausd,
      admin,
      minter,
    } = await deployAUSD();

    const MINTER_ROLE =
      await ausd.MINTER_ROLE();

    await ausd
      .connect(admin)
      .grantRole(
        MINTER_ROLE,
        minter.address
      );

    await expect(
      ausd.connect(minter).mint(
        ethers.ZeroAddress,
        ethers.parseEther("100")
      )
    ).to.be.revertedWith(
      "Invalid recipient"
    );
  });

  it("should reject zero-value mint", async function () {
    const {
      ausd,
      admin,
      minter,
      user,
    } = await deployAUSD();

    const MINTER_ROLE =
      await ausd.MINTER_ROLE();

    await ausd
      .connect(admin)
      .grantRole(
        MINTER_ROLE,
        minter.address
      );

    await expect(
      ausd.connect(minter).mint(
        user.address,
        0
      )
    ).to.be.revertedWith(
      "Zero mint"
    );
  });

  it("should reject zero-value burn", async function () {
    const {
      ausd,
      admin,
      burner,
      user,
    } = await deployAUSD();

    const BURNER_ROLE =
      await ausd.BURNER_ROLE();

    await ausd
      .connect(admin)
      .grantRole(
        BURNER_ROLE,
        burner.address
      );

    await expect(
      ausd.connect(burner).burn(
        user.address,
        0
      )
    ).to.be.revertedWith(
      "Zero burn"
    );
  });
});
