"use client";

import { useReadContract } from "wagmi";
import { formatEther } from "viem";
import { CONTRACTS } from "../lib/contracts";

type BigIntValue = bigint | undefined;

function asBigInt(value: unknown): BigIntValue {
  return typeof value === "bigint" ? value : undefined;
}

function formatAETR(value: BigIntValue): string {
  if (value === undefined) {
    return "Loading...";
  }

  const formatted = formatEther(value);
  const [whole, decimal] = formatted.split(".");

  const formattedWhole = Number(whole).toLocaleString("en-US");

  if (!decimal || /^0+$/.test(decimal)) {
    return `${formattedWhole} AETR`;
  }

  const trimmedDecimal = decimal
    .replace(/0+$/, "")
    .slice(0, 4);

  return `${formattedWhole}.${trimmedDecimal} AETR`;
}

function formatNumber(value: BigIntValue): string {
  if (value === undefined) {
    return "Loading...";
  }

  const formatted = formatEther(value);
  const [whole] = formatted.split(".");

  return Number(whole).toLocaleString("en-US");
}

function calculatePercentage(
  value: BigIntValue,
  total: BigIntValue
): string {
  if (
    value === undefined ||
    total === undefined ||
    total === 0n
  ) {
    return "—";
  }

  const percentage =
    Number((value * 10000n) / total) / 100;

  return `${percentage.toFixed(2)}%`;
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
    <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/80 p-5 transition hover:border-cyan-400/40">
      <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
        {title}
      </p>

      <p className="mt-3 break-words text-2xl font-bold text-white">
        {value}
      </p>

      <p className="mt-2 text-xs text-gray-500">
        {description}
      </p>
    </div>
  );
}

type Allocation = {
  title: string;
  value: BigIntValue;
  description: string;
};

export default function AETRTokenomics() {
  const { data: totalSupplyRaw } = useReadContract({
    address: CONTRACTS.AETRToken.address,
    abi: CONTRACTS.AETRToken.abi,
    functionName: "totalSupply",
  });

  const { data: maxSupplyRaw } = useReadContract({
    address: CONTRACTS.AETRToken.address,
    abi: CONTRACTS.AETRToken.abi,
    functionName: "MAX_SUPPLY",
  });

  const { data: initialSupplyRaw } = useReadContract({
    address: CONTRACTS.AETRToken.address,
    abi: CONTRACTS.AETRToken.abi,
    functionName: "INITIAL_SUPPLY",
  });

  const { data: airdropAllocationRaw } = useReadContract({
    address: CONTRACTS.AETRToken.address,
    abi: CONTRACTS.AETRToken.abi,
    functionName: "AIRDROP_ALLOCATION",
  });

  const { data: futureEmissionRaw } = useReadContract({
    address: CONTRACTS.AETRToken.address,
    abi: CONTRACTS.AETRToken.abi,
    functionName: "FUTURE_EMISSION",
  });

  const { data: holderRewardAllocationRaw } =
    useReadContract({
      address: CONTRACTS.AETRToken.address,
      abi: CONTRACTS.AETRToken.abi,
      functionName: "HOLDER_REWARD_ALLOCATION",
    });

  const { data: treasuryAllocationRaw } =
    useReadContract({
      address: CONTRACTS.AETRToken.address,
      abi: CONTRACTS.AETRToken.abi,
      functionName: "TREASURY_ALLOCATION",
    });

  const { data: vaultIncentiveAllocationRaw } =
    useReadContract({
      address: CONTRACTS.AETRToken.address,
      abi: CONTRACTS.AETRToken.abi,
      functionName: "VAULT_INCENTIVE_ALLOCATION",
    });

  const { data: totalFutureMintedRaw } =
    useReadContract({
      address: CONTRACTS.AETRToken.address,
      abi: CONTRACTS.AETRToken.abi,
      functionName: "totalFutureMinted",
    });

  /*
   * Convert viem's ABI-inferred values into the exact type
   * used by this component.
   */
  const totalSupply = asBigInt(totalSupplyRaw);
  const maxSupply = asBigInt(maxSupplyRaw);
  const initialSupply = asBigInt(initialSupplyRaw);

  const airdropAllocation = asBigInt(
    airdropAllocationRaw
  );

  const futureEmission = asBigInt(
    futureEmissionRaw
  );

  const holderRewardAllocation = asBigInt(
    holderRewardAllocationRaw
  );

  const treasuryAllocation = asBigInt(
    treasuryAllocationRaw
  );

  const vaultIncentiveAllocation = asBigInt(
    vaultIncentiveAllocationRaw
  );

  const totalFutureMinted = asBigInt(
    totalFutureMintedRaw
  );

  /*
   * Maximum Supply - Current Supply
   */
  const remainingSupply: BigIntValue =
    maxSupply !== undefined &&
    totalSupply !== undefined &&
    maxSupply > totalSupply
      ? maxSupply - totalSupply
      : maxSupply !== undefined &&
          totalSupply !== undefined
        ? 0n
        : undefined;

  const allocations: Allocation[] = [
    {
      title: "Airdrop",
      value: airdropAllocation,
      description:
        "Community distribution allocation",
    },
    {
      title: "Future Emission",
      value: futureEmission,
      description:
        "Controlled future emission allocation",
    },
    {
      title: "Holder Rewards",
      value: holderRewardAllocation,
      description:
        "AETR holder incentive allocation",
    },
    {
      title: "Treasury",
      value: treasuryAllocation,
      description:
        "Protocol treasury allocation",
    },
    {
      title: "Vault Incentives",
      value: vaultIncentiveAllocation,
      description:
        "Vault ecosystem incentive allocation",
    },
  ];

  const supplyUtilization =
    totalSupply !== undefined &&
    maxSupply !== undefined &&
    maxSupply > 0n
      ? Math.min(
          100,
          Number(
            (totalSupply * 10000n) /
              maxSupply
          ) / 100
        )
      : 0;

  return (
    <section className="mt-10 rounded-3xl border border-cyan-500/20 bg-[#070b1f] p-6 shadow-2xl shadow-cyan-950/20 md:p-8">

      {/* Header */}

      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400">
            AETR ECONOMY
          </p>

          <h2 className="mt-2 text-3xl font-bold text-white md:text-4xl">
            AETR Tokenomics
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-400">
            Live token supply and allocation information
            retrieved directly from the deployed AETHERIS V2
            AETR contract.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2">
          <span className="h-2 w-2 rounded-full bg-green-400" />

          <span className="text-xs font-semibold text-green-400">
            LIVE CONTRACT DATA
          </span>
        </div>

      </div>

      {/* Supply Overview */}

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Current Supply"
          value={formatAETR(totalSupply)}
          description="Current total AETR supply recorded by the contract"
        />

        <StatCard
          title="Maximum Supply"
          value={formatAETR(maxSupply)}
          description="Maximum lifetime AETR supply permitted by the protocol"
        />

        <StatCard
          title="Initial Supply"
          value={formatAETR(initialSupply)}
          description="Initial AETR supply defined by the token contract"
        />

        <StatCard
          title="Remaining Capacity"
          value={formatAETR(remainingSupply)}
          description="Maximum supply minus current total supply"
        />

      </div>

      {/* Supply Utilization */}

      <div className="mt-6 rounded-2xl border border-cyan-500/20 bg-slate-900/70 p-5">

        <div className="flex items-center justify-between">

          <div>
            <h3 className="text-lg font-bold text-white">
              Supply Utilization
            </h3>

            <p className="mt-1 text-xs text-gray-500">
              Current AETR supply relative to the maximum supply cap
            </p>
          </div>

          <p className="text-lg font-bold text-cyan-400">
            {calculatePercentage(
              totalSupply,
              maxSupply
            )}
          </p>

        </div>

        <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-800">

          <div
            className="h-full rounded-full bg-cyan-400 transition-all duration-700"
            style={{
              width: `${supplyUtilization}%`,
            }}
          />

        </div>

      </div>

      {/* Allocation */}

      <div className="mt-8">

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
            DISTRIBUTION
          </p>

          <h3 className="mt-1 text-2xl font-bold text-white">
            AETR Allocation
          </h3>

          <p className="mt-2 text-sm text-gray-400">
            Protocol-defined allocation buckets read directly
            from the deployed AETR contract.
          </p>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">

          {allocations.map((allocation) => {

            const allocationPercentage =
              allocation.value !== undefined &&
              maxSupply !== undefined &&
              maxSupply > 0n
                ? Math.min(
                    100,
                    Number(
                      (allocation.value * 10000n) /
                        maxSupply
                    ) / 100
                  )
                : 0;

            return (
              <div
                key={allocation.title}
                className="rounded-2xl border border-cyan-500/20 bg-slate-900/70 p-5 transition hover:-translate-y-0.5 hover:border-cyan-400/40"
              >

                <p className="text-base font-semibold text-white">
                  {allocation.title}
                </p>

                <p className="mt-2 text-xs leading-5 text-gray-500">
                  {allocation.description}
                </p>

                <p className="mt-5 text-2xl font-bold text-cyan-400">
                  {formatAETR(allocation.value)}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  {formatNumber(allocation.value)} AETR
                </p>

                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-800">

                  <div
                    className="h-full rounded-full bg-cyan-400"
                    style={{
                      width: `${allocationPercentage}%`,
                    }}
                  />

                </div>

              </div>
            );
          })}

        </div>

      </div>

      {/* Future Emission */}

      <div className="mt-8 grid gap-4 md:grid-cols-2">

        <div className="rounded-2xl border border-purple-500/20 bg-purple-950/20 p-5">

          <p className="text-xs font-semibold uppercase tracking-wider text-purple-300">
            FUTURE EMISSION
          </p>

          <p className="mt-3 text-2xl font-bold text-white">
            {formatAETR(futureEmission)}
          </p>

          <p className="mt-2 text-sm leading-5 text-gray-400">
            Future emission allocation defined by the AETR
            token contract.
          </p>

        </div>

        <div className="rounded-2xl border border-purple-500/20 bg-purple-950/20 p-5">

          <p className="text-xs font-semibold uppercase tracking-wider text-purple-300">
            FUTURE EMISSION MINTED
          </p>

          <p className="mt-3 text-2xl font-bold text-white">
            {formatAETR(totalFutureMinted)}
          </p>

          <p className="mt-2 text-sm leading-5 text-gray-400">
            Future emission already minted through the controlled
            emission mechanism.
          </p>

        </div>

      </div>

      {/* Protocol Design */}

      <div className="mt-8 rounded-2xl border border-cyan-500/20 bg-slate-900/50 p-5">

        <h3 className="text-lg font-bold text-cyan-400">
          AETHERIS Supply Model
        </h3>

        <div className="mt-4 grid gap-5 md:grid-cols-3">

          <div>
            <p className="font-semibold text-white">
              Fixed Maximum Supply
            </p>

            <p className="mt-1 text-sm leading-5 text-gray-500">
              AETR supply is constrained by the maximum supply
              defined in the token contract.
            </p>
          </div>

          <div>
            <p className="font-semibold text-white">
              Controlled Emission
            </p>

            <p className="mt-1 text-sm leading-5 text-gray-500">
              Future emissions are subject to the token contract's
              emission controls.
            </p>
          </div>

          <div>
            <p className="font-semibold text-white">
              Protocol Incentives
            </p>

            <p className="mt-1 text-sm leading-5 text-gray-500">
              AETR allocations support protocol incentives,
              treasury operations, vault activity and community
              distribution.
            </p>
          </div>

        </div>

      </div>

      {/* Contract */}

      <div className="mt-6 border-t border-slate-800 pt-5">

        <div className="flex flex-col gap-2 text-xs text-gray-500 md:flex-row md:items-center md:justify-between">

          <p>
            Network: Ethereum Sepolia
          </p>

          <p className="break-all">
            AETR Contract:{" "}
            <span className="text-gray-400">
              {CONTRACTS.AETRToken.address}
            </span>
          </p>

        </div>

      </div>

    </section>
  );
}
