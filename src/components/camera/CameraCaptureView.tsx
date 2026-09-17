// src/components/camera/CameraCaptureView.tsx
import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef, useCallback } from 'react';
import { Camera, RefreshCw, AlertCircle } from 'lucide-react';
import { soundEngine } from '../../utils/audio';

export interface CameraCaptureHandle {
  snapPhoto: () => Promise<string | null>;
  isReady: boolean;
}

interface CameraCaptureViewProps {
  facingMode?: 'user' | 'environment';
  onCameraReady?: () => void;
  aspectRatio?: string;
  borderRadius?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export const CameraCaptureView = forwardRef<CameraCaptureHandle, CameraCaptureViewProps>(({
  facingMode = 'user',
  onCameraReady,
  borderRadius = '22px',
  style,
  children
}, ref) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [cameraState, setCameraState] = useState<'checking' | 'granted' | 'denied' | 'error'>('checking');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isFlashing, setIsFlashing] = useState<boolean>(false);

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

  const requestCamera = useCallback(async () => {
    stopCameraStream();
    setCameraState('checking');
    setErrorMessage('');

    if (!navigator?.mediaDevices?.getUserMedia) {
      setCameraState('error');
      setErrorMessage('Your browser or device does not support camera capture.');
      return;
    }

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1920, min: 640 },
          height: { ideal: 1080, min: 480 }
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setCameraState('granted');
      onCameraReady?.();
    } catch (err: any) {
      console.error('Camera access failed:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraState('denied');
        setErrorMessage('Camera access was denied. Please allow camera permissions in your browser settings and try again.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraState('error');
        setErrorMessage('No camera device found on this system.');
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        setCameraState('error');
        setErrorMessage('Camera is currently in use by another application.');
      } else {
        setCameraState('error');
        setErrorMessage('Camera could not be started. Please check permissions and try again.');
      }
    }
  }, [facingMode, onCameraReady, stopCameraStream]);

  useEffect(() => {
    requestCamera();
    return () => {
      stopCameraStream();
    };
  }, [requestCamera, stopCameraStream]);

  // Snap high-resolution photo from video feed
  const snapPhoto = useCallback(async (): Promise<string | null> => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState < 2) return null;

    soundEngine.playShutter();
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 250);

    const vWidth = video.videoWidth || 1280;
    const vHeight = video.videoHeight || 720;

    canvas.width = vWidth;
    canvas.height = vHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.save();
    // Mirror horizontally for user facing camera
    if (facingMode === 'user') {
      ctx.translate(vWidth, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, vWidth, vHeight);
    ctx.restore();

    return canvas.toDataURL('image/jpeg', 0.95);
  }, [facingMode]);

  useImperativeHandle(ref, () => ({
    snapPhoto,
    isReady: cameraState === 'granted'
  }), [snapPhoto, cameraState]);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        borderRadius: borderRadius,
        overflow: 'hidden',
        backgroundColor: '#080614',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.85), 0 0 30px rgba(139, 77, 255, 0.15)',
        border: '1px solid rgba(185, 167, 255, 0.22)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style
      }}
    >
      {/* Hidden processing canvas */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Live Video Element */}
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
          display: cameraState === 'granted' ? 'block' : 'none'
        }}
      />

      {/* Flash Burst Animation Overlay */}
      {isFlashing && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: '#FFFFFF',
            zIndex: 99,
            pointerEvents: 'none',
            animation: 'fadeIn 0.15s ease-out'
          }}
        />
      )}

      {/* Optical Corner Brackets (⌜ ⌝ ⌞ ⌟) */}
      <div style={{ position: 'absolute', top: 12, left: 12, width: 18, height: 18, borderTop: '2.5px solid rgba(255, 255, 255, 0.7)', borderLeft: '2.5px solid rgba(255, 255, 255, 0.7)', borderRadius: '3px 0 0 0', pointerEvents: 'none', zIndex: 10 }} />
      <div style={{ position: 'absolute', top: 12, right: 12, width: 18, height: 18, borderTop: '2.5px solid rgba(255, 255, 255, 0.7)', borderRight: '2.5px solid rgba(255, 255, 255, 0.7)', borderRadius: '0 3px 0 0', pointerEvents: 'none', zIndex: 10 }} />
      <div style={{ position: 'absolute', bottom: 12, left: 12, width: 18, height: 18, borderBottom: '2.5px solid rgba(255, 255, 255, 0.7)', borderLeft: '2.5px solid rgba(255, 255, 255, 0.7)', borderRadius: '0 0 0 3px', pointerEvents: 'none', zIndex: 10 }} />
      <div style={{ position: 'absolute', bottom: 12, right: 12, width: 18, height: 18, borderBottom: '2.5px solid rgba(255, 255, 255, 0.7)', borderRight: '2.5px solid rgba(255, 255, 255, 0.7)', borderRadius: '0 0 3px 0', pointerEvents: 'none', zIndex: 10 }} />

      {/* Checking Camera Spinner */}
      {cameraState === 'checking' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', color: 'var(--luma-lavender)' }}>
          <RefreshCw size={28} className="animate-spin" color="#E5487D" />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', fontWeight: 700 }}>
            CONNECTING DEVICE CAMERA...
          </span>
        </div>
      )}

      {/* Error / Permission Denied State (Zero Fake Silently Replaced Images) */}
      {(cameraState === 'denied' || cameraState === 'error') && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            padding: '24px',
            backgroundColor: 'rgba(8, 6, 20, 0.95)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            zIndex: 30
          }}
        >
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              backgroundColor: 'rgba(229, 72, 125, 0.15)',
              border: '1.5px solid #E5487D',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#E5487D',
              marginBottom: '12px'
            }}
          >
            <AlertCircle size={26} />
          </div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 900, color: '#FFFFFF', margin: '0 0 6px 0' }}>
            CAMERA UNAVAILABLE
          </h3>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--luma-text-secondary)', maxWidth: '280px', margin: '0 0 16px 0', lineHeight: 1.4 }}>
            {errorMessage || 'Please allow camera access in your browser and try again.'}
          </p>
          <button
            onClick={() => requestCamera()}
            style={{
              padding: '10px 24px',
              borderRadius: '9999px',
              background: 'linear-gradient(135deg, #E5487D 0%, #8B3FD1 100%)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: '#FFFFFF',
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Camera size={14} />
            <span>TRY AGAIN</span>
          </button>
        </div>
      )}

      {/* Embedded Children / Overlays */}
      {children}
    </div>
  );
});

export default CameraCaptureView;
