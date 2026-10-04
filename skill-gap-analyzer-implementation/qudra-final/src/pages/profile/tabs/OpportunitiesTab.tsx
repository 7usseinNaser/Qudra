import { useState } from 'react'
import styles from '../ProfilePage.module.css'

interface Opportunity {
  title: string
  co: string
  score: string
  scoreNum: number
  cls: string
  pill: string
  need: string
}

const OPPORTUNITIES: Opportunity[] = [
  { title: 'تحليل مكالمات مركز اتصال بالعربية', co: 'شركة اتصالات · عن بُعد · شهران', score: '91%', scoreNum: 91, cls: 'ready', pill: 'جاهز الآن', need: 'كل القدرات المطلوبة مغطّاة بأدلة حديثة. يمكنك التقديم مباشرة.' },
  { title: 'منصة تجارة إلكترونية — فريق منتج', co: 'شركة تجزئة · هجين · 4 أشهر', score: '84%', scoreNum: 84, cls: 'near', pill: 'قريب', need: 'ينقصك دليل على GraphQL. المستودعات الحالية تغطي REST فقط.' },
  { title: 'تطبيق توصيل سريع — خدمات البنية التحتية', co: 'شركة تقنية مالية · الرياض · 6 أشهر', score: '79%', scoreNum: 79, cls: 'near', pill: 'قريب', need: 'مطلوب إثبات التعامل مع حركة عالية (High Throughput).' },
  { title: 'نظام إدارة عيادات ومواعيد طبية', co: 'قطاع صحي · جدة · 3 أشهر', score: '65%', scoreNum: 65, cls: 'far', pill: 'يحتاج مسارًا', need: 'فجوتان في واجهات المستخدم وتوافق معايير HIPAA.' },
]

export function OpportunitiesTab() {
  const [applyingTo, setApplyingTo] = useState<string | null>(null)
  const [viewingDetail, setViewingDetail] = useState<string | null>(null)

  return (
    <section className="screen" id="u4">
      <div className={styles.headrow}>
        <div>
          <span className={styles.eyebrow}>Opportunities</span>
          <h1 className={styles.scrt}>فرص حقيقية، مع سبب كل رقم</h1>
          <p className={styles.scrp}>
            لا نخفي الفرص التي تنقصك فيها قدرة — نعرضها ونقول لك بالضبط ما يفصلك عنها.
          </p>
        </div>
      </div>

      <div className={styles.pgrid}>
        <div className={styles.pmain}>
          {OPPORTUNITIES.map((o) => (
            <div key={o.title} className={styles.opp}>
              <div>
                <h4>{o.title}</h4>
                <div className={styles.co}>{o.co}</div>
              </div>
              <div className={styles.sc} style={{
                color: o.scoreNum >= 85 ? 'var(--accent)' : o.scoreNum >= 75 ? 'var(--ink-2)' : 'var(--ink-3)'
              }}>{o.score}</div>
              <div className={styles.need}>
                <span className={`pill ${o.cls}`} style={{ marginInlineEnd: '0.5rem' }}>{o.pill}</span>
                {o.need}
              </div>
              <div className="row" style={{ gap: '0.5rem', marginTop: '0.6rem' }}>
                <button
                  className="btn dark"
                  onClick={() => setApplyingTo(o.title)}
                  disabled={o.cls === 'far'}
                  style={o.cls === 'far' ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                >
                  {o.cls === 'far' ? 'يحتاج مسارًا أولًا' : 'تقديم'}
                </button>
                <button
                  className="btn ghost"
                  onClick={() => setViewingDetail(o.title)}
                >
                  التفاصيل
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {applyingTo && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
        }} onClick={() => setApplyingTo(null)}>
          <div className="box" style={{
            maxWidth: '30rem',
            width: '90%',
            padding: '2rem',
            background: 'var(--card)',
            borderRadius: '1rem',
          }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '1rem' }}>تقديم على: {applyingTo}</h3>
            <p className="note" style={{ marginBottom: '1.5rem' }}>
              سيتم إرسال بطاقتك (جواز الأدلة) بدل سيرة ذاتية. الشركة سترى قدراتك المثبتة بالأدلة فقط.
            </p>
            <div className="row" style={{ gap: '0.8rem' }}>
              <button className="btn dark" onClick={() => setApplyingTo(null)}>
                إرسال البطاقة
              </button>
              <button className="btn ghost" onClick={() => setApplyingTo(null)}>
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {viewingDetail && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
        }} onClick={() => setViewingDetail(null)}>
          <div className="box" style={{
            maxWidth: '34rem',
            width: '90%',
            padding: '2rem',
            background: 'var(--card)',
            borderRadius: '1rem',
          }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '0.5rem' }}>{viewingDetail}</h3>
            {(() => {
              const o = OPPORTUNITIES.find(op => op.title === viewingDetail)
              return o ? (
                <>
                  <p className="note" style={{ marginBottom: '1rem' }}>{o.co}</p>
                  <div style={{ marginBottom: '1rem' }}>
                    <span className={`pill ${o.cls}`} style={{ marginInlineEnd: '0.5rem' }}>{o.pill}</span>
                    <span className="num" style={{ color: 'var(--accent)', fontWeight: 700 }}>{o.score}</span>
                  </div>
                  <p style={{ fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>{o.need}</p>
                  <button className="btn ghost" onClick={() => setViewingDetail(null)}>إغلاق</button>
                </>
              ) : null
            })()}
          </div>
        </div>
      )}
    </section>
  )
}
