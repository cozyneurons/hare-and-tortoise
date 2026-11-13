import React, { useState, useEffect } from 'react';
import { 
  PixelHareSprite, 
  PixelTortoiseSprite, 
  PixelTree, 
  PixelSignpost 
} from '../pixel/PixelSprites';
import { sound } from '../../utils/audio';

interface HeroSectionProps {
  onEnterArena: () => void;
  onExploreTheory: () => void;
  onStartChallenges?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ 
  onEnterArena, 
  onExploreTheory,
  onStartChallenges,
}) => {
  // Mini animated preview state: two pointers looping around an 8-tile dirt track
  const [slowPos, setSlowPos] = useState<number>(0);
  const [fastPos, setFastPos] = useState<number>(0);
  const [collision, setCollision] = useState<boolean>(false);
  const trackCount = 8;

  // Dialogue typewriter state
  const dialogueLines = [
    "HELLO THERE! WELCOME TO THE WORLD OF POINTER ALGORITHMS!",
    "My name is PROFESSOR FLOYD. In this laboratory, algorithms are explored through two loyal partners: HARE and TORTOISE!",
    "Two pointers. Different speeds. One inevitable meeting!",
    "Fast leaps 2 steps for every 1 step of Slow. Inside any loop, their collision is mathematically guaranteed!"
  ];
  const [currentLineIdx, setCurrentLineIdx] = useState(0);

  // Animated loop timer
  useEffect(() => {
    const interval = setInterval(() => {
      setSlowPos((prevSlow) => {
        const nextSlow = (prevSlow + 1) % trackCount;
        setFastPos((prevFast) => {
          const nextFast = (prevFast + 2) % trackCount;
          if (nextSlow === nextFast) {
            setCollision(true);
            sound.playCollision();
            setTimeout(() => setCollision(false), 900);
          }
          return nextFast;
        });
        return nextSlow;
      });
    }, 1100);

    return () => clearInterval(interval);
  }, [trackCount]);

  const advanceDialogue = () => {
    sound.playClick();
    setCurrentLineIdx((prev) => (prev + 1) % dialogueLines.length);
  };

  return (
    <section className="relative overflow-hidden pt-6 pb-16 px-4 max-w-5xl mx-auto">
      {/* Top Overworld Scenery Decoration */}
      <div className="flex items-center justify-between mb-4 opacity-80 select-none">
        <div className="flex gap-2">
          <PixelTree size={36} />
          <PixelTree size={36} />
        </div>
        <div className="text-center font-pixel text-[10px] text-gb-pale tracking-widest uppercase">
          ROUTE 01 // FLOYD'S MEADOW
        </div>
        <div className="flex gap-2">
          <PixelTree size={36} />
          <PixelTree size={36} />
        </div>
      </div>

      {/* Retro Title Plaque */}
      <div className="rpg-box-dark p-6 sm:p-8 mb-6 text-center border-4 border-gb-ink shadow-pixel">
        <div className="inline-block px-3 py-1 bg-gb-leaf border-2 border-gb-ink text-gb-cream font-pixel text-[10px] mb-3">
          ★ THE LEGENDARY HANDHELD SIMULATOR ★
        </div>

        <h1 className="text-3xl sm:text-5xl font-pixel text-gb-cream tracking-tight mb-2 drop-shadow-[3px_3px_0px_#0D1F18]">
          CHASE<span className="text-hare">::</span>LOOP
        </h1>

        <p className="text-xl sm:text-2xl font-vt323 text-gb-pale max-w-xl mx-auto leading-relaxed">
          &ldquo;Two pointers. Different speeds. One inevitable meeting.&rdquo;
        </p>
      </div>

      {/* Main Handheld RPG Opening Screen (Dialogue + RPG Start Menu) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8 items-start">
        {/* Left Column (8 cols): Professor's Dialogue Box & Animated Route */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {/* Classic Game Boy Dialogue Box */}
          <div 
            onClick={advanceDialogue}
            className="rpg-box p-5 cursor-pointer relative min-h-[140px] flex flex-col justify-between select-none"
          >
            <div>
              <div className="flex items-center justify-between border-b-2 border-gb-ink pb-1.5 mb-2.5">
                <span className="font-pixel text-[10px] text-hare font-bold">
                  PROF. FLOYD
                </span>
                <span className="font-pixel text-[8px] text-gb-ink opacity-60">
                  MSG {currentLineIdx + 1}/{dialogueLines.length} [CLICK TO ADVANCE]
                </span>
              </div>
              <p className="font-vt323 text-2xl text-gb-ink leading-snug">
                {dialogueLines[currentLineIdx]}
              </p>
            </div>

            {/* Blinking Dialogue Arrow */}
            <div className="flex justify-end pt-1">
              <span className="dialogue-arrow font-pixel text-xs">▼</span>
            </div>
          </div>

          {/* Overworld Animated Dirt Track */}
          <div className="rpg-box-dark p-4 border-4 border-gb-ink shadow-pixel">
            <div className="flex items-center justify-between border-b-2 border-gb-ink pb-2 mb-3">
              <div className="flex items-center gap-3">
                <span className="font-pixel text-[10px] text-gb-pale">OVERWORLD PATROL:</span>
                <span className="flex items-center gap-1 font-vt323 text-lg text-tortoise">
                  <PixelTortoiseSprite size={18} /> SLOW (1x)
                </span>
                <span className="text-gb-pale">vs</span>
                <span className="flex items-center gap-1 font-vt323 text-lg text-hare">
                  <PixelHareSprite size={18} /> FAST (2x)
                </span>
              </div>
              <div className="font-pixel text-[9px] text-gb-cream">
                {collision ? (
                  <span className="text-retro-error animate-blink font-bold">★ COLLISION! ★</span>
                ) : (
                  <span>&Delta;v = 1 TILE/TURN</span>
                )}
              </div>
            </div>

            {/* Elliptical Tile Loop SVG */}
            <div className="relative h-44 flex items-center justify-center bg-gb-olive/40 border-2 border-gb-ink p-2">
              <svg viewBox="0 0 400 160" className="w-full h-full max-w-md">
                {/* Cobblestone Dirt Path */}
                <ellipse
                  cx="200"
                  cy="80"
                  rx="145"
                  ry="52"
                  fill="none"
                  stroke="#183C32"
                  strokeWidth="8"
                />
                <ellipse
                  cx="200"
                  cy="80"
                  rx="145"
                  ry="52"
                  fill="none"
                  stroke="#F2E8CF"
                  strokeWidth="4"
                  strokeDasharray="6,6"
                />

                {/* Stepping Stone Tiles */}
                {Array.from({ length: trackCount }).map((_, i) => {
                  const angle = (2 * Math.PI * i) / trackCount;
                  const x = 200 + 145 * Math.cos(angle);
                  const y = 80 + 52 * Math.sin(angle);

                  const isSlow = slowPos === i;
                  const isFast = fastPos === i;
                  const isCollisionHere = isSlow && isFast;

                  return (
                    <g key={`tile-${i}`} transform={`translate(${x}, ${y})`}>
                      {/* Square Tile */}
                      <rect
                        x="-12"
                        y="-12"
                        width="24"
                        height="24"
                        fill={isCollisionHere ? '#E63946' : isSlow ? '#2A9D8F' : isFast ? '#E76F51' : '#F2E8CF'}
                        stroke="#0D1F18"
                        strokeWidth="2"
                      />
                      <text
                        textAnchor="middle"
                        dy="4"
                        fill={isCollisionHere || isSlow || isFast ? '#FFFFFF' : '#0D1F18'}
                        fontSize="10"
                        fontFamily="'Press Start 2P', monospace"
                      >
                        {i}
                      </text>
                    </g>
                  );
                })}

                {/* Slow Tortoise Marker */}
                {(() => {
                  const angle = (2 * Math.PI * slowPos) / trackCount;
                  const x = 200 + 145 * Math.cos(angle);
                  const y = 80 + 52 * Math.sin(angle);
                  return (
                    <g transform={`translate(${x - 12}, ${y - 36})`} className="transition-all duration-300">
                      <rect x="-4" y="-2" width="32" height="18" fill="#F2E8CF" stroke="#0D1F18" strokeWidth="2" />
                      <text x="12" y="11" textAnchor="middle" fill="#2A9D8F" fontSize="8" fontFamily="'Press Start 2P', monospace">
                        1x
                      </text>
                    </g>
                  );
                })()}

                {/* Fast Hare Marker */}
                {(() => {
                  const angle = (2 * Math.PI * fastPos) / trackCount;
                  const x = 200 + 145 * Math.cos(angle);
                  const y = 80 + 52 * Math.sin(angle);
                  return (
                    <g transform={`translate(${x - 12}, ${y + 20})`} className="transition-all duration-300">
                      <rect x="-4" y="-2" width="32" height="18" fill="#F2E8CF" stroke="#0D1F18" strokeWidth="2" />
                      <text x="12" y="11" textAnchor="middle" fill="#E76F51" fontSize="8" fontFamily="'Press Start 2P', monospace">
                        2x
                      </text>
                    </g>
                  );
                })()}

                {/* Collision Starburst */}
                {collision && (
                  <g transform="translate(200, 80)">
                    <rect x="-80" y="-16" width="160" height="32" fill="#FAF5E6" stroke="#0D1F18" strokeWidth="3" />
                    <text x="0" y="5" textAnchor="middle" fill="#E63946" fontSize="10" fontFamily="'Press Start 2P', monospace">
                      ★ COLLISION! ★
                    </text>
                  </g>
                )}
              </svg>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Classic RPG Start / Action Menu */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <div className="rpg-box p-4 border-4 border-gb-ink shadow-pixel">
            <div className="font-pixel text-[11px] text-gb-ink border-b-2 border-gb-ink pb-2 mb-3 flex items-center justify-between">
              <span>START MENU</span>
              <span className="text-[9px] text-hare">SELECT</span>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  sound.playClick();
                  onEnterArena();
                }}
                className="pixel-btn w-full justify-start text-left py-3 hover:bg-gb-leaf hover:text-white"
              >
                <span className="text-hare font-bold">▶</span>
                <span>ENTER LAB ARENA</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  onExploreTheory();
                }}
                className="pixel-btn-secondary pixel-btn w-full justify-start text-left py-3"
              >
                <span className="text-gb-olive font-bold">▶</span>
                <span>HOW TO PLAY (POKÉDEX)</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  if (onStartChallenges) onStartChallenges();
                  else onEnterArena();
                }}
                className="pixel-btn-secondary pixel-btn w-full justify-start text-left py-3"
              >
                <span className="text-gb-olive font-bold">▶</span>
                <span>TRAINER BATTLE</span>
              </button>
            </div>

            {/* Overworld Signboard snippet */}
            <div className="mt-4 pt-3 border-t-2 border-dashed border-gb-ink text-gb-ink font-vt323 text-lg leading-tight flex items-start gap-2">
              <PixelSignpost size={24} />
              <p>
                <strong>SIGNBOARD:</strong> "Floyd's Theorem guarantees Tortoise and Hare will meet inside any cycle in at most &lambda; turns."
              </p>
            </div>
          </div>

          {/* Quick Handheld Specs */}
          <div className="rpg-box-dark p-3.5 border-4 border-gb-ink text-gb-cream font-pixel text-[9px] space-y-2">
            <div className="flex justify-between border-b border-gb-olive pb-1">
              <span className="text-gb-pale">ENGINE:</span>
              <span>FLOYD-2X-GBC</span>
            </div>
            <div className="flex justify-between border-b border-gb-olive pb-1">
              <span className="text-gb-pale">TIME COMPLEXITY:</span>
              <span className="text-retro-warning">O(N)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gb-pale">AUXILIARY SPACE:</span>
              <span className="text-retro-success">O(1)</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
