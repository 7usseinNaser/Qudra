import styles from '../ProfilePage.module.css'
import { MY_EVIDENCES, type MyEvidence } from '../profile-data'

interface EvidenceDetailTabProps {
  evidenceIndex: number
  navigate: (route: string) => void
}

interface EvidenceSignals {
  skills: string[]
  signals: { label: string; val: string; note: string }[]
  impactBefore: number
  impactAfter: number
  impactText: string
  affected: { name: string; delta: string }[]
  verificationText: string
  lastCheck: string
}

const GITHUB_SIGNALS: Record<string, EvidenceSignals> = {
  'github.com/you/schedule-api': {
    skills: ['Backend', 'Node.js', 'REST APIs', 'Testing'],
    signals: [
      { label: 'التعقيد', val: '82%', note: 'عالٍ' },
      { label: 'الاكتمال', val: '90%', note: 'منشور' },
      { label: 'وجود اختبارات', val: '64%', note: 'جزئي' },
      { label: 'وضوح التوثيق', val: '75%', note: 'جيد' },
    ],
    impactBefore: 74, impactAfter: 86,
    impactText: 'هذا الدليل وحده رفع تغطيتك لـ Backend اثنتي عشرة نقطة.',
    affected: [
      { name: 'Backend', delta: '+12' },
      { name: 'REST APIs', delta: '+8' },
      { name: 'Testing', delta: '+3' },
    ],
    verificationText: 'قرأنا المستودع مباشرة عبر GitHub App بصلاحية قراءة فقط: البنية، سجلّ الالتزامات، الاختبارات، وملف README. لم يُدخل شيء يدويًا.',
    lastCheck: '2026-08-29 · 04:12',
  },
  'github.com/you/courses-sync': {
    skills: ['Python', 'Airflow', 'Data Pipeline', 'ETL'],
    signals: [
      { label: 'التعقيد', val: '70%', note: 'متوسط' },
      { label: 'الاكتمال', val: '85%', note: 'منشور' },
      { label: 'وجود اختبارات', val: '40%', note: 'منخفض' },
      { label: 'وضوح التوثيق', val: '60%', note: 'مقبول' },
    ],
    impactBefore: 50, impactAfter: 62,
    impactText: 'خط معالجة بيانات كامل مع جدولة Airflow — رفع قدرتك في معالجة البيانات.',
    affected: [
      { name: 'Data Pipeline', delta: '+12' },
      { name: 'Python', delta: '+6' },
      { name: 'ETL', delta: '+4' },
    ],
    verificationText: 'فحصنا البنية وسجلّ الالتزامات عبر GitHub App. خط معالجة بيانات فعلي مع جدولة ومراحل واضحة.',
    lastCheck: '2026-08-29 · 04:12',
  },
  'github.com/you/inventory-api': {
    skills: ['REST APIs', 'PostgreSQL', 'Backend', 'Testing'],
    signals: [
      { label: 'التعقيد', val: '78%', note: 'عالٍ' },
      { label: 'الاكتمال', val: '92%', note: 'منشور' },
      { label: 'وجود اختبارات', val: '71%', note: 'جيد' },
      { label: 'وضوح التوثيق', val: '88%', note: 'ممتاز' },
    ],
    impactBefore: 60, impactAfter: 78,
    impactText: 'واجهة REST كاملة لإدارة المخزون مع اختبارات وتوثيق — رفع تغطيتك لـ REST APIs.',
    affected: [
      { name: 'REST APIs', delta: '+18' },
      { name: 'PostgreSQL', delta: '+10' },
      { name: 'Backend', delta: '+8' },
    ],
    verificationText: 'قرأنا المستودع مباشرة عبر GitHub App: واجهة REST كاملة، اختبارات وحدة، وتوثيق OpenAPI. فحصنا البنية وسجلّ الالتزامات.',
    lastCheck: '2026-08-29 · 04:12',
  },
}

function getSignalsForEvidence(ev: MyEvidence): EvidenceSignals {
  const githubMatch = GITHUB_SIGNALS[ev.title]
  if (githubMatch) return githubMatch

  const simKey = 'محاكاة · تحدّي تطبيق الجامعة'
  if (ev.title === simKey) {
    return {
      skills: ['UI/UX', 'Product Thinking', 'Problem Solving', 'React'],
      signals: [
        { label: 'فهم المشكلة', val: '85%', note: 'عالٍ' },
        { label: 'جودة الحل', val: '90%', note: 'ممتاز' },
        { label: 'هيكلة الكود', val: '75%', note: 'جيد' },
        { label: 'المنطق', val: '88%', note: 'عالٍ' },
      ],
      impactBefore: 0, impactAfter: 85,
      impactText: 'محاكاة هندسية حقيقية قيّمت الأداء والحلول — رفعت قدرتك في UI/UX و Product Thinking.',
      affected: [
        { name: 'UI/UX', delta: '+85' },
        { name: 'Product Thinking', delta: '+78' },
        { name: 'Problem Solving', delta: '+88' },
      ],
      verificationText: 'قيّمت المنصة أداءك آليًا في محاكاة هندسية حقيقية: فهم المشكلة، جودة الحل، هيكلة الكود، والمنطق. لا تدخل يدوي.',
      lastCheck: '2026-08-29 · 04:12',
    }
  }

  if (ev.src === 'QUDRA' && ev.title.includes('بنية البيانات')) {
    return {
      skills: ['Backend', 'Database Design', 'SQL', 'Indexing'],
      signals: [
        { label: 'تصميم المخطط', val: '88%', note: 'ممتاز' },
        { label: 'الفهارس', val: '82%', note: 'عالٍ' },
        { label: 'التطبيع', val: '90%', note: 'ممتاز' },
        { label: 'الأداء', val: '85%', note: 'عالٍ' },
      ],
      impactBefore: 40, impactAfter: 86,
      impactText: 'تحدٍّ عملي مُقيَّم: تصميم كامل لقاعدة بيانات الجدول الجامعي مع الفهارس — رفع قدرتك في تصميم قواعد البيانات.',
      affected: [
        { name: 'Database Design', delta: '+46' },
        { name: 'Backend', delta: '+12' },
        { name: 'SQL', delta: '+8' },
      ],
      verificationText: 'قيّمت المنصة تصميمك آليًا: مخطّط العلاقات، الفهارس، التطبيع، وكفاءة الاستعلامات. نتيجة موثّقة بلا تدخل يدوي.',
      lastCheck: '2026-08-29 · 04:12',
    }
  }

  if (ev.src === 'QUDRA' && ev.title.includes('ترتيب الأولويات')) {
    return {
      skills: ['Problem Solving', 'Product Thinking', 'Prioritization', 'Decision Making'],
      signals: [
        { label: 'منطق الترتيب', val: '88%', note: 'عالٍ' },
        { label: 'تبرير القرارات', val: '82%', note: 'عالٍ' },
        { label: 'الشمولية', val: '90%', note: 'ممتاز' },
        { label: 'الواقعية', val: '85%', note: 'عالٍ' },
      ],
      impactBefore: 70, impactAfter: 88,
      impactText: 'محاكاة في ترتيب الأولويات وتبريرها — رفعت قدرتك في حل المشكلات والتفكير المنتج.',
      affected: [
        { name: 'Problem Solving', delta: '+18' },
        { name: 'Product Thinking', delta: '+10' },
        { name: 'Prioritization', delta: '+15' },
      ],
      verificationText: 'قيّمت المنصة ترتيبك وتبريرك آليًا في محاكاة هندسية. منطق القرارات، شمولية الترتيب، وواقعية التبرير.',
      lastCheck: '2026-08-29 · 04:12',
    }
  }

  if (ev.src === 'LeetCode') {
    return {
      skills: ['Algorithms', 'Data Structures', 'Problem Solving'],
      signals: [
        { label: 'عدد المسائل', val: '420', note: 'عالٍ' },
        { label: 'نسبة النجاح', val: '70%', note: 'جيد' },
        { label: 'الصعوبة', val: 'متوسط-عالٍ', note: 'متقدم' },
        { label: 'التنوّع', val: '75%', note: 'جيد' },
      ],
      impactBefore: 50, impactAfter: 70,
      impactText: 'حساب LeetCode بـ 420 مسألة — رفع قدرتك في الخوارزميات وحل المشكلات.',
      affected: [
        { name: 'Algorithms', delta: '+20' },
        { name: 'Problem Solving', delta: '+15' },
        { name: 'Data Structures', delta: '+10' },
      ],
      verificationText: 'قرأنا ملفك العام على LeetCode عبر واجهة برمجية: عدد المسائل المحلولة، نسبة النجاح، وتوزيع الصعوبة.',
      lastCheck: '2026-06-01 · 12:00',
    }
  }

  if (ev.src === 'Project' && ev.title.includes('بوابة طلاب')) {
    return {
      skills: ['Backend', 'REST APIs', 'Database', 'Integration'],
      signals: [
        { label: 'تسليم المشروع', val: '100%', note: 'مكتمل' },
        { label: 'رضا العميل', val: 'مرتفع', note: 'موثّق' },
        { label: 'التعقيد', val: '65%', note: 'متوسط' },
        { label: 'التغطية', val: '70%', note: 'جيد' },
      ],
      impactBefore: 60, impactAfter: 72,
      impactText: 'مشروع مسلّم فعليًا لعميل عبر المنصة — رفع قدرتك في Backend والتكامل مع الواجهة.',
      affected: [
        { name: 'Backend', delta: '+12' },
        { name: 'Integration', delta: '+8' },
        { name: 'REST APIs', delta: '+6' },
      ],
      verificationText: 'مشروع مسلّم لعميل عبر المنصة. تم توثيق التسليم ورضا العميل من خلال نظام التقييم الداخلي.',
      lastCheck: '2025-08-15 · 10:00',
    }
  }

  if (ev.src === 'Project' && ev.title.includes('لوحة تقارير')) {
    return {
      skills: ['Data Visualization', 'Dashboard', 'Analytics'],
      signals: [
        { label: 'التصميم', val: '72%', note: 'جيد' },
        { label: 'التفاعلية', val: '68%', note: 'مقبول' },
        { label: 'البيانات', val: '80%', note: 'جيد' },
        { label: 'الاكتمال', val: '60%', note: 'جزئي' },
      ],
      impactBefore: 40, impactAfter: 55,
      impactText: 'لوحة تقارير داخلية بلا رابط عام — رفعت قدرتك في تصوير البيانات.',
      affected: [
        { name: 'Data Visualization', delta: '+15' },
        { name: 'Analytics', delta: '+10' },
      ],
      verificationText: 'مشروع داخلي موثّق عبر المنصة بلا رابط عام. تم توثيق النطاق والتسليم من خلال نظام التقييم.',
      lastCheck: '2025-04-10 · 08:00',
    }
  }

  if (ev.src === 'Cert') {
    return {
      skills: ['Speech Processing', 'Audio Analysis'],
      signals: [
        { label: 'الصلاحية', val: 'منتهية', note: 'قديمة' },
        { label: 'الجهة المانحة', val: 'موثّقة', note: 'معروفة' },
        { label: 'الصلة بالعمل', val: 'منخفضة', note: 'بلا تطبيق' },
        { label: 'الوزن الحالي', val: '22%', note: 'متدنٍ' },
      ],
      impactBefore: 45, impactAfter: 22,
      impactText: 'شهادة قديمة بلا تطبيق عملي منذ 2024 — وزنها يتدنى تدريجيًا.',
      affected: [
        { name: 'Speech Processing', delta: '-23' },
      ],
      verificationText: 'شهادة مسجّلة يدويًا. الجهة المانحة موثّقة، لكن لا يوجد تطبيق عملي منذ التاريخ. الوزن يتدنى مع الوقت.',
      lastCheck: '2024-01-15 · 09:00',
    }
  }

  return {
    skills: [ev.skill],
    signals: [
      { label: 'مستوى التوثيق', val: 'ذاتي', note: 'بلا فحص' },
      { label: 'المصدر', val: 'يدوي', note: 'بلا رابط' },
      { label: 'الصلة بالعمل', val: 'غير موثّقة', note: 'منخفضة' },
      { label: 'الوزن الحالي', val: '5%', note: 'متدنٍ' },
    ],
    impactBefore: 0, impactAfter: 5,
    impactText: 'ادّعاء ذاتي بلا دليل — وزنه ضئيل ولا يؤثر على قدراتك الموثّقة.',
    affected: [{ name: ev.skill, delta: '+5' }],
    verificationText: 'مهارة كتبها المستخدم عن نفسه بلا مصدر أو فحص آلي. الوزن متدنٍ ولا يُحتسب كدليل موثّق.',
    lastCheck: '—',
  }
}

export function EvidenceDetailTab({ evidenceIndex, navigate }: EvidenceDetailTabProps) {
  const selected = MY_EVIDENCES[evidenceIndex] || MY_EVIDENCES[0]
  const sig = getSignalsForEvidence(selected)

  return (
    <section className="screen" id="evd">
      <div className={styles.crumb}>
        <button className={styles.back} onClick={() => navigate('/profile/evidence')}>→ رجوع لأدلتي</button>
        <span>تفاصيل الدليل</span>
      </div>

      <div className={styles.pgrid}>
        <div className={styles.pmain}>
          <div className={`box ${styles.evdhead}`}>
            <div className={styles.evdtop}>
              <span className={`${styles.eic} ${styles.big}`}>{selected.src.slice(0, 2).toUpperCase()}</span>
              <div>
                <h1>{selected.title}</h1>
                <p className="mono" style={{ color: 'var(--ink-3)', margin: 0 }}>
                  {selected.src === 'GitHub' ? selected.title : `${selected.type} · ${selected.src}`}
                </p>
              </div>
              <span
                className={`${styles.vb} ${selected.level === 'موثّق' ? styles.v1 : selected.level === 'مرتبط' ? styles.v2 : styles.v3}`}
                style={{ marginInlineStart: 'auto' }}
              >
                <span className={styles.dot} /> {selected.level}
              </span>
            </div>
            <div className={styles.evdmeta}>
              <div><span className={styles.k}>النوع:</span><span className={styles.v}>{selected.type}</span></div>
              <div><span className={styles.k}>المهارة:</span><span className={styles.v}>{selected.skill}</span></div>
              <div><span className={styles.k}>التاريخ:</span><span className={`${styles.v} mono`}>{selected.date}</span></div>
              <div><span className={styles.k}>المصدر:</span><span className={styles.v}>{selected.src}</span></div>
            </div>
          </div>

          <div className="box" style={{ marginTop: '1rem' }}>
            <div className={styles.secrow}>
              <h2>ما استخرجته قُدرة</h2>
              <span className="note">تحليل آلي للمحتوى</span>
            </div>
            <div className="row" style={{ gap: '0.4rem', marginTop: '0.9rem', flexWrap: 'wrap' }}>
              {sig.skills.map((sk) => (
                <span key={sk} className="tag proven">{sk}</span>
              ))}
            </div>
            <div className={styles.hr} />
            <div className={styles.sigrid}>
              {sig.signals.map((s) => (
                <div key={s.label} className={styles.sgi}>
                  <span>{s.label}</span>
                  <span className={styles.sgb}><i style={{ width: s.val }} /></span>
                  <span className="mono">{s.note}</span>
                </div>
              ))}
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
              {sig.verificationText}
            </p>
            <p className="mono" style={{ marginTop: '0.6rem', color: 'var(--ink-3)', fontSize: '0.8rem', margin: 0 }}>
              آخر فحص {sig.lastCheck}
            </p>
          </div>
        </div>

        <aside className={styles.pside}>
          <div className={`box ${styles.impactbox}`}>
            <span className="lbl">أثره على ملفك</span>
            <div className={styles.impbig}>
              <span className={styles.imnum}>{sig.impactBefore}</span>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--accent)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M19 12H5" />
                <path d="m12 19-7-7 7-7" />
              </svg>
              <span className={`${styles.imnum} ${styles.big}`}>{sig.impactAfter}</span>
            </div>
            <p className="note" style={{ margin: 0 }}>
              {sig.impactText}
            </p>
            <div className={styles.hr} />
            <span className="lbl">قدرات تأثّرت</span>
            <div className={styles.afflist}>
              {sig.affected.map((a) => (
                <div key={a.name} className={styles.aff}>
                  <span>{a.name}</span>
                  <span className="mono">{a.delta}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}
