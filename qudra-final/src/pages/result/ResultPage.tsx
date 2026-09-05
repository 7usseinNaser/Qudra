/**
 * ResultPage — نتيجتك وخريطة تغطية المشروع (الخطوة 6 من 6).
 *
 * مطابقة حرفية لـ prototype.html (#fin):
 * 1. تفاصيل المشكلة المكتوبة والقدرات المطلوبة المستخرجة منها.
 * 2. نسبة التغطية الكلية (65%) وتفصيل درجات كل مهارة مع إبراز الفجوات.
 * 3. ما ينقص المشروع لإكماله: إنسان (مطوّر Backend) + أداة ذكاء اصطناعي (AI Tool).
 * 4. تكوين الفريق الحالي وتوزيع التغطية لكل قدرة (أنت، الفريق، بلا تغطية).
 * 5. حلقة الأثر الأربعة (مشكلة ← قدرة ← دليل ← أثر).
 * 6. زر "ابنِ فريقك" للانتقال لقائمة المرشحين وزر "ابدأ من مشكلة جديدة".
 */

import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import { useProblem } from '../../contexts/ProblemContext'
import { useRole } from '../../contexts/RoleContext'
import styles from './ResultPage.module.css'

interface MatchRow {
  name: string
  score: number
  isGap?: boolean
}

const MATCH_ROWS: MatchRow[] = [
  { name: 'Problem Solving', score: 88 },
  { name: 'UI/UX', score: 85 },
  { name: 'Product Thinking', score: 78 },
  { name: 'Mobile Development', score: 70 },
  { name: 'Backend', score: 40, isGap: true },
]

export function ResultPage() {
  const navigate = useNavigate()
  const { problemText, setProblemText } = useProblem()
  const { user } = useRole()

  const handleRestart = () => {
    setProblemText('')
    navigate(ROUTES.PROBLEM)
  }

  const problemSummary =
    problemText.trim() || 'إدارة معلومات طلاب الجامعة — المواد والمواعيد.'

  return (
    <section className={`screen wrap ${styles.resultPage}`} id="fin" dir="rtl">
      <span className={styles.stepno}>الخطوة 6 من 6</span>
      <h1 className={styles.scrt}>نتيجتك</h1>
      <p className={styles.scrp}>
        من مشكلة مكتوبة قبل دقائق، إلى قدرات مثبتة وخطة إكمال.
      </p>

      {/* شبكة النتيجة والمطابقة */}
      <div className={styles.fingrid} style={{ marginTop: '1.5rem' }}>
        {/* صندوق المشكلة والقدرات المطلوبة */}
        <div className="box">
          <span className={styles.lbl}>المشكلة</span>
          <p className={styles.sumtxt}>{problemSummary}</p>
          <div className={styles.hr} />
          <span className={styles.lbl}>القدرات المطلوبة</span>
          <div className={styles.reqlist} id="reqCheck" style={{ marginTop: '0.6rem' }}>
            <div>
              <span className={styles.vtick} />
              <span>Problem Solving</span>
            </div>
            <div>
              <span className={styles.vtick} />
              <span>UI/UX</span>
            </div>
            <div>
              <span className={styles.vtick} />
              <span>Product Thinking</span>
            </div>
          </div>
        </div>

        {/* صندوق التغطية والنسب */}
        <div className={`box ${styles.matchbox}`}>
          <div className={styles.mtop}>
            <span className={styles.lbl}>تغطيتك للمشروع</span>
            <span className={`${styles.mpct} num`} id="mPct">
              65%
            </span>
          </div>
          <div id="matchRows" style={{ marginTop: '0.9rem' }}>
            {MATCH_ROWS.map((m) => (
              <div
                key={m.name}
                className={`${styles.mrow} ${m.isGap ? styles.gap : ''}`}
              >
                <span>{m.name}</span>
                <span className={styles.mt}>
                  <i style={{ width: `${m.score}%` }} />
                </span>
                <span className={styles.mv}>{m.score}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* صندوق ما ينقص المشروع */}
      <div className={`box ${styles.needbox}`} style={{ marginTop: '1rem' }}>
        <h3>لإكمال المشروع، تحتاج</h3>
        <p className="note" style={{ marginBottom: '1rem' }}>
          قدرتان تحت العتبة. الأولى يسدّها إنسان، والثانية تقدر تسدّها أداة.
        </p>
        <div className={styles.needs}>
          <div className={styles.need}>
            <span className={`${styles.ni} ${styles.nihuman}`}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </span>
            <div>
              <h4>مطوّر Backend</h4>
              <p>
                تغطيتك <span className="num">40%</span> — أقل من عتبة التنفيذ. هذه القدرة تحتاج شخصًا يثبتها.
              </p>
            </div>
            <button
              className={styles.whybtn}
              onClick={() => navigate(ROUTES.CANDIDATES)}
              id="toCandidatesBtn"
            >
              اعرض من يثبتها
            </button>
          </div>

          <div className={styles.need}>
            <span className={`${styles.ni} ${styles.niai}`}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="4" y="7" width="16" height="13" rx="2" />
                <path d="M9 3v4M15 3v4M9 13h.01M15 13h.01" />
              </svg>
            </span>
            <div>
              <h4>أداة AI لبناء قاعدة البيانات</h4>
              <p>مهمة متكررة ومحدودة النطاق — لا تحتاج شخصًا كامل الوقت.</p>
            </div>
            <span className="pill far" style={{ marginInlineStart: 'auto' }}>
              مقترح
            </span>
          </div>
        </div>
      </div>

      {/* صندوق الفريق الحالي وتغطية القدرات */}
      <div className={`box ${styles.teambox}`}>
        <div className={styles.secrow}>
          <h2>فريقك</h2>
          <span className="note" id="teamCount">
            أنت فقط حتى الآن
          </span>
        </div>

        <div id="teamList" style={{ marginTop: '0.6rem' }}>
          <div className={styles.tmember}>
            <span className={styles.av}>
              {user.avatar || 'أ'}
            </span>
            <div className={styles.info}>
              <h4>{user.name || 'أحمد السعيد'} (أنت)</h4>
              <p>صاحب المشكلة · يغطّي 65% من الاحتياج</p>
            </div>
          </div>
        </div>

        <div className={styles.hr} />
        <div className={styles.secrow}>
          <h3 style={{ fontSize: '1rem', margin: 0 }}>تغطية المشروع</h3>
          <span className="note">من يغطّي ماذا</span>
        </div>

        <div className={styles.cov} id="covMap" style={{ marginTop: '0.9rem' }}>
          {MATCH_ROWS.map((row) => (
            <div
              key={row.name}
              className={`${styles.cvr} ${row.isGap ? styles.hole : ''}`}
            >
              <span className={styles.cvn}>{row.name}</span>
              <span className={styles.cvb}>
                <i className={styles.c1} style={{ width: `${row.score}%` }} />
              </span>
              <span className={styles.cvv}>{row.score}%</span>
            </div>
          ))}
        </div>

        <div className={styles.covkey}>
          <span>
            <i className={styles.k1} />
            أنت
          </span>
          <span>
            <i className={styles.k2} />
            الفريق
          </span>
          <span>
            <i className={styles.k3} />
            بلا تغطية
          </span>
        </div>
      </div>

      {/* صندوق حلقة الأثر */}
      <div className={`box ${styles.loopbox}`}>
        <div className={styles.loop4}>
          <div>
            <span>01</span>
            <h3>مشكلة</h3>
            <p>كتبتها بلغتك، بلا مسمّى وظيفي.</p>
          </div>
          <div>
            <span>02</span>
            <h3>قدرة</h3>
            <p>استُخرجت من نصّك، لا من قائمة جاهزة.</p>
          </div>
          <div>
            <span>03</span>
            <h3>دليل</h3>
            <p>حلّيت مهمة حقيقية، فصار عندك إثبات.</p>
          </div>
          <div>
            <span>04</span>
            <h3>أثر</h3>
            <p>نتيجة المشروع تعود دليلًا في المطابقة القادمة.</p>
          </div>
        </div>
      </div>

      <div className="row" style={{ marginTop: '1.4rem' }}>
        <button
          className="btn"
          onClick={() => navigate(ROUTES.CANDIDATES)}
          id="buildTeamBtn"
        >
          ابنِ فريقك
        </button>
        <button
          className="btn ghost"
          onClick={handleRestart}
          id="newProblemBtn"
        >
          ابدأ من مشكلة جديدة
        </button>
      </div>
    </section>
  )
}

export default ResultPage
