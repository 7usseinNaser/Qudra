import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Dna } from 'lucide-react';
import { ROUTES } from '../../../constants/routes';
import { MasterProfileService } from '../../../services/master-profile.service';
import { MasterProfileDNA } from '../../../services/types';
import { Bar } from '../../../components/ui/Bar';
import { Badge } from '../../../components/ui/Badge';

export const MasterDnaPage: React.FC = () => {
  const navigate = useNavigate();
  const [dna, setDna] = useState<MasterProfileDNA[]>([]);

  useEffect(() => {
    MasterProfileService.getProfile().then(p => setDna(p.dna));
  }, []);

  return (
    <div style={{ maxWidth: '50rem', margin: '0 auto', padding: '2rem 1.25rem 5rem' }} dir="rtl">
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

      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--line)',
        borderRadius: '16px',
        padding: '2rem',
        boxShadow: 'var(--shadow)',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: 'var(--proof-tint)',
            color: 'var(--proof-text)',
            display: 'grid',
            placeItems: 'center'
          }}>
            <Dna size={24} />
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, margin: 0 }}>
            الحمض المهاري (Skill DNA)
          </h1>
        </div>

        <p style={{ color: 'var(--ink-2)', fontSize: '0.92rem', lineHeight: 1.6, margin: '0 0 1.5rem' }}>
          بصمة هندسية متعددة الأبعاد تستخرج من سلوكك في كتابة الكود، سرعة الإنجاز، معايير الاختبار، وأسلوب معالجة المشكلات المعقدة.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {dna.map((trait, i) => (
            <div
              key={i}
              style={{
                background: 'var(--surface-2)',
                border: '1px solid var(--line-soft)',
                borderRadius: '12px',
                padding: '1.25rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <strong style={{ fontSize: '1rem' }}>{trait.dimension}</strong>
                <Badge variant={trait.strengthType === 'core' ? 'proof' : 'neutral'}>
                  {trait.score}%
                </Badge>
              </div>

              <p style={{ margin: '0 0 0.6rem', fontSize: '0.84rem', color: 'var(--ink-2)', lineHeight: 1.5 }}>
                {trait.description}
              </p>

              <Bar value={trait.score} size="sm" variant="proof" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MasterDnaPage;
