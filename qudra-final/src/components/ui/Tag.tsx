import type { TagVariant } from '../../types'
import styles from './Tag.module.css'

interface TagProps { name: string; variant: TagVariant; evidenceCount?: number; size?: 'sm' | 'md' }

export function Tag({ name, variant, evidenceCount, size = 'md' }: TagProps) {
  const cls = [styles.tag, styles[variant], size === 'sm' ? styles.sm : ''].filter(Boolean).join(' ')
  return (
    <span className={cls} data-variant={variant}>
      <span className={styles.label}>{name}</span>
      {variant === 'proven' && evidenceCount !== undefined && (
        <span className={styles.counter} aria-label={`${evidenceCount} أدلة`}>{evidenceCount}</span>
      )}
    </span>
  )
}
