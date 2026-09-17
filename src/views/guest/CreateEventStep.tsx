// src/views/guest/CreateEventStep.tsx
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { soundEngine } from '../../utils/audio';
import { generateEventTheme } from '../../utils/themeEngine';
import { 
  Calendar, 
  Sparkles, 
  ArrowRight, 
  AlertCircle, 
  User, 
  KeyRound, 
  PartyPopper,
  Zap,
  CheckCircle2
} from 'lucide-react';

const EVENT_TYPES = [
  { id: 'Birthday', label: 'Birthday', icon: '🎂' },
  { id: 'Wedding', label: 'Wedding', icon: '💍' },
  { id: 'College Event', label: 'College Event', icon: '🎓' },
  { id: 'Party', label: 'Party', icon: '🎉' },
  { id: 'Corporate', label: 'Corporate', icon: '💼' },
  { id: 'Other', label: 'Other', icon: '✨' }
];

const PRESET_EVENTS = [
  { name: "Hetvi's 21st Birthday", type: 'Birthday', host: 'Hetvi', code: 'HETVI21' },
  { name: 'Hetvi & Arjun', type: 'Wedding', host: 'Hetvi & Arjun', code: 'HA2026' },
  { name: 'UPG Fest 2026', type: 'College Event', host: 'UPG Committee', code: 'UPG26' },
  { name: 'TechCorp Annual Gala', type: 'Corporate', host: 'TechCorp Executive', code: 'TCGALA' },
  { name: 'Neon Night', type: 'Party', host: 'Club Luma', code: 'NEON26' }
];

export const CreateEventStep: React.FC = () => {
  const { createEvent, goToGuestStep, isPhone, isTablet } = useApp();

  // Form State
  const [eventName, setEventName] = useState<string>('');
  const [eventDate, setEventDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [eventType, setEventType] = useState<string>('Birthday');
  const [hostName, setHostName] = useState<string>('');
  const [eventCode, setEventCode] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Transition state
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [transitionStage, setTransitionStage] = useState<'creating' | 'theming' | 'ready'>('creating');
  const [targetThemeName, setTargetThemeName] = useState<string>('');

  // Auto generate event code when typing event name if code is empty
  const handleEventNameChange = (val: string) => {
    setEventName(val);
    if (errorMessage) setErrorMessage(null);
    if (!eventCode || eventCode.length <= 6) {
      const clean = val.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 6);
      if (clean) {
        setEventCode(`${clean}26`);
      }
    }
  };

  const handleApplyPreset = (preset: typeof PRESET_EVENTS[0]) => {
    soundEngine.playTap();
    setEventName(preset.name);
    setEventType(preset.type);
    setHostName(preset.host);
    setEventCode(preset.code);
    if (errorMessage) setErrorMessage(null);
  };

  // Submit Handler with 600-800ms Transition
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!eventName.trim()) {
      soundEngine.playTap();
      setErrorMessage('Please enter an event name to continue.');
      return;
    }

    if (!eventType) {
      soundEngine.playTap();
      setErrorMessage('Please select an event type.');
      return;
    }

    const previewTheme = generateEventTheme({ eventName: eventName.trim(), eventType });
    setTargetThemeName(previewTheme.themeName);
    setIsTransitioning(true);
    setTransitionStage('creating');
    soundEngine.playCountdownBeep(false);

    // Transition Stage 2: Theming (after 280ms)
    setTimeout(() => {
      setTransitionStage('theming');
      soundEngine.playCountdownBeep(false);
    }, 280);

    // Transition Stage 3: Ready (after 580ms)
    setTimeout(() => {
      setTransitionStage('ready');
      soundEngine.playEventCreated();
    }, 580);

    // Final navigation (after 820ms)
    setTimeout(() => {
      createEvent({
        eventName: eventName.trim(),
        eventDate: eventDate || new Date().toISOString().split('T')[0],
        eventType,
        hostName: hostName.trim() || undefined,
        eventCode: eventCode.trim() || undefined
      });
      goToGuestStep('welcome');
    }, 820);
  };

  // Skip / Continue without event
  const handleSkip = () => {
    soundEngine.playTap();
    goToGuestStep('welcome');
  };

  // ===================================================================
  // TRANSITION OVERLAY SCREEN (600-800ms Smooth Elegance)
  // ===================================================================
  if (isTransitioning) {
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
          backgroundColor: '#070612',
          color: '#FFFFFF',
          padding: '24px',
          boxSizing: 'border-box',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Pulsing Theme Ambient Glow */}
        <div
          style={{
            position: 'absolute',
            width: '450px',
            height: '450px',
            background: 'radial-gradient(circle, rgba(229, 72, 125, 0.25) 0%, rgba(139, 63, 209, 0.15) 50%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(50px)',
            animation: 'pulse 1s ease-in-out infinite'
          }}
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
            zIndex: 10,
            textAlign: 'center'
          }}
        >
          {/* Animated Spinner / Check Icon */}
          <div
            style={{
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              border: '2px solid rgba(229, 72, 125, 0.4)',
              borderTopColor: '#E5487D',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: transitionStage === 'ready' ? 'none' : 'spin 0.8s linear infinite',
              boxShadow: '0 0 25px rgba(229, 72, 125, 0.5)'
            }}
          >
            {transitionStage === 'ready' ? (
              <CheckCircle2 size={36} color="#00F5D4" />
            ) : (
              <Sparkles size={28} color="#E5487D" />
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <h2
              style={{
                margin: 0,
                fontFamily: 'var(--font-display)',
                fontSize: isPhone ? '1.5rem' : '1.8rem',
                fontWeight: 900,
                letterSpacing: '-0.02em',
                background: 'linear-gradient(135deg, #FFFFFF 0%, #E2D9FC 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              {transitionStage === 'creating' && 'CREATING YOUR EXPERIENCE...'}
              {transitionStage === 'theming' && `APPLYING ${targetThemeName.toUpperCase()} THEME...`}
              {transitionStage === 'ready' && 'READY.'}
            </h2>

            <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--luma-text-secondary)' }}>
              {eventName}
            </span>
          </div>
        </div>
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
        backgroundColor: '#070612',
        color: '#FFFFFF',
        position: 'relative',
        overflowX: 'hidden',
        overflowY: 'auto',
        boxSizing: 'border-box',
        userSelect: 'none',
        paddingTop: isPhone ? 'max(12px, env(safe-area-inset-top))' : '24px',
        paddingBottom: isPhone ? 'max(24px, env(safe-area-inset-bottom))' : '36px',
        paddingLeft: isPhone ? '16px' : isTablet ? '28px' : '36px',
        paddingRight: isPhone ? '16px' : isTablet ? '28px' : '36px'
      }}
    >
      {/* Background Subtle Radial Glow */}
      <div
        style={{
          position: 'fixed',
          top: '25%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '580px',
          height: '580px',
          background: 'radial-gradient(circle, rgba(229, 72, 125, 0.12) 0%, rgba(139, 63, 209, 0.08) 45%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(65px)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      {/* ===================================================================
          1. HEADER
          =================================================================== */}
      <header
        style={{
          width: '100%',
          maxWidth: '520px',
          margin: '0 auto 16px auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 20,
          position: 'relative',
          flexShrink: 0
        }}
      >
        {/* Step Indicator Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '4px 10px',
            borderRadius: '9999px',
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            color: 'var(--luma-lavender)',
            fontSize: '0.68rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: 800,
            letterSpacing: '0.06em'
          }}
        >
          <span>SETUP</span>
        </div>

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

        {/* Right: EVENT SETUP Label */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '4px 10px',
            borderRadius: '9999px',
            backgroundColor: 'rgba(229, 72, 125, 0.12)',
            border: '1px solid rgba(229, 72, 125, 0.35)',
            color: '#E5487D',
            fontSize: '0.68rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: 800
          }}
        >
          <Sparkles size={11} />
          <span>EVENT SETUP</span>
        </div>
      </header>

      {/* ===================================================================
          2. MAIN CONTENT CARD
          =================================================================== */}
      <main
        style={{
          width: '100%',
          maxWidth: '520px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          zIndex: 10,
          position: 'relative'
        }}
      >
        {/* Titles */}
        <div style={{ textAlign: 'center', marginBottom: '16px', width: '100%' }}>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: isPhone ? '1.75rem' : '2.1rem',
              fontWeight: 900,
              letterSpacing: '-0.02em',
              margin: '0 0 4px 0',
              background: 'linear-gradient(135deg, #FFFFFF 0%, #E2D9FC 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Create Your Event
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: isPhone ? '0.84rem' : '0.92rem',
              color: 'var(--luma-text-secondary)',
              margin: 0,
              lineHeight: 1.4
            }}
          >
            Set up your booth experience in seconds.
          </p>
        </div>

        {/* Quick Test Preset Chips */}
        <div style={{ width: '100%', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '6px' }}>
            <Zap size={12} color="#00F5D4" />
            <span style={{ fontSize: '0.66rem', fontFamily: 'var(--font-mono)', color: 'var(--luma-lavender)', fontWeight: 800 }}>
              QUICK EVENT PRESETS:
            </span>
          </div>
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
            {PRESET_EVENTS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                style={{
                  flex: '0 0 auto',
                  padding: '5px 10px',
                  borderRadius: '9999px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#FFFFFF',
                  fontSize: '0.68rem',
                  fontFamily: 'var(--font-mono)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Floating Error Alert */}
        {errorMessage && (
          <div
            style={{
              width: '100%',
              backgroundColor: 'rgba(229, 72, 125, 0.15)',
              border: '1px solid #E5487D',
              borderRadius: '12px',
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#FFFFFF',
              fontSize: '0.8rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              marginBottom: '16px',
              boxSizing: 'border-box'
            }}
          >
            <AlertCircle size={16} color="#E5487D" style={{ flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Event Creation Form */}
        <form
          onSubmit={handleSubmit}
          style={{
            width: '100%',
            backgroundColor: 'rgba(13, 11, 28, 0.85)',
            border: '1px solid rgba(185, 167, 255, 0.2)',
            borderRadius: '24px',
            padding: isPhone ? '18px 16px' : '24px 22px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.85), 0 0 30px rgba(139, 77, 255, 0.15)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            boxSizing: 'border-box'
          }}
        >
          {/* 1. EVENT NAME */}
          <div>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.72rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 800,
                color: 'var(--luma-lavender)',
                marginBottom: '6px',
                letterSpacing: '0.04em'
              }}
            >
              <PartyPopper size={13} color="#E5487D" />
              <span>EVENT NAME *</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Hetvi's Birthday"
              value={eventName}
              onChange={(e) => handleEventNameChange(e.target.value)}
              style={{
                width: '100%',
                minHeight: '46px',
                padding: '10px 14px',
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#FFFFFF',
                fontSize: '0.9rem',
                fontFamily: 'var(--font-body)',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'all 0.15s ease'
              }}
            />
          </div>

          {/* 2. EVENT DATE */}
          <div>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.72rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 800,
                color: 'var(--luma-lavender)',
                marginBottom: '6px',
                letterSpacing: '0.04em'
              }}
            >
              <Calendar size={13} color="#8B3FD1" />
              <span>EVENT DATE *</span>
            </label>
            <input
              type="date"
              required
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              style={{
                width: '100%',
                minHeight: '46px',
                padding: '10px 14px',
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#FFFFFF',
                fontSize: '0.88rem',
                fontFamily: 'var(--font-mono)',
                outline: 'none',
                boxSizing: 'border-box',
                colorScheme: 'dark'
              }}
            />
          </div>

          {/* 3. EVENT TYPE CHIPS */}
          <div>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.72rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 800,
                color: 'var(--luma-lavender)',
                marginBottom: '8px',
                letterSpacing: '0.04em'
              }}
            >
              <Sparkles size={13} color="#00F5D4" />
              <span>EVENT TYPE *</span>
            </label>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '8px',
                width: '100%',
                boxSizing: 'border-box'
              }}
            >
              {EVENT_TYPES.map((t) => {
                const isSelected = eventType === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      soundEngine.playTap();
                      setEventType(t.id);
                    }}
                    style={{
                      padding: '10px 6px',
                      borderRadius: '12px',
                      backgroundColor: isSelected ? 'rgba(229, 72, 125, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                      border: isSelected ? '1.5px solid #E5487D' : '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#FFFFFF',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                      cursor: 'pointer',
                      boxShadow: isSelected ? '0 0 14px rgba(229, 72, 125, 0.4)' : 'none',
                      transition: 'all 0.15s ease',
                      touchAction: 'manipulation',
                      minHeight: '52px'
                    }}
                  >
                    <span style={{ fontSize: '1.1rem' }}>{t.icon}</span>
                    <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', fontWeight: 700, textAlign: 'center', whiteSpace: 'nowrap' }}>
                      {t.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. OPTIONAL HOST NAME & EVENT CODE ROW */}
          <div style={{ display: 'grid', gridTemplateColumns: isPhone ? '1fr' : '1fr 1fr', gap: '12px' }}>
            <div>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.7rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  color: 'var(--luma-lavender)',
                  marginBottom: '6px'
                }}
              >
                <User size={12} color="#FFB703" />
                <span>HOST NAME (OPTIONAL)</span>
              </label>
              <input
                type="text"
                placeholder="Who's hosting?"
                value={hostName}
                onChange={(e) => setHostName(e.target.value)}
                style={{
                  width: '100%',
                  minHeight: '44px',
                  padding: '8px 12px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#FFFFFF',
                  fontSize: '0.84rem',
                  fontFamily: 'var(--font-body)',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.7rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  color: 'var(--luma-lavender)',
                  marginBottom: '6px'
                }}
              >
                <KeyRound size={12} color="#06D6A0" />
                <span>EVENT CODE (OPTIONAL)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. HETVI26"
                value={eventCode}
                onChange={(e) => setEventCode(e.target.value.toUpperCase())}
                style={{
                  width: '100%',
                  minHeight: '44px',
                  padding: '8px 12px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#FFFFFF',
                  fontSize: '0.84rem',
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.08em',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {/* PRIMARY BUTTON: CREATE EVENT */}
          <button
            type="submit"
            style={{
              width: '100%',
              minHeight: isPhone ? '50px' : '54px',
              borderRadius: '9999px',
              background: 'linear-gradient(135deg, #E5487D 0%, #B82E88 45%, #8B3FD1 100%)',
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
              boxShadow: '0 8px 25px rgba(229, 72, 125, 0.45)',
              marginTop: '4px',
              transition: 'all 0.18s ease',
              touchAction: 'manipulation'
            }}
          >
            <span>CREATE EVENT</span>
            <ArrowRight size={18} strokeWidth={2.5} />
          </button>

          {/* SECONDARY OPTION: CONTINUE WITHOUT AN EVENT */}
          <button
            type="button"
            onClick={handleSkip}
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              color: 'var(--luma-text-secondary)',
              fontSize: '0.78rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              cursor: 'pointer',
              padding: '6px',
              textAlign: 'center',
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
              transition: 'color 0.15s ease'
            }}
          >
            Continue without an event
          </button>
        </form>
      </main>
    </div>
  );
};

export default CreateEventStep;
