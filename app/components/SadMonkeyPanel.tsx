"use client";

import Image from "next/image";
import { useState } from "react";

import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";

import { formatEther, parseEther } from "viem";

import { CONTRACTS } from "../lib/contracts";

const MINT_PRICE = parseEther("50");

export default function SadMonkeyPanel() {
  const { address, isConnected } = useAccount();

  const [status, setStatus] = useState("");
  const [txHash, setTxHash] =
    useState<`0x${string}` | undefined>();

  /*
   * =========================================================
   * AUSD BALANCE
   * =========================================================
   */

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

  /*
   * =========================================================
   * HAS MINTED
   * =========================================================
   */

  const {
    data: hasMinted,
    refetch: refetchHasMinted,
  } = useReadContract({
    address: CONTRACTS.SadMonkeyNFT.address,
    abi: CONTRACTS.SadMonkeyNFT.abi,
    functionName: "hasMinted",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  /*
   * =========================================================
   * TOTAL MINTED
   * =========================================================
   */

  const {
    data: totalMinted,
    refetch: refetchTotalMinted,
  } = useReadContract({
    address: CONTRACTS.SadMonkeyNFT.address,
    abi: CONTRACTS.SadMonkeyNFT.abi,
    functionName: "totalMinted",
  });

  /*
   * =========================================================
   * REMAINING SUPPLY
   * =========================================================
   */

  const {
    data: remainingSupply,
    refetch: refetchRemainingSupply,
  } = useReadContract({
    address: CONTRACTS.SadMonkeyNFT.address,
    abi: CONTRACTS.SadMonkeyNFT.abi,
    functionName: "remainingSupply",
  });

  /*
   * =========================================================
   * WRITE CONTRACT
   * =========================================================
   */

  const {
    writeContractAsync,
    isPending,
  } = useWriteContract();

  /*
   * =========================================================
   * TRANSACTION RECEIPT
   * =========================================================
   */

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  /*
   * =========================================================
   * APPROVE AUSD
   * =========================================================
   */

  async function approveAUSD() {
    if (!isConnected || !address) {
      alert("Connect your wallet first.");
      return;
    }

    if (
      ausdBalance === undefined ||
      (ausdBalance as bigint) < MINT_PRICE
    ) {
      alert(
        "You need at least 50 AUSD to mint a Sad Monkey."
      );
      return;
    }

    try {
      setStatus(
        "Waiting for AUSD approval..."
      );

      const hash =
        await writeContractAsync({
          address:
            CONTRACTS.AUSDStablecoin.address,

          abi:
            CONTRACTS.AUSDStablecoin.abi,

          functionName: "approve",

          args: [
            CONTRACTS.SadMonkeyNFT.address,
            MINT_PRICE,
          ],
        });

      setTxHash(hash);

      setStatus(
        "AUSD approval submitted. Confirm it in your wallet."
      );
    } catch (error) {
      console.error(error);

      setStatus("");

      alert(
        "AUSD approval failed."
      );
    }
  }

  /*
   * =========================================================
   * MINT SAD MONKEY
   * =========================================================
   */

  async function mintSadMonkey() {
    if (!isConnected || !address) {
      alert("Connect your wallet first.");
      return;
    }

    if (hasMinted) {
      alert(
        "This wallet has already minted a Sad Monkey."
      );
      return;
    }

    if (
      ausdBalance === undefined ||
      (ausdBalance as bigint) < MINT_PRICE
    ) {
      alert(
        "You need at least 50 AUSD to mint a Sad Monkey."
      );
      return;
    }

    try {
      setStatus(
        "Confirm the Sad Monkey mint transaction in your wallet."
      );

      const hash =
        await writeContractAsync({
          address:
            CONTRACTS.SadMonkeyNFT.address,

          abi:
            CONTRACTS.SadMonkeyNFT.abi,

          functionName: "mint",
        });

      setTxHash(hash);

      setStatus(
        "Sad Monkey mint submitted. Waiting for confirmation..."
      );
    } catch (error) {
      console.error(error);

      setStatus("");

      alert(
        "Sad Monkey mint failed. Check your AUSD approval and wallet."
      );
    }
  }

  /*
   * =========================================================
   * REFRESH
   * =========================================================
   */

  async function refreshStatus() {
    await Promise.all([
      refetchAusdBalance(),
      refetchHasMinted(),
      refetchTotalMinted(),
      refetchRemainingSupply(),
    ]);

    setStatus(
      "NFT status refreshed."
    );
  }

  /*
   * =========================================================
   * WALLET NOT CONNECTED
   * =========================================================
   */

  if (!isConnected) {
    return (
      <section className="overflow-hidden rounded-3xl border border-cyan-500/20 bg-[#070b18] shadow-2xl shadow-cyan-500/5">

        {/* NFT IMAGE */}

        <div className="grid gap-0 lg:grid-cols-2">

          <div className="relative min-h-[520px] overflow-hidden bg-black">

            <Image
              src="/sad-monkey.png"
              alt="AETHERIS Sad Monkey NFT"
              fill
              priority
              className="object-cover"
            />

            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/60 to-transparent p-8">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-400">
                AETHERIS NFT COLLECTION
              </p>

              <h2 className="mt-2 text-4xl font-black text-white">
                Sad Monkey
              </h2>

              <p className="mt-2 text-sm text-gray-300">
                20,000 unique AETHERIS Sad Monkeys.
              </p>
            </div>

          </div>

          {/* INFORMATION */}

          <div className="p-7 md:p-10">

            <div className="flex items-start justify-between gap-4">

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
                  AETHERIS TESTNET NFT
                </p>

                <h2 className="mt-2 text-3xl font-black text-white">
                  Sad Monkey
                </h2>
              </div>

              <span className="rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-semibold text-yellow-400">
                SEPOLIA
              </span>

            </div>

            <p className="mt-5 leading-7 text-gray-400">
              The AETHERIS Sad Monkey collection is a
              limited testnet NFT collection designed for
              community participation and ecosystem activity.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4">

              <div className="rounded-2xl border border-cyan-500/10 bg-slate-900/70 p-5">
                <p className="text-xs uppercase tracking-wider text-gray-500">
                  Total Supply
                </p>

                <p className="mt-2 text-2xl font-black text-white">
                  20,000
                </p>
              </div>

              <div className="rounded-2xl border border-cyan-500/10 bg-slate-900/70 p-5">
                <p className="text-xs uppercase tracking-wider text-gray-500">
                  Mint Price
                </p>

                <p className="mt-2 text-2xl font-black text-cyan-400">
                  50 AUSD
                </p>
              </div>

            </div>

            <div className="mt-8 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5">

              <p className="font-semibold text-cyan-300">
                Connect your wallet
              </p>

              <p className="mt-2 text-sm leading-6 text-gray-400">
                Connect your Sepolia wallet to check your
                AUSD balance and mint your Sad Monkey NFT.
              </p>

            </div>

          </div>

        </div>

      </section>
    );
  }

  /*
   * =========================================================
   * FORMATTED VALUES
   * =========================================================
   */

  const balance =
    ausdBalance !== undefined
      ? Number(
          formatEther(
            ausdBalance as bigint
          )
        ).toLocaleString(undefined, {
          maximumFractionDigits: 4,
        })
      : "0";

  const mintedCount =
    totalMinted !== undefined &&
    totalMinted !== null
      ? totalMinted.toString()
      : "Loading...";

  const supplyRemaining =
    remainingSupply !== undefined &&
    remainingSupply !== null
      ? remainingSupply.toString()
      : "Loading...";

  const mintedNumber =
    totalMinted !== undefined
      ? Number(totalMinted)
      : 0;

  const progress =
    Math.min(
      100,
      (mintedNumber / 20000) * 100
    );

  const canMint =
    ausdBalance !== undefined &&
    (ausdBalance as bigint) >= MINT_PRICE &&
    !hasMinted &&
    !isPending &&
    !isConfirming;

  /*
   * =========================================================
   * MAIN NFT PANEL
   * =========================================================
   */

  return (
    <section className="overflow-hidden rounded-3xl border border-cyan-500/20 bg-[#070b18] shadow-2xl shadow-cyan-500/5">

      {/* =====================================================
          TOP COLLECTION HEADER
          ===================================================== */}

      <div className="border-b border-slate-800 px-6 py-6 md:px-8">

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div>

            <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-400">
              AETHERIS TESTNET NFT
            </p>

            <h2 className="mt-2 text-3xl font-black text-white md:text-4xl">
              Sad Monkey
            </h2>

            <p className="mt-2 text-sm text-gray-400">
              A 20,000 NFT AETHERIS community collection.
            </p>

          </div>

          <span className="w-fit rounded-full bg-green-500/10 px-4 py-2 text-sm font-semibold text-green-400">
            Sepolia Live
          </span>

        </div>

      </div>


      {/* =====================================================
          NFT IMAGE + MINT INFORMATION
          ===================================================== */}

      <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">

        {/* ===================================================
            NFT IMAGE
            =================================================== */}

        <div className="relative min-h-[520px] overflow-hidden bg-black md:min-h-[650px]">

          <Image
            src="/sad-monkey.png"
            alt="AETHERIS Sad Monkey NFT"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover transition duration-700 hover:scale-[1.02]"
          />

          {/* Image overlay */}

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10" />

          <div className="absolute bottom-0 left-0 right-0 p-7 md:p-8">

            <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-400">
              AETHERIS COLLECTION
            </p>

            <h3 className="mt-2 text-4xl font-black tracking-tight text-white">
              SAD MONKEY
            </h3>

            <p className="mt-2 text-sm text-gray-300">
              20,000 NFTs • 50 AUSD
            </p>

          </div>

        </div>


        {/* ===================================================
            MINT PANEL
            =================================================== */}

        <div className="p-6 md:p-8">

          {/* Collection stats */}

          <div className="grid grid-cols-2 gap-4">

            <div className="rounded-2xl border border-cyan-500/10 bg-slate-900/70 p-5">

              <p className="text-xs uppercase tracking-wider text-gray-500">
                Mint Price
              </p>

              <p className="mt-2 text-2xl font-black text-cyan-400">
                50 AUSD
              </p>

              <p className="mt-1 text-xs text-gray-600">
                Per NFT
              </p>

            </div>


            <div className="rounded-2xl border border-cyan-500/10 bg-slate-900/70 p-5">

              <p className="text-xs uppercase tracking-wider text-gray-500">
                Total Supply
              </p>

              <p className="mt-2 text-2xl font-black text-white">
                20,000
              </p>

              <p className="mt-1 text-xs text-gray-600">
                Maximum
              </p>

            </div>

          </div>


          {/* =================================================
              MINT PROGRESS
              ================================================= */}

          <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-900/70 p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs uppercase tracking-wider text-gray-500">
                  Collection Progress
                </p>

                <p className="mt-2 text-xl font-black text-white">
                  {mintedCount}
                  <span className="ml-1 text-sm font-normal text-gray-500">
                    / 20,000 minted
                  </span>
                </p>

              </div>

              <div className="text-right">

                <p className="text-sm font-bold text-cyan-400">
                  {progress.toFixed(2)}%
                </p>

                <p className="text-xs text-gray-600">
                  minted
                </p>

              </div>

            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">

              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-700"
                style={{
                  width: `${progress}%`,
                }}
              />

            </div>

            <p className="mt-3 text-xs text-gray-500">
              {supplyRemaining} Sad Monkeys remaining.
            </p>

          </div>


          {/* =================================================
              WALLET INFORMATION
              ================================================= */}

          <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-900/70 p-5">

            <p className="text-xs uppercase tracking-wider text-gray-500">
              Your Wallet
            </p>

            <p className="mt-2 break-all text-sm text-gray-300">
              {address}
            </p>

            <div className="mt-5 grid grid-cols-2 gap-4">

              <div>

                <p className="text-xs text-gray-500">
                  AUSD Balance
                </p>

                <p className="mt-1 text-xl font-black text-cyan-400">
                  {balance}
                </p>

              </div>

              <div>

                <p className="text-xs text-gray-500">
                  NFT Status
                </p>

                <p
                  className={`mt-1 text-sm font-bold ${
                    hasMinted
                      ? "text-green-400"
                      : "text-yellow-400"
                  }`}
                >
                  {hasMinted
                    ? "✓ Already Minted"
                    : "Eligible to Mint"}
                </p>

              </div>

            </div>

          </div>


          {/* =================================================
              ACTION BUTTONS
              ================================================= */}

          {!hasMinted && (

            <div className="mt-5 grid gap-3">

              <button
                onClick={approveAUSD}
                disabled={
                  isPending ||
                  isConfirming ||
                  !ausdBalance ||
                  (ausdBalance as bigint) <
                    MINT_PRICE
                }
                className="rounded-2xl border border-cyan-500/40 bg-cyan-500/10 px-5 py-4 font-bold text-cyan-300 transition hover:border-cyan-400 hover:bg-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-40"
              >

                {isPending || isConfirming
                  ? "Processing..."
                  : "1. Approve 50 AUSD"}

              </button>


              <button
                onClick={mintSadMonkey}
                disabled={!canMint}
                className="rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-4 font-bold text-white shadow-lg shadow-cyan-500/10 transition hover:from-cyan-400 hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
              >

                {isPending || isConfirming
                  ? "Processing..."
                  : "2. Mint Sad Monkey"}

              </button>

            </div>

          )}


          {/* =================================================
              STATUS
              ================================================= */}

          {status && (

            <div className="mt-5 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4">

              <p className="text-sm leading-6 text-cyan-300">
                {status}
              </p>

              {txHash && (

                <p className="mt-2 break-all text-xs text-gray-500">
                  Transaction: {txHash}
                </p>

              )}

            </div>

          )}


          {/* =================================================
              CONFIRMED
              ================================================= */}

          {isConfirmed && (

            <div className="mt-5 rounded-2xl border border-green-500/20 bg-green-500/5 p-5">

              <p className="font-bold text-green-400">
                ✓ Transaction confirmed on Sepolia
              </p>

              <button
                onClick={refreshStatus}
                className="mt-4 rounded-xl bg-green-500 px-4 py-2 text-sm font-bold text-black transition hover:bg-green-400"
              >
                Refresh NFT Status
              </button>

            </div>

          )}


          {/* =================================================
              INFORMATION
              ================================================= */}

          <div className="mt-6 border-t border-slate-800 pt-5">

            <div className="grid gap-3 sm:grid-cols-2">

              <div className="rounded-xl bg-slate-900/50 p-4">

                <p className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                  Collection
                </p>

                <p className="mt-2 text-sm leading-6 text-gray-400">
                  Maximum supply of 20,000 Sad Monkeys.
                </p>

              </div>

              <div className="rounded-xl bg-slate-900/50 p-4">

                <p className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                  Wallet Limit
                </p>

                <p className="mt-2 text-sm leading-6 text-gray-400">
                  Each wallet can mint one Sad Monkey.
                </p>

              </div>

            </div>

            <p className="mt-4 text-xs leading-6 text-gray-600">
              Mint price is 50 AUSD. Payment is transferred
              directly to the AETHERIS Treasury.
            </p>

            <p className="mt-2 break-all text-xs text-gray-700">
              Contract: {CONTRACTS.SadMonkeyNFT.address}
            </p>

          </div>

        </div>

      </div>

    </section>
  );
}
