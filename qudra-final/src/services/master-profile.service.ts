import { MasterProfileData } from './types';
import { QudraStore } from './store';

export const MasterProfileService = {
  async getProfile(): Promise<MasterProfileData> {
    await new Promise(res => setTimeout(res, 100));
    return QudraStore.getMasterProfile();
  },

  async updateProfile(updates: Partial<MasterProfileData>): Promise<MasterProfileData> {
    await new Promise(res => setTimeout(res, 120));
    const current = QudraStore.getMasterProfile();
    const updated = { ...current, ...updates };
    QudraStore.setMasterProfile(updated);
    return updated;
  }
};
