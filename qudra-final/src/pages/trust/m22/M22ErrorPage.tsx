import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import styles from './m22.module.css';
import { ArrowRight, AlertCircle, RefreshCw, ShieldCheck, AlertTriangle, UserCheck, MessageSquare, Award, GitFork, Search, Clock } from 'lucide-react';

type ErrorType = 'source_unreachable' | 'reviewer_unavailable' | 'evidence_insufficient' | 'method_mismatch' | 'network' | 'unknown';

const ERROR_TYPES: Record<ErrorType, { title: string; description: string; showPartialData: boolean; suggestedMethod?: string }> = {
  source_unreachable: {
    title: 'تعذر الوصول للجهة المصدرة',
    description: 'الجهة المانحة للشهادة أو المنظمة المرجعية غير متاحة (موقع معطل، API متوقف، جهة لم تعد موجودة). نبدل الطريقة ولا نرفض تلقائياً.',
    showPartialData: true,
    suggestedMethod: 'organization_link'
  },
  reviewer_unavailable: {
    title: 'المراجع غير متاح',
    description: 'الخبير المعين للمراجعة غير متاح (إجازة، ترك الوظيفة، عدم استجابة). يتم إعادة إسناد الطلب لمراجع بديل.',
    showPartialData: true,
    suggestedMethod: 'expert_review'
  },
  evidence_insufficient: {
    title: 'أدلة غير كافية',
    description: 'الأدلة المقدمة لا تدعم الادعاء بشكل كافٍ. مطلوب أدلة إضافية أو طريقة تحقق مختلفة.',
    showPartialData: true,
    suggestedMethod: 'oral_assessment'
  },
  method_mismatch: {
    title: 'طريقة تحقق غير مناسبة',
    description: 'الطريقة المختارة لا تناسب نوع الموضوع (مثال: شهادة رسمية لمهارة عملية بدون شهادة). يُقترح تبديل الطريقة.',
    showPartialData: true,
    suggestedMethod: 'peer_confirmation'
  },
  network: {
    title: 'انقطاع الاتصال',
    description: 'لا يوجد اتصال بالإنترنت، أو خدمة التحقق غير متاحة. سيتم حفظ الطلب محلياً ويمكن إكماله لاحقاً.',
    showPartialData: true
  },
  unknown: {
    title: 'خطأ غير متوقع',
    description: 'حدث خطأ أثناء معالجة طلب التحقق. نعرض ما اكتمل ويمكنك إعادة المحاولة أو تبديل الطريقة.',
    showPartialData: true
  }
};

export const M22ErrorPage: React.FC = () => {
  const navigate = useNavigate();
  const [errorType, setErrorType] = useState<ErrorType>('unknown');
  const [retrying, setRetrying] = useState(false);

  const errorInfo = ERROR_TYPES[errorType];

  const handleRetry = async () => {
    setRetrying(true);
    await new Promise(res => setTimeout(res, 1000));
    setRetrying(false);
    navigate('/trust/overview');
  };

  const handleSwitchMethod = () => {
    if (errorInfo.suggestedMethod) {
      navigate('/trust/create');
    }
  };

  const getMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      official: 'مصدر رسمي',
      organization_link: 'رابط جهة',
      expert_review: 'مراجع خبير',
      oral_assessment: 'مقابلة شفهية',
      peer_confirmation: 'تأكيد زميل/عميل'
    };
    return labels[method] || method;
  };

  const recoveryActions = [
    {
      label: retrying ? 'جاري إعادة المحاولة...' : 'إعادة المحاولة',
      action: handleRetry,
      variant: 'proof' as const,
      icon: <RefreshCw size={16} className={retrying ? 'spin' : ''} />
    },
    {
      label: errorInfo.suggestedMethod ? `تبديل إلى: ${getMethodLabel(errorInfo.suggestedMethod)}` : 'طلب تحقق جديد',
      action: handleSwitchMethod,
      variant: 'outline' as const,
      icon: <AlertTriangle size={16} />
    },
    {
      label: 'العودة للنظرة العامة',
      action: () => navigate('/trust/overview'),
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
          onClick={() => navigate('/trust/overview')}
          leftIcon={<ArrowRight size={15} />}
        >
          العودة للنظرة العامة
        </Button>
      </div>

      <div className={styles.headerRow}>
        <div className={styles.headerContent}>
          <span className={styles.badgeQ}>M22 · Q-0871 · ⚓ Error</span>
          <span className={styles.demoBadge}>[Demo / تجريبي] محاكاة حالات خطأ تحقق</span>
          <h1 className={styles.title}>خطأ في طلب التحقق</h1>
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
            <option value="source_unreachable">🔗 جهة مصدرة غير متاحة</option>
            <option value="reviewer_unavailable">👤 مراجع غير متاح</option>
            <option value="evidence_insufficient">📄 أدلة غير كافية</option>
            <option value="method_mismatch">🔄 طريقة غير مناسبة</option>
            <option value="network">🌐 انقطاع الشبكة</option>
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
            البيانات المحفوظة والمسار البديل المقترح
          </h2>
          <p style={{ margin: '0 0 1rem', color: 'var(--ink-2)', fontSize: '0.9rem', lineHeight: 1.6 }}>
            تم حفظ طلب التحقق والبيانات المدخلة. يمكنك مراجعتها واختيار المسار البديل.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Award size={16} style={{ color: 'var(--proof)' }} />
                <span style={{ fontWeight: 600, color: 'var(--ink)' }}>React & TypeScript Architecture</span>
              </div>
              <span className={styles.verificationStatus + ' pending'}><Clock size={12} /> محفوظ محلياً</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(0, 184, 184, 0.05)', border: '1px solid rgba(0, 184, 184, 0.2)', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertTriangle size={16} style={{ color: '#F59E0B' }} />
                <span style={{ fontWeight: 600, color: 'var(--ink)' }}>طريقة بديلة مقترحة</span>
              </div>
              {errorInfo.suggestedMethod && (
                <span className={styles.verificationMethod}>
                  <ShieldCheck size={12} /> {getMethodLabel(errorInfo.suggestedMethod)}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      <div className={styles.card} style={{ marginTop: '1.5rem' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--ink)', margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={20} style={{ color: '#F59E0B' }} />
          مبدأ: نبدل الطريقة ولا نرفض تلقائياً
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '10px' }}>
            <div style={{ fontWeight: 700, color: 'var(--ink)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldCheck size={16} style={{ color: '#10B981' }} />
              فشل التحقق ≠ رفض الادعاء
            </div>
            <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--ink-2)', lineHeight: 1.6 }}>
              إذا تعذر الوصول للجهة المصدرة، أو عدم توفر المراجع، أو عدم كفاية الأدلة —
              لا نرفض الطلب تلقائياً. نقترح <strong>طريقة تحقق بديلة</strong> من الطرق الخمس،
              ونسمح للشخص بالاعتراض وتقديم دليل مضاد.
            </p>
          </div>
          <div style={{ padding: '1rem', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '10px' }}>
            <div style={{ fontWeight: 700, color: 'var(--ink)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <AlertTriangle size={16} style={{ color: '#F59E0B' }} />
              حق الاعتراض مكفول
            </div>
            <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--ink-2)', lineHeight: 1.6 }}>
              كل قرار تحقق (قبول/رفض) قابل للاعتراض. المعترض يقدم دليلاً مضاداً،
              ويعاد إسناد الطلب لمراجع آخر أو طريقة مختلفة. لا قرار نهائي بلا مسار مراجعة.
            </p>
          </div>
          <div style={{ padding: '1rem', background: 'rgba(0, 184, 184, 0.05)', border: '1px solid rgba(0, 184, 184, 0.2)', borderRadius: '10px' }}>
            <div style={{ fontWeight: 700, color: 'var(--ink)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={16} style={{ color: 'var(--proof)' }} />
              الوضع المحدود بلا إنترنت
            </div>
            <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--ink-2)', lineHeight: 1.6 }}>
              بلا اتصال: يُحفظ الطلب محلياً مع جميع البيانات. عند استعادة الاتصال،
              يُرسل تلقائياً أو يمكن إرساله يدوياً. لا فقد للتقدم.
            </p>
          </div>
        </div>
      </div>

      <div className={styles.card} style={{ marginTop: '1.5rem' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--ink)', margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Search size={20} style={{ color: 'var(--proof)' }} />
          أسباب شائعة وحلول سريعة
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ padding: '0.75rem', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
              <GitFork size={16} style={{ color: 'var(--proof)' }} />
              <strong>جهة مصدرة معطلة:</strong> جرب رابط جهة بديل (مشروع GitHub، ملف شركة) أو مراجع خبير.
            </div>
          </div>
          <div style={{ padding: '0.75rem', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
              <UserCheck size={16} style={{ color: '#10B981' }} />
              <strong>مراجع غير مستجيب:</strong> النظام يعيد الإسناد تلقائياً خلال 48 ساعة، أو اختر مراجع بديل.
            </div>
          </div>
          <div style={{ padding: '0.75rem', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
              <MessageSquare size={16} style={{ color: '#F59E0B' }} />
              <strong>أدلة ضعيفة:</strong> أضف روابط لمشاريع، أو اطلب مقابلة شفهية تقنية لشرح القرارات.
            </div>
          </div>
          <div style={{ padding: '0.75rem', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
              <Award size={16} style={{ color: '#94A3B8' }} />
              <strong>طريقة خاطئة:</strong> للشهادات استخدم "مصدر رسمي"، للمهارات العملية "مراجع خبير" أو "مقابلة شفهية".
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default M22ErrorPage;