import React, { useState } from 'react';
import { Volume2, Sparkles, Trophy, CheckCircle, XCircle, ArrowRight, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { QUIZ_QUESTIONS } from '../data/learningData';
import { playSound, speakText } from '../utils/audio';

interface QuizModuleProps {
  soundEnabled: boolean;
  onEarnStar: () => void;
}

export const QuizModule: React.FC<QuizModuleProps> = ({ soundEnabled, onEarnStar }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQ = QUIZ_QUESTIONS[currentIndex];

  const handleSelectOption = (optionId: string, isCorrect: boolean) => {
    if (isAnswered) return;
    setSelectedOptionId(optionId);
    setIsAnswered(true);

    if (isCorrect) {
      setScore(prev => prev + 1);
      playSound('success');
      onEarnStar();
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
      speakText('Great job! That is correct!', soundEnabled);
    } else {
      playSound('wrong');
      speakText('Oops, let us check the right answer!', soundEnabled);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < QUIZ_QUESTIONS.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOptionId(null);
      setIsAnswered(false);
      const nextQ = QUIZ_QUESTIONS[currentIndex + 1];
      if (soundEnabled) {
        speakText(nextQ.spokenPrompt, true);
      }
    } else {
      setQuizFinished(true);
      playSound('cheer');
      confetti({ particleCount: 80, spread: 90, origin: { y: 0.5 } });
      speakText(`Congratulations! You completed the quiz with ${score + (selectedOptionId ? 1 : 0)} points!`, soundEnabled);
    }
  };

  const restartQuiz = () => {
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setIsAnswered(false);
    setScore(0);
    setQuizFinished(false);
    playSound('tap');
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-sky-50 to-indigo-50 rounded-2xl p-3 sm:p-4 border border-sky-100 flex flex-wrap items-center justify-between gap-2 shadow-sm">
        <div>
          <h2 className="text-base sm:text-lg font-black text-sky-900 flex items-center gap-1.5">
            <span>⭐</span> Star Quiz Challenge
          </h2>
          <p className="text-xs text-sky-700 font-medium">Listen to the question and tap the right answer!</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-black bg-white px-3 py-1.5 rounded-xl border border-sky-200 text-sky-800 shadow-sm">
            Question {currentIndex + 1} of {QUIZ_QUESTIONS.length}
          </span>
        </div>
      </div>

      {!quizFinished ? (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-sky-200 shadow-md max-w-xl mx-auto space-y-6">
          {/* Question illustration & text */}
          <div className="text-center space-y-2">
            <div className="text-6xl animate-bounce mb-1">
              {currentQ.emoji}
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-800 leading-snug">
              {currentQ.question}
            </h3>

            {/* Read question button */}
            <button
              onClick={() => speakText(currentQ.spokenPrompt, soundEnabled)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl text-xs font-bold text-sky-700 transition-all"
            >
              <Volume2 className="w-4 h-4" />
              Listen to Question
            </button>
          </div>

          {/* Options list */}
          <div className="space-y-2.5">
            {currentQ.options.map(opt => {
              const isSelected = selectedOptionId === opt.id;
              let btnStyle = 'border-slate-200 bg-slate-50 hover:bg-sky-50 hover:border-sky-300';

              if (isAnswered) {
                if (opt.isCorrect) {
                  btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 shadow-sm';
                } else if (isSelected && !opt.isCorrect) {
                  btnStyle = 'border-rose-500 bg-rose-50 text-rose-900';
                } else {
                  btnStyle = 'border-slate-200 bg-slate-100 opacity-60';
                }
              }

              return (
                <button
                  key={opt.id}
                  id={`quiz-opt-${opt.id}`}
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(opt.id, opt.isCorrect)}
                  className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between transition-all active:scale-98 ${btnStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{opt.emoji}</span>
                    <span className="text-base font-black">{opt.text}</span>
                  </div>

                  {isAnswered && opt.isCorrect && (
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                  )}
                  {isAnswered && isSelected && !opt.isCorrect && (
                    <XCircle className="w-5 h-5 text-rose-600" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Next Button */}
          {isAnswered && (
            <div className="pt-2">
              <button
                onClick={handleNext}
                className="w-full py-3.5 bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-md shadow-sky-200 transition-all active:scale-98"
              >
                <span>{currentIndex + 1 === QUIZ_QUESTIONS.length ? 'See Results 🏆' : 'Next Question'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Final Score & Trophy Card */
        <div className="bg-white rounded-3xl p-8 border-2 border-amber-300 shadow-lg text-center max-w-md mx-auto space-y-5">
          <div className="w-20 h-20 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto text-4xl shadow-inner animate-pulse">
            🏆
          </div>

          <div>
            <h3 className="text-2xl font-black text-slate-800">Quiz Champion!</h3>
            <p className="text-slate-500 text-xs font-semibold mt-1">You finished all interactive challenges!</p>
          </div>

          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
            <div className="text-3xl font-black text-amber-900">{score} / {QUIZ_QUESTIONS.length}</div>
            <div className="text-xs font-bold text-amber-700 uppercase tracking-wider mt-1">Questions Mastered ⭐</div>
          </div>

          <button
            onClick={restartQuiz}
            className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-md transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Play Quiz Again
          </button>
        </div>
      )}
    </div>
  );
};
