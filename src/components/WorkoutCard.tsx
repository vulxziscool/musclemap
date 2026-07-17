"use client";

import { MUSCLE_MAP, getRecoveryColor, getRecoveryStatus, getRecoveryLabel, formatTimeSince } from "@/lib/muscles";

interface SetDetail { set: number; reps: number; weight: string; failure: boolean; }
interface Exercise { id: number; name: string; primaryMuscle: string; secondaryMuscles: string[]; sets: number; reps: number; weight: string | null; restTime: number | null; equipment: string | null; setDetails?: SetDetail[]; }
interface Workout { id: number; name: string; date: string; time: string | null; duration: number | null; notes: string | null; exercises: Exercise[]; }

interface Props { workout: Workout; isSelected: boolean; onSelect: () => void; onDelete: (id: number) => void; }

function pw(w: string | null): number { if (!w) return 0; const n = parseFloat(w.replace(/[^0-9.]/g, "")); return isNaN(n) ? 0 : n; }

export default function WorkoutCard({ workout, isSelected, onSelect, onDelete }: Props) {
  const now = new Date();
  const workoutDate = new Date(workout.date + "T" + (workout.time || "12:00:00"));
  const hoursSince = (now.getTime() - workoutDate.getTime()) / (1000 * 60 * 60);
  const status = getRecoveryStatus(hoursSince);
  const statusColor = getRecoveryColor(status);

  const dateStr = new Date(workout.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  const totalSets = workout.exercises.reduce((s, e) => s + e.sets, 0);
  const totalReps = workout.exercises.reduce((s, e) => s + e.sets * e.reps, 0);
  const totalWeight = workout.exercises.reduce((s, e) => s + pw(e.weight) * e.sets * e.reps, 0);

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
  const RC: Record<string, { bg: string; text: string }> = { upper_push: { bg: "bg-blue-500/8", text: "text-blue-400" }, upper_pull: { bg: "bg-emerald-500/8", text: "text-emerald-400" }, lower_body: { bg: "bg-purple-500/8", text: "text-purple-400" }, core: { bg: "bg-amber-500/8", text: "text-amber-400" } };

  return (
    <div className={`glass-card rounded-lg lg:rounded-xl overflow-hidden glass-card-hover cursor-pointer transition-all ${isSelected ? "!border-brand-500/30 ring-1 ring-brand-500/15" : ""}`} onClick={onSelect}>
      <div className="h-px" style={{ background: `linear-gradient(90deg, ${statusColor}60, transparent)` }} />
      <div className="p-2.5 lg:p-3">
        {/* Header */}
        <div className="flex items-start justify-between mb-1.5">
          <div className="min-w-0 flex-1">
            <h4 className="text-white font-semibold text-[11px] lg:text-[13px] tracking-tight truncate">{workout.name}</h4>
            <div className="flex items-center gap-1 mt-0.5 text-[9px] lg:text-[10px] text-dark-600">
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

        {/* Collapsed: just exercise pills */}
        {!isSelected && (
          <div className="flex flex-wrap gap-0.5">
            {workout.exercises.map((ex) => (
              <span key={ex.id} className="text-[8px] lg:text-[9px] font-medium px-1.5 py-px rounded" style={{ backgroundColor: statusColor + "0c", color: statusColor }}>
                {ex.name} <span className="opacity-50">{ex.sets}×{ex.reps}{ex.weight ? ` @${pw(ex.weight)}` : ""}</span>
              </span>
            ))}
          </div>
        )}

        {/* ─── EXPANDED: Full workout details ─── */}
        {isSelected && (
          <div className="animate-fade-in space-y-2 mt-2">
            {/* Summary stats */}
            <div className="grid grid-cols-4 gap-1">
              {[
                { l: "Sets", v: String(totalSets) },
                { l: "Reps", v: totalReps.toLocaleString() },
                { l: "Lbs Moved", v: totalWeight > 999 ? `${(totalWeight / 1000).toFixed(1)}K` : String(Math.round(totalWeight)) },
                { l: "Recovery", v: formatTimeSince(hoursSince) },
              ].map((s) => (
                <div key={s.l} className="glass-inset rounded p-1.5 text-center">
                  <div className="text-white text-[10px] lg:text-[11px] font-bold tabular-nums">{s.v}</div>
                  <div className="text-dark-700 text-[6px] lg:text-[7px] uppercase tracking-wider">{s.l}</div>
                </div>
              ))}
            </div>

            {/* Recovery status */}
            <div className="flex items-center gap-2 glass-inset rounded p-1.5">
              <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: statusColor }} />
              <span className="text-[9px] font-medium" style={{ color: statusColor }}>{getRecoveryLabel(status)}</span>
              <span className="text-dark-600 text-[8px]">· {formatTimeSince(hoursSince)}</span>
            </div>

            {/* Each exercise — full detail */}
            <div className="space-y-1.5">
              <div className="text-dark-500 text-[8px] lg:text-[9px] uppercase tracking-wider font-medium">Exercise Details</div>
              {workout.exercises.map((ex, idx) => (
                <div key={ex.id} className="glass-inset rounded p-2">
                  {/* Exercise header */}
                  <div className="flex items-start justify-between mb-1.5">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded bg-brand-500/10 text-brand-400 text-[8px] font-bold flex items-center justify-center shrink-0">{idx + 1}</span>
                        <span className="text-white text-[10px] lg:text-[11px] font-semibold truncate">{ex.name}</span>
                      </div>
                    </div>
                    {ex.equipment && <span className="text-[7px] font-medium text-dark-600 bg-white/[.03] px-1.5 py-px rounded capitalize shrink-0">{ex.equipment}</span>}
                  </div>

                  {/* Muscle targets */}
                  <div className="flex flex-wrap gap-0.5 mb-1.5">
                    <span className="text-[7px] font-medium px-1 py-px rounded bg-orange-500/10 text-orange-400">{MUSCLE_MAP[ex.primaryMuscle]?.name || ex.primaryMuscle}</span>
                    {ex.secondaryMuscles.map((m) => (
                      <span key={m} className="text-[7px] font-medium px-1 py-px rounded bg-yellow-500/8 text-yellow-500/70">{MUSCLE_MAP[m]?.name || m}</span>
                    ))}
                  </div>

                  {/* Per-set details table — always show */}
                  {(() => {
                    // Use saved setDetails, or generate from aggregate data
                    const details: SetDetail[] = (ex.setDetails && ex.setDetails.length > 0)
                      ? ex.setDetails
                      : Array.from({ length: ex.sets }, (_, i) => ({ set: i + 1, reps: ex.reps, weight: ex.weight || "BW", failure: false }));
                    return (
                      <div className="space-y-px">
                        <div className="flex items-center gap-1 text-[6px] lg:text-[7px] text-dark-600 uppercase tracking-wider font-medium px-1 mb-0.5">
                          <span className="w-4 text-center">Set</span>
                          <span className="flex-1">Reps</span>
                          <span className="w-14 text-center">Weight</span>
                          <span className="w-4 text-center">Fail</span>
                        </div>
                        {details.map((sd, si) => (
                          <div key={si} className={`flex items-center gap-1 rounded px-1.5 py-0.5 ${sd.failure ? "bg-red-500/5" : "bg-black/15"}`}>
                            <span className="text-[8px] text-dark-500 font-bold w-4 text-center">{sd.set}</span>
                            <span className="text-[9px] text-white font-semibold tabular-nums flex-1">{sd.reps} reps</span>
                            <span className="text-[9px] text-dark-300 font-medium tabular-nums w-14 text-center">{sd.weight || "BW"}</span>
                            {sd.failure ? (
                              <span className="w-4 text-center text-[7px] font-bold text-red-400">F</span>
                            ) : (
                              <span className="w-4 text-center text-dark-700 text-[7px]">—</span>
                            )}
                          </div>
                        ))}
                      </div>
                    );
                  })()}

                  {/* Rest time + Volume */}
                  <div className="flex items-center justify-between mt-1 text-[7px] text-dark-600">
                    {ex.restTime && <span>Rest: {ex.restTime}s between sets</span>}
                    {pw(ex.weight) > 0 && <span>Volume: <span className="text-dark-400 font-medium">{(pw(ex.weight) * ex.sets * ex.reps).toLocaleString()} lbs</span></span>}
                  </div>
                </div>
              ))}
            </div>

            {/* Target analysis */}
            <div className="glass-inset rounded p-2">
              <div className="text-[8px] text-dark-600 uppercase tracking-wider font-medium mb-1">Target Analysis</div>
              <div className="space-y-0.5">
                {topMuscles.map((m) => {
                  const totalAll = Object.values(muscleScores).reduce((a, b) => a + b.primary + b.secondary, 0) || 1;
                  const pct = Math.round((m.total / totalAll) * 100);
                  return (
                    <div key={m.id} className="flex items-center gap-1.5">
                      <span className="text-[9px] text-dark-400 w-[60px] truncate font-medium">{m.name}</span>
                      <div className="flex-1 bar-track !h-[3px]">
                        <div className="h-full rounded-full flex overflow-hidden">
                          <div className="h-full bg-brand-500" style={{ width: `${(m.primary / maxScore) * 100}%` }} />
                          <div className="h-full bg-brand-400/40" style={{ width: `${(m.secondary / maxScore) * 100}%` }} />
                        </div>
                      </div>
                      <span className="text-[8px] text-dark-600 w-6 text-right tabular-nums">{pct}%</span>
                    </div>
                  );
                })}
              </div>
              <div className="flex flex-wrap gap-1 mt-1.5 pt-1.5 border-t border-white/[.02]">
                {[{ id: "upper_push", label: "Push" }, { id: "upper_pull", label: "Pull" }, { id: "lower_body", label: "Legs" }, { id: "core", label: "Core" }].map((r) => {
                  const pct = Math.round((regionSets[r.id] / totalRegion) * 100);
                  if (pct === 0) return null;
                  const c = RC[r.id];
                  return <span key={r.id} className={`text-[8px] font-medium px-1.5 py-px rounded ${c.bg} ${c.text}`}>{r.label} {pct}%</span>;
                })}
              </div>
            </div>

            {/* Notes */}
            {workout.notes && (
              <div className="glass-inset rounded p-2">
                <div className="text-[8px] text-dark-600 uppercase tracking-wider font-medium mb-0.5">Notes</div>
                <p className="text-dark-400 text-[9px] lg:text-[10px] leading-relaxed">{workout.notes}</p>
              </div>
            )}

            {/* Tap hint */}
            <div className="text-center text-dark-700 text-[7px]">Tap again to close · Muscles highlighted on body map</div>
          </div>
        )}
      </div>
    </div>
  );
}
