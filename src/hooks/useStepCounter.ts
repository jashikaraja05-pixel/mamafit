import { useState, useEffect, useRef } from 'react';
import { mamaStore } from '../store/useMamaStore';

export type SensorStatus = 'idle' | 'prompt' | 'granted' | 'denied' | 'unsupported';

export interface UseStepCounterReturn {
  isWalking: boolean;
  walkSeconds: number;
  sessionSteps: number;
  distanceKm: number;
  sensorStatus: SensorStatus;
  warmupActive: boolean;
  cooldownActive: boolean;
  restReminder: string | null;
  startWalking: () => Promise<void>;
  pauseWalking: () => void;
  resumeWalking: () => void;
  finishWalking: () => void;
  addManualSteps: (steps: number) => void;
}

export function useStepCounter(): UseStepCounterReturn {
  const [isWalking, setIsWalking] = useState(false);
  const [walkSeconds, setWalkSeconds] = useState(0);
  const [sessionSteps, setSessionSteps] = useState(0);
  const [sensorStatus, setSensorStatus] = useState<SensorStatus>('idle');
  const [restReminder, setRestReminder] = useState<string | null>(null);

  // Peak detection state for real accelerometer motion
  const lastStepTimeRef = useRef<number>(0);
  const lastMagnitudeRef = useRef<number>(9.8);
  const isRisingRef = useRef<boolean>(false);

  // Stride length ~0.65m for gentle walking
  const distanceKm = Math.round((sessionSteps * 0.65) / 10) / 100;

  // Reminders for pregnancy-safe pacing
  const warmupActive = isWalking && walkSeconds < 180; // First 3 mins
  const cooldownActive = isWalking && walkSeconds > 900 && walkSeconds <= 1200; // After 15 mins

  // Timer interval
  useEffect(() => {
    let interval: any = null;
    if (isWalking) {
      interval = setInterval(() => {
        setWalkSeconds((s) => {
          const next = s + 1;
          // Hydration & rest reminder every 10 minutes
          if (next > 0 && next % 600 === 0) {
            setRestReminder('Gentle Pause: Sip cool water and catch your breath mama 💧');
          }
          return next;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isWalking]);

  // Accelerometer motion event listener
  useEffect(() => {
    if (!isWalking || sensorStatus !== 'granted') return;

    const handleMotion = (event: DeviceMotionEvent) => {
      // Use acceleration (gravity removed) if available, otherwise accelerationIncludingGravity
      const acc = event.acceleration || event.accelerationIncludingGravity;
      if (!acc || acc.x === null || acc.y === null || acc.z === null) return;

      const x = acc.x || 0;
      const y = acc.y || 0;
      const z = acc.z || 0;

      // Magnitude vector
      const magnitude = Math.sqrt(x * x + y * y + z * z);
      const delta = magnitude - lastMagnitudeRef.current;
      const now = Date.now();

      // Peak detection with threshold ~1.8m/s² and debounce 280ms
      const threshold = 1.6;
      const minStepIntervalMs = 280;

      if (delta > threshold && !isRisingRef.current) {
        isRisingRef.current = true;
      } else if (delta < -threshold && isRisingRef.current) {
        isRisingRef.current = false;
        if (now - lastStepTimeRef.current > minStepIntervalMs) {
          lastStepTimeRef.current = now;
          setSessionSteps((prev) => prev + 1);
          mamaStore.addSteps(1);
        }
      }

      lastMagnitudeRef.current = magnitude;
    };

    window.addEventListener('devicemotion', handleMotion, { passive: true });
    return () => {
      window.removeEventListener('devicemotion', handleMotion);
    };
  }, [isWalking, sensorStatus]);

  const requestSensorPermission = async (): Promise<boolean> => {
    if (typeof window === 'undefined') return false;

    // Check if DeviceMotionEvent exists
    if (!('DeviceMotionEvent' in window)) {
      setSensorStatus('unsupported');
      return false;
    }

    // iOS 13+ requires explicit permission request
    const DME = window.DeviceMotionEvent as any;
    if (typeof DME.requestPermission === 'function') {
      try {
        const response = await DME.requestPermission();
        if (response === 'granted') {
          setSensorStatus('granted');
          return true;
        } else {
          setSensorStatus('denied');
          return false;
        }
      } catch (err) {
        console.warn('Error requesting device motion:', err);
        setSensorStatus('denied');
        return false;
      }
    } else {
      // Standard browser / Android / laptop - sensor is accessible directly
      setSensorStatus('granted');
      return true;
    }
  };

  const startWalking = async () => {
    await requestSensorPermission();
    setIsWalking(true);
    setRestReminder(null);
  };

  const pauseWalking = () => {
    setIsWalking(false);
  };

  const resumeWalking = () => {
    setIsWalking(true);
  };

  const finishWalking = () => {
    setIsWalking(false);
    if (walkSeconds > 0) {
      const minutes = Math.max(1, Math.round(walkSeconds / 60));
      mamaStore.addWalkingSession({
        durationSec: walkSeconds,
        steps: sessionSteps,
        distanceKm,
        mode: sensorStatus === 'granted' ? 'sensor' : 'timer',
        paceMinKm: sessionSteps > 0 && distanceKm > 0 ? `${(minutes / distanceKm).toFixed(1)} min/km` : undefined,
      });
    }
    setWalkSeconds(0);
    setSessionSteps(0);
    setRestReminder(null);
  };

  const addManualSteps = (steps: number) => {
    if (steps <= 0) return;
    const estDistance = Math.round((steps * 0.65) / 10) / 100;
    // Estimate 100 steps per minute of gentle walking
    const estDurationSec = Math.round((steps / 100) * 60);

    mamaStore.addWalkingSession({
      durationSec: estDurationSec,
      steps,
      distanceKm: estDistance,
      mode: 'manual',
      notes: 'Manually entered gentle stroll',
    });
  };

  return {
    isWalking,
    walkSeconds,
    sessionSteps,
    distanceKm,
    sensorStatus,
    warmupActive,
    cooldownActive,
    restReminder,
    startWalking,
    pauseWalking,
    resumeWalking,
    finishWalking,
    addManualSteps,
  };
}
