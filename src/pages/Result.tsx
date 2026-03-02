import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { addFoodRecord, getFoodEmoji } from "@/lib/storage";

// Simulated AI recognition - in production this would call a real API
function mockRecognize(): { name: string; weight: number; calories: number } {
  const foods = [
    { name: '鸡胸肉', weight: 150, calories: 240 },
    { name: '米饭', weight: 200, calories: 260 },
    { name: '西兰花', weight: 100, calories: 34 },
    { name: '牛肉', weight: 120, calories: 300 },
    { name: '面条', weight: 200, calories: 280 },
    { name: '鸡蛋', weight: 60, calories: 78 },
    { name: '苹果', weight: 200, calories: 104 },
    { name: '沙拉', weight: 150, calories: 45 },
  ];
  return foods[Math.floor(Math.random() * foods.length)];
}

const Result = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const imageData = (location.state as any)?.imageData;

  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [weight, setWeight] = useState(0);
  const [calories, setCalories] = useState(0);

  useEffect(() => {
    // Simulate AI processing
    const timer = setTimeout(() => {
      const result = mockRecognize();
      setName(result.name);
      setWeight(result.weight);
      setCalories(result.calories);
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleSave = () => {
    addFoodRecord({
      name,
      weight,
      calories,
      emoji: getFoodEmoji(name),
    });
    navigate('/', { replace: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center animate-fade-in">
        <div className="w-20 h-20 rounded-2xl bg-secondary flex items-center justify-center mb-4 animate-pulse">
          <span className="text-3xl">🤖</span>
        </div>
        <p className="text-foreground font-medium">AI 正在识别...</p>
        <p className="text-muted-foreground text-sm mt-1">分析食物和估算热量</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col safe-bottom">
      <div className="px-5 pt-10 pb-4">
        <h1 className="text-xl font-bold text-foreground">识别结果</h1>
        <p className="text-muted-foreground text-xs mt-1">识别有误可手动修改</p>
      </div>

      <div className="flex-1 px-5 animate-fade-in">
        {/* Image preview */}
        {imageData && (
          <div className="rounded-2xl overflow-hidden mb-5 border border-border">
            <img src={imageData} alt="食物" className="w-full h-48 object-cover" />
          </div>
        )}

        {/* Result Card */}
        <div className="bg-card rounded-2xl p-5 border border-border space-y-4">
          <div className="text-center pb-2">
            <span className="text-4xl">{getFoodEmoji(name)}</span>
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">食物名称</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-secondary text-secondary-foreground rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">重量 (g)</label>
              <input
                type="number"
                value={weight}
                onChange={e => setWeight(Number(e.target.value))}
                className="w-full bg-secondary text-secondary-foreground rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">热量 (kcal)</label>
              <input
                type="number"
                value={calories}
                onChange={e => setCalories(Number(e.target.value))}
                className="w-full bg-secondary text-secondary-foreground rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 px-5 py-4">
        <button
          onClick={() => navigate(-1)}
          className="flex-1 py-4 rounded-xl text-sm font-medium bg-secondary text-secondary-foreground active:scale-[0.97] transition-transform"
        >
          取消
        </button>
        <button
          onClick={handleSave}
          className="flex-[2] py-4 rounded-xl text-sm font-semibold bg-primary text-primary-foreground shadow-md active:scale-[0.97] transition-transform"
        >
          ✅ 保存记录
        </button>
      </div>
    </div>
  );
};

export default Result;
