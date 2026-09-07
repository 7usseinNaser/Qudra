import { useRing } from '../../hooks'
import styles from './Ring.module.css'

interface RingProps { value: number; size?: 48 | 64 | 80 | 100; color?: 'accent' | 'gap'; animated?: boolean; label?: string; ariaLabel?: string }

export function Ring({ value, size = 100, color = 'accent', animated = true, label, ariaLabel }: RingProps) {
  const { dasharray } = useRing({ value })
  const strokeColor = color === 'accent' ? 'var(--proof)' : 'var(--gap)'
  const displayLabel = label ?? `${Math.round(value)}%`
  return (
    <div className={styles.ring} style={{ width: size, height: size }} role="img" aria-label={ariaLabel ?? `القيمة ${Math.round(value)} من 100`}>
      <svg viewBox="0 0 200 200" className={styles.svg} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="100" cy="100" r="86" fill="none" strokeWidth="14" className={styles.track} />
        <circle cx="100" cy="100" r="86" fill="none" strokeWidth="14" strokeLinecap="round"
          strokeDasharray={animated ? dasharray : `${(value / 100) * 540.35} 540.35`}
          stroke={strokeColor} className={animated ? styles.prog : styles.progStatic} />
      </svg>
      <span className={styles.val}>{displayLabel}</span>
    </div>
  )
}
