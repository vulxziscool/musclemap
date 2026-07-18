"use client";

import { useState, useEffect, useMemo } from "react";
import { MUSCLES, MUSCLE_MAP } from "@/lib/muscles";
import { EXERCISE_LIBRARY } from "@/lib/exercises";
import { todayET } from "@/lib/timezone";

interface Exercise { name: string; primaryMuscle: string; secondaryMuscles: string[]; sets: number; reps: number; weight: string | null; equipment: string | null; }
interface Workout { id: number; name: string; date: string; duration: number | null; exercises: Exercise[]; }
function pw(w: string | null): number { if (!w) return 0; const n = parseFloat(w.replace(/[^0-9.]/g, "")); return isNaN(n) ? 0 : n; }

interface Props { workouts: Workout[]; }

export default function WorkoutExtras({ workouts }: Props) {
  const [tab, setTab] = useState<"summary" | "warmup" | "swap" | "split" | "export" | "sleep" | "custom">("summary");
  const [sleepHours, setSleepHours] = useState("");
  const [sleepLog, setSleepLog] = useState<{ date: string; hours: number }[]>([]);
  const [customName, setCustomName] = useState("");
  const [customMuscle, setCustomMuscle] = useState("");
  const [customEquip, setCustomEquip] = useState("bodyweight");
  const [customExercises, setCustomExercises] = useState<{ name: string; muscle: string; equip: string }[]>([]);
  const [warmupMuscle, setWarmupMuscle] = useState("mid_chest");
  const [swapExercise, setSwapExercise] = useState("");

  useEffect(() => {
    const s = localStorage.getItem("mm_sleep");
    if (s) setSleepLog(JSON.parse(s));
    const c = localStorage.getItem("mm_custom_ex");
    if (c) setCustomExercises(JSON.parse(c));
  }, []);

  // ── Weekly Summary ──
  const summary = useMemo(() => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 86400000);
    const week = workouts.filter((w) => new Date(w.date) >= weekAgo);
    const totalSets = week.reduce((s, w) => s + w.exercises.reduce((a, e) => a + e.sets, 0), 0);
    const totalReps = week.reduce((s, w) => s + w.exercises.reduce((a, e) => a + e.sets * e.reps, 0), 0);
    const totalWeight = week.reduce((s, w) => s + w.exercises.reduce((a, e) => a + pw(e.weight) * e.sets * e.reps, 0), 0);
    const totalDuration = week.reduce((s, w) => s + (w.duration || 0), 0);
    const muscles = new Set<string>();
    week.forEach((w) => w.exercises.forEach((e) => muscles.add(e.primaryMuscle)));
    const uniqueEx = new Set<string>();
    week.forEach((w) => w.exercises.forEach((e) => uniqueEx.add(e.name)));
    return { count: week.length, totalSets, totalReps, totalWeight, totalDuration, muscles: muscles.size, exercises: uniqueEx.size };
  }, [workouts]);

  // ── Split Detector ──
  const split = useMemo(() => {
    if (workouts.length < 3) return "Not enough data";
    const recent = workouts.slice(0, 10);
    const patterns: Record<string, number> = {};
    recent.forEach((w) => {
      const regions = new Set<string>();
      w.exercises.forEach((e) => { const m = MUSCLE_MAP[e.primaryMuscle]; if (m) regions.add(m.region); });
      const key = [...regions].sort().join("+");
      patterns[key] = (patterns[key] || 0) + 1;
    });
    const keys = Object.keys(patterns);
    if (keys.length <= 2 && keys.some((k) => k.includes("upper_push") && k.includes("upper_pull") && k.includes("lower_body"))) return "Full Body";
    if (keys.some((k) => k === "upper_push") && keys.some((k) => k === "upper_pull")) return "Push / Pull / Legs";
    if (keys.some((k) => k.includes("upper_push") && k.includes("upper_pull"))) return "Upper / Lower";
    if (keys.length >= 4) return "Body Part Split";
    return "Mixed / Custom";
  }, [workouts]);

  // ── Warmup Generator ──
  const warmupExercises = useMemo(() => {
    const muscle = MUSCLE_MAP[warmupMuscle];
    if (!muscle) return [];
    const warmup: string[] = [];
    // General
    warmup.push("5 min light cardio (jump rope or walking)");
    // Dynamic stretches for that region
    if (muscle.region === "upper_push") warmup.push("Arm circles × 10 each", "Band Dislocates × 10", "Scapular Push-Ups × 10", "Light push-ups × 10");
    else if (muscle.region === "upper_pull") warmup.push("Band Pull-Aparts × 15", "Scapular Pull-Ups × 8", "Cat-Cow × 10", "Light rows × 10");
    else if (muscle.region === "lower_body") warmup.push("Bodyweight squats × 15", "Hip CARs × 5/side", "Leg swings × 10/side", "Glute bridges × 12");
    else warmup.push("Dead bugs × 10", "Bird dogs × 8/side", "Cat-Cow × 10", "Plank × 20s");
    // Specific warm-up sets
    warmup.push(`2 warm-up sets of your first ${muscle.name} exercise at 50% weight`);
    warmup.push(`1 warm-up set at 70% weight`);
    return warmup;
  }, [warmupMuscle]);

  // ── Exercise Swap ──
  const swapSuggestions = useMemo(() => {
    const ex = EXERCISE_LIBRARY.find((e) => e.name === swapExercise);
    if (!ex) return [];
    return EXERCISE_LIBRARY.filter((e) => e.primaryMuscle === ex.primaryMuscle && e.name !== ex.name && e.equipment !== ex.equipment).slice(0, 6);
  }, [swapExercise]);

  // ── Export CSV ──
  const exportCSV = () => {
    const header = "Date,Workout,Exercise,Sets,Reps,Weight,Equipment,Primary Muscle\n";
    const rows = workouts.flatMap((w) => w.exercises.map((e) => `${w.date},"${w.name}","${e.name}",${e.sets},${e.reps},"${e.weight || "BW"}","${e.equipment || ""}","${e.primaryMuscle}"`));
    const csv = header + rows.join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `musclemap-export-${todayET()}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  // ── Full JSON Backup ──
  const exportJSON = () => {
    const dump = {
      workouts,
      localStorage: { ...localStorage },
      exportedAt: todayET(),
    };
    const blob = new Blob([JSON.stringify(dump, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `musclemap-backup-${todayET()}.json`;
    a.click(); URL.revokeObjectURL(url);
  };

  // ── Sleep ──
  const logSleep = () => {
    if (!sleepHours) return;
    const entry = { date: todayET(), hours: parseFloat(sleepHours) };
    const updated = [entry, ...sleepLog.filter((s) => s.date !== entry.date)].slice(0, 30);
    setSleepLog(updated); localStorage.setItem("mm_sleep", JSON.stringify(updated));
    setSleepHours("");
  };
  const avgSleep = sleepLog.length > 0 ? (sleepLog.reduce((s, x) => s + x.hours, 0) / sleepLog.length).toFixed(1) : "—";

  // ── Custom Exercise ──
  const addCustom = () => {
    if (!customName || !customMuscle) return;
    const updated = [...customExercises, { name: customName, muscle: customMuscle, equip: customEquip }];
    setCustomExercises(updated); localStorage.setItem("mm_custom_ex", JSON.stringify(updated));
    setCustomName(""); setCustomMuscle("");
  };

  const TABS = [
    { id: "summary" as const, l: "Week" }, { id: "warmup" as const, l: "Warmup" },
    { id: "swap" as const, l: "Swap" }, { id: "split" as const, l: "Split" },
    { id: "sleep" as const, l: "Sleep" }, { id: "custom" as const, l: "Custom" },
    { id: "export" as const, l: "Export" },
  ];

  return (
    <div className="glass-card rounded-lg lg:rounded-xl overflow-hidden">
      <div className="h-0.5 bg-gradient-to-r from-teal-500 to-transparent" />
      <div className="p-2.5 lg:p-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 lg:w-7 lg:h-7 rounded-md bg-teal-500/10 flex items-center justify-center">
            <svg className="w-3 h-3 lg:w-3.5 lg:h-3.5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><circle cx="12" cy="12" r="3" /></svg>
          </div>
          <div>
            <h3 className="text-white font-semibold text-[11px] lg:text-[14px] tracking-tight">Workout Tools</h3>
            <p className="text-dark-600 text-[8px]">Summary, warmup, swaps, sleep, export</p>
          </div>
        </div>

        <div className="flex gap-0.5 mb-2 overflow-x-auto no-scrollbar">
          {TABS.map((t) => <button key={t.id} onClick={() => setTab(t.id)} className={`shrink-0 text-[8px] font-medium px-2 py-1 rounded transition-all ${tab === t.id ? "bg-teal-500/15 text-teal-400" : "bg-white/[.03] text-dark-500"}`}>{t.l}</button>)}
        </div>

        {/* SUMMARY */}
        {tab === "summary" && (
          <div className="animate-fade-in">
            <div className="text-dark-500 text-[9px] font-medium mb-1">Last 7 Days</div>
            <div className="grid grid-cols-4 gap-1 mb-1.5">
              {[{ l: "Sessions", v: summary.count }, { l: "Sets", v: summary.totalSets }, { l: "Reps", v: summary.totalReps.toLocaleString() }, { l: "Lbs", v: summary.totalWeight > 9999 ? `${(summary.totalWeight / 1000).toFixed(1)}K` : Math.round(summary.totalWeight).toLocaleString() }].map((s) => (
                <div key={s.l} className="glass-inset rounded p-1 text-center"><div className="text-white text-[10px] font-bold tabular-nums">{s.v}</div><div className="text-dark-700 text-[6px] uppercase">{s.l}</div></div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-1">
              {[{ l: "Time", v: `${summary.totalDuration}m` }, { l: "Muscles", v: `${summary.muscles}/20` }, { l: "Exercises", v: summary.exercises }].map((s) => (
                <div key={s.l} className="glass-inset rounded p-1 text-center"><div className="text-white text-[9px] font-bold tabular-nums">{s.v}</div><div className="text-dark-700 text-[6px] uppercase">{s.l}</div></div>
              ))}
            </div>
          </div>
        )}

        {/* WARMUP */}
        {tab === "warmup" && (
          <div className="animate-fade-in space-y-1.5">
            <div><label className="text-dark-600 text-[8px] uppercase block mb-0.5">Target Muscle</label>
            <select value={warmupMuscle} onChange={(e) => setWarmupMuscle(e.target.value)} className="input-field !py-1 !text-[10px]">{MUSCLES.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}</select></div>
            <div className="space-y-0.5">{warmupExercises.map((w, i) => <div key={i} className="flex gap-1.5 glass-inset rounded p-1.5 text-[8px] text-dark-400"><span className="text-teal-400 shrink-0">{i + 1}.</span><span>{w}</span></div>)}</div>
          </div>
        )}

        {/* SWAP */}
        {tab === "swap" && (
          <div className="animate-fade-in space-y-1.5">
            <div><label className="text-dark-600 text-[8px] uppercase block mb-0.5">Exercise to Replace</label>
            <select value={swapExercise} onChange={(e) => setSwapExercise(e.target.value)} className="input-field !py-1 !text-[10px]"><option value="">Choose...</option>{EXERCISE_LIBRARY.slice(0, 100).map((e) => <option key={e.name} value={e.name}>{e.name}</option>)}</select></div>
            {swapSuggestions.length > 0 && (
              <div className="space-y-0.5">{swapSuggestions.map((s) => <div key={s.name} className="glass-inset rounded p-1.5 flex justify-between"><span className="text-dark-300 text-[9px] font-medium">{s.name}</span><span className="text-dark-600 text-[7px] capitalize">{s.equipment}</span></div>)}</div>
            )}
            {swapExercise && swapSuggestions.length === 0 && <div className="text-dark-600 text-[9px] text-center py-2">No alternative equipment swaps found</div>}
          </div>
        )}

        {/* SPLIT */}
        {tab === "split" && (
          <div className="animate-fade-in text-center py-3">
            <div className="text-dark-500 text-[9px] mb-1">Detected Training Split</div>
            <div className="text-white text-base font-bold">{split}</div>
            <div className="text-dark-600 text-[8px] mt-1">Based on your last 10 workouts</div>
          </div>
        )}

        {/* SLEEP */}
        {tab === "sleep" && (
          <div className="animate-fade-in space-y-1.5">
            <div className="flex gap-1.5">
              <input type="number" step="0.5" min="0" max="14" value={sleepHours} onChange={(e) => setSleepHours(e.target.value)} onFocus={(e) => e.target.select()} placeholder="Hours slept" className="input-field flex-1 !text-[10px] !py-1" />
              <button onClick={logSleep} className="h-7 px-3 bg-teal-600 text-white text-[9px] font-semibold rounded shrink-0">Log</button>
            </div>
            <div className="flex items-center justify-center gap-3">
              <div className="text-center"><div className="text-white text-sm font-bold">{avgSleep}</div><div className="text-dark-700 text-[6px] uppercase">Avg hrs</div></div>
              <div className="text-center"><div className="text-white text-sm font-bold">{sleepLog.length}</div><div className="text-dark-700 text-[6px] uppercase">Entries</div></div>
            </div>
            {sleepLog.length > 0 && <div className="space-y-px max-h-20 overflow-y-auto scrollbar-thin">{sleepLog.slice(0, 7).map((s) => <div key={s.date} className="flex justify-between glass-inset rounded px-1.5 py-0.5 text-[8px]"><span className="text-dark-500">{s.date.slice(5)}</span><span className={`font-medium ${s.hours >= 7 ? "text-green-400" : s.hours >= 6 ? "text-amber-400" : "text-red-400"}`}>{s.hours}h</span></div>)}</div>}
          </div>
        )}

        {/* CUSTOM */}
        {tab === "custom" && (
          <div className="animate-fade-in space-y-1.5">
            <div className="flex gap-1"><input type="text" value={customName} onChange={(e) => setCustomName(e.target.value)} placeholder="Exercise name" className="input-field flex-1 !text-[10px] !py-1" /></div>
            <div className="flex gap-1">
              <select value={customMuscle} onChange={(e) => setCustomMuscle(e.target.value)} className="input-field flex-1 !py-1 !text-[10px]"><option value="">Muscle...</option>{MUSCLES.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}</select>
              <select value={customEquip} onChange={(e) => setCustomEquip(e.target.value)} className="input-field w-24 !py-1 !text-[10px]"><option value="bodyweight">BW</option><option value="dumbbell">DB</option><option value="barbell">BB</option><option value="cable">Cable</option><option value="machine">Machine</option></select>
              <button onClick={addCustom} className="h-7 px-2 bg-teal-600 text-white text-[8px] font-semibold rounded shrink-0">Add</button>
            </div>
            {customExercises.length > 0 && <div className="space-y-0.5">{customExercises.map((c, i) => <div key={i} className="glass-inset rounded p-1 flex justify-between text-[8px]"><span className="text-dark-300">{c.name}</span><span className="text-dark-600">{MUSCLE_MAP[c.muscle]?.name} · {c.equip}</span></div>)}</div>}
          </div>
        )}

        {/* EXPORT */}
        {tab === "export" && (
          <div className="animate-fade-in text-center py-2 space-y-2">
            <p className="text-dark-400 text-[9px]">Export your training history or full backup</p>
            <div className="flex gap-2 justify-center">
              <button onClick={exportCSV} disabled={workouts.length === 0} className="h-7 px-3 bg-teal-600 hover:bg-teal-500 disabled:opacity-40 text-white text-[9px] font-semibold rounded transition-all">
                CSV Sheet
              </button>
              <button onClick={exportJSON} disabled={workouts.length === 0} className="h-7 px-3 bg-brand-600 hover:bg-brand-500 disabled:opacity-40 text-white text-[9px] font-semibold rounded transition-all">
                JSON Backup
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
