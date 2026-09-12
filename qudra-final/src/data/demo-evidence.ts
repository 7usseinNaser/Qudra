import type { Evidence, EvidenceTableRow } from '../types'

export const demoEvidence: Evidence[] = [
  { id: 'ev1', source: 'github', title: 'نظام إدارة الجامعة المفتوح', path: 'github.com/ahmed/uni-system', type: 'مشروع', skill: 'Backend', date: '2026-07-15', weight: 4, strong: true, level: 'v1', skills: ['Backend', 'PostgreSQL', 'REST APIs', 'Testing'], outcome: 'نظام إنتاجي يخدم 3000 طالب' },
  { id: 'ev2', source: 'github', title: 'مكتبة تخطيط المسارات', path: 'github.com/ahmed/route-planner', type: 'مكتبة', skill: 'Algorithms', date: '2026-06-01', weight: 3, strong: true, level: 'v1', skills: ['Algorithms', 'TypeScript'] },
  { id: 'ev3', source: 'qudra', title: 'تحدي تطبيق الجامعة', type: 'تحدي عملي', skill: 'UI/UX', date: '2026-08-29', weight: 5, strong: true, level: 'v1', skills: ['UI/UX', 'Product Thinking'], fresh: true },
  { id: 'ev4', source: 'leetcode', title: '420 مسألة محلولة', path: 'leetcode.com/ahmed', type: 'تدريب', skill: 'Algorithms', date: '2026-05-20', weight: 2, strong: false, level: 'v2' },
  { id: 'ev5', source: 'project', title: 'منصة تجارة إلكترونية', type: 'مشروع', skill: 'Full Stack', date: '2026-04-10', weight: 3, strong: true, level: 'v1', skills: ['React', 'Node.js', 'PostgreSQL'] },
  { id: 'ev6', source: 'github', title: 'مساهمات في مكتبة مفتوحة المصدر', path: 'github.com/ahmed/contributions', type: 'مساهمة', skill: 'Backend', date: '2026-03-15', weight: 2, strong: false, level: 'v2' },
  { id: 'ev7', source: 'cert', title: 'شهادة AWS Solutions Architect', type: 'شهادة', skill: 'Cloud', date: '2026-02-01', weight: 3, strong: true, level: 'v1' },
  { id: 'ev8', source: 'project', title: 'لوحة تحكم تحليلية', type: 'مشروع', skill: 'Frontend', date: '2025-12-20', weight: 2, strong: false, level: 'v2', skills: ['React', 'D3.js'] },
  { id: 'ev9', source: 'claim', title: 'خبرة في إدارة الفريق', type: 'ادعاء ذاتي', skill: 'Leadership', date: '2026-01-15', weight: 1, strong: false, level: 'v3' },
  { id: 'ev10', source: 'claim', title: 'معرفة في DevOps', type: 'ادعاء ذاتي', skill: 'DevOps', date: '2026-01-10', weight: 1, strong: false, level: 'v3' },
  { id: 'ev11', source: 'peer', title: 'تقييم من زميل: محمد الدوسري', type: 'تقييم أقران', skill: 'Backend', date: '2026-06-20', weight: 2, strong: false, level: 'v2' },
]

export const demoEvidenceTable: EvidenceTableRow[] = [
  { source: 'github', title: 'نظام إدارة الجامعة', skill: 'Backend', date: '2026-07', level: 'v1', weight: 4 },
  { source: 'qudra', title: 'تحدي تطبيق الجامعة', skill: 'UI/UX', date: '2026-08', level: 'v1', weight: 5, fresh: true },
  { source: 'project', title: 'منصة تجارة إلكترونية', skill: 'Full Stack', date: '2026-04', level: 'v1', weight: 3 },
  { source: 'leetcode', title: '420 مسألة محلولة', skill: 'Algorithms', date: '2026-05', level: 'v2', weight: 2 },
  { source: 'cert', title: 'شهادة AWS', skill: 'Cloud', date: '2026-02', level: 'v1', weight: 3 },
  { source: 'peer', title: 'تقييم من زميل', skill: 'Backend', date: '2026-06', level: 'v2', weight: 2 },
  { source: 'claim', title: 'خبرة في DevOps', skill: 'DevOps', date: '2026-01', level: 'v3', weight: 1 },
]

export const demoNewEvidence: EvidenceTableRow = { source: 'qudra', title: 'تصميم قاعدة بيانات كاملة مع الفهارس', skill: 'تصميم قواعد البيانات', date: '2026-08-29', level: 'v1', weight: 5, fresh: true }
