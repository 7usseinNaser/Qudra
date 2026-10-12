import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { Badge } from '../../../components/ui/Badge';
import styles from './M23ResultsPage.module.css';

interface CommunityStats {
  totalPosts: number;
  totalMembers: number;
  totalResources: number;
  totalExchanges: number;
  topTags: { tag: string; count: number }[];
  topContributors: { name: string; avatar: string; posts: number; likes: number }[];
  engagementRate: number;
}

const stats: CommunityStats = {
  totalPosts: 1247,
  totalMembers: 3421,
  totalResources: 89,
  totalExchanges: 156,
  topTags: [
    { tag: 'React', count: 234 },
    { tag: 'TypeScript', count: 198 },
    { tag: 'PostgreSQL', count: 167 },
    { tag: 'FastAPI', count: 145 },
    { tag: 'Docker', count: 132 },
    { tag: 'Kubernetes', count: 98 },
    { tag: 'DevOps', count: 87 },
    { tag: 'AI/ML', count: 76 },
  ],
  topContributors: [
    { name: 'سارة المطيري', avatar: 'س', posts: 23, likes: 1240 },
    { name: 'نورة القحطاني', avatar: 'ن', posts: 18, likes: 980 },
    { name: 'خالد العتيبي', avatar: 'خ', posts: 15, likes: 760 },
    { name: 'أحمد الزهراني', avatar: 'أ', posts: 12, likes: 540 },
    { name: 'فهد الدوسري', avatar: 'ف', posts: 10, likes: 430 },
  ],
  engagementRate: 12.5,
};

export function M23ResultsPage() {
  const navigate = useNavigate();

  return (
    <main id="main" className="wrap" tabIndex={-1} dir="rtl" style={{ padding: 'clamp(1.5rem,4vw,2.75rem) 0 5rem' }}>
      <div className={styles.header}>
        <button className="btn ghost" onClick={() => navigate(ROUTES.M23_OVERVIEW)}>← العودة</button>
        <h1 className="scr-t">إحصائيات المجتمع</h1>
        <p className={styles.subtitle}>نظرة شاملة على نشاط المجتمع وتبادل المعرفة</p>
      </div>

      <div className={styles.summary}>
        <div className={`box ${styles.summarycard}`}>
          <span className={styles.summaryicon}>📝</span>
          <div>
            <span className={styles.summarynum}>{stats.totalPosts.toLocaleString()}</span>
            <span className={styles.summarylabel}>مشاركة إجمالية</span>
          </div>
        </div>
        <div className={`box ${styles.summarycard}`}>
          <span className={styles.summaryicon}>👥</span>
          <div>
            <span className={styles.summarynum}>{stats.totalMembers.toLocaleString()}</span>
            <span className={styles.summarylabel}>عضو نشط</span>
          </div>
        </div>
        <div className={`box ${styles.summarycard}`}>
          <span className={styles.summaryicon}>📎</span>
          <div>
            <span className={styles.summarynum}>{stats.totalResources}</span>
            <span className={styles.summarylabel}>مورد مشترك</span>
          </div>
        </div>
        <div className={`box ${styles.summarycard}`}>
          <span className={styles.summaryicon}>🔄</span>
          <div>
            <span className={styles.summarynum}>{stats.totalExchanges}</span>
            <span className={styles.summarylabel}>تبادل مهارات</span>
          </div>
        </div>
        <div className={`box ${styles.summarycard}`}>
          <span className={styles.summaryicon}>📊</span>
          <div>
            <span className={styles.summarynum}>{stats.engagementRate}%</span>
            <span className={styles.summarylabel}>معدل التفاعل</span>
          </div>
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.maincol}>
          <div className={`box ${styles.panel}`}>
            <h3 className={styles.paneltitle}>أكثر الوسوم استخداماً</h3>
            <div className={styles.tagcloud}>
              {stats.topTags.map((item, idx) => (
                <span key={idx} className={styles.tagclouditem}>
                  <Badge variant="neutral">
                    {item.tag} <span className="num">({item.count})</span>
                  </Badge>
                </span>
              ))}
            </div>
          </div>

          <div className={`box ${styles.panel}`}>
            <h3 className={styles.paneltitle}>أكثر المساهمين تأثيراً</h3>
            <div className={styles.contributors}>
              {stats.topContributors.map((contributor, idx) => (
                <div key={idx} className={styles.contributor}>
                  <div className={styles.rank}>#{idx + 1}</div>
                  <div className={styles.contributoravatar} aria-hidden="true">{contributor.avatar}</div>
                  <div className={styles.contributorinfo}>
                    <span className={styles.contributorname}>{contributor.name}</span>
                    <span className={styles.contributormeta}>{contributor.posts} مشاركات • {contributor.likes} إعجابات</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.sidecol}>
          <div className={`box ${styles.panel}`}>
            <h3 className={styles.paneltitle}>نمو المجتمع (آخر 30 يوم)</h3>
            <div className={styles.growth}>
              <div className={styles.growthitem}>
                <span className={styles.growthlabel}>مشاركات جديدة</span>
                <span className={`${styles.growthvalue} ${styles.proof}`}>+127</span>
              </div>
              <div className={styles.growthitem}>
                <span className={styles.growthlabel}>أعضاء جدد</span>
                <span className={`${styles.growthvalue} ${styles.proof}`}>+342</span>
              </div>
              <div className={styles.growthitem}>
                <span className={styles.growthlabel}>موارد مضافة</span>
                <span className={`${styles.growthvalue} ${styles.proof}`}>+12</span>
              </div>
              <div className={styles.growthitem}>
                <span className={styles.growthlabel}>تبادلات مكتملة</span>
                <span className={`${styles.growthvalue} ${styles.proof}`}>+23</span>
              </div>
            </div>
          </div>

          <div className={`box ${styles.panel}`}>
            <h3 className={styles.paneltitle}>أعلى المشاركات تفاعلاً</h3>
            <div className={styles.toppests}>
              <div className={styles.toppost}>
                <span className={styles.toppostrank}>1</span>
                <div>
                  <span className={styles.topposttitle}>كيف حسّنت أداء PostgreSQL بنسبة 40%</span>
                  <span className={styles.toppostmeta}>42 إعجاب • 12 تعليق</span>
                </div>
              </div>
              <div className={styles.toppost}>
                <span className={styles.toppostrank}>2</span>
                <div>
                  <span className={styles.topposttitle}>قالب Dockerfile متعدد المراحل</span>
                  <span className={styles.toppostmeta}>67 إعجاب • 8 تعليقات</span>
                </div>
              </div>
              <div className={styles.toppost}>
                <span className={styles.toppostrank}>3</span>
                <div>
                  <span className={styles.topposttitle}>هل نحتاج Redux مع React 18؟</span>
                  <span className={styles.toppostmeta}>31 إعجاب • 45 تعليق</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default M23ResultsPage;