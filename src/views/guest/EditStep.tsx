// src/views/guest/EditStep.tsx
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { soundEngine } from '../../utils/audio';
import { 
  ArrowLeft, 
  RotateCcw, 
  Camera, 
  Check, 
  ArrowRight,
  Sliders,
  Wand2
} from 'lucide-react';

export interface FilterOption {
  id: string;
  name: string;
  css: string;
  previewBg: string;
  description: string;
}

export const EDIT_FILTERS: FilterOption[] = [
  { id: 'original', name: 'ORIGINAL', css: 'none', previewBg: 'linear-gradient(135deg, #4A4A6A 0%, #1A1A2A 100%)', description: 'True to life pure capture' },
  { id: 'bw', name: 'B&W', css: 'grayscale(100%) contrast(140%) brightness(105%)', previewBg: 'linear-gradient(135deg, #888 0%, #111 100%)', description: 'High-contrast monochrome' },
  { id: 'warm', name: 'WARM', css: 'sepia(30%) saturate(140%) brightness(104%)', previewBg: 'linear-gradient(135deg, #F4A261 0%, #E76F51 100%)', description: 'Golden hour sunset radiance' },
  { id: 'cool', name: 'COOL', css: 'contrast(130%) hue-rotate(185deg) saturate(150%)', previewBg: 'linear-gradient(135deg, #00F5D4 0%, #0077B6 100%)', description: 'Editorial neon teal & cyan' },
  { id: 'vintage', name: 'VINTAGE', css: 'sepia(45%) contrast(115%) saturate(120%) brightness(102%)', previewBg: 'linear-gradient(135deg, #D4A373 0%, #463020 100%)', description: 'Analog grain & sepia' },
  { id: 'soft', name: 'SOFT', css: 'brightness(108%) contrast(92%) saturate(115%)', previewBg: 'linear-gradient(135deg, #E9C46A 0%, #F4A261 100%)', description: 'Velvet beauty diffusion' },
  { id: 'vivid', name: 'VIVID', css: 'saturate(165%) contrast(120%) brightness(105%)', previewBg: 'linear-gradient(135deg, #E5487D 0%, #8B3FD1 100%)', description: 'High-impact saturated pop' }
];

export const EditStep: React.FC = () => {
  const { 
    capturedPhotos, 
    photoFilters,
    setPhotoFilters,
    goToGuestStep, 
    isPhone,
    isTablet,
    activeEvent
  } = useApp();

  // Active selected photo index (0, 1, or 2)
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);
  const [showFilterStrip, setShowFilterStrip] = useState<boolean>(false);

  // Helper to resolve CSS filter for a given photo index
  const getFilterCss = (idx: number): string => {
    const filterId = photoFilters?.[idx] || 'original';
    const match = EDIT_FILTERS.find(f => f.id === filterId);
    return match ? match.css : 'none';
  };

  // Helper to get active filter name for selected photo
  const getActiveFilterName = (idx: number): string => {
    const filterId = photoFilters?.[idx] || 'original';
    const match = EDIT_FILTERS.find(f => f.id === filterId);
    return match ? match.name : 'ORIGINAL';
  };

  // Apply filter to selected photo
  const handleApplyFilter = (filterId: string) => {
    soundEngine.playFilterSwitch();
    setPhotoFilters(prev => ({
      ...prev,
      [selectedPhotoIndex]: filterId
    }));
  };

  // Retake selected photo
  const handleRetakeSelectedPhoto = () => {
    soundEngine.playTap();
    goToGuestStep('capture');
  };

  // Navigate to Final Photostrip Generator (Part 11)
  const handleCreateMyStrip = () => {
    soundEngine.playSuccessChime();
    goToGuestStep('photostrip');
  };

  // Navigate back to Booth Capture
  const handleBackToBooth = () => {
    soundEngine.playTap();
    goToGuestStep('capture');
  };

  // Open AI Magic Studio
  const handleOpenAiMagic = () => {
    soundEngine.playTap();
    goToGuestStep('ai_magic');
  };

  // Safe reference to active photo
  const currentPhoto = capturedPhotos[selectedPhotoIndex] || capturedPhotos[0];
  const activeFilterCss = getFilterCss(selectedPhotoIndex);
  const activeFilterName = getActiveFilterName(selectedPhotoIndex);

  // Graceful Empty State if no photos exist
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
          Capture your 3 photos in the booth first.
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
      {/* Background Subtle Radial Purple & Violet Ambient Glow */}
      <div
        style={{
          position: 'fixed',
          top: '20%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '560px',
          height: '560px',
          background: 'radial-gradient(circle, rgba(139, 77, 255, 0.15) 0%, rgba(229, 72, 125, 0.08) 45%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
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
          onClick={handleBackToBooth}
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
          aria-label="Back to Camera"
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

        {/* Right: PHOTO REVIEW & Progress Indicator */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: isPhone ? '4px 10px' : '5px 12px',
            borderRadius: '9999px',
            backgroundColor: 'rgba(229, 72, 125, 0.12)',
            border: '1px solid rgba(229, 72, 125, 0.32)',
            color: '#FFFFFF',
            fontSize: '0.7rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: 800,
            minHeight: '36px'
          }}
        >
          <span style={{ color: '#E5487D' }}>PHOTO REVIEW</span>
          <span style={{ opacity: 0.5 }}>•</span>
          <span>{capturedPhotos.length} / 3</span>
        </div>
      </header>

      {/* ===================================================================
          2. MAIN HEADING: "YOUR MOMENTS"
          =================================================================== */}
      <div
        style={{
          width: '100%',
          maxWidth: '640px',
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
          YOUR MOMENTS
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: isPhone ? '0.82rem' : '0.9rem',
            color: 'var(--event-subtext, var(--luma-text-secondary))',
            margin: 0
          }}
        >
          {activeEvent ? `Your moments from ${activeEvent.eventName}` : '3 shots. Pick your favorites.'}
        </p>
      </div>

      {/* ===================================================================
          3. PROMINENT PHOTO DISPLAY AREA
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
          position: 'relative',
          minHeight: 0
        }}
      >
        {/* Main Photo Rounded Frame */}
        <div
          style={{
            width: '100%',
            height: isPhone ? '46vh' : isTablet ? '52vh' : '400px',
            maxHeight: isPhone ? '390px' : '500px',
            position: 'relative',
            borderRadius: isPhone ? '20px' : '26px',
            backgroundColor: '#0D0B1C',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.85), 0 0 30px rgba(139, 77, 255, 0.15)',
            border: '1px solid rgba(185, 167, 255, 0.22)',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          {/* Currently Selected REAL Captured Photo */}
          <img
            src={currentPhoto.url}
            alt={`Moment #${selectedPhotoIndex + 1}`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              display: 'block',
              filter: activeFilterCss,
              transition: 'filter 0.2s ease'
            }}
          />

          {/* Optical Framing Corners (⌜ ⌝ ⌞ ⌟) */}
          <div style={{ position: 'absolute', top: 12, left: 12, width: 16, height: 16, borderTop: '2.5px solid rgba(255, 255, 255, 0.7)', borderLeft: '2.5px solid rgba(255, 255, 255, 0.7)', borderRadius: '3px 0 0 0', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: 12, right: 12, width: 16, height: 16, borderTop: '2.5px solid rgba(255, 255, 255, 0.7)', borderRight: '2.5px solid rgba(255, 255, 255, 0.7)', borderRadius: '0 3px 0 0', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: 12, left: 12, width: 16, height: 16, borderBottom: '2.5px solid rgba(255, 255, 255, 0.7)', borderLeft: '2.5px solid rgba(255, 255, 255, 0.7)', borderRadius: '0 0 0 3px', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: 12, right: 12, width: 16, height: 16, borderBottom: '2.5px solid rgba(255, 255, 255, 0.7)', borderRight: '2.5px solid rgba(255, 255, 255, 0.7)', borderRadius: '0 0 3px 0', pointerEvents: 'none' }} />

          {/* Top Left: Shot Badge [ #1 / #2 / #3 ] */}
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
              fontSize: '0.72rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)'
            }}
          >
            <span style={{ color: '#E5487D' }}>#{selectedPhotoIndex + 1}</span>
            <span style={{ opacity: 0.7 }}>SELECTED</span>
          </div>

          {/* Top Right: Filter Name & Quick Filter Toggle */}
          <div
            style={{
              position: 'absolute',
              top: 14,
              right: 14,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <button
              onClick={() => {
                soundEngine.playTap();
                setShowFilterStrip(!showFilterStrip);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '4px 10px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(9, 8, 23, 0.85)',
                border: '1px solid rgba(185, 167, 255, 0.3)',
                backdropFilter: 'blur(8px)',
                color: '#FFFFFF',
                fontSize: '0.68rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              <Sliders size={11} color="#E5487D" />
              <span>{activeFilterName}</span>
            </button>

            {/* AI Studio Shortcut */}
            <button
              onClick={handleOpenAiMagic}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 10px',
                borderRadius: '9999px',
                background: 'linear-gradient(135deg, rgba(139, 77, 255, 0.3) 0%, rgba(229, 72, 125, 0.3) 100%)',
                border: '1px solid rgba(185, 167, 255, 0.4)',
                backdropFilter: 'blur(8px)',
                color: '#FFFFFF',
                fontSize: '0.68rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              <Wand2 size={11} color="#E5487D" />
              <span>AI</span>
            </button>
          </div>

          {/* Inline Filter Strip (Quick Overlay) */}
          {showFilterStrip && (
            <div
              style={{
                position: 'absolute',
                bottom: 12,
                left: 12,
                right: 12,
                backgroundColor: 'rgba(9, 8, 23, 0.92)',
                border: '1px solid rgba(185, 167, 255, 0.25)',
                borderRadius: '14px',
                padding: '8px 10px',
                backdropFilter: 'blur(16px)',
                display: 'flex',
                gap: '6px',
                overflowX: 'auto',
                zIndex: 25
              }}
            >
              {EDIT_FILTERS.map((f) => {
                const isSelected = (photoFilters?.[selectedPhotoIndex] || 'original') === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => handleApplyFilter(f.id)}
                    style={{
                      flex: '0 0 auto',
                      padding: '5px 10px',
                      borderRadius: '8px',
                      backgroundColor: isSelected ? 'rgba(229, 72, 125, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                      border: isSelected ? '1px solid #E5487D' : '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#FFFFFF',
                      fontSize: '0.68rem',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {f.name}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ===================================================================
            4. 3 COMPACT THUMBNAILS IN A HORIZONTAL ROW
            =================================================================== */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            alignItems: 'center'
          }}
        >
          <div style={{ display: 'flex', gap: '10px', width: '100%', maxWidth: '380px' }}>
            {[0, 1, 2].map((idx) => {
              const photo = capturedPhotos[idx];
              const isSelected = selectedPhotoIndex === idx;
              const slotFilterCss = getFilterCss(idx);

              return (
                <button
                  key={idx}
                  onClick={() => {
                    if (photo) {
                      soundEngine.playTap();
                      setSelectedPhotoIndex(idx);
                    }
                  }}
                  style={{
                    flex: 1,
                    height: isPhone ? '64px' : '74px',
                    borderRadius: '12px',
                    backgroundColor: photo ? '#120F24' : 'rgba(18, 16, 38, 0.6)',
                    border: isSelected
                      ? '2px solid #E5487D'
                      : photo
                      ? '1.5px solid rgba(255, 255, 255, 0.2)'
                      : '1px dashed rgba(255, 255, 255, 0.2)',
                    boxShadow: isSelected
                      ? '0 0 16px rgba(229, 72, 125, 0.55), 0 4px 12px rgba(0, 0, 0, 0.6)'
                      : 'none',
                    opacity: isSelected ? 1 : 0.65,
                    cursor: photo ? 'pointer' : 'default',
                    position: 'relative',
                    overflow: 'hidden',
                    padding: 0,
                    transition: 'all 0.18s ease',
                    touchAction: 'manipulation'
                  }}
                  title={photo ? `View Moment #${idx + 1}` : `Slot #${idx + 1}`}
                >
                  {photo ? (
                    <>
                      <img
                        src={photo.url}
                        alt={`Thumbnail #${idx + 1}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block',
                          filter: slotFilterCss
                        }}
                      />

                      {/* Number Badge */}
                      <div
                        style={{
                          position: 'absolute',
                          bottom: 3,
                          left: 3,
                          background: 'rgba(8, 6, 20, 0.85)',
                          padding: '1px 5px',
                          borderRadius: '9999px',
                          fontSize: '0.58rem',
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 800,
                          color: '#FFFFFF'
                        }}
                      >
                        #{idx + 1}
                      </div>

                      {/* Selected Checkmark Indicator */}
                      {isSelected && (
                        <div
                          style={{
                            position: 'absolute',
                            top: 3,
                            right: 3,
                            width: 14,
                            height: 14,
                            borderRadius: '50%',
                            backgroundColor: '#E5487D',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#FFFFFF',
                            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.6)'
                          }}
                        >
                          <Check size={9} strokeWidth={3} />
                        </div>
                      )}
                    </>
                  ) : (
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--luma-text-muted)',
                        fontSize: '0.72rem',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 700
                      }}
                    >
                      #{idx + 1}
                    </div>
                  )}
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
          maxWidth: '640px',
          margin: '8px auto 0 auto',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          zIndex: 30,
          position: 'relative',
          flexShrink: 0
        }}
      >
        {/* Secondary: RETAKE Button (replaces only selected photo) */}
        <button
          onClick={handleRetakeSelectedPhoto}
          style={{
            flex: '0 0 auto',
            minHeight: isPhone ? '48px' : '52px',
            padding: isPhone ? '0 16px' : '0 20px',
            borderRadius: '9999px',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            color: '#FFFFFF',
            fontFamily: 'var(--font-mono)',
            fontWeight: 800,
            fontSize: '0.78rem',
            letterSpacing: '0.04em',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.15s ease',
            touchAction: 'manipulation'
          }}
          title={`Retake Photo #${selectedPhotoIndex + 1}`}
        >
          <RotateCcw size={14} color="#E5487D" />
          <span>RETAKE #{selectedPhotoIndex + 1}</span>
        </button>

        {/* Primary: CREATE PHOTO STRIP → */}
        <button
          onClick={handleCreateMyStrip}
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
            boxShadow: '0 8px 24px rgba(229, 72, 125, 0.45)',
            transition: 'all 0.18s ease',
            touchAction: 'manipulation'
          }}
        >
          <span>CREATE PHOTO STRIP</span>
          <ArrowRight size={16} strokeWidth={2.5} />
        </button>
      </footer>
    </div>
  );
};

export default EditStep;
