import { useState } from 'react'
import styles from '../ProfilePage.module.css'

interface SourceItem {
  name: string
  linked: boolean
  status: string
  action: string
  output: string
}

const SOURCES: SourceItem[] = [
  { name: 'GitHub', linked: true, status: 'متصل باسم qudra-org · فُحص قبل ساعتين', action: 'إدارة', output: 'أنتج 3 مستودعات موثّقة و12 التزامًا مفحوصًا.' },
  { name: 'LeetCode', linked: true, status: 'متصل باسم mash · محدّث في 2026-06', action: 'إدارة', output: 'أنتج تقييم خوارزميات بدرجة 70%.' },
  { name: 'مشاريع العملاء الفعلية', linked: true, status: 'موثقة عبر المنصة · مشروعان معتمدان', action: 'إدارة', output: 'أنتج أدلة في التكامل مع الواجهة وتسليم المواعيد.' },
  { name: 'الشهادات والتقييم الذاتي', linked: false, status: 'شهادة واحدة مسجلة · مستوى إثبات: ذاتي', action: 'إضافة', output: 'الشهادات القديمة تفقد وزنها تدريجيًا ما لم تُسند بمشروع عملي.' },
]

export function SourcesTab() {
  const [managingSource, setManagingSource] = useState<string | null>(null)
  const [addingSource, setAddingSource] = useState(false)

  const handleAction = (s: SourceItem) => {
    if (s.linked) {
      setManagingSource(s.name)
    } else {
      setAddingSource(true)
    }
  }

  return (
    <section className="screen" id="u0">
      <div className={styles.headrow}>
        <div>
          <span className={styles.eyebrow}>Evidence Sources</span>
          <h1 className={styles.scrt}>من أين تأتي أدلتك</h1>
          <p className={styles.scrp}>
            لا تكتب مهاراتك — اربط حساباتك ودع مشاريعك تتكلم. نفحص البنية ونحدّث ملفك آليًا.
          </p>
        </div>
      </div>

      <div className={styles.srcs}>
        {SOURCES.map((s) => (
          <div key={s.name} className={`${styles.srcCard} ${s.linked ? styles.linked : ''}`}>
            <div>
              <h4>{s.name}</h4>
              <p className={styles.st}>{s.status}</p>
            </div>
            <button className={styles.act} onClick={() => handleAction(s)}>
              {s.action}
            </button>
            <div className={styles.out}>{s.output}</div>
          </div>
        ))}
      </div>

      {managingSource && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
        }} onClick={() => setManagingSource(null)}>
          <div className="box" style={{
            maxWidth: '32rem',
            width: '90%',
            padding: '2rem',
            background: 'var(--card)',
            borderRadius: '1rem',
          }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '1rem' }}>إدارة {managingSource}</h3>
            <p className="note" style={{ marginBottom: '1.5rem' }}>
              {managingSource === 'GitHub'
                ? 'المصدر متصل حاليًا. يمكنك إعادة الفحص، تحديث المستودعات، أو قطع الاتصال.'
                : 'المصدر متصل حاليًا. يمكنك إعادة الفحص أو قطع الاتصال.'}
            </p>
            <div className="row" style={{ gap: '0.8rem', flexWrap: 'wrap' }}>
              <button className="btn dark" onClick={() => setManagingSource(null)}>
                إعادة الفحص الآن
              </button>
              <button className="btn ghost" onClick={() => setManagingSource(null)}>
                إغلاق
              </button>
            </div>
            <p className="note" style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--ink-3)' }}>
              إعادة الفحص تبحث عن تغييرات في المستودعات المرتبطة وتحدّث الأدلة تلقائيًا.
            </p>
          </div>
        </div>
      )}

      {addingSource && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
        }} onClick={() => setAddingSource(false)}>
          <div className="box" style={{
            maxWidth: '32rem',
            width: '90%',
            padding: '2rem',
            background: 'var(--card)',
            borderRadius: '1rem',
          }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '1rem' }}>إضافة شهادة أو تقييم ذاتي</h3>
            <p className="note" style={{ marginBottom: '1.5rem' }}>
              الشهادات والتقييمات الذاتية لها وزن أقل من الأدلة الموثّقة آليًا. اربطها بمشروع عملي لرفع وزنها.
            </p>
            <div className="row" style={{ gap: '0.8rem', flexWrap: 'wrap' }}>
              <button className="btn dark" onClick={() => setAddingSource(false)}>
                أضف شهادة
              </button>
              <button className="btn ghost" onClick={() => setAddingSource(false)}>
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
