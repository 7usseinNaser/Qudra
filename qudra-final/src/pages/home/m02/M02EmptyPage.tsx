import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Target, Award, TrendingUp, ShieldCheck, BarChart2 } from 'lucide-react';
import { ROUTES } from '../../../constants/routes';
import { AnchorNav, AnchorLink } from '../../../components/patterns/AnchorNav';
import { Button } from '../../../components/ui/Button';
import styles from './m02.module.css';

const M02_ANCHORS: AnchorLink[] = [
  { id: 'overview', label: 'نظرة عامة', path: ROUTES.M02_OVERVIEW, icon: <BarChart2 size={16} /> },
  { id: 'details', label: 'التفاصيل', path: ROUTES.M02_DETAILS, icon: <TrendingUp size={16} /> },
  { id: 'create', label: 'تخصيص', path: ROUTES.M02_CREATE, icon: <Target size={16} /> },
  { id: 'results', label: 'الملخص', path: ROUTES.M02_RESULTS, icon: <Award size={16} /> },
  { id: 'empty', label: 'جديد', path: ROUTES.M02_EMPTY, icon: <Sparkles size={16} /> },
  { id: 'error', label: 'خطأ', path: ROUTES.M02_ERROR, icon: <ShieldCheck size={16} /> },
];

export const M02EmptyPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.page} dir="rtl">
      <AnchorNav anchors={M02_ANCHORS} title="شاشات الصفحة الرئيسية (M02)" />

      <header className={styles.header}>
        <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.M02_OVERVIEW)} leftIcon={<ArrowLeft size={16} />}>
          العودة للنظرة العامة
        </Button>
        <div className={styles.headerContent}>
          <div className={styles.headerIcon}>
            <Sparkles size={32} />
          </div>
          <div>
            <h1 className={styles.title}>جديد هنا؟</h1>
            <p className={styles.subtitle}>
              لم يتم تخصيص صفحتك الرئيسية بعد. ابدأ ببناء ملفك المهاري واختر ما تريد إبرازه.
            </p>
          </div>
        </div>
        <span className={styles.badgeQ}>M02 · Q-0069 · ⚓ Empty State</span>
      </header>

      <section className={styles.emptySection} aria-labelledby="empty-title">
        <div className={styles.emptyCard}>
          <div className={styles.emptyIcon}>
            <Sparkles size={48} />
          </div>
          <h2 id="empty-title" className={styles.emptyTitle}>صفحة رئيسية فارغة</h2>
          <p className={styles.emptyDesc}>
            صفحتك الرئيسية هي واجهتك للعالم — تعرض قدراتك المثبتة، أدلتك، ومستوى ثقتك.
            ابدأ بإضافة أول قدرة أو اربط GitHub لاستخراج الأدلة تلقائياً.
          </p>
          <div className={styles.emptyActions}>
            <Button variant="proof" size="lg" onClick={() => navigate(ROUTES.M02_CREATE)} leftIcon={<Target size={18} />}>
              تخصيص الصفحة الرئيسية
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate('/profile/completion')} leftIcon={<Award size={18} />}>
              إكمال الملف المهاري
            </Button>
          </div>
        </div>
      </section>

      <section className={styles.guideSection} aria-labelledby="guide-title">
        <h3 id="guide-title" className={styles.sectionTitle}>ماذا ستجد في صفحتك الرئيسية؟</h3>
        <div className={styles.guideGrid}>
          <div className={styles.guideCard}>
            <div className={styles.guideIcon}><TrendingUp size={24} /></div>
            <h4>ملخص القدرات</h4>
            <p>نظرة سريعة على قدراتك المثبتة (Proven) والمعلنة (Claimed) مع نسبة الثقة.</p>
          </div>
          <div className={styles.guideCard}>
            <div className={styles.guideIcon}><ShieldCheck size={24} /></div>
            <h4>درجة الثقة</h4>
            <p>مؤشر عام لموثوقية ملفك بناءً على نسبة الأدلة المثبتة مقابل المعلنة.</p>
          </div>
          <div className={styles.guideCard}>
            <div className={styles.guideIcon}><Award size={24} /></div>
            <h4>أبرز الأدلة</h4>
            <p>أقوى 3 أدلة تدعم قدراتك — قابلة للفتح للتفاصيل الكاملة.</p>
          </div>
          <div className={styles.guideCard}>
            <div className={styles.guideIcon}><Target size={24} /></div>
            <h4>إجراءات مقترحة</h4>
            <p>خطوات التالية لسد الفجوات ورفع مستوى الثقة — تحديات، مشاريع، تحقق شفهي.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default M02EmptyPage;