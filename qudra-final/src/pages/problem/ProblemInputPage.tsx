/**
 * ProblemInputPage — الشاشة الأولى في تدفق صاحب المشكلة.
 *
 * أُعيد بناؤها مطابقة 100% لـ prototype.html (الأسطر 1990–2050 و 292160–293500):
 * - إدخال وصف المشكلة بلغة طبيعية مع عداد أحرف حي وتحديث state.
 * - أزرار الأمثلة السريعة الثلاثة: تطبيق جامعي، تحليل مكالمات، متجر إلكتروني.
 * - التحقق: إذا كان النص أقل من 15 حرفاً يظهر تنبيه الخطأ، وإذا كان كافياً
 *   تبدأ شاشة التحليل الذكي (Analyzing Overlay) ذات المراحل الست.
 * - شاشة التحليل المرحلية تعرض التقدم الحي واستخراج العبارات، ثم الانتقال لـ /capabilities.
 *
 * راجع PROJECT_MAP.md → src/pages/problem/ProblemInputPage.tsx للتفاصيل المعمارية الكاملة.
 */

import { useState, useRef, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import { useProblem } from '../../contexts/ProblemContext'
import styles from './ProblemInputPage.module.css'

const EXAMPLES = [
  'أريد بناء تطبيق يساعد طلاب الجامعة على إيجاد موادهم ومواعيدهم بسهولة.',
  'عندنا مركز اتصال يستقبل 400 مكالمة عربية يوميًا، ونريد تحويلها إلى نص وتحليل الشكاوى.',
  'أريد متجرًا إلكترونيًا صغيرًا لبيع منتجات يدوية، مع دفع إلكتروني وتتبّع للطلبات.',
]

const STAGES = [
  { title: 'فهم المشكلة', output: 'طلاب جامعة · معلومات موزّعة · مواد ومواعيد' },
  { title: 'التصنيف', output: 'تعليم — إدارة معلومات، لا شبكة اجتماعية' },
  { title: 'النتيجة المطلوبة', output: 'مكان واحد يجمع المواد والمواعيد للطالب' },
  { title: 'استخراج القدرات', output: '5 قدرات: منها 3 أساسية و2 مساندة' },
  { title: 'توليد المحاكاة', output: '3 مهام مبنية على مشكلتك أنت' },
  { title: 'تجهيز معايير التقييم', output: '4 معايير لكل مهمة' },
]

const PHRASES = [
  { phrase: 'بناء تطبيق', pulled: 'Mobile Development' },
  { phrase: 'طلاب الجامعة', pulled: 'UI/UX' },
  { phrase: 'موادهم ومواعيدهم', pulled: 'Backend · Database' },
  { phrase: 'بسهولة', pulled: 'Product Thinking' },
]

export function ProblemInputPage() {
  const navigate = useNavigate()
  const { problemText, setProblemText } = useProblem()
  const [inputText, setInputText] = useState<string>(problemText || EXAMPLES[0])
  const [hasError, setHasError] = useState<boolean>(false)

  // حالات شاشة التحليل
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false)
  const [activeStageIdx, setActiveStageIdx] = useState<number>(-1)
  const [doneStageIdxs, setDoneStageIdxs] = useState<number[]>([])
  const [progressPercent, setProgressPercent] = useState<number>(0)
  const [showExtract, setShowExtract] = useState<boolean>(false)
  const [litIndices, setLitIndices] = useState<number[]>([])
  const [onIndices, setOnIndices] = useState<number[]>([])

  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  // تنظيف المؤقتات عند تفكيك المكون
  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout)
      timersRef.current = []
    }
  }, [])

  // اختيار أحد الأمثلة الجاهزة
  const handleUseExample = useCallback((index: number) => {
    const text = EXAMPLES[index]
    setInputText(text)
    setHasError(false)
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [])

  // بدء التحليل عند الضغط على الزر (Event Handler نقي حسب vercel-react-best-practices)
  const handleAnalyze = useCallback(() => {
    const trimmed = inputText.trim()
    if (trimmed.length < 15) {
      setHasError(true)
      if (textareaRef.current) {
        textareaRef.current.focus()
      }
      return
    }

    setHasError(false)
    setProblemText(trimmed)

    // التحقق من تفضيل تقليل الحركة للتخطي الفوري
    const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
      navigate(ROUTES.CAPABILITIES)
      return
    }

    // تنشيط شاشة التحليل
    setIsAnalyzing(true)
    setActiveStageIdx(0)
    setDoneStageIdxs([])
    setProgressPercent(0)
    setShowExtract(false)
    setLitIndices([])
    setOnIndices([])

    timersRef.current.forEach(clearTimeout)
    timersRef.current = []

    // جدولة المراحل الست من prototype.html بدقة (780ms لكل مرحلة)
    STAGES.forEach((_, i) => {
      timersRef.current.push(
        setTimeout(() => {
          setActiveStageIdx(i)
        }, i * 780),
      )

      timersRef.current.push(
        setTimeout(() => {
          setDoneStageIdxs((prev) => [...prev, i])
          setProgressPercent(Math.round(((i + 1) / STAGES.length) * 100))
        }, i * 780 + 700),
      )
    })

    // إبراز العبارات المستخرجة عند المرحلة الرابعة
    timersRef.current.push(
      setTimeout(() => {
        setShowExtract(true)
        PHRASES.forEach((_, k) => {
          timersRef.current.push(
            setTimeout(() => {
              setLitIndices((prev) => [...prev, k])
              timersRef.current.push(
                setTimeout(() => {
                  setOnIndices((prev) => [...prev, k])
                }, 260),
              )
            }, k * 620),
          )
        })
      }, 3 * 780),
    )

    // الانتقال لصفحة القدرات بعد اكتمال جميع المراحل
    timersRef.current.push(
      setTimeout(() => {
        setIsAnalyzing(false)
        navigate(ROUTES.CAPABILITIES)
      }, STAGES.length * 780 + 1500),
    )
  }, [inputText, navigate, setProblemText])

  const subText = inputText.length > 70 ? `${inputText.slice(0, 70)}…` : inputText

  return (
    <>
      {/* ═══ شاشة التحليل المرحلية ═══ */}
      {isAnalyzing && (
        <div className={styles.analyzing} dir="rtl" role="dialog" aria-modal="true" aria-label="جارٍ تحليل مشكلتك">
          <div className={styles.ainner}>
            <img
              src="/assets/qudra-mark-dark.svg"
              alt=""
              className={styles.alogo}
              width={52}
              height={52}
              aria-hidden="true"
            />
            <h2>جارٍ تحليل مشكلتك…</h2>
            <p className={styles.asub}>{subText}</p>

            {/* صندوق استخراج العبارات المستخلصة من النص */}
            <div className={`${styles.extract} ${showExtract ? styles.on : ''}`}>
              <span className={styles.exlabel}>من نصّك مباشرة</span>
              <div className={styles.exquote}>
                {PHRASES.map((item, idx) => (
                  <span key={item.phrase}>
                    {idx > 0 ? ' ' : ''}
                    <mark className={litIndices.includes(idx) ? styles.lit : ''}>
                      {item.phrase}
                    </mark>
                  </span>
                ))}
              </div>
              <div className={styles.expulled}>
                {PHRASES.map((item, idx) => (
                  <span
                    key={item.pulled}
                    className={`${styles.expull} ${onIndices.includes(idx) ? styles.on : ''}`}
                  >
                    <span className={styles.d} aria-hidden="true" />
                    {item.pulled}
                  </span>
                ))}
              </div>
            </div>

            {/* قائمة المراحل الست */}
            <div className={styles.astages} role="list">
              {STAGES.map((st, i) => {
                const isDone = doneStageIdxs.includes(i)
                const isAct = activeStageIdx === i && !isDone
                let rowClass = styles.ast
                if (isDone) rowClass += ` ${styles.done}`
                else if (isAct) rowClass += ` ${styles.act}`

                return (
                  <div key={st.title} className={rowClass} role="listitem">
                    <span className={styles.node} aria-hidden="true" />
                    <span className={styles.txt}>
                      <span className={styles.ttl}>{st.title}</span>
                      <span className={styles.out}>{st.output}</span>
                    </span>
                  </div>
                )
              })}
            </div>

            <div className={styles.abar} aria-hidden="true">
              <i style={{ width: `${progressPercent}%` }} />
            </div>
            <p className={styles.anote}>لا شيء يحدث خلف ستار — كل مرحلة تعرض ما أنتجته.</p>
          </div>
        </div>
      )}

      {/* ═══ الشاشة الرئيسية لإدخال المشكلة ═══ */}
      <main id="main" className="wrap" tabIndex={-1} style={{ padding: 'clamp(1.5rem,4vw,2.75rem) 0 5rem' }} dir="rtl">
        <span className="stepno">الخطوة 1 من 6</span>
        <div className="headrow">
          <div>
            <h1 className="scr-t">ما المشكلة التي تريد حلّها؟</h1>
            <p className="scr-p">لا نسألك عن مهاراتك. اكتب المشكلة بلغتك، ونحن نستخرج القدرات — ثم نختبرك عليها.</p>
          </div>
        </div>

        <div className={styles.pgrid}>
          <div className={styles.pmain}>
            <div className={`${styles.tawrap} ${hasError ? styles.err : ''}`}>
              <textarea
                id="pText"
                ref={textareaRef}
                className={styles.ta}
                aria-label="وصف المشكلة"
                rows={5}
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value)
                  if (e.target.value.trim().length >= 15) {
                    setHasError(false)
                  }
                }}
              />
              <div className={styles.tafoot}>
                <span className="mono">{inputText.length} / 2000</span>
                <span>لا تحتاج مسمّى وظيفي</span>
              </div>
            </div>

            {/* رسالة الخطأ عند نص قصير جداً */}
            <p className={`${styles.fielderr} ${hasError ? `${styles.on} ${styles.fielderrOn}` : ''}`}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4M12 16h.01" />
              </svg>
              اكتب مشكلتك أولًا — جملة أو جملتان تكفيان.
            </p>

            {/* أزرار الأمثلة السريعة الثلاثة */}
            <div className={styles.exrow}>
              <span className={styles.exlbl}>أو ابدأ من مثال:</span>
              <div className={styles.exbtns}>
                <button type="button" className={styles.exb} onClick={() => handleUseExample(0)}>تطبيق جامعي</button>
                <button type="button" className={styles.exb} onClick={() => handleUseExample(1)}>تحليل مكالمات</button>
                <button type="button" className={styles.exb} onClick={() => handleUseExample(2)}>متجر إلكتروني</button>
              </div>
            </div>

            <div className="row" style={{ marginTop: '1.4rem' }}>
              <button type="button" id="pSubmitBtn" className="btn dark" onClick={handleAnalyze}>حلّل المشكلة</button>
              <span className="note">متوسط الزمن <span className="num">14</span> ثانية</span>
            </div>
          </div>

          <aside className={styles.pside}>
            <div className={`box ${styles.pcard}`}>
              <h3>ماذا يحدث بعد الضغط</h3>
              <ol className={styles.mini}>
                <li><span className={styles.mn}>1</span><div><b>نفكّك نصّك</b><em>نستخرج الهدف والقيود والقدرات المطلوبة من جُملك نفسها.</em></div></li>
                <li><span className={styles.mn}>2</span><div><b>نولّد لك محاكاة</b><em>مهام حقيقية من مشكلتك أنت — لا أسئلة عامة.</em></div></li>
                <li><span className={styles.mn}>3</span><div><b>نحوّل نتيجتك دليلًا</b><em>تقييمك يصير قدرات موثّقة في بصمتك.</em></div></li>
              </ol>
            </div>

            <div className={`box ${styles.tipcard}`}>
              <span className={styles.tiph}>
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M9 18h6M10 22h4" /><path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2Z" />
                </svg>
                كلما وصفت النتيجة، صار التحليل أدقّ
              </span>
              <p>اكتب <b>ماذا تريد أن يحدث</b> لا <b>بأي تقنية</b>. «يشوف مواده ومواعيده في مكان واحد» أفضل من «تطبيق Flutter».</p>
            </div>

            <div className={styles.privnote}>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>بياناتك لا تُدرّب عليها نماذج عامة، ولا تُشارك مع أحد.</span>
            </div>
          </aside>
        </div>

        <div className="row" style={{ marginTop: '2rem' }}>
          <Link to={ROUTES.LANDING} className="btn ghost">← رجوع للرئيسية</Link>
        </div>
      </main>
    </>
  )
}
export default ProblemInputPage
