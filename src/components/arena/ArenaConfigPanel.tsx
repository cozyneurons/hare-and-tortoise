import React, { useState } from 'react';
import { AlgorithmMode } from '../../types/simulation';
import { MiddleConvention } from '../../algorithms/findMiddle';
import { validateDuplicateArray } from '../../algorithms/findDuplicate';
import { Settings2, Shuffle, CheckCircle, AlertCircle } from 'lucide-react';

interface ArenaConfigPanelProps {
  mode: AlgorithmMode;
  onModeChange: (mode: AlgorithmMode) => void;
  // Node configs
  nodeCount: number;
  onNodeCountChange: (count: number) => void;
  cyclePos: number;
  onCyclePosChange: (pos: number) => void;
  // Middle convention
  middleConvention: MiddleConvention;
  onMiddleConventionChange: (conv: MiddleConvention) => void;
  // Duplicate array
  duplicateArray: number[];
  onDuplicateArrayChange: (nums: number[]) => void;
}

export const ArenaConfigPanel: React.FC<ArenaConfigPanelProps> = ({
  mode,
  onModeChange,
  nodeCount,
  onNodeCountChange,
  cyclePos,
  onCyclePosChange,
  middleConvention,
  onMiddleConventionChange,
  duplicateArray,
  onDuplicateArrayChange,
}) => {
  const [dupInputText, setDupInputText] = useState(duplicateArray.join(', '));
  const [dupError, setDupError] = useState<string | null>(null);

  const MODES: { id: AlgorithmMode; label: string; badge: string; desc: string }[] = [
    {
      id: 'cycle-detection',
      label: '01 Floyd Cycle Detection',
      badge: 'DETECTION',
      desc: 'Detect whether a loop exists in a singly linked list',
    },
    {
      id: 'cycle-entry',
      label: '02 Cycle Entry Point',
      badge: 'TWO-PHASE',
      desc: 'Locate the exact starting node of the cycle',
    },
    {
      id: 'find-middle',
      label: '03 Find Middle Node',
      badge: 'SINGLE-PASS',
      desc: 'Find the middle node without knowing list length',
    },
    {
      id: 'find-duplicate',
      label: '04 Find Duplicate Number',
      badge: 'FUNCTIONAL GRAPH',
      desc: 'Array of n+1 integers in [1, n] as a graph',
    },
  ];

  // Handle duplicate text submit
  const handleDupInputChange = (text: string) => {
    setDupInputText(text);
    const parsed = text
      .split(',')
      .map(s => s.trim())
      .filter(s => s !== '')
      .map(Number);

    if (parsed.some(isNaN)) {
      setDupError('Array must contain comma-separated integers only.');
      return;
    }

    const validation = validateDuplicateArray(parsed);
    if (!validation.isValid) {
      setDupError(validation.error || 'Invalid array constraints.');
    } else {
      setDupError(null);
      onDuplicateArrayChange(parsed);
    }
  };

  // Generate random valid duplicate array
  const generateRandomDuplicateArray = () => {
    const n = Math.floor(Math.random() * 5) + 3; // n from 3 to 7
    const duplicate = Math.floor(Math.random() * n) + 1;
    const arr: number[] = [];

    // Fill array of length n+1 with numbers in [1, n] ensuring duplicate occurs at least twice
    arr.push(duplicate);
    arr.push(duplicate);
    while (arr.length < n + 1) {
      arr.push(Math.floor(Math.random() * n) + 1);
    }
    // Shuffle
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    setDupInputText(arr.join(', '));
    setDupError(null);
    onDuplicateArrayChange(arr);
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-arcade-900 border border-arcade-800 rounded-xl shadow-xl">
      {/* Mode Selector Tabs */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Settings2 className="w-4 h-4 text-lime-accent" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
              ALGORITHM ARENA MODE
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {MODES.map((m) => {
            const isSelected = mode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => onModeChange(m.id)}
                className={`flex flex-col items-start p-2.5 rounded-lg border text-left transition-all ${
                  isSelected
                    ? 'bg-arcade-850 border-lime-accent text-white shadow-glow-lime'
                    : 'bg-arcade-950/60 border-arcade-800 text-slate-400 hover:text-slate-200 hover:border-arcade-700'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-xs font-bold font-mono tracking-tight text-white">
                    {m.label}
                  </span>
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                      isSelected
                        ? 'bg-lime-accent/20 text-lime-accent font-semibold'
                        : 'bg-arcade-800 text-slate-400'
                    }`}
                  >
                    {m.badge}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                  {m.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mode Specific Controls */}
      <div className="border-t border-arcade-800/80 pt-3">
        {(mode === 'cycle-detection' || mode === 'cycle-entry') && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Node count slider */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-400">TOTAL NODES:</span>
                <span className="text-lime-accent font-bold">{nodeCount} Nodes</span>
              </div>
              <input
                type="range"
                min={3}
                max={12}
                value={nodeCount}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  onNodeCountChange(val);
                  if (cyclePos >= val) {
                    onCyclePosChange(Math.max(-1, val - 1));
                  }
                }}
                className="w-full h-1.5 bg-arcade-800 rounded-lg appearance-none cursor-pointer accent-lime-accent"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>3 nodes</span>
                <span>12 nodes</span>
              </div>
            </div>

            {/* Cycle Position slider */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-400">CYCLE START NODE:</span>
                <span className="text-tortoise-cyan font-bold">
                  {cyclePos === -1 ? 'None (No Cycle)' : `Node #${cyclePos} (Loop Length ${nodeCount - cyclePos})`}
                </span>
              </div>
              <input
                type="range"
                min={-1}
                max={nodeCount - 1}
                value={cyclePos}
                onChange={(e) => onCyclePosChange(Number(e.target.value))}
                className="w-full h-1.5 bg-arcade-800 rounded-lg appearance-none cursor-pointer accent-tortoise-cyan"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>-1 (No Cycle)</span>
                <span>Node #{nodeCount - 1}</span>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="md:col-span-2 flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] font-mono text-slate-500 mr-1">PRESETS:</span>
              <button
                onClick={() => {
                  onNodeCountChange(7);
                  onCyclePosChange(2);
                }}
                className="px-2 py-1 text-[11px] font-mono rounded bg-arcade-850 hover:bg-arcade-800 border border-arcade-800 text-slate-300"
              >
                Classic Loop (7 nodes, entry #2)
              </button>
              <button
                onClick={() => {
                  onNodeCountChange(6);
                  onCyclePosChange(0);
                }}
                className="px-2 py-1 text-[11px] font-mono rounded bg-arcade-850 hover:bg-arcade-800 border border-arcade-800 text-slate-300"
              >
                Full Ring (Entry at Head #0)
              </button>
              <button
                onClick={() => {
                  onNodeCountChange(5);
                  onCyclePosChange(4);
                }}
                className="px-2 py-1 text-[11px] font-mono rounded bg-arcade-850 hover:bg-arcade-800 border border-arcade-800 text-slate-300"
              >
                Tail Self-Loop (#4)
              </button>
              <button
                onClick={() => {
                  onNodeCountChange(6);
                  onCyclePosChange(-1);
                }}
                className="px-2 py-1 text-[11px] font-mono rounded bg-arcade-850 hover:bg-arcade-800 border border-arcade-800 text-slate-300"
              >
                Strictly Linear (No Cycle)
              </button>
            </div>
          </div>
        )}

        {mode === 'find-middle' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Node count slider */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-400">LINKED LIST LENGTH:</span>
                <span className="text-lime-accent font-bold">
                  {nodeCount} Nodes ({nodeCount % 2 === 0 ? 'EVEN' : 'ODD'})
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={12}
                value={nodeCount}
                onChange={(e) => onNodeCountChange(Number(e.target.value))}
                className="w-full h-1.5 bg-arcade-800 rounded-lg appearance-none cursor-pointer accent-lime-accent"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>1 node</span>
                <span>12 nodes</span>
              </div>
            </div>

            {/* Middle Convention Selector */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-400">EVEN-LENGTH CONVENTION:</span>
                <span className="text-cyan-400 font-bold uppercase">{middleConvention} Middle</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onMiddleConventionChange('second')}
                  className={`flex-1 py-1.5 px-3 rounded text-xs font-mono font-medium border transition-all ${
                    middleConvention === 'second'
                      ? 'bg-arcade-850 border-cyan-500 text-cyan-300 shadow-glow-tortoise'
                      : 'bg-arcade-950 border-arcade-800 text-slate-400'
                  }`}
                >
                  Second Middle &lfloor;N/2&rfloor; (Standard)
                </button>
                <button
                  onClick={() => onMiddleConventionChange('first')}
                  className={`flex-1 py-1.5 px-3 rounded text-xs font-mono font-medium border transition-all ${
                    middleConvention === 'first'
                      ? 'bg-arcade-850 border-cyan-500 text-cyan-300 shadow-glow-tortoise'
                      : 'bg-arcade-950 border-arcade-800 text-slate-400'
                  }`}
                >
                  First Middle &lfloor;(N-1)/2&rfloor;
                </button>
              </div>
            </div>
          </div>
        )}

        {mode === 'find-duplicate' && (
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs font-mono text-slate-300">
                <span>ARRAY OF N+1 INTEGERS (RANGE [1, N]):</span>
                <span className="text-[10px] text-slate-500 font-sans">
                  (Comma-separated)
                </span>
              </div>
              <button
                onClick={generateRandomDuplicateArray}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded bg-arcade-850 hover:bg-arcade-800 border border-arcade-800 text-lime-accent transition-all active:scale-95"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>Random Input</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={dupInputText}
                onChange={(e) => handleDupInputChange(e.target.value)}
                placeholder="e.g. 1, 3, 4, 2, 2"
                className="flex-1 px-3 py-2 bg-arcade-950 border border-arcade-800 rounded-lg font-mono text-sm text-slate-100 focus:outline-none focus:border-lime-accent"
              />
              {dupError ? (
                <div className="flex items-center gap-1 text-xs text-rose-400 font-mono">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Invalid</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-xs text-lime-accent font-mono">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>Valid</span>
                </div>
              )}
            </div>

            {dupError && (
              <div className="text-xs text-rose-400 font-mono bg-rose-950/40 border border-rose-900/60 p-2 rounded">
                {dupError}
              </div>
            )}

            {/* Presets */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
              <span className="text-slate-500">PRESETS:</span>
              {[
                [1, 3, 4, 2, 2],
                [3, 1, 3, 4, 2],
                [1, 1],
                [2, 5, 9, 6, 9, 3, 8, 9, 7, 1],
              ].map((preset, idx) => (
                <button
                  key={`preset-${idx}`}
                  onClick={() => {
                    const str = preset.join(', ');
                    setDupInputText(str);
                    setDupError(null);
                    onDuplicateArrayChange(preset);
                  }}
                  className="px-2 py-0.5 rounded bg-arcade-850 hover:bg-arcade-800 border border-arcade-800 text-slate-300"
                >
                  [{preset.join(',')}]
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
