import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, CheckCircle2, ArrowRight, Search } from 'lucide-react';
import { ROUTES } from '../../../constants/routes';
import { GitHubService } from '../../../services/github.service';
import { Button } from '../../../components/ui/Button';
import { GithubIcon } from '../../../components/ui/GithubIcon';

export const GitHubConnectPage: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [token, setToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetchRealRepos = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!username.trim()) {
      setError('يرجى كتابة اسم حسابك في GitHub أولاً.');
      return;
    }

    setConnecting(true);
    setError(null);
    try {
      await GitHubService.fetchRealUserRepos(username, token);
      navigate(ROUTES.GITHUB_SELECT);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('تعذر الاتصال بحساب GitHub. يرجى التحقق من الاسم والمحاولة مجدداً.');
      }
    } finally {
      setConnecting(false);
    }
  };

  const handleConnectDemo = async () => {
    setConnecting(true);
    setError(null);
    try {
      await GitHubService.connect();
      navigate(ROUTES.GITHUB_SELECT);
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div style={{ maxWidth: '44rem', margin: '0 auto', padding: '2.5rem 1.25rem 5rem' }} dir="rtl">
      <div style={{ marginBottom: '1rem' }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--ink-2)',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontFamily: 'inherit',
            fontSize: '0.85rem'
          }}
        >
          <ArrowRight size={16} />
          <span>رجوع</span>
        </button>
      </div>

      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--line)',
        borderRadius: '16px',
        padding: '2.5rem 2rem',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem',
        boxShadow: 'var(--shadow)'
      }}>
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: 'var(--ink)',
          color: '#fff',
          display: 'grid',
          placeItems: 'center'
        }}>
          <GithubIcon size={40} />
        </div>

        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, margin: '0 0 0.5rem' }}>
            ربط حساب GitHub واستخراج الأدلة الحقيقية
          </h1>
          <p style={{ color: 'var(--ink-2)', fontSize: '0.92rem', maxWidth: '48ch', margin: '0 auto', lineHeight: 1.6 }}>
            أدخل اسم حسابك في GitHub لجلب مستودعاتك البرمجية الفعلية وفحص كفاءاتك الحقيقية.
          </p>
        </div>

        {error && (
          <div style={{
            width: '100%',
            background: 'var(--danger-tint)',
            color: 'var(--danger)',
            border: '1px solid #F6B8B3',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            fontSize: '0.86rem',
            textAlign: 'right'
          }}>
            {error}
          </div>
        )}

        {/* Real Username Input */}
        <form onSubmit={handleFetchRealRepos} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'right' }}>
          <div>
            <label htmlFor="ghUser" style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.4rem' }}>
              اسم المستخدم في GitHub (Username)
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'var(--surface-2)',
              border: '1px solid var(--line)',
              borderRadius: '8px',
              padding: '0.6rem 0.85rem'
            }}>
              <span style={{ fontFamily: 'var(--fm)', color: 'var(--ink-3)', direction: 'ltr' }}>github.com/</span>
              <input
                id="ghUser"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="اسم حسابك الفعلي (مثال: torvalds)"
                dir="ltr"
                style={{
                  border: 'none',
                  background: 'none',
                  outline: 'none',
                  width: '100%',
                  fontFamily: 'inherit',
                  fontSize: '0.92rem',
                  color: 'var(--ink)'
                }}
              />
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--ink-3)', display: 'block', marginTop: '0.35rem' }}>
              سنقوم بالاتصال بـ GitHub API لجلب مستودعاتك الحقيقية وتصنيف مهاراتك منها.
            </span>
          </div>

          <div>
            <button
              type="button"
              onClick={() => setShowTokenInput(!showTokenInput)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--proof-text)',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                padding: 0
              }}
            >
              {showTokenInput ? 'إخفاء خيار الـ Token' : '+ هل تريد تضمين مستودعات خاصة؟ (Personal Access Token اختياري)'}
            </button>

            {showTokenInput && (
              <div style={{ marginTop: '0.5rem' }}>
                <input
                  type="password"
                  value={token}
                  onChange={e => setToken(e.target.value)}
                  placeholder="ghp_xxxxxxxxxxxx (اختياري للمستودعات الخاصة)"
                  dir="ltr"
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.85rem',
                    borderRadius: '8px',
                    border: '1px solid var(--line)',
                    background: 'var(--surface-2)',
                    fontSize: '0.88rem'
                  }}
                />
              </div>
            )}
          </div>

          <Button
            type="submit"
            variant="proof"
            size="lg"
            fullWidth
            loading={connecting}
            leftIcon={<Search size={18} />}
          >
            جلب مستودعاتي الحقيقية من GitHub
          </Button>
        </form>

        {/* Guarantees Box */}
        <div style={{
          background: 'var(--surface-2)',
          border: '1px solid var(--line-soft)',
          borderRadius: '12px',
          padding: '1.1rem 1.35rem',
          textAlign: 'right',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.65rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.84rem', color: 'var(--ink)' }}>
            <CheckCircle2 size={16} color="var(--proof)" />
            <span><strong>صلاحية قراءة فقط (Read-Only)</strong> — قراءة عامة للبيانات والملفات.</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.84rem', color: 'var(--ink)' }}>
            <Shield size={16} color="var(--proof)" />
            <span><strong>الخصوصية مضمونة</strong> — لا نخزن الكود المصدري بل مخرجات التحليل الهندسي.</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.84rem', color: 'var(--ink)' }}>
            <Lock size={16} color="var(--proof)" />
            <span><strong>أنت من يختار</strong> — تختار لاحقاً فقط المستودعات التي تريد مسحها.</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleConnectDemo}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--ink-3)',
            fontSize: '0.84rem',
            cursor: 'pointer',
            textDecoration: 'underline'
          }}
        >
          أو المتابعة بالمستودعات التجريبية الحالية (Demo Mode)
        </button>
      </div>
    </div>
  );
};

export default GitHubConnectPage;
