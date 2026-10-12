import React from 'react';
import { useParams} from 'react-router-dom';
import styles from './ProjectsPortfolio.module.css';

export const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const projectId = id || 'prj-01';

  return (
    <div className={styles.container} data-testid="screen-q-0483">
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <span className={styles.screenBadge}>Q-0483 · تفاصيل المشروع والدليل</span>
          <h1 className={styles.title}>نظام إدارة التدفقات المالية عالي الموثوقية (FinStream)</h1>
          <p className={styles.subtitle}>
            المعرف: {projectId} • المستوى: Tier 3 (مراجعة هندسية معتمدة)
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <a
            href="https://github.com/qudra/finstream-core"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.secondaryBtn}
          >
            مستودع الكود (GitHub) ↗
          </a>
          <a
            href="https://finstream.demo.qudra.io"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.primaryBtn}
          >
            المعاينة الحية (Live Demo) ↗
          </a>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className={styles.statCard}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }}>نبذة عن المشروع والتحدي الهندسي</h3>
            <p style={{ lineHeight: 1.7, color: '#334155' }}>
              تم تصميم FinStream ليكون العمود الفقري لمعالجة الحركات المالية الدقيقة بحجم يتجاوز 10,000 معاملة في الدقيقة.
              تم التغلب على مشكلات السباق التزامني (Race Conditions) وتطبيق ضمانات ACID الصارمة باستخدام قفل التفاؤل والتشاؤم حسب سياق المعاملة.
            </p>
          </div>

          <div className={styles.statCard}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }}>المهام الفردية المنفذة وإثبات المساهمة</h3>
            <ul style={{ paddingRight: '1.25rem', lineHeight: 1.8, color: '#334155' }}>
              <li>تصميم معمارية قاعدة البيانات وتوزيع الجداول والفهارس مع تقليل استهلاك الذاكرة بنسبة 35%.</li>
              <li>بناء طبقة اتصالات آمنة مشفرة بنظام mTLS بين الخدمات المصغرة.</li>
              <li>كتابة اختبارات تكاملية شاملة بتغطية تفوق 90% تشمل سيناريوهات فشل الشبكة وانقطاع الاتصال.</li>
              <li>إعداد خط أنابيب CI/CD مع فحص أمني تلقائي لثغرات التبعيات (Dependency Scanning).</li>
            </ul>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className={styles.statCard}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>آلة حالات التحقق المستقلة</h3>
            <div className={styles.evidenceMachineState}>
              <span>حالة التدقيق:</span>
              <span className={styles.tier3} style={{ padding: '0.2rem 0.6rem', borderRadius: 4, fontWeight: 700 }}>
                مُحقّق كلياً (Tier 3)
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
              تم التحقق من ملكية الالتزامات (Commits Ownership)، وتطابق التوقيع الرقمي، وفحص بنية الكود عبر محلل قُدرة المستقل.
            </p>
          </div>

          <div className={styles.statCard}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>الكفاءات البرمجية المسندة</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              <span className={styles.screenBadge}>Distributed Systems</span>
              <span className={styles.screenBadge}>Transaction Safety</span>
              <span className={styles.screenBadge}>High Concurrency</span>
              <span className={styles.screenBadge}>PostgreSQL Tuning</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
