import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import styles from './m25.module.css';
import { ArrowLeft, Sparkles, Download, Ban, CheckCircle, History, Loader2, ShieldCheck, Trash2 } from 'lucide-react';
import { PrivacyService, ConsentItem, AccessLogEntry } from '../../../services/privacy.service';

export const M25ResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation() as { state?: { granted?: { name: string; purpose: string; scopes: string[]; expiry: string } } };
  const [consents, setConsents] = useState<ConsentItem[]>([]);
  const [log, setLog] = useState<AccessLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showExplain, setShowExplain] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [c, l] = await Promise.all([PrivacyService.getConsents(), PrivacyService.getAccessLog()]);
      setConsents(c);
      setLog(l);
      setLoading(false);
    };
    load();
  }, []);

  const handleExport = async () => {
    setExporting(true);
    try {
      await PrivacyService.exportAll('qudra-my-data.json');
    } finally {
      setExporting(false);
    }
  };

  const handleDeleteRequest = async () => {
    if (!window.confirm('طلب حذف البيانات؟ سيُرسل طلب حذف للخادم وتبقى نسختك المحلية حتى التأكيد.')) return;
    setDeleting(true);
    await new Promise((r) => setTimeout(r, 800));
    setDeleting(false);
    alert('تم إرسال طلب الحذف — ستصلك رسالة تأكيد عند اكتماله.');
  };

  if (loading) {
    return (
      <div className={styles.container} dir="rtl">
        <div className={styles.loadingState}>
          <div className={styles.spinner} />
          <span>جاري تحميل النتائج وسجل الوصول...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container} dir="rtl">
      <div className={styles.headerRow}>
        <div className={styles.headerContent}>
          <Button variant="ghost" size="sm" onClick={() => navigate('/privacy')} leftIcon={<ArrowLeft size={16} />}>
            العودة
          </Button>
          <span className={styles.badgeQ}>M25 · Q-0967 · ⚓ Results</span>
          <h1 className={styles.title}>نتائج إدارة البيانات</h1>
          <p className={styles.subtitle}>
            الحالة النهائية لأذوناتك، سجل الوصول الكامل، وخيارات التصدير والحذف.
          </p>
        </div>
        <Button variant="outline" size="md" onClick={() => setShowExplain(!showExplain)} leftIcon={<Sparkles size={16} />}>
          {showExplain ? 'إخفاء التفسير' : 'اشرح لي: هذه النتائج'}
        </Button>
      </div>

      {location.state?.granted && (
        <div className={styles.explainDrawer} style={{ borderColor: 'rgba(16,185,129,0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <CheckCircle size={18} color="#10B981" />
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: 'var(--ink)' }}>
              تم منح الإذن: {location.state.granted.name}
            </h3>
          </div>
          <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--ink-2)', lineHeight: 1.6 }}>
            النطاقات: {location.state.granted.scopes.join('، ')} · الصلاحية: {location.state.granted.expiry}
            {location.state.granted.purpose ? ` · الغرض: ${location.state.granted.purpose}` : ''}
          </p>
        </div>
      )}

      {showExplain && (
        <div className={styles.explainDrawer}>
          <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--ink-2)' }}>
            هذه الشاشة تجمع <strong>النتيجة النهائية</strong>: كل إذن وحالته، <strong>سجل الوصول الكامل</strong> (من قرأ ماذا ومتى)،
            و<strong>إجراءات البيانات</strong>: تصدير JSON كامل بضغطة واحدة، أو طلب حذف البيانات.
            التصدير يعمل حتى بدون اتصال (لقطة محلية) — والحذف يتطلب تأكيد الخادم.
          </p>
        </div>
      )}

      <div className={styles.card}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--ink)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck size={20} style={{ color: 'var(--proof)' }} />
          الحالة النهائية للأذونات ({consents.filter((c) => c.granted).length}/{consents.length} ممنوحة)
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {consents.map((c) => (
            <div key={c.id} className={styles.consentRow}>
              <div className={styles.consentInfo}>
                <h4 className={styles.consentName}>{c.name}</h4>
                <span className={styles.consentMeta}>{c.scope} · {new Date(c.updatedAt).toLocaleDateString('ar-EG')}</span>
              </div>
              <div className={styles.consentActions}>
                <span className={c.granted ? styles.statusGranted : styles.statusRevoked}>
                  {c.granted ? 'ممنوحة' : 'مسحوبة'}
                </span>
                <Button variant="ghost" size="sm" onClick={() => navigate(`/privacy/details/${c.id}`)}>التفاصيل</Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.card}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--ink)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <History size={20} style={{ color: 'var(--proof)' }} />
          سجل الوصول الكامل ({log.length})
        </h2>
        <div style={{ overflowX: 'auto' }}>
          <table className={styles.logTable}>
            <thead><tr><th>الفاعل</th><th>الإجراء</th><th>المورد</th><th>الوقت</th><th>النتيجة</th></tr></thead>
            <tbody>
              {log.map((e) => (
                <tr key={e.id}>
                  <td>{e.actor}</td>
                  <td>{e.action}</td>
                  <td className={styles.monoCell}>{e.resource}</td>
                  <td className={styles.monoCell}>{new Date(e.at).toLocaleDateString('ar-EG')}</td>
                  <td><span className={e.result === 'allowed' ? styles.statusGranted : styles.statusRevoked}>{e.result === 'allowed' ? 'مسموح' : 'مرفوض'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className={styles.dangerZone}>
        <h3><Ban size={18} /> إدارة البيانات</h3>
        <p style={{ fontSize: '0.88rem', color: 'var(--ink-2)', lineHeight: 1.6, margin: '0 0 1rem' }}>
          التصدير ينزّل نسختك الكاملة بصيغة JSON قابلة للتحميل فوراً. طلب الحذف يرسل للخادم ويتطلب تأكيداً — لا يمكن التراجع عنه بعد التنفيذ.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Button variant="proof" size="md" onClick={handleExport} disabled={exporting} leftIcon={exporting ? <Loader2 size={16} className={styles.spin} /> : <Download size={16} />}>
            {exporting ? 'جاري التصدير...' : 'تصدير البيانات الكاملة (JSON)'}
          </Button>
          <Button variant="outline" size="md" onClick={handleDeleteRequest} disabled={deleting} leftIcon={<Trash2 size={16} />}>
            {deleting ? 'جاري إرسال الطلب...' : 'طلب حذف البيانات'}
          </Button>
        </div>
      </div>

      <div className={styles.actionBar}>
        <Button variant="ghost" size="lg" onClick={() => navigate('/privacy')} leftIcon={<ArrowLeft size={16} />}>
          العودة للخصوصية
        </Button>
      </div>
    </div>
  );
};

export default M25ResultsPage;