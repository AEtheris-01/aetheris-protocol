"use client";

import { useState } from "react";
import { useAccount, useReadContract, useWriteContract, useBalance } from "wagmi";
import { parseEther, formatEther } from "viem";
import { CONTRACTS } from "../lib/contracts";

export default function VaultPanel() {
  const { address, isConnected } = useAccount();

  const [amount, setAmount] = useState("");
const [ausdAmount, setAusdAmount] = useState("");

  const {
    data: collateral,
    refetch: refetchCollateral,
    error: collateralError,
  } = useReadContract({
    address: CONTRACTS.Vault.address,
    abi: CONTRACTS.Vault.abi,
    functionName: "collateralOf",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  const {
    data: debt,
    refetch: refetchDebt,
  } = useReadContract({
    address: CONTRACTS.Vault.address,
    abi: CONTRACTS.Vault.abi,
    functionName: "debtOf",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  const {
  data: vaultBalance,
  refetch: refetchVaultBalance,
} = useBalance({
  address: CONTRACTS.Vault.address,
  query: {
    enabled: !!CONTRACTS.Vault.address,
  },
});  const { writeContractAsync, isPending } = useWriteContract();
const {
  data: ausdBalance,
  refetch: refetchAusdBalance,
} = useReadContract({
  address: CONTRACTS.AUSDStablecoin.address,
  abi: CONTRACTS.AUSDStablecoin.abi,
  functionName: "balanceOf",
  args: address ? [address] : undefined,
  query: {
    enabled: !!address,
  },
});
async function mintAUSD() {
  if (!ausdAmount || Number(ausdAmount) <= 0) {
    alert("Enter an AUSD amount");
    return;
  }

  try {
    await writeContractAsync({
      address: CONTRACTS.Vault.address,
      abi: CONTRACTS.Vault.abi,
      functionName: "borrowAUSD",
      args: [parseEther(ausdAmount)],
    });

    alert("AUSD mint transaction submitted.");

    setTimeout(() => {
      refetchAusdBalance();
      refetchCollateral();
    }, 3000);
  } catch (error) {
    console.error(error);
    alert("AUSD mint failed. Check your collateral and MetaMask.");
  }
}

async function repayAUSD() {
  if (!ausdAmount || Number(ausdAmount) <= 0) {
    alert("Enter an AUSD amount");
    return;
  }

  try {
    await writeContractAsync({
      address: CONTRACTS.Vault.address,
      abi: CONTRACTS.Vault.abi,
      functionName: "repayAUSD",
      args: [parseEther(ausdAmount)],
    });

    alert("AUSD repayment transaction submitted.");

    setTimeout(() => {
      refetchAusdBalance();
      refetchCollateral();
    }, 3000);
  } catch (error) {
    console.error(error);
    alert("AUSD repayment failed. Check your debt and AUSD balance.");
  }
}

  async function deposit() {
    if (!amount || Number(amount) <= 0) {
      alert("Enter an ETH amount");
      return;
    }

    try {
      await writeContractAsync({
        address: CONTRACTS.Vault.address,
        abi: CONTRACTS.Vault.abi,
        functionName: "depositETH",
        value: parseEther(amount),
      });

      alert("Deposit transaction submitted.");

      setTimeout(() => {
        refetchCollateral();
        refetchVaultBalance();
      }, 3000);
    } catch (error) {
      console.error(error);
      alert("Deposit failed. Check MetaMask.");
    }
  }

  async function withdraw() {
    if (!amount || Number(amount) <= 0) {
      alert("Enter an ETH amount");
      return;
    }

    try {
      await writeContractAsync({
        address: CONTRACTS.Vault.address,
        abi: CONTRACTS.Vault.abi,
        functionName: "withdrawETH",
        args: [parseEther(amount)],
      });

      alert("Withdrawal transaction submitted.");

      setTimeout(() => {
        refetchCollateral();
        refetchVaultBalance();
      }, 3000);
    } catch (error) {
      console.error(error);
      alert("Withdrawal failed. Check your collateral and MetaMask.");
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

  return (
    <div className="rounded-2xl border border-cyan-500/30 bg-slate-900 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-cyan-400">
          AETHERIS Vault
        </h2>

        <span className="rounded-full bg-green-500/20 px-3 py-1 text-sm text-green-400">
          Sepolia
        </span>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">

        <div className="rounded-xl bg-slate-800 p-4">
          <p className="text-sm text-gray-400">
            Your Collateral
          </p>

          <p className="mt-2 text-2xl font-bold">
            {collateralError
  ? `Error: ${collateralError.message}`
  : collateral === undefined
    ? "Loading..."
    : `${formatEther(collateral as bigint)} ETH`}
             
          </p>
        </div>

        <div className="rounded-xl bg-slate-800 p-4">
          <p className="text-sm text-gray-400">
            Vault Balance
          </p>

          <p className="mt-2 text-2xl font-bold">
            {vaultBalance !== undefined
              ? `${formatEther(vaultBalance.value)} ETH`
              : "Loading..."}
          </p>
        </div>

      </div>

      <div className="mt-6">
        <label className="text-sm text-gray-400">
          ETH Amount
        </label>

        <input
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.001"
          className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none"
        />
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">

        <button
          onClick={deposit}
          disabled={isPending}
          className="rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-black hover:bg-cyan-400 disabled:opacity-50"
        >
          {isPending ? "Processing..." : "Deposit ETH"}
        </button>

        <button
          onClick={withdraw}
          disabled={isPending}
          className="rounded-xl bg-red-500 px-5 py-3 font-semibold text-white hover:bg-red-400 disabled:opacity-50"
        >
          {isPending ? "Processing..." : "Withdraw ETH"}
        </button>

      </div>
<div className="mt-6 rounded-xl border border-cyan-500/30 bg-slate-900/50 p-4">
  <h3 className="text-xl font-bold text-cyan-400">
    Mint AUSD
  </h3>

  <p className="mt-2 text-sm text-gray-400">
    Your AUSD Balance:{" "}
    {ausdBalance !== undefined
      ? formatEther(ausdBalance as bigint)
      : "0"} AUSD
  </p>

<p className="mt-2 text-sm text-gray-400">
  Your AUSD Debt:{" "}
  {debt !== undefined
    ? formatEther(debt as bigint)
    : "0"} AUSD
</p>

  <input
    type="number"
    step="0.01"
    min="0"
    placeholder="Enter AUSD amount"
    value={ausdAmount}
    onChange={(e) => setAusdAmount(e.target.value)}
    className="mt-3 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none"
  />

  <button
    onClick={mintAUSD}
    disabled={isPending}
    className="mt-3 w-full rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-black hover:bg-cyan-400 disabled:opacity-50"
  >
    {isPending ? "Processing..." : "Mint AUSD"}
  </button>

<button
  onClick={repayAUSD}
  disabled={isPending}
  className="mt-3 w-full rounded-xl bg-yellow-600 px-4 py-3 font-semibold text-white hover:bg-yellow-500 disabled:opacity-50"
>
  {isPending ? "Processing..." : "Repay AUSD"}
</button>

</div>

      <p className="mt-4 text-xs text-gray-500">
        Test network: Ethereum Sepolia
      </p>
    </div>
  );
}
