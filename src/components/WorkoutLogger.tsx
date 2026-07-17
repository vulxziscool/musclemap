"use client";

import { useState, useEffect, useCallback } from "react";
import { EXERCISE_LIBRARY, EXERCISE_MAP } from "@/lib/exercises";
import { MUSCLES, MUSCLE_MAP } from "@/lib/muscles";

interface ExerciseRow {
  id: string;
  name: string;
  primaryMuscle: string;
  secondaryMuscles: string[];
  sets: number;
  reps: number;
  setReps: number[];
  weight: string;
  restTime: number;
  equipment: string;
  category: string;
}

interface Props {
  preselectedMuscle?: string | null;
  onSaved: () => void;
  onCancel: () => void;
}

const QUICK_TEMPLATES = [
  { label: "5×5", sets: 5, reps: 5 },
  { label: "3×10", sets: 3, reps: 10 },
  { label: "4×8", sets: 4, reps: 8 },
  { label: "3×12", sets: 3, reps: 12 },
  { label: "3×15", sets: 3, reps: 15 },
];

function createEmptyExercise(preselectedMuscle?: string): ExerciseRow {
  const filteredExercises = preselectedMuscle
    ? EXERCISE_LIBRARY.filter((e) => e.primaryMuscle === preselectedMuscle)
    : [];
  const defaultEx = filteredExercises[0] || null;
  return {
    id: Math.random().toString(36).slice(2),
    name: defaultEx?.name || "",
    primaryMuscle: preselectedMuscle || "",
    secondaryMuscles: defaultEx?.secondaryMuscles || [],
    sets: defaultEx?.defaultSets || 3,
    reps: defaultEx?.defaultReps || 10,
    setReps: Array(defaultEx?.defaultSets || 3).fill(defaultEx?.defaultReps || 10),
    weight: "",
    restTime: defaultEx?.defaultRest || 90,
    equipment: defaultEx?.equipment || "",
    category: defaultEx?.category || "",
  };
}

export default function WorkoutLogger({ preselectedMuscle, onSaved, onCancel }: Props) {
  const today = new Date();
  const [name, setName] = useState("");
  const [date, setDate] = useState(today.toISOString().split("T")[0]);
  const [time, setTime] = useState(today.toTimeString().slice(0, 5));
  const [duration, setDuration] = useState("45");
  const [notes, setNotes] = useState("");
  const [exerciseRows, setExerciseRows] = useState<ExerciseRow[]>([createEmptyExercise(preselectedMuscle || undefined)]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [searchTerms, setSearchTerms] = useState<Record<string, string>>({});

  useEffect(() => {
    if (preselectedMuscle) {
      const muscleName = MUSCLE_MAP[preselectedMuscle]?.name;
      if (muscleName && !name) setName(`${muscleName} Training`);
    }
  }, [preselectedMuscle, name]);

  const updateExercise = useCallback((id: string, updates: Partial<ExerciseRow>) => {
    setExerciseRows((prev) =>
      prev.map((ex) => {
        if (ex.id !== id) return ex;
        const updated = { ...ex, ...updates };
        if (updates.sets !== undefined) {
          const newSets = updates.sets;
          updated.setReps = Array(newSets).fill(0).map((_, i) => ex.setReps[i] ?? ex.reps);
        }
        return updated;
      })
    );
  }, []);

  const selectExercise = useCallback((rowId: string, exerciseName: string) => {
    const def = EXERCISE_MAP[exerciseName];
    if (def) {
      updateExercise(rowId, {
        name: def.name, primaryMuscle: def.primaryMuscle, secondaryMuscles: def.secondaryMuscles,
        sets: def.defaultSets, reps: def.defaultReps, setReps: Array(def.defaultSets).fill(def.defaultReps),
        restTime: def.defaultRest, equipment: def.equipment, category: def.category,
      });
    } else {
      updateExercise(rowId, { name: exerciseName });
    }
    setSearchTerms((prev) => ({ ...prev, [rowId]: "" }));
  }, [updateExercise]);

  const addExercise = () => setExerciseRows((prev) => [...prev, createEmptyExercise()]);
  const removeExercise = (id: string) => { if (exerciseRows.length <= 1) return; setExerciseRows((prev) => prev.filter((ex) => ex.id !== id)); };

  const handleSave = async () => {
    setError("");
    const validExercises = exerciseRows.filter((ex) => ex.name && ex.primaryMuscle);
    if (!name.trim()) { setError("Please enter a workout name"); return; }
    if (validExercises.length === 0) { setError("Add at least one complete exercise"); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/workouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(), date, time: time + ":00",
          duration: parseInt(duration) || null, notes: notes.trim() || null,
          exercises: validExercises.map((ex) => ({
            name: ex.name, primaryMuscle: ex.primaryMuscle, secondaryMuscles: ex.secondaryMuscles,
            sets: ex.sets, reps: ex.reps, weight: ex.weight || null, restTime: ex.restTime,
            equipment: ex.equipment, category: ex.category,
          })),
        }),
      });
      if (!res.ok) { const data = await res.json(); throw new Error(data.error || "Failed to save"); }
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally { setSaving(false); }
  };

  return (
    <div className="animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-500/15 flex items-center justify-center">
            <svg className="w-4 h-4 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
          <h2 className="text-white font-bold text-[17px] tracking-tight">Log Workout</h2>
        </div>
        <button onClick={onCancel} className="text-dark-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-500/8 border border-red-500/15 text-red-400 px-3.5 py-2.5 rounded-xl text-[13px] mb-4">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          {error}
        </div>
      )}

      {/* Workout details */}
      <div className="space-y-3 mb-5">
        <div>
          <label className="text-dark-500 text-[11px] uppercase tracking-wider font-medium mb-1.5 block">Workout Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Upper Push Day" className="input-field" />
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="text-dark-500 text-[11px] uppercase tracking-wider font-medium mb-1.5 block">Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="text-dark-500 text-[11px] uppercase tracking-wider font-medium mb-1.5 block">Time</label>
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="text-dark-500 text-[11px] uppercase tracking-wider font-medium mb-1.5 block">Duration (min)</label>
            <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="text-dark-500 text-[11px] uppercase tracking-wider font-medium mb-1.5 block">Notes</label>
            <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional" className="input-field" />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1 h-px bg-white/[.04]" />
        <span className="text-dark-600 text-[11px] uppercase tracking-widest font-medium">Exercises</span>
        <div className="flex-1 h-px bg-white/[.04]" />
      </div>

      {/* Exercise rows */}
      <div className="space-y-3 mb-4">
        {exerciseRows.map((ex, idx) => (
          <ExerciseInput
            key={ex.id}
            exercise={ex}
            index={idx}
            searchTerm={searchTerms[ex.id] || ""}
            onSearchChange={(term) => setSearchTerms((prev) => ({ ...prev, [ex.id]: term }))}
            onUpdate={(updates) => updateExercise(ex.id, updates)}
            onSelect={(n) => selectExercise(ex.id, n)}
            onRemove={() => removeExercise(ex.id)}
            canRemove={exerciseRows.length > 1}
          />
        ))}
      </div>

      <button onClick={addExercise} className="w-full h-10 border border-dashed border-white/[.08] hover:border-white/[.15] rounded-xl text-dark-500 hover:text-dark-300 text-[13px] font-medium transition-all mb-5 flex items-center justify-center gap-1.5">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Add Exercise
      </button>

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full h-12 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-brand-500/25 active:scale-[0.98] text-[14px] flex items-center justify-center gap-2"
      >
        {saving ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Saving…
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Save Workout
          </>
        )}
      </button>
    </div>
  );
}

/* ===== ExerciseInput ===== */
interface ExerciseInputProps {
  exercise: ExerciseRow;
  index: number;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onUpdate: (updates: Partial<ExerciseRow>) => void;
  onSelect: (name: string) => void;
  onRemove: () => void;
  canRemove: boolean;
}

function ExerciseInput({ exercise, index, searchTerm, onSearchChange, onUpdate, onSelect, onRemove, canRemove }: ExerciseInputProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredExercises = searchTerm.trim()
    ? EXERCISE_LIBRARY.filter((e) =>
        e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.primaryMuscle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.equipment.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 8)
    : [];

  const primaryMuscleName = MUSCLE_MAP[exercise.primaryMuscle]?.name || "";
  const totalTargetSets = exercise.sets;

  return (
    <div className="glass-inset rounded-xl p-3.5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-md bg-brand-500/10 text-brand-400 text-[11px] font-bold flex items-center justify-center">{index + 1}</span>
          <span className="text-dark-500 text-[11px] font-medium uppercase tracking-wider">Exercise</span>
        </div>
        {canRemove && (
          <button onClick={onRemove} className="text-dark-600 hover:text-red-400 text-[11px] font-medium transition-colors flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Remove
          </button>
        )}
      </div>

      {/* Exercise name with search */}
      <div className="relative mb-3">
        <div className="relative">
          <svg className="w-4 h-4 text-dark-600 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            value={showDropdown ? searchTerm : exercise.name}
            onChange={(e) => { onSearchChange(e.target.value); if (!showDropdown) setShowDropdown(true); }}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            placeholder="Search exercises…"
            className="input-field !pl-9"
          />
        </div>
        {showDropdown && filteredExercises.length > 0 && (
          <div className="absolute z-50 w-full mt-1.5 glass-card rounded-xl shadow-2xl max-h-48 overflow-auto scrollbar-thin">
            {filteredExercises.map((e) => (
              <button
                key={e.name}
                onMouseDown={() => { onSelect(e.name); setShowDropdown(false); }}
                className="w-full text-left px-3.5 py-2.5 hover:bg-white/[.04] text-[13px] text-dark-300 flex justify-between items-center transition-colors first:rounded-t-xl last:rounded-b-xl"
              >
                <span className="font-medium">{e.name}</span>
                <span className="text-[10px] text-dark-600 font-medium uppercase tracking-wider">{e.equipment}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Primary muscle */}
      <div className="mb-3">
        <label className="text-dark-600 text-[10px] uppercase tracking-wider font-medium mb-1 block">Primary Muscle</label>
        <select
          value={exercise.primaryMuscle}
          onChange={(e) => onUpdate({ primaryMuscle: e.target.value })}
          className="input-field"
        >
          <option value="">Select muscle…</option>
          {MUSCLES.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
      </div>

      {/* Secondary muscles */}
      {exercise.secondaryMuscles.length > 0 && (
        <div className="mb-3">
          <label className="text-dark-600 text-[10px] uppercase tracking-wider font-medium mb-1 block">Secondary</label>
          <div className="flex flex-wrap gap-1">
            {exercise.secondaryMuscles.map((mId) => (
              <span key={mId} className="text-[10px] font-medium bg-dark-700/50 text-dark-400 px-2 py-0.5 rounded-md">
                {MUSCLE_MAP[mId]?.name || mId}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Sets / Reps / Weight / Rest */}
      <div className="grid grid-cols-4 gap-2 mb-3">
        {[
          { label: "Sets", value: exercise.sets, onChange: (v: string) => onUpdate({ sets: parseInt(v) || 1 }), type: "number" as const },
          { label: "Reps", value: exercise.reps, onChange: (v: string) => { const r = parseInt(v) || 1; onUpdate({ reps: r, setReps: Array(exercise.sets).fill(r) }); }, type: "number" as const },
          { label: "Weight", value: exercise.weight, onChange: (v: string) => onUpdate({ weight: v }), type: "text" as const, placeholder: "lbs" },
          { label: "Rest(s)", value: exercise.restTime, onChange: (v: string) => onUpdate({ restTime: parseInt(v) || 0 }), type: "number" as const },
        ].map((f) => (
          <div key={f.label}>
            <label className="text-dark-600 text-[10px] uppercase tracking-wider font-medium mb-1 block">{f.label}</label>
            <input
              type={f.type}
              value={f.value}
              onChange={(e) => f.onChange(e.target.value)}
              placeholder={f.placeholder || ""}
              className="input-compact"
            />
          </div>
        ))}
      </div>

      {/* Quick templates */}
      <div className="flex gap-1.5 mb-3">
        {QUICK_TEMPLATES.map((t) => (
          <button
            key={t.label}
            onClick={() => onUpdate({ sets: t.sets, reps: t.reps, setReps: Array(t.sets).fill(t.reps) })}
            className="text-[10px] font-medium px-2.5 py-1 rounded-md bg-white/[.03] text-dark-400 hover:bg-white/[.06] hover:text-dark-200 transition-colors border border-white/[.04]"
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Set-by-set reps */}
      <div className="mb-3">
        <label className="text-dark-600 text-[10px] uppercase tracking-wider font-medium mb-1.5 block">Set-by-Set Reps</label>
        <div className="flex gap-1.5 flex-wrap">
          {exercise.setReps.map((rep, i) => (
            <div key={i} className="flex flex-col items-center gap-0.5">
              <span className="text-[9px] text-dark-600 font-medium">S{i + 1}</span>
              <input
                type="number" min="0" value={rep}
                onChange={(e) => { const arr = [...exercise.setReps]; arr[i] = parseInt(e.target.value) || 0; onUpdate({ setReps: arr }); }}
                className="w-10 input-compact !py-1 !text-[11px]"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Target preview */}
      {exercise.primaryMuscle && (
        <div className="bg-black/20 rounded-lg p-2.5 border border-white/[.03]">
          <div className="text-[10px] text-dark-500 uppercase tracking-wider font-medium mb-1.5 flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
            </svg>
            Target Preview
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-orange-400 font-semibold w-11">Primary</span>
              <span className="text-[11px] text-dark-200 w-18 truncate font-medium">{primaryMuscleName}</span>
              <div className="flex-1 bar-track !h-[4px]">
                <div className="h-full bg-orange-500 rounded-full" style={{ width: "100%" }} />
              </div>
              <span className="text-[10px] text-dark-500 tabular-nums font-medium">{totalTargetSets}s</span>
            </div>
            {exercise.secondaryMuscles.map((mId) => (
              <div key={mId} className="flex items-center gap-2">
                <span className="text-[10px] text-yellow-400 font-semibold w-11">Assist</span>
                <span className="text-[11px] text-dark-300 w-18 truncate font-medium">{MUSCLE_MAP[mId]?.name || mId}</span>
                <div className="flex-1 bar-track !h-[4px]">
                  <div className="h-full bg-yellow-500/70 rounded-full" style={{ width: "50%" }} />
                </div>
                <span className="text-[10px] text-dark-500 tabular-nums font-medium">{Math.ceil(totalTargetSets * 0.5)}s</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Equipment badge */}
      {exercise.equipment && (
        <div className="mt-2.5 flex gap-1.5">
          <span className="text-[10px] font-medium bg-brand-500/10 text-brand-300 px-2 py-0.5 rounded-md capitalize">{exercise.equipment}</span>
          {exercise.category && (
            <span className="text-[10px] font-medium bg-white/[.04] text-dark-500 px-2 py-0.5 rounded-md capitalize">{exercise.category}</span>
          )}
        </div>
      )}
    </div>
  );
}
