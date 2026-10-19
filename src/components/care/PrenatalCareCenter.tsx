import React, { useState } from 'react';
import {
  ShieldAlert,
  Calendar,
  Plus,
  Trash2,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Heart,
  PhoneCall,
  Pill,
  Sparkles,
} from 'lucide-react';
import { useMamaStore, mamaStore } from '../../store/useMamaStore';
import { AppointmentItem } from '../../types';

export const PrenatalCareCenter: React.FC = () => {
  const { profile, today } = useMamaStore();
  const appointments = profile.appointments || [];

  const [showAddApt, setShowAddApt] = useState(false);
  const [aptTitle, setAptTitle] = useState('');
  const [aptProvider, setAptProvider] = useState('');
  const [aptDate, setAptDate] = useState('');
  const [aptTime, setAptTime] = useState('10:00 AM');
  const [aptLocation, setAptLocation] = useState('');
  const [aptNotes, setAptNotes] = useState('');
  const [aptType, setAptType] = useState<AppointmentItem['type']>('routine');

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aptTitle.trim() || !aptDate) return;

    mamaStore.addAppointment({
      title: aptTitle.trim(),
      provider: aptProvider.trim() || 'OB-GYN / Midwife',
      date: aptDate,
      time: aptTime,
      location: aptLocation.trim(),
      notes: aptNotes.trim(),
      type: aptType,
      completed: false,
    });

    setAptTitle('');
    setAptProvider('');
    setAptDate('');
    setAptLocation('');
    setAptNotes('');
    setShowAddApt(false);
  };

  return (
    <div className="space-y-6">
      {/* 1. Red Flag Medical Warning Card */}
      <div className="rounded-3xl border-2 border-rose-300 bg-gradient-to-br from-rose-50 via-white to-rose-50/60 p-5 shadow-soft sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-rose-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-rose-100 text-rose-700">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-800">
                Immediate Clinical Assessment
              </span>
              <h3 className="font-display text-xl font-bold text-rose-950 mt-0.5">
                Warning Symptoms Requiring Urgent Care
              </h3>
            </div>
          </div>

          <a
            href="tel:911"
            className="flex items-center justify-center gap-2 rounded-2xl bg-rose-600 px-5 py-2.5 text-xs font-bold text-white shadow-soft hover:bg-rose-700 transition-colors"
          >
            <PhoneCall className="h-4 w-4" />
            <span>Emergency Services</span>
          </a>
        </div>

        <p className="mt-3 text-xs leading-relaxed text-rose-900">
          This educational companion does not replace diagnostic obstetric care. Contact your OB-GYN, midwife, or maternity emergency department without delay if you experience:
        </p>

        <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2 text-xs">
          <div className="flex items-start gap-2.5 rounded-2xl border border-rose-200/80 bg-white p-3 shadow-xs">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-100 font-bold text-rose-700">
              1
            </span>
            <div>
              <p className="font-bold text-rose-950">Vaginal Bleeding or Fluid Leakage</p>
              <p className="text-[#5a435f] text-[11px]">Any bright red bleeding or continuous trickle/gush of amniotic fluid.</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 rounded-2xl border border-rose-200/80 bg-white p-3 shadow-xs">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-100 font-bold text-rose-700">
              2
            </span>
            <div>
              <p className="font-bold text-rose-950">Severe Headache & Vision Changes</p>
              <p className="text-[#5a435f] text-[11px]">Flashing spots, blurry vision, or sudden intense swelling in hands/face (preeclampsia signs).</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 rounded-2xl border border-rose-200/80 bg-white p-3 shadow-xs">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-100 font-bold text-rose-700">
              3
            </span>
            <div>
              <p className="font-bold text-rose-950">Noticeably Reduced Fetal Kicks</p>
              <p className="text-[#5a435f] text-[11px]">From week 28 onwards: if baby does not reach 10 movements in 2 hours even after cold water.</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 rounded-2xl border border-rose-200/80 bg-white p-3 shadow-xs">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-100 font-bold text-rose-700">
              4
            </span>
            <div>
              <p className="font-bold text-rose-950">Persistent Severe Abdominal Cramping</p>
              <p className="text-[#5a435f] text-[11px]">Severe localized pain, high fever (&gt;100.4°F), or pain that does not resolve with rest.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Prenatal Appointment Reminders & Personal Schedule */}
      <div className="rounded-3xl border border-[#f0dfea] bg-white p-5 shadow-soft sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#f0dfea] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <Calendar className="h-4 w-4" />
              </span>
              <h3 className="font-display text-xl font-bold text-[#231426]">
                Prenatal Appointments & Clinical Tests
              </h3>
            </div>
            <p className="text-xs text-[#745f78] mt-0.5">
              Keep track of ultrasounds, midwife visits, glucose tolerance tests, and lab work.
            </p>
          </div>

          <button
            onClick={() => setShowAddApt(!showAddApt)}
            className="flex items-center justify-center gap-1.5 rounded-2xl bg-[#f075aa] px-4 py-2 text-xs font-bold text-white shadow-soft hover:bg-[#e05892] transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>{showAddApt ? 'Cancel' : 'Add Appointment'}</span>
          </button>
        </div>

        {/* Add Appointment Modal/Form */}
        {showAddApt && (
          <form onSubmit={handleCreateAppointment} className="my-4 rounded-2xl border border-[#f0dfea] bg-[#fff8fb] p-4 text-xs space-y-3">
            <h4 className="font-bold text-[#231426]">Schedule New Prenatal Visit</h4>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-[#745f78] mb-1 font-semibold">Visit Title / Purpose *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 28-Week Routine Checkup & Tdap"
                  value={aptTitle}
                  onChange={(e) => setAptTitle(e.target.value)}
                  className="w-full rounded-xl border border-[#f0dfea] bg-white p-2.5 text-xs focus:outline-none focus:border-[#f075aa]"
                />
              </div>
              <div>
                <label className="block text-[#745f78] mb-1 font-semibold">Doctor / Midwife Name</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Sarah Mitchell, OB-GYN"
                  value={aptProvider}
                  onChange={(e) => setAptProvider(e.target.value)}
                  className="w-full rounded-xl border border-[#f0dfea] bg-white p-2.5 text-xs focus:outline-none focus:border-[#f075aa]"
                />
              </div>
              <div>
                <label className="block text-[#745f78] mb-1 font-semibold">Date *</label>
                <input
                  type="date"
                  required
                  value={aptDate}
                  onChange={(e) => setAptDate(e.target.value)}
                  className="w-full rounded-xl border border-[#f0dfea] bg-white p-2.5 text-xs focus:outline-none focus:border-[#f075aa]"
                />
              </div>
              <div>
                <label className="block text-[#745f78] mb-1 font-semibold">Time</label>
                <input
                  type="text"
                  placeholder="e.g. 10:30 AM"
                  value={aptTime}
                  onChange={(e) => setAptTime(e.target.value)}
                  className="w-full rounded-xl border border-[#f0dfea] bg-white p-2.5 text-xs focus:outline-none focus:border-[#f075aa]"
                />
              </div>
              <div>
                <label className="block text-[#745f78] mb-1 font-semibold">Type</label>
                <select
                  value={aptType}
                  onChange={(e) => setAptType(e.target.value as any)}
                  className="w-full rounded-xl border border-[#f0dfea] bg-white p-2.5 text-xs focus:outline-none focus:border-[#f075aa]"
                >
                  <option value="routine">Routine Prenatal Visit</option>
                  <option value="ultrasound">Ultrasound Scan (NT / Anatomy / Growth)</option>
                  <option value="glucose">Glucose Tolerance Screen</option>
                  <option value="bloodwork">Laboratory Bloodwork / GBS</option>
                  <option value="specialist">Specialist / MFM Consultation</option>
                </select>
              </div>
              <div>
                <label className="block text-[#745f78] mb-1 font-semibold">Clinic Location</label>
                <input
                  type="text"
                  placeholder="e.g. St. Mary Maternity Suite 3"
                  value={aptLocation}
                  onChange={(e) => setAptLocation(e.target.value)}
                  className="w-full rounded-xl border border-[#f0dfea] bg-white p-2.5 text-xs focus:outline-none focus:border-[#f075aa]"
                />
              </div>
            </div>
            <div>
              <label className="block text-[#745f78] mb-1 font-semibold">Notes / Questions to Ask</label>
              <textarea
                rows={2}
                placeholder="Questions about birth plan, iron levels, pediatricians, etc."
                value={aptNotes}
                onChange={(e) => setAptNotes(e.target.value)}
                className="w-full rounded-xl border border-[#f0dfea] bg-white p-2.5 text-xs focus:outline-none focus:border-[#f075aa]"
              />
            </div>
            <button
              type="submit"
              className="rounded-xl bg-[#231426] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#3d2442]"
            >
              Save Appointment
            </button>
          </form>
        )}

        {/* List of Appointments */}
        <div className="mt-4 space-y-3">
          {appointments.length === 0 ? (
            <p className="text-xs text-[#745f78] italic">No upcoming appointments logged. Tap "+ Add Appointment" above.</p>
          ) : (
            appointments.map((apt) => (
              <div
                key={apt.id}
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border p-4 transition-all ${
                  apt.completed
                    ? 'border-emerald-200 bg-emerald-50/40 text-emerald-950'
                    : 'border-[#f0dfea] bg-[#fff8fb] text-[#231426]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => mamaStore.toggleAppointment(apt.id)}
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
                      apt.completed
                        ? 'border-emerald-500 bg-emerald-500 text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {apt.completed && <CheckCircle2 className="h-3.5 w-3.5" />}
                  </button>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className={`text-sm font-bold ${apt.completed ? 'line-through text-slate-500' : ''}`}>
                        {apt.title}
                      </h4>
                      <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#745f78] border border-[#f0dfea]">
                        {apt.type}
                      </span>
                    </div>
                    <p className="text-xs text-[#745f78] mt-0.5">
                      {apt.provider} · <strong>{apt.date}</strong> at {apt.time} {apt.location ? `· ${apt.location}` : ''}
                    </p>
                    {apt.notes && (
                      <p className="mt-1 text-[11px] text-[#5a435f] italic">
                        Notes: {apt.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => mamaStore.deleteAppointment(apt.id)}
                    className="rounded-full p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 3. Daily Supplement & Medication Safety Check */}
      <div className="rounded-3xl border border-[#f0dfea] bg-white p-5 shadow-soft sm:p-7">
        <div className="flex items-center gap-2 mb-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-50 text-[#f075aa]">
            <Pill className="h-4 w-4" />
          </span>
          <div>
            <h3 className="font-display text-xl font-bold text-[#231426]">
              Daily Prenatal Supplements Tracker
            </h3>
            <p className="text-xs text-[#745f78]">
              Evidence-based routine reminders. Tap to check off as you take them today.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {/* Prenatal Multivitamin */}
          <div
            onClick={() => mamaStore.toggleVitamin('multivitamin')}
            className={`flex cursor-pointer items-center justify-between rounded-2xl border p-3.5 transition-all ${
              today.vitamins.multivitamin
                ? 'border-emerald-300 bg-emerald-50/50'
                : 'border-[#f0dfea] bg-[#fff8fb] hover:bg-white'
            }`}
          >
            <div>
              <p className="text-xs font-bold text-[#231426]">Prenatal Multivitamin</p>
              <p className="text-[11px] text-[#745f78]">Comprehensive vitamins & trace minerals</p>
            </div>
            <span className={`text-xs font-semibold ${today.vitamins.multivitamin ? 'text-emerald-700' : 'text-[#745f78]'}`}>
              {today.vitamins.multivitamin ? 'Taken ✨' : 'Tap to Log'}
            </span>
          </div>

          {/* Folic Acid */}
          <div
            onClick={() => mamaStore.toggleVitamin('folate')}
            className={`flex cursor-pointer items-center justify-between rounded-2xl border p-3.5 transition-all ${
              today.vitamins.folate
                ? 'border-emerald-300 bg-emerald-50/50'
                : 'border-[#f0dfea] bg-[#fff8fb] hover:bg-white'
            }`}
          >
            <div>
              <p className="text-xs font-bold text-[#231426]">Folate / Folic Acid (400-600mcg)</p>
              <p className="text-[11px] text-[#745f78]">Neural tube & embryonic spine protection</p>
            </div>
            <span className={`text-xs font-semibold ${today.vitamins.folate ? 'text-emerald-700' : 'text-[#745f78]'}`}>
              {today.vitamins.folate ? 'Taken ✨' : 'Tap to Log'}
            </span>
          </div>

          {/* Elemental Iron */}
          <div
            onClick={() => mamaStore.toggleVitamin('iron')}
            className={`flex cursor-pointer items-center justify-between rounded-2xl border p-3.5 transition-all ${
              today.vitamins.iron
                ? 'border-emerald-300 bg-emerald-50/50'
                : 'border-[#f0dfea] bg-[#fff8fb] hover:bg-white'
            }`}
          >
            <div>
              <p className="text-xs font-bold text-[#231426]">Iron Supplement (27mg)</p>
              <p className="text-[11px] text-[#745f78]">Best with Vitamin C; avoid dairy at same time</p>
            </div>
            <span className={`text-xs font-semibold ${today.vitamins.iron ? 'text-emerald-700' : 'text-[#745f78]'}`}>
              {today.vitamins.iron ? 'Taken ✨' : 'Tap to Log'}
            </span>
          </div>

          {/* DHA Omega-3 */}
          <div
            onClick={() => mamaStore.toggleVitamin('dha')}
            className={`flex cursor-pointer items-center justify-between rounded-2xl border p-3.5 transition-all ${
              today.vitamins.dha
                ? 'border-emerald-300 bg-emerald-50/50'
                : 'border-[#f0dfea] bg-[#fff8fb] hover:bg-white'
            }`}
          >
            <div>
              <p className="text-xs font-bold text-[#231426]">DHA Omega-3 (200-300mg)</p>
              <p className="text-[11px] text-[#745f78]">Fetal brain and eye development</p>
            </div>
            <span className={`text-xs font-semibold ${today.vitamins.dha ? 'text-emerald-700' : 'text-[#745f78]'}`}>
              {today.vitamins.dha ? 'Taken ✨' : 'Tap to Log'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
