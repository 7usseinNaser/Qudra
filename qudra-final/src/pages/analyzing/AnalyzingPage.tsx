/**
 * AnalyzingPage — شاشة التحليل الآلي المرحلي (6 خطوات).
 *
 * مطابق لـ STAGES في prototype.html:3493-3500.
 * تعرض 6 مراحل تضيء تباعاً مع وصف فرعي لكل مرحلة:
 *   1) فهم المشكلة (0.4s)
 *   2) التصنيف (1.0s)
 *   3) النتيجة المطلوبة (1.9s)
 *   4) استخراج القدرات (3.4s)
 *   5) توليد المحاكاة (5.1s)
 *   6) تجهيز معايير التقييم (6.0s)
 *
 * راجع PROJECT_MAP.md → src/pages/analyzing/AnalyzingPage.tsx
 */

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './AnalyzingPage.module.css'

interface StageDetail {
  label: string
  detail: string
  delay: number
}

const STAGE_DETAILS: StageDetail[] = [
  { label: 'فهم المشكلة', detail: 'طلاب جامعة · معلومات موزّعة · مواد ومواعيد', delay: 400 },
  { label: 'التصنيف', detail: 'تعليم — إدارة معلومات، لا شبكة اجتماعية', delay: 600 },
  { label: 'النتيجة المطلوبة', detail: 'مكان واحد يجمع المواد والمواعيد للطالب', delay: 900 },
  { label: 'استخراج القدرات', detail: '5 قدرات: منها 3 أساسية و2 مساندة', delay: 1500 },
  { label: 'توليد المحاكاة', detail: '3 مهام مبنية على مشكلتك أنت', delay: 1700 },
  { label: 'تجهيز معايير التقييم', detail: '4 معايير لكل مهمة', delay: 900 },
]

interface AnalyzingPageProps {
  /** المسار الذي ينقل إليه بعد اكتمال التحليل */
  redirectTo?: string
  /** نص المشكلة المُدخل (يعرض في الأعلى) */
  problemText?: string
}

export function AnalyzingPage({
  redirectTo = '/capabilities',
  problemText = 'تطبيق يساعد طلاب الجامعة على إيجاد موادهم ومواعيدهم بسهولة',
}: AnalyzingPageProps) {
  const navigate = useNavigate()
  const [activeStage, setActiveStage] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let cumulative = 0
    const timers: ReturnType<typeof setTimeout>[] = []

    STAGE_DETAILS.forEach((stage, i) => {
      cumulative += stage.delay
      timers.push(
        setTimeout(() => {
          setActiveStage(i + 1)
          setProgress(((i + 1) / STAGE_DETAILS.length) * 100)
        }, cumulative)
      )
    })

    const totalDelay = cumulative + 400
    timers.push(setTimeout(() => navigate(redirectTo), totalDelay))

    return () => timers.forEach(clearTimeout)
  }, [navigate, redirectTo])

  return (
    <div className={styles.page} dir="rtl">
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.spinner} aria-hidden="true" />
          <h1>قُدرة تحلّل مشكلتك</h1>
          <p className={styles.problemText}>{problemText}</p>
        </div>

        <div className={styles.progressTrack}>
          <div className={styles.progressBar} style={{ width: `${progress}%` }} />
        </div>

        <div className={styles.stages}>
          {STAGE_DETAILS.map((stage, i) => {
            const isActive = i < activeStage
            const isCurrent = i === activeStage
            return (
              <div
                key={stage.label}
                className={`${styles.stage} ${isActive ? styles.done : ''} ${isCurrent ? styles.current : ''}`}
              >
                <div className={styles.stageIcon}>
                  {isActive ? (
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : isCurrent ? (
                    <span className={styles.pulse} aria-hidden="true" />
                  ) : (
                    <span className={styles.pending}>{i + 1}</span>
                  )}
                </div>
                <div className={styles.stageContent}>
                  <h3>{stage.label}</h3>
                  <p>{stage.detail}</p>
                </div>
              </div>
            )
          })}
        </div>

        <p className={styles.hint}>لا تغلق الصفحة — التحليل آلي ولا يحتاج تدخّلك.</p>
      </div>
    </div>
  )
}
