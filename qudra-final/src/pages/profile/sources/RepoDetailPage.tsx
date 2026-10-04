import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { GitHubService } from '../../../services/github.service';
import { GitHubRepo } from '../../../services/types';
import { Badge } from '../../../components/ui/Badge';
import { GithubIcon } from '../../../components/ui/GithubIcon';

export const RepoDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [repo, setRepo] = useState<GitHubRepo | null>(null);

  useEffect(() => {
    if (id) {
      GitHubService.getRepoById(id).then(r => setRepo(r || null));
    }
  }, [id]);

  if (!repo) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center' }} dir="rtl">
        <p>جاري تحميل تفاصيل المستودع...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '52rem', margin: '0 auto', padding: '2rem 1.25rem 5rem' }} dir="rtl">
      <div style={{ marginBottom: '1.5rem' }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--ink-2)',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontFamily: 'inherit',
            fontSize: '0.85rem'
          }}
        >
          <ArrowRight size={16} />
          <span>رجوع إلى المستودعات</span>
        </button>
      </div>

      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--line)',
        borderRadius: '16px',
        padding: '2rem',
        marginBottom: '2rem',
        boxShadow: 'var(--shadow)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '10px',
              background: 'var(--surface-2)',
              border: '1px solid var(--line-soft)',
              display: 'grid',
              placeItems: 'center'
            }}>
              <GithubIcon size={24} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '0 0 0.2rem' }}>{repo.name}</h1>
              <span style={{ fontSize: '0.82rem', fontFamily: 'var(--fm)', color: 'var(--ink-3)' }}>{repo.fullName}</span>
            </div>
          </div>

          <Badge variant="proof" icon={<CheckCircle2 size={14} />}>
            <span>تم التحقق من الكود</span>
          </Badge>
        </div>

        <p style={{ color: 'var(--ink-2)', fontSize: '0.92rem', lineHeight: 1.6, margin: '0 0 1.5rem' }}>
          {repo.description}
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '0.75rem',
          background: 'var(--surface-2)',
          padding: '1rem',
          borderRadius: '10px',
          fontSize: '0.85rem'
        }}>
          <div>
            <span style={{ color: 'var(--ink-3)', fontSize: '0.75rem', display: 'block' }}>اللغة الأساسية</span>
            <strong style={{ color: 'var(--proof-text)' }}>{repo.primaryLanguage}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--ink-3)', fontSize: '0.75rem', display: 'block' }}>النجوم</span>
            <strong>{repo.starsCount}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--ink-3)', fontSize: '0.75rem', display: 'block' }}>التفريعات (Forks)</span>
            <strong>{repo.forksCount}</strong>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 1rem' }}>
          المهارات المستخرجة من هذا المستودع
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {repo.detectedCapabilities?.map((c, i) => (
            <div
              key={i}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                borderRadius: '10px',
                padding: '1rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <h4 style={{ margin: '0 0 0.2rem', fontSize: '1rem', fontWeight: 600 }}>{c.name}</h4>
                <span style={{ fontSize: '0.78rem', color: 'var(--ink-3)' }}>
                  فئة {c.category} • تم مطابقة {c.matchedFiles} ملفات برمجية
                </span>
              </div>
              <Badge variant="proof">ثقة {c.confidence}%</Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RepoDetailPage;
