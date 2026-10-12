import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Upload, GitBranch, FileCode, CheckCircle2, AlertTriangle, HelpCircle, Shield, Lock, WifiOff, Trash2, ChevronRight, Sparkles } from 'lucide-react';
import { ROUTES } from '../../../constants/routes';
import { AnchorNav, AnchorLink } from '../../../components/patterns/AnchorNav';
import { DataState } from '../../../components/patterns/DataState';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { ProvenClaimedBadge } from '../../../components/patterns/ProvenClaimedBadge';
import { Bar } from '../../../components/ui/Bar';
import styles from './m04.module.css';

const M04_ANCHORS: AnchorLink[] = [
  { id: 'overview', label: 'نظرة عامة', path: ROUTES.M04_OVERVIEW, icon: <Upload size={16} /> },
  { id: 'details', label: 'التفاصيل', path: ROUTES.M04_DETAILS, icon: <FileCode size={16} /> },
  { id: 'create', label: 'استيراد جديد', path: ROUTES.M04_CREATE, icon: <ChevronRight size={16} /> },
  { id: 'results', label: 'نتائج الاستيراد', path: ROUTES.M04_RESULTS, icon: <CheckCircle2 size={16} /> },
  { id: 'empty', label: 'الحالة الفارغة', path: ROUTES.M04_EMPTY, icon: <HelpCircle size={16} /> },
  { id: 'error', label: 'معالجة الخطأ', path: ROUTES.M04_ERROR, icon: <AlertTriangle size={16} /> },
];

interface ImportSourceDetail {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  status: 'connected' | 'available' | 'requires_auth';
  evidenceCount: number;
  lastSync?: string;
  requiresPAT: boolean;
  color: string;
  bgColor: string;
  importedData: {
    experiences: number;
    skills: number;
    certifications: number;
    projects: number;
  };
  sampleEvidence: Array<{
    id: string;
    title: string;
    type: string;
    strength: number;
    status: 'VERIFIED' | 'CLAIMED' | 'PENDING';
  }>;
}

const SOURCE_DETAILS: Record<string, ImportSourceDetail> = {
  linkedin: {
    id: 'linkedin',
    name: 'LinkedIn Data Export',
    icon: <FileCode size={24} />,
    description: 'رفع ملف ZIP من إعدادات LinkedIn لاستخراج الخبرات، المهارات، الشهادات، والمشاريع',
    status: 'connected',
    evidenceCount: 12,
    lastSync: '2026-09-10T14:30:00Z',
    requiresPAT: false,
    color: '#0A66C2',
    bgColor: 'rgba(10, 102, 194, 0.1)',
    importedData: { experiences: 5, skills: 28, certifications: 3, projects: 4 },
    sampleEvidence: [
      { id: 'ev_1', title: 'Senior Software Engineer at TechCorp', type: 'EXPERIENCE', strength: 85, status: 'CLAIMED' },
      { id: 'ev_2', title: 'React & TypeScript Architecture', type: 'SKILL', strength: 92, status: 'CLAIMED' },
      { id: 'ev_3', title: 'AWS Certified Solutions Architect', type: 'CERTIFICATION', strength: 95, status: 'VERIFIED' },
      { id: 'ev_4', title: 'Microservices Platform Project', type: 'PROJECT', strength: 88, status: 'CLAIMED' },
    ],
  },
  credly: {
    id: 'credly',
    name: 'Credly Badges',
    icon: <Shield size={24} />,
    description: 'ربط ملفك العام على Credly لاستيراد الشارات الرقمية والشهادات المعتمدة',
    status: 'connected',
    evidenceCount: 7,
    lastSync: '2026-09-08T10:15:00Z',
    requiresPAT: false,
    color: '#00C896',
    bgColor: 'rgba(0, 200, 150, 0.1)',
    importedData: { experiences: 0, skills: 0, certifications: 7, projects: 0 },
    sampleEvidence: [
      { id: 'ev_5', title: 'Kubernetes Administrator (CKA)', type: 'CERTIFICATION', strength: 98, status: 'VERIFIED' },
      { id: 'ev_6', title: 'MongoDB Professional', type: 'CERTIFICATION', strength: 90, status: 'VERIFIED' },
      { id: 'ev_7', title: 'GraphQL Fundamentals', type: 'CERTIFICATION', strength: 82, status: 'VERIFIED' },
    ],
  },
  leetcode: {
    id: 'leetcode',
    name: 'LeetCode Profile',
    icon: <GitBranch size={24} />,
    description: 'إضافة رابط بروفايل LeetCode العام لاستيراد إحصائيات الحل، المسابقات، والمهارات',
    status: 'available',
    evidenceCount: 0,
    requiresPAT: false,
    color: '#FFA116',
    bgColor: 'rgba(255, 161, 22, 0.1)',
    importedData: { experiences: 0, skills: 0, certifications: 0, projects: 0 },
    sampleEvidence: [],
  },
  hackthebox: {
    id: 'hackthebox',
    name: 'Hack The Box',
    icon: <Lock size={24} />,
    description: 'ربط حساب HTB لاستيراد الآلات المخترقة، التحديات، والرتب الأمنية',
    status: 'requires_auth',
    evidenceCount: 0,
    requiresPAT: true,
    color: '#9F1AE0',
    bgColor: 'rgba(159, 26, 224, 0.1)',
    importedData: { experiences: 0, skills: 0, certifications: 0, projects: 0 },
    sampleEvidence: [],
  },
};

export const M04DetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams();
  const sourceId = params.sourceId ?? 'linkedin';
  const source = SOURCE_DETAILS[sourceId] ?? SOURCE_DETAILS['linkedin'];
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      if (!source) {
        setError(new Error('مصدر غير معروف'));
      }
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(t);
  }, [sourceId]);

  if (isLoading) {
    return (
      <div className={styles.page} dir="rtl">
        <DataState state="loading" title="جاري تحميل تفاصيل المصدر" message="نستعرض بيانات الاستيراد..." />
      </div>
    );
  }

  if (error || !source) {
    return (
      <div className={styles.page} dir="rtl">
        <DataState
          state="error"
          title="مصدر غير موجود"
          message={error?.message || 'لم يتم العثور على مصدر الاستيراد المحدد'}
          action={{ label: 'العودة للنظرة العامة', onClick: () => navigate(ROUTES.M04_OVERVIEW) }}
        />
      </div>
    );
  }

  const statusConfig = {
    connected: { label: 'مربوط', variant: 'proof' as const, icon: <CheckCircle2 size={14} /> },
    available: { label: 'متاح', variant: 'neutral' as const, icon: <HelpCircle size={14} /> },
    requires_auth: { label: 'يتطلب مصادقة', variant: 'gap' as const, icon: <Lock size={14} /> },
  };

  const config = statusConfig[source.status];

  return (
    <div className={styles.page} dir="rtl">
      <AnchorNav anchors={M04_ANCHORS} title="شاشات مركز الاستيراد (M04)" />

      <header className={styles.detailHeader}>
        <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.M04_OVERVIEW)} leftIcon={<ArrowLeft size={16} />}>
          العودة للنظرة العامة
        </Button>
        <div className={styles.detailHeaderContent}>
          <div className={styles.detailHeaderIcon} style={{ background: source.bgColor, borderColor: source.color }}>
            <div style={{ color: source.color }}>{source.icon}</div>
          </div>
          <div>
            <h1 className={styles.detailTitle}>{source.name}</h1>
            <div className={styles.detailMeta}>
              <Badge variant={config.variant} icon={config.icon}>
                {config.label}
              </Badge>
              {source.requiresPAT && (
                <span style={{ marginRight: '0.5rem' }}>
                  <Badge variant="gap">
                    <WifiOff size={12} /> يتطلب PAT — ذاكرة فقط
                  </Badge>
                </span>
              )}
            </div>
          </div>
        </div>
        <Badge variant="proof">Q-0123</Badge>
      </header>

      <section className={styles.overviewSection} aria-labelledby="overview-title">
        <h2 id="overview-title" className={styles.sectionTitle}>نظرة عامة على الاستيراد</h2>
        <div className={styles.overviewGrid}>
          <div className={styles.overviewCard}>
            <h3 className={styles.overviewCardTitle}>الوصف</h3>
            <p className={styles.overviewCardText}>{source.description}</p>
          </div>
          <div className={styles.overviewCard}>
            <h3 className={styles.overviewCardTitle}>الحالة</h3>
            <div className={styles.statusInfo}>
              <Badge variant={config.variant} icon={config.icon}>
                {config.label}
              </Badge>
              {source.lastSync && (
                <span className={styles.lastSync}>
                  <ChevronRight size={14} /> آخر مزامنة: {new Date(source.lastSync).toLocaleString('ar-SA')}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {source.status === 'connected' && (
        <>
          <section className={styles.statsSection} aria-labelledby="stats-title">
            <h2 id="stats-title" className={styles.sectionTitle}>البيانات المستوردة ({source.evidenceCount} أدلة)</h2>
            <div className={styles.dataGrid}>
              <div className={styles.dataCard}>
                <div className={styles.dataCardIcon}>
                  <FileCode size={20} />
                </div>
                <div className={styles.dataCardValue}>{source.importedData.experiences}</div>
                <div className={styles.dataCardLabel}>خبرات مهنية</div>
              </div>
              <div className={styles.dataCard}>
                <div className={styles.dataCardIcon}>
                  <Sparkles size={20} />
                </div>
                <div className={styles.dataCardValue}>{source.importedData.skills}</div>
                <div className={styles.dataCardLabel}>مهارات مستخرجة</div>
              </div>
              <div className={styles.dataCard}>
                <div className={styles.dataCardIcon}>
                  <Shield size={20} />
                </div>
                <div className={styles.dataCardValue}>{source.importedData.certifications}</div>
                <div className={styles.dataCardLabel}>شهادات/شارات</div>
              </div>
              <div className={styles.dataCard}>
                <div className={styles.dataCardIcon}>
                  <GitBranch size={20} />
                </div>
                <div className={styles.dataCardValue}>{source.importedData.projects}</div>
                <div className={styles.dataCardLabel}>مشاريع</div>
              </div>
            </div>
          </section>

          <section className={styles.evidenceSection} aria-labelledby="evidence-title">
            <h2 id="evidence-title" className={styles.sectionTitle}>عينات من الأدلة المستوردة</h2>
            <div className={styles.evidenceList}>
              {source.sampleEvidence.map(ev => (
                <article key={ev.id} className={styles.evidenceItem}>
                  <div className={styles.evidenceMain}>
                    <h4 className={styles.evidenceTitle}>{ev.title}</h4>
                    <span className={styles.evidenceType}>{ev.type}</span>
                  </div>
                  <div className={styles.evidenceMeta}>
                    <ProvenClaimedBadge
                      state={ev.status === 'VERIFIED' ? 'PROVEN' : ev.status === 'CLAIMED' ? 'CLAIMED' : 'PENDING_REVIEW'}
                      size="sm"
                    />
                    <Bar value={ev.strength} showValue size="sm" variant={ev.status === 'VERIFIED' ? 'proof' : 'gap'} />
                  </div>
                </article>
              ))}
            </div>
            <p className={styles.evidenceNote}>
              <strong>ملاحظة:</strong> جميع الأدلة من مصادر خارجية (LinkedIn، Credly) تحمل حالة <code>CLAIMED</code> ما لم يتم التحقق منها عبر GitHub أو تحديات عملية. تظهر شارة <span className={styles.fragileBadge}>User-supplied / Fragile</span> في ملف الماستر.
            </p>
          </section>
        </>
      )}

      {source.status === 'available' && (
        <section className={styles.actionSection} aria-labelledby="action-title">
          <h2 id="action-title" className={styles.sectionTitle}>بدء الاستيراد</h2>
          <div className={styles.actionCard}>
            <h3>استيراد من {source.name}</h3>
            <p>سيتم توجيهك لشاشة الاستيراد لرفع الملف أو إدخال الرابط.</p>
            <Button variant="proof" size="md" onClick={() => navigate(ROUTES.M04_CREATE, { state: { sourceId: source.id } })} leftIcon={<Upload size={16} />}>
              بدء الاستيراد الآن
            </Button>
          </div>
        </section>
      )}

      {source.status === 'requires_auth' && (
        <section className={styles.patSection} aria-labelledby="pat-title">
          <h2 id="pat-title" className={styles.sectionTitle}>مصادقة مطلوبة (PAT)</h2>
          <div className={styles.patCard}>
            <div className={styles.patWarningBox}>
              <WifiOff size={24} />
              <div>
                <h4>تنبيه أمني مهم</h4>
                <p>هذا المصدر يتطلب Personal Access Token (PAT). وفقاً لسياسة الأمان:</p>
                <ul>
                  <li>الرمز <strong>لا يُخزن أبداً</strong> في localStorage / sessionStorage / قاعدة البيانات</li>
                  <li>يبقى في متغير JavaScript <strong>فقط أثناء الجلسة الحالية</strong></li>
                  <li>عند إغلاق التبويب أو تسجيل الخروج: <strong>يمسح فوراً من الذاكرة</strong></li>
                  <li>جميع الأدلة الناتجة تحمل شارة <code>CLAIMED</code> + <span className={styles.fragileBadge}>User-supplied / Fragile</span></li>
                </ul>
              </div>
            </div>
            <Button variant="proof" size="md" onClick={() => navigate(ROUTES.M04_CREATE, { state: { sourceId: source.id } })} leftIcon={<Lock size={16} />}>
              المتابعة مع إدخال PAT
            </Button>
          </div>
        </section>
      )}

      <div className={styles.footerActions}>
        <Button variant="outline" size="md" onClick={() => navigate(ROUTES.M04_OVERVIEW)} leftIcon={<ArrowLeft size={16} />}>
          العودة لقائمة المصادر
        </Button>
        {source.status === 'connected' && (
          <Button variant="ghost" size="md" leftIcon={<Trash2 size={16} />}>
            قطع الاتصال وإزالة البيانات
          </Button>
        )}
      </div>
    </div>
  );
};


export default M04DetailsPage;