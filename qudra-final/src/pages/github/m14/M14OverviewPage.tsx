import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { GitHubService } from '../../../services/github.service';
import type { GitHubRepo } from '../../../services/types';
import { ProfileEditorService } from '../../../services/profile-editor.service';
import styles from './m14.module.css';
import { PlusCircle, Sparkles, Info, Search, GitCommit, CheckCircle, AlertCircle, Star, GitFork } from 'lucide-react';
import { M14EmptyPage } from './M14EmptyPage';

interface RepoAnalysisSummary {
  totalRepos: number;
  analyzedRepos: number;
  findingsAccepted: number;
  evidenceCreated: number;
  avgQualityScore: number;
  totalCommits: number;
  totalLinesOfCode: number;
}

export const M14OverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showExplain, setShowExplain] = useState(false);
  const [summary, setSummary] = useState<RepoAnalysisSummary>({
    totalRepos: 0,
    analyzedRepos: 0,
    findingsAccepted: 0,
    evidenceCreated: 0,
    avgQualityScore: 0,
    totalCommits: 0,
    totalLinesOfCode: 0
  });

  useEffect(() => {
    const loadRepos = async () => {
      setLoading(true);
      try {
        let list = await GitHubService.getRepos();
        if (list.length === 0) {
          list = await GitHubService.fetchRealUserRepos('7usseinNaser');
        }
        setRepos(list);

        const analyzed = list.filter(r => r.isScanned).length;
        const findings = list.reduce((acc, r) => acc + (r.detectedCapabilities?.length || 0), 0);
        const evidence = list.filter(r => r.isScanned).length * 2;

        setSummary({
          totalRepos: list.length,
          analyzedRepos: analyzed,
          findingsAccepted: findings,
          evidenceCreated: evidence,
          avgQualityScore: analyzed > 0 ? 78 : 0,
          totalCommits: list.reduce((acc) => acc + Math.floor(Math.random() * 200) + 50, 0),
          totalLinesOfCode: list.reduce((acc) => acc + Math.floor(Math.random() * 50000) + 10000, 0)
        });
      } catch {
        setSummary({
          totalRepos: 0,
          analyzedRepos: 0,
          findingsAccepted: 0,
          evidenceCreated: 0,
          avgQualityScore: 0,
          totalCommits: 0,
          totalLinesOfCode: 0
        });
      } finally {
        setLoading(false);
      }
    };
    loadRepos();
  }, []);

  const handleImportEvidence = () => {
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
    navigate('/code-intel/results');
  };

  if (loading) {
    return (
      <div className={styles.container} dir="rtl">
        <div className={styles.loadingState}>
          <div className={styles.spinner} />
          <span>جاري تحليل مستودعات GitHub...</span>
        </div>
      </div>
    );
  }

  if (repos.length === 0) {
    return (
      <div className={styles.container} dir="rtl">
        <M14EmptyPage />
      </div>
    );
  }

  return (
    <div className={styles.container} dir="rtl">
      <div className={styles.headerRow}>
        <div className={styles.headerContent}>
          <span className={styles.badgeQ}>M14 · Q-0521 · ⚓ Overview</span>
          <span className={styles.demoBadge}>[Demo / تجريبي] بيانات تحليل محاكاة</span>
          <h1 className={styles.title}>GitHub وذكاء الكود: نظرة عامة</h1>
          <p className={styles.subtitle}>
            ملخص المستودعات بحسب: جودة الكود، الاختبارات، تاريخ المساهمة، وتناقضات التوقيت.
            لا نعتمد على عدد النجوم — نعتمد على إشارات الجودة الحقيقية.
          </p>
        </div>

        <div className={styles.actionRow}>
          <Button
            variant="proof"
            size="md"
            onClick={() => navigate('/code-intel/create')}
            leftIcon={<PlusCircle size={16} />}
          >
            اختيار مستودعات للتحليل
          </Button>

          <Button
            variant="outline"
            size="md"
            onClick={() => setShowExplain(!showExplain)}
            leftIcon={<Sparkles size={16} />}
          >
            {showExplain ? 'إخفاء التفسير' : 'اشرح لي: تحليل الكود'}
          </Button>
        </div>
      </div>

      {showExplain && (
        <div className={styles.explainDrawer}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
            <Info size={18} color="var(--proof)" />
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: 'var(--ink)' }}>
              تفسير الذكاء الاصطناعي: منهجية تحليل GitHub
            </h3>
          </div>
          <p style={{ margin: '0 0 1rem', fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--ink-2)' }}>
            يحلل المحرك جودة الكود (تعقيد دوائري، توثيق، أنماط)، تغطية الاختبارات، وتاريخ الـCommits
            (توقيت، حجم، تنوع). يكشف تناقضات مثل دفعات commits غير طبيعية أو شراء نجوم.
            المخرج: إشارات جودة + خط زمني مساهمات + قدرات مستخلصة.
          </p>
          <div className={styles.grid3} style={{ marginBottom: 0 }}>
            <div className={styles.metricBox}>
              <span className={styles.metricLabel}>إشارات الجودة</span>
              <span className={styles.metricHint}>تعقيد، توثيق، اختبارات، أنماط معمارية</span>
            </div>
            <div className={styles.metricBox}>
              <span className={styles.metricLabel}>خط زمني المساهمات</span>
              <span className={styles.metricHint}>تنوع التوقيت، حجم التغييرات، فترات النشاط</span>
            </div>
            <div className={styles.metricBox}>
              <span className={styles.metricLabel}>نجوم = غير موثوق</span>
              <span className={styles.metricHint}>موسومة «غير موثوق» — لا تدخل حساب الثقة</span>
            </div>
          </div>
        </div>
      )}

      <div className={styles.grid3}>
        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>المستودعات الممسوحة</span>
          <span className={styles.metricValue}><span className="num">{summary.analyzedRepos}</span> / <span className="num">{summary.totalRepos}</span></span>
          <span className={styles.metricHint}>تم تحليل {summary.analyzedRepos} من {summary.totalRepos} مستودع</span>
        </div>

        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>النتائج المقبولة</span>
          <span className={styles.metricValue}><span className="num">{summary.findingsAccepted}</span></span>
          <span className={styles.metricHint}>قدرات مستخلصة من الكود الممسوح</span>
        </div>

        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>الأدلة المنشأة</span>
          <span className={styles.metricValue}><span className="num">{summary.evidenceCreated}</span></span>
          <span className={styles.metricHint}>بطاقات دليل مُضافة لجواز القدرات</span>
        </div>

        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>متوسط جودة الكود</span>
          <span className={styles.metricValue}><span className="num">{summary.avgQualityScore}</span>%</span>
          <span className={styles.metricHint}>معدل إشارات الجودة عبر المستودعات الممسوحة</span>
        </div>

        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>إجمالي الـCommits</span>
          <span className={styles.metricValue}><span className="num">{summary.totalCommits.toLocaleString('ar-EG')}</span></span>
          <span className={styles.metricHint}>مجموع المساهمات في المستودعات الممسوحة</span>
        </div>

        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>أسطر الكود</span>
          <span className={styles.metricValue}><span className="num">{summary.totalLinesOfCode.toLocaleString('ar-EG')}</span></span>
          <span className={styles.metricHint}>حجم الكود المبرمج والمحلل</span>
        </div>
      </div>

      <div className={styles.card}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--ink)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Search size={22} style={{ color: 'var(--proof)' }} />
          أحدث المستودعات الممسوحة
        </h2>

        {repos.length === 0 ? (
          <p style={{ margin: 0, color: 'var(--ink-2)', textAlign: 'center', padding: '2rem' }}>
            لا توجد مستودعات بعد. اربط GitHub لبدء التحليل.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {repos.slice(0, 5).map(repo => (
              <div key={repo.id} className={styles.repoCard}>
                <div className={styles.repoCardHeader}>
                  <div>
                    <h3 className={styles.repoName}>{repo.fullName}</h3>
                    <span className={styles.repoVisibility + ' ' + (repo.isPrivate ? 'private' : 'public')}>
                      {repo.isPrivate ? '🔒 خاص' : '🌐 عام'}
                    </span>
                  </div>
                  {repo.isScanned && (
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: '#10B981',
                      background: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      padding: '0.25rem 0.6rem',
                      borderRadius: '6px'
                    }}>
                      <CheckCircle size={12} /> ممسوح
                    </span>
                  )}
                </div>

                <div className={styles.repoMeta}>
                  <span className={styles.repoMetaItem}>
                    <GitCommit size={14} /> {repo.primaryLanguage || 'Code'}
                  </span>
                  <span className={styles.repoMetaItem}>
                    <Star size={14} style={{ color: '#F59E0B' }} />
                    <span className={styles.untrustedTag}>غير موثوق</span>
                    {repo.starsCount}
                  </span>
                  <span className={styles.repoMetaItem}>
                    <GitFork size={14} /> {repo.forksCount}
                  </span>
                  <span className={styles.repoMetaItem}>
                    تحديث: {new Date(repo.updatedAt).toLocaleDateString('ar-EG')}
                  </span>
                </div>

                <p className={styles.repoDescription}>{repo.description || 'لا يوجد وصف'}</p>

                <div className={styles.repoQualitySignals}>
                  {repo.isScanned ? (
                    <>
                      <span className={styles.qualitySignal + ' good'}><CheckCircle size={12} /> جودة الكود: عالية</span>
                      <span className={styles.qualitySignal + ' good'}><CheckCircle size={12} /> اختبارات: موجودة</span>
                      <span className={styles.qualitySignal + ' medium'}><AlertCircle size={12} /> توثيق: جزئي</span>
                    </>
                  ) : (
                    <span className={styles.qualitySignal + ' poor'}><AlertCircle size={12} /> غير ممسوح — لا توجد إشارات جودة</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {repos.length > 5 && (
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <Button variant="ghost" size="sm" onClick={() => navigate('/code-intel/create')}>
              عرض جميع المستودعات ({repos.length})
            </Button>
          </div>
        )}
      </div>

      {summary.analyzedRepos > 0 && (
        <div className={styles.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--ink)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={22} style={{ color: '#10B981' }} />
              جاهز لتثبيت الأدلة
            </h2>
            <Button
              variant="proof"
              size="md"
              onClick={handleImportEvidence}
              leftIcon={<Sparkles size={16} />}
            >
              تثبيت الأدلة في جواز القدرات
            </Button>
          </div>
          <p style={{ margin: 0, color: 'var(--ink-2)', fontSize: '0.9rem', lineHeight: 1.6 }}>
            تم تحليل {summary.analyzedRepos} مستودع واستخراج {summary.findingsAccepted} قدرة هندسية.
            اضغط للتثبيت كدليل معتمد (Proven) في بروفايلك وجواز قدراتك.
          </p>
        </div>
      )}
    </div>
  );
};

export default M14OverviewPage;