import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BarChart2, TrendingUp, Award, Target, Clock, ChevronRight, Sparkles, ShieldCheck, FileCode } from 'lucide-react';
import { ROUTES } from '../../../constants/routes';
import { MasterProfileService } from '../../../services/master-profile.service';
import { MasterProfileData } from '../../../services/types';
import { AnchorNav, AnchorLink } from '../../../components/patterns/AnchorNav';
import { DataState } from '../../../components/patterns/DataState';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { ProvenClaimedBadge } from '../../../components/patterns/ProvenClaimedBadge';
import { Bar } from '../../../components/ui/Bar';
import styles from './m02.module.css';

const M02_ANCHORS: AnchorLink[] = [
  { id: 'overview', label: 'نظرة عامة', path: ROUTES.M02_OVERVIEW, icon: <BarChart2 size={16} /> },
  { id: 'details', label: 'التفاصيل', path: ROUTES.M02_DETAILS, icon: <TrendingUp size={16} /> },
  { id: 'create', label: 'تخصيص', path: ROUTES.M02_CREATE, icon: <Target size={16} /> },
  { id: 'results', label: 'الملخص', path: ROUTES.M02_RESULTS, icon: <Award size={16} /> },
  { id: 'empty', label: 'جديد', path: ROUTES.M02_EMPTY, icon: <Sparkles size={16} /> },
  { id: 'error', label: 'خطأ', path: ROUTES.M02_ERROR, icon: <ShieldCheck size={16} /> },
];

export const M02DetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<MasterProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [activeTab, setActiveTab] = useState<'capabilities' | 'evidence' | 'dna' | 'timeline'>('capabilities');
  const [capSubTab, setCapSubTab] = useState<'all' | 'verified' | 'claimed'>('all');

  useEffect(() => {
    MasterProfileService.getProfile()
      .then(setProfile)
      .catch(setError)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className={styles.page} dir="rtl">
        <DataState state="loading" title="جاري تحميل التفاصيل" message="نقرأ بيانات ملفك الكامل..." />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className={styles.page} dir="rtl">
        <DataState
          state="error"
          title="تعذر تحميل التفاصيل"
          message={error?.message || 'لم يتم العثور على بيانات الملف'}
          action={{ label: 'العودة للرئيسية', onClick: () => navigate(ROUTES.HOME) }}
        />
      </div>
    );
  }

  const verifiedCaps = profile.capabilities.filter(c => c.isVerified);
  const claimedCaps = profile.capabilities.filter(c => !c.isVerified);
  const totalEvidence = profile.evidences.length;
  const verifiedEvidence = profile.evidences.filter(e => e.status === 'VERIFIED').length;

  return (
    <div className={styles.page} dir="rtl">
      <AnchorNav anchors={M02_ANCHORS} title="شاشات اللوحة الرئيسية (M02)" />

      <header className={styles.header}>
        <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.HOME)} leftIcon={<ArrowLeft size={16} />}>
          العودة للوحة الرئيسية
        </Button>
        <div className={styles.headerContent}>
          <div className={styles.headerIcon}>
            <TrendingUp size={32} />
          </div>
          <div>
            <h1 className={styles.title}>تفاصيل لوحة التحكم</h1>
            <p className={styles.subtitle}>
              تحليل عميق للكفاءات، الأدلة، الحمض النووي الهندسي، والخط الزمني
            </p>
          </div>
        </div>
        <Badge variant="proof">Q-0043</Badge>
      </header>

      <div className={styles.tabs}>
        <button className={`${styles.tab} ${activeTab === 'capabilities' ? styles.active : ''}`} onClick={() => setActiveTab('capabilities')}>
          <ShieldCheck size={16} /> الكفاءات ({profile.capabilities.length})
        </button>
        <button className={`${styles.tab} ${activeTab === 'evidence' ? styles.active : ''}`} onClick={() => setActiveTab('evidence')}>
          <FileCode size={16} /> الأدلة ({totalEvidence})
        </button>
        <button className={`${styles.tab} ${activeTab === 'dna' ? styles.active : ''}`} onClick={() => setActiveTab('dna')}>
          <Target size={16} /> DNA ({profile.dna.length})
        </button>
        <button className={`${styles.tab} ${activeTab === 'timeline' ? styles.active : ''}`} onClick={() => setActiveTab('timeline')}>
          <Clock size={16} /> الخط الزمني ({profile.timeline.length})
        </button>
      </div>

{activeTab === 'capabilities' && (
        <>
        <section className={styles.capabilitiesSection} aria-labelledby="cap-title">
          <h2 id="cap-title" className={styles.sectionTitle}>الكفاءات والقدرات ({profile.capabilities.length})</h2>
          <div className={styles.capabilitiesSummary}>
            <div className={`${styles.summaryItem} ${styles.verified}`}>
              <span className={styles.summaryValue}>{verifiedCaps.length}</span>
              <span className={styles.summaryLabel}>مثبتة بالأدلة</span>
            </div>
            <div className={`${styles.summaryItem} ${styles.claimed}`}>
              <span className={styles.summaryValue}>{claimedCaps.length}</span>
              <span className={styles.summaryLabel}>ادعاءات فقط</span>
            </div>
            <div className={`${styles.summaryItem} ${styles.total}`}>
              <span className={styles.summaryValue}>{profile.trustScore}%</span>
              <span className={styles.summaryLabel}>معدل الموثوقية</span>
            </div>
          </div>

          <div className={styles.capabilitiesTabs}>
            <button className={`${styles.subTab} ${capSubTab === 'all' ? styles.active : ''}`} onClick={() => setCapSubTab('all')}>الكل</button>
            <button className={`${styles.subTab} ${capSubTab === 'verified' ? styles.active : ''}`} onClick={() => setCapSubTab('verified')}>مثبتة ({verifiedCaps.length})</button>
            <button className={`${styles.subTab} ${capSubTab === 'claimed' ? styles.active : ''}`} onClick={() => setCapSubTab('claimed')}>ادعاءات ({claimedCaps.length})</button>
          </div>

          <div className={styles.capabilitiesGrid}>
            {profile.capabilities
              .filter(cap => capSubTab === 'all' || (capSubTab === 'verified' && cap.isVerified) || (capSubTab === 'claimed' && !cap.isVerified))
              .map(cap => (
              <article key={cap.id} className={`${styles.capabilityDetailCard} ${cap.isVerified ? styles.verified : styles.claimed}`}>
                <div className={styles.capDetailHeader}>
                  <h4 className={styles.capDetailTitle}>{cap.name}</h4>
                  <ProvenClaimedBadge state={cap.isVerified ? 'PROVEN' : 'CLAIMED'} size="sm" />
                </div>
                <span className={styles.capDetailCategory}>{cap.category}</span>
                {cap.description && <p className={styles.capDetailDesc}>{cap.description}</p>}
                <Bar value={cap.strength} label="القوة" showValue size="sm" variant={cap.isVerified ? 'proof' : 'gap'} />
                <div className={styles.capDetailMeta}>
                  <span><FileCode size={14} /> {cap.evidenceCount} أدلة</span>
                  <span className={styles.capLevel}>{cap.level}</span>
                </div>
              </article>
            ))}
          </div>
        </section>
        </>
      )}

      {activeTab === 'evidence' && (
        <>
        <section className={styles.evidenceSection} aria-labelledby="ev-title">
          <h2 id="ev-title" className={styles.sectionTitle}>الأدلة والمشاريع ({totalEvidence})</h2>
          <div className={styles.evidenceSummary}>
            <div className={`${styles.summaryItem} ${styles.verified}`}>
              <span className={styles.summaryValue}>{verifiedEvidence}</span>
              <span className={styles.summaryLabel}>مثبتة (VERIFIED)</span>
            </div>
            <div className={`${styles.summaryItem} ${styles.claimed}`}>
              <span className={styles.summaryValue}>{totalEvidence - verifiedEvidence}</span>
              <span className={styles.summaryLabel}>معلنة/قيد المراجعة</span>
            </div>
          </div>

          <div className={styles.evidenceList}>
            {profile.evidences.map(ev => (
              <article key={ev.id} className={`${styles.evidenceDetailCard} ${ev.status === 'VERIFIED' ? styles.verified : styles.claimed}`}>
                <div className={styles.evidenceDetailHeader}>
                  <h4 className={styles.evidenceDetailTitle}>{ev.title}</h4>
                  <ProvenClaimedBadge 
                    state={ev.status === 'VERIFIED' ? 'PROVEN' : ev.status === 'CLAIMED' ? 'CLAIMED' : 'PENDING_REVIEW'} 
                    size="sm" 
                  />
                </div>
                <div className={styles.evidenceDetailMeta}>
                  <span>{ev.type}</span>
                  <span>•</span>
                  <span>قوة {ev.strength}%</span>
                  <span>•</span>
                  <span>جودة {ev.qualityScore}%</span>
                </div>
                {ev.description && <p className={styles.evidenceDetailDesc}>{ev.description}</p>}
                {ev.repoDetails && (
                  <div className={styles.evidenceRepoDetails}>
                    <span><FileCode size={14} /> {ev.repoDetails.repoName}</span>
                    <span>{ev.repoDetails.primaryLanguage}</span>
                    <span>{ev.repoDetails.linesOfCode.toLocaleString()} سطر</span>
                    <span>{ev.repoDetails.commitsCount} commit</span>
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>
        </>
      )}

      {activeTab === 'dna' && (
        <>
        <section className={styles.dnaSection} aria-labelledby="dna-title">
          <h2 id="dna-title" className={styles.sectionTitle}>الحمض النووي الهندسي (Engineering DNA)</h2>
          <p className={styles.dnaIntro}>أبعاد شخصيتك الهندسية بناءً على الأدلة المثبتة والأنماط المتكررة في عملك</p>
          <div className={styles.dnaGrid}>
            {profile.dna.map(d => (
              <article key={d.dimension} className={`${styles.dnaCard} ${d.strengthType}`}>
                <div className={styles.dnaCardHeader}>
                  <h4 className={styles.dnaDimension}>{d.dimension}</h4>
                  <Badge 
                    variant={d.strengthType === 'core' ? 'proof' : d.strengthType === 'supporting' ? 'gap' : 'neutral'}
                  >
                    {d.strengthType === 'core' ? 'أساسي' : d.strengthType === 'supporting' ? 'داعم' : 'ناشئ'}
                  </Badge>
                </div>
                <div className={styles.dnaScore}>
                  <span className={styles.dnaScoreValue}>{d.score}%</span>
                  <Bar value={d.score} size="md" variant={d.strengthType === 'core' ? 'proof' : 'gap'} />
                </div>
                <p className={styles.dnaDesc}>{d.description}</p>
                <div className={styles.dnaCapabilities}>
                  {profile.capabilities
                    .slice(0, 3)
                    .map(c => (
                      <span key={c.id} className={styles.dnaCapTag}>{c.name}</span>
                    ))}
                </div>
              </article>
            ))}
          </div>
        </section>
        </>
      )}

      {activeTab === 'timeline' && (
        <>
        <section className={styles.timelineSection} aria-labelledby="tl-title">
          <h2 id="tl-title" className={styles.sectionTitle}>الخط الزمني للإنجازات ({profile.timeline.length})</h2>
          <div className={styles.timeline}>
            {profile.timeline.map((item) => (
              <article key={item.id} className={styles.timelineItem}>
                <div className={styles.timelineMarker}>
                  <div className={`${styles.timelineDot} ${item.evidenceType === 'GITHUB_REPO' ? styles.github : item.evidenceType === 'ORAL_ASSESSMENT' ? styles.oral : styles.project}`} />
                </div>
                <div className={styles.timelineContent}>
                  <div className={styles.timelineHeader}>
                    <h4 className={styles.timelineTitle}>{item.title}</h4>
                    <span className={styles.timelineDate}>{new Date(item.date).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <p className={styles.timelineDesc}>{item.description}</p>
                  <div className={styles.timelineMeta}>
                    <ProvenClaimedBadge 
                      state={item.evidenceType === 'GITHUB_REPO' ? 'PROVEN' : item.evidenceType === 'ORAL_ASSESSMENT' ? 'PROVEN' : 'IN_PROGRESS'} 
                      size="sm" 
                    />
                    <span>أثر: {item.impactScore}%</span>
                    <span>{item.capabilityNames.join('، ')}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
        </>
      )}

      <div className={styles.footerActions}>
        <Button variant="outline" size="md" onClick={() => navigate(ROUTES.HOME)} leftIcon={<ArrowLeft size={16} />}>
          العودة للوحة الرئيسية
        </Button>
        <Button variant="proof" size="md" onClick={() => navigate('/profile/master')} leftIcon={<ChevronRight size={16} />}>
          عرض الملف الماستر الكامل
        </Button>
      </div>
    </div>
  );
};

export default M02DetailsPage;