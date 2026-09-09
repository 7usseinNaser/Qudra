import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Sparkles, Upload, Trash2, X } from 'lucide-react';
import { ROUTES } from '../../constants/routes';
import { AuthService } from '../../services/auth.service';
import { QudraStore } from '../../services/store';
import { Button } from '../../components/ui/Button';
import styles from './BasicIdentityPage.module.css';

export const BasicIdentityPage: React.FC = () => {
  const navigate = useNavigate();
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    AuthService.getCurrentUser().then(u => {
      if (u.fullName) setName(u.fullName);
      if (u.headline) setHeadline(u.headline);
      if (u.bio) setBio(u.bio);
      if (u.avatarUrl) setAvatarUrl(u.avatarUrl);
    });
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setAvatarUrl(result);
      QudraStore.updateUser({ avatarUrl: result });
      setShowAvatarModal(false);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setAvatarUrl(undefined);
    QudraStore.updateUser({ avatarUrl: undefined });
    setShowAvatarModal(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await AuthService.completeBasicIdentity({
        headline: headline.trim() || 'مطور برمجيات',
        bio: bio.trim() || 'مهتم ببناء وإثبات الكفاءات التقنية الحقيقية.',
        avatarUrl
      });
      navigate(ROUTES.ONBOARDING_INTENT);
    } catch {
      navigate(ROUTES.ONBOARDING_INTENT);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container} dir="rtl">
      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <input
        type="file"
        ref={cameraInputRef}
        accept="image/*"
        capture="user"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* Avatar Options Modal */}
      {showAvatarModal && (
        <div className={styles.modalOverlay} onClick={() => setShowAvatarModal(false)}>
          <div className={styles.modalBox} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>تحديد الصورة الرمزية</h3>
              <button
                type="button"
                className={styles.modalClose}
                onClick={() => setShowAvatarModal(false)}
                aria-label="إغلاق"
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--ink-2)' }}>
              اختر الطريقة التي تفضلها لإضافة صورتك المهنية:
            </p>

            <div className={styles.modalOptions}>
              <button
                type="button"
                className={styles.modalOptionBtn}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={20} color="var(--proof-text)" />
                <span>تحميل صورة من جهازك</span>
              </button>

              <button
                type="button"
                className={styles.modalOptionBtn}
                onClick={() => cameraInputRef.current?.click()}
              >
                <Camera size={20} color="var(--proof-text)" />
                <span>التقاط صورة بالكاميرا</span>
              </button>

              {avatarUrl && (
                <button
                  type="button"
                  className={styles.modalOptionBtn}
                  style={{ color: 'var(--danger)' }}
                  onClick={handleRemoveAvatar}
                >
                  <Trash2 size={20} />
                  <span>إزالة الصورة والاعتماد على الأحرف الأولى</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className={styles.card}>
        <span className={styles.stepTag}>الخطوة 2 من 3 • تعريف الهوية</span>

        <div>
          <h1 className={styles.title}>عرّف عن هويتك المهنية يا {name || 'صديقنا'}</h1>
          <p className={styles.description}>
            في قُدرة، نعتمد على الكود الحقيقي والأدلة، ولكن مسماك وشغفك يعطي سياقاً لملفك المهاري.
          </p>
        </div>

        <div className={styles.avatarSection}>
          <div
            className={styles.avatarPreview}
            title="انقر لتغيير الصورة"
            onClick={() => setShowAvatarModal(true)}
            role="button"
            tabIndex={0}
            onKeyDown={e => { if (e.key === 'Enter') setShowAvatarModal(true); }}
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt={name} className={styles.avatarImg} />
            ) : (
              <Camera size={26} color="var(--proof-text)" />
            )}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h4 style={{ margin: 0, fontSize: '0.96rem', fontWeight: 700 }}>الصورة الرمزية</h4>
              <button
                type="button"
                onClick={() => setShowAvatarModal(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--proof-text)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                (تغيير أو التقاط 📸)
              </button>
            </div>
            <span className={styles.hint}>
              انقر على الدائرة لاختيار صورة من جهازك أو التقاطها فوراً بالكاميرا.
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className={styles.field}>
            <label htmlFor="headline">المسمى المهني والتخصص الرئيسي</label>
            <input
              id="headline"
              type="text"
              placeholder="مثال: مهندس برمجيات نظم موزعة | خبير قواعد بيانات"
              value={headline}
              onChange={e => setHeadline(e.target.value)}
              required
            />
            <span className={styles.hint}>سيظهر هذا السطر في أعلى ملفك الرئيسي ونتائج البحث.</span>
          </div>

          <div className={styles.field}>
            <label htmlFor="bio">نبذة مختصرة (Bio)</label>
            <textarea
              id="bio"
              rows={3}
              placeholder="اكتب باختصار عن مجالات شغفك، المشكلات التي تحب حلها، أو طموحك التقني..."
              value={bio}
              onChange={e => setBio(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            variant="proof"
            size="md"
            loading={loading}
            fullWidth
            rightIcon={<Sparkles size={16} />}
          >
            حفظ والمتابعة لتحديد الهدف
          </Button>
        </form>
      </div>
    </div>
  );
};

export default BasicIdentityPage;
