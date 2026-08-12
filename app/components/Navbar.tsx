import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-5">
      <Link
        href="/"
        className="text-2xl font-bold text-cyan-400"
      >
        AETHERIS
      </Link>

      <div className="hidden gap-8 text-gray-300 md:flex">
        <Link href="/dashboard" className="hover:text-cyan-400">
          Vaults
        </Link>

        <Link href="/dashboard" className="hover:text-cyan-400">
          AUSD
        </Link>

        <Link href="/dashboard" className="hover:text-cyan-400">
          AETR
        </Link>

        <a href="#" className="hover:text-cyan-400">
          Docs
        </a>
      </div>

      <Link
        href="/dashboard"
        className="rounded-xl bg-cyan-500 px-5 py-2 font-semibold text-black hover:bg-cyan-400"
      >
        Launch App
      </Link>
    </nav>
  );
}
