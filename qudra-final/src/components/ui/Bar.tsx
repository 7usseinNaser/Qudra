import React from 'react';
import styles from './Bar.module.css';

export interface BarProps {
  value: number; // 0 - 100
  max?: number;
  label?: string;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'proof' | 'gap' | 'accent' | 'danger';
  className?: string;
}

export const Bar: React.FC<BarProps> = ({
  value,
  max = 100,
  label,
  showValue = false,
  size = 'md',
  variant = 'proof',
  className = ''
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={`${styles.wrapper} ${className}`}>
      {(label || showValue) && (
        <div className={styles.header}>
          {label && <span className={styles.label}>{label}</span>}
          {showValue && <span className={styles.val}>{Math.round(percentage)}%</span>}
        </div>
      )}
      <div 
        className={`${styles.track} ${styles[size]}`}
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div 
          className={`${styles.fill} ${styles[variant]}`} 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
