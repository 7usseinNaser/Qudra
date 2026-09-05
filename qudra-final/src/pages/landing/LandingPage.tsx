import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import { useTheme } from '../../contexts/ThemeContext'
import styles from './LandingPage.module.css'

export function LandingPage() {
  const { theme, toggleTheme } = useTheme()
  return (
    <div className={styles.cover} dir="rtl">
      <section className={styles.hero}>
        <span className={styles.glow} aria-hidden="true" />
        <span className={styles.glow2} aria-hidden="true" />
        <div className={styles.mid}>
          <p className={styles.slogan}>من الكلام إلى <b>الدليل</b></p>
          <span className={styles.rule} />
        </div>
        <div className={styles.bottom}>
          <Link to={ROUTES.PROBLEM} className="btn" style={{ minHeight: 50, padding: '0 1.9rem', fontSize: '.98rem' }}>
            ابدأ الآن
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 12H5" /><path d="m12 19-7-7 7-7" /></svg>
          </Link>
          <button className={styles.scrollcue}>
            <span>جرّبها قبل ما تسجّل</span>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 5v14" /><path d="m5 12 7 7 7-7" /></svg>
          </button>
          <button className="btn ghost" onClick={toggleTheme} aria-label="تبديل المظهر" style={{ marginTop: '1rem' }}>
            {theme === 'dark' ? '☀ الوضع الفاتح' : '☾ الوضع الداكن'}
          </button>
        </div>
      </section>
    </div>
  )
}
