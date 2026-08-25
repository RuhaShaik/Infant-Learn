/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { AlphabetModule } from './components/AlphabetModule';
import { NumberSafariModule } from './components/NumberSafariModule';
import { ShapeColorModule } from './components/ShapeColorModule';
import { MagicDoodleModule } from './components/MagicDoodleModule';
import { QuizModule } from './components/QuizModule';
import { AndroidGuideModal } from './components/AndroidGuideModal';
import { LearningTab } from './types';
import { playSound } from './utils/audio';

export default function App() {
  const [activeTab, setActiveTab] = useState<LearningTab>('abc');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [stars, setStars] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('kiddolearn_stars');
      return saved ? parseInt(saved, 10) : 5;
    } catch {
      return 5;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('kiddolearn_stars', stars.toString());
    } catch {
      // ignore
    }
  }, [stars]);

  const handleEarnStar = () => {
    setStars(prev => prev + 1);
  };

  const handleTabChange = (tab: LearningTab) => {
    setActiveTab(tab);
    playSound('tap');
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-slate-800 flex flex-col font-sans selection:bg-amber-200">
      {/* Top Header & Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        stars={stars}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        onOpenGuide={() => setIsGuideOpen(true)}
      />

      {/* Main Learning Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-3 sm:p-6 pb-20">
        {activeTab === 'abc' && (
          <AlphabetModule soundEnabled={soundEnabled} onEarnStar={handleEarnStar} />
        )}
        {activeTab === 'numbers' && (
          <NumberSafariModule soundEnabled={soundEnabled} onEarnStar={handleEarnStar} />
        )}
        {activeTab === 'shapes' && (
          <ShapeColorModule soundEnabled={soundEnabled} onEarnStar={handleEarnStar} />
        )}
        {activeTab === 'drawing' && (
          <MagicDoodleModule soundEnabled={soundEnabled} onEarnStar={handleEarnStar} />
        )}
        {activeTab === 'quiz' && (
          <QuizModule soundEnabled={soundEnabled} onEarnStar={handleEarnStar} />
        )}
      </main>

      {/* Android Setup & Deployment Modal Guide */}
      <AndroidGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
    </div>
  );
}
