import type { ReactNode } from 'react'
import styles from './ErrorState.module.css'

interface ErrorStateProps { title: string; description: string; retryAction?: ReactNode }

export function ErrorState({ title, description, retryAction }: ErrorStateProps) {
  return (
    <div className={styles.error} role="alert">
      <div className={styles.icon} aria-hidden="true">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.desc}>{description}</p>
      {retryAction && <div className={styles.retry}>{retryAction}</div>}
    </div>
  )
}
