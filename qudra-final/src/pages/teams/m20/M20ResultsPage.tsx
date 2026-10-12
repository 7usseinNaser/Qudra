import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Bar } from '../../../components/ui/Bar';
import styles from './m20.module.css';
import { ROUTES } from '../../../constants/routes';
import { ArrowRight, Target, CheckCircle, Clock, FileText, Sparkles, Trophy, AlertTriangle, Users, ArrowLeft } from 'lucide-react';

interface TeamResult {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  coveragePercentage: number;
  harmonyScore: number;
  status: 'forming' | 'active' | 'completed' | 'archived';
  topMembers: { name: string; role: string; matchScore: number }[];
  gaps: string[];
  createdAt: string;
}

const MOCK_RESULTS: TeamResult[] = [
  {
    id: 'team_1',
    name: 'فريق صوت المستقبل',
    description: 'فريق لبناء منصة معالجة صوتية ذكية تدعم العربية والإنجليزية',
    memberCount: 4,
    coveragePercentage: 100,
    harmonyScore: 87,
    status: 'active',
    topMembers: [
      { name: 'سارة المنصوري', role: 'lead', matchScore: 95 },
      { name: 'أحمد التميمي', role: 'backend', matchScore: 82 },
      { name: 'نور الهدى', role: 'frontend', matchScore: 78 },
    ],
    gaps: [],
    createdAt: '2026-09-10T10:00:00Z'
  },
  {
    id: 'team_2',
    name: 'فريق لوحات التحكم الذكية',
    description: 'فريق لتطوير لوحة تحكم تحليلية متقدمة للمسابقات والتقييم',
    memberCount: 3,
    coveragePercentage: 83,
    harmonyScore: 84,
    status: 'active',
    topMembers: [
      { name: 'سارة المنصوري', role: 'lead', matchScore: 92 },
      { name: 'ليلى السعيد', role: 'frontend', matchScore: 85 },
      { name: 'عمر عبدالله', role: 'backend', matchScore: 80 },
    ],
    gaps: ['Data Visualization'],
    createdAt: '2026-09-08T10:00:00Z'
  },
  {
    id: 'team_3',
    name: 'فريق RAG العربي',
    description: 'فريق لبناء نظام استرجاع دلالي للوثائق التقنية العربية',
    memberCount: 2,
    coveragePercentage: 60,
    harmonyScore: 72,
    status: 'forming',
    topMembers: [
      { name: 'يوسف النجار', role: 'ai_ml', matchScore: 88 },
      { name: 'سارة المنصوري', role: 'lead', matchScore: 85 },
    ],
    gaps: ['NLP', 'Vector DBs', 'React Frontend'],
    createdAt: '2026-09-14T10:00:00Z'
  }
];

const STATUS_LABEL: Record<string, string> = {
  forming: 'قيد التشكيل',
  active: 'نشط',
  completed: 'مكتمل',
  archived: 'مؤرشف',
};

const STATUS_VARIANT: Record<string, 'proof' | 'gap' | 'claimed' | 'info'> = {
  forming: 'claimed',
  active: 'proof',
  completed: 'info',
  archived: 'gap',
};

export const M20ResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState<TeamResult[]>([]);
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
          <span>جاري تحميل نتائج تركيب الفرق...</span>
        </div>
      </div>
    );
  }

  const activeCount = results.filter(r => r.status === 'active').length;
  const formingCount = results.filter(r => r.status === 'forming').length;
  const avgCoverage = results.length > 0 ? Math.round(results.reduce((sum, r) => sum + r.coveragePercentage, 0) / results.length) : 0;
  const avgHarmony = results.length > 0 ? Math.round(results.reduce((sum, r) => sum + r.harmonyScore, 0) / results.length) : 0;

  return (
    <div className={styles.container} dir="rtl">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.M20_OVERVIEW)} leftIcon={<ArrowLeft size={15} />}>
          العودة للفرق
        </Button>
        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.M20_CREATE)} leftIcon={<Users size={14} />}>
            تشكيل فريق جديد
          </Button>
        </div>
      </div>

      <div className={styles.headerRow}>
        <div className={styles.headerContent}>
          <span className={styles.badgeQ}>M20 · Q-0767 · ⚓ Results</span>
          <span className={styles.demoBadge}>[Demo / تجريبي] نتائج تركيب محاكاة</span>
          <h1 className={styles.title}>نتائج تركيب الفرق</h1>
          <p className={styles.subtitle}>
            بطاقات نتيجة مع سبب كل تركيبة: الفريق، التغطية، التناغم، الأعضاء، والفجوات.
            كل نتيجة مرتبطة بأدلة يمكن فتحها — لا ترتيب بلا تعليل.
          </p>
        </div>
        <div className={styles.actionRow}>
          <Button variant="proof" size="md" onClick={() => navigate(ROUTES.M20_CREATE)} leftIcon={<Users size={16} />}>
            تشكيل فريق جديد
          </Button>
        </div>
      </div>

      <div className={styles.grid4}>
        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>إجمالي الفرق</span>
          <span className={styles.metricValue}><span className="num">{results.length}</span></span>
          <span className={styles.metricHint}>{activeCount} نشطة، {formingCount} قيد التشكيل</span>
        </div>
        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>متوسط التغطية</span>
          <span className={styles.metricValue} style={{ color: '#10B981' }}><span className="num">{avgCoverage}</span>%</span>
          <span className={styles.metricHint}>نسبة المتطلبات المغطاة بقدرات مثبتة</span>
        </div>
        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>متوسط التناغم</span>
          <span className={styles.metricValue} style={{ color: 'var(--proof)' }}><span className="num">{avgHarmony}</span>%</span>
          <span className={styles.metricHint}>درجة تكامل الأعضاء وتوزيع الأدوار</span>
        </div>
        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>فجوات مفتوحة</span>
          <span className={styles.metricValue} style={{ color: '#EF4444' }}><span className="num">{results.reduce((sum, r) => sum + r.gaps.length, 0)}</span></span>
          <span className={styles.metricHint}>قدرات غير مغطاة عبر جميع الفرق</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {results.map((result) => (
          <div key={result.id} className={styles.resultCard}>
            <div className={styles.resultCardHeader}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                  <Trophy size={20} style={{ color: 'var(--proof)' }} />
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--ink)' }}>{result.name}</h3>
                  <Badge variant={STATUS_VARIANT[result.status]} size="sm">{STATUS_LABEL[result.status]}</Badge>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.82rem', color: 'var(--ink-2)' }}>
                  <span><Users size={12} /> {result.memberCount} أعضاء</span>
                  <span><Target size={12} /> تغطية: <strong className="num">{result.coveragePercentage}%</strong></span>
                  <span><Trophy size={12} /> تناغم: <strong className="num">{result.harmonyScore}%</strong></span>
                  <span><AlertTriangle size={12} style={{ color: '#EF4444' }} /> فجوات: <strong>{result.gaps.length}</strong></span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.M20_DETAILS.replace(':id', result.id))}>
                  <FileText size={14} /> التفاصيل
                </Button>
                {result.coveragePercentage >= 80 && (
                  <Button variant="proof" size="sm" onClick={() => navigate(ROUTES.M21_CREATE)}>
                    <ArrowRight size={14} /> مساحة العمل
                  </Button>
                )}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--ink)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>التغطية والتناغم</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                      <span>تغطية</span>
                      <span className="num">{result.coveragePercentage}%</span>
                    </div>
                    <Bar value={result.coveragePercentage} max={100} label="" variant={result.coveragePercentage >= 80 ? 'proof' : 'gap'} size="xs" />
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                      <span>تناغم</span>
                      <span className="num">{result.harmonyScore}%</span>
                    </div>
                    <Bar value={result.harmonyScore} max={100} label="" variant={result.harmonyScore >= 80 ? 'proof' : 'gap'} size="xs" />
                  </div>
                </div>
              </div>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--ink)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>أفضل الأعضاء</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {result.topMembers.map((m, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                      <span>{m.name} ({m.role})</span>
                      <span className="num" style={{ color: 'var(--proof)' }}>{m.matchScore}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {result.gaps.length > 0 && (
              <div style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '10px', padding: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ fontWeight: 700, color: '#EF4444', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
                  <AlertTriangle size={14} /> الفجوات ({result.gaps.length})
                </div>
                <div className={styles.capTags}>
                  {result.gaps.map(g => <Badge key={g} variant="gap" size="xs">{g}</Badge>)}
                </div>
              </div>
            )}

            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1rem' }}>
              <a
                href={`/teams/m20/${result.id}`}
                style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--proof)', padding: '0.5rem 1rem', border: '1px solid rgba(0, 184, 184, 0.3)', borderRadius: '8px', transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(0, 184, 184, 0.1)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <FileText size={14} /> تفصيل الفريق الكامل ومصفوفة التغطية
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
              فرق بتغطية ≥ 80%
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--ink-2)', lineHeight: 1.6 }}>
              {results.filter(r => r.coveragePercentage >= 80).length} فرق جاهزة للتسليم. افتح مساحة العمل (M21) وابدأ التنفيذ.
            </p>
          </div>
          <div style={{ flex: 1, minWidth: '250px', padding: '1rem', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '10px' }}>
            <div style={{ fontWeight: 700, color: 'var(--ink)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Clock size={16} style={{ color: '#F59E0B' }} />
              فرق قيد التشكيل
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--ink-2)', lineHeight: 1.6 }}>
              {formingCount} فرق تحتاج أعضاء إضافيين. راجع الفجوات وابحث عن مرشحين مناسبين.
            </p>
          </div>
          <div style={{ flex: 1, minWidth: '250px', padding: '1rem', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '10px' }}>
            <div style={{ fontWeight: 700, color: 'var(--ink)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <AlertTriangle size={16} style={{ color: '#EF4444' }} />
              فجوات مفتوحة
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--ink-2)', lineHeight: 1.6 }}>
              {results.reduce((sum, r) => sum + r.gaps.length, 0)} قدرات غير مغطاة. استخدم تحديات وموارد لسدها قبل التسليم.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default M20ResultsPage;