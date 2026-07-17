"use client";

export default function DeviceSync() {
  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <div className="p-5">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-white font-semibold text-[15px] tracking-tight">Device Sync</h3>
            <p className="text-dark-500 text-[11px]">Mobile &amp; wearable integration</p>
          </div>
        </div>

        {/* Apple Watch */}
        <div className="glass-inset rounded-xl p-4 mb-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-700 to-gray-900 border border-gray-600/50 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <rect x="6" y="2" width="12" height="20" rx="6" />
                <rect x="8" y="6" width="8" height="10" rx="2" fill="rgba(255,255,255,.1)" />
                <circle cx="12" cy="11" r="2" stroke="currentColor" strokeWidth="1" />
                <path d="M12 9v-1M12 13v1M10 11h-1M14 11h1" strokeWidth="0.8" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-white text-[13px] font-semibold">Apple Watch</span>
                <span className="text-[10px] font-medium text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">Coming Soon</span>
              </div>
              <p className="text-dark-500 text-[11px] mt-1 leading-relaxed">
                Heart-rate monitoring, automatic workout detection, haptic recovery alerts, and rest-timer on your wrist.
              </p>
              <div className="flex flex-wrap gap-1 mt-2">
                {["Heart Rate", "Auto-detect", "Rest Timer", "Recovery Alerts"].map((f) => (
                  <span key={f} className="text-[9px] font-medium text-dark-500 bg-white/[.03] px-1.5 py-0.5 rounded">{f}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile PWA */}
        <div className="glass-inset rounded-xl p-4 mb-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <rect x="7" y="2" width="10" height="20" rx="2" />
                <line x1="7" y1="5" x2="17" y2="5" strokeWidth="0.8" />
                <line x1="7" y1="19" x2="17" y2="19" strokeWidth="0.8" />
                <circle cx="12" cy="20.5" r="0.5" fill="currentColor" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-white text-[13px] font-semibold">Mobile App</span>
                <span className="text-[10px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">Responsive</span>
              </div>
              <p className="text-dark-500 text-[11px] mt-1 leading-relaxed">
                Full mobile-optimized interface. Add to your home screen for a native app-like experience with offline support.
              </p>
              <div className="flex flex-wrap gap-1 mt-2">
                {["Touch Optimized", "Bottom Nav", "Swipe Gestures", "Add to Home"].map((f) => (
                  <span key={f} className="text-[9px] font-medium text-dark-500 bg-white/[.03] px-1.5 py-0.5 rounded">{f}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Health Integration */}
        <div className="glass-inset rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500/80 to-pink-600/80 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-white text-[13px] font-semibold">Apple Health</span>
                <span className="text-[10px] font-medium text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">Planned</span>
              </div>
              <p className="text-dark-500 text-[11px] mt-1 leading-relaxed">
                Sync body weight, workouts, and activity data with Apple Health for a unified fitness overview.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
