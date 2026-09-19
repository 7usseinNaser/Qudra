import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MailCheck } from 'lucide-react';
import { ROUTES } from '../../constants/routes';
import { AuthService } from '../../services/auth.service';
import { Button } from '../../components/ui/Button';
import styles from './EmailVerificationPage.module.css';

export const EmailVerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const [digits, setDigits] = useState(['', '', '', '']);
  const [email, setEmail] = useState('user@qudra.io');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(45);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    AuthService.getCurrentUser().then(u => {
      if (u?.email) setEmail(u.email);
    });

    const timer = setInterval(() => {
      setCountdown(c => (c > 0 ? c - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }
    const nextDigits = [...digits];
    nextDigits[index] = value;
    setDigits(nextDigits);

    if (value && index < 3) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = digits.join('');
    if (code.length < 4) {
      setError('يرجى إدخال رمز التحقق المكون من 4 أرقام كاملاً.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const ok = await AuthService.verifyEmailCode(code);
      if (ok) {
        navigate(ROUTES.ONBOARDING_IDENTITY);
      } else {
        setError('رمز التحقق غير صحيح، يرجى التأكد وإعادة المحاولة.');
      }
    } catch {
      setError('حدث خطأ أثناء الاتصال بالخادم.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    setCountdown(45);
    setError(null);
  };

  return (
    <div className={styles.container} dir="rtl">
      <div className={styles.card}>
        <div className={styles.iconWrap}>
          <MailCheck size={32} />
        </div>

        <div>
          <h1 className={styles.title}>تأكيد البريد الإلكتروني</h1>
          <p className={styles.description}>
            أرسلنا رمز تحقق أمان لمرة واحدة إلى <span className={styles.emailBadge}>{email}</span>. أدخل الرمز لتفعيل حسابك والبدء في بناء ملفك المهاري.
          </p>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className={styles.digitsRow}>
            {digits.map((digit, index) => (
              <input
                key={index}
                ref={el => { inputsRef.current[index] = el; }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={e => handleChange(index, e.target.value)}
                onKeyDown={e => handleKeyDown(index, e)}
                className={styles.digitInput}
                autoFocus={index === 0}
                aria-label={`الرقم ${index + 1}`}
              />
            ))}
          </div>

          <Button
            type="submit"
            variant="proof"
            size="md"
            loading={loading}
            fullWidth
          >
            تأكيد الرمز والمتابعة
          </Button>
        </form>

        <div className={styles.resendRow}>
          <span>لم يصلك الرمز؟</span>
          <button
            type="button"
            className={styles.resendBtn}
            onClick={handleResend}
            disabled={countdown > 0}
          >
            {countdown > 0 ? `إعادة الإرسال بعد (${countdown} ث)` : 'إعادة الإرسال الآن'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationPage;
