// src/components/shell/CursorLightEffect.tsx
import React, { useEffect, useRef, useState } from 'react';

interface TapGlow {
  id: number;
  x: number;
  y: number;
}

export const CursorLightEffect: React.FC = () => {
  const lightRef = useRef<HTMLDivElement | null>(null);
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [tapGlows, setTapGlows] = useState<TapGlow[]>([]);

  // Animation frame and interpolation state
  const posRef = useRef({
    currentX: -500,
    currentY: -500,
    targetX: -500,
    targetY: -500,
    rafId: 0,
    isRunning: false
  });

  useEffect(() => {
    // Detect touch capability
    const checkTouch = () => {
      const isTouch =
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia('(pointer: coarse)').matches;
      setIsTouchDevice(isTouch);
      return isTouch;
    };

    const isTouch = checkTouch();

    if (isTouch) {
      // Touch-device handling: brief soft tap glow on touch
      const handleTouchStart = (e: TouchEvent) => {
        const touch = e.touches[0];
        if (!touch) return;
        const newGlow: TapGlow = {
          id: Date.now() + Math.random(),
          x: touch.clientX,
          y: touch.clientY
        };
        setTapGlows((prev) => [...prev.slice(-3), newGlow]);

        // Auto remove tap glow after animation completes
        setTimeout(() => {
          setTapGlows((prev) => prev.filter((g) => g.id !== newGlow.id));
        }, 500);
      };

      window.addEventListener('touchstart', handleTouchStart, { passive: true });
      return () => {
        window.removeEventListener('touchstart', handleTouchStart);
      };
    }

    // Mouse / Desktop pointer handling
    const updatePosition = () => {
      const { currentX, currentY, targetX, targetY } = posRef.current;
      
      // Butter-smooth interpolation (lerp)
      const lerpFactor = 0.085;
      const nextX = currentX + (targetX - currentX) * lerpFactor;
      const nextY = currentY + (targetY - currentY) * lerpFactor;

      posRef.current.currentX = nextX;
      posRef.current.currentY = nextY;

      if (lightRef.current) {
        lightRef.current.style.transform = `translate3d(${nextX}px, ${nextY}px, 0)`;
      }

      // Check if distance is negligible to conserve CPU
      const dx = Math.abs(targetX - nextX);
      const dy = Math.abs(targetY - nextY);

      if (dx > 0.05 || dy > 0.05) {
        posRef.current.rafId = requestAnimationFrame(updatePosition);
      } else {
        posRef.current.isRunning = false;
      }
    };

    const startAnimation = () => {
      if (!posRef.current.isRunning) {
        posRef.current.isRunning = true;
        posRef.current.rafId = requestAnimationFrame(updatePosition);
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      // Only track mouse or fine pointers
      if (e.pointerType === 'touch') return;

      if (!isVisible) setIsVisible(true);

      // On first move, initialize coordinates directly to avoid sliding in from offscreen
      if (posRef.current.currentX === -500) {
        posRef.current.currentX = e.clientX;
        posRef.current.currentY = e.clientY;
      }

      posRef.current.targetX = e.clientX;
      posRef.current.targetY = e.clientY;

      startAnimation();
    };

    const handlePointerLeave = () => {
      setIsVisible(false);
    };

    const handlePointerEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('mouseleave', handlePointerLeave);
    document.addEventListener('mouseenter', handlePointerEnter);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('mouseleave', handlePointerLeave);
      document.removeEventListener('mouseenter', handlePointerEnter);
      if (posRef.current.rafId) {
        cancelAnimationFrame(posRef.current.rafId);
      }
    };
  }, [isVisible]);

  // Touch device tap glow rendering
  if (isTouchDevice) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 99998,
          overflow: 'hidden'
        }}
      >
        {tapGlows.map((glow) => (
          <div
            key={glow.id}
            style={{
              position: 'absolute',
              top: glow.y - 120,
              left: glow.x - 120,
              width: '240px',
              height: '240px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(139, 77, 255, 0.16) 0%, rgba(216, 60, 157, 0.08) 40%, transparent 70%)',
              filter: 'blur(16px)',
              pointerEvents: 'none',
              animation: 'tapGlowFade 0.45s cubic-bezier(0.1, 0.8, 0.2, 1) forwards'
            }}
          />
        ))}
      </div>
    );
  }

  // Desktop subtle ambient spotlight
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 99998,
        overflow: 'hidden'
      }}
    >
      <div
        ref={lightRef}
        style={{
          position: 'absolute',
          top: -160,
          left: -160,
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          background: `
            radial-gradient(
              circle at center,
              rgba(139, 77, 255, 0.12) 0%,
              rgba(216, 60, 157, 0.06) 35%,
              rgba(139, 77, 255, 0.015) 65%,
              transparent 80%
            )
          `,
          filter: 'blur(20px)',
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.4s ease-out',
          willChange: 'transform',
          pointerEvents: 'none'
        }}
      />
    </div>
  );
};
