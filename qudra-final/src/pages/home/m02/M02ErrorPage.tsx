import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, RefreshCw, AlertCircle, ShieldCheck, WifiOff, CheckCircle2, XCircle, HelpCircle } from 'lucide-react';
import { ROUTES } from '../../../constants/routes';
import { AnchorNav, AnchorLink } from '../../../components/patterns/AnchorNav';
import { Button } from '../../../components/ui/Button';
import styles from './m02.module.css';

const M02_ANCHORS: AnchorLink[] = [
  { id: 'overview', label: 'نظرة عامة', path: ROUTES.M02_OVERVIEW, icon: <ShieldCheck size={16} /> },
  { id: 'details', label: 'التفاصيل', path: ROUTES.M02_DETAILS, icon: <ShieldCheck size={16} /> },
  { id: 'create', label: 'تخصيص', path: ROUTES.M02_CREATE, icon: <ShieldCheck size={16} /> },
  { id: 'results', label: 'الملخص', path: ROUTES.M02_RESULTS, icon: <ShieldCheck size={16} /> },
  { id: 'empty', label: 'جديد', path: ROUTES.M02_EMPTY, icon: <ShieldCheck size={16} /> },
  { id: 'error', label: 'خطأ', path: ROUTES.M02_ERROR, icon: <ShieldCheck size={16} /> },
];

type ErrorType = 'load_profile' | 'save_customization' | 'sync_evidence' | 'network' | 'unknown';

const ERROR_TYPES: Record<ErrorType, { title: string; description: string; recoveryHint: string }> = {
  load_profile: {
    title: 'فشل تحميل الملف المهاري',
    description: 'تعذر جلب بيانات ملفك الرئيسي (Master Profile). قد يكون السبب انقطاع الشبكة أو خطأ في الخادم.',
    recoveryHint: 'سيتم إعادة المحاولة تلقائياً. تأكد من اتصالك بالإنترنت.'
  },
  save_customization: {
    title: 'فشل حفظ التخصيص',
    description: 'لم يتم حفظ تغييراتك على الصفحة الرئيسية. البيانات محفوظة محلياً ويمكن استعادتها.',
    recoveryHint: 'أعد المحاولة أو انسخ تغييراتك يدوياً قبل إعادة تحميل الصفحة.'
  },
  sync_evidence: {
    title: 'فشل مزامنة الأدلة',
    description: 'تعذر مزامنة الأدلة الجديدة مع الملف الرئيسي. الأدلة محفوظة في المتصفح.',
    recoveryHint: 'ستتم المزامنة تلقائياً عند استعادة الاتصال.'
  },
  network: {
    title: 'انقطاع الاتصال',
    description: 'لا يوجد اتصال بالإنترنت. تعمل المنصة في وضع محدود مع البيانات المحلية.',
    recoveryHint: 'سيتم استعادة الوظائف الكاملة تلقائياً عند عودة الاتصال.'
  },
  unknown: {
    title: 'خطأ غير متوقع',
    description: 'حدث خطأ أثناء معالجة طلبك. نعرض ما توفر من بيانات محلية.',
    recoveryHint: 'أعد المحاولة أو تواصل مع الدعم إذا تكرر الخطأ.'
  }
};

export const M02ErrorPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { errorType?: ErrorType; failedAction?: string } | null;
  const [errorType, setErrorType] = useState<ErrorType>(state?.errorType || 'unknown');
  const [retrying, setRetrying] = useState(false);

  const errorInfo = ERROR_TYPES[errorType];

  const handleRetry = async () => {
    setRetrying(true);
    await new Promise(res => setTimeout(res, 1000));
    setRetrying(false);
    navigate(ROUTES.M02_OVERVIEW);
  };

  const handleGoOffline = () => {
    navigate(ROUTES.M02_OVERVIEW, { state: { offlineMode: true } });
  };

  return (
    <div className={styles.page} dir="rtl">
      <AnchorNav anchors={M02_ANCHORS} title="شاشات الصفحة الرئيسية (M02)" />

      <header className={styles.header}>
        <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.M02_OVERVIEW)} leftIcon={<ArrowLeft size={16} />}>
          العودة للنظرة العامة
        </Button>
        <div className={styles.headerContent}>
          <div className={styles.headerIcon}>
            <AlertCircle size={32} />
          </div>
          <div>
            <h1 className={styles.title}>{errorInfo.title}</h1>
            <p className={styles.subtitle}>{errorInfo.description}</p>
          </div>
        </div>
        <span className={styles.badgeQ}>M02 · Q-0071 · ⚓ Error</span>
      </header>

      <section className={styles.errorSection} aria-labelledby="error-title">
        <div className={styles.errorCard}>
          <div className={styles.errorIcon}>
            <AlertCircle size={48} />
          </div>
          <h2 id="error-title" className={styles.errorTitle}>{errorInfo.title}</h2>
          <p className={styles.errorDesc}>{errorInfo.description}</p>
          <p className={styles.recoveryHint}>{errorInfo.recoveryHint}</p>

          <div className={styles.errorActions}>
            <Button variant="proof" size="lg" onClick={handleRetry} loading={retrying} leftIcon={<RefreshCw size={18} className={retrying ? 'spin' : ''} />}>
              {retrying ? 'جاري إعادة المحاولة...' : 'إعادة المحاولة'}
            </Button>
            <Button variant="outline" size="lg" onClick={handleGoOffline} leftIcon={<WifiOff size={18} />}>
              المتابعة في وضع محدود
            </Button>
            <Button variant="ghost" size="lg" onClick={() => navigate(ROUTES.M02_OVERVIEW)} leftIcon={<XCircle size={18} />}>
              تجاهل والعودة
            </Button>
          </div>
        </div>
      </section>

      <section className={styles.detailsSection} aria-labelledby="details-title">
        <h3 id="details-title" className={styles.sectionTitle}>تفاصيل الخطأ ومحاكاة السيناريوهات</h3>
        <div className={styles.errorTypeSelector}>
          <label htmlFor="error-type" className={styles.selectLabel}>نوع الخطأ للمحاكاة:</label>
          <select
            id="error-type"
            className={styles.errorSelect}
            value={errorType}
            onChange={e => setErrorType(e.target.value as ErrorType)}
          >
            <option value="load_profile">📂 فشل تحميل الملف</option>
            <option value="save_customization">💾 فشل الحفظ</option>
            <option value="sync_evidence">🔄 فشل مزامنة الأدلة</option>
            <option value="network">🌐 انقطاع الشبكة</option>
            <option value="unknown">❓ خطأ غير معروف</option>
          </select>
        </div>

        <div className={styles.localDataNotice}>
          <CheckCircle2 size={16} />
          <span>بياناتك المحلية محفوظة بأمان: التخصيصات، الأدلة المضافة، والإعدادات.</span>
        </div>
      </section>

      <section className={styles.guideSection} aria-labelledby="common-title">
        <h3 id="common-title" className={styles.sectionTitle}>أسباب شائعة وحلول</h3>
        <div className={styles.guideGrid}>
          <div className={styles.guideCard}>
            <div className={styles.guideIcon}><WifiOff size={24} /></div>
            <h4>انقطاع الشبكة</h4>
            <p>تأكد من اتصالك بالإنترنت. المنصة تحفظ التغييرات محلياً وتعيد المزامنة تلقائياً.</p>
          </div>
          <div className={styles.guideCard}>
            <div className={styles.guideIcon}><RefreshCw size={24} /></div>
            <h4>مهلة طلب منتهية</h4>
            <p>الخادم استغرق وقتاً طويلاً. أعد المحاولة — البيانات المؤقتة محفوظة.</p>
          </div>
          <div className={styles.guideCard}>
            <div className={styles.guideIcon}><HelpCircle size={24} /></div>
            <h4>خطأ في البيانات</h4>
            <p>تنسيق بيانات غير متوقع. امسح التخزين المحلي (localStorage) وأعد المحاولة.</p>
          </div>
          <div className={styles.guideCard}>
            <div className={styles.guideIcon}><ShieldCheck size={24} /></div>
            <h4>وضع محدود متاح</h4>
            <p>يمكنك تصفح صفحتك وتعديلها محلياً. تتم المزامنة عند عودة الاتصال.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default M02ErrorPage;