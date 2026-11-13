import React from 'react';
import { NavTab } from './Navbar';
import { PixelHareSprite, PixelTortoiseSprite } from '../pixel/PixelSprites';

interface FooterProps {
  onTabChange: (tab: NavTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onTabChange }) => {
  return (
    <footer className="w-full bg-gb-forest border-t-4 border-gb-ink mt-16 font-pixel text-xs text-gb-cream select-none">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {/* Cartridge Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-base font-pixel text-gb-cream font-bold">
                CHASE<span className="text-hare">::</span>LOOP
              </span>
              <span className="px-2 py-0.5 bg-gb-leaf border border-gb-ink text-xs text-white font-bold">
                GBC CARTRIDGE v2.0
              </span>
            </div>
            <p className="font-vt323 text-xl text-gb-pale leading-normal max-w-sm">
              An interactive 8-bit computer science laboratory visualizing Floyd's cycle detection, two-pointer relative velocity, and functional graphs.
            </p>
            <div className="flex items-center gap-2 text-gb-pale text-xs font-bold">
              <PixelTortoiseSprite size={18} />
              <PixelHareSprite size={18} />
              <span>SAVED TO BATTERY BACKUP RAM</span>
            </div>
          </div>

          {/* Overworld Map Links */}
          <div className="space-y-2">
            <div className="font-bold text-gb-pale uppercase border-b-2 border-gb-ink pb-1 text-xs">
              MAP DESTINATIONS
            </div>
            <ul className="space-y-2 text-xs sm:text-[13px] text-gb-cream font-bold">
              <li>
                <button
                  onClick={() => onTabChange('arena')}
                  className="hover:text-gb-pale transition-colors flex items-center gap-1.5"
                >
                  <span className="text-hare">▶</span> PROF'S LABORATORY
                </button>
              </li>
              <li>
                <button
                  onClick={() => onTabChange('learn')}
                  className="hover:text-gb-pale transition-colors flex items-center gap-1.5"
                >
                  <span className="text-hare">▶</span> ALGORITHM POKÉDEX
                </button>
              </li>
              <li>
                <button
                  onClick={() => onTabChange('challenges')}
                  className="hover:text-gb-pale transition-colors flex items-center gap-1.5"
                >
                  <span className="text-hare">▶</span> TRAINER BATTLE ARENA
                </button>
              </li>
              <li>
                <button
                  onClick={() => onTabChange('complexity')}
                  className="hover:text-gb-pale transition-colors flex items-center gap-1.5"
                >
                  <span className="text-hare">▶</span> TRAINER CARD &amp; STATS
                </button>
              </li>
            </ul>
          </div>

          {/* Game Boy Button Keypad Guide */}
          <div className="space-y-2">
            <div className="font-bold text-gb-pale uppercase border-b-2 border-gb-ink pb-1 text-xs">
              GAME BOY CONTROLS
            </div>
            <div className="font-vt323 text-xl text-gb-cream space-y-1">
              <div><strong className="text-retro-warning">[SPACE / A]</strong> : Play / Pause</div>
              <div><strong className="text-gb-pale">[&rarr; / B]</strong> : Step Forward</div>
              <div><strong className="text-gb-pale">[&larr; / OPT]</strong> : Step Backward</div>
              <div><strong className="text-retro-error">[R / SELECT]</strong> : Reset Simulation</div>
              <div><strong className="text-tortoise">[M / START]</strong> : 8-Bit Audio Mute</div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t-2 border-gb-ink pt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-gb-pale font-pixel font-bold">
          <div>
            &copy; 1967-2026 CHASE::LOOP &bull; FLOYD HANDHELD LAB
          </div>
          <div className="flex items-center gap-3">
            <span>TIME: O(N)</span>
            <span>&bull;</span>
            <span>SPACE: O(1) CONSTANT</span>
            <span>&bull;</span>
            <span className="text-retro-success">BATTERY: OK</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
