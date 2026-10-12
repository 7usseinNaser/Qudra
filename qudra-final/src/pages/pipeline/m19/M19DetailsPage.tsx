import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { Badge } from '../../../components/ui/Badge';
import styles from './M19DetailsPage.module.css';

interface PipelineCandidateDetail {
  id: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  stage: string;
  matchScore: number;
  avatar: string;
  skills: { name: string; verified: boolean }[];
  timeline: { date: string; event: string; stage: string }[];
  notes: string;
}

const candidate: PipelineCandidateDetail = {
  id: 'c1',
  name: 'سارة المطيري',
  title: 'مهندسة Backend',
  email: 'sara.mutairi@example.com',
  phone: '+966 50 123 4567',
  stage: 'offer',
  matchScore: 94,
  avatar: 'س',
  skills: [
    { name: 'FastAPI', verified: true },
    { name: 'PostgreSQL', verified: true },
    { name: 'Docker', verified: true },
    { name: 'Microservices', verified: true },
    { name: 'Kubernetes', verified: false },
  ],
  timeline: [
    { date: '2026-09-10', event: 'تم إضافة المرشح', stage: 'sourced' },
    { date: '2026-09-12', event: 'اجتاز الفرز الأولي', stage: 'screening' },
    { date: '2026-09-15', event: 'اجتاز التقييم التقني', stage: 'technical' },
    { date: '2026-09-18', event: 'أكملت المقابلة التقنية', stage: 'interview' },
    { date: '2026-09-20', event: 'تم تقديم العرض', stage: 'offer' },
  ],
  notes: 'مرشحة قوية جداً مع إثباتات كود موثقة. جاهزة للانضمام فوراً.',
};

const statusConfig: Record<string, { label: string; variant: 'proof' | 'gap' | 'neutral' }> = {
  sourced: { label: 'مصدر', variant: 'neutral' },
  screening: { label: 'فرز', variant: 'gap' },
  technical: { label: 'تقني', variant: 'proof' },
  interview: { label: 'مقابلة', variant: 'proof' },
  offer: { label: 'عرض', variant: 'proof' },
  hired: { label: 'معين', variant: 'proof' },
};

const stages = [
  { id: 'sourced', name: 'مصدر' },
  { id: 'screening', name: 'فرز' },
  { id: 'technical', name: 'تقني' },
  { id: 'interview', name: 'مقابلة' },
  { id: 'offer', name: 'عرض' },
  { id: 'hired', name: 'معين' },
];

export function M19DetailsPage() {
  const navigate = useNavigate();

  return (
    <main id="main" className="wrap" tabIndex={-1} dir="rtl" style={{ padding: 'clamp(1.5rem,4vw,2.75rem) 0 5rem' }}>
      <div className={styles.header}>
        <button className="btn ghost" onClick={() => navigate(ROUTES.M19_OVERVIEW)}>← العودة</button>
        <h1 className="scr-t">تفاصيل المرشح</h1>
      </div>

      <div className={styles.grid}>
        <div className={styles.maincol}>
          <div className={`box ${styles.profile}`}>
            <div className={styles.profileheader}>
              <div className={styles.avatar} aria-hidden="true">{candidate.avatar}</div>
              <div>
                <h2 className={styles.name}>{candidate.name}</h2>
                <p className={styles.title}>{candidate.title}</p>
              </div>
              <div className={styles.matchscore}>{candidate.matchScore}%</div>
            </div>

            <div className={styles.stageprogress}>
              {stages.map((stage, idx) => (
                <div key={stage.id} className={`${styles.stageitem} ${candidate.stage === stage.id ? styles.current : ''} ${stages.findIndex(s => s.id === candidate.stage) > idx ? styles.completed : ''}`}>
                  <div className={styles.stagedot} />
                  <span className={styles.stagename}>{stage.name}</span>
                </div>
              ))}
            </div>

            <div className={styles.contact}>
              <div className={styles.contactitem}>
                <span className={styles.contactlabel}>البريد</span>
                <a href={`mailto:${candidate.email}`}>{candidate.email}</a>
              </div>
              <div className={styles.contactitem}>
                <span className={styles.contactlabel}>الهاتف</span>
                <a href={`tel:${candidate.phone}`}>{candidate.phone}</a>
              </div>
            </div>
          </div>

          <div className={`box ${styles.panel}`}>
            <h3 className={styles.paneltitle}>المهارات</h3>
            <div className={styles.skills}>
              {candidate.skills.map((skill, idx) => (
                <Badge key={idx} variant={skill.verified ? 'proof' : 'gap'}>{skill.name}</Badge>
              ))}
            </div>
          </div>

          <div className={`box ${styles.panel}`}>
            <h3 className={styles.paneltitle}>الملاحظات</h3>
            <p className={styles.notes}>{candidate.notes}</p>
          </div>
        </div>

        <div className={styles.sidecol}>
          <div className={`box ${styles.panel}`}>
            <h3 className={styles.paneltitle}>المرحلة الحالية</h3>
            <Badge variant={statusConfig[candidate.stage].variant}>{statusConfig[candidate.stage].label}</Badge>
            <div className={styles.actions}>
              <button className="btn ghost block">تغيير المرحلة</button>
              <button className="btn dark block">إرسال عرض</button>
              <button className="btn ghost block" onClick={() => navigate(`${ROUTES.CANDIDATE_DETAIL}/${candidate.id}`)}>عرض الملف الكامل</button>
            </div>
          </div>

          <div className={`box ${styles.panel}`}>
            <h3 className={styles.paneltitle}>الجدول الزمني</h3>
            <div className={styles.timeline}>
              {candidate.timeline.slice().reverse().map((item, idx) => (
                <div key={idx} className={styles.timelineitem}>
                  <div className={styles.timelinedot} />
                  <div className={styles.timelinecontent}>
                    <span className={styles.timelinedate}>{item.date}</span>
                    <span className={styles.timelineevent}>{item.event}</span>
                    <Badge variant="neutral">{statusConfig[item.stage].label}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default M19DetailsPage;