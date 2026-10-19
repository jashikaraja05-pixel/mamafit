import React, { useState } from 'react';
import {
  Apple,
  Plus,
  Trash2,
  Search,
  ShieldCheck,
  AlertTriangle,
  XCircle,
  Sparkles,
  Info,
  CheckCircle2,
  Calendar,
  BookOpen,
} from 'lucide-react';
import { useMamaStore, mamaStore } from '../store/useMamaStore';
import { DEFAULT_PREGNANCY_FOODS, FOOD_SAFETY_GUIDE, NUTRIENTS_GUIDE } from '../data/foodDatabase';
import { ProgressRing } from '../components/common/ProgressRing';
import { MealItem } from '../types';
import { MealPlannerAndNutrients } from '../components/nutrition/MealPlannerAndNutrients';

export const NutritionPage: React.FC = () => {
  const { profile, today } = useMamaStore();
  const [activeTab, setActiveTab] = useState<'log' | 'safety' | 'add' | 'planner' | 'nutrients'>('log');
  const [safetySearch, setSafetySearch] = useState('');
  const [safetyFilter, setSafetyFilter] = useState<'all' | 'safe' | 'caution' | 'avoid'>('all');
  const [selectedMealType, setSelectedMealType] = useState<MealItem['mealType']>('breakfast');
  const [foodCategoryFilter, setFoodCategoryFilter] = useState<'all' | 'tamil' | 'indian' | 'global' | 'snack'>('all');

  // Custom meal input state
  const [customName, setCustomName] = useState('');
  const [customServing, setCustomServing] = useState('1 portion');
  const [customCal, setCustomCal] = useState('250');
  const [customProtein, setCustomProtein] = useState('15');
  const [customCarbs, setCustomCarbs] = useState('30');
  const [customFat, setCustomFat] = useState('8');
  const [customIron, setCustomIron] = useState('2.0');
  const [customCalcium, setCustomCalcium] = useState('100');

  // Compute nutrient totals from logged meals
  const totals = today.meals.reduce(
    (acc, m) => {
      acc.cal += m.cal || 0;
      acc.protein += m.protein || 0;
      acc.carbs += m.carbs || 0;
      acc.fat += m.fat || 0;
      acc.fiber += m.fiber || 0;
      acc.iron += m.iron || 0;
      acc.calcium += m.calcium || 0;
      return acc;
    },
    { cal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, iron: 0, calcium: 0 }
  );

  const handleAddPredefined = (food: (typeof DEFAULT_PREGNANCY_FOODS)[0]) => {
    mamaStore.addMeal({
      ...food,
      mealType: selectedMealType,
    });
    setActiveTab('log');
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    mamaStore.addMeal({
      name: customName.trim(),
      serving: customServing.trim() || '1 portion',
      cal: Number(customCal) || 0,
      protein: Number(customProtein) || 0,
      carbs: Number(customCarbs) || 0,
      fat: Number(customFat) || 0,
      fiber: 2,
      iron: Number(customIron) || 0,
      calcium: Number(customCalcium) || 0,
      pregnancySafe: true,
      mealType: selectedMealType,
    });

    setCustomName('');
    setActiveTab('log');
  };

  // Filter food safety list
  const filteredSafety = FOOD_SAFETY_GUIDE.filter((item) => {
    const matchesQuery =
      item.name.toLowerCase().includes(safetySearch.toLowerCase()) ||
      item.category.toLowerCase().includes(safetySearch.toLowerCase()) ||
      item.reason.toLowerCase().includes(safetySearch.toLowerCase());
    const matchesFilter = safetyFilter === 'all' || item.status === safetyFilter;
    return matchesQuery && matchesFilter;
  });

  const filteredPredefinedFoods = DEFAULT_PREGNANCY_FOODS.filter((f) => {
    if (foodCategoryFilter === 'all') return true;
    return f.category === foodCategoryFilter;
  });

  return (
    <div className="space-y-6 pb-24">
      {/* 1. Header & Navigation Sub-Tabs */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-[#231426] sm:text-3xl">
            Prenatal Nutrition, Meal Planner & Food Safety
          </h1>
          <p className="text-xs text-[#745f78]">
            Evidence-based nourishment, Tamil/Indian recipes, and safety checker for Week {profile.pregnancyWeek}
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 overflow-x-auto rounded-2xl border border-[#f0dfea] bg-white p-1 shadow-xs scrollbar-none">
          <button
            onClick={() => setActiveTab('log')}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'log'
                ? 'bg-[#f075aa] text-white shadow-soft'
                : 'text-[#745f78] hover:text-[#231426]'
            }`}
          >
            Today's Log
          </button>
          <button
            onClick={() => setActiveTab('add')}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'add'
                ? 'bg-[#f075aa] text-white shadow-soft'
                : 'text-[#745f78] hover:text-[#231426]'
            }`}
          >
            + Add Food
          </button>
          <button
            onClick={() => setActiveTab('planner')}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'planner'
                ? 'bg-[#f075aa] text-white shadow-soft'
                : 'text-[#745f78] hover:text-[#231426]'
            }`}
          >
            Meal Planner 📅
          </button>
          <button
            onClick={() => setActiveTab('safety')}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'safety'
                ? 'bg-[#f075aa] text-white shadow-soft'
                : 'text-[#745f78] hover:text-[#231426]'
            }`}
          >
            Safety Guide 🛡️
          </button>
          <button
            onClick={() => setActiveTab('nutrients')}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'nutrients'
                ? 'bg-[#f075aa] text-white shadow-soft'
                : 'text-[#745f78] hover:text-[#231426]'
            }`}
          >
            Nutrients 🥑
          </button>
        </div>
      </div>

      {/* 2. Nutrients Overview Summary Card */}
      <div className="rounded-3xl border border-[#f0dfea] bg-white p-5 shadow-soft sm:p-7">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#f075aa]">
              Daily Nutrients Progress
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-3xl font-bold text-[#231426]">
                {Math.round(totals.cal)}
              </span>
              <span className="text-sm text-[#745f78]">
                / {profile.calorieGoal} kcal target
              </span>
            </div>
            <p className="text-xs text-[#745f78]">
              {totals.cal < profile.calorieGoal
                ? `${Math.round(profile.calorieGoal - totals.cal)} kcal remaining to nourish baby`
                : 'Great job meeting your daily calorie goal today!'}
            </p>
          </div>

          {/* Calorie Ring */}
          <div className="flex shrink-0 items-center justify-center">
            <ProgressRing
              value={totals.cal / profile.calorieGoal}
              size={96}
              stroke={9}
              gradientId="calorieGradient"
            >
              <span className="font-display text-lg font-bold text-[#231426]">
                {Math.round((totals.cal / profile.calorieGoal) * 100)}%
              </span>
            </ProgressRing>
          </div>
        </div>

        {/* Key Pregnancy Nutrients Grid */}
        <div className="mt-6 grid grid-cols-2 gap-3 border-t border-[#f0dfea] pt-5 sm:grid-cols-4">
          {/* Protein */}
          <div className="rounded-2xl border border-[#f0dfea] bg-[#fff8fb] p-3">
            <div className="flex items-center justify-between text-xs text-[#745f78]">
              <span>Protein</span>
              <span className="font-semibold text-[#231426]">{Math.round(totals.protein)} / {profile.proteinGoal}g</span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-[#f075aa]"
                style={{ width: `${Math.min((totals.protein / profile.proteinGoal) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Iron */}
          <div className="rounded-2xl border border-[#f0dfea] bg-[#fff8fb] p-3">
            <div className="flex items-center justify-between text-xs text-[#745f78]">
              <span>Iron</span>
              <span className="font-semibold text-[#231426]">{totals.iron.toFixed(1)} / {profile.ironGoal}mg</span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-rose-400"
                style={{ width: `${Math.min((totals.iron / profile.ironGoal) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Calcium */}
          <div className="rounded-2xl border border-[#f0dfea] bg-[#fff8fb] p-3">
            <div className="flex items-center justify-between text-xs text-[#745f78]">
              <span>Calcium</span>
              <span className="font-semibold text-[#231426]">{Math.round(totals.calcium)} / {profile.calciumGoal}mg</span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-amber-400"
                style={{ width: `${Math.min((totals.calcium / profile.calciumGoal) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Fiber */}
          <div className="rounded-2xl border border-[#f0dfea] bg-[#fff8fb] p-3">
            <div className="flex items-center justify-between text-xs text-[#745f78]">
              <span>Fiber</span>
              <span className="font-semibold text-[#231426]">{Math.round(totals.fiber)} / {profile.fiberGoal}g</span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-emerald-400"
                style={{ width: `${Math.min((totals.fiber / profile.fiberGoal) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Meal Planner Tab */}
      {activeTab === 'planner' && <MealPlannerAndNutrients />}

      {/* 4. Nutrients Guide Tab */}
      {activeTab === 'nutrients' && (
        <div className="space-y-4">
          <div className="rounded-3xl border border-[#f0dfea] bg-white p-5 shadow-soft sm:p-7">
            <div className="flex items-center gap-2 mb-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#fff0f6] text-[#f075aa]">
                <BookOpen className="h-4 w-4" />
              </span>
              <div>
                <h3 className="font-display text-xl font-bold text-[#231426]">
                  Pregnancy Nutrients Master Guide
                </h3>
                <p className="text-xs text-[#745f78]">
                  Learn why folate, iron, calcium, protein, and DHA are critical and discover top foods.
                </p>
              </div>
            </div>

            <div className="grid gap-3.5 sm:grid-cols-2">
              {NUTRIENTS_GUIDE.map((n) => (
                <div key={n.id} className="rounded-2xl border border-[#f0dfea] bg-[#fff8fb] p-4 text-xs">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{n.emoji}</span>
                      <h4 className="font-bold text-[#231426] text-sm">{n.name}</h4>
                    </div>
                    <span className="rounded-full bg-white px-2.5 py-0.5 font-bold text-[#f075aa] border border-[#f0dfea]">
                      {n.dailyGoal}
                    </span>
                  </div>
                  <p className="text-[#5a435f] mt-1"><strong>For Baby:</strong> {n.whyBaby}</p>
                  <p className="text-[#5a435f] mt-1"><strong>For Mama:</strong> {n.whyMama}</p>
                  <p className="text-[#231426] font-semibold mt-2">Natural Food Sources: {n.topFoods.join(', ')}</p>
                  <div className="mt-2 rounded-xl bg-white p-2 text-[#745f78] border border-[#f0dfea]">
                    💡 {n.tips}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. Today's Food Log Tab */}
      {activeTab === 'log' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-bold text-[#231426]">
              Today’s Meals ({today.meals.length})
            </h3>
            <button
              onClick={() => setActiveTab('add')}
              className="flex items-center gap-1.5 rounded-full bg-[#f075aa] px-3.5 py-1.5 text-xs font-semibold text-white shadow-soft hover:bg-[#e05892] transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Log Meal</span>
            </button>
          </div>

          {today.meals.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-[#f0dfea] bg-white p-8 text-center">
              <Apple className="mx-auto h-10 w-10 text-[#f075aa]/50" />
              <p className="mt-2 text-sm font-semibold text-[#231426]">No meals logged yet today</p>
              <p className="mt-1 text-xs text-[#745f78]">
                Tap "+ Add Food" to select from traditional Tamil, Indian, or global pregnancy foods!
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {today.meals.map((meal) => (
                <div
                  key={meal.id}
                  className="flex items-center justify-between rounded-2xl border border-[#f0dfea] bg-white p-4 shadow-xs transition-all hover:border-[#f075aa]/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff0f6] text-[#f075aa]">
                      <Apple className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-[#231426]">{meal.name}</h4>
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                          Safe 🌿
                        </span>
                      </div>
                      <p className="text-xs text-[#745f78]">
                        {meal.serving} · <span className="capitalize">{meal.mealType}</span> at {meal.timestamp}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="font-display text-base font-bold text-[#231426]">
                        {meal.cal}
                      </span>
                      <span className="text-xs text-[#745f78]"> kcal</span>
                      <p className="text-[10px] text-[#745f78]">
                        {meal.protein}g P · {meal.iron}mg Fe · {meal.calcium}mg Ca
                      </p>
                    </div>
                    <button
                      onClick={() => mamaStore.removeMeal(meal.id)}
                      title="Remove meal"
                      className="rounded-full p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 6. Add Food Tab */}
      {activeTab === 'add' && (
        <div className="space-y-6">
          {/* Meal type selector */}
          <div className="rounded-3xl border border-[#f0dfea] bg-white p-5 shadow-xs">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#745f78] mb-2">
              Select Meal Category:
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedMealType(type)}
                  className={`rounded-2xl py-2.5 text-xs font-semibold capitalize transition-all ${
                    selectedMealType === type
                      ? 'bg-[#231426] text-white shadow-soft'
                      : 'border border-[#f0dfea] bg-[#fff8fb] text-[#745f78] hover:bg-white'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Quick-add pregnancy-safe foods with culture filters */}
          <div className="rounded-3xl border border-[#f0dfea] bg-white p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <div>
                <h3 className="font-display text-lg font-bold text-[#231426]">
                  Curated Pregnancy-Safe Foods ({filteredPredefinedFoods.length})
                </h3>
                <p className="text-xs text-[#745f78]">
                  Nutrient-dense options including Tamil, Indian, and wholesome international favorites.
                </p>
              </div>

              {/* Category pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'tamil', label: 'Tamil 🍛' },
                  { id: 'indian', label: 'Indian 🌿' },
                  { id: 'global', label: 'Global 🥗' },
                  { id: 'snack', label: 'Snacks 🍌' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setFoodCategoryFilter(cat.id as any)}
                    className={`rounded-xl px-3 py-1 text-xs font-semibold whitespace-nowrap transition-all ${
                      foodCategoryFilter === cat.id
                        ? 'bg-[#f075aa] text-white'
                        : 'border border-[#f0dfea] bg-[#fff8fb] text-[#745f78] hover:bg-white'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {filteredPredefinedFoods.map((food, idx) => (
                <div
                  key={idx}
                  onClick={() => handleAddPredefined(food)}
                  className="group flex cursor-pointer items-center justify-between rounded-2xl border border-[#f0dfea] bg-[#fff8fb] p-3.5 transition-all hover:border-[#f075aa] hover:bg-white hover:shadow-soft"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-[#231426] group-hover:text-[#f075aa] transition-colors">
                        {food.name}
                      </h4>
                      {food.category === 'tamil' && (
                        <span className="rounded-full bg-amber-100 text-amber-800 px-1.5 py-0.2 text-[9px] font-bold">
                          Tamil
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#745f78]">
                      {food.serving} · <span className="font-semibold">{food.cal} kcal</span>
                    </p>
                    <p className="text-[10px] text-[#745f78]/80">
                      {food.protein}g Protein · {food.iron}mg Iron · {food.calcium}mg Calcium
                    </p>
                  </div>
                  <button className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#f075aa] shadow-xs group-hover:bg-[#f075aa] group-hover:text-white transition-all">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Food Form */}
          <div className="rounded-3xl border border-[#f0dfea] bg-white p-5 shadow-xs sm:p-6">
            <h3 className="font-display text-lg font-bold text-[#231426] mb-1">
              Log Custom Food
            </h3>
            <p className="text-xs text-[#745f78] mb-4">
              Enter your own home-cooked or favorite pregnancy meal:
            </p>

            <form onSubmit={handleAddCustom} className="space-y-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-[#231426] mb-1">Food Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lentil Soup with Sourdough"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="w-full rounded-2xl border border-[#f0dfea] px-3.5 py-2 text-xs text-[#231426] focus:border-[#f075aa] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#231426] mb-1">Serving Size</label>
                  <input
                    type="text"
                    placeholder="e.g. 1 bowl"
                    value={customServing}
                    onChange={(e) => setCustomServing(e.target.value)}
                    className="w-full rounded-2xl border border-[#f0dfea] px-3.5 py-2 text-xs text-[#231426] focus:border-[#f075aa] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div>
                  <label className="block text-xs font-semibold text-[#231426] mb-1">Calories (kcal)</label>
                  <input
                    type="number"
                    min="0"
                    value={customCal}
                    onChange={(e) => setCustomCal(e.target.value)}
                    className="w-full rounded-2xl border border-[#f0dfea] px-3.5 py-2 text-xs text-[#231426] focus:border-[#f075aa] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#231426] mb-1">Protein (g)</label>
                  <input
                    type="number"
                    min="0"
                    value={customProtein}
                    onChange={(e) => setCustomProtein(e.target.value)}
                    className="w-full rounded-2xl border border-[#f0dfea] px-3.5 py-2 text-xs text-[#231426] focus:border-[#f075aa] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#231426] mb-1">Iron (mg)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={customIron}
                    onChange={(e) => setCustomIron(e.target.value)}
                    className="w-full rounded-2xl border border-[#f0dfea] px-3.5 py-2 text-xs text-[#231426] focus:border-[#f075aa] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#231426] mb-1">Calcium (mg)</label>
                  <input
                    type="number"
                    min="0"
                    value={customCalcium}
                    onChange={(e) => setCustomCalcium(e.target.value)}
                    className="w-full rounded-2xl border border-[#f0dfea] px-3.5 py-2 text-xs text-[#231426] focus:border-[#f075aa] focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-2xl bg-[#f075aa] py-3 text-xs font-semibold text-white shadow-soft hover:bg-[#e05892] transition-colors"
              >
                Add Meal to {selectedMealType.toUpperCase()}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 7. Pregnancy Food Safety Guide */}
      {activeTab === 'safety' && (
        <div className="space-y-4">
          <div className="rounded-3xl border border-[#f0dfea] bg-white p-5 shadow-xs sm:p-6">
            <h3 className="font-display text-lg font-bold text-[#231426] mb-1">
              "Is It Safe to Eat?" Pregnancy Food Checker
            </h3>
            <p className="text-xs text-[#745f78] mb-4">
              Check whether specific foods, cheeses, raw papaya, fenugreek, fish, and teas are safe during pregnancy:
            </p>

            {/* Search and filters */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search foods (e.g. papaya, methi, sesame, sushi, brie, coffee, eggs, salmon)..."
                  value={safetySearch}
                  onChange={(e) => setSafetySearch(e.target.value)}
                  className="w-full rounded-2xl border border-[#f0dfea] bg-[#fff8fb] pl-9 pr-3.5 py-2.5 text-xs text-[#231426] focus:border-[#f075aa] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {(['all', 'safe', 'caution', 'avoid'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSafetyFilter(filter)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-semibold capitalize whitespace-nowrap transition-all ${
                      safetyFilter === filter
                        ? 'bg-[#231426] text-white shadow-xs'
                        : 'border border-[#f0dfea] bg-white text-[#745f78] hover:bg-[#fff8fb]'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* List of items */}
          <div className="space-y-3">
            {filteredSafety.map((item) => {
              const isSafe = item.status === 'safe';
              const isCaution = item.status === 'caution';
              const isAvoid = item.status === 'avoid';

              return (
                <div
                  key={item.id}
                  className={`rounded-3xl border p-4 sm:p-5 transition-all ${
                    isSafe
                      ? 'border-emerald-200 bg-emerald-50/40'
                      : isCaution
                      ? 'border-amber-200 bg-amber-50/40'
                      : 'border-rose-200 bg-rose-50/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl ${
                          isSafe
                            ? 'bg-emerald-100 text-emerald-700'
                            : isCaution
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        {isSafe ? (
                          <ShieldCheck className="h-5 w-5" />
                        ) : isCaution ? (
                          <AlertTriangle className="h-5 w-5" />
                        ) : (
                          <XCircle className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-sm font-bold text-[#231426]">{item.name}</h4>
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                              isSafe
                                ? 'bg-emerald-100 text-emerald-800'
                                : isCaution
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {item.status}
                          </span>
                          {item.isIndianTamil && (
                            <span className="rounded-full bg-amber-100 text-amber-900 border border-amber-200 px-2 py-0.5 text-[10px] font-bold">
                              Traditional Context
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-xs text-[#5a435f]">
                          <strong>Why:</strong> {item.reason}
                        </p>
                        <p className="mt-1 text-xs text-[#231426]">
                          <strong>Safe Recommendation:</strong> {item.recommendation}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
