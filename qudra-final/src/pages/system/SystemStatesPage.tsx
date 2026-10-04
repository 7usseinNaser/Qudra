import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState } from '../../components/ui/ErrorState';
import { Skeleton } from '../../components/ui/Skeleton';
import { ConfirmBox } from '../../components/overlays/ConfirmBox';
import styles from './SystemStatesPage.module.css';

export function SystemStatesPage() {
  const navigate = useNavigate();
  const [showUnsaved, setShowUnsaved] = useState(false);

  return (
    <main id="main" className="wrap" tabIndex={-1} dir="rtl" style={{ padding: 'clamp(1.5rem,4vw,2.75rem) 0 5rem' }}>
      <button className="btn ghost" onClick={() => navigate(ROUTES.HOME)} style={{ marginBottom: '0.8rem' }}>
        ← الرئيسية
      </button>
      <h1 className="scr-t">حالات النظام</h1>
      <p className="scr-p">عرض حالات النظام القياسية: الفراغ، التحميل، الخطأ، الصلاحية، فشل الذكاء الاصطناعي، التغييرات غير المحفوظة.</p>

      {/* Q79 — Empty State */}
      <div className={`box ${styles.section}`}>
        <h2 className={styles.sectionTitle}>Q79 — حالة الفراغ</h2>
        <EmptyState
          title="لا توجد أدلة في ملفك بعد"
          description="الأدلة هي ما يحوّل ادّعاءاتك إلى قدرات مثبتة. ابدأ بربط GitHub."
          action={<button className="btn" onClick={() => navigate(ROUTES.GITHUB_CONNECT)}>أضف أول دليل</button>}
        />
      </div>

      {/* Q80 — Loading / Skeleton */}
      <div className={`box ${styles.section}`}>
        <h2 className={styles.sectionTitle}>Q80 — حالة التحميل (Skeleton)</h2>
        <div className={styles.skeletonDemo}>
          <Skeleton width="60%" height="1.2rem" />
          <Skeleton width="40%" height="0.9rem" />
          <Skeleton width="100%" height="3rem" />
          <Skeleton width="100%" height="3rem" />
        </div>
      </div>

      {/* Q81 — Error State */}
      <div className={`box ${styles.section}`}>
        <h2 className={styles.sectionTitle}>Q81 — حالة الخطأ</h2>
        <ErrorState
          title="تعذر الاتصال بالخادم"
          message="تحقق من الاتصال وحاول مرة أخرى. بياناتك محفوظة محلياً."
          onRetry={() => navigate(ROUTES.HOME)}
        />
      </div>

      {/* Q82 — Permission Error */}
      <div className={`box ${styles.section}`}>
        <h2 className={styles.sectionTitle}>Q82 — خطأ الصلاحية</h2>
        <div className={styles.permissionBox}>
          <span className={styles.permIcon} aria-hidden="true">⚠</span>
          <div>
            <h3 className={styles.permTitle}>صلاحية غير كافية</h3>
            <p className={styles.permDesc}>يتطلب هذا الإجراء صلاحية قراءة المستودعات الخاصة على GitHub.</p>
          </div>
        </div>
        <div className={styles.permActions}>
          <button className="btn sm" onClick={() => navigate(ROUTES.GITHUB_CONNECT)}>إعادة الربط</button>
          <button className="btn ghost sm">تغيير الصلاحية</button>
          <button className="btn ghost sm" onClick={() => navigate(ROUTES.HOME)}>إلغاء</button>
        </div>
      </div>

      {/* Q83 — AI Failure */}
      <div className={`box ${styles.section}`}>
        <h2 className={styles.sectionTitle}>Q83 — فشل التحليل الذكي</h2>
        <div className={styles.aiFailBox}>
          <span className={styles.aiFailIcon} aria-hidden="true">●</span>
          <div>
            <h3 className={styles.aiFailTitle}>التحليل فشل</h3>
            <p className={styles.aiFailDesc}>
              المصدر وصل بنجاح، لكن التحليل الذكي لم يكتمل. ملفك لم يتحدث بنتيجة خاطئة.
            </p>
          </div>
        </div>
        <div className={styles.aiFailActions}>
          <button className="btn sm">إعادة المحاولة</button>
          <button className="btn ghost sm">إبلاغ</button>
          <button className="btn ghost sm" onClick={() => navigate(ROUTES.HOME)}>متابعة</button>
        </div>
      </div>

      {/* Q84 — Unsaved Changes */}
      <div className={`box ${styles.section}`}>
        <h2 className={styles.sectionTitle}>Q84 — تغييرات غير محفوظة</h2>
        <button className="btn" onClick={() => setShowUnsaved(true)}>
          محاكاة محاولة مغادرة نموذج
        </button>
        {showUnsaved && (
          <ConfirmBox
            open={showUnsaved}
            title="لديك تغييرات غير محفوظة"
            body="هل تريد متابعة التحرير أم تجاهل التغييرات؟"
            confirmLabel="تجاهل"
            cancelLabel="متابعة التحرير"
            onConfirm={() => setShowUnsaved(false)}
            onCancel={() => setShowUnsaved(false)}
          />
        )}
      </div>
    </main>
  );
}

export default SystemStatesPage;
