// src/services/backgroundApi.ts
// Real AI Background Studio API Client for LumaBooth
import { getApiBaseUrl, resolveImageUrl, toImageBlob, AiApiResponse } from './aiApi';

export interface BackgroundApiResponse extends AiApiResponse {
  data: {
    id: string;
    eventId: string;
    mode: 'background' | string;
    backgroundId?: string;
    status: 'pending' | 'processing' | 'completed' | 'failed' | string;
    originalImageUrl?: string;
    generatedImageUrl: string;
    prompt?: string;
    createdAt?: string;
  };
}

/**
 * POST /api/ai/background
 * Sends captured portrait to replace background with selected theme while preserving subject.
 */
export async function generateBackground(
  image: string | Blob,
  eventId: string,
  backgroundId: string,
  customPrompt?: string
): Promise<BackgroundApiResponse> {
  if (!eventId || typeof eventId !== 'string' || eventId.trim().length === 0) {
    throw new Error('No active event selected. Please select an active event first.');
  }

  const normBgId = (backgroundId || 'luxury_studio').toLowerCase().trim();

  // "none" option should never call the AI endpoint
  if (normBgId === 'none') {
    throw new Error('NONE option does not require AI processing.');
  }

  const blob = await toImageBlob(image);
  const formData = new FormData();
  formData.append('image', blob, 'portrait.jpg');
  formData.append('eventId', eventId.trim());
  formData.append('backgroundId', normBgId);
  if (customPrompt && customPrompt.trim().length > 0) {
    formData.append('customPrompt', customPrompt.trim());
  }

  const endpoint = `${getApiBaseUrl()}/api/ai/background`;
  console.log(`[BACKGROUND API] Calling AI Background endpoint: ${endpoint} for theme '${normBgId}'`);

  let res: Response;
  try {
    res = await fetch(endpoint, {
      method: 'POST',
      body: formData
    });
  } catch (networkErr: any) {
    console.error('[BACKGROUND API] Network error connecting to Background endpoint:', networkErr);
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
    if (errorCode === 'ERR_AI_NOT_CONFIGURED' || res.status === 503) {
      throw new Error('Backend connection works, but AI provider credentials are required.');
    }
    const safeMsg = json.error?.message || json.message || `Background replacement failed (${res.status})`;
    throw new Error(safeMsg);
  }

  // Normalize generated image URL with base URL
  if (json.data && json.data.generatedImageUrl) {
    json.data.generatedImageUrl = resolveImageUrl(json.data.generatedImageUrl);
  }

  return json as BackgroundApiResponse;
}
