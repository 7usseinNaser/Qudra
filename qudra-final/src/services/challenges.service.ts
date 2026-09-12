/**
 * Challenges Service — QUDRA
 * Status: BACKEND_NOT_AVAILABLE (Models exist in backend app/db/models/challenge.py but routers are not yet exposed on public FastAPI)
 */

export interface ChallengeItem {
  id: string;
  title: string;
  capabilityName: string;
  difficulty: 'مبتدئ' | 'متوسط' | 'متقدم';
  durationMinutes: number;
  description: string;
  status: 'available' | 'in_progress' | 'passed' | 'failed';
}

export const ChallengesService = {
  async getAll(): Promise<ChallengeItem[]> {
    return [
      {
        id: 'chal_1',
        title: 'بناء معمارية Microservice بـ FastAPI و Async Engine',
        capabilityName: 'Backend Development',
        difficulty: 'متقدم',
        durationMinutes: 45,
        description: 'تصميم مسار آمن لمعالجة الطلبات المتزامنة مع عزل المعاملات المصرفية.',
        status: 'available',
      },
    ];
  },
};
