import styles from './ProjectCard.module.css'
import { VerificationBadge } from './VerificationBadge'

type AnalysisState = 'analyzed' | 'pending' | 'excluded' | 'ineligible'

interface ProjectCardProps {
  name: string
  description?: string
  technologies: string[]
  lastUpdated?: string
  analysisState: AnalysisState
  onClick?: () => void
}

const STATE_LABELS: Record<AnalysisState, string> = {
  analyzed: 'تم التحليل',
  pending: 'في الانتظار',
  excluded: 'مُستبعد',
  ineligible: 'غير مؤهل',
}

export function ProjectCard({ name, description, technologies, lastUpdated, analysisState, onClick }: ProjectCardProps) {
  const isVerified = analysisState === 'analyzed'
  const isPending = analysisState === 'pending'

  return (
    <button
      className={styles.card}
      onClick={onClick}
      disabled={!onClick}
      style={onClick ? {} : { cursor: 'default' }}
    >
      <div className={styles.top}>
        <h4>{name}</h4>
        <VerificationBadge
          state={isVerified ? 'verified' : isPending ? 'partial' : 'unverified'}
          label={STATE_LABELS[analysisState]}
        />
      </div>
      {description && <p className={styles.desc}>{description}</p>}
      <div className={styles.techs}>
        {technologies.map((t) => (
          <span key={t} className={styles.tech}>{t}</span>
        ))}
      </div>
      {lastUpdated && (
        <p className="mono" style={{ color: 'var(--ink-3)', fontSize: '0.75rem', margin: 0 }}>
          آخر تحديث: {lastUpdated}
        </p>
      )}
    </button>
  )
}
