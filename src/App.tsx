import React, { useState } from 'react';
import { Navbar, NavTab } from './components/layout/Navbar';
import { HeroSection } from './components/home/HeroSection';
import { ArenaWorkspace } from './components/arena/ArenaWorkspace';
import { LearningSection } from './components/learning/LearningSection';
import { ChallengeMode } from './components/challenges/ChallengeMode';
import { ComplexityLab } from './components/complexity/ComplexityLab';
import { Footer } from './components/layout/Footer';
import { EmbedVisualizer } from './components/embed/EmbedVisualizer';
import { sound } from './utils/audio';

export const App: React.FC = () => {
  // Check if route or query flag requests chromeless embed mode (for Canva, slide decks, or iframes)
  const isEmbed =
    typeof window !== 'undefined' &&
    (window.location.pathname.startsWith('/embed') ||
      new URLSearchParams(window.location.search).get('embed') === 'true' ||
      new URLSearchParams(window.location.search).get('embed') === '1' ||
      window.location.hash.startsWith('#/embed') ||
      window.location.hash.includes('embed=true'));

  if (isEmbed) {
    return <EmbedVisualizer />;
  }

  const [activeTab, setActiveTab] = useState<NavTab>('arena');
  const [isMuted, setIsMuted] = useState<boolean>(sound.getMuted());
  const [isDmgMode, setIsDmgMode] = useState<boolean>(() => {
    return localStorage.getItem('chase_loop_dmg_mono') === 'true';
  });

  const handleToggleMute = () => {
    const nextMuted = sound.toggleMute();
    setIsMuted(nextMuted);
  };

  const handleToggleDmgMode = () => {
    setIsDmgMode((prev) => {
      const next = !prev;
      localStorage.setItem('chase_loop_dmg_mono', String(next));
      return next;
    });
  };

  const handleTabChange = (tab: NavTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen flex flex-col bg-gb-forest text-gb-cream selection:bg-gb-pale selection:text-gb-forest font-vt323 ${isDmgMode ? 'dmg-mono' : ''}`}>
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        isDmgMode={isDmgMode}
        onToggleDmgMode={handleToggleDmgMode}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HeroSection
            onEnterArena={() => handleTabChange('arena')}
            onExploreTheory={() => handleTabChange('learn')}
            onStartChallenges={() => handleTabChange('challenges')}
          />
        )}

        {activeTab === 'arena' && <ArenaWorkspace />}

        {activeTab === 'learn' && <LearningSection />}

        {activeTab === 'challenges' && <ChallengeMode />}

        {activeTab === 'complexity' && <ComplexityLab />}
      </main>

      {/* Footer */}
      <Footer onTabChange={handleTabChange} />
    </div>
  );
};

export default App;
