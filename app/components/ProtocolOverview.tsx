"use client";

import {
  useAccount,
  useBalance,
  useChainId,
  useReadContract,
} from "wagmi";
import { formatEther } from "viem";
import { sepolia } from "wagmi/chains";
import { CONTRACTS } from "../lib/contracts";

function formatToken(value: bigint | undefined, decimals = 2) {
  if (value === undefined) return "...";

  const formatted = Number(formatEther(value));

  return formatted.toLocaleString(undefined, {
    maximumFractionDigits: decimals,
  });
}

function Card({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string;
  subtitle?: string;
}) {
  return (
    <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/70 p-5 shadow-lg shadow-cyan-950/10">
      <p className="text-sm text-gray-400">{title}</p>

      <p className="mt-2 text-2xl font-bold text-white">
        {value}
      </p>

      {subtitle && (
        <p className="mt-1 text-xs text-gray-500">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default function ProtocolOverview() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();

  const onSepolia =
    chainId === sepolia.id;

  const { data: walletETH } = useBalance({
    address,
    query: {
      enabled:
        !!address &&
        isConnected &&
        onSepolia,
    },
  });

  const { data: ausdBalance } =
    useReadContract({
      address:
        CONTRACTS.AUSDStablecoin.address,
      abi: CONTRACTS.AUSDStablecoin.abi,
      functionName: "balanceOf",
      args: address
        ? [address]
        : undefined,
      query: {
        enabled:
          !!address &&
          isConnected &&
          onSepolia,
      },
    });

  const { data: ausdSupply } =
    useReadContract({
      address:
        CONTRACTS.AUSDStablecoin.address,
      abi: CONTRACTS.AUSDStablecoin.abi,
      functionName: "totalSupply",
      query: {
        enabled: onSepolia,
      },
    });

  const { data: aetrBalance } =
    useReadContract({
      address:
        CONTRACTS.AETRToken.address,
      abi: CONTRACTS.AETRToken.abi,
      functionName: "balanceOf",
      args: address
        ? [address]
        : undefined,
      query: {
        enabled:
          !!address &&
          isConnected &&
          onSepolia,
      },
    });

  const { data: aetrSupply } =
    useReadContract({
      address:
        CONTRACTS.AETRToken.address,
      abi: CONTRACTS.AETRToken.abi,
      functionName: "totalSupply",
      query: {
        enabled: onSepolia,
      },
    });

  const { data: ethPrice } =
    useReadContract({
      address:
        CONTRACTS.PriceOracle.address,
      abi: CONTRACTS.PriceOracle.abi,
      functionName: "getETHPrice",
      query: {
        enabled: onSepolia,
      },
    });

  const { data: btcPrice } =
    useReadContract({
      address:
        CONTRACTS.PriceOracle.address,
      abi: CONTRACTS.PriceOracle.abi,
      functionName: "getBTCPrice",
      query: {
        enabled: onSepolia,
      },
    });

  const { data: aetrPrice } =
    useReadContract({
      address:
        CONTRACTS.PriceOracle.address,
      abi: CONTRACTS.PriceOracle.abi,
      functionName: "getAETRPrice",
      query: {
        enabled: onSepolia,
      },
    });

  const { data: totalCollateral } =
    useReadContract({
      address:
        CONTRACTS.Vault.address,
      abi: CONTRACTS.Vault.abi,
      functionName: "totalETHCollateral",
      query: {
        enabled: onSepolia,
      },
    });

  const { data: totalDebt } =
    useReadContract({
      address:
        CONTRACTS.Vault.address,
      abi: CONTRACTS.Vault.abi,
      functionName: "totalAUSDDebt",
      query: {
        enabled: onSepolia,
      },
    });

  const { data: maxLTV } =
    useReadContract({
      address:
        CONTRACTS.Vault.address,
      abi: CONTRACTS.Vault.abi,
      functionName: "MAX_LTV_BPS",
      query: {
        enabled: onSepolia,
      },
    });

  const { data: liquidationThreshold } =
    useReadContract({
      address:
        CONTRACTS.Vault.address,
      abi: CONTRACTS.Vault.abi,
      functionName:
        "LIQUIDATION_THRESHOLD_BPS",
      query: {
        enabled: onSepolia,
      },
    });

  const { data: borrowFee } =
    useReadContract({
      address:
        CONTRACTS.Vault.address,
      abi: CONTRACTS.Vault.abi,
      functionName: "BORROW_FEE_BPS",
      query: {
        enabled: onSepolia,
      },
    });

  const { data: totalFees } =
    useReadContract({
      address:
        CONTRACTS.ProtocolFeeRouter.address,
      abi: CONTRACTS.ProtocolFeeRouter.abi,
      functionName: "totalFeesReceived",
      query: {
        enabled: onSepolia,
      },
    });

  const { data: totalAETRAllocation } =
    useReadContract({
      address:
        CONTRACTS.ProtocolFeeRouter.address,
      abi: CONTRACTS.ProtocolFeeRouter.abi,
      functionName:
        "totalAETRAllocation",
      query: {
        enabled: onSepolia,
      },
    });

  const { data: totalBTCAllocation } =
    useReadContract({
      address:
        CONTRACTS.ProtocolFeeRouter.address,
      abi: CONTRACTS.ProtocolFeeRouter.abi,
      functionName:
        "totalBTCAllocation",
      query: {
        enabled: onSepolia,
      },
    });

  const { data: oracleFresh } =
    useReadContract({
      address:
        CONTRACTS.PriceOracle.address,
      abi: CONTRACTS.PriceOracle.abi,
      functionName: "getETHPriceData",
      query: {
        enabled: onSepolia,
      },
    });

  if (!onSepolia) {
    return (
      <div className="mb-8 rounded-2xl border border-yellow-500/30 bg-yellow-950/20 p-5">
        <p className="font-semibold text-yellow-400">
          Ethereum Sepolia required
        </p>

        <p className="mt-1 text-sm text-gray-400">
          Switch your wallet to Sepolia to view live
          AETHERIS protocol data.
        </p>
      </div>
    );
  }

  const ethPriceNumber =
    ethPrice !== undefined
      ? Number(formatEther(ethPrice as bigint))
      : undefined;

  const oracleUpdatedAt =
    Array.isArray(oracleFresh)
      ? oracleFresh[1]
      : undefined;

  return (
    <section className="mb-10">
      <div className="mb-5">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold">
            Protocol Overview
          </h2>

          <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-400">
            ● LIVE
          </span>
        </div>

        <p className="mt-1 text-sm text-gray-500">
          Live data from AETHERIS V2 on Ethereum Sepolia.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card
          title="Wallet ETH"
          value={
            walletETH
              ? `${formatToken(walletETH.value, 4)} ETH`
              : "..."
          }
          subtitle="Connected wallet"
        />

        <Card
          title="AUSD Balance"
          value={`${formatToken(ausdBalance as bigint | undefined)} AUSD`}
          subtitle="Connected wallet"
        />

        <Card
          title="AETR Balance"
          value={`${formatToken(aetrBalance as bigint | undefined)} AETR`}
          subtitle="Connected wallet"
        />

        <Card
          title="ETH / USD"
          value={
            ethPriceNumber !== undefined
              ? `$${ethPriceNumber.toLocaleString()}`
              : "..."
          }
          subtitle="Oracle price"
        />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card
          title="AUSD Supply"
          value={`${formatToken(ausdSupply as bigint | undefined)} AUSD`}
          subtitle="Total supply"
        />

        <Card
          title="AETR Supply"
          value={`${formatToken(aetrSupply as bigint | undefined)} AETR`}
          subtitle="Current supply"
        />

        <Card
          title="Total Collateral"
          value={`${formatToken(totalCollateral as bigint | undefined, 4)} ETH`}
          subtitle="All Vaults"
        />

        <Card
          title="Total AUSD Debt"
          value={`${formatToken(totalDebt as bigint | undefined)} AUSD`}
          subtitle="All Vaults"
        />
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/70 p-6">
          <h3 className="text-lg font-bold">
            Market Oracle
          </h3>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500">
                ETH
              </p>

              <p className="mt-1 font-semibold">
                {ethPriceNumber !== undefined
                  ? `$${ethPriceNumber.toLocaleString()}`
                  : "..."}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">
                BTC
              </p>

              <p className="mt-1 font-semibold">
                {btcPrice !== undefined
                  ? `$${Number(
                      formatEther(btcPrice as bigint)
                    ).toLocaleString()}`
                  : "..."}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">
                AETR
              </p>

              <p className="mt-1 font-semibold">
                {aetrPrice !== undefined
                  ? `$${Number(
                      formatEther(aetrPrice as bigint)
                    ).toLocaleString()}`
                  : "..."}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">
                ETH Oracle
              </p>

              <p className="mt-1 font-semibold text-green-400">
                {oracleFresh
                  ? "● Available"
                  : "Loading..."}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/70 p-6">
          <h3 className="text-lg font-bold">
            Vault Parameters
          </h3>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500">
                Maximum LTV
              </p>

              <p className="mt-1 font-semibold">
                {maxLTV !== undefined
                  ? `${Number(maxLTV) / 100}%`
                  : "..."}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Liquidation Threshold
              </p>

              <p className="mt-1 font-semibold">
                {liquidationThreshold !== undefined
                  ? `${Number(liquidationThreshold) / 100}%`
                  : "..."}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Borrow Fee
              </p>

              <p className="mt-1 font-semibold">
                {borrowFee !== undefined
                  ? `${Number(borrowFee) / 100}%`
                  : "..."}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Oracle
              </p>

              <p className="mt-1 font-semibold text-green-400">
                ● Sepolia
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-cyan-500/20 bg-slate-900/70 p-6">
        <h3 className="text-lg font-bold">
          Protocol Fee Accounting
        </h3>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-xs text-gray-500">
              Total Fees
            </p>

            <p className="mt-1 text-xl font-bold">
              {formatToken(
                totalFees as bigint | undefined
              )} AUSD
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">
              AETR Allocation
            </p>

            <p className="mt-1 text-xl font-bold">
              {formatToken(
                totalAETRAllocation as bigint | undefined
              )} AUSD
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">
              BTC Allocation
            </p>

            <p className="mt-1 text-xl font-bold">
              {formatToken(
                totalBTCAllocation as bigint | undefined
              )} AUSD
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
