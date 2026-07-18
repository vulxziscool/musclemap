"use client";

import { useMemo } from "react";

interface Workout { id: number; date: string; }

interface Props { workouts: Workout[]; }

export default function StreakCalendar({ workouts }: Props) {
  const { grid, currentStreak, longestStreak, totalDays } = useMemo(() => {
    const dates = new Set(workouts.map((w) => w.date));
    const today = new Date();
    const cells: { date: string; hasWorkout: boolean; day: number }[] = [];

    // Last 84 days (12 weeks)
    for (let i = 83; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const ds = d.toISOString().split("T")[0];
      cells.push({ date: ds, hasWorkout: dates.has(ds), day: d.getDay() });
    }

    // Streak calc
    let cur = 0;
    let max = 0;
    let streak = 0;
    const sortedDates = [...dates].sort().reverse();
    const todayStr = today.toISOString().split("T")[0];
    const yesterdayStr = new Date(today.getTime() - 86400000).toISOString().split("T")[0];

    // Current streak
    if (dates.has(todayStr) || dates.has(yesterdayStr)) {
      const start = dates.has(todayStr) ? todayStr : yesterdayStr;
      let d = new Date(start);
      while (dates.has(d.toISOString().split("T")[0])) {
        cur++;
        d = new Date(d.getTime() - 86400000);
      }
    }

    // Longest streak
    const all = [...dates].sort();
    let s = 1;
    for (let i = 1; i < all.length; i++) {
      const diff = (new Date(all[i]).getTime() - new Date(all[i - 1]).getTime()) / 86400000;
      if (diff <= 1) { s++; max = Math.max(max, s); } else s = 1;
    }
    if (all.length === 1) max = 1;
    max = Math.max(max, s);

    return { grid: cells, currentStreak: cur, longestStreak: max, totalDays: dates.size };
  }, [workouts]);

  return (
    <div className="glass-card rounded-lg lg:rounded-xl overflow-hidden">
      <div className="h-0.5 bg-gradient-to-r from-green-500 to-transparent" />
      <div className="p-2.5 lg:p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 lg:w-7 lg:h-7 rounded-md bg-green-500/10 flex items-center justify-center">
              <svg className="w-3 h-3 lg:w-3.5 lg:h-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
            <div>
              <h3 className="text-white font-semibold text-[11px] lg:text-[14px] tracking-tight">Workout Streak</h3>
              <p className="text-dark-600 text-[8px] lg:text-[9px]">Last 12 weeks</p>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="text-center">
              <div className="text-green-400 font-bold text-[13px] tabular-nums">{currentStreak}</div>
              <div className="text-dark-700 text-[6px] uppercase">Current</div>
            </div>
            <div className="text-center">
              <div className="text-amber-400 font-bold text-[13px] tabular-nums">{longestStreak}</div>
              <div className="text-dark-700 text-[6px] uppercase">Best</div>
            </div>
            <div className="text-center">
              <div className="text-white font-bold text-[13px] tabular-nums">{totalDays}</div>
              <div className="text-dark-700 text-[6px] uppercase">Days</div>
            </div>
          </div>
        </div>

        {/* Day labels */}
        <div className="flex gap-px mb-px">
          <div className="w-3 shrink-0" />
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
            <div key={i} className="flex-1 text-center text-[6px] text-dark-700">{d}</div>
          ))}
        </div>

        {/* Grid — 12 rows of 7 */}
        <div className="space-y-px">
          {Array.from({ length: 12 }, (_, week) => (
            <div key={week} className="flex gap-px">
              <div className="w-3 shrink-0 text-[5px] text-dark-700 flex items-center justify-end pr-0.5">
                {week === 0 || week === 4 || week === 8 ? grid[week * 7]?.date.slice(5, 7) + "/" + grid[week * 7]?.date.slice(8) : ""}
              </div>
              {Array.from({ length: 7 }, (_, day) => {
                const idx = week * 7 + day;
                const cell = grid[idx];
                if (!cell) return <div key={day} className="flex-1 aspect-square" />;
                return (
                  <div key={day} className={`flex-1 aspect-square rounded-[2px] transition-colors ${cell.hasWorkout ? "bg-green-500" : "bg-white/[.04]"}`}
                    style={cell.hasWorkout ? { opacity: 0.4 + Math.min(0.6, 0.6) } : {}}
                    title={`${cell.date}${cell.hasWorkout ? " — trained" : ""}`} />
                );
              })}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end gap-1 mt-1">
          <span className="text-[6px] text-dark-700">Less</span>
          <div className="w-2 h-2 rounded-[1px] bg-white/[.04]" />
          <div className="w-2 h-2 rounded-[1px] bg-green-500/40" />
          <div className="w-2 h-2 rounded-[1px] bg-green-500/70" />
          <div className="w-2 h-2 rounded-[1px] bg-green-500" />
          <span className="text-[6px] text-dark-700">More</span>
        </div>
      </div>
    </div>
  );
}
