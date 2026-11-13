import React, { useState, useEffect, useRef } from 'react';
import { 
  PixelHareSprite, 
  PixelTortoiseSprite, 
  PixelTree, 
  PixelSignpost,
  PixelCollisionBurst
} from '../pixel/PixelSprites';
import { sound } from '../../utils/audio';

interface HeroSectionProps {
  onEnterArena: () => void;
  onExploreTheory: () => void;
  onStartChallenges?: () => void;
}

// 6-Node Textbook Linked List with Loop (A -> B -> C -> D -> E -> F -> C)
interface TrackNode {
  id: number;
  label: string;
  x: number;
  y: number;
  isEntry: boolean;
}

const TRACK_NODES: TrackNode[] = [
  { id: 0, label: 'A', x: 55, y: 105, isEntry: false },   // Head
  { id: 1, label: 'B', x: 135, y: 105, isEntry: false },  // Prefix
  { id: 2, label: 'C', x: 220, y: 105, isEntry: true },   // Cycle Entry (mu = 2)
  { id: 3, label: 'D', x: 335, y: 48, isEntry: false },   // Cycle Top
  { id: 4, label: 'E', x: 450, y: 105, isEntry: false },  // Cycle Right (Collision point!)
  { id: 5, label: 'F', x: 335, y: 162, isEntry: false },  // Cycle Bottom
];

// Deterministic Simulation Steps of Floyd's Cycle Detection on this 6-node list
interface DemoStep {
  turn: number;
  slowNode: number;
  fastNode: number;
  prevSlowNode: number | null;
  prevFastNode: number | null;
  isCollision: boolean;
  phaseLabel: string;
  note: string;
}

const DEMO_STEPS: DemoStep[] = [
  {
    turn: 0,
    slowNode: 0,
    fastNode: 0,
    prevSlowNode: null,
    prevFastNode: null,
    isCollision: false,
    phaseLabel: 'TURN 0 // INITIALIZATION',
    note: 'Both Slow (1x) and Fast (2x) pointers start at HEAD (Node A).',
  },
  {
    turn: 1,
    slowNode: 1,
    fastNode: 2,
    prevSlowNode: 0,
    prevFastNode: 0,
    isCollision: false,
    phaseLabel: 'TURN 1 // ADVANCE',
    note: 'Slow advances 1 step to B. Fast leaps 2 steps directly to Loop Entry C.',
  },
  {
    turn: 2,
    slowNode: 2,
    fastNode: 4,
    prevSlowNode: 1,
    prevFastNode: 2,
    isCollision: false,
    phaseLabel: 'TURN 2 // BOTH IN CYCLE',
    note: 'Slow enters loop at C. Fast advances 2 steps to Node E inside the loop.',
  },
  {
    turn: 3,
    slowNode: 3,
    fastNode: 2,
    prevSlowNode: 2,
    prevFastNode: 4,
    isCollision: false,
    phaseLabel: 'TURN 3 // CLOSING DISTANCE',
    note: 'Slow moves to D. Fast loops (E→F→C)! Relative distance closes by Δv = 1.',
  },
  {
    turn: 4,
    slowNode: 4,
    fastNode: 4,
    prevSlowNode: 3,
    prevFastNode: 2,
    isCollision: true,
    phaseLabel: 'TURN 4 // ★ COLLISION DETECTED!',
    note: '★ COLLISION! Slow & Fast meet at Node E. Cycle is mathematically confirmed!',
  },
];

export const HeroSection: React.FC<HeroSectionProps> = ({ 
  onEnterArena, 
  onExploreTheory,
  onStartChallenges,
}) => {
  // Deterministic step state
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Dialogue typewriter state
  const dialogueLines = [
    "HELLO THERE! WELCOME TO THE WORLD OF POINTER ALGORITHMS!",
    "My name is PROFESSOR FLOYD. In this laboratory, algorithms are explored through two loyal partners: HARE and TORTOISE!",
    "Two pointers. Different speeds. One inevitable meeting!",
    "Fast leaps 2 steps for every 1 step of Slow. Inside any loop, their collision is mathematically guaranteed!"
  ];
  const [currentLineIdx, setCurrentLineIdx] = useState(0);

  const step = DEMO_STEPS[currentStepIdx];
  const slowNode = TRACK_NODES[step.slowNode];
  const fastNode = TRACK_NODES[step.fastNode];

  // Advance simulation deterministically
  useEffect(() => {
    if (!isPlaying) return;

    // Longer pause on collision step so viewer can appreciate the meeting
    const delay = step.isCollision ? 3200 : 1600;

    timerRef.current = setTimeout(() => {
      setCurrentStepIdx((prev) => {
        const next = (prev + 1) % DEMO_STEPS.length;
        if (DEMO_STEPS[next].isCollision) {
          sound.playCollision();
        }
        return next;
      });
    }, delay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentStepIdx, step.isCollision]);

  const advanceDialogue = () => {
    sound.playClick();
    setCurrentLineIdx((prev) => (prev + 1) % dialogueLines.length);
  };

  const handleStepForward = () => {
    sound.playClick();
    setIsPlaying(false);
    setCurrentStepIdx((prev) => {
      const next = (prev + 1) % DEMO_STEPS.length;
      if (DEMO_STEPS[next].isCollision) sound.playCollision();
      return next;
    });
  };

  const handleReset = () => {
    sound.playClick();
    setCurrentStepIdx(0);
    setIsPlaying(true);
  };

  return (
    <section className="relative overflow-hidden pt-6 pb-16 px-4 max-w-5xl mx-auto">
      {/* Top Overworld Scenery Decoration */}
      <div className="flex items-center justify-between mb-4 opacity-80 select-none">
        <div className="flex gap-2">
          <PixelTree size={36} />
          <PixelTree size={36} />
        </div>
        <div className="text-center font-pixel text-xs sm:text-[13px] text-gb-pale tracking-widest uppercase font-bold">
          ROUTE 01 // FLOYD'S MEADOW
        </div>
        <div className="flex gap-2">
          <PixelTree size={36} />
          <PixelTree size={36} />
        </div>
      </div>

      {/* Retro Title Plaque */}
      <div className="rpg-box-dark p-6 sm:p-8 mb-6 text-center border-4 border-gb-ink shadow-pixel">
        <div className="inline-block px-3 py-1.5 bg-gb-leaf border-2 border-gb-ink text-gb-cream font-pixel text-xs sm:text-[13px] font-bold mb-3">
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
                <span className="font-pixel text-xs sm:text-[13px] text-hare font-bold">
                  PROF. FLOYD
                </span>
                <span className="font-pixel text-[10px] sm:text-xs text-gb-ink font-bold opacity-75">
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

          {/* Overworld Animated Floyd Circuit */}
          <div className="rpg-box-dark p-4 border-4 border-gb-ink shadow-pixel">
            {/* Header Telemetry */}
            <div className="flex items-center justify-between border-b-2 border-gb-ink pb-2 mb-3">
              <div className="flex items-center gap-3">
                <span className="font-pixel text-xs sm:text-[13px] text-gb-pale font-bold">OVERWORLD PATROL:</span>
                <span className="flex items-center gap-1 font-vt323 text-xl text-tortoise font-bold">
                  <PixelTortoiseSprite size={20} /> SLOW (1x)
                </span>
                <span className="text-gb-pale font-bold">vs</span>
                <span className="flex items-center gap-1 font-vt323 text-xl text-hare font-bold">
                  <PixelHareSprite size={20} /> FAST (2x)
                </span>
              </div>
              <div className="font-pixel text-xs sm:text-[13px] text-gb-cream font-bold">
                {step.isCollision ? (
                  <span className="text-retro-error animate-blink font-bold">★ COLLISION! ★</span>
                ) : (
                  <span>Δv = 1 STEP/TURN</span>
                )}
              </div>
            </div>

            {/* Interactive Linked List with Loop Canvas Screen */}
            <div className="relative bg-[#FAF7EE] border-3 border-gb-ink p-2 shadow-inner">
              <svg viewBox="0 0 520 210" className="w-full h-auto max-h-[260px] select-none" shapeRendering="crispEdges">
                <defs>
                  {/* Background dot matrix */}
                  <pattern id="hero-dots" width="16" height="16" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="1.2" fill="#D8CCA8" opacity="0.6" />
                  </pattern>

                  {/* Retro directional arrowhead */}
                  <marker
                    id="hero-arrow"
                    viewBox="0 0 10 10"
                    refX="22"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1 L 9 5 L 0 9 z" fill="#0D1F18" />
                  </marker>

                  <marker
                    id="hero-arrow-active"
                    viewBox="0 0 10 10"
                    refX="22"
                    refY="5"
                    markerWidth="7"
                    markerHeight="7"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1 L 9 5 L 0 9 z" fill="#E76F51" />
                  </marker>
                </defs>

                {/* Dot matrix screen ground */}
                <rect width="520" height="210" fill="url(#hero-dots)" />

                {/* Directed Conduit Paths (Floyd Linked List: A -> B -> C -> D -> E -> F -> C) */}
                <g>
                  {/* A -> B */}
                  <path d="M 55 105 L 135 105" fill="none" stroke="#0D1F18" strokeWidth="5" markerEnd="url(#hero-arrow)" />
                  <path d="M 55 105 L 135 105" fill="none" stroke="#FAF7EE" strokeWidth="2" />

                  {/* B -> C */}
                  <path d="M 135 105 L 220 105" fill="none" stroke="#0D1F18" strokeWidth="5" markerEnd="url(#hero-arrow)" />
                  <path d="M 135 105 L 220 105" fill="none" stroke="#FAF7EE" strokeWidth="2" />

                  {/* C -> D (upper loop) */}
                  <path d="M 220 105 Q 260 48 335 48" fill="none" stroke="#0D1F18" strokeWidth="5" markerEnd="url(#hero-arrow)" />
                  <path d="M 220 105 Q 260 48 335 48" fill="none" stroke="#FAF7EE" strokeWidth="2" />

                  {/* D -> E (upper loop) */}
                  <path d="M 335 48 Q 410 48 450 105" fill="none" stroke="#0D1F18" strokeWidth="5" markerEnd="url(#hero-arrow)" />
                  <path d="M 335 48 Q 410 48 450 105" fill="none" stroke="#FAF7EE" strokeWidth="2" />

                  {/* E -> F (lower loop) */}
                  <path d="M 450 105 Q 410 162 335 162" fill="none" stroke="#0D1F18" strokeWidth="5" markerEnd="url(#hero-arrow)" />
                  <path d="M 450 105 Q 410 162 335 162" fill="none" stroke="#FAF7EE" strokeWidth="2" />

                  {/* F -> C (loop closure back edge!) */}
                  <path d="M 335 162 Q 260 162 220 105" fill="none" stroke="#0D1F18" strokeWidth="5" strokeDasharray="5,4" markerEnd="url(#hero-arrow)" />
                  <path d="M 335 162 Q 260 162 220 105" fill="none" stroke="#FAF7EE" strokeWidth="2" strokeDasharray="5,4" />
                </g>

                {/* Nodes (Solid 3D Stepping Stone Platforms) */}
                {TRACK_NODES.map((n) => {
                  const isSlowHere = step.slowNode === n.id;
                  const isFastHere = step.fastNode === n.id;
                  const isCollisionHere = step.isCollision && isSlowHere && isFastHere;

                  let borderColor = '#0D1F18';
                  let fillColor = '#FFFFFF';
                  let headerBg = '#386641';

                  if (isCollisionHere) {
                    borderColor = '#E63946';
                    fillColor = '#FFF2B2';
                    headerBg = '#E63946';
                  } else if (isSlowHere && isFastHere) {
                    borderColor = '#6A4C93';
                    headerBg = '#6A4C93';
                  } else if (isSlowHere) {
                    borderColor = '#2A9D8F';
                    headerBg = '#2A9D8F';
                  } else if (isFastHere) {
                    borderColor = '#E76F51';
                    headerBg = '#E76F51';
                  } else if (n.isEntry) {
                    fillColor = '#FDE6B0';
                    borderColor = '#E63946';
                    headerBg = '#E63946';
                  }

                  return (
                    <g key={`hero-node-${n.id}`} transform={`translate(${n.x}, ${n.y})`}>
                      {/* 3D Drop Shadow */}
                      <rect x="-18" y="-18" width="40" height="40" fill="#0D1F18" />

                      {/* Main Square Platform */}
                      <rect
                        x="-20"
                        y="-20"
                        width="40"
                        height="40"
                        fill={fillColor}
                        stroke={borderColor}
                        strokeWidth={isSlowHere || isFastHere ? 3.5 : 2.5}
                      />

                      {/* Top Header Plate */}
                      <rect x="-18" y="-18" width="36" height="10" fill={headerBg} />
                      <text
                        x="0"
                        y="-10"
                        textAnchor="middle"
                        fill="#FFFFFF"
                        fontSize="6"
                        fontWeight="bold"
                        fontFamily="'Press Start 2P', monospace"
                      >
                        #{n.id}
                      </text>

                      {/* Node Letter */}
                      <text
                        x="0"
                        y="10"
                        textAnchor="middle"
                        fill="#0D1F18"
                        fontSize="13"
                        fontWeight="bold"
                        fontFamily="'Press Start 2P', monospace"
                      >
                        {n.label}
                      </text>

                      {/* Cycle Entry Tag */}
                      {n.isEntry && (
                        <g transform="translate(0, -28)">
                          <rect x="-24" y="-6" width="48" height="12" fill="#E63946" stroke="#0D1F18" strokeWidth="1.5" />
                          <text x="0" y="3" textAnchor="middle" fill="#FFFFFF" fontSize="6" fontWeight="bold" fontFamily="'Press Start 2P', monospace">
                            ENTRY μ
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}

                {/* Collision Animation (Starburst & Banner) */}
                {step.isCollision && (
                  <g transform={`translate(${slowNode.x}, ${slowNode.y})`}>
                    <PixelCollisionBurst size={56} x={-28} y={-28} />
                    <g transform="translate(0, -48)">
                      <rect x="-65" y="-12" width="130" height="24" fill="#0D1F18" />
                      <rect x="-67" y="-14" width="130" height="24" fill="#FAF5E6" stroke="#E63946" strokeWidth="2.5" />
                      <text x="0" y="2" textAnchor="middle" fill="#E63946" fontSize="7.5" fontWeight="bold" fontFamily="'Press Start 2P', monospace">
                        ★ COLLISION! ★
                      </text>
                    </g>
                  </g>
                )}

                {/* Slow Tortoise Marker (1x) */}
                {slowNode && (
                  <g
                    transform={`translate(${
                      step.isCollision
                        ? slowNode.x - 22
                        : step.slowNode === step.fastNode
                        ? slowNode.x - 18
                        : slowNode.x
                    }, ${slowNode.y - 42})`}
                    className="transition-all duration-300"
                  >
                    <PixelTortoiseSprite size={26} x={-13} y={-26} />
                    <rect x="-26" y="2" width="52" height="14" fill="#0D1F18" />
                    <rect x="-28" y="0" width="52" height="14" fill="#2A9D8F" stroke="#0D1F18" strokeWidth="1.5" />
                    <text x="-2" y="10" textAnchor="middle" fill="#FFFFFF" fontSize="6" fontWeight="bold" fontFamily="'Press Start 2P', monospace">
                      SLOW 1x
                    </text>
                  </g>
                )}

                {/* Fast Hare Marker (2x) */}
                {fastNode && (
                  <g
                    transform={`translate(${
                      step.isCollision
                        ? fastNode.x + 22
                        : step.slowNode === step.fastNode
                        ? fastNode.x + 18
                        : fastNode.x
                    }, ${
                      // When on different nodes, if Hare is at top node D, position below; otherwise position above
                      step.slowNode !== step.fastNode && step.fastNode === 3
                        ? fastNode.y + 26
                        : fastNode.y - 42
                    })`}
                    className="transition-all duration-300"
                  >
                    <PixelHareSprite size={26} x={-13} y={step.slowNode !== step.fastNode && step.fastNode === 3 ? 14 : -26} />
                    <rect x="-26" y={step.slowNode !== step.fastNode && step.fastNode === 3 ? -2 : 2} width="52" height="14" fill="#0D1F18" />
                    <rect x="-28" y={step.slowNode !== step.fastNode && step.fastNode === 3 ? -4 : 0} width="52" height="14" fill="#E76F51" stroke="#0D1F18" strokeWidth="1.5" />
                    <text x="-2" y={step.slowNode !== step.fastNode && step.fastNode === 3 ? 6 : 10} textAnchor="middle" fill="#FFFFFF" fontSize="6" fontWeight="bold" fontFamily="'Press Start 2P', monospace">
                      FAST 2x
                    </text>
                  </g>
                )}
              </svg>
            </div>

            {/* Step Explanation Dialogue Ribbon */}
            <div className="mt-3 p-3 bg-gb-cream border-2 border-gb-ink text-gb-ink font-vt323 text-xl leading-tight flex items-center justify-between gap-2 shadow-pixel-sm">
              <div className="flex items-center gap-2.5">
                <span className="font-pixel text-xs px-2 py-0.5 bg-gb-forest text-gb-pale border border-gb-ink font-bold">
                  {step.phaseLabel}
                </span>
                <span className="text-lg sm:text-xl font-bold">
                  {step.note}
                </span>
              </div>
            </div>

            {/* Mini Player Controls */}
            <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gb-olive/40 font-pixel text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    sound.playClick();
                    setIsPlaying(!isPlaying);
                  }}
                  className="px-3 py-1.5 bg-gb-olive text-gb-cream border border-gb-ink hover:bg-gb-leaf shadow-pixel-sm font-bold"
                >
                  {isPlaying ? '⏸ PAUSE' : '▶ PLAY'}
                </button>
                <button
                  onClick={handleStepForward}
                  className="px-3 py-1.5 bg-gb-surface text-gb-ink border border-gb-ink hover:bg-white shadow-pixel-sm font-bold"
                >
                  STEP ▶
                </button>
                <button
                  onClick={handleReset}
                  className="px-2.5 py-1.5 bg-gb-forest text-gb-pale border border-gb-ink hover:bg-gb-olive shadow-pixel-sm font-bold"
                >
                  ⟳ RESET
                </button>
              </div>

              <div className="text-gb-pale text-xs font-bold">
                TURN: #{step.turn} / {DEMO_STEPS.length - 1} | SPEED: 1x (Slow) vs 2x (Fast)
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Classic RPG Start / Action Menu */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <div className="rpg-box p-4 border-4 border-gb-ink shadow-pixel">
            <div className="font-pixel text-xs sm:text-[13px] text-gb-ink border-b-2 border-gb-ink pb-2 mb-3 flex items-center justify-between font-bold">
              <span>START MENU</span>
              <span className="text-xs text-hare">SELECT</span>
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
            <div className="mt-4 pt-3 border-t-2 border-dashed border-gb-ink text-gb-ink font-vt323 text-xl leading-tight flex items-start gap-2">
              <PixelSignpost size={24} />
              <p>
                <strong>SIGNBOARD:</strong> "Floyd's Theorem guarantees Tortoise and Hare will meet inside any cycle in at most λ turns."
              </p>
            </div>
          </div>

          {/* Quick Handheld Specs */}
          <div className="rpg-box-dark p-3.5 border-4 border-gb-ink text-gb-cream font-pixel text-xs sm:text-[13px] space-y-2 font-bold">
            <div className="flex justify-between border-b border-gb-olive pb-1.5">
              <span className="text-gb-pale">ENGINE:</span>
              <span>FLOYD-2X-GBC</span>
            </div>
            <div className="flex justify-between border-b border-gb-olive pb-1.5">
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
