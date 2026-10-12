import React from 'react';
import styles from './ProvenClaimedBadge.module.css';

export type BadgeState = 'PROVEN' | 'CLAIMED' | 'IN_PROGRESS' | 'REJECTED' | 'PENDING_REVIEW';

export interface ProvenClaimedBadgeProps {
  state: BadgeState;
  size?: 'sm' | 'md';
  showIcon?: boolean;
  className?: string;
}

const STATE_CONFIG: Record<BadgeState, { label: string; icon: string; baseClass: string }> = {
  PROVEN: { label: 'مُثبَت', icon: '✓', baseClass: 'proven' },
  CLAIMED: { label: 'مُعلَن', icon: '○', baseClass: 'claimed' },
  IN_PROGRESS: { label: 'قيد التنفيذ', icon: '◷', baseClass: 'inProgress' },
  REJECTED: { label: 'مرفوض', icon: '✕', baseClass: 'rejected' },
  PENDING_REVIEW: { label: 'قيد المراجعة', icon: '◷', baseClass: 'pendingReview' },
};

export const ProvenClaimedBadge: React.FC<ProvenClaimedBadgeProps> = ({
  state,
  size = 'md',
  showIcon = true,
  className = '',
}) => {
  const config = STATE_CONFIG[state];
  const sizeClass = size === 'sm' ? styles.sm : '';

  return (
    <span
      className={`${styles.badge} ${styles[config.baseClass]} ${sizeClass} ${className}`}
      data-state={state}
    >
      {showIcon && <span className={styles.icon} aria-hidden="true">{config.icon}</span>}
      <span className={styles.label}>{config.label}</span>
    </span>
  );
};

export default ProvenClaimedBadge;