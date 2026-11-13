import React, { useState, useEffect } from 'react';
import { 
  Play, 
  BookOpen, 
  Zap, 
  Terminal, 
  ShieldCheck, 
  Cpu, 
  ArrowRight
} from 'lucide-react';
import { sound } from '../../utils/audio';

interface HeroSectionProps {
  onEnterArena: () => void;
  onExploreTheory: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onEnterArena, onExploreTheory }) => {
  // Mini animated preview state: two pointers looping around a track of 8 nodes
  const [slowPos, setSlowPos] = useState<number>(0);
  const [fastPos, setFastPos] = useState<number>(0);
  const [collision, setCollision] = useState<boolean>(false);
  const trackCount = 8;

  useEffect(() => {
    const interval = setInterval(() => {
      setSlowPos((prevSlow) => {
        const nextSlow = (prevSlow + 1) % trackCount;
        setFastPos((prevFast) => {
          const nextFast = (prevFast + 2) % trackCount;
          if (nextSlow === nextFast) {
            setCollision(true);
            setTimeout(() => setCollision(false), 900);
          }
          return nextFast;
        });
        return nextSlow;
      });
    }, 1100);

    return () => clearInterval(interval);
  }, [trackCount]);

  return (
    <section className="relative overflow-hidden pt-8 pb-16 px-4 max-w-7xl mx-auto">
      {/* Background Decorative Rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-b from-lime-accent/5 via-cyan-500/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Hero Badge */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-arcade-900 border border-arcade-750 text-xs font-mono shadow-md">
          <span className="w-2 h-2 rounded-full bg-lime-accent animate-ping" />
          <span className="text-slate-300 font-semibold">CHASE//LOOP ENGINE v2.0</span>
          <span className="text-slate-600">|</span>
          <span className="text-lime-accent font-medium">FLOYD'S TWO-POINTER LAB</span>
        </div>
      </div>

      {/* Main Headline & Tagline */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-4 font-display">
          Two Pointers. <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-lime-accent to-amber-400">
            Different Speeds.
          </span> <br className="hidden sm:block" />
          One Inevitable Meeting.
        </h1>
        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Master Floyd's Cycle Detection algorithm through an interactive arcade-grade laboratory. 
          Step forward and backward, inspect real-time variable registers, and unlock the geometric elegance of relative velocity.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
          <button
            onClick={() => {
              sound.playClick();
              onEnterArena();
            }}
            className="flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-lime-accent hover:bg-lime-400 text-arcade-950 font-bold text-sm tracking-wide transition-all duration-200 shadow-glow-lime hover:scale-105 active:scale-95"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>ENTER THE ARENA</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onExploreTheory();
            }}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-arcade-900 hover:bg-arcade-850 border border-arcade-750 text-slate-200 font-semibold text-sm transition-all duration-200 hover:border-slate-600 active:scale-95"
          >
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>HOW IT WORKS</span>
          </button>
        </div>
      </div>

      {/* Animated Mini Preview Track */}
      <div className="max-w-2xl mx-auto mb-16 p-6 rounded-2xl bg-arcade-900/90 border border-arcade-800 shadow-2xl relative backdrop-blur">
        <div className="flex items-center justify-between border-b border-arcade-800 pb-3 mb-4 font-mono text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <span>Slow (Tortoise: 1 step/tick)</span>
            <span className="text-slate-600">vs</span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span>Fast (Hare: 2 steps/tick)</span>
          </div>
          <div className="text-[11px] text-slate-500 hidden sm:block">
            {collision ? (
              <span className="text-pink-400 font-bold animate-pulse">COLLISION DETECTED!</span>
            ) : (
              <span>CLOSING VELOCITY = 1 STEP/TICK</span>
            )}
          </div>
        </div>

        {/* Circular / Elliptical Interactive Mini Track */}
        <div className="relative h-48 flex items-center justify-center">
          <svg viewBox="0 0 400 170" className="w-full h-full max-w-md">
            {/* Track Path */}
            <ellipse
              cx="200"
              cy="85"
              rx="150"
              ry="55"
              fill="none"
              stroke="#1e293b"
              strokeWidth="2.5"
              strokeDasharray="4,4"
            />

            {/* Nodes on Track */}
            {Array.from({ length: trackCount }).map((_, i) => {
              const angle = (2 * Math.PI * i) / trackCount;
              const x = 200 + 150 * Math.cos(angle);
              const y = 85 + 55 * Math.sin(angle);

              const isSlowHere = slowPos === i;
              const isFastHere = fastPos === i;
              const isCollisionHere = isSlowHere && isFastHere;

              return (
                <g key={`mini-node-${i}`} transform={`translate(${x}, ${y})`}>
                  <circle
                    r="12"
                    fill={isCollisionHere ? 'rgba(236, 72, 153, 0.3)' : '#0d131f'}
                    stroke={
                      isCollisionHere
                        ? '#ec4899'
                        : isSlowHere
                        ? '#06b6d4'
                        : isFastHere
                        ? '#f59e0b'
                        : '#334155'
                    }
                    strokeWidth={isCollisionHere ? 2.5 : isSlowHere || isFastHere ? 2 : 1.5}
                    className="transition-all duration-300"
                  />
                  <text
                    textAnchor="middle"
                    dy="4"
                    fill="#94a3b8"
                    fontSize="9"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {i}
                  </text>
                </g>
              );
            })}

            {/* Slow Pointer Indicator (Tortoise, Cyan) */}
            {(() => {
              const angle = (2 * Math.PI * slowPos) / trackCount;
              const x = 200 + 150 * Math.cos(angle);
              const y = 85 + 55 * Math.sin(angle);
              return (
                <g transform={`translate(${x}, ${y - 22})`} className="transition-all duration-300">
                  <rect x="-24" y="-8" width="48" height="16" rx="8" fill="#083344" stroke="#06b6d4" strokeWidth="1" />
                  <text textAnchor="middle" dy="4" fill="#67e8f9" fontSize="8" fontFamily="monospace" fontWeight="bold">
                    SLOW 1x
                  </text>
                </g>
              );
            })()}

            {/* Fast Pointer Indicator (Hare, Amber) */}
            {(() => {
              const angle = (2 * Math.PI * fastPos) / trackCount;
              const x = 200 + 150 * Math.cos(angle);
              const y = 85 + 55 * Math.sin(angle);
              return (
                <g transform={`translate(${x}, ${y + 22})`} className="transition-all duration-300">
                  <rect x="-24" y="-8" width="48" height="16" rx="8" fill="#451a03" stroke="#f59e0b" strokeWidth="1" />
                  <text textAnchor="middle" dy="4" fill="#fde68a" fontSize="8" fontFamily="monospace" fontWeight="bold">
                    FAST 2x
                  </text>
                </g>
              );
            })()}

            {/* Collision Center Flash */}
            {collision && (
              <g transform="translate(200, 85)">
                <circle r="30" fill="rgba(236, 72, 153, 0.2)" className="animate-ping" />
                <rect x="-60" y="-12" width="120" height="24" rx="6" fill="#831843" stroke="#ec4899" strokeWidth="1.5" />
                <text textAnchor="middle" dy="5" fill="#fdf2f8" fontSize="10" fontFamily="monospace" fontWeight="bold">
                  ⚡ COLLISION DETECTED
                </text>
              </g>
            )}
          </svg>
        </div>

        <div className="text-center font-mono text-[11px] text-slate-400 mt-2">
          Relative velocity &Delta;v = 2 - 1 = 1 node/iteration. In any loop of length &lambda;, meeting is mathematically guaranteed within &lambda; iterations.
        </div>
      </div>

      {/* Feature Pillar Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-arcade-900 border border-arcade-800 hover:border-lime-accent/40 transition-all duration-200">
          <div className="w-9 h-9 rounded-lg bg-lime-accent/10 border border-lime-accent/20 flex items-center justify-center text-lime-accent mb-3">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white mb-1 font-mono">4 SIMULATION MODES</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Cycle detection, cycle entry location, linked list middle finding, and array duplicate resolution.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-arcade-900 border border-arcade-800 hover:border-cyan-500/40 transition-all duration-200">
          <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-3">
            <Terminal className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white mb-1 font-mono">MULTI-LANG CODE INSPECTOR</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Synchronized line-by-line execution with live variable watches across Python, C++, and Java.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-arcade-900 border border-arcade-800 hover:border-pink-500/40 transition-all duration-200">
          <div className="w-9 h-9 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 mb-3">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white mb-1 font-mono">MATHEMATICAL RIGOR</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Explore the exact derivation of &mu; = m&middot;&lambda; - k with real-time distance breakdowns.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-arcade-900 border border-arcade-800 hover:border-amber-500/40 transition-all duration-200">
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-3">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white mb-1 font-mono">ARCADE CHALLENGE ARENA</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Test your intuition with randomized problem sets, difficulty tiers, streaks, and scoring.
          </p>
        </div>
      </div>
    </section>
  );
};
