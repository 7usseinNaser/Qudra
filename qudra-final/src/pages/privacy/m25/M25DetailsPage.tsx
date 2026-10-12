import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import styles from './m25.module.css';
import { ArrowLeft, ShieldCheck, Sparkles, Ban, CheckCircle, History } from 'lucide-react';
import { PrivacyService, ConsentItem, AccessLogEntry } from '../../../services/privacy.service';

export const M25DetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [consent, setConsent] = useState<ConsentItem | null>(null);
  const [log, setLog] = useState<AccessLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showExplain, setShowExplain] = useState(false);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [consents, entries] = await Promise.all([
        PrivacyService.getConsents(),
        PrivacyService.getAccessLog(),
      ]);
      setConsent(consents.find((c) => c.id === id) || null);
      setLog(entries);
      setLoading(false);
    };
    load();
  }, [id]);

  const handleToggle = async () => {
    if (!consent) return;
    setToggling(true);
    const updated = await PrivacyService.setConsent(consent.id, !consent.granted);
    setConsent(updated.find((c) => c.id === consent.id) || null);
    setToggling(false);
  };

  if (loading) {
    return (
      <div className={styles.container} dir="rtl">
        <div className={styles.loadingState}>
          <div className={styles.spinner} />
          <span>جاري تحميل تفاصيل الإذن...</span>
        </div>
      </div>
    );
  }

  if (!consent) {
    return (
      <div className={styles.container} dir="rtl">
        <div className={styles.errorState}>
          <ShieldCheck className={styles.errorIcon} size={48} />
          <h2 className={styles.errorTitle}>الإذن غير موجود</h2>
          <p className={styles.errorDesc}>تعذر العثور على الإذن المطلوب ({id}).</p>
          <Button variant="proof" onClick={() => navigate('/privacy')}>← العودة للخصوصية</Button>
        </div>
      </div>
    );
  }

  const related = log.filter((e) => e.resource.includes(consent.scope) || e.resource.includes(consent.id));

  return (
    <div className={styles.container} dir="rtl">
      <div className={styles.headerRow}>
        <div className={styles.headerContent}>
          <Button variant="ghost" size="sm" onClick={() => navigate('/privacy')} leftIcon={<ArrowLeft size={16} />}>
            العودة
          </Button>
          <span className={styles.badgeQ}>M25 · Q-0963 · ⚓ Details</span>
          <h1 className={styles.title}>{consent.name}</h1>
          <p className={styles.subtitle}>{consent.description}</p>
        </div>
        <Button variant="outline" size="md" onClick={() => setShowExplain(!showExplain)} leftIcon={<Sparkles size={16} />}>
          {showExplain ? 'إخفاء التفسير' : 'اشرح لي: هذا الإذن'}
        </Button>
      </div>

      {showExplain && (
        <div className={styles.explainDrawer}>
          <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--ink-2)' }}>
            هذا الإذن يغطي النطاق <b style={{ fontFamily: 'var(--font-mono)', direction: 'ltr' }}>{consent.scope}</b>.
            الحالة الحالية: <b>{consent.granted ? 'ممنوحة' : 'مسحوبة'}</b> (آخر تحديث {new Date(consent.updatedAt).toLocaleDateString('ar-EG')}).
            السحب يطبق محلياً فوراً ويمنع أي وصول جديد لهذا النطاق — والوصولات السابقة تبقى موثقة في السجل أدناه للشفافية.
          </p>
        </div>
      )}

      <div className={styles.grid3}>
        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>الحالة</span>
          <span className={styles.metricValue} style={{ fontSize: '1.3rem' }}>
            <span className={consent.granted ? styles.statusGranted : styles.statusRevoked}>
              {consent.granted ? 'ممنوحة' : 'مسحوبة'}
            </span>
          </span>
          <span className={styles.metricHint}>الحالة الحالية</span>
        </div>
        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>النطاق</span>
          <span className={styles.metricValue} style={{ fontSize: '1.1rem', fontFamily: 'var(--font-mono)', direction: 'ltr' }}>{consent.scope}</span>
          <span className={styles.metricHint}>نطاق الوصول التقني</span>
        </div>
        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>وصولات مرتبطة</span>
          <span className={styles.metricValue}><span className="num">{related.length}</span></span>
          <span className={styles.metricHint}>في سجل الوصول</span>
        </div>
      </div>

      <div className={styles.card}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--ink)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <History size={20} style={{ color: 'var(--proof)' }} />
          الوصولات المرتبطة بهذا الإذن
        </h2>
        {related.length ? (
          <div style={{ overflowX: 'auto' }}>
            <table className={styles.logTable}>
              <thead><tr><th>الفاعل</th><th>الإجراء</th><th>المورد</th><th>الوقت</th><th>النتيجة</th></tr></thead>
              <tbody>
                {related.map((e) => (
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
        ) : (
          <p style={{ color: 'var(--ink-2)', fontSize: '0.9rem' }}>لا وصولات مرتبطة بهذا النطاق بعد.</p>
        )}
      </div>

      <div className={styles.actionBar}>
        {consent.granted ? (
          <Button variant="outline" size="lg" onClick={handleToggle} disabled={toggling} leftIcon={<Ban size={16} />}>
            {toggling ? 'جاري السحب...' : 'سحب هذه الموافقة فوراً'}
          </Button>
        ) : (
          <Button variant="proof" size="lg" onClick={handleToggle} disabled={toggling} leftIcon={<CheckCircle size={16} />}>
            {toggling ? 'جاري المنح...' : 'منح هذه الموافقة'}
          </Button>
        )}
        <Button variant="ghost" size="lg" onClick={() => navigate('/privacy')} leftIcon={<ArrowLeft size={16} />}>
          العودة للقائمة
        </Button>
      </div>
    </div>
  );
};

export default M25DetailsPage;