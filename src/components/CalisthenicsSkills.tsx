"use client";

import { useState, useEffect, useMemo } from "react";

interface SkillLevel {
  name: string;
  exercise: string;
  hold?: boolean; // static hold
  tip: string;
}

interface Skill {
  id: string;
  name: string;
  category: "push" | "pull" | "legs" | "core" | "hold";
  description: string;
  icon: string;
  muscles: string[];
  levels: SkillLevel[];
}

const SKILLS: Skill[] = [
  {
    id: "pushup", name: "Push-Up Mastery", category: "push", icon: "🤸",
    description: "Foundation of pushing strength, from wall to one-arm.",
    muscles: ["Chest", "Triceps", "Front Delts", "Core"],
    levels: [
      { name: "Wall Push-Up", exercise: "Incline Push-Ups", tip: "Hands high, full body tight." },
      { name: "Incline Push-Up", exercise: "Incline Push-Ups", tip: "Use a bench, chest to edge." },
      { name: "Knee Push-Up", exercise: "Push-Ups", tip: "Keep hips in line, don't sag." },
      { name: "Full Push-Up", exercise: "Push-Ups", tip: "Elbows ~45°, chest to floor." },
      { name: "Wide / Diamond", exercise: "Wide Push-Ups", tip: "Wide = chest, Diamond = triceps." },
      { name: "Archer Push-Up", exercise: "Archer Push-Ups", tip: "One arm straight, other bends." },
      { name: "One-Arm Push-Up", exercise: "One-Arm Push-Ups", tip: "Feet wide, core braced hard." },
    ],
  },
  {
    id: "pullup", name: "Pull-Up Mastery", category: "pull", icon: "🦍",
    description: "Vertical pull strength ladder.",
    muscles: ["Lats", "Biceps", "Mid Back", "Forearms"],
    levels: [
      { name: "Dead Hang", exercise: "Dead Hangs", hold: true, tip: "Hang 30s+, shoulders down." },
      { name: "Scapular Pull", exercise: "Scapular Pull-Ups", tip: "Depress scapula, no elbow bend." },
      { name: "Australian Row", exercise: "Australian Pull-Ups", tip: "Body straight, chest to bar." },
      { name: "Negative Pull-Up", exercise: "Negative Pull-Ups", tip: "Jump up, 5s lower." },
      { name: "Pull-Up", exercise: "Pull-Ups", tip: "Full hang to chin over bar." },
      { name: "L-Sit Pull-Up", exercise: "L-Sit Pull-Ups", tip: "Legs 90°, no kipping." },
      { name: "Archer Pull-Up", exercise: "Archer Pull-Ups", tip: "One arm extended, other pulls." },
      { name: "One-Arm Chin-Up", exercise: "One-Arm Chin-Up", hold: false, tip: "Use towel assist to start." },
    ],
  },
  {
    id: "dip", name: "Dip Strength", category: "push", icon: "⬇️",
    description: "From bench dips to impossible dips.",
    muscles: ["Lower Chest", "Triceps", "Front Delts"],
    levels: [
      { name: "Bench Dip", exercise: "Bench Dips", tip: "Shoulders down, elbows back." },
      { name: "Parallel Bar Dip", exercise: "Dips", tip: "Lean slightly forward." },
      { name: "Ring Dip", exercise: "Ring Dips", tip: "Rings turned out at top." },
      { name: "Korean Dip", exercise: "Korean Dips", tip: "Extreme shoulder extension." },
      { name: "Impossible Dip", exercise: "Impossible Dips", tip: "Elbows in front of body." },
    ],
  },
  {
    id: "muscleup", name: "Muscle-Up", category: "pull", icon: "💥",
    description: "Pull + push transition mastery.",
    muscles: ["Lats", "Chest", "Triceps", "Biceps"],
    levels: [
      { name: "Explosive Pull-Up", exercise: "Explosive Pull-Ups", tip: "Chest to bar, fast." },
      { name: "High Pull-Up", exercise: "Pull-Ups", tip: "Pull to belly button height." },
      { name: "Negative MU", exercise: "Negative Muscle-Up", tip: "Start top, slow lower." },
      { name: "Bar Muscle-Up", exercise: "Bar Muscle-Up", tip: "Drive knees, fast transition." },
      { name: "Ring Muscle-Up", exercise: "Ring Muscle-Ups", tip: "False grip, turn out slowly." },
      { name: "Strict Muscle-Up", exercise: "Strict Muscle-Up", tip: "No kip, pure strength." },
    ],
  },
  {
    id: "handstand", name: "Handstand", category: "hold", icon: "🤸‍♂️",
    description: "Balance and overhead stability.",
    muscles: ["Front Delts", "Traps", "Abs", "Triceps"],
    levels: [
      { name: "Wall Plank", exercise: "Wall Walks", tip: "Walk up wall, hold 20s." },
      { name: "Chest-to-Wall Hold", exercise: "Handstand Hold", hold: true, tip: "Only toes touch wall." },
      { name: "Back-to-Wall Hold", exercise: "Handstand Hold", hold: true, tip: "Belly to wall, hollow body." },
      { name: "Freestanding Attempt", exercise: "Handstand Hold", hold: true, tip: "Kick up, use fingers to balance." },
      { name: "Freestanding Hold 30s", exercise: "Handstand Hold", hold: true, tip: "Look between hands, not down." },
      { name: "Handstand Walk", exercise: "Handstand Walk", tip: "Small steps, hips over hands." },
    ],
  },
  {
    id: "hspu", name: "Handstand Push-Up", category: "push", icon: "🔺",
    description: "Overhead pressing on hands.",
    muscles: ["Front Delts", "Triceps", "Traps"],
    levels: [
      { name: "Pike Push-Up", exercise: "Pike Push-Ups", tip: "Hips high, head to floor." },
      { name: "Elevated Pike", exercise: "Decline Pike Push-Ups", tip: "Feet on box, vertical torso." },
      { name: "Wall HSPU Negatives", exercise: "Negative Dips", tip: "Lower slowly from handstand." },
      { name: "Wall HSPU", exercise: "Wall HSPU", tip: "Kipping ok at first." },
      { name: "Freestanding HSPU", exercise: "Freestanding HSPU", tip: "Full range, head to hands." },
      { name: "Deficit HSPU", exercise: "Deficit Handstand Push-Up", tip: "Hands on blocks, deeper range." },
    ],
  },
  {
    id: "lsit", name: "L-Sit / V-Sit", category: "core", icon: "🧘",
    description: "Compression and hip flexor strength.",
    muscles: ["Abs", "Quads", "Front Delts"],
    levels: [
      { name: "Foot-Supported L", exercise: "Tuck L-Sit", tip: "Hands by hips, press floor away." },
      { name: "Tuck L-Sit", exercise: "Tuck L-Sit", tip: "Knees to chest, hold 10s." },
      { name: "One-Leg L-Sit", exercise: "L-Sits", tip: "One leg extended, alternate." },
      { name: "Straddle L-Sit", exercise: "Straddle L-Sit", tip: "Legs wide, easier than full." },
      { name: "Full L-Sit", exercise: "L-Sits", hold: true, tip: "Legs straight, toes pointed." },
      { name: "V-Sit", exercise: "V-Sit Hold", hold: true, tip: "Lean back slightly, legs high." },
      { name: "Manna Intro", exercise: "Manna", hold: true, tip: "Hands behind, hips forward." },
    ],
  },
  {
    id: "frontlever", name: "Front Lever", category: "pull", icon: "🏋️",
    description: "Straight-body horizontal pulling.",
    muscles: ["Lats", "Abs", "Rear Delts"],
    levels: [
      { name: "Scapular Pulls", exercise: "Scapular Pull-Ups", tip: "Depress and retract." },
      { name: "Tuck FL Hold", exercise: "Tuck Front Lever", hold: true, tip: "Knees tucked, back flat." },
      { name: "Adv Tuck FL", exercise: "Tuck Front Lever", hold: true, tip: "Hips higher, thighs flat." },
      { name: "One-Leg FL", exercise: "Straddle Front Lever", hold: true, tip: "One leg straight, one tucked." },
      { name: "Straddle FL", exercise: "Straddle Front Lever", hold: true, tip: "Legs wide, hips level." },
      { name: "Full FL", exercise: "Full Front Lever", hold: true, tip: "Body straight, toes pointed." },
    ],
  },
  {
    id: "backlever", name: "Back Lever", category: "pull", icon: "🔄",
    description: "Posterior chain and shoulder extension.",
    muscles: ["Biceps", "Rear Delts", "Lats", "Abs"],
    levels: [
      { name: "Skin the Cat", exercise: "Skin the Cat", tip: "Slow and controlled, feel stretch." },
      { name: "German Hang", exercise: "German Hang", hold: true, tip: "Arms straight, 10-20s." },
      { name: "Tuck BL", exercise: "Back Lever", hold: true, tip: "Knees to chest, arms straight." },
      { name: "Straddle BL", exercise: "Back Lever", hold: true, tip: "Legs straddled, body flat." },
      { name: "Full BL", exercise: "Back Lever", hold: true, tip: "Supinated grip safer at first." },
    ],
  },
  {
    id: "planche", name: "Planche", category: "push", icon: "✈️",
    description: "The holy grail of pushing.",
    muscles: ["Front Delts", "Chest", "Triceps", "Abs"],
    levels: [
      { name: "Frog Stand", exercise: "Frog Stand", hold: true, tip: "Knees on elbows, lean forward." },
      { name: "Planche Lean", exercise: "Planche Lean", hold: true, tip: "Shoulders past hands." },
      { name: "Tuck Planche", exercise: "Tuck Planche", hold: true, tip: "Back rounded, hold 10s." },
      { name: "Adv Tuck", exercise: "Tuck Planche", hold: true, tip: "Hips flat, knees slightly open." },
      { name: "Straddle Planche", exercise: "Straddle Planche", hold: true, tip: "Wide legs, protract scapula." },
      { name: "Full Planche", exercise: "Full Planche", hold: true, tip: "The ultimate. Years of work." },
    ],
  },
  {
    id: "flag", name: "Human Flag", category: "core", icon: "🚩",
    description: "Lateral chain anti-gravity hold.",
    muscles: ["Obliques", "Lats", "Front Delts"],
    levels: [
      { name: "Side Plank 30s", exercise: "Side Plank Dips", hold: true, tip: "Top leg lifted for harder." },
      { name: "Vertical Flag Press", exercise: "Human Flag Progressions", tip: "Top hand pull, bottom push." },
      { name: "Straddle Flag", exercise: "Human Flag (straddle)", hold: true, tip: "Wide legs = easier leverage." },
      { name: "Full Flag", exercise: "Human Flag", hold: true, tip: "Body straight, both legs together." },
    ],
  },
  {
    id: "pistol", name: "Pistol Squat", category: "legs", icon: "🦵",
    description: "Single-leg squat mastery.",
    muscles: ["Quads", "Glutes", "Abs"],
    levels: [
      { name: "Assisted Pistol", exercise: "Single-Leg Squats to Box", tip: "Hold doorframe or TRX." },
      { name: "Box Pistol", exercise: "Single-Leg Squats to Box", tip: "Sit to box, stand up." },
      { name: "Full Pistol", exercise: "Pistol Squats", tip: "Free arm forward, heel flat." },
      { name: "Weighted Pistol", exercise: "Kettlebell Pistol Squat", tip: "Goblet hold, keep upright." },
    ],
  },
  {
    id: "dragonflag", name: "Dragon Flag", category: "core", icon: "🐉",
    description: "Bruce Lee's favorite core destroyer.",
    muscles: ["Abs", "Obliques", "Lats"],
    levels: [
      { name: "Tuck Dragon Flag", exercise: "Dragon Flag Negatives", tip: "Negative only at first." },
      { name: "Straddle Dragon", exercise: "Dragon Flag Negatives", tip: "Wide legs, control descent." },
      { name: "Full Dragon Flag", exercise: "Dragon Flags", tip: "Only shoulders touch bench." },
      { name: "Dragon Press", exercise: "Dragon Press", tip: "Press from hinge, not just negative." },
    ],
  },
  {
    id: "onearm", name: "One-Arm Chin-Up", category: "pull", icon: "💪",
    description: "Elite pulling strength.",
    muscles: ["Lats", "Biceps", "Forearms"],
    levels: [
      { name: "Archer Chin-Up", exercise: "Archer Pull-Ups", tip: "One arm does 80% work." },
      { name: "Assisted OAC", exercise: "One-Arm Chin-Up", tip: "Other hand on towel/band." },
      { name: "Negative OAC", exercise: "Negative Pull-Ups", tip: "One arm, slow 5s down." },
      { name: "Full OAC", exercise: "One-Arm Chin-Up", tip: "The pinnacle. 1 clean rep." },
    ],
  },
];

const CAT_COLORS: Record<string, string> = {
  push: "bg-blue-500/10 text-blue-400",
  pull: "bg-emerald-500/10 text-emerald-400",
  legs: "bg-purple-500/10 text-purple-400",
  core: "bg-amber-500/10 text-amber-400",
  hold: "bg-cyan-500/10 text-cyan-400",
};

export default function CalisthenicsSkills() {
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [selectedCat, setSelectedCat] = useState<string>("all");
  const [openSkill, setOpenSkill] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const s = localStorage.getItem("mm_cali_progress");
    if (s) { try { setProgress(JSON.parse(s)); } catch {} }
  }, []);

  const saveLevel = (skillId: string, level: number) => {
    const np = { ...progress, [skillId]: level };
    setProgress(np);
    localStorage.setItem("mm_cali_progress", JSON.stringify(np));
  };

  const filtered = useMemo(() => {
    return SKILLS.filter((s) => {
      if (selectedCat !== "all" && s.category !== selectedCat) return false;
      if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.description.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [selectedCat, search]);

  const totalUnlocked = Object.values(progress).reduce((a, b) => a + b, 0);
  const totalPossible = SKILLS.reduce((a, s) => a + s.levels.length - 1, 0);
  const overallPct = totalPossible > 0 ? Math.round((totalUnlocked / totalPossible) * 100) : 0;

  return (
    <div className="glass-card rounded-lg lg:rounded-xl overflow-hidden">
      <div className="h-0.5 bg-gradient-to-r from-orange-500 to-transparent" />
      <div className="p-2.5 lg:p-3">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 lg:w-7 lg:h-7 rounded-md bg-orange-500/10 flex items-center justify-center">
              <span className="text-[12px]">🤸‍♂️</span>
            </div>
            <div>
              <h3 className="text-white font-semibold text-[11px] lg:text-[14px] tracking-tight">Calisthenics Skills</h3>
              <p className="text-dark-600 text-[8px] lg:text-[9px]">{SKILLS.length} skills · {overallPct}% overall · tap to track</p>
            </div>
          </div>
          <div className="w-12 h-1.5 bar-track"><div className="bar-fill bg-orange-500" style={{ width: `${overallPct}%` }} /></div>
        </div>

        {/* Search */}
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search skills..." className="input-field !text-[10px] !py-1 mb-2" />

        {/* Category filter */}
        <div className="flex gap-1 mb-2 overflow-x-auto no-scrollbar">
          {["all", "push", "pull", "legs", "core", "hold"].map((c) => (
            <button key={c} onClick={() => setSelectedCat(c)}
              className={`shrink-0 px-2 py-1 rounded text-[8px] font-medium capitalize transition-all ${selectedCat === c ? "bg-orange-500/15 text-orange-400" : "bg-white/[.04] text-dark-500"}`}>
              {c === "all" ? "All" : c}
            </button>
          ))}
        </div>

        {/* Skills grid */}
        <div className="space-y-1 max-h-[420px] overflow-y-auto scrollbar-thin pr-0.5">
          {filtered.map((skill) => {
            const cur = progress[skill.id] ?? 0;
            const pct = skill.levels.length > 1 ? Math.round((cur / (skill.levels.length - 1)) * 100) : 0;
            const isOpen = openSkill === skill.id;
            const curLevel = skill.levels[cur];
            const nextLevel = cur < skill.levels.length - 1 ? skill.levels[cur + 1] : null;

            return (
              <div key={skill.id}>
                <button onClick={() => setOpenSkill(isOpen ? null : skill.id)} className="w-full glass-inset rounded p-2 flex items-center gap-2 hover:bg-white/[.02] transition-all text-left">
                  <span className="text-sm shrink-0">{skill.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-white text-[10px] lg:text-[11px] font-semibold truncate">{skill.name}</span>
                      <span className={`text-[6px] font-medium px-1 py-px rounded capitalize ${CAT_COLORS[skill.category]}`}>{skill.category}</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className="flex-1 bar-track !h-[3px]"><div className="bar-fill bg-orange-500" style={{ width: `${pct}%` }} /></div>
                      <span className="text-[7px] text-dark-500 tabular-nums">{cur}/{skill.levels.length - 1}</span>
                    </div>
                  </div>
                  <span className="text-[7px] text-dark-600 shrink-0">{pct}%</span>
                </button>

                {isOpen && (
                  <div className="glass-inset rounded p-2.5 mt-0.5 animate-fade-in space-y-2">
                    <p className="text-dark-400 text-[9px] leading-relaxed">{skill.description}</p>
                    <div className="flex flex-wrap gap-0.5">
                      {skill.muscles.map((m) => <span key={m} className="text-[7px] font-medium bg-white/[.04] text-dark-500 px-1 py-px rounded">{m}</span>)}
                    </div>

                    {/* Current level */}
                    <div className="bg-orange-500/5 border border-orange-500/10 rounded p-2">
                      <div className="text-orange-400 text-[8px] uppercase tracking-wider font-medium mb-0.5">Current Level {cur}: {curLevel?.name}</div>
                      <div className="text-dark-300 text-[9px] font-medium">{curLevel?.exercise} {curLevel?.hold && <span className="text-cyan-400">· HOLD</span>}</div>
                      <div className="text-dark-500 text-[8px] mt-0.5">Tip: {curLevel?.tip}</div>
                    </div>

                    {/* Next level */}
                    {nextLevel && (
                      <div className="bg-white/[.02] border border-white/[.04] rounded p-2">
                        <div className="text-dark-500 text-[8px] uppercase tracking-wider font-medium mb-0.5">Next Level {cur + 1}: {nextLevel.name}</div>
                        <div className="text-dark-400 text-[9px]">{nextLevel.exercise}</div>
                        <div className="text-dark-600 text-[8px] mt-0.5">Tip: {nextLevel.tip}</div>
                      </div>
                    )}

                    {/* Progress controls */}
                    <div className="flex gap-1">
                      <button disabled={cur === 0} onClick={() => saveLevel(skill.id, Math.max(0, cur - 1))} className="flex-1 h-6 rounded text-[9px] font-medium bg-white/[.04] text-dark-400 disabled:opacity-30">◀ Prev</button>
                      <button disabled={cur >= skill.levels.length - 1} onClick={() => saveLevel(skill.id, Math.min(skill.levels.length - 1, cur + 1))} className="flex-1 h-6 rounded text-[9px] font-semibold bg-orange-600 text-white disabled:opacity-30">✓ Complete → Next</button>
                    </div>

                    {/* All levels */}
                    <div className="space-y-px">
                      {skill.levels.map((lvl, idx) => (
                        <div key={idx} className={`flex items-center gap-1.5 px-1.5 py-0.5 rounded text-[8px] ${idx === cur ? "bg-orange-500/10 text-orange-300" : idx < cur ? "text-green-400/60" : "text-dark-600"}`}>
                          <span>{idx < cur ? "✅" : idx === cur ? "👉" : "⬜"}</span>
                          <span className="flex-1 truncate">{idx}. {lvl.name}</span>
                          <span className="text-[7px] opacity-60">{lvl.exercise}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && <div className="text-center py-4 text-dark-600 text-[10px]">No skills found</div>}

        {/* Reset progress */}
        <button onClick={() => { if (confirm("Reset all calisthenics progress?")) { setProgress({}); localStorage.removeItem("mm_cali_progress"); } }} className="w-full mt-2 text-dark-700 text-[7px] hover:text-red-400 transition-colors">
          Reset progress
        </button>
      </div>
    </div>
  );
}
