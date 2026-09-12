import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { Badge } from '../../components/ui/Badge';
import styles from './CompanyHomePage.module.css';

interface OpenRole {
  id: string;
  title: string;
  applicants: number;
  status: 'active' | 'draft' | 'closed';
}

interface ActivityItem {
  id: string;
  text: string;
  time: string;
}

export function CompanyHomePage() {
  const navigate = useNavigate();
  const [orgName] = useState('شركة المنارة التقنية');
  const [isVerified] = useState(true);

  const openRoles: OpenRole[] = [
    { id: 'role_01', title: 'مهندسة برمجيات أول — Backend', applicants: 12, status: 'active' },
    { id: 'role_02', title: 'مطورة واجهات أمامية — React', applicants: 8, status: 'active' },
    { id: 'role_03', title: 'قائد فريق منتج', applicants: 0, status: 'draft' },
  { id: 'role_04', title: 'مهندس DevOps', applicants: 23, status: 'closed' },
  { id: 'role_05', title: 'مصممة UX أول', applicants: 5, status: 'active' },
  { id: 'role_06', title: 'محلل بيانات', applicants: 15, status: 'active' },
  { id: 'role_07', title: 'مدير منتج تقني', applicants: 3, status: 'draft' },
  { id: 'role_08', title: 'مهندس أمان سيبراني', applicants: 18, status: 'closed' },
  { id: 'role_09', title: 'مطور Full-Stack', applicants: 31, status: 'active' },
    { id: 'role_10', title: 'مهندس بيانات', applicants: 7, status: 'active' },
  { id: 'role_11', title: 'مصمم UI', applicants: 4, status: 'draft' },
    { id: 'role_12', title: 'مهندس حلول سحابية', applicants: 9, status: 'closed' },
  { id: 'role_13', title: 'مطور Mobile (iOS)', applicants: 11, status: 'active' },
    { id: 'role_14', title: 'مهندس QA', applicants: 6, status: 'active' },
    { id: 'role_15', title: 'مدير مشاريع تقنية', applicants: 2, status: 'draft' },
  ];

  const problems = [
    { id: 'p1', title: 'تحسين أداء منصة البحث', status: 'active' },
    { id: 'p2', title: 'بناء نظام توصيات ذكي', status: 'active' },
    { id: 'p3', title: 'إعادة تصميم بنية الـ API', status: 'draft' },
    { id: 'p4', title: 'تطبيق لوحة تحكم تحليلية', status: 'active' },
    { id: 'p5', title: 'نظام مراقبة الأداء اللحظي', status: 'draft' },
  ];

  const candidateActivity: ActivityItem[] = [
    { id: 'a1', text: 'سارة المطيري أكملت تحدي FastAPI', time: 'قبل ساعتين' },
    { id: 'a2', text: 'خالد العتيبي رفع دليل جديد على GitHub', time: 'قبل 5 ساعات' },
    { id: 'a3', text: 'نورة القحطاني قبلت دعوة تحدي', time: 'أمس' },
    { id: 'a4', text: 'فهد الدوسري حدّث ملفه المهاري', time: 'أمس' },
    { id: 'a5', text: 'ريم الشمري أكملت تقييماً شفاهياً', time: 'قبل يومين' },
  ];

  const savedCandidates = [
    { id: 'c1', name: 'سارة المطيري', title: 'مهندسة Backend', matchScore: 91 },
    { id: 'c2', name: 'خالد العتيبي', title: 'مطور Full-Stack', matchScore: 86 },
    { id: 'c3', name: 'نورة القحطاني', title: 'مهندسة DevOps', matchScore: 82 },
    { id: 'c4', name: 'فهد الدوسري', title: 'مهندس أمن سيبراني', matchScore: 78 },
    { id: 'c5', name: 'ريم الشمري', title: 'مصممة UX', matchScore: 75 },
  ];

  const teamActivity: ActivityItem[] = [
    { id: 't1', text: 'أحمد نشر وظيفة جديدة: مطور Mobile', time: 'قبل ساعة' },
    { id: 't2', text: 'منى دعت 3 مرشحين لتحدي', time: 'قبل 3 ساعات' },
    { id: 't3', text: 'يوسف أغلق وظيفة مهندس DevOps', time: 'أمس' },
    { id: 't4', text: 'ليلى أنشأت مشكلة جديدة: نظام توصيات', time: 'أمس' },
    { id: 't5', text: 'عمر حفظ 5 مرشحين جدد', time: 'قبل يومين' },
  ];

  const statusLabel: Record<string, string> = { active: 'نشط', draft: 'مسودة', closed: 'مغلق' };
  const statusVariant: Record<string, 'proof' | 'gap' | 'neutral'> = { active: 'proof', draft: 'neutral', closed: 'gap' };

  return (
    <main id="main" className="wrap" tabIndex={-1} dir="rtl" style={{ padding: 'clamp(1.5rem,4vw,2.75rem) 0 5rem' }}>
      <div className={styles.header}>
        <div className={styles.orgidentity}>
          <div className={styles.orglogo} aria-hidden="true">م</div>
          <div>
            <h1 className="scr-t">{orgName}</h1>
            <p className="scr-p">
              {isVerified ? (
                <span className={styles.verified}>✓ جهة موثّقة</span>
              ) : (
                <span className={styles.unverified}>جهة غير موثّقة بعد</span>
              )}
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
          <span className={styles.metricnum}>{openRoles.filter(r => r.status === 'active').length}</span>
          <span className={styles.metriclabel}>وظائف نشطة</span>
        </div>
        <div className={`box ${styles.metriccard}`}>
          <span className={styles.metricnum}>{openRoles.reduce((sum, r) => sum + r.applicants, 0)}</span>
          <span className={styles.metriclabel}>إجمالي المتقدمين</span>
        </div>
        <div className={`box ${styles.metriccard}`}>
          <span className={styles.metricnum}>{savedCandidates.length}</span>
          <span className={styles.metriclabel}>مرشحون محفوظون</span>
        </div>
        <div className={`box ${styles.metriccard}`}>
          <span className={styles.metricnum}>{problems.filter(p => p.status === 'active').length}</span>
          <span className={styles.metriclabel}>مشاكل نشطة</span>
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.maincol}>
          <div className={`box ${styles.panel}`}>
            <h3 className={styles.paneltitle}>الوظائف المفتوحة</h3>
            <div className={styles.rolelist}>
              {openRoles.map((role) => (
                <div key={role.id} className={styles.roleitem}>
                  <div className={styles.roleinfo}>
                    <span className={styles.roletitle}>{role.title}</span>
                    <span className={styles.rolemeta}>{role.applicants} متقدم</span>
                  </div>
                  <Badge variant={statusVariant[role.status]}>{statusLabel[role.status]}</Badge>
                </div>
              ))}
            </div>
          </div>

          <div className={`box ${styles.panel}`}>
            <h3 className={styles.paneltitle}>المشاكل</h3>
            <div className={styles.rolelist}>
              {problems.map((p) => (
                <div key={p.id} className={styles.roleitem}>
                  <div className={styles.roleinfo}>
                    <span className={styles.roletitle}>{p.title}</span>
                  </div>
                  <Badge variant={statusVariant[p.status]}>{statusLabel[p.status]}</Badge>
                </div>
              ))}
            </div>
            <button className="btn ghost" style={{ marginTop: '0.8rem', width: '100%' }} onClick={() => navigate(ROUTES.PROBLEM)}>
              إنشاء مشكلة جديدة
            </button>
          </div>
        </div>

        <div className={styles.sidecol}>
          <div className={`box ${styles.panel}`}>
            <h3 className={styles.paneltitle}>نشاط المرشحين</h3>
            <div className={styles.activitylist}>
              {candidateActivity.map((a) => (
                <div key={a.id} className={styles.activityitem}>
                  <span className={styles.activitydot} aria-hidden="true" />
                  <div>
                    <p className={styles.activitytext}>{a.text}</p>
                    <span className={styles.activitytime}>{a.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`box ${styles.panel}`}>
            <h3 className={styles.paneltitle}>المرشحون المحفوظون</h3>
            <div className={styles.savedlist}>
              {savedCandidates.map((c) => (
                <div key={c.id} className={styles.saveditem}>
                  <div className={styles.savedinfo}>
                    <span className={styles.savedname}>{c.name}</span>
                    <span className={styles.savedtitle}>{c.title}</span>
                  </div>
                  <span className={styles.savedmatch}>{c.matchScore}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className={`box ${styles.panel}`}>
            <h3 className={styles.paneltitle}>نشاط الفريق</h3>
            <div className={styles.activitylist}>
              {teamActivity.map((a) => (
                <div key={a.id} className={styles.activityitem}>
                  <span className={styles.activitydot} aria-hidden="true" />
                  <div>
                    <p className={styles.activitytext}>{a.text}</p>
                    <span className={styles.activitytime}>{a.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default CompanyHomePage;
