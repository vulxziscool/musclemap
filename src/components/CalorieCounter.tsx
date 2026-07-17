"use client";

import { useState } from "react";

interface FoodEntry { name: string; calories: number; protein: number; carbs: number; fat: number; }

const COMMON_FOODS: FoodEntry[] = [
  { name: "Chicken Breast (6oz)", calories: 280, protein: 53, carbs: 0, fat: 6 },
  { name: "Brown Rice (1 cup)", calories: 215, protein: 5, carbs: 45, fat: 2 },
  { name: "Broccoli (1 cup)", calories: 55, protein: 4, carbs: 11, fat: 0.5 },
  { name: "Eggs (2 large)", calories: 156, protein: 12, carbs: 1, fat: 11 },
  { name: "Greek Yogurt (1 cup)", calories: 130, protein: 22, carbs: 8, fat: 0.7 },
  { name: "Banana (medium)", calories: 105, protein: 1.3, carbs: 27, fat: 0.4 },
  { name: "Oatmeal (1 cup cooked)", calories: 154, protein: 5, carbs: 27, fat: 2.5 },
  { name: "Salmon (6oz)", calories: 350, protein: 40, carbs: 0, fat: 20 },
  { name: "Sweet Potato (medium)", calories: 103, protein: 2, carbs: 24, fat: 0 },
  { name: "Avocado (half)", calories: 160, protein: 2, carbs: 9, fat: 15 },
  { name: "Almonds (1oz)", calories: 164, protein: 6, carbs: 6, fat: 14 },
  { name: "Whey Protein Shake", calories: 120, protein: 25, carbs: 3, fat: 1 },
  { name: "White Rice (1 cup)", calories: 206, protein: 4, carbs: 45, fat: 0.4 },
  { name: "Ground Turkey (6oz)", calories: 250, protein: 42, carbs: 0, fat: 9 },
  { name: "Whole Wheat Bread (2 sl)", calories: 180, protein: 8, carbs: 32, fat: 3 },
  { name: "Peanut Butter (2 tbsp)", calories: 190, protein: 7, carbs: 7, fat: 16 },
  { name: "Apple (medium)", calories: 95, protein: 0.5, carbs: 25, fat: 0.3 },
  { name: "Cottage Cheese (1 cup)", calories: 220, protein: 28, carbs: 8, fat: 10 },
  { name: "Steak (6oz sirloin)", calories: 320, protein: 46, carbs: 0, fat: 14 },
  { name: "Pasta (1 cup cooked)", calories: 220, protein: 8, carbs: 43, fat: 1.3 },
];

export default function CalorieCounter() {
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customCal, setCustomCal] = useState("");
  const [customP, setCustomP] = useState("");
  const [customC, setCustomC] = useState("");
  const [customF, setCustomF] = useState("");
  const [showCustom, setShowCustom] = useState(false);
  const [goal] = useState(2200);

  const totals = entries.reduce((acc, e) => ({
    calories: acc.calories + e.calories,
    protein: acc.protein + e.protein,
    carbs: acc.carbs + e.carbs,
    fat: acc.fat + e.fat,
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  const pct = Math.min(100, Math.round((totals.calories / goal) * 100));
  const remaining = goal - totals.calories;

  const filtered = search.trim()
    ? COMMON_FOODS.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()))
    : COMMON_FOODS;

  const addFood = (food: FoodEntry) => {
    setEntries((p) => [...p, food]);
    setSearch("");
    setShowSearch(false);
  };

  const addCustom = () => {
    if (!customName || !customCal) return;
    setEntries((p) => [...p, { name: customName, calories: parseInt(customCal) || 0, protein: parseInt(customP) || 0, carbs: parseInt(customC) || 0, fat: parseInt(customF) || 0 }]);
    setCustomName(""); setCustomCal(""); setCustomP(""); setCustomC(""); setCustomF("");
    setShowCustom(false);
  };

  const removeEntry = (idx: number) => setEntries((p) => p.filter((_, i) => i !== idx));

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="h-0.5 bg-gradient-to-r from-amber-500 to-transparent" />
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /></svg>
            </div>
            <div>
              <h3 className="text-white font-semibold text-[14px] tracking-tight">Calorie Tracker</h3>
              <p className="text-dark-600 text-[10px]">Daily intake &amp; macros</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-amber-400 font-bold text-sm tabular-nums">{totals.calories} <span className="text-dark-500 font-normal text-[10px]">/ {goal}</span></div>
            <div className={`text-[10px] font-medium ${remaining > 0 ? "text-dark-500" : "text-red-400"}`}>{remaining > 0 ? `${remaining} remaining` : `${Math.abs(remaining)} over`}</div>
          </div>
        </div>

        {/* Progress ring */}
        <div className="flex items-center gap-4 mb-4">
          <div className="relative w-16 h-16 flex-shrink-0">
            <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
              <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(255,255,255,.04)" strokeWidth="3" />
              <circle cx="18" cy="18" r="15.5" fill="none" stroke={pct >= 100 ? "#ef4444" : "#f59e0b"} strokeWidth="3" strokeDasharray={`${pct} ${100 - pct}`} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white font-bold text-[11px] tabular-nums">{pct}%</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 flex-1">
            {[
              { label: "Protein", value: totals.protein, color: "text-blue-400", unit: "g" },
              { label: "Carbs", value: totals.carbs, color: "text-amber-400", unit: "g" },
              { label: "Fat", value: totals.fat, color: "text-rose-400", unit: "g" },
            ].map((m) => (
              <div key={m.label} className="glass-inset rounded-lg p-2 text-center">
                <div className={`font-bold text-sm tabular-nums ${m.color}`}>{Math.round(m.value)}<span className="text-dark-600 text-[9px] font-normal">{m.unit}</span></div>
                <div className="text-dark-600 text-[8px] uppercase tracking-wider mt-0.5">{m.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mb-3">
          <button onClick={() => { setShowSearch(!showSearch); setShowCustom(false); }} className={`flex-1 h-8 rounded-lg text-[11px] font-medium flex items-center justify-center gap-1 transition-all ${showSearch ? "bg-amber-500/15 text-amber-400" : "glass-inset text-dark-400 hover:text-white"}`}>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
            Search Food
          </button>
          <button onClick={() => { setShowCustom(!showCustom); setShowSearch(false); }} className={`flex-1 h-8 rounded-lg text-[11px] font-medium flex items-center justify-center gap-1 transition-all ${showCustom ? "bg-amber-500/15 text-amber-400" : "glass-inset text-dark-400 hover:text-white"}`}>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            Custom Entry
          </button>
        </div>

        {/* Search */}
        {showSearch && (
          <div className="glass-inset rounded-xl p-3 mb-3 animate-fade-in">
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search foods..." className="input-field mb-2" autoFocus />
            <div className="max-h-32 overflow-y-auto scrollbar-thin space-y-0.5">
              {filtered.slice(0, 8).map((f) => (
                <button key={f.name} onClick={() => addFood(f)} className="w-full flex items-center justify-between p-1.5 rounded-lg hover:bg-white/[.03] text-left transition-all">
                  <span className="text-dark-300 text-[11px] font-medium">{f.name}</span>
                  <span className="text-dark-600 text-[10px] tabular-nums">{f.calories} cal</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Custom entry */}
        {showCustom && (
          <div className="glass-inset rounded-xl p-3 mb-3 animate-fade-in space-y-2">
            <input type="text" value={customName} onChange={(e) => setCustomName(e.target.value)} placeholder="Food name" className="input-field" />
            <div className="grid grid-cols-4 gap-1.5">
              <div><label className="text-dark-600 text-[8px] uppercase block mb-0.5">Cal</label><input type="number" value={customCal} onChange={(e) => setCustomCal(e.target.value)} className="input-compact !text-[11px]" placeholder="0" /></div>
              <div><label className="text-dark-600 text-[8px] uppercase block mb-0.5">Protein</label><input type="number" value={customP} onChange={(e) => setCustomP(e.target.value)} className="input-compact !text-[11px]" placeholder="0" /></div>
              <div><label className="text-dark-600 text-[8px] uppercase block mb-0.5">Carbs</label><input type="number" value={customC} onChange={(e) => setCustomC(e.target.value)} className="input-compact !text-[11px]" placeholder="0" /></div>
              <div><label className="text-dark-600 text-[8px] uppercase block mb-0.5">Fat</label><input type="number" value={customF} onChange={(e) => setCustomF(e.target.value)} className="input-compact !text-[11px]" placeholder="0" /></div>
            </div>
            <button onClick={addCustom} className="w-full h-7 bg-amber-600 hover:bg-amber-500 text-white text-[11px] font-semibold rounded-lg">Add</button>
          </div>
        )}

        {/* Logged entries */}
        {entries.length > 0 && (
          <div className="space-y-1">
            {entries.map((e, i) => (
              <div key={i} className="flex items-center justify-between p-1.5 glass-inset rounded-lg">
                <span className="text-dark-300 text-[11px] font-medium truncate flex-1">{e.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-dark-500 text-[10px] tabular-nums">{e.calories} cal</span>
                  <button onClick={() => removeEntry(i)} className="text-dark-700 hover:text-red-400 transition-colors">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
