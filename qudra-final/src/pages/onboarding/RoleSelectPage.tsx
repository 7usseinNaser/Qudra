/**
 * RoleSelectPage — شاشة اختيار الدور (الخطوة 1 من 2).
 *
 * مطابقة حرفية لـ prototype.html (#role).
 * تتيح للمستخدم اختيار دور صاحب المشكلة ('c') أو صاحب القدرة ('u').
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import { useRole, type Role } from '../../contexts/RoleContext'
import styles from './RoleSelectPage.module.css'

export function RoleSelectPage() {
  const navigate = useNavigate()
  const { switchRole } = useRole()
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)

  const handleSelectRole = (r: Role) => {
    setSelectedRole(r)
  }

  const handleContinue = () => {
    if (!selectedRole) return
    switchRole(selectedRole)
    if (selectedRole === 'c') {
      navigate(ROUTES.PROBLEM)
    } else {
      navigate(ROUTES.PROFILE)
    }
  }

  return (
    <div className={styles.pick} dir="rtl">
      <div className={styles.pinner}>
        <span className={styles.stepno}>الخطوة 1 من 2</span>
        <h1>اختر دورك</h1>
        <p className={styles.plede}>
          نخصّص تجربتك بناءً على اختيارك — تقدر تبدّله لاحقًا في أي وقت.
        </p>

        <div className={styles.pcards}>
          <button
            type="button"
            className={`${styles.pcard} ${selectedRole === 'c' ? styles.active : ''}`}
            data-role="c"
            onClick={() => handleSelectRole('c')}
            aria-pressed={selectedRole === 'c'}
          >
            <span className={styles.pico}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
                <circle cx="12" cy="12" r="4" />
              </svg>
            </span>
            <span className={styles.ptxt}>
              <b>لديّ مشكلة أريد حلّها</b>
              <em>نحلّل مشكلتك، نستخرج القدرات المطلوبة، ونختبرك عليها.</em>
            </span>
            <span className={styles.pmark} />
          </button>

          <button
            type="button"
            className={`${styles.pcard} ${selectedRole === 'u' ? styles.active : ''}`}
            data-role="u"
            onClick={() => handleSelectRole('u')}
            aria-pressed={selectedRole === 'u'}
          >
            <span className={styles.pico}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <path d="M14 2v6h6" />
                <path d="m9 15 2 2 4-4" />
              </svg>
            </span>
            <span className={styles.ptxt}>
              <b>لديّ قدرات أريد إثباتها</b>
              <em>ابنِ ملفًا بالأدلة لا بالكلام، واعرف ما ينقصك بالضبط.</em>
            </span>
            <span className={styles.pmark} />
          </button>
        </div>

        <button
          className={styles.btn}
          id="roleGo"
          disabled={!selectedRole}
          onClick={handleContinue}
        >
          متابعة
        </button>
      </div>
    </div>
  )
}
