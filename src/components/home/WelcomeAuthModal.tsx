// src/components/home/WelcomeAuthModal.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { soundEngine } from '../../utils/audio';

interface WelcomeAuthModalProps {
  /** Called when the user dismisses as guest — continues normally */
  onGuest: () => void;
  /** Called after successful login/signup — continues normally */
  onAuthenticated: () => void;
}

type AuthView = 'welcome' | 'login' | 'signup';

export const WelcomeAuthModal: React.FC<WelcomeAuthModalProps> = ({ onGuest, onAuthenticated }) => {
  const [visible, setVisible] = useState(false);
  const [view, setView] = useState<AuthView>('welcome');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState(false);

  // Fade in on mount
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 30);
    return () => clearTimeout(t);
  }, []);

  const handleGuest = useCallback(() => {
    soundEngine.playTap();
    setVisible(false);
    setTimeout(onGuest, 280);
  }, [onGuest]);

  const handleAuthSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playSuccessChime();
    setSuccess(true);
    setTimeout(() => {
      setVisible(false);
      setTimeout(onAuthenticated, 280);
    }, 1100);
  }, [onAuthenticated]);

  const handleSwitchView = (v: AuthView) => {
    soundEngine.playTap();
    setView(v);
    setSuccess(false);
    setEmail('');
    setPassword('');
  };

  return (
    <div
      id="welcome-auth-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9500,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        background: 'rgba(4, 3, 14, 0.78)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: visible ? 'auto' : 'none'
      }}
      aria-modal="true"
      role="dialog"
      aria-label="Welcome to LumaBooth"
    >
      {/* Modal Card */}
      <div
        id="welcome-auth-card"
        style={{
          width: '100%',
          maxWidth: '400px',
          background: 'linear-gradient(160deg, #13112A 0%, #1C1838 60%, #221A3E 100%)',
          borderRadius: '28px',
          border: '1px solid rgba(139, 77, 255, 0.28)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(185,167,255,0.08), 0 0 60px rgba(139,77,255,0.12)',
          overflow: 'hidden',
          transform: visible ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.97)',
          transition: 'transform 0.4s cubic-bezier(0.34, 1.28, 0.64, 1)',
          position: 'relative'
        }}
      >
        {/* Top accent bar */}
        <div style={{
          height: '3px',
          background: 'linear-gradient(90deg, #8B4DFF 0%, #D83C9D 50%, #E83E7A 100%)',
          opacity: 0.9
        }} />

        <div style={{ padding: '32px 28px 28px' }}>
          {/* ─── WELCOME VIEW ─── */}
          {view === 'welcome' && (
            <>
              {/* Logo */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <div style={{
                  padding: '10px 28px',
                  background: 'rgba(0,0,0,0.6)',
                  borderRadius: '14px',
                  border: '1px solid rgba(139,77,255,0.3)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
                }}>
                  <img
                    src="/assets/lumabooth-logo.png"
                    alt="LumaBooth"
                    style={{
                      height: '38px',
                      width: 'auto',
                      objectFit: 'contain',
                      display: 'block',
                      filter: 'drop-shadow(0 2px 8px rgba(139,77,255,0.4))'
                    }}
                  />
                </div>
              </div>

              {/* Headline */}
              <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                <h2 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(22px, 5.5vw, 28px)',
                  fontWeight: 800,
                  color: '#F7F5FF',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.2,
                  margin: '0 0 8px'
                }}>
                  Welcome to LumaBooth ✨
                </h2>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '13.5px',
                  color: '#9B99BC',
                  lineHeight: 1.5,
                  margin: 0
                }}>
                  Sign in to save your memories, or jump straight into the booth.
                </p>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {/* LOGIN */}
                <button
                  id="auth-modal-login-btn"
                  onClick={() => handleSwitchView('login')}
                  style={{
                    width: '100%',
                    padding: '14px 20px',
                    background: 'linear-gradient(135deg, #7928CA 0%, #B81B6C 55%, #E83E7A 100%)',
                    border: 'none',
                    borderRadius: '14px',
                    color: '#fff',
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px',
                    fontWeight: 800,
                    letterSpacing: '0.06em',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 20px rgba(184,27,108,0.4)',
                    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                    touchAction: 'manipulation'
                  }}
                  onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-1px)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
                >
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9A3.75 3.75 0 1112 5.25 3.75 3.75 0 0115.75 9zM3 20.25a9 9 0 0118 0" />
                  </svg>
                  LOGIN
                </button>

                {/* SIGN UP */}
                <button
                  id="auth-modal-signup-btn"
                  onClick={() => handleSwitchView('signup')}
                  style={{
                    width: '100%',
                    padding: '14px 20px',
                    background: 'rgba(139,77,255,0.12)',
                    border: '1.5px solid rgba(139,77,255,0.4)',
                    borderRadius: '14px',
                    color: '#C4AFFF',
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px',
                    fontWeight: 800,
                    letterSpacing: '0.06em',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'border-color 0.15s ease, background 0.15s ease',
                    touchAction: 'manipulation'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'rgba(139,77,255,0.7)';
                    e.currentTarget.style.background = 'rgba(139,77,255,0.2)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(139,77,255,0.4)';
                    e.currentTarget.style.background = 'rgba(139,77,255,0.12)';
                  }}
                >
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5m7-7l-7 7 7 7" />
                  </svg>
                  SIGN UP
                </button>

                {/* Divider */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  margin: '4px 0'
                }}>
                  <div style={{ flex: 1, height: '1px', background: 'rgba(185,167,255,0.12)' }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#5D5B78', letterSpacing: '0.06em' }}>OR</span>
                  <div style={{ flex: 1, height: '1px', background: 'rgba(185,167,255,0.12)' }} />
                </div>

                {/* Continue as Guest */}
                <button
                  id="auth-modal-guest-btn"
                  onClick={handleGuest}
                  style={{
                    width: '100%',
                    padding: '12px 20px',
                    background: 'transparent',
                    border: '1px solid rgba(185,167,255,0.15)',
                    borderRadius: '14px',
                    color: '#8E8CA8',
                    fontFamily: 'var(--font-body)',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'color 0.15s ease, border-color 0.15s ease',
                    touchAction: 'manipulation'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = '#B9A7FF';
                    e.currentTarget.style.borderColor = 'rgba(185,167,255,0.3)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = '#8E8CA8';
                    e.currentTarget.style.borderColor = 'rgba(185,167,255,0.15)';
                  }}
                >
                  Continue as Guest
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </button>
              </div>

              {/* Footer */}
              <p style={{
                textAlign: 'center',
                marginTop: '20px',
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                color: '#403E58',
                letterSpacing: '0.05em'
              }}>
                YOUR BOOTH · YOUR MOMENT · LUMA 2026
              </p>
            </>
          )}

          {/* ─── LOGIN / SIGNUP VIEW ─── */}
          {(view === 'login' || view === 'signup') && (
            <>
              {/* Back button */}
              <button
                onClick={() => handleSwitchView('welcome')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#8B4DFF',
                  fontFamily: 'var(--font-body)',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: '0 0 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  touchAction: 'manipulation'
                }}
              >
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                Back
              </button>

              {success ? (
                /* Success state */
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '24px 0 16px',
                  textAlign: 'center'
                }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #8B4DFF, #E83E7A)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 24px rgba(139,77,255,0.4)'
                  }}>
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <h3 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '20px',
                    fontWeight: 800,
                    color: '#F7F5FF',
                    margin: 0
                  }}>
                    {view === 'login' ? 'Welcome back!' : 'Account created!'}
                  </h3>
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '13px',
                    color: '#9B99BC',
                    margin: 0
                  }}>
                    Entering LumaBooth now…
                  </p>
                </div>
              ) : (
                <form
                  id={view === 'login' ? 'auth-login-form' : 'auth-signup-form'}
                  onSubmit={handleAuthSubmit}
                  style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
                >
                  <div>
                    <h3 style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '20px',
                      fontWeight: 800,
                      color: '#F7F5FF',
                      margin: '0 0 4px'
                    }}>
                      {view === 'login' ? 'Log In' : 'Create Account'}
                    </h3>
                    <p style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '12.5px',
                      color: '#9B99BC',
                      margin: 0
                    }}>
                      {view === 'login'
                        ? 'Sync your photos and memories to your account.'
                        : 'Get instant cloud access to all your event photos.'}
                    </p>
                  </div>

                  {/* Email */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      fontWeight: 700,
                      color: '#6E6C88',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      marginBottom: '6px'
                    }}>
                      Email Address
                    </label>
                    <input
                      id={`auth-${view}-email`}
                      type="email"
                      required
                      autoFocus
                      placeholder="name@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        borderRadius: '10px',
                        border: '1.5px solid rgba(139,77,255,0.25)',
                        background: 'rgba(13,11,28,0.8)',
                        color: '#F7F5FF',
                        fontFamily: 'var(--font-body)',
                        fontSize: '14px',
                        outline: 'none',
                        boxSizing: 'border-box',
                        transition: 'border-color 0.15s ease'
                      }}
                      onFocus={e => (e.currentTarget.style.borderColor = 'rgba(139,77,255,0.7)')}
                      onBlur={e => (e.currentTarget.style.borderColor = 'rgba(139,77,255,0.25)')}
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      fontWeight: 700,
                      color: '#6E6C88',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      marginBottom: '6px'
                    }}>
                      Password
                    </label>
                    <input
                      id={`auth-${view}-password`}
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        borderRadius: '10px',
                        border: '1.5px solid rgba(139,77,255,0.25)',
                        background: 'rgba(13,11,28,0.8)',
                        color: '#F7F5FF',
                        fontFamily: 'var(--font-body)',
                        fontSize: '14px',
                        outline: 'none',
                        boxSizing: 'border-box',
                        transition: 'border-color 0.15s ease'
                      }}
                      onFocus={e => (e.currentTarget.style.borderColor = 'rgba(139,77,255,0.7)')}
                      onBlur={e => (e.currentTarget.style.borderColor = 'rgba(139,77,255,0.25)')}
                    />
                  </div>

                  {/* Submit */}
                  <button
                    id={`auth-${view}-submit`}
                    type="submit"
                    style={{
                      width: '100%',
                      padding: '13px 20px',
                      background: 'linear-gradient(135deg, #7928CA 0%, #B81B6C 55%, #E83E7A 100%)',
                      border: 'none',
                      borderRadius: '12px',
                      color: '#fff',
                      fontFamily: 'var(--font-body)',
                      fontSize: '14px',
                      fontWeight: 800,
                      letterSpacing: '0.04em',
                      cursor: 'pointer',
                      boxShadow: '0 4px 18px rgba(184,27,108,0.35)',
                      marginTop: '2px',
                      touchAction: 'manipulation'
                    }}
                  >
                    {view === 'login' ? 'Log In & Continue' : 'Sign Up & Continue'}
                  </button>

                  {/* Switch link */}
                  <p style={{
                    textAlign: 'center',
                    fontFamily: 'var(--font-body)',
                    fontSize: '12px',
                    color: '#6E6C88',
                    margin: 0
                  }}>
                    {view === 'login' ? "Don't have an account? " : 'Already have an account? '}
                    <button
                      type="button"
                      onClick={() => handleSwitchView(view === 'login' ? 'signup' : 'login')}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#B9A7FF',
                        fontWeight: 700,
                        fontSize: '12px',
                        cursor: 'pointer',
                        padding: 0,
                        fontFamily: 'var(--font-body)'
                      }}
                    >
                      {view === 'login' ? 'Sign Up' : 'Log In'}
                    </button>
                  </p>

                  {/* Guest fallback */}
                  <button
                    type="button"
                    onClick={handleGuest}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#5D5B78',
                      fontFamily: 'var(--font-body)',
                      fontSize: '11.5px',
                      cursor: 'pointer',
                      padding: '0',
                      textAlign: 'center',
                      touchAction: 'manipulation'
                    }}
                  >
                    Skip — Continue as Guest →
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
