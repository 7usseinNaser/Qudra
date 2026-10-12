import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import styles from './M19ResultsPage.module.css';

interface PipelineResult {
  stage: string;
  stageLabel: string;
  count: number;
  conversionRate: number;
  avgDays: number;
  candidates: { id: string; name: string; matchScore: number }[];
}

const results: PipelineResult[] = [
  {
    stage: 'sourced',
    stageLabel: 'مصدر',
    count: 24,
    conversionRate: 75,
    avgDays: 2,
    candidates: [
      { id: 'c1', name: 'سارة المطيري', matchScore: 94 },
      { id: 'c2', name: 'خالد العتيبي', matchScore: 87 },
      { id: 'c3', name: 'نورة القحطاني', matchScore: 82 },
    ],
  },
  {
    stage: 'screening',
    stageLabel: 'فرز',
    count: 18,
    conversionRate: 67,
    avgDays: 3,
    candidates: [
      { id: 'c4', name: 'فهد الدوسري', matchScore: 76 },
      { id: 'c5', name: 'ريم الشمري', matchScore: 71 },
    ],
  },
  {
    stage: 'technical',
    stageLabel: 'تقني',
    count: 12,
    conversionRate: 50,
    avgDays: 5,
    candidates: [
      { id: 'c6', name: 'أحمد الزهراني', matchScore: 89 },
      { id: 'c7', name: 'مها الحربي', matchScore: 84 },
    ],
  },
  {
    stage: 'interview',
    stageLabel: 'مقابلة',
    count: 6,
    conversionRate: 50,
    avgDays: 7,
    candidates: [
      { id: 'c8', name: 'عبدالله القحطاني', matchScore: 79 },
    ],
  },
  {
    stage: 'offer',
    stageLabel: 'عرض',
    count: 3,
    conversionRate: 33,
    avgDays: 2,
    candidates: [
      { id: 'c1', name: 'سارة المطيري', matchScore: 94 },
    ],
  },
  {
    stage: 'hired',
    stageLabel: 'معين',
    count: 1,
    conversionRate: 100,
    avgDays: 1,
    candidates: [
      { id: 'c1', name: 'سارة المطيري', matchScore: 94 },
    ],
  },
];

export function M19ResultsPage() {
  const navigate = useNavigate();

  const totalSourced = results[0].count;
  const totalHired = results[results.length - 1].count;
  const overallConversion = Math.round((totalHired / totalSourced) * 100);

  return (
    <main id="main" className="wrap" tabIndex={-1} dir="rtl" style={{ padding: 'clamp(1.5rem,4vw,2.75rem) 0 5rem' }}>
      <div className={styles.header}>
        <button className="btn ghost" onClick={() => navigate(ROUTES.M19_OVERVIEW)}>← العودة</button>
        <h1 className="scr-t">نتائج خط المرشحين</h1>
        <p className={styles.subtitle}>تحليل أداء مسار التوظيف ومعدلات التحويل</p>
      </div>

      <div className={styles.summary}>
        <div className={`box ${styles.summarycard}`}>
          <span className={styles.summarynum}>{totalSourced}</span>
          <span className={styles.summarylabel}>إجمالي المصدرة</span>
        </div>
        <div className={`box ${styles.summarycard}`}>
          <span className={styles.summarynum}>{totalHired}</span>
          <span className={styles.summarylabel}>المعينين</span>
        </div>
        <div className={`box ${styles.summarycard}`}>
          <span className={styles.summarynum}>{overallConversion}%</span>
          <span className={styles.summarylabel}>معدل التحويل الكلي</span>
        </div>
        <div className={`box ${styles.summarycard}`}>
          <span className={styles.summarynum}>{Math.round(results.reduce((a, b) => a + b.avgDays * b.count, 0) / totalSourced)}</span>
          <span className={styles.summarylabel}>متوسط الأيام الكلي</span>
        </div>
      </div>

      <div className={styles.funnel}>
        {results.map((stage) => (
          <div key={stage.stage} className={styles.funnelstage}>
            <div className={styles.funnelheader}>
              <span className={styles.funnelname}>{stage.stageLabel}</span>
              <span className={styles.funnelcount}>{stage.count}</span>
            </div>
            <div className={styles.funnelbar}>
              <div className={styles.funnelfill} style={{ width: `${(stage.count / totalSourced) * 100}%` }} />
            </div>
            <div className={styles.funnelmetrics}>
              <div className={styles.metric}>
                <span className={styles.metricvalue}>{stage.conversionRate}%</span>
                <span className={styles.metriclabel}>تحويل</span>
              </div>
              <div className={styles.metric}>
                <span className={styles.metricvalue}>{stage.avgDays}</span>
                <span className={styles.metriclabel}>أيام</span>
              </div>
            </div>
            <div className={styles.funnelcandidates}>
              {stage.candidates.map((c) => (
                <div key={c.id} className={styles.funnelcandidate}>
                  <span>{c.name}</span>
                  <span className={styles.matchscore}>{c.matchScore}%</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.insights}>
        <h3 className={styles.insightstitle}>الرؤى الرئيسية</h3>
        <div className={styles.insightslist}>
          <div className={`box ${styles.insightcard}`}>
            <span className={styles.insighticon}>📊</span>
            <div>
              <h4 className={styles.insighttitle}>أكبر تسرب في مرحلة الفرز</h4>
              <p className={styles.insightdesc}>فقد 25% من المرشحين في مرحلة الفرز. يُنصح بمراجعة معايير الفرز الأولي.</p>
            </div>
          </div>
          <div className={`box ${styles.insightcard}`}>
            <span className={styles.insighticon}>⏱</span>
            <div>
              <h4 className={styles.insighttitle}>متوسط وقت التوظيف: 20 يوم</h4>
              <p className={styles.insightdesc}>المتوسط الطبيعي في الصناعة 30-45 يوم. أداء ممتاز.</p>
            </div>
          </div>
          <div className={`box ${styles.insightcard}`}>
            <span className={styles.insighticon}>🎯</span>
            <div>
              <h4 className={styles.insighttitle}>جودة المرشحين عالية</h4>
              <p className={styles.insightdesc}>متوسط درجة المطابقة 84%، أعلى من المعيار (70%).</p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.footeractions}>
        <button className="btn dark" onClick={() => navigate(ROUTES.M19_CREATE)}>إضافة مرشح</button>
        <button className="btn ghost" onClick={() => navigate(ROUTES.M19_OVERVIEW)}>العودة للخط</button>
      </div>
    </main>
  );
}

export default M19ResultsPage;