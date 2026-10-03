import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { Tag } from '../../components/ui/Tag';
import { Badge } from '../../components/ui/Badge';
import { Bar } from '../../components/ui/Bar';
import { InviteModal } from '../../components/modals/InviteModal';
import styles from './CandidateDetailCompanyPage.module.css';

interface CapabilityRow {
  skill: string;
  level: string;
  matchScore: number;
  evidenceCount: number;
  isGap: boolean;
}

interface EvidenceRow {
  source: string;
  type: string;
  skill: string;
  date: string;
  status: string;
}

const CANDIDATE_DATA: Record<string, {
  name: string;
  normalizedTitle: string;
  matchScore: number;
  availability: string;
  verification: string;
  capabilities: CapabilityRow[];
  evidences: EvidenceRow[];
  gaps: string[];
}> = {
  lina: {
    name: 'لينا الحربي',
    normalizedTitle: 'Senior Backend Developer',
    matchScore: 92,
    availability: 'متفرّغ',
    verification: 'موثّق',
    capabilities: [
      { skill: 'FastAPI & Microservices', level: 'ADVANCED', matchScore: 95, evidenceCount: 5, isGap: false },
      { skill: 'PostgreSQL & Database Design', level: 'ADVANCED', matchScore: 92, evidenceCount: 9, isGap: false },
      { skill: 'Docker & Containerization', level: 'INTERMEDIATE', matchScore: 85, evidenceCount: 3, isGap: false },
      { skill: 'CI/CD Pipelines', level: 'INTERMEDIATE', matchScore: 70, evidenceCount: 2, isGap: true },
    ],
    evidences: [
      { source: 'github.com/lina/inventory-api', type: 'مستودع', skill: 'PostgreSQL', date: '2026-05', status: 'موثّق' },
      { source: 'github.com/lina/data-pipeline', type: 'مستودع', skill: 'FastAPI', date: '2026-02', status: 'موثّق' },
      { source: 'qudra · تحدٍّ عملي', type: 'تحدٍّ', skill: 'Docker', date: '2026-08', status: 'موثّق' },
    ],
    gaps: ['CI/CD Pipelines'],
  },
  mohammed: {
    name: 'محمد الدوسري',
    normalizedTitle: 'Senior Backend Developer',
    matchScore: 85,
    availability: 'متفرّغ',
    verification: 'موثّق',
    capabilities: [
      { skill: 'Node.js', level: 'ADVANCED', matchScore: 90, evidenceCount: 6, isGap: false },
      { skill: 'REST APIs', level: 'ADVANCED', matchScore: 88, evidenceCount: 7, isGap: false },
      { skill: 'Docker', level: 'INTERMEDIATE', matchScore: 75, evidenceCount: 3, isGap: false },
      { skill: 'System Design', level: 'INTERMEDIATE', matchScore: 60, evidenceCount: 1, isGap: true },
    ],
    evidences: [
      { source: 'github.com/mohammed/queue-service', type: 'مستودع', skill: 'Node.js', date: '2026-05', status: 'موثّق' },
      { source: 'github.com/mohammed/rest-api', type: 'مستودع', skill: 'REST APIs', date: '2026-02', status: 'موثّق' },
    ],
    gaps: ['System Design'],
  },
};

export function CandidateDetailCompanyPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  const data = CANDIDATE_DATA[id || 'lina'] || CANDIDATE_DATA.lina;

  return (
    <main id="main" className="wrap" tabIndex={-1} dir="rtl" style={{ padding: 'clamp(1.5rem,4vw,2.75rem) 0 5rem' }}>
      <button className="btn ghost" onClick={() => navigate(ROUTES.COMPANY_CANDIDATES)} style={{ marginBottom: '0.8rem' }}>
        ← المرشحون
      </button>

      <div className={styles.header}>
        <div className={styles.identity}>
          <span className={styles.avatar}>{data.name.charAt(0)}</span>
          <div>
            <h1 className="scr-t">{data.name}</h1>
            <p className="scr-p">{data.normalizedTitle}</p>
          </div>
        </div>
        <div className={styles.headerActions}>
          <Badge variant="proof">نسبة المطابقة {data.matchScore}%</Badge>
          <button className="btn ghost" onClick={() => navigate(ROUTES.COMPANY_COMPARE)}>مقارنة</button>
          <button className="btn" onClick={() => setIsInviteOpen(true)}>دعوة للمشروع</button>
        </div>
      </div>

      <div className={styles.metaRow}>
        <span className={styles.metaChip}>التوفر: {data.availability}</span>
        <span className={styles.metaChip}>التحقق: {data.verification}</span>
      </div>

      <div className={`box ${styles.section}`}>
        <h2 className={styles.sectionTitle}>القدرات والمطابقة</h2>
        <div className={styles.capList}>
          {data.capabilities.map((cap) => (
            <div key={cap.skill} className={styles.capRow}>
              <div className={styles.capInfo}>
                <span className={styles.capSkill}>{cap.skill}</span>
                <Badge variant={cap.isGap ? 'gap' : 'proof'}>{cap.level}</Badge>
                {cap.isGap && <span className={styles.gapLabel}>فجوة</span>}
              </div>
              <div className={styles.capMatch}>
                <span className={`${styles.capScore} num`}>{cap.matchScore}%</span>
                <Bar value={cap.matchScore} max={100} size="sm" variant={cap.isGap ? 'gap' : 'proof'} className={styles.capBar} />
              </div>
              <div className={styles.capEvidence}>
                <span className={styles.evCount}>{cap.evidenceCount} دليل</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`box ${styles.section}`}>
        <h2 className={styles.sectionTitle}>الأدلة</h2>
        <div className={styles.evList}>
          {data.evidences.map((ev, i) => (
            <div key={i} className={styles.evRow}>
              <span className={styles.evSource}>{ev.source}</span>
              <span className={styles.evType}>{ev.type}</span>
              <Tag name={ev.skill} variant="proven" size="sm" />
              <span className={`${styles.evDate} mono`}>{ev.date}</span>
              <Badge variant="proof">{ev.status}</Badge>
            </div>
          ))}
        </div>
      </div>

      {data.gaps.length > 0 && (
        <div className={`box ${styles.section}`}>
          <h2 className={styles.sectionTitle}>الفجوات</h2>
          <div className={styles.gapList}>
            {data.gaps.map((g) => (
              <div key={g} className={styles.gapItem}>
                <Tag name={g} variant="claimed" size="sm" />
                <span className={styles.gapNote}>يحتاج أدلة إضافية لإغلاق هذه الفجوة</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={styles.actions}>
        <button className="btn ghost" onClick={() => navigate(ROUTES.COMPANY_CHALLENGE_NEW)}>
          إرسال تحدٍّ
        </button>
        <button className="btn ghost" onClick={() => navigate(ROUTES.COMPANY_INVITE.replace(':id', id || 'lina'))}>
          معاينة الدعوة
        </button>
      </div>

      {isInviteOpen && (
        <InviteModal
          isOpen={isInviteOpen}
          name={data.name}
          roleMeta={data.normalizedTitle}
          skill={data.capabilities[0]?.skill || 'Backend'}
          onClose={() => setIsInviteOpen(false)}
        />
      )}
    </main>
  );
}

export default CandidateDetailCompanyPage;
