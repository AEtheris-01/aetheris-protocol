import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.create();

describe("PriceOracle V2 Security", function () {
  async function deployOracle() {
    const [
      owner,
      updater,
      attacker,
    ] = await ethers.getSigners();

    const Oracle = await ethers.getContractFactory(
      "PriceOracle"
    );

    const oracle = await Oracle.deploy(
      owner.address
    );

    await oracle.waitForDeployment();

    return {
      oracle,
      owner,
      updater,
      attacker,
    };
  }

  it("should assign the initial owner as price updater", async function () {
    const {
      oracle,
      owner,
    } = await deployOracle();

    expect(
      await oracle.owner()
    ).to.equal(owner.address);

    expect(
      await oracle.priceUpdater()
    ).to.equal(owner.address);
  });

  it("should allow the updater to set ETH price", async function () {
    const { oracle } = await deployOracle();

    const price =
      ethers.parseUnits("3000", 8);

    await oracle.setETHPrice(price);

    expect(
      await oracle.getETHPrice()
    ).to.equal(price);
  });

  it("should allow the updater to set BTC price", async function () {
    const { oracle } = await deployOracle();

    const price =
      ethers.parseUnits("100000", 8);

    await oracle.setBTCPrice(price);

    expect(
      await oracle.getBTCPrice()
    ).to.equal(price);
  });

  it("should allow the updater to set AETR price", async function () {
    const { oracle } = await deployOracle();

    const price =
      ethers.parseUnits("1", 8);

    await oracle.setAETRPrice(price);

    expect(
      await oracle.getAETRPrice()
    ).to.equal(price);
  });

  it("should reject unauthorized price updates", async function () {
    const {
      oracle,
      attacker,
    } = await deployOracle();

    await expect(
      oracle
        .connect(attacker)
        .setETHPrice(
          ethers.parseUnits("999999", 8)
        )
    ).to.be.revert(ethers);

    await expect(
      oracle
        .connect(attacker)
        .setBTCPrice(
          ethers.parseUnits("999999", 8)
        )
    ).to.be.revert(ethers);

    await expect(
      oracle
        .connect(attacker)
        .setAETRPrice(
          ethers.parseUnits("999999", 8)
        )
    ).to.be.revert(ethers);
  });

  it("should reject zero ETH price", async function () {
    const { oracle } = await deployOracle();

    await expect(
      oracle.setETHPrice(0)
    ).to.be.revert(ethers);
  });

  it("should reject zero BTC price", async function () {
    const { oracle } = await deployOracle();

    await expect(
      oracle.setBTCPrice(0)
    ).to.be.revert(ethers);
  });

  it("should reject zero AETR price", async function () {
    const { oracle } = await deployOracle();

    await expect(
      oracle.setAETRPrice(0)
    ).to.be.revert(ethers);
  });

  it("should allow the owner to change the price updater", async function () {
    const {
      oracle,
      owner,
      updater,
    } = await deployOracle();

    await oracle
      .connect(owner)
      .setPriceUpdater(
        updater.address
      );

    expect(
      await oracle.priceUpdater()
    ).to.equal(updater.address);
  });

  it("should allow the new updater to update prices", async function () {
    const {
      oracle,
      owner,
      updater,
    } = await deployOracle();

    await oracle
      .connect(owner)
      .setPriceUpdater(
        updater.address
      );

    const price =
      ethers.parseUnits("3200", 8);

    await oracle
      .connect(updater)
      .setETHPrice(price);

    expect(
      await oracle.getETHPrice()
    ).to.equal(price);
  });

  it("should reject the old updater after updater is changed", async function () {
    const {
      oracle,
      owner,
    } = await deployOracle();

    const [
      ,
      updater,
    ] = await ethers.getSigners();

    await oracle
      .connect(owner)
      .setPriceUpdater(
        updater.address
      );

    await expect(
      oracle
        .connect(owner)
        .setETHPrice(
          ethers.parseUnits("4000", 8)
        )
    ).to.be.revert(ethers);
  });

  it("should report a fresh price correctly", async function () {
    const { oracle } = await deployOracle();

    await oracle.setETHPrice(
      ethers.parseUnits("3000", 8)
    );

    const [
      price,
      updatedAt,
    ] = await oracle.getETHPriceData();

    expect(price).to.equal(
      ethers.parseUnits("3000", 8)
    );

    expect(
      await oracle.isFresh(updatedAt)
    ).to.equal(true);
  });

  it("should reject a stale price", async function () {
    const { oracle } = await deployOracle();

    await oracle.setETHPrice(
      ethers.parseUnits("3000", 8)
    );

    await ethers.provider.send(
      "evm_increaseTime",
      [3601]
    );

    await ethers.provider.send(
      "evm_mine"
    );

    await expect(
      oracle.getETHPrice()
    ).to.be.revert(ethers);
  });

  it("should allow the owner to pause the oracle", async function () {
    const {
      oracle,
      owner,
    } = await deployOracle();

    await oracle
      .connect(owner)
      .pause();

    expect(
      await oracle.paused()
    ).to.equal(true);
  });

  it("should reject price updates while paused", async function () {
    const {
      oracle,
      owner,
    } = await deployOracle();

    await oracle
      .connect(owner)
      .pause();

    await expect(
      oracle.setETHPrice(
        ethers.parseUnits("3000", 8)
      )
    ).to.be.revert(ethers);
  });

  it("should reject price reads while paused", async function () {
    const {
      oracle,
      owner,
    } = await deployOracle();

    await oracle.setETHPrice(
      ethers.parseUnits("3000", 8)
    );

    await oracle
      .connect(owner)
      .pause();

    await expect(
      oracle.getETHPrice()
    ).to.be.revert(ethers);
  });

  it("should allow the owner to unpause the oracle", async function () {
    const {
      oracle,
      owner,
    } = await deployOracle();

    await oracle
      .connect(owner)
      .pause();

    await oracle
      .connect(owner)
      .unpause();

    expect(
      await oracle.paused()
    ).to.equal(false);
  });

  it("should reject an invalid zero address updater", async function () {
    const { oracle } = await deployOracle();

    await expect(
      oracle.setPriceUpdater(
        ethers.ZeroAddress
      )
    ).to.be.revert(ethers);
  });

  it("should allow max price age within limits", async function () {
    const { oracle } = await deployOracle();

    await oracle.setMaxPriceAge(
      2 * 60 * 60
    );

    expect(
      await oracle.maxPriceAge()
    ).to.equal(
      2 * 60 * 60
    );
  });

  it("should reject an excessively short price age", async function () {
    const { oracle } = await deployOracle();

    await expect(
      oracle.setMaxPriceAge(
        60
      )
    ).to.be.revert(ethers);
  });

  it("should reject an excessively long price age", async function () {
    const { oracle } = await deployOracle();

    await expect(
      oracle.setMaxPriceAge(
        24 * 60 * 60 + 1
      )
    ).to.be.revert(ethers);
  });
});
