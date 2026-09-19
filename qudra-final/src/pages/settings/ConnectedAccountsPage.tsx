import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { Badge } from '../../components/ui/Badge';
import styles from './ConnectedAccountsPage.module.css';

interface Account {
  name: string;
  connected: boolean;
  permissions: string;
  lastSync: string;
}

const ACCOUNTS: Account[] = [
  { name: 'GitHub', connected: true, permissions: 'قراءة المستودعات العامة', lastSync: 'منذ ساعتين' },
  { name: 'Google', connected: false, permissions: '—', lastSync: '—' },
  { name: 'LinkedIn', connected: false, permissions: '—', lastSync: '—' },
];

export function ConnectedAccountsPage() {
  const navigate = useNavigate();

  return (
    <main id="main" className="wrap" tabIndex={-1} dir="rtl" style={{ padding: 'clamp(1.5rem,4vw,2.75rem) 0 5rem' }}>
      <button className="btn ghost" onClick={() => navigate(ROUTES.SETTINGS)} style={{ marginBottom: '0.8rem' }}>
        ← الإعدادات
      </button>
      <h1 className="scr-t">الحسابات المرتبطة</h1>
      <p className="scr-p">إدارة المصادر المرتبطة بحسابك.</p>

      <div className={styles.list}>
        {ACCOUNTS.map((a) => (
          <div key={a.name} className={`box ${styles.card}`}>
            <div className={styles.cardHead}>
              <span className={styles.accountIcon}>{a.name.charAt(0)}</span>
              <div className={styles.accountInfo}>
                <h3 className={styles.accountName}>{a.name}</h3>
                <span className={styles.accountPerms}>{a.permissions}</span>
              </div>
              {a.connected ? (
                <Badge variant="proof">متصل</Badge>
              ) : (
                <Badge variant="neutral">غير متصل</Badge>
              )}
            </div>
            {a.connected ? (
              <div className={styles.cardBody}>
                <span className={`${styles.syncTime} mono`}>آخر مزامنة: {a.lastSync}</span>
                <div className={styles.cardActions}>
                  <button className="btn ghost sm">مزامنة الآن</button>
                  <button className="btn ghost sm">إلغاء الربط</button>
                </div>
              </div>
            ) : (
              <div className={styles.cardActions}>
                <button className="btn sm" onClick={() => navigate(ROUTES.GITHUB_CONNECT)}>
                  ربط الحساب
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}

export default ConnectedAccountsPage;
