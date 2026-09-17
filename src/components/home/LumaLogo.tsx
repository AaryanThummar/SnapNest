// src/components/home/LumaLogo.tsx
import React from 'react';

interface LumaLogoProps {
  size?: 'sm' | 'md' | 'lg';
}

export const LumaLogo: React.FC<LumaLogoProps> = ({ size = 'md' }) => {
  const heightMap = {
    sm: '26px',
    md: '34px',
    lg: '42px'
  };

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '5px 16px',
        borderRadius: 'var(--radius-pill)',
        background: 'linear-gradient(135deg, rgba(17, 21, 45, 0.85) 0%, rgba(36, 19, 63, 0.8) 100%)',
        border: '1px solid rgba(139, 77, 255, 0.35)',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4), 0 0 15px rgba(139, 77, 255, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(8px)',
        transition: 'transform 0.15s ease'
      }}
      title="LumaBooth"
    >
      <img
        src="/assets/lumabooth-logo.png"
        alt="LumaBooth"
        style={{
          height: heightMap[size],
          maxWidth: '200px',
          objectFit: 'contain',
          display: 'block',
          filter: 'drop-shadow(0 2px 8px rgba(139, 77, 255, 0.3))'
        }}
      />
    </div>
  );
};
