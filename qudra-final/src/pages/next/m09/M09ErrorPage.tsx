import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, AlertTriangle, RefreshCw, WifiOff, Server, Bug, ChevronRight, Home } from 'lucide-react';
import { ROUTES } from '../../../constants/routes';
import { AnchorNav, AnchorLink } from '../../../components/patterns/AnchorNav';
import { DataState } from '../../../components/patterns/DataState';
import { Button } from '../../../components/ui/Button';
import styles from './m09.module.css';

const M09_ANCHORS: AnchorLink[] = [
  { id: 'overview', label: 'نظرة عامة', path: ROUTES.M09_OVERVIEW, icon: <Target size={16} /> },
  { id: 'details', label: 'التفاصيل', path: ROUTES.M09_DETAILS, icon: <AlertTriangle size={16} /> },
  { id: 'create', label: 'إنشاء خطة', path: ROUTES.M09_CREATE, icon: <ChevronRight size={16} /> },
  { id: 'results', label: 'النتائج', path: ROUTES.M09_RESULTS, icon: <Bug size={16} /> },
  { id: 'empty', label: 'الحالة الفارغة', path: ROUTES.M09_EMPTY, icon: <WifiOff size={16} /> },
  { id: 'error', label: 'معالجة الخطأ', path: ROUTES.M09_ERROR, icon: <Server size={16} /> },
];

export const M09ErrorPage: React.FC = () => {
  const navigate = useNavigate();
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    setRetryCount(c => c + 1);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRetrying(false);
    window.location.reload();
  };

  const handleOfflineMode = () => {
    navigate(ROUTES.M09_OVERVIEW);
  };

  return (
    <div className={styles.page} dir="rtl">
      <AnchorNav anchors={M09_ANCHORS} title="شاشات محرك الخطوة التالية (M09)" />

      <header className={styles.header}>
        <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.HOME)} leftIcon={<Home size={16} />}>
          الرئيسية
        </Button>
        <div className={styles.headerContent}>
          <div className={`${styles.headerIcon} ${styles.error}`}>
            <AlertTriangle size={32} />
          </div>
          <div>
            <h1 className={styles.title}>تعذر تحميل محرك الخطوة التالية</h1>
            <p className={styles.subtitle}>
              واجهنا مشكلة في الاتصال بخدمة تحليل الفجوات. البيانات المحلية متاحة للوضع التجريبي.
            </p>
          </div>
        </div>
      </header>

      <DataState
        state="error"
        title="خطأ في الاتصال بخدمة الفجوات"
        message={retryCount > 0 ? `محاولة إعادة الاتصال رقم ${retryCount}...` : 'تعذر جلب بيانات فجوات الكفاءات من الخادم. قد يكون السبب انقطاع الشبكة أو صيانة مجدولة.'}
        action={{
          label: isRetrying ? 'جاري إعادة المحاولة...' : 'إعادة المحاولة الآن',
          onClick: handleRetry,
          variant: 'proof',
          icon: isRetrying ? <RefreshCw size={16} className={styles.spin} /> : <RefreshCw size={16} />,
        }}
        secondaryAction={{
          label: 'العمل بوضع تجريبي (Offline)',
          onClick: handleOfflineMode,
          variant: 'outline',
          icon: <WifiOff size={16} />,
        }}
      />

      <section className={styles.errorDetails} aria-labelledby="error-details-title">
        <h2 id="error-details-title" className={styles.sectionTitle}>خيارات الاسترداد الآمن</h2>
        <div className={styles.errorCards}>
          <div className={styles.errorCard}>
            <div className={styles.errorCardIcon}>
              <RefreshCw size={24} />
            </div>
            <h3>إعادة الاتصال</h3>
            <p>محاولة جديدة لجلب أحدث بيانات الفجوات من الباك إند. لا تفقد أي بيانات محلية.</p>
            <Button variant="proof" size="sm" onClick={handleRetry} disabled={isRetrying} leftIcon={isRetrying ? <RefreshCw size={14} className={styles.spin} /> : <RefreshCw size={14} />}>
              {isRetrying ? 'جاري المحاولة...' : 'إعادة المحاولة'}
            </Button>
          </div>
          <div className={styles.errorCard}>
            <div className={styles.errorCardIcon}>
              <WifiOff size={24} />
            </div>
            <h3>الوضع التجريبي</h3>
            <p>استخدام بيانات الفجوات المخزنة محلياً (Demo Data). تظهر شارة [Demo / تجريبي] في الواجهة.</p>
            <Button variant="outline" size="sm" onClick={handleOfflineMode} leftIcon={<WifiOff size={14} />}>
              تفعيل الوضع التجريبي
            </Button>
          </div>
          <div className={styles.errorCard}>
            <div className={styles.errorCardIcon}>
              <Bug size={24} />
            </div>
            <h3>إبلاغ الفريق</h3>
            <p>نسخ تفاصيل الخطأ الفنية لإرسالها لفريق التطوير مع سياق جلستك الحالية.</p>
            <Button variant="ghost" size="sm" onClick={() => {
              navigator.clipboard.writeText(`M09 Error - Gap Analysis Service\nTime: ${new Date().toISOString()}\nRetry Count: ${retryCount}\nUser Agent: ${navigator.userAgent}`);
            }} leftIcon={<Bug size={14} />}>
              نسخ تفاصيل الخطأ
            </Button>
          </div>
        </div>
      </section>

      <section className={styles.offlineNotice} aria-labelledby="offline-title">
        <h2 id="offline-title" className={styles.sectionTitle}>ملاحظة حول الوضع التجريبي</h2>
        <div className={styles.noticeCard}>
          <div className={styles.noticeIcon}>
            <WifiOff size={24} />
          </div>
          <div className={styles.noticeContent}>
            <h3>العمل بدون اتصال بالباك إند</h3>
            <p>عند تفعيل الوضع التجريبي، سيعرض المحرك بيانات الفجوات من <code>mock-data.ts</code> مع شارة واضحة <span className={styles.demoBadge}>[Demo / تجريبي]</span> في جميع الشاشات.</p>
            <ul className={styles.noticeList}>
              <li>بيانات الفجوات: من <code>INITIAL_GAPS</code> في mock-data.ts</li>
              <li>التوصيات: محسوبة محلياً بنفس خوارزمية الأولوية</li>
              <li>الخطط: تُحفظ في الذاكرة فقط (لا تُرسل للخادم)</li>
              <li>عند عودة الاتصال: مزامنة تلقائية عند إعادة التحميل</li>
            </ul>
          </div>
        </div>
      </section>

      <div className={styles.footerActions}>
        <Button variant="proof" size="md" onClick={handleRetry} disabled={isRetrying} leftIcon={isRetrying ? <RefreshCw size={16} className={styles.spin} /> : <RefreshCw size={16} />}>
          {isRetrying ? 'جاري إعادة المحاولة...' : 'إعادة المحاولة الآن'}
        </Button>
        <Button variant="outline" size="md" onClick={handleOfflineMode} leftIcon={<WifiOff size={16} />}>
          المتابعة بالوضع التجريبي
        </Button>
      </div>
    </div>
  );
};

export default M09ErrorPage;