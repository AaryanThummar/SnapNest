// src/components/common/CursorGlow.tsx
import React, { useEffect, useState } from 'react';

/**
 * CursorGlow
 * Renders a subtle localized radial atmospheric glow that tracks the pointer
 * only on desktop mouse devices, automatically disabled on touchscreens
 * and when prefers-reduced-motion is active.
 */
export const CursorGlow: React.FC = () => {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [isSupported, setIsSupported] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if device supports fine mouse pointer and does not prefer reduced motion
    const hasPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!hasPointer || prefersReducedMotion) {
      setIsSupported(false);
      return;
    }

    setIsSupported(true);

    let rafId: number | null = null;
    let targetX = 0;
    let targetY = 0;

    const handlePointerMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;

      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          setPos({ x: targetX, y: targetY });
          rafId = null;
        });
      }
    };

    const handlePointerLeave = () => {
      setPos(null);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('mouseleave', handlePointerLeave, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('mouseleave', handlePointerLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  if (!isSupported || !pos) return null;

  return (
    <div
      className="luma-cursor-glow"
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: '320px',
        height: '320px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, var(--event-primary, rgba(229, 72, 125, 0.18)) 0%, rgba(139, 63, 209, 0.08) 40%, transparent 70%)',
        filter: 'blur(35px)',
        transform: `translate3d(${pos.x - 160}px, ${pos.y - 160}px, 0)`,
        pointerEvents: 'none',
        zIndex: 1,
        transition: 'transform 0.06s ease-out, opacity 0.3s ease',
        willChange: 'transform, opacity'
      }}
    />
  );
};

export default CursorGlow;
