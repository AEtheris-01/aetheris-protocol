import AETRTokenABI from "./abi/AETRToken.json";
import AUSDStablecoinABI from "./abi/AUSDStablecoin.json";
import PriceOracleABI from "./abi/PriceOracle.json";
import TreasuryABI from "./abi/Treasury.json";
import VaultABI from "./abi/Vault.json";
import StakingABI from "./abi/Staking.json";

export const CONTRACTS = {
  AETRToken: {
    address:
      "0xA6E6B409d1C40df1508bD06dC3B6f03f3CfeE66f" as `0x${string}`,
    abi: AETRTokenABI,
  },

  AUSDStablecoin: {
    address:
      "0x614828e0b0db723e2B15196c6c6EcD230bf960A6" as `0x${string}`,
    abi: AUSDStablecoinABI,
  },

  PriceOracle: {
    address:
      "0xe8a3b616fa79C77908F304AB7C0b03976295c4f0" as `0x${string}`,
    abi: PriceOracleABI,
  },

  Treasury: {
    address:
      "0xf8e361Ae009bEE83FB78bcD7B10Dbb4839413B40" as `0x${string}`,
    abi: TreasuryABI,
  },

  Vault: {
    address:
      "0xF7DaA3b8DBFc3E923ce9645BA803d5Cff86d38C6" as `0x${string}`,
    abi: VaultABI.abi,
  },

  ProtocolFeeRouter: {
    address:
      "0x14830D7463C51c1EDf78f42bCC93D7017c306211" as `0x${string}`,
  },

  Staking: {
    address:
      "0x07f1752864abcFA1AE67742dF61E3ADD368f22b8" as `0x${string}`,
    abi: StakingABI,
  },
} as const;
