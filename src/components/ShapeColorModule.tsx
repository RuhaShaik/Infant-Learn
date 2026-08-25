import React, { useState } from 'react';
import { Volume2, Sparkles, Check, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SHAPES_DATA } from '../data/learningData';
import { ShapeItem } from '../types';
import { playSound, speakText } from '../utils/audio';

interface ShapeColorProps {
  soundEnabled: boolean;
  onEarnStar: () => void;
}

export const ShapeColorModule: React.FC<ShapeColorProps> = ({ soundEnabled, onEarnStar }) => {
  const [selectedShape, setSelectedShape] = useState<ShapeItem>(SHAPES_DATA[0]);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [activeSlot, setActiveSlot] = useState<string | null>(null);

  const handleSelectShape = (shape: ShapeItem) => {
    setSelectedShape(shape);
    playSound('pop');
    if (soundEnabled) {
      speakText(`${shape.colorName} ${shape.name.split(' ')[1]}!`, true);
    }
  };

  const handleAttemptMatch = (targetId: string) => {
    if (targetId === selectedShape.id) {
      if (!matchedIds.includes(targetId)) {
        const nextMatched = [...matchedIds, targetId];
        setMatchedIds(nextMatched);
        playSound('success');
        onEarnStar();
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
        speakText(`Match! That is the ${selectedShape.name}!`, soundEnabled);

        // Pick next unmatched shape
        const remaining = SHAPES_DATA.filter(s => !nextMatched.includes(s.id));
        if (remaining.length > 0) {
          setSelectedShape(remaining[0]);
        }
      }
    } else {
      playSound('wrong');
      speakText(`That is not a match. Look for ${selectedShape.name}!`, soundEnabled);
    }
  };

  const resetGame = () => {
    setMatchedIds([]);
    setSelectedShape(SHAPES_DATA[0]);
    playSound('tap');
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-3 sm:p-4 border border-emerald-100 flex flex-wrap items-center justify-between gap-2 shadow-sm">
        <div>
          <h2 className="text-base sm:text-lg font-black text-emerald-900 flex items-center gap-1.5">
            <span>🎨</span> Shapes & Colors Explorer
          </h2>
          <p className="text-xs text-emerald-700 font-medium">Tap shapes, learn color names, and match them up!</p>
        </div>

        <button
          onClick={resetGame}
          className="px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1 shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Reset Matcher
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Active Shape Card */}
        <div className="lg:col-span-1 bg-white rounded-3xl p-5 border-2 border-emerald-200 shadow-sm flex flex-col items-center justify-between text-center">
          <div className="w-full flex items-center justify-between text-xs font-bold text-slate-400">
            <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-black">Active Target</span>
            <span>{matchedIds.length} / {SHAPES_DATA.length} Matched</span>
          </div>

          <div className="my-6">
            <div className="text-7xl mb-2 animate-bounce">
              {selectedShape.emoji}
            </div>
            <h3 className="text-2xl font-black text-slate-800">
              {selectedShape.name}
            </h3>
            <div className="mt-2 flex items-center justify-center gap-2">
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                Color: <strong style={{ color: selectedShape.colorHex }}>{selectedShape.colorName}</strong>
              </span>
            </div>
          </div>

          <button
            onClick={() => speakText(`This is a ${selectedShape.name}!`, soundEnabled)}
            className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-200"
          >
            <Volume2 className="w-4 h-4" />
            <span>Hear Shape & Color</span>
          </button>
        </div>

        {/* Matching Stage & Palette */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Tap the matching shape slot below:
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {SHAPES_DATA.map(shape => {
                const isMatched = matchedIds.includes(shape.id);
                const isSelected = selectedShape.id === shape.id;

                return (
                  <button
                    key={shape.id}
                    id={`shape-slot-${shape.id}`}
                    onClick={() => {
                      if (!isMatched) {
                        handleAttemptMatch(shape.id);
                      } else {
                        handleSelectShape(shape);
                      }
                    }}
                    className={`h-28 rounded-2xl border-2 flex flex-col items-center justify-center p-2 transition-all active:scale-95 relative overflow-hidden ${
                      isMatched
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-900 shadow-inner'
                        : isSelected
                        ? 'border-emerald-500 bg-emerald-50/50 scale-102 shadow-sm'
                        : 'border-dashed border-slate-300 bg-slate-50/50 hover:bg-slate-100 hover:border-slate-400'
                    }`}
                  >
                    <span className="text-3xl mb-1">
                      {isMatched ? shape.emoji : '❓'}
                    </span>
                    <span className="text-xs font-black text-slate-700">
                      {shape.name}
                    </span>

                    {isMatched && (
                      <span className="absolute top-2 right-2 bg-emerald-500 text-white p-1 rounded-full text-xs shadow">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Shape Selector for learning */}
          <div className="pt-3 border-t border-slate-100">
            <p className="text-xs font-bold text-slate-400 mb-2">Or switch active shape to explore:</p>
            <div className="flex flex-wrap gap-2">
              {SHAPES_DATA.map(shape => (
                <button
                  key={shape.id}
                  onClick={() => handleSelectShape(shape)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                    selectedShape.id === shape.id
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  <span>{shape.emoji}</span>
                  <span>{shape.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
