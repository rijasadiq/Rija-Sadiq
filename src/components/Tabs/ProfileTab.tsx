import { useState } from "react";
import { Language } from "../../types";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, 
  AreaChart, Area
} from "recharts";
import { 
  User, Mail, ToggleLeft, ToggleRight, Wifi, Cloud, ShieldCheck, 
  Moon, Sun, BarChart3, CloudLightning, RefreshCw, Smartphone
} from "lucide-react";

interface ProfileTabProps {
  currentLanguage: Language;
  streak: number;
  totalXp: number;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  isOffline: boolean;
  onToggleOffline: () => void;
  isBiometricsEnabled: boolean;
  onToggleBiometrics: () => void;
}

export default function ProfileTab({
  currentLanguage,
  streak,
  totalXp,
  isDarkMode,
  onToggleDarkMode,
  isOffline,
  onToggleOffline,
  isBiometricsEnabled,
  onToggleBiometrics
}: ProfileTabProps) {
  const [syncing, setSyncing] = useState(false);

  // Mock analytics data for Recharts
  const chartData = [
    { name: "Swedish", minutes: 120 },
    { name: "English", minutes: 75 },
    { name: "Urdu", minutes: 45 },
    { name: "Turkish", minutes: 90 },
    { name: "Korean", minutes: 180 },
    { name: "Chinese", minutes: 150 }
  ];

  const skillData = [
    { skill: "Speaking", score: 82 },
    { skill: "Listening", score: 95 },
    { skill: "Reading", score: 70 },
    { skill: "Writing", score: 64 }
  ];

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
    }, 2000);
  };

  const colors = ["#4f46e5", "#6366f1", "#818cf8", "#a5b4fc", "#c7d2fe", "#e0e7ff"];

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 p-4 space-y-5 pb-20 select-none custom-scrollbar">
      
      {/* Profile Header Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-5 shadow-sm flex items-center gap-4">
        <div className="w-14 h-14 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-display font-extrabold text-xl shadow-md border border-white/25 shrink-0">
          U
        </div>
        <div className="min-w-0">
          <h3 className="font-display font-extrabold text-base tracking-tight leading-none text-slate-800 dark:text-white truncate">User Account</h3>
          <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
            <Mail className="w-3 h-3 text-slate-400" />
            <span className="truncate">rijasadiq2023@gmail.com</span>
          </p>
          <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-800/40 px-2.5 py-1 rounded-full inline-block mt-2">
            Active Student
          </p>
        </div>
      </div>

      {/* Analytics Dashboard section */}
      <div className="space-y-3">
        <h4 className="font-display font-bold text-xs uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
          <BarChart3 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>Practice Analytics</span>
        </h4>

        {/* 1. Bar Chart: Study Minutes */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-4 shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <h5 className="font-display font-bold text-xs text-slate-800 dark:text-white">Learning Time (Minutes)</h5>
            <span className="text-[9px] text-slate-400 font-semibold font-mono">Total: 660 mins</span>
          </div>
          <div className="h-40 w-full text-[10px] font-sans">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 9 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 9 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: isDarkMode ? "#0f172a" : "#ffffff", 
                    borderColor: isDarkMode ? "#1e293b" : "#e2e8f0",
                    borderRadius: "12px",
                    fontSize: "10px"
                  }} 
                />
                <Bar dataKey="minutes" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Area Chart: Skill Strengths */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-4 shadow-sm space-y-3">
          <h5 className="font-display font-bold text-xs text-slate-800 dark:text-white">Core Skill Strengths</h5>
          <div className="h-32 w-full text-[10px] font-sans">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={skillData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                <XAxis dataKey="skill" tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 9 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 9 }} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: isDarkMode ? "#0f172a" : "#ffffff", 
                    borderColor: isDarkMode ? "#1e293b" : "#e2e8f0",
                    borderRadius: "12px",
                    fontSize: "10px"
                  }} 
                />
                <Area type="monotone" dataKey="score" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.15} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Settings Panel widgets */}
      <div className="space-y-3">
        <h4 className="font-display font-bold text-xs uppercase tracking-widest text-slate-400">System Preferences</h4>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-3 divide-y divide-slate-100 dark:divide-slate-800 space-y-3">
          {/* 1. Theme toggle */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-3">
              <div className="text-slate-400 dark:text-slate-500">
                {isDarkMode ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
              </div>
              <div>
                <p className="font-semibold text-xs text-slate-800 dark:text-slate-200">Device Dark Mode</p>
                <p className="text-[9px] text-slate-400">Updates virtual Android phone appearance</p>
              </div>
            </div>
            <button onClick={onToggleDarkMode} className="text-indigo-600 dark:text-indigo-400 hover:opacity-85 cursor-pointer">
              {isDarkMode ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8 text-slate-300" />}
            </button>
          </div>

          {/* 2. Biometric toggle */}
          <div className="flex items-center justify-between pt-3">
            <div className="flex items-center gap-3">
              <div className="text-slate-400">
                <ShieldCheck className="w-5 h-5 text-indigo-500" />
              </div>
              <div>
                <p className="font-semibold text-xs text-slate-800 dark:text-slate-200">Biometric Sign In</p>
                <p className="text-[9px] text-slate-400">Request fingerprint auth scan on startup</p>
              </div>
            </div>
            <button onClick={onToggleBiometrics} className="text-indigo-600 dark:text-indigo-400 hover:opacity-85 cursor-pointer">
              {isBiometricsEnabled ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8 text-slate-300" />}
            </button>
          </div>

          {/* 3. Offline Mode */}
          <div className="flex items-center justify-between pt-3">
            <div className="flex items-center gap-3">
              <div className="text-slate-400">
                <Wifi className={`w-5 h-5 ${isOffline ? "text-rose-500 animate-pulse" : "text-indigo-500"}`} />
              </div>
              <div>
                <p className="font-semibold text-xs text-slate-800 dark:text-slate-200">Offline Fallback Mode</p>
                <p className="text-[9px] text-slate-400">Bypasses API connections for raw local mock data</p>
              </div>
            </div>
            <button onClick={onToggleOffline} className="text-indigo-600 dark:text-indigo-400 hover:opacity-85 cursor-pointer">
              {isOffline ? <ToggleRight className="w-8 h-8 text-rose-500" /> : <ToggleLeft className="w-8 h-8 text-slate-300" />}
            </button>
          </div>
        </div>
      </div>

      {/* Cloud Synchronization and status buttons */}
      <div className="space-y-3">
        <h4 className="font-display font-bold text-xs uppercase tracking-widest text-slate-400">Cloud &amp; Device Integrity</h4>

        <button 
          onClick={handleSync}
          disabled={syncing}
          className="w-full flex items-center justify-center gap-2.5 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-2xl shadow-lg transition-all font-bold text-xs cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 text-indigo-200 ${syncing ? "animate-spin" : "animate-pulse"}`} />
          <span>{syncing ? "Synchronizing state..." : "Secure Cloud Synchronization"}</span>
        </button>
      </div>

    </div>
  );
}
