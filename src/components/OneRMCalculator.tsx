"use client";

import { useState } from "react";
import NumberStepper from "@/components/NumberStepper";

export default function OneRMCalculator() {
  const [weight, setWeight] = useState(135);
  const [reps, setReps] = useState(5);

  const e1rm = Math.round(weight * (1 + reps / 30));
  const percentages = [100, 95, 90, 85, 80, 75, 70, 65, 60];

  return (
    <div className="glass-card rounded-lg lg:rounded-xl overflow-hidden">
      <div className="h-0.5 bg-gradient-to-r from-violet-500 to-transparent" />
      <div className="p-2.5 lg:p-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 lg:w-7 lg:h-7 rounded-md bg-violet-500/10 flex items-center justify-center">
            <svg className="w-3 h-3 lg:w-3.5 lg:h-3.5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
          </div>
          <div>
            <h3 className="text-white font-semibold text-[11px] lg:text-[14px] tracking-tight">1RM Calculator</h3>
            <p className="text-dark-600 text-[8px] lg:text-[9px]">Estimate your one-rep max</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-2">
          <NumberStepper label="Weight (lbs)" value={weight} onChange={setWeight} min={5} max={999} step={5} />
          <NumberStepper label="Reps" value={reps} onChange={setReps} min={1} max={30} />
        </div>

        <div className="text-center mb-2">
          <div className="text-violet-400 text-[9px] uppercase tracking-wider font-medium">Estimated 1RM</div>
          <div className="text-white font-bold text-2xl tabular-nums">{e1rm} <span className="text-dark-500 text-sm font-normal">lbs</span></div>
        </div>

        <div className="glass-inset rounded p-2">
          <div className="text-dark-600 text-[7px] uppercase tracking-wider font-medium mb-1">Training Percentages</div>
          <div className="grid grid-cols-3 gap-px">
            {percentages.map((pct) => (
              <div key={pct} className="bg-black/15 rounded p-1 text-center">
                <div className="text-dark-500 text-[7px]">{pct}%</div>
                <div className="text-white text-[10px] font-bold tabular-nums">{Math.round(e1rm * pct / 100)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
