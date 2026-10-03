/**
 * Organizations Service — QUDRA
 * Status: BACKEND_NOT_AVAILABLE
 */

export interface OrganizationItem {
  id: string;
  name: string;
  industry: string;
  verified: boolean;
  memberCount: number;
  openProblemsCount: number;
}

export const OrganizationsService = {
  async getAll(): Promise<OrganizationItem[]> {
    return [
      { id: 'org_1', name: 'جامعة النجاح الوطنية — حاضنة الأعمال', industry: 'التعليم والتكنولوجيا', verified: true, memberCount: 14, openProblemsCount: 3 },
      { id: 'org_2', name: 'مختبرات الابتكار الرقمي', industry: 'الذكاء الاصطناعي', verified: true, memberCount: 8, openProblemsCount: 2 },
    ];
  },
};
