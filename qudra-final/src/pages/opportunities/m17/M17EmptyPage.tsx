import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import styles from './m17.module.css';
import { Target, Sparkles, Info, Search, Users, TrendingUp } from 'lucide-react';

export const M17EmptyPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container} dir="rtl">
      <div className={styles.headerRow}>
        <div className={styles.headerContent}>
          <span className={styles.badgeQ}>M17 · Q-0669 · ⚓ Empty State</span>
          <span className={styles.demoBadge}>[Demo / تجريبي]</span>
          <h1 className={styles.title}>لا توجد فرص مخصصة</h1>
          <p className={styles.subtitle}>
            محرك المطابقة لم يعثر على فرص متوافقة مع ملفك المهاري الحالي.
          </p>
        </div>
      </div>

      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>🎯</div>
        <h2 className={styles.emptyTitle}>ما في فرص مطابقة بعد</h2>
        <p className={styles.emptyDesc}>
          عندما تبني ملفك المهاري بأدلة حقيقية (مستودعات GitHub، مشاريع موثقة، تقييمات)،
          سيظهر هنا فرص مخصصة لك — ليست قائمة عامة، بل اختيار شخصي.
        </p>

        <div style={{ textAlign: 'right', margin: '1.5rem 0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', background: 'rgba(0, 184, 184, 0.05)', border: '1px solid rgba(0, 184, 184, 0.2)', borderRadius: '8px' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '6px', background: 'var(--proof)', color: 'white', fontWeight: 700, fontSize: '0.8rem' }}>1</span>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--ink)' }}>اربط GitHub وامسح مستودعاتك</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--ink-2)' }}>استخراج قدرات من كودك الحقيقي</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', background: 'rgba(0, 184, 184, 0.05)', border: '1px solid rgba(0, 184, 184, 0.2)', borderRadius: '8px' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '6px', background: 'var(--proof)', color: 'white', fontWeight: 700, fontSize: '0.8rem' }}>2</span>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--ink)' }}>أضف مشاريع موثقة</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--ink-2)' }}>مشاريع إنتاجية مع أدلة تسليم</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '8px' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '6px', background: '#F59E0B', color: 'white', fontWeight: 700, fontSize: '0.8rem' }}>3</span>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--ink)' }}>أكمل تقييمات شفاهية</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--ink-2)' }}>إثبات قدرات لا يظهر في الكود</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '1.5rem' }}>
          <Button variant="proof" size="lg" onClick={() => navigate('/profile/sources/github')} leftIcon={<Search size={18} />}>
            ربط GitHub والمسح
          </Button>
          <Button variant="outline" size="lg" onClick={() => navigate('/profile/master')} leftIcon={<Target size={18} />}>
            عرض ملفك المهاري
          </Button>
        </div>

        <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '10px', textAlign: 'right' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: 'var(--ink-2)', fontSize: '0.85rem', lineHeight: 1.6 }}>
            <Info size={18} style={{ color: '#10B981', flexShrink: 0, marginTop: '0.1rem' }} />
            <div>
              <strong>كيف تعمل المطابقة:</strong> المحرك يقارن متطلبات الفرصة المنظمة (مهارة + أهمية + مستوى)
              مع قدراتك المثبتة بأدلة (Verified Capabilities + Evidences).
              <strong>Proven ≠ Claimed</strong> — الادعاء الذاتي لا يدخل في حساب المطابقة.
            </div>
          </div>
        </div>
      </div>

      <div className={styles.card} style={{ marginTop: '1.5rem' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--ink)', margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={20} style={{ color: '#F59E0B' }} />
          ماذا بعد بناء الملف؟
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '1rem', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '10px' }}>
            <Search size={20} style={{ color: 'var(--proof)', flexShrink: 0, marginTop: '0.15rem' }} />
            <div>
              <div style={{ fontWeight: 600, color: 'var(--ink)', marginBottom: '0.25rem' }}>فرص تظهر تلقائياً</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--ink-2)', lineHeight: 1.5 }}>
                لا بحث يدوي — المحرك يدفع لك الفرص المطابقة فور توفرها.
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '1rem', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '10px' }}>
            <Users size={20} style={{ color: '#10B981', flexShrink: 0, marginTop: '0.15rem' }} />
            <div>
              <div style={{ fontWeight: 600, color: 'var(--ink)', marginBottom: '0.25rem' }}>تشكيل فريق (M20)</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--ink-2)', lineHeight: 1.5 }}>
                فرصة مناسبة؟ اضغط «تشكيل فريق» وابنِ فريقاً متكاملاً بتغطية قدرات 100%.
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '1rem', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '10px' }}>
            <TrendingUp size={20} style={{ color: '#F59E0B', flexShrink: 0, marginTop: '0.15rem' }} />
            <div>
              <div style={{ fontWeight: 600, color: 'var(--ink)', marginBottom: '0.25rem' }}>مساحة عمل مشروع (M21)</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--ink-2)', lineHeight: 1.5 }}>
                كانبان خفيف + محطة تسليم مخرجات → تتحول لمسودة دليل CLAIMED تلقائياً.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default M17EmptyPage;