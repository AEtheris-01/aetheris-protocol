import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.create();

describe("ProtocolFeeRouter V2 Security", function () {
  async function deploySystem() {
    const [
      owner,
      payer,
      treasury,
      attacker,
    ] = await ethers.getSigners();

    // ---------------------------------------------
    // AUSD
    // ---------------------------------------------

    const AUSD =
      await ethers.getContractFactory(
        "AUSDStablecoin"
      );

    const ausd =
      await AUSD.deploy(
        owner.address,
        0
      );

    await ausd.waitForDeployment();

    // ---------------------------------------------
    // AETR
    // ---------------------------------------------

    const AETR =
      await ethers.getContractFactory(
        "AETRToken"
      );

    const aetr =
      await AETR.deploy(
        owner.address,
        owner.address,
        owner.address,
        owner.address,
        owner.address
      );

    await aetr.waitForDeployment();

    // ---------------------------------------------
    // FEE ROUTER
    // ---------------------------------------------

    const Router =
      await ethers.getContractFactory(
        "ProtocolFeeRouter"
      );

    const router =
      await Router.deploy(
        owner.address,
        await ausd.getAddress(),
        await aetr.getAddress(),
        treasury.address
      );

    await router.waitForDeployment();

    // ---------------------------------------------
    // FEE COLLECTOR
    // ---------------------------------------------

    // Owner acts as fee collector in this
    // isolated Router test environment.
    await router.setFeeCollector(
      owner.address
    );

    // ---------------------------------------------
    // AUSD MINTER
    // ---------------------------------------------

    const MINTER_ROLE =
      await ausd.MINTER_ROLE();

    await ausd.grantRole(
      MINTER_ROLE,
      owner.address
    );

    // Give payer enough AUSD.
    await ausd.mint(
      payer.address,
      ethers.parseEther("1000")
    );

    return {
      owner,
      payer,
      treasury,
      attacker,
      ausd,
      aetr,
      router,
    };
  }

  // ---------------------------------------------
  // HELPER
  // ---------------------------------------------

  async function fundRouter(
    payer: any,
    router: any,
    ausd: any,
    amount: bigint
  ) {
    await ausd
      .connect(payer)
      .transfer(
        await router.getAddress(),
        amount
      );
  }

  // ---------------------------------------------
  // DEPLOYMENT
  // ---------------------------------------------

  it(
    "should deploy with correct references",
    async function () {
      const {
        owner,
        treasury,
        ausd,
        aetr,
        router,
      } = await deploySystem();

      expect(
        await router.owner()
      ).to.equal(
        owner.address
      );

      expect(
        await router.ausd()
      ).to.equal(
        await ausd.getAddress()
      );

      expect(
        await router.aetr()
      ).to.equal(
        await aetr.getAddress()
      );

      expect(
        await router.treasury()
      ).to.equal(
        treasury.address
      );

      expect(
        await router.feeCollector()
      ).to.equal(
        owner.address
      );
    }
  );

  // ---------------------------------------------
  // FEE CALCULATION
  // ---------------------------------------------

  it(
    "should calculate a 1% total protocol fee",
    async function () {
      const {
        router,
      } = await deploySystem();

      const [
        totalFee,
        aetrAllocation,
        btcAllocation,
      ] =
        await router.calculateFee(
          ethers.parseEther("1000")
        );

      expect(
        totalFee
      ).to.equal(
        ethers.parseEther("10")
      );

      expect(
        aetrAllocation
      ).to.equal(
        ethers.parseEther("5")
      );

      expect(
        btcAllocation
      ).to.equal(
        ethers.parseEther("5")
      );
    }
  );

  // ---------------------------------------------
  // FEE RECEIPT
  // ---------------------------------------------

  it(
    "should receive the calculated protocol fee",
    async function () {
      const {
        owner,
        payer,
        ausd,
        router,
      } = await deploySystem();

      const amount =
        ethers.parseEther("1000");

      const fee =
        ethers.parseEther("10");

      // Move the actual fee into the Router.
      await fundRouter(
        payer,
        router,
        ausd,
        fee
      );

      expect(
        await ausd.balanceOf(
          await router.getAddress()
        )
      ).to.equal(
        fee
      );

      await router
        .connect(owner)
        .receiveFee(
          payer.address,
          amount
        );

      expect(
        await ausd.balanceOf(
          await router.getAddress()
        )
      ).to.equal(
        fee
      );

      expect(
        await router.totalFeesReceived()
      ).to.equal(
        fee
      );
    }
  );

  // ---------------------------------------------
  // AETR ALLOCATION
  // ---------------------------------------------

  it(
    "should record the 0.5% AETR allocation",
    async function () {
      const {
        owner,
        payer,
        ausd,
        router,
      } = await deploySystem();

      const amount =
        ethers.parseEther("1000");

      const fee =
        ethers.parseEther("10");

      await fundRouter(
        payer,
        router,
        ausd,
        fee
      );

      await router
        .connect(owner)
        .receiveFee(
          payer.address,
          amount
        );

      expect(
        await router.totalAETRAllocation()
      ).to.equal(
        ethers.parseEther("5")
      );
    }
  );

  // ---------------------------------------------
  // BTC ALLOCATION
  // ---------------------------------------------

  it(
    "should record the 0.5% BTC allocation",
    async function () {
      const {
        owner,
        payer,
        ausd,
        router,
      } = await deploySystem();

      const amount =
        ethers.parseEther("1000");

      const fee =
        ethers.parseEther("10");

      await fundRouter(
        payer,
        router,
        ausd,
        fee
      );

      await router
        .connect(owner)
        .receiveFee(
          payer.address,
          amount
        );

      expect(
        await router.totalBTCAllocation()
      ).to.equal(
        ethers.parseEther("5")
      );
    }
  );

  // ---------------------------------------------
  // ONLY FEE COLLECTOR
  // ---------------------------------------------

  it(
    "should reject fee collection by an attacker",
    async function () {
      const {
        payer,
        attacker,
        ausd,
        router,
      } = await deploySystem();

      const amount =
        ethers.parseEther("1000");

      const fee =
        ethers.parseEther("10");

      await fundRouter(
        payer,
        router,
        ausd,
        fee
      );

      await expect(
        router
          .connect(attacker)
          .receiveFee(
            payer.address,
            amount
          )
      ).to.be.revert(ethers);
    }
  );

  // ---------------------------------------------
  // ZERO AMOUNT
  // ---------------------------------------------

  it(
    "should reject zero fee amount",
    async function () {
      const {
        owner,
        payer,
        router,
      } = await deploySystem();

      await expect(
        router
          .connect(owner)
          .receiveFee(
            payer.address,
            0
          )
      ).to.be.revert(ethers);
    }
  );

  // ---------------------------------------------
  // ZERO PAYER
  // ---------------------------------------------

  it(
    "should reject zero payer",
    async function () {
      const {
        owner,
        router,
      } = await deploySystem();

      await expect(
        router
          .connect(owner)
          .receiveFee(
            ethers.ZeroAddress,
            ethers.parseEther("1000")
          )
      ).to.be.revert(ethers);
    }
  );

  // ---------------------------------------------
  // PAUSE
  // ---------------------------------------------

  it(
    "should reject fee collection while paused",
    async function () {
      const {
        owner,
        payer,
        ausd,
        router,
      } = await deploySystem();

      const amount =
        ethers.parseEther("1000");

      const fee =
        ethers.parseEther("10");

      await fundRouter(
        payer,
        router,
        ausd,
        fee
      );

      await router
        .connect(owner)
        .pause();

      await expect(
        router
          .connect(owner)
          .receiveFee(
            payer.address,
            amount
          )
      ).to.be.revert(ethers);
    }
  );

  // ---------------------------------------------
  // TREASURY UPDATE
  // ---------------------------------------------

  it(
    "should allow the owner to update the treasury",
    async function () {
      const {
        owner,
        router,
        attacker,
      } = await deploySystem();

      await router
        .connect(owner)
        .setTreasury(
          attacker.address
        );

      expect(
        await router.treasury()
      ).to.equal(
        attacker.address
      );
    }
  );

  // ---------------------------------------------
  // ZERO TREASURY
  // ---------------------------------------------

  it(
    "should reject zero treasury",
    async function () {
      const {
        owner,
        router,
      } = await deploySystem();

      await expect(
        router
          .connect(owner)
          .setTreasury(
            ethers.ZeroAddress
          )
      ).to.be.revert(ethers);
    }
  );

  // ---------------------------------------------
  // BTC ALLOCATION LIMIT
  // ---------------------------------------------

  it(
    "should not allow BTC allocation above accounting balance",
    async function () {
      const {
        owner,
        router,
      } = await deploySystem();

      await expect(
        router
          .connect(owner)
          .transferBTCAllocation(
            ethers.parseEther("1")
          )
      ).to.be.revert(ethers);
    }
  );

  // ---------------------------------------------
  // AETR ALLOCATION LIMIT
  // ---------------------------------------------

  it(
    "should not allow AETR allocation above accounting balance",
    async function () {
      const {
        owner,
        router,
      } = await deploySystem();

      await expect(
        router
          .connect(owner)
          .burnAETRAllocation(
            ethers.parseEther("1")
          )
      ).to.be.revert(ethers);
    }
  );
});
