import Link from "next/link";

const contracts = [
  {
    name: "Vault",
    address: "0xF7DaA3b8DBFc3E923ce9645BA803d5Cff86d38C6",
  },
  {
    name: "AUSD",
    address: "0x614828e0b0db723e2B15196c6c6EcD230bf960A6",
  },
  {
    name: "AETR",
    address: "0xA6E6B409d1C40df1508bD06dC3B6f03f3CfeE66f",
  },
  {
    name: "Price Oracle",
    address: "0xe8a3b616fa79C77908F304AB7C0b03976295c4f0",
  },
];

const etherscan = (address: string) =>
  `https://sepolia.etherscan.io/address/${address}`;

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#030712] text-white">

      {/* NAVBAR */}

      <header className="fixed left-0 right-0 top-0 z-50 border-b border-cyan-500/10 bg-[#030712]/80 backdrop-blur-xl">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">

          <Link href="/" className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-400/10">
              <span className="text-xl font-black text-cyan-400">
                A
              </span>
            </div>

            <div>
              <div className="font-black tracking-wide">
                AETHERIS
              </div>

              <div className="text-[9px] uppercase tracking-[0.25em] text-gray-500">
                Protocol V2
              </div>
            </div>

          </Link>

          <nav className="hidden items-center gap-7 text-sm text-gray-400 lg:flex">

            <a href="#protocol" className="hover:text-cyan-400">
              Protocol
            </a>

            <a href="#tokenomics" className="hover:text-cyan-400">
              Tokenomics
            </a>

            <a href="#security" className="hover:text-cyan-400">
              Security
            </a>

            <Link href="/docs" className="hover:text-cyan-400">
              Docs
            </Link>

          </nav>

          <div className="flex items-center gap-2">

            <a
              href="https://x.com/Aetheris_pro"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-xl border border-slate-800 px-4 py-2 text-sm text-gray-300 hover:border-cyan-500/30 hover:text-cyan-400 sm:block"
            >
              X
            </a>

            <Link
              href="/docs#whitepaper"
              className="hidden rounded-xl border border-slate-800 px-4 py-2 text-sm text-gray-300 hover:border-cyan-500/30 hover:text-cyan-400 md:block"
            >
              Whitepaper
            </Link>

            <Link
              href="/dashboard"
              className="rounded-xl bg-cyan-500 px-4 py-2 text-sm font-bold text-black transition hover:bg-cyan-400"
            >
              Launch App
            </Link>

          </div>

        </div>

      </header>


      {/* HERO */}

      <section className="relative px-5 pb-24 pt-36 md:px-8 md:pb-32 md:pt-48">

        <div className="pointer-events-none absolute left-1/2 top-20 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl">

          <div className="max-w-5xl">

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">

              <span className="h-2 w-2 rounded-full bg-green-400" />

              AETHERIS V2 · SEPOLIA TESTNET

            </div>

            <h1 className="text-5xl font-black leading-[0.95] tracking-tight md:text-7xl lg:text-8xl">

              The collateralized

              <span className="block text-cyan-400">
                monetary protocol.
              </span>

            </h1>

            <p className="mt-8 max-w-3xl text-lg leading-8 text-gray-400 md:text-xl">

              AETHERIS combines collateralized Vaults, AUSD,
              transparent on-chain risk controls, oracle infrastructure,
              protocol fee routing, Treasury reserves and AETR
              token economics into one modular protocol.

            </p>

            <div className="mt-9 flex flex-wrap gap-4">

              <Link
                href="/dashboard"
                className="rounded-xl bg-cyan-500 px-7 py-4 font-bold text-black shadow-lg shadow-cyan-500/10 transition hover:bg-cyan-400"
              >
                Launch AETHERIS →
              </Link>

              <a
                href="/AETHERIS-V2-Whitepaper.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-slate-700 bg-slate-950/60 px-7 py-4 font-semibold text-gray-200 transition hover:border-cyan-500/30 hover:text-cyan-400"
              >
                Read Whitepaper
              </a>

              <Link
                href="/docs"
                className="rounded-xl border border-slate-800 px-7 py-4 font-semibold text-gray-400 transition hover:border-cyan-500/30 hover:text-cyan-400"
              >
                Explore Docs
              </Link>

            </div>

          </div>


          {/* HERO METRICS */}

          <div className="mt-20 grid gap-4 md:grid-cols-4">

            <Metric
              value="AUSD"
              label="Protocol Stablecoin"
            />

            <Metric
              value="AETR"
              label="Native Protocol Token"
            />

            <Metric
              value="V2"
              label="Current Architecture"
            />

            <Metric
              value="Sepolia"
              label="Current Testnet"
            />

          </div>

        </div>

      </section>


      {/* PROTOCOL */}

      <section
        id="protocol"
        className="border-y border-slate-800/80 bg-slate-950/40 px-5 py-24 md:px-8"
      >

        <div className="mx-auto max-w-7xl">

          <SectionHeader
            eyebrow="PROTOCOL"
            title="One architecture. Multiple layers."
            text="AETHERIS V2 separates the protocol into dedicated components so collateral, monetary accounting, market data, reserves and token economics can be independently monitored."
          />

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">

            <ProtocolCard
              number="01"
              title="Vault"
              text="Deposit collateral, borrow AUSD, repay debt and manage collateralized positions."
              href="/dashboard"
              action="Open Vault"
            />

            <ProtocolCard
              number="02"
              title="AUSD"
              text="The protocol's stablecoin accounting layer with controlled minting and burning."
              href="/docs#ausd"
              action="Learn about AUSD"
            />

            <ProtocolCard
              number="03"
              title="Liquidation"
              text="Position health, liquidation thresholds, bonuses and close-factor controls protect the debt system."
              href="/docs#liquidation"
              action="Explore liquidation"
            />

            <ProtocolCard
              number="04"
              title="Price Oracle"
              text="ETH, BTC and AETR pricing infrastructure with timestamp and freshness controls."
              href="/docs#oracle"
              action="View oracle"
            />

            <ProtocolCard
              number="05"
              title="Protocol Fee Router"
              text="Fee calculation and allocation accounting across the protocol's economic infrastructure."
              href="/docs#fees"
              action="Explore fees"
            />

            <ProtocolCard
              number="06"
              title="Treasury"
              text="A separate reserve layer designed around controlled custody and designated cold-wallet infrastructure."
              href="/docs#treasury"
              action="Explore Treasury"
            />

          </div>

        </div>

      </section>


      {/* HOW IT WORKS */}

      <section className="px-5 py-24 md:px-8">

        <div className="mx-auto max-w-7xl">

          <SectionHeader
            eyebrow="HOW IT WORKS"
            title="From collateral to protocol liquidity."
            text="The AETHERIS V2 user flow is designed around transparent smart-contract execution."
          />

          <div className="mt-14 grid gap-5 md:grid-cols-4">

            <FlowStep
              number="01"
              title="Deposit"
              text="Deposit ETH collateral into your Vault."
            />

            <FlowStep
              number="02"
              title="Borrow"
              text="Borrow AUSD within your available collateral capacity."
            />

            <FlowStep
              number="03"
              title="Manage"
              text="Monitor collateral, debt and position health."
            />

            <FlowStep
              number="04"
              title="Repay"
              text="Repay AUSD debt and unlock collateral capacity."
            />

          </div>

        </div>

      </section>


      {/* TOKENOMICS */}

      <section
        id="tokenomics"
        className="border-y border-slate-800/80 bg-slate-950/40 px-5 py-24 md:px-8"
      >

        <div className="mx-auto max-w-7xl">

          <SectionHeader
            eyebrow="AETR TOKENOMICS"
            title="AETR. The protocol token."
            text="AETR provides the token layer of AETHERIS. Supply, allocation and future-emission parameters are exposed directly by the deployed token contract."
          />

          <div className="mt-14 grid gap-5 lg:grid-cols-3">

            <TokenCard
              title="Supply"
              items={[
                "MAX_SUPPLY",
                "INITIAL_SUPPLY",
                "Total supply tracking",
              ]}
            />

            <TokenCard
              title="Allocation"
              items={[
                "Airdrop allocation",
                "Treasury allocation",
                "Vault incentive allocation",
              ]}
            />

            <TokenCard
              title="Protocol Utility"
              items={[
                "AETR staking",
                "Controlled future emission",
                "Token burn functionality",
              ]}
            />

          </div>

          <div className="mt-8 flex flex-wrap gap-4">

            <Link
              href="/dashboard"
              className="rounded-xl bg-cyan-500 px-6 py-3 font-bold text-black hover:bg-cyan-400"
            >
              View Live Tokenomics
            </Link>

            <Link
              href="/docs#aetr"
              className="rounded-xl border border-slate-700 px-6 py-3 font-semibold text-gray-300 hover:border-cyan-500/30 hover:text-cyan-400"
            >
              AETR Documentation
            </Link>

          </div>

        </div>

      </section>


      {/* SECURITY */}

      <section
        id="security"
        className="px-5 py-24 md:px-8"
      >

        <div className="mx-auto max-w-7xl">

          <SectionHeader
            eyebrow="SECURITY"
            title="Security through separation."
            text="AETHERIS V2 uses multiple contract-level controls rather than relying on a single security mechanism."
          />

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">

            <SecurityCard
              title="Access Control"
              text="Privileged protocol functions are protected through contract-level authorization."
            />

            <SecurityCard
              title="Oracle Freshness"
              text="Price information includes timestamps and freshness controls."
            />

            <SecurityCard
              title="Vault Risk Controls"
              text="Borrowing and liquidation are governed by explicit protocol parameters."
            />

            <SecurityCard
              title="Pause Controls"
              text="Relevant V2 components expose pause and unpause functionality."
            />

            <SecurityCard
              title="Treasury Separation"
              text="Protocol reserves are separated conceptually from active user collateral."
            />

            <SecurityCard
              title="Controlled Emissions"
              text="Future AETR emissions are subject to an emission-controller mechanism."
            />

          </div>

          <div className="mt-10 rounded-2xl border border-yellow-500/20 bg-yellow-950/10 p-6">

            <p className="font-bold text-yellow-400">
              Security principle
            </p>

            <p className="mt-3 max-w-4xl text-sm leading-7 text-gray-500">
              No smart-contract system can honestly guarantee that it
              is impossible to compromise. AETHERIS security must be
              evaluated through testing, code review, audits, monitoring,
              key management and operational controls.
            </p>

          </div>

        </div>

      </section>


      {/* TREASURY */}

      <section className="border-y border-slate-800/80 bg-slate-950/40 px-5 py-24 md:px-8">

        <div className="mx-auto max-w-7xl">

          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">
                RESERVE ARCHITECTURE
              </p>

              <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
                Treasury and cold-wallet separation.
              </h2>

              <p className="mt-6 leading-8 text-gray-500">
                AETHERIS separates active Vault collateral from the
                protocol's Treasury layer. The deployed Treasury
                exposes reserve balances and a designated cold-wallet
                address.
              </p>

              <Link
                href="/docs#treasury"
                className="mt-8 inline-flex rounded-xl border border-cyan-500/30 px-6 py-3 font-semibold text-cyan-400 hover:bg-cyan-500/10"
              >
                Explore Treasury →
              </Link>

            </div>

            <div className="grid gap-4 sm:grid-cols-2">

              <InfoTile
                title="Vault"
                value="User collateral"
              />

              <InfoTile
                title="Treasury"
                value="Protocol reserves"
              />

              <InfoTile
                title="Cold Wallet"
                value="Reduced online exposure"
              />

              <InfoTile
                title="Controls"
                value="Contract authorization"
              />

            </div>

          </div>

        </div>

      </section>


      {/* LIVE DEPLOYMENT */}

      <section className="px-5 py-24 md:px-8">

        <div className="mx-auto max-w-7xl">

          <div className="rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 via-slate-950 to-slate-950 p-8 md:p-12">

            <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">

              <div className="max-w-2xl">

                <div className="inline-flex rounded-full border border-green-500/20 bg-green-500/5 px-3 py-1 text-xs font-semibold text-green-400">
                  LIVE TESTNET
                </div>

                <h2 className="mt-5 text-4xl font-black">
                  AETHERIS V2 is live on Sepolia.
                </h2>

                <p className="mt-5 leading-8 text-gray-500">
                  Connect your wallet and interact with the deployed
                  AETHERIS V2 contracts through the protocol dashboard.
                </p>

              </div>

              <Link
                href="/dashboard"
                className="shrink-0 rounded-xl bg-cyan-500 px-8 py-4 text-center font-bold text-black hover:bg-cyan-400"
              >
                Launch Testnet App →
              </Link>

            </div>

          </div>

        </div>

      </section>


      {/* CONTRACTS */}

      <section className="border-t border-slate-800/80 bg-slate-950/40 px-5 py-24 md:px-8">

        <div className="mx-auto max-w-7xl">

          <SectionHeader
            eyebrow="ON-CHAIN"
            title="Verify the protocol."
            text="Review the deployed AETHERIS V2 contracts directly on Ethereum Sepolia."
          />

          <div className="mt-12 grid gap-4 md:grid-cols-2">

            {contracts.map((contract) => (
              <a
                key={contract.name}
                href={etherscan(contract.address)}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 transition hover:border-cyan-500/30"
              >

                <div className="flex items-center justify-between">

                  <p className="font-bold">
                    {contract.name}
                  </p>

                  <span className="text-xs text-cyan-400">
                    Etherscan →
                  </span>

                </div>

                <p className="mt-3 break-all font-mono text-xs text-gray-600">
                  {contract.address}
                </p>

              </a>
            ))}

          </div>

        </div>

      </section>


      {/* ROADMAP */}

      <section className="px-5 py-24 md:px-8">

        <div className="mx-auto max-w-7xl">

          <SectionHeader
            eyebrow="ROADMAP"
            title="Building toward production readiness."
            text="AETHERIS development progresses through testing, security review, economic validation and operational hardening."
          />

          <div className="mt-14 grid gap-5 md:grid-cols-4">

            <RoadmapCard
              phase="01"
              title="V2 Foundation"
              text="Vault, AUSD, AETR, Oracle, Treasury, Staking and fee infrastructure."
              active
            />

            <RoadmapCard
              phase="02"
              title="Public Testnet"
              text="Protocol dashboard, documentation, tokenomics and community testing."
              active
            />

            <RoadmapCard
              phase="03"
              title="Security Review"
              text="Expanded testing, monitoring, code review and independent security assessment."
            />

            <RoadmapCard
              phase="04"
              title="Production Readiness"
              text="Final economic, technical, operational and governance validation."
            />

          </div>

        </div>

      </section>


      {/* CTA */}

      <section className="border-t border-slate-800 bg-[#020617] px-5 py-24 md:px-8">

        <div className="mx-auto max-w-4xl text-center">

          <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-400">
            AETHERIS PROTOCOL
          </p>

          <h2 className="mt-5 text-4xl font-black md:text-6xl">
            Explore the protocol.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl leading-8 text-gray-500">
            Test AETHERIS V2 on Sepolia, review the documentation,
            inspect the contracts and follow protocol development.
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-4">

            <Link
              href="/dashboard"
              className="rounded-xl bg-cyan-500 px-7 py-4 font-bold text-black hover:bg-cyan-400"
            >
              Launch App
            </Link>

            <Link
              href="/docs"
              className="rounded-xl border border-slate-700 px-7 py-4 font-semibold text-gray-300 hover:border-cyan-500/30 hover:text-cyan-400"
            >
              Read Documentation
            </Link>

            <a
              href="https://x.com/Aetheris_pro"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-slate-700 px-7 py-4 font-semibold text-gray-300 hover:border-cyan-500/30 hover:text-cyan-400"
            >
              Follow @Aetheris_pro
            </a>

          </div>

        </div>

      </section>


      {/* FOOTER */}

      <footer className="border-t border-slate-800">

        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-10 md:flex-row md:items-center md:justify-between md:px-8">

          <div>

            <p className="font-black tracking-wide">
              AETHERIS
            </p>

            <p className="mt-1 text-xs text-gray-600">
              Decentralized Monetary Protocol · V2
            </p>

          </div>

          <div className="flex flex-wrap gap-5 text-sm text-gray-600">

            <Link href="/docs" className="hover:text-cyan-400">
              Docs
            </Link>

            <Link href="/dashboard" className="hover:text-cyan-400">
              Dashboard
            </Link>

            <a
              href="/AETHERIS-V2-Whitepaper.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-400"
            >
              Whitepaper
            </a>

            <a
              href="https://github.com/AEtheris-01/aetheris-protocol"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-400"
            >
              GitHub
            </a>

            <a
              href="https://x.com/Aetheris_pro"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-400"
            >
              X
            </a>

          </div>

        </div>

        <div className="border-t border-slate-900 px-5 py-5 text-center text-xs text-gray-700">
          AETHERIS V2 · Ethereum Sepolia · Testnet
        </div>

      </footer>

    </main>
  );
}


/* =========================================================
   COMPONENTS
========================================================= */

function Metric({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">

      <p className="text-2xl font-black text-cyan-400">
        {value}
      </p>

      <p className="mt-2 text-xs uppercase tracking-[0.15em] text-gray-600">
        {label}
      </p>

    </div>
  );
}


function SectionHeader({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text: string;
}) {
  return (
    <div className="max-w-3xl">

      <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">
        {eyebrow}
      </p>

      <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
        {title}
      </h2>

      <p className="mt-5 leading-8 text-gray-500">
        {text}
      </p>

    </div>
  );
}


function ProtocolCard({
  number,
  title,
  text,
  href,
  action,
}: {
  number: string;
  title: string;
  text: string;
  href: string;
  action: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-slate-800 bg-slate-950/50 p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-500/30 hover:bg-cyan-500/[0.03]"
    >

      <div className="flex items-center justify-between">

        <span className="font-mono text-xs text-cyan-500">
          {number}
        </span>

        <span className="text-gray-700 transition group-hover:text-cyan-400">
          →
        </span>

      </div>

      <h3 className="mt-8 text-xl font-bold">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-7 text-gray-500">
        {text}
      </p>

      <p className="mt-6 text-xs font-semibold text-cyan-500">
        {action}
      </p>

    </Link>
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
    <div className="relative rounded-2xl border border-slate-800 bg-slate-950/50 p-6">

      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 font-mono text-sm font-bold text-cyan-400">
        {number}
      </div>

      <h3 className="mt-7 text-xl font-bold">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-7 text-gray-500">
        {text}
      </p>

    </div>
  );
}


function TokenCard({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6">

      <h3 className="text-xl font-bold text-cyan-400">
        {title}
      </h3>

      <div className="mt-6 space-y-3">

        {items.map((item) => (
          <div
            key={item}
            className="rounded-xl bg-slate-900 px-4 py-3 text-sm text-gray-400"
          >
            {item}
          </div>
        ))}

      </div>

    </div>
  );
}


function SecurityCard({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6">

      <div className="h-2 w-2 rounded-full bg-cyan-400" />

      <h3 className="mt-6 text-xl font-bold">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-7 text-gray-500">
        {text}
      </p>

    </div>
  );
}


function InfoTile({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6">

      <p className="text-xs uppercase tracking-[0.2em] text-gray-600">
        {title}
      </p>

      <p className="mt-4 font-bold text-cyan-400">
        {value}
      </p>

    </div>
  );
}


function RoadmapCard({
  phase,
  title,
  text,
  active = false,
}: {
  phase: string;
  title: string;
  text: string;
  active?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-6 ${
        active
          ? "border-cyan-500/30 bg-cyan-500/[0.04]"
          : "border-slate-800 bg-slate-950/50"
      }`}
    >

      <div className="flex items-center justify-between">

        <span className="font-mono text-xs text-cyan-400">
          PHASE {phase}
        </span>

        {active && (
          <span className="rounded-full bg-green-500/10 px-2 py-1 text-[10px] font-bold text-green-400">
            ACTIVE
          </span>
        )}

      </div>

      <h3 className="mt-7 text-xl font-bold">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-7 text-gray-500">
        {text}
      </p>

    </div>
  );
}
