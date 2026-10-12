import React from 'react';
import { Button } from '../../../components/ui/Button';
import styles from './m16.module.css';
import { Search } from 'lucide-react';

interface M16EmptyPageProps {
  onCreateClick?: () => void;
}

export const M16EmptyPage: React.FC<M16EmptyPageProps> = ({ onCreateClick }) => {
  return (
    <div className={styles.emptyState}>
      <div style={{ marginBottom: '1rem' }}>
        <Search size={64} style={{ color: 'var(--ink-2)', opacity: 0.5 }} />
      </div>
      <h2 className={styles.emptyTitle}>لا توجد جلسات مطابقة بعد</h2>
      <p className={styles.emptyDesc}>
        المطابقة تتطلب مشكلة مُحللة أولاً. أنشئ مشكلة، أكمل تحليلها (M15)،
        ثم ابدأ المطابقة لترتيب المرشحين مع الأدلة والفجوات لكل مرشح.
      </p>
      <Button
        variant="proof"
        size="lg"
        onClick={onCreateClick || (() => {})}
        leftIcon={<Search size={18} />}
      >
        ابدأ من المشكلات
      </Button>
    </div>
  );
};

export default M16EmptyPage;