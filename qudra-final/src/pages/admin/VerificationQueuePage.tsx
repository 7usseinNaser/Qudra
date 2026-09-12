import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { Badge } from '../../components/ui/Badge';
import styles from './VerificationQueuePage.module.css';

interface QueueItem {
  id: string;
  type: 'employment' | 'organization' | 'certificate' | 'report';
  name: string;
  desc: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

const ITEMS: QueueItem[] = [
  { id: 'q1', type: 'employment', name: 'ماجد الشمري', desc: 'توثيق وظيفي في شركة قُدرة', date: '2026-09-08', status: 'pending' },
  { id: 'q2', type: 'organization', name: 'شركة التقنية المتقدمة', desc: 'توثيق شركة — نطاق adv-tech.sa', date: '2026-09-07', status: 'pending' },
  { id: 'q3', type: 'certificate', name: 'شهادة PostgreSQL Associate', desc: 'طلب توثيق شهادة — لينا الحربي', date: '2026-09-06', status: 'pending' },
  { id: 'q4', type: 'report', name: 'بلاغ: دليل مشبوه', desc: 'بلاغ على دليل في مستودع — مراجعة يدوية', date: '2026-09-05', status: 'pending' },
  { id: 'q5', type: 'employment', name: 'ريم القحطاني', desc: 'توثيق وظيفي — مرفوض', date: '2026-09-03', status: 'rejected' },
];

const TYPE_LABELS: Record<string, string> = {
  employment: 'توظيف', organization: 'شركة', certificate: 'شهادة', report: 'بلاغ',
};

export function VerificationQueuePage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<string>('all');
  const [items, setItems] = useState(ITEMS);

  const filtered = filter === 'all' ? items : items.filter((i) => i.type === filter);

  const handleApprove = (id: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status: 'approved' } : i)));
  };

  const handleReject = (id: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status: 'rejected' } : i)));
  };

  return (
    <main id="main" className="wrap" tabIndex={-1} dir="rtl" style={{ padding: 'clamp(1.5rem,4vw,2.75rem) 0 5rem' }}>
      <button className="btn ghost" onClick={() => navigate(ROUTES.ADMIN_DASHBOARD)} style={{ marginBottom: '0.8rem' }}>
        ← لوحة المشرف
      </button>
      <h1 className="scr-t">طابور التحقق</h1>
      <p className="scr-p">مراجعة طلبات التوظيف والشركات والشهادات والبلاغات.</p>

      <div className={styles.filters}>
        <button className={filter === 'all' ? styles.filterActive : styles.filter} onClick={() => setFilter('all')}>الكل</button>
        {Object.entries(TYPE_LABELS).map(([key, label]) => (
          <button key={key} className={filter === key ? styles.filterActive : styles.filter} onClick={() => setFilter(key)}>{label}</button>
        ))}
      </div>

      <div className={styles.list}>
        {filtered.map((item) => (
          <div key={item.id} className={`box ${styles.card}`}>
            <div className={styles.cardHead}>
              <Badge variant="neutral">{TYPE_LABELS[item.type]}</Badge>
              <h3 className={styles.cardName}>{item.name}</h3>
              <span className={`${styles.cardDate} mono`}>{item.date}</span>
            </div>
            <p className={styles.cardDesc}>{item.desc}</p>
            <div className={styles.cardActions}>
              {item.status === 'pending' ? (
                <>
                  <button className="btn sm" onClick={() => handleApprove(item.id)}>قبول</button>
                  <button className="btn ghost sm" onClick={() => handleReject(item.id)}>رفض</button>
                  <button className="btn ghost sm">طلب أدلة إضافية</button>
                </>
              ) : (
                <Badge variant={item.status === 'approved' ? 'proof' : 'neutral'}>
                  {item.status === 'approved' ? '✓ مقبول' : 'مرفوض'}
                </Badge>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default VerificationQueuePage;
