import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ProjectsPortfolio.module.css';

export const ProjectCreatePage: React.FC = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [role, setRole] = useState('');
  const [description, setDescription] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [techStack, setTechStack] = useState('');
  const [contributions, setContributions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/projects/portfolio/prj-new/result?status=submitted&tier=tier2');
    }, 1000);
  };

  return (
    <div className={styles.container} data-testid="screen-q-0484">
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <span className={styles.screenBadge}>Q-0484 · إضافة مشروع</span>
          <h1 className={styles.title}>توثيق مشروع برمجي جديد في البورتفوليو</h1>
          <p className={styles.subtitle}>
            أدخل تفاصيل المشروع وروابط الإثبات لإسناده كدليل كفاءة خاضع لآلة التحقق المستقلة.
          </p>
        </div>
      </div>

      <div className={styles.formCard}>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label}>عنوان المشروع *</label>
            <input
              type="text"
              className={styles.input}
              placeholder="مثال: نظام إدارة تدفق البيانات الموزعة"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              data-testid="project-title-input"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>دورك الهندسي في المشروع *</label>
            <input
              type="text"
              className={styles.input}
              placeholder="مثال: Full-Stack Architect / Backend Lead"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              data-testid="project-role-input"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className={styles.formGroup}>
              <label className={styles.label}>رابط مستودع الكود (GitHub / GitLab) *</label>
              <input
                type="url"
                className={`${styles.input} ${styles.inputLtr}`}
                placeholder="https://github.com/username/project"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                required
                data-testid="project-repo-input"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>رابط المعاينة الحية (Live Demo URL)</label>
              <input
                type="url"
                className={`${styles.input} ${styles.inputLtr}`}
                placeholder="https://my-app.demo.io"
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
                data-testid="project-live-input"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>التقنيات واللغات المستخدمة (مفصولة بفاصلة) *</label>
            <input
              type="text"
              className={styles.input}
              placeholder="TypeScript, React, FastAPI, PostgreSQL, Docker"
              value={techStack}
              onChange={(e) => setTechStack(e.target.value)}
              required
              data-testid="project-tech-input"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>نبذة معمارية عن المشروع *</label>
            <textarea
              className={styles.textarea}
              rows={4}
              placeholder="اشرح الهدف الهندسي، التحديات التقنية التي تم التغلب عليها، والنتائج المحققة..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              data-testid="project-desc-input"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>المهام المحددة التي نفذتها شخصياً *</label>
            <textarea
              className={styles.textarea}
              rows={3}
              placeholder="أذكر أهم المساهمات والوحدات البرمجية التي برمجتها لتسهيل عملية الفحص الآلي واليدوي..."
              value={contributions}
              onChange={(e) => setContributions(e.target.value)}
              required
              data-testid="project-tasks-input"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={() => navigate('/projects/portfolio')}
            >
              إلغاء
            </button>
            <button
              type="submit"
              className={styles.primaryBtn}
              disabled={isSubmitting}
              data-testid="submit-project-btn"
            >
              {isSubmitting ? 'جاري الفحص والإسناد...' : 'إرسال المشروع لآلة التحقق 🛡️'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
