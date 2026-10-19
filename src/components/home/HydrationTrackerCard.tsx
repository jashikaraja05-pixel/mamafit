import React, { useState } from 'react';
import { Droplets, Plus, Minus, Settings2, CheckCircle2, Sparkles, RotateCcw } from 'lucide-react';
import { useMamaStore, mamaStore } from '../../store/useMamaStore';

export const HydrationTrackerCard: React.FC = () => {
  const { profile, today } = useMamaStore();
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [customAmount, setCustomAmount] = useState('250');
  const [tempGoal, setTempGoal] = useState(profile.waterGoalMl || 2500);

  const goal = profile.waterGoalMl || 2500;
  const current = today.waterMl;
  const percentage = Math.min(Math.round((current / goal) * 100), 100);
  const isGoalReached = current >= goal && goal > 0;

  const handleSaveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    mamaStore.setProfile({ waterGoalMl: Number(tempGoal) || 2500 });
    setIsEditingGoal(false);
  };

  const handleCustomLog = (e: React.FormEvent) => {
    e.preventDefault();
    const val = Number(customAmount);
    if (val > 0) {
      mamaStore.addWater(val);
      setCustomAmount('');
    }
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-[#f0dfea] bg-white p-5 shadow-soft transition-all hover:border-[#f075aa]/40 sm:p-6">
      {/* Header with Title and Goal Action */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-500 shadow-xs">
            <Droplets className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display text-lg font-bold text-[#231426] sm:text-xl">
                Daily Hydration Tracker
              </h3>
              {isGoalReached && (
                <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                  <CheckCircle2 className="h-3 w-3" />
                  Goal Met!
                </span>
              )}
            </div>
            <p className="text-xs text-[#745f78]">
              Supports amniotic fluid, digestion, and healthy blood volume
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setTempGoal(profile.waterGoalMl || 2500);
            setIsEditingGoal(!isEditingGoal);
          }}
          className={`flex items-center gap-1.5 rounded-2xl px-3 py-1.5 text-xs font-semibold transition-all ${
            isEditingGoal
              ? 'bg-[#231426] text-white shadow-xs'
              : 'border border-[#f0dfea] bg-[#fff8fb] text-[#745f78] hover:border-[#f075aa] hover:text-[#f075aa]'
          }`}
          title="Adjust Daily Water Target"
        >
          <Settings2 className="h-3.5 w-3.5" />
          <span>{isEditingGoal ? 'Close' : 'Set Goal'}</span>
        </button>
      </div>

      {/* Inline Goal Setting Form */}
      {isEditingGoal && (
        <form onSubmit={handleSaveGoal} className="mt-4 rounded-2xl border border-sky-100 bg-sky-50/60 p-4 transition-all">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <label className="block text-xs font-bold text-sky-950 mb-1">
                Customize Daily Water Goal (ml):
              </label>
              <div className="flex items-center gap-2">
                {[2000, 2500, 3000].map((preset) => (
                  <button
                    type="button"
                    key={preset}
                    onClick={() => setTempGoal(preset)}
                    className={`rounded-xl px-2.5 py-1 text-xs font-medium transition-all ${
                      tempGoal === preset
                        ? 'bg-sky-600 text-white shadow-xs'
                        : 'border border-sky-200 bg-white text-sky-900 hover:bg-sky-50'
                    }`}
                  >
                    {preset} ml
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                step="100"
                min="1000"
                max="5000"
                value={tempGoal}
                onChange={(e) => setTempGoal(Number(e.target.value))}
                className="w-28 rounded-xl border border-sky-200 bg-white px-3 py-1.5 text-center text-xs font-bold text-sky-950 focus:border-sky-500 focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-xl bg-sky-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-sky-700 transition-colors shadow-xs"
              >
                Save Target
              </button>
            </div>
          </div>
          <p className="mt-2 text-[11px] text-sky-800 leading-normal">
            💡 Clinical tip: Expectant mothers are recommended 2,300 to 2,800 ml (approx 8–10 cups) daily. Increase slightly on warmer days or after gentle movement.
          </p>
        </form>
      )}

      {/* Progress Metric Numbers */}
      <div className="mt-5 flex items-baseline justify-between">
        <div>
          <span className="font-display text-3xl font-extrabold text-[#231426] sm:text-4xl tabular-nums">
            {current.toLocaleString()}
          </span>
          <span className="text-sm font-semibold text-[#745f78] ml-1.5">
            / {goal.toLocaleString()} ml
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-right">
          <span className="font-display text-2xl font-bold text-sky-600 tabular-nums">
            {percentage}%
          </span>
          <span className="text-xs text-[#745f78]">of goal</span>
        </div>
      </div>

      {/* Daily Progress Bar */}
      <div className="mt-2.5 relative h-3.5 w-full overflow-hidden rounded-full bg-slate-100 p-0.5">
        <div
          className="h-full rounded-full bg-gradient-to-r from-sky-400 via-sky-500 to-[#f075aa] transition-all duration-500 ease-out shadow-xs"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Goal Celebration Note */}
      {isGoalReached ? (
        <div className="mt-3 flex items-center gap-2 rounded-2xl bg-emerald-50 px-3.5 py-2 text-xs font-semibold text-emerald-800 animate-fadeIn">
          <Sparkles className="h-4 w-4 text-emerald-600" />
          <span>Wonderful work, mama! You and baby are fully hydrated today 🌸</span>
        </div>
      ) : (
        <p className="mt-2 text-xs text-[#745f78]">
          {(goal - current).toLocaleString()} ml remaining today · Sip small amounts regularly
        </p>
      )}

      {/* Quick Intake Logging Buttons */}
      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <button
          onClick={() => mamaStore.addWater(150)}
          className="flex items-center justify-center gap-1.5 rounded-2xl border border-sky-100 bg-sky-50/70 py-2.5 px-3 text-xs font-semibold text-sky-800 hover:bg-sky-100 hover:border-sky-300 transition-all active:scale-95"
        >
          <Plus className="h-3.5 w-3.5 text-sky-600" />
          <span>+150 ml</span>
          <span className="text-[10px] text-sky-600/70">(Tea/Small)</span>
        </button>

        <button
          onClick={() => mamaStore.addWater(250)}
          className="flex items-center justify-center gap-1.5 rounded-2xl border border-sky-100 bg-sky-50/70 py-2.5 px-3 text-xs font-semibold text-sky-800 hover:bg-sky-100 hover:border-sky-300 transition-all active:scale-95"
        >
          <Plus className="h-3.5 w-3.5 text-sky-600" />
          <span>+250 ml</span>
          <span className="text-[10px] text-sky-600/70">(1 Cup)</span>
        </button>

        <button
          onClick={() => mamaStore.addWater(500)}
          className="flex items-center justify-center gap-1.5 rounded-2xl border border-sky-100 bg-sky-50/70 py-2.5 px-3 text-xs font-semibold text-sky-800 hover:bg-sky-100 hover:border-sky-300 transition-all active:scale-95"
        >
          <Plus className="h-3.5 w-3.5 text-sky-600" />
          <span>+500 ml</span>
          <span className="text-[10px] text-sky-600/70">(Bottle)</span>
        </button>

        <button
          onClick={() => mamaStore.addWater(-250)}
          disabled={current === 0}
          className="flex items-center justify-center gap-1.5 rounded-2xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-all disabled:opacity-40"
          title="Undo 250ml"
        >
          <Minus className="h-3.5 w-3.5" />
          <span>-250 ml</span>
        </button>
      </div>

      {/* Custom Amount Form & Reset */}
      <div className="mt-3.5 flex items-center justify-between gap-3 border-t border-[#f0dfea] pt-3.5">
        <form onSubmit={handleCustomLog} className="flex items-center gap-2">
          <input
            type="number"
            step="50"
            min="10"
            max="1500"
            placeholder="Custom ml"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            className="w-24 rounded-xl border border-[#f0dfea] bg-[#fff8fb] px-2.5 py-1 text-xs text-[#231426] placeholder-[#745f78] focus:border-[#f075aa] focus:bg-white focus:outline-none"
          />
          <button
            type="submit"
            disabled={!customAmount}
            className="rounded-xl bg-[#231426] px-3 py-1 text-xs font-semibold text-white hover:bg-[#3d2441] transition-colors disabled:opacity-40"
          >
            + Add
          </button>
        </form>

        <button
          onClick={() => {
            if (current > 0 && confirm('Reset today’s water intake back to 0 ml?')) {
              mamaStore.resetWater();
            }
          }}
          disabled={current === 0}
          className="flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-rose-500 disabled:opacity-30 transition-colors"
        >
          <RotateCcw className="h-3 w-3" />
          <span>Reset Day</span>
        </button>
      </div>
    </div>
  );
};
