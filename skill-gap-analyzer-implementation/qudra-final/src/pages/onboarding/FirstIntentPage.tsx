import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Lightbulb, UserCheck, ArrowLeft } from 'lucide-react';
import { ROUTES } from '../../constants/routes';
import { Badge } from '../../components/ui/Badge';
import { GithubIcon } from '../../components/ui/GithubIcon';
import styles from './FirstIntentPage.module.css';

interface IntentOption {
  id: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
  badge?: string;
  isFeatured?: boolean;
  route: string;
}

export const FirstIntentPage: React.FC = () => {
  const navigate = useNavigate();

  const options: IntentOption[] = [
    {
      id: 'github',
      icon: <GithubIcon size={22} />,
      title: 'إثبات كود مستودعات GitHub الخاصة بي',
      desc: 'المسار الأسرع لبناء Master Profile موثوق عبر مسح المستودعات واستخراج المهارات تلقائياً.',
      badge: 'المسار الموصى به',
      isFeatured: true,
      route: ROUTES.GITHUB_CONNECT
    },
    {
      id: 'discover',
      icon: <Compass size={22} />,
      title: 'استكشاف التحديات والمشاريع الحية',
      desc: 'تصفح المشكلات البرمجية المطروحة من أصحاب المشكلات والبدء في تقديم حلول مبرهنة.',
      route: ROUTES.DISCOVER
    },
    {
      id: 'problem',
      icon: <Lightbulb size={22} />,
      title: 'نشر مشكلة أو البحث عن كفاءات مؤكدة',
      desc: 'صياغة تحدي هندسي وتحديد المهارات المطلوبة للوصول لأفضل المرشحين.',
      route: ROUTES.PROBLEM
    },
    {
      id: 'profile',
      icon: <UserCheck size={22} />,
      title: 'الذهاب إلى صفحتي الرئيسية وتفقد ملفي',
      desc: 'معاينة حالة حسابي، الأدلة، والتحكم بكافة جوانب الملف المهاري.',
      route: ROUTES.HOME
    }
  ];

  return (
    <div className={styles.container} dir="rtl">
      <div className={styles.card}>
        <span className={styles.stepTag}>الخطوة 3 من 3 • تحديد الاتجاه</span>

        <div>
          <h1 className={styles.title}>ما هي خطوتك التالية في قُدرة؟</h1>
          <p className={styles.description}>
            اختر كيف تفضل البدء اليوم. يمكنك دائماً الوصول لجميع الخيارات والأدوات لاحقاً.
          </p>
        </div>

        <div className={styles.optionsList}>
          {options.map(opt => (
            <button
              key={opt.id}
              className={`${styles.optionCard} ${opt.isFeatured ? styles.featured : ''}`}
              onClick={() => navigate(opt.route)}
            >
              <div className={styles.iconBox}>{opt.icon}</div>
              <div className={styles.textGroup}>
                <h3 className={styles.optTitle}>
                  <span>{opt.title}</span>
                  {opt.badge && <Badge variant="proof">{opt.badge}</Badge>}
                </h3>
                <p className={styles.optDesc}>{opt.desc}</p>
              </div>
              <ArrowLeft size={18} color="var(--ink-3)" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FirstIntentPage;
