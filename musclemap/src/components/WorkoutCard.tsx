"use client";

import { MUSCLE_MAP, getRecoveryColor, getRecoveryStatus } from "@/lib/muscles";

interface Exercise { id: number; name: string; primaryMuscle: string; secondaryMuscles: string[]; sets: number; reps: number; weight: string | null; restTime: number | null; equipment: string | null; }
interface Workout { id: number; name: string; date: string; time: string | null; duration: number | null; notes: string | null; exercises: Exercise[]; }

interface Props { workout: Workout; isSelected: boolean; onSelect: () => void; onDelete: (id: number) => void; }

export default function WorkoutCard({ workout, isSelected, onSelect, onDelete }: Props) {
  const now = new Date();
  const workoutDate = new Date(workout.date + "T" + (workout.time || "12:00:00"));
  const hoursSince = (now.getTime() - workoutDate.getTime()) / (1000 * 60 * 60);
  const status = getRecoveryStatus(hoursSince);
  const statusColor = getRecoveryColor(status);

  const muscleScores: Record<string, { primary: number; secondary: number }> = {};
  const regionSets: Record<string, number> = { upper_push: 0, upper_pull: 0, lower_body: 0, core: 0 };

  for (const ex of workout.exercises) {
    const pm = ex.primaryMuscle;
    if (!muscleScores[pm]) muscleScores[pm] = { primary: 0, secondary: 0 };
    muscleScores[pm].primary += ex.sets;
    const region = MUSCLE_MAP[pm]?.region;
    if (region) regionSets[region] += ex.sets;
    for (const sm of ex.secondaryMuscles) {
      if (!muscleScores[sm]) muscleScores[sm] = { primary: 0, secondary: 0 };
      muscleScores[sm].secondary += Math.ceil(ex.sets * 0.5);
      const sr = MUSCLE_MAP[sm]?.region;
      if (sr) regionSets[sr] += Math.ceil(ex.sets * 0.5);
    }
  }

  const topMuscles = Object.entries(muscleScores).map(([id, s]) => ({ id, name: MUSCLE_MAP[id]?.name || id, total: s.primary + s.secondary, primary: s.primary, secondary: s.secondary })).sort((a, b) => b.total - a.total).slice(0, 4);
  const maxScore = topMuscles[0]?.total || 1;
  const totalRegion = Object.values(regionSets).reduce((a, b) => a + b, 0) || 1;
  const dateStr = new Date(workout.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  const totalSets = workout.exercises.reduce((s, e) => s + e.sets, 0);

  const RC: Record<string, { bg: string; text: string }> = { upper_push: { bg: "bg-blue-500/8", text: "text-blue-400" }, upper_pull: { bg: "bg-emerald-500/8", text: "text-emerald-400" }, lower_body: { bg: "bg-purple-500/8", text: "text-purple-400" }, core: { bg: "bg-amber-500/8", text: "text-amber-400" } };

  return (
    <div className={`glass-card rounded-xl overflow-hidden glass-card-hover cursor-pointer transition-all ${isSelected ? "!border-brand-500/30 ring-1 ring-brand-500/15" : ""}`} onClick={onSelect}>
      <div className="h-px" style={{ background: `linear-gradient(90deg, ${statusColor}60, transparent)` }} />
      <div className="p-3">
        <div className="flex items-start justify-between mb-2">
          <div className="min-w-0 flex-1">
            <h4 className="text-white font-semibold text-[13px] tracking-tight truncate">{workout.name}</h4>
            <div className="flex items-center gap-1 mt-0.5 text-[10px] text-dark-600">
              <span>{dateStr}</span>
              {workout.time && <span>· {workout.time.slice(0, 5)}</span>}
              {workout.duration && <span>· {workout.duration}m</span>}
              <span>· {totalSets} sets</span>
            </div>
          </div>
          <button onClick={(e) => { e.stopPropagation(); onDelete(workout.id); }} className="text-dark-700 hover:text-red-400 transition-colors p-1 rounded hover:bg-red-500/5" title="Delete">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </button>
        </div>

        <div className="flex flex-wrap gap-0.5 mb-2.5">
          {workout.exercises.map((ex) => (
            <span key={ex.id} className="text-[9px] font-medium px-1.5 py-px rounded" style={{ backgroundColor: statusColor + "0c", color: statusColor }}>
              {ex.name} <span className="opacity-50">{ex.sets}×{ex.reps}</span>
            </span>
          ))}
        </div>

        <div className="glass-inset rounded-lg p-2.5">
          <div className="text-[9px] text-dark-600 uppercase tracking-wider font-medium mb-1.5">Target Analysis</div>
          <div className="space-y-1">
            {topMuscles.map((m) => {
              const totalAll = Object.values(muscleScores).reduce((a, b) => a + b.primary + b.secondary, 0) || 1;
              const pct = Math.round((m.total / totalAll) * 100);
              return (
                <div key={m.id} className="flex items-center gap-1.5">
                  <span className="text-[10px] text-dark-400 w-[65px] truncate font-medium">{m.name}</span>
                  <div className="flex-1 bar-track !h-[3px]">
                    <div className="h-full rounded-full flex overflow-hidden">
                      <div className="h-full bg-brand-500" style={{ width: `${(m.primary / maxScore) * 100}%` }} />
                      <div className="h-full bg-brand-400/40" style={{ width: `${(m.secondary / maxScore) * 100}%` }} />
                    </div>
                  </div>
                  <span className="text-[9px] text-dark-600 w-6 text-right tabular-nums">{pct}%</span>
                </div>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t border-white/[.02]">
            {[{ id: "upper_push", label: "Push" }, { id: "upper_pull", label: "Pull" }, { id: "lower_body", label: "Legs" }, { id: "core", label: "Core" }].map((r) => {
              const pct = Math.round((regionSets[r.id] / totalRegion) * 100);
              if (pct === 0) return null;
              const c = RC[r.id];
              return <span key={r.id} className={`text-[9px] font-medium px-1.5 py-px rounded ${c.bg} ${c.text}`}>{r.label} {pct}%</span>;
            })}
          </div>
        </div>
        {workout.notes && <p className="text-dark-600 text-[10px] mt-2 italic truncate">{workout.notes}</p>}
      </div>
    </div>
  );
}
