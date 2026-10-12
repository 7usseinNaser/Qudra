import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import styles from './M19CreatePage.module.css';

interface FormData {
  name: string;
  email: string;
  title: string;
  phone: string;
  stage: string;
  skills: string;
  notes: string;
}

const stages = [
  { value: 'sourced', label: 'مصدر' },
  { value: 'screening', label: 'فرز' },
  { value: 'technical', label: 'تقني' },
  { value: 'interview', label: 'مقابلة' },
  { value: 'offer', label: 'عرض' },
  { value: 'hired', label: 'معين' },
];

export function M19CreatePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    title: '',
    phone: '',
    stage: 'sourced',
    skills: '',
    notes: '',
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validate = () => {
    const newErrors: Partial<FormData> = {};
    if (!formData.name.trim()) newErrors.name = 'اسم المرشح مطلوب';
    if (!formData.email.trim()) newErrors.email = 'البريد الإلكتروني مطلوب';
    if (!formData.title.trim()) newErrors.title = 'المسمى الوظيفي مطلوب';
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
    setTimeout(() => navigate(ROUTES.M19_OVERVIEW), 2000);
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
          <h1 className="scr-t">تم إضافة المرشح بنجاح</h1>
          <p className={styles.successdesc}>جاري توجيهك إلى خط المرشحين...</p>
        </div>
      </main>
    );
  }

  return (
    <main id="main" className="wrap" tabIndex={-1} dir="rtl" style={{ padding: 'clamp(1.5rem,4vw,2.75rem) 0 5rem' }}>
      <div className={styles.header}>
        <button className="btn ghost" onClick={() => navigate(ROUTES.M19_OVERVIEW)}>← العودة</button>
        <h1 className="scr-t">إضافة مرشح جديد</h1>
      </div>

      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <div className={styles.section}>
          <h3 className={styles.sectiontitle}>معلومات المرشح</h3>
          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="name" className={styles.label}>الاسم <span className="required">*</span></label>
              <input
                type="text"
                id="name"
                className={`${styles.input} ${errors.name ? styles.error : ''}`}
                value={formData.name}
                onChange={e => handleChange('name', e.target.value)}
                placeholder="مثال: سارة المطيري"
                disabled={isSubmitting}
              />
              {errors.name && <span className={styles.errormsg}>{errors.name}</span>}
            </div>
            <div className={styles.field}>
              <label htmlFor="email" className={styles.label}>البريد الإلكتروني <span className="required">*</span></label>
              <input
                type="email"
                id="email"
                className={`${styles.input} ${errors.email ? styles.error : ''}`}
                value={formData.email}
                onChange={e => handleChange('email', e.target.value)}
                placeholder="sara@example.com"
                disabled={isSubmitting}
              />
              {errors.email && <span className={styles.errormsg}>{errors.email}</span>}
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="title" className={styles.label}>المسمى الوظيفي <span className="required">*</span></label>
              <input
                type="text"
                id="title"
                className={`${styles.input} ${errors.title ? styles.error : ''}`}
                value={formData.title}
                onChange={e => handleChange('title', e.target.value)}
                placeholder="مثال: مهندسة Backend"
                disabled={isSubmitting}
              />
              {errors.title && <span className={styles.errormsg}>{errors.title}</span>}
            </div>
            <div className={styles.field}>
              <label htmlFor="phone" className={styles.label}>الهاتف</label>
              <input
                type="tel"
                id="phone"
                className={styles.input}
                value={formData.phone}
                onChange={e => handleChange('phone', e.target.value)}
                placeholder="+966 50 123 4567"
                disabled={isSubmitting}
              />
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectiontitle}>المرحلة والمهارات</h3>
          <div className={styles.field}>
            <label htmlFor="stage" className={styles.label}>المرحلة الحالية</label>
            <select
              id="stage"
              className={styles.select}
              value={formData.stage}
              onChange={e => handleChange('stage', e.target.value)}
              disabled={isSubmitting}
            >
              {stages.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          <div className={styles.field}>
            <label htmlFor="skills" className={styles.label}>المهارات (مفصولة بفواصل)</label>
            <textarea
              id="skills"
              className={styles.textarea}
              value={formData.skills}
              onChange={e => handleChange('skills', e.target.value)}
              placeholder="FastAPI, PostgreSQL, Docker, Kubernetes"
              rows={3}
              disabled={isSubmitting}
            />
            <p className={styles.hint}>سيتم تحليل المهارات ومقارنتها بالمتطلبات تلقائياً</p>
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectiontitle}>ملاحظات (اختياري)</h3>
          <div className={styles.field}>
            <textarea
              id="notes"
              className={styles.textarea}
              value={formData.notes}
              onChange={e => handleChange('notes', e.target.value)}
              placeholder="أي ملاحظات إضافية حول المرشح..."
              rows={4}
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className={styles.actions}>
          <button type="button" className="btn ghost" onClick={() => navigate(ROUTES.M19_OVERVIEW)} disabled={isSubmitting}>
            إلغاء
          </button>
          <button type="submit" className="btn dark" disabled={isSubmitting}>
            {isSubmitting ? 'جاري الإضافة...' : 'إضافة المرشح'}
          </button>
        </div>
      </form>
    </main>
  );
}

export default M19CreatePage;