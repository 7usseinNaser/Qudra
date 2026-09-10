import { useState } from 'react'
import styles from '../ProfilePage.module.css'
import { MY_EVIDENCES } from '../profile-data'

interface EvidenceTabProps {
  onOpenEvidence: (idx: number) => void
}

export function EvidenceTab({ onOpenEvidence }: EvidenceTabProps) {
  const [filter, setFilter] = useState<'all' | 'موثّق' | 'مرتبط' | 'ذاتي'>('all')

  const filtered = MY_EVIDENCES.filter((e) => filter === 'all' || e.level === filter)

  const counts = { all: 11, 'موثّق': 6, 'مرتبط': 3, 'ذاتي': 2 }

  return (
    <section className="screen" id="u3">
      <div className={styles.headrow}>
        <div>
          <span className={styles.eyebrow}>My Evidence</span>
          <h1 className={styles.scrt}>‏<span className="num">11</span> دليلًا، كلها قابلة للفحص</h1>
          <p className={styles.scrp}>
            أي شركة تفتح ملفك ترى المصدر والتاريخ ومستوى التحقق. لا شيء مخفي، ولا شيء مبالغ فيه.
          </p>
        </div>
      </div>

      <div className={styles.pgrid}>
        <div className={styles.pmain}>
          <div className={styles.filters}>
            {(['all', 'موثّق', 'مرتبط', 'ذاتي'] as const).map((f) => (
              <button key={f} className={`${styles.flt} ${filter === f ? styles.on : ''}`} onClick={() => setFilter(f)}>
                {f === 'all' ? 'الكل' : f === 'ذاتي' ? 'مُعلن' : f} <span className={styles.fc}>{counts[f]}</span>
              </button>
            ))}
          </div>

          <div className={styles.evlist}>
            {filtered.map((e, idx) => (
              <div
                key={`${e.title}-${idx}`}
                className={`${styles.evi} ${e.level === 'ذاتي' ? styles.weak : ''}`}
                onClick={() => onOpenEvidence(MY_EVIDENCES.indexOf(e))}
                style={{ cursor: 'pointer' }}
              >
                <span className={styles.eic}>{e.src.slice(0, 2).toUpperCase()}</span>
                <div>
                  <h4>{e.title}</h4>
                  <div className={styles.em}>
                    <span>النوع: <b>{e.type}</b></span>
                    <span>المهارة: <b>{e.skill}</b></span>
                    <span>التاريخ: <b className="mono">{e.date}</b></span>
                  </div>
                </div>
                <span className={styles.er}>
                  <span className={`${styles.vb} ${e.level === 'موثّق' ? styles.v1 : e.level === 'مرتبط' ? styles.v2 : styles.v3}`}>
                    <span className={styles.dot} /> {e.level}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>

        <aside className={styles.pside}>
          <div className={`box ${styles.pcard}`}>
            <h3>توزيع التوثيق</h3>
            <div style={{ display: 'grid', gap: '0.6rem', marginTop: '0.8rem' }}>
              {[
                { cls: styles.v1, label: 'موثّق', stat: '6 من 11 (55%)' },
                { cls: styles.v2, label: 'مرتبط', stat: '3 من 11 (27%)' },
                { cls: styles.v3, label: 'مُعلن', stat: '2 من 11 (18%)' },
              ].map((r) => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                  <span className={`${styles.vb} ${r.cls}`}><span className={styles.dot} /> {r.label}</span>
                  <span className="mono">{r.stat}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}
