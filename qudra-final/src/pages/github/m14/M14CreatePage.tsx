import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { GitHubService } from '../../../services/github.service';
import type { GitHubRepo } from '../../../services/types';
import styles from './m14.module.css';
import { ArrowRight, Search, AlertCircle, Lock, Cpu, Star, GitFork, RefreshCw } from 'lucide-react';
import { GithubIcon } from '../../../components/ui/GithubIcon';

export const M14CreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [selections, setSelections] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState<number>(0);
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [tokenInput, setTokenInput] = useState(GitHubService.getToken() || '');

  useEffect(() => {
    const loadRepos = async () => {
      setLoading(true);
      try {
        let list = await GitHubService.getRepos();
        if (list.length === 0) {
          list = await GitHubService.fetchRealUserRepos('7usseinNaser');
        }
        setRepos(list);
        const initialSelections: Record<string, boolean> = {};
        list.forEach(r => { initialSelections[r.id] = true; });
        setSelections(initialSelections);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'فشل تحميل المستودعات';
        setErrorMsg(msg);
      } finally {
        setLoading(false);
      }
    };
    loadRepos();
  }, []);

  const handleToggleSelection = (repoId: string) => {
    setSelections(prev => ({ ...prev, [repoId]: !prev[repoId] }));
  };

  const handleSelectAll = () => {
    const allSelected = repos.every(r => selections[r.id]);
    const newSelections: Record<string, boolean> = {};
    repos.forEach(r => { newSelections[r.id] = !allSelected; });
    setSelections(newSelections);
  };

  const handleAnalyze = async () => {
    const selectedIds = repos.filter(r => selections[r.id]).map(r => r.id);
    if (selectedIds.length === 0) {
      setErrorMsg('يرجى اختيار مستودع واحد على الأقل للتحليل');
      return;
    }

    setErrorMsg(null);
    setAnalyzing(true);
    setAnalysisProgress(0);

    const steps = [
      { p: 20, msg: 'جلب شجرة الملفات وبنية الكود...' },
      { p: 45, msg: 'تحليل الدوال، الكلاسات، وأنماط المعمارية...' },
      { p: 70, msg: 'مطابقة الكود مع شجرة المهارات واستخراج القدرات...' },
      { p: 90, msg: 'توليد إشارات الجودة وبطاقات الأدلة الرقمية...' },
      { p: 100, msg: 'اكتمل التحليل بنجاح!' }
    ];

    for (const step of steps) {
      await new Promise(res => setTimeout(res, 600));
      setAnalysisProgress(step.p);
    }

    const updated = repos.map(r => {
      if (selections[r.id]) {
        return { ...r, isScanned: true };
      }
      return r;
    });
    setRepos(updated);

    setTimeout(() => {
      setAnalyzing(false);
      navigate('/code-intel/results');
    }, 500);
  };

  const handleSaveToken = async () => {
    GitHubService.setToken(tokenInput.trim());
    setShowTokenModal(false);

    try {
      const freshRepos = await GitHubService.fetchRealUserRepos('7usseinNaser', tokenInput.trim());
      setRepos(freshRepos);
      const initialSelections: Record<string, boolean> = {};
      freshRepos.forEach(r => { initialSelections[r.id] = true; });
      setSelections(initialSelections);
      setErrorMsg(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'فشل الاتصال بالمفتاح';
      setErrorMsg(msg);
    }
  };

  const selectedCount = repos.filter(r => selections[r.id]).length;

  if (loading) {
    return (
      <div className={styles.container} dir="rtl">
        <div className={styles.loadingState}>
          <div className={styles.spinner} />
          <span>جاري جلب مستودعات GitHub...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container} dir="rtl">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/code-intel/overview')}
          leftIcon={<ArrowRight size={15} />}
        >
          العودة للنظرة العامة
        </Button>

        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTokenModal(true)}
            leftIcon={<Lock size={14} style={{ color: '#F59E0B' }} />}
          >
            {GitHubService.getToken() ? 'مفتاح الوصول متصل 🔒' : 'ربط المستودعات الخاصة (Token) 🔑'}
          </Button>
        </div>
      </div>

      <div className={styles.headerRow}>
        <div className={styles.headerContent}>
          <span className={styles.badgeQ}>M14 · Q-0524 · ⚓ Create</span>
          <span className={styles.demoBadge}>[Demo / تجريبي] محاكاة اختيار وتحليل</span>
          <h1 className={styles.title}>اختيار مستودعات للتحليل</h1>
          <p className={styles.subtitle}>
            اختر المستودعات التي تريد تحليلها لاستخراج القدرات الهندسية وإشارات الجودة.
            المسودة تُحفظ تلقائياً — التحليل يستخرج: جودة الكود، الاختبارات، توقيت الـcommits، والأنماط المعمارية.
          </p>
        </div>

        <div className={styles.actionRow}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--ink-2)', fontSize: '0.9rem' }}>
            <Search size={16} style={{ color: 'var(--proof)' }} />
            تم اختيار <strong className="num">{selectedCount}</strong> من <strong className="num">{repos.length}</strong> مستودع
          </span>
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

      {analyzing && (
        <div className={styles.card} style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <RefreshCw size={24} className="spin" style={{ color: 'var(--proof)' }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--ink)' }}>جاري تحليل المستودعات المحددة...</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--ink-2)' }}>
                {steps[Math.min(Math.floor(analysisProgress / 20), steps.length - 1)]?.msg || 'جاري المعالجة...'}
              </div>
            </div>
          </div>
          <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${analysisProgress}%`,
                background: 'linear-gradient(90deg, var(--proof) 0%, #10B981 100%)',
                borderRadius: '4px',
                transition: 'width 0.5s ease'
              }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--ink-2)' }}>
            <span>{analysisProgress}%</span>
            <span>المرحلة {Math.min(Math.floor(analysisProgress / 20) + 1, 5)} من 5</span>
          </div>
        </div>
      )}

      {repos.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🔍</div>
          <h2 className={styles.emptyTitle}>لا توجد مستودعات متاحة</h2>
          <p className={styles.emptyDesc}>
            لم يتم العثور على مستودعات في حسابك. اربط GitHub بصلاحية قراءة لجلب مستودعاتك العامة والخاصة.
          </p>
          <Button variant="proof" size="md" onClick={() => setShowTokenModal(true)} leftIcon={<Lock size={16} />}>
            ربط حساب GitHub (Token)
          </Button>
        </div>
      ) : (
        <>
          <div className={styles.card} style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--ink)', margin: 0 }}>
                مستودعاتك على GitHub ({repos.length})
              </h2>
              <Button variant="ghost" size="sm" onClick={handleSelectAll}>
                {selectedCount === repos.length ? 'إلغاء تحديد الكل' : 'تحديد الكل'}
              </Button>
            </div>

            <div className={styles.checkboxGroup}>
              {repos.map(repo => (
                <label key={repo.id} className={styles.checkboxItem + (selections[repo.id] ? ' selected' : '')}>
                  <input
                    type="checkbox"
                    checked={selections[repo.id]}
                    onChange={() => handleToggleSelection(repo.id)}
                  />
                  <div className={styles.checkboxContent}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                      <span style={{ color: 'var(--proof)' }}><GithubIcon size={18} /></span>
                      <span className={styles.checkboxTitle}>{repo.fullName}</span>
                      <span className={styles.repoVisibility + ' ' + (repo.isPrivate ? 'private' : 'public')}>
                        {repo.isPrivate ? '🔒 خاص' : '🌐 عام'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.8rem', color: 'var(--ink-2)' }}>
                      <span><Cpu size={12} /> {repo.primaryLanguage}</span>
                      <span><Star size={12} style={{ color: '#F59E0B' }} /> <span className={styles.untrustedTag}>غير موثوق</span> {repo.starsCount}</span>
                      <span><GitFork size={12} /> {repo.forksCount}</span>
                      <span>تحديث: {new Date(repo.updatedAt).toLocaleDateString('ar-EG')}</span>
                    </div>
                    {repo.description && (
                      <p style={{ margin: '0.5rem 0 0', fontSize: '0.82rem', color: 'var(--ink-2)', lineHeight: 1.5 }}>
                        {repo.description}
                      </p>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--ink)', margin: '0 0 0.25rem' }}>
                  {selectedCount > 0 ? `جاهز لتحليل ${selectedCount} مستودع` : 'لم يتم اختيار أي مستودع'}
                </h2>
                <p style={{ margin: 0, color: 'var(--ink-2)', fontSize: '0.9rem' }}>
                  {selectedCount > 0
                    ? 'سيتم استخراج: إشارات جودة الكود، تغطية الاختبارات، أنماط المعمارية، وتاريخ الـcommits. النجوم لا تُحسب في الثقة.'
                    : 'اختر مستودعاً واحداً على الأقل لتفعيل التحليل'}
                </p>
              </div>
              <Button
                variant="proof"
                size="lg"
                onClick={handleAnalyze}
                disabled={selectedCount === 0 || analyzing}
                leftIcon={analyzing ? <RefreshCw size={16} className="spin" /> : <Search size={16} />}
              >
                {analyzing ? 'جاري التحليل...' : 'بدء التحليل واستخراج القدرات'}
              </Button>
            </div>
          </div>
        </>
      )}

      {showTokenModal && (
        <div className={styles.modalOverlay} onClick={() => setShowTokenModal(false)}>
          <div className={styles.modalBox} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                <Lock size={18} style={{ verticalAlign: 'middle', marginLeft: '0.4rem', color: '#F59E0B' }} />
                ربط المستودعات الخاصة (Private Repositories)
              </h3>
              <button
                onClick={() => setShowTokenModal(false)}
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
              >
                <AlertCircle size={18} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.25rem 0.65rem',
                borderRadius: '6px',
                background: 'rgba(245, 158, 11, 0.15)',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                color: '#FBBF24',
                fontSize: '0.78rem',
                fontWeight: 600,
                marginBottom: '0.85rem'
              }}>
                <span>مستوى الثقة: User-supplied (يقدّمه المستخدم)</span>
              </div>

              <p style={{ fontSize: '0.86rem', color: '#CBD5E1', lineHeight: 1.6, marginBottom: '0.75rem' }}>
                للوصول لمستودعاتك <strong>الخاصة (Private)</strong> بأعلى معايير الأمان، نطلب
                <strong>Fine-grained Personal Access Token</strong> بصلاحية <strong>قراءة فقط (Read-only)</strong>
                على المستودعات المحددة، دون منح أي صلاحية كتابة.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.84rem', fontWeight: 600, color: '#CBD5E1' }}>
                  رمز Fine-grained PAT (قراءة فقط)
                </label>
                <input
                  type="password"
                  value={tokenInput}
                  onChange={e => setTokenInput(e.target.value)}
                  placeholder="github_pat_xxxxxxxxxxxxxxxxxxxx"
                  dir="ltr"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '8px',
                    color: '#fff',
                    padding: '0.65rem 0.85rem',
                    fontFamily: 'monospace',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '10px', padding: '0.75rem', fontSize: '0.8rem', color: '#E2E8F0', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                🔒 <strong>معاملة أمنية في الذاكرة فقط (In-Memory Session Only):</strong><br />
                • الرمز <strong>لا يُحفظ</strong> في localStorage أو cookies أو ملفات.<br />
                • يُحفظ في ذاكرة الجلسة النشطة فقط ويُمحى فور إغلاق التبويب.<br />
                • لا يُسجل في سجلات الخادم ولا يطلب صلاحيات كاملة.
              </div>

              <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                * ملاحظة: مستوى الثقة الرسمي (Official) مخصص لربط OAuth عبر الباك إند وسيتم تفعيله لاحقاً.
              </div>
            </div>

            <div className={styles.modalFooter}>
              <Button variant="ghost" size="sm" onClick={() => setShowTokenModal(false)}>إلغاء</Button>
              <Button variant="proof" size="sm" onClick={handleSaveToken}>
                حفظ وجلب المستودعات الخاصة
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const steps = [
  { p: 20, msg: 'جلب شجرة الملفات وبنية الكود...' },
  { p: 45, msg: 'تحليل الدوال، الكلاسات، وأنماط المعمارية...' },
  { p: 70, msg: 'مطابقة الكود مع شجرة المهارات واستخراج القدرات...' },
  { p: 90, msg: 'توليد إشارات الجودة وبطاقات الأدلة الرقمية...' },
  { p: 100, msg: 'اكتمل التحليل بنجاح!' }
];

export default M14CreatePage;