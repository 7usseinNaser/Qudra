import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { Badge } from '../../components/ui/Badge';
import styles from './InviteCandidatePage.module.css';

export function InviteCandidatePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [challenge, setChallenge] = useState('');
  const [responseDate, setResponseDate] = useState('');
  const [sent, setSent] = useState(false);

  const candidateName = id === 'lina' ? 'لينا الحربي' : id === 'mohammed' ? 'محمد الدوسري' : 'المرشح';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  if (sent) {
    return (
      <main id="main" className="wrap" tabIndex={-1} dir="rtl" style={{ padding: 'clamp(1.5rem,4vw,2.75rem) 0 5rem' }}>
        <div className={`box ${styles.confirmBox}`}>
          <h1 className="scr-t">✓ تم إرسال الدعوة</h1>
          <p className="scr-p">
            تمت مشاركة الدعوة مع {candidateName}. سيظهر الإشعار لديه عند تسجيل الدخول.
          </p>
          <div className={styles.confirmDetails}>
            <div className={styles.confirmRow}>
              <span className={styles.confirmLabel}>المرشح</span>
              <span className={styles.confirmVal}>{candidateName}</span>
            </div>
            {challenge && (
              <div className={styles.confirmRow}>
                <span className={styles.confirmLabel}>التحدي</span>
                <span className={styles.confirmVal}>{challenge}</span>
              </div>
            )}
            {responseDate && (
              <div className={styles.confirmRow}>
                <span className={styles.confirmLabel}>تاريخ الرد</span>
                <span className={styles.confirmVal}>{responseDate}</span>
              </div>
            )}
          </div>
          <div className={styles.actions}>
            <button className="btn ghost" onClick={() => navigate(ROUTES.COMPANY_CANDIDATES)}>
              رجوع للمرشحين
            </button>
            <button className="btn" onClick={() => navigate(ROUTES.COMPANY_HOME)}>
              لوحة الشركة
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main id="main" className="wrap" tabIndex={-1} dir="rtl" style={{ padding: 'clamp(1.5rem,4vw,2.75rem) 0 5rem' }}>
      <button className="btn ghost" onClick={() => navigate(ROUTES.COMPANY_CANDIDATES)} style={{ marginBottom: '0.8rem' }}>
        ← المرشحون
      </button>
      <h1 className="scr-t">دعوة {candidateName}</h1>
      <p className="scr-p">ادعُه للمشروع أو الوظيفة. الدعوة تحتوي على رسالة وتحدٍّ اختياري.</p>

      <form className={`box ${styles.form}`} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label className={styles.label}>المرشح</label>
          <div className={styles.candidateChip}>
            <span className={styles.candidateAvatar}>{candidateName.charAt(0)}</span>
            <span>{candidateName}</span>
            <Badge variant="proof">موثّق</Badge>
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="inv-message" className={styles.label}>رسالة الدعوة</label>
          <textarea
            id="inv-message"
            className={styles.textarea}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="مرحبًا، رأيت أدلتك وحابّ نتعاون في مشروعنا..."
            rows={4}
            required
          />
        </div>

        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <label htmlFor="inv-challenge" className={styles.label}>تحدي اختياري</label>
            <select
              id="inv-challenge"
              className={styles.input}
              value={challenge}
              onChange={(e) => setChallenge(e.target.value)}
            >
              <option value="">بدون تحدٍّ</option>
              <option value="بناء واجهة REST">بناء واجهة REST</option>
              <option value="تصميم قاعدة بيانات">تصميم قاعدة بيانات</option>
              <option value="تحدٌّ مخصّص">تحدٌّ مخصّص</option>
            </select>
          </div>
          <div className={styles.field}>
            <label htmlFor="inv-date" className={styles.label}>تاريخ الرد المتوقع</label>
            <input
              id="inv-date"
              type="date"
              className={styles.input}
              value={responseDate}
              onChange={(e) => setResponseDate(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.actions}>
          <button type="button" className="btn ghost" onClick={() => navigate(ROUTES.COMPANY_CANDIDATES)}>
            إلغاء
          </button>
          <button type="submit" className="btn dark">
            إرسال الدعوة
          </button>
        </div>
      </form>
    </main>
  );
}

export default InviteCandidatePage;
