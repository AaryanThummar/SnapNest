export type ExperienceId = 
  | 'classic'        // Classic 3-4 Shot Photostrip
  | 'future_you'     // AI Future Self / Aging / Celebrity
  | 'pose_battle'    // 2-Player Head-to-Head Pose Challenge
  | 'photo_roulette' // Random Mystery Filter & Effects on Snap
  | 'time_capsule'   // Retro Decade Time Travel (70s, 80s, 90s, 2000s)
  | 'around_world';  // Virtual Backdrop Teleportation

export type ScreenStep = 
  | 'welcome'        // Attract screen
  | 'experiences'    // Choose Experience
  | 'capture'        // Camera Capture Studio
  | 'review'         // Review & Filter Edit
  | 'layout'         // Strip & Template Studio
  | 'share';         // Print & QR Sharing

export type TemplateLayoutId = 
  | 'strip_2x6'      // Classic 2x6 Double Strip
  | 'postcard_4x6'   // 4x6 Landscape / Duo Postcard
  | 'grid_1x1'       // 1:1 Quad Grid
  | 'polaroid_single'// Large Single Polaroid with Footer

export interface PhotoExperience {
  id: ExperienceId;
  name: string;
  tagline: string;
  badge: string;
  accentColor: string;
  iconName: string;
  shotCount: number;
  description: string;
  previewImage: string;
  features: string[];
}

export interface CapturedShot {
  id: string;
  index: number;
  url: string;
  processedUrl?: string;
  timestamp: number;
  metadata?: {
    prompt?: string;
    decade?: string;
    location?: string;
    mysteryFilter?: string;
  };
}

export interface FilterPreset {
  id: string;
  name: string;
  category: 'analog' | 'vibrant' | 'mono' | 'creative';
  cssFilter: string;
  previewColor: string;
  description: string;
}

export interface FrameColorway {
  id: string;
  name: string;
  bgValue: string;
  textColor: string;
  borderStyle?: 'solid' | 'checker' | 'film_perforation';
  previewBg: string;
}

export interface DigitalSticker {
  id: string;
  emoji: string;
  label: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  scale: number;
  rotation: number;
}

export interface EventConfig {
  eventName: string;
  eventDate: string;
  boothName: string;
  footnote: string;
  soundEnabled: boolean;
  countdownSeconds: 3 | 5 | 10;
  printCopies: number;
  autoResetSeconds: number;
  mirrorCamera: boolean;
  beautyFilterEnabled: boolean;
  beautyIntensity: number; // 0 - 100
  enabledExperiences: ExperienceId[];
}
