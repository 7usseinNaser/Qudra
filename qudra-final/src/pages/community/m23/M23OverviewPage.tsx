import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { Badge } from '../../../components/ui/Badge';
import styles from './M23OverviewPage.module.css';

interface CommunityPost {
  id: string;
  author: { name: string; avatar: string; role: string; verified: boolean };
  type: 'question' | 'insight' | 'resource' | 'discussion';
  title: string;
  content: string;
  tags: string[];
  likes: number;
  comments: number;
  time: string;
  isLiked: boolean;
  isSaved: boolean;
}

interface CommunityResource {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'video' | 'course' | 'tool' | 'template';
  author: string;
  tags: string[];
  downloads: number;
  rating: number;
  time: string;
}

const posts: CommunityPost[] = [
  {
    id: 'p1',
    author: { name: 'سارة المطيري', avatar: 'س', role: 'مهندسة Backend', verified: true },
    type: 'insight',
    title: 'كيف حسّنت أداء PostgreSQL بنسبة 40% في مشروع الإنتاج',
    content: 'شاركتكم تجربتي في تحسين استعلامات قاعدة البيانات...',
    tags: ['PostgreSQL', 'Performance', 'Backend'],
    likes: 42,
    comments: 12,
    time: 'قبل 3 ساعات',
    isLiked: false,
    isSaved: true,
  },
  {
    id: 'p2',
    author: { name: 'خالد العتيبي', avatar: 'خ', role: 'مطور Full-Stack', verified: true },
    type: 'question',
    title: 'أفضل ممارسات لـ TypeScript strict mode في فرق كبيرة؟',
    content: 'نحن ننتقل لفريق من 20 مطور ونريد تطبيق strict mode...',
    tags: ['TypeScript', 'Architecture', 'Team'],
    likes: 18,
    comments: 24,
    time: 'قبل 5 ساعات',
    isLiked: true,
    isSaved: false,
  },
  {
    id: 'p3',
    author: { name: 'نورة القحطاني', avatar: 'ن', role: 'مهندسة DevOps', verified: true },
    type: 'resource',
    title: 'قالب Dockerfile متعدد المراحل للإنتاج',
    content: 'قالب جاهز للاستخدام مع أفضل الممارسات الأمنية...',
    tags: ['Docker', 'DevOps', 'Security'],
    likes: 67,
    comments: 8,
    time: 'أمس',
    isLiked: false,
    isSaved: true,
  },
  {
    id: 'p4',
    author: { name: 'أحمد الزهراني', avatar: 'أ', role: 'مهندس بيانات', verified: false },
    type: 'discussion',
    title: 'نقاش: هل ما زلنا نحتاج Redux مع React 18 و Server Components؟',
    content: 'مع ظهور React Server Components و TanStack Query...',
    tags: ['React', 'State Management', 'Architecture'],
    likes: 31,
    comments: 45,
    time: 'أمس',
    isLiked: true,
    isSaved: false,
  },
];

const resources: CommunityResource[] = [
  {
    id: 'r1',
    title: 'دليل شامل: بناء APIs آمنة مع FastAPI',
    description: 'دليل تفصيلي يغطي المصادقة، الترخيص، والتحقق من المدخلات',
    type: 'article',
    author: 'فريق قُدرة',
    tags: ['FastAPI', 'Security', 'Backend'],
    downloads: 1240,
    rating: 4.9,
    time: 'قبل أسبوع',
  },
  {
    id: 'r2',
    title: 'قالب نظام تصميم قابل للتخصيص',
    description: 'نظام تصميم كامل مع توكنز، مكونات، ودعم RTL',
    type: 'template',
    author: 'مصممة UX - ريم الشمري',
    tags: ['Design System', 'React', 'Tailwind'],
    downloads: 890,
    rating: 4.8,
    time: 'قبل أسبوعين',
  },
  {
    id: 'r3',
    title: 'دورة: إتقان Kubernetes للإنتاج',
    description: 'من الأساسيات للنشر المتقدم مع Helm و Operators',
    type: 'course',
    author: 'نورة القحطاني',
    tags: ['Kubernetes', 'DevOps', 'Production'],
    downloads: 560,
    rating: 4.7,
    time: 'قبل شهر',
  },
];

const typeConfig: Record<CommunityPost['type'], { label: string; variant: 'proof' | 'gap' | 'neutral' }> = {
  question: { label: 'سؤال', variant: 'gap' },
  insight: { label: 'رؤية', variant: 'proof' },
  resource: { label: 'مصدر', variant: 'neutral' },
  discussion: { label: 'نقاش', variant: 'neutral' },
};

export function M23OverviewPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'feed' | 'resources' | 'exchange'>('feed');

  return (
    <main id="main" className="wrap" tabIndex={-1} dir="rtl" style={{ padding: 'clamp(1.5rem,4vw,2.75rem) 0 5rem' }}>
      <div className={styles.header}>
        <div>
          <h1 className="scr-t">المجتمع وتبادل المهارات</h1>
          <p className={styles.subtitle}>شارك المعرفة، اطرح الأسئلة، وتبادل الموارد مع مجتمع المواهب</p>
        </div>
        <button className="btn dark" onClick={() => navigate(ROUTES.M23_CREATE)}>إنشاء مشاركة</button>
      </div>

      <div className={styles.tabs}>
        <button className={`${styles.tab} ${activeTab === 'feed' ? styles.active : ''}`} onClick={() => setActiveTab('feed')}>الخلاصات</button>
        <button className={`${styles.tab} ${activeTab === 'resources' ? styles.active : ''}`} onClick={() => setActiveTab('resources')}>الموارد</button>
        <button className={`${styles.tab} ${activeTab === 'exchange' ? styles.active : ''}`} onClick={() => setActiveTab('exchange')}>التبادل</button>
      </div>

      {activeTab === 'feed' && (
        <div className={styles.feed}>
          {posts.map((post) => (
            <article key={post.id} className={styles.post}>
              <div className={styles.postheader}>
                <div className={styles.author}>
                  <div className={styles.avatar} aria-hidden="true">{post.author.avatar}</div>
                  <div>
                    <div className={styles.authorname}>{post.author.name} {post.author.verified && <Badge variant="proof">موثّق</Badge>}</div>
                    <div className={styles.authormeta}>{post.author.role} • {post.time}</div>
                  </div>
                </div>
                <Badge variant={typeConfig[post.type].variant}>{typeConfig[post.type].label}</Badge>
              </div>
              <h3 className={styles.posttitle}>{post.title}</h3>
              <p className={styles.postcontent}>{post.content}</p>
              <div className={styles.posttags}>
                {post.tags.map((tag, idx) => <Badge key={idx} variant="neutral">{tag}</Badge>)}
              </div>
              <div className={styles.postactions}>
                <button className={`${styles.actionbtn} ${post.isLiked ? styles.liked : ''}`} aria-label="إعجاب">
                  <span>❤</span> <span>{post.likes}</span>
                </button>
                <button className={styles.actionbtn} aria-label="تعليقات">
                  <span>💬</span> <span>{post.comments}</span>
                </button>
                <button className={`${styles.actionbtn} ${post.isSaved ? styles.saved : ''}`} aria-label="حفظ">
                  <span>{post.isSaved ? '🔖' : '🔖'}</span>
                </button>
                <button className={styles.actionbtn} aria-label="مشاركة">
                  <span>🔗</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {activeTab === 'resources' && (
        <div className={styles.resources}>
          {resources.map((resource) => (
            <article key={resource.id} className={styles.resourcecard}>
              <div className={styles.resourceicon}>{resource.type === 'article' ? '📄' : resource.type === 'video' ? '▶️' : resource.type === 'course' ? '🎓' : resource.type === 'tool' ? '🔧' : '📋'}</div>
              <div className={styles.resourceinfo}>
                <Badge variant="neutral">{resource.type}</Badge>
                <h4 className={styles.resourcetitle}>{resource.title}</h4>
                <p className={styles.resourcedesc}>{resource.description}</p>
                <div className={styles.resourcemeta}>
                  <span>بواسطة {resource.author}</span>
                  <span>⭐ {resource.rating}</span>
                  <span>📥 {resource.downloads}</span>
                  <span>{resource.time}</span>
                </div>
                <div className={styles.resourcetags}>
                  {resource.tags.map((tag, idx) => <Badge key={idx} variant="neutral">{tag}</Badge>)}
                </div>
              </div>
              <button className="btn ghost">تنزيل</button>
            </article>
          ))}
        </div>
      )}

      {activeTab === 'exchange' && (
        <div className={styles.exchange}>
          <div className={styles.exchangecard}>
            <h3 className={styles.exchangetitle}>طلب مهارة</h3>
            <p className={styles.exchangedesc}>ابحث عن شخص يمتلك مهارة معينة لتتعلم منها أو تتعاون معه</p>
            <button className="btn dark">طلب مهارة</button>
          </div>
          <div className={styles.exchangecard}>
            <h3 className={styles.exchangetitle}>عرض مهارة</h3>
            <p className={styles.exchangedesc}>شارك معرفتك وساعد الآخرين في تطوير مهاراتهم</p>
            <button className="btn dark">عرض مهارة</button>
          </div>
          <div className={styles.exchangecard}>
            <h3 className={styles.exchangetitle}>تبادل المشاريع</h3>
            <p className={styles.exchangedesc}>تعاون في مشاريع حقيقية واكتسب خبرة عملية مشتركة</p>
            <button className="btn dark">استكشاف المشاريع</button>
          </div>
        </div>
      )}
    </main>
  );
}

export default M23OverviewPage;