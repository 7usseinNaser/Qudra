import type { FileStrength, Opportunity, PassportStats, PrivacyToggle, ProfileCapability, ProfileStats, QuickWin, RoleReadiness, RoadmapStep, SkillGap, TimelineSeries } from '../types'
import type { EvidenceSourceItem } from '../types'

export const demoProfileStats: ProfileStats = { totalEvidence: 11, verifiedEvidence: 6, capabilitiesCount: 3, sourcesCount: 4, pendingCount: 2 }
export const demoProvenCapabilities: ProfileCapability[] = [
  { name: 'Problem Solving', score: 88, verified: true, variant: 'proven', evidenceCount: 3 },
  { name: 'UI/UX', score: 85, verified: true, variant: 'proven', evidenceCount: 3 },
  { name: 'Product Thinking', score: 78, verified: true, variant: 'proven', evidenceCount: 2 },
]
export const demoPendingCapabilities: ProfileCapability[] = [
  { name: 'Mobile Development', score: 70, verified: false, variant: 'claimed' },
  { name: 'Backend', score: 65, verified: false, variant: 'claimed' },
]
export const demoFileStrength: FileStrength = { score: 72, documentation: 85, diversity: 80, freshness: 60, coverage: 55 }
export const demoQuickWins: QuickWin[] = [{ label: 'تحدي Backend', delta: 9 }, { label: 'مصدر جديد', delta: 6 }, { label: 'تحديث دليل قديم', delta: 4 }]
export const demoRoleReadiness: RoleReadiness[] = [{ role: 'Backend', score: 91 }, { role: 'Full Stack', score: 68 }, { role: 'ML', score: 34 }]
export const demoSources: EvidenceSourceItem[] = [
  { id: 'src1', type: 'github', name: 'GitHub', linked: true, count: 8, evidenceOutput: 6 },
  { id: 'src2', type: 'leetcode', name: 'LeetCode', linked: true, count: 420, evidenceOutput: 2 },
  { id: 'src3', type: 'challenge', name: 'Hack The Box', linked: false, count: 0, evidenceOutput: 0 },
  { id: 'src4', type: 'project', name: 'مشروع يدوي', linked: false, count: 0, evidenceOutput: 0 },
  { id: 'src5', type: 'challenge', name: 'تحدٍّ عملي', linked: false, count: 0, evidenceOutput: 0 },
  { id: 'src6', type: 'cert', name: 'شهادة', linked: false, count: 0, evidenceOutput: 0 },
]
export const demoSourceWeights = [
  { source: 'تحدي عملي', weight: 5 }, { source: 'مشروع موثّق', weight: 4 }, { source: 'GitHub', weight: 3 }, { source: 'LeetCode', weight: 2 }, { source: 'ادعاء ذاتي', weight: 1 },
]
export const demoSkillGap: SkillGap = { have: ['Node.js', 'PostgreSQL', 'REST APIs'], need: ['React', 'إدارة الحالة'], readiness: 68, gapCount: 2 }
export const demoRoadmapSteps: RoadmapStep[] = [
  { label: 'تعلّم', done: true }, { label: 'تدرّب', done: false }, { label: 'أثبت', done: false }, { label: 'أعد المطابقة', done: false },
]
export const demoGapImpact = { readinessBefore: 68, readinessAfter: 89, opportunitiesBefore: 3, opportunitiesAfter: 7, fileStrengthBefore: 72, fileStrengthAfter: 84, timeEstimate: '2-3 أسابيع' }
export const demoOpportunities: Opportunity[] = [
  { id: 'op1', title: 'تحليل مكالمات خدمة العملاء', score: 91, status: 'ready', reason: 'جاهز الآن — تغطية كاملة' },
  { id: 'op2', title: 'منصة تجارة إلكترونية', score: 68, status: 'near', reason: 'قريب — تحتاج React', requiredSkills: ['React'] },
  { id: 'op3', title: 'توصيات ذكية للمنتجات', score: 34, status: 'needs', reason: 'يحتاج مسارًا — ML/NLP', requiredSkills: ['ML', 'NLP'] },
]
export const demoOpportunityImpact = [{ skill: 'React', opensCount: 4 }, { skill: 'ML/NLP', opensCount: 6 }, { skill: 'DevOps', opensCount: 2 }]
export const demoTimelineSeries: TimelineSeries[] = [
  { name: 'Backend', color: '#00B8B8', points: [{ month: '2025-04', score: 40 }, { month: '2025-06', score: 48 }, { month: '2025-08', score: 55 }, { month: '2025-10', score: 60 }, { month: '2025-12', score: 65 }, { month: '2026-02', score: 70 }, { month: '2026-04', score: 75 }, { month: '2026-06', score: 78 }, { month: '2026-08', score: 82 }] },
  { name: 'UI/UX', color: '#00787A', points: [{ month: '2025-04', score: 30 }, { month: '2025-06', score: 32 }, { month: '2025-08', score: 70 }, { month: '2025-10', score: 72 }, { month: '2025-12', score: 75 }, { month: '2026-02', score: 78 }, { month: '2026-04', score: 80 }, { month: '2026-06', score: 83 }, { month: '2026-08', score: 85 }] },
  { name: 'Speech Processing', color: '#FFC107', points: [{ month: '2025-04', score: 65 }, { month: '2025-06', score: 68 }, { month: '2025-08', score: 65 }, { month: '2025-10', score: 60 }, { month: '2025-12', score: 55 }, { month: '2026-02', score: 50 }, { month: '2026-04', score: 45 }, { month: '2026-06', score: 42 }, { month: '2026-08', score: 38 }] },
  { name: 'Product Thinking', color: '#8A6200', points: [{ month: '2025-04', score: 50 }, { month: '2025-06', score: 55 }, { month: '2025-08', score: 60 }, { month: '2025-10', score: 65 }, { month: '2025-12', score: 68 }, { month: '2026-02', score: 70 }, { month: '2026-04', score: 73 }, { month: '2026-06', score: 76 }, { month: '2026-08', score: 78 }] },
]
export const demoTimelineMonths = ['2025-04', '2025-06', '2025-08', '2025-10', '2025-12', '2026-02', '2026-04', '2026-06', '2026-08']
export const demoPrivacyToggles: PrivacyToggle[] = [
  { key: 'skills', label: 'القدرات المثبتة', enabled: true },
  { key: 'verification', label: 'مستويات التحقق', enabled: true },
  { key: 'sources', label: 'أسماء المصادر', enabled: true },
  { key: 'scores', label: 'الدرجات التفصيلية', enabled: false },
  { key: 'gaps', label: 'الفجوات', enabled: false },
]
export const demoPassportStats: PassportStats = { views: 24, companies: 7, invitations: 2 }
export const demoEvidenceSignals = [
  { label: 'التعقيد', value: 82 },
  { label: 'الاكتمال', value: 90 },
  { label: 'تغطية الاختبارات', value: 70 },
  { label: 'وضوح التوثيق', value: 85 },
]
export const demoEvidenceImpact = { totalDelta: 12, skillDeltas: [{ skill: 'Backend', delta: 12 }, { skill: 'REST APIs', delta: 8 }, { skill: 'Testing', delta: 3 }] }
export const demoVerificationText = 'تم التحقق عبر GitHub App بوصول read-only. قرأنا الكود، التحامات (commits)، ورسائل التحام. لم نعدّل أي شيء.'
