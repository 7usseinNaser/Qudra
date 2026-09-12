import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';
import styles from './EmptyState.module.css';

export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'حدث خطأ غير متوقع',
  message,
  onRetry,
  className = ''
}) => {
  return (
    <div className={`${styles.emptyState} ${className}`}>
      <div className={styles.iconWrapper} style={{ color: 'var(--danger)', background: 'var(--danger-tint)' }}>
        <AlertCircle size={28} />
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{message}</p>
      {onRetry && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRetry}
          leftIcon={<RefreshCw size={16} />}
        >
          إعادة المحاولة
        </Button>
      )}
    </div>
  );
};
