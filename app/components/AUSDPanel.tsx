"use client";

import {
  useAccount,
  useChainId,
  useReadContract,
} from "wagmi";
import { formatEther } from "viem";
import { sepolia } from "wagmi/chains";
import { CONTRACTS } from "../lib/contracts";

function formatAmount(value: bigint | undefined): string {
  if (value === undefined) {
    return "Loading...";
  }

  return Number(formatEther(value)).toLocaleString("en-US", {
    maximumFractionDigits: 6,
  });
}

function shortenAddress(address: string | undefined): string {
  if (!address) {
    return "Loading...";
  }

  if (address.length < 12) {
    return address;
  }

  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function StatusBadge({
  active,
  label,
}: {
  active: boolean;
  label: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
        active
          ? "border border-green-500/30 bg-green-500/10 text-green-400"
          : "border border-red-500/30 bg-red-500/10 text-red-400"
      }`}
    >
      <span
        className={`h-2 w-2 rounded-full ${
          active ? "bg-green-400" : "bg-red-400"
        }`}
      />

      {label}
    </span>
  );
}

export default function AUSDPanel() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();

  const isSepolia = chainId === sepolia.id;

  /*
   * ---------------------------------------------------------
   * AUSD TOTAL SUPPLY
   * ---------------------------------------------------------
   */

  const { data: totalSupplyRaw } = useReadContract({
    address: CONTRACTS.AUSDStablecoin.address,
    abi: CONTRACTS.AUSDStablecoin.abi,
    functionName: "totalSupply",
    query: {
      enabled: isSepolia,
    },
  });

  /*
   * ---------------------------------------------------------
   * USER AUSD BALANCE
   * ---------------------------------------------------------
   */

  const { data: userBalanceRaw } = useReadContract({
    address: CONTRACTS.AUSDStablecoin.address,
    abi: CONTRACTS.AUSDStablecoin.abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: isSepolia && !!address,
    },
  });

  /*
   * ---------------------------------------------------------
   * TOKEN NAME
   * ---------------------------------------------------------
   */

  const { data: nameRaw } = useReadContract({
    address: CONTRACTS.AUSDStablecoin.address,
    abi: CONTRACTS.AUSDStablecoin.abi,
    functionName: "name",
    query: {
      enabled: isSepolia,
    },
  });

  /*
   * ---------------------------------------------------------
   * TOKEN SYMBOL
   * ---------------------------------------------------------
   */

  const { data: symbolRaw } = useReadContract({
    address: CONTRACTS.AUSDStablecoin.address,
    abi: CONTRACTS.AUSDStablecoin.abi,
    functionName: "symbol",
    query: {
      enabled: isSepolia,
    },
  });

  /*
   * ---------------------------------------------------------
   * DECIMALS
   * ---------------------------------------------------------
   */

  const { data: decimalsRaw } = useReadContract({
    address: CONTRACTS.AUSDStablecoin.address,
    abi: CONTRACTS.AUSDStablecoin.abi,
    functionName: "decimals",
    query: {
      enabled: isSepolia,
    },
  });

  /*
   * ---------------------------------------------------------
   * DEFAULT ADMIN
   * ---------------------------------------------------------
   */

  const { data: defaultAdminRaw } = useReadContract({
    address: CONTRACTS.AUSDStablecoin.address,
    abi: CONTRACTS.AUSDStablecoin.abi,
    functionName: "defaultAdmin",
    query: {
      enabled: isSepolia,
    },
  });

  /*
   * ---------------------------------------------------------
   * MINTER ROLE
   * ---------------------------------------------------------
   */

  const { data: minterRoleRaw } = useReadContract({
    address: CONTRACTS.AUSDStablecoin.address,
    abi: CONTRACTS.AUSDStablecoin.abi,
    functionName: "MINTER_ROLE",
    query: {
      enabled: isSepolia,
    },
  });

  /*
   * ---------------------------------------------------------
   * BURNER ROLE
   * ---------------------------------------------------------
   */

  const { data: burnerRoleRaw } = useReadContract({
    address: CONTRACTS.AUSDStablecoin.address,
    abi: CONTRACTS.AUSDStablecoin.abi,
    functionName: "BURNER_ROLE",
    query: {
      enabled: isSepolia,
    },
  });

  /*
   * ---------------------------------------------------------
   * ROLE STATUS
   * ---------------------------------------------------------
   *
   * We check the connected wallet's permissions when a wallet
   * is connected. This is informational only.
   * ---------------------------------------------------------
   */

  const { data: hasMinterRoleRaw } = useReadContract({
    address: CONTRACTS.AUSDStablecoin.address,
    abi: CONTRACTS.AUSDStablecoin.abi,
    functionName: "hasRole",
    args:
      address && typeof minterRoleRaw === "string"
        ? [minterRoleRaw, address]
        : undefined,
    query: {
      enabled:
        isSepolia &&
        !!address &&
        typeof minterRoleRaw === "string",
    },
  });

  const { data: hasBurnerRoleRaw } = useReadContract({
    address: CONTRACTS.AUSDStablecoin.address,
    abi: CONTRACTS.AUSDStablecoin.abi,
    functionName: "hasRole",
    args:
      address && typeof burnerRoleRaw === "string"
        ? [burnerRoleRaw, address]
        : undefined,
    query: {
      enabled:
        isSepolia &&
        !!address &&
        typeof burnerRoleRaw === "string",
    },
  });

  /*
   * ---------------------------------------------------------
   * NORMALIZE VALUES
   * ---------------------------------------------------------
   */

  const totalSupply =
    typeof totalSupplyRaw === "bigint"
      ? totalSupplyRaw
      : undefined;

  const userBalance =
    typeof userBalanceRaw === "bigint"
      ? userBalanceRaw
      : undefined;

  const tokenName =
    typeof nameRaw === "string"
      ? nameRaw
      : "AUSD";

  const tokenSymbol =
    typeof symbolRaw === "string"
      ? symbolRaw
      : "AUSD";

  const decimals =
    typeof decimalsRaw === "number"
      ? decimalsRaw
      : typeof decimalsRaw === "bigint"
        ? Number(decimalsRaw)
        : undefined;

  const defaultAdmin =
    typeof defaultAdminRaw === "string"
      ? defaultAdminRaw
      : undefined;

  const hasMinterRole =
    typeof hasMinterRoleRaw === "boolean"
      ? hasMinterRoleRaw
      : undefined;

  const hasBurnerRole =
    typeof hasBurnerRoleRaw === "boolean"
      ? hasBurnerRoleRaw
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
          AUSD STABLECOIN
        </p>

        <h2 className="mt-2 text-3xl font-bold text-white">
          Ethereum Sepolia Required
        </h2>

        <p className="mt-3 text-sm leading-6 text-gray-300">
          Switch MetaMask to Ethereum Sepolia to view the live
          AUSD stablecoin dashboard.
        </p>

      </section>
    );
  }

  /*
   * ---------------------------------------------------------
   * MAIN PANEL
   * ---------------------------------------------------------
   */

  return (
    <section className="mt-10 rounded-3xl border border-cyan-500/20 bg-[#070b1f] p-6 shadow-2xl shadow-cyan-950/20 md:p-8">

      {/* HEADER */}

      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">

        <div>

          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400">
            AUSD STABLECOIN
          </p>

          <h2 className="mt-2 text-3xl font-bold text-white md:text-4xl">
            AUSD Monetary Layer
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-400">
            Live on-chain information for the AETHERIS USD
            stablecoin deployed on Ethereum Sepolia.
          </p>

        </div>

        <div className="flex items-center gap-2 self-start rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2">

          <span className="h-2 w-2 rounded-full bg-green-400" />

          <span className="text-xs font-semibold text-green-400">
            LIVE SEPOLIA
          </span>

        </div>

      </div>

      {/* TOKEN OVERVIEW */}

      <div className="mt-8 grid gap-4 md:grid-cols-4">

        <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/80 p-5">

          <p className="text-xs uppercase tracking-wider text-gray-500">
            Token
          </p>

          <p className="mt-3 text-2xl font-bold text-white">
            {tokenName}
          </p>

          <p className="mt-1 text-sm text-cyan-400">
            {tokenSymbol}
          </p>

        </div>

        <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/80 p-5">

          <p className="text-xs uppercase tracking-wider text-gray-500">
            Decimals
          </p>

          <p className="mt-3 text-2xl font-bold text-white">
            {decimals ?? "Loading..."}
          </p>

        </div>

        <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/80 p-5">

          <p className="text-xs uppercase tracking-wider text-gray-500">
            Total Supply
          </p>

          <p className="mt-3 text-2xl font-bold text-cyan-400">
            {formatAmount(totalSupply)}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            AUSD
          </p>

        </div>

        <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/80 p-5">

          <p className="text-xs uppercase tracking-wider text-gray-500">
            Your Balance
          </p>

          <p className="mt-3 text-2xl font-bold text-white">
            {isConnected
              ? formatAmount(userBalance)
              : "Connect wallet"}
          </p>

          {isConnected && (
            <p className="mt-1 text-xs text-gray-500">
              AUSD
            </p>
          )}

        </div>

      </div>

      {/* USER BALANCE */}

      <div className="mt-6 rounded-2xl border border-cyan-500/20 bg-cyan-950/10 p-5">

        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
          YOUR AUSD POSITION
        </p>

        {!isConnected ? (
          <div className="mt-4">

            <h3 className="text-xl font-bold text-white">
              Connect your wallet
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-400">
              Connect MetaMask to view your personal AUSD
              balance.
            </p>

          </div>
        ) : (
          <div className="mt-4 grid gap-4 md:grid-cols-2">

            <div className="rounded-xl bg-slate-950/70 p-4">

              <p className="text-xs text-gray-500">
                Connected Wallet
              </p>

              <p className="mt-2 break-all font-mono text-sm text-gray-300">
                {address}
              </p>

            </div>

            <div className="rounded-xl bg-slate-950/70 p-4">

              <p className="text-xs text-gray-500">
                AUSD Balance
              </p>

              <p className="mt-2 text-2xl font-bold text-cyan-400">
                {formatAmount(userBalance)} AUSD
              </p>

            </div>

          </div>
        )}

      </div>

      {/* MONETARY ARCHITECTURE */}

      <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/60 p-5">

        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
          MONETARY ARCHITECTURE
        </p>

        <h3 className="mt-2 text-2xl font-bold text-white">
          AUSD Protocol Flow
        </h3>

        <div className="mt-5 grid gap-4 md:grid-cols-3">

          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">

            <p className="text-sm font-bold text-white">
              01 · Collateral
            </p>

            <p className="mt-2 text-xs leading-5 text-gray-500">
              Users deposit supported collateral into the AETHERIS
              Vault.
            </p>

          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">

            <p className="text-sm font-bold text-white">
              02 · Borrow
            </p>

            <p className="mt-2 text-xs leading-5 text-gray-500">
              Healthy Vault positions can borrow AUSD according to
              protocol risk parameters.
            </p>

          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">

            <p className="text-sm font-bold text-white">
              03 · Repayment
            </p>

            <p className="mt-2 text-xs leading-5 text-gray-500">
              AUSD debt can be repaid through the Vault, reducing
              the user's outstanding debt.
            </p>

          </div>

        </div>

      </div>

      {/* ROLE SECURITY */}

      <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/60 p-5">

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

          <div>

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
              ACCESS CONTROL
            </p>

            <h3 className="mt-2 text-xl font-bold text-white">
              AUSD Role Security
            </h3>

          </div>

          <StatusBadge
            active={true}
            label="ROLE-BASED"
          />

        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">

          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">

            <div className="flex items-center justify-between gap-3">

              <p className="font-semibold text-white">
                Minter Role
              </p>

              {isConnected && hasMinterRole !== undefined ? (
                <StatusBadge
                  active={hasMinterRole}
                  label={
                    hasMinterRole
                      ? "YOU HAVE ROLE"
                      : "NOT ASSIGNED"
                  }
                />
              ) : (
                <StatusBadge
                  active={true}
                  label="RESTRICTED"
                />
              )}

            </div>

            <p className="mt-3 text-xs leading-5 text-gray-500">
              AUSD minting is controlled through the deployed
              role-based access-control system.
            </p>

          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">

            <div className="flex items-center justify-between gap-3">

              <p className="font-semibold text-white">
                Burner Role
              </p>

              {isConnected && hasBurnerRole !== undefined ? (
                <StatusBadge
                  active={hasBurnerRole}
                  label={
                    hasBurnerRole
                      ? "YOU HAVE ROLE"
                      : "NOT ASSIGNED"
                  }
                />
              ) : (
                <StatusBadge
                  active={true}
                  label="RESTRICTED"
                />
              )}

            </div>

            <p className="mt-3 text-xs leading-5 text-gray-500">
              AUSD burning is restricted through the protocol's
              authorization layer.
            </p>

          </div>

        </div>

      </div>

      {/* ADMIN TRANSPARENCY */}

      <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/60 p-5">

        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
          ADMINISTRATIVE TRANSPARENCY
        </p>

        <h3 className="mt-2 text-xl font-bold text-white">
          Default Administrator
        </h3>

        <p className="mt-2 text-sm leading-6 text-gray-400">
          The current default administrator is displayed for
          transparency. Administrative controls are intentionally
          not exposed through the public dashboard.
        </p>

        <p className="mt-5 break-all rounded-xl bg-slate-900 px-4 py-3 font-mono text-xs text-gray-400">
          {defaultAdmin ?? "Loading..."}
        </p>

      </div>

      {/* CONTRACT */}

      <div className="mt-6 rounded-2xl border border-cyan-500/20 bg-slate-950/70 p-5">

        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
          AUSD CONTRACT
        </p>

        <p className="mt-3 break-all font-mono text-sm text-cyan-400">
          {CONTRACTS.AUSDStablecoin.address}
        </p>

        <div className="mt-4 flex flex-wrap gap-3">

          <a
            href={`https://sepolia.etherscan.io/address/${CONTRACTS.AUSDStablecoin.address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-cyan-500/30 px-4 py-2 text-sm font-semibold text-cyan-400 transition hover:bg-cyan-500/10"
          >
            View AUSD Contract
          </a>

          <a
            href={`https://sepolia.etherscan.io/token/${CONTRACTS.AUSDStablecoin.address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-gray-300 transition hover:bg-slate-800"
          >
            View Token Activity
          </a>

        </div>

      </div>

      {/* TESTNET NOTICE */}

      <div className="mt-6 rounded-2xl border border-yellow-500/20 bg-yellow-950/10 p-5">

        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-yellow-400">
          TESTNET NOTICE
        </p>

        <p className="mt-2 text-sm leading-6 text-gray-300">
          AUSD is currently displayed from the AETHERIS Ethereum
          Sepolia deployment. Testnet balances and supply figures
          should not be interpreted as production monetary
          statistics.
        </p>

      </div>

      {/* FOOTER */}

      <div className="mt-6 border-t border-slate-800 pt-5">

        <div className="flex flex-col gap-2 text-xs text-gray-500 md:flex-row md:items-center md:justify-between">

          <p>
            Network: Ethereum Sepolia
          </p>

          <p>
            Token: {tokenSymbol}
          </p>

          <p>
            Decimals: {decimals ?? "..."}
          </p>

        </div>

      </div>

    </section>
  );
}
