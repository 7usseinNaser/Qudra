import { Pill } from '../ui/Pill'
import type { ReadinessStatus } from '../../types'
import styles from './ProfileHeader.module.css'

interface ProfileHeaderProps {
  name: string
  avatar: string
  headline?: string
  normalizedTitle?: string
  readiness?: ReadinessStatus
  readinessLabel?: string
}

export function ProfileHeader({ name, avatar, headline, normalizedTitle, readiness, readinessLabel }: ProfileHeaderProps) {
  return (
    <div className={styles.header}>
      <span className={styles.avatar}>{avatar}</span>
      <div className={styles.info}>
        <h1>{name}</h1>
        {headline && <p className={styles.headline}>{headline}</p>}
        {normalizedTitle && (
          <p className={styles.normalized}>
            <span className="note">كما تراه قُدرة: </span>
            <span>{normalizedTitle}</span>
          </p>
        )}
      </div>
      {readiness && readinessLabel && (
        <Pill status={readiness} />
      )}
    </div>
  )
}
