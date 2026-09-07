import styles from '../ProfilePage.module.css'
import { MY_EVIDENCES } from '../profile-data'

interface EvidenceDetailTabProps {
  evidenceIndex: number
  navigate: (route: string) => void
}

export function EvidenceDetailTab({ evidenceIndex, navigate }: EvidenceDetailTabProps) {
  const selected = MY_EVIDENCES[evidenceIndex] || MY_EVIDENCES[0]

  return (
    <section className="screen" id="evd">
      <div className={styles.crumb}>
        <button className={styles.back} onClick={() => navigate('/profile/evidence')}>→ رجوع لأدلتي</button>
        <span>تفاصيل الدليل</span>
      </div>

      <div className={styles.pgrid}>
        <div className={styles.pmain}>
          <div className={`box ${styles.evdhead}`}>
            <div className={styles.evdtop}>
              <span className={`${styles.eic} ${styles.big}`}>{selected.src.slice(0, 2).toUpperCase()}</span>
              <div>
                <h1>{selected.title}</h1>
                <p className="mono" style={{ color: 'var(--ink-3)', margin: 0 }}>
                  {selected.src === 'GitHub' ? selected.title : `${selected.type} · ${selected.src}`}
                </p>
              </div>
              <span
                className={`${styles.vb} ${selected.level === 'موثّق' ? styles.v1 : selected.level === 'مرتبط' ? styles.v2 : styles.v3}`}
                style={{ marginInlineStart: 'auto' }}
              >
                <span className={styles.dot} /> {selected.level}
              </span>
            </div>
            <div className={styles.evdmeta}>
              <div><span className={styles.k}>النوع:</span><span className={styles.v}>{selected.type}</span></div>
              <div><span className={styles.k}>المهارة:</span><span className={styles.v}>{selected.skill}</span></div>
              <div><span className={styles.k}>التاريخ:</span><span className={`${styles.v} mono`}>{selected.date}</span></div>
              <div><span className={styles.k}>المصدر:</span><span className={styles.v}>{selected.src}</span></div>
            </div>
          </div>

          <div className="box" style={{ marginTop: '1rem' }}>
            <div className={styles.secrow}>
              <h2>ما استخرجته قُدرة</h2>
              <span className="note">تحليل آلي للمحتوى</span>
            </div>
            <div className="row" style={{ gap: '0.4rem', marginTop: '0.9rem', flexWrap: 'wrap' }}>
              <span className="tag proven">Backend</span>
              <span className="tag proven">PostgreSQL</span>
              <span className="tag proven">REST APIs</span>
              <span className="tag proven">Testing</span>
            </div>
            <div className={styles.hr} />
            <div className={styles.sigrid}>
              {[
                { label: 'التعقيد', val: '82%', note: 'عالٍ' },
                { label: 'الاكتمال', val: '90%', note: 'منشور' },
                { label: 'وجود اختبارات', val: '64%', note: 'جزئي' },
                { label: 'وضوح التوثيق', val: '75%', note: 'جيد' },
              ].map((s) => (
                <div key={s.label} className={styles.sgi}>
                  <span>{s.label}</span>
                  <span className={styles.sgb}><i style={{ width: s.val }} /></span>
                  <span className="mono">{s.note}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={`box ${styles.verifbox}`} style={{ marginTop: '1rem' }}>
            <span className={styles.tiph2}>
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 3 4 6v6c0 5 3.4 8.4 8 9 4.6-.6 8-4 8-9V6z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
              كيف تحقّقنا منه
            </span>
            <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--ink-2)', lineHeight: 1.6 }}>
              قرأنا المستودع مباشرة عبر GitHub App بصلاحية قراءة فقط: البنية، سجلّ الالتزامات، الاختبارات، وملف README. لم يُدخل شيء يدويًا.
            </p>
            <p className="mono" style={{ marginTop: '0.6rem', color: 'var(--ink-3)', fontSize: '0.8rem', margin: 0 }}>
              آخر فحص 2026-08-29 · 04:12
            </p>
          </div>
        </div>

        <aside className={styles.pside}>
          <div className={`box ${styles.impactbox}`}>
            <span className="lbl">أثره على ملفك</span>
            <div className={styles.impbig}>
              <span className={styles.imnum}>74</span>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--accent)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M19 12H5" />
                <path d="m12 19-7-7 7-7" />
              </svg>
              <span className={`${styles.imnum} ${styles.big}`}>86</span>
            </div>
            <p className="note" style={{ margin: 0 }}>
              هذا الدليل وحده رفع تغطيتك لـ <b style={{ color: 'var(--accent)' }}>Backend</b> اثنتي عشرة نقطة.
            </p>
            <div className={styles.hr} />
            <span className="lbl">قدرات تأثّرت</span>
            <div className={styles.afflist}>
              <div className={styles.aff}><span>Backend</span><span className="mono">+12</span></div>
              <div className={styles.aff}><span>REST APIs</span><span className="mono">+8</span></div>
              <div className={styles.aff}><span>Testing</span><span className="mono">+3</span></div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}
