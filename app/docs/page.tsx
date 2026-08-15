"use client";

import { useState } from "react";

const sections = [
  { id: "overview", label: "Overview" },
  { id: "architecture", label: "Architecture" },
  { id: "ausd", label: "AUSD Stablecoin" },
  { id: "vault", label: "Vault & Collateral" },
  { id: "liquidation", label: "Liquidation Engine" },
  { id: "oracle", label: "Price Oracle" },
  { id: "fees", label: "Protocol Fee Router" },
  { id: "treasury", label: "Treasury" },
  { id: "tokenomics", label: "AETR Tokenomics" },
  { id: "staking", label: "Staking" },
  { id: "security", label: "Security Model" },
  { id: "testnet", label: "Sepolia Testnet" },
  { id: "contracts", label: "Smart Contracts" },
];

const contracts = [
  {
    name: "AETR Token",
    address: "0xA6E6B409d1C40df1508bD06dC3B6f03f3CfeE66f",
  },
  {
    name: "AUSD Stablecoin",
    address: "0x614828e0b0db723e2B15196c6c6EcD230bf960A6",
  },
  {
    name: "Price Oracle",
    address: "0xe8a3b616fa79C77908F304AB7C0b03976295c4f0",
  },
  {
    name: "Treasury",
    address: "0xf8e361Ae009bEE83FB78bcD7B10Dbb4839413B40",
  },
  {
    name: "Vault",
    address: "0xF7DaA3b8DBFc3E923ce9645BA803d5Cff86d38C6",
  },
  {
    name: "Protocol Fee Router",
    address: "0x14830D7463C51c1EDf78f42bCC93D7017c306211",
  },
  {
    name: "Staking",
    address: "0x07f1752864abcFA1AE67742dF61E3ADD368f22b8",
  },
];

export default function DocsPage() {
  const [mobileOpen, setMobileOpen] = useState(false);

  function scrollToSection(id: string) {
    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    setMobileOpen(false);
  }

  return (
    <main className="min-h-screen bg-[#050816] text-white">

      {/* TOP NAVIGATION */}

      <header className="sticky top-0 z-50 border-b border-cyan-500/10 bg-[#050816]/95 backdrop-blur">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">

          <a
            href="/"
            className="text-xl font-black tracking-wide text-cyan-400"
          >
            AETHERIS
          </a>

          <div className="flex items-center gap-3">

            <a
              href="/dashboard"
              className="hidden rounded-xl border border-cyan-500/30 px-4 py-2 text-sm font-semibold text-cyan-400 transition hover:bg-cyan-500/10 md:block"
            >
              Launch Dashboard
            </a>

            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="rounded-xl border border-slate-700 px-3 py-2 text-sm text-gray-300 md:hidden"
            >
              {mobileOpen ? "Close" : "Menu"}
            </button>

          </div>

        </div>

      </header>

      {/* MOBILE NAV */}

      {mobileOpen && (
        <div className="sticky top-[69px] z-40 border-b border-slate-800 bg-[#070b1f] p-4 md:hidden">

          <div className="space-y-1">

            {sections.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => scrollToSection(section.id)}
                className="block w-full rounded-lg px-3 py-2 text-left text-sm text-gray-400 transition hover:bg-cyan-500/10 hover:text-cyan-400"
              >
                {section.label}
              </button>
            ))}

          </div>

        </div>
      )}

      <div className="mx-auto flex max-w-7xl">

        {/* SIDEBAR */}

        <aside className="sticky top-[69px] hidden h-[calc(100vh-69px)] w-64 shrink-0 overflow-y-auto border-r border-slate-800 py-8 pr-6 md:block">

          <p className="px-3 text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">
            Documentation
          </p>

          <nav className="mt-5 space-y-1">

            {sections.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => scrollToSection(section.id)}
                className="block w-full rounded-lg px-3 py-2 text-left text-sm text-gray-400 transition hover:bg-cyan-500/10 hover:text-cyan-400"
              >
                {section.label}
              </button>
            ))}

          </nav>

          <div className="mt-8 rounded-2xl border border-cyan-500/20 bg-cyan-950/10 p-4">

            <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              Network
            </p>

            <p className="mt-2 text-sm font-semibold text-white">
              Ethereum Sepolia
            </p>

            <p className="mt-1 text-xs text-gray-500">
              AETHERIS V2 Testnet
            </p>

          </div>

        </aside>

        {/* CONTENT */}

        <article className="min-w-0 flex-1 px-5 py-10 md:px-12 md:py-14">

          {/* HERO */}

          <section id="overview" className="scroll-mt-28">

            <div className="inline-flex rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
              AETHERIS V2
            </div>

            <h1 className="mt-6 text-4xl font-black leading-tight md:text-6xl">
              A decentralized stablecoin
              <span className="block text-cyan-400">
                protocol architecture.
              </span>
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-400">
              AETHERIS is designed around collateralized AUSD,
              on-chain Vault risk management, protocol fee routing,
              AETR token economics, oracle infrastructure and
              separated Treasury reserves.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">

              <a
                href="/dashboard"
                className="rounded-xl bg-cyan-500 px-6 py-3 font-bold text-black transition hover:bg-cyan-400"
              >
                Open Dashboard
              </a>

              <a
                href="https://sepolia.etherscan.io"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-slate-700 px-6 py-3 font-semibold text-gray-300 transition hover:bg-slate-800"
              >
                Sepolia Explorer
              </a>

            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">

              <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/60 p-5">
                <p className="text-xs uppercase tracking-wider text-gray-500">
                  Stablecoin
                </p>
                <p className="mt-2 text-2xl font-bold text-cyan-400">
                  AUSD
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  Collateral-backed protocol asset
                </p>
              </div>

              <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/60 p-5">
                <p className="text-xs uppercase tracking-wider text-gray-500">
                  Governance / Utility
                </p>
                <p className="mt-2 text-2xl font-bold text-white">
                  AETR
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  Fixed-supply protocol token
                </p>
              </div>

              <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/60 p-5">
                <p className="text-xs uppercase tracking-wider text-gray-500">
                  Network
                </p>
                <p className="mt-2 text-2xl font-bold text-white">
                  Sepolia
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  Current public V2 test environment
                </p>
              </div>

            </div>

          </section>

          {/* ARCHITECTURE */}

          <section
            id="architecture"
            className="mt-24 scroll-mt-28"
          >

            <SectionTitle
              eyebrow="01 · ARCHITECTURE"
              title="How AETHERIS is organized"
            />

            <p className="mt-5 text-gray-400 leading-7">
              The AETHERIS architecture separates the major protocol
              responsibilities into dedicated contracts. This allows
              Vault operations, monetary accounting, price data, fee
              routing, staking and Treasury management to be monitored
              independently.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-2">

              <ArchitectureCard
                title="Vault"
                text="Manages user ETH collateral, AUSD debt, borrowing, repayment, withdrawals and liquidation logic."
              />

              <ArchitectureCard
                title="AUSD"
                text="Provides the protocol's stablecoin accounting layer with role-based minting and burning controls."
              />

              <ArchitectureCard
                title="Price Oracle"
                text="Provides ETH, BTC and AETR market prices together with update timestamps and freshness controls."
              />

              <ArchitectureCard
                title="Protocol Fee Router"
                text="Calculates protocol fees and tracks the configured AETR and BTC allocation paths."
              />

              <ArchitectureCard
                title="Treasury"
                text="Separates protocol reserves from active Vault collateral and provides designated reserve custody infrastructure."
              />

              <ArchitectureCard
                title="Staking"
                text="Provides AETR staking and withdrawal functionality for the deployed protocol."
              />

            </div>

          </section>

          {/* AUSD */}

          <section id="ausd" className="mt-24 scroll-mt-28">

            <SectionTitle
              eyebrow="02 · AUSD"
              title="AUSD Stablecoin"
            />

            <p className="mt-5 leading-7 text-gray-400">
              AUSD is the core stablecoin asset used by the AETHERIS
              Vault system. Users interact with AUSD through collateralized
              borrowing and repayment.
            </p>

            <div className="mt-8 rounded-2xl border border-cyan-500/20 bg-cyan-950/10 p-6">

              <h3 className="text-xl font-bold text-white">
                Basic lifecycle
              </h3>

              <div className="mt-6 grid gap-4 md:grid-cols-3">

                <FlowStep
                  number="01"
                  title="Deposit"
                  text="User deposits collateral into a Vault."
                />

                <FlowStep
                  number="02"
                  title="Borrow"
                  text="The Vault determines borrowing capacity from its risk parameters."
                />

                <FlowStep
                  number="03"
                  title="Repay"
                  text="AUSD debt can be repaid, reducing the user's outstanding position."
                />

              </div>

            </div>

            <InfoBox>
              AUSD minting and burning are protected by access-control
              roles in the deployed V2 stablecoin contract. The public
              dashboard exposes monitoring information but does not
              expose administrative role-management operations.
            </InfoBox>

          </section>

          {/* VAULT */}

          <section id="vault" className="mt-24 scroll-mt-28">

            <SectionTitle
              eyebrow="03 · VAULT"
              title="Collateralized Vault"
            />

            <p className="mt-5 leading-7 text-gray-400">
              The Vault is the primary user-facing risk engine. It
              records collateral and AUSD debt for individual positions
              and applies the protocol's configured borrowing limits.
            </p>

            <div className="mt-8 overflow-hidden rounded-2xl border border-slate-800">

              <div className="grid grid-cols-2 bg-slate-900 px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                <span>Component</span>
                <span>Purpose</span>
              </div>

              <TableRow
                name="Collateral"
                value="ETH collateral deposited by the user"
              />

              <TableRow
                name="Debt"
                value="Outstanding AUSD borrowed by the user"
              />

              <TableRow
                name="Maximum LTV"
                value="Protocol-defined borrowing limit"
              />

              <TableRow
                name="Liquidation"
                value="Mechanism for unhealthy collateralized positions"
              />

              <TableRow
                name="Repayment"
                value="Reduces outstanding AUSD debt"
              />

            </div>

          </section>

          {/* LIQUIDATION */}

          <section
            id="liquidation"
            className="mt-24 scroll-mt-28"
          >

            <SectionTitle
              eyebrow="04 · RISK"
              title="Liquidation Engine"
            />

            <p className="mt-5 leading-7 text-gray-400">
              AETHERIS uses collateral health parameters to determine
              whether a Vault remains eligible to maintain its debt.
              The V2 Vault exposes liquidation thresholds and a maximum
              liquidation close factor.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">

              <MetricCard
                title="Health"
                text="Determines whether a position remains within protocol risk limits."
              />

              <MetricCard
                title="Liquidation Threshold"
                text="Defines the configured boundary at which collateralized debt becomes eligible for liquidation."
              />

              <MetricCard
                title="Close Factor"
                text="Limits the amount of debt that can be addressed during a liquidation."
              />

            </div>

            <InfoBox>
              Liquidation parameters are determined by the deployed
              smart contract. The website should be treated as a
              monitoring interface; the contract remains the source
              of truth for execution.
            </InfoBox>

          </section>

          {/* ORACLE */}

          <section id="oracle" className="mt-24 scroll-mt-28">

            <SectionTitle
              eyebrow="05 · ORACLE"
              title="Price Oracle"
            />

            <p className="mt-5 leading-7 text-gray-400">
              The AETHERIS V2 PriceOracle exposes ETH, BTC and AETR
              prices together with timestamp information. The contract
              also maintains configurable price-age limits.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">

              <MetricCard
                title="ETH / USD"
                text="ETH market price used by the protocol."
              />

              <MetricCard
                title="BTC / USD"
                text="BTC market price used by the protocol."
              />

              <MetricCard
                title="AETR / USD"
                text="AETR market price exposed by the oracle."
              />

            </div>

            <InfoBox>
              Oracle freshness is a critical risk condition. The
              dashboard therefore displays update timestamps and
              stale/fresh status for each supported asset.
            </InfoBox>

          </section>

          {/* FEES */}

          <section id="fees" className="mt-24 scroll-mt-28">

            <SectionTitle
              eyebrow="06 · FEES"
              title="Protocol Fee Router"
            />

            <p className="mt-5 leading-7 text-gray-400">
              The ProtocolFeeRouter provides the fee calculation and
              allocation layer for the deployed AETHERIS V2 system.
              It exposes configurable fee-basis-point values and tracks
              cumulative protocol allocations.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">

              <MetricCard
                title="Total Fee"
                text="Configured aggregate protocol fee in basis points."
              />

              <MetricCard
                title="AETR Allocation"
                text="Configured portion allocated to AETR-related protocol economics."
              />

              <MetricCard
                title="BTC Allocation"
                text="Configured portion allocated toward the BTC reserve path."
              />

            </div>

            <InfoBox>
              The public interface provides a fee calculator and
              transparency into cumulative fee accounting. Treasury
              and allocation administration remains contract-controlled.
            </InfoBox>

          </section>

          {/* TREASURY */}

          <section id="treasury" className="mt-24 scroll-mt-28">

            <SectionTitle
              eyebrow="07 · TREASURY"
              title="Treasury & Reserve Architecture"
            />

            <p className="mt-5 leading-7 text-gray-400">
              AETHERIS separates active Vault collateral from Treasury
              reserves. The Treasury contract provides on-chain reserve
              accounting and identifies a designated cold-wallet address.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">

              <ArchitectureCard
                title="Vault"
                text="Active collateral supporting user positions."
              />

              <ArchitectureCard
                title="Treasury"
                text="Protocol reserve accounting and asset custody layer."
              />

              <ArchitectureCard
                title="Cold Wallet"
                text="Designated custody destination configured by the Treasury."
              />

            </div>

            <InfoBox>
              A cold wallet improves operational separation and reduces
              online exposure, but no custody architecture should be
              described as mathematically impossible to compromise.
            </InfoBox>

          </section>

          {/* TOKENOMICS */}

          <section id="tokenomics" className="mt-24 scroll-mt-28">

            <SectionTitle
              eyebrow="08 · TOKENOMICS"
              title="AETR Token Economics"
            />

            <p className="mt-5 leading-7 text-gray-400">
              AETR is the protocol token used by the AETHERIS ecosystem.
              The deployed V2 token contract exposes allocation constants,
              a maximum supply, future-emission accounting and burn
              functionality.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-2">

              <MetricCard
                title="Fixed Maximum Supply"
                text="The deployed AETR contract exposes MAX_SUPPLY as the upper supply boundary."
              />

              <MetricCard
                title="Future Emission"
                text="Future minting is controlled through the contract's emission-controller architecture."
              />

              <MetricCard
                title="AETR Burn"
                text="The token contract exposes a burn mechanism for reducing token supply."
              />

              <MetricCard
                title="Protocol Incentives"
                text="The deployed contract exposes allocation categories for protocol incentive economics."
              />

            </div>

            <InfoBox>
              Live allocation and supply figures are available through
              the AETHERIS dashboard's Tokenomics module and are sourced
              from the deployed contract.
            </InfoBox>

          </section>

          {/* STAKING */}

          <section id="staking" className="mt-24 scroll-mt-28">

            <SectionTitle
              eyebrow="09 · STAKING"
              title="AETR Staking"
            />

            <p className="mt-5 leading-7 text-gray-400">
              The deployed staking contract allows users to stake AETR
              and later withdraw their staked amount. The contract tracks
              individual balances and total staked AETR.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">

              <FlowStep
                number="01"
                title="Approve"
                text="Authorize the staking contract to use the required AETR."
              />

              <FlowStep
                number="02"
                title="Stake"
                text="Deposit AETR into the staking contract."
              />

              <FlowStep
                number="03"
                title="Withdraw"
                text="Withdraw the user's staked AETR according to the deployed contract."
              />

            </div>

          </section>

          {/* SECURITY */}

          <section id="security" className="mt-24 scroll-mt-28">

            <SectionTitle
              eyebrow="10 · SECURITY"
              title="Security Model"
            />

            <p className="mt-5 leading-7 text-gray-400">
              AETHERIS V2 is structured around multiple layers of
              protocol controls rather than relying on a single security
              mechanism.
            </p>

            <div className="mt-8 space-y-4">

              <SecurityRow
                title="Access Control"
                text="Administrative and monetary functions are restricted by contract-level authorization."
              />

              <SecurityRow
                title="Oracle Freshness"
                text="Price data includes timestamps and configurable freshness limits."
              />

              <SecurityRow
                title="Vault Risk Parameters"
                text="Borrowing and liquidation behavior is governed by explicit protocol parameters."
              />

              <SecurityRow
                title="Treasury Separation"
                text="Reserve assets are separated conceptually and contractually from active Vault collateral."
              />

              <SecurityRow
                title="Pause Controls"
                text="The V2 contracts expose pause/unpause functionality where implemented."
              />

              <SecurityRow
                title="Public Read-Only Monitoring"
                text="The website avoids exposing sensitive administrative withdrawal and ownership controls to normal users."
              />

            </div>

            <div className="mt-8 rounded-2xl border border-red-500/20 bg-red-950/10 p-6">

              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-400">
                SECURITY DISCLAIMER
              </p>

              <p className="mt-3 text-sm leading-7 text-gray-300">
                No smart-contract protocol can honestly guarantee
                that it is impossible to hack. AETHERIS security
                claims should therefore be based on audited code,
                formal testing, monitoring, operational controls and
                responsible disclosure rather than absolute guarantees.
              </p>

            </div>

          </section>

          {/* TESTNET */}

          <section id="testnet" className="mt-24 scroll-mt-28">

            <SectionTitle
              eyebrow="11 · TESTNET"
              title="Ethereum Sepolia"
            />

            <p className="mt-5 leading-7 text-gray-400">
              The current AETHERIS V2 public interface is connected
              to Ethereum Sepolia. Users can interact with the deployed
              testnet contracts through the Dashboard.
            </p>

            <div className="mt-8 rounded-2xl border border-cyan-500/20 bg-cyan-950/10 p-6">

              <h3 className="text-xl font-bold text-white">
                Testnet workflow
              </h3>

              <ol className="mt-5 space-y-4 text-sm leading-6 text-gray-300">

                <li>
                  <span className="font-bold text-cyan-400">1.</span>{" "}
                  Connect MetaMask to Ethereum Sepolia.
                </li>

                <li>
                  <span className="font-bold text-cyan-400">2.</span>{" "}
                  Obtain Sepolia test ETH.
                </li>

                <li>
                  <span className="font-bold text-cyan-400">3.</span>{" "}
                  Open the AETHERIS Dashboard.
                </li>

                <li>
                  <span className="font-bold text-cyan-400">4.</span>{" "}
                  Test Vault deposits, borrowing and repayment.
                </li>

                <li>
                  <span className="font-bold text-cyan-400">5.</span>{" "}
                  Review Oracle, Treasury, AUSD and tokenomics data.
                </li>

              </ol>

            </div>

            <div className="mt-6 rounded-2xl border border-yellow-500/20 bg-yellow-950/10 p-5">

              <p className="text-xs font-semibold uppercase tracking-wider text-yellow-400">
                TESTNET ONLY
              </p>

              <p className="mt-2 text-sm leading-6 text-gray-300">
                Sepolia assets have no intended production value.
                Testnet balances, addresses and statistics should not
                be interpreted as production reserves or financial
                guarantees.
              </p>

            </div>

          </section>

          {/* CONTRACTS */}

          <section id="contracts" className="mt-24 scroll-mt-28">

            <SectionTitle
              eyebrow="12 · CONTRACTS"
              title="Deployed V2 Contracts"
            />

            <p className="mt-5 leading-7 text-gray-400">
              The following addresses correspond to the AETHERIS V2
              Sepolia deployment currently integrated into the website.
            </p>

            <div className="mt-8 space-y-3">

              {contracts.map((contract) => (
                <div
                  key={contract.name}
                  className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5"
                >

                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

                    <div>
                      <p className="font-bold text-white">
                        {contract.name}
                      </p>

                      <p className="mt-2 break-all font-mono text-xs text-gray-500">
                        {contract.address}
                      </p>
                    </div>

                    <a
                      href={`https://sepolia.etherscan.io/address/${contract.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="self-start rounded-xl border border-cyan-500/30 px-4 py-2 text-xs font-semibold text-cyan-400 transition hover:bg-cyan-500/10"
                    >
                      Explorer
                    </a>

                  </div>

                </div>
              ))}

            </div>

          </section>

          {/* FINAL */}

          <section className="mt-24 border-t border-slate-800 pt-12">

            <div className="rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-cyan-950/30 to-slate-950 p-8">

              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
                AETHERIS V2
              </p>

              <h2 className="mt-3 text-3xl font-black text-white">
                Explore the live protocol
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-400">
                Review live protocol data and interact with the
                deployed AETHERIS V2 Sepolia contracts through the
                dashboard.
              </p>

              <a
                href="/dashboard"
                className="mt-6 inline-flex rounded-xl bg-cyan-500 px-6 py-3 font-bold text-black transition hover:bg-cyan-400"
              >
                Launch AETHERIS Dashboard
              </a>

            </div>

          </section>

        </article>

      </div>

    </main>
  );
}

/*
 * -----------------------------------------------------------
 * REUSABLE DOCUMENTATION COMPONENTS
 * -----------------------------------------------------------
 */

function SectionTitle({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div>

      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
        {eyebrow}
      </p>

      <h2 className="mt-2 text-3xl font-black text-white md:text-4xl">
        {title}
      </h2>

    </div>
  );
}

function ArchitectureCard({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 transition hover:border-cyan-500/30">

      <h3 className="text-xl font-bold text-white">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-gray-400">
        {text}
      </p>

    </div>
  );
}

function MetricCard({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/60 p-5">

      <p className="text-lg font-bold text-white">
        {title}
      </p>

      <p className="mt-3 text-sm leading-6 text-gray-400">
        {text}
      </p>

    </div>
  );
}

function FlowStep({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">

      <span className="text-sm font-bold text-cyan-400">
        {number}
      </span>

      <h3 className="mt-3 text-lg font-bold text-white">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-gray-400">
        {text}
      </p>

    </div>
  );
}

function SecurityRow({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">

      <div className="flex gap-4">

        <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-cyan-400" />

        <div>

          <h3 className="font-bold text-white">
            {title}
          </h3>

          <p className="mt-2 text-sm leading-6 text-gray-400">
            {text}
          </p>

        </div>

      </div>

    </div>
  );
}

function TableRow({
  name,
  value,
}: {
  name: string;
  value: string;
}) {
  return (
    <div className="grid grid-cols-2 border-t border-slate-800 px-5 py-4 text-sm">

      <span className="font-semibold text-white">
        {name}
      </span>

      <span className="text-gray-400">
        {value}
      </span>

    </div>
  );
}

function InfoBox({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mt-8 rounded-2xl border border-cyan-500/20 bg-cyan-950/10 p-5">

      <p className="text-sm leading-7 text-gray-300">
        {children}
      </p>

    </div>
  );
}
