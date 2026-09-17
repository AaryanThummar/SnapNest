// src/components/shell/StudioShell.tsx
import React from 'react';
import { useApp } from '../../context/AppContext';
import { STUDIO_SECTIONS } from '../../utils/appConstants';
import { StudioWorkspace } from '../../views/studio/StudioWorkspace';
import { 
  Camera, Sliders, LayoutGrid, Sticker, Wand2, Sparkles, Layers, Type, 
  Users, Printer, Share2, Mail, Bot, ClipboardCheck, Calendar, Settings,
  Play
} from 'lucide-react';

export const StudioShell: React.FC = () => {
  const { 
    studioSection, 
    setStudioSection, 
    switchMode, 
    deviceViewport 
  } = useApp();

  const getSectionIcon = (iconName: string, size = 18) => {
    switch (iconName) {
      case 'Camera': return <Camera size={size} />;
      case 'Sliders': return <Sliders size={size} />;
      case 'LayoutGrid': return <LayoutGrid size={size} />;
      case 'Sticker': return <Sticker size={size} />;
      case 'Wand2': return <Wand2 size={size} />;
      case 'Sparkles': return <Sparkles size={size} />;
      case 'Layers': return <Layers size={size} />;
      case 'Type': return <Type size={size} />;
      case 'Users': return <Users size={size} />;
      case 'Printer': return <Printer size={size} />;
      case 'Share2': return <Share2 size={size} />;
      case 'Mail': return <Mail size={size} />;
      case 'Bot': return <Bot size={size} />;
      case 'ClipboardCheck': return <ClipboardCheck size={size} />;
      case 'Calendar': return <Calendar size={size} />;
      case 'Settings': return <Settings size={size} />;
      default: return <Sliders size={size} />;
    }
  };

  const captureSections = STUDIO_SECTIONS.filter(s => s.group === 'capture');
  const outputSections = STUDIO_SECTIONS.filter(s => s.group === 'output');
  const eventSections = STUDIO_SECTIONS.filter(s => s.group === 'event');

  const isLandscape = deviceViewport === 'tablet_landscape';

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--luma-bg)',
        overflow: 'hidden'
      }}
    >
      {/* Top Pro Control Header */}
      <header
        style={{
          width: '100%',
          height: '56px',
          padding: '0 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--luma-border-subtle)',
          background: 'rgba(11, 10, 17, 0.9)',
          backdropFilter: 'blur(12px)',
          zIndex: 40,
          flexShrink: 0
        }}
      >
        {/* Left Brand & Event Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img
            src="/assets/lumabooth-logo.png"
            alt="LumaBooth Logo"
            style={{ height: '26px', objectFit: 'contain' }}
          />

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '3px 10px',
              borderRadius: 'var(--radius-pill)',
              background: 'rgba(6, 214, 160, 0.12)',
              border: '1px solid rgba(6, 214, 160, 0.25)',
              fontSize: '0.72rem',
              fontWeight: 700,
              color: 'var(--luma-brand-emerald)'
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--luma-brand-emerald)' }} />
            <span>BOOTH ONLINE</span>
          </div>
        </div>

        {/* Right Action: Event Hub & Launch Guest Kiosk Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.history.pushState({}, '', '/');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }
            }}
            style={{
              padding: '6px 14px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(185, 167, 255, 0.25)',
              color: '#FFFFFF',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              fontSize: '0.74rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <span>← Event Hub</span>
          </button>

          <button
            onClick={() => switchMode('guest')}
            className="luma-btn luma-btn-primary luma-btn-sm"
            style={{
              padding: '8px 16px',
              boxShadow: '0 4px 16px rgba(224, 38, 120, 0.4)'
            }}
          >
            <Play size={14} fill="#FFFFFF" />
            <span>Launch Guest Kiosk</span>
          </button>
        </div>
      </header>

      {/* Main Studio Body Container */}
      <div
        style={{
          flex: 1,
          width: '100%',
          height: 'calc(100% - 56px)',
          display: 'flex',
          flexDirection: isLandscape ? 'row' : 'column',
          overflow: 'hidden'
        }}
      >
        {/* Left Navigation Rail (Tablet Landscape) */}
        {isLandscape ? (
          <aside
            style={{
              width: '260px',
              height: '100%',
              background: 'var(--luma-surface-1)',
              borderRight: '1px solid var(--luma-border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              overflowY: 'auto',
              flexShrink: 0
            }}
          >
            <div style={{ padding: '14px 10px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Group 1: Capture & Creation */}
              <div>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--luma-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 8px' }}>
                  Capture & Creation
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginTop: 6 }}>
                  {captureSections.map((sec) => (
                    <button
                      key={sec.id}
                      onClick={() => setStudioSection(sec.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '9px 12px',
                        borderRadius: 'var(--radius-sm)',
                        background: studioSection === sec.id ? 'var(--luma-surface-3)' : 'transparent',
                        border: '1px solid',
                        borderColor: studioSection === sec.id ? 'var(--luma-brand-magenta)' : 'transparent',
                        color: studioSection === sec.id ? '#FFFFFF' : 'var(--luma-text-secondary)',
                        cursor: 'pointer',
                        fontSize: '0.82rem',
                        fontWeight: studioSection === sec.id ? 700 : 500,
                        textAlign: 'left',
                        transition: 'all 0.12s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {getSectionIcon(sec.iconName, 16)}
                        <span>{sec.shortTitle}</span>
                      </div>
                      {sec.badge && (
                        <span style={{ fontSize: '0.68rem', opacity: 0.7, fontFamily: 'var(--font-mono)' }}>
                          {sec.badge}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Group 2: Output & Engagement */}
              <div>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--luma-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 8px' }}>
                  Output & Engagement
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginTop: 6 }}>
                  {outputSections.map((sec) => (
                    <button
                      key={sec.id}
                      onClick={() => setStudioSection(sec.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '9px 12px',
                        borderRadius: 'var(--radius-sm)',
                        background: studioSection === sec.id ? 'var(--luma-surface-3)' : 'transparent',
                        border: '1px solid',
                        borderColor: studioSection === sec.id ? 'var(--luma-brand-magenta)' : 'transparent',
                        color: studioSection === sec.id ? '#FFFFFF' : 'var(--luma-text-secondary)',
                        cursor: 'pointer',
                        fontSize: '0.82rem',
                        fontWeight: studioSection === sec.id ? 700 : 500,
                        textAlign: 'left',
                        transition: 'all 0.12s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {getSectionIcon(sec.iconName, 16)}
                        <span>{sec.shortTitle}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Group 3: Event & System */}
              <div>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--luma-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 8px' }}>
                  Event & System
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginTop: 6 }}>
                  {eventSections.map((sec) => (
                    <button
                      key={sec.id}
                      onClick={() => setStudioSection(sec.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '9px 12px',
                        borderRadius: 'var(--radius-sm)',
                        background: studioSection === sec.id ? 'var(--luma-surface-3)' : 'transparent',
                        border: '1px solid',
                        borderColor: studioSection === sec.id ? 'var(--luma-brand-magenta)' : 'transparent',
                        color: studioSection === sec.id ? '#FFFFFF' : 'var(--luma-text-secondary)',
                        cursor: 'pointer',
                        fontSize: '0.82rem',
                        fontWeight: studioSection === sec.id ? 700 : 500,
                        textAlign: 'left',
                        transition: 'all 0.12s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {getSectionIcon(sec.iconName, 16)}
                        <span>{sec.shortTitle}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Live Camera Viewfinder Mini-Monitor */}
            <div
              style={{
                margin: '10px',
                padding: '10px',
                background: 'var(--luma-surface-2)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--luma-border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: 6
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--luma-text-secondary)' }}>
                  LIVE VIEWPORT
                </span>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--luma-brand-emerald)' }} />
              </div>
              <div
                style={{
                  width: '100%',
                  aspectRatio: '16/9',
                  borderRadius: 'var(--radius-xs)',
                  overflow: 'hidden',
                  position: 'relative'
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
                  alt="mini preview"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>
          </aside>
        ) : (
          /* Top Module Scroll Bar (Phone & Tablet Portrait) */
          <div
            style={{
              width: '100%',
              background: 'var(--luma-surface-1)',
              borderBottom: '1px solid var(--luma-border-subtle)',
              padding: '8px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              overflowX: 'auto',
              flexShrink: 0
            }}
          >
            {STUDIO_SECTIONS.map((sec) => (
              <button
                key={sec.id}
                onClick={() => setStudioSection(sec.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-pill)',
                  background: studioSection === sec.id ? 'var(--luma-brand-magenta)' : 'var(--luma-surface-2)',
                  border: '1px solid',
                  borderColor: studioSection === sec.id ? 'var(--luma-brand-magenta)' : 'var(--luma-border-subtle)',
                  color: studioSection === sec.id ? '#FFFFFF' : 'var(--luma-text-secondary)',
                  cursor: 'pointer',
                  fontSize: '0.78rem',
                  fontWeight: studioSection === sec.id ? 700 : 500,
                  whiteSpace: 'nowrap'
                }}
              >
                {getSectionIcon(sec.iconName, 14)}
                <span>{sec.shortTitle}</span>
              </button>
            ))}
          </div>
        )}

        {/* Main Studio Workspace Inspector */}
        <main style={{ flex: 1, height: '100%', display: 'flex', overflow: 'hidden' }}>
          <StudioWorkspace />
        </main>
      </div>
    </div>
  );
};
