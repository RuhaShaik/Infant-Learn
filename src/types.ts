export type LearningTab = 'abc' | 'numbers' | 'shapes' | 'drawing' | 'quiz';

export interface AlphabetItem {
  letter: string;
  word: string;
  emoji: string;
  phonics: string;
  color: string;
  bgLight: string;
  funFact: string;
}

export interface NumberItem {
  num: number;
  word: string;
  emoji: string;
  color: string;
}

export interface ShapeItem {
  id: string;
  name: string;
  colorName: string;
  colorHex: string;
  emoji: string;
  shapeType: 'circle' | 'square' | 'triangle' | 'star' | 'heart' | 'diamond';
}

export interface QuizQuestion {
  id: number;
  question: string;
  spokenPrompt: string;
  emoji: string;
  options: {
    id: string;
    text: string;
    emoji: string;
    isCorrect: boolean;
  }[];
}
