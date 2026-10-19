import React from 'react';
import { Heart, Apple, Droplets, Flower2, Sparkles, User } from 'lucide-react';

interface BottomNavProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onNavigate }) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: Heart },
    { id: 'nutrition', label: 'Food', icon: Apple },
    { id: 'activity', label: 'Activity', icon: Droplets },
    { id: 'exercise', label: 'Move', icon: Flower2 },
    { id: 'coach', label: 'Mama AI', icon: Sparkles, isAi: true },
    { id: 'profile', label: 'Me', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#f0dfea] bg-[#fff8fb]/95 backdrop-blur-md md:hidden safe-area-pb shadow-lg">
      <div className="flex items-center justify-around px-2 py-1.5 min-h-[56px]">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          const Icon = tab.icon;

          if (tab.isAi) {
            return (
              <button
                key={tab.id}
                onClick={() => onNavigate(tab.id)}
                className="group relative -mt-4 flex flex-col items-center focus:outline-none min-w-[48px] min-h-[48px] justify-center"
                aria-label="Mama AI Coach"
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-tr from-[#f075aa] via-[#fe93a1] to-[#c1a9ee] text-white shadow-glow scale-105'
                      : 'bg-[#fff0f6] text-[#f075aa] border border-[#f075aa]/40 shadow-soft'
                  }`}
                >
                  <Sparkles className="h-5 w-5 animate-pulse" />
                </div>
                <span
                  className={`mt-1 text-[10px] font-semibold tracking-tight transition-colors ${
                    isActive ? 'text-[#f075aa]' : 'text-[#745f78]'
                  }`}
                >
                  Mama AI
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className="flex flex-1 flex-col items-center justify-center py-1 text-center transition-colors focus:outline-none min-h-[48px] touch-manipulation"
              aria-label={tab.label}
            >
              <div
                className={`relative flex h-7 w-7 items-center justify-center rounded-xl transition-all ${
                  isActive ? 'text-[#f075aa]' : 'text-[#745f78] hover:text-[#231426]'
                }`}
              >
                <Icon
                  className={`h-5 w-5 transition-transform duration-200 ${
                    isActive ? 'scale-110 fill-[#f075aa]/20 text-[#f075aa]' : ''
                  }`}
                />
              </div>
              <span
                className={`text-[10px] tracking-tight transition-colors ${
                  isActive ? 'font-bold text-[#f075aa]' : 'font-medium text-[#745f78]'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
