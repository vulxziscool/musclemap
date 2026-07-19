"use client";

import { useMemo } from "react";

interface Workout { id: number; date: string; name: string; }
interface Props { workouts: Workout[]; }

export default function WorkoutCalendar({ workouts }: Props) {
  const { weeks, monthLabel } = useMemo(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startPad = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const dates = new Set(workouts.map((w) => w.date));
    const cells: (null | { day: number; date: string; trained: boolean; isToday: boolean })[] = [];

    for (let i = 0; i < startPad; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const ds = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      cells.push({ day: d, date: ds, trained: dates.has(ds), isToday: d === today.getDate() });
    }
    while (cells.length % 7 !== 0) cells.push(null);

    const wks: (typeof cells)[] = [];
    for (let i = 0; i < cells.length; i += 7) wks.push(cells.slice(i, i + 7));

    return { weeks: wks, monthLabel: today.toLocaleDateString("en-US", { month: "long", year: "numeric" }) };
  }, [workouts]);

  const trainedThisMonth = workouts.filter((w) => {
    const d = new Date(w.date);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  return (
    <div className="glass-card rounded-lg lg:rounded-xl overflow-hidden">
      <div className="h-0.5 bg-gradient-to-r from-violet-500 to-transparent" />
      <div className="p-2.5 lg:p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 lg:w-7 lg:h-7 rounded-md bg-violet-500/10 flex items-center justify-center">
              <svg className="w-3 h-3 lg:w-3.5 lg:h-3.5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
            <div>
              <h3 className="text-white font-semibold text-[11px] lg:text-[14px] tracking-tight">{monthLabel}</h3>
              <p className="text-dark-600 text-[8px]">{trainedThisMonth} sessions this month</p>
            </div>
          </div>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-0.5 mb-0.5">
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
            <div key={i} className="text-center text-[7px] text-dark-700 font-medium">{d}</div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="space-y-0.5">
          {weeks.map((week, wi) => (
            <div key={wi} className="grid grid-cols-7 gap-0.5">
              {week.map((cell, ci) => (
                <div key={ci} className={`aspect-square rounded-sm flex items-center justify-center text-[9px] font-medium transition-all ${
                  !cell ? "" :
                  cell.isToday && cell.trained ? "bg-violet-500 text-white ring-1 ring-violet-400" :
                  cell.isToday ? "ring-1 ring-violet-500/50 text-violet-400" :
                  cell.trained ? "bg-violet-500/20 text-violet-300" :
                  "text-dark-600"
                }`}>
                  {cell?.day || ""}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
