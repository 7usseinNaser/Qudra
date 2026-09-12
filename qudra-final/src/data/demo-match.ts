import type { LoopStep, MatchRow, Need, TeamMember } from '../types'

export const demoMatchRows: MatchRow[] = [
  { capability: 'UI/UX', covered: true, coverage: 85 },
  { capability: 'Mobile Development', covered: true, coverage: 70 },
  { capability: 'Product Thinking', covered: true, coverage: 78 },
  { capability: 'Backend', covered: false, coverage: 65 },
  { capability: 'Database', covered: false, coverage: 0 },
]

export const demoNeeds: Need[] = [
  { id: 'n1', label: 'مطوّر Backend', type: 'human', coverage: 40, action: 'اعرض من يثبتها' },
  { id: 'n2', label: 'أداة AI لبناء قاعدة البيانات', type: 'tool', coverage: 20, action: 'جرّب الأداة' },
]

export const demoTeam: TeamMember[] = [{ name: 'أنت', role: 'صاحب المشكلة', isYou: true }]

export const demoLoopSteps: LoopStep[] = [
  { label: 'صف المشكلة' }, { label: 'أثبت القدرات' }, { label: 'طابِق المرشحين' }, { label: 'أنجز مع الفريق' },
]

export const demoMatchPercentage = 65
