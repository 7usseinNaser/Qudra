import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { Badge } from '../../components/ui/Badge';
import { Tag } from '../../components/ui/Tag';
import styles from './OrganizationProfilePage.module.css';

export function OrganizationProfilePage() {
  const navigate = useNavigate();

  return (
    <main id="main" className="wrap" tabIndex={-1} dir="rtl" style={{ padding: 'clamp(1.5rem,4vw,2.75rem) 0 5rem' }}>
      <button className="btn ghost" onClick={() => navigate(ROUTES.COMPANY_HOME)} style={{ marginBottom: '0.8rem' }}>
        ← لوحة الشركة
      </button>

      <div className={styles.header}>
        <div className={styles.logo}>ق</div>
        <div className={styles.identity}>
          <h1 className="scr-t">شركة قُدرة التقنية</h1>
          <p className="scr-p">منصة إثبات القدرة المهنية بالأدلة</p>
          <div className={styles.metaRow}>
            <Badge variant="proof">موثّق</Badge>
            <span className={styles.metaItem}>الصناعة: التقنية</span>
            <span className={styles.metaItem}>حجم الفريق: 12</span>
          </div>
        </div>
        <a href="https://qudra.tech" className="btn ghost" target="_blank" rel="noopener noreferrer">الموقع</a>
      </div>

      <div className={`box ${styles.section}`}>
        <h2 className={styles.sectionTitle}>عن الشركة</h2>
        <p className={styles.description}>
          شركة تقنية متخصصة في بناء منصات إثبات القدرة المهنية. نجمع بين الذكاء الاصطناعي والتحليل البشري
          لتحويل الادّعاءات إلى أدلة قابلة للفحص.
        </p>
      </div>

      <div className={styles.grid}>
        <div className={`box ${styles.section}`}>
          <h2 className={styles.sectionTitle}>الوظائف المفتوحة</h2>
          <div className={styles.jobList}>
            <div className={styles.jobItem}>
              <span className={styles.jobTitle}>Senior Backend Developer</span>
              <Badge variant="proof">5 مرشحين</Badge>
            </div>
            <div className={styles.jobItem}>
              <span className={styles.jobTitle}>Frontend Developer</span>
              <Badge variant="neutral">3 مرشحين</Badge>
            </div>
          </div>
        </div>

        <div className={`box ${styles.section}`}>
          <h2 className={styles.sectionTitle}>المشاريع</h2>
          <div className={styles.projectList}>
            <div className={styles.projectItem}>
              <span className={styles.projectName}>منصة تعليمية تفاعلية</span>
              <Badge variant="gap">قيد التنفيذ</Badge>
            </div>
            <div className={styles.projectItem}>
              <span className={styles.projectName}>نظام إدارة المخزون</span>
              <Badge variant="proof">مكتمل</Badge>
            </div>
          </div>
        </div>

        <div className={`box ${styles.section}`}>
          <h2 className={styles.sectionTitle}>التحديات</h2>
          <div className={styles.challengeList}>
            <div className={styles.challengeItem}>
              <span>بناء واجهة REST</span>
              <Tag name="FastAPI" variant="proven" size="sm" />
            </div>
            <div className={styles.challengeItem}>
              <span>تصميم قاعدة بيانات</span>
              <Tag name="PostgreSQL" variant="proven" size="sm" />
            </div>
          </div>
        </div>

        <div className={`box ${styles.section}`}>
          <h2 className={styles.sectionTitle}>الموظفون</h2>
          <div className={styles.employeeList}>
            <div className={styles.employeeItem}>
              <span className={styles.empAvatar}>ح</span>
              <div>
                <span className={styles.empName}>حسين العلي</span>
                <span className={styles.empRole}>المدير التنفيذي</span>
              </div>
            </div>
            <div className={styles.employeeItem}>
              <span className={styles.empAvatar}>س</span>
              <div>
                <span className={styles.empName}>سارة محمد</span>
                <span className={styles.empRole}>مديرة المنتج</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <button className="btn ghost" onClick={() => navigate(ROUTES.ORG_VERIFICATION)}>
          التحقق من الشركة
        </button>
        <button className="btn ghost" onClick={() => navigate(ROUTES.ORG_MEMBERS)}>
          الأعضاء
        </button>
        <button className="btn" onClick={() => navigate(ROUTES.ORG_DASHBOARD)}>
          لوحة التحكم
        </button>
      </div>
    </main>
  );
}

export default OrganizationProfilePage;
