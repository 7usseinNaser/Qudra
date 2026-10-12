import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import styles from './m17.module.css';
import { ROUTES } from '../../../constants/routes';
import { ArrowRight, RefreshCw, ShieldCheck, AlertTriangle, Target, Clock, Sparkles, WifiOff, Server, Database, Bug } from 'lucide-react';

type ErrorType = 'no_match' | 'api_failed' | 'network' | 'invalid_data' | 'rate_limited' | 'unknown';

const ERROR_TYPES: Record<ErrorType, { title: string; description: string; icon: React.ReactNode; suggestedAction?: string }> = {
  no_match: {
    title: 'لا توجد فرص مطابقة',
    description: 'محرك المطابقة لم يعثر على فرص متوافقة مع ملفك المهاري الحالي. هذا ليس خطأ — بل مؤشر لبناء ملف أقوى.',
    icon: <Target size={48} style={{ color: '#F59E0B' }} />,
    suggestedAction: 'بناء ملف مهاري أقوى'
  },
  api_failed: {
    title: 'تعذر الاتصال بخدمة الفرص',
    description: 'خدمة سوق الفرص غير متاحة مؤقتاً. البيانات المحفوظة محلياً ستظهر، ويمكنك إعادة المحاولة لاحقاً.',
    icon: <Server size={48} style={{ color: '#EF4444' }} />,
    suggestedAction: 'إعادة المحاولة'
  },
  network: {
    title: 'انقطاع الاتصال',
    description: 'لا يوجد اتصال بالإنترنت. سيتم عرض الفرص المخزنة محلياً. عند استعادة الاتصال، ستتحديث القائمة تلقائياً.',
    icon: <WifiOff size={48} style={{ color: '#F59E0B' }} />,
    suggestedAction: 'التحقق من الاتصال'
  },
  invalid_data: {
    title: 'بيانات فرصة تالفة',
    description: 'بيانات إحدى الفرص غير مكتملة أو تالفة. تم استبعادها من القائمة. فريق التطوير تم إشعاره.',
    icon: <Database size={48} style={{ color: '#EF4444' }} />,
    suggestedAction: 'تحديث الصفحة'
  },
  rate_limited: {
    title: 'تجاوز حد الطلبات',
    description: 'تم إرسال طلبات كثيرة في وقت قصير. يرجى الانتظار قليلاً قبل المحاولة مرة أخرى.',
    icon: <Clock size={48} style={{ color: '#F59E0B' }} />,
    suggestedAction: 'انتظار وإعادة المحاولة'
  },
  unknown: {
    title: 'خطأ غير متوقع',
    description: 'حدث خطأ غير متوقع أثناء تحميل الفرص. نعرض ما توفر ونسمح بإعادة المحاولة.',
    icon: <Bug size={48} style={{ color: '#94A3B8' }} />,
    suggestedAction: 'إعادة المحاولة'
  }
};

export const M17ErrorPage: React.FC = () => {
  const navigate = useNavigate();
  const [errorType, setErrorType] = useState<ErrorType>('unknown');
  const [retrying, setRetrying] = useState(false);

  const errorInfo = ERROR_TYPES[errorType];

  const handleRetry = async () => {
    setRetrying(true);
    await new Promise(res => setTimeout(res, 1000));
    setRetrying(false);
    // In real app, would reload data
  };

  const handleSuggestedAction = () => {
    switch (errorType) {
      case 'no_match':
        navigate('/profile/sources/github');
        break;
      case 'api_failed':
      case 'network':
      case 'rate_limited':
      case 'unknown':
        handleRetry();
        break;
      case 'invalid_data':
        window.location.reload();
        break;
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
      label: errorInfo.suggestedAction || 'إجراء مقترح',
      action: handleSuggestedAction,
      variant: 'outline' as const,
      icon: <AlertTriangle size={16} />
    },
    {
      label: 'العودة للفرص',
      action: () => navigate(ROUTES.M17_OVERVIEW),
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
          onClick={() => navigate(ROUTES.M17_OVERVIEW)}
          leftIcon={<ArrowRight size={15} />}
        >
          العودة للفرص
        </Button>
      </div>

      <div className={styles.headerRow}>
        <div className={styles.headerContent}>
          <span className={styles.badgeQ}>M17 · Q-0671 · ⚓ Error</span>
          <span className={styles.demoBadge}>[Demo / تجريبي] محاكاة حالات خطأ</span>
          <h1 className={styles.title}>خطأ في تحميل الفرص</h1>
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
            <option value="no_match">🎯 لا توجد فرص مطابقة</option>
            <option value="api_failed">🔧 خدمة الفرص معطلة</option>
            <option value="network">🌐 انقطاع الاتصال</option>
            <option value="invalid_data">💾 بيانات تالفة</option>
            <option value="rate_limited">⏱️ تجاوز حد الطلبات</option>
            <option value="unknown">❓ خطأ غير معروف</option>
          </select>
        </div>
      </div>

      <div className={styles.errorState}>
        {errorInfo.icon}
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

      <div className={styles.card} style={{ marginTop: '1.5rem' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--ink)', margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck size={20} style={{ color: '#10B981' }} />
          البيانات المحفوظة محلياً
        </h2>
        <p style={{ margin: '0 0 1rem', color: 'var(--ink-2)', fontSize: '0.9rem', lineHeight: 1.6 }}>
          حتى مع الخطأ، الفرص التي تم تحميلها سابقاً مخزنة في متصفحك وتظهر في الوضع غير المتصل.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Target size={16} style={{ color: 'var(--proof)' }} />
              <span style={{ fontWeight: 600, color: 'var(--ink)' }}>فرص مخزنة محلياً</span>
            </div>
            <span className="verification-status pending"><Clock size={12} /> متاحة أوفلاين</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(0, 184, 184, 0.05)', border: '1px solid rgba(0, 184, 184, 0.2)', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={16} style={{ color: 'var(--proof)' }} />
              <span style={{ fontWeight: 600, color: 'var(--ink)' }}>المزامنة التلقائية</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--ink-2)' }}>عند استعادة الاتصال</span>
          </div>
        </div>
      </div>

      <div className={styles.card} style={{ marginTop: '1.5rem' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--ink)', margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={20} style={{ color: '#F59E0B' }} />
          مبدأ: نعرض ما توفر ولا نمنع التقدم
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '10px' }}>
            <div style={{ fontWeight: 700, color: 'var(--ink)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldCheck size={16} style={{ color: '#10B981' }} />
              فشل التحميل ≠ منع الوصول
            </div>
            <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--ink-2)', lineHeight: 1.6 }}>
              إذا تعذر جلب أحدث الفرص، نعرض المخزن محلياً. المستخدم يستمر في العمل،
              والمزامنة تحدث في الخلفية عند توفر الخدمة.
            </p>
          </div>
          <div style={{ padding: '1rem', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '10px' }}>
            <div style={{ fontWeight: 700, color: 'var(--ink)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <AlertTriangle size={16} style={{ color: '#F59E0B' }} />
              لا مطابقة = فرصة لبناء الملف
            </div>
            <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--ink-2)', lineHeight: 1.6 }}>
              «لا توجد فرص مطابقة» ليس خطأ — هو إشارة واضحة: ملفك يحتاج قدرات أكثر إثباتاً.
              راجع Gap Analyzer وابنِ خطة نمو.
            </p>
          </div>
          <div style={{ padding: '1rem', background: 'rgba(0, 184, 184, 0.05)', border: '1px solid rgba(0, 184, 184, 0.2)', borderRadius: '10px' }}>
            <div style={{ fontWeight: 700, color: 'var(--ink)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={16} style={{ color: 'var(--proof)' }} />
              وضع أوفلاين كامل
            </div>
            <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--ink-2)', lineHeight: 1.6 }}>
              بلا إنترنت: تُعرض الفرص المخزنة، يمكن تصفح التفاصيل، وتقديم الطلبات يُحفظ محلياً
              ويرسل عند استعادة الاتصال. لا فقد للتقدم أبداً.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default M17ErrorPage;