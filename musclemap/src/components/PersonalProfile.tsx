"use client";

import { useState, useEffect, useCallback } from "react";

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

function calcBMI(weightLbs: number, heightCm: number): number {
  const kg = weightLbs * 0.453592;
  const m = heightCm / 100;
  return kg / (m * m);
}

function bmiCategory(bmi: number): { label: string; color: string } {
  if (bmi < 18.5) return { label: "Underweight", color: "#38bdf8" };
  if (bmi < 25) return { label: "Normal", color: "#22c55e" };
  if (bmi < 30) return { label: "Overweight", color: "#f59e0b" };
  return { label: "Obese", color: "#ef4444" };
}

function formatHeight(feet: number | null, inches: number | null, cm: number | null, unit: string | null): string {
  if (unit === "metric" && cm) return `${Math.round(cm)} cm`;
  if (feet != null) return `${feet}'${inches || 0}"`;
  if (cm) return `${Math.round(cm)} cm`;
  return "—";
}

export default function PersonalProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [latestWeight, setLatestWeight] = useState<number | null>(null);
  const [latestBf, setLatestBf] = useState<number | null>(null);
  const [editing, setEditing] = useState(false);
  const [logWeight, setLogWeight] = useState(false);

  // Edit form state
  const [formName, setFormName] = useState("");
  const [formFeet, setFormFeet] = useState("");
  const [formInches, setFormInches] = useState("");
  const [formYear, setFormYear] = useState("");
  const [formGender, setFormGender] = useState("");

  // Weight log form
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
          setFormFeet(data.heightFeet?.toString() || "");
          setFormInches(data.heightInches?.toString() || "");
          setFormYear(data.birthYear?.toString() || "");
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
          setLatestWeight(last.weight);
          setLatestBf(last.bodyFat);
        }
      }
    } catch { /* silent */ }
  }, []);

  useEffect(() => { fetchProfile(); fetchLatestMetric(); }, [fetchProfile, fetchLatestMetric]);

  const saveProfile = async () => {
    setSaving(true);
    try {
      await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formName || null,
          heightFeet: formFeet ? parseInt(formFeet) : null,
          heightInches: formInches ? parseInt(formInches) : null,
          birthYear: formYear ? parseInt(formYear) : null,
          gender: formGender || null,
          unitSystem: "imperial",
        }),
      });
      await fetchProfile();
      setEditing(false);
    } catch { /* silent */ }
    finally { setSaving(false); }
  };

  const saveWeight = async () => {
    if (!newWeight) return;
    setSaving(true);
    try {
      await fetch("/api/metrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: new Date().toISOString().split("T")[0],
          weight: newWeight ? parseFloat(newWeight) : null,
          bodyFat: newBf ? parseFloat(newBf) : null,
        }),
      });
      setNewWeight("");
      setNewBf("");
      setLogWeight(false);
      await fetchLatestMetric();
    } catch { /* silent */ }
    finally { setSaving(false); }
  };

  const heightCm = profile?.heightCm || (profile?.heightFeet ? ((profile.heightFeet || 0) * 12 + (profile?.heightInches || 0)) * 2.54 : null);
  const bmi = latestWeight && heightCm ? calcBMI(latestWeight, heightCm) : null;
  const bmiInfo = bmi ? bmiCategory(bmi) : null;
  const age = profile?.birthYear ? new Date().getFullYear() - profile.birthYear : null;

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="h-0.5 bg-gradient-to-r from-brand-500 to-transparent" />
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500/20 to-brand-600/10 border border-brand-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-semibold text-[14px] tracking-tight">
                {profile?.name || "Your Profile"}
              </h3>
              <p className="text-dark-600 text-[10px] font-medium uppercase tracking-wider">Personal Stats</p>
            </div>
          </div>
          <button onClick={() => setEditing(!editing)} className="text-dark-500 hover:text-white h-7 px-2 rounded-md flex items-center gap-1 hover:bg-white/5 transition-all text-[11px] font-medium">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>
        </div>

        {/* Edit form */}
        {editing && (
          <div className="glass-inset rounded-xl p-3.5 mb-4 animate-fade-in space-y-3">
            <div>
              <label className="text-dark-600 text-[10px] uppercase tracking-wider font-medium block mb-1">Name</label>
              <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Your name" className="input-field" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-dark-600 text-[10px] uppercase tracking-wider font-medium block mb-1">Height (ft)</label>
                <input type="number" value={formFeet} onChange={(e) => setFormFeet(e.target.value)} placeholder="5" className="input-compact" />
              </div>
              <div>
                <label className="text-dark-600 text-[10px] uppercase tracking-wider font-medium block mb-1">Height (in)</label>
                <input type="number" value={formInches} onChange={(e) => setFormInches(e.target.value)} placeholder="10" className="input-compact" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-dark-600 text-[10px] uppercase tracking-wider font-medium block mb-1">Birth Year</label>
                <input type="number" value={formYear} onChange={(e) => setFormYear(e.target.value)} placeholder="1995" className="input-compact" />
              </div>
              <div>
                <label className="text-dark-600 text-[10px] uppercase tracking-wider font-medium block mb-1">Gender</label>
                <select value={formGender} onChange={(e) => setFormGender(e.target.value)} className="input-field !py-[5px] !text-[12px]">
                  <option value="">—</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={saveProfile} disabled={saving} className="flex-1 h-8 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white text-[11px] font-semibold rounded-lg transition-all">
                {saving ? "Saving…" : "Save Profile"}
              </button>
              <button onClick={() => setEditing(false)} className="h-8 px-3 glass-light text-dark-400 text-[11px] font-medium rounded-lg hover:text-white transition-all">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          {/* Weight */}
          <div className="glass-inset rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <div className="text-dark-600 text-[9px] uppercase tracking-wider font-medium">Weight</div>
              <svg className="w-3 h-3 text-dark-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
            </div>
            <div className="text-white font-bold text-lg tabular-nums leading-none">
              {latestWeight ? `${latestWeight.toFixed(1)}` : "—"}
              <span className="text-dark-500 text-[10px] font-normal ml-0.5">lbs</span>
            </div>
          </div>

          {/* Height */}
          <div className="glass-inset rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <div className="text-dark-600 text-[9px] uppercase tracking-wider font-medium">Height</div>
              <svg className="w-3 h-3 text-dark-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </div>
            <div className="text-white font-bold text-lg tabular-nums leading-none">
              {formatHeight(profile?.heightFeet ?? null, profile?.heightInches ?? null, heightCm, profile?.unitSystem ?? null)}
            </div>
          </div>

          {/* BMI */}
          <div className="glass-inset rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <div className="text-dark-600 text-[9px] uppercase tracking-wider font-medium">BMI</div>
              {bmiInfo && <span className="text-[8px] font-semibold px-1.5 py-px rounded" style={{ backgroundColor: bmiInfo.color + "15", color: bmiInfo.color }}>{bmiInfo.label}</span>}
            </div>
            <div className="text-white font-bold text-lg tabular-nums leading-none">
              {bmi ? bmi.toFixed(1) : "—"}
            </div>
            {bmi && (
              <div className="mt-1.5">
                <div className="h-1 rounded-full bg-gradient-to-r from-blue-400 via-green-400 via-yellow-400 to-red-400 opacity-30" />
                <div className="relative h-0">
                  <div className="absolute -top-[3px] w-1.5 h-1.5 rounded-full bg-white shadow" style={{ left: `${Math.min(100, Math.max(0, ((bmi - 15) / 25) * 100))}%` }} />
                </div>
              </div>
            )}
          </div>

          {/* Body Fat or Age */}
          <div className="glass-inset rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <div className="text-dark-600 text-[9px] uppercase tracking-wider font-medium">
                {latestBf ? "Body Fat" : "Age"}
              </div>
              <svg className="w-3 h-3 text-dark-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {latestBf
                  ? <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  : <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                }
              </svg>
            </div>
            <div className="text-white font-bold text-lg tabular-nums leading-none">
              {latestBf ? `${latestBf.toFixed(1)}` : age ? String(age) : "—"}
              <span className="text-dark-500 text-[10px] font-normal ml-0.5">{latestBf ? "%" : age ? "yrs" : ""}</span>
            </div>
          </div>
        </div>

        {/* Log weight button */}
        {!logWeight ? (
          <button onClick={() => setLogWeight(true)} className="w-full h-9 glass-inset hover:bg-white/[.03] rounded-lg text-[12px] font-medium text-dark-400 hover:text-white transition-all flex items-center justify-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Log Today&apos;s Weight
          </button>
        ) : (
          <div className="glass-inset rounded-xl p-3 animate-fade-in space-y-2.5">
            <div className="text-dark-500 text-[10px] font-medium uppercase tracking-wider">Log Today — {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}</div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-dark-600 text-[9px] uppercase tracking-wider block mb-0.5">Weight (lbs)</label>
                <input type="number" step="0.1" value={newWeight} onChange={(e) => setNewWeight(e.target.value)} placeholder={latestWeight ? latestWeight.toFixed(1) : "175.0"} className="input-compact" autoFocus />
              </div>
              <div>
                <label className="text-dark-600 text-[9px] uppercase tracking-wider block mb-0.5">Body Fat %</label>
                <input type="number" step="0.1" value={newBf} onChange={(e) => setNewBf(e.target.value)} placeholder={latestBf ? latestBf.toFixed(1) : "15.0"} className="input-compact" />
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={saveWeight} disabled={saving} className="flex-1 h-8 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-[11px] font-semibold rounded-lg transition-all">
                {saving ? "Saving…" : "Save"}
              </button>
              <button onClick={() => setLogWeight(false)} className="h-8 px-3 text-dark-500 hover:text-white text-[11px] font-medium rounded-lg hover:bg-white/5 transition-all">
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
