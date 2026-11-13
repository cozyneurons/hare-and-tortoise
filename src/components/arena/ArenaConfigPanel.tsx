import React, { useState } from 'react';
import { AlgorithmMode } from '../../types/simulation';
import { MiddleConvention } from '../../algorithms/findMiddle';
import { validateDuplicateArray } from '../../algorithms/findDuplicate';
import { sound } from '../../utils/audio';

interface ArenaConfigPanelProps {
  mode: AlgorithmMode;
  onModeChange: (mode: AlgorithmMode) => void;
  nodeCount: number;
  onNodeCountChange: (count: number) => void;
  cyclePos: number;
  onCyclePosChange: (pos: number) => void;
  middleConvention: MiddleConvention;
  onMiddleConventionChange: (conv: MiddleConvention) => void;
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
      label: 'CART 01 // CYCLE DETECT',
      badge: 'PHASE-1',
      desc: 'Detect closed loops in singly linked list',
    },
    {
      id: 'cycle-entry',
      label: 'CART 02 // CYCLE ENTRY',
      badge: 'TWO-PHASE',
      desc: 'Pinpoint cycle start node with mu = m*lambda - k',
    },
    {
      id: 'find-middle',
      label: 'CART 03 // FIND MIDDLE',
      badge: '1-PASS',
      desc: 'Traverse list at 2x:1x to identify middle',
    },
    {
      id: 'find-duplicate',
      label: 'CART 04 // DUPE HUNTER',
      badge: 'GRAPH',
      desc: 'Map array values as directed functional graph',
    },
  ];

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

  const generateRandomDuplicateArray = () => {
    sound.playClick();
    const n = Math.floor(Math.random() * 5) + 3;
    const duplicate = Math.floor(Math.random() * n) + 1;
    const arr: number[] = [duplicate, duplicate];
    while (arr.length < n + 1) {
      arr.push(Math.floor(Math.random() * n) + 1);
    }
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    setDupInputText(arr.join(', '));
    setDupError(null);
    onDuplicateArrayChange(arr);
  };

  return (
    <div className="rpg-box-dark p-4 border-4 border-gb-ink shadow-pixel text-gb-cream select-none">
      {/* Cartridge Selection Slot */}
      <div className="mb-4">
        <div className="flex items-center justify-between border-b-2 border-gb-ink pb-2 mb-3">
          <span className="font-pixel text-xs text-gb-pale font-bold">
            INSERT ALGORITHM CARTRIDGE:
          </span>
          <span className="font-pixel text-[10px] text-hare font-bold">
            GBC LAB CONSOLE
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {MODES.map((m) => {
            const isSelected = mode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => {
                  sound.playClick();
                  onModeChange(m.id);
                }}
                className={`p-3 text-left border-2 transition-all shadow-pixel-sm ${
                  isSelected
                    ? 'bg-gb-cream text-gb-ink border-gb-ink font-bold'
                    : 'bg-gb-olive/70 text-gb-cream border-gb-ink hover:bg-gb-leaf/60'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-pixel text-[11px] sm:text-xs tracking-tight font-bold">
                    {m.label}
                  </span>
                  <span className={`px-1.5 py-0.5 text-[8.5px] font-pixel border border-gb-ink font-bold ${
                    isSelected ? 'bg-hare text-white' : 'bg-gb-forest text-gb-pale'
                  }`}>
                    {m.badge}
                  </span>
                </div>
                <div className="font-vt323 text-lg sm:text-xl text-gb-ink/90 leading-tight">
                  {m.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mode Specific Laboratory Parameters */}
      <div className="border-t-2 border-gb-ink pt-3">
        {(mode === 'cycle-detection' || mode === 'cycle-entry') && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Total nodes slider */}
            <div className="p-3 bg-gb-forest border-2 border-gb-ink">
              <div className="flex justify-between items-center font-pixel text-[9px] mb-2 text-gb-pale">
                <span>TOTAL NODES:</span>
                <span className="text-hare font-bold">{nodeCount} NODES</span>
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
                className="w-full accent-hare cursor-pointer"
              />
              <div className="flex justify-between text-[8px] font-pixel text-gb-pale/75 mt-1">
                <span>3 MIN</span>
                <span>12 MAX</span>
              </div>
            </div>

            {/* Cycle Position slider */}
            <div className="p-3 bg-gb-forest border-2 border-gb-ink">
              <div className="flex justify-between items-center font-pixel text-[9px] mb-2 text-gb-pale">
                <span>CYCLE ENTRY NODE:</span>
                <span className="text-tortoise font-bold">
                  {cyclePos === -1 ? 'NONE (NO LOOP)' : `NODE #${cyclePos}`}
                </span>
              </div>
              <input
                type="range"
                min={-1}
                max={nodeCount - 1}
                value={cyclePos}
                onChange={(e) => onCyclePosChange(Number(e.target.value))}
                className="w-full accent-tortoise cursor-pointer"
              />
              <div className="flex justify-between text-[8px] font-pixel text-gb-pale/75 mt-1">
                <span>-1 NO CYCLE</span>
                <span>NODE #{nodeCount - 1}</span>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="md:col-span-2 flex flex-wrap items-center gap-1.5 pt-1">
              <span className="font-pixel text-[8px] text-gb-pale mr-1">PRESETS:</span>
              <button
                onClick={() => {
                  sound.playClick();
                  onNodeCountChange(7);
                  onCyclePosChange(2);
                }}
                className="pixel-btn pixel-btn-secondary !py-1 !px-2 !text-[8px]"
              >
                CLASSIC LOOP (#2)
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  onNodeCountChange(6);
                  onCyclePosChange(0);
                }}
                className="pixel-btn pixel-btn-secondary !py-1 !px-2 !text-[8px]"
              >
                HEAD LOOP (#0)
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  onNodeCountChange(5);
                  onCyclePosChange(4);
                }}
                className="pixel-btn pixel-btn-secondary !py-1 !px-2 !text-[8px]"
              >
                TAIL SELF-LOOP (#4)
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  onNodeCountChange(6);
                  onCyclePosChange(-1);
                }}
                className="pixel-btn pixel-btn-secondary !py-1 !px-2 !text-[8px]"
              >
                NO CYCLE (LINEAR)
              </button>
            </div>
          </div>
        )}

        {mode === 'find-middle' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Node count slider */}
            <div className="p-3 bg-gb-forest border-2 border-gb-ink">
              <div className="flex justify-between items-center font-pixel text-[9px] mb-2 text-gb-pale">
                <span>LIST LENGTH:</span>
                <span className="text-hare font-bold">{nodeCount} NODES ({nodeCount % 2 === 0 ? 'EVEN' : 'ODD'})</span>
              </div>
              <input
                type="range"
                min={1}
                max={12}
                value={nodeCount}
                onChange={(e) => onNodeCountChange(Number(e.target.value))}
                className="w-full accent-hare cursor-pointer"
              />
            </div>

            {/* Middle Convention */}
            <div className="p-3 bg-gb-forest border-2 border-gb-ink">
              <div className="font-pixel text-[9px] mb-2 text-gb-pale">
                EVEN LENGTH CONVENTION:
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    sound.playClick();
                    onMiddleConventionChange('second');
                  }}
                  className={`flex-1 py-1.5 px-2 font-pixel text-[8px] border-2 border-gb-ink ${
                    middleConvention === 'second'
                      ? 'bg-gb-cream text-gb-ink font-bold shadow-pixel-sm'
                      : 'bg-gb-olive text-gb-cream'
                  }`}
                >
                  SECOND MIDDLE ⌊N/2⌋
                </button>
                <button
                  onClick={() => {
                    sound.playClick();
                    onMiddleConventionChange('first');
                  }}
                  className={`flex-1 py-1.5 px-2 font-pixel text-[8px] border-2 border-gb-ink ${
                    middleConvention === 'first'
                      ? 'bg-gb-cream text-gb-ink font-bold shadow-pixel-sm'
                      : 'bg-gb-olive text-gb-cream'
                  }`}
                >
                  FIRST MIDDLE ⌊(N-1)/2⌋
                </button>
              </div>
            </div>
          </div>
        )}

        {mode === 'find-duplicate' && (
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-pixel text-[9px] text-gb-pale">
                ARRAY OF N+1 INTEGERS (RANGE [1, N]):
              </span>
              <button
                onClick={generateRandomDuplicateArray}
                className="pixel-btn pixel-btn-secondary !py-1 !px-2 !text-[8px]"
              >
                🎲 RANDOM ARRAY
              </button>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={dupInputText}
                onChange={(e) => handleDupInputChange(e.target.value)}
                placeholder="e.g. 1, 3, 4, 2, 2"
                className="flex-1 px-3 py-1.5 bg-gb-cream border-2 border-gb-ink font-vt323 text-2xl text-gb-ink focus:outline-none"
              />
              <span className={`px-2 py-1 font-pixel text-[8px] border-2 border-gb-ink ${
                dupError ? 'bg-retro-error text-white' : 'bg-retro-success text-white'
              }`}>
                {dupError ? 'ERROR' : 'VALID'}
              </span>
            </div>

            {dupError && (
              <div className="p-2 bg-retro-error/20 border-2 border-retro-error text-retro-error font-vt323 text-lg">
                {dupError}
              </div>
            )}

            {/* Presets */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="font-pixel text-[8px] text-gb-pale">PRESETS:</span>
              {[
                [1, 3, 4, 2, 2],
                [3, 1, 3, 4, 2],
                [1, 1],
                [2, 5, 9, 6, 9, 3, 8, 9, 7, 1],
              ].map((preset, idx) => (
                <button
                  key={`preset-${idx}`}
                  onClick={() => {
                    sound.playClick();
                    setDupInputText(preset.join(', '));
                    setDupError(null);
                    onDuplicateArrayChange(preset);
                  }}
                  className="px-2 py-0.5 bg-gb-olive border border-gb-ink font-pixel text-[8px] text-gb-cream hover:bg-gb-leaf"
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
