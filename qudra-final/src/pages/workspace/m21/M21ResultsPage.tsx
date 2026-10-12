import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Bar } from '../../../components/ui/Bar';
import styles from './m21.module.css';
import { ROUTES } from '../../../constants/routes';
import { ArrowRight, CheckCircle, Clock, FileText, Sparkles, Trophy, AlertTriangle, Kanban, Award, ArrowLeft, Users } from 'lucide-react';

interface WorkspaceResult {
  id: string;
  name: string;
  description: string;
  teamName: string;
  totalTasks: number;
  doneTasks: number;
  inProgressTasks: number;
  deliverablesCount: number;
  claimedEvidenceCount: number;
  progress: number;
  status: 'active' | 'completed' | 'archived';
  topDeliverables: { title: string; type: string; status: string }[];
  createdAt: string;
}

const MOCK_RESULTS: WorkspaceResult[] = [
  {
    id: 'ws_1',
    name: 'مشروع منصة المعالجة الصوتية',
    description: 'مساحة العمل لفريق صوت المستقبل - بناء API معالجة صوتية',
    teamName: 'فريق صوت المستقبل',
    totalTasks: 6,
    doneTasks: 2,
    inProgressTasks: 1,
    deliverablesCount: 2,
    claimedEvidenceCount: 1,
    progress: 33,
    status: 'active',
    topDeliverables: [
      { title: 'مخطط قاعدة البيانات للصوتيات', type: 'document', status: 'claimed_evidence' },
      { title: 'REST API لرفع ومعالجة الصوت', type: 'code', status: 'submitted' },
    ],
    createdAt: '2026-09-10T10:00:00Z'
  },
  {
    id: 'ws_2',
    name: 'مشروع لوحة تحكم المسابقات',
    description: 'مساحة العمل لفريق لوحات التحكم الذكية - بناء لوحة تحليلية',
    teamName: 'فريق لوحات التحكم الذكية',
    totalTasks: 4,
    doneTasks: 1,
    inProgressTasks: 1,
    deliverablesCount: 1,
    claimedEvidenceCount: 1,
    progress: 25,
    status: 'active',
    topDeliverables: [
      { title: 'نظام التصميم - لوحات التحكم', type: 'design', status: 'claimed_evidence' },
    ],
    createdAt: '2026-09-08T10:00:00Z'
  },
  {
    id: 'ws_3',
    name: 'مشروع نظام RAG العربي',
    description: 'مساحة العمل لفريق RAG العربي - بناء نظام استرجاع دلالي',
    teamName: 'فريق RAG العربي',
    totalTasks: 5,
    doneTasks: 5,
    inProgressTasks: 0,
    deliverablesCount: 3,
    claimedEvidenceCount: 2,
    progress: 100,
    status: 'completed',
    topDeliverables: [
      { title: 'نظام RAG كامل مع واجهة بحث', type: 'code', status: 'approved' },
      { title: 'وثيقة معمارية للنظام', type: 'document', status: 'approved' },
      { title: 'عرض توضيحي للنظام', type: 'demo', status: 'claimed_evidence' },
    ],
    createdAt: '2026-08-15T10:00:00Z'
  }
];

const STATUS_LABEL: Record<string, string> = {
  active: 'نشط',
  completed: 'مكتمل',
  archived: 'مؤرشف',
};

const STATUS_VARIANT: Record<string, 'proof' | 'gap' | 'claimed' | 'neutral'> = {
  active: 'proof',
  completed: 'neutral',
  archived: 'gap',
};

const DELIVERABLE_STATUS_LABEL: Record<string, string> = {
  draft: 'مسودة',
  submitted: 'مُسلّم',
  approved: 'معتمد',
  rejected: 'مرفوض',
  claimed_evidence: 'دليل CLAIMED',
};

const DELIVERABLE_STATUS_VARIANT: Record<string, 'gap' | 'claimed' | 'proof'> = {
  draft: 'gap',
  submitted: 'claimed',
  approved: 'proof',
  rejected: 'gap',
  claimed_evidence: 'claimed',
};

export const M21ResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState<WorkspaceResult[]>([]);
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
          <span>جاري تحميل نتائج مساحات العمل...</span>
        </div>
      </div>
    );
  }

  const activeCount = results.filter(r => r.status === 'active').length;
  const completedCount = results.filter(r => r.status === 'completed').length;
  const totalDeliverables = results.reduce((sum, r) => sum + r.deliverablesCount, 0);
  const totalClaimed = results.reduce((sum, r) => sum + r.claimedEvidenceCount, 0);
  const avgProgress = results.length > 0 ? Math.round(results.reduce((sum, r) => sum + r.progress, 0) / results.length) : 0;

  return (
    <div className={styles.container} dir="rtl">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.M21_OVERVIEW)} leftIcon={<ArrowLeft size={15} />}>
          العودة لمساحات العمل
        </Button>
        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.M21_CREATE)} leftIcon={<Kanban size={14} />}>
            مساحة عمل جديدة
          </Button>
        </div>
      </div>

      <div className={styles.headerRow}>
        <div className={styles.headerContent}>
          <span className={styles.badgeQ}>M21 · Q-0807 · ⚓ Results</span>
          <span className={styles.demoBadge}>[Demo / تجريبي] نتائج مساحات عمل محاكاة</span>
          <h1 className={styles.title}>نتائج مساحات العمل</h1>
          <p className={styles.subtitle}>
            بطاقات نتيجة مع سبب كل مساحة: الفريق، التقدم، المهام، المخرجات، وأدلة CLAIMED.
            كل نتيجة مرتبطة بأدلة يمكن فتحها — لا ترتيب بلا تعليل.
          </p>
        </div>
        <div className={styles.actionRow}>
          <Button variant="proof" size="md" onClick={() => navigate(ROUTES.M21_CREATE)} leftIcon={<Kanban size={16} />}>
            مساحة عمل جديدة
          </Button>
        </div>
      </div>

      <div className={styles.grid4}>
        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>إجمالي المساحات</span>
          <span className={styles.metricValue}><span className="num">{results.length}</span></span>
          <span className={styles.metricHint}>{activeCount} نشطة، {completedCount} مكتملة</span>
        </div>
        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>متوسط التقدم</span>
          <span className={styles.metricValue} style={{ color: 'var(--proof)' }}><span className="num">{avgProgress}</span>%</span>
          <span className={styles.metricHint}>نسبة المهام المكتملة</span>
        </div>
        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>إجمالي المخرجات</span>
          <span className={styles.metricValue} style={{ color: '#10B981' }}><span className="num">{totalDeliverables}</span></span>
          <span className={styles.metricHint}>مخرجات مسلمة</span>
        </div>
        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>أدلة CLAIMED</span>
          <span className={styles.metricValue} style={{ color: '#F59E0B' }}><span className="num">{totalClaimed}</span></span>
          <span className={styles.metricHint}>بانتظار التحقق لتصبح Proven</span>
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
                  <span><Users size={12} /> {result.teamName}</span>
                  <span><Kanban size={12} /> مهام: <strong className="num">{result.doneTasks}/{result.totalTasks}</strong></span>
                  <span><FileText size={12} /> مخرجات: <strong>{result.deliverablesCount}</strong></span>
                  <span><Award size={12} style={{ color: '#F59E0B' }} /> CLAIMED: <strong>{result.claimedEvidenceCount}</strong></span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.M21_DETAILS.replace(':id', result.id))}>
                  <FileText size={14} /> التفاصيل
                </Button>
                {result.progress >= 80 && (
                  <Button variant="proof" size="sm" onClick={() => navigate(ROUTES.M21_DETAILS.replace(':id', result.id))}>
                    <ArrowRight size={14} /> متابعة التسليم
                  </Button>
                )}
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 600 }}>التقدم</span>
                <span className="num">{result.progress}%</span>
              </div>
              <Bar value={result.progress} max={100} label="" variant={result.progress >= 80 ? 'proof' : 'gap'} size="sm" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--ink)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>المهام</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                    <span>مكتملة</span>
                    <span className="num" style={{ color: '#10B981' }}>{result.doneTasks}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                    <span>قيد التنفيذ</span>
                    <span className="num" style={{ color: '#F59E0B' }}>{result.inProgressTasks}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                    <span>إجمالي</span>
                    <span className="num">{result.totalTasks}</span>
                  </div>
                </div>
              </div>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--ink)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>أفضل المخرجات</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {result.topDeliverables.slice(0, 3).map((del, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem' }}>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '150px' }}>{del.title}</span>
                      <Badge variant={DELIVERABLE_STATUS_VARIANT[del.status]} size="xs">{DELIVERABLE_STATUS_LABEL[del.status]}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1rem' }}>
              <a
                href={`/workspace/m21/${result.id}`}
                style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--proof)', padding: '0.5rem 1rem', border: '1px solid rgba(0, 184, 184, 0.3)', borderRadius: '8px', transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(0, 184, 184, 0.1)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <FileText size={14} /> تفصيل مساحة العمل الكامل والمخرجات
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
              مساحات مكتملة
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--ink-2)', lineHeight: 1.6 }}>
              {completedCount} مساحات مكتملة 100%. مخرجاتها تحولت لأدلة — راجع التحقق لرفعها لـ Proven.
            </p>
          </div>
          <div style={{ flex: 1, minWidth: '250px', padding: '1rem', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '10px' }}>
            <div style={{ fontWeight: 700, color: 'var(--ink)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Clock size={16} style={{ color: '#F59E0B' }} />
              مساحات نشطة
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--ink-2)', lineHeight: 1.6 }}>
              {activeCount} مساحات قيد التنفيذ. تابع التقدم وسلّم المخرجات مبكراً.
            </p>
          </div>
          <div style={{ flex: 1, minWidth: '250px', padding: '1rem', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '10px' }}>
            <div style={{ fontWeight: 700, color: 'var(--ink)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <AlertTriangle size={16} style={{ color: '#EF4444' }} />
              أدلة CLAIMED مفتوحة
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--ink-2)', lineHeight: 1.6 }}>
              {totalClaimed} أدلة بانتظار التحقق. راجعها مع مراجع لرفعها لـ Proven.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default M21ResultsPage;