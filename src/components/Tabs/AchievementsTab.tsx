import { Badge } from "../../types";
import { Award, Star, Flame, Trophy, CheckCircle, Lock, Calendar, Sparkles } from "lucide-react";

interface AchievementsTabProps {
  badges: Badge[];
  streak: number;
  totalXp: number;
}

export default function AchievementsTab({ badges, streak, totalXp }: AchievementsTabProps) {
  const unlockedCount = badges.filter((b) => b.isUnlocked).length;
  const percentage = Math.round((unlockedCount / badges.length) * 100);

  // Daily calendar representation for active streak
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const currentDayIndex = new Date().getDay(); // 0 is Sun, 1 is Mon...

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 p-4 space-y-5 pb-20 select-none custom-scrollbar">
      {/* Tab Header */}
      <div>
        <h3 className="font-display font-extrabold text-base tracking-tight">Achievements</h3>
        <p className="text-xs text-slate-400">Track your milestones and unlock medals</p>
      </div>

      {/* Progress Card */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-5 text-white shadow-lg space-y-4 relative overflow-hidden">
        <div className="absolute right-[-10px] top-[-10px] w-28 h-28 bg-white/10 rounded-full blur-xl" />
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-indigo-200 tracking-wider font-display">Unlocked Badges</span>
            <p className="font-sans font-extrabold text-2xl tracking-tight">{unlockedCount} / {badges.length}</p>
          </div>
          <div className="bg-white/10 border border-white/20 p-3 rounded-2xl">
            <Trophy className="w-6 h-6 text-yellow-300" />
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-1">
          <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden relative">
            <div 
              className="bg-yellow-300 h-full rounded-full transition-all duration-500" 
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-indigo-100 font-semibold pt-1">
            <span>{percentage}% Completed</span>
            <span>Level {Math.floor(totalXp / 100) + 1} Learner</span>
          </div>
        </div>
      </div>

      {/* Streak Dashboard widget */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-2">
          <div className="flex items-center gap-2">
            <Flame className="w-4.5 h-4.5 text-orange-500 fill-current animate-pulse" />
            <span className="font-display font-bold text-xs text-slate-800 dark:text-slate-200">Weekly Active Streak</span>
          </div>
          <span className="text-[10px] font-mono font-bold bg-orange-50 dark:bg-orange-950/20 text-orange-500 px-2.5 py-1 rounded-full border border-orange-100 dark:border-orange-900/40 shadow-sm">
            {streak} DAY STREAK
          </span>
        </div>

        {/* Week Days layout */}
        <div className="grid grid-cols-7 gap-1 pt-1 text-center">
          {days.map((day, idx) => {
            // Monday is index 1, Sunday is 0 in JS. Translate Sun to index 6
            const isToday = idx === (currentDayIndex === 0 ? 6 : currentDayIndex - 1);
            const isCompleted = idx < (currentDayIndex === 0 ? 6 : currentDayIndex - 1) || isToday;

            return (
              <div key={idx} className="space-y-2">
                <span className="text-[9px] text-slate-400 font-bold block">{day}</span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto text-xs font-extrabold transition-all ${
                  isCompleted 
                    ? "bg-orange-500 text-white shadow-md shadow-orange-100 dark:shadow-none" 
                    : isToday 
                    ? "bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-orange-500 text-slate-500 animate-pulse"
                    : "bg-slate-100 dark:bg-slate-800/60 text-slate-400 border border-slate-200/40 dark:border-slate-800/40"
                }`}>
                  {isCompleted ? <Flame className="w-3.5 h-3.5 fill-current" /> : "•"}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Badges Grid */}
      <div className="space-y-3">
        <h4 className="font-display font-bold text-xs uppercase tracking-widest text-slate-400">Achievements Medals</h4>
        
        <div className="grid grid-cols-1 gap-3">
          {badges.map((badge) => (
            <div 
              key={badge.id}
              className={`border rounded-3xl p-4 flex items-center justify-between transition-all ${
                badge.isUnlocked 
                  ? "bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-md" 
                  : "bg-slate-200/10 dark:bg-slate-900/30 border-slate-200/30 dark:border-slate-800/30 opacity-75"
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Badge Icon circle */}
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border shadow-inner ${
                  badge.isUnlocked 
                    ? "bg-indigo-50 dark:bg-indigo-950/40 border-indigo-100/30 dark:border-indigo-800/30 text-indigo-600 dark:text-indigo-400" 
                    : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400"
                }`}>
                  <Award className={`w-6 h-6 ${badge.isUnlocked && "animate-pulse"}`} />
                </div>
                <div>
                  <h5 className="font-display font-bold text-sm flex items-center gap-1.5 text-slate-800 dark:text-white">
                    <span>{badge.title}</span>
                    {badge.isUnlocked && (
                      <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
                    )}
                  </h5>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{badge.description}</p>
                </div>
              </div>

              {/* Status Lock Indicator */}
              <div>
                {badge.isUnlocked ? (
                  <CheckCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                ) : (
                  <div className="bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-full text-slate-400 border border-slate-200/30 dark:border-slate-700/50">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
