import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, UserCheck, ShieldCheck } from 'lucide-react';
import { INITIAL_CANDIDATE_MATCHES } from '../../services/mock-data';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export const PeopleDirectoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const people = INITIAL_CANDIDATE_MATCHES.filter(p => 
    p.name.includes(query) || p.roleTitle.includes(query)
  );

  return (
    <div style={{ maxWidth: 'var(--maxw, 74rem)', margin: '0 auto', padding: '2rem 1.25rem 5rem' }} dir="rtl">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: '0 0 0.35rem' }}>دليل الكفاءات والخبراء المعتمدين</h1>
        <p style={{ color: 'var(--ink-2)', fontSize: '0.95rem' }}>
          قائمة بجميع المهندسين والمختصين الذين يملكون ملفات مهارية مبرهنة في قُدرة.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.6rem', 
          background: 'var(--surface)', 
          border: '1px solid var(--line)', 
          borderRadius: '8px', 
          padding: '0.6rem 1rem', 
          flex: 1 
        }}>
          <Search size={18} color="var(--ink-3)" />
          <input
            type="text"
            placeholder="ابحث بالاسم أو التخصص..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{ border: 'none', background: 'none', outline: 'none', width: '100%', fontFamily: 'inherit' }}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {people.map(person => (
          <div 
            key={person.id}
            style={{ 
              background: 'var(--surface)', 
              border: '1px solid var(--line)', 
              borderRadius: '12px', 
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ 
                width: '54px', 
                height: '54px', 
                borderRadius: '50%', 
                background: 'var(--surface-2)', 
                border: '2px solid var(--proof)', 
                display: 'grid', 
                placeItems: 'center',
                fontWeight: 700,
                fontSize: '1.2rem'
              }}>
                {person.name[0]}
              </div>
              <div>
                <h3 style={{ margin: '0 0 0.2rem', fontSize: '1.1rem', fontWeight: 700 }}>{person.name}</h3>
                <span style={{ fontSize: '0.82rem', color: 'var(--ink-3)' }}>{person.roleTitle}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Badge variant="proof" icon={<ShieldCheck size={14} />}>
                <span>موثوقية {person.matchScore}%</span>
              </Badge>
              <Badge variant="neutral">
                <span>{person.verifiedCapabilities.length} مهارات مثبتة</span>
              </Badge>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {person.verifiedCapabilities.map((cap, idx) => (
                <span 
                  key={idx} 
                  style={{ 
                    fontSize: '0.76rem', 
                    background: 'var(--surface-2)', 
                    padding: '0.2rem 0.6rem', 
                    borderRadius: '4px', 
                    color: 'var(--ink-2)',
                    border: '1px solid var(--line-soft)'
                  }}
                >
                  {cap}
                </span>
              ))}
            </div>

            <Button
              variant="proof"
              size="sm"
              fullWidth
              onClick={() => navigate(`/u/${person.username}`)}
              leftIcon={<UserCheck size={16} />}
            >
              عرض الملف المهاري الكامل
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PeopleDirectoryPage;
