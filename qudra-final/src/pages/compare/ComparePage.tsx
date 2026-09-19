/**
 * ComparePage — مقارنة بصمتين فوق بعضهما (Signature Comparison).
 *
 * مطابقة حرفية لـ prototype.html (#cmp):
 * 1. اختيار الشخص الأول (Person A) والشخص الثاني (Person B).
 * 2. رسم بصمتي القدرات متراكبتين SVG لتحديد نقاط التداخل والتكامل.
 * 3. تحليل التغطية المشتركة لكل قدرة وإصدار حكم المنصة الذكي (هل يكمّلان بعضهما أم يتكرران).
 * 4. زر الرجوع للمرشحين.
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import styles from './ComparePage.module.css'

interface CmpPerson {
  name: string
  scores: number[]
}

const CMP_CAPS = [
  'Backend',
  'تصميم قواعد البيانات',
  'REST APIs',
  'التكامل مع الواجهة',
  'الاختبارات',
]

const CMP_PEOPLE: CmpPerson[] = [
  { name: 'نورة العتيبي', scores: [88, 82, 79, 55, 61] },
  { name: 'سارة الحربي', scores: [80, 74, 71, 48, 77] },
  { name: 'ماجد الشمري', scores: [84, 22, 86, 79, 66] },
  { name: 'ريم القحطاني', scores: [44, 31, 52, 88, 58] },
  { name: 'فهد الدوسري', scores: [39, 28, 45, 62, 40] },
]

const ARMS = [
  { a: [1, 0], d: [1, -1], run: 30 },
  { a: [1, 0], d: [1, 1], run: 46 },
  { a: [0, 1], d: [1, 1], run: 34 },
  { a: [-1, 0], d: [-1, 1], run: 40 },
  { a: [0, -1], d: [-1, -1], run: 28 },
]

export function ComparePage() {
  const navigate = useNavigate()
  const [cmpA, setCmpA] = useState(2) // ماجد الشمري
  const [cmpB, setCmpB] = useState(3) // ريم القحطاني

  const personA = CMP_PEOPLE[cmpA]
  const personB = CMP_PEOPLE[cmpB]

  const cx = 210
  const cy = 175
  const S = 0.7071

  const getArmPath = (i: number, score: number) => {
    const arm = ARMS[i]
    const L2 = 24 + score * 0.8
    const x1 = cx + arm.a[0] * arm.run
    const y1 = cy + arm.a[1] * arm.run
    const x2 = x1 + arm.d[0] * L2 * S
    const y2 = y1 + arm.d[1] * L2 * S
    return {
      d: `M${cx} ${cy} L${x1.toFixed(1)} ${y1.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)}`,
      x: x2,
      y: y2,
      dir: arm.d,
    }
  }

  // حساب التغطية المشتركة والحكم
  let holes = 0
  let both = 0
  CMP_CAPS.forEach((_, i) => {
    const a = personA.scores[i]
    const b = personB.scores[i]
    const best = Math.max(a, b)
    if (best < 55) holes++
    if (a >= 65 && b >= 65) both++
  })

  return (
    <section className={`screen wrap ${styles.cmpPage}`} id="cmp" dir="rtl">
      <div className={styles.crumb}>
        <button
          className={styles.back}
          onClick={() => navigate(ROUTES.CANDIDATES)}
        >
          → رجوع للمرشحين
        </button>
        <span>مقارنة بالدليل</span>
      </div>

      <div className={styles.headrow}>
        <div>
          <span className={styles.eyebrow}>Signature Comparison</span>
          <h1 className={styles.scrt}>بصمتان فوق بعضهما</h1>
          <p className={styles.scrp}>
            لا نسأل «من الأفضل؟» — نسأل «من يغطّي ماذا، وهل يكمّلان بعضهما؟»
          </p>
        </div>
      </div>

      {/* منتقي المقارنة */}
      <div className={styles.cmpick}>
        <div className={styles.cpk}>
          <span className={styles.lbl}>الأول (الأسود)</span>
          <div className={styles.cpopts}>
            {CMP_PEOPLE.map((p, idx) => (
              <button
                key={p.name}
                className={`${styles.cpo} ${cmpA === idx ? styles.on : ''}`}
                onClick={() => setCmpA(idx)}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.cpk}>
          <span className={styles.lbl}>الثاني (التركوازي)</span>
          <div className={styles.cpopts}>
            {CMP_PEOPLE.map((p, idx) => (
              <button
                key={p.name}
                className={`${styles.cpo} ${cmpB === idx ? styles.onB : ''}`}
                onClick={() => setCmpB(idx)}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* شبكة البصمة والتحليل الجانبي */}
      <div className={styles.pgrid} style={{ marginTop: '1.2rem' }}>
        <div className="pmain">
          <div className={`box ${styles.cmpbox}`}>
            <svg
              className={styles.cmpsvg}
              viewBox="0 60 420 250"
              role="img"
              aria-label={`مقارنة بصمتَي ${personA.name} و${personB.name}`}
            >
              {/* رسم الشخص الأول (A) */}
              {personA.scores.map((score, i) => {
                const a = getArmPath(i, score)
                const weak = score < 50
                const anchor = a.dir[0] > 0 ? 'start' : 'end'
                const lx = a.x + (a.dir[0] > 0 ? 14 : -14)
                const ly = a.y + (a.dir[1] > 0 ? 15 : -10)

                return (
                  <g key={`A-${i}`}>
                    <path
                      d={a.d}
                      fill="none"
                      stroke="var(--ink)"
                      strokeWidth={3}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity={0.8}
                      strokeDasharray={weak ? '5 5' : undefined}
                    />
                    <circle
                      cx={a.x.toFixed(1)}
                      cy={a.y.toFixed(1)}
                      r={(4 + Math.min(score / 24, 4)).toFixed(1)}
                      fill={weak ? 'none' : 'var(--ink)'}
                      stroke="var(--ink)"
                      strokeWidth={2.2}
                      strokeDasharray={weak ? '3 3' : undefined}
                      opacity={0.85}
                    />
                    <text
                      className={styles.lblA}
                      x={lx.toFixed(1)}
                      y={ly.toFixed(1)}
                      textAnchor={anchor}
                    >
                      {CMP_CAPS[i]}
                    </text>
                  </g>
                )
              })}

              {/* رسم الشخص الثاني (B) */}
              {personB.scores.map((score, i) => {
                const a = getArmPath(i, score)
                const weak = score < 50

                return (
                  <g key={`B-${i}`}>
                    <path
                      d={a.d}
                      fill="none"
                      stroke="var(--accent-fill)"
                      strokeWidth={2.6}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity={0.92}
                      strokeDasharray={weak ? '5 5' : undefined}
                    />
                    <circle
                      cx={a.x.toFixed(1)}
                      cy={a.y.toFixed(1)}
                      r={(4 + Math.min(score / 24, 4)).toFixed(1)}
                      fill={weak ? 'none' : 'var(--accent-fill)'}
                      stroke="var(--accent-fill)"
                      strokeWidth={2.2}
                      strokeDasharray={weak ? '3 3' : undefined}
                      opacity={0.95}
                    />
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
              <circle cx={cx} cy={cy} r="6.5" fill="var(--accent-fill)" />
            </svg>

            <div className={styles.cmpleg}>
              <span>
                <i style={{ background: 'var(--ink)' }} />
                {personA.name}
              </span>
              <span>
                <i style={{ background: 'var(--accent)' }} />
                {personB.name}
              </span>
            </div>

            <p className={styles.sigtip} id="cmpTip">
              الممتلئ مثبت، والمتقطّع بلا دليل. التداخل يعني تكرارًا، والتباعد يعني تكاملًا.
            </p>
          </div>
        </div>

        <aside className="pside">
          <div className={`box ${styles.pcard}`}>
            <h3>التغطية المشتركة</h3>
            <div id="cmpBars" style={{ marginTop: '0.8rem' }}>
              {CMP_CAPS.map((cap, i) => {
                const a = personA.scores[i]
                const b = personB.scores[i]
                const best = Math.max(a, b)
                return (
                  <div key={cap} className={styles.cvr2}>
                    <span className={styles.cvn}>{cap}</span>
                    <span className={styles.cb2}>
                      <i className={styles.a} style={{ width: `${a / 2}%` }} />
                      <i className={styles.b} style={{ width: `${b / 2}%` }} />
                    </span>
                    <span className={styles.cvv2}>{best}%</span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="box" style={{ marginTop: '1rem' }}>
            {holes === 0 && both <= 2 ? (
              <div className={`${styles.cmpv} ${styles.good}`}>
                <span className={styles.vh}>
                  <span className={styles.vd} />
                  يكمّلان بعضهما
                </span>
                <p>
                  معًا يغطّيان <b>{CMP_CAPS.length} من {CMP_CAPS.length}</b> قدرات، وتداخلهما محدود — لا تدفع مرتين لنفس القدرة.
                </p>
              </div>
            ) : holes === 0 ? (
              <div className={`${styles.cmpv} ${styles.warn}`}>
                <span className={styles.vh}>
                  <span className={styles.vd} />
                  تغطية كاملة مع تكرار
                </span>
                <p>
                  يغطّيان كل القدرات، لكن <b>{both}</b> منها يتقنها الاثنان معًا.
                </p>
              </div>
            ) : (
              <div className={`${styles.cmpv} ${styles.warn}`}>
                <span className={styles.vh}>
                  <span className={styles.vd} />
                  توجد فجوة مشتركة
                </span>
                <p>
                  هناك <b>{holes}</b> قدرات لا يغطّيها أي منهما بالشكل المطلوب.
                </p>
              </div>
            )}
          </div>
        </aside>
      </div>
    </section>
  )
}

export default ComparePage
