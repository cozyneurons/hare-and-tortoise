import React from 'react';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Keyboard
} from 'lucide-react';
import { sound } from '../../utils/audio';

interface SimulatorControlsProps {
  isPlaying: boolean;
  canStepForward: boolean;
  canStepBackward: boolean;
  currentStepIndex: number;
  totalSteps: number;
  speed: number;
  isMuted: boolean;
  onPlayPause: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
  onMuteToggle: () => void;
  onStepSeek: (stepIndex: number) => void;
}

const SPEED_OPTIONS = [0.25, 0.5, 1, 1.5, 2, 3];

export const SimulatorControls: React.FC<SimulatorControlsProps> = ({
  isPlaying,
  canStepForward,
  canStepBackward,
  currentStepIndex,
  totalSteps,
  speed,
  isMuted,
  onPlayPause,
  onStepForward,
  onStepBackward,
  onReset,
  onSpeedChange,
  onMuteToggle,
  onStepSeek,
}) => {
  const [showShortcuts, setShowShortcuts] = React.useState(false);

  return (
    <div className="flex flex-col gap-3 p-4 bg-arcade-900 border border-arcade-800 rounded-xl shadow-xl">
      {/* Scrubber / Progress Bar */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-mono text-slate-400 min-w-[50px]">
          STEP {Math.max(0, currentStepIndex)} / {Math.max(0, totalSteps - 1)}
        </span>
        <div className="relative flex-1 flex items-center">
          <input
            type="range"
            min={0}
            max={Math.max(0, totalSteps - 1)}
            value={currentStepIndex}
            onChange={(e) => {
              sound.playClick();
              onStepSeek(Number(e.target.value));
            }}
            className="w-full h-1.5 bg-arcade-800 rounded-lg appearance-none cursor-pointer accent-lime-accent"
          />
        </div>
        <span className="text-xs font-mono font-medium text-lime-accent">
          {totalSteps > 0 ? Math.round(((currentStepIndex) / Math.max(1, totalSteps - 1)) * 100) : 0}%
        </span>
      </div>

      {/* Control Buttons Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          {/* Reset */}
          <button
            onClick={() => {
              sound.playReset();
              onReset();
            }}
            title="Reset Simulation (R)"
            className="p-2.5 rounded-lg bg-arcade-850 hover:bg-arcade-800 border border-arcade-800 text-slate-300 hover:text-white transition-all duration-150 active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Step Backward */}
          <button
            onClick={() => {
              sound.playClick();
              onStepBackward();
            }}
            disabled={!canStepBackward}
            title="Step Backward (Left Arrow)"
            className="p-2.5 rounded-lg bg-arcade-850 hover:bg-arcade-800 border border-arcade-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 active:scale-95"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          {/* Play / Pause Primary CTA */}
          <button
            onClick={() => {
              sound.playClick();
              onPlayPause();
            }}
            title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 active:scale-95 shadow-lg ${
              isPlaying
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-glow-hare'
                : 'bg-lime-accent hover:bg-lime-400 text-slate-950 shadow-glow-lime'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>PAUSE</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>START</span>
              </>
            )}
          </button>

          {/* Step Forward */}
          <button
            onClick={() => {
              sound.playStep();
              onStepForward();
            }}
            disabled={!canStepForward}
            title="Step Forward (Right Arrow)"
            className="p-2.5 rounded-lg bg-arcade-850 hover:bg-arcade-800 border border-arcade-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 active:scale-95"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Speed Controls */}
        <div className="flex items-center gap-1.5 bg-arcade-950 p-1 rounded-lg border border-arcade-800">
          <span className="text-[11px] font-mono text-slate-500 px-1.5">SPEED:</span>
          {SPEED_OPTIONS.map((spd) => (
            <button
              key={`spd-${spd}`}
              onClick={() => {
                sound.playClick();
                onSpeedChange(spd);
              }}
              className={`px-2 py-1 rounded text-xs font-mono font-medium transition-all ${
                speed === spd
                  ? 'bg-arcade-800 text-lime-accent border border-lime-accent/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-arcade-900'
              }`}
            >
              {spd}x
            </button>
          ))}
        </div>

        {/* Secondary: Audio and Shortcuts */}
        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={onMuteToggle}
            title={isMuted ? 'Unmute Sound FX (M)' : 'Mute Sound FX (M)'}
            className={`p-2.5 rounded-lg border transition-all ${
              isMuted
                ? 'bg-arcade-850 border-arcade-800 text-slate-500'
                : 'bg-arcade-850 border-cyan-500/40 text-cyan-400 shadow-glow-tortoise'
            }`}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Keyboard Shortcuts Guide */}
          <div className="relative">
            <button
              onClick={() => setShowShortcuts(!showShortcuts)}
              title="Keyboard Shortcuts"
              className={`p-2.5 rounded-lg border transition-all ${
                showShortcuts
                  ? 'bg-arcade-800 border-lime-accent text-lime-accent'
                  : 'bg-arcade-850 border-arcade-800 text-slate-400 hover:text-white'
              }`}
            >
              <Keyboard className="w-4 h-4" />
            </button>

            {showShortcuts && (
              <div className="absolute bottom-12 right-0 w-64 p-3 bg-arcade-900 border border-arcade-750 rounded-xl shadow-2xl z-30 text-xs">
                <div className="font-semibold text-slate-200 mb-2 border-b border-arcade-800 pb-1 flex justify-between items-center">
                  <span>KEYBOARD COMMANDS</span>
                  <span className="text-[10px] text-lime-accent font-mono">ARCADE</span>
                </div>
                <div className="space-y-1.5 text-slate-300 font-mono text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Play / Pause:</span>
                    <kbd className="px-1.5 py-0.5 bg-arcade-800 rounded border border-arcade-700">Space</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Step Forward:</span>
                    <kbd className="px-1.5 py-0.5 bg-arcade-800 rounded border border-arcade-700">&rarr;</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Step Backward:</span>
                    <kbd className="px-1.5 py-0.5 bg-arcade-800 rounded border border-arcade-700">&larr;</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Reset:</span>
                    <kbd className="px-1.5 py-0.5 bg-arcade-800 rounded border border-arcade-700">R</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Toggle Audio:</span>
                    <kbd className="px-1.5 py-0.5 bg-arcade-800 rounded border border-arcade-700">M</kbd>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
