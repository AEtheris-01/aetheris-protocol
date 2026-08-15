"use client";

import { useState } from "react";
import ConnectWallet from "./ConnectWallet";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-cyan-500/10 bg-[#050816]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">

        {/* Brand */}

        <a
          href="/"
          className="flex items-center gap-3"
          onClick={() => setMobileOpen(false)}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-400/10">
            <span className="text-lg font-black text-cyan-400">
              A
            </span>
          </div>

          <div>
            <p className="text-lg font-black tracking-wide text-white">
              AETHERIS
            </p>

            <p className="hidden text-[9px] uppercase tracking-[0.25em] text-gray-500 sm:block">
              Decentralized Monetary Protocol
            </p>
          </div>
        </a>

        {/* Desktop Navigation */}

        <nav className="hidden items-center gap-7 md:flex">

          <a
            href="/"
            className="text-sm font-medium text-gray-400 transition hover:text-cyan-400"
          >
            Home
          </a>

          <a
            href="/#protocol"
            className="text-sm font-medium text-gray-400 transition hover:text-cyan-400"
          >
            Protocol
          </a>

          <a
            href="/#tokenomics"
            className="text-sm font-medium text-gray-400 transition hover:text-cyan-400"
          >
            Tokenomics
          </a>

          <a
            href="/docs"
            className="text-sm font-medium text-gray-400 transition hover:text-cyan-400"
          >
            Docs
          </a>

          <a
            href="/docs#testnet"
            className="text-sm font-medium text-gray-400 transition hover:text-cyan-400"
          >
            Testnet
          </a>

        </nav>

        {/* Desktop Actions */}

        <div className="hidden items-center gap-3 md:flex">

          <a
            href="https://github.com/AEtheris-01/aetheris-protocol"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="AETHERIS GitHub"
            className="rounded-xl border border-slate-700 px-3 py-2 text-sm text-gray-400 transition hover:border-cyan-500/30 hover:text-cyan-400"
          >
            GitHub
          </a>

          <a
            href="/dashboard"
            className="rounded-xl bg-cyan-500 px-4 py-2 text-sm font-bold text-black transition hover:bg-cyan-400"
          >
            Launch App
          </a>

          <ConnectWallet />

        </div>

        {/* Mobile Menu Button */}

        <button
          type="button"
          aria-label="Toggle navigation menu"
          onClick={() => setMobileOpen((value) => !value)}
          className="rounded-xl border border-slate-700 px-3 py-2 text-sm text-gray-300 md:hidden"
        >
          {mobileOpen ? "Close" : "Menu"}
        </button>

      </div>

      {/* Mobile Navigation */}

      {mobileOpen && (
        <div className="border-t border-slate-800 bg-[#070b1f] px-5 py-5 md:hidden">

          <nav className="space-y-1">

            <a
              href="/"
              onClick={() => setMobileOpen(false)}
              className="block rounded-xl px-4 py-3 text-sm text-gray-300 transition hover:bg-cyan-500/10 hover:text-cyan-400"
            >
              Home
            </a>

            <a
              href="/#protocol"
              onClick={() => setMobileOpen(false)}
              className="block rounded-xl px-4 py-3 text-sm text-gray-300 transition hover:bg-cyan-500/10 hover:text-cyan-400"
            >
              Protocol
            </a>

            <a
              href="/#tokenomics"
              onClick={() => setMobileOpen(false)}
              className="block rounded-xl px-4 py-3 text-sm text-gray-300 transition hover:bg-cyan-500/10 hover:text-cyan-400"
            >
              Tokenomics
            </a>

            <a
              href="/docs"
              onClick={() => setMobileOpen(false)}
              className="block rounded-xl px-4 py-3 text-sm text-gray-300 transition hover:bg-cyan-500/10 hover:text-cyan-400"
            >
              Documentation
            </a>

            <a
              href="/docs#testnet"
              onClick={() => setMobileOpen(false)}
              className="block rounded-xl px-4 py-3 text-sm text-gray-300 transition hover:bg-cyan-500/10 hover:text-cyan-400"
            >
              Testnet
            </a>

            <a
              href="https://github.com/AEtheris-01/aetheris-protocol"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileOpen(false)}
              className="block rounded-xl px-4 py-3 text-sm text-gray-300 transition hover:bg-cyan-500/10 hover:text-cyan-400"
            >
              GitHub
            </a>

          </nav>

          <div className="mt-5 border-t border-slate-800 pt-5">

            <a
              href="/dashboard"
              onClick={() => setMobileOpen(false)}
              className="block rounded-xl bg-cyan-500 px-4 py-3 text-center text-sm font-bold text-black transition hover:bg-cyan-400"
            >
              Launch AETHERIS App
            </a>

          </div>

        </div>
      )}

    </header>
  );
}
