import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, FileCode, CheckCircle2, ArrowLeft, ExternalLink } from 'lucide-react';
import { ROUTES } from '../../constants/routes';
import { MasterProfileService } from '../../services/master-profile.service';
import { MasterProfileData } from '../../services/types';
import { ProfileHeader } from '../../components/domain/ProfileHeader';
import { CapabilityCard } from '../../components/domain/CapabilityCard';
import { EvidenceCard } from '../../components/domain/EvidenceCard';
import { Button } from '../../components/ui/Button';
import { GithubIcon } from '../../components/ui/GithubIcon';
import styles from './HomePage.module.css';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<MasterProfileData | null>(null);

  useEffect(() => {
    MasterProfileService.getProfile().then(setProfile);
  }, []);

  if (!profile) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center' }}>
        <p>جاري تحميل لوحة التحكم...</p>
      </div>
    );
  }

  const verifiedCapsCount = profile.capabilities.filter(c => c.isVerified).length;

  return (
    <div className={styles.homePage} dir="rtl">
      <ProfileHeader
        user={profile.user}
        trustScore={profile.trustScore}
        actions={
          <Button
            variant="proof"
            size="sm"
            onClick={() => navigate(ROUTES.MASTER_PROFILE)}
            rightIcon={<ExternalLink size={14} />}
          >
            عرض الـ Master Profile
          </Button>
        }
      />

      {/* Metrics Row */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricIcon}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div className={styles.metricVal}>{verifiedCapsCount}</div>
            <div className={styles.metricLabel}>مهارات مبرهنة بالأدلة</div>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricIcon}>
            <FileCode size={24} />
          </div>
          <div>
            <div className={styles.metricVal}>{profile.evidences.length}</div>
            <div className={styles.metricLabel}>أدلة كود وتقييمات موثقة</div>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricIcon}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <div className={styles.metricVal}>{profile.trustScore}%</div>
            <div className={styles.metricLabel}>معدل موثوقية البروفايل</div>
          </div>
        </div>
      </div>

      {/* Profile Completion Callout */}
      <div className={styles.banner}>
        <div className={styles.bannerText}>
          <h3>ارفع موثوقية ملفك إلى 100% بربط مستودعات GitHub</h3>
          <p>امسح مستودعاتك البرمجية لتتحول مهاراتك من مجرد ادعاءات إلى كفاءات مثبتة ومفصلة هندسياً.</p>
        </div>
        <Button
          variant="proof"
          size="md"
          onClick={() => navigate(ROUTES.GITHUB_CONNECT)}
          leftIcon={<GithubIcon size={18} />}
        >
          ربط مستودع جديد
        </Button>
      </div>

      {/* Capabilities Section */}
      <div>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>المهارات المثبتة في ملفك</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(ROUTES.MASTER_PROFILE)}
            rightIcon={<ArrowLeft size={14} />}
          >
            عرض الكل
          </Button>
        </div>

        <div className={styles.cardsGrid}>
          {profile.capabilities.slice(0, 4).map(cap => (
            <CapabilityCard
              key={cap.id}
              capability={cap}
              onClick={() => navigate(`/profile/master/${cap.id}`)}
            />
          ))}
        </div>
      </div>

      {/* Recent Evidences Section */}
      <div>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>أحدث الأدلة المسجلة</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(ROUTES.MASTER_PROFILE)}
            rightIcon={<ArrowLeft size={14} />}
          >
            عرض السجل الزمني
          </Button>
        </div>

        <div className={styles.cardsGrid}>
          {profile.evidences.slice(0, 3).map(ev => (
            <EvidenceCard key={ev.id} evidence={ev} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
