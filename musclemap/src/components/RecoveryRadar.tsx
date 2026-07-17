"use client";

import { useState } from "react";
import { REGIONS, MUSCLE_MAP, RecoveryState, getRecoveryColor, getRecoveryLabel, formatTimeSince, formatTimeRemaining } from "@/lib/muscles";

interface Props {
  recovery: Record<string, RecoveryState>;
}

export default function RecoveryRadar({ recovery }: Props) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const toggleRegion = (id: string) => setCollapsed((p) => ({ ...p, [id]: !p[id] }));

  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-2.5 mb-1">
        <div className="w-7 h-7 rounded-lg bg-brand-500/10 flex items-center justify-center">
          <svg className="w-3.5 h-3.5 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728M9.172 14.828a4 4 0 010-5.656m5.656 0a4 4 0 010 5.656M12 12h.01" /></svg>
        </div>
        <div>
          <h3 className="text-white font-semibold text-[14px] tracking-tight">Recovery Radar</h3>
          <p className="text-dark-600 text-[10px]">Muscle group recovery status</p>
        </div>
      </div>

      {REGIONS.map((region) => {
        const regionMuscles = region.muscles.map((id) => ({ id, recovery: recovery[id], muscle: MUSCLE_MAP[id] })).sort((a, b) => (a.recovery?.percentage ?? 100) - (b.recovery?.percentage ?? 100));
        const recoveringCount = regionMuscles.filter((m) => m.recovery && m.recovery.status !== "fully_recovered" && m.recovery.status !== "not_trained").length;
        const avgPct = Math.round(regionMuscles.reduce((s, m) => s + (m.recovery?.percentage ?? 100), 0) / regionMuscles.length);
        const isCollapsed = collapsed[region.id] ?? false;

        return (
          <div key={region.id} className="glass-card rounded-xl overflow-hidden">
            <button onClick={() => toggleRegion(region.id)} className="w-full flex items-center justify-between p-3 hover:bg-white/[.015] transition-colors">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-md glass-inset flex items-center justify-center text-dark-400">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                </div>
                <div className="text-left">
                  <span className="text-[12px] font-semibold text-dark-200">{region.name}</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-dark-600 tabular-nums">{avgPct}% avg</span>
                    {recoveringCount > 0 && <span className="text-[9px] font-medium bg-amber-500/8 text-amber-400 px-1.5 py-0.5 rounded">{recoveringCount} healing</span>}
                  </div>
                </div>
              </div>
              <svg className={`w-3.5 h-3.5 text-dark-600 transition-transform duration-200 ${isCollapsed ? "" : "rotate-180"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>
            {!isCollapsed && (
              <div className="px-3 pb-3 space-y-1.5 border-t border-white/[.02] pt-2">
                {regionMuscles.map(({ id, recovery: rec, muscle }) => {
                  if (!muscle) return null;
                  const status = rec?.status || "not_trained";
                  const percentage = rec?.percentage ?? 100;
                  const color = getRecoveryColor(status);
                  return (
                    <div key={id} className="glass-inset rounded-lg p-2.5">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                          <span className="text-[12px] text-dark-300 font-medium">{muscle.name}</span>
                        </div>
                        <span className="text-[10px] font-semibold tabular-nums" style={{ color }}>{percentage}%</span>
                      </div>
                      <div className="bar-track !h-[4px] mb-1">
                        <div className="bar-fill animate-bar-fill" style={{ width: `${percentage}%`, backgroundColor: color }} />
                      </div>
                      <div className="flex justify-between text-[9px] text-dark-600">
                        <span>{formatTimeSince(rec?.hoursSinceTraining ?? null)}</span>
                        <span>{status === "not_trained" ? "—" : formatTimeRemaining(rec?.hoursRemaining ?? 0)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
