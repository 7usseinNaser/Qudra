/**
 * Projects Service — QUDRA
 * Direct integration with FastAPI backend projects and capability tagging.
 */

import { apiClient, RemoteProject } from './api';

export interface CreateProjectPayload {
  title: string;
  description?: string;
  status?: 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED' | 'ARCHIVED';
  technologies?: string[];
  contribution?: string[];
}

export const ProjectsService = {
  /**
   * Fetch user projects from GET /api/v1/projects
   */
  async getAll(): Promise<RemoteProject[]> {
    return apiClient.get<RemoteProject[]>('/api/v1/projects');
  },

  /**
   * Fetch single project by ID from GET /api/v1/projects/{id}
   */
  async getById(id: string): Promise<RemoteProject> {
    return apiClient.get<RemoteProject>(`/api/v1/projects/${id}`);
  },

  /**
   * Create new project via POST /api/v1/projects
   */
  async create(payload: CreateProjectPayload): Promise<RemoteProject> {
    return apiClient.post<RemoteProject>('/api/v1/projects', {
      title: payload.title,
      description: payload.description,
      status: payload.status || 'COMPLETED',
      technologies: payload.technologies || [],
      contribution: payload.contribution || [],
    });
  },

  /**
   * Tag capability to project via POST /api/v1/projects/{id}/capabilities
   * This auto-creates PROJECT evidence on backend!
   */
  async tagCapability(projectId: string, capabilityId: string): Promise<{ id: string; project_id: string; capability_id: string }> {
    return apiClient.post<{ id: string; project_id: string; capability_id: string }>(
      `/api/v1/projects/${projectId}/capabilities`,
      {
        capability_id: capabilityId,
      }
    );
  },
};
