// src/components/common/PwaInstallBanner.tsx
import React, { useState } from 'react';
import { usePwaInstall } from '../../hooks/usePwaInstall';
import { Download, X, Share, PlusSquare, Sparkles } from 'lucide-react';
import { soundEngine } from '../../utils/audio';

export const PwaInstallBanner: React.FC = () => {
  const { canInstall, isInstalled, isDismissed, isIOS, hasNativePrompt, promptInstall, dismissPrompt } = usePwaInstall();
  const [showIosGuide, setShowIosGuide] = useState<boolean>(false);

  // If installed or dismissed or cannot install, do not render
  if (isInstalled || isDismissed || !canInstall) {
    return null;
  }

  const handleInstallClick = async () => {
    soundEngine.playTap();
    if (hasNativePrompt) {
      await promptInstall();
    } else if (isIOS) {
      setShowIosGuide(true);
    }
  };

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.playTap();
    dismissPrompt();
  };

  return (
    <>
      {/* Floating Discrete Install Pill */}
      <aside
        aria-label="Install LumaBooth App"
        style={{
          position: 'fixed',
          bottom: 'max(16px, env(safe-area-inset-bottom, 16px))',
          right: 'max(16px, env(safe-area-inset-right, 16px))',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '8px 14px 8px 10px',
          borderRadius: '9999px',
          background: 'linear-gradient(135deg, rgba(17, 16, 38, 0.95) 0%, rgba(27, 18, 52, 0.95) 100%)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(139, 77, 255, 0.45)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 20px rgba(139, 77, 255, 0.25)',
          animation: 'pwaSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          maxWidth: 'calc(100vw - 32px)'
        }}
      >
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #8B4DFF 0%, #E83E7A 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 10px rgba(232, 62, 122, 0.4)',
            flexShrink: 0
          }}
        >
          <Sparkles size={16} color="#FFFFFF" />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.2 }}>
            Install LumaBooth
          </span>
          <span style={{ fontSize: '10px', color: '#B8B6D1', lineHeight: 1.2 }}>
            Full screen & faster access
          </span>
        </div>

        <button
          onClick={handleInstallClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            background: 'linear-gradient(135deg, #8B4DFF 0%, #D83C9D 100%)',
            color: '#FFFFFF',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '9999px',
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(139, 77, 255, 0.4)',
            transition: 'transform 0.15s ease',
            flexShrink: 0
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <Download size={12} />
          <span>Install</span>
        </button>

        <button
          onClick={handleDismiss}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#8E8CA8',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            transition: 'color 0.15s ease',
            flexShrink: 0
          }}
          aria-label="Dismiss install prompt"
          title="Dismiss"
          onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#8E8CA8')}
        >
          <X size={14} />
        </button>
      </aside>

      {/* iOS Add to Home Screen Instructions Modal */}
      {showIosGuide && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            backgroundColor: 'rgba(5, 4, 13, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setShowIosGuide(false)}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, #121026 0%, #1a1538 100%)',
              border: '1px solid rgba(139, 77, 255, 0.4)',
              borderRadius: '20px',
              padding: '24px',
              maxWidth: '340px',
              width: '100%',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(139, 77, 255, 0.2)',
              color: '#FFFFFF'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: '#FFFFFF' }}>
                Install on iOS Safari
              </h3>
              <button
                onClick={() => setShowIosGuide(false)}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  color: '#FFFFFF',
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={16} />
              </button>
            </div>

            <p style={{ fontSize: '13px', color: '#B8B6D1', marginBottom: '16px', lineHeight: 1.5 }}>
              Install LumaBooth on your iPhone or iPad for a standalone, fullscreen photobooth experience:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(139, 77, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8B4DFF', fontWeight: 700 }}>
                  1
                </div>
                <span>Tap the <strong>Share</strong> button <Share size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> in Safari</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(139, 77, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8B4DFF', fontWeight: 700 }}>
                  2
                </div>
                <span>Scroll down and tap <strong>Add to Home Screen</strong> <PlusSquare size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /></span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(139, 77, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8B4DFF', fontWeight: 700 }}>
                  3
                </div>
                <span>Tap <strong>Add</strong> in the top-right corner</span>
              </div>
            </div>

            <button
              onClick={() => setShowIosGuide(false)}
              style={{
                marginTop: '20px',
                width: '100%',
                padding: '10px',
                background: 'linear-gradient(135deg, #8B4DFF 0%, #D83C9D 100%)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
};
