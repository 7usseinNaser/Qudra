import styles from './VerificationBadge.module.css'

type VerificationState = 'unverified' | 'partial' | 'verified'

interface VerificationBadgeProps {
  state: VerificationState
  label?: string
}

const DEFAULT_LABELS: Record<VerificationState, string> = {
  unverified: 'غير مُتحقّق',
  partial: 'تحقّق جزئي',
  verified: 'مُتحقّق',
}

const ICONS: Record<VerificationState, string> = {
  unverified: '\u26A0',
  partial: '\u25CB',
  verified: '\u2713',
}

export function VerificationBadge({ state, label }: VerificationBadgeProps) {
  const text = label ?? DEFAULT_LABELS[state]
  return (
    <span className={`${styles.badge} ${styles[state]}`}>
      <span className={styles.icon} aria-hidden="true">{ICONS[state]}</span>
      <span>{text}</span>
    </span>
  )
}
