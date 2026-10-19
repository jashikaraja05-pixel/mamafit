import { useState, useEffect } from 'react';
import {
  MamaProfile,
  TodayData,
  MealItem,
  Reminder,
  KickRecord,
  MealPlanDay,
  AppointmentItem,
  WalkingSession,
  HydrationScheduleConfig,
} from '../types';

const STORE_KEY = 'mamafit-store-v4';

function getTodayKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

export function createInitialToday(): TodayData {
  return {
    date: getTodayKey(),
    waterMl: 0,
    steps: 0,
    sleepHours: 0,
    mood: 0, // 0 = unselected until logged
    meals: [],
    exerciseMin: 0,
    kicks: [],
    vitamins: {
      multivitamin: false,
      folate: false,
      iron: false,
      dha: false,
      calcium: false,
    },
    symptoms: [],
    waterLogs: [],
    walkingSessions: [],
    completedChecklistIds: [],
  };
}

export const INITIAL_MEAL_PLAN: MealPlanDay[] = [
  {
    day: 'Mon',
    label: 'Monday',
    breakfast: 'Warm Oatmeal with Chia, Blueberries & Almonds',
    lunch: 'Steamed Idli (3) with Drumstick (Murungai) Sambar & Mint Chutney',
    snack: 'Sundal (Spiced Chickpeas) with Mor (Spiced Buttermilk)',
    dinner: 'Moong Dal Khichdi with Steamed Spinach & a teaspoon of Ghee',
  },
  {
    day: 'Tue',
    label: 'Tuesday',
    breakfast: 'Pasteurized Scrambled Eggs with Sourdough & Tomato Slices',
    lunch: 'Brown Rice with Palak Paneer & Carrot-Cucumber Kosumalli Salad',
    snack: 'Greek Yogurt with Sliced Strawberries & Roasted Walnuts',
    dinner: 'Well-cooked Salmon Fillet with Quinoa & Steamed Asparagus',
  },
  {
    day: 'Wed',
    label: 'Wednesday',
    breakfast: 'Ragi (Finger Millet) Porridge / Koozh with Warm Milk & Almonds',
    lunch: 'Whole Wheat Dosa with Coconut-Coriander Chutney & Lentil Stew',
    snack: 'Makhana (Roasted Lotus Seeds) & a juicy Orange (Vit C for Iron)',
    dinner: 'Grilled Herb Chicken (or Tofu) Breast with Sweet Potato Mash',
  },
  {
    day: 'Thu',
    label: 'Thursday',
    breakfast: 'Avocado Whole-Grain Toast with Soft-Boiled Pasteurized Egg',
    lunch: 'Curd Rice with Pomegranate Arils & Steamed Beetroot Poriyal',
    snack: 'Warm Spiced Badam Milk & a ripe Banana',
    dinner: 'Lentil Soup (Parippu) with Jeera Rice & Steamed Beans Poriyal',
  },
  {
    day: 'Fri',
    label: 'Friday',
    breakfast: 'Vegetable Upma with Roasted Cashews & Ginger-Lemon Warm Water',
    lunch: 'Paneer Tikka Bowl with Quinoa, Mixed Greens & Tahini Dressing',
    snack: 'Boiled Sweet Corn with Lemon Juice & a sprinkle of Chaat Masala',
    dinner: 'Cooked Pomfret / Fish Curry with Matta Rice & Cabbage Thoran',
  },
  {
    day: 'Sat',
    label: 'Saturday',
    breakfast: 'Multigrain Pancakes with Pure Maple Syrup & Fresh Raspberries',
    lunch: 'Mixed Vegetable Pulao with Cucumber Raita & Boiled Egg',
    snack: 'Roasted Chana (Chickpeas) & tender Coconut Water',
    dinner: 'Whole Wheat Chapati (2) with Dal Makhani (low cream) & Salad',
  },
  {
    day: 'Sun',
    label: 'Sunday',
    breakfast: 'Moong Dal Cheela (Pancakes) with Fresh Tomato Chutney',
    lunch: 'South Indian Sunday Thali: Rice, Rasam, Keerai Kootu & Curd',
    snack: 'Fruit Salad (Apple, Guava, Kiwi) with Chia Seeds',
    dinner: 'Baked Herb Sweet Potato with Cottage Cheese & Steamed Broccoli',
  },
];

export const INITIAL_APPOINTMENTS: AppointmentItem[] = [
  {
    id: 'apt-1',
    title: 'Mid-Pregnancy Anatomy Ultrasound (Level II)',
    provider: 'Dr. Sarah Mitchell, MD (OB-GYN)',
    date: '2026-11-12',
    time: '10:00 AM',
    location: 'Maternal Fetal Medicine Suite 4B',
    notes: 'Comprehensive ultrasound to evaluate baby growth, amniotic fluid, and fetal spine/organs.',
    type: 'ultrasound',
    completed: false,
  },
  {
    id: 'apt-2',
    title: 'Routine 4-Week Prenatal Checkup',
    provider: 'Midwife Elena Vance, CNM',
    date: '2026-11-26',
    time: '02:30 PM',
    location: 'Family Maternity Clinic Room 12',
    notes: 'Maternal blood pressure check, urine protein screen, and Doppler fetal heartbeat check.',
    type: 'routine',
    completed: false,
  },
  {
    id: 'apt-3',
    title: 'Glucose Tolerance Test (Gestational Diabetes Screen)',
    provider: 'Clinical Laboratory Services',
    date: '2026-12-10',
    time: '09:00 AM',
    location: 'Outpatient Lab Wing',
    notes: 'Drink Glucola beverage and test 1-hour blood glucose level. Fasting required as advised.',
    type: 'glucose',
    completed: false,
  },
];

export const INITIAL_HYDRATION_SCHEDULE: HydrationScheduleConfig = {
  enabled: true,
  intervalMinutes: 60, // Every 1 hour
  startTime: '08:00', // 8:00 AM
  endTime: '21:30', // 9:30 PM (pauses during mama sleep)
  soundEnabled: true,
  browserNotificationEnabled: true,
  inAppToastEnabled: true,
  reminderCountToday: 0,
};

export const INITIAL_PROFILE: MamaProfile = {
  name: '',
  babyNickname: '',
  pregnancyWeek: 16,
  dueDate: '',
  weightKg: 0,
  prePregnancyWeightKg: 0,
  heightCm: 0,
  onboarded: false, // New users start with onboarding to input real details
  waterGoalMl: 2500,
  stepGoal: 8000,
  calorieGoal: 2200,
  proteinGoal: 75,
  ironGoal: 27,
  calciumGoal: 1000,
  fiberGoal: 28,
  folateGoal: 600,
  exerciseGoalMin: 30,
  sleepGoalHours: 8,
  theme: 'light',
  dietaryPreferences: {
    vegetarian: false,
    vegan: false,
    nonVegetarian: true,
    tamilTraditional: true,
    dairyFree: false,
    nutFree: false,
    glutenFree: false,
  },
  appointments: INITIAL_APPOINTMENTS,
  mealPlan: INITIAL_MEAL_PLAN,
  notificationsEnabled: true,
  hydrationSchedule: INITIAL_HYDRATION_SCHEDULE,
};

export const INITIAL_REMINDERS: Reminder[] = [
  { id: 'r1', time: '08:30', enabled: true, label: 'Morning Hydration & Prenatal Vitamin', category: 'water' },
  { id: 'r2', time: '10:30', enabled: true, label: 'Gentle Stroll & Posture Check', category: 'walk' },
  { id: 'r3', time: '12:30', enabled: true, label: 'Nutritious Lunch & Water Glass', category: 'meal' },
  { id: 'r4', time: '15:30', enabled: true, label: 'Afternoon Hydration & Healthy Snack', category: 'water' },
  { id: 'r5', time: '17:30', enabled: true, label: 'Prenatal Stretching & Breathing Flow', category: 'exercise' },
  { id: 'r6', time: '20:30', enabled: true, label: 'Evening Pelvic Floor Kegels & Water Sip', category: 'exercise' },
  { id: 'r7', time: '21:30', enabled: true, label: 'Restful Left-Side Sleep Preparation', category: 'rest' },
];

export interface AppState {
  profile: MamaProfile;
  today: TodayData;
  history: TodayData[];
  reminders: Reminder[];
  streak: number;
  lastStreakDate: string;
}

function loadSavedState(): AppState {
  try {
    // Clear out old store versions with mock data
    localStorage.removeItem('mamafit-store-v3');
    localStorage.removeItem('mamafit-store-v2');
    localStorage.removeItem('mamafit-store-v1');

    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const todayKey = getTodayKey();
      let today = parsed.today;
      let history = parsed.history || [];

      // If day has changed, roll over today into history
      if (!today || today.date !== todayKey) {
        if (today && today.date && (today.waterMl > 0 || today.steps > 0 || today.meals?.length > 0)) {
          history = [today, ...history].slice(0, 90);
        }
        today = createInitialToday();
      }

      return {
        profile: {
          ...INITIAL_PROFILE,
          ...(parsed.profile || {}),
          hydrationSchedule: {
            ...INITIAL_HYDRATION_SCHEDULE,
            ...(parsed.profile?.hydrationSchedule || {}),
          },
        },
        today: today || createInitialToday(),
        history,
        reminders: parsed.reminders || INITIAL_REMINDERS,
        streak: parsed.streak || 0,
        lastStreakDate: parsed.lastStreakDate || todayKey,
      };
    }
  } catch (e) {
    console.warn('Could not read saved MamaFit state:', e);
  }

  return {
    profile: INITIAL_PROFILE,
    today: createInitialToday(),
    history: [],
    reminders: INITIAL_REMINDERS,
    streak: 0,
    lastStreakDate: getTodayKey(),
  };
}

let globalState: AppState = loadSavedState();
const listeners = new Set<() => void>();

function notify() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(globalState));
  } catch (e) {
    console.error('Failed to save MamaFit state:', e);
  }
  listeners.forEach((fn) => fn());
}

export const mamaStore = {
  getState: () => globalState,

  setProfile: (updates: Partial<MamaProfile>) => {
    globalState = {
      ...globalState,
      profile: { ...globalState.profile, ...updates },
    };
    notify();
  },

  setHydrationSchedule: (updates: Partial<HydrationScheduleConfig>) => {
    const currentSchedule = globalState.profile.hydrationSchedule || INITIAL_HYDRATION_SCHEDULE;
    globalState = {
      ...globalState,
      profile: {
        ...globalState.profile,
        hydrationSchedule: { ...currentSchedule, ...updates },
      },
    };
    notify();
  },

  snoozeHydration: (minutes: number) => {
    const currentSchedule = globalState.profile.hydrationSchedule || INITIAL_HYDRATION_SCHEDULE;
    const snoozeTime = new Date(Date.now() + minutes * 60 * 1000).toISOString();
    globalState = {
      ...globalState,
      profile: {
        ...globalState.profile,
        hydrationSchedule: {
          ...currentSchedule,
          snoozedUntil: snoozeTime,
          nextReminderTime: snoozeTime,
        },
      },
    };
    notify();
  },

  recordHydrationReminderTriggered: () => {
    const currentSchedule = globalState.profile.hydrationSchedule || INITIAL_HYDRATION_SCHEDULE;
    const nextTime = new Date(Date.now() + (currentSchedule.intervalMinutes || 60) * 60 * 1000).toISOString();
    globalState = {
      ...globalState,
      profile: {
        ...globalState.profile,
        hydrationSchedule: {
          ...currentSchedule,
          lastReminderTime: new Date().toISOString(),
          nextReminderTime: nextTime,
          snoozedUntil: undefined,
          reminderCountToday: (currentSchedule.reminderCountToday || 0) + 1,
        },
      },
    };
    notify();
  },

  addWater: (ml: number) => {
    const newWater = Math.max(0, globalState.today.waterMl + ml);
    const wasZero = globalState.today.waterMl === 0 && newWater > 0;
    const logEntry = {
      id: `w-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      amountMl: ml,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    globalState = {
      ...globalState,
      today: {
        ...globalState.today,
        waterMl: newWater,
        waterLogs: [...(globalState.today.waterLogs || []), logEntry],
      },
      streak: wasZero && globalState.streak === 0 ? 1 : globalState.streak,
    };
    notify();
  },

  resetWater: () => {
    globalState = {
      ...globalState,
      today: { ...globalState.today, waterMl: 0, waterLogs: [] },
    };
    notify();
  },

  addSteps: (steps: number) => {
    const newSteps = Math.max(0, globalState.today.steps + steps);
    globalState = {
      ...globalState,
      today: { ...globalState.today, steps: newSteps },
      streak: globalState.streak === 0 ? 1 : globalState.streak,
    };
    notify();
  },

  setStepsManually: (steps: number) => {
    const newSteps = Math.max(0, steps);
    globalState = {
      ...globalState,
      today: { ...globalState.today, steps: newSteps },
      streak: globalState.streak === 0 && newSteps > 0 ? 1 : globalState.streak,
    };
    notify();
  },

  addWalkingSession: (session: Omit<WalkingSession, 'id' | 'timestamp'>, alreadyCountedInToday = false) => {
    const newSession: WalkingSession = {
      ...session,
      id: `walk-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    const addedMin = Math.round(session.durationSec / 60);
    const updatedSessions = [newSession, ...(globalState.today.walkingSessions || [])];
    const newTotalSteps = alreadyCountedInToday
      ? globalState.today.steps
      : globalState.today.steps + session.steps;

    globalState = {
      ...globalState,
      today: {
        ...globalState.today,
        steps: newTotalSteps,
        exerciseMin: globalState.today.exerciseMin + addedMin,
        walkingSessions: updatedSessions,
      },
      streak: globalState.streak === 0 && newTotalSteps > 0 ? 1 : globalState.streak,
    };
    notify();
  },

  setSleep: (hours: number) => {
    globalState = {
      ...globalState,
      today: { ...globalState.today, sleepHours: hours },
    };
    notify();
  },

  setMood: (mood: number) => {
    globalState = {
      ...globalState,
      today: { ...globalState.today, mood },
    };
    notify();
  },

  addMeal: (meal: Omit<MealItem, 'id' | 'timestamp'>) => {
    const newItem: MealItem = {
      ...meal,
      id: `meal-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    globalState = {
      ...globalState,
      today: {
        ...globalState.today,
        meals: [newItem, ...globalState.today.meals],
      },
      streak: globalState.streak === 0 ? 1 : globalState.streak,
    };
    notify();
  },

  removeMeal: (mealId: string) => {
    globalState = {
      ...globalState,
      today: {
        ...globalState.today,
        meals: globalState.today.meals.filter((m) => m.id !== mealId),
      },
    };
    notify();
  },

  addExerciseMin: (min: number) => {
    globalState = {
      ...globalState,
      today: {
        ...globalState.today,
        exerciseMin: globalState.today.exerciseMin + min,
      },
      streak: globalState.streak === 0 ? 1 : globalState.streak,
    };
    notify();
  },

  addKick: () => {
    const record: KickRecord = {
      id: `kick-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };
    globalState = {
      ...globalState,
      today: {
        ...globalState.today,
        kicks: [...globalState.today.kicks, record],
      },
    };
    notify();
  },

  resetKicks: () => {
    globalState = {
      ...globalState,
      today: {
        ...globalState.today,
        kicks: [],
      },
    };
    notify();
  },

  toggleVitamin: (vitaminKey: keyof TodayData['vitamins']) => {
    const current = globalState.today.vitamins[vitaminKey];
    globalState = {
      ...globalState,
      today: {
        ...globalState.today,
        vitamins: {
          ...globalState.today.vitamins,
          [vitaminKey]: !current,
        },
      },
    };
    notify();
  },

  toggleSymptom: (symptom: string) => {
    const exists = globalState.today.symptoms.includes(symptom);
    const updated = exists
      ? globalState.today.symptoms.filter((s) => s !== symptom)
      : [...globalState.today.symptoms, symptom];
    globalState = {
      ...globalState,
      today: {
        ...globalState.today,
        symptoms: updated,
      },
    };
    notify();
  },

  toggleReminder: (id: string) => {
    globalState = {
      ...globalState,
      reminders: globalState.reminders.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)),
    };
    notify();
  },

  addReminder: (time: string, label: string) => {
    const newRem: Reminder = {
      id: `rem-${Date.now()}`,
      time,
      label,
      enabled: true,
    };
    globalState = {
      ...globalState,
      reminders: [...globalState.reminders, newRem],
    };
    notify();
  },

  addAppointment: (apt: Omit<AppointmentItem, 'id'>) => {
    const newApt: AppointmentItem = {
      ...apt,
      id: `apt-${Date.now()}`,
    };
    const currentApts = globalState.profile.appointments || [];
    globalState = {
      ...globalState,
      profile: {
        ...globalState.profile,
        appointments: [...currentApts, newApt].sort((a, b) => a.date.localeCompare(b.date)),
      },
    };
    notify();
  },

  toggleAppointment: (id: string) => {
    const currentApts = globalState.profile.appointments || [];
    globalState = {
      ...globalState,
      profile: {
        ...globalState.profile,
        appointments: currentApts.map((a) => (a.id === id ? { ...a, completed: !a.completed } : a)),
      },
    };
    notify();
  },

  deleteAppointment: (id: string) => {
    const currentApts = globalState.profile.appointments || [];
    globalState = {
      ...globalState,
      profile: {
        ...globalState.profile,
        appointments: currentApts.filter((a) => a.id !== id),
      },
    };
    notify();
  },

  toggleChecklistItem: (itemId: string) => {
    const current = globalState.today.completedChecklistIds || [];
    const exists = current.includes(itemId);
    const updated = exists ? current.filter((id) => id !== itemId) : [...current, itemId];
    globalState = {
      ...globalState,
      today: {
        ...globalState.today,
        completedChecklistIds: updated,
      },
    };
    notify();
  },

  updateMealPlanDay: (day: MealPlanDay['day'], updates: Partial<MealPlanDay>) => {
    const currentPlan = globalState.profile.mealPlan || INITIAL_MEAL_PLAN;
    const updatedPlan = currentPlan.map((d) => (d.day === day ? { ...d, ...updates } : d));
    globalState = {
      ...globalState,
      profile: {
        ...globalState.profile,
        mealPlan: updatedPlan,
      },
    };
    notify();
  },

  updateDietaryPreferences: (prefs: Partial<NonNullable<MamaProfile['dietaryPreferences']>>) => {
    const current = globalState.profile.dietaryPreferences || INITIAL_PROFILE.dietaryPreferences!;
    globalState = {
      ...globalState,
      profile: {
        ...globalState.profile,
        dietaryPreferences: { ...current, ...prefs },
      },
    };
    notify();
  },

  deleteReminder: (id: string) => {
    globalState = {
      ...globalState,
      reminders: globalState.reminders.filter((r) => r.id !== id),
    };
    notify();
  },

  resetAllData: () => {
    globalState = {
      profile: INITIAL_PROFILE,
      today: createInitialToday(),
      history: [],
      reminders: INITIAL_REMINDERS,
      streak: 0,
      lastStreakDate: getTodayKey(),
    };
    notify();
  },
};

export function useMamaStore(): AppState {
  const [state, setState] = useState<AppState>(globalState);

  useEffect(() => {
    const handler = () => setState(globalState);
    listeners.add(handler);
    return () => {
      listeners.delete(handler);
    };
  }, []);

  return state;
}
