import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { QudraStore } from '../../services/store';
import type { GapDetail, GapSeverity } from '../../services/types';
import { ROUTES } from '../../constants/routes';
import { Bar } from '../../components/ui/Bar';
import { Badge } from '../../components/ui/Badge';
import styles from './GapsPage.module.css';

const SEVERITY_LABEL: Record<GapSeverity, string> = {
  critical: 'حرجة',
  moderate: 'متوسطة',
  optional: 'اختيارية',
};

const SEVERITY_PILL: Record<GapSeverity, string> = {
  critical: 'far',
  moderate: 'near',
  optional: 'ready',
};

export function GapsPage() {
  const navigate = useNavigate();
  const gaps = useMemo(() => QudraStore.getGaps(), []);

  const grouped = useMemo(() => {
    const groups: Record<GapSeverity, GapDetail[]> = { critical: [], moderate: [], optional: [] };
    for (const g of gaps) groups[g.severity].push(g);
    return groups;
  }, [gaps]);

  const renderSection = (severity: GapSeverity, items: GapDetail[]) => {
    if (items.length === 0) return null;
    return (
      <section key={severity} className={styles.section}>
        <div className={styles.secrow}>
          <h2 className={styles.sectitle}>{SEVERITY_LABEL[severity]}</h2>
          <span className={`pill ${SEVERITY_PILL[severity]}`}>{items.length}</span>
        </div>
        <div className={styles.grid}>
          {items.map((gap) => (
            <button
              key={gap.id}
              className={styles.card}
              onClick={() => navigate(`/gaps/${gap.id}`)}
              aria-label={`تفاصيل فجوة ${gap.capabilityName}`}
            >
              <div className={styles.cardhead}>
                <h3 className={styles.cardname}>{gap.capabilityName}</h3>
                <Badge variant="gap">فجوة</Badge>
              </div>
              <Bar
                value={gap.currentStrength}
                max={gap.targetStrength ?? gap.requiredStrength}
                label={`الحالي ${gap.currentStrength}% — المطلوب ${gap.targetStrength ?? gap.requiredStrength}%`}
                variant="gap"
                size="sm"
              />
              <p className={styles.impact}>{gap.impact || gap.whyItMatters}</p>
              {(gap.evidenceMissing || []).length > 0 && (
                <div className={styles.missing}>
                  <span className={styles.misslabel}>أدلة ناقصة:</span>
                  {(gap.evidenceMissing || []).map((m: string) => (
                    <span key={m} className={styles.missitem}>{m}</span>
                  ))}
                </div>
              )}
              <span className={styles.action}>{gap.recommendedAction || gap.suggestedAction}</span>
            </button>
          ))}
        </div>
      </section>
    );
  };

  return (
    <main id="main" className="wrap" tabIndex={-1} dir="rtl" style={{ padding: 'clamp(1.5rem,4vw,2.75rem) 0 5rem' }}>
      <div className={styles.headrow}>
        <div>
          <span className="stepno">Growth — فجواتي</span>
          <h1 className="scr-t">فجواتك المهارية — بالأدلة لا بالتخمين</h1>
          <p className="scr-p">
            كل فجوة تعرض مستواك الحالي، المستوى المطلوب، الأدلة الناقصة، والإجراء المقترح لسدها.
          </p>
        </div>
        <button className="btn dark" onClick={() => navigate(ROUTES.GROWTH_PLAN)}>
          خطة النمو الكاملة
        </button>
      </div>

      {gaps.length === 0 ? (
        <div className="box" style={{ padding: '3rem', textAlign: 'center' }}>
          <h3>لا توجد فجوات حرجة حالياً</h3>
          <p className="note">جميع قدراتك موثقة بأدلة. استمر في البناء.</p>
        </div>
      ) : (
        <>
          {renderSection('critical', grouped.critical)}
          {renderSection('moderate', grouped.moderate)}
          {renderSection('optional', grouped.optional)}
        </>
      )}

      <div className="row" style={{ marginTop: '2rem', gap: '0.6rem', flexWrap: 'wrap' }}>
        <button className="btn ghost" onClick={() => navigate(ROUTES.MASTER_PROFILE)}>← الملف المهاري</button>
        <button className="btn ghost" onClick={() => navigate(ROUTES.RESOURCES)}>مصادر التعلم</button>
        <button className="btn ghost" onClick={() => navigate(ROUTES.CHALLENGES)}>مكتبة التحديات</button>
      </div>
    </main>
  );
}

export default GapsPage;
