import type { useNavigate } from 'react-router-dom'
import styles from '../ProfilePage.module.css'

interface DashboardTabProps {
  user: { name: string; avatar: string }
  navigate: ReturnType<typeof useNavigate>
}

export function DashboardTab({ user, navigate }: DashboardTabProps) {
  return (
    <section className="screen" id="u1">
      <div className={styles.phero}>
        <span className={styles.phav}>{user.avatar || 'أ'}</span>
        <div className={styles.phinfo}>
          <h1>{user.name || 'حسابك'}</h1>
          <p>مهندس برمجيات · <span className="num">11</span> دليلًا · محدّث قبل ساعتين</p>
        </div>
        <div className={styles.phact}>
          <span className="pill ready">جاهز · Backend</span>
          <button className="btn ghost" onClick={() => navigate('/profile/passport')}>بطاقتك</button>
        </div>
      </div>

      <div className={styles.pgrid}>
        <div className={styles.pmain}>
          <div className={styles.statstrip}>
            <div><span className={`${styles.sv} num`}>6</span><span className={styles.sk}>دليل موثّق</span></div>
            <div><span className={`${styles.sv} num`}>3</span><span className={styles.sk}>قدرة مثبتة</span></div>
            <div><span className={`${styles.sv} num`}>4</span><span className={styles.sk}>مصادر مرتبطة</span></div>
            <div><span className={`${styles.sv} num`}>2</span><span className={styles.sk}>تنتظر دليلًا</span></div>
          </div>

          <div className="box" style={{ marginTop: '1rem' }}>
            <div className={styles.secrow}>
              <h2>قدراتك المثبتة</h2>
              <button className={styles.linkbtn} onClick={() => navigate('/profile/timeline')}>عرض مسار التطور ←</button>
            </div>
            <div className={styles.skcards} style={{ marginTop: '0.8rem' }}>
              {[
                { name: 'Problem Solving', score: 88, meta: '4 أدلة موثّقة', sub: 'LeetCode · محاكاة' },
                { name: 'UI/UX', score: 85, meta: '3 أدلة موثّقة', sub: 'محاكاة · Figma' },
                { name: 'Product Thinking', score: 78, meta: 'دليلان موثّقان', sub: 'محاكاة قُدرة' },
              ].map((s) => (
                <div key={s.name} className={styles.skc}>
                  <div className={styles.skch}><h4>{s.name}</h4><span className={styles.skv}>{s.score}%</span></div>
                  <div className={styles.skb}><i style={{ width: `${s.score}%` }} /></div>
                  <div className={styles.skm}><span>{s.meta}</span><span>{s.sub}</span></div>
                </div>
              ))}
              <div className={`${styles.skc} ${styles.pend}`}>
                <div className={styles.skch}><h4>Backend</h4><span className={styles.skv}>65%</span></div>
                <div className={`${styles.skb} ${styles.g}`}><i style={{ width: '65%' }} /></div>
                <div className={styles.skm}>
                  <span>تحت عتبة التوثيق</span>
                  <button className={`${styles.linkbtn} ${styles.gap}`} onClick={() => navigate('/profile/gaps')}>سد الفجوة</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside className={styles.pside}>
          <div className={`box ${styles.strengthbox}`}>
            <span className="lbl">قوة ملفك الإجمالية</span>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: '0.3rem' }}>
              <span className={styles.strv}>72%</span>
              <span className="note">قوي وموثوق</span>
            </div>
            <div className={styles.strbar}><i style={{ width: '72%' }} /></div>
            <div className={styles.strrows}>
              {[
                { label: 'التوثيق الآلي', val: '85%' },
                { label: 'تنوع المصادر', val: '75%' },
                { label: 'حداثة الأدلة', val: '90%' },
                { label: 'تغطية المشروع', val: '68%' },
              ].map((r) => (
                <div key={r.label} className={styles.sr}>
                  <span className={styles.srd} />
                  <span>{r.label}: <b>{r.val}</b></span>
                </div>
              ))}
            </div>
          </div>
          <div className="box">
            <h3 style={{ fontSize: '0.98rem', margin: '0 0 0.6rem' }}>مكاسب سريعة</h3>
            <p className="note" style={{ lineHeight: 1.6, margin: 0 }}>
              إضافة اختبارات لمستودع <b>inventory-api</b> ترفع قوة ملفك مباشرة إلى 80%.
            </p>
            <button className={styles.linkbtn} style={{ marginTop: '0.6rem' }} onClick={() => navigate('/profile/evidence/2')}>
              افتح تفاصيل الدليل ←
            </button>
          </div>
        </aside>
      </div>
    </section>
  )
}
