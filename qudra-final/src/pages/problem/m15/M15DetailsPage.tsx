import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import styles from './m15.module.css';
import { ArrowLeft, FileText, Sparkles, CheckCircle, Clock, AlertCircle, Copy, Download } from 'lucide-react';
import { ProblemsService } from '../../../services/problems.service';

interface ProblemDetail {
  id: string;
  title: string;
  description: string;
  domain: string | null;
  projectType: string | null;
  status: 'OPEN' | 'IN_ANALYSIS' | 'ANALYZED' | 'MATCHING' | 'RESOLVED';
  createdAt: string;
  updatedAt: string;
  requiredCapabilities: Array<{
    capability_id: string;
    name: string;
    category: string | null;
    importance: number | string;
    required_level: string | number;
    reason: string | null;
  }>;
  analysis?: {
    problem_summary: string | null;
    solution_direction: string | null;
    target_users: string[];
    technical_requirements: string[];
    potential_features: string[];
    constraints: string[];
  };
}

const MOCK_PROBLEM_DETAIL: ProblemDetail = {
  id: 'prob_001',
  title: 'تطبيق جامعي لإدارة المواد والمواعيد',
  description: 'أريد بناء تطبيق يساعد طلاب الجامعة على إيجاد موادهم ومواعيدهم بسهولة.',
  domain: 'Education',
  projectType: 'Mobile App',
  status: 'ANALYZED',
  createdAt: '2026-09-15T10:30:00Z',
  updatedAt: '2026-09-15T10:45:00Z',
  requiredCapabilities: [
    { capability_id: 'cap_1', name: 'Mobile Development (React Native / Flutter)', category: 'Engineering', importance: 5, required_level: 'ADVANCED', reason: 'بناء تطبيق جوال أصلي' },
    { capability_id: 'cap_2', name: 'UI/UX Design', category: 'Design', importance: 4, required_level: 'INTERMEDIATE', reason: 'واجهة سهلة للطلاب' },
    { capability_id: 'cap_3', name: 'Backend API & Database', category: 'Engineering', importance: 5, required_level: 'ADVANCED', reason: 'تخزين المواد والمواعيد' },
    { capability_id: 'cap_4', name: 'Product Thinking', category: 'Product', importance: 3, required_level: 'INTERMEDIATE', reason: 'تحديد الميزات الأساسية' },
    { capability_id: 'cap_5', name: 'Authentication & Security', category: 'Engineering', importance: 3, required_level: 'INTERMEDIATE', reason: 'تسجيل دخول آمن للطلاب' },
  ],
  analysis: {
    problem_summary: 'طالب جامعي يحتاج مكانًا مركزيًا لإدارة جدوله الدراسي والمواد.',
    solution_direction: 'تطبيق جوال بقدرات مزامنة سحابية وتنبيهات ذكية.',
    target_users: ['طلاب جامعة', 'طلاب دراسات عليا'],
    technical_requirements: ['React Native / Flutter', 'Node.js/Go Backend', 'PostgreSQL', 'Push Notifications'],
    potential_features: ['مزامنة مع نظام الجامعة', 'تنبيهات قبل المحاضرة', 'مشاركة الجدول مع زملاء'],
    constraints: ['ميزانية محدودة', 'لا فريق DevOps', 'إطلاق خلال فصل دراسي واحد'],
  }
};

export const M15DetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [problem, setProblem] = useState<ProblemDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showExplain, setShowExplain] = useState(false);
  const [copying, setCopying] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        if (id) {
          const data = await ProblemsService.getById(id);
          let analysis: ProblemDetail['analysis'];
          try {
            const a = await ProblemsService.getAnalysis(id);
            analysis = {
              problem_summary: a.problem_summary,
              solution_direction: a.solution_direction,
              target_users: a.target_users,
              technical_requirements: a.technical_requirements,
              potential_features: a.potential_features,
              constraints: a.constraints,
            };
          } catch {
            analysis = undefined;
          }
          setProblem({
            id: data.id,
            title: data.title,
            description: data.description,
            domain: data.domain,
            projectType: data.project_type,
            status: data.status,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
            requiredCapabilities: data.required_capabilities || [],
            analysis,
          });
        } else {
          setProblem(MOCK_PROBLEM_DETAIL);
        }
      } catch {
        setProblem(MOCK_PROBLEM_DETAIL);
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
    if (!problem) return;
    const data = JSON.stringify(problem, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `problem-${problem.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'ANALYZED': return { label: 'مُحلل', className: styles.statusAnalyzed, icon: <CheckCircle size={12} /> };
      case 'IN_ANALYSIS': return { label: 'قيد التحليل', className: styles.statusAnalyzing, icon: <Clock size={12} /> };
      case 'MATCHING': return { label: 'مطابقة جارية', className: styles.statusMatching, icon: <FileText size={12} /> };
      case 'RESOLVED': return { label: 'مُنجز', className: styles.statusResolved, icon: <CheckCircle size={12} /> };
      default: return { label: 'مفتوح', className: styles.statusOpen, icon: <FileText size={12} /> };
    }
  };

  if (loading) {
    return (
      <div className={styles.container} dir="rtl">
        <div className={styles.loadingState}>
          <div className={styles.spinner} />
          <span>جاري تحميل تفاصيل المشكلة...</span>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className={styles.container} dir="rtl">
        <div className={styles.errorState}>
          <AlertCircle className={styles.errorIcon} size={48} />
          <h2 className={styles.errorTitle}>المشكلة غير موجودة</h2>
          <p className={styles.errorDesc}>تعذر العثور على المشكلة المطلوبة.</p>
          <Button variant="proof" onClick={() => navigate('/problem')}>← العودة للمشكلات</Button>
        </div>
      </div>
    );
  }

  const status = getStatusStyle(problem.status);

  return (
    <div className={styles.container} dir="rtl">
      <div className={styles.headerRow}>
        <div className={styles.headerContent}>
          <Button variant="ghost" size="sm" onClick={() => navigate('/problem')} leftIcon={<ArrowLeft size={16} />}>
            العودة
          </Button>
          <span className={styles.badgeQ}>M15 · Q-0563 · ⚓ Details</span>
          <h1 className={styles.title}>{problem.title}</h1>
          <p className={styles.subtitle}>{problem.description}</p>
        </div>

        <div className={styles.actionRow}>
          <Button
            variant="outline"
            size="md"
            onClick={() => setShowExplain(!showExplain)}
            leftIcon={<Sparkles size={16} />}
          >
            {showExplain ? 'إخفاء التفسير' : 'اشرح لي: مخرجات التحليل'}
          </Button>
          <Button variant="proof" size="md" onClick={handleExport} leftIcon={<Download size={16} />}>
            تصدير JSON
          </Button>
        </div>
      </div>

      {showExplain && (
        <div className={styles.explainDrawer}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
            <Sparkles size={18} color="var(--proof)" />
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: 'var(--ink)' }}>
              تفسير الذكاء الاصطناعي: ما تم استخراجه من نصك
            </h3>
          </div>
          <p style={{ margin: '0 0 1rem', fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--ink-2)' }}>
            التحليل أنتج: <strong>ملخص المشكلة</strong>، <strong>اتجاه الحل</strong>، <strong>المستخدمون المستهدفون</strong>،
            <strong>المتطلبات التقنية</strong>، <strong>الميزات المحتملة</strong>، <strong>القيود</strong>،
            و<strong>القدرات المطلوبة</strong> مع مستوى الأهمية والسبب النصي لكل قدرة.
            لا درجات مخفية — كل قدرة مرتبطة بعبارة من وصفك الأصلي.
          </p>
        </div>
      )}

      <div className={styles.grid3}>
        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>الحالة</span>
          <span className={styles.metricValue} style={{ color: 'var(--ink)' }}>
            <span className={status.className} style={{ fontSize: '1rem', fontWeight: 700 }}>
              {status.icon} {status.label}
            </span>
          </span>
          <span className={styles.metricHint}>الحالة الحالية</span>
        </div>
        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>النطاق</span>
          <span className={styles.metricValue}><span className="num">{problem.domain || '—'}</span></span>
          <span className={styles.metricHint}>تصنيف المجال</span>
        </div>
        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>نوع المشروع</span>
          <span className={styles.metricValue}><span className="num">{problem.projectType || '—'}</span></span>
          <span className={styles.metricHint}>نوع الحل المقترح</span>
        </div>
        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>القدرات المستخرجة</span>
          <span className={styles.metricValue}><span className="num">{problem.requiredCapabilities.length}</span></span>
          <span className={styles.metricHint}>إجمالي القدرات المطلوبة</span>
        </div>
        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>تاريخ الإنشاء</span>
          <span className={styles.metricValue} style={{ fontSize: '1.1rem' }}>
            <span className="num">{new Date(problem.createdAt).toLocaleDateString('ar-EG')}</span>
          </span>
          <span className={styles.metricHint}>تاريخ التسجيل</span>
        </div>
        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>آخر تحديث</span>
          <span className={styles.metricValue} style={{ fontSize: '1.1rem' }}>
            <span className="num">{new Date(problem.updatedAt).toLocaleDateString('ar-EG')}</span>
          </span>
          <span className={styles.metricHint}>آخر تعديل</span>
        </div>
      </div>

      <div className={styles.card}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--ink)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FileText size={22} style={{ color: 'var(--proof)' }} />
          القدرات المطلوبة المستخرجة
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {problem.requiredCapabilities.map((cap, idx) => (
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
                  {copying === 'السبب' ? '✓' : 'نسخ السبب'}
                </Button>
              </div>
              {cap.reason && (
                <p className={styles.capReason}>{cap.reason}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {problem.analysis && (
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
              <p style={{ color: 'var(--ink-2)', lineHeight: 1.6 }}>{problem.analysis.problem_summary || '—'}</p>
            </div>
            <div className={styles.analysisSection}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={16} style={{ color: 'var(--proof)' }} /> اتجاه الحل
              </h4>
              <p style={{ color: 'var(--ink-2)', lineHeight: 1.6 }}>{problem.analysis.solution_direction || '—'}</p>
            </div>
            <div className={styles.analysisSection}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={16} style={{ color: 'var(--proof)' }} /> المستخدمون المستهدفون
              </h4>
              <ul style={{ margin: 0, paddingRight: '1.25rem', color: 'var(--ink-2)' }}>
                {problem.analysis.target_users.map((u, i) => <li key={i}>{u}</li>)}
              </ul>
            </div>
            <div className={styles.analysisSection}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={16} style={{ color: 'var(--proof)' }} /> المتطلبات التقنية
              </h4>
              <ul style={{ margin: 0, paddingRight: '1.25rem', color: 'var(--ink-2)' }}>
                {problem.analysis.technical_requirements.map((t, i) => <li key={i}>{t}</li>)}
              </ul>
            </div>
            <div className={styles.analysisSection}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={16} style={{ color: 'var(--proof)' }} /> الميزات المحتملة
              </h4>
              <ul style={{ margin: 0, paddingRight: '1.25rem', color: 'var(--ink-2)' }}>
                {problem.analysis.potential_features.map((f, i) => <li key={i}>{f}</li>)}
              </ul>
            </div>
            <div className={styles.analysisSection}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertCircle size={16} style={{ color: '#EF4444' }} /> القيود
              </h4>
              <ul style={{ margin: 0, paddingRight: '1.25rem', color: 'var(--ink-2)' }}>
                {problem.analysis.constraints.map((c, i) => <li key={i}>{c}</li>)}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className={styles.actionBar}>
        {problem.status === 'ANALYZED' && (
          <Button variant="proof" size="lg" onClick={() => navigate(`/matching/${problem.id}`)} leftIcon={<FileText size={16} />}>
            الانتقال للمطابقة
          </Button>
        )}
        {problem.status === 'IN_ANALYSIS' && (
          <Button variant="outline" size="lg" disabled leftIcon={<Clock size={16} />}>
            التحليل قيد التنفيذ...
          </Button>
        )}
        {problem.status === 'OPEN' && (
          <Button variant="proof" size="lg" onClick={() => navigate(`/problem/analysis/${problem.id}`)} leftIcon={<Sparkles size={16} />}>
            بدء التحليل
          </Button>
        )}
      </div>
    </div>
  );
};

export default M15DetailsPage;