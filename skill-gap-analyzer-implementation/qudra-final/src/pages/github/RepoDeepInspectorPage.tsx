import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  FolderGit2,
  Cpu,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  GitCommit,
  FileCode2,
  Folder,
  File,
  Lock,
  Globe,
  Star,
  GitFork,
  Check,
  RefreshCw,
  Copy,
  Key,
  X,
  ExternalLink
} from 'lucide-react';
import { ROUTES } from '../../constants/routes';
import {
  GitHubService,
  type GitHubContentItem,
  type GitHubCommitItem
} from '../../services/github.service';
import { ProfileEditorService } from '../../services/profile-editor.service';
import type { GitHubRepo } from '../../services/types';
import { Button, GithubIcon } from '../../components/ui';
import styles from './RepoDeepInspectorPage.module.css';

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178C6',
  JavaScript: '#F7DF1E',
  Python: '#3776AB',
  HTML: '#E34F26',
  CSS: '#1572B6',
  Rust: '#DEA584',
  Go: '#00ADD8',
  Shell: '#89E051',
  C: '#555555',
  'C++': '#F34B7D'
};

export const RepoDeepInspectorPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Selected repo state
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [selectedRepoName, setSelectedRepoName] = useState<string>(
    searchParams.get('repo') || 'Qudra'
  );
  const [activeTab, setActiveTab] = useState<'files' | 'commits' | 'readme' | 'synthesis'>('files');

  // Token Modal
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [tokenInput, setTokenInput] = useState(GitHubService.getToken() || '');

  // File Tree state
  const [currentPath, setCurrentPath] = useState('');
  const [contents, setContents] = useState<GitHubContentItem[]>([]);
  const [loadingContents, setLoadingContents] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{ path: string; name: string; content: string; size: number } | null>(null);
  const [loadingFile, setLoadingFile] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Commits state
  const [commits, setCommits] = useState<GitHubCommitItem[]>([]);
  const [loadingCommits, setLoadingCommits] = useState(false);

  // Readme state
  const [readmeContent, setReadmeContent] = useState('');
  const [loadingReadme, setLoadingReadme] = useState(false);

  // Languages state
  const [languages, setLanguages] = useState<Record<string, number>>({});

  // Synthesis & Evidence state
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [evidenceImported, setEvidenceImported] = useState(false);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  // Profile data for owner
  const profile = ProfileEditorService.getProfile();
  const owner = profile.githubUsername || '7usseinNaser';

  // 1. Initial Load: Get repos from store or fetch real repos
  useEffect(() => {
    const loadRepos = async () => {
      let list = await GitHubService.getRepos();
      if (list.length === 0) {
        try {
          list = await GitHubService.fetchRealUserRepos(owner);
        } catch {
          // fallback
        }
      }
      setRepos(list);
      if (list.length > 0 && !list.some(r => r.name === selectedRepoName)) {
        setSelectedRepoName(list[0].name);
      }
    };
    loadRepos();
  }, [owner]);

  const currentRepo = repos.find(r => r.name === selectedRepoName) || {
    id: 'gh-default',
    name: selectedRepoName,
    fullName: `${owner}/${selectedRepoName}`,
    description: 'مستودع برمجي على منصة GitHub',
    primaryLanguage: 'TypeScript',
    starsCount: 0,
    forksCount: 0,
    updatedAt: new Date().toISOString(),
    isPrivate: false
  };

  // 2. Load File Tree when repo or path changes
  useEffect(() => {
    const fetchTree = async () => {
      setLoadingContents(true);
      try {
        const items = await GitHubService.fetchRepoContents(owner, selectedRepoName, currentPath);
        setContents(items);
      } catch (err: unknown) {
        console.warn('Could not fetch repo contents:', err);
        setContents([]);
      } finally {
        setLoadingContents(false);
      }
    };

    fetchTree();
  }, [owner, selectedRepoName, currentPath]);

  // 3. Load Commits, Readme, and Languages when tab changes or repo changes
  useEffect(() => {
    if (activeTab === 'commits' && commits.length === 0) {
      setLoadingCommits(true);
      GitHubService.fetchRepoCommits(owner, selectedRepoName)
        .then(res => setCommits(res))
        .catch(err => console.warn(err))
        .finally(() => setLoadingCommits(false));
    }

    if (activeTab === 'readme' && !readmeContent) {
      setLoadingReadme(true);
      GitHubService.fetchRepoReadme(owner, selectedRepoName)
        .then(res => setReadmeContent(res))
        .catch(err => console.warn(err))
        .finally(() => setLoadingReadme(false));
    }

    if (activeTab === 'synthesis' && Object.keys(languages).length === 0) {
      GitHubService.fetchRepoLanguages(owner, selectedRepoName)
        .then(res => setLanguages(res))
        .catch(err => console.warn(err));
    }
  }, [activeTab, owner, selectedRepoName, commits.length, readmeContent, languages]);

  // Handler: Click item in file tree
  const handleItemClick = async (item: GitHubContentItem) => {
    if (item.type === 'dir') {
      setCurrentPath(item.path);
      setSelectedFile(null);
    } else {
      setLoadingFile(true);
      try {
        const fileData = await GitHubService.fetchRepoFileContent(owner, selectedRepoName, item.path);
        setSelectedFile({
          path: item.path,
          name: item.name,
          content: fileData.content,
          size: fileData.size
        });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'تعذر قراءة الملف';
        setStatusNotice(msg);
      } finally {
        setLoadingFile(false);
      }
    }
  };

  // Handler: Save PAT Token
  const handleSaveToken = async () => {
    GitHubService.setToken(tokenInput.trim());
    setIsTokenModalOpen(false);
    setStatusNotice('تم حفظ مفتاح GitHub Token بنجاح! جاري جلب المستودعات الخاصة والعامة...');

    try {
      const freshRepos = await GitHubService.fetchRealUserRepos(owner, tokenInput.trim());
      setRepos(freshRepos);
      if (freshRepos.length > 0) {
        setSelectedRepoName(freshRepos[0].name);
      }
      setStatusNotice(`تم العثور على ${freshRepos.length} مستودعاً (بما فيها المستودعات الخاصة 🔒).`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'فشل الاتصال بالمفتاح';
      setStatusNotice(msg);
    }
  };

  // Handler: Copy code
  const handleCopyCode = () => {
    if (!selectedFile) return;
    navigator.clipboard?.writeText(selectedFile.content);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Handler: Synthesize & Import Evidence
  const handleImportEvidence = () => {
    setIsSynthesizing(true);
    setTimeout(() => {
      ProfileEditorService.importGitHubReposAsProjects([
        {
          name: currentRepo.name,
          fullName: currentRepo.fullName,
          description: currentRepo.description,
          primaryLanguage: currentRepo.primaryLanguage
        }
      ]);
      setIsSynthesizing(false);
      setEvidenceImported(true);
      setStatusNotice(`تم تثبيت مستودع "${currentRepo.name}" كدليل كود معتمد داخل بروفايلك بنجاح!`);
    }, 700);
  };

  // Breadcrumbs generator
  const pathParts = currentPath ? currentPath.split('/') : [];

  // Calculate languages percentage
  const totalBytes = Object.values(languages).reduce((a, b) => a + b, 0) || 1;

  return (
    <div className={styles.container} dir="rtl">
      {/* Top Banner Alert */}
      {statusNotice && (
        <div style={{
          background: 'linear-gradient(90deg, rgba(0, 184, 184, 0.15) 0%, rgba(16, 185, 129, 0.15) 100%)',
          border: '1px solid rgba(0, 184, 184, 0.4)',
          borderRadius: '12px',
          padding: '0.75rem 1.25rem',
          marginBottom: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.88rem'
        }}>
          <span>{statusNotice}</span>
          <button
            onClick={() => setStatusNotice(null)}
            style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Navigation Top */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(ROUTES.PROFILE_EDIT || '/profile/edit')}
          leftIcon={<ArrowRight size={15} />}
        >
          العودة للبروفايل المهني
        </Button>

        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsTokenModalOpen(true)}
            leftIcon={<Key size={14} style={{ color: '#F59E0B' }} />}
          >
            {GitHubService.getToken() ? 'مفتاح الوصول الخاص متصل 🔒' : 'ربط المستودعات الخاصة (GitHub Token) 🔑'}
          </Button>
        </div>
      </div>

      {/* Main Header Card */}
      <div className={styles.headerCard}>
        <div className={styles.topBarRow}>
          <div className={styles.repoSelectorRow}>
            <span style={{ fontSize: '0.85rem', color: '#94A3B8' }}>المستودع المفحوص:</span>
            <select
              className={styles.repoSelect}
              value={selectedRepoName}
              onChange={e => {
                setSelectedRepoName(e.target.value);
                setCurrentPath('');
                setSelectedFile(null);
                setCommits([]);
                setReadmeContent('');
                setLanguages({});
                setEvidenceImported(false);
              }}
            >
              {repos.map(r => (
                <option key={r.id} value={r.name}>
                  {r.isPrivate ? '🔒 ' : '🌐 '} {r.fullName} ({r.primaryLanguage || 'Code'})
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <a
              href={`https://github.com/${owner}/${selectedRepoName}`}
              target="_blank"
              rel="noreferrer"
              style={{
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.85rem',
                color: '#00B8B8',
                padding: '0.4rem 0.8rem',
                borderRadius: '8px',
                background: 'rgba(0, 184, 184, 0.1)'
              }}
            >
              <GithubIcon size={14} /> فتحه على GitHub <ExternalLink size={12} />
            </a>

            <Button
              variant="proof"
              size="sm"
              onClick={handleImportEvidence}
              disabled={isSynthesizing || evidenceImported}
              leftIcon={evidenceImported ? <Check size={15} /> : <Sparkles size={15} />}
            >
              {evidenceImported ? 'تم تثبيت الأدلة في ملفك ✓' : isSynthesizing ? 'جاري التحليل...' : 'تثبيت الأدلة في جواز القدرات'}
            </Button>
          </div>
        </div>

        <div className={styles.repoTitleArea}>
          <h1 className={styles.repoName}>
            <FolderGit2 size={26} style={{ color: '#00B8B8' }} />
            {owner}/{selectedRepoName}
          </h1>
          {currentRepo.isPrivate ? (
            <span className={styles.privateBadge}>
              <Lock size={12} /> مستودع خاص (Private Repo)
            </span>
          ) : (
            <span className={styles.publicBadge}>
              <Globe size={12} /> مستودع عام مفتوح المصدر (Public)
            </span>
          )}
        </div>

        <p style={{ fontSize: '0.9rem', color: '#94A3B8', marginTop: '0.5rem', lineHeight: 1.6 }}>
          {currentRepo.description}
        </p>

        <div className={styles.repoStatsStrip}>
          <span className={styles.statItem}>
            <Star size={14} style={{ color: '#F59E0B' }} /> {currentRepo.starsCount} نجوم
          </span>
          <span className={styles.statItem}>
            <GitFork size={14} /> {currentRepo.forksCount} Forks
          </span>
          <span className={styles.statItem}>
            <Cpu size={14} style={{ color: '#00B8B8' }} /> اللغة الأساسية: <strong>{currentRepo.primaryLanguage}</strong>
          </span>
          <span className={styles.statItem}>
            <ShieldCheck size={14} style={{ color: '#10B981' }} /> فحص الكفاءة: <strong>أدلة حية ومباشرة</strong>
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabsBar}>
        <button
          className={`${styles.tabBtn} ${activeTab === 'files' ? styles.active : ''}`}
          onClick={() => setActiveTab('files')}
        >
          <Folder size={17} /> متصفح الملفات وقارئ الكود الحي
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'commits' ? styles.active : ''}`}
          onClick={() => setActiveTab('commits')}
        >
          <GitCommit size={17} /> سجل الـ Commits والمساهمات ({commits.length > 0 ? commits.length : 'سحب'})
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'readme' ? styles.active : ''}`}
          onClick={() => setActiveTab('readme')}
        >
          <FileCode2 size={17} /> ملف الـ README الحقيقي
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'synthesis' ? styles.active : ''}`}
          onClick={() => setActiveTab('synthesis')}
        >
          <Sparkles size={17} /> تحليل القدرات وتوزيع اللغات
        </button>
      </div>

      {/* TAB 1: File Tree & Code Viewer */}
      {activeTab === 'files' && (
        <div className={styles.explorerLayout}>
          {/* File Tree Left Pane */}
          <div className={styles.treePanel}>
            <div className={styles.panelTitleBar}>
              <span>شجرة ملفات المستودع (Live GitHub Tree)</span>
              {loadingContents && <RefreshCw size={14} className="spin" style={{ color: '#00B8B8' }} />}
            </div>

            {/* Breadcrumbs */}
            <div className={styles.breadcrumbBar}>
              <span
                className={styles.breadcrumbItem}
                onClick={() => { setCurrentPath(''); setSelectedFile(null); }}
              >
                root
              </span>
              {pathParts.map((part, index) => {
                const subPath = pathParts.slice(0, index + 1).join('/');
                return (
                  <React.Fragment key={index}>
                    <span>/</span>
                    <span
                      className={styles.breadcrumbItem}
                      onClick={() => { setCurrentPath(subPath); setSelectedFile(null); }}
                    >
                      {part}
                    </span>
                  </React.Fragment>
                );
              })}
            </div>

            {/* Contents List */}
            <div className={styles.fileList}>
              {currentPath && (
                <div
                  className={styles.fileItem}
                  onClick={() => {
                    const parent = pathParts.slice(0, -1).join('/');
                    setCurrentPath(parent);
                    setSelectedFile(null);
                  }}
                  style={{ color: '#00B8B8', fontWeight: 600 }}
                >
                  <Folder size={15} /> .. (مجلد أعلى)
                </div>
              )}

              {loadingContents ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8', fontSize: '0.85rem' }}>
                  جارٍ جلب شجرة الملفات من GitHub API...
                </div>
              ) : contents.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8', fontSize: '0.85rem' }}>
                  لم يتم العثور على ملفات في هذا المسار، أو المستودع فارغ.
                </div>
              ) : (
                contents.map(item => {
                  const isDir = item.type === 'dir';
                  const isSelected = selectedFile?.path === item.path;
                  return (
                    <div
                      key={item.sha || item.path}
                      className={`${styles.fileItem} ${isSelected ? styles.selected : ''}`}
                      onClick={() => handleItemClick(item)}
                    >
                      {isDir ? (
                        <Folder size={15} style={{ color: '#F59E0B' }} />
                      ) : (
                        <File size={15} style={{ color: '#94A3B8' }} />
                      )}
                      <span>{item.name}</span>
                      {item.size ? (
                        <span style={{ marginInlineStart: 'auto', fontSize: '0.72rem', color: '#64748B' }}>
                          {(item.size / 1024).toFixed(1)} KB
                        </span>
                      ) : null}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Code Viewer Right Pane */}
          <div className={styles.codePanel}>
            <div className={styles.codeHeader}>
              <div className={styles.codeFileName}>
                <FileCode2 size={16} style={{ color: '#00B8B8' }} />
                <span>{selectedFile ? selectedFile.name : 'اختر أي ملف من الشجرة لعرض محتواه الحقيقي'}</span>
                {selectedFile && (
                  <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 400 }}>
                    ({(selectedFile.size / 1024).toFixed(1)} KB)
                  </span>
                )}
              </div>

              {selectedFile && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyCode}
                  leftIcon={copiedCode ? <Check size={14} /> : <Copy size={14} />}
                >
                  {copiedCode ? 'تم النسخ!' : 'نسخ الكود'}
                </Button>
              )}
            </div>

            <div className={styles.codeContentBox}>
              {loadingFile ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8', direction: 'rtl' }}>
                  جارٍ قراءة وفك تشفير محتوى الملف مباشرة من GitHub...
                </div>
              ) : selectedFile ? (
                <pre className={styles.codePre}>
                  <code>{selectedFile.content}</code>
                </pre>
              ) : (
                <div style={{ padding: '4rem 2rem', textAlign: 'center', color: '#64748B', direction: 'rtl' }}>
                  <FolderGit2 size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                  <div style={{ fontSize: '1rem', fontWeight: 600, color: '#94A3B8' }}>
                    استكشف كود المستودع سطراً بسطر
                  </div>
                  <p style={{ fontSize: '0.85rem', marginTop: '0.4rem' }}>
                    انقر على أي ملف برمجي (.py, .ts, .json, .md) في القائمة الجانبية لقراءة كوده الحقيقي والتحقق منه.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Live Commits Log */}
      {activeTab === 'commits' && (
        <div className={styles.commitsCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <GitCommit size={20} style={{ color: '#00B8B8' }} /> سجل الـ Commits الحقيقية (Git Log)
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setLoadingCommits(true);
                GitHubService.fetchRepoCommits(owner, selectedRepoName)
                  .then(setCommits)
                  .finally(() => setLoadingCommits(false));
              }}
              leftIcon={<RefreshCw size={13} className={loadingCommits ? 'spin' : ''} />}
            >
              تحديث السجل
            </Button>
          </div>

          {loadingCommits ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8' }}>
              جارٍ سحب سجل المساهمات من GitHub API...
            </div>
          ) : commits.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8' }}>
              لم يتم العثور على Commits في هذا المستودع حتى الآن.
            </div>
          ) : (
            commits.map(c => (
              <div key={c.sha} className={styles.commitRow}>
                <img
                  src={c.author?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80'}
                  alt="Author"
                  className={styles.commitAvatar}
                />
                <div style={{ flex: 1 }}>
                  <div className={styles.commitMsg}>{c.commit.message}</div>
                  <div className={styles.commitMeta}>
                    <span>{c.commit.author.name}</span>
                    <span>·</span>
                    <span>{new Date(c.commit.author.date).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    <span>·</span>
                    <a
                      href={c.html_url}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.commitSha}
                      style={{ textDecoration: 'none' }}
                    >
                      {c.sha.substring(0, 7)}
                    </a>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 3: Live README.md */}
      {activeTab === 'readme' && (
        <div className={styles.readmeCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.75rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileCode2 size={20} style={{ color: '#00B8B8' }} /> ملف التوثيق الرسمي (README.md)
            </h2>
            <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>يتم استخراجه وفك تشفيره حياً من GitHub</span>
          </div>

          {loadingReadme ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8' }}>
              جارٍ قراءة وفك تشفير ملف README.md...
            </div>
          ) : (
            <div className={styles.readmeBody}>
              {readmeContent}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: Capability & Language Synthesis */}
      {activeTab === 'synthesis' && (
        <div className={styles.synthesisGrid}>
          {/* Languages Distribution */}
          <div className={styles.synCard}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Cpu size={18} style={{ color: '#00B8B8' }} /> التوزيع الحقيقي للغات البرمجة
            </h3>

            {Object.keys(languages).length === 0 ? (
              <div style={{ color: '#94A3B8', fontSize: '0.85rem' }}>
                اللغة الأساسية: {currentRepo.primaryLanguage} (100%)
              </div>
            ) : (
              <div className={styles.langBarWrap}>
                <div className={styles.langBar}>
                  {Object.entries(languages).map(([lang, bytes]) => {
                    const pct = ((bytes / totalBytes) * 100).toFixed(1);
                    const color = LANG_COLORS[lang] || '#00B8B8';
                    return (
                      <div
                        key={lang}
                        className={styles.langSeg}
                        style={{ width: `${pct}%`, background: color }}
                        title={`${lang}: ${pct}%`}
                      />
                    );
                  })}
                </div>

                <div className={styles.langLegend}>
                  {Object.entries(languages).map(([lang, bytes]) => {
                    const pct = ((bytes / totalBytes) * 100).toFixed(1);
                    const color = LANG_COLORS[lang] || '#00B8B8';
                    return (
                      <div key={lang} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span className={styles.langDot} style={{ background: color }} />
                        <span style={{ fontWeight: 600, color: '#fff' }}>{lang}</span>
                        <span style={{ color: '#94A3B8' }}>{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Detected Capabilities */}
          <div className={styles.synCard}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={18} style={{ color: '#10B981' }} /> القدرات الهندسية المستخلصة
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {(currentRepo.detectedCapabilities || []).map((cap, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '10px',
                    padding: '0.75rem 1rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fff' }}>{cap.name}</div>
                    <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>التصنيف: {cap.category} · {cap.matchedFiles} ملفات مرتبطة</div>
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <span style={{ color: '#00B8B8', fontWeight: 700, fontSize: '0.95rem' }}>{cap.confidence}%</span>
                    <div style={{ fontSize: '0.7rem', color: '#10B981' }}>موثوقية مؤكدة ✓</div>
                  </div>
                </div>
              ))}
            </div>

            <Button
              variant="proof"
              size="md"
              fullWidth
              style={{ marginTop: '1.25rem' }}
              onClick={handleImportEvidence}
              disabled={evidenceImported}
            >
              {evidenceImported ? 'تم إدراج القدرات في ملفك وجوازك ✓' : 'اعتماد هذه القدرات في بروفايلك وجواز الإثبات'}
            </Button>
          </div>
        </div>
      )}

      {/* GitHub Token Modal for Private Repos */}
      {isTokenModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsTokenModalOpen(false)}>
          <div className={styles.modalBox} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                <Lock size={18} style={{ verticalAlign: 'middle', marginLeft: '0.4rem', color: '#F59E0B' }} />
                ربط المستودعات الخاصة (Private Repositories)
              </h3>
              <button
                onClick={() => setIsTokenModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <p style={{ fontSize: '0.86rem', color: '#CBD5E1', lineHeight: 1.6, marginBottom: '1rem' }}>
                للوصول إلى مستودعاتك البرمجية <strong>الخاصة (Private)</strong> وتصفح ملفاتها وكودها عبر منصة قُدرة، يرجى إدخال GitHub Personal Access Token بصلاحية <code>repo</code>.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.84rem', fontWeight: 600, color: '#CBD5E1' }}>
                  رمز الوصول الشخصي (GitHub PAT)
                </label>
                <input
                  type="password"
                  value={tokenInput}
                  onChange={e => setTokenInput(e.target.value)}
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
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

              <div style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: '10px', padding: '0.75rem', fontSize: '0.8rem', color: '#E2E8F0', lineHeight: 1.5 }}>
                🔒 <strong>الخصوصية التامة:</strong><br />
                الرمز يُخزن محلياً فقط في متصفحك ولا يُرسل لأي خادم وسيط. يُستخدم حصرياً للتواصل المباشر مع واجهة <code>api.github.com</code>.
              </div>
            </div>

            <div className={styles.modalFooter}>
              <Button variant="ghost" size="sm" onClick={() => setIsTokenModalOpen(false)}>إلغاء</Button>
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

export default RepoDeepInspectorPage;
