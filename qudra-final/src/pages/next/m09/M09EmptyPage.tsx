import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Target, HelpCircle, Sparkles, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ROUTES } from '../../../constants/routes';
import { AnchorNav, AnchorLink } from '../../../components/patterns/AnchorNav';
import { DataState } from '../../../components/patterns/DataState';
import { Button } from '../../../components/ui/Button';
import styles from './m09.module.css';

const M09_ANCHORS: AnchorLink[] = [
  { id: 'overview', label: 'نظرة عامة', path: ROUTES.M09_OVERVIEW, icon: <Target size={16} /> },
  { id: 'details', label: 'التفاصيل', path: ROUTES.M09_DETAILS, icon: <Zap size={16} /> },
  { id: 'create', label: 'إنشاء خطة', path: ROUTES.M09_CREATE, icon: <ArrowRight size={16} /> },
  { id: 'results', label: 'النتائج', path: ROUTES.M09_RESULTS, icon: <Sparkles size={16} /> },
  { id: 'empty', label: 'الحالة الفارغة', path: ROUTES.M09_EMPTY, icon: <HelpCircle size={16} /> },
  { id: 'error', label: 'معالجة الخطأ', path: ROUTES.M09_ERROR, icon: <Zap size={16} /> },
];

export const M09EmptyPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.page} dir="rtl">
      <AnchorNav anchors={M09_ANCHORS} title="شاشات محرك الخطوة التالية (M09)" />

      <header className={styles.header}>
        <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.M09_OVERVIEW)} leftIcon={<ArrowLeft size={16} />}>
          العودة للنظرة العامة
        </Button>
        <div className={styles.headerContent}>
          <div className={styles.headerIcon}>
            <HelpCircle size={32} />
          </div>
          <div>
            <h1 className={styles.title}>لا توجد فجوات كفاءات</h1>
            <p className={styles.subtitle}>
              ملفك المكتمل لا يحتوي على أي فجوات حرجة أو متوسطة في الكفاءات المطلوبة
            </p>
          </div>
        </div>
      </header>

      <DataState
        state="empty"
        title="ممتاز! لا توجد فجوات"
        message="جميع كفاءاتك الأساسية مثبتة بأدلة قوية. محرك الخطوة التالية لا يجد أي فجوة تتطلب إجراءً فورياً."
        action={{
          label: 'استكشاف تحديات متقدمة',
          onClick: () => navigate('/challenges'),
          variant: 'proof',
          icon: <Zap size={16} />,
        }}
        secondaryAction={{
          label: 'إنشاء خطة نمو طموحة',
          onClick: () => navigate(ROUTES.M09_CREATE),
          variant: 'outline',
          icon: <Sparkles size={16} />,
        }}
      />

      <section className={styles.emptyDetails} aria-labelledby="empty-details-title">
        <h2 id="empty-details-title" className={styles.sectionTitle}>ماذا يعني هذا؟</h2>
        <div className={styles.emptyCards}>
          <div className={styles.emptyCard}>
            <div className={styles.emptyCardIcon}>
              <CheckCircle2 size={24} />
            </div>
            <h3>ملف كفاءات قوي</h3>
            <p>جميع المهارات المطلوبة لمشاريعك المستهدفة مبرهنة بأدلة كود ومشاريع حقيقية.</p>
          </div>
          <div className={styles.emptyCard}>
            <div className={styles.emptyCardIcon}>
              <Target size={24} />
            </div>
            <h3>جاهزية عالية للفرص</h3>
            <p>يمكنك التقديم بثقة على المشاريع والتحديات دون حاجة لسد فجوات مسبقة.</p>
          </div>
          <div className={styles.emptyCard}>
            <div className={styles.emptyCardIcon}>
              <Sparkles size={24} />
            </div>
            <h3>فرصة للنمو الطموح</h3>
            <p>بدلاً من سد فجوات، يمكنك استهداف مهارات متقدمة أو مجالات جديدة كلياً.</p>
          </div>
        </div>
      </section>

      <section className={styles.suggestionsSection} aria-labelledby="suggestions-title">
        <h2 id="suggestions-title" className={styles.sectionTitle}>اقتراحات للخطوة التالية</h2>
        <div className={styles.suggestionsGrid}>
          <Button variant="proof" size="md" onClick={() => navigate('/challenges')} leftIcon={<Zap size={16} />}>
            حل تحديات متقدمة لرفع DNA Score
          </Button>
          <Button variant="outline" size="md" onClick={() => navigate('/opportunities')} leftIcon={<ArrowRight size={16} />}>
            استعراض فرص المشاريع المفتوحة
          </Button>
          <Button variant="outline" size="md" onClick={() => navigate('/profile/master')} leftIcon={<Sparkles size={16} />}>
            مراجعة ملف الماستر وتصدير Passport
          </Button>
        </div>
      </section>
    </div>
  );
};


export default M09EmptyPage;