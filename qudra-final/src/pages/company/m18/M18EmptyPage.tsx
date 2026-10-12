import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import styles from './M18EmptyPage.module.css';

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
    title: 'لا توجد مرشحات محفوظة',
    description: 'ابدأ بالبحث عن المواهب وحفظ المرشحين المناسبين لمشاكلك.',
    actionLabel: 'بحث عن مواهب',
    actionRoute: ROUTES.FIND_TALENT,
  },
  problems: {
    icon: '🎯',
    title: 'لا توجد مشاكل مُنشأة',
    description: 'أنشئ أول مشكلة لتحليل المتطلبات والعثور على أفضل المواهب.',
    actionLabel: 'إنشاء مشكلة',
    actionRoute: ROUTES.M18_CREATE,
  },
  roles: {
    icon: '💼',
    title: 'لا توجد وظائف مفتوحة',
    description: 'انشر وظيفة جديدة لجذب المرشحين المؤهلين.',
    actionLabel: 'نشر وظيفة',
    actionRoute: ROUTES.JOB_DEFINITION,
  },
  activity: {
    icon: '📋',
    title: 'لا يوجد نشاط حديث',
    description: 'سيظهر هنا نشاط فريقك والمرشحين بمجرد البدء.',
  },
  results: {
    icon: '🔍',
    title: 'لا توجد نتائج مطابقة',
    description: 'أنشئ مشكلة أولاً ليقوم النظام بمطابقة أفضل المرشحين.',
    actionLabel: 'إنشاء مشكلة',
    actionRoute: ROUTES.M18_CREATE,
  },
};

export function M18EmptyPage({ type = 'candidates' }: { type?: string }) {
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
        <button className="btn ghost" onClick={() => navigate(ROUTES.M18_OVERVIEW)} style={{ marginTop: '1rem' }}>العودة للوحة التحكم</button>
      </div>
    </main>
  );
}

export default M18EmptyPage;