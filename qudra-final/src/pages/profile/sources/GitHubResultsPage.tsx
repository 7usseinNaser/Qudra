import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Sparkles, ArrowLeft } from 'lucide-react';
import { ROUTES } from '../../../constants/routes';
import { INITIAL_CAPABILITIES } from '../../../services/mock-data';
import { CapabilityCard } from '../../../components/domain/CapabilityCard';
import { Button } from '../../../components/ui/Button';

export const GitHubResultsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: '54rem', margin: '0 auto', padding: '2rem 1.25rem 5rem' }} dir="rtl">
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          background: 'var(--proof-tint)',
          color: 'var(--proof-text)',
          padding: '0.3rem 0.75rem',
          borderRadius: '999px',
          fontSize: '0.8rem',
          fontWeight: 600,
          marginBottom: '0.75rem'
        }}>
          <CheckCircle2 size={16} />
          <span>تم اعتماد الأدلة بنجاح</span>
        </div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 700, margin: '0 0 0.35rem' }}>
          الكفاءات المبرهنة من مستودعاتك
        </h1>
        <p style={{ color: 'var(--ink-2)', fontSize: '0.95rem' }}>
          استخرج محرك التحليل 4 مهارات رئيسية مدعومة بـ 21,350 سطر برمجي ومراجعات كود حية.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.15rem', marginBottom: '2.5rem' }}>
        {INITIAL_CAPABILITIES.slice(0, 4).map(cap => (
          <CapabilityCard
            key={cap.id}
            capability={cap}
            onClick={() => navigate(`/profile/master/${cap.id}`)}
          />
        ))}
      </div>

      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--line)',
        borderRadius: '16px',
        padding: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        boxShadow: 'var(--shadow)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '10px',
            background: 'var(--proof-tint)',
            color: 'var(--proof-text)',
            display: 'grid',
            placeItems: 'center'
          }}>
            <Sparkles size={22} />
          </div>
          <div>
            <h4 style={{ margin: '0 0 0.2rem', fontSize: '1.05rem', fontWeight: 700 }}>
              تم تحديث الـ Master Profile الخاص بك
            </h4>
            <span style={{ fontSize: '0.84rem', color: 'var(--ink-2)' }}>
              أصبحت مهاراتك الآن قابلة للتفسير والمطابقة الدقيقة مع أصحاب المشكلات.
            </span>
          </div>
        </div>

        <Button
          variant="proof"
          size="md"
          onClick={() => navigate(ROUTES.MASTER_PROFILE)}
          rightIcon={<ArrowLeft size={16} />}
        >
          الانتقال إلى الـ Master Profile
        </Button>
      </div>
    </div>
  );
};

export default GitHubResultsPage;
