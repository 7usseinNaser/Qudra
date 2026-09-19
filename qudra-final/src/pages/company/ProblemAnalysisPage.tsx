import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { Badge } from '../../components/ui/Badge';
import { Bar } from '../../components/ui/Bar';
import { Tag } from '../../components/ui/Tag';
import styles from './ProblemAnalysisPage.module.css';

interface RequiredCapability {
  skill: string;
  level: string;
  confidence: number;
}

const REQUIRED_CAPS: RequiredCapability[] = [
  { skill: 'FastAPI & Microservices', level: 'ADVANCED', confidence: 95 },
  { skill: 'PostgreSQL & Database Design', level: 'ADVANCED', confidence: 92 },
  { skill: 'Frontend (React)', level: 'INTERMEDIATE', confidence: 88 },
  { skill: 'Docker & DevOps', level: 'INTERMEDIATE', confidence: 80 },
  { skill: 'UI/UX Design', level: 'BEGINNER', confidence: 65 },
];

const MISSING_INFO = [
  'لم يتم تحديد عدد المستخدمين المتوقع',
  'لم يتم توضيح ما إذا كانت المنصة تدعم اللغة الإنجليزية',
];

export function ProblemAnalysisPage() {
  const navigate = useNavigate();
  const [accepted, setAccepted] = useState(false);

  return (
    <main id="main" className="wrap" tabIndex={-1} dir="rtl" style={{ padding: 'clamp(1.5rem,4vw,2.75rem) 0 5rem' }}>
      <button className="btn ghost" onClick={() => navigate(ROUTES.PROBLEM_CREATION)} style={{ marginBottom: '0.8rem' }}>
        ← تعديل المشكلة
      </button>
      <h1 className="scr-t">تحليل المشكلة</h1>
      <p className="scr-p">الذكاء الاصطناعي حلّل المشكلة واستخرج القدرات المطلوبة.</p>

      <div className={`box ${styles.section}`}>
        <h2 className={styles.sectionTitle}>الملخّص</h2>
        <p className={styles.summary}>
          منصة تعليمية تفاعلية تربط الطلاب بالمدرسين والمواد. تتطلب بنية خلفية قوية وواجهة أمامية سلسة،
          مع تصميم تجربة مستخدم تعليمية. التعقيد متوسط—عالٍ.
        </p>
        <div className={styles.complexityRow}>
          <span className={styles.complexityLabel}>التعقيد:</span>
          <Badge variant="gap">متوسط — عالٍ</Badge>
        </div>
      </div>

      <div className={`box ${styles.section}`}>
        <h2 className={styles.sectionTitle}>القدرات المطلوبة</h2>
        <div className={styles.capList}>
          {REQUIRED_CAPS.map((cap) => (
            <div key={cap.skill} className={styles.capRow}>
              <div className={styles.capInfo}>
                <Tag name={cap.skill} variant="proven" size="sm" />
                <Badge variant={cap.confidence >= 85 ? 'proof' : 'neutral'}>{cap.level}</Badge>
              </div>
              <div className={styles.capConfidence}>
                <span className={`${styles.capScore} num`}>{cap.confidence}%</span>
                <Bar value={cap.confidence} max={100} size="sm" variant={cap.confidence >= 85 ? 'proof' : 'gap'} className={styles.capBar} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`box ${styles.section}`}>
        <h2 className={styles.sectionTitle}>معلومات ناقصة</h2>
        {MISSING_INFO.length > 0 ? (
          <ul className={styles.missingList}>
            {MISSING_INFO.map((m, i) => (
              <li key={i} className={styles.missingItem}>
                <span className={styles.warnIcon} aria-hidden="true">⚠</span>
                {m}
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.text}>لا توجد معلومات ناقصة.</p>
        )}
      </div>

      <div className={`box ${styles.section}`}>
        <h2 className={styles.sectionTitle}>الفريق المقترح</h2>
        <div className={styles.teamSuggestion}>
          <div className={styles.teamMember}>
            <span className={styles.teamAvatar}>B</span>
            <div>
              <span className={styles.teamRole}>مهندس Backend</span>
              <span className={styles.teamSkill}>FastAPI + PostgreSQL</span>
            </div>
          </div>
          <div className={styles.teamMember}>
            <span className={styles.teamAvatar}>F</span>
            <div>
              <span className={styles.teamRole}>مطوّر Frontend</span>
              <span className={styles.teamSkill}>React</span>
            </div>
          </div>
          <div className={styles.teamMember}>
            <span className={styles.teamAvatar}>D</span>
            <div>
              <span className={styles.teamRole}>مصمم UI/UX</span>
              <span className={styles.teamSkill}>تصميم تعليمي</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <button className="btn ghost" onClick={() => navigate(ROUTES.PROBLEM_CREATION)}>
          تعديل
        </button>
        {!accepted ? (
          <button className="btn dark" onClick={() => setAccepted(true)}>
            قبول التحليل
          </button>
        ) : (
          <button className="btn dark" onClick={() => navigate(ROUTES.PROBLEM_CANDIDATES)}>
            متابعة ← المرشحون
          </button>
        )}
      </div>
    </main>
  );
}

export default ProblemAnalysisPage;
