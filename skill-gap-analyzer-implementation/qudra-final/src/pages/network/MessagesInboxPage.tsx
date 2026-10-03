import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import styles from './MessagesInboxPage.module.css';

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  isGroup: boolean;
}

const CONVERSATIONS: Conversation[] = [
  { id: 'lina', name: 'لينا الحربي', avatar: 'ل', lastMessage: 'شكراً على المشاركة، سأراجع الأدلة...', timestamp: 'منذ ساعتين', unread: 2, isGroup: false },
  { id: 'mohammed', name: 'محمد الدوسري', avatar: 'م', lastMessage: 'هل أنت متفرّغ للأسبوع القادم؟', timestamp: 'منذ يوم', unread: 0, isGroup: false },
  { id: 'team-alpha', name: 'فريق ألفا', avatar: 'ف', lastMessage: 'ماجد: تم تسليم الواجهة الأمامية', timestamp: 'منذ 3 أيام', unread: 5, isGroup: true },
  { id: 'sara', name: 'سارة العتيبي', avatar: 'س', lastMessage: 'تمام، سأرسل لك التحدي', timestamp: 'منذ أسبوع', unread: 0, isGroup: false },
];

export function MessagesInboxPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const filtered = CONVERSATIONS.filter((c) => c.name.includes(search));

  return (
    <main id="main" className="wrap" tabIndex={-1} dir="rtl" style={{ padding: 'clamp(1.5rem,4vw,2.75rem) 0 5rem' }}>
      <button className="btn ghost" onClick={() => navigate(ROUTES.HOME)} style={{ marginBottom: '0.8rem' }}>
        ← الرئيسية
      </button>
      <h1 className="scr-t">الرسائل</h1>
      <p className="scr-p">محادثاتك مع شبكتك المهنية.</p>

      <input
        type="search"
        className={styles.search}
        placeholder="ابحث في المحادثات..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ margin: '1.2rem 0' }}
      />

      {filtered.length === 0 ? (
        <div className={`box ${styles.empty}`}>
          <p className={styles.emptyText}>لا توجد محادثات بعد.</p>
        </div>
      ) : (
        <div className={styles.list}>
          {filtered.map((c) => (
            <button
              key={c.id}
              className={styles.convItem}
              onClick={() => navigate(ROUTES.CONVERSATION.replace(':id', c.id))}
            >
              <span className={styles.avatar}>{c.avatar}</span>
              <div className={styles.convInfo}>
                <div className={styles.convHead}>
                  <span className={styles.convName}>{c.name}</span>
                  {c.isGroup && <span className={styles.groupBadge}>مجموعة</span>}
                  <span className={`${styles.convTime} mono`}>{c.timestamp}</span>
                </div>
                <span className={styles.convMsg}>{c.lastMessage}</span>
              </div>
              {c.unread > 0 && (
                <span className={`${styles.unread} num`}>{c.unread}</span>
              )}
            </button>
          ))}
        </div>
      )}

      <div className={styles.actions}>
        <button className="btn ghost" onClick={() => navigate(ROUTES.CREATE_GROUP)}>
          إنشاء مجموعة
        </button>
      </div>
    </main>
  );
}

export default MessagesInboxPage;
