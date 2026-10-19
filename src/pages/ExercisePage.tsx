import React, { useState, useEffect } from 'react';
import {
  Flower2,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  ShieldAlert,
  Sparkles,
  Heart,
  ChevronRight,
  Info,
  Film,
  Clock,
  Filter,
} from 'lucide-react';
import { PRENATAL_EXERCISES } from '../data/exerciseRoutines';
import { ExerciseItem, ExerciseCategory } from '../types';
import { useMamaStore, mamaStore } from '../store/useMamaStore';
import { IntervalTimer } from '../components/exercise/IntervalTimer';
import { VideoPlayerModal } from '../components/exercise/VideoPlayerModal';

export const ExercisePage: React.FC = () => {
  const { profile, today } = useMamaStore();

  // Active workout player state
  const [activeExercise, setActiveExercise] = useState<ExerciseItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Video & 2D Trainer Modal state
  const [selectedVideoExercise, setSelectedVideoExercise] = useState<ExerciseItem | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);

  // Category filter for Exercise Center
  const [selectedCategory, setSelectedCategory] = useState<ExerciseCategory | 'all'>('all');

  // Kegel trainer mode
  const [kegelMode, setKegelMode] = useState(false);
  const [kegelPhase, setKegelPhase] = useState<'squeeze' | 'release'>('squeeze');
  const [kegelCountdown, setKegelCountdown] = useState(5);
  const [kegelReps, setKegelReps] = useState(0);

  // Timer effect for single workout player
  useEffect(() => {
    let interval: any = null;
    if (isPlaying && activeExercise) {
      interval = setInterval(() => {
        setElapsedSeconds((sec) => sec + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, activeExercise]);

  // Kegel animation timer
  useEffect(() => {
    let interval: any = null;
    if (kegelMode) {
      interval = setInterval(() => {
        setKegelCountdown((c) => {
          if (c <= 1) {
            setKegelPhase((p) => {
              const next = p === 'squeeze' ? 'release' : 'squeeze';
              if (next === 'squeeze') setKegelReps((r) => r + 1);
              return next;
            });
            return 5;
          }
          return c - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [kegelMode]);

  const handleStartExercise = (ex: ExerciseItem) => {
    setActiveExercise(ex);
    setElapsedSeconds(0);
    setIsPlaying(true);
    setKegelMode(false);
  };

  const handleFinishExercise = () => {
    const minutes = Math.max(1, Math.round(elapsedSeconds / 60));
    mamaStore.addExerciseMin(minutes);
    setIsPlaying(false);
    setActiveExercise(null);
    setElapsedSeconds(0);
  };

  const handleOpenVideoModal = (ex: ExerciseItem) => {
    setSelectedVideoExercise(ex);
    setShowVideoModal(true);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const categories: { id: ExerciseCategory | 'all'; label: string; emoji: string }[] = [
    { id: 'all', label: 'All Routines', emoji: '✨' },
    { id: 'walking', label: 'Gentle Walking', emoji: '🚶‍♀️' },
    { id: 'stretching', label: 'Stretching', emoji: '🌿' },
    { id: 'yoga', label: 'Prenatal Yoga', emoji: '🧘‍♀️' },
    { id: 'breathing', label: 'Breathing', emoji: '🌬️' },
    { id: 'relaxation', label: 'Relaxation', emoji: '🌙' },
    { id: 'posture', label: 'Posture', emoji: '🏛️' },
    { id: 'pelvic', label: 'Pelvic Floor', emoji: '💗' },
  ];

  const filteredExercises = PRENATAL_EXERCISES.filter((ex) => {
    if (selectedCategory === 'all') return true;
    return ex.category === selectedCategory;
  });

  return (
    <div className="space-y-6 pb-24">
      {/* 1. Header */}
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-[#231426] sm:text-3xl">
          Exercise Center & Safe Movement
        </h1>
        <p className="text-xs text-[#745f78]">
          Trimester-safe routines curated for pelvic tone, spinal decompression, calm breathing, and endurance.
        </p>
      </div>

      {/* 2. Today's Movement Progress Bar & Kegel Launcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl border border-[#f0dfea] bg-white p-5 shadow-soft">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff0f6] text-[#f075aa]">
            <Flower2 className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-[#745f78]">Active Minutes Today</span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-display text-2xl font-bold text-[#231426]">
                {today.exerciseMin}
              </span>
              <span className="text-xs text-[#745f78]">/ {profile.exerciseGoalMin} min goal</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setKegelMode(!kegelMode);
              setActiveExercise(null);
            }}
            className={`rounded-2xl px-4 py-2 text-xs font-bold transition-all ${
              kegelMode
                ? 'bg-[#231426] text-white shadow-soft'
                : 'border border-[#f0dfea] bg-[#fff8fb] text-[#f075aa] hover:bg-white'
            }`}
          >
            {kegelMode ? 'Exit Kegel Mode' : '💗 Pelvic Floor Gym'}
          </button>
        </div>
      </div>

      {/* 3. NEW FEATURE: Safe Pregnancy Interval Timer Component */}
      <IntervalTimer />

      {/* 4. Interactive Kegel Trainer Banner / Mode */}
      {kegelMode && (
        <div className="rounded-3xl border-2 border-[#f075aa]/40 bg-gradient-to-br from-[#fff0f6] via-white to-[#fdf4fb] p-6 shadow-glow text-center animate-fadeIn">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#f075aa]/15 px-3 py-1 text-xs font-bold text-[#e04586]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Interactive Pelvic Floor Coach</span>
          </div>

          <h3 className="font-display text-2xl font-bold text-[#231426] mt-2">
            {kegelPhase === 'squeeze' ? 'Gently Lift & Squeeze' : 'Completely Relax & Soften'}
          </h3>
          <p className="text-xs text-[#745f78] mt-1 max-w-md mx-auto">
            {kegelPhase === 'squeeze'
              ? 'Draw pelvic floor muscles upward like an elevator toward your navel. Keep breathing calmly.'
              : 'Release all tension down to the ground. Complete relaxation is critical for delivery.'}
          </p>

          {/* Animated visual contraction circle */}
          <div className="my-6 flex items-center justify-center">
            <div
              className={`flex h-36 w-36 items-center justify-center rounded-full border-4 transition-all duration-700 ${
                kegelPhase === 'squeeze'
                  ? 'scale-110 border-[#f075aa] bg-[#f075aa]/20 text-[#f075aa] shadow-glow'
                  : 'scale-90 border-emerald-300 bg-emerald-50 text-emerald-700'
              }`}
            >
              <div className="flex flex-col items-center">
                <span className="font-mono text-4xl font-extrabold">{kegelCountdown}s</span>
                <span className="text-[11px] font-bold uppercase tracking-wider">
                  {kegelPhase}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-6 text-xs text-[#231426]">
            <div>
              <span className="text-[#745f78]">Completed Reps:</span>
              <span className="ml-1 font-bold text-[#f075aa]">{kegelReps} reps</span>
            </div>
            <div>
              <span className="text-[#745f78]">Target:</span>
              <span className="ml-1 font-bold">10-15 reps daily</span>
            </div>
          </div>
        </div>
      )}

      {/* 5. Active Single Workout Player Drawer */}
      {activeExercise && (
        <div className="rounded-3xl border-2 border-[#f075aa] bg-white p-6 shadow-glow animate-fadeIn">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{activeExercise.emoji}</span>
              <div>
                <span className="rounded-full bg-[#fff0f6] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#f075aa]">
                  {activeExercise.level} · {activeExercise.trimester}
                </span>
                <h3 className="font-display text-xl font-bold text-[#231426]">
                  {activeExercise.name}
                </h3>
              </div>
            </div>

            <div className="text-right">
              <span className="font-mono text-2xl font-bold text-[#231426]">
                {formatTime(elapsedSeconds)}
              </span>
              <p className="text-[10px] text-[#745f78]">Target ~{activeExercise.duration} min</p>
            </div>
          </div>

          {/* Player controls */}
          <div className="mt-5 flex items-center justify-center gap-3 border-y border-[#f0dfea] py-4">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-2 rounded-2xl bg-[#f075aa] px-6 py-2.5 text-xs font-bold text-white shadow-soft hover:bg-[#e05892] transition-colors"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-white" />}
              {isPlaying ? 'Pause Workout' : 'Resume'}
            </button>
            <button
              onClick={handleFinishExercise}
              className="rounded-2xl border border-emerald-300 bg-emerald-50 px-4 py-2.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition-colors"
            >
              <CheckCircle2 className="h-4 w-4 inline mr-1" />
              Complete & Log
            </button>
            <button
              onClick={() => {
                setActiveExercise(null);
                setIsPlaying(false);
              }}
              className="rounded-2xl border border-slate-200 px-3 py-2.5 text-xs text-slate-500 hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>

          {/* Steps */}
          <div className="mt-4 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#745f78]">
              Step-by-Step Flow:
            </h4>
            <ul className="space-y-1.5 text-xs text-[#5a435f]">
              {activeExercise.steps.map((st, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#fff0f6] text-[10px] font-bold text-[#f075aa]">
                    {i + 1}
                  </span>
                  <span>{st}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* 6. Exercise Center by Category Tabs */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-bold text-[#231426]">
              Exercise Center ({filteredExercises.length} Routines)
            </h2>
            <p className="text-xs text-[#745f78]">
              Click "Video & Trainer" to watch educational video demonstrations and 2D animated poses.
            </p>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 rounded-2xl px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-[#231426] text-white shadow-soft'
                    : 'border border-[#f0dfea] bg-white text-[#745f78] hover:bg-[#fff8fb]'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Exercises Grid */}
        <div className="grid gap-3.5 sm:grid-cols-2">
          {filteredExercises.map((ex) => (
            <div
              key={ex.id}
              className="group flex flex-col justify-between rounded-3xl border border-[#f0dfea] bg-white p-5 shadow-xs transition-all hover:border-[#f075aa]/50 hover:shadow-soft"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl sm:text-3xl">{ex.emoji}</span>
                    <div>
                      <h3 className="font-display text-base font-bold text-[#231426] group-hover:text-[#f075aa] transition-colors">
                        {ex.name}
                      </h3>
                      <p className="text-xs text-[#745f78]">
                        {ex.duration} min · {ex.level} · {ex.trimester}
                      </p>
                    </div>
                  </div>
                </div>

                <p className="mt-3 text-xs leading-relaxed text-[#5a435f]">
                  {ex.description}
                </p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {ex.benefits.slice(0, 2).map((b, i) => (
                    <span
                      key={i}
                      className="rounded-full bg-[#fff8fb] border border-[#f0dfea] px-2.5 py-0.5 text-[10px] font-medium text-[#745f78]"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 flex items-center gap-2 border-t border-[#f0dfea] pt-3">
                <button
                  onClick={() => handleStartExercise(ex)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-[#f075aa] py-2 text-xs font-semibold text-white shadow-soft hover:bg-[#e05892] transition-colors"
                >
                  <Play className="h-3.5 w-3.5 fill-white" />
                  Start Timer
                </button>
                <button
                  onClick={() => handleOpenVideoModal(ex)}
                  className="flex items-center justify-center rounded-2xl border border-rose-200 bg-rose-50/70 px-3.5 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition-colors"
                >
                  <Film className="h-3.5 w-3.5 mr-1" />
                  Video & Trainer
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. Medical Prenatal Exercise Safety Guidelines */}
      <div className="rounded-3xl border border-rose-200 bg-rose-50/60 p-5 text-xs text-rose-950 sm:p-6">
        <div className="flex items-center gap-2 mb-2 font-bold text-rose-900">
          <ShieldAlert className="h-5 w-5 text-rose-600" />
          <span>When to Cease Exercise Immediately:</span>
        </div>
        <p className="leading-relaxed mb-3">
          Listen to your body at every moment. Never push through fatigue or pain. Cease physical activity and contact your obstetrician or midwife promptly if you encounter:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-medium">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
            <span>Vaginal bleeding or fluid leakage</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
            <span>Dizziness, feeling faint, or sudden headache</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
            <span>Chest pain or unusual shortness of breath</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
            <span>Calf swelling, redness, or unilateral leg pain</span>
          </div>
        </div>
      </div>

      {/* 8. Video Player & 2D Trainer Modal */}
      <VideoPlayerModal
        exercise={selectedVideoExercise}
        isOpen={showVideoModal}
        onClose={() => setShowVideoModal(false)}
        onStartTimer={handleStartExercise}
      />
    </div>
  );
};
