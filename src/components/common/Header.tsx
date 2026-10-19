import React from 'react';
import { Sparkles, Heart, ShieldAlert, GitBranch } from 'lucide-react';
import { useMamaStore } from '../../store/useMamaStore';
import logoImg from '../../assets/logo.png';

interface HeaderProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  onOpenSafetyModal: () => void;
  onOpenGitHubModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onNavigate,
  onOpenSafetyModal,
  onOpenGitHubModal,
}) => {
  const { profile, streak } = useMamaStore();
  const week = profile.pregnancyWeek || 16;
  const trimester = week <= 13 ? 'Trimester 1' : week <= 26 ? 'Trimester 2' : 'Trimester 3';

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'nutrition', label: 'Food' },
    { id: 'activity', label: 'Activity' },
    { id: 'exercise', label: 'Move' },
    { id: 'coach', label: 'Mama AI' },
    { id: 'profile', label: 'Me' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#f0dfea] bg-[#fff8fb]/95 backdrop-blur-md transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6">
        {/* Zone 1: Brand with real logo image */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 text-left transition-opacity hover:opacity-95 focus:outline-none"
        >
          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-2xl border border-[#f075aa]/30 bg-white shadow-soft">
            <img
              src={logoImg}
              alt="MamaFit AI Logo"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-xl font-bold tracking-tight text-[#231426] sm:text-2xl">
              MamaFit<span className="text-[#f075aa]"> AI</span>
            </span>
            <span className="text-[10px] font-medium tracking-wide text-[#745f78]">
              Pregnancy Wellness Companion
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links (Desktop) */}
        <nav className="hidden items-center gap-1 md:flex lg:gap-2">
          {navLinks.map((link) => {
            const isActive = currentTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className={`relative px-3.5 py-2 text-sm font-medium transition-all ${
                  isActive
                    ? 'font-semibold text-[#f075aa]'
                    : 'text-[#745f78] hover:text-[#231426]'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-[#f075aa]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions & Badges */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Week & Trimester Badge */}
          <div className="hidden items-center gap-1.5 rounded-full border border-[#f0dfea] bg-white px-3 py-1 text-xs font-medium text-[#231426] shadow-xs sm:flex">
            <Heart className="h-3.5 w-3.5 text-[#f075aa] fill-[#f075aa]" />
            <span>W{week}</span>
            <span className="text-[#745f78]/60">·</span>
            <span className="text-[#745f78]">{trimester}</span>
          </div>

          {/* Streak indicator */}
          <div className="flex items-center gap-1 rounded-full border border-[#ffe1ee] bg-[#fff0f6] px-2.5 py-1 text-xs font-semibold text-[#e04586]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{streak}d</span>
          </div>

          {/* Safety Disclaimer Info Button */}
          <button
            onClick={onOpenSafetyModal}
            title="Pregnancy Safety & Healthcare Disclaimer"
            className="flex items-center gap-1.5 rounded-full border border-[#f0dfea] bg-white p-1.5 text-xs font-medium text-[#745f78] transition-colors hover:border-[#f075aa] hover:text-[#f075aa] sm:px-2.5 sm:py-1"
          >
            <ShieldAlert className="h-4 w-4 text-[#f075aa]" />
            <span className="hidden sm:inline">Safety</span>
          </button>

          {/* GitHub Integration Modal Button */}
          <button
            onClick={onOpenGitHubModal}
            title="GitHub Repository & Code Export"
            className="flex items-center gap-1.5 rounded-full bg-[#231426] px-2.5 py-1 text-xs font-medium text-white transition-all hover:bg-[#3e2443] shadow-xs"
          >
            <GitBranch className="h-3.5 w-3.5 text-[#ffc6c0]" />
            <span className="hidden sm:inline">GitHub</span>
          </button>
        </div>
      </div>
    </header>
  );
};
