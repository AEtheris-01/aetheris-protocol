"use client";

import Link from "next/link";

const CONTRACTS = {
  AETR:
    "0xA6E6B409d1C40df1508bD06dC3B6f03f3CfeE66f",
  AUSD:
    "0x614828e0b0db723e2B15196c6c6EcD230bf960A6",
  Oracle:
    "0xe8a3b616fa79C77908F304AB7C0b03976295c4f0",
  Treasury:
    "0xf8e361Ae009bEE83FB78bcD7B10Dbb4839413B40",
  Vault:
    "0xF7DaA3b8DBFc3E923ce9645BA803d5Cff86d38C6",
  FeeRouter:
    "0x14830D7463C51c1EDf78f42bCC93D7017c306211",
  Staking:
    "0x07f1752864abcFA1AE67742dF61E3ADD368f22b8",
};

const etherscan = (address: string) =>
  `https://sepolia.etherscan.io/address/${address}`;

export default function DocsPage() {
  return (
    <main className="min-h-screen bg-[#030712] text-white">

      {/* HEADER */}

      <header className="sticky top-0 z-50 border-b border-cyan-500/10 bg-[#030712]/95 backdrop-blur">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">

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

          <div className="flex items-center gap-3">

            <a
              href="https://x.com/Aetheris_pro"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-xl border border-slate-700 px-4 py-2 text-sm text-gray-300 transition hover:border-cyan-500/40 hover:text-cyan-400 sm:block"
            >
              X
            </a>

            <a
              href="/AETHERIS-V2-Whitepaper.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-400 transition hover:bg-cyan-500/20"
            >
              Whitepaper
            </a>

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

      <section className="border-b border-cyan-500/10">

        <div className="mx-auto max-w-7xl px-5 py-20 md:px-8">

          <div className="max-w-4xl">

            <div className="mb-5 inline-flex rounded-full border border-cyan-500/20 bg-cyan-500/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
              Ethereum Sepolia · AETHERIS V2
            </div>

            <h1 className="text-5xl font-black tracking-tight md:text-7xl">
              AETHERIS
              <span className="block text-cyan-400">
                Protocol Documentation
              </span>
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-400">
              A collateralized monetary protocol built around AUSD,
              Vault-based collateral management, oracle infrastructure,
              protocol fee routing, Treasury reserves, AETR and staking.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">

              <a
                href="/AETHERIS-V2-Whitepaper.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-cyan-500 px-6 py-3 font-bold text-black transition hover:bg-cyan-400"
              >
                Read Whitepaper
              </a>

              <a
                href="/AETHERIS-V2-Whitepaper.pdf"
                download
                className="rounded-xl border border-slate-700 px-6 py-3 font-semibold text-gray-200 transition hover:border-cyan-500/40 hover:text-cyan-400"
              >
                Download PDF
              </a>

              <a
                href="https://github.com/AEtheris-01/aetheris-protocol"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-slate-700 px-6 py-3 font-semibold text-gray-200 transition hover:border-cyan-500/40 hover:text-cyan-400"
              >
                GitHub
              </a>

            </div>

          </div>

        </div>

      </section>


      {/* CONTENT */}

      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 md:grid-cols-[220px_1fr] md:px-8">

        {/* SIDEBAR */}

        <aside className="hidden md:block">

          <div className="sticky top-24 rounded-2xl border border-slate-800 bg-slate-950/60 p-5">

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
              Contents
            </p>

            <nav className="mt-5 space-y-3 text-sm text-gray-500">

              <a href="#overview" className="block hover:text-cyan-400">
                Overview
              </a>

              <a href="#architecture" className="block hover:text-cyan-400">
                Architecture
              </a>

              <a href="#ausd" className="block hover:text-cyan-400">
                AUSD
              </a>

              <a href="#vault" className="block hover:text-cyan-400">
                Vault
              </a>

              <a href="#liquidation" className="block hover:text-cyan-400">
                Liquidation
              </a>

              <a href="#oracle" className="block hover:text-cyan-400">
                Oracle
              </a>

              <a href="#fees" className="block hover:text-cyan-400">
                Fee Router
              </a>

              <a href="#treasury" className="block hover:text-cyan-400">
                Treasury
              </a>

              <a href="#aetr" className="block hover:text-cyan-400">
                AETR
              </a>

              <a href="#staking" className="block hover:text-cyan-400">
                Staking
              </a>

              <a href="#security" className="block hover:text-cyan-400">
                Security
              </a>

              <a href="#contracts" className="block hover:text-cyan-400">
                Contracts
              </a>

            </nav>

          </div>

        </aside>


        {/* MAIN */}

        <article className="max-w-4xl space-y-16">


          {/* OVERVIEW */}

          <section id="overview">

            <SectionTitle
              number="01"
              title="Protocol Overview"
            />

            <p className="leading-8 text-gray-400">
              AETHERIS is a modular collateralized monetary protocol.
              The V2 architecture separates collateral management,
              stablecoin accounting, price data, fee routing, Treasury
              reserves, token economics and staking into dedicated
              smart-contract systems.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">

              <InfoCard
                title="AUSD"
                text="Collateral-backed stablecoin accounting layer."
              />

              <InfoCard
                title="Vault"
                text="Collateral, debt, borrowing, repayment and liquidation."
              />

              <InfoCard
                title="Oracle"
                text="ETH, BTC and AETR market-price infrastructure."
              />

              <InfoCard
                title="AETR"
                text="Protocol token with supply and emission controls."
              />

            </div>

          </section>


          {/* ARCHITECTURE */}

          <section id="architecture">

            <SectionTitle
              number="02"
              title="Protocol Architecture"
            />

            <p className="leading-8 text-gray-400">
              AETHERIS V2 uses a modular architecture so that each
              protocol subsystem has a clearly defined responsibility.
            </p>

            <div className="mt-8 overflow-hidden rounded-2xl border border-slate-800">

              <table className="w-full text-left text-sm">

                <thead className="bg-slate-900">

                  <tr>
                    <th className="px-5 py-4 text-cyan-400">
                      Component
                    </th>

                    <th className="px-5 py-4 text-cyan-400">
                      Responsibility
                    </th>
                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-800">

                  <ArchitectureRow
                    name="Vault"
                    text="Collateral, debt, borrowing, repayment, withdrawals and liquidation."
                  />

                  <ArchitectureRow
                    name="AUSD"
                    text="Stablecoin balances, supply, minting and burning."
                  />

                  <ArchitectureRow
                    name="PriceOracle"
                    text="ETH, BTC and AETR price data and freshness."
                  />

                  <ArchitectureRow
                    name="ProtocolFeeRouter"
                    text="Protocol fee calculation and allocation accounting."
                  />

                  <ArchitectureRow
                    name="Treasury"
                    text="Reserve balances and designated cold-wallet infrastructure."
                  />

                  <ArchitectureRow
                    name="AETRToken"
                    text="AETR supply, burn and controlled future emissions."
                  />

                  <ArchitectureRow
                    name="Staking"
                    text="AETR staking balances and withdrawals."
                  />

                </tbody>

              </table>

            </div>

          </section>


          {/* AUSD */}

          <section id="ausd">

            <SectionTitle
              number="03"
              title="AUSD Stablecoin"
            />

            <p className="leading-8 text-gray-400">
              AUSD is the stablecoin layer of AETHERIS. The deployed
              contract uses role-based authorization for privileged
              monetary operations.
            </p>

            <div className="mt-6 space-y-3">

              <Bullet text="ERC-20 compatible token." />
              <Bullet text="18 decimal places in the deployed implementation." />
              <Bullet text="Role-controlled minting." />
              <Bullet text="Role-controlled burning." />
              <Bullet text="Administrative access controls." />

            </div>

            <Callout>
              The deployed AUSD smart contract remains the source of
              truth for supply, balances and privileged monetary operations.
            </Callout>

          </section>


          {/* VAULT */}

          <section id="vault">

            <SectionTitle
              number="04"
              title="Vault & Collateral"
            />

            <p className="leading-8 text-gray-400">
              The Vault is the primary collateralized debt engine.
              A user deposits ETH collateral and may borrow AUSD subject
              to the Vault's configured risk parameters.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">

              <InfoCard
                title="Deposit"
                text="Deposit ETH into an individual collateralized position."
              />

              <InfoCard
                title="Borrow"
                text="Borrow AUSD against available collateral capacity."
              />

              <InfoCard
                title="Repay"
                text="Repay outstanding AUSD debt."
              />

              <InfoCard
                title="Withdraw"
                text="Withdraw collateral when the resulting position remains valid."
              />

            </div>

            <h3 className="mt-10 text-xl font-bold">
              V2 risk parameters
            </h3>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">

              <Parameter name="MAX_LTV_BPS" />
              <Parameter name="LIQUIDATION_THRESHOLD_BPS" />
              <Parameter name="LIQUIDATION_BONUS_BPS" />
              <Parameter name="MAX_LIQUIDATION_CLOSE_FACTOR_BPS" />
              <Parameter name="BORROW_FEE_BPS" />

            </div>

          </section>


          {/* LIQUIDATION */}

          <section id="liquidation">

            <SectionTitle
              number="05"
              title="Liquidation Engine"
            />

            <p className="leading-8 text-gray-400">
              The liquidation engine is designed to protect the
              collateralized debt system when a position no longer
              satisfies the configured health requirements.
            </p>

            <div className="mt-6 space-y-3">

              <Bullet text="Position health can be queried through isHealthy()." />
              <Bullet text="Liquidatable debt can be processed through liquidate()." />
              <Bullet text="Liquidation threshold is controlled by the Vault." />
              <Bullet text="Liquidation bonus is defined by the Vault." />
              <Bullet text="Maximum liquidation close factor limits the amount that can be liquidated." />

            </div>

            <Callout>
              Liquidation enforcement occurs inside the smart contract.
              The website is an interface and monitoring layer.
            </Callout>

          </section>


          {/* ORACLE */}

          <section id="oracle">

            <SectionTitle
              number="06"
              title="Price Oracle"
            />

            <p className="leading-8 text-gray-400">
              The V2 PriceOracle provides price information used by
              protocol components and exposes timestamp and freshness
              information.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">

              <InfoCard
                title="ETH"
                text="ETH price feed."
              />

              <InfoCard
                title="BTC"
                text="BTC price feed."
              />

              <InfoCard
                title="AETR"
                text="AETR price feed."
              />

            </div>

            <h3 className="mt-10 text-xl font-bold">
              Oracle security
            </h3>

            <p className="mt-4 leading-8 text-gray-400">
              The oracle exposes a configurable maximum price age and
              freshness checks. This is important because stale price
              information can affect collateral valuation, borrowing
              capacity and liquidation decisions.
            </p>

          </section>


          {/* FEE ROUTER */}

          <section id="fees">

            <SectionTitle
              number="07"
              title="Protocol Fee Router"
            />

            <p className="leading-8 text-gray-400">
              The ProtocolFeeRouter provides the fee-accounting layer
              of the deployed V2 architecture.
            </p>

            <div className="mt-6 space-y-3">

              <Bullet text="AUSD fee calculation." />
              <Bullet text="Total fee basis points." />
              <Bullet text="AETR allocation accounting." />
              <Bullet text="BTC allocation accounting." />
              <Bullet text="Cumulative protocol fee tracking." />
              <Bullet text="Treasury configuration." />
              <Bullet text="Fee collector configuration." />

            </div>

          </section>


          {/* TREASURY */}

          <section id="treasury">

            <SectionTitle
              number="08"
              title="Treasury & Cold-Wallet Architecture"
            />

            <p className="leading-8 text-gray-400">
              Treasury reserves are separated conceptually from active
              user collateral. The deployed Treasury contract exposes
              ETH and token balances and identifies a designated cold
              wallet.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">

              <InfoCard
                title="Reserve Separation"
                text="Treasury reserves are separated from active Vault collateral."
              />

              <InfoCard
                title="Cold Wallet"
                text="A designated cold-wallet address is exposed by the Treasury."
              />

              <InfoCard
                title="ETH Reserves"
                text="Treasury ETH balance and controlled withdrawal functionality."
              />

              <InfoCard
                title="Token Reserves"
                text="Treasury token balances and controlled token withdrawals."
              />

            </div>

            <Callout>
              Cold-wallet custody can reduce online exposure but cannot
              provide an absolute guarantee against loss, compromise or
              operational error.
            </Callout>

          </section>


          {/* AETR */}

          <section id="aetr">

            <SectionTitle
              number="09"
              title="AETR Tokenomics"
            />

            <p className="leading-8 text-gray-400">
              AETR is the native protocol token. The deployed contract
              exposes supply, allocation and future-emission parameters
              that are read by the live website tokenomics dashboard.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">

              <InfoCard
                title="MAX_SUPPLY"
                text="Maximum supply parameter exposed by the token contract."
              />

              <InfoCard
                title="INITIAL_SUPPLY"
                text="Initial supply parameter exposed by the token contract."
              />

              <InfoCard
                title="Future Emission"
                text="Controlled future-emission functionality."
              />

              <InfoCard
                title="Burn"
                text="AETR burn functionality."
              />

              <InfoCard
                title="Treasury Allocation"
                text="Contract-defined Treasury allocation."
              />

              <InfoCard
                title="Vault Incentives"
                text="Contract-defined Vault incentive allocation."
              />

            </div>

            <Callout>
              Live supply and allocation values should always be verified
              against the deployed AETR contract.
            </Callout>

          </section>


          {/* STAKING */}

          <section id="staking">

            <SectionTitle
              number="10"
              title="AETR Staking"
            />

            <p className="leading-8 text-gray-400">
              The deployed Staking contract provides AETR staking
              functionality and tracks individual and total staked
              balances.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">

              <Parameter name="stake(uint256)" />
              <Parameter name="withdraw(uint256)" />
              <Parameter name="balances(address)" />
              <Parameter name="totalStaked()" />

            </div>

            <div className="mt-8">

              <Link
                href="/dashboard"
                className="inline-flex rounded-xl bg-cyan-500 px-6 py-3 font-bold text-black hover:bg-cyan-400"
              >
                Open AETHERIS Dashboard
              </Link>

            </div>

          </section>


          {/* SECURITY */}

          <section id="security">

            <SectionTitle
              number="11"
              title="Security Architecture"
            />

            <p className="leading-8 text-gray-400">
              AETHERIS V2 uses multiple security layers rather than
              relying on a single protection mechanism.
            </p>

            <div className="mt-8 space-y-4">

              <SecurityRow
                title="Access Control"
                text="Privileged operations are restricted by contract-level authorization."
              />

              <SecurityRow
                title="Oracle Freshness"
                text="Price data includes timestamp and freshness controls."
              />

              <SecurityRow
                title="Vault Risk Controls"
                text="Borrowing and liquidation are governed by explicit parameters."
              />

              <SecurityRow
                title="Pause Controls"
                text="Relevant V2 contracts expose pause and unpause functionality."
              />

              <SecurityRow
                title="Treasury Separation"
                text="Reserve custody is separated from active user collateral."
              />

              <SecurityRow
                title="AUSD Roles"
                text="Minting and burning are protected through role-based access control."
              />

              <SecurityRow
                title="Emission Control"
                text="Future AETR emissions use an emission-controller mechanism."
              />

            </div>

            <div className="mt-8 rounded-2xl border border-yellow-500/20 bg-yellow-950/10 p-6">

              <p className="font-bold text-yellow-400">
                Security Disclaimer
              </p>

              <p className="mt-3 text-sm leading-7 text-gray-400">
                No smart-contract protocol can honestly guarantee that
                it is impossible to hack. AETHERIS security should be
                evaluated through code review, testing, auditing,
                monitoring, key-management controls and responsible
                disclosure.
              </p>

            </div>

          </section>


          {/* TESTNET */}

          <section id="testnet">

            <SectionTitle
              number="12"
              title="Ethereum Sepolia Testnet"
            />

            <p className="leading-8 text-gray-400">
              The current AETHERIS V2 website is connected to Ethereum
              Sepolia for public testing.
            </p>

            <div className="mt-8 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-6">

              <p className="text-sm font-semibold text-cyan-400">
                Current Network
              </p>

              <p className="mt-2 text-2xl font-black">
                Ethereum Sepolia
              </p>

              <p className="mt-3 text-sm leading-6 text-gray-400">
                Testnet assets have no intended production value.
              </p>

              <Link
                href="/dashboard"
                className="mt-5 inline-flex rounded-xl bg-cyan-500 px-5 py-3 font-bold text-black hover:bg-cyan-400"
              >
                Launch Testnet Dashboard
              </Link>

            </div>

          </section>


          {/* CONTRACTS */}

          <section id="contracts">

            <SectionTitle
              number="13"
              title="Smart Contract Addresses"
            />

            <p className="leading-8 text-gray-400">
              These are the AETHERIS V2 contract addresses currently
              configured by the website for Ethereum Sepolia.
            </p>

            <div className="mt-8 space-y-3">

              <ContractRow
                name="AETR Token"
                address={CONTRACTS.AETR}
              />

              <ContractRow
                name="AUSD Stablecoin"
                address={CONTRACTS.AUSD}
              />

              <ContractRow
                name="Price Oracle"
                address={CONTRACTS.Oracle}
              />

              <ContractRow
                name="Treasury"
                address={CONTRACTS.Treasury}
              />

              <ContractRow
                name="Vault"
                address={CONTRACTS.Vault}
              />

              <ContractRow
                name="Protocol Fee Router"
                address={CONTRACTS.FeeRouter}
              />

              <ContractRow
                name="Staking"
                address={CONTRACTS.Staking}
              />

            </div>

          </section>


          {/* WHITEPAPER */}

          <section id="whitepaper">

            <SectionTitle
              number="14"
              title="AETHERIS V2 Whitepaper"
            />

            <p className="leading-8 text-gray-400">
              The complete AETHERIS V2 technical whitepaper documents
              the protocol architecture, AUSD, Vaults, liquidation,
              oracle infrastructure, fee routing, Treasury, AETR,
              staking, security and roadmap.
            </p>

            <div className="mt-8 rounded-2xl border border-cyan-500/20 bg-slate-950 p-7">

              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

                <div>

                  <p className="text-xl font-bold">
                    AETHERIS Protocol — V2 Whitepaper
                  </p>

                  <p className="mt-2 text-sm text-gray-500">
                    Technical protocol documentation · PDF
                  </p>

                </div>

                <div className="flex flex-wrap gap-3">

                  <a
                    href="/AETHERIS-V2-Whitepaper.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl bg-cyan-500 px-5 py-3 font-bold text-black hover:bg-cyan-400"
                  >
                    Read
                  </a>

                  <a
                    href="/AETHERIS-V2-Whitepaper.pdf"
                    download
                    className="rounded-xl border border-slate-700 px-5 py-3 font-semibold text-gray-200 hover:border-cyan-500/40 hover:text-cyan-400"
                  >
                    Download
                  </a>

                </div>

              </div>

            </div>

          </section>


          {/* COMMUNITY */}

          <section>

            <SectionTitle
              number="15"
              title="Community & Development"
            />

            <p className="leading-8 text-gray-400">
              Follow AETHERIS development and review the protocol source
              through the official project channels.
            </p>

            <div className="mt-7 flex flex-wrap gap-4">

              <a
                href="https://x.com/Aetheris_pro"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-slate-700 px-6 py-3 font-semibold text-gray-200 hover:border-cyan-500/40 hover:text-cyan-400"
              >
                X · @Aetheris_pro
              </a>

              <a
                href="https://github.com/AEtheris-01/aetheris-protocol"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-slate-700 px-6 py-3 font-semibold text-gray-200 hover:border-cyan-500/40 hover:text-cyan-400"
              >
                GitHub Repository
              </a>

            </div>

          </section>


          {/* DISCLAIMER */}

          <section className="border-t border-slate-800 pt-12">

            <h2 className="text-2xl font-black">
              Disclaimer
            </h2>

            <p className="mt-5 text-sm leading-7 text-gray-500">
              This documentation is informational and technical in
              nature. It is not financial, legal, tax or investment
              advice.
            </p>

            <p className="mt-4 text-sm leading-7 text-gray-500">
              AETHERIS V2 is currently presented through Ethereum
              Sepolia testnet infrastructure. Testnet tokens do not
              represent production assets or reserves.
            </p>

            <p className="mt-4 text-sm leading-7 text-gray-500">
              Smart-contract systems involve risks including
              vulnerabilities, oracle failures, market volatility,
              liquidation risk, liquidity risk, key-management risk
              and operational failures.
            </p>

            <p className="mt-4 text-sm leading-7 text-gray-500">
              No statement in this documentation guarantees that AUSD
              will always trade at exactly USD 1, that funds cannot be
              lost, or that the protocol cannot be compromised.
            </p>

          </section>

        </article>

      </div>


      {/* FOOTER */}

      <footer className="border-t border-slate-800 bg-[#020617]">

        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-10 md:flex-row md:items-center md:justify-between md:px-8">

          <div>

            <p className="font-black tracking-wide">
              AETHERIS
            </p>

            <p className="mt-1 text-xs text-gray-600">
              Decentralized Monetary Protocol · V2
            </p>

          </div>

          <div className="flex flex-wrap gap-5 text-sm text-gray-500">

            <Link
              href="/"
              className="hover:text-cyan-400"
            >
              Home
            </Link>

            <Link
              href="/dashboard"
              className="hover:text-cyan-400"
            >
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

        </div>

      </footer>

    </main>
  );
}


/* =========================================================
   COMPONENTS
========================================================= */

function SectionTitle({
  number,
  title,
}: {
  number: string;
  title: string;
}) {
  return (
    <div className="mb-6">

      <p className="text-xs font-bold tracking-[0.25em] text-cyan-500">
        {number}
      </p>

      <h2 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">
        {title}
      </h2>

      <div className="mt-4 h-px w-20 bg-cyan-500/50" />

    </div>
  );
}


function InfoCard({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 transition hover:border-cyan-500/20">

      <p className="font-bold text-cyan-400">
        {title}
      </p>

      <p className="mt-2 text-sm leading-6 text-gray-500">
        {text}
      </p>

    </div>
  );
}


function ArchitectureRow({
  name,
  text,
}: {
  name: string;
  text: string;
}) {
  return (
    <tr className="bg-slate-950/40">

      <td className="px-5 py-4 font-semibold text-white">
        {name}
      </td>

      <td className="px-5 py-4 text-gray-500">
        {text}
      </td>

    </tr>
  );
}


function Bullet({
  text,
}: {
  text: string;
}) {
  return (
    <div className="flex gap-3 text-sm leading-7 text-gray-400">

      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />

      <span>{text}</span>

    </div>
  );
}


function Parameter({
  name,
}: {
  name: string;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 font-mono text-sm text-cyan-400">
      {name}
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
    <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">

      <p className="font-bold text-white">
        {title}
      </p>

      <p className="mt-2 text-sm leading-6 text-gray-500">
        {text}
      </p>

    </div>
  );
}
function Callout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mt-8 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5">
      <p className="text-sm leading-7 text-gray-400">
        {children}
      </p>
    </div>
  );
}

function ContractRow({
  name,
  address,
}: {
  name: string;
  address: string;
}) {
  return (
    <a
      href={etherscan(address)}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-2xl border border-slate-800 bg-slate-950/60 p-5 transition hover:border-cyan-500/30"
    >

      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">

        <p className="font-bold text-white">
          {name}
        </p>

        <span className="text-xs font-semibold text-cyan-400">
          View on Etherscan →
        </span>

      </div>

      <p className="mt-3 break-all font-mono text-xs text-gray-500 group-hover:text-gray-400">
        {address}
      </p>

    </a>
  );
}
