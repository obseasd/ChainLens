"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import SkillCaller from "@/components/SkillCaller";

function ExploreContent() {
  const searchParams = useSearchParams();
  const initialSkill = searchParams.get("skill") || undefined;

  return (
    <div className="space-y-8">
      {/* Header */}
      <section>
        <h1 className="text-3xl font-bold text-white mb-2">Skill Explorer</h1>
        <p className="text-gray-400 max-w-2xl">
          Call any ChainLens skill interactively. Select a skill, enter parameters,
          and watch the x402 payment flow in action. Each query costs $0.01 USDC on Base.
        </p>
      </section>

      {/* Tips */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: "Tip", text: "Press Enter to quickly submit your query" },
          { label: "Demo", text: "Leave fields empty to use example values" },
          { label: "Free Mode", text: "No payment required in local dev" },
        ].map((tip) => (
          <div key={tip.label} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded">
              {tip.label}
            </span>
            <span className="text-xs text-gray-500">{tip.text}</span>
          </div>
        ))}
      </div>

      {/* Main caller */}
      <SkillCaller initialSkill={initialSkill} />
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="space-y-8">
      <div>
        <div className="h-8 w-48 animate-shimmer rounded-lg mb-3" />
        <div className="h-5 w-96 animate-shimmer rounded-lg" />
      </div>
      <div className="card p-6">
        <div className="h-5 w-24 animate-shimmer rounded mb-4" />
        <div className="grid grid-cols-5 gap-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 animate-shimmer rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ExploreContent />
    </Suspense>
  );
}
