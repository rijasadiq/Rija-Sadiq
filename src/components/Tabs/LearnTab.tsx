import { useState, useEffect } from "react";
import { Language, TutorFeedback, StoryData, ListeningData } from "../../types";
import { 
  staticStories, 
  staticListenings, 
  writingScenarios, 
  debateTopics,
  WritingScenario,
  DebateTopic
} from "../../data/lessons";
import { 
  Mic, Play, Pause, Volume2, BookOpen, Edit2, CheckCircle2, AlertCircle, Sparkles, 
  ArrowLeft, ArrowRight, Star, ChevronDown, Languages, RotateCcw, Image, MessageSquare, 
  Activity, Eye, EyeOff, ThumbsUp, HelpCircle
} from "lucide-react";

interface LearnTabProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  streak: number;
  totalXp: number;
  onAddXp: (xp: number) => void;
  onQuizPerfectScore: () => void;
  onCompleteActivity: () => void;
  isOffline: boolean;
}

type Mode = "feed" | "speaking" | "listening" | "reading" | "writing";

export default function LearnTab({
  currentLanguage,
  onLanguageChange,
  streak,
  totalXp,
  onAddXp,
  onQuizPerfectScore,
  onCompleteActivity,
  isOffline
}: LearnTabProps) {
  const [activeMode, setActiveMode] = useState<Mode>("feed");
  const [showLangSelector, setShowLangSelector] = useState(false);

  // States for SPEAKING (AI Voice Call)
  const [voiceCallState, setVoiceCallState] = useState<"idle" | "connecting" | "connected">("idle");
  const [showTranscript, setShowTranscript] = useState(false);
  const [speakingUserInput, setSpeakingUserInput] = useState("");
  const [speakingHistory, setSpeakingHistory] = useState<Array<{ role: "tutor" | "user"; text: string }>>([]);
  const [speakingFeedback, setSpeakingFeedback] = useState<TutorFeedback | null>(null);
  const [loadingSpeaking, setLoadingSpeaking] = useState(false);

  // States for LISTENING (Comprehension Audio Quiz)
  const [listeningData, setListeningData] = useState<ListeningData>(staticListenings["Swedish"][0]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // States for READING (Interactive Bilingual Stories)
  const [storyData, setStoryData] = useState<StoryData>(staticStories["Swedish"][0]);
  const [selectedWord, setSelectedWord] = useState<any | null>(null);

  // States for WRITING (Photo description & Debates)
  const [writingSubMode, setWritingSubMode] = useState<"photo" | "debate">("photo");
  const [activeWritingScenario, setActiveWritingScenario] = useState<WritingScenario>(writingScenarios["Swedish"][0]);
  const [activeDebateTopic, setActiveDebateTopic] = useState<DebateTopic>(debateTopics["Swedish"][0]);
  const [photoDescriptionInput, setPhotoDescriptionInput] = useState("");
  const [debateThread, setDebateThread] = useState<Array<{ sender: "tutor" | "user"; text: string; feedback?: TutorFeedback }>>([]);
  const [debateUserInput, setDebateUserInput] = useState("");
  const [writingFeedback, setWritingFeedback] = useState<TutorFeedback | null>(null);
  const [loadingWriting, setLoadingWriting] = useState(false);

  // Sync state with selected language
  useEffect(() => {
    const defaultStory = staticStories[currentLanguage]?.[0] || staticStories["Swedish"][0];
    const defaultListening = staticListenings[currentLanguage]?.[0] || staticListenings["Swedish"][0];
    const defaultWriting = writingScenarios[currentLanguage]?.[0] || writingScenarios["Swedish"][0];
    const defaultDebate = debateTopics[currentLanguage]?.[0] || debateTopics["Swedish"][0];

    setStoryData(defaultStory);
    setListeningData(defaultListening);
    setActiveWritingScenario(defaultWriting);
    setActiveDebateTopic(defaultDebate);

    // Reset exercise progress
    setSpeakingHistory([]);
    setSpeakingFeedback(null);
    setSelectedQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
    setIsPlayingAudio(false);
    setAudioProgress(0);
    setSelectedWord(null);
    setPhotoDescriptionInput("");
    setWritingFeedback(null);
    setDebateThread([
      {
        sender: "tutor",
        text: defaultDebate.startingCounterargument
      }
    ]);
  }, [currentLanguage]);

  // Audio player timer
  useEffect(() => {
    let timer: any;
    if (isPlayingAudio) {
      timer = setInterval(() => {
        setAudioProgress((prev) => {
          if (prev >= 100) {
            setIsPlayingAudio(false);
            return 0;
          }
          return prev + 2;
        });
      }, 300);
    }
    return () => clearInterval(timer);
  }, [isPlayingAudio]);

  // Text-To-Speech simulation
  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      // Find matching language code
      let langCode = "en-US";
      if (currentLanguage === "Swedish") langCode = "sv-SE";
      else if (currentLanguage === "Urdu") langCode = "ur-PK";
      else if (currentLanguage === "Turkish") langCode = "tr-TR";
      else if (currentLanguage === "Korean") langCode = "ko-KR";
      else if (currentLanguage === "Chinese") langCode = "zh-CN";

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langCode;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Submit speaking answer (simulating speech recognition typing)
  const submitSpeakingAnswer = async () => {
    if (!speakingUserInput.trim()) return;
    
    const userText = speakingUserInput.trim();
    setSpeakingHistory((prev) => [...prev, { role: "user", text: userText }]);
    setSpeakingUserInput("");
    setLoadingSpeaking(true);

    try {
      const response = await fetch("/api/gemini/tutor-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userText,
          language: currentLanguage,
          contextMode: "Speaking (AI Voice Call Mode)",
          taskContext: `Conversation on daily life in ${currentLanguage}.`
        })
      });

      const feedback: TutorFeedback = await response.json();
      setSpeakingFeedback(feedback);
      setSpeakingHistory((prev) => [...prev, { role: "tutor", text: feedback.tutorResponse }]);
      
      // AI response spoken out loud
      speakText(feedback.tutorResponse);
      onAddXp(20);
      onCompleteActivity();
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingSpeaking(false);
    }
  };

  // Submit listening quiz
  const submitListeningQuiz = () => {
    let correctCount = 0;
    listeningData.questions.forEach((q, idx) => {
      if (selectedQuizAnswers[idx] === q.correctIndex) {
        correctCount++;
      }
    });

    const finalScore = Math.round((correctCount / listeningData.questions.length) * 100);
    setQuizScore(finalScore);
    setQuizSubmitted(true);

    if (finalScore === 100) {
      onQuizPerfectScore();
      onAddXp(50);
    } else {
      onAddXp(25);
    }
    onCompleteActivity();
  };

  // Submit Writing Drill
  const submitWritingDrill = async (text: string, type: "photo" | "debate") => {
    if (!text.trim()) return;
    setLoadingWriting(true);

    try {
      const context = type === "photo" ? "Writing (Photo Description Mode)" : "Writing (Debate Mode)";
      const task = type === "photo" 
        ? `Description of: ${activeWritingScenario.imageDescription}`
        : `Debate on topic: ${activeDebateTopic.topic}`;

      if (type === "debate") {
        setDebateThread((prev) => [...prev, { sender: "user", text }]);
        setDebateUserInput("");
      }

      const response = await fetch("/api/gemini/tutor-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userText: text,
          language: currentLanguage,
          contextMode: context,
          taskContext: task
        })
      });

      const feedback: TutorFeedback = await response.json();
      setWritingFeedback(feedback);

      if (type === "debate") {
        setDebateThread((prev) => [
          ...prev, 
          { sender: "tutor", text: feedback.tutorResponse, feedback: feedback }
        ]);
        speakText(feedback.tutorResponse);
      } else {
        onAddXp(30);
      }
      onCompleteActivity();
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingWriting(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto custom-scrollbar bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 pb-20 select-none">
      
      {/* ------------------------------------------------------------- */}
      {/* MAIN PRACTICE FEED */}
      {/* ------------------------------------------------------------- */}
      {activeMode === "feed" && (
        <div className="p-4 space-y-5">
          {/* Top Bar with Language Selector and Streak */}
          <div className="flex items-center justify-between">
            <div className="relative">
              <button 
                onClick={() => setShowLangSelector(!showLangSelector)}
                className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full py-2 px-4 shadow-sm hover:bg-slate-200 dark:hover:bg-slate-800 transition-all text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                <span>
                  {currentLanguage === "Swedish" && "🇸🇪 Swedish"}
                  {currentLanguage === "English" && "🇬🇧 English"}
                  {currentLanguage === "Urdu" && "🇵🇰 Urdu"}
                  {currentLanguage === "Turkish" && "🇹🇷 Turkish"}
                  {currentLanguage === "Korean" && "🇰🇷 Korean"}
                  {currentLanguage === "Chinese" && "🇨🇳 Chinese"}
                </span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {showLangSelector && (
                <div className="absolute top-11 left-0 w-36 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden flex flex-col py-1">
                  {(["Swedish", "English", "Urdu", "Turkish", "Korean", "Chinese"] as Language[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        onLanguageChange(lang);
                        setShowLangSelector(false);
                      }}
                      className="w-full text-left py-2 px-4 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs transition-colors flex items-center gap-2 font-medium cursor-pointer"
                    >
                      <span>
                        {lang === "Swedish" && "🇸🇪"}
                        {lang === "English" && "🇬🇧"}
                        {lang === "Urdu" && "🇵🇰"}
                        {lang === "Turkish" && "🇹🇷"}
                        {lang === "Korean" && "🇰🇷"}
                        {lang === "Chinese" && "🇨🇳"}
                      </span>
                      <span>{lang}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Streak & XP Display */}
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1 bg-orange-50 dark:bg-orange-950/20 px-3 py-1.5 rounded-full border border-orange-100 dark:border-orange-900/40 text-orange-500 font-bold text-xs shadow-sm animate-pulse">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{streak} Days</span>
              </div>
              <div className="flex items-center gap-1 bg-indigo-50 dark:bg-indigo-950/20 px-3 py-1.5 rounded-full border border-indigo-100 dark:border-indigo-900/40 text-indigo-600 dark:text-indigo-400 font-bold text-xs shadow-sm">
                <span>{totalXp} XP</span>
              </div>
            </div>
          </div>

          {/* Quick Stats Dashboard */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-5 text-white shadow-lg space-y-2 relative overflow-hidden">
            <div className="absolute right-[-15px] top-[-15px] w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-200 animate-pulse" />
              <span className="text-xs uppercase font-bold tracking-wider text-indigo-100 font-display">Ready to Learn</span>
            </div>
            <h2 className="font-display font-extrabold text-2xl tracking-tight leading-none">Level Up Your {currentLanguage}!</h2>
            <p className="text-xs text-indigo-100/90 leading-relaxed max-w-[85%]">
              Practice all four key components (Speaking, Listening, Reading, and Writing) with real-time AI guidance.
            </p>
          </div>

          {/* Practice Skills Feed */}
          <div className="space-y-4">
            <h3 className="font-sans font-bold text-sm tracking-wide uppercase text-slate-400 dark:text-slate-500">Core Practices</h3>
            
            {/* 1. Speaking Card */}
            <div 
              onClick={() => setActiveMode("speaking")}
              className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between border-l-4 border-l-blue-500"
            >
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 p-3.5 rounded-2xl">
                  <Mic className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-sans font-bold text-sm">Speaking Mode</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Simulated AI Voice Call & transcripts</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </div>

            {/* 2. Listening Card */}
            <div 
              onClick={() => setActiveMode("listening")}
              className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between border-l-4 border-l-indigo-500"
            >
              <div className="flex items-center gap-4">
                <div className="bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 p-3.5 rounded-2xl">
                  <Volume2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-sans font-bold text-sm">Listening Mode</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Dialogue Comprehension Quiz</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </div>

            {/* 3. Reading Card */}
            <div 
              onClick={() => setActiveMode("reading")}
              className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between border-l-4 border-l-emerald-500"
            >
              <div className="flex items-center gap-4">
                <div className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 p-3.5 rounded-2xl">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-sans font-bold text-sm">Reading Mode</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Stories with Tap-to-Translate</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </div>

            {/* 4. Writing Card */}
            <div 
              onClick={() => setActiveMode("writing")}
              className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between border-l-4 border-l-pink-500"
            >
              <div className="flex items-center gap-4">
                <div className="bg-pink-100 dark:bg-pink-900/40 text-pink-600 dark:text-pink-400 p-3.5 rounded-2xl">
                  <Edit2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-sans font-bold text-sm">Writing Mode</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Photo Descriptions &amp; Debates</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </div>
          </div>
        </div>
      )}


      {/* ------------------------------------------------------------- */}
      {/* 1. SPEAKING MODE (AI Voice Call) */}
      {/* ------------------------------------------------------------- */}
      {activeMode === "speaking" && (
        <div className="p-4 space-y-5 flex flex-col h-full">
          <div className="flex items-center gap-3">
            <button onClick={() => { setActiveMode("feed"); setVoiceCallState("idle"); }} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl cursor-pointer">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h3 className="font-sans font-bold text-base">Speaking Practice</h3>
          </div>

          {voiceCallState === "idle" ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-6 py-12">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-8 rounded-full">
                <Mic className="w-16 h-16 text-blue-500" />
              </div>
              <div className="text-center space-y-2 px-4">
                <h4 className="font-sans font-extrabold text-xl">Start your AI Voice Call</h4>
                <p className="text-xs text-slate-500 max-w-[80%] mx-auto leading-relaxed">
                  Call LingoJet's tutor to converse in {currentLanguage}. Practice speaking and listening.
                </p>
              </div>
              <button 
                onClick={() => {
                  setVoiceCallState("connecting");
                  setTimeout(() => {
                    setVoiceCallState("connected");
                    setSpeakingHistory([
                      { role: "tutor", text: currentLanguage === "Swedish" ? "Hej! Hur mår du idag? Let's talk!" : "Hello! How are you doing today? Let's talk!" }
                    ]);
                  }, 1500);
                }}
                className="bg-blue-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-blue-600 transition-all cursor-pointer text-sm"
              >
                Connect to AI Tutor
              </button>
            </div>
          ) : voiceCallState === "connecting" ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-6">
              <div className="relative flex items-center justify-center">
                <div className="absolute w-24 h-24 bg-blue-500/20 rounded-full animate-ping" />
                <div className="absolute w-32 h-32 bg-blue-500/10 rounded-full animate-pulse" />
                <div className="bg-blue-500 p-6 rounded-full relative z-10 text-white">
                  <Activity className="w-10 h-10 animate-spin" />
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold animate-pulse text-blue-500">Establishing real-time link...</p>
                <p className="text-xs text-slate-400 mt-1">Connecting securely to Gemini LLM</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col space-y-4">
              {/* Pulsing Audio Sphere */}
              <div className="bg-slate-900/5 dark:bg-white/5 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 flex flex-col items-center justify-center py-8">
                <div className="relative flex items-center justify-center w-28 h-28 bg-blue-500/10 dark:bg-blue-500/20 rounded-full">
                  <div className="absolute w-full h-full bg-blue-500/30 rounded-full animate-ping opacity-30" />
                  <div className="bg-blue-500 text-white p-5 rounded-full relative z-10">
                    <Volume2 className="w-8 h-8 animate-bounce" />
                  </div>
                </div>
                <div className="text-center mt-4">
                  <p className="text-xs uppercase font-extrabold text-blue-500 tracking-widest animate-pulse">Live Audio Active</p>
                  <p className="text-xs text-slate-400 mt-1">Tutor response speaking in {currentLanguage}</p>
                </div>
              </div>

              {/* Transcript Reveal Toggle */}
              <div className="flex justify-center">
                <button
                  onClick={() => setShowTranscript(!showTranscript)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  {showTranscript ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showTranscript ? "Hide Live Transcript" : "Show Live Transcript"}</span>
                </button>
              </div>

              {/* Transcript Thread */}
              {showTranscript && (
                <div className="bg-slate-100 dark:bg-slate-900/60 rounded-2xl p-3 border border-slate-200/50 dark:border-slate-800/40 max-h-36 overflow-y-auto space-y-2 text-xs custom-scrollbar">
                  {speakingHistory.map((h, idx) => (
                    <div key={idx} className={`flex ${h.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`p-2 rounded-xl max-w-[85%] ${h.role === "user" ? "bg-blue-500 text-white" : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-700"}`}>
                        <strong>{h.role === "user" ? "You" : "Tutor"}:</strong> {h.text}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Real-time speech feedback card if available */}
              {speakingFeedback && (
                <FeedbackCard feedback={speakingFeedback} />
              )}

              {/* Simulated microphone typing for iframe environment */}
              <div className="flex-1" />
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-3 flex items-center gap-2 shadow-inner">
                <input
                  type="text"
                  placeholder={`Reply in ${currentLanguage}...`}
                  value={speakingUserInput}
                  onChange={(e) => setSpeakingUserInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submitSpeakingAnswer()}
                  className="flex-1 bg-transparent border-none text-xs outline-none px-2 text-slate-700 dark:text-slate-100 focus:ring-0"
                />
                <button
                  onClick={submitSpeakingAnswer}
                  disabled={loadingSpeaking || !speakingUserInput.trim()}
                  className="bg-blue-500 hover:bg-blue-600 disabled:opacity-40 text-white p-2.5 rounded-full transition-all cursor-pointer shrink-0"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}


      {/* ------------------------------------------------------------- */}
      {/* 2. LISTENING MODE (Dialogue & Quiz) */}
      {/* ------------------------------------------------------------- */}
      {activeMode === "listening" && (
        <div className="p-4 space-y-5 flex flex-col h-full">
          <div className="flex items-center gap-3">
            <button onClick={() => setActiveMode("feed")} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl cursor-pointer">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h3 className="font-sans font-bold text-base">Listening Practice</h3>
          </div>

          {/* Player Controller */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-2xl transition-transform hover:scale-105 shadow-md cursor-pointer shrink-0"
              >
                {isPlayingAudio ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
              </button>
              <div className="flex-1 min-w-0">
                <h4 className="font-sans font-bold text-sm text-slate-800 dark:text-white truncate">{listeningData.title}</h4>
                <p className="text-xs text-slate-400 mt-0.5 truncate">Scenario Audio Player</p>
              </div>
            </div>

            {/* Play Bar */}
            <div className="space-y-1">
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden relative cursor-pointer">
                <div 
                  className="bg-indigo-500 h-full rounded-full transition-all duration-300" 
                  style={{ width: `${audioProgress}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-mono font-semibold">
                <span>0:{Math.floor(audioProgress * 0.3).toString().padStart(2, '0')}</span>
                <span>0:30</span>
              </div>
            </div>

            {/* Dialogue Scenario box */}
            <p className="text-xs text-slate-500 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
              <span className="font-bold text-slate-700 dark:text-slate-300">Setting:</span> {listeningData.audioScenarioDescription}
            </p>
          </div>

          {/* Dialogue text reveals if user plays or requests help */}
          <details className="bg-indigo-500/5 border border-indigo-500/10 rounded-2xl p-3 text-xs">
            <summary className="font-semibold text-indigo-500 cursor-pointer outline-none">Show Dialogue Transcript &amp; Translations</summary>
            <div className="space-y-2 mt-2 pt-2 border-t border-indigo-500/10">
              {listeningData.dialogue.map((line, idx) => (
                <div key={idx} className="space-y-0.5">
                  <span className="font-extrabold text-indigo-500 text-[10px] uppercase tracking-wider">{line.speaker}: </span>
                  <p className="text-slate-700 dark:text-slate-300 italic">"{line.text}"</p>
                  <p className="text-[10px] text-slate-400">({line.translation})</p>
                </div>
              ))}
            </div>
          </details>

          {/* Comprehension Quiz Questions */}
          <div className="space-y-4">
            <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-slate-400">Comprehension Quiz</h4>
            {listeningData.questions.map((q, qIdx) => (
              <div key={qIdx} className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-4 shadow-sm space-y-3">
                <p className="font-bold text-xs text-slate-800 dark:text-white">{qIdx + 1}. {q.question}</p>
                <div className="grid grid-cols-1 gap-2">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = selectedQuizAnswers[qIdx] === optIdx;
                    const isCorrect = optIdx === q.correctIndex;
                    let optionStyle = "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50";
                    if (isSelected) {
                      optionStyle = "bg-indigo-500/10 border-indigo-500 text-indigo-500 dark:text-indigo-400 font-bold";
                    }
                    if (quizSubmitted) {
                      if (isCorrect) {
                        optionStyle = "bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold";
                      } else if (isSelected) {
                        optionStyle = "bg-rose-500/10 border-rose-500 text-rose-600 dark:text-rose-400 font-bold";
                      } else {
                        optionStyle = "opacity-50 border-slate-200 dark:border-slate-800";
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={quizSubmitted}
                        onClick={() => setSelectedQuizAnswers(prev => ({ ...prev, [qIdx]: optIdx }))}
                        className={`text-left text-xs p-3 rounded-2xl border transition-all cursor-pointer ${optionStyle}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
                {quizSubmitted && selectedQuizAnswers[qIdx] !== undefined && (
                  <div className="text-[11px] leading-relaxed flex gap-2 border-t border-slate-100 dark:border-slate-800 pt-2 mt-1">
                    {selectedQuizAnswers[qIdx] === q.correctIndex ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                    )}
                    <div>
                      <span className="font-bold">{selectedQuizAnswers[qIdx] === q.correctIndex ? "Correct!" : "Incorrect."}</span> {q.explanation}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Submit / Reset Buttons */}
            {!quizSubmitted ? (
              <button
                onClick={submitListeningQuiz}
                disabled={Object.keys(selectedQuizAnswers).length < listeningData.questions.length}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg transition-all cursor-pointer text-xs"
              >
                Submit Answers
              </button>
            ) : (
              <div className="space-y-3">
                <div className="bg-slate-900 border border-slate-800 text-center p-4 rounded-3xl">
                  <p className="text-xs text-slate-400">Comprehension Quiz Score</p>
                  <p className={`text-2xl font-extrabold mt-1 ${quizScore === 100 ? "text-emerald-400" : "text-amber-400"}`}>
                    {quizScore}% Score
                  </p>
                  {quizScore === 100 && (
                    <p className="text-[10px] text-emerald-300 mt-1 flex items-center justify-center gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-300 animate-pulse" />
                      Perfect Score Badge Unlocked! (+50 XP)
                    </p>
                  )}
                </div>
                <button
                  onClick={() => {
                    setSelectedQuizAnswers({});
                    setQuizSubmitted(false);
                    setQuizScore(null);
                    setAudioProgress(0);
                    setIsPlayingAudio(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold py-3 px-6 rounded-2xl transition-all cursor-pointer text-xs"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Retry Quiz</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}


      {/* ------------------------------------------------------------- */}
      {/* 3. READING MODE (Stories with Tap-To-Translate) */}
      {/* ------------------------------------------------------------- */}
      {activeMode === "reading" && (
        <div className="p-4 space-y-5 flex flex-col h-full">
          <div className="flex items-center gap-3">
            <button onClick={() => setActiveMode("feed")} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl cursor-pointer">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h3 className="font-sans font-bold text-base">Reading Practice</h3>
          </div>

          {/* Story Container */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-5 shadow-sm space-y-4">
            <div className="space-y-1">
              <h4 className="font-sans font-extrabold text-base text-emerald-500 dark:text-emerald-400">{storyData.title}</h4>
              <p className="text-xs text-slate-400 font-medium italic">({storyData.titleTranslation})</p>
            </div>

            {/* Read instruction */}
            <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl p-3 text-[11px] leading-relaxed">
              <HelpCircle className="w-4 h-4 shrink-0" />
              <span>Tap on any word below to see its English translation, pronunciation guide, and grammar notes.</span>
            </div>

            {/* Render Story text with tap-to-translate */}
            <div className="text-sm leading-relaxed tracking-wide text-slate-700 dark:text-slate-200 font-serif pt-2 whitespace-pre-wrap">
              {storyData.storyText.split(" ").map((word, idx) => {
                const cleanedWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").toLowerCase();
                const matchedWordObj = storyData.wordTranslations.find(
                  (w) => w.word.toLowerCase() === cleanedWord
                );

                return (
                  <span
                    key={idx}
                    onClick={() => matchedWordObj && setSelectedWord(matchedWordObj)}
                    className={`inline-block mr-1.5 cursor-pointer select-none rounded px-0.5 transition-colors ${
                      matchedWordObj 
                        ? "underline decoration-dotted decoration-emerald-400 hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium" 
                        : "hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    {word}
                  </span>
                );
              })}
            </div>

            {/* Standard story translation box */}
            <details className="bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800/50 rounded-2xl p-3 text-xs leading-relaxed">
              <summary className="font-semibold text-slate-500 cursor-pointer outline-none">Show English Story Translation</summary>
              <p className="mt-2 text-slate-600 dark:text-slate-300 italic pt-2 border-t border-slate-200/50 dark:border-slate-800/50">
                {storyData.storyTranslation}
              </p>
            </details>
          </div>

          {/* Popup Translation Widget */}
          {selectedWord && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-4 shadow-sm relative overflow-hidden animate-slide-in">
              <button 
                onClick={() => setSelectedWord(null)} 
                className="absolute top-3 right-3 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-emerald-500 tracking-widest">Selected Word</span>
                <h5 className="font-sans font-extrabold text-lg text-emerald-600 dark:text-emerald-400">{selectedWord.word}</h5>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-3 border-t border-emerald-500/10 pt-3 text-xs">
                <div>
                  <p className="font-bold text-slate-400 text-[10px] uppercase">English Translation</p>
                  <p className="font-semibold text-slate-800 dark:text-white mt-0.5">{selectedWord.translation}</p>
                </div>
                <div>
                  <p className="font-bold text-slate-400 text-[10px] uppercase">Pronunciation</p>
                  <p className="font-mono text-slate-800 dark:text-white mt-0.5 flex items-center gap-1">
                    <span>/{selectedWord.pronunciation}/</span>
                    <button onClick={() => speakText(selectedWord.word)} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full cursor-pointer">
                      <Volume2 className="w-3.5 h-3.5 text-emerald-500" />
                    </button>
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="font-bold text-slate-400 text-[10px] uppercase">Grammar / Context Notes</p>
                  <p className="text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{selectedWord.explanation}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex-1" />
          <button
            onClick={() => {
              onAddXp(20);
              onCompleteActivity();
              setActiveMode("feed");
            }}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg transition-all cursor-pointer text-xs"
          >
            Mark Story as Completed (+20 XP)
          </button>
        </div>
      )}


      {/* ------------------------------------------------------------- */}
      {/* 4. WRITING MODE (Photo & Debate) */}
      {/* ------------------------------------------------------------- */}
      {activeMode === "writing" && (
        <div className="p-4 space-y-5 flex flex-col h-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setActiveMode("feed")} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl cursor-pointer">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h3 className="font-sans font-bold text-base">Writing Practice</h3>
            </div>
          </div>

          {/* Sub-mode selections */}
          <div className="flex bg-slate-100 dark:bg-slate-900 rounded-2xl p-1 border border-slate-200/50 dark:border-slate-800/50">
            <button
              onClick={() => { setWritingSubMode("photo"); setWritingFeedback(null); }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                writingSubMode === "photo" 
                  ? "bg-white dark:bg-slate-800 text-pink-500 shadow-sm" 
                  : "text-slate-500"
              }`}
            >
              <Image className="w-3.5 h-3.5" />
              <span>Photo Describe</span>
            </button>
            <button
              onClick={() => { setWritingSubMode("debate"); setWritingFeedback(null); }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                writingSubMode === "debate" 
                  ? "bg-white dark:bg-slate-800 text-pink-500 shadow-sm" 
                  : "text-slate-500"
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>AI Debate</span>
            </button>
          </div>

          {/* SUB-MODE A: PHOTO DESCRIPTION */}
          {writingSubMode === "photo" && (
            <div className="space-y-4">
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl overflow-hidden shadow-sm">
                <img 
                  src={activeWritingScenario.imageUrl} 
                  alt="Drill Context" 
                  referrerPolicy="no-referrer"
                  className="w-full h-44 object-cover"
                />
                <div className="p-4 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-pink-500 tracking-wider">Describe the Photo</span>
                  <p className="text-xs font-bold leading-relaxed">{activeWritingScenario.prompt}</p>
                </div>
              </div>

              {/* Real-time tutor response for photo drill */}
              {writingFeedback && (
                <FeedbackCard feedback={writingFeedback} />
              )}

              {/* Input text box */}
              {!writingFeedback ? (
                <div className="space-y-3">
                  <textarea
                    rows={3}
                    placeholder={`Write your description in ${currentLanguage}...`}
                    value={photoDescriptionInput}
                    onChange={(e) => setPhotoDescriptionInput(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 text-xs outline-none focus:ring-1 focus:ring-pink-500 font-sans leading-relaxed text-slate-800 dark:text-slate-100"
                  />
                  <button
                    onClick={() => submitWritingDrill(photoDescriptionInput, "photo")}
                    disabled={loadingWriting || !photoDescriptionInput.trim()}
                    className="w-full bg-pink-500 hover:bg-pink-600 disabled:opacity-40 text-white font-bold py-3.5 rounded-2xl shadow-lg transition-all cursor-pointer text-xs flex items-center justify-center gap-2"
                  >
                    {loadingWriting ? (
                      <>
                        <Activity className="w-4 h-4 animate-spin" />
                        <span>Analyzing with AI Tutor...</span>
                      </>
                    ) : (
                      <span>Submit for Evaluation</span>
                    )}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setPhotoDescriptionInput("");
                    setWritingFeedback(null);
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold py-3.5 rounded-2xl transition-all cursor-pointer text-xs"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Try Another Photo</span>
                </button>
              )}
            </div>
          )}

          {/* SUB-MODE B: DEBATE BATTLE */}
          {writingSubMode === "debate" && (
            <div className="space-y-4 flex flex-col flex-1">
              <div className="bg-slate-900 text-slate-100 border border-slate-800 p-4 rounded-3xl space-y-1.5 shadow-sm">
                <span className="text-[10px] uppercase font-bold text-pink-400 tracking-wider">Debate Topic</span>
                <h4 className="font-sans font-extrabold text-sm">{activeDebateTopic.topic}</h4>
                <p className="text-[10px] text-slate-400 leading-relaxed">{activeDebateTopic.description}</p>
              </div>

              {/* Debate Conversation Feed */}
              <div className="flex-1 space-y-3 max-h-56 overflow-y-auto custom-scrollbar pr-1 bg-slate-100/50 dark:bg-slate-900/10 p-3 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                {debateThread.map((line, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className={`flex ${line.sender === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`p-2.5 rounded-2xl text-xs max-w-[85%] leading-relaxed ${
                        line.sender === "user" 
                          ? "bg-pink-500 text-white shadow-sm" 
                          : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                      }`}>
                        <strong>{line.sender === "user" ? "You" : "AI Debater"}:</strong> {line.text}
                      </div>
                    </div>
                    {/* Render Tutor Correction for user's thread lines */}
                    {line.feedback && (
                      <div className="pl-4">
                        <FeedbackCard feedback={line.feedback} />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Typing area */}
              <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 rounded-3xl shadow-inner mt-auto">
                <input
                  type="text"
                  placeholder={`Write your counterargument in ${currentLanguage}...`}
                  value={debateUserInput}
                  onChange={(e) => setDebateUserInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submitWritingDrill(debateUserInput, "debate")}
                  className="flex-1 bg-transparent border-none outline-none text-xs text-slate-700 dark:text-slate-100 focus:ring-0 focus:outline-none"
                />
                <button
                  onClick={() => submitWritingDrill(debateUserInput, "debate")}
                  disabled={loadingWriting || !debateUserInput.trim()}
                  className="bg-pink-500 hover:bg-pink-600 disabled:opacity-40 text-white p-2 rounded-full transition-colors cursor-pointer"
                >
                  {loadingWriting ? <Activity className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}

// -------------------------------------------------------------
// SEPARATE TUTOR FEEDBACK COMPONENT (CARD-STYLE)
// -------------------------------------------------------------
function FeedbackCard({ feedback }: { feedback: TutorFeedback }) {
  const score = feedback.accuracyScore;
  let scoreColor = "text-rose-500 border-rose-500/20 bg-rose-500/5";
  if (score >= 85) scoreColor = "text-emerald-500 border-emerald-500/20 bg-emerald-500/5";
  else if (score >= 65) scoreColor = "text-amber-500 border-amber-500/20 bg-amber-500/5";

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-4 shadow-sm space-y-4 animate-slide-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4.5 h-4.5 text-amber-500 animate-pulse" />
          <span className="font-sans font-bold text-xs">AI Tutor feedback</span>
        </div>
        <div className={`flex items-center gap-1 border px-2.5 py-0.5 rounded-full text-xs font-bold ${scoreColor}`}>
          <span>Accuracy:</span>
          <span className="font-mono">{score}%</span>
        </div>
      </div>

      {/* Corrected Text preview */}
      <div className="space-y-1">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Corrected Text</p>
        <p className="text-xs font-bold text-slate-800 dark:text-white leading-relaxed">
          {feedback.correctedText}
        </p>
      </div>

      {/* Phonetic transcription for speaking if exists */}
      {feedback.pronunciationPhonetics && (
        <div className="space-y-0.5 bg-slate-50 dark:bg-slate-800/30 p-2.5 rounded-2xl border border-slate-100 dark:border-slate-800 text-[11px]">
          <span className="font-bold text-slate-400 uppercase text-[9px] tracking-wider block">Pronunciation Phonetics</span>
          <span className="font-mono text-slate-600 dark:text-slate-300">/{feedback.pronunciationPhonetics}/</span>
        </div>
      )}

      {/* Red/Green spelling & grammar corrections block */}
      {feedback.hasCorrections && feedback.correctionsList && feedback.correctionsList.length > 0 && (
        <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Grammar corrections</p>
          <div className="space-y-2">
            {feedback.correctionsList.map((item, idx) => (
              <div key={idx} className="text-xs border-l-2 border-l-amber-400 pl-3 py-0.5 space-y-1">
                <div className="flex items-center flex-wrap gap-2 text-[11px]">
                  <span className="text-rose-500 line-through font-semibold">"{item.original}"</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                  <span className="text-emerald-500 font-bold">"{item.corrected}"</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  {item.explanation}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Vocabulary Upgrades */}
      {feedback.vocabUpgrades && feedback.vocabUpgrades.length > 0 && (
        <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Vocabulary Upgrades</p>
          <div className="space-y-2">
            {feedback.vocabUpgrades.map((item, idx) => (
              <div key={idx} className="text-xs border-l-2 border-l-emerald-500 pl-3 py-0.5 space-y-1">
                <div className="flex items-center flex-wrap gap-2 text-[11px]">
                  <span className="text-slate-400 italic">Instead of "{item.originalWord}", try:</span>
                  <span className="text-emerald-500 font-extrabold">"{item.suggestedWord}"</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  {item.explanation}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
