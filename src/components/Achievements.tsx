"use client";

import { useMemo, useState } from "react";

interface Exercise { name: string; sets: number; reps: number; weight: string | null; primaryMuscle: string; }
interface Workout { id: number; name: string; date: string; exercises: Exercise[]; }
interface Achievement { id: string; name: string; desc: string; detail: string; icon: string; check: (w: Workout[], t: number) => boolean; }

function pw(w: string | null): number { if (!w) return 0; const n = parseFloat(w.replace(/[^0-9.]/g, "")); return isNaN(n) ? 0 : n; }
function uniqEx(w: Workout[]): number { const s = new Set<string>(); w.forEach((x) => x.exercises.forEach((e) => s.add(e.name))); return s.size; }
function uniqDays(w: Workout[]): number { return new Set(w.map((x) => x.date)).size; }
function totalReps(w: Workout[]): number { return w.reduce((s, x) => s + x.exercises.reduce((a, e) => a + e.sets * e.reps, 0), 0); }
function maxWt(w: Workout[]): number { let m = 0; w.forEach((x) => x.exercises.forEach((e) => { m = Math.max(m, pw(e.weight)); })); return m; }
function streak(w: Workout[]): number { const d = [...new Set(w.map((x) => x.date))].sort(); if (!d.length) return 0; let mx = 1, c = 1; for (let i = 1; i < d.length; i++) { const diff = (new Date(d[i]).getTime() - new Date(d[i-1]).getTime()) / 86400000; if (diff <= 1) { c++; mx = Math.max(mx, c); } else c = 1; } return mx; }
function musclesTrained(w: Workout[]): number { const m = new Set<string>(); w.forEach((x) => x.exercises.forEach((e) => m.add(e.primaryMuscle))); return m.size; }
function hasEx(w: Workout[], n: string): boolean { return w.some((x) => x.exercises.some((e) => e.name === n)); }
const PUSH_M = ["mid_chest","upper_chest","lower_chest","front_delts","side_delts","triceps"];
const PULL_M = ["lats","mid_back","lower_back","biceps","rear_delts","traps","forearms"];
const LEG_M = ["quads","hamstrings","glutes","calves","adductors"];

const A: Achievement[] = [
  // ─── GETTING STARTED ───
  { id: "gs1", name: "First Rep", desc: "Log 1 workout", detail: "Every journey begins with a single rep. You showed up and that's what matters most.", icon: "🏅", check: (w) => w.length >= 1 },
  { id: "gs2", name: "Warm Up", desc: "Log 3 workouts", detail: "Three workouts in — you're past the hardest part: starting. The habit is forming.", icon: "🐣", check: (w) => w.length >= 3 },
  { id: "gs3", name: "Dedicated", desc: "Log 5 workouts", detail: "Five sessions logged. You're no longer a beginner — you're building a real routine.", icon: "⭐", check: (w) => w.length >= 5 },
  { id: "gs4", name: "Consistent", desc: "Log 10 workouts", detail: "Double digits! Consistency beats intensity. You're proving you can stick with it.", icon: "🔥", check: (w) => w.length >= 10 },
  { id: "gs5", name: "Committed", desc: "Log 25 workouts", detail: "25 sessions — that's almost a month of daily training. Your body is adapting.", icon: "💎", check: (w) => w.length >= 25 },
  { id: "gs6", name: "Iron Will", desc: "Log 50 workouts", detail: "50 workouts separates the casuals from the committed. You've built a real foundation.", icon: "🏆", check: (w) => w.length >= 50 },
  { id: "gs7", name: "Centurion", desc: "Log 100 workouts", detail: "100 sessions. You've spent hundreds of hours investing in yourself. Truly elite discipline.", icon: "👑", check: (w) => w.length >= 100 },
  { id: "gs8", name: "Unstoppable", desc: "Log 200 workouts", detail: "200 workouts logged. At this point, training isn't something you do — it's who you are.", icon: "🦁", check: (w) => w.length >= 200 },
  { id: "gs9", name: "Year of Iron", desc: "Log 365 workouts", detail: "A workout for every day of the year. You are in the top 1% of dedication.", icon: "📅", check: (w) => w.length >= 365 },

  // ─── TOTAL WEIGHT LIFTED ───
  { id: "tw1", name: "1K Club", desc: "Lift 1,000 lbs total", detail: "Your first thousand pounds moved. That's nearly half a ton of iron.", icon: "💪", check: (_, t) => t >= 1000 },
  { id: "tw2", name: "5K Grinder", desc: "Lift 5,000 lbs total", detail: "Five thousand pounds — equivalent to lifting a pickup truck.", icon: "🔨", check: (_, t) => t >= 5000 },
  { id: "tw3", name: "10K Club", desc: "Lift 10,000 lbs total", detail: "10,000 lbs moved. That's the weight of a full-size SUV. Lifted by you.", icon: "🦾", check: (_, t) => t >= 10000 },
  { id: "tw4", name: "50K Beast", desc: "Lift 50,000 lbs total", detail: "50 thousand pounds. You've moved the equivalent of a loaded semi-truck trailer.", icon: "🐂", check: (_, t) => t >= 50000 },
  { id: "tw5", name: "100K Legend", desc: "Lift 100,000 lbs total", detail: "One hundred thousand pounds. That's a blue whale. You lifted a blue whale.", icon: "⚡", check: (_, t) => t >= 100000 },
  { id: "tw6", name: "Half Million", desc: "Lift 500,000 lbs total", detail: "Half a million pounds moved through space by your muscles alone. Superhuman.", icon: "🌟", check: (_, t) => t >= 500000 },
  { id: "tw7", name: "Millionaire", desc: "Lift 1,000,000 lbs total", detail: "One million pounds. You could have lifted the Statue of Liberty. Twice.", icon: "🏛️", check: (_, t) => t >= 1000000 },

  // ─── PLATE MILESTONES ───
  { id: "pl1", name: "One Plate", desc: "Lift 135 lbs", detail: "A plate on each side — the universal symbol that you actually lift. Welcome to the club.", icon: "🥉", check: (w) => maxWt(w) >= 135 },
  { id: "pl2", name: "Two Plates", desc: "Lift 225 lbs", detail: "225 lbs — two plates per side. This is where people start to notice. Respect earned.", icon: "🥈", check: (w) => maxWt(w) >= 225 },
  { id: "pl3", name: "Three Plates", desc: "Lift 315 lbs", detail: "315 lbs — three plates. You're now stronger than 95% of gym-goers. Seriously impressive.", icon: "🥇", check: (w) => maxWt(w) >= 315 },
  { id: "pl4", name: "Four Plates", desc: "Lift 405 lbs", detail: "405 lbs — four plates per side. You can hear the bar bending. Elite territory.", icon: "💀", check: (w) => maxWt(w) >= 405 },
  { id: "pl5", name: "Five Plates", desc: "Lift 495 lbs", detail: "495 lbs — five plates. At this point, you're not just strong. You're a force of nature.", icon: "🔱", check: (w) => maxWt(w) >= 495 },

  // ─── MUSCLE GROUPS ───
  { id: "mg1", name: "Push Pro", desc: "5 push sessions", detail: "Chest, shoulders, and triceps have been hammered. Your pushing power is developing fast.", icon: "🫸", check: (w) => w.filter((x) => x.exercises.some((e) => PUSH_M.includes(e.primaryMuscle))).length >= 5 },
  { id: "mg2", name: "Pull Pro", desc: "5 pull sessions", detail: "Back, biceps, and rear delts are getting serious attention. A strong back = strong everything.", icon: "🫷", check: (w) => w.filter((x) => x.exercises.some((e) => PULL_M.includes(e.primaryMuscle))).length >= 5 },
  { id: "mg3", name: "Leg Pro", desc: "5 leg sessions", detail: "You don't skip leg day. Quads, hamstrings, glutes — all getting the work they deserve.", icon: "🦵", check: (w) => w.filter((x) => x.exercises.some((e) => LEG_M.includes(e.primaryMuscle))).length >= 5 },
  { id: "mg4", name: "Core Pro", desc: "5 core sessions", detail: "A strong core is the foundation of every lift. Abs and obliques are locked in.", icon: "🎯", check: (w) => w.filter((x) => x.exercises.some((e) => ["abs","obliques"].includes(e.primaryMuscle))).length >= 5 },
  { id: "mg5", name: "Full Body", desc: "Train all 20 muscles", detail: "Every single muscle group targeted at least once. No imbalances, no weak links. Complete.", icon: "🧬", check: (w) => musclesTrained(w) >= 20 },

  // ─── STREAKS ───
  { id: "st1", name: "3-Day Streak", desc: "3 days in a row", detail: "Three consecutive days of training. You're building momentum that's hard to stop.", icon: "📈", check: (w) => streak(w) >= 3 },
  { id: "st2", name: "Week Warrior", desc: "7 days in a row", detail: "A full week without missing a day. Your discipline is becoming your identity.", icon: "🗓️", check: (w) => streak(w) >= 7 },
  { id: "st3", name: "Two-Week King", desc: "14 days in a row", detail: "14 consecutive days. Scientists say it takes 21 days to form a habit — you're almost there.", icon: "🔗", check: (w) => streak(w) >= 14 },
  { id: "st4", name: "Monthly Beast", desc: "30 days in a row", detail: "30 days straight. A full month of daily training. You are in the top 0.1% of consistency.", icon: "🐲", check: (w) => streak(w) >= 30 },

  // ─── EXERCISE VARIETY ───
  { id: "ev1", name: "Explorer", desc: "Try 10 exercises", detail: "10 different exercises used. A varied program hits muscles from every angle.", icon: "🧭", check: (w) => uniqEx(w) >= 10 },
  { id: "ev2", name: "Versatile", desc: "Try 25 exercises", detail: "25 exercises in your repertoire. You know your way around the gym like a veteran.", icon: "🎨", check: (w) => uniqEx(w) >= 25 },
  { id: "ev3", name: "Master of All", desc: "Try 50 exercises", detail: "50 different movements mastered. You could write your own training program at this point.", icon: "🎓", check: (w) => uniqEx(w) >= 50 },

  // ─── VOLUME ───
  { id: "vl1", name: "Rep Machine", desc: "1,000 total reps", detail: "One thousand repetitions completed. Your muscles have contracted a thousand times for this.", icon: "🔄", check: (w) => totalReps(w) >= 1000 },
  { id: "vl2", name: "Rep Monster", desc: "10,000 total reps", detail: "Ten thousand reps. If each rep took 3 seconds, you've spent 8+ hours just moving weight.", icon: "🚀", check: (w) => totalReps(w) >= 10000 },
  { id: "vl3", name: "Rep God", desc: "50,000 total reps", detail: "Fifty thousand repetitions. Your muscle memory is so deep, perfect form is automatic.", icon: "⚡", check: (w) => totalReps(w) >= 50000 },

  // ─── SPECIFIC EXERCISES ───
  { id: "se1", name: "Push-Up Pro", desc: "Log push-ups", detail: "The most fundamental bodyweight exercise. Simple, effective, timeless.", icon: "🤸", check: (w) => hasEx(w, "Push-Ups") },
  { id: "se2", name: "Pull-Up Pro", desc: "Log pull-ups", detail: "Pull-ups are the king of bodyweight back exercises. If you can pull up, you're strong.", icon: "🦍", check: (w) => hasEx(w, "Pull-Ups") },
  { id: "se3", name: "Bench Boss", desc: "Log bench press", detail: "The bench press — the world's most popular strength exercise. How much ya bench?", icon: "🏋️", check: (w) => hasEx(w, "Bench Press") },
  { id: "se4", name: "Squat King", desc: "Log squats", detail: "Squats are called the king of exercises for a reason. 200+ muscles activated in one movement.", icon: "👑", check: (w) => hasEx(w, "Back Squats") || hasEx(w, "Front Squats") },
  { id: "se5", name: "Deadlift Legend", desc: "Log deadlifts", detail: "The deadlift — picking heavy things off the ground. The most primal human strength test.", icon: "🪨", check: (w) => hasEx(w, "Deadlifts") },
  { id: "se6", name: "Dip Master", desc: "Log dips or bench dips", detail: "Dips — the upper body squat. One of the best compound pushers that exists.", icon: "⬇️", check: (w) => hasEx(w, "Dips") || hasEx(w, "Bench Dips") || hasEx(w, "Ring Dips") },
  { id: "se7", name: "Curl Bro", desc: "Log any curl exercise", detail: "Curls for the girls? Or just because bicep training is genuinely satisfying. No shame.", icon: "💪", check: (w) => hasEx(w, "Dumbbell Curls") || hasEx(w, "Barbell Curls") || hasEx(w, "Hammer Curls") },

  // ─── DAYS & SPECIAL ───
  { id: "dy1", name: "10 Days Strong", desc: "Train 10 unique days", detail: "10 separate training days logged. You're building a real training history.", icon: "📆", check: (w) => uniqDays(w) >= 10 },
  { id: "dy2", name: "30 Days Strong", desc: "Train 30 unique days", detail: "A full month's worth of training days. Your body has undergone real adaptation.", icon: "📊", check: (w) => uniqDays(w) >= 30 },
  { id: "dy3", name: "100 Days Strong", desc: "Train 100 unique days", detail: "100 training days. You've spent over 3 months of your life actively getting stronger.", icon: "🗻", check: (w) => uniqDays(w) >= 100 },
  { id: "sp1", name: "BW Warrior", desc: "10 bodyweight exercises", detail: "10 exercises with no equipment needed. You can train anywhere, anytime. True freedom.", icon: "🤸", check: (w) => { let c = 0; w.forEach((x) => x.exercises.forEach((e) => { if (!e.weight || e.weight === "BW" || pw(e.weight) === 0) c++; })); return c >= 10; } },
  { id: "sp2", name: "Heavy Hitter", desc: "5+ reps at 200+ lbs", detail: "Moving 200+ pounds for reps — not just a max attempt. You have real working strength.", icon: "🏗️", check: (w) => w.some((x) => x.exercises.some((e) => pw(e.weight) >= 200 && e.reps >= 5)) },
  { id: "sp3", name: "Marathon Month", desc: "20 workouts in 30 days", detail: "20 sessions in a single month. That's training almost every day. Absolute machine.", icon: "🏃", check: (w) => { const d = new Date(); const m = new Date(d.getTime() - 30*86400000); return w.filter((x) => new Date(x.date) >= m).length >= 20; } },
];

interface Props { workouts: Workout[]; totalWeight: number; }

export default function Achievements({ workouts, totalWeight }: Props) {
  const [showAll, setShowAll] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const results = useMemo(() => A.map((a) => ({ ...a, unlocked: a.check(workouts, totalWeight) })), [workouts, totalWeight]);
  const unlocked = results.filter((r) => r.unlocked).length;
  const display = showAll ? results : results.slice(0, 12);

  return (
    <div className="glass-card rounded-lg lg:rounded-xl overflow-hidden">
      <div className="h-0.5 bg-gradient-to-r from-yellow-500 to-transparent" />
      <div className="p-2.5 lg:p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 lg:w-7 lg:h-7 rounded-md bg-yellow-500/10 flex items-center justify-center">
              <svg className="w-3 h-3 lg:w-3.5 lg:h-3.5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
            </div>
            <div>
              <h3 className="text-white font-semibold text-[11px] lg:text-[14px] tracking-tight">Achievements</h3>
              <p className="text-dark-600 text-[8px] lg:text-[9px]">{unlocked} / {results.length} unlocked</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="bar-track w-12 lg:w-16 !h-[3px]"><div className="bar-fill bg-yellow-500" style={{ width: `${(unlocked / results.length) * 100}%` }} /></div>
            <span className="text-yellow-400 text-[9px] font-bold tabular-nums">{Math.round((unlocked / results.length) * 100)}%</span>
          </div>
        </div>

        {/* Achievement list */}
        <div className="space-y-0.5">
          {display.map((a) => (
            <div key={a.id}>
              <button onClick={() => setSelected(selected === a.id ? null : a.id)}
                className={`w-full flex items-center gap-2 p-1.5 rounded transition-all text-left ${a.unlocked ? "glass-inset" : "glass-inset opacity-40"}`}>
                <span className="text-sm lg:text-base shrink-0">{a.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className={`text-[9px] lg:text-[11px] font-semibold truncate ${a.unlocked ? "text-white" : "text-dark-500"}`}>{a.name}</div>
                  <div className="text-[7px] lg:text-[8px] text-dark-600 truncate">{a.desc}</div>
                </div>
                {a.unlocked && <span className="text-emerald-400 shrink-0"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg></span>}
              </button>
              {/* Expanded description */}
              {selected === a.id && (
                <div className="glass-inset rounded p-2 mt-0.5 mb-0.5 animate-fade-in">
                  <p className="text-dark-400 text-[8px] lg:text-[10px] leading-relaxed">{a.detail}</p>
                  <div className="mt-1 flex items-center gap-1">
                    <span className={`text-[7px] font-semibold px-1.5 py-px rounded ${a.unlocked ? "bg-emerald-500/15 text-emerald-400" : "bg-dark-700 text-dark-500"}`}>
                      {a.unlocked ? "UNLOCKED" : "LOCKED"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <button onClick={() => setShowAll(!showAll)} className="w-full mt-1.5 text-dark-500 text-[8px] lg:text-[9px] font-medium hover:text-dark-300 transition-colors py-1">
          {showAll ? "Show less" : `Show all ${results.length} achievements`}
        </button>

        {/* Next to unlock */}
        {(() => {
          const next = results.find((r) => !r.unlocked);
          if (!next) return <div className="mt-1 text-center text-emerald-400 text-[9px] font-semibold">All achievements unlocked!</div>;
          return (
            <div className="mt-1 glass-inset rounded p-2 flex items-center gap-2">
              <span className="text-sm opacity-60">{next.icon}</span>
              <div className="min-w-0 flex-1">
                <div className="text-dark-300 text-[9px] lg:text-[10px] font-semibold">Next: {next.name}</div>
                <div className="text-dark-600 text-[7px] lg:text-[8px]">{next.desc}</div>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
