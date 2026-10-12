import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { QudraStore } from '../../../services/store';
import type { Opportunity, OpportunityType } from '../../../services/types';
import { ROUTES } from '../../../constants/routes';
import { M17EmptyPage } from './M17EmptyPage';
import styles from './m17.module.css';
import { PlusCircle, Sparkles, Info, Target, TrendingUp, Users, Clock, AlertTriangle } from 'lucide-react';

const TYPE_LABEL: Record<OpportunityType, string> = {
  project: 'مشروع',
  challenge: 'تحدي',
  fulltime: 'دوام كامل',
  consulting: 'استشارة',
  job: 'وظيفة',
  freelance: 'عمل حر',
  internship: 'تدريب',
  scholarship: 'منحة',
  grant: 'منحة بحثية',
  hackathon: 'هاكاثون',
  company_challenge: 'تحدي شركة',
};

const TYPE_ICON: Record<OpportunityType, string> = {
  project: '[Proj]',
  challenge: '[Chal]',
  fulltime: '[FT]',
  consulting: '[Cons]',
  job: '[Job]',
  freelance: '[Free]',
  internship: '[Int]',
  scholarship: '[Schol]',
  grant: '[Grant]',
  hackathon: '[Hack]',
  company_challenge: '[CoChal]',
};

const TYPE_VARIANT: Record<OpportunityType, 'proof' | 'gap' | 'claimed'> = {
  project: 'proof',
  challenge: 'gap',
  fulltime: 'claimed',
  consulting: 'claimed',
  job: 'claimed',
  freelance: 'claimed',
  internship: 'claimed',
  scholarship: 'proof',
  grant: 'proof',
  hackathon: 'gap',
  company_challenge: 'gap',
};

// Inline style constants to avoid parsing issues
const insightHeaderStyle = { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' };
const insightTitleStyle = { margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--ink)' };
const proofColor = { color: '#10B981' };
const warningColor = { color: '#F59E0B' };
const dangerColor = { color: '#EF4444' };
const labelStyle = { fontWeight: 600, color: 'var(--ink)' };
const valueStyle = { fontSize: '0.8rem', color: 'var(--ink-2)' };

export const M17OverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showExplain, setShowExplain] = useState(false);
  const [selectedType, setSelectedType] = useState<OpportunityType | 'all'>('all');
  const [sortBy, setSortBy] = useState<'match' | 'date' | 'deadline'>('match');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await new Promise(res => setTimeout(res, 400));
      setOpportunities(QudraStore.getOpportunities());
      setLoading(false);
    };
    loadData();
  }, []);

  const filteredOpportunities = useMemo(() => {
    let list = [...opportunities];
    if (selectedType !== 'all') {
      list = list.filter(o => o.type === selectedType);
    }
    switch (sortBy) {
      case 'match':
        list.sort((a, b) => b.matchScore - a.matchScore);
        break;
      case 'date':
        list.sort((a, b) => new Date(b.postedDate || 0).getTime() - new Date(a.postedDate || 0).getTime());
        break;
      case 'deadline':
        list.sort((a, b) => new Date(a.deadline || 0).getTime() - new Date(b.deadline || 0).getTime());
        break;
    }
    return list;
  }, [opportunities, selectedType, sortBy]);

  const typeCounts = useMemo(() => {
    const counts: Partial<Record<OpportunityType, number>> = {};
    for (const opp of opportunities) {
      counts[opp.type] = (counts[opp.type] || 0) + 1;
    }
    return counts;
  }, [opportunities]);

  const types: OpportunityType[] = ['project', 'challenge', 'fulltime', 'job', 'freelance', 'internship', 'hackathon', 'company_challenge'];

  const avgMatchScore = opportunities.length > 0
    ? Math.round(opportunities.reduce((sum, o) => sum + o.matchScore, 0) / opportunities.length)
    : 0;

  const highMatchCount = opportunities.filter(o => o.matchScore >= 80).length;
  const urgentCount = opportunities.filter(o => {
    if (!o.deadline) return false;
    const daysLeft = Math.ceil((new Date(o.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return daysLeft <= 7;
  }).length;

  if (loading) {
    return (
      <div className={styles.container} dir="rtl">
        <div className={styles.loadingState}>
          <div className={styles.spinner} />
          <span>جاري تحميل فرصك المخصصة...</span>
        </div>
      </div>
    );
  }

  if (opportunities.length === 0) {
    return (
      <div className={styles.container} dir="rtl">
        <M17EmptyPage />
      </div>
    );
  }

  return (
    <div className={styles.container} dir="rtl">
      <div className={styles.headerRow}>
        <div className={styles.headerContent}>
          <span className={styles.badgeQ}>M17 · Q-0641 · ⚓ Overview</span>
          <span className={styles.demoBadge}>[Demo / تجريبي] بيانات فرص محاكاة</span>
          <h1 className={styles.title}>سوق الفرص: نظرتك الشخصية</h1>
          <p className={styles.subtitle}>
            كل فرصة مطابقة مع ملفك المهاري الحقيقي — ليست قائمة عامة، بل اختيار شخصي مبني على أدلتك المثبتة (Proven).
            راجع مبررات التوافق لكل فرصة واعرف بالضبط أي قدراتك تغطي المتطلبات وأين توجد فجواتك.
          </p>
        </div>

        <div className={styles.actionRow}>
          <Button
            variant="proof"
            size="md"
            onClick={() => navigate(ROUTES.M17_CREATE)}
            leftIcon={<PlusCircle size={16} />}
          >
            نشر فرصة جديدة
          </Button>

          <Button
            variant="outline"
            size="md"
            onClick={() => setShowExplain(!showExplain)}
            leftIcon={<Sparkles size={16} />}
          >
            {showExplain ? 'إخفاء التفسير' : 'اشرح لي: مطابقة الفرص'}
          </Button>
        </div>
      </div>

      {showExplain && (
        <div className={styles.explainDrawer}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
            <Info size={18} color="var(--proof)" />
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: 'var(--ink)' }}>
              تفسير الذكاء الاصطناعي: كيف تعمل مطابقة الفرص
            </h3>
          </div>
          <p style={{ margin: '0 0 1rem', fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--ink-2)' }}>
            محرك المطابقة يقارن <strong>متطلبات الفرصة المنظمة</strong> (Structured Requirements) مع
            <strong>قدراتك المثبتة بأدلة</strong> (Verified Capabilities + Evidences). كل فرصة تظهر:
            <br />• <strong>نسبة مطابقة</strong> محسوبة من تغطية المتطلبات الحرجة والمفضلة.
            <br />• <strong>مبررات التوافق</strong> (Why You Match) — أدلة محددة من ملفك تدعم المطابقة.
            <br />• <strong>فجواتك المرتبطة</strong> — قدرات مطلوبة لم تثبت بعد، مع إجراءات مقترحة لسدها.
            <br />لا ترتيب بلا تعليل — كل رقم قابل للفتح للدليل خلفه.
          </p>
          <div className={styles.grid3} style={{ marginBottom: 0 }}>
            <div className={styles.metricBox}>
              <span className={styles.metricLabel}>Proven ≠ Claimed</span>
              <span className={styles.metricHint}>فصل بصري ومنطقي دائم — الادعاء لا يمنح مستوى ثقة في المطابقة</span>
            </div>
            <div className={styles.metricBox}>
              <span className={styles.metricLabel}>متطلبات منظمة</span>
              <span className={styles.metricHint}>كل فرصة تفكك لمهارات بأهمية (حرجة/مفضلة) ومستوى مطلوب</span>
            </div>
            <div className={styles.metricBox}>
              <span className={styles.metricLabel}>مسار سد الفجوات</span>
              <span className={styles.metricHint}>من كل فجوة → تحدي عملي / مورد تعليمي / مشروع إثبات</span>
            </div>
          </div>
        </div>
      )}

      <div className={styles.grid4}>
        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>إجمالي الفرص</span>
          <span className={styles.metricValue}><span className="num">{opportunities.length}</span></span>
          <span className={styles.metricHint}>مخصصة لملفك المهاري</span>
        </div>
        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>متوسط المطابقة</span>
          <span className={styles.metricValue} style={{ color: 'var(--proof)' }}><span className="num">{avgMatchScore}</span>%</span>
          <span className={styles.metricHint}>معدل التوافق عبر جميع الفرص</span>
        </div>
        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>مطابقة عالية (≥80%)</span>
          <span className={styles.metricValue} style={{ color: '#10B981' }}><span className="num">{highMatchCount}</span></span>
          <span className={styles.metricHint}>فرص جاهزة للتقديم الفوري</span>
        </div>
        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>مواعيد قريبة (≤7 أيام)</span>
          <span className={styles.metricValue} style={{ color: '#F59E0B' }}><span className="num">{urgentCount}</span></span>
          <span className={styles.metricHint}>تحتاج إجراء سريع</span>
        </div>
      </div>

      <div className={styles.filterBar}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>النوع</label>
          <div className={styles.typeFilters}>
            <button
              className={`${styles.typeFilterBtn} ${selectedType === 'all' ? styles.active : ''}`}
              onClick={() => setSelectedType('all')}
            >
              الكل <span className={styles.filterCount}>{opportunities.length}</span>
            </button>
            {types.map(t => (
              <button
                key={t}
                className={`${styles.typeFilterBtn} ${selectedType === t ? styles.active : ''}`}
                onClick={() => setSelectedType(t)}
                disabled={(typeCounts[t] || 0) === 0}
              >
                <span className={styles.typeIcon}>{TYPE_ICON[t]}</span>
                {TYPE_LABEL[t]}
                <span className={styles.filterCount}>{typeCounts[t] || 0}</span>
              </button>
            ))}
          </div>
        </div>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>الترتيب</label>
          <select className={styles.sortSelect} value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)}>
            <option value="match">أعلى مطابقة</option>
            <option value="date">الأحدث نشراً</option>
            <option value="deadline">أقرب موعد نهائي</option>
          </select>
        </div>
      </div>

      <div className={styles.typeGrid}>
        {types.map(t => {
          const count = typeCounts[t] || 0;
          return (
            <button
              key={t}
              className={styles.typeCard}
              onClick={() => setSelectedType(selectedType === t ? 'all' : t)}
              disabled={count === 0}
              aria-label={`${TYPE_LABEL[t]} — ${count} فرصة`}
            >
              <span className={styles.typeIcon} aria-hidden="true">{TYPE_ICON[t]}</span>
              <span className={styles.typeName}>{TYPE_LABEL[t]}</span>
              <span className={styles.typeCount}>{count}</span>
              <Badge variant={TYPE_VARIANT[t] as 'proof' | 'gap' | 'claimed'} size="sm">{TYPE_LABEL[t]}</Badge>
            </button>
          );
        })}
      </div>

      <h2 className={styles.sectionTitle}>أعلى الفرص مطابقة</h2>

      <div className={styles.oppList}>
        {filteredOpportunities.map((opp) => (
          <button
            key={opp.id}
            className={styles.oppCard}
            onClick={() => navigate(ROUTES.M17_DETAILS.replace(':id', opp.id))}
            aria-label={`تفاصيل ${opp.title}`}
          >
            <div className={styles.oppCardHead}>
              <div className={styles.oppInfo}>
                <h3 className={styles.oppTitle}>{opp.title}</h3>
                <span className={styles.oppOrg}>
                  {opp.isVerifiedOrg && <span className={styles.verifiedDot} aria-label="جهة موثقة" />}
                  {opp.organization}
                </span>
              </div>
              <div className={styles.matchBadge}>
                <span className={`${styles.matchNum} ${opp.matchScore >= 80 ? styles.highMatch : ''}`}>{opp.matchScore}%</span>
                <span className={styles.matchLabel}>مطابقة</span>
              </div>
            </div>
            <div className={styles.oppMeta}>
              <Badge variant={TYPE_VARIANT[opp.type] as 'proof' | 'gap' | 'claimed'} size="sm">{TYPE_LABEL[opp.type]}</Badge>
              <span>{opp.field}</span>
              <span className={styles.dot}>·</span>
              <span>{opp.location === 'remote' ? 'عن بعد' : opp.location === 'hybrid' ? 'هجين' : 'حضوري'}</span>
              <span className={styles.dot}>·</span>
              <span>{opp.city}</span>
              <span className={styles.dot}>·</span>
              <span>{opp.experience}</span>
            </div>
            <p className={styles.oppWhy}>{opp.whyMatch?.[0] || opp.matchReason || opp.description || ''}</p>
            <div className={styles.oppFooter}>
              <span className={styles.deadline}>
                <Clock size={12} />
                {opp.deadline ? `ينتهي ${new Date(opp.deadline).toLocaleDateString('ar-EG')}` : 'بدون موعد نهائي'}
              </span>
              <span className={styles.compensation}>{opp.compensation}</span>
            </div>
          </button>
        ))}
      </div>

      <div className={styles.insightCard}>
        <div style={insightHeaderStyle}>
          <TrendingUp size={20} style={proofColor} />
          <h3 style={insightTitleStyle}>
            رؤى سريعة من ملفك
          </h3>
        </div>
        <div className={styles.insightGrid}>
          <div className={styles.insightItem}>
            <Target size={18} style={{ color: '#10B981' }} />
            <div>
              <div style={labelStyle}>أقوى مطابقة: {opportunities[0]?.title || '-'}</div>
              <div style={valueStyle}>{`${opportunities[0]?.matchScore || 0}% توافق`}</div>
            </div>
          </div>
          <div className={styles.insightItem}>
            <Users size={18} style={warningColor} />
            <div>
              <div style={labelStyle}>{highMatchCount} فرص جاهزة للتقديم</div>
              <div style={valueStyle}>مطابقة 80%+ - لا فجوات حرجة</div>
            </div>
          </div>
          <div className={styles.insightItem}>
            <AlertTriangle size={18} style={dangerColor} />
            <div>
              <div style={labelStyle}>{urgentCount} فرص بمواعيد قريبة</div>
              <div style={valueStyle}>تحتاج قرار خلال أسبوع</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default M17OverviewPage;
