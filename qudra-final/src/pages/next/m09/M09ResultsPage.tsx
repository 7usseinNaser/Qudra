import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Target, TrendingUp, CheckCircle2, AlertTriangle, HelpCircle, Award, Clock, BarChart2, ChevronRight, Sparkles } from 'lucide-react';
import { ROUTES } from '../../../constants/routes';
import { AnchorNav, AnchorLink } from '../../../components/patterns/AnchorNav';
import { DataState } from '../../../components/patterns/DataState';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Bar } from '../../../components/ui/Bar';
import { ProvenClaimedBadge } from '../../../components/patterns/ProvenClaimedBadge';
import styles from './m09.module.css';

const M09_ANCHORS: AnchorLink[] = [
  { id: 'overview', label: 'نظرة عامة', path: ROUTES.M09_OVERVIEW, icon: <Target size={16} /> },
  { id: 'details', label: 'التفاصيل', path: ROUTES.M09_DETAILS, icon: <TrendingUp size={16} /> },
  { id: 'create', label: 'إنشاء خطة', path: ROUTES.M09_CREATE, icon: <CheckCircle2 size={16} /> },
  { id: 'results', label: 'النتائج', path: ROUTES.M09_RESULTS, icon: <Award size={16} /> },
  { id: 'empty', label: 'الحالة الفارغة', path: ROUTES.M09_EMPTY, icon: <HelpCircle size={16} /> },
  { id: 'error', label: 'معالجة الخطأ', path: ROUTES.M09_ERROR, icon: <AlertTriangle size={16} /> },
];

interface MilestoneResult {
  id: string;
  title: string;
  status: 'completed' | 'in_progress' | 'not_started';
  evidenceAchieved: string;
  strengthGained: number;
  completedAt?: string;
  practiceType: string;
}

const MOCK_RESULTS: MilestoneResult[] = [
  {
    id: 'ms_gap_1',
    title: 'سد فجوة: معالجة اللغات الطبيعية (NLP)',
    status: 'completed',
    evidenceAchieved: 'مشروع RAG إنتاجي + اختبارات BLEU/ROUGE',
    strengthGained: 45,
    completedAt: '2026-09-15T10:00:00Z',
    practiceType: 'مشروع تطبيقي',
  },
  {
    id: 'ms_gap_2',
    title: 'سد فجوة: إدارة حاويات Docker و Kubernetes',
    status: 'in_progress',
    evidenceAchieved: 'Dockerfile متعدد المراحل + CI Pipeline',
    strengthGained: 15,
    practiceType: 'تحدي عملي',
  },
];

export const M09ResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const [results] = useState<MilestoneResult[]>(MOCK_RESULTS);
  const [isLoading] = useState(false);

  const completedCount = results.filter(r => r.status === 'completed').length;
  const inProgressCount = results.filter(r => r.status === 'in_progress').length;
  const totalStrengthGained = results.reduce((sum, r) => sum + r.strengthGained, 0);

  if (isLoading) {
    return (
      <div className={styles.page} dir="rtl">
        <DataState state="loading" title="جاري تحميل النتائج" message="نجمع بيانات تقدم خطة النمو..." />
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
            <Award size={32} />
          </div>
          <div>
            <h1 className={styles.title}>نتائج خطة النمو</h1>
            <p className={styles.subtitle}>
              تتبع تقدم المراحل، الأدلة المحققة، وتحسن قوة الكفاءات
            </p>
          </div>
        </div>
        <Badge variant="proof" size="sm">Q-0327</Badge>
      </header>

      <section className={styles.summarySection} aria-labelledby="summary-title">
        <h2 id="summary-title" className={styles.sectionTitle}>ملخص التقدم</h2>
        <div className={styles.summaryGrid}>
          <div className={`${styles.summaryCard} ${styles.completed}`}>
            <div className={styles.summaryIcon}>
              <CheckCircle2 size={24} />
            </div>
            <div className={styles.summaryValue}>{completedCount}</div>
            <div className={styles.summaryLabel}>مراحل مكتملة</div>
          </div>
          <div className={`${styles.summaryCard} ${styles.inProgress}`}>
            <div className={styles.summaryIcon}>
              <Clock size={24} />
            </div>
            <div className={styles.summaryValue}>{inProgressCount}</div>
            <div className={styles.summaryLabel}>قيد التنفيذ</div>
          </div>
          <div className={`${styles.summaryCard} ${styles.total}`}>
            <div className={styles.summaryIcon}>
              <TrendingUp size={24} />
            </div>
            <div className={styles.summaryValue}>+{totalStrengthGained}%</div>
            <div className={styles.summaryLabel}>إجمالي تحسن القوة</div>
          </div>
          <div className={`${styles.summaryCard} ${styles.rate}`}>
            <div className={styles.summaryIcon}>
              <BarChart2 size={24} />
            </div>
            <div className={styles.summaryValue}>{Math.round((completedCount / results.length) * 100)}%</div>
            <div className={styles.summaryLabel}>معدل الإنجاز</div>
          </div>
        </div>
      </section>

      <section className={styles.resultsSection} aria-labelledby="results-title">
        <h2 id="results-title" className={styles.sectionTitle}>تفاصيل المراحل ({results.length})</h2>
        <div className={styles.resultsList}>
          {results.map((result, index) => (
            <article key={result.id} className={`${styles.resultCard} ${result.status}`}>
              <div className={styles.resultHeader}>
                <span className={styles.resultStep}>المرحلة {index + 1}</span>
                <ProvenClaimedBadge
                  state={result.status === 'completed' ? 'PROVEN' : result.status === 'in_progress' ? 'IN_PROGRESS' : 'PENDING_REVIEW'}
                  size="md"
                />
              </div>
              <h3 className={styles.resultTitle}>{result.title}</h3>
              <div className={styles.resultMeta}>
                <span className={styles.resultPractice}>
                  <Sparkles size={14} /> {result.practiceType}
                </span>
                {result.completedAt && (
                  <span className={styles.resultDate}>
                    <Clock size={14} /> مكتملة في {new Date(result.completedAt).toLocaleDateString('ar-SA')}
                  </span>
                )}
              </div>
              <div className={styles.resultEvidence}>
                <strong>الأدلة المحققة:</strong> {result.evidenceAchieved}
              </div>
              <div className={styles.resultProgress}>
                <div className={styles.resultProgressLabel}>
                  <span>قوة المهارة المكتسبة</span>
                  <span className={styles.resultStrength}>+{result.strengthGained}%</span>
                </div>
                <Bar 
                  value={Math.min(result.strengthGained * 2, 100)} 
                  showValue 
                  size="sm"
                  variant={result.status === 'completed' ? 'proof' : 'gap'}
                />
              </div>
              {result.status === 'in_progress' && (
                <Button variant="outline" size="sm" className={styles.continueBtn}>
                  متابعة العمل
                  <ChevronRight size={14} />
                </Button>
              )}
            </article>
          ))}
        </div>
      </section>

      {completedCount > 0 && (
        <section className={styles.achievementsSection} aria-labelledby="achievements-title">
          <h2 id="achievements-title" className={styles.sectionTitle}>الإنجازات المفتوحة</h2>
          <div className={styles.achievementsGrid}>
            <div className={styles.achievementCard}>
              <div className={styles.achievementIcon}>
                <Award size={24} />
              </div>
              <h4>شهادة إتمام المرحلة الأولى</h4>
              <p>تم إثبات مهارة NLP بموثوقية 80% عبر مشروع RAG إنتاجي</p>
            </div>
            <div className={styles.achievementCard}>
              <div className={styles.achievementIcon}>
                <TrendingUp size={24} />
              </div>
              <h4>رفع الثقة الهندسية</h4>
              <p>معدل الموثوقية ارتفع من 94% إلى 96% بعد إكمال الدليل العملي</p>
            </div>
            <div className={styles.achievementCard}>
              <div className={styles.achievementIcon}>
                <Sparkles size={24} />
              </div>
              <h4>فرص جديدة متاحة</h4>
              <p>3 مشاريع ذكاء اصطناعي أصبحت متاحة للتقديم بعد سد الفجوة</p>
            </div>
          </div>
        </section>
      )}

      <div className={styles.footerActions}>
        <Button variant="proof" size="md" onClick={() => navigate(ROUTES.M09_OVERVIEW)} leftIcon={<Target size={16} />}>
          إعادة تحليل الفجوات
        </Button>
        <Button variant="outline" size="md" onClick={() => navigate(ROUTES.M09_CREATE)} leftIcon={<ChevronRight size={16} />}>
          تعديل أو تمديد الخطة
        </Button>
      </div>
    </div>
  );
};

export default M09ResultsPage;