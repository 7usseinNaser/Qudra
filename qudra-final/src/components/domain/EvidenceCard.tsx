import styles from './EvidenceCard.module.css'
import { EvidenceStatus } from './EvidenceStatus'

type EvidenceLevel = 'موثّق' | 'مرتبط' | 'ذاتي'

interface EvidenceCardProps {
  title: string
  source: string
  type: string
  skill: string
  date: string
  level: EvidenceLevel
  onClick?: () => void
}

export function EvidenceCard({ title, source, type, skill, date, level, onClick }: EvidenceCardProps) {
  return (
    <button
      className={styles.card}
      onClick={onClick}
      disabled={!onClick}
      style={onClick ? {} : { cursor: 'default' }}
    >
      <div className={styles.top}>
        <span className={styles.icon}>{source.slice(0, 2).toUpperCase()}</span>
        <div className={styles.titleCol}>
          <h4>{title}</h4>
          <p className="mono" style={{ color: 'var(--ink-3)', margin: 0, fontSize: '0.78rem' }}>{type} · {source}</p>
        </div>
        <EvidenceStatus level={level} />
      </div>
      <div className={styles.meta}>
        <span className={styles.skill}>{skill}</span>
        <span className="mono" style={{ color: 'var(--ink-3)', fontSize: '0.78rem' }}>{date}</span>
      </div>
    </button>
  )
}
