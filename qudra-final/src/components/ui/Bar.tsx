import styles from './Bar.module.css'

interface BarProps { value: number; color?: 'accent' | 'gap'; animated?: boolean; ariaLabel?: string }

export function Bar({ value, color = 'accent', animated = true, ariaLabel }: BarProps) {
  const clamped = Math.max(0, Math.min(100, value))
  return (
    <div className={styles.bar} role="progressbar" aria-valuenow={Math.round(clamped)} aria-valuemin={0} aria-valuemax={100} aria-label={ariaLabel}>
      <span className={`${styles.fill} ${styles[color]}`} style={{ width: animated ? undefined : `${clamped}%` }} data-value={clamped}
        ref={(el) => { if (el && animated) requestAnimationFrame(() => { el.style.width = `${clamped}%` }) }} />
    </div>
  )
}
