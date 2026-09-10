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
import { authService } from '../../services/authService'
import { QudraLogo } from '../../components/ui/QudraLogo'
import styles from './SignUpPage.module.css'

export function SignUpPage() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorNotice, setErrorNotice] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || password.length < 8) {
      setErrorNotice('يرجى تعبئة جميع الحقول. كلمة المرور ٨ أحرف على الأقل.')
      return
    }

    setLoading(true)
    setErrorNotice('')

    const result = await authService.signUp({
      email: email.trim(),
      password,
      fullName: name.trim(),
    })

    setLoading(false)

    if (!result.success) {
      setErrorNotice(result.error ?? 'حدث خطأ. حاول مرة أخرى.')
      return
    }

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
        <QudraLogo
          size={280}
          className={styles.bandMark}
          aria-hidden="true"
          alt=""
        />
      </div>

      <button className={styles.skip} onClick={handleSkip}>
        تخطّي
      </button>

      <div className={styles.inner}>
        <div className={styles.top}>
          <QudraLogo
            size={52}
            className={styles.topLogo}
            alt="قُدرة"
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

          {errorNotice && (
            <p className={styles.fielderr} role="alert">
              {errorNotice}
            </p>
          )}

          <button className={styles.cta} type="submit" id="signupSubmitBtn" disabled={loading}>
            {loading ? 'جارٍ الإنشاء…' : 'أنشئ حساب'}
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
