"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";

export default function Header() {
  const { isLoggedIn } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-dark-900/95 backdrop-blur border-b border-dark-600">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-light-100">
          <span className="text-primary">Tokyo</span> Table Finder
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/search" className="text-light-200 hover:text-light-100 transition-colors">Search</Link>
          <Link href="/messages" className="text-light-200 hover:text-light-100 transition-colors">Messages</Link>
          <Link href="/pricing" className="text-light-200 hover:text-light-100 transition-colors">Pricing</Link>
          {isLoggedIn ? (
            <Link href="/account" className="text-light-200 hover:text-light-100 transition-colors">Account</Link>
          ) : (
            <Link href="/login" className="bg-primary hover:bg-primary-hover text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors">Login</Link>
          )}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-light-200 p-1"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {menuOpen ? (
              <>
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="6" y1="18" x2="18" y2="6" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="md:hidden bg-dark-800 border-b border-dark-600 px-4 py-3 flex flex-col gap-3 text-sm">
          <Link href="/search" onClick={() => setMenuOpen(false)} className="text-light-200 hover:text-light-100 py-1">Search</Link>
          <Link href="/messages" onClick={() => setMenuOpen(false)} className="text-light-200 hover:text-light-100 py-1">Messages</Link>
          <Link href="/pricing" onClick={() => setMenuOpen(false)} className="text-light-200 hover:text-light-100 py-1">Pricing</Link>
          {isLoggedIn ? (
            <Link href="/account" onClick={() => setMenuOpen(false)} className="text-light-200 hover:text-light-100 py-1">Account</Link>
          ) : (
            <Link href="/login" onClick={() => setMenuOpen(false)} className="text-light-200 hover:text-light-100 py-1">Login</Link>
          )}
        </nav>
      )}
    </header>
  );
}
