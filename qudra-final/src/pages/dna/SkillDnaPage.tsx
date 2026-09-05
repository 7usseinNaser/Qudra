/**
 * SkillDnaPage — سِجلّ قدراتك (الخطوة 5 من 6).
 *
 * إعادة بناء حرفية لـ prototype.html (#dna):
 * 1. بصمة تفاعلية متولدة بالـ SVG (5 أذرع: 3 مثبتة بلون تركوازي، 2 قيد الإثبات بلون ذهبي).
 * 2. تفاعل التمرير (Hover) على أي ذراع لعرض دليله ومصدره.
 * 3. تبديل وضع البصمة الفارغة لرؤية كيف تبدو قبل أول دليل.
 * 4. قائمة القدرات مع مؤشرات التوثيق (علامة صح للمثبت وعلامة شرطة للمتوقع).
 * 5. صندوق التوضيح المعياري "لماذا هذا ليس CV؟".
 * 6. زر المتابعة إلى شاشة النتيجة والتغطية.
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import styles from './SkillDnaPage.module.css'

interface DnaItem {
  name: string
  score: number
  verified: boolean
  evidence: string
}

const DNA_ITEMS: DnaItem[] = [
  { name: 'Problem Solving', score: 88, verified: true, evidence: 'من مهمة «ما أول شيء ستبنيه» · 2026-08-29' },
  { name: 'UI/UX', score: 85, verified: true, evidence: 'من مهمة «الشاشة الرئيسية للطالب» · 2026-08-29' },
  { name: 'Product Thinking', score: 78, verified: true, evidence: 'من ترتيب الأولويات في المهمة الأولى · 2026-08-29' },
  { name: 'Mobile Development', score: 70, verified: false, evidence: 'لم تُختبر مباشرة — مستنتجة من سياق الإجابات' },
  { name: 'Backend', score: 65, verified: false, evidence: 'من مهمة بنية البيانات · تحت عتبة التوثيق' },
]

const ARMS = [
  { a: [1, 0], d: [1, -1], run: 30 },
  { a: [1, 0], d: [1, 1], run: 46 },
  { a: [0, 1], d: [1, 1], run: 34 },
  { a: [-1, 0], d: [-1, 1], run: 40 },
  { a: [0, -1], d: [-1, -1], run: 28 },
]

const DNA_COLORS = ['#00B8B8', '#00A0A2', '#2FBFAE', '#8AA6A6', '#FFC107']

export function SkillDnaPage() {
  const navigate = useNavigate()
  const [emptyMode, setEmptyMode] = useState(false)
  const [hoveredTip, setHoveredTip] = useState<string | null>(null)

  const cx = 200
  const cy = 170
  const S = 0.7071

  const displayData = emptyMode ? [] : DNA_ITEMS

  return (
    <section className={`screen wrap ${styles.dnaPage}`} id="dna" dir="rtl">
      <span className={styles.stepno}>الخطوة 5 من 6</span>

      <div className={styles.headrow}>
        <div>
          <h1 className={styles.scrt}>سِجلّ قدراتك — Skill DNA</h1>
          <p className={styles.scrp}>
            قبل قليل كانت هذه أسماء في سيرة ذاتية. الآن كل واحدة منها مربوطة بدليل يمكن فتحه.
          </p>
        </div>
        <span className={styles.pillReady}>
          <span className="num">3</span> قدرات موثّقة
        </span>
      </div>

      {/* صندوق البصمة */}
      <div className={`box ${styles.dnabox}`}>
        <div className={styles.secrow}>
          <h2>بصمتك</h2>
          <span className="note">تتولّد من درجاتك — لا تتكرر مع شخص آخر</span>
        </div>

        <div className={styles.sig} style={{ marginTop: '0.6rem' }}>
          <div id="sigHost" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <svg
              className={styles.sigsvg}
              id="sigSvg"
              viewBox="10 58 380 235"
              role="img"
              aria-label="بصمة قدراتك"
            >
              {displayData.map((d, i) => {
                const arm = ARMS[i]
                const col = d.verified ? '#00B8B8' : '#FFC107'
                const L2 = 26 + d.score * 0.88

                const x1 = cx + arm.a[0] * arm.run
                const y1 = cy + arm.a[1] * arm.run
                const x2 = x1 + arm.d[0] * L2 * S
                const y2 = y1 + arm.d[1] * L2 * S
                const r = 4.5 + Math.min(d.score / 18, 6)

                const anchor = arm.d[0] > 0 ? 'start' : 'end'
                const lx = x2 + (arm.d[0] > 0 ? r + 6 : -(r + 6))
                const ly = y2 + (arm.d[1] > 0 ? 12 : -8)

                const pathD = `M${cx} ${cy} L${x1.toFixed(1)} ${y1.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)}`

                return (
                  <g
                    key={d.name}
                    className="grp"
                    onMouseEnter={() => setHoveredTip(`${d.name}: ${d.evidence}`)}
                    onMouseLeave={() => setHoveredTip(null)}
                    style={{ cursor: 'pointer' }}
                  >
                    <path
                      className={`${styles.arm} ${d.verified ? '' : styles.pending}`}
                      d={pathD}
                      fill="none"
                      stroke={col}
                      strokeWidth="3.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeDasharray={d.verified ? undefined : '5 5'}
                    />
                    {/* مسار اللمس الواسع للتفاعل */}
                    <path
                      d={pathD}
                      fill="none"
                      stroke="transparent"
                      strokeWidth="22"
                      strokeLinecap="round"
                    />
                    <circle
                      cx={x2.toFixed(1)}
                      cy={y2.toFixed(1)}
                      r={r.toFixed(1)}
                      fill={d.verified ? col : 'none'}
                      stroke={col}
                      strokeWidth="2.4"
                      strokeDasharray={d.verified ? undefined : '3 3'}
                    />
                    <text
                      className={`${styles.lbl} ${d.verified ? styles.lblv : ''}`}
                      x={lx.toFixed(1)}
                      y={ly.toFixed(1)}
                      textAnchor={anchor}
                    >
                      {d.name} {d.score}
                    </text>
                  </g>
                )
              })}

              {/* النواة المركزية */}
              <circle
                cx={cx}
                cy={cy}
                r="15"
                fill="none"
                stroke="var(--ink)"
                strokeWidth="5"
              />
              <circle cx={cx} cy={cy} r="6.5" fill="#00B8B8" />
            </svg>
          </div>

          <p className={styles.sigtip} id="sigTip">
            {hoveredTip || 'مرّر على أي ذراع لترى دليلها.'}
          </p>

          <p className={styles.signote}>
            النواة أنت. كل ذراع قدرة: طولها المستوى، وحجم عقدتها عدد الأدلة.
            الممتلئة مثبتة، والمتقطّعة تنتظر دليلًا.
          </p>

          <button
            className={styles.emptybtn}
            id="emptyBtn"
            onClick={() => setEmptyMode(!emptyMode)}
          >
            {emptyMode ? 'عرض البصمة بالأدلة الموثّقة' : 'كيف تبدو البصمة قبل أول دليل؟'}
          </button>

          {emptyMode && (
            <div className={styles.emptynote} id="emptyNote">
              نواة بلا أذرع. <b>ملفك فارغ لأنك لم تثبت شيئًا بعد</b> — وهذا بالضبط المكان الصحيح للبدء.
              أول محاكاة تحلّها ترسم أول ذراع.
            </div>
          )}
        </div>

        <div className={styles.strandkey} id="strandKey">
          {DNA_ITEMS.map((d, i) => (
            <span key={d.name}>
              <i style={{ background: DNA_COLORS[i] }} />
              {d.name}
            </span>
          ))}
        </div>
      </div>

      {/* صندوق قائمة القدرات والتفاصيل */}
      <div className="box" style={{ marginTop: '1rem' }}>
        <div className={styles.secrow}>
          <h2>القدرات</h2>
          <span className="note">الشريط = المستوى · العلامة = مستوى التوثيق</span>
        </div>

        <div id="dnaList" style={{ marginTop: '1rem' }}>
          {DNA_ITEMS.map((d) => (
            <div
              key={d.name}
              className={`${styles.dnarow} ${d.verified ? '' : styles.weak}`}
            >
              <span className={styles.nm}>
                {d.verified ? (
                  <span className={styles.vtick} />
                ) : (
                  <span className={styles.vdash} />
                )}
                {d.name}
              </span>
              <span className={styles.bt}>
                <i style={{ width: `${d.score}%` }} />
              </span>
              <span className={styles.sc}>{d.score}%</span>
              <span className={styles.ev}>{d.evidence}</span>
            </div>
          ))}
        </div>
      </div>

      {/* صندوق لماذا هذا ليس CV */}
      <div className="box" style={{ marginTop: '1rem' }}>
        <div className={styles.flag}>
          <h3 style={{ fontSize: '0.98rem', marginBottom: '0.4rem' }}>
            لماذا هذا ليس CV؟
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--ink-2)', lineHeight: 1.6 }}>
            كل رقم فوق جاء من مهمة حلّيتها قبل دقائق، ومحفوظ معه سؤالها وإجابتك وتقييمها.
            أي شركة تفتح ملفك تستطيع فتح الدليل نفسه — لا أن تصدّقك.
          </p>
        </div>
      </div>

      <div className="row" style={{ marginTop: '1.4rem' }}>
        <button
          className="btn dark"
          onClick={() => navigate(ROUTES.RESULT)}
          id="toResultBtn"
        >
          ما الذي ينقصني لإكمال المشروع؟
        </button>
      </div>
    </section>
  )
}

export default SkillDnaPage
