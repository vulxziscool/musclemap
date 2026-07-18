"use client";

import { useState, useEffect } from "react";

interface Template {
  id: string;
  name: string;
  exercises: { name: string; sets: number; reps: number; weight: string }[];
  createdAt: string;
}

interface Props {
  onLoad: (name: string, exercises: { name: string; sets: number; reps: number; weight: string }[]) => void;
}

export default function WorkoutTemplates({ onLoad }: Props) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("musclemap_templates");
    if (saved) setTemplates(JSON.parse(saved));
  }, []);

  const deleteTemplate = (id: string) => {
    const updated = templates.filter((t) => t.id !== id);
    setTemplates(updated);
    localStorage.setItem("musclemap_templates", JSON.stringify(updated));
  };

  if (templates.length === 0) return (
    <div className="glass-inset rounded p-2 text-center">
      <p className="text-dark-600 text-[9px]">No saved templates yet. Log a workout, then save it as a template from the workout details.</p>
    </div>
  );

  return (
    <div className="space-y-1">
      <div className="text-dark-500 text-[9px] uppercase tracking-wider font-medium mb-1">Saved Templates</div>
      {templates.map((t) => (
        <div key={t.id}>
          <div className="glass-inset rounded p-1.5 flex items-center gap-2">
            <button onClick={() => setExpanded(expanded === t.id ? null : t.id)} className="flex-1 text-left min-w-0">
              <div className="text-white text-[10px] font-semibold truncate">{t.name}</div>
              <div className="text-dark-600 text-[7px]">{t.exercises.length} exercises</div>
            </button>
            <button onClick={() => onLoad(t.name, t.exercises)} className="h-5 px-2 bg-brand-600 text-white text-[8px] font-semibold rounded shrink-0">Use</button>
            <button onClick={() => deleteTemplate(t.id)} className="text-dark-700 hover:text-red-400 shrink-0">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          {expanded === t.id && (
            <div className="glass-inset rounded p-1.5 mt-0.5 animate-fade-in space-y-px">
              {t.exercises.map((ex, i) => (
                <div key={i} className="text-[8px] text-dark-400 flex justify-between">
                  <span className="truncate">{ex.name}</span>
                  <span className="text-dark-600 shrink-0 ml-1">{ex.sets}×{ex.reps} {ex.weight && `@${ex.weight}`}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function saveAsTemplate(name: string, exercises: { name: string; sets: number; reps: number; weight: string }[]) {
  const saved = localStorage.getItem("musclemap_templates");
  const templates: Template[] = saved ? JSON.parse(saved) : [];
  templates.unshift({ id: Date.now().toString(36), name, exercises, createdAt: new Date().toISOString() });
  localStorage.setItem("musclemap_templates", JSON.stringify(templates.slice(0, 20)));
}
