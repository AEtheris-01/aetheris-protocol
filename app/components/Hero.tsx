export default function Hero() {
  return (
    <section className="mx-auto flex max-w-7xl flex-col items-center px-8 py-24 text-center">
      <h1 className="text-5xl font-extrabold md:text-7xl">
        The Future of
        <br />
        <span className="text-cyan-400">
          Decentralized Reserve Finance
        </span>
      </h1>

      <p className="mt-8 max-w-3xl text-lg text-gray-300">
        AETHERIS enables users to deposit BTC, ETH, and liquid staking assets
        into secure vaults, mint AUSD, stake AETR, and participate in a
        next-generation decentralized financial ecosystem.
      </p>

      <div className="mt-10 flex flex-wrap justify-center gap-6">
        <button className="rounded-xl bg-cyan-500 px-8 py-4 text-black font-semibold hover:bg-cyan-400">
          Launch Protocol
        </button>

        <button className="rounded-xl border border-cyan-400 px-8 py-4 text-cyan-400 hover:bg-cyan-400 hover:text-black">
          Read Whitepaper
        </button>
      </div>
    </section>
  );
}