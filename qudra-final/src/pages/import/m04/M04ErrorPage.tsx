import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, AlertTriangle, RefreshCw, WifiOff, Server, Bug, Home, FileCode, Shield, GitBranch, Lock, CheckCircle2, Sparkles, HelpCircle } from 'lucide-react';
import { ROUTES } from '../../../constants/routes';
import { AnchorNav, AnchorLink } from '../../../components/patterns/AnchorNav';
import { DataState } from '../../../components/patterns/DataState';
import { Button } from '../../../components/ui/Button';
import styles from './m04.module.css';

const M04_ANCHORS: AnchorLink[] = [
  { id: 'overview', label: 'نظرة عامة', path: ROUTES.M04_OVERVIEW, icon: <Upload size={16} /> },
  { id: 'details', label: 'التفاصيل', path: ROUTES.M04_DETAILS, icon: <FileCode size={16} /> },
  { id: 'create', label: 'استيراد جديد', path: ROUTES.M04_CREATE, icon: <Sparkles size={16} /> },
  { id: 'results', label: 'نتائج الاستيراد', path: ROUTES.M04_RESULTS, icon: <CheckCircle2 size={16} /> },
  { id: 'empty', label: 'الحالة الفارغة', path: ROUTES.M04_EMPTY, icon: <HelpCircle size={16} /> },
  { id: 'error', label: 'معالجة الخطأ', path: ROUTES.M04_ERROR, icon: <Server size={16} /> },
];

export const M04ErrorPage: React.FC = () => {
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
    navigate(ROUTES.M04_OVERVIEW);
  };

  return (
    <div className={styles.page} dir="rtl">
      <AnchorNav anchors={M04_ANCHORS} title="شاشات مركز الاستيراد (M04)" />

      <header className={styles.header}>
        <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.HOME)} leftIcon={<Home size={16} />}>
          الرئيسية
        </Button>
        <div className={styles.headerContent}>
          <div className={`${styles.headerIcon} ${styles.error}`}>
            <AlertTriangle size={32} />
          </div>
          <div>
            <h1 className={styles.title}>تعذر تحميل مركز الاستيراد</h1>
            <p className={styles.subtitle}>
              واجهنا مشكلة في الاتصال بخدمة الاستيراد. البيانات المحلية متاحة للوضع التجريبي.
            </p>
          </div>
        </div>
      </header>

      <DataState
        state="error"
        title="خطأ في الاتصال بخدمة الاستيراد"
        message={retryCount > 0 ? `محاولة إعادة الاتصال رقم ${retryCount}...` : 'تعذر جلب قائمة المصادر أو معالجة الاستيراد. قد يكون السبب انقطاع الشبكة، صيانة مجدولة، أو خطأ في تنسيق الملف المرفوع.'}
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
            <p>محاولة جديدة لجلب بيانات المصادر أو إعادة معالجة الملف. لا تفقد أي بيانات محلية.</p>
            <Button variant="proof" size="sm" onClick={handleRetry} disabled={isRetrying} leftIcon={isRetrying ? <RefreshCw size={14} className={styles.spin} /> : <RefreshCw size={14} />}>
              {isRetrying ? 'جاري المحاولة...' : 'إعادة المحاولة'}
            </Button>
          </div>
          <div className={styles.errorCard}>
            <div className={styles.errorCardIcon}>
              <WifiOff size={24} />
            </div>
            <h3>الوضع التجريبي</h3>
            <p>استخدام بيانات المصادر من mock-data مع شارة [Demo / تجريبي]. جميع العمليات في الذاكرة فقط.</p>
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
              navigator.clipboard.writeText(`M04 Error - Import Center Service\nTime: ${new Date().toISOString()}\nRetry Count: ${retryCount}\nUser Agent: ${navigator.userAgent}`);
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
            <p>عند تفعيل الوضع التجريبي، سيعرض مركز الاستيراد بيانات المصادر من <code>mock-data.ts</code> مع شارة واضحة <span className={styles.demoBadge}>[Demo / تجريبي]</span> في جميع الشاشات.</p>
            <ul className={styles.noticeList}>
              <li>مصادر البيانات: LinkedIn ZIP، Credly، LeetCode، HTB من mock-data</li>
              <li>معالجة الملفات: محاكاة محلية (لا رفع حقيقي للخادم)</li>
              <li>PAT: يُحفظ في متغير JS فقط — يمسح عند إغلاق التبويب</li>
              <li>الأدلة الناتجة: حالة CLAIMED + شارة User-supplied/Fragile</li>
              <li>عند عودة الاتصال: مزامنة تلقائية عند إعادة التحميل</li>
            </ul>
          </div>
        </div>
      </section>

      <section className={styles.commonErrors} aria-labelledby="common-errors-title">
        <h2 id="common-errors-title" className={styles.sectionTitle}>أخطاء شائعة وحلولها</h2>
        <div className={styles.commonErrorsGrid}>
          <div className={styles.commonErrorCard}>
            <h4><FileCode size={16} /> ملف ZIP غير صالح</h4>
            <p>تأكد من تحميل ملف "Data Export" الكامل من LinkedIn Settings &gt; Data Privacy، وليس ملف جزئي.</p>
          </div>
          <div className={styles.commonErrorCard}>
            <h4><Shield size={16} /> بروفايل Credly خاص</h4>
            <p>تأكد من أن البروفايل عام (Public Profile) في إعدادات Credly، أو أدخل الرابط الصحيح.</p>
          </div>
          <div className={styles.commonErrorCard}>
            <h4><GitBranch size={16} /> رابط LeetCode خاطئ</h4>
            <p>يجب أن يكون الرابط بالشكل: leetcode.com/username (ليس leetcode.cn أو رابط مشكلة محددة).</p>
          </div>
          <div className={styles.commonErrorCard}>
            <h4><Lock size={16} /> PAT منتهي الصلاحية</h4>
            <p>تحقق من صلاحية PAT في HTB Account &gt; API Access. الرموز منتهية الصلاحية ترفض فوراً.</p>
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

export default M04ErrorPage;