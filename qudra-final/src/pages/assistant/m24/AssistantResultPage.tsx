import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ExplainDrawer } from '../../../components/patterns/ExplainDrawer';
import styles from './AssistantM24.module.css';

interface ResultData {
  topic: string;
  targetType: string;
  confidence: number;
  conclusion: string;
  inferences: string[];
  unknowns: string[];
  evidence: Array<{ id: string; title: string; type: string; status: string; strength: number }>;
}

export const AssistantResultPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const topic = searchParams.get('topic') || 'تفسير درجة المطابقة مع فرصة هندسية';
  const targetType = searchParams.get('type') || 'MATCH';
  const confidence = parseInt(searchParams.get('confidence') || '88', 10);

  const mockData: ResultData = {
    topic,
    targetType,
    confidence,
    conclusion: 'تطابق عالي في معايير الباك إند والبنى الموزعة، مع وجود فجوة تدريبية طفيفة في تقنيات Kubernetes Service Mesh.',
    inferences: [
      'المهارات الأساسية المطلوبة مطابقة بنسبة 100% (FastAPI, Python, Databases).',
      'المشاريع البرمجية تثبت جاهزية هندسية عالية لإدارة الأنظمة الكبيرة.',
      'الأدلة العملية تظهر قدرة على التعامل مع التنافسية العالية واتساق البيانات.',
    ],
    unknowns: [
      'مدى توفر المرشح للعمل بنظام الورديات الطارئة (On-call rotation).',
      'خبرة المرشح في بيئات Kubernetes الإنتاجية متعددة المناطق.',
    ],
    evidence: [
      { id: 'ev-1', title: 'FinStream Financial Core', type: 'PROJECT', status: 'VERIFIED', strength: 95 },
      { id: 'ev-2', title: 'Async Endpoint Challenge', type: 'CHALLENGE', status: 'CLAIMED', strength: 96 },
      { id: 'ev-3', title: 'Cloud Monitor Dashboard', type: 'PROJECT', status: 'VERIFIED', strength: 90 },
    ],
  };

  return (
    <div className={styles.container} data-testid="screen-q-0927">
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <span className={styles.screenBadge}>Q-0927 · نتيجة التفسير</span>
          <h1 className={styles.title}>{topic}</h1>
          <p className={styles.subtitle}>
            تم توليد التفسير الكامل مع الأدلة والاستنتاجات والمجاهيل. يمكن فتح درج التفسير الموحد للمراجعة التفصيلية.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/assistant" className={styles.secondaryBtn}>
            مركز التفسير
          </Link>
          <Link
            to={`/assistant/dispute?targetId=exp-result&type=${targetType}`}
            className={styles.primaryBtn}
            data-testid="dispute-link-btn"
          >
            ⚖️ تقديم اعتراض (Dispute)
          </Link>
        </div>
      </div>

      <div className={styles.statsBar}>
        <div className={styles.statCard}>
          <div className={styles.statVal} style={{ color: '#16a34a' }}>{confidence}%</div>
          <div className={styles.statLabel}>درجة اليقين واليقين</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statVal}>{mockData.evidence.length}</div>
          <div className={styles.statLabel}>أدلة مسندة</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statVal}>{mockData.inferences.length}</div>
          <div className={styles.statLabel}>استنتاجات هندسية</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statVal}>{mockData.unknowns.length}</div>
          <div className={styles.statLabel}>مجاهيل موثقة</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginTop: '1rem' }}>
        <div className={styles.statCard}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>الاستنتاج العام</h3>
          <p style={{ lineHeight: 1.7, color: '#334155' }}>{mockData.conclusion}</p>

          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '1.5rem', marginBottom: '0.75rem' }}>الاستنتاجات التفصيلية</h3>
          <ul style={{ paddingRight: '1.25rem', lineHeight: 1.8, color: '#334155' }}>
            {mockData.inferences.map((inf, i) => (
              <li key={i}>{inf}</li>
            ))}
          </ul>

          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '1.5rem', marginBottom: '0.75rem' }}>المجاهيل / ما لا نعلمه</h3>
          <ul style={{ paddingRight: '1.25rem', lineHeight: 1.8, color: '#334155' }}>
            {mockData.unknowns.map((u, i) => (
              <li key={i} style={{ color: '#f59e0b' }}>{u}</li>
            ))}
          </ul>
        </div>

        <div className={styles.statCard}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>الأدلة المسندة ({mockData.evidence.length})</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {mockData.evidence.map((e) => (
              <div
                key={e.id}
                style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{e.title}</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  {e.type} • {e.status} • قوة الدليل: {e.strength}%
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            className={styles.primaryBtn}
            style={{ width: '100%', justifyContent: 'center', marginTop: '1.5rem' }}
            onClick={() => setIsDrawerOpen(true)}
            data-testid="open-drawer-btn"
          >
            فتح درج التفسير الموحد 📖
          </button>
        </div>
      </div>

      <ExplainDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={mockData.topic}
        conclusion={mockData.conclusion}
        evidence={mockData.evidence}
        inferences={mockData.inferences}
        confidence={mockData.confidence}
        unknowns={mockData.unknowns}
        nextAction={{
          label: '⚖️ تقديم اعتراض على هذا الاستنتاج (Dispute)',
          href: `/assistant/dispute?targetId=exp-result&type=${targetType}`,
        }}
      />
    </div>
  );
};