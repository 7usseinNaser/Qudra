import React from 'react';
import { Ring } from '../ui/Ring';
import styles from './MatchScore.module.css';

export interface MatchScoreProps {
  score: number; // 0 - 100
  status: 'READY' | 'NEAR' | 'FAR';
  size?: number;
  showStatusLabel?: boolean;
  className?: string;
}

const getStatusDetails = (status: 'READY' | 'NEAR' | 'FAR') => {
  switch (status) {
    case 'READY':
      return { label: 'جاهز فوراً للتنفيذ', class: styles.ready, variant: 'proof' as const };
    case 'NEAR':
      return { label: 'قريب مع فجوات طفيفة', class: styles.near, variant: 'gap' as const };
    case 'FAR':
      return { label: 'يحتاج تأهيل إضافي', class: styles.far, variant: 'gap' as const };
  }
};

export const MatchScore: React.FC<MatchScoreProps> = ({
  score,
  status,
  size = 56,
  showStatusLabel = true,
  className = ''
}) => {
  const details = getStatusDetails(status);

  return (
    <div className={`${styles.container} ${className}`}>
      <Ring 
        value={score} 
        size={size} 
        variant={details.variant} 
        strokeWidth={5} 
      />
      {showStatusLabel && (
        <div className={styles.details}>
          <span className={`${styles.statusText} ${details.class}`}>
            {details.label}
          </span>
          <span className={styles.sub}>
            توافق مبني على أدلة ملموسة
          </span>
        </div>
      )}
    </div>
  );
};
