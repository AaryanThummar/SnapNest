// src/components/home/AuthOptions.tsx
import React from 'react';
import { soundEngine } from '../../utils/audio';

interface AuthOptionsProps {
  onLogin: () => void;
  onSignup: () => void;
  onGuest: () => void;
}

export const AuthOptions: React.FC<AuthOptionsProps> = ({ onLogin, onSignup, onGuest }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 5,
        marginTop: 2
      }}
    >
      {/* Log in • Sign up */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button
          onClick={() => {
            soundEngine.playTap();
            onLogin();
          }}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--luma-lavender)',
            fontSize: '0.84rem',
            fontWeight: 700,
            fontFamily: 'var(--font-body)',
            cursor: 'pointer',
            padding: '4px 6px',
            touchAction: 'manipulation',
            transition: 'color 0.15s ease'
          }}
        >
          Log in
        </button>
        <span style={{ color: 'var(--luma-text-muted)', fontSize: '0.75rem' }}>•</span>
        <button
          onClick={() => {
            soundEngine.playTap();
            onSignup();
          }}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--luma-lavender)',
            fontSize: '0.84rem',
            fontWeight: 700,
            fontFamily: 'var(--font-body)',
            cursor: 'pointer',
            padding: '4px 6px',
            touchAction: 'manipulation',
            transition: 'color 0.15s ease'
          }}
        >
          Sign up
        </button>
      </div>

      {/* Continue as Guest → */}
      <button
        onClick={() => {
          soundEngine.playTap();
          onGuest();
        }}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'var(--luma-pink-luma)',
          fontSize: '0.8rem',
          fontWeight: 700,
          fontFamily: 'var(--font-body)',
          cursor: 'pointer',
          padding: '2px 4px',
          touchAction: 'manipulation'
        }}
      >
        Continue as Guest →
      </button>

      {/* Small Metadata Detail */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontSize: '0.66rem',
          fontFamily: 'var(--font-mono)',
          color: 'var(--luma-text-muted)',
          letterSpacing: '0.04em',
          marginTop: 1
        }}
      >
        <span>Your booth. Your moment. Your story.</span>
        <span style={{ color: 'var(--luma-purple-electric)' }}>•</span>
        <span style={{ fontWeight: 700 }}>LUMA 2026</span>
      </div>
    </div>
  );
};
