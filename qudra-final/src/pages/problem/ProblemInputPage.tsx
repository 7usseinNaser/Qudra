import { ROUTES } from '../../constants/routes'
import styles from './ProblemInputPage.module.css'

export function ProblemInputPage() {
  return (
    <main id="main" className="wrap" tabIndex={-1} style={{ padding: 'clamp(1.5rem,4vw,2.75rem) 0 5rem' }}>
      <span className="stepno">الخطوة 1 من 6</span>
      <div className="headrow">
        <div>
          <h1 className="scr-t">ما المشكلة التي تريد حلّها؟</h1>
          <p className="scr-p">لا نسألك عن مهاراتك. اكتب المشكلة بلغتك، ونحن نستخرج القدرات — ثم نختبرك عليها.</p>
        </div>
      </div>
      <div className={styles.pgrid}>
        <div className={styles.pmain}>
          <div className={styles.tawrap}>
            <textarea className={styles.ta} aria-label="وصف المشكلة" rows={5} defaultValue="أريد بناء تطبيق يساعد طلاب الجامعة على إيجاد موادهم ومواعيدهم بسهولة." />
            <div className={styles.tafoot}>
              <span className="mono">72 / 2000</span>
              <span>لا تحتاج مسمّى وظيفي</span>
            </div>
          </div>
          <div className="row" style={{ marginTop: '1.4rem' }}>
            <button className="btn dark">حلّل المشكلة</button>
            <span className="note">متوسط الزمن <span className="num">14</span> ثانية</span>
          </div>
        </div>
        <aside className={styles.pside}>
          <div className="box">
            <h3 style={{ fontSize: '1rem', marginBottom: '.9rem' }}>ماذا يحدث بعد الضغط</h3>
            <ol className={styles.mini}>
              <li><span className={styles.mn}>1</span><div><b>نفكّك نصّك</b><em>نستخرج الهدف والقيود والقدرات المطلوبة.</em></div></li>
              <li><span className={styles.mn}>2</span><div><b>نولّد لك محاكاة</b><em>مهام حقيقية من مشكلتك أنت.</em></div></li>
              <li><span className={styles.mn}>3</span><div><b>نحوّل نتيجتك دليلًا</b><em>تقييمك يصير قدرات موثّقة.</em></div></li>
            </ol>
          </div>
        </aside>
      </div>
      <div className="row" style={{ marginTop: '2rem' }}>
        <a href={ROUTES.LANDING} className="btn ghost">← رجوع للرئيسية</a>
      </div>
    </main>
  )
}
export default ProblemInputPage
