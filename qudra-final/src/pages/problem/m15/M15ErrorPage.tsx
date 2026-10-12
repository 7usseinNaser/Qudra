import React from 'react';
import { Button } from '../../../components/ui/Button';
import styles from './m15.module.css';
import { AlertCircle, RefreshCw, ArrowLeft, Sparkles } from 'lucide-react';

interface M15ErrorPageProps {
  message?: string;
  onRetry?: () => void;
  onBack?: () => void;
}

export const M15ErrorPage: React.FC<M15ErrorPageProps> = ({
  message = 'حدث خطأ غير متوقع أثناء معالجة المشكلة. يرجى المحاولة مرة أخرى.',
  onRetry,
  onBack
}) => {
  return (
    <div className={styles.errorState}>
      <AlertCircle className={styles.errorIcon} size={64} />
      <h2 className={styles.errorTitle}>تعذر إكمال العملية</h2>
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

      <div className={styles.errorHints}>
        <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--ink-2)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={16} color="var(--proof)" /> أسباب شائعة وحلول:
        </h4>
        <ul style={{ margin: 0, paddingRight: '1.25rem', color: 'var(--ink-2)', lineHeight: 1.8, fontSize: '0.85rem' }}>
          <li>الاتصال بالخادم انقطع — تحقق من الإنترنت وأعد المحاولة</li>
          <li>النص قصير جداً — يجب أن يكون الوصف 15 حرفًا على الأقل</li>
          <li>الخادم في وضع الاستيقاظ (Render cold start) — انتظر 10 ثوانٍ وأعد المحاولة</li>
          <li>جلسة الدخول انتهت — سجل الدخول مجدداً من <code>/login</code></li>
        </ul>
      </div>
    </div>
  );
};

export default M15ErrorPage;