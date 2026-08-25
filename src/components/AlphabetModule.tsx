import React, { useState } from 'react';
import { Volume2, Sparkles, CheckCircle2, ChevronRight, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ALPHABET_DATA } from '../data/learningData';
import { AlphabetItem } from '../types';
import { playSound, speakText } from '../utils/audio';

interface AlphabetModuleProps {
  soundEnabled: boolean;
  onEarnStar: () => void;
}

export const AlphabetModule: React.FC<AlphabetModuleProps> = ({ soundEnabled, onEarnStar }) => {
  const [selectedLetter, setSelectedLetter] = useState<AlphabetItem>(ALPHABET_DATA[0]);
  const [activeMode, setActiveMode] = useState<'explore' | 'game'>('explore');

  // Mini-Game State (Letter Detective)
  const [targetItem, setTargetItem] = useState<AlphabetItem>(() => ALPHABET_DATA[Math.floor(Math.random() * ALPHABET_DATA.length)]);
  const [gameOptions, setGameOptions] = useState<AlphabetItem[]>(() => generateOptions(ALPHABET_DATA[0]));
  const [gameFeedback, setGameFeedback] = useState<'correct' | 'wrong' | null>(null);

  function generateOptions(target: AlphabetItem): AlphabetItem[] {
    const others = ALPHABET_DATA.filter(item => item.letter !== target.letter);
    const shuffled = [...others].sort(() => 0.5 - Math.random()).slice(0, 3);
    return [target, ...shuffled].sort(() => 0.5 - Math.random());
  }

  const startNewQuestion = () => {
    const randomTarget = ALPHABET_DATA[Math.floor(Math.random() * ALPHABET_DATA.length)];
    setTargetItem(randomTarget);
    setGameOptions(generateOptions(randomTarget));
    setGameFeedback(null);
    if (soundEnabled) {
      speakText(`Which letter makes the sound ${randomTarget.phonics} for ${randomTarget.word}?`, true);
    }
  };

  const handleSelectLetter = (item: AlphabetItem) => {
    setSelectedLetter(item);
    playSound('pop');
    if (soundEnabled) {
      speakText(`${item.letter}. ${item.word}! The letter ${item.letter} says ${item.phonics}.`, true);
    }
  };

  const handleGameGuess = (item: AlphabetItem) => {
    if (item.letter === targetItem.letter) {
      setGameFeedback('correct');
      playSound('success');
      onEarnStar();
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
      speakText(`Super job! ${item.letter} is for ${item.word}!`, soundEnabled);
      setTimeout(() => {
        startNewQuestion();
      }, 1500);
    } else {
      setGameFeedback('wrong');
      playSound('wrong');
      speakText(`Let's try again! Look for ${targetItem.word}`, soundEnabled);
      setTimeout(() => setGameFeedback(null), 1000);
    }
  };

  return (
    <div className="space-y-4">
      {/* Mode Switcher Banner */}
      <div className="bg-gradient-to-r from-rose-50 to-amber-50 rounded-2xl p-3 sm:p-4 border border-rose-100 flex flex-wrap items-center justify-between gap-2 shadow-sm">
        <div>
          <h2 className="text-base sm:text-lg font-black text-rose-900 flex items-center gap-1.5">
            <span>🔤</span> Alphabet & Phonics Playground
          </h2>
          <p className="text-xs text-rose-700 font-medium">Tap any letter on your screen to hear clear voice phonics</p>
        </div>

        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-rose-200 shadow-sm">
          <button
            onClick={() => {
              setActiveMode('explore');
              playSound('tap');
            }}
            className={`px-3 py-1 rounded-lg text-xs font-black transition-all ${
              activeMode === 'explore' ? 'bg-rose-500 text-white shadow-sm' : 'text-slate-600 hover:bg-rose-50'
            }`}
          >
            Explore A-Z
          </button>
          <button
            onClick={() => {
              setActiveMode('game');
              playSound('tap');
              startNewQuestion();
            }}
            className={`px-3 py-1 rounded-lg text-xs font-black transition-all flex items-center gap-1 ${
              activeMode === 'game' ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-600 hover:bg-amber-50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Letter Game
          </button>
        </div>
      </div>

      {activeMode === 'explore' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Active Highlighted Card Display (Large Interactive Preview) */}
          <div className="lg:col-span-1 bg-white rounded-3xl p-5 border-2 border-rose-200 shadow-md flex flex-col items-center justify-between text-center relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-rose-100/60 blur-xl pointer-events-none" />

            <div className="w-full flex items-center justify-between text-xs font-bold text-slate-400">
              <span className="bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded-full font-black">Phonics Card</span>
              <span>Letter #{ALPHABET_DATA.findIndex(x => x.letter === selectedLetter.letter) + 1} of 26</span>
            </div>

            {/* Letter & Emoji */}
            <div className="my-4">
              <div className="text-6xl sm:text-7xl animate-bounce mb-2">
                {selectedLetter.emoji}
              </div>
              <div className="flex items-baseline justify-center gap-2">
                <span className={`text-6xl sm:text-7xl font-black ${selectedLetter.color} tracking-tighter`}>
                  {selectedLetter.letter}
                </span>
                <span className="text-4xl font-black text-slate-400 lowercase">
                  {selectedLetter.letter}
                </span>
              </div>
              <h3 className="text-2xl font-black text-slate-800 mt-1">
                {selectedLetter.word}
              </h3>
            </div>

            {/* Phonics & Voice Box */}
            <div className="w-full space-y-2.5">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-left">
                <div className="text-[11px] font-bold uppercase tracking-wider text-amber-700">Phonics Sound</div>
                <div className="text-sm font-black text-amber-900 mt-0.5">
                  "{selectedLetter.letter}" says <span className="underline decoration-amber-400 decoration-2">/{selectedLetter.phonics}/</span> as in {selectedLetter.word}
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-left">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Kid Fun Fact 💡</div>
                <div className="text-xs text-slate-700 font-medium mt-0.5 leading-relaxed">
                  {selectedLetter.funFact}
                </div>
              </div>

              {/* Read Aloud Button */}
              <button
                id="listen-phonics-btn"
                onClick={() => {
                  playSound('pop');
                  speakText(`${selectedLetter.letter}. ${selectedLetter.word}! Phonics sound: ${selectedLetter.phonics}. ${selectedLetter.funFact}`, soundEnabled);
                }}
                className="w-full py-3 px-4 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 active:scale-98 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-md shadow-rose-200 transition-all"
              >
                <Volume2 className="w-4 h-4" />
                <span>Hear Letter & Sound</span>
              </button>
            </div>
          </div>

          {/* Letter Grid (Touch Friendly, large touch targets for Android Phone) */}
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-3xl p-3 sm:p-5 border border-slate-200 shadow-sm">
            <div className="text-xs font-bold text-slate-500 mb-3 px-1 flex items-center justify-between">
              <span>Touch any letter tile to learn:</span>
              <span className="text-[11px] text-rose-600 font-bold">26 Letters</span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-7 gap-2">
              {ALPHABET_DATA.map(item => {
                const isSelected = selectedLetter.letter === item.letter;
                return (
                  <button
                    key={item.letter}
                    id={`letter-tile-${item.letter}`}
                    onClick={() => handleSelectLetter(item)}
                    className={`h-16 sm:h-20 rounded-2xl border-2 flex flex-col items-center justify-center p-1 transition-all active:scale-95 touch-manipulation relative overflow-hidden ${
                      isSelected
                        ? 'border-rose-500 bg-rose-500 text-white shadow-md shadow-rose-200 scale-105 z-10'
                        : `${item.bgLight} border-slate-200/80`
                    }`}
                  >
                    <span className={`text-lg sm:text-2xl font-black ${isSelected ? 'text-white' : item.color}`}>
                      {item.letter}
                    </span>
                    <span className="text-base sm:text-lg leading-none mt-0.5">
                      {item.emoji}
                    </span>
                    <span className={`text-[10px] font-bold truncate max-w-[90%] ${isSelected ? 'text-rose-100' : 'text-slate-600'}`}>
                      {item.word}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Mini Phonics Game */
        <div className="bg-white rounded-3xl p-6 border-2 border-amber-200 shadow-md text-center max-w-xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            Letter Detective Challenge
          </div>

          <div>
            <div className="text-6xl sm:text-7xl mb-2 animate-bounce">
              {targetItem.emoji}
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-800">
              Which letter is for <span className="text-rose-600">"{targetItem.word}"</span>?
            </h3>
            <p className="text-xs text-slate-500 font-semibold mt-1">
              Phonics sound: <span className="font-black text-amber-600">/{targetItem.phonics}/</span>
            </p>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
            {gameOptions.map(opt => (
              <button
                key={opt.letter}
                id={`game-opt-${opt.letter}`}
                onClick={() => handleGameGuess(opt)}
                className="py-4 px-3 rounded-2xl border-2 border-slate-200 bg-slate-50 hover:bg-amber-50 hover:border-amber-400 active:scale-95 transition-all text-center flex flex-col items-center justify-center gap-1 shadow-sm"
              >
                <span className="text-3xl font-black text-slate-800">
                  {opt.letter}
                </span>
                <span className="text-xs font-bold text-slate-500">
                  Letter {opt.letter}
                </span>
              </button>
            ))}
          </div>

          {/* Voice Prompt & Skip */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => speakText(`Find the letter for ${targetItem.word}`, soundEnabled)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5"
            >
              <Volume2 className="w-4 h-4" />
              Repeat Question
            </button>
            <button
              onClick={startNewQuestion}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5"
            >
              <RefreshCw className="w-4 h-4" />
              Next Card
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
