import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Volume2,
  VolumeX,
  Sparkles,
  Clock,
  Heart,
  Droplets,
  CheckCircle2,
  Settings2,
} from 'lucide-react';
import { mamaStore } from '../../store/useMamaStore';

export type IntervalPhase = 'prepare' | 'warmup' | 'work' | 'rest' | 'cooldown' | 'complete';

export interface IntervalPreset {
  id: string;
  name: string;
  warmupSec: number;
  workSec: number;
  restSec: number;
  cooldownSec: number;
  sets: number;
  description: string;
  emoji: string;
}

export const INTERVAL_PRESETS: IntervalPreset[] = [
  {
    id: 'pelvic-core',
    name: 'Gentle Pelvic & Core Pacing',
    warmupSec: 30,
    workSec: 30,
    restSec: 30,
    cooldownSec: 30,
    sets: 5,
    description: 'Controlled pelvic contractions paired with equal restorative rest.',
    emoji: '💗',
  },
  {
    id: 'stretch-flow',
    name: 'Pregnancy Stretch Intervals',
    warmupSec: 30,
    workSec: 45,
    restSec: 20,
    cooldownSec: 45,
    sets: 6,
    description: 'Generous 45-second deep stretch holds with brief transition pauses.',
    emoji: '🌿',
  },
  {
    id: 'light-cardio',
    name: 'Low-Impact Walk & Rest Interval',
    warmupSec: 60,
    workSec: 60,
    restSec: 30,
    cooldownSec: 60,
    sets: 6,
    description: 'Comfortable 60-second gentle stroll strides interspersed with water sips.',
    emoji: '🚶‍♀️',
  },
  {
    id: 'labor-breathing',
    name: 'Labor Contraction Wave Breathing',
    warmupSec: 30,
    workSec: 60,
    restSec: 60,
    cooldownSec: 45,
    sets: 5,
    description: 'Simulates 60s contraction waves followed by 60s deep full-body release.',
    emoji: '🌊',
  },
];

export const IntervalTimer: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<IntervalPreset>(INTERVAL_PRESETS[0]);
  const [isCustomizing, setIsCustomizing] = useState(false);

  // Settings
  const [warmupSec, setWarmupSec] = useState(selectedPreset.warmupSec);
  const [workSec, setWorkSec] = useState(selectedPreset.workSec);
  const [restSec, setRestSec] = useState(selectedPreset.restSec);
  const [cooldownSec, setCooldownSec] = useState(selectedPreset.cooldownSec);
  const [totalSets, setTotalSets] = useState(selectedPreset.sets);

  // Timer playback state
  const [isRunning, setIsRunning] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<IntervalPhase>('prepare');
  const [currentSet, setCurrentSet] = useState(1);
  const [secondsRemaining, setSecondsRemaining] = useState(5);
  const [totalElapsedSec, setTotalElapsedSec] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Audio Context reference for gentle chimes
  const audioCtxRef = useRef<AudioContext | null>(null);

  const getAudioContext = () => {
    if (typeof window === 'undefined') return null;
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const playTone = (freq: number, duration: number, type: OscillatorType = 'sine') => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio not permitted or user hasn't interacted yet
    }
  };

  const playChimeForPhase = (phase: IntervalPhase) => {
    if (phase === 'work') {
      // Uplifting double chime for Work
      playTone(659.25, 0.25); // E5
      setTimeout(() => playTone(880.0, 0.4), 160); // A5
    } else if (phase === 'rest') {
      // Soothing gentle chime for Rest
      playTone(523.25, 0.3); // C5
      setTimeout(() => playTone(392.0, 0.45), 180); // G4
    } else if (phase === 'complete') {
      // Triumph chime
      playTone(523.25, 0.2);
      setTimeout(() => playTone(659.25, 0.2), 150);
      setTimeout(() => playTone(783.99, 0.45), 300);
    }
  };

  // Preset selector handler
  const handleSelectPreset = (p: IntervalPreset) => {
    setSelectedPreset(p);
    setWarmupSec(p.warmupSec);
    setWorkSec(p.workSec);
    setRestSec(p.restSec);
    setCooldownSec(p.cooldownSec);
    setTotalSets(p.sets);
    resetTimer(p);
  };

  const resetTimer = (preset = selectedPreset) => {
    setIsRunning(false);
    setCurrentPhase('prepare');
    setCurrentSet(1);
    setSecondsRemaining(5);
    setTotalElapsedSec(0);
  };

  // Main countdown loop
  useEffect(() => {
    let interval: any = null;
    if (isRunning && currentPhase !== 'complete') {
      interval = setInterval(() => {
        setTotalElapsedSec((prev) => prev + 1);

        setSecondsRemaining((prevSec) => {
          // Play countdown tick on 3, 2, 1
          if (prevSec <= 4 && prevSec > 1) {
            playTone(440, 0.08);
          }

          if (prevSec <= 1) {
            // Transition to next phase
            if (currentPhase === 'prepare') {
              if (warmupSec > 0) {
                setCurrentPhase('warmup');
                playChimeForPhase('work');
                return warmupSec;
              } else {
                setCurrentPhase('work');
                playChimeForPhase('work');
                return workSec;
              }
            } else if (currentPhase === 'warmup') {
              setCurrentPhase('work');
              playChimeForPhase('work');
              return workSec;
            } else if (currentPhase === 'work') {
              if (currentSet < totalSets) {
                setCurrentPhase('rest');
                playChimeForPhase('rest');
                return restSec;
              } else {
                // Completed all work sets
                if (cooldownSec > 0) {
                  setCurrentPhase('cooldown');
                  playChimeForPhase('rest');
                  return cooldownSec;
                } else {
                  finishWorkout();
                  return 0;
                }
              }
            } else if (currentPhase === 'rest') {
              setCurrentSet((s) => s + 1);
              setCurrentPhase('work');
              playChimeForPhase('work');
              return workSec;
            } else if (currentPhase === 'cooldown') {
              finishWorkout();
              return 0;
            }
          }
          return prevSec - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, currentPhase, currentSet, totalSets, workSec, restSec, warmupSec, cooldownSec]);

  const finishWorkout = () => {
    setCurrentPhase('complete');
    setIsRunning(false);
    playChimeForPhase('complete');
    const minutes = Math.max(1, Math.round(totalElapsedSec / 60));
    mamaStore.addExerciseMin(minutes);
  };

  const handleSkip = () => {
    if (currentPhase === 'prepare') {
      setCurrentPhase(warmupSec > 0 ? 'warmup' : 'work');
      setSecondsRemaining(warmupSec > 0 ? warmupSec : workSec);
    } else if (currentPhase === 'warmup') {
      setCurrentPhase('work');
      setSecondsRemaining(workSec);
    } else if (currentPhase === 'work') {
      if (currentSet < totalSets) {
        setCurrentPhase('rest');
        setSecondsRemaining(restSec);
      } else {
        setCurrentPhase(cooldownSec > 0 ? 'cooldown' : 'complete');
        setSecondsRemaining(cooldownSec > 0 ? cooldownSec : 0);
      }
    } else if (currentPhase === 'rest') {
      setCurrentSet((s) => s + 1);
      setCurrentPhase('work');
      setSecondsRemaining(workSec);
    } else if (currentPhase === 'cooldown') {
      finishWorkout();
    }
  };

  const getPhaseDetails = () => {
    switch (currentPhase) {
      case 'prepare':
        return {
          title: 'Get Ready Mama 🌸',
          subtitle: 'Position your pillows, check posture, and breathe easily.',
          color: 'from-amber-400 to-rose-400',
          textColor: 'text-amber-800',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200',
        };
      case 'warmup':
        return {
          title: 'Gentle Warm-up 🌿',
          subtitle: 'Slow arm circles, easy breathing, and gentle spine mobility.',
          color: 'from-emerald-400 to-teal-500',
          textColor: 'text-emerald-800',
          bgColor: 'bg-emerald-50',
          borderColor: 'border-emerald-200',
        };
      case 'work':
        return {
          title: `Active Interval #${currentSet} 💗`,
          subtitle: 'Move comfortably at your conversational pace. Never hold your breath.',
          color: 'from-[#f075aa] to-[#fe93a1]',
          textColor: 'text-[#e04586]',
          bgColor: 'bg-[#fff0f6]',
          borderColor: 'border-[#f075aa]/50',
        };
      case 'rest':
        return {
          title: 'Rest & Hydrate 💧',
          subtitle: 'Sip cool water, drop your shoulders, and soften your pelvic floor.',
          color: 'from-sky-400 to-indigo-400',
          textColor: 'text-sky-800',
          bgColor: 'bg-sky-50',
          borderColor: 'border-sky-200',
        };
      case 'cooldown':
        return {
          title: 'Gentle Cool-Down 🍃',
          subtitle: 'Slow rhythmic breaths and restorative side-lying release.',
          color: 'from-purple-400 to-pink-400',
          textColor: 'text-purple-800',
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-200',
        };
      case 'complete':
        return {
          title: 'Session Completed! 🎉',
          subtitle: 'Wonderful work nourishing both you and baby today.',
          color: 'from-emerald-500 to-teal-500',
          textColor: 'text-emerald-800',
          bgColor: 'bg-emerald-50',
          borderColor: 'border-emerald-300',
        };
    }
  };

  const phaseDetails = getPhaseDetails();

  const formatMinSec = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="rounded-3xl border border-[#f0dfea] bg-white p-5 shadow-soft sm:p-7">
      {/* 1. Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-[#f0dfea] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#fff0f6] text-[#f075aa]">
              <Clock className="h-4 w-4" />
            </span>
            <h2 className="font-display text-xl font-bold text-[#231426]">
              Safe Pregnancy Interval Timer
            </h2>
          </div>
          <p className="text-xs text-[#745f78] mt-0.5">
            Trimester-paced work and rest intervals with audio chimes and hydration pauses.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? 'Mute audio chimes' : 'Unmute audio chimes'}
            className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-colors ${
              soundEnabled
                ? 'border-[#f0dfea] bg-white text-[#f075aa] hover:bg-[#fff0f6]'
                : 'border-slate-200 bg-slate-100 text-slate-400'
            }`}
          >
            {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setIsCustomizing(!isCustomizing)}
            className="flex items-center gap-1.5 rounded-xl border border-[#f0dfea] bg-white px-3 py-1.5 text-xs font-semibold text-[#231426] hover:border-[#f075aa] transition-colors shadow-xs"
          >
            <Settings2 className="h-3.5 w-3.5 text-[#f075aa]" />
            <span>{isCustomizing ? 'Hide Custom' : 'Custom Times'}</span>
          </button>
        </div>
      </div>

      {/* 2. Preset Selector */}
      <div className="my-4">
        <label className="block text-xs font-bold uppercase tracking-wider text-[#745f78] mb-2">
          Choose a Gentle Pregnancy Routine:
        </label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {INTERVAL_PRESETS.map((preset) => {
            const isSelected = selectedPreset.id === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`flex flex-col items-start rounded-2xl p-3 text-left transition-all ${
                  isSelected
                    ? 'border-2 border-[#f075aa] bg-[#fff0f6] shadow-xs'
                    : 'border border-[#f0dfea] bg-[#fff8fb] hover:bg-white hover:border-[#f075aa]/40'
                }`}
              >
                <span className="text-xl">{preset.emoji}</span>
                <span className="mt-1 font-display text-xs font-bold text-[#231426]">
                  {preset.name}
                </span>
                <span className="text-[10px] text-[#745f78] mt-0.5">
                  {preset.sets} sets · {preset.workSec}s work / {preset.restSec}s rest
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Custom Duration Inputs if toggled */}
      {isCustomizing && (
        <div className="mb-5 rounded-2xl border border-[#f0dfea] bg-[#fff8fb] p-4 text-xs">
          <h4 className="font-semibold text-[#231426] mb-3">Adjust Interval Durations (Seconds):</h4>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            <div>
              <label className="block text-[#745f78] mb-1">Warm-up (sec)</label>
              <input
                type="number"
                min="0"
                step="5"
                value={warmupSec}
                onChange={(e) => setWarmupSec(Number(e.target.value))}
                className="w-full rounded-xl border border-[#f0dfea] bg-white p-2 text-xs focus:outline-none focus:border-[#f075aa]"
              />
            </div>
            <div>
              <label className="block text-[#745f78] mb-1">Work Phase (sec)</label>
              <input
                type="number"
                min="10"
                step="5"
                value={workSec}
                onChange={(e) => setWorkSec(Number(e.target.value))}
                className="w-full rounded-xl border border-[#f0dfea] bg-white p-2 text-xs focus:outline-none focus:border-[#f075aa]"
              />
            </div>
            <div>
              <label className="block text-[#745f78] mb-1">Rest & Sip (sec)</label>
              <input
                type="number"
                min="10"
                step="5"
                value={restSec}
                onChange={(e) => setRestSec(Number(e.target.value))}
                className="w-full rounded-xl border border-[#f0dfea] bg-white p-2 text-xs focus:outline-none focus:border-[#f075aa]"
              />
            </div>
            <div>
              <label className="block text-[#745f78] mb-1">Cool-down (sec)</label>
              <input
                type="number"
                min="0"
                step="5"
                value={cooldownSec}
                onChange={(e) => setCooldownSec(Number(e.target.value))}
                className="w-full rounded-xl border border-[#f0dfea] bg-white p-2 text-xs focus:outline-none focus:border-[#f075aa]"
              />
            </div>
            <div>
              <label className="block text-[#745f78] mb-1">Total Sets</label>
              <input
                type="number"
                min="1"
                max="20"
                value={totalSets}
                onChange={(e) => setTotalSets(Number(e.target.value))}
                className="w-full rounded-xl border border-[#f0dfea] bg-white p-2 text-xs focus:outline-none focus:border-[#f075aa]"
              />
            </div>
          </div>
        </div>
      )}

      {/* 4. Main Timer Active Display Banner */}
      <div
        className={`relative overflow-hidden rounded-3xl border-2 p-6 text-center transition-all duration-500 shadow-soft ${phaseDetails.borderColor} ${phaseDetails.bgColor}`}
      >
        <div className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3.5 py-1 text-xs font-bold shadow-xs">
          <Sparkles className="h-3.5 w-3.5 text-[#f075aa]" />
          <span className="capitalize">{currentPhase === 'work' ? `Set ${currentSet} of ${totalSets}` : currentPhase}</span>
        </div>

        <h3 className={`font-display text-2xl font-bold sm:text-3xl mt-2 ${phaseDetails.textColor}`}>
          {phaseDetails.title}
        </h3>
        <p className="text-xs text-[#5a435f] mt-1 max-w-md mx-auto">
          {phaseDetails.subtitle}
        </p>

        {/* Big Countdown Number */}
        <div className="my-6 flex items-center justify-center">
          <div className="relative flex h-36 w-36 items-center justify-center rounded-full bg-white shadow-soft border-4 border-current transition-transform duration-300">
            <div className="flex flex-col items-center">
              <span className="font-mono text-4xl font-extrabold text-[#231426]">
                {secondsRemaining}s
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#745f78]">
                Remaining
              </span>
            </div>
          </div>
        </div>

        {/* Total Elapsed & Set Counter */}
        <div className="flex items-center justify-center gap-6 text-xs text-[#231426]">
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-[#745f78]" />
            <span className="text-[#745f78]">Elapsed:</span>
            <span className="font-mono font-bold">{formatMinSec(totalElapsedSec)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Heart className="h-3.5 w-3.5 text-[#f075aa]" />
            <span className="text-[#745f78]">Cycle:</span>
            <span className="font-bold">{currentSet} / {totalSets}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {!isRunning ? (
            <button
              onClick={() => {
                getAudioContext();
                setIsRunning(true);
              }}
              className="flex items-center gap-2 rounded-2xl bg-[#f075aa] px-7 py-3 text-xs font-bold text-white shadow-soft hover:bg-[#e05892] transition-transform active:scale-95"
            >
              <Play className="h-4 w-4 fill-white" />
              <span>{totalElapsedSec > 0 ? 'Resume Timer' : 'Start Routine'}</span>
            </button>
          ) : (
            <button
              onClick={() => setIsRunning(false)}
              className="flex items-center gap-2 rounded-2xl bg-[#231426] px-7 py-3 text-xs font-bold text-white shadow-soft hover:bg-[#3d2442] transition-transform active:scale-95"
            >
              <Pause className="h-4 w-4" />
              <span>Pause</span>
            </button>
          )}

          <button
            onClick={handleSkip}
            title="Skip to next phase"
            className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-[#231426] hover:bg-slate-50 transition-colors"
          >
            <SkipForward className="h-4 w-4 text-[#745f78]" />
            <span>Skip Phase</span>
          </button>

          <button
            onClick={() => resetTimer()}
            title="Reset interval timer"
            className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs font-medium text-slate-500 hover:bg-slate-50 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
};
