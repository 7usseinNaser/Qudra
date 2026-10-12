import React from 'react';
import { Button } from '../../../components/ui/Button';
import styles from './m16.module.css';
import { AlertCircle, RefreshCw, ArrowLeft, Sparkles } from 'lucide-react';

interface M16ErrorPageProps {
  message?: string;
  onRetry?: () => void;
  onBack?: () => void;
}

export const M16ErrorPage: React.FC<M16ErrorPageProps> = ({
  message = 'حدث خطأ أثناء حساب المطابقة. تأكد أن المشكلة مُحللة ثم أعد المحاولة.',
  onRetry,
  onBack
}) => {
  return (
    <div className={styles.errorState}>
      <AlertCircle className={styles.errorIcon} size={64} />
      <h2 className={styles.errorTitle}>تعذرت المطابقة</h2>
      <p className={styles.errorDesc}>{message}</p>

      <div className={styles.recoveryActions}>
        <Button
          variant="proof"
          size="md"
          onClick={onRetry || (() => window.location.reload())}
          leftIcon={<RefreshCw size={16} />}
        >
          إعادة حساب المطابقة
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
          <Sparkles size={16} color="var(--proof)" /> أسباب شائعة وحلول:
        </h4>
        <ul style={{ margin: 0, paddingRight: '1.25rem', color: 'var(--ink-2)', lineHeight: 1.8, fontSize: '0.85rem' }}>
          <li>المشكلة غير مُحللة بعد — أكمل تحليل M15 أولاً (ProblemNotAnalyzedError)</li>
          <li>لا مرشحين مؤهلين — لا يوجد مستخدمون يملكون أي قدرة مطلوبة</li>
          <li>الخادم في وضع الاستيقاظ (Render cold start) — انتظر 10 ثوانٍ وأعد المحاولة</li>
          <li>جلسة الدخول انتهت — سجل الدخول مجدداً</li>
        </ul>
      </div>
    </div>
  );
};

export default M16ErrorPage;