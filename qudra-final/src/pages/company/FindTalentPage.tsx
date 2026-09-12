import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import styles from './FindTalentPage.module.css';

export function FindTalentPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState('');
  const [seniority, setSeniority] = useState('');
  const [requiredSkills, setRequiredSkills] = useState('');
  const [preferredSkills, setPreferredSkills] = useState('');
  const [experience, setExperience] = useState('');
  const [team, setTeam] = useState('');
  const [responsibilities, setResponsibilities] = useState('');
  const [employmentType, setEmploymentType] = useState('');
  const [availability, setAvailability] = useState('');
  const [budget, setBudget] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = () => {
    navigate(ROUTES.REQUIREMENT_ANALYSIS.replace(':id', 'new'));
  };

  const seniorityOptions = ['Junior', 'Mid-level', 'Senior', 'Lead', 'Staff'];
  const employmentOptions = ['دوام كامل', 'دوام جزئي', 'عقد حر', 'تدريب'];
  const availabilityOptions = ['فوري', 'خلال شهر', 'خلال شهرين', 'مرن'];
  const locationOptions = ['عن بعد', 'حضوري', 'هجين'];

  return (
    <main id="main" className="wrap" tabIndex={-1} dir="rtl" style={{ padding: 'clamp(1.5rem,4vw,2.75rem) 0 5rem' }}>
      <div className={styles.headrow}>
        <div>
          <button className="btn ghost" onClick={() => navigate(ROUTES.COMPANY_HOME)} style={{ marginBottom: '0.8rem' }}>
            ← لوحة الشركة
          </button>
          <h1 className="scr-t">بحث عن مواهب</h1>
          <p className="scr-p">حدد متطلبات الدور وسنطابقك مع أفضل المرشحين.</p>
        </div>
      </div>

      <div className={`box ${styles.formpanel}`}>
        <div className={styles.fieldgroup}>
          <label className={styles.label} htmlFor="role">المسمى الوظيفي</label>
          <input id="role" className={styles.input} value={role} onChange={(e) => setRole(e.target.value)} placeholder="مثال: مهندسة برمجيات أول" />
        </div>

        <div className={styles.row}>
          <div className={styles.fieldgroup}>
            <label className={styles.label} htmlFor="seniority">المستوى</label>
            <select id="seniority" className={styles.select} value={seniority} onChange={(e) => setSeniority(e.target.value)}>
              <option value="">اختر...</option>
              {seniorityOptions.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className={styles.fieldgroup}>
            <label className={styles.label} htmlFor="employmentType">نوع التوظيف</label>
            <select id="employmentType" className={styles.select} value={employmentType} onChange={(e) => setEmploymentType(e.target.value)}>
              <option value="">اختر...</option>
              {employmentOptions.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        </div>

        <div className={styles.fieldgroup}>
          <label className={styles.label} htmlFor="requiredSkills">المهارات المطلوبة</label>
          <input id="requiredSkills" className={styles.input} value={requiredSkills} onChange={(e) => setRequiredSkills(e.target.value)} placeholder="مثال: FastAPI, PostgreSQL, Docker" />
        </div>

        <div className={styles.fieldgroup}>
          <label className={styles.label} htmlFor="preferredSkills">المهارات المفضلة</label>
          <input id="preferredSkills" className={styles.input} value={preferredSkills} onChange={(e) => setPreferredSkills(e.target.value)} placeholder="مثال: Kubernetes, Redis" />
        </div>

        <div className={styles.row}>
          <div className={styles.fieldgroup}>
            <label className={styles.label} htmlFor="experience">سنوات الخبرة</label>
            <input id="experience" className={styles.input} value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="مثال: 3-5" />
          </div>
          <div className={styles.fieldgroup}>
            <label className={styles.label} htmlFor="budget">الميزانية</label>
            <input id="budget" className={styles.input} value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="مثال: 20,000 ريال/شهر" />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.fieldgroup}>
            <label className={styles.label} htmlFor="location">الموقع</label>
            <select id="location" className={styles.select} value={location} onChange={(e) => setLocation(e.target.value)}>
              <option value="">اختر...</option>
              {locationOptions.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div className={styles.fieldgroup}>
            <label className={styles.label} htmlFor="availability">التوفر</label>
            <select id="availability" className={styles.select} value={availability} onChange={(e) => setAvailability(e.target.value)}>
              <option value="">اختر...</option>
              {availabilityOptions.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
        </div>

        <div className={styles.fieldgroup}>
          <label className={styles.label} htmlFor="team">الفريق</label>
          <input id="team" className={styles.input} value={team} onChange={(e) => setTeam(e.target.value)} placeholder="مثال: فريق الـ Backend، 5 أعضاء" />
        </div>

        <div className={styles.fieldgroup}>
          <label className={styles.label} htmlFor="responsibilities">المسؤوليات</label>
          <textarea id="responsibilities" className={styles.textarea} value={responsibilities} onChange={(e) => setResponsibilities(e.target.value)} rows={4} placeholder="اكتب المسؤوليات الرئيسية لهذا الدور..." />
        </div>

        <div className={styles.actions}>
          <button className="btn ghost" onClick={() => navigate(ROUTES.COMPANY_HOME)}>إلغاء</button>
          <button className="btn dark" onClick={handleSubmit} disabled={!role || !seniority}>
            تحليل المتطلبات ←
          </button>
        </div>
        {(!role || !seniority) && <p className={styles.hint}>أدخل المسمى والمستوى للمتابعة.</p>}
      </div>
    </main>
  );
}

export default FindTalentPage;
