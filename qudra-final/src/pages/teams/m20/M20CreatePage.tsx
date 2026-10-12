import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Bar } from '../../../components/ui/Bar';
import type { TeamRole } from '../../../services/types';
import { ROUTES } from '../../../constants/routes';
import styles from './m20.module.css';
import { ArrowRight, Plus, X, Sparkles, Target, AlertTriangle, Users, ArrowLeft, CheckCircle, UserPlus } from 'lucide-react';

const ROLE_LABEL: Record<TeamRole, string> = {
  lead: 'قائد تقني',
  backend: 'مطور Backend',
  frontend: 'مطور Frontend',
  fullstack: 'Full Stack',
  devops: 'DevOps',
  designer: 'مصمم UI/UX',
  pm: 'مدير منتج',
  qa: 'مهندس جودة',
  ai_ml: 'مهندس AI/ML',
  data: 'مهندس بيانات',
};

const ROLE_ICON: Record<TeamRole, string> = {
  lead: '👑',
  backend: '⚙️',
  frontend: '🎨',
  fullstack: '🔧',
  devops: '☁️',
  designer: '🎯',
  pm: '📋',
  qa: '🔍',
  ai_ml: '🤖',
  data: '📊',
};

interface Candidate {
  id: string;
  userId: string;
  name: string;
  username: string;
  role: TeamRole;
  capabilities: string[];
  verifiedCapabilities: string[];
  claimedCapabilities: string[];
  matchScore: number;
  status: 'invited' | 'active' | 'completed' | 'left';
}

const AVAILABLE_CANDIDATES: Candidate[] = [
  { id: 'cand_1', userId: 'usr_01', name: 'سارة المنصوري', username: 'sara_dev', role: 'lead', capabilities: ['FastAPI', 'PostgreSQL', 'Docker', 'React', 'Audio Processing'], verifiedCapabilities: ['FastAPI & Microservices', 'PostgreSQL & Database Design', 'React & TypeScript Architecture'], claimedCapabilities: ['Docker & Containerization', 'Audio Processing'], matchScore: 95, status: 'active' },
  { id: 'cand_2', userId: 'usr_02', name: 'أحمد التميمي', username: 'ahmed_t', role: 'backend', capabilities: ['Node.js', 'PostgreSQL', 'Docker', 'REST APIs'], verifiedCapabilities: ['PostgreSQL & Database Design'], claimedCapabilities: ['Node.js', 'Docker', 'REST APIs'], matchScore: 82, status: 'active' },
  { id: 'cand_3', userId: 'usr_04', name: 'نور الهدى', username: 'nour_h', role: 'frontend', capabilities: ['React', 'TypeScript', 'Tailwind CSS', 'Audio Visualization'], verifiedCapabilities: ['React & TypeScript Architecture'], claimedCapabilities: ['Tailwind CSS', 'Audio Visualization'], matchScore: 78, status: 'active' },
  { id: 'cand_4', userId: 'usr_05', name: 'خالد الحربي', username: 'khaled_h', role: 'devops', capabilities: ['Docker', 'Kubernetes', 'CI/CD', 'AWS'], verifiedCapabilities: ['Docker & Containerization'], claimedCapabilities: ['Kubernetes', 'CI/CD', 'AWS'], matchScore: 72, status: 'active' },
  { id: 'cand_5', userId: 'usr_06', name: 'ليلى السعيد', username: 'layla_s', role: 'frontend', capabilities: ['React', 'D3.js', 'TypeScript', 'Chart.js'], verifiedCapabilities: ['React & TypeScript Architecture'], claimedCapabilities: ['D3.js', 'Chart.js'], matchScore: 85, status: 'active' },
  { id: 'cand_6', userId: 'usr_07', name: 'عمر عبدالله', username: 'omar_a', role: 'backend', capabilities: ['FastAPI', 'PostgreSQL', 'WebSocket', 'Real-time'], verifiedCapabilities: ['FastAPI & Microservices'], claimedCapabilities: ['PostgreSQL', 'WebSocket', 'Real-time'], matchScore: 80, status: 'active' },
  { id: 'cand_7', userId: 'usr_08', name: 'فاطمة الزهراء', username: 'fatima_z', role: 'designer', capabilities: ['UI/UX', 'Figma', 'Design System', 'Accessibility'], verifiedCapabilities: ['UI/UX Design'], claimedCapabilities: ['Figma', 'Design System', 'Accessibility'], matchScore: 75, status: 'active' },
  { id: 'cand_8', userId: 'usr_09', name: 'يوسف النجار', username: 'yusuf_n', role: 'ai_ml', capabilities: ['NLP', 'RAG', 'Vector DBs', 'Python'], verifiedCapabilities: ['LLM Orchestration & RAG'], claimedCapabilities: ['NLP', 'Vector DBs', 'Python'], matchScore: 88, status: 'active' },
];

export const M20CreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [teamName, setTeamName] = useState('');
  const [teamDesc, setTeamDesc] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<Candidate[]>([]);
  const [requiredCaps, setRequiredCaps] = useState<string[]>(['FastAPI', 'PostgreSQL', 'React', 'Docker']);
  const [newCap, setNewCap] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submittedId, setSubmittedId] = useState('');

  const coveredCaps = useMemo(() => {
    const covered = new Set<string>();
    selectedMembers.forEach(m => {
      m.verifiedCapabilities.forEach(c => covered.add(c));
      m.capabilities.forEach(c => covered.add(c));
    });
    return covered;
  }, [selectedMembers]);

  const missingCaps = requiredCaps.filter(c => !coveredCaps.has(c));
  const coverage = requiredCaps.length > 0 ? Math.round(((requiredCaps.length - missingCaps.length) / requiredCaps.length) * 100) : 0;

  const harmony = useMemo(() => {
    if (selectedMembers.length === 0) return 0;
    const roles = new Set(selectedMembers.map(m => m.role));
    const roleDiversity = Math.min(roles.size / 4, 1) * 40;
    const avgMatch = selectedMembers.reduce((sum, m) => sum + m.matchScore, 0) / selectedMembers.length;
    const verifiedRatio = selectedMembers.reduce((sum, m) => sum + m.verifiedCapabilities.length, 0) /
      Math.max(selectedMembers.reduce((sum, m) => sum + m.verifiedCapabilities.length + m.claimedCapabilities.length, 0), 1);
    return Math.round(roleDiversity + (avgMatch * 0.4) + (verifiedRatio * 20));
  }, [selectedMembers]);

  const toggleMember = (cand: Candidate) => {
    setSelectedMembers(prev =>
      prev.find(m => m.id === cand.id)
        ? prev.filter(m => m.id !== cand.id)
        : [...prev, cand]
    );
  };

  const addCap = () => {
    if (newCap.trim() && !requiredCaps.includes(newCap.trim())) {
      setRequiredCaps(prev => [...prev, newCap.trim()]);
      setNewCap('');
    }
  };

  const removeCap = (cap: string) => {
    setRequiredCaps(prev => prev.filter(c => c !== cap));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!teamName.trim()) { setErrorMsg('يرجى إدخال اسم الفريق'); return; }
    if (selectedMembers.length === 0) { setErrorMsg('يرجى اختيار عضو واحد على الأقل'); return; }

    setLoading(true);
    await new Promise(res => setTimeout(res, 800));
    const newId = `team_${Date.now().toString(36)}`;
    setSubmittedId(newId);
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <div className={styles.container} dir="rtl">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.M20_OVERVIEW)} leftIcon={<ArrowLeft size={15} />}>
          العودة للفرق
        </Button>
      </div>

      <div className={styles.headerRow}>
        <div className={styles.headerContent}>
          <span className={styles.badgeQ}>M20 · Q-0764 · ⚓ Create</span>
          <span className={styles.demoBadge}>[Demo / تجريبي] محاكاة تشكيل فريق</span>
          <h1 className={styles.title}>تشكيل فريق جديد</h1>
          <p className={styles.subtitle}>
            اختر الأعضاء بناءً على قدراتهم المثبتة (Proven) — المحرك يحسب التغطية والتناغم تلقائياً.
            كل عضو يظهر بقدراته المثبتة والم ادعاة — لا تركيب بلا أدلة.
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
            <CheckCircle size={28} style={{ color: '#10B981' }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>تم تشكيل الفريق بنجاح!</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--ink-2)' }}>
                رقم الفريق: <strong className="mono">{submittedId}</strong> · تغطية: <strong>{coverage}%</strong> · تناغم: <strong>{harmony}%</strong>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            <Button variant="proof" size="md" onClick={() => navigate(ROUTES.M21_CREATE)}>
              <ArrowRight size={16} /> فتح مساحة العمل (M21)
            </Button>
            <Button variant="outline" size="md" onClick={() => navigate(ROUTES.M20_OVERVIEW)}>
              <Users size={16} /> العودة للفرق
            </Button>
            <Button variant="ghost" size="md" onClick={() => { setSubmitted(false); setTeamName(''); setTeamDesc(''); setSelectedMembers([]); }}>
              <Plus size={16} /> فريق آخر
            </Button>
          </div>
        </div>
      )}

      <div className={styles.grid2}>
        <div>
          <div className={styles.card}>
            <form onSubmit={handleSubmit}>
              <div className={styles.formSection}>
                <h3 className={styles.sectionTitle}>
                  <Users size={20} style={{ color: 'var(--proof)', marginInlineEnd: '0.5rem' }} />
                  معلومات الفريق
                </h3>
                <div className={styles.formGroup}>
                  <label>اسم الفريق *</label>
                  <input className={styles.input} placeholder="مثال: فريق صوت المستقبل" value={teamName} onChange={e => setTeamName(e.target.value)} />
                </div>
                <div className={styles.formGroup}>
                  <label>وصف الفريق</label>
                  <textarea className={styles.textarea} placeholder="هدف الفريق، المشروع، السياق..." value={teamDesc} onChange={e => setTeamDesc(e.target.value)} rows={3} />
                </div>
              </div>

              <div className={styles.formSection}>
                <h3 className={styles.sectionTitle}>
                  <Target size={20} style={{ color: '#F59E0B', marginInlineEnd: '0.5rem' }} />
                  القدرات المطلوبة
                </h3>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <input
                    className={styles.input}
                    placeholder="أضف قدرة مطلوبة..."
                    value={newCap}
                    onChange={e => setNewCap(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCap(); } }}
                    style={{ flex: 1 }}
                  />
                  <Button type="button" variant="outline" size="sm" onClick={addCap} leftIcon={<Plus size={14} />}>
                    إضافة
                  </Button>
                </div>
                <div className={styles.capTags}>
                  {requiredCaps.map(cap => {
                    const covered = coveredCaps.has(cap);
                    return (
                      <span key={cap} className={`${styles.capTag} ${covered ? styles.capCovered : styles.capMissing}`}>
                        {covered ? <CheckCircle size={12} /> : <AlertTriangle size={12} />}
                        {cap}
                        <button type="button" onClick={() => removeCap(cap)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0, display: 'flex' }}>
                          <X size={12} />
                        </button>
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className={styles.formSection}>
                <h3 className={styles.sectionTitle}>
                  <UserPlus size={20} style={{ color: 'var(--proof)', marginInlineEnd: '0.5rem' }} />
                  اختيار الأعضاء ({selectedMembers.length} محدد)
                </h3>
                <div className={styles.candidateList}>
                  {AVAILABLE_CANDIDATES.map(cand => {
                    const isSelected = selectedMembers.some(m => m.id === cand.id);
                    return (
                      <button
                        key={cand.id}
                        type="button"
                        className={`${styles.candidateCard} ${isSelected ? styles.selected : ''}`}
                        onClick={() => toggleMember(cand)}
                      >
                        <div className={styles.candidateHead}>
                          <div className={styles.candidateAvatar}>
                            <span>{cand.name.charAt(0)}</span>
                          </div>
                          <div className={styles.candidateInfo}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span className={styles.candidateName}>{cand.name}</span>
                              <span className={styles.roleBadge}>{ROLE_ICON[cand.role]} {ROLE_LABEL[cand.role]}</span>
                            </div>
                            <span className={styles.candidateUsername}>@{cand.username}</span>
                          </div>
                          <div className={styles.candidateScore}>
                            <span className={styles.scoreLabel}>مطابقة</span>
                            <span className={`${styles.scoreValue} ${cand.matchScore >= 80 ? styles.highScore : cand.matchScore >= 60 ? styles.midScore : styles.lowScore}`}>
                              {cand.matchScore}%
                            </span>
                          </div>
                        </div>
                        <div className={styles.candidateCaps}>
                          <div className={styles.capGroup}>
                            <span className={styles.capGroupLabel}>مثبتة</span>
                            <div className={styles.capTags}>
                              {cand.verifiedCapabilities.map(cap => (
                                <Badge key={cap} variant="proof" size="xs">{cap}</Badge>
                              ))}
                            </div>
                          </div>
                          <div className={styles.capGroup}>
                            <span className={styles.capGroupLabel}>م ادعاة</span>
                            <div className={styles.capTags}>
                              {cand.claimedCapabilities.map(cap => (
                                <Badge key={cap} variant="claimed" size="xs">{cap}</Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className={styles.actionRow} style={{ justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <Button type="button" variant="ghost" size="md" onClick={() => navigate(ROUTES.M20_OVERVIEW)}>
                  <ArrowLeft size={16} /> إلغاء
                </Button>
                <Button type="submit" variant="proof" size="md" loading={loading} rightIcon={<ArrowRight size={16} />}>
                  {loading ? 'جاري التشكيل...' : 'تشكيل الفريق'}
                </Button>
              </div>
            </form>
          </div>
        </div>

        <aside>
          <div className={styles.card} style={{ position: 'sticky', top: '1.5rem' }}>
            <h3 className={styles.sectionTitle}>
              <Sparkles size={20} style={{ color: '#F59E0B', marginInlineEnd: '0.5rem' }} />
              مؤشرات الفريق المباشرة
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 600 }}>تغطية القدرات</span>
                  <span className="num" style={{ color: coverage >= 80 ? '#10B981' : coverage >= 60 ? '#F59E0B' : '#EF4444' }}>{coverage}%</span>
                </div>
                <Bar value={coverage} max={100} label="" variant={coverage >= 80 ? 'proof' : 'gap'} size="sm" />
                <div style={{ fontSize: '0.75rem', color: 'var(--ink-2)', marginTop: '0.25rem' }}>
                  {requiredCaps.length - missingCaps.length} / {requiredCaps.length} مغطاة
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 600 }}>تناغم الفريق</span>
                  <span className="num" style={{ color: harmony >= 80 ? '#10B981' : harmony >= 60 ? '#F59E0B' : '#EF4444' }}>{harmony}%</span>
                </div>
                <Bar value={harmony} max={100} label="" variant={harmony >= 80 ? 'proof' : 'gap'} size="sm" />
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
                <div style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9rem' }}>الأعضاء المختارون ({selectedMembers.length})</div>
                {selectedMembers.length === 0 ? (
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--ink-2)' }}>لم تختر أعضاء بعد</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {selectedMembers.map(m => (
                      <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                        <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--proof)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>
                          {m.name.charAt(0)}
                        </span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{m.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--ink-2)' }}>{ROLE_ICON[m.role]} {ROLE_LABEL[m.role]}</div>
                        </div>
                        <span className="num" style={{ fontSize: '0.8rem', color: 'var(--proof)' }}>{m.matchScore}%</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {missingCaps.length > 0 && (
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
                  <div style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9rem', color: '#EF4444' }}>
                    فجوات ({missingCaps.length})
                  </div>
                  <div className={styles.capTags}>
                    {missingCaps.map(cap => (
                      <Badge key={cap} variant="gap" size="xs">{cap}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default M20CreatePage;