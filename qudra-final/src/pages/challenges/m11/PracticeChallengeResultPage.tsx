import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import styles from './PracticeChallenges.module.css';

export const PracticeChallengeResultPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const score = searchParams.get('score') || '96';

  return (
    <div className={styles.container} data-testid="screen-q-0407">
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <span className={styles.screenBadge}>Q-0407 · تقييم النتيجة والدليل</span>
          <h1 className={styles.title}>نتائج تقييم التحدي البرمجي</h1>
          <p className={styles.subtitle}>
            تم الانتهاء من فحص الحل واختبار الأداء وتوليد سجل الدليل في ملف الكفاءة.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/challenges/practice" className={styles.secondaryBtn}>
            قائمة التحديات
          </Link>
          <Link to="/profile/master" className={styles.primaryBtn}>
            عرض في ملف الكفاءة (Proof Core)
          </Link>
        </div>
      </div>

      {/* Red Line Compliance Alert */}
      <div className={styles.redLineNotice}>
        <strong>🛡️ سياسة قُدرة للنزاهة المهنية (Anti-Spoofing Protocol):</strong>
        <br />
        تم تسجيل هذا التحدي دليلاً بحالة <span className={styles.claimedBadge} data-testid="evidence-status-badge">CLAIMED</span> (مُطالَب به). 
        حتى وإن بلغت نسبة الفحص الآلي 100%، <strong>يُحظر منح حالة «Proven» (مُثبَت) تلقائياً</strong> دون تدقيق من مراجع بشري معتمد أو فحص أمني مستقل، وذلك لضمان الموثوقية التامة أمام أصحاب الأعمال.
      </div>

      <div className={styles.statsBar}>
        <div className={styles.statCard}>
          <div className={styles.statVal} style={{ color: '#16a34a' }}>{score}%</div>
          <div className={styles.statLabel}>درجة التقييم الآلي الإجمالية</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statVal}>
            <span className={styles.claimedBadge} data-testid="claimed-status-pill">
              CLAIMED
            </span>
          </div>
          <div className={styles.statLabel}>حالة توثيق الدليل الحالية</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statVal}>4/4</div>
          <div className={styles.statLabel}>الاختبارات المتزامنة المارة</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statVal}>48ms</div>
          <div className={styles.statLabel}>متوسط زمن الاستجابة (Latency)</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginTop: '1rem' }}>
        <div className={styles.statCard}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>تفاصيل نتائج الفحص</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: '#f8fafc', borderRadius: 6 }}>
              <span>صحة التركيب النحوي والأنواع الصارمة</span>
              <strong style={{ color: '#16a34a' }}>ناجح (100%)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: '#f8fafc', borderRadius: 6 }}>
              <span>إدارة تجمعات اتصالات قاعدة البيانات (Connection Pools)</span>
              <strong style={{ color: '#16a34a' }}>ناجح (95%)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: '#f8fafc', borderRadius: 6 }}>
              <span>عدم إعاقة خيط التنفيذ (Non-blocking I/O)</span>
              <strong style={{ color: '#16a34a' }}>ناجح (98%)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: '#f8fafc', borderRadius: 6 }}>
              <span>سلامة معالجة الأخطاء وتنظيف الموارد</span>
              <strong style={{ color: '#16a34a' }}>ناجح (92%)</strong>
            </div>
          </div>
        </div>

        <div className={styles.statCard}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>الخطوة التالية الموصى بها</h3>
          <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.6 }}>
            تم إرسال هذا الحل تلقائياً إلى صف التدقيق الأكاديمي. يمكنك طلب مراجعة خبير بشري لتحويل هذا الدليل من حالة 
            <code>CLAIMED</code> إلى <code>PROVEN</code>.
          </p>
          <button type="button" className={styles.primaryBtn} style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}>
            طلب تدقيق بشري معتمد 🔍
          </button>
        </div>
      </div>
    </div>
  );
};
