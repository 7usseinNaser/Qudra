import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { QudraStore } from '../../services/store';
import type { Opportunity, OpportunityType, OpportunityLocation } from '../../services/types';
import { ROUTES } from '../../constants/routes';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import styles from './OpportunitySearchPage.module.css';

const TYPE_LABEL: Record<OpportunityType, string> = {
  job: 'وظيفة',
  freelance: 'عمل حر',
  internship: 'تدريب',
  scholarship: 'منحة',
  grant: 'منحة بحثية',
  hackathon: 'هاكاثون',
  company_challenge: 'تحدي شركة',
  project: 'مشروع',
  challenge: 'تحدٍ',
  fulltime: 'دوام كامل',
  consulting: 'استشارة',
};

const LOC_LABEL: Record<OpportunityLocation, string> = {
  remote: 'عن بعد',
  onsite: 'حضوري',
  'on-site': 'حضوري',
  hybrid: 'هجين',
};

export function OpportunitySearchPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const allOpportunities = useMemo(() => QudraStore.getOpportunities(), []);

  const [typeFilter, setTypeFilter] = useState<OpportunityType | 'all'>(
    (searchParams.get('type') as OpportunityType) || 'all',
  );
  const [locationFilter, setLocationFilter] = useState<OpportunityLocation | 'all'>('all');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [fieldFilter, setFieldFilter] = useState<string>('all');

  const fields = useMemo(() => {
    const set = new Set(allOpportunities.map((o) => o.field));
    return ['all', ...Array.from(set)];
  }, [allOpportunities]);

  const filtered = useMemo(() => {
    return allOpportunities.filter((o) => {
      if (typeFilter !== 'all' && o.type !== typeFilter) return false;
      if (locationFilter !== 'all' && o.location !== locationFilter) return false;
      if (verifiedOnly && !o.isVerifiedOrg) return false;
      if (fieldFilter !== 'all' && o.field !== fieldFilter) return false;
      return true;
    });
  }, [allOpportunities, typeFilter, locationFilter, verifiedOnly, fieldFilter]);

  const types: (OpportunityType | 'all')[] = ['all', 'job', 'freelance', 'internship', 'scholarship', 'grant', 'hackathon', 'company_challenge', 'project', 'challenge', 'fulltime', 'consulting'];
  const locations: (OpportunityLocation | 'all')[] = ['all', 'remote', 'hybrid', 'on-site', 'onsite'];

  return (
    <main id="main" className="wrap" tabIndex={-1} dir="rtl" style={{ padding: 'clamp(1.5rem,4vw,2.75rem) 0 5rem' }}>
      <div className={styles.headrow}>
        <div>
          <button className="btn ghost" onClick={() => navigate(ROUTES.OPPORTUNITIES)} style={{ marginBottom: '0.8rem' }}>
            ← الفرص
          </button>
          <h1 className="scr-t">بحث الفرص</h1>
          <p className="scr-p">فلتر حسب النوع، المجال، الموقع، والجهة الموثقة.</p>
        </div>
      </div>

      <div className={`box ${styles.filters}`}>
        <div className={styles.filtergroup}>
          <span className={styles.filterlabel}>النوع</span>
          <div className={styles.chips}>
            {types.map((t) => (
              <button
                key={t}
                className={`${styles.chip} ${typeFilter === t ? styles.chipActive : ''}`}
                onClick={() => setTypeFilter(t)}
              >
                {t === 'all' ? 'الكل' : TYPE_LABEL[t]}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.filtergroup}>
          <span className={styles.filterlabel}>الموقع</span>
          <div className={styles.chips}>
            {locations.map((l) => (
              <button
                key={l}
                className={`${styles.chip} ${locationFilter === l ? styles.chipActive : ''}`}
                onClick={() => setLocationFilter(l)}
              >
                {l === 'all' ? 'الكل' : LOC_LABEL[l]}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.filtergroup}>
          <span className={styles.filterlabel}>المجال</span>
          <div className={styles.chips}>
            {fields.map((f) => (
              <button
                key={f}
                className={`${styles.chip} ${fieldFilter === f ? styles.chipActive : ''}`}
                onClick={() => setFieldFilter(f)}
              >
                {f === 'all' ? 'الكل' : f}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.filtergroup}>
          <span className={styles.filterlabel}>موثق فقط</span>
          <button
            className={`${styles.toggle} ${verifiedOnly ? styles.toggleOn : ''}`}
            onClick={() => setVerifiedOnly(!verifiedOnly)}
            aria-pressed={verifiedOnly}
            aria-label="فلترة الجهات الموثقة فقط"
          >
            <span className={styles.toggleknob} />
          </button>
        </div>
      </div>

      <div className={styles.resultscount}>
        {filtered.length} فرصة مطابقة
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="لا توجد فرص مطابقة"
          description="جرّب تغيير الفلاتر لعرض فرص أخرى."
          action={<button className="btn ghost" onClick={() => { setTypeFilter('all'); setLocationFilter('all'); setVerifiedOnly(false); setFieldFilter('all'); }}>إعادة الفلاتر</button>}
        />
      ) : (
        <div className={styles.opplist}>
          {filtered.map((opp: Opportunity) => (
            <button
              key={opp.id}
              className={styles.oppcard}
              onClick={() => navigate(`/opportunities/${opp.id}`)}
              aria-label={`تفاصيل ${opp.title}`}
            >
              <div className={styles.oppcardhead}>
                <div className={styles.oppinfo}>
                  <h3 className={styles.opptitle}>{opp.title}</h3>
                  <span className={styles.opporg}>
                    {opp.organization}
                    {opp.isVerifiedOrg && <span className={styles.verified} aria-label="جهة موثقة"> ✓ موثّق</span>}
                  </span>
                </div>
                <div className={styles.matchbadge}>
                  <span className={styles.matchnum}>{opp.matchScore}%</span>
                </div>
              </div>
              <div className={styles.oppmeta}>
                <Badge variant="proof">{TYPE_LABEL[opp.type]}</Badge>
                <span>{opp.field}</span>
                <span>·</span>
                <span>{LOC_LABEL[opp.location]}</span>
                <span>·</span>
                <span>{opp.compensation}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </main>
  );
}

export default OpportunitySearchPage;
