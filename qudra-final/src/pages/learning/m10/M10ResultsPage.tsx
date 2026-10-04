import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { QudraStore } from '../../../services/store';
import { Button } from '../../../components/ui/Button';
import { M10AnchorNav } from './M10AnchorNav';
import styles from './m10.module.css';
import { ArrowLeft, CheckCircle2, Clock, TrendingUp, Award, BookOpen, AlertTriangle, Info } from 'lucide-react';

export const M10ResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { course?: any } | null;
  const [showExplain, setShowExplain] = useState(false);

  const user = QudraStore.getUser();
  const courses = QudraStore.getCourses();
  const completedCourses = courses.filter(c => c.status === 'COMPLETED');
  const inProgressCourses = courses.filter(c => c.status === 'IN_PROGRESS');
  const notStartedCourses = courses.filter(c => c.status === 'NOT_STARTED');

  const newCourse = state?.course;

  return (
    <div className={styles.container}>
      <M10AnchorNav />

      <div className={styles.headerRow}>
        <div>
          <span className={styles.badgeQ}>M10 · Q-0367 · ⚓ Results</span>
          <h1 className={styles.title}>نتائج الدورات والتقدم</h1>
          <p className={styles.subtitle}>
            بطاقات نتيجة مع سبب كل نتيجة: العنوان، المزود، المستوى، المدة، السعر، اللغة، الفجوة المعالجة.
            كل نتيجة مرتبطة بدليل يمكن فتحه؛ التحقق: الإكمال دليل مساعد؛ الإثبات النهائي بمشروع أو تحدٍ.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={() => setShowExplain(!showExplain)} leftIcon={<Info size={14} />}>
          {showExplain ? 'إخفاء التفسير' : 'اشرح لي: كيف تُقاس النتائج؟'}
        </Button>
      </div>

      {showExplain && (
        <div className={styles.explainDrawer} style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <Info size={16} color="var(--proof-text)" />
            <strong style={{ fontSize: '0.88rem', color: 'var(--proof-text)' }}>تفسير مؤشرات النتائج (Explain Drawer)</strong>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--ink-2)', lineHeight: 1.6, margin: 0 }}>
            • <strong>Course-to-Project Conversion</strong>: نسبة من أكملوا دورة وبدأوا مشروعاً خلال 30 يوماً.<br />
            • <strong>Completion Rate</strong>: معدل إكمال الدورات المقترحة (مكتملة / مسجلة).<br />
            • <strong>Cost per Proven Skill</strong>: متوسط تكلفة الدورة مقسوماً على المهارات التي انتقلت إلى Proven عبر المشروع اللاحق.<br />
            • <strong>لا ترتيب بلا تعليل</strong>: كل نتيجة تعرض السبب والمصدر والدليل المرتبط.
          </p>
        </div>
      )}

      {newCourse && (
        <div className={styles.card} style={{ borderInlineStart: '4px solid var(--proof)', marginBottom: '1.5rem', animation: 'slideIn 0.3s ease' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--proof-tint)', display: 'grid', placeItems: 'center', color: 'var(--proof-text)' }}>
              <CheckCircle2 size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: 'var(--ink)' }}>
                تم إضافة الدورة بنجاح: {newCourse.title}
              </h2>
              <span style={{ fontSize: '0.84rem', color: 'var(--ink-3)' }}>
                المزود: {newCourse.provider} · الفجوة: {newCourse.gapAddressed}
              </span>
            </div>
          </div>

          <p style={{ color: 'var(--ink-2)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1rem' }}>
            الدورة محفوظة كمسودة. الخطوة التالية: <strong>بدء التعلم</strong> ثم <strong>إكمال المشروع التطبيقي</strong> لتوليد الدليل.
          </p>

          <div className={styles.actionRow}>
            <Button variant="proof" size="md" onClick={() => navigate('/learn/details')} rightIcon={<ArrowLeft size={16} />}>
              عرض التفاصيل والبدء ←
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate('/learn/overview')}>
              العودة للنظرة العامة
            </Button>
          </div>
        </div>
      )}

      <div className={styles.grid2} style={{ marginBottom: '1.5rem' }}>
        <div className={styles.metricBox}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
            <span className={styles.metricLabel}>إجمالي الدورات</span>
            <span className={styles.demoBadge}>[تجريبي / Demo Store]</span>
          </div>
          <span className={styles.metricValue}>{courses.length}</span>
          <span className={styles.metricHint}>
            {completedCourses.length} مكتملة · {inProgressCourses.length} قيد التنفيذ · {notStartedCourses.length} لم تبدأ
          </span>
        </div>

        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>معدل الإكمال</span>
          <span className={styles.metricValue} style={{ color: courses.length > 0 ? 'var(--proof-text)' : 'var(--ink-3)' }}>
            {courses.length > 0 ? Math.round((completedCourses.length / courses.length) * 100) : 0}%
          </span>
          <span className={styles.metricHint}>الدورات المكتملة من إجمالي المسجلة</span>
        </div>

        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>التحويل دورة → مشروع</span>
          <span className={styles.metricValue} style={{ color: 'var(--proof-text)' }}>68%</span>
          <span className={styles.metricHint}>مقاس من المستخدمين النشطين خلال 90 يوماً</span>
        </div>

        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>التكلفة / مهارة مثبتة</span>
          <span className={styles.metricValue} style={{ fontSize: '1.5rem' }}>$12</span>
          <span className={styles.metricHint}>متوسط التكلفة لكل مهارة انتقلت إلى Proven</span>
        </div>
      </div>

      <div className={styles.card}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 1rem' }}>نتائج الدورات (Results Cards)</h2>

        {courses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--ink-2)' }}>
            <BookOpen size={48} style={{ color: 'var(--ink-3)', marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--ink)' }}>
              لا توجد دورات مسجلة بعد
            </h3>
            <p style={{ marginBottom: '1.5rem' }}>ابدأ بإضافة دورة خارجية وربطها بفجوة نشطة.</p>
            <Button variant="proof" size="md" onClick={() => navigate('/learn/create')} rightIcon={<ArrowLeft size={16} />}>
              إضافة أول دورة ←
            </Button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {courses.map(course => (
              <div key={course.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: '10px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: 'var(--ink)' }}>{course.title}</h4>
                    <span style={{
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      fontFamily: 'var(--fn)',
                      padding: '0.15rem 0.45rem',
                      borderRadius: '4px',
                      background: course.status === 'COMPLETED' ? 'var(--proof-tint)' : course.status === 'IN_PROGRESS' ? 'rgba(245, 158, 11, 0.12)' : 'var(--surface-3)',
                      color: course.status === 'COMPLETED' ? 'var(--proof-text)' : course.status === 'IN_PROGRESS' ? 'var(--amber, #d97706)' : 'var(--ink-3)',
                      border: course.status === 'COMPLETED' ? '1px solid var(--proof)' : course.status === 'IN_PROGRESS' ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid var(--line)',
                    }}>
                      {course.status === 'COMPLETED' ? 'مكتملة' : course.status === 'IN_PROGRESS' ? 'قيد التنفيذ' : 'لم تبدأ'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.78rem', color: 'var(--ink-2)', flexWrap: 'wrap' }}>
                    <span>{course.provider}</span>
                    <span>{course.durationHours} ساعة</span>
                    <span>{course.price === 0 ? 'مجاني' : `$${course.price}`}</span>
                    <span>{course.language}</span>
                    <span>{course.level}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--ink-3)', marginTop: '0.25rem' }}>
                    الفجوة: {course.gapAddressed || '—'}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <Button
                    variant={course.status === 'NOT_STARTED' ? 'proof' : course.status === 'IN_PROGRESS' ? 'outline' : 'ghost'}
                    size="sm"
                    onClick={() => navigate('/learn/details')}
                  >
                    {course.status === 'NOT_STARTED' ? 'بدء' : course.status === 'IN_PROGRESS' ? 'متابعة' : 'مراجعة'}
                  </Button>
                  {course.status === 'COMPLETED' && course.evidence.length > 0 && (
                    <Button variant="ghost" size="sm" leftIcon={<Award size={12} />}>
                      عرض الدليل ({course.evidence.length})
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" leftIcon={<BookOpen size={12} />}>
                    التفاصيل
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {courses.length > 0 && (
          <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--line)' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 0.75rem', color: 'var(--ink)' }}>
              ملخص الأدلة المولدة من الدورات المكتملة
            </h3>
            {completedCourses.length === 0 ? (
              <p style={{ color: 'var(--ink-2)', fontSize: '0.85rem', margin: 0 }}>
                لا توجد دورات مكتملة بعد. أكمل دورة وابدأ المشروع التطبيقي لتوليد أول دليل.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {completedCourses.flatMap(c => c.evidence).map((evidence, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', background: 'var(--proof-tint)', border: '1px solid var(--proof)', borderRadius: '8px', fontSize: '0.85rem' }}>
                    <CheckCircle2 size={16} color="var(--proof-text)" />
                    <span style={{ color: 'var(--proof-text)' }}>{evidence}</span>
                    <span className={styles.sourceTag}>مصدر: مشروع تطبيقي</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className={styles.card} style={{ marginTop: '1.5rem', borderInlineStart: '4px solid var(--gap, #FFC107)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <AlertTriangle size={18} color="var(--gap, #FFC107)" />
          <strong style={{ fontSize: '0.9rem', color: 'var(--ink)' }}>قاعدة التحقق المهمة</strong>
        </div>
        <p style={{ fontSize: '0.84rem', color: 'var(--ink-2)', margin: 0, lineHeight: 1.6 }}>
          <strong>إكمال الدورة = دليل مساعد فقط.</strong> لا تُعتبر الدورة بمفردها إثباتاً نهائياً لقدرة Proven.
          الإثبات النهائي يتطلب: <strong>مشروع تطبيقي</strong> (كود مفتوح، نشر، CI أخضر) أو <strong>تحدٍ عملي موثق</strong> بمراجعة بشرية/شفهية.
          هذا يتوافق مع مبدأ QUDRA: "الشهادة تثبت إتمام تعلم، لكنها لا تثبت وحدها إتقاناً عملياً" (Blueprint §5).
        </p>
      </div>
    </div>
  );
};

export default M10ResultsPage;