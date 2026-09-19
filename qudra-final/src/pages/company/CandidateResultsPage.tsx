import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { Tag } from '../../components/ui/Tag';
import { InviteModal } from '../../components/modals/InviteModal';
import styles from './CandidateResultsPage.module.css';

interface CandidateResult {
  id: string;
  name: string;
  normalizedTitle: string;
  matchScore: number;
  strongMatches: string[];
  evidenceCount: number;
  availability: string;
  verification: string;
  challengeStatus: 'passed' | 'pending' | 'not_sent';
}

const RESULTS: CandidateResult[] = [
  { id: 'lina', name: 'لينا الحربي', normalizedTitle: 'Senior Backend Developer', matchScore: 92, strongMatches: ['FastAPI', 'PostgreSQL', 'Microservices'], evidenceCount: 11, availability: 'متفرّغ', verification: 'موثّق', challengeStatus: 'passed' },
  { id: 'mohammed', name: 'محمد الدوسري', normalizedTitle: 'Senior Backend Developer', matchScore: 85, strongMatches: ['Node.js', 'REST APIs', 'Docker'], evidenceCount: 9, availability: 'متفرّغ', verification: 'موثّق', challengeStatus: 'pending' },
  { id: 'majid', name: 'ماجد الشمري', normalizedTitle: 'Mid Backend Developer', matchScore: 78, strongMatches: ['Node.js', 'REST APIs'], evidenceCount: 7, availability: 'جزئي', verification: 'مرتبط', challengeStatus: 'not_sent' },
  { id: 'reem', name: 'ريم القحطاني', normalizedTitle: 'Frontend Developer', matchScore: 64, strongMatches: ['Flutter'], evidenceCount: 6, availability: 'متفرّغ', verification: 'مرتبط', challengeStatus: 'not_sent' },
];

const CHALLENGE_LABELS: Record<string, string> = {
  passed: 'اجتاز التحدي',
  pending: 'بانتظار التحدي',
  not_sent: 'لم يُرسل',
};

export function CandidateResultsPage() {
  const navigate = useNavigate();
  const [activeInvite, setActiveInvite] = useState<CandidateResult | null>(null);

  return (
    <main id="main" className="wrap" tabIndex={-1} dir="rtl" style={{ padding: 'clamp(1.5rem,4vw,2.75rem) 0 5rem' }}>
      <button className="btn ghost" onClick={() => navigate(ROUTES.COMPANY_HOME)} style={{ marginBottom: '0.8rem' }}>
        ← لوحة الشركة
      </button>
      <h1 className="scr-t">المرشحون المطابقون</h1>
      <p className="scr-p">مرتّبون بالدليل لا بالادّعاء. كل نتيجة مفسّرة وقابلة للفحص.</p>

      <div className={styles.toolbar}>
        <button className="btn ghost" onClick={() => navigate(ROUTES.COMPANY_CHALLENGE_NEW)}>
          إنشاء تحدٍّ للمرشحين
        </button>
        <button className="btn ghost" onClick={() => navigate(ROUTES.COMPANY_COMPARE)}>
          مقارنة المرشحين
        </button>
      </div>

      <div className={styles.list}>
        {RESULTS.map((c, idx) => (
          <div key={c.id} className={`box ${styles.card}`}>
            <div className={styles.cardHead}>
              <span className={`${styles.rank} mono`}>{String(idx + 1).padStart(2, '0')}</span>
              <span className={styles.avatar}>{c.name.charAt(0)}</span>
              <div className={styles.identity}>
                <h3 className={styles.name}>{c.name}</h3>
                <span className={styles.title}>{c.normalizedTitle}</span>
              </div>
              <div className={styles.scoreCol}>
                <span className={`${styles.scoreVal} num`}>{c.matchScore}%</span>
                <div className={styles.scoreBar}>
                  <i style={{ width: `${c.matchScore}%` }} />
                </div>
              </div>
            </div>

            <div className={styles.cardBody}>
              <div className={styles.tags}>
                {c.strongMatches.map((s) => (
                  <Tag key={s} name={s} variant="proven" size="sm" />
                ))}
              </div>
              <div className={styles.meta}>
                <span className={styles.metaItem}>
                  <span className={styles.metaLabel}>الأدلة</span>
                  <span className={`${styles.metaVal} num`}>{c.evidenceCount}</span>
                </span>
                <span className={styles.metaItem}>
                  <span className={styles.metaLabel}>التوفر</span>
                  <span className={styles.metaVal}>{c.availability}</span>
                </span>
                <span className={styles.metaItem}>
                  <span className={styles.metaLabel}>التحقق</span>
                  <span className={styles.metaVal}>{c.verification}</span>
                </span>
                <span className={styles.metaItem}>
                  <span className={styles.metaLabel}>التحدي</span>
                  <span className={styles.metaVal}>{CHALLENGE_LABELS[c.challengeStatus]}</span>
                </span>
              </div>
            </div>

            <div className={styles.cardActions}>
              <button className="btn ghost sm" onClick={() => navigate(`/company/candidates/${c.id}`)}>
                عرض الملف
              </button>
              <button className="btn ghost sm" onClick={() => navigate(ROUTES.COMPANY_COMPARE)}>
                مقارنة
              </button>
              <button className="btn sm" onClick={() => setActiveInvite(c)}>
                دعوة
              </button>
            </div>
          </div>
        ))}
      </div>

      {activeInvite && (
        <InviteModal
          isOpen={!!activeInvite}
          name={activeInvite.name}
          roleMeta={activeInvite.normalizedTitle}
          skill={activeInvite.strongMatches[0] || 'Backend'}
          onClose={() => setActiveInvite(null)}
        />
      )}
    </main>
  );
}

export default CandidateResultsPage;
