import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import styles from './m21.module.css';
import { Sparkles, Info, Search, Kanban, FileText, Award} from 'lucide-react';
import { ROUTES } from '../../../constants/routes';

export const M21EmptyPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container} dir="rtl">
      <div className={styles.headerRow}>
        <div className={styles.headerContent}>
          <span className={styles.badgeQ}>M21 · Q-0829 · ⚓ Empty State</span>
          <span className={styles.demoBadge}>[Demo / تجريبي]</span>
          <h1 className={styles.title}>لا توجد مساحات عمل</h1>
          <p className={styles.subtitle}>
            لم تنشئ أي مساحة عمل بعد. ابدأ بتشكيل فريق (M20) ثم أنشئ مساحة عمل لمشروعك.
          </p>
        </div>
      </div>

      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>📋</div>
        <h2 className={styles.emptyTitle}>ما في مساحات عمل بعد</h2>
        <p className={styles.emptyDesc}>
          لإنشاء مساحة عمل، تحتاج أولاً إلى فريق مشكلة (M20) وفرصة (M17).
          المحرك سينشئ مساحة عمل مرتبطة بفريقك مع لوحة كانبان خفيفة ومحطة تسليم مخرجات.
        </p>

        <div style={{ textAlign: 'right', margin: '1.5rem 0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', background: 'rgba(0, 184, 184, 0.05)', border: '1px solid rgba(0, 184, 184, 0.2)', borderRadius: '8px' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '6px', background: 'var(--proof)', color: 'white', fontWeight: 700, fontSize: '0.8rem' }}>1</span>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--ink)' }}>شكل فريقاً من M20</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--ink-2)' }}>اختر فرصة وشكل فريقاً بتغطية 100%</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', background: 'rgba(0, 184, 184, 0.05)', border: '1px solid rgba(0, 184, 184, 0.2)', borderRadius: '8px' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '6px', background: 'var(--proof)', color: 'white', fontWeight: 700, fontSize: '0.8rem' }}>2</span>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--ink)' }}>أنشئ مساحة عمل</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--ink-2)' }}>أضف مهام كانبان ومحطة تسليم مخرجات</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '8px' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '6px', background: '#F59E0B', color: 'white', fontWeight: 700, fontSize: '0.8rem' }}>3</span>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--ink)' }}>سلّم المخرجات واحصل على أدلة</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--ink-2)' }}>كل مخرجات تتحول لمسودة دليل CLAIMED تلقائياً</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '1.5rem' }}>
          <Button variant="proof" size="lg" onClick={() => navigate(ROUTES.M20_OVERVIEW)} leftIcon={<Search size={18} />}>
            تشكيل فريق (M20)
          </Button>
          <Button variant="outline" size="lg" onClick={() => navigate(ROUTES.M21_CREATE)} leftIcon={<Kanban size={18} />}>
            إنشاء مساحة يدوياً
          </Button>
        </div>

        <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '10px', textAlign: 'right' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: 'var(--ink-2)', fontSize: '0.85rem', lineHeight: 1.6 }}>
            <Info size={18} style={{ color: '#10B981', flexShrink: 0, marginTop: '0.1rem' }} />
            <div>
              <strong>كيف تعمل مساحة العمل:</strong> لوحة كانبان خفيفة بخمسة أعمدة (قائمة الانتظار → للتنفيذ → قيد التنفيذ → مراجعة → مكتمل).
              عند إكمال مهمة، تسلم مخرجاتها في محطة التسليم — تتحول تلقائياً لمسودة دليل CLAIMED بانتظار التحقق.
            </div>
          </div>
        </div>
      </div>

      <div className={styles.card} style={{ marginTop: '1.5rem' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--ink)', margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={20} style={{ color: '#F59E0B' }} />
          ماذا بعد إنشاء مساحة العمل؟
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '1rem', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '10px' }}>
            <Kanban size={20} style={{ color: 'var(--proof)', flexShrink: 0, marginTop: '0.15rem' }} />
            <div>
              <div style={{ fontWeight: 600, color: 'var(--ink)', marginBottom: '0.25rem' }}>لوحة كانبان خفيفة</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--ink-2)', lineHeight: 1.5 }}>
                خمسة أعمدة ثابتة — اسحب المهام بين الأعمدة، لا تعقيد ولا إعدادات.
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '1rem', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '10px' }}>
            <FileText size={20} style={{ color: '#10B981', flexShrink: 0, marginTop: '0.15rem' }} />
            <div>
              <div style={{ fontWeight: 600, color: 'var(--ink)', marginBottom: '0.25rem' }}>محطة تسليم المخرجات</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--ink-2)', lineHeight: 1.5 }}>
                كل مخرجات تُحول تلقائياً لمسودة دليل CLAIMED — مرتبطة بالمهمة والقدرة.
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '1rem', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '10px' }}>
            <Award size={20} style={{ color: '#F59E0B', flexShrink: 0, marginTop: '0.15rem' }} />
            <div>
              <div style={{ fontWeight: 600, color: 'var(--ink)', marginBottom: '0.25rem' }}>CLAIMED → Proven</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--ink-2)', lineHeight: 1.5 }}>
                عند التحقق من المراجع، ترفع الأدلة من CLAIMED إلى Proven — تُضاف لجواز قدراتك.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default M21EmptyPage;