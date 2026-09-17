// src/components/home/HeroSection.tsx
import React from 'react';

interface HeroSectionProps {
  isPhone?: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ isPhone = false }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isPhone ? 'center' : 'flex-start',
        textAlign: isPhone ? 'center' : 'left',
        maxWidth: isPhone ? '320px' : '480px',
        zIndex: 10,
        position: 'relative'
      }}
    >
      {/* Top Tagline Pill */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '4px 12px',
          borderRadius: 'var(--radius-pill)',
          background: 'rgba(139, 77, 255, 0.12)',
          border: '1px solid rgba(139, 77, 255, 0.3)',
          marginBottom: 10
        }}
      >
        <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--luma-pink-luma)' }} />
        <span
          style={{
            fontSize: '0.7rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--luma-lavender)'
          }}
        >
          INTERACTIVE PHOTO STUDIO
        </span>
      </div>

      {/* Bold Display Heading */}
      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: isPhone ? 'clamp(2.1rem, 8.5vw, 2.7rem)' : '3.6rem',
          fontWeight: 900,
          lineHeight: 1.05,
          letterSpacing: '-0.03em',
          textTransform: 'uppercase',
          color: '#FFFFFF',
          margin: 0
        }}
      >
        YOUR MOMENT.<br />
        <span
          style={{
            background: 'linear-gradient(135deg, #F7F5FF 0%, #B9A7FF 40%, #E83E7A 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          YOUR BOOTH.
        </span>
      </h1>

      {/* Short Supporting Text */}
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: isPhone ? '0.9rem' : '1.05rem',
          fontWeight: 500,
          color: 'var(--luma-text-secondary)',
          marginTop: 10,
          lineHeight: 1.45,
          maxWidth: '380px'
        }}
      >
        Capture photos, create strips, play with friends and save the moment.
      </p>
    </div>
  );
};
