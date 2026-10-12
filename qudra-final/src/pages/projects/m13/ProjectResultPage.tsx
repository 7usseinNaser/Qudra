import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import styles from './ProjectsPortfolio.module.css';

export const ProjectResultPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const tier = searchParams.get('tier') || 'tier2';

  return (
    <div className={styles.container} data-testid="screen-q-0487">
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <span className={styles.screenBadge}>Q-0487 · نتيجة التوثيق</span>
          <h1 className={styles.title}>تم تسجيل المشروع وإسناده كدليل كفاءة بنجاح</h1>
          <p className={styles.subtitle}>
            دخل المشروع في آلة حالات التحقق المستقلة لمنصة قُدرة (Verification State Machine).
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/projects/portfolio" className={styles.secondaryBtn}>
            معرض المشاريع
          </Link>
          <Link to="/profile/master" className={styles.primaryBtn}>
            ملف الكفاءة الشامل
          </Link>
        </div>
      </div>

      <div className={styles.statsBar}>
        <div className={styles.statCard}>
          <div className={styles.statVal} style={{ color: '#059669' }}>قيد التدقيق</div>
          <div className={styles.statLabel}>حالة آلة التحقق الحالية</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statVal}>
            <span className={tier === 'tier2' ? styles.tier2 : styles.tier1}>
              {tier === 'tier2' ? 'Tier 2' : 'Tier 1'}
            </span>
          </div>
          <div className={styles.statLabel}>المستوى الأولي المستحق</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statVal}>4</div>
          <div className={styles.statLabel}>كفاءات مستخلصة ومطابقة</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statVal}>✓ متصل</div>
          <div className={styles.statLabel}>فحص صحة المستودع والملكية</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginTop: '1rem' }}>
        <div className={styles.statCard}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>مسار التحقق الآلي المستقل</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0.8rem', background: '#f8fafc', borderRadius: 6 }}>
              <span>1. فحص سلامة الرابط والوصول للبيانات (URL Reachability)</span>
              <strong style={{ color: '#16a34a' }}>مكتمل (Tier 1)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0.8rem', background: '#f8fafc', borderRadius: 6 }}>
              <span>2. التدقيق الشجري للشيفرة المصدرية (AST & Code Scan)</span>
              <strong style={{ color: '#d97706' }}>جاري التحليل (Tier 2)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0.8rem', background: '#f8fafc', borderRadius: 6 }}>
              <span>3. مراجعة النظراء والتدقيق المعماري البشري (Peer Review)</span>
              <strong style={{ color: '#64748b' }}>في قائمة الانتظار (Tier 3)</strong>
            </div>
          </div>
        </div>

        <div className={styles.statCard}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>الخطوة التالية</h3>
          <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.6 }}>
            تم إدراج هذا المشروع كدليل كفاءة في ملفك. سيتلقى إشعاراً فور انتهاء الفحص الآلي للارتقاء إلى المستوى الأعلى.
          </p>
          <Link
            to="/projects/portfolio"
            className={styles.primaryBtn}
            style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}
          >
            العودة إلى المعرض
          </Link>
        </div>
      </div>
    </div>
  );
};
