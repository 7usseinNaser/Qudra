import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { Badge } from '../../../components/ui/Badge';
import styles from './M19OverviewPage.module.css';

interface PipelineStage {
  id: string;
  name: string;
  count: number;
  color: string;
}

interface PipelineCandidate {
  id: string;
  name: string;
  title: string;
  stage: string;
  matchScore: number;
  daysInStage: number;
  avatar: string;
}

const stages: PipelineStage[] = [
  { id: 'sourced', name: 'مصدر', count: 24, color: 'var(--ink-3)' },
  { id: 'screening', name: 'فرز', count: 18, color: 'var(--gap)' },
  { id: 'technical', name: 'تقني', count: 12, color: 'var(--proof)' },
  { id: 'interview', name: 'مقابلة', count: 6, color: 'var(--proof-text)' },
  { id: 'offer', name: 'عرض', count: 3, color: 'var(--proof)' },
  { id: 'hired', name: 'معين', count: 1, color: 'var(--proof)' },
];

const candidates: PipelineCandidate[] = [
  { id: 'c1', name: 'سارة المطيري', title: 'مهندسة Backend', stage: 'offer', matchScore: 94, daysInStage: 2, avatar: 'س' },
  { id: 'c2', name: 'خالد العتيبي', title: 'مطور Full-Stack', stage: 'interview', matchScore: 87, daysInStage: 5, avatar: 'خ' },
  { id: 'c3', name: 'نورة القحطاني', title: 'مهندسة DevOps', stage: 'technical', matchScore: 82, daysInStage: 3, avatar: 'ن' },
  { id: 'c4', name: 'فهد الدوسري', title: 'مهندس أمن سيبراني', stage: 'screening', matchScore: 76, daysInStage: 7, avatar: 'ف' },
  { id: 'c5', name: 'ريم الشمري', title: 'مصممة UX', stage: 'sourced', matchScore: 71, daysInStage: 1, avatar: 'ر' },
  { id: 'c6', name: 'أحمد الزهراني', title: 'مهندس بيانات', stage: 'technical', matchScore: 89, daysInStage: 4, avatar: 'أ' },
  { id: 'c7', name: 'مها الحربي', title: 'مطورة Mobile', stage: 'interview', matchScore: 84, daysInStage: 6, avatar: 'م' },
  { id: 'c8', name: 'عبدالله القحطاني', title: 'مهندس AI', stage: 'screening', matchScore: 79, daysInStage: 2, avatar: 'ع' },
];

const statusConfig: Record<string, { label: string; variant: 'proof' | 'gap' | 'neutral' }> = {
  sourced: { label: 'مصدر', variant: 'neutral' },
  screening: { label: 'فرز', variant: 'gap' },
  technical: { label: 'تقني', variant: 'proof' },
  interview: { label: 'مقابلة', variant: 'proof' },
  offer: { label: 'عرض', variant: 'proof' },
  hired: { label: 'معين', variant: 'proof' },
};

export function M19OverviewPage() {
  const navigate = useNavigate();
  const [activeStage, setActiveStage] = useState<string | null>(null);

  const filteredCandidates = activeStage
    ? candidates.filter(c => c.stage === activeStage)
    : candidates;

  const totalCandidates = candidates.length;
  const conversionRate = Math.round((candidates.filter(c => c.stage === 'hired').length / totalCandidates) * 100);

  return (
    <main id="main" className="wrap" tabIndex={-1} dir="rtl" style={{ padding: 'clamp(1.5rem,4vw,2.75rem) 0 5rem' }}>
      <div className={styles.header}>
        <div>
          <h1 className="scr-t">خط المرشحين</h1>
          <p className={styles.subtitle}>إدارة وتتبع المرشحين عبر مراحل التوظيف</p>
        </div>
        <div className={styles.headeractions}>
          <button className="btn ghost" onClick={() => navigate(ROUTES.M18_OVERVIEW)}>لوحة التحكم</button>
          <button className="btn dark" onClick={() => navigate(ROUTES.M19_CREATE)}>إضافة مرشح</button>
        </div>
      </div>

      <div className={styles.metrics}>
        <div className={`box ${styles.metriccard}`}>
          <span className={styles.metricnum}>{totalCandidates}</span>
          <span className={styles.metriclabel}>إجمالي المرشحين</span>
        </div>
        <div className={`box ${styles.metriccard}`}>
          <span className={styles.metricnum}>{candidates.filter(c => c.stage === 'offer' || c.stage === 'hired').length}</span>
          <span className={styles.metriclabel}>في مراحل متقدمة</span>
        </div>
        <div className={`box ${styles.metriccard}`}>
          <span className={styles.metricnum}>{conversionRate}%</span>
          <span className={styles.metriclabel}>معدل التحويل</span>
        </div>
        <div className={`box ${styles.metriccard}`}>
          <span className={styles.metricnum}>{Math.round(candidates.reduce((a, b) => a + b.daysInStage, 0) / totalCandidates)}</span>
          <span className={styles.metriclabel}>متوسط الأيام</span>
        </div>
      </div>

      <div className={styles.pipeline}>
        <div className={styles.stages}>
          {stages.map((stage) => (
            <button
              key={stage.id}
              className={`${styles.stage} ${activeStage === stage.id ? styles.active : ''}`}
              onClick={() => setActiveStage(activeStage === stage.id ? null : stage.id)}
              style={{ '--stage-color': stage.color } as React.CSSProperties}
            >
              <span className={styles.stagename}>{stage.name}</span>
              <span className={styles.stagecount}>{stage.count}</span>
              <span className={styles.stagebar} style={{ width: `${(stage.count / Math.max(...stages.map(s => s.count))) * 100}%` }} />
            </button>
          ))}
        </div>

        <div className={styles.candidates}>
          <div className={styles.candidatesheader}>
            <h3 className={styles.candidatestitle}>
              {activeStage ? `المرشحون في مرحلة ${stages.find(s => s.id === activeStage)?.name}` : 'جميع المرشحين'}
            </h3>
            <span className={styles.candidatescount}>{filteredCandidates.length} مرشح</span>
          </div>
          <div className={styles.candidateslist}>
            {filteredCandidates.map((candidate) => (
              <article key={candidate.id} className={styles.candidatecard}>
                <div className={styles.candidateavatar} aria-hidden="true">{candidate.avatar}</div>
                <div className={styles.candidateinfo}>
                  <h4 className={styles.candidatename}>{candidate.name}</h4>
                  <p className={styles.candidatetitle}>{candidate.title}</p>
                </div>
                <div className={styles.candidatemeta}>
                  <span className={styles.matchscore}>{candidate.matchScore}%</span>
                  <Badge variant={statusConfig[candidate.stage].variant}>{statusConfig[candidate.stage].label}</Badge>
                  <span className={styles.days}>{candidate.daysInStage} أيام</span>
                </div>
                <button className="btn ghost small" onClick={() => navigate(`${ROUTES.CANDIDATE_DETAIL}/${candidate.id}`)}>عرض</button>
              </article>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export default M19OverviewPage;