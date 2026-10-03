import React from 'react';
import { ArrowUpRight, Lightbulb } from 'lucide-react';
import { CapabilityGap } from '../../services/types';
import { Badge } from '../ui/Badge';
import { Bar } from '../ui/Bar';
import styles from './GapCard.module.css';

export interface GapCardProps {
  gap: CapabilityGap;
  className?: string;
}

export const GapCard: React.FC<GapCardProps> = ({ gap, className = '' }) => {
  return (
    <div className={`${styles.card} ${className}`}>
      <div className={styles.header}>
        <h4 className={styles.name}>{gap.name}</h4>
        <Badge variant="gap">فجوة كفاءة</Badge>
      </div>

      <p className={styles.reason}>{gap.gapReason}</p>

      <Bar 
        value={gap.currentStrength} 
        max={gap.requiredStrength} 
        label={`المثبت: ${gap.currentStrength}% من أصل ${gap.requiredStrength}% المطلوب`} 
        variant="gap" 
        size="sm" 
      />

      <div className={styles.actionBox}>
        <Lightbulb size={16} />
        <span>إجراء مقترح: {gap.suggestedAction}</span>
        <ArrowUpRight size={14} style={{ marginRight: 'auto' }} />
      </div>
    </div>
  );
};
