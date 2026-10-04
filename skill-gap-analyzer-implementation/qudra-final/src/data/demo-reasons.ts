import type { EvidencePathStep, MatchReason } from '../types'

export const demoReasons: MatchReason[] = [
  { skill: 'UI/UX', max: 100, before: 88, after: 88, isGap: false, note: '3 أدلة موثّقة من GitHub ومشروع' },
  { skill: 'Product Thinking', max: 100, before: 80, after: 80, isGap: false, note: 'تقييم ممتاز في التحدي العملي' },
  { skill: 'Backend', max: 100, before: 72, after: 72, isGap: false, note: 'مشروع إنتاجي يخدم 3000 مستخدم' },
  { skill: 'تصميم قواعد البيانات', max: 100, before: 0, after: 0, isGap: true, note: 'لا يوجد دليل على تصميم قواعد البيانات', postNote: 'أكمل تحديًا عمليًا: تصميم schema كامل مع فهارس' },
  { skill: 'Mobile Development', max: 100, before: 65, after: 65, isGap: false, note: 'تطبيق React Native في GitHub' },
  { skill: 'Database', max: 100, before: 55, after: 55, isGap: false, note: 'استخدام PostgreSQL في مشاريع' },
]

export const demoReasonsAfterChallenge: MatchReason[] = [
  { skill: 'UI/UX', max: 100, before: 88, after: 88, isGap: false, note: '3 أدلة موثّقة من GitHub ومشروع' },
  { skill: 'Product Thinking', max: 100, before: 80, after: 80, isGap: false, note: 'تقييم ممتاز في التحدي العملي' },
  { skill: 'Backend', max: 100, before: 72, after: 72, isGap: false, note: 'مشروع إنتاجي يخدم 3000 مستخدم' },
  { skill: 'تصميم قواعد البيانات', max: 100, before: 0, after: 95, isGap: false, note: 'أكمل تحديًا عمليًا: تصميم schema كامل مع فهارس', postNote: 'مُقيَّم آليًا · 2026-08-29' },
  { skill: 'Mobile Development', max: 100, before: 65, after: 65, isGap: false, note: 'تطبيق React Native في GitHub' },
  { skill: 'Database', max: 100, before: 55, after: 55, isGap: false, note: 'استخدام PostgreSQL في مشاريع' },
]

export const demoPathSteps: EvidencePathStep[] = [
  { label: 'تعلّم', done: true }, { label: 'تدرّب', done: true }, { label: 'أثبت', done: false }, { label: 'أعد المطابقة', done: false },
]

export const demoPathStepsAfter: EvidencePathStep[] = [
  { label: 'تعلّم', done: true }, { label: 'تدرّب', done: true }, { label: 'أثبت', done: true }, { label: 'أعد المطابقة', done: true },
]
