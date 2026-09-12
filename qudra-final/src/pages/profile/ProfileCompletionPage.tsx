import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowLeft } from 'lucide-react';
import { ROUTES } from '../../constants/routes';
import { Bar } from '../../components/ui/Bar';
import { Button } from '../../components/ui/Button';
import { GithubIcon } from '../../components/ui/GithubIcon';

export const ProfileCompletionPage: React.FC = () => {
  const navigate = useNavigate();

  const milestones = [
    {
      id: 'm1',
      title: 'إنشاء الحساب وتأكيد البريد',
      impact: '+25%',
      isCompleted: true,
      desc: 'تم تفعيل الحساب وتوثيق الهوية الرقمية.'
    },
    {
      id: 'm2',
      title: 'ربط ومسح مستودعات GitHub',
      impact: '+45%',
      isCompleted: false,
      desc: 'إثبات الكفاءات التقنية عبر فحص الكود الحقيقي والمستودعات المفتوحة.',
      actionRoute: ROUTES.GITHUB_CONNECT
    },
    {
      id: 'm3',
      title: 'اجتياز التقييم الشفاهي المعمق',
      impact: '+20%',
      isCompleted: false,
      desc: 'جلسة تقييم تفاعلية لإثبات القرارات المعمارية وحل المشكلات.',
      actionRoute: ROUTES.SIMULATION
    },
    {
      id: 'm4',
      title: 'توثيق مشروع عملي أو مساهمة حرة',
      impact: '+10%',
      isCompleted: false,
      desc: 'ربط نتائج تسليم مشروع حقيقي كدليل إضافي في ملفك.',
      actionRoute: ROUTES.PROBLEM
    }
  ];

  return (
    <div style={{ maxWidth: '42rem', margin: '0 auto', padding: '2rem 1.25rem 5rem' }} dir="rtl">
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: '0 0 0.35rem' }}>مستوى اكتمال ملف الإثبات</h1>
        <p style={{ color: 'var(--ink-2)', fontSize: '0.95rem' }}>
          كلما ارتفعت نسبة الأدلة المثبتة، زادت فرص اختيارك في المشاريع والتحديات الهندسية المتقدمة.
        </p>
      </div>

      {/* Main Score Card */}
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--line)',
        borderRadius: '16px',
        padding: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>اكتمال الملف المهاري</span>
          <span style={{ fontFamily: 'var(--fm)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--proof-text)' }}>
            70%
          </span>
        </div>
        <Bar value={70} size="lg" variant="proof" />
      </div>

      {/* Milestones List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {milestones.map(m => (
          <div
            key={m.id}
            style={{
              background: 'var(--surface)',
              border: '1px solid',
              borderColor: m.isCompleted ? 'var(--proof-line)' : 'var(--line)',
              borderRadius: '12px',
              padding: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: m.isCompleted ? 'var(--proof-tint)' : 'var(--surface-2)',
                color: m.isCompleted ? 'var(--proof-text)' : 'var(--ink-3)',
                display: 'grid',
                placeItems: 'center',
                flexShrink: 0
              }}>
                {m.isCompleted ? <CheckCircle2 size={20} /> : <GithubIcon size={20} />}
              </div>
              <div>
                <h4 style={{ margin: '0 0 0.2rem', fontSize: '1rem', fontWeight: 700 }}>
                  {m.title} <span style={{ color: 'var(--proof-text)', fontSize: '0.8rem', fontFamily: 'var(--fm)' }}>({m.impact})</span>
                </h4>
                <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--ink-2)' }}>{m.desc}</p>
              </div>
            </div>

            {m.isCompleted ? (
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--proof-text)' }}>مكتمل</span>
            ) : (
              m.actionRoute && (
                <Button
                  variant="proof"
                  size="sm"
                  onClick={() => navigate(m.actionRoute!)}
                  rightIcon={<ArrowLeft size={14} />}
                >
                  ابدأ الآن
                </Button>
              )
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileCompletionPage;
