import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FolderGit2,
  Cpu,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  GitCommit,
  Layers,
  FileCode2,
  Check
} from 'lucide-react';
import { ROUTES } from '../../constants/routes';
import { Button } from '../../components/ui';
import styles from './RepoDeepInspectorPage.module.css';

export const RepoDeepInspectorPage: React.FC = () => {
  const { repoId } = useParams<{ repoId: string }>();
  const navigate = useNavigate();

  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [evidenceImported, setEvidenceImported] = useState(false);

  const repoName = repoId || 'ecommerce-microservices-fastapi';

  const handleImportEvidence = () => {
    setIsSynthesizing(true);
    setTimeout(() => {
      setIsSynthesizing(false);
      setEvidenceImported(true);
    }, 900);
  };

  return (
    <div className={styles.container} dir="rtl">
      {/* Back navigation */}
      <div style={{ marginBottom: '1.25rem' }}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(ROUTES.SOURCES)}
          leftIcon={<ArrowRight size={15} />}
        >
          العودة لمركز المصادر
        </Button>
      </div>

      {/* Header */}
      <div className={styles.headerRow}>
        <div className={styles.titleArea}>
          <h1>
            <FolderGit2 size={26} style={{ color: '#00B8B8' }} />
            الفحص المعمق لمستودع الكود (AI Deep Inspector)
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span className={styles.repoBadge}>github.com/7usseinNaser/{repoName}</span>
            <span style={{ fontSize: '0.8rem', color: '#10B981', fontWeight: 600 }}>المستوى 1: موثوقية مباشرة (100%)</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button
            variant="proof"
            size="sm"
            onClick={handleImportEvidence}
            disabled={isSynthesizing || evidenceImported}
            leftIcon={evidenceImported ? <Check size={15} /> : <Sparkles size={15} />}
          >
            {evidenceImported ? 'تم اعتماد وتثبيت الأدلة ✓' : isSynthesizing ? 'جاري التحليل واستخراج الأدلة...' : 'تثبيت الأدلة في جواز القدرات'}
          </Button>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className={styles.summaryGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span>مؤشر التعقيد الهندسي</span>
            <Cpu size={16} style={{ color: '#00B8B8' }} />
          </div>
          <div className={styles.metricValue} style={{ color: '#00B8B8' }}>88 / 100</div>
          <div className={styles.metricSub}>معمارية متقدمة + نمط عزل النطاقات (Domain-Driven)</div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span>نسبة المساهمة البرمجية الفعلية</span>
            <GitCommit size={16} style={{ color: '#10B981' }} />
          </div>
          <div className={styles.metricValue} style={{ color: '#10B981' }}>94.2%</div>
          <div className={styles.metricSub}>142 Commits بواسطة المستخدم (كود أصيل مثبت)</div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span>حجم الكود وسطور البرمجة</span>
            <FileCode2 size={16} style={{ color: '#F59E0B' }} />
          </div>
          <div className={styles.metricValue}>18,450 سطر</div>
          <div className={styles.metricSub}>Python 68%, TypeScript 24%, SQL 8%</div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span>حالة الثقة المعتمدة</span>
            <ShieldCheck size={16} style={{ color: '#00B8B8' }} />
          </div>
          <div className={styles.metricValue} style={{ color: '#00B8B8' }}>Level 1</div>
          <div className={styles.metricSub}>كود إنتاجي مباشر مفحوص برمجياً</div>
        </div>
      </div>

      {/* Two Column Section */}
      <div className={styles.splitGrid}>
        {/* Left: Code Structure Breakdown */}
        <div className={styles.cardBlock}>
          <h2 className={styles.cardBlockTitle}>
            <Layers size={18} style={{ color: '#00B8B8' }} />
            تفكيك الملفات والمسارات المفحوصة
          </h2>

          <div className={styles.fileAnalysisList}>
            <div className={styles.fileItem}>
              <div className={styles.fileName}>
                <FileCode2 size={15} /> app/routers/payments.py
              </div>
              <span style={{ fontSize: '0.78rem', color: '#10B981' }}>Idempotency Locks ✓</span>
            </div>

            <div className={styles.fileItem}>
              <div className={styles.fileName}>
                <FileCode2 size={15} /> app/db/session.py
              </div>
              <span style={{ fontSize: '0.78rem', color: '#10B981' }}>Async SQLAlchemy Engine ✓</span>
            </div>

            <div className={styles.fileItem}>
              <div className={styles.fileName}>
                <FileCode2 size={15} /> tests/test_concurrency.py
              </div>
              <span style={{ fontSize: '0.78rem', color: '#10B981' }}>96% Test Coverage ✓</span>
            </div>

            <div className={styles.fileItem}>
              <div className={styles.fileName}>
                <FileCode2 size={15} /> docker-compose.prod.yml
              </div>
              <span style={{ fontSize: '0.78rem', color: '#10B981' }}>Multi-stage Containers ✓</span>
            </div>
          </div>
        </div>

        {/* Right: AI Evidence Synthesis */}
        <div className={styles.cardBlock}>
          <h2 className={styles.cardBlockTitle}>
            <Sparkles size={18} style={{ color: '#00B8B8' }} />
            الأدلة المستخرجة تلقائياً بواسطة الذكاء الاصطناعي
          </h2>

          <p style={{ fontSize: '0.86rem', color: 'var(--ink-2)', margin: '0 0 1rem 0' }}>
            قام المحرك بتحليل الأنماط البرمجية واكتشاف القدرات التقنية التالية دون الحاجة لإدخال يدوي:
          </p>

          <div className={styles.evidenceGeneratedBox}>
            <div className={styles.evidenceHeader}>
              <strong style={{ fontSize: '0.92rem', color: '#fff' }}>دليل مثبت: Backend Architecture & Concurrency</strong>
              <span className={styles.aiTag}>AI Extracted ✓</span>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--ink-2)', margin: 0, lineHeight: 1.5 }}>
              المستودع ينفذ مسار معاملات مصرفية متزامنة مع حماية ضد الـ Race Condition ومعالجة عبر Redis Distributed Locks.
            </p>
          </div>

          <div className={styles.evidenceGeneratedBox} style={{ marginTop: '0.75rem' }}>
            <div className={styles.evidenceHeader}>
              <strong style={{ fontSize: '0.92rem', color: '#fff' }}>دليل مثبت: Database Schema Design & Indexing</strong>
              <span className={styles.aiTag}>AI Extracted ✓</span>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--ink-2)', margin: 0, lineHeight: 1.5 }}>
              تصميم قواعد بيانات PostgreSQL علائقية مع فهارس مركبّة وتطبيق هجرات Alembic المتقدمة.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
