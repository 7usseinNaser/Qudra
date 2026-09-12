import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import styles from './ConversationPage.module.css';

interface Message {
  id: string;
  sender: 'me' | 'them';
  text: string;
  time: string;
}

const CHAT_HISTORY: Record<string, { name: string; avatar: string; messages: Message[] }> = {
  lina: {
    name: 'لينا الحربي',
    avatar: 'ل',
    messages: [
      { id: 'm1', sender: 'them', text: 'مرحباً، شكراً على دعوتك للمشروع.', time: '10:30' },
      { id: 'm2', sender: 'me', text: 'أهلاً بكِ لينا! أدلتك في PostgreSQL ممتازة.', time: '10:32' },
      { id: 'm3', sender: 'them', text: 'شكراً على المشاركة، سأراجع الأدلة وأرد عليك قريباً.', time: '10:35' },
    ],
  },
  mohammed: {
    name: 'محمد الدوسري',
    avatar: 'م',
    messages: [
      { id: 'm1', sender: 'me', text: 'محمد، هل أنت متفرّغ لمشروع جديد؟', time: '09:00' },
      { id: 'm2', sender: 'them', text: 'هل أنت متفرّغ للأسبوع القادم؟', time: '09:15' },
    ],
  },
};

export function ConversationPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [input, setInput] = useState('');

  const chat = CHAT_HISTORY[id || 'lina'] || CHAT_HISTORY.lina;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setInput('');
  };

  return (
    <main id="main" className="wrap" tabIndex={-1} dir="rtl" style={{ padding: 'clamp(1.5rem,4vw,2.75rem) 0 5rem' }}>
      <button className="btn ghost" onClick={() => navigate(ROUTES.MESSAGES)} style={{ marginBottom: '0.8rem' }}>
        ← الرسائل
      </button>

      <div className={`box ${styles.chatContainer}`}>
        <div className={styles.chatHeader}>
          <span className={styles.avatar}>{chat.avatar}</span>
          <div className={styles.headerInfo}>
            <h2 className={styles.headerName}>{chat.name}</h2>
            <span className={styles.headerStatus}>متصل الآن</span>
          </div>
          <button className="btn ghost sm" onClick={() => navigate(`/u/${id}`)}>عرض الملف</button>
        </div>

        <div className={styles.messages}>
          {chat.messages.map((m) => (
            <div key={m.id} className={m.sender === 'me' ? styles.msgMe : styles.msgThem}>
              <span className={styles.msgText}>{m.text}</span>
              <span className={`${styles.msgTime} mono`}>{m.time}</span>
            </div>
          ))}
        </div>

        <form className={styles.composer} onSubmit={handleSend}>
          <input
            type="text"
            className={styles.composerInput}
            placeholder="اكتب رسالة..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" className="btn sm" disabled={!input.trim()}>إرسال</button>
        </form>
      </div>
    </main>
  );
}

export default ConversationPage;
