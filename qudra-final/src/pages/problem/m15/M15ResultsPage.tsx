import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import styles from './m15.module.css';
import { ArrowLeft, Sparkles, FileText, CheckCircle, Clock, Search, Download, Copy } from 'lucide-react';
import { ProblemsService } from '../../../services/problems.service';
import { useProblem } from '../../../contexts/useProblem';

interface AnalysisResult {
  problem_id: string;
  project_type: string | null;
  domain: string | null;
  problem_summary: string | null;
  solution_direction: string | null;
  target_users: string[];
  technical_requirements: string[];
  potential_features: string[];
  constraints: string[];
  required_capabilities: Array<{
    capability_id: string;
    name: string;
    category: string | null;
    importance: number | string;
    required_level: string | number;
    reason: string | null;
  }>;
  created_at: string;
}

const MOCK_ANALYSIS: AnalysisResult = {
  problem_id: 'prob_001',
  project_type: 'Mobile App',
  domain: 'Education',
  problem_summary: 'طالب جامعي يحتاج مكانًا مركزيًا لإدارة جدوله الدراسي والمواد.',
  solution_direction: 'تطبيق جوال بقدرات مزامنة سحابية وتنبيهات ذكية.',
  target_users: ['طلاب جامعة', 'طلاب دراسات عليا'],
  technical_requirements: ['React Native / Flutter', 'Node.js/Go Backend', 'PostgreSQL', 'Push Notifications'],
  potential_features: ['مزامنة مع نظام الجامعة', 'تنبيهات قبل المحاضرة', 'مشاركة الجدول مع زملاء'],
  constraints: ['ميزانية محدودة', 'لا فريق DevOps', 'إطلاق خلال فصل دراسي واحد'],
  required_capabilities: [
    { capability_id: 'cap_1', name: 'Mobile Development (React Native / Flutter)', category: 'Engineering', importance: 5, required_level: 'ADVANCED', reason: 'بناء تطبيق جوال أصلي' },
    { capability_id: 'cap_2', name: 'UI/UX Design', category: 'Design', importance: 4, required_level: 'INTERMEDIATE', reason: 'واجهة سهلة للطلاب' },
    { capability_id: 'cap_3', name: 'Backend API & Database', category: 'Engineering', importance: 5, required_level: 'ADVANCED', reason: 'تخزين المواد والمواعيد' },
    { capability_id: 'cap_4', name: 'Product Thinking', category: 'Product', importance: 3, required_level: 'INTERMEDIATE', reason: 'تحديد الميزات الأساسية' },
    { capability_id: 'cap_5', name: 'Authentication & Security', category: 'Engineering', importance: 3, required_level: 'INTERMEDIATE', reason: 'تسجيل دخول آمن للطلاب' },
  ],
  created_at: '2026-09-15T10:45:00Z',
};

export const M15ResultsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { problemText, setProblemText } = useProblem();
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [showExplain, setShowExplain] = useState(false);
  const [copying, setCopying] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        if (id) {
          const data = await ProblemsService.getAnalysis(id);
          setAnalysis({
            problem_id: data.problem_id,
            project_type: data.project_type,
            domain: data.domain,
            problem_summary: data.problem_summary,
            solution_direction: data.solution_direction,
            target_users: data.target_users,
            technical_requirements: data.technical_requirements,
            potential_features: data.potential_features,
            constraints: data.constraints,
            required_capabilities: data.required_capabilities || [],
            created_at: data.created_at,
          });
        } else {
          setAnalysis(MOCK_ANALYSIS);
        }
      } catch {
        setAnalysis(MOCK_ANALYSIS);
      }
      setLoading(false);
    };
    loadData();
  }, [id]);

  const handleCopy = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    setCopying(label);
    setTimeout(() => setCopying(null), 2000);
  };

  const handleExport = () => {
    if (!analysis) return;
    const data = JSON.stringify(analysis, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analysis-${analysis.problem_id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleProceedToCapabilities = () => {
    if (analysis && problemText) {
      setProblemText(problemText);
      navigate('/capabilities');
    }
  };

  const handleStartMatching = () => {
    if (analysis) {
      navigate(`/matching/${analysis.problem_id}`);
    }
  };

  if (loading) {
    return (
      <div className={styles.container} dir="rtl">
        <div className={styles.loadingState}>
          <div className={styles.spinner} />
          <span>جاري تحميل نتائج التحليل...</span>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className={styles.container} dir="rtl">
        <div className={styles.errorState}>
          <FileText className={styles.errorIcon} size={48} />
          <h2 className={styles.errorTitle}>تعذر تحميل التحليل</h2>
          <p className={styles.errorDesc}>التحليل غير موجود أو حدث خطأ في جلب البيانات.</p>
          <Button variant="proof" onClick={() => navigate('/problem')}>← العودة للمشكلات</Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container} dir="rtl">
      <div className={styles.headerRow}>
        <div className={styles.headerContent}>
          <Button variant="ghost" size="sm" onClick={() => navigate('/problem')} leftIcon={<ArrowLeft size={16} />}>
            العودة
          </Button>
          <span className={styles.badgeQ}>M15 · Q-0567 · ⚓ Results</span>
          <h1 className={styles.title}>نتائج التحليل</h1>
          <p className={styles.subtitle}>
            المخرجات الكاملة لتحليل مشكلتك: القدرات المطلوبة، اتجاه الحل، المتطلبات، والقيود.
            كل قدرة مرتبطة بسبب نصي من وصفك الأصلي — لا درجات مخفية.
          </p>
        </div>

        <div className={styles.actionRow}>
          <Button variant="outline" size="md" onClick={() => setShowExplain(!showExplain)} leftIcon={<Sparkles size={16} />}>
            {showExplain ? 'إخفاء التفسير' : 'اشرح لي: كيف أقرأ النتائج؟'}
          </Button>
          <Button variant="outline" size="md" onClick={handleExport} leftIcon={<Download size={16} />}>
            تصدير JSON
          </Button>
        </div>
      </div>

      {showExplain && (
        <div className={styles.explainDrawer}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
            <Sparkles size={18} color="var(--proof)" />
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: 'var(--ink)' }}>
              تفسير الذكاء الاصطناعي: قراءة نتائج التحليل
            </h3>
          </div>
          <p style={{ margin: '0 0 1rem', fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--ink-2)' }}>
            النتائج مقسمة لـ: <strong>القدرات المطلوبة</strong> (مع الأهمية، المستوى، والسبب النصي)،
            <strong>ملخص المشكلة</strong>، <strong>اتجاه الحل</strong>، <strong>المستخدمون المستهدفون</strong>،
            <strong>المتطلبات التقنية</strong>، <strong>الميزات المحتملة</strong>، <strong>القيود</strong>.
            الخطوة التالية: <strong>صفحة القدرات</strong> للمصادقة على المستخرج، ثم <strong>المحاكاة</strong> للاختبار.
          </p>
        </div>
      )}

      <div className={styles.grid3}>
        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>النطاق</span>
          <span className={styles.metricValue}><span className="num">{analysis.domain || '—'}</span></span>
          <span className={styles.metricHint}>تصنيف المجال</span>
        </div>
        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>نوع المشروع</span>
          <span className={styles.metricValue}><span className="num">{analysis.project_type || '—'}</span></span>
          <span className={styles.metricHint}>الحل المقترح</span>
        </div>
        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>القدرات المستخرجة</span>
          <span className={styles.metricValue}><span className="num">{analysis.required_capabilities.length}</span></span>
          <span className={styles.metricHint}>إجمالي القدرات</span>
        </div>
        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>تاريخ التحليل</span>
          <span className={styles.metricValue} style={{ fontSize: '1.1rem' }}>
            <span className="num">{new Date(analysis.created_at).toLocaleDateString('ar-EG')}</span>
          </span>
          <span className={styles.metricHint}>وقت الإنجاز</span>
        </div>
      </div>

      <div className={styles.card}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--ink)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FileText size={22} style={{ color: 'var(--proof)' }} />
          القدرات المطلوبة المستخرجة
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {analysis.required_capabilities.map((cap, idx) => (
            <div key={cap.capability_id} className={styles.capabilityRow}>
              <div className={styles.capInfo}>
                <span className={styles.capIndex}>{idx + 1}</span>
                <div>
                  <h4 className={styles.capName}>{cap.name}</h4>
                  <span className={styles.capCategory}>{cap.category}</span>
                </div>
              </div>
              <div className={styles.capMeta}>
                <span className={styles.importanceBadge} style={{ background: Number(cap.importance) >= 4 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)' }}>
                  أهمية: {cap.importance}/5
                </span>
                <span className={styles.levelBadge} style={{ background: 'rgba(16, 185, 129, 0.15)' }}>
                  {cap.required_level}
                </span>
                <Button variant="ghost" size="sm" onClick={() => handleCopy(cap.reason || '', 'السبب')} leftIcon={<Copy size={12} />} disabled={!cap.reason}>
                  {copying === 'السبب' ? '✓ نسخ' : 'نسخ السبب'}
                </Button>
              </div>
              {cap.reason && (
                <p className={styles.capReason}>{cap.reason}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.card}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--ink)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={22} style={{ color: 'var(--proof)' }} />
          مخرجات التحليل التفصيلية
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          <div className={styles.analysisSection}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={16} style={{ color: 'var(--proof)' }} /> ملخص المشكلة
            </h4>
            <p style={{ color: 'var(--ink-2)', lineHeight: 1.6 }}>{analysis.problem_summary || '—'}</p>
          </div>
          <div className={styles.analysisSection}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={16} style={{ color: 'var(--proof)' }} /> اتجاه الحل
            </h4>
            <p style={{ color: 'var(--ink-2)', lineHeight: 1.6 }}>{analysis.solution_direction || '—'}</p>
          </div>
          <div className={styles.analysisSection}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={16} style={{ color: 'var(--proof)' }} /> المستخدمون المستهدفون
            </h4>
            <ul style={{ margin: 0, paddingRight: '1.25rem', color: 'var(--ink-2)' }}>
              {analysis.target_users.map((u, i) => <li key={i}>{u}</li>)}
            </ul>
          </div>
          <div className={styles.analysisSection}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={16} style={{ color: 'var(--proof)' }} /> المتطلبات التقنية
            </h4>
            <ul style={{ margin: 0, paddingRight: '1.25rem', color: 'var(--ink-2)' }}>
              {analysis.technical_requirements.map((t, i) => <li key={i}>{t}</li>)}
            </ul>
          </div>
          <div className={styles.analysisSection}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={16} style={{ color: 'var(--proof)' }} /> الميزات المحتملة
            </h4>
            <ul style={{ margin: 0, paddingRight: '1.25rem', color: 'var(--ink-2)' }}>
              {analysis.potential_features.map((f, i) => <li key={i}>{f}</li>)}
            </ul>
          </div>
          <div className={styles.analysisSection}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={16} style={{ color: '#EF4444' }} /> القيود
            </h4>
            <ul style={{ margin: 0, paddingRight: '1.25rem', color: 'var(--ink-2)' }}>
              {analysis.constraints.map((c, i) => <li key={i}>{c}</li>)}
            </ul>
          </div>
        </div>
      </div>

      <div className={styles.actionBar}>
        <Button variant="proof" size="lg" onClick={handleProceedToCapabilities} leftIcon={<CheckCircle size={16} />}>
          متابعة للقدرات
        </Button>
        <Button variant="proof" size="lg" onClick={handleStartMatching} leftIcon={<Search size={16} />}>
          بدء المطابقة
        </Button>
        <Button variant="outline" size="lg" onClick={() => navigate('/problem')} leftIcon={<ArrowLeft size={16} />}>
          العودة للمشكلات
        </Button>
      </div>
    </div>
  );
};

export default M15ResultsPage;