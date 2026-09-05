/**
 * LoginPage — شاشة تسجيل الدخول.
 *
 * منقولة حرفياً من prototype.html (الأسطر 2614–2670):
 * - البريد الإلكتروني، كلمة المرور مع زر كشف/إخفاء كلمة المرور.
 * - خيار "تذكّرني"، رابط "نسيت كلمة المرور؟".
 * - معالجة الخطأ التوضيحي، وزر الانتقال لإنشاء حساب جديد.
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import { useRole } from '../../contexts/RoleContext'
import styles from './LoginPage.module.css'

export function LoginPage() {
  const navigate = useNavigate()
  const { login } = useRole()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [errorNotice, setErrorNotice] = useState('')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) {
      setErrorNotice('البريد أو كلمة المرور غير صحيحة. تحقّق وحاول مرة أخرى.')
      return
    }

    login(email)
    // بعد تسجيل الدخول، الانتقال إلى اختيار الدور أو الصفحة الرئيسية
    navigate(ROUTES.ROLE_SELECT)
  }

  const handleSkip = () => {
    navigate(ROUTES.LANDING)
  }

  const handleGoSignUp = () => {
    navigate(ROUTES.SIGNUP)
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
        → الرئيسية
      </button>

      <div className={styles.inner}>
        <div className={styles.top}>
          <img
            src="/assets/qudra-mark-dark.svg"
            alt="قُدرة"
            className={styles.topLogo}
          />
          <h1>أهلًا بعودتك</h1>
          <p>أدلتك محفوظة كما تركتها.</p>
        </div>

        <form className={styles.fields} onSubmit={handleLogin}>
          <div className={styles.field}>
            <label htmlFor="lMail">البريد الإلكتروني</label>
            <input
              id="lMail"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@example.com"
              dir="ltr"
              style={{ textAlign: 'start' }}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setErrorNotice('')
              }}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="lPass">كلمة المرور</label>
            <div className={styles.pwrow}>
              <input
                id="lPass"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setErrorNotice('')
                }}
                required
              />
              <button
                type="button"
                className={styles.peek}
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>
            </div>
          </div>

          {errorNotice && (
            <p className={styles.fielderr} id="loginErr" role="alert">
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4M12 16h.01" />
              </svg>
              {errorNotice}
            </p>
          )}

          <div className={styles.lrow}>
            <label className={styles.chk}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span className={styles.cbx} />
              تذكّرني
            </label>
            <button
              type="button"
              className={styles.linkbtn}
              onClick={() => alert('إعادة تعيين كلمة المرور ستتوفر قريباً')}
            >
              نسيت كلمة المرور؟
            </button>
          </div>

          <button className={styles.cta} type="submit" id="loginSubmitBtn">
            تسجيل الدخول
          </button>
        </form>

        <p className={styles.alt}>
          ما عندك حساب؟{' '}
          <button type="button" onClick={handleGoSignUp} id="toSignupBtn">
            أنشئ حسابًا
          </button>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
