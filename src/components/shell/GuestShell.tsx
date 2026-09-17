// src/components/shell/GuestShell.tsx
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EventSwitcherModal } from '../../components/events/EventSwitcherModal';
import { CreateEventStep } from '../../views/guest/CreateEventStep';
import { WelcomeAuthView } from '../../views/guest/WelcomeAuthView';
import { EventDashboardStep } from '../../views/guest/EventDashboardStep';
import { MemoriesGalleryStep } from '../../views/guest/MemoriesGalleryStep';
import { PersonalizedWelcomeStep } from '../../views/guest/PersonalizedWelcomeStep';
import { ExperienceSelectStep } from '../../views/guest/ExperienceSelectStep';
import { CaptureStep } from '../../views/guest/CaptureStep';
import { EditStep } from '../../views/guest/EditStep';
import { AiMagicStudioView } from '../../views/guest/AiMagicStudioView';
import { PhotostripStep } from '../../views/guest/PhotostripStep';
import { AiFxStudioStep } from '../../views/guest/AiFxStudioStep';
import { AiBackgroundStudioStep } from '../../views/guest/AiBackgroundStudioStep';
import { PoseBattleView } from '../../views/guest/experiences/PoseBattleView';
import { WildcardRouletteView } from '../../views/guest/experiences/WildcardRouletteView';
import { FutureYouView } from '../../views/guest/experiences/FutureYouView';
import { AiMorphView } from '../../views/guest/experiences/AiMorphView';
import { AiSynthesisView } from '../../views/guest/experiences/AiSynthesisView';
import { ShareStep } from '../../views/guest/ShareStep';
import { soundEngine } from '../../utils/audio';
import { Sliders, Lock, ShieldCheck, X, Sparkles, Volume2, VolumeX } from 'lucide-react';

export const GuestShell: React.FC = () => {
  const { guestStep, switchMode, eventConfig, activeEvent, updateEventConfig } = useApp();
  const [showOperatorModal, setShowOperatorModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [soundOn, setSoundOn] = useState<boolean>(() => soundEngine.isEnabled());
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const handleUnlockStudio = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === eventConfig.boothPin || pinInput === '1234') {
      setShowOperatorModal(false);
      setPinInput('');
      setPinError(false);
      switchMode('studio');
    } else {
      setPinError(true);
    }
  };

  const isImmersiveScreen = guestStep === 'create_event' || guestStep === 'welcome' || guestStep === 'dashboard' || guestStep === 'experiences' || guestStep === 'memories';

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        background: 'var(--luma-bg-primary)',
        overflow: 'hidden'
      }}
    >
      {/* Top Touch Header (Only on capture/edit/share steps, omitted on Welcome, Setup & Experience Select) */}
      {!isImmersiveScreen && (
        <header
          style={{
            width: '100%',
            height: '52px',
            padding: '0 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--luma-border-subtle)',
            background: 'rgba(11, 15, 36, 0.88)',
            backdropFilter: 'blur(12px)',
            zIndex: 40,
            flexShrink: 0
          }}
        >
          {/* Official LumaBooth PNG Logo with subtle operator access */}
          <div
            onClick={() => setShowOperatorModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              touchAction: 'manipulation'
            }}
            title="LumaBooth Kiosk (Tap for Operator Access)"
          >
            <img
              src="/assets/lumabooth-logo.png"
              alt="LumaBooth Logo"
              style={{
                height: '26px',
                objectFit: 'contain',
                filter: 'drop-shadow(0 2px 8px rgba(139, 77, 255, 0.4))'
              }}
            />
          </div>

          {/* Right Area: Event Badge + GUEST Badge + Lock */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {activeEvent && (
              <button
                onClick={() => setShowEventModal(true)}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid var(--event-primary, rgba(229, 72, 125, 0.35))',
                  color: 'var(--event-primary, #E5487D)',
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  fontSize: '0.66rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  maxWidth: '140px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                <Sparkles size={10} color="var(--event-primary, #E5487D)" style={{ flexShrink: 0 }} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {activeEvent.eventName}
                </span>
              </button>
            )}

            {/* Sound ON/OFF Toggle */}
            <button
              onClick={() => {
                const next = soundEngine.toggle();
                setSoundOn(next);
                updateEventConfig({ soundEnabled: next });
              }}
              style={{
                background: soundOn ? 'rgba(0, 245, 212, 0.12)' : 'rgba(255, 255, 255, 0.06)',
                border: soundOn ? '1px solid rgba(0, 245, 212, 0.35)' : '1px solid rgba(255, 255, 255, 0.14)',
                color: soundOn ? '#00F5D4' : 'var(--luma-text-muted)',
                padding: '3px 8px',
                borderRadius: '9999px',
                fontSize: '0.64rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'all 0.15s ease'
              }}
              title={soundOn ? 'Sound is ON (Click to Mute)' : 'Sound is OFF (Click to Unmute)'}
            >
              {soundOn ? <Volume2 size={11} color="#00F5D4" /> : <VolumeX size={11} color="var(--luma-text-muted)" />}
              <span>{soundOn ? 'SOUND ON' : 'SOUND OFF'}</span>
            </button>

            <span
              style={{
                fontSize: '0.66rem',
                fontFamily: 'var(--font-mono)',
                color: '#B9A7FF',
                backgroundColor: 'rgba(185, 167, 255, 0.1)',
                border: '1px solid rgba(185, 167, 255, 0.2)',
                padding: '2px 8px',
                borderRadius: '9999px',
                fontWeight: 700
              }}
            >
              GUEST
            </span>

            {/* Hidden Admin Lock trigger */}
            <button
              onClick={() => setShowOperatorModal(true)}
              aria-label="Unlock Studio Admin"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.2)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '6px'
              }}
            >
              <Lock size={12} />
            </button>
          </div>
        </header>
      )}

      {/* Main Touchscreen Viewport */}
      <main
        style={{
          flex: 1,
          width: '100%',
          height: isImmersiveScreen ? '100%' : 'calc(100% - 52px)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div 
          key={guestStep}
          className="luma-page-enter"
          style={{
            flex: 1,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {guestStep === 'create_event' && <CreateEventStep />}
          {guestStep === 'welcome' && <WelcomeAuthView />}
          {guestStep === 'dashboard' && <EventDashboardStep />}
          {guestStep === 'memories' && <MemoriesGalleryStep />}
          {guestStep === 'personalized_welcome' && <PersonalizedWelcomeStep />}
          {guestStep === 'experiences' && <ExperienceSelectStep />}
          {guestStep === 'capture' && <CaptureStep />}
          {guestStep === 'pose_battle' && <PoseBattleView />}
          {guestStep === 'photo_roulette' && <WildcardRouletteView />}
          {guestStep === 'future_you' && <FutureYouView />}
          {guestStep === 'ai_morph' && <AiMorphView />}
          {guestStep === 'ai_synthesis' && <AiSynthesisView />}
          {guestStep === 'edit' && <EditStep />}
          {guestStep === 'ai_magic' && <AiMagicStudioView />}
          {guestStep === 'photostrip' && <PhotostripStep />}
          {guestStep === 'ai_fx' && <AiFxStudioStep />}
          {guestStep === 'ai_bg' && <AiBackgroundStudioStep />}
          {guestStep === 'share' && <ShareStep />}
        </div>
      </main>

      {/* Operator PIN Passcode Modal */}
      {showOperatorModal && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(5, 7, 18, 0.85)',
            backdropFilter: 'blur(16px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '360px',
              background: 'var(--luma-bg-secondary)',
              border: '1px solid var(--luma-border-electric)',
              borderRadius: 'var(--radius-xl)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(139, 77, 255, 0.25)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <ShieldCheck size={20} color="var(--luma-pink-luma)" />
                <span style={{ fontWeight: 800, fontSize: '1.05rem', fontFamily: 'var(--font-display)', color: '#FFFFFF' }}>
                  Studio Control Access
                </span>
              </div>
              <button
                onClick={() => {
                  setShowOperatorModal(false);
                  setPinError(false);
                }}
                style={{ background: 'transparent', border: 'none', color: 'var(--luma-text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--luma-text-secondary)' }}>
              Enter Operator PIN to unlock studio calibration & event settings (Default: 1234).
            </p>

            <form onSubmit={handleUnlockStudio} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <input
                type="password"
                maxLength={6}
                autoFocus
                placeholder="PIN: 1234"
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError(false);
                }}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--luma-bg-surface)',
                  border: `1px solid ${pinError ? 'var(--luma-pink-luma)' : 'var(--luma-border-medium)'}`,
                  color: '#FFFFFF',
                  fontSize: '1.3rem',
                  textAlign: 'center',
                  letterSpacing: '0.25em',
                  fontFamily: 'var(--font-mono)',
                  outline: 'none'
                }}
              />

              {pinError && (
                <span style={{ color: 'var(--luma-pink-luma)', fontSize: '0.78rem', textAlign: 'center' }}>
                  Incorrect PIN. Please try again.
                </span>
              )}

              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowOperatorModal(false);
                    switchMode('studio');
                  }}
                  className="luma-btn luma-btn-ghost luma-btn-sm"
                  style={{ flex: 1 }}
                >
                  Quick Open
                </button>
                <button
                  type="submit"
                  className="luma-btn luma-btn-primary"
                  style={{ flex: 1 }}
                >
                  <Sliders size={16} />
                  <span>Unlock</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Event Switcher Modal */}
      <EventSwitcherModal
        isOpen={showEventModal}
        onClose={() => setShowEventModal(false)}
      />
    </div>
  );
};
