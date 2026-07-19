import { useState, useEffect } from "react";
import { Language, Badge } from "./types";
import AndroidFrame from "./components/AndroidFrame";
import SourceCodeExplorer from "./components/SourceCodeExplorer";
import { Smartphone, Sparkles, BookOpen, AlertCircle, RefreshCw } from "lucide-react";

export default function App() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>("Swedish");
  const [streak, setStreak] = useState(5);
  const [totalXp, setTotalXp] = useState(120);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [isBiometricsEnabled, setIsBiometricsEnabled] = useState(true);
  const [isUnlocked, setIsUnlocked] = useState(false);
  
  // Track languages practiced for Polyglot badge
  const [languagesPracticed, setLanguagesPracticed] = useState<Set<string>>(new Set(["Swedish"]));

  // Badges state
  const [badges, setBadges] = useState<Badge[]>([
    {
      id: "first_steps",
      title: "First Steps",
      description: "Unlocked after completing your first practice activity.",
      icon: "first_steps",
      isUnlocked: false,
      requirementType: "lesson"
    },
    {
      id: "polyglot",
      title: "Polyglot Medal",
      description: "Practice lessons in at least 2 different supported languages.",
      icon: "polyglot",
      isUnlocked: false,
      requirementType: "polyglot"
    },
    {
      id: "chatterbox",
      title: "Chatterbox Medal",
      description: "Spend time conversing in AI Voice call or Chat modes.",
      icon: "chatterbox",
      isUnlocked: false,
      requirementType: "chatterbox"
    },
    {
      id: "perfect_score",
      title: "Perfect Score Medal",
      description: "Achieve 100% on a listening comprehension quiz.",
      icon: "perfect_score",
      isUnlocked: false,
      requirementType: "perfect_score"
    }
  ]);

  // Notifications or toast message for badge unlock
  const [activeBadgeToast, setActiveBadgeToast] = useState<string | null>(null);

  // Sync dark mode class with page HTML body for dark themes
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Check language changes for Polyglot Badge
  const handleLanguageChange = (lang: Language) => {
    setCurrentLanguage(lang);
    setLanguagesPracticed((prev) => {
      const next = new Set(prev);
      next.add(lang);
      if (next.size >= 2) {
        unlockBadge("polyglot");
      }
      return next;
    });
  };

  // Add XP
  const handleAddXp = (xp: number) => {
    setTotalXp((prev) => prev + xp);
  };

  // Unlock specific badge
  const unlockBadge = (id: string) => {
    setBadges((prev) =>
      prev.map((b) => {
        if (b.id === id && !b.isUnlocked) {
          setActiveBadgeToast(b.title);
          setTimeout(() => setActiveBadgeToast(null), 4000);
          handleAddXp(100); // 100 bonus XP for badge!
          return { ...b, isUnlocked: true, unlockedAt: new Date().toLocaleDateString() };
        }
        return b;
      })
    );
  };

  const handleQuizPerfectScore = () => {
    unlockBadge("perfect_score");
  };

  const handleCompleteActivity = () => {
    unlockBadge("first_steps");
    // Increment streak on completing lesson activity
    setStreak((prev) => prev + 1);
  };

  // Chat send or voice trigger check for Chatterbox
  useEffect(() => {
    // Simulate active minutes increments
    if (isUnlocked) {
      const chatterTimer = setTimeout(() => {
        unlockBadge("chatterbox");
      }, 30000); // Trigger Chatterbox easily for testing
      return () => clearTimeout(chatterTimer);
    }
  }, [isUnlocked]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans transition-colors duration-500 pb-12 select-none relative overflow-x-hidden">
      
      {/* Dynamic Background Gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Floating Badge Unlock Banner / Toast */}
      {activeBadgeToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 z-50 font-sans font-bold text-sm border border-indigo-500 animate-bounce">
          <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
          <span>Milestone Unlocked: {activeBadgeToast}! (+100 XP)</span>
        </div>
      )}

      {/* Main Layout Container */}
      <div className="w-full max-w-7xl mx-auto px-6 py-8 space-y-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-6 gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-none shrink-0">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                <span className="text-xs font-bold uppercase tracking-wider font-display">LingoJet Dev Sandbox</span>
              </div>
              <h1 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight leading-none text-slate-900 dark:text-white">
                Talkpal Language Learner
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                Multilingual Jetpack Compose Android platform simulation powered by server-side Gemini AI.
              </p>
            </div>
          </div>

          {/* Quick Info Box */}
          <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-2xl p-3.5 border border-indigo-100 dark:border-indigo-850 text-xs shadow-sm">
            <Sparkles className="w-5 h-5 shrink-0 text-amber-500 animate-pulse" />
            <span>Fully operational emulator with Swedish, English, Urdu, Turkish, Korean, and Chinese.</span>
          </div>
        </div>

        {/* Dual-Pane View: Phone Emulator & Kotlin Source Code Explorer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Phone Emulator Frame */}
          <div className="lg:col-span-5 flex justify-center sticky top-8">
            <AndroidFrame
              currentLanguage={currentLanguage}
              onLanguageChange={handleLanguageChange}
              streak={streak}
              totalXp={totalXp}
              onAddXp={handleAddXp}
              badges={badges}
              onQuizPerfectScore={handleQuizPerfectScore}
              onCompleteActivity={handleCompleteActivity}
              isDarkMode={isDarkMode}
              onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
              isOffline={isOffline}
              onToggleOffline={() => setIsOffline(!isOffline)}
              isBiometricsEnabled={isBiometricsEnabled}
              onToggleBiometrics={() => setIsBiometricsEnabled(!isBiometricsEnabled)}
              isUnlocked={isUnlocked}
              onUnlockDevice={() => setIsUnlocked(true)}
            />
          </div>

          {/* Right Column: Source Code Hub */}
          <div className="lg:col-span-7 space-y-6">
            <SourceCodeExplorer />
          </div>

        </div>

      </div>
    </div>
  );
}
