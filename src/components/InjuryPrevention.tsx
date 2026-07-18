"use client";

import { useState } from "react";

const BODY_AREAS = [
  {
    id: "shoulder", name: "Shoulders", icon: "🦾",
    risks: "Rotator cuff tears, impingement, labrum tears, bursitis",
    causes: "Excessive overhead pressing, poor scapular control, weak rotator cuff, too much internal rotation",
    prehab: ["Banded External Rotation", "Banded Internal Rotation", "Shoulder Wall Angels", "Band Dislocates", "Face Pull (band)", "Prone Scapular Squeezes", "YTW Raises (incline)", "Cuban Rotation", "Scapular Push-Ups"],
    tips: [
      "Warm up rotator cuff before every push/pull session",
      "Balance pressing volume with equal pulling volume",
      "Avoid behind-the-neck movements if you have shoulder pain",
      "Keep shoulders packed and scapulae retracted during bench press",
      "Limit heavy overhead work to 2x per week maximum",
    ],
  },
  {
    id: "knee", name: "Knees", icon: "🦵",
    risks: "Patellar tendinitis, ACL/MCL sprains, meniscus tears, runner's knee",
    causes: "Excessive jumping, poor squat form, quad/hamstring imbalance, tight IT band",
    prehab: ["Terminal Knee Extensions", "Peterson Step-Ups", "Spanish Squats (band)", "Knee Circles", "Foam Roll IT Band", "Foam Roll Quads", "Single-Leg Glute Bridge"],
    tips: [
      "Strengthen VMO (inner quad) with terminal knee extensions",
      "Keep knees tracking over toes during squats — don't let them cave in",
      "Foam roll quads and IT band before leg sessions",
      "Build hamstring strength to balance quad dominance",
      "Avoid deep squats if you have acute knee pain — work partial range first",
    ],
  },
  {
    id: "lower_back", name: "Lower Back", icon: "🔙",
    risks: "Disc herniation, muscle strains, sciatica, spinal stenosis",
    causes: "Rounding during deadlifts, weak core, sitting too long, poor hip mobility",
    prehab: ["Jefferson Curls", "Bird Dogs", "Dead Bugs", "Reverse Hyper (bodyweight)", "Hip 90/90 Stretch", "Thoracic Cat-Cow", "Thoracic Spine Rotation", "McGill Big 3 (curl-up, side plank, bird dog)"],
    tips: [
      "Never round your lower back during deadlifts or rows",
      "Brace your core like you're about to get punched before every heavy lift",
      "Stretch hip flexors daily — tight hips pull on your lower back",
      "Strengthen glutes — weak glutes force your lower back to compensate",
      "Take movement breaks every 30 minutes if you sit all day",
    ],
  },
  {
    id: "ankle", name: "Ankles", icon: "🦶",
    risks: "Sprains, Achilles tendinitis, plantar fasciitis, limited dorsiflexion",
    causes: "Tight calves, poor ankle mobility, jumping without proper landing, improper footwear",
    prehab: ["Ankle Circles", "Banded Ankle Dorsiflexion", "Calf Stretch (wall)", "Tibialis Raise", "Single-Leg Calf Raises", "Bodyweight Calf Raises"],
    tips: [
      "Test ankle mobility: knee should pass 4 inches past toes in a wall test",
      "Stretch calves daily for 30 seconds each side",
      "Tibialis raises prevent shin splints and strengthen the front of the ankle",
      "Land softly when jumping — absorb impact through hips and knees, not ankles",
      "Consider elevated heel squat shoes if you have limited dorsiflexion",
    ],
  },
  {
    id: "wrist", name: "Wrists", icon: "🤲",
    risks: "Carpal tunnel, tendinitis, sprains, TFCC tears",
    causes: "Heavy front rack position, push-ups on flat hands, excessive typing, calisthenics on wrists",
    prehab: ["Wrist Circles", "Wrist Flexor Stretch", "Wrist Extensor Stretch", "Wrist Rollers", "Dead Hangs"],
    tips: [
      "Warm up wrists for 2 minutes before any pressing or handstand work",
      "Use parallettes or push-up handles to keep wrists neutral",
      "Gradually build wrist flexibility — don't force range of motion",
      "Strengthen forearm extensors to balance the flexors (which are overworked)",
      "Take breaks from computer work every 30 minutes and stretch wrists",
    ],
  },
  {
    id: "hip", name: "Hips", icon: "🫁",
    risks: "Hip flexor strains, labral tears, FAI (impingement), bursitis",
    causes: "Excessive sitting, weak glutes, tight hip flexors, squatting too wide/deep without mobility",
    prehab: ["Hip 90/90 Stretch", "Hip CARs", "Pigeon Stretch", "Couch Stretch", "World's Greatest Stretch", "Goblet Squats", "Fire Hydrants", "Cossack Squats"],
    tips: [
      "Hip CARs (controlled articular rotations) daily maintain full range of motion",
      "Don't squat wider than your hip anatomy allows — not everyone can go ATG",
      "Stretch hip flexors after every leg session",
      "Strengthen glute medius to prevent knee caving and hip pain",
      "If you hear clicking without pain, it's usually fine — clicking with pain needs attention",
    ],
  },
];

export default function InjuryPrevention() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="glass-card rounded-lg lg:rounded-xl overflow-hidden">
      <div className="h-0.5 bg-gradient-to-r from-green-500 to-transparent" />
      <div className="p-2.5 lg:p-3">
        <div className="flex items-center gap-2 mb-2.5">
          <div className="w-6 h-6 lg:w-7 lg:h-7 rounded-md bg-green-500/10 flex items-center justify-center">
            <svg className="w-3 h-3 lg:w-3.5 lg:h-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          </div>
          <div>
            <h3 className="text-white font-semibold text-[11px] lg:text-[14px] tracking-tight">Injury Prevention</h3>
            <p className="text-dark-600 text-[8px] lg:text-[9px]">Prehab exercises &amp; tips for {BODY_AREAS.length} areas</p>
          </div>
        </div>

        <div className="space-y-1">
          {BODY_AREAS.map((area) => {
            const isOpen = expanded === area.id;
            return (
              <div key={area.id}>
                <button onClick={() => setExpanded(isOpen ? null : area.id)} className="w-full glass-inset rounded p-2 flex items-center gap-2 hover:bg-white/[.02] transition-all text-left">
                  <span className="text-sm shrink-0">{area.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-[10px] lg:text-[11px] font-semibold">{area.name}</div>
                    <div className="text-dark-600 text-[7px] lg:text-[8px] truncate">{area.risks}</div>
                  </div>
                  <svg className={`w-3 h-3 text-dark-600 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </button>

                {isOpen && (
                  <div className="glass-inset rounded p-2.5 mt-0.5 animate-fade-in space-y-2">
                    {/* Common causes */}
                    <div>
                      <div className="text-red-400 text-[8px] uppercase tracking-wider font-medium mb-0.5">Common Causes</div>
                      <p className="text-dark-400 text-[9px] leading-relaxed">{area.causes}</p>
                    </div>

                    {/* Prehab exercises */}
                    <div>
                      <div className="text-green-400 text-[8px] uppercase tracking-wider font-medium mb-1">Prehab Exercises</div>
                      <div className="flex flex-wrap gap-0.5">
                        {area.prehab.map((ex) => (
                          <span key={ex} className="text-[8px] font-medium bg-green-500/8 text-green-400/80 px-1.5 py-0.5 rounded">{ex}</span>
                        ))}
                      </div>
                    </div>

                    {/* Tips */}
                    <div>
                      <div className="text-blue-400 text-[8px] uppercase tracking-wider font-medium mb-1">Prevention Tips</div>
                      <div className="space-y-0.5">
                        {area.tips.map((tip, i) => (
                          <div key={i} className="flex gap-1.5 text-[8px] lg:text-[9px] text-dark-400 leading-relaxed">
                            <span className="text-blue-400/50 shrink-0 mt-0.5">•</span>
                            <span>{tip}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
