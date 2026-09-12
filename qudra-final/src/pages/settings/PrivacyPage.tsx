import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import styles from './PrivacyPage.module.css';

export function PrivacyPage() {
  const navigate = useNavigate();

  const controls = [
    { label: 'ملف عام', desc: 'السماح للجميع برؤية ملفك المهني', defaultChecked: true },
    { label: 'أدلة عامة', desc: 'السماح للجميع برؤية أدلتك الموثّقة', defaultChecked: true },
    { label: 'مستودعات خاصة', desc: 'محتوى المستودعات الخاصة لا يصبح عاماً أبداً تلقائياً', defaultChecked: true },
    { label: 'ظهور المشاريع', desc: 'إظهار مشاريعك للجميع', defaultChecked: true },
    { label: 'ظهور الخبرة', desc: 'إظهار خبرتك الوظيفية', defaultChecked: false },
    { label: 'ظهور الشهادات', desc: 'إظهار شهاداتك', defaultChecked: true },
  ];

  return (
    <main id="main" className="wrap" tabIndex={-1} dir="rtl" style={{ padding: 'clamp(1.5rem,4vw,2.75rem) 0 5rem' }}>
      <button className="btn ghost" onClick={() => navigate(ROUTES.SETTINGS)} style={{ marginBottom: '0.8rem' }}>
        ← الإعدادات
      </button>
      <h1 className="scr-t">الخصوصية وظهور الأدلة</h1>
      <p className="scr-p">تحكم في من يرى بياناتك. المستودعات الخاصة محمية دائماً.</p>

      <div className={`box ${styles.section}`}>
        {controls.map((c) => (
          <div key={c.label} className={styles.controlRow}>
            <div className={styles.controlInfo}>
              <span className={styles.controlLabel}>{c.label}</span>
              <span className={styles.controlDesc}>{c.desc}</span>
            </div>
            <label className={styles.toggle}>
              <input type="checkbox" defaultChecked={c.defaultChecked} />
              <span className={styles.toggleSlider}></span>
            </label>
          </div>
        ))}
      </div>

      <div className={`box ${styles.warningBox}`}>
        <span className={styles.warningIcon} aria-hidden="true">⚠</span>
        <span className={styles.warningText}>
          محتوى المستودعات الخاصة لا يصبح عاماً أبداً تلقائياً. أنت تتحكم في ما يظهر.
        </span>
      </div>
    </main>
  );
}

export default PrivacyPage;
