import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileCheck2,
  Code2,
  FolderGit2,
  Award,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Plus,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { ROUTES } from '../../../constants/routes';
import { Button, GithubIcon, LinkedinIcon } from '../../../components/ui';
import styles from './SourceCenterPage.module.css';

export const SourceCenterPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      {/* Navigation */}
      <div style={{ marginBottom: '1.25rem' }}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(ROUTES.HOME)}
          leftIcon={<ArrowRight size={15} />}
        >
          العودة للوحة التحكم
        </Button>
      </div>

      {/* Header */}
      <div className={styles.headerRow}>
        <div className={styles.titleArea}>
          <h1>
            <FolderGit2 size={26} style={{ color: '#00B8B8' }} /> مركز المصادر والأدلة الرقمية (Source Center)
          </h1>
          <p>
            اربط بصمتك الرقمية من مصادر موثوقة ليقوم محرك قُدرة بتحويلها إلى أدلة هندسية حقيقية تغذي جواز قدراتك.
          </p>
        </div>

        <Button
          variant="proof"
          size="sm"
          onClick={() => navigate('/profile/passport')}
          leftIcon={<Sparkles size={15} />}
        >
          معاينة جواز القدرات
        </Button>
      </div>

      {/* Connector Trust Model Banner */}
      <div className={styles.trustModelBanner}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <ShieldCheck size={18} style={{ color: '#00B8B8' }} />
          <strong style={{ fontSize: '0.95rem', color: 'var(--ink)' }}>
            نموذج الثقة المعتمد في قُدرة (Connector Trust Model)
          </strong>
        </div>
        <p style={{ fontSize: '0.84rem', color: 'var(--ink-2)', margin: 0 }}>
          قُدرة لا تساوي بين الادعاء الشفهي والدليل البرمجي الفعلي؛ كل مصدر له سقف موثوقية محسوب بدقة:
        </p>

        <div className={styles.trustGrid}>
          <div className={styles.trustCard}>
            <div className={styles.trustCardTitle} style={{ color: '#10B981' }}>
              <CheckCircle2 size={14} /> المستوى 1: رسمي ومباشر (100%)
            </div>
            <div className={styles.trustCardDesc}>
              فحص كود GitHub الفعلي، التحديات المسلمة، والنتائج الإنتاجية المثبتة.
            </div>
          </div>

          <div className={styles.trustCard}>
            <div className={styles.trustCardTitle} style={{ color: '#00B8B8' }}>
              <FileCheck2 size={14} /> المستوى 2: وثائق محققة (85%)
            </div>
            <div className={styles.trustCardDesc}>
              شهادات Coursera/Meta والتراخيص المهنية القابلة للتحقق برابط رسمي.
            </div>
          </div>

          <div className={styles.trustCard}>
            <div className={styles.trustCardTitle} style={{ color: '#F59E0B' }}>
              <AlertCircle size={14} /> المستوى 3: مشاريع ذاتية (55%)
            </div>
            <div className={styles.trustCardDesc}>
              المشاريع والروابط الشخصية التي يرفعها المستخدم وتحتاج فحصاً برمجياً.
            </div>
          </div>

          <div className={styles.trustCard}>
            <div className={styles.trustCardTitle} style={{ color: 'var(--ink-3)' }}>
              <Code2 size={14} /> المستوى 4: نشاط خارجي (20%)
            </div>
            <div className={styles.trustCardDesc}>
              نصوص LinkedIn والادعاءات الذاتية، تعتبر سياقاً مسرّعاً وليست دليلاً بمفردها.
            </div>
          </div>
        </div>
      </div>

      {/* Connectors Grid */}
      <h2 className={styles.categoryTitle}>المصادر المتاحة للربط والمزامنة</h2>

      <div className={styles.connectorsGrid}>
        {/* GitHub Card */}
        <div className={styles.connectorCard}>
          <div>
            <div className={styles.connectorHeader}>
              <div className={styles.connectorIcon} style={{ color: 'var(--ink)' }}>
                <GithubIcon size={24} />
              </div>
              <div>
                <div className={styles.connectorName}>GitHub (مستودعات الكود)</div>
                <span style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 600 }}>المستوى 1: موثوقية عالية جداً</span>
              </div>
            </div>
            <p className={styles.connectorDesc}>
              سحب الـ Commits و Pull Requests واللغات البرمجية تلقائياً واحتساب التعقيد الهندسي لكل مستودع.
            </p>
          </div>

          <div>
            <div className={styles.statusRow}>
              <span>الحالة: <strong style={{ color: '#00B8B8' }}>متصل (@7usseinNaser)</strong></span>
              <span className={styles.badgeConnected}>24 مستودع مفحوص ✓</span>
            </div>
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              <Button
                variant="proof"
                size="sm"
                onClick={() => navigate('/profile/sources/github/inspect')}
                leftIcon={<Sparkles size={14} />}
              >
                الفحص المعمق بالـ AI
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate(ROUTES.GITHUB_SELECT)}
                leftIcon={<RefreshCw size={14} />}
              >
                إعادة مسح المستودعات
              </Button>
            </div>
          </div>
        </div>

        {/* LinkedIn Card */}
        <div className={styles.connectorCard}>
          <div>
            <div className={styles.connectorHeader}>
              <div className={styles.connectorIcon} style={{ color: '#0A66C2' }}>
                <LinkedinIcon size={24} />
              </div>
              <div>
                <div className={styles.connectorName}>LinkedIn (السياق المهني)</div>
                <span style={{ fontSize: '0.75rem', color: '#F59E0B', fontWeight: 600 }}>المستوى 4: مصدر سياق وتسريع</span>
              </div>
            </div>
            <p className={styles.connectorDesc}>
              استيراد النبذة المهنية، وسجل الوظائف، والشهادات المعلنة لتسريع إدخال البروفايل وربطه بالأدلة.
            </p>
          </div>

          <div>
            <div className={styles.statusRow}>
              <span>الحالة: <strong style={{ color: 'var(--ink-2)' }}>تم الربط بالبروفايل</strong></span>
              <span className={styles.badgeConnected}>بيانات مستوردة ✓</span>
            </div>
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <Button
                variant="outline"
                size="sm"
                fullWidth
                onClick={() => navigate('/profile/edit')}
                leftIcon={<ExternalLink size={14} />}
              >
                تعديل ومطابقة البيانات
              </Button>
            </div>
          </div>
        </div>

        {/* Coursera & Certifications Card */}
        <div className={styles.connectorCard}>
          <div>
            <div className={styles.connectorHeader}>
              <div className={styles.connectorIcon} style={{ color: '#0056D2' }}>
                <Award size={24} />
              </div>
              <div>
                <div className={styles.connectorName}>الشهادات الاحترافية (Coursera / Meta)</div>
                <span style={{ fontSize: '0.75rem', color: '#00B8B8', fontWeight: 600 }}>المستوى 2: وثيقة محققة</span>
              </div>
            </div>
            <p className={styles.connectorDesc}>
              ربط الشهادات المعتمدة من Meta وAWS وGoogle ومطابقتها بمشاريع GitHub التطبيقية.
            </p>
          </div>

          <div>
            <div className={styles.statusRow}>
              <span>الحالة: <strong style={{ color: '#00B8B8' }}>2 شهادات نشطة</strong></span>
              <span className={styles.badgeConnected}>موثقة بالرابط ✓</span>
            </div>
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <Button
                variant="outline"
                size="sm"
                fullWidth
                onClick={() => navigate('/profile/edit')}
                leftIcon={<Plus size={14} />}
              >
                إضافة شهادة جديدة
              </Button>
            </div>
          </div>
        </div>

        {/* LeetCode / Challenges Card */}
        <div className={styles.connectorCard}>
          <div>
            <div className={styles.connectorHeader}>
              <div className={styles.connectorIcon} style={{ color: '#FFA116' }}>
                <Code2 size={24} />
              </div>
              <div>
                <div className={styles.connectorName}>LeetCode & التحديات البرمجية</div>
                <span style={{ fontSize: '0.75rem', color: '#06B6D4', fontWeight: 600 }}>المستوى 1: اختبارات حل المشكلات</span>
              </div>
            </div>
            <p className={styles.connectorDesc}>
              إثبات مهارات الـ Data Structures و Algorithms وتتبع المسائل المحلولة بدقة رياضية.
            </p>
          </div>

          <div>
            <div className={styles.statusRow}>
              <span>الحالة: <strong style={{ color: '#F59E0B' }}>جاهز للتوصيل</strong></span>
              <span className={styles.badgePending}>بانتظار التحقق</span>
            </div>
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <Button
                variant="outline"
                size="sm"
                fullWidth
                onClick={() => navigate(ROUTES.CHALLENGES || '/challenges')}
                leftIcon={<Plus size={14} />}
              >
                ربط المعرف وحل التحديات
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SourceCenterPage;
