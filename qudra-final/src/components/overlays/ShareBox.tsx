/**
 * ShareBox — نافذة مشاركة بطاقة الإثبات.
 *
 * مطابق لـ #shareBox في prototype.html:3351-3390.
 * تعرض بطاقة داكنة بتدرّج تركوازي تحتوي:
 *   - صورة + اسم + دور + شعار
 *   - حلقة التوقيع (signature ring)
 *   - 3 إحصائيات: دليل موثّق، قدرة مثبتة، قوّة الملف
 *   - شعار "من الكلام إلى الدليل" + رابط
 * زرّان: "إغلاق" و"انسخ الرابط"
 *
 * راجع PROJECT_MAP.md → src/components/overlays/ShareBox.tsx
 */

import { useState } from 'react'
import { useFocusTrap } from '../../hooks'
import { Button } from '../ui'
import styles from './ShareBox.module.css'

interface ShareBoxProps {
  open: boolean
  onClose: () => void
  name?: string
  role?: string
  verifiedEvidence?: number
  provenCapabilities?: number
  fileStrength?: number
  shareUrl?: string
}

export function ShareBox({
  open,
  onClose,
  name = 'حسابك',
  role = 'مهندس برمجيات',
  verifiedEvidence = 6,
  provenCapabilities = 3,
  fileStrength = 72,
  shareUrl = 'qudra.sa/p/you',
}: ShareBoxProps) {
  const [copied, setCopied] = useState(false)
  const containerRef = useFocusTrap<HTMLDivElement>({ active: open, onClose })

  if (!open) return null

  const handleCopy = () => {
    navigator.clipboard?.writeText(`https://${shareUrl}`).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }).catch(() => {
      setCopied(false)
    })
  }

  return (
    <div className={styles.overlay} ref={containerRef} dir="rtl" role="dialog" aria-modal="true" aria-label="بطاقة المشاركة">
      <div className={styles.sheet}>
        <div className={styles.head}>
          <div>
            <h3>بطاقة المشاركة</h3>
            <p>هذا ما يراه من تفتح له الرابط أو تنشره.</p>
          </div>
          <button className={styles.close} onClick={onClose} aria-label="إغلاق">&times;</button>
        </div>
        <div className={styles.body}>
          <div className={styles.card}>
            <div className={styles.bg} aria-hidden="true" />
            <div className={styles.top}>
              <span className={styles.avatar} aria-hidden="true">{name.charAt(0)}</span>
              <div>
                <h4>{name}</h4>
                <p>{role}</p>
              </div>
              <span className={styles.logo} aria-hidden="true" />
            </div>
            <div className={styles.mid}>
              <div className={styles.sig} aria-hidden="true">
                <svg viewBox="0 0 120 120" width="100" height="100">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                  <circle cx="60" cy="60" r="52" fill="none" stroke="#00B8B8" strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={`${(fileStrength / 100) * 327} 327`} transform="rotate(-90 60 60)" />
                </svg>
              </div>
              <div className={styles.stats}>
                <div><span className={styles.val}>{verifiedEvidence}</span><span className={styles.key}>دليل موثّق</span></div>
                <div><span className={styles.val}>{provenCapabilities}</span><span className={styles.key}>قدرة مثبتة</span></div>
                <div><span className={styles.val}>{fileStrength}</span><span className={styles.key}>قوّة الملف</span></div>
              </div>
            </div>
            <div className={styles.foot}>
              <span className={styles.tag}>من الكلام إلى الدليل</span>
              <span className={styles.url}>{shareUrl}</span>
            </div>
          </div>
          <p className={styles.privacyNote}>
            البطاقة تعرض المُثبت فقط. درجاتك التفصيلية وفجواتك لا تظهر هنا.
          </p>
        </div>
        <div className={styles.footer}>
          <Button variant="ghost" onClick={onClose}>إغلاق</Button>
          <Button variant="primary" onClick={handleCopy}>{copied ? 'تم النسخ' : 'انسخ الرابط'}</Button>
        </div>
      </div>
    </div>
  )
}
