import styles from '../ProfilePage.module.css'

export function OpportunitiesTab() {
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
          {[
            { title: 'تحليل مكالمات مركز اتصال بالعربية', co: 'شركة اتصالات · عن بُعد · شهران', score: '91%', cls: 'ready', pill: 'جاهز الآن', need: 'كل القدرات المطلوبة مغطّاة بأدلة حديثة. يمكنك التقديم مباشرة.' },
            { title: 'منصة تجارة إلكترونية — فريق منتج', co: 'شركة تجزئة · هجين · 4 أشهر', score: '84%', cls: 'near', pill: 'قريب', need: 'ينقصك دليل على GraphQL. المستودعات الحالية تغطي REST فقط.' },
            { title: 'تطبيق توصيل سريع — خدمات البنية التحتية', co: 'شركة تقنية مالية · الرياض · 6 أشهر', score: '79%', cls: 'near', pill: 'قريب', need: 'مطلوب إثبات التعامل مع حركة عالية (High Throughput).' },
            { title: 'نظام إدارة عيادات ومواعيد طبية', co: 'قطاع صحي · جدة · 3 أشهر', score: '65%', cls: 'far', pill: 'يحتاج مسارًا', need: 'فجوتان في واجهات المستخدم وتوافق معايير HIPAA.' },
          ].map((o) => (
            <div key={o.title} className={styles.opp}>
              <div>
                <h4>{o.title}</h4>
                <div className={styles.co}>{o.co}</div>
              </div>
              <div className={styles.sc} style={{ color: o.score === '91%' ? 'var(--accent)' : o.score === '84%' ? 'var(--accent)' : o.score === '79%' ? 'var(--ink-2)' : 'var(--ink-3)' }}>{o.score}</div>
              <div className={styles.need}>
                <span className={`pill ${o.cls}`} style={{ marginInlineEnd: '0.5rem' }}>{o.pill}</span>
                {o.need}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
