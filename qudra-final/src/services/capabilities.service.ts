import { Capability } from './types';
import { QudraStore } from './store';

export const CapabilitiesService = {
  async getAll(): Promise<Capability[]> {
    await new Promise(res => setTimeout(res, 80));
    return QudraStore.getCapabilities();
  },

  async getById(id: string): Promise<Capability | undefined> {
    await new Promise(res => setTimeout(res, 50));
    const list = QudraStore.getCapabilities();
    return list.find(c => c.id === id || c.name.toLowerCase() === id.toLowerCase());
  },

  async create(cap: Omit<Capability, 'id' | 'evidenceCount' | 'lastUpdated'>): Promise<Capability> {
    await new Promise(res => setTimeout(res, 120));
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
