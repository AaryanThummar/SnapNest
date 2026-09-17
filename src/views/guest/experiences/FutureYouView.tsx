// src/views/guest/experiences/FutureYouView.tsx
import React, { useState, useRef } from 'react';
import { useApp } from '../../../context/AppContext';
import { soundEngine } from '../../../utils/audio';
import { CameraCaptureView, CameraCaptureHandle } from '../../../components/camera/CameraCaptureView';
import { generateFutureYou } from '../../../services/aiApi';
import { 
  ArrowLeft, 
  Sparkles, 
  RotateCcw, 
  Download, 
  Wand2, 
  Camera, 
  Clock,
  AlertCircle
} from 'lucide-react';

const PROCESSING_STAGES = [
  'ANALYZING FACIAL GEOMETRY & ANATOMY',
  'ISOLATING AUTHENTIC SUBJECT IDENTITY',
  'SYNTHESIZING 25-30 YEAR AGE PROGRESSION',
  'GENERATING REALISTIC DERMAL WRINKLES & MATURE SKIN',
  'FINALIZING REALISTIC AGED MASTERPIECE'
];

export const FutureYouView: React.FC = () => {
  const { goToGuestStep, isPhone, isTablet, activeEvent, addMemory } = useApp();
  const cameraRef = useRef<CameraCaptureHandle | null>(null);

  const [phase, setPhase] = useState<'capture' | 'preview' | 'processing' | 'result'>('capture');
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [generatedPhoto, setGeneratedPhoto] = useState<string | null>(null);
  const [stageIndex, setStageIndex] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Capture portrait
  const handleSnapPortrait = async () => {
    soundEngine.playShutter();
    const photo = await cameraRef.current?.snapPhoto();
    if (photo) {
      setCapturedPhoto(photo);
      setGeneratedPhoto(null);
      setPhase('preview');
      setErrorMessage(null);
      soundEngine.playPhotoSaved();
    }
  };

  // Start Real AI Age Progression Processing
  const handleStartProcessing = async () => {
    if (!capturedPhoto) return;

    if (!activeEvent?.id) {
      setErrorMessage('No active event found. Please select an event first.');
      return;
    }

    soundEngine.playAiStart();
    setPhase('processing');
    setStageIndex(0);
    setErrorMessage(null);

    const interval = setInterval(() => {
      setStageIndex((prev) => {
        if (prev < PROCESSING_STAGES.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 1200);

    try {
      const result = await generateFutureYou(
        capturedPhoto,
        activeEvent.id
      );

      clearInterval(interval);

      if (result.success && result.data?.generatedImageUrl) {
        setGeneratedPhoto(result.data.generatedImageUrl);
        setPhase('result');
        soundEngine.playAiComplete();

        // Record generation in Memories
        addMemory({
          eventId: activeEvent.id,
          eventName: activeEvent.eventName || 'Future You Age Progression',
          imageUrl: result.data.generatedImageUrl,
          type: 'future-you',
          caption: 'Future You • Real AI Age Progression (+30 Years)'
        });
      } else {
        throw new Error(result.message || 'Future You generation failed');
      }
    } catch (err: any) {
      clearInterval(interval);
      console.error('[Future You] Generation error:', err);
      setErrorMessage(err.message || 'Unable to connect to LumaBooth AI server. Please try again.');
      setPhase('preview');
    }
  };

  // Try again
  const handleTryAgain = () => {
    soundEngine.playTap();
    setCapturedPhoto(null);
    setGeneratedPhoto(null);
    setErrorMessage(null);
    setPhase('capture');
  };

  // Save photo
  const handleSavePhoto = () => {
    const targetPhoto = generatedPhoto || capturedPhoto;
    if (!targetPhoto) return;
    soundEngine.playTap();
    const link = document.createElement('a');
    link.download = `Future_You_Age_Progression_${Date.now()}.jpg`;
    link.href = targetPhoto;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    soundEngine.playPhotoSaved();
  };

  return (
    <div
      style={{
        flex: 1,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#070612',
        color: '#FFFFFF',
        position: 'relative',
        overflowX: 'hidden',
        overflowY: 'auto',
        boxSizing: 'border-box',
        userSelect: 'none',
        paddingTop: isPhone ? 'max(8px, env(safe-area-inset-top))' : '14px',
        paddingBottom: isPhone ? 'max(12px, env(safe-area-inset-bottom))' : '20px',
        paddingLeft: isPhone ? '12px' : isTablet ? '20px' : '28px',
        paddingRight: isPhone ? '12px' : isTablet ? '20px' : '28px'
      }}
    >
      {/* Floating Error Toast Notification */}
      {errorMessage && (
        <div
          style={{
            position: 'fixed',
            top: '16px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(229, 72, 125, 0.95)',
            border: '1px solid #FFFFFF',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.8), 0 0 20px rgba(229, 72, 125, 0.5)',
            backdropFilter: 'blur(12px)',
            borderRadius: '9999px',
            padding: '8px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#FFFFFF',
            fontSize: '0.8rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: 800,
            zIndex: 9999,
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          <AlertCircle size={15} color="#FFFFFF" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Background Subtle Radial Indigo & Violet Ambient Lighting */}
      <div
        style={{
          position: 'fixed',
          top: '25%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '580px',
          height: '580px',
          background: 'radial-gradient(circle, rgba(139, 63, 209, 0.16) 0%, rgba(245, 158, 11, 0.08) 45%, transparent 70%)',
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
          maxWidth: '640px',
          margin: '0 auto 8px auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 20,
          position: 'relative',
          height: '42px',
          flexShrink: 0
        }}
      >
        {/* Left: ← MODES */}
        <button
          onClick={() => {
            soundEngine.playTap();
            goToGuestStep('experiences');
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '9999px',
            padding: '5px 12px',
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
        >
          <ArrowLeft size={13} />
          <span>MODES</span>
        </button>

        {/* Center: LumaBooth PNG Logo Asset */}
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

        {/* Right: Age Progression Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '4px 10px',
            borderRadius: '9999px',
            backgroundColor: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid rgba(245, 158, 11, 0.4)',
            color: '#F59E0B',
            fontSize: '0.7rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: 800,
            minHeight: '36px'
          }}
        >
          <Clock size={12} />
          <span>+30 YEARS</span>
        </div>
      </header>

      {/* ===================================================================
          2. MAIN CONTENT AREA
          =================================================================== */}
      <main
        style={{
          flex: 1,
          width: '100%',
          maxWidth: '640px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px',
          zIndex: 10,
          position: 'relative'
        }}
      >
        {/* Title */}
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: '#F59E0B', fontWeight: 800, letterSpacing: '0.14em' }}>
            REAL AI AGE PROGRESSION
          </span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: isPhone ? '1.5rem' : '1.85rem', fontWeight: 900, margin: '2px 0 0 0' }}>
            {phase === 'result' ? 'YOUR FUTURE SELF (+30 YEARS)' : 'SEE YOURSELF IN 30 YEARS'}
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--luma-text-secondary)', margin: '2px 0 0 0' }}>
            {phase === 'result' ? 'Realistically age-progressed with 100% preserved facial identity.' : 'Capture a portrait to generate realistic 25–30 year age progression.'}
          </p>
        </div>

        {/* Viewport */}
        <div
          style={{
            width: '100%',
            height: isPhone ? '46vh' : isTablet ? '52vh' : '400px',
            maxHeight: isPhone ? '390px' : '480px',
            position: 'relative',
            borderRadius: '22px',
            overflow: 'hidden',
            backgroundColor: '#0D0B1C',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.85), 0 0 30px rgba(245, 158, 11, 0.25)',
            border: '1px solid rgba(245, 158, 11, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          {phase === 'capture' && (
            <CameraCaptureView ref={cameraRef} borderRadius="22px" />
          )}

          {(phase === 'preview' || phase === 'processing') && capturedPhoto && (
            <div style={{ width: '100%', height: '100%', position: 'relative' }}>
              <img src={capturedPhoto} alt="Captured Portrait" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              {phase === 'processing' && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: 'rgba(7, 6, 18, 0.85)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px'
                  }}
                >
                  <div
                    style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(245, 158, 11, 0.2)',
                      border: '2px solid #F59E0B',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#F59E0B'
                    }}
                  >
                    <Wand2 size={26} className="animate-spin" />
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.86rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '0.06em' }}>
                      {PROCESSING_STAGES[stageIndex]}
                    </span>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.72rem', color: 'var(--luma-lavender)' }}>
                      Preserving identity • Realistic 25–30 year aging
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {phase === 'result' && (generatedPhoto || capturedPhoto) && (
            <div style={{ width: '100%', height: '100%', position: 'relative' }}>
              <img
                src={generatedPhoto || capturedPhoto!}
                alt="Future Self Aged Portrait"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '14px',
                  left: '14px',
                  right: '14px',
                  padding: '8px 12px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(8, 6, 20, 0.85)',
                  border: '1px solid rgba(245, 158, 11, 0.5)',
                  backdropFilter: 'blur(8px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={14} color="#F59E0B" />
                  <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#F59E0B' }}>
                    REAL AI AGE PROGRESSION • +30 YEARS
                  </span>
                </div>
                <span style={{ fontSize: '0.62rem', fontFamily: 'var(--font-mono)', color: 'var(--luma-lavender)' }}>
                  IDENTITY PRESERVED
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div style={{ width: '100%', display: 'flex', gap: '10px', marginTop: 'auto' }}>
          {phase === 'capture' && (
            <button
              onClick={handleSnapPortrait}
              style={{
                width: '100%',
                minHeight: isPhone ? '48px' : '52px',
                borderRadius: '9999px',
                background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                border: '1px solid rgba(255, 255, 255, 0.35)',
                color: '#070612',
                fontFamily: 'var(--font-display)',
                fontWeight: 900,
                fontSize: '1rem',
                letterSpacing: '0.04em',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 8px 25px rgba(245, 158, 11, 0.45)'
              }}
            >
              <Camera size={18} />
              <span>CAPTURE PORTRAIT</span>
            </button>
          )}

          {phase === 'preview' && (
            <>
              <button
                onClick={handleTryAgain}
                style={{
                  flex: '0 0 auto',
                  minHeight: isPhone ? '48px' : '52px',
                  padding: '0 20px',
                  borderRadius: '9999px',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  color: '#FFFFFF',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                RETAKE
              </button>

              <button
                onClick={handleStartProcessing}
                style={{
                  flex: 1,
                  minHeight: isPhone ? '48px' : '52px',
                  borderRadius: '9999px',
                  background: 'linear-gradient(135deg, #F59E0B 0%, #E5487D 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.35)',
                  color: '#FFFFFF',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 900,
                  fontSize: '1rem',
                  letterSpacing: '0.04em',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 8px 25px rgba(245, 158, 11, 0.45)'
                }}
              >
                <span>GENERATE AGE PROGRESSION →</span>
                <Sparkles size={16} />
              </button>
            </>
          )}

          {phase === 'result' && (
            <>
              <button
                onClick={handleTryAgain}
                style={{
                  flex: 1,
                  minHeight: isPhone ? '48px' : '52px',
                  borderRadius: '9999px',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#FFFFFF',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <RotateCcw size={14} color="#F59E0B" />
                <span>TRY AGAIN</span>
              </button>

              <button
                onClick={handleSavePhoto}
                style={{
                  flex: 1,
                  minHeight: isPhone ? '48px' : '52px',
                  borderRadius: '9999px',
                  background: 'linear-gradient(135deg, #F59E0B 0%, #E5487D 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.35)',
                  color: '#FFFFFF',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 900,
                  fontSize: '0.94rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: '0 8px 25px rgba(245, 158, 11, 0.45)'
                }}
              >
                <Download size={16} />
                <span>SAVE</span>
              </button>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default FutureYouView;
