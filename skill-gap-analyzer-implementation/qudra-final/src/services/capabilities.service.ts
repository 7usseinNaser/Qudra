/**
 * Capabilities Service — QUDRA
 * Direct integration with FastAPI backend capabilities and multi-factor scoring.
 */

import { apiClient, RemoteCapability, RemoteUserCapability, RemoteFullCapabilityProfile } from './api';
import { Capability, CapabilityLevel } from './types';

function mapRemoteToDomainCapability(remote: RemoteCapability): Capability {
  return {
    id: remote.id,
    name: remote.name,
    category: remote.category || 'عام',
    description: remote.description || undefined,
    level: 'INTERMEDIATE' as CapabilityLevel,
    strength: 75,
    confidence: 80,
    evidenceCount: 0,
    isVerified: false,
    lastUpdated: remote.created_at,
  };
}

export const CapabilitiesService = {
  /**
   * Fetch all system capabilities from GET /api/v1/capabilities
   */
  async getAll(): Promise<Capability[]> {
    const remoteList = await apiClient.get<RemoteCapability[]>('/api/v1/capabilities');
    return remoteList.map(mapRemoteToDomainCapability);
  },

  /**
   * Fetch a single capability by ID from GET /api/v1/capabilities/{id}
   */
  async getById(id: string): Promise<Capability> {
    const remote = await apiClient.get<RemoteCapability>(`/api/v1/capabilities/${id}`);
    return mapRemoteToDomainCapability(remote);
  },

  /**
   * Create a new capability via POST /api/v1/capabilities
   */
  async create(cap: { name: string; category?: string; description?: string }): Promise<Capability> {
    const remote = await apiClient.post<RemoteCapability>('/api/v1/capabilities', {
      name: cap.name,
      category: cap.category,
      description: cap.description,
    });
    return mapRemoteToDomainCapability(remote);
  },

  /**
   * Fetch the current authenticated user's scored capabilities from Dana's endpoint:
   * GET /api/v1/users/me/capabilities
   */
  async getMyCapabilities(): Promise<RemoteUserCapability[]> {
    return apiClient.get<RemoteUserCapability[]>('/api/v1/users/me/capabilities');
  },

  /**
   * Fetch the full capability profile from Dana's endpoint:
   * GET /api/v1/users/me/capability-profile
   */
  async getMyCapabilityProfile(): Promise<RemoteFullCapabilityProfile> {
    return apiClient.get<RemoteFullCapabilityProfile>('/api/v1/users/me/capability-profile');
  },
};
