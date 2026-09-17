// src/views/guest/CaptureStep.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { soundEngine } from '../../utils/audio';
import { 
  Camera, 
  RotateCcw, 
  Zap, 
  ZapOff, 
  ArrowLeft, 
  ArrowRight, 
  X,
  AlertCircle,
  Settings2,
  RefreshCw,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

type CameraState = 'checking' | 'prompt' | 'granted' | 'denied' | 'error';
type FlashSetting = 'auto' | 'on' | 'off';
type TimerDuration = 0 | 3 | 5;

export interface FilterPreset {
  id: string;
  name: string;
  css: string;
  previewBg: string;
}

const FILTERS: FilterPreset[] = [
  { id: 'original', name: 'ORIGINAL', css: 'none', previewBg: 'linear-gradient(135deg, #4A4A6A 0%, #1A1A2A 100%)' },
  { id: 'bw', name: 'B&W', css: 'grayscale(100%) contrast(140%) brightness(105%)', previewBg: 'linear-gradient(135deg, #888 0%, #111 100%)' },
  { id: 'vintage', name: 'VINTAGE', css: 'sepia(45%) contrast(115%) saturate(120%) brightness(102%)', previewBg: 'linear-gradient(135deg, #D4A373 0%, #463020 100%)' },
  { id: 'film', name: 'FILM', css: 'contrast(125%) saturate(135%) brightness(108%)', previewBg: 'linear-gradient(135deg, #E76F51 0%, #264653 100%)' },
  { id: 'warm', name: 'WARM', css: 'sepia(25%) saturate(145%) brightness(104%)', previewBg: 'linear-gradient(135deg, #F4A261 0%, #E76F51 100%)' },
  { id: 'cool', name: 'COOL', css: 'contrast(130%) hue-rotate(185deg) saturate(150%)', previewBg: 'linear-gradient(135deg, #00F5D4 0%, #0077B6 100%)' },
  { id: 'dreamy', name: 'DREAMY', css: 'brightness(112%) contrast(92%) saturate(118%)', previewBg: 'linear-gradient(135deg, #FF9EAA 0%, #A267AC 100%)' }
];

export interface BoothShot {
  id: string;
  url: string;
  index: number;
  filterId: string;
  timestamp: number;
}

export const CaptureStep: React.FC = () => {
  const { goToGuestStep, setCapturedPhotos, isPhone, isTablet, activeEvent, addMemory } = useApp();

  // Camera stream refs & state
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [cameraState, setCameraState] = useState<CameraState>('checking');
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Camera controls & settings
  const [flashSetting, setFlashSetting] = useState<FlashSetting>('auto');
  const [timerDuration, setTimerDuration] = useState<TimerDuration>(3);
  const [qualityMode, setQualityMode] = useState<'high' | 'ultra'>('high');
  const [selectedFilter, setSelectedFilter] = useState<string>('original');
  const [showSettingsSheet, setShowSettingsSheet] = useState<boolean>(false);
  const [showPermissionHelpModal, setShowPermissionHelpModal] = useState<boolean>(false);

  // Photobooth Session State
  const [sessionPhase, setSessionPhase] = useState<'idle' | 'countdown' | 'flashing' | 'toast_pause'>('idle');
  const [currentShotNumber, setCurrentShotNumber] = useState<number>(1);
  const [targetedRetakeSlot, setTargetedRetakeSlot] = useState<number | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [isScreenFlashing, setIsScreenFlashing] = useState<boolean>(false);
  const [capturedShots, setCapturedShots] = useState<BoothShot[]>([]);

  const activeFilterObj = FILTERS.find(f => f.id === selectedFilter) || FILTERS[0];

  // Stop camera stream tracks helper
  const stopCameraStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        try {
          track.stop();
        } catch {
          // ignore
        }
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  // Request real device camera with facingMode
  const requestCamera = useCallback(async (targetFacingMode: 'user' | 'environment' = facingMode) => {
    stopCameraStream();
    setCameraState('checking');
    setErrorMessage('');

    if (!navigator?.mediaDevices?.getUserMedia) {
      setCameraState('error');
      setErrorMessage('Camera access is not supported in this browser environment.');
      return;
    }

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: targetFacingMode,
          width: { ideal: qualityMode === 'ultra' ? 3840 : 1920, min: 640 },
          height: { ideal: qualityMode === 'ultra' ? 2160 : 1080, min: 480 }
        },
        audio: false
      });

      streamRef.current = mediaStream;
      setCameraState('granted');

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(() => {});
        };
      }
    } catch (err: unknown) {
      const error = err as Error;
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        setCameraState('denied');
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        setCameraState('error');
        setErrorMessage('No camera device was detected on your device.');
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        setCameraState('error');
        setErrorMessage('Camera is currently locked by another application.');
      } else {
        setCameraState('denied');
      }
    }
  }, [facingMode, qualityMode, stopCameraStream]);

  // Initial Camera Mount Request
  useEffect(() => {
    requestCamera('user');
    return () => {
      stopCameraStream();
    };
  }, []);

  // Attach Stream when Camera is Granted
  useEffect(() => {
    if (cameraState === 'granted' && streamRef.current && videoRef.current) {
      if (videoRef.current.srcObject !== streamRef.current) {
        videoRef.current.srcObject = streamRef.current;
        videoRef.current.play().catch(() => {});
      }
    }
  }, [cameraState]);

  // Flip Camera (Front / Back)
  const handleFlipCamera = async (targetFacing?: 'user' | 'environment') => {
    soundEngine.playTap();
    const nextFacing = targetFacing || (facingMode === 'user' ? 'environment' : 'user');
    setFacingMode(nextFacing);
    await requestCamera(nextFacing);
  };

  // Toggle Flash Mode
  const handleCycleFlash = () => {
    soundEngine.playTap();
    const next: FlashSetting = flashSetting === 'auto' ? 'on' : flashSetting === 'on' ? 'off' : 'auto';
    setFlashSetting(next);
  };

  // Real Camera Frame Snapshot Capture
  const captureRealFrame = (): string => {
    const video = videoRef.current;
    const canvas = canvasRef.current || document.createElement('canvas');

    if (video && video.videoWidth > 0 && video.videoHeight > 0) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.save();
        // Mirror selfie when using front camera
        if (facingMode === 'user') {
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
        }
        // Apply active CSS filter if present
        if (activeFilterObj.css && activeFilterObj.css !== 'none') {
          ctx.filter = activeFilterObj.css;
        }
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        ctx.restore();
        return canvas.toDataURL('image/jpeg', 0.95);
      }
    }

    return '';
  };

  // Automated 3-Shot Countdown Session or Single Retake
  const triggerShotCountdown = (targetShotNumber: number, isSingleRetake = false) => {
    setCurrentShotNumber(targetShotNumber);
    setSessionPhase('countdown');
    
    // Countdown duration: use timerDuration (or default to 3s if timerDuration is 0 during automated sequence)
    let count = timerDuration === 0 && !isSingleRetake ? 2 : (timerDuration || 3);
    setCountdown(count);
    soundEngine.playCountdownBeep(false);

    const timer = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdown(count);
        soundEngine.playCountdownBeep(false);
      } else {
        clearInterval(timer);
        setCountdown(null);
        soundEngine.playCountdownBeep(true);
        soundEngine.playShutter();

        // Screen Flash burst
        if (flashSetting !== 'off') {
          setIsScreenFlashing(true);
          setTimeout(() => setIsScreenFlashing(false), 220);
        }

        // Capture REAL frame from user camera
        const snapshotUrl = captureRealFrame();
        const newShot: BoothShot = {
          id: `shot_${Date.now()}_${targetShotNumber}`,
          url: snapshotUrl,
          index: targetShotNumber,
          filterId: selectedFilter,
          timestamp: Date.now()
        };

        setCapturedShots(prev => {
          const updated = [...prev];
          const existingIdx = updated.findIndex(s => s.index === targetShotNumber);
          if (existingIdx >= 0) {
            updated[existingIdx] = newShot;
          } else {
            updated.push(newShot);
          }
          const sorted = updated.sort((a, b) => a.index - b.index);
          
          // Update global AppContext with real captured photos
          setCapturedPhotos(sorted.map(s => ({
            id: s.id,
            index: s.index - 1,
            url: s.url,
            timestamp: s.timestamp
          })));

          // Automatically record memory
          addMemory({
            eventId: activeEvent?.id || 'default_event',
            eventName: activeEvent?.eventName || 'LumaBooth Session',
            imageUrl: newShot.url,
            type: 'photobooth',
            caption: activeEvent?.eventName
          });

          return sorted;
        });

        // Encouraging Toast Messages
        const toasts = [
          'Great shot! ✨',
          'Strike a pose! 📸',
          'Looking fabulous! 🌟'
        ];
        const msg = toasts[targetShotNumber - 1] || 'Looking amazing!';
        setToastMessage(msg);
        setSessionPhase('toast_pause');

        // Transition logic
        if (isSingleRetake) {
          setTargetedRetakeSlot(null);
          setTimeout(() => {
            soundEngine.playSuccessChime();
            setSessionPhase('idle');
          }, 1400);
        } else if (targetShotNumber < 3) {
          setTimeout(() => {
            triggerShotCountdown(targetShotNumber + 1, false);
          }, 1800);
        } else {
          // All 3 shots captured -> proceed to Photo Review
          setTimeout(() => {
            soundEngine.playSuccessChime();
            stopCameraStream();
            goToGuestStep('edit');
          }, 1800);
        }
      }
    }, 1000);
  };

  // Primary Shutter Handler
  const handleShutterPress = () => {
    if (sessionPhase !== 'idle') return;
    if (cameraState !== 'granted') {
      requestCamera(facingMode);
      return;
    }

    soundEngine.playTap();

    if (targetedRetakeSlot !== null) {
      // Retake single slot
      triggerShotCountdown(targetedRetakeSlot, true);
    } else {
      // Start full 3-shot session (or continue next uncaptured slot)
      const nextSlot = capturedShots.length >= 3 ? 1 : (capturedShots.length + 1);
      if (capturedShots.length >= 3) {
        setCapturedShots([]);
      }
      triggerShotCountdown(nextSlot, false);
    }
  };

  // Select thumbnail for targeted single retake
  const handleSelectSlotForRetake = (slotNum: number) => {
    soundEngine.playTap();
    if (targetedRetakeSlot === slotNum) {
      setTargetedRetakeSlot(null);
    } else {
      setTargetedRetakeSlot(slotNum);
    }
  };

  // Reset Session
  const handleResetSession = () => {
    soundEngine.playTap();
    setCapturedShots([]);
    setTargetedRetakeSlot(null);
    setCurrentShotNumber(1);
    setSessionPhase('idle');
  };

  // Back Navigation & Stream Cleanup
  const handleBackToExperiences = () => {
    soundEngine.playTap();
    stopCameraStream();
    goToGuestStep('experiences');
  };

  // Guide Status Message helper
  const getGuidanceMessage = (): string => {
    if (sessionPhase === 'countdown' || sessionPhase === 'flashing') {
      return 'CAPTURING...';
    }
    if (targetedRetakeSlot !== null) {
      return `TAP SHUTTER TO RETAKE #${targetedRetakeSlot}`;
    }
    if (cameraState === 'granted') {
      if (capturedShots.length === 0) return 'POSITION YOURSELF';
      if (capturedShots.length < 3) return 'READY WHEN YOU ARE';
      return 'ALL 3 SHOTS READY';
    }
    return 'CONNECTING CAMERA...';
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
        overflow: 'hidden',
        boxSizing: 'border-box',
        userSelect: 'none',
        paddingTop: isPhone ? 'max(8px, env(safe-area-inset-top))' : '12px',
        paddingBottom: isPhone ? 'max(10px, env(safe-area-inset-bottom))' : '16px',
        paddingLeft: isPhone ? '10px' : isTablet ? '16px' : '24px',
        paddingRight: isPhone ? '10px' : isTablet ? '16px' : '24px'
      }}
    >
      {/* Hidden Snapshot Canvas */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Shutter White Screen Flash Overlay */}
      {isScreenFlashing && <div className="animate-camera-flash" />}

      {/* ===================================================================
          1. TOP NAVIGATION BAR (← BACK | LOGO | STATUS)
          =================================================================== */}
      <header
        style={{
          width: '100%',
          maxWidth: '720px',
          margin: '0 auto 8px auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 30,
          position: 'relative',
          height: '40px',
          flexShrink: 0
        }}
      >
        {/* Left: ← BACK */}
        <button
          onClick={handleBackToExperiences}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.14)',
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
          aria-label="Back to Experiences"
        >
          <ArrowLeft size={13} />
          <span>BACK</span>
        </button>

        {/* Center: Real LumaBooth PNG Logo */}
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
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5)'
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

        {/* Right: Proceed / Edit Shortcut if shots exist */}
        {capturedShots.length > 0 ? (
          <button
            onClick={() => {
              soundEngine.playTap();
              stopCameraStream();
              goToGuestStep('edit');
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: isPhone ? '5px 12px' : '6px 14px',
              borderRadius: '9999px',
              background: 'linear-gradient(135deg, #E5487D 0%, #8B3FD1 100%)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: '#FFFFFF',
              fontSize: '0.74rem',
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 0 12px rgba(229, 72, 125, 0.4)',
              minHeight: '36px'
            }}
          >
            <span>REVIEW</span>
            <ArrowRight size={13} />
          </button>
        ) : activeEvent ? (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: isPhone ? '4px 10px' : '5px 12px',
              borderRadius: '9999px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid var(--event-primary, rgba(229, 72, 125, 0.4))',
              color: 'var(--event-primary, #E5487D)',
              fontSize: '0.68rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 800,
              maxWidth: isPhone ? '140px' : '220px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              boxShadow: '0 0 10px var(--event-glow, rgba(229, 72, 125, 0.2))'
            }}
          >
            <Sparkles size={11} color="var(--event-primary, #E5487D)" style={{ flexShrink: 0 }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {activeEvent.eventName}
            </span>
          </div>
        ) : (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 10px',
              borderRadius: '9999px',
              background: 'rgba(229, 72, 125, 0.12)',
              border: '1px solid rgba(229, 72, 125, 0.3)',
              color: '#E5487D',
              fontSize: '0.68rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 800
            }}
          >
            <Camera size={11} />
            <span>LIVE BOOTH</span>
          </div>
        )}
      </header>

      {/* ===================================================================
          2. MAIN CAMERA VIEWPORT (60–68vh Phone, 65–72vh Tablet)
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
          justifyContent: 'space-between',
          position: 'relative',
          minHeight: 0
        }}
      >
        {/* Camera Container */}
        <div
          style={{
            width: '100%',
            height: isPhone ? '62vh' : isTablet ? '68vh' : 'calc(100vh - 200px)',
            maxHeight: isPhone ? '520px' : '620px',
            position: 'relative',
            borderRadius: isPhone ? '24px' : '30px',
            overflow: 'hidden',
            backgroundColor: '#0B0A18',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.85), inset 0 0 24px rgba(139, 77, 255, 0.18)',
            border: '1px solid rgba(185, 167, 255, 0.22)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          {/* Real Live HTMLVideoElement Feed */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: facingMode === 'user' ? 'scaleX(-1)' : 'none',
              filter: activeFilterObj.css,
              display: cameraState === 'granted' ? 'block' : 'none'
            }}
          />

          {/* Camera Frame Guidance Corner Brackets (⌜ ⌝ ⌞ ⌟) */}
          <div style={{ position: 'absolute', top: 14, left: 14, width: 16, height: 16, borderTop: '2.5px solid rgba(255, 255, 255, 0.75)', borderLeft: '2.5px solid rgba(255, 255, 255, 0.75)', borderRadius: '3px 0 0 0', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: 14, right: 14, width: 16, height: 16, borderTop: '2.5px solid rgba(255, 255, 255, 0.75)', borderRight: '2.5px solid rgba(255, 255, 255, 0.75)', borderRadius: '0 3px 0 0', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: 14, left: 14, width: 16, height: 16, borderBottom: '2.5px solid rgba(255, 255, 255, 0.75)', borderLeft: '2.5px solid rgba(255, 255, 255, 0.75)', borderRadius: '0 0 0 3px', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: 14, right: 14, width: 16, height: 16, borderBottom: '2.5px solid rgba(255, 255, 255, 0.75)', borderRight: '2.5px solid rgba(255, 255, 255, 0.75)', borderRadius: '0 0 3px 0', pointerEvents: 'none' }} />

          {/* ===============================================================
              FLOATING CAMERA OVERLAYS (Minimal Glass)
              =============================================================== */}
          {cameraState === 'granted' && (
            <div
              style={{
                position: 'absolute',
                top: 14,
                left: 14,
                right: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                zIndex: 25,
                pointerEvents: 'auto'
              }}
            >
              {/* TOP LEFT: Small Glass Pill [⚡ FLASH AUTO/ON/OFF] */}
              <button
                onClick={handleCycleFlash}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '5px 11px',
                  borderRadius: '9999px',
                  backgroundColor: 'rgba(9, 8, 23, 0.75)',
                  border: '1px solid rgba(185, 167, 255, 0.25)',
                  backdropFilter: 'blur(10px)',
                  color: flashSetting === 'off' ? 'var(--luma-text-muted)' : '#FFB703',
                  fontSize: '0.68rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
                  transition: 'all 0.15s ease',
                  touchAction: 'manipulation'
                }}
                title={`Flash: ${flashSetting.toUpperCase()}`}
              >
                {flashSetting === 'off' ? <ZapOff size={13} /> : <Zap size={13} />}
                <span>FLASH {flashSetting.toUpperCase()}</span>
              </button>

              {/* TOP CENTER: PHOTO 1 / 3 Indicator */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 12px',
                  borderRadius: '9999px',
                  backgroundColor: 'rgba(9, 8, 23, 0.8)',
                  border: '1px solid rgba(229, 72, 125, 0.35)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.5)'
                }}
              >
                <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#FFFFFF' }}>
                  {targetedRetakeSlot !== null ? `RETAKE #${targetedRetakeSlot}` : `PHOTO ${currentShotNumber} / 3`}
                </span>
              </div>

              {/* TOP RIGHT: Circular Buttons [↻ Retake/Reset] and [☷ Camera Settings] */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button
                  onClick={handleResetSession}
                  className="luma-cam-ctrl-btn"
                  style={{ width: '38px', height: '38px' }}
                  title="Reset Photo Session"
                  aria-label="Reset Photos"
                >
                  <RotateCcw size={15} />
                </button>

                <button
                  onClick={() => {
                    soundEngine.playTap();
                    setShowSettingsSheet(true);
                  }}
                  className="luma-cam-ctrl-btn"
                  style={{ width: '38px', height: '38px' }}
                  title="Camera Settings"
                  aria-label="Camera Settings"
                >
                  <Settings2 size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Bottom Dynamic Guidance Message Pill */}
          {cameraState === 'granted' && (
            <div
              style={{
                position: 'absolute',
                bottom: 16,
                padding: '5px 16px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(9, 8, 23, 0.85)',
                border: '1px solid rgba(185, 167, 255, 0.22)',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                zIndex: 20,
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.6)'
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  letterSpacing: '0.06em',
                  color: targetedRetakeSlot !== null ? '#E5487D' : 'var(--luma-lavender)'
                }}
              >
                {getGuidanceMessage()}
              </span>
            </div>
          )}

          {/* Centered Cinematic Countdown (3, 2, 1) */}
          {sessionPhase === 'countdown' && countdown !== null && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(9, 8, 23, 0.35)',
                backdropFilter: 'blur(3px)',
                zIndex: 35
              }}
            >
              <div
                key={countdown}
                className="animate-countdown-number"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(5.5rem, 18vw, 8rem)',
                  fontWeight: 900,
                  color: '#FFFFFF',
                  textShadow: '0 0 40px rgba(229, 72, 125, 0.9), 0 4px 20px rgba(0, 0, 0, 0.8)',
                  lineHeight: 1
                }}
              >
                {countdown}
              </div>
            </div>
          )}

          {/* Toast Message Bubble after Capture */}
          {sessionPhase === 'toast_pause' && toastMessage && (
            <div
              style={{
                position: 'absolute',
                top: '45%',
                zIndex: 35
              }}
              className="animate-toast-pop"
            >
              <div
                style={{
                  backgroundColor: 'rgba(9, 8, 23, 0.92)',
                  border: '1.5px solid rgba(229, 72, 125, 0.6)',
                  padding: '8px 24px',
                  borderRadius: '9999px',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: isPhone ? '1.05rem' : '1.25rem',
                  color: '#FFFFFF',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.7), 0 0 25px rgba(229, 72, 125, 0.4)',
                  backdropFilter: 'blur(12px)'
                }}
              >
                {toastMessage}
              </div>
            </div>
          )}

          {/* Camera Permission Needed / Denied State */}
          {(cameraState === 'denied' || cameraState === 'prompt') && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '24px 18px',
                gap: '14px',
                maxWidth: '360px',
                zIndex: 30
              }}
            >
              <div
                style={{
                  width: '58px',
                  height: '58px',
                  borderRadius: '50%',
                  background: 'rgba(229, 72, 125, 0.15)',
                  border: '1px solid rgba(229, 72, 125, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#E5487D',
                  boxShadow: '0 0 24px rgba(229, 72, 125, 0.25)'
                }}
              >
                <Camera size={26} />
              </div>

              <div>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.25rem',
                    fontWeight: 900,
                    color: '#FFFFFF',
                    letterSpacing: '0.02em',
                    margin: 0
                  }}
                >
                  CAMERA ACCESS NEEDED
                </h3>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.84rem',
                    color: 'var(--luma-text-secondary)',
                    margin: '6px 0 0 0'
                  }}
                >
                  Allow camera access to start your photobooth.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '8px', width: '100%', marginTop: '4px' }}>
                <button
                  onClick={() => requestCamera(facingMode)}
                  style={{
                    flex: 1,
                    background: 'linear-gradient(135deg, #E5487D 0%, #8B3FD1 100%)',
                    color: '#FFFFFF',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    padding: '11px 18px',
                    borderRadius: '9999px',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 800,
                    fontSize: '0.84rem',
                    cursor: 'pointer',
                    boxShadow: '0 8px 20px rgba(229, 72, 125, 0.45)',
                    touchAction: 'manipulation'
                  }}
                >
                  TRY AGAIN
                </button>

                <button
                  onClick={() => setShowPermissionHelpModal(true)}
                  style={{
                    flex: 1,
                    background: 'rgba(255, 255, 255, 0.08)',
                    color: '#FFFFFF',
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                    padding: '11px 14px',
                    borderRadius: '9999px',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    fontSize: '0.74rem',
                    cursor: 'pointer',
                    touchAction: 'manipulation'
                  }}
                >
                  HELP
                </button>
              </div>
            </div>
          )}

          {/* Camera Error State */}
          {cameraState === 'error' && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '24px 18px',
                gap: '12px',
                maxWidth: '360px',
                zIndex: 30
              }}
            >
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  background: 'rgba(232, 62, 122, 0.15)',
                  border: '1px solid rgba(232, 62, 122, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#E5487D'
                }}
              >
                <AlertCircle size={24} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
                Camera Unavailable
              </h3>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--luma-text-secondary)', margin: 0 }}>
                {errorMessage || "We couldn't connect to a camera on this device."}
              </p>
              <button
                onClick={() => requestCamera(facingMode)}
                style={{
                  background: 'linear-gradient(135deg, #E5487D 0%, #8B3FD1 100%)',
                  color: '#FFFFFF',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  padding: '10px 24px',
                  borderRadius: '9999px',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: '0.84rem',
                  cursor: 'pointer'
                }}
              >
                TRY AGAIN
              </button>
            </div>
          )}
        </div>

        {/* ===================================================================
            3. CAPTURED THUMBNAIL ROW & PROGRESS ([ #1 ] [ #2 ] [ #3 ])
            =================================================================== */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            marginTop: '8px',
            marginBottom: '4px'
          }}
        >
          {/* Progress Indicators & Label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span 
              key={capturedShots.length}
              className="animate-counter-pulse"
              style={{ fontSize: '0.66rem', fontFamily: 'var(--font-mono)', color: 'var(--luma-lavender)', fontWeight: 800 }}
            >
              PHOTO {capturedShots.length} / 3
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              {[1, 2, 3].map((num) => {
                const isFilled = capturedShots.some(s => s.index === num);
                const isCurrent = currentShotNumber === num && sessionPhase !== 'idle';
                return (
                  <div
                    key={num}
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: isFilled ? '#E5487D' : isCurrent ? '#8B3FD1' : 'rgba(255, 255, 255, 0.2)',
                      boxShadow: isFilled || isCurrent ? '0 0 6px rgba(229, 72, 125, 0.6)' : 'none',
                      transition: 'all 0.2s ease'
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* 3 Real Captured Thumbnail Slots */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {[1, 2, 3].map((slotIdx) => {
              const shot = capturedShots.find(s => s.index === slotIdx);
              const isTargetedForRetake = targetedRetakeSlot === slotIdx;

              return (
                <button
                  key={slotIdx}
                  onClick={() => shot && handleSelectSlotForRetake(slotIdx)}
                  style={{
                    width: isPhone ? '52px' : '62px',
                    height: isPhone ? '62px' : '74px',
                    borderRadius: '10px',
                    backgroundColor: shot ? '#120F24' : 'rgba(18, 16, 38, 0.6)',
                    border: isTargetedForRetake
                      ? '2px solid #E5487D'
                      : shot
                      ? '1.5px solid rgba(255, 255, 255, 0.25)'
                      : '1px dashed rgba(255, 255, 255, 0.25)',
                    boxShadow: isTargetedForRetake
                      ? '0 0 16px rgba(229, 72, 125, 0.6)'
                      : '0 4px 12px rgba(0, 0, 0, 0.5)',
                    position: 'relative',
                    overflow: 'hidden',
                    cursor: shot ? 'pointer' : 'default',
                    padding: 0,
                    transition: 'all 0.18s ease',
                    touchAction: 'manipulation'
                  }}
                  title={shot ? `Tap to Retake #${slotIdx}` : `Slot #${slotIdx}`}
                >
                  {shot ? (
                    <>
                      <img
                        key={shot.url}
                        className="animate-thumb-in"
                        src={shot.url}
                        alt={`Captured #${slotIdx}`}
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
                          bottom: 2,
                          left: 3,
                          background: 'rgba(8, 6, 20, 0.85)',
                          padding: '1px 4px',
                          borderRadius: '9999px',
                          fontSize: '0.56rem',
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 800,
                          color: '#FFFFFF'
                        }}
                      >
                        #{slotIdx}
                      </div>
                      {isTargetedForRetake && (
                        <div
                          style={{
                            position: 'absolute',
                            top: 2,
                            right: 2,
                            background: '#E5487D',
                            width: 14,
                            height: 14,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#FFFFFF'
                          }}
                        >
                          <RefreshCw size={9} />
                        </div>
                      )}
                    </>
                  ) : (
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '2px',
                        color: 'var(--luma-text-muted)'
                      }}
                    >
                      <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                        #{slotIdx}
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ===================================================================
            4. SHUTTER TRIGGER BUTTON (Bottom Center)
            =================================================================== */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4px 0',
            zIndex: 25
          }}
        >
          <button
            onClick={handleShutterPress}
            disabled={sessionPhase !== 'idle' && cameraState === 'granted'}
            className="luma-shutter-btn"
            style={{
              width: isPhone ? '76px' : '86px',
              height: isPhone ? '76px' : '86px',
              opacity: sessionPhase !== 'idle' ? 0.6 : 1,
              boxShadow: targetedRetakeSlot !== null 
                ? '0 0 32px rgba(229, 72, 125, 0.75), 0 10px 28px rgba(0, 0, 0, 0.7)' 
                : undefined
            }}
            aria-label="Capture Photo"
          >
            <div className="luma-shutter-btn-inner">
              {targetedRetakeSlot !== null ? (
                <RefreshCw size={isPhone ? 26 : 30} color="#FFFFFF" strokeWidth={2.4} />
              ) : (
                <Camera size={isPhone ? 28 : 32} color="#FFFFFF" strokeWidth={2.4} />
              )}
            </div>
          </button>
        </div>
      </main>

      {/* ===================================================================
          5. CAMERA SETTINGS MOBILE BOTTOM SHEET
          =================================================================== */}
      {showSettingsSheet && (
        <div
          onClick={() => setShowSettingsSheet(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(8, 6, 20, 0.75)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            zIndex: 100
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="animate-bottom-sheet"
            style={{
              width: '100%',
              maxWidth: '520px',
              backgroundColor: '#120F24',
              borderTop: '1.5px solid rgba(185, 167, 255, 0.25)',
              borderRadius: '26px 26px 0 0',
              padding: isPhone ? '18px 18px 24px 18px' : '22px 24px 30px 24px',
              boxShadow: '0 -16px 45px rgba(0, 0, 0, 0.9), 0 0 30px rgba(139, 77, 255, 0.2)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            {/* Sheet Handle Bar */}
            <div
              style={{
                width: '40px',
                height: '4px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(255, 255, 255, 0.25)',
                margin: '0 auto -4px auto'
              }}
            />

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Settings2 size={18} color="#E5487D" />
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
                  Camera Settings
                </h3>
              </div>
              <button
                onClick={() => setShowSettingsSheet(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--luma-text-muted)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Setting: FLASH (Auto / On / Off) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--luma-lavender)', fontWeight: 800 }}>
                FLASH
              </span>
              <div style={{ display: 'flex', gap: '6px' }}>
                {(['auto', 'on', 'off'] as FlashSetting[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFlashSetting(f)}
                    style={{
                      flex: 1,
                      minHeight: '40px',
                      borderRadius: '10px',
                      backgroundColor: flashSetting === f ? 'rgba(229, 72, 125, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                      border: flashSetting === f ? '1.5px solid #E5487D' : '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#FFFFFF',
                      fontSize: '0.78rem',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 800,
                      cursor: 'pointer',
                      textTransform: 'uppercase'
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Setting: CAMERA (Front / Back) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--luma-lavender)', fontWeight: 800 }}>
                CAMERA
              </span>
              <div style={{ display: 'flex', gap: '6px' }}>
                {[
                  { id: 'user', label: 'Front Camera' },
                  { id: 'environment', label: 'Back Camera' }
                ].map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleFlipCamera(c.id as any)}
                    style={{
                      flex: 1,
                      minHeight: '40px',
                      borderRadius: '10px',
                      backgroundColor: facingMode === c.id ? 'rgba(229, 72, 125, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                      border: facingMode === c.id ? '1.5px solid #E5487D' : '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#FFFFFF',
                      fontSize: '0.78rem',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Setting: TIMER (Off / 3 sec / 5 sec) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--luma-lavender)', fontWeight: 800 }}>
                TIMER
              </span>
              <div style={{ display: 'flex', gap: '6px' }}>
                {[
                  { id: 0, label: 'Off' },
                  { id: 3, label: '3 sec' },
                  { id: 5, label: '5 sec' }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTimerDuration(t.id as any)}
                    style={{
                      flex: 1,
                      minHeight: '40px',
                      borderRadius: '10px',
                      backgroundColor: timerDuration === t.id ? 'rgba(229, 72, 125, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                      border: timerDuration === t.id ? '1.5px solid #E5487D' : '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#FFFFFF',
                      fontSize: '0.78rem',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Setting: QUALITY (High / Ultra) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--luma-lavender)', fontWeight: 800 }}>
                QUALITY
              </span>
              <div style={{ display: 'flex', gap: '6px' }}>
                {[
                  { id: 'high', label: 'High (1080p)' },
                  { id: 'ultra', label: 'Ultra HD (4K)' }
                ].map((q) => (
                  <button
                    key={q.id}
                    onClick={() => setQualityMode(q.id as any)}
                    style={{
                      flex: 1,
                      minHeight: '40px',
                      borderRadius: '10px',
                      backgroundColor: qualityMode === q.id ? 'rgba(229, 72, 125, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                      border: qualityMode === q.id ? '1.5px solid #E5487D' : '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#FFFFFF',
                      fontSize: '0.78rem',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    {q.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Setting: FILTERS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--luma-lavender)', fontWeight: 800 }}>
                PHOTOBOOTH FILTER
              </span>
              <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
                {FILTERS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => {
                      soundEngine.playFilterSwitch();
                      setSelectedFilter(f.id);
                    }}
                    style={{
                      flex: '0 0 auto',
                      padding: '8px 12px',
                      borderRadius: '10px',
                      backgroundColor: selectedFilter === f.id ? 'rgba(229, 72, 125, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                      border: selectedFilter === f.id ? '1.5px solid #E5487D' : '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#FFFFFF',
                      fontSize: '0.74rem',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    {f.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowSettingsSheet(false)}
              style={{
                width: '100%',
                minHeight: '44px',
                background: 'linear-gradient(135deg, #E5487D 0%, #8B3FD1 100%)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '12px',
                color: '#FFFFFF',
                fontFamily: 'var(--font-display)',
                fontWeight: 900,
                fontSize: '0.88rem',
                cursor: 'pointer',
                marginTop: '4px'
              }}
            >
              DONE
            </button>
          </div>
        </div>
      )}

      {/* ===================================================================
          6. CAMERA PERMISSION HELP MODAL
          =================================================================== */}
      {showPermissionHelpModal && (
        <div
          onClick={() => setShowPermissionHelpModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(8, 6, 20, 0.8)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            zIndex: 100
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '400px',
              backgroundColor: '#120F24',
              border: '1.5px solid rgba(185, 167, 255, 0.25)',
              borderRadius: '24px',
              padding: '24px',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.9)',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={20} color="#E5487D" />
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
                  Camera Permission Guide
                </h3>
              </div>
              <button
                onClick={() => setShowPermissionHelpModal(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--luma-text-muted)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.84rem', color: 'var(--luma-text-secondary)', margin: 0, lineHeight: 1.4 }}>
              To enable camera capture in your browser:
            </p>

            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.8rem', color: 'var(--luma-lavender)', lineHeight: 1.5 }}>
              <li>Look for the lock/camera icon in your browser URL bar.</li>
              <li>Tap "Site Settings" or "Permissions".</li>
              <li>Set Camera to <strong>Allow</strong>.</li>
              <li>Tap "TRY AGAIN" below.</li>
            </ul>

            <button
              onClick={() => {
                setShowPermissionHelpModal(false);
                requestCamera(facingMode);
              }}
              style={{
                width: '100%',
                minHeight: '44px',
                background: 'linear-gradient(135deg, #E5487D 0%, #8B3FD1 100%)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '9999px',
                color: '#FFFFFF',
                fontFamily: 'var(--font-display)',
                fontWeight: 900,
                fontSize: '0.88rem',
                cursor: 'pointer',
                marginTop: '6px'
              }}
            >
              TRY AGAIN
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaptureStep;
