/**
 * StateBox — نافذة حالة الخطأ العامة.
 *
 * مطابق لـ #stateBox في prototype.html:3321-3329.
 * تعرض أيقونة + عنوان + نص + سبب + إجراءات.
 * تستخدم للأخطاء (فشل التحليل، انقطاع الاتصال، نسيت كلمة المرور...).
 *
 * راجع PROJECT_MAP.md → src/components/overlays/StateBox.tsx
 */

import type { ReactNode } from 'react'
import { useFocusTrap } from '../../hooks'
import styles from './StateBox.module.css'

export type StateBoxVariant = 'error' | 'warning' | 'info'

interface StateBoxProps {
  open: boolean
  onClose?: () => void
  variant?: StateBoxVariant
  icon?: ReactNode
  title: string
  body: string
  why?: string
  actions?: ReactNode
}

export function StateBox({
  open,
  onClose,
  variant = 'error',
  icon,
  title,
  body,
  why,
  actions,
}: StateBoxProps) {
  const containerRef = useFocusTrap<HTMLDivElement>({ active: open, onClose })

  if (!open) return null

  const defaultIcon = variant === 'error' ? (
    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ) : variant === 'warning' ? (
    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  )

  return (
    <div className={styles.overlay} ref={containerRef} dir="rtl" role="alert" aria-modal="true" aria-label={title}>
      <div className={styles.sheet} data-variant={variant}>
        <span className={styles.icon} aria-hidden="true">{icon ?? defaultIcon}</span>
        <h2>{title}</h2>
        <p>{body}</p>
        {why && <div className={styles.why}>{why}</div>}
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
    </div>
  )
}
