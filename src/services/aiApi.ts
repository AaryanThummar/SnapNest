// src/services/aiApi.ts
// Real AI Backend API Client for LumaBooth

export interface AiGenerationResponseData {
  id: string;
  mode: 'future_you' | 'morph' | string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | string;
  generatedImageUrl: string;
  prompt?: string;
  style?: string;
  settings?: Record<string, any>;
  errorMessage?: string;
  createdAt?: string;
  completedAt?: string;
  latencyMs?: number;
}

export interface AiApiResponse {
  success: boolean;
  data: AiGenerationResponseData;
  message?: string;
  timestamp?: string;
}

/**
 * Resolves the backend base URL using VITE_API_URL environment variable.
 * Defaults to http://localhost:5000 in local development.
 */
export const getApiBaseUrl = (): string => {
  const envUrl = (import.meta as any).env?.VITE_API_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim().length > 0) {
    return envUrl.trim().replace(/\/+$/, '');
  }
  return 'http://localhost:5000';
};

/**
 * Normalizes an image URL returned by the backend.
 * If relative (e.g., /uploads/...), prepends the API base URL.
 */
export const resolveImageUrl = (imageUrl: string): string => {
  if (!imageUrl) return '';
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://') || imageUrl.startsWith('data:')) {
    return imageUrl;
  }
  const base = getApiBaseUrl();
  const path = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
  return `${base}${path}`;
};

/**
 * Converts a base64 Data URL or Blob to a standard binary Blob.
 */
export async function toImageBlob(image: string | Blob): Promise<Blob> {
  if (image instanceof Blob) {
    return image;
  }
  if (typeof image === 'string' && image.startsWith('data:')) {
    const res = await fetch(image);
    return await res.blob();
  }
  if (typeof image === 'string' && (image.startsWith('http://') || image.startsWith('https://') || image.startsWith('/'))) {
    const res = await fetch(image);
    return await res.blob();
  }
  throw new Error('Invalid image format. Expected data URL or Blob.');
}

/**
 * POST /api/ai/future-you
 * Sends captured portrait to generate Future You 2050 age-progressed portrait.
 */
export async function generateFutureYou(
  image: string | Blob,
  eventId: string,
  style?: string
): Promise<AiApiResponse> {
  if (!eventId || typeof eventId !== 'string' || eventId.trim().length === 0) {
    throw new Error('No active event selected. Please select an active event first.');
  }

  const blob = await toImageBlob(image);
  const formData = new FormData();
  formData.append('image', blob, 'portrait.jpg');
  formData.append('eventId', eventId.trim());
  if (style) {
    formData.append('style', style);
  }

  const endpoint = `${getApiBaseUrl()}/api/ai/future-you`;
  console.log(`[AI API] Calling Future You 2050 endpoint: ${endpoint}`);

  let res: Response;
  try {
    res = await fetch(endpoint, {
      method: 'POST',
      body: formData
    });
  } catch (networkErr: any) {
    console.error('[AI API] Network error connecting to Future You endpoint:', networkErr);
    throw new Error('Unable to connect to LumaBooth server. Please try again.');
  }

  let json: any;
  try {
    json = await res.json();
  } catch {
    throw new Error(`Server returned invalid response (${res.status})`);
  }

  if (!res.ok || !json.success) {
    const errorCode = json.error?.code || json.code;
    const errorMsg = json.error?.message || json.message;
    if (errorCode === 'ERR_AI_UNAVAILABLE' || errorCode === 'ERR_AI_NOT_CONFIGURED' || res.status === 503 || (errorMsg && errorMsg.includes('AI unavailable'))) {
      throw new Error('AI unavailable: Generative age progression is currently offline.');
    }
    const safeMsg = errorMsg || `Future You generation failed (${res.status})`;
    throw new Error(safeMsg);
  }

  // Normalize generated image URL with base URL
  if (json.data && json.data.generatedImageUrl) {
    json.data.generatedImageUrl = resolveImageUrl(json.data.generatedImageUrl);
  }

  return json as AiApiResponse;
}

/**
 * POST /api/ai/morph
 * Sends captured portrait to generate an AI Morph transformation in one of the 6 supported styles:
 * cyber, royal, anime, cinematic, glam, futuristic
 */
export async function generateMorph(
  image: string | Blob,
  eventId: string,
  style: string = 'cyber'
): Promise<AiApiResponse> {
  if (!eventId || typeof eventId !== 'string' || eventId.trim().length === 0) {
    throw new Error('No active event selected. Please select an active event first.');
  }

  const validStyles = ['cyber', 'royal', 'anime', 'cinematic', 'glam', 'futuristic'];
  const normalizedStyle = (style || 'cyber').toLowerCase().trim();

  if (!validStyles.includes(normalizedStyle)) {
    throw new Error(`Invalid style '${style}'. Supported styles: ${validStyles.join(', ')}`);
  }

  const blob = await toImageBlob(image);
  const formData = new FormData();
  formData.append('image', blob, 'portrait.jpg');
  formData.append('eventId', eventId.trim());
  formData.append('style', normalizedStyle);

  const endpoint = `${getApiBaseUrl()}/api/ai/morph`;
  console.log(`[AI API] Calling AI Morph endpoint: ${endpoint} with style '${normalizedStyle}'`);

  let res: Response;
  try {
    res = await fetch(endpoint, {
      method: 'POST',
      body: formData
    });
  } catch (networkErr: any) {
    console.error('[AI API] Network error connecting to AI Morph endpoint:', networkErr);
    throw new Error('Unable to connect to LumaBooth server. Please try again.');
  }

  let json: any;
  try {
    json = await res.json();
  } catch {
    throw new Error(`Server returned invalid response (${res.status})`);
  }

  if (!res.ok || !json.success) {
    const errorCode = json.error?.code || json.code;
    const errorMsg = json.error?.message || json.message;
    if (errorCode === 'ERR_AI_UNAVAILABLE' || errorCode === 'ERR_AI_NOT_CONFIGURED' || res.status === 503 || (errorMsg && errorMsg.includes('AI unavailable'))) {
      throw new Error('AI unavailable: Generative transformation is currently offline.');
    }
    const safeMsg = errorMsg || `AI Morph generation failed (${res.status})`;
    throw new Error(safeMsg);
  }

  // Normalize generated image URL with base URL
  if (json.data && json.data.generatedImageUrl) {
    json.data.generatedImageUrl = resolveImageUrl(json.data.generatedImageUrl);
  }

  return json as AiApiResponse;
}

/**
 * POST /api/ai/synthesis
 * Sends captured portrait to generate an Identity-Preserving AI Synthesis transformation (Style + Mood).
 */
export async function generateSynthesis(
  image: string | Blob,
  eventId: string,
  style: string = 'dreamy',
  mood: string = 'bold'
): Promise<AiApiResponse> {
  if (!eventId || typeof eventId !== 'string' || eventId.trim().length === 0) {
    throw new Error('No active event selected. Please select an active event first.');
  }

  const validStyles = ['dreamy', 'editorial', 'futuristic', 'luxury', 'neon'];
  const validMoods = ['bold', 'confident', 'playful', 'mysterious', 'soft'];

  const normalizedStyle = (style || 'dreamy').toLowerCase().trim();
  const normalizedMood = (mood || 'bold').toLowerCase().trim();

  if (!validStyles.includes(normalizedStyle)) {
    throw new Error(`Invalid style '${style}'. Supported: ${validStyles.join(', ')}`);
  }

  if (!validMoods.includes(normalizedMood)) {
    throw new Error(`Invalid mood '${mood}'. Supported: ${validMoods.join(', ')}`);
  }

  const blob = await toImageBlob(image);
  const formData = new FormData();
  formData.append('image', blob, 'portrait.jpg');
  formData.append('eventId', eventId.trim());
  formData.append('style', normalizedStyle);
  formData.append('mood', normalizedMood);

  const endpoint = `${getApiBaseUrl()}/api/ai/synthesis`;
  console.log(`[AI API] Calling AI Synthesis endpoint: ${endpoint} (style='${normalizedStyle}', mood='${normalizedMood}')`);

  let res: Response;
  try {
    res = await fetch(endpoint, {
      method: 'POST',
      body: formData
    });
  } catch (networkErr: any) {
    console.error('[AI API] Network error connecting to AI Synthesis endpoint:', networkErr);
    throw new Error('Unable to connect to LumaBooth server. Please try again.');
  }

  let json: any;
  try {
    json = await res.json();
  } catch {
    throw new Error(`Server returned invalid response (${res.status})`);
  }

  if (!res.ok || !json.success) {
    const errorCode = json.error?.code || json.code;
    const errorMsg = json.error?.message || json.message;
    if (errorCode === 'ERR_AI_UNAVAILABLE' || errorCode === 'ERR_AI_NOT_CONFIGURED' || res.status === 503 || (errorMsg && errorMsg.includes('AI unavailable'))) {
      throw new Error('AI unavailable: Synthesis generation is currently offline.');
    }
    const safeMsg = errorMsg || `AI Synthesis generation failed (${res.status})`;
    throw new Error(safeMsg);
  }

  // Normalize generated image URL with base URL
  if (json.data && json.data.generatedImageUrl) {
    json.data.generatedImageUrl = resolveImageUrl(json.data.generatedImageUrl);
  }

  return json as AiApiResponse;
}

