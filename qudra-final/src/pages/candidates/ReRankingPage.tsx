/**
 * ReRankingPage — شاشة إعادة الترتيب بعد التحدي.
 *
 * مطابق لـ FINAL في prototype.html (WOW sequence).
 * تعرض المرشحين بعد التحدي مع:
 *   - ترتيب جديد + درجة جديدة
 *   - سهم صعود/هبوط
 *   - شارة "جاهز الآن"
 *   - زر "اعرض فريقك"
 *
 * راجع PROJECT_MAP.md → src/pages/candidates/ReRankingPage.tsx
 */

import { useNavigate } from 'react-router-dom'
import { Pill } from '../../components/ui'
import type { ReadinessStatus } from '../../types'
import styles from './ReRankingPage.module.css'

interface FinalCandidate {
  rank: number
  name: string
  role: string
  score: number
  status: ReadinessStatus
  delta: string
  turned: boolean
}

const finalCandidates: FinalCandidate[] = [
  { rank: 1, name: 'ماجد الشمري', role: 'مهندس Backend · الدمام', score: 91, status: 'ready', delta: 'صعد من 3 ← 1 · دليل موثّق في تصميم قواعد البيانات', turned: true },
  { rank: 2, name: 'لينا الحربي', role: 'مهندسة بيانات · الرياض', score: 84, status: 'ready', delta: 'بلا تغيير', turned: false },
  { rank: 3, name: 'محمد الدوسري', role: 'مهندس Backend · جدة', score: 81, status: 'near', delta: 'بلا تغيير', turned: false },
  { rank: 4, name: 'ريم القحطاني', role: 'مطوّرة موبايل · الرياض', score: 66, status: 'needs', delta: 'بلا تغيير', turned: false },
  { rank: 5, name: 'سارة العتيبي', role: 'مطوّرة برمجيات · الخبر', score: 58, status: 'needs', delta: 'بلا تغيير', turned: false },
]

export function ReRankingPage() {
  const navigate = useNavigate()

  return (
    <div className={styles.page} dir="rtl">
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>الترتيب بعد التحدي</h1>
          <p>ماجد أثبت تصميم قواعد البيانات في تحدٍّ عملي — صعد من المرتبة 3 إلى 1.</p>
        </header>

        <div className={styles.list}>
          {finalCandidates.map((c) => (
            <div
              key={c.name}
              className={`${styles.card} ${c.turned ? styles.turned : ''}`}
            >
              <div className={styles.rank}>{c.rank}</div>
              <div className={styles.info}>
                <div className={styles.nameRow}>
                  <h3>{c.name}</h3>
                  {c.turned && <span className={styles.badge}>صاعد</span>}
                </div>
                <p className={styles.role}>{c.role}</p>
                <p className={styles.delta}>{c.delta}</p>
              </div>
              <div className={styles.scoreCol}>
                <span className={styles.score}>{c.score}</span>
                <Pill status={c.status} />
              </div>
            </div>
          ))}
        </div>

        <div className={styles.actions}>
          <button className={styles.btnGhost} onClick={() => navigate('/candidates')}>
            عرض المرشحين
          </button>
          <button className={styles.btnPrimary} onClick={() => navigate('/result')}>
            اعرض فريقك
          </button>
        </div>
      </div>
    </div>
  )
}
