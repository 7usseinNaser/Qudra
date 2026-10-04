import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QudraStore } from '../../../services/store';
import { Button } from '../../../components/ui/Button';
import { M10AnchorNav } from './M10AnchorNav';
import styles from './m10.module.css';
import { ArrowLeft, Info, Clock, DollarSign, Globe, Award, CheckCircle2, ExternalLink, Star } from 'lucide-react';

const mockCourses = [
  {
    id: 'course-1',
    title: 'React Testing Library — من الصفر للإنتاج',
    provider: 'QUDRA Academy',
    level: 'متوسط',
    durationHours: 6,
    price: 0,
    language: 'العربية',
    gapAddressed: 'Testing evidence limited',
    description: 'تعلم كتابة اختبارات وحدوية وتكاملية لتطبيقات React باستخدام Testing Library و Jest. يتضمن مشروع تطبيقي كامل مع CI/CD.',
    evidence: ['مشروع اختبارات مكتمل', 'نتيجة CI خضراء', 'تغطية كود 80%+'],
    progress: 35,
    status: 'IN_PROGRESS',
    enrolledAt: '2026-09-10',
    sourceUrl: 'https://qudra.example/course/react-testing',
  },
  {
    id: 'course-2',
    title: 'TypeScript Advanced Patterns',
    provider: 'QUDRA Academy',
    level: 'متقدم',
    durationHours: 8,
    price: 0,
    language: 'العربية',
    gapAddressed: 'Advanced TS patterns',
    description: 'أنماط TypeScript متقدمة: Generics متقدمة، Conditional Types، Template Literal Types، و Type-safe APIs.',
    evidence: [],
    progress: 0,
    status: 'NOT_STARTED',
    enrolledAt: null,
    sourceUrl: 'https://qudra.example/course/ts-advanced',
  },
  {
    id: 'course-3',
    title: 'System Design for Frontend Engineers',
    provider: 'External Partner',
    level: 'متقدم',
    durationHours: 12,
    price: 49,
    language: 'English',
    gapAddressed: 'Architecture evidence gap',
    description: 'معمارية واجهات أمامية قابلة للتوسع: Micro-frontends، State management at scale، Performance budgets.',
    evidence: [],
    progress: 0,
    status: 'NOT_STARTED',
    enrolledAt: null,
    sourceUrl: 'https://partner.example/system-design-fe',
  },
];

export const M10DetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const [showExplain, setShowExplain] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<typeof mockCourses[0] | null>(mockCourses[0]);

  const user = QudraStore.getUser();
  const gaps = QudraStore.getGaps();

  return (
    <div className={styles.container}>
      <M10AnchorNav />

      <div className={styles.headerRow}>
        <div>
          <span className={styles.badgeQ}>M10 · Q-0363 · ⚓ Details</span>
          <h1 className={styles.title}>تفاصيل الدورة المقترحة</h1>
          <p className={styles.subtitle}>
            جميع الحقول: العنوان، المزود، المستوى، المدة، السعر، اللغة، الفجوة المعالجة + الأدلة المرتبطة + السجل + الإجراءات.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={() => setShowExplain(!showExplain)} leftIcon={<Info size={14} />}>
          {showExplain ? 'إخفاء التفسير' : 'اشرح لي: لماذا هذه الدورة؟'}
        </Button>
      </div>

      {showExplain && (
        <div className={styles.explainDrawer} style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <Info size={16} color="var(--proof-text)" />
            <strong style={{ fontSize: '0.88rem', color: 'var(--proof-text)' }}>
              تفسير التوصية (Explain Drawer)
            </strong>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--ink-2)', lineHeight: 1.6, margin: 0 }}>
            • <strong>معيار الاختيار</strong>: الدورة تعالج الفجوة النشطة مباشرة، تحتوي مشروعاً تطبيقياً، ومجانية أو منخفضة التكلفة.<br />
            • <strong>الأدلة المستخدمة</strong>: فجوة «Testing evidence limited» نشطة، لا توجد أدلة Testing موثقة، القدرة «Frontend Testing» قيد التطور.<br />
            • <strong>كل حقل يعرض مصدره</strong>: المزود، المستوى، والمدة من الكتالوج. السعر واللغة من بيانات المزود. الفجوة من تحليل QUDRA.<br />
            • <strong>الإكمال = دليل مساعد</strong>؛ الإثبات النهائي = مشروع تطبيقي أو تحدٍ عملي (Q-0367).
          </p>
        </div>
      )}

      <div className={styles.card} style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          {mockCourses.map(course => (
            <Button
              key={course.id}
              variant={selectedCourse?.id === course.id ? 'proof' : 'outline'}
              size="sm"
              onClick={() => setSelectedCourse(course)}
              className={styles.courseTab}
            >
              {course.title.substring(0, 22)}...
            </Button>
          ))}
        </div>

        {selectedCourse && (
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--ink)' }}>
              {selectedCourse.title}
            </h2>

            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1rem', fontSize: '0.85rem', color: 'var(--ink-2)' }}>
              <span><Clock size={14} /> {selectedCourse.durationHours} ساعة</span>
              <span><DollarSign size={14} /> {selectedCourse.price === 0 ? 'مجاني' : `$${selectedCourse.price}`}</span>
              <span><Globe size={14} /> {selectedCourse.language}</span>
              <span><Award size={14} /> {selectedCourse.level}</span>
              <span><Star size={14} /> {selectedCourse.provider}</span>
            </div>

            <div className={styles.fieldRow}>
              <span className={styles.fieldLabel}>الفجوة المعالجة</span>
              <div className={styles.fieldValue}>
                <span style={{ background: 'var(--gap-tint)', color: 'var(--gap-text)', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700 }}>
                  {selectedCourse.gapAddressed}
                </span>
                <span className={styles.sourceTag}>تحليل QUDRA</span>
              </div>
            </div>

            <div className={styles.fieldRow}>
              <span className={styles.fieldLabel}>الوصف</span>
              <div className={styles.fieldValue} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem' }}>
                <span style={{ color: 'var(--ink)', lineHeight: 1.6 }}>{selectedCourse.description}</span>
                <span className={styles.sourceTag}>الكتالوج: {selectedCourse.provider}</span>
              </div>
            </div>

            <div className={styles.fieldRow}>
              <span className={styles.fieldLabel}>التقدم</span>
              <div className={styles.fieldValue} style={{ alignItems: 'center', gap: '1rem' }}>
                <div style={{ flex: 1, maxWidth: 300, height: 8, background: 'var(--surface-2)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: `${selectedCourse.progress}%`, height: '100%', background: selectedCourse.status === 'COMPLETED' ? 'var(--proof)' : 'var(--accent, #14b8a6)', borderRadius: 4, transition: 'width 0.3s' }} />
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, fontFamily: 'var(--fn)', color: 'var(--ink)' }}>
                  {selectedCourse.progress}%
                </span>
                <span className={styles.sourceTag}>{selectedCourse.status === 'COMPLETED' ? 'مكتملة' : selectedCourse.status === 'IN_PROGRESS' ? 'قيد التنفيذ' : 'لم تبدأ'}</span>
              </div>
            </div>

            <div className={styles.fieldRow}>
              <span className={styles.fieldLabel}>الأدلة المرتبطة</span>
              <div className={styles.fieldValue} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem' }}>
                {selectedCourse.evidence.length > 0 ? (
                  <>
                    {selectedCourse.evidence.map((e, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--ink)' }}>
                        <CheckCircle2 size={16} color="var(--proof)" />
                        <span>{e}</span>
                      </div>
                    ))}
                    <span className={styles.sourceTag}>مصدر: تحدٍ عملي / مشروع تطبيقي</span>
                  </>
                ) : (
                  <span style={{ color: 'var(--ink-3)', fontStyle: 'italic' }}>لا أدلة بعد — ستضاف عند إكمال المشروع التطبيقي</span>
                )}
              </div>
            </div>

            <div className={styles.fieldRow}>
              <span className={styles.fieldLabel}>السجل</span>
              <div className={styles.fieldValue} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.35rem', fontSize: '0.82rem', color: 'var(--ink-2)' }}>
                <span>تم التسجيل: {selectedCourse.enrolledAt || '—'}</span>
                <span>المزود: {selectedCourse.provider}</span>
                <span>آخر تحديث: 2026-09-20</span>
              </div>
            </div>

            <div className={styles.actionRow} style={{ marginTop: '1rem' }}>
              <Button
                variant={selectedCourse.status === 'NOT_STARTED' ? 'proof' : 'outline'}
                size="md"
                onClick={() => setSelectedCourse({ ...selectedCourse, status: 'IN_PROGRESS', progress: 10 })}
                rightIcon={<ArrowLeft size={16} />}
              >
                {selectedCourse.status === 'NOT_STARTED' ? 'بدء الدورة الآن' : 'متابعة التعلم'}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => window.open(selectedCourse.sourceUrl, '_blank')} leftIcon={<ExternalLink size={14} />}>
                فتح على منصة المزود
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigate('/learn/results')}>
                عرض نتائج الدورات (Q-0367)
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className={styles.card}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 1rem' }}>قائمة الدورات الكاملة (List View)</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {mockCourses.map(course => (
            <div key={course.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: '10px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 0.25rem', color: 'var(--ink)' }}>{course.title}</h4>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.78rem', color: 'var(--ink-2)', flexWrap: 'wrap' }}>
                  <span>{course.provider}</span>
                  <span>{course.durationHours} ساعة</span>
                  <span>{course.price === 0 ? 'مجاني' : `$${course.price}`}</span>
                  <span>{course.language}</span>
                  <span>{course.level}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Button variant={course.status === 'NOT_STARTED' ? 'proof' : 'outline'} size="sm">
                  {course.status === 'NOT_STARTED' ? 'بدء' : 'متابعة'}
                </Button>
                <Button variant="ghost" size="sm" leftIcon={<ExternalLink size={12} />} onClick={() => window.open(course.sourceUrl, '_blank')}>
                  فتح
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default M10DetailsPage;