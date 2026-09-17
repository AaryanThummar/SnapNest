// src/components/home/PhotoFrame.tsx
import React, { useState } from 'react';
import { soundEngine } from '../../utils/audio';

interface PhotoFrameProps {
  side: 'left' | 'right';
  imageSrc: string;
  caption: string;
  isPhone?: boolean;
}

export const PhotoFrame: React.FC<PhotoFrameProps> = ({ side, imageSrc, caption, isPhone = false }) => {
  const [isLifted, setIsLifted] = useState(false);

  const handleTap = () => {
    soundEngine.playTap();
    setIsLifted(true);
    setTimeout(() => setIsLifted(false), 350);
  };

  const isLeft = side === 'left';
  const liftRotation = isLeft ? '-10deg' : '8.5deg';

  return (
    <div
      onClick={handleTap}
      style={{
        position: 'absolute',
        bottom: isPhone ? (isLeft ? '14%' : '18%') : (isLeft ? '10%' : '14%'),
        left: isLeft ? (isPhone ? '-8px' : '5%') : undefined,
        right: !isLeft ? (isPhone ? '-8px' : '5%') : undefined,
        width: isPhone ? '88px' : '124px',
        backgroundColor: '#FFFFFF',
        padding: isPhone ? '5px 5px 16px 5px' : '7px 7px 22px 7px',
        borderRadius: '2px',
        boxShadow: '0 12px 24px rgba(90, 20, 60, 0.1)',
        zIndex: 1,
        border: '1px solid rgba(255, 182, 193, 0.3)',
        cursor: 'pointer',
        animation: isLeft ? 'floatSubtlePolaroid 7s ease-in-out infinite' : 'floatSubtleRight 8s ease-in-out infinite',
        transform: isLifted ? `scale(1.06) rotate(${liftRotation})` : undefined,
        transition: 'transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)',
        pointerEvents: 'auto'
      }}
      title="Sample Polaroid"
    >
      {/* Washi Tape */}
      <div
        style={{
          position: 'absolute',
          top: '-6px',
          left: isLeft ? '20%' : undefined,
          right: !isLeft ? '20%' : undefined,
          width: '36px',
          height: '14px',
          backgroundColor: 'rgba(255, 218, 226, 0.85)',
          borderLeft: '1px dashed rgba(224, 38, 120, 0.3)',
          borderRight: '1px dashed rgba(224, 38, 120, 0.3)',
          transform: isLeft ? 'rotate(-6deg)' : 'rotate(6deg)'
        }}
      />

      {/* Polaroid Image */}
      <div style={{ width: '100%', aspectRatio: '1/1', overflow: 'hidden', borderRadius: '1px', background: '#F8DCE5' }}>
        <img
          src={imageSrc}
          alt={caption}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      {/* Handwritten Caption */}
      <div
        style={{
          position: 'absolute',
          bottom: isPhone ? '2px' : '4px',
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: 'var(--font-hand)',
          fontSize: isPhone ? '0.74rem' : '0.92rem',
          color: '#E02678'
        }}
      >
        {caption}
      </div>
    </div>
  );
};
