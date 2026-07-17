"use client";

import { useState } from "react";
import { CARDIO_ACTIVITIES, CARDIO_CATEGORIES } from "@/lib/cardio";

export default function CardioTracker() {
  const [selectedCat, setSelectedCat] = useState("running");
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [duration, setDuration] = useState("30");
  const [bodyWeight, setBodyWeight] = useState("170");
  const [logged, setLogged] = useState<{ name: string; duration: number; cals: number }[]>([]);

  const filtered = CARDIO_ACTIVITIES.filter((a) => a.category === selectedCat);
  const activity = CARDIO_ACTIVITIES.find((a) => a.name === selectedActivity);

  const weightFactor = (parseFloat(bodyWeight) || 170) / 155;
  const estCalories = activity
    ? Math.round(((activity.calPerMinLow + activity.calPerMinHigh) / 2) * (parseInt(duration) || 30) * weightFactor)
    : 0;

  const logSession = () => {
    if (!activity) return;
    setLogged((p) => [{ name: activity.name, duration: parseInt(duration) || 30, cals: estCalories }, ...p]);
    setSelectedActivity(null);
    setDuration("30");
  };

  const totalCals = logged.reduce((s, l) => s + l.cals, 0);
  const totalMin = logged.reduce((s, l) => s + l.duration, 0);

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="h-0.5 bg-gradient-to-r from-red-500 to-transparent" />
      <div className="p-3">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-md bg-red-500/10 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
          </div>
          <div>
            <h3 className="text-white font-semibold text-[12px] lg:text-[14px] tracking-tight">Cardio Tracker</h3>
            <p className="text-dark-600 text-[9px]">{CARDIO_ACTIVITIES.length} activities</p>
          </div>
        </div>

        {/* Category pills — scrollable */}
        <div className="flex gap-1 mb-2 overflow-x-auto no-scrollbar">
          {CARDIO_CATEGORIES.map((c) => (
            <button key={c.id} onClick={() => { setSelectedCat(c.id); setSelectedActivity(null); }}
              className={`shrink-0 text-[9px] font-medium px-2 py-1 rounded transition-all ${selectedCat === c.id ? "bg-red-500/15 text-red-400" : "text-dark-500 hover:text-dark-300 bg-white/[.02]"}`}>
              {c.label}
            </button>
          ))}
        </div>

        {/* Activity list */}
        <div className="space-y-1 mb-3 max-h-40 overflow-y-auto scrollbar-thin">
          {filtered.map((a) => (
            <button key={a.name} onClick={() => setSelectedActivity(a.name)}
              className={`w-full text-left flex items-center justify-between p-2 rounded-lg transition-all ${selectedActivity === a.name ? "glass-inset border-red-500/20" : "hover:bg-white/[.02]"}`}>
              <div className="flex items-center gap-2">
                <span className="text-sm">{a.icon}</span>
                <span className="text-[12px] text-dark-300 font-medium">{a.name}</span>
              </div>
              <span className="text-[10px] text-dark-600 tabular-nums">{a.calPerMinLow}–{a.calPerMinHigh} cal/min</span>
            </button>
          ))}
        </div>

        {/* Calculator */}
        {activity && (
          <div className="glass-inset rounded-xl p-3 mb-3 animate-fade-in">
            <div className="text-dark-400 text-[10px] uppercase tracking-wider font-medium mb-2">Estimate Burn</div>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div>
                <label className="text-dark-600 text-[9px] uppercase tracking-wider block mb-0.5">Duration (min)</label>
                <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} className="input-compact" />
              </div>
              <div>
                <label className="text-dark-600 text-[9px] uppercase tracking-wider block mb-0.5">Your Weight (lbs)</label>
                <input type="number" value={bodyWeight} onChange={(e) => setBodyWeight(e.target.value)} className="input-compact" />
              </div>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-dark-400 text-[11px]">{activity.name}</span>
              <span className="text-red-400 font-bold text-lg tabular-nums">{estCalories} <span className="text-dark-500 text-[10px] font-normal">cal</span></span>
            </div>
            <button onClick={logSession} className="w-full h-8 bg-red-600 hover:bg-red-500 text-white text-[11px] font-semibold rounded-lg transition-all">
              Log Session
            </button>
          </div>
        )}

        {/* Today's log */}
        {logged.length > 0 && (
          <div className="glass-inset rounded-lg p-2.5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-dark-600 text-[9px] uppercase tracking-wider font-medium">Today&apos;s Cardio</span>
              <span className="text-red-400 text-[11px] font-semibold tabular-nums">{totalCals} cal · {totalMin} min</span>
            </div>
            <div className="space-y-1">
              {logged.map((l, i) => (
                <div key={i} className="flex items-center justify-between text-[11px]">
                  <span className="text-dark-400">{l.name}</span>
                  <span className="text-dark-500 tabular-nums">{l.duration}m · {l.cals} cal</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
