import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './PracticeChallenges.module.css';

interface ChallengeItem {
  id: string;
  title: string;
  category: string;
  difficulty: 'EASY' | 'INTERMEDIATE' | 'ADVANCED';
  timeLimit: number;
  description: string;
  tags: string[];
}

const SAMPLE_CHALLENGES: ChallengeItem[] = [
  {
    id: 'ch-01',
    title: 'تطوير نقطة نهاية غير متزامنة (Async Endpoint)',
    category: 'Backend',
    difficulty: 'ADVANCED',
    timeLimit: 45,
    description: 'بناء واجهة برمجية فائقة الأداء لمعالجة الطلبات المتزامنة مع إدارة تجمع الاتصال بقاعدة البيانات.',
    tags: ['FastAPI', 'AsyncIO', 'SQLAlchemy'],
  },
  {
    id: 'ch-02',
    title: 'تحسين أداء عرض المكونات وحالات React',
    category: 'Frontend',
    difficulty: 'INTERMEDIATE',
    timeLimit: 30,
    description: 'معالجة مشكلة إعادة التصيير غير الضرورية وتطبيق نمط المذكرة والاستدعاءات المستقرة.',
    tags: ['React', 'Performance', 'Hooks'],
  },
  {
    id: 'ch-03',
    title: 'بناء خوارزمية مطابقة الكفاءات التوافقية',
    category: 'Algorithms',
    difficulty: 'ADVANCED',
    timeLimit: 60,
    description: 'تنفيذ خوارزمية جيبية لتصنيف وتطابق المتطلبات الهندسية مع الكفاءات الموثقة مع حساب نسبة الثقة.',
    tags: ['Algorithms', 'Matching', 'Python'],
  },
  {
    id: 'ch-04',
    title: 'تصميم هيكل بيانات ذاكرة تخزين مؤقت LRU',
    category: 'Algorithms',
    difficulty: 'EASY',
    timeLimit: 25,
    description: 'بناء بنية LRU Cache تدعم العمليات بزمن قياسي O(1) للقراءة والكتابة.',
    tags: ['Data Structures', 'Caching'],
  },
];

export const PracticeChallengesOverviewPage: React.FC = () => {
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('ALL');

  const filtered = SAMPLE_CHALLENGES.filter((ch) => {
    if (filterCategory !== 'ALL' && ch.category !== filterCategory) return false;
    if (filterDifficulty !== 'ALL' && ch.difficulty !== filterDifficulty) return false;
    return true;
  });

  return (
    <div className={styles.container} data-testid="screen-q-0401">
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <span className={styles.screenBadge}>Q-0401 · نظرة عامة</span>
          <h1 className={styles.title}>مختبر التحديات البرمجية العملية</h1>
          <p className={styles.subtitle}>
            حل تحديات هندسية حقيقية لإثبات الكفاءة الفنية وتوليد أدلة قابلة للتدقيق على منصة قُدرة.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link to="/challenges/practice/empty" className={styles.secondaryBtn}>
            عرض حالة الفراغ
          </Link>
          <Link to="/challenges/practice/error" className={styles.secondaryBtn}>
            عرض حالة الخطأ
          </Link>
        </div>
      </div>

      <div className={styles.statsBar}>
        <div className={styles.statCard}>
          <div className={styles.statVal}>12</div>
          <div className={styles.statLabel}>تحديات متاحة</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statVal}>3</div>
          <div className={styles.statLabel}>أدلة كفاءة مُطالَب بها (Claimed)</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statVal}>94%</div>
          <div className={styles.statLabel}>متوسط دقة الفحص الآلي</div>
        </div>
      </div>

      <div className={styles.filterBar}>
        <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>المجال:</span>
        {['ALL', 'Backend', 'Frontend', 'Algorithms'].map((cat) => (
          <button
            key={cat}
            className={`${styles.filterBtn} ${filterCategory === cat ? styles.filterBtnActive : ''}`}
            onClick={() => setFilterCategory(cat)}
          >
            {cat === 'ALL' ? 'الكل' : cat}
          </button>
        ))}

        <span style={{ fontWeight: 600, fontSize: '0.875rem', marginRight: '1rem' }}>الصعوبة:</span>
        {['ALL', 'EASY', 'INTERMEDIATE', 'ADVANCED'].map((diff) => (
          <button
            key={diff}
            className={`${styles.filterBtn} ${filterDifficulty === diff ? styles.filterBtnActive : ''}`}
            onClick={() => setFilterDifficulty(diff)}
          >
            {diff === 'ALL' ? 'جميع المستويات' : diff === 'EASY' ? 'مبتدئ' : diff === 'INTERMEDIATE' ? 'متوسط' : 'متقدم'}
          </button>
        ))}
      </div>

      <div className={styles.grid}>
        {filtered.map((item) => (
          <div key={item.id} className={styles.card}>
            <div>
              <div className={styles.cardHeader}>
                <span
                  className={`${styles.difficultyBadge} ${
                    item.difficulty === 'EASY'
                      ? styles.diffEasy
                      : item.difficulty === 'INTERMEDIATE'
                      ? styles.diffMed
                      : styles.diffHard
                  }`}
                >
                  {item.difficulty}
                </span>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>⏱ {item.timeLimit} دقيقة</span>
              </div>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardDesc}>{item.description}</p>
            </div>

            <div className={styles.cardFooter}>
              <Link to={`/challenges/practice/${item.id}`} className={styles.secondaryBtn}>
                التفاصيل
              </Link>
              <Link to={`/challenges/practice/${item.id}/attempt`} className={styles.primaryBtn}>
                بدء التحدي ⚡
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
