// src/views/guest/AuthStep.tsx
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, Sparkles, LogIn, ArrowRight, UserPlus, Zap } from 'lucide-react';

export const AuthStep: React.FC = () => {
  const { goToGuestStep, updateGuestProfile, guestProfile, isPhone } = useApp();
  const [authMode, setAuthMode] = useState<'options' | 'input_name'>('options');
  const [tempName, setTempName] = useState(guestProfile.name || '');

  const handleContinueAsGuest = () => {
    updateGuestProfile({ isGuest: true, name: 'VIP Guest' });
    goToGuestStep('personalized_welcome');
  };

  const handleLoginWithName = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempName.trim()) {
      updateGuestProfile({ name: tempName.trim(), isGuest: false });
      goToGuestStep('personalized_welcome');
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
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: isPhone ? '16px 20px 20px 20px' : '24px',
        maxWidth: '440px',
        margin: '0 auto',
        gap: 16
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 4, marginTop: isPhone ? 4 : 12 }}>
        <div
          style={{
            width: isPhone ? 42 : 48,
            height: isPhone ? 42 : 48,
            borderRadius: '50%',
            background: 'var(--luma-surface-2)',
            border: '1px solid var(--luma-border-medium)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 4px auto',
            color: 'var(--luma-brand-pink)'
          }}
        >
          <User size={isPhone ? 20 : 24} />
        </div>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: isPhone ? '1.5rem' : '1.8rem',
            fontWeight: 800,
            letterSpacing: '-0.02em'
          }}
        >
          {authMode === 'options' ? 'How would you like to check in?' : 'What is your name?'}
        </h2>
        <p style={{ color: 'var(--luma-text-secondary)', fontSize: '0.85rem' }}>
          {authMode === 'options'
            ? 'Access your photos later or jump straight into the booth.'
            : 'We will personalize your photostrips & gallery.'}
        </p>
      </div>

      {authMode === 'options' ? (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10, margin: 'auto 0' }}>
          {/* Quick Continue as Guest */}
          <div
            onClick={handleContinueAsGuest}
            className="luma-studio-card interactive active"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: isPhone ? '14px 16px' : '18px 20px',
              borderRadius: 'var(--radius-md)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--luma-grad-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF'
                }}
              >
                <Zap size={20} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: 700, fontSize: '0.98rem' }}>Continue as Guest</span>
                <span style={{ fontSize: '0.76rem', color: 'var(--luma-text-secondary)' }}>Instant 1-tap fast start</span>
              </div>
            </div>
            <ArrowRight size={18} color="var(--luma-brand-pink)" />
          </div>

          {/* Enter Name / Sign Up */}
          <div
            onClick={() => setAuthMode('input_name')}
            className="luma-studio-card interactive"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: isPhone ? '14px 16px' : '18px 20px',
              borderRadius: 'var(--radius-md)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--luma-surface-3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--luma-brand-lavender)'
                }}
              >
                <UserPlus size={20} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: 700, fontSize: '0.98rem' }}>Sign In / Personalize</span>
                <span style={{ fontSize: '0.76rem', color: 'var(--luma-text-secondary)' }}>Custom name on photostrip</span>
              </div>
            </div>
            <ArrowRight size={18} color="var(--luma-text-muted)" />
          </div>

          {/* Member Login Option */}
          <div
            onClick={() => {
              updateGuestProfile({ name: 'Camila Rodriguez', isGuest: false });
              goToGuestStep('personalized_welcome');
            }}
            className="luma-studio-card interactive"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: isPhone ? '14px 16px' : '18px 20px',
              borderRadius: 'var(--radius-md)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--luma-surface-3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--luma-brand-gold)'
                }}
              >
                <LogIn size={20} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: 700, fontSize: '0.98rem' }}>VIP Guest Member</span>
                <span style={{ fontSize: '0.76rem', color: 'var(--luma-text-secondary)' }}>Restore saved event profile</span>
              </div>
            </div>
            <ArrowRight size={18} color="var(--luma-text-muted)" />
          </div>
        </div>
      ) : (
        <form onSubmit={handleLoginWithName} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 14, margin: 'auto 0' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--luma-text-secondary)' }}>Your Name</label>
            <input
              type="text"
              autoFocus
              placeholder="e.g. Maya & Lucas"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--luma-surface-2)',
                border: '1px solid var(--luma-border-strong)',
                color: '#FFFFFF',
                fontSize: '1.05rem',
                outline: 'none',
                fontFamily: 'var(--font-body)'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button
              type="button"
              onClick={() => setAuthMode('options')}
              className="luma-btn luma-btn-secondary"
              style={{ flex: 1 }}
            >
              Back
            </button>
            <button
              type="submit"
              disabled={!tempName.trim()}
              className="luma-btn luma-btn-primary"
              style={{ flex: 2, opacity: tempName.trim() ? 1 : 0.5 }}
            >
              <Sparkles size={16} />
              <span>Continue</span>
            </button>
          </div>
        </form>
      )}

      {/* Skip / Back button */}
      <button
        onClick={() => goToGuestStep('welcome')}
        className="luma-btn luma-btn-ghost luma-btn-sm"
        style={{ marginTop: 'auto' }}
      >
        <span>Cancel & return to Welcome</span>
      </button>
    </div>
  );
};
