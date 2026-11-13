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
    // Static / relative header with vintage Game Boy dark charcoal grey background
    <header className="relative w-full z-30 bg-[#191D21] border-b-4 border-[#0B0E11] shadow-pixel select-none">
      {/* Top Console Bevel Accent Line */}
      <div className="h-0.5 bg-[#2E343B] w-full" />

      <div className="max-w-7xl mx-auto px-3 sm:px-5 h-14 sm:h-15 flex items-center justify-between">
        {/* Logo / Brand - Handheld Game Console Cartridge Badge */}
        <div
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          {/* Retro Pixel Emblem with Power LED */}
          <div className="relative flex items-center -space-x-1 p-1 bg-gb-cream border-2 border-[#0B0E11] shadow-pixel-sm group-hover:bg-white transition-colors">
            <PixelTortoiseSprite size={18} />
            <PixelHareSprite size={18} />
            {/* Blinking Power LED */}
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-retro-success border border-[#0B0E11] animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-pixel text-xs sm:text-sm text-[#FAF7EE] tracking-tight group-hover:text-gb-pale transition-colors font-bold">
                CHASE<span className="text-hare">::</span>LOOP
              </span>
              <span className="text-[8px] font-pixel px-1.5 py-0.2 bg-[#282E36] border border-[#0B0E11] text-[#A7C957] hidden sm:inline-block">
                GBC
              </span>
            </div>
            <div className="text-[11px] font-vt323 text-[#9DA6AF] tracking-wider hidden sm:block leading-none mt-0.5">
              ★ TWO-POINTER HANDHELD LAB ★
            </div>
          </div>
        </div>

        {/* Desktop Nav Menu - Styled like classic Game Boy RPG Start Menu bar in recessed dark bay */}
        <nav className="hidden md:flex items-center gap-1 bg-[#101316] p-1 border-2 border-[#0B0E11] shadow-pixel-sm">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 font-pixel text-[9.5px] tracking-wide transition-all ${
                  isActive
                    ? 'bg-gb-cream text-gb-ink border-2 border-[#0B0E11] shadow-pixel-sm font-bold'
                    : 'text-[#D2D7DE] hover:bg-[#252A30] hover:text-white border-2 border-transparent'
                }`}
              >
                <span className={isActive ? 'text-hare animate-bounce-pixel' : 'text-[#5A6470]'}>
                  {isActive ? '▶' : '·'}
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
            className={`flex items-center gap-1.5 px-2.5 py-1.5 font-pixel text-[8.5px] border-2 border-[#0B0E11] shadow-pixel-sm transition-all ${
              isDmgMode
                ? 'bg-dmg-lightest text-dmg-darkest font-bold'
                : 'bg-[#252A30] text-[#D8DCE2] hover:bg-[#323942] hover:text-white'
            }`}
          >
            <span className={`w-1.5 h-1.5 border border-[#0B0E11] ${isDmgMode ? 'bg-dmg-darkest' : 'bg-retro-warning'}`} />
            <span>{isDmgMode ? 'DMG MONO' : 'GBC COLOR'}</span>
          </button>

          {/* Sound FX Toggle */}
          <button
            onClick={() => {
              onToggleMute();
            }}
            title={isMuted ? 'Turn Sound ON' : 'Turn Sound OFF'}
            className={`flex items-center gap-1 px-2.5 py-1.5 font-pixel text-[8.5px] border-2 border-[#0B0E11] shadow-pixel-sm transition-all ${
              isMuted
                ? 'bg-[#121518] text-[#747E89] opacity-75'
                : 'bg-gb-pale text-gb-ink font-bold hover:bg-white'
            }`}
          >
            <span>{isMuted ? '🔇' : '🔊'}</span>
            <span>{isMuted ? 'MUTE' : '8-BIT'}</span>
          </button>
        </div>

        {/* Mobile Controls & Hamburger */}
        <div className="flex md:hidden items-center gap-1.5">
          <button
            onClick={() => {
              sound.playClick();
              onToggleDmgMode();
            }}
            className="px-2 py-1 font-pixel text-[8px] bg-[#252A30] text-[#D8DCE2] border-2 border-[#0B0E11]"
            title="Palette Mode"
          >
            {isDmgMode ? 'DMG' : 'GBC'}
          </button>
          <button
            onClick={() => {
              onToggleMute();
            }}
            className="px-2 py-1 font-pixel text-[9px] bg-[#252A30] text-[#D8DCE2] border-2 border-[#0B0E11]"
            title="Sound"
          >
            {isMuted ? '🔇' : '🔊'}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="px-2.5 py-1 font-pixel text-[9.5px] bg-gb-cream text-gb-ink border-2 border-[#0B0E11] shadow-pixel-sm font-bold"
          >
            {mobileMenuOpen ? '✕ CLOSE' : '▶ MENU'}
          </button>
        </div>
      </div>

      {/* Mobile RPG Start Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gb-cream border-t-3 border-[#0B0E11] p-3 space-y-1.5 text-gb-ink font-pixel text-xs shadow-pixel">
          <div className="text-[8px] text-gb-olive font-bold tracking-wider mb-2 pb-1 border-b border-[#0B0E11]/30">
            START MENU // SELECT MODULE:
          </div>
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`flex items-center gap-2.5 w-full p-2 border-2 text-left transition-all ${
                  isActive
                    ? 'bg-gb-pale border-[#0B0E11] font-bold shadow-pixel-sm'
                    : 'border-transparent hover:bg-gb-forest/10'
                }`}
              >
                <span className={isActive ? 'text-hare' : 'text-transparent'}>▶</span>
                <span className="text-base leading-none">{link.icon}</span>
                <span className="text-[10px] tracking-wide">{link.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
