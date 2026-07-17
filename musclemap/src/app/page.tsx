"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import BodyMapFront from "@/components/BodyMapFront";
import BodyMapBack from "@/components/BodyMapBack";
import MuscleInspector from "@/components/MuscleInspector";
import RecoveryRadar from "@/components/RecoveryRadar";
import WorkoutLogger from "@/components/WorkoutLogger";
import WorkoutCard from "@/components/WorkoutCard";
import ProgressCharts from "@/components/ProgressCharts";
import PersonalProfile from "@/components/PersonalProfile";
import CardioTracker from "@/components/CardioTracker";
import CalorieCounter from "@/components/CalorieCounter";
import AIAssistant from "@/components/AIAssistant";
import DeviceSync from "@/components/DeviceSync";
import { RecoveryState, MUSCLE_MAP, REGIONS, type RegionId } from "@/lib/muscles";

interface Exercise { id: number; name: string; primaryMuscle: string; secondaryMuscles: string[]; sets: number; reps: number; weight: string | null; restTime: number | null; equipment: string | null; }
interface Workout { id: number; name: string; date: string; time: string | null; duration: number | null; notes: string | null; exercises: Exercise[]; }
type FilterId = "all" | RegionId;
type MobileTab = "map" | "workouts" | "progress" | "nutrition" | "more";

export default function DashboardPage() {
  const [recovery, setRecovery] = useState<Record<string, RecoveryState>>({});
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [view, setView] = useState<"front" | "back">("front");
  const [hoveredMuscle, setHoveredMuscle] = useState<string | null>(null);
  const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);
  const [selectedWorkout, setSelectedWorkout] = useState<number | null>(null);
  const [showLogger, setShowLogger] = useState(false);
  const [preselectedMuscle, setPreselectedMuscle] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterId>("all");
  const [showRadar, setShowRadar] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mobileTab, setMobileTab] = useState<MobileTab>("map");

  const fetchRecovery = useCallback(async () => {
    try { const r = await fetch("/api/recovery"); if (r.ok) { const d: RecoveryState[] = await r.json(); const m: Record<string, RecoveryState> = {}; d.forEach((x) => { m[x.muscleId] = x; }); setRecovery(m); } } catch { /* */ }
  }, []);
  const fetchWorkouts = useCallback(async () => {
    try { const r = await fetch("/api/workouts"); if (r.ok) setWorkouts(await r.json()); } catch { /* */ } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetch("/api/setup").finally(() => { fetchRecovery(); fetchWorkouts(); }); }, [fetchRecovery, fetchWorkouts]);
  useEffect(() => { const id = setInterval(fetchRecovery, 30000); return () => clearInterval(id); }, [fetchRecovery]);

  const handleMuscleClick = (id: string) => { setSelectedMuscle((p) => (p === id ? null : id)); setSelectedWorkout(null); };
  const handleTrain = (muscleId: string) => { setPreselectedMuscle(muscleId); setShowLogger(true); setSelectedMuscle(null); setMobileTab("workouts"); };
  const handleWorkoutSelect = (wid: number) => { if (selectedWorkout === wid) setSelectedWorkout(null); else { setSelectedWorkout(wid); setSelectedMuscle(null); setMobileTab("map"); } };
  const handleDelete = async (id: number) => { if (!confirm("Delete this workout?")) return; try { await fetch(`/api/workouts/${id}`, { method: "DELETE" }); setWorkouts((p) => p.filter((w) => w.id !== id)); if (selectedWorkout === id) setSelectedWorkout(null); fetchRecovery(); } catch { /* */ } };
  const loadDemo = async () => { setLoading(true); try { await fetch("/api/demo", { method: "POST" }); await fetchWorkouts(); await fetchRecovery(); } catch { /* */ } finally { setLoading(false); } };
  const handleSaved = () => { setShowLogger(false); setPreselectedMuscle(null); fetchWorkouts(); fetchRecovery(); };

  const dimmedMuscles = useMemo(() => { if (filter === "all") return undefined; const a = REGIONS.find((r) => r.id === filter)?.muscles || []; return new Set(Object.keys(MUSCLE_MAP).filter((id) => !a.includes(id))); }, [filter]);
  const highlightedMuscles = useMemo(() => { if (!selectedWorkout) return undefined; const w = workouts.find((w) => w.id === selectedWorkout); if (!w) return undefined; const r: Record<string, "primary" | "secondary"> = {}; for (const e of w.exercises) { r[e.primaryMuscle] = "primary"; for (const s of e.secondaryMuscles) { if (!r[s]) r[s] = "secondary"; } } return r; }, [selectedWorkout, workouts]);

  const now = new Date();
  const weekStart = new Date(now); weekStart.setDate(now.getDate() - now.getDay()); weekStart.setHours(0, 0, 0, 0);
  const weekWorkouts = workouts.filter((w) => new Date(w.date) >= weekStart);
  const totalVolume = weekWorkouts.reduce((s, w) => s + w.exercises.reduce((a, e) => a + e.sets * e.reps, 0), 0);
  const recoveringCount = Object.values(recovery).filter((r) => r.status === "just_trained" || r.status === "recovering" || r.status === "almost_ready").length;
  const readyCount = Object.values(recovery).filter((r) => r.status === "fully_recovered" || r.status === "not_trained").length;

  const FILTERS: { id: FilterId; label: string }[] = [{ id: "all", label: "All" }, { id: "upper_push", label: "Push" }, { id: "upper_pull", label: "Pull" }, { id: "lower_body", label: "Legs" }, { id: "core", label: "Core" }];

  const TABS: { id: MobileTab; label: string; icon: React.ReactNode }[] = [
    { id: "map", label: "Map", icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> },
    { id: "workouts", label: "Workouts", icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg> },
    { id: "nutrition", label: "Nutrition", icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /></svg> },
    { id: "progress", label: "Progress", icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg> },
    { id: "more", label: "More", icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" /></svg> },
  ];

  return (
    <div className="min-h-screen pb-20 lg:pb-0">
      {/* ─── DESKTOP HEADER ─── */}
      <header className="sticky top-0 z-50 glass border-b border-white/[.03] hidden lg:block">
        <div className="max-w-[1440px] mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>
            </div>
            <div><h1 className="text-white font-semibold text-[15px] tracking-tight leading-none">MuscleMap</h1><p className="text-dark-600 text-[10px] font-medium tracking-widest uppercase mt-0.5">Recovery Tracker</p></div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowRadar(!showRadar)} className={`h-8 px-3.5 rounded-lg text-[12px] font-medium transition-all flex items-center gap-1.5 ${showRadar ? "bg-brand-600 text-white" : "text-dark-400 hover:text-dark-200 hover:bg-white/[.04]"}`}>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728M9.172 14.828a4 4 0 010-5.656m5.656 0a4 4 0 010 5.656M12 12h.01" /></svg>Radar
            </button>
            <button onClick={() => { setShowLogger(true); setPreselectedMuscle(null); }} className="h-8 px-4 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-[12px] font-semibold transition-all active:scale-[0.97] flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>Log Workout
            </button>
          </div>
        </div>
      </header>

      {/* ─── MOBILE HEADER ─── */}
      <header className="sticky top-0 z-50 glass border-b border-white/[.03] lg:hidden">
        <div className="px-4 h-12 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-brand-600 flex items-center justify-center"><svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg></div>
            <span className="text-white font-semibold text-[14px] tracking-tight">MuscleMap</span>
          </div>
          <button onClick={() => { setShowLogger(true); setPreselectedMuscle(null); setMobileTab("workouts"); }} className="h-7 px-3 bg-brand-600 text-white rounded-md text-[11px] font-semibold flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>Log
          </button>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto px-4 lg:px-6 py-3 lg:py-5">
        {/* ─── STATS ─── */}
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-2 lg:gap-3 mb-4 lg:mb-5">
          {[
            { l: "This Week", v: weekWorkouts.length },
            { l: "Total", v: workouts.length },
            { l: "Volume", v: totalVolume > 999 ? `${(totalVolume/1000).toFixed(1)}k` : String(totalVolume) },
            { l: "Healing", v: recoveringCount },
            { l: "Ready", v: readyCount },
            { l: "Exercises", v: workouts.reduce((s, w) => s + w.exercises.length, 0) },
          ].map((s, i) => (
            <div key={s.l} className={`glass-card rounded-xl p-2.5 lg:p-4 ${i > 2 ? "hidden lg:block" : ""}`}>
              <div className="text-white font-bold text-lg lg:text-xl tabular-nums leading-none">{s.v}</div>
              <div className="text-dark-600 text-[9px] lg:text-[10px] font-medium uppercase tracking-wider mt-1">{s.l}</div>
            </div>
          ))}
        </div>

        {/* ─── DESKTOP LAYOUT ─── */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-5">
          {/* Left: Workouts */}
          <div className="lg:col-span-3 space-y-3 min-w-0">
            {showLogger ? (
              <div className="glass-card rounded-xl p-4 max-h-[78vh] overflow-y-auto scrollbar-thin">
                <WorkoutLogger preselectedMuscle={preselectedMuscle} onSaved={handleSaved} onCancel={() => { setShowLogger(false); setPreselectedMuscle(null); }} />
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between"><h3 className="text-dark-300 font-semibold text-[13px] uppercase tracking-wider">Recent Workouts</h3><span className="text-dark-600 text-[11px] tabular-nums">{workouts.length}</span></div>
                {loading ? <div className="glass-card rounded-xl p-8 text-center"><div className="w-6 h-6 border-2 border-brand-500/30 border-t-brand-500 rounded-full mx-auto animate-spin" /></div>
                : workouts.length === 0 ? (
                  <div className="glass-card rounded-xl p-6 text-center">
                    <h4 className="text-white font-semibold text-sm mb-1">Welcome to MuscleMap</h4>
                    <p className="text-dark-500 text-xs mb-4">Log workouts to visualize recovery.</p>
                    <div className="space-y-2"><button onClick={() => setShowLogger(true)} className="w-full h-9 bg-brand-600 text-white rounded-lg text-xs font-semibold">Log First Workout</button><button onClick={loadDemo} className="w-full h-9 glass-light text-dark-400 rounded-lg text-xs font-medium">Load Demo Data</button></div>
                  </div>
                ) : <div className="space-y-2 max-h-[70vh] overflow-y-auto scrollbar-thin">{workouts.map((w) => <WorkoutCard key={w.id} workout={w} isSelected={selectedWorkout === w.id} onSelect={() => handleWorkoutSelect(w.id)} onDelete={handleDelete} />)}</div>}
              </>
            )}
          </div>

          {/* Center: Body Map */}
          <div className="lg:col-span-5">
            <div className="glass-card rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="pill-group">{FILTERS.map((f) => <button key={f.id} onClick={() => setFilter(f.id)} className={`pill-btn ${filter === f.id ? "active" : ""}`}>{f.label}</button>)}</div>
                <div className="pill-group"><button onClick={() => setView("front")} className={`pill-btn ${view === "front" ? "active" : ""}`}>Front</button><button onClick={() => setView("back")} className={`pill-btn ${view === "back" ? "active" : ""}`}>Back</button></div>
              </div>
              {selectedWorkout && <div className="text-center mb-2 animate-fade-in"><span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-orange-300 bg-orange-500/8 border border-orange-500/10 px-2.5 py-1 rounded-full"><span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />{workouts.find((w) => w.id === selectedWorkout)?.name}</span></div>}
              <div className="body-map-container flex justify-center"><div className="w-full max-w-[300px] body-flip-enter" key={view}>{view === "front" ? <BodyMapFront recovery={recovery} hoveredMuscle={hoveredMuscle} onHover={setHoveredMuscle} onClick={handleMuscleClick} dimmedMuscles={dimmedMuscles} highlightedMuscles={highlightedMuscles} /> : <BodyMapBack recovery={recovery} hoveredMuscle={hoveredMuscle} onHover={setHoveredMuscle} onClick={handleMuscleClick} dimmedMuscles={dimmedMuscles} highlightedMuscles={highlightedMuscles} />}</div></div>
              {hoveredMuscle && MUSCLE_MAP[hoveredMuscle] && <div className="text-center mt-1.5 animate-fade-in"><span className="text-[13px] font-medium text-white">{MUSCLE_MAP[hoveredMuscle].name}</span>{recovery[hoveredMuscle] && <span className="text-[11px] text-dark-500 ml-2">{recovery[hoveredMuscle].percentage}%</span>}</div>}
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-3 pt-3 border-t border-white/[.03]">{[{ c: "#ef4444", l: "Trained" }, { c: "#f59e0b", l: "Recovering" }, { c: "#22c55e", l: "Almost" }, { c: "#3b82f6", l: "Ready" }, { c: "#6b7280", l: "Untrained" }].map((i) => <div key={i.l} className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: i.c }} /><span className="text-[10px] text-dark-600">{i.l}</span></div>)}</div>
            </div>
          </div>

          {/* Right */}
          <div className="lg:col-span-4 space-y-4">
            <PersonalProfile />
            {selectedMuscle && <MuscleInspector muscleId={selectedMuscle} recovery={recovery[selectedMuscle] || null} onTrain={handleTrain} />}
            {showRadar && <RecoveryRadar recovery={recovery} />}
            {!selectedMuscle && !showRadar && <div className="glass-card rounded-xl p-5 text-center"><p className="text-dark-500 text-xs">Select a muscle on the body map to view recovery details.</p></div>}
            <AIAssistant />
            <ProgressCharts />
            <CardioTracker />
            <CalorieCounter />
            <DeviceSync />
          </div>
        </div>

        {/* ─── MOBILE LAYOUT ─── */}
        <div className="lg:hidden">
          {mobileTab === "map" && (
            <div className="space-y-3 animate-fade-in">
              <div className="glass-card rounded-xl p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="pill-group">{FILTERS.map((f) => <button key={f.id} onClick={() => setFilter(f.id)} className={`pill-btn ${filter === f.id ? "active" : ""}`}>{f.label}</button>)}</div>
                  <div className="pill-group"><button onClick={() => setView("front")} className={`pill-btn ${view === "front" ? "active" : ""}`}>Front</button><button onClick={() => setView("back")} className={`pill-btn ${view === "back" ? "active" : ""}`}>Back</button></div>
                </div>
                {selectedWorkout && <div className="text-center mb-2 animate-fade-in"><span className="inline-flex items-center gap-1 text-[10px] font-medium text-orange-300 bg-orange-500/8 px-2 py-0.5 rounded-full"><span className="w-1 h-1 rounded-full bg-orange-400" />{workouts.find((w) => w.id === selectedWorkout)?.name}</span></div>}
                <div className="body-map-container flex justify-center"><div className="w-full max-w-[260px] body-flip-enter" key={view}>{view === "front" ? <BodyMapFront recovery={recovery} hoveredMuscle={hoveredMuscle} onHover={setHoveredMuscle} onClick={handleMuscleClick} dimmedMuscles={dimmedMuscles} highlightedMuscles={highlightedMuscles} /> : <BodyMapBack recovery={recovery} hoveredMuscle={hoveredMuscle} onHover={setHoveredMuscle} onClick={handleMuscleClick} dimmedMuscles={dimmedMuscles} highlightedMuscles={highlightedMuscles} />}</div></div>
                <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-2 pt-2 border-t border-white/[.03]">{[{ c: "#ef4444", l: "Trained" }, { c: "#f59e0b", l: "Healing" }, { c: "#22c55e", l: "Almost" }, { c: "#3b82f6", l: "Ready" }, { c: "#6b7280", l: "New" }].map((i) => <div key={i.l} className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: i.c }} /><span className="text-[9px] text-dark-600">{i.l}</span></div>)}</div>
              </div>
              {selectedMuscle && <MuscleInspector muscleId={selectedMuscle} recovery={recovery[selectedMuscle] || null} onTrain={handleTrain} />}
            </div>
          )}

          {mobileTab === "workouts" && (
            <div className="space-y-3 animate-fade-in">
              {showLogger ? <div className="glass-card rounded-xl p-4"><WorkoutLogger preselectedMuscle={preselectedMuscle} onSaved={handleSaved} onCancel={() => { setShowLogger(false); setPreselectedMuscle(null); }} /></div>
              : <>
                <div className="flex items-center justify-between"><h3 className="text-dark-300 font-semibold text-[13px] uppercase tracking-wider">Workouts</h3><button onClick={() => setShowLogger(true)} className="h-7 px-3 bg-brand-600 text-white rounded-md text-[11px] font-semibold flex items-center gap-1"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>New</button></div>
                {loading ? <div className="glass-card rounded-xl p-8 text-center"><div className="w-6 h-6 border-2 border-brand-500/30 border-t-brand-500 rounded-full mx-auto animate-spin" /></div>
                : workouts.length === 0 ? <div className="glass-card rounded-xl p-5 text-center"><h4 className="text-white font-semibold text-sm mb-1">No workouts yet</h4><p className="text-dark-500 text-xs mb-3">Log your first session.</p><div className="space-y-2"><button onClick={() => setShowLogger(true)} className="w-full h-9 bg-brand-600 text-white rounded-lg text-xs font-semibold">Log Workout</button><button onClick={loadDemo} className="w-full h-9 glass-light text-dark-400 rounded-lg text-xs font-medium">Load Demo</button></div></div>
                : <div className="space-y-2">{workouts.map((w) => <WorkoutCard key={w.id} workout={w} isSelected={selectedWorkout === w.id} onSelect={() => handleWorkoutSelect(w.id)} onDelete={handleDelete} />)}</div>}
              </>}
              <CardioTracker />
            </div>
          )}

          {mobileTab === "nutrition" && (
            <div className="space-y-4 animate-fade-in">
              <CalorieCounter />
            </div>
          )}

          {mobileTab === "progress" && (
            <div className="space-y-4 animate-fade-in">
              <PersonalProfile />
              <ProgressCharts />
            </div>
          )}

          {mobileTab === "more" && (
            <div className="space-y-4 animate-fade-in">
              <AIAssistant />
              <RecoveryRadar recovery={recovery} />
              <DeviceSync />
            </div>
          )}
        </div>
      </main>

      {/* ─── MOBILE BOTTOM NAV ─── */}
      <nav className="mobile-nav lg:hidden">
        <div className="flex items-center justify-around px-1 py-1 pb-safe">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setMobileTab(t.id)} className={`flex flex-col items-center gap-0.5 py-1.5 px-2 rounded-lg transition-all min-w-[52px] ${mobileTab === t.id ? "text-brand-400" : "text-dark-600 active:text-dark-400"}`}>
              {t.icon}
              <span className="text-[9px] font-medium leading-none">{t.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
