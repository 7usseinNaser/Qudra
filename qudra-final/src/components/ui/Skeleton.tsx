import styles from './Skeleton.module.css'

interface SkeletonProps { width?: string; height?: string; radius?: string; variant?: 'line' | 'block' }

export function Skeleton({ width = '100%', height = '14px', radius, variant = 'line' }: SkeletonProps) {
  return <span className={variant === 'line' ? styles.skLine : styles.skBlock} style={{ width, height, borderRadius: radius }} aria-hidden="true" />
}
