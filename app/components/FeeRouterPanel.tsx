"use client";

import { useState } from "react";
import { useChainId, useReadContract } from "wagmi";
import { formatEther, parseEther } from "viem";
import { sepolia } from "wagmi/chains";
import { CONTRACTS } from "../lib/contracts";

function asBigInt(value: unknown): bigint | undefined {
  return typeof value === "bigint" ? value : undefined;
}

function formatToken(value: bigint | undefined): string {
  if (value === undefined) return "Loading...";

  return Number(formatEther(value)).toLocaleString("en-US", {
    maximumFractionDigits: 6,
  });
}

function formatBps(value: bigint | undefined): string {
  if (value === undefined) return "Loading...";

  return `${(Number(value) / 100).toFixed(2)}%`;
}

export default function FeeRouterPanel() {
  const chainId = useChainId();

  const [amount, setAmount] = useState("");

  const isSepolia = chainId === sepolia.id;

  /*
   * ---------------------------------------------------------
   * FEE CONFIGURATION
   * ---------------------------------------------------------
   */

  const { data: totalFeeRaw } = useReadContract({
    address: CONTRACTS.ProtocolFeeRouter.address,
    abi: CONTRACTS.ProtocolFeeRouter.abi,
    functionName: "TOTAL_FEE_BPS",
    query: {
      enabled: isSepolia,
    },
  });

  const { data: aetrFeeRaw } = useReadContract({
    address: CONTRACTS.ProtocolFeeRouter.address,
    abi: CONTRACTS.ProtocolFeeRouter.abi,
    functionName: "AETR_FEE_BPS",
    query: {
      enabled: isSepolia,
    },
  });

  const { data: btcFeeRaw } = useReadContract({
    address: CONTRACTS.ProtocolFeeRouter.address,
    abi: CONTRACTS.ProtocolFeeRouter.abi,
    functionName: "BTC_FEE_BPS",
    query: {
      enabled: isSepolia,
    },
  });

  /*
   * ---------------------------------------------------------
   * PROTOCOL TOTALS
   * ---------------------------------------------------------
   */

  const { data: totalFeesRaw } = useReadContract({
    address: CONTRACTS.ProtocolFeeRouter.address,
    abi: CONTRACTS.ProtocolFeeRouter.abi,
    functionName: "totalFeesReceived",
    query: {
      enabled: isSepolia,
    },
  });

  const { data: totalAetrRaw } = useReadContract({
    address: CONTRACTS.ProtocolFeeRouter.address,
    abi: CONTRACTS.ProtocolFeeRouter.abi,
    functionName: "totalAETRAllocation",
    query: {
      enabled: isSepolia,
    },
  });

  const { data: totalBtcRaw } = useReadContract({
    address: CONTRACTS.ProtocolFeeRouter.address,
    abi: CONTRACTS.ProtocolFeeRouter.abi,
    functionName: "totalBTCAllocation",
    query: {
      enabled: isSepolia,
    },
  });

  /*
   * ---------------------------------------------------------
   * ROUTING ADDRESSES
   * ---------------------------------------------------------
   */

  const { data: treasuryRaw } = useReadContract({
    address: CONTRACTS.ProtocolFeeRouter.address,
    abi: CONTRACTS.ProtocolFeeRouter.abi,
    functionName: "treasury",
    query: {
      enabled: isSepolia,
    },
  });

  const { data: feeCollectorRaw } = useReadContract({
    address: CONTRACTS.ProtocolFeeRouter.address,
    abi: CONTRACTS.ProtocolFeeRouter.abi,
    functionName: "feeCollector",
    query: {
      enabled: isSepolia,
    },
  });

  /*
   * ---------------------------------------------------------
   * FEE CALCULATOR
   * ---------------------------------------------------------
   */

  let parsedAmount: bigint | undefined;

  try {
    if (amount && Number(amount) > 0) {
      parsedAmount = parseEther(amount);
    }
  } catch {
    parsedAmount = undefined;
  }

  const {
    data: calculatedFeeRaw,
    refetch: calculateFee,
  } = useReadContract({
    address: CONTRACTS.ProtocolFeeRouter.address,
    abi: CONTRACTS.ProtocolFeeRouter.abi,
    functionName: "calculateFee",
    args:
      parsedAmount !== undefined
        ? [parsedAmount]
        : undefined,
    query: {
      enabled:
        isSepolia &&
        parsedAmount !== undefined &&
        parsedAmount > 0n,
    },
  });

  const totalFee = asBigInt(totalFeeRaw);
  const aetrFee = asBigInt(aetrFeeRaw);
  const btcFee = asBigInt(btcFeeRaw);

  const totalFees = asBigInt(totalFeesRaw);
  const totalAetr = asBigInt(totalAetrRaw);
  const totalBtc = asBigInt(totalBtcRaw);

  const calculatedFee =
    asBigInt(calculatedFeeRaw);

  /*
   * ---------------------------------------------------------
   * NETWORK
   * ---------------------------------------------------------
   */

  if (!isSepolia) {
    return (
      <section className="mt-10 rounded-3xl border border-yellow-500/30 bg-yellow-950/20 p-6 md:p-8">

        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-yellow-400">
          PROTOCOL FEE ROUTER
        </p>

        <h2 className="mt-2 text-3xl font-bold text-white">
          Ethereum Sepolia Required
        </h2>

        <p className="mt-3 text-sm text-gray-300">
          Switch MetaMask to Ethereum Sepolia to view the
          live AETHERIS fee router.
        </p>

      </section>
    );
  }

  /*
   * ---------------------------------------------------------
   * MAIN
   * ---------------------------------------------------------
   */

  return (
    <section className="mt-10 rounded-3xl border border-cyan-500/20 bg-[#070b1f] p-6 shadow-2xl shadow-cyan-950/20 md:p-8">

      {/* Header */}

      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">

        <div>

          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400">
            PROTOCOL FEE ROUTER
          </p>

          <h2 className="mt-2 text-3xl font-bold text-white md:text-4xl">
            AUSD Fee Economics
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-400">
            Live fee configuration and protocol allocation data
            from the deployed AETHERIS V2 fee router.
          </p>

        </div>

        <div className="flex items-center gap-2 self-start rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2">

          <span className="h-2 w-2 rounded-full bg-green-400" />

          <span className="text-xs font-semibold text-green-400">
            LIVE SEPOLIA
          </span>

        </div>

      </div>

      {/* Fee Configuration */}

      <div className="mt-8 grid gap-4 md:grid-cols-3">

        <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/80 p-5">

          <p className="text-xs uppercase tracking-wider text-gray-500">
            Total Protocol Fee
          </p>

          <p className="mt-3 text-3xl font-bold text-cyan-400">
            {formatBps(totalFee)}
          </p>

          <p className="mt-2 text-xs text-gray-500">
            Applied by the fee router
          </p>

        </div>

        <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/80 p-5">

          <p className="text-xs uppercase tracking-wider text-gray-500">
            AETR Allocation
          </p>

          <p className="mt-3 text-3xl font-bold text-white">
            {formatBps(aetrFee)}
          </p>

          <p className="mt-2 text-xs text-gray-500">
            Fee allocation directed to AETR economics
          </p>

        </div>

        <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/80 p-5">

          <p className="text-xs uppercase tracking-wider text-gray-500">
            BTC Allocation
          </p>

          <p className="mt-3 text-3xl font-bold text-white">
            {formatBps(btcFee)}
          </p>

          <p className="mt-2 text-xs text-gray-500">
            Fee allocation directed toward BTC reserves
          </p>

        </div>

      </div>

      {/* Protocol Totals */}

      <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/60 p-5">

        <h3 className="text-lg font-bold text-white">
          Cumulative Protocol Activity
        </h3>

        <div className="mt-5 grid gap-4 md:grid-cols-3">

          <div>
            <p className="text-xs uppercase tracking-wider text-gray-500">
              Fees Received
            </p>

            <p className="mt-2 text-2xl font-bold text-cyan-400">
              {formatToken(totalFees)} AUSD
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider text-gray-500">
              AETR Allocation
            </p>

            <p className="mt-2 text-2xl font-bold text-white">
              {formatToken(totalAetr)} AETR
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider text-gray-500">
              BTC Allocation
            </p>

            <p className="mt-2 text-2xl font-bold text-white">
              {formatToken(totalBtc)} BTC
            </p>
          </div>

        </div>

      </div>

      {/* Calculator */}

      <div className="mt-6 rounded-2xl border border-cyan-500/20 bg-slate-900/50 p-5">

        <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
          LIVE CALCULATOR
        </p>

        <h3 className="mt-2 text-2xl font-bold text-white">
          Calculate AUSD Protocol Fee
        </h3>

        <p className="mt-2 text-sm text-gray-400">
          Enter an AUSD amount to calculate the fee using the
          deployed fee-router configuration.
        </p>

        <div className="mt-5 flex flex-col gap-3 md:flex-row">

          <input
            type="text"
            inputMode="decimal"
            value={amount}
            onChange={(event) =>
              setAmount(event.target.value)
            }
            placeholder="1000"
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
          />

          <button
            type="button"
            onClick={() => {
              void calculateFee();
            }}
            disabled={
              !parsedAmount ||
              parsedAmount <= 0n
            }
            className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-black hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Calculate
          </button>

        </div>

        {calculatedFee !== undefined && (
          <div className="mt-5 rounded-xl border border-cyan-500/20 bg-slate-950 p-4">

            <p className="text-xs text-gray-500">
              Calculated Protocol Fee
            </p>

            <p className="mt-2 text-2xl font-bold text-cyan-400">
              {formatToken(calculatedFee)} AUSD
            </p>

          </div>
        )}

      </div>

      {/* Routing */}

      <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/60 p-5">

        <h3 className="text-lg font-bold text-white">
          Protocol Routing
        </h3>

        <div className="mt-5 space-y-5">

          <div>
            <p className="text-xs uppercase tracking-wider text-gray-500">
              Treasury
            </p>

            <p className="mt-2 break-all font-mono text-sm text-gray-300">
              {typeof treasuryRaw === "string"
                ? treasuryRaw
                : "Loading..."}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider text-gray-500">
              Fee Collector
            </p>

            <p className="mt-2 break-all font-mono text-sm text-gray-300">
              {typeof feeCollectorRaw === "string"
                ? feeCollectorRaw
                : "Loading..."}
            </p>
          </div>

        </div>

      </div>

      {/* Economic Explanation */}

      <div className="mt-6 rounded-2xl border border-cyan-500/20 bg-cyan-950/10 p-5">

        <h3 className="text-lg font-bold text-cyan-400">
          AETHERIS Fee Flow
        </h3>

        <div className="mt-4 space-y-3 text-sm leading-6 text-gray-300">

          <p>
            <span className="font-semibold text-white">
              1.
            </span>{" "}
            AUSD activity is processed through the protocol fee
            router.
          </p>

          <p>
            <span className="font-semibold text-white">
              2.
            </span>{" "}
            The configured protocol fee is calculated from the
            AUSD amount.
          </p>

          <p>
            <span className="font-semibold text-white">
              3.
            </span>{" "}
            The router tracks the configured AETR and BTC
            allocations.
          </p>

          <p>
            <span className="font-semibold text-white">
              4.
            </span>{" "}
            Treasury routing remains controlled by the deployed
            protocol contracts rather than the public dashboard.
          </p>

        </div>

      </div>

      {/* Contract */}

      <div className="mt-6 border-t border-slate-800 pt-5">

        <div className="flex flex-col gap-2 text-xs text-gray-500 md:flex-row md:items-center md:justify-between">

          <p>
            Network: Ethereum Sepolia
          </p>

          <p className="break-all">
            Fee Router:{" "}
            <span className="text-gray-400">
              {CONTRACTS.ProtocolFeeRouter.address}
            </span>
          </p>

        </div>

      </div>

    </section>
  );
}
