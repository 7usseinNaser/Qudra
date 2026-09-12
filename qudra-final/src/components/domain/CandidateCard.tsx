import { Tag } from '../ui/Tag'
import { Pill } from '../ui/Pill'
import styles from './CandidateCard.module.css'
import type { ReadinessStatus } from '../../types'

interface CandidateCardProps {
  rank: number
  name: string
  title: string
  score: number
  status: ReadinessStatus
  statusLabel?: string
  proven: [string, number][]
  claimed: string[]
  isLead?: boolean
  onWhy?: () => void
  onInvite?: () => void
}

export function CandidateCard({
  rank, name, title, score, status, statusLabel,
  proven, claimed, isLead, onWhy, onInvite,
}: CandidateCardProps) {
  return (
    <div className={`${styles.cand} ${isLead ? styles.lead : ''}`}>
      <span className={styles.rk + ' mono'}>{String(rank).padStart(2, '0')}</span>
      <span className={styles.av}>{name.charAt(0)}</span>
      <span className={styles.who}>
        <h3>{name}</h3>
        <p>{title}</p>
      </span>
      <span className={styles.chips}>
        {proven.map(([skill, count]) => (
          <Tag key={skill} name={skill} variant="proven" evidenceCount={count} size="sm" />
        ))}
        {claimed.map((skill) => (
          <Tag key={skill} name={skill} variant="claimed" size="sm" />
        ))}
      </span>
      <span className={styles.sc}>
        <span className={styles.v + ' num'}>{score}%</span>
        <span className={styles.tr}>
          <i style={{ width: `${score}%` }} />
        </span>
      </span>
      <span className={styles.rdy}>
        <Pill status={status} label={statusLabel} />
      </span>
      {onWhy && (
        <button className={styles.whybtn} onClick={onWhy}>لماذا؟</button>
      )}
      {onInvite && (
        <button className={styles.cinv} onClick={onInvite}>ادعُه</button>
      )}
    </div>
  )
}
