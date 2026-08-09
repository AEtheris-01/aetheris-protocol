export default function Stats() {
  return (
    <section className="mx-auto max-w-7xl px-8 pb-20">
      <div className="grid gap-6 md:grid-cols-4">

        <div className="rounded-2xl border border-cyan-500/20 p-6 text-center">
          <h2 className="text-4xl font-bold text-cyan-400">$2.45B</h2>
          <p className="mt-3 text-gray-300">Total Value Locked</p>
        </div>

        <div className="rounded-2xl border border-cyan-500/20 p-6 text-center">
          <h2 className="text-4xl font-bold text-cyan-400">$870M</h2>
          <p className="mt-3 text-gray-300">AUSD Minted</p>
        </div>

        <div className="rounded-2xl border border-cyan-500/20 p-6 text-center">
          <h2 className="text-4xl font-bold text-cyan-400">1.2M+</h2>
          <p className="mt-3 text-gray-300">Transactions</p>
        </div>

        <div className="rounded-2xl border border-cyan-500/20 p-6 text-center">
          <h2 className="text-4xl font-bold text-cyan-400">99.99%</h2>
          <p className="mt-3 text-gray-300">Protocol Uptime</p>
        </div>

      </div>
    </section>
  );
}