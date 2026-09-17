// src/views/guest/experiences/AiSynthesisView.tsx
import React, { useState, useRef } from 'react';
import { useApp } from '../../../context/AppContext';
import { soundEngine } from '../../../utils/audio';
import { CameraCaptureView, CameraCaptureHandle } from '../../../components/camera/CameraCaptureView';
import { generateSynthesis } from '../../../services/aiApi';
import { 
  ArrowLeft, 
  Sparkles, 
  RotateCcw, 
  Download, 
  Wand2, 
  Camera,
  Cpu,
  AlertCircle
} from 'lucide-react';

const SYNTH_STYLES = [
  { id: 'dreamy', name: 'DREAMY', desc: 'Celestial ethereal dreamscape & stardust glow', accent: '#E5487D' },
  { id: 'editorial', name: 'EDITORIAL', desc: 'Vogue fashion studio & crisp rim lighting', accent: '#9E00FF' },
  { id: 'futuristic', name: 'FUTURISTIC', desc: 'Cybernetic matrix & holographic luminescence', accent: '#00F5D4' },
  { id: 'luxury', name: 'LUXURY', desc: 'Opulent 24k gold ballroom & champagne bokeh', accent: '#FFB703' },
  { id: 'neon', name: 'NEON', desc: 'Electric Tokyo nightlife & dual-tone neon contours', accent: '#FF007F' }
];

const SYNTH_MOODS = [
  { id: 'bold', name: 'BOLD', desc: 'High-impact dynamic range & vivid contrast', border: '#FF007F' },
  { id: 'confident', name: 'CONFIDENT', desc: 'Sharp studio keylight & crisp presence', border: '#E5487D' },
  { id: 'playful', name: 'PLAYFUL', desc: 'Radiant golden stardust & vibrant pop', border: '#FFB703' },
  { id: 'mysterious', name: 'MYSTERIOUS', desc: 'Deep velvet shadows & midnight amethyst', border: '#8B3FD1' },
  { id: 'soft', name: 'SOFT', desc: 'Gentle pearl mist & delicate pastel bloom', border: '#00F5D4' }
];

const PROCESSING_STAGES = [
  'ANALYZING PORTRAIT GEOMETRY',
  'ISOLATING NEURAL SUBJECT IDENTITY',
  'GENERATING AI SYNTHESIS ENVIRONMENT',
  'SYNTHESIZING VOLUMETRIC SCENE & PARTICLES',
  'FINALIZING AI SYNTHESIS'
];

export const AiSynthesisView: React.FC = () => {
  const { goToGuestStep, isPhone, isTablet, activeEvent, addMemory } = useApp();
  const cameraRef = useRef<CameraCaptureHandle | null>(null);

  const [phase, setPhase] = useState<'capture' | 'customize' | 'synthesizing' | 'result'>('capture');
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [generatedPhoto, setGeneratedPhoto] = useState<string | null>(null);
  const [selectedStyleId, setSelectedStyleId] = useState<string>('dreamy');
  const [selectedMoodId, setSelectedMoodId] = useState<string>('bold');
  const [stageIndex, setStageIndex] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const activeStyle = SYNTH_STYLES.find(s => s.id === selectedStyleId) || SYNTH_STYLES[0];
  const activeMood = SYNTH_MOODS.find(m => m.id === selectedMoodId) || SYNTH_MOODS[0];

  // Capture portrait
  const handleSnapPortrait = async () => {
    soundEngine.playShutter();
    const photo = await cameraRef.current?.snapPhoto();
    if (photo) {
      setCapturedPhoto(photo);
      setGeneratedPhoto(null);
      setPhase('customize');
      setErrorMessage(null);
      soundEngine.playPhotoSaved();
    }
  };

  // Start Real AI Image-to-Image Synthesis
  const handleStartSynthesis = async () => {
    if (!capturedPhoto) return;

    if (!activeEvent?.id) {
      setErrorMessage('No active event found. Please select an event first.');
      return;
    }

    soundEngine.playAiStart();
    setPhase('synthesizing');
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
      const result = await generateSynthesis(
        capturedPhoto,
        activeEvent.id,
        selectedStyleId,
        selectedMoodId
      );

      clearInterval(interval);

      if (result.success && result.data?.generatedImageUrl) {
        setGeneratedPhoto(result.data.generatedImageUrl);
        setPhase('result');
        soundEngine.playAiComplete();

        // Record generation in Memories
        addMemory({
          eventId: activeEvent.id,
          eventName: activeEvent.eventName || 'AI Synthesis Studio',
          imageUrl: result.data.generatedImageUrl,
          type: 'ai-synthesis',
          caption: `AI Synthesis • ${activeStyle.name} (${activeMood.name} Mood)`
        });
      } else {
        throw new Error(result.message || 'AI Synthesis generation failed');
      }
    } catch (err: any) {
      clearInterval(interval);
      console.error('[AI Synthesis] Generation error:', err);
      setErrorMessage(err.message || 'Unable to connect to LumaBooth AI server. Please try again.');
      setPhase('customize');
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
    link.download = `AI_Synthesis_${activeStyle.name}_${activeMood.name}_${Date.now()}.jpg`;
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
      {/* Floating Error Notification */}
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

      {/* Dynamic Ambient Background Glow */}
      <div
        style={{
          position: 'fixed',
          top: '25%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '580px',
          height: '580px',
          background: `radial-gradient(circle, ${activeMood.border}28 0%, rgba(139, 63, 209, 0.12) 45%, transparent 70%)`,
          borderRadius: '50%',
          filter: 'blur(65px)',
          pointerEvents: 'none',
          zIndex: 0,
          transition: 'all 0.4s ease'
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

        {/* Right: Synthesis Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '4px 10px',
            borderRadius: '9999px',
            backgroundColor: 'rgba(229, 72, 125, 0.15)',
            border: '1px solid rgba(229, 72, 125, 0.4)',
            color: '#E5487D',
            fontSize: '0.7rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: 800,
            minHeight: '36px'
          }}
        >
          <Sparkles size={12} />
          <span>SYNTHESIS</span>
        </div>
      </header>

      {/* ===================================================================
          2. MAIN CONTENT
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
          <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: activeMood.border, fontWeight: 800, letterSpacing: '0.14em' }}>
            AI SYNTHESIS STUDIO
          </span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: isPhone ? '1.45rem' : '1.8rem', fontWeight: 900, margin: '2px 0 0 0' }}>
            {phase === 'result' ? `SYNTHESIS: ${activeStyle.name}` : 'CREATE YOUR AI LOOK'}
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--luma-text-secondary)', margin: '2px 0 0 0' }}>
            {phase === 'result' ? `${activeStyle.name} Style • ${activeMood.name} Mood Transformation` : 'Select real AI generative style & mood parameters.'}
          </p>
        </div>

        {/* Viewport Frame */}
        <div
          style={{
            width: '100%',
            height: isPhone ? '42vh' : isTablet ? '48vh' : '380px',
            maxHeight: isPhone ? '360px' : '440px',
            position: 'relative',
            borderRadius: '22px',
            overflow: 'hidden',
            backgroundColor: '#0D0B1C',
            boxShadow: `0 20px 50px rgba(0, 0, 0, 0.85), 0 0 30px ${activeMood.border}40`,
            border: `1px solid ${activeMood.border}66`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'border 0.3s ease, box-shadow 0.3s ease'
          }}
        >
          {phase === 'capture' && (
            <CameraCaptureView ref={cameraRef} borderRadius="22px" />
          )}

          {(phase === 'customize' || phase === 'synthesizing') && capturedPhoto && (
            <div style={{ width: '100%', height: '100%', position: 'relative' }}>
              <img src={capturedPhoto} alt="Captured Portrait" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              {phase === 'synthesizing' && (
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
                      backgroundColor: `${activeMood.border}25`,
                      border: `2px solid ${activeMood.border}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: activeMood.border
                    }}
                  >
                    <Wand2 size={26} className="animate-spin" />
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.84rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '0.06em' }}>
                      {PROCESSING_STAGES[stageIndex]}
                    </span>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.72rem', color: 'var(--luma-lavender)' }}>
                      {activeStyle.name} Style • {activeMood.name} Mood
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
                alt="AI Synthesized Portrait"
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
                  border: `1px solid ${activeMood.border}66`,
                  backdropFilter: 'blur(8px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Cpu size={14} color={activeMood.border} />
                  <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', fontWeight: 800, color: activeMood.border }}>
                    {activeStyle.name} • {activeMood.name}
                  </span>
                </div>
                <span style={{ fontSize: '0.62rem', fontFamily: 'var(--font-mono)', color: 'var(--luma-lavender)' }}>
                  REAL AI SYNTHESIS
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Style & Mood Customization Options (During customize & result) */}
        {phase !== 'capture' && (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {/* STYLES ROW */}
            <div>
              <span style={{ fontSize: '0.66rem', fontFamily: 'var(--font-mono)', color: 'var(--luma-lavender)', fontWeight: 800 }}>
                1. STYLE AESTHETIC
              </span>
              <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px', marginTop: '3px', scrollbarWidth: 'none' }}>
                {SYNTH_STYLES.map((s) => {
                  const isSelected = selectedStyleId === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => {
                        soundEngine.playTap();
                        setSelectedStyleId(s.id);
                      }}
                      style={{
                        flex: '0 0 auto',
                        padding: '6px 12px',
                        borderRadius: '9999px',
                        backgroundColor: isSelected ? 'rgba(229, 72, 125, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                        border: isSelected ? '1px solid #E5487D' : '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#FFFFFF',
                        fontSize: '0.7rem',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 800,
                        cursor: 'pointer'
                      }}
                    >
                      {s.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* MOODS ROW */}
            <div>
              <span style={{ fontSize: '0.66rem', fontFamily: 'var(--font-mono)', color: 'var(--luma-lavender)', fontWeight: 800 }}>
                2. MOOD / LIGHTING
              </span>
              <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px', marginTop: '3px', scrollbarWidth: 'none' }}>
                {SYNTH_MOODS.map((m) => {
                  const isSelected = selectedMoodId === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => {
                        soundEngine.playTap();
                        setSelectedMoodId(m.id);
                      }}
                      style={{
                        flex: '0 0 auto',
                        padding: '6px 12px',
                        borderRadius: '9999px',
                        backgroundColor: isSelected ? `${m.border}35` : 'rgba(255, 255, 255, 0.05)',
                        border: isSelected ? `1.5px solid ${m.border}` : '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#FFFFFF',
                        fontSize: '0.7rem',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 800,
                        cursor: 'pointer'
                      }}
                    >
                      {m.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Bottom Actions */}
        <div style={{ width: '100%', display: 'flex', gap: '10px', marginTop: 'auto' }}>
          {phase === 'capture' && (
            <button
              onClick={handleSnapPortrait}
              style={{
                width: '100%',
                minHeight: isPhone ? '48px' : '52px',
                borderRadius: '9999px',
                background: 'linear-gradient(135deg, #E5487D 0%, #8B3FD1 100%)',
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
                boxShadow: '0 8px 25px rgba(229, 72, 125, 0.45)'
              }}
            >
              <Camera size={18} />
              <span>CAPTURE PORTRAIT</span>
            </button>
          )}

          {phase === 'customize' && (
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
                onClick={handleStartSynthesis}
                style={{
                  flex: 1,
                  minHeight: isPhone ? '48px' : '52px',
                  borderRadius: '9999px',
                  background: 'linear-gradient(135deg, #E5487D 0%, #8B3FD1 100%)',
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
                  boxShadow: '0 8px 25px rgba(229, 72, 125, 0.45)'
                }}
              >
                <span>CREATE SYNTHESIS →</span>
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
                <RotateCcw size={14} color="#E5487D" />
                <span>TRY AGAIN</span>
              </button>

              <button
                onClick={handleSavePhoto}
                style={{
                  flex: 1,
                  minHeight: isPhone ? '48px' : '52px',
                  borderRadius: '9999px',
                  background: 'linear-gradient(135deg, #E5487D 0%, #8B3FD1 100%)',
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
                  boxShadow: '0 8px 25px rgba(229, 72, 125, 0.45)'
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

export default AiSynthesisView;
