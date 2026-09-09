import styles from './GapCard.module.css'

interface GapCardProps {
  skill: string
  current: number
  target: number
  importance: string
  recommendation?: string
  onAction?: () => void
  actionLabel?: string
}

export function GapCard({ skill, current, target, importance, recommendation, onAction, actionLabel }: GapCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h4>{skill}</h4>
        <span className={styles.importance}>{importance}</span>
      </div>
      <div className={styles.barRow}>
        <span className="note">الحالي: <span className="num">{current}%</span></span>
        <span className="note">الهدف: <span className="num">{target}%</span></span>
      </div>
      <div className={styles.bar}>
        <i style={{ width: `${current}%` }} />
      </div>
      {recommendation && <p className={styles.rec}>{recommendation}</p>}
      {onAction && actionLabel && (
        <button className="btn ghost" onClick={onAction} style={{ marginTop: '0.6rem', width: '100%' }}>
          {actionLabel}
        </button>
      )}
    </div>
  )
}
