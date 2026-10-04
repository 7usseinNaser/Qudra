import type { AnalysisStage, EvaluationCriterion, SimulationTask } from '../types'

export const demoTasks: SimulationTask[] = [
  { id: 't1', skill: 'Product Thinking', question: 'أولًا، لو طُلب منك تحديد أهم 3 ميزات للإصدار الأول (MVP) من تطبيق الجامعة، ماذا ستختار ولماذا؟', hint: 'فكّر في: من هو المستخدم؟ ما المشكلة الأكثر إيلامًا؟ ما الذي يمكن انتظاره للإصدار التالي؟', score: 88 },
  { id: 't2', skill: 'UI/UX', question: 'ارسم تخطيطًا أوليًا للشاشة الرئيسية. كيف سيجد الطالب مواده ومواعيده؟ صف العناصر وترتيبها.', hint: 'صف: القائمة العلوية، البطاقات، البحث، التصفية. ما الذي يظهر أولًا؟', score: 90 },
  { id: 't3', skill: 'Backend', question: 'صف بنية البيانات لتخزين المواد والمواعيد. ما الجداول التي ستنشئها؟ كيف تربطها؟', hint: 'فكّر في: جدول المواد، جدول المواعيد، العلاقات، الفهارس.', score: 76 },
]

export const demoTaskScores: number[] = [88, 90, 76]

export const demoCriteria: EvaluationCriterion[] = [
  { label: 'فهم المشكلة', score: 85 },
  { label: 'تجربة المستخدم', score: 90 },
  { label: 'بنية الحل', score: 75 },
  { label: 'المنطق والتبرير', score: 88 },
]

export const demoOverallScore = 85

export const demoAnalysisStages: AnalysisStage[] = [
  { label: 'قراءة وصف المشكلة' },
  { label: 'استخراج الأهداف' },
  { label: 'تحديد المستخدمين' },
  { label: 'تحليل القيود' },
  { label: 'استخراج القدرات' },
  { label: 'توليد المهام' },
]

export const demoPhrases = ['تطبيق', 'طلاب', 'جامعة', 'مواد', 'مواعيد', 'واجهة', 'Backend', 'قاعدة بيانات', 'تحليل']

export const demoExamples = [
  'أريد بناء تطبيق يساعد طلاب الجامعة على إيجاد موادهم ومواعيدهم بسهولة.',
  'أريد تحليل مكالمات خدمة العملاء تلقائيًا لاستخراج الشكاوى والملاحظات.',
  'أريد بناء منصة تجارة إلكترونية تتيح للتجار المحليين بيع منتجاتهم عبر الإنترنت.',
]
