import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ShieldCheck, Filter, ArrowLeft } from 'lucide-react';
import { INITIAL_CANDIDATE_MATCHES } from '../../services/mock-data';
import { MatchScore } from '../../components/domain/MatchScore';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import styles from './DiscoverPage.module.css';

export const DiscoverPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [verifiedOnly, setVerifiedOnly] = useState(true);

  const categories = [
    { id: 'ALL', label: 'الكل' },
    { id: 'BACKEND', label: 'Backend & APIs' },
    { id: 'FRONTEND', label: 'Frontend & UI' },
    { id: 'AI', label: 'AI & Data Science' }
  ];

  const filteredCandidates = INITIAL_CANDIDATE_MATCHES.filter(c => {
    const matchesSearch = c.name.includes(searchQuery) || c.roleTitle.includes(searchQuery);
    if (!matchesSearch) return false;
    if (verifiedOnly && c.status === 'FAR') return false;
    return true;
  });

  return (
    <div className={styles.container} dir="rtl">
      <div className={styles.header}>
        <h1 className={styles.title}>استكشاف الكفاءات المبرهنة</h1>
        <p className={styles.subtitle}>
          ابحث عن مهندسين تم التحقق من كودهم ومشاريعهم بأدلة رقمية دقيقة، بدون سير ذاتية مبالغ فيها.
        </p>
      </div>

      <div className={styles.controlsRow}>
        <div className={styles.searchBox}>
          <Search size={18} color="var(--ink-3)" />
          <input
            type="text"
            placeholder="ابحث بالاسم، المسمى، أو المهارة..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        <div className={styles.filters}>
          <Filter size={16} color="var(--ink-3)" />
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`${styles.filterBtn} ${activeCategory === cat.id ? styles.filterBtnActive : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}

          <button
            className={`${styles.filterBtn} ${verifiedOnly ? styles.filterBtnActive : ''}`}
            onClick={() => setVerifiedOnly(!verifiedOnly)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <ShieldCheck size={14} />
            <span>مثبت فقط</span>
          </button>
        </div>
      </div>

      <div className={styles.grid}>
        {filteredCandidates.map(cand => (
          <div
            key={cand.id}
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              borderRadius: '12px',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ margin: '0 0 0.2rem', fontSize: '1.05rem', fontWeight: 700 }}>{cand.name}</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--ink-3)' }}>{cand.roleTitle}</span>
              </div>
              <MatchScore score={cand.matchScore} status={cand.status} size={48} showStatusLabel={false} />
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {cand.verifiedCapabilities.map((cap, i) => (
                <Badge key={i} variant="proof" showDot>
                  {cap}
                </Badge>
              ))}
              {cand.claimedCapabilities.map((cap, i) => (
                <Badge key={i} variant="gap">
                  {cap}
                </Badge>
              ))}
            </div>

            <p style={{ fontSize: '0.84rem', color: 'var(--ink-2)', margin: '0', lineHeight: 1.5 }}>
              {cand.explanation.summary}
            </p>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', paddingTop: '0.5rem', borderTop: '1px solid var(--line-soft)' }}>
              <Button
                variant="outline"
                size="sm"
                fullWidth
                onClick={() => navigate(`/u/${cand.username}`)}
                rightIcon={<ArrowLeft size={14} />}
              >
                الملف العام
              </Button>
              <Button
                variant="proof"
                size="sm"
                fullWidth
                onClick={() => navigate(`/candidates/${cand.id}`)}
              >
                تفسير المطابقة
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiscoverPage;
