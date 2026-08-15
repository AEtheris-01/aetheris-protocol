export default function Footer() {
  const currentYear = new Date().getFullYear();

  const contracts = {
    vault:
      "0xF7DaA3b8DBFc3E923ce9645BA803d5Cff86d38C6",
    ausd:
      "0x614828e0b0db723e2B15196c6c6EcD230bf960A6",
    aetr:
      "0xA6E6B409d1C40df1508bD06dC3B6f03f3CfeE66f",
    treasury:
      "0xf8e361Ae009bEE83FB78bcD7B10Dbb4839413B40",
  };

  return (
    <footer className="border-t border-cyan-500/10 bg-[#03050f] text-white">

      <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">

        {/* Main footer grid */}

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}

          <div className="lg:col-span-2">

            <a
              href="/"
              className="inline-flex items-center gap-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-400/10">
                <span className="text-xl font-black text-cyan-400">
                  A
                </span>
              </div>

              <div>
                <p className="text-xl font-black tracking-wide">
                  AETHERIS
                </p>

                <p className="text-[9px] uppercase tracking-[0.25em] text-gray-500">
                  Decentralized Monetary Protocol
                </p>
              </div>
            </a>

            <p className="mt-5 max-w-xl text-sm leading-7 text-gray-400">
              AETHERIS is a collateralized monetary protocol built
              around AUSD, AETR, on-chain Vault risk management,
              protocol fee routing, oracle infrastructure and
              separated Treasury reserves.
            </p>

            {/* Social links */}

            <div className="mt-6 flex flex-wrap gap-3">

              <a
                href="https://x.com/Aetheris_pro"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-gray-300 transition hover:border-cyan-500/30 hover:text-cyan-400"
              >
                X · @Aetheris_pro
              </a>

              <a
                href="https://github.com/AEtheris-01/aetheris-protocol"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-gray-300 transition hover:border-cyan-500/30 hover:text-cyan-400"
              >
                GitHub
              </a>

            </div>

          </div>

          {/* Protocol */}

          <div>

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
              Protocol
            </p>

            <div className="mt-5 space-y-3">

              <a
                href="/"
                className="block text-sm text-gray-400 transition hover:text-cyan-400"
              >
                Home
              </a>

              <a
                href="/#protocol"
                className="block text-sm text-gray-400 transition hover:text-cyan-400"
              >
                Architecture
              </a>

              <a
                href="/#tokenomics"
                className="block text-sm text-gray-400 transition hover:text-cyan-400"
              >
                Tokenomics
              </a>

              <a
                href="/docs"
                className="block text-sm text-gray-400 transition hover:text-cyan-400"
              >
                Documentation
              </a>

              <a
                href="/docs#security"
                className="block text-sm text-gray-400 transition hover:text-cyan-400"
              >
                Security
              </a>

            </div>

          </div>

          {/* App */}

          <div>

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
              AETHERIS App
            </p>

            <div className="mt-5 space-y-3">

              <a
                href="/dashboard"
                className="block text-sm text-gray-400 transition hover:text-cyan-400"
              >
                Launch Dashboard
              </a>

              <a
                href="/docs#testnet"
                className="block text-sm text-gray-400 transition hover:text-cyan-400"
              >
                Sepolia Testnet
              </a>

              <a
                href="/docs#contracts"
                className="block text-sm text-gray-400 transition hover:text-cyan-400"
              >
                Smart Contracts
              </a>

              <a
                href={`https://sepolia.etherscan.io/address/${contracts.vault}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-gray-400 transition hover:text-cyan-400"
              >
                Vault Explorer
              </a>

              <a
                href={`https://sepolia.etherscan.io/address/${contracts.ausd}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-gray-400 transition hover:text-cyan-400"
              >
                AUSD Explorer
              </a>

            </div>

          </div>

        </div>

        {/* Contract addresses */}

        <div className="mt-12 rounded-2xl border border-slate-800 bg-slate-950/70 p-5">

          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
                Deployed Network
              </p>

              <p className="mt-1 text-sm font-semibold text-white">
                Ethereum Sepolia · AETHERIS V2
              </p>
            </div>

            <a
              href="https://sepolia.etherscan.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-cyan-400 transition hover:text-cyan-300"
            >
              Open Sepolia Explorer →
            </a>

          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">

            <ContractAddress
              name="Vault"
              address={contracts.vault}
            />

            <ContractAddress
              name="AUSD"
              address={contracts.ausd}
            />

            <ContractAddress
              name="AETR"
              address={contracts.aetr}
            />

            <ContractAddress
              name="Treasury"
              address={contracts.treasury}
            />

          </div>

        </div>

        {/* Disclaimer */}

        <div className="mt-8 rounded-2xl border border-yellow-500/20 bg-yellow-950/10 p-5">

          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-yellow-400">
            Testnet & Security Notice
          </p>

          <p className="mt-3 text-xs leading-6 text-gray-400">
            AETHERIS V2 is currently presented through its Ethereum
            Sepolia testnet deployment. Testnet assets have no intended
            production value. Smart-contract systems can contain
            vulnerabilities, and no protocol should be represented as
            absolutely immune to compromise. Users should independently
            verify contract addresses and transaction details before
            interacting with deployed contracts.
          </p>

        </div>

        {/* Bottom bar */}

        <div className="mt-8 flex flex-col gap-4 border-t border-slate-800 pt-6 text-xs text-gray-500 md:flex-row md:items-center md:justify-between">

          <p>
            © {currentYear} AETHERIS Protocol. All rights reserved.
          </p>

          <div className="flex flex-wrap gap-5">

            <a
              href="/docs"
              className="transition hover:text-cyan-400"
            >
              Documentation
            </a>

            <a
              href="/docs#security"
              className="transition hover:text-cyan-400"
            >
              Security
            </a>

            <a
              href="https://x.com/Aetheris_pro"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-cyan-400"
            >
              X
            </a>

            <a
              href="https://github.com/AEtheris-01/aetheris-protocol"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-cyan-400"
            >
              GitHub
            </a>

          </div>

        </div>

      </div>

    </footer>
  );
}

function ContractAddress({
  name,
  address,
}: {
  name: string;
  address: string;
}) {
  return (
    <a
      href={`https://sepolia.etherscan.io/address/${address}`}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 transition hover:border-cyan-500/30"
    >
      <p className="text-xs uppercase tracking-wider text-gray-500">
        {name}
      </p>

      <p className="mt-2 break-all font-mono text-xs text-gray-400">
        {address}
      </p>

      <p className="mt-2 text-xs font-semibold text-cyan-400">
        View on Etherscan →
      </p>
    </a>
  );
}
