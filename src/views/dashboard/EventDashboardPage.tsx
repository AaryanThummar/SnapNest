// src/views/dashboard/EventDashboardPage.tsx
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { soundEngine } from '../../utils/audio';
import { generateEventTheme } from '../../utils/themeEngine';
import { ActiveEvent, StudioSection } from '../../types/app';
import { SubscriptionWatermarkModal } from '../../components/common/SubscriptionWatermarkModal';
import { 
  Plus, 
  Check, 
  Settings, 
  Camera, 
  Layers, 
  Repeat, 
  Video, 
  Zap, 
  X, 
  Copy, 
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Image as ImageIcon
} from 'lucide-react';

interface EventDashboardPageProps {
  onLaunchEvent: () => void;
  onNavigateStudio?: (section: StudioSection) => void;
  onNavigateGuestStep?: (step: any) => void;
}

const EVENT_TYPE_OPTIONS = [
  { id: 'Wedding', label: 'Wedding', icon: '💍', color: '#E07A5F' },
  { id: 'Birthday', label: 'Birthday', icon: '🎂', color: '#FF5C8A' },
  { id: 'College Event', label: 'College Event', icon: '🎓', color: '#7928CA' },
  { id: 'Corporate', label: 'Corporate', icon: '💼', color: '#0077B6' },
  { id: 'Party', label: 'Party', icon: '🎉', color: '#FF007F' },
  { id: 'Other', label: 'Custom', icon: '✨', color: '#E5487D' }
];

const QUICK_PRESETS = [
  { name: 'Muskan & Karan', type: 'Wedding', host: 'Muskan & Karan', code: 'MK2026' },
  { name: "Hetvi's 21st Birthday", type: 'Birthday', host: 'Hetvi Gajera', code: 'HETVI21' },
  { name: 'UPG Fest 2026', type: 'College Event', host: 'UPG Council', code: 'UPG26' },
  { name: 'TechCorp Annual Gala', type: 'Corporate', host: 'TechCorp Executive', code: 'TCGALA' },
  { name: 'Neon Nightclub Party', type: 'Party', host: 'Club Luma', code: 'NEON26' }
];

export const EventDashboardPage: React.FC<EventDashboardPageProps> = ({ 
  onLaunchEvent,
  onNavigateStudio
}) => {
  const { 
    activeEvent, 
    allEvents, 
    switchActiveEvent, 
    createEvent, 
    updateActiveEvent,
    isPhone, 
    isTablet,
    switchMode,
    setStudioSection
  } = useApp();

  // Modals & Popovers
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showCopyModal, setShowCopyModal] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Copy Settings Form State
  const [copySourceId, setCopySourceId] = useState<string>(() => (allEvents[1]?.id || allEvents[0]?.id || ''));
  const [copyTargetId, setCopyTargetId] = useState<string>(() => (activeEvent?.id || allEvents[0]?.id || ''));
  const [copyOptions, setCopyOptions] = useState({
    theme: true,
    captureModes: true,
    layoutPrint: true,
    sharing: true,
    cameraAudio: true
  });

  // Create Event Form State
  const [newName, setNewName] = useState<string>('');
  const [newDate, setNewDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [newType, setNewType] = useState<string>('Wedding');
  const [newHost, setNewHost] = useState<string>('');
  const [newCode, setNewCode] = useState<string>('');
  const [createError, setCreateError] = useState<string | null>(null);

  // Settings PIN Unlock State
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<boolean>(false);

  // Show Toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  };

  // Currently Selected Event
  const selectedEvent: ActiveEvent = activeEvent || allEvents[0] || {
    id: 'evt_muskan_karan',
    eventName: 'Muskan & Karan',
    eventDate: '2026-11-20',
    eventType: 'Wedding',
    hostName: 'Muskan & Karan',
    eventCode: 'MK2026',
    createdAt: Date.now(),
    theme: generateEventTheme({ eventName: 'Muskan & Karan', eventType: 'Wedding' }),
    settings: {
      layout: 'strip_2x6',
      countdownSeconds: 3,
      soundEnabled: true,
      mirrorCamera: true,
      beautyFilterIntensity: 50,
      stickersEnabled: true,
      aiPortraitsEnabled: true,
      bgRemovalEnabled: false,
      watermarkEnabled: false,
      captureModes: { photo: true, gif: false, slowmo360: false, video: true },
      printToLumaBooth: true,
      sharingOptions: { airdrop: true, qr: true, whatsapp: true, email: true, sms: false }
    }
  };

  const selectedTheme = selectedEvent.theme || generateEventTheme(selectedEvent);
  const selectedSettings = selectedEvent.settings || {
    layout: 'strip_2x6',
    countdownSeconds: 3,
    soundEnabled: true,
    mirrorCamera: true,
    beautyFilterIntensity: 50,
    stickersEnabled: true,
    aiPortraitsEnabled: true,
    bgRemovalEnabled: false,
    watermarkEnabled: false,
    captureModes: { photo: true, gif: false, slowmo360: false, video: true },
    printToLumaBooth: true,
    sharingOptions: { airdrop: true, qr: true, whatsapp: true, email: true, sms: false }
  };

  const captureModes = selectedSettings.captureModes || {
    photo: true,
    gif: false,
    slowmo360: false,
    video: true
  };

  const sharingOptions = selectedSettings.sharingOptions || {
    airdrop: true,
    qr: true,
    whatsapp: true,
    email: true,
    sms: false
  };

  const isPrintEnabled = selectedSettings.printToLumaBooth !== false;

  // Toggle Capture Mode per event
  const toggleCaptureMode = (modeKey: 'photo' | 'gif' | 'slowmo360' | 'video') => {
    soundEngine.playTap();
    const updatedModes = {
      ...captureModes,
      [modeKey]: !captureModes[modeKey]
    };
    updateActiveEvent({
      settings: {
        ...selectedSettings,
        captureModes: updatedModes
      }
    });
    showToast(`${modeKey.toUpperCase()} mode ${updatedModes[modeKey] ? 'enabled' : 'disabled'}`);
  };

  // Toggle Print setting per event
  const togglePrint = () => {
    soundEngine.playTap();
    const nextVal = !isPrintEnabled;
    updateActiveEvent({
      settings: {
        ...selectedSettings,
        printToLumaBooth: nextVal
      }
    });
    showToast(`Print to LumaBooth ${nextVal ? 'enabled' : 'disabled'}`);
  };

  // Toggle Sharing option per event
  const toggleSharingOption = (optKey: 'airdrop' | 'qr' | 'whatsapp' | 'email' | 'sms') => {
    soundEngine.playTap();
    const updatedSharing = {
      ...sharingOptions,
      [optKey]: !sharingOptions[optKey]
    };
    updateActiveEvent({
      settings: {
        ...selectedSettings,
        sharingOptions: updatedSharing
      }
    });
    showToast(`${optKey.toUpperCase()} sharing ${updatedSharing[optKey] ? 'enabled' : 'disabled'}`);
  };

  // Handle Create Event Submission
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      soundEngine.playTap();
      setCreateError('Please enter an event name.');
      return;
    }

    createEvent({
      eventName: newName.trim(),
      eventDate: newDate || new Date().toISOString().split('T')[0],
      eventType: newType,
      hostName: newHost.trim() || undefined,
      eventCode: newCode.trim() || undefined
    });

    setShowCreateModal(false);
    setNewName('');
    setNewHost('');
    setNewCode('');
    setCreateError(null);
    showToast('Event created & selected!');
  };

  // Handle Copy Settings Execution
  const handleExecuteCopySettings = () => {
    soundEngine.playTap();
    const source = allEvents.find(e => e.id === copySourceId);
    if (!source || !source.settings) {
      showToast('Source event has no settings to copy.');
      return;
    }

    const target = allEvents.find(e => e.id === copyTargetId);
    if (!target) return;

    const mergedSettings = {
      ...(target.settings || {}),
      ...(copyOptions.theme && source.theme ? { theme: source.theme } : {}),
      ...(copyOptions.captureModes && source.settings.captureModes ? { captureModes: { ...source.settings.captureModes } } : {}),
      ...(copyOptions.layoutPrint ? { layout: source.settings.layout, printToLumaBooth: source.settings.printToLumaBooth } : {}),
      ...(copyOptions.sharing && source.settings.sharingOptions ? { sharingOptions: { ...source.settings.sharingOptions } } : {}),
      ...(copyOptions.cameraAudio ? { countdownSeconds: source.settings.countdownSeconds, soundEnabled: source.settings.soundEnabled, mirrorCamera: source.settings.mirrorCamera } : {})
    };

    updateActiveEvent({
      settings: mergedSettings,
      ...(copyOptions.theme && source.theme ? { theme: source.theme } : {})
    });

    setShowCopyModal(false);
    soundEngine.playSuccessChime();
    showToast(`Settings copied from "${source.eventName}" to "${target.eventName}"!`);
  };

  // Handle PIN unlock for Studio Settings
  const handleUnlockStudio = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '1234' || pinInput === '0000') {
      soundEngine.playSuccessChime();
      setShowSettingsModal(false);
      setPinInput('');
      setPinError(false);
      setStudioSection('event_settings');
      switchMode('studio');
      if (onNavigateStudio) onNavigateStudio('event_settings');
    } else {
      soundEngine.playCountdownBeep(true);
      setPinError(true);
    }
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#070612',
        color: '#FFFFFF',
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
        userSelect: 'none'
      }}
    >
      {/* Toast Alert */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(26, 20, 48, 0.95)',
            border: '1px solid var(--luma-pink-luma)',
            color: '#FFFFFF',
            padding: '8px 22px',
            borderRadius: '9999px',
            fontSize: '0.82rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.8), 0 0 20px rgba(229, 72, 125, 0.4)',
            zIndex: 999999,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            animation: 'lumaFadeIn 0.15s ease-out'
          }}
        >
          <Sparkles size={14} color="var(--luma-pink-luma)" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main 3-Panel Content Wrapper */}
      <div
        style={{
          flex: 1,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: isPhone ? 'column' : 'row',
          overflow: isPhone ? 'auto' : 'hidden',
          position: 'relative'
        }}
      >
        {/* ===================================================================
            1. LEFT PANEL: SAVED EVENTS SIDEBAR & BOTTOM LAUNCH ACTIONS
            =================================================================== */}
        <aside
          style={{
            width: isPhone ? '100%' : isTablet ? '260px' : '290px',
            height: isPhone ? 'auto' : '100%',
            backgroundColor: '#0B091C',
            borderRight: isPhone ? 'none' : '1px solid rgba(185, 167, 255, 0.12)',
            borderBottom: isPhone ? '1px solid rgba(185, 167, 255, 0.12)' : 'none',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: isPhone ? '16px 18px' : '22px 20px 20px 20px',
            boxSizing: 'border-box',
            flexShrink: 0,
            overflowY: isPhone ? 'visible' : 'auto'
          }}
        >
          {/* Top: Header & Scrollable Saved Events List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <h2
              style={{
                margin: 0,
                fontSize: '1.05rem',
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                color: '#FFFFFF',
                letterSpacing: '-0.01em'
              }}
            >
              Go to saved events
            </h2>

            {/* Event List */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                maxHeight: isPhone ? '160px' : 'calc(100vh - 280px)',
                overflowY: 'auto',
                paddingRight: '4px'
              }}
            >
              {allEvents.map((evt) => {
                const isSelected = evt.id === selectedEvent.id;
                return (
                  <div
                    key={evt.id}
                    onClick={() => {
                      soundEngine.playTap();
                      switchActiveEvent(evt.id);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '7px 10px',
                      borderRadius: '10px',
                      backgroundColor: isSelected ? 'rgba(229, 72, 125, 0.12)' : 'transparent',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {/* Pink bullet indicator on active event */}
                    {isSelected ? (
                      <span
                        style={{
                          width: '7px',
                          height: '7px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--luma-pink-luma)',
                          boxShadow: '0 0 8px var(--luma-pink-luma)',
                          flexShrink: 0
                        }}
                      />
                    ) : (
                      <span
                        style={{
                          width: '7px',
                          height: '7px',
                          borderRadius: '50%',
                          backgroundColor: 'transparent',
                          flexShrink: 0
                        }}
                      />
                    )}

                    <span
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: isSelected ? '0.96rem' : '0.9rem',
                        fontWeight: isSelected ? 800 : 500,
                        color: isSelected ? '#FFFFFF' : 'rgba(235, 230, 255, 0.75)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {evt.eventName}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Action Area: Copy Settings -> Launch Event -> + New Event */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 10,
              paddingTop: 16,
              borderTop: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            {/* "Copy event settings >" Link Button */}
            <button
              onClick={() => {
                soundEngine.playTap();
                setShowCopyModal(true);
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--luma-pink-luma)',
                fontSize: '0.84rem',
                fontFamily: 'var(--font-body)',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                padding: '4px 8px',
                transition: 'opacity 0.15s ease'
              }}
            >
              <span>Copy event settings</span>
              <ChevronRight size={14} />
            </button>

            {/* "⚡ Launch event" Primary Button */}
            <button
              onClick={() => {
                soundEngine.playShutter();
                onLaunchEvent();
              }}
              style={{
                width: '100%',
                minHeight: '48px',
                borderRadius: '9999px',
                background: 'linear-gradient(135deg, #E5487D 0%, #D82670 100%)',
                border: 'none',
                color: '#FFFFFF',
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: '0.96rem',
                letterSpacing: '0.02em',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(229, 72, 125, 0.45)',
                transition: 'transform 0.15s ease'
              }}
              className="luma-btn-start-hero"
            >
              <Zap size={16} fill="#FFFFFF" />
              <span>Launch event</span>
            </button>

            {/* "or" text */}
            <span style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.45)', fontWeight: 500 }}>
              or
            </span>

            {/* "+ New event" Button */}
            <button
              onClick={() => {
                soundEngine.playTap();
                setShowCreateModal(true);
              }}
              style={{
                width: '100%',
                minHeight: '44px',
                borderRadius: '9999px',
                background: 'transparent',
                border: '1.5px solid rgba(229, 72, 125, 0.55)',
                color: 'var(--luma-pink-luma)',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Plus size={15} strokeWidth={2.6} />
              <span>New event</span>
            </button>
          </div>
        </aside>

        {/* ===================================================================
            2. CENTER PANEL: START SCREEN PREVIEW & CAPTURE CONFIGURATION
            =================================================================== */}
        <main
          style={{
            flex: 1,
            height: isPhone ? 'auto' : '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
            padding: isPhone ? '20px 16px' : isTablet ? '24px 20px' : '28px 28px',
            boxSizing: 'border-box',
            overflowY: 'auto'
          }}
        >
          {/* Section: Start Screen */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h3
              style={{
                margin: 0,
                fontSize: '1rem',
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                color: '#FFFFFF'
              }}
            >
              Start screen
            </h3>

            {/* Live Start Screen Card Preview */}
            <div
              style={{
                width: '100%',
                maxWidth: '420px',
                aspectRatio: '16/10',
                borderRadius: '16px',
                background: selectedTheme.gradient || 'linear-gradient(135deg, #1C1236 0%, #0E0A22 100%)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                boxShadow: '0 12px 36px rgba(0, 0, 0, 0.6), 0 0 30px rgba(229, 72, 125, 0.15)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '24px',
                boxSizing: 'border-box',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Subtle Ambient Radial Center Glow */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.12) 0%, transparent 70%)',
                  pointerEvents: 'none'
                }}
              />

              {/* Monogram / Header */}
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'rgba(255, 255, 255, 0.85)',
                  marginBottom: 6,
                  zIndex: 1
                }}
              >
                PHOTOBOOTH
              </span>

              {/* Event Name */}
              <h1
                style={{
                  margin: 0,
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.4rem, 4vw, 1.9rem)',
                  fontWeight: 900,
                  color: '#FFFFFF',
                  lineHeight: 1.15,
                  letterSpacing: '-0.02em',
                  zIndex: 1
                }}
              >
                {selectedEvent.eventName}
              </h1>

              {/* Small Camera/Gallery Icon Pill at Bottom */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1
                }}
              >
                <ImageIcon size={14} color="#FFFFFF" />
              </div>
            </div>
          </div>

          {/* Section: Capture Modes (Photo, GIF, 360/Slow-mo, Video) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h3
              style={{
                margin: 0,
                fontSize: '1rem',
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                color: '#FFFFFF'
              }}
            >
              Capture
            </h3>

            {/* 4 Capture Buttons Row */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, minmax(70px, 95px))',
                gap: 12
              }}
            >
              {/* 1. Photo */}
              <div
                onClick={() => toggleCaptureMode('photo')}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                  cursor: 'pointer'
                }}
              >
                <div
                  style={{
                    width: '74px',
                    height: '74px',
                    borderRadius: '18px',
                    backgroundColor: captureModes.photo ? 'rgba(229, 72, 125, 0.16)' : 'rgba(255, 255, 255, 0.04)',
                    border: captureModes.photo ? '2px solid var(--luma-pink-luma)' : '1.5px solid rgba(255, 255, 255, 0.16)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: captureModes.photo ? '0 0 16px rgba(229, 72, 125, 0.35)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Camera size={30} color={captureModes.photo ? 'var(--luma-pink-luma)' : 'rgba(255, 255, 255, 0.55)'} strokeWidth={2.2} />
                </div>
                <span
                  style={{
                    fontSize: '0.8rem',
                    fontFamily: 'var(--font-body)',
                    fontWeight: captureModes.photo ? 700 : 500,
                    color: captureModes.photo ? '#FFFFFF' : 'rgba(255, 255, 255, 0.65)'
                  }}
                >
                  Photo
                </span>
              </div>

              {/* 2. GIF */}
              <div
                onClick={() => toggleCaptureMode('gif')}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                  cursor: 'pointer'
                }}
              >
                <div
                  style={{
                    width: '74px',
                    height: '74px',
                    borderRadius: '18px',
                    backgroundColor: captureModes.gif ? 'rgba(229, 72, 125, 0.16)' : 'rgba(255, 255, 255, 0.04)',
                    border: captureModes.gif ? '2px solid var(--luma-pink-luma)' : '1.5px solid rgba(255, 255, 255, 0.16)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: captureModes.gif ? '0 0 16px rgba(229, 72, 125, 0.35)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Layers size={30} color={captureModes.gif ? 'var(--luma-pink-luma)' : 'rgba(255, 255, 255, 0.55)'} strokeWidth={2.2} />
                </div>
                <span
                  style={{
                    fontSize: '0.8rem',
                    fontFamily: 'var(--font-body)',
                    fontWeight: captureModes.gif ? 700 : 500,
                    color: captureModes.gif ? '#FFFFFF' : 'rgba(255, 255, 255, 0.65)'
                  }}
                >
                  GIF
                </span>
              </div>

              {/* 3. 360 / Slow-mo */}
              <div
                onClick={() => toggleCaptureMode('slowmo360')}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                  cursor: 'pointer'
                }}
              >
                <div
                  style={{
                    width: '74px',
                    height: '74px',
                    borderRadius: '18px',
                    backgroundColor: captureModes.slowmo360 ? 'rgba(229, 72, 125, 0.16)' : 'rgba(255, 255, 255, 0.04)',
                    border: captureModes.slowmo360 ? '2px solid var(--luma-pink-luma)' : '1.5px solid rgba(255, 255, 255, 0.16)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: captureModes.slowmo360 ? '0 0 16px rgba(229, 72, 125, 0.35)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Repeat size={30} color={captureModes.slowmo360 ? 'var(--luma-pink-luma)' : 'rgba(255, 255, 255, 0.55)'} strokeWidth={2.2} />
                </div>
                <span
                  style={{
                    fontSize: '0.78rem',
                    fontFamily: 'var(--font-body)',
                    fontWeight: captureModes.slowmo360 ? 700 : 500,
                    color: captureModes.slowmo360 ? '#FFFFFF' : 'rgba(255, 255, 255, 0.65)',
                    textAlign: 'center',
                    whiteSpace: 'nowrap'
                  }}
                >
                  360/Slow-mo
                </span>
              </div>

              {/* 4. Video */}
              <div
                onClick={() => toggleCaptureMode('video')}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                  cursor: 'pointer'
                }}
              >
                <div
                  style={{
                    width: '74px',
                    height: '74px',
                    borderRadius: '18px',
                    backgroundColor: captureModes.video ? 'rgba(229, 72, 125, 0.16)' : 'rgba(255, 255, 255, 0.04)',
                    border: captureModes.video ? '2px solid var(--luma-pink-luma)' : '1.5px solid rgba(255, 255, 255, 0.16)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: captureModes.video ? '0 0 16px rgba(229, 72, 125, 0.35)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Video size={30} color={captureModes.video ? 'var(--luma-pink-luma)' : 'rgba(255, 255, 255, 0.55)'} strokeWidth={2.2} />
                </div>
                <span
                  style={{
                    fontSize: '0.8rem',
                    fontFamily: 'var(--font-body)',
                    fontWeight: captureModes.video ? 700 : 500,
                    color: captureModes.video ? '#FFFFFF' : 'rgba(255, 255, 255, 0.65)'
                  }}
                >
                  Video
                </span>
              </div>
            </div>
          </div>
        </main>

        {/* ===================================================================
            3. RIGHT PANEL: PRINT & SHARING CONFIGURATION
            =================================================================== */}
        <aside
          style={{
            width: isPhone ? '100%' : isTablet ? '310px' : '350px',
            height: isPhone ? 'auto' : '100%',
            backgroundColor: '#090717',
            borderLeft: isPhone ? 'none' : '1px solid rgba(185, 167, 255, 0.12)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: isPhone ? '20px 16px' : '24px 24px 20px 24px',
            boxSizing: 'border-box',
            flexShrink: 0,
            overflowY: 'auto',
            position: 'relative'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Section: Print */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <h3
                style={{
                  margin: 0,
                  fontSize: '1rem',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  color: '#FFFFFF'
                }}
              >
                Print
              </h3>

              {/* Checkbox: Print to: LumaBooth */}
              <div
                onClick={togglePrint}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  cursor: 'pointer'
                }}
              >
                <div
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '4px',
                    backgroundColor: isPrintEnabled ? 'var(--luma-pink-luma)' : 'rgba(255, 255, 255, 0.08)',
                    border: isPrintEnabled ? 'none' : '1.5px solid rgba(255, 255, 255, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  {isPrintEnabled && <Check size={13} color="#FFFFFF" strokeWidth={3} />}
                </div>
                <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#FFFFFF' }}>
                  Print to: LumaBooth
                </span>
              </div>

              {/* Photostrip Layout Print Preview Card */}
              <div
                style={{
                  width: '100%',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  padding: '12px 14px',
                  boxSizing: 'border-box',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.45)',
                  marginTop: 6
                }}
              >
                {/* 2x6 Dual Strip Visual Representation */}
                <div
                  style={{
                    display: 'flex',
                    gap: '12px',
                    backgroundColor: '#FFF5F8',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: '1px solid #FFE0EC'
                  }}
                >
                  {/* Left Strip */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, width: '70px' }}>
                    <div style={{ width: '100%', height: '36px', backgroundColor: '#8DB600', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', color: '#FFFFFF', fontWeight: 800 }}>
                      1
                    </div>
                    <div style={{ width: '100%', height: '36px', backgroundColor: '#2E86AB', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', color: '#FFFFFF', fontWeight: 800 }}>
                      2
                    </div>
                    <div style={{ width: '100%', height: '36px', backgroundColor: '#F6BD60', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', color: '#FFFFFF', fontWeight: 800 }}>
                      3
                    </div>
                    <span style={{ fontSize: '0.55rem', fontWeight: 800, color: '#D82670', marginTop: 2, textAlign: 'center', textTransform: 'uppercase' }}>
                      {selectedEvent.eventCode || 'MK'}
                    </span>
                  </div>

                  {/* Right Strip */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, width: '70px' }}>
                    <div style={{ width: '100%', height: '36px', backgroundColor: '#8DB600', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', color: '#FFFFFF', fontWeight: 800 }}>
                      1
                    </div>
                    <div style={{ width: '100%', height: '36px', backgroundColor: '#2E86AB', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', color: '#FFFFFF', fontWeight: 800 }}>
                      2
                    </div>
                    <div style={{ width: '100%', height: '36px', backgroundColor: '#F6BD60', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', color: '#FFFFFF', fontWeight: 800 }}>
                      3
                    </div>
                    <span style={{ fontSize: '0.55rem', fontWeight: 800, color: '#D82670', marginTop: 2, textAlign: 'center', textTransform: 'uppercase' }}>
                      {selectedEvent.eventCode || 'MK'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Sharing Configuration */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <h3
                style={{
                  margin: 0,
                  fontSize: '1rem',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  color: '#FFFFFF'
                }}
              >
                Sharing configuration
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {/* 1. AirDrop */}
                <div
                  onClick={() => toggleSharingOption('airdrop')}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
                >
                  <div
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '4px',
                      backgroundColor: sharingOptions.airdrop ? 'var(--luma-pink-luma)' : 'rgba(255, 255, 255, 0.08)',
                      border: sharingOptions.airdrop ? 'none' : '1.5px solid rgba(255, 255, 255, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    {sharingOptions.airdrop && <Check size={13} color="#FFFFFF" strokeWidth={3} />}
                  </div>
                  <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#FFFFFF' }}>
                    Airdrop
                  </span>
                </div>

                {/* 2. QR Code */}
                <div
                  onClick={() => toggleSharingOption('qr')}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
                >
                  <div
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '4px',
                      backgroundColor: sharingOptions.qr ? 'var(--luma-pink-luma)' : 'rgba(255, 255, 255, 0.08)',
                      border: sharingOptions.qr ? 'none' : '1.5px solid rgba(255, 255, 255, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    {sharingOptions.qr && <Check size={13} color="#FFFFFF" strokeWidth={3} />}
                  </div>
                  <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#FFFFFF' }}>
                    QR Code Live Kiosk
                  </span>
                </div>

                {/* 3. WhatsApp */}
                <div
                  onClick={() => toggleSharingOption('whatsapp')}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
                >
                  <div
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '4px',
                      backgroundColor: sharingOptions.whatsapp ? 'var(--luma-pink-luma)' : 'rgba(255, 255, 255, 0.08)',
                      border: sharingOptions.whatsapp ? 'none' : '1.5px solid rgba(255, 255, 255, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    {sharingOptions.whatsapp && <Check size={13} color="#FFFFFF" strokeWidth={3} />}
                  </div>
                  <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#FFFFFF' }}>
                    WhatsApp Direct
                  </span>
                </div>

                {/* 4. Email */}
                <div
                  onClick={() => toggleSharingOption('email')}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
                >
                  <div
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '4px',
                      backgroundColor: sharingOptions.email ? 'var(--luma-pink-luma)' : 'rgba(255, 255, 255, 0.08)',
                      border: sharingOptions.email ? 'none' : '1.5px solid rgba(255, 255, 255, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    {sharingOptions.email && <Check size={13} color="#FFFFFF" strokeWidth={3} />}
                  </div>
                  <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#FFFFFF' }}>
                    Email Delivery
                  </span>
                </div>

                {/* 5. SMS */}
                <div
                  onClick={() => toggleSharingOption('sms')}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
                >
                  <div
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '4px',
                      backgroundColor: sharingOptions.sms ? 'var(--luma-pink-luma)' : 'rgba(255, 255, 255, 0.08)',
                      border: sharingOptions.sms ? 'none' : '1.5px solid rgba(255, 255, 255, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    {sharingOptions.sms && <Check size={13} color="#FFFFFF" strokeWidth={3} />}
                  </div>
                  <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#FFFFFF' }}>
                    SMS Text Delivery
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Right Settings Gear Icon Button */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              paddingTop: '16px'
            }}
          >
            <button
              onClick={() => {
                soundEngine.playTap();
                setShowSettingsModal(true);
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--luma-pink-luma)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '6px',
                transition: 'transform 0.2s ease'
              }}
              title="Studio Calibration & Event Settings"
            >
              <Settings size={28} color="var(--luma-pink-luma)" strokeWidth={1.8} />
            </button>
          </div>
        </aside>
      </div>

      {/* ===================================================================
          MODAL 1: COPY SETTINGS MODAL
          =================================================================== */}
      {showCopyModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(5, 4, 15, 0.88)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '20px',
            boxSizing: 'border-box'
          }}
          onClick={() => setShowCopyModal(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '440px',
              backgroundColor: '#0D0B1C',
              border: '1.5px solid rgba(229, 72, 125, 0.35)',
              borderRadius: '24px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.9)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Copy size={18} color="var(--luma-pink-luma)" />
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.05rem', color: '#FFFFFF' }}>
                  Copy Event Settings
                </span>
              </div>
              <button
                onClick={() => setShowCopyModal(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--luma-text-muted)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* FROM EVENT */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: 'var(--luma-lavender)', fontWeight: 700 }}>
                  COPY FROM EVENT:
                </label>
                <select
                  value={copySourceId}
                  onChange={(e) => setCopySourceId(e.target.value)}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(185, 167, 255, 0.25)',
                    color: '#FFFFFF',
                    fontSize: '0.88rem',
                    outline: 'none'
                  }}
                >
                  {allEvents.map((e) => (
                    <option key={e.id} value={e.id} style={{ backgroundColor: '#0D0B1C', color: '#FFFFFF' }}>
                      {e.eventName}
                    </option>
                  ))}
                </select>
              </div>

              {/* TO EVENT */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: 'var(--luma-lavender)', fontWeight: 700 }}>
                  APPLY TO EVENT:
                </label>
                <select
                  value={copyTargetId}
                  onChange={(e) => setCopyTargetId(e.target.value)}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(185, 167, 255, 0.25)',
                    color: '#FFFFFF',
                    fontSize: '0.88rem',
                    outline: 'none'
                  }}
                >
                  {allEvents.map((e) => (
                    <option key={e.id} value={e.id} style={{ backgroundColor: '#0D0B1C', color: '#FFFFFF' }}>
                      {e.eventName} {e.id === selectedEvent.id ? '(Active)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Config Options Checkboxes */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
                <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--luma-text-secondary)', fontWeight: 700 }}>
                  SELECT SETTINGS TO COPY:
                </span>
                {[
                  { key: 'theme', label: 'Theme & Styling Colors' },
                  { key: 'captureModes', label: 'Capture Modes (Photo, GIF, 360, Video)' },
                  { key: 'layoutPrint', label: 'Photo Layout & Print Configuration' },
                  { key: 'sharing', label: 'Sharing Options (AirDrop, QR, WhatsApp)' },
                  { key: 'cameraAudio', label: 'Camera & Shutter Audio Settings' }
                ].map((item) => (
                  <label key={item.key} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', color: '#E0DEFF', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={copyOptions[item.key as keyof typeof copyOptions]}
                      onChange={(e) => setCopyOptions({ ...copyOptions, [item.key]: e.target.checked })}
                      style={{ accentColor: 'var(--luma-pink-luma)' }}
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
              <button
                onClick={() => setShowCopyModal(false)}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteCopySettings}
                style={{
                  flex: 1.5,
                  padding: '10px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #E5487D 0%, #8B3FD1 100%)',
                  border: 'none',
                  color: '#FFFFFF',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(229, 72, 125, 0.4)'
                }}
              >
                Copy Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================
          MODAL 2: CREATE EVENT MODAL
          =================================================================== */}
      {showCreateModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(5, 4, 15, 0.88)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '20px',
            boxSizing: 'border-box'
          }}
          onClick={() => setShowCreateModal(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '460px',
              backgroundColor: '#0D0B1C',
              border: '1.5px solid rgba(229, 72, 125, 0.35)',
              borderRadius: '24px',
              padding: '22px',
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.9)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Sparkles size={18} color="var(--luma-pink-luma)" />
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.05rem', color: '#FFFFFF' }}>
                  Create New Event
                </span>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--luma-text-muted)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Presets */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--luma-lavender)', fontWeight: 700 }}>
                QUICK PRESETS:
              </span>
              <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
                {QUICK_PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      soundEngine.playTap();
                      setNewName(p.name);
                      setNewType(p.type);
                      setNewHost(p.host);
                      setNewCode(p.code);
                    }}
                    style={{
                      flexShrink: 0,
                      padding: '4px 10px',
                      borderRadius: '9999px',
                      backgroundColor: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#E0DEFF',
                      fontSize: '0.7rem',
                      cursor: 'pointer'
                    }}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: '#FFFFFF', fontWeight: 700 }}>
                  EVENT NAME *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Muskan & Karan"
                  value={newName}
                  onChange={(e) => {
                    setNewName(e.target.value);
                    if (createError) setCreateError(null);
                  }}
                  autoFocus
                  style={{
                    padding: '10px 12px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(185, 167, 255, 0.25)',
                    color: '#FFFFFF',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Event Type Grid */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: '#FFFFFF', fontWeight: 700 }}>
                  EVENT TYPE
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
                  {EVENT_TYPE_OPTIONS.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        soundEngine.playTap();
                        setNewType(t.id);
                      }}
                      style={{
                        padding: '6px 4px',
                        borderRadius: '8px',
                        backgroundColor: newType === t.id ? 'rgba(229, 72, 125, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                        border: newType === t.id ? '1.5px solid var(--luma-pink-luma)' : '1px solid rgba(255, 255, 255, 0.08)',
                        color: '#FFFFFF',
                        fontSize: '0.7rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 4,
                        cursor: 'pointer'
                      }}
                    >
                      <span>{t.icon}</span>
                      <span>{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--luma-text-secondary)', fontWeight: 700 }}>
                    DATE
                  </label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    style={{
                      padding: '8px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#FFFFFF',
                      fontSize: '0.78rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--luma-text-secondary)', fontWeight: 700 }}>
                    HOST
                  </label>
                  <input
                    type="text"
                    placeholder="Host Name"
                    value={newHost}
                    onChange={(e) => setNewHost(e.target.value)}
                    style={{
                      padding: '8px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#FFFFFF',
                      fontSize: '0.78rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {createError && (
                <span style={{ color: 'var(--luma-pink-luma)', fontSize: '0.76rem', textAlign: 'center' }}>
                  {createError}
                </span>
              )}

              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1.5,
                    padding: '10px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #E5487D 0%, #8B3FD1 100%)',
                    border: 'none',
                    color: '#FFFFFF',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 800,
                    fontSize: '0.88rem',
                    cursor: 'pointer'
                  }}
                >
                  Save & Select
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================
          MODAL 3: SETTINGS MODAL
          =================================================================== */}
      {showSettingsModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(5, 4, 15, 0.88)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '20px',
            boxSizing: 'border-box'
          }}
          onClick={() => setShowSettingsModal(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '360px',
              backgroundColor: '#0D0B1C',
              border: '1.5px solid rgba(229, 72, 125, 0.4)',
              borderRadius: '24px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.9)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <ShieldCheck size={18} color="var(--luma-pink-luma)" />
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1rem', color: '#FFFFFF' }}>
                  Studio Calibration Access
                </span>
              </div>
              <button
                onClick={() => setShowSettingsModal(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--luma-text-muted)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--luma-text-secondary)' }}>
              Enter Operator PIN to access camera optics calibration and system diagnostics (Default: 1234).
            </p>

            <form onSubmit={handleUnlockStudio} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
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
                  padding: '12px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  border: `1px solid ${pinError ? 'var(--luma-pink-luma)' : 'rgba(185, 167, 255, 0.3)'}`,
                  color: '#FFFFFF',
                  fontSize: '1.2rem',
                  textAlign: 'center',
                  letterSpacing: '0.2em',
                  fontFamily: 'var(--font-mono)',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />

              {pinError && (
                <span style={{ color: 'var(--luma-pink-luma)', fontSize: '0.74rem', textAlign: 'center' }}>
                  Incorrect PIN. Please try again.
                </span>
              )}

              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowSettingsModal(false);
                    setStudioSection('camera');
                    switchMode('studio');
                  }}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#FFFFFF',
                    fontSize: '0.78rem',
                    cursor: 'pointer'
                  }}
                >
                  Quick Open
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1.4,
                    padding: '10px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #E5487D 0%, #8B3FD1 100%)',
                    border: 'none',
                    color: '#FFFFFF',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 800,
                    fontSize: '0.84rem',
                    cursor: 'pointer'
                  }}
                >
                  Unlock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================
          MODAL 4: SUBSCRIPTION / WATERMARK MODAL
          =================================================================== */}
      <SubscriptionWatermarkModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        onSubscribed={() => {
          showToast('Pro watermark removed & unlocked!');
        }}
      />
    </div>
  );
};

export default EventDashboardPage;
