import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.create();

describe("Treasury V2 Security", function () {
  async function deployTreasury() {
    const [
      owner,
      coldWallet,
      attacker,
      user,
    ] = await ethers.getSigners();

    const Treasury =
      await ethers.getContractFactory(
        "Treasury"
      );

    const treasury =
      await Treasury.deploy(
        owner.address,
        coldWallet.address
      );

    await treasury.waitForDeployment();

    return {
      owner,
      coldWallet,
      attacker,
      user,
      treasury,
    };
  }

  // ------------------------------------------------
  // DEPLOYMENT
  // ------------------------------------------------

  it(
    "should deploy with the correct owner and cold wallet",
    async function () {
      const {
        owner,
        coldWallet,
        treasury,
      } = await deployTreasury();

      expect(
        await treasury.owner()
      ).to.equal(
        owner.address
      );

      expect(
        await treasury.coldWallet()
      ).to.equal(
        coldWallet.address
      );
    }
  );

  // ------------------------------------------------
  // IMMUTABLE COLD WALLET
  // ------------------------------------------------

  it(
    "should keep the cold wallet fixed",
    async function () {
      const {
        coldWallet,
        treasury,
      } = await deployTreasury();

      expect(
        await treasury.coldWallet()
      ).to.equal(
        coldWallet.address
      );
    }
  );

  // ------------------------------------------------
  // RECEIVE ETH
  // ------------------------------------------------

  it(
    "should accept ETH",
    async function () {
      const {
        user,
        treasury,
      } = await deployTreasury();

      const amount =
        ethers.parseEther("1");

      await user.sendTransaction({
        to: await treasury.getAddress(),
        value: amount,
      });

      expect(
        await treasury.ethBalance()
      ).to.equal(amount);
    }
  );

  // ------------------------------------------------
  // ETH WITHDRAWAL
  // ------------------------------------------------

  it(
    "should allow the owner to withdraw ETH to the cold wallet",
    async function () {
      const {
        owner,
        coldWallet,
        treasury,
      } = await deployTreasury();

      const amount =
        ethers.parseEther("1");

      await owner.sendTransaction({
        to: await treasury.getAddress(),
        value: amount,
      });

      const before =
        await ethers.provider.getBalance(
          coldWallet.address
        );

      await treasury
        .connect(owner)
        .withdrawETH(amount);

      const after =
        await ethers.provider.getBalance(
          coldWallet.address
        );

      expect(
        after - before
      ).to.equal(amount);

      expect(
        await treasury.ethBalance()
      ).to.equal(0);
    }
  );

  // ------------------------------------------------
  // ARBITRARY DESTINATION ATTACK
  // ------------------------------------------------

  it(
    "should not allow withdrawal to an arbitrary attacker address",
    async function () {
      const {
        owner,
        attacker,
        treasury,
      } = await deployTreasury();

      await owner.sendTransaction({
        to: await treasury.getAddress(),
        value: ethers.parseEther("1"),
      });

      // V2 has no destination parameter.
      // The only possible destination is
      // the immutable cold wallet.

      const attackerBefore =
        await ethers.provider.getBalance(
          attacker.address
        );

      await treasury
        .connect(owner)
        .withdrawETH(
          ethers.parseEther("1")
        );

      const attackerAfter =
        await ethers.provider.getBalance(
          attacker.address
        );

      expect(
        attackerAfter
      ).to.equal(
        attackerBefore
      );
    }
  );

  // ------------------------------------------------
  // UNAUTHORIZED ETH WITHDRAWAL
  // ------------------------------------------------

  it(
    "should reject ETH withdrawal from an attacker",
    async function () {
      const {
        owner,
        attacker,
        treasury,
      } = await deployTreasury();

      await owner.sendTransaction({
        to: await treasury.getAddress(),
        value: ethers.parseEther("1"),
      });

      await expect(
        treasury
          .connect(attacker)
          .withdrawETH(
            ethers.parseEther("1")
          )
      ).to.be.revert(ethers);
    }
  );

  // ------------------------------------------------
  // ZERO ETH WITHDRAWAL
  // ------------------------------------------------

  it(
    "should reject zero ETH withdrawal",
    async function () {
      const {
        owner,
        treasury,
      } = await deployTreasury();

      await expect(
        treasury
          .connect(owner)
          .withdrawETH(0)
      ).to.be.revert(ethers);
    }
  );

  // ------------------------------------------------
  // INSUFFICIENT ETH
  // ------------------------------------------------

  it(
    "should reject ETH withdrawal above balance",
    async function () {
      const {
        owner,
        treasury,
      } = await deployTreasury();

      await expect(
        treasury
          .connect(owner)
          .withdrawETH(
            ethers.parseEther("1")
          )
      ).to.be.revert(ethers);
    }
  );

  // ------------------------------------------------
  // ERC20 WITHDRAWAL
  // ------------------------------------------------

  it(
    "should withdraw ERC20 only to the cold wallet",
    async function () {
      const {
        owner,
        coldWallet,
        treasury,
      } = await deployTreasury();

      const Token =
        await ethers.getContractFactory(
          "AETRToken"
        );

      const token =
        await Token.deploy(
          owner.address,
          owner.address,
          owner.address,
          owner.address,
          owner.address
        );

      await token.waitForDeployment();

      const amount =
        ethers.parseEther("100");

      await token.transfer(
        await treasury.getAddress(),
        amount
      );

      const before =
        await token.balanceOf(
          coldWallet.address
        );

      await treasury
        .connect(owner)
        .withdrawToken(
          await token.getAddress(),
          amount
        );

      const after =
        await token.balanceOf(
          coldWallet.address
        );

      expect(
        after - before
      ).to.equal(amount);
    }
  );

  // ------------------------------------------------
  // ZERO TOKEN ADDRESS
  // ------------------------------------------------

  it(
    "should reject zero token address",
    async function () {
      const {
        owner,
        treasury,
      } = await deployTreasury();

      await expect(
        treasury
          .connect(owner)
          .withdrawToken(
            ethers.ZeroAddress,
            ethers.parseEther("1")
          )
      ).to.be.revert(ethers);
    }
  );

  // ------------------------------------------------
  // ZERO TOKEN WITHDRAWAL
  // ------------------------------------------------

  it(
    "should reject zero token withdrawal",
    async function () {
      const {
        owner,
        treasury,
      } = await deployTreasury();

      const Token =
        await ethers.getContractFactory(
          "AETRToken"
        );

      const token =
        await Token.deploy(
          owner.address,
          owner.address,
          owner.address,
          owner.address,
          owner.address
        );

      await token.waitForDeployment();

      await expect(
        treasury
          .connect(owner)
          .withdrawToken(
            await token.getAddress(),
            0
          )
      ).to.be.revert(ethers);
    }
  );

  // ------------------------------------------------
  // UNAUTHORIZED TOKEN WITHDRAWAL
  // ------------------------------------------------

  it(
    "should reject ERC20 withdrawal from an attacker",
    async function () {
      const {
        owner,
        attacker,
        treasury,
      } = await deployTreasury();

      const Token =
        await ethers.getContractFactory(
          "AETRToken"
        );

      const token =
        await Token.deploy(
          owner.address,
          owner.address,
          owner.address,
          owner.address,
          owner.address
        );

      await token.waitForDeployment();

      const amount =
        ethers.parseEther("100");

      await token.transfer(
        await treasury.getAddress(),
        amount
      );

      await expect(
        treasury
          .connect(attacker)
          .withdrawToken(
            await token.getAddress(),
            amount
          )
      ).to.be.revert(ethers);
    }
  );
});
