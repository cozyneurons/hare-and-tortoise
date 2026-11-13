import React from 'react';
import { NavTab } from './Navbar';
import { Keyboard } from 'lucide-react';

interface FooterProps {
  onTabChange: (tab: NavTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onTabChange }) => {
  return (
    <footer className="w-full bg-arcade-950 border-t border-arcade-800/80 mt-16 font-mono text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-wider text-white text-base">
                CHASE<span className="text-lime-accent">//</span>LOOP
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-arcade-900 border border-arcade-800 text-slate-400">
                v2.0 PRODUCTION
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm font-sans">
              An interactive computer science laboratory visualizing Floyd's slow and fast pointer algorithms, cycle detection, mathematical derivations, and functional graphs.
            </p>
            <div className="flex items-center gap-2 text-slate-500 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-lime-accent" />
              <span>Two pointers. Different speeds. One inevitable meeting.</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <div className="font-bold text-white text-xs uppercase tracking-wider mb-2">
              SECTIONS
            </div>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => onTabChange('arena')}
                  className="hover:text-lime-accent transition-colors"
                >
                  &rarr; Algorithm Arena
                </button>
              </li>
              <li>
                <button
                  onClick={() => onTabChange('learn')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  &rarr; Mathematical Proofs
                </button>
              </li>
              <li>
                <button
                  onClick={() => onTabChange('challenges')}
                  className="hover:text-amber-400 transition-colors"
                >
                  &rarr; Arcade Challenges
                </button>
              </li>
              <li>
                <button
                  onClick={() => onTabChange('complexity')}
                  className="hover:text-lime-accent transition-colors"
                >
                  &rarr; Complexity &amp; Memory Lab
                </button>
              </li>
            </ul>
          </div>

          {/* Hotkeys & Specs */}
          <div className="space-y-2">
            <div className="font-bold text-white text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Keyboard className="w-3.5 h-3.5 text-cyan-400" />
              <span>KEYBOARD CONTROL</span>
            </div>
            <div className="text-[11px] space-y-1 text-slate-400">
              <div><kbd className="px-1.5 py-0.5 bg-arcade-900 rounded border border-arcade-800 text-slate-300">Space</kbd> : Play / Pause</div>
              <div><kbd className="px-1.5 py-0.5 bg-arcade-900 rounded border border-arcade-800 text-slate-300">&rarr;</kbd> : Step Forward</div>
              <div><kbd className="px-1.5 py-0.5 bg-arcade-900 rounded border border-arcade-800 text-slate-300">&larr;</kbd> : Step Backward</div>
              <div><kbd className="px-1.5 py-0.5 bg-arcade-900 rounded border border-arcade-800 text-slate-300">R</kbd> : Reset Simulation</div>
              <div><kbd className="px-1.5 py-0.5 bg-arcade-900 rounded border border-arcade-800 text-slate-300">M</kbd> : Toggle Sound FX</div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-arcade-900 pt-6 flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            &copy; 2026 CHASE//LOOP. High-Performance Algorithm Visualizer.
          </div>
          <div className="flex items-center gap-3">
            <span className="text-lime-accent">Time: O(N)</span>
            <span>&bull;</span>
            <span className="text-cyan-400">Space: O(1) Auxiliary</span>
            <span>&bull;</span>
            <span className="text-amber-400">100% Deterministic Engine</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
