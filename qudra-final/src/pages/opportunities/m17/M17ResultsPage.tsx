import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import styles from './m17.module.css';
import { ROUTES } from '../../../constants/routes';
import { ArrowRight, ShieldCheck, Target, CheckCircle, AlertCircle, Clock, FileText, Sparkles, Trophy, AlertTriangle, Building } from 'lucide-react';

interface MatchResult {
  id: string;
  opportunityId: string;
  opportunityTitle: string;
  organization: string;
  type: string;
  matchScore: number;
  status: 'READY' | 'NEAR' | 'FAR';
  provenCount: number;
  gapCount: number;
  summary: string;
  strengths: string[];
  gaps: string[];
  appliedAt: string;
}

const MOCK_RESULTS: MatchResult[] = [
  {
    id: 'mr_1',
    opportunityId: 'opp_1',
    opportunityTitle: 'تطوير بنية REST API لمعالجة الصوتيات',
    organization: 'مختبرات الابتكار الرقمي',
    type: 'project',
    matchScore: 92,
    status: 'READY',
    provenCount: 4,
    gapCount: 0,
    summary: 'ملفك يغطي جميع المتطلبات الحرجة بأدلة مثبتة. FastAPI و PostgreSQL موثقة بمستودعات GitHub حقيقية.',
    strengths: [
      'إثبات كود حي لـ FastAPI مع 12,450 سطر مُحلل',
      'استعلامات PostgreSQL متقدمة موثقة بمشروع إنتاجي',
      'خبرة Docker موثقة بملفات CI/CD حقيقية'
    ],
    gaps: [],
    appliedAt: '2026-09-10T10:00:00Z'
  },
  {
    id: 'mr_2',
    opportunityId: 'opp_2',
    opportunityTitle: 'هندسة واجهات نظام إدارة المسابقات',
    organization: 'حاضنة التكنولوجيا والابتكار',
    type: 'challenge',
    matchScore: 88,
    status: 'NEAR',
    provenCount: 3,
    gapCount: 1,
    summary: 'React و TypeScript مثبتان بقوة. فجوة واحدة في اختبارات الأداء تحتاج إثبات.',
    strengths: [
      'منصة واجهات React موثقة بـ 8,900 سطر TypeScript',
      'معمارية مكونات نظيفة مع إمكانية وصول كاملة',
      'خبرة سابقة في لوحات تحكم تحليلية'
    ],
    gaps: [
      'اختبارات أداء الواجهة تحت الضغط (Load Testing)'
    ],
    appliedAt: '2026-09-12T14:00:00Z'
  },
  {
    id: 'mr_3',
    opportunityId: 'opp_3',
    opportunityTitle: 'بناء نظام RAG للوثائق التقنية العربية',
    organization: 'مركز أبحاث الذكاء الاصطناعي',
    type: 'project',
    matchScore: 71,
    status: 'FAR',
    provenCount: 1,
    gapCount: 3,
    summary: 'أساس قوي في PostgreSQL لكن فجوات في NLP و Vector DBs و React للواجهة.',
    strengths: [
      'استعلامات PostgreSQL معقدة موثقة',
      'فهم جيد لقواعد البيانات المتجهية نظرياً'
    ],
    gaps: [
      'معالجة اللغات الطبيعية (NLP) — لا يوجد مشروع إنتاجي',
      'قواعد البيانات المتجهية (pgvector, Pinecone) — خبرة نظرية فقط',
      'واجهة React للبحث الدلالي — غير مثبتة'
    ],
    appliedAt: '2026-09-15T09:00:00Z'
  }
];

export const M17ResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResults = async () => {
      setLoading(true);
      await new Promise(res => setTimeout(res, 400));
      setResults(MOCK_RESULTS);
      setLoading(false);
    };
    loadResults();
  }, []);

  if (loading) {
    return (
      <div className={styles.container} dir="rtl">
        <div className={styles.loadingState}>
          <div className={styles.spinner} />
          <span>جاري تحميل نتائج المطابقة...</span>
        </div>
      </div>
    );
  }

  const readyCount = results.filter(r => r.status === 'READY').length;
  const nearCount = results.filter(r => r.status === 'NEAR').length;
  const farCount = results.filter(r => r.status === 'FAR').length;

  return (
    <div className={styles.container} dir="rtl">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(ROUTES.M17_OVERVIEW)}
          leftIcon={<ArrowRight size={15} />}
        >
          العودة للفرص
        </Button>

        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.M17_CREATE)} leftIcon={<ShieldCheck size={14} />}>
            نشر فرصة جديدة
          </Button>
        </div>
      </div>

      <div className={styles.headerRow}>
        <div className={styles.headerContent}>
          <span className={styles.badgeQ}>M17 · Q-0647 · ⚓ Results</span>
          <span className={styles.demoBadge}>[Demo / تجريبي] نتائج مطابقة محاكاة</span>
          <h1 className={styles.title}>نتائج مطابقة فرصك</h1>
          <p className={styles.subtitle}>
            بطاقات نتيجة مع سبب كل مطابقة: الفرصة، النسبة، الحالة، القدرات المثبتة، والفجوات.
            كل نتيجة مرتبطة بدليل يمكن فتحه — لا ترتيب بلا تعليل.
          </p>
        </div>

        <div className={styles.actionRow}>
          <Button variant="proof" size="md" onClick={() => navigate(ROUTES.M17_CREATE)} leftIcon={<ShieldCheck size={16} />}>
            نشر فرصة جديدة
          </Button>
        </div>
      </div>

      <div className={styles.grid3}>
        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>جاهز للتقديم (Ready)</span>
          <span className={styles.metricValue} style={{ color: '#10B981' }}><span className="num">{readyCount}</span></span>
          <span className={styles.metricHint}>لا فجوات حرجة — تقديم فوري</span>
        </div>
        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>قريب (Near)</span>
          <span className={styles.metricValue} style={{ color: '#F59E0B' }}><span className="num">{nearCount}</span></span>
          <span className={styles.metricHint}>فجوات قابلة للسد بتحدي/مشروع</span>
        </div>
        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>بعيد (Far)</span>
          <span className={styles.metricValue} style={{ color: '#EF4444' }}><span className="num">{farCount}</span></span>
          <span className={styles.metricHint}>تحتاج تطوير قدرات جوهرية</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {results.map((result) => (
          <div key={result.id} className={styles.resultCard}>
            <div className={styles.resultCardHeader}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                  <Trophy size={20} style={{ color: 'var(--proof)' }} />
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--ink)' }}>
                    {result.opportunityTitle}
                  </h3>
                  <Badge variant={result.type === 'project' ? 'proof' : 'gap'} size="sm">{result.type}</Badge>
                  <span className={styles.verificationStatus + ' ' + result.status.toLowerCase()}>
                    {result.status === 'READY' && <CheckCircle size={12} />}
                    {result.status === 'NEAR' && <Clock size={12} />}
                    {result.status === 'FAR' && <AlertCircle size={12} />}
                    {result.status === 'READY' && 'جاهز'}
                    {result.status === 'NEAR' && 'قريب'}
                    {result.status === 'FAR' && 'بعيد'}
                  </span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.82rem', color: 'var(--ink-2)' }}>
                  <span><Building size={12} /> {result.organization}</span>
                  <span><Target size={12} /> مطابقة: <strong className="num">{result.matchScore}%</strong></span>
                  <span><CheckCircle size={12} style={{ color: '#10B981' }} /> مثبت: <strong>{result.provenCount}</strong></span>
                  <span><AlertTriangle size={12} style={{ color: '#EF4444' }} /> فجوات: <strong>{result.gapCount}</strong></span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.M17_DETAILS.replace(':id', result.opportunityId))}>
                  <FileText size={14} /> عرض الفرصة
                </Button>
                {result.status === 'READY' && (
                  <Button variant="proof" size="sm" onClick={() => navigate(`/opportunities/${result.opportunityId}/apply`)}>
                    <ShieldCheck size={14} /> تقديم الآن
                  </Button>
                )}
                {result.status === 'NEAR' && (
                  <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.M21_CREATE)}>
                    <AlertTriangle size={14} /> سد الفجوات أولاً
                  </Button>
                )}
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontWeight: 600, color: 'var(--ink)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                الملخص والسبب
              </div>
              <p style={{ margin: 0, color: 'var(--ink-2)', lineHeight: 1.6, fontSize: '0.9rem' }}>
                {result.summary}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              {result.strengths.length > 0 && (
                <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '10px', padding: '1rem' }}>
                  <div style={{ fontWeight: 700, color: '#10B981', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <CheckCircle size={16} /> نقاط القوة ({result.strengths.length})
                  </div>
                  <ul style={{ margin: 0, paddingInlineStart: '1.2rem', fontSize: '0.85rem', color: 'var(--ink-2)', lineHeight: 1.8 }}>
                    {result.strengths.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
              )}
              {result.gaps.length > 0 && (
                <div style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '10px', padding: '1rem' }}>
                  <div style={{ fontWeight: 700, color: '#EF4444', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <AlertTriangle size={16} /> الفجوات ({result.gaps.length})
                  </div>
                  <ul style={{ margin: 0, paddingInlineStart: '1.2rem', fontSize: '0.85rem', color: 'var(--ink-2)', lineHeight: 1.8 }}>
                    {result.gaps.map((g, i) => <li key={i}>{g}</li>)}
                  </ul>
                </div>
              )}
            </div>

            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1rem' }}>
              <a
                href={`/opportunities/${result.opportunityId}/match`}
                style={{
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'var(--proof)',
                  padding: '0.5rem 1rem',
                  border: '1px solid rgba(0, 184, 184, 0.3)',
                  borderRadius: '8px',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(0, 184, 184, 0.1)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <FileText size={14} /> تفصيل المطابقة الكامل والأدلة
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.card} style={{ marginTop: '1.5rem' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--ink)', margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={22} style={{ color: '#F59E0B' }} />
          الخطوات التالية
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ flex: 1, minWidth: '250px', padding: '1rem', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '10px' }}>
            <div style={{ fontWeight: 700, color: 'var(--ink)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle size={16} style={{ color: '#10B981' }} />
              فرص Ready — قدّم الآن
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--ink-2)', lineHeight: 1.6 }}>
              {readyCount} فرص مطابقة تماماً. لا تنتظر — قدم الآن وابنِ فريقك من M20.
            </p>
          </div>
          <div style={{ flex: 1, minWidth: '250px', padding: '1rem', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '10px' }}>
            <div style={{ fontWeight: 700, color: 'var(--ink)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Clock size={16} style={{ color: '#F59E0B' }} />
              فرص Near — سد فجوة واحدة
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--ink-2)', lineHeight: 1.6 }}>
              {nearCount} فرص تحتاج فجوة واحدة. راجع خطة سد الفجوة من صفحة التفاصيل.
            </p>
          </div>
          <div style={{ flex: 1, minWidth: '250px', padding: '1rem', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '10px' }}>
            <div style={{ fontWeight: 700, color: 'var(--ink)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <AlertTriangle size={16} style={{ color: '#EF4444' }} />
              فرص Far — خطة نمو طويلة
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--ink-2)', lineHeight: 1.6 }}>
              {farCount} فرص تحتاج تطوير قدرات جوهرية. راجع Growth Plan في Gap Analyzer.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default M17ResultsPage;