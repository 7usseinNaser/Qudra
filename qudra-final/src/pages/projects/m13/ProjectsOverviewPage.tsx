import React from 'react';
import { Link } from 'react-router-dom';
import styles from './ProjectsPortfolio.module.css';

interface ProjectItem {
  id: string;
  title: string;
  role: string;
  description: string;
  repoUrl: string;
  liveUrl?: string;
  techStack: string[];
  verificationTier: 'TIER_1' | 'TIER_2' | 'TIER_3';
  evidenceStatus: 'UNDER_REVIEW' | 'VERIFIED' | 'CLAIMED';
}

const SAMPLE_PROJECTS: ProjectItem[] = [
  {
    id: 'prj-01',
    title: 'نظام إدارة التدفقات المالية عالي الموثوقية (FinStream)',
    role: 'Lead Full-Stack Architect',
    description: 'بنية تحتية لمعالجة التحويلات اللحظية واحتساب التسويات البنكية دون أي تفاوت حسابي مع نظام تدقيق شامل.',
    repoUrl: 'https://github.com/qudra/finstream-core',
    liveUrl: 'https://finstream.demo.qudra.io',
    techStack: ['FastAPI', 'PostgreSQL', 'Redis', 'Docker'],
    verificationTier: 'TIER_3',
    evidenceStatus: 'VERIFIED',
  },
  {
    id: 'prj-02',
    title: 'محرك توصيات ومطابقة الكفاءات البرمجية بالذكاء الاصطناعي',
    role: 'AI & Backend Engineer',
    description: 'خوارزمية ذكية لاستخلاص القدرات التقنية من مستودعات GitHub واحتساب المسافات الدلالية بين المتطلبات والمشاريع.',
    repoUrl: 'https://github.com/qudra/ai-skill-matcher',
    techStack: ['Python', 'LangChain', 'pgvector', 'React'],
    verificationTier: 'TIER_2',
    evidenceStatus: 'CLAIMED',
  },
  {
    id: 'prj-03',
    title: 'لوحة تحكم تفاعلية لمراقبة استهلاك الموارد الموزعة',
    role: 'Frontend Specialist',
    description: 'واجهة مستخدم متطورة مبنية بـ React و Motion لمراقبة الخوادم والخدمات المصغرة مع رسوم بيانية فورية.',
    repoUrl: 'https://github.com/qudra/cloud-monitor-ui',
    liveUrl: 'https://cloud-monitor.demo.qudra.io',
    techStack: ['TypeScript', 'React', 'Motion', 'TailwindCSS'],
    verificationTier: 'TIER_1',
    evidenceStatus: 'UNDER_REVIEW',
  },
];

export const ProjectsOverviewPage: React.FC = () => {
  return (
    <div className={styles.container} data-testid="screen-q-0481">
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <span className={styles.screenBadge}>Q-0481 · معرض المشاريع</span>
          <h1 className={styles.title}>بورتفوليو المشاريع وإثبات الملكية</h1>
          <p className={styles.subtitle}>
            المشاريع البرمجية الحقيقية المسندة كأدلة كفاءة مثبتة ومصنفة حسب مستويات التحقق المستقلة.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <Link to="/projects/portfolio/empty" className={styles.secondaryBtn}>
            حالة الفراغ
          </Link>
          <Link to="/projects/portfolio/error" className={styles.secondaryBtn}>
            حالة الخطأ
          </Link>
          <Link to="/projects/portfolio/new" className={styles.primaryBtn} data-testid="add-project-btn">
            + إضافة مشروع جديد كدليل
          </Link>
        </div>
      </div>

      <div className={styles.statsBar}>
        <div className={styles.statCard}>
          <div className={styles.statVal}>3</div>
          <div className={styles.statLabel}>إجمالي المشاريع الموثقة</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statVal} style={{ color: '#059669' }}>Tier 3</div>
          <div className={styles.statLabel}>أعلى مستوى تحقق محقق</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statVal}>8</div>
          <div className={styles.statLabel}>أدلة كفاءات برمجية مسندة</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statVal}>100%</div>
          <div className={styles.statLabel}>روابط مستودعات قابلة للفحص</div>
        </div>
      </div>

      <div className={styles.grid}>
        {SAMPLE_PROJECTS.map((item) => (
          <div key={item.id} className={styles.projectCard}>
            <div>
              <div className={styles.cardHeader}>
                <span
                  className={`${styles.tierBadge} ${
                    item.verificationTier === 'TIER_1'
                      ? styles.tier1
                      : item.verificationTier === 'TIER_2'
                      ? styles.tier2
                      : styles.tier3
                  }`}
                >
                  {item.verificationTier === 'TIER_1'
                    ? 'Tier 1: فحص البيانات'
                    : item.verificationTier === 'TIER_2'
                    ? 'Tier 2: تدقيق الكود الآلي'
                    : 'Tier 3: مراجعة هندسية معتمدة'}
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>
                  {item.evidenceStatus}
                </span>
              </div>

              <h3 className={styles.projectTitle}>{item.title}</h3>
              <div className={styles.projectRole}>الدور: {item.role}</div>
              <p className={styles.projectDesc}>{item.description}</p>

              <div className={styles.tagList}>
                {item.techStack.map((tech) => (
                  <span key={tech} className={styles.tag}>
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className={styles.cardLinks}>
              <Link to={`/projects/portfolio/${item.id}`} className={styles.primaryBtn} style={{ flex: 1, justifyContent: 'center' }}>
                عرض التفاصيل والدليل
              </Link>
              <a href={item.repoUrl} target="_blank" rel="noopener noreferrer" className={styles.linkBtn}>
                الكود ↗
              </a>
              {item.liveUrl && (
                <a href={item.liveUrl} target="_blank" rel="noopener noreferrer" className={styles.linkBtn}>
                  المعاينة ↗
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
