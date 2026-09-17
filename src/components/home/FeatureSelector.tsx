// src/components/home/FeatureSelector.tsx
import React from 'react';
import { Camera, Swords, Dices, Hourglass, Sparkles, Music, Globe } from 'lucide-react';
import { soundEngine } from '../../utils/audio';

export interface BoothFeature {
  id: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
  accent: string;
}

export const BOOTH_FEATURES: BoothFeature[] = [
  {
    id: 'photobooth',
    title: 'PHOTOBOOTH',
    desc: 'Classic high-res photostrip capture',
    icon: <Camera size={15} />,
    accent: '#8B4DFF'
  },
  {
    id: 'pose_battle',
    title: 'POSE BATTLE',
    desc: 'Challenge your friends in real-time',
    icon: <Swords size={15} />,
    accent: '#E83E7A'
  },
  {
    id: 'photo_roulette',
    title: 'PHOTO ROULETTE',
    desc: 'Let Luma choose your next shot',
    icon: <Dices size={15} />,
    accent: '#D83C9D'
  },
  {
    id: 'time_capsule',
    title: 'TIME CAPSULE',
    desc: "Save today's memory for later",
    icon: <Hourglass size={15} />,
    accent: '#B9A7FF'
  },
  {
    id: 'future_you',
    title: 'FUTURE YOU',
    desc: 'Leave something for yourself',
    icon: <Sparkles size={15} />,
    accent: '#FFB703'
  },
  {
    id: 'sound_of_moment',
    title: 'SOUND OF MOMENT',
    desc: 'Sync voice & ambient soundscape',
    icon: <Music size={15} />,
    accent: '#00F5D4'
  },
  {
    id: 'around_world',
    title: 'AROUND THE WORLD',
    desc: 'Live virtual studio teleportation',
    icon: <Globe size={15} />,
    accent: '#06D6A0'
  }
];

interface FeatureSelectorProps {
  selectedId: string;
  onSelect: (id: string) => void;
  isPhone?: boolean;
}

export const FeatureSelector: React.FC<FeatureSelectorProps> = ({
  selectedId,
  onSelect,
  isPhone = false
}) => {
  const handleItemClick = (id: string) => {
    soundEngine.playTap();
    onSelect(id);
  };

  return (
    <div
      style={{
        width: '100%',
        maxWidth: isPhone ? '100%' : '520px',
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2px' }}>
        <span
          style={{
            fontSize: '0.68rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--luma-lavender)'
          }}
        >
          EXPERIENCE MODES
        </span>
        <span
          style={{
            fontSize: '0.62rem',
            fontFamily: 'var(--font-mono)',
            color: 'var(--luma-text-muted)',
            letterSpacing: '0.04em'
          }}
        >
          {BOOTH_FEATURES.length} MODES AVAILABLE
        </span>
      </div>

      {/* Horizontal Scrollable Sleek Pill Selector */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          gap: 8,
          overflowX: 'auto',
          paddingBottom: 4,
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {BOOTH_FEATURES.map((feat) => {
          const isSelected = selectedId === feat.id;

          return (
            <button
              key={feat.id}
              onClick={() => handleItemClick(feat.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 14px',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: isSelected ? 'var(--luma-purple-deep)' : 'var(--luma-bg-secondary)',
                border: `1.5px solid ${isSelected ? feat.accent : 'var(--luma-border-subtle)'}`,
                boxShadow: isSelected ? `0 0 16px ${feat.accent}40, 0 4px 12px rgba(0,0,0,0.4)` : '0 2px 6px rgba(0,0,0,0.3)',
                color: isSelected ? '#FFFFFF' : 'var(--luma-text-secondary)',
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'all 0.15s ease',
                touchAction: 'manipulation',
                outline: 'none'
              }}
            >
              <span
                style={{
                  color: isSelected ? feat.accent : 'var(--luma-text-muted)',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {feat.icon}
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}>
                <span
                  style={{
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    fontFamily: 'var(--font-display)',
                    letterSpacing: '0.04em',
                    color: isSelected ? '#FFFFFF' : 'var(--luma-text-primary)'
                  }}
                >
                  {feat.title}
                </span>
                <span
                  style={{
                    fontSize: '0.62rem',
                    color: isSelected ? 'var(--luma-lavender)' : 'var(--luma-text-muted)',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {feat.desc}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
