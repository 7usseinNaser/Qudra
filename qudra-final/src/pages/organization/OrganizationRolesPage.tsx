import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { Badge } from '../../components/ui/Badge';
import styles from './OrganizationRolesPage.module.css';

interface RoleInfo {
  role: string;
  permissions: string[];
  badge: 'proof' | 'neutral' | 'gap';
}

const ROLES: RoleInfo[] = [
  { role: 'Owner', badge: 'proof', permissions: ['تعيين الأدوار', 'إدارة الشركة', 'إدارة التحقق', 'إدارة التوظيف والمشاكل'] },
  { role: 'Admin', badge: 'neutral', permissions: ['إدارة الأعضاء', 'نشر الوظائف', 'مراجعة المرشحين'] },
  { role: 'Manager', badge: 'gap', permissions: ['إدارة سير عمل محدّد', 'دعوة المرشحين'] },
  { role: 'Member', badge: 'neutral', permissions: ['وصول محدود', 'عرض الوظائف'] },
];

export function OrganizationRolesPage() {
  const navigate = useNavigate();

  return (
    <main id="main" className="wrap" tabIndex={-1} dir="rtl" style={{ padding: 'clamp(1.5rem,4vw,2.75rem) 0 5rem' }}>
      <button className="btn ghost" onClick={() => navigate(ROUTES.ORG_PROFILE)} style={{ marginBottom: '0.8rem' }}>
        ← ملف الشركة
      </button>
      <h1 className="scr-t">الأدوار والصلاحيات</h1>
      <p className="scr-p">كل دور له صلاحيات محددة. المالك يدير كل شيء.</p>

      <div className={styles.roleList}>
        {ROLES.map((r) => (
          <div key={r.role} className={`box ${styles.roleCard}`}>
            <div className={styles.roleHead}>
              <h2 className={styles.roleName}>{r.role}</h2>
              <Badge variant={r.badge}>{r.role}</Badge>
            </div>
            <ul className={styles.permList}>
              {r.permissions.map((p, i) => (
                <li key={i} className={styles.permItem}>
                  <span className={styles.permIcon} aria-hidden="true">✓</span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </main>
  );
}

export default OrganizationRolesPage;
