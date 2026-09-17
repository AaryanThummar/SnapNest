// src/components/home/CurtainIntro.tsx
import React, { useState, useCallback } from 'react';
import { soundEngine } from '../../utils/audio';

interface CurtainIntroProps {
  onOpened?: () => void;
}

export const CurtainIntro: React.FC<CurtainIntroProps> = ({ onOpened }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullyDismissed, setIsFullyDismissed] = useState(false);

  const handleOpenCurtains = useCallback(() => {
    if (isOpen) return;
    setIsOpen(true);
    soundEngine.playCurtainOpen();

    setTimeout(() => {
      setIsFullyDismissed(true);
      if (onOpened) onOpened();
    }, 950);
  }, [isOpen, onOpened]);

  if (isFullyDismissed) return null;

  return (
    <div
      onClick={handleOpenCurtains}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100dvh',
        zIndex: 9999,
        overflow: 'hidden',
        cursor: 'pointer',
        userSelect: 'none',
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'manipulation',
        pointerEvents: isOpen ? 'none' : 'auto',
        backgroundColor: '#090817'
      }}
      aria-label="Tap to open curtains and enter LumaBooth"
    >
      {/* LEFT VELVET CURTAIN PANEL */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '50.5%',
          height: '100%',
          transform: isOpen ? 'translateX(-100%)' : 'translateX(0%)',
          transition: 'transform 0.95s cubic-bezier(0.75, 0, 0.15, 1)',
          boxShadow: 'inset -30px 0 50px rgba(0, 0, 0, 0.95), 10px 0 40px rgba(0, 0, 0, 0.8)',
          zIndex: 2,
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            background: `
              repeating-linear-gradient(
                90deg,
                #060510 0px,
                #0E0C22 18px,
                #180F33 36px,
                #241042 48px,
                #180F33 60px,
                #0E0C22 78px,
                #060510 96px
              )
            `,
            position: 'relative'
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at 35% 25%, rgba(139, 77, 255, 0.2) 0%, rgba(216, 60, 157, 0.08) 50%, rgba(6, 5, 16, 0.85) 100%)',
              mixBlendMode: 'overlay'
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '45px',
              height: '100%',
              background: 'linear-gradient(to right, transparent, rgba(0, 0, 0, 0.98))'
            }}
          />
        </div>
      </div>

      {/* RIGHT VELVET CURTAIN PANEL */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '50.5%',
          height: '100%',
          transform: isOpen ? 'translateX(100%)' : 'translateX(0%)',
          transition: 'transform 0.95s cubic-bezier(0.75, 0, 0.15, 1)',
          boxShadow: 'inset 30px 0 50px rgba(0, 0, 0, 0.95), -10px 0 40px rgba(0, 0, 0, 0.8)',
          zIndex: 2,
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            background: `
              repeating-linear-gradient(
                90deg,
                #060510 0px,
                #0E0C22 18px,
                #180F33 36px,
                #241042 48px,
                #180F33 60px,
                #0E0C22 78px,
                #060510 96px
              )
            `,
            position: 'relative'
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at 65% 25%, rgba(139, 77, 255, 0.2) 0%, rgba(216, 60, 157, 0.08) 50%, rgba(6, 5, 16, 0.85) 100%)',
              mixBlendMode: 'overlay'
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '45px',
              height: '100%',
              background: 'linear-gradient(to left, transparent, rgba(0, 0, 0, 0.98))'
            }}
          />
        </div>
      </div>

      {/* TOP VALANCE TRIM */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '10px',
          background: 'linear-gradient(180deg, #04030B 0%, #110B22 70%, rgba(0, 0, 0, 0.8) 100%)',
          borderBottom: '1px solid rgba(139, 77, 255, 0.3)',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.8)',
          zIndex: 4
        }}
      />

      {/* CENTER LOGO & TAP TO ENTER */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: isOpen ? 'translate(-50%, -50%) scale(1.08)' : 'translate(-50%, -50%) scale(1)',
          zIndex: 5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 24,
          textAlign: 'center',
          pointerEvents: 'none',
          opacity: isOpen ? 0 : 1,
          transformOrigin: 'center center',
          transition: 'opacity 0.35s ease-out, transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)'
        }}
      >
        {/* Crisp Logo */}
        <div
          style={{
            padding: '16px 32px',
            borderRadius: 'var(--radius-pill)',
            background: 'linear-gradient(135deg, rgba(14, 12, 34, 0.9) 0%, rgba(36, 16, 66, 0.85) 100%)',
            border: '1px solid rgba(139, 77, 255, 0.4)',
            boxShadow: '0 16px 45px rgba(0, 0, 0, 0.8), 0 0 30px rgba(139, 77, 255, 0.25)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <img
            src="/assets/lumabooth-logo.png"
            alt="LumaBooth"
            style={{
              maxWidth: 'min(260px, 70vw)',
              height: 'auto',
              maxHeight: '48px',
              objectFit: 'contain',
              display: 'block',
              filter: 'drop-shadow(0 4px 12px rgba(139, 77, 255, 0.4))'
            }}
          />
        </div>

        {/* TAP TO ENTER */}
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(0.85rem, 3.8vw, 1.05rem)',
            fontWeight: 800,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: '#F7F5FF',
            textShadow: '0 2px 12px rgba(0, 0, 0, 0.9), 0 0 20px rgba(232, 62, 122, 0.5)',
            padding: '7px 24px',
            borderRadius: 'var(--radius-pill)',
            background: 'rgba(9, 8, 23, 0.75)',
            border: '1px solid rgba(185, 167, 255, 0.3)',
            backdropFilter: 'blur(6px)'
          }}
        >
          TAP TO ENTER
        </span>
      </div>
    </div>
  );
};
