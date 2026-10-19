import React, { useState } from 'react';
import {
  Calendar,
  Sparkles,
  Edit2,
  Check,
  Apple,
  Info,
  ShieldCheck,
  CheckCircle2,
  Filter,
} from 'lucide-react';
import { useMamaStore, mamaStore } from '../../store/useMamaStore';
import { NUTRIENTS_GUIDE } from '../../data/foodDatabase';
import { MealPlanDay } from '../../types';

export const MealPlannerAndNutrients: React.FC = () => {
  const { profile } = useMamaStore();
  const mealPlan = profile.mealPlan || [];
  const preferences = profile.dietaryPreferences || {
    vegetarian: false,
    vegan: false,
    nonVegetarian: true,
    tamilTraditional: true,
    dairyFree: false,
    nutFree: false,
    glutenFree: false,
  };

  const [activeDay, setActiveDay] = useState<MealPlanDay['day']>('Mon');
  const [editingDay, setEditingDay] = useState<MealPlanDay['day'] | null>(null);

  // Form states for editing
  const selectedDayPlan = mealPlan.find((d) => d.day === activeDay) || mealPlan[0];
  const [breakfast, setBreakfast] = useState(selectedDayPlan?.breakfast || '');
  const [lunch, setLunch] = useState(selectedDayPlan?.lunch || '');
  const [snack, setSnack] = useState(selectedDayPlan?.snack || '');
  const [dinner, setDinner] = useState(selectedDayPlan?.dinner || '');

  const handleStartEdit = () => {
    if (selectedDayPlan) {
      setBreakfast(selectedDayPlan.breakfast);
      setLunch(selectedDayPlan.lunch);
      setSnack(selectedDayPlan.snack);
      setDinner(selectedDayPlan.dinner);
      setEditingDay(selectedDayPlan.day);
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDay) {
      mamaStore.updateMealPlanDay(editingDay, {
        breakfast,
        lunch,
        snack,
        dinner,
      });
      setEditingDay(null);
    }
  };

  const togglePref = (key: keyof typeof preferences) => {
    mamaStore.updateDietaryPreferences({
      [key]: !preferences[key],
    });
  };

  return (
    <div className="space-y-6">
      {/* 1. Dietary Preferences & Allergies Settings */}
      <div className="rounded-3xl border border-[#f0dfea] bg-white p-5 shadow-soft sm:p-7">
        <div className="flex items-center gap-2 mb-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <Filter className="h-4 w-4" />
          </span>
          <div>
            <h3 className="font-display text-lg font-bold text-[#231426]">
              Dietary Preferences & Allergy Filters
            </h3>
            <p className="text-xs text-[#745f78]">
              Personalize recommendations to match your culture, dietary lifestyle, and sensitivities.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => togglePref('tamilTraditional')}
            className={`rounded-full px-3.5 py-1.5 font-semibold transition-all ${
              preferences.tamilTraditional
                ? 'bg-[#f075aa] text-white shadow-soft'
                : 'border border-[#f0dfea] bg-[#fff8fb] text-[#745f78] hover:bg-white'
            }`}
          >
            🍛 Tamil / South Indian Traditional {preferences.tamilTraditional ? '✓' : '+'}
          </button>
          <button
            onClick={() => togglePref('vegetarian')}
            className={`rounded-full px-3.5 py-1.5 font-semibold transition-all ${
              preferences.vegetarian
                ? 'bg-emerald-600 text-white shadow-soft'
                : 'border border-[#f0dfea] bg-[#fff8fb] text-[#745f78] hover:bg-white'
            }`}
          >
            🥗 Vegetarian {preferences.vegetarian ? '✓' : '+'}
          </button>
          <button
            onClick={() => togglePref('nonVegetarian')}
            className={`rounded-full px-3.5 py-1.5 font-semibold transition-all ${
              preferences.nonVegetarian
                ? 'bg-amber-600 text-white shadow-soft'
                : 'border border-[#f0dfea] bg-[#fff8fb] text-[#745f78] hover:bg-white'
            }`}
          >
            🍗 Non-Vegetarian (Cooked eggs, poultry, low-mercury fish) {preferences.nonVegetarian ? '✓' : '+'}
          </button>
          <button
            onClick={() => togglePref('dairyFree')}
            className={`rounded-full px-3.5 py-1.5 font-semibold transition-all ${
              preferences.dairyFree
                ? 'bg-purple-600 text-white shadow-soft'
                : 'border border-[#f0dfea] bg-[#fff8fb] text-[#745f78] hover:bg-white'
            }`}
          >
            🥛 Dairy-Free {preferences.dairyFree ? '✓' : '+'}
          </button>
          <button
            onClick={() => togglePref('nutFree')}
            className={`rounded-full px-3.5 py-1.5 font-semibold transition-all ${
              preferences.nutFree
                ? 'bg-rose-600 text-white shadow-soft'
                : 'border border-[#f0dfea] bg-[#fff8fb] text-[#745f78] hover:bg-white'
            }`}
          >
            🥜 Nut-Free {preferences.nutFree ? '✓' : '+'}
          </button>
          <button
            onClick={() => togglePref('glutenFree')}
            className={`rounded-full px-3.5 py-1.5 font-semibold transition-all ${
              preferences.glutenFree
                ? 'bg-indigo-600 text-white shadow-soft'
                : 'border border-[#f0dfea] bg-[#fff8fb] text-[#745f78] hover:bg-white'
            }`}
          >
            🌾 Gluten-Free {preferences.glutenFree ? '✓' : '+'}
          </button>
        </div>
      </div>

      {/* 2. 7-Day Weekly Meal Planner */}
      <div className="rounded-3xl border border-[#f0dfea] bg-white p-5 shadow-soft sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#f0dfea] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#fff0f6] text-[#f075aa]">
                <Calendar className="h-4 w-4" />
              </span>
              <h3 className="font-display text-xl font-bold text-[#231426]">
                Weekly Pregnancy Meal Planner
              </h3>
            </div>
            <p className="text-xs text-[#745f78] mt-0.5">
              Wholesome nourishment ideas for breakfast, lunch, tea-time snack, and dinner.
            </p>
          </div>

          {editingDay !== activeDay ? (
            <button
              onClick={handleStartEdit}
              className="flex items-center gap-1.5 rounded-2xl border border-[#f0dfea] bg-[#fff8fb] px-4 py-2 text-xs font-semibold text-[#231426] hover:bg-white hover:border-[#f075aa] transition-all shadow-xs"
            >
              <Edit2 className="h-3.5 w-3.5 text-[#f075aa]" />
              <span>Customize {selectedDayPlan?.label}</span>
            </button>
          ) : (
            <span className="text-xs font-bold text-[#f075aa]">Editing {selectedDayPlan?.label}...</span>
          )}
        </div>

        {/* Day Selector Pills */}
        <div className="my-4 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {mealPlan.map((d) => (
            <button
              key={d.day}
              onClick={() => {
                setActiveDay(d.day);
                setEditingDay(null);
              }}
              className={`rounded-2xl px-4 py-2 text-xs font-bold transition-all ${
                activeDay === d.day
                  ? 'bg-[#231426] text-white shadow-soft'
                  : 'border border-[#f0dfea] bg-[#fff8fb] text-[#745f78] hover:bg-white'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        {/* Selected Day Meal Slots */}
        {editingDay === activeDay ? (
          <form onSubmit={handleSaveEdit} className="space-y-3 rounded-2xl border border-[#f0dfea] bg-[#fff8fb] p-4 text-xs">
            <div>
              <label className="block text-[#745f78] font-semibold mb-1">Breakfast:</label>
              <input
                type="text"
                value={breakfast}
                onChange={(e) => setBreakfast(e.target.value)}
                className="w-full rounded-xl border border-[#f0dfea] bg-white p-2.5 text-xs focus:outline-none focus:border-[#f075aa]"
              />
            </div>
            <div>
              <label className="block text-[#745f78] font-semibold mb-1">Lunch:</label>
              <input
                type="text"
                value={lunch}
                onChange={(e) => setLunch(e.target.value)}
                className="w-full rounded-xl border border-[#f0dfea] bg-white p-2.5 text-xs focus:outline-none focus:border-[#f075aa]"
              />
            </div>
            <div>
              <label className="block text-[#745f78] font-semibold mb-1">Afternoon Snack:</label>
              <input
                type="text"
                value={snack}
                onChange={(e) => setSnack(e.target.value)}
                className="w-full rounded-xl border border-[#f0dfea] bg-white p-2.5 text-xs focus:outline-none focus:border-[#f075aa]"
              />
            </div>
            <div>
              <label className="block text-[#745f78] font-semibold mb-1">Dinner:</label>
              <input
                type="text"
                value={dinner}
                onChange={(e) => setDinner(e.target.value)}
                className="w-full rounded-xl border border-[#f0dfea] bg-white p-2.5 text-xs focus:outline-none focus:border-[#f075aa]"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-xl bg-[#f075aa] px-5 py-2 text-xs font-bold text-white shadow-soft"
              >
                <Check className="h-4 w-4" />
                <span>Save Changes</span>
              </button>
              <button
                type="button"
                onClick={() => setEditingDay(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-4">
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-800">
                Breakfast
              </span>
              <p className="mt-2 text-xs font-semibold text-[#231426] leading-relaxed">
                {selectedDayPlan?.breakfast}
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4">
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                Lunch
              </span>
              <p className="mt-2 text-xs font-semibold text-[#231426] leading-relaxed">
                {selectedDayPlan?.lunch}
              </p>
            </div>

            <div className="rounded-2xl border border-purple-200 bg-purple-50/40 p-4">
              <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-purple-800">
                Afternoon Snack
              </span>
              <p className="mt-2 text-xs font-semibold text-[#231426] leading-relaxed">
                {selectedDayPlan?.snack}
              </p>
            </div>

            <div className="rounded-2xl border border-sky-200 bg-sky-50/40 p-4">
              <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-sky-800">
                Dinner
              </span>
              <p className="mt-2 text-xs font-semibold text-[#231426] leading-relaxed">
                {selectedDayPlan?.dinner}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 3. Essential Pregnancy Nutrients Guide */}
      <div className="rounded-3xl border border-[#f0dfea] bg-white p-5 shadow-soft sm:p-7">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-50 text-[#f075aa]">
            <Apple className="h-4 w-4" />
          </span>
          <div>
            <h3 className="font-display text-xl font-bold text-[#231426]">
              Essential Pregnancy Nutrients Explained
            </h3>
            <p className="text-xs text-[#745f78]">
              Evidence-based overview of critical vitamins and minerals for you and baby.
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {NUTRIENTS_GUIDE.map((nutrient) => (
            <div
              key={nutrient.id}
              className="rounded-2xl border border-[#f0dfea] bg-[#fff8fb] p-4 text-xs transition-all hover:border-[#f075aa]/50 hover:bg-white hover:shadow-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{nutrient.emoji}</span>
                  <h4 className="font-display text-sm font-bold text-[#231426]">
                    {nutrient.name}
                  </h4>
                </div>
                <span className="rounded-full bg-white px-2.5 py-0.5 font-mono text-[10px] font-bold text-[#f075aa] border border-[#f0dfea]">
                  {nutrient.dailyGoal}
                </span>
              </div>

              <div className="mt-3 space-y-1.5 text-[11px] leading-relaxed">
                <p className="text-[#5a435f]">
                  <strong className="text-[#231426]">For Baby:</strong> {nutrient.whyBaby}
                </p>
                <p className="text-[#5a435f]">
                  <strong className="text-[#231426]">For Mama:</strong> {nutrient.whyMama}
                </p>
                <div className="pt-1">
                  <span className="font-semibold text-[#745f78]">Top Sources: </span>
                  <span className="text-[#231426]">{nutrient.topFoods.join(', ')}</span>
                </div>
              </div>

              <div className="mt-2.5 rounded-xl bg-white p-2 text-[10px] text-[#745f78] border border-[#f0dfea]/60">
                💡 {nutrient.tips}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-4 text-center text-[11px] text-[#745f78] italic">
          Disclaimer: Educational guidance only. Does not prescribe supplements or individualized medical diets. Consult your OB-GYN or licensed dietitian for individual bloodwork-based needs.
        </p>
      </div>
    </div>
  );
};
