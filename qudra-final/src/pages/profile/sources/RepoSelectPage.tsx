import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, GitFork, Check, ScanLine } from 'lucide-react';
import { ROUTES } from '../../../constants/routes';
import { GitHubService } from '../../../services/github.service';
import { GitHubRepo } from '../../../services/types';
import { Button } from '../../../components/ui/Button';

export const RepoSelectPage: React.FC = () => {
  const navigate = useNavigate();
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    GitHubService.getRepos().then(list => {
      setRepos(list);
      setLoading(false);
    });
  }, []);

  const handleToggle = async (id: string) => {
    const updated = await GitHubService.toggleRepoSelection(id);
    setRepos(updated);
  };

  const selectedCount = repos.filter(r => r.isSelected).length;

  const handleStartScan = () => {
    if (selectedCount === 0) return;
    navigate(ROUTES.GITHUB_SCANNING);
  };

  if (loading) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center' }} dir="rtl">
        <p>جاري جلب المستودعات من GitHub...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '52rem', margin: '0 auto', padding: '2rem 1.25rem 5rem' }} dir="rtl">
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: '0 0 0.35rem' }}>
          اختر المستودعات المراد مسحها
        </h1>
        <p style={{ color: 'var(--ink-2)', fontSize: '0.95rem' }}>
          حدد المستودعات التي تحتوي على كود يعكس مهاراتك الفعلية (مستودعات backend، واجهات، أو مكتبات مفتوحة).
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2rem' }}>
        {repos.map(repo => (
          <div
            key={repo.id}
            onClick={() => handleToggle(repo.id)}
            style={{
              background: 'var(--surface)',
              border: '1px solid',
              borderColor: repo.isSelected ? 'var(--proof)' : 'var(--line)',
              borderRadius: '12px',
              padding: '1.25rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'all 0.16s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '6px',
                border: '1px solid',
                borderColor: repo.isSelected ? 'var(--proof)' : 'var(--line)',
                background: repo.isSelected ? 'var(--proof)' : 'var(--surface-2)',
                display: 'grid',
                placeItems: 'center',
                color: '#fff'
              }}>
                {repo.isSelected && <Check size={16} />}
              </div>

              <div>
                <h4 style={{ margin: '0 0 0.25rem', fontSize: '1.05rem', fontWeight: 700 }}>{repo.name}</h4>
                <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--ink-2)', maxWidth: '48ch' }}>
                  {repo.description}
                </p>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.4rem', fontSize: '0.78rem', color: 'var(--ink-3)' }}>
                  <span style={{ fontWeight: 600, color: 'var(--proof-text)' }}>{repo.primaryLanguage}</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                    <Star size={12} /> {repo.starsCount}
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                    <GitFork size={12} /> {repo.forksCount}
                  </span>
                </div>
              </div>
            </div>

            {repo.isScanned && (
              <span style={{ fontSize: '0.78rem', color: 'var(--proof-text)', background: 'var(--proof-tint)', padding: '0.2rem 0.6rem', borderRadius: '999px' }}>
                ممسوح مسبقاً
              </span>
            )}
          </div>
        ))}
      </div>

      <div style={{
        position: 'sticky',
        bottom: '1.5rem',
        background: 'var(--surface)',
        border: '1px solid var(--line)',
        borderRadius: '12px',
        padding: '1rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: 'var(--shadow)'
      }}>
        <div>
          <span style={{ fontWeight: 700 }}>{selectedCount} مستودعات محددة</span>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--ink-3)' }}>سيتم استخراج المهارات وربطها بملفك المهاري</p>
        </div>

        <Button
          variant="proof"
          size="md"
          disabled={selectedCount === 0}
          onClick={handleStartScan}
          rightIcon={<ScanLine size={18} />}
        >
          بدء المسح واستخراج الأدلة
        </Button>
      </div>
    </div>
  );
};

export default RepoSelectPage;
