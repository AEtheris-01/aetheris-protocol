import Link from "next/link";
import SadMonkeyPanel from "../components/SadMonkeyPanel";

export default function NFTPage() {
  return (
    <main className="min-h-screen bg-[#050816] text-white">

      {/* HEADER */}

      <header className="sticky top-0 z-40 border-b border-cyan-500/10 bg-[#050816]/90 backdrop-blur-xl">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 md:px-8">

          <Link
            href="/"
            className="flex items-center gap-3"
          >

            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-400/10 text-xl font-black text-cyan-400">
              A
            </div>

            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400">
                AETHERIS
              </p>

              <p className="text-lg font-black text-white">
                Sad Monkey
              </p>

            </div>

          </Link>

          <div className="flex items-center gap-3">

            <Link
              href="/airdrop"
              className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-gray-300 transition hover:border-cyan-500/30 hover:text-cyan-400"
            >
              Airdrop
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


      {/* CONTENT */}

      <div className="mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-14">

        <div className="mb-10 text-center">

          <p className="text-xs font-bold uppercase tracking-[0.35em] text-cyan-400">
            AETHERIS NFT COLLECTION
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-tight text-white md:text-6xl">
            Sad Monkey
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-400 md:text-base">
            Join the AETHERIS testnet community through the
            Sad Monkey NFT collection.
          </p>

        </div>

        <SadMonkeyPanel />

      </div>


      {/* FOOTER */}

      <footer className="border-t border-slate-800 px-5 py-8">

        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-gray-500 md:flex-row md:items-center md:justify-between">

          <p>
            AETHERIS Sad Monkey • Ethereum Sepolia
          </p>

          <div className="flex gap-5">

            <Link
              href="/dashboard"
              className="transition hover:text-cyan-400"
            >
              Dashboard
            </Link>

            <Link
              href="/airdrop"
              className="transition hover:text-cyan-400"
            >
              Airdrop
            </Link>

            <Link
              href="/"
              className="transition hover:text-cyan-400"
            >
              Home
            </Link>

          </div>

        </div>

      </footer>

    </main>
  );
}
