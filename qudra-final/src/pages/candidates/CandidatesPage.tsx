/**
 * CandidatesPage — قائمة المرشحين الخمسة، مرتّبون بالدليل.
 *
 * مطابقة حرفية لـ prototype.html (#s4):
 * 1. خمسة مرشحين بنسب التوافق، المهارات المثبتة بالأدلة، والمهارات المدّعاة بلا دليل.
 * 2. زر مقارنة بصمتي مرشحين للانتقال إلى شاشة المقارنة.
 * 3. زر "لماذا؟" للانتقال إلى شاشة تحليل أسباب ترتيب المرشح.
 * 4. زر "ادعُه" لفتح نافذة الدعوة المباشرة للمشروع.
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import { InviteModal } from '../../components/modals/InviteModal'
import styles from './CandidatesPage.module.css'

interface CandidateData {
  id: string
  name: string
  title: string
  score: number
  status: 'ready' | 'near' | 'far'
  statusLabel: string
  proven: [string, number][]
  claimed: string[]
  isLead?: boolean
}

const CANDIDATES_DATA: CandidateData[] = [
  {
    id: 'lina',
    name: 'لينا الحربي',
    title: 'مهندسة بيانات · الرياض',
    score: 84,
    status: 'ready',
    statusLabel: 'جاهز الآن',
    proven: [
      ['Backend', 5],
      ['Database', 9],
      ['APIs', 4],
    ],
    claimed: [],
  },
  {
    id: 'mohammed',
    name: 'محمد الدوسري',
    title: 'مهندس Backend · جدة',
    score: 81,
    status: 'near',
    statusLabel: 'قريب — فجوة واحدة',
    proven: [
      ['Backend', 7],
      ['Node.js', 6],
    ],
    claimed: ['Mobile'],
  },
  {
    id: 'majid',
    name: 'ماجد الشمري',
    title: 'مهندس Backend · الدمام',
    score: 78,
    status: 'near',
    statusLabel: 'قريب — فجوة واحدة',
    proven: [
      ['Node.js', 5],
      ['REST APIs', 4],
    ],
    claimed: ['تصميم قواعد البيانات'],
    isLead: true,
  },
  {
    id: 'reem',
    name: 'ريم القحطاني',
    title: 'مطوّرة موبايل · الرياض',
    score: 66,
    status: 'far',
    statusLabel: 'يحتاج مسارًا',
    proven: [['Flutter', 6]],
    claimed: ['Backend', 'Database'],
  },
  {
    id: 'sara',
    name: 'سارة العتيبي',
    title: 'مطوّرة برمجيات · الخبر',
    score: 58,
    status: 'far',
    statusLabel: 'يحتاج مسارًا',
    proven: [['Python', 5]],
    claimed: ['Backend', 'Mobile'],
  },
]

export function CandidatesPage() {
  const navigate = useNavigate()
  const [activeInviteCand, setActiveInviteCand] = useState<CandidateData | null>(null)

  const handleOpenInvite = (c: CandidateData) => {
    setActiveInviteCand(c)
  }

  const handleWhyClick = (c: CandidateData) => {
    navigate(`/candidates/${c.id}`)
  }

  return (
    <section className={`screen wrap ${styles.candsPage}`} id="s4" dir="rtl">
      <div className={styles.crumb}>
        <button className={styles.back} onClick={() => navigate(ROUTES.RESULT)}>
          → رجوع للنتيجة
        </button>
        <span>امتداد · ابنِ فريقك</span>
      </div>

      <h1 className={styles.scrt}>خمسة أشخاص، مرتّبون بالدليل</h1>
      <p className={styles.scrp}>
        الترتيب مبني على أدلة قابلة للفحص — لا على سيرة ذاتية.
      </p>

      <div className="row" style={{ marginTop: '1.2rem', gap: '1rem', alignItems: 'center' }}>
        <button
          className="btn ghost"
          onClick={() => navigate(ROUTES.COMPARE)}
          id="toCompareBtn"
        >
          قارن بصمتَي مرشّحين
        </button>
        <span className="note">لترى من يكمّل من، بدل من يسبق من.</span>
      </div>

      <div className={styles.cands} id="candList" style={{ marginTop: '1.2rem' }}>
        {CANDIDATES_DATA.map((c, idx) => (
          <div
            key={c.id}
            className={`${styles.cand} ${c.isLead ? styles.lead : ''}`}
            data-candidate-id={c.id}
          >
            <span className={styles.rk}>{String(idx + 1).padStart(2, '0')}</span>
            <span className={styles.av}>{c.name.charAt(0)}</span>
            <span className={styles.who}>
              <h3>{c.name}</h3>
              <p>{c.title}</p>
            </span>

            <span className={styles.chips}>
              {c.proven.map(([skill, count]) => (
                <span key={skill} className={`${styles.chip} ${styles.proven}`}>
                  <span>{skill}</span>
                  <span className={styles.c}>{count}</span>
                </span>
              ))}
              {c.claimed.map((skill) => (
                <span key={skill} className={`${styles.chip} ${styles.claimed}`}>
                  <span className={styles.g} />
                  <span>{skill}</span>
                </span>
              ))}
            </span>

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

            <button
              className={styles.whybtn}
              onClick={() => handleWhyClick(c)}
              id={`whyBtn-${c.id}`}
            >
              لماذا؟
            </button>

            <button
              className={styles.cinv}
              onClick={() => handleOpenInvite(c)}
              id={`inviteBtn-${c.id}`}
            >
              ادعُه
            </button>
          </div>
        ))}
      </div>

      {activeInviteCand && (
        <InviteModal
          isOpen={!!activeInviteCand}
          name={activeInviteCand.name}
          roleMeta={activeInviteCand.title}
          skill="Backend"
          onClose={() => setActiveInviteCand(null)}
        />
      )}
    </section>
  )
}

export default CandidatesPage
