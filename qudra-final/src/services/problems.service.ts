/**
 * Problems Service — QUDRA
 * Direct integration with FastAPI backend problem intake and AI analysis.
 */

import { apiClient, RemoteProblem, RemoteProblemAnalysis } from './api';

export interface CreateProblemPayload {
  title: string;
  description: string;
  domain?: string;
}

export const ProblemsService = {
  /**
   * Fetch problems from GET /api/v1/problems
   */
  async getAll(): Promise<RemoteProblem[]> {
    return apiClient.get<RemoteProblem[]>('/api/v1/problems');
  },

  /**
   * Fetch single problem from GET /api/v1/problems/{id}
   */
  async getById(id: string): Promise<RemoteProblem> {
    return apiClient.get<RemoteProblem>(`/api/v1/problems/${id}`);
  },

  /**
   * Create problem via POST /api/v1/problems
   */
  async create(payload: CreateProblemPayload): Promise<RemoteProblem> {
    return apiClient.post<RemoteProblem>('/api/v1/problems', {
      title: payload.title,
      description: payload.description,
      domain: payload.domain || null,
    });
  },

  /**
   * Trigger problem analysis via POST /api/v1/problems/{id}/analyze
   */
  async analyze(problemId: string): Promise<RemoteProblemAnalysis> {
    return apiClient.post<RemoteProblemAnalysis>(`/api/v1/problems/${problemId}/analyze`);
  },

  /**
   * Get existing problem analysis from GET /api/v1/problems/{id}/analysis
   */
  async getAnalysis(problemId: string): Promise<RemoteProblemAnalysis> {
    return apiClient.get<RemoteProblemAnalysis>(`/api/v1/problems/${problemId}/analysis`);
  },
};
