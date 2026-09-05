/**
 * CapabilitiesPage — الشاشة الثانية في تدفق صاحب المشكلة (القدرات المطلوبة).
 *
 * أُعيد بناؤها مطابقة 100% لـ prototype.html (الأسطر 2050–2130):
 * - ملخص المشكلة كما فهمها النظام مع التصنيف.
 * - شبكة بطاقات القدرات الخمس المستخرجة (3 أساسية و2 مساندة) مع أيقوناتها ونصوصها الأصلية.
 * - بطاقة الدعوة للمحاكاة: «الآن سنختبر قدرتك عليها» مع زر «ابدأ المحاكاة».
 * - الشريط الجانبي: كيف رتبنا الأولوية، ما استُثني عن قصد، ونبذة عما سيُختبر في المحاكاة.
 *
 * راجع PROJECT_MAP.md → src/pages/capabilities/CapabilitiesPage.tsx للتفاصيل الكاملة.
 */

import { Link, useNavigate } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import { useProblem } from '../../contexts/ProblemContext'
import styles from './CapabilitiesPage.module.css'

function renderIcon(iconKey: string) {
  switch (iconKey) {
    case 'layout':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 9h18M9 21V9" />
        </svg>
      )
    case 'phone':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="5" y="2" width="14" height="20" rx="2" />
          <path d="M12 18h.01" />
        </svg>
      )
    case 'server':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="2" y="4" width="20" height="7" rx="2" />
          <rect x="2" y="13" width="20" height="7" rx="2" />
          <path d="M6 7.5h.01M6 16.5h.01" />
        </svg>
      )
    case 'db':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <ellipse cx="12" cy="5" rx="8" ry="3" />
          <path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5" />
          <path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />
        </svg>
      )
    case 'bulb':
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M9 18h6M10 22h4" />
          <path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2Z" />
        </svg>
      )
  }
}

export function CapabilitiesPage() {
  const navigate = useNavigate()
  const { summary, category, capabilities } = useProblem()

  return (
    <main id="main" className="wrap" tabIndex={-1} style={{ padding: 'clamp(1.5rem,4vw,2.75rem) 0 5rem' }} dir="rtl">
      {/* ═══ 03 القدرات المطلوبة ═══ */}
      <span className="stepno">الخطوة 2 من 6</span>

      <div className={`box ${styles.sumbox}`}>
        <div className={styles.sumrow}>
          <div>
            <span className={styles.lbl}>المشكلة كما فهمناها</span>
            <p className={styles.sumtxt}>{summary}</p>
          </div>
          <span className={styles.cat}>التصنيف: {category}</span>
        </div>
      </div>

      <div className="headrow" style={{ marginTop: '1.6rem' }}>
        <div>
          <h1 className="scr-t">لحلّ مشكلتك، تحتاج 5 قدرات</h1>
          <p className="scr-p">ليست قائمة عامة — كل قدرة مستخرجة من جملة في نصّك.</p>
        </div>
      </div>

      <div className={styles.pgrid}>
        <div className={styles.pmain}>
          <div className={styles.skgrid}>
            {capabilities.map((s) => (
              <article key={s.id} className={styles.sk}>
                <div className={styles.h}>
                  <span className={styles.ic}>{renderIcon(s.iconKey)}</span>
                  <h3>{s.name}</h3>
                  <span className={`${styles.req} ${s.priority === 'أساسية' ? '' : styles.opt}`}>
                    {s.priority}
                  </span>
                </div>
                <q>{s.reason}</q>
              </article>
            ))}
          </div>

          <div className={`box ${styles.provebox}`}>
            <h3>الآن سنختبر قدرتك عليها</h3>
            <p>
              لن نسألك «هل تعرف UI/UX؟». سنعطيك مهمة حقيقية من مشكلتك أنت، وتحلّها الآن — ونتيجتك تصبح دليلًا.
            </p>
            <button
              type="button"
              id="toSimBtn"
              className="btn dark"
              style={{ marginTop: '.8rem' }}
              onClick={() => navigate(ROUTES.SIMULATION)}
            >
              ابدأ المحاكاة
            </button>
          </div>
        </div>

        <aside className={styles.pside}>
          <div className={`box ${styles.pcard}`}>
            <h3>كيف رتّبنا الأولوية</h3>
            <div className={styles.prio}>
              <div className={styles.pr}>
                <span className={styles.prbar} aria-hidden="true"><i style={{ width: '100%' }} /></span>
                <div>
                  <b>أساسية</b>
                  <em>بدونها المشكلة لا تُحلّ أصلًا.</em>
                </div>
              </div>
              <div className={styles.pr}>
                <span className={`${styles.prbar} ${styles.med}`} aria-hidden="true"><i style={{ width: '55%' }} /></span>
                <div>
                  <b>مساندة</b>
                  <em>تحسّن النتيجة، ولا توقف الإطلاق.</em>
                </div>
              </div>
            </div>
            <p className={styles.prnote}>الترتيب من نصّك: ما ذكرته صراحةً صار أساسيًا، وما استُنتج صار مساندًا.</p>
          </div>

          <div className={`box ${styles.exbox2}`}>
            <h3>استُثني عن قصد</h3>
            <p className={styles.note} style={{ marginBottom: '.85rem' }}>لأن مشكلتك لا تطلبها — فلا نحاسبك عليها.</p>
            <div className={styles.exlist}>
              <div className={styles.ex}>
                <p className={styles.n}>تطبيق موبايل أصلي</p>
                <p className={styles.w}>وصفت «تطبيق» بلا منصة محددة — الويب يكفي لأول نسخة.</p>
              </div>
              <div className={styles.ex}>
                <p className={styles.n}>نظام دفع</p>
                <p className={styles.w}>لا يوجد شراء في مشكلتك.</p>
              </div>
              <div className={styles.ex}>
                <p className={styles.n}>إدارة صلاحيات متقدمة</p>
                <p className={styles.w}>مستخدم واحد: الطالب.</p>
              </div>
            </div>
          </div>

          <div className={`box ${styles.nextbox}`}>
            <span className={styles.tiph2}>
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 8v4l3 2" />
              </svg>
              سنختبرك على 3 منها
            </span>
            <p>
              المحاكاة تغطّي <b>Product Thinking</b> و<b>UI/UX</b> و<b>Backend</b>. الباقي يُستنتج من إجاباتك.
            </p>
          </div>
        </aside>
      </div>

      <div className="row" style={{ marginTop: '2.5rem' }}>
        <Link to={ROUTES.PROBLEM} className="btn ghost">← رجوع لتعديل المشكلة</Link>
      </div>
    </main>
  )
}
export default CapabilitiesPage
