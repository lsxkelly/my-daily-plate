import { useNavigate } from "react-router-dom";
import { getRecentDays, getProfile } from "@/lib/storage";

const History = () => {
  const navigate = useNavigate();
  const days = getRecentDays(7);
  const profile = getProfile();
  const target = profile?.dailyCalorieTarget || 1800;

  const maxCal = Math.max(...days.map(d => d.totalCalories), target);

  return (
    <div className="min-h-screen bg-background flex flex-col safe-bottom">
      <div className="px-5 pt-10 pb-4">
        <button onClick={() => navigate('/')} className="text-sm text-primary mb-2">← 返回首页</button>
        <h1 className="text-xl font-bold text-foreground">最近 7 天</h1>
      </div>

      <div className="flex-1 px-5 animate-fade-in">
        {/* Calorie Chart */}
        <div className="bg-card rounded-2xl p-5 border border-border mb-5">
          <p className="text-sm font-medium text-foreground mb-4">热量趋势</p>
          <div className="flex items-end gap-2 h-32">
            {[...days].reverse().map((day, i) => {
              const h = maxCal > 0 ? (day.totalCalories / maxCal) * 100 : 0;
              const overTarget = day.totalCalories > target;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] text-muted-foreground">
                    {day.totalCalories > 0 ? day.totalCalories : '—'}
                  </span>
                  <div className="w-full flex flex-col justify-end" style={{ height: '80px' }}>
                    <div
                      className={`w-full rounded-t-md transition-all duration-500 ${
                        overTarget ? 'bg-warning' : 'bg-primary'
                      }`}
                      style={{ height: `${Math.max(h * 0.8, 2)}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(day.date).toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' })}
                  </span>
                </div>
              );
            })}
          </div>
          {/* Target line label */}
          <div className="flex items-center gap-2 mt-3">
            <div className="w-3 h-[2px] bg-muted-foreground" />
            <span className="text-[10px] text-muted-foreground">目标 {target} kcal</span>
          </div>
        </div>

        {/* Day List */}
        <div className="space-y-2">
          {days.map(day => (
            <div key={day.date} className="flex items-center justify-between bg-card rounded-xl px-4 py-3 border border-border">
              <div>
                <p className="text-sm font-medium text-foreground">
                  {new Date(day.date).toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })}
                </p>
                <p className="text-xs text-muted-foreground">{day.foods.length} 条记录</p>
              </div>
              <span className={`text-sm font-semibold ${
                day.totalCalories > target ? 'text-warning' : 'text-foreground'
              }`}>
                {day.totalCalories > 0 ? `${day.totalCalories} kcal` : '—'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 py-4">
        <button
          onClick={() => navigate('/')}
          className="w-full py-3 text-center text-sm font-medium rounded-xl bg-secondary text-secondary-foreground active:scale-[0.97] transition-transform"
        >
          返回首页
        </button>
      </div>
    </div>
  );
};

export default History;
