import { Evidence } from './types';
import { QudraStore } from './store';
import { apiGet, apiPost, type ApiErrorData } from './api/client';

interface RemoteEvidence {
  id: string;
  user_id: string;
  capability_id: string;
  type: string;
  title: string;
  description?: string;
  strength?: number;
  quality_score?: number;
  status?: string;
  url?: string;
  project_id?: string;
  verified_at?: string;
  created_at: string;
}

function mapRemoteEvidence(r: RemoteEvidence): Evidence {
  return {
    id: String(r.id),
    userId: String(r.user_id),
    capabilityId: String(r.capability_id),
    type: r.type as Evidence['type'],
    title: r.title,
    description: r.description,
    strength: r.strength ?? 0,
    qualityScore: r.quality_score ?? 0,
    status: (r.status as Evidence['status']) || 'CLAIMED',
    url: r.url,
    projectId: r.project_id,
    verifiedAt: r.verified_at,
    createdAt: r.created_at,
  };
}

export const EvidenceService = {
  async getAll(): Promise<Evidence[]> {
    try {
      const remote = await apiGet<RemoteEvidence[]>('/api/v1/evidence');
      const mapped = remote.map(mapRemoteEvidence);
      QudraStore.setEvidences(mapped);
      return mapped;
    } catch (err) {
      const apiErr = err as ApiErrorData;
      if (apiErr.isNetworkError || apiErr.isColdStart) {
        return QudraStore.getEvidences();
      }
      throw err;
    }
  },

  async getByCapabilityId(capabilityId: string): Promise<Evidence[]> {
    const all = await this.getAll();
    return all.filter(e => e.capabilityId === capabilityId);
  },

  async addEvidence(evidence: Omit<Evidence, 'id' | 'createdAt'>): Promise<Evidence> {
    try {
      const remote = await apiPost<RemoteEvidence>('/api/v1/evidence', {
        user_id: evidence.userId,
        capability_id: evidence.capabilityId,
        type: evidence.type,
        title: evidence.title,
        description: evidence.description,
        strength: evidence.strength,
        quality_score: evidence.qualityScore,
        status: evidence.status,
        url: evidence.url,
        project_id: evidence.projectId,
      });
      const mapped = mapRemoteEvidence(remote);
      QudraStore.addEvidence(mapped);
      return mapped;
    } catch {
      const newEvidence: Evidence = {
        ...evidence,
        id: `ev_${Date.now().toString(36)}`,
        createdAt: new Date().toISOString()
      };
      QudraStore.addEvidence(newEvidence);
      return newEvidence;
    }
  }
};
