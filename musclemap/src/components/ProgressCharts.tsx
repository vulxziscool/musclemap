"use client";

import { useState, useEffect, useCallback } from "react";

interface BodyMetric { id: number; date: string; weight: number | null; bodyFat: number | null; }
interface StrengthRecord { id: number; date: string; exerciseName: string; weight: number; reps: number; estimatedMax: number | null; }

function MiniLineChart({ data, color, label, unit, height = 120 }: {
  data: { x: string; y: number }[];
  color: string;
  label: string;
  unit: string;
  height?: number;
}) {
  if (data.length < 2) return <div className="text-dark-600 text-xs text-center py-8">Not enough data</div>;

  const values = data.map((d) => d.y);
  const minY = Math.min(...values);
  const maxY = Math.max(...values);
  const range = maxY - minY || 1;
  const w = 100;
  const h = height;
  const pad = 4;

  const points = data.map((d, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad * 2);
    const y = h - pad - ((d.y - minY) / range) * (h - pad * 2);
    return { x, y, label: d.x, value: d.y };
  });

  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const areaD = pathD + ` L${points[points.length - 1].x},${h} L${points[0].x},${h} Z`;

  const current = values[values.length - 1];
  const prev = values[values.length - 2];
  const change = current - prev;
  const first = values[0];
  const totalChange = current - first;

  return (
    <div>
      <div className="flex items-end justify-between mb-3">
        <div>
          <div className="text-dark-500 text-[11px] font-medium uppercase tracking-wider">{label}</div>
          <div className="text-white text-xl font-bold tabular-nums mt-0.5">{current.toFixed(1)}<span className="text-dark-500 text-sm font-normal ml-0.5">{unit}</span></div>
        </div>
        <div className="text-right">
          <div className={`text-xs font-semibold tabular-nums ${totalChange <= 0 ? "text-emerald-400" : "text-amber-400"}`}>
            {totalChange > 0 ? "+" : ""}{totalChange.toFixed(1)} {unit}
          </div>
          <div className="text-dark-600 text-[10px]">vs. {data.length} days ago</div>
        </div>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height }}>
        <defs>
          <linearGradient id={`grad-${label}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.15" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((t) => {
          const yy = h - pad - t * (h - pad * 2);
          return <line key={t} x1={pad} y1={yy} x2={w - pad} y2={yy} stroke="rgba(255,255,255,.04)" strokeWidth="0.3" />;
        })}
        <path d={areaD} fill={`url(#grad-${label})`} />
        <path d={pathD} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        {/* Current value dot */}
        <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="2.5" fill={color} />
        <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="4" fill={color} opacity="0.2" />
        {/* Min/Max labels */}
        <text x={w - pad} y={pad + 3} textAnchor="end" fill="rgba(148,163,184,.4)" fontSize="3" fontFamily="Inter,sans-serif">{maxY.toFixed(1)}</text>
        <text x={w - pad} y={h - pad + 1} textAnchor="end" fill="rgba(148,163,184,.4)" fontSize="3" fontFamily="Inter,sans-serif">{minY.toFixed(1)}</text>
      </svg>
      <div className="flex justify-between text-[9px] text-dark-600 mt-1">
        <span>{data[0].x.slice(5)}</span>
        <span>{data[Math.floor(data.length / 2)]?.x.slice(5)}</span>
        <span>{data[data.length - 1].x.slice(5)}</span>
      </div>
    </div>
  );
}

function StrengthChart({ records }: { records: StrengthRecord[] }) {
  const exerciseNames = [...new Set(records.map((r) => r.exerciseName))];
  const [selected, setSelected] = useState(exerciseNames[0] || "");
  const filtered = records.filter((r) => r.exerciseName === selected);
  const COLORS: Record<string, string> = { "Bench Press": "#6366f1", "Back Squats": "#10b981", "Deadlifts": "#f59e0b", "Military Press": "#ec4899" };
  const color = COLORS[selected] || "#6366f1";

  if (exerciseNames.length === 0) return <div className="text-dark-600 text-xs text-center py-6">No strength data yet</div>;

  const data = filtered.map((r) => ({ x: r.date, y: r.estimatedMax ?? r.weight }));
  const current = data.length > 0 ? data[data.length - 1].y : 0;
  const best = data.length > 0 ? Math.max(...data.map((d) => d.y)) : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-dark-500 text-[11px] font-medium uppercase tracking-wider">Strength Tracker</div>
          <div className="text-dark-400 text-[10px] mt-0.5">Estimated 1RM Progression</div>
        </div>
        <div className="flex items-center gap-2 text-[10px]">
          <span className="text-dark-500">PR: <span className="text-white font-semibold">{best.toFixed(0)} lbs</span></span>
        </div>
      </div>
      <div className="flex flex-wrap gap-1 mb-3">
        {exerciseNames.map((n) => (
          <button key={n} onClick={() => setSelected(n)}
            className={`text-[10px] font-medium px-2.5 py-1 rounded-md transition-all ${selected === n ? "text-white" : "text-dark-500 hover:text-dark-300"}`}
            style={selected === n ? { backgroundColor: (COLORS[n] || "#6366f1") + "20", color: COLORS[n] || "#6366f1" } : {}}
          >{n}</button>
        ))}
      </div>
      {data.length >= 2 ? (
        <MiniLineChart data={data} color={color} label={selected} unit="lbs" height={100} />
      ) : (
        <div className="text-dark-600 text-xs text-center py-6">Need at least 2 records</div>
      )}
    </div>
  );
}

export default function ProgressCharts() {
  const [metrics, setMetrics] = useState<BodyMetric[]>([]);
  const [strength, setStrength] = useState<StrengthRecord[]>([]);
  const [tab, setTab] = useState<"weight" | "strength" | "body_fat">("weight");
  const [showAdd, setShowAdd] = useState(false);
  const [addWeight, setAddWeight] = useState("");
  const [addBf, setAddBf] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [mRes, sRes] = await Promise.all([fetch("/api/metrics"), fetch("/api/strength")]);
      if (mRes.ok) setMetrics(await mRes.json());
      if (sRes.ok) setStrength(await sRes.json());
    } catch { /* silent */ }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAddMetric = async () => {
    if (!addWeight && !addBf) return;
    setSaving(true);
    try {
      await fetch("/api/metrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: new Date().toISOString().split("T")[0], weight: addWeight ? parseFloat(addWeight) : null, bodyFat: addBf ? parseFloat(addBf) : null }),
      });
      setAddWeight(""); setAddBf(""); setShowAdd(false); fetchData();
    } catch { /* silent */ }
    finally { setSaving(false); }
  };

  const weightData = metrics.filter((m) => m.weight != null).map((m) => ({ x: m.date, y: m.weight as number }));
  const bfData = metrics.filter((m) => m.bodyFat != null).map((m) => ({ x: m.date, y: m.bodyFat as number }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
            <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
          </div>
          <div>
            <h3 className="text-white font-semibold text-[15px] tracking-tight">Progress Tracking</h3>
            <p className="text-dark-500 text-[11px]">Weight, body composition & strength</p>
          </div>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="text-dark-400 hover:text-white h-7 w-7 rounded-lg flex items-center justify-center hover:bg-white/5 transition-all">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
        </button>
      </div>

      {showAdd && (
        <div className="glass-inset rounded-xl p-3.5 animate-fade-in space-y-2.5">
          <div className="text-dark-400 text-[11px] font-medium uppercase tracking-wider">Log Today</div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-dark-600 text-[10px] uppercase tracking-wider block mb-1">Weight (lbs)</label>
              <input type="number" step="0.1" value={addWeight} onChange={(e) => setAddWeight(e.target.value)} placeholder="178.5" className="input-compact" />
            </div>
            <div>
              <label className="text-dark-600 text-[10px] uppercase tracking-wider block mb-1">Body Fat %</label>
              <input type="number" step="0.1" value={addBf} onChange={(e) => setAddBf(e.target.value)} placeholder="15.2" className="input-compact" />
            </div>
          </div>
          <button onClick={handleAddMetric} disabled={saving} className="w-full h-8 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-all">
            {saving ? "Saving…" : "Save Entry"}
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="pill-group w-full justify-center">
        {([
          { id: "weight" as const, label: "Weight" },
          { id: "body_fat" as const, label: "Body Fat" },
          { id: "strength" as const, label: "Strength" },
        ]).map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`pill-btn flex-1 text-center ${tab === t.id ? "active" : ""}`}>{t.label}</button>
        ))}
      </div>

      <div className="glass-inset rounded-xl p-4">
        {tab === "weight" && <MiniLineChart data={weightData} color="#10b981" label="Body Weight" unit="lbs" />}
        {tab === "body_fat" && <MiniLineChart data={bfData} color="#f59e0b" label="Body Fat" unit="%" />}
        {tab === "strength" && <StrengthChart records={strength} />}
      </div>
    </div>
  );
}
