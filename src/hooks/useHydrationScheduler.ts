import { useEffect, useState, useCallback, useRef } from 'react';
import { useMamaStore, mamaStore, INITIAL_HYDRATION_SCHEDULE } from '../store/useMamaStore';
import {
  isWithinActiveHours,
  calculateNextReminder,
  formatCountdown,
  triggerHydrationAlert,
} from '../utils/hydrationScheduler';

export function useHydrationScheduler() {
  const { profile } = useMamaStore();
  const schedule = profile.hydrationSchedule || INITIAL_HYDRATION_SCHEDULE;

  const [countdownText, setCountdownText] = useState<string>('');
  const [isInActiveWindow, setIsInActiveWindow] = useState<boolean>(true);

  // Keep ref to avoid stale closure during interval tick
  const scheduleRef = useRef(schedule);
  scheduleRef.current = schedule;

  // Initialize or repair nextReminderTime if missing or overdue on mount
  useEffect(() => {
    if (!schedule.enabled) return;

    const now = Date.now();
    const existingNext = schedule.nextReminderTime ? new Date(schedule.nextReminderTime).getTime() : 0;

    // If no next reminder or next reminder is more than 5 minutes in the past
    if (!existingNext || existingNext < now - 5 * 60 * 1000) {
      const nextDate = calculateNextReminder(schedule);
      mamaStore.setHydrationSchedule({
        nextReminderTime: nextDate.toISOString(),
      });
    }
  }, [schedule.enabled, schedule.intervalMinutes, schedule.startTime, schedule.endTime]);

  // Main tick loop: check time every 10 seconds and update countdown every second
  useEffect(() => {
    const updateCountdown = () => {
      const cur = scheduleRef.current;
      const inWindow = isWithinActiveHours(cur.startTime, cur.endTime);
      setIsInActiveWindow(inWindow);

      if (!cur.enabled) {
        setCountdownText('Paused');
        return;
      }

      if (!inWindow) {
        setCountdownText(`Pauses overnight (Resumes at ${cur.startTime || '08:00'})`);
        return;
      }

      if (cur.snoozedUntil && new Date(cur.snoozedUntil).getTime() > Date.now()) {
        setCountdownText(`Snoozed ${formatCountdown(cur.snoozedUntil)}`);
        return;
      }

      setCountdownText(formatCountdown(cur.nextReminderTime));
    };

    updateCountdown();
    const countdownTimer = setInterval(updateCountdown, 1000);

    // Active checker timer (every 10 seconds)
    const checkScheduleTimer = setInterval(() => {
      const cur = scheduleRef.current;
      if (!cur.enabled) return;

      const now = Date.now();

      // Check if within daytime active hours
      if (!isWithinActiveHours(cur.startTime, cur.endTime)) {
        return;
      }

      // Check if snoozed
      if (cur.snoozedUntil && new Date(cur.snoozedUntil).getTime() > now) {
        return;
      }

      // Check if next reminder timestamp has passed
      if (cur.nextReminderTime) {
        const nextTime = new Date(cur.nextReminderTime).getTime();
        if (now >= nextTime) {
          // Trigger the alert!
          triggerHydrationAlert();
        }
      } else {
        // If no next time set, schedule one
        const nextDate = calculateNextReminder(cur);
        mamaStore.setHydrationSchedule({
          nextReminderTime: nextDate.toISOString(),
        });
      }
    }, 10000);

    return () => {
      clearInterval(countdownTimer);
      clearInterval(checkScheduleTimer);
    };
  }, []);

  const triggerTest = useCallback(() => {
    return triggerHydrationAlert({ isTest: true });
  }, []);

  const snooze = useCallback((minutes: number) => {
    mamaStore.snoozeHydration(minutes);
  }, []);

  const toggleEnabled = useCallback(() => {
    const newEnabled = !schedule.enabled;
    const updates: any = { enabled: newEnabled };
    if (newEnabled) {
      const nextDate = calculateNextReminder({ ...schedule, enabled: true });
      updates.nextReminderTime = nextDate.toISOString();
    }
    mamaStore.setHydrationSchedule(updates);
  }, [schedule]);

  return {
    schedule,
    countdownText,
    isInActiveWindow,
    triggerTest,
    snooze,
    toggleEnabled,
  };
}
