import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import styles from './m25.module.css';
import { ShieldCheck, PlusCircle, Sparkles, Download, Ban, History, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { M25EmptyPage } from './M25EmptyPage';
import { PrivacyService, ConsentItem, AccessLogEntry } from '../../../services/privacy.service';

export const M25OverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const [consents, setConsents] = useState<ConsentItem[]>([]);
  const [log, setLog] = useState<AccessLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showExplain, setShowExplain] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [revokingAll, setRevokingAll] = useState(false);
  const [toggling, setToggling] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [c, l] = await Promise.all([
        PrivacyService.getConsents(),
        PrivacyService.getAccessLog(),
      ]);
      setConsents(c);
      setLog(l);
      setLoading(false);
    };
    load();
  }, []);

  const handleToggle = async (id: string, granted: boolean) => {
    setToggling(id);
    const updated = await PrivacyService.setConsent(id, !granted);
    setConsents(updated);
    setToggling(null);
  };

  const handleRevokeAll = async () => {
    if (!window.confirm('سحب جميع الموافقات فوراً؟ سيتوقف الظهور في المطابقة والتحليلات.')) return;
    setRevokingAll(true);
    const updated = await PrivacyService.revokeAll();
    setConsents(updated);
    setRevokingAll(false);
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      await PrivacyService.exportAll('qudra-my-data.json');
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container} dir="rtl">
        <div className={styles.loadingState}>
          <div className={styles.spinner} />
          <span>جاري تحميل إعدادات الخصوصية...</span>
        </div>
      </div>
    );
  }

  if (consents.length === 0) {
    return (
      <div className={styles.container} dir="rtl">
        <M25EmptyPage onCreateClick={() => navigate('/privacy/grant')} />
      </div>
    );
  }

  const granted = consents.filter((c) => c.granted).length;
  const revoked = consents.length - granted;
  const deniedAccess = log.filter((e) => e.result === 'denied').length;

  return (
    <div className={styles.container} dir="rtl">
      <div className={styles.headerRow}>
        <div className={styles.headerContent}>
          <span className={styles.badgeQ}>M25 · Q-0961 · ⚓ Overview</span>
          <span className={styles.demoBadge}>[Demo / تجريبي] بيانات خصوصية محاكاة</span>
          <h1 className={styles.title}>الخصوصية والموافقات: نظرة عامة</h1>
          <p className={styles.subtitle}>
            تحكم كامل ببياناتك: الموافقات الممنوحة والمسحوبة، سجل الوصول، وتصدير نسختك الكاملة بصيغة JSON.
            السحب فوري ومحلي — لا انتظار للخادم.
          </p>
        </div>

        <div className={styles.actionRow}>
          <Button variant="proof" size="md" onClick={() => navigate('/privacy/grant')} leftIcon={<PlusCircle size={16} />}>
            منح إذن جديد
          </Button>
          <Button variant="outline" size="md" onClick={() => setShowExplain(!showExplain)} leftIcon={<Sparkles size={16} />}>
            {showExplain ? 'إخفاء التفسير' : 'اشرح لي: حقوقي'}
          </Button>
        </div>
      </div>

      {showExplain && (
        <div className={styles.explainDrawer}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
            <Sparkles size={18} color="var(--proof)" />
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: 'var(--ink)' }}>
              تفسير: حقوقك في قُدرة
            </h3>
          </div>
          <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--ink-2)' }}>
            <strong>1. السحب الفوري:</strong> زر الإيقاف يطبق محلياً لحظياً ثم يزامن مع الخادم عند توفره.
            <strong> 2. التصدير الكامل:</strong> زر واحد ينزّل كل بصمتك بصيغة JSON قابلة للقراءة.
            <strong> 3. سجل الوصول:</strong> كل قراءة لبياناتك موثقة: من، ماذا، متى، والنتيجة (مسموح/مرفوض).
            <strong> 4. لا تدريب افتراضي:</strong> بياناتك لا تُستخدم لتدريب نماذج عامة إلا بموافقة صريحة منفصلة.
          </p>
        </div>
      )}

      <div className={styles.grid3}>
        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>موافقات ممنوحة</span>
          <span className={styles.metricValue} style={{ color: '#10B981' }}><span className="num">{granted}</span></span>
          <span className={styles.metricHint}>من أصل {consents.length} نطاقات</span>
        </div>
        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>موافقات مسحوبة</span>
          <span className={styles.metricValue} style={{ color: '#94A3B8' }}><span className="num">{revoked}</span></span>
          <span className={styles.metricHint}>محمية من الوصول</span>
        </div>
        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>محاولات مرفوضة</span>
          <span className={styles.metricValue} style={{ color: '#EF4444' }}><span className="num">{deniedAccess}</span></span>
          <span className={styles.metricHint}>في سجل الوصول</span>
        </div>
      </div>

      <div className={styles.card}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--ink)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck size={20} style={{ color: 'var(--proof)' }} />
          الموافقات الحالية
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {consents.map((c) => (
            <div key={c.id} className={styles.consentRow}>
              <div className={styles.consentInfo}>
                <h4 className={styles.consentName}>{c.name}</h4>
                <p className={styles.consentDesc}>{c.description}</p>
                <span className={styles.consentMeta}>النطاق: {c.scope} · تحديث: {new Date(c.updatedAt).toLocaleDateString('ar-EG')}</span>
              </div>
              <div className={styles.consentActions}>
                <span className={c.granted ? styles.statusGranted : styles.statusRevoked}>
                  {c.granted ? <><CheckCircle size={12} /> ممنوحة</> : <><XCircle size={12} /> مسحوبة</>}
                </span>
                <button
                  className={`${styles.toggle} ${c.granted ? styles.on : ''}`}
                  onClick={() => handleToggle(c.id, c.granted)}
                  disabled={toggling === c.id}
                  role="switch"
                  aria-checked={c.granted}
                  aria-label={`${c.granted ? 'سحب' : 'منح'} موافقة ${c.name}`}
                  title={c.granted ? 'سحب فوري' : 'منح'}
                >
                  <span className={styles.toggleKnob} />
                </button>
                <Button variant="ghost" size="sm" onClick={() => navigate(`/privacy/details/${c.id}`)}>
                  التفاصيل
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.card}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--ink)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <History size={20} style={{ color: 'var(--proof)' }} />
          أحدث سجل الوصول
        </h2>
        <div style={{ overflowX: 'auto' }}>
          <table className={styles.logTable}>
            <thead>
              <tr><th>الفاعل</th><th>الإجراء</th><th>المورد</th><th>الوقت</th><th>النتيجة</th></tr>
            </thead>
            <tbody>
              {log.slice(0, 5).map((e) => (
                <tr key={e.id}>
                  <td>{e.actor}</td>
                  <td>{e.action}</td>
                  <td className={styles.monoCell}>{e.resource}</td>
                  <td className={styles.monoCell}>{new Date(e.at).toLocaleDateString('ar-EG')}</td>
                  <td>
                    <span className={e.result === 'allowed' ? styles.statusGranted : styles.statusRevoked}>
                      {e.result === 'allowed' ? 'مسموح' : 'مرفوض'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: '0.75rem' }}>
          <Button variant="ghost" size="sm" onClick={() => navigate('/privacy/results')}>
            عرض السجل الكامل
          </Button>
        </div>
      </div>

      <div className={styles.actionBar}>
        <Button variant="proof" size="lg" onClick={handleExport} disabled={exporting} leftIcon={exporting ? <Loader2 size={16} className={styles.spin} /> : <Download size={16} />}>
          {exporting ? 'جاري تجهيز التصدير...' : 'تصدير بياناتي الكاملة (JSON)'}
        </Button>
        <Button variant="outline" size="lg" onClick={handleRevokeAll} disabled={revokingAll || granted === 0} leftIcon={<Ban size={16} />}>
          {revokingAll ? 'جاري السحب...' : 'سحب جميع الموافقات فوراً'}
        </Button>
      </div>
    </div>
  );
};

export default M25OverviewPage;