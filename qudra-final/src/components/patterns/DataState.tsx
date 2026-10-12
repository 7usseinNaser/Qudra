import React from 'react';
import { Loader2, AlertTriangle, FileSearch, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/Button';
import styles from './DataState.module.css';

export type DataStateType = 'loading' | 'empty' | 'error' | 'success';

export interface DataStateProps {
  state: DataStateType;
  title?: string;
  message?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'proof' | 'outline' | 'primary';
    icon?: React.ReactNode;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
    variant?: 'ghost' | 'outline';
    icon?: React.ReactNode;
  };
  className?: string;
  'aria-live'?: 'polite' | 'assertive' | 'off';
}

const DEFAULT_MESSAGES: Record<DataStateType, { title: string; message: string }> = {
  loading: {
    title: 'جاري التحميل',
    message: 'نحضّر البيانات لك، لحظة من فضلك…',
  },
  empty: {
    title: 'لا توجد بيانات',
    message: 'ما في سجلات بعد — ابدأ بإضافة أول سجل.',
  },
  error: {
    title: 'حدث خطأ',
    message: 'تعذر تحميل البيانات. جرّب إعادة المحاولة.',
  },
  success: {
    title: 'تم بنجاح',
    message: 'العملية اكتملت.',
  },
};

export const DataState: React.FC<DataStateProps> = ({
  state,
  title,
  message,
  action,
  secondaryAction,
  className = '',
  'aria-live': ariaLive = 'polite',
}) => {
  const defaults = DEFAULT_MESSAGES[state];
  const displayTitle = title ?? defaults.title;
  const displayMessage = message ?? defaults.message;

  const renderIcon = () => {
    switch (state) {
      case 'loading':
        return <Loader2 size={32} className={styles.spin} aria-hidden="true" />;
      case 'empty':
        return (
          <div className={styles.emptyIcon}>
            <FileSearch size={36} aria-hidden="true" />
          </div>
        );
      case 'error':
        return (
          <div className={styles.errorIcon}>
            <AlertTriangle size={32} aria-hidden="true" />
          </div>
        );
      case 'success':
        return (
          <div className={styles.successIcon}>
            <ShieldCheck size={32} aria-hidden="true" />
          </div>
        );
    }
  };

  return (
    <div
      className={`${styles.container} ${styles[state]} ${className}`}
      role={state === 'error' ? 'alert' : 'status'}
      aria-live={ariaLive}
      aria-atomic="true"
    >
      <div className={styles.iconWrapper}>{renderIcon()}</div>
      <h3 className={styles.title}>{displayTitle}</h3>
      <p className={styles.message}>{displayMessage}</p>
      {(action || secondaryAction) && (
        <div className={styles.actions}>
          {secondaryAction && (
            <Button
              variant={secondaryAction.variant ?? 'ghost'}
              size="md"
              onClick={secondaryAction.onClick}
              leftIcon={secondaryAction.icon}
            >
              {secondaryAction.label}
            </Button>
          )}
          {action && (
            <Button
              variant={action.variant ?? 'proof'}
              size="md"
              onClick={action.onClick}
              leftIcon={action.icon}
            >
              {action.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default DataState;