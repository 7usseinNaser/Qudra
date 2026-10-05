import React from 'react';
import { Link } from 'react-router-dom';
import styles from './PracticeChallenges.module.css';

export const PracticeChallengesEmptyPage: React.FC = () => {
  return (
    <div className={styles.container} data-testid="screen-q-0429">
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <span className={styles.screenBadge}>Q-0429 · حالة الفراغ</span>
          <h1 className={styles.title}>مختبر التحديات البرمجية</h1>
        </div>
      </div>

      <div className={styles.stateBox}>
        <div className={styles.stateIcon}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="32" height="32">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        </div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          لا توجد تحديات تطابق الفلاتر المحددة حالياً
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
          لم نتمكن من العثور على أي تحدٍ برمجي في هذا النطاق أو المستوى. جرب إعادة تعيين الفلاتر أو استكشاف التحديات المقترحة لمهاراتك الحالية.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <Link to="/challenges/practice" className={styles.primaryBtn}>
            إعادة تعيين الفلاتر واستعراض الكل
          </Link>
          <Link to="/profile/master" className={styles.secondaryBtn}>
            العودة لملف الكفاءة
          </Link>
        </div>
      </div>
    </div>
  );
};
