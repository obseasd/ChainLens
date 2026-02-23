"use client";

import { useState } from "react";
import { callSkill, CHAINLENS_SKILLS } from "@/lib/pinion";
import JsonViewer from "./JsonViewer";

export default function SkillCaller({ initialSkill }: { initialSkill?: string }) {
  const [selected, setSelected] = useState(() => {
    const idx = CHAINLENS_SKILLS.findIndex((s) => s.name === initialSkill);
    return idx >= 0 ? idx : 0;
  });
  const [param, setParam] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [duration, setDuration] = useState(0);
  const [step, setStep] = useState(0);

  const skill = CHAINLENS_SKILLS[selected];

  async function handleCall() {
    setError("");
    setResult(null);
    setStep(1);
    setLoading(true);

    const value = param || skill.placeholder;
    const endpoint = skill.paramName
      ? skill.endpoint.replace(`:${skill.paramName}`, value)
      : skill.endpoint;

    // Animate x402 flow
    await new Promise((r) => setTimeout(r, 350));
    setStep(2);
    await new Promise((r) => setTimeout(r, 250));
    setStep(3);

    try {
      const res = await callSkill(endpoint);
      setStep(4);
      setResult(res.data);
      setDuration(res.duration);
    } catch (e: any) {
      setError(e.message || "Request failed — is the server running?");
      setStep(0);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !loading) handleCall();
  }

  const flowSteps = [
    { label: "Request", desc: `GET ${skill.endpoint}`, icon: "1" },
    { label: "402 Payment", desc: `Payment required — ${skill.price} USDC`, icon: "2" },
    { label: "Sign & Pay", desc: "EIP-3009 USDC authorization", icon: "3" },
    { label: "Response", desc: `200 OK — ${duration}ms`, icon: "4" },
  ];

  return (
    <div className="space-y-6">
      {/* Skill Selector */}
      <div className="card p-5">
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
          Select Skill
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {CHAINLENS_SKILLS.map((s, i) => (
            <button
              key={s.name}
              onClick={() => {
                setSelected(i);
                setResult(null);
                setStep(0);
                setParam("");
                setError("");
              }}
              className={`p-3 rounded-xl border text-center transition-all ${
                selected === i
                  ? "border-[#88CC10]/50 bg-[#88CC10]/10 text-white glow-sm"
                  : "border-[var(--border)] bg-[var(--bg-secondary)] text-gray-400 hover:border-gray-600 hover:text-gray-300"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg bg-gradient-to-br ${s.gradient} flex items-center justify-center text-xs font-bold mx-auto mb-2`}
              >
                {s.icon}
              </div>
              <div className="text-xs font-medium capitalize">{s.name}</div>
              <div className="text-[10px] text-gray-600 mt-0.5">{s.price}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Input + Call */}
      <div className="card p-5">
        <div className="flex flex-col sm:flex-row gap-3">
          {skill.paramName ? (
            <>
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                  {skill.paramLabel}
                </label>
                <input
                  type="text"
                  value={param}
                  onChange={(e) => setParam(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={skill.placeholder}
                  className="input-field w-full"
                />
              </div>
              <div className="flex items-end">
                <button onClick={handleCall} disabled={loading} className="btn-primary w-full sm:w-auto whitespace-nowrap">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Calling...
                    </span>
                  ) : (
                    "Call Skill"
                  )}
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-between w-full">
              <div>
                <p className="text-sm text-gray-300">No parameters needed</p>
                <p className="text-xs text-gray-600 mt-0.5 font-mono">
                  {skill.method} {skill.endpoint}
                </p>
              </div>
              <button onClick={handleCall} disabled={loading} className="btn-primary">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Calling...
                  </span>
                ) : (
                  "Call Skill"
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* x402 Flow Visualization */}
      {step > 0 && (
        <div className="card p-5 animate-fade-in">
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-4">
            x402 Payment Flow
          </label>
          <div className="grid grid-cols-4 gap-3">
            {flowSteps.map((s, i) => {
              const active = i + 1 === step && loading;
              const done = i + 1 <= step;
              return (
                <div key={i} className="text-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold mx-auto mb-2 transition-all duration-500 ${
                      done
                        ? "bg-gradient-to-br from-[#6fa00d] to-[#88CC10] text-black shadow-lg shadow-[#88CC10]/30"
                        : active
                        ? "bg-[#88CC10]/20 text-[#88CC10] animate-pulse border border-[#88CC10]/30"
                        : "bg-[var(--bg-secondary)] text-gray-600 border border-[var(--border)]"
                    }`}
                  >
                    {done && !active ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      s.icon
                    )}
                  </div>
                  <p className={`text-xs font-medium ${done ? "text-[#88CC10]" : "text-gray-600"}`}>
                    {s.label}
                  </p>
                  {done && (
                    <p className="text-[10px] text-gray-600 mt-0.5 animate-fade-in truncate">{s.desc}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="card p-4 border-red-500/20 bg-red-500/5 animate-fade-in">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
              <svg className="w-3 h-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-red-400 font-medium">Request Failed</p>
              <p className="text-xs text-red-400/70 mt-0.5">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="animate-fade-in-up">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-sm font-medium text-gray-300">Response</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-600">
              <span className="font-mono">{duration}ms</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-medium">
                200 OK
              </span>
            </div>
          </div>
          <JsonViewer data={result} />
        </div>
      )}
    </div>
  );
}
