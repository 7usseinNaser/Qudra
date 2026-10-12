import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, AlertTriangle, HelpCircle, Target, Brain, Zap} from 'lucide-react';
import { ROUTES } from '../../../constants/routes';
import { GapsDataService, GapsDataResponse } from '../../../services/gaps-data';
import { ExplainDrawer } from '../../../components/patterns/ExplainDrawer';
import { AnchorNav, AnchorLink } from '../../../components/patterns/AnchorNav';
import { DataState } from '../../../components/patterns/DataState';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import styles from './m09.module.css';

const M09_ANCHORS: AnchorLink[] = [
  { id: 'overview', label: 'نظرة عامة', path: ROUTES.M09_OVERVIEW, icon: <Sparkles size={16} /> },
  { id: 'details', label: 'التفاصيل', path: ROUTES.M09_DETAILS, icon: <Target size={16} /> },
  { id: 'create', label: 'إنشاء خطة', path: ROUTES.M09_CREATE, icon: <Zap size={16} /> },
  { id: 'results', label: 'النتائج', path: ROUTES.M09_RESULTS, icon: <Brain size={16} /> },
  { id: 'empty', label: 'الحالة الفارغة', path: ROUTES.M09_EMPTY, icon: <HelpCircle size={16} /> },
  { id: 'error', label: 'معالجة الخطأ', path: ROUTES.M09_ERROR, icon: <AlertTriangle size={16} /> },
];

export const M09OverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<GapsDataResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [explainOpen, setExplainOpen] = useState(false);

  useEffect(() => {
    GapsDataService.getGapsData()
      .then(setData)
      .catch(setError)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className={styles.page} dir="rtl">
        <DataState state="loading" title="جاري تحليل الفجوات" message="نقرأ بيانات الكفاءات ونحدد الخطوة التالية المثلى..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page} dir="rtl">
        <DataState
          state="error"
          title="تعذر تحميل محرك الخطوة التالية"
          message={error.message}
          action={{ label: 'إعادة المحاولة', onClick: () => window.location.reload() }}
        />
      </div>
    );
  }

  if (!data) {
    return (
      <div className={styles.page} dir="rtl">
        <DataState state="empty" title="لا توجد بيانات فجوات" message="لم يتم العثور على فجوات كفاءات في ملفك الحالي." />
      </div>
    );
  }

  const { gaps, primaryGap, nextBestAction, unknowns, timestamp } = data;

  const handleExplainClick = () => {
    setExplainOpen(true);
  };

  return (
    <div className={styles.page} dir="rtl">
      <AnchorNav anchors={M09_ANCHORS} title="شاشات محرك الخطوة التالية (M09)" />

      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerIcon}>
            <Sparkles size={32} />
          </div>
          <div>
            <h1 className={styles.title}>محرك الخطوة التالية (Next Step Engine)</h1>
            <p className={styles.subtitle}>
              تحليل فجوات الكفاءات الحقيقي وتوصية إجراء واحد محدد بدقة مبني على الفجوة الكبرى
            </p>
          </div>
        </div>
        <div className={styles.headerMeta}>
          <Badge variant="proof" size="sm">Q-0321</Badge>
          <span className={styles.timestamp}>آخر تحديث: {new Date(timestamp).toLocaleString('ar-SA')}</span>
        </div>
      </header>

      {primaryGap && (
        <section className={styles.primaryGapSection} aria-labelledby="primary-gap-title">
          <div className={styles.primaryGapCard}>
            <div className={styles.primaryGapHeader}>
              <h2 id="primary-gap-title" className={styles.primaryGapTitle}>الفجوة الكبرى المحددة</h2>
              <Badge variant={primaryGap.severity === 'critical' ? 'danger' : primaryGap.severity === 'moderate' ? 'gap' : 'outline'} size="md">
                {primaryGap.severity === 'critical' ? 'حرجة' : primaryGap.severity === 'moderate' ? 'متوسطة' : 'اختيارية'}
              </Badge>
            </div>
            <div className={styles.primaryGapBody}>
              <div className={styles.gapInfo}>
                <h3 className={styles.gapSkill}>{primaryGap.skill}</h3>
                <p className={styles.gapCategory}>{primaryGap.category}</p>
                <div className={styles.gapStrengths}>
                  <div className={styles.strengthItem}>
                    <span className={styles.strengthLabel}>المستوى الحالي</span>
                    <span className={styles.strengthValue}>{primaryGap.currentStrength}%</span>
                  </div>
                  <div className={styles.strengthItem}>
                    <span className={styles.strengthLabel}>المستوى المستهدف</span>
                    <span className={styles.strengthValue}>{primaryGap.targetStrength || primaryGap.requiredStrength}%</span>
                  </div>
                  <div className={styles.strengthItem}>
                    <span className={styles.strengthLabel}>الفجوة</span>
                    <span className={`${styles.strengthValue} ${styles.gapDelta}`}>{primaryGap.gapDelta}%</span>
                  </div>
                </div>
              </div>
              <div className={styles.gapImpact}>
                <h4>الأثر والأهمية</h4>
                <p>{primaryGap.whyItMatters}</p>
                <p className={styles.impactDetail}>{primaryGap.impact}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className={styles.actionSection} aria-labelledby="next-action-title">
        <h2 id="next-action-title" className={styles.sectionTitle}>الخطوة التالية الموصى بها</h2>
        <div className={styles.actionCard}>
          <div className={styles.actionMain}>
            <div className={styles.actionIcon}>
              <ArrowRight size={28} />
            </div>
            <div className={styles.actionContent}>
              <h3 className={styles.actionLabel}>{nextBestAction?.label || 'لا توجد فجوات حرجة'}</h3>
              <p className={styles.actionReasoning}>{nextBestAction?.reasoning || 'ملفك قوي بجميع الكفاءات المطلوبة.'}</p>
              <div className={styles.actionConfidence}>
                <span>الثقة: <strong>{nextBestAction?.confidence || 0}%</strong></span>
                <div className={styles.confidenceBar}>
                  <div className={styles.confidenceFill} style={{ width: `${nextBestAction?.confidence || 0}%` }} />
                </div>
              </div>
            </div>
          </div>
          <div className={styles.actionButtons}>
            {nextBestAction?.href ? (
              <a href={nextBestAction.href} className={styles.primaryBtn} target="_blank" rel="noopener noreferrer">
                <ArrowRight size={16} /> بدء الإجراء
              </a>
            ) : nextBestAction?.onClick ? (
              <Button variant="proof" size="md" onClick={nextBestAction.onClick} leftIcon={<ArrowRight size={16} />}>
                بدء الإجراء
              </Button>
            ) : (
              <Button variant="outline" size="md" onClick={() => navigate(ROUTES.CHALLENGES || '/challenges')} leftIcon={<ArrowRight size={16} />}>
                استكشاف التحديات
              </Button>
            )}
            <Button variant="ghost" size="md" onClick={handleExplainClick} leftIcon={<HelpCircle size={16} />}>
              تفسير الذكاء الاصطناعي
            </Button>
          </div>
        </div>
      </section>

      <section className={styles.gapsSection} aria-labelledby="all-gaps-title">
        <div className={styles.sectionHeader}>
          <h2 id="all-gaps-title" className={styles.sectionTitle}>جميع فجوات الكفاءات ({gaps.length})</h2>
          <Badge variant="outline" size="sm">{gaps.filter(g => g.severity === 'critical').length} حرجة · {gaps.filter(g => g.severity === 'moderate').length} متوسطة</Badge>
        </div>
        <div className={styles.gapsGrid}>
          {gaps.map(gap => (
            <article key={gap.id} className={`${styles.gapCard} ${gap.severity === 'critical' ? styles.critical : ''} ${gap.severity === 'moderate' ? styles.moderate : ''}`}>
              <div className={styles.gapCardHeader}>
                <h4 className={styles.gapCardSkill}>{gap.skill}</h4>
                <Badge 
                  variant={gap.severity === 'critical' ? 'danger' : gap.severity === 'moderate' ? 'gap' : 'outline'} 
                  size="sm"
                >
                  {gap.severity === 'critical' ? 'حرجة' : gap.severity === 'moderate' ? 'متوسطة' : 'اختيارية'}
                </Badge>
              </div>
              <p className={styles.gapCardDesc}>{gap.whyItMatters}</p>
              <div className={styles.gapCardMeta}>
                <span>{gap.currentStrength}% → {gap.targetStrength || gap.requiredStrength}%</span>
                <span className={styles.gapDelta}>Δ {gap.gapDelta}%</span>
              </div>
              <div className={styles.gapCardActions}>
                <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.M09_DETAILS)}>
                  عرض التفاصيل
                </Button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {unknowns.length > 0 && (
        <section className={styles.unknownsSection} aria-labelledby="unknowns-title">
          <h2 id="unknowns-title" className={styles.sectionTitle}>المجاهيل / ما لا نعلمه</h2>
          <ul className={styles.unknownsList}>
            {unknowns.map((u, i) => (
              <li key={i} className={styles.unknownItem}>
                <HelpCircle size={16} className={styles.unknownIcon} />
                {u}
              </li>
            ))}
          </ul>
        </section>
      )}

      <ExplainDrawer
        isOpen={explainOpen}
        onClose={() => setExplainOpen(false)}
        title="تفسير قرار محرك الخطوة التالية"
        conclusion={primaryGap 
          ? `تم تحديد "${primaryGap.skill}" كأكبر فجوة لأنها تؤثر على ${primaryGap.opportunityCount} فرصة مفتوحة وتتطلب ${primaryGap.gapDelta}% تحسين للوصول للمستوى المستهدف.`
          : 'لا توجد فجوات حرجة في ملفك الحالي. جميع الكفاءات الأساسية مثبتة بأدلة قوية.'}
        evidence={primaryGap ? [
          {
            id: 'primary_gap',
            title: `الفجوة الكبرى: ${primaryGap.skill}`,
            type: 'Gap Analysis',
            status: primaryGap.severity.toUpperCase(),
            strength: 100 - primaryGap.currentStrength,
          },
          {
            id: 'current_evidence',
            title: 'الأدلة الحالية في الملف',
            type: 'Portfolio Evidence',
            status: primaryGap.currentEvidence?.length ? 'PARTIAL' : 'NONE',
            strength: primaryGap.currentStrength,
          },
        ] : []}
        inferences={[
          'الخوارزمية تركز على الفجوة ذات التأثير الأكبر على فرص العمل المتاحة',
          'يتم ترجيح الفجوات الحرجة (Critical) بأولوية أعلى من المتوسطة',
          'التوصية تستند لأقصر مسار لإثبات الكفاءة (تحدي عملي أو مشروع)',
        ]}
        confidence={nextBestAction?.confidence || 0}
        unknowns={unknowns}
        nextAction={nextBestAction ? {
          label: nextBestAction.label,
          href: nextBestAction.href,
          onClick: nextBestAction.onClick,
        } : undefined}
      />
    </div>
  );
};

export default M09OverviewPage;