import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { Badge } from '../../../components/ui/Badge';
import styles from './M26DetailsPage.module.css';

interface Plan {
  id: string;
  name: string;
  description: string;
  price: { monthly: number; yearly: number };
  features: string[];
  limits: { candidates: number; problems: number; teamMembers: number; apiCalls: number };
  popular?: boolean;
  demo: boolean;
}

const plans: Plan[] = [
  {
    id: 'free',
    name: 'مجاني',
    description: 'للمطورين الأفراد والبدء في استكشاف المنصة',
    price: { monthly: 0, yearly: 0 },
    features: [
      'ملف قدرة شخصي مع أدلة غير محدودة',
      'ربط GitHub واحد',
      '5 مشاكل شهرياً',
      '10 مرشحين محفوظين',
      'مجتمع وتبادل مهارات',
      'دعم عبر البريد الإلكتروني',
    ],
    limits: { candidates: 10, problems: 5, teamMembers: 1, apiCalls: 1000 },
    demo: true,
  },
  {
    id: 'pro',
    name: 'احترافي',
    description: 'للمطورين الجادين والفرق الصغيرة',
    price: { monthly: 99, yearly: 79 },
    features: [
      'كل مزايا المجاني',
      'مشاكل غير محدودة',
      'مرشحون محفوظون غير محدودين',
      'ربط 5 مصادر أدلة',
      'تحليلات متقدمة وتقارير',
      'أولوية في المطابقة',
      'دعم أولوي',
      'API access (10,000 طلب/شهر)',
    ],
    limits: { candidates: -1, problems: -1, teamMembers: 5, apiCalls: 10000 },
    popular: true,
    demo: true,
  },
  {
    id: 'team',
    name: 'فريق',
    description: 'للشركات وفرق التوظيف',
    price: { monthly: 299, yearly: 249 },
    features: [
      'كل مزايا الاحترافي',
      'مساحة عمل فريق مشتركة',
      'إدارة أعضاء وصلاحيات',
      'تحديات مخصصة للشركة',
      'تقارير مفصلة للتوظيف',
      'تكامل ATS',
      'مدير نجاح مخصص',
      'API access (100,000 طلب/شهر)',
      'SLA 99.9%',
    ],
    limits: { candidates: -1, problems: -1, teamMembers: 25, apiCalls: 100000 },
    demo: true,
  },
  {
    id: 'enterprise',
    name: 'مؤسسي',
    description: 'للمؤسسات الكبيرة ذات المتطلبات الخاصة',
    price: { monthly: 999, yearly: 799 },
    features: [
      'كل مزايا الفريق',
      'عدد غير محدود من أعضاء الفريق',
      'نشر خاص (On-premise/Private Cloud)',
      'تكامل SSO/SAML',
      'تدقيق أمني مخصص',
      'عقود مخصصة ودعم 24/7',
      'تدريب وتأهيل للفريق',
      'API access غير محدود',
      'SLA 99.99%',
    ],
    limits: { candidates: -1, problems: -1, teamMembers: -1, apiCalls: -1 },
    demo: true,
  },
];

const currentPlan = 'pro';

export function M26DetailsPage() {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const getPrice = (plan: Plan) => billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly;

  return (
    <main id="main" className="wrap" tabIndex={-1} dir="rtl" style={{ padding: 'clamp(1.5rem,4vw,2.75rem) 0 5rem' }}>
      <div className={styles.header}>
        <button className="btn ghost" onClick={() => navigate(ROUTES.M26_OVERVIEW)}>← العودة</button>
        <h1 className="scr-t">الفوترة والاشتراكات</h1>
        <p className={styles.subtitle}>اختر الخطة المناسبة لك — جميع الأسعار توضيحية (Demo) فقط</p>
      </div>

      <div className={styles.notice}>
        <span className={styles.noticeicon}>⚠️</span>
        <div>
          <strong>تنبيه:</strong> هذه صفحة عرض توضيحية (Demo) فقط. لا يتم جمع أي معلومات بطاقات دفع حقيقية. الأسعار والخطط للمثال فقط.
        </div>
      </div>

      <div className={styles.cycle}>
        <span>شهري</span>
        <div className={styles.toggle}>
          <button className={`${styles.togglebtn} ${billingCycle === 'monthly' ? styles.active : ''}`} onClick={() => setBillingCycle('monthly')}>شهري</button>
          <button className={`${styles.togglebtn} ${billingCycle === 'yearly' ? styles.active : ''}`} onClick={() => setBillingCycle('yearly')}>سنوي <Badge variant="proof">وفر 20%</Badge></button>
        </div>
      </div>

      <div className={styles.plans}>
        {plans.map((plan) => (
          <article key={plan.id} className={`${styles.plan} ${plan.popular ? styles.popular : ''} ${currentPlan === plan.id ? styles.current : ''}`}>
            {plan.popular && <div className={styles.popularbadge}>الأكثر شعبية</div>}
            <div className={styles.planheader}>
              <h3 className={styles.planname}>{plan.name}</h3>
              <p className={styles.plandesc}>{plan.description}</p>
            </div>
            <div className={styles.price}>
              <span className={styles.priceamount}>{getPrice(plan) === 0 ? 'مجاني' : `${getPrice(plan).toLocaleString()} ر.س`}</span>
              <span className={styles.priceperiod}>/{billingCycle === 'monthly' ? 'شهر' : 'سنة'}</span>
            </div>
            <ul className={styles.features}>
              {plan.features.map((feature, idx) => (
                <li key={idx}><span className="check">✓</span> {feature}</li>
              ))}
            </ul>
            <div className={styles.limits}>
              <h4 className={styles.limitstitle}>الحدود</h4>
              <div className={styles.limitsgrid}>
                <div className={styles.limititem}>
                  <span className={styles.limitlabel}>مرشحون</span>
                  <span className={styles.limitvalue}>{plan.limits.candidates === -1 ? 'غير محدود' : plan.limits.candidates.toLocaleString()}</span>
                </div>
                <div className={styles.limititem}>
                  <span className={styles.limitlabel}>مشاكل</span>
                  <span className={styles.limitvalue}>{plan.limits.problems === -1 ? 'غير محدود' : plan.limits.problems.toLocaleString()}</span>
                </div>
                <div className={styles.limititem}>
                  <span className={styles.limitlabel}>أعضاء الفريق</span>
                  <span className={styles.limitvalue}>{plan.limits.teamMembers === -1 ? 'غير محدود' : plan.limits.teamMembers.toLocaleString()}</span>
                </div>
                <div className={styles.limititem}>
                  <span className={styles.limitlabel}>طلبات API/شهر</span>
                  <span className={styles.limitvalue}>{plan.limits.apiCalls === -1 ? 'غير محدود' : plan.limits.apiCalls.toLocaleString()}</span>
                </div>
              </div>
            </div>
            <button className={`btn ${currentPlan === plan.id ? 'ghost' : plan.popular ? 'dark' : 'ghost'}`} disabled={currentPlan === plan.id}>
              {currentPlan === plan.id ? 'خطتك الحالية' : plan.price.monthly === 0 ? 'ابدأ مجاناً' : 'اختر الخطة'}
            </button>
          </article>
        ))}
      </div>

      <div className={styles.currentplan}>
        <h3 className={styles.sectiontitle}>خطتك الحالية</h3>
        <div className={styles.currentcard}>
          <div>
            <h4 className={styles.currentname}>الاحترافي (سنوي)</h4>
            <p className={styles.currentdetail}>تجديد في 15 يناير 2027 • 79 ر.س/سنة</p>
          </div>
          <div className={styles.currentactions}>
            <button className="btn ghost">إدارة الاشتراك</button>
            <button className="btn ghost">تغيير الخطة</button>
            <button className="btn ghost">الفواتير</button>
          </div>
        </div>
      </div>

      <div className={styles.paymentmethods}>
        <h3 className={styles.sectiontitle}>طرق الدفع (Demo)</h3>
        <div className={styles.paymentlist}>
          <div className={styles.paymentitem}>
            <div className={styles.paymenticon}>💳</div>
            <div>
              <span className={styles.paymentname}>بطاقة فيزا تنتهي بـ 4242</span>
              <span className={styles.paymentmeta}>تنتهي 12/2027 • أساسية</span>
            </div>
            <Badge variant="proof">نشطة</Badge>
          </div>
          <div className={styles.paymentitem}>
            <div className={styles.paymenticon}>🏦</div>
            <div>
              <span className={styles.paymentname}>حساب بنكي - بنك الراجحي</span>
              <span className={styles.paymentmeta}>للدفع السنوي</span>
            </div>
            <Badge variant="neutral">محفوظة</Badge>
          </div>
        </div>
        <button className="btn ghost" style={{ marginTop: '1rem' }}>إضافة طريقة دفع</button>
      </div>

      <div className={styles.invoices}>
        <h3 className={styles.sectiontitle}>الفواتير الأخيرة (Demo)</h3>
        <div className={styles.invoicelist}>
          <div className={styles.invoiceitem}>
            <div>
              <span className={styles.invoicenumber}>INV-2026-001247</span>
              <span className={styles.invoicemeta}>15 يناير 2026 • الخطة الاحترافية (سنوي)</span>
            </div>
            <div>
              <span className={styles.invoiceamount}>79 ر.س</span>
              <Badge variant="proof">مدفوعة</Badge>
            </div>
          </div>
          <div className={styles.invoiceitem}>
            <div>
              <span className={styles.invoicenumber}>INV-2025-001102</span>
              <span className={styles.invoicemeta}>15 يناير 2025 • الخطة المجانية</span>
            </div>
            <div>
              <span className={styles.invoiceamount}>0 ر.س</span>
              <Badge variant="neutral">مجانية</Badge>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default M26DetailsPage;