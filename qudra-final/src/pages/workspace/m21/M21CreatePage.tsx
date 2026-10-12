import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { QudraStore } from '../../../services/store';
import type { WorkspaceColumn } from '../../../services/types';
import { ROUTES } from '../../../constants/routes';
import styles from './m21.module.css';
import { ArrowRight, Plus, X, Sparkles, ShieldCheck, Target, AlertTriangle, Kanban, ArrowLeft, CheckCircle, Users, Award, FileText } from 'lucide-react';

const COLUMN_LABEL: Record<WorkspaceColumn, string> = {
  backlog: 'قائمة الانتظار',
  todo: 'للتنفيذ',
  in_progress: 'قيد التنفيذ',
  review: 'مراجعة',
  done: 'مكتمل',
};

const DELIVERABLE_TYPE_LABEL: Record<string, string> = {
  code: 'كود',
  document: 'وثيقة',
  design: 'تصميم',
  test: 'اختبار',
  deployment: 'نشر',
  demo: 'عرض توضيحي',
};

interface TaskForm {
  title: string;
  description: string;
  column: WorkspaceColumn;
  priority: 'low' | 'medium' | 'high' | 'critical';
  assigneeName: string;
  estimatedHours: number;
  tags: string[];
}

interface DeliverableForm {
  title: string;
  description: string;
  type: string;
  url: string;
  taskId: string;
}

const INITIAL_TASK: TaskForm = {
  title: '',
  description: '',
  column: 'todo',
  priority: 'medium',
  assigneeName: '',
  estimatedHours: 8,
  tags: [],
};

const INITIAL_DELIVERABLE: DeliverableForm = {
  title: '',
  description: '',
  type: 'code',
  url: '',
  taskId: '',
};

export const M21CreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [wsName, setWsName] = useState('');
  const [wsDesc, setWsDesc] = useState('');
  const [tasks, setTasks] = useState<TaskForm[]>([INITIAL_TASK]);
  const [deliverables, setDeliverables] = useState<DeliverableForm[]>([]);
  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submittedId, setSubmittedId] = useState('');

  const teams = QudraStore.getTeams();
  const selectedTeam = teams[0];

  const handleTaskChange = (index: number, field: keyof TaskForm, value: string | number) => {
    const updated = [...tasks];
    updated[index] = { ...updated[index], [field]: value } as TaskForm;
    setTasks(updated);
  };

  const addTask = () => setTasks(prev => [...prev, { ...INITIAL_TASK }]);
  const removeTask = (index: number) => {
    if (tasks.length > 1) setTasks(prev => prev.filter((_, i) => i !== index));
  };

  const addTag = (index: number) => {
    if (newTag.trim()) {
      const updated = [...tasks];
      updated[index] = { ...updated[index], tags: [...updated[index].tags, newTag.trim()] };
      setTasks(updated);
      setNewTag('');
    }
  };

  const removeTag = (taskIndex: number, tagIndex: number) => {
    const updated = [...tasks];
    updated[taskIndex] = { ...updated[taskIndex], tags: updated[taskIndex].tags.filter((_, i) => i !== tagIndex) };
    setTasks(updated);
  };

  const addDeliverable = () => setDeliverables(prev => [...prev, { ...INITIAL_DELIVERABLE }]);
  const removeDeliverable = (index: number) => {
    if (deliverables.length > 1) setDeliverables(prev => prev.filter((_, i) => i !== index));
  };

  const handleDeliverableChange = (index: number, field: keyof DeliverableForm, value: string) => {
    const updated = [...deliverables];
    updated[index] = { ...updated[index], [field]: value };
    setDeliverables(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!wsName.trim()) { setErrorMsg('يرجى إدخال اسم مساحة العمل'); return; }
    if (tasks.every(t => !t.title.trim())) { setErrorMsg('يرجى إضافة مهمة واحدة على الأقل'); return; }

    setLoading(true);
    await new Promise(res => setTimeout(res, 800));
    const newId = `ws_${Date.now().toString(36)}`;
    setSubmittedId(newId);
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <div className={styles.container} dir="rtl">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.M21_OVERVIEW)} leftIcon={<ArrowLeft size={15} />}>
          العودة لمساحات العمل
        </Button>
      </div>

      <div className={styles.headerRow}>
        <div className={styles.headerContent}>
          <span className={styles.badgeQ}>M21 · Q-0804 · ⚓ Create</span>
          <span className={styles.demoBadge}>[Demo / تجريبي] محاكاة إنشاء مساحة عمل</span>
          <h1 className={styles.title}>مساحة عمل جديدة</h1>
          <p className={styles.subtitle}>
            أنشئ مساحة عمل مرتبطة بفريق (M20) — أضف مهام كانبان ومحطة تسليم مخرجات.
            كل مخرجات تُحول تلقائياً لمسودة دليل CLAIMED بانتظار التحقق.
          </p>
        </div>
      </div>

      {errorMsg && (
        <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#EF4444', borderRadius: '10px', padding: '0.85rem 1.15rem', fontSize: '0.88rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertTriangle size={18} />
          <span>{errorMsg}</span>
        </div>
      )}

      {submitted && (
        <div className={styles.card} style={{ marginBottom: '1.5rem', borderColor: 'rgba(16, 185, 129, 0.4)', background: 'rgba(16, 185, 129, 0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <CheckCircle size={28} style={{ color: '#10B981' }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>تم إنشاء مساحة العمل بنجاح!</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--ink-2)' }}>
                رقم المساحة: <strong className="mono">{submittedId}</strong> · مهام: <strong>{tasks.filter(t => t.title.trim()).length}</strong> · مخرجات: <strong>{deliverables.filter(d => d.title.trim()).length}</strong>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            <Button variant="proof" size="md" onClick={() => navigate(ROUTES.M21_DETAILS.replace(':id', submittedId))}>
              <ArrowRight size={16} /> فتح مساحة العمل
            </Button>
            <Button variant="outline" size="md" onClick={() => navigate(ROUTES.M21_OVERVIEW)}>
              <Kanban size={16} /> العودة للقائمة
            </Button>
            <Button variant="ghost" size="md" onClick={() => { setSubmitted(false); setWsName(''); setWsDesc(''); setTasks([INITIAL_TASK]); setDeliverables([]); }}>
              <Plus size={16} /> مساحة أخرى
            </Button>
          </div>
        </div>
      )}

      <div className={styles.card}>
        <form onSubmit={handleSubmit}>
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>
              <Kanban size={20} style={{ color: 'var(--proof)', marginInlineEnd: '0.5rem' }} />
              معلومات مساحة العمل
            </h3>
            <div className={styles.formGroup}>
              <label>اسم مساحة العمل *</label>
              <input className={styles.input} placeholder="مثال: مشروع منصة المعالجة الصوتية" value={wsName} onChange={e => setWsName(e.target.value)} />
            </div>
            <div className={styles.formGroup}>
              <label>الوصف</label>
              <textarea className={styles.textarea} placeholder="هدف المشروع، النطاق، السياق..." value={wsDesc} onChange={e => setWsDesc(e.target.value)} rows={3} />
            </div>
            {selectedTeam && (
              <div className={styles.formGroup}>
                <label>الفريق المرتبط</label>
                <div style={{ padding: '0.75rem', background: 'rgba(0, 184, 184, 0.05)', border: '1px solid rgba(0, 184, 184, 0.2)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Users size={16} style={{ color: 'var(--proof)' }} />
                  <span style={{ fontWeight: 600 }}>{selectedTeam.name}</span>
                  <Badge variant="proof" size="xs">{selectedTeam.coveragePercentage}% تغطية</Badge>
                </div>
              </div>
            )}
          </div>

          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>
              <Target size={20} style={{ color: '#F59E0B', marginInlineEnd: '0.5rem' }} />
              مهام كانبان ({tasks.length})
            </h3>
            {tasks.map((task, idx) => (
              <div key={idx} className={styles.taskForm}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>مهمة {idx + 1}</span>
                  {tasks.length > 1 && (
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeTask(idx)} style={{ padding: '0.25rem' }}>
                      <X size={14} />
                    </Button>
                  )}
                </div>
                <div className={styles.formGroup}>
                  <input className={styles.input} placeholder="عنوان المهمة *" value={task.title} onChange={e => handleTaskChange(idx, 'title', e.target.value)} />
                </div>
                <div className={styles.formGroup}>
                  <textarea className={styles.textarea} placeholder="وصف المهمة..." value={task.description} onChange={e => handleTaskChange(idx, 'description', e.target.value)} rows={2} />
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>العمود</label>
                    <select className={styles.input} value={task.column} onChange={e => handleTaskChange(idx, 'column', e.target.value as WorkspaceColumn)}>
                      {Object.entries(COLUMN_LABEL).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label>الأولوية</label>
                    <select className={styles.input} value={task.priority} onChange={e => handleTaskChange(idx, 'priority', e.target.value)}>
                      <option value="low">منخفضة</option>
                      <option value="medium">متوسطة</option>
                      <option value="high">عالية</option>
                      <option value="critical">حرجة</option>
                    </select>
                  </div>
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>المسؤول</label>
                    <input className={styles.input} placeholder="اسم العضو" value={task.assigneeName} onChange={e => handleTaskChange(idx, 'assigneeName', e.target.value)} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>الساعات المقدرة</label>
                    <input className={styles.input} type="number" min={1} value={task.estimatedHours} onChange={e => handleTaskChange(idx, 'estimatedHours', (parseInt(e.target.value) || 0) as string | number)} />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label>الوسوم</label>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <input className={styles.input} placeholder="أضف وسم..." value={newTag} onChange={e => setNewTag(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(idx); } }} style={{ flex: 1 }} />
                    <Button type="button" variant="outline" size="sm" onClick={() => addTag(idx)} leftIcon={<Plus size={14} />}>إضافة</Button>
                  </div>
                  <div className={styles.capTags}>
                    {task.tags.map((tag, tagIdx) => (
                      <span key={tagIdx} className={styles.capTag}>
                        {tag}
                        <button type="button" onClick={() => removeTag(idx, tagIdx)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0, display: 'flex' }}>
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={addTask} leftIcon={<Plus size={14} />}>
              إضافة مهمة
            </Button>
          </div>

          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>
              <FileText size={20} style={{ color: 'var(--proof)', marginInlineEnd: '0.5rem' }} />
              مخرجات أولية ({deliverables.length})
            </h3>
            {deliverables.map((del, idx) => (
              <div key={idx} className={styles.taskForm}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>مخرجات {idx + 1}</span>
                  {deliverables.length > 1 && (
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeDeliverable(idx)} style={{ padding: '0.25rem' }}>
                      <X size={14} />
                    </Button>
                  )}
                </div>
                <div className={styles.formGroup}>
                  <input className={styles.input} placeholder="عنوان المخرجات" value={del.title} onChange={e => handleDeliverableChange(idx, 'title', e.target.value)} />
                </div>
                <div className={styles.formGroup}>
                  <textarea className={styles.textarea} placeholder="وصف المخرجات..." value={del.description} onChange={e => handleDeliverableChange(idx, 'description', e.target.value)} rows={2} />
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>النوع</label>
                    <select className={styles.input} value={del.type} onChange={e => handleDeliverableChange(idx, 'type', e.target.value)}>
                      {Object.entries(DELIVERABLE_TYPE_LABEL).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label>الرابط</label>
                    <input className={styles.input} type="url" placeholder="https://github.com/..." value={del.url} onChange={e => handleDeliverableChange(idx, 'url', e.target.value)} />
                  </div>
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={addDeliverable} leftIcon={<Plus size={14} />}>
              إضافة مخرجات
            </Button>
          </div>

          <div className={styles.actionRow} style={{ justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <Button type="button" variant="ghost" size="md" onClick={() => navigate(ROUTES.M21_OVERVIEW)}>
              <ArrowLeft size={16} /> إلغاء
            </Button>
            <Button type="submit" variant="proof" size="md" loading={loading} rightIcon={<ArrowRight size={16} />}>
              {loading ? 'جاري الإنشاء...' : 'إنشاء مساحة العمل'}
            </Button>
          </div>
        </form>
      </div>

      <div className={styles.card} style={{ marginTop: '1.5rem' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--ink)', margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={20} style={{ color: '#F59E0B' }} />
          نصائح لمساحة عمل فعّالة
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ padding: '0.75rem', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
              <Kanban size={16} style={{ color: 'var(--proof)' }} />
              <strong>ابدأ بمهام صغيرة:</strong> 3-5 مهام في «للتنفيذ» كافية للبدء — لا تعبئ الـ backlog.
            </div>
          </div>
          <div style={{ padding: '0.75rem', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
              <Award size={16} style={{ color: '#F59E0B' }} />
              <strong>سليم مبكر:</strong> أول مخرجات خلال أسبوع — الزخم أهم من الكمال.
            </div>
          </div>
          <div style={{ padding: '0.75rem', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
              <ShieldCheck size={16} style={{ color: '#10B981' }} />
              <strong>CLAIMED → Proven:</strong> كل مخرجات تتحول لمسودة دليل — التحقق يرفعها لـ Proven.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default M21CreatePage;