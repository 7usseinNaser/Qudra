import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { Tag } from '../../components/ui/Tag';
import styles from './ConnectionsPage.module.css';

interface Connection {
  id: string;
  name: string;
  title: string;
  avatar: string;
  skills: string[];
}

const CONNECTIONS: Connection[] = [
  { id: 'lina', name: 'لينا الحربي', title: 'مهندسة بيانات · الرياض', avatar: 'ل', skills: ['PostgreSQL', 'FastAPI'] },
  { id: 'mohammed', name: 'محمد الدوسري', title: 'مهندس Backend · جدة', avatar: 'م', skills: ['Node.js', 'Docker'] },
  { id: 'majid', name: 'ماجد الشمري', title: 'مهندس Backend · الدمام', avatar: 'م', skills: ['Node.js', 'REST APIs'] },
  { id: 'sara', name: 'سارة العتيبي', title: 'مطوّرة برمجيات · الخبر', avatar: 'س', skills: ['Python'] },
];

export function ConnectionsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'people' | 'groups'>('all');

  const filtered = CONNECTIONS.filter((c) =>
    c.name.includes(search) || c.title.includes(search)
  );

  return (
    <main id="main" className="wrap" tabIndex={-1} dir="rtl" style={{ padding: 'clamp(1.5rem,4vw,2.75rem) 0 5rem' }}>
      <button className="btn ghost" onClick={() => navigate(ROUTES.HOME)} style={{ marginBottom: '0.8rem' }}>
        ← الرئيسية
      </button>
      <h1 className="scr-t">اتصالاتي</h1>
      <p className="scr-p">شبكتك المهنية من الأشخاص والمجموعات.</p>

      <div className={styles.toolbar}>
        <input
          type="search"
          className={styles.search}
          placeholder="ابحث في اتصالاتك..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className={styles.filters}>
          <button className={filter === 'all' ? styles.filterActive : styles.filter} onClick={() => setFilter('all')}>الكل</button>
          <button className={filter === 'people' ? styles.filterActive : styles.filter} onClick={() => setFilter('people')}>أشخاص</button>
          <button className={filter === 'groups' ? styles.filterActive : styles.filter} onClick={() => setFilter('groups')}>مجموعات</button>
        </div>
      </div>

      {filter !== 'groups' && (
        <div className={styles.list}>
          {filtered.map((c) => (
            <div key={c.id} className={`box ${styles.card}`}>
              <div className={styles.cardHead}>
                <span className={styles.avatar}>{c.avatar}</span>
                <div className={styles.identity}>
                  <h3 className={styles.name}>{c.name}</h3>
                  <span className={styles.title}>{c.title}</span>
                </div>
              </div>
              <div className={styles.tags}>
                {c.skills.map((s) => (
                  <Tag key={s} name={s} variant="proven" size="sm" />
                ))}
              </div>
              <div className={styles.cardActions}>
                <button className="btn ghost sm" onClick={() => navigate(`/u/${c.id}`)}>عرض الملف</button>
                <button className="btn sm" onClick={() => navigate(ROUTES.CONVERSATION.replace(':id', c.id))}>رسالة</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {filter === 'groups' && (
        <div className={`box ${styles.empty}`}>
          <p className={styles.emptyText}>لا توجد مجموعات بعد. أنشئ مجموعة من محادثة.</p>
          <button className="btn" onClick={() => navigate(ROUTES.CREATE_GROUP)}>إنشاء مجموعة</button>
        </div>
      )}

      <div className={styles.actions}>
        <button className="btn ghost" onClick={() => navigate(ROUTES.CONNECTION_REQUESTS)}>
          طلبات التواصل
        </button>
        <button className="btn ghost" onClick={() => navigate(ROUTES.COMM_SETTINGS)}>
          إعدادات التواصل
        </button>
      </div>
    </main>
  );
}

export default ConnectionsPage;
