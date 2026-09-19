import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import styles from './NotificationsPage.module.css';

interface Notification {
  id: string;
  category: 'evidence' | 'ai' | 'capability' | 'gap' | 'match' | 'opportunity' | 'connection' | 'message' | 'challenge' | 'verification';
  title: string;
  desc: string;
  time: string;
  read: boolean;
  link: string;
}

const NOTIFICATIONS: Notification[] = [
  { id: 'n1', category: 'evidence', title: 'دليل جديد تمت إضافته', desc: 'تم تحليل مستودع inventory-api وإضافة 3 أدلة', time: 'منذ ساعتين', read: false, link: ROUTES.PROFILE },
  { id: 'n2', category: 'ai', title: 'اكتمل التحليل', desc: 'تم تحديث مستوى قدرتك في PostgreSQL إلى ADVANCED', time: 'منذ 5 ساعات', read: false, link: ROUTES.MASTER_PROFILE },
  { id: 'n3', category: 'match', title: 'فرصة جديدة مطابقة', desc: 'Senior Backend Developer — مطابقة 92%', time: 'منذ يوم', read: false, link: ROUTES.OPPORTUNITIES },
  { id: 'n4', category: 'connection', title: 'طلب تواصل جديد', desc: 'ماجد الشمري يريد التواصل معك', time: 'منذ يومين', read: true, link: ROUTES.CONNECTION_REQUESTS },
  { id: 'n5', category: 'challenge', title: 'نتيجة التحدي', desc: 'اجتزت تحدي بناء واجهة REST بنتيجة 85%', time: 'منذ 3 أيام', read: true, link: ROUTES.CHALLENGES },
  { id: 'n6', category: 'verification', title: 'تم توثيق الشركة', desc: 'شركة قُدرة التقنية أصبحت موثّقة', time: 'منذ أسبوع', read: true, link: ROUTES.ORG_PROFILE },
];

const CATEGORY_LABELS: Record<string, string> = {
  evidence: 'أدلة', ai: 'تحليل ذكي', capability: 'قدرات', gap: 'فجوات',
  match: 'مطابقة', opportunity: 'فرص', connection: 'تواصل',
  message: 'رسائل', challenge: 'تحديات', verification: 'تحقق',
};

export function NotificationsPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState(NOTIFICATIONS);
  const [filter, setFilter] = useState<string>('all');

  const filtered = filter === 'all' ? items : items.filter((n) => n.category === filter);
  const unreadCount = items.filter((n) => !n.read).length;

  const handleMarkRead = (id: string) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const handleMarkAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <main id="main" className="wrap" tabIndex={-1} dir="rtl" style={{ padding: 'clamp(1.5rem,4vw,2.75rem) 0 5rem' }}>
      <div className={styles.header}>
        <div>
          <button className="btn ghost" onClick={() => navigate(ROUTES.HOME)} style={{ marginBottom: '0.8rem' }}>
            ← الرئيسية
          </button>
          <h1 className="scr-t">الإشعارات</h1>
          <p className="scr-p">{unreadCount} إشعار غير مقروء</p>
        </div>
        {unreadCount > 0 && (
          <button className="btn ghost sm" onClick={handleMarkAllRead}>تعليم الكل كمقروء</button>
        )}
      </div>

      <div className={styles.filters}>
        <button className={filter === 'all' ? styles.filterActive : styles.filter} onClick={() => setFilter('all')}>الكل</button>
        {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
          <button key={key} className={filter === key ? styles.filterActive : styles.filter} onClick={() => setFilter(key)}>
            {label}
          </button>
        ))}
      </div>

      <div className={styles.list}>
        {filtered.length === 0 ? (
          <div className={`box ${styles.empty}`}>
            <p className={styles.emptyText}>لا توجد إشعارات في هذه الفئة.</p>
          </div>
        ) : (
          filtered.map((n) => (
            <button
              key={n.id}
              className={`${styles.notifItem} ${!n.read ? styles.unread : ''}`}
              onClick={() => { handleMarkRead(n.id); navigate(n.link); }}
            >
              <span className={styles.notifCategory}>{CATEGORY_LABELS[n.category]}</span>
              <div className={styles.notifContent}>
                <div className={styles.notifHead}>
                  <span className={styles.notifTitle}>{n.title}</span>
                  {!n.read && <span className={styles.unreadDot} aria-hidden="true"></span>}
                </div>
                <span className={styles.notifDesc}>{n.desc}</span>
                <span className={`${styles.notifTime} mono`}>{n.time}</span>
              </div>
            </button>
          ))
        )}
      </div>
    </main>
  );
}

export default NotificationsPage;
