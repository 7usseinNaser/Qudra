import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import styles from './m15.module.css';
import { ArrowLeft, Sparkles, FileText, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { ProblemsService, CreateProblemPayload } from '../../../services/problems.service';
import { useProblem } from '../../../contexts/useProblem';

const EXAMPLES = [
  { title: 'تطبيق جامعي', text: 'أريد بناء تطبيق يساعد طلاب الجامعة على إيجاد موادهم ومواعيدهم بسهولة.' },
  { title: 'تحليل مكالمات', text: 'عندنا مركز اتصال يستقبل 400 مكالمة عربية يوميًا، ونريد تحويلها إلى نص وتحليل الشكاوى.' },
  { title: 'متجر إلكتروني', text: 'أريد متجرًا إلكترونيًا صغيرًا لبيع منتجات يدوية، مع دفع إلكتروني وتتبّع للطلبات.' },
];

const DOMAINS = [
  'Education', 'E-commerce', 'Healthcare', 'FinTech', 'SaaS', 'Customer Support',
  'Logistics', 'Real Estate', 'Media', 'Gaming', 'AI/ML', 'IoT', 'General'
];

export const M15CreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { setProblemText } = useProblem();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [domain, setDomain] = useState('General');
  const [hasError, setHasError] = useState(false);
  const [errorField, setErrorField] = useState<'title' | 'description' | null>(null);
  const [creating, setCreating] = useState(false);
  const [showExplain, setShowExplain] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const validate = useCallback(() => {
    let valid = true;
    if (!title.trim()) {
      setErrorField('title');
      valid = false;
    }
    if (!description.trim() || description.trim().length < 15) {
      setErrorField('description');
      valid = false;
    }
    setHasError(!valid);
    return valid;
  }, [title, description]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setCreating(true);
    setHasError(false);

    try {
      const payload: CreateProblemPayload = { title: title.trim(), description: description.trim(), domain };
      const result = await ProblemsService.create(payload);
      setProblemText(description.trim());
      navigate(`/problem/analysis/${result.id}`);
    } catch (err) {
      console.error('Create problem failed:', err);
      setHasError(true);
      setErrorField('description');
    }
    setCreating(false);
  };

  const handleUseExample = (example: { title: string; text: string }) => {
    setTitle(example.title);
    setDescription(example.text);
    setHasError(false);
    setErrorField(null);
    if (textareaRef.current) textareaRef.current.focus();
  };

  return (
    <div className={styles.container} dir="rtl">
      <div className={styles.headerRow}>
        <div className={styles.headerContent}>
          <Button variant="ghost" size="sm" onClick={() => navigate('/problem')} leftIcon={<ArrowLeft size={16} />}>
            العودة
          </Button>
          <span className={styles.badgeQ}>M15 · Q-0564 · ⚓ Create</span>
          <h1 className={styles.title}>إنشاء مشكلة جديدة</h1>
          <p className={styles.subtitle}>
            اكتب مشكلتك بلغتك — نحن نستخرج القدرات ونولّد المحاكاة تلقائيًا.
            لا تحتاج مسمّى وظيفي، فقط صف النتيجة التي تريدها.
          </p>
        </div>

        <Button
          variant="outline"
          size="md"
          onClick={() => setShowExplain(!showExplain)}
          leftIcon={<Sparkles size={16} />}
        >
          {showExplain ? 'إخفاء التفسير' : 'اشرح لي: كيف يعمل الإنشاء؟'}
        </Button>
      </div>

      {showExplain && (
        <div className={styles.explainDrawer}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
            <Sparkles size={18} color="var(--proof)" />
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: 'var(--ink)' }}>
              تفسير الذكاء الاصطناعي: من الإنشاء إلى التحليل
            </h3>
          </div>
          <p style={{ margin: '0 0 1rem', fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--ink-2)' }}>
            عند الضغط على <strong>«إنشاء وبدء التحليل»</strong>:
            <br/>1. تُحفظ المشكلة في قاعدة البيانات
            <br/>2. يُنقل نص الوصف إلى <code>ProblemContext</code>
            <br/>3. تبدأ شاشة التحليل المرحلية ذات الـ 6 مراحل (M15 Analyzing Overlay)
            <br/>4. بعد اكتمال المراحل → انتقال تلقائي لصفحة القدرات للمصادقة
            <br/>لا درجات مخفية — كل مرحلة تعرض مخرجاتها.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.formCard}>
        <div className={styles.formGroup}>
          <label htmlFor="title" className={styles.label}>عنوان المشكلة <span className={styles.required}>*</span></label>
          <input
            id="title"
            type="text"
            className={`${styles.input} ${hasError && errorField === 'title' ? styles.inputError : ''}`}
            value={title}
            onChange={(e) => { setTitle(e.target.value); if (e.target.value.trim()) { setHasError(false); setErrorField(null); } }}
            placeholder="مثال: تطبيق جامعي لإدارة المواد والمواعيد"
            maxLength={120}
            disabled={creating}
            aria-invalid={hasError && errorField === 'title'}
          />
          {hasError && errorField === 'title' && (
            <p className={styles.fieldError}><AlertCircle size={14} /> مطلوب — عنوان واضح للمشكلة</p>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="domain" className={styles.label}>النطاق (اختياري)</label>
          <select
            id="domain"
            className={styles.select}
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            disabled={creating}
          >
            {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description" className={styles.label}>
            وصف المشكلة <span className={styles.required}>*</span>
            <span className={styles.charCount}>{description.length} / 2000</span>
          </label>
          <textarea
            id="description"
            ref={textareaRef}
            className={`${styles.textarea} ${hasError && errorField === 'description' ? styles.inputError : ''}`}
            value={description}
            onChange={(e) => { setDescription(e.target.value); if (e.target.value.trim().length >= 15) { setHasError(false); setErrorField(null); } }}
            placeholder="اكتب مشكلتك هنا... مثال: أريد بناء تطبيق يساعد طلاب الجامعة على إيجاد موادهم ومواعيدهم بسهولة."
            rows={6}
            maxLength={2000}
            disabled={creating}
            aria-invalid={hasError && errorField === 'description'}
          />
          {hasError && errorField === 'description' && (
            <p className={styles.fieldError}><AlertCircle size={14} /> مطلوب — 15 حرفًا على الأقل لوصف المشكلة</p>
          )}
          <div className={styles.hint}>لا تحتاج مسمّى وظيفي. اكتب <b>ماذا تريد أن يحدث</b> لا <b>بأي تقنية</b>.</div>
        </div>

        <div className={styles.examplesSection}>
          <span className={styles.examplesLabel}>أو ابدأ من مثال:</span>
          <div className={styles.examplesGrid}>
            {EXAMPLES.map((ex, i) => (
              <button
                key={i}
                type="button"
                className={styles.exampleCard}
                onClick={() => handleUseExample(ex)}
                disabled={creating}
              >
                <span className={styles.exampleTitle}>{ex.title}</span>
                <span className={styles.exampleText}>{ex.text.slice(0, 60)}...</span>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.submitRow}>
          <Button type="submit" variant="proof" size="lg" disabled={creating} leftIcon={creating ? <Loader2 size={16} className={styles.spin} /> : <FileText size={16} />}>
            {creating ? 'جاري الإنشاء والتحليل...' : 'إنشاء وبدء التحليل'}
          </Button>
          <Button type="button" variant="ghost" size="lg" onClick={() => navigate('/problem')}>
            إلغاء
          </Button>
        </div>
      </form>

      <div className={styles.infoCard}>
        <div className={styles.infoItem}>
          <CheckCircle size={20} style={{ color: '#10B981' }} />
          <div>
            <strong>تحليل مرئي 6 مراحل</strong>
            <span>كل مرحلة تعرض مخرجاتها — لا صندوق أسود</span>
          </div>
        </div>
        <div className={styles.infoItem}>
          <CheckCircle size={20} style={{ color: '#10B981' }} />
          <div>
            <strong>استخراج قدرات حقيقية</strong>
            <span>مرتبطة بعبارات من نصك مباشرة</span>
          </div>
        </div>
        <div className={styles.infoItem}>
          <CheckCircle size={20} style={{ color: '#10B981' }} />
          <div>
            <strong>محاكاة مخصصة</strong>
            <span>مهام مبنية على مشكلتك أنت — لا قوالب عامة</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default M15CreatePage;