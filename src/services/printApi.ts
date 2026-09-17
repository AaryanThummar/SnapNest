// src/services/printApi.ts
// Real Print & Layout Composition API Client for LumaBooth

import { getApiBaseUrl, resolveImageUrl } from './aiApi';

export interface PrintOptions {
  layout?: 'classic' | 'grid' | 'editorial' | 'film' | string;
  paperSize?: '4x6' | '5x7' | 'A4' | string;
  copies?: number;
  caption?: string;
}

export interface PrintData {
  id: string;
  eventId: string;
  layout: string;
  paperSize: string;
  photoIds: string[];
  caption?: string | null;
  copies: number;
  imageUrl: string;
  pdfUrl?: string | null;
  status: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/**
 * POST /api/events/:eventId/print
 * Sends selected photos and layout configuration to compose a high-resolution print.
 */
export async function generatePrint(
  eventId: string,
  photoIds: string[],
  options: PrintOptions = {}
): Promise<PrintData> {
  if (!eventId) {
    throw new Error('Event ID is required to generate print');
  }
  if (!photoIds || photoIds.length === 0) {
    throw new Error('At least one photo ID is required to generate print');
  }

  const endpoint = `${getApiBaseUrl()}/api/events/${encodeURIComponent(eventId)}/print`;
  console.log(`[PRINT API] Generating print for event ${eventId}, layout: ${options.layout || 'classic'} from ${endpoint}`);

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        photoIds,
        layout: options.layout || 'classic',
        paperSize: options.paperSize || '4x6',
        copies: options.copies || 1,
        caption: options.caption || ''
      })
    });

    const json: ApiResponse<PrintData> = await res.json().catch(() => ({
      success: false,
      data: {} as PrintData,
      message: `Failed to parse JSON response (${res.status})`
    }));

    if (!res.ok || !json.success) {
      const errMsg = json.message || `Failed to generate print layout (${res.status})`;
      throw new Error(errMsg);
    }

    // Normalize generated print image & PDF URLs with backend base URL
    const printData = {
      ...json.data,
      imageUrl: resolveImageUrl(json.data.imageUrl),
      pdfUrl: json.data.pdfUrl ? resolveImageUrl(json.data.pdfUrl) : null
    };

    return printData;
  } catch (err: any) {
    console.error(`[PRINT API] Error generating print for event ${eventId}:`, err);
    throw err;
  }
}

/**
 * GET /api/prints/:printId
 * Retrieves print information and URLs by ID.
 */
export async function getPrint(printId: string): Promise<PrintData> {
  if (!printId) {
    throw new Error('Print ID is required');
  }

  const endpoint = `${getApiBaseUrl()}/api/prints/${encodeURIComponent(printId)}`;
  console.log(`[PRINT API] Fetching print ${printId} from ${endpoint}`);

  try {
    const res = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    const json: ApiResponse<PrintData> = await res.json().catch(() => ({
      success: false,
      data: {} as PrintData,
      message: `Failed to parse JSON response (${res.status})`
    }));

    if (!res.ok || !json.success) {
      const errMsg = json.message || `Print not found (${res.status})`;
      throw new Error(errMsg);
    }

    const printData = {
      ...json.data,
      imageUrl: resolveImageUrl(json.data.imageUrl),
      pdfUrl: json.data.pdfUrl ? resolveImageUrl(json.data.pdfUrl) : null
    };

    return printData;
  } catch (err: any) {
    console.error(`[PRINT API] Error loading print ${printId}:`, err);
    throw err;
  }
}

/**
 * GET /api/events/:eventId/prints
 * Retrieves all prints belonging to an event.
 */
export async function getEventPrints(eventId: string): Promise<PrintData[]> {
  if (!eventId) return [];

  const endpoint = `${getApiBaseUrl()}/api/events/${encodeURIComponent(eventId)}/prints`;
  try {
    const res = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    const json: ApiResponse<PrintData[]> = await res.json().catch(() => ({
      success: false,
      data: [],
      message: `Failed to parse JSON response (${res.status})`
    }));

    if (!res.ok || !json.success) {
      throw new Error(json.message || `Failed to fetch event prints (${res.status})`);
    }

    return (json.data || []).map(p => ({
      ...p,
      imageUrl: resolveImageUrl(p.imageUrl),
      pdfUrl: p.pdfUrl ? resolveImageUrl(p.pdfUrl) : null
    }));
  } catch (err: any) {
    console.error(`[PRINT API] Error loading prints for event ${eventId}:`, err);
    return [];
  }
}
