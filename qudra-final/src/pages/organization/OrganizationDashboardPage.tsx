import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { Badge } from '../../components/ui/Badge';
import { Bar } from '../../components/ui/Bar';
import styles from './OrganizationDashboardPage.module.css';

export function OrganizationDashboardPage() {
  const navigate = useNavigate();

  const stats = [
    { label: 'وظائف مفتوحة', value: 3, link: ROUTES.COMPANY_CANDIDATES },
    { label: 'مشاكل نشطة', value: 2, link: ROUTES.PROBLEM_CREATION },
    { label: 'مرشحون', value: 15, link: ROUTES.COMPANY_CANDIDATES },
    { label: 'أعضاء الفريق', value: 12, link: ROUTES.ORG_MEMBERS },
  ];

  return (
    <main id="main" className="wrap" tabIndex={-1} dir="rtl" style={{ padding: 'clamp(1.5rem,4vw,2.75rem) 0 5rem' }}>
      <button className="btn ghost" onClick={() => navigate(ROUTES.ORG_PROFILE)} style={{ marginBottom: '0.8rem' }}>
        ← ملف الشركة
      </button>
      <h1 className="scr-t">لوحة تحكم الشركة</h1>
      <p className="scr-p">نظرة شاملة على نشاط الشركة.</p>

      <div className={styles.statsGrid}>
        {stats.map((s) => (
          <button key={s.label} className={`box ${styles.statCard}`} onClick={() => navigate(s.link)}>
            <span className={`${styles.statVal} num`}>{s.value}</span>
            <span className={styles.statLabel}>{s.label}</span>
          </button>
        ))}
      </div>

      <div className={`box ${styles.section}`}>
        <h2 className={styles.sectionTitle}>التحقق</h2>
        <div className={styles.verifyRow}>
          <Badge variant="proof">موثّق</Badge>
          <span className={styles.verifyText}>الشركة موثّقة بالكامل</span>
        </div>
      </div>

      <div className={`box ${styles.section}`}>
        <h2 className={styles.sectionTitle}>النشاط الأخير</h2>
        <div className={styles.activityList}>
          <div className={styles.activityItem}>
            <span className={styles.activityIcon}>●</span>
            <span className={styles.activityText}>مرشح جديد: لينا الحربي تقدّمت لوظيفة Senior Backend</span>
            <span className={`${styles.activityTime} mono`}>منذ ساعتين</span>
          </div>
          <div className={styles.activityItem}>
            <span className={styles.activityIcon}>●</span>
            <span className={styles.activityText}>تحدي جديد: بناء واجهة REST نُشر</span>
            <span className={`${styles.activityTime} mono`}>منذ يوم</span>
          </div>
          <div className={styles.activityItem}>
            <span className={styles.activityIcon}>●</span>
            <span className={styles.activityText}>مشكلة جديدة: منصة تعليمية تفاعلية</span>
            <span className={`${styles.activityTime} mono`}>منذ 3 أيام</span>
          </div>
        </div>
      </div>

      <div className={`box ${styles.section}`}>
        <h2 className={styles.sectionTitle}>تغطية القدرات</h2>
        <div className={styles.coverageList}>
          <div className={styles.coverageItem}>
            <span className={styles.coverageLabel}>FastAPI</span>
            <Bar value={90} max={100} size="sm" variant="proof" className={styles.coverageBar} />
            <span className={`${styles.coverageVal} num`}>90%</span>
          </div>
          <div className={styles.coverageItem}>
            <span className={styles.coverageLabel}>PostgreSQL</span>
            <Bar value={85} max={100} size="sm" variant="proof" className={styles.coverageBar} />
            <span className={`${styles.coverageVal} num`}>85%</span>
          </div>
          <div className={styles.coverageItem}>
            <span className={styles.coverageLabel}>React</span>
            <Bar value={60} max={100} size="sm" variant="gap" className={styles.coverageBar} />
            <span className={`${styles.coverageVal} num`}>60%</span>
          </div>
        </div>
      </div>
    </main>
  );
}

export default OrganizationDashboardPage;
