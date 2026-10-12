import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from './AssistantM24.module.css';

type DisputeType = 'CAPABILITY' | 'MATCH' | 'EVIDENCE' | 'TEAM' | 'TASK_ALLOCATION';

export const AssistantDisputePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const targetId = searchParams.get('targetId') || 'exp-01';
  const targetType = (searchParams.get('type') as DisputeType) || 'CAPABILITY';

  const [reason, setReason] = useState('');
  const [additionalEvidence, setAdditionalEvidence] = useState('');
  const [contactEmail, setContactEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      alert('تم تقديم الاعتراض بنجاح. سيتم مراجعته من قبل فريق التدقيق البشري خلال 3-5 أيام عمل.');
      navigate('/assistant');
    }, 1000);
  };

  return (
    <div className={styles.container} data-testid="screen-q-0925">
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <span className={styles.screenBadge} style={{ background: '#fff3cd', color: '#856404' }}>
            Q-0925 · تقديم اعتراض (Dispute AC-14)
          </span>
          <h1 className={styles.title}>الاعتراض على قرار الذكاء الاصطناعي</h1>
          <p className={styles.subtitle}>
            تمارس حقك في الاعتراض على أي تصنيف أو تقييم أو مطابقة. سيتم تحويل طلبك للمراجعة البشرية المباشرة مع وسم الحالة بـ <code>PENDING_REVIEW</code>.
          </p>
        </div>
      </div>

      <div className={styles.redLineNotice} style={{ background: '#fff3cd', borderColor: '#ffc107', color: '#856404', marginBottom: '1.5rem' }}>
        <strong>⚖️ آلية الاعتراض (AC-14):</strong><br />
        عند تقديم اعتراض، يُعلَّم القرار المستهدف بحالة <code>PENDING_REVIEW</code> فوراً. لا يتم تعديل الدرجة أو التصنيف الأصلي إلا بعد مراجعة بشرية معتمدة.
        هذا يضمن عدم التلاعب بالنتائج وحفظ حق المرشح في الدفاع عن أدلته.
      </div>

      <div className={styles.formCard}>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label}>القرار المعترض عليه *</label>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--f-mono)', fontSize: '0.85rem', color: '#64748b' }}>
                المعرف: {targetId}
              </span>
              <span className={styles.confidencePill}>{targetType}</span>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>سبب الاعتراض التفصيلي *</label>
            <textarea
              className={styles.textarea}
              rows={4}
              placeholder="اشرح بالتفصيل لماذا ترى أن هذا القرار أو التقييم غير صحيح، وما هي الأدلة أو المعلومات التي لم تُؤخذ بالحسبان..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              data-testid="dispute-reason-input"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>أدلة إضافية تدعم اعتراضك (اختياري)</label>
            <textarea
              className={styles.textarea}
              rows={3}
              placeholder="روابط لمشاريع، شهادات، مراجع، أو أي مستندات تدعم موقفك..."
              value={additionalEvidence}
              onChange={(e) => setAdditionalEvidence(e.target.value)}
              data-testid="dispute-evidence-input"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>بريد إلكتروني للتواصل عند المراجعة *</label>
            <input
              type="email"
              className={`${styles.input} ${styles.inputLtr}`}
              placeholder="your@email.com"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              required
              data-testid="dispute-email-input"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={() => navigate('/assistant')}
            >
              إلغاء
            </button>
            <button
              type="submit"
              className={styles.primaryBtn}
              disabled={isSubmitting}
              data-testid="submit-dispute-btn"
            >
              {isSubmitting ? 'جاري إرسال الاعتراض...' : 'إرسال الاعتراض للمراجعة البشرية ⚖️'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};