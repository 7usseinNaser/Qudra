/**
 * Matching Service — QUDRA (M16)
 * Direct integration with FastAPI explainable-matching endpoints.
 * Backend: GET /api/v1/problems/{id}/matches + POST /{id}/matches/recalculate
 */

import { apiClient } from './api/client';

export interface RemoteMatchCapabilityBreakdown {
  capability_id: string;
  capability_name: string;
  required_level: string;
  importance: number;
  user_score: number;
  status: string;
}

export interface RemoteMatchExplanation {
  summary: string;
  strengths: string[];
  gaps: string[];
  relevant_projects: string[];
}

export interface RemoteMatchCandidate {
  user_id: string;
  user_name: string;
  total_score: number;
  capability_score: number;
  practical_score: number;
  project_relevance_score: number;
  oral_score: number;
  freshness_score: number;
  explanation: RemoteMatchExplanation;
  capability_breakdown: RemoteMatchCapabilityBreakdown[];
  matched_at?: string | null;
}

export interface RemoteMatchesResponse {
  problem_id: string;
  problem_title: string;
  total_candidates: number;
  weights: Record<string, number>;
  matches: RemoteMatchCandidate[];
}

export const MatchingService = {
  /**
   * Computes explainable match scores for all eligible candidates.
   * Backend: GET /api/v1/problems/{id}/matches
   */
  async findMatches(problemId: string, force = false): Promise<RemoteMatchesResponse> {
    if (force) {
      return apiClient.post<RemoteMatchesResponse>(`/api/v1/problems/${problemId}/matches/recalculate`);
    }
    return apiClient.get<RemoteMatchesResponse>(`/api/v1/problems/${problemId}/matches`);
  },

  /**
   * Force recalculation — clears snapshots and recomputes from current evidence.
   * Backend: POST /api/v1/problems/{id}/matches/recalculate
   */
  async recalculate(problemId: string): Promise<RemoteMatchesResponse> {
    return apiClient.post<RemoteMatchesResponse>(`/api/v1/problems/${problemId}/matches/recalculate`);
  },
};