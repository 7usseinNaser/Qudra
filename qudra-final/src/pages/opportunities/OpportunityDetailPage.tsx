import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QudraStore } from '../../services/store';
import { ROUTES } from '../../constants/routes';
import { Badge } from '../../components/ui/Badge';
import { Bar } from '../../components/ui/Bar';
import { EmptyState } from '../../components/ui/EmptyState';
import styles from './OpportunityDetailPage.module.css';

export function OpportunityDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const opp = useMemo(
    () => QudraStore.getOpportunities().find((o) => o.id === id),
    [id],
  );

  if (!opp) {
    return (
      <main id="main" className="wrap" tabIndex={-1} dir="rtl" style={{ padding: 'clamp(1.5rem,4vw,2.75rem) 0 5rem' }}>
        <EmptyState
          title="لم نعثر على هذه الفرصة"
          description="ربما تم حذفها أو أن الرابط غير صحيح."
          action={<button className="btn dark" onClick={() => navigate(ROUTES.OPPORTUNITIES)}>العودة للفرص</button>}
        />
      </main>
    );
  }

  return (
    <main id="main" className="wrap" tabIndex={-1} dir="rtl" style={{ padding: 'clamp(1.5rem,4vw,2.75rem) 0 5rem' }}>
      <div className={styles.headrow}>
        <div>
          <button className="btn ghost" onClick={() => navigate(ROUTES.OPPORTUNITIES)} style={{ marginBottom: '0.8rem' }}>
            ← الفرص
          </button>
          <h1 className="scr-t">{opp.title}</h1>
          <p className="scr-p">
            {opp.organization}
            {opp.isVerifiedOrg && <span className={styles.verified} aria-label="جهة موثقة"> ✓ موثّق</span>}
          </p>
        </div>
        <div className={styles.matchbox}>
          <span className={styles.matchnum} style={{ color: opp.matchScore >= 80 ? 'var(--accent)' : 'var(--gap)' }}>
            {opp.matchScore}%
          </span>
          <span className={styles.matchlabel}>مطابقة</span>
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.main}>
          <div className={`box ${styles.panel}`}>
            <h3 className={styles.paneltitle}>الوصف</h3>
            <p className={styles.text}>{opp.description}</p>
          </div>

          <div className={`box ${styles.panel}`}>
            <h3 className={styles.paneltitle}>المتطلبات</h3>
            <ul className={styles.list}>
              {(opp.requirements || []).map((req) => (
                <li key={req} className={styles.listitem}>
                  <span className={styles.bullet} aria-hidden="true">•</span>
                  {req}
                </li>
              ))}
            </ul>
          </div>

          {(opp.structuredRequirements || []).length > 0 && (
            <div className={`box ${styles.panel}`}>
              <h3 className={styles.paneltitle}>المتطلبات المهارية المنظمة</h3>
              <div className={styles.structreq}>
                {(opp.structuredRequirements || []).map((sr) => (
                  <div key={sr.skill} className={styles.structrow}>
                    <span className={styles.structskill}>{sr.skill}</span>
                    <Badge variant={sr.importance === 'critical' ? 'gap' : 'proof'}>
                      {sr.importance === 'critical' ? 'حرج' : 'مفضل'}
                    </Badge>
                    <span className={styles.structlevel}>{sr.level}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className={`box ${styles.panel}`}>
            <h3 className={styles.paneltitle}>لماذا أنت مطابق؟</h3>
            <ul className={styles.list}>
              {(opp.whyMatch || []).map((reason) => (
                <li key={reason} className={styles.listitem}>
                  <span className={styles.check} aria-hidden="true">✓</span>
                  {reason}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.evidencegaps}>
            <div className={`box ${styles.panel} ${styles.evidencepanel}`}>
              <h3 className={styles.paneltitle}>أدلتك المطابقة</h3>
              {(opp.matchedEvidence || []).length > 0 ? (
                <ul className={styles.list}>
                  {(opp.matchedEvidence || []).map((ev) => (
                    <li key={ev} className={styles.listitem}>
                      <span className={styles.check} aria-hidden="true">✓</span>
                      {ev}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={styles.text}>لا توجد أدلة مطابقة مباشرة بعد.</p>
              )}
            </div>

            <div className={`box ${styles.panel} ${styles.gappanel}`}>
              <h3 className={styles.paneltitle}>فجواتك المرتبطة</h3>
              {(opp.gaps || []).length > 0 ? (
                <ul className={styles.list}>
                  {(opp.gaps || []).map((g) => (
                    <li key={g} className={styles.listitem}>
                      <span className={styles.cross} aria-hidden="true">✗</span>
                      {g}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={styles.text}>لا توجد فجوات — ملفك يغطي جميع المتطلبات.</p>
              )}
            </div>
          </div>
        </div>

        <aside className={styles.side}>
          <div className={`box ${styles.ctapanel}`}>
            <h3 className={styles.paneltitle}>تفاصيل الفرصة</h3>
            <div className={styles.inforow}>
              <div className={styles.infoitem}>
                <span className={styles.infolabel}>المجال</span>
                <span className={styles.infoval}>{opp.field}</span>
              </div>
              <div className={styles.infoitem}>
                <span className={styles.infolabel}>الموقع</span>
                <span className={styles.infoval}>
                  {opp.location === 'remote' ? 'عن بعد' : opp.location === 'hybrid' ? 'هجين' : 'حضوري'}
                </span>
              </div>
              <div className={styles.infoitem}>
                <span className={styles.infolabel}>المدينة</span>
                <span className={styles.infoval}>{opp.city}</span>
              </div>
              <div className={styles.infoitem}>
                <span className={styles.infolabel}>الخبرة</span>
                <span className={styles.infoval}>{opp.experience}</span>
              </div>
              <div className={styles.infoitem}>
                <span className={styles.infolabel}>التعويض</span>
                <span className={styles.infoval}>{opp.compensation}</span>
              </div>
              <div className={styles.infoitem}>
                <span className={styles.infolabel}>المدة</span>
                <span className={styles.infoval}>{opp.duration}</span>
              </div>
              <div className={styles.infoitem}>
                <span className={styles.infolabel}>تاريخ النشر</span>
                <span className={styles.infoval}>{opp.postedDate}</span>
              </div>
            </div>
            <button className="btn dark" style={{ width: '100%', marginTop: '1rem' }} onClick={() => navigate(`/opportunities/${opp.id}/apply`)}>
              تقديم
            </button>
            <button className="btn ghost" style={{ width: '100%', marginTop: '0.6rem' }} onClick={() => navigate(`/opportunities/${opp.id}/match`)}>
              تفصيل المطابقة
            </button>
            <button className="btn ghost" style={{ width: '100%', marginTop: '0.6rem' }} onClick={() => navigate(ROUTES.OPPORTUNITIES)}>
              رجوع
            </button>
          </div>

          <div className={`box ${styles.ctapanel}`}>
            <h3 className={styles.paneltitle}>نسبة المطابقة</h3>
            <Bar value={opp.matchScore} max={100} label="مطابقة عامة" variant={opp.matchScore >= 80 ? 'proof' : 'gap'} />
          </div>
        </aside>
      </div>
    </main>
  );
}

export default OpportunityDetailPage;
