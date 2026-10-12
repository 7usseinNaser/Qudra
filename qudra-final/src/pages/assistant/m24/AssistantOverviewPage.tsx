import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ExplainDrawer } from '../../../components/patterns/ExplainDrawer';
import styles from './AssistantM24.module.css';

interface ExplanationRecord {
  id: string;
  topic: string;
  targetType: 'CAPABILITY' | 'MATCH' | 'EVIDENCE';
  confidence: number;
  conclusion: string;
  inferences: string[];
  unknowns: string[];
  evidence: Array<{ id: string; title: string; type: string; status: string; strength: number }>;
}

const SAMPLE_EXPLANATIONS: ExplanationRecord[] = [
  {
    id: 'exp-01',
    topic: 'تفسير تصنيف مستوى الكفاءة: معمارية الأنظمة الموزعة (Senior Distributed Architect)',
    targetType: 'CAPABILITY',
    confidence: 94,
    conclusion: 'تم منح المستوى المتقدم بناءً على 3 أدلة عملية ومشاريع بورتفوليو معتمدة تتضمن معالجة التنافسية وتوزيع البيانات.',
    inferences: [
      'استخدام آليات قفل متقدمة لحماية الاتساق المالي في مشروع FinStream.',
      'اجتياز اختبار التحديات البرمجية بتقدير ممتاز وزمن استجابة منخفض.',
      'التوثيق المعماري الشامل في مستودعات GitHub المربوطة.'
    ],
    unknowns: [
      'حجم الفريق البرمجي الفعلي الذي شارك في تطوير الوحدات الطرفية.',
      'أداء النظام تحت ضغط ترافيك يفوق 50,000 استدعاء متزامن في الثانية.'
    ],
    evidence: [
      { id: 'ev-1', title: 'FinStream Financial Core', type: 'PROJECT', status: 'VERIFIED', strength: 95 },
      { id: 'ev-2', title: 'Practical Async Endpoint Challenge', type: 'CHALLENGE', status: 'CLAIMED', strength: 96 }
    ]
  },
  {
    id: 'exp-02',
    topic: 'تفسير درجة المطابقة (92%) مع فرصة: كبير مهندسي الحلول السحابية',
    targetType: 'MATCH',
    confidence: 88,
    conclusion: 'تطابق عالي في معايير الباك إند والبنى الموزعة، مع وجود فجوة تدريبية طفيفة في تقنيات Kubernetes Service Mesh.',
    inferences: [
      'المهارات الأساسية المطلوبة مطابقة بنسبة 100% (FastAPI, Python, Databases).',
      'المشاريع البرمجية تثبت جاهزية هندسية عالية لإدارة الأنظمة الكبيرة.'
    ],
    unknowns: [
      'مدى توفر المرشح للعمل بنظام الورديات الطارئة (On-call rotation).'
    ],
    evidence: [
      { id: 'ev-3', title: 'Cloud Monitor Dashboard', type: 'PROJECT', status: 'VERIFIED', strength: 90 }
    ]
  }
];

export const AssistantOverviewPage: React.FC = () => {
  const [selectedExp, setSelectedExp] = useState<ExplanationRecord | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleOpenExplain = (item: ExplanationRecord) => {
    setSelectedExp(item);
    setIsDrawerOpen(true);
  };

  return (
    <div className={styles.container} data-testid="screen-q-0921">
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <span className={styles.screenBadge}>Q-0921 · مركز التفسير والشفافية</span>
          <h1 className={styles.title}>المساعد الذكي وتفسير القرارات (Explainability)</h1>
          <p className={styles.subtitle}>
            كل قرار وتصنيف واقتراح يولده الذكاء الاصطناعي موثق بنسبة الثقة، الأدلة المسندة، والمجاهيل لضمان العدالة الكاملة.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <Link to="/assistant/empty" className={styles.secondaryBtn}>
            حالة الفراغ
          </Link>
          <Link to="/assistant/error" className={styles.secondaryBtn}>
            حالة الخطأ
          </Link>
          <Link to="/assistant/dispute" className={styles.primaryBtn} data-testid="new-dispute-btn">
            ⚖️ تقديم اعتراض على قرار (Dispute AC-14)
          </Link>
        </div>
      </div>

      <div className={styles.statsBar}>
        <div className={styles.statCard}>
          <div className={styles.statVal}>91%</div>
          <div className={styles.statLabel}>متوسط نسبة الثقة واليقين</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statVal}>100%</div>
          <div className={styles.statLabel}>قرارات قابلة للتفسير الكامل</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statVal}>1</div>
          <div className={styles.statLabel}>اعتراضات قيد المراجعة البشرية</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statVal}>ExplainDrawer</div>
          <div className={styles.statLabel}>محرك التفسير الموحد النشط</div>
        </div>
      </div>

      <div className={styles.grid}>
        {SAMPLE_EXPLANATIONS.map((item) => (
          <div key={item.id} className={styles.card}>
            <div>
              <div className={styles.cardHeader}>
                <span className={styles.confidencePill}>
                  يقين: {item.confidence}%
                </span>
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
                  {item.targetType}
                </span>
              </div>
              <h3 className={styles.cardTitle}>{item.topic}</h3>
              <p className={styles.cardDesc}>{item.conclusion}</p>
            </div>

            <div className={styles.cardFooter}>
              <button
                type="button"
                className={styles.primaryBtn}
                onClick={() => handleOpenExplain(item)}
                style={{ flex: 1, justifyContent: 'center' }}
                data-testid="open-drawer-btn"
              >
                فتح درج التفسير الموحد 🔍
              </button>
              <Link to={`/assistant/${item.id}`} className={styles.secondaryBtn}>
                التفاصيل
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Unified ExplainDrawer instance */}
      {selectedExp && (
        <ExplainDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          title={selectedExp.topic}
          conclusion={selectedExp.conclusion}
          evidence={selectedExp.evidence}
          inferences={selectedExp.inferences}
          confidence={selectedExp.confidence}
          unknowns={selectedExp.unknowns}
          nextAction={{
            label: '⚖️ تقديم اعتراض على هذا الاستنتاج (Dispute)',
            href: `/assistant/dispute?targetId=${selectedExp.id}&type=${selectedExp.targetType}`
          }}
        />
      )}
    </div>
  );
};
