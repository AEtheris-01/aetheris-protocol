import Link from "next/link";
import ConnectWallet from "../components/ConnectWallet";
import ProtocolOverview from "../components/ProtocolOverview";
import VaultPanel from "../components/VaultPanel";
import AETRTokenomics from "../components/AETRTokenomics";
import StakingPanel from "../components/StakingPanel";
import RiskPanel from "../components/RiskPanel";
import OraclePanel from "../components/OraclePanel";
import FeeRouterPanel from "../components/FeeRouterPanel";
import TreasuryPanel from "../components/TreasuryPanel";
import AUSDPanel from "../components/AUSDPanel";

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-[#050816] text-white">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="sticky top-0 z-40 border-b border-cyan-500/10 bg-[#050816]/90 backdrop-blur-xl">

        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-5 md:flex-row md:items-center md:justify-between md:px-8">

          <div>
            <div className="flex items-center gap-3">

              <Link
                href="/"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-400/10 text-xl font-black text-cyan-400"
              >
                A
              </Link>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400">
                  AETHERIS V2
                </p>

                <h1 className="mt-1 text-2xl font-black text-white md:text-3xl">
                  Protocol Dashboard
                </h1>
              </div>

            </div>

            <p className="mt-3 max-w-2xl text-sm text-gray-500">
              Live interface for Vaults, AUSD, AETR, staking,
              oracle infrastructure, protocol fees, risk controls
              and Treasury state.
            </p>
          </div>

          <div className="flex items-center gap-3">

            <Link
              href="/docs"
              className="hidden rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-gray-300 transition hover:border-cyan-500/30 hover:text-cyan-400 sm:block"
            >
              Docs
            </Link>

            <a
              href="https://x.com/Aetheris_pro"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-gray-300 transition hover:border-cyan-500/30 hover:text-cyan-400 md:block"
            >
              X
            </a>

            <ConnectWallet />

          </div>

        </div>

      </header>


      {/* =====================================================
          DASHBOARD CONTENT
      ===================================================== */}

      <div className="mx-auto max-w-7xl px-5 py-8 md:px-8 md:py-10">

        {/* =================================================
            NETWORK STATUS
        ================================================= */}

        <div className="mb-8 flex flex-wrap items-center gap-3">

          <div className="inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/5 px-3 py-1.5 text-xs font-semibold text-green-400">

            <span className="h-2 w-2 rounded-full bg-green-400" />

            Ethereum Sepolia

          </div>

          <div className="rounded-full border border-cyan-500/20 bg-cyan-500/5 px-3 py-1.5 text-xs font-semibold text-cyan-400">
            AETHERIS V2
          </div>

          <div className="rounded-full border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-gray-500">
            Live On-Chain Data
          </div>

        </div>


        {/* =================================================
            PROTOCOL OVERVIEW
        ================================================= */}

        <section>

          <div className="mb-5">

            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
              PROTOCOL OVERVIEW
            </p>

            <h2 className="mt-1 text-2xl font-black text-white">
              AETHERIS V2
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500">
              Core protocol metrics and deployed contract state.
            </p>

          </div>

          <ProtocolOverview />

        </section>


        {/* =================================================
            USER VAULT
        ================================================= */}

        <section className="mt-12">

          <div className="mb-5">

            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
              YOUR POSITION
            </p>

            <h2 className="mt-1 text-2xl font-black text-white">
              Vault
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500">
              Deposit collateral, borrow AUSD, repay debt and
              manage your collateralized position.
            </p>

          </div>

          <VaultPanel />

        </section>


        {/* =================================================
            AUSD
        ================================================= */}

        <section className="mt-12">

          <div className="mb-5">

            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
              STABLECOIN
            </p>

            <h2 className="mt-1 text-2xl font-black text-white">
              AUSD
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500">
              Monitor AUSD supply, balances and stablecoin
              contract state.
            </p>

          </div>

          <AUSDPanel />

        </section>


        {/* =================================================
            AETR
        ================================================= */}

        <section className="mt-12">

          <div className="mb-5">

            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
              TOKEN ECONOMY
            </p>

            <h2 className="mt-1 text-2xl font-black text-white">
              AETR Tokenomics
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500">
              Live AETR supply, allocations, future emissions
              and protocol token parameters.
            </p>

          </div>

          <AETRTokenomics />

        </section>


        {/* =================================================
            STAKING
        ================================================= */}

        <section className="mt-12">

          <div className="mb-5">

            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
              STAKING
            </p>

            <h2 className="mt-1 text-2xl font-black text-white">
              AETR Staking
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500">
              Stake and withdraw AETR through the deployed staking
              contract.
            </p>

          </div>

          <StakingPanel />

        </section>


        {/* =================================================
            RISK
        ================================================= */}

        <section className="mt-12">

          <div className="mb-5">

            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
              RISK ENGINE
            </p>

            <h2 className="mt-1 text-2xl font-black text-white">
              Vault Risk & Liquidation
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500">
              Monitor borrowing limits, collateral health,
              liquidation thresholds and protocol risk parameters.
            </p>

          </div>

          <RiskPanel />

        </section>


        {/* =================================================
            ORACLE
        ================================================= */}

        <section className="mt-12">

          <div className="mb-5">

            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
              MARKET DATA
            </p>

            <h2 className="mt-1 text-2xl font-black text-white">
              Price Oracle
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500">
              ETH, BTC and AETR pricing with freshness and
              oracle status monitoring.
            </p>

          </div>

          <OraclePanel />

        </section>


        {/* =================================================
            FEE ROUTER
        ================================================= */}

        <section className="mt-12">

          <div className="mb-5">

            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
              PROTOCOL ECONOMICS
            </p>

            <h2 className="mt-1 text-2xl font-black text-white">
              Fee Router
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500">
              Monitor protocol fee allocation between AETR,
              BTC and Treasury infrastructure.
            </p>

          </div>

          <FeeRouterPanel />

        </section>


        {/* =================================================
            TREASURY
        ================================================= */}

        <section className="mt-12">

          <div className="mb-5">

            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
              RESERVE LAYER
            </p>

            <h2 className="mt-1 text-2xl font-black text-white">
              Treasury
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500">
              Protocol reserve balances and designated cold-wallet
              infrastructure.
            </p>

          </div>

          <TreasuryPanel />

        </section>


        {/* =================================================
            PROTOCOL MODULES
        ================================================= */}

        <section className="mt-14">

          <div className="mb-6">

            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
              PROTOCOL MODULES
            </p>

            <h2 className="mt-1 text-2xl font-black text-white">
              AETHERIS Ecosystem
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500">
              Core components connected to the AETHERIS V2 architecture.
            </p>

          </div>


          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

            <ModuleCard
              label="AUSD"
              title="Stablecoin"
              text="Collateral-backed stablecoin accounting and liquidity layer."
            />

            <ModuleCard
              label="AETR"
              title="Protocol Token"
              text="Native protocol token with controlled supply and allocation mechanisms."
            />

            <ModuleCard
              label="VAULT"
              title="Collateral Engine"
              text="Collateral deposits, borrowing, repayment and position management."
            />

            <ModuleCard
              label="ORACLE"
              title="Market Data"
              text="Price infrastructure with freshness and timestamp controls."
            />

            <ModuleCard
              label="FEES"
              title="Fee Router"
              text="Protocol fee accounting and allocation infrastructure."
            />

            <ModuleCard
              label="STAKING"
              title="AETR Staking"
              text="On-chain AETR staking and withdrawal functionality."
            />

            <ModuleCard
              label="TREASURY"
              title="Reserve Layer"
              text="Protocol reserves and designated cold-wallet architecture."
            />

            <ModuleCard
              label="RISK"
              title="Liquidation Engine"
              text="Collateral health and liquidation parameter controls."
            />

          </div>

        </section>


        {/* =================================================
            DOCUMENTATION CTA
        ================================================= */}

        <section className="mt-14">

          <div className="rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 via-slate-950 to-slate-950 p-8 md:p-10">

            <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">

              <div className="max-w-3xl">

                <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">
                  DOCUMENTATION
                </p>

                <h2 className="mt-3 text-3xl font-black">
                  Understand the AETHERIS architecture.
                </h2>

                <p className="mt-4 text-sm leading-7 text-gray-500">
                  Review the protocol architecture, AUSD mechanics,
                  AETR tokenomics, Vault risk engine, oracle,
                  Treasury and fee infrastructure.
                </p>

              </div>

              <div className="flex shrink-0 flex-wrap gap-3">

                <Link
                  href="/docs"
                  className="rounded-xl bg-cyan-500 px-6 py-3 font-bold text-black hover:bg-cyan-400"
                >
                  Read Docs
                </Link>

                <a
                  href="/AETHERIS-V2-Whitepaper.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-slate-700 px-6 py-3 font-semibold text-gray-300 hover:border-cyan-500/30 hover:text-cyan-400"
                >
                  Whitepaper
                </a>

              </div>

            </div>

          </div>

        </section>


        {/* =================================================
            FOOTER
        ================================================= */}

        <footer className="mt-14 border-t border-slate-800 pt-8">

          <div className="flex flex-col gap-4 text-xs text-gray-600 md:flex-row md:items-center md:justify-between">

            <div className="flex flex-wrap gap-5">

              <Link
                href="/"
                className="hover:text-cyan-400"
              >
                AETHERIS
              </Link>

              <Link
                href="/docs"
                className="hover:text-cyan-400"
              >
                Docs
              </Link>

              <a
                href="https://x.com/Aetheris_pro"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cyan-400"
              >
                X
              </a>

              <a
                href="https://github.com/AEtheris-01/aetheris-protocol"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cyan-400"
              >
                GitHub
              </a>

            </div>

            <div className="flex flex-wrap gap-5">

              <span>
                Ethereum Sepolia
              </span>

              <span>
                AETHERIS V2
              </span>

              <span>
                Testnet
              </span>

            </div>

          </div>

          <div className="mt-6 border-t border-slate-900 pt-5 text-center text-[11px] text-gray-700">
            AETHERIS V2 is currently deployed on Ethereum Sepolia for testing.
            Smart-contract systems involve technical and economic risks.
          </div>

        </footer>

      </div>

    </main>
  );
}


/* =========================================================
   MODULE CARD
========================================================= */

function ModuleCard({
  label,
  title,
  text,
}: {
  label: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 transition hover:border-cyan-500/30 hover:bg-cyan-500/[0.03]">

      <div className="flex items-center justify-between">

        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-400">
          {label}
        </p>

        <span className="h-2 w-2 rounded-full bg-cyan-400" />

      </div>

      <h3 className="mt-5 text-xl font-bold text-white">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-7 text-gray-500">
        {text}
      </p>

    </div>
  );
}
