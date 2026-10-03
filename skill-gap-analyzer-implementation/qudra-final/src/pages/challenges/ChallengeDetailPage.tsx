import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QudraStore } from '../../services/store';
import { ROUTES } from '../../constants/routes';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import styles from './ChallengeDetailPage.module.css';

export function ChallengeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const challenge = useMemo(
    () => QudraStore.getChallenges().find((c) => c.id === id),
    [id],
  );

  if (!challenge) {
    return (
      <main id="main" className="wrap" tabIndex={-1} dir="rtl" style={{ padding: 'clamp(1.5rem,4vw,2.75rem) 0 5rem' }}>
        <EmptyState
          title="لم نعثر على هذا التحدي"
          description="ربما تم حذفه أو أن الرابط غير صحيح."
          action={<button className="btn dark" onClick={() => navigate(ROUTES.CHALLENGES)}>العودة للتحديات</button>}
        />
      </main>
    );
  }

  const difficultyLabel = challenge.difficulty === 'beginner' ? 'مبتدئ' : challenge.difficulty === 'intermediate' ? 'متوسط' : 'متقدم';

  return (
    <main id="main" className="wrap" tabIndex={-1} dir="rtl" style={{ padding: 'clamp(1.5rem,4vw,2.75rem) 0 5rem' }}>
      <div className={styles.headrow}>
        <div>
          <button className="btn ghost" onClick={() => navigate(ROUTES.CHALLENGES)} style={{ marginBottom: '0.8rem' }}>
            ← مكتبة التحديات
          </button>
          <h1 className="scr-t">{challenge.title}</h1>
          <p className="scr-p">{challenge.description}</p>
        </div>
        <Badge variant="gap">{difficultyLabel}</Badge>
      </div>

      <div className={styles.grid}>
        <div className={styles.main}>
          <div className={`box ${styles.panel}`}>
            <h3 className={styles.paneltitle}>المتطلبات</h3>
            <ul className={styles.list}>
              {challenge.requirements.map((req) => (
                <li key={req} className={styles.listitem}>
                  <span className={styles.bullet} aria-hidden="true">•</span>
                  {req}
                </li>
              ))}
            </ul>
          </div>

          <div className={`box ${styles.panel}`}>
            <h3 className={styles.paneltitle}>معايير التقييم</h3>
            <ul className={styles.list}>
              {challenge.evaluationCriteria.map((crit) => (
                <li key={crit} className={styles.listitem}>
                  <span className={styles.bullet} aria-hidden="true">•</span>
                  {crit}
                </li>
              ))}
            </ul>
          </div>

          <div className={`box ${styles.panel}`}>
            <h3 className={styles.paneltitle}>الدليل الناتج</h3>
            <p className={styles.text}>{challenge.evidenceOutcome}</p>
          </div>
        </div>

        <aside className={styles.side}>
          <div className={`box ${styles.ctapanel}`}>
            <h3 className={styles.paneltitle}>تفاصيل التحدي</h3>
            <div className={styles.inforow}>
              <div className={styles.infoitem}>
                <span className={styles.infolabel}>المهارة</span>
                <span className={styles.infoval}>{challenge.skill}</span>
              </div>
              <div className={styles.infoitem}>
                <span className={styles.infolabel}>المستوى</span>
                <span className={styles.infoval}>{difficultyLabel}</span>
              </div>
              <div className={styles.infoitem}>
                <span className={styles.infolabel}>الوقت المتوقع</span>
                <span className={styles.infoval}>{challenge.expectedTime}</span>
              </div>
              <div className={styles.infoitem}>
                <span className={styles.infolabel}>النوع</span>
                <span className={styles.infoval}>
                  {challenge.type === 'coding' ? 'برمجة' : challenge.type === 'design' ? 'تصميم' : challenge.type === 'system_design' ? 'تصميم نظام' : 'تصحيح أخطاء'}
                </span>
              </div>
              <div className={styles.infoitem}>
                <span className={styles.infolabel}>المصدر</span>
                <span className={styles.infoval}>{challenge.source}</span>
              </div>
            </div>
            <button className="btn dark" style={{ width: '100%', marginTop: '1rem' }} onClick={() => navigate(`/challenges/${challenge.id}/workspace`)}>
              ابدأ التحدي
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
}

export default ChallengeDetailPage;
