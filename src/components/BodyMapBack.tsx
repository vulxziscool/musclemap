"use client";

import { RecoveryState, getRecoveryColor } from "@/lib/muscles";

interface Props {
  recovery: Record<string, RecoveryState>;
  hoveredMuscle: string | null;
  onHover: (id: string | null) => void;
  onClick: (id: string) => void;
  dimmedMuscles?: Set<string>;
  highlightedMuscles?: Record<string, "primary" | "secondary">;
}

export default function BodyMapBack({ recovery, hoveredMuscle, onHover, onClick, dimmedMuscles, highlightedMuscles }: Props) {
  const getColor = (muscleId: string) => {
    if (highlightedMuscles) {
      if (highlightedMuscles[muscleId] === "primary") return "#f97316";
      if (highlightedMuscles[muscleId] === "secondary") return "#facc15";
      return "#0f1729";
    }
    if (dimmedMuscles && dimmedMuscles.has(muscleId)) return "#0f1729";
    const rec = recovery[muscleId];
    return rec ? getRecoveryColor(rec.status) : "#6b7280";
  };

  const getOpacity = (muscleId: string) => {
    if (highlightedMuscles && !highlightedMuscles[muscleId]) return 0.12;
    if (dimmedMuscles && dimmedMuscles.has(muscleId)) return 0.15;
    return hoveredMuscle === muscleId ? 1 : 0.7;
  };

  const muscleProps = (id: string) => ({
    fill: getColor(id),
    opacity: getOpacity(id),
    className: `muscle-path ${hoveredMuscle === id ? "muscle-glow" : ""}`,
    onMouseEnter: () => onHover(id),
    onMouseLeave: () => onHover(null),
    onClick: () => onClick(id),
    style: { color: getColor(id) },
  });

  const fiberStroke = (id: string) => ({
    stroke: getColor(id),
    strokeWidth: 0.3,
    opacity: getOpacity(id) * 0.45,
    fill: "none",
  });

  return (
    <svg viewBox="0 0 300 600" className="w-full h-full max-h-[600px]">
      <defs>
        <radialGradient id="bodyGlowBack" cx="50%" cy="30%" r="60%">
          <stop offset="0%" stopColor="rgba(99,102,241,.06)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>

      <rect fill="url(#bodyGlowBack)" width="300" height="600" />

      {/* Guidelines */}
      <g stroke="#1e293b" strokeWidth="0.5" opacity="0.25" fill="none">
        <line x1="150" y1="120" x2="150" y2="320" />
        <path d="M120,165 Q130,160 140,170 Q142,185 135,195" />
        <path d="M180,165 Q170,160 160,170 Q158,185 165,195" />
        <path d="M115,310 Q150,325 185,310" />
      </g>

      {/* HEAD */}
      <ellipse cx="150" cy="80" rx="30" ry="38" fill="#0f1729" stroke="#1e293b" strokeWidth="0.8" opacity="0.5" />
      <rect x="138" y="115" width="24" height="28" rx="8" fill="#0f1729" stroke="#1e293b" strokeWidth="0.5" opacity="0.4" />

      {/* TRAPEZIUS */}
      <path d="M138,130 Q130,135 115,148 Q105,155 100,160 L108,170 Q118,162 130,155 L140,150 Z" {...muscleProps("traps")} />
      <path d="M162,130 Q170,135 185,148 Q195,155 200,160 L192,170 Q182,162 170,155 L160,150 Z" {...muscleProps("traps")} />
      <path d="M140,150 L150,155 L150,195 L138,190 Q135,170 140,155 Z" {...muscleProps("traps")} />
      <path d="M160,150 L150,155 L150,195 L162,190 Q165,170 160,155 Z" {...muscleProps("traps")} />
      <line x1="135" y1="138" x2="110" y2="158" {...fiberStroke("traps")} />
      <line x1="130" y1="142" x2="108" y2="162" {...fiberStroke("traps")} />
      <line x1="165" y1="138" x2="190" y2="158" {...fiberStroke("traps")} />
      <line x1="170" y1="142" x2="192" y2="162" {...fiberStroke("traps")} />
      <line x1="142" y1="158" x2="148" y2="188" {...fiberStroke("traps")} />
      <line x1="158" y1="158" x2="152" y2="188" {...fiberStroke("traps")} />

      {/* REAR DELTS */}
      <path d="M100,155 Q92,162 90,175 Q92,185 96,192 L108,178 L108,162 Z" {...muscleProps("rear_delts")} />
      <path d="M200,155 Q208,162 210,175 Q208,185 204,192 L192,178 L192,162 Z" {...muscleProps("rear_delts")} />
      <line x1="98" y1="162" x2="100" y2="182" {...fiberStroke("rear_delts")} />
      <line x1="102" y1="160" x2="104" y2="178" {...fiberStroke("rear_delts")} />
      <line x1="202" y1="162" x2="200" y2="182" {...fiberStroke("rear_delts")} />
      <line x1="198" y1="160" x2="196" y2="178" {...fiberStroke("rear_delts")} />

      {/* LATS */}
      <path d="M112,180 Q108,200 110,220 Q112,240 118,260 L130,260 Q135,240 136,220 L135,195 Q130,185 118,178 Z" {...muscleProps("lats")} />
      <path d="M188,180 Q192,200 190,220 Q188,240 182,260 L170,260 Q165,240 164,220 L165,195 Q170,185 182,178 Z" {...muscleProps("lats")} />
      <line x1="115" y1="190" x2="124" y2="250" {...fiberStroke("lats")} />
      <line x1="120" y1="188" x2="128" y2="248" {...fiberStroke("lats")} />
      <line x1="126" y1="186" x2="132" y2="245" {...fiberStroke("lats")} />
      <line x1="185" y1="190" x2="176" y2="250" {...fiberStroke("lats")} />
      <line x1="180" y1="188" x2="172" y2="248" {...fiberStroke("lats")} />
      <line x1="174" y1="186" x2="168" y2="245" {...fiberStroke("lats")} />

      {/* MID-BACK / RHOMBOIDS */}
      <path d="M136,178 Q140,175 148,180 L148,215 L136,218 Q134,200 136,178 Z" {...muscleProps("mid_back")} />
      <path d="M164,178 Q160,175 152,180 L152,215 L164,218 Q166,200 164,178 Z" {...muscleProps("mid_back")} />
      <line x1="140" y1="185" x2="140" y2="210" {...fiberStroke("mid_back")} />
      <line x1="144" y1="183" x2="144" y2="212" {...fiberStroke("mid_back")} />
      <line x1="160" y1="185" x2="160" y2="210" {...fiberStroke("mid_back")} />
      <line x1="156" y1="183" x2="156" y2="212" {...fiberStroke("mid_back")} />

      {/* LOWER BACK / ERECTORS */}
      <path d="M135,225 L148,222 L148,305 Q145,310 138,308 Q132,300 132,280 Q132,255 135,225 Z" {...muscleProps("lower_back")} />
      <path d="M165,225 L152,222 L152,305 Q155,310 162,308 Q168,300 168,280 Q168,255 165,225 Z" {...muscleProps("lower_back")} />
      <line x1="140" y1="228" x2="140" y2="300" {...fiberStroke("lower_back")} />
      <line x1="144" y1="226" x2="145" y2="302" {...fiberStroke("lower_back")} />
      <line x1="160" y1="228" x2="160" y2="300" {...fiberStroke("lower_back")} />
      <line x1="156" y1="226" x2="155" y2="302" {...fiberStroke("lower_back")} />

      {/* TRICEPS */}
      <path d="M85,195 Q80,210 78,235 Q77,250 80,262 Q85,265 90,260 Q94,248 95,232 Q95,215 92,200 Z" {...muscleProps("triceps")} />
      <path d="M215,195 Q220,210 222,235 Q223,250 220,262 Q215,265 210,260 Q206,248 205,232 Q205,215 208,200 Z" {...muscleProps("triceps")} />
      <line x1="87" y1="200" x2="85" y2="255" stroke={getColor("triceps")} strokeWidth="0.5" opacity={getOpacity("triceps") * 0.45} />
      <line x1="213" y1="200" x2="215" y2="255" stroke={getColor("triceps")} strokeWidth="0.5" opacity={getOpacity("triceps") * 0.45} />
      <line x1="84" y1="205" x2="82" y2="252" {...fiberStroke("triceps")} />
      <line x1="90" y1="203" x2="88" y2="250" {...fiberStroke("triceps")} />
      <line x1="216" y1="205" x2="218" y2="252" {...fiberStroke("triceps")} />
      <line x1="210" y1="203" x2="212" y2="250" {...fiberStroke("triceps")} />

      {/* FOREARMS (back) */}
      <path d="M78,268 Q75,288 72,313 Q70,328 73,338 Q78,340 82,338 Q86,318 88,298 Q90,280 88,268 Z" {...muscleProps("forearms")} />
      <path d="M222,268 Q225,288 228,313 Q230,328 227,338 Q222,340 218,338 Q214,318 212,298 Q210,280 212,268 Z" {...muscleProps("forearms")} />

      {/* GLUTES */}
      <path d="M118,308 Q125,305 135,310 Q138,318 135,328 L120,325 Q115,318 118,308 Z" {...muscleProps("glutes")} />
      <path d="M182,308 Q175,305 165,310 Q162,318 165,328 L180,325 Q185,318 182,308 Z" {...muscleProps("glutes")} />
      <path d="M120,325 L135,328 Q140,340 148,348 L148,360 Q138,358 128,348 Q118,338 118,325 Z" {...muscleProps("glutes")} />
      <path d="M180,325 L165,328 Q160,340 152,348 L152,360 Q162,358 172,348 Q182,338 182,325 Z" {...muscleProps("glutes")} />
      <line x1="122" y1="315" x2="130" y2="340" {...fiberStroke("glutes")} />
      <line x1="128" y1="312" x2="138" y2="345" {...fiberStroke("glutes")} />
      <line x1="134" y1="318" x2="142" y2="350" {...fiberStroke("glutes")} />
      <line x1="178" y1="315" x2="170" y2="340" {...fiberStroke("glutes")} />
      <line x1="172" y1="312" x2="162" y2="345" {...fiberStroke("glutes")} />
      <line x1="166" y1="318" x2="158" y2="350" {...fiberStroke("glutes")} />

      {/* HAMSTRINGS */}
      <path d="M118,348 Q116,375 117,405 Q118,425 122,445 Q128,448 132,445 L133,400 Q132,380 130,360 Z" {...muscleProps("hamstrings")} />
      <path d="M182,348 Q184,375 183,405 Q182,425 178,445 Q172,448 168,445 L167,400 Q168,380 170,360 Z" {...muscleProps("hamstrings")} />
      <path d="M135,355 Q140,360 145,365 L148,370 L148,445 Q143,448 138,445 Q135,425 134,400 Z" {...muscleProps("hamstrings")} />
      <path d="M165,355 Q160,360 155,365 L152,370 L152,445 Q157,448 162,445 Q165,425 166,400 Z" {...muscleProps("hamstrings")} />
      <line x1="133" y1="365" x2="133" y2="440" stroke="#06080f" strokeWidth="0.8" opacity="0.4" />
      <line x1="167" y1="365" x2="167" y2="440" stroke="#06080f" strokeWidth="0.8" opacity="0.4" />
      <line x1="122" y1="355" x2="126" y2="440" {...fiberStroke("hamstrings")} />
      <line x1="128" y1="358" x2="130" y2="438" {...fiberStroke("hamstrings")} />
      <line x1="140" y1="362" x2="142" y2="440" {...fiberStroke("hamstrings")} />
      <line x1="178" y1="355" x2="174" y2="440" {...fiberStroke("hamstrings")} />
      <line x1="172" y1="358" x2="170" y2="438" {...fiberStroke("hamstrings")} />
      <line x1="160" y1="362" x2="158" y2="440" {...fiberStroke("hamstrings")} />

      {/* CALVES */}
      <path d="M120,458 Q118,475 120,500 Q122,518 126,530 Q130,525 132,515 Q134,495 132,475 Q130,462 128,458 Z" {...muscleProps("calves")} />
      <path d="M180,458 Q182,475 180,500 Q178,518 174,530 Q170,525 168,515 Q166,495 168,475 Q170,462 172,458 Z" {...muscleProps("calves")} />
      <path d="M132,458 Q135,470 136,488 Q136,505 134,518 Q130,525 128,520 L130,500 Q132,480 132,462 Z" {...muscleProps("calves")} />
      <path d="M168,458 Q165,470 164,488 Q164,505 166,518 Q170,525 172,520 L170,500 Q168,480 168,462 Z" {...muscleProps("calves")} />
      <line x1="130" y1="462" x2="128" y2="525" stroke="#06080f" strokeWidth="0.6" opacity="0.4" />
      <line x1="170" y1="462" x2="172" y2="525" stroke="#06080f" strokeWidth="0.6" opacity="0.4" />
      <path d="M126,530 Q127,545 127,555" stroke={getColor("calves")} strokeWidth="2" fill="none" opacity={getOpacity("calves") * 0.5} />
      <path d="M174,530 Q173,545 173,555" stroke={getColor("calves")} strokeWidth="2" fill="none" opacity={getOpacity("calves") * 0.5} />
      <line x1="124" y1="465" x2="126" y2="520" {...fiberStroke("calves")} />
      <line x1="134" y1="465" x2="132" y2="515" {...fiberStroke("calves")} />
      <line x1="176" y1="465" x2="174" y2="520" {...fiberStroke("calves")} />
      <line x1="166" y1="465" x2="168" y2="515" {...fiberStroke("calves")} />

      {/* Knee caps */}
      <ellipse cx="128" cy="453" rx="8" ry="5" fill="none" stroke="#1e293b" strokeWidth="0.5" opacity="0.2" />
      <ellipse cx="172" cy="453" rx="8" ry="5" fill="none" stroke="#1e293b" strokeWidth="0.5" opacity="0.2" />

      {/* Feet */}
      <ellipse cx="127" cy="560" rx="9" ry="7" fill="#0f1729" stroke="#1e293b" strokeWidth="0.5" opacity="0.25" />
      <ellipse cx="173" cy="560" rx="9" ry="7" fill="#0f1729" stroke="#1e293b" strokeWidth="0.5" opacity="0.25" />

      {/* Hands */}
      <ellipse cx="72" cy="348" rx="8" ry="10" fill="#0f1729" stroke="#1e293b" strokeWidth="0.5" opacity="0.25" />
      <ellipse cx="228" cy="348" rx="8" ry="10" fill="#0f1729" stroke="#1e293b" strokeWidth="0.5" opacity="0.25" />
    </svg>
  );
}
