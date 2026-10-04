import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import styles from './GroupConversationPage.module.css';

interface GroupMessage {
  id: string;
  sender: string;
  text: string;
  time: string;
  isMe: boolean;
}

const GROUP_CHAT: Record<string, { name: string; members: string[]; messages: GroupMessage[] }> = {
  'team-alpha': {
    name: 'فريق ألفا',
    members: ['لينا الحربي', 'محمد الدوسري', 'ماجد الشمري'],
    messages: [
      { id: 'm1', sender: 'لينا الحربي', text: 'تم تسليم واجهة REST', time: '10:00', isMe: false },
      { id: 'm2', sender: 'أنا', text: 'ممتاز! سأراجع الكود', time: '10:05', isMe: true },
      { id: 'm3', sender: 'ماجد الشمري', text: 'تم تسليم الواجهة الأمامية', time: '10:30', isMe: false },
    ],
  },
};

export function GroupConversationPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  const chat = GROUP_CHAT[id || 'team-alpha'] || GROUP_CHAT['team-alpha'];

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
          <span className={styles.groupAvatar}>ف</span>
          <div className={styles.headerInfo}>
            <h2 className={styles.headerName}>{chat.name}</h2>
            <span className={styles.headerMembers}>{chat.members.length} أعضاء</span>
          </div>
          <button className="btn ghost sm" onClick={() => setShowSettings(!showSettings)}>إعدادات</button>
        </div>

        {showSettings && (
          <div className={styles.settingsPanel}>
            <h3 className={styles.settingsTitle}>أعضاء المجموعة</h3>
            {chat.members.map((m, i) => (
              <div key={i} className={styles.memberRow}>
                <span className={styles.memberAvatar}>{m.charAt(0)}</span>
                <span className={styles.memberName}>{m}</span>
              </div>
            ))}
          </div>
        )}

        <div className={styles.messages}>
          {chat.messages.map((m) => (
            <div key={m.id} className={m.isMe ? styles.msgMe : styles.msgThem}>
              {!m.isMe && <span className={styles.msgSender}>{m.sender}</span>}
              <span className={styles.msgText}>{m.text}</span>
              <span className={`${styles.msgTime} mono`}>{m.time}</span>
            </div>
          ))}
        </div>

        <form className={styles.composer} onSubmit={handleSend}>
          <input
            type="text"
            className={styles.composerInput}
            placeholder="اكتب رسالة للgroup..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" className="btn sm" disabled={!input.trim()}>إرسال</button>
        </form>
      </div>
    </main>
  );
}

export default GroupConversationPage;
