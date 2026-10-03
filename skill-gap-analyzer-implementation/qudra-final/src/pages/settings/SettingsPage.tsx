import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import styles from './SettingsPage.module.css';

export function SettingsPage() {
  const navigate = useNavigate();

  const sections = [
    { label: 'الحساب', desc: 'الاسم، البريد، كلمة المرور', link: ROUTES.SETTINGS },
    { label: 'ظهور الملف', desc: 'تحكم في ظهور ملفك للآخرين', link: ROUTES.PRIVACY },
    { label: 'خصوصية الأدلة', desc: 'من يستطيع رؤية أدلتك', link: ROUTES.PRIVACY },
    { label: 'GitHub', desc: 'الربط والمزامنة', link: ROUTES.GITHUB_CONNECT },
    { label: 'الرسائل', desc: 'إعدادات التواصل', link: ROUTES.COMM_SETTINGS },
    { label: 'الإشعارات', desc: 'أنواع الإشعارات وتفضيلاتها', link: ROUTES.NOTIFICATIONS },
    { label: 'المظهر', desc: 'فاتح / داكن', link: ROUTES.SETTINGS },
    { label: 'اللغة', desc: 'العربية / English', link: ROUTES.SETTINGS },
    { label: 'الأمان', desc: 'التحقق بخطوتين، الجلسات', link: ROUTES.SETTINGS },
    { label: 'الحسابات المرتبطة', desc: 'GitHub، Google، غيرها', link: ROUTES.CONNECTED_ACCOUNTS },
  ];

  return (
    <main id="main" className="wrap" tabIndex={-1} dir="rtl" style={{ padding: 'clamp(1.5rem,4vw,2.75rem) 0 5rem' }}>
      <button className="btn ghost" onClick={() => navigate(ROUTES.HOME)} style={{ marginBottom: '0.8rem' }}>
        ← الرئيسية
      </button>
      <h1 className="scr-t">الإعدادات</h1>
      <p className="scr-p">إدارة حسابك وتفضيلاتك.</p>

      <div className={styles.list}>
        {sections.map((s) => (
          <button key={s.label} className={`box ${styles.settingItem}`} onClick={() => navigate(s.link)}>
            <div className={styles.settingInfo}>
              <span className={styles.settingLabel}>{s.label}</span>
              <span className={styles.settingDesc}>{s.desc}</span>
            </div>
            <span className={styles.arrow} aria-hidden="true">←</span>
          </button>
        ))}
      </div>
    </main>
  );
}

export default SettingsPage;
