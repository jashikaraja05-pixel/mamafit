import React, { useState, useMemo } from 'react';
import {
  Baby,
  Calendar,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Apple,
  Flower2,
  CheckCircle2,
  Heart,
  Search,
  Clock,
  Info,
  Compass,
  ArrowRight,
  Check,
  Award,
} from 'lucide-react';
import { useMamaStore, mamaStore } from '../../store/useMamaStore';
import { ALL_40_WEEKS_DATA, getWeekGrowth } from '../../data/pregnancyWeeks';
import { MamaProfile, WeekGrowthData } from '../../types';

interface PregnancyGuideProps {
  onClose?: () => void;
  initialWeek?: number;
}

// Helper to calculate exact pregnancy stage from user profile
export function calculateUserPregnancyStage(profile: MamaProfile) {
  let calculatedWeek = profile.pregnancyWeek || 16;
  let daysIntoWeek = 0;
  let daysUntilDue: number | null = null;
  let source: 'dueDate' | 'manualWeek' = 'manualWeek';

  if (profile.dueDate) {
    const dueTime = new Date(profile.dueDate).getTime();
    const nowTime = Date.now();
    if (!isNaN(dueTime)) {
      daysUntilDue = Math.round((dueTime - nowTime) / (1000 * 60 * 60 * 24));
      // Full pregnancy is ~280 days (40 weeks) from LMP
      const passedDays = 280 - daysUntilDue;
      if (passedDays >= 0 && passedDays <= 300) {
        calculatedWeek = Math.min(40, Math.max(1, Math.floor(passedDays / 7)));
        daysIntoWeek = Math.max(0, passedDays % 7);
        source = 'dueDate';
      }
    }
  }

  const trimester: 1 | 2 | 3 =
    calculatedWeek <= 13 ? 1 : calculatedWeek <= 26 ? 2 : 3;

  const trimesterLabel =
    trimester === 1
      ? 'First Trimester (Weeks 1–13)'
      : trimester === 2
      ? 'Second Trimester (Weeks 14–26)'
      : 'Third Trimester (Weeks 27–40+)';

  const progressPercent = Math.min(100, Math.round((calculatedWeek / 40) * 100));

  return {
    calculatedWeek,
    daysIntoWeek,
    daysUntilDue,
    trimester,
    trimesterLabel,
    progressPercent,
    source,
  };
}

export const PregnancyGuide: React.FC<PregnancyGuideProps> = ({
  onClose,
  initialWeek,
}) => {
  const { profile, today } = useMamaStore();

  // Calculate current stage dynamically from profile
  const userStage = useMemo(() => calculateUserPregnancyStage(profile), [profile]);

  // Selected week for browsing (defaults to user's active stage or provided initialWeek)
  const [selectedWeek, setSelectedWeek] = useState<number>(
    initialWeek || userStage.calculatedWeek
  );

  // Active trimester tab filter: 'all' | 1 | 2 | 3
  const [trimesterFilter, setTrimesterFilter] = useState<'all' | 1 | 2 | 3>('all');

  // Search keyword for symptoms, milestones, or nutrition
  const [searchQuery, setSearchQuery] = useState('');

  // Active detail view tab: 'milestones' | 'selfCare' | 'nutrition' | 'checklist'
  const [activeTab, setActiveTab] = useState<
    'milestones' | 'selfCare' | 'nutrition' | 'checklist'
  >('milestones');

  const weekData: WeekGrowthData = getWeekGrowth(selectedWeek);

  const selectedTrimester =
    selectedWeek <= 13 ? 1 : selectedWeek <= 26 ? 2 : 3;

  const selectedTrimesterLabel =
    selectedTrimester === 1
      ? '1st Trimester'
      : selectedTrimester === 2
      ? '2nd Trimester'
      : '3rd Trimester';

  const isUserCurrentWeek = selectedWeek === userStage.calculatedWeek;
  const completedChecklistIds = today.completedChecklistIds || [];

  // Filtered weeks list based on Trimester filter and search term
  const displayedWeeks = useMemo(() => {
    return Array.from({ length: 40 }, (_, i) => i + 1).filter((w) => {
      // Trimester filter
      if (trimesterFilter === 1 && w > 13) return false;
      if (trimesterFilter === 2 && (w < 14 || w > 26)) return false;
      if (trimesterFilter === 3 && w < 27) return false;

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const data = ALL_40_WEEKS_DATA[w];
        if (!data) return false;

        const haystack = [
          `week ${w}`,
          data.fruitComparison,
          data.babyHighlight,
          data.mamaTip,
          data.selfCare,
          data.nutritionFocus,
          ...(data.symptoms || []),
          ...(data.suitableActivities || []),
        ].join(' ').toLowerCase();

        return haystack.includes(query);
      }

      return true;
    });
  }, [trimesterFilter, searchQuery]);

  const handleSyncToProfile = () => {
    mamaStore.setProfile({ pregnancyWeek: selectedWeek });
  };

  const handleJumpToMyWeek = () => {
    setSelectedWeek(userStage.calculatedWeek);
    setTrimesterFilter('all');
    setSearchQuery('');
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with Close and Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#f0dfea] pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#fff0f6] text-[#f075aa] shadow-xs">
              <Baby className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-[#231426]">
                Pregnancy Week-by-Week Guide
              </h2>
              <p className="text-xs text-[#745f78]">
                Comprehensive 1–40 week developmental milestones, self-care, nutrition, and care checklists.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isUserCurrentWeek && (
            <button
              onClick={handleJumpToMyWeek}
              className="flex items-center gap-1.5 rounded-2xl border border-[#f075aa]/30 bg-[#fff0f6] px-3.5 py-2 text-xs font-bold text-[#f075aa] hover:bg-[#ffe4f0] transition-colors"
            >
              <Heart className="h-3.5 w-3.5 fill-[#f075aa]" />
              <span>Jump to My Week ({userStage.calculatedWeek})</span>
            </button>
          )}

          {onClose && (
            <button
              onClick={onClose}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors shadow-xs"
            >
              Close Guide
            </button>
          )}
        </div>
      </div>

      {/* 2. Personalized Stage Banner (Calculated from User Profile) */}
      <div className="relative overflow-hidden rounded-3xl border border-[#f0dfea] bg-gradient-to-r from-[#fff0f6] via-[#fbf2ff] to-[#fff5ee] p-5 shadow-soft sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#f075aa] text-white px-3 py-0.5 text-xs font-bold uppercase tracking-wider">
                Your Calculated Stage
              </span>
              <span className="rounded-full border border-purple-200 bg-white px-2.5 py-0.5 text-xs font-semibold text-purple-900">
                {userStage.trimesterLabel}
              </span>
              {userStage.source === 'dueDate' && (
                <span className="rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 text-[10px] font-semibold">
                  Due-date Synced
                </span>
              )}
            </div>

            <div className="flex items-baseline gap-2">
              <h3 className="font-display text-2xl font-extrabold text-[#231426] sm:text-3xl">
                Week {userStage.calculatedWeek}
                {userStage.daysIntoWeek > 0 ? ` + ${userStage.daysIntoWeek} days` : ''}
              </h3>
              <span className="text-xs text-[#745f78] font-medium">
                {userStage.daysUntilDue !== null
                  ? `(~${userStage.daysUntilDue} days until due date)`
                  : `(${Math.max(0, 40 - userStage.calculatedWeek)} weeks remaining)`}
              </span>
            </div>

            <p className="text-xs text-[#5a435f]">
              {profile.babyNickname ? `Little ${profile.babyNickname}` : 'Your baby'} is growing rapidly this week. Currently viewing{' '}
              {isUserCurrentWeek ? (
                <span className="font-bold text-[#f075aa]">your current week</span>
              ) : (
                <span className="font-bold text-purple-700">Week {selectedWeek} (browsing)</span>
              )}
              .
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-36 sm:w-44 space-y-1.5">
              <div className="flex justify-between text-[11px] font-semibold text-[#745f78]">
                <span>Progress</span>
                <span className="font-bold text-[#f075aa]">{userStage.progressPercent}%</span>
              </div>
              <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-white/80 p-0.5 border border-[#f0dfea]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#f075aa] via-[#c1a9ee] to-emerald-400 transition-all duration-500"
                  style={{ width: `${userStage.progressPercent}%` }}
                />
              </div>
              <span className="block text-[10px] text-right text-[#745f78]">
                Week {userStage.calculatedWeek} of 40
              </span>
            </div>

            {!isUserCurrentWeek && (
              <button
                onClick={handleJumpToMyWeek}
                className="hidden sm:flex items-center gap-1.5 rounded-2xl bg-[#231426] px-3.5 py-2 text-xs font-bold text-white shadow-soft hover:bg-[#3d2442] transition-colors"
              >
                <span>View My Week</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. Week Navigation & Interactive Scrubber */}
      <div className="rounded-3xl border border-[#f0dfea] bg-white p-5 shadow-soft space-y-4">
        {/* Trimester Filters & Search */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setTrimesterFilter('all')}
              className={`rounded-2xl px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                trimesterFilter === 'all'
                  ? 'bg-[#231426] text-white shadow-xs'
                  : 'border border-[#f0dfea] bg-[#fff8fb] text-[#745f78] hover:bg-white'
              }`}
            >
              All 40 Weeks
            </button>
            <button
              onClick={() => setTrimesterFilter(1)}
              className={`rounded-2xl px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                trimesterFilter === 1
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'border border-[#f0dfea] bg-[#fff8fb] text-[#745f78] hover:bg-white'
              }`}
            >
              1st Trimester (1–13)
            </button>
            <button
              onClick={() => setTrimesterFilter(2)}
              className={`rounded-2xl px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                trimesterFilter === 2
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'border border-[#f0dfea] bg-[#fff8fb] text-[#745f78] hover:bg-white'
              }`}
            >
              2nd Trimester (14–26)
            </button>
            <button
              onClick={() => setTrimesterFilter(3)}
              className={`rounded-2xl px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                trimesterFilter === 3
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'border border-[#f0dfea] bg-[#fff8fb] text-[#745f78] hover:bg-white'
              }`}
            >
              3rd Trimester (27–40)
            </button>
          </div>

          <div className="relative min-w-[200px] max-w-xs">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search symptom, fruit, care..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-[#f0dfea] bg-[#fff8fb] py-1.5 pl-8 pr-3 text-xs text-[#231426] placeholder:text-slate-400 focus:border-[#f075aa] focus:bg-white focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-[11px] font-bold text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Current Selected Week Control Header */}
        <div className="flex items-center justify-between border-t border-[#f0dfea] pt-3">
          <div className="flex items-center gap-2">
            <button
              disabled={selectedWeek <= 1}
              onClick={() => setSelectedWeek((w) => Math.max(1, w - 1))}
              className="flex h-8 w-8 items-center justify-center rounded-2xl border border-[#f0dfea] bg-[#fff8fb] text-[#231426] hover:bg-white hover:border-[#f075aa] disabled:opacity-30 transition-all"
              title="Previous week"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <span className="font-display text-lg font-bold text-[#231426]">
              Week {selectedWeek} of 40
            </span>

            <button
              disabled={selectedWeek >= 40}
              onClick={() => setSelectedWeek((w) => Math.min(40, w + 1))}
              className="flex h-8 w-8 items-center justify-center rounded-2xl border border-[#f0dfea] bg-[#fff8fb] text-[#231426] hover:bg-white hover:border-[#f075aa] disabled:opacity-30 transition-all"
              title="Next week"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {!isUserCurrentWeek && (
              <button
                onClick={handleSyncToProfile}
                className="flex items-center gap-1.5 rounded-2xl border border-[#f0dfea] bg-white px-3 py-1.5 text-xs font-semibold text-[#f075aa] hover:border-[#f075aa] transition-colors shadow-xs"
                title="Update your active profile week"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Sync Profile to W{selectedWeek}</span>
              </button>
            )}
          </div>
        </div>

        {/* Horizontal Week Pill Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {displayedWeeks.length === 0 ? (
            <p className="text-xs text-[#745f78] py-2">
              No pregnancy weeks matched "{searchQuery}".
            </p>
          ) : (
            displayedWeeks.map((w) => {
              const isSelected = selectedWeek === w;
              const isUserWeek = userStage.calculatedWeek === w;
              const isPastWeek = w < userStage.calculatedWeek;

              return (
                <button
                  key={w}
                  onClick={() => setSelectedWeek(w)}
                  className={`relative flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-2xl text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-[#f075aa] text-white shadow-soft scale-105 z-10'
                      : isUserWeek
                      ? 'border-2 border-[#f075aa] bg-[#fff0f6] text-[#f075aa]'
                      : isPastWeek
                      ? 'border border-emerald-200 bg-emerald-50/60 text-emerald-800'
                      : 'border border-[#f0dfea] bg-[#fff8fb] text-[#745f78] hover:bg-white'
                  }`}
                >
                  <span>W{w}</span>
                  {isUserWeek && (
                    <span className="absolute -bottom-1 h-1.5 w-1.5 rounded-full bg-[#f075aa]" />
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* 4. Hero Week Developmental Milestone Card */}
      <div className="relative overflow-hidden rounded-3xl border border-[#f0dfea] bg-gradient-to-br from-[#fff2f7] via-white to-[#fbf0ff] p-6 shadow-soft sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#231426] px-3.5 py-1 text-xs font-bold text-white">
                Week {selectedWeek}
              </span>
              <span className="rounded-full border border-[#f0dfea] bg-white px-3 py-1 text-xs font-semibold text-[#745f78]">
                {selectedTrimesterLabel}
              </span>
              {isUserCurrentWeek && (
                <span className="rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-1 text-xs font-bold">
                  🌸 Your Current Stage
                </span>
              )}
              <span className="rounded-full bg-[#fff0f6] px-3 py-1 text-xs font-semibold text-[#f075aa]">
                {Math.max(0, 40 - selectedWeek)} weeks to due date
              </span>
            </div>

            <div>
              <h3 className="font-display text-2xl font-extrabold text-[#231426] sm:text-3xl">
                Baby is the size of a {weekData.fruitComparison} {weekData.fruitEmoji}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#5a435f]">
                {weekData.babyHighlight}
              </p>
            </div>

            {/* Vitals: Length & Weight */}
            <div className="flex items-center gap-6 pt-2 text-xs font-semibold text-[#231426]">
              <div className="flex items-center gap-2 rounded-2xl bg-white border border-[#f0dfea] px-3.5 py-1.5 shadow-xs">
                <span className="text-[#745f78]">Crown-to-Heel Length:</span>
                <span className="font-bold text-[#f075aa]">~{weekData.lengthCm} cm</span>
              </div>
              <div className="flex items-center gap-2 rounded-2xl bg-white border border-[#f0dfea] px-3.5 py-1.5 shadow-xs">
                <span className="text-[#745f78]">Estimated Weight:</span>
                <span className="font-bold text-[#f075aa]">~{weekData.weightG} g</span>
              </div>
            </div>
          </div>

          {/* Fruit / Emoji Illustration Box */}
          <div className="flex shrink-0 items-center justify-center self-center md:self-auto">
            <div className="relative flex h-36 w-36 items-center justify-center rounded-3xl border-4 border-white bg-gradient-to-tr from-[#ffe4f0] to-[#fbf0ff] shadow-soft">
              <span className="text-6xl sm:text-7xl select-none animate-bounce" style={{ animationDuration: '3s' }}>
                {weekData.fruitEmoji}
              </span>
              <span className="absolute -bottom-2 rounded-full bg-[#231426] px-3 py-0.5 text-[10px] font-bold text-white shadow-xs">
                {weekData.fruitComparison}
              </span>
            </div>
          </div>
        </div>

        {/* Daily Loving Affirmation */}
        <div className="mt-6 rounded-2xl border border-[#f0dfea] bg-white/90 p-4 text-center">
          <blockquote className="font-display text-sm italic text-[#231426] sm:text-base">
            "{weekData.affirmation}"
          </blockquote>
          <p className="mt-1 text-[11px] font-semibold text-[#f075aa]">
            MamaFit Affirmation for Week {selectedWeek}
          </p>
        </div>
      </div>

      {/* 5. Deep-Dive Section Tabs */}
      <div className="flex items-center gap-2 border-b border-[#f0dfea] pb-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('milestones')}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-2xl transition-all ${
            activeTab === 'milestones'
              ? 'bg-[#231426] text-white shadow-xs'
              : 'border border-[#f0dfea] bg-white text-[#745f78] hover:bg-[#fff8fb]'
          }`}
        >
          <Baby className="h-3.5 w-3.5" />
          <span>Development & Symptoms</span>
        </button>

        <button
          onClick={() => setActiveTab('selfCare')}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-2xl transition-all ${
            activeTab === 'selfCare'
              ? 'bg-[#231426] text-white shadow-xs'
              : 'border border-[#f0dfea] bg-white text-[#745f78] hover:bg-[#fff8fb]'
          }`}
        >
          <Flower2 className="h-3.5 w-3.5" />
          <span>Self-Care & Movement</span>
        </button>

        <button
          onClick={() => setActiveTab('nutrition')}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-2xl transition-all ${
            activeTab === 'nutrition'
              ? 'bg-[#231426] text-white shadow-xs'
              : 'border border-[#f0dfea] bg-white text-[#745f78] hover:bg-[#fff8fb]'
          }`}
        >
          <Apple className="h-3.5 w-3.5" />
          <span>Nutrition & Food Safety</span>
        </button>

        <button
          onClick={() => setActiveTab('checklist')}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-2xl transition-all ${
            activeTab === 'checklist'
              ? 'bg-[#231426] text-white shadow-xs'
              : 'border border-[#f0dfea] bg-white text-[#745f78] hover:bg-[#fff8fb]'
          }`}
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>Weekly Checklist ({weekData.weeklyChecklist.length})</span>
        </button>
      </div>

      {/* 6. Active Tab Content Panels */}
      {activeTab === 'milestones' && (
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Baby Milestones Card */}
          <div className="rounded-3xl border border-[#f0dfea] bg-white p-5 shadow-soft space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <Baby className="h-4 w-4" />
              </span>
              <h4 className="font-display text-base font-bold text-[#231426]">
                Baby’s Growth & Milestones
              </h4>
            </div>

            <p className="text-xs leading-relaxed text-[#5a435f]">
              {weekData.babyHighlight}
            </p>

            <div className="rounded-2xl border border-purple-100 bg-purple-50/50 p-3 text-xs space-y-1.5">
              <span className="font-bold text-purple-950 block">Anatomical Highlights:</span>
              <p className="text-purple-900 leading-relaxed">
                During Week {selectedWeek}, vital organs, neural connections, and muscle tissues are maturing at exponential rates.
              </p>
            </div>
          </div>

          {/* Maternal Symptoms & Sensation Card */}
          <div className="rounded-3xl border border-[#f0dfea] bg-white p-5 shadow-soft space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#fff0f6] text-[#f075aa]">
                <Heart className="h-4 w-4" />
              </span>
              <h4 className="font-display text-base font-bold text-[#231426]">
                What Mama Might Feel (Symptoms)
              </h4>
            </div>

            <p className="text-xs text-[#745f78]">
              Common physiological changes and symptoms typical for Week {selectedWeek}:
            </p>

            <div className="flex flex-wrap gap-1.5">
              {weekData.symptoms.map((s, idx) => (
                <span
                  key={idx}
                  className="rounded-full border border-[#f0dfea] bg-[#fff8fb] px-3 py-1 text-xs font-semibold text-[#5a435f]"
                >
                  {s}
                </span>
              ))}
            </div>

            <div className="mt-2 rounded-2xl border border-rose-100 bg-rose-50/50 p-3 text-xs text-rose-950">
              <strong>Mama Self-Care Note:</strong> {weekData.selfCare}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'selfCare' && (
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Safe Movement */}
          <div className="rounded-3xl border border-[#f0dfea] bg-white p-5 shadow-soft space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Flower2 className="h-4 w-4" />
              </span>
              <h4 className="font-display text-base font-bold text-[#231426]">
                Recommended Safe Physical Activities
              </h4>
            </div>

            <p className="text-xs text-[#745f78]">
              Low-impact movement curated to protect joints, spine, and pelvis during {selectedTrimesterLabel}:
            </p>

            <ul className="space-y-2 text-xs text-[#5a435f]">
              {weekData.suitableActivities.map((act, idx) => (
                <li key={idx} className="flex items-center gap-2.5 rounded-2xl border border-[#f0dfea] bg-[#fff8fb] p-2.5">
                  <span className="h-2 w-2 rounded-full bg-[#c1a9ee]" />
                  <span className="font-semibold text-[#231426]">{act}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Self-Care & Relaxation */}
          <div className="rounded-3xl border border-[#f0dfea] bg-white p-5 shadow-soft space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Sparkles className="h-4 w-4" />
              </span>
              <h4 className="font-display text-base font-bold text-[#231426]">
                Self-Care & Maternal Rest
              </h4>
            </div>

            <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-3.5 text-xs text-amber-950 space-y-2">
              <p className="font-bold">🌿 Weekly Rest Strategy:</p>
              <p className="leading-relaxed">{weekData.selfCare}</p>
            </div>

            <div className="rounded-2xl border border-[#f0dfea] bg-[#fff8fb] p-3.5 text-xs text-[#5a435f] space-y-1">
              <p className="font-bold text-[#231426]">Doctor & Midwife Reminder:</p>
              <p>
                Prioritize restorative sleep in the left lateral position with comfortable knee support pillows to optimize placental perfusion.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'nutrition' && (
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Nutrition Focus */}
          <div className="rounded-3xl border border-[#f0dfea] bg-white p-5 shadow-soft space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Apple className="h-4 w-4" />
              </span>
              <h4 className="font-display text-base font-bold text-[#231426]">
                Nutritional Focus for Week {selectedWeek}
              </h4>
            </div>

            <p className="text-xs leading-relaxed text-[#5a435f]">
              {weekData.nutritionFocus}
            </p>

            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-3.5 text-xs text-emerald-950 space-y-1">
              <span className="font-bold block">Mama Tip:</span>
              <p className="leading-relaxed">{weekData.mamaTip}</p>
            </div>
          </div>

          {/* Precautions & Foods to Avoid */}
          <div className="rounded-3xl border border-rose-200 bg-rose-50/50 p-5 shadow-soft space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
                <ShieldAlert className="h-4 w-4" />
              </span>
              <h4 className="font-display text-base font-bold text-rose-950">
                Safety Precautions & Foods to Avoid
              </h4>
            </div>

            <div className="space-y-3 text-xs text-rose-950">
              <div>
                <strong className="block mb-1">Key Precautions:</strong>
                <ul className="space-y-1 list-disc list-inside text-rose-900">
                  {weekData.precautions.map((p, idx) => (
                    <li key={idx}>{p}</li>
                  ))}
                </ul>
              </div>

              <div>
                <strong className="block mb-1">Avoid or Limit:</strong>
                <div className="flex flex-wrap gap-1.5">
                  {weekData.avoidOrLimit.map((item, idx) => (
                    <span
                      key={idx}
                      className="rounded-full border border-rose-200 bg-white px-2.5 py-1 text-[11px] font-bold text-rose-800 shadow-xs"
                    >
                      ⚠️ {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'checklist' && (
        <div className="rounded-3xl border border-[#f0dfea] bg-white p-5 shadow-soft sm:p-7 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-4 w-4" />
              </span>
              <div>
                <h4 className="font-display text-lg font-bold text-[#231426]">
                  Week {selectedWeek} Action Checklist
                </h4>
                <p className="text-xs text-[#745f78]">
                  Evidence-based milestones and appointments for this gestational week. Tap to complete.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            {weekData.weeklyChecklist.map((task, idx) => {
              const taskId = `w${selectedWeek}-task-${idx}`;
              const isDone = completedChecklistIds.includes(taskId);

              return (
                <div
                  key={idx}
                  onClick={() => mamaStore.toggleChecklistItem(taskId)}
                  className={`flex cursor-pointer items-center justify-between rounded-2xl border p-3.5 transition-all ${
                    isDone
                      ? 'border-emerald-200 bg-emerald-50/50 text-emerald-900 shadow-xs'
                      : 'border-[#f0dfea] bg-[#fff8fb] text-[#231426] hover:bg-white hover:border-[#f075aa]/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors ${
                        isDone
                          ? 'border-emerald-500 bg-emerald-500 text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isDone && <Check className="h-3.5 w-3.5" />}
                    </div>
                    <span
                      className={`text-xs font-semibold ${
                        isDone ? 'line-through text-slate-500' : 'text-[#231426]'
                      }`}
                    >
                      {task}
                    </span>
                  </div>
                  <span
                    className={`text-[11px] font-bold ${
                      isDone ? 'text-emerald-700' : 'text-[#745f78]'
                    }`}
                  >
                    {isDone ? 'Completed ✨' : 'Tap to mark done'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
