import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cpu, CheckCircle2, ArrowLeft } from 'lucide-react';
import { ROUTES } from '../../../constants/routes';
import { GitHubService } from '../../../services/github.service';
import { Bar } from '../../../components/ui/Bar';
import { Button } from '../../../components/ui/Button';

export const GitHubScanPage: React.FC = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(10);
  const [statusMessage, setStatusMessage] = useState('تهيئة بيئة التحليل وفحص بنية المستودع...');
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    let isMounted = true;
    GitHubService.scanSelectedRepos((p, msg) => {
      if (!isMounted) return;
      setProgress(p);
      setStatusMessage(msg);
      if (p >= 100) {
        setIsDone(true);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.25rem' }} dir="rtl">
      <div style={{
        maxWidth: '38rem',
        width: '100%',
        background: 'var(--surface)',
        border: '1px solid var(--line)',
        borderRadius: '16px',
        padding: '2.5rem 2rem',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.75rem',
        boxShadow: 'var(--shadow)'
      }}>
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: isDone ? 'var(--proof-tint)' : 'var(--surface-2)',
          color: isDone ? 'var(--proof-text)' : 'var(--proof)',
          display: 'grid',
          placeItems: 'center',
          transition: 'all 0.3s ease'
        }}>
          {isDone ? <CheckCircle2 size={40} /> : <Cpu size={38} className="spin-slow" />}
        </div>

        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, margin: '0 0 0.5rem' }}>
            {isDone ? 'اكتمل فحص الكود واستخراج الأدلة!' : 'جاري تحليل الكود عبر المحرك الدلالي...'}
          </h1>
          <p style={{ color: 'var(--ink-2)', fontSize: '0.92rem', margin: 0, minHeight: '1.5rem' }}>
            {statusMessage}
          </p>
        </div>

        <div style={{ width: '100%' }}>
          <Bar value={progress} showValue size="lg" variant="proof" />
        </div>

        {isDone && (
          <Button
            variant="proof"
            size="lg"
            fullWidth
            onClick={() => navigate(ROUTES.GITHUB_RESULTS)}
            rightIcon={<ArrowLeft size={18} />}
          >
            عرض نتائج التحليل والأدلة المستخرجة
          </Button>
        )}
      </div>
    </div>
  );
};

export default GitHubScanPage;
