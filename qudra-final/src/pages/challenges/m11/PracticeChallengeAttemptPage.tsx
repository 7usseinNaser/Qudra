import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './PracticeChallenges.module.css';

const DEFAULT_CODE = `from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
import asyncio

app = FastAPI(title="Async Stream Processor")

# اكتب حلك الهندسي هنا:
async def process_data_stream(payload: dict, session: AsyncSession) -> dict:
    \"\"\"
    معالجة التدفق غير المتزامن بكفاءة وأمان
    \"\"\"
    if not payload.get("items"):
        raise HTTPException(status_code=400, detail="Empty payload")
    
    # محاكاة المعالجة المتزامنة فائقة السرعة
    processed_count = len(payload["items"])
    return {
        "status": "PROCESSED",
        "count": processed_count,
        "is_safe": True
    }
`;

export const PracticeChallengeAttemptPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const challengeId = id || 'ch-01';

  const [code, setCode] = useState(DEFAULT_CODE);
  const [consoleLog, setConsoleLog] = useState<string>('جاهز لتشغيل الاختبارات التجريبية...\nاضغط على "تشغيل الاختبارات" للتحقق الأولي.');
  const [isRunning, setIsRunning] = useState(false);
  const [testPassed, setTestPassed] = useState<boolean | null>(null);

  const handleRunTests = () => {
    setIsRunning(true);
    setConsoleLog('⚡ جاري تشغيل بيئة العزل (Sandbox Container)...\n✓ تحميل الاعتماديات: FastAPI, SQLAlchemy Async, Pytest\n✓ تشغيل 4 حالات اختبار...');
    setTimeout(() => {
      setIsRunning(false);
      setTestPassed(true);
      setConsoleLog((prev) => prev + '\n\n[PASS] Test 1: test_single_request -> 200 OK (12ms)\n[PASS] Test 2: test_concurrency_500 -> 0 dropped (48ms)\n[PASS] Test 3: test_error_cleanup -> Connection pool healthy\n[PASS] Test 4: test_type_integrity -> Strict types enforced\n\n🎉 جميع الاختبارات الأولية اجتازت بنجاح! يمكنك الآن تسليم الحل.');
    }, 1200);
  };

  const handleSubmit = () => {
    navigate(`/challenges/practice/${challengeId}/result?status=claimed&score=96`);
  };

  return (
    <div className={styles.container} data-testid="screen-q-0404">
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <span className={styles.screenBadge}>Q-0404 · بيئة المحاولة والتنفيذ</span>
          <h1 className={styles.title}>تطوير نقطة نهاية غير متزامنة (Async Endpoint)</h1>
          <p className={styles.subtitle}>
            محرر الأكواد الحي مع بيئة التحقق التلقائي والقيود الزمنية.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            type="button"
            className={styles.secondaryBtn}
            onClick={handleRunTests}
            disabled={isRunning}
            data-testid="run-tests-btn"
          >
            {isRunning ? '⏳ جاري الاختبار...' : '▶ تشغيل الاختبارات'}
          </button>
          <button
            type="button"
            className={styles.primaryBtn}
            onClick={handleSubmit}
            data-testid="submit-solution-btn"
          >
            تسليم الحل للتقييم 🚀
          </button>
        </div>
      </div>

      <div className={styles.editorWorkspace}>
        {/* Panel 1: Code Editor */}
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <span>محرر الكود: main.py</span>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Python 3.12 • Async Engine</span>
          </div>
          <textarea
            className={styles.codeArea}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            data-testid="code-editor-input"
          />
        </div>

        {/* Panel 2: Specs & Test Output */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className={styles.panel} style={{ flex: 1 }}>
            <div className={styles.panelHeader}>
              <span>مخرجات الاختبار ووحدة التحكم (Terminal Output)</span>
              {testPassed && (
                <span style={{ color: '#16a34a', fontWeight: 700, fontSize: '0.8rem' }}>
                  ✓ 4/4 Passed
                </span>
              )}
            </div>
            <pre className={styles.consoleOutput}>{consoleLog}</pre>
          </div>

          <div className={styles.statCard}>
            <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.95rem', fontWeight: 700 }}>تعليمات هامة:</h4>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569', lineHeight: 1.6 }}>
              تأكد من الالتزام بالمعايير غير المتزامنة وتجنب أي عمليات I/O متزامنة قد تتسبب في بطء الاستجابة.
              عند التسليم، سيتم توليد نتيجة فحص آلية وتسجيل الدليل كـ <strong>CLAIMED</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
