// photobooth app/src/services/poseBattleApi.ts
// Real Pose Battle Showdown API Client for LumaBooth

import { getApiBaseUrl, resolveImageUrl } from './aiApi';

export interface PoseAnalysisMetrics {
  energy: number;
  creativity: number;
  composition: number;
  expression: number;
  feedback: string;
}

export interface PoseBattleRound {
  round: number;
  challenge: string;
  player1Challenge?: string;
  player2Challenge?: string;
  player1PhotoUrl: string;
  player2PhotoUrl: string;
  player1Score: number;
  player2Score: number;
  player1Metrics?: PoseAnalysisMetrics;
  player2Metrics?: PoseAnalysisMetrics;
  roundWinner: 'player1' | 'player2' | 'tie';
  commentary: string;
}

export interface PoseBattleData {
  id: string;
  eventId: string;
  player1Name: string;
  player2Name: string;
  rounds: PoseBattleRound[];
  totalScorePlayer1: number;
  totalScorePlayer2: number;
  winner: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface PoseBattleResultData {
  battleId: string;
  eventId: string;
  player1Name: string;
  player2Name: string;
  totalScorePlayer1: number;
  totalScorePlayer2: number;
  winner: 'player1' | 'player2' | 'tie';
  winnerName: string;
  margin: number;
  roundsCompleted: number;
  status: string;
  rounds: PoseBattleRound[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

function normalizeBattleUrls(battle: PoseBattleData): PoseBattleData {
  return {
    ...battle,
    rounds: (battle.rounds || []).map(r => ({
      ...r,
      player1PhotoUrl: resolveImageUrl(r.player1PhotoUrl),
      player2PhotoUrl: resolveImageUrl(r.player2PhotoUrl)
    }))
  };
}

async function toBlob(photoInput: Blob | string): Promise<Blob> {
  if (photoInput instanceof Blob) {
    return photoInput;
  }
  if (typeof photoInput === 'string' && photoInput.startsWith('data:')) {
    const res = await fetch(photoInput);
    return await res.blob();
  }
  if (typeof photoInput === 'string' && photoInput.startsWith('http')) {
    const res = await fetch(photoInput);
    return await res.blob();
  }
  throw new Error('Invalid photo format provided');
}

/**
 * POST /api/events/:eventId/pose-battle
 * Create a new Pose Battle for the active event
 */
export async function createPoseBattle(
  eventId: string,
  player1Name = 'Player 1',
  player2Name = 'Player 2'
): Promise<PoseBattleData> {
  if (!eventId) {
    throw new Error('Event ID is required to create Pose Battle');
  }

  const endpoint = `${getApiBaseUrl()}/api/events/${encodeURIComponent(eventId)}/pose-battle`;
  console.log(`[POSE BATTLE API] Creating battle session for event ${eventId}: ${player1Name} vs ${player2Name}`);

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      player1Name: player1Name.trim() || 'Player 1',
      player2Name: player2Name.trim() || 'Player 2'
    })
  });

  const json: ApiResponse<PoseBattleData> = await res.json().catch(() => ({
    success: false,
    data: {} as PoseBattleData,
    message: `Failed to parse response (${res.status})`
  }));

  if (!res.ok || !json.success) {
    throw new Error(json.message || `Failed to create pose battle (${res.status})`);
  }

  return normalizeBattleUrls(json.data);
}

/**
 * POST /api/pose-battle/:battleId/round
 * Submit photos for a round and receive real pose evaluation & score
 */
export async function submitPoseBattleRound(
  battleId: string,
  roundNumber: number,
  player1Photo: Blob | string,
  player2Photo: Blob | string,
  player1Challenge?: string,
  player2Challenge?: string
): Promise<PoseBattleData> {
  if (!battleId) {
    throw new Error('Battle ID is required');
  }

  const endpoint = `${getApiBaseUrl()}/api/pose-battle/${encodeURIComponent(battleId)}/round`;
  console.log(`[POSE BATTLE API] Submitting Round ${roundNumber} to ${endpoint}`);

  const p1Blob = await toBlob(player1Photo);
  const p2Blob = await toBlob(player2Photo);

  const formData = new FormData();
  formData.append('round', roundNumber.toString());
  if (player1Challenge) {
    formData.append('player1Challenge', player1Challenge);
  }
  if (player2Challenge) {
    formData.append('player2Challenge', player2Challenge);
  }
  formData.append('challenge', player1Challenge && player2Challenge ? `${player1Challenge} vs ${player2Challenge}` : (player1Challenge || 'Pose Showdown'));
  formData.append('player1Photo', p1Blob, `p1_r${roundNumber}.jpg`);
  formData.append('player2Photo', p2Blob, `p2_r${roundNumber}.jpg`);

  const res = await fetch(endpoint, {
    method: 'POST',
    body: formData
  });

  const json: ApiResponse<PoseBattleData> = await res.json().catch(() => ({
    success: false,
    data: {} as PoseBattleData,
    message: `Failed to parse response (${res.status})`
  }));

  if (!res.ok || !json.success) {
    throw new Error(json.message || `Failed to score round (${res.status})`);
  }

  return normalizeBattleUrls(json.data);
}

/**
 * GET /api/pose-battle/:battleId
 */
export async function getPoseBattle(battleId: string): Promise<PoseBattleData> {
  if (!battleId) {
    throw new Error('Battle ID is required');
  }

  const endpoint = `${getApiBaseUrl()}/api/pose-battle/${encodeURIComponent(battleId)}`;
  const res = await fetch(endpoint, {
    method: 'GET',
    headers: { 'Accept': 'application/json' }
  });

  const json: ApiResponse<PoseBattleData> = await res.json().catch(() => ({
    success: false,
    data: {} as PoseBattleData,
    message: `Failed to parse response (${res.status})`
  }));

  if (!res.ok || !json.success) {
    throw new Error(json.message || `Pose battle not found (${res.status})`);
  }

  return normalizeBattleUrls(json.data);
}

/**
 * GET /api/pose-battle/:battleId/result
 */
export async function getPoseBattleResult(battleId: string): Promise<PoseBattleResultData> {
  if (!battleId) {
    throw new Error('Battle ID is required');
  }

  const endpoint = `${getApiBaseUrl()}/api/pose-battle/${encodeURIComponent(battleId)}/result`;
  const res = await fetch(endpoint, {
    method: 'GET',
    headers: { 'Accept': 'application/json' }
  });

  const json: ApiResponse<PoseBattleResultData> = await res.json().catch(() => ({
    success: false,
    data: {} as PoseBattleResultData,
    message: `Failed to parse response (${res.status})`
  }));

  if (!res.ok || !json.success) {
    throw new Error(json.message || `Pose battle result not found (${res.status})`);
  }

  return {
    ...json.data,
    rounds: (json.data.rounds || []).map(r => ({
      ...r,
      player1PhotoUrl: resolveImageUrl(r.player1PhotoUrl),
      player2PhotoUrl: resolveImageUrl(r.player2PhotoUrl)
    }))
  };
}
