import React from 'react';
import { FolderGit2, Mic, FileCheck, ExternalLink } from 'lucide-react';
import { Evidence, EvidenceType } from '../../services/types';
import { Badge } from '../ui/Badge';
import styles from './EvidenceCard.module.css';

const GithubIcon: React.FC<{ size?: number }> = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export interface EvidenceCardProps {
  evidence: Evidence;
  className?: string;
}

const getEvidenceTypeLabel = (type: EvidenceType) => {
  switch (type) {
    case 'GITHUB_REPO':
      return { icon: <GithubIcon size={14} />, label: 'مستودع GitHub' };
    case 'PROJECT':
      return { icon: <FolderGit2 size={14} />, label: 'مشروع عملي' };
    case 'ORAL_ASSESSMENT':
      return { icon: <Mic size={14} />, label: 'تقييم شفهي' };
    default:
      return { icon: <FileCheck size={14} />, label: 'ملف معتمد' };
  }
};

export const EvidenceCard: React.FC<EvidenceCardProps> = ({ evidence, className = '' }) => {
  const typeInfo = getEvidenceTypeLabel(evidence.type);

  return (
    <div className={`${styles.card} ${className}`}>
      <div className={styles.topRow}>
        <div className={styles.typeBadge}>
          {typeInfo.icon}
          <span>{typeInfo.label}</span>
        </div>
        <Badge variant={evidence.status === 'VERIFIED' ? 'proof' : 'gap'}>
          {evidence.status === 'VERIFIED' ? 'موثق رسمياً' : 'قيد المراجعة'}
        </Badge>
      </div>

      <h4 className={styles.title}>{evidence.title}</h4>

      {evidence.description && (
        <p className={styles.description}>{evidence.description}</p>
      )}

      {evidence.repoDetails && (
        <div className={styles.metaGrid}>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>اللغة الأساسية</span>
            <span className={styles.metaVal}>{evidence.repoDetails.primaryLanguage}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>الأسطر الممسوحة</span>
            <span className={styles.metaVal}>{evidence.repoDetails.linesOfCode.toLocaleString()}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>الـ Commits</span>
            <span className={styles.metaVal}>{evidence.repoDetails.commitsCount}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>نقاط الجودة</span>
            <span className={styles.metaVal}>{evidence.qualityScore}%</span>
          </div>
        </div>
      )}

      <div className={styles.footer}>
        <span>قوة البرهان: {evidence.strength}%</span>
        {evidence.url && (
          <a 
            href={evidence.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.link}
          >
            <span>عرض المصدر</span>
            <ExternalLink size={12} />
          </a>
        )}
      </div>
    </div>
  );
};
