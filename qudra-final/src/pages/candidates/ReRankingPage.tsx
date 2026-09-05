/**
 * ReRankingPage — شاشة "الترتيب تغيّر، لأن الدليل تغيّر" (#s6).
 *
 * مطابقة حرفية لـ prototype.html (#s6):
 * 1. صعود ماجد الشمري إلى المرتبة الأولى (91%) بعد إثبات قدرة تصميم قواعد البيانات.
 * 2. الحفاظ على المبدأ الصارم: لم تتغير أوزان أو ادعاءات، بل أُضيف دليل موثق حقيقي.
 * 3. حلقة الأثر الكاملة (مشكلة ← قدرة ← دليل ← أثر).
 * 4. زر "أعد الحلقة من البداية" لإعادة التشغيل من البداية.
 */

import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import { useProblem } from '../../contexts/ProblemContext'
import styles from './CandidatesPage.module.css'

interface FinalCand {
  name: string
  title: string
  score: number
  status: 'ready' | 'near' | 'far'
  statusLabel: string
  delta: string
  isWon?: boolean
}

const FINAL_CANDS: FinalCand[] = [
  {
    name: 'ماجد الشمري',
    title: 'مهندس Backend · الدمام',
    score: 91,
    status: 'ready',
    statusLabel: 'جاهز الآن',
    delta: 'صعد من 3 ← 1 · دليل موثّق في تصميم قواعد البيانات',
    isWon: true,
  },
  {
    name: 'لينا الحربي',
    title: 'مهندسة بيانات · الرياض',
    score: 84,
    status: 'ready',
    statusLabel: 'جاهز الآن',
    delta: 'بلا تغيير',
  },
  {
    name: 'محمد الدوسري',
    title: 'مهندس Backend · جدة',
    score: 81,
    status: 'near',
    statusLabel: 'قريب — فجوة واحدة',
    delta: 'بلا تغيير',
  },
  {
    name: 'ريم القحطاني',
    title: 'مطوّرة موبايل · الرياض',
    score: 66,
    status: 'far',
    statusLabel: 'يحتاج مسارًا',
    delta: 'بلا تغيير',
  },
  {
    name: 'سارة العتيبي',
    title: 'مطوّرة برمجيات · الخبر',
    score: 58,
    status: 'far',
    statusLabel: 'يحتاج مسارًا',
    delta: 'بلا تغيير',
  },
]

export function ReRankingPage() {
  const navigate = useNavigate()
  const { setProblemText } = useProblem()

  const handleRestart = () => {
    setProblemText('')
    navigate(ROUTES.PROBLEM)
  }

  return (
    <section className={`screen wrap ${styles.candsPage}`} id="s6" dir="rtl">
      <div className={styles.crumb}>
        <button
          className={styles.back}
          onClick={() => navigate(ROUTES.CANDIDATES)}
        >
          → رجوع للقائمة
        </button>
        <span>امتداد · بعد الدليل الجديد</span>
      </div>

      <h1 className={styles.scrt}>الترتيب تغيّر، لأن الدليل تغيّر</h1>
      <p className={styles.scrp}>
        لم نعدّل الأوزان ولم نجمّل الملف. دخل دليل موثّق واحد، فانتقل ماجد من المرتبة 3 إلى 1.
      </p>

      <div className={styles.cands} id="finalList" style={{ margin: '1.6rem 0' }}>
        {FINAL_CANDS.map((c, idx) => (
          <div
            key={c.name}
            className={`${styles.cand} ${c.isWon ? styles.won : ''}`}
          >
            <span className={styles.rk}>{String(idx + 1).padStart(2, '0')}</span>
            <span className={styles.av}>{c.name.charAt(0)}</span>
            <span className={styles.who}>
              <h3>{c.name}</h3>
              <p>{c.title}</p>
            </span>
            <span className={styles.dlt}>{c.delta}</span>
            <span className={styles.sc}>
              <span className={styles.v}>{c.score}%</span>
              <span className={styles.tr}>
                <i style={{ width: `${c.score}%` }} />
              </span>
            </span>
            <span className={styles.rdy}>
              <span
                className={
                  c.status === 'ready'
                    ? styles.pillReady
                    : c.status === 'near'
                    ? styles.pillNear
                    : styles.pillFar
                }
              >
                {c.statusLabel}
              </span>
            </span>
          </div>
        ))}
      </div>

      {/* حلقة الأثر الأربعة */}
      <div className="box" style={{ marginTop: '1rem' }}>
        <div style={{ display: 'grid', gap: '1.2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(12rem, 1fr))', gap: '1.2rem' }}>
            <div>
              <span className="mono" style={{ fontSize: '0.68rem', color: 'var(--ink-3)' }}>01</span>
              <h3 style={{ fontSize: '1rem', margin: '0.4rem 0 0.3rem' }}>مشكلة</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--ink-2)', lineHeight: 1.55, margin: 0 }}>
                الشركة تصف مشكلتها بلغة عادية، بلا مسمّى وظيفي.
              </p>
            </div>
            <div>
              <span className="mono" style={{ fontSize: '0.68rem', color: 'var(--ink-3)' }}>02</span>
              <h3 style={{ fontSize: '1rem', margin: '0.4rem 0 0.3rem' }}>قدرة</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--ink-2)', lineHeight: 1.55, margin: 0 }}>
                النظام يستخرج القدرات المطلوبة ويعلن ما استثناه.
              </p>
            </div>
            <div>
              <span className="mono" style={{ fontSize: '0.68rem', color: 'var(--ink-3)' }}>03</span>
              <h3 style={{ fontSize: '1rem', margin: '0.4rem 0 0.3rem' }}>دليل</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--ink-2)', lineHeight: 1.55, margin: 0 }}>
                يبحث عمّن يملك إثباتًا، ويظهر مستوى توثيق كل دليل.
              </p>
            </div>
            <div>
              <span className="mono" style={{ fontSize: '0.68rem', color: 'var(--ink-3)' }}>04</span>
              <h3 style={{ fontSize: '1rem', margin: '0.4rem 0 0.3rem' }}>أثر</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--ink-2)', lineHeight: 1.55, margin: 0 }}>
                نتيجة المشروع تعود دليلًا جديدًا في المطابقة القادمة.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="row" style={{ marginTop: '1.5rem', alignItems: 'center', gap: '1rem' }}>
        <button className="btn ghost" onClick={handleRestart} id="restartLoopBtn">
          أعد الحلقة من البداية
        </button>
        <span className="note">نتيجة المشروع نفسها ستصبح دليلًا في المطابقة القادمة.</span>
      </div>
    </section>
  )
}

export default ReRankingPage
