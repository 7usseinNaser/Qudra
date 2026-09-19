import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, HelpCircle, Plus } from 'lucide-react';
import { ROUTES } from '../../../constants/routes';
import { CapabilitiesService } from '../../../services/capabilities.service';
import { EvidenceService } from '../../../services/evidence.service';
import { Capability, Evidence } from '../../../services/types';
import { EvidenceCard } from '../../../components/domain/EvidenceCard';
import { Bar } from '../../../components/ui/Bar';
import { Button } from '../../../components/ui/Button';

export const CapabilityDetailPage: React.FC = () => {
  const { skill } = useParams<{ skill: string }>();
  const navigate = useNavigate();
  const [cap, setCap] = useState<Capability | null>(null);
  const [evidences, setEvidences] = useState<Evidence[]>([]);

  useEffect(() => {
    if (skill) {
      CapabilitiesService.getById(skill).then(c => {
        if (c) {
          setCap(c);
          EvidenceService.getByCapabilityId(c.id).then(setEvidences);
        }
      });
    }
  }, [skill]);

  if (!cap) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center' }} dir="rtl">
        <p>جاري تحميل تفاصيل المهارة...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '54rem', margin: '0 auto', padding: '2rem 1.25rem 5rem' }} dir="rtl">
      <div style={{ marginBottom: '1.5rem' }}>
        <button
          onClick={() => navigate(ROUTES.MASTER_PROFILE)}
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
          <span>رجوع إلى الـ Master Profile</span>
        </button>
      </div>

      {/* Main Capability Header */}
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--line)',
        borderRadius: '16px',
        padding: '2rem',
        marginBottom: '2rem',
        boxShadow: 'var(--shadow)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <CheckCircle2 size={22} color="var(--proof)" />
              <h1 style={{ fontSize: '1.6rem', fontWeight: 700, margin: 0 }}>{cap.name}</h1>
            </div>
            <span style={{ fontSize: '0.85rem', color: 'var(--ink-3)', fontFamily: 'var(--fm)' }}>
              فئة: {cap.category} • المستوى المعتمد: {cap.level}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/profile/master/${cap.id}/why`)}
              leftIcon={<HelpCircle size={15} />}
            >
              لماذا هذا التقييم؟
            </Button>
            <Button
              variant="proof"
              size="sm"
              onClick={() => navigate(ROUTES.GITHUB_CONNECT)}
              leftIcon={<Plus size={15} />}
            >
              تعزيز الدليل
            </Button>
          </div>
        </div>

        {cap.description && (
          <p style={{ color: 'var(--ink-2)', fontSize: '0.92rem', lineHeight: 1.6, margin: '0 0 1.5rem' }}>
            {cap.description}
          </p>
        )}

        <div style={{ background: 'var(--surface-2)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--line-soft)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.88rem' }}>
            <span style={{ fontWeight: 600 }}>درجة القوة المبرهنة هندسياً</span>
            <span style={{ fontFamily: 'var(--fm)', fontWeight: 700, color: 'var(--proof-text)' }}>
              {cap.strength}% (ثقة التحليل {cap.confidence}%)
            </span>
          </div>
          <Bar value={cap.strength} size="md" variant="proof" />
        </div>
      </div>

      {/* Evidences Section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
            الأدلة الرقمية المرتبطة بهذه المهارة ({evidences.length})
          </h3>
        </div>

        {evidences.length === 0 ? (
          <div style={{
            background: 'var(--surface)',
            border: '1px dashed var(--line)',
            borderRadius: '12px',
            padding: '2.5rem',
            textAlign: 'center'
          }}>
            <p style={{ color: 'var(--ink-2)', margin: '0 0 1rem' }}>
              هذه المهارة مدعومة بتحليل الكود التلقائي من المستودعات الممسوحة.
            </p>
            <Button variant="proof" size="sm" onClick={() => navigate(ROUTES.GITHUB_CONNECT)}>
              إضافة مستودع كود إضافي
            </Button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {evidences.map(ev => (
              <EvidenceCard key={ev.id} evidence={ev} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CapabilityDetailPage;
