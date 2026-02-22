import Link from "next/link";
import type { SkillMeta } from "@/lib/pinion";

interface SkillCardProps {
  skill: SkillMeta;
  index: number;
}

export default function SkillCard({ skill, index }: SkillCardProps) {
  return (
    <div
      className="card card-hover gradient-border p-6 group"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Header row */}
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-11 h-11 rounded-xl bg-gradient-to-br ${skill.gradient} flex items-center justify-center text-sm font-bold shadow-lg`}
        >
          {skill.icon}
        </div>
        <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono">
          {skill.price}
        </span>
      </div>

      {/* Body */}
      <h3 className="text-base font-semibold text-white mb-1.5 group-hover:text-indigo-300 transition-colors capitalize">
        {skill.name}
      </h3>
      <p className="text-sm text-gray-400 mb-5 leading-relaxed line-clamp-2">{skill.description}</p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
        <code className="text-[11px] text-gray-500 font-mono tracking-wide">
          {skill.method} {skill.endpoint}
        </code>
        <Link
          href={`/explore?skill=${skill.name}`}
          className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors group/link"
        >
          Try it
          <svg
            className="w-3 h-3 transition-transform group-hover/link:translate-x-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
