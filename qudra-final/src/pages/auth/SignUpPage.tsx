/**
 * SignUpPage — شاشة إنشاء الحساب الشخصي.
 *
 * منقولة حرفياً من prototype.html (الأسطر 1900–1940):
 * - الاسم، البريد الإلكتروني، كلمة المرور (8 أحرف على الأقل).
 * - زر "أنشئ حساب"، زر "تخطّي" إلى اختيار الدور، ورابط "سجّل الدخول".
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import { useRole } from '../../contexts/RoleContext'
import styles from './SignUpPage.module.css'

export function SignUpPage() {
  const navigate = useNavigate()
  const { signup } = useRole()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return
    signup(name, email)
    navigate(ROUTES.ROLE_SELECT)
  }

  const handleSkip = () => {
    navigate(ROUTES.ROLE_SELECT)
  }

  const handleGoLogin = () => {
    navigate(ROUTES.LOGIN)
  }

  return (
    <div className={styles.auth} dir="rtl">
      <div className={styles.band}>
        <img
          src="/assets/qudra-mark-dark.svg"
          alt=""
          className={styles.bandMark}
          aria-hidden="true"
        />
      </div>

      <button className={styles.skip} onClick={handleSkip}>
        تخطّي
      </button>

      <div className={styles.inner}>
        <div className={styles.top}>
          <img
            src="/assets/qudra-mark-dark.svg"
            alt="قُدرة"
            className={styles.topLogo}
          />
          <h1>أنشئ حسابك الشخصي</h1>
          <p>حسابك هو المكان الذي تتراكم فيه أدلتك — كل دليل تضيفه يبقى معك.</p>
        </div>

        <form className={styles.fields} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="fName">الاسم</label>
            <input
              id="fName"
              type="text"
              name="name"
              autoComplete="name"
              placeholder="اسمك الكامل"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="fMail">البريد الإلكتروني</label>
            <input
              id="fMail"
              type="email"
              name="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@example.com"
              dir="ltr"
              style={{ textAlign: 'start' }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="fPass">كلمة المرور</label>
            <input
              id="fPass"
              type="password"
              name="password"
              autoComplete="new-password"
              placeholder="٨ أحرف على الأقل"
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className={styles.cta} type="submit" id="signupSubmitBtn">
            أنشئ حساب
          </button>
        </form>

        <p className={styles.alt}>
          لديك حساب بالفعل؟{' '}
          <button type="button" onClick={handleGoLogin} id="toLoginBtn">
            سجّل الدخول
          </button>
        </p>
      </div>
    </div>
  )
}

export default SignUpPage
