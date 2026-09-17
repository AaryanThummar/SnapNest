// src/components/events/EventSwitcherModal.tsx
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { soundEngine } from '../../utils/audio';
import { 
  X, 
  Sparkles, 
  Plus, 
  Check, 
  Trash2, 
  Calendar, 
  User, 
  KeyRound,
  Layers
} from 'lucide-react';

interface EventSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EventSwitcherModal: React.FC<EventSwitcherModalProps> = ({ isOpen, onClose }) => {
  const { 
    activeEvent, 
    allEvents, 
    switchActiveEvent, 
    deleteEvent, 
    goToGuestStep, 
    isPhone 
  } = useApp();

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCreateNew = () => {
    soundEngine.playTap();
    onClose();
    goToGuestStep('create_event');
  };

  const handleSelectEvent = (id: string) => {
    soundEngine.playTap();
    switchActiveEvent(id);
    onClose();
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.playTap();
    if (confirmDeleteId === id) {
      deleteEvent(id);
      setConfirmDeleteId(null);
    } else {
      setConfirmDeleteId(id);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 4, 15, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: isPhone ? '14px' : '24px',
        boxSizing: 'border-box',
        userSelect: 'none'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '520px',
          maxHeight: '90vh',
          backgroundColor: '#0D0B1C',
          border: '1px solid rgba(185, 167, 255, 0.25)',
          borderRadius: '24px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 35px var(--event-glow, rgba(229, 72, 125, 0.3))',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxSizing: 'border-box'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={16} color="var(--event-primary, #E5487D)" />
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1rem', color: '#FFFFFF' }}>
              EVENT & THEME MANAGER
            </span>
          </div>

          <button
            onClick={() => {
              soundEngine.playTap();
              onClose();
            }}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
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

        {/* Scrollable Body */}
        <div
          style={{
            padding: '18px 20px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          {/* Section: ACTIVE EVENT */}
          {activeEvent ? (
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1.5px solid var(--event-primary, #E5487D)',
                borderRadius: '16px',
                padding: '14px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                boxShadow: '0 0 20px var(--event-glow, rgba(229, 72, 125, 0.25))'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span
                  style={{
                    fontSize: '0.64rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 800,
                    color: 'var(--event-primary, #E5487D)',
                    letterSpacing: '0.08em'
                  }}
                >
                  ● CURRENT ACTIVE EVENT
                </span>

                {/* Theme Swatch */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <div
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: activeEvent.theme?.primaryColor || '#E5487D'
                    }}
                  />
                  <div
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: activeEvent.theme?.secondaryColor || '#8B3FD1'
                    }}
                  />
                  <span style={{ fontSize: '0.66rem', fontFamily: 'var(--font-mono)', color: 'var(--luma-text-secondary)', marginLeft: '4px' }}>
                    {activeEvent.theme?.themeName || 'Default'}
                  </span>
                </div>
              </div>

              <div>
                <h3 style={{ margin: '0 0 4px 0', fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 900, color: '#FFFFFF' }}>
                  {activeEvent.eventName}
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '0.74rem', color: 'var(--luma-text-secondary)', fontFamily: 'var(--font-mono)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={12} />
                    {activeEvent.eventDate}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Layers size={12} />
                    {activeEvent.eventType}
                  </span>
                  {activeEvent.hostName && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <User size={12} />
                      {activeEvent.hostName}
                    </span>
                  )}
                  {activeEvent.eventCode && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <KeyRound size={12} />
                      {activeEvent.eventCode}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px dashed rgba(255, 255, 255, 0.2)',
                borderRadius: '16px',
                padding: '16px',
                textAlign: 'center',
                color: 'var(--luma-text-secondary)',
                fontSize: '0.82rem',
                fontFamily: 'var(--font-mono)'
              }}
            >
              No active event configured. Using default theme.
            </div>
          )}

          {/* Section: ALL SAVED EVENTS */}
          {allEvents.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--luma-lavender)' }}>
                SAVED EVENTS ({allEvents.length})
              </span>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {allEvents.map((evt) => {
                  const isActive = activeEvent?.id === evt.id;
                  const isConfirming = confirmDeleteId === evt.id;
                  return (
                    <div
                      key={evt.id}
                      onClick={() => !isActive && handleSelectEvent(evt.id)}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '12px',
                        backgroundColor: isActive ? 'rgba(229, 72, 125, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                        border: isActive ? '1px solid var(--event-primary, #E5487D)' : '1px solid rgba(255, 255, 255, 0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: isActive ? 'default' : 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                        <div
                          style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            backgroundColor: evt.theme?.primaryColor || '#E5487D',
                            flexShrink: 0
                          }}
                        />
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: '0.86rem', fontFamily: 'var(--font-display)', fontWeight: 800, color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {evt.eventName}
                          </div>
                          <div style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--luma-text-secondary)' }}>
                            {evt.eventType} • {evt.eventDate}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                        {isActive ? (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '3px 8px',
                              borderRadius: '9999px',
                              backgroundColor: 'rgba(229, 72, 125, 0.25)',
                              color: '#FFFFFF',
                              fontSize: '0.66rem',
                              fontFamily: 'var(--font-mono)',
                              fontWeight: 700
                            }}
                          >
                            <Check size={11} strokeWidth={3} /> ACTIVE
                          </span>
                        ) : (
                          <button
                            onClick={() => handleSelectEvent(evt.id)}
                            style={{
                              padding: '5px 10px',
                              borderRadius: '8px',
                              backgroundColor: 'rgba(255, 255, 255, 0.08)',
                              border: '1px solid rgba(255, 255, 255, 0.15)',
                              color: '#FFFFFF',
                              fontSize: '0.68rem',
                              fontFamily: 'var(--font-mono)',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            SWITCH
                          </button>
                        )}

                        {/* Delete Button */}
                        <button
                          onClick={(e) => handleDelete(evt.id, e)}
                          title="Delete Event"
                          style={{
                            padding: '6px',
                            borderRadius: '8px',
                            backgroundColor: isConfirming ? '#EF4444' : 'rgba(255, 255, 255, 0.05)',
                            border: 'none',
                            color: '#FFFFFF',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div
          style={{
            padding: '14px 20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            flexShrink: 0
          }}
        >
          <button
            onClick={() => {
              soundEngine.playTap();
              onClose();
              if (typeof window !== 'undefined') {
                window.history.pushState({}, '', '/');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }
            }}
            style={{
              flex: 1,
              minHeight: '44px',
              borderRadius: '9999px',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(185, 167, 255, 0.25)',
              color: '#FFFFFF',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: '0.8rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <span>EVENT HUB</span>
          </button>

          <button
            onClick={handleCreateNew}
            style={{
              flex: 1.4,
              minHeight: '44px',
              borderRadius: '9999px',
              background: 'var(--event-button-gradient, linear-gradient(135deg, #E5487D 0%, #8B3FD1 100%))',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: '#FFFFFF',
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: '0.84rem',
              letterSpacing: '0.04em',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: '0 6px 20px var(--event-glow, rgba(229, 72, 125, 0.35))'
            }}
          >
            <Plus size={15} strokeWidth={2.5} />
            <span>+ NEW EVENT</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventSwitcherModal;
