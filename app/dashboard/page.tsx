import ConnectWallet from "../components/ConnectWallet";
import ProtocolOverview from "../components/ProtocolOverview";
import VaultPanel from "../components/VaultPanel";
import AETRTokenomics from "../components/AETRTokenomics";
import StakingPanel from "../components/StakingPanel";
import RiskPanel from "../components/RiskPanel";
import OraclePanel from "../components/OraclePanel";
import FeeRouterPanel from "../components/FeeRouterPanel";

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-[#050816] text-white">

      {/* Header */}

      <header className="border-b border-cyan-500/10 bg-[#050816]/95">

        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-6 md:flex-row md:items-center md:justify-between md:px-8">

          <div>

            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400">
              PROTOCOL APP
            </p>

            <h1 className="mt-1 text-3xl font-bold text-white md:text-4xl">
              AETHERIS Dashboard
            </h1>

            <p className="mt-2 text-sm text-gray-400">
              Monitor your Vault, AUSD position, AETR economy,
              protocol parameters and live Sepolia V2 state.
            </p>

          </div>

          <div className="shrink-0">
            <ConnectWallet />
          </div>

        </div>

      </header>

      {/* Main Content */}

      <div className="mx-auto max-w-7xl px-5 py-8 md:px-8">

        {/* Protocol Overview */}

        <ProtocolOverview />

        {/* User Position */}

        <section className="mt-10">

          <div className="mb-5">

            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
              YOUR POSITION
            </p>

            <h2 className="mt-1 text-2xl font-bold text-white">
              Vault
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              Manage your collateral and AUSD debt position.
            </p>

          </div>

          <VaultPanel />

        </section>

        {/* AETR Tokenomics */}

        <VaultPanel />

        <AETRTokenomics />

        <StakingPanel />

        <RiskPanel />

        <OraclePanel />

        <FeeRouterPanel />

        {/* Protocol Modules */}

        <section className="mt-10">

          <div className="mb-5">

            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
              PROTOCOL MODULES
            </p>

            <h2 className="mt-1 text-2xl font-bold text-white">
              AETHERIS Ecosystem
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              Core components of the AETHERIS protocol.
            </p>

          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

            {/* AUSD */}

            <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/70 p-6 transition hover:border-cyan-400/40">

              <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                AUSD
              </p>

              <h3 className="mt-2 text-xl font-bold text-white">
                Stablecoin
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-400">
                Collateral-backed AUSD designed to provide stable
                decentralized liquidity within the AETHERIS ecosystem.
              </p>

            </div>

            {/* AETR */}

            <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/70 p-6 transition hover:border-cyan-400/40">

              <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                AETR
              </p>

              <h3 className="mt-2 text-xl font-bold text-white">
                Tokenomics
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-400">
                Protocol utility and incentive token with controlled
                supply and predefined allocation mechanisms.
              </p>

            </div>

            {/* Staking */}

            <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/70 p-6 transition hover:border-cyan-400/40">

              <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                STAKING
              </p>

              <h3 className="mt-2 text-xl font-bold text-white">
                AETR Staking
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-400">
                Stake AETR and participate in the protocol's staking
                ecosystem.
              </p>

            </div>

            {/* Liquidation */}

            <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/70 p-6 transition hover:border-cyan-400/40">

              <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                LIQUIDATION
              </p>

              <h3 className="mt-2 text-xl font-bold text-white">
                Risk Engine
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-400">
                Monitor collateral health, borrowing limits and
                liquidation parameters.
              </p>

            </div>

          </div>

        </section>

        {/* Network */}

        <div className="mt-10 flex flex-col gap-3 border-t border-slate-800 pt-6 text-xs text-gray-500 md:flex-row md:items-center md:justify-between">

          <p>
            Ethereum Sepolia
          </p>

          <p>
            AETHERIS V2
          </p>

          <p>
            Live protocol interface
          </p>

        </div>

      </div>

    </main>
  );
}
