import React, { useState } from 'react';
import {
  Footprints,
  Play,
  Pause,
  Square,
  CheckCircle2,
  Plus,
  AlertCircle,
  Activity,
  RotateCcw,
  Sparkles,
  Clock,
  Smartphone,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useMamaStore } from '../../store/useMamaStore';
import { useStepCounter } from '../../hooks/useStepCounter';

export const StepTracker: React.FC = () => {
  const { profile, today } = useMamaStore();
  const stepGoal = profile.stepGoal || 8000;
  const todaySteps = today.steps;
  const percentage = Math.min(Math.round((todaySteps / stepGoal) * 100), 100);
  const sessions = today.walkingSessions || [];

  const {
    walkStatus,
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
  } = useStepCounter();

  // Manual entry modal state
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualCount, setManualCount] = useState('');
  const [manualNotes, setManualNotes] = useState('Gentle outdoor stroll');
  const [showSensorInfoModal, setShowSensorInfoModal] = useState(false);

  // Formatted timer
  const formatTimer = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const count = parseInt(manualCount, 10);
    if (!isNaN(count) && count > 0) {
      addManualSteps(count, manualNotes.trim() || 'Manual Step Entry');
      setManualCount('');
      setShowManualModal(false);
    }
  };

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
              <span
                className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${
                  walkStatus === 'running'
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-800 animate-pulse'
                    : walkStatus === 'paused'
                    ? 'border-amber-300 bg-amber-50 text-amber-800'
                    : 'border-slate-200 bg-slate-50 text-slate-600'
                }`}
              >
                {walkStatus === 'running'
                  ? 'Walking Active'
                  : walkStatus === 'paused'
                  ? 'Session Paused'
                  : 'Pedometer Ready'}
              </span>
            </div>
            <p className="text-xs text-[#745f78] mt-0.5">
              Live step detection via real hardware motion sensors · Zero fake steps
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

        <div className="mt-3 flex flex-wrap items-center justify-between text-xs text-[#745f78] gap-2">
          <div className="flex items-center gap-4">
            <span>
              <strong>Total Distance:</strong> ~{totalDistanceTodayKm} km
            </span>
            <span>
              <strong>Active Movement:</strong> {today.exerciseMin} mins
            </span>
          </div>
          <span>
            {todaySteps >= stepGoal
              ? '🌸 Daily goal fulfilled! Remember to rest your feet.'
              : `${(stepGoal - todaySteps).toLocaleString()} gentle steps remaining today`}
          </span>
        </div>
      </div>

      {/* 3. Live Walking Session Tracker with Start, Pause, and Stop Controls */}
      <div className="rounded-3xl border-2 border-amber-200 bg-gradient-to-br from-amber-50/70 via-white to-amber-50/40 p-5 sm:p-6 shadow-soft">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-amber-500 text-white px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                Live Walking Session
              </span>

              {/* Sensor Hardware Status Badge */}
              {isDeviceMotionActive ? (
                <span className="flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                  <Zap className="h-3 w-3 text-emerald-600" />
                  Motion Sensor Active
                </span>
              ) : sensorStatus === 'checking' ? (
                <span className="flex items-center gap-1 rounded-full border border-sky-300 bg-sky-50 px-2.5 py-0.5 text-[10px] font-bold text-sky-800 animate-pulse">
                  <Activity className="h-3 w-3 text-sky-600" />
                  Calibrating Sensor...
                </span>
              ) : sensorStatus === 'unsupported' ? (
                <button
                  onClick={() => setShowSensorInfoModal(true)}
                  className="flex items-center gap-1 rounded-full border border-slate-300 bg-white px-2.5 py-0.5 text-[10px] font-bold text-slate-700 hover:border-amber-400"
                >
                  <Smartphone className="h-3 w-3 text-amber-600" />
                  No Mobile Sensor Detected · Tap Info
                </button>
              ) : sensorStatus === 'denied' ? (
                <button
                  onClick={requestPermission}
                  className="flex items-center gap-1 rounded-full border border-rose-300 bg-rose-50 px-2.5 py-0.5 text-[10px] font-bold text-rose-700 hover:bg-rose-100"
                >
                  <AlertCircle className="h-3 w-3" />
                  Permission Blocked · Tap to Retry
                </button>
              ) : (
                <span className="flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-[10px] font-semibold text-slate-600">
                  <Smartphone className="h-3 w-3" />
                  Ready to Detect
                </span>
              )}

              {cadenceSpm > 0 && (
                <span className="rounded-full bg-amber-100 border border-amber-200 px-2 py-0.5 text-[10px] font-bold text-amber-900">
                  {cadenceSpm} steps/min
                </span>
              )}
            </div>

            {/* Live Timer and Step Counter */}
            <div className="flex items-baseline gap-4 pt-1">
              <div className="font-mono text-4xl font-extrabold text-amber-950 sm:text-5xl tabular-nums">
                {formatTimer(walkSeconds)}
              </div>
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-mono text-2xl sm:text-3xl font-extrabold text-amber-900 tabular-nums">
                    {sessionSteps}
                  </span>
                  <span className="text-xs font-bold text-[#745f78]">steps this walk</span>
                </div>
                <p className="text-[11px] text-[#745f78]">
                  ~{distanceKm} km · {warmupActive ? '🌸 Warm-up pace' : cooldownActive ? '🌿 Cooldown pace' : 'Gentle walking'}
                </p>
              </div>
            </div>

            {/* Live Accelerometer Signal Bar (Proof of Real Motion) */}
            {walkStatus === 'running' && isDeviceMotionActive && (
              <div className="flex items-center gap-2 pt-1 text-xs text-[#745f78]">
                <Activity className="h-3.5 w-3.5 text-emerald-600 animate-pulse" />
                <span className="text-[11px] font-semibold">Motion Dynamics:</span>
                <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all duration-100"
                    style={{ width: `${Math.min(liveMagnitude * 30, 100)}%` }}
                  />
                </div>
                <span className="font-mono text-[10px] text-slate-500">{liveMagnitude} m/s²</span>
              </div>
            )}
          </div>

          {/* START, PAUSE, RESUME, AND STOP CONTROLS */}
          <div className="flex flex-wrap items-center gap-2.5">
            {walkStatus === 'idle' ? (
              /* 1. START CONTROL */
              <button
                onClick={startWalking}
                className="flex items-center gap-2.5 rounded-2xl bg-amber-500 px-8 py-3.5 text-xs font-bold text-white shadow-soft hover:bg-amber-600 transition-all active:scale-95"
              >
                <Play className="h-4 w-4 fill-white" />
                <span>Start Walking</span>
              </button>
            ) : walkStatus === 'running' ? (
              /* 2. PAUSE AND STOP CONTROLS WHILE RUNNING */
              <>
                <button
                  onClick={pauseWalking}
                  className="flex items-center gap-2 rounded-2xl bg-[#231426] px-5 py-3 text-xs font-bold text-white shadow-soft hover:bg-[#3d2442] transition-all active:scale-95"
                  title="Pause Walking Session"
                >
                  <Pause className="h-4 w-4" />
                  <span>Pause</span>
                </button>

                <button
                  onClick={stopWalking}
                  className="flex items-center gap-2 rounded-2xl border-2 border-emerald-600 bg-emerald-600 px-5 py-3 text-xs font-bold text-white shadow-soft hover:bg-emerald-700 transition-all active:scale-95"
                  title="Stop and Save Walking Session"
                >
                  <Square className="h-4 w-4 fill-white" />
                  <span>Stop & Save</span>
                </button>
              </>
            ) : (
              /* 3. RESUME AND STOP CONTROLS WHILE PAUSED */
              <>
                <button
                  onClick={resumeWalking}
                  className="flex items-center gap-2 rounded-2xl bg-amber-500 px-5 py-3 text-xs font-bold text-white shadow-soft hover:bg-amber-600 transition-all active:scale-95"
                  title="Resume Walking Session"
                >
                  <Play className="h-4 w-4 fill-white" />
                  <span>Resume Walk</span>
                </button>

                <button
                  onClick={stopWalking}
                  className="flex items-center gap-2 rounded-2xl border-2 border-emerald-600 bg-emerald-600 px-5 py-3 text-xs font-bold text-white shadow-soft hover:bg-emerald-700 transition-all active:scale-95"
                  title="Finish and Save Walk"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Stop & Save</span>
                </button>

                <button
                  onClick={resetSession}
                  className="text-[11px] font-semibold text-slate-400 hover:text-rose-500 px-2 py-1 transition-colors"
                  title="Discard this session"
                >
                  Discard
                </button>
              </>
            )}
          </div>
        </div>

        {/* Rest tip during long walks */}
        {restReminder && (
          <div className="mt-4 rounded-2xl border border-sky-200 bg-sky-50 p-3 text-xs font-semibold text-sky-900 animate-fadeIn">
            {restReminder}
          </div>
        )}

        {/* Helpful error / Unsupported Device Notification */}
        {errorMessage && (
          <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-amber-300 bg-amber-50/90 p-3.5 text-xs text-amber-950">
            <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold">Notice regarding step detection on this device:</p>
              <p className="mt-0.5 text-[11px] leading-relaxed text-amber-900">{errorMessage}</p>
              <div className="mt-2 flex items-center gap-2">
                <button
                  onClick={() => setShowManualModal(true)}
                  className="rounded-xl bg-amber-600 px-3 py-1 font-bold text-white hover:bg-amber-700 text-[11px]"
                >
                  Log Steps Manually
                </button>
                <button
                  onClick={() => setShowSensorInfoModal(true)}
                  className="text-[11px] font-semibold text-amber-900 underline"
                >
                  How real step counting works
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. Daily Step Logs & Walking Session History */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-base font-bold text-[#231426]">
            Today's Logged Walking Sessions ({sessions.length})
          </h3>
          <span className="text-xs text-[#745f78]">Saved automatically to your daily health log</span>
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
                        {s.mode === 'manual' ? 'Manual Entry' : s.mode === 'sensor' ? 'Motion Sensor' : 'Timer Log'}
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
              Enter steps counted by your Apple Watch, Fitbit, Garmin, or pedometer.
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
                  placeholder="e.g. Morning park stroll"
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

      {/* 6. Sensor Info & Authenticity Modal */}
      {showSensorInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#231426]/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md rounded-3xl border border-[#f0dfea] bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-display text-lg font-bold text-[#231426]">
                  Real Step Counting & Sensors
                </h3>
                <p className="text-[11px] text-[#745f78]">Authentic Maternal Health Tracking</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-[#4a344d] leading-relaxed">
              <div className="rounded-2xl bg-amber-50/60 border border-amber-200 p-3">
                <span className="font-bold text-amber-900 block mb-1">
                  1. How real steps are counted:
                </span>
                MamaFit uses your mobile device's physical accelerometer (`DeviceMotionEvent`) to detect actual vertical heel-strike impacts and cadence while you walk.
              </div>

              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3">
                <span className="font-bold text-slate-900 block mb-1">
                  2. Why desktop laptops don't count steps:
                </span>
                Desktop computers and most laptops lack accelerometer sensors. When using MamaFit on a computer, open the app on your smartphone over HTTPS or use "Manual Step Entry" to enter steps recorded by your wearable tracker.
              </div>

              <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-3">
                <span className="font-bold text-emerald-900 block mb-1">
                  3. Zero Fake Steps Guarantee:
                </span>
                MamaFit never fakes or randomly increments step counts. Every step recorded by the live tracker corresponds to real physical motion cycles.
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowSensorInfoModal(false)}
                className="rounded-2xl bg-amber-500 px-6 py-2.5 text-xs font-bold text-white shadow-soft hover:bg-amber-600"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
