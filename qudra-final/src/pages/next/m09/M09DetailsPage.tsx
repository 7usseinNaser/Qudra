import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Target, AlertTriangle, HelpCircle, Clock, TrendingUp, Code2, Zap, ChevronRight } from 'lucide-react';
import { ROUTES } from '../../../constants/routes';
import { GapsDataService } from '../../../services/gaps-data';
import { GapDetail } from '../../../services/types';
import { AnchorNav, AnchorLink } from '../../../components/patterns/AnchorNav';
import { DataState } from '../../../components/patterns/DataState';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Bar } from '../../../components/ui/Bar';
import { ExplainDrawer } from '../../../components/patterns/ExplainDrawer';
import styles from './m09.module.css';

const M09_ANCHORS: AnchorLink[] = [
  { id: 'overview', label: 'نظرة عامة', path: ROUTES.M09_OVERVIEW, icon: <Target size={16} /> },
  { id: 'details', label: 'التفاصيل', path: ROUTES.M09_DETAILS, icon: <AlertTriangle size={16} /> },
  { id: 'create', label: 'إنشاء خطة', path: ROUTES.M09_CREATE, icon: <Zap size={16} /> },
  { id: 'results', label: 'النتائج', path: ROUTES.M09_RESULTS, icon: <TrendingUp size={16} /> },
  { id: 'empty', label: 'الحالة الفارغة', path: ROUTES.M09_EMPTY, icon: <HelpCircle size={16} /> },
  { id: 'error', label: 'معالجة الخطأ', path: ROUTES.M09_ERROR, icon: <Zap size={16} /> },
];

export const M09DetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams();
  const gapId = params.gapId;
  const [gap, setGap] = useState<GapDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [explainOpen, setExplainOpen] = useState(false);

  useEffect(() => {
    GapsDataService.getGapsData()
      .then(data => {
        const found = gapId
          ? data.gaps.find(g => g.id === gapId)
          : (data.primaryGap ?? data.gaps[0] ?? null);
        if (found) {
          setGap(found);
        } else {
          setError(new Error('لم يتم العثور على الفجوة المطلوبة'));
        }
      })
      .catch((e: unknown) => setError(e instanceof Error ? e : new Error('تعذر تحميل الفجوة')))
      .finally(() => setIsLoading(false));
  }, [gapId]);

  if (isLoading) {
    return (
      <div className={styles.page} dir="rtl">
        <DataState state="loading" title="جاري تحميل تفاصيل الفجوة" message="نستعرض البيانات المفصلة..." />
      </div>
    );
  }

  if (error || !gap) {
    return (
      <div className={styles.page} dir="rtl">
        <DataState
          state="error"
          title="فجوة غير موجودة"
          message={error?.message || 'لم يتم العثور على الفجوة المحددة'}
          action={{ label: 'العودة للنظرة العامة', onClick: () => navigate(ROUTES.M09_OVERVIEW) }}
          secondaryAction={{ label: 'عرض جميع الفجوات', onClick: () => navigate(ROUTES.M09_OVERVIEW), variant: 'outline' }}
        />
      </div>
    );
  }

  const handleExplainClick = () => {
    setExplainOpen(true);
  };

  const severityConfig = {
    critical: { label: 'حرجة', variant: 'danger' as const, icon: <AlertTriangle size={16} /> },
    moderate: { label: 'متوسطة', variant: 'gap' as const, icon: <Target size={16} /> },
    optional: { label: 'اختيارية', variant: 'outline' as const, icon: <HelpCircle size={16} /> },
  };

  const config = severityConfig[gap.severity];

  return (
    <div className={styles.page} dir="rtl">
      <AnchorNav anchors={M09_ANCHORS} title="شاشات محرك الخطوة التالية (M09)" />

      <header className={styles.detailHeader}>
        <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.M09_OVERVIEW)} leftIcon={<ArrowLeft size={16} />}>
          العودة للنظرة العامة
        </Button>
        <div className={styles.detailHeaderContent}>
          <div className={styles.detailHeaderIcon}>
            <Target size={32} />
          </div>
          <div>
            <h1 className={styles.detailTitle}>{gap.skill}</h1>
            <div className={styles.detailMeta}>
              <span className={styles.detailCategory}>{gap.category}</span>
              <Badge variant={config.variant} size="md" leftIcon={config.icon}>
                {config.label}
              </Badge>
            </div>
          </div>
        </div>
        <Badge variant="proof" size="sm">Q-0323</Badge>
      </header>

      <section className={styles.strengthSection} aria-labelledby="strength-title">
        <h2 id="strength-title" className={styles.sectionTitle}>مستوى المهارة وتحليل الفجوة</h2>
        <div className={styles.strengthGrid}>
          <div className={styles.strengthCard}>
            <h3 className={styles.strengthCardTitle}>المستوى الحالي</h3>
            <div className={styles.strengthValue}>{gap.currentStrength}%</div>
            <Bar value={gap.currentStrength} label="قوة المهارة الحالية" showValue size="lg" variant={gap.currentStrength >= 50 ? 'proof' : 'gap'} />
          </div>
          <div className={styles.strengthCard}>
            <h3 className={styles.strengthCardTitle}>المستوى المستهدف</h3>
            <div className={styles.strengthValue}>{gap.targetStrength || gap.requiredStrength}%</div>
            <Bar value={gap.targetStrength || gap.requiredStrength} label="قوة المهارة المستهدفة" showValue size="lg" variant="proof" />
          </div>
          <div className={`${styles.strengthCard} ${styles.gapDeltaCard}`}>
            <h3 className={styles.strengthCardTitle}>الفجوة المطلوب سدها</h3>
            <div className={`${styles.strengthValue} ${styles.gapDelta}`}>{gap.gapDelta}%</div>
            <Bar value={gap.gapDelta} label="نسبة التحسن المطلوبة" showValue size="lg" variant="gap" />
          </div>
        </div>
      </section>

      <section className={styles.infoSection} aria-labelledby="info-title">
        <h2 id="info-title" className={styles.sectionTitle}>التفاصيل والأثر</h2>
        <div className={styles.infoGrid}>
          <div className={styles.infoCard}>
            <h3 className={styles.infoCardTitle}>
              <HelpCircle size={18} className={styles.infoIcon} /> لماذا هذه الفجوة مهمة؟
            </h3>
            <p className={styles.infoCardText}>{gap.whyItMatters}</p>
            {gap.impact && (
              <p className={`${styles.infoCardText} ${styles.impactDetail}`}>{gap.impact}</p>
            )}
          </div>
          <div className={styles.infoCard}>
            <h3 className={styles.infoCardTitle}>
              <TrendingUp size={18} className={styles.infoIcon} /> الأثر على الفرص
            </h3>
            <div className={styles.impactStats}>
              <div className={styles.impactStat}>
                <span className={styles.impactStatValue}>{gap.opportunityCount}</span>
                <span className={styles.impactStatLabel}>فرص مفتوحة متأثرة</span>
              </div>
              <div className={styles.impactStat}>
                <span className={styles.impactStatValue}>{gap.timeToBridge}</span>
                <span className={styles.impactStatLabel}>الوقت المتوقع للسد</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.pathSection} aria-labelledby="path-title">
        <h2 id="path-title" className={styles.sectionTitle}>المسار المقترح للإثبات</h2>
        <div className={styles.pathCard}>
          {gap.estimatedPath && (
            <div className={styles.pathItem}>
              <h4 className={styles.pathItemTitle}>
                <Clock size={18} className={styles.pathIcon} /> المسار التقديري
              </h4>
              <p className={styles.pathItemText}>{gap.estimatedPath}</p>
            </div>
          )}
          {gap.suggestedAction && (
            <div className={styles.pathItem}>
              <h4 className={styles.pathItemTitle}>
                <Zap size={18} className={styles.pathIcon} /> الإجراء المقترح
              </h4>
              <p className={styles.pathItemText}>{gap.suggestedAction}</p>
            </div>
          )}
          {gap.recommendedAction && (
            <div className={`${styles.pathItem} ${styles.highlight}`}>
              <h4 className={styles.pathItemTitle}>
                <Target size={18} className={styles.pathIcon} /> الإجراء الموصى به (الأولوية القصوى)
              </h4>
              <p className={styles.pathItemText}>{gap.recommendedAction}</p>
            </div>
          )}
        </div>
      </section>

      {(gap.currentEvidence?.length || gap.evidenceMissing?.length) && (
        <section className={styles.evidenceSection} aria-labelledby="evidence-title">
          <h2 id="evidence-title" className={styles.sectionTitle}>الأدلة: الموجودة والمفقودة</h2>
          <div className={styles.evidenceGrid}>
            {gap.currentEvidence?.length && (
              <div className={`${styles.evidenceCard} ${styles.proven}`}>
                <h3 className={styles.evidenceCardTitle}>
                  <Code2 size={18} className={styles.evidenceIcon} /> أدلة حالية ({gap.currentEvidence.length})
                </h3>
                <ul className={styles.evidenceList}>
                  {gap.currentEvidence.map((ev, i) => (
                    <li key={i} className={styles.evidenceListItem}>{ev}</li>
                  ))}
                </ul>
              </div>
            )}
            {gap.evidenceMissing?.length && (
              <div className={`${styles.evidenceCard} ${styles.missing}`}>
                <h3 className={styles.evidenceCardTitle}>
                  <HelpCircle size={18} className={styles.evidenceIcon} /> أدلة مفقودة ({gap.evidenceMissing.length})
                </h3>
                <ul className={styles.evidenceList}>
                  {gap.evidenceMissing.map((ev, i) => (
                    <li key={i} className={styles.evidenceListItem}>{ev}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {(gap.resources?.length || gap.challenge || gap.project) && (
        <section className={styles.resourcesSection} aria-labelledby="resources-title">
          <h2 id="resources-title" className={styles.sectionTitle}>الموارد والتحديات المقترحة</h2>
          <div className={styles.resourcesGrid}>
            {gap.resources?.map((res, i) => (
              <div key={i} className={styles.resourceCard}>
                <h4 className={styles.resourceCardTitle}>{res.title}</h4>
                <p className={styles.resourceCardMeta}>
                  <span>{res.provider}</span>
                  <span>•</span>
                  <span>{res.type}</span>
                  <span>•</span>
                  <span>{res.duration}</span>
                </p>
              </div>
            ))}
            {gap.challenge && (
              <div className={`${styles.resourceCard} ${styles.challenge}`}>
                <h4 className={styles.resourceCardTitle}>
                  <Zap size={18} className={styles.resourceIcon} /> تحدي عملي: {gap.challenge.title}
                </h4>
                <p className={styles.resourceCardMeta}>
                  صعوبة: {gap.challenge.difficulty} • الوقت المتوقع: {gap.challenge.expectedTime}
                </p>
              </div>
            )}
            {gap.project && (
              <div className={`${styles.resourceCard} ${styles.project}`}>
                <h4 className={styles.resourceCardTitle}>
                  <Code2 size={18} className={styles.resourceIcon} /> مشروع مقترح: {gap.project.title}
                </h4>
                <p className={styles.resourceCardText}>{gap.project.description}</p>
              </div>
            )}
          </div>
        </section>
      )}

      <div className={styles.footerActions}>
        <Button variant="proof" size="md" onClick={handleExplainClick} leftIcon={<HelpCircle size={16} />}>
          تفسير الذكاء الاصطناعي للقرار
        </Button>
        <Button variant="outline" size="md" onClick={() => navigate(ROUTES.M09_CREATE)}>
          إنشاء خطة نمو مخصصة
          <ChevronRight size={16} />
        </Button>
      </div>

      <ExplainDrawer
        isOpen={explainOpen}
        onClose={() => setExplainOpen(false)}
        title={`تفسير قرار: ${gap.skill}`}
        conclusion={`تم تصنيف "${gap.skill}" ك${config.label.toLowerCase()} لأن الفجوة تبلغ ${gap.gapDelta}% وتؤثر على ${gap.opportunityCount} فرصة. الإجراء الموصى به: ${gap.recommendedAction || gap.suggestedAction}`}
        evidence={[
          { id: 'gap_analysis', title: `تحليل الفجوة: ${gap.skill}`, type: 'Gap Analysis', status: gap.severity.toUpperCase(), strength: 100 - gap.currentStrength },
          { id: 'current_evidence', title: 'الأدلة الحالية', type: 'Portfolio Evidence', status: gap.currentEvidence?.length ? 'PARTIAL' : 'NONE', strength: gap.currentStrength },
          { id: 'missing_evidence', title: 'الأدلة المفقودة', type: 'Required Evidence', status: 'MISSING', strength: 0 },
        ]}
        inferences={[
          'الخوارزمية تحسب الفجوة كـ (المستهدف - الحالي) وتضربها في وزن الخطورة',
          `الخطورة ${config.label} تعني وزن ${gap.severity === 'critical' ? '0.9' : gap.severity === 'moderate' ? '0.7' : '0.5'}`,
          'التوصية تفضل أقصر مسار لإثبات عملي (تحدي أو مشروع) على التعلم النظري فقط',
        ]}
        confidence={Math.round((gap.severity === 'critical' ? 0.9 : gap.severity === 'moderate' ? 0.7 : 0.5) * 100)}
        unknowns={[
          'مستوى الإتقان الفعلي بعد إكمال المسار المقترح',
          'مدى توفر فرص عملية لتطبيق المهارة في مشاريع حقيقية',
          'توقيت استجابة المنصة للتحديثات الجديدة في ملفك',
        ]}
        nextAction={gap.recommendedAction ? { label: gap.recommendedAction } : gap.suggestedAction ? { label: gap.suggestedAction } : undefined}
      />
    </div>
  );
};

export default M09DetailsPage;