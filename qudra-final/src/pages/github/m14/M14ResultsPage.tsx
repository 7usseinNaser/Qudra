import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { GitHubService } from '../../../services/github.service';
import type { GitHubRepo } from '../../../services/types';
import { ProfileEditorService } from '../../../services/profile-editor.service';
import styles from './m14.module.css';
import { ArrowRight, CheckCircle, Sparkles, Search, ShieldCheck, FileCode2, AlertCircle, Star, GitFork, Cpu, ExternalLink, GitCommit } from 'lucide-react';
import { GithubIcon } from '../../../components/ui/GithubIcon';

interface AnalysisResult {
  repoId: string;
  repoName: string;
  repoFullName: string;
  primaryLanguage: string;
  qualityScore: number;
  capabilities: { name: string; category: string; confidence: number; matchedFiles: number }[];
  signals: { label: string; score: number; status: 'good' | 'medium' | 'poor' | 'untrusted'; desc: string }[];
  isPrivate: boolean;
  starsCount: number;
  forksCount: number;
}

export const M14ResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [evidenceImported, setEvidenceImported] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        let list = await GitHubService.getRepos();
        if (list.length === 0) {
          list = await GitHubService.fetchRealUserRepos('7usseinNaser');
        }
        setRepos(list);

        const scannedRepos = list.filter(r => r.isScanned);
        const mockResults: AnalysisResult[] = scannedRepos.map((repo) => ({
          repoId: repo.id,
          repoName: repo.name,
          repoFullName: repo.fullName,
          primaryLanguage: repo.primaryLanguage,
          qualityScore: 72 + Math.floor(Math.random() * 20),
          capabilities: repo.detectedCapabilities || [
            { name: 'React & TypeScript Architecture', category: 'Frontend', confidence: 95, matchedFiles: 36 },
            { name: 'Node.js & Express Backend', category: 'Backend', confidence: 88, matchedFiles: 24 },
            { name: 'PostgreSQL & Prisma ORM', category: 'Database', confidence: 85, matchedFiles: 12 },
          ],
          signals: [
            { label: 'تعقيد الكود', score: 82, status: 'good', desc: 'تعقيد دوائري منخفض، دوال صغيرة' },
            { label: 'تغطية الاختبارات', score: 76, status: 'good', desc: 'اختبارات وحدة وتكاملة موجودة' },
            { label: 'التوثيق', score: 58, status: 'medium', desc: 'JSDoc جزئي، README جيد' },
            { label: 'أنماط معمارية', score: 88, status: 'good', desc: 'Clean Architecture، Dependency Injection' },
            { label: 'تنوع الـCommits', score: 71, status: 'medium', desc: 'مساهمات منتظمة، أحجام متنوعة' },
            { label: 'نجوم المستودع', score: repo.starsCount, status: 'untrusted', desc: 'قابلة للشراء — غير موثوقة للثقة' }
          ],
          isPrivate: repo.isPrivate,
          starsCount: repo.starsCount,
          forksCount: repo.forksCount,
        }));
        setResults(mockResults);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleImportAll = () => {
    const scannedRepos = repos.filter(r => r.isScanned);
    if (scannedRepos.length > 0) {
      ProfileEditorService.importGitHubReposAsProjects(
        scannedRepos.map(r => ({
          name: r.name,
          fullName: r.fullName,
          description: r.description,
          primaryLanguage: r.primaryLanguage
        }))
      );
    }
    setEvidenceImported(true);
  };

  const handleImportSingle = (result: AnalysisResult) => {
    const repo = repos.find(r => r.id === result.repoId);
    if (repo) {
      ProfileEditorService.importGitHubReposAsProjects([{
        name: repo.name,
        fullName: repo.fullName,
        description: repo.description,
        primaryLanguage: repo.primaryLanguage
      }]);
    }
  };

  if (loading) {
    return (
      <div className={styles.container} dir="rtl">
        <div className={styles.loadingState}>
          <div className={styles.spinner} />
          <span>جاري تحميل نتائج التحليل...</span>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className={styles.container} dir="rtl">
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📊</div>
          <h2 className={styles.emptyTitle}>لا توجد نتائج تحليل</h2>
          <p className={styles.emptyDesc}>
            لم يتم تحليل أي مستودع بعد. اذهب لصفحة الاختيار واختر مستودعات للمسح.
          </p>
          <Button variant="proof" size="md" onClick={() => navigate('/code-intel/create')} leftIcon={<Search size={16} />}>
            اختيار مستودعات للتحليل
          </Button>
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
            onClick={() => navigate('/code-intel/create')}
            leftIcon={<Search size={14} />}
          >
            تحليل مستودعات أخرى
          </Button>
        </div>
      </div>

      <div className={styles.headerRow}>
        <div className={styles.headerContent}>
          <span className={styles.badgeQ}>M14 · Q-0527 · ⚓ Results</span>
          <span className={styles.demoBadge}>[Demo / تجريبي] نتائج تحليل محاكاة</span>
          <h1 className={styles.title}>نتائج تحليل المستودعات</h1>
          <p className={styles.subtitle}>
            تم تحليل <strong className="num">{results.length}</strong> مستودع واستخراج
            <strong className="num">{results.reduce((acc, r) => acc + r.capabilities.length, 0)}</strong> قدرة هندسية مع إشارات جودة مفصلة.
            كل نتيجة مرتبطة بدليل يمكن فتحه — التحقق: ملكية المستودع + تحليل توقيت الـCommits (لا نعتمد على النجوم).
          </p>
        </div>

        <div className={styles.actionRow}>
          <Button
            variant="proof"
            size="md"
            onClick={handleImportAll}
            disabled={evidenceImported}
            leftIcon={evidenceImported ? <CheckCircle size={16} /> : <Sparkles size={16} />}
          >
            {evidenceImported ? 'تم تثبيت جميع الأدلة ✓' : 'تثبيت جميع الأدلة في جواز القدرات'}
          </Button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {results.map((result) => (
          <div key={result.repoId} className={styles.resultCard}>
            <div className={styles.resultCardHeader}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                  <span style={{ color: 'var(--proof)' }}><GithubIcon size={20} /></span>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--ink)' }}>
                    {result.repoFullName}
                  </h3>
                  <span className={styles.repoVisibility + ' ' + (result.isPrivate ? 'private' : 'public')}>
                    {result.isPrivate ? '🔒 خاص' : '🌐 عام'}
                  </span>
                  <span className={styles.verificationStatus + ' verified'}>
                    <ShieldCheck size={12} /> مُتحقق (Proven)
                  </span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.82rem', color: 'var(--ink-2)' }}>
                  <span><Cpu size={12} /> {result.primaryLanguage}</span>
                  <span><Star size={12} style={{ color: '#F59E0B' }} /> <span className={styles.untrustedTag}>غير موثوق</span> {result.starsCount}</span>
                  <span><GitFork size={12} /> {result.forksCount}</span>
                  <span>جودة الكود: <strong className="num">{result.qualityScore}%</strong></span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleImportSingle(result)}
                  disabled={evidenceImported}
                  leftIcon={<CheckCircle size={14} />}
                >
                  تثبيت الأدلة
                </Button>
                <a
                  href={`https://github.com/${result.repoFullName}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontSize: '0.8rem',
                    color: '#00B8B8',
                    padding: '0.4rem 0.75rem',
                    borderRadius: '8px',
                    background: 'rgba(0, 184, 184, 0.1)',
                    border: '1px solid rgba(0, 184, 184, 0.2)'
                  }}
                >
                  <ExternalLink size={12} /> فتح على GitHub
                </a>
              </div>
            </div>

            <div className={styles.repoQualitySignals} style={{ marginBottom: '1rem' }}>
              {result.signals.map((signal, sIdx) => (
                <span
                  key={sIdx}
                  className={styles.qualitySignal + ' ' + signal.status}
                >
                  {signal.status === 'good' && <CheckCircle size={12} />}
                  {signal.status === 'medium' && <AlertCircle size={12} />}
                  {signal.status === 'poor' && <AlertCircle size={12} />}
                  {signal.status === 'untrusted' && <span className={styles.untrustedTag} style={{ fontSize: '0.6rem', marginInlineEnd: '0.2rem' }}>⚠</span>}
                  {signal.label}: <span className="num">{signal.status === 'untrusted' ? signal.score.toLocaleString('ar-EG') : signal.score + '%'}</span>
                  {signal.status === 'untrusted' && <span className={styles.untrustedTag}>غير موثوق</span>}
                </span>
              ))}
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontWeight: 600, color: 'var(--ink)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                القدرات المستخلصة ({result.capabilities.length})
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {result.capabilities.map((cap, cIdx) => (
                  <span
                    key={cIdx}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: 'var(--proof)',
                      background: 'rgba(0, 184, 184, 0.1)',
                      border: '1px solid rgba(0, 184, 184, 0.2)',
                      padding: '0.3rem 0.6rem',
                      borderRadius: '6px'
                    }}
                  >
                    {cap.name} <span className="num">({cap.confidence}%)</span>
                  </span>
                ))}
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1rem' }}>
              <a
                href={`/code-intel/details/${result.repoId}`}
                style={{
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'var(--proof)',
                  padding: '0.5rem 1rem',
                  border: '1px solid rgba(0, 184, 184, 0.3)',
                  borderRadius: '8px',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(0, 184, 184, 0.1)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <FileCode2 size={14} /> عرض التفاصيل الكاملة والإشارات
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.card} style={{ marginTop: '1.5rem' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--ink)', margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={22} style={{ color: '#F59E0B' }} />
          الخطوات التالية
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ flex: 1, minWidth: '250px', padding: '1rem', background: 'rgba(0, 184, 184, 0.05)', border: '1px solid rgba(0, 184, 184, 0.2)', borderRadius: '10px' }}>
            <div style={{ fontWeight: 700, color: 'var(--ink)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldCheck size={16} style={{ color: '#10B981' }} />
              تثبيت الأدلة
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--ink-2)', lineHeight: 1.6 }}>
              أضف القدرات المستخلصة كدليل معتمد (Proven) في بروفايلك وجواز قدراتك.
              كل قدرة تظهر مع نسبة ثقة وإشارات الجودة الداعمة لها.
            </p>
          </div>
          <div style={{ flex: 1, minWidth: '250px', padding: '1rem', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '10px' }}>
            <div style={{ fontWeight: 700, color: 'var(--ink)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <FileCode2 size={16} style={{ color: 'var(--proof)' }} />
              مراجعة التفاصيل
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--ink-2)', lineHeight: 1.6 }}>
              افتح كل مستودع لرؤية خط زمني المساهمات، إشارات الجودة التفصيلية،
              والقدرات مع الملفات المطابقة لكل واحدة.
            </p>
          </div>
          <div style={{ flex: 1, minWidth: '250px', padding: '1rem', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '10px' }}>
            <div style={{ fontWeight: 700, color: 'var(--ink)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <GitCommit size={16} style={{ color: '#F59E0B' }} />
              تحليل مستودعات أخرى
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--ink-2)', lineHeight: 1.6 }}>
              اختر مستودعات إضافية للمسح، أو اربط Token للوصول للمستودعات الخاصة
              وتحليلها بنفس المنهجية.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default M14ResultsPage;