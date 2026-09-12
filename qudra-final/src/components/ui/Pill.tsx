import type { ReadinessStatus } from '../../types'
import { READINESS_LABELS } from '../../types'
import styles from './Pill.module.css'

interface PillProps { status: ReadinessStatus; label?: string }

export function Pill({ status, label }: PillProps) {
  const text = label ?? READINESS_LABELS[status]
  return <span className={`${styles.pill} ${styles[status]}`}>{text}</span>
}
