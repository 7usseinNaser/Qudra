/**
 * EvaluationPage — شاشة تقييم إجابات المحاكاة.
 *
 * منقولة حرفياً من prototype.html (الأسطر 2190–2240 والأسطر 27650–30850):
 * - الدائرة المزدوجة SVG Donut (نصف القطر r=86، المحيط C=540.4، مع أنيميشن الإزاحة وتصاعد الرقم).
 * - OVERALL = 85 من البيانات المعيارية، مع تاريخ التقييم 2026-08-29.
 * - المعايير الأربعة مع قاعدة اللون البرتقالي الحرفية للأقل من 80 (بنية الحل 75%).
 * - نقاط القوة الثلاث ونقطتا الضعف الحرفية.
 * - تفصيل الإجابات الثلاث الحقيقية للمستخدم من simulationAnswers مع شرط الـ 190 حرفاً.
 * - زر "حوّل النتيجة إلى قدرات مثبتة" مع تنبيه قريباً (B0.3.6) لمنع Dead UI (القرار 008 في DECISIONS.md).
 *
 * راجع PROJECT_MAP.md للتفاصيل الكاملة.
 */

import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import { useProblem } from '../../contexts/ProblemContext'
import styles from './EvaluationPage.module.css'

export interface CriterionItem {
  name: string
  score: number
}

const CRITERIA_DATA: CriterionItem[] = [
  { name: 'فهم المشكلة', score: 85 },
  { name: 'تجربة المستخدم', score: 90 },
  { name: 'بنية الحل', score: 75 },
  { name: 'المنطق والتبرير', score: 88 },
]

const OVERALL_SCORE = 85
const CIRCUMFERENCE = 540.4

const STRENGTHS_DATA = [
  'رتّبت المهام حسب قيمتها للطالب، لا حسب سهولتها التقنية.',
  'ربطت كل عنصر في الواجهة بسبب من المشكلة نفسها.',
  'حددت نطاقًا واقعيًا لأول نسخة بدل محاولة تغطية كل شيء.',
]

const WEAKNESSES_DATA = [
  'لم تتناول حالة انقطاع الاتصال — والطالب يستخدم التطبيق داخل الحرم غالبًا.',
  'بنية البيانات لم توضّح كيف يُعالَج تغيّر الجدول بعد بدء الفصل.',
]

const TASK_META = [
  {
    skill: 'Product Thinking',
    question: 'ما أول شيء ستبنيه، ولماذا؟',
    score: 88,
  },
  {
    skill: 'UI/UX',
    question: 'صف الشاشة الرئيسية للطالب: ماذا تعرض، وبأي ترتيب، ولماذا؟',
    score: 90,
  },
  {
    skill: 'Backend',
    question: 'ما البيانات التي ستخزّنها، وكيف تربط الطالب بمواده ومواعيدها؟',
    score: 76,
  },
]

export function EvaluationPage() {
  const { simulationAnswers } = useProblem()

  // حالة الرسوم المتحركة
  const [animatedScore, setAnimatedScore] = useState<number>(0)
  const [barsLoaded, setBarsLoaded] = useState<boolean>(false)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReduced) {
      setAnimatedScore(OVERALL_SCORE)
      setBarsLoaded(true)
      return
    }

    // تفعيل شريط التقدم والدائرة بعد 60ms كما في prototype.html
    const tBars = setTimeout(() => {
      setBarsLoaded(true)
    }, 60)

    // أنيميشن تصاعد الرقم من 0 إلى 85 خلال 900ms بمعادلة 1 - (1 - t)^3
    const startTime = performance.now()
    const duration = 900

    let animId: number
    const tick = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = Math.round(OVERALL_SCORE * eased)
      setAnimatedScore(current)

      if (progress < 1) {
        animId = requestAnimationFrame(tick)
      }
    }

    animId = requestAnimationFrame(tick)

    return () => {
      clearTimeout(tBars)
      cancelAnimationFrame(animId)
    }
  }, [])

  // حساب dashoffset للدائرة بناءً على حالة التحميل
  const dashOffset = useMemo(() => {
    if (!barsLoaded) return CIRCUMFERENCE
    return (CIRCUMFERENCE - (CIRCUMFERENCE * OVERALL_SCORE) / 100).toFixed(1)
  }, [barsLoaded])

  const navigate = useNavigate()

  const handleNextAction = () => {
    navigate(ROUTES.SKILL_DNA)
  }

  return (
    <main className={styles.evScreen} dir="rtl">
      <div className="narrow wide">
        <span className={styles.stepno}>الخطوة 4 من 6</span>
        <h1 className={styles.scrT}>تقييم إجاباتك</h1>
        <p className={styles.scrP}>لا درجة مجرّدة — أربعة معايير، وكل واحد مكتوب سببه.</p>

        {/* ═══ شبكة التقييم: الدونت + المعايير ═══ */}
        <div className={styles.evgrid}>
          {/* كرت الدرجة الكلية والدائرة */}
          <div className={`${styles.box} ${styles.evscore}`}>
            <div className={styles.dual}>
              <svg viewBox="0 0 200 200" role="img" aria-label={`التقييم العام ${OVERALL_SCORE} من 100`}>
                <circle
                  cx="100"
                  cy="100"
                  r="86"
                  fill="none"
                  stroke="var(--soft)"
                  strokeWidth="14"
                />
                <circle
                  id="evArc"
                  cx="100"
                  cy="100"
                  r="86"
                  fill="none"
                  stroke="var(--accent-fill)"
                  strokeWidth="14"
                  strokeLinecap="round"
                  strokeDasharray={CIRCUMFERENCE}
                  strokeDashoffset={dashOffset}
                />
              </svg>
              <div className={styles.dualc}>
                <span className={`${styles.big} num`} id="evBig">
                  {animatedScore}
                </span>
                <span className={styles.note}>من 100</span>
              </div>
            </div>
            <p className={styles.noteFoot}>
              تقييم آلي · <span className="mono">2026-08-29</span>
            </p>
          </div>

          {/* كرت المعايير الأربعة */}
          <div className={`${styles.box} ${styles.criteriaBox}`}>
            <h3>المعايير</h3>
            <div id="criteria">
              {CRITERIA_DATA.map((c, i) => {
                const isLow = c.score < 80
                const widthVal = barsLoaded ? `${c.score}%` : '0%'
                return (
                  <div
                    key={i}
                    className={`${styles.crit} ${isLow ? styles.low : ''}`}
                  >
                    <div className={styles.l}>
                      <span>{c.name}</span>
                      <b>{c.score}</b>
                    </div>
                    <div className={styles.t}>
                      <i style={{ width: widthVal }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* ═══ نقاط القوة وما يحتاج تقوية ═══ */}
        <div className={styles.split}>
          <div className={styles.box}>
            <h3 className={`${styles.swh} ${styles.good}`}>نقاط القوة</h3>
            <ul className={styles.slist} id="strengths">
              {STRENGTHS_DATA.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          <div className={styles.box}>
            <h3 className={`${styles.swh} ${styles.weak}`}>ما يحتاج تقوية</h3>
            <ul className={styles.slist} id="weaknesses">
              {WEAKNESSES_DATA.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* ═══ تفصيل الإجابات الثلاث مهمة بمهمة ═══ */}
        <div className={`${styles.box} ${styles.breakBox}`}>
          <div className={styles.secrow}>
            <h2>إجاباتك، مهمة بمهمة</h2>
            <span className={styles.note}>كل درجة مربوطة بما كتبته أنت</span>
          </div>

          <div id="taskBreak">
            {TASK_META.map((meta, i) => {
              const rawAnswer = (simulationAnswers[i] || '').trim()
              const hasAnswer = rawAnswer.length > 0
              const excerpt = hasAnswer
                ? rawAnswer.length > 190
                  ? rawAnswer.slice(0, 190) + '…'
                  : rawAnswer
                : 'لم تُكتب إجابة لهذه المهمة.'

              return (
                <div key={i} className={styles.tb} data-task-card="true">
                  <div className={styles.tbh}>
                    <span className={styles.tskill}>{meta.skill}</span>
                    <span className={styles.sc}>{meta.score}</span>
                  </div>
                  <p className={styles.tbq}>{meta.question}</p>
                  <p className={`${styles.tba} ${hasAnswer ? '' : styles.empty}`}>
                    {excerpt}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* ═══ زر نهاية الصفحة والانتقال لسجل القدرات ═══ */}
        <div className={styles.endActionRow}>
          <button
            className="btn dark"
            id="toDnaBtn"
            onClick={handleNextAction}
          >
            حوّل النتيجة إلى قدرات مثبتة
          </button>
        </div>
      </div>
    </main>
  )
}

export default EvaluationPage
