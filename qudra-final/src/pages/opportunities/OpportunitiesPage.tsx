import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { QudraStore } from '../../services/store';
import type { Opportunity, OpportunityType } from '../../services/types';
import { ROUTES } from '../../constants/routes';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import styles from './OpportunitiesPage.module.css';

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

const TYPE_ICON: Record<OpportunityType, string> = {
  job: '💼',
  freelance: '🔗',
  internship: '🎓',
  scholarship: '📚',
  grant: '🔬',
  hackathon: '⚡',
  company_challenge: '🏆',
  project: '🛠',
  challenge: '🎯',
  fulltime: '⏱',
  consulting: '💡',
};

export function OpportunitiesPage() {
  const navigate = useNavigate();
  const opportunities = useMemo(() => QudraStore.getOpportunities(), []);

  const typeCounts = useMemo(() => {
    const counts: Partial<Record<OpportunityType, number>> = {};
    for (const opp of opportunities) {
      counts[opp.type] = (counts[opp.type] || 0) + 1;
    }
    return counts;
  }, [opportunities]);

  const types: OpportunityType[] = ['job', 'freelance', 'internship', 'scholarship', 'grant', 'hackathon', 'company_challenge', 'project', 'challenge', 'fulltime', 'consulting'];

  return (
    <main id="main" className="wrap" tabIndex={-1} dir="rtl" style={{ padding: 'clamp(1.5rem,4vw,2.75rem) 0 5rem' }}>
      <div className={styles.headrow}>
        <div>
          <span className="stepno">Opportunities — فرصك المخصصة</span>
          <h1 className="scr-t">فرص حقيقية مبنية على مهاراتك</h1>
          <p className="scr-p">
            كل فرصة مطابقة مع ملفك المهاري — ليست قائمة عامة، بل اختيار شخصي.
          </p>
        </div>
        <button className="btn ghost" onClick={() => navigate(ROUTES.OPPORTUNITY_SEARCH)}>
          بحث متقدم ←
        </button>
      </div>

      <div className={styles.typegrid}>
        {types.map((t) => {
          const count = typeCounts[t] || 0;
          return (
            <button
              key={t}
              className={styles.typecard}
              onClick={() => navigate(`/opportunities/search?type=${t}`)}
              disabled={count === 0}
              aria-label={`${TYPE_LABEL[t]} — ${count} فرصة`}
            >
              <span className={styles.typeicon} aria-hidden="true">{TYPE_ICON[t]}</span>
              <span className={styles.typename}>{TYPE_LABEL[t]}</span>
              <span className={styles.typecount}>{count}</span>
            </button>
          );
        })}
      </div>

      <h2 className={styles.sectiontitle}>أعلى الفرص مطابقة</h2>

      {opportunities.length === 0 ? (
        <EmptyState
          title="لا توجد فرص متاحة حالياً"
          description="عندما تتوفر فرص مطابقة لملفك ستظهر هنا."
          action={<button className="btn ghost" onClick={() => navigate(ROUTES.HOME)}>العودة للرئيسية</button>}
        />
      ) : (
        <div className={styles.opplist}>
          {opportunities
            .slice()
            .sort((a, b) => b.matchScore - a.matchScore)
            .map((opp: Opportunity) => (
              <button
                key={opp.id}
                className={styles.oppcard}
                onClick={() => navigate(`/opportunities/${opp.id}`)}
                aria-label={`تفاصيل ${opp.title}`}
              >
                <div className={styles.oppcardhead}>
                  <div className={styles.oppinfo}>
                    <h3 className={styles.opptitle}>{opp.title}</h3>
                    <span className={styles.opporg}>{opp.organization}</span>
                  </div>
                  <div className={styles.matchbadge}>
                    <span className={styles.matchnum}>{opp.matchScore}%</span>
                    <span className={styles.matchlabel}>مطابقة</span>
                  </div>
                </div>
                <div className={styles.oppmeta}>
                  <Badge variant="proof">{TYPE_LABEL[opp.type]}</Badge>
                  <span>{opp.field}</span>
                  <span>·</span>
                  <span>{opp.location === 'remote' ? 'عن بعد' : opp.location === 'hybrid' ? 'هجين' : 'حضوري'}</span>
                  <span>·</span>
                  <span>{opp.city}</span>
                </div>
                <p className={styles.oppwhy}>{opp.whyMatch?.[0]}</p>
              </button>
            ))}
        </div>
      )}
    </main>
  );
}

export default OpportunitiesPage;
