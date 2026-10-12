import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { Badge } from '../../../components/ui/Badge';
import styles from './M26OverviewPage.module.css';

interface SettingsSection {
  id: string;
  icon: string;
  title: string;
  description: string;
  route: string;
  badge?: string;
  badgeVariant?: 'proof' | 'gap' | 'neutral';
}

const sections: SettingsSection[] = [
  {
    id: 'profile',
    icon: '👤',
    title: 'الملف الشخصي',
    description: 'تعديل الاسم، الصورة، الوصف، ومعلومات التواصل',
    route: ROUTES.PROFILE_EDIT,
  },
  {
    id: 'privacy',
    icon: '🔒',
    title: 'الخصوصية والأمان',
    description: 'إدارة رؤية الملف، البيانات، وصلاحيات التطبيقات',
    route: ROUTES.PRIVACY,
  },
  {
    id: 'notifications',
    icon: '🔔',
    title: 'الإشعارات',
    description: 'تخصيص أنواع الإشعارات وقنوات الاستلام',
    route: ROUTES.NOTIFICATIONS,
  },
  {
    id: 'accounts',
    icon: '🔗',
    title: 'الحسابات المتصلة',
    description: 'GitHub، LinkedIn، ومصادر الأدلة الأخرى',
    route: ROUTES.CONNECTED_ACCOUNTS,
  },
  {
    id: 'communications',
    icon: '📧',
    title: 'التواصل والترغيب',
    description: 'إدارة الاشتراكات في النشرات والعروض',
    route: ROUTES.COMM_SETTINGS,
  },
  {
    id: 'billing',
    icon: '💳',
    title: 'الفوترة والاشتراكات',
    description: 'الخطط، طرق الدفع، والفواتير (Demo فقط)',
    route: ROUTES.M26_DETAILS,
    badge: 'Demo',
    badgeVariant: 'neutral',
  },
  {
    id: 'team',
    icon: '👥',
    title: 'إدارة الفريق',
    description: 'دعوة الأعضاء، الأدوار، والصلاحيات',
    route: ROUTES.ORG_MEMBERS,
  },
  {
    id: 'appearance',
    icon: '🎨',
    title: 'المظهر واللغة',
    description: 'الوضع الداكن/الفاتح، اللغة، والمنطقة الزمنية',
    route: ROUTES.SETTINGS,
  },
];

export function M26OverviewPage() {
  const navigate = useNavigate();

  return (
    <main id="main" className="wrap" tabIndex={-1} dir="rtl" style={{ padding: 'clamp(1.5rem,4vw,2.75rem) 0 5rem' }}>
      <div className={styles.header}>
        <h1 className="scr-t">الإعدادات</h1>
        <p className={styles.subtitle}>إدارة حسابك، خصوصيتك، وخططك</p>
      </div>

      <div className={styles.notice}>
        <span className={styles.noticeicon}>ℹ️</span>
        <div>
          <strong>تنبيه مهم:</strong> قسم الفوترة والاشتراكات يحتوي على بيانات توضيحية (Demo) فقط. لا يتم جمع أي معلومات دفع حقيقية في هذه النسخة.
        </div>
      </div>

      <div className={styles.grid}>
        {sections.map((section) => (
          <article key={section.id} className={styles.card} onClick={() => navigate(section.route)}>
            <div className={styles.cardicon} aria-hidden="true">{section.icon}</div>
            <div className={styles.cardcontent}>
              <div className={styles.cardheader}>
                <h3 className={styles.cardtitle}>{section.title}</h3>
                {section.badge && <Badge variant={section.badgeVariant!}>{section.badge}</Badge>}
              </div>
              <p className={styles.carddesc}>{section.description}</p>
            </div>
            <span className={styles.cardarrow}>→</span>
          </article>
        ))}
      </div>

      <div className={styles.dangerzone}>
        <h3 className={styles.dangertitle}>منطقة الخطر</h3>
        <div className={styles.dangeractions}>
          <div className={styles.dangeritem}>
            <div>
              <h4 className={styles.dangername}>تصدير البيانات</h4>
              <p className={styles.dangerdesc}>تحميل نسخة من جميع بياناتك</p>
            </div>
            <button className="btn ghost">تصدير</button>
          </div>
          <div className={styles.dangeritem}>
            <div>
              <h4 className={styles.dangername}>حذف الحساب</h4>
              <p className={styles.dangerdesc}>حذف حسابك وجميع بياناتك نهائياً</p>
            </div>
            <button className="btn danger">حذف</button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default M26OverviewPage;