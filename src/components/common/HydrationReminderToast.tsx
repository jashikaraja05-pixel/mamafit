import React, { useState, useEffect } from 'react';
import { Droplets, Plus, Clock, X, Check, BellRing } from 'lucide-react';
import { mamaStore } from '../../store/useMamaStore';
import { HYDRATION_ALERT_EVENT, HydrationAlertDetail } from '../../utils/hydrationScheduler';

export const HydrationReminderToast: React.FC = () => {
  const [activeAlert, setActiveAlert] = useState<HydrationAlertDetail | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  useEffect(() => {
    const handleAlert = (e: Event) => {
      const customEvent = e as CustomEvent<HydrationAlertDetail>;
      if (customEvent.detail) {
        setActiveAlert(customEvent.detail);
        setActionNotice(null);
      }
    };

    window.addEventListener(HYDRATION_ALERT_EVENT, handleAlert);
    return () => window.removeEventListener(HYDRATION_ALERT_EVENT, handleAlert);
  }, []);

  const handleQuickLog = () => {
    mamaStore.addWater(250);
    setActionNotice('Logged +250 ml! Baby says thank you 🌸');
    setTimeout(() => {
      setActiveAlert(null);
      setActionNotice(null);
    }, 1800);
  };

  const handleSnooze = (minutes = 15) => {
    mamaStore.snoozeHydration(minutes);
    setActionNotice(`Snoozed for ${minutes} minutes ⏰`);
    setTimeout(() => {
      setActiveAlert(null);
      setActionNotice(null);
    }, 1500);
  };

  const handleDismiss = () => {
    setActiveAlert(null);
    setActionNotice(null);
  };

  if (!activeAlert) return null;

  return (
    <div className="fixed top-4 right-4 left-4 sm:left-auto sm:w-[420px] z-50 animate-slideDown pointer-events-auto">
      <div className="relative overflow-hidden rounded-3xl border-2 border-sky-300 bg-white/95 p-4 shadow-2xl backdrop-blur-md">
        {/* Soft background tint */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-sky-200/40 blur-2xl" />

        <div className="relative z-10">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-sky-500 text-white shadow-soft animate-bounce">
                <Droplets className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-bold text-sky-800 uppercase tracking-wider">
                    {activeAlert.isTest ? 'Test Reminder' : 'Hydration Alert'}
                  </span>
                  <span className="text-[10px] text-[#745f78]">{activeAlert.timestamp}</span>
                </div>
                <h4 className="font-display text-sm font-bold text-[#231426]">
                  {activeAlert.title}
                </h4>
              </div>
            </div>

            <button
              onClick={handleDismiss}
              className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              title="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <p className="mt-2 text-xs leading-relaxed text-[#4a344d]">
            {activeAlert.message}
          </p>

          {actionNotice ? (
            <div className="mt-3 flex items-center gap-2 rounded-2xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800 animate-fadeIn">
              <Check className="h-4 w-4 text-emerald-600" />
              <span>{actionNotice}</span>
            </div>
          ) : (
            <div className="mt-3.5 flex items-center gap-2">
              <button
                onClick={handleQuickLog}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-sky-500 px-3 py-2 text-xs font-bold text-white shadow-xs hover:bg-sky-600 active:scale-95 transition-all"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Drink +250 ml</span>
              </button>

              <button
                onClick={() => handleSnooze(15)}
                className="flex items-center gap-1 rounded-2xl border border-sky-200 bg-sky-50 px-3 py-2 text-xs font-semibold text-sky-800 hover:bg-sky-100 transition-all active:scale-95"
              >
                <Clock className="h-3.5 w-3.5" />
                <span>Snooze 15m</span>
              </button>

              <button
                onClick={handleDismiss}
                className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-all"
              >
                Dismiss
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
