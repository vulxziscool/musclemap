"use client";

import { useState, useEffect, useRef } from "react";
import { FITNESS_TIPS } from "@/lib/cardio";
import { EXERCISE_LIBRARY } from "@/lib/exercises";
import { MUSCLES, MUSCLE_MAP } from "@/lib/muscles";

interface Message { role: "user" | "assistant"; content: string; }

const WORKOUT_PLANS: { name: string; desc: string; exercises: string[] }[] = [
  { name: "Push Day", desc: "Chest, shoulders, triceps focus", exercises: ["Bench Press", "Incline Dumbbell Press", "Dips", "Dumbbell Shoulder Press", "Lateral Raises", "Cable Triceps Pushdowns"] },
  { name: "Pull Day", desc: "Back, biceps, rear delts focus", exercises: ["Pull-Ups", "Bent-Over Rows", "Lat Pulldowns", "Face Pulls", "Dumbbell Curls", "Hammer Curls"] },
  { name: "Leg Day", desc: "Quads, hamstrings, glutes, calves", exercises: ["Back Squats", "Romanian Deadlifts", "Hip Thrusts", "Bulgarian Split Squats", "Standing Calf Raises", "Hanging Leg Raises"] },
  { name: "Upper Body", desc: "Full upper body compound session", exercises: ["Bench Press", "Bent-Over Rows", "Military Press", "Pull-Ups", "Dumbbell Curls", "Skull Crushers"] },
  { name: "Full Body", desc: "Hit every muscle group efficiently", exercises: ["Deadlifts", "Bench Press", "Pull-Ups", "Dumbbell Shoulder Press", "Goblet Squats", "Plank"] },
  { name: "Bodyweight Only", desc: "No equipment needed", exercises: ["Push-Ups", "Pull-Ups", "Dips", "Pistol Squats", "Hanging Leg Raises", "Hollow Holds"] },
  { name: "Core Blast", desc: "Abs and oblique focused session", exercises: ["Hanging Leg Raises", "Dragon Flags", "Russian Twists", "Plank", "Ab Wheel Rollouts", "Side Planks"] },
  { name: "Arm Day", desc: "Biceps and triceps specialization", exercises: ["Barbell Curls", "Dumbbell Curls", "Hammer Curls", "Cable Triceps Pushdowns", "Skull Crushers", "Diamond Push-Ups"] },
];

function generateResponse(input: string): string {
  const q = input.toLowerCase();

  if (q.includes("exercise") && (q.includes("chest") || q.includes("pec"))) {
    const exs = EXERCISE_LIBRARY.filter((e) => e.primaryMuscle.includes("chest")).slice(0, 5);
    return `Here are some great chest exercises:\n\n${exs.map((e) => `• ${e.name} — ${e.equipment}, ${e.defaultSets}×${e.defaultReps}`).join("\n")}\n\nI recommend starting with compound movements like bench press before isolation exercises like flyes.`;
  }
  if (q.includes("exercise") && (q.includes("back") || q.includes("lat"))) {
    const exs = EXERCISE_LIBRARY.filter((e) => ["lats", "mid_back", "lower_back"].includes(e.primaryMuscle)).slice(0, 5);
    return `Here are top back exercises:\n\n${exs.map((e) => `• ${e.name} — ${e.equipment}, ${e.defaultSets}×${e.defaultReps}`).join("\n")}\n\nPull-ups and rows should be your foundation for back development.`;
  }
  if (q.includes("exercise") && (q.includes("leg") || q.includes("quad") || q.includes("squat"))) {
    const exs = EXERCISE_LIBRARY.filter((e) => ["quads", "hamstrings", "glutes"].includes(e.primaryMuscle)).slice(0, 5);
    return `Great leg exercises:\n\n${exs.map((e) => `• ${e.name} — ${e.equipment}, ${e.defaultSets}×${e.defaultReps}`).join("\n")}\n\nSquats and deadlift variations should be the core of your leg training.`;
  }
  if (q.includes("muscle") && q.includes("how many")) {
    return `MuscleMap tracks ${MUSCLES.length} distinct muscle areas across 4 regions: Upper Push, Upper Pull, Lower Body, and Core. Each muscle has its own 72-hour recovery window.`;
  }
  if (q.includes("recover") || q.includes("rest day")) {
    return "Recovery follows a 72-hour window:\n\n• 0–24h: Just Trained (avoid training)\n• 24–48h: Recovering (light activity OK)\n• 48–72h: Almost Ready (can train if needed)\n• 72h+: Fully Recovered (optimal to train)\n\nPrimary muscles get full recovery credit, secondary muscles get 50%. Sleep, nutrition, and hydration all affect recovery speed.";
  }
  if (q.includes("protein") || q.includes("diet") || q.includes("nutrition")) {
    return "Key nutrition guidelines for muscle growth:\n\n• Protein: 0.7–1g per lb of bodyweight daily\n• Calories: Surplus of 300–500 for bulking, deficit of 500 for cutting\n• Meal timing: Spread protein across 4–5 meals\n• Post-workout: 20–40g protein within 2 hours\n• Hydration: Half your bodyweight (lbs) in ounces of water\n\nConsistency in diet matters more than any single meal.";
  }
  if (q.includes("beginner") || q.includes("start") || q.includes("new")) {
    return "Starting out? Here's a beginner plan:\n\n1. Train 3 days/week (full body or push/pull/legs)\n2. Focus on compound movements first\n3. Start light — master form before adding weight\n4. Progressive overload: add 5lbs per week\n5. Rest 48–72h between training the same muscle\n6. Sleep 7–9 hours and eat enough protein\n\nRecommended first program: 3×10 for each exercise, increasing weight when all sets are completed.";
  }
  if (q.includes("weight loss") || q.includes("lose") || q.includes("fat")) {
    return "For fat loss:\n\n• Create a calorie deficit of 500 cal/day (1 lb/week loss)\n• Keep protein HIGH (1g/lb) to preserve muscle\n• Combine resistance training + cardio\n• HIIT burns more fat in less time than steady-state\n• Walking 10k steps/day adds 300–500 cal expenditure\n• Track calories consistently — what gets measured gets managed\n\nDon't drop calories too fast. Slow and steady preserves muscle.";
  }
  if (q.includes("workout") && (q.includes("recommend") || q.includes("suggest") || q.includes("what should"))) {
    const plan = WORKOUT_PLANS[Math.floor(Math.random() * WORKOUT_PLANS.length)];
    return `I'd recommend a ${plan.name} session:\n${plan.desc}\n\n${plan.exercises.map((e) => `• ${e}`).join("\n")}\n\nDo 3–4 sets of 8–12 reps per exercise with 90 seconds rest between sets.`;
  }
  if (q.includes("hello") || q.includes("hi") || q.includes("hey")) {
    return "Hey! I'm your MuscleMap AI assistant. I can help with:\n\n• Exercise recommendations for any muscle\n• Workout programming advice\n• Recovery and rest day guidance\n• Nutrition and diet tips\n• Beginner training advice\n• Weight loss strategies\n\nWhat would you like to know?";
  }

  // Default: give a tip
  const tip = FITNESS_TIPS[Math.floor(Math.random() * FITNESS_TIPS.length)];
  return `Great question! Here's something that might help:\n\n${tip}\n\nTry asking me about specific exercises, muscle groups, recovery, nutrition, or workout recommendations for more targeted advice.`;
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [dailyTip, setDailyTip] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [showPlans, setShowPlans] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dayIndex = Math.floor(Date.now() / 86400000) % FITNESS_TIPS.length;
    setDailyTip(FITNESS_TIPS[dayIndex]);
  }, []);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: "user", content: input.trim() };
    const response = generateResponse(input.trim());
    const assistantMsg: Message = { role: "assistant", content: response };
    setMessages((p) => [...p, userMsg, assistantMsg]);
    setInput("");
  };

  return (
    <div className="space-y-3">
      {/* Daily Tip */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="h-0.5 bg-gradient-to-r from-emerald-500 to-transparent" />
        <div className="p-4">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
            </div>
            <div>
              <h4 className="text-emerald-400 text-[11px] font-semibold uppercase tracking-wider mb-1">Daily Fitness Tip</h4>
              <p className="text-dark-300 text-[12px] leading-relaxed">{dailyTip}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Workouts */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="h-0.5 bg-gradient-to-r from-purple-500 to-transparent" />
        <div className="p-4">
          <button onClick={() => setShowPlans(!showPlans)} className="flex items-center justify-between w-full mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
              </div>
              <div className="text-left">
                <h3 className="text-white font-semibold text-[14px] tracking-tight">Recommended Workouts</h3>
                <p className="text-dark-600 text-[10px]">{WORKOUT_PLANS.length} pre-built plans</p>
              </div>
            </div>
            <svg className={`w-4 h-4 text-dark-600 transition-transform duration-200 ${showPlans ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
          </button>

          {showPlans && (
            <div className="space-y-2 animate-fade-in">
              {WORKOUT_PLANS.map((plan) => (
                <div key={plan.name} className="glass-inset rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-white text-[12px] font-semibold">{plan.name}</span>
                    <span className="text-dark-600 text-[10px]">{plan.exercises.length} exercises</span>
                  </div>
                  <p className="text-dark-500 text-[10px] mb-2">{plan.desc}</p>
                  <div className="flex flex-wrap gap-1">
                    {plan.exercises.map((e) => (
                      <span key={e} className="text-[9px] font-medium text-dark-400 bg-white/[.03] px-1.5 py-0.5 rounded">{e}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* AI Chat */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="h-0.5 bg-gradient-to-r from-brand-500 to-transparent" />
        <div className="p-4">
          <button onClick={() => setShowChat(!showChat)} className="flex items-center justify-between w-full mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
              </div>
              <div className="text-left">
                <h3 className="text-white font-semibold text-[14px] tracking-tight">AI Training Assistant</h3>
                <p className="text-dark-600 text-[10px]">Ask about exercises, recovery, nutrition</p>
              </div>
            </div>
            <svg className={`w-4 h-4 text-dark-600 transition-transform duration-200 ${showChat ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
          </button>

          {showChat && (
            <div className="animate-fade-in">
              {/* Quick prompts */}
              {messages.length === 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {["What exercises for chest?", "Recommend a workout", "Recovery tips", "Nutrition advice", "Beginner plan", "How to lose fat?"].map((p) => (
                    <button key={p} onClick={() => { setInput(p); }}
                      className="text-[10px] font-medium text-dark-400 glass-inset px-2 py-1 rounded-md hover:text-dark-200 transition-all">
                      {p}
                    </button>
                  ))}
                </div>
              )}

              {/* Messages */}
              <div ref={chatRef} className="max-h-60 overflow-y-auto scrollbar-thin space-y-2 mb-3">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] rounded-xl px-3 py-2 text-[12px] leading-relaxed whitespace-pre-line ${
                      msg.role === "user" ? "bg-brand-600 text-white" : "glass-inset text-dark-300"
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="flex gap-2">
                <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }}
                  placeholder="Ask anything about fitness..."
                  className="input-field flex-1 !text-[12px]" />
                <button onClick={sendMessage} className="h-9 w-9 bg-brand-600 hover:bg-brand-500 text-white rounded-lg flex items-center justify-center transition-all flex-shrink-0">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
