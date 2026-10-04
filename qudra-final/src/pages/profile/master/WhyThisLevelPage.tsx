import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, HelpCircle, CheckCircle2, FileCode, GitPullRequest, Mic } from 'lucide-react';
import { Bar } from '../../../components/ui/Bar';

export const WhyThisLevelPage: React.FC = () => {
  const navigate = useNavigate();

  const scoringBreakdown = [
    {
      factor: 'كثافة الكود الممسوح ومطابقة الملفات',
      score: 95,
      weight: '30%',
      icon: <FileCode size={18} />,
      desc: 'تم فحص أكثر من 12,000 سطر برمجي في مستودعات مفتوحة تطبق هذه التقنية بمعايير إنتاجية.'
    },
    {
      factor: 'التنظيم المعماري وحماية الأنواع (Static Types)',
      score: 92,
      weight: '25%',
      icon: <CheckCircle2 size={18} />,
      desc: 'استخدام صارم لـ TypeScript / Pydantic والتحقق التلقائي من المدخلات بدون تساهل.'
    },
    {
      factor: 'سجل التعديلات والـ Pull Requests',
      score: 88,
      weight: '25%',
      icon: <GitPullRequest size={18} />,
      desc: 'نشاط مستمر عبر عدة أشهر ومراجعات كود تظهر نضجاً هندسياً وتعاوناً جماعياً.'
    },
    {
      factor: 'نتائج التقييم الشفاهي والفحص التفاعلي',
      score: 91,
      weight: '20%',
      icon: <Mic size={18} />,
      desc: 'إثبات فهم المفاهيم العميقة في إدارة الحالة، الأداء، ومعالجة الأخطاء.'
    }
  ];

  return (
    <div style={{ maxWidth: '48rem', margin: '0 auto', padding: '2rem 1.25rem 5rem' }} dir="rtl">
      <div style={{ marginBottom: '1.5rem' }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--ink-2)',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontFamily: 'inherit',
            fontSize: '0.85rem'
          }}
        >
          <ArrowRight size={16} />
          <span>رجوع لتفاصيل المهارة</span>
        </button>
      </div>

      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--line)',
        borderRadius: '16px',
        padding: '2rem',
        marginBottom: '2rem',
        boxShadow: 'var(--shadow)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'var(--proof-tint)',
            color: 'var(--proof-text)',
            display: 'grid',
            placeItems: 'center'
          }}>
            <HelpCircle size={22} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>
            تفسير محرك التقييم: لماذا هذا المستوى؟
          </h1>
        </div>

        <p style={{ color: 'var(--ink-2)', fontSize: '0.92rem', lineHeight: 1.6, margin: '0 0 1.5rem' }}>
          في «قُدرة»، لا نضع الدرجات عشوائياً أو بناءً على ما يكتبه المستخدم في سيرته الذاتية. هذا التقييم مستخرج بدقة عبر معادلة وزن الأدلة الرقمية:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {scoringBreakdown.map((item, i) => (
            <div
              key={i}
              style={{
                background: 'var(--surface-2)',
                border: '1px solid var(--line-soft)',
                borderRadius: '12px',
                padding: '1.25rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: 'var(--proof-text)' }}>{item.icon}</span>
                  <strong style={{ fontSize: '0.95rem' }}>{item.factor}</strong>
                </div>
                <span style={{ fontFamily: 'var(--fm)', fontSize: '0.85rem', color: 'var(--ink-3)' }}>
                  الوزن: {item.weight}
                </span>
              </div>

              <p style={{ margin: '0 0 0.6rem', fontSize: '0.84rem', color: 'var(--ink-2)', lineHeight: 1.5 }}>
                {item.desc}
              </p>

              <Bar value={item.score} size="sm" variant="proof" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhyThisLevelPage;
