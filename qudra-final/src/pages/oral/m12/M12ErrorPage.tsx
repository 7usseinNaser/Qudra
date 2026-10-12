import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { M12AnchorNav } from './M12AnchorNav';
import styles from './m12.module.css';
import { ArrowRight, AlertCircle, RefreshCw, ShieldCheck, AlertTriangle, UserCheck, Mic, Calendar, WifiOff, Clock, Sparkles } from 'lucide-react';

type ErrorType = 'expert_unavailable' | 'scheduling_conflict' | 'recording_failed' | 'analysis_failed' | 'network' | 'unknown';

const ERROR_TYPES: Record<ErrorType, { title: string; description: string; showPartialData: boolean; suggestedAction?: string }> = {
  expert_unavailable: {
    title: 'الخبير غير متاح',
    description: 'الخبير المعين للمقابلة غير متاح (إجازة، ترك الوظيفة، عدم استجابة). يتم إعادة إسناد المقابلة لخبير بديل من نفس التخصص.',
    showPartialData: true,
    suggestedAction: 'إعادة إسناد لخبير بديل'
  },
  scheduling_conflict: {
    title: 'تعارض في المواعيد',
    description: 'الموعد المختار يتعارض مع مواعيد أخرى للمستخدم أو للخبير. يُقترح مواعيد بديلة متاحة للطرفين.',
    showPartialData: true,
    suggestedAction: 'اختيار موعد بديل'
  },
  recording_failed: {
    title: 'فشل تسجيل الجلسة [Demo]',
    description: 'تعذر تسجيل الجلسة الصوتية (محاكاة). في النسخة الحقيقية: مشكلة في الميكروفون، صلاحيات المتصفح، أو مساحة التخزين.',
    showPartialData: true,
    suggestedAction: 'إعادة المحاولة / متابعة بدون تسجيل'
  },
  analysis_failed: {
    title: 'فشل تحليل الإجابات [Demo]',
    description: 'تعذر تحليل إجابات المقابلة وتوليد التقرير الآلي (محاكاة). في النسخة الحقيقية: مشكلة في خدمة STT أو نموذج التقييم.',
    showPartialData: true,
    suggestedAction: 'تقييم يدوي من المراجع'
  },
  network: {
    title: 'انقطاع الاتصال',
    description: 'لا يوجد اتصال بالإنترنت، أو خدمة الجدولة/التسجيل غير متاحة. سيتم حفظ البيانات محلياً ويمكن إكمالها لاحقاً.',
    showPartialData: true
  },
  unknown: {
    title: 'خطأ غير متوقع',
    description: 'حدث خطأ أثناء معالجة المقابلة. نعرض ما اكتمل ويمكنك إعادة المحاولة أو التواصل مع الدعم.',
    showPartialData: true
  }
};

export const M12ErrorPage: React.FC = () => {
  const navigate = useNavigate();
  const [errorType, setErrorType] = useState<ErrorType>('unknown');
  const [retrying, setRetrying] = useState(false);

  const errorInfo = ERROR_TYPES[errorType];

  const handleRetry = async () => {
    setRetrying(true);
    await new Promise(res => setTimeout(res, 1000));
    setRetrying(false);
    navigate('/oral/overview');
  };

  const handleSuggestedAction = () => {
    if (errorInfo.suggestedAction) {
      navigate('/oral/create');
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
      label: errorInfo.suggestedAction || 'جدولة مقابلة جديدة',
      action: handleSuggestedAction,
      variant: 'outline' as const,
      icon: <AlertTriangle size={16} />
    },
    {
      label: 'العودة للنظرة العامة',
      action: () => navigate('/oral/overview'),
      variant: 'ghost' as const,
      icon: <ArrowRight size={16} />
    }
  ];

  return (
    <div className={styles.container}>
      <M12AnchorNav />

      <div className={styles.headerRow}>
        <div>
          <span className={styles.badgeQ}>M12 · Q-0471 · ⚓ Error</span>
          <span className={styles.demoBadge}>[Demo / تجريبي] محاكاة حالات خطأ</span>
          <h1 className={styles.title}>خطأ في المقابلة الشفوية</h1>
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
            <option value="expert_unavailable">👤 خبير غير متاح</option>
            <option value="scheduling_conflict">📅 تعارض مواعيد</option>
            <option value="recording_failed">🎙️ فشل التسجيل [Demo]</option>
            <option value="analysis_failed">🤖 فشل التحليل [Demo]</option>
            <option value="network">🌐 انقطاع الشبكة</option>
            <option value="unknown">❓ خطأ غير معروف</option>
          </select>
        </div>
      </div>

      <div className={styles.errorBox}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
          <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'rgba(239, 68, 68, 0.12)', display: 'grid', placeItems: 'center', color: '#EF4444', flexShrink: 0 }}>
            <AlertCircle size={22} />
          </div>

          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--ink)', margin: '0 0 0.4rem' }}>
              {errorInfo.title}
            </h2>
            <p style={{ color: 'var(--ink-2)', fontSize: '0.88rem', lineHeight: 1.6, margin: 0 }}>
              {errorInfo.description}
              تم حفظ تقدمك المحلي والبيانات المدخلة بأمان.
            </p>
          </div>
        </div>

        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--line)',
          borderRadius: '10px',
          padding: '0.9rem 1.1rem',
          marginTop: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          fontSize: '0.82rem',
          color: 'var(--ink-2)'
        }}>
          <ShieldCheck size={16} color="var(--proof)" />
          <span>
            <strong>ضمان الأمان والحفظ المحلي:</strong> نحتفظ ببيانات المقابلة، الأسئلة، الملاحظات، والموعد محلياً.
            لا نفقد أي إدخال عند انقطاع الاتصال.
          </span>
        </div>

        <div className={styles.actionRow} style={{ marginTop: '1.5rem' }}>
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
            البيانات المحفوظة والمسار البديل المقترح
          </h2>
          <p style={{ margin: '0 0 1rem', color: 'var(--ink-2)', fontSize: '0.9rem', lineHeight: 1.6 }}>
            تم حفظ بيانات المقابلة المدخلة. يمكنك مراجعتها واختيار المسار البديل.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mic size={16} style={{ color: 'var(--proof)' }} />
                <span style={{ fontWeight: 600, color: 'var(--ink)' }}>مقابلة تقنية: React Testing & Architecture</span>
              </div>
              <span className="verificationStatus pending" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', fontWeight: 700, padding: '0.25rem 0.6rem', borderRadius: '6px', color: '#F59E0B', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                <Clock size={12} /> محفوظ محلياً
              </span>
            </div>
            {errorInfo.suggestedAction && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(0, 184, 184, 0.05)', border: '1px solid rgba(0, 184, 184, 0.2)', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertTriangle size={16} style={{ color: '#F59E0B' }} />
                  <span style={{ fontWeight: 600, color: 'var(--ink)' }}>إجراء بديل مقترح</span>
                </div>
                <span className="verificationMethod" style={{ background: 'rgba(0, 184, 184, 0.1)', borderColor: 'rgba(0, 184, 184, 0.3)', color: 'var(--proof)' }}>
                  <ShieldCheck size={12} /> {errorInfo.suggestedAction}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className={styles.card} style={{ marginTop: '1.5rem' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--ink)', margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={20} style={{ color: '#F59E0B' }} />
          مبدأ: نبدل الخبير/الموعد ولا نرفض تلقائياً
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '10px' }}>
            <div style={{ fontWeight: 700, color: 'var(--ink)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldCheck size={16} style={{ color: '#10B981' }} />
              فشل المقابلة ≠ رفض التحقق
            </div>
            <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--ink-2)', lineHeight: 1.6 }}>
              إذا تعذر توفر الخبير، أو تعارض الموعد، أو فشل التسجيل/التحليل —
              لا نرفض الطلب تلقائياً. نقترح <strong>خبير بديل</strong> من نفس التخصص أو <strong>موعد بديل</strong>،
              ونسمح بالمتابعة بتقييم يدوي من المراجع.
            </p>
          </div>
          <div style={{ padding: '1rem', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '10px' }}>
            <div style={{ fontWeight: 700, color: 'var(--ink)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <AlertTriangle size={16} style={{ color: '#F59E0B' }} />
              حق الاعتراض مكفول
            </div>
            <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--ink-2)', lineHeight: 1.6 }}>
              كل نتيجة تقييم (ناجح/غير ناجح) قابلة للاعتراض. المعترض يقدم دليلاً مضاداً،
              ويعاد التقييم بمراجع آخر أو طريقة مختلفة. لا قرار نهائي بلا مسار مراجعة.
            </p>
          </div>
          <div style={{ padding: '1rem', background: 'rgba(0, 184, 184, 0.05)', border: '1px solid rgba(0, 184, 184, 0.2)', borderRadius: '10px' }}>
            <div style={{ fontWeight: 700, color: 'var(--ink)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={16} style={{ color: 'var(--proof)' }} />
              الوضع المحدود بلا إنترنت
            </div>
            <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--ink-2)', lineHeight: 1.6 }}>
              بلا اتصال: يُحفظ الطلب محلياً مع جميع البيانات (الأسئلة، الملاحظات، الموعد).
              عند استعادة الاتصال، يُرسل تلقائياً أو يمكن إرساله يدوياً. لا فقد للتقدم.
            </p>
          </div>
        </div>
      </div>

      <div className={styles.card} style={{ marginTop: '1.5rem' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--ink)', margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <UserCheck size={20} style={{ color: 'var(--proof)' }} />
          أسباب شائعة وحلول سريعة
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ padding: '0.75rem', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
              <UserCheck size={16} style={{ color: 'var(--proof)' }} />
              <strong>خبير غير متاح:</strong> النظام يعيد الإسناد تلقائياً خلال 24 ساعة، أو اختر خبيراً بديلاً من القائمة.
            </div>
          </div>
          <div style={{ padding: '0.75rem', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
              <Calendar size={16} style={{ color: '#10B981' }} />
              <strong>تعارض مواعيد:</strong> يعرض النظام 3 مواعيد بديلة متاحة للطرفين، اختر واحداً أو اقترح آخر.
            </div>
          </div>
          <div style={{ padding: '0.75rem', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
              <Mic size={16} style={{ color: '#F59E0B' }} />
              <strong>فشل التسجيل [Demo]:</strong> تحقق من صلاحيات الميكروفون، أو تابع بتقييم يدوي من المراجع.
            </div>
          </div>
          <div style={{ padding: '0.75rem', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
              <WifiOff size={16} style={{ color: '#EF4444' }} />
              <strong>انقطاع الشبكة:</strong> البيانات محفوظة محلياً. سيعاد الإرسال تلقائياً عند استعادة الاتصال.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default M12ErrorPage;