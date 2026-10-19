import React, { useState, useEffect } from 'react';
import {
  Droplets,
  Footprints,
  Play,
  Pause,
  RotateCcw,
  Heart,
  Moon,
  Plus,
  Trash2,
  Clock,
  Sparkles,
  Baby,
  CheckCircle2,
  Bell,
  BellOff,
} from 'lucide-react';
import { useMamaStore, mamaStore } from '../store/useMamaStore';
import { ProgressRing } from '../components/common/ProgressRing';

export const ActivityPage: React.FC = () => {
  const { profile, today, reminders } = useMamaStore();

  // Walking session live timer state
  const [isWalking, setIsWalking] = useState(false);
  const [walkSeconds, setWalkSeconds] = useState(0);

  // New reminder modal state
  const [showAddReminder, setShowAddReminder] = useState(false);
  const [reminderTime, setReminderTime] = useState('10:00');
  const [reminderLabel, setReminderLabel] = useState('Morning Sip of Water');

  // Walking timer interval
  useEffect(() => {
    let interval: any = null;
    if (isWalking) {
      interval = setInterval(() => {
        setWalkSeconds((s) => s + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isWalking]);

  const handleFinishWalk = () => {
    const minutes = Math.max(1, Math.round(walkSeconds / 60));
    // Estimate ~100 steps per minute of gentle walking
    const estimatedSteps = minutes * 100;
    mamaStore.addSteps(estimatedSteps);
    mamaStore.addExerciseMin(minutes);
    setIsWalking(false);
    setWalkSeconds(0);
  };

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleCreateReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reminderTime) return;
    mamaStore.addReminder(reminderTime, reminderLabel.trim() || 'Hydration Reminder');
    setShowAddReminder(false);
    setReminderLabel('');
  };

  const commonSymptoms = [
    'Nausea / Sickness',
    'Mild Fatigue',
    'Lower Backache',
    'Heartburn / Acid',
    'Round Ligament Pull',
    'Swollen Ankles',
    'Radiant & Glowing',
    'Braxton Hicks',
    'Restless Sleep',
    'High Energy',
  ];

  return (
    <div className="space-y-6 pb-24">
      {/* 1. Header */}
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-[#231426] sm:text-3xl">
          Activity & Maternal Vitals
        </h1>
        <p className="text-xs text-[#745f78]">
          Track your daily hydration, gentle steps, fetal kick movements, and resting sleep.
        </p>
      </div>

      {/* 2. Hydration Hub Card */}
      <div className="rounded-3xl border border-[#f0dfea] bg-white p-5 shadow-soft sm:p-7">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-50 text-sky-500">
                <Droplets className="h-5 w-5" />
              </div>
              <h2 className="font-display text-xl font-bold text-[#231426]">
                Hydration Tracker
              </h2>
            </div>
            <p className="text-xs text-[#745f78]">
              Target: {(profile.waterGoalMl / 1000).toFixed(1)} L (supports amniotic fluid & reduces swelling)
            </p>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-3xl font-bold text-[#231426]">
                {(today.waterMl / 1000).toFixed(2)}
              </span>
              <span className="text-sm text-[#745f78]">
                / {(profile.waterGoalMl / 1000).toFixed(1)} Liters
              </span>
            </div>
          </div>

          <div className="flex shrink-0 items-center justify-center">
            <ProgressRing
              value={today.waterMl / profile.waterGoalMl}
              size={110}
              stroke={10}
              color="#38bdf8"
              trackColor="#e0f2fe"
            >
              <span className="font-display text-xl font-bold text-sky-600">
                {Math.round((today.waterMl / profile.waterGoalMl) * 100)}%
              </span>
            </ProgressRing>
          </div>
        </div>

        {/* Quick Add Water Buttons */}
        <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-[#f0dfea] pt-5">
          <button
            onClick={() => mamaStore.addWater(250)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-sky-50 py-2.5 px-3 text-xs font-semibold text-sky-700 hover:bg-sky-100 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            +250 ml (1 cup)
          </button>
          <button
            onClick={() => mamaStore.addWater(500)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-sky-50 py-2.5 px-3 text-xs font-semibold text-sky-700 hover:bg-sky-100 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            +500 ml (Bottle)
          </button>
          <button
            onClick={() => mamaStore.resetWater()}
            className="flex items-center justify-center rounded-2xl border border-slate-200 py-2.5 px-3 text-xs font-medium text-slate-500 hover:bg-slate-50 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1" />
            Reset
          </button>
        </div>

        {/* Reminders section inside Hydration */}
        <div className="mt-5 rounded-2xl border border-sky-100 bg-sky-50/50 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-sky-600" />
              <h3 className="text-xs font-bold text-sky-950">Water & Vitamin Reminders</h3>
            </div>
            <button
              onClick={() => setShowAddReminder(!showAddReminder)}
              className="text-xs font-semibold text-sky-700 hover:underline"
            >
              {showAddReminder ? 'Cancel' : '+ New Reminder'}
            </button>
          </div>

          {showAddReminder && (
            <form onSubmit={handleCreateReminder} className="mb-3 space-y-2 rounded-xl bg-white p-3 border border-sky-200 shadow-xs">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="time"
                  required
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="rounded-lg border border-slate-200 p-1.5 text-xs focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="e.g. Afternoon Water Sip"
                  value={reminderLabel}
                  onChange={(e) => setReminderLabel(e.target.value)}
                  className="rounded-lg border border-slate-200 p-1.5 text-xs focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-lg bg-sky-600 py-1.5 text-xs font-semibold text-white hover:bg-sky-700"
              >
                Save Reminder
              </button>
            </form>
          )}

          <div className="space-y-1.5">
            {reminders.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between rounded-xl bg-white px-3 py-2 border border-sky-100 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sky-800">{r.time}</span>
                  <span className="text-[#231426]">{r.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => mamaStore.toggleReminder(r.id)}
                    className={`rounded-full p-1 text-xs font-medium ${
                      r.enabled ? 'text-sky-600' : 'text-slate-400'
                    }`}
                  >
                    {r.enabled ? <Bell className="h-3.5 w-3.5" /> : <BellOff className="h-3.5 w-3.5" />}
                  </button>
                  <button
                    onClick={() => mamaStore.deleteReminder(r.id)}
                    className="text-slate-400 hover:text-rose-500"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Gentle Steps & Live Walking Tracker */}
      <div className="rounded-3xl border border-[#f0dfea] bg-white p-5 shadow-soft sm:p-7">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
              <Footprints className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-[#231426]">
                Gentle Walking & Steps
              </h2>
              <p className="text-xs text-[#745f78]">
                Target: {profile.stepGoal.toLocaleString()} daily steps
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="font-display text-2xl font-bold text-[#231426]">
              {today.steps.toLocaleString()}
            </span>
            <span className="text-xs text-[#745f78]"> steps</span>
          </div>
        </div>

        {/* Live Walking Stopwatch */}
        <div className="mt-5 rounded-2xl border border-amber-100 bg-amber-50/50 p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                Live Walking Session
              </span>
              <div className="font-mono text-3xl font-bold text-amber-950 mt-1">
                {formatTimer(walkSeconds)}
              </div>
              <p className="text-xs text-amber-800">
                {isWalking ? 'Pacing gently · Listen to your body' : 'Ready to step outside or stroll at home?'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {!isWalking ? (
                <button
                  onClick={() => setIsWalking(true)}
                  className="flex items-center gap-2 rounded-2xl bg-amber-500 px-5 py-2.5 text-xs font-semibold text-white shadow-soft hover:bg-amber-600 transition-colors"
                >
                  <Play className="h-4 w-4 fill-white" />
                  {walkSeconds > 0 ? 'Resume Stroll' : 'Start Gentle Walk'}
                </button>
              ) : (
                <button
                  onClick={() => setIsWalking(false)}
                  className="flex items-center gap-2 rounded-2xl bg-amber-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-amber-700 transition-colors"
                >
                  <Pause className="h-4 w-4" />
                  Pause
                </button>
              )}

              {walkSeconds > 0 && (
                <button
                  onClick={handleFinishWalk}
                  className="rounded-2xl border border-amber-300 bg-white px-4 py-2.5 text-xs font-semibold text-amber-900 hover:bg-amber-100 transition-colors"
                >
                  Finish & Log
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Fetal Kick Counter */}
      <div className="rounded-3xl border border-[#f0dfea] bg-white p-5 shadow-soft sm:p-7">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-50 text-[#f075aa]">
                <Baby className="h-5 w-5" />
              </div>
              <h2 className="font-display text-xl font-bold text-[#231426]">
                Fetal Kick Counter
              </h2>
            </div>
            <p className="text-xs text-[#745f78]">
              Count 10 kicks or movements within 2 hours when baby is active
            </p>
          </div>

          <div className="flex items-center gap-1.5 rounded-full bg-[#fff0f6] px-3 py-1 text-xs font-bold text-[#f075aa]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{today.kicks.length} / 10 kicks</span>
          </div>
        </div>

        {/* Big Tap Kick Button */}
        <div className="mt-5 flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#f0dfea] bg-[#fff8fb] p-6 text-center">
          <button
            onClick={() => mamaStore.addKick()}
            className="group relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-tr from-[#f075aa] to-[#fe93a1] text-white shadow-glow hover:scale-105 active:scale-95 transition-all focus:outline-none"
          >
            <Heart className="h-10 w-10 fill-white transition-transform group-hover:scale-110" />
            <span className="absolute -bottom-1 text-[11px] font-bold uppercase tracking-wider text-white">
              Kick
            </span>
          </button>
          <p className="mt-3 text-xs font-medium text-[#231426]">
            Felt a flutter, roll, or kick? Tap the heart!
          </p>
        </div>

        {/* Kick timestamp log */}
        {today.kicks.length > 0 && (
          <div className="mt-4 border-t border-[#f0dfea] pt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#745f78]">
                Today’s Movement Log ({today.kicks.length})
              </span>
              <button
                onClick={() => mamaStore.resetKicks()}
                className="text-[11px] text-slate-400 hover:text-rose-500"
              >
                Reset kicks
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {today.kicks.map((kick, idx) => (
                <span
                  key={kick.id}
                  className="rounded-xl border border-[#f0dfea] bg-[#fff0f6] px-2.5 py-1 text-[11px] font-mono font-medium text-[#f075aa]"
                >
                  #{idx + 1} at {kick.timestamp}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 5. Sleep & Rest Hub */}
      <div className="rounded-3xl border border-[#f0dfea] bg-white p-5 shadow-soft sm:p-7">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500">
              <Moon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-[#231426]">
                Sleep & Rest Hours
              </h2>
              <p className="text-xs text-[#745f78]">
                Target: {profile.sleepGoalHours} hours (preferably left-side position)
              </p>
            </div>
          </div>
          <span className="font-display text-2xl font-bold text-[#231426]">
            {today.sleepHours.toFixed(1)} hrs
          </span>
        </div>

        <div className="mt-4 grid grid-cols-5 gap-2">
          {[6, 7, 7.5, 8, 9].map((hrs) => (
            <button
              key={hrs}
              onClick={() => mamaStore.setSleep(hrs)}
              className={`rounded-2xl py-2 text-xs font-semibold transition-all ${
                today.sleepHours === hrs
                  ? 'bg-indigo-600 text-white shadow-soft'
                  : 'border border-[#f0dfea] bg-[#fff8fb] text-[#745f78] hover:bg-white'
              }`}
            >
              {hrs}h
            </button>
          ))}
        </div>
      </div>

      {/* 6. Daily Symptoms Journal */}
      <div className="rounded-3xl border border-[#f0dfea] bg-white p-5 shadow-soft sm:p-7">
        <h2 className="font-display text-xl font-bold text-[#231426] mb-1">
          Pregnancy Sensations & Symptoms
        </h2>
        <p className="text-xs text-[#745f78] mb-4">
          Tap any sensation to record it for your daily timeline and doctor visit summary:
        </p>

        <div className="flex flex-wrap gap-2">
          {commonSymptoms.map((sym) => {
            const isSelected = today.symptoms.includes(sym);
            return (
              <button
                key={sym}
                onClick={() => mamaStore.toggleSymptom(sym)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                  isSelected
                    ? 'border border-[#f075aa] bg-[#fff0f6] font-semibold text-[#f075aa] shadow-xs'
                    : 'border border-[#f0dfea] bg-white text-[#745f78] hover:border-[#f075aa]/30'
                }`}
              >
                {sym}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
