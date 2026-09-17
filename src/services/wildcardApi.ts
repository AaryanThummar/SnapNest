// photobooth app/src/services/wildcardApi.ts
// Real Wildcard Roulette API Client for LumaBooth

import { getApiBaseUrl, resolveImageUrl } from './aiApi';

export interface WildcardChallenge {
  id: string;
  category: string;
  title: string;
  description: string;
  posePrompt: string;
  visualGuide: string;
  promptModifier?: string;
  accentColor: string;
  suggestedMode?: string;
  previewUrl?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/**
 * POST /api/events/:eventId/wildcard
 * Pick or generate a real randomized challenge for the active event
 */
export async function fetchWildcardChallenge(
  eventId: string,
  preferredCategory?: string
): Promise<WildcardChallenge> {
  const safeEventId = eventId || 'evt_default';
  const endpoint = `${getApiBaseUrl()}/api/events/${encodeURIComponent(safeEventId)}/wildcard`;
  console.log(`[WILDCARD API] Fetching wildcard challenge from ${endpoint}`);

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        category: preferredCategory
      })
    });

    const json: ApiResponse<WildcardChallenge> = await res.json().catch(() => ({
      success: false,
      data: {} as WildcardChallenge,
      message: `Failed to parse response (${res.status})`
    }));

    if (!res.ok || !json.success) {
      throw new Error(json.message || `Failed to fetch wildcard challenge (${res.status})`);
    }

    return {
      ...json.data,
      previewUrl: json.data.previewUrl ? resolveImageUrl(json.data.previewUrl) : undefined
    };
  } catch (err: any) {
    console.error('[WILDCARD API] Error generating challenge:', err);
    throw err;
  }
}

/**
 * GET /api/wildcard/challenges
 * Retrieve all predefined wildcard challenge categories
 */
export async function listAllWildcardChallenges(): Promise<WildcardChallenge[]> {
  const endpoint = `${getApiBaseUrl()}/api/wildcard/challenges`;
  try {
    const res = await fetch(endpoint, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    const json: ApiResponse<WildcardChallenge[]> = await res.json().catch(() => ({
      success: false,
      data: [],
      message: `Failed to parse response (${res.status})`
    }));

    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Failed to list challenges');
    }

    return (json.data || []).map(c => ({
      ...c,
      previewUrl: c.previewUrl ? resolveImageUrl(c.previewUrl) : undefined
    }));
  } catch (err) {
    console.warn('[WILDCARD API] Falling back to local challenge list:', err);
    return [];
  }
}
