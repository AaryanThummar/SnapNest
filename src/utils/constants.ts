import { 
  PhotoExperience, 
  FilterPreset, 
  FrameColorway, 
  DigitalSticker, 
  EventConfig,
  TemplateLayoutId 
} from '../types/booth';

export const PHOTO_EXPERIENCES: PhotoExperience[] = [
  {
    id: 'classic',
    name: 'Classic Photobooth',
    tagline: 'Timeless Studio Strips',
    badge: 'MOST POPULAR',
    accentColor: '#FF4757',
    iconName: 'Camera',
    shotCount: 3,
    description: '3 high-speed studio candid shots with instant countdown, studio flash, and custom photostrip printing.',
    previewImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    features: ['3 Studio Poses', 'Custom Print Layout', 'Digital QR Download']
  },
  {
    id: 'future_you',
    name: 'Future You',
    tagline: 'AI Age & Destiny Morph',
    badge: 'AI MAGIC',
    accentColor: '#00D2D3',
    iconName: 'Sparkles',
    shotCount: 1,
    description: 'Take a portrait and discover your futuristic look, cybernetic destiny, or celebrity older self.',
    previewImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    features: ['Cyberpunk 2077', 'Hollywood 2050', 'Ageless Classic']
  },
  {
    id: 'pose_battle',
    name: 'Pose Battle',
    tagline: 'Head-to-Head Showdown',
    badge: '2-PLAYER / DUO',
    accentColor: '#FFA502',
    iconName: 'Swords',
    shotCount: 2,
    description: 'Face off against your friend in rapid-fire randomized pose challenges with live scorecards.',
    previewImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    features: ['Randomized Prompts', 'VS Battle Split', 'Winner Badge']
  },
  {
    id: 'photo_roulette',
    name: 'Photo Roulette',
    tagline: 'Mystery Surprise Snap',
    badge: 'SURPRISE FX',
    accentColor: '#A55EEA',
    iconName: 'Dices',
    shotCount: 3,
    description: 'A wheel of fortune roulette spins during your countdown — surprise neon, retro, or wild FX applied on snap!',
    previewImage: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
    features: ['Mystery Filters', 'Surprise Stickers', 'Bonus GIF Loop']
  },
  {
    id: 'time_capsule',
    name: 'Time Capsule',
    tagline: 'Decade Time Machine',
    badge: 'VINTAGE DECADES',
    accentColor: '#FF6B81',
    iconName: 'History',
    shotCount: 3,
    description: 'Travel through the decades: 70s Disco Fever, 80s Synthwave, 90s Grunge, and 2000s Y2K Pop.',
    previewImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
    features: ['70s Disco Film', '80s Neon Wave', '90s VHS Cam', 'Y2K Cyber']
  },
  {
    id: 'around_world',
    name: 'Around the World',
    tagline: 'Virtual World Tour',
    badge: 'DESTINATIONS',
    accentColor: '#2ED573',
    iconName: 'Globe',
    shotCount: 3,
    description: 'Teleport instantly across the globe with virtual backdrops: Tokyo Shibuya, Paris Eiffel, and Rio Carnival.',
    previewImage: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80',
    features: ['Tokyo Neon', 'Paris Sunset', 'Rio Carnival', 'NYC Rooftop']
  }
];

export const TEMPLATE_LAYOUTS: { id: TemplateLayoutId; name: string; subtitle: string; aspect: string }[] = [
  { id: 'strip_2x6', name: 'Classic 2×6″ Strip', subtitle: '3-4 Poses Vertical Cut', aspect: '1/3' },
  { id: 'postcard_4x6', name: 'Postcard 4×6″', subtitle: 'Horizontal Duo & Grid', aspect: '3/2' },
  { id: 'grid_1x1', name: 'Square 1:1 Quad', subtitle: 'Social & Collage Grid', aspect: '1/1' },
  { id: 'polaroid_single', name: 'Single Polaroid', subtitle: 'Hero Portrait with Note', aspect: '3/4' }
];

export const FILTER_PRESETS: FilterPreset[] = [
  { id: 'normal', name: 'Studio Natural', category: 'vibrant', cssFilter: 'none', previewColor: '#FFFFFF', description: 'Crisp true-to-life studio colors' },
  { id: 'kardashian_bw', name: 'Glamour B&W', category: 'mono', cssFilter: 'grayscale(100%) contrast(145%) brightness(108%)', previewColor: '#1A1A1A', description: 'High contrast flawless studio monochrome' },
  { id: 'warm_glow', name: 'Golden Amber', category: 'vibrant', cssFilter: 'sepia(30%) saturate(140%) brightness(104%)', previewColor: '#F39C12', description: 'Warm golden hour sunset radiance' },
  { id: 'film_90s', name: '90s Flash Film', category: 'analog', cssFilter: 'contrast(125%) saturate(135%) brightness(108%)', previewColor: '#E74C3C', description: 'Nostalgic 35mm party flash tone' },
  { id: 'tokyo_neon', name: 'Cyberpunk Neon', category: 'creative', cssFilter: 'contrast(135%) hue-rotate(185deg) saturate(160%)', previewColor: '#00D2D3', description: 'Electric cyan and magenta night glow' },
  { id: 'vintage_70s', name: '70s Kodachrome', category: 'analog', cssFilter: 'sepia(45%) contrast(110%) saturate(130%)', previewColor: '#D35400', description: 'Warm nostalgic rich saturated grain' },
  { id: 'pastel_fade', name: 'Soft Velvet', category: 'creative', cssFilter: 'brightness(112%) contrast(90%) saturate(115%)', previewColor: '#FF6B81', description: 'Dreamy soft studio editorial tone' }
];

export const FRAME_COLORWAYS: FrameColorway[] = [
  { id: 'obsidian_dark', name: 'Studio Black', bgValue: '#12141A', textColor: '#FFFFFF', previewBg: '#12141A' },
  { id: 'pure_white', name: 'Editorial White', bgValue: '#FFFFFF', textColor: '#12141A', previewBg: '#FFFFFF' },
  { id: 'vermilion_red', name: 'Luma Vermilion', bgValue: '#FF4757', textColor: '#FFFFFF', previewBg: '#FF4757' },
  { id: 'studio_cyan', name: 'Electric Cyan', bgValue: '#00D2D3', textColor: '#0D0F14', previewBg: '#00D2D3' },
  { id: 'golden_luxe', name: 'Gold Foil', bgValue: '#FFA502', textColor: '#0D0F14', previewBg: '#FFA502' },
  { id: 'checker_retro', name: 'Retro Checker', bgValue: '#12141A', textColor: '#FFFFFF', borderStyle: 'checker', previewBg: '#333333' }
];

export const DIGITAL_STICKERS: DigitalSticker[] = [
  { id: 'stk_heart', emoji: '❤️', label: 'Heart', x: 20, y: 30, scale: 1, rotation: -10 },
  { id: 'stk_star', emoji: '⭐', label: 'Star', x: 80, y: 25, scale: 1.1, rotation: 12 },
  { id: 'stk_crown', emoji: '👑', label: 'Crown', x: 50, y: 15, scale: 1.2, rotation: 0 },
  { id: 'stk_glasses', emoji: '🕶️', label: 'Shades', x: 50, y: 45, scale: 1.3, rotation: 0 },
  { id: 'stk_sparkle', emoji: '✨', label: 'Sparkles', x: 75, y: 75, scale: 1, rotation: 5 },
  { id: 'stk_fire', emoji: '🔥', label: 'Fire', x: 25, y: 80, scale: 1, rotation: -5 },
  { id: 'stk_peace', emoji: '✌️', label: 'Peace', x: 15, y: 55, scale: 1, rotation: -12 },
  { id: 'stk_party', emoji: '🎉', label: 'Party', x: 85, y: 55, scale: 1, rotation: 15 }
];

export const AROUND_WORLD_DESTINATIONS = [
  { id: 'tokyo', name: 'Tokyo Shibuya', flag: '🇯🇵', subtitle: 'Neon Night Alley', bg: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80' },
  { id: 'paris', name: 'Paris Eiffel', flag: '🇫🇷', subtitle: 'Golden Hour Seine', bg: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80' },
  { id: 'rio', name: 'Rio Carnival', flag: '🇧🇷', subtitle: 'Copacabana Beach', bg: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=800&q=80' },
  { id: 'nyc', name: 'New York Skyline', flag: '🇺🇸', subtitle: 'Manhattan Rooftop', bg: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80' }
];

export const POSE_BATTLE_PROMPTS = [
  { p1: 'Rockstar Solo 🎸', p2: 'Pop Idol Dance 🎤' },
  { p1: 'Secret Agent 🕵️', p2: 'Super Villain 🦹' },
  { p1: 'High Fashion Vogue 💃', p2: 'Goofy Derp Face 🤪' },
  { p1: 'Action Movie Kick 🥋', p2: 'Dramatic Soap Opera 🎭' }
];

export const TIME_CAPSULE_DECADES = [
  { id: '70s', name: '1970s Disco', tag: 'DISCO FEVER', filter: 'sepia(50%) contrast(115%) saturate(130%)' },
  { id: '80s', name: '1980s Synthwave', tag: 'NEON RETRO', filter: 'contrast(130%) hue-rotate(270deg) saturate(160%)' },
  { id: '90s', name: '1990s VHS Cam', tag: 'GRUNGE VIBE', filter: 'contrast(120%) saturate(120%) brightness(105%)' },
  { id: '2000s', name: '2000s Y2K Pop', tag: 'CYBER POP', filter: 'brightness(110%) saturate(150%) contrast(105%)' }
];

export const MOCK_CANDID_POSES = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1000&q=80'
];

export const DEFAULT_EVENT_CONFIG: EventConfig = {
  eventName: 'GALA 2026 : THE MEMORY ARCHIVE',
  eventDate: 'AUGUST 24, 2026',
  boothName: 'LUMABOOTH PRO',
  footnote: 'POWERED BY LUMABOOTH · KEEP FOREVER',
  soundEnabled: true,
  countdownSeconds: 3,
  printCopies: 2,
  autoResetSeconds: 45,
  mirrorCamera: true,
  beautyFilterEnabled: true,
  beautyIntensity: 50,
  enabledExperiences: ['classic', 'future_you', 'pose_battle', 'photo_roulette', 'time_capsule', 'around_world']
};
