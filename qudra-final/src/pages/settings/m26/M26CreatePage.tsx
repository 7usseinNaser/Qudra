import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import styles from './M26CreatePage.module.css';

export function M26CreatePage() {
  const navigate = useNavigate();

  return (
    <main id="main" className="wrap" tabIndex={-1} dir="rtl" style={{ padding: 'clamp(1.5rem,4vw,2.75rem) 0 5rem' }}>
      <div className={styles.header}>
        <button className="btn ghost" onClick={() => navigate(ROUTES.M26_OVERVIEW)}>← العودة</button>
        <h1 className="scr-t">إعداد جديد</h1>
        <p className={styles.subtitle}>اختر نوع الإعداد الذي تريد إنشاءه</p>
      </div>

      <div className={styles.grid}>
        <article className={styles.card} onClick={() => navigate(ROUTES.PROFILE_EDIT)}>
          <div className={styles.cardicon}>👤</div>
          <h3 className={styles.cardtitle}>الملف الشخصي</h3>
          <p className={styles.carddesc}>تعديل الاسم، الصورة، الوصف، ومعلومات التواصل</p>
        </article>
        <article className={styles.card} onClick={() => navigate(ROUTES.PRIVACY)}>
          <div className={styles.cardicon}>🔒</div>
          <h3 className={styles.cardtitle}>الخصوصية والأمان</h3>
          <p className={styles.carddesc}>إدارة رؤية الملف، البيانات، وصلاحيات التطبيقات</p>
        </article>
        <article className={styles.card} onClick={() => navigate(ROUTES.NOTIFICATIONS)}>
          <div className={styles.cardicon}>🔔</div>
          <h3 className={styles.cardtitle}>الإشعارات</h3>
          <p className={styles.carddesc}>تخصيص أنواع الإشعارات وقنوات الاستلام</p>
        </article>
        <article className={styles.card} onClick={() => navigate(ROUTES.CONNECTED_ACCOUNTS)}>
          <div className={styles.cardicon}>🔗</div>
          <h3 className={styles.cardtitle}>حساب متصل</h3>
          <p className={styles.carddesc}>ربط GitHub، LinkedIn، ومصادر الأدلة الأخرى</p>
        </article>
        <article className={styles.card} onClick={() => navigate(ROUTES.COMM_SETTINGS)}>
          <div className={styles.cardicon}>📧</div>
          <h3 className={styles.cardtitle}>تفضيلات التواصل</h3>
          <p className={styles.carddesc}>إدارة الاشتراكات في النشرات والعروض</p>
        </article>
        <article className={styles.card} onClick={() => navigate(ROUTES.ORG_MEMBERS)}>
          <div className={styles.cardicon}>👥</div>
          <h3 className={styles.cardtitle}>دعوة عضو فريق</h3>
          <p className={styles.carddesc}>إضافة أعضاء جدد وتعيين الأدوار والصلاحيات</p>
        </article>
      </div>
    </main>
  );
}

export default M26CreatePage;