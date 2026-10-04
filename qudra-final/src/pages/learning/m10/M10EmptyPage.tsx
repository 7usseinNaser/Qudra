import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { M10AnchorNav } from './M10AnchorNav';
import styles from './m10.module.css';
import { BookOpen, ArrowLeft, Clock, ShieldCheck, Sparkles, Target } from 'lucide-react';

export const M10EmptyPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <M10AnchorNav />

      <div className={styles.headerRow}>
        <div>
          <span className={styles.badgeQ}>M10 · Q-0389 · ⚓ Empty State</span>
          <h1 className={styles.title}>حالة عدم وجود دورات</h1>
          <p className={styles.subtitle}>
            واجهة توجيهية هادئة تستقبل المستخدم دون أي رسائل لوم، وتوضح القيمة السريعة لاختيار فجوة والبدء بالتعلم الموجه.
          </p>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.emptyHero}>
          <div className={styles.emptyIconCircle}>
            <BookOpen size={36} />
          </div>

          <div style={{ maxWidth: '46ch' }}>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--ink)', marginBottom: '0.6rem' }}>
              ما في دورات — اختر فجوة لنقترح دورات مناسبة
            </h2>
            <p style={{ color: 'var(--ink-2)', fontSize: '0.92rem', lineHeight: 1.6, margin: 0 }}>
              لا توجد دورات مسجلة في خطتك بعد. النظام يقترح دورات موجهة خصيصاً لسد فجواتك النشطة،
              مع مشروع تطبيقي مدمج ينتج دليلاً موثقاً عند الإكمال.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap', margin: '0.75rem 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.84rem', color: 'var(--ink)' }}>
              <Target size={16} color="var(--proof)" />
              <span>موجهة لفجوتك النشطة</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.84rem', color: 'var(--ink)' }}>
              <Clock size={16} color="var(--proof)" />
              <span>مشروع تطبيقي مدمج</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.84rem', color: 'var(--ink)' }}>
              <ShieldCheck size={16} color="var(--proof)" />
              <span>إثبات نهائي = مشروع/تحدٍ</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.84rem', color: 'var(--ink)' }}>
              <Sparkles size={16} color="var(--proof)" />
              <span>AI يشرح سبب كل توصية</span>
            </div>
          </div>

          <Button
            variant="proof"
            size="lg"
            onClick={() => navigate('/gaps')}
            rightIcon={<ArrowLeft size={18} />}
          >
            الانتقال للفجوات لاختيار واحدة ←
          </Button>
        </div>
      </div>

      <div className={styles.card} style={{ borderInlineStart: '4px solid var(--accent, #14b8a6)' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 0.75rem' }}>كيف تعمل حلقة التعلم في QUDRA؟</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.84rem', color: 'var(--ink-2)', lineHeight: 1.6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--proof-tint)', color: 'var(--proof-text)', display: 'grid', placeItems: 'center', fontSize: '0.7rem', fontWeight: 800, flexShrink: 0 }}>1</span>
            <span>اختر فجوة نشطة من شاشة <strong>الفجوات (/gaps)</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--proof-tint)', color: 'var(--proof-text)', display: 'grid', placeItems: 'center', fontSize: '0.7rem', fontWeight: 800, flexShrink: 0 }}>2</span>
            <span>النظام يقترح دورات بمشروع تطبيقي مدمج</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--proof-tint)', color: 'var(--proof-text)', display: 'grid', placeItems: 'center', fontSize: '0.7rem', fontWeight: 800, flexShrink: 0 }}>3</span>
            <span>أكمل الدورة وابدأ المشروع التطبيقي</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--proof-tint)', color: 'var(--proof-text)', display: 'grid', placeItems: 'center', fontSize: '0.7rem', fontWeight: 800, flexShrink: 0 }}>4</span>
            <span>المشروع ينتج <strong>دليلاً موثقاً</strong> يرفع ثقة القدرة</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--proof-tint)', color: 'var(--proof-text)', display: 'grid', placeItems: 'center', fontSize: '0.7rem', fontWeight: 800, flexShrink: 0 }}>5</span>
            <span>القدرة تتقدم: Claimed → In Progress → Proven</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default M10EmptyPage;