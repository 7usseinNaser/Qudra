import { apiGet, apiPost, apiPatch, type ApiErrorData } from './api/client';

export interface Project {
  id: string;
  owner_id: string;
  title: string;
  description?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectCreatePayload {
  title: string;
  description?: string;
  status?: string;
}

export interface ProjectUpdatePayload {
  title?: string;
  description?: string;
  status?: string;
}

export const ProjectsService = {
  async getAll(): Promise<Project[]> {
    try {
      return await apiGet<Project[]>('/api/v1/projects');
    } catch (err) {
      const apiErr = err as ApiErrorData;
      if (apiErr.isNetworkError || apiErr.isColdStart) return [];
      throw err;
    }
  },

  async getById(id: string): Promise<Project | undefined> {
    try {
      return await apiGet<Project>(`/api/v1/projects/${id}`);
    } catch (err) {
      const apiErr = err as ApiErrorData;
      if (apiErr.status === 404) return undefined;
      throw err;
    }
  },

  async create(payload: ProjectCreatePayload): Promise<Project> {
    return await apiPost<Project>('/api/v1/projects', payload);
  },

  async update(id: string, payload: ProjectUpdatePayload): Promise<Project> {
    return await apiPatch<Project>(`/api/v1/projects/${id}`, payload);
  },

  async addCapability(projectId: string, capabilityId: string): Promise<void> {
    await apiPost(`/api/v1/projects/${projectId}/capabilities`, {
      capability_id: capabilityId,
    });
  },
};
