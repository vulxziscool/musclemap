"use client";

import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
  vRot: number;
}

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#38bdf8", "#ec4899", "#a855f7"];

export function triggerConfetti() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("trigger-confetti"));
  }
}

export default function Confetti() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const handleTrigger = () => {
      const p: Particle[] = Array.from({ length: 40 }, (_, i) => ({
        id: Math.random() + i,
        x: Math.random() * 80 + 10,
        y: -10,
        vx: (Math.random() - 0.5) * 6,
        vy: Math.random() * 4 + 4,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: Math.random() * 6 + 6,
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 12,
      }));
      setParticles(p);

      setTimeout(() => {
        setParticles([]);
      }, 2500);
    };

    window.addEventListener("trigger-confetti", handleTrigger);
    return () => window.removeEventListener("trigger-confetti", handleTrigger);
  }, []);

  if (particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-sm animate-fade-in"
          style={{
            left: `${p.x}vw`,
            top: `${p.y}vh`,
            width: `${p.size}px`,
            height: `${p.size * 1.5}px`,
            backgroundColor: p.color,
            transform: `rotate(${p.rotation}deg)`,
            animation: "fall 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards",
          }}
        />
      ))}
      <style jsx>{`
        @keyframes fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(105vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
