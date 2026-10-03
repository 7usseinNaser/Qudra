/**
 * Opportunities Service — QUDRA
 * Status: BACKEND_NOT_AVAILABLE
 */

export interface OpportunityItem {
  id: string;
  title: string;
  organization: string;
  type: 'project' | 'challenge' | 'fulltime' | 'consulting';
  matchScore: number;
  requiredSkills: string[];
  location: string;
}

export const OpportunitiesService = {
  async getAll(): Promise<OpportunityItem[]> {
    return [
      {
        id: 'opp_1',
        title: 'تطوير بنية REST API لمعالجة الصوتيات',
        organization: 'مختبرات الابتكار الرقمي',
        type: 'project',
        matchScore: 92,
        requiredSkills: ['FastAPI', 'PostgreSQL', 'Audio Processing'],
        location: 'عن بُعد (Remote)',
      },
      {
        id: 'opp_2',
        title: 'هندسة واجهات نظام إدارة المسابقات',
        organization: 'حاضنة التكنولوجيا',
        type: 'challenge',
        matchScore: 88,
        requiredSkills: ['React', 'TypeScript', 'Tailwind CSS'],
        location: 'فلسطين / هجين',
      },
    ];
  },
};
