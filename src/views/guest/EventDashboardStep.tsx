// src/views/guest/EventDashboardStep.tsx
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { soundEngine } from '../../utils/audio';
import { EventSwitcherModal } from '../../components/events/EventSwitcherModal';
import { 
  Sparkles, 
  Camera, 
  Wand2, 
  Heart, 
  QrCode, 
  Edit3, 
  ArrowRight, 
  X, 
  Copy, 
  Check, 
  Home, 
  Grid, 
  Image as ImageIcon, 
  Sliders, 
  Volume2, 
  VolumeX 
} from 'lucide-react';

export const EventDashboardStep: React.FC = () => {
  const { 
    activeEvent, 
    updateActiveEvent,
    memories, 
    capturedPhotos,
    goToGuestStep, 
    isPhone, 
    isTablet,
    updateEventConfig
  } = useApp();

  // Modals & UI state
  const [showEventSwitcher, setShowEventSwitcher] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showQrModal, setShowQrModal] = useState<boolean>(false);
  const [soundOn, setSoundOn] = useState<boolean>(() => soundEngine.isEnabled());
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Edit Event Form state
  const [editName, setEditName] = useState<string>(activeEvent?.eventName || '');
  const [editDate, setEditDate] = useState<string>(activeEvent?.eventDate || '');
  const [editType, setEditType] = useState<string>(activeEvent?.eventType || 'Birthday');
  const [editHost, setEditHost] = useState<string>(activeEvent?.hostName || '');

  // Filter memories strictly for current active event
  const currentEventId = activeEvent?.id || 'default_event';
  const eventMemories = memories.filter(m => m.eventId === currentEventId);

  // Stats calculation
  const totalMemoriesCount = eventMemories.length;
  const sessionsCount = new Set(eventMemories.map(m => m.sessionId || m.id)).size;
  const aiCreationsCount = eventMemories.filter(m => m.type !== 'photo').length;
  const totalPhotosCount = eventMemories.filter(m => m.type === 'photo').length || capturedPhotos.length;

  // Recent 3–4 memories
  const recentMemories = eventMemories.slice(0, 4);

  // Format date helper
  const formattedEventDate = activeEvent?.eventDate 
    ? new Date(activeEvent.eventDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : '27 August 2026';

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;
    soundEngine.playPhotoSaved();
    updateActiveEvent({
      eventName: editName.trim(),
      eventDate: editDate,
      eventType: editType,
      hostName: editHost.trim() || undefined
    });
    setShowEditModal(false);
  };

  const handleCopyEventLink = () => {
    soundEngine.playTap();
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      const guestUrl = `${window.location.origin}/event/${activeEvent?.id || 'default_event'}`;
      navigator.clipboard.writeText(guestUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
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
        paddingTop: isPhone ? 'max(10px, env(safe-area-inset-top))' : '16px',
        paddingBottom: isPhone ? 'max(80px, env(safe-area-inset-bottom))' : '90px',
        paddingLeft: isPhone ? '14px' : isTablet ? '24px' : '36px',
        paddingRight: isPhone ? '14px' : isTablet ? '24px' : '36px'
      }}
    >
      {/* Ambient Background Radial Glow */}
      <div
        style={{
          position: 'fixed',
          top: '20%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '600px',
          background: 'var(--event-ambient-glow, radial-gradient(circle, rgba(229, 72, 125, 0.14) 0%, rgba(139, 63, 209, 0.08) 45%, transparent 70%))',
          borderRadius: '50%',
          filter: 'blur(65px)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      {/* ===================================================================
          1. HEADER (LOGO, EVENT BADGE, STATUS INDICATOR, SOUND & SWITCHER)
          =================================================================== */}
      <header
        style={{
          width: '100%',
          maxWidth: '780px',
          margin: '0 auto 14px auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 20,
          position: 'relative',
          flexShrink: 0
        }}
      >
        {/* Left: LumaBooth PNG Logo Asset */}
        <div
          onClick={() => {
            soundEngine.playTap();
            goToGuestStep('welcome');
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4px 14px',
            borderRadius: '9999px',
            backgroundColor: 'rgba(8, 6, 20, 0.85)',
            border: '1px solid rgba(185, 167, 255, 0.2)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.5)',
            cursor: 'pointer'
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

        {/* Right Controls: Sound Toggle + Switch Event */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Sound Toggle */}
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
              padding: '4px 10px',
              borderRadius: '9999px',
              fontSize: '0.66rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
            title={soundOn ? 'Sound is ON' : 'Sound is OFF'}
          >
            {soundOn ? <Volume2 size={12} color="#00F5D4" /> : <VolumeX size={12} color="var(--luma-text-muted)" />}
            <span>{soundOn ? 'ON' : 'OFF'}</span>
          </button>

          {/* Switch Event Button */}
          <button
            onClick={() => {
              soundEngine.playTap();
              setShowEventSwitcher(true);
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 12px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid var(--event-primary, rgba(229, 72, 125, 0.4))',
              color: 'var(--event-primary, #E5487D)',
              fontSize: '0.68rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            <Sparkles size={11} color="var(--event-primary, #E5487D)" />
            <span>SWITCH</span>
          </button>
        </div>
      </header>

      {/* ===================================================================
          2. EVENT HERO BANNER & STATUS
          =================================================================== */}
      <div
        style={{
          width: '100%',
          maxWidth: '780px',
          margin: '0 auto 16px auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          zIndex: 10,
          position: 'relative'
        }}
      >
        {/* Status Indicator */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '3px 12px',
            borderRadius: '9999px',
            backgroundColor: 'rgba(0, 245, 212, 0.12)',
            border: '1px solid rgba(0, 245, 212, 0.35)',
            color: '#00F5D4',
            fontSize: '0.66rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: 800,
            letterSpacing: '0.08em',
            marginBottom: '8px'
          }}
        >
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#00F5D4', boxShadow: '0 0 8px #00F5D4' }} />
          <span>BOOTH READY</span>
        </div>

        {/* Small CURRENT EVENT Label */}
        <span
          style={{
            fontSize: isPhone ? '0.68rem' : '0.76rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: 800,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--luma-lavender)',
            marginBottom: '4px',
            opacity: 0.9
          }}
        >
          CURRENT EVENT
        </span>

        {/* Event Name */}
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: isPhone ? 'clamp(1.8rem, 8vw, 2.5rem)' : '3rem',
            fontWeight: 900,
            letterSpacing: '-0.025em',
            margin: '0 0 4px 0',
            background: 'var(--event-gradient, linear-gradient(135deg, #FFFFFF 0%, #E2D9FC 100%))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1.1
          }}
        >
          {activeEvent ? activeEvent.eventName : "Hetvi's Birthday"}
        </h1>

        {/* Event Date */}
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: isPhone ? '0.86rem' : '0.96rem',
            color: 'var(--event-subtext, var(--luma-text-secondary))',
            margin: 0
          }}
        >
          {formattedEventDate}
        </p>
      </div>

      {/* ===================================================================
          3. MAIN CONTENT CONTAINER (Grid on Tablet, Single-Col on Phone)
          =================================================================== */}
      <main
        style={{
          width: '100%',
          maxWidth: '780px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: isPhone ? '16px' : '22px',
          zIndex: 10,
          position: 'relative'
        }}
      >
        {/* PRIMARY ACTION: [ START BOOTH → ] */}
        <button
          onClick={() => {
            soundEngine.playTap();
            goToGuestStep('experiences');
          }}
          className="luma-btn-start-hero"
          style={{
            width: '100%',
            minHeight: isPhone ? '56px' : '62px',
            borderRadius: '9999px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            fontSize: isPhone ? '1.05rem' : '1.18rem',
            fontWeight: 800,
            fontFamily: 'var(--font-display)',
            letterSpacing: '0.06em',
            cursor: 'pointer'
          }}
        >
          <Sparkles size={18} className="luma-btn-sparkle" />
          <span>START BOOTH</span>
          <span className="luma-btn-camera-badge">
            <Camera size={14} color="#FFFFFF" />
          </span>
          <ArrowRight size={18} className="luma-btn-arrow" />
        </button>

        {/* =================================================================
            4. STATISTICS SECTION: "YOUR EVENT" (4 Real Stored Metrics)
            ================================================================= */}
        <div style={{ width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.14em', color: 'var(--luma-lavender)' }}>
              YOUR EVENT STATS
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: isPhone ? '8px' : '12px',
              width: '100%',
              boxSizing: 'border-box'
            }}
          >
            {/* 1. MEMORIES */}
            <div
              className="luma-card-interactive"
              style={{
                padding: isPhone ? '12px 6px' : '16px 12px',
                borderRadius: '16px',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center'
              }}
            >
              <span style={{ fontSize: isPhone ? '1.35rem' : '1.65rem', fontFamily: 'var(--font-display)', fontWeight: 900, color: 'var(--event-primary, #E5487D)' }}>
                {totalMemoriesCount}
              </span>
              <span style={{ fontSize: '0.6rem', fontFamily: 'var(--font-mono)', color: 'var(--luma-text-secondary)', fontWeight: 700, letterSpacing: '0.04em', marginTop: '2px' }}>
                MEMORIES
              </span>
            </div>

            {/* 2. SESSIONS */}
            <div
              className="luma-card-interactive"
              style={{
                padding: isPhone ? '12px 6px' : '16px 12px',
                borderRadius: '16px',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center'
              }}
            >
              <span style={{ fontSize: isPhone ? '1.35rem' : '1.65rem', fontFamily: 'var(--font-display)', fontWeight: 900, color: '#8B3FD1' }}>
                {sessionsCount}
              </span>
              <span style={{ fontSize: '0.6rem', fontFamily: 'var(--font-mono)', color: 'var(--luma-text-secondary)', fontWeight: 700, letterSpacing: '0.04em', marginTop: '2px' }}>
                SESSIONS
              </span>
            </div>

            {/* 3. AI CREATIONS */}
            <div
              className="luma-card-interactive"
              style={{
                padding: isPhone ? '12px 6px' : '16px 12px',
                borderRadius: '16px',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center'
              }}
            >
              <span style={{ fontSize: isPhone ? '1.35rem' : '1.65rem', fontFamily: 'var(--font-display)', fontWeight: 900, color: '#00F5D4' }}>
                {aiCreationsCount}
              </span>
              <span style={{ fontSize: '0.6rem', fontFamily: 'var(--font-mono)', color: 'var(--luma-text-secondary)', fontWeight: 700, letterSpacing: '0.04em', marginTop: '2px' }}>
                AI CREATIONS
              </span>
            </div>

            {/* 4. PHOTOS */}
            <div
              className="luma-card-interactive"
              style={{
                padding: isPhone ? '12px 6px' : '16px 12px',
                borderRadius: '16px',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center'
              }}
            >
              <span style={{ fontSize: isPhone ? '1.35rem' : '1.65rem', fontFamily: 'var(--font-display)', fontWeight: 900, color: '#FFB703' }}>
                {totalPhotosCount}
              </span>
              <span style={{ fontSize: '0.6rem', fontFamily: 'var(--font-mono)', color: 'var(--luma-text-secondary)', fontWeight: 700, letterSpacing: '0.04em', marginTop: '2px' }}>
                PHOTOS
              </span>
            </div>
          </div>
        </div>

        {/* =================================================================
            5. QUICK ACTIONS: 4 COMPACT INTERACTIVE CARDS
            ================================================================= */}
        <div style={{ width: '100%' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.14em', color: 'var(--luma-lavender)', marginBottom: '8px', display: 'block' }}>
            QUICK ACTIONS
          </span>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: isPhone ? '8px' : '12px',
              width: '100%',
              boxSizing: 'border-box'
            }}
          >
            {/* 1. START BOOTH */}
            <button
              onClick={() => {
                soundEngine.playTap();
                goToGuestStep('experiences');
              }}
              className="luma-card-interactive"
              style={{
                padding: isPhone ? '14px 6px' : '18px 10px',
                borderRadius: '16px',
                backgroundColor: 'rgba(13, 11, 28, 0.85)',
                border: '1px solid rgba(185, 167, 255, 0.18)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                color: '#FFFFFF'
              }}
            >
              <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: 'rgba(229, 72, 125, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--event-primary, #E5487D)' }}>
                <Camera size={18} />
              </div>
              <span style={{ fontSize: '0.64rem', fontFamily: 'var(--font-mono)', fontWeight: 800, letterSpacing: '0.02em', textAlign: 'center' }}>
                START BOOTH
              </span>
            </button>

            {/* 2. AI EXPERIENCES */}
            <button
              onClick={() => {
                soundEngine.playTap();
                goToGuestStep('ai_morph');
              }}
              className="luma-card-interactive"
              style={{
                padding: isPhone ? '14px 6px' : '18px 10px',
                borderRadius: '16px',
                backgroundColor: 'rgba(13, 11, 28, 0.85)',
                border: '1px solid rgba(185, 167, 255, 0.18)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                color: '#FFFFFF'
              }}
            >
              <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: 'rgba(139, 63, 209, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8B3FD1' }}>
                <Wand2 size={18} />
              </div>
              <span style={{ fontSize: '0.64rem', fontFamily: 'var(--font-mono)', fontWeight: 800, letterSpacing: '0.02em', textAlign: 'center' }}>
                AI EXPERIENCES
              </span>
            </button>

            {/* 3. MEMORIES */}
            <button
              onClick={() => {
                soundEngine.playTap();
                goToGuestStep('memories');
              }}
              className="luma-card-interactive"
              style={{
                padding: isPhone ? '14px 6px' : '18px 10px',
                borderRadius: '16px',
                backgroundColor: 'rgba(13, 11, 28, 0.85)',
                border: '1px solid rgba(185, 167, 255, 0.18)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                color: '#FFFFFF'
              }}
            >
              <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: 'rgba(232, 62, 122, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E83E7A' }}>
                <Heart size={18} />
              </div>
              <span style={{ fontSize: '0.64rem', fontFamily: 'var(--font-mono)', fontWeight: 800, letterSpacing: '0.02em', textAlign: 'center' }}>
                MEMORIES
              </span>
            </button>

            {/* 4. EVENT QR */}
            <button
              onClick={() => {
                soundEngine.playQrGenerated();
                setShowQrModal(true);
              }}
              className="luma-card-interactive"
              style={{
                padding: isPhone ? '14px 6px' : '18px 10px',
                borderRadius: '16px',
                backgroundColor: 'rgba(13, 11, 28, 0.85)',
                border: '1px solid rgba(185, 167, 255, 0.18)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                color: '#FFFFFF'
              }}
            >
              <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: 'rgba(0, 245, 212, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00F5D4' }}>
                <QrCode size={18} />
              </div>
              <span style={{ fontSize: '0.64rem', fontFamily: 'var(--font-mono)', fontWeight: 800, letterSpacing: '0.02em', textAlign: 'center' }}>
                EVENT QR
              </span>
            </button>
          </div>
        </div>

        {/* =================================================================
            6. EVENT INFORMATION & SHARING (2-Col on Tablet, 1-Col on Phone)
            ================================================================= */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isTablet ? '1fr 1fr' : '1fr',
            gap: isPhone ? '14px' : '18px',
            width: '100%'
          }}
        >
          {/* Event Information Card */}
          <div
            style={{
              padding: isPhone ? '18px 16px' : '22px 20px',
              borderRadius: '20px',
              backgroundColor: 'rgba(13, 11, 28, 0.85)',
              border: '1px solid rgba(185, 167, 255, 0.18)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '14px'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.14em', color: 'var(--luma-lavender)' }}>
                  EVENT INFORMATION
                </span>

                <button
                  onClick={() => {
                    soundEngine.playTap();
                    setEditName(activeEvent?.eventName || '');
                    setEditDate(activeEvent?.eventDate || '');
                    setEditType(activeEvent?.eventType || 'Birthday');
                    setEditHost(activeEvent?.hostName || '');
                    setShowEditModal(true);
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '3px 10px',
                    borderRadius: '9999px',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#FFFFFF',
                    fontSize: '0.64rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <Edit3 size={11} />
                  <span>EDIT EVENT</span>
                </button>
              </div>

              {/* Info Rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '6px' }}>
                  <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--luma-text-secondary)' }}>EVENT NAME</span>
                  <span style={{ fontSize: '0.82rem', fontFamily: 'var(--font-display)', fontWeight: 800, color: '#FFFFFF' }}>{activeEvent?.eventName || "Hetvi's Birthday"}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '6px' }}>
                  <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--luma-text-secondary)' }}>EVENT DATE</span>
                  <span style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--luma-lavender)' }}>{formattedEventDate}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '6px' }}>
                  <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--luma-text-secondary)' }}>EVENT TYPE</span>
                  <span style={{ fontSize: '0.76rem', fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--event-primary, #E5487D)' }}>{activeEvent?.eventType || 'Birthday'}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--luma-text-secondary)' }}>HOST</span>
                  <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-body)', fontWeight: 600, color: '#FFFFFF' }}>{activeEvent?.hostName || 'Host'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Event QR Section */}
          <div
            style={{
              padding: isPhone ? '18px 16px' : '22px 20px',
              borderRadius: '20px',
              backgroundColor: 'rgba(13, 11, 28, 0.85)',
              border: '1px solid rgba(185, 167, 255, 0.18)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
              textAlign: 'center',
              gap: '12px'
            }}
          >
            <div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.14em', color: 'var(--luma-lavender)', marginBottom: '4px', display: 'block' }}>
                SHARE YOUR EVENT
              </span>
              <p style={{ margin: '0 0 10px 0', fontSize: '0.76rem', color: 'var(--luma-text-secondary)', fontFamily: 'var(--font-body)' }}>
                Guests can scan to view memories.
              </p>
            </div>

            {/* Simulated Clean SVG QR Code */}
            <div
              onClick={() => {
                soundEngine.playQrGenerated();
                setShowQrModal(true);
              }}
              style={{
                width: '100px',
                height: '100px',
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
                cursor: 'pointer'
              }}
            >
              <QrCode size={84} color="#070612" />
            </div>

            <button
              onClick={() => {
                soundEngine.playQrGenerated();
                setShowQrModal(true);
              }}
              style={{
                width: '100%',
                minHeight: '38px',
                padding: '0 16px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                color: '#FFFFFF',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.74rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <QrCode size={13} />
              <span>OPEN QR</span>
            </button>
          </div>
        </div>

        {/* =================================================================
            7. RECENT MEMORIES SECTION (Latest 3–4 Actual Photos)
            ================================================================= */}
        <div style={{ width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.14em', color: 'var(--luma-lavender)' }}>
              RECENT MEMORIES
            </span>

            <button
              onClick={() => {
                soundEngine.playTap();
                goToGuestStep('memories');
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--event-primary, #E5487D)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span>VIEW ALL</span>
              <ArrowRight size={12} />
            </button>
          </div>

          {recentMemories.length === 0 ? (
            /* Empty State */
            <div
              style={{
                padding: '24px 16px',
                borderRadius: '16px',
                backgroundColor: 'rgba(13, 11, 28, 0.65)',
                border: '1px dashed rgba(185, 167, 255, 0.2)',
                textAlign: 'center'
              }}
            >
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--luma-text-secondary)', fontFamily: 'var(--font-body)' }}>
                Your memories will appear here after your first capture.
              </p>
            </div>
          ) : (
            /* 4-Item Grid of Real Captured Memories */
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isPhone ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
                gap: '10px',
                width: '100%',
                boxSizing: 'border-box'
              }}
            >
              {recentMemories.map((mem) => (
                <div
                  key={mem.id}
                  onClick={() => {
                    soundEngine.playTap();
                    goToGuestStep('memories');
                  }}
                  className="luma-card-interactive"
                  style={{
                    borderRadius: '14px',
                    overflow: 'hidden',
                    backgroundColor: '#000000',
                    aspectRatio: mem.type === 'photostrip' ? '1/1.4' : '1/1.1',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                >
                  <img
                    src={mem.imageUrl}
                    alt="Recent Memory"
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
                      bottom: 4,
                      left: 4,
                      background: 'rgba(8, 6, 20, 0.8)',
                      padding: '2px 6px',
                      borderRadius: '9999px',
                      fontSize: '0.55rem',
                      fontFamily: 'var(--font-mono)',
                      color: '#FFFFFF',
                      fontWeight: 700
                    }}
                  >
                    {mem.type === 'photostrip' ? 'STRIP' : mem.type === 'ai_morph' ? 'AI' : 'PHOTO'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* ===================================================================
          8. CLEAN MOBILE/TABLET BOTTOM NAVIGATION BAR
          =================================================================== */}
      <nav
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'rgba(8, 6, 20, 0.94)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(185, 167, 255, 0.16)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          height: isPhone ? '58px' : '64px',
          paddingBottom: isPhone ? 'env(safe-area-inset-bottom)' : '0px',
          zIndex: 100
        }}
      >
        {/* Tab 1: HOME */}
        <button
          onClick={() => {
            soundEngine.playTap();
            goToGuestStep('welcome');
          }}
          style={{
            flex: 1,
            height: '100%',
            background: 'transparent',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '3px',
            color: 'var(--luma-text-secondary)',
            cursor: 'pointer'
          }}
        >
          <Home size={18} />
          <span style={{ fontSize: '0.62rem', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>HOME</span>
        </button>

        {/* Tab 2: MODES */}
        <button
          onClick={() => {
            soundEngine.playTap();
            goToGuestStep('experiences');
          }}
          style={{
            flex: 1,
            height: '100%',
            background: 'transparent',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '3px',
            color: 'var(--luma-text-secondary)',
            cursor: 'pointer'
          }}
        >
          <Grid size={18} />
          <span style={{ fontSize: '0.62rem', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>MODES</span>
        </button>

        {/* Tab 3: MEMORIES */}
        <button
          onClick={() => {
            soundEngine.playTap();
            goToGuestStep('memories');
          }}
          style={{
            flex: 1,
            height: '100%',
            background: 'transparent',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '3px',
            color: 'var(--luma-text-secondary)',
            cursor: 'pointer'
          }}
        >
          <ImageIcon size={18} />
          <span style={{ fontSize: '0.62rem', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>MEMORIES</span>
        </button>

        {/* Tab 4: EVENT / DASHBOARD (Active Highlight) */}
        <button
          style={{
            flex: 1,
            height: '100%',
            background: 'transparent',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '3px',
            color: 'var(--event-primary, #E5487D)',
            cursor: 'default'
          }}
        >
          <Sliders size={18} color="var(--event-primary, #E5487D)" />
          <span style={{ fontSize: '0.62rem', fontFamily: 'var(--font-mono)', fontWeight: 800 }}>EVENT</span>
        </button>
      </nav>

      {/* ===================================================================
          9. EDIT EVENT MODAL
          =================================================================== */}
      {showEditModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '20px',
            boxSizing: 'border-box'
          }}
          onClick={() => setShowEditModal(false)}
        >
          <div
            className="animate-bottom-sheet"
            style={{
              width: '100%',
              maxWidth: '420px',
              backgroundColor: '#100E26',
              border: '1px solid rgba(185, 167, 255, 0.25)',
              borderRadius: '24px',
              padding: '24px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.9), 0 0 30px var(--event-glow, rgba(229, 72, 125, 0.3))',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 900, color: '#FFFFFF' }}>
                Edit Event Details
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  borderRadius: '50%',
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  cursor: 'pointer'
                }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--luma-text-secondary)', marginBottom: '4px' }}>
                  EVENT NAME
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#FFFFFF',
                    fontSize: '0.9rem',
                    fontFamily: 'var(--font-body)',
                    outline: 'none'
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--luma-text-secondary)', marginBottom: '4px' }}>
                  EVENT DATE
                </label>
                <input
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#FFFFFF',
                    fontSize: '0.9rem',
                    fontFamily: 'var(--font-body)',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--luma-text-secondary)', marginBottom: '4px' }}>
                  EVENT TYPE
                </label>
                <select
                  value={editType}
                  onChange={(e) => setEditType(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    backgroundColor: '#120F24',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#FFFFFF',
                    fontSize: '0.9rem',
                    fontFamily: 'var(--font-body)',
                    outline: 'none'
                  }}
                >
                  <option value="Birthday">Birthday</option>
                  <option value="Wedding">Wedding</option>
                  <option value="College Event">College Event</option>
                  <option value="Party">Party</option>
                  <option value="Corporate">Corporate</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--luma-text-secondary)', marginBottom: '4px' }}>
                  HOST NAME (OPTIONAL)
                </label>
                <input
                  type="text"
                  value={editHost}
                  onChange={(e) => setEditHost(e.target.value)}
                  placeholder="Who's hosting?"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#FFFFFF',
                    fontSize: '0.9rem',
                    fontFamily: 'var(--font-body)',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  style={{
                    flex: 1,
                    minHeight: '44px',
                    borderRadius: '9999px',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#FFFFFF',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    minHeight: '44px',
                    borderRadius: '9999px',
                    background: 'var(--event-button-gradient, linear-gradient(135deg, #E5487D 0%, #8B3FD1 100%))',
                    border: 'none',
                    color: '#FFFFFF',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 900,
                    fontSize: '0.86rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 16px var(--event-glow, rgba(229, 72, 125, 0.4))'
                  }}
                >
                  SAVE CHANGES
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================
          10. EVENT QR FULL-SCREEN MODAL
          =================================================================== */}
      {showQrModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.88)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '20px',
            boxSizing: 'border-box'
          }}
          onClick={() => setShowQrModal(false)}
        >
          <div
            className="animate-qr-enter"
            style={{
              width: '100%',
              maxWidth: '380px',
              backgroundColor: '#100E26',
              border: '1px solid rgba(185, 167, 255, 0.25)',
              borderRadius: '24px',
              padding: '26px 22px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: '16px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.9), 0 0 35px var(--event-glow, rgba(229, 72, 125, 0.35))',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowQrModal(false)}
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                background: 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                borderRadius: '50%',
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                cursor: 'pointer'
              }}
            >
              <X size={16} />
            </button>

            <div>
              <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--event-primary, #E5487D)', fontWeight: 800, letterSpacing: '0.12em' }}>
                SHARE EVENT
              </span>
              <h3 style={{ margin: '4px 0 2px 0', fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 900, color: '#FFFFFF' }}>
                {activeEvent?.eventName || "Hetvi's Birthday"}
              </h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--luma-text-secondary)', fontFamily: 'var(--font-body)' }}>
                Scan to view live event gallery & memories.
              </p>
            </div>

            {/* QR Card */}
            <div
              style={{
                width: '180px',
                height: '180px',
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 10px 30px rgba(0,0,0,0.8)'
              }}
            >
              <QrCode size={156} color="#070612" />
            </div>

            {/* Event Code Pill */}
            {activeEvent?.eventCode && (
              <div
                style={{
                  padding: '4px 14px',
                  borderRadius: '9999px',
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  fontSize: '0.74rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--luma-lavender)'
                }}
              >
                EVENT CODE: <strong>{activeEvent.eventCode}</strong>
              </div>
            )}

            {/* Copy Link Action */}
            <button
              onClick={handleCopyEventLink}
              style={{
                width: '100%',
                minHeight: '44px',
                borderRadius: '9999px',
                background: 'var(--event-button-gradient, linear-gradient(135deg, #E5487D 0%, #8B3FD1 100%))',
                border: 'none',
                color: '#FFFFFF',
                fontFamily: 'var(--font-display)',
                fontWeight: 900,
                fontSize: '0.86rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 16px var(--event-glow, rgba(229, 72, 125, 0.4))'
              }}
            >
              {isCopied ? <Check size={16} /> : <Copy size={16} />}
              <span>{isCopied ? 'LINK COPIED!' : 'COPY EVENT LINK'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Event Switcher Modal */}
      <EventSwitcherModal
        isOpen={showEventSwitcher}
        onClose={() => setShowEventSwitcher(false)}
      />
    </div>
  );
};

export default EventDashboardStep;
