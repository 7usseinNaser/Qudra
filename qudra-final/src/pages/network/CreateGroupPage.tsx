import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import styles from './CreateGroupPage.module.css';

interface ConnectedPerson {
  id: string;
  name: string;
  avatar: string;
  connected: boolean;
}

const PEOPLE: ConnectedPerson[] = [
  { id: 'lina', name: 'لينا الحربي', avatar: 'ل', connected: true },
  { id: 'mohammed', name: 'محمد الدوسري', avatar: 'م', connected: true },
  { id: 'majid', name: 'ماجد الشمري', avatar: 'م', connected: true },
  { id: 'reem', name: 'ريم القحطاني', avatar: 'ر', connected: false },
  { id: 'sara', name: 'سارة العتيبي', avatar: 'س', connected: true },
];

export function CreateGroupPage() {
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState('');
  const [selected, setSelected] = useState<string[]>([]);

  const connectedPeople = PEOPLE.filter((p) => p.connected);

  const togglePerson = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(ROUTES.MESSAGES);
  };

  return (
    <main id="main" className="wrap" tabIndex={-1} dir="rtl" style={{ padding: 'clamp(1.5rem,4vw,2.75rem) 0 5rem' }}>
      <button className="btn ghost" onClick={() => navigate(ROUTES.MESSAGES)} style={{ marginBottom: '0.8rem' }}>
        ← الرسائل
      </button>
      <h1 className="scr-t">إنشاء مجموعة</h1>
      <p className="scr-p">يمكنك إضافة الأشخاص المتصلين فقط للمجموعة.</p>

      <form className={`box ${styles.form}`} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label htmlFor="grp-name" className={styles.label}>اسم المجموعة</label>
          <input
            id="grp-name"
            type="text"
            className={styles.input}
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="مثال: فريق Backend"
            required
          />
        </div>

        <div className={styles.field}>
          <span className={styles.label}>الأعضاء ({selected.length} مختار)</span>
          <div className={styles.peopleList}>
            {connectedPeople.map((p) => (
              <button
                key={p.id}
                type="button"
                className={`${styles.personCard} ${selected.includes(p.id) ? styles.personSelected : ''}`}
                onClick={() => togglePerson(p.id)}
              >
                <span className={styles.avatar}>{p.avatar}</span>
                <span className={styles.personName}>{p.name}</span>
                <span className={styles.checkmark}>{selected.includes(p.id) ? '✓' : ''}</span>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.actions}>
          <button type="button" className="btn ghost" onClick={() => navigate(ROUTES.MESSAGES)}>
            إلغاء
          </button>
          <button type="submit" className="btn dark" disabled={selected.length < 2}>
            إنشاء المجموعة
          </button>
        </div>
      </form>

      <div className={`box ${styles.note}`}>
        <span className={styles.noteText}>
          لا يمكنك إضافة شخص غير متصل بالمجموعة. تأكد من قبول طلب التواصل أولاً.
        </span>
      </div>
    </main>
  );
}

export default CreateGroupPage;
