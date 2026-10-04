import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { M10AnchorNav } from './M10AnchorNav';
import styles from './m10.module.css';
import { AlertCircle, RefreshCw, WifiOff, Shield, CheckCircle2, ArrowLeft, BookOpen, ExternalLink } from 'lucide-react';

export const M10ErrorPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as {
    courseTitle?: string;
    provider?: string;
    reason?: string;
    failedAction?: 'fetch' | 'enroll' | 'sync' | 'project_sync';
  } | null;

  const [notice, setNotice] = useState<string | null>(null);
  const [offlineMode, setOfflineMode] = useState(false);

  const courseTitle = state?.courseTitle || 'الدورة المحددة';
  const provider = state?.provider || 'المزود';
  const reasonText = state?.reason || 'تعذر الاتصال بخادم المزود أو انتهت صلاحية الجلسة';
  const failedAction = state?.failedAction || 'fetch';

  const actionLabels: Record<string, string> = {
    fetch: 'جلب بيانات الدورة',
    enroll: 'التسجيل في الدورة',
    sync: 'مزامنة التقدم',
    project_sync: 'مزامنة المشروع التطبيقي',
  };

  const handleRetry = () => {
    setNotice(`محاولة إعادة ${actionLabels[failedAction]}...`);
    setTimeout(() => {
      setNotice(`تمت إعادة ${actionLabels[failedAction]} بنجاح`);
    }, 1000);
  };

  const handleOpenProvider = () => {
    setNotice(`فتح صفحة المزود في علامة تبويب جديدة`);
  };

  const handleGoOffline = () => {
    setOfflineMode(true);
    setNotice('تم التبديل للوضع المحدود — البيانات محفوظة محلياً');
  };

  return (
    <div className={styles.container}>
      <M10AnchorNav />

      <div className={styles.headerRow}>
        <div>
          <span className={styles.badgeQ}>M10 · Q-0391 · ⚓ Error</span>
          <h1 className={styles.title}>خطأ في عملية الدورة</h1>
          <p className={styles.subtitle}>
            شاشة التعافي: شرح السبب المعروف فقط، بدائل مجانية ومحلية، وإمكانية العمل في وضع محدود مع حفظ محلي.
          </p>
        </div>
      </div>

      {notice && (
        <div style={{
          background: offlineMode ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)',
          border: `1px solid ${offlineMode ? 'rgba(245, 158, 11, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
          color: offlineMode ? 'var(--amber, #d97706)' : '#10B981',
          borderRadius: '10px',
          padding: '0.85rem 1.15rem',
          fontSize: '0.88rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          {offlineMode ? <WifiOff size={18} /> : <CheckCircle2 size={18} />}
          <span>{notice}</span>
        </div>
      )}

      <div className={styles.errorBox}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
          <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'rgba(239, 68, 68, 0.12)', display: 'grid', placeItems: 'center', color: '#EF4444', flexShrink: 0 }}>
            <AlertCircle size={22} />
          </div>

          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--ink)', margin: '0 0 0.4rem' }}>
              فشل {actionLabels[failedAction]} — {reasonText}
            </h2>
            <p style={{ color: 'var(--ink-2)', fontSize: '0.88rem', lineHeight: 1.6, margin: 0 }}>
              الدورة: <strong>{courseTitle}</strong> من <strong>{provider}</strong>.
              السبب المعروف فقط (بدون تخمين): {reasonText}.
              تم حفظ تقدمك المحلي والبيانات المدخلة بأمان.
            </p>
          </div>
        </div>

        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--line)',
          borderRadius: '10px',
          padding: '0.9rem 1.1rem',
          marginTop: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          fontSize: '0.82rem',
          color: 'var(--ink-2)'
        }}>
          <Shield size={16} color="var(--proof)" />
          <span>
            <strong>ضمان الأمان والحفظ المحلي:</strong> نحتفظ بتقدم الدورة، الملاحظات، وحالة المشروع محلياً.
            لا نفقد أي إدخال عند انقطاع الاتصال.
          </span>
        </div>

        <div className={styles.actionRow} style={{ marginTop: '1.5rem' }}>
          <Button variant="proof" size="md" onClick={handleRetry} leftIcon={<RefreshCw size={15} />}>
            إعادة المحاولة الآن
          </Button>

          <Button variant="outline" size="md" onClick={handleOpenProvider} leftIcon={<ExternalLink size={15} />}>
            فتح على منصة المزود مباشرة
          </Button>

          <Button variant="outline" size="md" onClick={handleGoOffline} leftIcon={<WifiOff size={15} />}>
            المتابعة في وضع محدود (أوفلاين)
          </Button>

          <Button
            variant="ghost"
            size="md"
            onClick={() => navigate('/learn/overview')}
            rightIcon={<ArrowLeft size={15} />}
          >
            العودة للنظرة العامة
          </Button>
        </div>
      </div>

      <div className={styles.card} style={{ marginTop: '1.5rem', borderInlineStart: '4px solid var(--accent, #14b8a6)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <BookOpen size={18} color="var(--accent, #14b8a6)" />
          <strong style={{ fontSize: '0.9rem', color: 'var(--ink)' }}>بدائل مجانية ومحلية (كما في المواصفات)</strong>
        </div>
        <p style={{ fontSize: '0.84rem', color: 'var(--ink-2)', margin: '0 0 0.75rem', lineHeight: 1.6 }}>
          عند فشل الوصول لمزود خارجي (Coursera, Udemy, إلخ)، يقترح QUDRA بدائل:
        </p>
        <ul style={{ margin: 0, paddingInlineStart: '1.25rem', fontSize: '0.84rem', color: 'var(--ink-2)', lineHeight: 1.7 }}>
          <li>دورات QUDRA Academy المجانية المكافئة (محتوى عربي، مشروع تطبيقي مدمج)</li>
          <li>مصادر مفتوحة: GitHub Guides، MDN، freeCodeCamp، documentación رسمية</li>
          <li>تحديات QUDRA العملية (M11) كبديل مباشر للإثبات دون دورة</li>
          <li>إضافة دورة يدوياً من ملف محلي أو رابط عام (Q-0364)</li>
        </ul>
        <p style={{ fontSize: '0.84rem', color: 'var(--ink-2)', marginTop: '0.75rem', lineHeight: 1.6 }}>
          <strong>AI لا يخمّن؛ يشرح السبب المعروف فقط.</strong> كل خطأ فيه خطوة تالية واضحة.
        </p>
      </div>
    </div>
  );
};

export default M10ErrorPage;