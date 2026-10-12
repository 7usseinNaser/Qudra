import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, GitBranch, FileCode, CheckCircle2, AlertTriangle, HelpCircle, Sparkles, ArrowRight, Shield, Lock, WifiOff } from 'lucide-react';
import { ROUTES } from '../../../constants/routes';
import { AnchorNav, AnchorLink } from '../../../components/patterns/AnchorNav';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { ProvenClaimedBadge } from '../../../components/patterns/ProvenClaimedBadge';
import styles from './m04.module.css';

const M04_ANCHORS: AnchorLink[] = [
  { id: 'overview', label: 'نظرة عامة', path: ROUTES.M04_OVERVIEW, icon: <Upload size={16} /> },
  { id: 'details', label: 'التفاصيل', path: ROUTES.M04_DETAILS, icon: <FileCode size={16} /> },
  { id: 'create', label: 'استيراد جديد', path: ROUTES.M04_CREATE, icon: <Sparkles size={16} /> },
  { id: 'results', label: 'نتائج الاستيراد', path: ROUTES.M04_RESULTS, icon: <CheckCircle2 size={16} /> },
  { id: 'empty', label: 'الحالة الفارغة', path: ROUTES.M04_EMPTY, icon: <HelpCircle size={16} /> },
  { id: 'error', label: 'معالجة الخطأ', path: ROUTES.M04_ERROR, icon: <AlertTriangle size={16} /> },
];

interface ImportSource {
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
}

const IMPORT_SOURCES: ImportSource[] = [
  {
    id: 'linkedin',
    name: 'LinkedIn Data Export',
    icon: <FileCode size={24} />,
    description: 'رفع ملف ZIP من إعدادات LinkedIn لاستخراج الخبرات، المهارات، الشهادات، والمشاريع',
    status: 'available',
    evidenceCount: 0,
    requiresPAT: false,
    color: '#0A66C2',
    bgColor: 'rgba(10, 102, 194, 0.1)',
  },
  {
    id: 'credly',
    name: 'Credly Badges',
    icon: <Shield size={24} />,
    description: 'ربط ملفك العام على Credly لاستيراد الشارات الرقمية والشهادات المعتمدة',
    status: 'available',
    evidenceCount: 0,
    requiresPAT: false,
    color: '#00C896',
    bgColor: 'rgba(0, 200, 150, 0.1)',
  },
  {
    id: 'leetcode',
    name: 'LeetCode Profile',
    icon: <GitBranch size={24} />,
    description: 'إضافة رابط بروفايل LeetCode العام لاستيراد إحصائيات الحل، المسابقات، والمهارات',
    status: 'available',
    evidenceCount: 0,
    requiresPAT: false,
    color: '#FFA116',
    bgColor: 'rgba(255, 161, 22, 0.1)',
  },
  {
    id: 'hackthebox',
    name: 'Hack The Box',
    icon: <Lock size={24} />,
    description: 'ربط حساب HTB لاستيراد الآلات المخترقة، التحديات، والرتب الأمنية',
    status: 'requires_auth',
    evidenceCount: 0,
    requiresPAT: true,
    color: '#9F1AE0',
    bgColor: 'rgba(159, 26, 224, 0.1)',
  },
];

export const M04OverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const [sources] = useState<ImportSource[]>(IMPORT_SOURCES);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const connectedCount = sources.filter(s => s.status === 'connected').length;
  const totalEvidence = sources.reduce((sum, s) => sum + s.evidenceCount, 0);

  const handleStartImport = (sourceId: string) => {
    navigate(ROUTES.M04_CREATE, { state: { sourceId } });
  };

  return (
    <div className={styles.page} dir="rtl">
      <AnchorNav anchors={M04_ANCHORS} title="شاشات مركز الاستيراد (M04)" />

      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerIcon}>
            <Upload size={32} />
          </div>
          <div>
            <h1 className={styles.title}>مركز الاستيراد (Import Center)</h1>
            <p className={styles.subtitle}>
              اربط مصادر الأدلة الخارجية: LinkedIn ZIP، Credly، LeetCode، Hack The Box
            </p>
          </div>
        </div>
        <div className={styles.headerMeta}>
          <Badge variant="proof">Q-0121</Badge>
          {isDemoMode && <Badge variant="gap">[Demo / تجريبي]</Badge>}
        </div>
      </header>

      <section className={styles.statsSection} aria-labelledby="stats-title">
        <h2 id="stats-title" className={styles.sectionTitle}>ملخص المصادر</h2>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <CheckCircle2 size={24} />
            </div>
            <div className={styles.statValue}>{connectedCount}</div>
            <div className={styles.statLabel}>مصادر مربوطة</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <FileCode size={24} />
            </div>
            <div className={styles.statValue}>{totalEvidence}</div>
            <div className={styles.statLabel}>أدلة مستوردة</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <Sparkles size={24} />
            </div>
            <div className={styles.statValue}>{sources.length}</div>
            <div className={styles.statLabel}>مصادر مدعومة</div>
          </div>
        </div>
      </section>

      <section className={styles.sourcesSection} aria-labelledby="sources-title">
        <h2 id="sources-title" className={styles.sectionTitle}>مصادر الأدلة المتاحة</h2>
        <div className={styles.sourcesGrid}>
          {sources.map(source => (
            <article key={source.id} className={`${styles.sourceCard} ${source.status}`}>
              <div className={styles.sourceHeader} style={{ background: source.bgColor, borderColor: source.color }}>
                <div className={styles.sourceIcon} style={{ color: source.color }}>
                  {source.icon}
                </div>
                <div className={styles.sourceStatus}>
                  <ProvenClaimedBadge
                    state={source.status === 'connected' ? 'PROVEN' : source.status === 'available' ? 'CLAIMED' : 'PENDING_REVIEW'}
                    size="sm"
                  />
                </div>
              </div>
              <h3 className={styles.sourceName}>{source.name}</h3>
              <p className={styles.sourceDesc}>{source.description}</p>
              <div className={styles.sourceMeta}>
                <span className={styles.sourceEvidence}>
                  <FileCode size={14} /> {source.evidenceCount} أدلة
                </span>
                {source.lastSync && (
                  <span className={styles.sourceSync}>
                    <ArrowRight size={14} /> آخر مزامنة: {new Date(source.lastSync).toLocaleDateString('ar-SA')}
                  </span>
                )}
              </div>
              {source.requiresPAT && (
                <div className={styles.patWarning}>
                  <WifiOff size={14} /> يتطلب PAT — <strong>لا يُخزن</strong>، يستخدم في الذاكرة فقط أثناء الجلسة
                </div>
              )}
              <div className={styles.sourceActions}>
                <Button
                  variant={source.status === 'connected' ? 'outline' : 'proof'}
                  size="md"
                  onClick={() => handleStartImport(source.id)}
                  disabled={source.status === 'connected'}
                  leftIcon={source.status === 'connected' ? <CheckCircle2 size={16} /> : <ArrowRight size={16} />}
                >
                  {source.status === 'connected' ? 'مربوط — إعادة استيراد' : 'بدء الاستيراد'}
                </Button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.securitySection} aria-labelledby="security-title">
        <h2 id="security-title" className={styles.sectionTitle}>سياسة الأمان والخصوصية</h2>
        <div className={styles.securityGrid}>
          <div className={styles.securityCard}>
            <div className={styles.securityIcon}>
              <Lock size={24} />
            </div>
            <h3>لا تخزين للرموز السرية</h3>
            <p>أي PAT أو Access Token يُدخله المستخدم <strong>لا يُحفظ أبداً</strong> في localStorage أو sessionStorage أو قاعدة البيانات. يبقى في متغير JavaScript فقط أثناء الجلسة الحالية.</p>
          </div>
          <div className={styles.securityCard}>
            <div className={styles.securityIcon}>
              <Shield size={24} />
            </div>
            <h3>شارة "User-supplied / Fragile"</h3>
            <p>جميع الأدلة المستوردة عبر PAT تحمل شارة <code>CLAIMED</code> وتظهر بوضوح كمصدر "User-supplied / Fragile" في ملفك.</p>
          </div>
          <div className={styles.securityCard}>
            <div className={styles.securityIcon}>
              <WifiOff size={24} />
            </div>
            <h3>انتهاء الجلسة = مسح الرمز</h3>
            <p>عند إغلاق التبويب، تسجيل الخروج، أو انتهاء مهلة الجلسة، يتم مسح أي رمز وصول من الذاكرة فوراً.</p>
          </div>
        </div>
      </section>

      <div className={styles.footerActions}>
        <Button variant="outline" size="md" onClick={() => setIsDemoMode(!isDemoMode)} leftIcon={isDemoMode ? <WifiOff size={16} /> : <Sparkles size={16} />}>
          {isDemoMode ? 'العودة للوضع المباشر' : 'تفعيل الوضع التجريبي'}
        </Button>
        <Button variant="proof" size="md" onClick={() => navigate(ROUTES.M04_CREATE)} leftIcon={<ArrowRight size={16} />}>
          استيراد مصدر جديد
        </Button>
      </div>
    </div>
  );
};

export default M04OverviewPage;