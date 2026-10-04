import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import styles from './CommunicationSettingsPage.module.css';

export function CommunicationSettingsPage() {
  const navigate = useNavigate();

  return (
    <main id="main" className="wrap" tabIndex={-1} dir="rtl" style={{ padding: 'clamp(1.5rem,4vw,2.75rem) 0 5rem' }}>
      <button className="btn ghost" onClick={() => navigate(ROUTES.CONNECTIONS)} style={{ marginBottom: '0.8rem' }}>
        ← اتصالاتي
      </button>
      <h1 className="scr-t">إعدادات التواصل</h1>
      <p className="scr-p">تحكم في من يستطيع التواصل معك.</p>

      <div className={`box ${styles.section}`}>
        <h2 className={styles.sectionTitle}>الرسائل</h2>
        <div className={styles.settingRow}>
          <div className={styles.settingInfo}>
            <span className={styles.settingLabel}>السماح بالرسائل قبل التواصل</span>
            <span className={styles.settingDesc}>يمكن لأي شخص إرسال رسالة لك بدون اتصال مسبق</span>
          </div>
          <label className={styles.toggle}>
            <input type="checkbox" defaultChecked />
            <span className={styles.toggleSlider}></span>
          </label>
        </div>
        <div className={styles.settingRow}>
          <div className={styles.settingInfo}>
            <span className={styles.settingLabel}>السماح بالرسائل بعد التواصل</span>
            <span className={styles.settingDesc}>فقط الأشخاص المتصلون يستطيعون إرسال رسائل</span>
          </div>
          <label className={styles.toggle}>
            <input type="checkbox" defaultChecked />
            <span className={styles.toggleSlider}></span>
          </label>
        </div>
      </div>

      <div className={`box ${styles.section}`}>
        <h2 className={styles.sectionTitle}>طلبات التواصل</h2>
        <div className={styles.settingRow}>
          <div className={styles.settingInfo}>
            <span className={styles.settingLabel}>تلقي الطلبات من أي شخص</span>
            <span className={styles.settingDesc}>السماح لأي شخص بإرسال طلب تواصل</span>
          </div>
          <label className={styles.toggle}>
            <input type="checkbox" defaultChecked />
            <span className={styles.toggleSlider}></span>
          </label>
        </div>
        <div className={styles.settingRow}>
          <div className={styles.settingInfo}>
            <span className={styles.settingLabel}>تلقي الطلبات من نفس المجال فقط</span>
            <span className={styles.settingDesc}>تقييد الطلبات بنفس مجال عملك</span>
          </div>
          <label className={styles.toggle}>
            <input type="checkbox" />
            <span className={styles.toggleSlider}></span>
          </label>
        </div>
      </div>
    </main>
  );
}

export default CommunicationSettingsPage;
