import { useState, useEffect } from 'react';
import { MamaProfile, TodayData, MealItem, Reminder, KickRecord } from '../types';

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
    },
    symptoms: [],
  };
}

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
};

export const INITIAL_REMINDERS: Reminder[] = [
  { id: 'r1', time: '08:30', enabled: true, label: 'Morning Hydration & Prenatal Vitamin' },
  { id: 'r2', time: '12:30', enabled: true, label: 'Lunchtime Glass of Water' },
  { id: 'r3', time: '16:00', enabled: true, label: 'Gentle Afternoon Stretch & Sip' },
  { id: 'r4', time: '20:30', enabled: true, label: 'Evening Water & Kegel Practice' },
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
        profile: { ...INITIAL_PROFILE, ...(parsed.profile || {}) },
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

  addWater: (ml: number) => {
    const newWater = Math.max(0, globalState.today.waterMl + ml);
    const wasZero = globalState.today.waterMl === 0 && newWater > 0;
    globalState = {
      ...globalState,
      today: { ...globalState.today, waterMl: newWater },
      streak: wasZero && globalState.streak === 0 ? 1 : globalState.streak,
    };
    notify();
  },

  resetWater: () => {
    globalState = {
      ...globalState,
      today: { ...globalState.today, waterMl: 0 },
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
