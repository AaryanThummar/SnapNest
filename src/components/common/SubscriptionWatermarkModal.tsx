// src/components/common/SubscriptionWatermarkModal.tsx
import React, { useState } from 'react';
import { Sparkles, X, Check, Crown } from 'lucide-react';
import { soundEngine } from '../../utils/audio';

interface SubscriptionWatermarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribed?: () => void;
}

export const SubscriptionWatermarkModal: React.FC<SubscriptionWatermarkModalProps> = ({
  isOpen,
  onClose,
  onSubscribed
}) => {
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubscribe = () => {
    soundEngine.playTap();
    setIsSubscribing(true);
    setTimeout(() => {
      setIsSubscribing(false);
      setIsSuccess(true);
      soundEngine.playEventCreated();
      setTimeout(() => {
        setIsSuccess(false);
        if (onSubscribed) onSubscribed();
        onClose();
      }, 1400);
    }, 1000);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 4, 15, 0.88)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999999,
        padding: '20px',
        boxSizing: 'border-box',
        userSelect: 'none',
        animation: 'lumaFadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          background: 'linear-gradient(145deg, rgba(26, 16, 48, 0.95) 0%, rgba(13, 10, 28, 0.98) 100%)',
          border: '1.5px solid rgba(229, 72, 125, 0.35)',
          borderRadius: '24px',
          padding: '28px 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: 18,
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 40px rgba(229, 72, 125, 0.25)',
          position: 'relative',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow */}
        <div
          style={{
            position: 'absolute',
            top: '-30%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '240px',
            height: '240px',
            background: 'radial-gradient(circle, rgba(229, 72, 125, 0.3) 0%, transparent 70%)',
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: 0
          }}
        />

        {/* Close Button Top-Right */}
        <button
          onClick={() => {
            soundEngine.playTap();
            onClose();
          }}
          aria-label="Close modal"
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            cursor: 'pointer',
            transition: 'background 0.15s ease',
            zIndex: 2
          }}
        >
          <X size={16} />
        </button>

        {/* Crown / Pro Icon Badge */}
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, rgba(229, 72, 125, 0.25) 0%, rgba(139, 77, 255, 0.25) 100%)',
            border: '1.5px solid rgba(229, 72, 125, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(229, 72, 125, 0.35)',
            zIndex: 1
          }}
        >
          {isSuccess ? (
            <Check size={32} color="#00F5D4" strokeWidth={3} />
          ) : (
            <Crown size={32} color="var(--luma-pink-luma)" />
          )}
        </div>

        {/* Content Heading */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, zIndex: 1 }}>
          <span
            style={{
              fontSize: '0.72rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 800,
              letterSpacing: '0.12em',
              color: 'var(--luma-pink-luma)',
              textTransform: 'uppercase'
            }}
          >
            LUMABOOTH PRO MEMBERSHIP
          </span>
          <h3
            style={{
              margin: 0,
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: '1.25rem',
              color: '#FFFFFF',
              lineHeight: 1.2
            }}
          >
            {isSuccess ? 'Subscribed Successfully!' : 'Remove Watermark & Unlock Pro'}
          </h3>
        </div>

        {/* Required Precise Prompt Text */}
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '14px',
            padding: '14px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            zIndex: 1
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: '0.88rem',
              color: '#FFFFFF',
              fontWeight: 600,
              lineHeight: 1.4
            }}
          >
            Watermark is permanent and cannot be removed.
          </p>
          <p
            style={{
              margin: 0,
              fontSize: '0.82rem',
              color: 'var(--luma-text-secondary)',
              lineHeight: 1.4
            }}
          >
            Subscribe before using for an event.
          </p>
        </div>

        {/* Action Buttons */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            zIndex: 1,
            marginTop: 4
          }}
        >
          <button
            onClick={handleSubscribe}
            disabled={isSubscribing || isSuccess}
            style={{
              width: '100%',
              minHeight: '48px',
              borderRadius: '9999px',
              background: 'linear-gradient(135deg, #E5487D 0%, #B82E88 45%, #8B3FD1 100%)',
              border: 'none',
              color: '#FFFFFF',
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: '0.96rem',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              cursor: 'pointer',
              boxShadow: '0 6px 22px rgba(229, 72, 125, 0.45)',
              transition: 'all 0.15s ease'
            }}
          >
            <Sparkles size={16} color="#FFFFFF" />
            <span>{isSubscribing ? 'Activating Pro...' : isSuccess ? 'Pro Active' : 'SUBSCRIBE'}</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playTap();
              onClose();
            }}
            style={{
              width: '100%',
              minHeight: '42px',
              borderRadius: '9999px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: 'var(--luma-text-secondary)',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              fontSize: '0.78rem',
              letterSpacing: '0.04em',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6
            }}
          >
            <span>CLOSE X</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionWatermarkModal;
