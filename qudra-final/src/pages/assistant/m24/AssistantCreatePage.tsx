import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExplainDrawer } from '../../../components/patterns/ExplainDrawer';
import styles from './AssistantM24.module.css';

type QueryType = 'CAPABILITY' | 'MATCH' | 'EVIDENCE' | 'TEAM' | 'TASK_ALLOCATION';

interface QueryResult {
  id: string;
  topic: string;
  targetType: QueryType;
  confidence: number;
  conclusion: string;
  inferences: string[];
  unknowns: string[];
  evidence: Array<{ id: string; title: string; type: string; status: string; strength: number }>;
  nextAction?: { label: string; href?: string };
}

export const AssistantCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [queryType, setQueryType] = useState<QueryType>('CAPABILITY');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<QueryResult | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const queryTypes: { value: QueryType; label: string }[] = [
    { value: 'CAPABILITY', label: 'تصنيف الكفاءة (Capability Classification)' },
    { value: 'MATCH', label: 'درجة المطابقة (Match Score)' },
    { value: 'EVIDENCE', label: 'قوة الدليل (Evidence Strength)' },
    { value: 'TEAM', label: 'تركيبة الفريق (Team Composition)' },
    { value: 'TASK_ALLOCATION', label: 'تخصيص المهام (Task Allocation)' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsProcessing(true);
    setTimeout(() => {
      const mockResult: QueryResult = {
        id: `exp-${Date.now()}`,
        topic: `تفسير: ${query}`,
        targetType: queryType,
        confidence: 87,
        conclusion: `بناءً على تحليل الأدلة المتاحة، تم تحديد النتيجة بـ ${87}% ثقة.`,
        inferences: [
          'الأدلة العملية تظهر اتساقاً عالياً في الأداء الهندسي.',
          'المشاريع المسندة تدعم الاستنتاج بمستوى تحقق Tier 2 فأعلى.',
        ],
        unknowns: [
          'لم يتم تقييم الأداء تحت ضغط إنتاجي حقيقي.',
          'حجم الفريق الفعلي في المشاريع المرجعية غير موثق بالكامل.',
        ],
        evidence: [
          { id: 'ev-1', title: 'FinStream Core', type: 'PROJECT', status: 'VERIFIED', strength: 95 },
          { id: 'ev-2', title: 'Async Challenge', type: 'CHALLENGE', status: 'CLAIMED', strength: 92 },
        ],
        nextAction: {
          label: '⚖️ تقديم اعتراض على هذا الاستنتاج (Dispute)',
          href: `/assistant/dispute?targetId=exp-${Date.now()}&type=${queryType}`,
        },
      };
      setResult(mockResult);
      setIsProcessing(false);
      setIsDrawerOpen(true);
    }, 1500);
  };

  return (
    <div className={styles.container} data-testid="screen-q-0924">
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <span className={styles.screenBadge}>Q-0924 · استفسار وتفسير جديد</span>
          <h1 className={styles.title}>استفسار المساعد الذكي وتوليد التفسير</h1>
          <p className={styles.subtitle}>
            اطرح سؤالاً حول أي قرار للذكاء الاصطناعي واحصل على تفسير كامل مع الأدلة، الاستنتاجات، المجاهيل، وحق الاعتراض.
          </p>
        </div>
      </div>

      <div className={styles.formCard}>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label}>نوع الاستفسار *</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {queryTypes.map((qt) => (
                <button
                  key={qt.value}
                  type="button"
                  className={`${styles.filterBtn} ${queryType === qt.value ? styles.filterBtnActive : ''}`}
                  onClick={() => setQueryType(qt.value)}
                  style={{ flex: 1, minWidth: '180px' }}
                >
                  {qt.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>سؤالك أو الاستفسار المراد تفسيره *</label>
            <textarea
              className={styles.textarea}
              rows={4}
              placeholder="مثال: لماذا تم تصنيف قدرتي في 'معمارية الأنظمة الموزعة' بمستوى متقدم؟ ما هي الأدلة التي اعتمد عليها الذكاء الاصطناعي؟"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              required
              data-testid="query-input"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={() => navigate('/assistant')}
            >
              إلغاء
            </button>
            <button
              type="submit"
              className={styles.primaryBtn}
              disabled={isProcessing || !query.trim()}
              data-testid="submit-query-btn"
            >
              {isProcessing ? '⏳ جاري توليد التفسير...' : 'توليد التفسير الموحد 🔍'}
            </button>
          </div>
        </form>
      </div>

      {result && (
        <ExplainDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          title={result.topic}
          conclusion={result.conclusion}
          evidence={result.evidence}
          inferences={result.inferences}
          confidence={result.confidence}
          unknowns={result.unknowns}
          nextAction={result.nextAction}
        />
      )}
    </div>
  );
};