// src/config/backgrounds.ts
// Centralized Background Library Configuration for LumaBooth

export interface BackgroundItem {
  id: string;
  name: string;
  description: string;
  previewImage: string;
  gradient: string;
  auraStyle: string;
  accentColor: string;
  category: 'Original' | 'Studio' | 'Urban' | 'Nature' | 'Lifestyle' | 'Celebration';
  prompt: string;
}

export const BACKGROUNDS: BackgroundItem[] = [
  {
    id: 'none',
    name: 'NONE',
    description: 'Keep the original background.',
    previewImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    gradient: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.04) 100%)',
    auraStyle: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.08) 0%, rgba(8, 7, 20, 0.85) 100%)',
    accentColor: '#94A3B8',
    category: 'Original',
    prompt: 'Keep original background untouched.'
  },
  {
    id: 'luxury_studio',
    name: 'LUXURY STUDIO',
    description: 'Premium warm photography studio, velvet drapes, sophisticated lighting.',
    previewImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300&auto=format&fit=crop&q=80',
    gradient: 'linear-gradient(135deg, rgba(217, 119, 6, 0.45) 0%, rgba(30, 20, 10, 0.9) 100%)',
    auraStyle: 'radial-gradient(circle at center, rgba(217, 119, 6, 0.28) 0%, rgba(10, 8, 20, 0.8) 100%)',
    accentColor: '#F59E0B',
    category: 'Studio',
    prompt: 'Replace only the background with a premium luxury photography studio featuring sophisticated warm lighting, elegant neutral architecture, subtle velvet drapery and polished editorial styling. Match the subject\'s perspective, shadows, exposure and color temperature. Preserve the exact person, face, hair, clothing, accessories and pose. Make the result look like a professionally photographed studio portrait.'
  },
  {
    id: 'neon_city',
    name: 'NEON CITY',
    description: 'Futuristic neon city at night, cinematic lights.',
    previewImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=300&auto=format&fit=crop&q=80',
    gradient: 'linear-gradient(135deg, rgba(6, 182, 212, 0.5) 0%, rgba(236, 72, 153, 0.5) 100%)',
    auraStyle: 'radial-gradient(circle at center, rgba(6, 182, 212, 0.28) 0%, rgba(236, 72, 153, 0.18) 60%, rgba(8, 7, 20, 0.9) 100%)',
    accentColor: '#22D3EE',
    category: 'Urban',
    prompt: 'Replace only the background with a realistic futuristic city at night with cinematic neon signage, wet reflective streets and atmospheric depth. Match neon illumination onto the subject naturally. Preserve the exact person, face, hair, clothing, accessories and pose. No cutout edges.'
  },
  {
    id: 'beach_sunset',
    name: 'BEACH SUNSET',
    description: 'Tropical beach, golden sunset, ocean, palm trees.',
    previewImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&auto=format&fit=crop&q=80',
    gradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.55) 0%, rgba(225, 29, 72, 0.45) 100%)',
    auraStyle: 'radial-gradient(circle at center, rgba(245, 158, 11, 0.3) 0%, rgba(225, 29, 72, 0.2) 60%, rgba(8, 7, 20, 0.9) 100%)',
    accentColor: '#FB923C',
    category: 'Nature',
    prompt: 'Replace only the background with a photorealistic tropical beach during golden-hour sunset. Include a realistic ocean horizon, warm orange-pink sky, subtle waves and naturally positioned palm trees. Match the subject\'s perspective, exposure, color temperature, depth of field and lighting. Add subtle warm sunset illumination to the subject so the person appears naturally photographed at the beach. Preserve the exact person, face, hair, clothing, accessories and pose.'
  },
  {
    id: 'mountain_view',
    name: 'MOUNTAIN VIEW',
    description: 'Beautiful mountain landscape with natural daylight.',
    previewImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=300&auto=format&fit=crop&q=80',
    gradient: 'linear-gradient(135deg, rgba(14, 165, 233, 0.5) 0%, rgba(16, 185, 129, 0.45) 100%)',
    auraStyle: 'radial-gradient(circle at center, rgba(14, 165, 233, 0.3) 0%, rgba(16, 185, 129, 0.18) 60%, rgba(8, 7, 20, 0.9) 100%)',
    accentColor: '#38BDF8',
    category: 'Nature',
    prompt: 'Replace only the background with a breathtaking alpine mountain panorama during crisp golden daylight, snow-dusted peaks, lush pine valley, and clear atmospheric blue sky. Match natural outdoor daylight exposure and shadows onto the subject. Preserve the exact person, face, hair, clothing, accessories and pose.'
  },
  {
    id: 'cozy_cafe',
    name: 'COZY CAFE',
    description: 'Warm aesthetic modern cafe interior.',
    previewImage: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=300&auto=format&fit=crop&q=80',
    gradient: 'linear-gradient(135deg, rgba(180, 83, 9, 0.5) 0%, rgba(120, 53, 15, 0.8) 100%)',
    auraStyle: 'radial-gradient(circle at center, rgba(180, 83, 9, 0.32) 0%, rgba(10, 8, 20, 0.85) 100%)',
    accentColor: '#D97706',
    category: 'Lifestyle',
    prompt: 'Replace only the background with a warm aesthetic contemporary artisan coffee shop interior, soft ambient warm Edison bulb glow, natural wood finishes, blurred barista bar and indoor plants. Match the soft warm cafe interior lighting and natural indoor depth of field onto the subject. Preserve the exact person, face, hair, clothing, accessories and pose.'
  },
  {
    id: 'new_york',
    name: 'NEW YORK',
    description: 'Cinematic New York city environment.',
    previewImage: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=300&auto=format&fit=crop&q=80',
    gradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.5) 0%, rgba(245, 158, 11, 0.4) 100%)',
    auraStyle: 'radial-gradient(circle at center, rgba(59, 130, 246, 0.3) 0%, rgba(245, 158, 11, 0.18) 60%, rgba(8, 7, 20, 0.9) 100%)',
    accentColor: '#60A5FA',
    category: 'Urban',
    prompt: 'Replace only the background with a cinematic Manhattan New York streetscape, classic brownstone architecture, distant yellow cabs, and authentic metropolitan city daylight with natural optical bokeh. Match urban natural sunlight and realistic shadows onto the subject. Preserve the exact person, face, hair, clothing, accessories and pose.'
  },
  {
    id: 'garden_blossom',
    name: 'GARDEN BLOSSOM',
    description: 'Elegant flowering garden with sunlight.',
    previewImage: 'https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?w=300&auto=format&fit=crop&q=80',
    gradient: 'linear-gradient(135deg, rgba(236, 72, 153, 0.5) 0%, rgba(34, 197, 94, 0.45) 100%)',
    auraStyle: 'radial-gradient(circle at center, rgba(236, 72, 153, 0.28) 0%, rgba(34, 197, 94, 0.2) 60%, rgba(8, 7, 20, 0.9) 100%)',
    accentColor: '#F472B6',
    category: 'Nature',
    prompt: 'Replace only the background with a sun-drenched botanical garden in full springtime bloom, soft pastel cherry blossom petals, vibrant greenery, and natural sunlight filtering through leaves. Match gentle dappled garden sunlight highlights onto the subject. Preserve the exact person, face, hair, clothing, accessories and pose without artificial cutout lines.'
  },
  {
    id: 'vintage_room',
    name: 'VINTAGE ROOM',
    description: 'Warm vintage luxury parlor room.',
    previewImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&auto=format&fit=crop&q=80',
    gradient: 'linear-gradient(135deg, rgba(168, 85, 247, 0.5) 0%, rgba(180, 83, 9, 0.5) 100%)',
    auraStyle: 'radial-gradient(circle at center, rgba(168, 85, 247, 0.3) 0%, rgba(180, 83, 9, 0.2) 60%, rgba(8, 7, 20, 0.9) 100%)',
    accentColor: '#C084FC',
    category: 'Studio',
    prompt: 'Replace only the background with a lavish vintage heritage parlor, antique mahogany wood paneling, warm fireplace hearth glow, ornate baroque framed artwork, and plush classic armchairs. Match warm low-key ambient fireplace lighting and shadows onto the subject. Preserve the exact person, face, hair, clothing, accessories and pose.'
  },
  {
    id: 'ocean_breeze',
    name: 'OCEAN BREEZE',
    description: 'Bright tropical coastline and azure horizon.',
    previewImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&auto=format&fit=crop&q=80',
    gradient: 'linear-gradient(135deg, rgba(6, 182, 212, 0.55) 0%, rgba(59, 130, 246, 0.45) 100%)',
    auraStyle: 'radial-gradient(circle at center, rgba(6, 182, 212, 0.32) 0%, rgba(59, 130, 246, 0.18) 60%, rgba(8, 7, 20, 0.9) 100%)',
    accentColor: '#38BDF8',
    category: 'Nature',
    prompt: 'Replace only the background with a bright sun-soaked Mediterranean coastal vista, turquoise azure waters, sunlit whitewashed stone terrace, and vibrant blue skies with breezy natural daylight. Match bright coastal sun exposure and clear natural highlights onto the subject. Preserve the exact person, face, hair, clothing, accessories and pose.'
  },
  {
    id: 'festive_lights',
    name: 'FESTIVE LIGHTS',
    description: 'Elegant celebration environment with warm bokeh lights.',
    previewImage: 'https://images.unsplash.com/photo-1513297887119-d46091b24bfa?w=300&auto=format&fit=crop&q=80',
    gradient: 'linear-gradient(135deg, rgba(234, 179, 8, 0.5) 0%, rgba(225, 29, 72, 0.45) 100%)',
    auraStyle: 'radial-gradient(circle at center, rgba(234, 179, 8, 0.3) 0%, rgba(225, 29, 72, 0.2) 60%, rgba(8, 7, 20, 0.9) 100%)',
    accentColor: '#FACC15',
    category: 'Celebration',
    prompt: 'Replace only the background with a magical holiday celebration setting filled with thousands of soft golden bokeh fairy lights, elegant festive evergreen garland, and warm champagne sparkle illumination. Match soft warm celebration luminescence onto the subject. Preserve the exact person, face, hair, clothing, accessories and pose.'
  },
  {
    id: 'rooftop_night',
    name: 'ROOFTOP NIGHT',
    description: 'Luxury rooftop with illuminated city skyline at night.',
    previewImage: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=300&auto=format&fit=crop&q=80',
    gradient: 'linear-gradient(135deg, rgba(99, 102, 241, 0.55) 0%, rgba(236, 72, 153, 0.45) 100%)',
    auraStyle: 'radial-gradient(circle at center, rgba(99, 102, 241, 0.3) 0%, rgba(236, 72, 153, 0.18) 60%, rgba(8, 7, 20, 0.9) 100%)',
    accentColor: '#818CF8',
    category: 'Urban',
    prompt: 'Replace only the background with an upscale luxury penthouse rooftop lounge overlooking an illuminated glowing city skyline at night, stylish glass perimeter, ambient cocktail uplighting, and starry sky. Match sleek night-time city rim-lighting and ambient glow onto the subject. Preserve the exact person, face, hair, clothing, accessories and pose.'
  }
];

export const getBackgroundById = (id: string): BackgroundItem => {
  return BACKGROUNDS.find(b => b.id.toLowerCase() === id.toLowerCase()) || BACKGROUNDS[0];
};
