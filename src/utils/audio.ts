// src/utils/audio.ts

/**
 * LumaBooth Premium Sound Engine
 * Synthesizes studio-grade, lightweight UI and photobooth sound effects
 * using the Web Audio API with zero external assets and full mobile compliance.
 */
class PhotoboothSoundEngine {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private lastPlayTimes: Record<string, number> = {};

  constructor() {
    // Initialize sound preference from localStorage if available
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('lumabooth_sound_enabled');
        if (saved !== null) {
          this.soundEnabled = JSON.parse(saved);
        }
      }
    } catch {
      this.soundEnabled = true;
    }
  }

  /** Get current sound status */
  public isEnabled(): boolean {
    return this.soundEnabled;
  }

  /** Set sound status and persist to localStorage */
  public setEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('lumabooth_sound_enabled', JSON.stringify(enabled));
      }
    } catch {
      // ignore
    }
  }

  /** Toggle sound status */
  public toggle(): boolean {
    const next = !this.soundEnabled;
    this.setEnabled(next);
    if (next) {
      this.playTap();
    }
    return next;
  }

  /** Initialize or resume AudioContext after user gesture */
  private initCtx(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  /** Debounce protection to prevent sound stacking/distortion */
  private shouldThrottle(soundId: string, minIntervalMs: number = 35): boolean {
    const now = Date.now();
    const last = this.lastPlayTimes[soundId] || 0;
    if (now - last < minIntervalMs) {
      return true;
    }
    this.lastPlayTimes[soundId] = now;
    return false;
  }

  // =========================================================================
  // 1. BUTTON TAP: A very subtle, tactile UI click
  // =========================================================================
  public playTap() {
    if (!this.soundEnabled || this.shouldThrottle('tap', 40)) return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Soft high-frequency transient click
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1100, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.035);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.035);
    } catch {
      // Audio fallback
    }
  }

  // =========================================================================
  // 2. CAMERA COUNTDOWN: Short rhythmic countdown beep (3, 2, 1)
  // =========================================================================
  public playCountdown(isFinal: boolean = false) {
    this.playCountdownBeep(isFinal);
  }

  public playCountdownBeep(isFinal: boolean = false) {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      const freq = isFinal ? 1280 : 880;
      const dur = isFinal ? 0.24 : 0.12;

      osc.frequency.setValueAtTime(freq, now);
      if (isFinal) {
        osc.frequency.linearRampToValueAtTime(1440, now + dur);
      }

      gain.gain.setValueAtTime(isFinal ? 0.28 : 0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + dur);
    } catch {
      // Audio fallback
    }
  }

  // =========================================================================
  // 3. CAMERA SHUTTER: Realistic tactile mechanical camera shutter
  // =========================================================================
  public playShutter() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Phase 1: Mechanical Mirror Lift Click
      const clickOsc = ctx.createOscillator();
      const clickGain = ctx.createGain();
      clickOsc.type = 'triangle';
      clickOsc.frequency.setValueAtTime(520, now);
      clickOsc.frequency.exponentialRampToValueAtTime(90, now + 0.04);

      clickGain.gain.setValueAtTime(0.35, now);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      clickOsc.connect(clickGain);
      clickGain.connect(ctx.destination);
      clickOsc.start(now);
      clickOsc.stop(now + 0.04);

      // Phase 2: Shutter Curtain Air & Mechanical Slap (Filtered Noise)
      const bufferSize = Math.floor(ctx.sampleRate * 0.09);
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.35));
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;

      // Bandpass filter for camera aperture body acoustic resonance
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, now + 0.02);
      filter.Q.setValueAtTime(1.8, now + 0.02);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.32, now + 0.02);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      noiseSource.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      noiseSource.start(now + 0.02);

      // Phase 3: Secondary Shutter Curtain Close Click
      const closeOsc = ctx.createOscillator();
      const closeGain = ctx.createGain();
      closeOsc.type = 'sine';
      closeOsc.frequency.setValueAtTime(360, now + 0.06);
      closeOsc.frequency.exponentialRampToValueAtTime(120, now + 0.11);

      closeGain.gain.setValueAtTime(0.25, now + 0.06);
      closeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);

      closeOsc.connect(closeGain);
      closeGain.connect(ctx.destination);
      closeOsc.start(now + 0.06);
      closeOsc.stop(now + 0.11);
    } catch {
      // Audio fallback
    }
  }

  // =========================================================================
  // 4. PHOTO SAVED: Short positive confirmation chime
  // =========================================================================
  public playPhotoSaved() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;
      const notes = [740, 932.33, 1108.73]; // F#5, A#5, C#6 (Major uplifting triad)
      notes.forEach((freq, i) => {
        if (!ctx) return;
        const now = ctx.currentTime + i * 0.065;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.32);
      });
    } catch {
      // Audio fallback
    }
  }

  // =========================================================================
  // 5. AI START: Subtle futuristic activation sound
  // =========================================================================
  public playAiStart() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Rising frequency synthesizer sweep
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(240, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.4);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.18);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.45);

      // Sci-fi high overtone sparkle
      const shimmerOsc = ctx.createOscillator();
      const shimmerGain = ctx.createGain();
      shimmerOsc.type = 'triangle';
      shimmerOsc.frequency.setValueAtTime(1320, now + 0.15);
      shimmerOsc.frequency.linearRampToValueAtTime(1760, now + 0.42);

      shimmerGain.gain.setValueAtTime(0.08, now + 0.15);
      shimmerGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      shimmerOsc.connect(shimmerGain);
      shimmerGain.connect(ctx.destination);

      shimmerOsc.start(now + 0.15);
      shimmerOsc.stop(now + 0.45);
    } catch {
      // Audio fallback
    }
  }

  // =========================================================================
  // 6. AI COMPLETE: Short premium completion harmonic chord
  // =========================================================================
  public playAiComplete() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;
      // Majestic modern harmonic chord (Eb5, G5, Bb5, Eb6)
      const chord = [622.25, 783.99, 932.33, 1244.50];
      chord.forEach((freq, idx) => {
        if (!ctx) return;
        const now = ctx.currentTime + idx * 0.045;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.55);
      });
    } catch {
      // Audio fallback
    }
  }

  // =========================================================================
  // 7. EVENT CREATED: Small celebratory confirmation sound
  // =========================================================================
  public playEventCreated() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;
      // Celebratory upward fanfare (C5, G5, C6, E6)
      const fanfare = [523.25, 783.99, 1046.50, 1318.51];
      fanfare.forEach((freq, idx) => {
        if (!ctx) return;
        const now = ctx.currentTime + idx * 0.07;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = idx === fanfare.length - 1 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + (idx === fanfare.length - 1 ? 0.65 : 0.38));

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + (idx === fanfare.length - 1 ? 0.65 : 0.38));
      });
    } catch {
      // Audio fallback
    }
  }

  // =========================================================================
  // 8. QR GENERATED: Very subtle pleasant confirmation tone
  // =========================================================================
  public playQrGenerated() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;
      const tones = [1046.50, 1318.51]; // C6, E6
      tones.forEach((freq, idx) => {
        if (!ctx) return;
        const now = ctx.currentTime + idx * 0.06;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.25);
      });
    } catch {
      // Audio fallback
    }
  }

  // =========================================================================
  // Compatibility & Legacy Helpers
  // =========================================================================
  public playSuccessChime() {
    this.playPhotoSaved();
  }

  public playCurtainOpen() {
    this.playTap();
  }

  public playFilterSwitch() {
    this.playTap();
  }

  public playPrinterMotor() {
    this.playTap();
  }
}

export const soundEngine = new PhotoboothSoundEngine();
export default soundEngine;
