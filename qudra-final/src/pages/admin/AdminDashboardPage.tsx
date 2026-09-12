import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { Badge } from '../../components/ui/Badge';
import { Bar } from '../../components/ui/Bar';
import styles from './AdminDashboardPage.module.css';

export function AdminDashboardPage() {
  const navigate = useNavigate();

  const stats = [
    { label: 'المستخدمون', value: 1248, link: ROUTES.ADMIN_VERIFICATION },
    { label: 'الشركات', value: 87, link: ROUTES.ADMIN_VERIFICATION },
    { label: 'التحقق المعلّق', value: 23, link: ROUTES.ADMIN_VERIFICATION },
    { label: 'مهام الذكاء الاصطناعي', value: 15, link: ROUTES.ADMIN_AI_QUEUE },
    { label: 'بلاغات', value: 4, link: ROUTES.ADMIN_EVIDENCE },
    { label: 'أدلة مشبوهة', value: 7, link: ROUTES.ADMIN_EVIDENCE },
  ];

  const health = [
    { label: 'API', status: 'operational', value: 99 },
    { label: 'قاعدة البيانات', status: 'operational', value: 100 },
    { label: 'التحليل الذكي', status: 'degraded', value: 72 },
    { label: 'GitHub Sync', status: 'operational', value: 98 },
  ];

  return (
    <main id="main" className="wrap" tabIndex={-1} dir="rtl" style={{ padding: 'clamp(1.5rem,4vw,2.75rem) 0 5rem' }}>
      <button className="btn ghost" onClick={() => navigate(ROUTES.HOME)} style={{ marginBottom: '0.8rem' }}>
        ← الرئيسية
      </button>
      <h1 className="scr-t">لوحة المشرف</h1>
      <p className="scr-p">إدارة النظام والتحقق والمراقبة.</p>

      <div className={styles.statsGrid}>
        {stats.map((s) => (
          <button key={s.label} className={`box ${styles.statCard}`} onClick={() => navigate(s.link)}>
            <span className={`${styles.statVal} num`}>{s.value}</span>
            <span className={styles.statLabel}>{s.label}</span>
          </button>
        ))}
      </div>

      <div className={`box ${styles.section}`}>
        <h2 className={styles.sectionTitle}>صحة النظام</h2>
        <div className={styles.healthList}>
          {health.map((h) => (
            <div key={h.label} className={styles.healthRow}>
              <span className={styles.healthLabel}>{h.label}</span>
              <Bar value={h.value} max={100} size="sm" variant={h.value >= 90 ? 'proof' : 'gap'} className={styles.healthBar} />
              <span className={styles.healthStatus}>
                <Badge variant={h.value >= 90 ? 'proof' : 'gap'}>
                  {h.value >= 90 ? 'يعمل' : 'متأثر'}
                </Badge>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.navGrid}>
        <button className={`box ${styles.navCard}`} onClick={() => navigate(ROUTES.ADMIN_VERIFICATION)}>
          <span className={styles.navTitle}>طابور التحقق</span>
          <span className={styles.navDesc}>توظيف، شركات، شهادات، بلاغات</span>
        </button>
        <button className={`box ${styles.navCard}`} onClick={() => navigate(ROUTES.ADMIN_AI_QUEUE)}>
          <span className={styles.navTitle}>طابور التحليل الذكي</span>
          <span className={styles.navDesc}>مهام معلّقة، فاشلة، مكتملة</span>
        </button>
        <button className={`box ${styles.navCard}`} onClick={() => navigate(ROUTES.ADMIN_EVIDENCE)}>
          <span className={styles.navTitle}>مراجعة الأدلة</span>
          <span className={styles.navDesc}>أدلة مشبوهة، مراجعة يدوية</span>
        </button>
      </div>
    </main>
  );
}

export default AdminDashboardPage;
