import { Tag } from '../ui/Tag'
import styles from './CapabilityCard.module.css'

interface CapabilityCardProps {
  name: string
  level: number
  evidenceCount: number
  variant?: 'proven' | 'claimed'
  onClick?: () => void
}

export function CapabilityCard({ name, level, evidenceCount, variant = 'proven', onClick }: CapabilityCardProps) {
  return (
    <button
      className={styles.card}
      onClick={onClick}
      data-variant={variant}
      disabled={!onClick}
      style={onClick ? {} : { cursor: 'default' }}
    >
      <div className={styles.header}>
        <span className={styles.name}>{name}</span>
        <Tag name={variant === 'proven' ? 'مُثبت' : 'مُدّعى'} variant={variant} size="sm" />
      </div>
      <div className={styles.bar}>
        <i style={{ width: `${level}%` }} />
      </div>
      <div className={styles.meta}>
        <span className="num">{level}%</span>
        <span className="note">{evidenceCount > 0 ? `${evidenceCount} دليل` : 'بلا دليل'}</span>
      </div>
    </button>
  )
}
