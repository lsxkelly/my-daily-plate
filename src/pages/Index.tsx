import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile, getTodayRecord, type UserProfile, type DayRecord } from "@/lib/storage";

const Index = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [today, setToday] = useState<DayRecord>({ date: '', foods: [], totalCalories: 0 });

  useEffect(() => {
    const p = getProfile();
    if (!p) {
      navigate('/setup');
      return;
    }
    setProfile(p);
    setToday(getTodayRecord());
  }, [navigate]);

  // Refresh when returning to page
  useEffect(() => {
    const handleFocus = () => {
      setToday(getTodayRecord());
      setProfile(getProfile());
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  if (!profile) return null;

  const ratio = Math.min(today.totalCalories / profile.dailyCalorieTarget, 1);
  const percentage = Math.round(ratio * 100);
  const isWarning = ratio >= 0.75;
  const isDanger = ratio >= 0.95;

  const getBarColor = () => {
    if (isDanger) return 'bg-destructive';
    if (isWarning) return 'bg-warning';
    return 'bg-primary';
  };

  const getStatusText = () => {
    if (isDanger) return '⚠️ 已接近上限！';
    if (isWarning) return '⚠️ 注意控制';
    if (ratio >= 0.5) return '💪 继续加油';
    return '🌱 开始记录今天的饮食吧';
  };

  return (
    <div className="min-h-screen bg-background flex flex-col safe-bottom">
      {/* Header */}
      <div className="px-5 pt-10 pb-2">
        <p className="text-muted-foreground text-sm">今天 · {new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' })}</p>
      </div>

      {/* Calorie Card */}
      <div className="px-5 animate-fade-in">
        <div className="bg-card rounded-2xl p-5 shadow-sm border border-border">
          <p className="text-sm text-muted-foreground mb-1">今日热量</p>
          <div className="flex items-baseline gap-1 mb-3">
            <span className="text-4xl font-bold text-foreground">{today.totalCalories}</span>
            <span className="text-muted-foreground text-sm">/ {profile.dailyCalorieTarget} kcal</span>
          </div>
          
          {/* Progress bar */}
          <div className="h-3 rounded-full bg-muted overflow-hidden mb-2">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${getBarColor()}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <p className={`text-xs ${isDanger ? 'text-destructive' : isWarning ? 'text-warning' : 'text-muted-foreground'}`}>
            {getStatusText()}
          </p>
        </div>
      </div>

      {/* Camera Button */}
      <div className="flex justify-center py-6">
        <button
          onClick={() => navigate('/camera')}
          className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg active:scale-95 transition-transform text-2xl"
        >
          📷
        </button>
      </div>

      {/* Today's Foods */}
      <div className="flex-1 px-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-foreground">今日已记录</h2>
          <span className="text-xs text-muted-foreground">{today.foods.length} 项</span>
        </div>
        
        {today.foods.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground text-sm">
            还没有记录，点击上方按钮开始拍照
          </div>
        ) : (
          <div className="space-y-2 animate-fade-in">
            {today.foods.map(food => (
              <div key={food.id} className="flex items-center justify-between bg-card rounded-xl px-4 py-3 border border-border">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{food.emoji}</span>
                  <div>
                    <p className="text-sm font-medium text-foreground">{food.name}</p>
                    <p className="text-xs text-muted-foreground">{food.weight}g</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-foreground">{food.calories} kcal</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Link */}
      <div className="px-5 py-4">
        <button
          onClick={() => navigate('/history')}
          className="w-full py-3 text-center text-sm text-primary font-medium rounded-xl bg-secondary active:bg-muted transition-colors"
        >
          查看最近 7 天 →
        </button>
      </div>
    </div>
  );
};

export default Index;
