import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import styles from './M19EmptyPage.module.css';

interface EmptyStateConfig {
  icon: string;
  title: string;
  description: string;
  actionLabel?: string;
  actionRoute?: string;
}

const emptyStates: Record<string, EmptyStateConfig> = {
  candidates: {
    icon: '👥',
    title: 'لا يوجد مرشحين في الخط',
    description: 'ابدأ بإضافة مرشحين جدد لملء خط التوظيف.',
    actionLabel: 'إضافة مرشح',
    actionRoute: ROUTES.M19_CREATE,
  },
  stage: {
    icon: '📋',
    title: 'لا يوجد مرشحين في هذه المرحلة',
    description: 'لا يوجد مرشحين حالياً في هذه المرحلة من الخط.',
  },
  results: {
    icon: '📊',
    title: 'لا توجد نتائج متاحة',
    description: 'أضف مرشحين وحركهم عبر المراحل لرؤية التحليلات.',
    actionLabel: 'إضافة مرشح',
    actionRoute: ROUTES.M19_CREATE,
  },
};

export function M19EmptyPage({ type = 'candidates' }: { type?: string }) {
  const navigate = useNavigate();
  const config = emptyStates[type] || emptyStates.candidates;

  return (
    <main id="main" className="wrap" tabIndex={-1} dir="rtl" style={{ padding: 'clamp(2rem,5vw,4rem) 0', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className={styles.empty}>
        <div className={styles.icon} aria-hidden="true">{config.icon}</div>
        <h1 className="scr-t">{config.title}</h1>
        <p className={styles.desc}>{config.description}</p>
        {config.actionLabel && config.actionRoute && (
          <button className="btn dark" onClick={() => navigate(config.actionRoute!)}>{config.actionLabel}</button>
        )}
        <button className="btn ghost" onClick={() => navigate(ROUTES.M19_OVERVIEW)} style={{ marginTop: '1rem' }}>العودة لخط المرشحين</button>
      </div>
    </main>
  );
}

export default M19EmptyPage;