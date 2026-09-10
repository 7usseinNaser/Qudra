import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import styles from './ProblemCreationPage.module.css';

export function ProblemCreationPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    businessContext: '',
    desiredOutcome: '',
    constraints: '',
    budget: '',
    timeline: '',
    location: 'remote',
    teamSize: '3',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(ROUTES.PROBLEM_ANALYSIS);
  };

  const field = (id: keyof typeof form, label: string, placeholder: string, type = 'text') => (
    <div className={styles.field} key={id}>
      <label htmlFor={`p-${id}`} className={styles.label}>{label}</label>
      {type === 'textarea' ? (
        <textarea
          id={`p-${id}`}
          className={styles.textarea}
          value={form[id]}
          onChange={(e) => setForm({ ...form, [id]: e.target.value })}
          placeholder={placeholder}
          rows={4}
          required
        />
      ) : (
        <input
          id={`p-${id}`}
          type={type}
          className={styles.input}
          value={form[id]}
          onChange={(e) => setForm({ ...form, [id]: e.target.value })}
          placeholder={placeholder}
          required
        />
      )}
    </div>
  );

  return (
    <main id="main" className="wrap" tabIndex={-1} dir="rtl" style={{ padding: 'clamp(1.5rem,4vw,2.75rem) 0 5rem' }}>
      <button className="btn ghost" onClick={() => navigate(ROUTES.COMPANY_HOME)} style={{ marginBottom: '0.8rem' }}>
        ← لوحة الشركة
      </button>
      <h1 className="scr-t">صف مشكلتك</h1>
      <p className="scr-p">صف المشكلة بدقة، والذكاء الاصطناعي سيستخرج القدرات المطلوبة ويقترح فريقًا.</p>

      <form className={`box ${styles.form}`} onSubmit={handleSubmit}>
        {field('title', 'عنوان المشكلة', 'مثال: بناء منصة تعليمية تفاعلية')}
        {field('description', 'الوصف', 'صف المشكلة بالتفصيل...', 'textarea')}
        {field('businessContext', 'السياق التجاري', 'ما السياق؟ من المتأثر؟', 'textarea')}
        {field('desiredOutcome', 'النتيجة المرغوبة', 'ما الذي يحدد النجاح؟', 'textarea')}

        <div className={styles.fieldRow}>
          {field('constraints', 'القيود', 'مثال: ميزانية محدودة، وقت ضيق')}
          {field('budget', 'الميزانية', 'مثال: 50,000 ريال')}
          {field('timeline', 'الجدول الزمني', 'مثال: 3 أشهر')}
        </div>

        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <label htmlFor="p-location" className={styles.label}>الموقع</label>
            <select id="p-location" className={styles.input} value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}>
              <option value="remote">عن بُعد</option>
              <option value="onsite">في الموقع</option>
              <option value="hybrid">هجين</option>
            </select>
          </div>
          <div className={styles.field}>
            <label htmlFor="p-teamSize" className={styles.label}>حجم الفريق</label>
            <select id="p-teamSize" className={styles.input} value={form.teamSize} onChange={(e) => setForm({ ...form, teamSize: e.target.value })}>
              <option value="1">1 شخص</option>
              <option value="2">2 أشخاص</option>
              <option value="3">3 أشخاص</option>
              <option value="5">5 أشخاص</option>
            </select>
          </div>
        </div>

        <div className={styles.actions}>
          <button type="button" className="btn ghost" onClick={() => navigate(ROUTES.COMPANY_HOME)}>
            إلغاء
          </button>
          <button type="submit" className="btn dark">
            تحليل المشكلة ←
          </button>
        </div>
      </form>
    </main>
  );
}

export default ProblemCreationPage;
