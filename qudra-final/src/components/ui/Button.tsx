import type { ButtonHTMLAttributes, ReactNode } from 'react'
import styles from './Button.module.css'

type ButtonVariant = 'primary' | 'ghost' | 'dark' | 'danger'
type ButtonSize = 'sm' | 'md'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  children: ReactNode
}

export function Button({ variant = 'primary', size = 'md', loading = false, disabled, children, className, ...rest }: ButtonProps) {
  const cls = [styles.btn, styles[variant], size === 'sm' ? styles.sm : '', loading ? styles.loading : '', className ?? ''].filter(Boolean).join(' ')
  return (
    <button className={cls} disabled={disabled || loading} aria-busy={loading || undefined} {...rest}>
      {loading && <span className={styles.spinner} aria-hidden="true" />}
      {children}
    </button>
  )
}
