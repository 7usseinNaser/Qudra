import { apiGet, apiPost, type ApiErrorData } from './api/client';

export interface RequiredCapabilityAnalysis {
  name: string;
  category?: string;
  importance: number;
  required_level: string;
  reason?: string;
}

export interface ProblemAnalysisResponse {
  project_type: string;
  domain?: string;
  target_users: string[];
  problem_summary: string;
  solution_direction: string;
  required_capabilities: RequiredCapabilityAnalysis[];
  technical_requirements: string[];
  potential_features: string[];
  constraints: string[];
}

export interface Problem {
  id: string;
  user_id: string;
  title: string;
  description: string;
  domain?: string;
  project_type?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ProblemCreatePayload {
  title: string;
  description: string;
  domain?: string;
}

export const ProblemsService = {
  async getAll(): Promise<Problem[]> {
    try {
      return await apiGet<Problem[]>('/api/v1/problems');
    } catch (err) {
      const apiErr = err as ApiErrorData;
      if (apiErr.isNetworkError || apiErr.isColdStart) return [];
      throw err;
    }
  },

  async getById(id: string): Promise<Problem | undefined> {
    try {
      return await apiGet<Problem>(`/api/v1/problems/${id}`);
    } catch (err) {
      const apiErr = err as ApiErrorData;
      if (apiErr.status === 404) return undefined;
      throw err;
    }
  },

  async create(payload: ProblemCreatePayload): Promise<Problem> {
    return await apiPost<Problem>('/api/v1/problems', payload);
  },

  async analyze(id: string): Promise<ProblemAnalysisResponse> {
    return await apiPost<ProblemAnalysisResponse>(`/api/v1/problems/${id}/analyze`);
  },

  async getAnalysis(id: string): Promise<ProblemAnalysisResponse | undefined> {
    try {
      return await apiGet<ProblemAnalysisResponse>(`/api/v1/problems/${id}/analysis`);
    } catch (err) {
      const apiErr = err as ApiErrorData;
      if (apiErr.status === 404) return undefined;
      throw err;
    }
  },
};
