import React, { useState } from 'react';
import { Navbar, NavTab } from './components/layout/Navbar';
import { HeroSection } from './components/home/HeroSection';
import { ArenaWorkspace } from './components/arena/ArenaWorkspace';
import { LearningSection } from './components/learning/LearningSection';
import { ChallengeMode } from './components/challenges/ChallengeMode';
import { ComplexityLab } from './components/complexity/ComplexityLab';
import { Footer } from './components/layout/Footer';
import { sound } from './utils/audio';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('arena');
  const [isMuted, setIsMuted] = useState<boolean>(sound.getMuted());

  // Listen for audio mute changes
  const handleToggleMute = () => {
    const nextMuted = sound.toggleMute();
    setIsMuted(nextMuted);
  };

  // Scroll to top on tab change
  const handleTabChange = (tab: NavTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-arcade-950 text-slate-100 selection:bg-lime-accent selection:text-arcade-950">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HeroSection
            onEnterArena={() => handleTabChange('arena')}
            onExploreTheory={() => handleTabChange('learn')}
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
