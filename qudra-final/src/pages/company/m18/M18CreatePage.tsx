import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import styles from './M18CreatePage.module.css';

interface FormData {
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  requiredSkills: string;
  budget: string;
  timeline: string;
}

const categories = [
  'هندسة البرمجيات',
  'الذكاء الاصطناعي',
  'علم البيانات',
  'DevOps والبنية التحتية',
  'الأمن السيبراني',
  'تصميم المنتج',
  'إدارة المنتجات',
  'أخرى',
];

const priorities = [
  { value: 'low', label: 'منخفضة', color: 'neutral' },
  { value: 'medium', label: 'متوسطة', color: 'gap' },
  { value: 'high', label: 'عالية', color: 'proof' },
  { value: 'critical', label: 'حرجة', color: 'danger' },
];

export function M18CreatePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    category: '',
    priority: 'medium',
    requiredSkills: '',
    budget: '',
    timeline: '',
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validate = () => {
    const newErrors: Partial<FormData> = {};
    if (!formData.title.trim()) newErrors.title = 'عنوان المشكلة مطلوب';
    if (!formData.description.trim()) newErrors.description = 'وصف المشكلة مطلوب';
    if (!formData.category) newErrors.category = 'اختر تصنيفاً';
    if (!formData.requiredSkills.trim()) newErrors.requiredSkills = 'المهارات المطلوبة مطلوبة';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setSubmitSuccess(true);
    setTimeout(() => navigate(ROUTES.M18_RESULTS), 2000);
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  if (submitSuccess) {
    return (
      <main id="main" className="wrap" tabIndex={-1} dir="rtl" style={{ padding: 'clamp(2rem,5vw,4rem) 0' }}>
        <div className={styles.success}>
          <div className={styles.successicon} aria-hidden="true">✓</div>
          <h1 className="scr-t">تم إنشاء المشكلة بنجاح</h1>
          <p className={styles.successdesc}>جاري توجيهك إلى صفحة النتائج...</p>
        </div>
      </main>
    );
  }

  return (
    <main id="main" className="wrap" tabIndex={-1} dir="rtl" style={{ padding: 'clamp(1.5rem,4vw,2.75rem) 0 5rem' }}>
      <div className={styles.header}>
        <button className="btn ghost" onClick={() => navigate(ROUTES.M18_OVERVIEW)}>← العودة</button>
        <h1 className="scr-t">إنشاء مشكلة جديدة</h1>
      </div>

      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <div className={styles.section}>
          <h3 className={styles.sectiontitle}>المعلومات الأساسية</h3>
          <div className={styles.field}>
            <label htmlFor="title" className={styles.label}>عنوان المشكلة <span className="required">*</span></label>
            <input
              type="text"
              id="title"
              className={`${styles.input} ${errors.title ? styles.error : ''}`}
              value={formData.title}
              onChange={e => handleChange('title', e.target.value)}
              placeholder="مثال: بناء نظام توصيات ذكي للمسارات التعليمية"
              disabled={isSubmitting}
            />
            {errors.title && <span className={styles.errormsg}>{errors.title}</span>}
          </div>
          <div className={styles.field}>
            <label htmlFor="description" className={styles.label}>وصف المشكلة <span className="required">*</span></label>
            <textarea
              id="description"
              className={`${styles.textarea} ${errors.description ? styles.error : ''}`}
              value={formData.description}
              onChange={e => handleChange('description', e.target.value)}
              placeholder="صف المشكلة بالتفصيل: ما هو التحدي؟ ما هي النتيجة المتوقعة؟ ما هي القيود؟"
              rows={5}
              disabled={isSubmitting}
            />
            {errors.description && <span className={styles.errormsg}>{errors.description}</span>}
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectiontitle}>التصنيف والأولوية</h3>
          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="category" className={styles.label}>التصنيف <span className="required">*</span></label>
              <select
                id="category"
                className={`${styles.select} ${errors.category ? styles.error : ''}`}
                value={formData.category}
                onChange={e => handleChange('category', e.target.value)}
                disabled={isSubmitting}
              >
                <option value="">اختر التصنيف</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.category && <span className={styles.errormsg}>{errors.category}</span>}
            </div>
            <div className={styles.field}>
              <label className={styles.label}>الأولوية <span className="required">*</span></label>
              <div className={styles.prioritygroup}>
                {priorities.map(p => (
                  <label key={p.value} className={`${styles.priorityoption} ${formData.priority === p.value ? styles.selected : ''}`}>
                    <input
                      type="radio"
                      name="priority"
                      value={p.value}
                      checked={formData.priority === p.value}
                      onChange={e => handleChange('priority', e.target.value)}
                      disabled={isSubmitting}
                    />
                    <span className={styles.prioritylabel}>{p.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectiontitle}>المتطلبات التقنية</h3>
          <div className={styles.field}>
            <label htmlFor="requiredSkills" className={styles.label}>المهارات المطلوبة <span className="required">*</span></label>
            <textarea
              id="requiredSkills"
              className={`${styles.textarea} ${errors.requiredSkills ? styles.error : ''}`}
              value={formData.requiredSkills}
              onChange={e => handleChange('requiredSkills', e.target.value)}
              placeholder="اكتب المهارات سطراً بسطر أو مفصولة بفواصل (مثال: React, TypeScript, PostgreSQL, Docker)"
              rows={3}
              disabled={isSubmitting}
            />
            {errors.requiredSkills && <span className={styles.errormsg}>{errors.requiredSkills}</span>}
            <p className={styles.hint}>سيحلل النظام هذه المهارات ويحدد القدرات المطلوبة تلقائياً</p>
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectiontitle}>التفاصيل الإضافية (اختياري)</h3>
          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="budget" className={styles.label}>الميزانية التقديرية</label>
              <input
                type="text"
                id="budget"
                className={styles.input}
                value={formData.budget}
                onChange={e => handleChange('budget', e.target.value)}
                placeholder="مثال: 50,000 - 100,000 ر.س"
                disabled={isSubmitting}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="timeline" className={styles.label}>الجدول الزمني المتوقع</label>
              <input
                type="text"
                id="timeline"
                className={styles.input}
                value={formData.timeline}
                onChange={e => handleChange('timeline', e.target.value)}
                placeholder="مثال: 3 أشهر"
                disabled={isSubmitting}
              />
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button type="button" className="btn ghost" onClick={() => navigate(ROUTES.M18_OVERVIEW)} disabled={isSubmitting}>
            إلغاء
          </button>
          <button type="submit" className="btn dark" disabled={isSubmitting}>
            {isSubmitting ? 'جاري الإنشاء...' : 'إنشاء المشكلة'}
          </button>
        </div>
      </form>
    </main>
  );
}

export default M18CreatePage;