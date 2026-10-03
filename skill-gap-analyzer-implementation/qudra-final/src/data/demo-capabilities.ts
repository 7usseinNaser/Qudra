import type { CompareCapability, ComparePerson, CoverageCapability, DnaCapability } from '../types'

export const demoSkills = [
  { id: 's1', name: 'UI/UX', priority: 'أساسية' as const, reason: 'يساعد الطلاب على إيجاد موادهم بسهولة', iconKey: 'layout' as const },
  { id: 's2', name: 'Mobile Development', priority: 'أساسية' as const, reason: 'أريد بناء تطبيق', iconKey: 'phone' as const },
  { id: 's3', name: 'Backend', priority: 'أساسية' as const, reason: 'مواعيد ومواد تحتاج مصدر بيانات موحّد', iconKey: 'server' as const },
  { id: 's4', name: 'Database', priority: 'مساندة' as const, reason: 'تخزين المواد والجداول والتغييرات', iconKey: 'db' as const },
  { id: 's5', name: 'Product Thinking', priority: 'مساندة' as const, reason: 'تحديد ما يُبنى أولًا ضمن نطاق محدود', iconKey: 'bulb' as const },
]

export const demoDna: DnaCapability[] = [
  { id: 'd1', name: 'Problem Solving', score: 88, verified: true, source: 'تحدي عملي + GitHub' },
  { id: 'd2', name: 'UI/UX', score: 85, verified: true, source: 'تحدي عملي + مشروع' },
  { id: 'd3', name: 'Product Thinking', score: 78, verified: true, source: 'تحدي عملي' },
  { id: 'd4', name: 'Mobile Development', score: 70, verified: false, inferred: true },
  { id: 'd5', name: 'Backend', score: 65, verified: false, belowThreshold: true },
]

export const demoCoverage: CoverageCapability[] = [
  { name: 'UI/UX', mine: 85, team: 0, uncovered: 15 },
  { name: 'Mobile Development', mine: 70, team: 0, uncovered: 30 },
  { name: 'Backend', mine: 65, team: 40, uncovered: 0 },
  { name: 'Database', mine: 0, team: 40, uncovered: 60 },
  { name: 'Product Thinking', mine: 78, team: 0, uncovered: 22 },
]

export const demoCompareCapabilities: CompareCapability[] = [
  { name: 'UI/UX' }, { name: 'Mobile Development' }, { name: 'Backend' }, { name: 'Database' }, { name: 'Product Thinking' },
]

export const demoComparePeople: ComparePerson[] = [
  { id: 'p1', name: 'لينا الحربي', scores: [90, 60, 95, 88, 70] },
  { id: 'p2', name: 'محمد الدوسري', scores: [85, 72, 78, 60, 82] },
  { id: 'p3', name: 'ماجد الشمري', scores: [88, 65, 72, 55, 80] },
  { id: 'p4', name: 'ريم القحطاني', scores: [78, 45, 50, 40, 60] },
  { id: 'p5', name: 'سارة العتيبي', scores: [60, 30, 35, 25, 75] },
]
