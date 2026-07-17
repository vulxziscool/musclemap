"use client";

import { useMemo } from "react";

interface Exercise { name: string; sets: number; reps: number; weight: string | null; primaryMuscle: string; }
interface Workout { id: number; name: string; date: string; exercises: Exercise[]; }

interface Achievement { id: string; name: string; desc: string; icon: string; check: (w: Workout[], total: number) => boolean; }

const ACHIEVEMENTS: Achievement[] = [
  { id: "first", name: "First Rep", desc: "Log your first workout", icon: "🏅", check: (w) => w.length >= 1 },
  { id: "five", name: "Dedicated", desc: "Log 5 workouts", icon: "⭐", check: (w) => w.length >= 5 },
  { id: "ten", name: "Consistent", desc: "Log 10 workouts", icon: "🔥", check: (w) => w.length >= 10 },
  { id: "twenty", name: "Committed", desc: "Log 20 workouts", icon: "💎", check: (w) => w.length >= 20 },
  { id: "fifty", name: "Iron Will", desc: "Log 50 workouts", icon: "🏆", check: (w) => w.length >= 50 },
  { id: "hundred", name: "Centurion", desc: "Log 100 workouts", icon: "👑", check: (w) => w.length >= 100 },
  { id: "1k", name: "1K Club", desc: "Lift 1,000 total lbs", icon: "💪", check: (_, t) => t >= 1000 },
  { id: "10k", name: "10K Club", desc: "Lift 10,000 total lbs", icon: "🦾", check: (_, t) => t >= 10000 },
  { id: "50k", name: "50K Beast", desc: "Lift 50,000 total lbs", icon: "🐂", check: (_, t) => t >= 50000 },
  { id: "100k", name: "100K Legend", desc: "Lift 100,000 total lbs", icon: "⚡", check: (_, t) => t >= 100000 },
  { id: "500k", name: "Half Mil", desc: "Lift 500,000 total lbs", icon: "🌟", check: (_, t) => t >= 500000 },
  { id: "1m", name: "Millionaire", desc: "Lift 1,000,000 total lbs", icon: "🏛️", check: (_, t) => t >= 1000000 },
  { id: "push", name: "Push Master", desc: "Log 5 push workouts", icon: "🫸", check: (w) => w.filter((x) => x.exercises.some((e) => ["mid_chest","upper_chest","lower_chest","front_delts","side_delts","triceps"].includes(e.primaryMuscle))).length >= 5 },
  { id: "pull", name: "Pull Master", desc: "Log 5 pull workouts", icon: "🫷", check: (w) => w.filter((x) => x.exercises.some((e) => ["lats","mid_back","lower_back","biceps","rear_delts","traps"].includes(e.primaryMuscle))).length >= 5 },
  { id: "legs", name: "Leg Master", desc: "Log 5 leg workouts", icon: "🦵", check: (w) => w.filter((x) => x.exercises.some((e) => ["quads","hamstrings","glutes","calves","adductors"].includes(e.primaryMuscle))).length >= 5 },
  { id: "allm", name: "Complete", desc: "Train all 20 muscles", icon: "🧬", check: (w) => { const m = new Set<string>(); w.forEach((x) => x.exercises.forEach((e) => m.add(e.primaryMuscle))); return m.size >= 20; } },
  { id: "plate1", name: "One Plate", desc: "Lift 135 lbs in one exercise", icon: "🥉", check: (w) => w.some((x) => x.exercises.some((e) => parseWeight(e.weight) >= 135)) },
  { id: "plate2", name: "Two Plates", desc: "Lift 225 lbs in one exercise", icon: "🥈", check: (w) => w.some((x) => x.exercises.some((e) => parseWeight(e.weight) >= 225)) },
  { id: "plate3", name: "Three Plates", desc: "Lift 315 lbs in one exercise", icon: "🥇", check: (w) => w.some((x) => x.exercises.some((e) => parseWeight(e.weight) >= 315)) },
  { id: "plate4", name: "Four Plates", desc: "Lift 405 lbs in one exercise", icon: "💀", check: (w) => w.some((x) => x.exercises.some((e) => parseWeight(e.weight) >= 405)) },
  { id: "bw_king", name: "BW King", desc: "Log 10 bodyweight exercises", icon: "🤸", check: (w) => { let c = 0; w.forEach((x) => x.exercises.forEach((e) => { if (!e.weight || e.weight === "BW" || parseWeight(e.weight) === 0) c++; })); return c >= 10; } },
  { id: "heavy", name: "Heavy Hitter", desc: "Do a set of 5+ reps at 200+ lbs", icon: "🏗️", check: (w) => w.some((x) => x.exercises.some((e) => parseWeight(e.weight) >= 200 && e.reps >= 5)) },
  { id: "variety", name: "Variety Pack", desc: "Use 10 different exercises", icon: "🎰", check: (w) => { const s = new Set<string>(); w.forEach((x) => x.exercises.forEach((e) => s.add(e.name))); return s.size >= 10; } },
  { id: "variety25", name: "Exercise Explorer", desc: "Use 25 different exercises", icon: "🗺️", check: (w) => { const s = new Set<string>(); w.forEach((x) => x.exercises.forEach((e) => s.add(e.name))); return s.size >= 25; } },
  { id: "vol1k", name: "Volume 1K", desc: "Do 1,000 total reps", icon: "📈", check: (w) => w.reduce((s, x) => s + x.exercises.reduce((a, e) => a + e.sets * e.reps, 0), 0) >= 1000 },
  { id: "vol10k", name: "Volume 10K", desc: "Do 10,000 total reps", icon: "🚀", check: (w) => w.reduce((s, x) => s + x.exercises.reduce((a, e) => a + e.sets * e.reps, 0), 0) >= 10000 },
  { id: "marathon", name: "Marathon Month", desc: "Log 20 workouts in 30 days", icon: "🏃", check: (w) => { const d = new Date(); const m = new Date(d.getTime() - 30*24*60*60*1000); return w.filter((x) => new Date(x.date) >= m).length >= 20; } },
  { id: "earlybird", name: "Early Bird", desc: "Log 3 workouts", icon: "🐣", check: (w) => w.length >= 3 },
  { id: "week_str", name: "Week Streak", desc: "Log workouts 7 days in a row", icon: "🔗", check: (w) => { const dates = [...new Set(w.map((x) => x.date))].sort(); for (let i = 0; i <= dates.length - 7; i++) { const start = new Date(dates[i]).getTime(); const end = new Date(dates[i+6]).getTime(); if (end - start <= 6*24*60*60*1000) return true; } return false; } },
];

function parseWeight(w: string | null): number {
  if (!w) return 0;
  const n = parseFloat(w.replace(/[^0-9.]/g, ""));
  return isNaN(n) ? 0 : n;
}

interface Props {
  workouts: Workout[];
  totalWeight: number;
}

export default function Achievements({ workouts, totalWeight }: Props) {
  const results = useMemo(() =>
    ACHIEVEMENTS.map((a) => ({ ...a, unlocked: a.check(workouts, totalWeight) })),
  [workouts, totalWeight]);

  const unlocked = results.filter((r) => r.unlocked).length;

  return (
    <div className="glass-card rounded-lg lg:rounded-xl overflow-hidden">
      <div className="h-0.5 bg-gradient-to-r from-yellow-500 to-transparent" />
      <div className="p-3">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-yellow-500/10 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
            </div>
            <div>
              <h3 className="text-white font-semibold text-[12px] lg:text-[14px] tracking-tight">Achievements</h3>
              <p className="text-dark-600 text-[9px]">{unlocked}/{results.length} unlocked</p>
            </div>
          </div>
          <div className="bar-track w-16 !h-[3px]"><div className="bar-fill bg-yellow-500" style={{ width: `${(unlocked / results.length) * 100}%` }} /></div>
        </div>

        <div className="grid grid-cols-4 lg:grid-cols-5 gap-1">
          {results.map((a) => (
            <div key={a.id} className={`glass-inset rounded p-1.5 text-center transition-all ${a.unlocked ? "" : "opacity-30 grayscale"}`}>
              <div className="text-base lg:text-lg leading-none">{a.icon}</div>
              <div className="text-[7px] lg:text-[8px] text-dark-400 font-medium mt-0.5 truncate">{a.name}</div>
            </div>
          ))}
        </div>

        {/* Next achievement */}
        {(() => {
          const next = results.find((r) => !r.unlocked);
          if (!next) return null;
          return (
            <div className="mt-2 glass-inset rounded p-2 flex items-center gap-2">
              <span className="text-base opacity-50">{next.icon}</span>
              <div className="min-w-0">
                <div className="text-dark-300 text-[10px] font-semibold">{next.name}</div>
                <div className="text-dark-600 text-[8px]">{next.desc}</div>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
