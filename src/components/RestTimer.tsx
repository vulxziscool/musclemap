"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const PRESETS = [30, 60, 90, 120, 180, 300];

export default function RestTimer() {
  const [seconds, setSeconds] = useState(90);
  const [remaining, setRemaining] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const stop = useCallback(() => {
    setRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
  }, []);

  const start = useCallback(() => {
    stop();
    setRemaining(seconds);
    setRunning(true);
  }, [seconds, stop]);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setRemaining((p) => {
        if (p <= 1) {
          stop();
          // Vibrate on finish
          if (typeof navigator !== "undefined" && navigator.vibrate) {
            navigator.vibrate([200, 100, 200, 100, 300]);
          }
          return 0;
        }
        return p - 1;
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, stop]);

  const pct = seconds > 0 ? ((seconds - remaining) / seconds) * 100 : 0;
  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const finished = !running && remaining === 0 && seconds > 0;

  return (
    <div className="glass-card rounded-lg lg:rounded-xl overflow-hidden">
      <div className="h-0.5 bg-gradient-to-r from-sky-500 to-transparent" />
      <div className="p-2.5 lg:p-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 lg:w-7 lg:h-7 rounded-md bg-sky-500/10 flex items-center justify-center">
            <svg className="w-3 h-3 lg:w-3.5 lg:h-3.5 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
          </div>
          <div>
            <h3 className="text-white font-semibold text-[11px] lg:text-[14px] tracking-tight">Rest Timer</h3>
            <p className="text-dark-600 text-[8px] lg:text-[9px]">Vibrates when done</p>
          </div>
        </div>

        {/* Timer display */}
        <div className="flex items-center justify-center mb-2">
          <div className="relative w-20 h-20 lg:w-24 lg:h-24">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(255,255,255,.04)" strokeWidth="2.5" />
              <circle cx="18" cy="18" r="15.5" fill="none" stroke={finished ? "#22c55e" : running ? "#0ea5e9" : "#334155"} strokeWidth="2.5" strokeDasharray={`${running || finished ? pct : 100} ${running || finished ? 100 - pct : 0}`} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`font-bold tabular-nums text-lg lg:text-xl ${finished ? "text-green-400" : running ? "text-sky-400" : "text-white"}`}>{mins}:{secs.toString().padStart(2, "0")}</span>
              <span className="text-[7px] text-dark-600 uppercase">{finished ? "Done!" : running ? "Resting" : "Ready"}</span>
            </div>
          </div>
        </div>

        {/* Presets */}
        <div className="flex gap-1 justify-center mb-2">
          {PRESETS.map((s) => (
            <button key={s} onClick={() => { setSeconds(s); if (!running) setRemaining(0); }}
              className={`text-[8px] lg:text-[9px] font-medium px-2 py-0.5 rounded transition-all ${seconds === s && !running ? "bg-sky-500/15 text-sky-400" : "bg-white/[.03] text-dark-500"}`}>
              {s >= 60 ? `${s / 60}m` : `${s}s`}
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex gap-1.5 justify-center">
          {!running ? (
            <button onClick={start} className="h-7 px-4 bg-sky-600 hover:bg-sky-500 text-white text-[10px] font-semibold rounded transition-all">Start</button>
          ) : (
            <button onClick={stop} className="h-7 px-4 bg-red-600 hover:bg-red-500 text-white text-[10px] font-semibold rounded transition-all">Stop</button>
          )}
          <button onClick={() => { stop(); setRemaining(0); }} className="h-7 px-3 glass-inset text-dark-400 text-[10px] font-medium rounded hover:text-white transition-all">Reset</button>
        </div>
      </div>
    </div>
  );
}
