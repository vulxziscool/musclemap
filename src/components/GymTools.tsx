"use client";

import { useState, useMemo, useEffect } from "react";
import { MUSCLES, MUSCLE_MAP } from "@/lib/muscles";

interface Exercise { name: string; primaryMuscle: string; sets: number; reps: number; weight: string | null; }
interface Workout { id: number; name: string; date: string; duration: number | null; exercises: Exercise[]; }
function pw(w: string | null): number { if (!w) return 0; const n = parseFloat(w.replace(/[^0-9.]/g, "")); return isNaN(n) ? 0 : n; }

interface Props { workouts: Workout[]; }

export default function GymTools({ workouts }: Props) {
  const [tab, setTab] = useState<"plate" | "heatmap" | "notes" | "leaderboard" | "volume">("plate");
  const [targetWeight, setTargetWeight] = useState(135);
  const [barWeight, setBarWeight] = useState(45);
  const [exerciseNotes, setExerciseNotes] = useState<Record<string, string>>({});
  const [noteExercise, setNoteExercise] = useState("");
  const [noteText, setNoteText] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("mm_exercise_notes");
    if (saved) setExerciseNotes(JSON.parse(saved));
  }, []);

  // ── Plate Calculator ──
  const plates = useMemo(() => {
    const perSide = (targetWeight - barWeight) / 2;
    if (perSide <= 0) return [];
    const available = [45, 35, 25, 10, 5, 2.5];
    const result: number[] = [];
    let remaining = perSide;
    for (const plate of available) {
      while (remaining >= plate) { result.push(plate); remaining -= plate; }
    }
    return result;
  }, [targetWeight, barWeight]);

  // ── Muscle Heat Map (30 days) ──
  const heatmap = useMemo(() => {
    const monthAgo = new Date(Date.now() - 30 * 86400000);
    const recent = workouts.filter((w) => new Date(w.date) >= monthAgo);
    const sets: Record<string, number> = {};
    recent.forEach((w) => w.exercises.forEach((e) => {
      sets[e.primaryMuscle] = (sets[e.primaryMuscle] || 0) + e.sets;
    }));
    const max = Math.max(...Object.values(sets), 1);
    return MUSCLES.map((m) => ({ id: m.id, name: m.name, sets: sets[m.id] || 0, pct: Math.round(((sets[m.id] || 0) / max) * 100) })).sort((a, b) => b.sets - a.sets);
  }, [workouts]);

  // ── Exercise Notes ──
  const saveNote = () => {
    if (!noteExercise || !noteText.trim()) return;
    const updated = { ...exerciseNotes, [noteExercise]: noteText.trim() };
    setExerciseNotes(updated);
    localStorage.setItem("mm_exercise_notes", JSON.stringify(updated));
    setNoteText("");
  };
  const deleteNote = (name: string) => {
    const updated = { ...exerciseNotes };
    delete updated[name];
    setExerciseNotes(updated);
    localStorage.setItem("mm_exercise_notes", JSON.stringify(updated));
  };

  // ── Leaderboard (this week vs last week) ──
  const leaderboard = useMemo(() => {
    const now = Date.now();
    const thisWeek = workouts.filter((w) => { const d = new Date(w.date).getTime(); return now - d < 7 * 86400000; });
    const lastWeek = workouts.filter((w) => { const d = new Date(w.date).getTime(); return now - d >= 7 * 86400000 && now - d < 14 * 86400000; });
    const calc = (ws: Workout[]) => ({
      sessions: ws.length,
      sets: ws.reduce((s, w) => s + w.exercises.reduce((a, e) => a + e.sets, 0), 0),
      reps: ws.reduce((s, w) => s + w.exercises.reduce((a, e) => a + e.sets * e.reps, 0), 0),
      volume: ws.reduce((s, w) => s + w.exercises.reduce((a, e) => a + pw(e.weight) * e.sets * e.reps, 0), 0),
      duration: ws.reduce((s, w) => s + (w.duration || 0), 0),
    });
    return { thisWeek: calc(thisWeek), lastWeek: calc(lastWeek) };
  }, [workouts]);

  // ── Volume Per Muscle Per Week (last 8 weeks) ──
  const volumeData = useMemo(() => {
    const weeks: Record<string, Record<string, number>> = {};
    workouts.forEach((w) => {
      const d = new Date(w.date);
      const weekStart = new Date(d);
      weekStart.setDate(d.getDate() - d.getDay());
      const key = weekStart.toISOString().split("T")[0];
      if (!weeks[key]) weeks[key] = {};
      w.exercises.forEach((e) => { weeks[key][e.primaryMuscle] = (weeks[key][e.primaryMuscle] || 0) + e.sets; });
    });
    const sorted = Object.entries(weeks).sort((a, b) => a[0].localeCompare(b[0])).slice(-8);
    return sorted;
  }, [workouts]);

  const TABS = [
    { id: "plate" as const, l: "Plates" },
    { id: "heatmap" as const, l: "Heat Map" },
    { id: "notes" as const, l: "Notes" },
    { id: "leaderboard" as const, l: "vs Last Wk" },
    { id: "volume" as const, l: "Vol/Wk" },
  ];

  return (
    <div className="glass-card rounded-lg lg:rounded-xl overflow-hidden">
      <div className="h-0.5 bg-gradient-to-r from-orange-500 to-transparent" />
      <div className="p-2.5 lg:p-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 lg:w-7 lg:h-7 rounded-md bg-orange-500/10 flex items-center justify-center">
            <svg className="w-3 h-3 lg:w-3.5 lg:h-3.5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><circle cx="12" cy="12" r="3" /></svg>
          </div>
          <div>
            <h3 className="text-white font-semibold text-[11px] lg:text-[14px] tracking-tight">Gym Tools</h3>
            <p className="text-dark-600 text-[8px]">Plate calc, heat map, notes, compare</p>
          </div>
        </div>

        <div className="flex gap-0.5 mb-2 overflow-x-auto no-scrollbar">
          {TABS.map((t) => <button key={t.id} onClick={() => setTab(t.id)} className={`shrink-0 text-[8px] font-medium px-2 py-1 rounded transition-all ${tab === t.id ? "bg-orange-500/15 text-orange-400" : "bg-white/[.03] text-dark-500"}`}>{t.l}</button>)}
        </div>

        {/* PLATE CALCULATOR */}
        {tab === "plate" && (
          <div className="animate-fade-in space-y-2">
            <div className="grid grid-cols-2 gap-1.5">
              <div><label className="text-dark-600 text-[8px] uppercase block mb-0.5">Target Weight</label><input type="number" value={targetWeight} onChange={(e) => setTargetWeight(parseInt(e.target.value) || 0)} onFocus={(e) => e.target.select()} className="input-compact" /></div>
              <div><label className="text-dark-600 text-[8px] uppercase block mb-0.5">Bar Weight</label><select value={barWeight} onChange={(e) => setBarWeight(parseInt(e.target.value))} className="input-field !py-1 !text-[10px]"><option value="45">45 lbs (standard)</option><option value="35">35 lbs (women&apos;s)</option><option value="25">25 lbs (training)</option><option value="15">15 lbs (technique)</option></select></div>
            </div>
            {/* Visual bar */}
            <div className="glass-inset rounded p-2">
              <div className="text-center text-dark-500 text-[8px] mb-1">Each Side: {((targetWeight - barWeight) / 2).toFixed(1)} lbs</div>
              <div className="flex items-center justify-center gap-0.5 h-8">
                {/* Left plates */}
                <div className="flex items-center gap-px flex-row-reverse">
                  {plates.map((p, i) => (
                    <div key={i} className="rounded-sm flex items-center justify-center text-[7px] font-bold text-white" style={{
                      width: p >= 45 ? 10 : p >= 25 ? 8 : 6,
                      height: p >= 45 ? 28 : p >= 25 ? 24 : p >= 10 ? 20 : 16,
                      backgroundColor: p >= 45 ? "#3b82f6" : p >= 35 ? "#eab308" : p >= 25 ? "#22c55e" : p >= 10 ? "#f59e0b" : "#94a3b8",
                    }}>{p}</div>
                  ))}
                </div>
                {/* Bar */}
                <div className="w-12 h-2 bg-dark-400 rounded-full" />
                {/* Right plates */}
                <div className="flex items-center gap-px">
                  {plates.map((p, i) => (
                    <div key={i} className="rounded-sm flex items-center justify-center text-[7px] font-bold text-white" style={{
                      width: p >= 45 ? 10 : p >= 25 ? 8 : 6,
                      height: p >= 45 ? 28 : p >= 25 ? 24 : p >= 10 ? 20 : 16,
                      backgroundColor: p >= 45 ? "#3b82f6" : p >= 35 ? "#eab308" : p >= 25 ? "#22c55e" : p >= 10 ? "#f59e0b" : "#94a3b8",
                    }}>{p}</div>
                  ))}
                </div>
              </div>
              <div className="text-center text-[7px] text-dark-600 mt-1">
                {plates.length === 0 ? "Just the bar" : `Per side: ${plates.join(" + ")} lbs`}
              </div>
            </div>
            {/* Quick buttons */}
            <div className="flex gap-1 flex-wrap justify-center">
              {[95, 135, 185, 225, 275, 315, 365, 405].map((w) => (
                <button key={w} onClick={() => setTargetWeight(w)} className={`text-[8px] font-medium px-2 py-0.5 rounded ${targetWeight === w ? "bg-orange-500/15 text-orange-400" : "bg-white/[.03] text-dark-500"}`}>{w}</button>
              ))}
            </div>
          </div>
        )}

        {/* MUSCLE HEAT MAP */}
        {tab === "heatmap" && (
          <div className="animate-fade-in">
            <div className="text-dark-500 text-[8px] uppercase tracking-wider font-medium mb-1">30-Day Muscle Heat Map (sets)</div>
            <div className="space-y-0.5">
              {heatmap.map((m) => (
                <div key={m.id} className="flex items-center gap-1.5">
                  <span className="text-[8px] text-dark-400 w-16 truncate">{m.name}</span>
                  <div className="flex-1 bar-track !h-[5px]">
                    <div className="bar-fill" style={{
                      width: `${m.pct}%`,
                      backgroundColor: m.pct >= 80 ? "#ef4444" : m.pct >= 60 ? "#f59e0b" : m.pct >= 30 ? "#22c55e" : m.pct > 0 ? "#3b82f6" : "#334155",
                    }} />
                  </div>
                  <span className={`text-[8px] w-5 text-right tabular-nums font-medium ${m.sets === 0 ? "text-dark-700" : "text-dark-400"}`}>{m.sets}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-2 mt-1.5 text-[7px] text-dark-600">
              <span><span className="inline-block w-2 h-2 rounded-sm bg-red-500 mr-0.5" />Hot</span>
              <span><span className="inline-block w-2 h-2 rounded-sm bg-amber-500 mr-0.5" />Warm</span>
              <span><span className="inline-block w-2 h-2 rounded-sm bg-green-500 mr-0.5" />Moderate</span>
              <span><span className="inline-block w-2 h-2 rounded-sm bg-blue-500 mr-0.5" />Light</span>
              <span><span className="inline-block w-2 h-2 rounded-sm bg-dark-700 mr-0.5" />None</span>
            </div>
          </div>
        )}

        {/* EXERCISE NOTES */}
        {tab === "notes" && (
          <div className="animate-fade-in space-y-1.5">
            <div className="flex gap-1">
              <input type="text" value={noteExercise} onChange={(e) => setNoteExercise(e.target.value)} placeholder="Exercise name" className="input-field flex-1 !text-[10px] !py-1" />
            </div>
            <div className="flex gap-1">
              <input type="text" value={noteText} onChange={(e) => setNoteText(e.target.value)} placeholder="Your note (form cue, grip, etc.)" className="input-field flex-1 !text-[10px] !py-1" />
              <button onClick={saveNote} className="h-7 px-2 bg-orange-600 text-white text-[8px] font-semibold rounded shrink-0">Save</button>
            </div>
            {Object.keys(exerciseNotes).length === 0 ? <div className="text-dark-600 text-[9px] text-center py-2">No notes yet. Add form cues, grip tips, etc.</div> : (
              <div className="space-y-0.5 max-h-32 overflow-y-auto scrollbar-thin">
                {Object.entries(exerciseNotes).map(([name, note]) => (
                  <div key={name} className="glass-inset rounded p-1.5 flex items-start justify-between gap-1">
                    <div className="min-w-0"><div className="text-white text-[9px] font-medium truncate">{name}</div><div className="text-dark-500 text-[8px]">{note}</div></div>
                    <button onClick={() => deleteNote(name)} className="text-dark-700 hover:text-red-400 shrink-0 mt-0.5"><svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* LEADERBOARD */}
        {tab === "leaderboard" && (
          <div className="animate-fade-in">
            <div className="text-dark-500 text-[8px] uppercase tracking-wider font-medium mb-1.5 text-center">This Week vs Last Week</div>
            {[
              { l: "Sessions", a: leaderboard.thisWeek.sessions, b: leaderboard.lastWeek.sessions },
              { l: "Total Sets", a: leaderboard.thisWeek.sets, b: leaderboard.lastWeek.sets },
              { l: "Total Reps", a: leaderboard.thisWeek.reps, b: leaderboard.lastWeek.reps },
              { l: "Volume (lbs)", a: leaderboard.thisWeek.volume, b: leaderboard.lastWeek.volume },
              { l: "Time (min)", a: leaderboard.thisWeek.duration, b: leaderboard.lastWeek.duration },
            ].map((r) => {
              const better = r.a > r.b;
              const same = r.a === r.b;
              const fmt = (v: number) => v > 9999 ? `${(v/1000).toFixed(1)}K` : v.toLocaleString();
              return (
                <div key={r.l} className="grid grid-cols-3 gap-1 py-0.5">
                  <div className={`text-right text-[10px] font-bold tabular-nums ${better ? "text-green-400" : same ? "text-white" : "text-dark-400"}`}>{fmt(r.a)}{better ? " ▲" : ""}</div>
                  <div className="text-center text-[8px] text-dark-600 flex items-center justify-center">{r.l}</div>
                  <div className={`text-left text-[10px] font-bold tabular-nums ${!better && !same ? "text-green-400" : same ? "text-white" : "text-dark-400"}`}>{!better && !same ? "▲ " : ""}{fmt(r.b)}</div>
                </div>
              );
            })}
            <div className="grid grid-cols-3 text-[7px] text-dark-700 mt-1 text-center">
              <span>This Week</span><span></span><span>Last Week</span>
            </div>
          </div>
        )}

        {/* VOLUME PER WEEK */}
        {tab === "volume" && (
          <div className="animate-fade-in">
            <div className="text-dark-500 text-[8px] uppercase tracking-wider font-medium mb-1">Weekly Sets Per Muscle (8 weeks)</div>
            {volumeData.length === 0 ? <div className="text-dark-600 text-[9px] text-center py-3">Log more workouts to see weekly volume trends</div> : (
              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-[7px]">
                  <thead><tr><th className="text-left text-dark-600 pb-0.5 w-14">Muscle</th>{volumeData.map(([wk]) => <th key={wk} className="text-center text-dark-700 pb-0.5 w-6">{wk.slice(5)}</th>)}</tr></thead>
                  <tbody>
                    {MUSCLES.slice(0, 10).map((m) => (
                      <tr key={m.id}>
                        <td className="text-dark-400 truncate pr-1">{m.name.split("/")[0].split("(")[0].trim()}</td>
                        {volumeData.map(([wk, data]) => {
                          const v = data[m.id] || 0;
                          return <td key={wk} className="text-center"><span className={`inline-block w-4 rounded-sm text-[6px] font-bold ${v >= 15 ? "bg-red-500/30 text-red-400" : v >= 10 ? "bg-amber-500/20 text-amber-400" : v > 0 ? "bg-green-500/15 text-green-400" : "text-dark-800"}`}>{v || "·"}</span></td>;
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
