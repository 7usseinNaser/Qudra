import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QudraStore } from '../../../services/store';
import { Button } from '../../../components/ui/Button';
import { M12AnchorNav } from './M12AnchorNav';
import styles from './m12.module.css';
import { ArrowLeft, Sparkles, Mic, Users, Clock, Info, TrendingUp, Award } from 'lucide-react';

export const M12OverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const [showExplain, setShowExplain] = useState(false);

  const gaps = QudraStore.getGaps();
  const capabilities = QudraStore.getCapabilities();

  const activeGaps = gaps.filter(g => g.status === 'OPEN');

  const primaryGap = activeGaps[0];

  return (
    <div className={styles.container}>
      <M12AnchorNav />

      <div className={styles.headerRow}>
        <div>
          <span className={styles.badgeQ}>M12 · Q-0441 · ⚓ Overview</span>
          <span className={styles.demoBadge}>[Demo / تجريبي] محاكاة التحقق الشفهي</span>
          <h1 className={styles.title}>التحقق والتقييم الشفهي — نظرة عامة</h1>
          <p className={styles.subtitle}>
            ملخص المقابلات الشفوية المجدولة والمنجزة، مع مؤشرات الحضور، معدل النجاح، ومتوسط وقت التقييم.
            المقابلة = تحقق من مستوى Expert-reviewed؛ لا تمنح Proven وحدها دون دليل موثق.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Button variant="outline" size="sm" onClick={() => navigate('/oral/create')} leftIcon={<Sparkles size={14} />}>
            جدولة مقابلة جديدة
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowExplain(!showExplain)} leftIcon={<Info size={14} />}>
            {showExplain ? 'إخفاء التفسير' : 'اشرح لي: منهجية المقابلة'}
          </Button>
        </div>
      </div>

      {showExplain && (
        <div className={styles.explainDrawer} style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <Info size={16} color="var(--proof-text)" />
            <strong style={{ fontSize: '0.88rem', color: 'var(--proof-text)' }}>
              تفسير منهجية التحقق الشفهي (Explain Drawer)
            </strong>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--ink-2)', lineHeight: 1.6, margin: 0 }}>
            • <strong>مستوى الثقة</strong>: المقابلة الشفهي = Expert-reviewed (متوسط-عالي). لا تمنح Proven مباشرة — تحتاج دليل موثق (كود، مشروع، CI).<br />
            • <strong>الهيكل</strong>: 3 مراحل — تحضير (أسئلة مخصصة)، جلسة (تسجيل + تقييم مباشر)، نتيجة (تقرير + قرار).<br />
            • <strong>التسجيل</strong>: وسم [Demo] صريح — لا تسجيل حقيقي في النسخة الحالية. المحاكاة تظهر تدفق UI فقط.<br />
            • <strong>قابلية الاعتراض</strong>: كل قرار قابل للاعتراض مع دليل مضاد، ويعاد الإسناد لمراجع آخر.
          </p>
        </div>
      )}

      {activeGaps.length === 0 && capabilities.length === 0 && (
        <div className={styles.card} style={{ borderInlineStart: '4px solid var(--accent, #14b8a6)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.6rem' }}>
            <span style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--surface-2)', display: 'grid', placeItems: 'center', color: 'var(--proof)' }}>
              <Mic size={20} />
            </span>
            <div>
              <span className={styles.badgeQ}>M12 · Q-0469 · ⚓ Empty State (مدمجة)</span>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>
                ما في مقابلات مجدولة — اختر فجوة أو قدرة لجدولة تحقق شفهي
              </h2>
            </div>
          </div>
          <p style={{ color: 'var(--ink-2)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1rem' }}>
            هذه هي الحالة الفارغة المدمجة داخل شاشة النظرة العامة — نفس محتوى مسار <code dir="ltr">/oral/empty</code> (يبقى كرابط مباشر).
          </p>
          <div className={styles.actionRow}>
            <Button variant="proof" size="md" onClick={() => navigate('/gaps')} rightIcon={<ArrowLeft size={16} />}>
              الانتقال للفجوات لاختيار واحدة ←
            </Button>
            <Button variant="outline" size="md" onClick={() => navigate('/skills/overview')} rightIcon={<ArrowLeft size={16} />}>
              أو اختر قدرة من الخريطة ←
            </Button>
          </div>
        </div>
      )}

      <div className={styles.grid2} style={{ marginBottom: '1.5rem' }}>
        <div className={styles.metricBox}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
            <span className={styles.metricLabel}>مقابلات مجدولة هذا الشهر</span>
            <span className={styles.demoBadge}>[تجريبي / Demo Store]</span>
          </div>
          <span className={styles.metricValue} style={{ fontSize: '2rem' }}>
            {primaryGap ? '2' : '0'}
          </span>
          <span className={styles.metricHint}>
            {primaryGap
              ? `مُجدولة لسد: ${primaryGap.description?.substring(0, 40)}...`
              : 'لا توجد فجوة نشطة — اذهب إلى شاشة الفجوات'}
          </span>
        </div>

        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>مقابلات منجزة (مكتملة)</span>
          <span className={styles.metricValue}>5</span>
          <span className={styles.metricHint}>خلال آخر 90 يوماً</span>
        </div>

        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>معدل الحضور Attendance Rate</span>
          <span className={styles.metricValue} style={{ color: 'var(--proof-text)' }}>
            92%
          </span>
          <span className={styles.metricHint}>نسبة الحضور من إجمالي المقابلات المجدولة</span>
        </div>

        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>معدل النجاح Pass Rate</span>
          <span className={styles.metricValue} style={{ color: 'var(--proof-text)', fontSize: '1.5rem' }}>
            68%
          </span>
          <span className={styles.metricHint}>نسبة من اجتازوا التقييم الشفهي بنجاح</span>
        </div>
      </div>

      <div className={styles.card} style={{ borderInlineStart: '4px solid var(--proof)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
          <Sparkles size={20} color="var(--proof)" />
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
            المقابلة القادمة: {primaryGap ? `تحقق لـ «${primaryGap.description?.substring(0, 35)}...»` : 'لا توجد مجدولة'}
          </h2>
        </div>

        {primaryGap && (
          <>
            <p style={{ color: 'var(--ink-2)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              بناءً على فجوتك النشطة في <strong>{primaryGap.description || '—'}</strong>، أفضل تحقق مقترح هو:
              مقابلة تقنية مع خبير Frontend لمعالجة فجوة Testing evidence limited.
            </p>

            <div style={{ background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: '12px', padding: '1.1rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 0.35rem' }}>
                    مقابلة تقنية: React Testing & Architecture
                  </h3>
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.8rem', color: 'var(--ink-2)' }}>
                    <span><Clock size={14} /> <strong>الموعد:</strong> غداً 10:00 ص</span>
                    <span><Users size={14} /> <strong>المراجع:</strong> أحمد محمد - Tech Lead</span>
                    <span><Award size={14} /> <strong>المستوى:</strong> Expert-reviewed</span>
                    <span><Mic size={14} /> <strong>المدة:</strong> 45 دقيقة</span>
                    <span><TrendingUp size={14} /> <strong>الحالة:</strong> مجدولة</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Button variant="proof" size="sm" rightIcon={<ArrowLeft size={14} />}>
                    عرض التفاصيل (Q-0443)
                  </Button>
                  <Button variant="outline" size="sm">
                    إعادة جدولة
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}

        <div className={styles.actionRow}>
          <Button variant="proof" size="md" onClick={() => navigate('/oral/details')} rightIcon={<ArrowLeft size={16} />}>
            عرض قائمة المقابلات الكاملة (Q-0442) ←
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate('/oral/create')}>
            + جدولة مقابلة جديدة
          </Button>
        </div>
      </div>

      <div className={styles.card}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 1rem' }}>مؤشرات الوحدة (Product Metrics)</h2>
        <div className={styles.grid2}>
          <div className={styles.metricBox}>
            <span className={styles.metricLabel}>Attendance Rate</span>
            <span className={styles.metricValue}>92%</span>
            <span className={styles.metricHint}>نسبة الحضور من إجمالي المقابلات المجدولة</span>
          </div>
          <div className={styles.metricBox}>
            <span className={styles.metricLabel}>Pass Rate</span>
            <span className={styles.metricValue} style={{ color: 'var(--proof-text)' }}>68%</span>
            <span className={styles.metricHint}>نسبة من اجتازوا التقييم الشفهي بنجاح</span>
          </div>
          <div className={styles.metricBox}>
            <span className={styles.metricLabel}>Avg Turnaround</span>
            <span className={styles.metricValue} style={{ fontSize: '1.5rem' }}>2.3 يوم</span>
            <span className={styles.metricHint}>متوسط وقت من المقابلة للنتيجة النهائية</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default M12OverviewPage;