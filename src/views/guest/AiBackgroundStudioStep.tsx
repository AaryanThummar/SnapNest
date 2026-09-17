// src/views/guest/AiBackgroundStudioStep.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { soundEngine } from '../../utils/audio';
import { generateBackground } from '../../services/backgroundApi';
import { BACKGROUNDS, BackgroundItem } from '../../config/backgrounds';
import { 
  ArrowLeft, 
  ArrowRight, 
  Camera, 
  Sparkles, 
  Check, 
  Wand2, 
  Cpu,
  AlertCircle
} from 'lucide-react';

const PROCESSING_STAGES = [
  'ANALYZING SUBJECT',
  'REMOVING ORIGINAL BACKGROUND',
  'BUILDING NEW ENVIRONMENT',
  'MATCHING LIGHTING',
  'FINALIZING'
];

export const AiBackgroundStudioStep: React.FC = () => {
  const { 
    capturedPhotos, 
    setCapturedPhotos,
    goToGuestStep, 
    isPhone, 
    isTablet,
    activeEvent,
    addMemory
  } = useApp();

  // Snapshot of original captured photos before background replacement
  const originalPhotosRef = useRef<string[]>([]);
  useEffect(() => {
    if (capturedPhotos.length > 0 && originalPhotosRef.current.length === 0) {
      originalPhotosRef.current = capturedPhotos.map(p => p.url);
    }
  }, [capturedPhotos]);

  // Active UI & Selection State
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);
  const [selectedBgId, setSelectedBgId] = useState<string>('none');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [stageIndex, setStageIndex] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Before/After comparison view toggle ('original' | 'generated')
  const [previewMode, setPreviewMode] = useState<'original' | 'generated'>('generated');

  // Per-photo applied background results: map index -> { bgId, generatedUrl }
  const [photoBackgrounds, setPhotoBackgrounds] = useState<Record<number, { bgId: string; generatedUrl?: string }>>({});

  const currentOriginalUrl = originalPhotosRef.current[selectedPhotoIndex] || capturedPhotos[selectedPhotoIndex]?.url;
  const currentGeneratedUrl = photoBackgrounds[selectedPhotoIndex]?.generatedUrl;
  const currentDisplayedUrl = (previewMode === 'original' || !currentGeneratedUrl) ? currentOriginalUrl : currentGeneratedUrl;

  const activeBg: BackgroundItem = BACKGROUNDS.find(b => b.id === selectedBgId) || BACKGROUNDS[0];
  const isAppliedForCurrent = photoBackgrounds[selectedPhotoIndex]?.bgId === selectedBgId && !!currentGeneratedUrl;

  // Filtered background options by category
  const categories = ['ALL', 'STUDIO', 'URBAN', 'NATURE', 'LIFESTYLE', 'CELEBRATION'];
  const filteredBackgrounds = selectedCategory === 'ALL' 
    ? BACKGROUNDS 
    : BACKGROUNDS.filter(b => b.category.toUpperCase() === selectedCategory || b.id === 'none');

  // Handle environment card selection
  const handleSelectBackground = (bgId: string) => {
    soundEngine.playTap();
    setSelectedBgId(bgId);
    setErrorMessage(null);

    // If NONE is selected, immediately revert to original photo without calling AI
    if (bgId === 'none') {
      setPhotoBackgrounds(prev => {
        const next = { ...prev };
        delete next[selectedPhotoIndex];
        return next;
      });

      // Restore original URL in capturedPhotos
      if (currentOriginalUrl) {
        setCapturedPhotos(prev =>
          prev.map((p, idx) => (idx === selectedPhotoIndex ? { ...p, url: currentOriginalUrl } : p))
        );
      }
    }
  };

  // Handle switching active photo thumbnail
  const handleSwitchPhoto = (idx: number) => {
    soundEngine.playTap();
    setSelectedPhotoIndex(idx);
    setErrorMessage(null);
    setPreviewMode('generated');

    // Sync selected background ID to that photo's current state
    const savedBg = photoBackgrounds[idx]?.bgId || 'none';
    setSelectedBgId(savedBg);
  };

  // Handle Apply Background (Real Subject-Preservation AI Pipeline)
  const handleApplyBackground = async () => {
    if (!currentOriginalUrl) return;

    // NONE option: nothing to process
    if (selectedBgId === 'none') {
      soundEngine.playTap();
      return;
    }

    if (!activeEvent?.id) {
      setErrorMessage('No active event found. Please select an event first.');
      return;
    }

    soundEngine.playAiStart();
    setIsProcessing(true);
    setStageIndex(0);
    setErrorMessage(null);
    setPreviewMode('generated');

    // Meaningful progression through real stages
    const interval = setInterval(() => {
      setStageIndex((prev) => {
        if (prev < PROCESSING_STAGES.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 1100);

    try {
      const result = await generateBackground(
        currentOriginalUrl,
        activeEvent.id,
        selectedBgId
      );

      clearInterval(interval);
      setIsProcessing(false);

      if (result.success && result.data?.generatedImageUrl) {
        const genUrl = result.data.generatedImageUrl;

        // Save generated result for this specific photo index
        setPhotoBackgrounds(prev => ({
          ...prev,
          [selectedPhotoIndex]: {
            bgId: selectedBgId,
            generatedUrl: genUrl
          }
        }));

        // Update capturedPhotos in global app state so strips & share reflect the composite
        setCapturedPhotos(prev =>
          prev.map((p, idx) => (idx === selectedPhotoIndex ? { ...p, url: genUrl } : p))
        );

        // Record generation in Memories
        addMemory({
          eventId: activeEvent.id,
          eventName: activeEvent.eventName || 'Background Studio',
          imageUrl: genUrl,
          type: 'background',
          caption: `Background • ${activeBg.name}`
        });

        soundEngine.playAiComplete();
      } else {
        throw new Error(result.message || 'Background replacement failed');
      }
    } catch (err: any) {
      clearInterval(interval);
      setIsProcessing(false);
      console.error('[Background Studio] Generation error:', err);
      setErrorMessage(err.message || 'Unable to connect to LumaBooth server. Please try again.');
    }
  };

  // Navigation handlers
  const handleCancelBack = () => {
    soundEngine.playTap();
    goToGuestStep('ai_fx');
  };

  const handleContinueToShare = () => {
    soundEngine.playSuccessChime();
    goToGuestStep('share');
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

      {/* Dynamic Ambient Background Glow matched to selected environment */}
      <div
        style={{
          position: 'fixed',
          top: '25%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '600px',
          background: activeBg.auraStyle,
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
        {/* Left: ← CANCEL / BACK */}
        <button
          onClick={handleCancelBack}
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
          aria-label="Cancel to AI FX"
        >
          <ArrowLeft size={13} />
          <span>CANCEL</span>
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

        {/* Right: BG STUDIO Status Badge */}
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
          <span>AI BG</span>
        </div>
      </header>

      {/* ===================================================================
          2. MAIN HEADER: "BACKGROUND STUDIO"
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
          BACKGROUND STUDIO
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: isPhone ? '0.8rem' : '0.88rem',
            color: 'var(--luma-text-secondary)',
            margin: 0
          }}
        >
          Put yourself anywhere.
        </p>
      </div>

      {/* ===================================================================
          3. MAIN HERO PHOTO PREVIEW & MATTING VIEWPORT
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
        {/* Photo Display Viewport with Environment Lighting Treatment */}
        <div
          style={{
            width: '100%',
            height: isPhone ? '46vh' : isTablet ? '50vh' : '400px',
            maxHeight: isPhone ? '380px' : '480px',
            position: 'relative',
            borderRadius: isPhone ? '20px' : '26px',
            backgroundColor: '#0D0B1C',
            backgroundImage: activeBg.auraStyle,
            boxShadow: `0 20px 50px rgba(0, 0, 0, 0.85), 0 0 35px ${activeBg.accentColor}33`,
            border: `1px solid ${activeBg.accentColor}55`,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'all 0.35s ease'
          }}
        >
          {/* Active Photo (Original or AI Composite) */}
          <img
            src={currentDisplayedUrl}
            alt={`Photo ${selectedPhotoIndex + 1}`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              display: 'block'
            }}
          />

          {/* Optical Framing Corners (⌜ ⌝ ⌞ ⌟) */}
          <div style={{ position: 'absolute', top: 12, left: 12, width: 16, height: 16, borderTop: '2.5px solid rgba(255, 255, 255, 0.7)', borderLeft: '2.5px solid rgba(255, 255, 255, 0.7)', borderRadius: '3px 0 0 0', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: 12, right: 12, width: 16, height: 16, borderTop: '2.5px solid rgba(255, 255, 255, 0.7)', borderRight: '2.5px solid rgba(255, 255, 255, 0.7)', borderRadius: '0 3px 0 0', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: 12, left: 12, width: 16, height: 16, borderBottom: '2.5px solid rgba(255, 255, 255, 0.7)', borderLeft: '2.5px solid rgba(255, 255, 255, 0.7)', borderRadius: '0 0 0 3px', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: 12, right: 12, width: 16, height: 16, borderBottom: '2.5px solid rgba(255, 255, 255, 0.7)', borderRight: '2.5px solid rgba(255, 255, 255, 0.7)', borderRadius: '0 0 3px 0', pointerEvents: 'none' }} />

          {/* Top Left Badge: [BACKGROUND STUDIO ✦] */}
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
            <span>BACKGROUND STUDIO</span>
          </div>

          {/* Top Right: Before/After Comparison Toggle (If AI generated composite exists) */}
          {currentGeneratedUrl && (
            <div
              style={{
                position: 'absolute',
                top: 14,
                right: 14,
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'rgba(8, 6, 20, 0.88)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                borderRadius: '9999px',
                padding: '2px',
                backdropFilter: 'blur(8px)',
                zIndex: 10
              }}
            >
              <button
                onClick={() => {
                  soundEngine.playTap();
                  setPreviewMode('original');
                }}
                style={{
                  padding: '3px 8px',
                  borderRadius: '9999px',
                  border: 'none',
                  backgroundColor: previewMode === 'original' ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                  color: previewMode === 'original' ? '#FFFFFF' : 'var(--luma-text-secondary)',
                  fontSize: '0.62rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                ORIGINAL
              </button>
              <button
                onClick={() => {
                  soundEngine.playTap();
                  setPreviewMode('generated');
                }}
                style={{
                  padding: '3px 8px',
                  borderRadius: '9999px',
                  border: 'none',
                  backgroundColor: previewMode === 'generated' ? activeBg.accentColor : 'transparent',
                  color: previewMode === 'generated' ? '#080614' : 'var(--luma-text-secondary)',
                  fontSize: '0.62rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                AI RESULT
              </button>
            </div>
          )}

          {/* Bottom Left: Photo Indicator */}
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
            <span style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: (previewMode === 'generated' && isAppliedForCurrent) ? '#00F5D4' : '#06D6A0' }} />
            <span>
              PHOTO 0{selectedPhotoIndex + 1} • {(previewMode === 'generated' && isAppliedForCurrent) ? `AI COMPOSITE (${activeBg.name})` : 'ORIGINAL SUBJECT'}
            </span>
          </div>

          {/* AI Processing Loading Animation with Dynamic Progression Stages */}
          {isProcessing && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(8, 6, 20, 0.85)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                zIndex: 30
              }}
            >
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  backgroundColor: `${activeBg.accentColor}25`,
                  border: `2px solid ${activeBg.accentColor}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: activeBg.accentColor
                }}
              >
                <Wand2 size={24} className="animate-spin" />
              </div>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.84rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '0.06em' }}>
                  {PROCESSING_STAGES[stageIndex]}
                </span>
                <p style={{ margin: '2px 0 0 0', fontSize: '0.72rem', color: 'var(--luma-lavender)' }}>
                  Synthesizing {activeBg.name} environment
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Applied / API Ready Status Banner */}
        {isAppliedForCurrent && (
          <div
            style={{
              width: '100%',
              backgroundColor: 'rgba(9, 8, 23, 0.85)',
              border: '1px solid rgba(0, 245, 212, 0.4)',
              borderRadius: '12px',
              padding: '8px 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '6px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Cpu size={14} color="#00F5D4" />
              <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#FFFFFF' }}>
                AI BACKGROUND APPLIED: {activeBg.name}
              </span>
            </div>
            <span style={{ fontSize: '0.62rem', fontFamily: 'var(--font-mono)', color: '#00F5D4', fontWeight: 800 }}>
              SYNTHESIZED
            </span>
          </div>
        )}

        {/* Real Photo Switcher (Thumbnails) */}
        <div style={{ display: 'flex', gap: '8px', width: '100%', maxWidth: '320px' }}>
          {capturedPhotos.slice(0, 3).map((photo, idx) => {
            const isSelected = selectedPhotoIndex === idx;
            const thumbUrl = photoBackgrounds[idx]?.generatedUrl || originalPhotosRef.current[idx] || photo.url;
            return (
              <button
                key={photo.id || idx}
                onClick={() => handleSwitchPhoto(idx)}
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
                <img src={thumbUrl} alt={`Thumb 0${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', bottom: 1, left: 2, background: 'rgba(8,6,20,0.85)', padding: '1px 4px', borderRadius: '4px', fontSize: '0.55rem', fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#FFF' }}>
                  #{idx + 1}
                </div>
              </button>
            );
          })}
        </div>

        {/* ===================================================================
            4. CATEGORY FILTER & HORIZONTAL SCROLLING BACKGROUND CARDS (12 ENVIRONMENTS)
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
          {/* Category Chips Bar */}
          <div
            style={{
              display: 'flex',
              gap: '6px',
              overflowX: 'auto',
              scrollbarWidth: 'none',
              paddingBottom: '2px'
            }}
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  soundEngine.playTap();
                  setSelectedCategory(cat);
                }}
                style={{
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  border: selectedCategory === cat ? '1px solid #E5487D' : '1px solid rgba(255, 255, 255, 0.12)',
                  backgroundColor: selectedCategory === cat ? 'rgba(229, 72, 125, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                  color: selectedCategory === cat ? '#FFFFFF' : 'var(--luma-text-secondary)',
                  fontSize: '0.64rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'all 0.15s ease'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Cards Carousel */}
          <div
            style={{
              display: 'flex',
              gap: '10px',
              overflowX: 'auto',
              paddingBottom: '4px',
              scrollbarWidth: 'none'
            }}
          >
            {filteredBackgrounds.map((bg) => {
              const isSelected = selectedBgId === bg.id;
              return (
                <button
                  key={bg.id}
                  onClick={() => handleSelectBackground(bg.id)}
                  style={{
                    flex: '0 0 145px',
                    backgroundColor: isSelected ? 'rgba(229, 72, 125, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                    border: isSelected ? `1.5px solid ${bg.accentColor}` : '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '14px',
                    padding: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    boxShadow: isSelected ? `0 0 16px ${bg.accentColor}55` : 'none',
                    transition: 'all 0.18s ease',
                    touchAction: 'manipulation',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* Environment Real Thumbnail Preview */}
                  <div
                    style={{
                      width: '100%',
                      height: '68px',
                      borderRadius: '8px',
                      background: bg.gradient,
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {bg.id === 'none' ? (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', color: '#CBD5E1' }}>
                        <Camera size={20} />
                        <span style={{ fontSize: '0.6rem', fontFamily: 'var(--font-mono)', fontWeight: 800 }}>ORIGINAL</span>
                      </div>
                    ) : (
                      <img
                        src={bg.previewImage}
                        alt={bg.name}
                        loading="lazy"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block'
                        }}
                        onError={(e) => {
                          // Graceful fallback to CSS gradient if image fails
                          (e.currentTarget as HTMLElement).style.display = 'none';
                        }}
                      />
                    )}

                    {/* Selected Checkmark Badge */}
                    {isSelected && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          width: 18,
                          height: 18,
                          borderRadius: '50%',
                          backgroundColor: bg.accentColor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#080614',
                          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.6)'
                        }}
                      >
                        <Check size={11} strokeWidth={3.5} />
                      </div>
                    )}
                  </div>

                  {/* Title & Description */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                    <span style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#FFFFFF' }}>
                      {bg.name}
                    </span>
                    <span style={{ fontSize: '0.58rem', color: isSelected ? '#FFFFFF' : 'var(--luma-text-secondary)', lineHeight: 1.2 }}>
                      {bg.description}
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
        {/* Secondary: CANCEL Button */}
        <button
          onClick={handleCancelBack}
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
          <span>CANCEL</span>
        </button>

        {/* Primary CTA: APPLY BACKGROUND / CONTINUE TO SHARE */}
        <button
          onClick={
            selectedBgId === 'none' || isAppliedForCurrent
              ? handleContinueToShare
              : handleApplyBackground
          }
          disabled={isProcessing}
          style={{
            flex: 1,
            minHeight: isPhone ? '48px' : '52px',
            padding: '0 20px',
            borderRadius: '9999px',
            background:
              selectedBgId === 'none' || isAppliedForCurrent
                ? 'linear-gradient(135deg, #06D6A0 0%, #0096C7 100%)'
                : 'linear-gradient(135deg, #E5487D 0%, #B82E88 45%, #8B3FD1 100%)',
            border: '1px solid rgba(255, 255, 255, 0.35)',
            color: '#FFFFFF',
            fontFamily: 'var(--font-display)',
            fontWeight: 900,
            fontSize: isPhone ? '0.92rem' : '1.05rem',
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
          <span>
            {isProcessing
              ? 'AI PROCESSING...'
              : selectedBgId === 'none'
              ? 'KEEP ORIGINAL & CONTINUE →'
              : isAppliedForCurrent
              ? 'CONTINUE TO SHARE →'
              : `APPLY ${activeBg.name}`}
          </span>
          {!isProcessing && <ArrowRight size={16} strokeWidth={2.5} />}
        </button>
      </footer>
    </div>
  );
};

export default AiBackgroundStudioStep;
