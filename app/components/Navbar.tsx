export default function Navbar() {
  return (
    <nav className="flex items-center justify-between border-b border-white/10 px-10 py-6">
      <h1 className="text-3xl font-bold tracking-widest text-cyan-400">
        AETHERIS
      </h1>

      <div className="hidden gap-8 text-gray-300 md:flex">
        <a href="#" className="hover:text-cyan-400">
          Vaults
        </a>
        <a href="#" className="hover:text-cyan-400">
          AUSD
        </a>
        <a href="#" className="hover:text-cyan-400">
          AETR
        </a>
        <a href="#" className="hover:text-cyan-400">
          Docs
        </a>
      </div>

      <button className="rounded-xl bg-cyan-500 px-5 py-2 font-semibold text-black hover:bg-cyan-400">
        Launch App
      </button>
    </nav>
  );
}