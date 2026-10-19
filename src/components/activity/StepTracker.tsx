import React, { useState, useEffect, useRef } from 'react';
import {
  Footprints,
  Play,
  Pause,
  CheckCircle2,
  Plus,
  MapPin,
  Compass,
  AlertCircle,
  Activity,
  RotateCcw,
  Sparkles,
  Clock,
  Navigation,
} from 'lucide-react';
import { useMamaStore, mamaStore } from '../../store/useMamaStore';

// Haversine formula to calculate distance in meters between two lat/lon coordinates
function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

export const StepTracker: React.FC = () => {
  const { profile, today } = useMamaStore();
  const stepGoal = profile.stepGoal || 8000;
  const todaySteps = today.steps;
  const percentage = Math.min(Math.round((todaySteps / stepGoal) * 100), 100);
  const sessions = today.walkingSessions || [];

  // Live Tracking state
  const [isTracking, setIsTracking] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [sessionSteps, setSessionSteps] = useState(0);
  const [gpsDistanceMeters, setGpsDistanceMeters] = useState(0);
  const [currentSpeedKmh, setCurrentSpeedKmh] = useState<number | null>(null);

  // Sensor & Geolocation status
  const [motionSensorStatus, setMotionSensorStatus] = useState<'idle' | 'granted' | 'denied' | 'unsupported'>('idle');
  const [geoStatus, setGeoStatus] = useState<'idle' | 'active' | 'denied' | 'unsupported'>('idle');
  const [restTip, setRestTip] = useState<string | null>(null);

  // Manual entry modal state
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualCount, setManualCount] = useState('');
  const [manualNotes, setManualNotes] = useState('Gentle outdoor stroll');

  // Motion sensor refs for peak detection
  const lastStepTimeRef = useRef<number>(0);
  const lastMagnitudeRef = useRef<number>(9.8);
  const isRisingRef = useRef<boolean>(false);

  // Geolocation watch id & previous coordinate
  const geoWatchIdRef = useRef<number | null>(null);
  const prevCoordRef = useRef<{ lat: number; lon: number } | null>(null);

  // Formatted timer
  const formatTimer = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Timer interval
  useEffect(() => {
    let interval: any = null;
    if (isTracking) {
      interval = setInterval(() => {
        setElapsedSec((prev) => {
          const next = prev + 1;
          // Hydration pause reminder every 10 minutes
          if (next > 0 && next % 600 === 0) {
            setRestTip('💧 Hydration Check: Sip cool water and catch your breath, mama.');
          }
          return next;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTracking]);

  // DeviceMotion API listener
  useEffect(() => {
    if (!isTracking || motionSensorStatus !== 'granted') return;

    const handleDeviceMotion = (event: DeviceMotionEvent) => {
      const acc = event.acceleration || event.accelerationIncludingGravity;
      if (!acc || acc.x === null || acc.y === null || acc.z === null) return;

      const x = acc.x || 0;
      const y = acc.y || 0;
      const z = acc.z || 0;
      const magnitude = Math.sqrt(x * x + y * y + z * z);
      const delta = magnitude - lastMagnitudeRef.current;
      const now = Date.now();

      // Peak threshold for walking stride ~1.6 m/s² with 280ms minimum spacing
      if (delta > 1.6 && !isRisingRef.current) {
        isRisingRef.current = true;
      } else if (delta < -1.6 && isRisingRef.current) {
        isRisingRef.current = false;
        if (now - lastStepTimeRef.current > 280) {
          lastStepTimeRef.current = now;
          setSessionSteps((s) => s + 1);
          mamaStore.addSteps(1);
        }
      }

      lastMagnitudeRef.current = magnitude;
    };

    window.addEventListener('devicemotion', handleDeviceMotion, { passive: true });
    return () => {
      window.removeEventListener('devicemotion', handleDeviceMotion);
    };
  }, [isTracking, motionSensorStatus]);

  // Geolocation API watcher
  useEffect(() => {
    if (!isTracking) {
      if (geoWatchIdRef.current !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(geoWatchIdRef.current);
        geoWatchIdRef.current = null;
      }
      return;
    }

    if (!navigator.geolocation) {
      setGeoStatus('unsupported');
      return;
    }

    geoWatchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setGeoStatus('active');
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        const speed = pos.coords.speed !== null && pos.coords.speed >= 0 ? pos.coords.speed * 3.6 : null;
        setCurrentSpeedKmh(speed);

        if (prevCoordRef.current) {
          const dist = calculateHaversineDistance(
            prevCoordRef.current.lat,
            prevCoordRef.current.lon,
            lat,
            lon
          );
          // Filter GPS jitter (<2m) and vehicle outliers (>15km/h for gentle walking)
          if (dist >= 2 && dist < 100) {
            setGpsDistanceMeters((prev) => prev + dist);

            // If DeviceMotion is not supported on desktop or device, estimate steps from GPS distance (~0.65m stride)
            if (motionSensorStatus !== 'granted') {
              const estimatedStepsFromGps = Math.round(dist / 0.65);
              if (estimatedStepsFromGps > 0) {
                setSessionSteps((s) => s + estimatedStepsFromGps);
                mamaStore.addSteps(estimatedStepsFromGps);
              }
            }
          }
        }
        prevCoordRef.current = { lat, lon };
      },
      (err) => {
        console.warn('Geolocation position tracking notice:', err.message);
        setGeoStatus('denied');
      },
      {
        enableHighAccuracy: true,
        maximumAge: 3000,
        timeout: 10000,
      }
    );

    return () => {
      if (geoWatchIdRef.current !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(geoWatchIdRef.current);
        geoWatchIdRef.current = null;
      }
    };
  }, [isTracking, motionSensorStatus]);

  // Request DeviceMotion permissions (iOS 13+ support)
  const requestMotionPermission = async (): Promise<boolean> => {
    if (typeof window === 'undefined' || !('DeviceMotionEvent' in window)) {
      setMotionSensorStatus('unsupported');
      return false;
    }

    const DME = window.DeviceMotionEvent as any;
    if (typeof DME.requestPermission === 'function') {
      try {
        const res = await DME.requestPermission();
        if (res === 'granted') {
          setMotionSensorStatus('granted');
          return true;
        } else {
          setMotionSensorStatus('denied');
          return false;
        }
      } catch {
        setMotionSensorStatus('denied');
        return false;
      }
    } else {
      setMotionSensorStatus('granted');
      return true;
    }
  };

  const handleStartWalk = async () => {
    await requestMotionPermission();
    prevCoordRef.current = null;
    setIsTracking(true);
    setRestTip(null);
  };

  const handlePauseWalk = () => {
    setIsTracking(false);
  };

  const handleResumeWalk = () => {
    setIsTracking(true);
  };

  const handleFinishWalk = () => {
    setIsTracking(false);
    const durationMin = Math.max(1, Math.round(elapsedSec / 60));
    // Calculate total session distance: GPS distance if available, otherwise from stride length
    const totalDistKm =
      gpsDistanceMeters > 50
        ? Math.round((gpsDistanceMeters / 1000) * 100) / 100
        : Math.round(((sessionSteps * 0.65) / 1000) * 100) / 100;

    if (elapsedSec > 0 || sessionSteps > 0) {
      mamaStore.addWalkingSession({
        durationSec: elapsedSec,
        steps: sessionSteps,
        distanceKm: totalDistKm,
        mode: motionSensorStatus === 'granted' ? 'sensor' : geoStatus === 'active' ? 'sensor' : 'timer',
        notes: `Gentle pregnancy walk (~${totalDistKm} km in ${durationMin} min)`,
      });
    }

    // Reset session
    setElapsedSec(0);
    setSessionSteps(0);
    setGpsDistanceMeters(0);
    prevCoordRef.current = null;
    setCurrentSpeedKmh(null);
    setRestTip(null);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const count = parseInt(manualCount, 10);
    if (!isNaN(count) && count > 0) {
      const estDistKm = Math.round(((count * 0.65) / 1000) * 100) / 100;
      const estDurationSec = Math.round((count / 100) * 60);

      mamaStore.addWalkingSession({
        durationSec: estDurationSec,
        steps: count,
        distanceKm: estDistKm,
        mode: 'manual',
        notes: manualNotes.trim() || 'Manually logged steps',
      });

      setManualCount('');
      setShowManualModal(false);
    }
  };

  // Distance computation for display
  const sessionDistanceKm =
    gpsDistanceMeters > 50
      ? (gpsDistanceMeters / 1000).toFixed(2)
      : ((sessionSteps * 0.65) / 1000).toFixed(2);

  const totalDistanceTodayKm = ((todaySteps * 0.65) / 1000).toFixed(2);

  return (
    <div className="rounded-3xl border border-[#f0dfea] bg-white p-5 shadow-soft sm:p-7 space-y-6">
      {/* 1. Header with Movement Status */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#f0dfea] pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-500 shadow-xs">
            <Footprints className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-xl font-bold text-[#231426]">
                StepTracker Movement Hub
              </h2>
              <span className="rounded-full bg-amber-100 text-amber-900 border border-amber-200 px-2.5 py-0.5 text-[10px] font-bold">
                {isTracking ? 'Active Movement' : 'Pedometer Ready'}
              </span>
            </div>
            <p className="text-xs text-[#745f78] mt-0.5">
              Powered by real DeviceMotion accelerometer and Geolocation GPS tracking.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowManualModal(true)}
            className="flex items-center gap-1.5 rounded-2xl border border-[#f0dfea] bg-[#fff8fb] px-4 py-2 text-xs font-semibold text-[#231426] hover:bg-white hover:border-[#f075aa] transition-all shadow-xs"
          >
            <Plus className="h-3.5 w-3.5 text-[#f075aa]" />
            <span>Manual Step Entry</span>
          </button>
        </div>
      </div>

      {/* 2. Today's Cumulative Progress Bar & Goal Display */}
      <div>
        <div className="flex items-baseline justify-between mb-2">
          <div>
            <span className="font-display text-3xl font-extrabold text-[#231426] sm:text-4xl tabular-nums">
              {todaySteps.toLocaleString()}
            </span>
            <span className="text-sm font-semibold text-[#745f78] ml-2">
              / {stepGoal.toLocaleString()} daily gentle goal
            </span>
          </div>

          <div className="text-right">
            <span className="font-display text-2xl font-bold text-amber-600 tabular-nums">
              {percentage}%
            </span>
            <span className="text-xs text-[#745f78] ml-1">reached</span>
          </div>
        </div>

        <div className="relative h-3.5 w-full overflow-hidden rounded-full bg-slate-100 p-0.5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-[#f075aa] transition-all duration-500 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between text-xs text-[#745f78]">
          <div className="flex items-center gap-4">
            <span>
              <strong>Total Distance:</strong> ~{totalDistanceTodayKm} km
            </span>
            <span>
              <strong>Active Time:</strong> {today.exerciseMin} mins
            </span>
          </div>
          <span>
            {todaySteps >= stepGoal
              ? '🌸 Daily goal fulfilled! Remember to rest your feet.'
              : `${(stepGoal - todaySteps).toLocaleString()} gentle steps remaining today`}
          </span>
        </div>
      </div>

      {/* 3. Live Walking Session Tracker with DeviceMotion & Geolocation */}
      <div className="rounded-3xl border-2 border-amber-200 bg-gradient-to-br from-amber-50/70 via-white to-amber-50/40 p-5 sm:p-6 shadow-soft">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-amber-500 text-white px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                Live Session Tracker
              </span>

              {/* Sensor Badge */}
              <span className="rounded-full border border-amber-200 bg-white px-2 py-0.5 text-[10px] font-semibold text-amber-900">
                {motionSensorStatus === 'granted'
                  ? '📱 DeviceMotion Active'
                  : geoStatus === 'active'
                  ? '🛰️ Geolocation GPS Active'
                  : '⏱️ Timer Mode'}
              </span>

              {currentSpeedKmh !== null && (
                <span className="rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-semibold">
                  {currentSpeedKmh.toFixed(1)} km/h
                </span>
              )}
            </div>

            <div className="mt-2 flex items-baseline gap-4">
              <div className="font-mono text-4xl font-extrabold text-amber-950 sm:text-5xl">
                {formatTimer(elapsedSec)}
              </div>
              <div className="text-xs text-[#745f78]">
                <span className="font-bold text-amber-900 font-mono text-xl">{sessionSteps}</span> steps this walk (~{sessionDistanceKm} km)
              </div>
            </div>

            <p className="text-xs text-amber-900">
              {isTracking
                ? 'Strolling at your comfortable conversational pace · Listen to your body 💛'
                : 'Ready for a breath of fresh air or an indoor stroll? Tap Start.'}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            {!isTracking ? (
              <button
                onClick={elapsedSec > 0 ? handleResumeWalk : handleStartWalk}
                className="flex items-center gap-2 rounded-2xl bg-amber-500 px-7 py-3 text-xs font-bold text-white shadow-soft hover:bg-amber-600 transition-transform active:scale-95"
              >
                <Play className="h-4 w-4 fill-white" />
                <span>{elapsedSec > 0 ? 'Resume Walk' : 'Start Walking'}</span>
              </button>
            ) : (
              <button
                onClick={handlePauseWalk}
                className="flex items-center gap-2 rounded-2xl bg-[#231426] px-6 py-3 text-xs font-bold text-white shadow-soft hover:bg-[#3d2442] transition-transform active:scale-95"
              >
                <Pause className="h-4 w-4" />
                <span>Pause</span>
              </button>
            )}

            {elapsedSec > 0 && (
              <button
                onClick={handleFinishWalk}
                className="flex items-center gap-1.5 rounded-2xl border border-amber-300 bg-white px-5 py-3 text-xs font-bold text-amber-950 hover:bg-amber-100 transition-colors shadow-xs"
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Finish & Save Log</span>
              </button>
            )}
          </div>
        </div>

        {restTip && (
          <div className="mt-4 rounded-xl border border-sky-200 bg-sky-50 p-2.5 text-xs font-semibold text-sky-900 animate-fadeIn">
            {restTip}
          </div>
        )}
      </div>

      {/* 4. Daily Step Logs & Walking Session History */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-base font-bold text-[#231426]">
            Today's Logged Walking Sessions ({sessions.length})
          </h3>
          <span className="text-xs text-[#745f78]">Saved automatically to your health log</span>
        </div>

        {sessions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#f0dfea] p-6 text-center text-xs text-[#745f78]">
            <Footprints className="mx-auto h-8 w-8 text-amber-400/60 mb-2" />
            <p className="font-semibold text-[#231426]">No walking sessions logged yet today.</p>
            <p className="mt-0.5">Start a live walking session above or tap "Manual Step Entry".</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sessions.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between rounded-2xl border border-[#f0dfea] bg-[#fff8fb] p-3.5 text-xs transition-all hover:bg-white hover:border-[#f075aa]/40 hover:shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700 font-bold">
                    🚶‍♀️
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#231426]">
                        {s.steps.toLocaleString()} steps
                      </span>
                      <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-600 border border-[#f0dfea]">
                        {s.mode === 'manual' ? 'Manual Entry' : s.mode === 'sensor' ? 'Sensor / GPS' : 'Timer Log'}
                      </span>
                    </div>
                    <p className="text-[#745f78] text-[11px] mt-0.5">
                      ~{s.distanceKm} km · {Math.round(s.durationSec / 60)} active minutes {s.notes ? `· ${s.notes}` : ''}
                    </p>
                  </div>
                </div>

                <span className="font-mono text-[11px] text-[#745f78] shrink-0">
                  {s.timestamp}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. Manual Step Entry Modal */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#231426]/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-sm rounded-3xl border border-[#f0dfea] bg-white p-6 shadow-2xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Footprints className="h-4 w-4" />
              </span>
              <h3 className="font-display text-lg font-bold text-[#231426]">
                Log Steps Manually
              </h3>
            </div>
            <p className="text-xs text-[#745f78] mb-4">
              Enter steps counted from a smartwatch, fitness tracker, or your daily stroll.
            </p>

            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#231426] mb-1">
                  Step Count:
                </label>
                <input
                  type="number"
                  required
                  min="10"
                  step="50"
                  placeholder="e.g. 1500"
                  value={manualCount}
                  onChange={(e) => setManualCount(e.target.value)}
                  className="w-full rounded-2xl border border-[#f0dfea] bg-[#fff8fb] p-3 text-center text-lg font-bold text-[#231426] focus:border-[#f075aa] focus:bg-white focus:outline-none"
                  autoFocus
                />
              </div>

              {/* Quick Preset Buttons */}
              <div className="grid grid-cols-4 gap-1.5">
                {[500, 1000, 2000, 3000].map((preset) => (
                  <button
                    type="button"
                    key={preset}
                    onClick={() => setManualCount(String(preset))}
                    className="rounded-xl border border-[#f0dfea] bg-[#fff8fb] py-1.5 text-center text-[11px] font-semibold text-[#745f78] hover:bg-white hover:border-[#f075aa]"
                  >
                    +{preset}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#231426] mb-1">
                  Session Notes (Optional):
                </label>
                <input
                  type="text"
                  placeholder="e.g. Park walk with partner"
                  value={manualNotes}
                  onChange={(e) => setManualNotes(e.target.value)}
                  className="w-full rounded-2xl border border-[#f0dfea] bg-[#fff8fb] p-2.5 text-xs text-[#231426] focus:border-[#f075aa] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowManualModal(false)}
                  className="rounded-2xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!manualCount || Number(manualCount) <= 0}
                  className="rounded-2xl bg-[#f075aa] px-6 py-2.5 text-xs font-bold text-white shadow-soft hover:bg-[#e05892] disabled:opacity-40"
                >
                  Save to Daily Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
