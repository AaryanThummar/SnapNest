// src/views/guest/AiMagicStudioView.tsx
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { soundEngine } from '../../utils/audio';
import { 
  aiService, 
  AIStyleId, 
  AILighting, 
  AIMood, 
  AIBackground, 
  AI_STYLE_DEFINITIONS, 
  AIGenerationResult
} from '../../services/aiService';
import { 
  ArrowLeft, 
  Sparkles, 
  Check, 
  Wand2, 
  Cpu, 
  X, 
  Camera, 
  ShieldCheck
} from 'lucide-react';

export const AiMagicStudioView: React.FC = () => {
  const { 
    capturedPhotos, 
    goToGuestStep, 
    isPhone,
    isTablet
  } = useApp();

  // Active AI Studio state
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);
  const [selectedStyle, setSelectedStyle] = useState<AIStyleId>('dreamy');
  const [aiIntensity, setAiIntensity] = useState<number>(60);
  const [lighting, setLighting] = useState<AILighting>('studio');
  const [mood, setMood] = useState<AIMood>('elegant');
  const [background, setBackground] = useState<AIBackground>('original');

  // Generation & Status state
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationResult, setGenerationResult] = useState<AIGenerationResult | null>(null);

  // AI Provider Modal state
  const [showProviderModal, setShowProviderModal] = useState<boolean>(false);
  const [providerChoice, setProviderChoice] = useState<'google_imagen' | 'stable_diffusion' | 'midjourney_api' | 'custom'>('google_imagen');
  const [endpointUrl, setEndpointUrl] = useState<string>('https://api.imagen.google.internal/v1/generate');
  const [apiKeyInput, setApiKeyInput] = useState<string>('');
  const [isProviderConnected, setIsProviderConnected] = useState<boolean>(aiService.isProviderConnected());

  const currentPhoto = capturedPhotos[selectedPhotoIndex] || capturedPhotos[0];
  const activeStyleDef = AI_STYLE_DEFINITIONS.find(s => s.id === selectedStyle) || AI_STYLE_DEFINITIONS[0];

  // Return to Photo Review Studio
  const handleReturnToEditor = () => {
    soundEngine.playTap();
    goToGuestStep('edit');
  };

  // Generate AI Look
  const handleGenerateAiLook = async () => {
    if (!currentPhoto) return;
    soundEngine.playTap();
    setIsGenerating(true);
    setGenerationResult(null);

    const result = await aiService.generateAIImage({
      photoId: currentPhoto.id,
      photoUrl: currentPhoto.url,
      style: selectedStyle,
      intensity: aiIntensity,
      lighting,
      mood,
      background
    });

    setIsGenerating(false);
    setGenerationResult(result);
    soundEngine.playSuccessChime();
  };

  // Save Provider Config (Runtime In-Memory only)
  const handleConnectProvider = (e: React.FormEvent) => {
    e.preventDefault();
    const success = aiService.connectProvider({
      provider: providerChoice,
      endpointUrl,
      apiKey: apiKeyInput
    });

    if (success) {
      setIsProviderConnected(true);
      setShowProviderModal(false);
      setApiKeyInput('');
      soundEngine.playSuccessChime();
    }
  };

  // Background ambient style treatment around preview (purely decorative atmosphere)
  const getBackgroundAura = (): string => {
    switch (background) {
      case 'studio':
        return 'radial-gradient(circle at center, rgba(148, 163, 184, 0.18) 0%, rgba(15, 23, 42, 0.6) 100%)';
      case 'luxury':
        return 'radial-gradient(circle at center, rgba(217, 119, 6, 0.2) 0%, rgba(16, 185, 129, 0.1) 60%, rgba(10, 8, 24, 0.8) 100%)';
      case 'night':
        return 'radial-gradient(circle at center, rgba(6, 182, 212, 0.22) 0%, rgba(236, 72, 153, 0.15) 60%, rgba(8, 7, 20, 0.9) 100%)';
      case 'dream':
        return 'radial-gradient(circle at center, rgba(229, 72, 125, 0.25) 0%, rgba(139, 77, 255, 0.25) 60%, rgba(8, 7, 20, 0.9) 100%)';
      case 'original':
      default:
        return 'radial-gradient(circle at center, rgba(139, 77, 255, 0.12) 0%, rgba(34, 16, 62, 0.4) 100%)';
    }
  };

  // Empty state fallback
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
            width: '68px',
            height: '68px',
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
          <Camera size={30} />
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, margin: '0 0 8px 0' }}>
          No photos found
        </h2>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--luma-text-secondary)', margin: '0 0 24px 0' }}>
          Take your photos first to enter the AI Magic Studio.
        </p>
        <button
          onClick={() => goToGuestStep('capture')}
          style={{
            background: 'linear-gradient(135deg, #E5487D 0%, #8B3FD1 100%)',
            color: '#FFFFFF',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            padding: '13px 32px',
            borderRadius: '9999px',
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            cursor: 'pointer'
          }}
        >
          STEP INSIDE BOOTH →
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
        overflowY: isPhone ? 'auto' : 'hidden',
        boxSizing: 'border-box',
        userSelect: 'none',
        paddingTop: isPhone ? 'max(10px, env(safe-area-inset-top))' : '12px',
        paddingBottom: isPhone ? 'max(12px, env(safe-area-inset-bottom))' : '14px',
        paddingLeft: isPhone ? '12px' : isTablet ? '18px' : '28px',
        paddingRight: isPhone ? '12px' : isTablet ? '18px' : '28px'
      }}
    >
      {/* Background Subtle Grain & Layered Radial Lighting */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: 'radial-gradient(rgba(139, 77, 255, 0.08) 0.75px, transparent 0.75px)',
          backgroundSize: '32px 32px',
          opacity: 0.45,
          pointerEvents: 'none',
          zIndex: 0
        }}
      />
      
      {/* Dynamic Ambient Glow around Preview based on selected style */}
      <div
        style={{
          position: 'fixed',
          top: '25%',
          left: isPhone ? '50%' : '32%',
          transform: 'translate(-50%, -50%)',
          width: '620px',
          height: '620px',
          background: `radial-gradient(circle, ${activeStyleDef.accentColor}22 0%, rgba(34, 16, 62, 0.06) 55%, transparent 75%)`,
          borderRadius: '50%',
          filter: 'blur(70px)',
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
          maxWidth: '1240px',
          margin: '0 auto 10px auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 20,
          position: 'relative',
          flexShrink: 0,
          height: '44px'
        }}
      >
        {/* Left: ← RETURN TO EDITOR */}
        <button
          onClick={handleReturnToEditor}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.16)',
            borderRadius: '9999px',
            padding: isPhone ? '6px 14px' : '7px 16px',
            color: 'var(--luma-text-secondary)',
            fontSize: '0.78rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            letterSpacing: '0.04em',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.15s ease',
            touchAction: 'manipulation',
            outline: 'none',
            minHeight: '36px'
          }}
          aria-label="Return to Photo Review Editor"
        >
          <ArrowLeft size={14} />
          <span>RETURN TO EDITOR</span>
        </button>

        {/* Center: Real LumaBooth PNG Logo Asset */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4px 16px',
            borderRadius: '9999px',
            backgroundColor: 'rgba(8, 6, 20, 0.85)',
            backgroundImage: 'linear-gradient(135deg, rgba(28, 20, 52, 0.6) 0%, rgba(10, 8, 24, 0.85) 100%)',
            border: '1px solid rgba(185, 167, 255, 0.22)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5)'
          }}
        >
          <img
            src="/assets/lumabooth-logo.png"
            alt="LumaBooth"
            style={{
              height: isPhone ? '18px' : '22px',
              width: 'auto',
              maxWidth: '120px',
              objectFit: 'contain',
              display: 'block',
              filter: 'drop-shadow(0 2px 8px rgba(139, 77, 255, 0.4))'
            }}
          />
        </div>

        {/* Right: AI MAGIC STUDIO Status Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: isPhone ? '4px 10px' : '5px 14px',
            borderRadius: '9999px',
            background: 'linear-gradient(135deg, rgba(139, 77, 255, 0.2) 0%, rgba(229, 72, 125, 0.2) 100%)',
            border: '1px solid rgba(185, 167, 255, 0.35)',
            color: '#FFFFFF',
            fontSize: '0.74rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: 800,
            letterSpacing: '0.06em',
            boxShadow: '0 0 14px rgba(139, 77, 255, 0.3)'
          }}
        >
          <Sparkles size={13} color="#E5487D" />
          <span>AI MAGIC STUDIO</span>
        </div>
      </header>

      {/* ===================================================================
          2. MAIN STUDIO: 65 / 35 DESKTOP SPLIT
          =================================================================== */}
      <main
        style={{
          flex: 1,
          width: '100%',
          maxWidth: '1240px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: isPhone ? 'column' : 'row',
          gap: isPhone ? '16px' : '24px',
          alignItems: 'stretch',
          zIndex: 10,
          position: 'relative',
          minHeight: 0
        }}
      >
        {/* =================================================================
            LEFT COLUMN (65% Desktop): LARGE AI PREVIEW + PHOTO SWITCHER
            ================================================================= */}
        <section
          style={{
            flex: isPhone ? 'none' : '1 1 65%',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            minWidth: 0,
            minHeight: 0,
            justifyContent: 'space-between'
          }}
        >
          {/* Large AI Preview Container */}
          <div
            style={{
              flex: 1,
              width: '100%',
              minHeight: isPhone ? '280px' : isTablet ? '320px' : '370px',
              maxHeight: isPhone ? '360px' : 'calc(100dvh - 210px)',
              position: 'relative',
              borderRadius: '22px',
              backgroundColor: '#0D0B1C',
              backgroundImage: getBackgroundAura(),
              border: `1px solid ${activeStyleDef.accentColor}44`,
              boxShadow: `0 20px 50px rgba(0, 0, 0, 0.8), 0 0 35px ${activeStyleDef.accentColor}22`,
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.35s ease'
            }}
          >
            {/* REAL Captured Photo (Never replaced with fake generated image) */}
            <img
              src={currentPhoto.url}
              alt={`Photo ${selectedPhotoIndex + 1}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                display: 'block',
                transition: 'filter 0.3s ease'
              }}
            />

            {/* Camera Framing Corners */}
            <div style={{ position: 'absolute', top: 14, left: 14, width: 22, height: 22, borderTop: '2.5px solid rgba(255, 255, 255, 0.7)', borderLeft: '2.5px solid rgba(255, 255, 255, 0.7)', borderRadius: '3px 0 0 0', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', top: 14, right: 14, width: 22, height: 22, borderTop: '2.5px solid rgba(255, 255, 255, 0.7)', borderRight: '2.5px solid rgba(255, 255, 255, 0.7)', borderRadius: '0 3px 0 0', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: 14, left: 14, width: 22, height: 22, borderBottom: '2.5px solid rgba(255, 255, 255, 0.7)', borderLeft: '2.5px solid rgba(255, 255, 255, 0.7)', borderRadius: '0 0 0 3px', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: 14, right: 14, width: 22, height: 22, borderBottom: '2.5px solid rgba(255, 255, 255, 0.7)', borderRight: '2.5px solid rgba(255, 255, 255, 0.7)', borderRadius: '0 0 3px 0', pointerEvents: 'none' }} />

            {/* Top Overlay Badge [AI MAGIC ✦] */}
            <div
              style={{
                position: 'absolute',
                top: 16,
                left: 42,
                padding: '4px 12px',
                borderRadius: '9999px',
                background: 'rgba(8, 6, 20, 0.85)',
                border: '1px solid rgba(229, 72, 125, 0.5)',
                backdropFilter: 'blur(10px)',
                color: '#FFFFFF',
                fontSize: '0.74rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 800,
                letterSpacing: '0.08em',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                boxShadow: '0 0 16px rgba(229, 72, 125, 0.35)'
              }}
            >
              <Sparkles size={12} color="#E5487D" />
              <span>AI MAGIC ✦</span>
            </div>

            {/* Top Right Active Style Badge */}
            <div
              style={{
                position: 'absolute',
                top: 16,
                right: 42,
                padding: '4px 12px',
                borderRadius: '9999px',
                background: `${activeStyleDef.accentColor}28`,
                border: `1px solid ${activeStyleDef.accentColor}`,
                backdropFilter: 'blur(10px)',
                color: '#FFFFFF',
                fontSize: '0.72rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 800,
                letterSpacing: '0.08em',
                boxShadow: `0 0 14px ${activeStyleDef.accentColor}44`
              }}
            >
              {activeStyleDef.symbol} {activeStyleDef.name}
            </div>

            {/* Bottom Left: REAL PHOTO • ORIGINAL */}
            <div
              style={{
                position: 'absolute',
                bottom: 16,
                left: 42,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '3px 10px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(9, 8, 23, 0.75)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '0.68rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#06D6A0' }} />
              <span>REAL PHOTO • ORIGINAL</span>
            </div>

            {/* Bottom Right: AI Engine Ready Status */}
            <div
              style={{
                position: 'absolute',
                bottom: 16,
                right: 42,
                padding: '3px 10px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(9, 8, 23, 0.75)',
                border: '1px solid rgba(185, 167, 255, 0.2)',
                color: 'var(--luma-lavender)',
                fontSize: '0.68rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700
              }}
            >
              PHOTO 0{selectedPhotoIndex + 1} • {lighting.toUpperCase()} • {mood.toUpperCase()}
            </div>

            {/* Neural Synthesis Progress Overlay while generating */}
            {isGenerating && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: 'rgba(8, 6, 20, 0.85)',
                  backdropFilter: 'blur(12px)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '14px',
                  zIndex: 30
                }}
              >
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(229, 72, 125, 0.2)',
                    border: '1.5px solid #E5487D',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#E5487D',
                    boxShadow: '0 0 30px rgba(229, 72, 125, 0.5)'
                  }}
                >
                  <Wand2 size={28} className="animate-spin" />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <h4 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 900, color: '#FFFFFF' }}>
                    PREPARING YOUR AI LOOK...
                  </h4>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: 'var(--luma-lavender)' }}>
                    Applying {activeStyleDef.name} neural style parameters ({aiIntensity}%)
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Under-Image Micro-Captions */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px' }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--luma-text-secondary)', fontWeight: 600 }}>
              Preview your transformation
            </span>
            <span style={{ fontSize: '0.72rem', color: '#B9A7FF', fontFamily: 'var(--font-mono)' }}>
              Your original photo always stays untouched.
            </span>
          </div>

          {/* Photo Switcher Row */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--luma-lavender)', fontWeight: 800 }}>
                YOUR PHOTOS
              </span>
              <span style={{ fontSize: '0.64rem', color: 'var(--luma-text-muted)' }}>
                Click to switch active AI photo
              </span>
            </div>

            {/* 3 Real Captured Thumbnails */}
            <div style={{ display: 'flex', gap: '10px' }}>
              {capturedPhotos.slice(0, 3).map((photo, idx) => {
                const isSelected = selectedPhotoIndex === idx;

                return (
                  <button
                    key={photo.id || idx}
                    onClick={() => {
                      soundEngine.playTap();
                      setSelectedPhotoIndex(idx);
                      setGenerationResult(null);
                    }}
                    style={{
                      flex: 1,
                      height: isPhone ? '56px' : '62px',
                      borderRadius: '12px',
                      backgroundColor: '#120F24',
                      border: isSelected ? '2px solid #E5487D' : '1.5px solid rgba(255, 255, 255, 0.14)',
                      boxShadow: isSelected ? '0 0 16px rgba(229, 72, 125, 0.5), 0 4px 12px rgba(0, 0, 0, 0.6)' : 'none',
                      opacity: isSelected ? 1 : 0.65,
                      cursor: 'pointer',
                      position: 'relative',
                      overflow: 'hidden',
                      padding: 0,
                      transition: 'all 0.18s ease',
                      touchAction: 'manipulation'
                    }}
                    title={`Select Photo 0${idx + 1}`}
                  >
                    <img
                      src={photo.url}
                      alt={`Thumbnail 0${idx + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block'
                      }}
                    />

                    <div
                      style={{
                        position: 'absolute',
                        bottom: 3,
                        left: 4,
                        background: 'rgba(8, 6, 20, 0.8)',
                        padding: '1px 6px',
                        borderRadius: '9999px',
                        fontSize: '0.6rem',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 800,
                        color: '#FFFFFF'
                      }}
                    >
                      PHOTO 0{idx + 1}
                    </div>

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
                          color: '#FFFFFF',
                          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.6)'
                        }}
                      >
                        <Check size={11} strokeWidth={3} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* =================================================================
            RIGHT COLUMN (35% Desktop): FLOATING GLASS AI CONTROL PANEL
            ================================================================= */}
        <section
          style={{
            flex: isPhone ? 'none' : '0 0 380px',
            backgroundColor: 'rgba(18, 16, 38, 0.78)',
            border: '1px solid rgba(185, 167, 255, 0.18)',
            borderRadius: '20px',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.65)',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            padding: isPhone ? '14px' : '16px',
            gap: '14px'
          }}
        >
          {/* Panel Header */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.05rem',
                fontWeight: 900,
                color: '#FFFFFF',
                letterSpacing: '0.02em'
              }}
            >
              TRANSFORM YOUR MOMENT
            </span>
            <span style={{ fontSize: '0.74rem', color: 'var(--luma-text-secondary)' }}>
              Choose a creative direction.
            </span>
          </div>

          {/* 8 AI Styles (Clean 2-Column Grid with CSS Gradients & Abstract Aesthetics) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--luma-lavender)', fontWeight: 800 }}>
              AI STYLES
            </span>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
              {AI_STYLE_DEFINITIONS.map((st) => {
                const isSelected = selectedStyle === st.id;
                return (
                  <button
                    key={st.id}
                    onClick={() => {
                      soundEngine.playTap();
                      setSelectedStyle(st.id);
                      setGenerationResult(null);
                    }}
                    style={{
                      padding: '10px 10px',
                      borderRadius: '12px',
                      background: isSelected 
                        ? `linear-gradient(135deg, ${st.accentColor}33 0%, rgba(18, 16, 38, 0.9) 100%)` 
                        : 'rgba(255, 255, 255, 0.04)',
                      border: isSelected ? `1.5px solid ${st.accentColor}` : '1px solid rgba(255, 255, 255, 0.1)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      boxShadow: isSelected ? `0 0 16px ${st.accentColor}55` : 'none',
                      transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                      transition: 'all 0.18s ease',
                      position: 'relative',
                      overflow: 'hidden',
                      touchAction: 'manipulation'
                    }}
                  >
                    {/* Decorative abstract CSS gradient swatch */}
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: '40px',
                        height: '40px',
                        background: st.gradient,
                        filter: 'blur(12px)',
                        pointerEvents: 'none'
                      }}
                    />

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#FFFFFF' }}>
                        {st.symbol} {st.name}
                      </span>
                      {isSelected && (
                        <div
                          style={{
                            width: 14,
                            height: 14,
                            borderRadius: '50%',
                            backgroundColor: st.accentColor,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#FFFFFF'
                          }}
                        >
                          <Check size={9} strokeWidth={3} />
                        </div>
                      )}
                    </div>

                    <span style={{ fontSize: '0.62rem', color: isSelected ? '#FFFFFF' : 'var(--luma-text-secondary)', lineHeight: 1.15 }}>
                      {st.tagline}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* AI Intensity Slider */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--luma-lavender)', fontWeight: 800 }}>
                AI INTENSITY
              </span>
              <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: '#E5487D', fontWeight: 800 }}>
                {aiIntensity}%
              </span>
            </div>

            <input
              type="range"
              min="10"
              max="100"
              value={aiIntensity}
              onChange={(e) => setAiIntensity(Number(e.target.value))}
              style={{
                width: '100%',
                accentColor: '#E5487D',
                cursor: 'pointer'
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.62rem', color: 'var(--luma-text-muted)', fontFamily: 'var(--font-mono)' }}>
              <span>Subtle</span>
              <span>Balanced (60%)</span>
              <span>Strong</span>
            </div>
          </div>

          {/* Lighting & Mood Controls */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {/* Lighting */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '0.66rem', fontFamily: 'var(--font-mono)', color: 'var(--luma-lavender)', fontWeight: 700 }}>
                LIGHTING
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px' }}>
                {(['natural', 'studio', 'dramatic', 'neon'] as AILighting[]).map((lt) => (
                  <button
                    key={lt}
                    onClick={() => setLighting(lt)}
                    style={{
                      padding: '5px 2px',
                      borderRadius: '6px',
                      backgroundColor: lighting === lt ? 'rgba(229, 72, 125, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                      border: lighting === lt ? '1px solid #E5487D' : '1px solid rgba(255, 255, 255, 0.08)',
                      color: '#FFFFFF',
                      fontSize: '0.64rem',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textTransform: 'capitalize'
                    }}
                  >
                    {lt}
                  </button>
                ))}
              </div>
            </div>

            {/* Mood */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '0.66rem', fontFamily: 'var(--font-mono)', color: 'var(--luma-lavender)', fontWeight: 700 }}>
                MOOD
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px' }}>
                {(['soft', 'bold', 'elegant', 'playful'] as AIMood[]).map((md) => (
                  <button
                    key={md}
                    onClick={() => setMood(md)}
                    style={{
                      padding: '5px 2px',
                      borderRadius: '6px',
                      backgroundColor: mood === md ? 'rgba(229, 72, 125, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                      border: mood === md ? '1px solid #E5487D' : '1px solid rgba(255, 255, 255, 0.08)',
                      color: '#FFFFFF',
                      fontSize: '0.64rem',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textTransform: 'capitalize'
                    }}
                  >
                    {md}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* AI Background Treatment Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.66rem', fontFamily: 'var(--font-mono)', color: 'var(--luma-lavender)', fontWeight: 700 }}>
                AI BACKGROUND
              </span>
              <span style={{ fontSize: '0.58rem', fontFamily: 'var(--font-mono)', color: '#06D6A0', fontWeight: 800 }}>
                AI BACKGROUND API READY
              </span>
            </div>

            <div style={{ display: 'flex', gap: '4px' }}>
              {(['original', 'studio', 'luxury', 'night', 'dream'] as AIBackground[]).map((bg) => (
                <button
                  key={bg}
                  onClick={() => setBackground(bg)}
                  style={{
                    flex: 1,
                    padding: '6px 2px',
                    borderRadius: '6px',
                    backgroundColor: background === bg ? 'rgba(229, 72, 125, 0.3)' : 'rgba(255, 255, 255, 0.04)',
                    border: background === bg ? '1px solid #E5487D' : '1px solid rgba(255, 255, 255, 0.08)',
                    color: '#FFFFFF',
                    fontSize: '0.62rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textTransform: 'capitalize'
                  }}
                >
                  {bg}
                </button>
              ))}
            </div>
          </div>

          {/* Primary CTA: GENERATE AI LOOK ✦ */}
          <button
            onClick={handleGenerateAiLook}
            disabled={isGenerating}
            style={{
              width: '100%',
              minHeight: '48px',
              background: 'linear-gradient(135deg, #E5487D 0%, #B82E88 45%, #8B3FD1 100%)',
              border: '1px solid rgba(255, 255, 255, 0.35)',
              borderRadius: '12px',
              color: '#FFFFFF',
              fontFamily: 'var(--font-display)',
              fontWeight: 900,
              fontSize: '0.92rem',
              letterSpacing: '0.04em',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 8px 24px rgba(229, 72, 125, 0.45)',
              touchAction: 'manipulation',
              transition: 'all 0.18s ease',
              marginTop: '4px'
            }}
          >
            <Sparkles size={16} />
            <span>{isGenerating ? 'PREPARING AI LOOK...' : 'GENERATE AI LOOK ✦'}</span>
          </button>

          {/* Result State Banner */}
          {generationResult && (
            <div
              style={{
                backgroundColor: 'rgba(9, 8, 23, 0.85)',
                border: '1px solid rgba(185, 167, 255, 0.25)',
                borderRadius: '12px',
                padding: '10px 12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Cpu size={14} color="#E5487D" />
                <span style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#FFFFFF' }}>
                  AI ENGINE READY
                </span>
              </div>
              <p style={{ fontSize: '0.72rem', color: 'var(--luma-lavender)', margin: 0, lineHeight: 1.25 }}>
                {generationResult.message}
              </p>
            </div>
          )}

          {/* Expandable AI Provider Section */}
          <div
            style={{
              backgroundColor: 'rgba(9, 8, 23, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '10px 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.66rem', fontFamily: 'var(--font-mono)', color: 'var(--luma-lavender)', fontWeight: 700 }}>
                AI PROVIDER
              </span>
              <span style={{ fontSize: '0.62rem', color: isProviderConnected ? '#06D6A0' : 'var(--luma-text-muted)' }}>
                {isProviderConnected ? 'Connected (Ready)' : 'Not connected'}
              </span>
            </div>

            <button
              onClick={() => setShowProviderModal(true)}
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#FFFFFF',
                fontSize: '0.64rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {isProviderConnected ? 'CONFIGURE' : 'CONNECT AI PROVIDER'}
            </button>
          </div>
        </section>
      </main>

      {/* ===================================================================
          3. AI PROVIDER INTEGRATION MODAL
          =================================================================== */}
      {showProviderModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(8, 6, 20, 0.85)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            zIndex: 100
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '440px',
              backgroundColor: '#120F24',
              border: '1.5px solid rgba(185, 167, 255, 0.25)',
              borderRadius: '24px',
              padding: '24px',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.9), 0 0 35px rgba(139, 77, 255, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={20} color="#E5487D" />
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
                  AI Provider Integration
                </h3>
              </div>
              <button
                onClick={() => setShowProviderModal(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--luma-text-muted)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--luma-text-secondary)', margin: 0 }}>
              Connect an image-generation API to enable AI transformations. API keys are handled strictly in runtime memory and never saved in persistent browser storage.
            </p>

            <form onSubmit={handleConnectProvider} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Provider Dropdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--luma-lavender)' }}>
                  PROVIDER
                </label>
                <select
                  value={providerChoice}
                  onChange={(e) => setProviderChoice(e.target.value as any)}
                  style={{
                    backgroundColor: 'rgba(9, 8, 23, 0.8)',
                    border: '1px solid rgba(185, 167, 255, 0.25)',
                    borderRadius: '8px',
                    padding: '8px 10px',
                    color: '#FFFFFF',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.78rem',
                    outline: 'none'
                  }}
                >
                  <option value="google_imagen">Google Imagen 3 API</option>
                  <option value="stable_diffusion">Stable Diffusion XL</option>
                  <option value="midjourney_api">Midjourney API Proxy</option>
                  <option value="custom">Custom Inference Endpoint</option>
                </select>
              </div>

              {/* API Endpoint */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--luma-lavender)' }}>
                  API ENDPOINT
                </label>
                <input
                  type="text"
                  value={endpointUrl}
                  onChange={(e) => setEndpointUrl(e.target.value)}
                  placeholder="https://api.imagen.google.internal/v1/generate"
                  style={{
                    backgroundColor: 'rgba(9, 8, 23, 0.8)',
                    border: '1px solid rgba(185, 167, 255, 0.25)',
                    borderRadius: '8px',
                    padding: '8px 10px',
                    color: '#FFFFFF',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.78rem',
                    outline: 'none'
                  }}
                />
              </div>

              {/* API Key */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--luma-lavender)' }}>
                  API KEY (STORED IN-MEMORY ONLY)
                </label>
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="Enter secret API token"
                  style={{
                    backgroundColor: 'rgba(9, 8, 23, 0.8)',
                    border: '1px solid rgba(185, 167, 255, 0.25)',
                    borderRadius: '8px',
                    padding: '8px 10px',
                    color: '#FFFFFF',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.78rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setShowProviderModal(false)}
                  style={{
                    flex: 1,
                    minHeight: '40px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '9999px',
                    color: '#FFFFFF',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.78rem',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  style={{
                    flex: 1.3,
                    minHeight: '40px',
                    background: 'linear-gradient(135deg, #E5487D 0%, #8B3FD1 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '9999px',
                    color: '#FFFFFF',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 900,
                    fontSize: '0.84rem',
                    cursor: 'pointer'
                  }}
                >
                  SAVE & CONNECT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiMagicStudioView;
