import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.create();

describe("AETRToken V2 Security", function () {
  async function deployAETR() {
    const [
      owner,
      rewardReserve,
      vaultReserve,
      airdropReserve,
      treasuryReserve,
      attacker,
      emissionController,
      recipient,
    ] = await ethers.getSigners();

    const AETR = await ethers.getContractFactory(
      "AETRToken"
    );

    const aetr = await AETR.deploy(
      owner.address,
      rewardReserve.address,
      vaultReserve.address,
      airdropReserve.address,
      treasuryReserve.address
    );

    await aetr.waitForDeployment();

    return {
      aetr,
      owner,
      rewardReserve,
      vaultReserve,
      airdropReserve,
      treasuryReserve,
      attacker,
      emissionController,
      recipient,
    };
  }

  it("should mint exactly 300M AETR initially", async function () {
    const { aetr } = await deployAETR();

    expect(
      await aetr.totalSupply()
    ).to.equal(
      ethers.parseEther("300000000")
    );
  });

  it("should keep maximum supply at 1B AETR", async function () {
    const { aetr } = await deployAETR();

    expect(
      await aetr.MAX_SUPPLY()
    ).to.equal(
      ethers.parseEther("1000000000")
    );
  });

  it("should distribute the initial 300M allocation correctly", async function () {
    const {
      aetr,
      rewardReserve,
      vaultReserve,
      airdropReserve,
      treasuryReserve,
    } = await deployAETR();

    expect(
      await aetr.balanceOf(
        rewardReserve.address
      )
    ).to.equal(
      ethers.parseEther("100000000")
    );

    expect(
      await aetr.balanceOf(
        vaultReserve.address
      )
    ).to.equal(
      ethers.parseEther("100000000")
    );

    expect(
      await aetr.balanceOf(
        airdropReserve.address
      )
    ).to.equal(
      ethers.parseEther("50000000")
    );

    expect(
      await aetr.balanceOf(
        treasuryReserve.address
      )
    ).to.equal(
      ethers.parseEther("50000000")
    );
  });

  it("should reject future emission before controller is assigned", async function () {
    const {
      aetr,
      recipient,
    } = await deployAETR();

    await expect(
      aetr.mintFutureEmission(
        recipient.address,
        ethers.parseEther("1000000")
      )
    ).to.be.revert(ethers);
  });

  it("should allow only the emission controller to mint future supply", async function () {
    const {
      aetr,
      owner,
      emissionController,
      attacker,
      recipient,
    } = await deployAETR();

    await aetr
      .connect(owner)
      .setEmissionController(
        emissionController.address
      );

    await expect(
      aetr
        .connect(attacker)
        .mintFutureEmission(
          recipient.address,
          ethers.parseEther("1000000")
        )
    ).to.be.revert(ethers);

    await aetr
      .connect(emissionController)
      .mintFutureEmission(
        recipient.address,
        ethers.parseEther("1000000")
      );

    expect(
      await aetr.balanceOf(
        recipient.address
      )
    ).to.equal(
      ethers.parseEther("1000000")
    );
  });

  it("should never allow future emissions above 700M", async function () {
    const {
      aetr,
      owner,
      emissionController,
      recipient,
    } = await deployAETR();

    await aetr
      .connect(owner)
      .setEmissionController(
        emissionController.address
      );

    await aetr
      .connect(emissionController)
      .mintFutureEmission(
        recipient.address,
        ethers.parseEther("700000000")
      );

    expect(
      await aetr.totalSupply()
    ).to.equal(
      ethers.parseEther("1000000000")
    );

    expect(
      await aetr.totalFutureMinted()
    ).to.equal(
      ethers.parseEther("700000000")
    );

    await expect(
      aetr
        .connect(emissionController)
        .mintFutureEmission(
          recipient.address,
          1
        )
    ).to.be.revert(ethers);
  });

  it("should reject zero-address future emission", async function () {
    const {
      aetr,
      owner,
      emissionController,
    } = await deployAETR();

    await aetr
      .connect(owner)
      .setEmissionController(
        emissionController.address
      );

    await expect(
      aetr
        .connect(emissionController)
        .mintFutureEmission(
          ethers.ZeroAddress,
          ethers.parseEther("1")
        )
    ).to.be.revert(ethers);
  });

  it("should reject zero-value future emission", async function () {
    const {
      aetr,
      owner,
      emissionController,
      recipient,
    } = await deployAETR();

    await aetr
      .connect(owner)
      .setEmissionController(
        emissionController.address
      );

    await expect(
      aetr
        .connect(emissionController)
        .mintFutureEmission(
          recipient.address,
          0
        )
    ).to.be.revert(ethers);
  });

  it("should allow holders to burn their own AETR", async function () {
    const {
      aetr,
      rewardReserve,
    } = await deployAETR();

    await aetr
      .connect(rewardReserve)
      .burn(
        ethers.parseEther("100")
      );

    expect(
      await aetr.balanceOf(
        rewardReserve.address
      )
    ).to.equal(
      ethers.parseEther("99999900")
    );
  });
});
