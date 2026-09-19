import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import { ROUTES } from '../../../constants/routes';
import { MasterProfileService } from '../../../services/master-profile.service';
import { MasterTimelineItem } from '../../../services/types';
import { Badge } from '../../../components/ui/Badge';

export const MasterTimelinePage: React.FC = () => {
  const navigate = useNavigate();
  const [timeline, setTimeline] = useState<MasterTimelineItem[]>([]);

  useEffect(() => {
    MasterProfileService.getProfile().then(p => setTimeline(p.timeline));
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
            <Clock size={24} />
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, margin: 0 }}>
            السجل الزمني التراكمي للأدلة
          </h1>
        </div>

        <p style={{ color: 'var(--ink-2)', fontSize: '0.92rem', lineHeight: 1.6, margin: '0 0 1.5rem' }}>
          توثيق زمني غير قابل للتزوير لتطور كفاءاتك الهندسية، والمستودعات والتقييمات التي ساهمت في بناء ملفك.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {timeline.map(item => (
            <div
              key={item.id}
              style={{
                background: 'var(--surface-2)',
                border: '1px solid var(--line-soft)',
                borderRadius: '12px',
                padding: '1.25rem 1.5rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem'
              }}
            >
              <div style={{
                fontFamily: 'var(--fm)',
                fontSize: '0.82rem',
                color: 'var(--ink-3)',
                minWidth: '6.5rem',
                paddingTop: '0.15rem'
              }}>
                {item.date}
              </div>

              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 0.25rem', fontSize: '1.02rem', fontWeight: 700 }}>
                  {item.title}
                </h4>
                <p style={{ margin: '0 0 0.5rem', fontSize: '0.86rem', color: 'var(--ink-2)', lineHeight: 1.5 }}>
                  {item.description}
                </p>
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
      </div>
    </div>
  );
};

export default MasterTimelinePage;
