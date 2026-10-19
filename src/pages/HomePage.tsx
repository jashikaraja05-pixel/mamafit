import React from 'react';
import {
  Droplets,
  Footprints,
  Apple,
  Moon,
  Sparkles,
  ChevronRight,
  Heart,
  Plus,
  CheckCircle2,
  Calendar,
  Smile,
  Baby,
} from 'lucide-react';
import { useMamaStore, mamaStore } from '../store/useMamaStore';
import { getWeekGrowth } from '../data/pregnancyWeeks';
import { ProgressRing } from '../components/common/ProgressRing';
import { HydrationTrackerCard } from '../components/home/HydrationTrackerCard';
import logoImg from '../assets/logo.png';

interface HomePageProps {
  onNavigate: (tab: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { profile, today, streak } = useMamaStore();

  const week = profile.pregnancyWeek || 16;
  const growth = getWeekGrowth(week);
  const trimesterName = week <= 13 ? 'Trimester 1' : week <= 26 ? 'Trimester 2' : 'Trimester 3';
  const mamaDisplayName = profile.name ? profile.name : 'Mama';

  // Time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Compute daily health score (0-100)
  const waterRatio = Math.min(today.waterMl / (profile.waterGoalMl || 2500), 1);
  const stepRatio = Math.min(today.steps / (profile.stepGoal || 8000), 1);
  const sleepRatio = Math.min(today.sleepHours / (profile.sleepGoalHours || 8), 1);
  const exerciseRatio = Math.min(today.exerciseMin / (profile.exerciseGoalMin || 30), 1);
  const vitaminRatio =
    (Number(today.vitamins.multivitamin) +
      Number(today.vitamins.folate) +
      Number(today.vitamins.iron) +
      Number(today.vitamins.dha)) /
    4;

  const hasActivity =
    today.waterMl > 0 ||
    today.steps > 0 ||
    today.sleepHours > 0 ||
    today.exerciseMin > 0 ||
    today.meals.length > 0 ||
    vitaminRatio > 0;

  const healthScore = hasActivity
    ? Math.round(
        (waterRatio * 0.25 + stepRatio * 0.25 + sleepRatio * 0.2 + exerciseRatio * 0.15 + vitaminRatio * 0.15) * 100
      )
    : 0;

  const getScoreMessage = (score: number) => {
    if (score >= 80) return 'Radiant & thriving 🌸';
    if (score >= 50) return 'Keep going gently ✨';
    if (score > 0) return 'Great start for today 💛';
    return 'Ready to bloom today 🌸';
  };

  const moods = [
    { value: 1, label: 'Tired', emoji: '🥱' },
    { value: 2, label: 'Sensitive', emoji: '🥺' },
    { value: 3, label: 'Peaceful', emoji: '😌' },
    { value: 4, label: 'Radiant', emoji: '🌸' },
    { value: 5, label: 'Energetic', emoji: '✨' },
  ];

  const totalCalories = today.meals.reduce((acc, m) => acc + m.cal, 0);

  return (
    <div className="space-y-6 pb-24">
      {/* 1. Header Greeting & Full Brand Showcase */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border-2 border-[#f075aa]/40 bg-white shadow-soft">
            <img
              src={logoImg}
              alt="MamaFit AI Emblem"
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <p className="text-xs font-medium text-[#745f78]">{getGreeting()},</p>
            <h1 className="font-display text-2xl font-bold tracking-tight text-[#231426] sm:text-3xl">
              {mamaDisplayName} <span className="inline-block animate-pulse">🌸</span>
            </h1>
            {!profile.name && (
              <button
                onClick={() => onNavigate('profile')}
                className="text-[11px] font-semibold text-[#f075aa] hover:underline"
              >
                + Customize name & due date in Profile
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('profile')}
            className="flex items-center gap-2 rounded-2xl border border-[#f0dfea] bg-white px-3.5 py-2 text-xs font-semibold text-[#231426] shadow-xs hover:border-[#f075aa] transition-all"
          >
            <Sparkles className="h-4 w-4 text-[#f075aa]" />
            <span>{streak > 0 ? `${streak} Day Streak` : 'Start Streak Today'}</span>
          </button>
        </div>
      </div>

      {/* 2. Hero Baby Growth & Week Card with Logo Art */}
      <div className="relative overflow-hidden rounded-3xl border border-[#f0dfea] bg-gradient-to-br from-[#fff2f7] via-white to-[#fbf0ff] p-5 shadow-soft sm:p-7">
        <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-[#f075aa]/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 left-10 h-36 w-36 rounded-full bg-[#c1a9ee]/15 blur-2xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#231426] px-3 py-1 text-xs font-bold text-white tracking-wide">
                Week {week}
              </span>
              <span className="rounded-full border border-[#f0dfea] bg-white px-3 py-1 text-xs font-medium text-[#745f78]">
                {trimesterName}
              </span>
              <span className="rounded-full bg-[#fff0f6] px-3 py-1 text-xs font-semibold text-[#f075aa]">
                {Math.max(0, 40 - week)} weeks until due
              </span>
            </div>

            <div>
              <h2 className="font-display text-2xl font-bold text-[#231426] sm:text-3xl">
                Baby is the size of an {growth.fruitComparison} {growth.fruitEmoji}
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-[#745f78]">
                {growth.babyHighlight}
              </p>
            </div>

            <div className="flex items-center gap-6 pt-1 text-xs font-medium text-[#231426]">
              <div className="flex items-center gap-1.5">
                <span className="text-[#745f78]">Length:</span>
                <span className="font-semibold text-[#f075aa]">~{growth.lengthCm} cm</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[#745f78]">Weight:</span>
                <span className="font-semibold text-[#f075aa]">~{growth.weightG} g</span>
              </div>
              {profile.babyNickname && (
                <div className="hidden sm:flex items-center gap-1.5 text-[#745f78]">
                  <Baby className="h-4 w-4 text-[#c1a9ee]" />
                  <span>{profile.babyNickname}</span>
                </div>
              )}
            </div>
          </div>

          {/* Daily Health Progress Ring */}
          <div className="flex shrink-0 items-center justify-center self-center md:self-auto">
            <div className="relative rounded-3xl border border-[#f0dfea]/80 bg-white/95 p-4 shadow-xs backdrop-blur-xs text-center min-w-[130px]">
              <ProgressRing
                value={healthScore / 100}
                size={110}
                stroke={10}
                gradientId="heroScoreGradient"
              >
                <div className="flex flex-col items-center">
                  <span className="font-display text-2xl font-bold text-[#231426]">
                    {healthScore}
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#745f78]">
                    Score
                  </span>
                </div>
              </ProgressRing>
              <p className="mt-2 text-xs font-semibold text-[#f075aa]">
                {getScoreMessage(healthScore)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. New Dedicated Hydration Tracker Component with Daily Progress Bar & Goal Setting */}
      <HydrationTrackerCard />

      {/* 4. Core Daily Metric Cards */}
      <div className="grid grid-cols-2 gap-3.5 sm:gap-4 md:grid-cols-4">
        {/* Hydration */}
        <div
          onClick={() => onNavigate('activity')}
          className="group cursor-pointer rounded-3xl border border-[#f0dfea] bg-white p-4 shadow-xs transition-all hover:border-[#f075aa]/50 hover:shadow-soft"
        >
          <div className="flex items-center justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-sky-50 text-sky-500">
              <Droplets className="h-5 w-5" />
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                mamaStore.addWater(250);
              }}
              title="Add 250ml water"
              className="flex h-7 w-7 items-center justify-center rounded-full bg-[#fff0f6] text-[#f075aa] hover:bg-[#f075aa] hover:text-white transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-3">
            <span className="text-xs font-medium text-[#745f78]">Water</span>
            <div className="flex items-baseline gap-1">
              <span className="font-display text-xl font-bold text-[#231426]">
                {(today.waterMl / 1000).toFixed(2)}
              </span>
              <span className="text-xs text-[#745f78]">/ {(profile.waterGoalMl / 1000).toFixed(1)} L</span>
            </div>
          </div>
          <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-sky-400 transition-all duration-500"
              style={{ width: `${Math.min((today.waterMl / profile.waterGoalMl) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Steps / Movement */}
        <div
          onClick={() => onNavigate('activity')}
          className="group cursor-pointer rounded-3xl border border-[#f0dfea] bg-white p-4 shadow-xs transition-all hover:border-[#f075aa]/50 hover:shadow-soft"
        >
          <div className="flex items-center justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-amber-50 text-amber-500">
              <Footprints className="h-5 w-5" />
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                mamaStore.addSteps(500);
              }}
              title="Add 500 steps"
              className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-3">
            <span className="text-xs font-medium text-[#745f78]">Gentle Steps</span>
            <div className="flex items-baseline gap-1">
              <span className="font-display text-xl font-bold text-[#231426]">
                {today.steps.toLocaleString()}
              </span>
              <span className="text-xs text-[#745f78]">/ {profile.stepGoal.toLocaleString()}</span>
            </div>
          </div>
          <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-amber-400 transition-all duration-500"
              style={{ width: `${Math.min((today.steps / profile.stepGoal) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Nutrition */}
        <div
          onClick={() => onNavigate('nutrition')}
          className="group cursor-pointer rounded-3xl border border-[#f0dfea] bg-white p-4 shadow-xs transition-all hover:border-[#f075aa]/50 hover:shadow-soft"
        >
          <div className="flex items-center justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500">
              <Apple className="h-5 w-5" />
            </div>
            <span className="text-[11px] font-semibold text-emerald-600">
              {today.meals.length > 0 ? `${today.meals.length} logged` : 'Log food'}
            </span>
          </div>
          <div className="mt-3">
            <span className="text-xs font-medium text-[#745f78]">Nutrients</span>
            <div className="flex items-baseline gap-1">
              <span className="font-display text-xl font-bold text-[#231426]">
                {totalCalories}
              </span>
              <span className="text-xs text-[#745f78]">/ {profile.calorieGoal} kcal</span>
            </div>
          </div>
          <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-emerald-400 transition-all duration-500"
              style={{ width: `${Math.min((totalCalories / profile.calorieGoal) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Sleep & Rest */}
        <div
          onClick={() => onNavigate('activity')}
          className="group cursor-pointer rounded-3xl border border-[#f0dfea] bg-white p-4 shadow-xs transition-all hover:border-[#f075aa]/50 hover:shadow-soft"
        >
          <div className="flex items-center justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500">
              <Moon className="h-5 w-5" />
            </div>
            <span className="text-[11px] font-semibold text-indigo-600">Left side</span>
          </div>
          <div className="mt-3">
            <span className="text-xs font-medium text-[#745f78]">Sleep</span>
            <div className="flex items-baseline gap-1">
              <span className="font-display text-xl font-bold text-[#231426]">
                {today.sleepHours > 0 ? today.sleepHours.toFixed(1) : '0.0'}
              </span>
              <span className="text-xs text-[#745f78]">/ {profile.sleepGoalHours} hrs</span>
            </div>
          </div>
          <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-indigo-400 transition-all duration-500"
              style={{ width: `${Math.min((today.sleepHours / profile.sleepGoalHours) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* 4. Today's Mood Check-in */}
      <div className="rounded-3xl border border-[#f0dfea] bg-white p-5 shadow-xs sm:p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Smile className="h-5 w-5 text-[#f075aa]" />
            <h3 className="font-display text-lg font-bold text-[#231426]">
              How are you feeling today, mama?
            </h3>
          </div>
          <span className="text-xs text-[#745f78]">
            {today.mood > 0 ? 'Logged' : 'Tap to record'}
          </span>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {moods.map((m) => {
            const isSelected = today.mood === m.value;
            return (
              <button
                key={m.value}
                onClick={() => mamaStore.setMood(m.value)}
                className={`flex flex-col items-center justify-center rounded-2xl p-2.5 transition-all focus:outline-none ${
                  isSelected
                    ? 'border-2 border-[#f075aa] bg-[#fff0f6] shadow-soft scale-105'
                    : 'border border-[#f0dfea] bg-[#fff8fb] hover:bg-white hover:border-[#f075aa]/40'
                }`}
              >
                <span className="text-2xl sm:text-3xl">{m.emoji}</span>
                <span
                  className={`mt-1 text-[11px] font-medium ${
                    isSelected ? 'font-bold text-[#f075aa]' : 'text-[#745f78]'
                  }`}
                >
                  {m.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Today's Gentle Routine & Prenatal Checklist */}
      <div className="rounded-3xl border border-[#f0dfea] bg-white p-5 shadow-xs sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-[#91debc]" />
            <h3 className="font-display text-lg font-bold text-[#231426]">
              Today’s Gentle Wellness Routine
            </h3>
          </div>
          <span className="text-xs text-[#745f78]">Check off as you complete</span>
        </div>

        <div className="space-y-2.5">
          {/* Vitamin */}
          <div
            onClick={() => mamaStore.toggleVitamin('multivitamin')}
            className="flex cursor-pointer items-center justify-between rounded-2xl border border-[#f0dfea] p-3.5 transition-all hover:bg-[#fff8fb]"
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full border transition-colors ${
                  today.vitamins.multivitamin
                    ? 'border-[#91debc] bg-[#91debc] text-white'
                    : 'border-slate-300 bg-white'
                }`}
              >
                {today.vitamins.multivitamin && <CheckCircle2 className="h-4 w-4" />}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#231426]">Prenatal Vitamin & Folate</p>
                <p className="text-xs text-[#745f78]">Essential for baby's neural tube and healthy development</p>
              </div>
            </div>
            <span
              className={`text-xs font-semibold ${
                today.vitamins.multivitamin ? 'text-emerald-600' : 'text-[#745f78]'
              }`}
            >
              {today.vitamins.multivitamin ? 'Completed ✨' : 'Tap to check'}
            </span>
          </div>

          {/* Hydration */}
          <div
            onClick={() => mamaStore.addWater(250)}
            className="flex cursor-pointer items-center justify-between rounded-2xl border border-[#f0dfea] p-3.5 transition-all hover:bg-[#fff8fb]"
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full border transition-colors ${
                  today.waterMl >= profile.waterGoalMl
                    ? 'border-[#91debc] bg-[#91debc] text-white'
                    : 'border-slate-300 bg-white'
                }`}
              >
                {today.waterMl >= profile.waterGoalMl && <CheckCircle2 className="h-4 w-4" />}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#231426]">Reach Hydration Goal (2.5L)</p>
                <p className="text-xs text-[#745f78]">
                  Currently at {(today.waterMl / 1000).toFixed(2)}L
                </p>
              </div>
            </div>
            <button className="rounded-full bg-[#fff0f6] px-3 py-1 text-xs font-semibold text-[#f075aa] hover:bg-[#f075aa] hover:text-white transition-colors">
              +250 ml
            </button>
          </div>

          {/* Movement */}
          <div
            onClick={() => onNavigate('exercise')}
            className="flex cursor-pointer items-center justify-between rounded-2xl border border-[#f0dfea] p-3.5 transition-all hover:bg-[#fff8fb]"
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full border transition-colors ${
                  today.exerciseMin >= profile.exerciseGoalMin
                    ? 'border-[#91debc] bg-[#91debc] text-white'
                    : 'border-slate-300 bg-white'
                }`}
              >
                {today.exerciseMin >= profile.exerciseGoalMin && <CheckCircle2 className="h-4 w-4" />}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#231426]">15m Gentle Prenatal Stretch or Walk</p>
                <p className="text-xs text-[#745f78]">Boosts circulation & prevents round ligament tightness</p>
              </div>
            </div>
            <span className="flex items-center text-xs font-semibold text-[#f075aa]">
              Start <ChevronRight className="h-4 w-4 ml-0.5" />
            </span>
          </div>

          {/* Kegel */}
          <div
            onClick={() => onNavigate('exercise')}
            className="flex cursor-pointer items-center justify-between rounded-2xl border border-[#f0dfea] p-3.5 transition-all hover:bg-[#fff8fb]"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-300 bg-white">
                <Heart className="h-3.5 w-3.5 text-[#f075aa]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#231426]">5m Pelvic Floor Conditioning</p>
                <p className="text-xs text-[#745f78]">Strengthens support for birth canal & posture</p>
              </div>
            </div>
            <span className="flex items-center text-xs font-semibold text-[#f075aa]">
              Train <ChevronRight className="h-4 w-4 ml-0.5" />
            </span>
          </div>
        </div>
      </div>

      {/* 6. Ask MamaFit AI Coach Card */}
      <div
        onClick={() => onNavigate('coach')}
        className="group relative cursor-pointer overflow-hidden rounded-3xl border border-[#f075aa]/30 bg-gradient-to-r from-[#fff0f6] via-[#fbf0ff] to-[#fff4ec] p-5 shadow-soft transition-all hover:border-[#f075aa] hover:shadow-glow sm:p-6"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#f075aa] to-[#c1a9ee] text-white shadow-soft">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <span className="rounded-full bg-[#f075aa]/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#e04586]">
                AI Pregnancy Companion
              </span>
              <h3 className="font-display text-xl font-bold text-[#231426]">
                Ask MamaFit AI
              </h3>
            </div>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#f075aa] shadow-xs group-hover:translate-x-1 transition-transform">
            <ChevronRight className="h-5 w-5" />
          </div>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-[#5a435f]">
          "What helps with morning sickness or fatigue in Week {week}?" or "Which iron-rich foods are safest?"
        </p>

        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full border border-[#f0dfea] bg-white/80 px-3 py-1 text-[#745f78]">
            Safe Movement 🧘‍♀️
          </span>
          <span className="rounded-full border border-[#f0dfea] bg-white/80 px-3 py-1 text-[#745f78]">
            Food Safety 🥑
          </span>
          <span className="rounded-full border border-[#f0dfea] bg-white/80 px-3 py-1 text-[#745f78]">
            Baby Kicks 💗
          </span>
        </div>
      </div>

      {/* 7. Daily Affirmation */}
      <div className="rounded-3xl border border-[#f0dfea] bg-gradient-to-br from-[#fffdfa] to-[#fff8fb] p-5 text-center shadow-xs">
        <span className="text-xl">🌸</span>
        <blockquote className="font-display mt-2 text-base italic text-[#231426] sm:text-lg">
          "{growth.affirmation}"
        </blockquote>
        <p className="mt-1 text-xs text-[#745f78]">MamaFit Daily Loving Affirmation</p>
      </div>
    </div>
  );
};
