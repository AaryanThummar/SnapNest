// src/components/home/PhotoStrip.tsx
import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { soundEngine } from '../../utils/audio';

interface PhotoStripProps {
  side: 'left' | 'right';
  imageSrc: string;
  isPhone?: boolean;
}

export const PhotoStrip: React.FC<PhotoStripProps> = ({ side, imageSrc, isPhone = false }) => {
  const [isLifted, setIsLifted] = useState(false);

  const handleTap = () => {
    soundEngine.playTap();
    setIsLifted(true);
    setTimeout(() => setIsLifted(false), 350);
  };

  const isLeft = side === 'left';
  const liftRotation = isLeft ? '-6.5deg' : '6.8deg';

  return (
    <div
      onClick={handleTap}
      style={{
        position: 'absolute',
        top: isPhone ? (isLeft ? '3%' : '5%') : (isLeft ? '6%' : '8%'),
        left: isLeft ? (isPhone ? '-14px' : '4%') : undefined,
        right: !isLeft ? (isPhone ? '-14px' : '4%') : undefined,
        width: isPhone ? '106px' : '150px',
        backgroundColor: '#FFFFFF',
        padding: isPhone ? '8px 6px 12px 6px' : '10px 8px 16px 8px',
        borderRadius: '3px',
        boxShadow: '0 14px 28px rgba(90, 20, 60, 0.12), 0 2px 6px rgba(0, 0, 0, 0.04)',
        zIndex: 1,
        border: '1px solid rgba(255, 182, 193, 0.35)',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: isPhone ? '5px' : '7px',
        animation: isLeft ? 'floatSubtleLeft 6s ease-in-out infinite' : 'floatSubtleRight 6.5s ease-in-out infinite',
        transform: isLifted ? `scale(1.05) rotate(${liftRotation})` : undefined,
        transition: 'transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)',
        pointerEvents: 'auto'
      }}
      title="Sample Photostrip"
    >
      {/* Washi Tape Strip */}
      <div
        style={{
          position: 'absolute',
          top: '-7px',
          left: isLeft ? '25%' : undefined,
          right: !isLeft ? '25%' : undefined,
          width: '42px',
          height: '15px',
          backgroundColor: 'rgba(255, 218, 226, 0.88)',
          borderLeft: '1px dashed rgba(224, 38, 120, 0.35)',
          borderRight: '1px dashed rgba(224, 38, 120, 0.35)',
          transform: isLeft ? 'rotate(-4deg)' : 'rotate(5deg)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
        }}
      />

      {/* Frame 1 */}
      <div style={{ width: '100%', aspectRatio: '4/3', overflow: 'hidden', borderRadius: '1px', background: '#F8DCE5' }}>
        <img
          src={imageSrc}
          alt={`photostrip ${side} 1`}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      {/* Frame 2 */}
      <div style={{ width: '100%', aspectRatio: '4/3', overflow: 'hidden', borderRadius: '1px', background: '#F8DCE5' }}>
        <img
          src={imageSrc}
          alt={`photostrip ${side} 2`}
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: isLeft ? 'grayscale(0.1) contrast(1.05)' : 'contrast(1.08)' }}
        />
      </div>

      {/* Frame 3 */}
      <div style={{ width: '100%', aspectRatio: '4/3', overflow: 'hidden', borderRadius: '1px', background: '#F8DCE5' }}>
        <img
          src={imageSrc}
          alt={`photostrip ${side} 3`}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      {/* Footer Film Markings */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 2px', marginTop: 1 }}>
        {isLeft ? (
          <span style={{ fontSize: '0.42rem', fontFamily: 'var(--font-mono)', color: '#A0688E' }}>▶ 01A</span>
        ) : (
          <Heart size={9} color="#FF2A85" fill="#FF2A85" />
        )}
        <span style={{ fontSize: '0.44rem', fontFamily: 'var(--font-mono)', color: '#FF2A85', fontWeight: 800 }}>
          {isLeft ? 'LUMA 35mm' : 'LUMA 2026'}
        </span>
      </div>
    </div>
  );
};
