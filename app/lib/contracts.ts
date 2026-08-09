import AETRTokenABI from "./abi/AETRToken.json";
import AUSStablecoinABI from "./abi/AUSDStablecoin.json";
import PriceOracleABI from "./abi/PriceOracle.json";
import TreasuryABI from "./abi/Treasury.json";
import VaultABI from "./abi/Vault.json";
import StakingABI from "./abi/Staking.json";

export const CONTRACTS = {
AETRToken: {
  address: "0x76ED78Ad93489AcdaD7E7e5a8bbfEEb18349C504" as `0x${string}`,
  abi: AETRTokenABI,
},

AUSDStablecoin: {
  address: "0x578ce2d1d710f2A793c1f31C9A306788f0ead2Cf" as `0x${string}`,
  abi: AUSStablecoinABI,
},

PriceOracle: {
  address: "0xcC31980C1889D03bD6240F529aFeeeC2F2cBE4dC" as `0x${string}`,
  abi: PriceOracleABI,
},

Treasury: {
  address: "0xc4a5CbF7aC3e98AD7e0Ea56D28acD3D39549B501" as `0x${string}`,
  abi: TreasuryABI,
},

Vault: {
  address: "0xe1D495Ae4Fa02Cd746aC8d8fCeECd4e9b0456302" as `0x${string}`,
  abi: VaultABI.abi,
},

Staking: {
  address: "0xB2861006DD37EBaD768b4C8835eCFaf1Ca9Bcb01" as `0x${string}`,
  abi: StakingABI,
  },
} as const;
