import React, { useState } from 'react';
import { Sparkles, Heart, Baby, ArrowRight, Check } from 'lucide-react';
import { useMamaStore, mamaStore } from '../../store/useMamaStore';
import logoImg from '../../assets/logo.png';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onComplete }) => {
  const { profile } = useMamaStore();
  const [step, setStep] = useState(1);
  const [name, setName] = useState(profile.name || '');
  const [week, setWeek] = useState(profile.pregnancyWeek || 16);
  const [babyName, setBabyName] = useState(profile.babyNickname || '');
  const [preWeight, setPreWeight] = useState(profile.prePregnancyWeightKg || 58);
  const [height, setHeight] = useState(profile.heightCm || 165);

  if (!isOpen) return null;

  const handleFinish = () => {
    mamaStore.setProfile({
      name: name.trim() || 'Mama',
      pregnancyWeek: Number(week) || 16,
      babyNickname: babyName.trim() || 'Little Miracle',
      prePregnancyWeightKg: Number(preWeight) || 58,
      weightKg: Number(preWeight) ? Number(preWeight) + 2 : 60,
      heightCm: Number(height) || 165,
      onboarded: true,
    });
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="fixed inset-0 bg-[#231426]/60 backdrop-blur-xs" />

      <div className="relative w-full max-w-md max-h-[92vh] overflow-y-auto rounded-3xl border border-[#f0dfea] bg-white p-5 shadow-2xl sm:p-8 text-center">
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-1.5 mb-6">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all ${
                step === s ? 'w-8 bg-[#f075aa]' : step > s ? 'w-4 bg-emerald-400' : 'w-4 bg-slate-200'
              }`}
            />
          ))}
        </div>

        {/* Step 1: Name & Welcome with Full Logo */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="mx-auto h-24 w-24 overflow-hidden rounded-3xl border-2 border-[#f075aa]/40 bg-white shadow-soft">
              <img
                src={logoImg}
                alt="MamaFit AI"
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-[#231426]">
                Welcome to MamaFit AI
              </h2>
              <p className="mt-1 text-xs text-[#745f78]">
                Your personal pregnancy wellness companion. What should we call you?
              </p>
            </div>

            <input
              type="text"
              autoFocus
              placeholder="e.g. Aisha"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-2xl border border-[#f0dfea] bg-[#fff8fb] px-4 py-3 text-center text-sm font-semibold text-[#231426] placeholder-[#745f78]/70 focus:border-[#f075aa] focus:bg-white focus:outline-none transition-all"
            />

            <button
              onClick={() => setStep(2)}
              disabled={!name.trim()}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#f075aa] py-3.5 text-sm font-bold text-white shadow-soft hover:bg-[#e05892] disabled:opacity-40 transition-all"
            >
              Continue <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Step 2: Week & Baby */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#fff0f6] text-[#f075aa] shadow-soft">
              <Baby className="h-8 w-8" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-[#231426]">
                How far along are you?
              </h2>
              <p className="mt-1 text-xs text-[#745f78]">
                We’ll adapt baby size comparisons, nutrition tips, and safe movement.
              </p>
            </div>

            <div className="space-y-3 text-left">
              <div>
                <label className="block text-xs font-semibold text-[#231426] mb-1">
                  Pregnancy Week (1–42)
                </label>
                <input
                  type="number"
                  min="1"
                  max="42"
                  value={week}
                  onChange={(e) => setWeek(Number(e.target.value))}
                  className="w-full rounded-2xl border border-[#f0dfea] bg-[#fff8fb] px-4 py-2.5 text-center text-sm font-semibold text-[#231426] focus:border-[#f075aa] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#231426] mb-1">
                  Baby’s Nickname (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Peanut, Bean, Miracle"
                  value={babyName}
                  onChange={(e) => setBabyName(e.target.value)}
                  className="w-full rounded-2xl border border-[#f0dfea] bg-[#fff8fb] px-4 py-2.5 text-center text-sm font-semibold text-[#231426] focus:border-[#f075aa] focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setStep(1)}
                className="w-1/3 rounded-2xl border border-[#f0dfea] py-3 text-xs font-semibold text-[#745f78]"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-[#f075aa] py-3 text-sm font-bold text-white shadow-soft hover:bg-[#e05892]"
              >
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Measurements & Ready */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-600 shadow-soft">
              <Heart className="h-8 w-8 fill-emerald-600/20" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-[#231426]">
                You’re Ready to Bloom! 🌸
              </h2>
              <p className="mt-1 text-xs text-[#745f78]">
                Enter your pre-pregnancy weight and height to track healthy weight gain.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-left">
              <div>
                <label className="block text-xs font-semibold text-[#231426] mb-1">
                  Pre-pregnancy Weight (kg)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 58"
                  value={preWeight || ''}
                  onChange={(e) => setPreWeight(Number(e.target.value))}
                  className="w-full rounded-2xl border border-[#f0dfea] bg-[#fff8fb] px-3 py-2 text-center text-xs font-semibold text-[#231426] focus:border-[#f075aa] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#231426] mb-1">
                  Height (cm)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 165"
                  value={height || ''}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full rounded-2xl border border-[#f0dfea] bg-[#fff8fb] px-3 py-2 text-center text-xs font-semibold text-[#231426] focus:border-[#f075aa] focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <button
              onClick={handleFinish}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#231426] py-3.5 text-sm font-bold text-white shadow-soft hover:bg-[#3d2441] transition-all"
            >
              Enter MamaFit AI <Sparkles className="h-4 w-4 text-[#ffc6c0]" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
