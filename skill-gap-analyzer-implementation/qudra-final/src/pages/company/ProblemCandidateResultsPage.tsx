import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { Tag } from '../../components/ui/Tag';
import { InviteModal } from '../../components/modals/InviteModal';
import styles from './ProblemCandidateResultsPage.module.css';

interface ProblemCandidate {
  id: string;
  name: string;
  normalizedTitle: string;
  matchScore: number;
  similarProjects: string[];
  matchingCapabilities: string[];
  evidenceCount: number;
  gaps: string[];
}

const CANDIDATES: ProblemCandidate[] = [
  { id: 'lina', name: 'لينا الحربي', normalizedTitle: 'Senior Backend Developer', matchScore: 90, similarProjects: ['منصة تعليمية', 'نظام إدارة'], matchingCapabilities: ['FastAPI', 'PostgreSQL', 'Docker'], evidenceCount: 11, gaps: ['UI/UX Design'] },
  { id: 'mohammed', name: 'محمد الدوسري', normalizedTitle: 'Senior Backend Developer', matchScore: 82, similarProjects: ['تطبيق جامعي'], matchingCapabilities: ['Node.js', 'REST APIs'], evidenceCount: 9, gaps: ['PostgreSQL', 'UI/UX'] },
  { id: 'majid', name: 'ماجد الشمري', normalizedTitle: 'Mid Backend Developer', matchScore: 72, similarProjects: ['متجر إلكتروني'], matchingCapabilities: ['Node.js', 'REST APIs'], evidenceCount: 7, gaps: ['PostgreSQL', 'Docker', 'UI/UX'] },
];

export function ProblemCandidateResultsPage() {
  const navigate = useNavigate();
  const [activeInvite, setActiveInvite] = useState<ProblemCandidate | null>(null);

  return (
    <main id="main" className="wrap" tabIndex={-1} dir="rtl" style={{ padding: 'clamp(1.5rem,4vw,2.75rem) 0 5rem' }}>
      <button className="btn ghost" onClick={() => navigate(ROUTES.PROBLEM_ANALYSIS)} style={{ marginBottom: '0.8rem' }}>
        ← تحليل المشكلة
      </button>
      <h1 className="scr-t">المرشحون لمشكلتك</h1>
      <p className="scr-p">مرتّبون بمطابقة القدرات مع متطلبات المشكلة.</p>

      <div className={styles.toolbar}>
        <button className="btn ghost" onClick={() => navigate(ROUTES.TEAM_BUILDER)}>
          بناء الفريق ←
        </button>
      </div>

      <div className={styles.list}>
        {CANDIDATES.map((c, idx) => (
          <div key={c.id} className={`box ${styles.card}`}>
            <div className={styles.cardHead}>
              <span className={`${styles.rank} mono`}>{String(idx + 1).padStart(2, '0')}</span>
              <span className={styles.avatar}>{c.name.charAt(0)}</span>
              <div className={styles.identity}>
                <h3 className={styles.name}>{c.name}</h3>
                <span className={styles.title}>{c.normalizedTitle}</span>
              </div>
              <span className={`${styles.score} num`}>{c.matchScore}%</span>
            </div>

            <div className={styles.cardBody}>
              <div className={styles.section}>
                <span className={styles.sectionLabel}>مشاريع مشابهة</span>
                <div className={styles.tags}>
                  {c.similarProjects.map((p) => (
                    <span key={p} className={styles.projectTag}>{p}</span>
                  ))}
                </div>
              </div>
              <div className={styles.section}>
                <span className={styles.sectionLabel}>القدرات المطابقة</span>
                <div className={styles.tags}>
                  {c.matchingCapabilities.map((s) => (
                    <Tag key={s} name={s} variant="proven" size="sm" />
                  ))}
                </div>
              </div>
              <div className={styles.section}>
                <span className={styles.sectionLabel}>الفجوات</span>
                <div className={styles.tags}>
                  {c.gaps.map((g) => (
                    <Tag key={g} name={g} variant="claimed" size="sm" />
                  ))}
                </div>
              </div>
              <div className={styles.meta}>
                <span className={styles.metaItem}>{c.evidenceCount} دليل</span>
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
          skill={activeInvite.matchingCapabilities[0] || 'Backend'}
          onClose={() => setActiveInvite(null)}
        />
      )}
    </main>
  );
}

export default ProblemCandidateResultsPage;
