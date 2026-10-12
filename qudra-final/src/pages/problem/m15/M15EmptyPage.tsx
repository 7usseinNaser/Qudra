import React from 'react';
import { Button } from '../../../components/ui/Button';
import styles from './m15.module.css';
import { FileText, PlusCircle } from 'lucide-react';

interface M15EmptyPageProps {
  onCreateClick?: () => void;
}

export const M15EmptyPage: React.FC<M15EmptyPageProps> = ({ onCreateClick }) => {
  return (
    <div className={styles.emptyState}>
      <div className={styles.emptyIcon}>
        <FileText size={64} style={{ color: 'var(--ink-2)', opacity: 0.5 }} />
      </div>
      <h2 className={styles.emptyTitle}>لا توجد مشكلات بعد</h2>
      <p className={styles.emptyDesc}>
        ابدأ بإنشاء أول مشكلة لك — اكتبها بلغتك وسنستخرج القدرات المطلوبة،
        نولّد محاكاة مخصصة، ونمكّنك من مطابقة أفضل المرشحين.
      </p>
      <Button
        variant="proof"
        size="lg"
        onClick={onCreateClick || (() => {})}
        leftIcon={<PlusCircle size={18} />}
      >
        إنشاء مشكلة جديدة
      </Button>

      <div className={styles.emptyHints}>
        <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--ink-2)', marginBottom: '0.75rem' }}>أمثلة للبدء:</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'right' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--ink-2)', padding: '0.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
            «أريد بناء تطبيق يساعد طلاب الجامعة على إيجاد موادهم ومواعيدهم بسهولة.»
          </span>
          <span style={{ fontSize: '0.85rem', color: 'var(--ink-2)', padding: '0.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
            «عندنا مركز اتصال يستقبل 400 مكالمة عربية يوميًا، ونريد تحويلها إلى نص وتحليل الشكاوى.»
          </span>
          <span style={{ fontSize: '0.85rem', color: 'var(--ink-2)', padding: '0.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
            «أريد متجرًا إلكترونيًا صغيرًا لبيع منتجات يدوية، مع دفع إلكتروني وتتبّع للطلبات.»
          </span>
        </div>
      </div>
    </div>
  );
};

export default M15EmptyPage;