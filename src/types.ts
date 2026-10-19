export interface MamaProfile {
  name: string;
  babyNickname: string;
  pregnancyWeek: number;
  dueDate: string;
  weightKg: number;
  prePregnancyWeightKg: number;
  heightCm: number;
  photo?: string;
  onboarded: boolean;
  waterGoalMl: number;
  stepGoal: number;
  calorieGoal: number;
  proteinGoal: number;
  ironGoal: number;
  calciumGoal: number;
  fiberGoal: number;
  folateGoal: number;
  exerciseGoalMin: number;
  sleepGoalHours: number;
  theme: 'light' | 'dark';
}

export interface MealItem {
  id: string;
  name: string;
  serving: string;
  cal: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  iron: number; // in mg
  calcium: number; // in mg
  pregnancySafe: boolean;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  timestamp: string;
}

export interface KickRecord {
  id: string;
  timestamp: string;
}

export interface TodayData {
  date: string; // YYYY-MM-DD
  waterMl: number;
  steps: number;
  sleepHours: number;
  mood: number; // 1-5
  meals: MealItem[];
  exerciseMin: number;
  kicks: KickRecord[];
  vitamins: {
    multivitamin: boolean;
    folate: boolean;
    iron: boolean;
    dha: boolean;
  };
  symptoms: string[];
}

export interface Reminder {
  id: string;
  time: string;
  enabled: boolean;
  label: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ExerciseItem {
  id: string;
  name: string;
  duration: number; // minutes
  level: 'Gentle' | 'Moderate' | 'Light';
  trimester: string;
  emoji: string;
  gradient: string;
  description: string;
  youtubeQuery: string;
  steps: string[];
  benefits: string[];
  safetyTips: string[];
}

export interface FoodSafetyItem {
  id: string;
  name: string;
  category: 'seafood' | 'dairy' | 'meat' | 'beverages' | 'produce' | 'herbal' | 'sweets';
  status: 'safe' | 'caution' | 'avoid';
  reason: string;
  recommendation: string;
}

export interface WeekGrowthData {
  week: number;
  trimester: 1 | 2 | 3;
  fruitComparison: string;
  fruitEmoji: string;
  lengthCm: number;
  weightG: number;
  babyHighlight: string;
  mamaTip: string;
  affirmation: string;
}
