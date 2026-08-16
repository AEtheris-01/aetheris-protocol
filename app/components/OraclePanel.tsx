"use client";

import {
  useChainId,
  useReadContract,
} from "wagmi";
import { formatEther, formatUnits } from "viem";
import { sepolia } from "wagmi/chains";
import { CONTRACTS } from "../lib/contracts";

type PriceData = readonly [bigint, bigint] | undefined;

function formatPrice(value: bigint | undefined) {
  if (value === undefined) {
    return "Unavailable";
  }

  return `$${Number(formatEther(value)).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  })}`;
}

function formatTimestamp(value: bigint | undefined) {
  if (value === undefined) {
    return "Unavailable";
  }

  const timestamp = Number(value);

  if (!timestamp) {
    return "Unknown";
  }

  return new Date(timestamp * 1000).toLocaleString();
}

function ageSeconds(value: bigint | undefined) {
  if (value === undefined) {
    return undefined;
  }

  const timestamp = Number(value);

  if (!timestamp) {
    return undefined;
  }

  return Math.max(
    0,
    Math.floor(Date.now() / 1000) - timestamp
  );
}

function normalizePriceData(
  value: unknown
): PriceData {
  if (!Array.isArray(value)) {
    return undefined;
  }

  if (value.length < 2) {
    return undefined;
  }

  const price = value[0];
  const timestamp = value[1];

  if (
    typeof price !== "bigint" ||
    typeof timestamp !== "bigint"
  ) {
    return undefined;
  }

  return [price, timestamp];
}

function StatusBadge({
  fresh,
  loading,
  error,
}: {
  fresh: boolean | undefined;
  loading?: boolean;
  error?: boolean;
}) {
  if (loading) {
    return (
      <span className="rounded-full bg-slate-700 px-3 py-1 text-xs font-semibold text-gray-300">
        LOADING
      </span>
    );
  }

  if (error) {
    return (
      <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-400">
        READ ERROR
      </span>
    );
  }

  if (fresh === undefined) {
    return (
      <span className="rounded-full bg-slate-700 px-3 py-1 text-xs font-semibold text-gray-300">
        CHECKING
      </span>
    );
  }

  if (fresh) {
    return (
      <span className="inline-flex items-center gap-2 rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-400">
        <span className="h-2 w-2 rounded-full bg-green-400" />
        FRESH
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-400">
      <span className="h-2 w-2 rounded-full bg-red-400" />
      STALE
    </span>
  );
}

function PriceCard({
  symbol,
  price,
  updatedAt,
  fresh,
  loading,
  error,
}: {
  symbol: string;
  price: bigint | undefined;
  updatedAt: bigint | undefined;
  fresh: boolean | undefined;
  loading: boolean;
  error: boolean;
}) {
  const age = ageSeconds(updatedAt);

  return (
    <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/80 p-5">

      <div className="flex items-start justify-between gap-3">

        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
            Oracle Asset
          </p>

          <h3 className="mt-2 text-2xl font-bold text-white">
            {symbol}
          </h3>
        </div>

        <StatusBadge
          fresh={fresh}
          loading={loading}
          error={error}
        />

      </div>

      <p className="mt-6 text-3xl font-bold text-cyan-400">
        {loading
          ? "Loading..."
          : error
            ? "Unavailable"
            : formatPrice(price)}
      </p>

      <div className="mt-5 border-t border-slate-800 pt-4">

        <p className="text-xs text-gray-500">
          Last Update
        </p>

        <p className="mt-1 text-sm text-gray-300">
          {formatTimestamp(updatedAt)}
        </p>

        <p className="mt-3 text-xs text-gray-500">
          Data Age
        </p>

        <p
          className={`mt-1 text-sm font-semibold ${
            fresh
              ? "text-green-400"
              : fresh === false
                ? "text-red-400"
                : "text-gray-400"
          }`}
        >
          {age === undefined
            ? loading
              ? "Loading..."
              : "Unavailable"
            : `${age.toLocaleString()} seconds`}
        </p>

      </div>

    </div>
  );
}

export default function OraclePanel() {
  const chainId = useChainId();

  const isSepolia =
    chainId === sepolia.id;

  /*
   * =========================================================
   * ETH PRICE
   * =========================================================
   */

  const {
    data: ethPriceRaw,
    error: ethPriceError,
    isLoading: ethPriceLoading,
    refetch: refetchEthPrice,
  } = useReadContract({
    address: CONTRACTS.PriceOracle.address,
    abi: CONTRACTS.PriceOracle.abi,
    functionName: "getETHPrice",
    query: {
      enabled: isSepolia,
      refetchInterval: 30_000,
    },
  });

  /*
   * =========================================================
   * ETH PRICE DATA
   * =========================================================
   */

  const {
    data: ethPriceDataRaw,
    error: ethPriceDataError,
    isLoading: ethPriceDataLoading,
    refetch: refetchEthData,
  } = useReadContract({
    address: CONTRACTS.PriceOracle.address,
    abi: CONTRACTS.PriceOracle.abi,
    functionName: "getETHPriceData",
    query: {
      enabled: isSepolia,
      refetchInterval: 30_000,
    },
  });

  /*
   * =========================================================
   * BTC PRICE
   * =========================================================
   */

  const {
    data: btcPriceRaw,
    error: btcPriceError,
    isLoading: btcPriceLoading,
    refetch: refetchBtcPrice,
  } = useReadContract({
    address: CONTRACTS.PriceOracle.address,
    abi: CONTRACTS.PriceOracle.abi,
    functionName: "getBTCPrice",
    query: {
      enabled: isSepolia,
      refetchInterval: 30_000,
    },
  });

  /*
   * =========================================================
   * BTC PRICE DATA
   * =========================================================
   */

  const {
    data: btcPriceDataRaw,
    error: btcPriceDataError,
    isLoading: btcPriceDataLoading,
    refetch: refetchBtcData,
  } = useReadContract({
    address: CONTRACTS.PriceOracle.address,
    abi: CONTRACTS.PriceOracle.abi,
    functionName: "getBTCPriceData",
    query: {
      enabled: isSepolia,
      refetchInterval: 30_000,
    },
  });

  /*
   * =========================================================
   * AETR PRICE
   * =========================================================
   */

  const {
    data: aetrPriceRaw,
    error: aetrPriceError,
    isLoading: aetrPriceLoading,
    refetch: refetchAetrPrice,
  } = useReadContract({
    address: CONTRACTS.PriceOracle.address,
    abi: CONTRACTS.PriceOracle.abi,
    functionName: "getAETRPrice",
    query: {
      enabled: isSepolia,
      refetchInterval: 30_000,
    },
  });

  /*
   * =========================================================
   * AETR PRICE DATA
   * =========================================================
   */

  const {
    data: aetrPriceDataRaw,
    error: aetrPriceDataError,
    isLoading: aetrPriceDataLoading,
    refetch: refetchAetrData,
  } = useReadContract({
    address: CONTRACTS.PriceOracle.address,
    abi: CONTRACTS.PriceOracle.abi,
    functionName: "getAETRPriceData",
    query: {
      enabled: isSepolia,
      refetchInterval: 30_000,
    },
  });

  /*
   * =========================================================
   * MAX PRICE AGE
   * =========================================================
   */

  const {
    data: maxPriceAgeRaw,
    error: maxPriceAgeError,
    isLoading: maxPriceAgeLoading,
    refetch: refetchMaxAge,
  } = useReadContract({
    address: CONTRACTS.PriceOracle.address,
    abi: CONTRACTS.PriceOracle.abi,
    functionName: "maxPriceAge",
    query: {
      enabled: isSepolia,
      refetchInterval: 30_000,
    },
  });

  /*
   * =========================================================
   * NORMALIZE VALUES
   * =========================================================
   */

  const ethPrice =
    typeof ethPriceRaw === "bigint"
      ? ethPriceRaw
      : undefined;

  const btcPrice =
    typeof btcPriceRaw === "bigint"
      ? btcPriceRaw
      : undefined;

  const aetrPrice =
    typeof aetrPriceRaw === "bigint"
      ? aetrPriceRaw
      : undefined;

  const ethPriceData =
    normalizePriceData(ethPriceDataRaw);

  const btcPriceData =
    normalizePriceData(btcPriceDataRaw);

  const aetrPriceData =
    normalizePriceData(aetrPriceDataRaw);

  const ethUpdatedAt =
    ethPriceData?.[1];

  const btcUpdatedAt =
    btcPriceData?.[1];

  const aetrUpdatedAt =
    aetrPriceData?.[1];

  const maxPriceAge =
    typeof maxPriceAgeRaw === "bigint"
      ? maxPriceAgeRaw
      : undefined;

  /*
   * =========================================================
   * AGES
   * =========================================================
   */

  const ethAge =
    ageSeconds(ethUpdatedAt);

  const btcAge =
    ageSeconds(btcUpdatedAt);

  const aetrAge =
    ageSeconds(aetrUpdatedAt);

  const maxAge =
    maxPriceAge !== undefined
      ? Number(maxPriceAge)
      : undefined;

  /*
   * =========================================================
   * FRESHNESS
   * =========================================================
   */

  const ethFresh =
    ethAge !== undefined &&
    maxAge !== undefined
      ? ethAge <= maxAge
      : undefined;

  const btcFresh =
    btcAge !== undefined &&
    maxAge !== undefined
      ? btcAge <= maxAge
      : undefined;

  const aetrFresh =
    aetrAge !== undefined &&
    maxAge !== undefined
      ? aetrAge <= maxAge
      : undefined;

  const ethError =
    !!ethPriceError ||
    !!ethPriceDataError;

  const btcError =
    !!btcPriceError ||
    !!btcPriceDataError;

  const aetrError =
    !!aetrPriceError ||
    !!aetrPriceDataError;

  const ethLoading =
    ethPriceLoading ||
    ethPriceDataLoading;

  const btcLoading =
    btcPriceLoading ||
    btcPriceDataLoading;

  const aetrLoading =
    aetrPriceLoading ||
    aetrPriceDataLoading;

  const anyOracleLoading =
    ethLoading ||
    btcLoading ||
    aetrLoading ||
    maxPriceAgeLoading;

  const anyOracleError =
    ethError ||
    btcError ||
    aetrError ||
    !!maxPriceAgeError;

  const allFresh =
    !anyOracleLoading &&
    !anyOracleError &&
    ethFresh === true &&
    btcFresh === true &&
    aetrFresh === true;

  /*
   * =========================================================
   * REFRESH
   * =========================================================
   */

  async function refreshOracle() {
    await Promise.all([
      refetchEthPrice(),
      refetchEthData(),
      refetchBtcPrice(),
      refetchBtcData(),
      refetchAetrPrice(),
      refetchAetrData(),
      refetchMaxAge(),
    ]);
  }

  /*
   * =========================================================
   * WRONG NETWORK
   * =========================================================
   */

  if (!isSepolia) {
    return (
      <section className="mt-10 rounded-3xl border border-yellow-500/30 bg-yellow-950/20 p-6 md:p-8">

        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-yellow-400">
          PRICE ORACLE
        </p>

        <h2 className="mt-2 text-3xl font-bold text-white">
          Ethereum Sepolia Required
        </h2>

        <p className="mt-3 text-sm leading-6 text-gray-300">
          Switch MetaMask to Ethereum Sepolia to view
          the live AETHERIS oracle data.
        </p>

      </section>
    );
  }

  /*
   * =========================================================
   * MAIN PANEL
   * =========================================================
   */

  return (
    <section className="mt-10 rounded-3xl border border-cyan-500/20 bg-[#070b1f] p-6 shadow-2xl shadow-cyan-950/20 md:p-8">

      {/* Header */}

      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">

        <div>

          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400">
            PRICE ORACLE
          </p>

          <h2 className="mt-2 text-3xl font-bold text-white md:text-4xl">
            AETHERIS Market Data
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-400">
            Live ETH, BTC and AETR price information from
            the deployed AETHERIS V2 PriceOracle contract.
          </p>

        </div>

        <div
          className={`flex items-center gap-2 self-start rounded-full px-4 py-2 ${
            allFresh
              ? "border border-green-500/30 bg-green-500/10"
              : anyOracleError
                ? "border border-red-500/30 bg-red-500/10"
                : "border border-yellow-500/30 bg-yellow-500/10"
          }`}
        >

          <span
            className={`h-2 w-2 rounded-full ${
              allFresh
                ? "bg-green-400"
                : anyOracleError
                  ? "bg-red-400"
                  : "bg-yellow-400"
            }`}
          />

          <span
            className={`text-xs font-semibold ${
              allFresh
                ? "text-green-400"
                : anyOracleError
                  ? "text-red-400"
                  : "text-yellow-400"
            }`}
          >
            {allFresh
              ? "ORACLE HEALTHY"
              : anyOracleError
                ? "ORACLE READ ERROR"
                : "CHECKING ORACLE"}
          </span>

        </div>

      </div>


      {/* Price Cards */}

      <div className="mt-8 grid gap-4 md:grid-cols-3">

        <PriceCard
          symbol="ETH / USD"
          price={ethPrice}
          updatedAt={ethUpdatedAt}
          fresh={ethFresh}
          loading={ethLoading}
          error={ethError}
        />

        <PriceCard
          symbol="BTC / USD"
          price={btcPrice}
          updatedAt={btcUpdatedAt}
          fresh={btcFresh}
          loading={btcLoading}
          error={btcError}
        />

        <PriceCard
          symbol="AETR / USD"
          price={aetrPrice}
          updatedAt={aetrUpdatedAt}
          fresh={aetrFresh}
          loading={aetrLoading}
          error={aetrError}
        />

      </div>


      {/* Oracle Configuration */}

      <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/60 p-5">

        <h3 className="text-lg font-bold text-white">
          Oracle Configuration
        </h3>

        <div className="mt-5 grid gap-5 md:grid-cols-3">

          <div>

            <p className="text-xs uppercase tracking-wider text-gray-500">
              Maximum Price Age
            </p>

            <p className="mt-2 text-xl font-bold text-cyan-400">

              {maxPriceAgeLoading
                ? "Loading..."
                : maxPriceAgeError
                  ? "Unavailable"
                  : maxAge === undefined
                    ? "Unavailable"
                    : `${maxAge.toLocaleString()} seconds`}

            </p>

            {maxAge !== undefined && (
              <p className="mt-1 text-xs text-gray-500">
                {(maxAge / 60).toFixed(1)} minutes
              </p>
            )}

          </div>


          <div>

            <p className="text-xs uppercase tracking-wider text-gray-500">
              ETH Status
            </p>

            <div className="mt-2">
              <StatusBadge
                fresh={ethFresh}
                loading={ethLoading}
                error={ethError}
              />
            </div>

          </div>


          <div>

            <p className="text-xs uppercase tracking-wider text-gray-500">
              BTC Status
            </p>

            <div className="mt-2">
              <StatusBadge
                fresh={btcFresh}
                loading={btcLoading}
                error={btcError}
              />
            </div>

          </div>

        </div>

      </div>


      {/* AETR Status */}

      <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-5">

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

          <div>

            <p className="text-xs uppercase tracking-wider text-gray-500">
              AETR Oracle Status
            </p>

            <p className="mt-1 text-sm text-gray-400">
              AETR market price used by the protocol's
              oracle layer.
            </p>

          </div>

          <StatusBadge
            fresh={aetrFresh}
            loading={aetrLoading}
            error={aetrError}
          />

        </div>

      </div>


      {/* Error Details */}

      {anyOracleError && (
        <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-950/20 p-5">

          <div className="flex gap-3">

            <div className="mt-1 h-3 w-3 shrink-0 rounded-full bg-red-400" />

            <div className="min-w-0">

              <h3 className="font-bold text-red-400">
                Oracle Contract Read Error
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-300">
                One or more PriceOracle contract reads failed.
                Check that the deployed PriceOracle address,
                ABI and Sepolia network are correct.
              </p>

              {ethPriceError && (
                <p className="mt-3 break-words text-xs text-red-300">
                  ETH: {ethPriceError.message}
                </p>
              )}

              {ethPriceDataError && (
                <p className="mt-2 break-words text-xs text-red-300">
                  ETH data: {ethPriceDataError.message}
                </p>
              )}

              {btcPriceError && (
                <p className="mt-2 break-words text-xs text-red-300">
                  BTC: {btcPriceError.message}
                </p>
              )}

              {btcPriceDataError && (
                <p className="mt-2 break-words text-xs text-red-300">
                  BTC data: {btcPriceDataError.message}
                </p>
              )}

              {aetrPriceError && (
                <p className="mt-2 break-words text-xs text-red-300">
                  AETR: {aetrPriceError.message}
                </p>
              )}

              {aetrPriceDataError && (
                <p className="mt-2 break-words text-xs text-red-300">
                  AETR data: {aetrPriceDataError.message}
                </p>
              )}

              {maxPriceAgeError && (
                <p className="mt-2 break-words text-xs text-red-300">
                  Max age: {maxPriceAgeError.message}
                </p>
              )}

            </div>

          </div>

        </div>
      )}


      {/* Stale Warning */}

      {!anyOracleError &&
        !anyOracleLoading &&
        !allFresh && (
          <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-950/20 p-5">

            <div className="flex gap-3">

              <div className="mt-1 h-3 w-3 shrink-0 rounded-full bg-red-400" />

              <div>

                <h3 className="font-bold text-red-400">
                  Oracle Freshness Warning
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-300">
                  One or more oracle prices are older than
                  the configured maximum price age.
                  Protocol users should treat stale oracle
                  data as a risk condition.
                </p>

              </div>

            </div>

          </div>
        )}


      {/* Refresh */}

      <button
        type="button"
        onClick={refreshOracle}
        disabled={anyOracleLoading}
        className="mt-6 w-full rounded-xl border border-cyan-500/30 px-4 py-3 text-sm font-semibold text-cyan-400 transition hover:bg-cyan-500/10 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {anyOracleLoading
          ? "Reading Oracle..."
          : "Refresh Oracle Data"}
      </button>


      {/* Contract */}

      <div className="mt-6 border-t border-slate-800 pt-5">

        <div className="flex flex-col gap-2 text-xs text-gray-500 md:flex-row md:items-center md:justify-between">

          <p>
            Network: Ethereum Sepolia
          </p>

          <p className="break-all">
            Oracle Contract:{" "}
            <span className="text-gray-400">
              {CONTRACTS.PriceOracle.address}
            </span>
          </p>

        </div>

      </div>

    </section>
  );
}
