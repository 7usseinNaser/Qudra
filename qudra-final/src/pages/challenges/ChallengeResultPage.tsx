import { useMemo } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { QudraStore } from '../../services/store';
import { ROUTES } from '../../constants/routes';
import { Badge } from '../../components/ui/Badge';
import { Bar } from '../../components/ui/Bar';
import { EmptyState } from '../../components/ui/EmptyState';
import styles from './ChallengeResultPage.module.css';

interface ResultState {
  submission?: string;
  passed?: boolean;
}

export function ChallengeResultPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const challenge = useMemo(
    () => QudraStore.getChallenges().find((c) => c.id === id),
    [id],
  );

  const state = (location.state as ResultState) || {};
  const passed = state.passed ?? true;

  if (!challenge) {
    return (
      <main id="main" className="wrap" tabIndex={-1} dir="rtl" style={{ padding: 'clamp(1.5rem,4vw,2.75rem) 0 5rem' }}>
        <EmptyState
          title="لم نعثر على هذا التحدي"
          description="ربما تم حذفه أو أن الرابط غير صحيح."
          action={<button className="btn dark" onClick={() => navigate(ROUTES.CHALLENGES)}>العودة للتحديات</button>}
        />
      </main>
    );
  }

  const score = passed ? 82 : 45;
  const strengths = passed
    ? ['حل واضح ومنطقي', 'استخدام صحيح للمفاهيم الأساسية', 'بنية كود نظيفة']
    : ['محاولة جيدة في الفهم العام'];
  const weaknesses = passed
    ? ['يحتاج تحسين في معالجة الحالات الحدية']
    : ['الحل غير مكتمل', 'لم يغطِ جميع المتطلبات', 'يحتاج مراجعة المفاهيم الأساسية'];

  return (
    <main id="main" className="wrap" tabIndex={-1} dir="rtl" style={{ padding: 'clamp(1.5rem,4vw,2.75rem) 0 5rem' }}>
      <div className={styles.headrow}>
        <div>
          <button className="btn ghost" onClick={() => navigate(ROUTES.CHALLENGES)} style={{ marginBottom: '0.8rem' }}>
            ← مكتبة التحديات
          </button>
          <h1 className="scr-t">نتيجة: {challenge.title}</h1>
          <p className="scr-p">{challenge.evidenceOutcome}</p>
        </div>
        <Badge variant={passed ? 'proof' : 'gap'}>
          {passed ? 'ناجح' : 'لم يجتز'}
        </Badge>
      </div>

      <div className={`box ${styles.scorepanel}`}>
        <div className={styles.scorerow}>
          <h3 className={styles.sectiontitle}>الدرجة</h3>
          <span className={styles.scorenum} style={{ color: passed ? 'var(--accent)' : 'var(--danger)' }}>
            {score}%
          </span>
        </div>
        <Bar value={score} max={100} label={passed ? 'اجتاز التحدي' : 'لم يجتز التحدي'} variant={passed ? 'proof' : 'gap'} />
        {!passed && (
          <p className={styles.failnote} role="status">
            السجل محفوظ كـ "لم يجتز" — يمكنك إعادة المحاولة لاحقاً.
          </p>
        )}
      </div>

      <div className={styles.grid}>
        <div className={styles.main}>
          <div className={`box ${styles.panel}`}>
            <h3 className={styles.sectiontitle}>نقاط القوة</h3>
            <ul className={styles.list}>
              {strengths.map((s) => (
                <li key={s} className={styles.listitem}>
                  <span className={styles.check} aria-hidden="true">✓</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <div className={`box ${styles.panel}`}>
            <h3 className={styles.sectiontitle}>نقاط تحتاج تقوية</h3>
            <ul className={styles.list}>
              {weaknesses.map((w) => (
                <li key={w} className={styles.listitem}>
                  <span className={styles.cross} aria-hidden="true">✗</span>
                  {w}
                </li>
              ))}
            </ul>
          </div>

          <div className={`box ${styles.panel}`}>
            <h3 className={styles.sectiontitle}>معايير التقييم</h3>
            <div className={styles.criteria}>
              {challenge.evaluationCriteria.map((crit, idx) => {
                const critScore = passed ? 75 + (idx * 5) % 20 : 30 + (idx * 7) % 25;
                return (
                  <div key={crit} className={styles.crititem}>
                    <span className={styles.critname}>{crit}</span>
                    <Bar value={critScore} max={100} size="sm" variant={critScore >= 60 ? 'proof' : 'gap'} />
                    <span className={styles.critscore}>{critScore}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <aside className={styles.side}>
          <div className={`box ${styles.ctapanel}`}>
            <h3 className={styles.sectiontitle}>الدليل الناتج</h3>
            <p className={styles.text}>
              {passed
                ? `تم توليد دليل: "${challenge.evidenceOutcome}" — سيُضاف لملفك المهاري.`
                : 'لم يتم توليد دليل. أعد المحاولة بعد تقوية المهارات الناقصة.'}
            </p>
            {passed && (
              <button className="btn dark" style={{ width: '100%', marginTop: '1rem' }} onClick={() => navigate(ROUTES.MASTER_PROFILE)}>
                عرض الملف المهاري
              </button>
            )}
            <button className="btn ghost" style={{ width: '100%', marginTop: '0.6rem' }} onClick={() => navigate(ROUTES.CHALLENGES)}>
              تحديات أخرى
            </button>
          </div>

          <div className={`box ${styles.ctapanel}`}>
            <h3 className={styles.sectiontitle}>أثر القدرات</h3>
            <p className={styles.text}>
              {passed
                ? `هذا التحدي يقوي قدرتك في "${challenge.skill}" ويرفع مستواك المهاري.`
                : `إكمال هذا التحدي بنجاح سيقوي قدرتك في "${challenge.skill}".`}
            </p>
            <button className="btn ghost" style={{ width: '100%', marginTop: '1rem' }} onClick={() => navigate(ROUTES.GAPS)}>
              فجواتي المرتبطة
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
}

export default ChallengeResultPage;
