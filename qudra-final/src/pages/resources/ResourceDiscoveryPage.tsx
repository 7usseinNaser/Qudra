import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QudraStore } from '../../services/store';
import type { LearningResource, ResourceType, ResourcePrice, ResourceDifficulty } from '../../services/types';
import { ROUTES } from '../../constants/routes';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import styles from './ResourceDiscoveryPage.module.css';

const TYPE_LABEL: Record<ResourceType, string> = {
  course: 'دورة',
  documentation: 'وثائق',
  video: 'فيديو',
  interactive: 'تفاعلي',
  book: 'كتاب',
};

const PRICE_LABEL: Record<ResourcePrice, string> = {
  free: 'مجاني',
  paid: 'مدفوع',
};

const DIFFICULTY_LABEL: Record<ResourceDifficulty, string> = {
  beginner: 'مبتدئ',
  intermediate: 'متوسط',
  advanced: 'متقدم',
};

export function ResourceDiscoveryPage() {
  const navigate = useNavigate();
  const allResources = useMemo(() => QudraStore.getResources(), []);
  const [typeFilter, setTypeFilter] = useState<ResourceType | 'all'>('all');
  const [priceFilter, setPriceFilter] = useState<ResourcePrice | 'all'>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<ResourceDifficulty | 'all'>('all');

  const filtered = useMemo(() => {
    return allResources.filter((r) => {
      if (typeFilter !== 'all' && r.type !== typeFilter) return false;
      if (priceFilter !== 'all' && r.price !== priceFilter) return false;
      if (difficultyFilter !== 'all' && r.difficulty !== difficultyFilter) return false;
      return true;
    });
  }, [allResources, typeFilter, priceFilter, difficultyFilter]);

  const types: (ResourceType | 'all')[] = ['all', 'course', 'documentation', 'video', 'interactive', 'book'];
  const prices: (ResourcePrice | 'all')[] = ['all', 'free', 'paid'];
  const difficulties: (ResourceDifficulty | 'all')[] = ['all', 'beginner', 'intermediate', 'advanced'];

  return (
    <main id="main" className="wrap" tabIndex={-1} dir="rtl" style={{ padding: 'clamp(1.5rem,4vw,2.75rem) 0 5rem' }}>
      <div className={styles.headrow}>
        <div>
          <span className="stepno">Growth — مصادر التعلم</span>
          <h1 className="scr-t">مصادر مقترحة لسد فجواتك</h1>
          <p className="scr-p">
            كل مصدر مرتبط بفجوة محددة ويشرح لماذا ننصح به بالتحديد.
          </p>
        </div>
        <button className="btn ghost" onClick={() => navigate(ROUTES.GAPS)}>← فجواتي</button>
      </div>

      <div className={`box ${styles.filters}`}>
        <div className={styles.filtergroup}>
          <span className={styles.filterlabel}>النوع</span>
          <div className={styles.chips}>
            {types.map((t) => (
              <button
                key={t}
                className={`${styles.chip} ${typeFilter === t ? styles.chipActive : ''}`}
                onClick={() => setTypeFilter(t)}
              >
                {t === 'all' ? 'الكل' : TYPE_LABEL[t]}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.filtergroup}>
          <span className={styles.filterlabel}>السعر</span>
          <div className={styles.chips}>
            {prices.map((p) => (
              <button
                key={p}
                className={`${styles.chip} ${priceFilter === p ? styles.chipActive : ''}`}
                onClick={() => setPriceFilter(p)}
              >
                {p === 'all' ? 'الكل' : PRICE_LABEL[p]}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.filtergroup}>
          <span className={styles.filterlabel}>المستوى</span>
          <div className={styles.chips}>
            {difficulties.map((d) => (
              <button
                key={d}
                className={`${styles.chip} ${difficultyFilter === d ? styles.chipActive : ''}`}
                onClick={() => setDifficultyFilter(d)}
              >
                {d === 'all' ? 'الكل' : DIFFICULTY_LABEL[d]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="لا توجد مصادر مطابقة"
          description="جرّب تغيير الفلاتر لعرض مصادر أخرى."
          action={<button className="btn ghost" onClick={() => { setTypeFilter('all'); setPriceFilter('all'); setDifficultyFilter('all'); }}>إعادة الفلاتر</button>}
        />
      ) : (
        <div className={styles.grid}>
          {filtered.map((r: LearningResource) => (
            <button
              key={r.id}
              className={styles.card}
              onClick={() => navigate(`/resources/${r.id}`)}
              aria-label={`تفاصيل ${r.title}`}
            >
              <div className={styles.cardhead}>
                <h3 className={styles.cardtitle}>{r.title}</h3>
                <Badge variant={r.price === 'free' ? 'proof' : 'gap'}>{PRICE_LABEL[r.price]}</Badge>
              </div>
              <span className={styles.provider}>{r.provider}</span>
              <div className={styles.meta}>
                <span>{TYPE_LABEL[r.type]}</span>
                <span>·</span>
                <span>{r.duration}</span>
                <span>·</span>
                <span>{DIFFICULTY_LABEL[r.difficulty]}</span>
              </div>
              <div className={styles.rating}>
                <span className={styles.stars} aria-hidden="true">{'★'.repeat(Math.round(r.rating))}</span>
                <span className={styles.ratingnum}>{r.rating.toFixed(1)}</span>
              </div>
              <p className={styles.why}>{r.whyRecommended}</p>
            </button>
          ))}
        </div>
      )}
    </main>
  );
}

export default ResourceDiscoveryPage;
