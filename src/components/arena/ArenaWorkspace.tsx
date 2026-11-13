import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { AlgorithmMode, AlgorithmSimulationResult } from '../../types/simulation';
import { simulateFloydCycleDetection } from '../../algorithms/floydCycleDetection';
import { simulateCycleEntry } from '../../algorithms/cycleEntry';
import { simulateFindMiddle, MiddleConvention } from '../../algorithms/findMiddle';
import { simulateFindDuplicate } from '../../algorithms/findDuplicate';
import { GraphCanvas } from './GraphCanvas';
import { SimulatorControls } from './SimulatorControls';
import { StepInspector } from './StepInspector';
import { CodeInspector } from './CodeInspector';
import { ArenaConfigPanel } from './ArenaConfigPanel';
import { sound } from '../../utils/audio';

export const ArenaWorkspace: React.FC = () => {
  // Mode selection
  const [mode, setMode] = useState<AlgorithmMode>('cycle-detection');

  // Input Configurations
  const [nodeCount, setNodeCount] = useState<number>(7);
  const [cyclePos, setCyclePos] = useState<number>(2);
  const [middleConvention, setMiddleConvention] = useState<MiddleConvention>('second');
  const [duplicateArray, setDuplicateArray] = useState<number[]>([1, 3, 4, 2, 2]);

  // Simulation execution state
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(sound.getMuted());

  // Generate Simulation Result whenever inputs or mode change
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
          // Fallback to valid default if error
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

  // Stop playback
  const stopPlayback = useCallback(() => {
    setIsPlaying(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Reset simulation when mode or inputs change
  useEffect(() => {
    stopPlayback();
    setCurrentStepIndex(0);
  }, [mode, nodeCount, cyclePos, middleConvention, duplicateArray, stopPlayback]);

  // Step Forward
  const handleStepForward = useCallback(() => {
    setCurrentStepIndex((prev) => {
      if (prev < totalSteps - 1) {
        const next = prev + 1;
        // Sound cues
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
    stopPlayback();
    setCurrentStepIndex((prev) => Math.max(0, prev - 1));
  }, [stopPlayback]);

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

  // Handle Autoplay Interval
  useEffect(() => {
    if (isPlaying) {
      const intervalMs = Math.max(150, 1000 / speed);
      timerRef.current = setInterval(() => {
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
              } else {
                sound.playStep();
              }
            }
            return next;
          } else {
            stopPlayback();
            return prev;
          }
        });
      }, intervalMs);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isPlaying, speed, totalSteps, steps, stopPlayback]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        handlePlayPause();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleStepForward();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handleStepBackward();
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        handleReset();
      } else if (e.code === 'KeyM') {
        e.preventDefault();
        const newMuted = sound.toggleMute();
        setIsMuted(newMuted);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePlayPause, handleStepForward, handleStepBackward, handleReset]);

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto px-4 py-6">
      {/* Configuration & Mode Header */}
      <ArenaConfigPanel
        mode={mode}
        onModeChange={setMode}
        nodeCount={nodeCount}
        onNodeCountChange={setNodeCount}
        cyclePos={cyclePos}
        onCyclePosChange={setCyclePos}
        middleConvention={middleConvention}
        onMiddleConventionChange={setMiddleConvention}
        duplicateArray={duplicateArray}
        onDuplicateArrayChange={setDuplicateArray}
      />

      {/* Main Simulation Viewport (Canvas + Controls + Telemetry) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 Columns: Graph Canvas & Controls */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {/* Canvas */}
          <div className="w-full aspect-[16/9] min-h-[380px] max-h-[520px]">
            <GraphCanvas
              mode={mode}
              nodes={simulationResult.nodes}
              cyclePos={mode === 'cycle-detection' || mode === 'cycle-entry' ? cyclePos : null}
              currentStep={currentStep}
              numsArray={mode === 'find-duplicate' ? duplicateArray : undefined}
            />
          </div>

          {/* Controls Bar */}
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
            onSpeedChange={setSpeed}
            onMuteToggle={() => setIsMuted(sound.toggleMute())}
            onStepSeek={(stepIdx) => {
              stopPlayback();
              setCurrentStepIndex(stepIdx);
            }}
          />

          {/* Telemetry & Operation Explanation */}
          <StepInspector currentStep={currentStep} totalSteps={totalSteps} />
        </div>

        {/* Right 4 Columns: Code Inspector & Stats */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="h-[460px]">
            <CodeInspector mode={mode} currentStep={currentStep} />
          </div>

          {/* Quick Simulation Statistics Panel (Styled as Laboratory Bench Data) */}
          <div className="rpg-box-dark p-4 border-4 border-gb-ink shadow-pixel font-pixel text-[9px] text-gb-cream">
            <div className="text-gb-pale font-bold mb-2.5 border-b-2 border-gb-ink pb-1 flex justify-between items-center">
              <span>RESEARCH DATA</span>
              <span className="text-hare text-[8px]">ACTIVE STATS</span>
            </div>
            <div className="space-y-2 font-vt323 text-xl">
              <div className="flex justify-between items-center">
                <span className="text-gb-pale">TOTAL TURNS:</span>
                <span className="text-white font-bold">{totalSteps}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gb-pale">POINTER HOPS:</span>
                <span className="text-tortoise font-bold">
                  {simulationResult.stats.totalPointerMoves}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gb-pale">AUXILIARY SPACE:</span>
                <span className="text-retro-success font-bold">O(1) CONSTANT</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gb-pale">TIME COMPLEXITY:</span>
                <span className="text-retro-warning font-bold">O(N) LINEAR</span>
              </div>
              {simulationResult.stats.cycleLength !== undefined && (
                <div className="flex justify-between items-center border-t border-gb-ink pt-1 text-hare">
                  <span>CYCLE LENGTH (&lambda;):</span>
                  <span className="font-bold">
                    {simulationResult.stats.cycleLength} TILES
                  </span>
                </div>
              )}
              {simulationResult.stats.nonCycleLength !== undefined && (
                <div className="flex justify-between items-center text-gb-cream">
                  <span>PREFIX DIST (&mu;):</span>
                  <span className="font-bold">
                    {simulationResult.stats.nonCycleLength} TILES
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
