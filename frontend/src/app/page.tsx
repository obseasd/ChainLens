"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SkillCard from "@/components/SkillCard";
import { CHAINLENS_SKILLS, checkServerHealth } from "@/lib/pinion";

export default function Home() {
  const [serverUp, setServerUp] = useState<boolean | null>(null);

  useEffect(() => {
    checkServerHealth().then(setServerUp);
  }, []);

  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="text-center pt-12 pb-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          Powered by PinionOS + x402 Protocol
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-5 leading-tight">
          <span className="gradient-text">On-Chain Intelligence</span>
          <br />
          <span className="text-white">as a Service</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed mb-8">
          Real-time blockchain analytics as x402-paywalled microservices on Base.
          Pay per query with USDC micropayments — no API keys, no subscriptions.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/explore" className="btn-primary text-base px-8 py-3.5">
            Try the Explorer
          </Link>
          <Link
            href="/about"
            className="px-8 py-3.5 rounded-lg border border-[var(--border)] text-gray-300 hover:text-white hover:border-gray-500 text-sm font-medium transition-all"
          >
            How It Works
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { value: "5", label: "Skills", sub: "x402-paywalled" },
          { value: "$0.01", label: "Per Query", sub: "USDC micropayment" },
          { value: "Base L2", label: "Network", sub: "Chain ID 8453" },
          {
            value: serverUp === null ? "..." : serverUp ? "Live" : "Offline",
            label: "Server",
            sub: "localhost:4020",
          },
        ].map((stat) => (
          <div key={stat.label} className="card p-5 text-center">
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
            <p className="text-xs text-gray-600 mt-0.5">{stat.sub}</p>
          </div>
        ))}
      </section>

      {/* Skills Grid */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Available Skills</h2>
            <p className="text-sm text-gray-500 mt-1">Each skill is an x402-paywalled endpoint on Base</p>
          </div>
          <Link
            href="/explore"
            className="text-sm text-indigo-400 hover:text-indigo-300 font-medium transition-colors hidden sm:block"
          >
            Open Explorer →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CHAINLENS_SKILLS.map((skill, i) => (
            <SkillCard key={skill.name} skill={skill} index={i} />
          ))}
        </div>
      </section>

      {/* How it works — condensed */}
      <section className="card p-8 sm:p-10">
        <h2 className="text-xl font-bold text-white mb-2 text-center">How It Works</h2>
        <p className="text-sm text-gray-500 text-center mb-8">
          x402 enables machine-to-machine micropayments over HTTP
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            {
              step: "1",
              title: "Browse",
              desc: "Explore the skill catalog and pick an endpoint",
              gradient: "from-indigo-500 to-blue-600",
            },
            {
              step: "2",
              title: "Request",
              desc: "Send an HTTP request to the skill server",
              gradient: "from-purple-500 to-pink-600",
            },
            {
              step: "3",
              title: "Pay",
              desc: "Sign a USDC micropayment via EIP-3009",
              gradient: "from-amber-500 to-orange-600",
            },
            {
              step: "4",
              title: "Receive",
              desc: "Get real-time on-chain data instantly",
              gradient: "from-emerald-500 to-teal-600",
            },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div
                className={`w-11 h-11 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-sm font-bold mx-auto mb-3 shadow-lg`}
              >
                {item.step}
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">{item.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center pb-8">
        <p className="text-gray-500 text-sm mb-4">
          Built for the PinionOS Hackathon — demonstrating &quot;software that earns&quot;
        </p>
        <Link href="/explore" className="btn-primary inline-flex items-center gap-2 px-8 py-3">
          Start Querying
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </section>
    </div>
  );
}
