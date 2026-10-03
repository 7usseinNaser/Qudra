import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  FileCode,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  Briefcase,
  Layers,
  FolderGit2,
  PlusCircle,
  Users,
  Compass,
  Award
} from 'lucide-react';
import { ROUTES } from '../../constants/routes';
import { useRole } from '../../contexts/useRole';
import { MasterProfileService } from '../../services/master-profile.service';
import { MasterProfileData } from '../../services/types';
import { ProfileHeader } from '../../components/domain/ProfileHeader';
import { CapabilityCard } from '../../components/domain/CapabilityCard';
import { Button } from '../../components/ui/Button';
import styles from './HomePage.module.css';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { role, switchRole } = useRole();
  const [profile, setProfile] = useState<MasterProfileData | null>(null);

  useEffect(() => {
    MasterProfileService.getProfile().then(setProfile);
  }, []);

  if (!profile) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center' }} dir="rtl">
        <p>جاري تحميل لوحة تحكم قُدرة...</p>
      </div>
    );
  }

  const verifiedCapsCount = profile.capabilities.filter(c => c.isVerified).length;

  return (
    <div className={styles.homePage} dir="rtl">
      {/* Profile Header with Role Switcher Context */}
      <ProfileHeader
        user={profile.user}
        trustScore={profile.trustScore}
        actions={
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/profile/edit')}
              leftIcon={<Briefcase size={15} />}
            >
              البروفايل المهني (LinkedIn)
            </Button>
            <Button
              variant="proof"
              size="sm"
              onClick={() => navigate('/profile/passport')}
              leftIcon={<Sparkles size={15} />}
            >
              جواز القدرات (Passport)
            </Button>
          </div>
        }
      />

      {/* Role View Toggle Strip */}
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--line)',
        borderRadius: '14px',
        padding: '0.9rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--ink-2)' }}>
            أنت تتصفح حالياً بصفة:
          </span>
          <span style={{
            background: role === 'c' ? 'rgba(245, 158, 11, 0.12)' : 'rgba(0, 184, 184, 0.12)',
            color: role === 'c' ? '#F59E0B' : '#00B8B8',
            border: `1px solid ${role === 'c' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(0, 184, 184, 0.3)'}`,
            padding: '0.2rem 0.65rem',
            borderRadius: '9999px',
            fontSize: '0.82rem',
            fontWeight: 700
          }}>
            {role === 'c' ? '🏢 منشأة / صاحب مشكلة' : '👤 مطور / باحث عن فرص'}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button
            variant={role === 'u' ? 'proof' : 'ghost'}
            size="sm"
            onClick={() => switchRole('u')}
          >
            واجهة المطور (Talent)
          </Button>
          <Button
            variant={role === 'c' ? 'proof' : 'ghost'}
            size="sm"
            onClick={() => switchRole('c')}
          >
            واجهة المنشأة (Organization)
          </Button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 1. TALENT VIEW (دور المطور والكفاءة) */}
      {/* ======================================================== */}
      {role === 'u' && (
        <>
          {/* Quick Hub Launchpad */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem'
          }}>
            <div
              onClick={() => navigate('/profile/edit')}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                borderRadius: '14px',
                padding: '1.25rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#00B8B8')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--line)')}
            >
              <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(0, 184, 184, 0.12)', color: '#00B8B8', display: 'grid', placeItems: 'center' }}>
                <Briefcase size={22} />
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.98rem', color: 'var(--ink)' }}>البروفايل المهني</strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--ink-3)' }}>تعديل الخبرات والتعليم والشهادات</span>
              </div>
            </div>

            <div
              onClick={() => navigate('/profile/sources')}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                borderRadius: '14px',
                padding: '1.25rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#00B8B8')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--line)')}
            >
              <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(6, 182, 212, 0.12)', color: '#06B6D4', display: 'grid', placeItems: 'center' }}>
                <FolderGit2 size={22} />
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.98rem', color: 'var(--ink)' }}>مركز المصادر</strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--ink-3)' }}>ربط GitHub والمشاريع والشهادات</span>
              </div>
            </div>

            <div
              onClick={() => navigate('/profile/passport')}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                borderRadius: '14px',
                padding: '1.25rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#00B8B8')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--line)')}
            >
              <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(16, 185, 129, 0.12)', color: '#10B981', display: 'grid', placeItems: 'center' }}>
                <Sparkles size={22} />
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.98rem', color: 'var(--ink)' }}>جواز القدرات الحي</strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--ink-3)' }}>تصدير سياق الـ AI ورابط المشاركة</span>
              </div>
            </div>

            <div
              onClick={() => navigate(ROUTES.CHALLENGES || '/challenges')}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                borderRadius: '14px',
                padding: '1.25rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#00B8B8')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--line)')}
            >
              <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(245, 158, 11, 0.12)', color: '#F59E0B', display: 'grid', placeItems: 'center' }}>
                <Award size={22} />
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.98rem', color: 'var(--ink)' }}>مختبر التحديات</strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--ink-3)' }}>حل تحديات عملية لرفع تقييم الـ DNA</span>
              </div>
            </div>
          </div>

          {/* Metrics Row */}
          <div className={styles.metricsGrid}>
            <div className={styles.metricCard}>
              <div className={styles.metricIcon}>
                <CheckCircle2 size={24} />
              </div>
              <div>
                <div className={styles.metricVal}>{verifiedCapsCount}</div>
                <div className={styles.metricLabel}>مهارات مبرهنة بالأدلة كودياً</div>
              </div>
            </div>

            <div className={styles.metricCard}>
              <div className={styles.metricIcon}>
                <FileCode size={24} />
              </div>
              <div>
                <div className={styles.metricVal}>{profile.evidences.length}</div>
                <div className={styles.metricLabel}>أدلة كود ومشاريع موثقة</div>
              </div>
            </div>

            <div className={styles.metricCard}>
              <div className={styles.metricIcon}>
                <ShieldCheck size={24} />
              </div>
              <div>
                <div className={styles.metricVal}>{profile.trustScore}%</div>
                <div className={styles.metricLabel}>معدل الموثوقية الهندسية</div>
              </div>
            </div>
          </div>

          {/* Next Best Action Callout */}
          <div className={styles.banner}>
            <div className={styles.bannerText}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Sparkles size={18} style={{ color: '#00B8B8' }} /> الخطوة التالية الموصى بها (Next Best Action)
              </h3>
              <p>لديك فجوة في أدلة الـ Backend Architecture. حل تحدي "FastAPI High-Concurrency Endpoint" لرفع رصيدك الهندسي بنسبة +14%.</p>
            </div>
            <Button
              variant="proof"
              size="md"
              onClick={() => navigate(ROUTES.CHALLENGES || '/challenges')}
            >
              بدء التحدي الآن
            </Button>
          </div>

          {/* Capabilities Section */}
          <div>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>الكفاءات والقدرات المرصودة في ملفك</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/profile/edit')}
                rightIcon={<ArrowLeft size={14} />}
              >
                إدارة المهارات والخبرات
              </Button>
            </div>

            <div className={styles.cardsGrid}>
              {profile.capabilities.map(cap => (
                <CapabilityCard
                  key={cap.id}
                  capability={cap}
                  onClick={() => navigate(ROUTES.MASTER_SKILL_DETAIL.replace(':skill', encodeURIComponent(cap.name)))}
                />
              ))}
            </div>
          </div>
        </>
      )}

      {/* ======================================================== */}
      {/* 2. ORGANIZATION VIEW (دور المنشأة وأصحاب المشكلات) */}
      {/* ======================================================== */}
      {role === 'c' && (
        <>
          {/* Organization Hero Banner */}
          <div style={{
            background: 'linear-gradient(135deg, #071C1D 0%, #0B2C2D 100%)',
            border: '1px solid rgba(0, 184, 184, 0.3)',
            borderRadius: '16px',
            padding: '2rem',
            color: '#FFFFFF'
          }}>
            <span style={{ fontSize: '0.85rem', color: '#00B8B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              مساحة حل المشكلات والمطابقة الذكية
            </span>
            <h2 style={{ fontSize: '1.65rem', fontWeight: 700, margin: '0.5rem 0 0.75rem', fontFamily: 'var(--fh)' }}>
              اطرح مشكلتك التقنية، والذكاء الاصطناعي يطابقها مع أفضل الكفاءات بأدلة مفسرة
            </h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.95rem', maxWidth: '44rem', lineHeight: 1.6, margin: '0 0 1.5rem' }}>
              قُدرة لا تبحث عن مجرد مسميات سيرة ذاتية، بل تبحث في قاعدة أدلة الكود والمشاريع الحقيقية لترشيح مهندسين أثبتوا قدرتهم على حل نفس المشكلة.
            </p>
            <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
              <Button
                variant="proof"
                size="md"
                onClick={() => navigate(ROUTES.PROBLEM)}
                leftIcon={<PlusCircle size={18} />}
              >
                طرح مشكلة جديدة للتحليل
              </Button>
              <Button
                variant="outline"
                size="md"
                onClick={() => navigate(ROUTES.CANDIDATES)}
                leftIcon={<Users size={18} />}
              >
                استعراض المرشحين المطابقين
              </Button>
            </div>
          </div>

          {/* Quick Problem Actions Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.25rem'
          }}>
            <div
              onClick={() => navigate(ROUTES.PROBLEM)}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                borderRadius: '14px',
                padding: '1.5rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#00B8B8')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--line)')}
            >
              <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(0, 184, 184, 0.12)', color: '#00B8B8', display: 'grid', placeItems: 'center', marginBottom: '1rem' }}>
                <Layers size={22} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.4rem', color: 'var(--ink)' }}>
                1. تفكيك المشكلة بالذكاء الاصطناعي
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--ink-3)', margin: 0, lineHeight: 1.5 }}>
                أدخل وصف المشكلة البرمجية أو التحدي ليقوم النظام باستخراج القدرات المطلوبة (Required Capabilities).
              </p>
            </div>

            <div
              onClick={() => navigate(ROUTES.PROBLEM_MATCH_REPORT)}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                borderRadius: '14px',
                padding: '1.5rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#00B8B8')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--line)')}
            >
              <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(6, 182, 212, 0.12)', color: '#06B6D4', display: 'grid', placeItems: 'center', marginBottom: '1rem' }}>
                <Users size={22} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.4rem', color: 'var(--ink)' }}>
                2. المطابقة المفسرة (Explainable Match)
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--ink-3)', margin: 0, lineHeight: 1.5 }}>
                رؤية المرشحين مع كارت التفسير: لماذا رُشح هذا المهندس وما هي الأدلة المثبتة والفجوات المتبقية.
              </p>
            </div>

            <div
              onClick={() => navigate(ROUTES.COMPARE)}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                borderRadius: '14px',
                padding: '1.5rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#00B8B8')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--line)')}
            >
              <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(245, 158, 11, 0.12)', color: '#F59E0B', display: 'grid', placeItems: 'center', marginBottom: '1rem' }}>
                <Compass size={22} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.4rem', color: 'var(--ink)' }}>
                3. مقارنة الكفاءات وبناء الفرق
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--ink-3)', margin: 0, lineHeight: 1.5 }}>
                مقارنة كفاءات مرشحين متعددين لتغطية كافة جوانب المشكلة وتشكيل فريق متكامل هندسياً.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default HomePage;
