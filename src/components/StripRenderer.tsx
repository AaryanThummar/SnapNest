import React from 'react';
import { useBooth } from '../context/BoothContext';
import { FILTER_PRESETS, FRAME_COLORWAYS, MOCK_CANDID_POSES } from '../utils/constants';
import { CapturedShot, DigitalSticker } from '../types/booth';
import { RotateCcw } from 'lucide-react';

interface StripRendererProps {
  scaleFactor?: number;
  allowRetake?: boolean;
  onRetakeSingle?: (index: number) => void;
  interactiveStickers?: boolean;
  selectedStickerId?: string | null;
  onSelectSticker?: (id: string) => void;
}

export const StripRenderer: React.FC<StripRendererProps> = ({
  scaleFactor = 1,
  allowRetake = false,
  onRetakeSingle,
  interactiveStickers = false,
  selectedStickerId = null,
  onSelectSticker
}) => {
  const {
    selectedExperience,
    capturedShots,
    activeFilterId,
    selectedTemplateId,
    activeColorwayId,
    customOverlayText,
    stickers,
    eventConfig,
    activeBattlePrompt,
    activeDestination,
    activeDecade
  } = useBooth();

  const filterObj = FILTER_PRESETS.find(f => f.id === activeFilterId) || FILTER_PRESETS[0];
  const colorwayObj = FRAME_COLORWAYS.find(c => c.id === activeColorwayId) || FRAME_COLORWAYS[0];

  const neededCount = selectedExperience.shotCount;
  const shotsToRender: CapturedShot[] = Array.from({ length: neededCount }).map((_, i) => {
    if (capturedShots[i]) return capturedShots[i];
    return {
      id: `mock_${i}`,
      index: i,
      url: MOCK_CANDID_POSES[i % MOCK_CANDID_POSES.length],
      timestamp: Date.now()
    };
  });

  const getContainerWidth = () => {
    switch (selectedTemplateId) {
      case 'postcard_4x6': return 360 * scaleFactor;
      case 'grid_1x1': return 300 * scaleFactor;
      case 'polaroid_single': return 260 * scaleFactor;
      case 'strip_2x6':
      default: return 200 * scaleFactor;
    }
  };

  const renderSinglePhoto = (shot: CapturedShot, idx: number, aspect: string = '4/3') => {
    // Dynamic overlay for sub-experiences
    const isAroundWorld = selectedExperience.id === 'around_world';
    const isPoseBattle = selectedExperience.id === 'pose_battle';

    return (
      <div
        key={shot.id || idx}
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: aspect,
          backgroundColor: '#0A0C10',
          overflow: 'hidden',
          borderRadius: '3px'
        }}
      >
        {/* Underlay Destination for Around the World */}
        {isAroundWorld && activeDestination && (
          <img
            src={activeDestination.bg}
            alt="Virtual Backdrop"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.35
            }}
          />
        )}

        {/* Guest Photo */}
        <img
          src={shot.url}
          alt={`Pose ${idx + 1}`}
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: filterObj.cssFilter
          }}
        />

        {/* Pose Battle Player Badge */}
        {isPoseBattle && (
          <div
            style={{
              position: 'absolute',
              top: '6px',
              left: '6px',
              backgroundColor: idx === 0 ? 'var(--accent-red)' : 'var(--accent-cyan)',
              color: idx === 0 ? '#FFFFFF' : '#0A0C10',
              padding: '2px 8px',
              borderRadius: '4px',
              fontFamily: 'var(--font-mono)',
              fontSize: '8px',
              fontWeight: 800
            }}
          >
            {idx === 0 ? 'PLAYER 1' : 'PLAYER 2'}
          </div>
        )}

        {/* Retake Button for Review Screen */}
        {allowRetake && onRetakeSingle && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRetakeSingle(idx);
            }}
            className="kiosk-btn"
            style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              padding: '3px 8px',
              fontSize: '10px',
              fontWeight: 800,
              backgroundColor: '#FFFFFF',
              color: 'var(--accent-red)'
            }}
          >
            <RotateCcw size={10} /> Retake
          </button>
        )}
      </div>
    );
  };

  const renderPhotosGrid = () => {
    if (selectedTemplateId === 'polaroid_single') {
      return renderSinglePhoto(shotsToRender[0], 0, '1/1');
    }
    if (selectedTemplateId === 'postcard_4x6') {
      return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', width: '100%' }}>
          {shotsToRender.slice(0, 2).map((shot, idx) => renderSinglePhoto(shot, idx, '3/4'))}
        </div>
      );
    }
    if (selectedTemplateId === 'grid_1x1') {
      return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', width: '100%' }}>
          {shotsToRender.slice(0, 4).map((shot, idx) => renderSinglePhoto(shot, idx, '1/1'))}
        </div>
      );
    }
    // Classic Vertical Strip
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
        {shotsToRender.map((shot, idx) => renderSinglePhoto(shot, idx, '4/3'))}
      </div>
    );
  };

  return (
    <div
      style={{
        position: 'relative',
        width: `${getContainerWidth()}px`,
        backgroundColor: colorwayObj.bgValue,
        color: colorwayObj.textColor,
        padding: '12px 10px 14px 10px',
        borderRadius: '6px',
        boxShadow: '0 12px 32px rgba(0,0,0,0.6)',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        userSelect: 'none'
      }}
    >
      {/* Top Header Strip Branding */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          paddingBottom: '2px'
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '11px',
            fontWeight: 900,
            letterSpacing: '0.08em',
            textTransform: 'uppercase'
          }}
        >
          {customOverlayText || eventConfig.eventName}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '7px',
            opacity: 0.75,
            letterSpacing: '0.04em'
          }}
        >
          {selectedExperience.name.toUpperCase()} · {eventConfig.eventDate}
        </span>
      </div>

      {/* Main Photo Layout Grid */}
      <div style={{ position: 'relative', width: '100%' }}>
        {renderPhotosGrid()}

        {/* Digital Stickers */}
        {stickers.map((stk: DigitalSticker) => (
          <div
            key={stk.id}
            onClick={() => onSelectSticker && onSelectSticker(stk.id)}
            style={{
              position: 'absolute',
              left: `${stk.x}%`,
              top: `${stk.y}%`,
              transform: `translate(-50%, -50%) scale(${stk.scale}) rotate(${stk.rotation}deg)`,
              fontSize: `${24 * scaleFactor}px`,
              lineHeight: 1,
              cursor: interactiveStickers ? 'grab' : 'default',
              pointerEvents: interactiveStickers ? 'auto' : 'none',
              border: selectedStickerId === stk.id ? '1.5px dashed var(--accent-red)' : 'none',
              padding: '2px',
              borderRadius: '4px',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.6))'
            }}
          >
            {stk.emoji}
          </div>
        ))}
      </div>

      {/* Bottom Footer Details */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '1px',
          paddingTop: '2px'
        }}
      >
        {selectedExperience.id === 'pose_battle' && activeBattlePrompt && (
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '7px',
              fontWeight: 800,
              color: 'var(--accent-gold)'
            }}
          >
            {activeBattlePrompt.p1} VS {activeBattlePrompt.p2}
          </span>
        )}

        {selectedExperience.id === 'time_capsule' && activeDecade && (
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '7px', fontWeight: 800, color: 'var(--accent-purple)' }}>
            TIME CAPSULE · {activeDecade.name.toUpperCase()}
          </span>
        )}

        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '7px',
            opacity: 0.6,
            letterSpacing: '0.04em'
          }}
        >
          {eventConfig.footnote}
        </span>
      </div>
    </div>
  );
};
