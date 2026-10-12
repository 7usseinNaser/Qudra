import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, AlertTriangle, HelpCircle, FileCode, Shield, ChevronRight, Sparkles, TrendingUp, Clock, Award } from 'lucide-react';
import { ROUTES } from '../../../constants/routes';
import { AnchorNav, AnchorLink } from '../../../components/patterns/AnchorNav';
import { DataState } from '../../../components/patterns/DataState';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { ProvenClaimedBadge } from '../../../components/patterns/ProvenClaimedBadge';
import { Bar } from '../../../components/ui/Bar';
import styles from './m04.module.css';

const M04_ANCHORS: AnchorLink[] = [
  { id: 'overview', label: 'نظرة عامة', path: ROUTES.M04_OVERVIEW, icon: <FileCode size={16} /> },
  { id: 'details', label: 'التفاصيل', path: ROUTES.M04_DETAILS, icon: <Shield size={16} /> },
  { id: 'create', label: 'استيراد جديد', path: ROUTES.M04_CREATE, icon: <Sparkles size={16} /> },
  { id: 'results', label: 'نتائج الاستيراد', path: ROUTES.M04_RESULTS, icon: <CheckCircle2 size={16} /> },
  { id: 'empty', label: 'الحالة الفارغة', path: ROUTES.M04_EMPTY, icon: <HelpCircle size={16} /> },
  { id: 'error', label: 'معالجة الخطأ', path: ROUTES.M04_ERROR, icon: <AlertTriangle size={16} /> },
];

interface ImportResult {
  sourceId: string;
  sourceName: string;
  sourceIcon: React.ReactNode;
  sourceColor: string;
  importedAt: string;
  evidenceCount: number;
  experiences: number;
  skills: number;
  certifications: number;
  projects: number;
  evidenceItems: Array<{
    id: string;
    title: string;
    type: string;
    strength: number;
    status: 'VERIFIED' | 'CLAIMED' | 'PENDING';
  }>;
  isFragile: boolean;
}

const MOCK_RESULTS: ImportResult[] = [
  {
    sourceId: 'linkedin',
    sourceName: 'LinkedIn Data Export',
    sourceIcon: <FileCode size={24} />,
    sourceColor: '#0A66C2',
    importedAt: '2026-09-10T14:30:00Z',
    evidenceCount: 12,
    experiences: 5,
    skills: 28,
    certifications: 3,
    projects: 4,
    evidenceItems: [
      { id: 'ev_1', title: 'Senior Software Engineer at TechCorp', type: 'EXPERIENCE', strength: 85, status: 'CLAIMED' },
      { id: 'ev_2', title: 'React & TypeScript Architecture', type: 'SKILL', strength: 92, status: 'CLAIMED' },
      { id: 'ev_3', title: 'AWS Certified Solutions Architect', type: 'CERTIFICATION', strength: 95, status: 'VERIFIED' },
      { id: 'ev_4', title: 'Microservices Platform Project', type: 'PROJECT', strength: 88, status: 'CLAIMED' },
    ],
    isFragile: true,
  },
  {
    sourceId: 'credly',
    sourceName: 'Credly Badges',
    sourceIcon: <Shield size={24} />,
    sourceColor: '#00C896',
    importedAt: '2026-09-08T10:15:00Z',
    evidenceCount: 7,
    experiences: 0,
    skills: 0,
    certifications: 7,
    projects: 0,
    evidenceItems: [
      { id: 'ev_5', title: 'Kubernetes Administrator (CKA)', type: 'CERTIFICATION', strength: 98, status: 'VERIFIED' },
      { id: 'ev_6', title: 'MongoDB Professional', type: 'CERTIFICATION', strength: 90, status: 'VERIFIED' },
      { id: 'ev_7', title: 'GraphQL Fundamentals', type: 'CERTIFICATION', strength: 82, status: 'VERIFIED' },
    ],
    isFragile: true,
  },
];

export const M04ResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  interface LocationState {
  importedData?: ImportResult;
  sourceId?: string;
}

const result = (location.state as LocationState)?.importedData
    ? { ...MOCK_RESULTS[0], ...location.state.importedData } as ImportResult
    : MOCK_RESULTS[0];
  const [results] = useState<ImportResult[]>(MOCK_RESULTS.map(r => r.sourceId === result.sourceId ? result : r));
  const [isLoading] = useState(false);

  const totalEvidence = results.reduce((sum, r) => sum + r.evidenceCount, 0);
  const verifiedCount = results.reduce((sum, r) => sum + r.evidenceItems.filter(e => e.status === 'VERIFIED').length, 0);
  const claimedCount = results.reduce((sum, r) => sum + r.evidenceItems.filter(e => e.status === 'CLAIMED').length, 0);

  if (isLoading) {
    return (
      <div className={styles.page} dir="rtl">
        <DataState state="loading" title="جاري تحميل النتائج" message="نجمع بيانات الاستيراد..." />
      </div>
    );
  }

  return (
    <div className={styles.page} dir="rtl">
      <AnchorNav anchors={M04_ANCHORS} title="شاشات مركز الاستيراد (M04)" />

      <header className={styles.header}>
        <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.M04_OVERVIEW)} leftIcon={<ArrowLeft size={16} />}>
          العودة للنظرة العامة
        </Button>
        <div className={styles.headerContent}>
          <div className={styles.headerIcon}>
            <CheckCircle2 size={32} />
          </div>
          <div>
            <h1 className={styles.title}>نتائج الاستيراد</h1>
            <p className={styles.subtitle}>
              ملخص الأدلة المستوردة، حالة التحقق، وتأثيرها على ملف الكفاءات
            </p>
          </div>
        </div>
        <Badge variant="proof">Q-0127</Badge>
      </header>

      <section className={styles.summarySection} aria-labelledby="summary-title">
        <h2 id="summary-title" className={styles.sectionTitle}>ملخص الاستيراد ({results.length} مصادر)</h2>
        <div className={styles.summaryGrid}>
          <div className={styles.summaryCard}>
            <div className={styles.summaryIcon}>
              <FileCode size={24} />
            </div>
            <div className={styles.summaryValue}>{totalEvidence}</div>
            <div className={styles.summaryLabel}>إجمالي الأدلة</div>
          </div>
          <div className={`${styles.summaryCard} ${styles.verified}`}>
            <div className={styles.summaryIcon}>
              <CheckCircle2 size={24} />
            </div>
            <div className={styles.summaryValue}>{verifiedCount}</div>
            <div className={styles.summaryLabel}>مثبتة (Verified)</div>
          </div>
          <div className={`${styles.summaryCard} ${styles.claimed}`}>
            <div className={styles.summaryIcon}>
              <Shield size={24} />
            </div>
            <div className={styles.summaryValue}>{claimedCount}</div>
            <div className={styles.summaryLabel}>معلنة (Claimed)</div>
          </div>
          <div className={`${styles.summaryCard} ${styles.fragile}`}>
            <div className={styles.summaryIcon}>
              <AlertTriangle size={24} />
            </div>
            <div className={styles.summaryValue}>{results.filter(r => r.isFragile).length}</div>
            <div className={styles.summaryLabel}>مصادر Fragile</div>
          </div>
        </div>
      </section>

      <section className={styles.resultsSection} aria-labelledby="results-title">
        <h2 id="results-title" className={styles.sectionTitle}>تفاصيل كل مصدر</h2>
        <div className={styles.resultsList}>
          {results.map((res) => (
            <article key={res.sourceId} className={styles.resultCard}>
              <div className={styles.resultHeader}>
                <div className={styles.resultSource} style={{ background: `${res.sourceColor}15`, borderColor: res.sourceColor }}>
                  <div style={{ color: res.sourceColor }}>{res.sourceIcon}</div>
                </div>
                <div className={styles.resultSourceInfo}>
                  <h3 className={styles.resultSourceName}>{res.sourceName}</h3>
                  <div className={styles.resultSourceMeta}>
                    <span>{res.evidenceCount} أدلة</span>
                    <span>•</span>
                    <span>{new Date(res.importedAt).toLocaleString('ar-SA')}</span>
                    {res.isFragile && (
                      <Badge variant="gap">
                        <AlertTriangle size={10} /> User-supplied / Fragile
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className={styles.resultStats}>
                <div className={styles.resultStat}>
                  <span className={styles.resultStatValue}>{res.experiences}</span>
                  <span className={styles.resultStatLabel}>خبرات</span>
                </div>
                <div className={styles.resultStat}>
                  <span className={styles.resultStatValue}>{res.skills}</span>
                  <span className={styles.resultStatLabel}>مهارات</span>
                </div>
                <div className={styles.resultStat}>
                  <span className={styles.resultStatValue}>{res.certifications}</span>
                  <span className={styles.resultStatLabel}>شهادات</span>
                </div>
                <div className={styles.resultStat}>
                  <span className={styles.resultStatValue}>{res.projects}</span>
                  <span className={styles.resultStatLabel}>مشاريع</span>
                </div>
              </div>

              <div className={styles.resultEvidence}>
                <h4>الأدلة ({res.evidenceItems.length})</h4>
                <div className={styles.resultEvidenceList}>
                  {res.evidenceItems.map((ev) => (
                    <div key={ev.id} className={styles.resultEvidenceItem}>
                      <div className={styles.resultEvidenceMain}>
                        <span className={styles.resultEvidenceTitle}>{ev.title}</span>
                        <span className={styles.resultEvidenceType}>{ev.type}</span>
                      </div>
                      <div className={styles.resultEvidenceMeta}>
                        <ProvenClaimedBadge
                          state={ev.status === 'VERIFIED' ? 'PROVEN' : ev.status === 'CLAIMED' ? 'CLAIMED' : 'PENDING_REVIEW'}
                          size="sm"
                        />
                        <Bar value={ev.strength} showValue size="sm" variant={ev.status === 'VERIFIED' ? 'proof' : 'gap'} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.impactSection} aria-labelledby="impact-title">
        <h2 id="impact-title" className={styles.sectionTitle}>الأثر على ملف الكفاءات</h2>
        <div className={styles.impactGrid}>
          <div className={styles.impactCard}>
            <div className={styles.impactIcon}>
              <TrendingUp size={24} />
            </div>
            <h3>مهارات جديدة مضافة</h3>
            <p>{results.reduce((sum, r) => sum + r.skills, 0)} مهارة من مصادر خارجية — تحتاج تحقق عبر GitHub/تحديات</p>
          </div>
          <div className={styles.impactCard}>
            <div className={styles.impactIcon}>
              <Award size={24} />
            </div>
            <h3>شهادات موثقة</h3>
            <p>{verifiedCount} شهادة معتمدة (Credly) — حالة VERIFIED تلقائياً</p>
          </div>
          <div className={styles.impactCard}>
            <div className={styles.impactIcon}>
              <Clock size={24} />
            </div>
            <h3>خبرة عملية</h3>
            <p>{results.reduce((sum, r) => sum + r.experiences, 0)} خبرات من LinkedIn — حالة CLAIMED</p>
          </div>
        </div>
      </section>

      <div className={styles.fragileNotice}>
        <AlertTriangle size={16} />
        <div>
          <strong>تنبيه مهم — مصادر User-supplied / Fragile:</strong>
          <p>جميع الأدلة من LinkedIn و Credly و LeetCode و HTB (بدون تحقق GitHub) تحمل شارة <code>CLAIMED</code> وتظهر بوضوح كـ <span className={styles.fragileBadge}>User-supplied / Fragile</span> في ملف الماستر وجواز القدرات. لتحويلها إلى <code>PROVEN</code>، اربط مستودع GitHub يحتوي على كود يثبت المهارة أو أكمل تحدياً عملياً في المنصة.</p>
        </div>
      </div>

      <div className={styles.footerActions}>
        <Button variant="proof" size="md" onClick={() => navigate(ROUTES.M04_OVERVIEW)} leftIcon={<CheckCircle2 size={16} />}>
          العودة لمركز الاستيراد
        </Button>
        <Button variant="outline" size="md" onClick={() => navigate(ROUTES.M04_CREATE)} leftIcon={<Sparkles size={16} />}>
          استيراد مصدر آخر
        </Button>
        <Button variant="ghost" size="md" onClick={() => navigate('/profile/master')} leftIcon={<ChevronRight size={16} />}>
          عرض الملف المحدث
        </Button>
      </div>
    </div>
  );
};

export default M04ResultsPage;