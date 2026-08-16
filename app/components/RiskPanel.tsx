"use client";

import { useState } from "react";
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

function asBigInt(value: unknown): bigint | undefined {
  return typeof value === "bigint" ? value : undefined;
}

function formatValue(value: bigint | undefined): string {
  if (value === undefined) {
    return "Loading...";
  }

  return Number(formatEther(value)).toLocaleString("en-US", {
    maximumFractionDigits: 6,
  });
}

function calculateLTV(
  debt: bigint | undefined,
  collateralValue: bigint | undefined
): string {
  if (
    debt === undefined ||
    collateralValue === undefined ||
    collateralValue === 0n
  ) {
    return "—";
  }

  const ltv =
    Number((debt * 10000n) / collateralValue) / 100;

  return `${ltv.toFixed(2)}%`;
}

function percentageFromBps(
  value: bigint | undefined
): string {
  if (value === undefined) {
    return "Loading...";
  }

  return `${(Number(value) / 100).toFixed(2)}%`;
}

function StatCard({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/80 p-5">
      <p className="text-xs uppercase tracking-wider text-gray-400">
        {title}
      </p>

      <p className="mt-3 break-words text-2xl font-bold text-white">
        {value}
      </p>

      <p className="mt-2 text-xs leading-5 text-gray-500">
        {description}
      </p>
    </div>
  );
}

export default function RiskPanel() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();

  const [liquidationUser, setLiquidationUser] =
    useState("");

  const [liquidationAmount, setLiquidationAmount] =
    useState("");

  const [message, setMessage] = useState("");

  const isSepolia =
    chainId === sepolia.id;

  /*
   * ---------------------------------------------------------
   * USER COLLATERAL
   * ---------------------------------------------------------
   */

  const {
    data: collateralRaw,
    refetch: refetchCollateral,
  } = useReadContract({
    address: CONTRACTS.Vault.address,
    abi: CONTRACTS.Vault.abi,
    functionName: "ethCollateral",
    args: address ? [address] : undefined,
    query: {
      enabled:
        !!address &&
        isSepolia,
    },
  });

  /*
   * ---------------------------------------------------------
   * USER COLLATERAL VALUE
   * ---------------------------------------------------------
   */

  const {
    data: collateralValueRaw,
    refetch: refetchCollateralValue,
  } = useReadContract({
    address: CONTRACTS.Vault.address,
    abi: CONTRACTS.Vault.abi,
    functionName: "collateralValue",
    args: address ? [address] : undefined,
    query: {
      enabled:
        !!address &&
        isSepolia,
    },
  });

  /*
   * ---------------------------------------------------------
   * USER DEBT
   * ---------------------------------------------------------
   */

  const {
    data: debtRaw,
    refetch: refetchDebt,
  } = useReadContract({
    address: CONTRACTS.Vault.address,
    abi: CONTRACTS.Vault.abi,
    functionName: "ausdDebt",
    args: address ? [address] : undefined,
    query: {
      enabled:
        !!address &&
        isSepolia,
    },
  });

  /*
   * ---------------------------------------------------------
   * MAX BORROW
   * ---------------------------------------------------------
   */

  const {
    data: maxBorrowRaw,
    refetch: refetchMaxBorrow,
  } = useReadContract({
    address: CONTRACTS.Vault.address,
    abi: CONTRACTS.Vault.abi,
    functionName: "maxBorrow",
    args: address ? [address] : undefined,
    query: {
      enabled:
        !!address &&
        isSepolia,
    },
  });

  /*
   * ---------------------------------------------------------
   * HEALTH
   * ---------------------------------------------------------
   */

  const {
    data: healthyRaw,
    refetch: refetchHealthy,
  } = useReadContract({
    address: CONTRACTS.Vault.address,
    abi: CONTRACTS.Vault.abi,
    functionName: "isHealthy",
    args: address ? [address] : undefined,
    query: {
      enabled:
        !!address &&
        isSepolia,
    },
  });

  /*
   * ---------------------------------------------------------
   * VAULT PARAMETERS
   * ---------------------------------------------------------
   */

  const { data: maxLtvRaw } =
    useReadContract({
      address: CONTRACTS.Vault.address,
      abi: CONTRACTS.Vault.abi,
      functionName: "MAX_LTV_BPS",
      query: {
        enabled: isSepolia,
      },
    });

  const { data: liquidationThresholdRaw } =
    useReadContract({
      address: CONTRACTS.Vault.address,
      abi: CONTRACTS.Vault.abi,
      functionName: "LIQUIDATION_THRESHOLD_BPS",
      query: {
        enabled: isSepolia,
      },
    });

  const { data: liquidationBonusRaw } =
    useReadContract({
      address: CONTRACTS.Vault.address,
      abi: CONTRACTS.Vault.abi,
      functionName: "LIQUIDATION_BONUS_BPS",
      query: {
        enabled: isSepolia,
      },
    });

  const { data: borrowFeeRaw } =
    useReadContract({
      address: CONTRACTS.Vault.address,
      abi: CONTRACTS.Vault.abi,
      functionName: "BORROW_FEE_BPS",
      query: {
        enabled: isSepolia,
      },
    });

  const { data: maxCloseFactorRaw } =
    useReadContract({
      address: CONTRACTS.Vault.address,
      abi: CONTRACTS.Vault.abi,
      functionName: "MAX_LIQUIDATION_CLOSE_FACTOR_BPS",
      query: {
        enabled: isSepolia,
      },
    });

  /*
   * ---------------------------------------------------------
   * TOTAL PROTOCOL POSITION
   * ---------------------------------------------------------
   */

  const { data: totalCollateralRaw } =
    useReadContract({
      address: CONTRACTS.Vault.address,
      abi: CONTRACTS.Vault.abi,
      functionName: "totalETHCollateral",
      query: {
        enabled: isSepolia,
      },
    });

  const { data: totalDebtRaw } =
    useReadContract({
      address: CONTRACTS.Vault.address,
      abi: CONTRACTS.Vault.abi,
      functionName: "totalAUSDDebt",
      query: {
        enabled: isSepolia,
      },
    });

  /*
   * ---------------------------------------------------------
   * NORMALIZE VALUES
   * ---------------------------------------------------------
   */

  const collateral = asBigInt(collateralRaw);
  const collateralValue = asBigInt(
    collateralValueRaw
  );
  const debt = asBigInt(debtRaw);
  const maxBorrow = asBigInt(maxBorrowRaw);

  const maxLtv = asBigInt(maxLtvRaw);
  const liquidationThreshold =
    asBigInt(liquidationThresholdRaw);
  const liquidationBonus =
    asBigInt(liquidationBonusRaw);

  const borrowFee = asBigInt(borrowFeeRaw);
  const maxCloseFactor =
    asBigInt(maxCloseFactorRaw);

  const totalCollateral =
    asBigInt(totalCollateralRaw);

  const totalDebt =
    asBigInt(totalDebtRaw);

  const isHealthy =
    typeof healthyRaw === "boolean"
      ? healthyRaw
      : undefined;

  /*
   * ---------------------------------------------------------
   * AVAILABLE BORROW
   * ---------------------------------------------------------
   */

  const availableBorrow =
    maxBorrow !== undefined &&
    debt !== undefined &&
    maxBorrow > debt
      ? maxBorrow - debt
      : maxBorrow !== undefined &&
          debt !== undefined
        ? 0n
        : undefined;

  /*
   * ---------------------------------------------------------
   * LIQUIDATION WRITE
   * ---------------------------------------------------------
   */

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

  /*
   * ---------------------------------------------------------
   * REFRESH
   * ---------------------------------------------------------
   */

  async function refreshAll() {
    await Promise.all([
      refetchCollateral(),
      refetchCollateralValue(),
      refetchDebt(),
      refetchMaxBorrow(),
      refetchHealthy(),
    ]);
  }

  /*
   * ---------------------------------------------------------
   * LIQUIDATE
   * ---------------------------------------------------------
   */

  async function liquidate() {
    if (!isConnected || !address) {
      setMessage(
        "Connect your wallet first."
      );
      return;
    }

    if (!isSepolia) {
      setMessage(
        "Please switch MetaMask to Ethereum Sepolia."
      );
      return;
    }

    if (!liquidationUser) {
      setMessage(
        "Enter the Vault owner address."
      );
      return;
    }

    if (
      !liquidationUser.startsWith("0x") ||
      liquidationUser.length !== 42
    ) {
      setMessage(
        "Enter a valid Ethereum address."
      );
      return;
    }

    if (
      !liquidationAmount ||
      Number(liquidationAmount) <= 0
    ) {
      setMessage(
        "Enter the AUSD debt amount to repay."
      );
      return;
    }

    let amount: bigint;

    try {
      amount =
        parseEther(liquidationAmount);
    } catch {
      setMessage(
        "Invalid liquidation amount."
      );
      return;
    }

    try {
      setMessage(
        "Waiting for MetaMask..."
      );

      const hash =
        await writeContractAsync({
          address:
            CONTRACTS.Vault.address,
          abi: CONTRACTS.Vault.abi,
          functionName: "liquidate",
          args: [
            liquidationUser as `0x${string}`,
            amount,
          ],
        });

      setMessage(
        `Liquidation submitted: ${hash.slice(
          0,
          10
        )}...`
      );
    } catch (error) {
      console.error(error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Liquidation failed."
      );
    }
  }

  /*
   * ---------------------------------------------------------
   * DISCONNECTED
   * ---------------------------------------------------------
   */

  if (!isConnected) {
    return (
      <section className="mt-10 rounded-3xl border border-cyan-500/20 bg-[#070b1f] p-6 md:p-8">

        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
          RISK ENGINE
        </p>

        <h2 className="mt-2 text-3xl font-bold text-white">
          Liquidation & Risk
        </h2>

        <p className="mt-3 text-sm text-gray-400">
          Connect your wallet to view your live Vault risk
          position.
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
          Switch MetaMask to Ethereum Sepolia to use the
          AETHERIS risk engine.
        </p>

      </section>
    );
  }

  /*
   * ---------------------------------------------------------
   * MAIN UI
   * ---------------------------------------------------------
   */

  return (
    <section className="mt-10 rounded-3xl border border-cyan-500/20 bg-[#070b1f] p-6 shadow-2xl shadow-cyan-950/20 md:p-8">

      {/* Header */}

      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">

        <div>

          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400">
            RISK ENGINE
          </p>

          <h2 className="mt-2 text-3xl font-bold text-white md:text-4xl">
            Liquidation & Risk
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-400">
            Live Vault collateral, debt and liquidation
            parameters from the deployed AETHERIS V2 Vault.
          </p>

        </div>

        <div className="flex items-center gap-2 self-start rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2">

          <span className="h-2 w-2 rounded-full bg-green-400" />

          <span className="text-xs font-semibold text-green-400">
            LIVE SEPOLIA
          </span>

        </div>

      </div>

      {/* User Risk Status */}

      <div className="mt-8 rounded-2xl border border-cyan-500/20 bg-slate-900/70 p-6">

        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

          <div>

            <p className="text-xs uppercase tracking-wider text-gray-400">
              Your Vault Status
            </p>

            <h3 className="mt-2 text-2xl font-bold text-white">
              {isHealthy === undefined
                ? "Checking..."
                : isHealthy
                  ? "Healthy"
                  : "Liquidation Risk"}
            </h3>

          </div>

          <div
            className={`rounded-full px-5 py-2 text-sm font-semibold ${
              isHealthy === undefined
                ? "bg-slate-800 text-gray-400"
                : isHealthy
                  ? "bg-green-500/15 text-green-400"
                  : "bg-red-500/15 text-red-400"
            }`}
          >
            {isHealthy === undefined
              ? "UNKNOWN"
              : isHealthy
                ? "HEALTHY"
                : "AT RISK"}
          </div>

        </div>

      </div>

      {/* User Position */}

      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="ETH Collateral"
          value={`${formatValue(collateral)} ETH`}
          description="ETH deposited into your Vault"
        />

        <StatCard
          title="Collateral Value"
          value={`${formatValue(collateralValue)} USD`}
          description="Oracle-derived collateral value"
        />

        <StatCard
          title="AUSD Debt"
          value={`${formatValue(debt)} AUSD`}
          description="Current AUSD debt position"
        />

        <StatCard
          title="Maximum Borrow"
          value={`${formatValue(maxBorrow)} AUSD`}
          description="Maximum borrow capacity under current collateral"
        />

      </div>

      {/* Risk Metrics */}

      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Current LTV"
          value={calculateLTV(
            debt,
            collateralValue
          )}
          description="Debt divided by current collateral value"
        />

        <StatCard
          title="Available Borrow"
          value={`${formatValue(availableBorrow)} AUSD`}
          description="Remaining borrowing capacity"
        />

        <StatCard
          title="Maximum LTV"
          value={percentageFromBps(maxLtv)}
          description="Maximum loan-to-value parameter"
        />

        <StatCard
          title="Liquidation Threshold"
          value={percentageFromBps(
            liquidationThreshold
          )}
          description="Vault liquidation threshold"
        />

      </div>

      {/* Protocol Parameters */}

      <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/60 p-5">

        <h3 className="text-lg font-bold text-cyan-400">
          Vault Risk Parameters
        </h3>

        <div className="mt-4 grid gap-4 md:grid-cols-3">

          <div>
            <p className="text-xs text-gray-500">
              Liquidation Bonus
            </p>

            <p className="mt-1 text-lg font-semibold text-white">
              {percentageFromBps(
                liquidationBonus
              )}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">
              Borrow Fee
            </p>

            <p className="mt-1 text-lg font-semibold text-white">
              {percentageFromBps(
                borrowFee
              )}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">
              Max Liquidation Close Factor
            </p>

            <p className="mt-1 text-lg font-semibold text-white">
              {percentageFromBps(
                maxCloseFactor
              )}
            </p>
          </div>

        </div>

      </div>

      {/* Protocol Totals */}

      <div className="mt-6 rounded-2xl border border-cyan-500/20 bg-slate-900/50 p-5">

        <h3 className="text-lg font-bold text-white">
          Protocol Vault Statistics
        </h3>

        <div className="mt-4 grid gap-4 md:grid-cols-2">

          <div>
            <p className="text-xs text-gray-500">
              Total ETH Collateral
            </p>

            <p className="mt-2 text-xl font-bold text-cyan-400">
              {formatValue(totalCollateral)} ETH
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">
              Total AUSD Debt
            </p>

            <p className="mt-2 text-xl font-bold text-cyan-400">
              {formatValue(totalDebt)} AUSD
            </p>
          </div>

        </div>

      </div>

      {/* Liquidation */}

      <div className="mt-8 rounded-2xl border border-red-500/20 bg-red-950/10 p-5">

        <p className="text-xs font-semibold uppercase tracking-wider text-red-400">
          LIQUIDATOR INTERFACE
        </p>

        <h3 className="mt-2 text-2xl font-bold text-white">
          Liquidate a Vault
        </h3>

        <p className="mt-2 text-sm leading-6 text-gray-400">
          Enter a Vault owner address and the amount of AUSD debt
          you intend to repay. The Vault contract itself determines
          whether the position is eligible for liquidation.
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-2">

          <div>

            <label className="text-sm text-gray-400">
              Vault Owner Address
            </label>

            <input
              type="text"
              value={liquidationUser}
              onChange={(event) =>
                setLiquidationUser(
                  event.target.value
                )
              }
              placeholder="0x..."
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-red-400"
            />

          </div>

          <div>

            <label className="text-sm text-gray-400">
              AUSD Debt to Repay
            </label>

            <input
              type="text"
              inputMode="decimal"
              value={liquidationAmount}
              onChange={(event) =>
                setLiquidationAmount(
                  event.target.value
                )
              }
              placeholder="0.0"
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-red-400"
            />

          </div>

        </div>

        <button
          type="button"
          onClick={liquidate}
          disabled={
            isPending ||
            isConfirming ||
            !liquidationUser ||
            !liquidationAmount
          }
          className="mt-5 w-full rounded-xl bg-red-500 px-5 py-3 font-semibold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isPending || isConfirming
            ? "Processing..."
            : "Liquidate Vault"}
        </button>

      </div>

      {/* Transaction */}

      {message && (
        <div className="mt-5 rounded-xl border border-cyan-500/20 bg-slate-900 p-4">

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
          className="mt-4 w-full rounded-xl border border-cyan-500/30 px-4 py-3 text-sm font-semibold text-cyan-400 hover:bg-cyan-500/10"
        >
          Refresh Risk Data
        </button>
      )}

      {/* Contract */}

      <div className="mt-6 border-t border-slate-800 pt-5">

        <div className="flex flex-col gap-2 text-xs text-gray-500 md:flex-row md:items-center md:justify-between">

          <p>
            Network: Ethereum Sepolia
          </p>

          <p className="break-all">
            Vault Contract:{" "}
            <span className="text-gray-400">
              {CONTRACTS.Vault.address}
            </span>
          </p>

        </div>

      </div>

    </section>
  );
}
