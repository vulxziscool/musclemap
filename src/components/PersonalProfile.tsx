"use client";

import { useState, useEffect, useCallback } from "react";
import { todayET } from "@/lib/timezone";

interface Profile {
  id: number;
  name: string | null;
  heightFeet: number | null;
  heightInches: number | null;
  heightCm: number | null;
  birthYear: number | null;
  gender: string | null;
  unitSystem: string | null;
}

interface BodyMetric {
  id: number;
  date: string;
  weight: number | null;
  bodyFat: number | null;
}

function calcBMI(weightLbs: number, heightTotalInches: number): number {
  // BMI = (weight in lbs × 703) / (height in inches)²
  if (heightTotalInches <= 0) return 0;
  return (weightLbs * 703) / (heightTotalInches * heightTotalInches);
}

function bmiCategory(bmi: number): { label: string; color: string } {
  if (bmi < 18.5) return { label: "Underweight", color: "#38bdf8" };
  if (bmi < 25) return { label: "Normal", color: "#22c55e" };
  if (bmi < 30) return { label: "Overweight", color: "#f59e0b" };
  return { label: "Obese", color: "#ef4444" };
}

export default function PersonalProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [latestWeight, setLatestWeight] = useState<number | null>(null);
  const [latestBf, setLatestBf] = useState<number | null>(null);
  const [editing, setEditing] = useState(false);
  const [logWeight, setLogWeight] = useState(false);
  const [showMeasurements, setShowMeasurements] = useState(false);

  // Body tape measurements
  const [chest, setChest] = useState("");
  const [waist, setWaist] = useState("");
  const [arms, setArms] = useState("");
  const [thighs, setThighs] = useState("");
  const [measureHistory, setMeasureHistory] = useState<{ date: string; chest: string; waist: string; arms: string; thighs: string }[]>([]);

  const [formName, setFormName] = useState("");
  const [formFeet, setFormFeet] = useState("");
  const [formInches, setFormInches] = useState("");
  const [formYear, setFormYear] = useState("");
  const [formGender, setFormGender] = useState("");

  const [newWeight, setNewWeight] = useState("");
  const [newBf, setNewBf] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch("/api/profile");
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        if (data) {
          setFormName(data.name || "");
          setFormFeet(data.heightFeet != null ? String(data.heightFeet) : "");
          setFormInches(data.heightInches != null ? String(data.heightInches) : "");
          setFormYear(data.birthYear != null ? String(data.birthYear) : "");
          setFormGender(data.gender || "");
        }
      }
    } catch { /* silent */ }
  }, []);

  const fetchLatestMetric = useCallback(async () => {
    try {
      const res = await fetch("/api/metrics");
      if (res.ok) {
        const data: BodyMetric[] = await res.json();
        if (data.length > 0) {
          const last = data[data.length - 1];
          if (last.weight != null) setLatestWeight(last.weight);
          if (last.bodyFat != null) setLatestBf(last.bodyFat);
        }
      }
    } catch { /* silent */ }
  }, []);

  useEffect(() => {
    fetchProfile();
    fetchLatestMetric();
    const savedm = localStorage.getItem("mm_measurements");
    if (savedm) setMeasureHistory(JSON.parse(savedm));
  }, [fetchProfile, fetchLatestMetric]);

  const saveMeasurements = () => {
    if (!chest && !waist && !arms && !thighs) return;
    const entry = { date: todayET(), chest, waist, arms, thighs };
    const updated = [entry, ...measureHistory].slice(0, 20);
    setMeasureHistory(updated);
    localStorage.setItem("mm_measurements", JSON.stringify(updated));
    setShowMeasurements(false);
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      const ft = formFeet.trim() !== "" ? parseInt(formFeet) : null;
      const inch = formInches.trim() !== "" ? parseInt(formInches) : null;

      // If feet is set, ensure inches defaults to 0
      const finalFeet = ft !== null && !isNaN(ft) ? ft : null;
      const finalInches = finalFeet !== null ? (inch !== null && !isNaN(inch) ? inch : 0) : null;

      const payload = {
        name: formName.trim() || null,
        heightFeet: finalFeet,
        heightInches: finalInches,
        birthYear: formYear.trim() !== "" ? parseInt(formYear) : null,
        gender: formGender || null,
        unitSystem: "imperial",
      };

      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        await fetchProfile();
        setEditing(false);
      }
    } catch { /* silent */ }
    finally { setSaving(false); }
  };

  const saveWeight = async () => {
    if (!newWeight.trim()) return;
    setSaving(true);
    try {
      await fetch("/api/metrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: todayET(),
          weight: parseFloat(newWeight),
          bodyFat: newBf.trim() ? parseFloat(newBf) : null,
        }),
      });
      setNewWeight(""); setNewBf(""); setLogWeight(false);
      await fetchLatestMetric();
    } catch { /* silent */ }
    finally { setSaving(false); }
  };

  // Calculate height and BMI from stored profile
  const ft = profile?.heightFeet;
  const inch = profile?.heightInches ?? 0;
  const totalInches = ft != null ? ft * 12 + inch : null;
  const heightDisplay = ft != null ? `${ft}'${inch}"` : "—";
  const bmi = latestWeight && totalInches && totalInches > 0 ? calcBMI(latestWeight, totalInches) : null;
  const bmiInfo = bmi && bmi > 5 ? bmiCategory(bmi) : null;
  const age = profile?.birthYear ? new Date().getFullYear() - profile.birthYear : null;

  return (
    <div className="glass-card rounded-lg lg:rounded-xl overflow-hidden">
      <div className="h-0.5 bg-gradient-to-r from-brand-500 to-transparent" />
      <div className="p-3 lg:p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500/20 to-brand-600/10 border border-brand-500/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </div>
            <div>
              <h3 className="text-white font-semibold text-[12px] lg:text-[14px] tracking-tight">{profile?.name || "Your Profile"}</h3>
              <p className="text-dark-600 text-[8px] lg:text-[10px] font-medium uppercase tracking-wider">Personal Stats</p>
            </div>
          </div>
          <button onClick={() => setEditing(!editing)} className="text-dark-500 hover:text-white h-6 px-2 rounded flex items-center gap-1 hover:bg-white/5 transition-all text-[10px] font-medium">
            <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            Edit
          </button>
        </div>

        {/* Edit form */}
        {editing && (
          <div className="glass-inset rounded-lg p-3 mb-3 animate-fade-in space-y-2">
            <div>
              <label className="text-dark-600 text-[9px] uppercase tracking-wider font-medium block mb-0.5">Name</label>
              <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Your name" className="input-field" />
            </div>
            <div>
              <label className="text-dark-500 text-[9px] uppercase tracking-wider font-medium block mb-0.5">Height</label>
              <div className="grid grid-cols-2 gap-1.5">
                <div className="relative">
                  <input type="number" value={formFeet} onChange={(e) => setFormFeet(e.target.value)} onFocus={(e) => e.target.select()} placeholder="5" className="input-compact !pr-7" min="1" max="8" />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-dark-600 text-[9px] pointer-events-none">ft</span>
                </div>
                <div className="relative">
                  <input type="number" value={formInches} onChange={(e) => setFormInches(e.target.value)} onFocus={(e) => e.target.select()} placeholder="10" className="input-compact !pr-7" min="0" max="11" />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-dark-600 text-[9px] pointer-events-none">in</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <div>
                <label className="text-dark-600 text-[9px] uppercase tracking-wider font-medium block mb-0.5">Birth Year</label>
                <input type="number" value={formYear} onChange={(e) => setFormYear(e.target.value)} onFocus={(e) => e.target.select()} placeholder="1995" className="input-compact" />
              </div>
              <div>
                <label className="text-dark-600 text-[9px] uppercase tracking-wider font-medium block mb-0.5">Gender</label>
                <select value={formGender} onChange={(e) => setFormGender(e.target.value)} className="input-field !py-1 !text-[11px]">
                  <option value="">—</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Preview what will be saved */}
            {formFeet.trim() !== "" && (
              <div className="text-dark-500 text-[9px] text-center">
                Height: {formFeet}&apos;{formInches || "0"}&quot;
                {latestWeight && (
                  <span> · BMI: {calcBMI(latestWeight, (parseInt(formFeet) || 0) * 12 + (parseInt(formInches) || 0)).toFixed(1)}</span>
                )}
              </div>
            )}

            <div className="flex gap-1.5">
              <button onClick={saveProfile} disabled={saving} className="flex-1 h-7 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white text-[10px] font-semibold rounded transition-all">{saving ? "Saving…" : "Save"}</button>
              <button onClick={() => setEditing(false)} className="h-7 px-3 glass-light text-dark-400 text-[10px] font-medium rounded hover:text-white transition-all">Cancel</button>
            </div>
          </div>
        )}

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-1.5 mb-2">
          <div className="glass-inset rounded-md p-2">
            <div className="text-dark-600 text-[8px] uppercase tracking-wider font-medium mb-0.5">Weight</div>
            <div className="text-white font-bold text-sm tabular-nums leading-none">{latestWeight ? latestWeight.toFixed(1) : "—"}<span className="text-dark-600 text-[8px] font-normal ml-0.5">lbs</span></div>
          </div>
          <div className="glass-inset rounded-md p-2">
            <div className="text-dark-600 text-[8px] uppercase tracking-wider font-medium mb-0.5">Height</div>
            <div className="text-white font-bold text-sm tabular-nums leading-none">{heightDisplay}</div>
          </div>
          <div className="glass-inset rounded-md p-2">
            <div className="flex items-center justify-between mb-0.5">
              <div className="text-dark-600 text-[8px] uppercase tracking-wider font-medium">BMI</div>
              {bmiInfo && <span className="text-[7px] font-semibold px-1 py-px rounded" style={{ backgroundColor: bmiInfo.color + "15", color: bmiInfo.color }}>{bmiInfo.label}</span>}
            </div>
            <div className="text-white font-bold text-sm tabular-nums leading-none">{bmi ? bmi.toFixed(1) : "—"}</div>
          </div>
          <div className="glass-inset rounded-md p-2">
            <div className="text-dark-600 text-[8px] uppercase tracking-wider font-medium mb-0.5">{latestBf ? "Body Fat" : "Age"}</div>
            <div className="text-white font-bold text-sm tabular-nums leading-none">{latestBf ? `${latestBf.toFixed(1)}` : age ? String(age) : "—"}<span className="text-dark-600 text-[8px] font-normal ml-0.5">{latestBf ? "%" : age ? "yrs" : ""}</span></div>
          </div>
        </div>

        {/* Tape Measurements Toggle */}
        <div className="mb-2">
          <button onClick={() => setShowMeasurements(!showMeasurements)} className="w-full h-6 glass-inset text-dark-400 hover:text-white rounded text-[9px] font-medium flex items-center justify-between px-2">
            <span>Body Tape Measurements ({measureHistory.length})</span>
            <span>{showMeasurements ? "▲" : "▼"}</span>
          </button>
          {showMeasurements && (
            <div className="glass-inset rounded p-2 mt-1 space-y-2 animate-fade-in">
              <div className="grid grid-cols-2 gap-1.5">
                <div><label className="text-dark-600 text-[8px] uppercase block">Chest (in)</label><input type="text" value={chest} onChange={(e) => setChest(e.target.value)} placeholder='e.g. 40"' className="input-compact" /></div>
                <div><label className="text-dark-600 text-[8px] uppercase block">Waist (in)</label><input type="text" value={waist} onChange={(e) => setWaist(e.target.value)} placeholder='e.g. 32"' className="input-compact" /></div>
                <div><label className="text-dark-600 text-[8px] uppercase block">Arms (in)</label><input type="text" value={arms} onChange={(e) => setArms(e.target.value)} placeholder='e.g. 15"' className="input-compact" /></div>
                <div><label className="text-dark-600 text-[8px] uppercase block">Thighs (in)</label><input type="text" value={thighs} onChange={(e) => setThighs(e.target.value)} placeholder='e.g. 23"' className="input-compact" /></div>
              </div>
              <button onClick={saveMeasurements} className="w-full h-6 bg-brand-600 hover:bg-brand-500 text-white text-[9px] font-semibold rounded">Save Tape Log</button>
              {measureHistory.length > 0 && (
                <div className="space-y-1 max-h-24 overflow-y-auto scrollbar-thin pt-1">
                  {measureHistory.map((m, i) => (
                    <div key={i} className="bg-black/20 rounded p-1 text-[8px] text-dark-400 flex justify-between">
                      <span className="font-semibold text-white">{m.date.slice(5)}</span>
                      <span>{m.chest ? `C:${m.chest}` : ""} {m.waist ? `W:${m.waist}` : ""} {m.arms ? `A:${m.arms}` : ""} {m.thighs ? `T:${m.thighs}` : ""}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Log weight */}
        {!logWeight ? (
          <button onClick={() => setLogWeight(true)} className="w-full h-7 glass-inset hover:bg-white/[.03] rounded text-[10px] font-medium text-dark-400 hover:text-white transition-all flex items-center justify-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            Log Weight
          </button>
        ) : (
          <div className="glass-inset rounded-lg p-2.5 animate-fade-in space-y-2">
            <div className="grid grid-cols-2 gap-1.5">
              <div>
                <label className="text-dark-600 text-[8px] uppercase tracking-wider block mb-0.5">Weight (lbs)</label>
                <input type="number" step="0.1" value={newWeight} onChange={(e) => setNewWeight(e.target.value)} onFocus={(e) => e.target.select()} placeholder={latestWeight ? latestWeight.toFixed(1) : "175"} className="input-compact" autoFocus />
              </div>
              <div>
                <label className="text-dark-600 text-[8px] uppercase tracking-wider block mb-0.5">Body Fat % <span className="text-dark-700">(opt.)</span></label>
                <input type="number" step="0.1" value={newBf} onChange={(e) => setNewBf(e.target.value)} onFocus={(e) => e.target.select()} placeholder="—" className="input-compact" />
              </div>
            </div>
            <div className="flex gap-1.5">
              <button onClick={saveWeight} disabled={saving || !newWeight.trim()} className="flex-1 h-7 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-[10px] font-semibold rounded transition-all">{saving ? "Saving…" : "Save"}</button>
              <button onClick={() => setLogWeight(false)} className="h-7 px-2 text-dark-500 hover:text-white text-[10px] rounded hover:bg-white/5 transition-all">Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
