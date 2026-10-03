/**
 * GradingOverlay — نافذة تقييم الإجابات (شاشة كاملة).
 *
 * مطابق لـ #grading في prototype.html:3203-3215.
 * تعرض حلقة دوّارة + 4 خطوات تضيء تباعاً:
 *   1) قراءة الإجابات الثلاث
 *   2) مقارنة بمعايير كل مهمة
 *   3) استخراج نقاط القوة والضعف
 *   4) احتساب الدرجة
 *
 * راجع PROJECT_MAP.md → src/components/overlays/GradingOverlay.tsx
 */

import { useEffect, useState } from 'react'
import { useFocusTrap } from '../../hooks'
import styles from './GradingOverlay.module.css'

const STEPS = [
  'قراءة الإجابات الثلاث',
  'مقارنة بمعايير كل مهمة',
  'استخراج نقاط القوة والضعف',
  'احتساب الدرجة',
]

interface GradingOverlayProps {
  open: boolean
  /** يستدعى عند انتهاء التقييم */
  onComplete?: () => void
}

export function GradingOverlay({ open, onComplete }: GradingOverlayProps) {
  const [activeStep, setActiveStep] = useState(0)
  const containerRef = useFocusTrap<HTMLDivElement>({ active: open })

  useEffect(() => {
    if (!open) {
      setActiveStep(0)
      return
    }
    const timers: ReturnType<typeof setTimeout>[] = []
    STEPS.forEach((_, i) => {
      timers.push(setTimeout(() => setActiveStep(i + 1), (i + 1) * 700))
    })
    timers.push(setTimeout(() => onComplete?.(), STEPS.length * 700 + 500))
    return () => timers.forEach(clearTimeout)
  }, [open, onComplete])

  if (!open) return null

  return (
    <div className={styles.grading} ref={containerRef} dir="rtl" role="dialog" aria-modal="true" aria-label="جارٍ التقييم">
      <div className={styles.inner}>
        <span className={styles.ring} aria-hidden="true" />
        <h3>جارٍ تقييم إجاباتك</h3>
        <p>نقارن كل إجابة بمعايير المهمة — لا بإجابة نموذجية.</p>
        <div className={styles.steps}>
          {STEPS.map((label, i) => (
            <div key={label} className={`${styles.step} ${i < activeStep ? styles.done : ''}`}>
              <span className={styles.tick} aria-hidden="true" />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
