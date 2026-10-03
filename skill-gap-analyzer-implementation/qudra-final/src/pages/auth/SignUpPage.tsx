/**
 * SignUpPage — شاشة إنشاء الحساب الشخصي.
 * تدعم التحقق من كلمة المرور، الموافقة على الشروط، واستدعاء AuthService والتحويل إلى /verify-email.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { useRole } from '../../contexts/useRole';
import { AuthService } from '../../services/auth.service';
import { QudraLogo } from '../../components/ui/QudraLogo';
import { Button } from '../../components/ui/Button';
import styles from './SignUpPage.module.css';

export function SignUpPage() {
  const navigate = useNavigate();
  const { signup } = useRole();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim()) {
      setError('يرجى ملء جميع الحقول الإلزامية.');
      return;
    }

    if (password.length < 8) {
      setError('كلمة المرور يجب ألا تقل عن 8 أحرف.');
      return;
    }

    if (password !== confirmPassword) {
      setError('كلمتا المرور غير متطابقتين.');
      return;
    }

    if (!termsAccepted) {
      setError('يرجى الموافقة على شروط الاستخدام وسياسة الخصوصية للمتابعة.');
      return;
    }

    setLoading(true);
    try {
      await AuthService.signUp({
        fullName: name,
        email,
        role: 'talent',
        password,
        acceptTerms: true
      });
      signup(name, email);
      navigate(ROUTES.VERIFY_EMAIL);
    } catch {
      setError('حدث خطأ أثناء إنشاء الحساب، يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    navigate(ROUTES.ROLE_SELECT);
  };

  const handleGoLogin = () => {
    navigate(ROUTES.LOGIN);
  };

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

        {error && (
          <div 
            style={{ 
              background: 'var(--danger-tint, #FBE7E5)', 
              color: 'var(--danger, #C2372B)', 
              padding: '0.75rem 1rem', 
              borderRadius: '8px', 
              fontSize: '0.85rem',
              marginBottom: '1rem',
              border: '1px solid #F6B8B3'
            }}
          >
            {error}
          </div>
        )}

        <form className={styles.fields} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="fName">الاسم الكامل</label>
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

          <div className={styles.field}>
            <label htmlFor="fPassConfirm">تأكيد كلمة المرور</label>
            <input
              id="fPassConfirm"
              type="password"
              name="confirmPassword"
              autoComplete="new-password"
              placeholder="أعد كتابة كلمة المرور"
              minLength={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0.25rem 0' }}>
            <input
              id="termsCheckbox"
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <label htmlFor="termsCheckbox" style={{ fontSize: '0.82rem', color: 'var(--ink-2)', cursor: 'pointer' }}>
              أوافق على <a href="#terms" style={{ color: 'var(--proof-text)' }}>شروط الخدمة</a> و <a href="#privacy" style={{ color: 'var(--proof-text)' }}>سياسة الخصوصية</a>
            </label>
          </div>

          <Button
            type="submit"
            id="signupSubmitBtn"
            fullWidth
            loading={loading}
            variant="proof"
            size="md"
          >
            أنشئ حساب وابدأ الإثبات
          </Button>
        </form>

        <p className={styles.alt}>
          لديك حساب بالفعل؟{' '}
          <button type="button" onClick={handleGoLogin} id="toLoginBtn">
            سجّل الدخول
          </button>
        </p>
      </div>
    </div>
  );
}

export default SignUpPage;
