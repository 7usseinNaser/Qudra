/**
 * ConfirmBox — نافذة تأكيد الخروج.
 *
 * مطابق لـ #confirmBox في prototype.html:3332-3346.
 * تعرض أيقونة تحذير + عنوان + نص + زرين:
 *   - "ابقَ وأكمل" (ghost)
 *   - "اخرج واحذف" (danger)
 *
 * راجع PROJECT_MAP.md → src/components/overlays/ConfirmBox.tsx
 */

import type { ReactNode } from 'react'
import { useFocusTrap } from '../../hooks'
import { Button } from '../ui'
import styles from './ConfirmBox.module.css'

interface ConfirmBoxProps {
  open: boolean
  title: string
  body: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmBox({
  open,
  title,
  body,
  confirmLabel = 'اخرج واحذف',
  cancelLabel = 'ابقَ وأكمل',
  onConfirm,
  onCancel,
}: ConfirmBoxProps) {
  const containerRef = useFocusTrap<HTMLDivElement>({ active: open, onClose: onCancel })

  if (!open) return null

  return (
    <div className={styles.overlay} ref={containerRef} dir="rtl" role="dialog" aria-modal="true" aria-label={title}>
      <div className={styles.sheet}>
        <div className={styles.body}>
          <span className={styles.warn} aria-hidden="true">
            <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 9v4M12 17h.01" />
              <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
            </svg>
          </span>
          <h3>{title}</h3>
          <p className={styles.note}>{body}</p>
        </div>
        <div className={styles.footer}>
          <Button variant="ghost" onClick={onCancel}>{cancelLabel}</Button>
          <Button variant="danger" onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      </div>
    </div>
  )
}
