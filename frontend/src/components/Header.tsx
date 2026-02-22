"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { checkServerHealth } from "@/lib/pinion";

const NAV_ITEMS = [
  { href: "/", label: "Skills" },
  { href: "/explore", label: "Explorer" },
  { href: "/about", label: "About" },
];

export default function Header() {
  const pathname = usePathname();
  const [serverUp, setServerUp] = useState<boolean | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    checkServerHealth().then(setServerUp);
    const interval = setInterval(() => checkServerHealth().then(setServerUp), 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="border-b border-[var(--border)] bg-[var(--bg-primary)]/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold tracking-tight shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow">
              CL
            </div>
            <span className="text-lg font-semibold gradient-text hidden sm:block">ChainLens</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden sm:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  pathname === item.href
                    ? "bg-indigo-500/10 text-indigo-400 shadow-sm shadow-indigo-500/10"
                    : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Server status */}
            <div
              className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${
                serverUp === null
                  ? "bg-gray-500/10 border-gray-500/20 text-gray-500"
                  : serverUp
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                  : "bg-red-500/10 border-red-500/20 text-red-400"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  serverUp === null
                    ? "bg-gray-500"
                    : serverUp
                    ? "bg-emerald-400 animate-pulse"
                    : "bg-red-400"
                }`}
              />
              {serverUp === null ? "Checking..." : serverUp ? "Server Live" : "Server Offline"}
            </div>

            {/* Network badge */}
            <div className="px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium">
              Base L2
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="sm:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <nav className="sm:hidden pb-4 pt-2 border-t border-[var(--border)] mt-2 animate-fade-in">
            <div className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? "bg-indigo-500/10 text-indigo-400"
                      : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex items-center gap-2 px-4 pt-2 mt-2 border-t border-[var(--border)]">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    serverUp ? "bg-emerald-400 animate-pulse" : "bg-red-400"
                  }`}
                />
                <span className="text-xs text-gray-500">
                  {serverUp ? "Server Live — localhost:4020" : "Server Offline"}
                </span>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
