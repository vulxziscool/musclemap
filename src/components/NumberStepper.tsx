"use client";

interface Props {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  suffix?: string;
}

export default function NumberStepper({ value, onChange, min = 0, max = 999, step = 1, label, suffix }: Props) {
  const dec = () => onChange(Math.max(min, value - step));
  const inc = () => onChange(Math.min(max, value + step));

  return (
    <div>
      {label && <label className="text-dark-600 text-[9px] lg:text-[10px] uppercase tracking-wider font-medium mb-0.5 block">{label}</label>}
      <div className="flex items-center glass-inset rounded-md overflow-hidden h-7 lg:h-8">
        <button onClick={dec} className="w-7 lg:w-8 h-full flex items-center justify-center text-dark-400 hover:text-white hover:bg-white/[.06] transition-colors active:bg-white/10 flex-shrink-0" type="button">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" d="M5 12h14" /></svg>
        </button>
        <input
          type="text"
          inputMode="numeric"
          value={value}
          onChange={(e) => {
            const raw = e.target.value.replace(/[^0-9]/g, "");
            if (raw === "") { onChange(min); return; }
            const n = parseInt(raw);
            if (!isNaN(n)) onChange(Math.min(max, Math.max(min, n)));
          }}
          onFocus={(e) => e.target.select()}
          className="flex-1 min-w-0 bg-transparent text-center text-white text-[12px] lg:text-[13px] font-semibold tabular-nums outline-none border-none"
        />
        {suffix && <span className="text-dark-600 text-[8px] font-medium pr-1">{suffix}</span>}
        <button onClick={inc} className="w-7 lg:w-8 h-full flex items-center justify-center text-dark-400 hover:text-white hover:bg-white/[.06] transition-colors active:bg-white/10 flex-shrink-0" type="button">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" d="M12 5v14M5 12h14" /></svg>
        </button>
      </div>
    </div>
  );
}
