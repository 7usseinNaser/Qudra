import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { Badge } from '../../../components/ui/Badge';
import styles from './M18ResultsPage.module.css';

interface MatchResult {
  id: string;
  name: string;
  title: string;
  matchScore: number;
  status: 'READY' | 'NEAR' | 'FAR';
  verifiedSkills: string[];
  gapSkills: string[];
  avatar: string;
}

const results: MatchResult[] = [
  {
    id: 'c1',
    name: 'سارة المطيري',
    title: 'مهندسة Backend',
    matchScore: 94,
    status: 'READY',
    verifiedSkills: ['FastAPI', 'PostgreSQL', 'Docker', 'Microservices'],
    gapSkills: [],
    avatar: 'س',
  },
  {
    id: 'c2',
    name: 'خالد العتيبي',
    title: 'مطور Full-Stack',
    matchScore: 87,
    status: 'NEAR',
    verifiedSkills: ['React', 'TypeScript', 'Node.js'],
    gapSkills: ['PostgreSQL المتقدم'],
    avatar: 'خ',
  },
  {
    id: 'c3',
    name: 'نورة القحطاني',
    title: 'مهندسة DevOps',
    matchScore: 82,
    status: 'NEAR',
    verifiedSkills: ['Docker', 'Kubernetes', 'CI/CD', 'AWS'],
    gapSkills: ['FastAPI'],
    avatar: 'ن',
  },
  {
    id: 'c4',
    name: 'فهد الدوسري',
    title: 'مهندس أمن سيبراني',
    matchScore: 76,
    status: 'FAR',
    verifiedSkills: ['Security Auditing', 'Penetration Testing'],
    gapSkills: ['FastAPI', 'PostgreSQL', 'React'],
    avatar: 'ف',
  },
  {
    id: 'c5',
    name: 'ريم الشمري',
    title: 'مصممة UX',
    matchScore: 71,
    status: 'FAR',
    verifiedSkills: ['User Research', 'Figma', 'Design Systems'],
    gapSkills: ['FastAPI', 'PostgreSQL', 'Docker', 'React'],
    avatar: 'ر',
  },
];

const statusConfig: Record<MatchResult['status'], { label: string; variant: 'proof' | 'gap' | 'neutral' }> = {
  READY: { label: 'جاهز', variant: 'proof' },
  NEAR: { label: 'قريب', variant: 'gap' },
  FAR: { label: 'بعيد', variant: 'neutral' },
};

export function M18ResultsPage() {
  const navigate = useNavigate();

  return (
    <main id="main" className="wrap" tabIndex={-1} dir="rtl" style={{ padding: 'clamp(1.5rem,4vw,2.75rem) 0 5rem' }}>
      <div className={styles.header}>
        <button className="btn ghost" onClick={() => navigate(ROUTES.M18_OVERVIEW)}>← العودة</button>
        <h1 className="scr-t">نتائج المطابقة</h1>
        <p className={styles.subtitle}>تم العثور على {results.length} مرشح مطابق لمشكلتك</p>
      </div>

      <div className={styles.summary}>
        <div className={styles.summarycard}>
          <span className={styles.summarynum}>{results.filter(r => r.status === 'READY').length}</span>
          <span className={styles.summarylabel}>جاهزون فوراً</span>
        </div>
        <div className={styles.summarycard}>
          <span className={styles.summarynum}>{results.filter(r => r.status === 'NEAR').length}</span>
          <span className={styles.summarylabel}>قريبون من الجاهزية</span>
        </div>
        <div className={styles.summarycard}>
          <span className={styles.summarynum}>{results.filter(r => r.status === 'FAR').length}</span>
          <span className={styles.summarylabel}>يحتاجون تطويراً</span>
        </div>
        <div className={styles.summarycard}>
          <span className={styles.summarynum}>{Math.round(results.reduce((a, b) => a + b.matchScore, 0) / results.length)}%</span>
          <span className={styles.summarylabel}>متوسط المطابقة</span>
        </div>
      </div>

      <div className={styles.resultslist}>
        {results.map((candidate) => (
          <article key={candidate.id} className={styles.resultcard}>
            <div className={styles.candidateheader}>
              <div className={styles.candidateavatar} aria-hidden="true">{candidate.avatar}</div>
              <div className={styles.candidateinfo}>
                <h3 className={styles.candidatename}>{candidate.name}</h3>
                <p className={styles.candidatetitle}>{candidate.title}</p>
              </div>
              <div className={styles.candidatescore}>
                <span className={styles.scorenum}>{candidate.matchScore}%</span>
                <Badge variant={statusConfig[candidate.status].variant}>{statusConfig[candidate.status].label}</Badge>
              </div>
            </div>

            <div className={styles.skills}>
              <div className={styles.skillgroup}>
                <span className={styles.skillgrouplabel}>مُثبتة</span>
                <div className={styles.skilltags}>
                  {candidate.verifiedSkills.map((skill, idx) => (
                    <Badge key={idx} variant="proof">{skill}</Badge>
                  ))}
                </div>
              </div>
              {candidate.gapSkills.length > 0 && (
                <div className={styles.skillgroup}>
                  <span className={styles.skillgrouplabel}>فجوات</span>
                  <div className={styles.skilltags}>
                    {candidate.gapSkills.map((skill, idx) => (
                      <Badge key={idx} variant="gap">{skill}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className={styles.candidateactions}>
              <button className="btn ghost" onClick={() => navigate(`${ROUTES.CANDIDATE_DETAIL}/${candidate.id}`)}>عرض التفاصيل</button>
              <button className="btn ghost">دعوة لتحدي</button>
              <button className="btn ghost">حفظ</button>
            </div>
          </article>
        ))}
      </div>

      <div className={styles.footeractions}>
        <button className="btn dark" onClick={() => navigate(ROUTES.M18_CREATE)}>إنشاء مشكلة جديدة</button>
        <button className="btn ghost" onClick={() => navigate(ROUTES.M18_OVERVIEW)}>العودة للوحة التحكم</button>
      </div>
    </main>
  );
}

export default M18ResultsPage;