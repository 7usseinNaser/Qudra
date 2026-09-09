import { Evidence } from './types';
import { QudraStore } from './store';

export const EvidenceService = {
  async getAll(): Promise<Evidence[]> {
    await new Promise(res => setTimeout(res, 80));
    return QudraStore.getEvidences();
  },

  async getByCapabilityId(capabilityId: string): Promise<Evidence[]> {
    await new Promise(res => setTimeout(res, 60));
    const all = QudraStore.getEvidences();
    return all.filter(e => e.capabilityId === capabilityId);
  },

  async addEvidence(evidence: Omit<Evidence, 'id' | 'createdAt'>): Promise<Evidence> {
    await new Promise(res => setTimeout(res, 120));
    const newEvidence: Evidence = {
      ...evidence,
      id: `ev_${Date.now().toString(36)}`,
      createdAt: new Date().toISOString()
    };
    QudraStore.addEvidence(newEvidence);
    return newEvidence;
  }
};
