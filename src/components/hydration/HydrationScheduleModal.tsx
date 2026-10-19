import React, { useState, useEffect } from 'react';
import {
  Bell,
  Clock,
  Volume2,
  VolumeX,
  X,
  Check,
  Sparkles,
  Droplets,
  Moon,
  Sun,
  ShieldCheck,
  Send,
  Sliders,
} from 'lucide-react';
import { useMamaStore, mamaStore, INITIAL_HYDRATION_SCHEDULE } from '../../store/useMamaStore';
import {
  formatTime12h,
  formatCountdown,
  triggerHydrationAlert,
} from '../../utils/hydrationScheduler';
import {
  getNotificationPermission,
  requestNotificationPermission,
  playWaterChime,
  NotificationPermissionState,
} from '../../utils/notifications';

interface HydrationScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const INTERVAL_PRESETS = [
  { minutes: 30, label: 'Every 30m', desc: 'Frequent small sips' },
  { minutes: 45, label: 'Every 45m', desc: 'Active days' },
  { minutes: 60, label: 'Every 1 hr', desc: 'Doctor recommended 🌸', recommended: true },
  { minutes: 90, label: 'Every 1.5 hrs', desc: 'Moderate pace' },
  { minutes: 120, label: 'Every 2 hrs', desc: 'Larger glasses' },
  { minutes: 180, label: 'Every 3 hrs', desc: 'Relaxed schedule' },
];

export const HydrationScheduleModal: React.FC<HydrationScheduleModalProps> = ({ isOpen, onClose }) => {
  const { profile } = useMamaStore();
  const schedule = profile.hydrationSchedule || INITIAL_HYDRATION_SCHEDULE;

  const [enabled, setEnabled] = useState(schedule.enabled);
  const [intervalMinutes, setIntervalMinutes] = useState(schedule.intervalMinutes || 60);
  const [startTime, setStartTime] = useState(schedule.startTime || '08:00');
  const [endTime, setEndTime] = useState(schedule.endTime || '21:30');
  const [soundEnabled, setSoundEnabled] = useState(schedule.soundEnabled !== false);
  const [browserNotificationEnabled, setBrowserNotificationEnabled] = useState(
    schedule.browserNotificationEnabled !== false
  );
  const [inAppToastEnabled, setInAppToastEnabled] = useState(schedule.inAppToastEnabled !== false);

  const [permissionState, setPermissionState] = useState<NotificationPermissionState>('default');
  const [saveNotice, setSaveNotice] = useState(false);
  const [testNotice, setTestNotice] = useState(false);

  useEffect(() => {
    setPermissionState(getNotificationPermission());
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRequestPermission = async () => {
    const granted = await requestNotificationPermission();
    setPermissionState(getNotificationPermission());
    if (granted) {
      setBrowserNotificationEnabled(true);
    }
  };

  const handleTestChime = () => {
    playWaterChime();
  };

  const handleTestReminder = () => {
    triggerHydrationAlert({ isTest: true });
    setTestNotice(true);
    setTimeout(() => setTestNotice(false), 3000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const now = Date.now();
    const nextTime = new Date(now + intervalMinutes * 60000).toISOString();

    mamaStore.setHydrationSchedule({
      enabled,
      intervalMinutes: Number(intervalMinutes),
      startTime,
      endTime,
      soundEnabled,
      browserNotificationEnabled,
      inAppToastEnabled,
      nextReminderTime: nextTime,
      snoozedUntil: undefined,
    });

    setSaveNotice(true);
    setTimeout(() => {
      setSaveNotice(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#231426]/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-3xl border border-[#f0dfea] bg-[#fff8fb] p-5 sm:p-7 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#f0dfea] pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-500 shadow-xs">
              <Droplets className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-[#231426]">
                Hydration Reminder Scheduler
              </h2>
              <p className="text-xs text-[#745f78]">
                Customized intervals throughout your day to nourish mama & baby
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Notices */}
        {saveNotice && (
          <div className="mt-4 flex items-center gap-2 rounded-2xl bg-emerald-50 p-3 text-xs font-semibold text-emerald-800 animate-fadeIn">
            <Check className="h-4 w-4 text-emerald-600" />
            <span>Hydration schedule updated successfully! 🌸</span>
          </div>
        )}

        {testNotice && (
          <div className="mt-4 flex items-center gap-2 rounded-2xl bg-sky-50 p-3 text-xs font-semibold text-sky-800 animate-fadeIn">
            <Sparkles className="h-4 w-4 text-sky-600" />
            <span>Test reminder sent! Check your notification or in-app toast 💧</span>
          </div>
        )}

        <form onSubmit={handleSave} className="mt-5 space-y-5">
          {/* 1. Main Enable Toggle Card */}
          <div className="flex items-center justify-between rounded-3xl border border-[#f0dfea] bg-white p-4 sm:p-5 shadow-xs">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-2xl transition-colors ${
                  enabled ? 'bg-sky-50 text-sky-600' : 'bg-slate-100 text-slate-400'
                }`}
              >
                <Bell className="h-5 w-5" />
              </div>
              <div>
                <span className="font-display text-base font-bold text-[#231426]">
                  Active Hydration Reminders
                </span>
                <p className="text-xs text-[#745f78]">
                  {enabled
                    ? `Notifying every ${intervalMinutes} min between ${formatTime12h(startTime)} – ${formatTime12h(endTime)}`
                    : 'Reminders are currently paused'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setEnabled(!enabled)}
              className={`relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                enabled ? 'bg-sky-500' : 'bg-slate-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  enabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* 2. Interval Selection */}
          <div className="rounded-3xl border border-[#f0dfea] bg-white p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-sky-500" />
                <span className="font-display text-sm font-bold text-[#231426]">
                  Reminder Interval Frequency
                </span>
              </div>
              <span className="text-xs font-bold text-sky-600">
                {intervalMinutes} minutes
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {INTERVAL_PRESETS.map((p) => {
                const isSelected = intervalMinutes === p.minutes;
                return (
                  <button
                    type="button"
                    key={p.minutes}
                    onClick={() => setIntervalMinutes(p.minutes)}
                    className={`flex flex-col items-start rounded-2xl p-3 text-left transition-all ${
                      isSelected
                        ? 'border-2 border-sky-500 bg-sky-50 shadow-xs'
                        : 'border border-[#f0dfea] bg-[#fff8fb] hover:bg-white hover:border-sky-300'
                    }`}
                  >
                    <div className="flex w-full items-center justify-between">
                      <span className="text-xs font-bold text-[#231426]">{p.label}</span>
                      {isSelected && <Check className="h-3.5 w-3.5 text-sky-600" />}
                    </div>
                    <span className="mt-0.5 text-[10px] text-[#745f78]">{p.desc}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom Minutes Slider */}
            <div className="mt-4 border-t border-[#f0dfea] pt-3">
              <div className="flex items-center justify-between text-xs text-[#745f78] mb-1">
                <span>Fine-tune interval:</span>
                <span className="font-bold text-[#231426]">{intervalMinutes} minutes</span>
              </div>
              <input
                type="range"
                min="15"
                max="240"
                step="5"
                value={intervalMinutes}
                onChange={(e) => setIntervalMinutes(Number(e.target.value))}
                className="w-full accent-sky-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>15 min</span>
                <span>60 min</span>
                <span>120 min</span>
                <span>4 hours</span>
              </div>
            </div>
          </div>

          {/* 3. Daytime Active Window & Sleep Protection */}
          <div className="rounded-3xl border border-[#f0dfea] bg-white p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sun className="h-4 w-4 text-amber-500" />
                <span className="font-display text-sm font-bold text-[#231426]">
                  Active Hours & Sleep Protection
                </span>
              </div>
              <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700">
                Night Safe
              </span>
            </div>

            <p className="text-xs text-[#745f78] mb-3">
              Reminders automatically sleep at night so your rest is never interrupted.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#745f78] mb-1">
                  Morning Wake-up Time
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full rounded-2xl border border-[#f0dfea] bg-[#fff8fb] px-3 py-2 text-xs font-semibold text-[#231426] focus:border-sky-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#745f78] mb-1">
                  Evening Wind-down Time
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full rounded-2xl border border-[#f0dfea] bg-[#fff8fb] px-3 py-2 text-xs font-semibold text-[#231426] focus:border-sky-500 focus:bg-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* 4. Notification Channels (Sound, Browser, In-App) */}
          <div className="rounded-3xl border border-[#f0dfea] bg-white p-4 sm:p-5 shadow-xs space-y-3.5">
            <span className="font-display text-sm font-bold text-[#231426] block">
              Notification Channels & Preferences
            </span>

            {/* Audio Chime */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleTestChime}
                  className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-50 text-sky-600 hover:bg-sky-100 transition-colors"
                  title="Play chime preview"
                >
                  <Volume2 className="h-4 w-4" />
                </button>
                <div>
                  <span className="text-xs font-bold text-[#231426]">Water Droplet Chime</span>
                  <p className="text-[11px] text-[#745f78]">Gentle dual-tone harmonic bell</p>
                </div>
              </div>

              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
                className="h-4 w-4 rounded-sm border-gray-300 accent-sky-500 cursor-pointer"
              />
            </div>

            {/* Browser Notifications */}
            <div className="flex items-center justify-between border-t border-[#f0dfea] pt-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#231426]">Desktop / Mobile System Notifications</span>
                  {permissionState === 'granted' ? (
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-700">
                      Enabled
                    </span>
                  ) : (
                    <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[9px] font-bold text-amber-700">
                      {permissionState === 'denied' ? 'Blocked in Browser' : 'Permission Needed'}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#745f78]">
                  Alerts your phone or desktop even when working on other tabs
                </p>
                {permissionState !== 'granted' && (
                  <button
                    type="button"
                    onClick={handleRequestPermission}
                    className="mt-1 text-[11px] font-bold text-sky-600 hover:underline"
                  >
                    👉 Click to Allow Browser Notifications
                  </button>
                )}
              </div>

              <input
                type="checkbox"
                checked={browserNotificationEnabled}
                onChange={(e) => setBrowserNotificationEnabled(e.target.checked)}
                className="h-4 w-4 rounded-sm border-gray-300 accent-sky-500 cursor-pointer"
              />
            </div>

            {/* In-App Interactive Toast */}
            <div className="flex items-center justify-between border-t border-[#f0dfea] pt-3">
              <div>
                <span className="text-xs font-bold text-[#231426]">In-App Interactive Reminder Banner</span>
                <p className="text-[11px] text-[#745f78]">
                  Floating banner with "+250 ml" and "Snooze 15m" buttons while app is open
                </p>
              </div>

              <input
                type="checkbox"
                checked={inAppToastEnabled}
                onChange={(e) => setInAppToastEnabled(e.target.checked)}
                className="h-4 w-4 rounded-sm border-gray-300 accent-sky-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={handleTestReminder}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-2.5 text-xs font-bold text-sky-800 hover:bg-sky-100 transition-colors shadow-xs"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Send Sample Reminder Now</span>
            </button>

            <div className="flex w-full sm:w-auto items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="flex-1 sm:flex-none rounded-2xl bg-sky-500 px-6 py-2.5 text-xs font-bold text-white shadow-soft hover:bg-sky-600 transition-colors"
              >
                Save Schedule
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
