import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveProfile, calculateDailyCalories, UserProfile } from "@/lib/storage";

const Setup = () => {
  const navigate = useNavigate();
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState(25);
  const [height, setHeight] = useState(170);
  const [currentWeight, setCurrentWeight] = useState(70);
  const [targetWeight, setTargetWeight] = useState(60);
  const [days, setDays] = useState(60);
  const [activityLevel, setActivityLevel] = useState<UserProfile['activityLevel']>('light');

  const handleSubmit = () => {
    const params = { gender, age, height, currentWeight, targetWeight, days, activityLevel };
    const dailyCalorieTarget = calculateDailyCalories(params);
    saveProfile({ ...params, dailyCalorieTarget, createdAt: new Date().toISOString() });
    navigate('/');
  };

  const activities = [
    { value: 'sedentary' as const, label: '久坐不动' },
    { value: 'light' as const, label: '轻度活动' },
    { value: 'moderate' as const, label: '中度活动' },
    { value: 'active' as const, label: '重度活动' },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="px-5 pt-12 pb-4">
        <h1 className="text-2xl font-bold text-foreground">初始化设置</h1>
        <p className="text-muted-foreground text-sm mt-1">告诉我你的基本信息，帮你制定热量目标</p>
      </div>

      <div className="flex-1 px-5 space-y-5 animate-fade-in">
        {/* Gender */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">性别</label>
          <div className="flex gap-3">
            {(['male', 'female'] as const).map(g => (
              <button
                key={g}
                onClick={() => setGender(g)}
                className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all ${
                  gender === g
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-secondary text-secondary-foreground'
                }`}
              >
                {g === 'male' ? '👨 男' : '👩 女'}
              </button>
            ))}
          </div>
        </div>

        {/* Number inputs */}
        {[
          { label: '年龄', value: age, set: setAge, unit: '岁', min: 10, max: 99 },
          { label: '身高', value: height, set: setHeight, unit: 'cm', min: 100, max: 250 },
          { label: '当前体重', value: currentWeight, set: setCurrentWeight, unit: 'kg', min: 30, max: 200 },
          { label: '目标体重', value: targetWeight, set: setTargetWeight, unit: 'kg', min: 30, max: 200 },
          { label: '期限', value: days, set: setDays, unit: '天', min: 7, max: 365 },
        ].map(item => (
          <div key={item.label}>
            <label className="text-sm font-medium text-foreground mb-2 block">{item.label}</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={item.value}
                onChange={e => item.set(Number(e.target.value))}
                min={item.min}
                max={item.max}
                className="flex-1 bg-secondary text-secondary-foreground rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
              <span className="text-muted-foreground text-sm w-8">{item.unit}</span>
            </div>
          </div>
        ))}

        {/* Activity Level */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">活动量</label>
          <div className="grid grid-cols-2 gap-2">
            {activities.map(a => (
              <button
                key={a.value}
                onClick={() => setActivityLevel(a.value)}
                className={`py-3 rounded-lg text-sm font-medium transition-all ${
                  activityLevel === a.value
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-secondary text-secondary-foreground'
                }`}
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>

        <div className="pb-8">
          <button
            onClick={handleSubmit}
            className="w-full bg-primary text-primary-foreground py-4 rounded-xl text-base font-semibold shadow-lg active:scale-[0.98] transition-transform"
          >
            🎯 生成每日热量目标
          </button>
        </div>
      </div>
    </div>
  );
};

export default Setup;
