import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ShieldCheck,
  ArrowRight,
  UserCheck,
  ExternalLink
} from 'lucide-react';
import { ROUTES } from '../../constants/routes';
import { Button } from '../../components/ui/Button';
import styles from './ProblemMatchReportPage.module.css';

export const ProblemMatchReportPage: React.FC = () => {
  const navigate = useNavigate();

  const candidates = [
    {
      id: 'cand-1',
      name: 'حسين ناصر',
      headline: 'Senior Full Stack & AI Systems Architect',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      matchScore: 96,
      provenCount: 6,
      rationale: 'يمتلك 3 أدلة مثبتة مباشرة في كود GitHub للأنظمة الموزعة (Microservices)، واجتاز تحدياً عملياً في معالجة التزامن مع عزل المعاملات المصرفية بنتيجة 100%.',
      evidences: [
        'تحدي عملي: FastAPI Microservices & Async Engine (100%)',
        'مستودع GitHub: 142 Commits في أنظمة المعاملات المصرفية',
        'شهادة محققة: Meta Advanced Backend Architecture'
      ]
    },
    {
      id: 'cand-2',
      name: 'سارة خالد',
      headline: 'Distributed Systems & Database Engineer',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
      matchScore: 89,
      provenCount: 4,
      rationale: 'خبرة عميقة في تحسين أداء قواعد بيانات PostgreSQL وتصميم استراتيجيات الفهرسة، مع دليل برمجي مباشر في مكتبة مفتوحة المصدر لمعالجة البيانات.',
      evidences: [
        'مستودع GitHub: PostgreSQL JSONB Query Optimization',
        'تحدي عملي: Rate Limiting & High-Throughput Pipelines',
        'تقييم شفهي: 90% في هندسة الأنظمة وقابلية التوسع'
      ]
    }
  ];

  return (
    <div className={styles.container} dir="rtl">
      {/* Back button */}
      <div style={{ marginBottom: '1.25rem' }}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(ROUTES.PROBLEM)}
          leftIcon={<ArrowRight size={15} />}
        >
          العودة لمسار المشكلة
        </Button>
      </div>

      {/* Header */}
      <div className={styles.headerRow}>
        <div className={styles.titleArea}>
          <h1>
            <Sparkles size={26} style={{ color: '#00B8B8' }} />
            تقرير المطابقة الذكية للمشكلة (AI Explainable Match)
          </h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--ink-2)', margin: 0 }}>
            تحليل مدعوم بالذكاء الاصطناعي يربط المتطلبات الهندسية للمشكلة بـ Skill DNA والأدلة البرمجية المثبتة للمرشحين.
          </p>
        </div>
      </div>

      {/* Problem Context Banner */}
      <div className={styles.problemCard}>
        <div className={styles.problemTitle}>المشكلة البرمجية المطروحة: معمارية التوسع والطلبات المتزامنة</div>
        <p className={styles.problemDesc}>
          بناء نظام معالجة مدفوعات متزامن يستوعب حتى 50,000 طلب بالدقيقة مع منع أي Race Conditions وتأمين المعاملات المالية عبر عزل النطاقات.
        </p>
      </div>

      {/* Candidates List */}
      <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 1rem 0', color: '#fff' }}>
        المرشحون الأكثر تطابقاً مع الأدلة البرمجية المثبتة
      </h2>

      <div className={styles.candidatesList}>
        {candidates.map(cand => (
          <div key={cand.id} className={styles.candidateMatchCard}>
            <div className={styles.candidateTopRow}>
              <div className={styles.candidateIdentity}>
                <img src={cand.avatar} alt={cand.name} className={styles.avatar} />
                <div className={styles.nameBlock}>
                  <h3>{cand.name}</h3>
                  <p>{cand.headline}</p>
                </div>
              </div>

              <div className={styles.matchScoreBox}>
                <span className={styles.matchVal}>{cand.matchScore}%</span>
                <div className={styles.matchLabel}>
                  <strong style={{ color: '#fff' }}>نسبة التطابق</strong>
                  <span>{cand.provenCount} قدرات مثبتة ✓</span>
                </div>
              </div>
            </div>

            {/* AI Rationale */}
            <div className={styles.aiRationale}>
              <strong style={{ color: '#00B8B8', display: 'block', marginBottom: '0.25rem' }}>
                تفسير الذكاء الاصطناعي لاختيار المرشح (AI Rationale):
              </strong>
              {cand.rationale}
            </div>

            {/* Evidence Badges */}
            <div className={styles.evidenceGrid}>
              {cand.evidences.map((ev, idx) => (
                <div key={idx} className={styles.evidenceItem}>
                  <ShieldCheck size={16} style={{ color: '#00B8B8', flexShrink: 0 }} />
                  <span>{ev}</span>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate(`/candidates/${cand.id}`)}
                leftIcon={<ExternalLink size={14} />}
              >
                استعراض الملف والأدلة
              </Button>
              <Button
                variant="proof"
                size="sm"
                onClick={() => navigate(ROUTES.SIMULATION)}
                leftIcon={<UserCheck size={14} />}
              >
                بدء جلسة المحاكاة التفاعلية
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
