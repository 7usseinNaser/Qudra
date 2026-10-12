import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { Badge } from '../../../components/ui/Badge';
import styles from './M23DetailsPage.module.css';

interface PostDetail {
  id: string;
  author: { name: string; avatar: string; role: string; verified: boolean; bio: string };
  type: 'question' | 'insight' | 'resource' | 'discussion';
  title: string;
  content: string;
  tags: string[];
  likes: number;
  comments: Comment[];
  time: string;
  isLiked: boolean;
  isSaved: boolean;
}

interface Comment {
  id: string;
  author: { name: string; avatar: string; role: string; verified: boolean };
  content: string;
  time: string;
  likes: number;
  replies: Comment[];
}

const post: PostDetail = {
  id: 'p1',
  author: {
    name: 'سارة المطيري',
    avatar: 'س',
    role: 'مهندسة Backend',
    verified: true,
    bio: 'متخصصة في FastAPI، PostgreSQL، وأنظمة موزعة. أحب مشاركة المعرفة التقنية.',
  },
  type: 'insight',
  title: 'كيف حسّنت أداء PostgreSQL بنسبة 40% في مشروع الإنتاج',
  content: `عندما واجهنا مشكلة أداء في نظام معالجة الطلبات، كان متوسط زمن الاستجابة 2.3 ثانية. بعد تحليل خطة التنفيذ (EXPLAIN ANALYZE)، اكتشفت عدة مشاكل:

1. **فهرسة مفقودة**: جداول الطلبات والمنتجات كانت تفتقر فهارس مركبة على الأعمدة المستخدمة في JOIN و WHERE clauses.

2. **استعلامات N+1**: كود ORM كان ينفذ استعلام منفصل لكل منتج في الطلب.

3. **إحصائيات قديمة**: PostgreSQL planner كان يستخدم تقديرات قديمة لحجم البيانات.

**الحلول المطبقة:**
- إضافة فهارس B-Tree مركبة على (user_id, created_at) و (status, priority)
- تحويل الاستعلامات لاستخدام JOIN مع SELECT دُفعي واحد
- تشغيل ANALYZE دورياً وجدولة pg_stat_clear_snapshot

**النتائج:**
- زمن الاستجابة انخفض من 2.3ث إلى 1.4ث (تحسن 39%)
- استخدام CPU انخفض 30%
- صفر timeouts تحت الحمل العالي

الكود الكامل متاح في مستودع GitHub المرفق.`,
  tags: ['PostgreSQL', 'Performance', 'Backend', 'Optimization'],
  likes: 42,
  comments: [
    {
      id: 'c1',
      author: { name: 'خالد العتيبي', avatar: 'خ', role: 'مطور Full-Stack', verified: true },
      content: 'ممتاز! هل جربت فهارس BRIN للجداول الكبيرة جداً؟',
      time: 'قبل ساعتين',
      likes: 8,
      replies: [
        {
          id: 'c1r1',
          author: { name: 'سارة المطيري', avatar: 'س', role: 'مهندسة Backend', verified: true },
          content: 'نعم، في جداول السجلات (logs) استخدمنا BRIN مع partition by time وكان أسرع 10x من B-Tree للمسح التسلسلي.',
          time: 'قبل ساعة',
          likes: 3,
          replies: [],
        },
      ],
    },
    {
      id: 'c2',
      author: { name: 'نورة القحطاني', avatar: 'ن', role: 'مهندسة DevOps', verified: true },
      content: 'شكراً على المشاركة المفصلة. هل يمكن مشاركة سكريبت مراقبة الفهارس غير المستخدمة؟',
      time: 'قبل 3 ساعات',
      likes: 5,
      replies: [],
    },
  ],
  time: 'قبل 3 ساعات',
  isLiked: false,
  isSaved: true,
};

const typeConfig: Record<PostDetail['type'], { label: string; variant: 'proof' | 'gap' | 'neutral' }> = {
  question: { label: 'سؤال', variant: 'gap' },
  insight: { label: 'رؤية', variant: 'proof' },
  resource: { label: 'مصدر', variant: 'neutral' },
  discussion: { label: 'نقاش', variant: 'neutral' },
};

export function M23DetailsPage() {
  const navigate = useNavigate();

  const renderComments = (comments: Comment[], depth = 0) => (
    <div className={styles.commentslist}>
      {comments.map((comment) => (
        <div key={comment.id} className={styles.comment} style={{ marginInlineStart: depth * 24 }}>
          <div className={styles.commentheader}>
            <div className={styles.avatar} aria-hidden="true">{comment.author.avatar}</div>
            <div>
              <div className={styles.commentauthor}>{comment.author.name} {comment.author.verified && <Badge variant="proof">موثّق</Badge>}</div>
              <div className={styles.commentmeta}>{comment.author.role} • {comment.time}</div>
            </div>
          </div>
          <p className={styles.commentcontent}>{comment.content}</p>
          <div className={styles.commentactions}>
            <button className={styles.commentaction}>❤ {comment.likes}</button>
            <button className={styles.commentaction}>رد</button>
          </div>
          {comment.replies.length > 0 && renderComments(comment.replies, depth + 1)}
        </div>
      ))}
    </div>
  );

  return (
    <main id="main" className="wrap" tabIndex={-1} dir="rtl" style={{ padding: 'clamp(1.5rem,4vw,2.75rem) 0 5rem' }}>
      <div className={styles.header}>
        <button className="btn ghost" onClick={() => navigate(ROUTES.M23_OVERVIEW)}>← العودة</button>
      </div>

      <article className={styles.post}>
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

        <h1 className={styles.posttitle}>{post.title}</h1>

        <div className={styles.posttags}>
          {post.tags.map((tag, idx) => <Badge key={idx} variant="neutral">{tag}</Badge>)}
        </div>

        <div className={styles.postcontent} dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br/>') }} />

        <div className={styles.postactions}>
          <button className={`${styles.actionbtn} ${post.isLiked ? styles.liked : ''}`} aria-label="إعجاب">
            <span>❤</span> <span>{post.likes}</span>
          </button>
          <button className={styles.actionbtn} aria-label="تعليقات">
            <span>💬</span> <span>{post.comments.length}</span>
          </button>
          <button className={`${styles.actionbtn} ${post.isSaved ? styles.saved : ''}`} aria-label="حفظ">
            <span>{post.isSaved ? '🔖' : '🔖'}</span>
          </button>
          <button className={styles.actionbtn} aria-label="مشاركة">
            <span>🔗</span>
          </button>
        </div>
      </article>

      <div className={styles.commentssection}>
        <h3 className={styles.commentstitle}>التعليقات ({post.comments.length})</h3>
        {renderComments(post.comments)}

        <div className={styles.commentform}>
          <div className={styles.avatar} aria-hidden="true">أنت</div>
          <textarea className={styles.commentinput} placeholder="أضف تعليقاً..." rows={3} />
          <button className="btn dark" style={{ marginTop: '0.5rem', alignSelf: 'flex-end' }}>نشر</button>
        </div>
      </div>
    </main>
  );
}

export default M23DetailsPage;