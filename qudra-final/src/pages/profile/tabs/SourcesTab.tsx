import styles from '../ProfilePage.module.css'

export function SourcesTab() {
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
        {[
          { name: 'GitHub', linked: true, status: 'متصل باسم qudra-org · فُحص قبل ساعتين', action: 'إدارة', output: 'أنتج 3 مستودعات موثّقة و12 التزامًا مفحوصًا.' },
          { name: 'LeetCode', linked: true, status: 'متصل باسم mash · محدّث في 2026-06', action: 'إدارة', output: 'أنتج تقييم خوارزميات بدرجة 70%.' },
          { name: 'مشاريع العملاء الفعلية', linked: true, status: 'موثقة عبر المنصة · مشروعان معتمدان', action: 'إدارة', output: 'أنتج أدلة في التكامل مع الواجهة وتسليم المواعيد.' },
          { name: 'الشهادات والتقييم الذاتي', linked: false, status: 'شهادة واحدة مسجلة · مستوى إثبات: ذاتي', action: 'إضافة', output: 'الشهادات القديمة تفقد وزنها تدريجيًا ما لم تُسند بمشروع عملي.' },
        ].map((s) => (
          <div key={s.name} className={`${styles.srcCard} ${s.linked ? styles.linked : ''}`}>
            <div>
              <h4>{s.name}</h4>
              <p className={styles.st}>{s.status}</p>
            </div>
            <button className={styles.act}>{s.action}</button>
            <div className={styles.out}>{s.output}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
