import React from 'react';
import { useParams, Link } from 'react-router-dom';
import styles from './PracticeChallenges.module.css';

export const PracticeChallengeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const challengeId = id || 'ch-01';

  return (
    <div className={styles.container} data-testid="screen-q-0403">
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <span className={styles.screenBadge}>Q-0403 · تفاصيل التحدي</span>
          <h1 className={styles.title}>تطوير نقطة نهاية غير متزامنة (Async Endpoint)</h1>
          <p className={styles.subtitle}>
            المعرف: {challengeId} • الصعوبة: متقدم (ADVANCED) • الزمن المقترح: 45 دقيقة
          </p>
        </div>
        <div>
          <Link to={`/challenges/practice/${challengeId}/attempt`} className={styles.primaryBtn}>
            فتح محرر الكود والبدء ⚡
          </Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className={styles.statCard}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }}>وصف المتطلب الهندسي</h3>
            <p style={{ lineHeight: 1.7, color: '#334155' }}>
              المطلوب بناء دالة معالجة غير متزامنة تستقبل طلبات تدفق بيانات عالية التردد. يجب التحقق من صحة المدخلات،
              تنفيذ معالجة سريعة في الذاكرة، ثم إيداع النتيجة في قاعدة البيانات باستخدام تجمع اتصالات فعال (Connection Pool)
              دون التسبب في حجب خيط التنفيذ الرئيسي (Event Loop Blocking).
            </p>
          </div>

          <div className={styles.statCard}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }}>معايير الفحص وحالات الاختبار</h3>
            <ul style={{ paddingRight: '1.25rem', lineHeight: 1.8, color: '#334155' }}>
              <li><strong>Test 1:</strong> التحقق من الاستجابة السليمة لطلب قياسي مع كود حالة 200 OK.</li>
              <li><strong>Test 2:</strong> معالجة 500 طلب متزامن دون تجاوز زمن استجابة 80ms.</li>
              <li><strong>Test 3:</strong> إغلاق اتصالات قاعدة البيانات عند إثارة استثناء غير متوقع.</li>
              <li><strong>Test 4:</strong> سلامة الأنواع البرمجية وعدم وجود Any type غير منضبط.</li>
            </ul>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className={styles.statCard}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>معايير التدقيق الأمني</h3>
            <div className={styles.redLineNotice} style={{ margin: 0 }}>
              <strong>الخط الأحمر لمنصة قُدرة:</strong><br />
              إتمام هذا التحدي بنجاح 100% يمنحك دليل كفاءة بحالة <code>CLAIMED</code> فقط. تتطلب حالة <code>Proven</code> مراجعة خبير بشري أو فحص أمني مستقل لمنع تزييف المهارات.
            </div>
          </div>

          <div className={styles.statCard}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>المهارات المكتسبة</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              <span className={styles.screenBadge}>Python AsyncIO</span>
              <span className={styles.screenBadge}>FastAPI</span>
              <span className={styles.screenBadge}>Database Pooling</span>
              <span className={styles.screenBadge}>Concurrency Safety</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
