"use client";

import { useChainId, useReadContract } from "wagmi";
import { formatEther } from "viem";
import { sepolia } from "wagmi/chains";
import { CONTRACTS } from "../lib/contracts";

function formatETH(value: bigint | undefined): string {
  if (value === undefined) {
    return "Loading...";
  }

  return Number(formatEther(value)).toLocaleString("en-US", {
    maximumFractionDigits: 6,
  });
}

function formatToken(value: bigint | undefined): string {
  if (value === undefined) {
    return "Loading...";
  }

  return Number(formatEther(value)).toLocaleString("en-US", {
    maximumFractionDigits: 6,
  });
}

function AddressBox({
  title,
  description,
  address,
}: {
  title: string;
  description: string;
  address: string | undefined;
}) {
  return (
    <div className="rounded-2xl border border-cyan-500/20 bg-slate-950/70 p-5">
      <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
        {title}
      </p>

      <p className="mt-2 text-sm leading-6 text-gray-400">
        {description}
      </p>

      <p className="mt-4 break-all rounded-xl bg-slate-900 px-4 py-3 font-mono text-xs text-cyan-400">
        {address ?? "Loading..."}
      </p>
    </div>
  );
}

export default function TreasuryPanel() {
  const chainId = useChainId();

  const isSepolia = chainId === sepolia.id;

  /*
   * ---------------------------------------------------------
   * COLD WALLET
   * ---------------------------------------------------------
   */

  const { data: coldWalletRaw } = useReadContract({
    address: CONTRACTS.Treasury.address,
    abi: CONTRACTS.Treasury.abi,
    functionName: "coldWallet",
    query: {
      enabled: isSepolia,
    },
  });

  /*
   * ---------------------------------------------------------
   * TREASURY ETH BALANCE
   * ---------------------------------------------------------
   */

  const { data: ethBalanceRaw } = useReadContract({
    address: CONTRACTS.Treasury.address,
    abi: CONTRACTS.Treasury.abi,
    functionName: "ethBalance",
    query: {
      enabled: isSepolia,
    },
  });

  /*
   * ---------------------------------------------------------
   * TREASURY AUSD BALANCE
   * ---------------------------------------------------------
   */

  const { data: ausdReserveRaw } = useReadContract({
    address: CONTRACTS.Treasury.address,
    abi: CONTRACTS.Treasury.abi,
    functionName: "tokenBalance",
    args: [CONTRACTS.AUSDStablecoin.address],
    query: {
      enabled: isSepolia,
    },
  });

  /*
   * ---------------------------------------------------------
   * TREASURY AETR BALANCE
   * ---------------------------------------------------------
   */

  const { data: aetrReserveRaw } = useReadContract({
    address: CONTRACTS.Treasury.address,
    abi: CONTRACTS.Treasury.abi,
    functionName: "tokenBalance",
    args: [CONTRACTS.AETRToken.address],
    query: {
      enabled: isSepolia,
    },
  });

  /*
   * ---------------------------------------------------------
   * TREASURY OWNER
   * ---------------------------------------------------------
   */

  const { data: ownerRaw } = useReadContract({
    address: CONTRACTS.Treasury.address,
    abi: CONTRACTS.Treasury.abi,
    functionName: "owner",
    query: {
      enabled: isSepolia,
    },
  });

  /*
   * ---------------------------------------------------------
   * NORMALIZE VALUES
   * ---------------------------------------------------------
   */

  const ethBalance =
    typeof ethBalanceRaw === "bigint"
      ? ethBalanceRaw
      : undefined;

  const ausdReserve =
    typeof ausdReserveRaw === "bigint"
      ? ausdReserveRaw
      : undefined;

  const aetrReserve =
    typeof aetrReserveRaw === "bigint"
      ? aetrReserveRaw
      : undefined;

  const coldWallet =
    typeof coldWalletRaw === "string"
      ? coldWalletRaw
      : undefined;

  const owner =
    typeof ownerRaw === "string"
      ? ownerRaw
      : undefined;

  /*
   * ---------------------------------------------------------
   * NETWORK CHECK
   * ---------------------------------------------------------
   */

  if (!isSepolia) {
    return (
      <section className="mt-10 rounded-3xl border border-yellow-500/30 bg-yellow-950/20 p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-yellow-400">
          TREASURY
        </p>

        <h2 className="mt-2 text-3xl font-bold text-white">
          Ethereum Sepolia Required
        </h2>

        <p className="mt-3 text-sm leading-6 text-gray-300">
          Switch MetaMask to Ethereum Sepolia to view the
          AETHERIS Treasury transparency dashboard.
        </p>
      </section>
    );
  }

  /*
   * ---------------------------------------------------------
   * MAIN TREASURY PANEL
   * ---------------------------------------------------------
   */

  return (
    <section className="mt-10 rounded-3xl border border-cyan-500/20 bg-[#070b1f] p-6 shadow-2xl shadow-cyan-950/20 md:p-8">

      {/* HEADER */}

      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400">
            TREASURY
          </p>

          <h2 className="mt-2 text-3xl font-bold text-white md:text-4xl">
            Reserve Transparency
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-400">
            Public read-only visibility into the AETHERIS Treasury,
            reserve assets, and designated cold-wallet address.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2">
          <span className="h-2 w-2 rounded-full bg-green-400" />

          <span className="text-xs font-semibold text-green-400">
            LIVE SEPOLIA
          </span>
        </div>

      </div>

      {/* RESERVE ARCHITECTURE */}

      <div className="mt-8 rounded-2xl border border-cyan-500/20 bg-cyan-950/10 p-5">

        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
          RESERVE ARCHITECTURE
        </p>

        <div className="mt-4 grid gap-4 md:grid-cols-3">

          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">

            <p className="text-sm font-semibold text-white">
              Vault
            </p>

            <p className="mt-2 text-xs leading-5 text-gray-500">
              Online collateral layer used for active user
              positions and protocol lending operations.
            </p>

          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">

            <p className="text-sm font-semibold text-white">
              Treasury
            </p>

            <p className="mt-2 text-xs leading-5 text-gray-500">
              Protocol reserve layer separated from active Vault
              collateral.
            </p>

          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">

            <p className="text-sm font-semibold text-white">
              Cold Wallet
            </p>

            <p className="mt-2 text-xs leading-5 text-gray-500">
              Designated custody address configured by the Treasury
              contract.
            </p>

          </div>

        </div>

      </div>

      {/* RESERVE BALANCES */}

      <div className="mt-8">

        <div className="mb-4">

          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
            RESERVE BALANCES
          </p>

          <h3 className="mt-2 text-2xl font-bold text-white">
            Treasury Assets
          </h3>

          <p className="mt-2 text-sm text-gray-400">
            Live balances reported directly by the deployed
            Treasury contract.
          </p>

        </div>

        <div className="grid gap-4 md:grid-cols-3">

          {/* ETH */}

          <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/80 p-6">

            <p className="text-xs uppercase tracking-wider text-gray-500">
              ETH Reserve
            </p>

            <p className="mt-3 text-3xl font-bold text-cyan-400">
              {formatETH(ethBalance)} ETH
            </p>

            <p className="mt-2 text-xs leading-5 text-gray-500">
              Native ETH held by the Treasury contract.
            </p>

          </div>

          {/* AUSD */}

          <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/80 p-6">

            <p className="text-xs uppercase tracking-wider text-gray-500">
              AUSD Reserve
            </p>

            <p className="mt-3 text-3xl font-bold text-white">
              {formatToken(ausdReserve)} AUSD
            </p>

            <p className="mt-2 text-xs leading-5 text-gray-500">
              AUSD token balance reported by Treasury.
            </p>

          </div>

          {/* AETR */}

          <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/80 p-6">

            <p className="text-xs uppercase tracking-wider text-gray-500">
              AETR Reserve
            </p>

            <p className="mt-3 text-3xl font-bold text-white">
              {formatToken(aetrReserve)} AETR
            </p>

            <p className="mt-2 text-xs leading-5 text-gray-500">
              AETR token balance reported by Treasury.
            </p>

          </div>

        </div>

      </div>

      {/* COLD WALLET */}

      <div className="mt-6">

        <AddressBox
          title="Designated Cold Wallet"
          description="The address configured by the Treasury contract as its designated cold-wallet destination."
          address={coldWallet}
        />

      </div>

      {/* TREASURY CONTRACT */}

      <div className="mt-6 rounded-2xl border border-cyan-500/20 bg-slate-950/70 p-5">

        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
          TREASURY CONTRACT
        </p>

        <p className="mt-3 break-all font-mono text-sm text-cyan-400">
          {CONTRACTS.Treasury.address}
        </p>

        <p className="mt-3 text-xs leading-5 text-gray-500">
          Deployed AETHERIS Treasury contract on Ethereum Sepolia.
        </p>

      </div>

      {/* OWNERSHIP TRANSPARENCY */}

      <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/60 p-5">

        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
          TREASURY CONTROLLER
        </p>

        <h3 className="mt-2 text-xl font-bold text-white">
          Authorized Owner
        </h3>

        <p className="mt-2 text-sm leading-6 text-gray-400">
          The Treasury owner is displayed for transparency.
          Administrative withdrawal operations are not exposed
          through the public website.
        </p>

        <p className="mt-5 break-all rounded-xl bg-slate-900 px-4 py-3 font-mono text-xs text-gray-400">
          {owner ?? "Loading..."}
        </p>

      </div>

      {/* SECURITY MODEL */}

      <div className="mt-6 rounded-2xl border border-green-500/20 bg-green-950/10 p-5">

        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-green-400">
          TREASURY SECURITY MODEL
        </p>

        <div className="mt-4 space-y-3 text-sm leading-6 text-gray-300">

          <p>
            <span className="font-semibold text-white">
              Vault:
            </span>{" "}
            Maintains active user collateral required for protocol
            lending operations.
          </p>

          <p>
            <span className="font-semibold text-white">
              Treasury:
            </span>{" "}
            Separates protocol reserves from active Vault
            collateral.
          </p>

          <p>
            <span className="font-semibold text-white">
              Cold Wallet:
            </span>{" "}
            Provides the designated custody destination configured
            by the Treasury contract.
          </p>

          <p>
            <span className="font-semibold text-white">
              Public Interface:
            </span>{" "}
            This dashboard is read-only. Treasury withdrawal
            operations are not available to normal website users.
          </p>

        </div>

      </div>

      {/* TESTNET NOTICE */}

      <div className="mt-6 rounded-2xl border border-yellow-500/20 bg-yellow-950/10 p-5">

        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-yellow-400">
          TESTNET NOTICE
        </p>

        <p className="mt-2 text-sm leading-6 text-gray-300">
          This information is currently sourced from the AETHERIS
          Ethereum Sepolia deployment. Testnet balances and
          addresses are not production reserve attestations.
        </p>

      </div>

      {/* FOOTER */}

      <div className="mt-6 border-t border-slate-800 pt-5">

        <div className="flex flex-col gap-2 text-xs text-gray-500 md:flex-row md:items-center md:justify-between">

          <p>
            Network: Ethereum Sepolia
          </p>

          <p className="break-all">
            Treasury:{" "}
            <span className="text-gray-400">
              {CONTRACTS.Treasury.address}
            </span>
          </p>

        </div>

      </div>

    </section>
  );
}
