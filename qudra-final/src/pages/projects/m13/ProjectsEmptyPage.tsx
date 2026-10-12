import React from 'react';
import { Link } from 'react-router-dom';
import styles from './ProjectsPortfolio.module.css';

export const ProjectsEmptyPage: React.FC = () => {
  return (
    <div className={styles.container} data-testid="screen-q-0509">
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <span className={styles.screenBadge}>Q-0509 · حالة الفراغ</span>
          <h1 className={styles.title}>بورتفوليو المشاريع وإثبات الملكية</h1>
        </div>
      </div>

      <div className={styles.stateBox}>
        <div className={styles.stateIcon}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="32" height="32">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
        </div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          لم تقم بإضافة أي مشروع في بورتفوليو الأدلة حتى الآن
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
          المشاريع هي الركيزة الأساسية لإثبات خبرتك الهندسية أمام أصحاب الشركات والمشاريع. أضف أول مشروع مع رابط المستودع لبدء تدقيق الكفاءات.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <Link to="/projects/portfolio/new" className={styles.primaryBtn}>
            + إضافة أول مشروع الآن
          </Link>
          <Link to="/profile/master" className={styles.secondaryBtn}>
            العودة لملف الكفاءة
          </Link>
        </div>
      </div>
    </div>
  );
};
