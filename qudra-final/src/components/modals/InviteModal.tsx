/**
 * InviteModal — نافذة دعوة المرشح للمشروع.
 *
 * مطابقة حرفية لـ prototype.html (#inviteModal):
 * اسم المرشح، تخصصه، القدرة المراد تغطيتها، وكتابة رسالة شخصية.
 */

import { useState } from 'react'
import styles from './InviteModal.module.css'

interface InviteModalProps {
  name: string
  roleMeta: string
  skill: string
  isOpen: boolean
  onClose: () => void
}

export function InviteModal({
  name,
  roleMeta,
  skill,
  isOpen,
  onClose,
}: InviteModalProps) {
  const [note, setNote] = useState('')
  const [sent, setSent] = useState(false)

  if (!isOpen) return null

  const handleSend = () => {
    setSent(true)
  }

  const handleClose = () => {
    setSent(false)
    setNote('')
    onClose()
  }

  return (
    <div className={styles.backdrop} dir="rtl" role="dialog" aria-modal="true">
      <div className={styles.box}>
        {!sent ? (
          <div>
            <div className={styles.invhead}>
              <div>
                <h3>{name}</h3>
                <p>{roleMeta}</p>
              </div>
              <button
                className={styles.closeBtn}
                onClick={handleClose}
                aria-label="إغلاق"
              >
                ✕
              </button>
            </div>

            <div className={styles.why}>
              تدعوه لتغطية <b>{skill}</b> — القدرة الوحيدة تحت العتبة في مشروعك.
            </div>

            <div className={styles.field}>
              <label>رسالة شخصية (اختياري)</label>
              <textarea
                rows={3}
                placeholder="مرحبًا، رأيت أدلتك وحابّ نتعاون في مشروعنا..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            <div className={styles.row}>
              <button className="btn" onClick={handleSend} id="sendInviteBtn">
                أرسل الدعوة
              </button>
              <button className="btn ghost" onClick={handleClose}>
                إلغاء
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.suc}>
            <h3>أُرسلت الدعوة!</h3>
            <p>
              تصل إشعارًا للمرشح {name} مع تفاصيل مشروعك والقدرات المطلوبة منه.
            </p>
            <button className="btn" onClick={handleClose}>
              تم
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
