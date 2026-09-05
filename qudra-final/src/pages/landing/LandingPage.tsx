/**
 * LandingPage — الصفحة الرئيسية لمنصة قُدرة.
 *
 * أُعيد بناؤها مطابقة 100% لـ prototype.html وفقاً لقواعد المشروع:
 * 1. شاشة البداية (Hero): شعار قُدرة الأصلي المعتمد، الشعار اللفظي، وأزرار الانطلاق والتمرير.
 * 2. المُقارِن التفاعلي (Claim vs Evidence): بطاقة ماجد الشمري مع السلايدر التفاعلي
 *    الذي يحوّل المهارات ديناميكياً من ادّعاء باهت بلا مصدر إلى مهارات مُثبتة مدعومة بأدلة.
 * 3. خطوات قُدرة الثلاث (صِف، أثبت، طابِق) مع دعوة إنشاء الحساب.
 *
 * راجع PROJECT_MAP.md → src/pages/landing/LandingPage.tsx للتفاصيل المعمارية الكاملة.
 */

import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import { useTheme } from '../../contexts/ThemeContext'
import styles from './LandingPage.module.css'

interface ClaimItem {
  name: string
  evidenceCount: number
  source: string
}

const CLAIMS: ClaimItem[] = [
  { name: 'UI/UX', evidenceCount: 3, source: 'محاكاة · مشروع' },
  { name: 'Product Thinking', evidenceCount: 2, source: 'محاكاة' },
  { name: 'React', evidenceCount: 0, source: '' },
  { name: 'Node.js', evidenceCount: 0, source: '' },
  { name: 'Kubernetes', evidenceCount: 0, source: '' },
  { name: 'Machine Learning', evidenceCount: 0, source: '' },
]

export function LandingPage() {
  const { theme, toggleTheme } = useTheme()
  const [sliderVal, setSliderVal] = useState<number>(0)

  // التمرير السلس إلى قسم المُقارِن
  const scrollToDemo = useCallback(() => {
    const sec = document.getElementById('demoSec')
    if (sec) {
      sec.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  // الحسابات التفاعلية للسلايدر (0 إلى 1) مطابقة لـ prototype.html
  const k = sliderVal / 100

  // العناوين والنصوص الديناميكية حسب قيمة السلايدر
  let title = 'هذا ما يقوله عن نفسه.'
  let verdict = 'ستّ مهارات مكتوبة بيده. كلها متساوية، وكلها بلا مصدر.'

  if (k >= 0.7) {
    title = 'اثنتان فقط عليهما دليل.'
    verdict = 'الأربع الباقية لم تُلغَ — صارت مسارًا: تعلّم ← تدرّب ← أثبت ← أعد المطابقة.'
  } else if (k >= 0.3) {
    title = 'الآن نسأل: أين الدليل؟'
    verdict = 'أربع منها بدأت تفقد وزنها — لا يوجد ما يسندها.'
  }

  const isProofState = k > 0.55
  const isSliderDone = k > 0.55
  const isSliderStart = k < 0.3

  return (
    <div className={styles.cover} dir="rtl">
      {/* زر تبديل المظهر العلوي */}
      <button
        className={styles.themeToggleBtn}
        onClick={toggleTheme}
        aria-label="تبديل المظهر"
        title="تبديل المظهر"
      >
        <span>{theme === 'dark' ? '☀' : '☾'}</span>
        <span>{theme === 'dark' ? 'الوضع الفاتح' : 'الوضع الداكن'}</span>
      </button>

      {/* ═══ 1. شاشة البداية (Hero) ═══ */}
      <section className={styles.chero}>
        <span className={styles.glow} aria-hidden="true" />
        <span className={styles.glow2} aria-hidden="true" />
        <img
          src={theme === 'dark' ? '/assets/qudra-mark-dark.svg' : '/assets/qudra-mark.svg'}
          alt=""
          className={styles.markBg}
          aria-hidden="true"
        />

        <div className={styles.mid}>
          {/* كلمة قُدرة بالخط العربي المعتمد الأصلي */}
          <img
            src={theme === 'dark' ? '/assets/qudra-wordmark-dark.webp' : '/assets/qudra-wordmark.webp'}
            alt="قُدرة"
            className={styles.wordmark}
            width={380}
            height={170}
          />
          <p className={styles.slogan}>
            من الكلام إلى <b>الدليل</b>
          </p>
          <span className={styles.rule} aria-hidden="true" />
        </div>

        <div className={styles.bottom}>
          <Link to={ROUTES.SIGNUP} className={styles.startBtn}>
            <span>ابدأ الآن</span>
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M19 12H5" />
              <path d="m12 19-7-7 7-7" />
            </svg>
          </Link>

          <button className={styles.scrollcue} onClick={scrollToDemo}>
            <span>جرّبها قبل ما تسجّل</span>
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 5v14" />
              <path d="m5 12 7 7 7-7" />
            </svg>
          </button>
        </div>
      </section>

      {/* ═══ 2. المُقارِن: ادّعاء ← دليل ═══ */}
      <section className={styles.demosec} id="demoSec">
        <div className={styles.dwrap}>
          <span className={styles.eyebrow}>Claim vs Evidence</span>
          <h2 className={styles.dtitle}>{title}</h2>
          <p className={styles.dsub}>
            اسحب المقبض ببطء — وشوف كم واحدة منها فيها دليل فعلًا.
          </p>

          <div className={styles.dcard}>
            <div className={styles.dpers}>
              <span className={styles.dav}>ع</span>
              <div className={styles.dpersInfo}>
                <h3>ماجد الشمري</h3>
                <p className="mono">مهندس برمجيات</p>
              </div>
              <span className={`${styles.dstate} ${isProofState ? styles.proof : ''}`}>
                {isProofState ? 'ملف قُدرة' : 'سيرة ذاتية'}
              </span>
            </div>

            {/* شبكة وسوم المهارات التفاعلية */}
            <div className={styles.dchips}>
              {CLAIMS.map((claim) => {
                const isProven = claim.evidenceCount > 0

                if (isProven) {
                  const isGrounded = k > 0.5
                  return (
                    <span
                      key={claim.name}
                      className={`${styles.dchip} ${isGrounded ? styles.grounded : ''}`}
                      style={{
                        borderColor: isGrounded ? 'var(--accent-fill)' : 'var(--line-2)',
                        background: isGrounded ? 'var(--accent-soft)' : 'var(--card)',
                        color: isGrounded ? 'var(--accent)' : 'var(--ink-2)',
                        opacity: 1,
                      }}
                    >
                      <span>{claim.name}</span>
                      <span
                        className={styles.cnt}
                        style={{
                          opacity: k > 0.55 ? 1 : 0,
                          transform: k > 0.55 ? 'scale(1)' : 'scale(0.5)',
                        }}
                      >
                        {claim.evidenceCount}
                      </span>
                      <span
                        className={styles.src}
                        style={{
                          opacity: k > 0.75 ? 1 : 0,
                          maxWidth: k > 0.75 ? '11rem' : '0',
                        }}
                      >
                        {claim.source}
                      </span>
                    </span>
                  )
                }

                // الادّعاءات غير المثبتة
                const isFloaty = k > 0.5
                return (
                  <span
                    key={claim.name}
                    className={`${styles.dchip} ${isFloaty ? styles.floaty : ''}`}
                    style={{
                      opacity: Number((1 - k * 0.62).toFixed(2)),
                      borderStyle: k > 0.35 ? 'dashed' : 'solid',
                      borderColor: 'var(--line-2)',
                      background: 'transparent',
                      color: 'var(--ink-3)',
                      transform: k > 0.35 ? 'scale(0.94)' : 'scale(1)',
                    }}
                  >
                    <span>{claim.name}</span>
                    <span
                      className={styles.no}
                      style={{
                        opacity: k > 0.6 ? 1 : 0,
                        maxWidth: k > 0.6 ? '6rem' : '0',
                      }}
                    >
                      بلا دليل
                    </span>
                  </span>
                )
              })}
            </div>

            {/* شريط السحب التفاعلي من الادّعاء إلى الدليل */}
            <div
              className={`${styles.dslider} ${isSliderDone ? styles.done : ''} ${isSliderStart ? styles.start : ''}`}
            >
              <span className={`${styles.dlabel} ${styles.claim}`}>ادّعاء</span>
              <input
                type="range"
                className={styles.dRange}
                min={0}
                max={100}
                value={sliderVal}
                onChange={(e) => setSliderVal(Number(e.target.value))}
                aria-label="من الادّعاء إلى الدليل"
              />
              <span className={`${styles.dlabel} ${styles.proof}`}>دليل</span>
            </div>

            <p className={styles.dverdict}>{verdict}</p>
          </div>

          <p className={styles.dnote}>
            لا نلغي أحدًا — نفصل ما أُثبت عمّا لم يُثبت بعد، ونعطي الباقي طريقًا لإثباته.
          </p>
        </div>
      </section>

      {/* ═══ 3. ثلاث خطوات ═══ */}
      <section className={styles.stepsec}>
        <div className={styles.dwrap}>
          <div className={styles.s3}>
            <div className={styles.s3c}>
              <span className={styles.s3n}>01</span>
              <h3>صِف</h3>
              <p>اكتب مشكلتك بلغتك العادية. بلا مسمّى وظيفي، وبلا قائمة مهارات.</p>
            </div>
            <div className={styles.s3c}>
              <span className={styles.s3n}>02</span>
              <h3>أثبت</h3>
              <p>قُدرة تولّد لك مهمة حقيقية من مشكلتك أنت، وتحلّها الآن.</p>
            </div>
            <div className={styles.s3c}>
              <span className={styles.s3n}>03</span>
              <h3>طابِق</h3>
              <p>نتيجتك تصير قدرات موثّقة، ونقول لك بالضبط ما ينقصك ومن يغطّيه.</p>
            </div>
          </div>

          <div className={styles.cend}>
            <h2>ابدأ بمشكلة واحدة.</h2>
            <Link to={ROUTES.SIGNUP} className={styles.startBtn}>
              <span>أنشئ حسابك</span>
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M19 12H5" />
                <path d="m12 19-7-7 7-7" />
              </svg>
            </Link>
            <span className={styles.sub}>مجاني · بلا بطاقة</span>
          </div>
        </div>
      </section>
    </div>
  )
}
