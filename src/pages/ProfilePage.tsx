import React, { useState } from 'react';
import {
  User,
  Heart,
  Baby,
  Calendar,
  Scale,
  Target,
  Download,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  GitBranch,
  ShieldAlert,
} from 'lucide-react';
import { useMamaStore, mamaStore } from '../store/useMamaStore';

interface ProfilePageProps {
  onOpenSafetyModal: () => void;
  onOpenGitHubModal: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  onOpenSafetyModal,
  onOpenGitHubModal,
}) => {
  const { profile, today, history, streak } = useMamaStore();

  const [name, setName] = useState(profile.name || '');
  const [babyNickname, setBabyNickname] = useState(profile.babyNickname || '');
  const [week, setWeek] = useState(profile.pregnancyWeek || 16);
  const [dueDate, setDueDate] = useState(profile.dueDate || '');
  const [weightKg, setWeightKg] = useState<number | string>(profile.weightKg || '');
  const [preWeightKg, setPreWeightKg] = useState<number | string>(profile.prePregnancyWeightKg || '');
  const [heightCm, setHeightCm] = useState<number | string>(profile.heightCm || '');

  const [waterGoal, setWaterGoal] = useState(profile.waterGoalMl || 2500);
  const [stepGoal, setStepGoal] = useState(profile.stepGoal || 8000);
  const [calorieGoal, setCalorieGoal] = useState(profile.calorieGoal || 2200);
  const [sleepGoal, setSleepGoal] = useState(profile.sleepGoalHours || 8);

  const [savedNotice, setSavedNotice] = useState(false);

  // Compute gestational weight gain if values exist
  const numWeight = Number(weightKg) || 0;
  const numPreWeight = Number(preWeightKg) || 0;
  const numHeight = Number(heightCm) || 0;
  const weightGain = numWeight > 0 && numPreWeight > 0 ? Math.max(0, numWeight - numPreWeight) : 0;
  const heightM = numHeight > 0 ? numHeight / 100 : 1.65;
  const preBmi = numPreWeight > 0 ? numPreWeight / (heightM * heightM) : 0;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    mamaStore.setProfile({
      name: name.trim(),
      babyNickname: babyNickname.trim(),
      pregnancyWeek: Number(week) || 16,
      dueDate,
      weightKg: Number(weightKg) || 0,
      prePregnancyWeightKg: Number(preWeightKg) || 0,
      heightCm: Number(heightCm) || 0,
      waterGoalMl: Number(waterGoal),
      stepGoal: Number(stepGoal),
      calorieGoal: Number(calorieGoal),
      sleepGoalHours: Number(sleepGoal),
      onboarded: true,
    });

    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const handleExportData = () => {
    const summary = {
      app: 'MamaFit AI – Pregnancy Wellness Companion',
      exportDate: new Date().toISOString(),
      profile: mamaStore.getState().profile,
      todayVitals: mamaStore.getState().today,
      recentHistory: history.slice(0, 30),
    };

    const blob = new Blob([JSON.stringify(summary, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mamafit-health-log-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-24">
      {/* 1. Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-[#231426] sm:text-3xl">
            Mama Profile & Settings
          </h1>
          <p className="text-xs text-[#745f78]">
            Customize your pregnancy timeline, wellness targets, and health exports.
          </p>
        </div>

        <button
          onClick={onOpenGitHubModal}
          className="flex items-center gap-1.5 rounded-2xl bg-[#231426] px-3.5 py-2 text-xs font-semibold text-white shadow-soft hover:bg-[#3d2442] transition-colors"
        >
          <GitBranch className="h-4 w-4 text-[#ffc6c0]" />
          <span>GitHub Code</span>
        </button>
      </div>

      {savedNotice && (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs font-semibold text-emerald-800 animate-fadeIn">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>Profile changes successfully updated! 🌸</span>
        </div>
      )}

      {/* 2. Main Profile Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Basic Info Card */}
        <div className="rounded-3xl border border-[#f0dfea] bg-white p-5 shadow-soft sm:p-7">
          <h3 className="font-display text-lg font-bold text-[#231426] mb-4 flex items-center gap-2">
            <User className="h-5 w-5 text-[#f075aa]" />
            Expectant Mama & Baby Details
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-[#231426] mb-1">
                Your Name
              </label>
              <input
                type="text"
                placeholder="e.g. Aisha"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-2xl border border-[#f0dfea] bg-[#fff8fb] px-3.5 py-2.5 text-xs text-[#231426] placeholder-[#745f78]/70 focus:border-[#f075aa] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#231426] mb-1">
                Baby’s Nickname (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Little Peanut"
                value={babyNickname}
                onChange={(e) => setBabyNickname(e.target.value)}
                className="w-full rounded-2xl border border-[#f0dfea] bg-[#fff8fb] px-3.5 py-2.5 text-xs text-[#231426] focus:border-[#f075aa] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#231426] mb-1">
                Current Pregnancy Week (1–42)
              </label>
              <input
                type="number"
                min="1"
                max="42"
                value={week}
                onChange={(e) => setWeek(Number(e.target.value))}
                className="w-full rounded-2xl border border-[#f0dfea] bg-[#fff8fb] px-3.5 py-2.5 text-xs text-[#231426] focus:border-[#f075aa] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#231426] mb-1">
                Estimated Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded-2xl border border-[#f0dfea] bg-[#fff8fb] px-3.5 py-2.5 text-xs text-[#231426] focus:border-[#f075aa] focus:bg-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Gestational Weight & Measurements */}
        <div className="rounded-3xl border border-[#f0dfea] bg-white p-5 shadow-soft sm:p-7">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-bold text-[#231426] flex items-center gap-2">
              <Scale className="h-5 w-5 text-amber-500" />
              Gestational Weight Tracking
            </h3>
            {numWeight > 0 && numPreWeight > 0 && (
              <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-800">
                +{weightGain.toFixed(1)} kg gain
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold text-[#231426] mb-1">
                Pre-pregnancy Weight (kg)
              </label>
              <input
                type="number"
                step="0.5"
                placeholder="e.g. 58"
                value={preWeightKg}
                onChange={(e) => setPreWeightKg(e.target.value)}
                className="w-full rounded-2xl border border-[#f0dfea] bg-[#fff8fb] px-3.5 py-2.5 text-xs text-[#231426] focus:border-[#f075aa] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#231426] mb-1">
                Current Weight (kg)
              </label>
              <input
                type="number"
                step="0.5"
                placeholder="e.g. 62"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                className="w-full rounded-2xl border border-[#f0dfea] bg-[#fff8fb] px-3.5 py-2.5 text-xs text-[#231426] focus:border-[#f075aa] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#231426] mb-1">
                Height (cm)
              </label>
              <input
                type="number"
                placeholder="e.g. 165"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
                className="w-full rounded-2xl border border-[#f0dfea] bg-[#fff8fb] px-3.5 py-2.5 text-xs text-[#231426] focus:border-[#f075aa] focus:outline-none"
              />
            </div>
          </div>

          {preBmi > 0 && (
            <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50/50 p-3 text-xs text-amber-900 leading-relaxed">
              <strong>Clinical Guideline:</strong> For pre-pregnancy BMI of {preBmi.toFixed(1)}, the recommended total pregnancy weight gain is typically 11.5–16.0 kg (25–35 lbs).
            </div>
          )}
        </div>

        {/* Daily Goals Tuning */}
        <div className="rounded-3xl border border-[#f0dfea] bg-white p-5 shadow-soft sm:p-7">
          <h3 className="font-display text-lg font-bold text-[#231426] mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-sky-500" />
            Personalized Daily Targets
          </h3>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <label className="block text-xs font-semibold text-[#231426] mb-1">
                Water Target (ml)
              </label>
              <input
                type="number"
                step="100"
                value={waterGoal}
                onChange={(e) => setWaterGoal(Number(e.target.value))}
                className="w-full rounded-2xl border border-[#f0dfea] bg-[#fff8fb] px-3.5 py-2.5 text-xs text-[#231426] focus:border-[#f075aa] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#231426] mb-1">
                Step Target
              </label>
              <input
                type="number"
                step="500"
                value={stepGoal}
                onChange={(e) => setStepGoal(Number(e.target.value))}
                className="w-full rounded-2xl border border-[#f0dfea] bg-[#fff8fb] px-3.5 py-2.5 text-xs text-[#231426] focus:border-[#f075aa] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#231426] mb-1">
                Calories (kcal)
              </label>
              <input
                type="number"
                step="50"
                value={calorieGoal}
                onChange={(e) => setCalorieGoal(Number(e.target.value))}
                className="w-full rounded-2xl border border-[#f0dfea] bg-[#fff8fb] px-3.5 py-2.5 text-xs text-[#231426] focus:border-[#f075aa] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#231426] mb-1">
                Sleep Goal (hrs)
              </label>
              <input
                type="number"
                step="0.5"
                value={sleepGoal}
                onChange={(e) => setSleepGoal(Number(e.target.value))}
                className="w-full rounded-2xl border border-[#f0dfea] bg-[#fff8fb] px-3.5 py-2.5 text-xs text-[#231426] focus:border-[#f075aa] focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="w-full sm:w-auto rounded-2xl bg-[#f075aa] px-8 py-3 text-xs font-bold text-white shadow-soft hover:bg-[#e05892] transition-colors"
            >
              Save Profile & Target Goals
            </button>
          </div>
        </div>
      </form>

      {/* 3. Export Data & Health Log for Doctor */}
      <div className="rounded-3xl border border-[#f0dfea] bg-white p-5 shadow-soft sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="font-display text-lg font-bold text-[#231426] flex items-center gap-2">
              <Download className="h-5 w-5 text-[#f075aa]" />
              Doctor & Midwife Health Log Export
            </h3>
            <p className="text-xs text-[#745f78] mt-0.5">
              Download your complete prenatal vitals, hydration logs, kick movements, and symptoms.
            </p>
          </div>

          <button
            onClick={handleExportData}
            className="flex items-center justify-center gap-2 rounded-2xl border border-[#f0dfea] bg-[#fff8fb] px-5 py-2.5 text-xs font-semibold text-[#231426] hover:bg-white hover:border-[#f075aa] transition-all shadow-xs"
          >
            <Download className="h-4 w-4 text-[#f075aa]" />
            Download Health JSON
          </button>
        </div>
      </div>

      {/* 4. Safety & Reset Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onOpenSafetyModal}
          className="flex-1 flex items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50/50 py-3 text-xs font-semibold text-rose-800 hover:bg-rose-100 transition-colors"
        >
          <ShieldAlert className="h-4 w-4" />
          Review Medical Safety Disclaimer
        </button>

        <button
          onClick={() => {
            if (confirm('Reset all logged data back to zero?')) {
              mamaStore.resetAllData();
            }
          }}
          className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 py-3 px-5 text-xs font-medium text-slate-500 hover:bg-slate-50"
        >
          <RotateCcw className="h-4 w-4" />
          Reset App Data
        </button>
      </div>
    </div>
  );
};
