import React from 'react';
import { CheckCircle2, ShieldAlert, FileCode } from 'lucide-react';
import { Capability } from '../../services/types';
import { Bar } from '../ui/Bar';
import { Badge } from '../ui/Badge';
import styles from './CapabilityCard.module.css';

export interface CapabilityCardProps {
  capability: Capability;
  onClick?: () => void;
  showDetails?: boolean;
  className?: string;
}

export const CapabilityCard: React.FC<CapabilityCardProps> = ({
  capability,
  onClick,
  showDetails = true,
  className = ''
}) => {
  return (
    <div 
      className={`${styles.card} ${capability.isVerified ? styles.verified : ''} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      role={onClick ? 'button' : 'article'}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <h4 className={styles.title}>
            {capability.isVerified ? (
              <CheckCircle2 size={18} color="var(--proof)" aria-label="مهارة مثبتة" />
            ) : (
              <ShieldAlert size={18} color="var(--gap)" aria-label="بحاجة لإثبات" />
            )}
            <span>{capability.name}</span>
          </h4>
          <span className={styles.category}>{capability.category}</span>
        </div>
        <Badge variant={capability.isVerified ? 'proof' : 'gap'}>
          {capability.isVerified ? 'مثبتة بالأدلة' : 'ادعاء فقط'}
        </Badge>
      </div>

      {capability.description && (
        <p className={styles.description}>{capability.description}</p>
      )}

      <Bar 
        value={capability.strength} 
        label="قوة المهارة المبرهنة" 
        showValue 
        size="sm"
        variant={capability.isVerified ? 'proof' : 'gap'} 
      />

      {showDetails && (
        <div className={styles.statsRow}>
          <div className={styles.evidenceCount}>
            <FileCode size={14} />
            <span>{capability.evidenceCount} أدلة مسجلة</span>
          </div>
          <span className={styles.levelTag}>{capability.level}</span>
        </div>
      )}
    </div>
  );
};
