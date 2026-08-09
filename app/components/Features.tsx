export default function Features() {
  return (
    <section className="mx-auto max-w-7xl px-8 pb-24">
      <h2 className="mb-14 text-center text-5xl font-bold">
        Why Choose <span className="text-cyan-400">AETHERIS?</span>
      </h2>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">

        <div className="rounded-3xl border border-cyan-500/20 p-8">
          <div className="mb-4 text-5xl">💎</div>
          <h3 className="mb-4 text-2xl font-bold">Multi-Asset Vaults</h3>
          <p className="text-gray-300">
            Deposit BTC, ETH and liquid staking assets into secure decentralized vaults.
          </p>
        </div>

        <div className="rounded-3xl border border-cyan-500/20 p-8">
          <div className="mb-4 text-5xl">💵</div>
          <h3 className="mb-4 text-2xl font-bold">AUSD Stablecoin</h3>
          <p className="text-gray-300">
            Mint a decentralized stablecoin backed by diversified crypto collateral.
          </p>
        </div>

        <div className="rounded-3xl border border-cyan-500/20 p-8">
          <div className="mb-4 text-5xl">⚡</div>
          <h3 className="mb-4 text-2xl font-bold">AETR Governance</h3>
          <p className="text-gray-300">
            Stake AETR to earn rewards and participate in protocol governance.
          </p>
        </div>

        <div className="rounded-3xl border border-cyan-500/20 p-8">
          <div className="mb-4 text-5xl">🛡️</div>
          <h3 className="mb-4 text-2xl font-bold">Institutional Security</h3>
          <p className="text-gray-300">
            Transparent smart contracts, decentralized governance and secure reserve management.
          </p>
        </div>

      </div>
    </section>
  );
}