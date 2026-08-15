"use client";

import { useEffect, useState } from "react";
import {
  useAccount,
  useChainId,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { formatEther, parseEther } from "viem";
import { sepolia } from "wagmi/chains";
import { CONTRACTS } from "../lib/contracts";

function formatAETR(value: bigint | undefined): string {
  if (value === undefined) {
    return "Loading...";
  }

  return Number(formatEther(value)).toLocaleString("en-US", {
    maximumFractionDigits: 6,
  });
}

export default function StakingPanel() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();

  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [action, setAction] = useState<
    "approve" | "stake" | "withdraw" | ""
  >("");

  const isSepolia =
    chainId === sepolia.id;

  /*
   * ---------------------------------------------------------
   * AETR BALANCE
   * ---------------------------------------------------------
   */

  const {
    data: aetrBalanceRaw,
    refetch: refetchAetrBalance,
  } = useReadContract({
    address: CONTRACTS.AETRToken.address,
    abi: CONTRACTS.AETRToken.abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled:
        !!address &&
        isSepolia,
    },
  });

  /*
   * ---------------------------------------------------------
   * AETR ALLOWANCE FOR STAKING CONTRACT
   * ---------------------------------------------------------
   */

  const {
    data: allowanceRaw,
    refetch: refetchAllowance,
  } = useReadContract({
    address: CONTRACTS.AETRToken.address,
    abi: CONTRACTS.AETRToken.abi,
    functionName: "allowance",
    args:
      address
        ? [
            address,
            CONTRACTS.Staking.address,
          ]
        : undefined,
    query: {
      enabled:
        !!address &&
        isSepolia,
    },
  });

  /*
   * ---------------------------------------------------------
   * PERSONAL STAKED BALANCE
   * ---------------------------------------------------------
   */

  const {
    data: stakedBalanceRaw,
    refetch: refetchStakedBalance,
  } = useReadContract({
    address: CONTRACTS.Staking.address,
    abi: CONTRACTS.Staking.abi,
    functionName: "balances",
    args: address ? [address] : undefined,
    query: {
      enabled:
        !!address &&
        isSepolia,
    },
  });

  /*
   * ---------------------------------------------------------
   * TOTAL STAKED
   * ---------------------------------------------------------
   */

  const {
    data: totalStakedRaw,
    refetch: refetchTotalStaked,
  } = useReadContract({
    address: CONTRACTS.Staking.address,
    abi: CONTRACTS.Staking.abi,
    functionName: "totalStaked",
    query: {
      enabled: isSepolia,
    },
  });

  /*
   * ---------------------------------------------------------
   * NORMALIZE CONTRACT VALUES
   * ---------------------------------------------------------
   */

  const aetrBalance =
    typeof aetrBalanceRaw === "bigint"
      ? aetrBalanceRaw
      : undefined;

  const allowance =
    typeof allowanceRaw === "bigint"
      ? allowanceRaw
      : undefined;

  const stakedBalance =
    typeof stakedBalanceRaw === "bigint"
      ? stakedBalanceRaw
      : undefined;

  const totalStaked =
    typeof totalStakedRaw === "bigint"
      ? totalStakedRaw
      : undefined;

  /*
   * ---------------------------------------------------------
   * WRITE CONTRACT
   * ---------------------------------------------------------
   */

  const {
    writeContractAsync,
    data: txHash,
    isPending,
  } = useWriteContract();

  /*
   * ---------------------------------------------------------
   * TRANSACTION RECEIPT
   * ---------------------------------------------------------
   */

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  /*
   * ---------------------------------------------------------
   * AMOUNT
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

  const hasValidAmount =
    parsedAmount !== undefined &&
    parsedAmount > 0n;

  const hasEnoughBalance =
    parsedAmount !== undefined &&
    aetrBalance !== undefined &&
    parsedAmount <= aetrBalance;

  const hasEnoughStakedBalance =
    parsedAmount !== undefined &&
    stakedBalance !== undefined &&
    parsedAmount <= stakedBalance;

  const needsApproval =
    parsedAmount !== undefined &&
    allowance !== undefined &&
    parsedAmount > allowance;

  /*
   * ---------------------------------------------------------
   * REFRESH
   * ---------------------------------------------------------
   */

  async function refreshAll() {
    await Promise.all([
      refetchAetrBalance(),
      refetchAllowance(),
      refetchStakedBalance(),
      refetchTotalStaked(),
    ]);
  }

  /*
   * ---------------------------------------------------------
   * APPROVE
   * ---------------------------------------------------------
   */

  async function approve() {
    if (!isConnected || !address) {
      setMessage("Connect your wallet first.");
      return;
    }

    if (!isSepolia) {
      setMessage(
        "Please switch MetaMask to Ethereum Sepolia."
      );
      return;
    }

    if (!hasValidAmount || parsedAmount === undefined) {
      setMessage("Enter a valid AETR amount.");
      return;
    }

    if (!hasEnoughBalance) {
      setMessage(
        "You do not have enough AETR."
      );
      return;
    }

    try {
      setAction("approve");
      setMessage("Waiting for MetaMask approval...");

      const hash =
        await writeContractAsync({
          address:
            CONTRACTS.AETRToken.address,
          abi: CONTRACTS.AETRToken.abi,
          functionName: "approve",
          args: [
            CONTRACTS.Staking.address,
            parsedAmount,
          ],
        });

      setMessage(
        `Approval submitted: ${hash.slice(
          0,
          10
        )}...`
      );
    } catch (error) {
      console.error(error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Approval failed."
      );
    }
  }

  /*
   * ---------------------------------------------------------
   * STAKE
   * ---------------------------------------------------------
   */

  async function stake() {
    if (!isConnected || !address) {
      setMessage("Connect your wallet first.");
      return;
    }

    if (!isSepolia) {
      setMessage(
        "Please switch MetaMask to Ethereum Sepolia."
      );
      return;
    }

    if (!hasValidAmount || parsedAmount === undefined) {
      setMessage("Enter a valid AETR amount.");
      return;
    }

    if (!hasEnoughBalance) {
      setMessage(
        "You do not have enough AETR."
      );
      return;
    }

    if (needsApproval) {
      setMessage(
        "Approve the staking contract before staking."
      );
      return;
    }

    try {
      setAction("stake");
      setMessage("Waiting for MetaMask...");

      const hash =
        await writeContractAsync({
          address:
            CONTRACTS.Staking.address,
          abi: CONTRACTS.Staking.abi,
          functionName: "stake",
          args: [parsedAmount],
        });

      setMessage(
        `Stake submitted: ${hash.slice(
          0,
          10
        )}...`
      );
    } catch (error) {
      console.error(error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Staking failed."
      );
    }
  }

  /*
   * ---------------------------------------------------------
   * WITHDRAW
   * ---------------------------------------------------------
   */

  async function withdraw() {
    if (!isConnected || !address) {
      setMessage("Connect your wallet first.");
      return;
    }

    if (!isSepolia) {
      setMessage(
        "Please switch MetaMask to Ethereum Sepolia."
      );
      return;
    }

    if (!hasValidAmount || parsedAmount === undefined) {
      setMessage("Enter a valid AETR amount.");
      return;
    }

    if (!hasEnoughStakedBalance) {
      setMessage(
        "You do not have enough staked AETR."
      );
      return;
    }

    try {
      setAction("withdraw");
      setMessage("Waiting for MetaMask...");

      const hash =
        await writeContractAsync({
          address:
            CONTRACTS.Staking.address,
          abi: CONTRACTS.Staking.abi,
          functionName: "withdraw",
          args: [parsedAmount],
        });

      setMessage(
        `Withdrawal submitted: ${hash.slice(
          0,
          10
        )}...`
      );
    } catch (error) {
      console.error(error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Withdrawal failed."
      );
    }
  }

  /*
   * ---------------------------------------------------------
   * AUTO REFRESH AFTER CONFIRMATION
   * ---------------------------------------------------------
   */

  useEffect(() => {
    if (isConfirmed) {
      refreshAll();
      setAction("");
    }
  }, [isConfirmed]);

  /*
   * ---------------------------------------------------------
   * DISCONNECTED
   * ---------------------------------------------------------
   */

  if (!isConnected) {
    return (
      <section className="mt-10 rounded-3xl border border-cyan-500/20 bg-[#070b1f] p-6 md:p-8">

        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
          AETR STAKING
        </p>

        <h2 className="mt-2 text-3xl font-bold text-white">
          Stake AETR
        </h2>

        <p className="mt-3 text-sm text-gray-400">
          Connect your wallet to access the AETHERIS staking
          interface.
        </p>

      </section>
    );
  }

  /*
   * ---------------------------------------------------------
   * WRONG NETWORK
   * ---------------------------------------------------------
   */

  if (!isSepolia) {
    return (
      <section className="mt-10 rounded-3xl border border-yellow-500/30 bg-yellow-950/20 p-6 md:p-8">

        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-yellow-400">
          NETWORK REQUIRED
        </p>

        <h2 className="mt-2 text-3xl font-bold text-white">
          Ethereum Sepolia
        </h2>

        <p className="mt-3 text-sm text-gray-300">
          Please switch MetaMask to Ethereum Sepolia to use
          AETHERIS staking.
        </p>

      </section>
    );
  }

  /*
   * ---------------------------------------------------------
   * MAIN STAKING UI
   * ---------------------------------------------------------
   */

  return (
    <section className="mt-10 rounded-3xl border border-cyan-500/20 bg-[#070b1f] p-6 shadow-2xl shadow-cyan-950/20 md:p-8">

      {/* Header */}

      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">

        <div>

          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400">
            AETR STAKING
          </p>

          <h2 className="mt-2 text-3xl font-bold text-white md:text-4xl">
            Stake AETR
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-400">
            Stake AETR directly through the deployed AETHERIS V2
            staking contract.
          </p>

        </div>

        <div className="flex items-center gap-2 self-start rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2">

          <span className="h-2 w-2 rounded-full bg-green-400" />

          <span className="text-xs font-semibold text-green-400">
            LIVE SEPOLIA
          </span>

        </div>

      </div>

      {/* Position Cards */}

      <div className="mt-8 grid gap-4 md:grid-cols-3">

        <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/80 p-5">

          <p className="text-xs uppercase tracking-wider text-gray-400">
            Your AETR Balance
          </p>

          <p className="mt-3 text-2xl font-bold text-white">
            {formatAETR(aetrBalance)}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Available in wallet
          </p>

        </div>

        <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/80 p-5">

          <p className="text-xs uppercase tracking-wider text-gray-400">
            Your Staked AETR
          </p>

          <p className="mt-3 text-2xl font-bold text-cyan-400">
            {formatAETR(stakedBalance)}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Current staking position
          </p>

        </div>

        <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/80 p-5">

          <p className="text-xs uppercase tracking-wider text-gray-400">
            Total Protocol Staked
          </p>

          <p className="mt-3 text-2xl font-bold text-white">
            {formatAETR(totalStaked)}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Total AETR deposited into staking
          </p>

        </div>

      </div>

      {/* Input */}

      <div className="mt-8 rounded-2xl border border-cyan-500/20 bg-slate-900/50 p-5">

        <label className="text-sm font-medium text-gray-300">
          AETR Amount
        </label>

        <div className="relative mt-2">

          <input
            type="text"
            inputMode="decimal"
            placeholder="0.0"
            value={amount}
            onChange={(event) =>
              setAmount(event.target.value)
            }
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-4 pr-20 text-white outline-none transition focus:border-cyan-400"
          />

          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-cyan-400">
            AETR
          </span>

        </div>

        <div className="mt-2 flex justify-between text-xs">

          <span className="text-gray-500">
            Wallet:{" "}
            {formatAETR(aetrBalance)} AETR
          </span>

          <button
            type="button"
            onClick={() => {
              if (aetrBalance !== undefined) {
                setAmount(
                  formatEther(aetrBalance)
                );
              }
            }}
            className="text-cyan-400 hover:text-cyan-300"
          >
            MAX
          </button>

        </div>

      </div>

      {/* Allowance */}

      <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/70 p-4">

        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">

          <div>
            <p className="text-sm font-medium text-white">
              Staking Allowance
            </p>

            <p className="mt-1 text-xs text-gray-500">
              AETR currently approved for the staking contract
            </p>
          </div>

          <p className="text-sm font-semibold text-cyan-400">
            {formatAETR(allowance)}
          </p>

        </div>

      </div>

      {/* Buttons */}

      <div className="mt-5 grid gap-3 md:grid-cols-3">

        <button
          type="button"
          onClick={approve}
          disabled={
            isPending ||
            isConfirming ||
            !hasValidAmount ||
            !hasEnoughBalance ||
            !needsApproval
          }
          className="rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-5 py-3 font-semibold text-cyan-400 transition hover:bg-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {action === "approve" &&
          (isPending || isConfirming)
            ? "Approving..."
            : "Approve AETR"}
        </button>

        <button
          type="button"
          onClick={stake}
          disabled={
            isPending ||
            isConfirming ||
            !hasValidAmount ||
            !hasEnoughBalance ||
            needsApproval
          }
          className="rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {action === "stake" &&
          (isPending || isConfirming)
            ? "Staking..."
            : "Stake AETR"}
        </button>

        <button
          type="button"
          onClick={withdraw}
          disabled={
            isPending ||
            isConfirming ||
            !hasValidAmount ||
            !hasEnoughStakedBalance
          }
          className="rounded-xl border border-yellow-500/40 bg-yellow-500/10 px-5 py-3 font-semibold text-yellow-400 transition hover:bg-yellow-500/20 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {action === "withdraw" &&
          (isPending || isConfirming)
            ? "Withdrawing..."
            : "Withdraw AETR"}
        </button>

      </div>

      {/* Helpful state */}

      {hasValidAmount &&
        hasEnoughBalance &&
        needsApproval && (
          <div className="mt-4 rounded-xl border border-yellow-500/20 bg-yellow-950/20 p-4">

            <p className="text-sm text-yellow-400">
              Approval required
            </p>

            <p className="mt-1 text-xs text-gray-400">
              Approve the staking contract for the amount you
              want to stake. After the approval transaction is
              confirmed, you can stake your AETR.
            </p>

          </div>
        )}

      {hasValidAmount &&
        !hasEnoughBalance && (
          <div className="mt-4 rounded-xl border border-red-500/20 bg-red-950/20 p-4">

            <p className="text-sm text-red-400">
              Insufficient AETR balance
            </p>

            <p className="mt-1 text-xs text-gray-400">
              The entered amount is greater than your available
              AETR wallet balance.
            </p>

          </div>
        )}

      {hasValidAmount &&
        !hasEnoughStakedBalance && (
          <div className="mt-4 rounded-xl border border-yellow-500/20 bg-yellow-950/20 p-4">

            <p className="text-sm text-yellow-400">
              Insufficient staked balance
            </p>

            <p className="mt-1 text-xs text-gray-400">
              The entered withdrawal amount is greater than your
              current staked AETR balance.
            </p>

          </div>
        )}

      {/* Transaction Status */}

      {message && (
        <div className="mt-6 rounded-xl border border-cyan-500/20 bg-slate-900 p-4">

          <p className="text-sm text-gray-300">
            {message}
          </p>

          {txHash && (
            <a
              href={`https://sepolia.etherscan.io/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-sm text-cyan-400 hover:text-cyan-300"
            >
              View transaction on Etherscan
            </a>
          )}

        </div>
      )}

      {/* Refresh */}

      {isConfirmed && (
        <button
          type="button"
          onClick={refreshAll}
          className="mt-4 w-full rounded-xl border border-cyan-500/30 px-4 py-3 text-sm font-semibold text-cyan-400 transition hover:bg-cyan-500/10"
        >
          Refresh Staking Data
        </button>
      )}

      {/* Contract Information */}

      <div className="mt-6 border-t border-slate-800 pt-5">

        <div className="flex flex-col gap-2 text-xs text-gray-500 md:flex-row md:items-center md:justify-between">

          <p>
            Network: Ethereum Sepolia
          </p>

          <p className="break-all">
            Staking Contract:{" "}
            <span className="text-gray-400">
              {CONTRACTS.Staking.address}
            </span>
          </p>

        </div>

      </div>

    </section>
  );
}
