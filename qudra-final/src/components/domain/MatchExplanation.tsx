import React from 'react';
import { Check, AlertTriangle } from 'lucide-react';
import styles from './MatchExplanation.module.css';

export interface MatchExplanationProps {
  explanation: {
    provenCount: number;
    gapCount: number;
    summary: string;
    strengths: string[];
    risks: string[];
  };
  className?: string;
}

export const MatchExplanation: React.FC<MatchExplanationProps> = ({
  explanation,
  className = ''
}) => {
  return (
    <div className={`${styles.wrapper} ${className}`}>
      <p className={styles.summary}>{explanation.summary}</p>

      {explanation.strengths.length > 0 && (
        <div>
          <div className={`${styles.sectionTitle} ${styles.strengthsTitle}`}>
            <Check size={16} />
            <span>عوامل المطابقة المؤكدة ({explanation.provenCount})</span>
          </div>
          <ul className={styles.list}>
            {explanation.strengths.map((str, idx) => (
              <li key={idx} className={styles.item}>
                <span className={`${styles.bullet} ${styles.strengthBullet}`} />
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {explanation.risks.length > 0 && (
        <div>
          <div className={`${styles.sectionTitle} ${styles.risksTitle}`}>
            <AlertTriangle size={16} />
            <span>الفجوات والمخاطر المحتملة ({explanation.gapCount})</span>
          </div>
          <ul className={styles.list}>
            {explanation.risks.map((risk, idx) => (
              <li key={idx} className={styles.item}>
                <span className={`${styles.bullet} ${styles.riskBullet}`} />
                <span>{risk}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
