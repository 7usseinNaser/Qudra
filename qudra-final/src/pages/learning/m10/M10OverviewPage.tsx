import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QudraStore } from '../../../services/store';
import { Button } from '../../../components/ui/Button';
import { M10AnchorNav } from './M10AnchorNav';
import styles from './m10.module.css';
import { ArrowLeft, Sparkles, BookOpen, Target, TrendingUp, Info, Filter } from 'lucide-react';

export const M10OverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const [showExplain, setShowExplain] = useState(false);

  const user = QudraStore.getUser();
  const gaps = QudraStore.getGaps();
  const capabilities = QudraStore.getCapabilities();

  const activeGaps = gaps.filter(g => g.status === 'OPEN');
  const inProgressCapabilities = capabilities.filter(c => c.status === 'IN_PROGRESS');
  const provenCapabilities = capabilities.filter(c => c.status === 'PROVEN');

  const primaryGap = activeGaps[0];

  return (
    <div className={styles.container}>
      <M10AnchorNav />

      <div className={styles.headerRow}>
        <div>
          <span className={styles.badgeQ}>M10 · Q-0361 · ⚓ Overview</span>
          <h1 className={styles.title}>التعلم والدورات — نظرة عامة</h1>
          <p className={styles.subtitle}>
            ملخص المسارات المقترحة لسد فجواتك، مع مؤشرات التحويل من دورة إلى مشروع، ومعدلات الإكمال، والتكلفة لكل مهارة مثبتة.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Button variant="outline" size="sm" onClick={() => navigate('/learn/create')} leftIcon={<Filter size={14} />}>
            إضافة دورة خارجية
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowExplain(!showExplain)} leftIcon={<Info size={14} />}>
            {showExplain ? 'إخفاء التفسير' : 'اشرح لي: لماذا هذه الدورات؟'}
          </Button>
        </div>
      </div>

      {showExplain && (
        <div className={styles.explainDrawer} style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <Info size={16} color="var(--proof-text)" />
            <strong style={{ fontSize: '0.88rem', color: 'var(--proof-text)' }}>
              تفسير التوصيات الذكية (Explain Drawer)
            </strong>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--ink-2)', lineHeight: 1.6, margin: 0 }}>
            • <strong>معيار الاختيار</strong>: يتم ترتيب الدورات بحسب أهميتها للفجوة النشطة الحالية: {primaryGap?.description || 'لا توجد فجوة نشطة'}.<br />
            • <strong>الأدلة المستخدمة</strong>: {inProgressCapabilities.length} قدرات قيد التطور، {provenCapabilities.length} قدرات مثبتة، {activeGaps.length} فجوات مفتوحة.<br />
            • <strong>قاعدة الإثبات</strong>: إكمال الدورة = دليل مساعد فقط. الإثبات النهائي = مشروع تطبيقي أو تحدٍ عملي موثق.<br />
            • <strong>حق الاعتراض</strong>: يمكنك رفض أي توصية أو إضافة دورة يدوياً — لا تعبئة صامتة.
          </p>
        </div>
      )}

      {activeGaps.length === 0 && capabilities.length === 0 && (
        <div className={styles.card} style={{ borderInlineStart: '4px solid var(--accent, #14b8a6)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.6rem' }}>
            <span style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--surface-2)', display: 'grid', placeItems: 'center', color: 'var(--proof)' }}>
              <BookOpen size={20} />
            </span>
            <div>
              <span className={styles.badgeQ}>M10 · Q-0389 · ⚓ Empty State (مدمجة)</span>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>
                ما في دورات بعد — اختر فجوة لنقترح دورات مناسبة
              </h2>
            </div>
          </div>
          <p style={{ color: 'var(--ink-2)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1rem' }}>
            هذه هي الحالة الفارغة المدمجة داخل شاشة النظرة العامة — نفس محتوى مسار <code dir="ltr">/learn/empty</code> (يبقى كرابط مباشر).
          </p>
          <div className={styles.actionRow}>
            <Button variant="proof" size="md" onClick={() => navigate('/gaps')} rightIcon={<ArrowLeft size={16} />}>
              الانتقال للفجوات لاختيار واحدة ←
            </Button>
          </div>
        </div>
      )}

      <div className={styles.grid2} style={{ marginBottom: '1.5rem' }}>
        <div className={styles.metricBox}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
            <span className={styles.metricLabel}>الدورات المقترحة للفجوة النشطة</span>
            <span className={styles.demoBadge}>[تجريبي / Demo Store]</span>
          </div>
          <span className={styles.metricValue} style={{ fontSize: '2rem' }}>
            {primaryGap ? '3' : '0'}
          </span>
          <span className={styles.metricHint}>
            {primaryGap
              ? `مُرشحة لسد: ${primaryGap.description.substring(0, 40)}...`
              : 'لا توجد فجوة نشطة — اذهب إلى شاشة الفجوات'}
          </span>
        </div>

        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>قدرات قيد التطور تحتاج تعلم</span>
          <span className={styles.metricValue}>{inProgressCapabilities.length}</span>
          <span className={styles.metricHint}>كل قدرة مرتبطة بدورة مقترحة + مشروع تطبيقي</span>
        </div>

        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>معدل التحويل دورة → مشروع</span>
          <span className={styles.metricValue} style={{ color: 'var(--proof-text)' }}>
            68%
          </span>
          <span className={styles.metricHint}>مقاس من المستخدمين الذين أكملوا الدورة وبدأوا مشروعاً</span>
        </div>

        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>التكلفة التقديرية للمهارة المثبتة</span>
          <span className={styles.metricValue} style={{ fontSize: '1.5rem' }}>
            $12
          </span>
          <span className={styles.metricHint}>متوسط تكلفة الدورة مقسوماً على المهارات التي أثبتها المشروع اللاحق</span>
        </div>
      </div>

      <div className={styles.card} style={{ borderInlineStart: '4px solid var(--proof)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
          <Sparkles size={20} color="var(--proof)" />
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
            التوصية الحالية: {primaryGap ? `دورة لمعالجة «${primaryGap.description.substring(0, 35)}...»` : 'اختر فجوة أولاً'}
          </h2>
        </div>

        {primaryGap && (
          <>
            <p style={{ color: 'var(--ink-2)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              بناءً على فجوتك النشطة في <strong>{primaryGap.description}</strong>، أفضل دورة مقترحة تجمع بين:
              المحتوى المناسب للمستوى، المشروع التطبيقي المدمج، والسعر المعقول.
            </p>

            <div style={{ background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: '12px', padding: '1.1rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 0.35rem' }}>
                    React Testing Library — من الصفر للإنتاج
                  </h3>
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.8rem', color: 'var(--ink-2)' }}>
                    <span>📚 <strong>المزود:</strong> QUDRA Academy</span>
                    <span>⏱️ <strong>المدة:</strong> 6 ساعات</span>
                    <span>💰 <strong>السعر:</strong> مجاني</span>
                    <span>🌐 <strong>اللغة:</strong> العربية</span>
                    <span>🎯 <strong>الفجوة:</strong> Testing evidence limited</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Button variant="proof" size="sm" rightIcon={<ArrowLeft size={14} />}>
                    البدء الآن
                  </Button>
                  <Button variant="outline" size="sm">
                    عرض التفاصيل (Q-0363)
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}

        <div className={styles.actionRow}>
          <Button variant="proof" size="md" onClick={() => navigate('/learn/details')} rightIcon={<ArrowLeft size={16} />}>
            عرض قائمة الدورات الكاملة (Q-0362) ←
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate('/learn/create')}>
            + إضافة دورة خارجية يدوياً
          </Button>
        </div>
      </div>

      <div className={styles.card}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 1rem' }}>مؤشرات الوحدة (Product Metrics)</h2>
        <div className={styles.grid2}>
          <div className={styles.metricBox}>
            <span className={styles.metricLabel}>Course-to-Project Conversion</span>
            <span className={styles.metricValue}>68%</span>
            <span className={styles.metricHint}>نسبة من أكملوا دورة وبدأوا مشروعاً خلال 30 يوماً</span>
          </div>
          <div className={styles.metricBox}>
            <span className={styles.metricLabel}>Completion Rate</span>
            <span className={styles.metricValue}>74%</span>
            <span className={styles.metricHint}>معدل إكمال الدورات المقترحة</span>
          </div>
          <div className={styles.metricBox}>
            <span className={styles.metricLabel}>Cost per Proven Skill</span>
            <span className={styles.metricValue}>$12</span>
            <span className={styles.metricHint}>متوسط التكلفة لكل مهارة انتقلت إلى Proven عبر المشروع</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default M10OverviewPage;