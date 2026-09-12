import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { Badge } from '../../components/ui/Badge';
import styles from './CompanyChallengePage.module.css';

export function CompanyChallengePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    skill: '',
    difficulty: 'intermediate',
    deadline: '',
    instructions: '',
    evalCriteria: '',
  });
  const [saved, setSaved] = useState<'draft' | 'published' | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved('published');
  };

  const handleDraft = () => {
    setSaved('draft');
  };

  return (
    <main id="main" className="wrap" tabIndex={-1} dir="rtl" style={{ padding: 'clamp(1.5rem,4vw,2.75rem) 0 5rem' }}>
      <button className="btn ghost" onClick={() => navigate(ROUTES.COMPANY_HOME)} style={{ marginBottom: '0.8rem' }}>
        ← لوحة الشركة
      </button>
      <h1 className="scr-t">إنشاء تحدٍّ للمرشحين</h1>
      <p className="scr-p">التحدي يقوّي الأدلة ويميّز المرشحين بالعمل لا بالادّعاء.</p>

      {saved && (
        <div className={`box ${styles.savedBox}`}>
          <Badge variant={saved === 'published' ? 'proof' : 'neutral'}>
            {saved === 'published' ? '✓ تم نشر التحدي' : '✓ تم الحفظ كمسودة'}
          </Badge>
          {saved === 'published' && (
            <button className="btn ghost sm" onClick={() => navigate(ROUTES.COMPANY_CANDIDATES)}>
              متابعة المرشحين ←
            </button>
          )}
        </div>
      )}

      <form className={`box ${styles.form}`} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label htmlFor="ch-title" className={styles.label}>عنوان التحدي</label>
          <input
            id="ch-title"
            type="text"
            className={styles.input}
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="مثال: بناء واجهة REST لمتجر إلكتروني"
            required
          />
        </div>

        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <label htmlFor="ch-skill" className={styles.label}>المهارة المقيَّمة</label>
            <input
              id="ch-skill"
              type="text"
              className={styles.input}
              value={form.skill}
              onChange={(e) => setForm({ ...form, skill: e.target.value })}
              placeholder="مثال: FastAPI"
              required
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="ch-difficulty" className={styles.label}>الصعوبة</label>
            <select
              id="ch-difficulty"
              className={styles.input}
              value={form.difficulty}
              onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
            >
              <option value="beginner">مبتدئ</option>
              <option value="intermediate">متوسط</option>
              <option value="advanced">متقدّم</option>
            </select>
          </div>
          <div className={styles.field}>
            <label htmlFor="ch-deadline" className={styles.label}>المهلة</label>
            <input
              id="ch-deadline"
              type="text"
              className={styles.input}
              value={form.deadline}
              onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              placeholder="مثال: 3 أيام"
              required
            />
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="ch-instructions" className={styles.label}>التعليمات</label>
          <textarea
            id="ch-instructions"
            className={styles.textarea}
            value={form.instructions}
            onChange={(e) => setForm({ ...form, instructions: e.target.value })}
            placeholder="صف المطلوب بدقة..."
            rows={5}
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="ch-criteria" className={styles.label}>معايير التقييم</label>
          <textarea
            id="ch-criteria"
            className={styles.textarea}
            value={form.evalCriteria}
            onChange={(e) => setForm({ ...form, evalCriteria: e.target.value })}
            placeholder="ما الذي يُقيَّم؟ مثال: صحة الكود، الأداء، التوثيق..."
            rows={4}
            required
          />
        </div>

        <div className={styles.actions}>
          <button type="button" className="btn ghost" onClick={handleDraft}>
            حفظ كمسودة
          </button>
          <button type="submit" className="btn dark">
            نشر التحدي
          </button>
        </div>
      </form>
    </main>
  );
}

export default CompanyChallengePage;
