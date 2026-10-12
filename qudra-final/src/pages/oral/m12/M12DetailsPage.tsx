import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { M12AnchorNav } from './M12AnchorNav';
import styles from './m12.module.css';
import { ArrowLeft, Info, Clock, Calendar, UserCheck, Mic, Award, CheckCircle2, MessageSquare, ExternalLink} from 'lucide-react';

const mockInterviews = [
  {
    id: 'interview-1',
    title: 'مقابلة تقنية: React Testing & Architecture',
    gapAddressed: 'Testing evidence limited',
    capability: 'React & TypeScript Architecture',
    reviewer: 'أحمد محمد - Tech Lead Frontend',
    reviewerRole: 'خبير معتمد',
    scheduledAt: '2026-10-07T10:00:00Z',
    durationMinutes: 45,
    status: 'SCHEDULED',
    method: 'مقابلة شفهية تقنية (Expert-reviewed)',
    questions: [
      'اشرح استراتيجية الاختبار في مشروعك الأخير',
      'كيف تتعامل مع اختبارات التكامل المعقدة؟',
      'متى تستخدم mock vs integration tests؟'
    ],
    evidence: [],
    progress: 0,
    sourceUrl: 'https://calendly.example/interview/react-testing',
  },
  {
    id: 'interview-2',
    title: 'مقابلة تقنية: Node.js Backend Architecture',
    gapAddressed: 'Backend scalability gaps',
    capability: 'Node.js & Express Backend',
    reviewer: 'سارة أحمد - Senior Backend Engineer',
    reviewerRole: 'خبير معتمد',
    scheduledAt: '2026-10-10T14:00:00Z',
    durationMinutes: 60,
    status: 'COMPLETED',
    method: 'مقابلة شفهية تقنية (Expert-reviewed)',
    questions: [
      'صمم نظام rate limiting للتوسع',
      'كيف تتعامل مع distributed transactions؟',
      'اشرح caching strategy في مشروعك'
    ],
    evidence: ['تسجيل المقابلة', 'تقرير التقييم', 'ملاحظات المراجع'],
    progress: 100,
    result: 'PASS',
    score: 87,
    sourceUrl: 'https://calendly.example/interview/node-backend',
  },
  {
    id: 'interview-3',
    title: 'مقابلة نظام: System Design for Frontend',
    gapAddressed: 'Architecture evidence gap',
    capability: 'System Design',
    reviewer: 'د. محمد علي - Staff Engineer',
    reviewerRole: 'خبير معتمد',
    scheduledAt: '2026-10-15T16:00:00Z',
    durationMinutes: 60,
    status: 'SCHEDULED',
    method: 'مقابلة شفهية تقنية (Expert-reviewed)',
    questions: [
      'صمم نظام micro-frontends للتوسع',
      'كيف تدير state management على مستوى المؤسسة؟',
      'performance budgets: كيف تحددها وتراقبها؟'
    ],
    evidence: [],
    progress: 0,
    sourceUrl: 'https://calendly.example/interview/system-design',
  },
];

export const M12DetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const [showExplain, setShowExplain] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<typeof mockInterviews[0] | null>(mockInterviews[0]);

  return (
    <div className={styles.container}>
      <M12AnchorNav />

      <div className={styles.headerRow}>
        <div>
          <span className={styles.badgeQ}>M12 · Q-0443 · ⚓ Details</span>
          <h1 className={styles.title}>تفاصيل المقابلة الشفوية</h1>
          <p className={styles.subtitle}>
            جميع الحقول: العنوان، الفجوة المعالجة، القدرة، المراجع، الموعد، المدة، الحالة، الأسئلة، الأدلة، النتيجة.
            وسم [Demo] صريح على محاكاة التسجيل والتقييم.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={() => setShowExplain(!showExplain)} leftIcon={<Info size={14} />}>
          {showExplain ? 'إخفاء التفسير' : 'اشرح لي: لماذا هذه المقابلة؟'}
        </Button>
      </div>

      {showExplain && (
        <div className={styles.explainDrawer} style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <Info size={16} color="var(--proof-text)" />
            <strong style={{ fontSize: '0.88rem', color: 'var(--proof-text)' }}>
              تفسير التوصية (Explain Drawer)
            </strong>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--ink-2)', lineHeight: 1.6, margin: 0 }}>
            • <strong>معيار الاختيار</strong>: المقابلة تعالج الفجوة النشطة مباشرة، مع خبير معتمد في المجال المحدد.<br />
            • <strong>الأدلة المستخدمة</strong>: فجوة «Testing evidence limited» نشطة، القدرة «React & TypeScript Architecture» قيد التطور.<br />
            • <strong>كل حقل يعرض مصدره</strong>: المراجع من قائمة الخبراء المعتمدين. الموعد من Calendly. الأسئلة من بنك الأسئلة المعتمد.<br />
            • <strong>النتيجة = Expert-reviewed</strong>؛ الإثبات النهائي = مشروع تطبيقي أو تحدٍ عملي (Q-0447).
          </p>
        </div>
      )}

      <div className={styles.card} style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          {mockInterviews.map(interview => (
            <Button
              key={interview.id}
              variant={selectedInterview?.id === interview.id ? 'proof' : 'outline'}
              size="sm"
              onClick={() => setSelectedInterview(interview)}
              className={styles.courseTab}
            >
              {interview.title.substring(0, 25)}...
            </Button>
          ))}
        </div>

        {selectedInterview && (
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--ink)' }}>
              {selectedInterview.title}
            </h2>

            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1rem', fontSize: '0.85rem', color: 'var(--ink-2)' }}>
              <span><Clock size={14} /> {selectedInterview.durationMinutes} دقيقة</span>
              <span><Calendar size={14} /> {new Date(selectedInterview.scheduledAt).toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              <span><UserCheck size={14} /> {selectedInterview.reviewer}</span>
              <span><Award size={14} /> {selectedInterview.reviewerRole}</span>
              <span><Mic size={14} /> {selectedInterview.method}</span>
            </div>

            <div className={styles.fieldRow}>
              <span className={styles.fieldLabel}>الفجوة المعالجة</span>
              <div className={styles.fieldValue}>
                <span style={{ background: 'var(--gap-tint)', color: 'var(--gap-text)', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700 }}>
                  {selectedInterview.gapAddressed}
                </span>
                <span className={styles.sourceTag}>تحليل QUDRA</span>
              </div>
            </div>

            <div className={styles.fieldRow}>
              <span className={styles.fieldLabel}>القدرة المستهدفة</span>
              <div className={styles.fieldValue}>
                <span style={{ color: 'var(--ink)', fontWeight: 600 }}>{selectedInterview.capability}</span>
                <span className={styles.sourceTag}>خريطة القدرات</span>
              </div>
            </div>

            <div className={styles.fieldRow}>
              <span className={styles.fieldLabel}>الحالة</span>
              <div className={styles.fieldValue} style={{ alignItems: 'center', gap: '1rem' }}>
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  fontFamily: 'var(--fn)',
                  padding: '0.25rem 0.7rem',
                  borderRadius: '6px',
                  background: selectedInterview.status === 'COMPLETED' ? 'var(--proof-tint)' : selectedInterview.status === 'IN_PROGRESS' ? 'rgba(245, 158, 11, 0.12)' : 'var(--proof-tint)',
                  color: selectedInterview.status === 'COMPLETED' ? 'var(--proof-text)' : selectedInterview.status === 'IN_PROGRESS' ? 'var(--amber, #d97706)' : 'var(--proof-text)',
                  border: selectedInterview.status === 'COMPLETED' ? '1px solid var(--proof)' : selectedInterview.status === 'IN_PROGRESS' ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid var(--proof)',
                }}>
                  {selectedInterview.status === 'COMPLETED' ? 'مكتملة' : selectedInterview.status === 'IN_PROGRESS' ? 'قيد التنفيذ' : 'مجدولة'}
                </span>
                <span className={styles.sourceTag}>[Demo] محاكاة — لا تسجيل حقيقي</span>
              </div>
            </div>

            <div className={styles.fieldRow}>
              <span className={styles.fieldLabel}>أسئلة المقابلة</span>
              <div className={styles.fieldValue} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem' }}>
                {selectedInterview.questions.map((q, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--ink)', width: '100%' }}>
                    <span style={{ fontWeight: 700, color: 'var(--proof)', minWidth: '28px', textAlign: 'center' }}>{i + 1}.</span>
                    <span>{q}</span>
                  </div>
                ))}
                <span className={styles.sourceTag}>مصدر: بنك الأسئلة المعتمد للخبير</span>
              </div>
            </div>

            <div className={styles.fieldRow}>
              <span className={styles.fieldLabel}>الأدلة/المرفقات</span>
              <div className={styles.fieldValue} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem' }}>
                {selectedInterview.evidence.length > 0 ? (
                  <>
                    {selectedInterview.evidence.map((e, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--ink)' }}>
                        <CheckCircle2 size={16} color="var(--proof)" />
                        <span>{e}</span>
                      </div>
                    ))}
                    <span className={styles.sourceTag}>مصدر: تسجيل المقابلة + تقرير المراجع</span>
                  </>
                ) : (
                  <span style={{ color: 'var(--ink-3)', fontStyle: 'italic' }}>لا أدلة بعد — ستضاف بعد إكمال المقابلة</span>
                )}
              </div>
            </div>

            {selectedInterview.status === 'COMPLETED' && (
              <div className={styles.fieldRow}>
                <span className={styles.fieldLabel}>النتيجة</span>
                <div className={styles.fieldValue} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      fontFamily: 'var(--fn)',
                      padding: '0.3rem 0.8rem',
                      borderRadius: '6px',
                      background: selectedInterview.result === 'PASS' ? 'var(--proof-tint)' : 'rgba(239, 68, 68, 0.1)',
                      color: selectedInterview.result === 'PASS' ? 'var(--proof-text)' : '#EF4444',
                      border: selectedInterview.result === 'PASS' ? '1px solid var(--proof)' : '1px solid #EF4444',
                    }}>
                      {selectedInterview.result === 'PASS' ? 'ناجح (PASS)' : 'غير ناجح (FAIL)'}
                    </span>
                    <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--proof-text)', fontFamily: 'var(--fn)' }}>
                      الدرجة: {selectedInterview.score}%
                    </span>
                  </div>
                  <span className={styles.sourceTag}>مستوى الثقة: Expert-reviewed — لا تمنح Proven مباشرة</span>
                </div>
              </div>
            )}

            <div className={styles.fieldRow}>
              <span className={styles.fieldLabel}>السجل</span>
              <div className={styles.fieldValue} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.35rem', fontSize: '0.82rem', color: 'var(--ink-2)' }}>
                <span>تم الجدولة: {new Date(selectedInterview.scheduledAt).toLocaleDateString('ar-EG')}</span>
                <span>المراجع: {selectedInterview.reviewer}</span>
                <span>آخر تحديث: 2026-10-01</span>
              </div>
            </div>

            <div className={styles.actionRow} style={{ marginTop: '1rem' }}>
              <Button
                variant={selectedInterview.status === 'SCHEDULED' ? 'proof' : 'outline'}
                size="md"
                onClick={() => setSelectedInterview({ ...selectedInterview, status: 'IN_PROGRESS', progress: 50 })}
                rightIcon={<ArrowLeft size={16} />}
              >
                {selectedInterview.status === 'SCHEDULED' ? 'بدء المقابلة [Demo]' : selectedInterview.status === 'IN_PROGRESS' ? 'متابعة [Demo]' : 'مراجعة النتيجة'}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => window.open(selectedInterview.sourceUrl, '_blank')} leftIcon={<ExternalLink size={14} />}>
                فتح على Calendly
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigate('/oral/results')}>
                عرض نتائج المقابلات (Q-0447)
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className={styles.card}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 1rem' }}>قائمة المقابلات الكاملة (List View)</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {mockInterviews.map(interview => (
            <div key={interview.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: '10px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 0.25rem', color: 'var(--ink)' }}>{interview.title}</h4>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.78rem', color: 'var(--ink-2)', flexWrap: 'wrap' }}>
                  <span>{interview.reviewer}</span>
                  <span>{interview.durationMinutes} دقيقة</span>
                  <span>{new Date(interview.scheduledAt).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' })}</span>
                  <span>{interview.method}</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--ink-3)', marginTop: '0.25rem' }}>
                  الفجوة: {interview.gapAddressed}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Button
                  variant={interview.status === 'SCHEDULED' ? 'proof' : interview.status === 'IN_PROGRESS' ? 'outline' : 'ghost'}
                  size="sm"
                  onClick={() => navigate('/oral/details')}
                >
                  {interview.status === 'SCHEDULED' ? 'بدء [Demo]' : interview.status === 'IN_PROGRESS' ? 'متابعة [Demo]' : 'مراجعة'}
                </Button>
                {interview.status === 'COMPLETED' && interview.evidence.length > 0 && (
                  <Button variant="ghost" size="sm" leftIcon={<Award size={12} />}>
                    عرض الأدلة ({interview.evidence.length})
                  </Button>
                )}
                <Button variant="ghost" size="sm" leftIcon={<MessageSquare size={12} />}>
                  التفاصيل
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default M12DetailsPage;