import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import styles from './M26ResultsPage.module.css';

interface UsageStat {
  label: string;
  value: string;
  limit: string;
  percentage: number;
  status: 'good' | 'warning' | 'danger';
}

const usageStats: UsageStat[] = [
  { label: 'المرشحون المحفوظون', value: '247', limit: 'غير محدود', percentage: 12, status: 'good' },
  { label: 'المشاكل المنشأة', value: '12', limit: 'غير محدود', percentage: 8, status: 'good' },
  { label: 'أعضاء الفريق', value: '4', limit: '5', percentage: 80, status: 'warning' },
  { label: 'طلبات API هذا الشهر', value: '8,432', limit: '10,000', percentage: 84, status: 'warning' },
  { label: 'مصادر الأدلة المرتبطة', value: '3', limit: '5', percentage: 60, status: 'good' },
  { label: 'التحديات المكتملة', value: '7', limit: 'غير محدود', percentage: 0, status: 'good' },
];

interface BillingHistory {
  date: string;
  description: string;
  amount: string;
  status: 'paid' | 'pending' | 'failed';
}

const billingHistory: BillingHistory[] = [
  { date: '2026-01-15', description: 'الخطة الاحترافية (سنوي)', amount: '79 ر.س', status: 'paid' },
  { date: '2025-01-15', description: 'الخطة المجانية', amount: '0 ر.س', status: 'paid' },
  { date: '2024-06-15', description: 'الخطة الاحترافية (شهري × 6)', amount: '594 ر.س', status: 'paid' },
  { date: '2024-01-15', description: 'الخطة الاحترافية (سنوي)', amount: '79 ر.س', status: 'paid' },
];

export function M26ResultsPage() {
  const navigate = useNavigate();

  return (
    <main id="main" className="wrap" tabIndex={-1} dir="rtl" style={{ padding: 'clamp(1.5rem,4vw,2.75rem) 0 5rem' }}>
      <div className={styles.header}>
        <button className="btn ghost" onClick={() => navigate(ROUTES.M26_OVERVIEW)}>← العودة</button>
        <h1 className="scr-t">تقارير الاستخدام والفوترة</h1>
        <p className={styles.subtitle}>نظرة شاملة على استخدامك للخطة الحالية وتاريخ الفوترة</p>
      </div>

      <div className={styles.notice}>
        <span className={styles.noticeicon}>⚠️</span>
        <div>
          <strong>تنبيه:</strong> هذه بيانات توضيحية (Demo) فقط. لا توجد معاملات مالية حقيقية.
        </div>
      </div>

      <div className={styles.currentplan}>
        <h3 className={styles.sectiontitle}>الخطة الحالية: الاحترافي (سنوي)</h3>
        <div className={styles.plandetails}>
          <div className={styles.plandetail}>
            <span className={styles.detaillabel}>التجديد القادم</span>
            <span className={styles.detailvalue}>15 يناير 2027</span>
          </div>
          <div className={styles.plandetail}>
            <span className={styles.detaillabel}>المبلغ</span>
            <span className={styles.detailvalue}>79 ر.س/سنة</span>
          </div>
          <div className={styles.plandetail}>
            <span className={styles.detaillabel}>طريقة الدفع</span>
            <span className={styles.detailvalue}>فيزا تنتهي بـ 4242</span>
          </div>
          <div className={styles.plandetail}>
            <span className={styles.detaillabel}>الحالة</span>
            <span className={styles.detailvalue}><span className="badge proof">نشطة</span></span>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectiontitle}>استخدام الموارد</h3>
        <div className={styles.usagegrid}>
          {usageStats.map((stat) => (
            <div key={stat.label} className={styles.usagecard}>
              <div className={styles.usageheader}>
                <span className={styles.usagelabel}>{stat.label}</span>
                <span className={`${styles.usagestatus} ${stat.status}`}>{stat.status === 'good' ? 'جيد' : stat.status === 'warning' ? 'تحذير' : 'خطر'}</span>
              </div>
              <div className={styles.usagebar}>
                <div className={styles.usagefill} style={{ width: `${stat.percentage}%`, background: stat.status === 'good' ? 'var(--proof)' : stat.status === 'warning' ? 'var(--gap)' : 'var(--danger)' }} />
              </div>
              <div className={styles.usagemeta}>
                <span className={styles.usagevalue}>{stat.value}</span>
                <span className={styles.usagelimit}>من {stat.limit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectiontitle}>تاريخ الفوترة</h3>
        <div className={styles.billinglist}>
          {billingHistory.map((item, idx) => (
            <div key={idx} className={styles.billingitem}>
              <div>
                <span className={styles.billingdate}>{item.date}</span>
                <span className={styles.billingdesc}>{item.description}</span>
              </div>
              <div className={styles.billingright}>
                <span className={styles.billingamount}>{item.amount}</span>
                <span className={`badge ${item.status === 'paid' ? 'proof' : item.status === 'pending' ? 'gap' : 'danger'}`}>{item.status === 'paid' ? 'مدفوعة' : item.status === 'pending' ? 'معلقة' : 'فاشلة'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectiontitle}>التوصيات</h3>
        <div className={styles.recommendations}>
          <div className={styles.rec}>
            <span className={styles.recicon}>👥</span>
            <div>
              <h4 className={styles.rectitle}>قرب الحد الأقصى لأعضاء الفريق</h4>
              <p className={styles.recdesc}>أنت تستخدم 4 من 5 مقاعد. فكر في ترقية الخطة قبل إضافة أعضاء جدد.</p>
            </div>
          </div>
          <div className={styles.rec}>
            <span className={styles.recicon}>📊</span>
            <div>
              <h4 className={styles.rectitle}>استخدام API عالي</h4>
              <p className={styles.recdesc}>84% من حد API الشهري مستخدم. راقب الاستخدام لتجنب الانقطاع.</p>
            </div>
          </div>
          <div className={styles.rec}>
            <span className={styles.recicon}>💡</span>
            <div>
              <h4 className={styles.rectitle}>وفر 20% بالدفع السنوي</h4>
              <p className={styles.recdesc}>أنت بالفعل على الخطة السنوية — ممتاز! هذا يوفر عليك 198 ر.س سنوياً.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default M26ResultsPage;