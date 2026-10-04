import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { Badge } from '../../components/ui/Badge';
import styles from './OrganizationVerificationPage.module.css';

export function OrganizationVerificationPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'unverified' | 'pending' | 'verified'>('unverified');
  const [domain, setDomain] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('pending');
  };

  return (
    <main id="main" className="wrap" tabIndex={-1} dir="rtl" style={{ padding: 'clamp(1.5rem,4vw,2.75rem) 0 5rem' }}>
      <button className="btn ghost" onClick={() => navigate(ROUTES.ORG_PROFILE)} style={{ marginBottom: '0.8rem' }}>
        ← ملف الشركة
      </button>
      <h1 className="scr-t">التحقق من الشركة</h1>
      <p className="scr-p">التحقق يزيد الثقة والصلاحيات. لا يمنع إنشاء الحساب.</p>

      <div className={styles.statusRow}>
        <span className={styles.statusLabel}>الحالة الحالية:</span>
        {status === 'unverified' && <Badge variant="neutral">غير موثّق</Badge>}
        {status === 'pending' && <Badge variant="gap">قيد المراجعة</Badge>}
        {status === 'verified' && <Badge variant="proof">موثّق</Badge>}
      </div>

      {status === 'unverified' && (
        <form className={`box ${styles.form}`} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="org-domain" className={styles.label}>نطاق الشركة</label>
            <input id="org-domain" type="text" className={styles.input} value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="qudra.tech" required />
          </div>
          <div className={styles.field}>
            <label htmlFor="org-email" className={styles.label}>بريد الشركة المهني</label>
            <input id="org-email" type="email" className={styles.input} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@qudra.tech" required />
          </div>
          <div className={styles.note}>
            سيتم إرسال رمز تحقق إلى بريد الشركة. بعد التحقق، تنتقل الحالة إلى "قيد المراجعة" حتى يوافق المشرف.
          </div>
          <div className={styles.actions}>
            <button type="submit" className="btn dark">إرسال طلب التحقق</button>
          </div>
        </form>
      )}

      {status === 'pending' && (
        <div className={`box ${styles.pendingBox}`}>
          <h2 className={styles.sectionTitle}>طلب التحقق قيد المراجعة</h2>
          <p className={styles.text}>
            تم استلام طلب التحقق. سيتم مراجعته خلال 2-3 أيام عمل. سيصلك إشعار عند اكتمال المراجعة.
          </p>
          <div className={styles.steps}>
            <div className={styles.stepDone}>
              <span className={styles.stepIcon}>✓</span>
              <span>إرسال الطلب</span>
            </div>
            <div className={styles.stepActive}>
              <span className={styles.stepIcon}>●</span>
              <span>مراجعة المشرف</span>
            </div>
            <div className={styles.stepPending}>
              <span className={styles.stepIcon}>○</span>
              <span>التوثيق الكامل</span>
            </div>
          </div>
        </div>
      )}

      {status === 'verified' && (
        <div className={`box ${styles.verifiedBox}`}>
          <Badge variant="proof">✓ موثّق</Badge>
          <p className={styles.text}>الشركة موثّقة بالكامل. جميع الصلاحيات مفعّلة.</p>
        </div>
      )}
    </main>
  );
}

export default OrganizationVerificationPage;
