import { useMemo, useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QudraStore } from '../../services/store';
import { Challenge } from '../../services/types';
import { ROUTES } from '../../constants/routes';
import { EmptyState } from '../../components/ui/EmptyState';
import { useTimer } from '../../hooks/useTimer';
import styles from './ChallengeWorkspacePage.module.css';

type WorkspaceState = 'not_started' | 'active' | 'submitted' | 'expired';

export function ChallengeWorkspacePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const challenge = useMemo(
    () => QudraStore.getChallenges().find((c: Challenge) => c.id === id),
    [id],
  );

  const [state, setState] = useState<WorkspaceState>('not_started');
  const [submission, setSubmission] = useState('');
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const savedRef = useRef<string | null>(null);

  const totalSeconds = challenge ? parseInt(challenge.duration) * 3600 || 7200 : 7200;
  const { secondsLeft, isRunning, start, pause } = useTimer({ initialSeconds: totalSeconds });

  useEffect(() => {
    if (isRunning && secondsLeft === 0) {
      setState('expired');
    }
  }, [isRunning, secondsLeft]);

  const handleStart = () => {
    setState('active');
    start();
  };

  const handleSave = () => {
    savedRef.current = submission;
  };

  const handleSubmit = () => {
    setState('submitted');
    pause();
    setTimeout(() => {
      navigate(`/challenges/${challenge!.id}/result`, {
        state: { submission, passed: true },
      });
    }, 1500);
  };

  const handleExit = () => {
    setShowExitConfirm(false);
    navigate(ROUTES.CHALLENGES);
  };

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

  const minutes = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const timeStr = `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  const isLow = secondsLeft <= 60;

  return (
    <main id="main" className="wrap" tabIndex={-1} dir="rtl" style={{ padding: 'clamp(1.5rem,4vw,2.75rem) 0 5rem' }}>
      <div className={styles.headrow}>
        <div>
          <h1 className="scr-t">{challenge.title}</h1>
          <p className="scr-p">{challenge.description}</p>
        </div>
        <div className={styles.timerbox}>
          <span className={`${styles.timer} ${isLow ? styles.timerLow : ''}`} aria-live="polite">
            {timeStr}
          </span>
          <span className={styles.timerlabel}>الوقت المتبقي</span>
        </div>
      </div>

      <div className={`box ${styles.instructions}`}>
        <h3 className={styles.sectiontitle}>التعليمات</h3>
        <ul className={styles.list}>
          {challenge.requirements.map((req: string) => (
            <li key={req} className={styles.listitem}>
              <span className={styles.bullet} aria-hidden="true">•</span>
              {req}
            </li>
          ))}
        </ul>
      </div>

      {state === 'not_started' && (
        <div className={`box ${styles.startpanel}`}>
          <h3 className={styles.sectiontitle}>جاهز للبدء؟</h3>
          <p className={styles.text}>عند الضغط على "ابدأ"، سينطلق المؤقت ولن تتمكن من إيقافه.</p>
          <button className="btn dark" style={{ marginTop: '1rem' }} onClick={handleStart}>
            ابدأ التحدي
          </button>
        </div>
      )}

      {state === 'active' && (
        <div className={`box ${styles.workspace}`}>
          <h3 className={styles.sectiontitle}>مساحة العمل</h3>
          <textarea
            className={styles.textarea}
            value={submission}
            onChange={(e) => setSubmission(e.target.value)}
            placeholder="اكتب حلك هنا..."
            dir="rtl"
            rows={12}
            aria-label="مساحة كتابة الحل"
          />
          <div className={styles.actions}>
            <button className="btn ghost" onClick={handleSave}>حفظ</button>
            <button className="btn dark" onClick={handleSubmit} disabled={submission.trim().length < 10}>
              إرسال الحل
            </button>
            <button className="btn ghost" onClick={() => setShowExitConfirm(true)}>خروج</button>
          </div>
          {savedRef.current !== null && savedRef.current === submission && (
            <span className={styles.savednote} role="status">تم الحفظ</span>
          )}
        </div>
      )}

      {state === 'submitted' && (
        <div className={`box ${styles.submitting}`}>
          <h3 className={styles.sectiontitle}>جارٍ التقييم...</h3>
          <p className={styles.text}>يتم تحليل حلك ومطابقته بمعايير التقييم.</p>
        </div>
      )}

      {state === 'expired' && (
        <div className={`box ${styles.expired}`}>
          <h3 className={styles.sectiontitle}>انتهى الوقت</h3>
          <p className={styles.text}>انتهى الوقت المخصص للتحدي. يتم تقييم ما كتبته.</p>
          <button className="btn dark" style={{ marginTop: '1rem' }} onClick={() => navigate(`/challenges/${challenge.id}/result`, { state: { submission, passed: false } })}>
            عرض النتيجة
          </button>
        </div>
      )}

      {showExitConfirm && (
        <div className={styles.overlay} onClick={() => setShowExitConfirm(false)}>
          <div className={`box ${styles.confirmbox}`} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.sectiontitle}>تأكيد الخروج</h3>
            <p className={styles.text}>سيتم فقدان ما لم تحفظه. هل تريد المتابعة؟</p>
            <div className={styles.actions}>
              <button className="btn danger" onClick={handleExit}>نعم، خروج</button>
              <button className="btn ghost" onClick={() => setShowExitConfirm(false)}>إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default ChallengeWorkspacePage;
