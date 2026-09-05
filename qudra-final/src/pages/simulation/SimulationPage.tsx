/**
 * SimulationPage — شاشة المحاكاة وتحدي المهام الثلاث.
 *
 * منقولة حرفياً من prototype.html (الأسطر 2064–2110 والأسطر 3060–3100):
 * - simIntro: الترويسة، المعايير الأربعة، ونصيحة التقييم.
 * - simRun: شريط التقدم، المؤقت الدقيق 14:32 (872 ثانية) بنظام pause/resume عبر visibilitychange.
 * - المهام الثلاث بنصوصها ومهاراتها وملاحظاتها التوجيهية الحرفية.
 * - العداد الحي ومؤشرات sig3 الثلاثة (طول كافٍ / فيها تبرير / فيها تحديد).
 * - شاشة grading الانتقالية بمراحلها الأربع الدقيقة (260ms / 640ms / 1020ms / 1400ms).
 *
 * راجع PROJECT_MAP.md و DECISIONS.md للتفاصيل المعمارية.
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import { useProblem } from '../../contexts/ProblemContext'
import styles from './SimulationPage.module.css'

export interface TaskItem {
  skill: string
  question: string
  hint: string
}

export const SIM_TASKS: TaskItem[] = [
  {
    skill: 'Product Thinking',
    question: 'ما أول شيء ستبنيه، ولماذا؟',
    hint: 'اكتب بمنطقك. لا نبحث عن مصطلحات — نبحث عن ترتيب أولويات مبرَّر.',
  },
  {
    skill: 'UI/UX',
    question: 'صف الشاشة الرئيسية للطالب: ماذا تعرض، وبأي ترتيب، ولماذا؟',
    hint: 'ما الذي يجب أن يراه الطالب في أول ثانيتين؟ ولماذا هذا وليس غيره؟',
  },
  {
    skill: 'Backend',
    question: 'ما البيانات التي ستخزّنها، وكيف تربط الطالب بمواده ومواعيدها؟',
    hint: 'لا نحتاج كودًا. نحتاج بنية واضحة والعلاقات بينها.',
  },
]

// القيمة الزمنية الابتدائية الدقيقة المستخرجة حرفياً: 15*60 - 28 = 872 ثانية (14:32)
const INITIAL_SIM_SECONDS = 15 * 60 - 28

export function SimulationPage() {
  const navigate = useNavigate()
  const { problemText, setSimulationAnswers } = useProblem()

  // حالة الشاشة: Intro أم التشغيل الفعلي (simRun)
  const [inRun, setInRun] = useState<boolean>(false)

  // رقم المهمة الحالية (0, 1, 2)
  const [currentStep, setCurrentStep] = useState<number>(0)

  // مصفوفة إجابات المستخدم الحقيقية
  const [answers, setAnswers] = useState<string[]>(['', '', ''])

  // قيمة المؤقت المعروضة
  const [secondsLeft, setSecondsLeft] = useState<number>(INITIAL_SIM_SECONDS)
  const [isTimeUp, setIsTimeUp] = useState<boolean>(false)
  const [timeUpNotice, setTimeUpNotice] = useState<string>('')

  // حالة شاشة Grading التقييمية
  const [isGrading, setIsGrading] = useState<boolean>(false)
  const [gradingStepsState, setGradingStepsState] = useState<boolean[]>([false, false, false, false])

  // استخدام useRef للقيم اللحظية المتغيرة وفق قاعدة vercel-react-best-practices (rerender-use-ref-transient-values)
  const answersRef = useRef<string[]>(['', '', ''])
  const simLeftRef = useRef<number>(INITIAL_SIM_SECONDS)
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const isPausedRef = useRef<boolean>(false)
  const inRunRef = useRef<boolean>(false)
  const gradingTimersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  inRunRef.current = inRun

  // دوال المؤقت المباشرة (Event Handlers)
  const stopTimer = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current)
      timerIntervalRef.current = null
    }
  }, [])

  // تشغيل شاشة Grading والانتقال لصفحة التقييم
  const triggerGradingFlow = useCallback(
    (explicitAnswers?: string[]) => {
      stopTimer()
      setIsGrading(true)

      const finalAnswers = explicitAnswers || answersRef.current

      // فحص تقليل الحركة
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (prefersReduced) {
        setSimulationAnswers(finalAnswers)
        navigate(ROUTES.EVALUATION)
        return
      }

      // توقيت المراحل الأربع المستخرج حرفياً: 260ms / 640ms / 1020ms / 1400ms ثم الانتقال بعد 1820ms
      const t1 = setTimeout(() => setGradingStepsState([true, false, false, false]), 260)
      const t2 = setTimeout(() => setGradingStepsState([true, true, false, false]), 640)
      const t3 = setTimeout(() => setGradingStepsState([true, true, true, false]), 1020)
      const t4 = setTimeout(() => setGradingStepsState([true, true, true, true]), 1400)
      const tDone = setTimeout(() => {
        setSimulationAnswers(finalAnswers)
        navigate(ROUTES.EVALUATION)
      }, 1820)

      gradingTimersRef.current = [t1, t2, t3, t4, tDone]
    },
    [navigate, setSimulationAnswers, stopTimer]
  )

  const handleTimeOut = useCallback(() => {
    stopTimer()
    setIsTimeUp(true)
    setTimeUpNotice('انتهى وقت المحاكاة. جارٍ التقييم بما كتبت…')

    // حفظ الإجابة الحالية تلقائياً
    setTimeout(() => {
      triggerGradingFlow(answersRef.current)
    }, 700)
  }, [stopTimer, triggerGradingFlow])

  const startTimer = useCallback(() => {
    stopTimer()
    isPausedRef.current = false
    timerIntervalRef.current = setInterval(() => {
      if (isPausedRef.current) return

      simLeftRef.current -= 1
      const current = simLeftRef.current
      setSecondsLeft(current)

      if (current <= 0) {
        handleTimeOut()
      }
    }, 1000)
  }, [stopTimer, handleTimeOut])

  const pauseTimer = useCallback(() => {
    isPausedRef.current = true
  }, [])

  const resumeTimer = useCallback(() => {
    isPausedRef.current = false
  }, [])

  // Lifecycle & Subscription Effect الوحيد: إدارة تنظيف الـ Interval وحدث visibilitychange
  useEffect(() => {
    const handleVisibility = () => {
      if (!inRunRef.current) return
      if (document.hidden) {
        pauseTimer()
      } else {
        resumeTimer()
      }
    }

    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      stopTimer()
      document.removeEventListener('visibilitychange', handleVisibility)
      // تنظيف مؤقتات الـ grading إذا أُلغي المكون
      gradingTimersRef.current.forEach((t) => clearTimeout(t))
    }
  }, [pauseTimer, resumeTimer, stopTimer])

  // بدء المحاكاة عند نقر زر "ابدأ"
  const handleStartSim = () => {
    setInRun(true)
    startTimer()
  }

  // تحديث نص الإجابة الحالية
  const handleAnswerChange = (text: string) => {
    if (isTimeUp) return
    answersRef.current[currentStep] = text
    setAnswers([...answersRef.current])
  }

  // التنقل بين المهام
  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleNext = () => {
    if (currentStep < SIM_TASKS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // المهمة الأخيرة: إرسال للتقييم
      triggerGradingFlow(answers)
    }
  }

  // تنسيق وقت العرض MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(Math.max(0, secs) / 60)
    const s = Math.max(0, secs) % 60
    return `${m}:${s < 10 ? '0' : ''}${s}`
  }

  // حساب مؤشرات الكتابة sig3 بالمعادلات المستخرجة حرفياً
  const currentAnswer = answers[currentStep] || ''
  const wordsCount = currentAnswer.trim() ? currentAnswer.trim().split(/\s+/).length : 0
  const hitLen = wordsCount >= 30
  const hitWhy = /لأن|بسبب|حتى|عشان|لذلك|بحيث|كي /.test(currentAnswer)
  const hitSpec = /[0-9]|«|»|مثلاً|مثلا|مثل |تحديدًا|تحديدا/.test(currentAnswer)

  const isLowTime = secondsLeft <= 60

  return (
    <main className={styles.simScreen} dir="rtl">
      <span className={styles.stepno}>الخطوة 3 من 6</span>

      {/* ═══ 1. شاشة المقدمة: simIntro ═══ */}
      {!inRun && (
        <div id="simIntro">
          <div className={styles.pgrid}>
            <div className={styles.pmain}>
              <div className={styles.simcard}>
                <span className={styles.simtag}>SIMULATION</span>
                <h1 className={styles.scrT}>تحدّي تطبيق الجامعة</h1>
                <p className={styles.scrP}>
                  ثلاث مهام قصيرة مبنية على مشكلتك أنت. لا إجابة نموذجية — نقيس فهمك ومنطقك، لا حفظك.
                </p>

                <div className={styles.simmeta}>
                  <div>
                    <span className={styles.lbl}>المدة</span>
                    <b>
                      <span className={styles.num}>15</span> دقيقة
                    </b>
                  </div>
                  <div>
                    <span className={styles.lbl}>المهام</span>
                    <b>
                      <span className={styles.num}>3</span>
                    </b>
                  </div>
                  <div>
                    <span className={styles.lbl}>تقيس</span>
                    <b>UI/UX · Backend · Product</b>
                  </div>
                </div>

                <button className="btn" id="startSimBtn" onClick={handleStartSim}>
                  ابدأ المهمة الأولى
                </button>
              </div>
            </div>

            <aside className={styles.pside}>
              <div className={styles.pcard}>
                <h3>كيف تُقيَّم إجابتك</h3>
                <ol className={styles.mini}>
                  <li>
                    <span className={styles.mn}>1</span>
                    <div>
                      <b>فهم المشكلة</b>
                      <em>هل ربطت إجابتك بالمشكلة نفسها أم أجبت عمومًا؟</em>
                    </div>
                  </li>
                  <li>
                    <span className={styles.mn}>2</span>
                    <div>
                      <b>تجربة المستخدم</b>
                      <em>هل فكّرت بمن سيستخدمه فعلًا؟</em>
                    </div>
                  </li>
                  <li>
                    <span className={styles.mn}>3</span>
                    <div>
                      <b>بنية الحل</b>
                      <em>هل الترتيب منطقي وقابل للتنفيذ؟</em>
                    </div>
                  </li>
                  <li>
                    <span className={styles.mn}>4</span>
                    <div>
                      <b>المنطق والتبرير</b>
                      <em>هل قلت «لماذا» لا «ماذا» فقط؟</em>
                    </div>
                  </li>
                </ol>
              </div>

              <div className={styles.tipcard}>
                <span className={styles.tiph}>
                  <svg
                    viewBox="0 0 24 24"
                    width="15"
                    height="15"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M9 18h6M10 22h4" />
                    <path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2Z" />
                  </svg>
                  لا توجد إجابة صحيحة واحدة
                </span>
                <p>
                  نقارن إجابتك بمعايير المهمة، لا بإجابة نموذجية. التبرير الواضح يرفع درجتك أكثر من
                  المصطلحات.
                </p>
              </div>
            </aside>
          </div>
        </div>
      )}

      {/* ═══ 2. شاشة التنفيذ الفعلي: simRun ═══ */}
      {inRun && (
        <div id="simRun">
          <div className={styles.simbar}>
            <div className={styles.simprog}>
              <i
                className={styles.simFill}
                style={{ width: `${((currentStep + 1) / SIM_TASKS.length) * 100}%` }}
              />
            </div>
            <div className={styles.simstat}>
              <span className="mono">
                مهمة <span id="taskNo">{currentStep + 1}</span> من{' '}
                <span className="num">{SIM_TASKS.length}</span>
              </span>
              <span
                className={`${styles.timer} mono ${isLowTime ? styles.low : ''}`}
                id="timer"
                aria-live="polite"
              >
                {formatTime(secondsLeft)}
              </span>
            </div>
          </div>

          <div className={styles.pgrid}>
            <div className={styles.pmain}>
              <div className={styles.taskbox}>
                <span className={styles.tskill} id="taskSkill">
                  {SIM_TASKS[currentStep].skill}
                </span>
                <h2 id="taskQ">{SIM_TASKS[currentStep].question}</h2>
                <p className={styles.taskHint} id="taskHint">
                  {SIM_TASKS[currentStep].hint}
                </p>

                {timeUpNotice && (
                  <div className={styles.timeOverAlert} role="alert">
                    {timeUpNotice}
                  </div>
                )}

                <label className={styles.anslbl} htmlFor="answer">
                  إجابتك
                </label>
                <textarea
                  className={styles.taAns}
                  id="answer"
                  rows={7}
                  placeholder="اكتب إجابتك هنا…"
                  value={currentAnswer}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  disabled={isTimeUp}
                />

                <div className={styles.actionsRow}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <button
                      className="btn ghost"
                      id="prevTask"
                      onClick={handlePrev}
                      disabled={currentStep === 0 || isTimeUp}
                    >
                      السابقة
                    </button>
                    <span className={styles.ansCount} id="ansCount">
                      {wordsCount} كلمة
                    </span>
                  </div>

                  <button
                    className="btn"
                    id="nextTask"
                    onClick={handleNext}
                    disabled={isTimeUp}
                  >
                    {currentStep === SIM_TASKS.length - 1 ? 'أرسل للتقييم' : 'التالي'}
                  </button>
                </div>
              </div>
            </div>

            <aside className={styles.pside}>
              <div className={styles.pcard}>
                <h3>مهام التحدّي</h3>
                <div className={styles.tlist} id="tList">
                  {SIM_TASKS.map((task, idx) => {
                    const isCur = idx === currentStep
                    const isOk = idx < currentStep || (answers[idx] && answers[idx].trim().length > 0)
                    return (
                      <div
                        key={idx}
                        className={`${styles.ti} ${isCur ? styles.cur : ''} ${isOk ? styles.ok : ''}`}
                      >
                        <span className={styles.tn}>
                          <span>{idx + 1}</span>
                        </span>
                        <div className={styles.tx}>
                          <span className={styles.tsk}>{task.skill}</span>
                          <b>{task.question}</b>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className={styles.pcard}>
                <h3>
                  مؤشرات كتابة <span className={styles.hintlbl}>ليست تقييمًا</span>
                </h3>
                <div className={styles.sig3} id="sig3">
                  <div
                    className={`${styles.s3i} ${hitLen ? styles.hit : ''}`}
                    data-k="len"
                  >
                    <span className={styles.dotk} />
                    <span className={styles.k}>طول كافٍ</span>
                    <span className={`${styles.v} mono`}>{wordsCount}</span>
                  </div>
                  <div
                    className={`${styles.s3i} ${hitWhy ? styles.hit : ''}`}
                    data-k="why"
                  >
                    <span className={styles.dotk} />
                    <span className={styles.k}>فيها تبرير</span>
                    <span className={`${styles.v} mono`}>{hitWhy ? 'نعم' : '—'}</span>
                  </div>
                  <div
                    className={`${styles.s3i} ${hitSpec ? styles.hit : ''}`}
                    data-k="spec"
                  >
                    <span className={styles.dotk} />
                    <span className={styles.k}>فيها تحديد</span>
                    <span className={`${styles.v} mono`}>{hitSpec ? 'نعم' : '—'}</span>
                  </div>
                </div>
                <p className={styles.prnote}>
                  هذه مؤشرات شكلية تساعدك فقط. التقييم الحقيقي يقرأ المعنى.
                </p>
              </div>

              <div className={styles.recall}>
                <span className={styles.lbl}>مشكلتك</span>
                <p id="recallTxt">{problemText}</p>
              </div>
            </aside>
          </div>
        </div>
      )}

      {/* ═══ 3. شاشة لحظة التقييم الانتقالية: grading modal ═══ */}
      <div
        className={`${styles.grading} ${isGrading ? styles.on : ''}`}
        id="grading"
        dir="rtl"
        role="dialog"
        aria-modal="true"
        aria-label="جارٍ تقييم إجاباتك"
      >
        <div className={styles.ginner}>
          <span className={styles.gring} />
          <h3>جارٍ تقييم إجاباتك</h3>
          <p>نقارن كل إجابة بمعايير المهمة — لا بإجابة نموذجية.</p>

          <div className={styles.gsteps} id="gSteps">
            <div className={`${styles.gstep} ${gradingStepsState[0] ? styles.on : ''}`}>
              <span className={styles.gt} />
              <span>قراءة الإجابات الثلاث</span>
            </div>
            <div className={`${styles.gstep} ${gradingStepsState[1] ? styles.on : ''}`}>
              <span className={styles.gt} />
              <span>مقارنة بمعايير كل مهمة</span>
            </div>
            <div className={`${styles.gstep} ${gradingStepsState[2] ? styles.on : ''}`}>
              <span className={styles.gt} />
              <span>استخراج نقاط القوة والضعف</span>
            </div>
            <div className={`${styles.gstep} ${gradingStepsState[3] ? styles.on : ''}`}>
              <span className={styles.gt} />
              <span>احتساب الدرجة</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default SimulationPage
