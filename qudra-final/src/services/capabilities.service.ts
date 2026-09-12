import { Capability } from './types';
import { QudraStore } from './store';
import { apiGet, type ApiErrorData } from './api/client';

interface RemoteCapability {
  id: string;
  name: string;
  category: string;
  description?: string;
  level?: string;
  strength?: number;
  confidence?: number;
  evidence_count?: number;
  is_verified?: boolean;
  last_updated?: string;
}

function mapRemoteCapability(r: RemoteCapability): Capability {
  return {
    id: String(r.id),
    name: r.name,
    category: r.category,
    description: r.description,
    level: (r.level as Capability['level']) || 'INTERMEDIATE',
    strength: r.strength ?? 0,
    confidence: r.confidence ?? 0,
    evidenceCount: r.evidence_count ?? 0,
    isVerified: Boolean(r.is_verified),
    lastUpdated: r.last_updated || new Date().toISOString(),
  };
}

export const CapabilitiesService = {
  async getAll(): Promise<Capability[]> {
    try {
      const remote = await apiGet<RemoteCapability[]>('/api/v1/capabilities');
      const mapped = remote.map(mapRemoteCapability);
      QudraStore.setCapabilities(mapped);
      return mapped;
    } catch (err) {
      const apiErr = err as ApiErrorData;
      if (apiErr.isNetworkError || apiErr.isColdStart) {
        return QudraStore.getCapabilities();
      }
      throw err;
    }
  },

  async getById(id: string): Promise<Capability | undefined> {
    try {
      const remote = await apiGet<RemoteCapability>(`/api/v1/capabilities/${id}`);
      return mapRemoteCapability(remote);
    } catch (err) {
      const apiErr = err as ApiErrorData;
      if (apiErr.isNetworkError || apiErr.isColdStart || apiErr.status === 404) {
        const list = QudraStore.getCapabilities();
        return list.find(c => c.id === id || c.name.toLowerCase() === id.toLowerCase());
      }
      throw err;
    }
  },

  async getMyCapabilityProfile(): Promise<Capability[]> {
    try {
      const remote = await apiGet<RemoteCapability[]>('/api/v1/users/me/capabilities');
      return remote.map(mapRemoteCapability);
    } catch (err) {
      const apiErr = err as ApiErrorData;
      if (apiErr.isNetworkError || apiErr.isColdStart) {
        return QudraStore.getCapabilities();
      }
      throw err;
    }
  },

  async create(cap: Omit<Capability, 'id' | 'evidenceCount' | 'lastUpdated'>): Promise<Capability> {
    const newCap: Capability = {
      ...cap,
      id: `cap_${Date.now().toString(36)}`,
      evidenceCount: 0,
      lastUpdated: new Date().toISOString()
    };
    QudraStore.addCapability(newCap);
    return newCap;
  }
};
