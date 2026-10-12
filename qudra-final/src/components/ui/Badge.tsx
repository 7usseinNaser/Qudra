import React from 'react';
import styles from './Badge.module.css';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'proof' | 'gap' | 'neutral' | 'danger' | 'outline' | 'claimed' | 'info';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showDot?: boolean;
  count?: number;
  className?: string;
  icon?: React.ReactNode;
  leftIcon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  showDot = false,
  count,
  className = '',
  icon,
  leftIcon
}) => {
  return (
    <span className={`${styles.badge} ${styles[variant]} ${styles[size]} ${className}`}>
      {showDot && <span className={styles.dot} aria-hidden="true" />}
      {leftIcon && <span className={styles.icon}>{leftIcon}</span>}
      {icon && <span className={styles.icon}>{icon}</span>}
      <span>{children}</span>
      {typeof count === 'number' && <span className={styles.count}>{count}</span>}
    </span>
  );
};
