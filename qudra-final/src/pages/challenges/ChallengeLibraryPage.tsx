import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QudraStore } from '../../services/store';
import type { Challenge, ChallengeDifficulty, ChallengeType } from '../../services/types';
import { ROUTES } from '../../constants/routes';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import styles from './ChallengeLibraryPage.module.css';

const DIFFICULTY_LABEL: Record<ChallengeDifficulty, string> = {
  beginner: 'مبتدئ',
  intermediate: 'متوسط',
  advanced: 'متقدم',
};

const TYPE_LABEL: Record<ChallengeType, string> = {
  coding: 'برمجة',
  design: 'تصميم',
  system_design: 'تصميم نظام',
  debugging: 'تصحيح أخطاء',
};

export function ChallengeLibraryPage() {
  const navigate = useNavigate();
  const allChallenges = useMemo(() => QudraStore.getChallenges(), []);
  const [skillFilter, setSkillFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<ChallengeDifficulty | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<ChallengeType | 'all'>('all');

  const skills = useMemo(() => {
    const set = new Set(allChallenges.map((c) => c.skill));
    return ['all', ...Array.from(set)];
  }, [allChallenges]);

  const filtered = useMemo(() => {
    return allChallenges.filter((c) => {
      if (skillFilter !== 'all' && c.skill !== skillFilter) return false;
      if (difficultyFilter !== 'all' && c.difficulty !== difficultyFilter) return false;
      if (typeFilter !== 'all' && c.type !== typeFilter) return false;
      return true;
    });
  }, [allChallenges, skillFilter, difficultyFilter, typeFilter]);

  const difficulties: (ChallengeDifficulty | 'all')[] = ['all', 'beginner', 'intermediate', 'advanced'];
  const types: (ChallengeType | 'all')[] = ['all', 'coding', 'design', 'system_design', 'debugging'];

  return (
    <main id="main" className="wrap" tabIndex={-1} dir="rtl" style={{ padding: 'clamp(1.5rem,4vw,2.75rem) 0 5rem' }}>
      <div className={styles.headrow}>
        <div>
          <span className="stepno">Growth — مكتبة التحديات</span>
          <h1 className="scr-t">تحديات عملية لإثبات مهاراتك</h1>
          <p className="scr-p">
            كل تحدٍ ينتج دليلاً قابلاً للفحص يضاف لملفك المهاري.
          </p>
        </div>
        <button className="btn ghost" onClick={() => navigate(ROUTES.GAPS)}>← فجواتي</button>
      </div>

      <div className={`box ${styles.filters}`}>
        <div className={styles.filtergroup}>
          <span className={styles.filterlabel}>المهارة</span>
          <div className={styles.chips}>
            {skills.map((s) => (
              <button
                key={s}
                className={`${styles.chip} ${skillFilter === s ? styles.chipActive : ''}`}
                onClick={() => setSkillFilter(s)}
              >
                {s === 'all' ? 'الكل' : s}
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
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="لا توجد تحديات مطابقة"
          description="جرّب تغيير الفلاتر لعرض تحديات أخرى."
          action={<button className="btn ghost" onClick={() => { setSkillFilter('all'); setDifficultyFilter('all'); setTypeFilter('all'); }}>إعادة الفلاتر</button>}
        />
      ) : (
        <div className={styles.grid}>
          {filtered.map((c: Challenge) => (
            <button
              key={c.id}
              className={styles.card}
              onClick={() => navigate(`/challenges/${c.id}`)}
              aria-label={`تفاصيل ${c.title}`}
            >
              <div className={styles.cardhead}>
                <h3 className={styles.cardtitle}>{c.title}</h3>
                <Badge variant={c.difficulty === 'beginner' ? 'proof' : c.difficulty === 'intermediate' ? 'gap' : 'gap'}>
                  {DIFFICULTY_LABEL[c.difficulty]}
                </Badge>
              </div>
              <span className={styles.skill}>{c.skill}</span>
              <div className={styles.meta}>
                <span>{TYPE_LABEL[c.type]}</span>
                <span>·</span>
                <span>{c.expectedTime}</span>
              </div>
              <p className={styles.evidence}>
                <span className={styles.evidencelabel}>الدليل الناتج:</span>
                {c.evidenceValue}
              </p>
            </button>
          ))}
        </div>
      )}
    </main>
  );
}

export default ChallengeLibraryPage;
