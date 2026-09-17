import React, { useState } from 'react';
import { useBooth } from '../context/BoothContext';
import { X, Save, Sliders, Clock, Printer, Sparkles, FlipHorizontal } from 'lucide-react';
import { soundEngine } from '../utils/audio';

export const AdminSettingsModal: React.FC = () => {
  const { isAdminOpen, setIsAdminOpen, eventConfig, updateEventConfig } = useBooth();
  const [formData, setFormData] = useState(eventConfig);

  if (!isAdminOpen) return null;

  const handleSave = () => {
    soundEngine.playTap();
    updateEventConfig(formData);
    setIsAdminOpen(false);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        backgroundColor: 'rgba(5, 7, 10, 0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px'
      }}
    >
      <div
        className="kiosk-card"
        style={{
          width: '100%',
          maxWidth: '580px',
          maxHeight: '90vh',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-medium)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '18px 24px',
            borderBottom: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-surface-elevated)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sliders size={18} color="var(--accent-red)" />
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 800 }}>
              Kiosk Operator Settings
            </h3>
          </div>
          <button
            onClick={() => {
              soundEngine.playTap();
              setIsAdminOpen(false);
            }}
            className="kiosk-btn"
            style={{ width: '32px', height: '32px', padding: 0 }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Form Body */}
        <div
          style={{
            padding: '20px 24px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
              Photobooth Kiosk Title
            </label>
            <input
              type="text"
              value={formData.boothName}
              onChange={e => setFormData({ ...formData, boothName: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                color: '#FFFFFF',
                backgroundColor: 'var(--bg-surface-elevated)',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                Event / Host Name
              </label>
              <input
                type="text"
                value={formData.eventName}
                onChange={e => setFormData({ ...formData, eventName: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  fontFamily: 'var(--font-body)',
                  fontSize: '14px',
                  color: '#FFFFFF',
                  backgroundColor: 'var(--bg-surface-elevated)',
                  outline: 'none'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                Event Date Stamp
              </label>
              <input
                type="text"
                value={formData.eventDate}
                onChange={e => setFormData({ ...formData, eventDate: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  fontFamily: 'var(--font-body)',
                  fontSize: '14px',
                  color: '#FFFFFF',
                  backgroundColor: 'var(--bg-surface-elevated)',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
              Footnote Stamp (Bottom of prints)
            </label>
            <input
              type="text"
              value={formData.footnote}
              onChange={e => setFormData({ ...formData, footnote: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                color: '#FFFFFF',
                backgroundColor: 'var(--bg-surface-elevated)',
                outline: 'none'
              }}
            />
          </div>

          {/* Timers & Copies Controls */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                <Clock size={12} /> Shutter Countdown
              </label>
              <div style={{ display: 'flex', gap: '6px' }}>
                {([3, 5, 10] as const).map(sec => (
                  <button
                    key={sec}
                    onClick={() => {
                      soundEngine.playTap();
                      setFormData({ ...formData, countdownSeconds: sec });
                    }}
                    className="kiosk-btn"
                    style={{
                      flex: 1,
                      padding: '8px',
                      fontSize: '12px',
                      backgroundColor: formData.countdownSeconds === sec ? 'var(--accent-red)' : 'var(--bg-surface-elevated)',
                      color: formData.countdownSeconds === sec ? '#FFFFFF' : 'var(--text-secondary)'
                    }}
                  >
                    {sec}s
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                <Printer size={12} /> Default Copies
              </label>
              <div style={{ display: 'flex', gap: '6px' }}>
                {([1, 2, 3, 4] as const).map(copies => (
                  <button
                    key={copies}
                    onClick={() => {
                      soundEngine.playTap();
                      setFormData({ ...formData, printCopies: copies });
                    }}
                    className="kiosk-btn"
                    style={{
                      flex: 1,
                      padding: '8px',
                      fontSize: '12px',
                      backgroundColor: formData.printCopies === copies ? 'var(--accent-red)' : 'var(--bg-surface-elevated)',
                      color: formData.printCopies === copies ? '#FFFFFF' : 'var(--text-secondary)'
                    }}
                  >
                    {copies}x
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Feature Toggles */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => {
                soundEngine.playTap();
                setFormData({ ...formData, mirrorCamera: !formData.mirrorCamera });
              }}
              className="kiosk-btn"
              style={{
                flex: 1,
                padding: '10px',
                fontSize: '12px',
                backgroundColor: formData.mirrorCamera ? 'var(--bg-surface-subtle)' : 'var(--bg-surface-elevated)'
              }}
            >
              <FlipHorizontal size={14} color={formData.mirrorCamera ? 'var(--accent-cyan)' : 'var(--text-muted)'} />
              Mirror Feed: {formData.mirrorCamera ? 'ON' : 'OFF'}
            </button>

            <button
              onClick={() => {
                soundEngine.playTap();
                setFormData({ ...formData, beautyFilterEnabled: !formData.beautyFilterEnabled });
              }}
              className="kiosk-btn"
              style={{
                flex: 1,
                padding: '10px',
                fontSize: '12px',
                backgroundColor: formData.beautyFilterEnabled ? 'var(--bg-surface-subtle)' : 'var(--bg-surface-elevated)'
              }}
            >
              <Sparkles size={14} color={formData.beautyFilterEnabled ? 'var(--accent-gold)' : 'var(--text-muted)'} />
              Beauty Retouch: {formData.beautyFilterEnabled ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '10px',
            padding: '14px 24px',
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-surface-elevated)'
          }}
        >
          <button
            onClick={() => {
              soundEngine.playTap();
              setIsAdminOpen(false);
            }}
            className="kiosk-btn"
            style={{ padding: '8px 18px' }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="kiosk-btn kiosk-btn-primary"
            style={{ padding: '8px 20px' }}
          >
            <Save size={14} /> Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};
