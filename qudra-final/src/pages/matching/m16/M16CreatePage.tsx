import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import styles from './m16.module.css';
import { ArrowLeft, Sparkles, Search, Loader2, RotateCcw } from 'lucide-react';
import { MatchingService } from '../../../services/matching.service';

const DEFAULT_WEIGHTS: Record<string, number> = {
  capability_match: 0.40,
  practical: 0.25,
  project_relevance: 0.20,
  oral: 0.10,
  freshness: 0.05,
};

const WEIGHT_LABELS: Record<string, string> = {
  capability_match: 'توافق القدرات',
  practical: 'أدلة عملية',
  project_relevance: 'صلة المشروع',
  oral: 'تقييم شفهي',
  freshness: 'حداثة الأدلة',
};

export const M16CreatePage: React.FC = () => {
  const { problemId } = useParams<{ problemId: string }>();
  const navigate = useNavigate();
  const [weights, setWeights] = useState<Record<string, number>>({ ...DEFAULT_WEIGHTS });
  const [force, setForce] = useState(false);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showExplain, setShowExplain] = useState(false);

  const total = Object.values(weights).reduce((a, b) => a + b, 0);
  const valid = Math.abs(total - 1) < 0.001;

  const handleReset = () => setWeights({ ...DEFAULT_WEIGHTS });

  const handleRun = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!problemId || !valid) return;
    setRunning(true);
    setError(null);
    try {
      const res = await MatchingService.findMatches(problemId, force);
      navigate(`/matching/${problemId}/results/latest`, { state: { preloaded: res } });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشلت المطابقة — تأكد أن المشكلة مُحللة.');
    }
    setRunning(false);
  };

  return (
    <div className={styles.container} dir="rtl">
      <div className={styles.headerRow}>
        <div className={styles.headerContent}>
          <Button variant="ghost" size="sm" onClick={() => navigate('/matching')} leftIcon={<ArrowLeft size={16} />}>
            العودة
          </Button>
          <span className={styles.badgeQ}>M16 · Q-0604 · ⚓ Create</span>
          <h1 className={styles.title}>تشغيل مطابقة جديدة</h1>
          <p className={styles.subtitle}>
            المشكلة:             <span style={{ fontFamily: 'var(--font-mono)', direction: 'ltr', unicodeBidi: 'isolate' }}>{problemId || '—'}</span>.
            الأوزان الافتراضية معلنة وثابتة (40/25/20/10/5). أي تعديل يظهر في النتائج بشفافية.
          </p>
        </div>
        <Button variant="outline" size="md" onClick={() => setShowExplain(!showExplain)} leftIcon={<Sparkles size={16} />}>
          {showExplain ? 'إخفاء التفسير' : 'اشرح لي: الأوزان الخمسة'}
        </Button>
      </div>

      {showExplain && (
        <div className={styles.explainDrawer}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
            <Sparkles size={18} color="var(--proof)" />
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: 'var(--ink)' }}>
              تفسير الذكاء الاصطناعي: مكونات الدرجة الإجمالية
            </h3>
          </div>
          <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--ink-2)' }}>
            الدرجة = <strong>توافق القدرات 40%</strong> (متوسط موزون بالأهمية) + <strong>أدلة عملية 25%</strong> (أدلة PRACTICAL موثقة) +
            <strong> صلة المشروع 20%</strong> (تغطية المشاريع للقدرات) + <strong>شفهي 10%</strong> (أدلة ORAL) + <strong>حداثة 5%</strong> (قدم الأدلة).
            الترتيب النهائي تنازلي بالدرجة الإجمالية — وكل مرشح ملزم بعرض الأدلة والفجوات.
          </p>
        </div>
      )}

      <form onSubmit={handleRun} className={styles.formCard}>
        <div className={styles.formGroup}>
          <label className={styles.label}>أوزان المكونات (المجموع يجب أن يساوي 100%)</label>
          <div className={styles.weightSliders}>
            {Object.entries(weights).map(([key, val]) => (
              <div key={key} className={styles.weightRow}>
                <label htmlFor={`w-${key}`}>{WEIGHT_LABELS[key] || key}</label>
                <input
                  id={`w-${key}`}
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={val}
                  onChange={(e) => setWeights({ ...weights, [key]: Number(e.target.value) })}
                  disabled={running}
                />
                <span className={styles.weightVal}>{Math.round(val * 100)}%</span>
              </div>
            ))}
          </div>
          <p className={styles.hint}>
            المجموع الحالي: <b style={{ color: valid ? '#10B981' : '#EF4444' }}>{Math.round(total * 100)}%</b>
            {!valid && ' — عدّل الأوزان ليصبح المجموع 100%'}
          </p>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={force} onChange={(e) => setForce(e.target.checked)} disabled={running} style={{ width: 18, height: 18, accentColor: 'var(--proof)' }} />
            إعادة حساب قسرية (يمسح اللقطات المحفوظة ويعيد الحساب من الأدلة الحالية)
          </label>
        </div>

        {error && (
          <p style={{ color: '#EF4444', fontSize: '0.88rem', fontWeight: 600 }}>{error}</p>
        )}

        <div className={styles.submitRow}>
          <Button type="submit" variant="proof" size="lg" disabled={running || !valid || !problemId} leftIcon={running ? <Loader2 size={16} className={styles.spin} /> : <Search size={16} />}>
            {running ? 'جاري حساب المطابقة...' : force ? 'إعادة حساب المطابقة' : 'تشغيل المطابقة'}
          </Button>
          <Button type="button" variant="outline" size="lg" onClick={handleReset} disabled={running} leftIcon={<RotateCcw size={16} />}>
            استعادة الافتراضي
          </Button>
        </div>
      </form>
    </div>
  );
};

export default M16CreatePage;