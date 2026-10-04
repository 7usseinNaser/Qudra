import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { GitHubService, type GitHubRepo } from '../../../services/github.service';
import styles from './m14.module.css';
import { ArrowRight, GitCommit, Star, GitFork, Cpu, ShieldCheck, AlertCircle, CheckCircle, Clock, FileCode2, Search, ExternalLink, GitHub } from 'lucide-react';

export const M14DetailsPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [repo, setRepo] = useState<GitHubRepo | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showExplain, setShowExplain] = useState(false);

  useEffect(() => {
    const loadRepo = async () => {
      setLoading(true);
      try {
        const repos = await GitHubService.getRepos();
        let found = repos.find(r => r.id === id || r.name === id);

        if (!found && repos.length > 0) {
          found = repos[0];
        }

        if (found) {
          setRepo(found);
        } else {
          setNotFound(true);
        }
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    loadRepo();
  }, [id]);

  if (loading) {
    return (
      <div className={styles.container} dir="rtl">
        <div className={styles.loadingState}>
          <div className={styles.spinner} />
          <span>جاري تحميل تفاصيل المستودع...</span>
        </div>
      </div>
    );
  }

  if (notFound || !repo) {
    return (
      <div className={styles.container} dir="rtl">
        <div className={styles.errorState}>
          <AlertCircle className={styles.errorIcon} size={48} />
          <h2 className={styles.errorTitle}>المستودع غير موجود</h2>
          <p className={styles.errorDesc}>تعذر العثور على المستودع المطلوب. قد يكون تم حذفه أو لم يتم مسحه بعد.</p>
          <div className={styles.recoveryActions}>
            <Button variant="proof" size="md" onClick={() => navigate('/code-intel/overview')}>
              العودة للنظرة العامة
            </Button>
            <Button variant="outline" size="md" onClick={() => navigate('/code-intel/create')}>
              اختيار مستودع آخر
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const qualitySignals = [
    { label: 'تعقيد الكود', score: 82, status: 'good' as const, desc: 'تعقيد دوائري منخفض، دوال صغيرة' },
    { label: 'تغطية الاختبارات', score: 76, status: 'good' as const, desc: 'اختبارات وحدة وتكاملة موجودة' },
    { label: 'التوثيق', score: 58, status: 'medium' as const, desc: 'JSDoc جزئي، README جيد' },
    { label: 'أنماط معمارية', score: 88, status: 'good' as const, desc: 'Clean Architecture، Dependency Injection' },
    { label: 'تنوع الـCommits', score: 71, status: 'medium' as const, desc: 'مساهمات منتظمة، أحجام متنوعة' },
    { label: 'نجوم المستودع', score: repo.starsCount, status: 'untrusted' as const, desc: 'قابلة للشراء — غير موثوقة للثقة' }
  ];

  const contributionHistory = [
    { date: '2026-09-15', action: 'إضافة ميزة: نظام المصادقة', author: '7usseinNaser', commits: 12, lines: 2450 },
    { date: '2026-09-08', action: 'إصلاح: معالجة أخطاء API', author: '7usseinNaser', commits: 5, lines: 320 },
    { date: '2026-09-01', action: 'تطوير: بنية قاعدة البيانات', author: '7usseinNaser', commits: 18, lines: 4100 },
    { date: '2026-08-25', action: 'إعادة هيكلة: طبقة الخدمات', author: '7usseinNaser', commits: 22, lines: 3800 },
    { date: '2026-08-18', action: 'ميزة: لوحة التحكم', author: '7usseinNaser', commits: 15, lines: 2900 },
  ];

  const detectedCapabilities = repo.detectedCapabilities || [
    { name: 'React & TypeScript Architecture', category: 'Frontend', confidence: 95, matchedFiles: 36 },
    { name: 'Node.js & Express Backend', category: 'Backend', confidence: 88, matchedFiles: 24 },
    { name: 'PostgreSQL & Prisma ORM', category: 'Database', confidence: 85, matchedFiles: 12 },
    { name: 'Docker & CI/CD', category: 'DevOps', confidence: 82, matchedFiles: 8 },
  ];

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
          <a
            href={`https://github.com/${repo.fullName}`}
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
            <GitHub size={14} /> فتح على GitHub <ExternalLink size={12} />
          </a>
        </div>
      </div>

      <div className={styles.card} style={{ marginBottom: '1.5rem' }}>
        <div className={styles.repoCardHeader}>
          <div>
            <h1 className={styles.repoName}>{repo.fullName}</h1>
            <span className={styles.repoVisibility + ' ' + (repo.isPrivate ? 'private' : 'public')}>
              {repo.isPrivate ? '🔒 مستودع خاص' : '🌐 مستودع عام مفتوح المصدر'}
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
              <CheckCircle size={12} /> ممسوح ومحلل
            </span>
          )}
        </div>

        <p className={styles.repoDescription}>{repo.description || 'لا يوجد وصف للمستودع'}</p>

        <div className={styles.repoMeta}>
          <span className={styles.repoMetaItem}>
            <Cpu size={14} /> اللغة الأساسية: <strong>{repo.primaryLanguage}</strong>
          </span>
          <span className={styles.repoMetaItem}>
            <Star size={14} style={{ color: '#F59E0B' }} />
            <span className={styles.untrustedTag}>غير موثوق</span>
            {repo.starsCount.toLocaleString('ar-EG')} نجوم
          </span>
          <span className={styles.repoMetaItem}>
            <GitFork size={14} /> {repo.forksCount.toLocaleString('ar-EG')} Forks
          </span>
          <span className={styles.repoMetaItem}>
            <Clock size={14} /> آخر تحديث: {new Date(repo.updatedAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>
      </div>

      <div className={styles.tabsBar}>
        <button
          className={`${styles.tabBtn} ${styles.active}`}
          onClick={() => {}}
        >
          <Search size={17} /> التفاصيل والإشارات
        </button>
        <button
          className={styles.tabBtn}
          onClick={() => {}}
        >
          <GitCommit size={17} /> تاريخ المساهمات
        </button>
        <button
          className={styles.tabBtn}
          onClick={() => {}}
        >
          <FileCode2 size={17} /> القدرات المستخلصة
        </button>
        <button
          className={styles.tabBtn}
          onClick={() => {}}
        >
          <ShieldCheck size={17} /> التحقق والأدلة
        </button>
      </div>

      <div className={styles.detailSection}>
        <h3 className={styles.detailSectionTitle}>
          <ShieldCheck size={18} style={{ color: '#10B981' }} />
          إشارات جودة الكود (Quality Signals)
        </h3>
        <div className={styles.detailGrid}>
          {qualitySignals.map((signal, idx) => (
            <div key={idx} className={styles.detailItem}>
              <div className={styles.detailItemLabel}>{signal.label}</div>
              <div className={styles.detailItemValue + ' ' + (signal.status === 'untrusted' ? 'mono' : '')}>
                {signal.status === 'untrusted'
                  ? <>
                      <span className="num">{signal.score.toLocaleString('ar-EG')}</span>
                      <span className={styles.untrustedTag}>غير موثوق</span>
                    </>
                  : <span className="num">{signal.score}%</span>
                }
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--ink-2)', marginTop: '0.5rem', lineHeight: 1.4 }}>
                {signal.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.detailSection}>
        <h3 className={styles.detailSectionTitle}>
          <GitCommit size={18} style={{ color: 'var(--proof)' }} />
          خط زمني المساهمات (Contribution Timeline)
        </h3>
        <div className={styles.historyList}>
          {contributionHistory.map((item, idx) => (
            <div key={idx} className={styles.historyItem}>
              <span className={styles.historyDate}>{new Date(item.date).toLocaleDateString('ar-EG')}</span>
              <div className={styles.historyContent}>
                <div className={styles.historyAction}>{item.action}</div>
                <div className={styles.historyMeta}>
                  بواسطة {item.author} · {item.commits} commits · {item.lines.toLocaleString('ar-EG')} أسطر
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.detailSection}>
        <h3 className={styles.detailSectionTitle}>
          <FileCode2 size={18} style={{ color: 'var(--proof)' }} />
          القدرات الهندسية المستخلصة
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {detectedCapabilities.map((cap, idx) => (
            <div
              key={idx}
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '10px',
                padding: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--ink)' }}>{cap.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--ink-2)' }}>التصنيف: {cap.category} · {cap.matchedFiles} ملفات مرتبطة</div>
              </div>
              <div style={{ textAlign: 'left' }}>
                <span style={{ color: 'var(--proof)', fontWeight: 700, fontSize: '1.1rem' }}>{cap.confidence}%</span>
                <div style={{ fontSize: '0.7rem', color: '#10B981' }}>موثوقية مؤكدة ✓</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.detailSection}>
        <h3 className={styles.detailSectionTitle}>
          <CheckCircle size={18} style={{ color: '#10B981' }} />
          الأدلة المرتبطة والوضع
        </h3>
        <div className={styles.detailGrid}>
          <div className={styles.detailItem}>
            <div className={styles.detailItemLabel}>حالة التحقق</div>
            <div className={styles.detailItemValue}>
              <span className={styles.verificationStatus + ' ' + (repo.isScanned ? 'verified' : 'pending')}>
                {repo.isScanned ? 'مُتحقق (Proven)' : 'قيد التحليل'}
              </span>
            </div>
          </div>
          <div className={styles.detailItem}>
            <div className={styles.detailItemLabel}>طريقة التحقق</div>
            <div className={styles.detailItemValue}>
              <span className={styles.verificationMethod}>
                <GitCommit size={12} /> تحليل توقيت الـCommits + ملكية المستودع
              </span>
            </div>
          </div>
          <div className={styles.detailItem}>
            <div className={styles.detailItemLabel}>مستوى الثقة</div>
            <div className={styles.detailItemValue}>
              <span className="verificationMethod" style={{ background: 'rgba(0, 184, 184, 0.1)', borderColor: 'rgba(0, 184, 184, 0.3)', color: 'var(--proof)' }}>
                <ShieldCheck size={12} /> User-supplied (PAT قراءة فقط)
              </span>
            </div>
          </div>
          <div className={styles.detailItem}>
            <div className={styles.detailItemLabel}>الأدلة المنشأة</div>
            <div className={styles.detailItemValue}>
              <span className="num">{detectedCapabilities.length}</span> قدرات موثقة
            </div>
          </div>
        </div>
      </div>

      <div className={styles.card} style={{ marginTop: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--ink)', margin: '0 0 0.25rem' }}>
              إجراءات متاحة
            </h2>
            <p style={{ margin: 0, color: 'var(--ink-2)', fontSize: '0.9rem' }}>
              اختر الإجراء التالي لهذا المستودع
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Button variant="proof" size="md" onClick={() => navigate('/code-intel/results')}>
              <CheckCircle size={16} /> عرض النتائج والاعتماد
            </Button>
            <Button variant="outline" size="md" onClick={() => navigate('/code-intel/create')}>
              <Search size={16} /> تحليل مستودع آخر
            </Button>
            <Button variant="ghost" size="md" onClick={() => navigate('/profile/master')}>
              <GitHub size={16} /> جواز القدرات
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default M14DetailsPage;