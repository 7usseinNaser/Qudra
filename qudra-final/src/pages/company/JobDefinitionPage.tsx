import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { Badge } from '../../components/ui/Badge';
import styles from './JobDefinitionPage.module.css';

export function JobDefinitionPage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [responsibilities, setResponsibilities] = useState('');
  const [team, setTeam] = useState('');
  const [context, setContext] = useState('');
  const [outcomes, setOutcomes] = useState('');

  const [skills, setSkills] = useState('');
  const [levels, setLevels] = useState('');
  const [experience, setExperience] = useState('');
  const [constraints, setConstraints] = useState('');
  const [availability, setAvailability] = useState('');
  const [complexity, setComplexity] = useState('');
  const [requiredEvidence, setRequiredEvidence] = useState('');

  const handleSubmit = () => {
    navigate(ROUTES.REQUIREMENT_ANALYSIS.replace(':id', 'new'));
  };

  return (
    <main id="main" className="wrap" tabIndex={-1} dir="rtl" style={{ padding: 'clamp(1.5rem,4vw,2.75rem) 0 5rem' }}>
      <div className={styles.headrow}>
        <div>
          <button className="btn ghost" onClick={() => navigate(ROUTES.COMPANY_HOME)} style={{ marginBottom: '0.8rem' }}>
            ← لوحة الشركة
          </button>
          <h1 className="scr-t">تعريف الوظيفة</h1>
          <p className="scr-p">طبقة إنسانية للوصف وطبقة منظمة للمتطلبات المهارية.</p>
        </div>
      </div>

      <div className={styles.grid}>
        <div className={`box ${styles.panel}`}>
          <div className={styles.panelheader}>
            <h3 className={styles.paneltitle}>الطبقة الإنسانية</h3>
            <Badge variant="neutral">وصف</Badge>
          </div>

          <div className={styles.fieldgroup}>
            <label className={styles.label} htmlFor="title">المسمى</label>
            <input id="title" className={styles.input} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="مثال: مهندسة برمجيات أول" />
          </div>

          <div className={styles.fieldgroup}>
            <label className={styles.label} htmlFor="summary">الملخص</label>
            <textarea id="summary" className={styles.textarea} value={summary} onChange={(e) => setSummary(e.target.value)} rows={3} placeholder="ملخص قصير عن الدور..." />
          </div>

          <div className={styles.fieldgroup}>
            <label className={styles.label} htmlFor="responsibilities">المسؤوليات</label>
            <textarea id="responsibilities" className={styles.textarea} value={responsibilities} onChange={(e) => setResponsibilities(e.target.value)} rows={4} placeholder="المسؤوليات الرئيسية..." />
          </div>

          <div className={styles.fieldgroup}>
            <label className={styles.label} htmlFor="team">الفريق</label>
            <input id="team" className={styles.input} value={team} onChange={(e) => setTeam(e.target.value)} placeholder="مثال: فريق الـ Backend" />
          </div>

          <div className={styles.fieldgroup}>
            <label className={styles.label} htmlFor="context">السياق</label>
            <textarea id="context" className={styles.textarea} value={context} onChange={(e) => setContext(e.target.value)} rows={3} placeholder="السياق التقني والتجاري..." />
          </div>

          <div className={styles.fieldgroup}>
            <label className={styles.label} htmlFor="outcomes">النتائج المتوقعة</label>
            <textarea id="outcomes" className={styles.textarea} value={outcomes} onChange={(e) => setOutcomes(e.target.value)} rows={3} placeholder="ما الذي يجب تحقيقه في أول 6 أشهر؟" />
          </div>
        </div>

        <div className={`box ${styles.panel}`}>
          <div className={styles.panelheader}>
            <h3 className={styles.paneltitle}>الطبقة المنظمة</h3>
            <Badge variant="proof">مهاري</Badge>
          </div>

          <div className={styles.fieldgroup}>
            <label className={styles.label} htmlFor="skills">المهارات</label>
            <input id="skills" className={styles.input} value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="مثال: FastAPI, PostgreSQL, Docker" />
          </div>

          <div className={styles.fieldgroup}>
            <label className={styles.label} htmlFor="levels">المستويات المطلوبة</label>
            <input id="levels" className={styles.input} value={levels} onChange={(e) => setLevels(e.target.value)} placeholder="مثال: ADVANCED, INTERMEDIATE" />
          </div>

          <div className={styles.fieldgroup}>
            <label className={styles.label} htmlFor="experience">الخبرة</label>
            <input id="experience" className={styles.input} value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="مثال: 3-5 سنوات" />
          </div>

          <div className={styles.fieldgroup}>
            <label className={styles.label} htmlFor="constraints">القيود</label>
            <input id="constraints" className={styles.input} value={constraints} onChange={(e) => setConstraints(e.target.value)} placeholder="مثال: متاح للعمل عن بعد" />
          </div>

          <div className={styles.fieldgroup}>
            <label className={styles.label} htmlFor="availability">التوفر</label>
            <input id="availability" className={styles.input} value={availability} onChange={(e) => setAvailability(e.target.value)} placeholder="مثال: فوري" />
          </div>

          <div className={styles.fieldgroup}>
            <label className={styles.label} htmlFor="complexity">التعقيد</label>
            <input id="complexity" className={styles.input} value={complexity} onChange={(e) => setComplexity(e.target.value)} placeholder="مثال: متوسط-عالي" />
          </div>

          <div className={styles.fieldgroup}>
            <label className={styles.label} htmlFor="requiredEvidence">الأدلة المطلوبة</label>
            <input id="requiredEvidence" className={styles.input} value={requiredEvidence} onChange={(e) => setRequiredEvidence(e.target.value)} placeholder="مثال: مستودع GitHub، تقييم شفاهي" />
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <button className="btn ghost" onClick={() => navigate(ROUTES.COMPANY_HOME)}>إلغاء</button>
        <button className="btn dark" onClick={handleSubmit} disabled={!title}>
          تحليل المتطلبات ←
        </button>
      </div>
      {!title && <p className={styles.hint}>أدخل المسمى للمتابعة.</p>}
    </main>
  );
}

export default JobDefinitionPage;
