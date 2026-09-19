import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Play,
  Send,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  FileCode,
  Terminal,
  Cpu,
  Award
} from 'lucide-react';
import { ROUTES } from '../../constants/routes';
import {
  ChallengesService,
  ChallengeDetail,
  SubmissionResult
} from '../../services/challenges.service';
import { Button } from '../../components/ui/Button';
import styles from './ChallengeSandboxPage.module.css';

export const ChallengeSandboxPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [challenge, setChallenge] = useState<ChallengeDetail | null>(null);
  const [language, setLanguage] = useState<'python' | 'typescript'>('python');
  const [code, setCode] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testResult, setTestResult] = useState<SubmissionResult | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    ChallengesService.getById(id || 'chal-backend-01').then(data => {
      if (data) {
        setChallenge(data);
        setCode(data.starterCode[language] || data.starterCode.python || '');
      }
    });
  }, [id]);

  const handleLanguageChange = (newLang: 'python' | 'typescript') => {
    setLanguage(newLang);
    if (challenge) {
      setCode(challenge.starterCode[newLang] || '');
    }
  };

  const handleRunTests = async () => {
    if (!challenge) return;
    setIsRunning(true);
    try {
      const res = await ChallengesService.runTests(challenge.id, code, language);
      setTestResult(res);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!challenge) return;
    setIsSubmitting(true);
    try {
      const res = await ChallengesService.submitChallenge(challenge.id, { code, language });
      setTestResult(res);
      setShowCelebration(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!challenge) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center', color: '#fff' }} dir="rtl">
        <p>جاري تحميل بيئة التحدي البرمجي...</p>
      </div>
    );
  }

  const linesCount = Math.max(code.split('\n').length, 25);
  const lineNumbers = Array.from({ length: linesCount }, (_, i) => i + 1);

  return (
    <div className={styles.container} dir="rtl">
      {/* Top Bar */}
      <header className={styles.topBar}>
        <div className={styles.titleArea}>
          <button
            className={styles.backBtn}
            onClick={() => navigate(ROUTES.CHALLENGES)}
            title="العودة لبنك التحديات"
          >
            <ArrowRight size={14} /> التحديات
          </button>
          <h1 className={styles.challengeTitle}>{challenge.title}</h1>
          <div className={styles.metaPills}>
            <span className={`${styles.badge} ${styles.badgeDiff}`}>{challenge.difficulty}</span>
            <span className={`${styles.badge} ${styles.badgeWeight}`}>
              {challenge.practicalWeight}% وزن عملي (Practical)
            </span>
          </div>
        </div>

        <div className={styles.actionsArea}>
          <select
            className={styles.langSelect}
            value={language}
            onChange={e => handleLanguageChange(e.target.value as 'python' | 'typescript')}
          >
            <option value="python">Python 3.12 (Async)</option>
            <option value="typescript">TypeScript 5.4</option>
          </select>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleRunTests}
            disabled={isRunning || isSubmitting}
            leftIcon={<Play size={14} />}
          >
            {isRunning ? 'جاري الفحص...' : 'تشغيل الاختبارات'}
          </Button>

          <Button
            variant="proof"
            size="sm"
            onClick={handleSubmit}
            disabled={isRunning || isSubmitting}
            leftIcon={<Send size={14} />}
          >
            {isSubmitting ? 'جاري التحقق والتسليم...' : 'تسليم الحل وتوثيق القدرة'}
          </Button>
        </div>
      </header>

      {/* Main Split Workspace */}
      <div className={styles.workspace}>
        {/* Right Pane: Challenge Specifications */}
        <div className={styles.detailsPane}>
          <div className={styles.sectionBlock}>
            <h3>
              <FileCode size={16} /> وصف المسألة وسياق العمل
            </h3>
            <p className={styles.descText}>{challenge.description}</p>
          </div>

          <div className={styles.sectionBlock}>
            <h3>
              <Cpu size={16} /> المطلوب تنفيذه برمجياً
            </h3>
            <ul className={styles.instructionList}>
              {challenge.instructions.map((inst, idx) => (
                <li key={idx}>{inst}</li>
              ))}
            </ul>
          </div>

          <div className={styles.sectionBlock}>
            <h3>
              <Clock size={16} /> القيود والمعايير الهندسية (Constraints)
            </h3>
            <ul className={styles.constraintsList}>
              {challenge.constraints.map((c, idx) => (
                <li key={idx}>{c}</li>
              ))}
            </ul>
          </div>

          <div className={styles.sectionBlock}>
            <h3>
              <ShieldCheck size={16} /> الأثر المباشر على جواز القدرات
            </h3>
            <div style={{
              background: 'rgba(0, 184, 184, 0.08)',
              border: '1px solid rgba(0, 184, 184, 0.25)',
              borderRadius: '10px',
              padding: '0.85rem',
              fontSize: '0.84rem',
              color: 'var(--ink-2)'
            }}>
              حل هذا التحدي يحول مهارة <strong>{challenge.capabilityName}</strong> من ادعاء ذاتي إلى قدرة مثبتة رسمياً (Proven ✓) مع إضافة توقيع مشفر في جواز القدرات.
            </div>
          </div>
        </div>

        {/* Left Pane: Code Editor & Terminal */}
        <div className={styles.editorPane}>
          <div className={styles.editorHeader}>
            <span>محرر الكود الحي ({language.toUpperCase()})</span>
            <span style={{ fontSize: '0.75rem', color: '#00B8B8' }}>بيئة معزولة Sandbox ✓</span>
          </div>

          <div className={styles.codeAreaWrapper}>
            <div className={styles.lineNumbers}>
              {lineNumbers.map(n => (
                <div key={n}>{n}</div>
              ))}
            </div>
            <textarea
              className={styles.codeTextarea}
              value={code}
              onChange={e => setCode(e.target.value)}
              spellCheck={false}
              autoCapitalize="none"
              autoComplete="off"
            />
          </div>

          {/* Test Results Terminal Bottom Pane */}
          <div className={styles.terminalPane}>
            <div className={styles.terminalHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Terminal size={15} style={{ color: '#00B8B8' }} />
                <span>منصة الاختبارات ومخرجات الكود (Test Runner)</span>
              </div>
              {testResult && (
                <span style={{ color: '#10B981', fontSize: '0.78rem' }}>
                  اجتاز {testResult.results.filter(r => r.passed).length} من {testResult.results.length} اختبارات ✓
                </span>
              )}
            </div>

            <div className={styles.testResultsGrid}>
              {!testResult && !isRunning && (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--ink-3)' }}>
                  اضغط على <strong>"تشغيل الاختبارات"</strong> للتحقق من كودك واختبار حالات المدخلات والمخرجات.
                </div>
              )}

              {isRunning && (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#00B8B8' }}>
                  جاري بناء واختبار الكود عبر بيئة التشغيل المعزولة...
                </div>
              )}

              {testResult && testResult.results.map((r, idx) => (
                <div
                  key={idx}
                  className={`${styles.testCaseCard} ${r.passed ? styles.passed : styles.failed}`}
                >
                  <div className={styles.testCaseTitle}>
                    {r.passed ? (
                      <CheckCircle2 size={16} style={{ color: '#10B981' }} />
                    ) : (
                      <XCircle size={16} style={{ color: '#EF4444' }} />
                    )}
                    <span>{r.name}</span>
                  </div>

                  <div className={styles.testCaseMeta}>
                    <span>زمن التنفيذ: {r.executionTimeMs}ms</span>
                    <span style={{ color: r.passed ? '#10B981' : '#EF4444' }}>
                      {r.passed ? 'ناجح ✓' : 'فشل'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Success Celebration Modal */}
      {showCelebration && testResult && (
        <div className={styles.modalOverlay}>
          <div className={styles.celebrationCard}>
            <div className={styles.celebrationIcon}>
              <Award size={32} />
            </div>

            <h2 className={styles.celebrationTitle}>تم إثبات قدرتك البرمجية بنجاح!</h2>
            <p className={styles.celebrationDesc}>
              تهانينا! لقد اجتزت التحدي بنجاح بنسبة 100%. تم توثيق كودك، وتحولت مهارة{' '}
              <strong style={{ color: '#00B8B8' }}>{challenge.capabilityName}</strong> إلى مهارة مثبتة رسمياً (Proven Capability).
            </p>

            <div className={styles.scoreImpactBox}>
              <div className={styles.impactMetric}>
                <span className={styles.impactVal}>+40%</span>
                <span className={styles.impactLabel}>رصيد Practical</span>
              </div>
              <div className={styles.impactMetric}>
                <span className={styles.impactVal}>Proven ✓</span>
                <span className={styles.impactLabel}>حالة المهارة</span>
              </div>
              <div className={styles.impactMetric}>
                <span className={styles.impactVal}>100 / 100</span>
                <span className={styles.impactLabel}>نقاط التقييم</span>
              </div>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              padding: '0.6rem 0.8rem',
              borderRadius: '8px',
              fontFamily: 'monospace',
              fontSize: '0.72rem',
              color: 'var(--ink-2)',
              marginBottom: '1.5rem',
              wordBreak: 'break-all'
            }}>
              بصمة الإثبات الرقمي: {testResult.verifiableHash}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <Button
                variant="proof"
                onClick={() => navigate('/profile/passport')}
                leftIcon={<Sparkles size={16} />}
              >
                عرض جواز القدرات المحدث
              </Button>
              <Button
                variant="secondary"
                onClick={() => navigate(ROUTES.PROFILE_EDIT)}
              >
                البروفايل المهني
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
