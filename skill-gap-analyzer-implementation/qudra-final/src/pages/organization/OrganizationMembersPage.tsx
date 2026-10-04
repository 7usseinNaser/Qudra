import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { Badge } from '../../components/ui/Badge';
import styles from './OrganizationMembersPage.module.css';

interface Member {
  name: string;
  role: string;
  employmentStatus: string;
  joinStatus: string;
}

const MEMBERS: Member[] = [
  { name: 'حسين العلي', role: 'Owner', employmentStatus: 'موثّق', joinStatus: 'عضو' },
  { name: 'سارة محمد', role: 'Admin', employmentStatus: 'موثّق', joinStatus: 'عضو' },
  { name: 'ماجد الشمري', role: 'Manager', employmentStatus: 'مرتبط', joinStatus: 'عضو' },
  { name: 'ريم القحطاني', role: 'Member', employmentStatus: 'ذاتي', joinStatus: 'دعوة مرسلة' },
  { name: 'محمد الدوسري', role: 'Member', employmentStatus: '—', joinStatus: 'دعوة معلّقة' },
];

export function OrganizationMembersPage() {
  const navigate = useNavigate();

  return (
    <main id="main" className="wrap" tabIndex={-1} dir="rtl" style={{ padding: 'clamp(1.5rem,4vw,2.75rem) 0 5rem' }}>
      <button className="btn ghost" onClick={() => navigate(ROUTES.ORG_PROFILE)} style={{ marginBottom: '0.8rem' }}>
        ← ملف الشركة
      </button>
      <h1 className="scr-t">أعضاء الشركة</h1>
      <p className="scr-p">إدارة أعضاء الفريق وصلاحياتهم وتحققهم.</p>

      <div className={`box ${styles.tableWrap}`}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>العضو</th>
              <th>الدور</th>
              <th>التحقق الوظيفي</th>
              <th>حالة الانضمام</th>
            </tr>
          </thead>
          <tbody>
            {MEMBERS.map((m, i) => (
              <tr key={i}>
                <td className={styles.nameCell}>
                  <span className={styles.avatar}>{m.name.charAt(0)}</span>
                  <span>{m.name}</span>
                </td>
                <td>
                  <Badge variant={m.role === 'Owner' ? 'proof' : m.role === 'Admin' ? 'neutral' : 'gap'}>
                    {m.role}
                  </Badge>
                </td>
                <td className={styles.statusCell}>{m.employmentStatus}</td>
                <td className={styles.statusCell}>{m.joinStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.actions}>
        <button className="btn ghost" onClick={() => navigate(ROUTES.ORG_ROLES)}>
          الأدوار والصلاحيات
        </button>
        <button className="btn" onClick={() => navigate(ROUTES.ORG_DASHBOARD)}>
          لوحة التحكم
        </button>
      </div>
    </main>
  );
}

export default OrganizationMembersPage;
