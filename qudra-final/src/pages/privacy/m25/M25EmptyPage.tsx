import React from 'react';
import { Button } from '../../../components/ui/Button';
import styles from './m25.module.css';
import { ShieldCheck } from 'lucide-react';

interface M25EmptyPageProps {
  onCreateClick?: () => void;
}

export const M25EmptyPage: React.FC<M25EmptyPageProps> = ({ onCreateClick }) => {
  return (
    <div className={styles.emptyState}>
      <div style={{ marginBottom: '1rem' }}>
        <ShieldCheck size={64} style={{ color: 'var(--ink-2)', opacity: 0.5 }} />
      </div>
      <h2 className={styles.emptyTitle}>لا توجد أذونات مسجلة</h2>
      <p className={styles.emptyDesc}>
        لم تمنح أي موافقات بعد. أنشئ أول إذن وصول — حدد النطاق، الغرض، ومدة الصلاحية —
        وستظهر هنا مع زر سحب فوري وسجل وصول كامل.
      </p>
      <Button
        variant="proof"
        size="lg"
        onClick={onCreateClick || (() => {})}
        leftIcon={<ShieldCheck size={18} />}
      >
        منح إذن جديد
      </Button>
    </div>
  );
};

export default M25EmptyPage;