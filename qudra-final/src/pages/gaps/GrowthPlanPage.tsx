import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { QudraStore } from '../../services/store';
import type { GrowthMilestone } from '../../services/types';
import { ROUTES } from '../../constants/routes';
import { Bar } from '../../components/ui/Bar';
import styles from './GrowthPlanPage.module.css';

export function GrowthPlanPage() {
  const navigate = useNavigate();
  const plan = useMemo(() => QudraStore.getGrowthPlan(), []);
  const gaps = useMemo(() => QudraStore.getGaps(), []);

  const completedCount = plan.milestones.filter((m) => m.status === 'completed').length;
  const progressPercent = Math.round((completedCount / plan.milestones.length) * 100);

  const statusLabel: Record<GrowthMilestone['status'], string> = {
    not_started: 'لم يبدأ',
    in_progress: 'قيد التنفيذ',
    completed: 'مكتمل',
  };

  const statusPill: Record<GrowthMilestone['status'], string> = {
    not_started: 'far',
    in_progress: 'near',
    completed: 'ready',
  };

  return (
    <main id="main" className="wrap" tabIndex={-1} dir="rtl" style={{ padding: 'clamp(1.5rem,4vw,2.75rem) 0 5rem' }}>
      <div className={styles.headrow}>
        <div>
          <span className="stepno">Growth — خطة النمو</span>
          <h1 className="scr-t">{plan.goal}</h1>
          <p className="scr-p">{plan.currentState}</p>
        </div>
        <button className="btn ghost" onClick={() => navigate(ROUTES.GAPS)}>
          ← فجواتي
        </button>
      </div>

      <div className={`box ${styles.progresspanel}`}>
        <div className={styles.progrow}>
          <h3 className={styles.progtitle}>تقدم خطة النمو</h3>
          <span className={`pill ${statusPill[progressPercent === 100 ? 'completed' : 'in_progress']}`}>
            {completedCount} / {plan.milestones.length} مكتمل
          </span>
        </div>
        <Bar
          value={progressPercent}
          max={100}
          label={`${progressPercent}% مكتمل`}
          variant="proof"
        />
      </div>

      <div className={styles.flow}>
        <div className={`box ${styles.flowstep}`}>
          <span className={styles.stepnum}>01</span>
          <h3 className={styles.steptitle}>الهدف</h3>
          <p className={styles.steptext}>{plan.goal}</p>
        </div>

        <div className={`box ${styles.flowstep}`}>
          <span className={styles.stepnum}>02</span>
          <h3 className={styles.steptitle}>الحالة الحالية</h3>
          <p className={styles.steptext}>{plan.currentState}</p>
        </div>

        <div className={`box ${styles.flowstep}`}>
          <span className={styles.stepnum}>03</span>
          <h3 className={styles.steptitle}>الفجوات</h3>
          <div className={styles.gapchips}>
            {plan.gapIds.map((gid) => {
              const g = gaps.find((gap) => gap.id === gid);
              return g ? (
                <button
                  key={gid}
                  className={styles.gapchip}
                  onClick={() => navigate(`/gaps/${gid}`)}
                >
                  {g.capabilityName}
                </button>
              ) : null;
            })}
          </div>
        </div>
      </div>

      <h2 className={styles.miletitle}>المحطات</h2>
      <div className={styles.milestones}>
        {plan.milestones.map((ms, idx) => (
          <div key={ms.id} className={`box ${styles.milestone}`}>
            <div className={styles.milehead}>
              <span className={styles.milenum}>{String(idx + 1).padStart(2, '0')}</span>
              <div className={styles.mileinfo}>
                <h3 className={styles.milename}>{ms.title}</h3>
                <p className={styles.miledesc}>{ms.description}</p>
              </div>
              <span className={`pill ${statusPill[ms.status]}`}>{statusLabel[ms.status]}</span>
            </div>

            <div className={styles.milebody}>
              <div className={styles.mileres}>
                <span className={styles.milelabel}>الموارد:</span>
                {ms.resources.map((r) => (
                  <span key={r.title} className={styles.reschip}>
                    {r.title} · {r.provider}
                  </span>
                ))}
              </div>
              <div className={styles.milemeta}>
                <div>
                  <span className={styles.milelabel}>التطبيق:</span>
                  <span>{ms.practiceType}</span>
                </div>
                <div>
                  <span className={styles.milelabel}>الدليل المستهدف:</span>
                  <span>{ms.evidenceGoal}</span>
                </div>
              </div>
            </div>

            <div className={styles.mileactions}>
              {ms.status === 'not_started' && (
                <button className="btn dark" onClick={() => navigate(ROUTES.SIMULATION)}>
                  ابدأ المحطة
                </button>
              )}
              {ms.status === 'in_progress' && (
                <button className="btn dark" onClick={() => navigate(ROUTES.SIMULATION)}>
                  تابع التطبيق
                </button>
              )}
              {ms.status === 'completed' && (
                <span className="note">مكتمل — دليل مسجل في بصمتك</span>
              )}
              <button className="btn ghost" onClick={() => navigate(ROUTES.GAPS)}>
                عرض الفجوة
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default GrowthPlanPage;
