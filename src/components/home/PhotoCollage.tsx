// src/components/home/PhotoCollage.tsx
import React, { useState } from 'react';
import { Sparkles, Heart } from 'lucide-react';
import { soundEngine } from '../../utils/audio';

interface PhotoCollageProps {
  isPhone?: boolean;
}

export const PhotoCollage: React.FC<PhotoCollageProps> = ({ isPhone = false }) => {
  const [tappedId, setTappedId] = useState<string | null>(null);

  const handleTap = (id: string) => {
    soundEngine.playTap();
    setTappedId(id);
    setTimeout(() => setTappedId(null), 350);
  };

  return (
    <div
      style={{
        position: 'relative',
        width: isPhone ? '100%' : '440px',
        height: isPhone ? '150px' : '380px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none'
      }}
    >
      {/* Radial Purple Glow Behind Collage */}
      <div
        style={{
          position: 'absolute',
          width: isPhone ? '240px' : '360px',
          height: isPhone ? '240px' : '360px',
          background: 'radial-gradient(circle, rgba(139, 77, 255, 0.28) 0%, rgba(216, 60, 157, 0.15) 45%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(20px)',
          zIndex: 0
        }}
        className="animate-ambient-glow"
      />

      {/* 1. VERTICAL PHOTOSTRIP (strip-left.jpg) */}
      <div
        onClick={() => handleTap('strip-left')}
        style={{
          position: 'absolute',
          top: isPhone ? '-5px' : '8px',
          left: isPhone ? '6%' : '14px',
          width: isPhone ? '84px' : '124px',
          background: '#11152D',
          border: '1.5px solid rgba(139, 77, 255, 0.35)',
          borderRadius: '4px',
          padding: '6px 5px 10px 5px',
          boxShadow: '0 16px 36px rgba(0, 0, 0, 0.6), 0 0 20px rgba(139, 77, 255, 0.2)',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          cursor: 'pointer',
          pointerEvents: 'auto',
          animation: 'floatCollage1 7s ease-in-out infinite',
          transform: tappedId === 'strip-left' ? 'scale(1.08) rotate(-6deg)' : undefined,
          transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}
      >
        <div style={{ width: '100%', aspectRatio: '4/3', overflow: 'hidden', borderRadius: '2px', background: '#090B1A' }}>
          <img
            src="/assets/home/strip-left.jpg"
            alt="strip preview 1"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
        <div style={{ width: '100%', aspectRatio: '4/3', overflow: 'hidden', borderRadius: '2px', background: '#090B1A' }}>
          <img
            src="/assets/home/strip-left.jpg"
            alt="strip preview 2"
            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(0.2) contrast(1.1)' }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 2px' }}>
          <span style={{ fontSize: '0.42rem', fontFamily: 'var(--font-mono)', color: 'var(--luma-lavender)' }}>▶ 01A</span>
          <span style={{ fontSize: '0.42rem', fontFamily: 'var(--font-mono)', color: 'var(--luma-pink-luma)', fontWeight: 800 }}>LUMA</span>
        </div>
      </div>

      {/* 2. RIGHT PHOTOSTRIP (strip-right.jpg) */}
      <div
        onClick={() => handleTap('strip-right')}
        style={{
          position: 'absolute',
          top: isPhone ? '5px' : '22px',
          right: isPhone ? '6%' : '18px',
          width: isPhone ? '84px' : '124px',
          background: '#11152D',
          border: '1.5px solid rgba(232, 62, 122, 0.35)',
          borderRadius: '4px',
          padding: '6px 5px 10px 5px',
          boxShadow: '0 16px 36px rgba(0, 0, 0, 0.6), 0 0 20px rgba(232, 62, 122, 0.2)',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          cursor: 'pointer',
          pointerEvents: 'auto',
          animation: 'floatCollage2 7.5s ease-in-out infinite',
          transform: tappedId === 'strip-right' ? 'scale(1.08) rotate(7deg)' : undefined,
          transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}
      >
        <div style={{ width: '100%', aspectRatio: '4/3', overflow: 'hidden', borderRadius: '2px', background: '#090B1A' }}>
          <img
            src="/assets/home/strip-right.jpg"
            alt="strip preview 3"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
        <div style={{ width: '100%', aspectRatio: '4/3', overflow: 'hidden', borderRadius: '2px', background: '#090B1A' }}>
          <img
            src="/assets/home/strip-right.jpg"
            alt="strip preview 4"
            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'contrast(1.15) saturate(1.1)' }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 2px' }}>
          <Heart size={8} color="var(--luma-pink-luma)" fill="var(--luma-pink-luma)" />
          <span style={{ fontSize: '0.42rem', fontFamily: 'var(--font-mono)', color: 'var(--luma-pink-luma)', fontWeight: 800 }}>35mm</span>
        </div>
      </div>

      {/* 3. CENTER POLAROID (polaroid-left.jpg) */}
      <div
        onClick={() => handleTap('polaroid-left')}
        style={{
          position: 'absolute',
          top: isPhone ? '20%' : '26%',
          left: isPhone ? '30%' : '140px',
          width: isPhone ? '90px' : '140px',
          background: '#181C38',
          border: '1.5px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '4px',
          padding: '6px 6px 16px 6px',
          boxShadow: '0 20px 45px rgba(0, 0, 0, 0.7), 0 0 25px rgba(139, 77, 255, 0.3)',
          zIndex: 3,
          cursor: 'pointer',
          pointerEvents: 'auto',
          animation: 'floatCollage3 8s ease-in-out infinite',
          transform: tappedId === 'polaroid-left' ? 'scale(1.08) rotate(-8deg)' : undefined,
          transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}
      >
        <div style={{ width: '100%', aspectRatio: '1/1', overflow: 'hidden', borderRadius: '2px', background: '#090B1A' }}>
          <img
            src="/assets/home/polaroid-left.jpg"
            alt="polaroid left preview"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 4, marginTop: 4 }}>
          <Sparkles size={9} color="var(--luma-lavender)" />
          <span style={{ fontSize: '0.52rem', fontFamily: 'var(--font-mono)', color: '#FFFFFF', fontWeight: 700 }}>
            STUDIO PRO
          </span>
        </div>
      </div>

      {/* 4. LOWER ACCENT POLAROID (polaroid-right.jpg) - Tablet/Desktop only */}
      {!isPhone && (
        <div
          onClick={() => handleTap('polaroid-right')}
          style={{
            position: 'absolute',
            bottom: '12px',
            right: '90px',
            width: '120px',
            background: '#181C38',
            border: '1.5px solid rgba(216, 60, 157, 0.4)',
            borderRadius: '4px',
            padding: '6px 6px 14px 6px',
            boxShadow: '0 16px 36px rgba(0, 0, 0, 0.6), 0 0 20px rgba(216, 60, 157, 0.25)',
            zIndex: 3,
            cursor: 'pointer',
            pointerEvents: 'auto',
            animation: 'floatCollage4 8.5s ease-in-out infinite',
            transform: tappedId === 'polaroid-right' ? 'scale(1.08) rotate(7deg)' : undefined,
            transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}
        >
          <div style={{ width: '100%', aspectRatio: '1/1', overflow: 'hidden', borderRadius: '2px', background: '#090B1A' }}>
            <img
              src="/assets/home/polaroid-right.jpg"
              alt="polaroid right preview"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 4 }}>
            <span style={{ fontSize: '0.5rem', fontFamily: 'var(--font-mono)', color: 'var(--luma-pink-luma)', fontWeight: 700 }}>
              CANDID SHOT
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
