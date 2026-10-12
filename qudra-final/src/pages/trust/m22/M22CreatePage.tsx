import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import styles from './m22.module.css';
import { ArrowRight, ShieldCheck, AlertCircle, CheckCircle, Award, UserCheck, GitFork, Plus, Minus, AlertTriangle, Clock, MessageSquare } from 'lucide-react';

type VerificationMethod = 'official' | 'organization_link' | 'expert_review' | 'oral_assessment' | 'peer_confirmation';

const VERIFICATION_METHODS: { value: VerificationMethod; label: string; description: string; icon: React.ReactNode }[] = [
  {
    value: 'official',
    label: 'مصدر رسمي (شهادة معتمدة / OAuth رسمي)',
    description: 'شهادة معتمدة من جهة مانحة معترف بها، أو ربط OAuth رسمي عبر الباك إند. أعلى مستوى ثقة.',
    icon: <Award size={20} />
  },
  {
    value: 'organization_link',
    label: 'رابط جهة / مشروع موثق (GitHub، شركة، مؤسسة)',
    description: 'رابط لمشروع في منظمة موثوقة، مستودع شركة، أو ملف تعريف جهة عمل مع رابط قابل للتحقق.',
    icon: <GitFork size={20} />
  },
  {
    value: 'expert_review',
    label: 'مراجع خبير (مراجعة كود / مقابلة تقنية)',
    description: 'مراجعة من خبير معتمد في المجال: مراجعة كود، مراجعة معمارية، أو مقابلة تقنية منظمة.',
    icon: <UserCheck size={20} />
  },
  {
    value: 'oral_assessment',
    label: 'مقابلة شفهية تقنية',
    description: 'تقييم شفهي مباشر مع خبير: أسئلة متابعة، مناقشة قرارات تقنية، مقارنة مع الأدلة.',
    icon: <MessageSquare size={20} />
  },
  {
    value: 'peer_confirmation',
    label: 'تأكيد زميل / عميل (Peer / Client Confirmation)',
    description: 'تأكيد من زميل عمل سابق، مدير مباشر، أو عميل عمل معه على المهارة المعلنة.',
    icon: <CheckCircle size={20} />
  }
];

type SubjectType = 'skill' | 'project' | 'certificate' | 'experience';

const SUBJECT_TYPES: { value: SubjectType; label: string }[] = [
  { value: 'skill', label: 'مهارة / قدرة (Capability)' },
  { value: 'project', label: 'مشروع (Project)' },
  { value: 'certificate', label: 'شهادة (Certificate)' },
  { value: 'experience', label: 'خبرة عملية (Work Experience)' }
];

export const M22CreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [subject, setSubject] = useState('');
  const [subjectType, setSubjectType] = useState<SubjectType>('skill');
  const [selectedMethod, setSelectedMethod] = useState<VerificationMethod>('expert_review');
  const [description, setDescription] = useState('');
  const [evidenceUrls, setEvidenceUrls] = useState<string[]>(['']);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submittedId, setSubmittedId] = useState('');

  const handleAddEvidenceUrl = () => {
    setEvidenceUrls([...evidenceUrls, '']);
  };

  const handleRemoveEvidenceUrl = (index: number) => {
    if (evidenceUrls.length > 1) {
      setEvidenceUrls(evidenceUrls.filter((_, i) => i !== index));
    }
  };

  const handleEvidenceUrlChange = (index: number, value: string) => {
    const newUrls = [...evidenceUrls];
    newUrls[index] = value;
    setEvidenceUrls(newUrls);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!subject.trim()) {
      setErrorMsg('يرجى إدخال موضوع طلب التحقق (المهارة، المشروع، أو الشهادة).');
      return;
    }
    if (!selectedMethod) {
      setErrorMsg('يرجى اختيار طريقة تحقق واحدة على الأقل.');
      return;
    }

    setLoading(true);
    await new Promise(res => setTimeout(res, 800));
    const newId = `vr_${Date.now().toString(36)}`;
    setSubmittedId(newId);
    setSubmitted(true);
    setLoading(false);
  };

  const selectedMethodInfo = VERIFICATION_METHODS.find(m => m.value === selectedMethod);

  return (
    <div className={styles.container} dir="rtl">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/trust/overview')}
          leftIcon={<ArrowRight size={15} />}
        >
          العودة للنظرة العامة
        </Button>
      </div>

      <div className={styles.headerRow}>
        <div className={styles.headerContent}>
          <span className={styles.badgeQ}>M22 · Q-0844 · ⚓ Create</span>
          <span className={styles.demoBadge}>[Demo / تجريبي] محاكاة إنشاء طلب تحقق</span>
          <h1 className={styles.title}>طلب تحقق جديد</h1>
          <p className={styles.subtitle}>
            اختر مهارة أو مشروع أو شهادة تريد رفع ثقتها، وحدد طريقة التحقق المناسبة.
            المسودة تُحفظ تلقائياً — التحقق فوري ولا يضيع الإدخال.
            <br /><br />
            <strong>طرق التحقق (أعلى إلى أدنى ثقة):</strong> مصدر رسمي → رابط جهة → مراجع خبير → مقابلة شفهية → تأكيد زميل/عميل.
          </p>
        </div>
      </div>

      {errorMsg && (
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#EF4444',
            borderRadius: '10px',
            padding: '0.85rem 1.15rem',
            fontSize: '0.88rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <AlertCircle size={18} />
          <span>{errorMsg}</span>
        </div>
      )}

      {submitted && (
        <div className={styles.card} style={{ marginBottom: '1.5rem', borderColor: 'rgba(16, 185, 129, 0.4)', background: 'rgba(16, 185, 129, 0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <CheckCircle size={28} style={{ color: '#10B981' }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>تم إنشاء طلب التحقق بنجاح!</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--ink-2)' }}>
                رقم الطلب: <strong className="mono">{submittedId}</strong> · الحالة: <span className={styles.verificationStatus + ' pending'}><Clock size={12} /> قيد المراجعة</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            <Button variant="proof" size="md" onClick={() => navigate('/trust/results')}>
              <CheckCircle size={16} /> عرض النتائج
            </Button>
            <Button variant="outline" size="md" onClick={() => navigate('/trust/overview')}>
              <ShieldCheck size={16} /> العودة للنظرة العامة
            </Button>
            <Button variant="ghost" size="md" onClick={() => { setSubmitted(false); setSubject(''); setDescription(''); setEvidenceUrls(['']); }}>
              <Plus size={16} /> طلب تحقق آخر
            </Button>
          </div>
        </div>
      )}

      <div className={styles.card}>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>نوع الموضوع (Subject Type)</label>
            <select
              className={styles.input}
              value={subjectType}
              onChange={e => setSubjectType(e.target.value as SubjectType)}
            >
              {SUBJECT_TYPES.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>موضوع التحقق (المهارة / المشروع / الشهادة)</label>
            <input
              className={styles.input}
              placeholder="مثال: React & TypeScript Architecture"
              value={subject}
              onChange={e => setSubject(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label>طريقة التحقق (Verification Method)</label>
            <div className={styles.checkboxGroup}>
              {VERIFICATION_METHODS.map(method => (
                <label key={method.value} className={styles.checkboxItem + (selectedMethod === method.value ? ' selected' : '')}>
                  <input
                    type="radio"
                    name="verificationMethod"
                    checked={selectedMethod === method.value}
                    onChange={() => setSelectedMethod(method.value)}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--proof)', marginTop: '0.15rem' }}
                  />
                  <div className={styles.checkboxContent}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(0, 184, 184, 0.1)', color: 'var(--proof)' }}>
                        {method.icon}
                      </span>
                      <span className={styles.checkboxTitle}>{method.label}</span>
                    </div>
                    <div className={styles.checkboxDesc}>{method.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {selectedMethodInfo && (
            <div style={{ background: 'rgba(0, 184, 184, 0.05)', border: '1px solid rgba(0, 184, 184, 0.2)', borderRadius: '10px', padding: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ fontWeight: 700, color: 'var(--proof)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <ShieldCheck size={16} /> طريقة التحقق المختارة: {selectedMethodInfo.label}
              </div>
              <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--ink-2)', lineHeight: 1.6 }}>
                مستوى الثقة المتوقع: <strong>{selectedMethodInfo.value === 'official' ? 'Official (عالي جداً)' : selectedMethodInfo.value === 'organization_link' ? 'User-supplied (عالي)' : selectedMethodInfo.value === 'expert_review' ? 'Expert-reviewed (متوسط-عالي)' : selectedMethodInfo.value === 'oral_assessment' ? 'Expert-reviewed (متوسط)' : 'Peer-confirmed (أساسي)'}</strong>
              </p>
            </div>
          )}

          <div className={styles.formGroup}>
            <label>وصف مختصر / سياق (اختياري)</label>
            <textarea
              className={styles.input}
              placeholder="أين اكتسبتها؟ ما سياقها؟ أي تفاصيل تدعم الطلب؟"
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className={styles.formGroup}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label>روابط الأدلة الداعمة (اختياري)</label>
              <Button type="button" variant="ghost" size="sm" onClick={handleAddEvidenceUrl} leftIcon={<Plus size={14} />}>
                إضافة رابط
              </Button>
            </div>
            {evidenceUrls.map((url, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input
                  className={styles.input}
                  type="url"
                  placeholder="https://github.com/... أو https://coursera.org/verify/..."
                  value={url}
                  onChange={e => handleEvidenceUrlChange(idx, e.target.value)}
                  style={{ flex: 1 }}
                />
                {evidenceUrls.length > 1 && (
                  <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveEvidenceUrl(idx)} style={{ padding: '0.5rem' }}>
                    <Minus size={14} />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <div className={styles.actionRow} style={{ justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <Button type="button" variant="ghost" size="md" onClick={() => navigate('/trust/overview')}>
              إلغاء
            </Button>
            <Button type="submit" variant="proof" size="md" loading={loading} rightIcon={<ArrowRight size={16} />}>
              {loading ? 'جاري الإرسال...' : 'إرسال طلب التحقق'}
            </Button>
          </div>
        </form>
      </div>

      <div className={styles.card} style={{ marginTop: '1.5rem' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--ink)', margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertTriangle size={20} style={{ color: '#F59E0B' }} />
          ملخص طرق التحقق الخمسة
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {VERIFICATION_METHODS.map((method, idx) => (
            <div key={method.value} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '8px' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(0, 184, 184, 0.1)', color: 'var(--proof)', fontWeight: 700, fontSize: '0.85rem' }}>
                {idx + 1}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: 'var(--ink)', fontSize: '0.88rem' }}>{method.label}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--ink-2)' }}>{method.description}</div>
              </div>
              <span className={styles.verificationMethod} style={{ fontSize: '0.7rem' }}>
                {method.value === 'official' && 'Official'}
                {method.value === 'organization_link' && 'User-supplied'}
                {method.value === 'expert_review' && 'Expert-reviewed'}
                {method.value === 'oral_assessment' && 'Expert-reviewed'}
                {method.value === 'peer_confirmation' && 'Peer-confirmed'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default M22CreatePage;