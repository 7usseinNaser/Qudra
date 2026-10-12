import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import styles from './m20.module.css';
import { Target, Sparkles, Info, Search, TrendingUp, UserPlus, GitFork } from 'lucide-react';
import { ROUTES } from '../../../constants/routes';

export const M20EmptyPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container} dir="rtl">
      <div className={styles.headerRow}>
        <div className={styles.headerContent}>
          <span className={styles.badgeQ}>M20 · Q-0789 · ⚓ Empty State</span>
          <span className={styles.demoBadge}>[Demo / تجريبي]</span>
          <h1 className={styles.title}>لا توجد فرق مشكلة</h1>
          <p className={styles.subtitle}>
            لم تقم بتشكيل أي فريق بعد. ابدأ باختيار فرصة مناسبة ثم شكل فريقاً متكاملاً.
          </p>
        </div>
      </div>

      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>👥</div>
        <h2 className={styles.emptyTitle}>ما في فرق مشكلة بعد</h2>
        <p className={styles.emptyDesc}>
          لتشكيل فريق، اختر أولاً فرصة من سوق الفرص (M17) أو مشكلة من مسار صاحب المشكلة.
          المحرك سيقترح أعضاء بناءً على قدراتهم المثبتة ويحسب التغطية والتناغم تلقائياً.
        </p>

        <div style={{ textAlign: 'right', margin: '1.5rem 0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', background: 'rgba(0, 184, 184, 0.05)', border: '1px solid rgba(0, 184, 184, 0.2)', borderRadius: '8px' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '6px', background: 'var(--proof)', color: 'white', fontWeight: 700, fontSize: '0.8rem' }}>1</span>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--ink)' }}>اختر فرصة من M17</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--ink-2)' }}>تصفح سوق الفرص واختر فرصة مطابقة لملفك</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', background: 'rgba(0, 184, 184, 0.05)', border: '1px solid rgba(0, 184, 184, 0.2)', borderRadius: '8px' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '6px', background: 'var(--proof)', color: 'white', fontWeight: 700, fontSize: '0.8rem' }}>2</span>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--ink)' }}>اضغط «تشكيل فريق»</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--ink-2)' }}>المحرك يستخرج المتطلبات ويقترح أعضاء</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '8px' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '6px', background: '#F59E0B', color: 'white', fontWeight: 700, fontSize: '0.8rem' }}>3</span>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--ink)' }}>راجع التغطية والتناغم</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--ink-2)' }}>تأكد من تغطية 100% للمتطلبات الحرجة</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '1.5rem' }}>
          <Button variant="proof" size="lg" onClick={() => navigate(ROUTES.M17_OVERVIEW)} leftIcon={<Search size={18} />}>
            تصفح سوق الفرص
          </Button>
          <Button variant="outline" size="lg" onClick={() => navigate(ROUTES.M20_CREATE)} leftIcon={<UserPlus size={18} />}>
            تشكيل فريق يدوياً
          </Button>
        </div>

        <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '10px', textAlign: 'right' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: 'var(--ink-2)', fontSize: '0.85rem', lineHeight: 1.6 }}>
            <Info size={18} style={{ color: '#10B981', flexShrink: 0, marginTop: '0.1rem' }} />
            <div>
              <strong>كيف يعمل التركيب:</strong> المحرك يقارن متطلبات الفرصة المنظمة مع قدرات المرشحين المثبتة.
              <strong>Proven ≠ Claimed</strong> — التغطية تُحسب من القدرات المثبتة فقط.
              التناغم يقيس تنوع الأدوار وتقاطع الخبرات.
            </div>
          </div>
        </div>
      </div>

      <div className={styles.card} style={{ marginTop: '1.5rem' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--ink)', margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={20} style={{ color: '#F59E0B' }} />
          ماذا بعد تشكيل الفريق؟
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '1rem', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '10px' }}>
            <GitFork size={20} style={{ color: 'var(--proof)', flexShrink: 0, marginTop: '0.15rem' }} />
            <div>
              <div style={{ fontWeight: 600, color: 'var(--ink)', marginBottom: '0.25rem' }}>مساحة عمل مشروع (M21)</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--ink-2)', lineHeight: 1.5 }}>
                كانبان خفيف + محطة تسليم مخرجات → تتحول لمسودة دليل CLAIMED تلقائياً.
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '1rem', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '10px' }}>
            <Target size={20} style={{ color: '#10B981', flexShrink: 0, marginTop: '0.15rem' }} />
            <div>
              <div style={{ fontWeight: 600, color: 'var(--ink)', marginBottom: '0.25rem' }}>تغطية 100% = جاهزية تسليم</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--ink-2)', lineHeight: 1.5 }}>
                عندما تصل التغطية لـ 100% والتناغم ≥ 80%، الفريق جاهز للتسليم الفوري.
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '1rem', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '10px' }}>
            <TrendingUp size={20} style={{ color: '#F59E0B', flexShrink: 0, marginTop: '0.15rem' }} />
            <div>
              <div style={{ fontWeight: 600, color: 'var(--ink)', marginBottom: '0.25rem' }}>سد الفجوات</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--ink-2)', lineHeight: 1.5 }}>
                من كل فجوة في الفريق → تحدي عملي / مورد تعليمي / مشروع إثبات.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default M20EmptyPage;