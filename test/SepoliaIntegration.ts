import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.create();

describe("AETHERIS Sepolia Integration", function () {
  const AUSD_ADDRESS =
    "0x614828e0b0db723e2B15196c6c6EcD230bf960A6";

  const VAULT_ADDRESS =
    "0xF7DaA3b8DBFc3E923ce9645BA803d5Cff86d38C6";

  const ROUTER_ADDRESS =
    "0x14830D7463C51c1EDf78f42bCC93D7017c306211";

  it(
    "should connect to deployed AETHERIS contracts",
    async function () {
      const [user] =
        await ethers.getSigners();

      const vault =
        await ethers.getContractAt(
          "Vault",
          VAULT_ADDRESS
        );

      const ausd =
        await ethers.getContractAt(
          "AUSDStablecoin",
          AUSD_ADDRESS
        );

      const router =
        await ethers.getContractAt(
          "ProtocolFeeRouter",
          ROUTER_ADDRESS
        );

      expect(
        await vault.ausd()
      ).to.equal(
        AUSD_ADDRESS
      );

      expect(
        await router.ausd()
      ).to.equal(
        AUSD_ADDRESS
      );

      expect(
        await vault.feeRouter()
      ).to.equal(
        ROUTER_ADDRESS
      );

      console.log(
        "Connected wallet:",
        user.address
      );

      console.log(
        "AUSD:",
        await ausd.getAddress()
      );

      console.log(
        "Vault:",
        await vault.getAddress()
      );

      console.log(
        "Fee Router:",
        await router.getAddress()
      );
    }
  );

  it(
    "should deposit ETH and borrow AUSD on Sepolia",
    async function () {
      const [user] =
        await ethers.getSigners();

      const vault =
        await ethers.getContractAt(
          "Vault",
          VAULT_ADDRESS
        );

      const ausd =
        await ethers.getContractAt(
          "AUSDStablecoin",
          AUSD_ADDRESS
        );

      const router =
        await ethers.getContractAt(
          "ProtocolFeeRouter",
          ROUTER_ADDRESS
        );

      const depositAmount =
        ethers.parseEther("0.01");

      const borrowAmount =
        ethers.parseEther("10");

      const beforeCollateral =
        await vault.ethCollateral(
          user.address
        );

      const beforeDebt =
        await vault.ausdDebt(
          user.address
        );

      console.log(
        "Initial collateral:",
        ethers.formatEther(
          beforeCollateral
        )
      );

      console.log(
        "Initial debt:",
        ethers.formatEther(
          beforeDebt
        )
      );

      // ---------------------------------------------
      // DEPOSIT ETH
      // ---------------------------------------------

      console.log(
        "Depositing 0.01 ETH..."
      );

      const depositTx =
        await vault
          .connect(user)
          .depositETH({
            value: depositAmount,
          });

      await depositTx.wait();

      const afterCollateral =
        await vault.ethCollateral(
          user.address
        );

      expect(
        afterCollateral
      ).to.equal(
        beforeCollateral +
        depositAmount
      );

      console.log(
        "Collateral after deposit:",
        ethers.formatEther(
          afterCollateral
        )
      );

      // ---------------------------------------------
      // BORROW AUSD
      // ---------------------------------------------

      console.log(
        "Borrowing 10 AUSD..."
      );

      const beforeAUSD =
        await ausd.balanceOf(
          user.address
        );

      const beforeRouterFees =
        await router.totalFeesReceived();

      const borrowTx =
        await vault
          .connect(user)
          .borrowAUSD(
            borrowAmount
          );

      await borrowTx.wait();

      // ---------------------------------------------
      // VERIFY USER AUSD
      // ---------------------------------------------

      const afterAUSD =
        await ausd.balanceOf(
          user.address
        );

      expect(
        afterAUSD
      ).to.equal(
        beforeAUSD +
        borrowAmount
      );

      // ---------------------------------------------
      // VERIFY USER DEBT
      // ---------------------------------------------

      const afterDebt =
        await vault.ausdDebt(
          user.address
        );

      expect(
        afterDebt
      ).to.equal(
        beforeDebt +
        borrowAmount
      );

      // ---------------------------------------------
      // VERIFY 1% PROTOCOL FEE
      // ---------------------------------------------

      const expectedFee =
        borrowAmount / 100n;

      const afterRouterFees =
        await router.totalFeesReceived();

      expect(
        afterRouterFees
      ).to.equal(
        beforeRouterFees +
        expectedFee
      );

      // ---------------------------------------------
      // VERIFY AETR ALLOCATION
      // ---------------------------------------------

      const expectedAETR =
        borrowAmount / 200n;

      const aetrAllocation =
        await router.totalAETRAllocation();

      expect(
        aetrAllocation
      ).to.be.greaterThanOrEqual(
        expectedAETR
      );

      // ---------------------------------------------
      // VERIFY BTC ALLOCATION
      // ---------------------------------------------

      const expectedBTC =
        borrowAmount / 200n;

      const btcAllocation =
        await router.totalBTCAllocation();

      expect(
        btcAllocation
      ).to.be.greaterThanOrEqual(
        expectedBTC
      );

      console.log(
        "User AUSD received:",
        ethers.formatEther(
          afterAUSD -
          beforeAUSD
        )
      );

      console.log(
        "User debt:",
        ethers.formatEther(
          afterDebt
        )
      );

      console.log(
        "Protocol fee:",
        ethers.formatEther(
          afterRouterFees -
          beforeRouterFees
        )
      );

      console.log(
        "AETR allocation:",
        ethers.formatEther(
          aetrAllocation
        )
      );

      console.log(
        "BTC allocation:",
        ethers.formatEther(
          btcAllocation
        )
      );
    }
  );
});
