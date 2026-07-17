"use client";

import { useEffect, useRef } from "react";
import { MUSCLE_MAP, RecoveryState, getRecoveryColor, getRecoveryLabel, formatTimeSince, formatTimeRemaining } from "@/lib/muscles";

interface Props {
  muscleId: string;
  recovery: RecoveryState | null;
  onTrain: (muscleId: string) => void;
}

export default function MuscleInspector({ muscleId, recovery, onTrain }: Props) {
  const muscle = MUSCLE_MAP[muscleId];
  const ref = useRef<HTMLDivElement>(null);

  // Auto-scroll into view when muscle is selected
  useEffect(() => {
    if (ref.current) {
      setTimeout(() => {
        ref.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 100);
    }
  }, [muscleId]);

  if (!muscle) return null;

  const status = recovery?.status || "not_trained";
  const percentage = recovery?.percentage ?? 100;
  const color = getRecoveryColor(status);
  const regionLabel = muscle.region.replace("_", " ");

  return (
    <div ref={ref} className="glass-card rounded-lg lg:rounded-xl overflow-hidden animate-fade-in">
      <div className="h-0.5" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
      <div className="p-3 lg:p-4">
        {/* Header — compact */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <h3 className="text-white font-semibold text-[13px] lg:text-[15px] tracking-tight truncate">{muscle.name}</h3>
            <span className="shrink-0 inline-flex items-center gap-0.5 text-[8px] lg:text-[10px] font-medium px-1.5 py-0.5 rounded capitalize" style={{ backgroundColor: color + "12", color }}>
              <span className="w-1 h-1 rounded-full" style={{ backgroundColor: color }} />{regionLabel}
            </span>
          </div>
          <span className="shrink-0 text-[10px] lg:text-[11px] font-semibold" style={{ color }}>{getRecoveryLabel(status)}</span>
        </div>

        {/* Description — shorter on mobile */}
        <p className="text-dark-500 text-[11px] leading-relaxed mb-2 line-clamp-2">{muscle.description}</p>

        {/* Recovery bar */}
        <div className="mb-3">
          <div className="flex justify-between text-[10px] mb-1">
            <span className="text-dark-600 font-medium">Recovery</span>
            <span className="font-semibold tabular-nums" style={{ color }}>{percentage}%</span>
          </div>
          <div className="bar-track">
            <div className="bar-fill animate-bar-fill" style={{ width: `${percentage}%`, backgroundColor: color }} />
          </div>
        </div>

        {/* Stats — 4 in a row on mobile */}
        <div className="grid grid-cols-4 gap-1 lg:grid-cols-2 lg:gap-2 mb-3">
          {[
            { label: "Trained", value: formatTimeSince(recovery?.hoursSinceTraining ?? null) },
            { label: "Left", value: status === "not_trained" ? "—" : formatTimeRemaining(recovery?.hoursRemaining ?? 0) },
            { label: "Sets/wk", value: String(recovery?.effectiveSets ?? 0) },
            { label: "Session", value: recovery?.lastWorkoutName ?? "—" },
          ].map((s) => (
            <div key={s.label} className="glass-inset rounded p-1.5 lg:p-2.5">
              <div className="text-dark-600 text-[7px] lg:text-[9px] uppercase tracking-wider font-medium">{s.label}</div>
              <div className="text-dark-200 text-[10px] lg:text-[12px] font-semibold mt-px truncate">{s.value}</div>
            </div>
          ))}
        </div>

        {/* Recommended — horizontal scroll */}
        <div className="mb-3">
          <div className="text-dark-600 text-[9px] uppercase tracking-wider font-medium mb-1">Recommended</div>
          <div className="flex gap-1 overflow-x-auto no-scrollbar">
            {muscle.recommendedExercises.map((ex) => (
              <span key={ex} className="shrink-0 text-[9px] font-medium glass-inset text-dark-400 px-2 py-0.5 rounded">{ex}</span>
            ))}
          </div>
        </div>

        {/* Train button — always visible, big touch target */}
        <button onClick={() => onTrain(muscleId)}
          className="w-full h-10 lg:h-9 rounded-lg text-[12px] font-semibold text-white transition-all active:scale-[0.97] flex items-center justify-center gap-1.5"
          style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)`, boxShadow: `0 2px 8px -2px ${color}30` }}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          Train {muscle.name}
        </button>
      </div>
    </div>
  );
}
