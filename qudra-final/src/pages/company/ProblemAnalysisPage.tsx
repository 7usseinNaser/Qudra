import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { ProblemsService, type ProblemAnalysisResponse } from '../../services/problems.service';
import { Badge } from '../../components/ui/Badge';
import { Bar } from '../../components/ui/Bar';
import { Tag } from '../../components/ui/Tag';
import { Skeleton } from '../../components/ui/Skeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import styles from './ProblemAnalysisPage.module.css';

export function ProblemAnalysisPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [analysis, setAnalysis] = useState<ProblemAnalysisResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    if (!id) {
      setError('معرّف المشكلة مفقود.');
      setLoading(false);
      return;
    }

    let active = true;
    (async () => {
      try {
        const existing = await ProblemsService.getAnalysis(id);
        if (active && existing) {
          setAnalysis(existing);
          setLoading(false);
          return;
        }
        if (active) {
          setAnalyzing(true);
          setLoading(false);
          const result = await ProblemsService.analyze(id);
          if (active) {
            setAnalysis(result);
            setAnalyzing(false);
          }
        }
      } catch (err) {
        if (active) {
          setError('تعذر تحميل التحليل. تحقق من الاتصال وحاول مرة أخرى.');
          setLoading(false);
          setAnalyzing(false);
        }
      }
    })();
    return () => { active = false; };
  }, [id]);

  if (loading) {
    return (
      <main id="main" className="wrap" tabIndex={-1} dir="rtl" style={{ padding: 'clamp(1.5rem,4vw,2.75rem) 0 5rem' }}>
        <h1 className="scr-t">تحليل المشكلة</h1>
        <Skeleton height={120} />
        <div style={{ marginTop: '1rem' }}><Skeleton height={200} /></div>
      </main>
    );
  }

  if (error && !analysis) {
    return (
      <main id="main" className="wrap" tabIndex={-1} dir="rtl" style={{ padding: 'clamp(1.5rem,4vw,2.75rem) 0 5rem' }}>
        <ErrorState
          title="تعذر تحميل التحليل"
          message={error}
          onRetry={() => navigate(ROUTES.PROBLEM_CREATION)}
        />
      </main>
    );
  }

  if (analyzing) {
    return (
      <main id="main" className="wrap" tabIndex={-1} dir="rtl" style={{ padding: 'clamp(1.5rem,4vw,2.75rem) 0 5rem' }}>
        <h1 className="scr-t">جارٍ تحليل المشكلة…</h1>
        <p className="scr-p">الذكاء الاصطناعي يحلل المشكلة ويستخرج القدرات المطلوبة. يرجى الانتظار.</p>
        <Skeleton height={120} />
        <div style={{ marginTop: '1rem' }}><Skeleton height={200} /></div>
      </main>
    );
  }

  const requiredCaps = analysis?.required_capabilities || [];
  const technicalReqs = analysis?.technical_requirements || [];
  const potentialFeatures = analysis?.potential_features || [];
  const constraints = analysis?.constraints || [];

  return (
    <main id="main" className="wrap" tabIndex={-1} dir="rtl" style={{ padding: 'clamp(1.5rem,4vw,2.75rem) 0 5rem' }}>
      <button className="btn ghost" onClick={() => navigate(ROUTES.PROBLEM_CREATION)} style={{ marginBottom: '0.8rem' }}>
        ← تعديل المشكلة
      </button>
      <h1 className="scr-t">تحليل المشكلة</h1>
      <p className="scr-p">الذكاء الاصطناعي حلّل المشكلة واستخرج القدرات المطلوبة.</p>

      <div className={`box ${styles.section}`}>
        <h2 className={styles.sectionTitle}>الملخّص</h2>
        <p className={styles.summary}>
          {analysis?.problem_summary || 'لا يوجد ملخص متاح.'}
        </p>
        {analysis?.solution_direction && (
          <p className={styles.summary} style={{ marginTop: '0.5rem' }}>
            <strong>اتجاه الحل:</strong> {analysis.solution_direction}
          </p>
        )}
        {analysis?.project_type && (
          <div className={styles.complexityRow}>
            <span className={styles.complexityLabel}>نوع المشروع:</span>
            <Badge variant="neutral">{analysis.project_type}</Badge>
          </div>
        )}
      </div>

      <div className={`box ${styles.section}`}>
        <h2 className={styles.sectionTitle}>القدرات المطلوبة</h2>
        {requiredCaps.length > 0 ? (
          <div className={styles.capList}>
            {requiredCaps.map((cap, i) => {
              const confidence = Math.min(100, Math.max(0, (cap.importance || 5) * 10));
              return (
                <div key={`${cap.name}-${i}`} className={styles.capRow}>
                  <div className={styles.capInfo}>
                    <Tag name={cap.name} variant="proven" size="sm" />
                    <Badge variant={confidence >= 80 ? 'proof' : 'neutral'}>
                      {cap.required_level || 'INTERMEDIATE'}
                    </Badge>
                  </div>
                  <div className={styles.capConfidence}>
                    <span className={`${styles.capScore} num`}>{confidence}%</span>
                    <Bar value={confidence} max={100} size="sm" variant={confidence >= 80 ? 'proof' : 'gap'} className={styles.capBar} />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className={styles.text}>لم يتم استخراج قدرات بعد.</p>
        )}
      </div>

      {technicalReqs.length > 0 && (
        <div className={`box ${styles.section}`}>
          <h2 className={styles.sectionTitle}>المتطلبات التقنية</h2>
          <ul className={styles.missingList}>
            {technicalReqs.map((req, i) => (
              <li key={i} className={styles.missingItem}>
                <span className={styles.warnIcon} aria-hidden="true">•</span>
                {req}
              </li>
            ))}
          </ul>
        </div>
      )}

      {potentialFeatures.length > 0 && (
        <div className={`box ${styles.section}`}>
          <h2 className={styles.sectionTitle}>الميزات المحتملة</h2>
          <ul className={styles.missingList}>
            {potentialFeatures.map((feat, i) => (
              <li key={i} className={styles.missingItem}>
                <span className={styles.warnIcon} aria-hidden="true">•</span>
                {feat}
              </li>
            ))}
          </ul>
        </div>
      )}

      {constraints.length > 0 && (
        <div className={`box ${styles.section}`}>
          <h2 className={styles.sectionTitle}>القيود</h2>
          <ul className={styles.missingList}>
            {constraints.map((c, i) => (
              <li key={i} className={styles.missingItem}>
                <span className={styles.warnIcon} aria-hidden="true">⚠</span>
                {c}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className={styles.actions}>
        <button className="btn ghost" onClick={() => navigate(ROUTES.PROBLEM_CREATION)}>
          تعديل
        </button>
        {!accepted ? (
          <button className="btn dark" onClick={() => setAccepted(true)}>
            قبول التحليل
          </button>
        ) : (
          <button className="btn dark" onClick={() => navigate(ROUTES.PROBLEM_CANDIDATES)}>
            متابعة ← المرشحون
          </button>
        )}
      </div>
    </main>
  );
}

export default ProblemAnalysisPage;
