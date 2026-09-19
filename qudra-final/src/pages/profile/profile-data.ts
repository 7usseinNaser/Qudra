export interface MyEvidence {
  src: string
  title: string
  type: string
  skill: string
  date: string
  level: 'موثّق' | 'مرتبط' | 'ذاتي'
}

export const MY_EVIDENCES: MyEvidence[] = [
  { src: 'GitHub', title: 'github.com/you/schedule-api', type: 'مستودع', skill: 'Backend', date: '2026-05', level: 'موثّق' },
  { src: 'GitHub', title: 'github.com/you/courses-sync', type: 'مستودع', skill: 'خط معالجة بيانات', date: '2025-11', level: 'موثّق' },
  { src: 'GitHub', title: 'github.com/you/inventory-api', type: 'مستودع', skill: 'REST APIs', date: '2026-01', level: 'موثّق' },
  { src: 'QUDRA', title: 'محاكاة · تحدّي تطبيق الجامعة', type: 'محاكاة', skill: 'UI/UX · Product', date: '2026-08', level: 'موثّق' },
  { src: 'QUDRA', title: 'محاكاة · بنية البيانات', type: 'محاكاة', skill: 'Backend', date: '2026-08', level: 'موثّق' },
  { src: 'QUDRA', title: 'محاكاة · ترتيب الأولويات', type: 'محاكاة', skill: 'Problem Solving', date: '2026-08', level: 'موثّق' },
  { src: 'LeetCode', title: 'leetcode.com/you', type: 'تقييم', skill: 'Algorithms', date: '2026-06', level: 'مرتبط' },
  { src: 'Project', title: 'مشروع مسلّم لعميل — بوابة طلاب', type: 'مشروع', skill: 'Backend', date: '2025-08', level: 'مرتبط' },
  { src: 'Project', title: 'لوحة تقارير داخلية (بلا رابط)', type: 'مشروع', skill: 'تصوير بيانات', date: '2025-04', level: 'مرتبط' },
  { src: 'Cert', title: 'شهادة معالجة الصوت', type: 'شهادة', skill: 'Speech', date: '2024-01', level: 'ذاتي' },
  { src: 'Self', title: 'مهارة مكتوبة في الملف', type: 'ادّعاء', skill: 'DevOps', date: '—', level: 'ذاتي' },
]

export interface TlSeries {
  name: string
  color: string
  isDashed: boolean
  points: [number, number, string][]
}

export const TL_DATA: TlSeries[] = [
  {
    name: 'Backend',
    color: '#00B8B8',
    isDashed: false,
    points: [
      [4, 40, 'أول مستودع صغير — بلا اختبارات'],
      [7, 58, 'مستودع خط معالجة بيانات على Airflow'],
      [9, 66, 'واجهة REST لإدارة المخزون مع اختبارات'],
      [13, 74, 'خدمة إدارة المواد والمواعيد'],
      [16, 86, 'تحدٍّ عملي مُقيَّم: بنية بيانات الجامعة'],
    ],
  },
  {
    name: 'Problem Solving',
    color: '#00787A',
    isDashed: false,
    points: [
      [14, 70, 'ملف LeetCode — 420 مسألة'],
      [16, 88, 'محاكاة: ترتيب الأولويات وتبريرها'],
    ],
  },
  {
    name: 'UI/UX',
    color: '#2FBFAE',
    isDashed: false,
    points: [
      [15, 0, 'لا دليل قبل هذه النقطة'],
      [16, 85, 'محاكاة: تصميم الشاشة الرئيسية للطالب'],
    ],
  },
  {
    name: 'Speech Processing',
    color: '#FFC107',
    isDashed: true,
    points: [
      [0, 45, 'شهادة دورة في معالجة الصوت — 2024'],
      [8, 34, 'بلا تطبيق منذ الشهادة'],
      [16, 22, 'الوزن اليوم أقل من نصف وزنه الأصلي'],
    ],
  },
]

export const TL_MONTHS = ['2025-05', '2025-07', '2025-09', '2025-11', '2026-01', '2026-03', '2026-05', '2026-07', '2026-09']

export const tlx = (m: number) => 46 + (m / 16) * 636
export const tly = (v: number) => 250 - (v / 100) * 214
