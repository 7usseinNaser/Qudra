import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QudraStore } from '../../services/store';
import { ROUTES } from '../../constants/routes';
import { Bar } from '../../components/ui/Bar';
import { EmptyState } from '../../components/ui/EmptyState';
import styles from './MatchExplanationPage.module.css';

interface MatchFactor {
  key: string;
  label: string;
  score: number;
  explanation: string;
}

export function MatchExplanationPage() {
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

  const factors: MatchFactor[] = [
    { key: 'skills', label: 'المهارات', score: 92, explanation: 'تغطية كاملة للمهارات الحرجة المطلوبة لهذه الفرصة.' },
    { key: 'evidence', label: 'الأدلة', score: 85, explanation: 'أدلة كود حية على GitHub تدعم المهارات المطابقة.' },
    { key: 'experience', label: 'الخبرة', score: 88, explanation: 'سنوات الخبرة في المجال تتجاوز الحد الأدنى المطلوب.' },
    { key: 'similarity', label: 'تشابه المشاريع', score: 79, explanation: 'مشاريع سابقة مشابهة في النطاق التقني والمجال.' },
    { key: 'complexity', label: 'التعقيد', score: 83, explanation: 'التعامل مع مستوى تعقيد مماثل في مشاريع سابقة.' },
    { key: 'availability', label: 'التوفر', score: 95, explanation: 'متاح للعمل في الفترة المطلوبة بالكامل.' },
    { key: 'challenge', label: 'التحدي', score: 71, explanation: 'اجتازت تحديات ذات صلة بمهارات مطلوبة جزئياً.' },
  ];

  return (
    <main id="main" className="wrap" tabIndex={-1} dir="rtl" style={{ padding: 'clamp(1.5rem,4vw,2.75rem) 0 5rem' }}>
      <div className={styles.headrow}>
        <div>
          <button className="btn ghost" onClick={() => navigate(`/opportunities/${opp.id}`)} style={{ marginBottom: '0.8rem' }}>
            ← {opp.title}
          </button>
          <h1 className="scr-t">تفصيل المطابقة</h1>
          <p className="scr-p">كل عامل من عوامل المطابقة مع تفسيره.</p>
        </div>
        <div className={styles.overallscore}>
          <span className={styles.scorenum}>{opp.matchScore}%</span>
          <span className={styles.scorelabel}>مطابقة عامة</span>
        </div>
      </div>

      <div className={styles.factors}>
        {factors.map((f) => (
          <div key={f.key} className={`box ${styles.factorcard}`}>
            <div className={styles.factorhead}>
              <span className={styles.factorlabel}>{f.label}</span>
              <span className={styles.factorscore} style={{ color: f.score >= 80 ? 'var(--accent)' : f.score >= 65 ? 'var(--warning)' : 'var(--danger)' }}>
                {f.score}%
              </span>
            </div>
            <Bar value={f.score} max={100} variant={f.score >= 80 ? 'proof' : f.score >= 65 ? 'accent' : 'gap'} size="sm" />
            <p className={styles.factorexplain}>{f.explanation}</p>
          </div>
        ))}
      </div>

      <div className={styles.actions}>
        <button className="btn ghost" onClick={() => navigate(ROUTES.MASTER_PROFILE)}>
          عرض الأدلة
        </button>
        <button className="btn ghost" onClick={() => navigate(ROUTES.GAPS)}>
          سدّ الفجوات
        </button>
        <button className="btn dark" onClick={() => navigate(`/opportunities/${opp.id}/apply`)}>
          تقديم
        </button>
      </div>
    </main>
  );
}

export default MatchExplanationPage;
