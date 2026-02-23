import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="space-y-12 max-w-4xl mx-auto">
      {/* Title */}
      <section className="text-center pt-8">
        <h1 className="text-3xl sm:text-4xl font-bold gradient-text mb-4">
          How ChainLens Works
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">
          An autonomous on-chain intelligence service that earns revenue through micropayments
        </p>
      </section>

      {/* Architecture Diagram */}
      <section className="card overflow-hidden">
        <div className="px-4 py-2.5 border-b border-[var(--border)] bg-[var(--bg-secondary)]">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
            </div>
            <span className="text-xs text-gray-500 font-mono">architecture.txt</span>
          </div>
        </div>
        <div className="p-6 overflow-x-auto">
          <pre className="text-[13px] font-mono text-gray-400 leading-relaxed whitespace-pre">{`
  ┌─────────────────────────────────────────────────────────────────┐
  │                        ChainLens                                │
  └─────────────────────────────────────────────────────────────────┘

  ┌──────────────────┐                    ┌──────────────────────┐
  │                  │   HTTP + x402      │                      │
  │   Next.js 14     │ ────────────────►  │   Skill Server       │
  │   Dashboard      │                    │   (PinionOS)         │
  │                  │ ◄────────────────  │                      │
  │  ┌────────────┐  │   JSON response    │  ┌────────────────┐  │
  │  │ Home       │  │                    │  │ /portfolio     │  │
  │  │ Explorer   │  │                    │  │ /risk          │  │
  │  │ About      │  │                    │  │ /gas           │  │
  │  └────────────┘  │                    │  │ /token         │  │
  │                  │                    │  │ /tx            │  │
  │  Port: 3000      │                    │  └────────────────┘  │
  └──────────────────┘                    │                      │
                                          │  Port: 4020          │
           ┌──────────────────┐           └──────────┬───────────┘
           │                  │                      │
           │   Facilitator    │ ◄── Verify payment ──┘
           │   payai.network  │                      │
           │                  │           ┌──────────┴───────────┐
           └──────────────────┘           │                      │
                                          │   Base L2 RPC        │
                    USDC settlement       │   mainnet.base.org   │
                    on Base ──────────►   │                      │
                                          │  ETH balances        │
                                          │  ERC-20 calls        │
                                          │  Gas prices          │
                                          │  Tx receipts         │
                                          └──────────────────────┘`}</pre>
        </div>
      </section>

      {/* x402 Protocol */}
      <section className="card p-6 sm:p-8">
        <h2 className="text-xl font-bold text-white mb-2">The x402 Payment Protocol</h2>
        <p className="text-sm text-gray-400 mb-6 leading-relaxed">
          x402 is a machine-to-machine payment protocol that uses HTTP status code 402 (Payment Required).
          It enables pay-per-call APIs without API keys, subscriptions, or accounts.
          Payments are USDC micropayments on Base, settled instantly via a facilitator.
        </p>

        <div className="space-y-3">
          {[
            {
              step: "1",
              from: "Client",
              arrow: "→",
              to: "Server",
              title: "GET /portfolio/0x...",
              desc: "Client sends an initial HTTP request to a paywalled skill endpoint",
              color: "text-blue-400",
              bg: "bg-blue-500/10",
            },
            {
              step: "2",
              from: "Server",
              arrow: "→",
              to: "Client",
              title: "402 Payment Required",
              desc: "Server responds with payment details: price ($0.01), asset (USDC), payTo address, network (Base)",
              color: "text-amber-400",
              bg: "bg-amber-500/10",
            },
            {
              step: "3",
              from: "Client",
              arrow: "",
              to: "",
              title: "Sign EIP-3009 Authorization",
              desc: "Client signs a USDC transferWithAuthorization off-chain — no gas required at this step",
              color: "text-[#a8eb5a]",
              bg: "bg-[#88CC10]/10",
            },
            {
              step: "4",
              from: "Client",
              arrow: "→",
              to: "Server",
              title: "GET /portfolio/0x... + X-PAYMENT header",
              desc: "Client retries the original request with the base64-encoded signed authorization",
              color: "text-[#88CC10]",
              bg: "bg-[#88CC10]/10",
            },
            {
              step: "5",
              from: "Server",
              arrow: "→",
              to: "Facilitator",
              title: "Verify & Settle Payment",
              desc: "Facilitator validates the signature and executes the USDC transfer on Base L2",
              color: "text-emerald-400",
              bg: "bg-emerald-500/10",
            },
            {
              step: "6",
              from: "Server",
              arrow: "→",
              to: "Client",
              title: "200 OK + JSON Data",
              desc: "Server returns the on-chain intelligence data — the entire flow takes under 2 seconds",
              color: "text-green-400",
              bg: "bg-green-500/10",
            },
          ].map((item) => (
            <div
              key={item.step}
              className={`flex gap-4 items-start p-3 rounded-lg ${item.bg} border border-transparent`}
            >
              <div
                className={`w-7 h-7 rounded-full bg-[var(--bg-primary)] flex items-center justify-center text-xs font-bold ${item.color} shrink-0 border border-[var(--border)]`}
              >
                {item.step}
              </div>
              <div className="min-w-0">
                <p className={`text-sm font-semibold font-mono ${item.color} break-all`}>
                  {item.title}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Architecture details */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="card p-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#88CC10] to-[#6fa00d] flex items-center justify-center text-sm font-bold text-black mb-4">
            S
          </div>
          <h3 className="text-base font-bold text-white mb-3">Skill Server</h3>
          <ul className="space-y-2.5">
            {[
              "TypeScript + Express framework",
              "PinionOS createSkillServer()",
              "x402 payment middleware",
              "5 paywalled skill endpoints",
              "Base L2 JSON-RPC integration",
              "Auto-generated /catalog endpoint",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-gray-400">
                <span className="text-[#88CC10] mt-0.5">&#x2022;</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="card p-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#a8eb5a] to-[#88CC10] flex items-center justify-center text-sm font-bold text-black mb-4">
            F
          </div>
          <h3 className="text-base font-bold text-white mb-3">Frontend Dashboard</h3>
          <ul className="space-y-2.5">
            {[
              "Next.js 14 + TypeScript",
              "TailwindCSS dark theme",
              "Interactive Skill Explorer",
              "x402 payment flow visualization",
              "Syntax-highlighted JSON viewer",
              "Responsive mobile-first design",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-gray-400">
                <span className="text-[#a8eb5a] mt-0.5">&#x2022;</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Tech Stack Table */}
      <section className="card p-6 sm:p-8">
        <h2 className="text-xl font-bold text-white mb-5">Tech Stack</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-0">
          {[
            { label: "Network", value: "Base L2 (Chain ID 8453)" },
            { label: "Settlement", value: "USDC on Base" },
            { label: "Payment Protocol", value: "x402 (EIP-3009)" },
            { label: "Infrastructure", value: "PinionOS SDK" },
            { label: "Server Framework", value: "Express + TypeScript" },
            { label: "Frontend", value: "Next.js 14 + Tailwind" },
            { label: "Default Price", value: "$0.01 USDC / call" },
            { label: "Facilitator", value: "facilitator.payai.network" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex justify-between py-3 border-b border-[var(--border)] last:border-0"
            >
              <span className="text-sm text-gray-500">{item.label}</span>
              <span className="text-sm text-white font-mono">{item.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="card p-8 sm:p-10 text-center bg-gradient-to-br from-[var(--bg-card)] to-[#88CC10]/5 border-[#88CC10]/10">
        <h2 className="text-xl font-bold text-white mb-3">Built on PinionOS</h2>
        <p className="text-gray-400 text-sm mb-6 max-w-lg mx-auto leading-relaxed">
          PinionOS provides the server framework for building paywalled skills and the client SDK
          for consuming them. ChainLens demonstrates the &ldquo;software that earns&rdquo; paradigm —
          autonomous services that generate revenue through micropayments.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <a
            href="https://github.com/chu2bard/pinion-os"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-[var(--border)] rounded-lg text-sm text-gray-300 hover:text-white hover:border-gray-500 transition-all"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            PinionOS on GitHub
          </a>
          <Link
            href="/explore"
            className="btn-primary inline-flex items-center gap-2"
          >
            Try the Explorer
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
