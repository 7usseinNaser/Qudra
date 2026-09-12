import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { Badge } from '../../components/ui/Badge';
import { Bar } from '../../components/ui/Bar';
import styles from './EvidenceReviewPage.module.css';

interface EvidenceReviewItem {
  id: string;
  source: string;
  claim: string;
  extractedEvidence: string;
  confidence: number;
  signals: string[];
  decision: 'pending' | 'approved' | 'rejected';
}

const ITEMS: EvidenceReviewItem[] = [
  {
    id: 'e1',
    source: 'github.com/lina/inventory-api',
    claim: 'PostgreSQL — ADVANCED',
    extractedEvidence: '9 أدلة موثّقة، فهارس محسّنة، استعلامات معقدة',
    confidence: 92,
    signals: ['كود نظيف', 'اختبارات شاملة', 'توثيق واضح'],
    decision: 'pending',
  },
  {
    id: 'e2',
    source: 'github.com/mohammed/queue-service',
    claim: 'Node.js — ADVANCED',
    extractedEvidence: '7 أدلة، نظام طوابير غير متزامن',
    confidence: 85,
    signals: ['أداء جيد', 'بنية سليمة'],
    decision: 'pending',
  },
  {
    id: 'e3',
    source: 'بلاغ على دليل مشبوه',
    claim: 'Python — EXPERT',
    extractedEvidence: 'دليل واحد فقط، كود منسوخ من مصدر خارجي',
    confidence: 30,
    signals: ['كود مشبوه', 'انتحال محتمل'],
    decision: 'pending',
  },
];

export function EvidenceReviewPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState(ITEMS);

  const handleDecision = (id: string, decision: 'approved' | 'rejected') => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, decision } : i)));
  };

  return (
    <main id="main" className="wrap" tabIndex={-1} dir="rtl" style={{ padding: 'clamp(1.5rem,4vw,2.75rem) 0 5rem' }}>
      <button className="btn ghost" onClick={() => navigate(ROUTES.ADMIN_DASHBOARD)} style={{ marginBottom: '0.8rem' }}>
        ← لوحة المشرف
      </button>
      <h1 className="scr-t">مراجعة الأدلة</h1>
      <p className="scr-p">مراجعة يدوية للأدلة المشبوهة والبلاغات.</p>

      <div className={styles.list}>
        {items.map((item) => (
          <div key={item.id} className={`box ${styles.card}`}>
            <div className={styles.cardHead}>
              <span className={styles.source}>{item.source}</span>
              <Badge variant={item.confidence >= 70 ? 'proof' : 'gap'}>
                الثقة: {item.confidence}%
              </Badge>
            </div>

            <div className={styles.cardBody}>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>الادّعاء:</span>
                <span className={styles.fieldValue}>{item.claim}</span>
              </div>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>الدليل المستخرج:</span>
                <span className={styles.fieldValue}>{item.extractedEvidence}</span>
              </div>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>الإشارات:</span>
                <div className={styles.signals}>
                  {item.signals.map((s) => (
                    <span key={s} className={styles.signal}>{s}</span>
                  ))}
                </div>
              </div>
              <div className={styles.confidenceRow}>
                <span className={styles.confidenceLabel}>درجة الثقة</span>
                <Bar value={item.confidence} max={100} size="sm" variant={item.confidence >= 70 ? 'proof' : 'gap'} className={styles.confidenceBar} />
                <span className={`${styles.confidenceVal} num`}>{item.confidence}%</span>
              </div>
            </div>

            <div className={styles.cardActions}>
              {item.decision === 'pending' ? (
                <>
                  <button className="btn sm" onClick={() => handleDecision(item.id, 'approved')}>قبول</button>
                  <button className="btn ghost sm" onClick={() => handleDecision(item.id, 'rejected')}>رفض</button>
                </>
              ) : (
                <Badge variant={item.decision === 'approved' ? 'proof' : 'neutral'}>
                  {item.decision === 'approved' ? '✓ مقبول' : 'مرفوض'}
                </Badge>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default EvidenceReviewPage;
