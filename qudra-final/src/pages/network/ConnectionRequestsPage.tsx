import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { Badge } from '../../components/ui/Badge';
import styles from './ConnectionRequestsPage.module.css';

interface Request {
  id: string;
  name: string;
  title: string;
  avatar: string;
  type: 'received' | 'sent';
  date: string;
  status: 'pending' | 'accepted' | 'rejected';
}

const REQUESTS: Request[] = [
  { id: 'r1', name: 'ماجد الشمري', title: 'مهندس Backend · الدمام', avatar: 'م', type: 'received', date: 'منذ ساعتين', status: 'pending' },
  { id: 'r2', name: 'ريم القحطاني', title: 'مطوّرة موبايل · الرياض', avatar: 'ر', type: 'received', date: 'منذ يوم', status: 'pending' },
  { id: 'r3', name: 'محمد الدوسري', title: 'مهندس Backend · جدة', avatar: 'م', type: 'sent', date: 'منذ 3 أيام', status: 'pending' },
  { id: 'r4', name: 'سارة العتيبي', title: 'مطوّرة برمجيات · الخبر', avatar: 'س', type: 'sent', date: 'منذ أسبوع', status: 'accepted' },
];

export function ConnectionRequestsPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'received' | 'sent'>('received');
  const [items, setItems] = useState(REQUESTS);

  const filtered = items.filter((r) => r.type === tab);

  const handleAccept = (id: string) => {
    setItems((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'accepted' } : r)));
  };

  const handleReject = (id: string) => {
    setItems((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'rejected' } : r)));
  };

  return (
    <main id="main" className="wrap" tabIndex={-1} dir="rtl" style={{ padding: 'clamp(1.5rem,4vw,2.75rem) 0 5rem' }}>
      <button className="btn ghost" onClick={() => navigate(ROUTES.HOME)} style={{ marginBottom: '0.8rem' }}>
        ← الرئيسية
      </button>
      <h1 className="scr-t">طلبات التواصل</h1>
      <p className="scr-p">قبول أو رفض طلبات التواصل المرسلة والمستلمة.</p>

      <div className={styles.tabs}>
        <button className={tab === 'received' ? styles.tabActive : styles.tab} onClick={() => setTab('received')}>
          مستلمة ({items.filter((r) => r.type === 'received' && r.status === 'pending').length})
        </button>
        <button className={tab === 'sent' ? styles.tabActive : styles.tab} onClick={() => setTab('sent')}>
          مرسلة ({items.filter((r) => r.type === 'sent').length})
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className={`box ${styles.empty}`}>
          <p className={styles.emptyText}>لا توجد طلبات {tab === 'received' ? 'مستلمة' : 'مرسلة'} حالياً.</p>
        </div>
      ) : (
        <div className={styles.list}>
          {filtered.map((r) => (
            <div key={r.id} className={`box ${styles.card}`}>
              <div className={styles.cardHead}>
                <span className={styles.avatar}>{r.avatar}</span>
                <div className={styles.identity}>
                  <h3 className={styles.name}>{r.name}</h3>
                  <span className={styles.title}>{r.title}</span>
                </div>
                <span className={`${styles.date} mono`}>{r.date}</span>
              </div>
              <div className={styles.cardActions}>
                {r.status === 'pending' && r.type === 'received' && (
                  <>
                    <button className="btn sm" onClick={() => handleAccept(r.id)}>قبول</button>
                    <button className="btn ghost sm" onClick={() => handleReject(r.id)}>رفض</button>
                  </>
                )}
                {r.status === 'pending' && r.type === 'sent' && (
                  <Badge variant="gap">بانتظار الرد</Badge>
                )}
                {r.status === 'accepted' && (
                  <Badge variant="proof">✓ مقبول</Badge>
                )}
                {r.status === 'rejected' && (
                  <Badge variant="neutral">مرفوض</Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className={styles.actions}>
        <button className="btn ghost" onClick={() => navigate(ROUTES.CONNECTIONS)}>
          اتصالاتي
        </button>
        <button className="btn ghost" onClick={() => navigate(ROUTES.MESSAGES)}>
          الرسائل
        </button>
      </div>
    </main>
  );
}

export default ConnectionRequestsPage;
