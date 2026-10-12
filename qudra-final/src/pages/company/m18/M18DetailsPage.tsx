import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { Badge } from '../../../components/ui/Badge';
import styles from './M18DetailsPage.module.css';

interface CompanyDetail {
  id: string;
  name: string;
  description: string;
  industry: string;
  size: string;
  location: string;
  website: string;
  verified: boolean;
  foundedYear: number;
  employeeCount: number;
  openRoles: number;
  totalCandidates: number;
  matchRate: number;
}

const companyDetail: CompanyDetail = {
  id: 'comp_01',
  name: 'شركة المنارة التقنية',
  description: 'نحن نبني حلولاً تقنية مبتكرة تخدم قطاع التعليم والتدريب، مع تركيز على الذكاء الاصطناعي وتحليل البيانات. فريقنا يتكون من مهندسين وباحثين متحمسين لحل المشكلات المعقدة.',
  industry: 'تقنية التعليم (EdTech)',
  size: '51-200 موظف',
  location: 'الرياض، المملكة العربية السعودية',
  website: 'https://manara-tech.example.com',
  verified: true,
  foundedYear: 2020,
  employeeCount: 127,
  openRoles: 6,
  totalCandidates: 342,
  matchRate: 87,
};

const teamMembers = [
  { id: 'tm1', name: 'أحمد السعيد', role: 'المدير التقني', avatar: 'أ', verified: true },
  { id: 'tm2', name: 'منى القحطاني', role: 'قائدة فريق التوظيف', avatar: 'م', verified: true },
  { id: 'tm3', name: 'يوسف الدوسري', role: 'كبير مهندسي الحلول', avatar: 'ي', verified: false },
  { id: 'tm4', name: 'ليلى الحربي', role: 'مديرة منتج', avatar: 'ل', verified: true },
];

const recentProblems = [
  { id: 'p1', title: 'نظام توصيات ذكي للمسارات التعليمية', status: 'active', candidates: 45 },
  { id: 'p2', title: 'تحسين خوارزمية مطابقة المهارات', status: 'active', candidates: 32 },
  { id: 'p3', title: 'بنية تحتية قابلة للتوسع للوحة التحكم', status: 'draft', candidates: 0 },
];

export function M18DetailsPage() {
  const navigate = useNavigate();

  return (
    <main id="main" className="wrap" tabIndex={-1} dir="rtl" style={{ padding: 'clamp(1.5rem,4vw,2.75rem) 0 5rem' }}>
      <div className={styles.header}>
        <div className={styles.backlink}>
          <button className="btn ghost" onClick={() => navigate(ROUTES.M18_OVERVIEW)}>← العودة للوحة التحكم</button>
        </div>
        <div className={styles.companyinfo}>
          <div className={styles.avatar} aria-hidden="true">{companyDetail.name.charAt(0)}</div>
          <div>
            <h1 className="scr-t">{companyDetail.name}</h1>
            <p className={styles.meta}>
              {companyDetail.industry} • {companyDetail.size} • {companyDetail.location}
              {companyDetail.verified && <span className={styles.verified}> ✓ موثّقة</span>}
            </p>
          </div>
        </div>
        <div className={styles.headeractions}>
          <button className="btn dark" onClick={() => navigate(ROUTES.FIND_TALENT)}>بحث عن مواهب</button>
          <button className="btn ghost" onClick={() => navigate(ROUTES.JOB_DEFINITION)}>نشر وظيفة</button>
        </div>
      </div>

      <div className={styles.metrics}>
        <div className={`box ${styles.metriccard}`}>
          <span className={styles.metricnum}>{companyDetail.openRoles}</span>
          <span className={styles.metriclabel}>وظائف مفتوحة</span>
        </div>
        <div className={`box ${styles.metriccard}`}>
          <span className={styles.metricnum}>{companyDetail.totalCandidates}</span>
          <span className={styles.metriclabel}>إجمالي المرشحين</span>
        </div>
        <div className={`box ${styles.metriccard}`}>
          <span className={styles.metricnum}>{companyDetail.matchRate}%</span>
          <span className={styles.metriclabel}>معدل المطابقة</span>
        </div>
        <div className={`box ${styles.metriccard}`}>
          <span className={styles.metricnum}>{companyDetail.employeeCount}</span>
          <span className={styles.metriclabel}>حجم الفريق</span>
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.maincol}>
          <div className={`box ${styles.panel}`}>
            <h3 className={styles.paneltitle}>حول الشركة</h3>
            <p className={styles.description}>{companyDetail.description}</p>
            <div className={styles.details}>
              <div className={styles.detailitem}>
                <span className={styles.detaillabel}>تأسست</span>
                <span className={styles.detailvalue}>{companyDetail.foundedYear}</span>
              </div>
              <div className={styles.detailitem}>
                <span className={styles.detaillabel}>الموقع الإلكتروني</span>
                <a href={companyDetail.website} target="_blank" rel="noopener noreferrer" className={styles.detailvalue}>{companyDetail.website}</a>
              </div>
              <div className={styles.detailitem}>
                <span className={styles.detaillabel}>الحالة</span>
                <Badge variant={companyDetail.verified ? 'proof' : 'gap'}>
                  {companyDetail.verified ? 'موثّقة' : 'قيد التحقق'}
                </Badge>
              </div>
            </div>
          </div>

          <div className={`box ${styles.panel}`}>
            <h3 className={styles.paneltitle}>المشاكل الحديثة</h3>
            <div className={styles.problemlist}>
              {recentProblems.map((p) => (
                <div key={p.id} className={styles.problemitem}>
                  <div className={styles.probleminfo}>
                    <span className={styles.problemtitle}>{p.title}</span>
                    <span className={styles.problemmeta}>{p.candidates} مرشح</span>
                  </div>
                  <Badge variant={p.status === 'active' ? 'proof' : p.status === 'draft' ? 'neutral' : 'gap'}>
                    {p.status === 'active' ? 'نشط' : p.status === 'draft' ? 'مسودة' : 'مغلق'}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.sidecol}>
          <div className={`box ${styles.panel}`}>
            <h3 className={styles.paneltitle}>أعضاء الفريق</h3>
            <div className={styles.teammembers}>
              {teamMembers.map((m) => (
                <div key={m.id} className={styles.teammember}>
                  <div className={styles.memberavatar} aria-hidden="true">{m.avatar}</div>
                  <div className={styles.memberinfo}>
                    <span className={styles.membername}>{m.name}</span>
                    <span className={styles.memberrole}>{m.role}</span>
                  </div>
                  {m.verified && <Badge variant="proof">موثّق</Badge>}
                </div>
              ))}
            </div>
          </div>

          <div className={`box ${styles.panel}`}>
            <h3 className={styles.paneltitle}>إجراءات سريعة</h3>
            <div className={styles.quickactions}>
              <button className="btn ghost block" onClick={() => navigate(ROUTES.M18_CREATE)}>
                إنشاء مشكلة جديدة
              </button>
              <button className="btn ghost block" onClick={() => navigate(ROUTES.COMPANY_CANDIDATES)}>
                عرض جميع المرشحين
              </button>
              <button className="btn ghost block" onClick={() => navigate(ROUTES.COMPANY_COMPARE)}>
                مقارنة المرشحين
              </button>
              <button className="btn ghost block" onClick={() => navigate(ROUTES.TEAM_BUILDER)}>
                بناء فريق
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default M18DetailsPage;