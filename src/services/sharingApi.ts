// src/services/sharingApi.ts
// Real Event QR & Public Photo Sharing API Client for LumaBooth

import { getApiBaseUrl, resolveImageUrl } from './aiApi';

export interface PublicThemeDto {
  primary?: string;
  secondary?: string;
  background?: string;
  accent?: string;
  themeName?: string;
  surfaceColor?: string;
  textColor?: string;
  subtextColor?: string;
  gradient?: string;
  buttonGradient?: string;
  glowColor?: string;
  ambientGlow?: string;
  borderColor?: string;
  fontStyle?: string;
  visualStyle?: string;
  photostripTheme?: string;
  particleType?: string;
  tagline?: string;
  heroHeadline?: string;
  heroSubheadline?: string;
}

export interface EventShareData {
  eventId: string;
  shareToken: string;
  shareUrl: string;
}

export interface EventQrData {
  shareUrl: string;
  qrCode: string; // Base64 data URL (e.g. data:image/png;base64,...)
}

export interface PublicPhotoItem {
  id: string;
  imageUrl: string;
  type: string;
  caption?: string | null;
  createdAt: string;
}

export interface PublicEventData {
  name: string;
  eventName: string;
  eventType?: string;
  eventDate?: string | null;
  hostName?: string | null;
  shareToken: string;
  theme?: PublicThemeDto;
  photos: PublicPhotoItem[];
  memories?: PublicPhotoItem[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/**
 * POST /api/events/:eventId/share
 * Generates or retrieves the event's public share token and URL.
 */
export async function generateEventShare(eventId: string): Promise<EventShareData> {
  if (!eventId) {
    throw new Error('Event ID is required to generate share link');
  }

  const endpoint = `${getApiBaseUrl()}/api/events/${encodeURIComponent(eventId)}/share`;
  console.log(`[SHARING API] Generating share info for event: ${eventId} from ${endpoint}`);

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    const json: ApiResponse<EventShareData> = await res.json().catch(() => ({
      success: false,
      data: {} as EventShareData,
      message: `Failed to parse JSON response (${res.status})`
    }));

    if (!res.ok || !json.success) {
      const errMsg = json.message || `Failed to generate event share (${res.status})`;
      throw new Error(errMsg);
    }

    return json.data;
  } catch (err: any) {
    console.error(`[SHARING API] Error generating share for event ${eventId}:`, err);
    throw err;
  }
}

/**
 * GET /api/events/:eventId/qr
 * Retrieves real QR code data URL and public share link for an event.
 */
export async function getEventQr(eventId: string): Promise<EventQrData> {
  if (!eventId) {
    throw new Error('Event ID is required to get QR code');
  }

  const endpoint = `${getApiBaseUrl()}/api/events/${encodeURIComponent(eventId)}/qr`;
  console.log(`[SHARING API] Fetching QR code for event: ${eventId} from ${endpoint}`);

  try {
    const res = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    const json: ApiResponse<EventQrData> = await res.json().catch(() => ({
      success: false,
      data: {} as EventQrData,
      message: `Failed to parse JSON response (${res.status})`
    }));

    if (!res.ok || !json.success) {
      const errMsg = json.message || `Failed to fetch event QR code (${res.status})`;
      throw new Error(errMsg);
    }

    return json.data;
  } catch (err: any) {
    console.error(`[SHARING API] Error fetching QR code for event ${eventId}:`, err);
    throw err;
  }
}

/**
 * GET /api/public/events/:shareToken
 * Retrieves safe public event details and gallery photos for guests.
 */
export async function getPublicEvent(shareToken: string): Promise<PublicEventData> {
  if (!shareToken) {
    throw new Error('Share token is required to load public event');
  }

  const endpoint = `${getApiBaseUrl()}/api/public/events/${encodeURIComponent(shareToken)}`;
  console.log(`[SHARING API] Fetching public event for token: ${shareToken} from ${endpoint}`);

  try {
    const res = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    const json: ApiResponse<PublicEventData> = await res.json().catch(() => ({
      success: false,
      data: {} as PublicEventData,
      message: `Failed to parse JSON response (${res.status})`
    }));

    if (!res.ok || !json.success) {
      const errMsg = json.message || `Event not found or link expired (${res.status})`;
      throw new Error(errMsg);
    }

    const rawData = json.data;
    // Normalize photo image URLs with backend base URL
    const normalizedPhotos: PublicPhotoItem[] = (rawData.photos || rawData.memories || []).map((p) => ({
      ...p,
      imageUrl: resolveImageUrl(p.imageUrl)
    }));

    return {
      ...rawData,
      name: rawData.name || rawData.eventName || 'LumaBooth Event',
      eventName: rawData.eventName || rawData.name || 'LumaBooth Event',
      photos: normalizedPhotos,
      memories: normalizedPhotos
    };
  } catch (err: any) {
    console.error(`[SHARING API] Error loading public event for token ${shareToken}:`, err);
    throw err;
  }
}
