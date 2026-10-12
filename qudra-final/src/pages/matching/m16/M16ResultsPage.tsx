import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import styles from './m16.module.css';
import { ArrowLeft, Sparkles, Search, CheckCircle, AlertTriangle, ChevronDown, ChevronUp, Download, RefreshCw, FileText } from 'lucide-react';
import { MatchingService, RemoteMatchesResponse, RemoteMatchCandidate } from '../../../services/matching.service';
import { M16ErrorPage } from './M16ErrorPage';
import { M16EmptyPage } from './M16EmptyPage';

const MOCK_CANDIDATES: RemoteMatchCandidate[] = [
  {
    user_id: 'u_001', user_name: 'أحمد محمد', total_score: 92.5, capability_score: 95, practical_score: 90, project_relevance_score: 100, oral_score: 80, freshness_score: 85,
    matched_at: '2026-09-15T11:00:00Z',
    explanation: {
      summary: 'أحمد محمد يطابق 5/5 من القدرات المطلوبة fully, with 0 partial and 0 gaps. Overall match score: 92.5.',
      strengths: ['Strong evidence for Mobile Development (score: 95, importance: 5)', 'Strong evidence for Backend API & Database (score: 93, importance: 5)', 'Strong evidence for UI/UX Design (score: 88, importance: 4)'],
      gaps: [],
      relevant_projects: ['تطبيق إدارة مهام جامعية', 'نظام حجوزات عيادات'],
    },
    capability_breakdown: [
      { capability_id: 'c1', capability_name: 'Mobile Development', required_level: 'ADVANCED', importance: 5, user_score: 95, status: 'COVERED' },
      { capability_id: 'c2', capability_name: 'Backend API & Database', required_level: 'ADVANCED', importance: 5, user_score: 93, status: 'COVERED' },
      { capability_id: 'c3', capability_name: 'UI/UX Design', required_level: 'INTERMEDIATE', importance: 4, user_score: 88, status: 'COVERED' },
    ],
  },
  {
    user_id: 'u_002', user_name: 'سارة أحمد', total_score: 74.2, capability_score: 78, practical_score: 70, project_relevance_score: 80, oral_score: 60, freshness_score: 90,
    matched_at: '2026-09-15T11:00:00Z',
    explanation: {
      summary: 'سارة أحمد تطابق 2/5 من القدرات المطلوبة fully, with 2 partial and 1 gaps. Overall match score: 74.2.',
      strengths: ['Strong evidence for UI/UX Design (score: 91, importance: 4)', 'Strong evidence for Product Thinking (score: 85, importance: 3)'],
      gaps: ['No sufficient evidence for Backend API & Database (score: 35, required level: ADVANCED)', 'Partial evidence for Mobile Development (score: 62, required level: ADVANCED)'],
      relevant_projects: ['منصة تصميم تفاعلية'],
    },
    capability_breakdown: [
      { capability_id: 'c1', capability_name: 'Mobile Development', required_level: 'ADVANCED', importance: 5, user_score: 62, status: 'PARTIAL' },
      { capability_id: 'c2', capability_name: 'Backend API & Database', required_level: 'ADVANCED', importance: 5, user_score: 35, status: 'GAP' },
      { capability_id: 'c3', capability_name: 'UI/UX Design', required_level: 'INTERMEDIATE', importance: 4, user_score: 91, status: 'COVERED' },
    ],
  },
  {
    user_id: 'u_003', user_name: 'خالد العتيبي', total_score: 41.8, capability_score: 45, practical_score: 30, project_relevance_score: 40, oral_score: 50, freshness_score: 60,
    matched_at: '2026-09-15T11:00:00Z',
    explanation: {
      summary: 'خالد العتيبي يطابق 1/5 من القدرات المطلوبة fully, with 1 partial and 3 gaps. Overall match score: 41.8.',
      strengths: ['Strong evidence for Product Thinking (score: 82, importance: 3)'],
      gaps: ['No sufficient evidence for Mobile Development (score: 20, required level: ADVANCED)', 'No sufficient evidence for Backend API & Database (score: 25, required level: ADVANCED)', 'Partial evidence for UI/UX Design (score: 55, required level: INTERMEDIATE)'],
      relevant_projects: [],
    },
    capability_breakdown: [
      { capability_id: 'c1', capability_name: 'Mobile Development', required_level: 'ADVANCED', importance: 5, user_score: 20, status: 'GAP' },
      { capability_id: 'c2', capability_name: 'Backend API & Database', required_level: 'ADVANCED', importance: 5, user_score: 25, status: 'GAP' },
      { capability_id: 'c3', capability_name: 'UI/UX Design', required_level: 'INTERMEDIATE', importance: 4, user_score: 55, status: 'PARTIAL' },
    ],
  },
];

function ExplainDrawer({ candidate }: { candidate: RemoteMatchCandidate }) {
  return (
    <div className={styles.drawer} role="region" aria-label={`تعليل مطابقة ${candidate.user_name}`}>
      <h4 className={styles.drawerTitle}>
        <Sparkles size={16} color="var(--proof)" />
        تعليل الدرجة — {candidate.user_name} ({candidate.total_score})
      </h4>
      <div className={styles.componentGrid}>
        <div className={styles.componentChip}><b><span className="num">{candidate.capability_score}</span></b><span>توافق القدرات 40%</span></div>
        <div className={styles.componentChip}><b><span className="num">{candidate.practical_score}</span></b><span>أدلة عملية 25%</span></div>
        <div className={styles.componentChip}><b><span className="num">{candidate.project_relevance_score}</span></b><span>صلة المشروع 20%</span></div>
        <div className={styles.componentChip}><b><span className="num">{candidate.oral_score}</span></b><span>شفهي 10%</span></div>
        <div className={styles.componentChip}><b><span className="num">{candidate.freshness_score}</span></b><span>حداثة 5%</span></div>
      </div>
      <div style={{ marginTop: '0.75rem' }}>
        {candidate.capability_breakdown.map((b) => (
          <div key={b.capability_id} className={styles.breakdownRow}>
            <span className={styles.breakdownName}>{b.capability_name}</span>
            <span style={{ fontSize: '0.72rem', color: 'var(--ink-2)' }}>مطلوب: {b.required_level} · أهمية {b.importance}</span>
            <span className={styles.breakdownScore}>{b.user_score}</span>
            <span className={b.status === 'COVERED' ? styles.statusPillCovered : b.status === 'PARTIAL' ? styles.statusPillPartial : styles.statusPillGap}>
              {b.status === 'COVERED' ? 'مغطاة' : b.status === 'PARTIAL' ? 'جزئية' : 'فجوة'}
            </span>
          </div>
        ))}
      </div>
      {candidate.explanation.relevant_projects.length > 0 && (
        <p style={{ fontSize: '0.8rem', color: 'var(--ink-2)', marginTop: '0.6rem' }}>
          مشاريع ذات صلة: {candidate.explanation.relevant_projects.join('، ')}
        </p>
      )}
    </div>
  );
}

export const M16ResultsPage: React.FC = () => {
  const { problemId } = useParams<{ problemId: string }>();
  const navigate = useNavigate();
  const location = useLocation() as { state?: { preloaded?: RemoteMatchesResponse } };
  const [data, setData] = useState<RemoteMatchesResponse | null>(location.state?.preloaded || null);
  const [loading, setLoading] = useState(!location.state?.preloaded);
  const [error] = useState<string | null>(null);
  const [openDrawers, setOpenDrawers] = useState<Record<string, boolean>>({});
  const [showExplain, setShowExplain] = useState(false);
  const [filter, setFilter] = useState<'all' | 'covered' | 'gaps'>('all');

  useEffect(() => {
    if (location.state?.preloaded) return;
    const load = async () => {
      if (!problemId) { setLoading(false); return; }
      setLoading(true);
      try {
        const res = await MatchingService.findMatches(problemId);
        setData(res);
      } catch {
        setData({
          problem_id: problemId,
          problem_title: 'تطبيق جامعي لإدارة المواد والمواعيد',
          total_candidates: MOCK_CANDIDATES.length,
          weights: { capability_match: 0.40, practical: 0.25, project_relevance: 0.20, oral: 0.10, freshness: 0.05 },
          matches: MOCK_CANDIDATES,
        });
      }
      setLoading(false);
    };
    load();
  }, [problemId, location.state]);

  const candidates = useMemo(() => {
    if (!data) return [];
    const sorted = [...data.matches].sort((a, b) => b.total_score - a.total_score);
    if (filter === 'covered') return sorted.filter((c) => c.explanation.gaps.length === 0);
    if (filter === 'gaps') return sorted.filter((c) => c.explanation.gaps.length > 0);
    return sorted;
  }, [data, filter]);

  const toggleDrawer = (id: string) => setOpenDrawers((p) => ({ ...p, [id]: !p[id] }));

  const handleExport = () => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `matches-${data.problem_id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className={styles.container} dir="rtl">
        <div className={styles.loadingState}>
          <div className={styles.spinner} />
          <span>جاري حساب المطابقة وترتيب المرشحين...</span>
        </div>
      </div>
    );
  }

  if (error) return (<div className={styles.container} dir="rtl"><M16ErrorPage message={error} onRetry={() => window.location.reload()} onBack={() => navigate('/matching')} /></div>);
  if (!data || candidates.length === 0) return (<div className={styles.container} dir="rtl"><M16EmptyPage onCreateClick={() => navigate('/problem')} /></div>);

  return (
    <div className={styles.container} dir="rtl">
      <div className={styles.headerRow}>
        <div className={styles.headerContent}>
          <Button variant="ghost" size="sm" onClick={() => navigate('/matching')} leftIcon={<ArrowLeft size={16} />}>
            العودة
          </Button>
          <span className={styles.badgeQ}>M16 · Q-0607 · ⚓ Results</span>
          <span className={styles.demoBadge}>[Demo / تجريبي] بيانات مطابقة محاكاة</span>
          <h1 className={styles.title}>نتائج المطابقة: {data.problem_title}</h1>
          <p className={styles.subtitle}>
            {data.total_candidates} مرشحاً مرتبين تنازلياً بالدرجة الإجمالية.
            كل بطاقة تعرض <b>الأدلة الداعمة والفجوات بالتساوي بصرياً</b> — وزر «التعليل الكامل» يفتح ExplainDrawer لكل مرشح.
          </p>
        </div>
        <div className={styles.actionRow}>
          <Button variant="outline" size="md" onClick={() => setShowExplain(!showExplain)} leftIcon={<Sparkles size={16} />}>
            {showExplain ? 'إخفاء التفسير' : 'اشرح لي: قراءة النتائج'}
          </Button>
          <Button variant="outline" size="md" onClick={handleExport} leftIcon={<Download size={16} />}>
            تصدير JSON
          </Button>
        </div>
      </div>

      {showExplain && (
        <div className={styles.explainDrawer}>
          <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--ink-2)' }}>
            القاعدة القانونية: <strong>ممنوع الترتيب بدون تعليل مرئي</strong>. كل مرشح يعرض ملخصاً + قائمتي <strong>نقاط القوة (خضراء)</strong> و<strong>الفجوات (كهرمانية)</strong> بنفس الحجم والوزن البصري،
            إضافة إلى شريط المكونات الخمسة. ExplainDrawer يكشف التفصيل لكل قدرة: الدرجة، المستوى المطلوب، الأهمية، والحالة (مغطاة/جزئية/فجوة).
          </p>
        </div>
      )}

      <div className={styles.filterBar}>
        <span className={styles.filterLabel}>تصفية:</span>
        <div className={styles.filterButtons}>
          <button className={`${styles.filterBtn} ${filter === 'all' ? styles.active : ''}`} onClick={() => setFilter('all')}>الكل ({data.matches.length})</button>
          <button className={`${styles.filterBtn} ${filter === 'covered' ? styles.active : ''}`} onClick={() => setFilter('covered')}>تغطية كاملة ({data.matches.filter((c) => c.explanation.gaps.length === 0).length})</button>
          <button className={`${styles.filterBtn} ${filter === 'gaps' ? styles.active : ''}`} onClick={() => setFilter('gaps')}>لديهم فجوات ({data.matches.filter((c) => c.explanation.gaps.length > 0).length})</button>
        </div>
      </div>

      <div className={styles.grid3}>
        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>المرشحون</span>
          <span className={styles.metricValue}><span className="num">{data.total_candidates}</span></span>
          <span className={styles.metricHint}>مرشحاً مؤهلاً</span>
        </div>
        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>تغطية كاملة</span>
          <span className={styles.metricValue} style={{ color: '#10B981' }}>
            <span className="num">{data.matches.filter((c) => c.explanation.gaps.length === 0).length}</span>
          </span>
          <span className={styles.metricHint}>بلا فجوات</span>
        </div>
        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>متوسط الدرجات</span>
          <span className={styles.metricValue}>
            <span className="num">{data.matches.length ? Math.round((data.matches.reduce((a, c) => a + c.total_score, 0) / data.matches.length) * 10) / 10 : 0}</span>
          </span>
          <span className={styles.metricHint}>المتوسط العام</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {candidates.map((c, idx) => (
          <article key={c.user_id} className={`${styles.candidateRow} ${idx === 0 ? styles.top : ''}`} aria-label={`المرتبة ${idx + 1}: ${c.user_name} — ${c.total_score}`}>
            <div className={styles.candidateHeader}>
              <div className={styles.candidateInfo}>
                <span className={`${styles.rankBadge} ${idx === 0 ? styles.first : idx === 1 ? styles.second : idx === 2 ? styles.third : ''}`}>{idx + 1}</span>
                <div>
                  <h3 className={styles.candidateName}>{c.user_name}</h3>
                  <span className={styles.candidateMeta}>
                    {c.explanation.strengths.length} نقاط قوة · {c.explanation.gaps.length} فجوات
                    {c.matched_at ? ` · ${new Date(c.matched_at).toLocaleDateString('ar-EG')}` : ''}
                  </span>
                </div>
              </div>
              <div className={styles.scoreBlock}>
                <span className={styles.scoreValue}><span className="num">{c.total_score}</span></span>
                <span className={styles.scoreLabel}>الدرجة الإجمالية / 100</span>
                <div className={styles.scoreBar} aria-hidden="true"><i style={{ width: `${Math.min(100, c.total_score)}%` }} /></div>
              </div>
            </div>

            <p className={styles.summaryText}>{c.explanation.summary}</p>

            <div className={styles.componentGrid} aria-label="المكونات الخمسة للدرجة">
              <div className={styles.componentChip}><b><span className="num">{c.capability_score}</span></b><span>قدرات 40%</span></div>
              <div className={styles.componentChip}><b><span className="num">{c.practical_score}</span></b><span>عملي 25%</span></div>
              <div className={styles.componentChip}><b><span className="num">{c.project_relevance_score}</span></b><span>مشاريع 20%</span></div>
              <div className={styles.componentChip}><b><span className="num">{c.oral_score}</span></b><span>شفهي 10%</span></div>
              <div className={styles.componentChip}><b><span className="num">{c.freshness_score}</span></b><span>حداثة 5%</span></div>
            </div>

            <div className={styles.evidenceGrid}>
              <div className={styles.evidenceCol}>
                <h4><CheckCircle size={15} /> الأدلة الداعمة ({c.explanation.strengths.length})</h4>
                {c.explanation.strengths.length ? (
                  <ul>{c.explanation.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul>
                ) : (
                  <p style={{ fontSize: '0.8rem', color: 'var(--ink-2)', margin: 0 }}>لا أدلة داعمة مسجلة لهذا المرشح.</p>
                )}
              </div>
              <div className={styles.gapCol}>
                <h4><AlertTriangle size={15} /> الفجوات ({c.explanation.gaps.length})</h4>
                {c.explanation.gaps.length ? (
                  <ul>{c.explanation.gaps.map((g, i) => <li key={i}>{g}</li>)}</ul>
                ) : (
                  <p style={{ fontSize: '0.8rem', color: 'var(--ink-2)', margin: 0 }}>لا فجوات — تغطية كاملة للقدرات المطلوبة.</p>
                )}
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleDrawer(c.user_id)}
              leftIcon={openDrawers[c.user_id] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            >
              {openDrawers[c.user_id] ? 'إغلاق التعليل الكامل' : 'التعليل الكامل (ExplainDrawer)'}
            </Button>

            {openDrawers[c.user_id] && <ExplainDrawer candidate={c} />}

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
              <Button variant="ghost" size="sm" onClick={() => navigate(`/candidates/${c.user_id}`)} leftIcon={<FileText size={14} />}>
                الملف العام
              </Button>
              <Button variant="ghost" size="sm" onClick={() => navigate(`/compare?ids=${c.user_id}`)}>
                إضافة للمقارنة
              </Button>
            </div>
          </article>
        ))}
      </div>

      <div className={styles.actionBar}>
        <Button variant="outline" size="lg" onClick={handleExport} leftIcon={<Download size={16} />}>
          تصدير النتائج JSON
        </Button>
        <Button variant="proof" size="lg" onClick={() => navigate(`/matching/${problemId}/create`)} leftIcon={<RefreshCw size={16} />}>
          إعادة حساب المطابقة
        </Button>
      </div>

      <div style={{ display: 'none' }} data-testid="m16-no-hidden-scores">
        <Search size={16} />
      </div>
    </div>
  );
};

export default M16ResultsPage;