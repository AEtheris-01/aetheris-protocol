import { network } from "hardhat";

async function main() {
  const { ethers } = await network.connect();

  const [deployer] = await ethers.getSigners();

  console.log("==============================================");
  console.log("Deploying AETHERIS Protocol");
  console.log("Deployer:", deployer.address);
  console.log("==============================================");

  // --------------------------------------------------
  // AETR TOKEN
  // --------------------------------------------------

  const AETR = await ethers.getContractFactory("AETRToken");
  const aetr = await AETR.deploy(deployer.address);

  await aetr.waitForDeployment();

  console.log("AETR Token:", await aetr.getAddress());

  // --------------------------------------------------
  // AUSD STABLECOIN
  // --------------------------------------------------

  const AUSD = await ethers.getContractFactory("AUSDStablecoin");
  const ausd = await AUSD.deploy(deployer.address);

  await ausd.waitForDeployment();

  console.log("AUSD Stablecoin:", await ausd.getAddress());

  // --------------------------------------------------
  // TREASURY
  // --------------------------------------------------

  const Treasury = await ethers.getContractFactory("Treasury");
  const treasury = await Treasury.deploy(
  deployer.address
);

  await treasury.waitForDeployment();

  console.log("Treasury:", await treasury.getAddress());

  // --------------------------------------------------
  // PRICE ORACLE
  // --------------------------------------------------

  const PriceOracle = await ethers.getContractFactory("PriceOracle");
  const oracle = await PriceOracle.deploy(deployer.address);

  await oracle.waitForDeployment();

  console.log("Price Oracle:", await oracle.getAddress());

  // --------------------------------------------------
  // SET TEST ETH PRICE
  // $3,000 with 8 decimals
  // --------------------------------------------------

  const ethPrice = BigInt(3000) * BigInt(10) ** BigInt(8);

  await oracle.setETHPrice(ethPrice);

  console.log("ETH Price: $3,000");

  // --------------------------------------------------
  // VAULT
  // --------------------------------------------------

  const Vault = await ethers.getContractFactory("Vault");

  const vault = await Vault.deploy(
    deployer.address,
    await ausd.getAddress(),
    await oracle.getAddress()
  );

  await vault.waitForDeployment();

  console.log("Vault:", await vault.getAddress());

// --------------------------------------------------
// SET AUSD FEE TREASURY
// --------------------------------------------------

console.log("Setting Vault fee treasury...");

const treasuryTx = await vault.setFeeTreasury(
  await treasury.getAddress()
);

await treasuryTx.wait();

console.log(
  "Vault Fee Treasury:",
  await treasury.getAddress()
);

  // --------------------------------------------------
  // TRANSFER AUSD OWNERSHIP TO VAULT
  // --------------------------------------------------

  console.log("Transferring AUSD ownership to Vault...");

  const ownershipTx = await ausd.transferOwnership(
    await vault.getAddress()
  );

  await ownershipTx.wait();

  console.log("AUSD ownership transferred to Vault");

  // --------------------------------------------------
  // STAKING
  // --------------------------------------------------

  const Staking = await ethers.getContractFactory("Staking");

  const staking = await Staking.deploy(
    await aetr.getAddress(),
    deployer.address
  );

  await staking.waitForDeployment();

  console.log("Staking:", await staking.getAddress());

  // --------------------------------------------------
  // FINAL OUTPUT
  // --------------------------------------------------

  console.log("==============================================");
  console.log("🎉 AETHERIS DEPLOYED SUCCESSFULLY!");
  console.log("==============================================");

  console.log("AETR:", await aetr.getAddress());
  console.log("AUSD:", await ausd.getAddress());
  console.log("Treasury:", await treasury.getAddress());
  console.log("Oracle:", await oracle.getAddress());
  console.log("Vault:", await vault.getAddress());
  console.log("Staking:", await staking.getAddress());

  console.log("==============================================");
  console.log("AUSD Minting: ENABLED THROUGH VAULT");
  console.log("Maximum LTV: 66%");
  console.log("ETH Test Price: $3,000");
  console.log("==============================================");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
