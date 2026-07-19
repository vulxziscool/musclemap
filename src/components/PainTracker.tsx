"use client";

import { useState, useEffect } from "react";
import { todayET } from "@/lib/timezone";

interface PainEntry {
  id: string;
  date: string;
  area: string;
  level: number;
  description: string;
}

const BODY_AREAS = [
  { id: "neck", name: "Neck", icon: "🔴" },
  { id: "shoulder_l", name: "Left Shoulder", icon: "🦾" },
  { id: "shoulder_r", name: "Right Shoulder", icon: "🦾" },
  { id: "upper_back", name: "Upper Back", icon: "🔙" },
  { id: "lower_back", name: "Lower Back", icon: "⬇️" },
  { id: "chest", name: "Chest", icon: "🫁" },
  { id: "elbow_l", name: "Left Elbow", icon: "💪" },
  { id: "elbow_r", name: "Right Elbow", icon: "💪" },
  { id: "wrist_l", name: "Left Wrist", icon: "🤲" },
  { id: "wrist_r", name: "Right Wrist", icon: "🤲" },
  { id: "hip_l", name: "Left Hip", icon: "🦴" },
  { id: "hip_r", name: "Right Hip", icon: "🦴" },
  { id: "knee_l", name: "Left Knee", icon: "🦵" },
  { id: "knee_r", name: "Right Knee", icon: "🦵" },
  { id: "ankle_l", name: "Left Ankle", icon: "🦶" },
  { id: "ankle_r", name: "Right Ankle", icon: "🦶" },
  { id: "shin", name: "Shins", icon: "🦿" },
  { id: "hamstring", name: "Hamstrings", icon: "🦵" },
  { id: "quad", name: "Quads", icon: "🦵" },
  { id: "calf", name: "Calves", icon: "🦶" },
  { id: "forearm", name: "Forearms", icon: "💪" },
  { id: "glute", name: "Glutes", icon: "🍑" },
  { id: "abs_area", name: "Abdominal", icon: "🎯" },
];

const REHAB_RECOMMENDATIONS: Record<string, { avoid: string[]; rehab: string[]; tips: string[] }> = {
  neck: {
    avoid: ["Heavy shrugs", "Behind-the-neck press", "Upright rows"],
    rehab: ["Neck CARs", "Thoracic Cat-Cow", "Chin tucks (3×10)", "Gentle neck stretches (30s holds)", "Foam Roll Upper Back"],
    tips: ["Avoid looking up/down during exercises", "Sleep with proper pillow support", "Take breaks from phone/computer every 20 min", "Apply heat before training, ice after"],
  },
  shoulder_l: {
    avoid: ["Behind-the-neck press", "Upright rows", "Wide-grip bench press", "Heavy overhead pressing"],
    rehab: ["Banded External Rotation", "Banded Internal Rotation", "Shoulder Wall Angels", "Band Dislocates", "Face Pull (band)", "Scapular Push-Ups", "YTW Raises (incline)", "Sleeper Stretch"],
    tips: ["Reduce overhead volume by 50%", "Focus on scapular control before pressing", "Warm up rotator cuff for 5 min before any push/pull", "Use neutral grip for pressing if pain persists"],
  },
  shoulder_r: {
    avoid: ["Behind-the-neck press", "Upright rows", "Wide-grip bench press", "Heavy overhead pressing"],
    rehab: ["Banded External Rotation", "Banded Internal Rotation", "Shoulder Wall Angels", "Band Dislocates", "Face Pull (band)", "Scapular Push-Ups", "YTW Raises (incline)", "Sleeper Stretch"],
    tips: ["Reduce overhead volume by 50%", "Focus on scapular control before pressing", "Warm up rotator cuff for 5 min before any push/pull", "Use neutral grip for pressing if pain persists"],
  },
  upper_back: {
    avoid: ["Heavy deadlifts", "Bent-over rows with rounded back"],
    rehab: ["Thoracic Cat-Cow", "Thoracic Spine Rotation", "Foam Roll Upper Back", "Prone Scapular Squeezes", "Band Pull-Aparts", "Dead Hangs"],
    tips: ["Focus on posture throughout the day", "Stretch chest and anterior shoulders", "Strengthen rhomboids and mid-traps", "Use a foam roller daily for 2 minutes"],
  },
  lower_back: {
    avoid: ["Heavy deadlifts", "Good mornings with heavy weight", "Sit-ups/crunches", "Rounded-back lifting"],
    rehab: ["Bird Dogs", "Dead Bugs", "Jefferson Curls (light)", "Hip 90/90 Stretch", "Pigeon Stretch", "Couch Stretch", "Reverse Hyper (bodyweight)", "Glute Bridges"],
    tips: ["Brace core before every lift", "Stretch hip flexors daily — tight hips pull on lower back", "Strengthen glutes — weak glutes overload the lower back", "Avoid sitting for more than 30 min at a time", "Consider deloading for 1 week"],
  },
  chest: {
    avoid: ["Heavy bench press", "Deep dips", "Wide flyes"],
    rehab: ["Lacrosse Ball Pec Release", "Cross-Body Shoulder Stretch", "Light push-ups (controlled)", "Band Dislocates", "Doorway chest stretch (30s)"],
    tips: ["Reduce pressing volume temporarily", "Check bench press form — don't flare elbows past 45°", "Warm up with light band work before pressing", "If sharp pain, see a doctor — could be pec strain"],
  },
  elbow_l: {
    avoid: ["Heavy curls", "Skull crushers", "Close-grip bench", "Pull-ups (if painful)"],
    rehab: ["Wrist Flexor Stretch", "Wrist Extensor Stretch", "Wrist Circles", "Reverse curls (very light)", "Eccentric wrist curls", "Forearm self-massage"],
    tips: ["This is likely tennis or golfer's elbow", "Reduce grip-intensive work", "Use elbow sleeves or a compression band", "Ice after training, heat before", "Eccentric loading heals tendons faster than rest alone"],
  },
  elbow_r: {
    avoid: ["Heavy curls", "Skull crushers", "Close-grip bench", "Pull-ups (if painful)"],
    rehab: ["Wrist Flexor Stretch", "Wrist Extensor Stretch", "Wrist Circles", "Reverse curls (very light)", "Eccentric wrist curls", "Forearm self-massage"],
    tips: ["This is likely tennis or golfer's elbow", "Reduce grip-intensive work", "Use elbow sleeves or a compression band", "Ice after training, heat before", "Eccentric loading heals tendons faster than rest alone"],
  },
  wrist_l: {
    avoid: ["Front rack position", "Push-ups on flat hands", "Heavy pressing"],
    rehab: ["Wrist Circles", "Wrist Flexor Stretch", "Wrist Extensor Stretch", "Wrist Rollers", "Rice bucket exercises"],
    tips: ["Use parallettes or push-up handles", "Gradually increase wrist flexibility", "Avoid excessive wrist extension under load", "Wrap wrists for heavy pressing if needed"],
  },
  wrist_r: {
    avoid: ["Front rack position", "Push-ups on flat hands", "Heavy pressing"],
    rehab: ["Wrist Circles", "Wrist Flexor Stretch", "Wrist Extensor Stretch", "Wrist Rollers", "Rice bucket exercises"],
    tips: ["Use parallettes or push-up handles", "Gradually increase wrist flexibility", "Avoid excessive wrist extension under load", "Wrap wrists for heavy pressing if needed"],
  },
  hip_l: {
    avoid: ["Deep squats", "Wide-stance deadlifts", "Heavy lunges"],
    rehab: ["Hip CARs", "Hip 90/90 Stretch", "Pigeon Stretch", "Couch Stretch", "World's Greatest Stretch", "Fire Hydrants", "Clamshells", "Single-Leg Glute Bridge"],
    tips: ["Not all hips can squat ATG — respect your anatomy", "Strengthen glute medius to stabilize the hip", "Clicking without pain is usually fine", "If groin pain, reduce adductor-heavy movements"],
  },
  hip_r: {
    avoid: ["Deep squats", "Wide-stance deadlifts", "Heavy lunges"],
    rehab: ["Hip CARs", "Hip 90/90 Stretch", "Pigeon Stretch", "Couch Stretch", "World's Greatest Stretch", "Fire Hydrants", "Clamshells", "Single-Leg Glute Bridge"],
    tips: ["Not all hips can squat ATG — respect your anatomy", "Strengthen glute medius to stabilize the hip", "Clicking without pain is usually fine", "If groin pain, reduce adductor-heavy movements"],
  },
  knee_l: {
    avoid: ["Deep squats (if painful)", "Leg extensions (heavy)", "Jump squats", "Running downhill"],
    rehab: ["Terminal Knee Extensions", "Peterson Step-Ups", "Spanish Squats (band)", "Wall Sits (pain-free range)", "Single-Leg Glute Bridge", "Foam Roll Quads", "Foam Roll IT Band"],
    tips: ["Strengthen VMO (inner quad) with terminal knee extensions", "Knee pain often comes from weak hips — strengthen glute medius", "Don't let knees cave inward during squats", "Use knee sleeves for support and warmth"],
  },
  knee_r: {
    avoid: ["Deep squats (if painful)", "Leg extensions (heavy)", "Jump squats", "Running downhill"],
    rehab: ["Terminal Knee Extensions", "Peterson Step-Ups", "Spanish Squats (band)", "Wall Sits (pain-free range)", "Single-Leg Glute Bridge", "Foam Roll Quads", "Foam Roll IT Band"],
    tips: ["Strengthen VMO (inner quad) with terminal knee extensions", "Knee pain often comes from weak hips — strengthen glute medius", "Don't let knees cave inward during squats", "Use knee sleeves for support and warmth"],
  },
  ankle_l: {
    avoid: ["Heavy calf raises (if painful)", "Box jumps", "Sprinting"],
    rehab: ["Ankle Circles", "Banded Ankle Dorsiflexion", "Calf Stretch (wall)", "Tibialis Raise", "Single-Leg Calf Raises (pain-free)", "Balance on one foot (30s)"],
    tips: ["Test dorsiflexion: knee should pass 4\" past toes", "Tight calves are the #1 cause of ankle issues", "Elevated heel squat shoes help if dorsiflexion is limited", "If swollen, use RICE: Rest, Ice, Compression, Elevation"],
  },
  ankle_r: {
    avoid: ["Heavy calf raises (if painful)", "Box jumps", "Sprinting"],
    rehab: ["Ankle Circles", "Banded Ankle Dorsiflexion", "Calf Stretch (wall)", "Tibialis Raise", "Single-Leg Calf Raises (pain-free)", "Balance on one foot (30s)"],
    tips: ["Test dorsiflexion: knee should pass 4\" past toes", "Tight calves are the #1 cause of ankle issues", "Elevated heel squat shoes help if dorsiflexion is limited", "If swollen, use RICE: Rest, Ice, Compression, Elevation"],
  },
  shin: {
    avoid: ["Running", "Jump rope", "Box jumps", "Sprinting"],
    rehab: ["Tibialis Raise", "Ankle Circles", "Calf Stretch (wall)", "Toe walks (2 min)", "Heel walks (2 min)"],
    tips: ["Shin splints come from overuse — reduce impact exercises", "Strengthen tibialis anterior with tibialis raises", "Run on softer surfaces", "Check your shoes — worn-out shoes cause shin pain"],
  },
  hamstring: {
    avoid: ["Romanian deadlifts (heavy)", "Sprinting", "Nordic curls (if acute)"],
    rehab: ["Light Romanian Deadlifts (bodyweight)", "Glute Bridges", "Single-Leg Glute Bridge", "Nordic curls (eccentric only, slow)", "Foam roll hamstrings", "Seated hamstring stretch (30s)"],
    tips: ["Hamstring strains take 2-6 weeks to heal", "Don't stretch aggressively — gentle tension only", "Eccentric exercises heal hamstring tears faster", "Strengthen glutes to reduce hamstring load"],
  },
  quad: {
    avoid: ["Heavy squats", "Leg extensions (if painful)", "Jump squats"],
    rehab: ["Foam Roll Quads", "Couch Stretch", "Wall Sits (pain-free)", "Bodyweight Squats (slow, controlled)", "Step-Ups (low box)"],
    tips: ["Quad strains often come from overuse — deload for a week", "Stretch quads after every leg session", "Apply heat before training, ice after", "If pain is near the knee, it might be patellar tendinitis"],
  },
  calf: {
    avoid: ["Heavy calf raises", "Running", "Jump rope", "Sprinting"],
    rehab: ["Calf Stretch (wall)", "Eccentric calf raises (slow lowering)", "Ankle Circles", "Tibialis Raise", "Foam roll calves"],
    tips: ["Achilles tendinitis needs eccentric loading, not rest", "Stretch calves for 60s per side daily", "Avoid sudden increases in running volume", "If a lump forms in the calf, see a doctor immediately"],
  },
  forearm: {
    avoid: ["Heavy gripping exercises", "Farmer's walks", "Heavy curls", "Deadlifts without straps"],
    rehab: ["Wrist Flexor Stretch", "Wrist Extensor Stretch", "Wrist Circles", "Reverse Wrist Curls (light)", "Forearm self-massage", "Rice bucket exercises"],
    tips: ["Use lifting straps to reduce grip demand temporarily", "Forearm pain is often tendinitis — reduce volume", "Eccentric wrist curls are the gold standard treatment", "Take breaks from typing/phone use"],
  },
  glute: {
    avoid: ["Heavy hip thrusts", "Deep squats", "Sprinting"],
    rehab: ["Lacrosse Ball Glutes", "Pigeon Stretch", "Hip 90/90 Stretch", "Glute Bridges (bodyweight)", "Fire Hydrants", "Clamshells"],
    tips: ["Glute pain can be piriformis syndrome — lacrosse ball massage helps", "If pain shoots down your leg, it could be sciatica — see a doctor", "Stretch hip external rotators daily", "Strengthen glute medius with banded walks"],
  },
  abs_area: {
    avoid: ["Sit-ups", "Crunches", "Heavy ab wheel rollouts", "V-ups"],
    rehab: ["Dead Bugs", "Bird Dogs", "Light planks (pain-free)", "Diaphragmatic breathing (3 min)", "Gentle pelvic tilts"],
    tips: ["Abdominal strains need rest — avoid flexion-based core work", "If pain is low and central, could be a hernia — see a doctor", "Brace your core during all lifts to prevent re-injury", "Return to core training gradually with anti-extension (planks) before flexion (crunches)"],
  },
};

export default function PainTracker() {
  const [entries, setEntries] = useState<PainEntry[]>([]);
  const [showLog, setShowLog] = useState(false);
  const [selectedArea, setSelectedArea] = useState("");
  const [painLevel, setPainLevel] = useState(5);
  const [description, setDescription] = useState("");
  const [viewArea, setViewArea] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("mm_pain_log");
    if (saved) setEntries(JSON.parse(saved));
  }, []);

  const saveEntry = () => {
    if (!selectedArea) return;
    const entry: PainEntry = { id: Date.now().toString(36), date: todayET(), area: selectedArea, level: painLevel, description: description.trim() };
    const updated = [entry, ...entries].slice(0, 50);
    setEntries(updated);
    localStorage.setItem("mm_pain_log", JSON.stringify(updated));
    setShowLog(false);
    setSelectedArea("");
    setDescription("");
    setPainLevel(5);
    setViewArea(selectedArea);
  };

  const deleteEntry = (id: string) => {
    const updated = entries.filter((e) => e.id !== id);
    setEntries(updated);
    localStorage.setItem("mm_pain_log", JSON.stringify(updated));
  };

  const rec = viewArea ? REHAB_RECOMMENDATIONS[viewArea] || null : null;
  const areaName = BODY_AREAS.find((a) => a.id === viewArea)?.name || "";
  const areaEntries = entries.filter((e) => e.area === viewArea);
  const activeAreas = [...new Set(entries.slice(0, 10).map((e) => e.area))];

  return (
    <div className="glass-card rounded-lg lg:rounded-xl overflow-hidden">
      <div className="h-0.5 bg-gradient-to-r from-red-500 to-transparent" />
      <div className="p-2.5 lg:p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 lg:w-7 lg:h-7 rounded-md bg-red-500/10 flex items-center justify-center">
              <svg className="w-3 h-3 lg:w-3.5 lg:h-3.5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <div>
              <h3 className="text-white font-semibold text-[11px] lg:text-[14px] tracking-tight">Pain & Discomfort</h3>
              <p className="text-dark-600 text-[8px] lg:text-[9px]">Log pain, get rehab exercises</p>
            </div>
          </div>
          <button onClick={() => { setShowLog(!showLog); setViewArea(null); }} className="text-dark-400 hover:text-white h-6 w-6 rounded flex items-center justify-center hover:bg-white/5 transition-all">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          </button>
        </div>

        {/* Active pain areas quick buttons */}
        {activeAreas.length > 0 && !showLog && !viewArea && (
          <div className="flex flex-wrap gap-1 mb-2">
            {activeAreas.map((a) => {
              const area = BODY_AREAS.find((x) => x.id === a);
              const latest = entries.find((e) => e.area === a);
              return (
                <button key={a} onClick={() => setViewArea(a)} className="glass-inset rounded px-2 py-1 flex items-center gap-1 hover:bg-white/[.03] transition-all">
                  <span className="text-[10px]">{area?.icon}</span>
                  <span className="text-dark-300 text-[8px] font-medium">{area?.name}</span>
                  {latest && <span className={`text-[7px] font-bold ${latest.level >= 7 ? "text-red-400" : latest.level >= 4 ? "text-amber-400" : "text-green-400"}`}>{latest.level}/10</span>}
                </button>
              );
            })}
          </div>
        )}

        {/* Log new pain */}
        {showLog && (
          <div className="glass-inset rounded p-2.5 mb-2 animate-fade-in space-y-2">
            <div>
              <label className="text-dark-600 text-[8px] uppercase tracking-wider font-medium block mb-0.5">Where does it hurt?</label>
              <select value={selectedArea} onChange={(e) => setSelectedArea(e.target.value)} className="input-field !py-1 !text-[10px]">
                <option value="">Select body area...</option>
                {BODY_AREAS.map((a) => <option key={a.id} value={a.id}>{a.icon} {a.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-dark-600 text-[8px] uppercase tracking-wider font-medium block mb-0.5">Pain level: <span className={`font-bold ${painLevel >= 7 ? "text-red-400" : painLevel >= 4 ? "text-amber-400" : "text-green-400"}`}>{painLevel}/10</span></label>
              <input type="range" min="1" max="10" value={painLevel} onChange={(e) => setPainLevel(parseInt(e.target.value))} className="w-full h-1.5 bg-dark-700 rounded-full appearance-none cursor-pointer accent-red-500" />
              <div className="flex justify-between text-[7px] text-dark-700"><span>Mild</span><span>Moderate</span><span>Severe</span></div>
            </div>
            <div>
              <label className="text-dark-600 text-[8px] uppercase tracking-wider font-medium block mb-0.5">Describe (optional)</label>
              <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Sharp, dull, aching, tingling..." className="input-field !text-[10px] !py-1" />
            </div>
            <div className="flex gap-1.5">
              <button onClick={saveEntry} disabled={!selectedArea} className="flex-1 h-7 bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white text-[9px] font-semibold rounded transition-all">Log Pain</button>
              <button onClick={() => setShowLog(false)} className="h-7 px-3 glass-light text-dark-400 text-[9px] rounded hover:text-white transition-all">Cancel</button>
            </div>
          </div>
        )}

        {/* View rehab recommendations */}
        {viewArea && rec && (
          <div className="animate-fade-in space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-white text-[11px] font-semibold">{areaName} — Rehab Plan</span>
              <button onClick={() => setViewArea(null)} className="text-dark-500 text-[8px] hover:text-white">Close</button>
            </div>

            {/* Avoid */}
            <div className="glass-inset rounded p-2">
              <div className="text-red-400 text-[8px] uppercase tracking-wider font-medium mb-1">Avoid These Exercises</div>
              <div className="flex flex-wrap gap-0.5">
                {rec.avoid.map((e) => <span key={e} className="text-[8px] text-red-400/80 bg-red-500/8 px-1.5 py-0.5 rounded">{e}</span>)}
              </div>
            </div>

            {/* Rehab exercises */}
            <div className="glass-inset rounded p-2">
              <div className="text-green-400 text-[8px] uppercase tracking-wider font-medium mb-1">Recommended Rehab Exercises</div>
              <div className="flex flex-wrap gap-0.5">
                {rec.rehab.map((e) => <span key={e} className="text-[8px] text-green-400/80 bg-green-500/8 px-1.5 py-0.5 rounded">{e}</span>)}
              </div>
            </div>

            {/* Tips */}
            <div className="glass-inset rounded p-2">
              <div className="text-blue-400 text-[8px] uppercase tracking-wider font-medium mb-1">Recovery Tips</div>
              <div className="space-y-0.5">
                {rec.tips.map((t, i) => (
                  <div key={i} className="flex gap-1.5 text-[8px] text-dark-400 leading-relaxed">
                    <span className="text-blue-400/50 shrink-0">•</span><span>{t}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pain history for this area */}
            {areaEntries.length > 0 && (
              <div className="glass-inset rounded p-2">
                <div className="text-dark-500 text-[8px] uppercase tracking-wider font-medium mb-1">Pain History</div>
                <div className="space-y-0.5 max-h-20 overflow-y-auto scrollbar-thin">
                  {areaEntries.map((e) => (
                    <div key={e.id} className="flex items-center justify-between bg-black/15 rounded px-1.5 py-0.5">
                      <span className="text-dark-500 text-[7px]">{e.date.slice(5)}</span>
                      <span className={`text-[8px] font-bold ${e.level >= 7 ? "text-red-400" : e.level >= 4 ? "text-amber-400" : "text-green-400"}`}>{e.level}/10</span>
                      {e.description && <span className="text-dark-600 text-[7px] truncate max-w-[80px]">{e.description}</span>}
                      <button onClick={() => deleteEntry(e.id)} className="text-dark-700 hover:text-red-400 shrink-0"><svg className="w-2 h-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="text-center text-dark-700 text-[7px]">If pain is severe or persistent, please consult a medical professional.</div>
          </div>
        )}

        {/* Empty state */}
        {!showLog && !viewArea && activeAreas.length === 0 && (
          <div className="text-center py-2 text-dark-600 text-[9px]">No pain logged. Tap + to log discomfort and get rehab recommendations.</div>
        )}
      </div>
    </div>
  );
}
