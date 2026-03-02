export interface UserProfile {
  gender: 'male' | 'female';
  age: number;
  height: number;
  currentWeight: number;
  targetWeight: number;
  days: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active';
  dailyCalorieTarget: number;
  createdAt: string;
}

export interface FoodRecord {
  id: string;
  name: string;
  weight: number;
  calories: number;
  emoji: string;
  timestamp: string;
}

export interface DayRecord {
  date: string;
  foods: FoodRecord[];
  totalCalories: number;
  weight?: number;
}

const PROFILE_KEY = 'calorie_tracker_profile';
const RECORDS_KEY = 'calorie_tracker_records';

export function getProfile(): UserProfile | null {
  const data = localStorage.getItem(PROFILE_KEY);
  return data ? JSON.parse(data) : null;
}

export function saveProfile(profile: UserProfile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function getRecords(): DayRecord[] {
  const data = localStorage.getItem(RECORDS_KEY);
  return data ? JSON.parse(data) : [];
}

export function getTodayRecord(): DayRecord {
  const today = new Date().toISOString().split('T')[0];
  const records = getRecords();
  const existing = records.find(r => r.date === today);
  return existing || { date: today, foods: [], totalCalories: 0 };
}

export function addFoodRecord(food: Omit<FoodRecord, 'id' | 'timestamp'>) {
  const today = new Date().toISOString().split('T')[0];
  const records = getRecords();
  let dayRecord = records.find(r => r.date === today);
  
  if (!dayRecord) {
    dayRecord = { date: today, foods: [], totalCalories: 0 };
    records.push(dayRecord);
  }

  const newFood: FoodRecord = {
    ...food,
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
  };

  dayRecord.foods.push(newFood);
  dayRecord.totalCalories = dayRecord.foods.reduce((sum, f) => sum + f.calories, 0);
  
  localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
  return newFood;
}

export function getRecentDays(n: number): DayRecord[] {
  const records = getRecords();
  const days: DayRecord[] = [];
  
  for (let i = 0; i < n; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const existing = records.find(r => r.date === dateStr);
    days.push(existing || { date: dateStr, foods: [], totalCalories: 0 });
  }
  
  return days;
}

export function calculateDailyCalories(profile: Omit<UserProfile, 'dailyCalorieTarget' | 'createdAt'>): number {
  // Mifflin-St Jeor
  let bmr: number;
  if (profile.gender === 'male') {
    bmr = 10 * profile.currentWeight + 6.25 * profile.height - 5 * profile.age + 5;
  } else {
    bmr = 10 * profile.currentWeight + 6.25 * profile.height - 5 * profile.age - 161;
  }

  const multipliers = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725 };
  const tdee = bmr * multipliers[profile.activityLevel];

  const weightDiff = profile.currentWeight - profile.targetWeight;
  const dailyDeficit = (weightDiff * 7700) / profile.days; // 7700 kcal per kg
  
  const target = Math.round(tdee - dailyDeficit);
  return Math.max(1200, Math.min(target, 3000)); // safety bounds
}

// Food emoji mapping
const FOOD_EMOJIS: Record<string, string> = {
  '米饭': '🍚', '面条': '🍜', '面包': '🍞', '鸡胸': '🍗', '鸡胸肉': '🍗',
  '牛肉': '🥩', '猪肉': '🥩', '鱼': '🐟', '虾': '🦐', '鸡蛋': '🥚',
  '西兰花': '🥦', '沙拉': '🥗', '苹果': '🍎', '香蕉': '🍌', '牛奶': '🥛',
  '酸奶': '🥛', '豆腐': '🫘', '玉米': '🌽',
};

export function getFoodEmoji(name: string): string {
  for (const [key, emoji] of Object.entries(FOOD_EMOJIS)) {
    if (name.includes(key)) return emoji;
  }
  return '🍽️';
}
