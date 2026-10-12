import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import styles from './M23EmptyPage.module.css';

interface EmptyStateConfig {
  icon: string;
  title: string;
  description: string;
  actionLabel?: string;
  actionRoute?: string;
}

const emptyStates: Record<string, EmptyStateConfig> = {
  feed: {
    icon: '📝',
    title: 'لا توجد مشاركات بعد',
    description: 'كن أول من يشارك المعرفة أو يطرح سؤالاً في المجتمع.',
    actionLabel: 'إنشاء مشاركة',
    actionRoute: ROUTES.M23_CREATE,
  },
  resources: {
    icon: '📎',
    title: 'لا توجد موارد مشتركة',
    description: 'شارك أدوات، قوالب، أو أدلة تقنية مع المجتمع.',
    actionLabel: 'إضافة مورد',
    actionRoute: ROUTES.M23_CREATE,
  },
  exchange: {
    icon: '🔄',
    title: 'لا توجد طلبات تبادل',
    description: 'ابدأ بتبادل المهارات أو المشاريع مع أعضاء المجتمع.',
  },
  stats: {
    icon: '📊',
    title: 'لا توجد إحصائيات متاحة',
    description: 'ستظهر الإحصائيات عند وجود نشاط في المجتمع.',
  },
};

export function M23EmptyPage({ type = 'feed' }: { type?: string }) {
  const navigate = useNavigate();
  const config = emptyStates[type] || emptyStates.feed;

  return (
    <main id="main" className="wrap" tabIndex={-1} dir="rtl" style={{ padding: 'clamp(2rem,5vw,4rem) 0', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className={styles.empty}>
        <div className={styles.icon} aria-hidden="true">{config.icon}</div>
        <h1 className="scr-t">{config.title}</h1>
        <p className={styles.desc}>{config.description}</p>
{config.actionLabel && config.actionRoute && (
          <button className="btn dark" onClick={() => navigate(config.actionRoute!)}>{config.actionLabel}</button>
        )}
        <button className="btn ghost" onClick={() => navigate(ROUTES.M23_OVERVIEW)} style={{ marginTop: '1rem' }}>العودة للمجتمع</button>
      </div>
    </main>
  );
}

export default M23EmptyPage;