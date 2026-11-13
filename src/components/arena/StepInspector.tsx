import React from 'react';
import { SimulationStep } from '../../types/simulation';

interface StepInspectorProps {
  currentStep: SimulationStep | null;
  totalSteps?: number;
}

export const StepInspector: React.FC<StepInspectorProps> = ({ currentStep, totalSteps = 0 }) => {
  if (!currentStep) {
    return (
      <div className="rpg-box p-4 font-vt323 text-xl text-gb-ink">
        LAB MONITOR: NO ACTIVE EXPERIMENT. INITIALIZE POINTERS.
      </div>
    );
  }

  const { title, explanation, detailedReasoning, phase, status, iteration, mathNotes } = currentStep;

  // Retro Status Tag Colors
  const getStatusBadge = () => {
    switch (status) {
      case 'COLLISION':
        return 'bg-retro-error text-white';
      case 'FOUND_CYCLE':
      case 'FOUND_ENTRY':
      case 'FOUND_MIDDLE':
      case 'FOUND_DUPLICATE':
        return 'bg-retro-success text-white';
      case 'NO_CYCLE':
        return 'bg-hare text-white';
      default:
        return 'bg-gb-olive text-gb-cream';
    }
  };

  return (
    <div className="rpg-box p-5 select-none relative shadow-pixel flex flex-col justify-between">
      {/* Top Dialogue Header */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-gb-ink pb-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="font-pixel text-[10px] text-hare font-bold">
              PROF. FLOYD'S LOG
            </span>
            <span className="px-1.5 py-0.5 font-pixel text-[8px] bg-gb-forest text-gb-pale border border-gb-ink">
              TURN #{iteration} {totalSteps > 0 ? `/ ${totalSteps - 1}` : ''}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 font-pixel text-[8px] bg-gb-olive text-gb-cream border border-gb-ink">
              {phase.replace('_', ' ')}
            </span>
            <span className={`px-2 py-0.5 font-pixel text-[8px] border border-gb-ink ${getStatusBadge()}`}>
              {status.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Action Title */}
        <h4 className="font-pixel text-xs text-gb-ink mb-1.5 leading-snug">
          {title}
        </h4>

        {/* Narrative Dialogue Text */}
        <p className="font-vt323 text-2xl text-gb-ink leading-tight mb-3">
          &ldquo;{explanation}&rdquo;
        </p>

        {/* Technical Algorithm Reasoning Box */}
        {detailedReasoning && (
          <div className="p-2.5 bg-gb-surface border-2 border-gb-ink text-gb-ink font-vt323 text-lg leading-snug mb-3">
            <span className="font-pixel text-[9px] text-gb-forest font-bold block mb-0.5">
              DATA LOGIC:
            </span>
            {detailedReasoning}
          </div>
        )}

        {/* Mathematical Proof Card (when available) */}
        {mathNotes && (mathNotes.equation || mathNotes.mu !== undefined) && (
          <div className="p-2.5 bg-gb-pale/40 border-2 border-gb-ink font-vt323 text-lg text-gb-ink">
            <div className="font-pixel text-[8px] text-gb-forest font-bold mb-1">
              FLOYD PROOF METRICS:
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-gb-ink">
              {mathNotes.mu !== undefined && (
                <span>• Prefix μ: <strong>{mathNotes.mu}</strong></span>
              )}
              {mathNotes.lambda !== undefined && (
                <span>• Cycle λ: <strong>{mathNotes.lambda}</strong></span>
              )}
              {mathNotes.k !== undefined && (
                <span>• Offset k: <strong>{mathNotes.k}</strong></span>
              )}
              {mathNotes.equation && (
                <span className="w-full font-bold text-retro-error">
                  &there4; {mathNotes.equation}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Classic Dialogue Box Advance Arrow at Bottom-Right */}
      <div className="flex justify-end pt-2">
        <span className="dialogue-arrow font-pixel text-xs">▼</span>
      </div>
    </div>
  );
};
