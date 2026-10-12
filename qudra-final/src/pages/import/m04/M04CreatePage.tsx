import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Upload, GitBranch, FileCode, CheckCircle2, AlertTriangle, HelpCircle, Shield, Lock, WifiOff, Eye, X, Loader2, FileText, Zap } from 'lucide-react';
import { ROUTES } from '../../../constants/routes';
import { AnchorNav, AnchorLink } from '../../../components/patterns/AnchorNav';
import { DataState } from '../../../components/patterns/DataState';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { ProvenClaimedBadge } from '../../../components/patterns/ProvenClaimedBadge';
import { Bar } from '../../../components/ui/Bar';
import styles from './m04.module.css';

const M04_ANCHORS: AnchorLink[] = [
  { id: 'overview', label: 'نظرة عامة', path: ROUTES.M04_OVERVIEW, icon: <Upload size={16} /> },
  { id: 'details', label: 'التفاصيل', path: ROUTES.M04_DETAILS, icon: <FileCode size={16} /> },
  { id: 'create', label: 'استيراد جديد', path: ROUTES.M04_CREATE, icon: <Zap size={16} /> },
  { id: 'results', label: 'نتائج الاستيراد', path: ROUTES.M04_RESULTS, icon: <CheckCircle2 size={16} /> },
  { id: 'empty', label: 'الحالة الفارغة', path: ROUTES.M04_EMPTY, icon: <HelpCircle size={16} /> },
  { id: 'error', label: 'معالجة الخطأ', path: ROUTES.M04_ERROR, icon: <AlertTriangle size={16} /> },
];

interface ImportSourceConfig {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  requiresPAT: boolean;
  color: string;
  bgColor: string;
  accept?: string;
  maxSizeMB?: number;
  placeholder?: string;
}

const SOURCE_CONFIGS: Record<string, ImportSourceConfig> = {
  linkedin: {
    id: 'linkedin',
    name: 'LinkedIn Data Export',
    icon: <FileCode size={24} />,
    description: 'رفع ملف ZIP من إعدادات LinkedIn (Settings > Data Privacy > Get a copy of your data)',
    requiresPAT: false,
    color: '#0A66C2',
    bgColor: 'rgba(10, 102, 194, 0.1)',
    accept: '.zip',
    maxSizeMB: 50,
    placeholder: 'اسحب ملف ZIP أو اضغط للاختيار',
  },
  credly: {
    id: 'credly',
    name: 'Credly Badges',
    icon: <Shield size={24} />,
    description: 'أدخل رابط بروفايل Credly العام (مثال: credly.com/users/username)',
    requiresPAT: false,
    color: '#00C896',
    bgColor: 'rgba(0, 200, 150, 0.1)',
    placeholder: 'https://credly.com/users/your-username',
  },
  leetcode: {
    id: 'leetcode',
    name: 'LeetCode Profile',
    icon: <GitBranch size={24} />,
    description: 'أدخل رابط بروفايل LeetCode العام (مثال: leetcode.com/username)',
    requiresPAT: false,
    color: '#FFA116',
    bgColor: 'rgba(255, 161, 22, 0.1)',
    placeholder: 'https://leetcode.com/your-username',
  },
  hackthebox: {
    id: 'hackthebox',
    name: 'Hack The Box',
    icon: <Lock size={24} />,
    description: 'أدخل PAT من إعدادات حساب HTB (Account > API Access)',
    requiresPAT: true,
    color: '#9F1AE0',
    bgColor: 'rgba(159, 26, 224, 0.1)',
    placeholder: 'أدخل Personal Access Token هنا',
  },
};

type ImportStep = 'input' | 'processing' | 'preview' | 'complete';

interface PreviewData {
  experiences: number;
  skills: number;
  certifications: number;
  projects: number;
  sampleEvidence: { title: string; type: string; strength: number; status: string }[];
}

export const M04CreatePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const sourceId = (location.state as { sourceId?: string })?.sourceId || 'linkedin';
  const config = SOURCE_CONFIGS[sourceId];
  const [step, setStep] = useState<ImportStep>('input');
  const [inputValue, setInputValue] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [patValue, setPatValue] = useState<string>('');
  const [showPat, setShowPat] = useState(false);
  const [progress, setProgress] = useState(0);
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (config.maxSizeMB && selectedFile.size > config.maxSizeMB * 1024 * 1024) {
        setError(`حجم الملف يتجاوز ${config.maxSizeMB}MB`);
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileChange({
        target: { files: [droppedFile] }
      } as unknown as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const handleStartImport = async () => {
    if (!file && !inputValue.trim() && !patValue.trim()) {
      setError('يرجى إدخال البيانات المطلوبة');
      return;
    }

    setError(null);
    setStep('processing');
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + Math.random() * 15, 90));
    }, 300);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      clearInterval(progressInterval);
      setProgress(100);

      const mockPreview = {
        experiences: config.id === 'linkedin' ? 5 : 0,
        skills: config.id === 'linkedin' ? 28 : config.id === 'leetcode' ? 15 : 0,
        certifications: config.id === 'credly' ? 7 : 0,
        projects: config.id === 'linkedin' ? 4 : config.id === 'hackthebox' ? 3 : 0,
        sampleEvidence: config.id === 'linkedin' ? [
          { title: 'Senior Software Engineer at TechCorp', type: 'EXPERIENCE', strength: 85, status: 'CLAIMED' },
          { title: 'React & TypeScript Architecture', type: 'SKILL', strength: 92, status: 'CLAIMED' },
          { title: 'AWS Certified Solutions Architect', type: 'CERTIFICATION', strength: 95, status: 'VERIFIED' },
        ] : config.id === 'credly' ? [
          { title: 'Kubernetes Administrator (CKA)', type: 'CERTIFICATION', strength: 98, status: 'VERIFIED' },
          { title: 'MongoDB Professional', type: 'CERTIFICATION', strength: 90, status: 'VERIFIED' },
        ] : config.id === 'leetcode' ? [
          { title: 'Problem Solving: 342/3000', type: 'STAT', strength: 75, status: 'CLAIMED' },
          { title: 'Contest Rating: 1850', type: 'STAT', strength: 80, status: 'CLAIMED' },
        ] : [
          { title: 'Machine: Forest (Root)', type: 'MACHINE', strength: 90, status: 'CLAIMED' },
          { title: 'Challenge: Web Exploitation', type: 'CHALLENGE', strength: 85, status: 'CLAIMED' },
        ],
      };

      setPreviewData(mockPreview);
      setStep('preview');
    } catch {
      clearInterval(progressInterval);
      setError('فشل في معالجة البيانات. يرجى المحاولة مرة أخرى.');
      setStep('input');
    }
  };

  const handleConfirmImport = () => {
    setStep('complete');
    setTimeout(() => {
      navigate(ROUTES.M04_RESULTS, { state: { sourceId, importedData: previewData } });
    }, 1500);
  };

  const handleBack = () => {
    if (step === 'preview') setStep('input');
    else if (step === 'processing') setStep('input');
    else navigate(ROUTES.M04_OVERVIEW);
  };

  if (!config) {
    return (
      <div className={styles.page} dir="rtl">
        <DataState
          state="error"
          title="مصدر غير معروف"
          action={{ label: 'العودة للنظرة العامة', onClick: () => navigate(ROUTES.M04_OVERVIEW) }}
        />
      </div>
    );
  }

  const isFileInput = config.accept !== undefined;
  const isUrlInput = !config.requiresPAT && !isFileInput;
  const isPatInput = config.requiresPAT;

  return (
    <div className={styles.page} dir="rtl">
      <AnchorNav anchors={M04_ANCHORS} title="شاشات مركز الاستيراد (M04)" />

      <header className={styles.header}>
        <Button variant="ghost" size="sm" onClick={handleBack} leftIcon={<ArrowLeft size={16} />}>
          العودة
        </Button>
        <div className={styles.headerContent}>
          <div className={styles.headerIcon} style={{ background: config.bgColor, borderColor: config.color }}>
            <div style={{ color: config.color }}>{config.icon}</div>
          </div>
          <div>
            <h1 className={styles.title}>استيراد من {config.name}</h1>
            <p className={styles.subtitle}>{config.description}</p>
          </div>
        </div>
        <Badge variant="proof">Q-0124</Badge>
      </header>

      {config.requiresPAT && (
        <div className={styles.patBanner}>
          <WifiOff size={16} />
          <span><strong>تنبيه:</strong> أي PAT يُدخل هنا <strong>لا يُخزن</strong> في localStorage/sessionStorage. يبقى في متغير JS بالذاكرة فقط أثناء الجلسة. عند إغلاق التبويب — يمسح فوراً.</span>
        </div>
      )}

      {step === 'input' && (
        <section className={styles.inputSection} aria-labelledby="input-title">
          <h2 id="input-title" className={styles.sectionTitle}>أدخل بيانات المصدر</h2>
          
          {isFileInput && (
            <div 
              className={`${styles.dropZone} ${file ? styles.hasFile : ''}`}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <input
                id="file-input"
                type="file"
                accept={config.accept}
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <div className={styles.dropZoneContent}>
                <Upload size={48} className={styles.dropIcon} />
                <h3>{file ? 'تم اختيار الملف' : config.placeholder}</h3>
                <p>{config.accept ? `ملفات ${config.accept} فقط • حتى ${config.maxSizeMB}MB` : 'أدخل الرابط أدناه'}</p>
                {file && (
                  <div className={styles.fileInfo}>
                    <FileText size={16} /> {file.name} ({(file.size / 1024 / 1024).toFixed(1)} MB)
                    <button className={styles.removeFile} onClick={e => { e.stopPropagation(); setFile(null); }}><X size={16} /></button>
                  </div>
                )}
              </div>
            </div>
          )}

          {(isUrlInput || isPatInput) && (
            <div className={styles.urlInput}>
              <label className={styles.inputLabel}>
                {isPatInput ? 'Personal Access Token' : 'رابط البروفايل العام'}
              </label>
              <div className={styles.inputWrapper}>
                <input
                  type={isPatInput && !showPat ? 'password' : 'text'}
                  className={styles.input}
                  placeholder={config.placeholder}
                  value={isPatInput ? patValue : inputValue}
                  onChange={e => isPatInput ? setPatValue(e.target.value) : setInputValue(e.target.value)}
                  autoFocus
                />
                {isPatInput && (
                  <button
                    type="button"
                    className={styles.toggleVisibility}
                    onClick={() => setShowPat(!showPat)}
                    aria-label={showPat ? 'إخفاء الرمز' : 'إظهار الرمز'}
                  >
                    <Eye size={18} />
                  </button>
                )}
              </div>
              <p className={styles.inputHint}>
                {isPatInput 
                  ? 'الرمز يستخدم في الذاكرة فقط — لا يُحفظ أبداً' 
                  : 'رابط البروفايل العام فقط — لا حاجة لكلمة مرور'}
              </p>
            </div>
          )}

          {error && (
            <div className={styles.errorMessage}>
              <AlertTriangle size={16} /> {error}
            </div>
          )}

          <div className={styles.inputActions}>
            <Button variant="outline" size="md" onClick={handleBack} leftIcon={<ArrowLeft size={16} />}>
              إلغاء
            </Button>
            <Button
              variant="proof"
              size="lg"
              onClick={handleStartImport}
              disabled={(!file && !inputValue.trim() && !patValue.trim())}
              leftIcon={<Upload size={18} />}
            >
              {isFileInput && file ? 'معالجة الملف' : isFileInput ? 'اختر ملف أولاً' : 'بدء الاستيراد'}
            </Button>
          </div>
        </section>
      )}

      {step === 'processing' && (
        <section className={styles.processingSection} aria-labelledby="processing-title">
          <h2 id="processing-title" className={styles.sectionTitle}>جاري المعالجة...</h2>
          <div className={styles.processingCard}>
            <div className={styles.progressRing}>
              <svg width={120} height={120}>
                <circle
                  cx={60} cy={60} r={50}
                  fill="none" stroke="var(--line)" strokeWidth={8}
                />
                <circle
                  cx={60} cy={60} r={50}
                  fill="none" stroke="var(--proof)" strokeWidth={8}
                  strokeDasharray={314}
                  strokeDashoffset={314 - (314 * progress / 100)}
                  strokeLinecap="round"
                  style={{ transform: 'rotate(-90deg)', transformOrigin: 'center', transition: 'stroke-dashoffset 0.3s' }}
                />
              </svg>
              <span className={styles.progressText}>{Math.round(progress)}%</span>
            </div>
            <p className={styles.processingText}>نستخرج البيانات، نحلل الأدلة، ونجهز المعاينة...</p>
            <Bar value={progress} showValue size="lg" variant="proof" />
          </div>
        </section>
      )}

      {step === 'preview' && previewData && (
        <section className={styles.previewSection} aria-labelledby="preview-title">
          <h2 id="preview-title" className={styles.sectionTitle}>معاينة البيانات المستخرجة</h2>
          
          <div className={styles.previewStats}>
            <div className={styles.previewStat}>
              <span className={styles.previewStatValue}>{previewData.experiences}</span>
              <span className={styles.previewStatLabel}>خبرات</span>
            </div>
            <div className={styles.previewStat}>
              <span className={styles.previewStatValue}>{previewData.skills}</span>
              <span className={styles.previewStatLabel}>مهارات</span>
            </div>
            <div className={styles.previewStat}>
              <span className={styles.previewStatValue}>{previewData.certifications}</span>
              <span className={styles.previewStatLabel}>شهادات</span>
            </div>
            <div className={styles.previewStat}>
              <span className={styles.previewStatValue}>{previewData.projects}</span>
              <span className={styles.previewStatLabel}>مشاريع</span>
            </div>
          </div>

          <div className={styles.previewEvidence}>
            <h3>الأدلة المستخرجة ({previewData.sampleEvidence.length})</h3>
            <div className={styles.previewEvidenceList}>
              {previewData.sampleEvidence.map((ev: { title: string; type: string; strength: number; status: string }, i: number) => (
                <div key={i} className={styles.previewEvidenceItem}>
                  <div className={styles.previewEvidenceMain}>
                    <h4>{ev.title}</h4>
                    <span className={styles.previewEvidenceType}>{ev.type}</span>
                  </div>
                  <div className={styles.previewEvidenceMeta}>
                    <ProvenClaimedBadge
                      state={ev.status === 'VERIFIED' ? 'PROVEN' : 'CLAIMED'}
                      size="sm"
                    />
                    <Bar value={ev.strength} showValue size="sm" variant={ev.status === 'VERIFIED' ? 'proof' : 'gap'} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.fragileNotice}>
            <WifiOff size={16} />
            <span><strong>ملاحظة:</strong> جميع الأدلة من هذا المصدر تحمل حالة <code>CLAIMED</code> وتظهر بشارة <span className={styles.fragileBadge}>User-supplied / Fragile</span> في ملف الماستر. للتحقق الكامل، اربط مستودع GitHub أو أكمل تحدياً عملياً.</span>
          </div>

          <div className={styles.previewActions}>
            <Button variant="outline" size="md" onClick={() => setStep('input')} leftIcon={<ArrowLeft size={16} />}>
              تعديل المدخلات
            </Button>
            <Button variant="proof" size="lg" onClick={handleConfirmImport} leftIcon={<CheckCircle2 size={18} />}>
              تأكيد الاستيراد والحفظ
            </Button>
          </div>
        </section>
      )}

      {step === 'complete' && (
        <section className={styles.completeSection} aria-labelledby="complete-title">
          <h2 id="complete-title" className={styles.sectionTitle}>تم الاستيراد بنجاح!</h2>
          <div className={styles.completeCard}>
            <div className={styles.completeIcon}>
              <CheckCircle2 size={48} />
            </div>
            <h3>تم إضافة {previewData?.sampleEvidence?.length ?? 0} أدلة جديدة لملفك</h3>
            <p>جاري الانتقال لصفحة النتائج...</p>
            <Loader2 size={24} className={styles.spin} />
          </div>
        </section>
      )}
    </div>
  );
};

export default M04CreatePage;