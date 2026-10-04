import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import styles from './m22.module.css';
import { ArrowRight, CheckCircle, ShieldCheck, Award, FileText, UserCheck, Clock, AlertCircle, AlertTriangle, Sparkles } from 'lucide-react';

interface VerificationResult {
  id: string;
  subject: string;
  method: string;
  status: 'VERIFIED' | 'PENDING' | 'CLAIMED' | 'REJECTED';
  reviewer: string;
  result: string;
  evidenceCount: number;
  trustLevel: 'Official' | 'User-supplied' | 'Expert-reviewed' | 'Peer-confirmed';
  trustScore: number;
  createdAt: string;
}

const MOCK_RESULTS: VerificationResult[] = [
  {
    id: 'vr_001',
    subject: 'React & TypeScript Architecture',
    method: 'مصدر رسمي (شهادة معتمدة)',
    status: 'VERIFIED',
    reviewer: 'أحمد محمد - خبير Frontend معتمد',
    result: 'مقبول - شهادة Meta Frontend Developer معتمدة + مشروع موثق',
    evidenceCount: 3,
    trustLevel: 'Official',
    trustScore: 95,
    createdAt: '2026-08-15T10:30:00Z'
  },
  {
    id: 'vr_002',
    subject: 'Node.js & Express Backend',
    method: 'مراجع خبير (مراجعة كود)',
    status: 'PENDING',
    reviewer: 'سارة أحمد - Senior Backend Engineer',
    result: 'قيد المراجعة - تم استلام الكود، المراجعة جارية',
    evidenceCount: 2,
    trustLevel: 'Expert-reviewed',
    trustScore: 78,
    createdAt: '2026-09-01T09:15:00Z'
  },
  {
    id: 'vr_003',
    subject: 'Docker & Kubernetes',
    method: 'تأكيد زميل/عميل',
    status: 'CLAIMED',
    reviewer: '—',
    result: 'مُعلن ذاتياً — يحتاج طريقة تحقق لرفع الثقة',
    evidenceCount: 0,
    trustLevel: 'Peer-confirmed',
    trustScore: 25,
    createdAt: '2026-09-10T16:45:00Z'
  },
  {
    id: 'vr_004',
    subject: 'PostgreSQL & Database Design',
    method: 'مقابلة شفهية تقنية',
    status: 'REJECTED',
    reviewer: 'د. محمد علي - أستاذ قواعد بيانات',
    result: 'مرفوض - فجوات في الفهرسة المتقدمة، مسار بديل مقترح: مراجعة خبير للكود',
    evidenceCount: 1,
    trustLevel: 'Expert-reviewed',
    trustScore: 40,
    createdAt: '2026-07-20T11:00:00Z'
  }
];

export const M22ResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState<VerificationResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResults = async () => {
      setLoading(true);
      await new Promise(res => setTimeout(res, 400));
      setResults(MOCK_RESULTS);
      setLoading(false);
    };
    loadResults();
  }, []);

  if (loading) {
    return (
      <div className={styles.container} dir="rtl">
        <div className={styles.loadingState}>
          <div className={styles.spinner} />
          <span>جاري تحميل نتائج التحقق...</span>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className={styles.container} dir="rtl">
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📋</div>
          <h2 className={styles.emptyTitle}>لا توجد نتائج تحقق</h2>
          <p className={styles.emptyDesc}>
            لم يتم إنشاء أي طلب تحقق بعد. ابدأ بطلب تحقق جديد لرفع ثقة مهاراتك.
          </p>
          <Button variant="proof" size="md" onClick={() => navigate('/trust/create')} leftIcon={<ShieldCheck size={16} />}>
            طلب تحقق جديد
          </Button>
        </div>
      </div>
    );
  }

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

        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/trust/create')}
            leftIcon={<ShieldCheck size={14} />}
          >
            طلب تحقق جديد
          </Button>
        </div>
      </div>

      <div className={styles.headerRow}>
        <div className={styles.headerContent}>
          <span className={styles.badgeQ}>M22 · Q-0847 · ⚓ Results</span>
          <span className={styles.demoBadge}>[Demo / تجريبي] نتائج تحقق محاكاة</span>
          <h1 className={styles.title}>نتائج طلبات التحقق</h1>
          <p className={styles.subtitle}>
            بطاقات نتيجة مع سبب كل نتيجة: الموضوع، الطريقة، الحالة، المراجع، والنتيجة.
            كل نتيجة مرتبطة بدليل يمكن فتحه — التحقق: طرق: مصدر رسمي، رابط جهة، مراجع خبير، مقابلة شفهية، تأكيد زميل/عميل.
            لا ترتيب بلا تعليل.
          </p>
        </div>

        <div className={styles.actionRow}>
          <Button
            variant="proof"
            size="md"
            onClick={() => navigate('/trust/create')}
            leftIcon={<ShieldCheck size={16} />}
          >
            طلب تحقق جديد
          </Button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {results.map((result) => (
          <div key={result.id} className={styles.resultCard}>
            <div className={styles.resultCardHeader}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                  <Award size={20} style={{ color: 'var(--proof)' }} />
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--ink)' }}>
                    {result.subject}
                  </h3>
                  <span className={styles.verificationMethod}>
                    {result.method}
                  </span>
                  <span className={styles.verificationStatus + ' ' + result.status.toLowerCase()}>
                    {result.status === 'VERIFIED' && <CheckCircle size={12} />}
                    {result.status === 'PENDING' && <Clock size={12} />}
                    {result.status === 'CLAIMED' && <AlertCircle size={12} />}
                    {result.status === 'REJECTED' && <AlertCircle size={12} />}
                    {result.status === 'VERIFIED' && 'مُتحقق'}
                    {result.status === 'PENDING' && 'قيد المراجعة'}
                    {result.status === 'CLAIMED' && 'مُعلن'}
                    {result.status === 'REJECTED' && 'مرفوض'}
                  </span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.82rem', color: 'var(--ink-2)' }}>
                  <span><UserCheck size={12} /> المراجع: {result.reviewer}</span>
                  <span><FileText size={12} /> أدلة: {result.evidenceCount}</span>
                  <span>
                    <ShieldCheck size={12} /> ثقة: <strong className="num">{result.trustScore}%</strong> ({result.trustLevel})
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <Button variant="outline" size="sm" onClick={() => navigate(`/trust/details/${result.id}`)}>
                  <FileText size={14} /> التفاصيل
                </Button>
                {result.status === 'CLAIMED' && (
                  <Button variant="proof" size="sm" onClick={() => navigate('/trust/create')}>
                    <ShieldCheck size={14} /> إضافة تحقق
                  </Button>
                )}
                {result.status === 'REJECTED' && (
                  <Button variant="outline" size="sm" onClick={() => navigate('/trust/create')}>
                    <AlertTriangle size={14} /> اعتراض / بديل
                  </Button>
                )}
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontWeight: 600, color: 'var(--ink)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                النتيجة والسبب
              </div>
              <p style={{ margin: 0, color: 'var(--ink-2)', lineHeight: 1.6, fontSize: '0.9rem' }}>
                {result.result}
              </p>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
              <span className={styles.verificationMethod} style={{ fontSize: '0.75rem' }}>
                <ShieldCheck size={12} /> {result.trustLevel}
              </span>
              <span className={styles.verificationMethod} style={{ fontSize: '0.75rem', background: 'rgba(0, 184, 184, 0.1)', borderColor: 'rgba(0, 184, 184, 0.3)', color: 'var(--proof)' }}>
                <Award size={12} /> ثقة: {result.trustScore}%
              </span>
              {result.status === 'VERIFIED' && (
                <span className={styles.verificationMethod} style={{ fontSize: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.3)', color: '#10B981' }}>
                  <CheckCircle size={12} /> Proven ✓
                </span>
              )}
              {result.status === 'CLAIMED' && (
                <span className={styles.verificationMethod} style={{ fontSize: '0.75rem', background: 'rgba(148, 163, 184, 0.1)', borderColor: 'rgba(148, 163, 184, 0.3)', color: '#94A3B8' }}>
                  <AlertCircle size={12} /> Claimed (يتطلب تحقق)
                </span>
              )}
            </div>

            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1rem' }}>
              <a
                href={`/trust/details/${result.id}`}
                style={{
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'var(--proof)',
                  padding: '0.5rem 1rem',
                  border: '1px solid rgba(0, 184, 184, 0.3)',
                  borderRadius: '8px',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(0, 184, 184, 0.1)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <FileText size={14} /> عرض التفاصيل الكاملة والأدلة
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.card} style={{ marginTop: '1.5rem' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--ink)', margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={22} style={{ color: '#F59E0B' }} />
          الخطوات التالية
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ flex: 1, minWidth: '250px', padding: '1rem', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '10px' }}>
            <div style={{ fontWeight: 700, color: 'var(--ink)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle size={16} style={{ color: '#10B981' }} />
              طلبات مُتحققة
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--ink-2)', lineHeight: 1.6 }}>
              {results.filter(r => r.status === 'VERIFIED').length} طلبات مُتحققة تظهر في جواز القدرات كدليل Proven.
              يمكن مشاركتها في Passport مع شارة التحقق والطريقة والتاريخ.
            </p>
          </div>
          <div style={{ flex: 1, minWidth: '250px', padding: '1rem', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '10px' }}>
            <div style={{ fontWeight: 700, color: 'var(--ink)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Clock size={16} style={{ color: '#F59E0B' }} />
              قيد المراجعة
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--ink-2)', lineHeight: 1.6 }}>
              {results.filter(r => r.status === 'PENDING').length} طلبات بانتظار المراجع.
              يمكنك متابعة الحالة من النظرة العامة أو صفحة التفاصيل.
            </p>
          </div>
          <div style={{ flex: 1, minWidth: '250px', padding: '1rem', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '10px' }}>
            <div style={{ fontWeight: 700, color: 'var(--ink)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <AlertTriangle size={16} style={{ color: '#EF4444' }} />
              تحتاج إجراء
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--ink-2)', lineHeight: 1.6 }}>
              {results.filter(r => r.status === 'CLAIMED' || r.status === 'REJECTED').length} طلبات تحتاج طريقة تحقق أو اعتراض.
              راجع التفاصيل واختر المسار البديل المناسب.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default M22ResultsPage;