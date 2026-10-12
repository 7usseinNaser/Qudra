import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QudraStore } from '../../../services/store';
import { Button } from '../../../components/ui/Button';
import { M12AnchorNav } from './M12AnchorNav';
import styles from './m12.module.css';
import { ArrowLeft, Sparkles, AlertCircle, Mic, CheckCircle2, UserCheck} from 'lucide-react';

const DRAFT_STORAGE_KEY = 'qudra_m12_interview_draft';

type InterviewStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

const EXPERTS = [
  { id: 'exp-1', name: 'أحمد محمد', role: 'Tech Lead Frontend', expertise: ['React', 'TypeScript', 'Testing', 'Architecture'], avatar: 'أ.م' },
  { id: 'exp-2', name: 'سارة أحمد', role: 'Senior Backend Engineer', expertise: ['Node.js', 'Express', 'PostgreSQL', 'Microservices'], avatar: 'س.أ' },
  { id: 'exp-3', name: 'د. محمد علي', role: 'Staff Engineer / System Design', expertise: ['System Design', 'Micro-frontends', 'Performance', 'Scalability'], avatar: 'د.م.ع' },
  { id: 'exp-4', name: 'فاطمة الزهراء', role: 'DevOps Lead', expertise: ['Docker', 'Kubernetes', 'CI/CD', 'Cloud Architecture'], avatar: 'ف.ز' },
];

export const M12CreatePage: React.FC = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState(() => {
    try { return JSON.parse(localStorage.getItem(DRAFT_STORAGE_KEY) || '{}').title || ''; } catch { return ''; }
  });
  const [selectedGap, setSelectedGap] = useState(() => {
    try { return JSON.parse(localStorage.getItem(DRAFT_STORAGE_KEY) || '{}').selectedGap || ''; } catch { return ''; }
  });
  const [selectedExpert, setSelectedExpert] = useState(() => {
    try { return JSON.parse(localStorage.getItem(DRAFT_STORAGE_KEY) || '{}').selectedExpert || ''; } catch { return ''; }
  });
  const [scheduledAt, setScheduledAt] = useState(() => {
    try { return JSON.parse(localStorage.getItem(DRAFT_STORAGE_KEY) || '{}').scheduledAt || ''; } catch { return ''; }
  });
  const [durationMinutes, setDurationMinutes] = useState(() => {
    try { return JSON.parse(localStorage.getItem(DRAFT_STORAGE_KEY) || '{}').durationMinutes || 45; } catch { return 45; }
  });
  const [questions, setQuestions] = useState(() => {
    try { return JSON.parse(localStorage.getItem(DRAFT_STORAGE_KEY) || '{}').questions || []; } catch { return []; }
  });
  const [notes, setNotes] = useState(() => {
    try { return JSON.parse(localStorage.getItem(DRAFT_STORAGE_KEY) || '{}').notes || ''; } catch { return ''; }
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [aiFilling, setAiFilling] = useState(false);

  const gaps = QudraStore.getGaps();
  const openGaps = gaps.filter(g => g.status === 'OPEN');

  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify({
        title, selectedGap, selectedExpert, scheduledAt, durationMinutes, questions, notes
      }));
    } catch {
      // Ignore localStorage errors
    }
  }, [title, selectedGap, selectedExpert, scheduledAt, durationMinutes, questions, notes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!title.trim() || !selectedGap || !selectedExpert || !scheduledAt) {
      setErrorMsg('يرجى ملء الحقول المطلوبة: العنوان، الفجوة، الخبير، والموعد.');
      return;
    }

    setLoading(true);
    await new Promise(r => setTimeout(r, 800));

    const newInterview = {
      id: `interview-${Date.now()}`,
      title: title.trim(),
      gapAddressed: selectedGap,
      capability: gaps.find(g => g.skill === selectedGap || g.description === selectedGap)?.capabilityName || selectedGap,
      expertId: selectedExpert,
      scheduledAt,
      durationMinutes,
      questions,
      notes: notes.trim(),
      status: 'SCHEDULED' as InterviewStatus,
      method: 'oral_assessment',
      createdAt: new Date().toISOString(),
    };

    QudraStore.addInterview(newInterview);
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    setLoading(false);
    setSuccessMsg('تم جدولة المقابلة الشفوية بنجاح. سيتم إرسال دعوة للمراجع والمستخدم.');

    setTimeout(() => navigate('/oral/results', { state: { interview: newInterview } }), 1200);
  };

  const handleAIFill = async () => {
    if (!selectedGap.trim()) {
      setErrorMsg('اختر فجوة أولاً لتمكين اقتراحات AI.');
      return;
    }
    setAiFilling(true);
    setShowAISuggestions(true);
    await new Promise(r => setTimeout(r, 1000));
    setAiFilling(false);

    const gap = gaps.find(g => g.description === selectedGap);
    const suggestedExpert = EXPERTS.find(e => gap?.gapType?.includes('Frontend') && e.expertise.includes('React'))
      || EXPERTS.find(e => gap?.gapType?.includes('Backend') && e.expertise.includes('Node.js'))
      || EXPERTS[0];

    const suggestions = {
      title: `مقابلة تقنية: ${gap?.description || 'فجوة تقنية'}`,
      selectedExpert: suggestedExpert.id,
      durationMinutes: 45,
      questions: [
        `اشرح خبرتك في معالجة فجوة «${selectedGap}»`,
        'كيف تتعامل مع التحديات التقنية المعقدة في هذا المجال؟',
        'أعط مثالاً لمشروع طبقت فيه أفضل الممارسات هنا',
        'ما الأدوات والمنهجيات التي تفضلها ولماذا؟'
      ],
      notes: `مقابلة مجدولة تلقائياً بناءً على الفجوة: ${selectedGap}. الخبير المقترح: ${suggestedExpert.name}.`,
    };

    setTitle(suggestions.title);
    setSelectedExpert(suggestions.selectedExpert);
    setDurationMinutes(suggestions.durationMinutes);
    setQuestions(suggestions.questions);
    setNotes(suggestions.notes);
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, '']);
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestions(questions.filter((_: string, i: number) => i !== index));
  };

  const handleQuestionChange = (index: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index] = value;
    setQuestions(newQuestions);
  };

  const selectedExpertInfo = EXPERTS.find(e => e.id === selectedExpert);

  return (
    <div className={styles.container}>
      <M12AnchorNav />

      <div className={styles.headerRow}>
        <div>
          <span className={styles.badgeQ}>M12 · Q-0444 · ⚓ Create</span>
          <h1 className={styles.title}>جدولة مقابلة شفوية جديدة</h1>
          <p className={styles.subtitle}>
            نموذج جدولة مقابلة تقنية: اختيار فجوة، خبير معتمد، موعد، أسئلة مخصصة.
            وسم [Demo] صريح — المسودة تُحفظ تلقائياً، ولا تسجيل حقيقي في النسخة الحالية.
          </p>
        </div>
      </div>

      {errorMsg && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#EF4444', borderRadius: '10px', padding: '0.85rem 1.15rem', fontSize: '0.88rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={17} />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#10B981', borderRadius: '10px', padding: '0.85rem 1.15rem', fontSize: '0.88rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={17} />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className={styles.card}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 1rem' }}>بيانات المقابلة الأساسية</h2>

          <div className={styles.formGroup}>
            <label>عنوان المقابلة <span style={{ color: 'var(--error)' }}>*</span></label>
            <input
              className={styles.input}
              type="text"
              placeholder="مثال: مقابلة تقنية: React Testing & Architecture"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>الفجوة المعالجة (Gap Addressed) <span style={{ color: 'var(--error)' }}>*</span></label>
            <select
              className={styles.input}
              value={selectedGap}
              onChange={e => setSelectedGap(e.target.value)}
              required
            >
              <option value="">-- اختر فجوة نشطة --</option>
              {openGaps.map(gap => (
                <option key={gap.id} value={gap.description}>
                  {gap.description} ({gap.gapType})
                </option>
              ))}
              {openGaps.length === 0 && <option value="" disabled>لا توجد فجوات نشطة — اذهب لشاشة الفجوات</option>}
            </select>
            {openGaps.length > 0 && (
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <Button type="button" variant="outline" size="sm" onClick={handleAIFill} loading={aiFilling} leftIcon={<Sparkles size={14} />}>
                  {aiFilling ? 'جاري التوليد...' : 'اقتراحات AI لملء الحقول'}
                </Button>
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label>الخبير المراجع (Expert Reviewer) <span style={{ color: 'var(--error)' }}>*</span></label>
            <select
              className={styles.input}
              value={selectedExpert}
              onChange={e => setSelectedExpert(e.target.value)}
              required
            >
              <option value="">-- اختر خبير معتمد --</option>
              {EXPERTS.map(expert => (
                <option key={expert.id} value={expert.id}>
                  {expert.name} — {expert.role} ({expert.expertise.join(', ')})
                </option>
              ))}
            </select>
          </div>

          {selectedExpertInfo && (
            <div style={{ background: 'rgba(0, 184, 184, 0.05)', border: '1px solid rgba(0, 184, 184, 0.2)', borderRadius: '10px', padding: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ fontWeight: 700, color: 'var(--proof)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <UserCheck size={16} /> الخبير المختار: {selectedExpertInfo.name}
              </div>
              <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--ink-2)', lineHeight: 1.6 }}>
                الدور: <strong>{selectedExpertInfo.role}</strong> · التخصص: <strong>{selectedExpertInfo.expertise.join(', ')}</strong><br />
                مستوى الثقة المتوقع: <strong>Expert-reviewed (متوسط-عالي)</strong> — لا تمنح Proven مباشرة، تحتاج دليل موثق.
              </p>
            </div>
          )}

          <div className={styles.grid2}>
            <div className={styles.formGroup}>
              <label>الموعد والتاريخ <span style={{ color: 'var(--error)' }}>*</span></label>
              <input
                className={styles.input}
                type="datetime-local"
                value={scheduledAt}
                onChange={e => setScheduledAt(e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>المدة (دقيقة)</label>
              <input
                className={styles.input}
                type="number"
                min="15"
                max="120"
                step="15"
                dir="ltr"
                placeholder="45"
                value={durationMinutes}
                onChange={e => setDurationMinutes(parseInt(e.target.value) || 45)}
              />
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 1rem' }}>أسئلة المقابلة المخصصة</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--ink-2)', marginBottom: '1rem' }}>
            أضف أسئلة مخصصة للفجوة والقدرة المستهدفة. سيتم إرسالها للخبير للمراجعة قبل الجلسة.
          </p>
          {questions.map((q: string, idx: number) => (
            <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '6px', background: 'var(--proof-tint)', color: 'var(--proof-text)', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0, marginTop: '0.5rem' }}>
                {idx + 1}
              </span>
              <input
                className={styles.input}
                type="text"
                placeholder={`السؤال ${idx + 1}`}
                value={q}
                onChange={e => handleQuestionChange(idx, e.target.value)}
                style={{ flex: 1 }}
              />
              {questions.length > 1 && (
                <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveQuestion(idx)} style={{ padding: '0.5rem', marginTop: '0.5rem' }}>
                  <AlertCircle size={14} />
                </Button>
              )}
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={handleAddQuestion} leftIcon={<Sparkles size={14} />}>
            + إضافة سؤال
          </Button>
        </div>

        {showAISuggestions && (
          <div className={styles.card} style={{ background: 'var(--proof-tint)', borderColor: 'var(--proof)', marginTop: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Sparkles size={16} color="var(--proof-text)" />
              <strong style={{ fontSize: '0.88rem', color: 'var(--proof-text)' }}>اقتراحات AI (بموافقتك فقط — لا تعبئة صامتة)</strong>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--ink-2)', margin: 0 }}>
              الحقول أعلاه تم تعبئتها بناءً على الفجوة المختارة. يمكنك تعديل أي حقل قبل الحفظ.
            </p>
          </div>
        )}

        <div className={styles.card}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 1rem' }}>ملاحظات إضافية (اختياري)</h2>
          <div className={styles.formGroup}>
            <label>ملاحظات للسياق</label>
            <textarea
              className={styles.input}
              rows={4}
              placeholder="أي سياق إضافي، متطلبات خاصة، أو توجيهات للخبير..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              style={{ fontFamily: 'inherit', resize: 'vertical' }}
            />
          </div>
        </div>

        <div className={styles.actionRow} style={{ marginTop: '1.5rem' }}>
          <Button type="submit" variant="proof" size="lg" loading={loading} rightIcon={<ArrowLeft size={16} />}>
            جدولة المقابلة والانتقال للنتائج ←
          </Button>
          <Button type="button" variant="ghost" size="md" onClick={() => navigate('/oral/overview')}>
            إلغاء والعودة للنظرة العامة
          </Button>
        </div>
      </form>

      <div className={styles.card} style={{ marginTop: '1.5rem', borderInlineStart: '4px solid var(--accent, #14b8a6)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <Mic size={18} color="var(--accent, #14b8a6)" />
          <strong style={{ fontSize: '0.9rem', color: 'var(--ink)' }}>قاعدة التحقق المهمة — وسم [Demo] صريح</strong>
        </div>
        <p style={{ fontSize: '0.84rem', color: 'var(--ink-2)', margin: 0, lineHeight: 1.6 }}>
          <strong>هذه محاكاة [Demo] — لا تسجيل صوتي حقيقي، لا تحليل كلام حقيقي.</strong> الواجهة تُظهر تدفق UI فقط.
          في الإنتاج: ربط Calendly/Zoom، تسجيل مشفر، تحليل كلام (STT)، وتقرير آلي.
          <br /><br />
          <strong>مستوى الثقة:</strong> المقابلة = Expert-reviewed. لا تمنح <strong>Proven</strong> مباشرة.
          الإثبات النهائي يتطلب: <strong>مشروع تطبيقي</strong> (كود مفتوح، CI أخضر) أو <strong>تحدٍ عملي موثق</strong>.
          هذا يتوافق مع مبدأ QUDRA: "المقابلة تثبت الفهم النظري، لكنها لا تثبت وحدها الإتقان العملي".
        </p>
      </div>
    </div>
  );
};

export default M12CreatePage;