import styles from './EvidenceStatus.module.css'

type EvidenceLevel = 'موثّق' | 'مرتبط' | 'ذاتي'

interface EvidenceStatusProps {
  level: EvidenceLevel
}

const CONFIG: Record<EvidenceLevel, { cls: string; icon: string; label: string }> = {
  'موثّق': { cls: 'verified', icon: '\u2713', label: 'موثّق' },
  'مرتبط': { cls: 'partial', icon: '\u25CB', label: 'مرتبط' },
  'ذاتي': { cls: 'claimed', icon: '\u26A0', label: 'ذاتي' },
}

export function EvidenceStatus({ level }: EvidenceStatusProps) {
  const cfg = CONFIG[level]
  return (
    <span className={`${styles.badge} ${styles[cfg.cls]}`}>
      <span className={styles.icon} aria-hidden="true">{cfg.icon}</span>
      <span>{cfg.label}</span>
    </span>
  )
}
