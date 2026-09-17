import React, { useState, useEffect } from 'react';
import { useBooth } from '../context/BoothContext';
import { Volume2, VolumeX, Settings, Home, ArrowLeft } from 'lucide-react';
import { soundEngine } from '../utils/audio';

export const KioskHeader: React.FC = () => {
  const { 
    currentStep, 
    goToStep, 
    selectedExperience, 
    eventConfig, 
    updateEventConfig, 
    setIsAdminOpen, 
    resetToWelcome 
  } = useBooth();

  const [timeStr, setTimeStr] = useState<string>('');
  const [adminTapCount, setAdminTapCount] = useState<number>(0);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogoTripleTap = () => {
    soundEngine.playTap();
    const next = adminTapCount + 1;
    if (next >= 3) {
      setIsAdminOpen(true);
      setAdminTapCount(0);
    } else {
      setAdminTapCount(next);
      setTimeout(() => setAdminTapCount(0), 1200);
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 'experiences': return 'Select Experience';
      case 'capture': return `${selectedExperience.name}`;
      case 'review': return 'Review & Retouch';
      case 'layout': return 'Print & Layout';
      case 'share': return 'Share & Print';
      default: return '';
    }
  };

  return (
    <header
      style={{
        position: 'relative',
        zIndex: 40,
        height: '52px',
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 clamp(10px, 2vw, 24px)',
        userSelect: 'none'
      }}
    >
      {/* Left: Brand & Back Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {currentStep !== 'welcome' && (
          <button
            onClick={() => {
              if (currentStep === 'experiences') resetToWelcome();
              else if (currentStep === 'capture') goToStep('experiences');
              else if (currentStep === 'review') goToStep('capture');
              else if (currentStep === 'layout') goToStep('review');
              else if (currentStep === 'share') goToStep('layout');
            }}
            className="kiosk-btn"
            style={{
              padding: '5px 10px',
              fontSize: '11px',
              fontWeight: 700,
              backgroundColor: 'var(--bg-surface-elevated)'
            }}
            title="Go Back"
          >
            <ArrowLeft size={13} /> <span className="hidden sm:inline">Back</span>
          </button>
        )}

        <div
          onClick={handleLogoTripleTap}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer'
          }}
        >
          <div
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent-red)',
              boxShadow: '0 0 6px var(--accent-red)'
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '16px',
              fontWeight: 900,
              letterSpacing: '0.06em',
              color: '#FFFFFF'
            }}
          >
            LUMABOOTH
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '8px',
              fontWeight: 700,
              color: 'var(--text-muted)',
              backgroundColor: 'var(--bg-surface-subtle)',
              padding: '1px 5px',
              borderRadius: '4px'
            }}
          >
            PRO
          </span>
        </div>
      </div>

      {/* Center: Active Screen / Experience Indicator */}
      {currentStep !== 'welcome' && (
        <div
          className="hidden sm:flex"
          style={{
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'var(--bg-surface-elevated)',
            padding: '3px 12px',
            borderRadius: '20px',
            border: '1px solid var(--border-subtle)'
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
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '11px',
              fontWeight: 700,
              color: '#FFFFFF'
            }}
          >
            {getStepTitle()}
          </span>
        </div>
      )}

      {/* Right: Quick Kiosk Utility Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {/* Live Clock (Hidden on phones, visible on sm+) */}
        <div
          className="hidden sm:block"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            fontWeight: 700,
            color: 'var(--text-secondary)',
            padding: '3px 8px',
            backgroundColor: 'var(--bg-surface-elevated)',
            borderRadius: '6px',
            border: '1px solid var(--border-subtle)'
          }}
        >
          {timeStr}
        </div>

        {/* Audio Mute Switch */}
        <button
          onClick={() => {
            soundEngine.playTap();
            updateEventConfig({ soundEnabled: !eventConfig.soundEnabled });
          }}
          className="kiosk-btn"
          style={{ width: '30px', height: '30px', padding: 0 }}
          title={eventConfig.soundEnabled ? 'Mute' : 'Unmute'}
        >
          {eventConfig.soundEnabled ? <Volume2 size={13} /> : <VolumeX size={13} color="var(--text-muted)" />}
        </button>

        {/* Home / Reset (if in active session) */}
        {currentStep !== 'welcome' && (
          <button
            onClick={resetToWelcome}
            className="kiosk-btn"
            style={{ width: '30px', height: '30px', padding: 0 }}
            title="Start New Session"
          >
            <Home size={13} />
          </button>
        )}

        {/* Admin Gear */}
        <button
          onClick={() => {
            soundEngine.playTap();
            setIsAdminOpen(true);
          }}
          className="kiosk-btn"
          style={{ width: '30px', height: '30px', padding: 0 }}
          title="Kiosk Settings"
        >
          <Settings size={13} />
        </button>
      </div>
    </header>
  );
};
