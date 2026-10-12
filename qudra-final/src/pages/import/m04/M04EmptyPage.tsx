import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, HelpCircle, Sparkles, ArrowRight, FileCode, Shield, GitBranch, Lock, PlusCircle } from 'lucide-react';
import { ROUTES } from '../../../constants/routes';
import { AnchorNav, AnchorLink } from '../../../components/patterns/AnchorNav';
import { DataState } from '../../../components/patterns/DataState';
import { Button } from '../../../components/ui/Button';
import styles from './m04.module.css';

const M04_ANCHORS: AnchorLink[] = [
  { id: 'overview', label: 'نظرة عامة', path: ROUTES.M04_OVERVIEW, icon: <Upload size={16} /> },
  { id: 'details', label: 'التفاصيل', path: ROUTES.M04_DETAILS, icon: <FileCode size={16} /> },
  { id: 'create', label: 'استيراد جديد', path: ROUTES.M04_CREATE, icon: <Sparkles size={16} /> },
  { id: 'results', label: 'نتائج الاستيراد', path: ROUTES.M04_RESULTS, icon: <CheckCircle2 size={16} /> },
  { id: 'empty', label: 'الحالة الفارغة', path: ROUTES.M04_EMPTY, icon: <HelpCircle size={16} /> },
  { id: 'error', label: 'معالجة الخطأ', path: ROUTES.M04_ERROR, icon: <AlertTriangle size={16} /> },
];

import { CheckCircle2, AlertTriangle } from 'lucide-react';

export const M04EmptyPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.page} dir="rtl">
      <AnchorNav anchors={M04_ANCHORS} title="شاشات مركز الاستيراد (M04)" />

      <header className={styles.header}>
        <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.M04_OVERVIEW)} leftIcon={<ArrowLeft size={16} />}>
          العودة للنظرة العامة
        </Button>
        <div className={styles.headerContent}>
          <div className={styles.headerIcon}>
            <HelpCircle size={32} />
          </div>
          <div>
            <h1 className={styles.title}>لا توجد استيرادات بعد</h1>
            <p className={styles.subtitle}>
              لم تقم باستيراد أي بيانات من مصادر خارجية بعد. ابدأ بربط مصدر لإثراء ملفك بالأدلة.
            </p>
          </div>
        </div>
      </header>

      <DataState
        state="empty"
        title="مركز الاستيراد فارغ"
        message="لم يتم استيراد أي بيانات من LinkedIn، Credly، LeetCode، أو Hack The Box بعد."
        action={{
          label: 'بدء أول استيراد',
          onClick: () => navigate(ROUTES.M04_CREATE, { state: { sourceId: 'linkedin' } }),
          variant: 'proof',
          icon: <PlusCircle size={16} />,
        }}
        secondaryAction={{
          label: 'عرض المصادر المتاحة',
          onClick: () => navigate(ROUTES.M04_OVERVIEW),
          variant: 'outline',
          icon: <ArrowRight size={16} />,
        }}
      />

      <section className={styles.emptySources} aria-labelledby="empty-sources-title">
        <h2 id="empty-sources-title" className={styles.sectionTitle}>المصادر المدعومة للاستيراد</h2>
        <div className={styles.emptySourcesGrid}>
          <div className={styles.emptySourceCard}>
            <div className={styles.emptySourceIcon} style={{ background: 'rgba(10, 102, 194, 0.1)', borderColor: '#0A66C2' }}>
              <FileCode size={24} style={{ color: '#0A66C2' }} />
            </div>
            <h3>LinkedIn Data Export</h3>
            <p>رفع ملف ZIP من إعدادات الخصوصية لاستخراج الخبرات، المهارات، الشهادات، والمشاريع</p>
            <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.M04_CREATE, { state: { sourceId: 'linkedin' } })} leftIcon={<ArrowRight size={14} />}>
              استيراد من LinkedIn
            </Button>
          </div>
          <div className={styles.emptySourceCard}>
            <div className={styles.emptySourceIcon} style={{ background: 'rgba(0, 200, 150, 0.1)', borderColor: '#00C896' }}>
              <Shield size={24} style={{ color: '#00C896' }} />
            </div>
            <h3>Credly Badges</h3>
            <p>إدخال رابط البروفايل العام لاستيراد الشارات الرقمية والشهادات المعتمدة (حالة VERIFIED)</p>
            <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.M04_CREATE, { state: { sourceId: 'credly' } })} leftIcon={<ArrowRight size={14} />}>
              استيراد من Credly
            </Button>
          </div>
          <div className={styles.emptySourceCard}>
            <div className={styles.emptySourceIcon} style={{ background: 'rgba(255, 161, 22, 0.1)', borderColor: '#FFA116' }}>
              <GitBranch size={24} style={{ color: '#FFA116' }} />
            </div>
            <h3>LeetCode Profile</h3>
            <p>رابط البروفايل العام لإحصائيات الحل، المسابقات، وتصنيف المهارات الخوارزمية</p>
            <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.M04_CREATE, { state: { sourceId: 'leetcode' } })} leftIcon={<ArrowRight size={14} />}>
              استيراد من LeetCode
            </Button>
          </div>
          <div className={styles.emptySourceCard}>
            <div className={styles.emptySourceIcon} style={{ background: 'rgba(159, 26, 224, 0.1)', borderColor: '#9F1AE0' }}>
              <Lock size={24} style={{ color: '#9F1AE0' }} />
            </div>
            <h3>Hack The Box</h3>
            <p>PAT من إعدادات API لآلات الاختراق، التحديات، والرتب الأمنية (يتطلب PAT)</p>
            <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.M04_CREATE, { state: { sourceId: 'hackthebox' } })} leftIcon={<ArrowRight size={14} />}>
              استيراد من HTB
            </Button>
          </div>
        </div>
      </section>

      <section className={styles.securityReminder} aria-labelledby="security-title">
        <h2 id="security-title" className={styles.sectionTitle}>تذكير بسياسة الأمان</h2>
        <div className={styles.securityCards}>
          <div className={styles.securityCard}>
            <AlertTriangle size={20} />
            <h4>لا تخزين للرموز السرية</h4>
            <p>أي PAT أو Access Token لا يُحفظ في localStorage/sessionStorage/قاعدة البيانات. يبقى في متغير JS بالذاكرة فقط أثناء الجلسة.</p>
          </div>
          <div className={styles.securityCard}>
            <CheckCircle2 size={20} />
            <h4>شارة Fragile واضحة</h4>
            <p>جميع الأدلة المستوردة تحمل حالة CLAIMED وتظهر كـ "User-supplied / Fragile" في ملف الماستر.</p>
          </div>
          <div className={styles.securityCard}>
            <Sparkles size={20} />
            <h4>مسح فوري عند انتهاء الجلسة</h4>
            <p>إغلاق التبويب، تسجيل الخروج، أو انتهاء المهلة = مسح الرمز من الذاكرة فوراً.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default M04EmptyPage;