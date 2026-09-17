// src/utils/appConstants.ts
import { ExperienceMetadata, StudioSectionMeta, EventConfig, GuestProfile } from '../types/app';

export const PHOTO_EXPERIENCES: ExperienceMetadata[] = [
  {
    id: 'classic',
    title: 'Classic Photobooth',
    subtitle: 'Timeless multi-shot studio strip',
    badge: 'Guest Favorite',
    icon: 'Camera',
    accent: '#E02678',
    gradient: 'linear-gradient(135deg, #FF2A85 0%, #E02678 100%)',
    shotCount: 3,
    durationEst: '45s',
    description: '3 crisp studio poses with instant vintage, glamour, or color-graded filmstrip processing.',
    tags: ['3 Shots', 'Film Strip', 'Instant Print']
  },
  {
    id: 'future_you',
    title: 'Future You',
    subtitle: 'AI aging, cyberpunk & celebrity morphs',
    badge: 'AI Powered',
    icon: 'Sparkles',
    accent: '#9D4EDD',
    gradient: 'linear-gradient(135deg, #C77DFF 0%, #7B2CBF 100%)',
    shotCount: 2,
    durationEst: '60s',
    description: 'State-of-the-art neural styling transforms your portrait into futuristic personas and golden-era cinema.',
    tags: ['Neural AI', 'Style Morph', '2 Shots']
  },
  {
    id: 'pose_battle',
    title: 'Pose Battle',
    subtitle: 'Head-to-head 2-player pose showdown',
    badge: 'Party Multiplayer',
    icon: 'Swords',
    accent: '#FFB703',
    gradient: 'linear-gradient(135deg, #FFD166 0%, #FB8500 100%)',
    shotCount: 4,
    durationEst: '60s',
    description: 'Side-by-side prompt challenges! Compete with your friend for the most dramatic red-carpet expression.',
    tags: ['2 Players', 'Prompt Cards', 'Fun FX']
  },
  {
    id: 'photo_roulette',
    title: 'Photo Roulette',
    subtitle: 'Mystery surprise filters & glitch art',
    badge: 'Wildcard',
    icon: 'Dices',
    accent: '#06D6A0',
    gradient: 'linear-gradient(135deg, #06D6A0 0%, #118AB2 100%)',
    shotCount: 3,
    durationEst: '40s',
    description: 'The booth spins a mystery effect wheel on every shutter click. No two sessions are ever identical.',
    tags: ['Mystery VFX', 'Surprise', 'Dynamic']
  },
  {
    id: 'time_capsule',
    title: 'Time Capsule',
    subtitle: 'Travel through 70s, 80s, 90s & Y2K',
    badge: 'Retro Magic',
    icon: 'Hourglass',
    accent: '#FF007F',
    gradient: 'linear-gradient(135deg, #FF5E97 0%, #A200FF 100%)',
    shotCount: 4,
    durationEst: '50s',
    description: 'Instant decade teleportation with authentic film stocks, light leaks, Polaroid borders, and 90s camcorder aesthetics.',
    tags: ['Decades', 'Analog Film', 'Retro']
  },
  {
    id: 'around_world',
    title: 'Around the World',
    subtitle: 'Virtual backdrop teleportation',
    badge: 'Immersive',
    icon: 'Globe',
    accent: '#00F5D4',
    gradient: 'linear-gradient(135deg, #00F5D4 0%, #0077B6 100%)',
    shotCount: 3,
    durationEst: '50s',
    description: 'Chroma-free real-time background segmenting places you in Paris, Tokyo neon streets, or lunar orbit.',
    tags: ['AI Backdrops', 'Travel', 'Chroma-Free']
  }
];

export const STUDIO_SECTIONS: StudioSectionMeta[] = [
  // Group 1: Capture & Creation
  {
    id: 'camera',
    group: 'capture',
    title: 'Camera & Optics',
    shortTitle: 'Camera',
    description: 'Live sensor feed, lens selection, manual ISO, shutter & white balance',
    iconName: 'Camera',
    badge: '4K 60FPS'
  },
  {
    id: 'capture_settings',
    group: 'capture',
    title: 'Capture Sequence',
    shortTitle: 'Capture',
    description: 'Countdown timers, multi-burst intervals, ring light & shutter audio',
    iconName: 'Sliders',
    badge: '5s Delay'
  },
  {
    id: 'layouts',
    group: 'capture',
    title: 'Layouts & Templates',
    shortTitle: 'Layouts',
    description: '2x6 strip, 4x6 landscape postcard, 1:1 polaroid & bespoke grid borders',
    iconName: 'LayoutGrid',
    badge: '4 Layouts'
  },
  {
    id: 'stickers',
    group: 'capture',
    title: 'Stickers & Stamps',
    shortTitle: 'Stickers',
    description: 'Event emoji packs, PNG digital props, drag-and-pinch gesture rules',
    iconName: 'Sticker',
    badge: '32 Items'
  },
  {
    id: 'effects',
    group: 'capture',
    title: 'Effects & Filters',
    shortTitle: 'Effects',
    description: 'Analog 35mm film, Glamour soft-skin, Cyberpunk glow & monochrome presets',
    iconName: 'Wand2',
    badge: '12 Presets'
  },
  {
    id: 'ai_portraits',
    group: 'capture',
    title: 'AI Portraits & Styles',
    shortTitle: 'AI Styles',
    description: 'Diffusion model weights, prompt templates, facial enhancement intensity',
    iconName: 'Sparkles',
    badge: 'Neural Engine'
  },
  {
    id: 'bg_removal',
    group: 'capture',
    title: 'Background & Green Screen',
    shortTitle: 'Backdrops',
    description: 'Chroma-key tolerance, AI segmentation masks, virtual scenery library',
    iconName: 'Layers',
    badge: 'AI Masking'
  },
  {
    id: 'text_images',
    group: 'capture',
    title: 'Text, Logos & Overlays',
    shortTitle: 'Overlays',
    description: 'Event monograms, sponsor logos, customizable typography & date stamps',
    iconName: 'Type',
    badge: 'Live Stamp'
  },

  // Group 2: Output & Engagement
  {
    id: 'guest_data',
    group: 'output',
    title: 'Guest Data & Gallery',
    shortTitle: 'Guest Data',
    description: 'Collected emails, phone numbers, total prints, cloud sync status',
    iconName: 'Users',
    badge: '142 Leads'
  },
  {
    id: 'printing',
    group: 'output',
    title: 'Printing Station',
    shortTitle: 'Printing',
    description: 'DNP DS620, AirPrint, print queue speed, auto-cut 2x6 strip slicing',
    iconName: 'Printer',
    badge: 'Online'
  },
  {
    id: 'sharing',
    group: 'output',
    title: 'Sharing & AirDrop',
    shortTitle: 'Sharing',
    description: 'Instant animated QR code kiosk, AirDrop beacon, short links',
    iconName: 'Share2',
    badge: 'Active QR'
  },
  {
    id: 'email_sms',
    group: 'output',
    title: 'Email & SMS Delivery',
    shortTitle: 'Email/SMS',
    description: 'Custom message template, delivery logs, TCPA consent checkbox',
    iconName: 'Mail',
    badge: 'Twilio Live'
  },
  {
    id: 'virtual_attendant',
    group: 'output',
    title: 'Virtual Attendant',
    shortTitle: 'Attendant',
    description: 'Interactive voice prompts, animated guidance avatar & sound design',
    iconName: 'Bot',
    badge: 'Voice Active'
  },
  {
    id: 'survey',
    group: 'output',
    title: 'Survey & Lead Forms',
    shortTitle: 'Survey',
    description: 'Pre-capture custom questions, star ratings, digital disclaimer signature',
    iconName: 'ClipboardCheck',
    badge: 'Optional'
  },

  // Group 3: Event & System Settings
  {
    id: 'event_settings',
    group: 'event',
    title: 'Event & Brand Setup',
    shortTitle: 'Event Setup',
    description: 'Event name, venue, lock screen PIN, auto-reset timeout timer',
    iconName: 'Calendar',
    badge: 'Gala 2026'
  },
  {
    id: 'system_settings',
    group: 'event',
    title: 'Account & System',
    shortTitle: 'System',
    description: 'LumaCloud sync, device storage diagnostics, battery health, lock screen',
    iconName: 'Settings',
    badge: 'Pro Tier'
  }
];

export const DEFAULT_EVENT_CONFIG: EventConfig = {
  eventName: 'Vogue Horizon Gala 2026',
  eventDate: 'August 28, 2026',
  hostName: 'Studio Luma & Co.',
  hashtag: '#LumaBooth2026',
  boothPin: '1234',
  autoResetSeconds: 45,
  soundEnabled: true,
  countdownSeconds: 5,
  printCopiesAllowed: 2,
  mirrorCamera: true,
  beautyFilterIntensity: 45,
  activeExperiences: ['classic', 'future_you', 'pose_battle', 'photo_roulette', 'time_capsule', 'around_world']
};

export const MOCK_GUEST_PROFILE: GuestProfile = {
  name: 'Camila Rodriguez',
  email: 'camila.r@voguehorizon.com',
  phone: '+1 (555) 382-9901',
  isGuest: false,
  favoriteStyle: 'Classic Glam'
};

export const CANDID_SAMPLE_SHOTS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80'
];
