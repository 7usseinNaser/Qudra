/**
 * Evidence Service — QUDRA
 * Direct integration with FastAPI backend Evidence records.
 */

import { apiClient, RemoteEvidence } from './api';
import { Evidence, EvidenceType } from './types';

function mapRemoteToDomainEvidence(remote: RemoteEvidence): Evidence {
  let mappedType: EvidenceType = 'PROJECT';
  if (remote.type === 'GITHUB_REPO') mappedType = 'GITHUB_REPO';
  else if (remote.type === 'PRACTICAL') mappedType = 'CHALLENGE';
  else if (remote.type === 'ORAL') mappedType = 'ORAL_ASSESSMENT';
  else if (remote.type === 'PROJECT') mappedType = 'PROJECT';

  return {
    id: remote.id,
    userId: remote.user_id,
    capabilityId: remote.capability_id,
    type: mappedType,
    title: remote.title,
    description: remote.description || undefined,
    strength: Math.round(remote.strength),
    qualityScore: Math.round(remote.strength),
    status: 'VERIFIED',
    projectId: remote.project_id || undefined,
    createdAt: remote.created_at,
  };
}

export const EvidenceService = {
  /**
   * Fetch all user evidence from GET /api/v1/evidence
   */
  async getAll(): Promise<Evidence[]> {
    const remoteList = await apiClient.get<RemoteEvidence[]>('/api/v1/evidence');
    return remoteList.map(mapRemoteToDomainEvidence);
  },

  /**
   * Fetch evidence matching a specific capability ID
   */
  async getByCapabilityId(capabilityId: string): Promise<Evidence[]> {
    const all = await this.getAll();
    return all.filter(e => e.capabilityId === capabilityId);
  },

  /**
   * Add a new piece of evidence via POST /api/v1/evidence
   */
  async addEvidence(payload: {
    capabilityId: string;
    type: 'GITHUB_REPO' | 'PRACTICAL' | 'PROJECT' | 'ORAL' | 'ASSESSMENT';
    title: string;
    description?: string;
    strength?: number;
    projectId?: string;
  }): Promise<Evidence> {
    const remote = await apiClient.post<RemoteEvidence>('/api/v1/evidence', {
      capability_id: payload.capabilityId,
      type: payload.type,
      title: payload.title,
      description: payload.description,
      strength: payload.strength || 80,
      project_id: payload.projectId || null,
    });
    return mapRemoteToDomainEvidence(remote);
  },
};
