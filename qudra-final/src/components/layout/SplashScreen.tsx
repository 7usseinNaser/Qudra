/**
 * SplashScreen — شاشة الإقلاع الافتتاحية لمنصة قُدرة.
 *
 * منقولة حرفياً من prototype.html (الأسطر 1796–1804 و 5152–5160):
 * - الهالة الضوئية والتوهج التزامني (Halo).
 * - رمز قُدرة وشعار قُدرة الخطي المعتمد.
 * - الشعار اللفظي المعتمد «من الكلام إلى الدليل».
 * - شريط التقدم المتحرك (Loading Bar).
 * - السلوك الزمني: 2750ms تلقائياً أو عند النقر المباشر للتخطي،
 *   مع مراعاة prefers-reduced-motion وتخزين حالة العرض في الجلسة.
 *
 * راجع PROJECT_MAP.md → src/components/layout/SplashScreen.tsx للتفاصيل الكاملة.
 */

import { useState, useEffect, useCallback } from 'react'
import styles from './SplashScreen.module.css'

export function SplashScreen() {
  const [shouldRender, setShouldRender] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    // معطّل مؤقتاً لأغراض الاختبار في B0 — يُعاد تفعيله قبل الإطلاق النهائي، راجع DECISIONS.md
    // const alreadyShown = sessionStorage.getItem('qudra_splash_dismissed') === 'true'
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // return !alreadyShown && !reduceMotion
    return !reduceMotion
  })

  const [isLit, setIsLit] = useState<boolean>(false)
  const [isGone, setIsGone] = useState<boolean>(false)

  const dismiss = useCallback(() => {
    setIsGone(true)
    // معطّل مؤقتاً لأغراض الاختبار في B0 — يُعاد تفعيله قبل الإطلاق النهائي، راجع DECISIONS.md
    // sessionStorage.setItem('qudra_splash_dismissed', 'true')
    // إزالة المكون من DOM نهائياً بعد انتهاء تأثير التلاشي (0.55s)
    setTimeout(() => {
      setShouldRender(false)
    }, 600)
  }, [])

  useEffect(() => {
    if (!shouldRender) return

    // تفعيل فئة lit لبدء حركات الهالة
    const litTimer = setTimeout(() => {
      setIsLit(true)
    }, 50)

    // المؤقت الزمني الحرفي من prototype.html: 2750 مللي ثانية
    const autoDismissTimer = setTimeout(() => {
      dismiss()
    }, 2750)

    return () => {
      clearTimeout(litTimer)
      clearTimeout(autoDismissTimer)
    }
  }, [shouldRender, dismiss])

  if (!shouldRender) return null

  return (
    <div
      className={`${styles.splash} ${isLit ? styles.lit : ''} ${isGone ? styles.gone : ''}`}
      dir="rtl"
      role="status"
      aria-label="جارٍ التشغيل"
      onClick={dismiss}
    >
      <div className={styles.spIn}>
        <span className={styles.spHalo} aria-hidden="true" />
        <img
          src="/assets/qudra-mark-dark.svg"
          alt=""
          className={styles.spMark}
          aria-hidden="true"
          width={96}
          height={96}
        />
        <img
          src="/assets/qudra-wordmark-dark.webp"
          alt="قُدرة"
          className={styles.spLock}
          width={240}
          height={107}
        />
        <span className={styles.spTag}>
          من الكلام إلى <b>الدليل</b>
        </span>
        <span className={styles.spBar} aria-hidden="true">
          <i />
        </span>
      </div>
    </div>
  )
}
export default SplashScreen
