/**
 * CandidateDetailPage — شاشة "لماذا هذا الشخص" مع آلية التحول بالدليل (#s5 + #turnBox).
 *
 * مطابقة حرفية لـ prototype.html:
 * 1. الدونات المزدوج SVG Donut (78% تتصاعد إلى 91% عند حل التحدي).
 * 2. تفصيل العوامل الستة المحددة للنتيجة مع أشرطة الوزن والاستحقاق الفعلي.
 * 3. صندوق الفجوة ومسار التعلم (تعلّم ← تدرّب ← أثبت ← أعد المطابقة).
 * 4. تشغيل التحدي العملي (runChallenge) وإدخال الدليل الجديد لحظياً.
 * 5. جدول الأدلة الكامل بمستويات التوثيق (موثّق، مرتبط، ذاتي).
 * 6. زر الانتقال إلى شاشة الترتيب الجديد (#s6).
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import { InviteModal } from '../../components/modals/InviteModal'
import styles from './CandidateDetailPage.module.css'

interface ReasonItem {
  name: string
  weight: number
  scoreBefore: number
  scoreAfter: number
  isGap: boolean
  noteBefore: string
  noteAfter: string | null
}

const REASONS: ReasonItem[] = [
  {
    name: 'تصميم قواعد البيانات',
    weight: 25,
    scoreBefore: 10,
    scoreAfter: 23,
    isGap: true,
    noteBefore:
      'ادّعاء ذاتي بلا دليل. المشروع كله يقوم على ربط الطالب بمواده ومواعيدها — وهذه أثقل قدرة فيه.',
    noteAfter:
      'أُغلقت الفجوة: تحدٍّ عملي مُقيَّم أنتج مخطّطًا كاملًا للعلاقات مع فهارس الأداء.',
  },
  {
    name: 'بناء واجهات REST',
    weight: 20,
    scoreBefore: 19,
    scoreAfter: 19,
    isGap: false,
    noteBefore:
      'أربعة أدلة موثّقة، أقواها مستودع inventory-api بتوثيق واضح واختبارات.',
    noteAfter: null,
  },
  {
    name: 'التكامل مع الواجهة',
    weight: 18,
    scoreBefore: 16,
    scoreAfter: 16,
    isGap: false,
    noteBefore:
      'مشروعان سُلّما لعميل، وكلاهما يربط واجهة فعلية بخدمة خلفية.',
    noteAfter: null,
  },
  {
    name: 'الاختبارات والموثوقية',
    weight: 15,
    scoreBefore: 13,
    scoreAfter: 13,
    isGap: false,
    noteBefore: 'تغطية اختبارات جزئية في مستودعين — جيدة لا ممتازة.',
    noteAfter: null,
  },
  {
    name: 'الأداء تحت الحمل',
    weight: 12,
    scoreBefore: 11,
    scoreAfter: 11,
    isGap: false,
    noteBefore: 'خدمة طوابير غير متزامنة تعمل فعليًا، موثّقة من المستودع.',
    noteAfter: null,
  },
  {
    name: 'الالتزام الزمني',
    weight: 10,
    scoreBefore: 9,
    scoreAfter: 9,
    isGap: false,
    noteBefore: 'سجل تسليم في الوقت في ثلاثة مشاريع سابقة عبر المنصة.',
    noteAfter: null,
  },
]

const PATH_STEPS = [
  ['تعلّم', 'نمذجة العلاقات والفهرسة'],
  ['تدرّب', 'مخطّط لقاعدة بيانات جدول جامعي'],
  ['أثبت', 'تحدٍّ عملي مُقيَّم من المنصة'],
  ['أعد المطابقة', 'الدليل يدخل ويعيد حساب النتيجة'],
]

const BASE_EVIDENCES = [
  ['github.com/mash/inventory-api', 'مستودع', 'REST APIs', '2026-05', 'موثّق'],
  ['github.com/mash/queue-service', 'مستودع', 'الأداء تحت الحمل', '2026-02', 'موثّق'],
  ['qudra · مشروع مسلّم لعميل', 'مشروع', 'التكامل مع الواجهة', '2025-11', 'موثّق'],
  ['leetcode.com/mash', 'تقييم', 'Algorithms', '2026-06', 'موثّق'],
  ['شهادة PostgreSQL Associate', 'شهادة', 'قواعد بيانات', '2025-03', 'مرتبط'],
  ['لوحة إدارة داخلية (بلا رابط)', 'مشروع', 'التكامل مع الواجهة', '2025-04', 'مرتبط'],
  ['مهارة مكتوبة في الملف', 'ادّعاء', 'تصميم قواعد البيانات', '—', 'ذاتي'],
]

const NEW_EVIDENCE = [
  'qudra · تحدٍّ عملي مُقيَّم',
  'تحدٍّ',
  'تصميم قواعد البيانات',
  '2026-08',
  'موثّق',
]

export function CandidateDetailPage() {
  const navigate = useNavigate()
  const [isTurned, setIsTurned] = useState(false)
  const [isRunningChallenge, setIsRunningChallenge] = useState(false)
  const [isInviteOpen, setIsInviteOpen] = useState(false)

  const handleRunChallenge = () => {
    if (isRunningChallenge || isTurned) return
    setIsRunningChallenge(true)
    setTimeout(() => {
      setIsTurned(true)
      setIsRunningChallenge(false)
    }, 600)
  }

  const C = 540.4
  const currentScore = isTurned ? 91 : 78
  const arcTealOffset = (C - (C * currentScore) / 100).toFixed(1)

  const evidenceList = isTurned
    ? [NEW_EVIDENCE, ...BASE_EVIDENCES]
    : BASE_EVIDENCES

  return (
    <section className={`screen wrap ${styles.detailPage}`} id="s5" dir="rtl">
      <div className={styles.crumb}>
        <button
          className={styles.back}
          onClick={() => navigate(ROUTES.CANDIDATES)}
        >
          → رجوع للقائمة
        </button>
        <span>امتداد · لماذا هذا الشخص</span>
      </div>

      <div className={styles.headrow}>
        <div>
          <h1 className={styles.scrt}>لماذا ماجد الشمري</h1>
          <p className={styles.scrp}>
            كل نقطة في النتيجة لها سبب، وكل سبب له دليل يمكنك فتحه.
          </p>
        </div>
        <div className="row" style={{ gap: '0.6rem', alignItems: 'center' }}>
          <span
            className={isTurned ? 'pill ready' : 'pill near'}
            id="verdict"
          >
            {isTurned
              ? 'جاهز الآن — الفجوة أُغلقت بدليل'
              : 'قريب — فجوة واحدة قابلة للإثبات'}
          </span>
          <button
            className="btn"
            onClick={() => setIsInviteOpen(true)}
            id="openInviteBtn"
          >
            ادعُه للمشروع
          </button>
        </div>
      </div>

      <div className={styles.whygrid}>
        {/* العمود الجانبي (بطاقة النتيجة ودليل الرموز) */}
        <div className={styles.whyside}>
          <div className={`box ${styles.scorecard}`}>
            <div className={styles.dual}>
              <svg
                viewBox="0 0 200 200"
                width="168"
                height="168"
                role="img"
                aria-label="نسبة المطابقة"
              >
                <circle
                  cx="100"
                  cy="100"
                  r="86"
                  fill="none"
                  stroke="var(--soft)"
                  strokeWidth="14"
                />
                <circle
                  id="arcAmber"
                  cx="100"
                  cy="100"
                  r="86"
                  fill="none"
                  stroke="var(--gapc-fill, #e6a23c)"
                  strokeWidth="14"
                  strokeLinecap="round"
                  strokeDasharray="540.4"
                  strokeDashoffset={isTurned ? '48.6' : '118.9'}
                />
                <circle
                  id="arcTeal"
                  cx="100"
                  cy="100"
                  r="86"
                  fill="none"
                  stroke="var(--accent-fill)"
                  strokeWidth="14"
                  strokeLinecap="round"
                  strokeDasharray="540.4"
                  strokeDashoffset={arcTealOffset}
                />
              </svg>
              <div className={styles.dualc}>
                <span className={`${styles.big} num`} id="bigScore">
                  {currentScore}%
                </span>
                <span className="note">مطابقة بالدليل</span>
              </div>
            </div>

            <div className={styles.kv}>
              <div>
                <span>مستوى الثقة</span>
                <b id="conf">{isTurned ? 'مرتفع' : 'متوسط — مرتفع'}</b>
              </div>
              <div>
                <span>أدلة موثّقة</span>
                <b className="mono" id="vcount">
                  {isTurned ? '5 من 8' : '4 من 7'}
                </b>
              </div>
              <div>
                <span>آخر تحديث للأدلة</span>
                <b className="mono" id="lastUp">
                  {isTurned ? '2026-08-29' : '2026-06-14'}
                </b>
              </div>
            </div>
          </div>

          <div className={`box ${styles.legend}`}>
            <h3>مفتاح مستوى التوثيق</h3>
            <div className={styles.lg}>
              <span className={`${styles.dot} ${styles.v1}`} />
              <span>موثّق — فُحص آليًا من المصدر</span>
            </div>
            <div className={styles.lg}>
              <span className={`${styles.dot} ${styles.v2}`} />
              <span>مرتبط — مصدر متصل بلا فحص كامل</span>
            </div>
            <div className={styles.lg}>
              <span className={`${styles.dot} ${styles.v3}`} />
              <span>ذاتي — كتبه الشخص عن نفسه</span>
            </div>
          </div>
        </div>

        {/* العمود الرئيسي */}
        <div className={styles.whymain}>
          {/* قسم الأسباب الستة */}
          <section className="box">
            <div className={styles.secrow}>
              <h2>من أين جاءت النتيجة</h2>
              <span className="note">
                ستة عوامل — الوزن من أصل <span className="num">100</span>
              </span>
            </div>
            <p className="note" style={{ marginBottom: '1.1rem' }}>
              الطول = وزن العامل في القرار. الامتلاء = ما أُثبت منه فعلًا.
            </p>

            <div id="reasons">
              {REASONS.map((r) => {
                const got = isTurned ? r.scoreAfter : r.scoreBefore
                const isGap = r.isGap && !isTurned
                const note = isTurned && r.noteAfter ? r.noteAfter : r.noteBefore
                return (
                  <div
                    key={r.name}
                    className={`${styles.rsn} ${isGap ? styles.gap : ''}`}
                  >
                    <div className={styles.rsntop}>
                      <span className={styles.rsndot} />
                      <span className={styles.rsnname}>{r.name}</span>
                      <span className={styles.rsntag}>
                        {isGap ? 'فجوة — بلا دليل' : 'مثبت بدليل'}
                      </span>
                      <span className={styles.rsngot}>
                        {got} / {r.weight}
                      </span>
                    </div>
                    <div
                      className={styles.rsntrack}
                      style={{ width: `${(r.weight / 25) * 100}%` }}
                    >
                      <i style={{ width: `${(got / r.weight) * 100}%` }} />
                    </div>
                    <p className={styles.rsnnote}>{note}</p>
                  </div>
                )
              })}
            </div>
          </section>

          {/* صندوق التحول بالدليل (turnBox) */}
          <section
            className={`${styles.turn} ${isTurned ? styles.done : ''}`}
            id="turnBox"
          >
            <div className={styles.turnhead}>
              <span className={styles.td} id="turnDot" />
              <h2 id="turnTitle">
                {isTurned
                  ? 'الفجوة أصبحت دليلًا'
                  : 'الفجوة الوحيدة — وهي مسار، ليست رفضًا'}
              </h2>
              <span className={`mono ${styles.turnstamp}`} id="turnStamp">
                {isTurned ? 'مُقيَّم آليًا · 2026-08-29' : 'وزن الفجوة 25 / 100'}
              </span>
            </div>

            <p className={styles.turnbody} id="turnBody">
              {isTurned
                ? 'أكمل ماجد التحدي: مخطّط كامل لقاعدة بيانات الجدول الجامعي مع الفهارس. قيّمته المنصة آليًا، فدخل دليل موثّق جديد وأُعيد حساب النتيجة أمامك.'
                : 'ينقصه تصميم قواعد البيانات بوزن 25 نقطة — أثقل قدرة في مشروعك — وعنده ادّعاء ذاتي بلا دليل. نطلب إثباتًا.'}
            </p>

            <div className={styles.path} id="pathList">
              {PATH_STEPS.map((p, i) => (
                <div
                  key={p[0]}
                  className={`${styles.pstep} ${isTurned ? styles.done : ''}`}
                >
                  <span className={styles.b}>{i + 1}</span>
                  <span className={styles.l}>
                    {p[0]} — {p[1]}
                  </span>
                  <span className={styles.s}>
                    {isTurned
                      ? 'مكتمل'
                      : i < 2
                      ? 'مقترح'
                      : 'في الانتظار'}
                  </span>
                </div>
              ))}
            </div>

            {!isTurned ? (
              <div id="preTurn">
                <div className="row" style={{ alignItems: 'center', gap: '1rem' }}>
                  <button
                    className="btn dark"
                    id="chBtn"
                    disabled={isRunningChallenge}
                    onClick={handleRunChallenge}
                  >
                    {isRunningChallenge ? 'التحدي جارٍ…' : 'أرسل تحديًا عمليًا'}
                  </button>
                  <span className="note">
                    تحدٍّ عملي واحد، مهلته <span className="num">72</span> ساعة، ونتيجته تصبح دليلًا موثّقًا.
                  </span>
                </div>
              </div>
            ) : (
              <div id="postTurn" className={styles.newev}>
                <div className={styles.nehead}>
                  <span className={`${styles.dot} ${styles.v1}`} />
                  <h3>دليل جديد دخل الملف</h3>
                </div>

                <div className={styles.slots}>
                  <div>
                    <p className={styles.sl}>المصدر</p>
                    <p className={styles.sv}>qudra · تحدٍّ مُقيَّم</p>
                  </div>
                  <div>
                    <p className={styles.sl}>النوع</p>
                    <p className={styles.sv}>تحدٍّ عملي</p>
                  </div>
                  <div>
                    <p className={styles.sl}>المهارة</p>
                    <p className={styles.sv}>تصميم قواعد البيانات</p>
                  </div>
                  <div>
                    <p className={styles.sl}>التاريخ</p>
                    <p className={`${styles.sv} mono`}>2026-08-28</p>
                  </div>
                  <div>
                    <p className={styles.sl}>التوثيق</p>
                    <p className={styles.sv}>موثّق</p>
                  </div>
                </div>

                <div className={styles.deltas}>
                  <div>
                    <p className="note">النتيجة</p>
                    <p className={styles.dv}>
                      <s>78%</s> <b>← 91%</b>
                    </p>
                  </div>
                  <div>
                    <p className="note">الترتيب</p>
                    <p className={styles.dv}>
                      <s>3</s> <b className={styles.up}>← 1</b>
                    </p>
                  </div>
                  <button
                    className="btn dark"
                    style={{ marginInlineStart: 'auto' }}
                    onClick={() => navigate(ROUTES.RE_RANKING)}
                    id="toReRankingBtn"
                  >
                    اعرض الترتيب الجديد
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* قسم الأدلة كاملة */}
          <section className="box">
            <div className={styles.secrow}>
              <h2>الأدلة كاملة</h2>
              <span className="note">
                مرتّبة بمستوى التوثيق — الضعيف معروض كما هو
              </span>
            </div>

            <div className={styles.evtable}>
              <div className={styles.evhead}>
                <div>المصدر</div>
                <div>النوع</div>
                <div>المهارة</div>
                <div>التاريخ</div>
                <div>التوثيق</div>
              </div>
              <div id="evRows">
                {evidenceList.map((e, idx) => {
                  const isFresh = isTurned && idx === 0
                  const dotType =
                    e[4] === 'موثّق'
                      ? styles.v1
                      : e[4] === 'مرتبط'
                      ? styles.v2
                      : styles.v3
                  return (
                    <div
                      key={`${e[0]}-${idx}`}
                      className={`${styles.evrow} ${isFresh ? styles.fresh : ''}`}
                    >
                      <div>
                        <span className={styles.src}>{e[0]}</span>
                      </div>
                      <div>{e[1]}</div>
                      <div>
                        <span className={styles.sk}>{e[2]}</span>
                      </div>
                      <div className={styles.dt}>{e[3]}</div>
                      <div className={styles.lv}>
                        <span className={`${styles.dot} ${dotType}`} />
                        <span>{e[4]}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        </div>
      </div>

      <InviteModal
        isOpen={isInviteOpen}
        name="ماجد الشمري"
        roleMeta="مهندس Backend · الدمام"
        skill="تصميم قواعد البيانات"
        onClose={() => setIsInviteOpen(false)}
      />
    </section>
  )
}

export default CandidateDetailPage
