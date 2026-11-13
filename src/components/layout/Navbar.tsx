import React, { useState } from 'react';
import { PixelHareSprite, PixelTortoiseSprite } from '../pixel/PixelSprites';
import { sound } from '../../utils/audio';

export type NavTab = 'home' | 'arena' | 'learn' | 'challenges' | 'complexity';

interface NavbarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  isDmgMode: boolean;
  onToggleDmgMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  isMuted,
  onToggleMute,
  isDmgMode,
  onToggleDmgMode,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { id: NavTab; label: string; icon: string }[] = [
    { id: 'home', label: 'OVERWORLD', icon: '🏡' },
    { id: 'arena', label: 'LAB (ARENA)', icon: '🔬' },
    { id: 'learn', label: 'POKÉDEX', icon: '📖' },
    { id: 'challenges', label: 'BATTLE', icon: '⚔️' },
    { id: 'complexity', label: 'TRAINER', icon: '📇' },
  ];

  const handleNavClick = (tab: NavTab) => {
    sound.playClick();
    onTabChange(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-gb-forest border-b-4 border-gb-ink shadow-pixel select-none">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 h-16 flex items-center justify-between">
        {/* Logo / Brand */}
        <div
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          {/* Retro Pixel Emblem */}
          <div className="flex items-center -space-x-1 p-1 bg-gb-cream border-2 border-gb-ink shadow-pixel-sm">
            <PixelTortoiseSprite size={20} />
            <PixelHareSprite size={20} />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-pixel text-xs sm:text-sm text-gb-cream tracking-tight group-hover:text-gb-pale transition-colors">
                CHASE<span className="text-hare">::</span>LOOP
              </span>
              <span className="text-[9px] font-pixel px-1.5 py-0.5 bg-gb-leaf border border-gb-ink text-gb-cream hidden sm:inline-block">
                GBC
              </span>
            </div>
            <div className="text-xs font-vt323 text-gb-pale tracking-wider hidden sm:block">
              ★ TWO POINTERS HANDHELD LAB ★
            </div>
          </div>
        </div>

        {/* Desktop Nav Menu - Styled like classic Game Boy menu bar */}
        <nav className="hidden md:flex items-center gap-1.5 bg-gb-olive/80 p-1 border-2 border-gb-ink shadow-pixel-sm">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 font-pixel text-[10px] tracking-wide transition-all ${
                  isActive
                    ? 'bg-gb-cream text-gb-ink border-2 border-gb-ink shadow-pixel-sm font-bold'
                    : 'text-gb-cream hover:bg-gb-leaf/50 hover:text-white'
                }`}
              >
                <span className={isActive ? 'text-hare animate-bounce-pixel' : 'text-gb-pale'}>
                  {isActive ? '▶' : ' '}
                </span>
                <span>{link.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Retro Hardware Toggles: Sound & DMG Monochrome */}
        <div className="hidden sm:flex items-center gap-2">
          {/* DMG-01 Monochrome Palette Toggle */}
          <button
            onClick={() => {
              sound.playClick();
              onToggleDmgMode();
            }}
            title="Toggle Game Boy DMG-01 Monochrome Palette"
            className={`px-2.5 py-1.5 font-pixel text-[9px] border-2 border-gb-ink shadow-pixel-sm transition-all ${
              isDmgMode
                ? 'bg-dmg-lightest text-dmg-darkest font-bold'
                : 'bg-gb-olive text-gb-cream hover:bg-gb-leaf'
            }`}
          >
            {isDmgMode ? '📟 DMG MONO' : '🎨 GBC COLOR'}
          </button>

          {/* Sound FX Toggle */}
          <button
            onClick={() => {
              onToggleMute();
            }}
            title={isMuted ? 'Turn Sound ON' : 'Turn Sound OFF'}
            className={`px-2.5 py-1.5 font-pixel text-[9px] border-2 border-gb-ink shadow-pixel-sm transition-all ${
              isMuted
                ? 'bg-gb-forest text-gb-pale opacity-70'
                : 'bg-gb-pale text-gb-ink font-bold'
            }`}
          >
            {isMuted ? '🔇 BEEP OFF' : '🔊 8-BIT BEEP'}
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => {
              sound.playClick();
              onToggleDmgMode();
            }}
            className="px-2 py-1 font-pixel text-[8px] bg-gb-olive text-gb-cream border-2 border-gb-ink"
          >
            {isDmgMode ? 'DMG' : 'GBC'}
          </button>
          <button
            onClick={() => {
              onToggleMute();
            }}
            className="p-1.5 font-pixel text-[9px] bg-gb-olive text-gb-cream border-2 border-gb-ink"
          >
            {isMuted ? '🔇' : '🔊'}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="px-2.5 py-1 font-pixel text-[10px] bg-gb-cream text-gb-ink border-2 border-gb-ink shadow-pixel-sm"
          >
            {mobileMenuOpen ? '✕' : 'MENU'}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gb-cream border-t-2 border-gb-ink p-3 space-y-2 text-gb-ink font-pixel text-xs">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`flex items-center gap-2 w-full p-2 border-2 text-left ${
                  isActive
                    ? 'bg-gb-pale border-gb-ink font-bold shadow-pixel-sm'
                    : 'border-transparent hover:bg-gb-forest/10'
                }`}
              >
                <span className="text-hare">{isActive ? '▶' : ' '}</span>
                <span>{link.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
