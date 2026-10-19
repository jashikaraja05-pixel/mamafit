import React, { useState } from 'react';
import {
  Droplets,
  Plus,
  Settings2,
  CheckCircle2,
  Sparkles,
  RotateCcw,
  Bell,
  Clock,
  History,
  Volume2,
  Moon,
  ChevronRight,
} from 'lucide-react';
import { useMamaStore, mamaStore } from '../../store/useMamaStore';
import { useHydrationScheduler } from '../../hooks/useHydrationScheduler';
import { HydrationScheduleModal } from '../hydration/HydrationScheduleModal';
import { formatTime12h } from '../../utils/hydrationScheduler';

export const HydrationTrackerCard: React.FC = () => {
  const { profile, today, history } = useMamaStore();
  const { schedule, countdownText, isInActiveWindow, triggerTest, snooze, toggleEnabled } =
    useHydrationScheduler();

  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [customAmount, setCustomAmount] = useState('250');
  const [tempGoal, setTempGoal] = useState(profile.waterGoalMl || 2500);
  const [reminderNotice, setReminderNotice] = useState<string | null>(null);

  const goal = profile.waterGoalMl || 2500;
  const current = today.waterMl;
  const percentage = Math.min(Math.round((current / goal) * 100), 100);
  const isGoalReached = current >= goal && goal > 0;
  const logs = today.waterLogs || [];

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

  const handleTestReminder = () => {
    triggerTest();
    setReminderNotice('Reminder sent! 🌸 Check your screen or hear the water chime.');
    setTimeout(() => setReminderNotice(null), 3000);
  };

  const handleQuickSnooze = (minutes = 15) => {
    snooze(minutes);
    setReminderNotice(`Reminders snoozed for ${minutes} minutes ⏰`);
    setTimeout(() => setReminderNotice(null), 3000);
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-[#f0dfea] bg-white p-5 shadow-soft transition-all hover:border-[#f075aa]/40 sm:p-6">
      {/* Header with Title and Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
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
              Replenishes amniotic fluid, delivers placental nutrients, and prevents leg cramps
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowScheduleModal(true)}
            className="flex items-center gap-1.5 rounded-2xl border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700 hover:bg-sky-100 transition-colors shadow-xs"
            title="Configure Hydration Reminders Schedule"
          >
            <Clock className="h-3.5 w-3.5" />
            <span>Schedule</span>
          </button>

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
      </div>

      {/* Reminder Notice Banner */}
      {reminderNotice && (
        <div className="mt-3 flex items-center gap-2 rounded-2xl border border-sky-200 bg-sky-50 p-2.5 text-xs font-semibold text-sky-800 animate-fadeIn">
          <Sparkles className="h-4 w-4 text-sky-600" />
          <span>{reminderNotice}</span>
        </div>
      )}

      {/* 2. Hydration Reminder Status & Interval Strip */}
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 rounded-2xl border border-sky-100 bg-gradient-to-r from-sky-50/80 via-white to-sky-50/40 p-3 text-xs">
        <div className="flex items-center gap-2.5">
          <button
            onClick={toggleEnabled}
            className={`flex h-7 w-7 items-center justify-center rounded-xl transition-all ${
              schedule.enabled
                ? 'bg-sky-500 text-white shadow-xs'
                : 'bg-slate-200 text-slate-400'
            }`}
            title={schedule.enabled ? 'Click to Pause Reminders' : 'Click to Enable Reminders'}
          >
            <Bell className="h-3.5 w-3.5" />
          </button>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sky-950">
                {schedule.enabled ? `Reminding every ${schedule.intervalMinutes}m` : 'Reminders Paused'}
              </span>
              {schedule.enabled && (
                <span className="rounded-full bg-sky-100 px-2 py-0.2 text-[10px] font-bold text-sky-800">
                  {countdownText}
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#745f78]">
              {schedule.enabled
                ? `Active ${formatTime12h(schedule.startTime)} – ${formatTime12h(schedule.endTime)} · Pauses at night`
                : 'Tap to configure intervals & start gentle reminders'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {schedule.enabled && (
            <button
              onClick={() => handleQuickSnooze(15)}
              className="rounded-xl border border-sky-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-sky-700 hover:bg-sky-50 transition-colors shadow-2xs"
            >
              Snooze 15m
            </button>
          )}

          <button
            onClick={handleTestReminder}
            className="rounded-xl border border-sky-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-sky-700 hover:bg-sky-50 transition-colors shadow-2xs"
          >
            Test Now
          </button>

          <button
            onClick={() => setShowScheduleModal(true)}
            className="flex items-center text-[11px] font-bold text-sky-700 hover:text-sky-900"
          >
            <span>Settings</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
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
            💡 Clinical recommendation: Expectant mothers are advised 2,300 to 2,800 ml (approx 8–10 cups) daily. Increase slightly on warmer days or after gentle movement.
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

      {/* Quick Intake Logging Buttons with Cup & Bottle Sizes */}
      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <button
          onClick={() => mamaStore.addWater(150)}
          className="flex flex-col items-center justify-center rounded-2xl border border-sky-100 bg-sky-50/70 py-2.5 px-3 text-xs font-semibold text-sky-800 hover:bg-sky-100 hover:border-sky-300 transition-all active:scale-95"
        >
          <div className="flex items-center gap-1">
            <Plus className="h-3.5 w-3.5 text-sky-600" />
            <span>+150 ml</span>
          </div>
          <span className="text-[10px] text-sky-600/70">Small Cup</span>
        </button>

        <button
          onClick={() => mamaStore.addWater(250)}
          className="flex flex-col items-center justify-center rounded-2xl border border-sky-100 bg-sky-50/70 py-2.5 px-3 text-xs font-semibold text-sky-800 hover:bg-sky-100 hover:border-sky-300 transition-all active:scale-95"
        >
          <div className="flex items-center gap-1">
            <Plus className="h-3.5 w-3.5 text-sky-600" />
            <span>+250 ml</span>
          </div>
          <span className="text-[10px] text-sky-600/70">Standard Glass</span>
        </button>

        <button
          onClick={() => mamaStore.addWater(500)}
          className="flex flex-col items-center justify-center rounded-2xl border border-sky-100 bg-sky-50/70 py-2.5 px-3 text-xs font-semibold text-sky-800 hover:bg-sky-100 hover:border-sky-300 transition-all active:scale-95"
        >
          <div className="flex items-center gap-1">
            <Plus className="h-3.5 w-3.5 text-sky-600" />
            <span>+500 ml</span>
          </div>
          <span className="text-[10px] text-sky-600/70">Water Bottle</span>
        </button>

        <button
          onClick={() => mamaStore.addWater(750)}
          className="flex flex-col items-center justify-center rounded-2xl border border-sky-100 bg-sky-50/70 py-2.5 px-3 text-xs font-semibold text-sky-800 hover:bg-sky-100 hover:border-sky-300 transition-all active:scale-95"
        >
          <div className="flex items-center gap-1">
            <Plus className="h-3.5 w-3.5 text-sky-600" />
            <span>+750 ml</span>
          </div>
          <span className="text-[10px] text-sky-600/70">Large Bottle</span>
        </button>
      </div>

      {/* Custom Amount Form & History Toggle */}
      <div className="mt-3.5 flex flex-wrap items-center justify-between gap-3 border-t border-[#f0dfea] pt-3.5">
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

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-1 text-[11px] font-semibold text-sky-700 hover:underline"
          >
            <History className="h-3.5 w-3.5" />
            <span>{showHistory ? 'Hide History' : `Logs (${logs.length})`}</span>
          </button>

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

      {/* Today's Intake History Drawer */}
      {showHistory && (
        <div className="mt-3 rounded-2xl border border-sky-100 bg-sky-50/40 p-3 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sky-950">Today’s Water Entries:</span>
            <span className="text-[11px] text-sky-800">{logs.length} logged today</span>
          </div>

          {logs.length === 0 ? (
            <p className="text-[11px] text-sky-700 italic">No drinks logged yet today.</p>
          ) : (
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {logs.map((entry) => (
                <span
                  key={entry.id}
                  className="rounded-xl border border-sky-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-sky-900 shadow-xs"
                >
                  +{entry.amountMl} ml at {entry.timestamp}
                </span>
              ))}
            </div>
          )}

          {/* Past 7 days comparison if history exists */}
          {history.length > 0 && (
            <div className="mt-3 border-t border-sky-200 pt-2">
              <span className="font-bold text-sky-950 text-[11px]">Previous Days:</span>
              <div className="mt-1 flex items-center gap-2 overflow-x-auto">
                {history.slice(0, 5).map((h, i) => (
                  <div key={i} className="flex-1 rounded-xl bg-white p-2 text-center border border-sky-100">
                    <span className="block text-[10px] text-slate-500">{h.date.slice(5)}</span>
                    <span className="font-bold text-sky-900 font-mono text-[11px]">
                      {(h.waterMl / 1000).toFixed(1)}L
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Hydration Schedule Modal */}
      <HydrationScheduleModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
      />
    </div>
  );
};
