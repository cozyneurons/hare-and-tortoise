import React, { useState, useEffect, useRef } from 'react';
import { AlgorithmMode, SimulationStep } from '../../types/simulation';
import { CODE_TEMPLATES } from '../../data/codeTemplates';
import { Code, Eye, Play, Terminal } from 'lucide-react';

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

  // Highlight line index (1-based from step, map to 0-based for line array)
  const activeLineNumber = currentStep?.codeLine?.[language] || 0;
  const activeLineText = activeLineNumber > 0 && activeLineNumber <= lines.length 
    ? lines[activeLineNumber - 1].trim() 
    : '';

  // Auto-scroll active line into view when step or language changes
  useEffect(() => {
    if (activeLineRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [activeLineNumber, language]);

  // Syntax highlighting helper
  const renderSyntaxLine = (line: string, isActive: boolean) => {
    // If comment line
    if (line.trim().startsWith('#') || line.trim().startsWith('//')) {
      return <span className={isActive ? 'text-lime-200' : 'text-slate-500 italic'}>{line}</span>;
    }

    // Keyword tokens
    const tokens = line.split(/(\b(?:def|bool|int|void|public|while|if|else|return|break|do|True|False|true|false|null|nullptr|Optional|ListNode|vector)\b)/g);

    return (
      <span>
        {tokens.map((token, i) => {
          if (
            ['def', 'bool', 'int', 'void', 'public', 'Optional', 'ListNode', 'vector'].includes(token)
          ) {
            return (
              <span key={i} className={isActive ? 'text-cyan-200 font-bold' : 'text-cyan-400 font-medium'}>
                {token}
              </span>
            );
          }
          if (['while', 'if', 'else', 'return', 'break', 'do'].includes(token)) {
            return (
              <span key={i} className={isActive ? 'text-pink-200 font-bold' : 'text-pink-400 font-medium'}>
                {token}
              </span>
            );
          }
          if (['True', 'False', 'true', 'false', 'null', 'nullptr'].includes(token)) {
            return (
              <span key={i} className={isActive ? 'text-amber-200 font-bold' : 'text-amber-400 font-medium'}>
                {token}
              </span>
            );
          }
          return <span key={i}>{token}</span>;
        })}
      </span>
    );
  };

  return (
    <div className="flex flex-col h-full bg-arcade-900 border border-arcade-800 rounded-xl overflow-hidden shadow-xl">
      {/* Header with language selector tabs */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-arcade-950 border-b border-arcade-800 shrink-0">
        <div className="flex items-center gap-2">
          <Code className="w-4 h-4 text-lime-accent" />
          <span className="text-xs font-mono font-bold tracking-wider text-slate-300 uppercase">
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
      <div className="flex-1 overflow-y-auto p-3 font-mono text-[12px] leading-relaxed bg-arcade-950/70 select-text">
        {lines.map((line, idx) => {
          const lineNumber = idx + 1;
          const isActive = lineNumber === activeLineNumber;

          return (
            <div
              key={`line-${idx}`}
              ref={isActive ? activeLineRef : null}
              className={`group flex items-center rounded transition-all duration-150 py-1 px-2 my-0.5 ${
                isActive
                  ? 'bg-lime-accent/20 border-l-4 border-lime-accent text-white font-bold shadow-[inset_0_0_15px_rgba(16,245,122,0.15)] ring-1 ring-lime-accent/40'
                  : 'text-slate-300 hover:bg-white/[0.02]'
              }`}
            >
              {/* Line number gutter with debugger execution glyph */}
              <div
                className={`w-9 shrink-0 flex items-center justify-end pr-3 select-none text-[11px] font-mono ${
                  isActive ? 'text-lime-accent font-black' : 'text-slate-600'
                }`}
              >
                {isActive ? (
                  <span className="inline-flex items-center gap-1 text-lime-accent animate-pulse font-extrabold mr-0.5">
                    <Play className="w-2.5 h-2.5 fill-current" />
                    <span>{lineNumber}</span>
                  </span>
                ) : (
                  <span>{lineNumber}</span>
                )}
              </div>

              {/* Code line content */}
              <div className="whitespace-pre overflow-x-auto flex-1 font-mono">
                {renderSyntaxLine(line, isActive)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Line Execution Bar */}
      {activeLineNumber > 0 && activeLineText && (
        <div className="px-3 py-1.5 bg-arcade-950 border-t border-b border-arcade-800 flex items-center gap-2 font-mono text-xs shrink-0">
          <Terminal className="w-3.5 h-3.5 text-lime-accent shrink-0 animate-pulse" />
          <span className="text-[10px] text-lime-accent font-bold uppercase tracking-wider shrink-0">
            L{activeLineNumber}:
          </span>
          <span className="text-white font-semibold truncate text-[11px] bg-arcade-900 px-2 py-0.5 rounded border border-arcade-800 flex-1">
            {activeLineText}
          </span>
        </div>
      )}

      {/* Live Variable Watch Panel */}
      <div className="border-t border-arcade-800 bg-arcade-900/95 p-3 shrink-0">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
          <div className="flex items-center gap-2">
            <Eye className="w-3.5 h-3.5 text-tortoise-cyan" />
            <span className="font-semibold text-slate-300">LIVE VARIABLE WATCH</span>
          </div>
          {currentStep && (
            <span className="text-[10px] text-slate-500 font-mono">
              STEP #{currentStep.stepIndex}
            </span>
          )}
        </div>

        {currentStep && currentStep.variables && Object.keys(currentStep.variables).length > 0 ? (
          <div className="grid grid-cols-2 gap-2 max-h-24 overflow-y-auto font-mono text-xs">
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
