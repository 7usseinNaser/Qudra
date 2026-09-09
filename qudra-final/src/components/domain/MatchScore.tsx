import { Ring } from '../ui/Ring'
import styles from './MatchScore.module.css'

interface MatchScoreProps {
  score: number
  size?: 'sm' | 'md' | 'lg'
}

export function MatchScore({ score, size = 'md' }: MatchScoreProps) {
  const ringSize = size === 'sm' ? 48 : size === 'lg' ? 100 : 80
  return (
    <div className={styles.wrap}>
      <Ring value={score} size={ringSize} ariaLabel={`نسبة المطابقة ${score}%`} />
      <span className={styles.label + ' note'}>مطابقة بالدليل</span>
    </div>
  )
}
