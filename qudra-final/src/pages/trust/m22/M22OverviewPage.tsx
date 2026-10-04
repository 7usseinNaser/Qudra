import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import styles from './m22.module.css';
import { PlusCircle, Sparkles, Info, Search, ShieldCheck, Clock, AlertCircle, CheckCircle, FileText, UserCheck } from 'lucide-react';
import { M22EmptyPage } from './M22EmptyPage';

interface VerificationRequest {
  id: string;
  subject: string;
  method: string;
  status: 'VERIFIED' | 'PENDING' | 'CLAIMED' | 'REJECTED';
  reviewer: string;
  result: string;
  createdAt: string;
  updatedAt: string;
  evidenceCount: number;
}

const MOCK_REQUESTS: VerificationRequest[] = [
  {
    id: 'vr_001',
    subject: 'React & TypeScript Architecture',
    method: 'مصدر رسمي (شهادة معتمدة)',
    status: 'VERIFIED',
    reviewer: 'أحمد محمد - خبير frontend',
    result: 'مقبول - شهادة Meta Frontend Developer',
    createdAt: '2026-08-15T10:30:00Z',
    updatedAt: '2026-08-20T14:22:00Z',
    evidenceCount: 3
  },
  {
    id: 'vr_002',
    subject: 'Node.js & Express Backend',
    method: 'مراجع خبير (مراجعة كود)',
    status: 'PENDING',
    reviewer: 'سارة أحمد - Senior Backend Engineer',
    result: 'قيد المراجعة',
    createdAt: '2026-09-01T09:15:00Z',
    updatedAt: '2026-09-01T09:15:00Z',
    evidenceCount: 2
  },
  {
    id: 'vr_003',
    subject: 'Docker & Kubernetes',
    method: 'تأكيد زميل/عميل',
    status: 'CLAIMED',
    reviewer: '—',
    result: 'مُعلن ذاتياً — بانتظار تحقق',
    createdAt: '2026-09-10T16:45:00Z',
    updatedAt: '2026-09-10T16:45:00Z',
    evidenceCount: 0
  },
  {
    id: 'vr_004',
    subject: 'PostgreSQL & Database Design',
    method: 'مقابلة شفهية تقنية',
    status: 'REJECTED',
    reviewer: 'د. محمد علي - أستاذ قواعد بيانات',
    result: 'مرفوض - فجوات في فهم الفهرسة المتقدمة',
    createdAt: '2026-07-20T11:00:00Z',
    updatedAt: '2026-07-25T13:30:00Z',
    evidenceCount: 1
  }
];

export const M22OverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showExplain, setShowExplain] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await new Promise(res => setTimeout(res, 400));
      setRequests(MOCK_REQUESTS);
      setLoading(false);
    };
    loadData();
  }, []);

  const total = requests.length;
  const verified = requests.filter(r => r.status === 'VERIFIED').length;
  const pending = requests.filter(r => r.status === 'PENDING').length;
  const claimed = requests.filter(r => r.status === 'CLAIMED').length;
  const rejected = requests.filter(r => r.status === 'REJECTED').length;
  const verifiedPct = total > 0 ? Math.round((verified / total) * 100) : 0;
  const avgTurnaround = '3.2 أيام';
  const disputeRate = '12%';

  if (loading) {
    return (
      <div className={styles.container} dir="rtl">
        <div className={styles.loadingState}>
          <div className={styles.spinner} />
          <span>جاري تحميل طلبات التحقق...</span>
        </div>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className={styles.container} dir="rtl">
        <M22EmptyPage />
      </div>
    );
  }

  return (
    <div className={styles.container} dir="rtl">
      <div className={styles.headerRow}>
        <div className={styles.headerContent}>
          <span className={styles.badgeQ}>M22 · Q-0841 · ⚓ Overview</span>
          <span className={styles.demoBadge}>[Demo / تجريبي] بيانات تحقق محاكاة</span>
          <h1 className={styles.title}>التحقق والثقة: نظرة عامة</h1>
          <p className={styles.subtitle}>
            ملخص طلبات التحقق بحسب: الموضوع، الطريقة، الحالة، المراجع، والنتيجة.
            كل رقم قابل للفتح للدليل خلفه — طرق التحقق: مصدر رسمي، رابط جهة، مراجع خبير، مقابلة شفهية، تأكيد زميل/عميل.
          </p>
        </div>

        <div className={styles.actionRow}>
          <Button
            variant="proof"
            size="md"
            onClick={() => navigate('/trust/create')}
            leftIcon={<PlusCircle size={16} />}
          >
            طلب تحقق جديد
          </Button>

          <Button
            variant="outline"
            size="md"
            onClick={() => setShowExplain(!showExplain)}
            leftIcon={<Sparkles size={16} />}
          >
            {showExplain ? 'إخفاء التفسير' : 'اشرح لي: طبقات التحقق'}
          </Button>
        </div>
      </div>

      {showExplain && (
        <div className={styles.explainDrawer}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
            <Info size={18} color="var(--proof)" />
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: 'var(--ink)' }}>
              تفسير الذكاء الاصطناعي: منهجية التحقق والثقة
            </h3>
          </div>
          <p style={{ margin: '0 0 1rem', fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--ink-2)' }}>
            التحقق في قُدرة ليس ثنائياً (مُتحقق/غير مُتحقق) — بل طبقات: <strong>Official</strong> (OAuth رسمي/شهادة معتمدة)،
            <strong>User-supplied</strong> (PAT/رابط مشروع)، <strong>Expert-reviewed</strong> (مراجعة خبير)،
            <strong>Peer-confirmed</strong> (تأكيد زميل/عميل). كل طبقة لها وزن ثقة مختلف.
            <strong>الادعاء (Claimed)</strong> يظل ادعاءً حتى يُسند بطريقة تحقق.
          </p>
          <div className={styles.grid3} style={{ marginBottom: 0 }}>
            <div className={styles.metricBox}>
              <span className={styles.metricLabel}>طرق التحقق الخمسة</span>
              <span className={styles.metricHint}>مصدر رسمي، رابط جهة، مراجع خبير، مقابلة شفهية، تأكيد زميل/عميل</span>
            </div>
            <div className={styles.metricBox}>
              <span className={styles.metricLabel}>Proven ≠ Claimed</span>
              <span className={styles.metricHint}>فصل بصري ومنطقي دائم — الادعاء لا يمنح مستوى ثقة</span>
            </div>
            <div className={styles.metricBox}>
              <span className={styles.metricLabel}>قابلية الاعتراض</span>
              <span className={styles.metricHint}>كل قرار تحقق قابل للاعتراض مع تقديم دليل مضاد</span>
            </div>
          </div>
        </div>
      )}

      <div className={styles.grid3}>
        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>معدل التحقق Verification Rate</span>
          <span className={styles.metricValue}><span className="num">{verifiedPct}</span>%</span>
          <span className={styles.metricHint}>
            {verified} من {total} طلبات مُتحققة
          </span>
        </div>

        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>متوسط وقت الإنجاز Turnaround</span>
          <span className={styles.metricValue}><span className="num">{avgTurnaround}</span></span>
          <span className={styles.metricHint}>من الطلب إلى النتيجة النهائية</span>
        </div>

        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>معدل الاعتراض Dispute Rate</span>
          <span className={styles.metricValue}><span className="num">{disputeRate}</span></span>
          <span className={styles.metricHint}>نسبة الطلبات المعترض عليها</span>
        </div>

        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>مُتحقق (Verified)</span>
          <span className={styles.metricValue} style={{ color: '#10B981' }}><span className="num">{verified}</span></span>
          <span className={styles.metricHint}>شهادات موثوقة</span>
        </div>

        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>قيد المراجعة (Pending)</span>
          <span className={styles.metricValue} style={{ color: '#F59E0B' }}><span className="num">{pending}</span></span>
          <span className={styles.metricHint}>بانتظار المراجع</span>
        </div>

        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>مُعلن (Claimed)</span>
          <span className={styles.metricValue} style={{ color: '#94A3B8' }}><span className="num">{claimed}</span></span>
          <span className={styles.metricHint}>بانتظار طريقة تحقق</span>
        </div>

        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>مرفوض (Rejected)</span>
          <span className={styles.metricValue} style={{ color: '#EF4444' }}><span className="num">{rejected}</span></span>
          <span className={styles.metricHint}>مع سبب الرفض ومسار بديل</span>
        </div>
      </div>

      <div className={styles.card}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--ink)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Search size={22} style={{ color: 'var(--proof)' }} />
          أحدث طلبات التحقق
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {requests.map(request => (
            <div key={request.id} className={styles.repoCard}>
              <div className={styles.repoCardHeader}>
                <div>
                  <h3 className={styles.repoName}>{request.subject}</h3>
                  <span className={styles.verificationMethod}>
                    <ShieldCheck size={12} /> {request.method}
                  </span>
                </div>
                <span className={styles.verificationStatus + ' ' + request.status.toLowerCase()}>
                  {request.status === 'VERIFIED' && <CheckCircle size={12} />}
                  {request.status === 'PENDING' && <Clock size={12} />}
                  {request.status === 'CLAIMED' && <AlertCircle size={12} />}
                  {request.status === 'REJECTED' && <AlertCircle size={12} />}
                  {request.status === 'VERIFIED' && 'مُتحقق'}
                  {request.status === 'PENDING' && 'قيد المراجعة'}
                  {request.status === 'CLAIMED' && 'مُعلن'}
                  {request.status === 'REJECTED' && 'مرفوض'}
                </span>
              </div>

              <div className={styles.repoMeta}>
                <span className={styles.repoMetaItem}>
                  <UserCheck size={14} /> المراجع: {request.reviewer}
                </span>
                <span className={styles.repoMetaItem}>
                  <FileText size={14} /> أدلة: {request.evidenceCount}
                </span>
                <span className={styles.repoMetaItem}>
                  <Clock size={14} /> تحديث: {new Date(request.updatedAt).toLocaleDateString('ar-EG')}
                </span>
              </div>

              <p className={styles.repoDescription}>{request.result}</p>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                <Button variant="outline" size="sm" onClick={() => navigate(`/trust/details/${request.id}`)}>
                  <FileText size={14} /> عرض التفاصيل
                </Button>
                {request.status === 'CLAIMED' && (
                  <Button variant="proof" size="sm" onClick={() => navigate('/trust/create')}>
                    <ShieldCheck size={14} /> إضافة طريقة تحقق
                  </Button>
                )}
                {request.status === 'REJECTED' && (
                  <Button variant="outline" size="sm" onClick={() => navigate('/trust/create')}>
                    <AlertCircle size={14} /> اعتراض / طريقة بديلة
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {requests.length > 5 && (
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <Button variant="ghost" size="sm" onClick={() => navigate('/trust/create')}>
              عرض جميع الطلبات ({requests.length})
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default M22OverviewPage;