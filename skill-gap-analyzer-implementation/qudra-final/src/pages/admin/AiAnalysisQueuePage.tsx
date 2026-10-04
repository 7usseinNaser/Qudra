import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { Badge } from '../../components/ui/Badge';
import styles from './AiAnalysisQueuePage.module.css';

interface AiJob {
  id: string;
  type: string;
  model: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  timestamp: string;
  profile: string;
}

const JOBS: AiJob[] = [
  { id: 'j1', type: 'تحليل مستودع', model: 'gemini-1.5', status: 'processing', timestamp: '10:30', profile: 'لينا الحربي' },
  { id: 'j2', type: 'تحليل قدرات', model: 'gemini-1.5', status: 'pending', timestamp: '10:25', profile: 'محمد الدوسري' },
  { id: 'j3', type: 'تحليل مشكلة', model: 'gemini-1.5', status: 'completed', timestamp: '10:00', profile: 'شركة قُدرة' },
  { id: 'j4', type: 'تحليل مستودع', model: 'gemini-1.5', status: 'failed', timestamp: '09:45', profile: 'ماجد الشمري' },
  { id: 'j5', type: 'استخراج أدلة', model: 'gemini-1.5', status: 'completed', timestamp: '09:30', profile: 'ريم القحطاني' },
];

const STATUS_VARIANT: Record<string, 'proof' | 'neutral' | 'gap'> = {
  pending: 'neutral', processing: 'gap', completed: 'proof', failed: 'neutral',
};

const STATUS_LABEL: Record<string, string> = {
  pending: 'معلّق', processing: 'قيد المعالجة', completed: 'مكتمل', failed: 'فاشل',
};

export function AiAnalysisQueuePage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<string>('all');
  const [jobs, setJobs] = useState(JOBS);

  const filtered = filter === 'all' ? jobs : jobs.filter((j) => j.status === filter);

  const handleRetry = (id: string) => {
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, status: 'processing' } : j)));
  };

  return (
    <main id="main" className="wrap" tabIndex={-1} dir="rtl" style={{ padding: 'clamp(1.5rem,4vw,2.75rem) 0 5rem' }}>
      <button className="btn ghost" onClick={() => navigate(ROUTES.ADMIN_DASHBOARD)} style={{ marginBottom: '0.8rem' }}>
        ← لوحة المشرف
      </button>
      <h1 className="scr-t">طابور التحليل الذكي</h1>
      <p className="scr-p">مراقبة مهام الذكاء الاصطناعي وحالتها.</p>

      <div className={styles.filters}>
        <button className={filter === 'all' ? styles.filterActive : styles.filter} onClick={() => setFilter('all')}>الكل</button>
        <button className={filter === 'pending' ? styles.filterActive : styles.filter} onClick={() => setFilter('pending')}>معلّق</button>
        <button className={filter === 'processing' ? styles.filterActive : styles.filter} onClick={() => setFilter('processing')}>قيد المعالجة</button>
        <button className={filter === 'completed' ? styles.filterActive : styles.filter} onClick={() => setFilter('completed')}>مكتمل</button>
        <button className={filter === 'failed' ? styles.filterActive : styles.filter} onClick={() => setFilter('failed')}>فاشل</button>
      </div>

      <div className={`box ${styles.tableWrap}`}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>النوع</th>
              <th>النموذج</th>
              <th>الحالة</th>
              <th>الملف المتأثر</th>
              <th>الوقت</th>
              <th>إجراء</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((j) => (
              <tr key={j.id}>
                <td>{j.type}</td>
                <td className={`${styles.monoCell} mono`}>{j.model}</td>
                <td><Badge variant={STATUS_VARIANT[j.status]}>{STATUS_LABEL[j.status]}</Badge></td>
                <td>{j.profile}</td>
                <td className={`${styles.monoCell} mono`}>{j.timestamp}</td>
                <td>
                  {j.status === 'failed' && (
                    <button className="btn ghost sm" onClick={() => handleRetry(j.id)}>إعادة</button>
                  )}
                  {j.status === 'pending' && (
                    <button className="btn ghost sm">بدء</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

export default AiAnalysisQueuePage;
