import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import styles from './m16.module.css';
import { PlusCircle, Search, Sparkles, FileText, AlertCircle, CheckCircle, Clock, Filter } from 'lucide-react';
import { M16EmptyPage } from './M16EmptyPage';

interface MatchSummary {
  id: string;
  problemId: string;
  problemTitle: string;
  totalCandidates: number;
  topScore: number;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'FAILED';
  createdAt: string;
  weights: Record<string, number>;
}

const MOCK_MATCHES: MatchSummary[] = [
  {
    id: 'match_001',
    problemId: 'prob_001',
    problemTitle: 'تطبيق جامعي لإدارة المواد والمواعيد',
    totalCandidates: 12,
    topScore: 92.5,
    status: 'COMPLETED',
    createdAt: '2026-09-15T11:00:00Z',
    weights: { capability_match: 0.40, practical: 0.25, project_relevance: 0.20, oral: 0.10, freshness: 0.05 }
  },
  {
    id: 'match_002',
    problemId: 'prob_002',
    problemTitle: 'نظام تحليل مكالمات مركز الاتصال',
    totalCandidates: 8,
    topScore: 78.3,
    status: 'COMPLETED',
    createdAt: '2026-09-12T14:30:00Z',
    weights: { capability_match: 0.40, practical: 0.25, project_relevance: 0.20, oral: 0.10, freshness: 0.05 }
  },
  {
    id: 'match_003',
    problemId: 'prob_003',
    problemTitle: 'متجر إلكتروني للمنتجات اليدوية',
    totalCandidates: 15,
    topScore: 85.7,
    status: 'IN_PROGRESS',
    createdAt: '2026-09-10T09:15:00Z',
    weights: { capability_match: 0.40, practical: 0.25, project_relevance: 0.20, oral: 0.10, freshness: 0.05 }
  }
];

export const M16OverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState<MatchSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [showExplain, setShowExplain] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'COMPLETED' | 'IN_PROGRESS' | 'FAILED'>('all');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // In production, this would call GET /api/v1/matches
        // For now, use mock data
        await new Promise(res => setTimeout(res, 400));
        setMatches(MOCK_MATCHES);
      } catch {
        setMatches(MOCK_MATCHES);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  const filteredMatches = matches.filter(m => 
    filterStatus === 'all' || m.status === filterStatus
  );

  if (loading) {
    return (
      <div className={styles.container} dir="rtl">
        <div className={styles.loadingState}>
          <div className={styles.spinner} />
          <span>جاري تحميل جلسات المطابقة...</span>
        </div>
      </div>
    );
  }

  if (filteredMatches.length === 0) {
    return (
      <div className={styles.container} dir="rtl">
        <M16EmptyPage onCreateClick={() => navigate('/problem')} />
      </div>
    );
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'COMPLETED': return { label: 'مكتملة', className: styles.statusCompleted, icon: <CheckCircle size={12} /> };
      case 'IN_PROGRESS': return { label: 'قيد التنفيذ', className: styles.statusProgress, icon: <Clock size={12} /> };
      default: return { label: 'فاشلة', className: styles.statusFailed, icon: <AlertCircle size={12} /> };
    }
  };

  return (
    <div className={styles.container} dir="rtl">
      <div className={styles.headerRow}>
        <div className={styles.headerContent}>
          <span className={styles.badgeQ}>M16 · Q-0601 · ⚓ Overview</span>
          <span className={styles.demoBadge}>[Demo / تجريبي] بيانات مطابقة محاكاة</span>
          <h1 className={styles.title}>المطابقة المفسرة: نظرة عامة</h1>
          <p className={styles.subtitle}>
            ملخص جلسات المطابقة: المشكلة، عدد المرشحين، أعلى درجة، الحالة، والأوزان المستخدمة.
            كل جلسة قابلة للفتح للتفاصيل مع الأدلة والفجوات لكل مرشح — لا درجات مخفية.
          </p>
        </div>

        <div className={styles.actionRow}>
          <Button
            variant="proof"
            size="md"
            onClick={() => navigate('/problem')}
            leftIcon={<PlusCircle size={16} />}
          >
            مشكلة جديدة للمطابقة
          </Button>

          <Button
            variant="outline"
            size="md"
            onClick={() => setShowExplain(!showExplain)}
            leftIcon={<Sparkles size={16} />}
          >
            {showExplain ? 'إخفاء التفسير' : 'اشرح لي: كيف تعمل المطابقة؟'}
          </Button>
        </div>
      </div>

      {showExplain && (
        <div className={styles.explainDrawer}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
            <Sparkles size={18} color="var(--proof)" />
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: 'var(--ink)' }}>
              تفسير الذكاء الاصطناعي: منهجية المطابقة المفسرة
            </h3>
          </div>
          <p style={{ margin: '0 0 1rem', fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--ink-2)' }}>
            المطابقة في قُدرة <strong>مفسرة بالكامل</strong>: درجة إجمالية موزونة من 5 مكونات —
            <strong>توافق القدرات (40%)</strong>، <strong>أدلة عملية (25%)</strong>، 
            <strong>صلة المشروع (20%)</strong>، <strong>تقييم شفهي (10%)</strong>، <strong>حداثة الأدلة (5%)</strong>.
            <strong>خط أحمر:</strong> لا ترتيب بدون تعليل مرئي — كل مرشح يعرض <strong>الأدلة الداعمة</strong> و<strong>الفجوات</strong> بالتساوي بصرياً.
            <strong>ExplainDrawer</strong> يفتح للتفاصيل الكاملة لكل مكون.
          </p>
          <div className={styles.grid3} style={{ marginBottom: 0 }}>
            <div className={styles.metricBox}>
              <span className={styles.metricLabel}>5 مكونات موزونة</span>
              <span className={styles.metricHint}>أوزان ثابتة ومعلنة: 40/25/20/10/5</span>
            </div>
            <div className={styles.metricBox}>
              <span className={styles.metricLabel}>أدلة وفجوات متساوية</span>
              <span className={styles.metricHint}>عرض بصري متوازن — لا إخفاء للنقاط الضعيفة</span>
            </div>
            <div className={styles.metricBox}>
              <span className={styles.metricLabel}>ExplainDrawer إلزامي</span>
              <span className={styles.metricHint}>تفاصيل كل مكون عند الطلب — شفافية كاملة</span>
            </div>
          </div>
        </div>
      )}

      <div className={styles.filterBar}>
        <span className={styles.filterLabel}>تصفية حسب الحالة:</span>
        <div className={styles.filterButtons}>
          {['all', 'COMPLETED', 'IN_PROGRESS', 'FAILED'].map(s => (
            <button
              key={s}
              className={`${styles.filterBtn} ${filterStatus === s ? styles.active : ''}`}
              onClick={() => setFilterStatus(s as 'all' | 'COMPLETED' | 'IN_PROGRESS' | 'FAILED')}
            >
              {s === 'all' ? 'الكل' : s === 'COMPLETED' ? 'مكتملة' : s === 'IN_PROGRESS' ? 'قيد التنفيذ' : 'فاشلة'}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.grid3}>
        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>إجمالي الجلسات</span>
          <span className={styles.metricValue}><span className="num">{matches.length}</span></span>
          <span className={styles.metricHint}>جلسات مطابقة</span>
        </div>
        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>مكتملة</span>
          <span className={styles.metricValue} style={{ color: '#10B981' }}>
            <span className="num">{matches.filter(m => m.status === 'COMPLETED').length}</span>
          </span>
          <span className={styles.metricHint}>جاهزة للمراجعة</span>
        </div>
        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>أعلى درجة</span>
          <span className={styles.metricValue}><span className="num">{Math.max(...matches.map(m => m.topScore), 0)}</span></span>
          <span className={styles.metricHint}>أفضل تطابق</span>
        </div>
      </div>

      <div className={styles.card}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--ink)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Search size={22} style={{ color: 'var(--proof)' }} />
          جلسات المطابقة
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filteredMatches.map(match => {
            const status = getStatusStyle(match.status);
            return (
              <div key={match.id} className={styles.matchCard}>
                <div className={styles.matchCardHeader}>
                  <div>
                    <h3 className={styles.matchName}>{match.problemTitle}</h3>
                    <span className={styles.matchProblemId}>مشكلة: {match.problemId}</span>
                  </div>
                  <span className={status.className}>
                    {status.icon} {status.label}
                  </span>
                </div>

                <div className={styles.matchMeta}>
                  <span className={styles.metaItem}>
                    <FileText size={14} /> مرشحين: {match.totalCandidates}
                  </span>
                  <span className={styles.metaItem}>
                    <CheckCircle size={14} style={{ color: '#10B981' }} /> أعلى درجة: {match.topScore}%
                  </span>
                  <span className={styles.metaItem}>
                    <Clock size={14} /> {new Date(match.createdAt).toLocaleDateString('ar-EG')}
                  </span>
                </div>

                <div className={styles.weightsPreview}>
                  {Object.entries(match.weights).map(([key, value]) => (
                    <span key={key} className={styles.weightChip}>
                      {key.replace('_', ' ')}: {Math.round(value * 100)}%
                    </span>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                  <Button variant="outline" size="sm" onClick={() => navigate(`/matching/${match.problemId}/details/${match.id}`)}>
                    <FileText size={14} /> عرض التفاصيل
                  </Button>
                  <Button variant="proof" size="sm" onClick={() => navigate(`/matching/${match.problemId}/results/${match.id}`)}>
                    <Search size={14} /> عرض المرشحين
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => navigate(`/matching/${match.problemId}/compare/${match.id}`)}>
                    <Filter size={14} /> مقارنة
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default M16OverviewPage;