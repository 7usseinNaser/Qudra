import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import styles from './M26EmptyPage.module.css';

interface EmptyStateConfig {
  icon: string;
  title: string;
  description: string;
  actionLabel?: string;
  actionRoute?: string;
}

const emptyStates: Record<string, EmptyStateConfig> = {
  billing: {
    icon: '💳',
    title: 'لا توجد خطة نشطة',
    description: 'أنت حالياً على الخطة المجانية. اختر خطة للاستفادة من مزايا إضافية.',
    actionLabel: 'عرض الخطط',
    actionRoute: ROUTES.M26_DETAILS,
  },
  payment: {
    icon: '💰',
    title: 'لا توجد طرق دفع محفوظة',
    description: 'أضف طريقة دفع لتمكين التجديد التلقائي للاشتراك.',
    actionLabel: 'إضافة طريقة دفع',
    actionRoute: ROUTES.M26_DETAILS,
  },
  invoices: {
    icon: '🧾',
    title: 'لا توجد فواتير',
    description: 'ستظهر الفواتير هنا عند إجراء أي مدفوعات.',
  },
  usage: {
    icon: '📊',
    title: 'لا توجد بيانات استخدام',
    description: 'ستظهر إحصائيات الاستخدام عند البدء في استخدام المنصة.',
  },
};

export function M26EmptyPage({ type = 'billing' }: { type?: string }) {
  const navigate = useNavigate();
  const config = emptyStates[type] || emptyStates.billing;

  return (
    <main id="main" className="wrap" tabIndex={-1} dir="rtl" style={{ padding: 'clamp(2rem,5vw,4rem) 0', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className={styles.empty}>
        <div className={styles.icon} aria-hidden="true">{config.icon}</div>
        <h1 className="scr-t">{config.title}</h1>
        <p className={styles.desc}>{config.description}</p>
        {config.actionLabel && config.actionRoute && (
          <button className="btn dark" onClick={() => navigate(config.actionRoute!)}>{config.actionLabel}</button>
        )}
        <button className="btn ghost" onClick={() => navigate(ROUTES.M26_OVERVIEW)} style={{ marginTop: '1rem' }}>العودة للإعدادات</button>
      </div>
    </main>
  );
}

export default M26EmptyPage;