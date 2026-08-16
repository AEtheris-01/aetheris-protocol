"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useAccount,
  usePublicClient,
} from "wagmi";

import {
  parseAbiItem,
} from "viem";

import {
  CONTRACTS,
} from "../lib/contracts";

/*
 * ============================================================
 * AETHERIS AIRDROP
 * ============================================================
 *
 * The leaderboard displays AETHERIS POINTS.
 *
 * Points are NOT AETR tokens.
 *
 * Final AETR allocation can be calculated later from the
 * final points snapshot.
 *
 * ============================================================
 */

const POINTS = {
  DEPOSIT: 100,
  BORROW: 150,
  REPAY: 75,
  STAKE: 100,
  SAD_MONKEY: 250,
} as const;

type Address = `0x${string}`;

type ActivityMap = Record<string, number>;

type LeaderboardEntry = {
  address: string;
  points: number;
};

type EventLog = {
  args: {
    user?: Address;
  };
};

/*
 * ============================================================
 * EVENT DEFINITIONS
 * ============================================================
 */

const depositEvent = parseAbiItem(
  "event Deposit(address indexed user, uint256 amount)"
);

const borrowEvent = parseAbiItem(
  "event Borrow(address indexed user, uint256 amount)"
);

const repayEvent = parseAbiItem(
  "event Repay(address indexed user, uint256 amount)"
);

const stakedEvent = parseAbiItem(
  "event Staked(address indexed user, uint256 amount)"
);

const sadMonkeyEvent = parseAbiItem(
  "event SadMonkeyMinted(address indexed user, uint256 indexed tokenId, uint256 price)"
);

/*
 * ============================================================
 * HELPERS
 * ============================================================
 */

function normalizeAddress(
  address: string
) {
  return address.toLowerCase();
}

function shortenAddress(
  address: string
) {
  if (!address) return "";

  return `${address.slice(
    0,
    6
  )}...${address.slice(-4)}`;
}

/*
 * ============================================================
 * MAIN PAGE
 * ============================================================
 */

export default function AirdropPage() {

  const {
    address,
    isConnected,
  } = useAccount();

  const publicClient =
    usePublicClient();

  /*
   * ----------------------------------------------------------
   * Hydration guard
   * ----------------------------------------------------------
   *
   * Wagmi connection state is not guaranteed to be identical
   * during SSR and the first browser render.
   *
   * We therefore wait until the browser has mounted before
   * displaying wallet-dependent values.
   * ----------------------------------------------------------
   */

  const [
    mounted,
    setMounted,
  ] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  /*
   * ----------------------------------------------------------
   * LEADERBOARD STATE
   * ----------------------------------------------------------
   */

  const [
    activities,
    setActivities,
  ] = useState<ActivityMap>({});

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState<string | null>(null);

  /*
   * ==========================================================
   * LOAD LEADERBOARD
   * ==========================================================
   */

  useEffect(() => {

    let cancelled = false;

    async function loadLeaderboard() {

      if (!publicClient) {
        return;
      }

      /*
       * IMPORTANT:
       *
       * Capture the narrowed client in a constant.
       * This prevents TypeScript from treating publicClient
       * as possibly undefined inside scanChunk().
       */

      const client = publicClient;

      try {

        setLoading(true);
        setError(null);

        /*
         * ----------------------------------------------------
         * CURRENT SEPOLIA BLOCK
         * ----------------------------------------------------
         */

        const latestBlock =
          await client.getBlockNumber();

        /*
         * ----------------------------------------------------
         * RPC LOG RANGE LIMIT
         * ----------------------------------------------------
         *
         * PublicNode allows up to 50,000 blocks per
         * eth_getLogs request.
         *
         * We deliberately use 40,000 to stay safely below
         * that limit.
         *
         * ----------------------------------------------------
         */

        const CHUNK_SIZE =
          40_000n;

        /*
         * ----------------------------------------------------
         * SCAN RANGE
         * ----------------------------------------------------
         *
         * Aetheris V2 is a recent Sepolia deployment.
         *
         * We scan the most recent 250,000 blocks, but split
         * them into 40,000-block RPC requests.
         *
         * ----------------------------------------------------
         */

        const TOTAL_SCAN =
          250_000n;

        const startBlock =
          latestBlock > TOTAL_SCAN
            ? latestBlock - TOTAL_SCAN
            : 0n;

        /*
         * ----------------------------------------------------
         * COLLECT EVENTS
         * ----------------------------------------------------
         */

        const deposits:
          EventLog[] = [];

        const borrows:
          EventLog[] = [];

        const repays:
          EventLog[] = [];

        const stakes:
          EventLog[] = [];

        const sadMonkeys:
          EventLog[] = [];

        /*
         * ----------------------------------------------------
         * CHUNKED EVENT SCANNER
         * ----------------------------------------------------
         */

        async function scanChunk(
          fromBlock: bigint,
          toBlock: bigint
        ) {

          const [
            depositLogs,
            borrowLogs,
            repayLogs,
            stakeLogs,
            sadMonkeyLogs,
          ] = await Promise.all([

            client.getLogs({
              address:
                CONTRACTS.Vault.address,

              event:
                depositEvent,

              fromBlock,

              toBlock,
            }),

            client.getLogs({
              address:
                CONTRACTS.Vault.address,

              event:
                borrowEvent,

              fromBlock,

              toBlock,
            }),

            client.getLogs({
              address:
                CONTRACTS.Vault.address,

              event:
                repayEvent,

              fromBlock,

              toBlock,
            }),

            client.getLogs({
              address:
                CONTRACTS.Staking.address,

              event:
                stakedEvent,

              fromBlock,

              toBlock,
            }),

            client.getLogs({
              address:
                CONTRACTS.SadMonkeyNFT.address,

              event:
                sadMonkeyEvent,

              fromBlock,

              toBlock,
            }),

          ]);

          deposits.push(
            ...(depositLogs as unknown as EventLog[])
          );

          borrows.push(
            ...(borrowLogs as unknown as EventLog[])
          );

          repays.push(
            ...(repayLogs as unknown as EventLog[])
          );

          stakes.push(
            ...(stakeLogs as unknown as EventLog[])
          );

          sadMonkeys.push(
            ...(sadMonkeyLogs as unknown as EventLog[])
          );
        }

        /*
         * ----------------------------------------------------
         * SCAN IN CHUNKS
         * ----------------------------------------------------
         */

        let current =
          startBlock;

        while (
          current <= latestBlock
        ) {

          if (cancelled) {
            return;
          }

          const end =
            current + CHUNK_SIZE >
            latestBlock
              ? latestBlock
              : current + CHUNK_SIZE;

          await scanChunk(
            current,
            end
          );

          current =
            end + 1n;
        }

        /*
         * ----------------------------------------------------
         * BUILD POINT MAP
         * ----------------------------------------------------
         */

        const scoreMap:
          ActivityMap = {};

        function addPoints(
          user:
            | string
            | undefined,
          points: number
        ) {

          if (!user) {
            return;
          }

          const key =
            normalizeAddress(
              user
            );

          scoreMap[key] =
            (scoreMap[key] || 0) +
            points;
        }

        /*
         * ----------------------------------------------------
         * DEPOSITS
         * ----------------------------------------------------
         */

        for (
          const log of deposits
        ) {

          addPoints(
            log.args.user,
            POINTS.DEPOSIT
          );
        }

        /*
         * ----------------------------------------------------
         * BORROWS
         * ----------------------------------------------------
         */

        for (
          const log of borrows
        ) {

          addPoints(
            log.args.user,
            POINTS.BORROW
          );
        }

        /*
         * ----------------------------------------------------
         * REPAYS
         * ----------------------------------------------------
         */

        for (
          const log of repays
        ) {

          addPoints(
            log.args.user,
            POINTS.REPAY
          );
        }

        /*
         * ----------------------------------------------------
         * STAKING
         * ----------------------------------------------------
         */

        for (
          const log of stakes
        ) {

          addPoints(
            log.args.user,
            POINTS.STAKE
          );
        }

        /*
         * ----------------------------------------------------
         * SAD MONKEY
         * ----------------------------------------------------
         *
         * One Sad Monkey mint = 250 Aetheris Points.
         *
         * This is NOT 250 AETR.
         *
         * ----------------------------------------------------
         */

        for (
          const log of sadMonkeys
        ) {

          addPoints(
            log.args.user,
            POINTS.SAD_MONKEY
          );
        }

        /*
         * ----------------------------------------------------
         * UPDATE UI
         * ----------------------------------------------------
         */

        if (!cancelled) {

          setActivities(
            scoreMap
          );
        }

      } catch (err) {

        console.error(
          "Leaderboard error:",
          err
        );

        if (!cancelled) {

          setError(
            "Unable to read Aetheris Sepolia activity. Please refresh and try again."
          );
        }

      } finally {

        if (!cancelled) {

          setLoading(false);
        }
      }
    }

    loadLeaderboard();

    return () => {

      cancelled = true;

    };

  }, [publicClient]);

  /*
   * ==========================================================
   * BUILD LEADERBOARD
   * ==========================================================
   */

  const leaderboard:
    LeaderboardEntry[] =
    useMemo(() => {

      return Object.entries(
        activities
      )
        .map(
          ([
            address,
            points,
          ]) => ({
            address,
            points,
          })
        )
        .sort(
          (a, b) =>
            b.points -
            a.points
        );

    }, [activities]);

  /*
   * ==========================================================
   * USER POINTS
   * ==========================================================
   */

  const myPoints =
    mounted &&
    isConnected &&
    address
      ? activities[
          normalizeAddress(
            address
          )
        ] || 0
      : 0;

  /*
   * ==========================================================
   * USER RANK
   * ==========================================================
   */

  const myRank =
    mounted &&
    isConnected &&
    address
      ? leaderboard.findIndex(
          (entry) =>
            normalizeAddress(
              entry.address
            ) ===
            normalizeAddress(
              address
            )
        ) + 1
      : 0;

  /*
   * ==========================================================
   * RENDER
   * ==========================================================
   */

  return (

    <main className="min-h-screen bg-[#050816] text-white">

      {/* ====================================================
          HEADER
      ==================================================== */}

      <header className="border-b border-cyan-500/10 bg-[#050816]">

        <div className="mx-auto max-w-7xl px-5 py-8 md:px-8">

          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400">
            AETHERIS
          </p>

          <h1 className="mt-2 text-3xl font-black text-white md:text-4xl">
            Airdrop
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
            Earn Aetheris Points through
            protocol activity. Your final
            points balance will determine
            your future AETR airdrop
            allocation.
          </p>

        </div>

      </header>

      {/* ====================================================
          CONTENT
      ==================================================== */}

      <div className="mx-auto max-w-7xl px-5 py-10 md:px-8">

        {/* ==================================================
            POINTS
        ================================================== */}

        <section className="mb-10">

          <div className="rounded-2xl border border-cyan-500/10 bg-slate-950/60 p-6">

            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
              AIRDROP POINTS
            </p>

            <h2 className="mt-2 text-2xl font-black text-white">
              Build your Aetheris score
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500">
              Points represent your
              contribution to the Aetheris
              testnet. Points are not AETR
              tokens and have no direct
              monetary value.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">

              <PointCard
                title="Deposit"
                points={
                  POINTS.DEPOSIT
                }
              />

              <PointCard
                title="Borrow"
                points={
                  POINTS.BORROW
                }
              />

              <PointCard
                title="Repay"
                points={
                  POINTS.REPAY
                }
              />

              <PointCard
                title="Stake"
                points={
                  POINTS.STAKE
                }
              />

              <PointCard
                title="Sad Monkey"
                points={
                  POINTS.SAD_MONKEY
                }
              />

            </div>

          </div>

        </section>

        {/* ==================================================
            USER POSITION
        ================================================== */}

        <section className="mb-10">

          <div className="grid gap-4 md:grid-cols-2">

            <div className="rounded-2xl border border-cyan-500/10 bg-slate-950/60 p-6">

              <p className="text-xs uppercase tracking-[0.25em] text-gray-500">
                YOUR POINTS
              </p>

              <p className="mt-3 text-4xl font-black text-cyan-400">

                {!mounted
                  ? "—"
                  : isConnected
                  ? myPoints.toLocaleString()
                  : "—"}

              </p>

              <p className="mt-2 text-sm text-gray-500">
                Aetheris Points
              </p>

            </div>

            <div className="rounded-2xl border border-cyan-500/10 bg-slate-950/60 p-6">

              <p className="text-xs uppercase tracking-[0.25em] text-gray-500">
                YOUR RANK
              </p>

              <p className="mt-3 text-4xl font-black text-white">

                {!mounted
                  ? "—"
                  : isConnected &&
                    myRank > 0
                  ? `#${myRank}`
                  : "—"}

              </p>

              <p className="mt-2 text-sm text-gray-500">
                Current testnet leaderboard
              </p>

            </div>

          </div>

        </section>

        {/* ==================================================
            LEADERBOARD
        ================================================== */}

        <section>

          <div className="mb-5">

            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
              LEADERBOARD
            </p>

            <h2 className="mt-1 text-2xl font-black text-white">
              Aetheris Points
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Rankings are based on testnet
              activity points.
            </p>

          </div>

          <div className="overflow-hidden rounded-2xl border border-cyan-500/10 bg-slate-950/60">

            {loading && (

              <div className="p-10 text-center">

                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-cyan-400/20 border-t-cyan-400" />

                <p className="mt-4 text-sm text-gray-500">
                  Loading leaderboard...
                </p>

              </div>

            )}

            {!loading &&
              error && (

                <div className="p-8">

                  <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-5">

                    <p className="font-semibold text-red-400">
                      Leaderboard unavailable
                    </p>

                    <p className="mt-2 text-sm leading-6 text-gray-500">
                      {error}
                    </p>

                  </div>

                </div>

              )}

            {!loading &&
              !error &&
              leaderboard.length ===
                0 && (

                <div className="p-10 text-center">

                  <p className="text-lg font-bold text-white">
                    No activity yet
                  </p>

                  <p className="mt-2 text-sm text-gray-500">
                    Complete activity on
                    Aetheris testnet to earn
                    Points.
                  </p>

                </div>

              )}

            {!loading &&
              !error &&
              leaderboard.length >
                0 && (

                <div className="divide-y divide-slate-800">

                  {leaderboard.map(
                    (
                      entry,
                      index
                    ) => {

                      const rank =
                        index + 1;

                      const isMe =
                        mounted &&
                        address &&
                        normalizeAddress(
                          address
                        ) ===
                          normalizeAddress(
                            entry.address
                          );

                      return (

                        <div
                          key={
                            entry.address
                          }
                          className={`flex items-center justify-between gap-4 px-5 py-5 transition ${
                            isMe
                              ? "bg-cyan-500/5"
                              : "hover:bg-white/[0.02]"
                          }`}
                        >

                          <div className="flex min-w-0 items-center gap-4">

                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-700 bg-slate-900 text-sm font-black text-gray-300">

                              {rank ===
                              1
                                ? "🥇"
                                : rank ===
                                  2
                                ? "🥈"
                                : rank ===
                                  3
                                ? "🥉"
                                : rank}

                            </div>

                            <div className="min-w-0">

                              <p className="truncate text-sm font-semibold text-white">

                                {shortenAddress(
                                  entry.address
                                )}

                                {isMe && (

                                  <span className="ml-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                                    You
                                  </span>

                                )}

                              </p>

                              <p className="mt-1 truncate text-xs text-gray-600">
                                {entry.address}
                              </p>

                            </div>

                          </div>

                          <div className="shrink-0 text-right">

                            <p className="text-lg font-black text-cyan-400">
                              {entry.points.toLocaleString()}
                            </p>

                            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-600">
                              Points
                            </p>

                          </div>

                        </div>

                      );

                    }
                  )}

                </div>

              )}

          </div>

        </section>

        {/* ==================================================
            NOTE
        ================================================== */}

        <section className="mt-8">

          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-5">

            <p className="text-xs leading-6 text-gray-600">
              Aetheris Points are an
              experimental testnet scoring
              mechanism. Final airdrop
              eligibility, allocation and
              distribution rules may change
              before the Aetheris mainnet
              launch.
            </p>

          </div>

        </section>

      </div>

    </main>

  );
}

/*
 * ============================================================
 * POINT CARD
 * ============================================================
 */

function PointCard({
  title,
  points,
}: {
  title: string;
  points: number;
}) {

  return (

    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">

      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
        {title}
      </p>

      <p className="mt-2 text-xl font-black text-white">
        +{points}
      </p>

      <p className="mt-1 text-[10px] uppercase tracking-wider text-cyan-400">
        Points
      </p>

    </div>

  );
}
