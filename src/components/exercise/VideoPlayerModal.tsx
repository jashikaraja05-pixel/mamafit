import React, { useState } from 'react';
import { X, Play, ShieldAlert, Sparkles, Film, ExternalLink, Heart, Clock } from 'lucide-react';
import { ExerciseItem } from '../../types';
import { AnimatedTrainer } from './AnimatedTrainer';

interface VideoPlayerModalProps {
  exercise: ExerciseItem | null;
  isOpen: boolean;
  onClose: () => void;
  onStartTimer: (ex: ExerciseItem) => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  exercise,
  isOpen,
  onClose,
  onStartTimer,
}) => {
  const [viewMode, setViewMode] = useState<'video' | 'animation'>('video');

  if (!isOpen || !exercise) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#231426]/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-[#f0dfea] bg-white p-5 sm:p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#f0dfea] pb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{exercise.emoji}</span>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-[#fff0f6] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#f075aa]">
                  {exercise.level} · {exercise.trimester}
                </span>
                <span className="capitalize rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                  {exercise.category}
                </span>
              </div>
              <h3 className="font-display text-xl font-bold text-[#231426] mt-0.5">
                {exercise.name}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* View Mode Toggle */}
        <div className="my-4 flex items-center justify-between">
          <div className="flex items-center gap-1 rounded-2xl border border-[#f0dfea] bg-[#fff8fb] p-1">
            <button
              onClick={() => setViewMode('video')}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                viewMode === 'video'
                  ? 'bg-[#f075aa] text-white shadow-xs'
                  : 'text-[#745f78] hover:text-[#231426]'
              }`}
            >
              <Film className="h-3.5 w-3.5" />
              <span>Video Player</span>
            </button>
            <button
              onClick={() => setViewMode('animation')}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                viewMode === 'animation'
                  ? 'bg-[#f075aa] text-white shadow-xs'
                  : 'text-[#745f78] hover:text-[#231426]'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>2D Animated Trainer</span>
            </button>
          </div>

          <a
            href={`https://www.youtube.com/results?search_query=${encodeURIComponent(exercise.youtubeQuery)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1 text-xs font-semibold text-[#f075aa] hover:underline"
          >
            <span>Open in YouTube</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* Player Container */}
        <div className="overflow-hidden rounded-2xl border border-[#f0dfea] bg-slate-900 shadow-inner">
          {viewMode === 'video' && exercise.videoUrl ? (
            <div className="relative aspect-video w-full">
              <iframe
                src={`${exercise.videoUrl}?rel=0&modestbranding=1`}
                title={exercise.name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full border-0"
              />
            </div>
          ) : (
            <div className="bg-white p-4">
              <AnimatedTrainer pose={exercise.animationPose} name={exercise.name} />
            </div>
          )}
        </div>

        {/* Exercise Details */}
        <div className="mt-5 space-y-4 text-xs">
          <div>
            <h4 className="font-bold text-[#231426] mb-1">Description:</h4>
            <p className="leading-relaxed text-[#5a435f]">{exercise.description}</p>
          </div>

          <div>
            <h4 className="font-bold text-[#231426] mb-2 uppercase tracking-wider text-[11px] text-[#745f78]">
              Step-by-Step Flow:
            </h4>
            <ul className="space-y-2 text-[#5a435f]">
              {exercise.steps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#fff0f6] text-[11px] font-bold text-[#f075aa]">
                    {idx + 1}
                  </span>
                  <span className="pt-0.5">{step}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-3.5 text-rose-950">
            <div className="flex items-center gap-1.5 font-bold text-rose-800 mb-1">
              <ShieldAlert className="h-4 w-4 text-rose-600" />
              <span>Safety & Trimester Guidance:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-rose-900">
              {exercise.safetyTips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6 flex items-center justify-end gap-3 border-t border-[#f0dfea] pt-4">
          <button
            onClick={onClose}
            className="rounded-2xl border border-slate-200 px-5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onStartTimer(exercise);
            }}
            className="flex items-center gap-2 rounded-2xl bg-[#f075aa] px-6 py-2.5 text-xs font-bold text-white shadow-soft hover:bg-[#e05892] transition-colors"
          >
            <Play className="h-4 w-4 fill-white" />
            <span>Launch Workout Player</span>
          </button>
        </div>
      </div>
    </div>
  );
};
