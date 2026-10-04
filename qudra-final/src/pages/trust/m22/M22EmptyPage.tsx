import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import styles from './m22.module.css';
import { ShieldCheck, Search, Info, Award, UserCheck, Clock } from 'lucide-react';

export const M22EmptyPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container} dir="rtl">
      <div className={styles.headerRow}>
        <div className={styles.headerContent}>
          <span className={styles.badgeQ}>M22 · Q-0869 · ⚓ Empty State</span>
          <span className={styles.demoBadge}>[Demo / تجريبي]</span>
          <h1 className={styles.title}>لا توجد طلبات تحقق</h1>
          <p className={styles.subtitle}>
            ما في طلبات تحقق — اختر مهارة تريد رفع ثقتها.
          </p>
        </div>
      </div>

      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>📋</div>
        <h2 className={styles.emptyTitle}>ما في طلبات تحقق بعد</h2>
        <p className={styles.emptyDesc}>
          لرفع ثقة مهارة أو مشروع أو شهادة، تحتاج إنشاء طلب تحقق واختيار طريقة مناسبة.
          طرق التحقق الخمسة (مرتبة بأعلى ثقة):
        </p>

        <div style={{ textAlign: 'right', margin: '1.5rem 0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', background: 'rgba(0, 184, 184, 0.05)', border: '1px solid rgba(0, 184, 184, 0.2)', borderRadius: '8px' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '6px', background: 'var(--proof)', color: 'white', fontWeight: 700, fontSize: '0.8rem' }}>1</span>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--ink)' }}>مصدر رسمي (شهادة معتمدة / OAuth رسمي)</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--ink-2)' }}>أعلى مستوى ثقة — Official</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', background: 'rgba(0, 184, 184, 0.05)', border: '1px solid rgba(0, 184, 184, 0.2)', borderRadius: '8px' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '6px', background: 'var(--proof)', color: 'white', fontWeight: 700, fontSize: '0.8rem' }}>2</span>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--ink)' }}>رابط جهة / مشروع موثق (GitHub، شركة)</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--ink-2)' }}>User-supplied — ثقة عالية</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '8px' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '6px', background: '#F59E0B', color: 'white', fontWeight: 700, fontSize: '0.8rem' }}>3</span>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--ink)' }}>مراجع خبير (مراجعة كود / مقابلة تقنية)</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--ink-2)' }}>Expert-reviewed — ثقة متوسطة-عالية</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '8px' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '6px', background: '#F59E0B', color: 'white', fontWeight: 700, fontSize: '0.8rem' }}>4</span>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--ink)' }}>مقابلة شفهية تقنية</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--ink-2)' }}>Expert-reviewed — ثقة متوسطة</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', background: 'rgba(148, 163, 184, 0.05)', border: '1px solid rgba(148, 163, 184, 0.2)', borderRadius: '8px' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '6px', background: '#94A3B8', color: 'white', fontWeight: 700, fontSize: '0.8rem' }}>5</span>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--ink)' }}>تأكيد زميل / عميل</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--ink-2)' }}>Peer-confirmed — ثقة أساسية</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '1.5rem' }}>
          <Button variant="proof" size="lg" onClick={() => navigate('/trust/create')} leftIcon={<ShieldCheck size={18} />}>
            طلب تحقق جديد
          </Button>
          <Button variant="outline" size="lg" onClick={() => navigate('/skills/overview')} leftIcon={<Award size={18} />}>
            اختيار مهارة من الخريطة
          </Button>
        </div>

        <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '10px', textAlign: 'right' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: 'var(--ink-2)', fontSize: '0.85rem', lineHeight: 1.6 }}>
            <Info size={18} style={{ color: '#10B981', flexShrink: 0, marginTop: '0.1rem' }} />
            <div>
              <strong>ملاحظة:</strong> التحقق في قُدرة ليس ثنائياً — بل طبقات.
              <strong>Proven</strong> = مدعوم بطريقة تحقق.
              <strong>Claimed</strong> = إعلان ذاتي فقط (بانتظار تحقق).
              كل رقم قابل للفتح للدليل خلفه.
            </div>
          </div>
        </div>
      </div>

      <div className={styles.card} style={{ marginTop: '1.5rem' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--ink)', margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck size={20} style={{ color: 'var(--proof)' }} />
          كيف يعمل طلب التحقق؟
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '1rem', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '10px' }}>
            <Search size={20} style={{ color: 'var(--proof)', flexShrink: 0, marginTop: '0.15rem' }} />
            <div>
              <div style={{ fontWeight: 600, color: 'var(--ink)', marginBottom: '0.25rem' }}>1. اختر الموضوع</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--ink-2)', lineHeight: 1.5 }}>
                مهارة من خريطة القدرات، مشروع من GitHub، شهادة، أو خبرة عملية.
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '1rem', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '10px' }}>
            <Award size={20} style={{ color: '#F59E0B', flexShrink: 0, marginTop: '0.15rem' }} />
            <div>
              <div style={{ fontWeight: 600, color: 'var(--ink)', marginBottom: '0.25rem' }}>2. حدد طريقة التحقق</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--ink-2)', lineHeight: 1.5 }}>
                اختر من الطرق الخمس — كل طريقة تحدد مستوى الثقة المتوقع والمراجع المناسب.
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '1rem', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '10px' }}>
            <UserCheck size={20} style={{ color: '#10B981', flexShrink: 0, marginTop: '0.15rem' }} />
            <div>
              <div style={{ fontWeight: 600, color: 'var(--ink)', marginBottom: '0.25rem' }}>3. أضف الأدلة والروابط</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--ink-2)', lineHeight: 1.5 }}>
                روابط للشهادات، مستودعات GitHub، مشاريع موثقة، أو مراجع للتواصل.
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '1rem', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '10px' }}>
            <Clock size={20} style={{ color: '#F59E0B', flexShrink: 0, marginTop: '0.15rem' }} />
            <div>
              <div style={{ fontWeight: 600, color: 'var(--ink)', marginBottom: '0.25rem' }}>4. مراجعة ونتيجة</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--ink-2)', lineHeight: 1.5 }}>
                المراجع يراجع الأدلة → يقبل / يرفض / يطلب توضيح. النتيجة تظهر مع السبب والدليل.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default M22EmptyPage;