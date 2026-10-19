import React from 'react';
import { X, ShieldAlert, HeartHandshake, PhoneCall, CheckCircle2 } from 'lucide-react';

interface MedicalDisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MedicalDisclaimerModal: React.FC<MedicalDisclaimerModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-[#231426]/50 backdrop-blur-xs transition-opacity" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-3xl border border-[#f0dfea] bg-white p-5 shadow-2xl transition-all sm:p-8">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff0f6] text-[#f075aa]">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-[#231426]">
                Pregnancy Wellness & Safety Notice
              </h3>
              <p className="text-xs text-[#745f78]">Educational companion, not medical diagnosis</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-[#745f78] hover:bg-[#fff8fb] hover:text-[#231426]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4 text-sm leading-relaxed text-[#5a435f]">
          <div className="rounded-2xl border border-[#fdebf3] bg-[#fff8fb] p-4">
            <h4 className="flex items-center gap-2 font-semibold text-[#231426]">
              <HeartHandshake className="h-4 w-4 text-[#f075aa]" />
              Our Commitment to You & Baby
            </h4>
            <p className="mt-1 text-xs text-[#745f78]">
              MamaFit AI is designed to support, inspire, and gently encourage your daily wellness habits—including hydration, mindful nutrition, safe movement, and peace of mind.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-[#231426]">Important Medical Distinctions:</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#91debc]" />
                <span>
                  <strong>Not a Medical Doctor:</strong> Content, algorithms, and AI responses provide general educational information and are never a substitute for clinical advice from your OB-GYN, midwife, or physician.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#91debc]" />
                <span>
                  <strong>No Medication or Diagnosis:</strong> We never diagnose medical conditions, prescribe drugs, or recommend changing existing prenatal treatment plans without clinical supervision.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#91debc]" />
                <span>
                  <strong>Individual Needs:</strong> Every pregnancy is unique (e.g. gestational diabetes, preeclampsia risk, placenta placement). Always confirm dietary or workout adjustments with your doctor.
                </span>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-4 text-xs text-rose-900">
            <h4 className="flex items-center gap-2 font-bold text-rose-950">
              <PhoneCall className="h-4 w-4 text-rose-600" />
              Immediate Medical Attention Needed If You Experience:
            </h4>
            <p className="mt-1.5 leading-normal">
              Vaginal bleeding or spotting, fluid leakage, severe abdominal cramping, sudden intense swelling of hands or face, persistent visual changes/headaches, high fever, or a noticeable reduction in fetal kicks. Contact your healthcare provider or maternity triage emergency unit immediately.
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="w-full rounded-2xl bg-[#f075aa] py-3 text-center text-sm font-semibold text-white shadow-soft transition-all hover:bg-[#e05892] focus:outline-none"
          >
            I Understand & Agree
          </button>
        </div>
      </div>
    </div>
  );
};
