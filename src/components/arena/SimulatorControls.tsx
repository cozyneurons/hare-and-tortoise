import React, { useState } from 'react';
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

const SPEED_OPTIONS = [0.5, 1, 1.5, 2, 3];

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
  const [showKeyGuide, setShowKeyGuide] = useState(false);

  const percent = totalSteps > 0 ? Math.round((currentStepIndex / Math.max(1, totalSteps - 1)) * 100) : 0;

  return (
    <div className="rpg-box-dark p-4 border-4 border-gb-ink shadow-pixel text-gb-cream select-none">
      {/* Simulation Progress (Styled as Pokémon HP/XP Progress Gauge) */}
      <div className="mb-3">
        <div className="flex justify-between items-center text-sm font-vt323 text-gb-pale mb-1.5">
          <span className="font-pixel text-xs sm:text-[13px] text-gb-cream font-bold">
            TURN: {Math.max(0, currentStepIndex)} / {Math.max(0, totalSteps - 1)}
          </span>
          <span className="font-pixel text-xs sm:text-[13px] text-hare font-bold">
            PROGRESS: {percent}%
          </span>
        </div>

        {/* Stepped HP/XP Style Gauge */}
        <div className="relative w-full h-4 bg-gb-forest border-2 border-gb-ink overflow-hidden p-0.5">
          <div
            className="h-full bg-gb-pale border-r-2 border-gb-ink transition-all duration-150"
            style={{ width: `${percent}%` }}
          />
        </div>

        {/* Range Scrubber */}
        <input
          type="range"
          min={0}
          max={Math.max(0, totalSteps - 1)}
          value={currentStepIndex}
          onChange={(e) => {
            sound.playClick();
            onStepSeek(Number(e.target.value));
          }}
          className="w-full mt-1 accent-hare cursor-pointer"
        />
      </div>

      {/* Control Buttons Row (Classic Handheld Pad Layout) */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        {/* Playback Buttons */}
        <div className="flex items-center gap-2">
          {/* Reset (SELECT) */}
          <button
            onClick={() => {
              sound.playReset();
              onReset();
            }}
            title="Reset Simulation (R)"
            className="pixel-btn pixel-btn-secondary"
          >
            <span>RESET</span>
          </button>

          {/* Step Back (B BUTTON) */}
          <button
            onClick={() => {
              sound.playClick();
              onStepBackward();
            }}
            disabled={!canStepBackward}
            title="Step Back (Left Arrow)"
            className="pixel-btn pixel-btn-secondary disabled:opacity-40"
          >
            <span>◀ BACK</span>
          </button>

          {/* Primary Action [A: START / PAUSE] */}
          <button
            onClick={() => {
              sound.playClick();
              onPlayPause();
            }}
            title="Play / Pause (Space)"
            className={`pixel-btn ${isPlaying ? 'pixel-btn-danger' : 'bg-gb-pale hover:bg-gb-leaf text-gb-ink'}`}
          >
            <span>{isPlaying ? '⏸ PAUSE' : '▶ START'}</span>
          </button>

          {/* Step Forward (A BUTTON) */}
          <button
            onClick={() => {
              sound.playStep();
              onStepForward();
            }}
            disabled={!canStepForward}
            title="Step Forward (Right Arrow)"
            className="pixel-btn bg-gb-leaf text-white disabled:opacity-40"
          >
            <span>STEP ▶</span>
          </button>
        </div>

        {/* Speed Gear Controls */}
        <div className="flex items-center gap-1 bg-gb-forest p-1 border-2 border-gb-ink">
          <span className="font-pixel text-xs text-gb-pale px-1.5 font-bold">SPD:</span>
          {SPEED_OPTIONS.map((spd) => (
            <button
              key={`spd-${spd}`}
              onClick={() => {
                sound.playClick();
                onSpeedChange(spd);
              }}
              className={`px-2 py-1 font-pixel text-xs font-bold transition-all ${
                speed === spd
                  ? 'bg-gb-cream text-gb-ink border border-gb-ink'
                  : 'text-gb-pale hover:text-white'
              }`}
            >
              {spd}x
            </button>
          ))}
        </div>

        {/* Sound & Help */}
        <div className="flex items-center gap-2">
          {/* Sound Mute */}
          <button
            onClick={onMuteToggle}
            className={`px-2.5 py-1.5 font-pixel text-xs font-bold border-2 border-gb-ink ${
              isMuted ? 'bg-gb-forest text-gb-pale' : 'bg-gb-pale text-gb-ink'
            }`}
          >
            {isMuted ? '🔇' : '🔊'}
          </button>

          {/* Keyboard Guide Toggle */}
          <button
            onClick={() => setShowKeyGuide(!showKeyGuide)}
            className="px-2.5 py-1.5 font-pixel text-xs font-bold bg-gb-olive border-2 border-gb-ink text-gb-cream hover:bg-gb-leaf"
          >
            KEYS?
          </button>
        </div>
      </div>

      {/* Retro Keyboard Guide Popup */}
      {showKeyGuide && (
        <div className="rpg-box p-3.5 mt-3 border-2 border-gb-ink text-gb-ink font-vt323 text-xl leading-tight">
          <div className="font-pixel text-xs text-hare mb-1.5 border-b border-gb-ink pb-1 font-bold">
            HANDHELD CONTROLLER SHORTCUTS:
          </div>
          <div className="grid grid-cols-2 gap-x-4">
            <div>[SPACE / A] : PLAY / PAUSE</div>
            <div>[RIGHT / B] : STEP FORWARD</div>
            <div>[LEFT] : STEP BACKWARD</div>
            <div>[R / SELECT] : RESET LAB</div>
            <div>[M] : TOGGLE 8-BIT SOUND</div>
          </div>
        </div>
      )}
    </div>
  );
};
