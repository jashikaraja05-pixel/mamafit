import React, { useState, useEffect } from 'react';
import { Sparkles, Eye, Info } from 'lucide-react';

interface AnimatedTrainerProps {
  pose?: 'cat-cow' | 'pelvic-tilt' | 'butterfly' | 'side-rest' | 'walking' | 'kegel-lift' | 'chest-opener';
  name: string;
}

export const AnimatedTrainer: React.FC<AnimatedTrainerProps> = ({ pose = 'cat-cow', name }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setFrame((f) => (f + 1) % 60);
    }, 50);
    return () => clearInterval(timer);
  }, []);

  // Compute sinusoids for smooth gentle movement
  const sine = Math.sin((frame / 60) * Math.PI * 2);
  const breath = (sine + 1) / 2; // 0 to 1

  const renderTrainerSVG = () => {
    switch (pose) {
      case 'cat-cow': {
        // Spine curve oscillates
        const spineY = 100 + sine * 12;
        const headRot = sine * 8;
        return (
          <svg viewBox="0 0 240 180" className="h-full w-full max-h-52 drop-shadow-md">
            {/* Floor mat */}
            <rect x="20" y="145" width="200" height="6" rx="3" fill="#f0dfea" />
            
            {/* Arms supporting */}
            <line x1="70" y1="110" x2="70" y2="145" stroke="#f075aa" strokeWidth="8" strokeLinecap="round" />
            {/* Knees supporting */}
            <line x1="170" y1="120" x2="170" y2="145" stroke="#f075aa" strokeWidth="8" strokeLinecap="round" />
            <circle cx="170" cy="145" r="4" fill="#231426" />
            <circle cx="70" cy="145" r="4" fill="#231426" />

            {/* Spine & Torso with dynamic curve */}
            <path
              d={`M 70 110 Q 120 ${spineY} 170 120`}
              fill="none"
              stroke="#e04586"
              strokeWidth="10"
              strokeLinecap="round"
            />

            {/* Baby Bump */}
            <ellipse
              cx="115"
              cy={115 + sine * 6}
              rx="18"
              ry="16"
              fill="#ffd8e8"
              stroke="#f075aa"
              strokeWidth="2"
            />

            {/* Head & gentle tilt */}
            <circle cx="50" cy={98 + headRot} r="14" fill="#fe93a1" />
            {/* Calming expression eyes */}
            <circle cx="45" cy={98 + headRot} r="2" fill="#231426" />
          </svg>
        );
      }

      case 'butterfly': {
        const kneeY = 120 - breath * 8;
        return (
          <svg viewBox="0 0 240 180" className="h-full w-full max-h-52 drop-shadow-md">
            {/* Mat */}
            <rect x="25" y="145" width="190" height="6" rx="3" fill="#f0dfea" />

            {/* Head */}
            <circle cx="120" cy="55" r="14" fill="#fe93a1" />
            {/* Torso */}
            <line x1="120" y1="69" x2="120" y2="125" stroke="#e04586" strokeWidth="12" strokeLinecap="round" />

            {/* Baby Bump gently breathing */}
            <ellipse cx="120" cy="105" rx={18 + breath * 3} ry="16" fill="#ffd8e8" stroke="#f075aa" strokeWidth="2" />

            {/* Arms resting on knees */}
            <line x1="115" y1="85" x2="70" y2={kneeY} stroke="#f075aa" strokeWidth="6" strokeLinecap="round" />
            <line x1="125" y1="85" x2="170" y2={kneeY} stroke="#f075aa" strokeWidth="6" strokeLinecap="round" />

            {/* Butterfly Legs / Knees open */}
            <path
              d={`M 120 135 Q 70 ${kneeY} 100 145`}
              fill="none"
              stroke="#f075aa"
              strokeWidth="8"
              strokeLinecap="round"
            />
            <path
              d={`M 120 135 Q 170 ${kneeY} 140 145`}
              fill="none"
              stroke="#f075aa"
              strokeWidth="8"
              strokeLinecap="round"
            />
            {/* Soles touching */}
            <circle cx="120" cy="143" r="5" fill="#231426" />
          </svg>
        );
      }

      case 'side-rest': {
        return (
          <svg viewBox="0 0 240 180" className="h-full w-full max-h-52 drop-shadow-md">
            {/* Soft Mattress line */}
            <rect x="20" y="135" width="200" height="6" rx="3" fill="#e0f2fe" />

            {/* Supportive pillow under head */}
            <rect x="35" y="90" width="35" height="20" rx="8" fill="#c1a9ee" opacity="0.6" />
            {/* Head resting peacefully */}
            <circle cx="50" cy="85" r="14" fill="#fe93a1" />

            {/* Body side-lying on left */}
            <line x1="55" y1="95" x2="150" y2="105" stroke="#e04586" strokeWidth="10" strokeLinecap="round" />

            {/* Bump resting on soft support */}
            <ellipse cx="105" cy={112 - breath * 4} rx="20" ry="17" fill="#ffd8e8" stroke="#f075aa" strokeWidth="2" />

            {/* Knee pillow between knees */}
            <rect x="140" y="105" width="28" height="18" rx="6" fill="#c1a9ee" opacity="0.7" />

            {/* Gentle bent knees */}
            <path d="M 145 105 L 175 118 L 155 135" fill="none" stroke="#f075aa" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      }

      case 'walking': {
        const legSwing = Math.sin((frame / 60) * Math.PI * 4) * 15;
        const armSwing = -legSwing * 0.8;
        return (
          <svg viewBox="0 0 240 180" className="h-full w-full max-h-52 drop-shadow-md">
            {/* Ground line */}
            <line x1="30" y1="155" x2="210" y2="155" stroke="#f0dfea" strokeWidth="4" strokeLinecap="round" />

            {/* Head */}
            <circle cx="120" cy={48 + Math.abs(sine) * 2} r="13" fill="#fe93a1" />
            {/* Torso */}
            <line x1="120" y1={61 + Math.abs(sine) * 2} x2="120" y2={105 + Math.abs(sine) * 2} stroke="#e04586" strokeWidth="11" strokeLinecap="round" />

            {/* Bump */}
            <ellipse cx="132" cy={88 + Math.abs(sine) * 2} rx="15" ry="14" fill="#ffd8e8" stroke="#f075aa" strokeWidth="2" />

            {/* Swinging Arms */}
            <line x1="120" y1="75" x2={120 + armSwing} y2="105" stroke="#f075aa" strokeWidth="6" strokeLinecap="round" />
            <line x1="120" y1="75" x2={120 - armSwing} y2="105" stroke="#c1a9ee" strokeWidth="6" strokeLinecap="round" />

            {/* Striding Legs */}
            <line x1="120" y1="105" x2={110 - legSwing} y2="153" stroke="#f075aa" strokeWidth="7" strokeLinecap="round" />
            <line x1="120" y1="105" x2={130 + legSwing} y2="153" stroke="#e04586" strokeWidth="7" strokeLinecap="round" />
          </svg>
        );
      }

      case 'pelvic-tilt':
      case 'kegel-lift':
      default: {
        // Concentric pelvic ring pulsating
        const ringScale = 30 + breath * 22;
        return (
          <svg viewBox="0 0 240 180" className="h-full w-full max-h-52 drop-shadow-md">
            {/* Soft background aura */}
            <circle cx="120" cy="90" r={ringScale + 15} fill="#ffd8e8" opacity="0.3" />
            <circle cx="120" cy="90" r={ringScale} fill="#fe93a1" opacity="0.4" stroke="#f075aa" strokeWidth="2" />

            {/* Core center icon */}
            <circle cx="120" cy="90" r="18" fill="#e04586" />
            <text x="120" y="95" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="bold">
              {sine > 0 ? 'LIFT' : 'SOFT'}
            </text>

            <text x="120" y="148" textAnchor="middle" fill="#745f78" fontSize="11" fontWeight="600">
              {sine > 0 ? 'Gently lift pelvic elevator' : 'Completely soften & release'}
            </text>
          </svg>
        );
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-[#f0dfea] bg-gradient-to-b from-[#fff8fb] to-white p-4 text-center">
      <div className="flex items-center gap-1.5 rounded-full bg-[#fff0f6] px-3 py-1 text-[11px] font-bold text-[#f075aa] mb-2">
        <Sparkles className="h-3 w-3" />
        <span>2D Animated Maternal Trainer: {name}</span>
      </div>

      <div className="h-44 w-full flex items-center justify-center">
        {renderTrainerSVG()}
      </div>

      <p className="mt-2 text-[11px] text-[#745f78]">
        Follow the rhythmic visual cue for smooth, safe pacing.
      </p>
    </div>
  );
};
