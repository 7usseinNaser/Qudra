import React from 'react';
import styles from './Ring.module.css';

export interface RingProps {
  value: number; // 0 - 100
  size?: number; // px diameter
  strokeWidth?: number;
  variant?: 'proof' | 'gap' | 'accent';
  label?: string;
  showPercent?: boolean;
  className?: string;
}

export const Ring: React.FC<RingProps> = ({
  value,
  size = 64,
  strokeWidth = 6,
  variant = 'proof',
  label,
  showPercent = true,
  className = ''
}) => {
  const normalizedValue = Math.min(100, Math.max(0, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedValue / 100) * circumference;

  return (
    <div className={`${styles.ringBox} ${className}`} style={{ width: size, height: size }}>
      <svg className={styles.svg} width={size} height={size}>
        <circle
          className={styles.bg}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          className={`${styles.fg} ${styles[variant]}`}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          fill="none"
        />
      </svg>
      <div className={styles.inner}>
        <span className={styles.value} style={{ fontSize: size * 0.28 }}>
          {Math.round(normalizedValue)}{showPercent ? '%' : ''}
        </span>
        {label && <span className={styles.label}>{label}</span>}
      </div>
    </div>
  );
};
