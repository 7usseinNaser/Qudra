import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import styles from './M23CreatePage.module.css';

interface FormData {
  type: 'question' | 'insight' | 'resource' | 'discussion';
  title: string;
  content: string;
  tags: string;
}

const types = [
  { value: 'question', label: 'سؤال', icon: '❓' },
  { value: 'insight', label: 'رؤية/خبرة', icon: '💡' },
  { value: 'resource', label: 'مصدر/أداة', icon: '📎' },
  { value: 'discussion', label: 'نقاش مفتوح', icon: '💬' },
];

export function M23CreatePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    type: 'insight',
    title: '',
    content: '',
    tags: '',
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validate = () => {
    const newErrors: Partial<FormData> = {};
    if (!formData.title.trim()) newErrors.title = 'العنوان مطلوب';
    if (!formData.content.trim()) newErrors.content = 'المحتوى مطلوب';
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
    setTimeout(() => navigate(ROUTES.M23_OVERVIEW), 2000);
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
          <h1 className="scr-t">تم إنشاء المشاركة بنجاح</h1>
          <p className={styles.successdesc}>جاري توجيهك إلى المجتمع...</p>
        </div>
      </main>
    );
  }

  return (
    <main id="main" className="wrap" tabIndex={-1} dir="rtl" style={{ padding: 'clamp(1.5rem,4vw,2.75rem) 0 5rem' }}>
      <div className={styles.header}>
        <button className="btn ghost" onClick={() => navigate(ROUTES.M23_OVERVIEW)}>← العودة</button>
        <h1 className="scr-t">إنشاء مشاركة جديدة</h1>
      </div>

      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <div className={styles.section}>
          <h3 className={styles.sectiontitle}>نوع المشاركة</h3>
          <div className={styles.typegroup}>
            {types.map((t) => (
              <label key={t.value} className={`${styles.typeoption} ${formData.type === t.value ? styles.selected : ''}`}>
                <input
                  type="radio"
                  name="type"
                  value={t.value}
                  checked={formData.type === t.value}
                  onChange={e => handleChange('type', e.target.value)}
                  disabled={isSubmitting}
                />
                <span className={styles.typeicon}>{t.icon}</span>
                <span className={styles.typelabel}>{t.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectiontitle}>العنوان والمحتوى</h3>
          <div className={styles.field}>
            <label htmlFor="title" className={styles.label}>العنوان <span className="required">*</span></label>
            <input
              type="text"
              id="title"
              className={`${styles.input} ${errors.title ? styles.error : ''}`}
              value={formData.title}
              onChange={e => handleChange('title', e.target.value)}
              placeholder="عنوان واضح وجذاب..."
              disabled={isSubmitting}
            />
            {errors.title && <span className={styles.errormsg}>{errors.title}</span>}
          </div>
          <div className={styles.field}>
            <label htmlFor="content" className={styles.label}>المحتوى <span className="required">*</span></label>
            <textarea
              id="content"
              className={`${styles.textarea} ${errors.content ? styles.error : ''}`}
              value={formData.content}
              onChange={e => handleChange('content', e.target.value)}
              placeholder="اكتب مشاركتك هنا... يدعم تنسيق النص"
              rows={10}
              disabled={isSubmitting}
            />
            {errors.content && <span className={styles.errormsg}>{errors.content}</span>}
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectiontitle}>الوسوم (اختياري)</h3>
          <div className={styles.field}>
            <input
              type="text"
              id="tags"
              className={styles.input}
              value={formData.tags}
              onChange={e => handleChange('tags', e.target.value)}
              placeholder="PostgreSQL, Performance, Backend (مفصولة بفواصل)"
              disabled={isSubmitting}
            />
            <p className={styles.hint}>أضف 3-5 وسوم للوصول للمهتمين</p>
          </div>
        </div>

        <div className={styles.actions}>
          <button type="button" className="btn ghost" onClick={() => navigate(ROUTES.M23_OVERVIEW)} disabled={isSubmitting}>
            إلغاء
          </button>
          <button type="submit" className="btn dark" disabled={isSubmitting}>
            {isSubmitting ? 'جاري النشر...' : 'نشر المشاركة'}
          </button>
        </div>
      </form>
    </main>
  );
}

export default M23CreatePage;