import React from 'react';
import { useBooth } from '../context/BoothContext';
import { PHOTO_EXPERIENCES } from '../utils/constants';
import { PhotoExperience } from '../types/booth';
import { 
  Camera, 
  Sparkles, 
  Swords, 
  Dices, 
  History, 
  Globe, 
  ArrowRight, 
  Layers 
} from 'lucide-react';

export const ExperienceSelectView: React.FC = () => {
  const { selectExperience } = useBooth();

  const getExperienceIcon = (iconName: string, color: string) => {
    switch (iconName) {
      case 'Camera': return <Camera size={22} color={color} />;
      case 'Sparkles': return <Sparkles size={22} color={color} />;
      case 'Swords': return <Swords size={22} color={color} />;
      case 'Dices': return <Dices size={22} color={color} />;
      case 'History': return <History size={22} color={color} />;
      case 'Globe': return <Globe size={22} color={color} />;
      default: return <Layers size={22} color={color} />;
    }
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'clamp(16px, 2.5vh, 24px) clamp(16px, 3.5vw, 44px)',
        overflowY: 'auto',
        userSelect: 'none'
      }}
    >
      {/* Header Prompt */}
      <div style={{ textAlign: 'center', maxWidth: '640px' }}>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(24px, 4vw, 32px)',
            fontWeight: 900,
            letterSpacing: '-0.01em',
            color: '#FFFFFF'
          }}
        >
          Choose Your Photo Experience
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(12px, 2vw, 14px)',
            color: 'var(--text-secondary)',
            marginTop: '4px'
          }}
        >
          Select an experience to customize your poses, filters, and keepsake prints
        </p>
      </div>

      {/* Adaptive 6 Experience Cards Grid */}
      <div
        className="adaptive-grid-3x2"
        style={{
          width: '100%',
          maxWidth: '1160px',
          margin: 'auto 0',
          padding: '10px 0'
        }}
      >
        {PHOTO_EXPERIENCES.map((exp: PhotoExperience) => {
          return (
            <div
              key={exp.id}
              onClick={() => selectExperience(exp.id)}
              className="kiosk-card kiosk-card-interactive"
              style={{
                position: 'relative',
                padding: 'clamp(14px, 2vw, 18px)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '160px',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                overflow: 'hidden'
              }}
            >
              {/* Top Row: Icon + Badge */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {getExperienceIcon(exp.iconName, exp.accentColor)}
                </div>

                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '9px',
                    fontWeight: 800,
                    backgroundColor: 'var(--bg-surface-elevated)',
                    color: exp.accentColor,
                    padding: '3px 8px',
                    borderRadius: '4px',
                    border: '1px solid var(--border-subtle)',
                    letterSpacing: '0.04em'
                  }}
                >
                  {exp.badge}
                </span>
              </div>

              {/* Title & Tagline */}
              <div style={{ margin: '8px 0' }}>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(15px, 2.5vw, 17px)',
                    fontWeight: 800,
                    color: '#FFFFFF',
                    lineHeight: 1.2
                  }}
                >
                  {exp.name}
                </h3>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: exp.accentColor,
                    marginTop: '2px',
                    display: 'block'
                  }}
                >
                  {exp.tagline}
                </span>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '11px',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.35,
                    marginTop: '4px'
                  }}
                >
                  {exp.description}
                </p>
              </div>

              {/* Bottom Feature Tags */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '8px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700 }}>
                  {exp.shotCount} {exp.shotCount === 1 ? 'Shot' : 'Shots'}
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: exp.accentColor, fontSize: '11px', fontWeight: 800 }}>
                  <span>Select</span>
                  <ArrowRight size={13} strokeWidth={2.5} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Subtitle Help Note */}
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(9px, 2vw, 11px)', color: 'var(--text-muted)', textAlign: 'center' }}>
        TAP ANY CARD TO BEGIN · HD PRINTS & INSTANT MOBILE SCAN INCLUDED
      </div>
    </div>
  );
};
