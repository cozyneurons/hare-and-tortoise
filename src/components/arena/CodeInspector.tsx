import React, { useState, useEffect, useRef } from 'react';
import { AlgorithmMode, SimulationStep } from '../../types/simulation';
import { CODE_TEMPLATES } from '../../data/codeTemplates';
import { sound } from '../../utils/audio';

interface CodeInspectorProps {
  mode: AlgorithmMode;
  currentStep: SimulationStep | null;
}

type SupportedLanguage = 'python' | 'cpp' | 'java';

export const CodeInspector: React.FC<CodeInspectorProps> = ({ mode, currentStep }) => {
  const [language, setLanguage] = useState<SupportedLanguage>('python');
  const activeLineRef = useRef<HTMLDivElement | null>(null);

  const codeString = CODE_TEMPLATES[mode]?.[language] || '';
  const lines = codeString.split('\n');

  const activeLineNumber = currentStep?.codeLine?.[language] || 0;
  const activeLineText = activeLineNumber > 0 && activeLineNumber <= lines.length 
    ? lines[activeLineNumber - 1].trim() 
    : '';

  useEffect(() => {
    if (activeLineRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [activeLineNumber, language]);

  return (
    <div className="flex flex-col h-full rpg-box-dark border-4 border-gb-ink shadow-pixel text-gb-cream overflow-hidden select-none">
      {/* Header with Game Boy ROM Language Selectors */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-gb-olive border-b-2 border-gb-ink shrink-0">
        <div className="flex items-center gap-2 font-pixel text-xs text-gb-cream font-bold">
          <span>📟 ROM DISASSEMBLER</span>
        </div>

        {/* ROM Language Cartridges */}
        <div className="flex items-center gap-1.5">
          {(['python', 'cpp', 'java'] as SupportedLanguage[]).map((lang) => (
            <button
              key={lang}
              onClick={() => {
                sound.playClick();
                setLanguage(lang);
              }}
              className={`px-2.5 py-1 font-pixel text-[9.5px] font-bold border border-gb-ink transition-all ${
                language === lang
                  ? 'bg-gb-cream text-gb-ink shadow-pixel-sm'
                  : 'bg-gb-forest text-gb-pale hover:text-white'
              }`}
            >
              {lang === 'python' ? 'PY.ROM' : lang === 'cpp' ? 'CPP.ROM' : 'JAVA.ROM'}
            </button>
          ))}
        </div>
      </div>

      {/* Code Viewer Screen */}
      <div className="flex-1 overflow-y-auto p-2.5 font-vt323 text-lg leading-tight bg-gb-forest/90 select-text">
        {lines.map((line, idx) => {
          const lineNumber = idx + 1;
          const isActive = lineNumber === activeLineNumber;

          return (
            <div
              key={`line-${idx}`}
              ref={isActive ? activeLineRef : null}
              className={`flex items-center py-0.5 px-1.5 transition-all ${
                isActive
                  ? 'bg-gb-cream text-gb-ink font-bold border-l-4 border-hare shadow-pixel-sm'
                  : 'text-gb-cream hover:bg-gb-olive/40'
              }`}
            >
              {/* Gutter with Execution Cursor ▶ */}
              <div className="w-8 shrink-0 flex items-center justify-end pr-2 font-pixel text-[8px] select-none">
                {isActive ? (
                  <span className="text-hare animate-bounce-pixel">▶</span>
                ) : (
                  <span className="text-gb-pale opacity-60">{lineNumber}</span>
                )}
              </div>

              {/* Code line content */}
              <div className="whitespace-pre overflow-x-auto flex-1 font-vt323 text-xl">
                {line}
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Line Execution Bar */}
      {activeLineNumber > 0 && activeLineText && (
        <div className="px-2.5 py-1.5 bg-gb-olive border-t-2 border-b-2 border-gb-ink flex items-center gap-2 font-pixel text-[8px] shrink-0 text-gb-cream">
          <span className="text-hare font-bold shrink-0">
            ▶ L{activeLineNumber}:
          </span>
          <span className="truncate text-white bg-gb-forest px-1.5 py-0.5 border border-gb-ink flex-1 font-vt323 text-lg">
            {activeLineText}
          </span>
        </div>
      )}

      {/* Game Boy RAM Registers (Live Variable Watch) */}
      <div className="p-2.5 bg-gb-olive/80 border-t-2 border-gb-ink shrink-0">
        <div className="flex items-center justify-between font-pixel text-[8px] text-gb-pale mb-1.5">
          <span>BATTERY RAM REGISTERS:</span>
          {currentStep && <span>STEP #{currentStep.stepIndex}</span>}
        </div>

        {currentStep && currentStep.variables && Object.keys(currentStep.variables).length > 0 ? (
          <div className="grid grid-cols-2 gap-1.5 max-h-24 overflow-y-auto font-pixel text-[8px]">
            {Object.entries(currentStep.variables).map(([key, val]) => (
              <div
                key={`var-${key}`}
                className="flex items-center justify-between p-1 bg-gb-forest border border-gb-ink"
              >
                <span className="text-gb-pale truncate mr-1">{key}:</span>
                <span className="text-gb-cream font-bold truncate">
                  {val === null ? 'null' : String(val)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="font-vt323 text-lg text-gb-pale italic">
            REGISTERS IDLE. START LAB TO WATCH MEMORY.
          </div>
        )}
      </div>
    </div>
  );
};
