"use client";

import { useState, useMemo, useId } from "react";
import { getRank, RANK_LABELS, RANK_COLORS } from "@/lib/exercises";

interface Exercise { name: string; sets: number; reps: number; weight: string | null; primaryMuscle: string; }
interface Workout { id: number; date: string; name: string; exercises: Exercise[]; }

function pw(w: string | null): number { if (!w) return 0; const n = parseFloat(w.replace(/[^0-9.]/g, "")); return isNaN(n) ? 0 : n; }

function Spark({ data, color }: { data: number[]; color: string }) {
  const gid = useId();
  if (data.length < 2) return null;
  const mn = Math.min(...data); const mx = Math.max(...data); const r = mx - mn || 1;
  const w = 60; const h = 22; const p = 2;
  const pts = data.map((v, i) => ({ x: p + (i / (data.length - 1)) * (w - p * 2), y: h - p - ((v - mn) / r) * (h - p * 2) }));
  const line = pts.map((pt, i) => `${i === 0 ? "M" : "L"}${pt.x.toFixed(1)},${pt.y.toFixed(1)}`).join(" ");
  const area = line + ` L${pts[pts.length - 1].x.toFixed(1)},${h} L${pts[0].x.toFixed(1)},${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: 22 }}>
      <defs><linearGradient id={gid} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="0.15" /><stop offset="100%" stopColor={color} stopOpacity="0" /></linearGradient></defs>
      <path d={area} fill={`url(#${gid})`} /><path d={line} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length - 1].x} cy={pts[pts.length - 1].y} r="1.5" fill={color} />
    </svg>
  );
}

interface Props { workouts: Workout[]; bodyWeight: number | null; gender: string | null; }

export default function ExerciseHistory({ workouts, bodyWeight, gender }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [tab, setTab] = useState<"progress" | "top10">("progress");

  const bw = bodyWeight || 170;
  const g = gender || "male";

  // Build from ACTUAL logged workouts only
  const exerciseData = useMemo(() => {
    const map: Record<string, { dates: string[]; weights: number[]; sets: number[]; reps: number[]; workoutNames: string[]; maxWeight: number; totalVolume: number; count: number; bestSet: { weight: number; reps: number; date: string } }> = {};
    for (const w of workouts) {
      for (const ex of w.exercises) {
        const wt = pw(ex.weight);
        if (!map[ex.name]) map[ex.name] = { dates: [], weights: [], sets: [], reps: [], workoutNames: [], maxWeight: 0, totalVolume: 0, count: 0, bestSet: { weight: 0, reps: 0, date: "" } };
        const d = map[ex.name];
        d.dates.push(w.date);
        d.weights.push(wt);
        d.sets.push(ex.sets);
        d.reps.push(ex.reps);
        d.workoutNames.push(w.name);
        d.maxWeight = Math.max(d.maxWeight, wt);
        d.totalVolume += wt * ex.sets * ex.reps;
        d.count++;
        if (wt > d.bestSet.weight || (wt === d.bestSet.weight && ex.reps > d.bestSet.reps)) {
          d.bestSet = { weight: wt, reps: ex.reps, date: w.date };
        }
      }
    }
    return Object.entries(map).map(([name, data]) => ({ name, ...data })).sort((a, b) => b.count - a.count);
  }, [workouts]);

  // Top 10 strongest lifts by estimated 1RM
  const top10 = useMemo(() => {
    const lifts: { name: string; weight: number; reps: number; e1rm: number; date: string; rank: ReturnType<typeof getRank> }[] = [];
    for (const w of workouts) {
      for (const ex of w.exercises) {
        const wt = pw(ex.weight);
        if (wt > 0) {
          const e1rm = Math.round(wt * (1 + ex.reps / 30));
          lifts.push({ name: ex.name, weight: wt, reps: ex.reps, e1rm, date: w.date, rank: getRank(ex.name, wt, bw, g) });
        }
      }
    }
    return lifts.sort((a, b) => b.e1rm - a.e1rm).slice(0, 10);
  }, [workouts, bw, g]);

  if (exerciseData.length === 0 && top10.length === 0) return null;

  const displayExercises = showAll ? exerciseData : exerciseData.slice(0, 6);

  return (
    <div className="glass-card rounded-lg lg:rounded-xl overflow-hidden">
      <div className="h-0.5 bg-gradient-to-r from-cyan-500 to-transparent" />
      <div className="p-2.5 lg:p-3">
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 lg:w-7 lg:h-7 rounded-md bg-cyan-500/10 flex items-center justify-center">
            <svg className="w-3 h-3 lg:w-3.5 lg:h-3.5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
          </div>
          <div>
            <h3 className="text-white font-semibold text-[11px] lg:text-[14px] tracking-tight">My Lifts</h3>
            <p className="text-dark-600 text-[8px] lg:text-[9px]">{exerciseData.length} exercises logged from your workouts</p>
          </div>
        </div>

        {/* Tab toggle */}
        <div className="flex gap-1 mb-2">
          <button onClick={() => setTab("progress")} className={`flex-1 text-[9px] font-medium py-1 rounded transition-all ${tab === "progress" ? "bg-cyan-500/15 text-cyan-400" : "bg-white/[.03] text-dark-500"}`}>Exercise Progress</button>
          <button onClick={() => setTab("top10")} className={`flex-1 text-[9px] font-medium py-1 rounded transition-all ${tab === "top10" ? "bg-amber-500/15 text-amber-400" : "bg-white/[.03] text-dark-500"}`}>Top 10 Strongest</button>
        </div>

        {/* ── PROGRESS TAB ── */}
        {tab === "progress" && (
          <div className="space-y-0.5">
            {displayExercises.map((ex) => {
              const rank = getRank(ex.name, ex.maxWeight, bw, g);
              const isOpen = expanded === ex.name;
              const latest = ex.weights[ex.weights.length - 1];
              const first = ex.weights[0];
              const change = latest - first;

              return (
                <div key={ex.name}>
                  <button onClick={() => setExpanded(isOpen ? null : ex.name)} className="w-full glass-inset rounded p-1.5 flex items-center gap-1.5 hover:bg-white/[.02] transition-all text-left">
                    <div className="w-4 h-4 rounded flex items-center justify-center shrink-0 text-[7px] font-bold" style={{ backgroundColor: rank.color + "20", color: rank.color }}>{rank.label[0]}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-dark-200 text-[9px] lg:text-[11px] font-medium truncate">{ex.name}</div>
                      <div className="text-dark-600 text-[7px] lg:text-[8px]">{ex.count}x · {ex.maxWeight > 0 ? `${ex.maxWeight} lbs` : "BW"} · <span style={{ color: rank.color }}>{rank.label}</span></div>
                    </div>
                    <div className="w-12 shrink-0"><Spark data={ex.weights} color={rank.color} /></div>
                    {ex.weights.length > 1 && change !== 0 && (
                      <span className={`shrink-0 text-[7px] font-semibold tabular-nums ${change > 0 ? "text-emerald-400" : "text-red-400"}`}>{change > 0 ? "+" : ""}{change}</span>
                    )}
                  </button>

                  {isOpen && (
                    <div className="glass-inset rounded p-2 mt-0.5 animate-fade-in space-y-1.5">
                      {/* Rank bar */}
                      <div>
                        <div className="flex items-center justify-between text-[8px] mb-0.5">
                          <span className="text-dark-500">Rank</span>
                          <span className="font-semibold" style={{ color: rank.color }}>{rank.label} · {rank.ratio.toFixed(2)}x BW</span>
                        </div>
                        <div className="flex gap-px h-1.5 rounded overflow-hidden">
                          {RANK_LABELS.map((_, i) => <div key={i} className="flex-1 rounded-sm" style={{ backgroundColor: i <= rank.rank ? RANK_COLORS[i] : "rgba(255,255,255,.04)" }} />)}
                        </div>
                        {rank.nextThreshold && <div className="text-[7px] text-dark-600 mt-0.5">Next: {Math.ceil(rank.nextThreshold)} lbs ({RANK_LABELS[rank.rank + 1]})</div>}
                      </div>

                      {/* Graph */}
                      <div>
                        <div className="text-[7px] text-dark-600 uppercase tracking-wider mb-0.5">Weight Over Time</div>
                        <Spark data={ex.weights} color={rank.color} />
                        <div className="flex justify-between text-[6px] text-dark-700 mt-px"><span>{ex.dates[0]?.slice(5)}</span><span>{ex.dates[ex.dates.length - 1]?.slice(5)}</span></div>
                      </div>

                      {/* Session history */}
                      <div>
                        <div className="text-[7px] text-dark-600 uppercase tracking-wider mb-0.5">Workout History</div>
                        <div className="space-y-px max-h-24 overflow-y-auto scrollbar-thin">
                          {ex.dates.map((date, i) => (
                            <div key={`${date}-${i}`} className="flex items-center justify-between bg-black/15 rounded px-1.5 py-0.5">
                              <span className="text-[7px] text-dark-400 truncate flex-1">{ex.workoutNames[i]}</span>
                              <span className="text-[7px] text-dark-500 tabular-nums shrink-0 ml-1">{date.slice(5)}</span>
                              <span className="text-[7px] text-dark-300 tabular-nums shrink-0 ml-1 font-medium">{ex.weights[i] > 0 ? `${ex.weights[i]} lbs` : "BW"} · {ex.sets[i]}×{ex.reps[i]}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-4 gap-0.5">
                        {[{ l: "Best", v: ex.maxWeight > 0 ? `${ex.maxWeight}` : "BW" }, { l: "Sessions", v: `${ex.count}` }, { l: "Volume", v: ex.totalVolume > 9999 ? `${(ex.totalVolume / 1000).toFixed(1)}k` : `${ex.totalVolume}` }, { l: "BW Ratio", v: `${rank.ratio.toFixed(2)}x` }].map((s) => (
                          <div key={s.l} className="bg-black/20 rounded p-1 text-center">
                            <div className="text-white text-[9px] font-bold tabular-nums">{s.v}</div>
                            <div className="text-dark-700 text-[6px] uppercase">{s.l}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {exerciseData.length > 6 && (
              <button onClick={() => setShowAll(!showAll)} className="w-full mt-1 text-dark-500 text-[8px] font-medium hover:text-dark-300 transition-colors">
                {showAll ? "Show less" : `Show all ${exerciseData.length} exercises`}
              </button>
            )}
          </div>
        )}

        {/* ── TOP 10 STRONGEST TAB ── */}
        {tab === "top10" && (
          <div>
            {top10.length === 0 ? (
              <div className="text-center py-4 text-dark-600 text-[10px]">Log workouts with weights to see your strongest lifts</div>
            ) : (
              <div className="space-y-0.5">
                {top10.map((lift, i) => (
                  <div key={`${lift.name}-${lift.date}-${i}`} className="glass-inset rounded p-1.5 flex items-center gap-2">
                    {/* Rank number */}
                    <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 text-[9px] font-bold ${i === 0 ? "bg-yellow-500/20 text-yellow-400" : i === 1 ? "bg-gray-400/20 text-gray-300" : i === 2 ? "bg-amber-600/20 text-amber-500" : "bg-white/[.04] text-dark-500"}`}>
                      {i + 1}
                    </div>
                    {/* Exercise info */}
                    <div className="flex-1 min-w-0">
                      <div className="text-dark-200 text-[9px] lg:text-[11px] font-medium truncate">{lift.name}</div>
                      <div className="text-dark-600 text-[7px] lg:text-[8px]">{lift.date.slice(5)} · {lift.weight} lbs × {lift.reps} reps</div>
                    </div>
                    {/* E1RM + Rank */}
                    <div className="text-right shrink-0">
                      <div className="text-white text-[10px] lg:text-[11px] font-bold tabular-nums">{lift.e1rm} <span className="text-dark-600 text-[7px] font-normal">e1RM</span></div>
                      <div className="text-[7px] font-semibold" style={{ color: lift.rank.color }}>{lift.rank.label} · {lift.rank.ratio.toFixed(1)}x</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
