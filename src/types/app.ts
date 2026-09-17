// src/types/app.ts

export type AppMode = 'guest' | 'studio';

export type DeviceViewport = 
  | 'phone'              // Mobile phone (portrait or landscape, optimized for hand-held touch)
  | 'tablet_portrait'    // Tablet Portrait
  | 'tablet_landscape';  // Tablet Landscape / Kiosk Enclosure

export type GuestStep = 
  | 'create_event'         // Create Event First Screen
  | 'welcome'              // Attract / start screen with animated lens
  | 'dashboard'            // Premium Event Dashboard
  | 'memories'             // Premium Memories Gallery
  | 'auth'                 // Login / Sign Up / Continue as Guest
  | 'personalized_welcome' // Guest profile check-in & greeting
  | 'experiences'          // Interactive photo experiences selection
  | 'capture'              // Camera capture viewport with countdown & live guide
  | 'pose_battle'          // Pose Battle 3-round interactive mode
  | 'photo_roulette'       // Wildcard Roulette spinning wheel mode
  | 'future_you'           // Future You 2050 AI morph mode
  | 'ai_morph'             // AI Morph style transformation mode
  | 'ai_synthesis'         // AI Synthesis mood & style canvas mode
  | 'edit'                 // Filters, digital stickers, effects, adjustments
  | 'ai_magic'             // AI Magic creative style synthesis studio
  | 'photostrip'           // Layout template builder (2x6, 4x6, polaroid)
  | 'ai_fx'                // AI FX Creative Studio
  | 'ai_bg'                // AI Background Studio
  | 'share';               // QR Code, AirDrop, SMS/Email, Instant Print

export type ExperienceType = 
  | 'photobooth'     // Classic Photostrip
  | 'classic'        // Classic 3-Shot Photostrip
  | 'pose_battle'    // Challenge your friends
  | 'photo_roulette' // Let Luma choose (Wildcard)
  | 'future_you'     // Meet yourself later
  | 'ai_morph'       // Choose your transformation
  | 'ai_synthesis'   // Create your AI look
  | 'time_capsule'   // Save this moment
  | 'around_world'   // Go anywhere
  | 'luma_ai_studio'; // Transform your memory

export interface ExperienceMetadata {
  id: ExperienceType;
  title: string;
  subtitle: string;
  badge: string;
  icon: string;
  accent: string;
  gradient: string;
  shotCount: number;
  durationEst: string;
  description: string;
  tags: string[];
}

export type StudioSectionGroup = 'capture' | 'output' | 'event';

export type StudioSection = 
  // Group 1: Capture & Camera
  | 'camera'              // Camera & Lens feeds, ISO, White balance, Flash
  | 'capture_settings'    // Countdown timer, Multi-shot count, Shutter delay
  | 'layouts'             // Photo Layouts & Print Templates (2x6, 4x6, Square)
  | 'stickers'            // Digital Stickers & Overlay management
  | 'effects'             // Filters, Color Grading, Glam & Vintage Presets
  | 'ai_portraits'        // AI Style Models, Prompts, Morphing
  | 'bg_removal'          // Green Screen & AI Chroma Key virtual backdrops
  | 'text_images'         // Custom Logos, Event Monograms, Watermarks
  // Group 2: Output & Engagement
  | 'guest_data'          // Lead capture data, gallery export, session stats
  | 'printing'            // AirPrint, DNP DS620, print counts, auto-cut
  | 'sharing'             // Live QR code kiosk, AirDrop, Offline queue
  | 'email_sms'           // Twilio SMS, SendGrid Email templates & disclaimers
  | 'virtual_attendant'   // AI Voice guide, countdown avatar, audio cues
  | 'survey'              // Pre/Post capture survey & consent forms
  // Group 3: Event & System Settings
  | 'event_settings'      // Event name, date, hashtag, passcode lock, timer
  | 'system_settings';    // Hardware diagnostics, cloud sync, battery, storage

export interface StudioSectionMeta {
  id: StudioSection;
  group: StudioSectionGroup;
  title: string;
  shortTitle: string;
  description: string;
  iconName: string;
  badge?: string;
}

export interface GuestProfile {
  name: string;
  email?: string;
  phone?: string;
  isGuest: boolean;
  avatarSeed?: string;
  favoriteStyle?: string;
}

export interface EventTheme {
  themeName: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  surfaceColor: string;
  textColor: string;
  subtextColor: string;
  gradient: string;
  buttonGradient: string;
  glowColor: string;
  ambientGlow: string;
  borderColor: string;
  fontStyle: string;
  visualStyle: 'playful_luxury' | 'romantic_luxury' | 'energetic' | 'corporate_minimal' | 'nightlife_vibrant' | 'general_tasteful';
  photostripTheme: 'pink_studio' | 'retro_film' | 'purple_glow' | 'midnight' | 'minimal_white' | 'original';
  particleType: 'confetti' | 'romantic' | 'energetic' | 'minimal' | 'neon';
  tagline: string;
  heroHeadline: string;
  heroSubheadline: string;
}

export interface EventCaptureModes {
  photo: boolean;
  gif: boolean;
  slowmo360: boolean;
  video: boolean;
}

export interface EventSharingOptions {
  airdrop: boolean;
  qr: boolean;
  whatsapp: boolean;
  email: boolean;
  sms: boolean;
}

export interface EventSpecificSettings {
  layout?: 'strip_2x6' | 'postcard_4x6' | 'grid_1x1' | 'polaroid';
  countdownSeconds?: 3 | 5 | 10;
  soundEnabled?: boolean;
  mirrorCamera?: boolean;
  beautyFilterIntensity?: number;
  stickersEnabled?: boolean;
  aiPortraitsEnabled?: boolean;
  bgRemovalEnabled?: boolean;
  activeExperiences?: ExperienceType[];
  captureModes?: EventCaptureModes;
  printToLumaBooth?: boolean;
  sharingOptions?: EventSharingOptions;
  emailSmsEnabled?: boolean;
  virtualAttendantEnabled?: boolean;
  surveyEnabled?: boolean;
  disclaimerEnabled?: boolean;
  watermarkEnabled?: boolean;
  print?: {
    enabled?: boolean;
    layout?: string;
    paperSize?: string;
    copies?: number;
    caption?: string;
  };
}

export interface ActiveEvent {
  id: string;
  eventName: string;
  eventDate: string;
  eventType: string;
  hostName?: string;
  eventCode?: string;
  createdAt: number;
  theme?: EventTheme;
  settings?: EventSpecificSettings;
}

export interface EventConfig {
  eventName: string;
  eventDate: string;
  hostName: string;
  hashtag: string;
  boothPin: string;
  autoResetSeconds: number;
  soundEnabled: boolean;
  countdownSeconds: 3 | 5 | 10;
  printCopiesAllowed: number;
  mirrorCamera: boolean;
  beautyFilterIntensity: number;
  activeExperiences: ExperienceType[];
}

export interface CapturedPhoto {
  id: string;
  url: string;
  index: number;
  timestamp: number;
  metadata?: {
    filter?: string;
    posePrompt?: string;
    decade?: string;
    destination?: string;
  };
}

export interface MemoryItem {
  id: string;
  eventId: string;
  eventName: string;
  sessionId?: string;
  imageUrl: string;
  type: 
    | 'photo' 
    | 'photostrip' 
    | 'photobooth' 
    | 'ai_morph' 
    | 'ai-morph' 
    | 'future_you' 
    | 'future-you' 
    | 'pose-battle' 
    | 'pose_battle' 
    | 'wildcard' 
    | 'synthesis' 
    | 'ai-synthesis' 
    | string;
  createdAt: number;
  caption?: string;
  aspectRatio?: string;
}

