"use client";

import { MUSCLE_MAP, RecoveryState, getRecoveryColor, getRecoveryLabel, formatTimeSince, formatTimeRemaining } from "@/lib/muscles";

interface Props {
  muscleId: string;
  recovery: RecoveryState | null;
  onTrain: (muscleId: string) => void;
}

export default function MuscleInspector({ muscleId, recovery, onTrain }: Props) {
  const muscle = MUSCLE_MAP[muscleId];
  if (!muscle) return null;

  const status = recovery?.status || "not_trained";
  const percentage = recovery?.percentage ?? 100;
  const color = getRecoveryColor(status);
  const regionLabel = muscle.region.replace("_", " ");

  return (
    <div className="glass-card rounded-xl overflow-hidden animate-fade-in">
      <div className="h-0.5" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-white font-semibold text-[15px] tracking-tight">{muscle.name}</h3>
            <span className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded capitalize mt-1" style={{ backgroundColor: color + "12", color }}>
              <span className="w-1 h-1 rounded-full" style={{ backgroundColor: color }} />{regionLabel}
            </span>
          </div>
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-md glass-inset">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-[11px] font-semibold" style={{ color }}>{getRecoveryLabel(status)}</span>
          </div>
        </div>

        <p className="text-dark-500 text-[12px] leading-relaxed mb-1">{muscle.description}</p>
        <p className="text-dark-600 text-[11px] mb-3"><span className="text-dark-500 font-medium">Function:</span> {muscle.function}</p>

        <div className="mb-4">
          <div className="flex justify-between text-[11px] mb-1.5">
            <span className="text-dark-600 font-medium uppercase tracking-wider">Recovery</span>
            <span className="font-semibold tabular-nums" style={{ color }}>{percentage}%</span>
          </div>
          <div className="bar-track">
            <div className="bar-fill animate-bar-fill" style={{ width: `${percentage}%`, backgroundColor: color }} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          {[
            { label: "Last Trained", value: formatTimeSince(recovery?.hoursSinceTraining ?? null) },
            { label: "Time Left", value: status === "not_trained" ? "—" : formatTimeRemaining(recovery?.hoursRemaining ?? 0) },
            { label: "Weekly Sets", value: String(recovery?.effectiveSets ?? 0) },
            { label: "Last Session", value: recovery?.lastWorkoutName ?? "—" },
          ].map((s) => (
            <div key={s.label} className="glass-inset rounded-lg p-2.5">
              <div className="text-dark-600 text-[9px] uppercase tracking-wider font-medium">{s.label}</div>
              <div className="text-dark-200 text-[12px] font-semibold mt-0.5 truncate">{s.value}</div>
            </div>
          ))}
        </div>

        <div className="mb-4">
          <div className="text-dark-600 text-[10px] uppercase tracking-wider font-medium mb-1.5">Recommended Exercises</div>
          <div className="flex flex-wrap gap-1">
            {muscle.recommendedExercises.map((ex) => (
              <span key={ex} className="text-[10px] font-medium glass-inset text-dark-400 px-2 py-0.5 rounded-md">{ex}</span>
            ))}
          </div>
        </div>

        <button onClick={() => onTrain(muscleId)}
          className="w-full h-9 rounded-lg text-[12px] font-semibold text-white transition-all active:scale-[0.97] flex items-center justify-center gap-1.5"
          style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)`, boxShadow: `0 2px 8px -2px ${color}30` }}>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          Train {muscle.name}
        </button>
      </div>
    </div>
  );
}
