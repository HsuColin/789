export type NoteType = 'recording' | 'ppt' | 'youtube';

export interface MnemonicItem {
  term: string;
  context: string;
  trick: string;
}

export interface FormulaSnippet {
  title: string;
  desc: string;
}

export interface CheatSheet {
  structure: string; // Markdown summary overview
  mnemonics: MnemonicItem[];
  formulasOrBriefs: FormulaSnippet[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuizHistory {
  score: number;
  maxScore: number;
  answers: number[]; // user's choices
  takenAt: string;
}

export interface Note {
  id: string;
  title: string;
  createdAt: string;
  type: NoteType;
  sourceName: string;
  content: string; // raw input or transcript
  summary: string; // main general summary
  keyPoints: string[]; // essential takeaways
  cheatSheet: CheatSheet;
  quizzes: QuizQuestion[];
  quizHistory: QuizHistory[];
}
