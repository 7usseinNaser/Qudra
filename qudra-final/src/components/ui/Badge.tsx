import type { VerificationLevel } from '../../types'
import { VERIFICATION_LABELS } from '../../types'
import styles from './Badge.module.css'

interface BadgeProps { level: VerificationLevel; label?: string }

export function Badge({ level, label }: BadgeProps) {
  return (
    <span className={`${styles.vb} ${styles[level]}`}>
      <span className={styles.dot} aria-hidden="true" />
      {label ?? VERIFICATION_LABELS[level]}
    </span>
  )
}
