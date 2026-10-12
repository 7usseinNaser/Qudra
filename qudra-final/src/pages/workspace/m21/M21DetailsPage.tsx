import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QudraStore } from '../../../services/store';
import { ROUTES } from '../../../constants/routes';
import { Badge } from '../../../components/ui/Badge';
import { Bar } from '../../../components/ui/Bar';
import { Button } from '../../../components/ui/Button';
import { EmptyState } from '../../../components/ui/EmptyState';
import type { WorkspaceColumn } from '../../../services/types';
import styles from './m21.module.css';
import { ArrowRight, Kanban, CheckCircle, Clock, FileText, Users, Award, ArrowLeft, Plus, GitFork, ShieldCheck, Sparkles, XCircle, TrendingUp } from 'lucide-react';

const COLUMN_LABEL: Record<WorkspaceColumn, string> = {
  backlog: 'قائمة الانتظار',
  todo: 'للتنفيذ',
  in_progress: 'قيد التنفيذ',
  review: 'مراجعة',
  done: 'مكتمل',
};

const COLUMN_VARIANT: Record<WorkspaceColumn, 'gap' | 'claimed' | 'neutral' | 'proof'> = {
  backlog: 'gap',
  todo: 'claimed',
  in_progress: 'neutral',
  review: 'claimed',
  done: 'proof',
};

const PRIORITY_LABEL: Record<string, string> = {
  low: 'منخفضة',
  medium: 'متوسطة',
  high: 'عالية',
  critical: 'حرجة',
};

const PRIORITY_VARIANT: Record<string, 'gap' | 'claimed' | 'danger' | 'proof'> = {
  low: 'gap',
  medium: 'claimed',
  high: 'danger',
  critical: 'proof',
};

const DELIVERABLE_TYPE_LABEL: Record<string, string> = {
  code: 'كود',
  document: 'وثيقة',
  design: 'تصميم',
  test: 'اختبار',
  deployment: 'نشر',
  demo: 'عرض توضيحي',
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

export const M21DetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'kanban' | 'deliverables'>('kanban');
  const ws = useMemo(
    () => QudraStore.getWorkspaces().find((w) => w.id === id),
    [id],
  );

  if (!ws) {
    return (
      <div className={styles.container} dir="rtl">
        <EmptyState
          title="لم نعثر على مساحة العمل"
          description="ربما تم حذفها أو أن الرابط غير صحيح."
          action={<button className="btn dark" onClick={() => navigate(ROUTES.M21_OVERVIEW)}>العودة لمساحات العمل</button>}
        />
      </div>
    );
  }

  const doneTasks = ws.tasks.filter(t => t.column === 'done').length;
  const progress = ws.tasks.length > 0 ? Math.round((doneTasks / ws.tasks.length) * 100) : 0;

  const moveTask = (taskId: string, newColumn: WorkspaceColumn) => {
    const updatedTasks = ws.tasks.map(t =>
      t.id === taskId ? { ...t, column: newColumn, updatedAt: new Date().toISOString() } : t
    );
    QudraStore.updateWorkspace(ws.id, { tasks: updatedTasks });
  };

  return (
    <div className={styles.container} dir="rtl">
      <div className={styles.headRow}>
        <div>
          <button className="btn ghost" onClick={() => navigate(ROUTES.M21_OVERVIEW)} style={{ marginBottom: '0.8rem' }}>
            <ArrowLeft size={14} /> مساحات العمل
          </button>
          <h1 className={styles.title}>{ws.name}</h1>
          <p className={styles.desc}>{ws.description}</p>
        </div>
        <div className={styles.matchBox}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <span className={`${styles.matchNum} ${progress >= 80 ? styles.highMatch : ''}`}>{progress}%</span>
            <span className={styles.matchLabel}>إنجاز</span>
            <Badge variant="proof" size="sm">{doneTasks}/{ws.tasks.length}</Badge>
          </div>
          <Bar value={progress} max={100} label="" variant={progress >= 80 ? 'proof' : 'gap'} size="sm" />
        </div>
      </div>

      <div className={styles.tabsBar}>
        <button className={`${styles.tabBtn} ${activeTab === 'kanban' ? styles.active : ''}`} onClick={() => setActiveTab('kanban')}>
          <Kanban size={17} /> لوحة كانبان
        </button>
        <button className={`${styles.tabBtn} ${activeTab === 'deliverables' ? styles.active : ''}`} onClick={() => setActiveTab('deliverables')}>
          <FileText size={17} /> محطة التسليم ({ws.deliverables.length})
        </button>
      </div>

      {activeTab === 'kanban' && (
        <div className={styles.kanbanBoard}>
          {ws.columns.map(col => {
            const colTasks = ws.tasks.filter(t => t.column === col);
            return (
              <div key={col} className={styles.kanbanColumn}>
                <div className={styles.kanbanColHeader}>
                  <Badge variant={COLUMN_VARIANT[col]} size="sm">{COLUMN_LABEL[col]}</Badge>
                  <span className={styles.kanbanCount}>{colTasks.length}</span>
                </div>
                <div className={styles.kanbanColBody}>
                  {colTasks.map(task => (
                    <div key={task.id} className={styles.kanbanCard}>
                      <div className={styles.kanbanCardHead}>
                        <span className={styles.taskTitle}>{task.title}</span>
                        <Badge variant={PRIORITY_VARIANT[task.priority]} size="xs">{PRIORITY_LABEL[task.priority]}</Badge>
                      </div>
                      <p className={styles.taskDesc}>{task.description}</p>
                      <div className={styles.taskMeta}>
                        <span className={styles.taskAssignee}>
                          <Users size={12} /> {task.assigneeName || 'غير مُسند'}
                        </span>
                        {task.estimatedHours && (
                          <span className={styles.taskHours}>
                            <Clock size={12} /> {task.estimatedHours}س
                          </span>
                        )}
                      </div>
                      <div className={styles.taskTags}>
                        {task.tags.map(tag => (
                          <Badge key={tag} variant="claimed" size="xs">{tag}</Badge>
                        ))}
                      </div>
                      <div className={styles.taskActions}>
                        {col !== 'backlog' && (
                          <button className={styles.moveBtn} onClick={() => {
                            const idx = ws.columns.indexOf(col);
                            if (idx > 0) moveTask(task.id, ws.columns[idx - 1]);
                          }}>
                            <ArrowRight size={12} /> السابق
                          </button>
                        )}
                        {col !== 'done' && (
                          <button className={styles.moveBtn} onClick={() => {
                            const idx = ws.columns.indexOf(col);
                            if (idx < ws.columns.length - 1) moveTask(task.id, ws.columns[idx + 1]);
                          }}>
                            التالي <ArrowLeft size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  {colTasks.length === 0 && (
                    <div className={styles.emptyCol}>لا توجد مهام</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'deliverables' && (
        <div>
          <div className={styles.deliverablesHeader}>
            <h3 className={styles.sectionTitle}>
              <FileText size={20} style={{ color: 'var(--proof)', marginInlineEnd: '0.5rem' }} />
              محطة تسليم المخرجات
            </h3>
            <Button variant="proof" size="sm" onClick={() => navigate(ROUTES.M21_CREATE)} leftIcon={<Plus size={14} />}>
              تسليم مخرجات
            </Button>
          </div>

          {ws.deliverables.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📦</div>
              <h2 className={styles.emptyTitle}>لا توجد مخرجات مسلمة</h2>
              <p className={styles.emptyDesc}>عند إكمال مهمة في كانبان، يمكنك تسليم مخرجاتها هنا — ستتحول تلقائياً لمسودة دليل CLAIMED.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {ws.deliverables.map(del => (
                <div key={del.id} className={styles.deliverableCard}>
                  <div className={styles.deliverableHead}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                        <Award size={18} style={{ color: 'var(--proof)' }} />
                        <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--ink)' }}>{del.title}</h4>
                        <Badge variant="claimed" size="xs">{DELIVERABLE_TYPE_LABEL[del.type]}</Badge>
                        <Badge variant={DELIVERABLE_STATUS_VARIANT[del.status]} size="sm">
                          {DELIVERABLE_STATUS_LABEL[del.status]}
                        </Badge>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.82rem', color: 'var(--ink-2)' }}>
                        <span><Users size={12} /> {del.submittedBy}</span>
                        <span><Clock size={12} /> {new Date(del.submittedAt).toLocaleDateString('ar-EG')}</span>
                        {del.evidenceId && <span><ShieldCheck size={12} style={{ color: '#F59E0B' }} /> {del.evidenceId}</span>}
                      </div>
                    </div>
                  </div>
                  <p className={styles.deliverableDesc}>{del.description}</p>
                  {del.url && (
                    <a href={del.url} target="_blank" rel="noreferrer" className={styles.deliverableLink}>
                      <GitFork size={14} /> فتح المخرجات
                    </a>
                  )}
                  {del.status === 'claimed_evidence' && (
                    <div className={styles.claimedBanner}>
                      <Sparkles size={16} style={{ color: '#F59E0B' }} />
                      <div>
                        <div style={{ fontWeight: 700, color: '#F59E0B' }}>مسودة دليل CLAIMED</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--ink-2)' }}>
                          هذه المخرجات تحولت تلقائياً لمسودة دليل. عند التحقق من المراجع، ستصبح Proven.
                        </div>
                      </div>
                    </div>
                  )}
                  {del.status === 'submitted' && (
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                      <Button variant="proof" size="sm" leftIcon={<CheckCircle size={14} />}>اعتماد</Button>
                      <Button variant="outline" size="sm" leftIcon={<XCircle size={14} />}>رفض</Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className={styles.card} style={{ marginTop: '1.5rem' }}>
            <h3 className={styles.sectionTitle}>
              <TrendingUp size={20} style={{ color: '#F59E0B', marginInlineEnd: '0.5rem' }} />
              رحلة الدليل: CLAIMED → Proven
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '10px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', background: '#F59E0B', color: 'white', fontWeight: 700, fontSize: '0.8rem' }}>1</span>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--ink)' }}>تسليم المخرجات</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--ink-2)' }}>عند إكمال مهمة → تسليم كود/وثيقة/تصميم</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '10px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', background: '#F59E0B', color: 'white', fontWeight: 700, fontSize: '0.8rem' }}>2</span>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--ink)' }}>مسودة دليل CLAIMED</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--ink-2)' }}>تُنشأ تلقائياً — مرتبطة بالمهمة والقدرة</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '10px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', background: '#10B981', color: 'white', fontWeight: 700, fontSize: '0.8rem' }}>3</span>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--ink)' }}>التحقق → Proven</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--ink-2)' }}>مراجع يتحقق من المخرجات → الدليل يصبح Proven</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default M21DetailsPage;