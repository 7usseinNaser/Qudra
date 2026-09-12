import type { Candidate } from '../types'

export const demoCandidates: Candidate[] = [
  { id: 'c1', rank: 1, name: 'لينا الحربي', role: 'مطوّرة Backend', avatar: 'ل', score: 84, status: 'ready', proven: [{ name: 'Backend', evidenceCount: 4 }, { name: 'Database', evidenceCount: 3 }, { name: 'REST APIs', evidenceCount: 2 }], claimed: [], gaps: [], meta: 'مطوّرة Backend' },
  { id: 'c2', rank: 2, name: 'محمد الدوسري', role: 'مطوّر Full Stack', avatar: 'م', score: 81, status: 'near', proven: [{ name: 'UI/UX', evidenceCount: 3 }, { name: 'Product Thinking', evidenceCount: 2 }], claimed: [], gaps: ['Database'], meta: 'مطوّر Full Stack' },
  { id: 'c3', rank: 3, name: 'ماجد الشمري', role: 'مطوّر Full Stack', avatar: 'م', score: 78, status: 'near', proven: [{ name: 'UI/UX', evidenceCount: 3 }, { name: 'Product Thinking', evidenceCount: 2 }], claimed: [], gaps: ['تصميم قواعد البيانات'], meta: 'مطوّر Full Stack', turned: false, previousScore: 78, previousRank: 3 },
  { id: 'c4', rank: 4, name: 'ريم القحطاني', role: 'مطوّرة Frontend', avatar: 'ر', score: 66, status: 'needs', proven: [{ name: 'UI/UX', evidenceCount: 2 }], claimed: [{ name: 'Backend' }], gaps: ['Backend', 'Database'], meta: 'مطوّرة Frontend' },
  { id: 'c5', rank: 5, name: 'سارة العتيبي', role: 'مصممة Product', avatar: 'س', score: 58, status: 'needs', proven: [], claimed: [{ name: 'Product Thinking' }, { name: 'UI/UX' }], gaps: ['Backend', 'Database', 'Mobile Development'], meta: 'مصممة Product' },
]

export const demoCandidateAfterChallenge: Candidate = {
  id: 'c3', rank: 1, name: 'ماجد الشمري', role: 'مطوّر Full Stack', avatar: 'م', score: 91, status: 'ready',
  proven: [{ name: 'UI/UX', evidenceCount: 3 }, { name: 'Product Thinking', evidenceCount: 2 }, { name: 'تصميم قواعد البيانات', evidenceCount: 1 }],
  claimed: [], gaps: [], meta: 'مطوّر Full Stack', turned: true, previousScore: 78, previousRank: 3,
}
