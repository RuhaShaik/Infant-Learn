import React, { useState } from 'react';
import { Volume2, Sparkles, Plus, Minus, RotateCcw, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { NUMBERS_DATA } from '../data/learningData';
import { NumberItem } from '../types';
import { playSound, speakText } from '../utils/audio';

interface NumberSafariProps {
  soundEnabled: boolean;
  onEarnStar: () => void;
}

export const NumberSafariModule: React.FC<NumberSafariProps> = ({ soundEnabled, onEarnStar }) => {
  const [selectedNum, setSelectedNum] = useState<NumberItem>(NUMBERS_DATA[4]); // default 5
  const [tappedIndices, setTappedIndices] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<'counting' | 'math'>('counting');

  // Simple Math state
  const [mathA, setMathA] = useState<number>(2);
  const [mathB, setMathB] = useState<number>(3);
  const [mathAnswer, setMathAnswer] = useState<number | null>(null);

  const handleSelectNumber = (item: NumberItem) => {
    setSelectedNum(item);
    setTappedIndices([]);
    playSound('pop');
    if (soundEnabled) {
      speakText(`Number ${item.num}! ${item.word}. Let's count ${item.num} items!`, true);
    }
  };

  const handleTapCountItem = (index: number) => {
    if (!tappedIndices.includes(index)) {
      const nextTapped = [...tappedIndices, index];
      setTappedIndices(nextTapped);
      const currentCount = nextTapped.length;

      playSound('pop');
      if (soundEnabled) {
        speakText(`${currentCount}`, true);
      }

      if (currentCount === selectedNum.num) {
        playSound('success');
        onEarnStar();
        confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
        speakText(`Hooray! You counted all ${selectedNum.num} ${selectedNum.word}!`, soundEnabled);
      }
    }
  };

  const resetCount = () => {
    setTappedIndices([]);
    playSound('tap');
  };

  const checkMath = (guess: number) => {
    const correct = mathA + mathB;
    setMathAnswer(guess);
    if (guess === correct) {
      playSound('success');
      onEarnStar();
      confetti({ particleCount: 40, spread: 60 });
      speakText(`Correct! ${mathA} plus ${mathB} equals ${correct}!`, soundEnabled);
    } else {
      playSound('wrong');
      speakText(`Try again! Count the colorful dots together.`, soundEnabled);
    }
  };

  const newMathQuestion = () => {
    const a = Math.floor(Math.random() * 5) + 1;
    const b = Math.floor(Math.random() * 5) + 1;
    setMathA(a);
    setMathB(b);
    setMathAnswer(null);
    playSound('tap');
    if (soundEnabled) {
      speakText(`What is ${a} plus ${b}?`, true);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-3 sm:p-4 border border-amber-100 flex flex-wrap items-center justify-between gap-2 shadow-sm">
        <div>
          <h2 className="text-base sm:text-lg font-black text-amber-900 flex items-center gap-1.5">
            <span>🔢</span> Number Safari & Counting Stage
          </h2>
          <p className="text-xs text-amber-700 font-medium">Touch each item to count aloud 1, 2, 3... on your phone</p>
        </div>

        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-amber-200 shadow-sm">
          <button
            onClick={() => {
              setActiveTab('counting');
              playSound('tap');
            }}
            className={`px-3 py-1 rounded-lg text-xs font-black transition-all ${
              activeTab === 'counting' ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-600 hover:bg-amber-50'
            }`}
          >
            Count Objects
          </button>
          <button
            onClick={() => {
              setActiveTab('math');
              playSound('tap');
            }}
            className={`px-3 py-1 rounded-lg text-xs font-black transition-all flex items-center gap-1 ${
              activeTab === 'math' ? 'bg-orange-500 text-white shadow-sm' : 'text-slate-600 hover:bg-orange-50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Fun Adding
          </button>
        </div>
      </div>

      {activeTab === 'counting' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Number Selector Drawer / Column */}
          <div className="lg:col-span-1 bg-white rounded-3xl p-4 border border-slate-200 shadow-sm">
            <div className="text-xs font-bold text-slate-500 mb-2 flex items-center justify-between">
              <span>Select a Number (1-20):</span>
              <span className="font-black text-amber-600 text-sm">#{selectedNum.num}</span>
            </div>

            <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
              {NUMBERS_DATA.map(item => {
                const isSelected = selectedNum.num === item.num;
                return (
                  <button
                    key={item.num}
                    id={`num-select-${item.num}`}
                    onClick={() => handleSelectNumber(item)}
                    className={`h-12 rounded-xl font-black text-base transition-all active:scale-90 flex flex-col items-center justify-center border-2 ${
                      isSelected
                        ? 'bg-amber-500 text-white border-amber-600 shadow-md shadow-amber-200 scale-105'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-amber-50'
                    }`}
                  >
                    <span>{item.num}</span>
                  </button>
                );
              })}
            </div>

            {/* Quick Number Summary */}
            <div className="mt-4 p-3 bg-amber-50 rounded-2xl border border-amber-200 text-center">
              <div className="text-4xl font-black text-amber-800 tracking-tight">
                {selectedNum.num}
              </div>
              <div className="text-sm font-black text-amber-700 uppercase tracking-wider">
                {selectedNum.word}
              </div>
              <button
                onClick={() => speakText(`Number ${selectedNum.num}. Spelled ${selectedNum.word}.`, soundEnabled)}
                className="mt-2 text-xs font-bold text-amber-800 bg-white hover:bg-amber-100 border border-amber-300 px-3 py-1.5 rounded-xl inline-flex items-center gap-1"
              >
                <Volume2 className="w-3.5 h-3.5" />
                Listen Name
              </button>
            </div>
          </div>

          {/* Counting Interactive Stage */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-5 border-2 border-amber-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Counting Stage:</span>
                  <span className="text-xs font-black bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                    {tappedIndices.length} / {selectedNum.num} Counted
                  </span>
                </div>

                <button
                  onClick={resetCount}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-xl transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset
                </button>
              </div>

              {/* Tappable Items Grid */}
              <div className="min-h-[220px] bg-gradient-to-br from-amber-50/50 to-orange-50/50 rounded-2xl p-4 border border-dashed border-amber-200 flex flex-wrap items-center justify-center gap-3">
                {Array.from({ length: selectedNum.num }).map((_, index) => {
                  const isTapped = tappedIndices.includes(index);
                  return (
                    <button
                      key={index}
                      id={`count-item-${index}`}
                      onClick={() => handleTapCountItem(index)}
                      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl text-2xl sm:text-3xl flex flex-col items-center justify-center transition-all duration-200 active:scale-90 border-2 relative shadow-sm ${
                        isTapped
                          ? 'bg-amber-400 border-amber-500 scale-105 rotate-3 shadow-md'
                          : 'bg-white border-amber-200 hover:border-amber-400 hover:scale-105'
                      }`}
                    >
                      <span>{selectedNum.emoji}</span>
                      {isTapped && (
                        <span className="absolute -top-1.5 -right-1.5 bg-slate-900 text-white w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center shadow">
                          {tappedIndices.indexOf(index) + 1}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom status & prompt */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <p className="text-xs text-slate-600 font-medium">
                {tappedIndices.length === selectedNum.num
                  ? '🎉 All counted! You earned a star!'
                  : `Tap each ${selectedNum.emoji} icon above to count to ${selectedNum.num}!`}
              </p>
              <button
                onClick={() => {
                  speakText(`Count with me: ${Array.from({ length: selectedNum.num }, (_, i) => i + 1).join(', ')}!`, soundEnabled);
                }}
                className="px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold flex items-center gap-1.5"
              >
                <Volume2 className="w-3.5 h-3.5" />
                Count Along
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Simple Visual Math Helper */
        <div className="bg-white rounded-3xl p-6 border-2 border-orange-200 shadow-md text-center max-w-xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-900 text-xs font-black">
            <Sparkles className="w-3.5 h-3.5 text-orange-600" />
            Visual Addition Fun
          </div>

          <div className="flex items-center justify-center gap-3 sm:gap-6">
            {/* Group A */}
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-center">
              <div className="text-3xl font-black text-rose-600">{mathA}</div>
              <div className="flex gap-1 justify-center mt-1">
                {Array.from({ length: mathA }).map((_, i) => (
                  <span key={i} className="text-lg">🍎</span>
                ))}
              </div>
            </div>

            <div className="text-2xl font-black text-slate-400">
              <Plus className="w-6 h-6 text-slate-600 inline" />
            </div>

            {/* Group B */}
            <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 text-center">
              <div className="text-3xl font-black text-sky-600">{mathB}</div>
              <div className="flex gap-1 justify-center mt-1">
                {Array.from({ length: mathB }).map((_, i) => (
                  <span key={i} className="text-lg">⭐</span>
                ))}
              </div>
            </div>

            <div className="text-2xl font-black text-slate-400">=</div>

            <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center text-3xl font-black text-slate-800 bg-slate-50">
              {mathAnswer !== null ? mathAnswer : '?'}
            </div>
          </div>

          {/* Option buttons */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-500">Pick the total number:</p>
            <div className="flex items-center justify-center gap-2">
              {[mathA + mathB - 1, mathA + mathB, mathA + mathB + 2].sort(() => 0.5 - Math.random()).map(opt => (
                <button
                  key={opt}
                  onClick={() => checkMath(opt)}
                  className="w-14 h-14 rounded-2xl font-black text-xl border-2 border-slate-200 bg-slate-50 hover:bg-orange-50 hover:border-orange-400 active:scale-95 transition-all shadow-sm"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={newMathQuestion}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 inline-flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            New Math Puzzle
          </button>
        </div>
      )}
    </div>
  );
};
