import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, FileCheck, Dna, Clock, Plus, Share2 } from 'lucide-react';
import { ROUTES } from '../../../constants/routes';
import { MasterProfileService } from '../../../services/master-profile.service';
import { MasterProfileData } from '../../../services/types';
import { ProfileHeader } from '../../../components/domain/ProfileHeader';
import { CapabilityCard } from '../../../components/domain/CapabilityCard';
import { EvidenceCard } from '../../../components/domain/EvidenceCard';
import { Button } from '../../../components/ui/Button';
import { Bar } from '../../../components/ui/Bar';
import { Badge } from '../../../components/ui/Badge';
import { Skeleton } from '../../../components/ui/Skeleton';
import { ErrorState } from '../../../components/ui/ErrorState';

export const MasterProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<MasterProfileData | null>(null);
  const [activeTab, setActiveTab] = useState<'capabilities' | 'evidence' | 'dna' | 'timeline'>('capabilities');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    MasterProfileService.getProfile()
      .then((data) => { if (active) setProfile(data); })
      .catch(() => { if (active) setError('تعذر تحميل الملف المهاري. تحقق من الاتصال وحاول مرة أخرى.'); });
    return () => { active = false; };
  }, []);

  if (error && !profile) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center' }} dir="rtl">
        <ErrorState title="تعذر تحميل الملف المهاري" message={error}
          onRetry={() => window.location.reload()} />
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={{ padding: '2rem', maxWidth: 'var(--maxw, 74rem)', margin: '0 auto' }} dir="rtl">
        <Skeleton height={80} />
        <div style={{ marginTop: '1rem' }}><Skeleton height={60} /></div>
        <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          <Skeleton height={160} /><Skeleton height={160} /><Skeleton height={160} />
        </div>
      </div>
    );
  }

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ maxWidth: 'var(--maxw, 74rem)', margin: '0 auto', padding: '1.5rem 1.25rem 5rem' }} dir="rtl">
      {/* Header */}
      <ProfileHeader
        user={profile.user}
        trustScore={profile.trustScore}
        actions={
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              leftIcon={<Share2 size={15} />}
            >
              {copied ? 'تم نسخ الرابط!' : 'مشاركة الملف'}
            </Button>
            <Button
              variant="proof"
              size="sm"
              onClick={() => navigate(ROUTES.GITHUB_CONNECT)}
              leftIcon={<Plus size={15} />}
            >
              إضافة دليل كود
            </Button>
          </div>
        }
      />

      {/* Trust & Verification Summary Bar */}
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--line)',
        borderRadius: '12px',
        padding: '1.25rem 1.5rem',
        margin: '1.5rem 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div style={{ flex: '1 1 18rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.85rem' }}>
            <span style={{ fontWeight: 600 }}>نسبة المهارات المثبتة بأدلة حقيقية</span>
            <span style={{ fontFamily: 'var(--fm)', fontWeight: 700, color: 'var(--proof-text)' }}>
              {Math.round(profile.verifiedRatio * 100)}% مبرهنة
            </span>
          </div>
          <Bar value={profile.verifiedRatio * 100} size="sm" variant="proof" />
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem' }}>
          <div>
            <span style={{ color: 'var(--ink-3)', display: 'block' }}>إجمالي الأدلة</span>
            <strong style={{ fontFamily: 'var(--fm)', fontSize: '1.2rem' }}>{profile.evidences.length}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--ink-3)', display: 'block' }}>المهارات المقيمة</span>
            <strong style={{ fontFamily: 'var(--fm)', fontSize: '1.2rem' }}>{profile.capabilities.length}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--ink-3)', display: 'block' }}>الموثوقية الهندسية</span>
            <strong style={{ fontFamily: 'var(--fm)', fontSize: '1.2rem', color: 'var(--proof-text)' }}>
              {profile.trustScore}%
            </strong>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--line)', marginBottom: '1.75rem', overflowX: 'auto' }}>
        <button
          onClick={() => setActiveTab('capabilities')}
          style={{
            background: 'none',
            border: 'none',
            padding: '0.85rem 0.6rem',
            fontFamily: 'inherit',
            fontSize: '0.95rem',
            fontWeight: activeTab === 'capabilities' ? 700 : 500,
            color: activeTab === 'capabilities' ? 'var(--proof-text)' : 'var(--ink-3)',
            borderBottom: activeTab === 'capabilities' ? '3px solid var(--proof)' : '3px solid transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            whiteSpace: 'nowrap'
          }}
        >
          <ShieldCheck size={18} />
          <span>المهارات المبرهنة ({profile.capabilities.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('evidence')}
          style={{
            background: 'none',
            border: 'none',
            padding: '0.85rem 0.6rem',
            fontFamily: 'inherit',
            fontSize: '0.95rem',
            fontWeight: activeTab === 'evidence' ? 700 : 500,
            color: activeTab === 'evidence' ? 'var(--proof-text)' : 'var(--ink-3)',
            borderBottom: activeTab === 'evidence' ? '3px solid var(--proof)' : '3px solid transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            whiteSpace: 'nowrap'
          }}
        >
          <FileCheck size={18} />
          <span>سجل الأدلة والمستودعات ({profile.evidences.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('dna')}
          style={{
            background: 'none',
            border: 'none',
            padding: '0.85rem 0.6rem',
            fontFamily: 'inherit',
            fontSize: '0.95rem',
            fontWeight: activeTab === 'dna' ? 700 : 500,
            color: activeTab === 'dna' ? 'var(--proof-text)' : 'var(--ink-3)',
            borderBottom: activeTab === 'dna' ? '3px solid var(--proof)' : '3px solid transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            whiteSpace: 'nowrap'
          }}
        >
          <Dna size={18} />
          <span>الحمض المهاري (Skill DNA)</span>
        </button>

        <button
          onClick={() => setActiveTab('timeline')}
          style={{
            background: 'none',
            border: 'none',
            padding: '0.85rem 0.6rem',
            fontFamily: 'inherit',
            fontSize: '0.95rem',
            fontWeight: activeTab === 'timeline' ? 700 : 500,
            color: activeTab === 'timeline' ? 'var(--proof-text)' : 'var(--ink-3)',
            borderBottom: activeTab === 'timeline' ? '3px solid var(--proof)' : '3px solid transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            whiteSpace: 'nowrap'
          }}
        >
          <Clock size={18} />
          <span>السجل الزمني التراكمي</span>
        </button>
      </div>

      {/* Tab 1: Capabilities */}
      {activeTab === 'capabilities' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {profile.capabilities.map(cap => (
            <CapabilityCard
              key={cap.id}
              capability={cap}
              onClick={() => navigate(`/profile/master/${cap.id}`)}
            />
          ))}
        </div>
      )}

      {/* Tab 2: Evidences */}
      {activeTab === 'evidence' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {profile.evidences.map(ev => (
            <EvidenceCard key={ev.id} evidence={ev} />
          ))}
        </div>
      )}

      {/* Tab 3: DNA */}
      {activeTab === 'dna' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {profile.dna.map((trait, i) => (
            <div
              key={i}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                borderRadius: '12px',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>{trait.dimension}</h4>
                <Badge variant="proof">{trait.score}%</Badge>
              </div>
              <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--ink-2)', lineHeight: 1.5 }}>
                {trait.description}
              </p>
              <Bar value={trait.score} size="sm" variant="proof" />
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Timeline */}
      {activeTab === 'timeline' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {profile.timeline.map(item => (
            <div
              key={item.id}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                borderRadius: '12px',
                padding: '1.25rem 1.5rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem'
              }}
            >
              <div style={{
                fontFamily: 'var(--fm)',
                fontSize: '0.8rem',
                color: 'var(--ink-3)',
                minWidth: '6rem',
                paddingTop: '0.2rem'
              }}>
                {item.date}
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 0.25rem', fontSize: '1.02rem', fontWeight: 700 }}>{item.title}</h4>
                <p style={{ margin: '0 0 0.5rem', fontSize: '0.86rem', color: 'var(--ink-2)' }}>{item.description}</p>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {item.capabilityNames.map((n, i) => (
                    <Badge key={i} variant="neutral">{n}</Badge>
                  ))}
                </div>
              </div>
              <Badge variant="proof">تأثير +{item.impactScore}%</Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MasterProfilePage;
