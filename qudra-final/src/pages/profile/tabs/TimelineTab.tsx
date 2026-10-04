import { useState } from 'react'
import styles from '../ProfilePage.module.css'
import { TL_DATA, TL_MONTHS, tlx, tly } from '../profile-data'

export function TimelineTab() {
  const [hoveredPoint, setHoveredPoint] = useState<string | null>(null)

  return (
    <section className="screen" id="u6">
      <div className={styles.headrow}>
        <div>
          <span className={styles.eyebrow}>Capability Over Time</span>
          <h1 className={styles.scrt}>قدراتك ليست لقطة — هي مسار</h1>
          <p className={styles.scrp}>
            كل نقطة هنا دليل دخل ملفك ورفع قدرة. والخط الهابط دليل يفقد وزنه لأن شيئًا لم يسنده.
          </p>
        </div>
      </div>

      <div className={styles.pgrid}>
        <div className={styles.pmain}>
          <div className={`box ${styles.tlbox}`}>
            <div className={styles.tlkey}>
              {TL_DATA.map((t) => (
                <span key={t.name}>
                  <i style={{ background: t.color }} />
                  {t.name} {t.isDashed ? '(هابط)' : ''}
                </span>
              ))}
            </div>

            <div className={styles.tlwrap}>
              <svg className={styles.tlsvg} viewBox="0 0 700 285" role="img" aria-label="تطوّر قدراتك عبر الزمن">
                {[0, 25, 50, 75, 100].map((v) => (
                  <g key={`grid-${v}`}>
                    <line className={styles.gl} x1="46" y1={tly(v).toFixed(1)} x2="682" y2={tly(v).toFixed(1)} />
                    <text className={styles.ax} x="38" y={(tly(v) + 3).toFixed(1)} textAnchor="end">{v}</text>
                  </g>
                ))}
                {TL_MONTHS.map((m, i) => (
                  <text key={m} className={styles.ax} x={tlx(i * 2).toFixed(1)} y="272" textAnchor="middle">{m}</text>
                ))}
                {TL_DATA.map((sr) => {
                  const pathStr = sr.points
                    .map((pt, i) => `${i ? 'L' : 'M'}${tlx(pt[0]).toFixed(1)} ${tly(pt[1]).toFixed(1)}`)
                    .join(' ')
                  return (
                    <g key={sr.name}>
                      <path className={styles.ln} d={pathStr} stroke={sr.color} strokeDasharray={sr.isDashed ? '6 5' : undefined} />
                      {sr.points.map((pt, pi) => {
                        if (pt[1] === 0) return null
                        return (
                          <circle
                            key={pi}
                            className={styles.pt}
                            cx={tlx(pt[0]).toFixed(1)}
                            cy={tly(pt[1]).toFixed(1)}
                            r="5"
                            fill="var(--card)"
                            stroke={sr.color}
                            strokeWidth="2.6"
                            onMouseEnter={() => setHoveredPoint(`${sr.name} (${pt[1]}%): ${pt[2]}`)}
                            onMouseLeave={() => setHoveredPoint(null)}
                          />
                        )
                      })}
                    </g>
                  )
                })}
              </svg>
            </div>

            <div className={styles.tltip}>
              {hoveredPoint ? <b>{hoveredPoint}</b> : 'مرّر على أي نقطة لترى الدليل الذي سبّبها.'}
            </div>
          </div>

          <div className="box" style={{ marginTop: '1rem' }}>
            <div className={styles.secrow}>
              <h2>ثلاث قصص في هذا الرسم</h2>
            </div>
            <div className={styles.stories}>
              {[
                { cls: styles.teal, title: 'صعود بطيء ومتراكم — Backend', desc: 'خمسة أدلة على مدى سنة. لا قفزة واحدة، بل بناء هادئ مستمر يرفع الثقة.' },
                { cls: styles.teal2, title: 'محاكاة قُدرة رسمت أول نقطة — UI/UX', desc: 'لم يكن هناك دليل إطلاقًا حتى حُلّت المحاكاة، فرُسمت النقطة مباشرة بقيمة 85%.' },
                { cls: styles.amber, title: 'شهادة قديمة تفقد وزنها — Speech Processing', desc: 'دورة من 2024 بلا أي مشروع يسندها. وزنها انخفض إلى النصف لأنها لم تُمارس.' },
              ].map((s) => (
                <div key={s.title} className={styles.sty}>
                  <span className={`${styles.stn} ${s.cls}`} />
                  <div>
                    <b>{s.title}</b>
                    <em>{s.desc}</em>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
