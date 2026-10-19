import React, { useState, useEffect } from 'react';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { HomePage } from './pages/HomePage';
import { NutritionPage } from './pages/NutritionPage';
import { ActivityPage } from './pages/ActivityPage';
import { ExercisePage } from './pages/ExercisePage';
import { CoachPage } from './pages/CoachPage';
import { ProfilePage } from './pages/ProfilePage';
import { MedicalDisclaimerModal } from './components/common/MedicalDisclaimerModal';
import { GitHubExportModal } from './components/common/GitHubExportModal';
import { OnboardingModal } from './components/common/OnboardingModal';
import { useMamaStore } from './store/useMamaStore';

export default function App() {
  const { profile } = useMamaStore();

  // Read initial tab from URL hash if present
  const getInitialTab = (): string => {
    const hash = window.location.hash.replace('#', '').toLowerCase();
    if (['home', 'nutrition', 'activity', 'exercise', 'coach', 'profile'].includes(hash)) {
      return hash;
    }
    const path = window.location.pathname.replace('/', '').toLowerCase();
    if (['home', 'nutrition', 'activity', 'exercise', 'coach', 'profile'].includes(path)) {
      return path;
    }
    return 'home';
  };

  const [currentTab, setCurrentTab] = useState<string>(getInitialTab);
  const [showSafetyModal, setShowSafetyModal] = useState(false);
  const [showGitHubModal, setShowGitHubModal] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(!profile.onboarded);

  // Sync tab with URL hash
  const handleNavigate = (tab: string) => {
    setCurrentTab(tab);
    window.location.hash = tab;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Listen to hash changes
  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (['home', 'nutrition', 'activity', 'exercise', 'coach', 'profile'].includes(hash)) {
        setCurrentTab(hash);
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#fff8fb] text-[#231426] flex flex-col selection:bg-[#f075aa]/20 selection:text-[#f075aa]">
      {/* Top Header for Desktop, Laptop, and Tablet */}
      <Header
        currentTab={currentTab}
        onNavigate={handleNavigate}
        onOpenSafetyModal={() => setShowSafetyModal(true)}
        onOpenGitHubModal={() => setShowGitHubModal(true)}
      />

      {/* Main Responsive Container */}
      <main className="flex-1 mx-auto w-full max-w-5xl px-3.5 pt-4 pb-28 sm:px-6 md:pt-6 md:pb-12">
        {currentTab === 'home' && <HomePage onNavigate={handleNavigate} />}
        {currentTab === 'nutrition' && <NutritionPage />}
        {currentTab === 'activity' && <ActivityPage />}
        {currentTab === 'exercise' && <ExercisePage />}
        {currentTab === 'coach' && <CoachPage />}
        {currentTab === 'profile' && (
          <ProfilePage
            onOpenSafetyModal={() => setShowSafetyModal(true)}
            onOpenGitHubModal={() => setShowGitHubModal(true)}
          />
        )}
      </main>

      {/* Floating Bottom Nav (Mobile phones & smaller screens) */}
      <BottomNav currentTab={currentTab} onNavigate={handleNavigate} />

      {/* Modals with max-height and safe scroll */}
      <MedicalDisclaimerModal
        isOpen={showSafetyModal}
        onClose={() => setShowSafetyModal(false)}
      />

      <GitHubExportModal
        isOpen={showGitHubModal}
        onClose={() => setShowGitHubModal(false)}
      />

      <OnboardingModal
        isOpen={showOnboarding}
        onComplete={() => setShowOnboarding(false)}
      />
    </div>
  );
}
