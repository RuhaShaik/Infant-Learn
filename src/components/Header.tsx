import React from 'react';
import { Sparkles, Volume2, VolumeX, Smartphone, Star } from 'lucide-react';
import { LearningTab } from '../types';

interface HeaderProps {
  activeTab: LearningTab;
  setActiveTab: (tab: LearningTab) => void;
  stars: number;
  soundEnabled: boolean;
  setSoundEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  onOpenGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  stars,
  soundEnabled,
  setSoundEnabled,
  onOpenGuide,
}) => {
  const navItems: { id: LearningTab; label: string; icon: string; bg: string }[] = [
    { id: 'abc', label: 'ABC Phonics', icon: '🔤', bg: 'hover:bg-rose-100 data-[active=true]:bg-rose-500 data-[active=true]:text-white' },
    { id: 'numbers', label: '123 Numbers', icon: '🔢', bg: 'hover:bg-amber-100 data-[active=true]:bg-amber-500 data-[active=true]:text-white' },
    { id: 'shapes', label: 'Shapes & Colors', icon: '🎨', bg: 'hover:bg-emerald-100 data-[active=true]:bg-emerald-500 data-[active=true]:text-white' },
    { id: 'drawing', label: 'Magic Canvas', icon: '✨', bg: 'hover:bg-purple-100 data-[active=true]:bg-purple-500 data-[active=true]:text-white' },
    { id: 'quiz', label: 'Star Quiz', icon: '⭐', bg: 'hover:bg-sky-100 data-[active=true]:bg-sky-500 data-[active=true]:text-white' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-amber-100 shadow-sm">
      <div className="max-w-5xl mx-auto px-3 sm:px-6 py-2.5">
        <div className="flex items-center justify-between gap-2">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-rose-400 flex items-center justify-center text-xl shadow-md transform -rotate-3 hover:rotate-0 transition-transform">
              🚀
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-black text-slate-800 tracking-tight leading-tight flex items-center gap-1.5">
                KiddoLearn <span className="hidden sm:inline-block text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">Android Test Demo</span>
              </h1>
              <p className="text-[11px] text-slate-500 font-medium hidden xs:block">Interactive Touch & Voice Learning</p>
            </div>
          </div>

          {/* Quick Actions (Stars, Sound, Mobile Guide) */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Stars Counter */}
            <div
              id="stars-badge"
              className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2.5 py-1.5 rounded-full text-amber-800 font-black text-xs sm:text-sm shadow-inner"
              title="Stars earned from learning!"
            >
              <Star className="w-4 h-4 fill-amber-400 text-amber-500 animate-pulse" />
              <span>{stars}</span>
            </div>

            {/* Sound Toggle */}
            <button
              id="sound-toggle-btn"
              onClick={() => setSoundEnabled(prev => !prev)}
              aria-label={soundEnabled ? 'Mute sound' : 'Enable sound'}
              className={`p-2 rounded-xl border transition-all text-xs flex items-center justify-center ${
                soundEnabled
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                  : 'bg-slate-100 border-slate-200 text-slate-400 hover:bg-slate-200'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Android Setup & Deployment Guide Button */}
            <button
              id="android-guide-btn"
              onClick={onOpenGuide}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-blue-200 active:scale-95 transition-all"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Android & Phone Setup</span>
              <span className="sm:hidden">Guide</span>
            </button>
          </div>
        </div>

        {/* Scrollable Navigation Bar for Mobile */}
        <nav className="flex items-center gap-1.5 mt-2.5 overflow-x-auto no-scrollbar pb-1 pt-0.5">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                data-active={isActive}
                onClick={() => setActiveTab(item.id)}
                className={`whitespace-nowrap flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 border ${
                  isActive
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-slate-100/90 text-slate-700 border-slate-200/70 hover:bg-slate-200'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
