import React from 'react';
import styles from './Badge.module.css';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'proof' | 'gap' | 'neutral' | 'danger';
  showDot?: boolean;
  count?: number;
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  showDot = false,
  count,
  className = '',
  icon
}) => {
  return (
    <span className={`${styles.badge} ${styles[variant]} ${className}`}>
      {showDot && <span className={styles.dot} aria-hidden="true" />}
      {icon && <span className={styles.icon}>{icon}</span>}
      <span>{children}</span>
      {typeof count === 'number' && <span className={styles.count}>{count}</span>}
    </span>
  );
};
