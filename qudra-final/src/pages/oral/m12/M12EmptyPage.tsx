import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { M12AnchorNav } from './M12AnchorNav';
import styles from './m12.module.css';
import { Mic, ArrowLeft, ShieldCheck, Sparkles, Target, Calendar, UserCheck, AlertTriangle } from 'lucide-react';

export const M12EmptyPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <M12AnchorNav />

      <div className={styles.headerRow}>
        <div>
          <span className={styles.badgeQ}>M12 · Q-0469 · ⚓ Empty State</span>
          <h1 className={styles.title}>حالة عدم وجود مقابلات</h1>
          <p className={styles.subtitle}>
            واجهة توجيهية هادئة تستقبل المستخدم دون أي رسائل لوم، وتوضح القيمة السريعة لاختيار فجوة وجدولة تحقق شفهي مع خبير معتمد.
          </p>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.emptyHero}>
          <div className={styles.emptyIconCircle}>
            <Mic size={36} />
          </div>

          <div style={{ maxWidth: '46ch' }}>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--ink)', marginBottom: '0.6rem' }}>
              ما في مقابلات مجدولة — اختر فجوة لجدولة تحقق شفهي
            </h2>
            <p style={{ color: 'var(--ink-2)', fontSize: '0.92rem', lineHeight: 1.6, margin: 0 }}>
              لا توجد مقابلات شفوية في خطتك بعد. النظام يقترح خبراء معتمدين مجدولة خصيصاً لسد فجواتك النشطة،
              مع تقييم مباشر ينتج تقريراً مفصلاً ودرجة موثقة.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap', margin: '0.75rem 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.84rem', color: 'var(--ink)' }}>
              <Target size={16} color="var(--proof)" />
              <span>موجهة لفجوتك النشطة</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.84rem', color: 'var(--ink)' }}>
              <Calendar size={16} color="var(--proof)" />
              <span>موعد مرن عبر Calendly</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.84rem', color: 'var(--ink)' }}>
              <UserCheck size={16} color="var(--proof)" />
              <span>خبراء معتمدون فقط</span>
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
        <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 0.75rem' }}>كيف تعمل حلقة التحقق الشفهي في QUDRA؟</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.84rem', color: 'var(--ink-2)', lineHeight: 1.6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--proof-tint)', color: 'var(--proof-text)', display: 'grid', placeItems: 'center', fontSize: '0.7rem', fontWeight: 800, flexShrink: 0 }}>1</span>
            <span>اختر فجوة نشطة من شاشة <strong>الفجوات (/gaps)</strong> أو قدرة من <strong>الخريطة (/skills/overview)</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--proof-tint)', color: 'var(--proof-text)', display: 'grid', placeItems: 'center', fontSize: '0.7rem', fontWeight: 800, flexShrink: 0 }}>2</span>
            <span>النظام يقترح خبراء معتمدين في المجال المحدد مع توفر مواعيد</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--proof-tint)', color: 'var(--proof-text)', display: 'grid', placeItems: 'center', fontSize: '0.7rem', fontWeight: 800, flexShrink: 0 }}>3</span>
            <span>جدولة المقابلة: أسئلة مخصصة، مدة محددة، تأكيد آلي</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--proof-tint)', color: 'var(--proof-text)', display: 'grid', placeItems: 'center', fontSize: '0.7rem', fontWeight: 800, flexShrink: 0 }}>4</span>
            <span>جلسة المقابلة [Demo]: تقييم مباشر، تسجيل محاكاة، تقرير آلي</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--proof-tint)', color: 'var(--proof-text)', display: 'grid', placeItems: 'center', fontSize: '0.7rem', fontWeight: 800, flexShrink: 0 }}>5</span>
            <span>النتيجة: Expert-reviewed (درجة + تقرير) — <strong>لا تمنح Proven مباشرة</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--proof-tint)', color: 'var(--proof-text)', display: 'grid', placeItems: 'center', fontSize: '0.7rem', fontWeight: 800, flexShrink: 0 }}>6</span>
            <span>الإثبات النهائي = مشروع تطبيقي أو تحدٍ عملي موثق (Q-0447)</span>
          </div>
        </div>
      </div>

      <div className={styles.card} style={{ marginTop: '1.5rem' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--ink)', margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck size={20} style={{ color: 'var(--proof)' }} />
          <span style={{ color: 'var(--amber, #d97706)' }}>⚠</span> ملاحظة هامة: وسم [Demo] صريح
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--ink-2)', lineHeight: 1.6 }}>
          <div style={{ padding: '1rem', background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: '10px' }}>
            <div style={{ fontWeight: 700, color: 'var(--ink)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <AlertTriangle size={16} style={{ color: '#F59E0B' }} />
              النسخة الحالية: محاكاة UI فقط
            </div>
            <p style={{ margin: 0 }}>
              لا يوجد تسجيل صوتي حقيقي، لا تحليل كلام (STT)، لا تقييم آلي حقيقي.
              جميع المقابلات، النتائج، والتقارير <strong>مُحاكاة</strong> لأغراض عرض الواجهة فقط.
              في الإنتاج: ربط Calendly/Zoom، تسجيل مشفر، STT، تحليل إجابات، تقرير آلي.
            </p>
          </div>
          <div style={{ padding: '1rem', background: 'rgba(0, 184, 184, 0.05)', border: '1px solid rgba(0, 184, 184, 0.2)', borderRadius: '10px' }}>
            <div style={{ fontWeight: 700, color: 'var(--ink)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldCheck size={16} style={{ color: 'var(--proof)' }} />
              مستوى الثقة: Expert-reviewed ≠ Proven
            </div>
            <p style={{ margin: 0 }}>
              المقابلة الشفوية تمنح مستوى ثقة <strong>Expert-reviewed</strong> (متوسط-عالي).
              <strong>لا تمنح Proven مباشرة</strong> — الإثبات النهائي يتطلب مشروعاً تطبيقياً أو تحدياً عملياً موثقاً.
              هذا يتوافق مع مبدأ QUDRA: "المقابلة تثبت الفهم النظري، لكنها لا تثبت وحدها الإتقان العملي".
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default M12EmptyPage;