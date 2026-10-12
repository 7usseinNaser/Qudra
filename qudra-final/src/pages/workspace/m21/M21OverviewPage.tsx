import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Bar } from '../../../components/ui/Bar';
import { QudraStore } from '../../../services/store';
import type { ProjectWorkspace, WorkspaceColumn } from '../../../services/types';
import { ROUTES } from '../../../constants/routes';
import { M21EmptyPage } from './M21EmptyPage';
import styles from './m21.module.css';
import { PlusCircle, Sparkles, Info, Kanban, CheckCircle, TrendingUp, ArrowRight, Clock, FileText, Award } from 'lucide-react';

const COLUMN_LABEL: Record<WorkspaceColumn, string> = {
  backlog: 'قائمة الانتظار',
  todo: 'للتنفيذ',
  in_progress: 'قيد التنفيذ',
  review: 'مراجعة',
  done: 'مكتمل',
};

const COLUMN_VARIANT: Record<WorkspaceColumn, 'gap' | 'claimed' | 'info' | 'proof'> = {
  backlog: 'gap',
  todo: 'claimed',
  in_progress: 'info',
  review: 'claimed',
  done: 'proof',
};

export const M21OverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const [workspaces, setWorkspaces] = useState<ProjectWorkspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [showExplain, setShowExplain] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await new Promise(res => setTimeout(res, 400));
      setWorkspaces(QudraStore.getWorkspaces());
      setLoading(false);
    };
    loadData();
  }, []);

  const totalTasks = workspaces.reduce((sum, w) => sum + w.tasks.length, 0);
  const doneTasks = workspaces.reduce((sum, w) => sum + w.tasks.filter(t => t.column === 'done').length, 0);
  const inProgressTasks = workspaces.reduce((sum, w) => sum + w.tasks.filter(t => t.column === 'in_progress').length, 0);
  const totalDeliverables = workspaces.reduce((sum, w) => sum + w.deliverables.length, 0);
  const claimedEvidence = workspaces.reduce((sum, w) => sum + w.deliverables.filter(d => d.status === 'claimed_evidence').length, 0);

  if (loading) {
    return (
      <div className={styles.container} dir="rtl">
        <div className={styles.loadingState}>
          <div className={styles.spinner} />
          <span>جاري تحميل مساحات العمل...</span>
        </div>
      </div>
    );
  }

  if (workspaces.length === 0) {
    return (
      <div className={styles.container} dir="rtl">
        <M21EmptyPage />
      </div>
    );
  }

  return (
    <div className={styles.container} dir="rtl">
      <div className={styles.headerRow}>
        <div className={styles.headerContent}>
          <span className={styles.badgeQ}>M21 · Q-0801 · ⚓ Overview</span>
          <span className={styles.demoBadge}>[Demo / تجريبي] بيانات مساحات عمل محاكاة</span>
          <h1 className={styles.title}>مساحة تنفيذ المشروع والنتائج</h1>
          <p className={styles.subtitle}>
            لوحة كانبان خفيفة لكل فريق + محطة تسليم المخرجات التي تتحول تلقائياً لمسودة دليل CLAIMED.
            كل مهمة قابلة للسحب بين الأعمدة، وكل تسليم مرتبط بدليل يمكن التحقق منه.
          </p>
        </div>

        <div className={styles.actionRow}>
          <Button variant="proof" size="md" onClick={() => navigate(ROUTES.M21_CREATE)} leftIcon={<PlusCircle size={16} />}>
            مساحة عمل جديدة
          </Button>
          <Button variant="outline" size="md" onClick={() => setShowExplain(!showExplain)} leftIcon={<Sparkles size={16} />}>
            {showExplain ? 'إخفاء التفسير' : 'اشرح لي: مساحة العمل'}
          </Button>
        </div>
      </div>

      {showExplain && (
        <div className={styles.explainDrawer}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
            <Info size={18} color="var(--proof)" />
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: 'var(--ink)' }}>
              تفسير الذكاء الاصطناعي: كيف تعمل مساحة العمل
            </h3>
          </div>
          <p style={{ margin: '0 0 1rem', fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--ink-2)' }}>
            كل مساحة عمل مرتبطة بفريق (M20) وفرصة (M17). اللوحة كانبان خفيفة بخمسة أعمدة:
            <strong>قائمة الانتظار → للتنفيذ → قيد التنفيذ → مراجعة → مكتمل</strong>.
            <br />• عند نقل مهمة لـ «مكتمل»، تظهر في <strong>محطة التسليم</strong> كمسودة مخرجات.
            <br />• كل مخرجات تُحول تلقائياً إلى <strong>مسودة دليل CLAIMED</strong> — بانتظار التحقق لتصبح Proven.
            <br />• لا ترتيب بلا تعليل — كل تسليم مرتبط بمهمة وقدرة محددة.
          </p>
          <div className={styles.grid3} style={{ marginBottom: 0 }}>
            <div className={styles.metricBox}>
              <span className={styles.metricLabel}>CLAIMED → Proven</span>
              <span className={styles.metricHint}>التسليم يُنشئ مسودة دليل — التحقق يرفعها لـ Proven</span>
            </div>
            <div className={styles.metricBox}>
              <span className={styles.metricLabel}>كانبان خفيف</span>
              <span className={styles.metricHint}>خمسة أعمدة ثابتة — لا تعقيد، لا إعدادات</span>
            </div>
            <div className={styles.metricBox}>
              <span className={styles.metricLabel}>أدلة قابلة للفتح</span>
              <span className={styles.metricHint}>كل تسليم مرتبط بمهمة وقدرة — لا تسليم بلا سياق</span>
            </div>
          </div>
        </div>
      )}

      <div className={styles.grid4}>
        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>مساحات العمل</span>
          <span className={styles.metricValue}><span className="num">{workspaces.length}</span></span>
          <span className={styles.metricHint}>مشاريع نشطة</span>
        </div>
        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>إجمالي المهام</span>
          <span className={styles.metricValue}><span className="num">{totalTasks}</span></span>
          <span className={styles.metricHint}>{doneTasks} مكتملة، {inProgressTasks} قيد التنفيذ</span>
        </div>
        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>المخرجات المسلمة</span>
          <span className={styles.metricValue} style={{ color: '#10B981' }}><span className="num">{totalDeliverables}</span></span>
          <span className={styles.metricHint}>جاهزة للمراجعة</span>
        </div>
        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>أدلة CLAIMED</span>
          <span className={styles.metricValue} style={{ color: '#F59E0B' }}><span className="num">{claimedEvidence}</span></span>
          <span className={styles.metricHint}>مسودات بانتظار التحقق</span>
        </div>
      </div>

      <h2 className={styles.sectionTitle}>مساحات العمل</h2>

      <div className={styles.wsGrid}>
        {workspaces.map((ws) => {
          const wsDone = ws.tasks.filter(t => t.column === 'done').length;
          const wsTotal = ws.tasks.length;
          const wsProgress = wsTotal > 0 ? Math.round((wsDone / wsTotal) * 100) : 0;
          const wsDeliverables = ws.deliverables.length;
          const wsClaimed = ws.deliverables.filter(d => d.status === 'claimed_evidence').length;

          return (
            <div key={ws.id} className={styles.wsCard}>
              <div className={styles.wsCardHead}>
                <div>
                  <h3 className={styles.wsTitle}>{ws.name}</h3>
                  <span className={styles.wsDesc}>{ws.description}</span>
                </div>
                <Badge variant="proof" size="sm">{wsProgress}%</Badge>
              </div>

              <div style={{ marginTop: '0.5rem' }}>
                <Bar value={wsProgress} max={100} label="" variant={wsProgress >= 80 ? 'proof' : 'gap'} size="xs" />
              </div>

              <div className={styles.wsStats}>
                <div className={styles.statItem}>
                  <Kanban size={14} style={{ color: 'var(--proof)' }} />
                  <div>
                    <div className={styles.statValue}>{wsTotal}</div>
                    <div className={styles.statLabel}>مهام</div>
                  </div>
                </div>
                <div className={styles.statItem}>
                  <CheckCircle size={14} style={{ color: '#10B981' }} />
                  <div>
                    <div className={styles.statValue}>{wsDone}</div>
                    <div className={styles.statLabel}>مكتملة</div>
                  </div>
                </div>
                <div className={styles.statItem}>
                  <FileText size={14} style={{ color: '#F59E0B' }} />
                  <div>
                    <div className={styles.statValue}>{wsDeliverables}</div>
                    <div className={styles.statLabel}>مخرجات</div>
                  </div>
                </div>
                <div className={styles.statItem}>
                  <Award size={14} style={{ color: 'var(--proof)' }} />
                  <div>
                    <div className={styles.statValue}>{wsClaimed}</div>
                    <div className={styles.statLabel}>CLAIMED</div>
                  </div>
                </div>
              </div>

              <div className={styles.kanbanPreview}>
                {ws.columns.map(col => {
                  const count = ws.tasks.filter(t => t.column === col).length;
                  return (
                    <div key={col} className={styles.kanbanCol}>
                      <div className={styles.kanbanColHeader}>
                        <Badge variant={COLUMN_VARIANT[col]} size="xs">{COLUMN_LABEL[col]}</Badge>
                        <span className={styles.kanbanCount}>{count}</span>
                      </div>
                      <div className={styles.kanbanTasks}>
                        {ws.tasks.filter(t => t.column === col).slice(0, 2).map(t => (
                          <div key={t.id} className={styles.kanbanTask}>
                            <span className={styles.taskTitle}>{t.title}</span>
                            <span className={styles.taskAssignee}>{t.assigneeName}</span>
                          </div>
                        ))}
                        {count > 2 && <div className={styles.moreTasks}>+{count - 2} أخرى</div>}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className={styles.wsActions}>
                <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.M21_DETAILS.replace(':id', ws.id))} style={{ flex: 1 }}>
                  <Kanban size={14} /> فتح كانبان
                </Button>
                <Button variant="proof" size="sm" onClick={() => navigate(ROUTES.M21_DETAILS.replace(':id', ws.id))} style={{ flex: 1 }}>
                  <ArrowRight size={14} /> التفاصيل
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.insightCard}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <TrendingUp size={20} style={{ color: 'var(--proof)' }} />
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--ink)' }}>رؤى سريعة</h3>
        </div>
        <div className={styles.insightGrid}>
          <div className={styles.insightItem}>
            <CheckCircle size={18} style={{ color: '#10B981' }} />
            <div>
              <div style={{ fontWeight: 600, color: 'var(--ink)' }}>{doneTasks} مهام مكتملة</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--ink-2)' }}>جاهزة للتسليم</div>
            </div>
          </div>
          <div className={styles.insightItem}>
            <Clock size={18} style={{ color: '#F59E0B' }} />
            <div>
              <div style={{ fontWeight: 600, color: 'var(--ink)' }}>{inProgressTasks} مهام قيد التنفيذ</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--ink-2)' }}>تحتاج متابعة</div>
            </div>
          </div>
          <div className={styles.insightItem}>
            <Award size={18} style={{ color: 'var(--proof)' }} />
            <div>
              <div style={{ fontWeight: 600, color: 'var(--ink)' }}>{claimedEvidence} أدلة CLAIMED</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--ink-2)' }}>بانتظار التحقق لتصبح Proven</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default M21OverviewPage;