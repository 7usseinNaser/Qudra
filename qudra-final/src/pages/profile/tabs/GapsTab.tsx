import { Tag } from '../../../components/ui/Tag'
import styles from '../ProfilePage.module.css'

interface GapsTabProps {
  navigate: (route: string) => void
}

export function GapsTab({ navigate }: GapsTabProps) {
  return (
    <section className="screen" id="u2">
      <div className={styles.headrow}>
        <div>
          <h1 className={styles.scrt}>من Backend إلى Full Stack</h1>
          <p className={styles.scrp}>
            جاهزيتك الحالية 68%. الناقص عنصران، وكل خطوة تنتهي بدليل — لا بمشاهدة دورة.
          </p>
        </div>
        <span className="pill near">فجوتان</span>
      </div>

      <div className={styles.pgrid}>
        <div className={styles.pmain}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(14rem, 1fr))', gap: '1rem' }}>
            <div className="box">
              <h3 style={{ fontSize: '0.95rem', color: 'var(--accent)', marginBottom: '0.7rem' }}>ما لديك</h3>
              <div className="row" style={{ gap: '0.4rem', flexWrap: 'wrap' }}>
                <Tag name="Node.js" variant="proven" evidenceCount={6} size="sm" />
                <Tag name="PostgreSQL" variant="proven" evidenceCount={4} size="sm" />
                <Tag name="REST APIs" variant="proven" evidenceCount={3} size="sm" />
              </div>
            </div>
            <div className="box">
              <h3 style={{ fontSize: '0.95rem', color: 'var(--gapc, #e6a23c)', marginBottom: '0.7rem' }}>ما ينقصك</h3>
              <div className="row" style={{ gap: '0.4rem', flexWrap: 'wrap' }}>
                <Tag name="React Component State" variant="claimed" size="sm" />
                <Tag name="CSS Layout Architecture" variant="claimed" size="sm" />
              </div>
            </div>
          </div>

          <div className="box" style={{ marginTop: '1rem' }}>
            <div className={styles.secrow}>
              <h2>مسار سد الفجوة</h2>
              <span className="note">كل خطوة تنتهي بدليل قابل للفحص</span>
            </div>
            <div style={{ display: 'grid', gap: '0.6rem', marginTop: '0.8rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', background: 'var(--soft)', padding: '0.8rem 1rem', borderRadius: '10px' }}>
                <span className="mono" style={{ color: 'var(--accent)', fontWeight: 600 }}>01</span>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: 0, fontSize: '0.92rem' }}>تعلّم: بنية الحالة في React</h4>
                  <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: 'var(--ink-2)' }}>مفاهيم React State والتكامل مع واجهات REST.</p>
                </div>
                <span className="pill ready">مقترح</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', background: 'var(--soft)', padding: '0.8rem 1rem', borderRadius: '10px' }}>
                <span className="mono" style={{ color: 'var(--accent)', fontWeight: 600 }}>02</span>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: 0, fontSize: '0.92rem' }}>أثبت: محاكاة تفاعلية</h4>
                  <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: 'var(--ink-2)' }}>بناء شاشة واحدة كاملة مع ربطها بالـ Backend الحالي.</p>
                </div>
                <button className="btn" style={{ padding: '0.3rem 0.8rem', fontSize: '0.82rem' }} onClick={() => navigate('/simulation')}>ابدأ التحدي</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
