import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Target, Zap, CheckCircle2, AlertTriangle, HelpCircle, BookOpen, Code2} from 'lucide-react';
import { ROUTES } from '../../../constants/routes';
import { GapsDataService, GapDetail } from '../../../services/gaps-data';
import { AnchorNav, AnchorLink } from '../../../components/patterns/AnchorNav';
import { DataState } from '../../../components/patterns/DataState';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import styles from './m09.module.css';

const M09_ANCHORS: AnchorLink[] = [
  { id: 'overview', label: 'نظرة عامة', path: ROUTES.M09_OVERVIEW, icon: <Target size={16} /> },
  { id: 'details', label: 'التفاصيل', path: ROUTES.M09_DETAILS, icon: <Zap size={16} /> },
  { id: 'create', label: 'إنشاء خطة', path: ROUTES.M09_CREATE, icon: <CheckCircle2 size={16} /> },
  { id: 'results', label: 'النتائج', path: ROUTES.M09_RESULTS, icon: <Zap size={16} /> },
  { id: 'empty', label: 'الحالة الفارغة', path: ROUTES.M09_EMPTY, icon: <HelpCircle size={16} /> },
  { id: 'error', label: 'معالجة الخطأ', path: ROUTES.M09_ERROR, icon: <AlertTriangle size={16} /> },
];

interface Milestone {
  id: string;
  title: string;
  description: string;
  status: 'not_started' | 'in_progress' | 'completed';
  practiceType: string;
  evidenceGoal: string;
  resources: { title: string; provider: string }[];
}

export const M09CreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [gaps, setGaps] = useState<GapDetail[]>([]);
  const [selectedGapIds, setSelectedGapIds] = useState<string[]>([]);
  const [customGoal, setCustomGoal] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<Milestone[] | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const handleGapToggle = (gapId: string) => {
    setSelectedGapIds(prev => 
      prev.includes(gapId) 
        ? prev.filter(id => id !== gapId)
        : [...prev, gapId]
    );
  };

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const selectedGaps = gaps.filter(g => selectedGapIds.includes(g.id));
      const plan: Milestone[] = selectedGaps.map((gap, index) => ({
        id: `ms_${gap.id}`,
        title: `سد فجوة: ${gap.skill}`,
        description: gap.recommendedAction || gap.suggestedAction || 'إكمال المسار المقترح',
        status: index === 0 ? 'in_progress' : 'not_started',
        practiceType: gap.challenge ? 'تحدي عملي' : 'مشروع تطبيقي',
        evidenceGoal: `إثبات ${gap.skill} بموثوقية ${gap.targetStrength || gap.requiredStrength}%`,
        resources: gap.resources?.map(r => ({ title: r.title, provider: r.provider })) || [],
      }));
      
      setGeneratedPlan(plan);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('فشل إنشاء الخطة'));
    } finally {
      setIsGenerating(false);
    }
  };

  React.useEffect(() => {
    GapsDataService.getGapsData()
      .then(data => setGaps(data.gaps))
      .catch(setError);
  }, []);

  if (error) {
    return (
      <div className={styles.page} dir="rtl">
        <DataState
          state="error"
          title="خطأ في تحميل البيانات"
          message={error.message}
          action={{ label: 'إعادة المحاولة', onClick: () => window.location.reload() }}
        />
      </div>
    );
  }

  return (
    <div className={styles.page} dir="rtl">
      <AnchorNav anchors={M09_ANCHORS} title="شاشات محرك الخطوة التالية (M09)" />

      <header className={styles.header}>
        <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.M09_OVERVIEW)} leftIcon={<ArrowLeft size={16} />}>
          العودة للنظرة العامة
        </Button>
        <div className={styles.headerContent}>
          <div className={styles.headerIcon}>
            <Zap size={32} />
          </div>
          <div>
            <h1 className={styles.title}>إنشاء خطة نمو مخصصة</h1>
            <p className={styles.subtitle}>
              اختر فجوات الكفاءات التي تريد معالجتها، وسننشئ خطة مراحل عملية مع موارد وتحديات محددة
            </p>
          </div>
        </div>
        <Badge variant="proof" size="sm">Q-0324</Badge>
      </header>

      <section className={styles.selectionSection} aria-labelledby="selection-title">
        <h2 id="selection-title" className={styles.sectionTitle}>اختر فجوات الكفاءات المستهدفة</h2>
        <p className={styles.sectionHint}>يمكنك اختيار عدة فجوات — سيتم إنشاء مراحل متسلسلة لكل فجوة</p>
        
        <div className={styles.gapsSelectionGrid}>
          {gaps.map(gap => {
            const isSelected = selectedGapIds.includes(gap.id);
            const severityConfig = {
              critical: { label: 'حرجة', variant: 'danger' as const, borderColor: 'var(--danger)' },
              moderate: { label: 'متوسطة', variant: 'gap' as const, borderColor: 'var(--gap-line)' },
              optional: { label: 'اختيارية', variant: 'outline' as const, borderColor: 'var(--line)' },
            };
            const config = severityConfig[gap.severity];
            
            return (
              <article
                key={gap.id}
                className={`${styles.selectionCard} ${isSelected ? styles.selected : ''}`}
                onClick={() => handleGapToggle(gap.id)}
                style={{ borderColor: isSelected ? 'var(--proof)' : config.borderColor }}
              >
                <div className={styles.selectionCardHeader}>
                  <div className={styles.selectionCheckbox}>
                    {isSelected ? (
                      <CheckCircle2 size={20} color="var(--proof)" />
                    ) : (
                      <div className={styles.emptyCheckbox} />
                    )}
                  </div>
                  <Badge variant={config.variant} size="sm">{config.label}</Badge>
                </div>
                <h3 className={styles.selectionCardSkill}>{gap.skill}</h3>
                <p className={styles.selectionCardDesc}>{gap.whyItMatters}</p>
                <div className={styles.selectionCardMeta}>
                  <span>{gap.currentStrength}% → {gap.targetStrength || gap.requiredStrength}%</span>
                  <span className={styles.gapDelta}>Δ {gap.gapDelta}%</span>
                </div>
                <div className={styles.selectionCardHint}>
                  {gap.challenge ? (
                    <>
                      <Zap size={14} /> تحدي: {gap.challenge.title} ({gap.challenge.expectedTime})
                    </>
                  ) : gap.project ? (
                    <>
                      <Code2 size={14} /> مشروع: {gap.project.title}
                    </>
                  ) : (
                    <>
                      <BookOpen size={14} /> {gap.resources?.length || 0} موارد متاحة
                    </>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {selectedGapIds.length === 0 && (
          <div className={styles.emptySelection}>
            <Target size={48} className={styles.emptyIcon} />
            <h3>لم يتم اختيار أي فجوة بعد</h3>
            <p>اختر فجوة واحدة أو أكثر من الأعلى لبدء إنشاء خطة النمو</p>
          </div>
        )}
      </section>

      {selectedGapIds.length > 0 && (
        <section className={styles.goalSection} aria-labelledby="goal-title">
          <h2 id="goal-title" className={styles.sectionTitle}>الهدف العام للخطة (اختياري)</h2>
          <textarea
            className={styles.goalInput}
            placeholder="مثال: الوصول لمستوى مهندس نظم موزعة رائد خلال 6 أشهر..."
            value={customGoal}
            onChange={e => setCustomGoal(e.target.value)}
            rows={3}
          />
          <p className={styles.goalHint}>هذا الهدف سيظهر في ملخص الخطة ويساعد في ترتيب الأولويات</p>
        </section>
      )}

      <div className={styles.generateSection}>
        <Button
          variant="proof"
          size="lg"
          onClick={handleGeneratePlan}
          disabled={selectedGapIds.length === 0 || isGenerating}
          leftIcon={isGenerating ? null : <Zap size={18} />}
        >
          {isGenerating ? (
            <>
              <span className={styles.spinner} />
              جاري إنشاء الخطة...
            </>
          ) : (
            `إنشاء خطة لـ ${selectedGapIds.length} فجوة${selectedGapIds.length > 1 ? 'ات' : ''}`
          )}
        </Button>
      </div>

      {generatedPlan && (
        <section className={styles.planSection} aria-labelledby="plan-title">
          <h2 id="plan-title" className={styles.sectionTitle}>خطة النمو المولدة ({generatedPlan.length} مراحل)</h2>
          <div className={styles.planCards}>
            {generatedPlan.map((milestone, index) => (
              <article key={milestone.id} className={`${styles.planCard} ${milestone.status}`}>
                <div className={styles.planCardHeader}>
                  <span className={styles.planStepNumber}>المرحلة {index + 1}</span>
                  <Badge 
                    variant={milestone.status === 'completed' ? 'proof' : milestone.status === 'in_progress' ? 'gap' : 'outline'} 
                    size="sm"
                  >
                    {milestone.status === 'completed' ? 'مكتملة' : milestone.status === 'in_progress' ? 'قيد التنفيذ' : 'لم تبدأ'}
                  </Badge>
                </div>
                <h3 className={styles.planCardTitle}>{milestone.title}</h3>
                <p className={styles.planCardDesc}>{milestone.description}</p>
                <div className={styles.planCardMeta}>
                  <span><Code2 size={14} /> {milestone.practiceType}</span>
                  <span><Target size={14} /> {milestone.evidenceGoal}</span>
                </div>
                {milestone.resources.length > 0 && (
                  <div className={styles.planResources}>
                    <h4 className={styles.planResourcesTitle}>الموارد المقترحة:</h4>
                    <ul className={styles.planResourcesList}>
                      {milestone.resources.map((res, i) => (
                        <li key={i}>{res.title} — {res.provider}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </article>
            ))}
          </div>
          <div className={styles.planActions}>
            <Button variant="proof" size="md" onClick={() => navigate(ROUTES.M09_RESULTS)} leftIcon={<CheckCircle2 size={16} />}>
              حفظ وعرض النتائج
            </Button>
            <Button variant="outline" size="md" onClick={() => setGeneratedPlan(null)} leftIcon={<ArrowLeft size={16} />}>
              تعديل الاختيار
            </Button>
          </div>
        </section>
      )}
    </div>
  );
};

export default M09CreatePage;