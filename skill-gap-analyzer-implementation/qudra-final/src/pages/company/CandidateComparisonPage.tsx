import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { Tag } from '../../components/ui/Tag';
import styles from './CandidateComparisonPage.module.css';

interface CompareRow {
  skill: string;
  aLevel: string;
  bLevel: string;
  aEvidence: number;
  bEvidence: number;
  aScore: number;
  bScore: number;
}

const ROWS: CompareRow[] = [
  { skill: 'FastAPI', aLevel: 'ADVANCED', bLevel: 'INTERMEDIATE', aEvidence: 5, bEvidence: 3, aScore: 95, bScore: 72 },
  { skill: 'PostgreSQL', aLevel: 'ADVANCED', bLevel: 'ADVANCED', aEvidence: 9, bEvidence: 6, aScore: 92, bScore: 88 },
  { skill: 'Docker', aLevel: 'INTERMEDIATE', bLevel: 'INTERMEDIATE', aEvidence: 3, bEvidence: 3, aScore: 85, bScore: 75 },
  { skill: 'System Design', aLevel: 'BEGINNER', bLevel: 'INTERMEDIATE', aEvidence: 0, bEvidence: 1, aScore: 30, bScore: 60 },
  { skill: 'CI/CD', aLevel: 'INTERMEDIATE', bLevel: 'BEGINNER', aEvidence: 2, bEvidence: 0, aScore: 70, bScore: 25 },
];

const CAND_A = { name: 'لينا الحربي', title: 'Senior Backend Developer', score: 92 };
const CAND_B = { name: 'محمد الدوسري', title: 'Senior Backend Developer', score: 85 };

export function CandidateComparisonPage() {
  const navigate = useNavigate();
  const aWins = ROWS.filter((r) => r.aScore > r.bScore).length;
  const bWins = ROWS.filter((r) => r.bScore > r.aScore).length;

  return (
    <main id="main" className="wrap" tabIndex={-1} dir="rtl" style={{ padding: 'clamp(1.5rem,4vw,2.75rem) 0 5rem' }}>
      <button className="btn ghost" onClick={() => navigate(ROUTES.COMPANY_CANDIDATES)} style={{ marginBottom: '0.8rem' }}>
        ← المرشحون
      </button>
      <h1 className="scr-t">مقارنة المرشحين</h1>
      <p className="scr-p">من يكمّل من؟ بدل من يسبق من.</p>

      <div className={styles.vsHeader}>
        <div className={styles.vsCol}>
          <span className={styles.vsAvatar}>{CAND_A.name.charAt(0)}</span>
          <h3 className={styles.vsName}>{CAND_A.name}</h3>
          <span className={styles.vsTitle}>{CAND_A.title}</span>
          <span className={`${styles.vsScore} num`}>{CAND_A.score}%</span>
        </div>
        <span className={styles.vsLabel}>VS</span>
        <div className={styles.vsCol}>
          <span className={styles.vsAvatar}>{CAND_B.name.charAt(0)}</span>
          <h3 className={styles.vsName}>{CAND_B.name}</h3>
          <span className={styles.vsTitle}>{CAND_B.title}</span>
          <span className={`${styles.vsScore} num`}>{CAND_B.score}%</span>
        </div>
      </div>

      <div className={`box ${styles.tableWrap}`}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>القدرة</th>
              <th>{CAND_A.name}</th>
              <th>{CAND_B.name}</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.skill}>
                <td className={styles.skillCell}>
                  <Tag name={r.skill} variant="proven" size="sm" />
                </td>
                <td className={r.aScore >= r.bScore ? styles.winCell : styles.loseCell}>
                  <span className={styles.cellLevel}>{r.aLevel}</span>
                  <span className={`${styles.cellScore} num`}>{r.aScore}%</span>
                  <span className={styles.cellEv}>{r.aEvidence} دليل</span>
                </td>
                <td className={r.bScore > r.aScore ? styles.winCell : styles.loseCell}>
                  <span className={styles.cellLevel}>{r.bLevel}</span>
                  <span className={`${styles.cellScore} num`}>{r.bScore}%</span>
                  <span className={styles.cellEv}>{r.bEvidence} دليل</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={`box ${styles.verdict}`}>
        <h3 className={styles.verdictTitle}>لماذا يتقدّم هذا المرشح؟</h3>
        <p className={styles.verdictText}>
          {CAND_A.name} يتفوّق في {aWins} قدرات، بينما {CAND_B.name} يتفوّق في {bWins} قدرات.
          {aWins > bWins
            ? ` النتيجة: ${CAND_A.name} هو الأقرب لمتطلبات الوظيفة.`
            : bWins > aWins
            ? ` النتيجة: ${CAND_B.name} هو الأقرب لمتطلبات الوظيفة.`
            : ' النتيجة: متقاربان — راجع الفجوات والتحقق.'}
        </p>
      </div>

      <div className={styles.actions}>
        <button className="btn ghost" onClick={() => navigate(ROUTES.COMPANY_CANDIDATES)}>
          رجوع للقائمة
        </button>
        <button className="btn" onClick={() => navigate(ROUTES.COMPANY_INVITE.replace(':id', 'lina'))}>
          دعوة المرشح الأقرب
        </button>
      </div>
    </main>
  );
}

export default CandidateComparisonPage;
