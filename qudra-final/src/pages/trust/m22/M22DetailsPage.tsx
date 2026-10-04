import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import styles from './m22.module.css';
import { ArrowRight, ShieldCheck, Clock, AlertCircle, CheckCircle, FileText, UserCheck, Award, ExternalLink, AlertTriangle } from 'lucide-react';

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
  evidenceDetails: { title: string; type: string; url?: string; strength: number }[];
  history: { date: string; action: string; actor: string; details: string }[];
}

const MOCK_REQUESTS: Record<string, VerificationRequest> = {
  'vr_001': {
    id: 'vr_001',
    subject: 'React & TypeScript Architecture',
    method: 'مصدر رسمي (شهادة معتمدة)',
    status: 'VERIFIED',
    reviewer: 'أحمد محمد - خبير Frontend معتمد',
    result: 'مقبول - شهادة Meta Frontend Developer معتمدة',
    createdAt: '2026-08-15T10:30:00Z',
    updatedAt: '2026-08-20T14:22:00Z',
    evidenceCount: 3,
    evidenceDetails: [
      { title: 'شهادة Meta Frontend Developer', type: 'شهادة رسمية', url: 'https://coursera.org/verify/xyz', strength: 95 },
      { title: 'مشروع React إنتاجي - منصة تجارة إلكترونية', type: 'مشروع موثق', url: 'https://github.com/user/ecommerce', strength: 88 },
      { title: 'مراجعة كود من Tech Lead', type: 'مراجعة خبير', strength: 82 }
    ],
    history: [
      { date: '2026-08-15', action: 'إنشاء الطلب', actor: 'النظام', details: 'طلب تحقق بمصدر رسمي' },
      { date: '2026-08-18', action: 'تعيين مراجع', actor: 'أحمد محمد', details: 'خبير Frontend معتمد' },
      { date: '2026-08-20', action: 'قبول', actor: 'أحمد محمد', details: 'الشهادة معتمدة، المشروع موثق' }
    ]
  },
  'vr_002': {
    id: 'vr_002',
    subject: 'Node.js & Express Backend',
    method: 'مراجع خبير (مراجعة كود)',
    status: 'PENDING',
    reviewer: 'سارة أحمد - Senior Backend Engineer',
    result: 'قيد المراجعة - تم استلام الكود للمراجعة',
    createdAt: '2026-09-01T09:15:00Z',
    updatedAt: '2026-09-01T09:15:00Z',
    evidenceCount: 2,
    evidenceDetails: [
      { title: 'API مشروع إدارة المهام', type: 'مشروع موثق', url: 'https://github.com/user/task-api', strength: 78 },
      { title: 'اختبارات وحدة وتكاملة', type: 'دليل تقني', strength: 72 }
    ],
    history: [
      { date: '2026-09-01', action: 'إنشاء الطلب', actor: 'النظام', details: 'طلب تحقق بمراجع خبير' },
      { date: '2026-09-01', action: 'تعيين مراجع', actor: 'سارة أحمد', details: 'Senior Backend Engineer' }
    ]
  },
  'vr_003': {
    id: 'vr_003',
    subject: 'Docker & Kubernetes',
    method: 'تأكيد زميل/عميل',
    status: 'CLAIMED',
    reviewer: '—',
    result: 'مُعلن ذاتياً — بانتظار طريقة تحقق',
    createdAt: '2026-09-10T16:45:00Z',
    updatedAt: '2026-09-10T16:45:00Z',
    evidenceCount: 0,
    evidenceDetails: [],
    history: [
      { date: '2026-09-10', action: 'إعلان ذاتي', actor: 'المستخدم', details: 'إعلان مهارة بدون تحقق' }
    ]
  },
  'vr_004': {
    id: 'vr_004',
    subject: 'PostgreSQL & Database Design',
    method: 'مقابلة شفهية تقنية',
    status: 'REJECTED',
    reviewer: 'د. محمد علي - أستاذ قواعد بيانات',
    result: 'مرفوض - فجوات في فهم الفهرسة المتقدمة والتحسين',
    createdAt: '2026-07-20T11:00:00Z',
    updatedAt: '2026-07-25T13:30:00Z',
    evidenceCount: 1,
    evidenceDetails: [
      { title: 'تصميم قاعدة بيانات مشروع سابق', type: 'مشروع موثق', strength: 65 }
    ],
    history: [
      { date: '2026-07-20', action: 'إنشاء الطلب', actor: 'النظام', details: 'طلب تحقق بمقابلة شفهية' },
      { date: '2026-07-22', action: 'إجراء المقابلة', actor: 'د. محمد علي', details: 'مقابلة تقنية 45 دقيقة' },
      { date: '2026-07-25', action: 'رفض', actor: 'د. محمد علي', details: 'فجوات في الفهرسة المتقدمة، تحسين الاستعلامات' }
    ]
  }
};

export const M22DetailsPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [request, setRequest] = useState<VerificationRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const loadRequest = async () => {
      setLoading(true);
      await new Promise(res => setTimeout(res, 300));
      const found = MOCK_REQUESTS[id || ''];
      if (found) {
        setRequest(found);
      } else {
        setNotFound(true);
      }
      setLoading(false);
    };
    loadRequest();
  }, [id]);

  if (loading) {
    return (
      <div className={styles.container} dir="rtl">
        <div className={styles.loadingState}>
          <div className={styles.spinner} />
          <span>جاري تحميل تفاصيل طلب التحقق...</span>
        </div>
      </div>
    );
  }

  if (notFound || !request) {
    return (
      <div className={styles.container} dir="rtl">
        <div className={styles.errorState}>
          <AlertCircle className={styles.errorIcon} size={48} />
          <h2 className={styles.errorTitle}>طلب التحقق غير موجود</h2>
          <p className={styles.errorDesc}>تعذر العثور على طلب التحقق المطلوب.</p>
          <div className={styles.recoveryActions}>
            <Button variant="proof" size="md" onClick={() => navigate('/trust/overview')}>
              العودة للنظرة العامة
            </Button>
            <Button variant="outline" size="md" onClick={() => navigate('/trust/create')}>
              طلب تحقق جديد
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'VERIFIED': return <CheckCircle size={12} />;
      case 'PENDING': return <Clock size={12} />;
      case 'CLAIMED': return <AlertCircle size={12} />;
      case 'REJECTED': return <AlertCircle size={12} />;
      default: return <AlertCircle size={12} />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'VERIFIED': return 'مُتحقق';
      case 'PENDING': return 'قيد المراجعة';
      case 'CLAIMED': return 'مُعلن';
      case 'REJECTED': return 'مرفوض';
      default: return status;
    }
  };

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

      <div className={styles.card} style={{ marginBottom: '1.5rem' }}>
        <div className={styles.repoCardHeader}>
          <div>
            <h1 className={styles.repoName}>{request.subject}</h1>
            <span className={styles.verificationMethod}>
              <ShieldCheck size={12} /> {request.method}
            </span>
          </div>
          <span className={styles.verificationStatus + ' ' + request.status.toLowerCase()}>
            {getStatusIcon(request.status)}
            {getStatusLabel(request.status)}
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
            <Clock size={14} /> إنشاء: {new Date(request.createdAt).toLocaleDateString('ar-EG')}
          </span>
          <span className={styles.repoMetaItem}>
            <Clock size={14} /> تحديث: {new Date(request.updatedAt).toLocaleDateString('ar-EG')}
          </span>
        </div>

        <p className={styles.repoDescription}>{request.result}</p>
      </div>

      <div className={styles.tabsBar}>
        <button className={`${styles.tabBtn} ${styles.active}`}>
          <FileText size={17} /> التفاصيل والنتيجة
        </button>
        <button className={styles.tabBtn}>
          <Award size={17} /> الأدلة المرتبطة
        </button>
        <button className={styles.tabBtn}>
          <Clock size={17} /> السجل والتاريخ
        </button>
        <button className={styles.tabBtn}>
          <AlertTriangle size={17} /> الاعتراض والمسار البديل
        </button>
      </div>

      <div className={styles.detailSection}>
        <h3 className={styles.detailSectionTitle}>
          <ShieldCheck size={18} style={{ color: '#10B981' }} />
          معلومات التحقق الأساسية
        </h3>
        <div className={styles.detailGrid}>
          <div className={styles.detailItem}>
            <div className={styles.detailItemLabel}>الموضوع (Subject)</div>
            <div className={styles.detailItemValue}>{request.subject}</div>
          </div>
          <div className={styles.detailItem}>
            <div className={styles.detailItemLabel}>طريقة التحقق (Method)</div>
            <div className={styles.detailItemValue}>{request.method}</div>
          </div>
          <div className={styles.detailItem}>
            <div className={styles.detailItemLabel}>الحالة (Status)</div>
            <div className={styles.detailItemValue}>
              <span className={styles.verificationStatus + ' ' + request.status.toLowerCase()}>
                {getStatusIcon(request.status)} {getStatusLabel(request.status)}
              </span>
            </div>
          </div>
          <div className={styles.detailItem}>
            <div className={styles.detailItemLabel}>المراجع (Reviewer)</div>
            <div className={styles.detailItemValue}>{request.reviewer}</div>
          </div>
          <div className={styles.detailItem}>
            <div className={styles.detailItemLabel}>النتيجة (Result)</div>
            <div className={styles.detailItemValue}>{request.result}</div>
          </div>
          <div className={styles.detailItem}>
            <div className={styles.detailItemLabel}>عدد الأدلة</div>
            <div className={styles.detailItemValue}><span className="num">{request.evidenceCount}</span></div>
          </div>
        </div>
      </div>

      <div className={styles.detailSection}>
        <h3 className={styles.detailSectionTitle}>
          <Award size={18} style={{ color: '#F59E0B' }} />
          الأدلة المرتبطة (Evidence)
        </h3>
        {request.evidenceDetails.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {request.evidenceDetails.map((evidence, idx) => (
              <div key={idx} style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--ink)', marginBottom: '0.25rem' }}>{evidence.title}</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--ink-2)' }}>
                      النوع: {evidence.type} · القوة: <span className="num">{evidence.strength}%</span>
                    </div>
                  </div>
                  {evidence.url && (
                    <a href={evidence.url} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--proof)', padding: '0.35rem 0.7rem', border: '1px solid rgba(0, 184, 184, 0.3)', borderRadius: '8px', background: 'rgba(0, 184, 184, 0.05)' }}>
                      <ExternalLink size={12} /> فتح الدليل
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--ink-2)', background: 'rgba(255, 255, 255, 0.02)', border: '1px dashed rgba(255, 255, 255, 0.1)', borderRadius: '10px' }}>
            <AlertCircle size={24} style={{ color: '#F59E0B', marginBottom: '0.5rem' }} />
            <div>لا توجد أدلة مرتبطة بهذا الطلب</div>
            {request.status === 'CLAIMED' && (
              <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem' }}>
                هذا الطلب في حالة «مُعلن» — يحتاج طريقة تحقق لإضافة أدلة.
              </p>
            )}
          </div>
        )}
      </div>

      <div className={styles.detailSection}>
        <h3 className={styles.detailSectionTitle}>
          <Clock size={18} style={{ color: 'var(--proof)' }} />
          السجل الزمني (History)
        </h3>
        <div className={styles.historyList}>
          {request.history.map((item, idx) => (
            <div key={idx} className={styles.historyItem}>
              <span className={styles.historyDate}>{new Date(item.date).toLocaleDateString('ar-EG')}</span>
              <div className={styles.historyContent}>
                <div className={styles.historyAction}>{item.action}</div>
                <div className={styles.historyMeta}>بواسطة {item.actor} · {item.details}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.detailSection}>
        <h3 className={styles.detailSectionTitle}>
          <AlertTriangle size={18} style={{ color: '#EF4444' }} />
          الاعتراض والمسار البديل
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '10px', padding: '1rem' }}>
            <div style={{ fontWeight: 700, color: 'var(--ink)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldCheck size={16} style={{ color: '#10B981' }} />
              حق الاعتراض متاح
            </div>
            <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--ink-2)', lineHeight: 1.6 }}>
              إذا كنت تختلف مع نتيجة التحقق، يمكنك تقديم اعتراض مع دليل مضاد.
              سيتم إعادة إسناد الطلب لمراجع آخر أو طريقة تحقق بديلة.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {request.status !== 'VERIFIED' && (
              <Button variant="proof" size="md" onClick={() => navigate('/trust/create')}>
                <ShieldCheck size={16} /> إضافة طريقة تحقق بديلة
              </Button>
            )}
            {request.status === 'REJECTED' && (
              <Button variant="outline" size="md" onClick={() => navigate('/trust/create')}>
                <AlertTriangle size={16} /> تقديم اعتراض
              </Button>
            )}
            {request.status === 'PENDING' && (
              <Button variant="ghost" size="md" onClick={() => navigate('/trust/overview')}>
                <Clock size={16} /> انتظار نتيجة المراجعة
              </Button>
            )}
            <Button variant="ghost" size="md" onClick={() => navigate('/trust/overview')}>
              <ArrowRight size={16} /> العودة للقائمة
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default M22DetailsPage;