/**
 * ProfilePage — مسار صاحب القدرة (ملفي وتبويباته السبعة كاملة).
 *
 * مطابقة حرفية لـ prototype.html (#u1, #u0, #u3, #evd, #u6, #u2, #u4, #u5):
 * 1. لوحة التحكم الرئيسية (u1): إحصائيات الأدلة الأربعة، بطاقات القدرات المثبتة، وقوة الملف 72%.
 * 2. مصادر الأدلة (u0): مصادر GitHub وLeetCode ومشاريع العملاء مع حالات الربط.
 * 3. سجل الأدلة القابلة للفحص (u3): الأحد عشر دليلاً مع فلاتر التوثيق (موثق، مرتبط، معلن).
 * 4. تفاصيل الدليل المفرد (evd): تحليل المحتوى الآلي، كيفية التحقق، وأثره على درجات القدرات.
 * 5. مسار التطور عبر الزمن (u6): رسم بياني تفاعلي SVG لتراكم الأدلة وتراجع المهارات غير المسنودة.
 * 6. فجوتي وجاهزية Full Stack (u2): تحليل الجاهزية 68% ومحطات التعلم العملية.
 * 7. الفرص المطابقة (u4): أربع فرص عمل حقيقية مع أسباب المطابقة التفصيلية.
 * 8. بطاقة الإثبات وجواز القدرات (u5): بديل السيرة الذاتية ورابط المشاركة العام.
 */

import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useRole } from '../../contexts/RoleContext'
import styles from './ProfilePage.module.css'

export type ProfileTab = 'u1' | 'u0' | 'u3' | 'evd' | 'u6' | 'u2' | 'u4' | 'u5'

const MY_EVIDENCES = [
  { src: 'GitHub', title: 'github.com/you/schedule-api', type: 'مستودع', skill: 'Backend', date: '2026-05', level: 'موثّق' },
  { src: 'GitHub', title: 'github.com/you/courses-sync', type: 'مستودع', skill: 'خط معالجة بيانات', date: '2025-11', level: 'موثّق' },
  { src: 'GitHub', title: 'github.com/you/inventory-api', type: 'مستودع', skill: 'REST APIs', date: '2026-01', level: 'موثّق' },
  { src: 'QUDRA', title: 'محاكاة · تحدّي تطبيق الجامعة', type: 'محاكاة', skill: 'UI/UX · Product', date: '2026-08', level: 'موثّق' },
  { src: 'QUDRA', title: 'محاكاة · بنية البيانات', type: 'محاكاة', skill: 'Backend', date: '2026-08', level: 'موثّق' },
  { src: 'QUDRA', title: 'محاكاة · ترتيب الأولويات', type: 'محاكاة', skill: 'Problem Solving', date: '2026-08', level: 'موثّق' },
  { src: 'LeetCode', title: 'leetcode.com/you', type: 'تقييم', skill: 'Algorithms', date: '2026-06', level: 'مرتبط' },
  { src: 'Project', title: 'مشروع مسلّم لعميل — بوابة طلاب', type: 'مشروع', skill: 'Backend', date: '2025-08', level: 'مرتبط' },
  { src: 'Project', title: 'لوحة تقارير داخلية (بلا رابط)', type: 'مشروع', skill: 'تصوير بيانات', date: '2025-04', level: 'مرتبط' },
  { src: 'Cert', title: 'شهادة معالجة الصوت', type: 'شهادة', skill: 'Speech', date: '2024-01', level: 'ذاتي' },
  { src: 'Self', title: 'مهارة مكتوبة في الملف', type: 'ادّعاء', skill: 'DevOps', date: '—', level: 'ذاتي' },
]

const TL_DATA = [
  {
    name: 'Backend',
    color: '#00B8B8',
    isDashed: false,
    points: [
      [4, 40, 'أول مستودع صغير — بلا اختبارات'],
      [7, 58, 'مستودع خط معالجة بيانات على Airflow'],
      [9, 66, 'واجهة REST لإدارة المخزون مع اختبارات'],
      [13, 74, 'خدمة إدارة المواد والمواعيد'],
      [16, 86, 'تحدٍّ عملي مُقيَّم: بنية بيانات الجامعة'],
    ],
  },
  {
    name: 'Problem Solving',
    color: '#00787A',
    isDashed: false,
    points: [
      [14, 70, 'ملف LeetCode — 420 مسألة'],
      [16, 88, 'محاكاة: ترتيب الأولويات وتبريرها'],
    ],
  },
  {
    name: 'UI/UX',
    color: '#2FBFAE',
    isDashed: false,
    points: [
      [15, 0, 'لا دليل قبل هذه النقطة'],
      [16, 85, 'محاكاة: تصميم الشاشة الرئيسية للطالب'],
    ],
  },
  {
    name: 'Speech Processing',
    color: '#FFC107',
    isDashed: true,
    points: [
      [0, 45, 'شهادة دورة في معالجة الصوت — 2024'],
      [8, 34, 'بلا تطبيق منذ الشهادة'],
      [16, 22, 'الوزن اليوم أقل من نصف وزنه الأصلي'],
    ],
  },
]

const TL_MONTHS = ['2025-05', '2025-07', '2025-09', '2025-11', '2026-01', '2026-03', '2026-05', '2026-07', '2026-09']

export function ProfilePage() {
  const { user } = useRole()
  const location = useLocation()
  const navigate = useNavigate()

  // تحديد التبويب الحالي ومؤشر الدليل من الرابط
  const path = location.pathname
  let activeTab: ProfileTab = 'u1'
  let directEvIndex = 0
  if (path === '/profile/sources') activeTab = 'u0'
  else if (path === '/profile/evidence') activeTab = 'u3'
  else if (path.startsWith('/profile/evidence/')) {
    activeTab = 'evd'
    const parsed = parseInt(path.replace('/profile/evidence/', ''), 10)
    if (!isNaN(parsed)) directEvIndex = parsed
  }
  else if (path === '/profile/timeline') activeTab = 'u6'
  else if (path === '/profile/gaps') activeTab = 'u2'
  else if (path === '/profile/opportunities') activeTab = 'u4'
  else if (path === '/profile/passport') activeTab = 'u5'

  const [evidenceFilter, setEvidenceFilter] = useState<'all' | 'موثّق' | 'مرتبط' | 'ذاتي'>('all')
  const [selectedEvIndex, setSelectedEvIndex] = useState(directEvIndex)
  const [hoveredTlPoint, setHoveredTlPoint] = useState<string | null>(null)
  const [copiedLink, setCopiedLink] = useState(false)

  const handleOpenEvidence = (idx: number) => {
    setSelectedEvIndex(idx)
    navigate('/profile/evidence/' + idx)
  }

  const handleCopyPassport = () => {
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  const effectiveEvIndex = path.startsWith('/profile/evidence/') ? directEvIndex : selectedEvIndex
  const selectedEvidence = MY_EVIDENCES[effectiveEvIndex] || MY_EVIDENCES[0]

  const filteredEvidences = MY_EVIDENCES.filter((e) => {
    if (evidenceFilter === 'all') return true
    return e.level === evidenceFilter
  })

  // حسابات محور الرسم البياني
  const tlx = (m: number) => 46 + (m / 16) * 636
  const tly = (v: number) => 250 - (v / 100) * 214

  return (
    <div className={`wrap ${styles.profileContainer}`} dir="rtl">
      {/* ═══ 1. لوحة التحكم الرئيسية (u1 - ملفي) ═══ */}
      {activeTab === 'u1' && (
        <section className="screen" id="u1">
          <div className={styles.phero}>
            <span className={styles.phav} id="pHeroAv">
              {user.avatar || 'أ'}
            </span>
            <div className={styles.phinfo}>
              <h1 id="pHeroName">{user.name || 'حسابك'}</h1>
              <p>مهندس برمجيات · <span className="num">11</span> دليلًا · محدّث قبل ساعتين</p>
            </div>
            <div className={styles.phact}>
              <span className="pill ready">جاهز · Backend</span>
              <button
                className="btn ghost"
                onClick={() => navigate('/profile/passport')}
                id="toPassportBtn"
              >
                بطاقتك
              </button>
            </div>
          </div>

          <div className={styles.pgrid}>
            <div className={styles.pmain}>
              {/* شريط الإحصائيات الأربع */}
              <div className={styles.statstrip} id="statstrip">
                <div>
                  <span className={`${styles.sv} num`}>6</span>
                  <span className={styles.sk}>دليل موثّق</span>
                </div>
                <div>
                  <span className={`${styles.sv} num`}>3</span>
                  <span className={styles.sk}>قدرة مثبتة</span>
                </div>
                <div>
                  <span className={`${styles.sv} num`}>4</span>
                  <span className={styles.sk}>مصادر مرتبطة</span>
                </div>
                <div>
                  <span className={`${styles.sv} num`}>2</span>
                  <span className={styles.sk}>تنتظر دليلًا</span>
                </div>
              </div>

              {/* بطاقات القدرات المثبتة */}
              <div className="box" style={{ marginTop: '1rem' }}>
                <div className={styles.secrow}>
                  <h2>قدراتك المثبتة</h2>
                  <button
                    className={styles.linkbtn}
                    onClick={() => navigate('/profile/timeline')}
                  >
                    عرض مسار التطور ←
                  </button>
                </div>

                <div className={styles.skcards} style={{ marginTop: '0.8rem' }}>
                  <div className={styles.skc}>
                    <div className={styles.skch}>
                      <h4>Problem Solving</h4>
                      <span className={styles.skv}>88%</span>
                    </div>
                    <div className={styles.skb}>
                      <i style={{ width: '88%' }} />
                    </div>
                    <div className={styles.skm}>
                      <span>4 أدلة موثّقة</span>
                      <span>LeetCode · محاكاة</span>
                    </div>
                  </div>

                  <div className={styles.skc}>
                    <div className={styles.skch}>
                      <h4>UI/UX</h4>
                      <span className={styles.skv}>85%</span>
                    </div>
                    <div className={styles.skb}>
                      <i style={{ width: '85%' }} />
                    </div>
                    <div className={styles.skm}>
                      <span>3 أدلة موثّقة</span>
                      <span>محاكاة · Figma</span>
                    </div>
                  </div>

                  <div className={styles.skc}>
                    <div className={styles.skch}>
                      <h4>Product Thinking</h4>
                      <span className={styles.skv}>78%</span>
                    </div>
                    <div className={styles.skb}>
                      <i style={{ width: '78%' }} />
                    </div>
                    <div className={styles.skm}>
                      <span>دليلان موثّقان</span>
                      <span>محاكاة قُدرة</span>
                    </div>
                  </div>

                  <div className={`${styles.skc} ${styles.pend}`}>
                    <div className={styles.skch}>
                      <h4>Backend</h4>
                      <span className={styles.skv}>65%</span>
                    </div>
                    <div className={`${styles.skb} ${styles.g}`}>
                      <i style={{ width: '65%' }} />
                    </div>
                    <div className={styles.skm}>
                      <span>تحت عتبة التوثيق</span>
                      <button
                        className={styles.linkbtn}
                        onClick={() => navigate('/profile/gaps')}
                      >
                        سد الفجوة
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* الشريط الجانبي: قوة الملف والمكاسب السريعة */}
            <aside className={styles.pside}>
              <div className={`box ${styles.strengthbox}`}>
                <span className="lbl">قوة ملفك الإجمالية</span>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: '0.3rem' }}>
                  <span className={styles.strv}>72%</span>
                  <span className="note">قوي وموثوق</span>
                </div>
                <div className={styles.strbar}>
                  <i style={{ width: '72%' }} />
                </div>

                <div className={styles.strrows}>
                  <div className={styles.sr}>
                    <span className={styles.srd} />
                    <span>التوثيق الآلي: <b>85%</b></span>
                  </div>
                  <div className={styles.sr}>
                    <span className={styles.srd} />
                    <span>تنوع المصادر: <b>75%</b></span>
                  </div>
                  <div className={styles.sr}>
                    <span className={styles.srd} />
                    <span>حداثة الأدلة: <b>90%</b></span>
                  </div>
                  <div className={styles.sr}>
                    <span className={styles.srd} />
                    <span>تغطية المشروع: <b>68%</b></span>
                  </div>
                </div>
              </div>

              <div className="box">
                <h3 style={{ fontSize: '0.98rem', margin: '0 0 0.6rem' }}>مكاسب سريعة</h3>
                <p className="note" style={{ lineHeight: 1.6, margin: 0 }}>
                  إضافة اختبارات لمستودع <b>inventory-api</b> ترفع قوة ملفك مباشرة إلى 80%.
                </p>
                <button
                  className={styles.linkbtn}
                  style={{ marginTop: '0.6rem' }}
                  onClick={() => navigate('/profile/evidence/2')}
                >
                  افتح تفاصيل الدليل ←
                </button>
              </div>
            </aside>
          </div>
        </section>
      )}

      {/* ═══ 2. مصادر الأدلة (u0 - مصادري) ═══ */}
      {activeTab === 'u0' && (
        <section className="screen" id="u0">
          <div className={styles.headrow}>
            <div>
              <span className={styles.eyebrow}>Evidence Sources</span>
              <h1 className={styles.scrt}>من أين تأتي أدلتك</h1>
              <p className={styles.scrp}>
                لا تكتب مهاراتك — اربط حساباتك ودع مشاريعك تتكلم. نفحص البنية ونحدّث ملفك آليًا.
              </p>
            </div>
          </div>

          <div className={styles.srcs} id="srcList">
            <div className={`${styles.srcCard} ${styles.linked}`}>
              <div>
                <h4>GitHub</h4>
                <p className={styles.st}>
                  متصل باسم <b>qudra-org</b> · فُحص قبل ساعتين
                </p>
              </div>
              <button className={styles.act}>إدارة</button>
              <div className={styles.out}>
                أنتج <b style={{ color: 'var(--accent)' }}>3</b> مستودعات موثّقة و<b style={{ color: 'var(--accent)' }}>12</b> التزامًا مفحوصًا.
              </div>
            </div>

            <div className={`${styles.srcCard} ${styles.linked}`}>
              <div>
                <h4>LeetCode</h4>
                <p className={styles.st}>
                  متصل باسم <b>mash</b> · محدّث في 2026-06
                </p>
              </div>
              <button className={styles.act}>إدارة</button>
              <div className={styles.out}>
                أنتج تقييم خوارزميات بدرجة <b style={{ color: 'var(--accent)' }}>70%</b>.
              </div>
            </div>

            <div className={`${styles.srcCard} ${styles.linked}`}>
              <div>
                <h4>مشاريع العملاء الفعلية</h4>
                <p className={styles.st}>
                  موثقة عبر المنصة · مشروعان معتمدان
                </p>
              </div>
              <button className={styles.act}>إدارة</button>
              <div className={styles.out}>
                أنتج أدلة في <b style={{ color: 'var(--accent)' }}>التكامل مع الواجهة</b> وتسليم المواعيد.
              </div>
            </div>

            <div className={styles.srcCard}>
              <div>
                <h4>الشهادات والتقييم الذاتي</h4>
                <p className={styles.st}>
                  شهادة واحدة مسجلة · مستوى إثبات: ذاتي
                </p>
              </div>
              <button className={styles.act}>إضافة</button>
              <div className={styles.out}>
                الشهادات القديمة تفقد وزنها تدريجيًا ما لم تُسند بمشروع عملي.
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══ 3. سجل الأدلة (u3 - أدلتي) ═══ */}
      {activeTab === 'u3' && (
        <section className="screen" id="u3">
          <div className={styles.headrow}>
            <div>
              <span className={styles.eyebrow}>My Evidence</span>
              <h1 className={styles.scrt}>‏<span className="num">11</span> دليلًا، كلها قابلة للفحص</h1>
              <p className={styles.scrp}>
                أي شركة تفتح ملفك ترى المصدر والتاريخ ومستوى التحقق. لا شيء مخفي، ولا شيء مبالغ فيه.
              </p>
            </div>
          </div>

          <div className={styles.pgrid}>
            <div className={styles.pmain}>
              <div className={styles.filters} id="evFilters">
                <button
                  className={`${styles.flt} ${evidenceFilter === 'all' ? styles.on : ''}`}
                  onClick={() => setEvidenceFilter('all')}
                >
                  الكل <span className={styles.fc}>11</span>
                </button>
                <button
                  className={`${styles.flt} ${evidenceFilter === 'موثّق' ? styles.on : ''}`}
                  onClick={() => setEvidenceFilter('موثّق')}
                >
                  موثّق <span className={styles.fc}>6</span>
                </button>
                <button
                  className={`${styles.flt} ${evidenceFilter === 'مرتبط' ? styles.on : ''}`}
                  onClick={() => setEvidenceFilter('مرتبط')}
                >
                  مرتبط <span className={styles.fc}>3</span>
                </button>
                <button
                  className={`${styles.flt} ${evidenceFilter === 'ذاتي' ? styles.on : ''}`}
                  onClick={() => setEvidenceFilter('ذاتي')}
                >
                  مُعلن <span className={styles.fc}>2</span>
                </button>
              </div>

              <div className={styles.evlist}>
                {filteredEvidences.map((e, idx) => (
                  <div
                    key={`${e.title}-${idx}`}
                    className={`${styles.evi} ${e.level === 'ذاتي' ? styles.weak : ''}`}
                    onClick={() => handleOpenEvidence(MY_EVIDENCES.indexOf(e))}
                    style={{ cursor: 'pointer' }}
                  >
                    <span className={styles.eic}>
                      {e.src.slice(0, 2).toUpperCase()}
                    </span>
                    <div>
                      <h4>{e.title}</h4>
                      <div className={styles.em}>
                        <span>النوع: <b>{e.type}</b></span>
                        <span>المهارة: <b>{e.skill}</b></span>
                        <span>التاريخ: <b className="mono">{e.date}</b></span>
                      </div>
                    </div>
                    <span className={styles.er}>
                      <span
                        className={`${styles.vb} ${
                          e.level === 'موثّق'
                            ? styles.v1
                            : e.level === 'مرتبط'
                            ? styles.v2
                            : styles.v3
                        }`}
                      >
                        <span className={styles.dot} /> {e.level}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <aside className={styles.pside}>
              <div className={`box ${styles.pcard}`}>
                <h3>توزيع التوثيق</h3>
                <div style={{ display: 'grid', gap: '0.6rem', marginTop: '0.8rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                    <span className={`${styles.vb} ${styles.v1}`}><span className={styles.dot} /> موثّق</span>
                    <span className="mono">6 من 11 (55%)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                    <span className={`${styles.vb} ${styles.v2}`}><span className={styles.dot} /> مرتبط</span>
                    <span className="mono">3 من 11 (27%)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                    <span className={`${styles.vb} ${styles.v3}`}><span className={styles.dot} /> مُعلن</span>
                    <span className="mono">2 من 11 (18%)</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </section>
      )}

      {/* ═══ 4. تفاصيل الدليل (evd) ═══ */}
      {activeTab === 'evd' && (
        <section className="screen" id="evd">
          <div className={styles.crumb}>
            <button className={styles.back} onClick={() => navigate('/profile/evidence')}>
              → رجوع لأدلتي
            </button>
            <span>تفاصيل الدليل</span>
          </div>

          <div className={styles.pgrid}>
            <div className={styles.pmain}>
              <div className={`box ${styles.evdhead}`}>
                <div className={styles.evdtop}>
                  <span className={`${styles.eic} ${styles.big}`}>
                    {selectedEvidence.src.slice(0, 2).toUpperCase()}
                  </span>
                  <div>
                    <h1 id="evdTitle">{selectedEvidence.title}</h1>
                    <p className="mono" style={{ color: 'var(--ink-3)', margin: 0 }}>
                      {selectedEvidence.src === 'GitHub'
                        ? selectedEvidence.title
                        : `${selectedEvidence.type} · ${selectedEvidence.src}`}
                    </p>
                  </div>
                  <span
                    className={`${styles.vb} ${
                      selectedEvidence.level === 'موثّق'
                        ? styles.v1
                        : selectedEvidence.level === 'مرتبط'
                        ? styles.v2
                        : styles.v3
                    }`}
                    style={{ marginInlineStart: 'auto' }}
                  >
                    <span className={styles.dot} /> {selectedEvidence.level}
                  </span>
                </div>

                <div className={styles.evdmeta}>
                  <div>
                    <span className={styles.k}>النوع:</span>
                    <span className={styles.v}>{selectedEvidence.type}</span>
                  </div>
                  <div>
                    <span className={styles.k}>المهارة:</span>
                    <span className={styles.v}>{selectedEvidence.skill}</span>
                  </div>
                  <div>
                    <span className={styles.k}>التاريخ:</span>
                    <span className={`${styles.v} mono`}>{selectedEvidence.date}</span>
                  </div>
                  <div>
                    <span className={styles.k}>المصدر:</span>
                    <span className={styles.v}>{selectedEvidence.src}</span>
                  </div>
                </div>
              </div>

              <div className="box" style={{ marginTop: '1rem' }}>
                <div className={styles.secrow}>
                  <h2>ما استخرجته قُدرة</h2>
                  <span className="note">تحليل آلي للمحتوى</span>
                </div>
                <div className="row" style={{ gap: '0.4rem', marginTop: '0.9rem', flexWrap: 'wrap' }}>
                  <span className="tag proven">Backend</span>
                  <span className="tag proven">PostgreSQL</span>
                  <span className="tag proven">REST APIs</span>
                  <span className="tag proven">Testing</span>
                </div>
                <div className={styles.hr} />
                <div className={styles.sigrid}>
                  <div className={styles.sgi}>
                    <span>التعقيد</span>
                    <span className={styles.sgb}><i style={{ width: '82%' }} /></span>
                    <span className="mono">عالٍ</span>
                  </div>
                  <div className={styles.sgi}>
                    <span>الاكتمال</span>
                    <span className={styles.sgb}><i style={{ width: '90%' }} /></span>
                    <span className="mono">منشور</span>
                  </div>
                  <div className={styles.sgi}>
                    <span>وجود اختبارات</span>
                    <span className={styles.sgb}><i style={{ width: '64%' }} /></span>
                    <span className="mono">جزئي</span>
                  </div>
                  <div className={styles.sgi}>
                    <span>وضوح التوثيق</span>
                    <span className={styles.sgb}><i style={{ width: '75%' }} /></span>
                    <span className="mono">جيد</span>
                  </div>
                </div>
              </div>

              <div className={`box ${styles.verifbox}`} style={{ marginTop: '1rem' }}>
                <span className={styles.tiph2}>
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 3 4 6v6c0 5 3.4 8.4 8 9 4.6-.6 8-4 8-9V6z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                  كيف تحقّقنا منه
                </span>
                <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--ink-2)', lineHeight: 1.6 }}>
                  قرأنا المستودع مباشرة عبر GitHub App بصلاحية قراءة فقط: البنية، سجلّ الالتزامات، الاختبارات، وملف README. لم يُدخل شيء يدويًا.
                </p>
                <p className="mono" style={{ marginTop: '0.6rem', color: 'var(--ink-3)', fontSize: '0.8rem', margin: 0 }}>
                  آخر فحص 2026-08-29 · 04:12
                </p>
              </div>
            </div>

            <aside className={styles.pside}>
              <div className={`box ${styles.impactbox}`}>
                <span className="lbl">أثره على ملفك</span>
                <div className={styles.impbig}>
                  <span className={styles.imnum}>74</span>
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--accent)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M19 12H5" />
                    <path d="m12 19-7-7 7-7" />
                  </svg>
                  <span className={`${styles.imnum} ${styles.big}`}>86</span>
                </div>
                <p className="note" style={{ margin: 0 }}>
                  هذا الدليل وحده رفع تغطيتك لـ <b style={{ color: 'var(--accent)' }}>Backend</b> اثنتي عشرة نقطة.
                </p>
                <div className={styles.hr} />
                <span className="lbl">قدرات تأثّرت</span>
                <div className={styles.afflist}>
                  <div className={styles.aff}><span>Backend</span><span className="mono">+12</span></div>
                  <div className={styles.aff}><span>REST APIs</span><span className="mono">+8</span></div>
                  <div className={styles.aff}><span>Testing</span><span className="mono">+3</span></div>
                </div>
              </div>
            </aside>
          </div>
        </section>
      )}

      {/* ═══ 5. مسار التطور عبر الزمن (u6 - تطوّري) ═══ */}
      {activeTab === 'u6' && (
        <section className="screen" id="u6">
          <div className={styles.headrow}>
            <div>
              <span className={styles.eyebrow}>Capability Over Time</span>
              <h1 className={styles.scrt}>قدراتك ليست لقطة — هي مسار</h1>
              <p className={styles.scrp}>
                كل نقطة هنا دليل دخل ملفك ورفع قدرة. والخط الهابط دليل يفقد وزنه لأن شيئًا لم يسنده.
              </p>
            </div>
          </div>

          <div className={styles.pgrid}>
            <div className={styles.pmain}>
              <div className={`box ${styles.tlbox}`}>
                <div className={styles.tlkey} id="tlKey">
                  {TL_DATA.map((t) => (
                    <span key={t.name}>
                      <i style={{ background: t.color }} />
                      {t.name} {t.isDashed ? '(هابط)' : ''}
                    </span>
                  ))}
                </div>

                <div className={styles.tlwrap}>
                  <svg className={styles.tlsvg} id="tlSvg" viewBox="0 0 700 285" role="img" aria-label="تطوّر قدراتك عبر الزمن">
                    {/* خطوط الشبكة */}
                    {[0, 25, 50, 75, 100].map((v) => (
                      <g key={`grid-${v}`}>
                        <line className={styles.gl} x1="46" y1={tly(v).toFixed(1)} x2="682" y2={tly(v).toFixed(1)} />
                        <text className={styles.ax} x="38" y={(tly(v) + 3).toFixed(1)} textAnchor="end">
                          {v}
                        </text>
                      </g>
                    ))}

                    {/* تسميات الشهور */}
                    {TL_MONTHS.map((m, i) => (
                      <text key={m} className={styles.ax} x={tlx(i * 2).toFixed(1)} y="272" textAnchor="middle">
                        {m}
                      </text>
                    ))}

                    {/* منحنيات القدرات */}
                    {TL_DATA.map((sr) => {
                      const pathStr = sr.points
                        .map((pt, i) => `${i ? 'L' : 'M'}${tlx(pt[0] as number).toFixed(1)} ${tly(pt[1] as number).toFixed(1)}`)
                        .join(' ')
                      return (
                        <g key={sr.name}>
                          <path
                            className={styles.ln}
                            d={pathStr}
                            stroke={sr.color}
                            strokeDasharray={sr.isDashed ? '6 5' : undefined}
                          />
                          {sr.points.map((pt, pi) => {
                            if (pt[1] === 0) return null
                            return (
                              <circle
                                key={pi}
                                className={styles.pt}
                                cx={tlx(pt[0] as number).toFixed(1)}
                                cy={tly(pt[1] as number).toFixed(1)}
                                r="5"
                                fill="var(--card)"
                                stroke={sr.color}
                                strokeWidth="2.6"
                                onMouseEnter={() => setHoveredTlPoint(`${sr.name} (${pt[1]}%): ${pt[2]}`)}
                                onMouseLeave={() => setHoveredTlPoint(null)}
                              />
                            )
                          })}
                        </g>
                      )
                    })}
                  </svg>
                </div>

                <div className={styles.tltip} id="tlTip">
                  {hoveredTlPoint ? (
                    <b>{hoveredTlPoint}</b>
                  ) : (
                    'مرّر على أي نقطة لترى الدليل الذي سبّبها.'
                  )}
                </div>
              </div>

              {/* قصص الرسم */}
              <div className="box" style={{ marginTop: '1rem' }}>
                <div className={styles.secrow}>
                  <h2>ثلاث قصص في هذا الرسم</h2>
                </div>
                <div className={styles.stories}>
                  <div className={styles.sty}>
                    <span className={`${styles.stn} ${styles.teal}`} />
                    <div>
                      <b>صعود بطيء ومتراكم — Backend</b>
                      <em>خمسة أدلة على مدى سنة. لا قفزة واحدة، بل بناء هادئ مستمر يرفع الثقة.</em>
                    </div>
                  </div>
                  <div className={styles.sty}>
                    <span className={`${styles.stn} ${styles.teal2}`} />
                    <div>
                      <b>محاكاة قُدرة رسمت أول نقطة — UI/UX</b>
                      <em>لم يكن هناك دليل إطلاقًا حتى حُلّت المحاكاة، فرُسمت النقطة مباشرة بقيمة 85%.</em>
                    </div>
                  </div>
                  <div className={styles.sty}>
                    <span className={`${styles.stn} ${styles.amber}`} />
                    <div>
                      <b>شهادة قديمة تفقد وزنها — Speech Processing</b>
                      <em>دورة من 2024 بلا أي مشروع يسندها. وزنها انخفض إلى النصف لأنها لم تُمارس.</em>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══ 6. فجوتي (u2 - فجوتي) ═══ */}
      {activeTab === 'u2' && (
        <section className="screen" id="u2">
          <div className={styles.headrow}>
            <div>
              <h1 className={styles.scrt}>من Backend إلى Full Stack</h1>
              <p className={styles.scrp}>
                جاهزيتك الحالية 68%. الناقص عنصران، وكل خطوة تنتهي بدليل — لا بمشاهدة دورة.
              </p>
            </div>
            <span className="pill near">فجوتان</span>
          </div>

          <div className={styles.pgrid}>
            <div className={styles.pmain}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(14rem, 1fr))', gap: '1rem' }}>
                <div className="box">
                  <h3 style={{ fontSize: '0.95rem', color: 'var(--accent)', marginBottom: '0.7rem' }}>ما لديك</h3>
                  <div className="row" style={{ gap: '0.4rem', flexWrap: 'wrap' }}>
                    <span className="tag proven">Node.js <span className="c">6</span></span>
                    <span className="tag proven">PostgreSQL <span className="c">4</span></span>
                    <span className="tag proven">REST APIs <span className="c">3</span></span>
                  </div>
                </div>

                <div className="box">
                  <h3 style={{ fontSize: '0.95rem', color: 'var(--gapc, #e6a23c)', marginBottom: '0.7rem' }}>ما ينقصك</h3>
                  <div className="row" style={{ gap: '0.4rem', flexWrap: 'wrap' }}>
                    <span className="tag claimed">React Component State</span>
                    <span className="tag claimed">CSS Layout Architecture</span>
                  </div>
                </div>
              </div>

              <div className="box" style={{ marginTop: '1rem' }}>
                <div className={styles.secrow}>
                  <h2>مسار سد الفجوة</h2>
                  <span className="note">كل خطوة تنتهي بدليل قابل للفحص</span>
                </div>

                <div style={{ display: 'grid', gap: '0.6rem', marginTop: '0.8rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', background: 'var(--soft)', padding: '0.8rem 1rem', borderRadius: '10px' }}>
                    <span className="mono" style={{ color: 'var(--accent)', fontWeight: 600 }}>01</span>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: 0, fontSize: '0.92rem' }}>تعلّم: بنية الحالة في React</h4>
                      <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: 'var(--ink-2)' }}>مفاهيم React State والتكامل مع واجهات REST.</p>
                    </div>
                    <span className="pill ready">مقترح</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', background: 'var(--soft)', padding: '0.8rem 1rem', borderRadius: '10px' }}>
                    <span className="mono" style={{ color: 'var(--accent)', fontWeight: 600 }}>02</span>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: 0, fontSize: '0.92rem' }}>أثبت: محاكاة تفاعلية</h4>
                      <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: 'var(--ink-2)' }}>بناء شاشة واحدة كاملة مع ربطها بالـ Backend الحالي.</p>
                    </div>
                    <button
                      className="btn"
                      style={{ padding: '0.3rem 0.8rem', fontSize: '0.82rem' }}
                      onClick={() => navigate('/simulation')}
                    >
                      ابدأ التحدي
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══ 7. الفرص المطابقة (u4 - الفرص) ═══ */}
      {activeTab === 'u4' && (
        <section className="screen" id="u4">
          <div className={styles.headrow}>
            <div>
              <span className={styles.eyebrow}>Opportunities</span>
              <h1 className={styles.scrt}>فرص حقيقية، مع سبب كل رقم</h1>
              <p className={styles.scrp}>
                لا نخفي الفرص التي تنقصك فيها قدرة — نعرضها ونقول لك بالضبط ما يفصلك عنها.
              </p>
            </div>
          </div>

          <div className={styles.pgrid}>
            <div className={styles.pmain} id="oppList">
              <div className={styles.opp}>
                <div>
                  <h4>تحليل مكالمات مركز اتصال بالعربية</h4>
                  <div className={styles.co}>شركة اتصالات · عن بُعد · شهران</div>
                </div>
                <div className={styles.sc} style={{ color: 'var(--accent)' }}>91%</div>
                <div className={styles.need}>
                  <span className="pill ready" style={{ marginInlineEnd: '0.5rem' }}>جاهز الآن</span>
                  كل القدرات المطلوبة مغطّاة بأدلة حديثة. يمكنك التقديم مباشرة.
                </div>
              </div>

              <div className={styles.opp}>
                <div>
                  <h4>منصة تجارة إلكترونية — فريق منتج</h4>
                  <div className={styles.co}>شركة تجزئة · هجين · 4 أشهر</div>
                </div>
                <div className={styles.sc} style={{ color: 'var(--accent)' }}>84%</div>
                <div className={styles.need}>
                  <span className="pill near" style={{ marginInlineEnd: '0.5rem' }}>قريب</span>
                  ينقصك دليل على <b>GraphQL</b>. المستودعات الحالية تغطي REST فقط.
                </div>
              </div>

              <div className={styles.opp}>
                <div>
                  <h4>تطبيق توصيل سريع — خدمات البنية التحتية</h4>
                  <div className={styles.co}>شركة تقنية مالية · الرياض · 6 أشهر</div>
                </div>
                <div className={styles.sc} style={{ color: 'var(--ink-2)' }}>79%</div>
                <div className={styles.need}>
                  <span className="pill near" style={{ marginInlineEnd: '0.5rem' }}>قريب</span>
                  مطلوب إثبات التعامل مع حركة عالية (High Throughput).
                </div>
              </div>

              <div className={styles.opp}>
                <div>
                  <h4>نظام إدارة عيادات ومواعيد طبية</h4>
                  <div className={styles.co}>قطاع صحي · جدة · 3 أشهر</div>
                </div>
                <div className={styles.sc} style={{ color: 'var(--ink-3)' }}>65%</div>
                <div className={styles.need}>
                  <span className="pill far" style={{ marginInlineEnd: '0.5rem' }}>يحتاج مسارًا</span>
                  فجوتان في واجهات المستخدم وتوافق معايير HIPAA.
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══ 8. بطاقة الإثبات (u5 - جواز القدرات) ═══ */}
      {activeTab === 'u5' && (
        <section className="screen" id="u5">
          <div className={styles.headrow}>
            <div>
              <span className={styles.eyebrow}>Evidence Passport</span>
              <h1 className={styles.scrt}>بديل السيرة الذاتية</h1>
              <p className={styles.scrp}>
                رابط واحد تشاركه بدل ملف PDF. من يفتحه يرى ما أثبتّه فعلًا — لا ما كتبته عن نفسك.
              </p>
            </div>
          </div>

          <div className={styles.pgrid}>
            <div className={styles.pmain}>
              <div className={styles.passport} id="passportCard">
                <div className={styles.ph}>
                  <div>
                    <h3 id="ppName">{user.name || 'حسابك'}</h3>
                    <p className="note" style={{ marginTop: '0.2rem' }}>
                      مهندس برمجيات · <span className="num">11</span> دليلًا · محدّث قبل ساعتين
                    </p>
                  </div>
                  <span className="pill ready">جاهز الآن · Backend</span>
                </div>

                <div className={styles.pb}>
                  <div>
                    <span className={styles.lbl}>Proven Skills</span>
                    <div className="row" style={{ gap: '0.4rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                      <span className="tag proven">Problem Solving <span className="c">4</span></span>
                      <span className="tag proven">UI/UX <span className="c">3</span></span>
                      <span className="tag proven">Product Thinking <span className="c">2</span></span>
                      <span className="tag proven">Backend <span className="c">2</span></span>
                    </div>
                  </div>

                  <div>
                    <span className={styles.lbl}>Verified Evidence Sources</span>
                    <div style={{ display: 'grid', gap: '0.4rem', marginTop: '0.4rem', fontSize: '0.84rem' }}>
                      <div>• GitHub: 3 مستودعات موثّقة واختبارات فُحصت آليًا.</div>
                      <div>• Qudra Simulation: محاكاة هندسية حقيقية قيّمت الأداء والحلول.</div>
                      <div>• Client Projects: مشروعان سُلّما فعليًا لعملاء عبر المنصة.</div>
                    </div>
                  </div>
                </div>

                <div className={styles.pf}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <button
                      className="btn"
                      onClick={handleCopyPassport}
                      id="copyPassportBtn"
                    >
                      {copiedLink ? 'تم نسخ الرابط!' : 'انسخ رابط الجواز'}
                    </button>
                    <span className="note">رابط عام مشفّر للقراءة فقط</span>
                  </div>
                  <span className="mono" style={{ fontSize: '0.78rem', color: 'var(--ink-3)' }}>
                    qudra.sa/p/mash
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default ProfilePage
