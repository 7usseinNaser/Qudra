import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Mail, ArrowRight, ShieldCheck, FileCheck } from 'lucide-react';
import { MasterProfileService } from '../../services/master-profile.service';
import { MasterProfileData } from '../../services/types';
import { ProfileHeader } from '../../components/domain/ProfileHeader';
import { CapabilityCard } from '../../components/domain/CapabilityCard';
import { EvidenceCard } from '../../components/domain/EvidenceCard';
import { Button } from '../../components/ui/Button';

export const PublicProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<MasterProfileData | null>(null);
  const [activeTab, setActiveTab] = useState<'capabilities' | 'evidence'>('capabilities');
  const [invited, setInvited] = useState(false);

  useEffect(() => {
    MasterProfileService.getProfile().then(data => {
      setProfile(data);
    });
  }, [username]);

  if (!profile) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center' }} dir="rtl">
        <p>جاري تحميل الملف العام...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 'var(--maxw, 74rem)', margin: '0 auto', padding: '1.5rem 1.25rem 5rem' }} dir="rtl">
      <div style={{ marginBottom: '1rem' }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--ink-2)',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontFamily: 'inherit',
            fontSize: '0.85rem'
          }}
        >
          <ArrowRight size={16} />
          <span>رجوع</span>
        </button>
      </div>

      <ProfileHeader
        user={profile.user}
        trustScore={profile.trustScore}
        actions={
          <Button
            variant={invited ? 'secondary' : 'proof'}
            size="md"
            onClick={() => setInvited(true)}
            leftIcon={<Mail size={16} />}
          >
            {invited ? 'تم إرسال الدعوة بنجاح' : 'دعوة لمشروع أو مقابلة'}
          </Button>
        }
      />

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--line)', margin: '2rem 0 1.5rem' }}>
        <button
          onClick={() => setActiveTab('capabilities')}
          style={{
            background: 'none',
            border: 'none',
            padding: '0.75rem 0.5rem',
            fontFamily: 'inherit',
            fontSize: '0.95rem',
            fontWeight: activeTab === 'capabilities' ? 700 : 500,
            color: activeTab === 'capabilities' ? 'var(--proof-text)' : 'var(--ink-3)',
            borderBottom: activeTab === 'capabilities' ? '3px solid var(--proof)' : '3px solid transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <ShieldCheck size={18} />
          <span>المهارات المثبتة ({profile.capabilities.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('evidence')}
          style={{
            background: 'none',
            border: 'none',
            padding: '0.75rem 0.5rem',
            fontFamily: 'inherit',
            fontSize: '0.95rem',
            fontWeight: activeTab === 'evidence' ? 700 : 500,
            color: activeTab === 'evidence' ? 'var(--proof-text)' : 'var(--ink-3)',
            borderBottom: activeTab === 'evidence' ? '3px solid var(--proof)' : '3px solid transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <FileCheck size={18} />
          <span>سجل الأدلة والكود ({profile.evidences.length})</span>
        </button>
      </div>

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

      {activeTab === 'evidence' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {profile.evidences.map(ev => (
            <EvidenceCard key={ev.id} evidence={ev} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PublicProfilePage;
