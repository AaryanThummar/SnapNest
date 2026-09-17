// src/utils/themeEngine.ts
import { ActiveEvent, EventTheme } from '../types/app';
export type { EventTheme };

export const DEFAULT_LUMABOOTH_THEME: EventTheme = {
  themeName: 'Luma Classic',
  primaryColor: '#E5487D',
  secondaryColor: '#8B3FD1',
  accentColor: '#00F5D4',
  backgroundColor: '#090817',
  surfaceColor: 'rgba(13, 11, 28, 0.85)',
  textColor: '#FFFFFF',
  subtextColor: '#B8B6D1',
  gradient: 'linear-gradient(135deg, #E5487D 0%, #B82E88 45%, #8B3FD1 100%)',
  buttonGradient: 'linear-gradient(135deg, #E5487D 0%, #B82E88 45%, #8B3FD1 100%)',
  glowColor: 'rgba(229, 72, 125, 0.35)',
  ambientGlow: 'radial-gradient(circle, rgba(229, 72, 125, 0.16) 0%, rgba(139, 63, 209, 0.1) 45%, transparent 70%)',
  borderColor: 'rgba(185, 167, 255, 0.22)',
  fontStyle: 'display',
  visualStyle: 'general_tasteful',
  photostripTheme: 'original',
  particleType: 'confetti',
  tagline: 'LumaBooth Creative Studio',
  heroHeadline: 'YOUR MOMENT. YOUR STORY.',
  heroSubheadline: 'Make it worth keeping.'
};

/**
 * Generates an intelligent, tailored visual theme based on event type and name
 */
export const generateEventTheme = (event: Partial<ActiveEvent>): EventTheme => {
  const eventType = (event.eventType || '').toLowerCase();
  const eventName = event.eventName || 'LumaBooth Event';

  // 1. BIRTHDAY: Playful Luxury (Coral / Pink / Purple / Celebratory Gold)
  if (eventType.includes('birthday') || eventName.toLowerCase().includes('birthday') || eventName.toLowerCase().includes('bday')) {
    return {
      themeName: 'Birthday Celebration',
      primaryColor: '#FF5C8A',
      secondaryColor: '#8B3FD1',
      accentColor: '#FFB703',
      backgroundColor: '#0B0718',
      surfaceColor: 'rgba(20, 12, 38, 0.88)',
      textColor: '#FFFFFF',
      subtextColor: '#E8D5FF',
      gradient: 'linear-gradient(135deg, #FF5C8A 0%, #E5487D 40%, #8B3FD1 100%)',
      buttonGradient: 'linear-gradient(135deg, #FF5C8A 0%, #E5487D 50%, #8B3FD1 100%)',
      glowColor: 'rgba(255, 92, 138, 0.45)',
      ambientGlow: 'radial-gradient(circle, rgba(255, 92, 138, 0.18) 0%, rgba(139, 63, 209, 0.12) 45%, transparent 70%)',
      borderColor: 'rgba(255, 92, 138, 0.3)',
      fontStyle: 'display',
      visualStyle: 'playful_luxury',
      photostripTheme: 'pink_studio',
      particleType: 'confetti',
      tagline: 'Birthday Edition',
      heroHeadline: eventName,
      heroSubheadline: "Let's make some celebratory memories."
    };
  }

  // 2. WEDDING: Romantic Luxury (Rose Gold / Warm Champagne / Deep Burgundy)
  if (eventType.includes('wedding') || eventName.toLowerCase().includes('wedding') || eventName.includes('&') || eventName.toLowerCase().includes('and')) {
    return {
      themeName: 'Romantic Wedding',
      primaryColor: '#E07A5F',
      secondaryColor: '#800E33',
      accentColor: '#F4D06F',
      backgroundColor: '#0F0811',
      surfaceColor: 'rgba(28, 12, 22, 0.9)',
      textColor: '#FFFDF9',
      subtextColor: '#F3D2C1',
      gradient: 'linear-gradient(135deg, #F4D06F 0%, #E07A5F 45%, #800E33 100%)',
      buttonGradient: 'linear-gradient(135deg, #F4D06F 0%, #E07A5F 50%, #800E33 100%)',
      glowColor: 'rgba(224, 122, 95, 0.4)',
      ambientGlow: 'radial-gradient(circle, rgba(244, 208, 111, 0.15) 0%, rgba(128, 14, 51, 0.15) 50%, transparent 70%)',
      borderColor: 'rgba(244, 208, 111, 0.3)',
      fontStyle: 'display',
      visualStyle: 'romantic_luxury',
      photostripTheme: 'retro_film',
      particleType: 'romantic',
      tagline: 'Love & Memories',
      heroHeadline: eventName,
      heroSubheadline: 'Celebrating love & timeless moments.'
    };
  }

  // 3. COLLEGE EVENT: Energetic (Electric Violet / Hyper Blue / Cyber Teal)
  if (eventType.includes('college') || eventType.includes('fest') || eventName.toLowerCase().includes('fest') || eventName.toLowerCase().includes('college') || eventName.toLowerCase().includes('campus')) {
    return {
      themeName: 'Campus Energy',
      primaryColor: '#7928CA',
      secondaryColor: '#0070F3',
      accentColor: '#00F5D4',
      backgroundColor: '#07071A',
      surfaceColor: 'rgba(13, 14, 38, 0.88)',
      textColor: '#FFFFFF',
      subtextColor: '#A7C7E7',
      gradient: 'linear-gradient(135deg, #00F5D4 0%, #0070F3 50%, #7928CA 100%)',
      buttonGradient: 'linear-gradient(135deg, #0070F3 0%, #7928CA 100%)',
      glowColor: 'rgba(121, 40, 202, 0.45)',
      ambientGlow: 'radial-gradient(circle, rgba(0, 245, 212, 0.15) 0%, rgba(121, 40, 202, 0.15) 50%, transparent 70%)',
      borderColor: 'rgba(0, 245, 212, 0.3)',
      fontStyle: 'display',
      visualStyle: 'energetic',
      photostripTheme: 'purple_glow',
      particleType: 'energetic',
      tagline: 'Festival Edition',
      heroHeadline: eventName,
      heroSubheadline: 'Capture the hype & campus energy.'
    };
  }

  // 4. CORPORATE: Minimal Premium (Executive Blue / Silver / Deep Navy)
  if (eventType.includes('corporate') || eventName.toLowerCase().includes('corp') || eventName.toLowerCase().includes('gala') || eventName.toLowerCase().includes('summit') || eventName.toLowerCase().includes('conference')) {
    return {
      themeName: 'Corporate Prestige',
      primaryColor: '#0077B6',
      secondaryColor: '#48CAE4',
      accentColor: '#E2E8F0',
      backgroundColor: '#060B14',
      surfaceColor: 'rgba(10, 19, 34, 0.9)',
      textColor: '#FFFFFF',
      subtextColor: '#90E0EF',
      gradient: 'linear-gradient(135deg, #48CAE4 0%, #0077B6 50%, #03045E 100%)',
      buttonGradient: 'linear-gradient(135deg, #0077B6 0%, #023E8A 100%)',
      glowColor: 'rgba(0, 119, 182, 0.35)',
      ambientGlow: 'radial-gradient(circle, rgba(72, 202, 228, 0.14) 0%, rgba(3, 4, 94, 0.18) 50%, transparent 70%)',
      borderColor: 'rgba(72, 202, 228, 0.25)',
      fontStyle: 'display',
      visualStyle: 'corporate_minimal',
      photostripTheme: 'minimal_white',
      particleType: 'minimal',
      tagline: 'Executive Gala',
      heroHeadline: eventName,
      heroSubheadline: 'Professional moments, executive brilliance.'
    };
  }

  // 5. PARTY: Nightlife Vibrant (Laser Magenta / Deep Ultraviolet / Neon Cyan)
  if (eventType.includes('party') || eventName.toLowerCase().includes('party') || eventName.toLowerCase().includes('neon') || eventName.toLowerCase().includes('night')) {
    return {
      themeName: 'Neon Nightlife',
      primaryColor: '#FF007F',
      secondaryColor: '#7928CA',
      accentColor: '#00F5D4',
      backgroundColor: '#050512',
      surfaceColor: 'rgba(18, 9, 34, 0.9)',
      textColor: '#FFFFFF',
      subtextColor: '#F472B6',
      gradient: 'linear-gradient(135deg, #00F5D4 0%, #FF007F 50%, #7928CA 100%)',
      buttonGradient: 'linear-gradient(135deg, #FF007F 0%, #7928CA 100%)',
      glowColor: 'rgba(255, 0, 127, 0.5)',
      ambientGlow: 'radial-gradient(circle, rgba(255, 0, 127, 0.18) 0%, rgba(0, 245, 212, 0.12) 50%, transparent 70%)',
      borderColor: 'rgba(255, 0, 127, 0.35)',
      fontStyle: 'display',
      visualStyle: 'nightlife_vibrant',
      photostripTheme: 'midnight',
      particleType: 'neon',
      tagline: 'After Hours',
      heroHeadline: eventName,
      heroSubheadline: 'Turn up the neon. Live the moment.'
    };
  }

  // 6. OTHER: General Tasteful Customization
  return {
    themeName: 'Luma Custom',
    primaryColor: '#E5487D',
    secondaryColor: '#8B3FD1',
    accentColor: '#00F5D4',
    backgroundColor: '#080714',
    surfaceColor: 'rgba(13, 11, 28, 0.88)',
    textColor: '#FFFFFF',
    subtextColor: '#B8B6D1',
    gradient: 'linear-gradient(135deg, #E5487D 0%, #B82E88 45%, #8B3FD1 100%)',
    buttonGradient: 'linear-gradient(135deg, #E5487D 0%, #B82E88 45%, #8B3FD1 100%)',
    glowColor: 'rgba(229, 72, 125, 0.35)',
    ambientGlow: 'radial-gradient(circle, rgba(229, 72, 125, 0.16) 0%, rgba(139, 63, 209, 0.1) 45%, transparent 70%)',
    borderColor: 'rgba(185, 167, 255, 0.25)',
    fontStyle: 'display',
    visualStyle: 'general_tasteful',
    photostripTheme: 'original',
    particleType: 'confetti',
    tagline: 'Luma Special Event',
    heroHeadline: eventName,
    heroSubheadline: 'Every moment captured in style.'
  };
};

/**
 * Applies the generated theme to the DOM via CSS custom variables
 */
export const applyThemeToDom = (theme: EventTheme): void => {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  root.style.setProperty('--event-primary', theme.primaryColor);
  root.style.setProperty('--event-secondary', theme.secondaryColor);
  root.style.setProperty('--event-accent', theme.accentColor);
  root.style.setProperty('--event-background', theme.backgroundColor);
  root.style.setProperty('--event-surface', theme.surfaceColor);
  root.style.setProperty('--event-text', theme.textColor);
  root.style.setProperty('--event-subtext', theme.subtextColor);
  root.style.setProperty('--event-gradient', theme.gradient);
  root.style.setProperty('--event-button-gradient', theme.buttonGradient);
  root.style.setProperty('--event-glow', theme.glowColor);
  root.style.setProperty('--event-ambient-glow', theme.ambientGlow);
  root.style.setProperty('--event-border', theme.borderColor);
  root.style.setProperty('--luma-bg-primary', theme.backgroundColor);
};
