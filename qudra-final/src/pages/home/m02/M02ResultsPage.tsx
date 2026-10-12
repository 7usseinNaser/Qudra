import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Award, TrendingUp, CheckCircle2, AlertTriangle, ShieldCheck, FileCode, Target, Users, Sparkles, Clock, BarChart2, ChevronRight, Trophy, Star } from 'lucide-react';
import { ROUTES } from '../../../constants/routes';
import { useRole } from '../../../contexts/useRole';
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

export const M02ResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const { role } = useRole();
  const [profile, setProfile] = useState<MasterProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isDemo] = useState(false);

  useEffect(() => {
    MasterProfileService.getProfile()
      .then(setProfile)
      .catch(setError)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className={styles.page} dir="rtl">
        <DataState state="loading" title="جاري إعداد الملخص" message="نجمع إنجازاتك ونحلل ملفك..." />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className={styles.page} dir="rtl">
        <DataState
          state="error"
          title="تعذر تحميل الملخص"
          message={error?.message || 'لم يتم العثور على بيانات الملف'}
          action={{ label: 'العودة للرئيسية', onClick: () => navigate(ROUTES.HOME) }}
        />
      </div>
    );
  }

  const verifiedCaps = profile.capabilities.filter(c => c.isVerified);
  const totalEvidence = profile.evidences.length;
  const verifiedEvidence = profile.evidences.filter(e => e.status === 'VERIFIED').length;
  const avgStrength = profile.capabilities.length > 0
    ? Math.round(profile.capabilities.reduce((sum, c) => sum + c.strength, 0) / profile.capabilities.length)
    : 0;
  const topCapability = profile.capabilities.reduce((max, c) => c.strength > max.strength ? c : max, profile.capabilities[0]);
  const recentTimeline = profile.timeline.slice(0, 3);

const achievements = [
    { id: 'trust', label: 'موثوقية عالية', value: profile.trustScore + '%', icon: <ShieldCheck size={20} />, earned: profile.trustScore >= 90 },
    { id: 'verified', label: 'مهارات مثبتة', value: String(verifiedCaps.length), icon: <CheckCircle2 size={20} />, earned: verifiedCaps.length >= 3 },
    { id: 'evidence', label: 'أدلة موثقة', value: String(totalEvidence), icon: <FileCode size={20} />, earned: totalEvidence >= 5 },
    { id: 'dna', label: 'DNA قوي', value: Math.round(profile.dna.reduce((s, d) => s + d.score, 0) / profile.dna.length) + '%', icon: <Target size={20} />, earned: profile.dna.some(d => d.score >= 90) },
  ];

  if (role === 'c') {
    return (
      <div className={styles.page} dir="rtl">
        <AnchorNav anchors={M02_ANCHORS} title="شاشات اللوحة الرئيسية (M02)" />

        <header className={styles.header}>
          <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.HOME)} leftIcon={<ArrowLeft size={16} />}>
            العودة للوحة الرئيسية
          </Button>
          <div className={styles.headerContent}>
            <div className={styles.headerIcon}>
              <Award size={32} />
            </div>
            <div>
              <h1 className={styles.title}>ملخص المنشأة</h1>
              <p className={styles.subtitle}>نظرة عامة على المشكلات، المطابقات، وأداء التوظيف</p>
            </div>
          </div>
          <Badge variant="proof">Q-0047</Badge>
        </header>

        <section className={styles.orgSummary} aria-labelledby="org-summary-title">
          <h2 id="org-summary-title" className={styles.sectionTitle}>إحصائيات التوظيف والمطابقة</h2>
          <div className={styles.summaryGrid}>
            <div className={styles.summaryCard}>
              <div className={styles.summaryIcon}><Users size={24} /></div>
              <div className={styles.summaryValue}>12</div>
              <div className={styles.summaryLabel}>مشكلات مطروحة</div>
            </div>
            <div className={styles.summaryCard}>
              <div className={styles.summaryIcon}><Target size={24} /></div>
              <div className={styles.summaryValue}>34</div>
              <div className={styles.summaryLabel}>مرشحين مطابقة</div>
            </div>
            <div className={styles.summaryCard}>
              <div className={styles.summaryIcon}><CheckCircle2 size={24} /></div>
              <div className={styles.summaryValue}>8</div>
              <div className={styles.summaryLabel}>توظيفات ناجحة</div>
            </div>
            <div className={styles.summaryCard}>
              <div className={styles.summaryIcon}><Clock size={24} /></div>
              <div className={styles.summaryValue}>14 يوم</div>
              <div className={styles.summaryLabel}>متوسط وقت التوظيف</div>
            </div>
          </div>
        </section>

        <div className={styles.footerActions}>
          <Button variant="proof" size="md" onClick={() => navigate(ROUTES.HOME)} leftIcon={<ArrowLeft size={16} />}>
            العودة للوحة الرئيسية
          </Button>
          <Button variant="outline" size="md" onClick={() => navigate(ROUTES.CANDIDATES)} leftIcon={<ChevronRight size={16} />}>
            استعراض المرشحين
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page} dir="rtl">
      <AnchorNav anchors={M02_ANCHORS} title="شاشات اللوحة الرئيسية (M02)" />

      <header className={styles.header}>
        <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.HOME)} leftIcon={<ArrowLeft size={16} />}>
          العودة للوحة الرئيسية
        </Button>
        <div className={styles.headerContent}>
          <div className={styles.headerIcon}>
            <Award size={32} />
          </div>
          <div>
            <h1 className={styles.title}>ملخص الإنجاز (Achievement Summary)</h1>
            <p className={styles.subtitle}>
              صورة شاملة لمهاراتك المثبتة، الأدلة الموثقة، والتقدم في المسار الهندسي
            </p>
          </div>
        </div>
        <div className={styles.headerMeta}>
          <Badge variant="proof">Q-0047</Badge>
          {isDemo && <Badge variant="gap">[Demo / تجريبي]</Badge>}
        </div>
      </header>

      <section className={styles.kpiSection} aria-labelledby="kpi-title">
        <h2 id="kpi-title" className={styles.sectionTitle}>المؤشرات الرئيسية (KPIs)</h2>
        <div className={styles.kpiGrid}>
          <div className={styles.kpiCard}>
            <div className={styles.kpiIcon}><ShieldCheck size={24} /></div>
            <div className={styles.kpiValue}>{profile.trustScore}%</div>
            <div className={styles.kpiLabel}>معدل الموثوقية الهندسية</div>
            <Bar value={profile.trustScore} size="sm" variant="proof" />
          </div>
          <div className={styles.kpiCard}>
            <div className={styles.kpiIcon}><CheckCircle2 size={24} /></div>
            <div className={styles.kpiValue}>{verifiedCaps.length}</div>
            <div className={styles.kpiLabel}>مهارات مثبتة بالأدلة</div>
            <Bar value={Math.round((verifiedCaps.length / Math.max(profile.capabilities.length, 1)) * 100)} size="sm" variant="proof" />
          </div>
          <div className={styles.kpiCard}>
            <div className={styles.kpiIcon}><FileCode size={24} /></div>
            <div className={styles.kpiValue}>{verifiedEvidence}/{totalEvidence}</div>
            <div className={styles.kpiLabel}>أدلة موثقة / إجمالي</div>
            <Bar value={Math.round((verifiedEvidence / Math.max(totalEvidence, 1)) * 100)} size="sm" variant="proof" />
          </div>
          <div className={styles.kpiCard}>
            <div className={styles.kpiIcon}><Target size={24} /></div>
            <div className={styles.kpiValue}>{avgStrength}%</div>
            <div className={styles.kpiLabel}>متوسط قوة الكفاءات</div>
            <Bar value={avgStrength} size="sm" variant="gap" />
          </div>
        </div>
      </section>

      <section className={styles.achievementsSection} aria-labelledby="ach-title">
        <h2 id="ach-title" className={styles.sectionTitle}>الشارات والإنجازات المفتوحة</h2>
        <div className={styles.achievementsGrid}>
          {achievements.map(ach => (
            <div key={ach.id} className={`${styles.achievementCard} ${ach.earned ? styles.earned : styles.locked}`}>
              <div className={styles.achievementIcon}>{ach.icon}</div>
              <h4>{ach.label}</h4>
              <div className={styles.achievementValue}>{ach.value}</div>
              {ach.earned ? (
                <Badge variant="proof"><CheckCircle2 size={10} /> مفتوح</Badge>
              ) : (
                <Badge variant="neutral"><AlertTriangle size={10} /> مقفل</Badge>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className={styles.topCapabilitySection} aria-labelledby="top-cap-title">
        <h2 id="top-cap-title" className={styles.sectionTitle}>أقوى كفاءة لديك</h2>
        <div className={styles.topCapabilityCard}>
          <div className={styles.topCapMain}>
            <div className={styles.topCapIcon}>
              <ProvenClaimedBadge state={topCapability.isVerified ? 'PROVEN' : 'CLAIMED'} size="md" />
            </div>
            <div>
              <h3>{topCapability.name}</h3>
              <span className={styles.topCapCategory}>{topCapability.category}</span>
            </div>
          </div>
          <div className={styles.topCapStats}>
            <div className={styles.topCapStat}>
              <span className={styles.topCapStatLabel}>القوة</span>
              <span className={styles.topCapStatValue}>{topCapability.strength}%</span>
            </div>
            <div className={styles.topCapStat}>
              <span className={styles.topCapStatLabel}>الثقة</span>
              <span className={styles.topCapStatValue}>{topCapability.confidence}%</span>
            </div>
            <div className={styles.topCapStat}>
              <span className={styles.topCapStatLabel}>الأدلة</span>
              <span className={styles.topCapStatValue}>{topCapability.evidenceCount}</span>
            </div>
          </div>
          <Bar value={topCapability.strength} size="md" variant={topCapability.isVerified ? 'proof' : 'gap'} />
        </div>
      </section>

      <section className={styles.recentActivitySection} aria-labelledby="recent-title">
        <h2 id="recent-title" className={styles.sectionTitle}>النشاط الأخير (آخر 3 إنجازات)</h2>
        <div className={styles.timeline}>
          {recentTimeline.map((item) => (
            <article key={item.id} className={styles.timelineItem}>
              <div className={styles.timelineMarker}>
                <div className={`${styles.timelineDot} ${item.evidenceType === 'GITHUB_REPO' ? styles.github : item.evidenceType === 'ORAL_ASSESSMENT' ? styles.oral : styles.project}`} />
              </div>
              <div className={styles.timelineContent}>
                <div className={styles.timelineHeader}>
                  <h4 className={styles.timelineTitle}>{item.title}</h4>
                  <span className={styles.timelineDate}>{new Date(item.date).toLocaleDateString('ar-SA')}</span>
                </div>
                <p className={styles.timelineDesc}>{item.description}</p>
                <div className={styles.timelineMeta}>
                  <ProvenClaimedBadge 
                    state={item.evidenceType === 'GITHUB_REPO' ? 'PROVEN' : item.evidenceType === 'ORAL_ASSESSMENT' ? 'PROVEN' : 'IN_PROGRESS'} 
                    size="sm" 
                  />
                  <span>أثر: {item.impactScore}%</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.nextStepsSection} aria-labelledby="next-steps-title">
        <h2 id="next-steps-title" className={styles.sectionTitle}>الخطوات التالية المقترحة</h2>
        <div className={styles.nextStepsGrid}>
          <Button variant="proof" size="md" onClick={() => navigate('/next/overview')} leftIcon={<Target size={16} />}>
            <strong>محرك الخطوة التالية</strong>
            <span>تحليل الفجوات وتوصية إجراء دقيق</span>
          </Button>
          <Button variant="outline" size="md" onClick={() => navigate('/profile/sources')} leftIcon={<Sparkles size={16} />}>
            <strong>ربط مصادر جديدة</strong>
            <span>GitHub، LinkedIn، Credly للمزيد من الأدلة</span>
          </Button>
          <Button variant="outline" size="md" onClick={() => navigate('/challenges')} leftIcon={<Trophy size={16} />}>
            <strong>حل تحديات عملية</strong>
            <span>رفع DNA Score وإثبات مهارات جديدة</span>
          </Button>
          <Button variant="ghost" size="md" onClick={() => navigate('/opportunities')} leftIcon={<Star size={16} />}>
            <strong>استكشاف الفرص</strong>
            <span>مشاريع وتحديات مناسبة لملفك</span>
          </Button>
        </div>
      </section>

      <div className={styles.footerActions}>
        <Button variant="proof" size="md" onClick={() => navigate(ROUTES.HOME)} leftIcon={<ArrowLeft size={16} />}>
          العودة للوحة الرئيسية
        </Button>
        <Button variant="outline" size="md" onClick={() => navigate('/profile/master')} leftIcon={<ChevronRight size={16} />}>
          عرض الملف الماستر الكامل
        </Button>
      </div>
    </div>
  );
};

export default M02ResultsPage;