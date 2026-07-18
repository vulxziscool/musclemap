"use client";

import { useState, useEffect, useMemo } from "react";
import { MUSCLES, MUSCLE_MAP, RecoveryState, getRecoveryColor, getRecoveryLabel } from "@/lib/muscles";
import { EXERCISE_LIBRARY } from "@/lib/exercises";
import { todayET } from "@/lib/timezone";

interface Exercise { name: string; primaryMuscle: string; secondaryMuscles: string[]; sets: number; reps: number; weight: string | null; equipment: string | null; }
interface Workout { id: number; name: string; date: string; exercises: Exercise[]; }

function pw(w: string | null): number { if (!w) return 0; const n = parseFloat(w.replace(/[^0-9.]/g, "")); return isNaN(n) ? 0 : n; }

const QUOTES = [
  "The only bad workout is the one that didn't happen.",
  "Your body can stand almost anything. It's your mind you have to convince.",
  "Strength does not come from the body. It comes from the will.",
  "The pain you feel today will be the strength you feel tomorrow.",
  "Don't count the days. Make the days count.",
  "Success isn't always about greatness. It's about consistency.",
  "The iron never lies to you. It's always there, waiting to be picked up.",
  "Fall in love with the process and the results will come.",
  "Champions are made when nobody is watching.",
  "You don't have to be extreme, just consistent.",
  "The difference between try and triumph is a little umph.",
  "Discipline is doing what needs to be done, even when you don't want to.",
  "Strong people are harder to kill and more useful in general.",
  "Train insane or remain the same.",
  "What seems impossible today will one day become your warm-up.",
];

interface Props {
  workouts: Workout[];
  recovery: Record<string, RecoveryState>;
}

export default function SmartTools({ workouts, recovery }: Props) {
  const [tab, setTab] = useState<"today" | "prs" | "balance" | "goals" | "water">("today");
  const [quote] = useState(() => QUOTES[Math.floor(Date.now() / 86400000) % QUOTES.length]);
  const [waterGlasses, setWaterGlasses] = useState(0);
  const [waterGoal] = useState(8);
  const [goals, setGoals] = useState<{ id: string; text: string; target: string; done: boolean }[]>([]);
  const [newGoal, setNewGoal] = useState("");
  const [newTarget, setNewTarget] = useState("");

  // Load from localStorage
  useEffect(() => {
    const w = localStorage.getItem("mm_water_" + todayET());
    if (w) setWaterGlasses(parseInt(w));
    const g = localStorage.getItem("mm_goals");
    if (g) setGoals(JSON.parse(g));
  }, []);

  const saveWater = (v: number) => { setWaterGlasses(v); localStorage.setItem("mm_water_" + todayET(), String(v)); };
  const addGoal = () => { if (!newGoal.trim()) return; const g = [{ id: Date.now().toString(36), text: newGoal, target: newTarget, done: false }, ...goals]; setGoals(g); localStorage.setItem("mm_goals", JSON.stringify(g)); setNewGoal(""); setNewTarget(""); };
  const toggleGoal = (id: string) => { const g = goals.map((x) => x.id === id ? { ...x, done: !x.done } : x); setGoals(g); localStorage.setItem("mm_goals", JSON.stringify(g)); };
  const deleteGoal = (id: string) => { const g = goals.filter((x) => x.id !== id); setGoals(g); localStorage.setItem("mm_goals", JSON.stringify(g)); };

  // ─── TODAY'S RECOMMENDATION ───
  const todayRec = useMemo(() => {
    const ready = MUSCLES.filter((m) => {
      const r = recovery[m.id];
      return !r || r.status === "fully_recovered" || r.status === "not_trained" || r.status === "almost_ready";
    });
    const healing = MUSCLES.filter((m) => { const r = recovery[m.id]; return r && (r.status === "just_trained" || r.status === "recovering"); });

    // Group ready muscles by region
    const regions: Record<string, string[]> = {};
    ready.forEach((m) => { if (!regions[m.region]) regions[m.region] = []; regions[m.region].push(m.name); });

    // Find best region to train
    const regionScores = Object.entries(regions).map(([r, ms]) => ({ region: r, count: ms.length, muscles: ms })).sort((a, b) => b.count - a.count);

    const bestRegion = regionScores[0];
    const regionNames: Record<string, string> = { upper_push: "Push Day", upper_pull: "Pull Day", lower_body: "Leg Day", core: "Core Day" };
    const suggestion = bestRegion ? regionNames[bestRegion.region] || "Full Body" : "Rest Day";

    // Find exercises for recommended muscles
    const recMuscles = bestRegion ? bestRegion.muscles.slice(0, 4) : [];
    const recExercises = recMuscles.flatMap((mName) => {
      const m = MUSCLES.find((x) => x.name === mName);
      if (!m) return [];
      return EXERCISE_LIBRARY.filter((e) => e.primaryMuscle === m.id).slice(0, 2).map((e) => e.name);
    }).slice(0, 6);

    return { suggestion, readyCount: ready.length, healingCount: healing.length, muscles: recMuscles, exercises: recExercises, avoidMuscles: healing.map((m) => m.name) };
  }, [recovery]);

  // ─── PERSONAL RECORDS ───
  const prs = useMemo(() => {
    const map: Record<string, { weight: number; reps: number; date: string; e1rm: number }> = {};
    workouts.forEach((w) => w.exercises.forEach((e) => {
      const wt = pw(e.weight);
      const e1rm = Math.round(wt * (1 + e.reps / 30));
      if (!map[e.name] || e1rm > map[e.name].e1rm) {
        map[e.name] = { weight: wt, reps: e.reps, date: w.date, e1rm };
      }
    }));
    return Object.entries(map).map(([name, data]) => ({ name, ...data })).filter((p) => p.weight > 0).sort((a, b) => b.e1rm - a.e1rm);
  }, [workouts]);

  // ─── MUSCLE BALANCE ───
  const balance = useMemo(() => {
    const regions: Record<string, number> = { upper_push: 0, upper_pull: 0, lower_body: 0, core: 0 };
    const muscleVol: Record<string, number> = {};
    workouts.forEach((w) => w.exercises.forEach((e) => {
      const m = MUSCLE_MAP[e.primaryMuscle];
      if (m) {
        regions[m.region] = (regions[m.region] || 0) + e.sets;
        muscleVol[e.primaryMuscle] = (muscleVol[e.primaryMuscle] || 0) + e.sets;
      }
    }));
    const total = Object.values(regions).reduce((a, b) => a + b, 0) || 1;
    const pushPull = (regions.upper_push || 0) > 0 && (regions.upper_pull || 0) > 0 ? ((regions.upper_push / regions.upper_pull) * 100).toFixed(0) : "—";

    // Find neglected muscles (0 sets in last 14 days)
    const recent = workouts.filter((w) => { const d = new Date(w.date); return (Date.now() - d.getTime()) < 14 * 86400000; });
    const recentMuscles = new Set<string>();
    recent.forEach((w) => w.exercises.forEach((e) => recentMuscles.add(e.primaryMuscle)));
    const neglected = MUSCLES.filter((m) => !recentMuscles.has(m.id)).map((m) => m.name);

    return { regions, total, pushPull, neglected, muscleVol };
  }, [workouts]);

  // ─── TRAINING AGE ───
  const trainingAge = useMemo(() => {
    if (workouts.length === 0) return null;
    const dates = workouts.map((w) => new Date(w.date).getTime()).sort();
    const first = dates[0];
    const days = Math.floor((Date.now() - first) / 86400000);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);
    return { days, months, years, firstDate: new Date(first).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) };
  }, [workouts]);

  const TABS = [
    { id: "today" as const, label: "Today" },
    { id: "prs" as const, label: "PRs" },
    { id: "balance" as const, label: "Balance" },
    { id: "goals" as const, label: "Goals" },
    { id: "water" as const, label: "Water" },
  ];

  return (
    <div className="glass-card rounded-lg lg:rounded-xl overflow-hidden">
      <div className="h-0.5 bg-gradient-to-r from-indigo-500 to-transparent" />
      <div className="p-2.5 lg:p-3">
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 lg:w-7 lg:h-7 rounded-md bg-indigo-500/10 flex items-center justify-center">
            <svg className="w-3 h-3 lg:w-3.5 lg:h-3.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <div>
            <h3 className="text-white font-semibold text-[11px] lg:text-[14px] tracking-tight">Smart Tools</h3>
            <p className="text-dark-600 text-[8px] lg:text-[9px]">Recommendations, PRs, balance, goals</p>
          </div>
        </div>

        {/* Quote */}
        <div className="glass-inset rounded p-1.5 mb-2 text-center">
          <p className="text-dark-400 text-[8px] lg:text-[9px] italic leading-relaxed">&ldquo;{quote}&rdquo;</p>
        </div>

        {/* Training age */}
        {trainingAge && (
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="text-center"><div className="text-white text-[11px] font-bold">{trainingAge.years > 0 ? `${trainingAge.years}y ${trainingAge.months % 12}m` : `${trainingAge.months}m ${trainingAge.days % 30}d`}</div><div className="text-dark-700 text-[6px] uppercase">Training Age</div></div>
            <div className="w-px h-5 bg-white/[.05]" />
            <div className="text-center"><div className="text-white text-[11px] font-bold">{trainingAge.firstDate}</div><div className="text-dark-700 text-[6px] uppercase">Started</div></div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-0.5 mb-2 overflow-x-auto no-scrollbar">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`shrink-0 text-[8px] lg:text-[9px] font-medium px-2 py-1 rounded transition-all ${tab === t.id ? "bg-indigo-500/15 text-indigo-400" : "bg-white/[.03] text-dark-500"}`}>{t.label}</button>
          ))}
        </div>

        {/* ── TODAY TAB ── */}
        {tab === "today" && (
          <div className="space-y-1.5 animate-fade-in">
            <div className="glass-inset rounded p-2">
              <div className="text-indigo-400 text-[9px] font-semibold mb-1">Recommended: {todayRec.suggestion}</div>
              <div className="text-dark-400 text-[8px] mb-1">{todayRec.readyCount} muscles ready, {todayRec.healingCount} still recovering</div>
              {todayRec.muscles.length > 0 && (
                <div className="flex flex-wrap gap-0.5 mb-1">
                  {todayRec.muscles.map((m) => <span key={m} className="text-[7px] font-medium bg-green-500/10 text-green-400 px-1.5 py-px rounded">{m}</span>)}
                </div>
              )}
              {todayRec.exercises.length > 0 && (
                <div><div className="text-dark-600 text-[7px] uppercase mb-0.5">Try these:</div>
                  <div className="flex flex-wrap gap-0.5">{todayRec.exercises.map((e) => <span key={e} className="text-[7px] text-dark-400 bg-white/[.03] px-1.5 py-px rounded">{e}</span>)}</div>
                </div>
              )}
            </div>
            {todayRec.avoidMuscles.length > 0 && (
              <div className="glass-inset rounded p-1.5">
                <div className="text-red-400 text-[8px] font-medium mb-0.5">Avoid training:</div>
                <div className="flex flex-wrap gap-0.5">{todayRec.avoidMuscles.map((m) => <span key={m} className="text-[7px] text-red-400/70 bg-red-500/8 px-1.5 py-px rounded">{m}</span>)}</div>
              </div>
            )}
          </div>
        )}

        {/* ── PRS TAB ── */}
        {tab === "prs" && (
          <div className="animate-fade-in">
            {prs.length === 0 ? <div className="text-dark-600 text-[9px] text-center py-3">Log workouts with weights to see PRs</div> : (
              <div className="space-y-px max-h-48 overflow-y-auto scrollbar-thin">
                {prs.slice(0, 20).map((p, i) => (
                  <div key={p.name} className="flex items-center gap-1.5 glass-inset rounded p-1.5">
                    <span className={`w-4 h-4 rounded flex items-center justify-center text-[7px] font-bold shrink-0 ${i === 0 ? "bg-yellow-500/20 text-yellow-400" : i === 1 ? "bg-gray-400/20 text-gray-300" : i === 2 ? "bg-amber-600/20 text-amber-500" : "bg-white/[.04] text-dark-600"}`}>{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-[9px] font-medium truncate">{p.name}</div>
                      <div className="text-dark-600 text-[7px]">{p.weight} lbs × {p.reps} reps · {p.date.slice(5)}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-indigo-400 text-[10px] font-bold tabular-nums">{p.e1rm}</div>
                      <div className="text-dark-700 text-[6px]">e1RM</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── BALANCE TAB ── */}
        {tab === "balance" && (
          <div className="space-y-1.5 animate-fade-in">
            <div className="glass-inset rounded p-2">
              <div className="text-dark-500 text-[8px] uppercase tracking-wider font-medium mb-1">Volume by Region (sets)</div>
              {[{ id: "upper_push", label: "Push", color: "#3b82f6" }, { id: "upper_pull", label: "Pull", color: "#10b981" }, { id: "lower_body", label: "Legs", color: "#a855f7" }, { id: "core", label: "Core", color: "#f59e0b" }].map((r) => {
                const v = balance.regions[r.id] || 0;
                const pct = balance.total > 0 ? (v / balance.total) * 100 : 0;
                return (
                  <div key={r.id} className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[8px] text-dark-400 w-8">{r.label}</span>
                    <div className="flex-1 bar-track !h-[4px]"><div className="bar-fill" style={{ width: `${pct}%`, backgroundColor: r.color }} /></div>
                    <span className="text-[8px] text-dark-500 w-8 text-right tabular-nums">{Math.round(pct)}%</span>
                  </div>
                );
              })}
              <div className="text-center text-[8px] text-dark-500 mt-1">Push:Pull Ratio — <span className="text-white font-semibold">{balance.pushPull}%</span> <span className="text-dark-600">(ideal: 100%)</span></div>
            </div>
            {balance.neglected.length > 0 && (
              <div className="glass-inset rounded p-1.5">
                <div className="text-amber-400 text-[8px] font-medium mb-0.5">Not trained in 14 days:</div>
                <div className="flex flex-wrap gap-0.5">{balance.neglected.map((m) => <span key={m} className="text-[7px] text-amber-400/70 bg-amber-500/8 px-1.5 py-px rounded">{m}</span>)}</div>
              </div>
            )}
          </div>
        )}

        {/* ── GOALS TAB ── */}
        {tab === "goals" && (
          <div className="space-y-1.5 animate-fade-in">
            <div className="flex gap-1">
              <input type="text" value={newGoal} onChange={(e) => setNewGoal(e.target.value)} placeholder="Goal (e.g. Bench 225)" className="input-field flex-1 !text-[10px] !py-1" />
              <input type="text" value={newTarget} onChange={(e) => setNewTarget(e.target.value)} placeholder="By when" className="input-field w-20 !text-[10px] !py-1" />
              <button onClick={addGoal} className="h-6 px-2 bg-indigo-600 text-white text-[9px] font-semibold rounded shrink-0">Add</button>
            </div>
            {goals.length === 0 ? <div className="text-dark-600 text-[9px] text-center py-2">No goals yet. Add your first one above.</div> : (
              <div className="space-y-0.5">
                {goals.map((g) => (
                  <div key={g.id} className="flex items-center gap-1.5 glass-inset rounded p-1.5">
                    <button onClick={() => toggleGoal(g.id)} className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${g.done ? "bg-green-500/20 text-green-400" : "bg-white/[.04] text-dark-700"}`}>
                      {g.done && <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className={`text-[9px] font-medium truncate ${g.done ? "text-dark-500 line-through" : "text-white"}`}>{g.text}</div>
                      {g.target && <div className="text-dark-600 text-[7px]">{g.target}</div>}
                    </div>
                    <button onClick={() => deleteGoal(g.id)} className="text-dark-700 hover:text-red-400 shrink-0"><svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── WATER TAB ── */}
        {tab === "water" && (
          <div className="animate-fade-in">
            <div className="text-center mb-2">
              <div className="text-white text-lg font-bold tabular-nums">{waterGlasses} <span className="text-dark-500 text-sm font-normal">/ {waterGoal}</span></div>
              <div className="text-dark-600 text-[8px]">glasses today ({waterGlasses * 8} oz)</div>
            </div>
            <div className="bar-track !h-2 mb-2"><div className="bar-fill bg-sky-500" style={{ width: `${Math.min(100, (waterGlasses / waterGoal) * 100)}%` }} /></div>
            <div className="grid grid-cols-8 gap-1 mb-2">
              {Array.from({ length: waterGoal }, (_, i) => (
                <button key={i} onClick={() => saveWater(i + 1)} className={`aspect-square rounded flex items-center justify-center text-sm transition-all ${i < waterGlasses ? "bg-sky-500/20 text-sky-400" : "bg-white/[.03] text-dark-700"}`}>
                  💧
                </button>
              ))}
            </div>
            <div className="flex gap-1 justify-center">
              <button onClick={() => saveWater(Math.max(0, waterGlasses - 1))} className="h-6 px-3 glass-inset text-dark-400 text-[9px] font-medium rounded">-1</button>
              <button onClick={() => saveWater(waterGlasses + 1)} className="h-6 px-3 bg-sky-600 text-white text-[9px] font-semibold rounded">+1 Glass</button>
              <button onClick={() => saveWater(0)} className="h-6 px-3 glass-inset text-dark-400 text-[9px] font-medium rounded">Reset</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
