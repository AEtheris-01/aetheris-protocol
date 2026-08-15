"use client";

import { useState } from "react";
import {
  useAccount,
  useBalance,
  useChainId,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import {
  formatEther,
  parseEther,
} from "viem";
import { sepolia } from "wagmi/chains";
import { CONTRACTS } from "../lib/contracts";

export default function VaultPanel() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();

  const [ethAmount, setEthAmount] = useState("");
  const [ausdAmount, setAusdAmount] = useState("");
  const [message, setMessage] = useState("");

  const {
    data: walletBalance,
  } = useBalance({
    address,
    query: {
      enabled: !!address,
    },
  });

  const {
    data: collateral,
    refetch: refetchCollateral,
    error: collateralError,
  } = useReadContract({
    address: CONTRACTS.Vault.address,
    abi: CONTRACTS.Vault.abi,
    functionName: "ethCollateral",
    args: address ? [address] : undefined,
    query: {
      enabled:
        !!address &&
        chainId === sepolia.id,
    },
  });

  const {
    data: debt,
    refetch: refetchDebt,
  } = useReadContract({
    address: CONTRACTS.Vault.address,
    abi: CONTRACTS.Vault.abi,
    functionName: "ausdDebt",
    args: address ? [address] : undefined,
    query: {
      enabled:
        !!address &&
        chainId === sepolia.id,
    },
  });

  const {
    data: ausdBalance,
    refetch: refetchAusdBalance,
  } = useReadContract({
    address: CONTRACTS.AUSDStablecoin.address,
    abi: CONTRACTS.AUSDStablecoin.abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled:
        !!address &&
        chainId === sepolia.id,
    },
  });

  const {
    data: vaultBalance,
    refetch: refetchVaultBalance,
  } = useBalance({
    address: CONTRACTS.Vault.address,
    query: {
      enabled:
        chainId === sepolia.id,
    },
  });

  const {
    writeContractAsync,
    data: txHash,
    isPending,
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  async function refreshAll() {
    await Promise.all([
      refetchCollateral(),
      refetchDebt(),
      refetchAusdBalance(),
      refetchVaultBalance(),
    ]);
  }

  async function deposit() {
    if (!isConnected || !address) {
      setMessage("Connect your wallet first.");
      return;
    }

    if (chainId !== sepolia.id) {
      setMessage("Please switch MetaMask to Ethereum Sepolia.");
      return;
    }

    if (!ethAmount || Number(ethAmount) <= 0) {
      setMessage("Enter an ETH amount.");
      return;
    }

    try {
      setMessage("Waiting for MetaMask...");

      const hash = await writeContractAsync({
        address: CONTRACTS.Vault.address,
        abi: CONTRACTS.Vault.abi,
        functionName: "depositETH",
        value: parseEther(ethAmount),
      });

      setMessage(
        `Deposit submitted: ${hash.slice(0, 10)}...`
      );
    } catch (error) {
      console.error(error);
      setMessage(
        error instanceof Error
          ? error.message
          : "Deposit failed."
      );
    }
  }

  async function borrowAUSD() {
    if (!isConnected || !address) {
      setMessage("Connect your wallet first.");
      return;
    }

    if (chainId !== sepolia.id) {
      setMessage("Please switch MetaMask to Ethereum Sepolia.");
      return;
    }

    if (!ausdAmount || Number(ausdAmount) <= 0) {
      setMessage("Enter an AUSD amount.");
      return;
    }

    try {
      setMessage("Waiting for MetaMask...");

      const hash = await writeContractAsync({
        address: CONTRACTS.Vault.address,
        abi: CONTRACTS.Vault.abi,
        functionName: "borrowAUSD",
        args: [parseEther(ausdAmount)],
      });

      setMessage(
        `Borrow submitted: ${hash.slice(0, 10)}...`
      );
    } catch (error) {
      console.error(error);
      setMessage(
        error instanceof Error
          ? error.message
          : "Borrow failed."
      );
    }
  }

  async function repayAUSD() {
    if (!isConnected || !address) {
      setMessage("Connect your wallet first.");
      return;
    }

    if (chainId !== sepolia.id) {
      setMessage("Please switch MetaMask to Ethereum Sepolia.");
      return;
    }

    if (!ausdAmount || Number(ausdAmount) <= 0) {
      setMessage("Enter an AUSD amount.");
      return;
    }

    try {
      setMessage("Waiting for MetaMask...");

      const hash = await writeContractAsync({
        address: CONTRACTS.Vault.address,
        abi: CONTRACTS.Vault.abi,
        functionName: "repayAUSD",
        args: [parseEther(ausdAmount)],
      });

      setMessage(
        `Repayment submitted: ${hash.slice(0, 10)}...`
      );
    } catch (error) {
      console.error(error);
      setMessage(
        error instanceof Error
          ? error.message
          : "Repayment failed."
      );
    }
  }

  async function withdraw() {
    if (!isConnected || !address) {
      setMessage("Connect your wallet first.");
      return;
    }

    if (chainId !== sepolia.id) {
      setMessage("Please switch MetaMask to Ethereum Sepolia.");
      return;
    }

    if (!ethAmount || Number(ethAmount) <= 0) {
      setMessage("Enter an ETH amount.");
      return;
    }

    try {
      setMessage("Waiting for MetaMask...");

      const hash = await writeContractAsync({
        address: CONTRACTS.Vault.address,
        abi: CONTRACTS.Vault.abi,
        functionName: "withdrawETH",
        args: [parseEther(ethAmount)],
      });

      setMessage(
        `Withdrawal submitted: ${hash.slice(0, 10)}...`
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

  if (!isConnected) {
    return (
      <div className="rounded-2xl border border-cyan-500/30 bg-slate-900 p-6">
        <h2 className="text-2xl font-bold text-cyan-400">
          AETHERIS Vault
        </h2>

        <p className="mt-3 text-gray-400">
          Connect your wallet to access your Vault.
        </p>
      </div>
    );
  }

  if (chainId !== sepolia.id) {
    return (
      <div className="rounded-2xl border border-yellow-500/40 bg-slate-900 p-6">
        <h2 className="text-2xl font-bold text-yellow-400">
          Wrong Network
        </h2>

        <p className="mt-3 text-gray-300">
          Please switch MetaMask to Ethereum Sepolia.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-cyan-500/30 bg-slate-900 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-cyan-400">
            AETHERIS Vault
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            Live Sepolia V2
          </p>
        </div>

        <span className="rounded-full bg-green-500/20 px-3 py-1 text-sm text-green-400">
          Sepolia
        </span>
      </div>

      {/* Wallet */}

      <div className="mt-5 rounded-xl bg-slate-800 p-4">
        <p className="text-sm text-gray-400">
          Connected Wallet
        </p>

        <p className="mt-1 break-all text-sm text-white">
          {address}
        </p>

        <p className="mt-3 text-sm text-gray-400">
          Wallet ETH
        </p>

        <p className="mt-1 text-xl font-bold">
          {walletBalance
            ? `${formatEther(walletBalance.value)} ETH`
            : "Loading..."}
        </p>
      </div>

      {/* Position */}

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-slate-800 p-4">
          <p className="text-sm text-gray-400">
            Your Collateral
          </p>

          <p className="mt-2 text-2xl font-bold">
            {collateralError
              ? "Read error"
              : collateral !== undefined
                ? `${formatEther(collateral as bigint)} ETH`
                : "Loading..."}
          </p>
        </div>

        <div className="rounded-xl bg-slate-800 p-4">
          <p className="text-sm text-gray-400">
            AUSD Debt
          </p>

          <p className="mt-2 text-2xl font-bold">
            {debt !== undefined
              ? `${formatEther(debt as bigint)} AUSD`
              : "Loading..."}
          </p>
        </div>

        <div className="rounded-xl bg-slate-800 p-4">
          <p className="text-sm text-gray-400">
            AUSD Balance
          </p>

          <p className="mt-2 text-2xl font-bold">
            {ausdBalance !== undefined
              ? `${formatEther(ausdBalance as bigint)} AUSD`
              : "Loading..."}
          </p>
        </div>
      </div>

      {/* Vault balance */}

      <div className="mt-4 rounded-xl bg-slate-800 p-4">
        <p className="text-sm text-gray-400">
          Vault Total ETH
        </p>

        <p className="mt-2 text-xl font-bold">
          {vaultBalance
            ? `${formatEther(vaultBalance.value)} ETH`
            : "Loading..."}
        </p>
      </div>

      {/* ETH operations */}

      <div className="mt-6">
        <label className="text-sm text-gray-400">
          ETH Amount
        </label>

        <input
          type="text"
          value={ethAmount}
          onChange={(event) =>
            setEthAmount(event.target.value)
          }
          placeholder="0.001"
          className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none"
        />
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <button
          onClick={deposit}
          disabled={isPending || isConfirming}
          className="rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-black hover:bg-cyan-400 disabled:opacity-50"
        >
          {isPending || isConfirming
            ? "Processing..."
            : "Deposit ETH"}
        </button>

        <button
          onClick={withdraw}
          disabled={isPending || isConfirming}
          className="rounded-xl bg-red-500 px-5 py-3 font-semibold text-white hover:bg-red-400 disabled:opacity-50"
        >
          {isPending || isConfirming
            ? "Processing..."
            : "Withdraw ETH"}
        </button>
      </div>

      {/* AUSD operations */}

      <div className="mt-6 rounded-xl border border-cyan-500/30 bg-slate-900/50 p-4">
        <h3 className="text-xl font-bold text-cyan-400">
          AUSD
        </h3>

        <p className="mt-2 text-sm text-gray-400">
          Enter the amount for borrowing or repayment.
        </p>

        <input
          type="number"
          step="0.01"
          min="0"
          placeholder="Enter AUSD amount"
          value={ausdAmount}
          onChange={(event) =>
            setAusdAmount(event.target.value)
          }
          className="mt-3 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none"
        />

        <button
          onClick={borrowAUSD}
          disabled={isPending || isConfirming}
          className="mt-3 w-full rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-black hover:bg-cyan-400 disabled:opacity-50"
        >
          {isPending || isConfirming
            ? "Processing..."
            : "Borrow AUSD"}
        </button>

        <button
          onClick={repayAUSD}
          disabled={isPending || isConfirming}
          className="mt-3 w-full rounded-xl bg-yellow-600 px-4 py-3 font-semibold text-white hover:bg-yellow-500 disabled:opacity-50"
        >
          {isPending || isConfirming
            ? "Processing..."
            : "Repay AUSD"}
        </button>
      </div>

      {/* Transaction status */}

      {message && (
        <div className="mt-5 rounded-xl border border-cyan-500/20 bg-slate-800 p-4">
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

      {isConfirmed && (
        <button
          onClick={refreshAll}
          className="mt-4 w-full rounded-xl border border-cyan-500/30 px-4 py-3 text-cyan-400 hover:bg-cyan-500/10"
        >
          Refresh Vault Data
        </button>
      )}

      <p className="mt-5 text-xs text-gray-500">
        Ethereum Sepolia · AETHERIS V2
      </p>
    </div>
  );
}
