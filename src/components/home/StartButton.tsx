// src/components/home/StartButton.tsx
import React, { useState } from 'react';
import { Camera, Sparkles, ArrowRight } from 'lucide-react';
import { soundEngine } from '../../utils/audio';

interface StartButtonProps {
  onStart: () => void;
  isPhone?: boolean;
}

export const StartButton: React.FC<StartButtonProps> = ({ onStart, isPhone = false }) => {
  const [isFlashing, setIsFlashing] = useState(false);

  const handleClick = () => {
    // 1. Play Shutter Sound
    soundEngine.playShutter();
    // 2. Trigger Flash Effect
    setIsFlashing(true);
    // 3. Transition to Booth Experience after flash
    setTimeout(() => {
      onStart();
    }, 280);
  };

  return (
    <>
      {/* Live Flash Burst Overlay on Start */}
      {isFlashing && <div className="animate-studio-flash" />}

      <button
        onClick={handleClick}
        style={{
          width: '100%',
          minHeight: isPhone ? '58px' : '66px',
          padding: isPhone ? '0 24px' : '0 32px',
          borderRadius: 'var(--radius-pill)',
          background: 'linear-gradient(135deg, #24133F 0%, #4A1248 45%, #8B4DFF 100%)',
          color: '#FFFFFF',
          border: '1.5px solid rgba(232, 62, 122, 0.65)',
          boxShadow: '0 10px 30px rgba(139, 77, 255, 0.35), 0 0 25px rgba(232, 62, 122, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
          fontFamily: 'var(--font-display)',
          fontWeight: 900,
          fontSize: isPhone ? '1.15rem' : '1.35rem',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          transition: 'all 0.15s cubic-bezier(0.2, 0.8, 0.2, 1)',
          touchAction: 'manipulation',
          outline: 'none',
          position: 'relative',
          overflow: 'hidden'
        }}
        className="luma-btn luma-btn-cinema-start"
        aria-label="Start LumaBooth Photobooth Session"
      >
        <Sparkles size={20} color="#E83E7A" />
        <span>START BOOTH</span>
        <ArrowRight size={20} color="#FFFFFF" />
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 2
          }}
        >
          <Camera size={18} color="#FFFFFF" />
        </div>
      </button>
    </>
  );
};
