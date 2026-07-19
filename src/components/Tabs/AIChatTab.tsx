import { useState, useRef, useEffect } from "react";
import { Language, Message } from "../../types";
import { Send, Volume2, Sparkles, AlertCircle, Bot, User } from "lucide-react";

interface AIChatTabProps {
  currentLanguage: Language;
}

export default function AIChatTab({ currentLanguage }: AIChatTabProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const threadEndRef = useRef<HTMLDivElement>(null);

  // Initialize with a friendly welcome message based on language
  useEffect(() => {
    let greeting = "Hello! Let's chat and practice English today!";
    if (currentLanguage === "Swedish") greeting = "Hej! Låt oss chatta och öva på svenska idag!";
    else if (currentLanguage === "Urdu") greeting = "ہیلو! آئیے آج اردو میں بات چیت اور مشق کریں!";
    else if (currentLanguage === "Turkish") greeting = "Merhaba! Bugün Türkçe sohbet edelim ve pratik yapalım!";
    else if (currentLanguage === "Korean") greeting = "안녕하세요! 오늘 한국어로 대화하며 같이 연습해 봐요!";
    else if (currentLanguage === "Chinese") greeting = "你好！今天我们用中文聊天和练习吧！";

    setMessages([
      {
        id: "welcome",
        sender: "bot",
        text: greeting,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }
    ]);
  }, [currentLanguage]);

  // Scroll to bottom
  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Text-To-Speech
  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
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

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: input.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // Send chat history and current language to the server API
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          language: currentLanguage
        })
      });

      const data = await response.json();

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: "Sorry, I lost connection to the tutor server. Let's keep writing in local mode!",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 select-none pb-20">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-50 dark:bg-indigo-950/40 p-2 rounded-xl text-indigo-600 dark:text-indigo-400">
            <Bot className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-sans font-bold text-xs">AI Chat Companion</h3>
            <p className="text-[10px] text-slate-400 font-medium">Free talk practice in {currentLanguage}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-full px-2.5 py-0.5 text-[10px] font-bold border border-emerald-100 dark:border-emerald-900/40">
          <span>● Online</span>
        </div>
      </div>

      {/* Message Thread */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((m) => {
          const isUser = m.sender === "user";
          return (
            <div key={m.id} className={`flex gap-2.5 ${isUser ? "justify-end" : "justify-start"}`}>
              {/* Profile Bubble */}
              {!isUser && (
                <div className="w-7 h-7 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center shrink-0 text-xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              {/* Message bubble content */}
              <div className="max-w-[75%] space-y-1">
                <div className={`p-3 rounded-2xl text-xs leading-relaxed shadow-sm relative group ${
                  isUser 
                    ? "bg-indigo-600 text-white rounded-tr-none shadow-md shadow-indigo-100 dark:shadow-none" 
                    : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200/50 dark:border-slate-800/50 rounded-tl-none"
                }`}>
                  <p>{m.text}</p>
                  
                  {/* TTS button on bot reply */}
                  {!isUser && (
                    <button
                      onClick={() => speakText(m.text)}
                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 p-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-full transition-all cursor-pointer text-slate-500 hover:text-slate-700 dark:hover:text-slate-200"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                {/* Time indicators */}
                <div className={`text-[9px] text-slate-400 font-medium px-1 flex items-center gap-1 ${isUser ? "justify-end" : "justify-start"}`}>
                  <span>{m.timestamp}</span>
                  {!isUser && (
                    <button onClick={() => speakText(m.text)} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer">
                      🔊 Read
                    </button>
                  )}
                </div>
              </div>

              {isUser && (
                <div className="w-7 h-7 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full flex items-center justify-center shrink-0 text-xs">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}
        {loading && (
          <div className="flex gap-2.5 justify-start">
            <div className="w-7 h-7 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center shrink-0 text-xs">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200/50 dark:border-slate-800/50 p-3 rounded-2xl rounded-tl-none flex items-center gap-2 text-xs">
              <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" />
              <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
        <div ref={threadEndRef} />
      </div>

      {/* Chat Footer Input */}
      <div className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-3 shrink-0 flex items-center gap-2">
        <input
          type="text"
          placeholder={`Chat in ${currentLanguage}...`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 bg-slate-100 dark:bg-slate-800 border-none outline-none rounded-full py-2.5 px-4 text-xs text-slate-700 dark:text-slate-100 focus:ring-0 focus:outline-none"
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white p-2.5 rounded-full shadow-md shadow-indigo-100 dark:shadow-none transition-all cursor-pointer shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
