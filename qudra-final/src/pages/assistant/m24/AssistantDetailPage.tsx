import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ExplainDrawer } from '../../../components/patterns/ExplainDrawer';
import styles from './AssistantM24.module.css';

export const AssistantDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const decisionId = id || 'exp-01';
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className={styles.container} data-testid="screen-q-0923">
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <span className={styles.screenBadge}>Q-0923 · تفاصيل التفسير</span>
          <h1 className={styles.title}>تفسير تقييم الكفاءة الهندسية المتقدمة</h1>
          <p className={styles.subtitle}>
            المعرف: {decisionId} • نسبة الثقة واليقين: 94% • نوع الكيان: كفاءة برمجية (CAPABILITY)
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            type="button"
            className={styles.secondaryBtn}
            onClick={() => setIsDrawerOpen(true)}
            data-testid="open-drawer-btn"
          >
            عرض درج التفسير الموحد 📖
          </button>
          <Link
            to={`/assistant/dispute?targetId=${decisionId}&type=CAPABILITY`}
            className={styles.primaryBtn}
            data-testid="dispute-link-btn"
          >
            ⚖️ تقديم اعتراض على التقييم (Dispute)
          </Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className={styles.statCard}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }}>الاستنتاجات الهندسية والتحليل</h3>
            <p style={{ lineHeight: 1.7, color: '#334155' }}>
              بناءً على تحليل الشيفرة المصدرية لمشروع FinStream واجتياز تحدي المسارات غير المتزامنة، خلص نموذج الذكاء الاصطناعي إلى امتلاك المهندس خبرة عملية راسخة في التعامل مع تحديات التزامن والاتساق الموزع.
            </p>
          </div>

          <div className={styles.statCard}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }}>المجاهيل وما لا نعلمه (Unknowns)</h3>
            <ul style={{ paddingRight: '1.25rem', lineHeight: 1.8, color: '#334155' }}>
              <li>لم يتم اختبار قدرة المرشح على حل مشاكل الانقسام الشبكي الحاد (Split-Brain scenarios).</li>
              <li>درجة الاعتماد على مكتبات خارجية مقابل الكود المخصص المكتوب ذاتياً.</li>
            </ul>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className={styles.statCard}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>الأدلة المسندة (2)</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>FinStream Core</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>مشروع بورتفوليو • قوة الدليل: 95%</div>
              </div>
              <div style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Async Endpoint Challenge</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>تحدٍ عملي • حالة: CLAIMED • قوة: 96%</div>
              </div>
            </div>
          </div>

          <div className={styles.statCard}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>ضمان حق الاعتراض</h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.6 }}>
              إذا كنت ترى أن هذا التفسير أو التقييم يغفل أدلة أخرى لم تُؤخذ بالحسبان، يمكنك تقديم اعتراض رسمي يخضع للمراجعة البشرية المباشرة.
            </p>
          </div>
        </div>
      </div>

      <ExplainDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="تفسير تقييم الكفاءة الهندسية المتقدمة"
        conclusion="تم منح المستوى المتقدم بناءً على 3 أدلة عملية ومشاريع بورتفوليو معتمدة تتضمن معالجة التنافسية وتوزيع البيانات."
        confidence={94}
        inferences={[
          'استخدام آليات قفل متقدمة لحماية الاتساق المالي في مشروع FinStream.',
          'اجتياز اختبار التحديات البرمجية بتقدير ممتاز وزمن استجابة منخفض.'
        ]}
        unknowns={[
          'حجم الفريق البرمجي الفعلي الذي شارك في تطوير الوحدات الطرفية.',
          'أداء النظام تحت ضغط ترافيك يفوق 50,000 استدعاء متزامن في الثانية.'
        ]}
        evidence={[
          { id: 'ev-1', title: 'FinStream Financial Core', type: 'PROJECT', status: 'VERIFIED', strength: 95 },
          { id: 'ev-2', title: 'Practical Async Endpoint Challenge', type: 'CHALLENGE', status: 'CLAIMED', strength: 96 }
        ]}
      />
    </div>
  );
};
