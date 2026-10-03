import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QudraStore } from '../../services/store';
import { ROUTES } from '../../constants/routes';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import styles from './ResourceDetailPage.module.css';

export function ResourceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const resource = useMemo(
    () => QudraStore.getResources().find((r) => r.id === id),
    [id],
  );

  if (!resource) {
    return (
      <main id="main" className="wrap" tabIndex={-1} dir="rtl" style={{ padding: 'clamp(1.5rem,4vw,2.75rem) 0 5rem' }}>
        <EmptyState
          title="لم نعثر على هذا المصدر"
          description="ربما تم حذفه أو أن الرابط غير صحيح."
          action={<button className="btn dark" onClick={() => navigate(ROUTES.RESOURCES)}>العودة للمصادر</button>}
        />
      </main>
    );
  }

  const relatedGap = resource.relatedGapId
    ? QudraStore.getGaps().find((g: any) => g.id === resource.relatedGapId)
    : null;

  return (
    <main id="main" className="wrap" tabIndex={-1} dir="rtl" style={{ padding: 'clamp(1.5rem,4vw,2.75rem) 0 5rem' }}>
      <div className={styles.headrow}>
        <div>
          <button className="btn ghost" onClick={() => navigate(ROUTES.RESOURCES)} style={{ marginBottom: '0.8rem' }}>
            ← المصادر
          </button>
          <h1 className="scr-t">{resource.title}</h1>
          <span className={styles.provider}>{resource.provider}</span>
        </div>
        <Badge variant={resource.price === 'free' ? 'proof' : 'gap'}>
          {resource.price === 'free' ? 'مجاني' : 'مدفوع'}
        </Badge>
      </div>

      <div className={styles.grid}>
        <div className={styles.main}>
          <div className={`box ${styles.panel}`}>
            <h3 className={styles.paneltitle}>الوصف</h3>
            <p className={styles.text}>{resource.description}</p>
          </div>

          <div className={`box ${styles.panel}`}>
            <h3 className={styles.paneltitle}>التفاصيل</h3>
            <div className={styles.inforow}>
              <div className={styles.infoitem}>
                <span className={styles.infolabel}>المدة</span>
                <span className={styles.infoval}>{resource.duration}</span>
              </div>
              <div className={styles.infoitem}>
                <span className={styles.infolabel}>المستوى</span>
                <span className={styles.infoval}>
                  {resource.difficulty === 'beginner' ? 'مبتدئ' : resource.difficulty === 'intermediate' ? 'متوسط' : 'متقدم'}
                </span>
              </div>
              <div className={styles.infoitem}>
                <span className={styles.infolabel}>الصيغة</span>
                <span className={styles.infoval}>{resource.format}</span>
              </div>
              <div className={styles.infoitem}>
                <span className={styles.infolabel}>اللغة</span>
                <span className={styles.infoval}>{resource.language}</span>
              </div>
              <div className={styles.infoitem}>
                <span className={styles.infolabel}>شهادة</span>
                <span className={styles.infoval}>{resource.certificate ? 'نعم' : 'لا'}</span>
              </div>
              <div className={styles.infoitem}>
                <span className={styles.infolabel}>التقييم</span>
                <span className={styles.infoval}>
                  {resource.rating != null ? (
                    <>
                      <span className={styles.stars} aria-hidden="true">{'★'.repeat(Math.round(resource.rating))}</span>
                      {' '}{resource.rating.toFixed(1)}
                    </>
                  ) : (
                    '—'
                  )}
                </span>
              </div>
            </div>
          </div>

          {relatedGap && (
            <div className={`box ${styles.panel}`}>
              <h3 className={styles.paneltitle}>الفجوة المرتبطة</h3>
              <button className={styles.gaplink} onClick={() => navigate(`/gaps/${relatedGap.id}`)}>
                {relatedGap.capabilityName || relatedGap.skill}
              </button>
            </div>
          )}

          <div className={`box ${styles.panel}`}>
            <h3 className={styles.paneltitle}>لماذا ننصح به</h3>
            <p className={styles.text}>{resource.whyRecommended}</p>
          </div>
        </div>

        <aside className={styles.side}>
          <div className={`box ${styles.ctapanel}`}>
            <h3 className={styles.paneltitle}>افتح المصدر</h3>
            <p className={styles.ctatext}>يفتح في نافذة خارجية.</p>
            <a
              href={resource.url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="btn dark"
              style={{ display: 'inline-block', textDecoration: 'none' }}
            >
              فتح المصدر ←
            </a>
          </div>
        </aside>
      </div>
    </main>
  );
}

export default ResourceDetailPage;
