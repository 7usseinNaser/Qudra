import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { QudraStore } from '../../../services/store';
import { Button } from '../../../components/ui/Button';
import { M12AnchorNav } from './M12AnchorNav';
import styles from './m12.module.css';
import { ArrowLeft, CheckCircle2, Award, Mic, AlertTriangle, Info } from 'lucide-react';

const EXPERTS = [
  { id: 'exp-1', name: 'أحمد محمد', role: 'Tech Lead Frontend', expertise: ['React', 'TypeScript', 'Testing', 'Architecture'] },
  { id: 'exp-2', name: 'سارة أحمد', role: 'Senior Backend Engineer', expertise: ['Node.js', 'Express', 'PostgreSQL', 'Microservices'] },
  { id: 'exp-3', name: 'د. محمد علي', role: 'Staff Engineer / System Design', expertise: ['System Design', 'Micro-frontends', 'Performance', 'Scalability'] },
  { id: 'exp-4', name: 'فاطمة الزهراء', role: 'DevOps Lead', expertise: ['Docker', 'Kubernetes', 'CI/CD', 'Cloud Architecture'] },
];

export const M12ResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  interface InterviewState {
  interview?: {
    id: string;
    title: string;
    gapAddressed: string;
    expertId: string;
    scheduledAt: string;
    durationMinutes: number;
    status: string;
    result?: string;
    score?: number;
    evidence?: string[];
    notes?: string;
    method?: string;
    capability?: string;
    createdAt: string;
  };
}

const state = location.state as InterviewState | null;
  const [showExplain, setShowExplain] = useState(false);

  const interviews = QudraStore.getInterviews();
  const completedInterviews = interviews.filter(i => i.status === 'COMPLETED');
  const scheduledInterviews = interviews.filter(i => i.status === 'SCHEDULED');
  const inProgressInterviews = interviews.filter(i => i.status === 'IN_PROGRESS');

  const newInterview = state?.interview;

  const passedInterviews = completedInterviews.filter(i => i.result === 'PASS');
  const passRate = completedInterviews.length > 0 ? Math.round((passedInterviews.length / completedInterviews.length) * 100) : 0;

  return (
    <div className={styles.container}>
      <M12AnchorNav />

      <div className={styles.headerRow}>
        <div>
          <span className={styles.badgeQ}>M12 · Q-0447 · ⚓ Results</span>
          <span className={styles.demoBadge}>[Demo / تجريبي] نتائج محاكاة</span>
          <h1 className={styles.title}>نتائج المقابلات والتقدم</h1>
          <p className={styles.subtitle}>
            بطاقات نتيجة مع سبب كل نتيجة: العنوان، الفجوة، القدرة، المراجع، الموعد، المدة، الحالة، الأسئلة، الأدلة، الدرجة.
            التحقق: المقابلة = Expert-reviewed؛ الإثبات النهائي بمشروع أو تحدٍ.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={() => setShowExplain(!showExplain)} leftIcon={<Info size={14} />}>
          {showExplain ? 'إخفاء التفسير' : 'اشرح لي: كيف تُقاس النتائج؟'}
        </Button>
      </div>

      {showExplain && (
        <div className={styles.explainDrawer} style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <Info size={16} color="var(--proof-text)" />
            <strong style={{ fontSize: '0.88rem', color: 'var(--proof-text)' }}>تفسير مؤشرات النتائج (Explain Drawer)</strong>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--ink-2)', lineHeight: 1.6, margin: 0 }}>
            • <strong>Attendance Rate</strong>: نسبة الحضور من إجمالي المقابلات المجدولة.<br />
            • <strong>Pass Rate</strong>: نسبة من اجتازوا التقييم الشفهي بنجاح (درجة 70%+).<br />
            • <strong>Avg Turnaround</strong>: متوسط وقت من المقابلة للنتيجة النهائية.<br />
            • <strong>لا ترتيب بلا تعليل</strong>: كل نتيجة تعرض السبب، المراجع، الدرجة، والدليل المرتبط.
          </p>
        </div>
      )}

      {newInterview && (
        <div className={styles.card} style={{ borderInlineStart: '4px solid var(--proof)', marginBottom: '1.5rem', animation: 'slideIn 0.3s ease' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--proof-tint)', display: 'grid', placeItems: 'center', color: 'var(--proof-text)' }}>
              <CheckCircle2 size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: 'var(--ink)' }}>
                تم جدولة المقابلة بنجاح: {newInterview.title}
              </h2>
              <span style={{ fontSize: '0.84rem', color: 'var(--ink-3)' }}>
                الفجوة: {newInterview.gapAddressed} · الخبير: {EXPERTS.find(e => e.id === newInterview.expertId)?.name}
              </span>
            </div>
          </div>

          <p style={{ color: 'var(--ink-2)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1rem' }}>
            المقابلة مجدولة. الخطوة التالية: <strong>الحضور في الموعد</strong> ثم <strong>إكمال التقييم</strong> لتوليد النتيجة.
            <strong>[Demo]</strong> — لا تسجيل حقيقي في النسخة الحالية.
          </p>

          <div className={styles.actionRow}>
            <Button variant="proof" size="md" onClick={() => navigate('/oral/details')} rightIcon={<ArrowLeft size={16} />}>
              عرض التفاصيل والبدء [Demo] ←
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate('/oral/overview')}>
              العودة للنظرة العامة
            </Button>
          </div>
        </div>
      )}

      <div className={styles.grid2} style={{ marginBottom: '1.5rem' }}>
        <div className={styles.metricBox}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
            <span className={styles.metricLabel}>إجمالي المقابلات</span>
            <span className={styles.demoBadge}>[تجريبي / Demo Store]</span>
          </div>
          <span className={styles.metricValue}>{interviews.length}</span>
          <span className={styles.metricHint}>
            {completedInterviews.length} مكتملة · {inProgressInterviews.length} قيد التنفيذ · {scheduledInterviews.length} مجدولة
          </span>
        </div>

        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>معدل الحضور</span>
          <span className={styles.metricValue} style={{ color: 'var(--proof-text)' }}>92%</span>
          <span className={styles.metricHint}>نسبة الحضور من إجمالي المجدولة</span>
        </div>

        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>معدل النجاح Pass Rate</span>
          <span className={styles.metricValue} style={{ color: 'var(--proof-text)' }}>{passRate}%</span>
          <span className={styles.metricHint}>من اجتازوا التقييم الشفهي (70%+)</span>
        </div>

        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>متوسط وقت الإنجاز</span>
          <span className={styles.metricValue} style={{ fontSize: '1.5rem' }}>2.3 يوم</span>
          <span className={styles.metricHint}>من المقابلة للنتيجة النهائية</span>
        </div>
      </div>

      <div className={styles.card}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 1rem' }}>نتائج المقابلات (Results Cards)</h2>

        {interviews.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--ink-2)' }}>
            <Mic size={48} style={{ color: 'var(--ink-3)', marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--ink)' }}>
              لا توجد مقابلات مجدولة بعد
            </h3>
            <p style={{ marginBottom: '1.5rem' }}>ابدأ بجدولة مقابلة شفوية لسد فجوة نشطة مع خبير معتمد.</p>
            <Button variant="proof" size="md" onClick={() => navigate('/oral/create')} rightIcon={<ArrowLeft size={16} />}>
              جدولة أول مقابلة ←
            </Button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {interviews.map(interview => {
              const expert = EXPERTS.find(e => e.id === interview.expertId);
              const isPass = interview.result === 'PASS';
              return (
                <div key={interview.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: '10px', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: 'var(--ink)' }}>{interview.title}</h4>
                      <span style={{
                        fontSize: '0.65rem',
                        fontWeight: 800,
                        fontFamily: 'var(--fn)',
                        padding: '0.15rem 0.45rem',
                        borderRadius: '4px',
                        background: interview.status === 'COMPLETED' ? (isPass ? 'var(--proof-tint)' : 'rgba(239, 68, 68, 0.1)') : interview.status === 'IN_PROGRESS' ? 'rgba(245, 158, 11, 0.12)' : 'var(--proof-tint)',
                        color: interview.status === 'COMPLETED' ? (isPass ? 'var(--proof-text)' : '#EF4444') : interview.status === 'IN_PROGRESS' ? 'var(--amber, #d97706)' : 'var(--proof-text)',
                        border: interview.status === 'COMPLETED' ? (isPass ? '1px solid var(--proof)' : '1px solid #EF4444') : interview.status === 'IN_PROGRESS' ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid var(--proof)',
                      }}>
                        {interview.status === 'COMPLETED' ? (isPass ? 'ناجح ✓' : 'غير ناجح ✗') : interview.status === 'IN_PROGRESS' ? 'قيد التنفيذ' : 'مجدولة'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.78rem', color: 'var(--ink-2)', flexWrap: 'wrap' }}>
                      <span>{expert?.name || '—'}</span>
                      <span>{interview.durationMinutes} دقيقة</span>
                      <span>{new Date(interview.scheduledAt).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' })}</span>
                      <span>Expert-reviewed</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--ink-3)', marginTop: '0.25rem' }}>
                      الفجوة: {interview.gapAddressed}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <Button
                      variant={interview.status === 'SCHEDULED' ? 'proof' : interview.status === 'IN_PROGRESS' ? 'outline' : 'ghost'}
                      size="sm"
                      onClick={() => navigate('/oral/details')}
                    >
                      {interview.status === 'SCHEDULED' ? 'بدء [Demo]' : interview.status === 'IN_PROGRESS' ? 'متابعة [Demo]' : 'مراجعة'}
                    </Button>
                    {interview.status === 'COMPLETED' && interview.evidence && interview.evidence.length > 0 && (
                      <Button variant="ghost" size="sm" leftIcon={<Award size={12} />}>
                        عرض الأدلة ({interview.evidence.length})
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" leftIcon={<Mic size={12} />}>
                      التفاصيل
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {completedInterviews.length > 0 && (
          <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--line)' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 0.75rem', color: 'var(--ink)' }}>
              ملخص المقابلات المكتملة والناجحة
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {passedInterviews.map((interview, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', background: 'var(--proof-tint)', border: '1px solid var(--proof)', borderRadius: '8px', fontSize: '0.85rem' }}>
                  <CheckCircle2 size={16} color="var(--proof-text)" />
                  <span style={{ color: 'var(--proof-text)', fontWeight: 600 }}>{interview.title}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--proof-text)', fontFamily: 'var(--fn)' }}>درجة: {interview.score}%</span>
                  <span className={styles.sourceTag}>مستوى الثقة: Expert-reviewed</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className={styles.card} style={{ marginTop: '1.5rem', borderInlineStart: '4px solid var(--gap, #FFC107)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <AlertTriangle size={18} color="var(--gap, #FFC107)" />
          <strong style={{ fontSize: '0.9rem', color: 'var(--ink)' }}>قاعدة التحقق المهمة — وسم [Demo]</strong>
        </div>
        <p style={{ fontSize: '0.84rem', color: 'var(--ink-2)', margin: 0, lineHeight: 1.6 }}>
          <strong>[Demo] محاكاة — لا تسجيل صوتي حقيقي، لا تحليل كلام حقيقي.</strong> الواجهة تُظهر تدفق UI فقط.
          <br /><br />
          <strong>المقابلة = Expert-reviewed فقط.</strong> لا تُعتبر المقابلة بمفردها إثباتاً نهائياً لقدرة <strong>Proven</strong>.
          الإثبات النهائي يتطلب: <strong>مشروع تطبيقي</strong> (كود مفتوح، نشر، CI أخضر) أو <strong>تحدٍ عملي موثق</strong> بمراجعة بشرية/شفهية.
          المقابلة تثبت الفهم النظري والقدرة على الشرح، لكن الإتقان العملي يُثبت بالكود والمشاريع.
        </p>
      </div>
    </div>
  );
};

export default M12ResultsPage;