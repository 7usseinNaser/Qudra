import React from 'react';
import { Button } from '../../../components/ui/Button';
import styles from './m25.module.css';
import { AlertCircle, RefreshCw, ArrowLeft, ShieldCheck } from 'lucide-react';

interface M25ErrorPageProps {
  message?: string;
  onRetry?: () => void;
  onBack?: () => void;
}

export const M25ErrorPage: React.FC<M25ErrorPageProps> = ({
  message = 'حدث خطأ أثناء تحميل بيانات الخصوصية. إعداداتك المحلية محفوظة — أعد المحاولة للمزامنة.',
  onRetry,
  onBack
}) => {
  return (
    <div className={styles.errorState}>
      <AlertCircle className={styles.errorIcon} size={64} />
      <h2 className={styles.errorTitle}>تعذر تحميل بيانات الخصوصية</h2>
      <p className={styles.errorDesc}>{message}</p>

      <div className={styles.recoveryActions}>
        <Button
          variant="proof"
          size="md"
          onClick={onRetry || (() => window.location.reload())}
          leftIcon={<RefreshCw size={16} />}
        >
          إعادة المحاولة
        </Button>
        <Button
          variant="outline"
          size="md"
          onClick={onBack || (() => window.history.back())}
          leftIcon={<ArrowLeft size={16} />}
        >
          العودة
        </Button>
      </div>

      <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
        <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--ink-2)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck size={16} color="var(--proof)" /> ملاحظات الخصوصية:
        </h4>
        <ul style={{ margin: 0, paddingRight: '1.25rem', color: 'var(--ink-2)', lineHeight: 1.8, fontSize: '0.85rem' }}>
          <li>سحب الموافقة يعمل محلياً فوراً حتى بدون اتصال — لا تنتظر الخادم</li>
          <li>تصدير JSON يعمل من اللقطة المحلية عند تعذر الوصول للباك إند</li>
          <li>جلسة الدخول المنتهية لا تمسح موافقاتك المحفوظة</li>
        </ul>
      </div>
    </div>
  );
};

export default M25ErrorPage;