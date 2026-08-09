import ConnectWallet from "../components/ConnectWallet";
import VaultPanel from "../components/VaultPanel";

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-[#050816] text-white p-10">

      <div className="flex justify-between items-center mb-10">
        <h1 className="text-5xl font-bold text-cyan-400">
          AETHERIS Dashboard
        </h1>

        <ConnectWallet />
      </div>
      
      <VaultPanel />

      <div className="grid md:grid-cols-3 gap-6">

        <div className="rounded-2xl border border-cyan-500/20 p-6">
          <h2 className="text-2xl font-bold">Vault</h2>
          <p className="mt-3 text-gray-400">
            Deposit ETH or BTC-backed assets.
          </p>
        </div>

        <div className="rounded-2xl border border-cyan-500/20 p-6">
          <h2 className="text-2xl font-bold">Mint AUSD</h2>
          <p className="mt-3 text-gray-400">
            Mint decentralized stablecoin.
          </p>
        </div>

        <div className="rounded-2xl border border-cyan-500/20 p-6">
          <h2 className="text-2xl font-bold">Stake AETR</h2>
          <p className="mt-3 text-gray-400">
            Earn protocol rewards.
          </p>
        </div>

      </div>

    </main>
  );
}
