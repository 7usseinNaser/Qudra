import React from 'react';
import { Link } from 'react-router-dom';
import styles from './AssistantM24.module.css';

export const AssistantEmptyPage: React.FC = () => {
  return (
    <div className={styles.container} data-testid="screen-q-0949">
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <span className={styles.screenBadge}>Q-0949 · حالة الفراغ</span>
          <h1 className={styles.title}>مركز التفسير والشفافية</h1>
        </div>
      </div>

      <div className={styles.stateBox}>
        <div className={styles.stateIcon}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="32" height="32">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          لا توجد تفسيرات مسجلة بعد
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
          كل قرار يصدره الذكاء الاصطناعي في منصة قُدرة مصحوب بتفسير كامل قابل للتدقيق. ابدأ بطرح استفسار جديد لتوليد أول تفسير موحد.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <Link to="/assistant/new" className={styles.primaryBtn}>
            + طرح استفسار جديد
          </Link>
          <Link to="/profile/master" className={styles.secondaryBtn}>
            ملف الكفاءة الشامل
          </Link>
        </div>
      </div>
    </div>
  );
};