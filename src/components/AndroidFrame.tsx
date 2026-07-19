import { useState, useEffect } from "react";
import { Language, Badge } from "../types";
import LearnTab from "./Tabs/LearnTab";
import AIChatTab from "./Tabs/AIChatTab";
import AchievementsTab from "./Tabs/AchievementsTab";
import ProfileTab from "./Tabs/ProfileTab";
import { 
  Wifi, Battery, ShieldCheck, Lock, Unlock, Moon, Sun, 
  Home, BookOpen, MessageSquare, Trophy, User, Smartphone,
  Signal, Volume2, Sparkles, RefreshCw
} from "lucide-react";

interface AndroidFrameProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  streak: number;
  totalXp: number;
  onAddXp: (xp: number) => void;
  badges: Badge[];
  onQuizPerfectScore: () => void;
  onCompleteActivity: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  isOffline: boolean;
  onToggleOffline: () => void;
  isBiometricsEnabled: boolean;
  onToggleBiometrics: () => void;
  isUnlocked: boolean;
  onUnlockDevice: () => void;
}

export default function AndroidFrame({
  currentLanguage,
  onLanguageChange,
  streak,
  totalXp,
  onAddXp,
  badges,
  onQuizPerfectScore,
  onCompleteActivity,
  isDarkMode,
  onToggleDarkMode,
  isOffline,
  onToggleOffline,
  isBiometricsEnabled,
  onToggleBiometrics,
  isUnlocked,
  onUnlockDevice
}: AndroidFrameProps) {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState("");
  const [batteryLevel, setBatteryLevel] = useState(88);
  const [scanning, setScanning] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);

  // Update dynamic clock in status bar
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Simulating battery drain/charging
  useEffect(() => {
    const batteryInterval = setInterval(() => {
      setBatteryLevel((prev) => (prev > 10 ? prev - 1 : 100));
    }, 60000);
    return () => clearInterval(batteryInterval);
  }, []);

  const handleFingerprintScan = () => {
    if (scanning) return;
    setScanning(true);
    
    // Simulate biometric scanning duration
    setTimeout(() => {
      setScanSuccess(true);
      setTimeout(() => {
        onUnlockDevice();
        setScanning(false);
        setScanSuccess(false);
      }, 600);
    }, 1200);
  };

  return (
    <div id="android-device-frame" className="relative select-none">
      {/* Physical Phone Enclosure Border (Bezel) */}
      <div className="w-[380px] h-[780px] bg-slate-950 rounded-[52px] p-3 shadow-2xl relative border-4 border-slate-800 flex flex-col overflow-hidden ring-12 ring-slate-900/40">
        
        {/* Punch Hole Camera / Dynamic Island notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5.5 bg-black rounded-full z-50 flex items-center justify-center border border-slate-900 shadow-inner">
          <div className="w-2.5 h-2.5 bg-slate-950 rounded-full border border-slate-800/80 mr-12" />
          <div className="w-1.5 h-1.5 bg-blue-900/40 rounded-full" />
        </div>

        {/* Side physical button accents */}
        <div className="absolute left-[-6px] top-32 w-[3px] h-12 bg-slate-700 rounded-r" />
        <div className="absolute left-[-6px] top-48 w-[3px] h-12 bg-slate-700 rounded-r" />
        <div className="absolute right-[-6px] top-40 w-[3px] h-16 bg-slate-700 rounded-l" />

        {/* Inner Phone Screen Canvas */}
        <div className={`flex-1 rounded-[42px] overflow-hidden flex flex-col relative transition-colors duration-500 ${
          isDarkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-800"
        }`}>
          
          {/* 1. Android Status Bar */}
          <div className="h-9 shrink-0 flex items-center justify-between px-6 bg-transparent text-[11px] font-sans font-bold select-none z-40 relative">
            {/* Clock */}
            <span className={isDarkMode ? "text-slate-300" : "text-slate-600"}>{currentTime}</span>
            
            {/* System Status Indicators */}
            <div className="flex items-center gap-1.5">
              {isOffline ? (
                <span className="text-rose-500 text-[9px] uppercase tracking-wider font-extrabold flex items-center gap-0.5">
                  ✈ Offline
                </span>
              ) : (
                <Wifi className={`w-3.5 h-3.5 ${isDarkMode ? "text-slate-300" : "text-slate-600"}`} />
              )}
              <Signal className={`w-3.5 h-3.5 ${isDarkMode ? "text-slate-300" : "text-slate-600"}`} />
              
              <div className="flex items-center gap-1">
                <span className={`text-[10px] font-mono ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>{batteryLevel}%</span>
                <Battery className={`w-4 h-4 ${isDarkMode ? "text-slate-300" : "text-slate-600"}`} />
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* PHONE BODY CONTENTS (LOCKED VS UNLOCKED APP) */}
          {/* ------------------------------------------------------------- */}
          {!isUnlocked && isBiometricsEnabled ? (
            
            /* BIOMETRICS LOCK SCREEN FLOW */
            <div className="flex-1 flex flex-col justify-between p-6 pt-12 text-center text-slate-800 dark:text-slate-100 relative">
              {/* Background Glow */}
              <div className="absolute inset-0 bg-radial-gradient from-blue-500/5 to-transparent pointer-events-none" />

              <div className="space-y-2 mt-4 z-10">
                <h2 className="text-3xl font-sans font-extrabold tracking-tight">
                  {new Date().toLocaleDateString([], { weekday: "long", month: "short", day: "numeric" })}
                </h2>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest">LingoJet Secure Device</p>
              </div>

              {/* Secure notification snippet */}
              <div className="bg-white/70 dark:bg-slate-900/70 border border-slate-200/50 dark:border-slate-800/40 p-4 rounded-3xl mx-3 shadow-md backdrop-blur-sm z-10 flex gap-3 text-left text-xs items-center leading-relaxed">
                <div className="bg-emerald-500/10 text-emerald-500 p-2 rounded-xl">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-sans font-bold">Daily Goal Reminder!</h4>
                  <p className="text-[10px] text-slate-400">Keep up your {streak} days learning streak! Practice Swedish now.</p>
                </div>
              </div>

              {/* Interactive Biometric Fingerprint Trigger */}
              <div className="flex flex-col items-center gap-4 z-10 pb-8">
                <div className="relative flex items-center justify-center">
                  
                  {/* Glowing pulsing wave circles around fingerprint */}
                  <div className={`absolute w-24 h-24 rounded-full border transition-all duration-500 ${
                    scanSuccess 
                      ? "border-indigo-500 bg-indigo-500/20 scale-125" 
                      : scanning 
                      ? "border-indigo-400/40 bg-indigo-500/10 scale-110 animate-ping" 
                      : "border-slate-300 dark:border-slate-700 bg-slate-500/5 animate-pulse"
                  }`} />
                  
                  <button
                    onClick={handleFingerprintScan}
                    disabled={scanning}
                    className={`w-18 h-18 rounded-full flex items-center justify-center border shadow-xl transition-all cursor-pointer relative z-10 ${
                      scanSuccess 
                        ? "bg-indigo-600 border-indigo-500 text-white" 
                        : scanning 
                        ? "bg-indigo-500 border-indigo-400 text-white" 
                        : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    }`}
                  >
                    {scanSuccess ? <Unlock className="w-8 h-8" /> : <Lock className="w-8 h-8" />}
                  </button>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400">
                    {scanSuccess 
                      ? "Unlock Approved" 
                      : scanning 
                      ? "Scanning Fingerprint..." 
                      : "Tap to Unlock with Biometrics"
                    }
                  </p>
                  <p className="text-[10px] text-slate-400/80">Simulating Android Fingerprint Auth</p>
                </div>
              </div>
            </div>
          ) : (
            
            /* MAIN LINGOJET APP CODE ONCE UNLOCKED */
            <div className="flex-1 flex flex-col overflow-hidden relative">
              
              {/* Render Active Bottom Nav Tab Page */}
              <div className="flex-1 overflow-hidden">
                {activeTab === 0 && (
                  <LearnTab
                    currentLanguage={currentLanguage}
                    onLanguageChange={onLanguageChange}
                    streak={streak}
                    totalXp={totalXp}
                    onAddXp={onAddXp}
                    onQuizPerfectScore={onQuizPerfectScore}
                    onCompleteActivity={onCompleteActivity}
                    isOffline={isOffline}
                  />
                )}
                {activeTab === 1 && (
                  <AIChatTab currentLanguage={currentLanguage} />
                )}
                {activeTab === 2 && (
                  <AchievementsTab
                    badges={badges}
                    streak={streak}
                    totalXp={totalXp}
                  />
                )}
                {activeTab === 3 && (
                  <ProfileTab
                    currentLanguage={currentLanguage}
                    streak={streak}
                    totalXp={totalXp}
                    isDarkMode={isDarkMode}
                    onToggleDarkMode={onToggleDarkMode}
                    isOffline={isOffline}
                    onToggleOffline={onToggleOffline}
                    isBiometricsEnabled={isBiometricsEnabled}
                    onToggleBiometrics={onToggleBiometrics}
                  />
                )}
              </div>

              {/* 2. Material bottom navigation bar inside the screen */}
              <div className="absolute bottom-4 left-0 right-0 h-14 bg-white/95 dark:bg-slate-900/95 border-t border-slate-100 dark:border-slate-800/80 backdrop-blur-md px-3 flex items-center justify-around z-40">
                <button
                  onClick={() => setActiveTab(0)}
                  className={`flex flex-col items-center gap-0.5 text-[9px] font-extrabold py-1 cursor-pointer transition-colors ${
                    activeTab === 0 ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 hover:text-indigo-500"
                  }`}
                >
                  <BookOpen className="w-5 h-5" />
                  <span>Learn</span>
                </button>

                <button
                  onClick={() => setActiveTab(1)}
                  className={`flex flex-col items-center gap-0.5 text-[9px] font-extrabold py-1 cursor-pointer transition-colors ${
                    activeTab === 1 ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 hover:text-indigo-500"
                  }`}
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>AI Chat</span>
                </button>

                <button
                  onClick={() => setActiveTab(2)}
                  className={`flex flex-col items-center gap-0.5 text-[9px] font-extrabold py-1 cursor-pointer transition-colors ${
                    activeTab === 2 ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 hover:text-indigo-500"
                  }`}
                >
                  <Trophy className="w-5 h-5" />
                  <span>Badges</span>
                </button>

                <button
                  onClick={() => setActiveTab(3)}
                  className={`flex flex-col items-center gap-0.5 text-[9px] font-extrabold py-1 cursor-pointer transition-colors ${
                    activeTab === 3 ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 hover:text-indigo-500"
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span>Profile</span>
                </button>
              </div>

              {/* 3. Android Navigation Gesture Pill Bar */}
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-300 dark:bg-slate-700 rounded-full z-40 hover:bg-slate-400 cursor-pointer" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
