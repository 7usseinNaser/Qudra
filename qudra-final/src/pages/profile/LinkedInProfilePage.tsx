import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  GraduationCap,
  Award,
  FolderGit2,
  Cpu,
  Plus,
  Edit2,
  Trash2,
  MapPin,
  Globe,
  ShieldCheck,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  X,
  Share2,
  Camera,
  Upload,
  RefreshCw,
  Check,
  AlertCircle
} from 'lucide-react';
import { ROUTES } from '../../constants/routes';
import {
  ProfileEditorService,
  EditableProfileData,
  type WorkExperience
} from '../../services/profile-editor.service';
import { GitHubService } from '../../services/github.service';
import { Button, GithubIcon, LinkedinIcon } from '../../components/ui';
import styles from './LinkedInProfilePage.module.css';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&h=400&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=400&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&h=400&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&h=400&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&h=400&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&h=400&q=80'
];

const BANNER_PRESETS = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&h=450&q=80',
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1600&h=450&q=80',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1600&h=450&q=80',
  'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1600&h=450&q=80',
  'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=1600&h=450&q=80',
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1600&h=450&q=80'
];

export const LinkedInProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<EditableProfileData>(ProfileEditorService.getProfile());

  // Modal states
  const [activeModal, setActiveModal] = useState<
    'basic' | 'exp' | 'edu' | 'cert' | 'proj' | 'skill' | 'avatar' | 'banner' | 'github-sync' | null
  >(null);
  const [editingExpId, setEditingExpId] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [skillFilter, setSkillFilter] = useState<'all' | 'proven' | 'claimed'>('all');

  // Sync notification toast
  const [syncToast, setSyncToast] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'loading';
  }>({
    show: false,
    message: '',
    type: 'success'
  });

  // Avatar & Banner input states
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [customBannerUrl, setCustomBannerUrl] = useState('');
  const avatarFileInputRef = useRef<HTMLInputElement | null>(null);
  const bannerFileInputRef = useRef<HTMLInputElement | null>(null);

  // GitHub sync states
  const [syncUsername, setSyncUsername] = useState(profile.githubUsername || '7usseinNaser');
  const [isSyncingGitHub, setIsSyncingGitHub] = useState(false);

  // Form states for modals
  const [basicForm, setBasicForm] = useState({
    fullName: profile.fullName,
    headline: profile.headline,
    bio: profile.bio,
    location: profile.location,
    websiteUrl: profile.websiteUrl || '',
    githubUsername: profile.githubUsername || '',
    linkedinUrl: profile.linkedinUrl || '',
    openToWork: profile.openToWork
  });

  const [expForm, setExpForm] = useState({
    title: '',
    company: '',
    employmentType: 'دوام كامل' as WorkExperience['employmentType'],
    location: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    description: '',
    skillsStr: ''
  });

  const [eduForm, setEduForm] = useState({
    school: '',
    degree: '',
    fieldOfStudy: '',
    startDate: '',
    endDate: '',
    grade: '',
    description: ''
  });

  const [certForm, setCertForm] = useState({
    name: '',
    issuingOrg: '',
    issueDate: '',
    credentialId: '',
    credentialUrl: ''
  });

  const [projForm, setProjForm] = useState({
    title: '',
    description: '',
    githubUrl: '',
    url: '',
    technologiesStr: '',
    role: ''
  });

  const [newSkillName, setNewSkillName] = useState('');

  // ----------------------------------------------------
  // Handlers
  // ----------------------------------------------------

  const showToast = (message: string, type: 'success' | 'error' | 'loading' = 'success', duration = 4000) => {
    setSyncToast({ show: true, message, type });
    if (duration > 0) {
      setTimeout(() => {
        setSyncToast(prev => ({ ...prev, show: false }));
      }, duration);
    }
  };

  const handleSaveBasic = () => {
    const updated = ProfileEditorService.updateBasicInfo(basicForm);
    setProfile(updated);
    setActiveModal(null);
    showToast('تم تحديث البيانات الأساسية بنجاح وحفظها في قاعدة البيانات.');
  };

  // Avatar Handlers
  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('يرجى اختيار ملف صورة صالح (PNG, JPG, WebP)', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const updated = ProfileEditorService.updateAvatar(reader.result);
        setProfile(updated);
        setActiveModal(null);
        showToast('تم تغيير صورتك الشخصية بنجاح!');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSelectAvatarPreset = (url: string) => {
    const updated = ProfileEditorService.updateAvatar(url);
    setProfile(updated);
    setActiveModal(null);
    showToast('تم تطبيق الصورة الرمزية المختارة!');
  };

  const handleApplyCustomAvatar = () => {
    if (!customAvatarUrl.trim()) return;
    const updated = ProfileEditorService.updateAvatar(customAvatarUrl.trim());
    setProfile(updated);
    setCustomAvatarUrl('');
    setActiveModal(null);
    showToast('تم تحديث الصورة الشخصية من الرابط!');
  };

  // Banner Handlers
  const handleBannerFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('يرجى اختيار ملف صورة صالح (PNG, JPG, WebP)', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const updated = ProfileEditorService.updateBanner(reader.result);
        setProfile(updated);
        setActiveModal(null);
        showToast('تم تغيير غلاف الحساب (البنر) بنجاح!');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSelectBannerPreset = (url: string) => {
    const updated = ProfileEditorService.updateBanner(url);
    setProfile(updated);
    setActiveModal(null);
    showToast('تم تطبيق غلاف الحساب المختار!');
  };

  const handleApplyCustomBanner = () => {
    if (!customBannerUrl.trim()) return;
    const updated = ProfileEditorService.updateBanner(customBannerUrl.trim());
    setProfile(updated);
    setCustomBannerUrl('');
    setActiveModal(null);
    showToast('تم تحديث غلاف الحساب بنجاح!');
  };

  // Live GitHub Sync Handler
  const handleSyncGitHubNow = async (usernameToSync = profile.githubUsername || '7usseinNaser') => {
    if (!usernameToSync.trim()) {
      showToast('يرجى كتابة اسم مستخدم GitHub للمزامنة', 'error');
      return;
    }

    setIsSyncingGitHub(true);
    showToast(`جارٍ الاتصال الحقيقي بـ GitHub API لحساب @${usernameToSync}...`, 'loading', 0);

    try {
      const repos = await GitHubService.fetchRealUserRepos(usernameToSync);
      const updated = ProfileEditorService.importGitHubReposAsProjects(repos);
      // Also update username if changed
      if (profile.githubUsername !== usernameToSync) {
        ProfileEditorService.updateBasicInfo({ githubUsername: usernameToSync });
      }
      setProfile({ ...updated, githubUsername: usernameToSync });
      setActiveModal(null);
      showToast(`تمت مزامنة ${repos.length} مستودعاً حقيقياً من GitHub وإضافتها لمشاريعك وأدلة مهاراتك بنجاح!`, 'success', 5000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'فشلت مزامنة مستودعات GitHub';
      showToast(msg, 'error', 5000);
    } finally {
      setIsSyncingGitHub(false);
    }
  };

  // Experience handlers
  const handleOpenAddExp = () => {
    setEditingExpId(null);
    setExpForm({
      title: '',
      company: '',
      employmentType: 'دوام كامل',
      location: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      description: '',
      skillsStr: ''
    });
    setActiveModal('exp');
  };

  const handleOpenEditExp = (exp: WorkExperience) => {
    setEditingExpId(exp.id);
    setExpForm({
      title: exp.title,
      company: exp.company,
      employmentType: exp.employmentType,
      location: exp.location,
      startDate: exp.startDate,
      endDate: exp.endDate,
      isCurrent: exp.isCurrent,
      description: exp.description,
      skillsStr: exp.skills.join(', ')
    });
    setActiveModal('exp');
  };

  const handleSaveExp = () => {
    const skills = expForm.skillsStr
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    if (editingExpId) {
      const updated = ProfileEditorService.updateExperience(editingExpId, {
        title: expForm.title,
        company: expForm.company,
        employmentType: expForm.employmentType,
        location: expForm.location,
        startDate: expForm.startDate,
        endDate: expForm.endDate,
        isCurrent: expForm.isCurrent,
        description: expForm.description,
        skills
      });
      setProfile(updated);
    } else {
      const updated = ProfileEditorService.addExperience({
        title: expForm.title,
        company: expForm.company,
        employmentType: expForm.employmentType,
        location: expForm.location,
        startDate: expForm.startDate,
        endDate: expForm.endDate,
        isCurrent: expForm.isCurrent,
        description: expForm.description,
        skills,
        isVerified: true
      });
      setProfile(updated);
    }
    setActiveModal(null);
    showToast('تم حفظ تفاصيل الخبرة المهنية بنجاح.');
  };

  const handleDeleteExp = (id: string) => {
    const updated = ProfileEditorService.deleteExperience(id);
    setProfile(updated);
    showToast('تم حذف الخبرة المهنية.');
  };

  // Education handlers
  const handleSaveEdu = () => {
    const updated = ProfileEditorService.addEducation({
      school: eduForm.school,
      degree: eduForm.degree,
      fieldOfStudy: eduForm.fieldOfStudy,
      startDate: eduForm.startDate,
      endDate: eduForm.endDate,
      grade: eduForm.grade,
      description: eduForm.description,
      isVerified: true
    });
    setProfile(updated);
    setActiveModal(null);
    showToast('تمت إضافة المؤهل التعليمي بنجاح.');
  };

  const handleDeleteEdu = (id: string) => {
    const updated = ProfileEditorService.deleteEducation(id);
    setProfile(updated);
  };

  // Certification handlers
  const handleSaveCert = () => {
    const updated = ProfileEditorService.addCertification({
      name: certForm.name,
      issuingOrg: certForm.issuingOrg,
      issueDate: certForm.issueDate,
      credentialId: certForm.credentialId,
      credentialUrl: certForm.credentialUrl,
      isVerified: true
    });
    setProfile(updated);
    setActiveModal(null);
    showToast('تمت إضافة الشهادة المهنية بنجاح.');
  };

  const handleDeleteCert = (id: string) => {
    const updated = ProfileEditorService.deleteCertification(id);
    setProfile(updated);
  };

  // Project handlers
  const handleSaveProj = () => {
    const technologies = projForm.technologiesStr
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const updated = ProfileEditorService.addProject({
      title: projForm.title,
      description: projForm.description,
      githubUrl: projForm.githubUrl,
      url: projForm.url,
      technologies,
      role: projForm.role,
      isVerified: true
    });
    setProfile(updated);
    setActiveModal(null);
    showToast('تمت إضافة المشروع بنجاح إلى ملفك الشخصي.');
  };

  const handleDeleteProj = (id: string) => {
    const updated = ProfileEditorService.deleteProject(id);
    setProfile(updated);
  };

  // Skills handlers
  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    const updated = ProfileEditorService.addSkill(newSkillName.trim());
    setProfile(updated);
    setNewSkillName('');
    setActiveModal(null);
    showToast(`تمت إضافة المهارة "${newSkillName.trim()}" (Claimed).`);
  };

  const handleDeleteSkill = (id: string) => {
    const updated = ProfileEditorService.deleteSkill(id);
    setProfile(updated);
  };

  const handleShareProfile = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    showToast('تم نسخ رابط بروفايلك للمشاركة!');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Filter skills
  const provenSkills = profile.skills.filter(s => s.isProven);
  const claimedSkills = profile.skills.filter(s => !s.isProven);
  const displayedSkills =
    skillFilter === 'proven'
      ? provenSkills
      : skillFilter === 'claimed'
      ? claimedSkills
      : profile.skills;

  return (
    <div className={styles.container}>
      {/* Real-Time Sync Toast */}
      {syncToast.show && (
        <div className={styles.syncToast}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            {syncToast.type === 'loading' && <RefreshCw size={18} className="spin" style={{ color: '#00B8B8' }} />}
            {syncToast.type === 'success' && <CheckCircle2 size={18} style={{ color: '#10B981' }} />}
            {syncToast.type === 'error' && <AlertCircle size={18} style={{ color: '#EF4444' }} />}
            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{syncToast.message}</span>
          </div>
          <button
            onClick={() => setSyncToast(prev => ({ ...prev, show: false }))}
            style={{ background: 'none', border: 'none', color: 'var(--ink-2)', cursor: 'pointer' }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Hidden File Inputs for Avatar and Banner */}
      <input
        type="file"
        ref={avatarFileInputRef}
        onChange={handleAvatarFileChange}
        accept="image/*"
        style={{ display: 'none' }}
      />
      <input
        type="file"
        ref={bannerFileInputRef}
        onChange={handleBannerFileChange}
        accept="image/*"
        style={{ display: 'none' }}
      />

      {/* Top Hero Card */}
      <div className={styles.heroCard}>
        <div
          className={styles.banner}
          style={{ backgroundImage: `url(${profile.bannerUrl})` }}
        >
          <div className={styles.bannerOverlay} />
          <button
            className={styles.bannerEditBtn}
            onClick={() => setActiveModal('banner')}
            title="تغيير البنر الخلفي"
          >
            <Camera size={14} /> تغيير غلاف الحساب
          </button>
        </div>

        <div className={styles.avatarWrapper} onClick={() => setActiveModal('avatar')}>
          <img src={profile.avatarUrl} alt={profile.fullName} className={styles.avatar} />
          <button
            className={styles.avatarOverlayBtn}
            title="تغيير الصورة الشخصية"
          >
            <Camera size={20} />
            <span>تغيير</span>
          </button>
        </div>

        <div className={styles.heroBody}>
          <div className={styles.topActions}>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShareProfile}
              leftIcon={<Share2 size={15} />}
            >
              {copiedLink ? 'تم نسخ الرابط!' : 'مشاركة'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setBasicForm({
                  fullName: profile.fullName,
                  headline: profile.headline,
                  bio: profile.bio,
                  location: profile.location,
                  websiteUrl: profile.websiteUrl || '',
                  githubUsername: profile.githubUsername || '',
                  linkedinUrl: profile.linkedinUrl || '',
                  openToWork: profile.openToWork
                });
                setActiveModal('basic');
              }}
              leftIcon={<Edit2 size={15} />}
            >
              تعديل البيانات الأساسية
            </Button>
            <Button
              variant="proof"
              size="sm"
              onClick={() => navigate(ROUTES.PASSPORT || '/passport')}
              leftIcon={<Sparkles size={15} />}
            >
              عرض جواز القدرات (Passport)
            </Button>
          </div>

          <div className={styles.nameRow}>
            <h1 className={styles.fullName}>{profile.fullName}</h1>
            <span className={styles.verifiedBadge}>
              <ShieldCheck size={14} /> مهندس معتمد بالأدلة
            </span>
          </div>

          <p className={styles.headline}>{profile.headline}</p>

          <div className={styles.locationRow}>
            <span className={styles.locationItem}>
              <MapPin size={15} /> {profile.location}
            </span>
            {profile.websiteUrl && (
              <a href={profile.websiteUrl} target="_blank" rel="noreferrer" className={styles.locationItem} style={{ color: '#00B8B8' }}>
                <Globe size={15} /> موقعي الشخصي
              </a>
            )}
            {profile.githubUsername && (
              <a href={`https://github.com/${profile.githubUsername}`} target="_blank" rel="noreferrer" className={styles.locationItem} style={{ color: '#F1F5F9' }}>
                <GithubIcon size={15} /> @{profile.githubUsername}
              </a>
            )}
            {profile.linkedinUrl && (
              <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className={styles.locationItem} style={{ color: '#0A66C2' }}>
                <LinkedinIcon size={15} /> لينكد إن
              </a>
            )}
          </div>

          {profile.openToWork && (
            <div className={styles.openToWorkBox}>
              <div>
                <div className={styles.openToWorkTitle}>
                  <CheckCircle2 size={16} /> متاح لفرص العمل والتحديات التقنية (Open to Work)
                </div>
                <div className={styles.openToWorkSubtitle}>
                  مستعد للمشاركة في حل مشكلات الشركات والعمل كمهندس برمجيات وذكاء اصطناعي.
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(ROUTES.OPPORTUNITIES || '/opportunities')}
              >
                استكشاف الفرص المتطابقة
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Quick Metrics Strip */}
      <div className={styles.statsStrip}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <ShieldCheck size={22} />
          </div>
          <div>
            <div className={styles.statVal}>88%</div>
            <div className={styles.statLabel}>الموثوقية الهندسية المعتمدة</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ color: '#10B981', background: 'rgba(16, 185, 129, 0.1)' }}>
            <Sparkles size={22} />
          </div>
          <div>
            <div className={styles.statVal}>{provenSkills.length} مهارات</div>
            <div className={styles.statLabel}>مثبتة بأدلة برمجية حقيقية</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ color: '#06B6D4', background: 'rgba(6, 182, 212, 0.1)' }}>
            <FolderGit2 size={22} />
          </div>
          <div>
            <div className={styles.statVal}>{profile.projects.length} مشاريع</div>
            <div className={styles.statLabel}>أعمال مميزة في البورتفوليو</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ color: '#F59E0B', background: 'rgba(245, 158, 11, 0.1)' }}>
            <Award size={22} />
          </div>
          <div>
            <div className={styles.statVal}>{profile.certifications.length} شهادات</div>
            <div className={styles.statLabel}>تراخيص مهنية معتمدة</div>
          </div>
        </div>
      </div>

      {/* Live GitHub Integration & Sync Bar */}
      <div className={styles.githubSyncCard}>
        <div className={styles.githubSyncInfo}>
          <div className={styles.githubIconBox}>
            <GithubIcon size={24} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.96rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              الاتصال الحي بمستودعات GitHub
              <span className={styles.verifiedBadge} style={{ fontSize: '0.72rem', padding: '0.1rem 0.5rem' }}>
                <Check size={12} /> متصل مباشر
              </span>
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--ink-2)', marginTop: '0.2rem' }}>
              الحساب المرتبط: <strong>@{profile.githubUsername || '7usseinNaser'}</strong> · يسحب تلقائياً المشاريع والمساهمات ويثبت مهاراتك.
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveModal('github-sync')}
            leftIcon={<RefreshCw size={14} className={isSyncingGitHub ? 'spin' : ''} />}
          >
            تغيير الحساب أو إعادة المزامنة
          </Button>
          <Button
            variant="proof"
            size="sm"
            onClick={() => handleSyncGitHubNow(profile.githubUsername || '7usseinNaser')}
            disabled={isSyncingGitHub}
            leftIcon={<RefreshCw size={14} className={isSyncingGitHub ? 'spin' : ''} />}
          >
            {isSyncingGitHub ? 'جارٍ السحب الفعلي...' : 'مزامنة مستودعاتي الآن ⚡'}
          </Button>
        </div>
      </div>

      {/* About Section */}
      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitleGroup}>
            <div className={styles.sectionIcon}>
              <Sparkles size={18} />
            </div>
            <h2 className={styles.sectionTitle}>نبذة تعريفية (About)</h2>
          </div>
          <button
            className={styles.iconBtn}
            title="تعديل النبذة"
            onClick={() => {
              setBasicForm({
                fullName: profile.fullName,
                headline: profile.headline,
                bio: profile.bio,
                location: profile.location,
                websiteUrl: profile.websiteUrl || '',
                githubUsername: profile.githubUsername || '',
                linkedinUrl: profile.linkedinUrl || '',
                openToWork: profile.openToWork
              });
              setActiveModal('basic');
            }}
          >
            <Edit2 size={16} />
          </button>
        </div>
        <p className={styles.bioText}>{profile.bio}</p>
      </div>

      {/* Experience Section */}
      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitleGroup}>
            <div className={styles.sectionIcon}>
              <Briefcase size={18} />
            </div>
            <h2 className={styles.sectionTitle}>الخبرات المهنية (Experience)</h2>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleOpenAddExp}
            leftIcon={<Plus size={15} />}
          >
            إضافة خبرة
          </Button>
        </div>

        <div className={styles.itemList}>
          {profile.experiences.map(exp => (
            <div key={exp.id} className={styles.itemRow}>
              <div className={styles.itemContent}>
                <div className={styles.itemTitle}>
                  {exp.title}
                  {exp.isVerified && (
                    <span className={styles.verifiedBadge} style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem' }}>
                      <CheckCircle2 size={12} /> موثق في قُدرة
                    </span>
                  )}
                </div>
                <div className={styles.itemCompany}>
                  {exp.company} · <span style={{ fontWeight: 400 }}>{exp.employmentType}</span>
                </div>
                <div className={styles.itemMeta}>
                  {exp.startDate} – {exp.isCurrent ? 'حتى الآن' : exp.endDate} · {exp.location}
                </div>
                <p className={styles.itemDesc}>{exp.description}</p>
                {exp.skills.length > 0 && (
                  <div className={styles.techPills}>
                    {exp.skills.map((skill, idx) => (
                      <span key={idx} className={styles.techPill}>{skill}</span>
                    ))}
                  </div>
                )}
              </div>
              <div className={styles.itemActions}>
                <button
                  className={styles.iconBtn}
                  title="تعديل"
                  onClick={() => handleOpenEditExp(exp)}
                >
                  <Edit2 size={15} />
                </button>
                <button
                  className={`${styles.iconBtn} ${styles.danger}`}
                  title="حذف"
                  onClick={() => handleDeleteExp(exp.id)}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Projects Section */}
      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitleGroup}>
            <div className={styles.sectionIcon}>
              <FolderGit2 size={18} />
            </div>
            <div>
              <h2 className={styles.sectionTitle}>المشاريع المميزة (Featured Projects)</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--ink-2)', margin: 0 }}>
                مشاريع حقيقية متصلة بكود مصدري ومثبتة عبر نظام Evidence Engine
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSyncGitHubNow(profile.githubUsername || '7usseinNaser')}
              leftIcon={<RefreshCw size={13} className={isSyncingGitHub ? 'spin' : ''} />}
            >
              سحب من GitHub
            </Button>
            <Button
              variant="proof"
              size="sm"
              onClick={() => {
                setProjForm({
                  title: '',
                  description: '',
                  githubUrl: '',
                  url: '',
                  technologiesStr: '',
                  role: ''
                });
                setActiveModal('proj');
              }}
              leftIcon={<Plus size={15} />}
            >
              إضافة مشروع يدوياً
            </Button>
          </div>
        </div>

        <div className={styles.itemList}>
          {profile.projects.map(proj => (
            <div key={proj.id} className={styles.itemRow}>
              <div className={styles.itemContent}>
                <div className={styles.itemTitle}>
                  {proj.title}
                  {proj.role && <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--ink-2)' }}>({proj.role})</span>}
                  {proj.isVerified && (
                    <span className={styles.verifiedBadge} style={{ fontSize: '0.68rem', padding: '0.1rem 0.4rem' }}>
                      <ShieldCheck size={11} /> دليل برمجي معتمد
                    </span>
                  )}
                </div>
                <p className={styles.itemDesc}>{proj.description}</p>
                <div className={styles.techPills} style={{ marginBottom: '0.6rem' }}>
                  {proj.technologies.map((tech, idx) => (
                    <span key={idx} className={styles.techPill}>{tech}</span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.82rem', flexWrap: 'wrap' }}>
                  {proj.githubUrl && (
                    <a href={proj.githubUrl} target="_blank" rel="noreferrer" style={{ color: '#00B8B8', display: 'flex', alignItems: 'center', gap: '0.35rem', textDecoration: 'none' }}>
                      <GithubIcon size={14} /> كود المشروع على GitHub
                    </a>
                  )}
                  {proj.url && (
                    <a href={proj.url} target="_blank" rel="noreferrer" style={{ color: '#00B8B8', display: 'flex', alignItems: 'center', gap: '0.35rem', textDecoration: 'none' }}>
                      <ExternalLink size={14} /> المعاينة الحية
                    </a>
                  )}
                  <button
                    onClick={() => navigate(`/evidence/github/inspector?repo=${encodeURIComponent(proj.title)}`)}
                    style={{ background: 'none', border: 'none', color: '#CBD5E1', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.82rem', padding: 0 }}
                  >
                    <Sparkles size={13} style={{ color: '#00B8B8' }} /> فحص التعقيد البرمجي
                  </button>
                </div>
              </div>
              <div className={styles.itemActions}>
                <button
                  className={`${styles.iconBtn} ${styles.danger}`}
                  title="حذف المشروع"
                  onClick={() => handleDeleteProj(proj.id)}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skills & Evidence Section */}
      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitleGroup}>
            <div className={styles.sectionIcon}>
              <Cpu size={18} />
            </div>
            <div>
              <h2 className={styles.sectionTitle}>المهارات والقدرات (Skills & Evidence)</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--ink-2)', margin: 0 }}>
                تصنيف المهارات حسب معيار قُدرة: المهارات المثبتة (Proven) مقابل المدعاة (Claimed)
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveModal('skill')}
            leftIcon={<Plus size={15} />}
          >
            إضافة مهارة
          </Button>
        </div>

        {/* Skills Filter Tabs */}
        <div className={styles.skillsFilterRow}>
          <button
            className={`${styles.filterTab} ${skillFilter === 'all' ? styles.active : ''}`}
            onClick={() => setSkillFilter('all')}
          >
            جميع المهارات ({profile.skills.length})
          </button>
          <button
            className={`${styles.filterTab} ${skillFilter === 'proven' ? styles.active : ''}`}
            onClick={() => setSkillFilter('proven')}
          >
            <span className={styles.provenDot} /> المثبتة بأدلة ({provenSkills.length})
          </button>
          <button
            className={`${styles.filterTab} ${skillFilter === 'claimed' ? styles.active : ''}`}
            onClick={() => setSkillFilter('claimed')}
          >
            <span className={styles.claimedDot} /> ادعاءات ذاتية ({claimedSkills.length})
          </button>
        </div>

        <div className={styles.skillsGrid}>
          {displayedSkills.map(skill => (
            <div key={skill.id} className={styles.skillCard}>
              <div style={{ flex: 1 }}>
                <div className={styles.skillName}>
                  <span className={skill.isProven ? styles.provenDot : styles.claimedDot} />
                  {skill.name}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
                  <span style={{ fontSize: '0.74rem', color: skill.isProven ? '#00B8B8' : '#F59E0B', fontWeight: 600 }}>
                    {skill.isProven ? `✓ مثبتة (${skill.evidenceCount || 1} أدلة)` : 'ادعاء ذاتي'}
                  </span>
                  {!skill.isProven && (
                    <button
                      onClick={() => navigate('/challenges/sandbox')}
                      style={{
                        background: 'rgba(245, 158, 11, 0.1)',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                        borderRadius: '6px',
                        color: '#F59E0B',
                        fontSize: '0.68rem',
                        padding: '0.1rem 0.4rem',
                        cursor: 'pointer'
                      }}
                      title="حل تحدي تقني لتحويل المهارة إلى Proven"
                    >
                      إثبات الآن ⚡
                    </button>
                  )}
                </div>
              </div>
              <button
                className={`${styles.iconBtn} ${styles.danger}`}
                title="حذف المهارة"
                onClick={() => handleDeleteSkill(skill.id)}
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Education Section */}
      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitleGroup}>
            <div className={styles.sectionIcon}>
              <GraduationCap size={18} />
            </div>
            <h2 className={styles.sectionTitle}>التعليم والمؤهلات (Education)</h2>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setEduForm({
                school: '',
                degree: '',
                fieldOfStudy: '',
                startDate: '',
                endDate: '',
                grade: '',
                description: ''
              });
              setActiveModal('edu');
            }}
            leftIcon={<Plus size={15} />}
          >
            إضافة مؤهل
          </Button>
        </div>

        <div className={styles.itemList}>
          {profile.education.map(edu => (
            <div key={edu.id} className={styles.itemRow}>
              <div className={styles.itemContent}>
                <div className={styles.itemTitle}>{edu.school}</div>
                <div className={styles.itemCompany}>{edu.degree} · {edu.fieldOfStudy}</div>
                <div className={styles.itemMeta}>
                  {edu.startDate} – {edu.endDate} {edu.grade ? `· الدرجة: ${edu.grade}` : ''}
                </div>
                {edu.description && <p className={styles.itemDesc}>{edu.description}</p>}
              </div>
              <div className={styles.itemActions}>
                <button
                  className={`${styles.iconBtn} ${styles.danger}`}
                  title="حذف"
                  onClick={() => handleDeleteEdu(edu.id)}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Certifications Section */}
      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitleGroup}>
            <div className={styles.sectionIcon}>
              <Award size={18} />
            </div>
            <h2 className={styles.sectionTitle}>الشهادات والتراخيص (Licenses & Certifications)</h2>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setCertForm({
                name: '',
                issuingOrg: '',
                issueDate: '',
                credentialId: '',
                credentialUrl: ''
              });
              setActiveModal('cert');
            }}
            leftIcon={<Plus size={15} />}
          >
            إضافة شهادة
          </Button>
        </div>

        <div className={styles.itemList}>
          {profile.certifications.map(cert => (
            <div key={cert.id} className={styles.itemRow}>
              <div className={styles.itemContent}>
                <div className={styles.itemTitle}>
                  {cert.name}
                  {cert.isVerified && (
                    <span className={styles.verifiedBadge} style={{ fontSize: '0.7rem' }}>
                      <CheckCircle2 size={12} /> شهادة موثقة
                    </span>
                  )}
                </div>
                <div className={styles.itemCompany}>{cert.issuingOrg}</div>
                <div className={styles.itemMeta}>تاريخ الإصدار: {cert.issueDate}</div>
                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: '0.82rem', color: '#00B8B8', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.3rem', textDecoration: 'none' }}
                  >
                    عرض الشهادة الرسمية <ExternalLink size={12} />
                  </a>
                )}
              </div>
              <div className={styles.itemActions}>
                <button
                  className={`${styles.iconBtn} ${styles.danger}`}
                  title="حذف"
                  onClick={() => handleDeleteCert(cert.id)}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= MODALS ================= */}

      {/* Avatar Customization Modal */}
      {activeModal === 'avatar' && (
        <div className={styles.modalOverlay} onClick={() => setActiveModal(null)}>
          <div className={styles.modalBox} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>تغيير الصورة الشخصية</h3>
              <button className={styles.iconBtn} onClick={() => setActiveModal(null)}><X size={18} /></button>
            </div>
            <div className={styles.modalBody}>
              {/* Current Preview */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.25rem' }}>
                <img
                  src={profile.avatarUrl}
                  alt="Avatar Preview"
                  style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #00B8B8' }}
                />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>معاينة صورتك الحالية</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--ink-2)' }}>يمكنك رفع صورة من جهازك أو اختيار صورة رمزية حديثة.</div>
                </div>
              </div>

              {/* Upload from PC */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>رفع صورة من جهازك</label>
                <div
                  className={styles.uploadTrigger}
                  onClick={() => avatarFileInputRef.current?.click()}
                >
                  <Upload size={20} style={{ color: '#00B8B8' }} />
                  <span>انقر لاختيار ملف صورة من حاسوبك (PNG, JPG, WebP)</span>
                </div>
              </div>

              {/* Presets */}
              <div className={styles.formGroup} style={{ marginTop: '1.25rem' }}>
                <label className={styles.formLabel}>أو اختر من النماذج الاحترافية الجاهزة:</label>
                <div className={styles.avatarPresetGrid}>
                  {AVATAR_PRESETS.map((preset, idx) => (
                    <img
                      key={idx}
                      src={preset}
                      alt={`Avatar Preset ${idx}`}
                      className={`${styles.avatarThumb} ${profile.avatarUrl === preset ? styles.selected : ''}`}
                      onClick={() => handleSelectAvatarPreset(preset)}
                    />
                  ))}
                </div>
              </div>

              {/* Direct URL */}
              <div className={styles.formGroup} style={{ marginTop: '1.25rem' }}>
                <label className={styles.formLabel}>أو أدخل رابط صورة مباشر (URL):</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="url"
                    className={styles.formInput}
                    placeholder="https://example.com/avatar.jpg"
                    value={customAvatarUrl}
                    onChange={e => setCustomAvatarUrl(e.target.value)}
                  />
                  <Button variant="proof" size="sm" onClick={handleApplyCustomAvatar} disabled={!customAvatarUrl.trim()}>
                    تطبيق
                  </Button>
                </div>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <Button variant="ghost" size="sm" onClick={() => setActiveModal(null)}>إغلاق</Button>
            </div>
          </div>
        </div>
      )}

      {/* Banner Customization Modal */}
      {activeModal === 'banner' && (
        <div className={styles.modalOverlay} onClick={() => setActiveModal(null)}>
          <div className={styles.modalBox} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>تغيير غلاف الحساب (Banner)</h3>
              <button className={styles.iconBtn} onClick={() => setActiveModal(null)}><X size={18} /></button>
            </div>
            <div className={styles.modalBody}>
              {/* Current Preview */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--ink-2)', marginBottom: '0.4rem' }}>
                  معاينة الغلاف الحالي:
                </div>
                <div
                  style={{
                    height: '110px',
                    borderRadius: '12px',
                    backgroundImage: `url(${profile.bannerUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    border: '1px solid rgba(255, 255, 255, 0.15)'
                  }}
                />
              </div>

              {/* Upload from PC */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>رفع غلاف من جهازك</label>
                <div
                  className={styles.uploadTrigger}
                  onClick={() => bannerFileInputRef.current?.click()}
                >
                  <Upload size={20} style={{ color: '#00B8B8' }} />
                  <span>انقر لاختيار صورة غلاف عريضة من حاسوبك</span>
                </div>
              </div>

              {/* Presets */}
              <div className={styles.formGroup} style={{ marginTop: '1.25rem' }}>
                <label className={styles.formLabel}>أو اختر من خلفيات قُدرة التكنولوجية الفاخرة:</label>
                <div className={styles.presetGrid}>
                  {BANNER_PRESETS.map((preset, idx) => (
                    <div
                      key={idx}
                      className={`${styles.presetThumb} ${profile.bannerUrl === preset ? styles.selected : ''}`}
                      style={{ backgroundImage: `url(${preset})` }}
                      onClick={() => handleSelectBannerPreset(preset)}
                    />
                  ))}
                </div>
              </div>

              {/* Direct URL */}
              <div className={styles.formGroup} style={{ marginTop: '1.25rem' }}>
                <label className={styles.formLabel}>أو أدخل رابط صورة مباشر (URL):</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="url"
                    className={styles.formInput}
                    placeholder="https://example.com/cover.jpg"
                    value={customBannerUrl}
                    onChange={e => setCustomBannerUrl(e.target.value)}
                  />
                  <Button variant="proof" size="sm" onClick={handleApplyCustomBanner} disabled={!customBannerUrl.trim()}>
                    تطبيق
                  </Button>
                </div>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <Button variant="ghost" size="sm" onClick={() => setActiveModal(null)}>إغلاق</Button>
            </div>
          </div>
        </div>
      )}

      {/* GitHub Sync Modal */}
      {activeModal === 'github-sync' && (
        <div className={styles.modalOverlay} onClick={() => setActiveModal(null)}>
          <div className={styles.modalBox} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                <span style={{ verticalAlign: 'middle', marginLeft: '0.5rem', display: 'inline-flex' }}>
                  <GithubIcon size={20} />
                </span>
                مزامنة مستودعات GitHub الحية
              </h3>
              <button className={styles.iconBtn} onClick={() => setActiveModal(null)}><X size={18} /></button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>اسم مستخدم GitHub (Username)</label>
                <input
                  type="text"
                  className={styles.formInput}
                  placeholder="مثال: 7usseinNaser"
                  value={syncUsername}
                  onChange={e => setSyncUsername(e.target.value)}
                />
              </div>
              <div style={{ background: 'rgba(0, 184, 184, 0.08)', border: '1px solid rgba(0, 184, 184, 0.25)', borderRadius: '10px', padding: '0.85rem', marginTop: '1rem', fontSize: '0.85rem', lineHeight: 1.6, color: 'var(--ink)' }}>
                ⚡ <strong>كيف تعمل المزامنة الحية؟</strong><br />
                يقوم النظام بالاتصال مباشرة بواجهة <code>api.github.com</code> لسحب مستودعاتك العامة الحقيقية، وتحليل اللغات البرمجية والنجوم والمساهمات، ودمجها مباشرة في ملفك كأدلة مشاريع هندسية معتمدة.
              </div>
            </div>
            <div className={styles.modalFooter}>
              <Button variant="ghost" size="sm" onClick={() => setActiveModal(null)}>إلغاء</Button>
              <Button
                variant="proof"
                size="sm"
                onClick={() => handleSyncGitHubNow(syncUsername)}
                disabled={isSyncingGitHub || !syncUsername.trim()}
                leftIcon={<RefreshCw size={14} className={isSyncingGitHub ? 'spin' : ''} />}
              >
                {isSyncingGitHub ? 'جارٍ السحب الحقيقي...' : 'بدء المزامنة الفورية'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Basic Info Modal */}
      {activeModal === 'basic' && (
        <div className={styles.modalOverlay} onClick={() => setActiveModal(null)}>
          <div className={styles.modalBox} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>تعديل البيانات الأساسية</h3>
              <button className={styles.iconBtn} onClick={() => setActiveModal(null)}><X size={18} /></button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>الاسم الكامل</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={basicForm.fullName}
                  onChange={e => setBasicForm({ ...basicForm, fullName: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>المسمى الوظيفي والعنوان المهني (Headline)</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={basicForm.headline}
                  onChange={e => setBasicForm({ ...basicForm, headline: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>الموقع الجغرافي</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={basicForm.location}
                  onChange={e => setBasicForm({ ...basicForm, location: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>نبذة عنك (About Bio)</label>
                <textarea
                  rows={4}
                  className={styles.formTextarea}
                  value={basicForm.bio}
                  onChange={e => setBasicForm({ ...basicForm, bio: e.target.value })}
                />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>اسم مستخدم GitHub</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={basicForm.githubUsername}
                    onChange={e => setBasicForm({ ...basicForm, githubUsername: e.target.value })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>رابط LinkedIn</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={basicForm.linkedinUrl}
                    onChange={e => setBasicForm({ ...basicForm, linkedinUrl: e.target.value })}
                  />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>رابط موقعك الشخصي</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={basicForm.websiteUrl}
                  onChange={e => setBasicForm({ ...basicForm, websiteUrl: e.target.value })}
                />
              </div>
              <div className={styles.formGroup} style={{ marginTop: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontSize: '0.9rem', color: '#fff' }}>
                  <input
                    type="checkbox"
                    checked={basicForm.openToWork}
                    onChange={e => setBasicForm({ ...basicForm, openToWork: e.target.checked })}
                    style={{ accentColor: '#00B8B8', width: '16px', height: '16px' }}
                  />
                  <span>إظهار شارة متاح لفرص العمل والمشاريع (Open to Work)</span>
                </label>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <Button variant="ghost" size="sm" onClick={() => setActiveModal(null)}>إلغاء</Button>
              <Button variant="proof" size="sm" onClick={handleSaveBasic}>حفظ التغييرات</Button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Experience Modal */}
      {activeModal === 'exp' && (
        <div className={styles.modalOverlay} onClick={() => setActiveModal(null)}>
          <div className={styles.modalBox} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>{editingExpId ? 'تعديل الخبرة المهنية' : 'إضافة خبرة مهنية جديدة'}</h3>
              <button className={styles.iconBtn} onClick={() => setActiveModal(null)}><X size={18} /></button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>المسمى الوظيفي *</label>
                <input
                  type="text"
                  className={styles.formInput}
                  placeholder="مثال: Senior Full-Stack Engineer"
                  value={expForm.title}
                  onChange={e => setExpForm({ ...expForm, title: e.target.value })}
                />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>الشركة أو المنظمة *</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    placeholder="اسم الشركة"
                    value={expForm.company}
                    onChange={e => setExpForm({ ...expForm, company: e.target.value })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>نوع التوظيف</label>
                  <select
                    className={styles.formSelect}
                    value={expForm.employmentType}
                    onChange={e => setExpForm({ ...expForm, employmentType: e.target.value as WorkExperience['employmentType'] })}
                  >
                    <option value="دوام كامل">دوام كامل</option>
                    <option value="دوام جزئي">دوام جزئي</option>
                    <option value="عمل حر">عمل حر (Freelance)</option>
                    <option value="عقد">عقد مؤقت</option>
                  </select>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>الموقع الجغرافي</label>
                <input
                  type="text"
                  className={styles.formInput}
                  placeholder="مثال: الرياض، السعودية (عن بُعد)"
                  value={expForm.location}
                  onChange={e => setExpForm({ ...expForm, location: e.target.value })}
                />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>تاريخ البدء</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    placeholder="مثال: 2022-01"
                    value={expForm.startDate}
                    onChange={e => setExpForm({ ...expForm, startDate: e.target.value })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>تاريخ الانتهاء</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    placeholder="مثال: 2023-12"
                    disabled={expForm.isCurrent}
                    value={expForm.isCurrent ? 'حتى الآن' : expForm.endDate}
                    onChange={e => setExpForm({ ...expForm, endDate: e.target.value })}
                  />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontSize: '0.88rem', color: '#fff' }}>
                  <input
                    type="checkbox"
                    checked={expForm.isCurrent}
                    onChange={e => setExpForm({ ...expForm, isCurrent: e.target.checked })}
                    style={{ accentColor: '#00B8B8', width: '16px', height: '16px' }}
                  />
                  <span>أعمل حالياً في هذه الوظيفة</span>
                </label>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>الوصف والمسؤوليات والإنجازات</label>
                <textarea
                  rows={4}
                  className={styles.formTextarea}
                  placeholder="اذكر أهم ما أنجزته والتقنيات المعمارية التي استخدمتها..."
                  value={expForm.description}
                  onChange={e => setExpForm({ ...expForm, description: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>المهارات المستخدمة (مفصولة بفواصل)</label>
                <input
                  type="text"
                  className={styles.formInput}
                  placeholder="React, TypeScript, Docker, CI/CD"
                  value={expForm.skillsStr}
                  onChange={e => setExpForm({ ...expForm, skillsStr: e.target.value })}
                />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <Button variant="ghost" size="sm" onClick={() => setActiveModal(null)}>إلغاء</Button>
              <Button variant="proof" size="sm" onClick={handleSaveExp} disabled={!expForm.title || !expForm.company}>
                حفظ الخبرة
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Education Modal */}
      {activeModal === 'edu' && (
        <div className={styles.modalOverlay} onClick={() => setActiveModal(null)}>
          <div className={styles.modalBox} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>إضافة مؤهل تعليمي</h3>
              <button className={styles.iconBtn} onClick={() => setActiveModal(null)}><X size={18} /></button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>المؤسسة التعليمية / الجامعة *</label>
                <input
                  type="text"
                  className={styles.formInput}
                  placeholder="اسم الجامعة أو المعهد"
                  value={eduForm.school}
                  onChange={e => setEduForm({ ...eduForm, school: e.target.value })}
                />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>الدرجة العلمية</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    placeholder="مثال: بكالوريوس"
                    value={eduForm.degree}
                    onChange={e => setEduForm({ ...eduForm, degree: e.target.value })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>التخصص / مجال الدراسة</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    placeholder="مثال: هندسة البرمجيات"
                    value={eduForm.fieldOfStudy}
                    onChange={e => setEduForm({ ...eduForm, fieldOfStudy: e.target.value })}
                  />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>سنة البدء</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    placeholder="2018"
                    value={eduForm.startDate}
                    onChange={e => setEduForm({ ...eduForm, startDate: e.target.value })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>سنة التخرج</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    placeholder="2022"
                    value={eduForm.endDate}
                    onChange={e => setEduForm({ ...eduForm, endDate: e.target.value })}
                  />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>التقدير / الدرجة</label>
                <input
                  type="text"
                  className={styles.formInput}
                  placeholder="مثال: ممتاز مع مرتبة الشرف"
                  value={eduForm.grade}
                  onChange={e => setEduForm({ ...eduForm, grade: e.target.value })}
                />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <Button variant="ghost" size="sm" onClick={() => setActiveModal(null)}>إلغاء</Button>
              <Button variant="proof" size="sm" onClick={handleSaveEdu} disabled={!eduForm.school}>
                حفظ المؤهل
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Certification Modal */}
      {activeModal === 'cert' && (
        <div className={styles.modalOverlay} onClick={() => setActiveModal(null)}>
          <div className={styles.modalBox} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>إضافة شهادة مهنية</h3>
              <button className={styles.iconBtn} onClick={() => setActiveModal(null)}><X size={18} /></button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>اسم الشهادة أو الترخيص *</label>
                <input
                  type="text"
                  className={styles.formInput}
                  placeholder="مثال: AWS Certified Solutions Architect"
                  value={certForm.name}
                  onChange={e => setCertForm({ ...certForm, name: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>الجهة المصدرة للشهادة *</label>
                <input
                  type="text"
                  className={styles.formInput}
                  placeholder="مثال: Amazon Web Services"
                  value={certForm.issuingOrg}
                  onChange={e => setCertForm({ ...certForm, issuingOrg: e.target.value })}
                />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>تاريخ الإصدار</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    placeholder="2023-05"
                    value={certForm.issueDate}
                    onChange={e => setCertForm({ ...certForm, issueDate: e.target.value })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>معرف الاعتماد (Credential ID)</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    placeholder="اختياري"
                    value={certForm.credentialId}
                    onChange={e => setCertForm({ ...certForm, credentialId: e.target.value })}
                  />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>رابط التحقق الرسمي من الشهادة</label>
                <input
                  type="url"
                  className={styles.formInput}
                  placeholder="https://..."
                  value={certForm.credentialUrl}
                  onChange={e => setCertForm({ ...certForm, credentialUrl: e.target.value })}
                />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <Button variant="ghost" size="sm" onClick={() => setActiveModal(null)}>إلغاء</Button>
              <Button variant="proof" size="sm" onClick={handleSaveCert} disabled={!certForm.name || !certForm.issuingOrg}>
                حفظ الشهادة
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Project Modal */}
      {activeModal === 'proj' && (
        <div className={styles.modalOverlay} onClick={() => setActiveModal(null)}>
          <div className={styles.modalBox} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>إضافة مشروع مميز للبورتفوليو</h3>
              <button className={styles.iconBtn} onClick={() => setActiveModal(null)}><X size={18} /></button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>اسم المشروع *</label>
                <input
                  type="text"
                  className={styles.formInput}
                  placeholder="اسم التطبيق أو المنصة"
                  value={projForm.title}
                  onChange={e => setProjForm({ ...projForm, title: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>دورك في المشروع</label>
                <input
                  type="text"
                  className={styles.formInput}
                  placeholder="مثال: Full-Stack Developer"
                  value={projForm.role}
                  onChange={e => setProjForm({ ...projForm, role: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>وصف المشروع والإنجاز التقني</label>
                <textarea
                  rows={3}
                  className={styles.formTextarea}
                  placeholder="ما المشكلة التي يحلها المشروع وما التقنيات المستخدمة؟"
                  value={projForm.description}
                  onChange={e => setProjForm({ ...projForm, description: e.target.value })}
                />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>رابط GitHub</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    placeholder="https://github.com/..."
                    value={projForm.githubUrl}
                    onChange={e => setProjForm({ ...projForm, githubUrl: e.target.value })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>رابط المعاينة الحية</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    placeholder="https://..."
                    value={projForm.url}
                    onChange={e => setProjForm({ ...projForm, url: e.target.value })}
                  />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>التقنيات المستخدمة (مفصولة بفواصل)</label>
                <input
                  type="text"
                  className={styles.formInput}
                  placeholder="React, TypeScript, FastAPI, Docker"
                  value={projForm.technologiesStr}
                  onChange={e => setProjForm({ ...projForm, technologiesStr: e.target.value })}
                />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <Button variant="ghost" size="sm" onClick={() => setActiveModal(null)}>إلغاء</Button>
              <Button variant="proof" size="sm" onClick={handleSaveProj} disabled={!projForm.title}>
                حفظ المشروع
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Skill Modal */}
      {activeModal === 'skill' && (
        <div className={styles.modalOverlay} onClick={() => setActiveModal(null)}>
          <div className={styles.modalBox} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>إضافة مهارة جديدة</h3>
              <button className={styles.iconBtn} onClick={() => setActiveModal(null)}><X size={18} /></button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>اسم المهارة أو التقنية *</label>
                <input
                  type="text"
                  className={styles.formInput}
                  placeholder="مثال: Next.js, Docker, Kubernetes"
                  value={newSkillName}
                  onChange={e => setNewSkillName(e.target.value)}
                  autoFocus
                />
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--ink-2)', lineHeight: 1.5 }}>
                💡 المهارة ستُضاف مبدئياً كـ <strong>ادعاء ذاتي (Claimed)</strong>، ويمكنك ترقيتها إلى <strong>مثبتة بالأدلة (Proven)</strong> بربط مستودع كود أو إنجاز تحدي عملي في المنصة.
              </p>
            </div>
            <div className={styles.modalFooter}>
              <Button variant="ghost" size="sm" onClick={() => setActiveModal(null)}>إلغاء</Button>
              <Button variant="proof" size="sm" onClick={handleAddSkill} disabled={!newSkillName.trim()}>
                إضافة المهارة
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LinkedInProfilePage;
