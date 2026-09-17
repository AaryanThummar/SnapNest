import React, { useState, useRef } from 'react';
import { useApp } from '../../../context/AppContext';
import { soundEngine } from '../../../utils/audio';
import { CameraCaptureView, CameraCaptureHandle } from '../../../components/camera/CameraCaptureView';
import { generateMorph } from '../../../services/aiApi';
import { aiService } from '../../../services/aiService';
import { 
  ArrowLeft, 
  Sparkles, 
  RotateCcw, 
  Download, 
  Wand2, 
  Camera, 
  Check, 
  AlertCircle,
  Settings,
  X,
  Lock,
  Cpu
} from 'lucide-react';

export interface MorphStyle {
  id: string;
  name: string;
  desc: string;
  gradient: string;
  accent: string;
}

const MORPH_STYLES: MorphStyle[] = [
  {
    id: 'cyber',
    name: 'CYBER',
    desc: 'Neon cyan & electric violet matrix',
    gradient: 'linear-gradient(135deg, rgba(0,245,212,0.4) 0%, rgba(139,63,209,0.5) 100%)',
    accent: '#00F5D4'
  },
  {
    id: 'royal',
    name: 'ROYAL',
    desc: 'Opulent gold foil & emerald saturation',
    gradient: 'linear-gradient(135deg, rgba(245,158,11,0.45) 0%, rgba(16,185,129,0.5) 100%)',
    accent: '#F59E0B'
  },
  {
    id: 'anime',
    name: 'ANIME',
    desc: 'Cel-shaded high-contrast anime line pop',
    gradient: 'linear-gradient(135deg, rgba(236,72,153,0.45) 0%, rgba(168,85,247,0.45) 100%)',
    accent: '#EC4899'
  },
  {
    id: 'cinematic',
    name: 'CINEMATIC',
    desc: '35mm anamorphic widescreen teal-orange tone',
    gradient: 'linear-gradient(135deg, rgba(234,88,12,0.45) 0%, rgba(14,116,144,0.5) 100%)',
    accent: '#FB923C'
  },
  {
    id: 'glam',
    name: 'GLAM',
    desc: 'High-fashion runway soft diffusion bloom',
    gradient: 'linear-gradient(135deg, rgba(244,114,182,0.45) 0%, rgba(251,191,36,0.45) 100%)',
    accent: '#F472B6'
  },
  {
    id: 'futuristic',
    name: 'FUTURISTIC',
    desc: 'Clean silver chrome holographic gloss',
    gradient: 'linear-gradient(135deg, rgba(99,102,241,0.45) 0%, rgba(229,72,125,0.45) 100%)',
    accent: '#818CF8'
  }
];

export const AiMorphView: React.FC = () => {
  const { goToGuestStep, isPhone, isTablet, activeEvent, addMemory } = useApp();
  const cameraRef = useRef<CameraCaptureHandle | null>(null);

  const [phase, setPhase] = useState<'capture' | 'select' | 'processing' | 'result' | 'not_configured' | 'error'>('capture');
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [generatedPhoto, setGeneratedPhoto] = useState<string | null>(null);
  const [selectedStyleId, setSelectedStyleId] = useState<string>('cyber');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStep, setProcessingStep] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);

  // Secure API Connection Form
  const [apiEndpoint, setApiEndpoint] = useState<string>('');
  const [apiKey, setApiKey] = useState<string>('');

  const activeStyle = MORPH_STYLES.find(s => s.id === selectedStyleId) || MORPH_STYLES[0];

  const PROCESSING_STEPS = [
    'AI MORPHING...',
    'Analyzing your portrait...',
    `Applying ${activeStyle.name} style...`,
    'Generating your new look...'
  ];

  const triggerError = (msg: string) => {
    setErrorMessage(msg);
    setTimeout(() => {
      setErrorMessage(null);
    }, 4500);
  };

  // Capture portrait from live camera
  const handleSnapPortrait = async () => {
    console.log('[AI MORPH] Capturing portrait from device camera...');
    soundEngine.playTap();
    const photo = await cameraRef.current?.snapPhoto();
    if (photo) {
      console.log('[AI MORPH] Captured real portrait data successfully.');
      setCapturedPhoto(photo);
      setGeneratedPhoto(null);
      setPhase('select');
      setErrorMessage(null);
      soundEngine.playSuccessChime();
    } else {
      console.warn('[AI MORPH] Could not capture frame from video.');
      triggerError('Could not capture frame from camera. Please try again.');
    }
  };

  // Trigger Real AI Morph Image Generation via Backend
  const handleApplyMorph = async () => {
    console.log('[AI MORPH] MORPH LOOK clicked');

    // 1. Validate captured real photo
    if (!capturedPhoto) {
      console.error('[AI MORPH] Validation failed: No captured photo');
      triggerError('Please capture a real portrait before morphing.');
      return;
    }

    // 2. Validate selected transformation style
    if (!selectedStyleId || !activeStyle) {
      console.error('[AI MORPH] Validation failed: No style selected');
      triggerError('Please select a transformation style.');
      return;
    }

    if (!activeEvent?.id) {
      triggerError('No active event selected. Please select an event first.');
      return;
    }

    console.log('[AI MORPH] Starting AI generation pipeline for style:', activeStyle.name);
    soundEngine.playAiStart();
    setIsProcessing(true);
    setPhase('processing');
    setProcessingStep(0);
    setErrorMessage(null);

    // Meaningful progression through generation stages
    const stepInterval = setInterval(() => {
      setProcessingStep(prev => {
        if (prev < PROCESSING_STEPS.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 1000);

    try {
      // 3. Send to backend AI morph endpoint
      const result = await generateMorph(
        capturedPhoto,
        activeEvent.id,
        selectedStyleId.toLowerCase()
      );

      clearInterval(stepInterval);
      setIsProcessing(false);

      if (result.success && result.data?.generatedImageUrl) {
        console.log('[AI MORPH] AI image generation succeeded!', result.data.generatedImageUrl);
        setGeneratedPhoto(result.data.generatedImageUrl);
        setPhase('result');
        soundEngine.playAiComplete();

        // Record AI creation in Memories
        addMemory({
          eventId: activeEvent.id,
          eventName: activeEvent.eventName || 'AI Morph Creation',
          imageUrl: result.data.generatedImageUrl,
          type: 'ai-morph',
          caption: `AI Morph • ${activeStyle.name}`
        });
      } else {
        console.error('[AI MORPH] AI service error:', result.message);
        setErrorMessage(result.message || 'AI unavailable: Generative transformation is currently offline.');
        setPhase('error');
      }
    } catch (err: any) {
      clearInterval(stepInterval);
      setIsProcessing(false);
      console.error('[AI MORPH] Unexpected error during AI generation:', err);
      setErrorMessage(err.message || 'AI unavailable: Generative transformation is currently offline.');
      setPhase('error');
    }
  };

  // Connect AI Provider Modal Handler
  const handleSaveApiConfig = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playTap();

    if (!apiEndpoint.trim() && !apiKey.trim()) {
      triggerError('Please provide an API endpoint or API key.');
      return;
    }

    aiService.connectProvider({
      provider: 'custom',
      endpointUrl: apiEndpoint.trim() || undefined,
      apiKey: apiKey.trim() || undefined
    });

    setShowConfigModal(false);
    soundEngine.playSuccessChime();
    setPhase('select');
  };

  // Try again
  const handleTryAgain = () => {
    console.log('[AI MORPH] Resetting to capture step');
    soundEngine.playTap();
    setCapturedPhoto(null);
    setGeneratedPhoto(null);
    setIsProcessing(false);
    setErrorMessage(null);
    setPhase('capture');
  };

  // Save generated image
  const handleSavePhoto = () => {
    const targetPhoto = generatedPhoto || capturedPhoto;
    if (!targetPhoto) return;
    console.log('[AI MORPH] Saving photo to disk');
    soundEngine.playTap();
    const link = document.createElement('a');
    link.download = `AI_Morph_${activeStyle.name}_${Date.now()}.jpg`;
    link.href = targetPhoto;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    soundEngine.playSuccessChime();
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

      {/* Dynamic Ambient Lighting */}
      <div
        style={{
          position: 'fixed',
          top: '25%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '580px',
          height: '580px',
          background: `radial-gradient(circle, ${activeStyle.accent}20 0%, rgba(229, 72, 125, 0.06) 45%, transparent 70%)`,
          borderRadius: '50%',
          filter: 'blur(65px)',
          pointerEvents: 'none',
          zIndex: 0,
          transition: 'all 0.3s ease'
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

        {/* Right: API Config Settings Trigger & Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={() => setShowConfigModal(true)}
            title="Configure AI API"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: 'var(--luma-lavender)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <Settings size={14} />
          </button>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '4px 10px',
              borderRadius: '9999px',
              backgroundColor: `${activeStyle.accent}20`,
              border: `1px solid ${activeStyle.accent}66`,
              color: activeStyle.accent,
              fontSize: '0.7rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 800,
              minHeight: '36px'
            }}
          >
            <Sparkles size={12} />
            <span>AI MORPH</span>
          </div>
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
          <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: activeStyle.accent, fontWeight: 800, letterSpacing: '0.14em' }}>
            AI MORPH STUDIO
          </span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: isPhone ? '1.45rem' : '1.8rem', fontWeight: 900, margin: '2px 0 0 0' }}>
            {phase === 'result' 
              ? `AI GENERATED: ${activeStyle.name}` 
              : phase === 'not_configured' 
              ? 'AI TRANSFORMATION NOT CONFIGURED'
              : 'CHOOSE YOUR TRANSFORMATION'}
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--luma-text-secondary)', margin: '2px 0 0 0' }}>
            {phase === 'result' 
              ? 'Real AI-generated transformation using your captured portrait.' 
              : phase === 'not_configured'
              ? 'Connect an AI image-generation API to create your transformation.'
              : 'Capture a portrait and select an AI aesthetic.'}
          </p>
        </div>

        {/* Main Viewport Container */}
        <div
          style={{
            width: '100%',
            height: isPhone ? '42vh' : isTablet ? '48vh' : '380px',
            maxHeight: isPhone ? '360px' : '440px',
            position: 'relative',
            borderRadius: '22px',
            overflow: 'hidden',
            backgroundColor: '#0D0B1C',
            boxShadow: `0 20px 50px rgba(0, 0, 0, 0.85), 0 0 30px ${activeStyle.accent}33`,
            border: `1px solid ${activeStyle.accent}55`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          {/* Phase 1: Real Camera Capture */}
          {phase === 'capture' && (
            <CameraCaptureView ref={cameraRef} borderRadius="22px" />
          )}

          {/* Phase 2: Captured Portrait Preview */}
          {phase === 'select' && capturedPhoto && (
            <div style={{ width: '100%', height: '100%', position: 'relative' }}>
              <img src={capturedPhoto} alt="Captured Portrait" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}

          {/* Phase 3: AI Processing Screen */}
          {phase === 'processing' && capturedPhoto && (
            <div style={{ width: '100%', height: '100%', position: 'relative' }}>
              <img src={capturedPhoto} alt="Processing Portrait" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: 'rgba(7, 6, 18, 0.88)',
                  backdropFilter: 'blur(10px)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '14px',
                  padding: '20px',
                  textAlign: 'center'
                }}
              >
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: `${activeStyle.accent}25`,
                    border: `2px solid ${activeStyle.accent}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: activeStyle.accent,
                    boxShadow: `0 0 30px ${activeStyle.accent}66`
                  }}
                >
                  <Wand2 size={30} color={activeStyle.accent} className="animate-spin" />
                </div>
                <div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '0.06em' }}>
                    {PROCESSING_STEPS[processingStep]}
                  </span>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.74rem', color: 'var(--luma-lavender)' }}>
                    Generating new image based on your portrait
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Phase 4: AI Not Configured State (Zero Fake CSS filter simulation) */}
          {phase === 'not_configured' && (
            <div
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(13, 11, 28, 0.95)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px',
                textAlign: 'center',
                boxSizing: 'border-box'
              }}
            >
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 183, 3, 0.15)',
                  border: '1.5px solid #FFB703',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFB703',
                  marginBottom: '12px'
                }}
              >
                <Cpu size={26} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 900, color: '#FFFFFF', margin: '0 0 6px 0' }}>
                AI TRANSFORMATION NOT CONFIGURED
              </h3>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--luma-text-secondary)', maxWidth: '320px', margin: '0 0 16px 0', lineHeight: 1.4 }}>
                Connect an AI image-generation API (Google Imagen, Stable Diffusion, or Midjourney API) to create your transformation.
              </p>
              <button
                onClick={() => setShowConfigModal(true)}
                style={{
                  padding: '10px 22px',
                  borderRadius: '9999px',
                  background: 'linear-gradient(135deg, #FFB703 0%, #E5487D 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: '#070612',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 900,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Settings size={14} />
                <span>CONNECT AI API</span>
              </button>
            </div>
          )}

          {/* Phase 5: Success AI Generated Result Screen */}
          {phase === 'result' && generatedPhoto && (
            <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
              <img
                className="animate-ai-reveal"
                src={generatedPhoto}
                alt={`AI Generated ${activeStyle.name}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
              {/* AI Generated Badge */}
              <div
                className="animate-badge-shimmer"
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  padding: '5px 12px',
                  borderRadius: '9999px',
                  backgroundColor: 'rgba(8, 6, 20, 0.9)',
                  border: `1.5px solid ${activeStyle.accent}`,
                  color: activeStyle.accent,
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  backdropFilter: 'blur(8px)',
                  boxShadow: `0 4px 14px rgba(0,0,0,0.6), 0 0 12px ${activeStyle.accent}44`
                }}
              >
                <Sparkles size={11} />
                <span>✦ AI GENERATED</span>
              </div>
            </div>
          )}

          {/* Phase 6: Error State */}
          {phase === 'error' && (
            <div
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(13, 11, 28, 0.95)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px',
                textAlign: 'center',
                boxSizing: 'border-box'
              }}
            >
              <AlertCircle size={32} color="#E5487D" style={{ marginBottom: '10px' }} />
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 900, color: '#FFFFFF', margin: '0 0 6px 0' }}>
                {errorMessage && errorMessage.includes('AI unavailable') ? 'AI UNAVAILABLE' : 'GENERATION FAILED'}
              </h3>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--luma-text-secondary)', maxWidth: '300px', margin: '0 0 16px 0' }}>
                {errorMessage || 'AI unavailable: Generative transformation is currently offline.'}
              </p>
              <button
                onClick={handleApplyMorph}
                style={{
                  padding: '9px 20px',
                  borderRadius: '9999px',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  color: '#FFFFFF',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 800,
                  fontSize: '0.78rem',
                  cursor: 'pointer'
                }}
              >
                RETRY GENERATION
              </button>
            </div>
          )}
        </div>

        {/* Style Selector (During select & result phases) */}
        {(phase === 'select' || phase === 'result') && (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '0.66rem', fontFamily: 'var(--font-mono)', color: 'var(--luma-lavender)', fontWeight: 800 }}>
              SELECT TRANSFORMATION STYLE
            </span>
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '2px', scrollbarWidth: 'none' }}>
              {MORPH_STYLES.map((s) => {
                const isSelected = selectedStyleId === s.id;
                return (
                  <button
                    key={s.id}
                    disabled={isProcessing}
                    onClick={() => {
                      soundEngine.playTap();
                      setSelectedStyleId(s.id);
                      console.log('[AI MORPH] Style selected:', s.name);
                    }}
                    style={{
                      flex: '0 0 auto',
                      padding: '7px 14px',
                      borderRadius: '9999px',
                      backgroundColor: isSelected ? `${s.accent}25` : 'rgba(255, 255, 255, 0.05)',
                      border: isSelected ? `1.5px solid ${s.accent}` : '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#FFFFFF',
                      fontSize: '0.74rem',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 800,
                      cursor: isProcessing ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      boxShadow: isSelected ? `0 0 14px ${s.accent}44` : 'none',
                      transition: 'all 0.15s ease',
                      opacity: isProcessing ? 0.6 : 1
                    }}
                  >
                    <span>{s.name}</span>
                    {isSelected && <Check size={11} color={s.accent} strokeWidth={3} />}
                  </button>
                );
              })}
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

          {phase === 'select' && (
            <>
              <button
                onClick={handleTryAgain}
                disabled={isProcessing}
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
                  cursor: isProcessing ? 'not-allowed' : 'pointer'
                }}
              >
                RETAKE
              </button>

              <button
                onClick={handleApplyMorph}
                disabled={isProcessing}
                style={{
                  flex: 1,
                  minHeight: isPhone ? '48px' : '52px',
                  borderRadius: '9999px',
                  background: isProcessing 
                    ? 'rgba(139, 63, 209, 0.4)'
                    : `linear-gradient(135deg, ${activeStyle.accent} 0%, #8B3FD1 100%)`,
                  border: '1px solid rgba(255, 255, 255, 0.35)',
                  color: isProcessing ? '#FFFFFF' : '#070612',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 900,
                  fontSize: '1rem',
                  letterSpacing: '0.04em',
                  cursor: isProcessing ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: isProcessing ? 'none' : `0 8px 25px ${activeStyle.accent}45`,
                  transition: 'all 0.2s ease'
                }}
              >
                {isProcessing ? (
                  <>
                    <Wand2 size={16} className="animate-spin" />
                    <span>AI PROCESSING...</span>
                  </>
                ) : (
                  <>
                    <span>MORPH LOOK →</span>
                    <Sparkles size={16} />
                  </>
                )}
              </button>
            </>
          )}

          {phase === 'not_configured' && (
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
                  cursor: 'pointer'
                }}
              >
                ← BACK TO CAPTURE
              </button>

              <button
                onClick={() => setShowConfigModal(true)}
                style={{
                  flex: 1,
                  minHeight: isPhone ? '48px' : '52px',
                  borderRadius: '9999px',
                  background: 'linear-gradient(135deg, #FFB703 0%, #E5487D 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: '#070612',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 900,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Settings size={14} />
                <span>CONFIGURE API</span>
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
                <RotateCcw size={14} color={activeStyle.accent} />
                <span>TRY AGAIN</span>
              </button>

              <button
                onClick={handleSavePhoto}
                style={{
                  flex: 1,
                  minHeight: isPhone ? '48px' : '52px',
                  borderRadius: '9999px',
                  background: `linear-gradient(135deg, ${activeStyle.accent} 0%, #E5487D 100%)`,
                  border: '1px solid rgba(255, 255, 255, 0.35)',
                  color: '#070612',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 900,
                  fontSize: '0.94rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: `0 8px 25px ${activeStyle.accent}45`
                }}
              >
                <Download size={16} />
                <span>SAVE</span>
              </button>
            </>
          )}
        </div>
      </main>

      {/* ===================================================================
          3. SECURE AI API CONFIGURATION MODAL
          =================================================================== */}
      {showConfigModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(5, 7, 18, 0.88)',
            backdropFilter: 'blur(16px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '440px',
              backgroundColor: '#0D0B1C',
              border: '1px solid rgba(185, 167, 255, 0.3)',
              borderRadius: '24px',
              padding: '24px',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.95)',
              position: 'relative'
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowConfigModal(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={16} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <Lock size={16} color="#00F5D4" />
              <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: '#00F5D4', fontWeight: 800 }}>
                SECURE AI SERVICE CONNECTION
              </span>
            </div>

            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 900, margin: '0 0 8px 0' }}>
              CONNECT AI IMAGE API
            </h2>

            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--luma-text-secondary)', margin: '0 0 16px 0', lineHeight: 1.4 }}>
              Enter your project's backend proxy URL or AI image-generation endpoint (Google Imagen, Stable Diffusion / ComfyUI / Replicate API).
            </p>

            <form onSubmit={handleSaveApiConfig} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--luma-lavender)', fontWeight: 700, marginBottom: '4px' }}>
                  AI BACKEND ENDPOINT URL
                </label>
                <input
                  type="text"
                  placeholder="https://api.yourdomain.com/v1/ai/morph"
                  value={apiEndpoint}
                  onChange={(e) => setApiEndpoint(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#FFFFFF',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--luma-lavender)', fontWeight: 700, marginBottom: '4px' }}>
                  API TOKEN / SECRET (OPTIONAL PROXY KEY)
                </label>
                <input
                  type="password"
                  placeholder="••••••••••••••••"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#FFFFFF',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowConfigModal(false)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '9999px',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#FFFFFF',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    cursor: 'pointer'
                  }}
                >
                  CANCEL
                </button>

                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '9999px',
                    background: 'linear-gradient(135deg, #00F5D4 0%, #0077B6 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: '#070612',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 900,
                    fontSize: '0.84rem',
                    cursor: 'pointer'
                  }}
                >
                  CONNECT API
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiMorphView;
