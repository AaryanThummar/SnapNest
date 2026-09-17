// src/services/memoryApi.ts
// Real Event Memories & Gallery API Client for LumaBooth

import { getApiBaseUrl, resolveImageUrl } from './aiApi';

export interface MemoryApiItem {
  id: string;
  eventId: string;
  photoId?: string | null;
  imageUrl: string;
  type: 'photo' | 'future-you' | 'morph' | 'photostrip' | string;
  caption?: string | null;
  createdAt: string;
}

export interface MemoryApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/**
 * GET /api/events/:eventId/memories
 * Retrieves all memories and AI creations for the given event, sorted newest first.
 */
export async function getEventMemories(eventId: string): Promise<MemoryApiItem[]> {
  if (!eventId) return [];

  const endpoint = `${getApiBaseUrl()}/api/events/${encodeURIComponent(eventId)}/memories`;
  console.log(`[MEMORY API] Fetching memories for event: ${eventId} from ${endpoint}`);

  try {
    const res = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    const json: MemoryApiResponse<MemoryApiItem[]> = await res.json().catch(() => ({
      success: false,
      data: [],
      message: `Failed to parse JSON response (${res.status})`
    }));

    if (!res.ok || !json.success) {
      const errMsg = json.message || `Failed to fetch event memories (${res.status})`;
      throw new Error(errMsg);
    }

    // Normalize image URLs
    const items = (json.data || []).map(item => ({
      ...item,
      imageUrl: resolveImageUrl(item.imageUrl)
    }));

    return items;
  } catch (err: any) {
    console.error(`[MEMORY API] Error loading memories for event ${eventId}:`, err);
    throw err;
  }
}

/**
 * POST /api/events/:eventId/memories
 * Creates a memory record linked to an uploaded photo.
 */
export async function createMemory(
  eventId: string,
  photoId: string
): Promise<MemoryApiItem> {
  const endpoint = `${getApiBaseUrl()}/api/events/${encodeURIComponent(eventId)}/memories`;
  console.log(`[MEMORY API] Creating memory for event: ${eventId}, photo: ${photoId}`);

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({ photoId })
  });

  const json: MemoryApiResponse<MemoryApiItem> = await res.json().catch(() => ({
    success: false,
    data: {} as MemoryApiItem,
    message: `Server returned non-JSON response (${res.status})`
  }));

  if (!res.ok || !json.success) {
    const errMsg = json.message || `Failed to create memory (${res.status})`;
    throw new Error(errMsg);
  }

  const memory = {
    ...json.data,
    imageUrl: resolveImageUrl(json.data.imageUrl)
  };

  return memory;
}

/**
 * DELETE /api/memories/:memoryId
 * Deletes a memory record without deleting the underlying photo.
 */
export async function deleteMemory(memoryId: string): Promise<boolean> {
  const endpoint = `${getApiBaseUrl()}/api/memories/${encodeURIComponent(memoryId)}`;
  console.log(`[MEMORY API] Deleting memory: ${memoryId}`);

  const res = await fetch(endpoint, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json'
    }
  });

  const json = await res.json().catch(() => ({
    success: false,
    message: `Server returned non-JSON response (${res.status})`
  }));

  if (!res.ok || !json.success) {
    const errMsg = json.message || `Failed to delete memory (${res.status})`;
    throw new Error(errMsg);
  }

  return true;
}
