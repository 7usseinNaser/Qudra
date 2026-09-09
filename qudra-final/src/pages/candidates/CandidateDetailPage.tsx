/**
 * CandidateDetailPage — شاشة "لماذا هذا الشخص" مع آلية التحول بالدليل (#s5 + #turnBox).
 *
 * تستخدم معامل :id من الرابط لعرض المرشح الصحيح من قائمة المرشحين.
 */

import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import { InviteModal } from '../../components/modals/InviteModal'
import styles from './CandidateDetailPage.module.css'

interface ReasonItem {
  name: string
  weight: number
  scoreBefore: number
  scoreAfter: number
  isGap: boolean
  noteBefore: string
  noteAfter: string | null
}

interface CandidateDetail {
  id: string
  name: string
  title: string
  gapSkill: string
  reasons: ReasonItem[]
  pathSteps: [string, string][]
  baseEvidences: [string, string, string, string, string][]
  newEvidence: [string, string, string, string, string]
  scoreBefore: number
  scoreAfter: number
  confidenceBefore: string
  confidenceAfter: string
  verifiedBefore: string
  verifiedAfter: string
  lastUpdateBefore: string
  lastUpdateAfter: string
}

const CANDIDATE_DETAILS: Record<string, CandidateDetail> = {
  lina: {
    id: 'lina',
    name: 'لينا الحربي',
    title: 'مهندسة بيانات · الرياض',
    gapSkill: 'Mobile Development',
    scoreBefore: 84,
    scoreAfter: 93,
    confidenceBefore: 'مرتفع',
    confidenceAfter: 'مرتفع جدًا',
    verifiedBefore: '5 من 7',
    verifiedAfter: '6 من 8',
    lastUpdateBefore: '2026-06-14',
    lastUpdateAfter: '2026-08-29',
    reasons: [
      { name: 'تصميم قواعد البيانات', weight: 25, scoreBefore: 23, scoreAfter: 23, isGap: false, noteBefore: 'تسعة أدلة موثّقة، أقواها مستودع inventory-api بفهارس محسّنة.', noteAfter: null },
      { name: 'بناء واجهات REST', weight: 20, scoreBefore: 19, scoreAfter: 19, isGap: false, noteBefore: 'خمسة أدلة موثّقة بتوثيق واضح واختبارات.', noteAfter: null },
      { name: 'التكامل مع الواجهة', weight: 18, scoreBefore: 16, scoreAfter: 16, isGap: false, noteBefore: 'مشروعان سُلّما لعميل، وكلاهما يربط واجهة فعلية بخدمة خلفية.', noteAfter: null },
      { name: 'الاختبارات والموثوقية', weight: 15, scoreBefore: 14, scoreAfter: 14, isGap: false, noteBefore: 'تغطية اختبارات جيدة في ثلاثة مستودعات.', noteAfter: null },
      { name: 'الأداء تحت الحمل', weight: 12, scoreBefore: 10, scoreAfter: 10, isGap: false, noteBefore: 'خدمة طوابير غير متزامنة تعمل فعليًا.', noteAfter: null },
      { name: 'الالتزام الزمني', weight: 10, scoreBefore: 9, scoreAfter: 9, isGap: false, noteBefore: 'سجل تسليم في الوقت في أربعة مشاريع سابقة.', noteAfter: null },
    ],
    pathSteps: [
      ['تعلّم', 'تطوير تطبيقات الموبايل الأساسية'],
      ['تدرّب', 'تطبيق موبايل صغير يستهلك واجهة REST'],
      ['أثبت', 'تحدٍّ عملي مُقيَّم من المنصة'],
      ['أعد المطابقة', 'الدليل يدخل ويعيد حساب النتيجة'],
    ],
    baseEvidences: [
      ['github.com/lina/inventory-api', 'مستودع', 'Database', '2026-05', 'موثّق'],
      ['github.com/lina/data-pipeline', 'مستودع', 'Backend', '2026-02', 'موثّق'],
      ['qudra · مشروع مسلّم لعميل', 'مشروع', 'REST APIs', '2025-11', 'موثّق'],
      ['leetcode.com/lina', 'تقييم', 'Algorithms', '2026-06', 'موثّق'],
      ['شهادة PostgreSQL Associate', 'شهادة', 'قواعد بيانات', '2025-03', 'مرتبط'],
      ['لوحة تقارير داخلية (بلا رابط)', 'مشروع', 'تصوير بيانات', '2025-04', 'مرتبط'],
      ['مهارة مكتوبة في الملف', 'ادّعاء', 'Mobile Development', '—', 'ذاتي'],
    ],
    newEvidence: ['qudra · تحدٍّ عملي مُقيَّم', 'تحدٍّ', 'Mobile Development', '2026-08', 'موثّق'],
  },
  mohammed: {
    id: 'mohammed',
    name: 'محمد الدوسري',
    title: 'مهندس Backend · جدة',
    gapSkill: 'Mobile Development',
    scoreBefore: 81,
    scoreAfter: 91,
    confidenceBefore: 'متوسط — مرتفع',
    confidenceAfter: 'مرتفع',
    verifiedBefore: '4 من 7',
    verifiedAfter: '5 من 8',
    lastUpdateBefore: '2026-06-14',
    lastUpdateAfter: '2026-08-29',
    reasons: [
      { name: 'بناء واجهات REST', weight: 25, scoreBefore: 22, scoreAfter: 22, isGap: false, noteBefore: 'سبعة أدلة موثّقة، أقواها مستودع queue-service بتوثيق واضح.', noteAfter: null },
      { name: 'Node.js', weight: 20, scoreBefore: 18, scoreAfter: 18, isGap: false, noteBefore: 'ستة أدلة موثّقة في مستودعات متعددة.', noteAfter: null },
      { name: 'تصميم قواعد البيانات', weight: 18, scoreBefore: 15, scoreAfter: 15, isGap: false, noteBefore: 'ثلاثة أدلة مرتبطة، قاعدة بيانات في مشروعين.', noteAfter: null },
      { name: 'الاختبارات والموثوقية', weight: 15, scoreBefore: 12, scoreAfter: 12, isGap: false, noteBefore: 'تغطية اختبارات جزئية في مستودعين.', noteAfter: null },
      { name: 'الأداء تحت الحمل', weight: 12, scoreBefore: 11, scoreAfter: 11, isGap: false, noteBefore: 'خدمة طوابير غير متزامنة تعمل فعليًا.', noteAfter: null },
      { name: 'Mobile Development', weight: 10, scoreBefore: 3, scoreAfter: 9, isGap: true, noteBefore: 'ادّعاء ذاتي بلا دليل. المشروع قد يتطلب واجهة موبايل.', noteAfter: 'أُغلقت الفجوة: تحدٍّ عملي مُقيَّم أنتج تطبيقًا صغيرًا يستهلك واجهة REST.' },
    ],
    pathSteps: [
      ['تعلّم', 'أساسيات تطوير الموبايل'],
      ['تدرّب', 'تطبيق موبايل يستهلك واجهة REST'],
      ['أثبت', 'تحدٍّ عملي مُقيَّم من المنصة'],
      ['أعد المطابقة', 'الدليل يدخل ويعيد حساب النتيجة'],
    ],
    baseEvidences: [
      ['github.com/mohammed/queue-service', 'مستودع', 'Backend', '2026-05', 'موثّق'],
      ['github.com/mohammed/rest-api', 'مستودع', 'REST APIs', '2026-02', 'موثّق'],
      ['qudra · مشروع مسلّم لعميل', 'مشروع', 'Node.js', '2025-11', 'موثّق'],
      ['leetcode.com/mohammed', 'تقييم', 'Algorithms', '2026-06', 'موثّق'],
      ['شهادة Node.js Associate', 'شهادة', 'Node.js', '2025-03', 'مرتبط'],
      ['لوحة إدارة داخلية (بلا رابط)', 'مشروع', 'Backend', '2025-04', 'مرتبط'],
      ['مهارة مكتوبة في الملف', 'ادّعاء', 'Mobile Development', '—', 'ذاتي'],
    ],
    newEvidence: ['qudra · تحدٍّ عملي مُقيَّم', 'تحدٍّ', 'Mobile Development', '2026-08', 'موثّق'],
  },
  majid: {
    id: 'majid',
    name: 'ماجد الشمري',
    title: 'مهندس Backend · الدمام',
    gapSkill: 'تصميم قواعد البيانات',
    scoreBefore: 78,
    scoreAfter: 91,
    confidenceBefore: 'متوسط — مرتفع',
    confidenceAfter: 'مرتفع',
    verifiedBefore: '4 من 7',
    verifiedAfter: '5 من 8',
    lastUpdateBefore: '2026-06-14',
    lastUpdateAfter: '2026-08-29',
    reasons: [
      { name: 'تصميم قواعد البيانات', weight: 25, scoreBefore: 10, scoreAfter: 23, isGap: true, noteBefore: 'ادّعاء ذاتي بلا دليل. المشروع كله يقوم على ربط الطالب بمواده ومواعيدها — وهذه أثقل قدرة فيه.', noteAfter: 'أُغلقت الفجوة: تحدٍّ عملي مُقيَّم أنتج مخطّطًا كاملًا للعلاقات مع فهارس الأداء.' },
      { name: 'بناء واجهات REST', weight: 20, scoreBefore: 19, scoreAfter: 19, isGap: false, noteBefore: 'أربعة أدلة موثّقة، أقواها مستودع inventory-api بتوثيق واضح واختبارات.', noteAfter: null },
      { name: 'التكامل مع الواجهة', weight: 18, scoreBefore: 16, scoreAfter: 16, isGap: false, noteBefore: 'مشروعان سُلّما لعميل، وكلاهما يربط واجهة فعلية بخدمة خلفية.', noteAfter: null },
      { name: 'الاختبارات والموثوقية', weight: 15, scoreBefore: 13, scoreAfter: 13, isGap: false, noteBefore: 'تغطية اختبارات جزئية في مستودعين — جيدة لا ممتازة.', noteAfter: null },
      { name: 'الأداء تحت الحمل', weight: 12, scoreBefore: 11, scoreAfter: 11, isGap: false, noteBefore: 'خدمة طوابير غير متزامنة تعمل فعليًا، موثّقة من المستودع.', noteAfter: null },
      { name: 'الالتزام الزمني', weight: 10, scoreBefore: 9, scoreAfter: 9, isGap: false, noteBefore: 'سجل تسليم في الوقت في ثلاثة مشاريع سابقة عبر المنصة.', noteAfter: null },
    ],
    pathSteps: [
      ['تعلّم', 'نمذجة العلاقات والفهرسة'],
      ['تدرّب', 'مخطّط لقاعدة بيانات جدول جامعي'],
      ['أثبت', 'تحدٍّ عملي مُقيَّم من المنصة'],
      ['أعد المطابقة', 'الدليل يدخل ويعيد حساب النتيجة'],
    ],
    baseEvidences: [
      ['github.com/mash/inventory-api', 'مستودع', 'REST APIs', '2026-05', 'موثّق'],
      ['github.com/mash/queue-service', 'مستودع', 'الأداء تحت الحمل', '2026-02', 'موثّق'],
      ['qudra · مشروع مسلّم لعميل', 'مشروع', 'التكامل مع الواجهة', '2025-11', 'موثّق'],
      ['leetcode.com/mash', 'تقييم', 'Algorithms', '2026-06', 'موثّق'],
      ['شهادة PostgreSQL Associate', 'شهادة', 'قواعد بيانات', '2025-03', 'مرتبط'],
      ['لوحة إدارة داخلية (بلا رابط)', 'مشروع', 'التكامل مع الواجهة', '2025-04', 'مرتبط'],
      ['مهارة مكتوبة في الملف', 'ادّعاء', 'تصميم قواعد البيانات', '—', 'ذاتي'],
    ],
    newEvidence: ['qudra · تحدٍّ عملي مُقيَّم', 'تحدٍّ', 'تصميم قواعد البيانات', '2026-08', 'موثّق'],
  },
  reem: {
    id: 'reem',
    name: 'ريم القحطاني',
    title: 'مطوّرة موبايل · الرياض',
    gapSkill: 'Backend',
    scoreBefore: 66,
    scoreAfter: 79,
    confidenceBefore: 'متوسط',
    confidenceAfter: 'متوسط — مرتفع',
    verifiedBefore: '3 من 7',
    verifiedAfter: '4 من 8',
    lastUpdateBefore: '2026-06-14',
    lastUpdateAfter: '2026-08-29',
    reasons: [
      { name: 'Flutter', weight: 25, scoreBefore: 22, scoreAfter: 22, isGap: false, noteBefore: 'ستة أدلة موثّقة في تطبيقين على المتجر.', noteAfter: null },
      { name: 'تصميم واجهات الموبايل', weight: 20, scoreBefore: 18, scoreAfter: 18, isGap: false, noteBefore: 'خمسة أدلة موثّقة في تطبيقات منشورة.', noteAfter: null },
      { name: 'تكامل API', weight: 18, scoreBefore: 14, scoreAfter: 14, isGap: false, noteBefore: 'ثلاثة أدلة مرتبطة، تكامل مع REST APIs في تطبيقين.', noteAfter: null },
      { name: 'Backend', weight: 15, scoreBefore: 5, scoreAfter: 12, isGap: true, noteBefore: 'ادّعاء ذاتي بلا دليل. المشروع يتطلب خدمة خلفية.', noteAfter: 'أُغلقت الفجوة: تحدٍّ عملي مُقيَّم أنتج واجهة REST بسيطة مع اختبارات.' },
      { name: 'قواعد البيانات', weight: 12, scoreBefore: 4, scoreAfter: 4, isGap: false, noteBefore: 'ادّعاء ذاتي بلا دليل — لكن الوزن أقل.', noteAfter: null },
      { name: 'الالتزام الزمني', weight: 10, scoreBefore: 8, scoreAfter: 8, isGap: false, noteBefore: 'سجل تسليم في الوقت في مشروعين.', noteAfter: null },
    ],
    pathSteps: [
      ['تعلّم', 'أساسيات Backend و REST APIs'],
      ['تدرّب', 'واجهة REST بسيطة مع قاعدة بيانات'],
      ['أثبت', 'تحدٍّ عملي مُقيَّم من المنصة'],
      ['أعد المطابقة', 'الدليل يدخل ويعيد حساب النتيجة'],
    ],
    baseEvidences: [
      ['github.com/reem/student-app', 'مستودع', 'Flutter', '2026-05', 'موثّق'],
      ['github.com/reem/medical-tracker', 'مستودع', 'Flutter', '2026-02', 'موثّق'],
      ['qudra · مشروع مسلّم لعميل', 'مشروع', 'تصميم واجهات الموبايل', '2025-11', 'موثّق'],
      ['leetcode.com/reem', 'تقييم', 'Algorithms', '2026-06', 'مرتبط'],
      ['تطبيق على المتجر (بلا رابط)', 'مشروع', 'Flutter', '2025-04', 'مرتبط'],
      ['مهارة مكتوبة في الملف', 'ادّعاء', 'Backend', '—', 'ذاتي'],
      ['مهارة مكتوبة في الملف', 'ادّعاء', 'Database', '—', 'ذاتي'],
    ],
    newEvidence: ['qudra · تحدٍّ عملي مُقيَّم', 'تحدٍّ', 'Backend', '2026-08', 'موثّق'],
  },
  sara: {
    id: 'sara',
    name: 'سارة العتيبي',
    title: 'مطوّرة برمجيات · الخبر',
    gapSkill: 'Backend',
    scoreBefore: 58,
    scoreAfter: 72,
    confidenceBefore: 'منخفض — متوسط',
    confidenceAfter: 'متوسط',
    verifiedBefore: '2 من 6',
    verifiedAfter: '3 من 7',
    lastUpdateBefore: '2026-06-14',
    lastUpdateAfter: '2026-08-29',
    reasons: [
      { name: 'Python', weight: 25, scoreBefore: 20, scoreAfter: 20, isGap: false, noteBefore: 'خمسة أدلة موثّقة في مستودعين.', noteAfter: null },
      { name: 'تحليل البيانات', weight: 20, scoreBefore: 15, scoreAfter: 15, isGap: false, noteBefore: 'ثلاثة أدلة مرتبطة في مشاريع تحليل.', noteAfter: null },
      { name: 'Backend', weight: 18, scoreBefore: 6, scoreAfter: 14, isGap: true, noteBefore: 'ادّعاء ذاتي بلا دليل. المشروع يتطلب خدمة خلفية.', noteAfter: 'أُغلقت الفجوة: تحدٍّ عملي مُقيَّم أنتج واجهة REST بسيطة.' },
      { name: 'Mobile', weight: 15, scoreBefore: 4, scoreAfter: 4, isGap: false, noteBefore: 'ادّعاء ذاتي بلا دليل — الوزن أقل.', noteAfter: null },
      { name: 'قواعد البيانات', weight: 12, scoreBefore: 8, scoreAfter: 8, isGap: false, noteBefore: 'دليلان مرتبطان في مشاريع تحليل بيانات.', noteAfter: null },
      { name: 'الالتزام الزمني', weight: 10, scoreBefore: 5, scoreAfter: 5, isGap: false, noteBefore: 'سجل تسليم في مشروع واحد فقط.', noteAfter: null },
    ],
    pathSteps: [
      ['تعلّم', 'أساسيات Backend و REST APIs'],
      ['تدرّب', 'واجهة REST بسيطة مع قاعدة بيانات'],
      ['أثبت', 'تحدٍّ عملي مُقيَّم من المنصة'],
      ['أعد المطابقة', 'الدليل يدخل ويعيد حساب النتيجة'],
    ],
    baseEvidences: [
      ['github.com/sara/data-analysis', 'مستودع', 'Python', '2026-05', 'موثّق'],
      ['github.com/sara/ml-pipeline', 'مستودع', 'Python', '2026-02', 'موثّق'],
      ['qudra · مشروع تحليل بيانات', 'مشروع', 'تحليل البيانات', '2025-11', 'مرتبط'],
      ['شهادة Python Associate', 'شهادة', 'Python', '2025-03', 'مرتبط'],
      ['مهارة مكتوبة في الملف', 'ادّعاء', 'Backend', '—', 'ذاتي'],
      ['مهارة مكتوبة في الملف', 'ادّعاء', 'Mobile', '—', 'ذاتي'],
    ],
    newEvidence: ['qudra · تحدٍّ عملي مُقيَّم', 'تحدٍّ', 'Backend', '2026-08', 'موثّق'],
  },
}

export function CandidateDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [isTurned, setIsTurned] = useState(false)
  const [isRunningChallenge, setIsRunningChallenge] = useState(false)
  const [isInviteOpen, setIsInviteOpen] = useState(false)

  const detail = CANDIDATE_DETAILS[id || 'majid'] || CANDIDATE_DETAILS.majid

  const handleRunChallenge = () => {
    if (isRunningChallenge || isTurned) return
    setIsRunningChallenge(true)
    setTimeout(() => {
      setIsTurned(true)
      setIsRunningChallenge(false)
    }, 600)
  }

  const C = 540.4
  const currentScore = isTurned ? detail.scoreAfter : detail.scoreBefore
  const arcTealOffset = (C - (C * currentScore) / 100).toFixed(1)

  const evidenceList = isTurned
    ? [detail.newEvidence, ...detail.baseEvidences]
    : detail.baseEvidences

  return (
    <section className={`screen wrap ${styles.detailPage}`} id="s5" dir="rtl">
      <div className={styles.crumb}>
        <button
          className={styles.back}
          onClick={() => navigate(ROUTES.CANDIDATES)}
        >
          → رجوع للقائمة
        </button>
        <span>امتداد · لماذا هذا الشخص</span>
      </div>

      <div className={styles.headrow}>
        <div>
          <h1 className={styles.scrt}>لماذا {detail.name}</h1>
          <p className={styles.scrp}>
            كل نقطة في النتيجة لها سبب، وكل سبب له دليل يمكنك فتحه.
          </p>
        </div>
        <div className="row" style={{ gap: '0.6rem', alignItems: 'center' }}>
          <span
            className={isTurned ? 'pill ready' : 'pill near'}
            id="verdict"
          >
            {isTurned
              ? 'جاهز الآن — الفجوة أُغلقت بدليل'
              : 'قريب — فجوة واحدة قابلة للإثبات'}
          </span>
          <button
            className="btn"
            onClick={() => setIsInviteOpen(true)}
            id="openInviteBtn"
          >
            ادعُه للمشروع
          </button>
        </div>
      </div>

      <div className={styles.whygrid}>
        {/* العمود الجانبي (بطاقة النتيجة ودليل الرموز) */}
        <div className={styles.whyside}>
          <div className={`box ${styles.scorecard}`}>
            <div className={styles.dual}>
              <svg
                viewBox="0 0 200 200"
                width="168"
                height="168"
                role="img"
                aria-label="نسبة المطابقة"
              >
                <circle
                  cx="100"
                  cy="100"
                  r="86"
                  fill="none"
                  stroke="var(--soft)"
                  strokeWidth="14"
                />
                <circle
                  id="arcAmber"
                  cx="100"
                  cy="100"
                  r="86"
                  fill="none"
                  stroke="var(--gapc-fill, #e6a23c)"
                  strokeWidth="14"
                  strokeLinecap="round"
                  strokeDasharray="540.4"
                  strokeDashoffset={isTurned ? String(C - (C * detail.scoreAfter) / 100) : String(C - (C * detail.scoreBefore) / 100)}
                />
                <circle
                  id="arcTeal"
                  cx="100"
                  cy="100"
                  r="86"
                  fill="none"
                  stroke="var(--accent-fill)"
                  strokeWidth="14"
                  strokeLinecap="round"
                  strokeDasharray="540.4"
                  strokeDashoffset={arcTealOffset}
                />
              </svg>
              <div className={styles.dualc}>
                <span className={`${styles.big} num`} id="bigScore">
                  {currentScore}%
                </span>
                <span className="note">مطابقة بالدليل</span>
              </div>
            </div>

            <div className={styles.kv}>
              <div>
                <span>مستوى الثقة</span>
                <b id="conf">{isTurned ? detail.confidenceAfter : detail.confidenceBefore}</b>
              </div>
              <div>
                <span>أدلة موثّقة</span>
                <b className="mono" id="vcount">
                  {isTurned ? detail.verifiedAfter : detail.verifiedBefore}
                </b>
              </div>
              <div>
                <span>آخر تحديث للأدلة</span>
                <b className="mono" id="lastUp">
                  {isTurned ? detail.lastUpdateAfter : detail.lastUpdateBefore}
                </b>
              </div>
            </div>
          </div>

          <div className={`box ${styles.legend}`}>
            <h3>مفتاح مستوى التوثيق</h3>
            <div className={styles.lg}>
              <span className={`${styles.dot} ${styles.v1}`} />
              <span>موثّق — فُحص آليًا من المصدر</span>
            </div>
            <div className={styles.lg}>
              <span className={`${styles.dot} ${styles.v2}`} />
              <span>مرتبط — مصدر متصل بلا فحص كامل</span>
            </div>
            <div className={styles.lg}>
              <span className={`${styles.dot} ${styles.v3}`} />
              <span>ذاتي — كتبه الشخص عن نفسه</span>
            </div>
          </div>
        </div>

        {/* العمود الرئيسي */}
        <div className={styles.whymain}>
          {/* قسم الأسباب الستة */}
          <section className="box">
            <div className={styles.secrow}>
              <h2>من أين جاءت النتيجة</h2>
              <span className="note">
                ستة عوامل — الوزن من أصل <span className="num">100</span>
              </span>
            </div>
            <p className="note" style={{ marginBottom: '1.1rem' }}>
              الطول = وزن العامل في القرار. الامتلاء = ما أُثبت منه فعلًا.
            </p>

            <div id="reasons">
              {detail.reasons.map((r) => {
                const got = isTurned ? r.scoreAfter : r.scoreBefore
                const isGap = r.isGap && !isTurned
                const note = isTurned && r.noteAfter ? r.noteAfter : r.noteBefore
                return (
                  <div
                    key={r.name}
                    className={`${styles.rsn} ${isGap ? styles.gap : ''}`}
                  >
                    <div className={styles.rsntop}>
                      <span className={styles.rsndot} />
                      <span className={styles.rsnname}>{r.name}</span>
                      <span className={styles.rsntag}>
                        {isGap ? 'فجوة — بلا دليل' : 'مثبت بدليل'}
                      </span>
                      <span className={`${styles.rsngot} num`}>
                        {got} / {r.weight}
                      </span>
                    </div>
                    <div
                      className={styles.rsntrack}
                      style={{ width: `${(r.weight / 25) * 100}%` }}
                    >
                      <i style={{ width: `${(got / r.weight) * 100}%` }} />
                    </div>
                    <p className={styles.rsnnote}>{note}</p>
                  </div>
                )
              })}
            </div>
          </section>

          {/* صندوق التحول بالدليل (turnBox) */}
          <section
            className={`${styles.turn} ${isTurned ? styles.done : ''}`}
            id="turnBox"
          >
            <div className={styles.turnhead}>
              <span className={styles.td} id="turnDot" />
              <h2 id="turnTitle">
                {isTurned
                  ? 'الفجوة أصبحت دليلًا'
                  : 'الفجوة الوحيدة — وهي مسار، ليست رفضًا'}
              </h2>
              <span className={`mono ${styles.turnstamp}`} id="turnStamp">
                {isTurned ? 'مُقيَّم آليًا · 2026-08-29' : `وزن الفجوة ${detail.reasons.find(r => r.isGap)?.weight || 25} / 100`}
              </span>
            </div>

            <p className={styles.turnbody} id="turnBody">
              {isTurned
                ? `أكمل ${detail.name} التحدي: ${detail.pathSteps[2][1]}. قيّمته المنصة آليًا، فدخل دليل موثّق جديد وأُعيد حساب النتيجة أمامك.`
                : `ينقصه ${detail.gapSkill} بوزن ${detail.reasons.find(r => r.isGap)?.weight || 25} نقطة — وعنده ادّعاء ذاتي بلا دليل. نطلب إثباتًا.`}
            </p>

            <div className={styles.path} id="pathList">
              {detail.pathSteps.map((p, i) => (
                <div
                  key={p[0]}
                  className={`${styles.pstep} ${isTurned ? styles.done : ''}`}
                >
                  <span className={styles.b}>{i + 1}</span>
                  <span className={styles.l}>
                    {p[0]} — {p[1]}
                  </span>
                  <span className={styles.s}>
                    {isTurned
                      ? 'مكتمل'
                      : i < 2
                      ? 'مقترح'
                      : 'في الانتظار'}
                  </span>
                </div>
              ))}
            </div>

            {!isTurned ? (
              <div id="preTurn">
                <div className="row" style={{ alignItems: 'center', gap: '1rem' }}>
                  <button
                    className="btn dark"
                    id="chBtn"
                    disabled={isRunningChallenge}
                    onClick={handleRunChallenge}
                  >
                    {isRunningChallenge ? 'التحدي جارٍ…' : 'أرسل تحديًا عمليًا'}
                  </button>
                  <span className="note">
                    تحدٍّ عملي واحد، مهلته <span className="num">72</span> ساعة، ونتيجته تصبح دليلًا موثّقًا.
                  </span>
                </div>
              </div>
            ) : (
              <div id="postTurn" className={styles.newev}>
                <div className={styles.nehead}>
                  <span className={`${styles.dot} ${styles.v1}`} />
                  <h3>دليل جديد دخل الملف</h3>
                </div>

                <div className={styles.slots}>
                  <div>
                    <p className={styles.sl}>المصدر</p>
                    <p className={styles.sv}>{detail.newEvidence[0]}</p>
                  </div>
                  <div>
                    <p className={styles.sl}>النوع</p>
                    <p className={styles.sv}>{detail.newEvidence[1]}</p>
                  </div>
                  <div>
                    <p className={styles.sl}>المهارة</p>
                    <p className={styles.sv}>{detail.newEvidence[2]}</p>
                  </div>
                  <div>
                    <p className={styles.sl}>التاريخ</p>
                    <p className={`${styles.sv} mono`}>{detail.newEvidence[3]}</p>
                  </div>
                  <div>
                    <p className={styles.sl}>التوثيق</p>
                    <p className={styles.sv}>{detail.newEvidence[4]}</p>
                  </div>
                </div>

                <div className={styles.deltas}>
                  <div>
                    <p className="note">النتيجة</p>
                    <p className={`${styles.dv} num`}>
                      <s>{detail.scoreBefore}%</s> <b>← {detail.scoreAfter}%</b>
                    </p>
                  </div>
                  <div>
                    <p className="note">الترتيب</p>
                    <p className={`${styles.dv} num`}>
                      <s>3</s> <b className={styles.up}>← 1</b>
                    </p>
                  </div>
                  <button
                    className="btn dark"
                    style={{ marginInlineStart: 'auto' }}
                    onClick={() => navigate(ROUTES.RE_RANKING)}
                    id="toReRankingBtn"
                  >
                    اعرض الترتيب الجديد
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* قسم الأدلة كاملة */}
          <section className="box">
            <div className={styles.secrow}>
              <h2>الأدلة كاملة</h2>
              <span className="note">
                مرتّبة بمستوى التوثيق — الضعيف معروض كما هو
              </span>
            </div>

            <div className={styles.evtable}>
              <div className={styles.evhead}>
                <div>المصدر</div>
                <div>النوع</div>
                <div>المهارة</div>
                <div>التاريخ</div>
                <div>التوثيق</div>
              </div>
              <div id="evRows">
                {evidenceList.map((e, idx) => {
                  const isFresh = isTurned && idx === 0
                  const dotType =
                    e[4] === 'موثّق'
                      ? styles.v1
                      : e[4] === 'مرتبط'
                      ? styles.v2
                      : styles.v3
                  return (
                    <div
                      key={`${e[0]}-${idx}`}
                      className={`${styles.evrow} ${isFresh ? styles.fresh : ''}`}
                    >
                      <div>
                        <span className={styles.src}>{e[0]}</span>
                      </div>
                      <div>{e[1]}</div>
                      <div>
                        <span className={styles.sk}>{e[2]}</span>
                      </div>
                      <div className={styles.dt}>{e[3]}</div>
                      <div className={styles.lv}>
                        <span className={`${styles.dot} ${dotType}`} />
                        <span>{e[4]}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        </div>
      </div>

      <InviteModal
        isOpen={isInviteOpen}
        name={detail.name}
        roleMeta={detail.title}
        skill={detail.gapSkill}
        onClose={() => setIsInviteOpen(false)}
      />
    </section>
  )
}

export default CandidateDetailPage
