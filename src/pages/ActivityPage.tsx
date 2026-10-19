import React, { useState } from 'react';
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
  Activity,
  Compass,
  AlertCircle,
  MapPin,
  Calendar,
} from 'lucide-react';
import { useMamaStore, mamaStore } from '../store/useMamaStore';
import { ProgressRing } from '../components/common/ProgressRing';
import { StepTracker } from '../components/activity/StepTracker';
import { triggerLocalReminder, requestNotificationPermission } from '../utils/notifications';

export const ActivityPage: React.FC = () => {
  const { profile, today, reminders, history } = useMamaStore();

  // Reminders modal state
  const [showAddReminder, setShowAddReminder] = useState(false);
  const [reminderTime, setReminderTime] = useState('10:00');
  const [reminderLabel, setReminderLabel] = useState('Midday Water Sip');
  const [reminderCategory, setReminderCategory] = useState<'water' | 'walk' | 'exercise' | 'meal' | 'rest' | 'appointment'>('water');


  const handleCreateReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reminderTime) return;
    await requestNotificationPermission();
    mamaStore.addReminder(reminderTime, reminderLabel.trim() || 'Wellness Reminder');
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
          Activity, Steps & Maternal Vitals
        </h1>
        <p className="text-xs text-[#745f78]">
          Real-time step counter, walking session timer, fetal kick counter, hydration, and sleep.
        </p>
      </div>

      {/* 2. Walking Step Counter & Live Walking Tracker Component */}
      <StepTracker />


      {/* 4. Fetal Kick Counter Hub */}
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
              Count 10 distinct kicks, flutters, or rolls within a 2-hour window when baby is active
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
                Target: {profile.sleepGoalHours} hours (preferably left-side position with supportive pillows)
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

      {/* 6. Configurable Reminders for Water, Walking, Meals & Rest */}
      <div className="rounded-3xl border border-[#f0dfea] bg-white p-5 shadow-soft sm:p-7">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
              <Bell className="h-4 w-4" />
            </span>
            <div>
              <h2 className="font-display text-xl font-bold text-[#231426]">
                Configurable Reminders & Notifications
              </h2>
              <p className="text-xs text-[#745f78]">
                Gentle reminders for hydration, walking strolls, meals, rest, and appointments.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAddReminder(!showAddReminder)}
            className="flex items-center gap-1.5 rounded-2xl bg-[#f075aa] px-3.5 py-1.5 text-xs font-bold text-white shadow-soft hover:bg-[#e05892]"
          >
            <Plus className="h-4 w-4" />
            <span>{showAddReminder ? 'Cancel' : 'New Reminder'}</span>
          </button>
        </div>

        {showAddReminder && (
          <form onSubmit={handleCreateReminder} className="mb-4 rounded-2xl border border-sky-100 bg-sky-50/50 p-4 text-xs space-y-3">
            <h4 className="font-bold text-sky-950">Add Custom Reminder:</h4>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <label className="block text-[#745f78] mb-1 font-semibold">Reminder Time:</label>
                <input
                  type="time"
                  required
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-[#745f78] mb-1 font-semibold">Label:</label>
                <input
                  type="text"
                  placeholder="e.g. Afternoon Water & Stretch"
                  value={reminderLabel}
                  onChange={(e) => setReminderLabel(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-[#745f78] mb-1 font-semibold">Category:</label>
                <select
                  value={reminderCategory}
                  onChange={(e) => setReminderCategory(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs focus:outline-none focus:border-sky-500"
                >
                  <option value="water">Hydration (Water)</option>
                  <option value="walk">Gentle Walk Stroll</option>
                  <option value="exercise">Pregnancy Exercise / Kegels</option>
                  <option value="meal">Nourishing Meal / Snack</option>
                  <option value="rest">Rest & Sleep</option>
                  <option value="appointment">Prenatal Appointment</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="rounded-xl bg-sky-600 px-5 py-2 text-xs font-bold text-white hover:bg-sky-700"
            >
              Save Reminder
            </button>
          </form>
        )}

        <div className="space-y-2">
          {reminders.map((r) => (
            <div
              key={r.id}
              className="flex items-center justify-between rounded-2xl border border-[#f0dfea] bg-[#fff8fb] px-4 py-3 text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-sky-800 text-sm">{r.time}</span>
                <span className="font-medium text-[#231426]">{r.label}</span>
                {r.category && (
                  <span className="rounded-full bg-white px-2 py-0.5 text-[10px] uppercase font-bold text-[#745f78] border border-[#f0dfea]">
                    {r.category}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => mamaStore.toggleReminder(r.id)}
                  className={`rounded-full p-1.5 transition-colors ${
                    r.enabled ? 'text-sky-600 hover:bg-sky-50' : 'text-slate-400 hover:bg-slate-100'
                  }`}
                  title={r.enabled ? 'Disable' : 'Enable'}
                >
                  {r.enabled ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => mamaStore.deleteReminder(r.id)}
                  className="rounded-full p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50"
                  title="Delete reminder"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. Daily Symptoms Journal */}
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
