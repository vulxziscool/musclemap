"use client";

import { useState, useEffect, useCallback, useId } from "react";
import NumberStepper from "@/components/NumberStepper";
import { todayET } from "@/lib/timezone";
import { triggerConfetti } from "@/components/Confetti";

interface BodyMetric { id: number; date: string; weight: number | null; bodyFat: number | null; }
interface StrengthRecord { id: number; date: string; exerciseName: string; weight: number; reps: number; estimatedMax: number | null; }

/* ─── SVG Line Chart ─── */
function LineChart({ data, color, label, unit, h = 90 }: {
  data: { x: string; y: number }[];
  color: string;
  label: string;
  unit: string;
  h?: number;
}) {
  const gradId = useId();

  if (data.length === 0) return (
    <div className="text-center py-6">
      <p className="text-dark-600 text-[11px]">No {label.toLowerCase()} data yet.</p>
      <p className="text-dark-700 text-[10px] mt-0.5">Log entries to see your trend graph.</p>
    </div>
  );

  if (data.length === 1) {
    const v = data[0];
    return (
      <div className="text-center py-4">
        <div className="text-white font-bold text-lg tabular-nums">{v.y.toFixed(1)}<span className="text-dark-500 text-xs font-normal ml-0.5">{unit}</span></div>
        <p className="text-dark-600 text-[10px] mt-0.5">1 entry on {v.x.slice(5)} — add more to see trends</p>
      </div>
    );
  }

  const values = data.map((d) => d.y);
  const minY = Math.min(...values);
  const maxY = Math.max(...values);
  const range = maxY - minY || 1;
  const w = 200;
  const pad = 6;

  const pts = data.map((d, i) => ({
    x: pad + (i / (data.length - 1)) * (w - pad * 2),
    y: h - pad - ((d.y - minY) / range) * (h - pad * 2),
  }));

  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const area = line + ` L${pts[pts.length - 1].x.toFixed(1)},${h} L${pts[0].x.toFixed(1)},${h} Z`;

  const current = values[values.length - 1];
  const first = values[0];
  const change = current - first;

  return (
    <div>
      <div className="flex items-end justify-between mb-2">
        <div>
          <div className="text-dark-500 text-[9px] lg:text-[10px] font-medium uppercase tracking-wider">{label}</div>
          <div className="text-white text-base lg:text-lg font-bold tabular-nums">{current.toFixed(1)}<span className="text-dark-600 text-[9px] font-normal ml-0.5">{unit}</span></div>
        </div>
        <div className="text-right">
          <div className={`text-[10px] font-semibold tabular-nums ${change <= 0 ? "text-emerald-400" : "text-amber-400"}`}>
            {change > 0 ? "+" : ""}{change.toFixed(1)} {unit}
          </div>
          <div className="text-dark-700 text-[9px]">{data.length} entries</div>
        </div>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" preserveAspectRatio="none" style={{ height: `${h}px` }}>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.12" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 0.5, 1].map((t) => {
          const yy = h - pad - t * (h - pad * 2);
          return <line key={t} x1={pad} y1={yy} x2={w - pad} y2={yy} stroke="rgba(255,255,255,.03)" strokeWidth="0.5" />;
        })}
        <path d={area} fill={`url(#${gradId})`} />
        <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={pts[pts.length - 1].x} cy={pts[pts.length - 1].y} r="3" fill={color} />
        <circle cx={pts[pts.length - 1].x} cy={pts[pts.length - 1].y} r="5" fill={color} opacity="0.15" />
        <text x={pad + 1} y={pad + 4} fill="rgba(148,163,184,.3)" fontSize="5" fontFamily="Inter,system-ui,sans-serif">{maxY.toFixed(1)}</text>
        <text x={pad + 1} y={h - pad - 1} fill="rgba(148,163,184,.3)" fontSize="5" fontFamily="Inter,system-ui,sans-serif">{minY.toFixed(1)}</text>
      </svg>
      <div className="flex justify-between text-[8px] text-dark-700 mt-0.5 px-1">
        <span>{data[0].x.slice(5)}</span>
        <span>{data[data.length - 1].x.slice(5)}</span>
      </div>
    </div>
  );
}

/* ─── Strength Section ─── */
function StrengthSection({ records, onAdd }: { records: StrengthRecord[]; onAdd: () => void }) {
  const exerciseNames = [...new Set(records.map((r) => r.exerciseName))];
  const [selected, setSelected] = useState(exerciseNames[0] || "");
  const filtered = records.filter((r) => r.exerciseName === selected);
  const COLORS: Record<string, string> = { "Bench Press": "#6366f1", "Back Squats": "#10b981", "Deadlifts": "#f59e0b", "Military Press": "#ec4899" };
  const color = COLORS[selected] || "#6366f1";

  useEffect(() => {
    if (!selected && exerciseNames.length > 0) setSelected(exerciseNames[0]);
  }, [exerciseNames, selected]);

  if (exerciseNames.length === 0) return (
    <div className="text-center py-4">
      <p className="text-dark-600 text-[11px]">No strength records yet.</p>
      <button onClick={onAdd} className="mt-2 text-brand-400 text-[10px] font-medium hover:text-brand-300">Log a strength PR</button>
    </div>
  );

  const data = filtered.map((r) => ({ x: r.date, y: r.estimatedMax ?? r.weight }));
  const best = data.length > 0 ? Math.max(...data.map((d) => d.y)) : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="text-dark-500 text-[9px] lg:text-[10px] font-medium uppercase tracking-wider">Strength — Est. 1RM</div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-dark-600 text-[9px]">PR: <span className="text-white font-semibold">{best.toFixed(0)}</span></span>
          <button onClick={onAdd} className="text-brand-400 hover:text-brand-300 transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          </button>
        </div>
      </div>
      <div className="flex flex-wrap gap-1 mb-2">
        {exerciseNames.map((n) => (
          <button key={n} onClick={() => setSelected(n)}
            className={`text-[9px] font-medium px-2 py-0.5 rounded transition-all ${selected === n ? "text-white" : "text-dark-500 hover:text-dark-300"}`}
            style={selected === n ? { backgroundColor: (COLORS[n] || "#6366f1") + "20", color: COLORS[n] || "#6366f1" } : {}}>
            {n}
          </button>
        ))}
      </div>
      <LineChart data={data} color={color} label={selected} unit="lbs" h={80} />
    </div>
  );
}

/* ─── Strength Log Form ─── */
function StrengthLogForm({ onSaved, onCancel }: { onSaved: () => void; onCancel: () => void }) {
  const [name, setName] = useState("Bench Press");
  const [weight, setWeight] = useState(135);
  const [reps, setReps] = useState(5);
  const [saving, setSaving] = useState(false);

  const LIFTS = ["Bench Press", "Back Squats", "Deadlifts", "Military Press", "Barbell Curls", "Bent-Over Rows"];
  const e1rm = Math.round(weight * (1 + reps / 30));

  const save = async () => {
    setSaving(true);
    try {
      await fetch("/api/strength", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: todayET(), exerciseName: name, weight, reps }),
      });
      triggerConfetti();
      onSaved();
    } catch { /* silent */ }
    finally { setSaving(false); }
  };

  return (
    <div className="animate-fade-in space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-dark-400 text-[10px] font-medium uppercase tracking-wider">Log Strength PR</span>
        <button onClick={onCancel} className="text-dark-600 hover:text-white text-[10px]">Cancel</button>
      </div>
      <div>
        <label className="text-dark-600 text-[9px] uppercase tracking-wider font-medium block mb-0.5">Exercise</label>
        <select value={name} onChange={(e) => setName(e.target.value)} className="input-field !py-1 !text-[11px]">
          {LIFTS.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <NumberStepper label="Weight (lbs)" value={weight} onChange={setWeight} min={0} max={999} step={5} />
        <NumberStepper label="Reps" value={reps} onChange={setReps} min={1} max={30} />
      </div>
      <div className="text-center text-dark-500 text-[10px]">Est. 1RM: <span className="text-white font-semibold">{e1rm} lbs</span></div>
      <button onClick={save} disabled={saving} className="w-full h-7 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white text-[10px] font-semibold rounded transition-all">{saving ? "Saving…" : "Save PR"}</button>
    </div>
  );
}

/* ─── Main Component ─── */
export default function ProgressCharts() {
  const [metrics, setMetrics] = useState<BodyMetric[]>([]);
  const [strength, setStrength] = useState<StrengthRecord[]>([]);
  const [tab, setTab] = useState<"weight" | "strength" | "body_fat">("weight");
  const [showStrengthForm, setShowStrengthForm] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [mRes, sRes] = await Promise.all([fetch("/api/metrics"), fetch("/api/strength")]);
      if (mRes.ok) setMetrics(await mRes.json());
      if (sRes.ok) setStrength(await sRes.json());
    } catch { /* silent */ }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const weightData = metrics.filter((m) => m.weight != null).map((m) => ({ x: m.date, y: m.weight as number }));
  const bfData = metrics.filter((m) => m.bodyFat != null).map((m) => ({ x: m.date, y: m.bodyFat as number }));

  return (
    <div className="glass-card rounded-lg lg:rounded-xl overflow-hidden">
      <div className="h-0.5 bg-gradient-to-r from-emerald-500 to-transparent" />
      <div className="p-3 lg:p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-md bg-emerald-500/10 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
          </div>
          <div>
            <h3 className="text-white font-semibold text-[12px] lg:text-[14px] tracking-tight">Progress Tracking</h3>
            <p className="text-dark-600 text-[9px] lg:text-[10px]">Weight, body fat &amp; strength trends</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="pill-group w-full mb-3">
          {([
            { id: "weight" as const, label: "Weight" },
            { id: "body_fat" as const, label: "Body Fat" },
            { id: "strength" as const, label: "Strength" },
          ]).map((t) => (
            <button key={t.id} onClick={() => { setTab(t.id); setShowStrengthForm(false); }} className={`pill-btn flex-1 text-center ${tab === t.id ? "active" : ""}`}>{t.label}</button>
          ))}
        </div>

        {/* Chart area */}
        <div className="glass-inset rounded-lg p-3">
          {tab === "weight" && <LineChart data={weightData} color="#10b981" label="Body Weight" unit="lbs" />}
          {tab === "body_fat" && <LineChart data={bfData} color="#f59e0b" label="Body Fat" unit="%" />}
          {tab === "strength" && !showStrengthForm && (
            <StrengthSection records={strength} onAdd={() => setShowStrengthForm(true)} />
          )}
          {tab === "strength" && showStrengthForm && (
            <StrengthLogForm onSaved={() => { setShowStrengthForm(false); fetchData(); }} onCancel={() => setShowStrengthForm(false)} />
          )}
        </div>

        {/* Summary stats */}
        {(weightData.length > 0 || strength.length > 0) && (
          <div className="grid grid-cols-3 gap-1.5 mt-2.5">
            <div className="glass-inset rounded-md p-1.5 text-center">
              <div className="text-white font-bold text-[11px] tabular-nums">{weightData.length}</div>
              <div className="text-dark-700 text-[7px] uppercase tracking-wider">Weigh-ins</div>
            </div>
            <div className="glass-inset rounded-md p-1.5 text-center">
              <div className="text-white font-bold text-[11px] tabular-nums">{strength.length}</div>
              <div className="text-dark-700 text-[7px] uppercase tracking-wider">PRs Logged</div>
            </div>
            <div className="glass-inset rounded-md p-1.5 text-center">
              <div className="text-white font-bold text-[11px] tabular-nums">{[...new Set(strength.map((s) => s.exerciseName))].length}</div>
              <div className="text-dark-700 text-[7px] uppercase tracking-wider">Lifts Tracked</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
