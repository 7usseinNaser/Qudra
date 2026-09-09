import styles from './MatchExplanation.module.css'

interface MatchFactor {
  name: string
  weight: number
  score: number
  isGap: boolean
  note: string
}

interface MatchExplanationProps {
  factors: MatchFactor[]
}

export function MatchExplanation({ factors }: MatchExplanationProps) {
  return (
    <div className={styles.list}>
      {factors.map((f) => {
        const isGap = f.isGap && f.score < f.weight * 0.5
        return (
          <div key={f.name} className={`${styles.factor} ${isGap ? styles.gap : ''}`}>
            <div className={styles.top}>
              <span className={styles.dot} />
              <span className={styles.name}>{f.name}</span>
              <span className={styles.tag}>{isGap ? 'فجوة' : 'مثبت'}</span>
              <span className={styles.got + ' num'}>{f.score} / {f.weight}</span>
            </div>
            <div className={styles.track} style={{ width: `${(f.weight / 25) * 100}%` }}>
              <i style={{ width: `${(f.score / f.weight) * 100}%` }} />
            </div>
            <p className={styles.note}>{f.note}</p>
          </div>
        )
      })}
    </div>
  )
}
