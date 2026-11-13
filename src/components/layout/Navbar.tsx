import React, { useState } from 'react';
import { 
  Compass, 
  BookOpen, 
  Trophy, 
  BarChart3, 
  Home, 
  Volume2, 
  VolumeX, 
  Menu, 
  X,
  Play
} from 'lucide-react';
import { sound } from '../../utils/audio';

export type NavTab = 'home' | 'arena' | 'learn' | 'challenges' | 'complexity';

interface NavbarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  isMuted,
  onToggleMute,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'HOME', icon: <Home className="w-4 h-4" /> },
    { id: 'arena', label: 'ARENA', icon: <Compass className="w-4 h-4" /> },
    { id: 'learn', label: 'LEARN', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'challenges', label: 'CHALLENGES', icon: <Trophy className="w-4 h-4" /> },
    { id: 'complexity', label: 'COMPLEXITY', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  const handleNavClick = (tab: NavTab) => {
    sound.playClick();
    onTabChange(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-arcade-950/85 backdrop-blur-md border-b border-arcade-800">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo / Brand */}
        <div
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-lg bg-arcade-900 border border-arcade-750 flex items-center justify-center font-mono font-black text-lime-accent text-base group-hover:border-lime-accent group-hover:shadow-glow-lime transition-all duration-200">
            C//L
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold font-mono tracking-wider text-white text-base">
                CHASE<span className="text-lime-accent">//</span>LOOP
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-lime-accent animate-ping" />
            </div>
            <div className="text-[10px] font-mono text-slate-400 tracking-tight -mt-1 hidden sm:block">
              HARE &amp; TORTOISE LAB
            </div>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 bg-arcade-900/90 p-1 rounded-xl border border-arcade-800 font-mono text-xs">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all font-semibold ${
                  isActive
                    ? 'bg-arcade-850 text-lime-accent border border-lime-accent/40 shadow-glow-lime'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-arcade-850/50'
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Actions: Arena Quick CTA + Audio Mute */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Quick Audio Mute */}
          <button
            onClick={onToggleMute}
            title={isMuted ? 'Unmute Audio (M)' : 'Mute Audio (M)'}
            className={`p-2 rounded-lg border transition-all ${
              isMuted
                ? 'bg-arcade-900 border-arcade-800 text-slate-500'
                : 'bg-arcade-900 border-cyan-500/40 text-cyan-400 shadow-glow-tortoise'
            }`}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {activeTab !== 'arena' && (
            <button
              onClick={() => handleNavClick('arena')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-lime-accent hover:bg-lime-400 text-arcade-950 font-bold text-xs font-mono transition-all duration-150 active:scale-95 shadow-glow-lime"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>SIMULATOR</span>
            </button>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={onToggleMute}
            className="p-2 rounded-lg bg-arcade-900 border border-arcade-800 text-slate-400"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-arcade-900 border border-arcade-800 text-slate-300"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-arcade-950 border-b border-arcade-800 px-4 py-3 space-y-1 font-mono text-xs">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`flex items-center gap-2 w-full p-2.5 rounded-lg text-left transition-all ${
                  isActive
                    ? 'bg-arcade-850 text-lime-accent font-bold border border-lime-accent/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
