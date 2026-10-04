import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { Badge } from '../../components/ui/Badge';
import { Bar } from '../../components/ui/Bar';
import styles from './RequirementAnalysisPage.module.css';

interface ExtractedCapability {
  skill: string;
  requiredLevel: string;
  confidence: number;
}

interface Ambiguity {
  text: string;
  suggestion: string;
}

export function RequirementAnalysisPage() {
  const { id: _id } = useParams<{ id: string }>();
  void _id;
  const navigate = useNavigate();
  const [accepted, setAccepted] = useState(false);

  const extractedCapabilities: ExtractedCapability[] = [
    { skill: 'FastAPI & Microservices', requiredLevel: 'ADVANCED', confidence: 95 },
    { skill: 'PostgreSQL & Database Design', requiredLevel: 'ADVANCED', confidence: 92 },
    { skill: 'Docker & Containerization', requiredLevel: 'INTERMEDIATE', confidence: 88 },
    { skill: 'CI/CD Pipelines', requiredLevel: 'INTERMEDIATE', confidence: 75 },
    { skill: 'System Design', requiredLevel: 'ADVANCED', confidence: 82 },
  ];

  const ambiguities: Ambiguity[] = [
    { text: '"خبرة في الأنظمة الموزعة" — غير محدد', suggestion: 'تحديد: خبرة 2+ سنوات في Microservices' },
    { text: '"فهم CI/CD" — مستوى غير واضح', suggestion: 'تحديد: INTERMEDIATE مع أدلة عملية' },
  ];

  const normalizations = [
    { from: 'Python expert', to: 'Python — ADVANCED' },
    { from: 'DB skills', to: 'PostgreSQL — ADVANCED' },
    { from: 'cloud stuff', to: 'Docker — INTERMEDIATE' },
  ];

  return (
    <main id="main" className="wrap" tabIndex={-1} dir="rtl" style={{ padding: 'clamp(1.5rem,4vw,2.75rem) 0 5rem' }}>
      <div className={styles.headrow}>
        <div>
          <button className="btn ghost" onClick={() => navigate(ROUTES.COMPANY_HOME)} style={{ marginBottom: '0.8rem' }}>
            ← لوحة الشركة
          </button>
          <h1 className="scr-t">تحليل المتطلبات</h1>
          <p className="scr-p">استخراج ذكي للقدرات المطلوبة مع مستوياتها ودرجة الثقة.</p>
        </div>
        {accepted && <Badge variant="proof">✓ تم القبول</Badge>}
      </div>

      <div className={`box ${styles.panel}`}>
        <h3 className={styles.paneltitle}>القدرات المستخرجة</h3>
        <div className={styles.caplist}>
          {extractedCapabilities.map((cap) => (
            <div key={cap.skill} className={styles.capitem}>
              <div className={styles.capinfo}>
                <span className={styles.capskill}>{cap.skill}</span>
                <Badge variant={cap.confidence >= 85 ? 'proof' : 'neutral'}>{cap.requiredLevel}</Badge>
              </div>
              <div className={styles.capconfidence}>
                <span className={styles.conflabel}>الثقة</span>
                <span className={styles.confval}>{cap.confidence}%</span>
                <Bar value={cap.confidence} max={100} size="sm" variant={cap.confidence >= 85 ? 'proof' : 'gap'} className={styles.confbar} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.grid}>
        <div className={`box ${styles.panel}`}>
          <h3 className={styles.paneltitle}>الغموض المكتشف</h3>
          {ambiguities.length > 0 ? (
            <div className={styles.ambiguitylist}>
              {ambiguities.map((a, i) => (
                <div key={i} className={styles.ambiguityitem}>
                  <div className={styles.ambiguitytext}>
                    <span className={styles.warnicon} aria-hidden="true">⚠</span>
                    {a.text}
                  </div>
                  <div className={styles.ambiguitysuggestion}>
                    <span className={styles.sugglabel}>اقتراح:</span> {a.suggestion}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.text}>لا يوجد غموض — جميع المتطلبات واضحة.</p>
          )}
        </div>

        <div className={`box ${styles.panel}`}>
          <h3 className={styles.paneltitle}>التطبيع المقترح</h3>
          <div className={styles.normlist}>
            {normalizations.map((n) => (
              <div key={n.from} className={styles.normitem}>
                <span className={styles.normfrom}>{n.from}</span>
                <span className={styles.normarrow} aria-hidden="true">←</span>
                <span className={styles.normto}>{n.to}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <button className="btn ghost" onClick={() => navigate(ROUTES.JOB_DEFINITION)}>
          تعديل الوظيفة
        </button>
        {!accepted ? (
          <button className="btn dark" onClick={() => setAccepted(true)}>
            قبول اقتراح الذكاء الاصطناعي
          </button>
        ) : (
          <button className="btn dark" onClick={() => navigate(ROUTES.CANDIDATES)}>
            متابعة ← النتائج
          </button>
        )}
      </div>
    </main>
  );
}

export default RequirementAnalysisPage;
