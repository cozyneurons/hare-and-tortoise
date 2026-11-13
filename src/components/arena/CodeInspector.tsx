import React, { useState } from 'react';
import { AlgorithmMode, SimulationStep } from '../../types/simulation';
import { CODE_TEMPLATES } from '../../data/codeTemplates';
import { Code, Eye } from 'lucide-react';

interface CodeInspectorProps {
  mode: AlgorithmMode;
  currentStep: SimulationStep | null;
}

type SupportedLanguage = 'python' | 'cpp' | 'java';

export const CodeInspector: React.FC<CodeInspectorProps> = ({ mode, currentStep }) => {
  const [language, setLanguage] = useState<SupportedLanguage>('python');

  const codeString = CODE_TEMPLATES[mode]?.[language] || '';
  const lines = codeString.split('\n');

  // Highlight line index (1-based from step, map to 0-based for line array)
  const activeLineNumber = currentStep?.codeLine?.[language] || 0;

  return (
    <div className="flex flex-col h-full bg-arcade-900 border border-arcade-800 rounded-xl overflow-hidden shadow-xl">
      {/* Header with language selector tabs */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-arcade-950 border-b border-arcade-800">
        <div className="flex items-center gap-2">
          <Code className="w-4 h-4 text-lime-accent" />
          <span className="text-xs font-mono font-semibold tracking-wider text-slate-300 uppercase">
            Code Inspector
          </span>
        </div>

        {/* Language Tabs */}
        <div className="flex items-center gap-1 bg-arcade-900 p-0.5 rounded-lg border border-arcade-800">
          {(['python', 'cpp', 'java'] as SupportedLanguage[]).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition-all ${
                language === lang
                  ? 'bg-arcade-800 text-lime-accent border border-lime-accent/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {lang === 'python' ? 'Python' : lang === 'cpp' ? 'C++' : 'Java'}
            </button>
          ))}
        </div>
      </div>

      {/* Code Viewer */}
      <div className="flex-1 overflow-y-auto p-3 font-mono text-[12px] leading-relaxed bg-arcade-950/60 select-text">
        {lines.map((line, idx) => {
          const lineNumber = idx + 1;
          const isActive = lineNumber === activeLineNumber;

          return (
            <div
              key={`line-${idx}`}
              className={`flex items-start rounded transition-colors duration-150 py-0.5 px-2 ${
                isActive
                  ? 'bg-lime-accent/15 border-l-2 border-lime-accent text-lime-accent font-semibold'
                  : 'text-slate-300 hover:bg-white/[0.02]'
              }`}
            >
              {/* Line number gutter */}
              <span
                className={`w-7 shrink-0 text-right pr-3 select-none text-[11px] ${
                  isActive ? 'text-lime-accent font-bold' : 'text-slate-600'
                }`}
              >
                {lineNumber}
              </span>

              {/* Code line content */}
              <span className="whitespace-pre overflow-x-auto">{line}</span>
            </div>
          );
        })}
      </div>

      {/* Live Variable Watch Panel */}
      <div className="border-t border-arcade-800 bg-arcade-900/90 p-3">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-2">
          <Eye className="w-3.5 h-3.5 text-tortoise-cyan" />
          <span className="font-semibold text-slate-300">LIVE VARIABLE WATCH</span>
        </div>

        {currentStep && currentStep.variables && Object.keys(currentStep.variables).length > 0 ? (
          <div className="grid grid-cols-2 gap-2 max-h-28 overflow-y-auto font-mono text-xs">
            {Object.entries(currentStep.variables).map(([key, val]) => (
              <div
                key={`var-${key}`}
                className="flex items-center justify-between px-2.5 py-1 rounded bg-arcade-950 border border-arcade-800"
              >
                <span className="text-slate-400 truncate mr-2">{key}:</span>
                <span className="text-lime-accent font-semibold truncate">
                  {val === null ? 'null' : String(val)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-xs text-slate-500 italic font-mono py-1">
            Simulation idle. Start to inspect variables.
          </div>
        )}
      </div>
    </div>
  );
};
