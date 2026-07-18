"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { MUSCLES, MUSCLE_MAP } from "@/lib/muscles";

interface Exercise { name: string; primaryMuscle: string; secondaryMuscles: string[]; sets: number; reps: number; weight: string | null; }
interface Workout { id: number; name: string; date: string; duration: number | null; exercises: Exercise[]; notes: string | null; }
function pw(w: string | null): number { if (!w) return 0; const n = parseFloat(w.replace(/[^0-9.]/g, "")); return isNaN(n) ? 0 : n; }

interface Props { workouts: Workout[]; }

// ─── VIDEO LINKS ───
const VIDEOS: Record<string, string> = {
  "Bench Press": "https://youtube.com/results?search_query=bench+press+form+guide",
  "Back Squats": "https://youtube.com/results?search_query=barbell+back+squat+form",
  "Deadlifts": "https://youtube.com/results?search_query=deadlift+form+guide",
  "Pull-Ups": "https://youtube.com/results?search_query=pull+up+form+guide",
  "Military Press": "https://youtube.com/results?search_query=overhead+press+form",
  "Dips": "https://youtube.com/results?search_query=dips+form+guide",
  "Barbell Curls": "https://youtube.com/results?search_query=barbell+curl+form",
  "Romanian Deadlifts": "https://youtube.com/results?search_query=romanian+deadlift+form",
  "Bent-Over Rows": "https://youtube.com/results?search_query=barbell+row+form",
  "Hip Thrusts": "https://youtube.com/results?search_query=hip+thrust+form+guide",
  "Lat Pulldowns": "https://youtube.com/results?search_query=lat+pulldown+form",
  "Cable Rows": "https://youtube.com/results?search_query=cable+row+form",
  "Dumbbell Curls": "https://youtube.com/results?search_query=dumbbell+curl+form",
  "Lateral Raises": "https://youtube.com/results?search_query=lateral+raise+form",
  "Skull Crushers": "https://youtube.com/results?search_query=skull+crusher+form",
  "Face Pulls": "https://youtube.com/results?search_query=face+pull+form",
  "Front Squats": "https://youtube.com/results?search_query=front+squat+form",
  "Push-Ups": "https://youtube.com/results?search_query=push+up+proper+form",
  "Incline Bench Press": "https://youtube.com/results?search_query=incline+bench+press+form",
  "Dumbbell Shoulder Press": "https://youtube.com/results?search_query=dumbbell+shoulder+press+form",
};

function getVideoUrl(name: string): string {
  return VIDEOS[name] || `https://youtube.com/results?search_query=${encodeURIComponent(name + " exercise form guide")}`;
}

export default function ProFeatures({ workouts }: Props) {
  const [tab, setTab] = useState<"tonnage" | "fatigue" | "period" | "compare" | "videos" | "ratings">("tonnage");
  const [compareA, setCompareA] = useState<number | "">("");
  const [compareB, setCompareB] = useState<number | "">("");
  const [ratings, setRatings] = useState<Record<number, { stars: number; difficulty: number }>>({});

  useEffect(() => {
    const r = localStorage.getItem("mm_ratings");
    if (r) setRatings(JSON.parse(r));
  }, []);

  const saveRating = useCallback((wid: number, stars: number, difficulty: number) => {
    const updated = { ...ratings, [wid]: { stars, difficulty } };
    setRatings(updated);
    localStorage.setItem("mm_ratings", JSON.stringify(updated));
  }, [ratings]);

  // ── Tonnage per muscle (weekly) ──
  const tonnage = useMemo(() => {
    const weekAgo = new Date(Date.now() - 7 * 86400000);
    const week = workouts.filter((w) => new Date(w.date) >= weekAgo);
    const map: Record<string, number> = {};
    week.forEach((w) => w.exercises.forEach((e) => {
      const vol = pw(e.weight) * e.sets * e.reps;
      map[e.primaryMuscle] = (map[e.primaryMuscle] || 0) + vol;
      e.secondaryMuscles.forEach((s) => { map[s] = (map[s] || 0) + Math.ceil(vol * 0.5); });
    }));
    return Object.entries(map).map(([id, vol]) => ({ id, name: MUSCLE_MAP[id]?.name || id, vol })).sort((a, b) => b.vol - a.vol);
  }, [workouts]);
  const maxTonnage = tonnage[0]?.vol || 1;

  // ── Fatigue / Volume warnings ──
  const fatigue = useMemo(() => {
    const weekAgo = new Date(Date.now() - 7 * 86400000);
    const week = workouts.filter((w) => new Date(w.date) >= weekAgo);
    const sets: Record<string, number> = {};
    week.forEach((w) => w.exercises.forEach((e) => {
      sets[e.primaryMuscle] = (sets[e.primaryMuscle] || 0) + e.sets;
    }));
    // Volume landmarks & warnings
    const warnings: { muscle: string; sets: number; level: "ok" | "high" | "danger" }[] = [];
    Object.entries(sets).forEach(([id, s]) => {
      const name = MUSCLE_MAP[id]?.name || id;
      const level = s > 25 ? "danger" : s > 18 ? "high" : "ok";
      warnings.push({ muscle: name, sets: s, level });
    });
    return warnings.sort((a, b) => b.sets - a.sets);
  }, [workouts]);

  // ── Volume landmarks ──
  const landmarks = useMemo(() => {
    const monthAgo = new Date(Date.now() - 30 * 86400000);
    const month = workouts.filter((w) => new Date(w.date) >= monthAgo);
    const sets: Record<string, number> = {};
    month.forEach((w) => w.exercises.forEach((e) => { sets[e.primaryMuscle] = (sets[e.primaryMuscle] || 0) + e.sets; }));
    return Object.entries(sets).filter(([, s]) => s >= 50).map(([id, s]) => ({ name: MUSCLE_MAP[id]?.name || id, sets: s })).sort((a, b) => b.sets - a.sets);
  }, [workouts]);

  // ── Periodization ──
  const periodization = useMemo(() => {
    if (workouts.length < 4) return null;
    const sorted = [...workouts].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const first = new Date(sorted[0].date);
    const weeksSinceStart = Math.floor((Date.now() - first.getTime()) / (7 * 86400000));
    const weeksSinceDeload = weeksSinceStart % 5;
    const shouldDeload = weeksSinceDeload >= 4;
    const weeksUntilDeload = shouldDeload ? 0 : 4 - weeksSinceDeload;
    return { weeksSinceStart, shouldDeload, weeksUntilDeload, totalWorkouts: workouts.length };
  }, [workouts]);

  // ── Compare ──
  const wA = typeof compareA === "number" ? workouts.find((w) => w.id === compareA) : null;
  const wB = typeof compareB === "number" ? workouts.find((w) => w.id === compareB) : null;
  const calcVol = (w: Workout) => w.exercises.reduce((s, e) => s + pw(e.weight) * e.sets * e.reps, 0);
  const calcSets = (w: Workout) => w.exercises.reduce((s, e) => s + e.sets, 0);

  const TABS = [
    { id: "tonnage" as const, l: "Tonnage" }, { id: "fatigue" as const, l: "Fatigue" },
    { id: "period" as const, l: "Deload" }, { id: "compare" as const, l: "Compare" },
    { id: "videos" as const, l: "Videos" }, { id: "ratings" as const, l: "Rate" },
  ];

  return (
    <div className="glass-card rounded-lg lg:rounded-xl overflow-hidden">
      <div className="h-0.5 bg-gradient-to-r from-rose-500 to-transparent" />
      <div className="p-2.5 lg:p-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 lg:w-7 lg:h-7 rounded-md bg-rose-500/10 flex items-center justify-center">
            <svg className="w-3 h-3 lg:w-3.5 lg:h-3.5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
          </div>
          <div>
            <h3 className="text-white font-semibold text-[11px] lg:text-[14px] tracking-tight">Pro Analytics</h3>
            <p className="text-dark-600 text-[8px]">Tonnage, fatigue, deload, compare, videos, ratings</p>
          </div>
        </div>

        <div className="flex gap-0.5 mb-2 overflow-x-auto no-scrollbar">
          {TABS.map((t) => <button key={t.id} onClick={() => setTab(t.id)} className={`shrink-0 text-[8px] font-medium px-2 py-1 rounded transition-all ${tab === t.id ? "bg-rose-500/15 text-rose-400" : "bg-white/[.03] text-dark-500"}`}>{t.l}</button>)}
        </div>

        {/* TONNAGE */}
        {tab === "tonnage" && (
          <div className="animate-fade-in">
            <div className="text-dark-500 text-[8px] uppercase tracking-wider font-medium mb-1">Weekly Tonnage by Muscle (lbs)</div>
            {tonnage.length === 0 ? <div className="text-dark-600 text-[9px] text-center py-3">Log workouts with weights to see tonnage</div> : (
              <div className="space-y-0.5 max-h-40 overflow-y-auto scrollbar-thin">
                {tonnage.map((t) => (
                  <div key={t.id} className="flex items-center gap-1.5">
                    <span className="text-[8px] text-dark-400 w-16 truncate">{t.name}</span>
                    <div className="flex-1 bar-track !h-[4px]"><div className="bar-fill bg-rose-500" style={{ width: `${(t.vol / maxTonnage) * 100}%` }} /></div>
                    <span className="text-[8px] text-dark-500 w-10 text-right tabular-nums">{t.vol > 999 ? `${(t.vol / 1000).toFixed(1)}K` : t.vol}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* FATIGUE */}
        {tab === "fatigue" && (
          <div className="animate-fade-in space-y-1.5">
            <div className="text-dark-500 text-[8px] uppercase tracking-wider font-medium">Weekly Sets per Muscle</div>
            <div className="text-dark-600 text-[7px] mb-1">🟢 OK (&lt;18) · 🟡 High (18-25) · 🔴 Danger (&gt;25)</div>
            {fatigue.length === 0 ? <div className="text-dark-600 text-[9px] text-center py-2">No data yet</div> : (
              <div className="space-y-0.5 max-h-32 overflow-y-auto scrollbar-thin">
                {fatigue.map((f) => (
                  <div key={f.muscle} className={`flex items-center justify-between glass-inset rounded px-1.5 py-0.5 ${f.level === "danger" ? "!border-red-500/20" : f.level === "high" ? "!border-amber-500/20" : ""}`}>
                    <span className="text-[8px] text-dark-300">{f.muscle}</span>
                    <span className={`text-[9px] font-bold tabular-nums ${f.level === "danger" ? "text-red-400" : f.level === "high" ? "text-amber-400" : "text-green-400"}`}>{f.sets} sets</span>
                  </div>
                ))}
              </div>
            )}
            {landmarks.length > 0 && (
              <div className="glass-inset rounded p-1.5">
                <div className="text-amber-400 text-[8px] font-medium mb-0.5">Volume Landmarks (30d)</div>
                {landmarks.map((l) => <div key={l.name} className="text-[8px] text-dark-400">🏆 {l.name}: <span className="text-white font-semibold">{l.sets} sets</span> this month</div>)}
              </div>
            )}
          </div>
        )}

        {/* PERIODIZATION */}
        {tab === "period" && (
          <div className="animate-fade-in text-center py-2 space-y-2">
            {!periodization ? <div className="text-dark-600 text-[9px]">Need 4+ workouts for deload planning</div> : (
              <>
                <div className={`text-base font-bold ${periodization.shouldDeload ? "text-amber-400" : "text-green-400"}`}>
                  {periodization.shouldDeload ? "Deload Week Recommended" : "Keep Training Hard"}
                </div>
                <div className="text-dark-400 text-[9px]">
                  {periodization.shouldDeload
                    ? "You've been training hard for 4+ weeks. Reduce volume by 40-50% this week to allow supercompensation."
                    : `${periodization.weeksUntilDeload} week${periodization.weeksUntilDeload !== 1 ? "s" : ""} until next deload`}
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <div className="glass-inset rounded p-1.5 text-center"><div className="text-white text-[11px] font-bold">{periodization.weeksSinceStart}</div><div className="text-dark-700 text-[6px] uppercase">Weeks Training</div></div>
                  <div className="glass-inset rounded p-1.5 text-center"><div className="text-white text-[11px] font-bold">{periodization.totalWorkouts}</div><div className="text-dark-700 text-[6px] uppercase">Total Workouts</div></div>
                </div>
                {periodization.shouldDeload && (
                  <div className="glass-inset rounded p-2 text-left">
                    <div className="text-dark-500 text-[8px] font-medium mb-1">Deload Tips:</div>
                    <div className="space-y-0.5 text-[8px] text-dark-400">
                      <div>• Keep same exercises, reduce weight by 40-50%</div>
                      <div>• Cut sets by half (e.g. 4 sets → 2 sets)</div>
                      <div>• Focus on mobility and technique</div>
                      <div>• Sleep extra and eat at maintenance</div>
                      <div>• Return to full intensity next week</div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* COMPARE */}
        {tab === "compare" && (
          <div className="animate-fade-in space-y-1.5">
            <div className="grid grid-cols-2 gap-1">
              <select value={compareA} onChange={(e) => setCompareA(e.target.value ? parseInt(e.target.value) : "")} className="input-field !py-1 !text-[9px]">
                <option value="">Workout A...</option>
                {workouts.map((w) => <option key={w.id} value={w.id}>{w.name} ({w.date.slice(5)})</option>)}
              </select>
              <select value={compareB} onChange={(e) => setCompareB(e.target.value ? parseInt(e.target.value) : "")} className="input-field !py-1 !text-[9px]">
                <option value="">Workout B...</option>
                {workouts.map((w) => <option key={w.id} value={w.id}>{w.name} ({w.date.slice(5)})</option>)}
              </select>
            </div>
            {wA && wB && (
              <div className="glass-inset rounded p-2">
                <div className="grid grid-cols-3 gap-1 text-center text-[8px] mb-1">
                  <div className="text-dark-300 font-medium truncate">{wA.name}</div>
                  <div className="text-dark-600">vs</div>
                  <div className="text-dark-300 font-medium truncate">{wB.name}</div>
                </div>
                {[
                  { l: "Exercises", a: wA.exercises.length, b: wB.exercises.length },
                  { l: "Sets", a: calcSets(wA), b: calcSets(wB) },
                  { l: "Volume", a: calcVol(wA), b: calcVol(wB) },
                  { l: "Duration", a: wA.duration || 0, b: wB.duration || 0 },
                ].map((r) => (
                  <div key={r.l} className="grid grid-cols-3 gap-1 text-center py-0.5">
                    <div className={`text-[9px] font-bold tabular-nums ${r.a > r.b ? "text-green-400" : r.a < r.b ? "text-red-400" : "text-white"}`}>{typeof r.a === "number" && r.a > 999 ? `${(r.a / 1000).toFixed(1)}K` : r.a}</div>
                    <div className="text-dark-600 text-[7px] uppercase">{r.l}</div>
                    <div className={`text-[9px] font-bold tabular-nums ${r.b > r.a ? "text-green-400" : r.b < r.a ? "text-red-400" : "text-white"}`}>{typeof r.b === "number" && r.b > 999 ? `${(r.b / 1000).toFixed(1)}K` : r.b}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIDEOS */}
        {tab === "videos" && (
          <div className="animate-fade-in">
            <div className="text-dark-500 text-[8px] uppercase tracking-wider font-medium mb-1">Exercise Form Guides</div>
            <div className="space-y-0.5 max-h-44 overflow-y-auto scrollbar-thin">
              {Object.keys(VIDEOS).map((name) => (
                <a key={name} href={getVideoUrl(name)} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-between glass-inset rounded p-1.5 hover:bg-white/[.03] transition-all">
                  <span className="text-dark-300 text-[9px] font-medium">{name}</span>
                  <span className="text-rose-400 text-[7px] font-medium flex items-center gap-0.5">
                    <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Watch
                  </span>
                </a>
              ))}
            </div>
            <div className="text-dark-600 text-[7px] text-center mt-1">Tap any exercise in your workout history to find its form guide</div>
          </div>
        )}

        {/* RATINGS */}
        {tab === "ratings" && (
          <div className="animate-fade-in">
            <div className="text-dark-500 text-[8px] uppercase tracking-wider font-medium mb-1">Rate Your Workouts</div>
            {workouts.length === 0 ? <div className="text-dark-600 text-[9px] text-center py-3">Log workouts to rate them</div> : (
              <div className="space-y-1 max-h-48 overflow-y-auto scrollbar-thin">
                {workouts.slice(0, 10).map((w) => {
                  const r = ratings[w.id] || { stars: 0, difficulty: 0 };
                  return (
                    <div key={w.id} className="glass-inset rounded p-1.5">
                      <div className="text-dark-300 text-[9px] font-medium truncate mb-1">{w.name} <span className="text-dark-600">· {w.date.slice(5)}</span></div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1">
                          <div className="text-dark-600 text-[7px] mb-0.5">Rating</div>
                          <div className="flex gap-px">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <button key={s} onClick={() => saveRating(w.id, s, r.difficulty)} className={`text-[12px] transition-all ${s <= r.stars ? "text-yellow-400" : "text-dark-700"}`}>★</button>
                            ))}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="text-dark-600 text-[7px] mb-0.5">Difficulty</div>
                          <div className="flex gap-px">
                            {[1, 2, 3, 4, 5].map((d) => (
                              <button key={d} onClick={() => saveRating(w.id, r.stars, d)} className={`w-4 h-4 rounded text-[7px] font-bold transition-all ${d <= r.difficulty ? "bg-red-500/20 text-red-400" : "bg-white/[.03] text-dark-700"}`}>{d}</button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
