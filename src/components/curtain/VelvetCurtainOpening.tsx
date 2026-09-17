// src/components/curtain/VelvetCurtainOpening.tsx
import React, { useState, useCallback } from 'react';
import { soundEngine } from '../../utils/audio';

interface VelvetCurtainOpeningProps {
  onOpened?: () => void;
}

export const VelvetCurtainOpening: React.FC<VelvetCurtainOpeningProps> = ({ onOpened }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullyDismissed, setIsFullyDismissed] = useState(false);

  const handleOpenCurtains = useCallback(() => {
    if (isOpen) return;
    setIsOpen(true);
    soundEngine.playCurtainOpen();

    // After animation completes, dismiss overlay
    setTimeout(() => {
      setIsFullyDismissed(true);
      if (onOpened) onOpened();
    }, 1300);
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
        zIndex: 9000,
        overflow: 'hidden',
        cursor: 'pointer',
        userSelect: 'none',
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'manipulation',
        pointerEvents: isOpen ? 'none' : 'auto'
      }}
    >
      {/* LEFT CURTAIN PANEL */}
      <div
        className="curtain-panel curtain-left"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '50.5%',
          height: '100%',
          transform: isOpen ? 'translateX(-100%)' : 'translateX(0%)',
          transition: 'transform 1.25s cubic-bezier(0.75, 0, 0.15, 1)',
          boxShadow: 'inset -25px 0 45px rgba(0, 0, 0, 0.85), 10px 0 35px rgba(0, 0, 0, 0.6)',
          zIndex: 2,
          overflow: 'hidden'
        }}
      >
        {/* Rich Velvet Texture & Vertical Folds */}
        <div
          style={{
            width: '100%',
            height: '100%',
            background: `
              repeating-linear-gradient(
                90deg,
                #1B061A 0px,
                #3A0B33 18px,
                #5B1250 36px,
                #731665 48px,
                #5B1250 60px,
                #3A0B33 78px,
                #1B061A 96px
              )
            `,
            position: 'relative'
          }}
        >
          {/* Subtle Fabric Grain & Lighting Vignette */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at 30% 25%, rgba(224, 38, 120, 0.22) 0%, rgba(15, 3, 14, 0.75) 100%)',
              mixBlendMode: 'overlay'
            }}
          />
          {/* Center Seam Shadow */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '40px',
              height: '100%',
              background: 'linear-gradient(to right, transparent, rgba(0, 0, 0, 0.95))'
            }}
          />
          {/* Bottom Hem Shadow */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '80px',
              background: 'linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent)'
            }}
          />
        </div>
      </div>

      {/* RIGHT CURTAIN PANEL */}
      <div
        className="curtain-panel curtain-right"
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '50.5%',
          height: '100%',
          transform: isOpen ? 'translateX(100%)' : 'translateX(0%)',
          transition: 'transform 1.25s cubic-bezier(0.75, 0, 0.15, 1)',
          boxShadow: 'inset 25px 0 45px rgba(0, 0, 0, 0.85), -10px 0 35px rgba(0, 0, 0, 0.6)',
          zIndex: 2,
          overflow: 'hidden'
        }}
      >
        {/* Rich Velvet Texture & Vertical Folds */}
        <div
          style={{
            width: '100%',
            height: '100%',
            background: `
              repeating-linear-gradient(
                90deg,
                #1B061A 0px,
                #3A0B33 18px,
                #5B1250 36px,
                #731665 48px,
                #5B1250 60px,
                #3A0B33 78px,
                #1B061A 96px
              )
            `,
            position: 'relative'
          }}
        >
          {/* Subtle Fabric Grain & Lighting Vignette */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at 70% 25%, rgba(224, 38, 120, 0.22) 0%, rgba(15, 3, 14, 0.75) 100%)',
              mixBlendMode: 'overlay'
            }}
          />
          {/* Center Seam Shadow */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '40px',
              height: '100%',
              background: 'linear-gradient(to left, transparent, rgba(0, 0, 0, 0.95))'
            }}
          />
          {/* Bottom Hem Shadow */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '80px',
              background: 'linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent)'
            }}
          />
        </div>
      </div>

      {/* TOP BRASS / PELMET VALANCE TRIM */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '14px',
          background: 'linear-gradient(180deg, #120311 0%, #2A0826 60%, rgba(0, 0, 0, 0.8) 100%)',
          borderBottom: '1px solid rgba(255, 215, 0, 0.25)',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.8)',
          zIndex: 4
        }}
      />

      {/* CENTER LOGO & "TAP TO ENTER" HERO */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          zIndex: 5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 20,
          textAlign: 'center',
          pointerEvents: 'none',
          opacity: isOpen ? 0 : 1,
          transformOrigin: 'center center',
          transition: 'opacity 0.4s ease-out, transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)',
          transform: isOpen ? 'translate(-50%, -50%) scale(1.08)' : 'translate(-50%, -50%) scale(1)'
        }}
      >
        {/* Crisp Official LumaBooth PNG Logo directly on velvet without white cards */}
        <img
          src="/assets/lumabooth-logo.png"
          alt="LumaBooth"
          style={{
            maxWidth: 'min(280px, 72vw)',
            height: 'auto',
            objectFit: 'contain',
            filter: 'drop-shadow(0 12px 28px rgba(0, 0, 0, 0.75)) drop-shadow(0 2px 6px rgba(0, 0, 0, 0.5))',
            display: 'block'
          }}
        />

        {/* Elegant "Tap to enter" prompt */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(0.85rem, 3.8vw, 1.05rem)',
              fontWeight: 700,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#F4E8D6',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)',
              padding: '6px 18px',
              borderRadius: 'var(--radius-pill)',
              background: 'rgba(0, 0, 0, 0.35)',
              border: '1px solid rgba(244, 232, 214, 0.18)',
              backdropFilter: 'blur(4px)'
            }}
            className="animate-pulse-subtle"
          >
            Tap to enter
          </span>
        </div>
      </div>
    </div>
  );
};
