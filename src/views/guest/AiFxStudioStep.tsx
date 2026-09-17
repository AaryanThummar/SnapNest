// src/views/guest/AiFxStudioStep.tsx
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { soundEngine } from '../../utils/audio';
import { 
  ArrowLeft, 
  ArrowRight, 
  Camera, 
  Sparkles, 
  Check, 
  Wand2
} from 'lucide-react';

export interface AIEffect {
  id: string;
  name: string;
  tagline: string;
  css: string;
  gradient: string;
}

export const AI_EFFECTS: AIEffect[] = [
  {
    id: 'original',
    name: 'ORIGINAL',
    tagline: 'Keep the photo unchanged.',
    css: 'none',
    gradient: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 100%)'
  },
  {
    id: 'editorial',
    name: 'EDITORIAL',
    tagline: 'Luxury fashion magazine aesthetic.',
    css: 'contrast(135%) brightness(105%) saturate(85%)',
    gradient: 'linear-gradient(135deg, rgba(203, 213, 225, 0.4) 0%, rgba(30, 41, 59, 0.6) 100%)'
  },
  {
    id: 'retro_film',
    name: 'RETRO FILM',
    tagline: '35mm film aesthetic.',
    css: 'sepia(45%) contrast(120%) saturate(125%) hue-rotate(-10deg)',
    gradient: 'linear-gradient(135deg, rgba(217, 119, 6, 0.45) 0%, rgba(120, 53, 15, 0.6) 100%)'
  },
  {
    id: 'dreamy',
    name: 'DREAMY',
    tagline: 'Soft cinematic glow.',
    css: 'brightness(114%) contrast(92%) saturate(122%)',
    gradient: 'linear-gradient(135deg, rgba(229, 72, 125, 0.4) 0%, rgba(139, 77, 255, 0.4) 100%)'
  },
  {
    id: 'neon',
    name: 'NEON',
    tagline: 'Purple/pink futuristic lighting.',
    css: 'contrast(135%) hue-rotate(280deg) saturate(180%) brightness(108%)',
    gradient: 'linear-gradient(135deg, rgba(6, 182, 212, 0.45) 0%, rgba(236, 72, 153, 0.5) 100%)'
  },
  {
    id: 'vintage',
    name: 'VINTAGE',
    tagline: 'Warm nostalgic photography.',
    css: 'sepia(55%) saturate(135%) contrast(110%) brightness(102%)',
    gradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.4) 0%, rgba(180, 83, 9, 0.55) 100%)'
  },
  {
    id: 'anime',
    name: 'ANIME',
    tagline: 'Stylized illustrated appearance.',
    css: 'contrast(150%) saturate(175%) brightness(110%)',
    gradient: 'linear-gradient(135deg, rgba(168, 85, 247, 0.45) 0%, rgba(236, 72, 153, 0.45) 100%)'
  },
  {
    id: 'studio',
    name: 'STUDIO',
    tagline: 'Professional studio portrait aesthetic.',
    css: 'contrast(118%) brightness(106%) saturate(110%)',
    gradient: 'linear-gradient(135deg, rgba(99, 102, 241, 0.4) 0%, rgba(139, 77, 255, 0.45) 100%)'
  }
];

export const AiFxStudioStep: React.FC = () => {
  const { 
    capturedPhotos, 
    goToGuestStep, 
    isPhone, 
    isTablet 
  } = useApp();

  // Active state
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);
  const [selectedEffectId, setSelectedEffectId] = useState<string>('dreamy');
  const [isApplying, setIsApplying] = useState<boolean>(false);

  const currentPhoto = capturedPhotos[selectedPhotoIndex] || capturedPhotos[0];
  const activeEffect = AI_EFFECTS.find(e => e.id === selectedEffectId) || AI_EFFECTS[0];

  // Handle effect selection with brief realistic processing animation
  const handleSelectEffect = (effectId: string) => {
    if (effectId === selectedEffectId) return;
    soundEngine.playTap();
    setIsApplying(true);
    setSelectedEffectId(effectId);

    setTimeout(() => {
      setIsApplying(false);
      soundEngine.playSuccessChime();
    }, 450);
  };

  // Navigation handlers
  const handleBackToPhotostrip = () => {
    soundEngine.playTap();
    goToGuestStep('photostrip');
  };

  const handleNextToShare = () => {
    soundEngine.playSuccessChime();
    goToGuestStep('ai_bg');
  };

  // Fallback empty state
  if (!capturedPhotos || capturedPhotos.length === 0) {
    return (
      <div
        style={{
          flex: 1,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#080714',
          color: '#FFFFFF',
          padding: '24px',
          textAlign: 'center',
          boxSizing: 'border-box'
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'rgba(229, 72, 125, 0.15)',
            border: '1px solid rgba(229, 72, 125, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#E5487D',
            marginBottom: '16px'
          }}
        >
          <Camera size={28} />
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 800, margin: '0 0 6px 0' }}>
          No Photos Found
        </h2>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--luma-text-secondary)', margin: '0 0 20px 0' }}>
          Please capture your moments first.
        </p>
        <button
          onClick={() => goToGuestStep('capture')}
          style={{
            background: 'linear-gradient(135deg, #E5487D 0%, #8B3FD1 100%)',
            color: '#FFFFFF',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            padding: '12px 28px',
            borderRadius: '9999px',
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            cursor: 'pointer'
          }}
        >
          OPEN CAMERA →
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        flex: 1,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#080714',
        color: '#FFFFFF',
        position: 'relative',
        overflowX: 'hidden',
        overflowY: 'auto',
        boxSizing: 'border-box',
        userSelect: 'none',
        paddingTop: isPhone ? 'max(8px, env(safe-area-inset-top))' : '12px',
        paddingBottom: isPhone ? 'max(10px, env(safe-area-inset-bottom))' : '16px',
        paddingLeft: isPhone ? '12px' : isTablet ? '18px' : '24px',
        paddingRight: isPhone ? '12px' : isTablet ? '18px' : '24px'
      }}
    >
      {/* Background Subtle Radial Purple & Violet Ambient Lighting */}
      <div
        style={{
          position: 'fixed',
          top: '25%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '580px',
          height: '580px',
          background: 'radial-gradient(circle, rgba(139, 77, 255, 0.15) 0%, rgba(229, 72, 125, 0.08) 45%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(65px)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      {/* ===================================================================
          1. TOP NAVIGATION BAR
          =================================================================== */}
      <header
        style={{
          width: '100%',
          maxWidth: '680px',
          margin: '0 auto 6px auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 20,
          position: 'relative',
          height: '42px',
          flexShrink: 0
        }}
      >
        {/* Left: ← BACK */}
        <button
          onClick={handleBackToPhotostrip}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '9999px',
            padding: isPhone ? '5px 12px' : '6px 14px',
            color: 'var(--luma-text-secondary)',
            fontSize: '0.74rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.15s ease',
            touchAction: 'manipulation',
            outline: 'none',
            minHeight: '36px'
          }}
          aria-label="Back to Photo Strip"
        >
          <ArrowLeft size={13} />
          <span>BACK</span>
        </button>

        {/* Center: Real LumaBooth PNG Logo Asset */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4px 14px',
            borderRadius: '9999px',
            backgroundColor: 'rgba(8, 6, 20, 0.85)',
            border: '1px solid rgba(185, 167, 255, 0.2)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.5)'
          }}
        >
          <img
            src="/assets/lumabooth-logo.png"
            alt="LumaBooth"
            style={{
              height: isPhone ? '18px' : '22px',
              width: 'auto',
              maxWidth: '115px',
              objectFit: 'contain',
              display: 'block'
            }}
          />
        </div>

        {/* Right: AI FX Status Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: isPhone ? '4px 12px' : '5px 14px',
            borderRadius: '9999px',
            backgroundColor: 'rgba(229, 72, 125, 0.12)',
            border: '1px solid rgba(229, 72, 125, 0.35)',
            color: '#E5487D',
            fontSize: '0.72rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: 800,
            minHeight: '36px'
          }}
        >
          <Sparkles size={12} />
          <span>AI FX</span>
        </div>
      </header>

      {/* ===================================================================
          2. MAIN HEADER: "AI FX STUDIO"
          =================================================================== */}
      <div
        style={{
          width: '100%',
          maxWidth: '680px',
          margin: '0 auto 8px auto',
          textAlign: 'center',
          zIndex: 10,
          position: 'relative',
          flexShrink: 0
        }}
      >
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: isPhone ? '1.55rem' : '1.9rem',
            fontWeight: 900,
            color: '#FFFFFF',
            letterSpacing: '0.01em',
            margin: '0 0 2px 0'
          }}
        >
          AI FX STUDIO
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: isPhone ? '0.8rem' : '0.88rem',
            color: 'var(--luma-text-secondary)',
            margin: 0
          }}
        >
          Transform your moment.
        </p>
      </div>

      {/* ===================================================================
          3. MAIN HERO PHOTO PREVIEW
          =================================================================== */}
      <main
        style={{
          flex: 1,
          width: '100%',
          maxWidth: '680px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px',
          zIndex: 10,
          position: 'relative',
          minHeight: 0
        }}
      >
        {/* Photo Display Viewport */}
        <div
          style={{
            width: '100%',
            height: isPhone ? '46vh' : isTablet ? '50vh' : '400px',
            maxHeight: isPhone ? '380px' : '480px',
            position: 'relative',
            borderRadius: isPhone ? '20px' : '26px',
            backgroundColor: '#0D0B1C',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.85), 0 0 30px rgba(139, 77, 255, 0.18)',
            border: '1px solid rgba(185, 167, 255, 0.22)',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          {/* Real Captured Photo with Active FX Filter */}
          <img
            src={currentPhoto.url}
            alt={`Photo ${selectedPhotoIndex + 1}`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              display: 'block',
              filter: activeEffect.css,
              transition: 'filter 0.3s ease'
            }}
          />

          {/* Optical Framing Corners (⌜ ⌝ ⌞ ⌟) */}
          <div style={{ position: 'absolute', top: 12, left: 12, width: 16, height: 16, borderTop: '2.5px solid rgba(255, 255, 255, 0.7)', borderLeft: '2.5px solid rgba(255, 255, 255, 0.7)', borderRadius: '3px 0 0 0', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: 12, right: 12, width: 16, height: 16, borderTop: '2.5px solid rgba(255, 255, 255, 0.7)', borderRight: '2.5px solid rgba(255, 255, 255, 0.7)', borderRadius: '0 3px 0 0', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: 12, left: 12, width: 16, height: 16, borderBottom: '2.5px solid rgba(255, 255, 255, 0.7)', borderLeft: '2.5px solid rgba(255, 255, 255, 0.7)', borderRadius: '0 0 0 3px', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: 12, right: 12, width: 16, height: 16, borderBottom: '2.5px solid rgba(255, 255, 255, 0.7)', borderRight: '2.5px solid rgba(255, 255, 255, 0.7)', borderRadius: '0 0 3px 0', pointerEvents: 'none' }} />

          {/* Top Left Badge: [AI FX STUDIO ✦] */}
          <div
            style={{
              position: 'absolute',
              top: 14,
              left: 14,
              padding: '3px 10px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(8, 6, 20, 0.85)',
              border: '1px solid rgba(229, 72, 125, 0.45)',
              backdropFilter: 'blur(8px)',
              color: '#FFFFFF',
              fontSize: '0.7rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Sparkles size={11} color="#E5487D" />
            <span>AI FX STUDIO</span>
          </div>

          {/* Top Right: Active Effect Name Badge */}
          <div
            style={{
              position: 'absolute',
              top: 14,
              right: 14,
              padding: '3px 10px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(9, 8, 23, 0.85)',
              border: '1px solid rgba(185, 167, 255, 0.3)',
              backdropFilter: 'blur(8px)',
              color: '#FFFFFF',
              fontSize: '0.68rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 800
            }}
          >
            {activeEffect.name}
          </div>

          {/* Bottom Left: Real Photo Indicator */}
          <div
            style={{
              position: 'absolute',
              bottom: 14,
              left: 14,
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '2px 8px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(9, 8, 23, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: 'rgba(255, 255, 255, 0.85)',
              fontSize: '0.62rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700
            }}
          >
            <span style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: '#06D6A0' }} />
            <span>PHOTO 0{selectedPhotoIndex + 1}</span>
          </div>

          {/* Applying FX Loading Animation Overlay */}
          {isApplying && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(8, 6, 20, 0.75)',
                backdropFilter: 'blur(6px)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                zIndex: 30
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(229, 72, 125, 0.2)',
                  border: '1.5px solid #E5487D',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#E5487D'
                }}
              >
                <Wand2 size={20} className="animate-spin" />
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '0.06em' }}>
                APPLYING FX...
              </span>
            </div>
          )}
        </div>

        {/* Real Photo Switcher (3 Thumbnails) */}
        <div style={{ display: 'flex', gap: '8px', width: '100%', maxWidth: '320px' }}>
          {capturedPhotos.slice(0, 3).map((photo, idx) => {
            const isSelected = selectedPhotoIndex === idx;
            return (
              <button
                key={photo.id || idx}
                onClick={() => {
                  soundEngine.playTap();
                  setSelectedPhotoIndex(idx);
                }}
                style={{
                  flex: 1,
                  height: '46px',
                  borderRadius: '10px',
                  backgroundColor: '#120F24',
                  border: isSelected ? '2px solid #E5487D' : '1px solid rgba(255, 255, 255, 0.15)',
                  boxShadow: isSelected ? '0 0 12px rgba(229, 72, 125, 0.5)' : 'none',
                  opacity: isSelected ? 1 : 0.6,
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  padding: 0,
                  transition: 'all 0.15s ease'
                }}
                title={`Select Photo 0${idx + 1}`}
              >
                <img src={photo.url} alt={`Thumb 0${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', bottom: 1, left: 2, background: 'rgba(8,6,20,0.85)', padding: '1px 4px', borderRadius: '4px', fontSize: '0.55rem', fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#FFF' }}>
                  #{idx + 1}
                </div>
              </button>
            );
          })}
        </div>

        {/* ===================================================================
            4. HORIZONTAL SCROLLING EFFECT SELECTOR (8 FX CARDS)
            =================================================================== */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            marginTop: '2px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2px' }}>
            <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--luma-lavender)', fontWeight: 800 }}>
              AI VISUAL EFFECTS ({AI_EFFECTS.length})
            </span>
            <span style={{ fontSize: '0.62rem', color: 'var(--luma-text-muted)' }}>
              Swipe to explore
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              gap: '10px',
              overflowX: 'auto',
              paddingBottom: '4px',
              scrollbarWidth: 'none'
            }}
          >
            {AI_EFFECTS.map((fx) => {
              const isSelected = selectedEffectId === fx.id;
              return (
                <button
                  key={fx.id}
                  onClick={() => handleSelectEffect(fx.id)}
                  style={{
                    flex: '0 0 135px',
                    backgroundColor: isSelected ? 'rgba(229, 72, 125, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                    border: isSelected ? '1.5px solid #E5487D' : '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '14px',
                    padding: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    boxShadow: isSelected ? '0 0 16px rgba(229, 72, 125, 0.45)' : 'none',
                    transition: 'all 0.18s ease',
                    touchAction: 'manipulation',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* Live Mini Preview Thumbnail with Effect */}
                  <div
                    style={{
                      width: '100%',
                      height: '62px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      backgroundColor: '#000',
                      position: 'relative'
                    }}
                  >
                    <img
                      src={currentPhoto.url}
                      alt={fx.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        filter: fx.css
                      }}
                    />

                    {isSelected && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          width: 16,
                          height: 16,
                          borderRadius: '50%',
                          backgroundColor: '#E5487D',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#FFFFFF'
                        }}
                      >
                        <Check size={10} strokeWidth={3} />
                      </div>
                    )}
                  </div>

                  {/* Name & Description */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                    <span style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#FFFFFF' }}>
                      {fx.name}
                    </span>
                    <span style={{ fontSize: '0.58rem', color: isSelected ? '#FFFFFF' : 'var(--luma-text-secondary)', lineHeight: 1.2 }}>
                      {fx.tagline}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </main>

      {/* ===================================================================
          5. STICKY THUMB-FRIENDLY BOTTOM ACTION BAR
          =================================================================== */}
      <footer
        style={{
          width: '100%',
          maxWidth: '680px',
          margin: '10px auto 0 auto',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          zIndex: 30,
          position: 'relative',
          flexShrink: 0
        }}
      >
        {/* Secondary: BACK Button */}
        <button
          onClick={handleBackToPhotostrip}
          style={{
            flex: '0 0 auto',
            minHeight: isPhone ? '48px' : '52px',
            padding: isPhone ? '0 18px' : '0 24px',
            borderRadius: '9999px',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            color: '#FFFFFF',
            fontFamily: 'var(--font-mono)',
            fontWeight: 800,
            fontSize: '0.8rem',
            letterSpacing: '0.04em',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.15s ease',
            touchAction: 'manipulation'
          }}
        >
          <span>BACK</span>
        </button>

        {/* Primary CTA: NEXT: BACKGROUNDS → */}
        <button
          onClick={handleNextToShare}
          style={{
            flex: 1,
            minHeight: isPhone ? '48px' : '52px',
            padding: '0 20px',
            borderRadius: '9999px',
            background: 'linear-gradient(135deg, #E5487D 0%, #B82E88 45%, #8B3FD1 100%)',
            border: '1px solid rgba(255, 255, 255, 0.35)',
            color: '#FFFFFF',
            fontFamily: 'var(--font-display)',
            fontWeight: 900,
            fontSize: isPhone ? '0.94rem' : '1.05rem',
            letterSpacing: '0.04em',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 8px 25px rgba(229, 72, 125, 0.45)',
            transition: 'all 0.18s ease',
            touchAction: 'manipulation'
          }}
        >
          <span>NEXT: BACKGROUNDS</span>
          <ArrowRight size={16} strokeWidth={2.5} />
        </button>
      </footer>
    </div>
  );
};

export default AiFxStudioStep;
