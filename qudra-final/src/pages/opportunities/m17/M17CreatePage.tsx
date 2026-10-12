import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import styles from './m17.module.css';
import { ROUTES } from '../../../constants/routes';
import { ArrowRight, Plus, X, Sparkles, ShieldCheck, Target, AlertTriangle, Calendar, Clock, GitFork, ArrowLeft, List, FileText } from 'lucide-react';

type OpportunityType = 
  | 'project' 
  | 'challenge' 
  | 'fulltime' 
  | 'consulting' 
  | 'job' 
  | 'freelance' 
  | 'internship' 
  | 'scholarship' 
  | 'grant' 
  | 'hackathon' 
  | 'company_challenge';

type OpportunityLocation = 'remote' | 'onsite' | 'hybrid';

const TYPE_LABEL: Record<OpportunityType, string> = {
  project: 'مشروع',
  challenge: 'تحدي',
  fulltime: 'دوام كامل',
  consulting: 'استشارة',
  job: 'وظيفة',
  freelance: 'عمل حر',
  internship: 'تدريب',
  scholarship: 'منحة',
  grant: 'منحة بحثية',
  hackathon: 'هاكاثون',
  company_challenge: 'تحدي شركة',
};

const LOCATION_LABEL: Record<OpportunityLocation, string> = {
  remote: 'عن بعد',
  onsite: 'حضوري',
  hybrid: 'هجين',
};

interface StructuredRequirement {
  skill: string;
  importance: 'critical' | 'preferred';
  level: string;
}

interface FormData {
  title: string;
  organization: string;
  type: OpportunityType;
  location: OpportunityLocation;
  field: string;
  city: string;
  experience: string;
  compensation: string;
  duration: string;
  description: string;
  requirements: string[];
  structuredRequirements: StructuredRequirement[];
  deadline: string;
  url: string;
  isVerifiedOrg: boolean;
}

const INITIAL_FORM: FormData = {
  title: '',
  organization: '',
  type: 'project',
  location: 'remote',
  field: '',
  city: '',
  experience: '2+ سنوات',
  compensation: '',
  duration: '',
  description: '',
  requirements: [''],
  structuredRequirements: [{ skill: '', importance: 'critical', level: 'متقدم' }],
  deadline: '',
  url: '',
  isVerifiedOrg: false,
};

export const M17CreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submittedId, setSubmittedId] = useState('');

  const handleChange = (field: keyof FormData, value: string | boolean) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleReqChange = (index: number, value: string) => {
    const newReqs = [...form.requirements];
    newReqs[index] = value;
    setForm(prev => ({ ...prev, requirements: newReqs }));
  };

  const handleStructReqChange = (index: number, field: keyof StructuredRequirement, value: string) => {
    const newReqs = [...form.structuredRequirements];
    newReqs[index] = { ...newReqs[index], [field]: value };
    setForm(prev => ({ ...prev, structuredRequirements: newReqs }));
  };

  const addReq = () => setForm(prev => ({ ...prev, requirements: [...prev.requirements, ''] }));
  const removeReq = (index: number) => {
    if (form.requirements.length > 1) {
      setForm(prev => ({ ...prev, requirements: prev.requirements.filter((_, i) => i !== index) }));
    }
  };

  const addStructReq = () => setForm(prev => ({ ...prev, structuredRequirements: [...prev.structuredRequirements, { skill: '', importance: 'preferred' as const, level: 'متوسط' }] }));
  const removeStructReq = (index: number) => {
    if (form.structuredRequirements.length > 1) {
      setForm(prev => ({ ...prev, structuredRequirements: prev.structuredRequirements.filter((_, i) => i !== index) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!form.title.trim()) { setErrorMsg('يرجى إدخال عنوان الفرصة'); return; }
    if (!form.organization.trim()) { setErrorMsg('يرجى إدخال اسم الجهة'); return; }
    if (!form.description.trim()) { setErrorMsg('يرجى إدخال وصف الفرصة'); return; }

    setLoading(true);
    await new Promise(res => setTimeout(res, 800));
    const newId = `opp_${Date.now().toString(36)}`;
    setSubmittedId(newId);
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <div className={styles.container} dir="rtl">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(ROUTES.M17_OVERVIEW)}
          leftIcon={<ArrowLeft size={15} />}
        >
          العودة للفرص
        </Button>
      </div>

      <div className={styles.headerRow}>
        <div className={styles.headerContent}>
          <span className={styles.badgeQ}>M17 · Q-0644 · ⚓ Create</span>
          <span className={styles.demoBadge}>[Demo / تجريبي] محاكاة إنشاء فرصة</span>
          <h1 className={styles.title}>نشر فرصة جديدة</h1>
          <p className={styles.subtitle}>
            املأ البيانات المنظمة — المحرك سيحسب المطابقة تلقائياً مع المرشحين بناءً على قدراتهم المثبتة.
            المتطلبات المنظمة (Structured Requirements) هي المفتاح: مهارة + أهمية (حرجة/مفضلة) + مستوى.
            المسودة تُحفظ تلقائياً — لا يضيع الإدخال.
          </p>
        </div>
      </div>

      {errorMsg && (
        <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#EF4444', borderRadius: '10px', padding: '0.85rem 1.15rem', fontSize: '0.88rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertTriangle size={18} />
          <span>{errorMsg}</span>
        </div>
      )}

      {submitted && (
        <div className={styles.card} style={{ marginBottom: '1.5rem', borderColor: 'rgba(16, 185, 129, 0.4)', background: 'rgba(16, 185, 129, 0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <ShieldCheck size={28} style={{ color: '#10B981' }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>تم إنشاء الفرصة بنجاح!</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--ink-2)' }}>
                رقم الفرصة: <strong className="mono">{submittedId}</strong> · الحالة: <span className="verification-status pending"><Clock size={12} /> نشطة</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            <Button variant="proof" size="md" onClick={() => navigate(ROUTES.M17_RESULTS)}>
              <ShieldCheck size={16} /> عرض النتائج
            </Button>
            <Button variant="outline" size="md" onClick={() => navigate(ROUTES.M17_OVERVIEW)}>
              <Target size={16} /> العودة للفرص
            </Button>
            <Button variant="ghost" size="md" onClick={() => { setSubmitted(false); setForm(INITIAL_FORM); }}>
              <Plus size={16} /> فرصة أخرى
            </Button>
          </div>
        </div>
      )}

      <div className={styles.card}>
        <form onSubmit={handleSubmit}>
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>
              <Target size={20} style={{ color: 'var(--proof)', marginInlineEnd: '0.5rem' }} />
              المعلومات الأساسية
            </h3>

            <div className={styles.formGroup}>
              <label>عنوان الفرصة *</label>
              <input
                className={styles.input}
                placeholder="مثال: تطوير بنية REST API لمعالجة الصوتيات"
                value={form.title}
                onChange={e => handleChange('title', e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label>اسم الجهة / الشركة *</label>
              <input
                className={styles.input}
                placeholder="مثال: مختبرات الابتكار الرقمي"
                value={form.organization}
                onChange={e => handleChange('organization', e.target.value)}
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>نوع الفرصة *</label>
                <select className={styles.input} value={form.type} onChange={e => handleChange('type', e.target.value as OpportunityType)}>
                  {Object.entries(TYPE_LABEL).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>الموقع *</label>
                <select className={styles.input} value={form.location} onChange={e => handleChange('location', e.target.value as OpportunityLocation)}>
                  {Object.entries(LOCATION_LABEL).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>المجال / التخصص</label>
                <input className={styles.input} placeholder="مثال: هندسة البرمجيات" value={form.field} onChange={e => handleChange('field', e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label>المدينة</label>
                <input className={styles.input} placeholder="مثال: الرياض، دبي، عن بعد" value={form.city} onChange={e => handleChange('city', e.target.value)} />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>سنوات الخبرة المطلوبة</label>
                <input className={styles.input} placeholder="مثال: 3+ سنوات" value={form.experience} onChange={e => handleChange('experience', e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label>التعويض / الميزانية</label>
                <input className={styles.input} placeholder="مثال: 12,000 ر.س / المشروع" value={form.compensation} onChange={e => handleChange('compensation', e.target.value)} />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>المدة المتوقعة</label>
                <input className={styles.input} placeholder="مثال: شهرين" value={form.duration} onChange={e => handleChange('duration', e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label>الموعد النهائي</label>
                <input className={styles.input} type="date" value={form.deadline} onChange={e => handleChange('deadline', e.target.value)} />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>رابط الفرصة الأصلي (اختياري)</label>
              <input className={styles.input} type="url" placeholder="https://company.com/careers/..." value={form.url} onChange={e => handleChange('url', e.target.value)} />
            </div>

            <div className={styles.formGroup}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input type="checkbox" checked={form.isVerifiedOrg} onChange={e => handleChange('isVerifiedOrg', e.target.checked)} style={{ width: '18px', height: '18px', accentColor: 'var(--proof)' }} />
                <span>جهة موثقة (Verified Organization)</span>
              </label>
            </div>
          </div>

          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>
              <FileText size={20} style={{ color: 'var(--proof)', marginInlineEnd: '0.5rem' }} />
              الوصف التفصيلي *
            </h3>
            <div className={styles.formGroup}>
              <textarea
                className={styles.textarea}
                placeholder="صف الفرصة بتفصيل: السياق، الأهداف، التقنيات، بيئة العمل، فريق العمل، مسار النمو..."
                value={form.description}
                onChange={e => handleChange('description', e.target.value)}
                rows={6}
              />
            </div>
          </div>

          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>
              <List size={20} style={{ color: 'var(--proof)', marginInlineEnd: '0.5rem' }} />
              المتطلبات العامة (نص حر)
            </h3>
            {form.requirements.map((req, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input
                  className={styles.input}
                  placeholder="مثال: خبرة عملية في بناء REST APIs باستخدام FastAPI"
                  value={req}
                  onChange={e => handleReqChange(idx, e.target.value)}
                  style={{ flex: 1 }}
                />
                {form.requirements.length > 1 && (
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeReq(idx)} style={{ padding: '0.5rem' }}>
                    <X size={14} />
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={addReq} leftIcon={<Plus size={14} />}>
              إضافة متطلب
            </Button>
          </div>

          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>
              <Sparkles size={20} style={{ color: 'var(--proof)', marginInlineEnd: '0.5rem' }} />
              المتطلبات المهارية المنظمة (Structured Requirements) *
              <span className={styles.hint}>المحرك يستخدم هذه لحساب المطابقة الدقيقة</span>
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div className={styles.structHeader}>
                <span style={{ flex: 2 }}>المهارة / القدرة</span>
                <span style={{ flex: 1 }}>الأهمية</span>
                <span style={{ flex: 1 }}>المستوى المطلوب</span>
                <span />
              </div>
              {form.structuredRequirements.map((req, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input
                    className={styles.input}
                    placeholder="مثال: FastAPI، PostgreSQL، React"
                    value={req.skill}
                    onChange={e => handleStructReqChange(idx, 'skill', e.target.value)}
                    style={{ flex: 2 }}
                  />
                  <select
                    className={styles.input}
                    value={req.importance}
                    onChange={e => handleStructReqChange(idx, 'importance', e.target.value as 'critical' | 'preferred')}
                    style={{ flex: 1 }}
                  >
                    <option value="critical">حرج (Critical)</option>
                    <option value="preferred">مفضل (Preferred)</option>
                  </select>
                  <input
                    className={styles.input}
                    placeholder="مثال: متقدم، متوسط، مبتدئ"
                    value={req.level}
                    onChange={e => handleStructReqChange(idx, 'level', e.target.value)}
                    style={{ flex: 1 }}
                  />
                  {form.structuredRequirements.length > 1 && (
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeStructReq(idx)} style={{ padding: '0.5rem' }}>
                      <X size={14} />
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addStructReq} leftIcon={<Plus size={14} />}>
                إضافة مهارة منظمة
              </Button>
            </div>
          </div>

          <div className={styles.actionRow} style={{ justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <Button type="button" variant="ghost" size="md" onClick={() => navigate(ROUTES.M17_OVERVIEW)}>
              <ArrowLeft size={16} /> إلغاء
            </Button>
            <Button type="submit" variant="proof" size="md" loading={loading} rightIcon={<ArrowRight size={16} />}>
              {loading ? 'جاري النشر...' : 'نشر الفرصة'}
            </Button>
          </div>
        </form>
      </div>

      <div className={styles.card} style={{ marginTop: '1.5rem' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--ink)', margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={20} style={{ color: '#F59E0B' }} />
          نصائح لفرصة فعّالة
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ padding: '0.75rem', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
              <ShieldCheck size={16} style={{ color: '#10B981' }} />
              <strong>كن محدداً في المتطلبات المنظمة:</strong> "FastAPI — حرج — متقدم" أفضل من "خبرة بايثون".
            </div>
          </div>
          <div style={{ padding: '0.75rem', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
              <Target size={16} style={{ color: '#F59E0B' }} />
              <strong>افصل الحرجة عن المفضلة:</strong> المتطلبات الحرجة تحدد الأهلية، المفضلة ترفع درجة المطابقة.
            </div>
          </div>
          <div style={{ padding: '0.75rem', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
              <GitFork size={16} style={{ color: 'var(--proof)' }} />
              <strong>أضف رابط المصدر:</strong> المرشحون يثقون بالفرص المرتبطة بصفحة رسمية للشركة.
            </div>
          </div>
          <div style={{ padding: '0.75rem', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
              <Calendar size={16} style={{ color: '#EF4444' }} />
              <strong>حدّد موعداً نهائياً واقعياً:</strong> الفرص بدون موعد تفقد الزخم. 2-4 أسابيع مثالية.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default M17CreatePage;