import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import styles from './m14.module.css';
import { Search, Link, AlertCircle, Info, GitCommit, ShieldCheck } from 'lucide-react';
import { GithubIcon } from '../../../components/ui/GithubIcon';

export const M14EmptyPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container} dir="rtl">
      <div className={styles.headerRow}>
        <div className={styles.headerContent}>
          <span className={styles.badgeQ}>M14 · Q-0549 · ⚓ Empty State</span>
          <span className={styles.demoBadge}>[Demo / تجريبي]</span>
          <h1 className={styles.title}>لا توجد مستودعات GitHub مربوطة</h1>
          <p className={styles.subtitle}>
            ما ربطت GitHub — اربطه بصلاحيات قراءة فقط لنحلل أعمالك البرمجية ونستخرج القدرات.
          </p>
        </div>
      </div>

      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>🔍</div>
        <h2 className={styles.emptyTitle}>ما ربطت GitHub بعد</h2>
        <p className={styles.emptyDesc}>
          لتحليل جودة الكود، الاختبارات، وتاريخ المساهمات — نحتاج الوصول لمستودعاتك.
          نستخدم <strong>Fine-grained PAT (قراءة فقط)</strong> للمستودعات الخاصة، أو API العام للمستودعات العامة.
          <br /><br />
          <strong>لا نعتمد على عدد النجوم</strong> — فهي قابلة للشراء وغير موثوقة.
          نحلل: تعقيد الكود، تغطية الاختبارات، أنماط المعمارية، وتنوع توقيت الـCommits.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '1.5rem' }}>
          <Button variant="proof" size="lg" onClick={() => navigate('/code-intel/create')} leftIcon={<GithubIcon size={18} />}>
            ربط GitHub وتحليل المستودعات
          </Button>
          <Button variant="outline" size="lg" onClick={() => navigate('/profile/sources/github')} leftIcon={<Link size={18} />}>
            مركز المصادر
          </Button>
        </div>

        <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(0, 184, 184, 0.05)', border: '1px solid rgba(0, 184, 184, 0.2)', borderRadius: '10px', textAlign: 'right' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: 'var(--ink-2)', fontSize: '0.85rem', lineHeight: 1.6 }}>
            <Info size={18} style={{ color: 'var(--proof)', flexShrink: 0, marginTop: '0.1rem' }} />
            <div>
              <strong>ملاحظة:</strong> مفتاح الوصول (PAT) يُحفظ في <strong>الذاكرة فقط</strong> للجلسة النشطة.
              لا يُخزن في localStorage، ولا يُسجل، ويمحى فور إغلاق التبويب.
              مستوى الثقة: <strong>User-supplied</strong> (يقدّمه المستخدم).
            </div>
          </div>
        </div>
      </div>

      <div className={styles.card} style={{ marginTop: '1.5rem' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--ink)', margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={20} style={{ color: '#F59E0B' }} />
          ما الذي سيحدث بعد الربط؟
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '1rem', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '10px' }}>
            <Search size={20} style={{ color: 'var(--proof)', flexShrink: 0, marginTop: '0.15rem' }} />
            <div>
              <div style={{ fontWeight: 600, color: 'var(--ink)', marginBottom: '0.25rem' }}>1. اختيار المستودعات</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--ink-2)', lineHeight: 1.5 }}>
                تظهر قائمة مستودعاتك (عامة + خاصة بتوكن). تختار ما تريد تحليله.
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '1rem', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '10px' }}>
            <GitCommit size={20} style={{ color: '#10B981', flexShrink: 0, marginTop: '0.15rem' }} />
            <div>
              <div style={{ fontWeight: 600, color: 'var(--ink)', marginBottom: '0.25rem' }}>2. تحليل متعدد المراحل</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--ink-2)', lineHeight: 1.5 }}>
                جلب شجرة الملفات → تحليل AST → مطابقة المهارات → إشارات الجودة → خط زمني Commits.
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '1rem', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '10px' }}>
            <ShieldCheck size={20} style={{ color: '#F59E0B', flexShrink: 0, marginTop: '0.15rem' }} />
            <div>
              <div style={{ fontWeight: 600, color: 'var(--ink)', marginBottom: '0.25rem' }}>3. قدرات + أدلة Proven</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--ink-2)', lineHeight: 1.5 }}>
                تُستخرج قدرات بثقة عالية، وتُنشأ بطاقات دليل معتمدة لجواز القدرات.
                كل رقم قابل للفتح للدليل خلفه.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default M14EmptyPage;