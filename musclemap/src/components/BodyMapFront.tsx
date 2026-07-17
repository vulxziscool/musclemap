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

export default function BodyMapFront({ recovery, hoveredMuscle, onHover, onClick, dimmedMuscles, highlightedMuscles }: Props) {
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
        {/* Ambient glow */}
        <radialGradient id="bodyGlow" cx="50%" cy="30%" r="60%">
          <stop offset="0%" stopColor="rgba(99,102,241,.06)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <filter id="softGlow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <rect fill="url(#bodyGlow)" width="300" height="600" />

      {/* Guidelines */}
      <g stroke="#1e293b" strokeWidth="0.5" opacity="0.25" fill="none">
        <path d="M110,155 Q130,148 150,152 Q170,148 190,155" />
        <line x1="150" y1="155" x2="150" y2="220" />
        <line x1="150" y1="100" x2="150" y2="320" strokeDasharray="3,3" />
        <path d="M115,310 Q150,325 185,310" />
      </g>

      {/* HEAD */}
      <ellipse cx="150" cy="80" rx="30" ry="38" fill="#0f1729" stroke="#1e293b" strokeWidth="0.8" opacity="0.5" />
      <rect x="138" y="115" width="24" height="30" rx="8" fill="#0f1729" stroke="#1e293b" strokeWidth="0.5" opacity="0.4" />

      {/* UPPER CHEST */}
      <path d="M120,160 Q125,155 135,158 L148,162 L148,178 L120,175 Z" {...muscleProps("upper_chest")} />
      <path d="M180,160 Q175,155 165,158 L152,162 L152,178 L180,175 Z" {...muscleProps("upper_chest")} />
      <line x1="125" y1="162" x2="146" y2="168" {...fiberStroke("upper_chest")} />
      <line x1="128" y1="166" x2="147" y2="172" {...fiberStroke("upper_chest")} />
      <line x1="175" y1="162" x2="154" y2="168" {...fiberStroke("upper_chest")} />
      <line x1="172" y1="166" x2="153" y2="172" {...fiberStroke("upper_chest")} />

      {/* MID CHEST */}
      <path d="M115,175 L148,178 L148,205 L112,198 Q110,188 115,175 Z" {...muscleProps("mid_chest")} />
      <path d="M185,175 L152,178 L152,205 L188,198 Q190,188 185,175 Z" {...muscleProps("mid_chest")} />
      <line x1="118" y1="180" x2="146" y2="188" {...fiberStroke("mid_chest")} />
      <line x1="116" y1="186" x2="147" y2="194" {...fiberStroke("mid_chest")} />
      <line x1="115" y1="192" x2="147" y2="200" {...fiberStroke("mid_chest")} />
      <line x1="182" y1="180" x2="154" y2="188" {...fiberStroke("mid_chest")} />
      <line x1="184" y1="186" x2="153" y2="194" {...fiberStroke("mid_chest")} />
      <line x1="185" y1="192" x2="153" y2="200" {...fiberStroke("mid_chest")} />

      {/* LOWER CHEST */}
      <path d="M112,198 L148,205 L148,218 Q135,222 118,215 Q112,208 112,198 Z" {...muscleProps("lower_chest")} />
      <path d="M188,198 L152,205 L152,218 Q165,222 182,215 Q188,208 188,198 Z" {...muscleProps("lower_chest")} />
      <line x1="116" y1="202" x2="146" y2="210" {...fiberStroke("lower_chest")} />
      <line x1="118" y1="209" x2="145" y2="215" {...fiberStroke("lower_chest")} />
      <line x1="184" y1="202" x2="154" y2="210" {...fiberStroke("lower_chest")} />
      <line x1="182" y1="209" x2="155" y2="215" {...fiberStroke("lower_chest")} />

      {/* FRONT DELTS */}
      <path d="M105,148 Q98,155 95,170 Q94,180 98,188 L112,178 L115,160 Q112,152 105,148 Z" {...muscleProps("front_delts")} />
      <path d="M195,148 Q202,155 205,170 Q206,180 202,188 L188,178 L185,160 Q188,152 195,148 Z" {...muscleProps("front_delts")} />
      <line x1="104" y1="155" x2="108" y2="175" {...fiberStroke("front_delts")} />
      <line x1="100" y1="162" x2="105" y2="180" {...fiberStroke("front_delts")} />
      <line x1="196" y1="155" x2="192" y2="175" {...fiberStroke("front_delts")} />
      <line x1="200" y1="162" x2="195" y2="180" {...fiberStroke("front_delts")} />

      {/* SIDE DELTS */}
      <path d="M105,148 Q95,150 90,162 Q88,172 92,182 L98,175 Q96,160 105,152 Z" {...muscleProps("side_delts")} />
      <path d="M195,148 Q205,150 210,162 Q212,172 208,182 L202,175 Q204,160 195,152 Z" {...muscleProps("side_delts")} />

      {/* BICEPS */}
      <path d="M85,195 Q80,210 78,230 Q77,245 80,260 Q85,262 90,258 Q94,245 95,230 Q95,215 92,200 Z" {...muscleProps("biceps")} />
      <path d="M215,195 Q220,210 222,230 Q223,245 220,260 Q215,262 210,258 Q206,245 205,230 Q205,215 208,200 Z" {...muscleProps("biceps")} />
      <line x1="86" y1="210" x2="88" y2="250" {...fiberStroke("biceps")} />
      <line x1="90" y1="208" x2="91" y2="248" {...fiberStroke("biceps")} />
      <line x1="214" y1="210" x2="212" y2="250" {...fiberStroke("biceps")} />
      <line x1="210" y1="208" x2="209" y2="248" {...fiberStroke("biceps")} />

      {/* FOREARMS */}
      <path d="M78,265 Q75,285 72,310 Q70,325 73,335 Q78,338 82,335 Q86,315 88,295 Q90,278 88,265 Z" {...muscleProps("forearms")} />
      <path d="M222,265 Q225,285 228,310 Q230,325 227,335 Q222,338 218,335 Q214,315 212,295 Q210,278 212,265 Z" {...muscleProps("forearms")} />
      <line x1="80" y1="270" x2="76" y2="325" {...fiberStroke("forearms")} />
      <line x1="84" y1="272" x2="80" y2="328" {...fiberStroke("forearms")} />
      <line x1="220" y1="270" x2="224" y2="325" {...fiberStroke("forearms")} />
      <line x1="216" y1="272" x2="220" y2="328" {...fiberStroke("forearms")} />

      {/* ABS */}
      <rect x="138" y="225" width="10" height="18" rx="2" {...muscleProps("abs")} />
      <rect x="152" y="225" width="10" height="18" rx="2" {...muscleProps("abs")} />
      <rect x="137" y="246" width="11" height="18" rx="2" {...muscleProps("abs")} />
      <rect x="152" y="246" width="11" height="18" rx="2" {...muscleProps("abs")} />
      <rect x="136" y="267" width="12" height="18" rx="2" {...muscleProps("abs")} />
      <rect x="152" y="267" width="12" height="18" rx="2" {...muscleProps("abs")} />
      <rect x="136" y="288" width="12" height="16" rx="2" {...muscleProps("abs")} />
      <rect x="152" y="288" width="12" height="16" rx="2" {...muscleProps("abs")} />
      <line x1="150" y1="222" x2="150" y2="308" stroke="#06080f" strokeWidth="1.5" opacity="0.6" />

      {/* OBLIQUES / SERRATUS */}
      <path d="M118,218 Q122,225 125,240 L134,242 L134,225 Q128,218 118,215 Z" {...muscleProps("obliques")} />
      <path d="M182,218 Q178,225 175,240 L166,242 L166,225 Q172,218 182,215 Z" {...muscleProps("obliques")} />
      <path d="M118,218 L125,222 M116,225 L124,228 M115,232 L124,234 M116,238 L125,240" stroke={getColor("obliques")} strokeWidth="1" fill="none" opacity={getOpacity("obliques") * 0.5} />
      <path d="M182,218 L175,222 M184,225 L176,228 M185,232 L176,234 M184,238 L175,240" stroke={getColor("obliques")} strokeWidth="1" fill="none" opacity={getOpacity("obliques") * 0.5} />
      <path d="M124,250 Q128,270 130,295 L135,295 L135,250 Z" {...muscleProps("obliques")} />
      <path d="M176,250 Q172,270 170,295 L165,295 L165,250 Z" {...muscleProps("obliques")} />

      {/* QUADS */}
      <path d="M118,330 Q115,360 116,390 Q118,420 122,445 Q128,448 132,445 L135,385 L130,340 Z" {...muscleProps("quads")} />
      <path d="M182,330 Q185,360 184,390 Q182,420 178,445 Q172,448 168,445 L165,385 L170,340 Z" {...muscleProps("quads")} />
      <path d="M135,330 L140,340 L140,440 Q138,445 135,440 L132,380 Z" {...muscleProps("quads")} />
      <path d="M165,330 L160,340 L160,440 Q162,445 165,440 L168,380 Z" {...muscleProps("quads")} />
      <path d="M140,415 Q142,430 140,445 Q138,452 135,448 Q136,440 138,425 Z" {...muscleProps("quads")} />
      <path d="M160,415 Q158,430 160,445 Q162,452 165,448 Q164,440 162,425 Z" {...muscleProps("quads")} />
      <line x1="122" y1="345" x2="126" y2="435" {...fiberStroke("quads")} />
      <line x1="128" y1="342" x2="130" y2="438" {...fiberStroke("quads")} />
      <line x1="136" y1="340" x2="138" y2="440" {...fiberStroke("quads")} />
      <line x1="178" y1="345" x2="174" y2="435" {...fiberStroke("quads")} />
      <line x1="172" y1="342" x2="170" y2="438" {...fiberStroke("quads")} />
      <line x1="164" y1="340" x2="162" y2="440" {...fiberStroke("quads")} />

      {/* ADDUCTORS */}
      <path d="M140,330 Q145,350 148,380 L148,400 Q145,410 140,415 Q138,395 138,370 Z" {...muscleProps("adductors")} />
      <path d="M160,330 Q155,350 152,380 L152,400 Q155,410 160,415 Q162,395 162,370 Z" {...muscleProps("adductors")} />

      {/* SHINS / LOWER LEGS */}
      <path d="M120,460 Q118,480 119,510 Q120,530 124,545 Q128,548 132,545 Q135,525 135,505 Q135,485 132,465 Z" fill="#0f1729" stroke="#1e293b" strokeWidth="0.5" opacity="0.25" />
      <path d="M180,460 Q182,480 181,510 Q180,530 176,545 Q172,548 168,545 Q165,525 165,505 Q165,485 168,465 Z" fill="#0f1729" stroke="#1e293b" strokeWidth="0.5" opacity="0.25" />

      {/* Knee caps */}
      <ellipse cx="130" cy="453" rx="8" ry="6" fill="none" stroke="#1e293b" strokeWidth="0.5" opacity="0.2" />
      <ellipse cx="170" cy="453" rx="8" ry="6" fill="none" stroke="#1e293b" strokeWidth="0.5" opacity="0.2" />

      {/* Feet */}
      <ellipse cx="128" cy="558" rx="10" ry="8" fill="#0f1729" stroke="#1e293b" strokeWidth="0.5" opacity="0.25" />
      <ellipse cx="172" cy="558" rx="10" ry="8" fill="#0f1729" stroke="#1e293b" strokeWidth="0.5" opacity="0.25" />

      {/* Hands */}
      <ellipse cx="72" cy="345" rx="8" ry="10" fill="#0f1729" stroke="#1e293b" strokeWidth="0.5" opacity="0.25" />
      <ellipse cx="228" cy="345" rx="8" ry="10" fill="#0f1729" stroke="#1e293b" strokeWidth="0.5" opacity="0.25" />

      {/* Arm connectors */}
      <path d="M95,188 Q90,192 85,195" fill="none" stroke="#0f1729" strokeWidth="8" opacity="0.3" />
      <path d="M205,188 Q210,192 215,195" fill="none" stroke="#0f1729" strokeWidth="8" opacity="0.3" />

      {/* Hip / waist */}
      <path d="M118,305 Q130,320 150,325 Q170,320 182,305 L182,330 Q170,335 150,338 Q130,335 118,330 Z" fill="#0f1729" stroke="#1e293b" strokeWidth="0.5" opacity="0.2" />
    </svg>
  );
}
