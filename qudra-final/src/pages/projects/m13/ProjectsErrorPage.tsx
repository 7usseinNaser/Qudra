import React from 'react';
import { Link } from 'react-router-dom';
import styles from './ProjectsPortfolio.module.css';

export const ProjectsErrorPage: React.FC = () => {
  return (
    <div className={styles.container} data-testid="screen-q-0511">
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <span className={styles.screenBadge} style={{ background: '#fee2e2', color: '#dc2626' }}>
            Q-0511 · حالة خطأ
          </span>
          <h1 className={styles.title}>تعذر استرجاع بيانات بورتفوليو المشاريع</h1>
        </div>
      </div>

      <div className={styles.stateBox} style={{ borderColor: '#fca5a5' }}>
        <div className={`${styles.stateIcon} ${styles.errorStateIcon}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="32" height="32">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: '#991b1b' }}>
          حدث خطأ أثناء الاتصال بمحرك التحقق من المشاريع (Verification Engine Unavailable)
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
          تعذر تحميل بيانات المشاريع أو فحص مستودعات الكود المرتبطة في الوقت الحالي. لم تفقد أي بيانات مدخلة.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <button
            type="button"
            className={styles.primaryBtn}
            onClick={() => window.location.reload()}
          >
            إعادة المحاولة 🔄
          </button>
          <Link to="/profile/master" className={styles.secondaryBtn}>
            الرجوع لملف الكفاءة
          </Link>
        </div>
      </div>
    </div>
  );
};
