import "dotenv/config";
import { network } from "hardhat";

async function main() {
  const { ethers } = await network.connect();

  // ==================================================
  // ENVIRONMENT
  // ==================================================

  const coldWallet =
    process.env.TREASURY_COLD_WALLET;

  const holderRewardReserve =
    process.env.AETR_HOLDER_REWARD_RESERVE;

  const airdropReserve =
    process.env.AETR_AIRDROP_RESERVE;

  if (!coldWallet) {
    throw new Error(
      "TREASURY_COLD_WALLET is not configured"
    );
  }

  if (!holderRewardReserve) {
    throw new Error(
      "AETR_HOLDER_REWARD_RESERVE is not configured"
    );
  }

  if (!airdropReserve) {
    throw new Error(
      "AETR_AIRDROP_RESERVE is not configured"
    );
  }

  // Validate configured addresses.
  ethers.getAddress(coldWallet);
  ethers.getAddress(holderRewardReserve);
  ethers.getAddress(airdropReserve);

  // ==================================================
  // DEPLOYER
  // ==================================================

  const [deployer] =
    await ethers.getSigners();

  console.log(
    "=============================================="
  );

  console.log(
    "Deploying AETHERIS Protocol V2"
  );

  console.log(
    "Deployer:",
    deployer.address
  );

  console.log(
    "Cold Wallet:",
    coldWallet
  );

  console.log(
    "Holder Reward Reserve:",
    holderRewardReserve
  );

  console.log(
    "Airdrop Reserve:",
    airdropReserve
  );

  console.log(
    "=============================================="
  );

  // ==================================================
  // 1. AUSD
  // ==================================================

  console.log(
    "Deploying AUSD..."
  );

  const AUSD =
    await ethers.getContractFactory(
      "AUSDStablecoin"
    );

  const adminDelay = 0;

  const ausd =
    await AUSD.deploy(
      deployer.address,
      adminDelay
    );

  await ausd.waitForDeployment();

  const ausdAddress =
    await ausd.getAddress();

  console.log(
    "AUSD:",
    ausdAddress
  );

  // ==================================================
  // 2. TREASURY
  // ==================================================

  console.log(
    "Deploying Treasury V2..."
  );

  const Treasury =
    await ethers.getContractFactory(
      "Treasury"
    );

  const treasury =
    await Treasury.deploy(
      deployer.address,
      coldWallet
    );

  await treasury.waitForDeployment();

  const treasuryAddress =
    await treasury.getAddress();

  console.log(
    "Treasury:",
    treasuryAddress
  );

  // ==================================================
  // 3. PRICE ORACLE
  // ==================================================

  console.log(
    "Deploying Price Oracle V2..."
  );

  const PriceOracle =
    await ethers.getContractFactory(
      "PriceOracle"
    );

  const oracle =
    await PriceOracle.deploy(
      deployer.address
    );

  await oracle.waitForDeployment();

  const oracleAddress =
    await oracle.getAddress();

  console.log(
    "Price Oracle:",
    oracleAddress
  );

  // ==================================================
  // 4. TEST ETH PRICE
  // ==================================================

  console.log(
    "Setting test ETH price: $3,000..."
  );

  const ethPrice =
    BigInt(3000) *
    BigInt(10) ** BigInt(8);

  const oracleTx =
    await oracle.setETHPrice(
      ethPrice
    );

  await oracleTx.wait();

  console.log(
    "ETH Price: $3,000"
  );

  // ==================================================
  // 5. VAULT
  //
  // IMPORTANT:
  // Vault is deployed BEFORE AETR.
  //
  // This allows the real Vault address to be
  // used as the 100M AETR Vault Incentive Reserve.
  // ==================================================

  console.log(
    "Deploying Vault V2..."
  );

  const Vault =
    await ethers.getContractFactory(
      "Vault"
    );

  const vault =
    await Vault.deploy(
      deployer.address,
      ausdAddress,
      oracleAddress
    );

  await vault.waitForDeployment();

  const vaultAddress =
    await vault.getAddress();

  console.log(
    "Vault:",
    vaultAddress
  );

  // ==================================================
  // 6. AETR
  // ==================================================

  console.log(
    "Deploying AETR V2..."
  );

  const AETR =
    await ethers.getContractFactory(
      "AETRToken"
    );

  /*
   * INITIAL SUPPLY = 300M AETR
   *
   * 100M → Holder Reward Reserve
   * 100M → Vault Incentive Reserve
   * 50M  → Airdrop Reserve
   * 50M  → Treasury
   *
   * All four destinations are real protocol
   * addresses/reserves.
   */

  const aetr =
    await AETR.deploy(
      deployer.address,
      holderRewardReserve,
      vaultAddress,
      airdropReserve,
      treasuryAddress
    );

  await aetr.waitForDeployment();

  const aetrAddress =
    await aetr.getAddress();

  console.log(
    "AETR:",
    aetrAddress
  );

  // ==================================================
  // 7. PROTOCOL FEE ROUTER
  // ==================================================

  console.log(
    "Deploying ProtocolFeeRouter V2..."
  );

  const Router =
    await ethers.getContractFactory(
      "ProtocolFeeRouter"
    );

  const router =
    await Router.deploy(
      deployer.address,
      ausdAddress,
      aetrAddress,
      treasuryAddress
    );

  await router.waitForDeployment();

  const routerAddress =
    await router.getAddress();

  console.log(
    "Protocol Fee Router:",
    routerAddress
  );

  // ==================================================
  // 8. VAULT → FEE ROUTER
  // ==================================================

  console.log(
    "Configuring Vault Fee Router..."
  );

  const feeRouterTx =
    await vault.setFeeRouter(
      routerAddress
    );

  await feeRouterTx.wait();

  console.log(
    "Vault Fee Router:",
    routerAddress
  );

  // ==================================================
  // 9. FEE ROUTER ← VAULT
  // ==================================================

  console.log(
    "Configuring Fee Router Collector..."
  );

  const collectorTx =
    await router.setFeeCollector(
      vaultAddress
    );

  await collectorTx.wait();

  console.log(
    "Fee Collector:",
    vaultAddress
  );

  // ==================================================
  // 10. AUSD ROLES
  // ==================================================

  console.log(
    "Configuring AUSD roles..."
  );

  const MINTER_ROLE =
    await ausd.MINTER_ROLE();

  const BURNER_ROLE =
    await ausd.BURNER_ROLE();

  // Vault can mint AUSD.
  const minterTx =
    await ausd.grantRole(
      MINTER_ROLE,
      vaultAddress
    );

  await minterTx.wait();

  // Vault can burn AUSD.
  const burnerTx =
    await ausd.grantRole(
      BURNER_ROLE,
      vaultAddress
    );

  await burnerTx.wait();

  console.log(
    "AUSD MINTER_ROLE → Vault"
  );

  console.log(
    "AUSD BURNER_ROLE → Vault"
  );

  // ==================================================
  // 11. AETR EMISSION CONTROLLER
  // ==================================================

  console.log(
    "Configuring AETR emission controller..."
  );

  /*
   * Testnet configuration:
   *
   * Deployer remains emission controller.
   *
   * Before mainnet this should be replaced by
   * a dedicated governance/timelock/multisig
   * architecture.
   */

  const emissionTx =
    await aetr.setEmissionController(
      deployer.address
    );

  await emissionTx.wait();

  console.log(
    "AETR Emission Controller:",
    deployer.address
  );

  // ==================================================
  // 12. STAKING
  // ==================================================

  console.log(
    "Deploying Staking..."
  );

  const Staking =
    await ethers.getContractFactory(
      "Staking"
    );

  const staking =
    await Staking.deploy(
      aetrAddress,
      deployer.address
    );

  await staking.waitForDeployment();

  const stakingAddress =
    await staking.getAddress();

  console.log(
    "Staking:",
    stakingAddress
  );

  // ==================================================
  // 13. FINAL VERIFICATION
  // ==================================================

  console.log(
    "=============================================="
  );

  console.log(
    "VERIFYING DEPLOYMENT CONFIGURATION"
  );

  console.log(
    "=============================================="
  );

  console.log(
    "AUSD:",
    ausdAddress
  );

  console.log(
    "AETR:",
    aetrAddress
  );

  console.log(
    "Treasury:",
    treasuryAddress
  );

  console.log(
    "Treasury Cold Wallet:",
    await treasury.coldWallet()
  );

  console.log(
    "Price Oracle:",
    oracleAddress
  );

  console.log(
    "Vault:",
    vaultAddress
  );

  console.log(
    "Protocol Fee Router:",
    routerAddress
  );

  console.log(
    "Staking:",
    stakingAddress
  );

  console.log(
    "----------------------------------------------"
  );

  console.log(
    "Vault Fee Router:",
    await vault.feeRouter()
  );

  console.log(
    "Router Fee Collector:",
    await router.feeCollector()
  );

  console.log(
    "Router Treasury:",
    await router.treasury()
  );

  console.log(
    "----------------------------------------------"
  );

  console.log(
    "AUSD MINTER_ROLE → Vault:",
    await ausd.hasRole(
      MINTER_ROLE,
      vaultAddress
    )
  );

  console.log(
    "AUSD BURNER_ROLE → Vault:",
    await ausd.hasRole(
      BURNER_ROLE,
      vaultAddress
    )
  );

  console.log(
    "AETR Emission Controller:",
    await aetr.emissionController()
  );

  console.log(
    "----------------------------------------------"
  );

  // ==================================================
  // AETR ALLOCATION VERIFICATION
  // ==================================================

  const holderBalance =
    await aetr.balanceOf(
      holderRewardReserve
    );

  const vaultBalance =
    await aetr.balanceOf(
      vaultAddress
    );

  const airdropBalance =
    await aetr.balanceOf(
      airdropReserve
    );

  const treasuryBalance =
    await aetr.balanceOf(
      treasuryAddress
    );

  console.log(
    "AETR Holder Reserve:",
    ethers.formatEther(holderBalance)
  );

  console.log(
    "AETR Vault Reserve:",
    ethers.formatEther(vaultBalance)
  );

  console.log(
    "AETR Airdrop Reserve:",
    ethers.formatEther(airdropBalance)
  );

  console.log(
    "AETR Treasury Reserve:",
    ethers.formatEther(treasuryBalance)
  );

  console.log(
    "AETR Total Supply:",
    ethers.formatEther(
      await aetr.totalSupply()
    )
  );

  console.log(
    "=============================================="
  );

  console.log(
    "🎉 AETHERIS V2 DEPLOYED SUCCESSFULLY"
  );

  console.log(
    "=============================================="
  );

  console.log(
    "AUSD:",
    ausdAddress
  );

  console.log(
    "AETR:",
    aetrAddress
  );

  console.log(
    "Treasury:",
    treasuryAddress
  );

  console.log(
    "Vault:",
    vaultAddress
  );

  console.log(
    "Oracle:",
    oracleAddress
  );

  console.log(
    "ProtocolFeeRouter:",
    routerAddress
  );

  console.log(
    "Staking:",
    stakingAddress
  );

  console.log(
    "=============================================="
  );
}

main().catch(
  (error) => {
    console.error(error);
    process.exitCode = 1;
  }
);
