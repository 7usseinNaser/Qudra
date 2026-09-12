/**
 * Connections & Network Service — QUDRA
 * Status: BACKEND_NOT_AVAILABLE
 */

export interface ConnectionItem {
  id: string;
  name: string;
  headline: string;
  avatarUrl: string;
  mutualCapabilities: string[];
  status: 'connected' | 'pending' | 'received';
}

export const ConnectionsService = {
  async getAll(): Promise<ConnectionItem[]> {
    return [
      {
        id: 'conn_1',
        name: 'لينا الكرمي',
        headline: 'مهندسة ذكاء اصطناعي ومعالجة لغات طبيعية',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        mutualCapabilities: ['Python', 'NLP', 'Machine Learning'],
        status: 'connected',
      },
      {
        id: 'conn_2',
        name: 'محمد الدوسري',
        headline: 'مهندس برمجيات ونظم خلفية موثوقة',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        mutualCapabilities: ['FastAPI', 'PostgreSQL', 'Docker'],
        status: 'connected',
      },
    ];
  },
};
