import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import styles from './M23ErrorPage.module.css';

interface ErrorConfig {
  code: string;
  title: string;
  description: string;
  actionLabel?: string;
  actionRoute?: string;
}

const errorStates: Record<string, ErrorConfig> = {
  generic: {
    code: 'ERR_UNKNOWN',
    title: 'حدث خطأ غير متوقع',
    description: 'واجه النظام مشكلة لم يتمكن من معالجتها. يرجى المحاولة مرة أخرى.',
    actionLabel: 'إعادة المحاولة',
    actionRoute: ROUTES.M23_OVERVIEW,
  },
  notfound: {
    code: 'ERR_404',
    title: 'الصفحة غير موجودة',
    description: 'المورد الذي تبحث عنه غير موجود أو تم نقله.',
    actionLabel: 'العودة للمجتمع',
    actionRoute: ROUTES.M23_OVERVIEW,
  },
  unauthorized: {
    code: 'ERR_401',
    title: 'غير مصرح بالوصول',
    description: 'يجب تسجيل الدخول للوصول إلى هذه الصفحة.',
    actionLabel: 'تسجيل الدخول',
    actionRoute: ROUTES.LOGIN,
  },
  forbidden: {
    code: 'ERR_403',
    title: 'الوصول ممنوع',
    description: 'ليس لديك الصلاحيات اللازمة لعرض هذا المحتوى.',
    actionLabel: 'العودة للمجتمع',
    actionRoute: ROUTES.M23_OVERVIEW,
  },
  server: {
    code: 'ERR_500',
    title: 'خطأ في الخادم',
    description: 'حدث خطأ داخلي في النظام. فريقنا تم إشعاره وسيعمل على حله.',
    actionLabel: 'إعادة المحاولة',
    actionRoute: ROUTES.M23_OVERVIEW,
  },
  network: {
    code: 'ERR_NETWORK',
    title: 'خطأ في الاتصال',
    description: 'تعذر الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.',
    actionLabel: 'إعادة المحاولة',
    actionRoute: ROUTES.M23_OVERVIEW,
  },
};

export function M23ErrorPage({ type = 'generic' }: { type?: string }) {
  const navigate = useNavigate();
  const config = errorStates[type] || errorStates.generic;

  const handleRetry = () => {
    if (config.actionRoute) {
      navigate(config.actionRoute);
    } else {
      window.location.reload();
    }
  };

  return (
    <main id="main" className="wrap" tabIndex={-1} dir="rtl" style={{ padding: 'clamp(2rem,5vw,4rem) 0', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className={styles.error}>
        <div className={styles.icon} aria-hidden="true">⚠</div>
        <span className={styles.code}>{config.code}</span>
        <h1 className="scr-t">{config.title}</h1>
        <p className={styles.desc}>{config.description}</p>
        <div className={styles.actions}>
          <button className="btn dark" onClick={handleRetry}>{config.actionLabel || 'إعادة المحاولة'}</button>
          <button className="btn ghost" onClick={() => navigate(ROUTES.M23_OVERVIEW)}>العودة للمجتمع</button>
        </div>
        <p className={styles.note}>إذا استمر الخطأ، يرجى التواصل مع الدعم الفني.</p>
      </div>
    </main>
  );
}

export default M23ErrorPage;