import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QudraStore } from '../../../services/store';
import { Button } from '../../../components/ui/Button';
import { M10AnchorNav } from './M10AnchorNav';
import styles from './m10.module.css';
import { ArrowLeft, Sparkles, AlertCircle, BookOpen, CheckCircle2 } from 'lucide-react';

const DRAFT_STORAGE_KEY = 'qudra_m10_course_draft';

export const M10CreatePage: React.FC = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState(() => {
    try { return JSON.parse(localStorage.getItem(DRAFT_STORAGE_KEY) || '{}').title || ''; } catch { return ''; }
  });
  const [provider, setProvider] = useState(() => {
    try { return JSON.parse(localStorage.getItem(DRAFT_STORAGE_KEY) || '{}').provider || ''; } catch { return ''; }
  });
  const [sourceUrl, setSourceUrl] = useState(() => {
    try { return JSON.parse(localStorage.getItem(DRAFT_STORAGE_KEY) || '{}').sourceUrl || ''; } catch { return ''; }
  });
  const [level, setLevel] = useState<'مبتدئ' | 'متوسط' | 'متقدم'>(() => {
    try { return JSON.parse(localStorage.getItem(DRAFT_STORAGE_KEY) || '{}').level || 'مبتدئ'; } catch { return 'مبتدئ'; }
  });
  const [durationHours, setDurationHours] = useState(() => {
    try { return JSON.parse(localStorage.getItem(DRAFT_STORAGE_KEY) || '{}').durationHours || 0; } catch { return 0; }
  });
  const [price, setPrice] = useState(() => {
    try { return JSON.parse(localStorage.getItem(DRAFT_STORAGE_KEY) || '{}').price || 0; } catch { return 0; }
  });
  const [language, setLanguage] = useState(() => {
    try { return JSON.parse(localStorage.getItem(DRAFT_STORAGE_KEY) || '{}').language || 'العربية'; } catch { return 'العربية'; }
  });
  const [gapAddressed, setGapAddressed] = useState(() => {
    try { return JSON.parse(localStorage.getItem(DRAFT_STORAGE_KEY) || '{}').gapAddressed || ''; } catch { return ''; }
  });
  const [description, setDescription] = useState(() => {
    try { return JSON.parse(localStorage.getItem(DRAFT_STORAGE_KEY) || '{}').description || ''; } catch { return ''; }
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
        title, provider, sourceUrl, level, durationHours, price, language, gapAddressed, description
      }));
    } catch {
      // Ignore localStorage errors
    }
  }, [title, provider, sourceUrl, level, durationHours, price, language, gapAddressed, description]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!title.trim() || !provider.trim() || !sourceUrl.trim()) {
      setErrorMsg('يرجى ملء الحقول المطلوبة: العنوان، المزود، ورابط المصدر.');
      return;
    }
    if (!sourceUrl.startsWith('http')) {
      setErrorMsg('رابط المصدر يجب أن يكون رابطاً صحيحاً يبدأ بـ http:// أو https://');
      return;
    }

    setLoading(true);
    await new Promise(r => setTimeout(r, 800));

    const newCourse = {
      id: `course-${Date.now()}`,
      title: title.trim(),
      provider: provider.trim(),
      sourceUrl: sourceUrl.trim(),
      level,
      durationHours,
      price,
      language,
      gapAddressed: gapAddressed.trim(),
      description: description.trim(),
      evidence: [],
      progress: 0,
      status: 'NOT_STARTED' as const,
      enrolledAt: new Date().toISOString().split('T')[0],
    };

    QudraStore.addCourse(newCourse);
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    setLoading(false);
    setSuccessMsg('تم إضافة الدورة وحفظها كمسودة. سيتم ربطها بالفجوة المحددة.');

    setTimeout(() => navigate('/learn/results', { state: { course: newCourse } }), 1200);
  };

  const handleAIFill = async () => {
    if (!gapAddressed.trim()) {
      setErrorMsg('اختر فجوة أولاً لتمكين اقتراحات AI.');
      return;
    }
    setAiFilling(true);
    setShowAISuggestions(true);
    await new Promise(r => setTimeout(r, 1000));
    setAiFilling(false);

    const suggestions = {
      title: `دورة لمعالجة: ${gapAddressed}`,
      provider: 'QUDRA Academy',
      level: 'متوسط' as const,
      durationHours: 6,
      price: 0,
      language: 'العربية',
      description: `مسار تعلم عملي لسد فجوة «${gapAddressed}» يتضمن مشروع تطبيقي مدمج وتحدي ختامي ينتج دليلاً موثقاً.`,
    };

    setTitle(suggestions.title);
    setProvider(suggestions.provider);
    setLevel(suggestions.level);
    setDurationHours(suggestions.durationHours);
    setPrice(suggestions.price);
    setLanguage(suggestions.language);
    setDescription(suggestions.description);
  };

  return (
    <div className={styles.container}>
      <M10AnchorNav />

      <div className={styles.headerRow}>
        <div>
          <span className={styles.badgeQ}>M10 · Q-0364 · ⚓ Create</span>
          <h1 className={styles.title}>إضافة دورة خارجية وربطها بفجوة</h1>
          <p className={styles.subtitle}>
            نموذج إنشاء دورة: إضافة دورة خارجية (رابط) وربطها بفجوة. اقتراحات AI تعبّئ الحقول بموافقتك فقط؛ لا تعبئة صامتة.
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
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 1rem' }}>بيانات الدورة الأساسية</h2>

          <div className={styles.formGroup}>
            <label>عنوان الدورة <span style={{ color: 'var(--error)' }}>*</span></label>
            <input
              className={styles.input}
              type="text"
              placeholder="مثال: React Testing Library — من الصفر للإنتاج"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </div>

          <div className={styles.grid2}>
            <div className={styles.formGroup}>
              <label>المزود (Provider) <span style={{ color: 'var(--error)' }}>*</span></label>
              <input
                className={styles.input}
                type="text"
                placeholder="مثال: QUDRA Academy, Coursera, Udemy"
                value={provider}
                onChange={e => setProvider(e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>رابط المصدر (Source URL) <span style={{ color: 'var(--error)' }}>*</span></label>
              <input
                className={styles.input}
                type="url"
                dir="ltr"
                placeholder="https://example.com/course/..."
                value={sourceUrl}
                onChange={e => setSourceUrl(e.target.value)}
                required
              />
            </div>
          </div>

          <div className={styles.grid2}>
            <div className={styles.formGroup}>
              <label>المستوى</label>
              <select className={styles.input} value={level} onChange={e => setLevel(e.target.value as typeof level)}>
                <option value="مبتدئ">مبتدئ</option>
                <option value="متوسط">متوسط</option>
                <option value="متقدم">متقدم</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>المدة (ساعات)</label>
              <input
                className={styles.input}
                type="number"
                min="0"
                dir="ltr"
                placeholder="6"
                value={durationHours}
                onChange={e => setDurationHours(parseInt(e.target.value) || 0)}
              />
            </div>
          </div>

          <div className={styles.grid2}>
            <div className={styles.formGroup}>
              <label>السعر (USD)</label>
              <input
                className={styles.input}
                type="number"
                min="0"
                step="1"
                dir="ltr"
                placeholder="0"
                value={price}
                onChange={e => setPrice(parseInt(e.target.value) || 0)}
              />
            </div>

            <div className={styles.formGroup}>
              <label>اللغة</label>
              <select className={styles.input} value={language} onChange={e => setLanguage(e.target.value)}>
                <option value="العربية">العربية</option>
                <option value="English">English</option>
                <option value="أخرى">أخرى</option>
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>الفجوة المعالجة (Gap Addressed) <span style={{ color: 'var(--error)' }}>*</span></label>
            <select
              className={styles.input}
              value={gapAddressed}
              onChange={e => setGapAddressed(e.target.value)}
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
            <label>الوصف</label>
            <textarea
              className={styles.input}
              rows={4}
              placeholder="وصف مختصر للمحتوى، المشروع التطبيقي، والمخرجات المتوقعة..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              style={{ fontFamily: 'inherit', resize: 'vertical' }}
            />
          </div>
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

        <div className={styles.actionRow} style={{ marginTop: '1.5rem' }}>
          <Button type="submit" variant="proof" size="lg" loading={loading} rightIcon={<ArrowLeft size={16} />}>
            حفظ الدورة والانتقال للنتائج ←
          </Button>
          <Button type="button" variant="ghost" size="md" onClick={() => navigate('/learn/overview')}>
            إلغاء والعودة للنظرة العامة
          </Button>
        </div>
      </form>

      <div className={styles.card} style={{ marginTop: '1.5rem', borderInlineStart: '4px solid var(--accent, #14b8a6)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <BookOpen size={18} color="var(--accent, #14b8a6)" />
          <strong style={{ fontSize: '0.9rem', color: 'var(--ink)' }}>قاعدة الإثبات: إكمال الدورة = دليل مساعد فقط</strong>
        </div>
        <p style={{ fontSize: '0.84rem', color: 'var(--ink-2)', margin: 0, lineHeight: 1.6 }}>
          لا تُعتبر الدورة إثباتاً نهائياً للقدرة. الإثبات النهائي = <strong>مشروع تطبيقي</strong> أو <strong>تحدٍ عملي موثق</strong> (Q-0367).
          الدورة تضاف إلى سجل التعلم، وعند إكمال المشروع المرتبط، يُحدث الدليل ويرفع ثقة القدرة.
        </p>
      </div>
    </div>
  );
};

export default M10CreatePage;