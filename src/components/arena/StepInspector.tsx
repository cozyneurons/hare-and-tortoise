import React from 'react';
import { SimulationStep } from '../../types/simulation';
import { Activity, Compass, Cpu, Zap } from 'lucide-react';

interface StepInspectorProps {
  currentStep: SimulationStep | null;
  totalSteps: number;
}

export const StepInspector: React.FC<StepInspectorProps> = ({ currentStep, totalSteps }) => {
  if (!currentStep) {
    return (
      <div className="p-4 bg-arcade-900 border border-arcade-800 rounded-xl text-slate-500 font-mono text-xs flex items-center justify-center min-h-[140px]">
        No step active. Initialize simulation.
      </div>
    );
  }

  const { title, explanation, detailedReasoning, phase, status, iteration, mathNotes } = currentStep;

  // Status Badge Color
  const getStatusBadge = () => {
    switch (status) {
      case 'COLLISION':
        return 'bg-pink-950/80 text-pink-300 border-pink-500 shadow-glow-collision';
      case 'FOUND_CYCLE':
      case 'FOUND_ENTRY':
      case 'FOUND_MIDDLE':
      case 'FOUND_DUPLICATE':
        return 'bg-emerald-950/80 text-lime-accent border-lime-accent shadow-glow-lime';
      case 'NO_CYCLE':
        return 'bg-amber-950/80 text-amber-300 border-amber-500';
      default:
        return 'bg-arcade-800 text-cyan-300 border-cyan-500/40';
    }
  };

  return (
    <div className="flex flex-col gap-3 p-4 bg-arcade-900 border border-arcade-800 rounded-xl shadow-xl">
      {/* Top Telemetry Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-arcade-800 pb-2">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-lime-accent" />
          <span className="text-xs font-mono font-bold tracking-wider text-slate-200">
            SIMULATION TELEMETRY
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-arcade-800 text-slate-300 border border-arcade-700">
            ITERATION: {iteration} / {Math.max(1, totalSteps - 1)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Phase Badge */}
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold tracking-wider bg-arcade-850 text-slate-300 border border-arcade-700 uppercase">
            {phase.replace('_', ' ')}
          </span>

          {/* Status Badge */}
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${getStatusBadge()}`}>
            {status.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Main Operation Title & Explanation */}
      <div>
        <h4 className="text-base font-bold text-white mb-1 flex items-center gap-2">
          <Compass className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{title}</span>
        </h4>
        <p className="text-sm text-slate-300 leading-relaxed">
          {explanation}
        </p>
      </div>

      {/* Detailed Technical Reasoning */}
      {detailedReasoning && (
        <div className="p-2.5 rounded-lg bg-arcade-950/80 border border-arcade-800 text-xs text-slate-400 font-mono flex items-start gap-2">
          <Cpu className="w-3.5 h-3.5 text-lime-accent mt-0.5 shrink-0" />
          <div className="leading-relaxed">
            <span className="text-slate-200 font-semibold">ALGORITHM LOGIC: </span>
            {detailedReasoning}
          </div>
        </div>
      )}

      {/* Mathematical Proof Card (when available) */}
      {mathNotes && (mathNotes.equation || mathNotes.mu !== undefined) && (
        <div className="p-2.5 rounded-lg bg-arcade-950/90 border border-pink-900/40 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-pink-400 font-semibold mb-1">
            <Zap className="w-3.5 h-3.5 text-pink-400" />
            <span>MATHEMATICAL RELATIONSHIP</span>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-slate-300 text-[11px]">
            {mathNotes.mu !== undefined && (
              <span>Prefix μ: <strong className="text-white">{mathNotes.mu}</strong></span>
            )}
            {mathNotes.lambda !== undefined && (
              <span>Cycle λ: <strong className="text-white">{mathNotes.lambda}</strong></span>
            )}
            {mathNotes.k !== undefined && (
              <span>Offset k: <strong className="text-white">{mathNotes.k}</strong></span>
            )}
            {mathNotes.equation && (
              <span className="text-pink-300 font-bold block w-full mt-1">
                &there4; {mathNotes.equation}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
