import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import styles from './m15.module.css';
import { PlusCircle, Search, Sparkles, FileText, CheckCircle, Clock } from 'lucide-react';
import { M15EmptyPage } from './M15EmptyPage';
import { ProblemsService, CreateProblemPayload } from '../../../services/problems.service';
import { useProblem } from '../../../contexts/useProblem';

interface ProblemSummary {
  id: string;
  title: string;
  description: string;
  domain: string | null;
  status: 'OPEN' | 'IN_ANALYSIS' | 'ANALYZED' | 'MATCHING' | 'RESOLVED';
  createdAt: string;
  updatedAt: string;
  requiredCapabilitiesCount: number;
}

const MOCK_PROBLEMS: ProblemSummary[] = [
  {
    id: 'prob_001',
    title: 'تطبيق جامعي لإدارة المواد والمواعيد',
    description: 'أريد بناء تطبيق يساعد طلاب الجامعة على إيجاد موادهم ومواعيدهم بسهولة.',
    domain: 'Education',
    status: 'ANALYZED',
    createdAt: '2026-09-15T10:30:00Z',
    updatedAt: '2026-09-15T10:45:00Z',
    requiredCapabilitiesCount: 5
  },
  {
    id: 'prob_002',
    title: 'نظام تحليل مكالمات مركز الاتصال',
    description: 'عندنا مركز اتصال يستقبل 400 مكالمة عربية يوميًا، ونريد تحويلها إلى نص وتحليل الشكاوى.',
    domain: 'Customer Support',
    status: 'IN_ANALYSIS',
    createdAt: '2026-09-10T09:15:00Z',
    updatedAt: '2026-09-10T09:15:00Z',
    requiredCapabilitiesCount: 4
  },
  {
    id: 'prob_003',
    title: 'متجر إلكتروني للمنتجات اليدوية',
    description: 'أريد متجرًا إلكترونيًا صغيرًا لبيع منتجات يدوية، مع دفع إلكتروني وتتبّع للطلبات.',
    domain: 'E-commerce',
    status: 'MATCHING',
    createdAt: '2026-09-05T16:45:00Z',
    updatedAt: '2026-09-08T11:30:00Z',
    requiredCapabilitiesCount: 6
  }
];

export const M15OverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { setProblemText } = useProblem();
  const [problems, setProblems] = useState<ProblemSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [showExplain, setShowExplain] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await ProblemsService.getAll();
        setProblems(data.map(p => ({
          id: p.id,
          title: p.title,
          description: p.description,
          domain: p.domain,
          status: p.status,
          createdAt: p.created_at,
          updatedAt: p.updated_at,
          requiredCapabilitiesCount: p.required_capabilities?.length || 0
        })));
      } catch {
        setProblems(MOCK_PROBLEMS);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  const handleCreateProblem = async (title: string, description: string, domain?: string) => {
    setCreating(true);
    try {
      const payload: CreateProblemPayload = { title, description, domain };
      const result = await ProblemsService.create(payload);
      setProblemText(description);
      navigate(`/problem/analysis/${result.id}`);
    } catch {
      // fallback to mock
      const newProblem: ProblemSummary = {
        id: `prob_${Date.now()}`,
        title,
        description,
        domain: domain || 'General',
        status: 'OPEN',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        requiredCapabilitiesCount: 0
      };
      setProblems(prev => [newProblem, ...prev]);
      setProblemText(description);
      navigate(`/problem/analysis/${newProblem.id}`);
    }
    setCreating(false);
  };

  const handleQuickCreate = (example: string) => {
    const title = example.slice(0, 50) + (example.length > 50 ? '...' : '');
    handleCreateProblem(title, example);
  };

  if (loading) {
    return (
      <div className={styles.container} dir="rtl">
        <div className={styles.loadingState}>
          <div className={styles.spinner} />
          <span>جاري تحميل مشاكلك...</span>
        </div>
      </div>
    );
  }

  if (problems.length === 0) {
    return (
      <div className={styles.container} dir="rtl">
        <M15EmptyPage onCreateClick={() => navigate('/problem/create')} />
      </div>
    );
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'ANALYZED': return { label: 'مُحلل', className: styles.statusAnalyzed, icon: <CheckCircle size={12} /> };
      case 'IN_ANALYSIS': return { label: 'قيد التحليل', className: styles.statusAnalyzing, icon: <Clock size={12} /> };
      case 'MATCHING': return { label: 'مطابقة جارية', className: styles.statusMatching, icon: <Search size={12} /> };
      case 'RESOLVED': return { label: 'مُنجز', className: styles.statusResolved, icon: <CheckCircle size={12} /> };
      default: return { label: 'مفتوح', className: styles.statusOpen, icon: <FileText size={12} /> };
    }
  };

  return (
    <div className={styles.container} dir="rtl">
      <div className={styles.headerRow}>
        <div className={styles.headerContent}>
          <span className={styles.badgeQ}>M15 · Q-0561 · ⚓ Overview</span>
          <span className={styles.demoBadge}>[Demo / تجريبي] بيانات مشكلات محاكاة</span>
          <h1 className={styles.title}>إدخال المشكلة وتحليلها: نظرة عامة</h1>
          <p className={styles.subtitle}>
            ملخص مشكلاتك: العنوان، الوصف، النطاق، الحالة، وعدد القدرات المطلوبة المستخرجة.
            كل مشكلة قابلة للفتح للتحليل التفصيلي أو المتابعة نحو المطابقة.
          </p>
        </div>

        <div className={styles.actionRow}>
          <Button
            variant="proof"
            size="md"
            onClick={() => navigate('/problem/create')}
            leftIcon={<PlusCircle size={16} />}
            disabled={creating}
          >
            {creating ? 'جاري الإنشاء...' : 'مشكلة جديدة'}
          </Button>

          <Button
            variant="outline"
            size="md"
            onClick={() => setShowExplain(!showExplain)}
            leftIcon={<Sparkles size={16} />}
          >
            {showExplain ? 'إخفاء التفسير' : 'اشرح لي: دورة حياة المشكلة'}
          </Button>
        </div>
      </div>

      {showExplain && (
        <div className={styles.explainDrawer}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
            <Sparkles size={18} color="var(--proof)" />
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: 'var(--ink)' }}>
              تفسير الذكاء الاصطناعي: من النص إلى القدرات
            </h3>
          </div>
          <p style={{ margin: '0 0 1rem', fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--ink-2)' }}>
            المشكلة تمر بـ 6 مراحل تحليل مرئية: <strong>فهم المشكلة → التصنيف → النتيجة المطلوبة →
            استخراج القدرات → توليد المحاكاة → تجهيز معايير التقييم</strong>.
            لا درجات مخفية — كل مرحلة تعرض مخرجاتها بوضوح قبل الانتقال للخطوة التالية.
          </p>
          <div className={styles.grid3} style={{ marginBottom: 0 }}>
            <div className={styles.metricBox}>
              <span className={styles.metricLabel}>مراحل التحليل</span>
              <span className={styles.metricHint}>6 مراحل مرئية مع مخرجات حقيقية</span>
            </div>
            <div className={styles.metricBox}>
              <span className={styles.metricLabel}>لا درجات مخفية</span>
              <span className={styles.metricHint}>كل استخراج قدرة له دليل نصي من مشكلتك</span>
            </div>
            <div className={styles.metricBox}>
              <span className={styles.metricLabel}>انتقال تلقائي</span>
              <span className={styles.metricHint}>بعد التحليل → صفحة القدرات للمصادقة</span>
            </div>
          </div>
        </div>
      )}

      <div className={styles.grid3}>
        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>إجمالي المشكلات</span>
          <span className={styles.metricValue}><span className="num">{problems.length}</span></span>
          <span className={styles.metricHint}>مشكلات مسجلة</span>
        </div>
        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>مُحللة</span>
          <span className={styles.metricValue} style={{ color: '#10B981' }}>
            <span className="num">{problems.filter(p => p.status === 'ANALYZED').length}</span>
          </span>
          <span className={styles.metricHint}>جاهزة للمطابقة</span>
        </div>
        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>قيد التحليل</span>
          <span className={styles.metricValue} style={{ color: '#F59E0B' }}>
            <span className="num">{problems.filter(p => p.status === 'IN_ANALYSIS').length}</span>
          </span>
          <span className={styles.metricHint}>تحليل جارٍ</span>
        </div>
      </div>

      <div className={styles.card}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--ink)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FileText size={22} style={{ color: 'var(--proof)' }} />
          مشاكلك المسجلة
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {problems.map(problem => {
            const status = getStatusStyle(problem.status);
            return (
              <div key={problem.id} className={styles.problemCard}>
                <div className={styles.problemCardHeader}>
                  <div>
                    <h3 className={styles.problemName}>{problem.title}</h3>
                    <span className={styles.problemDomain}>
                      {problem.domain && <span>{problem.domain}</span>}
                    </span>
                  </div>
                  <span className={status.className}>
                    {status.icon} {status.label}
                  </span>
                </div>

                <p className={styles.problemDescription}>{problem.description}</p>

                <div className={styles.problemMeta}>
                  <span className={styles.metaItem}>
                    <FileText size={14} /> قدرات مطلوبة: {problem.requiredCapabilitiesCount}
                  </span>
                  <span className={styles.metaItem}>
                    <Clock size={14} /> تحديث: {new Date(problem.updatedAt).toLocaleDateString('ar-EG')}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                  <Button variant="outline" size="sm" onClick={() => navigate(`/problem/analysis/${problem.id}`)}>
                    <FileText size={14} /> عرض التحليل
                  </Button>
                  {problem.status === 'ANALYZED' && (
                    <Button variant="proof" size="sm" onClick={() => navigate(`/matching/${problem.id}`)}>
                      <Search size={14} /> بدء المطابقة
                    </Button>
                  )}
                  {problem.status === 'IN_ANALYSIS' && (
                    <Button variant="outline" size="sm" disabled>
                      <Clock size={14} /> قيد التحليل
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.quickExamples}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '1rem' }}>
          أمثلة سريعة للبدء
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          {[
            'أريد بناء تطبيق يساعد طلاب الجامعة على إيجاد موادهم ومواعيدهم بسهولة.',
            'عندنا مركز اتصال يستقبل 400 مكالمة عربية يوميًا، ونريد تحويلها إلى نص وتحليل الشكاوى.',
            'أريد متجرًا إلكترونيًا صغيرًا لبيع منتجات يدوية، مع دفع إلكتروني وتتبّع للطلبات.',
          ].map((ex, i) => (
            <button
              key={i}
              className={styles.exampleBtn}
              onClick={() => handleQuickCreate(ex)}
              disabled={creating}
            >
              {ex.slice(0, 40)}...
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default M15OverviewPage;