import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { AlgorithmMode, AlgorithmSimulationResult } from '../../types/simulation';
import { simulateFloydCycleDetection } from '../../algorithms/floydCycleDetection';
import { simulateCycleEntry } from '../../algorithms/cycleEntry';
import { simulateFindMiddle, MiddleConvention } from '../../algorithms/findMiddle';
import { simulateFindDuplicate } from '../../algorithms/findDuplicate';
import { GraphCanvas } from '../arena/GraphCanvas';
import { SimulatorControls } from '../arena/SimulatorControls';
import { StepInspector } from '../arena/StepInspector';
import { CodeInspector } from '../arena/CodeInspector';
import { PixelHareSprite, PixelTortoiseSprite } from '../pixel/PixelSprites';
import { sound } from '../../utils/audio';

export const EmbedVisualizer: React.FC = () => {
  // Parse query parameters
  const params = useMemo(() => {
    return new URLSearchParams(window.location.search);
  }, []);

  const initialMode = useMemo(() => {
    const m = params.get('mode');
    if (m === 'cycle-entry' || m === 'find-middle' || m === 'find-duplicate') {
      return m;
    }
    return 'cycle-detection' as AlgorithmMode;
  }, [params]);

  const initialNodes = useMemo(() => {
    const n = Number(params.get('nodes'));
    return !isNaN(n) && n >= 3 && n <= 12 ? n : 7;
  }, [params]);

  const initialCyclePos = useMemo(() => {
    const c = Number(params.get('loop'));
    return !isNaN(c) ? c : 2;
  }, [params]);

  const initialSpeed = useMemo(() => {
    const s = Number(params.get('speed'));
    return !isNaN(s) && [0.5, 1, 1.5, 2, 3].includes(s) ? s : 1;
  }, [params]);

  const initialDmg = useMemo(() => {
    const t = params.get('theme');
    if (t === 'dmg') return true;
    if (t === 'color') return false;
    return localStorage.getItem('chase_loop_dmg_mono') === 'true';
  }, [params]);

  const initialMuted = useMemo(() => {
    const m = params.get('muted');
    return m === 'true' || m === '1' || sound.getMuted();
  }, [params]);

  const showHeaderParam = params.get('header') !== 'false';
  const showControlsParam = params.get('controls') !== 'none';
  const autoPlayParam = params.get('autoplay') === 'true' || params.get('autoplay') === '1';

  // Custom Background (for blending into Canva slides)
  const bgParam = params.get('bg');
  const customBgStyle = useMemo(() => {
    if (!bgParam) return undefined;
    if (bgParam === 'transparent') return { backgroundColor: 'transparent', backgroundImage: 'none' };
    if (bgParam === 'black') return { backgroundColor: '#000000', backgroundImage: 'none' };
    const hex = bgParam.startsWith('#') ? bgParam : `#${bgParam}`;
    return { backgroundColor: hex, backgroundImage: 'none' };
  }, [bgParam]);

  // State
  const [mode, setMode] = useState<AlgorithmMode>(initialMode);
  const [nodeCount, setNodeCount] = useState<number>(initialNodes);
  const [cyclePos, setCyclePos] = useState<number>(initialCyclePos);
  const [middleConvention, setMiddleConvention] = useState<MiddleConvention>('second');
  const [duplicateArray, setDuplicateArray] = useState<number[]>([1, 3, 4, 2, 2]);

  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(initialSpeed);
  const [isMuted, setIsMuted] = useState<boolean>(initialMuted);
  const [isDmgMode, setIsDmgMode] = useState<boolean>(initialDmg);
  const [showDrawer, setShowDrawer] = useState<boolean>(params.get('drawer') === 'true');
  const [drawerTab, setDrawerTab] = useState<'log' | 'code' | 'params'>('log');

  // Simulation computation
  const simulationResult: AlgorithmSimulationResult = useMemo(() => {
    switch (mode) {
      case 'cycle-detection':
        return simulateFloydCycleDetection({ nodeCount, cyclePos });
      case 'cycle-entry':
        return simulateCycleEntry({ nodeCount, cyclePos });
      case 'find-middle':
        return simulateFindMiddle({ nodeCount, convention: middleConvention });
      case 'find-duplicate':
        try {
          return simulateFindDuplicate(duplicateArray);
        } catch {
          return simulateFindDuplicate([1, 3, 4, 2, 2]);
        }
      default:
        return simulateFloydCycleDetection({ nodeCount, cyclePos });
    }
  }, [mode, nodeCount, cyclePos, middleConvention, duplicateArray]);

  const steps = simulationResult.steps;
  const totalSteps = steps.length;
  const currentStep = steps[currentStepIndex] || null;

  // Autoplay timer ref
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const stopPlayback = useCallback(() => {
    setIsPlaying(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Step Forward
  const handleStepForward = useCallback(() => {
    setCurrentStepIndex((prev) => {
      if (prev < totalSteps - 1) {
        const next = prev + 1;
        const nextStep = steps[next];
        if (nextStep) {
          if (nextStep.status === 'COLLISION') {
            sound.playCollision();
          } else if (
            nextStep.status === 'FOUND_ENTRY' ||
            nextStep.status === 'FOUND_MIDDLE' ||
            nextStep.status === 'FOUND_DUPLICATE'
          ) {
            sound.playVictory();
          }
        }
        return next;
      } else {
        stopPlayback();
        return prev;
      }
    });
  }, [totalSteps, steps, stopPlayback]);

  // Step Backward
  const handleStepBackward = useCallback(() => {
    setCurrentStepIndex((prev) => Math.max(0, prev - 1));
  }, []);

  // Reset
  const handleReset = useCallback(() => {
    stopPlayback();
    setCurrentStepIndex(0);
  }, [stopPlayback]);

  // Play / Pause toggle
  const handlePlayPause = useCallback(() => {
    if (isPlaying) {
      stopPlayback();
    } else {
      if (currentStepIndex >= totalSteps - 1) {
        setCurrentStepIndex(0);
      }
      setIsPlaying(true);
    }
  }, [isPlaying, currentStepIndex, totalSteps, stopPlayback]);

  // Speed change
  const handleSpeedChange = useCallback((newSpeed: number) => {
    setSpeed(newSpeed);
  }, []);

  // Mute toggle
  const handleMuteToggle = useCallback(() => {
    const next = sound.toggleMute();
    setIsMuted(next);
  }, []);

  // DMG mode toggle
  const handleToggleDmg = useCallback(() => {
    setIsDmgMode((prev) => {
      const next = !prev;
      localStorage.setItem('chase_loop_dmg_mono', String(next));
      return next;
    });
  }, []);

  // Handle Autoplay Loop
  useEffect(() => {
    if (isPlaying) {
      const intervalMs = Math.max(200, 1100 / speed);
      timerRef.current = setInterval(() => {
        handleStepForward();
      }, intervalMs);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, speed, handleStepForward]);

  // Autoplay on mount if requested
  useEffect(() => {
    if (autoPlayParam) {
      setIsPlaying(true);
    }
  }, [autoPlayParam]);

  // Keyboard shortcut navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          handlePlayPause();
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleStepForward();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          handleStepBackward();
          break;
        case 'KeyR':
          e.preventDefault();
          handleReset();
          break;
        case 'KeyM':
          e.preventDefault();
          handleMuteToggle();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePlayPause, handleStepForward, handleStepBackward, handleReset, handleMuteToggle]);

  return (
    <div
      style={customBgStyle}
      className={`w-screen h-screen overflow-hidden flex flex-col justify-between p-2 sm:p-3 select-none text-gb-cream font-vt323 ${
        isDmgMode ? 'dmg-mono' : ''
      } ${!customBgStyle ? 'bg-gb-forest' : ''}`}
    >
      {/* Top Embedded Ribbon (Chromeless Navigation for Canva) */}
      {showHeaderParam && (
        <header className="flex flex-wrap items-center justify-between gap-2 bg-gb-forest/90 border-2 border-gb-ink p-2 shadow-pixel-sm shrink-0 mb-2">
          {/* Logo Brand Tag */}
          <div className="flex items-center gap-2">
            <div className="flex items-center -space-x-1 p-1 bg-gb-cream border border-gb-ink shadow-pixel-sm">
              <PixelTortoiseSprite size={18} />
              <PixelHareSprite size={18} />
            </div>
            <span className="font-pixel text-xs sm:text-[13px] text-white font-bold tracking-tight">
              CHASE<span className="text-hare">::</span>LOOP
            </span>
          </div>

          {/* Quick Cartridge Mode Selector */}
          <nav className="flex items-center gap-1 overflow-x-auto py-0.5">
            {[
              { id: 'cycle-detection', label: 'CYCLE DETECT', badge: 'O(N)' },
              { id: 'cycle-entry', label: 'CYCLE ENTRY', badge: 'μ=mλ-k' },
              { id: 'find-middle', label: 'FIND MIDDLE', badge: '⌊N/2⌋' },
              { id: 'find-duplicate', label: 'DUPLICATE', badge: 'LC 287' },
            ].map((tab) => {
              const isSelected = mode === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    sound.playClick();
                    stopPlayback();
                    setMode(tab.id as AlgorithmMode);
                    setCurrentStepIndex(0);
                  }}
                  className={`px-2 py-1 font-pixel text-[10px] sm:text-xs font-bold border transition-all ${
                    isSelected
                      ? 'bg-gb-cream text-gb-ink border-gb-ink shadow-pixel-sm'
                      : 'bg-gb-olive text-gb-cream border-gb-ink hover:bg-gb-leaf'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Quick Hardware Toggles & Slide Presentation Controls */}
          <div className="flex items-center gap-1.5">
            {/* Drawer toggle (inspect code / log) */}
            <button
              onClick={() => setShowDrawer(!showDrawer)}
              title="Toggle Log / Code Inspector"
              className={`px-2 py-1 font-pixel text-[10px] sm:text-xs font-bold border border-gb-ink ${
                showDrawer ? 'bg-hare text-white' : 'bg-gb-olive text-gb-cream hover:bg-gb-leaf'
              }`}
            >
              {showDrawer ? '✕ CLOSE' : '📟 CODE/LOG'}
            </button>

            {/* Sound mute button */}
            <button
              onClick={handleMuteToggle}
              title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
              className="px-2 py-1 font-pixel text-xs border border-gb-ink bg-gb-cream text-gb-ink hover:bg-white"
            >
              {isMuted ? '🔇' : '🔊'}
            </button>

            {/* DMG/GBC palette toggle */}
            <button
              onClick={handleToggleDmg}
              title="Toggle Game Boy Color / DMG Palette"
              className="px-2 py-1 font-pixel text-[10px] sm:text-xs border border-gb-ink bg-gb-forest text-gb-pale hover:text-white"
            >
              {isDmgMode ? 'DMG' : 'GBC'}
            </button>
          </div>
        </header>
      )}

      {/* Main Interactive Presentation Canvas Area */}
      <div className="flex-1 relative min-h-0 w-full flex gap-3 overflow-hidden">
        {/* Visualizer SVG Screen */}
        <div className={`flex-1 h-full min-h-0 flex flex-col ${showDrawer ? 'w-2/3' : 'w-full'}`}>
          <GraphCanvas
            mode={mode}
            nodes={simulationResult.nodes}
            cyclePos={cyclePos}
            currentStep={currentStep}
            numsArray={mode === 'find-duplicate' ? duplicateArray : []}
          />
        </div>

        {/* Optional Collapsible Drawer for Slides (Prof's Log or Code Disassembler) */}
        {showDrawer && (
          <aside className="w-1/3 h-full flex flex-col bg-gb-forest border-4 border-gb-ink shadow-pixel shrink-0 animate-fade-in overflow-hidden">
            {/* Drawer Tab Header */}
            <div className="flex items-center justify-between bg-gb-olive border-b-2 border-gb-ink p-1.5 shrink-0">
              <div className="flex gap-1">
                <button
                  onClick={() => setDrawerTab('log')}
                  className={`px-2 py-0.5 font-pixel text-xs font-bold border border-gb-ink ${
                    drawerTab === 'log' ? 'bg-gb-cream text-gb-ink' : 'bg-gb-forest text-gb-pale'
                  }`}
                >
                  LOG
                </button>
                <button
                  onClick={() => setDrawerTab('code')}
                  className={`px-2 py-0.5 font-pixel text-xs font-bold border border-gb-ink ${
                    drawerTab === 'code' ? 'bg-gb-cream text-gb-ink' : 'bg-gb-forest text-gb-pale'
                  }`}
                >
                  CODE
                </button>
                <button
                  onClick={() => setDrawerTab('params')}
                  className={`px-2 py-0.5 font-pixel text-xs font-bold border border-gb-ink ${
                    drawerTab === 'params' ? 'bg-gb-cream text-gb-ink' : 'bg-gb-forest text-gb-pale'
                  }`}
                >
                  PARAMS
                </button>
              </div>

              <button
                onClick={() => setShowDrawer(false)}
                className="px-1.5 py-0.5 font-pixel text-xs text-retro-error hover:bg-gb-cream"
              >
                ✕
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-2">
              {drawerTab === 'log' && (
                <StepInspector currentStep={currentStep} totalSteps={totalSteps} />
              )}
              {drawerTab === 'code' && (
                <CodeInspector mode={mode} currentStep={currentStep} />
              )}
              {drawerTab === 'params' && (
                <div className="p-3 bg-gb-forest border-2 border-gb-ink text-gb-cream font-pixel text-xs space-y-4">
                  {(mode === 'cycle-detection' || mode === 'cycle-entry') && (
                    <>
                      <div>
                        <div className="flex justify-between mb-1.5 text-gb-pale">
                          <span>NODES:</span>
                          <span className="text-hare font-bold">{nodeCount}</span>
                        </div>
                        <input
                          type="range"
                          min={3}
                          max={12}
                          value={nodeCount}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setNodeCount(val);
                            if (cyclePos >= val) setCyclePos(val - 1);
                          }}
                          className="w-full accent-hare cursor-pointer"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1.5 text-gb-pale">
                          <span>CYCLE ENTRY:</span>
                          <span className="text-tortoise font-bold">
                            {cyclePos === -1 ? 'NONE' : `#${cyclePos}`}
                          </span>
                        </div>
                        <input
                          type="range"
                          min={-1}
                          max={nodeCount - 1}
                          value={cyclePos}
                          onChange={(e) => setCyclePos(Number(e.target.value))}
                          className="w-full accent-tortoise cursor-pointer"
                        />
                      </div>
                    </>
                  )}

                  {mode === 'find-middle' && (
                    <>
                      <div>
                        <div className="flex justify-between mb-1.5 text-gb-pale">
                          <span>LENGTH:</span>
                          <span className="text-hare font-bold">{nodeCount}</span>
                        </div>
                        <input
                          type="range"
                          min={1}
                          max={12}
                          value={nodeCount}
                          onChange={(e) => setNodeCount(Number(e.target.value))}
                          className="w-full accent-hare cursor-pointer"
                        />
                      </div>
                      <div>
                        <div className="mb-1.5 text-gb-pale">CONVENTION:</div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setMiddleConvention('second')}
                            className={`flex-1 py-1 px-1.5 border border-gb-ink ${
                              middleConvention === 'second' ? 'bg-gb-cream text-gb-ink font-bold' : 'bg-gb-olive text-gb-cream'
                            }`}
                          >
                            SECOND ⌊N/2⌋
                          </button>
                          <button
                            onClick={() => setMiddleConvention('first')}
                            className={`flex-1 py-1 px-1.5 border border-gb-ink ${
                              middleConvention === 'first' ? 'bg-gb-cream text-gb-ink font-bold' : 'bg-gb-olive text-gb-cream'
                            }`}
                          >
                            FIRST
                          </button>
                        </div>
                      </div>
                    </>
                  )}

                  {mode === 'find-duplicate' && (
                    <div>
                      <div className="mb-2 text-gb-pale">ARRAY PRESETS:</div>
                      <div className="grid grid-cols-2 gap-1.5">
                        {[
                          [1, 3, 4, 2, 2],
                          [3, 1, 3, 4, 2],
                          [1, 1],
                          [2, 5, 9, 6, 9, 3, 8, 9, 7, 1],
                        ].map((preset, idx) => (
                          <button
                            key={`arr-${idx}`}
                            onClick={() => setDuplicateArray(preset)}
                            className="p-1.5 bg-gb-olive border border-gb-ink hover:bg-gb-leaf truncate font-bold text-center"
                          >
                            [{preset.slice(0, 4).join(',')}{preset.length > 4 ? '…' : ''}]
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </aside>
        )}
      </div>

      {/* Bottom Retro Playback Controls for Canva Slide Presenters */}
      {showControlsParam && (
        <footer className="mt-2 shrink-0">
          <SimulatorControls
            isPlaying={isPlaying}
            canStepForward={currentStepIndex < totalSteps - 1}
            canStepBackward={currentStepIndex > 0}
            currentStepIndex={currentStepIndex}
            totalSteps={totalSteps}
            speed={speed}
            isMuted={isMuted}
            onPlayPause={handlePlayPause}
            onStepForward={handleStepForward}
            onStepBackward={handleStepBackward}
            onReset={handleReset}
            onSpeedChange={handleSpeedChange}
            onMuteToggle={handleMuteToggle}
            onStepSeek={(idx) => {
              stopPlayback();
              setCurrentStepIndex(idx);
            }}
          />
        </footer>
      )}
    </div>
  );
};
