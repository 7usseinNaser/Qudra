import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import styles from './m16.module.css';
import { ArrowLeft, FileText, Sparkles, CheckCircle, Clock, AlertCircle, Download, RefreshCw } from 'lucide-react';
import { MatchingService, RemoteMatchesResponse } from '../../../services/matching.service';

export const M16DetailsPage: React.FC = () => {
  const { problemId } = useParams<{ problemId: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<RemoteMatchesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [recalculating, setRecalculating] = useState(false);
  const [showExplain, setShowExplain] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!problemId) { setLoading(false); return; }
      setLoading(true);
      setError(null);
      try {
        const res = await MatchingService.findMatches(problemId);
        setData(res);
      } catch (e: unknown) {
        const err = e as Error;
        setError(err?.message || 'تعذر جلب تفاصيل جلسة المطابقة.');
      }
      setLoading(false);
    };
    load();
  }, [problemId]);

  const handleRecalc = async () => {
    if (!problemId) return;
    setRecalculating(true);
try {
      const res = await MatchingService.recalculate(problemId);
      setData(res);
    } catch (e: unknown) {
      const err = e as Error;
      setError(err?.message || 'فشلت إعادة الحساب.');
    }
    setRecalculating(false);
  };

  const handleExport = () => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `matches-${data.problem_id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className={styles.container} dir="rtl">
        <div className={styles.loadingState}>
          <div className={styles.spinner} />
          <span>جاري تحميل تفاصيل المطابقة...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container} dir="rtl">
      <div className={styles.headerRow}>
        <div className={styles.headerContent}>
          <Button variant="ghost" size="sm" onClick={() => navigate('/matching')} leftIcon={<ArrowLeft size={16} />}>
            العودة
          </Button>
          <span className={styles.badgeQ}>M16 · Q-0603 · ⚓ Details</span>
          <h1 className={styles.title}>تفاصيل جلسة المطابقة</h1>
          <p className={styles.subtitle}>
            {data ? `${data.problem_title} — ${data.total_candidates} مرشحاً` : `المشكلة: ${problemId || '—'}`}
          </p>
        </div>
        <div className={styles.actionRow}>
          <Button variant="outline" size="md" onClick={() => setShowExplain(!showExplain)} leftIcon={<Sparkles size={16} />}>
            {showExplain ? 'إخفاء التفسير' : 'اشرح لي: الجلسة'}
          </Button>
          <Button variant="outline" size="md" onClick={handleExport} disabled={!data} leftIcon={<Download size={16} />}>
            تصدير JSON
          </Button>
          <Button variant="proof" size="md" onClick={handleRecalc} disabled={recalculating || !problemId} leftIcon={<RefreshCw size={16} className={recalculating ? styles.spin : ''} />}>
            {recalculating ? 'جاري إعادة الحساب...' : 'إعادة حساب'}
          </Button>
        </div>
      </div>

      {showExplain && (
        <div className={styles.explainDrawer}>
          <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--ink-2)' }}>
            الجلسة تحفظ <strong>لقطة (Snapshot)</strong> لكل مرشح: الدرجة الإجمالية + 5 مكونات + شرح منظم (ملخص، نقاط قوة، فجوات، مشاريع ذات صلة) + تفصيل كل قدرة (COVERED/PARTIAL/GAP).
            إعادة الحساب تمسح اللقطات وتعيد الاشتقاق من الأدلة الحالية.
          </p>
        </div>
      )}

      {error && (
        <div className={styles.errorState}>
          <AlertCircle className={styles.errorIcon} size={48} />
          <h2 className={styles.errorTitle}>تعذر تحميل الجلسة</h2>
          <p className={styles.errorDesc}>{error}</p>
          <div className={styles.recoveryActions}>
            <Button variant="proof" onClick={handleRecalc}>إعادة المحاولة</Button>
            <Button variant="outline" onClick={() => navigate(`/matching/${problemId}/create`)}>تشغيل مطابقة جديدة</Button>
          </div>
        </div>
      )}

      {data && (
        <>
          <div className={styles.grid3}>
            <div className={styles.metricBox}>
              <span className={styles.metricLabel}>المرشحون</span>
              <span className={styles.metricValue}><span className="num">{data.total_candidates}</span></span>
              <span className={styles.metricHint}>إجمالي المرشحين المؤهلين</span>
            </div>
            <div className={styles.metricBox}>
              <span className={styles.metricLabel}>أعلى درجة</span>
              <span className={styles.metricValue} style={{ color: '#10B981' }}>
                <span className="num">{data.matches.length ? data.matches[0].total_score : 0}</span>
              </span>
              <span className={styles.metricHint}>أفضل تطابق</span>
            </div>
            <div className={styles.metricBox}>
              <span className={styles.metricLabel}>تغطية كاملة</span>
              <span className={styles.metricValue}>
                <span className="num">{data.matches.filter(m => m.capability_breakdown.every(b => b.status === 'COVERED')).length}</span>
              </span>
              <span className={styles.metricHint}>مرشحون بلا فجوات</span>
            </div>
          </div>

          <div className={styles.card}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--ink)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={20} style={{ color: 'var(--proof)' }} />
              الأوزان المستخدمة في هذه الجلسة
            </h2>
            <div className={styles.componentGrid}>
              {Object.entries(data.weights).map(([k, v]) => (
                <div key={k} className={styles.componentChip}>
                  <b><span className="num">{Math.round(v * 100)}%</span></b>
                  <span>{k.replace(/_/g, ' ')}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
              <Button variant="proof" size="md" onClick={() => navigate(`/matching/${problemId}/results/latest`, { state: { preloaded: data } })}>
                عرض المرشحين مرتبين
              </Button>
              <Button variant="outline" size="md" onClick={() => navigate(`/problem/analysis/${problemId}`)}>
                <Clock size={14} /> عرض تحليل المشكلة
              </Button>
            </div>
          </div>
        </>
      )}

      {!data && !error && (
        <div className={styles.card} style={{ textAlign: 'center' }}>
          <CheckCircle size={40} style={{ color: 'var(--ink-2)', opacity: 0.5 }} />
          <p style={{ color: 'var(--ink-2)' }}>لا توجد جلسة محفوظة — شغّل المطابقة أولاً.</p>
          <Button variant="proof" onClick={() => navigate(`/matching/${problemId}/create`)}>تشغيل المطابقة</Button>
        </div>
      )}
    </div>
  );
};

export default M16DetailsPage;