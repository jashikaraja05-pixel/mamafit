import { useState, useEffect, useRef, useCallback } from 'react';
import { mamaStore } from '../store/useMamaStore';

export type SensorStatus =
  | 'idle'
  | 'checking'
  | 'granted'
  | 'denied'
  | 'unsupported'
  | 'insecure_http';

export type WalkStatus = 'idle' | 'running' | 'paused';

export interface UseStepCounterReturn {
  walkStatus: WalkStatus;
  isWalking: boolean; // Convenience: true when running
  walkSeconds: number;
  sessionSteps: number;
  distanceKm: number;
  cadenceSpm: number;
  liveMagnitude: number;
  sensorStatus: SensorStatus;
  isDeviceMotionActive: boolean;
  errorMessage: string | null;
  warmupActive: boolean;
  cooldownActive: boolean;
  restReminder: string | null;
  startWalking: () => Promise<boolean>;
  pauseWalking: () => void;
  resumeWalking: () => void;
  stopWalking: () => void;
  resetSession: () => void;
  addManualSteps: (steps: number, notes?: string) => void;
  requestPermission: () => Promise<boolean>;
}

export function useStepCounter(): UseStepCounterReturn {
  const [walkStatus, setWalkStatus] = useState<WalkStatus>('idle');
  const [walkSeconds, setWalkSeconds] = useState(0);
  const [sessionSteps, setSessionSteps] = useState(0);
  const [cadenceSpm, setCadenceSpm] = useState(0);
  const [liveMagnitude, setLiveMagnitude] = useState(0);
  const [sensorStatus, setSensorStatus] = useState<SensorStatus>('idle');
  const [isDeviceMotionActive, setIsDeviceMotionActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [restReminder, setRestReminder] = useState<string | null>(null);

  // Stride length ~0.65m for gentle maternal walking
  const distanceKm = Math.round(((sessionSteps * 0.65) / 1000) * 100) / 100;

  // Kinematic refs for real-time accelerometer motion
  const gravityRef = useRef<{ x: number; y: number; z: number }>({ x: 0, y: 9.8, z: 0 });
  const smoothedMagnitudeRef = useRef<number>(0);
  const lastStepTimeRef = useRef<number>(0);
  const isRisingRef = useRef<boolean>(false);
  const eventReceivedCountRef = useRef<number>(0);
  const sensorTimeoutRef = useRef<any>(null);

  // Reminders for pregnancy-safe pacing
  const warmupActive = walkStatus === 'running' && walkSeconds < 180; // First 3 mins
  const cooldownActive = walkStatus === 'running' && walkSeconds > 900 && walkSeconds <= 1200; // After 15 mins

  // Elapsed timer interval
  useEffect(() => {
    let timer: any = null;
    if (walkStatus === 'running') {
      timer = setInterval(() => {
        setWalkSeconds((s) => {
          const next = s + 1;
          // Hydration pause reminder every 10 minutes
          if (next > 0 && next % 600 === 0) {
            setRestReminder('💧 Gentle Hydration Pause: Sip cool water and rest your feet, mama.');
          }
          return next;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [walkStatus]);

  // Request sensor permission and verify hardware
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (typeof window === 'undefined') {
      setSensorStatus('unsupported');
      return false;
    }

    // 1. Check for Secure Context (HTTPS or localhost)
    if (window.isSecureContext === false) {
      setSensorStatus('insecure_http');
      setErrorMessage(
        'Motion sensors require a secure HTTPS connection. Please ensure you are loading this application via HTTPS.'
      );
      return false;
    }

    // 2. Check DeviceMotionEvent existence
    if (!('DeviceMotionEvent' in window)) {
      setSensorStatus('unsupported');
      setErrorMessage(
        'Step motion detection is not supported on this browser or platform. You can log gentle strolls via Manual Step Entry.'
      );
      return false;
    }

    // 3. iOS 13+ Safari/WebKit requires explicit permission via DeviceMotionEvent.requestPermission
    const DME = window.DeviceMotionEvent as any;
    if (typeof DME.requestPermission === 'function') {
      try {
        const response = await DME.requestPermission();
        if (response === 'granted') {
          setSensorStatus('granted');
          setErrorMessage(null);
          return true;
        } else {
          setSensorStatus('denied');
          setErrorMessage(
            'Motion sensor permission was denied. Please allow motion access in iOS Safari Settings > Safari > Motion & Orientation Access.'
          );
          return false;
        }
      } catch (err: any) {
        console.warn('iOS DeviceMotionEvent permission error:', err);
        setSensorStatus('denied');
        setErrorMessage(
          'Could not request motion permissions. Please ensure motion permissions are enabled in your device settings.'
        );
        return false;
      }
    }

    // 4. Android Chrome / Firefox / standard modern browsers
    // Permission is typically granted by default, but we verify active events
    setSensorStatus('granted');
    setErrorMessage(null);
    return true;
  }, []);

  // Motion event listener (active ONLY when walkStatus === 'running')
  useEffect(() => {
    if (walkStatus !== 'running') {
      setIsDeviceMotionActive(false);
      setLiveMagnitude(0);
      if (sensorTimeoutRef.current) {
        clearTimeout(sensorTimeoutRef.current);
        sensorTimeoutRef.current = null;
      }
      return;
    }

    eventReceivedCountRef.current = 0;

    // Timeout check: verify if real accelerometer events arrive within 3 seconds
    sensorTimeoutRef.current = setTimeout(() => {
      if (eventReceivedCountRef.current === 0) {
        // No motion events fired: typical on desktop laptops, tablets without gyro/accel, or iframe restrictions
        setIsDeviceMotionActive(false);
        setSensorStatus('unsupported');
        setErrorMessage(
          'No physical accelerometer sensor events detected. If on a computer or desktop, please open MamaFit on your mobile phone to detect steps while walking.'
        );
      }
    }, 3000);

    const handleMotion = (event: DeviceMotionEvent) => {
      // Check acceleration (linear) and accelerationIncludingGravity
      const acc = event.acceleration;
      const accG = event.accelerationIncludingGravity;

      let dynamicMag = 0;
      let hasValidNumericData = false;

      if (acc && typeof acc.x === 'number' && acc.x !== null) {
        // Linear acceleration (OS removed gravity)
        const x = acc.x || 0;
        const y = acc.y || 0;
        const z = acc.z || 0;
        dynamicMag = Math.sqrt(x * x + y * y + z * z);
        hasValidNumericData = true;
      } else if (accG && typeof accG.x === 'number' && accG.x !== null) {
        // Acceleration with gravity: apply low-pass filter to isolate gravity vector
        const rawX = accG.x || 0;
        const rawY = accG.y || 0;
        const rawZ = accG.z || 0;

        // Exponential smoothing filter for gravity estimation
        const alpha = 0.85;
        gravityRef.current.x = alpha * gravityRef.current.x + (1 - alpha) * rawX;
        gravityRef.current.y = alpha * gravityRef.current.y + (1 - alpha) * rawY;
        gravityRef.current.z = alpha * gravityRef.current.z + (1 - alpha) * rawZ;

        // Dynamic linear component
        const linX = rawX - gravityRef.current.x;
        const linY = rawY - gravityRef.current.y;
        const linZ = rawZ - gravityRef.current.z;

        dynamicMag = Math.sqrt(linX * linX + linY * linY + linZ * linZ);
        hasValidNumericData = true;
      }

      if (!hasValidNumericData) return;

      eventReceivedCountRef.current += 1;
      if (!isDeviceMotionActive) {
        setIsDeviceMotionActive(true);
        setSensorStatus('granted');
        setErrorMessage(null);
      }

      // Smooth the dynamic magnitude to filter out high-frequency sensor noise
      const smoothed = 0.6 * smoothedMagnitudeRef.current + 0.4 * dynamicMag;
      smoothedMagnitudeRef.current = smoothed;

      // Update live magnitude state throttled for UI meter
      setLiveMagnitude(Math.round(smoothed * 10) / 10);

      const now = Date.now();

      // Peak-Valley step detection algorithm calibrated for pregnancy walking
      // Gentle walking threshold: 1.35 m/s² peak, 0.65 m/s² valley reset
      const peakThreshold = 1.35;
      const valleyThreshold = 0.65;
      const minStepIntervalMs = 270; // Max ~220 steps/min cadence limit
      const maxStepIntervalMs = 2000; // Min ~30 steps/min cadence

      if (smoothed > peakThreshold && !isRisingRef.current) {
        isRisingRef.current = true;
      } else if (smoothed < valleyThreshold && isRisingRef.current) {
        isRisingRef.current = false;
        const timeSinceLastStep = now - lastStepTimeRef.current;

        if (timeSinceLastStep >= minStepIntervalMs && timeSinceLastStep <= maxStepIntervalMs) {
          lastStepTimeRef.current = now;

          // Increment session steps
          setSessionSteps((prev) => prev + 1);

          // Update store live on every verified physical step
          mamaStore.addSteps(1);

          // Update live cadence (steps per minute)
          const currentCadence = Math.round(60000 / timeSinceLastStep);
          setCadenceSpm((prev) => (prev === 0 ? currentCadence : Math.round(0.7 * prev + 0.3 * currentCadence)));
        } else if (timeSinceLastStep > maxStepIntervalMs) {
          // Started walking again after a pause
          lastStepTimeRef.current = now;
          setSessionSteps((prev) => prev + 1);
          mamaStore.addSteps(1);
        }
      }
    };

    window.addEventListener('devicemotion', handleMotion, { passive: true });

    return () => {
      window.removeEventListener('devicemotion', handleMotion);
      if (sensorTimeoutRef.current) {
        clearTimeout(sensorTimeoutRef.current);
        sensorTimeoutRef.current = null;
      }
    };
  }, [walkStatus, isDeviceMotionActive]);

  // Start walking control
  const startWalking = async (): Promise<boolean> => {
    setErrorMessage(null);
    setSensorStatus('checking');
    const granted = await requestPermission();

    // Start timer and motion listening
    setWalkStatus('running');
    setRestReminder(null);
    lastStepTimeRef.current = Date.now();
    isRisingRef.current = false;
    return granted;
  };

  // Pause walking control
  const pauseWalking = () => {
    setWalkStatus('paused');
    setCadenceSpm(0);
    setLiveMagnitude(0);
  };

  // Resume walking control
  const resumeWalking = () => {
    setWalkStatus('running');
    lastStepTimeRef.current = Date.now();
    isRisingRef.current = false;
  };

  // Stop walking control: ends session, saves history, updates total exercise minutes
  const stopWalking = () => {
    const totalSec = walkSeconds;
    const finalSteps = sessionSteps;
    const finalDist = distanceKm;

    setWalkStatus('idle');
    setCadenceSpm(0);
    setLiveMagnitude(0);

    // If there was any movement or time, save the walking session to history
    if (totalSec >= 5 || finalSteps > 0) {
      const durationMin = Math.max(1, Math.round(totalSec / 60));
      const paceStr =
        finalSteps > 0 && finalDist > 0 ? `${(durationMin / finalDist).toFixed(1)} min/km` : undefined;

      mamaStore.addWalkingSession(
        {
          durationSec: totalSec,
          steps: finalSteps,
          distanceKm: finalDist,
          mode: isDeviceMotionActive ? 'sensor' : 'timer',
          paceMinKm: paceStr,
          notes: `Gentle pregnancy walk (${durationMin} min, ${finalSteps} steps)`,
        },
        true // alreadyCountedInToday = true (steps were counted live in real-time)
      );
    }

    // Reset current session counters
    setWalkSeconds(0);
    setSessionSteps(0);
    setRestReminder(null);
  };

  // Reset session without saving
  const resetSession = () => {
    setWalkStatus('idle');
    setWalkSeconds(0);
    setSessionSteps(0);
    setCadenceSpm(0);
    setLiveMagnitude(0);
    setRestReminder(null);
  };

  // Add manual steps (for desktop or when walking without phone)
  const addManualSteps = (steps: number, notes?: string) => {
    if (steps <= 0) return;
    const estDistance = Math.round(((steps * 0.65) / 1000) * 100) / 100;
    // Estimate 100 steps per minute of gentle walking
    const estDurationSec = Math.round((steps / 100) * 60);

    mamaStore.addWalkingSession(
      {
        durationSec: estDurationSec,
        steps,
        distanceKm: estDistance,
        mode: 'manual',
        notes: notes || 'Manually logged gentle stroll',
      },
      false // alreadyCountedInToday = false (add to total daily steps)
    );
  };

  return {
    walkStatus,
    isWalking: walkStatus === 'running',
    walkSeconds,
    sessionSteps,
    distanceKm,
    cadenceSpm,
    liveMagnitude,
    sensorStatus,
    isDeviceMotionActive,
    errorMessage,
    warmupActive,
    cooldownActive,
    restReminder,
    startWalking,
    pauseWalking,
    resumeWalking,
    stopWalking,
    resetSession,
    addManualSteps,
    requestPermission,
  };
}
