import Link from "next/link";

export default function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20 text-center">
      <h1 className="text-5xl font-bold">
        The Future of{" "}
        <span className="text-cyan-400">
          Decentralized Reserve Finance
        </span>
      </h1>

      <p className="mt-8 max-w-3xl mx-auto text-lg text-gray-300">
        AETHERIS enables users to deposit BTC, ETH, and liquid staking assets
        into secure vaults, mint AUSD, stake AETR, and participate in a
        next-generation decentralized financial ecosystem.
      </p>

      <div className="mt-10 flex flex-wrap justify-center gap-6">
        <Link
          href="/dashboard"
          className="rounded-xl bg-cyan-500 px-8 py-4 text-black font-semibold hover:bg-cyan-400"
        >
          Launch Protocol
        </Link>

        <button className="rounded-xl border border-cyan-400 px-8 py-4 text-cyan-400 hover:bg-cyan-400 hover:text-black">
          Read Whitepaper
        </button>
      </div>
    </section>
  );
}
