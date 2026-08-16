import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-5 py-5 md:px-8">

      {/* LOGO */}

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

          <p className="text-sm font-bold text-white">
            Protocol
          </p>

        </div>

      </Link>


      {/* DESKTOP NAVIGATION */}

      <div className="hidden items-center gap-7 text-sm font-semibold text-gray-300 lg:flex">

        <Link
          href="/dashboard"
          className="transition hover:text-cyan-400"
        >
          Vaults
        </Link>

        <Link
          href="/dashboard"
          className="transition hover:text-cyan-400"
        >
          AUSD
        </Link>

        <Link
          href="/dashboard"
          className="transition hover:text-cyan-400"
        >
          AETR
        </Link>

        <Link
          href="/nft"
          className="transition hover:text-cyan-400"
        >
          Sad Monkey
        </Link>

        <Link
          href="/airdrop"
          className="transition hover:text-cyan-400"
        >
          Airdrop
        </Link>

        <Link
          href="/docs"
          className="transition hover:text-cyan-400"
        >
          Docs
        </Link>

      </div>


      {/* LAUNCH APP */}

      <div className="flex items-center gap-3">

        <Link
          href="/airdrop"
          className="hidden rounded-xl border border-cyan-500/20 bg-cyan-500/5 px-4 py-2 text-sm font-semibold text-cyan-400 transition hover:border-cyan-400/40 hover:bg-cyan-500/10 sm:block"
        >
          Airdrop
        </Link>

        <Link
          href="/dashboard"
          className="rounded-xl bg-cyan-500 px-5 py-2.5 text-sm font-bold text-black transition hover:bg-cyan-400"
        >
          Launch App
        </Link>

      </div>

    </nav>
  );
}
