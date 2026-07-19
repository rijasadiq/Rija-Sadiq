export type Language = "Swedish" | "English" | "Urdu" | "Turkish" | "Korean" | "Chinese";

export interface CorrectionItem {
  original: string;
  corrected: string;
  explanation: string;
}

export interface VocabUpgrade {
  originalWord: string;
  suggestedWord: string;
  explanation: string;
}

export interface TutorFeedback {
  correctedText: string;
  hasCorrections: boolean;
  correctionsList: CorrectionItem[];
  vocabUpgrades: VocabUpgrade[];
  accuracyScore: number;
  pronunciationPhonetics: string;
  tutorResponse: string;
}

export interface WordTranslation {
  word: string;
  translation: string;
  pronunciation: string;
  explanation: string;
}

export interface StoryData {
  title: string;
  titleTranslation: string;
  storyText: string;
  storyTranslation: string;
  wordTranslations: WordTranslation[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ListeningData {
  title: string;
  audioScenarioDescription: string;
  dialogue: Array<{ speaker: string; text: string; translation: string }>;
  questions: QuizQuestion[];
}

export interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
  unlockedAt?: string;
  requirementType: "lesson" | "polyglot" | "chatterbox" | "perfect_score";
}

export interface UserProgress {
  currentLanguage: Language;
  streak: number;
  totalXp: number;
  completedQuizzesCount: number;
  chatterboxMinutes: number;
  languagesPracticed: Set<string>;
  badges: Badge[];
  lastCompletedDate?: string;
}
