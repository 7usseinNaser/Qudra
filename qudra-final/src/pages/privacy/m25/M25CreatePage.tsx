import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import styles from './m25.module.css';
import { ArrowLeft, Sparkles, ShieldCheck, Loader2, AlertCircle } from 'lucide-react';
import { PrivacyService } from '../../../services/privacy.service';

const SCOPES = [
  { id: 'matching', name: 'الظهور في المطابقة', desc: 'عرض ملفك العام في نتائج مطابقة أصحاب المشكلات.' },
  { id: 'product-analytics', name: 'تحليلات المنتج', desc: 'إحصاءات استخدام مجهولة لتحسين المنصة.' },
  { id: 'ai-training', name: 'تدريب النماذج', desc: 'استخدام بياناتك لتدريب نماذج — يتطلب موافقة صريحة منفصلة.' },
  { id: 'marketing', name: 'رسائل تسويقية', desc: 'إشعارات عن الميزات والعروض الجديدة.' },
  { id: 'sharing', name: 'مشاركة أطراف ثالثة', desc: 'مشاركة بيانات مع جهات خارجية — حساسية عالية.' },
];

export const M25CreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [purpose, setPurpose] = useState('');
  const [selectedScopes, setSelectedScopes] = useState<string[]>(['matching']);
  const [expiry, setExpiry] = useState('12m');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showExplain, setShowExplain] = useState(false);

  const toggleScope = (id: string) =>
    setSelectedScopes((p) => (p.includes(id) ? p.filter((s) => s !== id) : [...p, id]));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || selectedScopes.length === 0) {
      setError('مطلوب: اسم الإذن + نطاق واحد على الأقل.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      for (const scopeId of selectedScopes) {
        const existing = (await PrivacyService.getConsents()).find((c) => c.scope === scopeId);
        if (existing) {
          await PrivacyService.setConsent(existing.id, true);
        }
      }
      navigate('/privacy/results', { state: { granted: { name: name.trim(), purpose: purpose.trim(), scopes: selectedScopes, expiry } } });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذر حفظ الإذن.');
    }
    setSaving(false);
  };

  return (
    <div className={styles.container} dir="rtl">
      <div className={styles.headerRow}>
        <div className={styles.headerContent}>
          <Button variant="ghost" size="sm" onClick={() => navigate('/privacy')} leftIcon={<ArrowLeft size={16} />}>
            العودة
          </Button>
          <span className={styles.badgeQ}>M25 · Q-0964 · ⚓ Create/Grant</span>
          <h1 className={styles.title}>منح إذن جديد</h1>
          <p className={styles.subtitle}>
            حدد اسم الإذن، الغرض، النطاقات، ومدة الصلاحية. كل إذن قابل للسحب الفوري لاحقاً من أي شاشة.
          </p>
        </div>
        <Button variant="outline" size="md" onClick={() => setShowExplain(!showExplain)} leftIcon={<Sparkles size={16} />}>
          {showExplain ? 'إخفاء التفسير' : 'اشرح لي: الأذونات'}
        </Button>
      </div>

      {showExplain && (
        <div className={styles.explainDrawer}>
          <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--ink-2)' }}>
            الإذن = <strong>نطاق + غرض + مدة</strong>. النطاقات الحساسة (تدريب النماذج، مشاركة أطراف ثالثة) مرفوضة افتراضياً وتتطلب تفعيلاً صريحاً.
            مدة الصلاحية تحد من window الوصول — وبعد انتهائها يُعامل الإذن كمسحوب تلقائياً.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.formCard}>
        <div className={styles.formGroup}>
          <label htmlFor="pname" className={styles.label}>اسم الإذن *</label>
          <input
            id="pname"
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="مثال: إذن ظهور في مطابقة مشروع التعليم"
            maxLength={100}
            disabled={saving}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="ppurpose" className={styles.label}>الغرض من الإذن</label>
          <textarea
            id="ppurpose"
            className={styles.textarea}
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            placeholder="لماذا تمنح هذا الإذن؟ مثال: للظهور في نتائج مطابقة مشاريع التعليم فقط."
            rows={3}
            maxLength={500}
            disabled={saving}
          />
        </div>

        <div className={styles.formGroup}>
          <span className={styles.label}>النطاقات * (اختر واحداً على الأقل)</span>
          <div className={styles.checkList}>
            {SCOPES.map((s) => (
              <label key={s.id} className={styles.checkItem}>
                <input type="checkbox" checked={selectedScopes.includes(s.id)} onChange={() => toggleScope(s.id)} disabled={saving} />
                <span>{s.name}<small>{s.desc}</small></span>
              </label>
            ))}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="pexpiry" className={styles.label}>مدة الصلاحية</label>
          <select id="pexpiry" className={styles.select} value={expiry} onChange={(e) => setExpiry(e.target.value)} disabled={saving}>
            <option value="1m">شهر واحد</option>
            <option value="3m">3 أشهر</option>
            <option value="6m">6 أشهر</option>
            <option value="12m">12 شهراً</option>
            <option value="indefinite">غير محددة (قابلة للسحب في أي وقت)</option>
          </select>
          <p className={styles.hint}>بعد انتهاء المدة يُعامل الإذن كمسحوب تلقائياً.</p>
        </div>

        {error && (
          <p style={{ color: '#EF4444', fontSize: '0.88rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <AlertCircle size={14} /> {error}
          </p>
        )}

        <div className={styles.submitRow}>
          <Button type="submit" variant="proof" size="lg" disabled={saving} leftIcon={saving ? <Loader2 size={16} className={styles.spin} /> : <ShieldCheck size={16} />}>
            {saving ? 'جاري حفظ الإذن...' : 'منح الإذن'}
          </Button>
          <Button type="button" variant="ghost" size="lg" onClick={() => navigate('/privacy')}>
            إلغاء
          </Button>
        </div>
      </form>
    </div>
  );
};

export default M25CreatePage;