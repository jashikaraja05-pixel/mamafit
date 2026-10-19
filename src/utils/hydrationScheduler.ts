import { HydrationScheduleConfig } from '../types';
import { mamaStore } from '../store/useMamaStore';
import { playWaterChime, triggerLocalReminder, getNotificationPermission, requestNotificationPermission } from './notifications';

export const MATERNAL_HYDRATION_MESSAGES = [
  'Time for a gentle sip of cool water mama 💧 Your amniotic fluid and baby say thank you!',
  'Gentle hydration pause 🌸 Nourish your body, replenish your placenta, and ease muscle fatigue.',
  'Take a deep breath and enjoy a refreshing glass of water 🌿 You are growing a miracle!',
  'Sip, smile, and hydrate 💧 Staying well-hydrated helps prevent Braxton Hicks and headaches.',
  'A loving sip for you and baby ✨ Aim for small, regular drinks throughout your day.',
  'Cool water break mama 💛 Supporting your increased blood volume and healthy digestion.',
];

/**
 * Check if the current time is within the user's configured active daytime hours
 */
export function isWithinActiveHours(startTime = '08:00', endTime = '21:30', date = new Date()): boolean {
  const currentMinutes = date.getHours() * 60 + date.getMinutes();

  const [startH, startM] = startTime.split(':').map(Number);
  const startMinutes = (startH || 8) * 60 + (startM || 0);

  const [endH, endM] = endTime.split(':').map(Number);
  const endMinutes = (endH || 21) * 60 + (endM || 30);

  if (startMinutes <= endMinutes) {
    return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
  }
  // Handles crossing midnight if someone sets night hours
  return currentMinutes >= startMinutes || currentMinutes <= endMinutes;
}

/**
 * Convert 24-hour time "08:00" to friendly 12-hour "8:00 AM"
 */
export function formatTime12h(time24: string): string {
  if (!time24) return '';
  const [hStr, mStr] = time24.split(':');
  let h = parseInt(hStr, 10);
  const m = mStr || '00';
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  if (h === 0) h = 12;
  return `${h}:${m} ${ampm}`;
}

/**
 * Format timestamp into friendly countdown: "in 24m", "in 1h 10m", "due now", etc.
 */
export function formatCountdown(targetIsoOrDate?: string | Date | null, startTime = '08:00'): string {
  if (!targetIsoOrDate) return 'Not scheduled';

  const target = typeof targetIsoOrDate === 'string' ? new Date(targetIsoOrDate).getTime() : targetIsoOrDate.getTime();
  const now = Date.now();
  const diffMs = target - now;

  if (diffMs <= 0) {
    return 'Due now';
  }

  const diffMinutes = Math.round(diffMs / 60000);

  if (diffMinutes < 1) {
    return 'in less than a minute';
  }
  if (diffMinutes < 60) {
    return `in ${diffMinutes} min${diffMinutes === 1 ? '' : 's'}`;
  }

  const hours = Math.floor(diffMinutes / 60);
  const remainingMins = diffMinutes % 60;

  if (remainingMins === 0) {
    return `in ${hours} hr${hours === 1 ? '' : 's'}`;
  }
  return `in ${hours}h ${remainingMins}m`;
}

/**
 * Determine the next scheduled reminder timestamp based on schedule settings
 */
export function calculateNextReminder(schedule: HydrationScheduleConfig): Date {
  const now = new Date();

  // If snoozed into the future, respect snooze time
  if (schedule.snoozedUntil) {
    const snoozeDate = new Date(schedule.snoozedUntil);
    if (snoozeDate.getTime() > now.getTime()) {
      return snoozeDate;
    }
  }

  // If already scheduled in the future, keep it
  if (schedule.nextReminderTime) {
    const nextDate = new Date(schedule.nextReminderTime);
    if (nextDate.getTime() > now.getTime()) {
      return nextDate;
    }
  }

  const intervalMinutes = schedule.intervalMinutes || 60;
  const target = new Date(now.getTime() + intervalMinutes * 60000);

  // Check if target falls within active daytime hours
  if (!isWithinActiveHours(schedule.startTime, schedule.endTime, target)) {
    // If past end time tonight, reschedule for tomorrow's start time
    const [startH, startM] = (schedule.startTime || '08:00').split(':').map(Number);
    const tomorrowStart = new Date(now);
    // If target is past end time (usually evening), advance to next morning
    if (now.getHours() >= (Number(schedule.endTime?.split(':')[0]) || 21)) {
      tomorrowStart.setDate(tomorrowStart.getDate() + 1);
    }
    tomorrowStart.setHours(startH || 8, startM || 0, 0, 0);
    return tomorrowStart;
  }

  return target;
}

export interface HydrationAlertDetail {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isTest?: boolean;
}

export const HYDRATION_ALERT_EVENT = 'mamafit-hydration-alert';

/**
 * Dispatches hydration notification through audio, browser notification, and in-app toast
 */
export function triggerHydrationAlert(options?: { isTest?: boolean; customMessage?: string }): HydrationAlertDetail {
  const state = mamaStore.getState();
  const schedule = state.profile.hydrationSchedule;

  const randomIndex = Math.floor(Math.random() * MATERNAL_HYDRATION_MESSAGES.length);
  const message = options?.customMessage || MATERNAL_HYDRATION_MESSAGES[randomIndex];
  const title = options?.isTest ? 'Hydration Reminder (Test)' : 'Hydration Reminder';

  // 1. Play soft water chime if enabled
  if (schedule?.soundEnabled !== false) {
    playWaterChime();
  }

  // 2. Trigger browser notification if enabled
  if (schedule?.browserNotificationEnabled !== false) {
    triggerLocalReminder(title, message, '💧');
  }

  const detail: HydrationAlertDetail = {
    id: `hyd-${Date.now()}`,
    title,
    message,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    isTest: options?.isTest,
  };

  // 3. Dispatch in-app interactive toast event
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(HYDRATION_ALERT_EVENT, { detail }));
  }

  // 4. Update store schedule unless test
  if (!options?.isTest) {
    mamaStore.recordHydrationReminderTriggered();
  }

  return detail;
}
