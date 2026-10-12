import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { GitHubService } from '../../../services/github.service';
import styles from './m14.module.css';
import { ArrowRight, AlertCircle, RefreshCw, Lock, Key, WifiOff, ShieldCheck, AlertTriangle } from 'lucide-react';
import { GithubIcon } from '../../../components/ui/GithubIcon';

type ErrorType = 'permission' | 'rate_limit' | 'network' | 'not_found' | 'token_expired' | 'unknown';

interface ErrorInfo {
  type: ErrorType;
  title: string;
  description: string;
  recoveryActions: { label: string; action: () => void; variant: 'proof' | 'outline' | 'ghost'; icon: React.ReactNode }[];
  showPartialData: boolean;
}

const ERROR_TYPES: Record<ErrorType, Omit<ErrorInfo, 'recoveryActions'>> = {
  permission: {
    type: 'permission',
    title: 'صلاحية ناقصة أو مرفوضة',
    description: 'المفتاح (Token) لا يملك صلاحية قراءة المستودعات، أو تم رفض الوصول. تأكد من صلاحيات "Contents: Read" و "Metadata: Read".',
    showPartialData: true
  },
  rate_limit: {
    type: 'rate_limit',
    title: 'تم تجاوز حد معدل API',
    description: 'GitHub API يفرض حد 5000 طلب/ساعة للطلبات المصادقة، و60 طلب/ساعة للطلبات العامة. انتظر أو أضف PAT لرفع الحد.',
    showPartialData: true
  },
  network: {
    type: 'network',
    title: 'تعذر الاتصال بـ GitHub',
    description: 'لا يوجد اتصال بالإنترنت، أو GitHub غير متاح. سيتم حفظ ما اكتمل محلياً ويمكنك المحاولة لاحقاً.',
    showPartialData: true
  },
  not_found: {
    type: 'not_found',
    title: 'المستودع أو الحساب غير موجود',
    description: 'الحساب أو المستودع المحدد غير موجود على GitHub، أو تم تغيير الاسم/حذفه.',
    showPartialData: false
  },
  token_expired: {
    type: 'token_expired',
    title: 'انتهت صلاحية مفتاح الوصول',
    description: 'الـPAT منتهي الصلاحية أو تم إلغاؤه. يرجى إنشاء مفتاح جديد بصلاحية قراءة فقط.',
    showPartialData: true
  },
  unknown: {
    type: 'unknown',
    title: 'خطأ غير متوقع',
    description: 'حدث خطأ أثناء التواصل مع GitHub API. نعرض ما اكتمل ويمكنك إعادة المحاولة.',
    showPartialData: true
  }
};

export const M14ErrorPage: React.FC = () => {
  const navigate = useNavigate();
  const [errorType, setErrorType] = useState<ErrorType>('unknown');
  const [retrying, setRetrying] = useState(false);
  const [tokenInput, setTokenInput] = useState(GitHubService.getToken() || '');
  const [showTokenModal, setShowTokenModal] = useState(false);

  const errorInfo = ERROR_TYPES[errorType];

  const handleRetry = async () => {
    setRetrying(true);
    try {
      await GitHubService.fetchRealUserRepos('7usseinNaser');
      navigate('/code-intel/overview');
    } catch {
      // Stay on error page
    } finally {
      setRetrying(false);
    }
  };

  const handleSaveToken = async () => {
    GitHubService.setToken(tokenInput.trim());
    setShowTokenModal(false);
    setRetrying(true);
    try {
      await GitHubService.fetchRealUserRepos('7usseinNaser', tokenInput.trim());
      navigate('/code-intel/overview');
    } catch {
      // Stay on error page
    } finally {
      setRetrying(false);
    }
  };

  const recoveryActions = [
    {
      label: retrying ? 'جاري إعادة المحاولة...' : 'إعادة المحاولة',
      action: handleRetry,
      variant: 'proof' as const,
      icon: <RefreshCw size={16} className={retrying ? 'spin' : ''} />
    },
    {
      label: 'تحديث مفتاح الوصول (PAT)',
      action: () => setShowTokenModal(true),
      variant: 'outline' as const,
      icon: <Key size={16} />
    },
    {
      label: 'العودة للنظرة العامة',
      action: () => navigate('/code-intel/overview'),
      variant: 'ghost' as const,
      icon: <ArrowRight size={16} />
    }
  ];

  return (
    <div className={styles.container} dir="rtl">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/code-intel/overview')}
          leftIcon={<ArrowRight size={15} />}
        >
          العودة للنظرة العامة
        </Button>
      </div>

      <div className={styles.headerRow}>
        <div className={styles.headerContent}>
          <span className={styles.badgeQ}>M14 · Q-0551 · ⚓ Error</span>
          <span className={styles.demoBadge}>[Demo / تجريبي] محاكاة حالات خطأ</span>
          <h1 className={styles.title}>خطأ في تحليل GitHub</h1>
          <p className={styles.subtitle}>
            {errorInfo.description}
          </p>
        </div>

        <div className={styles.actionRow}>
          <select
            value={errorType}
            onChange={e => setErrorType(e.target.value as ErrorType)}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '8px',
              color: 'var(--ink)',
              padding: '0.5rem 1rem',
              fontSize: '0.85rem',
              fontFamily: 'inherit',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="permission">🔐 صلاحية ناقصة</option>
            <option value="rate_limit">⏱️ حد معدل API</option>
            <option value="network">🌐 انقطاع الشبكة</option>
            <option value="not_found">🔍 غير موجود</option>
            <option value="token_expired">🔑 توكن منتهي</option>
            <option value="unknown">❓ خطأ غير معروف</option>
          </select>
        </div>
      </div>

      <div className={styles.errorState}>
        <AlertTriangle className={styles.errorIcon} size={48} />
        <h2 className={styles.errorTitle}>{errorInfo.title}</h2>
        <p className={styles.errorDesc}>{errorInfo.description}</p>

        <div className={styles.recoveryActions}>
          {recoveryActions.map((action, idx) => (
            <Button
              key={idx}
              variant={action.variant}
              size="md"
              onClick={action.action}
              disabled={retrying && action.variant === 'proof'}
              leftIcon={action.icon}
            >
              {action.label}
            </Button>
          ))}
        </div>
      </div>

      {errorInfo.showPartialData && (
        <div className={styles.card} style={{ marginTop: '1.5rem' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--ink)', margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={20} style={{ color: '#10B981' }} />
            البيانات الجزئية المحفوظة محلياً
          </h2>
          <p style={{ margin: '0 0 1rem', color: 'var(--ink-2)', fontSize: '0.9rem', lineHeight: 1.6 }}>
            تم حفظ المستودعات التي تم جلبها بنجاح قبل حدوث الخطأ. يمكنك مراجعتها والمحاولة مرة أخرى.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'var(--proof)' }}><GithubIcon size={16} /></span>
                <span style={{ fontWeight: 600, color: 'var(--ink)' }}>Qudra</span>
                <span className={styles.repoVisibility + ' public'}>🌐 عام</span>
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--ink-2)' }}>تم جلبها ✓</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '8px', opacity: 0.6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: '#F59E0B' }}><GithubIcon size={16} /></span>
                <span style={{ fontWeight: 600, color: 'var(--ink)' }}>private-repo</span>
                <span className={styles.repoVisibility + ' private'}>🔒 خاص</span>
              </div>
              <span style={{ fontSize: '0.8rem', color: '#F59E0B' }}>في الانتظار...</span>
            </div>
          </div>
        </div>
      )}

      <div className={styles.card} style={{ marginTop: '1.5rem' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--ink)', margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={20} style={{ color: '#F59E0B' }} />
          أسباب شائعة وحلول
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <Lock size={20} style={{ color: '#F59E0B', flexShrink: 0, marginTop: '0.15rem' }} />
              <div>
                <div style={{ fontWeight: 600, color: 'var(--ink)', marginBottom: '0.25rem' }}>Fine-grained PAT بصلاحية قراءة فقط</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--ink-2)', lineHeight: 1.6 }}>
                  أنشئ مفتاحاً في <a href="https://github.com/settings/tokens" target="_blank" rel="noreferrer" style={{ color: 'var(--proof)' }}>GitHub Settings → Developer settings → Personal access tokens → Fine-grained tokens</a>.
                  اختر المستودعات المحددة، وصلاحيات: <strong>Contents: Read</strong>، <strong>Metadata: Read</strong>.
                </div>
              </div>
            </div>
          </div>
          <div style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <WifiOff size={20} style={{ color: '#EF4444', flexShrink: 0, marginTop: '0.15rem' }} />
              <div>
                <div style={{ fontWeight: 600, color: 'var(--ink)', marginBottom: '0.25rem' }}>حد المعدل (Rate Limit)</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--ink-2)', lineHeight: 1.6 }}>
                  بدون توكن: 60 طلب/ساعة. مع PAT: 5000 طلب/ساعة. انتظر ساعة أو أضف توكن صالح.
                </div>
              </div>
            </div>
          </div>
          <div style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <ShieldCheck size={20} style={{ color: 'var(--proof)', flexShrink: 0, marginTop: '0.15rem' }} />
              <div>
                <div style={{ fontWeight: 600, color: 'var(--ink)', marginBottom: '0.25rem' }}>مستوى الثقة: User-supplied</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--ink-2)', lineHeight: 1.6 }}>
                  PAT يُحفظ في الذاكرة فقط للجلسة. لا يُخزن محلياً، لا يُسجل. OAuth رسمي (مستوى Official) سيتم تفعيله لاحقاً عبر الباك إند.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showTokenModal && (
        <div className={styles.modalOverlay} onClick={() => setShowTokenModal(false)}>
          <div className={styles.modalBox} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                <Lock size={18} style={{ verticalAlign: 'middle', marginLeft: '0.4rem', color: '#F59E0B' }} />
                تحديث مفتاح الوصول (PAT)
              </h3>
              <button
                onClick={() => setShowTokenModal(false)}
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
              >
                <AlertCircle size={18} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.25rem 0.65rem',
                borderRadius: '6px',
                background: 'rgba(245, 158, 11, 0.15)',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                color: '#FBBF24',
                fontSize: '0.78rem',
                fontWeight: 600,
                marginBottom: '0.85rem'
              }}>
                <span>مستوى الثقة: User-supplied (يقدّمه المستخدم)</span>
              </div>

              <p style={{ fontSize: '0.86rem', color: '#CBD5E1', lineHeight: 1.6, marginBottom: '0.75rem' }}>
                أنشئ <strong>Fine-grained PAT</strong> جديد بصلاحية <strong>قراءة فقط</strong> على المستودعات المطلوبة.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.84rem', fontWeight: 600, color: '#CBD5E1' }}>
                  رمز Fine-grained PAT الجديد
                </label>
                <input
                  type="password"
                  value={tokenInput}
                  onChange={e => setTokenInput(e.target.value)}
                  placeholder="github_pat_xxxxxxxxxxxxxxxxxxxx"
                  dir="ltr"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '8px',
                    color: '#fff',
                    padding: '0.65rem 0.85rem',
                    fontFamily: 'monospace',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '10px', padding: '0.75rem', fontSize: '0.8rem', color: '#E2E8F0', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                🔒 <strong>في الذاكرة فقط:</strong> لا يُحفظ في localStorage، يُمحى عند إغلاق التبويب.
              </div>
            </div>

            <div className={styles.modalFooter}>
              <Button variant="ghost" size="sm" onClick={() => setShowTokenModal(false)}>إلغاء</Button>
              <Button variant="proof" size="sm" onClick={handleSaveToken} disabled={retrying}>
                {retrying ? 'جاري التحقق...' : 'حفظ وإعادة المحاولة'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default M14ErrorPage;