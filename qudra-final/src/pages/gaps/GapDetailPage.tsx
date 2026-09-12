import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QudraStore } from '../../services/store';
import { ROUTES } from '../../constants/routes';
import { Bar } from '../../components/ui/Bar';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import styles from './GapDetailPage.module.css';

export function GapDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const gap = useMemo(
    () => QudraStore.getGaps().find((g) => g.id === id),
    [id],
  );

  if (!gap) {
    return (
      <main id="main" className="wrap" tabIndex={-1} dir="rtl" style={{ padding: 'clamp(1.5rem,4vw,2.75rem) 0 5rem' }}>
        <EmptyState
          title="لم نعثر على هذه الفجوة"
          description="ربما تم سدها أو أن الرابط غير صحيح."
          action={<button className="btn dark" onClick={() => navigate(ROUTES.GAPS)}>العودة لفجواتي</button>}
        />
      </main>
    );
  }

  return (
    <main id="main" className="wrap" tabIndex={-1} dir="rtl" style={{ padding: 'clamp(1.5rem,4vw,2.75rem) 0 5rem' }}>
      <div className={styles.headrow}>
        <div>
          <button className="btn ghost" onClick={() => navigate(ROUTES.GAPS)} style={{ marginBottom: '0.8rem' }}>
            ← فجواتي
          </button>
          <h1 className="scr-t">{gap.capabilityName}</h1>
          <p className="scr-p">{gap.impact}</p>
        </div>
        <Badge variant="gap">فجوة {gap.severity === 'critical' ? 'حرجة' : gap.severity === 'moderate' ? 'متوسطة' : 'اختيارية'}</Badge>
      </div>

      <div className={styles.grid}>
        <div className={styles.main}>
          <div className={`box ${styles.panel}`}>
            <h3 className={styles.paneltitle}>المستوى الحالي مقابل المطلوب</h3>
            <Bar
              value={gap.currentStrength}
              max={gap.targetStrength}
              label={`الحالي ${gap.currentStrength}% — المطلوب ${gap.targetStrength}%`}
              variant="gap"
            />
            <p className={styles.path}>المسار المقدّر: {gap.estimatedPath}</p>
          </div>

          <div className={`box ${styles.panel}`}>
            <h3 className={styles.paneltitle}>الأدلة الحالية</h3>
            {gap.currentEvidence.length > 0 ? (
              <ul className={styles.list}>
                {gap.currentEvidence.map((e) => (
                  <li key={e} className={styles.listitem}>
                    <span className={styles.check} aria-hidden="true">✓</span>
                    {e}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="note">لا يوجد دليل حالي.</p>
            )}
          </div>

          <div className={`box ${styles.panel}`}>
            <h3 className={styles.paneltitle}>الأدلة الناقصة</h3>
            <ul className={styles.list}>
              {gap.evidenceMissing.map((e) => (
                <li key={e} className={styles.listitem}>
                  <span className={styles.cross} aria-hidden="true">✗</span>
                  {e}
                </li>
              ))}
            </ul>
          </div>

          <div className={`box ${styles.panel}`}>
            <h3 className={styles.paneltitle}>الموارد المقترحة</h3>
            <div className={styles.resources}>
              {gap.resources.map((r) => (
                <div key={r.title} className={styles.rescard}>
                  <h4 className={styles.resname}>{r.title}</h4>
                  <span className={styles.resmeta}>{r.provider} · {r.type} · {r.duration}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={`box ${styles.panel}`}>
            <h3 className={styles.paneltitle}>تحدي مقترح</h3>
            <div className={styles.challenge}>
              <div>
                <h4 className={styles.challengename}>{gap.challenge.title}</h4>
                <span className={styles.challengemeta}>
                  {gap.challenge.difficulty} · {gap.challenge.expectedTime}
                </span>
              </div>
              <button className="btn" onClick={() => navigate(ROUTES.SIMULATION)}>
                ابدأ التحدي
              </button>
            </div>
          </div>

          <div className={`box ${styles.panel}`}>
            <h3 className={styles.paneltitle}>مشروع مقترح</h3>
            <h4 className={styles.projname}>{gap.project.title}</h4>
            <p className={styles.projdesc}>{gap.project.description}</p>
          </div>
        </div>

        <aside className={styles.side}>
          <div className={`box ${styles.ctapanel}`}>
            <h3 className={styles.paneltitle}>الإجراء المقترح</h3>
            <p className={styles.ctatext}>{gap.recommendedAction}</p>
            <button className="btn dark" onClick={() => navigate(ROUTES.GROWTH_PLAN)}>
              انتقل لخطة النمو
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
}

export default GapDetailPage;
