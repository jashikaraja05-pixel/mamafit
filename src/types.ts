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
  dietaryPreferences?: {
    vegetarian: boolean;
    vegan: boolean;
    nonVegetarian: boolean;
    tamilTraditional: boolean;
    dairyFree: boolean;
    nutFree: boolean;
    glutenFree: boolean;
  };
  appointments?: AppointmentItem[];
  mealPlan?: MealPlanDay[];
  notificationsEnabled?: boolean;
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
  category?: 'tamil' | 'indian' | 'global' | 'snack';
  isVegetarian?: boolean;
}

export interface KickRecord {
  id: string;
  timestamp: string;
}

export interface WaterLogEntry {
  id: string;
  amountMl: number;
  timestamp: string;
}

export interface WalkingSession {
  id: string;
  timestamp: string;
  durationSec: number;
  steps: number;
  distanceKm: number;
  paceMinKm?: string;
  mode: 'sensor' | 'manual' | 'timer';
  notes?: string;
}

export interface AppointmentItem {
  id: string;
  title: string;
  provider: string;
  date: string;
  time: string;
  location?: string;
  notes?: string;
  type: 'routine' | 'ultrasound' | 'bloodwork' | 'glucose' | 'specialist';
  completed: boolean;
}

export interface MealPlanDay {
  day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
  label: string;
  breakfast: string;
  lunch: string;
  snack: string;
  dinner: string;
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
    calcium?: boolean;
  };
  symptoms: string[];
  waterLogs?: WaterLogEntry[];
  walkingSessions?: WalkingSession[];
  completedChecklistIds?: string[];
}

export interface Reminder {
  id: string;
  time: string;
  enabled: boolean;
  label: string;
  category?: 'water' | 'walk' | 'exercise' | 'meal' | 'rest' | 'appointment';
  daysOfWeek?: number[]; // 0-6
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export type ExerciseCategory =
  | 'walking'
  | 'stretching'
  | 'yoga'
  | 'breathing'
  | 'relaxation'
  | 'posture'
  | 'pelvic';

export interface ExerciseItem {
  id: string;
  name: string;
  duration: number; // minutes
  level: 'Gentle' | 'Moderate' | 'Light';
  trimester: string; // 'Trimester 1, 2, 3' or 'All trimesters'
  emoji: string;
  gradient: string;
  description: string;
  category: ExerciseCategory;
  youtubeQuery: string;
  videoUrl?: string; // Real verified educational video link
  animationPose?: 'cat-cow' | 'pelvic-tilt' | 'butterfly' | 'side-rest' | 'walking' | 'kegel-lift' | 'chest-opener';
  steps: string[];
  benefits: string[];
  safetyTips: string[];
}

export interface FoodSafetyItem {
  id: string;
  name: string;
  category: 'seafood' | 'dairy' | 'meat' | 'beverages' | 'produce' | 'herbal' | 'sweets' | 'indian';
  status: 'safe' | 'caution' | 'avoid';
  reason: string;
  recommendation: string;
  isIndianTamil?: boolean;
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
  symptoms: string[];
  nutritionFocus: string;
  selfCare: string;
  suitableActivities: string[];
  precautions: string[];
  avoidOrLimit: string[];
  weeklyChecklist: string[];
}

