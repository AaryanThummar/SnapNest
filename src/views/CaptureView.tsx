import React, { useState } from 'react';
import { useBooth } from '../context/BoothContext';
import { 
  MOCK_CANDID_POSES, 
  AROUND_WORLD_DESTINATIONS 
} from '../utils/constants';
import { 
  Camera, 
  FlipHorizontal, 
  Clock, 
  Sparkles, 
  Check 
} from 'lucide-react';
import { soundEngine } from '../utils/audio';

export const CaptureView: React.FC = () => {
  const { 
    selectedExperience, 
    capturedShots, 
    currentShotIndex, 
    totalShotsNeeded, 
    isCapturing, 
    countdownValue, 
    isFlashing, 
    startCaptureSequence, 
    eventConfig, 
    updateEventConfig,
    activeBattlePrompt,
    activeDestination,
    setActiveDestination
  } = useBooth();

  const [showGrid, setShowGrid] = useState<boolean>(false);

  const currentPoseUrl = MOCK_CANDID_POSES[currentShotIndex % MOCK_CANDID_POSES.length];

  const handleStartCapture = () => {
    soundEngine.playTap();
    startCaptureSequence();
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'clamp(10px, 2vh, 16px) clamp(14px, 3vw, 36px)',
        overflow: 'hidden',
        userSelect: 'none'
      }}
    >
      {/* Flash Effect Overlay */}
      {isFlashing && (
        <div
          className="animate-flash"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            pointerEvents: 'none'
          }}
        />
      )}

      {/* Top Camera Utilities Toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          maxWidth: '960px',
          gap: '8px'
        }}
      >
        {/* Left Toggles */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <button
            disabled={isCapturing}
            onClick={() => {
              soundEngine.playTap();
              updateEventConfig({ mirrorCamera: !eventConfig.mirrorCamera });
            }}
            className="kiosk-btn"
            style={{
              padding: '6px 10px',
              fontSize: '11px',
              backgroundColor: eventConfig.mirrorCamera ? 'var(--bg-surface-subtle)' : 'var(--bg-surface-elevated)'
            }}
          >
            <FlipHorizontal size={13} color={eventConfig.mirrorCamera ? 'var(--accent-cyan)' : 'var(--text-muted)'} />
            <span className="hidden sm:inline">Mirror:</span> {eventConfig.mirrorCamera ? 'ON' : 'OFF'}
          </button>

          <button
            disabled={isCapturing}
            onClick={() => {
              soundEngine.playTap();
              updateEventConfig({ beautyFilterEnabled: !eventConfig.beautyFilterEnabled });
            }}
            className="kiosk-btn"
            style={{
              padding: '6px 10px',
              fontSize: '11px',
              backgroundColor: eventConfig.beautyFilterEnabled ? 'var(--bg-surface-subtle)' : 'var(--bg-surface-elevated)'
            }}
          >
            <Sparkles size={13} color={eventConfig.beautyFilterEnabled ? 'var(--accent-gold)' : 'var(--text-muted)'} />
            <span className="hidden sm:inline">Beauty:</span> {eventConfig.beautyFilterEnabled ? 'ON' : 'OFF'}
          </button>

          <button
            disabled={isCapturing}
            onClick={() => {
              soundEngine.playTap();
              setShowGrid(!showGrid);
            }}
            className="kiosk-btn"
            style={{
              padding: '6px 10px',
              fontSize: '11px',
              backgroundColor: showGrid ? 'var(--bg-surface-subtle)' : 'var(--bg-surface-elevated)'
            }}
          >
            <span>Grid {showGrid ? 'ON' : 'OFF'}</span>
          </button>
        </div>

        {/* Shutter Timer Selector */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
            backgroundColor: 'var(--bg-surface-elevated)',
            padding: '3px 6px',
            borderRadius: '8px',
            border: '1px solid var(--border-subtle)'
          }}
        >
          <Clock size={12} color="var(--text-muted)" />
          {([3, 5, 10] as const).map(sec => (
            <button
              key={sec}
              disabled={isCapturing}
              onClick={() => {
                soundEngine.playTap();
                updateEventConfig({ countdownSeconds: sec });
              }}
              style={{
                padding: '2px 7px',
                border: 'none',
                borderRadius: '4px',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                fontWeight: 800,
                cursor: 'pointer',
                backgroundColor: eventConfig.countdownSeconds === sec ? 'var(--accent-red)' : 'transparent',
                color: eventConfig.countdownSeconds === sec ? '#FFFFFF' : 'var(--text-secondary)'
              }}
            >
              {sec}s
            </button>
          ))}
        </div>
      </div>

      {/* Main Studio Viewport */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '14px',
          width: '100%',
          maxWidth: '960px',
          flex: 1,
          maxHeight: 'calc(100vh - 160px)',
          minHeight: '260px',
          margin: 'auto 0'
        }}
      >
        {/* Film Sequence Progress Bar */}
        {totalShotsNeeded > 1 && (
          <div
            className="kiosk-card"
            style={{
              width: 'clamp(60px, 9vw, 80px)',
              height: '100%',
              maxHeight: '440px',
              padding: '10px 6px',
              backgroundColor: 'var(--bg-surface)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '6px'
            }}
          >
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
              SHOTS
            </span>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
              {Array.from({ length: totalShotsNeeded }).map((_, idx) => {
                const isDone = idx < capturedShots.length;
                const isCurrent = idx === currentShotIndex && isCapturing;
                const shot = capturedShots[idx];

                return (
                  <div
                    key={idx}
                    style={{
                      position: 'relative',
                      width: '100%',
                      aspectRatio: '4/3',
                      backgroundColor: 'var(--bg-kiosk)',
                      borderRadius: '4px',
                      border: isCurrent ? '2px solid var(--accent-red)' : '1px solid var(--border-subtle)',
                      boxShadow: isCurrent ? '0 0 10px rgba(255, 46, 99, 0.5)' : 'none',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {isDone && shot ? (
                      <>
                        <img src={shot.url} alt={`Shot ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div
                          style={{
                            position: 'absolute',
                            top: '2px',
                            right: '2px',
                            backgroundColor: 'var(--accent-green)',
                            color: '#fff',
                            borderRadius: '50%',
                            width: '12px',
                            height: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Check size={8} strokeWidth={3} />
                        </div>
                      </>
                    ) : isCurrent ? (
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 800, color: 'var(--accent-red)' }}>
                        LIVE
                      </span>
                    ) : (
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700 }}>
                        #{idx + 1}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700, color: 'var(--text-secondary)' }}>
              {capturedShots.length}/{totalShotsNeeded}
            </span>
          </div>
        )}

        {/* Center: Live Camera Viewfinder Housing */}
        <div
          className="kiosk-card"
          style={{
            position: 'relative',
            flex: 1,
            height: '100%',
            maxHeight: '440px',
            backgroundColor: '#000000',
            overflow: 'hidden',
            border: '1px solid var(--border-medium)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {/* Virtual Destination Layer for Around the World */}
          {selectedExperience.id === 'around_world' && activeDestination && (
            <img
              src={activeDestination.bg}
              alt="Backdrop"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: 0.35
              }}
            />
          )}

          {/* Camera Feed Image */}
          <img
            src={currentPoseUrl}
            alt="Live Camera Feed"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: eventConfig.mirrorCamera ? 'scaleX(-1)' : 'none',
              filter: eventConfig.beautyFilterEnabled ? 'contrast(105%) brightness(108%)' : 'none'
            }}
          />

          {/* Rule of Thirds Grid Guide */}
          {showGrid && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gridTemplateRows: '1fr 1fr 1fr',
                pointerEvents: 'none'
              }}
            >
              <div style={{ borderRight: '1px dashed rgba(255,255,255,0.2)', borderBottom: '1px dashed rgba(255,255,255,0.2)' }} />
              <div style={{ borderRight: '1px dashed rgba(255,255,255,0.2)', borderBottom: '1px dashed rgba(255,255,255,0.2)' }} />
              <div style={{ borderBottom: '1px dashed rgba(255,255,255,0.2)' }} />
              <div style={{ borderRight: '1px dashed rgba(255,255,255,0.2)', borderBottom: '1px dashed rgba(255,255,255,0.2)' }} />
              <div style={{ borderRight: '1px dashed rgba(255,255,255,0.2)', borderBottom: '1px dashed rgba(255,255,255,0.2)' }} />
              <div style={{ borderBottom: '1px dashed rgba(255,255,255,0.2)' }} />
              <div style={{ borderRight: '1px dashed rgba(255,255,255,0.2)' }} />
              <div style={{ borderRight: '1px dashed rgba(255,255,255,0.2)' }} />
              <div />
            </div>
          )}

          {/* Top HUD Experience Badge */}
          <div
            style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(10, 12, 16, 0.75)',
              border: '1px solid var(--border-subtle)',
              padding: '3px 8px',
              borderRadius: '6px',
              backdropFilter: 'blur(4px)'
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: selectedExperience.accentColor
              }}
            />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 800, color: '#FFFFFF' }}>
              {selectedExperience.name.toUpperCase()}
            </span>
          </div>

          {/* Pose Battle Dynamic HUD */}
          {selectedExperience.id === 'pose_battle' && activeBattlePrompt && (
            <div
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                backgroundColor: 'rgba(255, 165, 2, 0.9)',
                color: '#0A0C10',
                padding: '3px 10px',
                borderRadius: '6px',
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                fontWeight: 900
              }}
            >
              {currentShotIndex === 0 ? `P1: ${activeBattlePrompt.p1}` : `P2: ${activeBattlePrompt.p2}`}
            </div>
          )}

          {/* Around the World Backdrop Cycler */}
          {selectedExperience.id === 'around_world' && !isCapturing && (
            <div
              style={{
                position: 'absolute',
                bottom: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'rgba(10, 12, 16, 0.8)',
                padding: '4px 10px',
                borderRadius: '20px',
                border: '1px solid var(--border-subtle)',
                maxWidth: '90%',
                overflowX: 'auto'
              }}
            >
              {AROUND_WORLD_DESTINATIONS.map(dest => (
                <button
                  key={dest.id}
                  onClick={() => {
                    soundEngine.playTap();
                    setActiveDestination(dest);
                  }}
                  style={{
                    border: 'none',
                    padding: '3px 8px',
                    borderRadius: '10px',
                    backgroundColor: activeDestination?.id === dest.id ? 'var(--accent-green)' : 'transparent',
                    color: activeDestination?.id === dest.id ? '#0A0C10' : '#FFFFFF',
                    fontFamily: 'var(--font-body)',
                    fontSize: '10px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {dest.flag} {dest.name}
                </button>
              ))}
            </div>
          )}

          {/* Dynamic 3..2..1 Countdown Ring Overlay */}
          {countdownValue !== null && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(10, 12, 16, 0.4)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                zIndex: 20
              }}
            >
              {/* Radial Countdown Circle */}
              <div
                key={countdownValue}
                className="animate-countdown-num"
                style={{
                  width: 'clamp(100px, 18vw, 130px)',
                  height: 'clamp(100px, 18vw, 130px)',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(20, 23, 32, 0.95)',
                  border: '3px solid var(--accent-red)',
                  boxShadow: '0 0 30px rgba(255, 46, 99, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(64px, 12vw, 78px)',
                    fontWeight: 900,
                    color: '#FFFFFF',
                    lineHeight: 1
                  }}
                >
                  {countdownValue}
                </span>
              </div>

              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  backgroundColor: 'var(--bg-surface-elevated)',
                  padding: '3px 12px',
                  borderRadius: '20px',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                SHOT {currentShotIndex + 1} OF {totalShotsNeeded}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Shutter Action Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          width: '100%',
          maxWidth: '960px'
        }}
      >
        {!isCapturing ? (
          <button
            onClick={handleStartCapture}
            className="kiosk-btn kiosk-btn-primary"
            style={{
              padding: 'clamp(12px, 2.2vh, 16px) clamp(32px, 6vw, 48px)',
              fontSize: 'clamp(15px, 2.5vw, 18px)',
              fontWeight: 900,
              borderRadius: '16px',
              letterSpacing: '0.04em'
            }}
          >
            <Camera size={20} strokeWidth={2.5} />
            <span>START CAPTURE 📸</span>
          </button>
        ) : (
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              fontWeight: 800,
              color: 'var(--accent-red)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-red)' }} />
            <span>RECORDING SHOT {currentShotIndex + 1} OF {totalShotsNeeded}...</span>
          </div>
        )}
      </div>
    </div>
  );
};
