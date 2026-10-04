import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Sparkles,
  Copy,
  Check,
  Share2,
  Code,
  FileCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { ROUTES } from '../../constants/routes';
import { ProfileEditorService } from '../../services/profile-editor.service';
import { Button } from '../../components/ui/Button';
import { Bar } from '../../components/ui/Bar';
import { QudraLogo } from '../../components/ui/QudraLogo';
import styles from './CapabilityPassportPage.module.css';

export const CapabilityPassportPage: React.FC = () => {
  const navigate = useNavigate();
  const profile = ProfileEditorService.getProfile();
  const [copiedContext, setCopiedContext] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const passportSerial = `QDR-2026-${profile.fullName.length * 107}-${profile.skills.length}`;
  const shareUrl = `${window.location.origin}/u/${encodeURIComponent(profile.githubUsername || 'hussein')}`;

  const handleCopyAIContext = async () => {
    const provenSkills = profile.skills.filter(s => s.isProven).map(s => `- ${s.name} (${s.evidenceCount} أدلة موثقة في الكود)`).join('\n');
    const claimedSkills = profile.skills.filter(s => !s.isProven).map(s => `- ${s.name} (ادعاء ذاتي قيد الإثبات)`).join('\n');
    const recentProjects = profile.projects.map(p => `- ${p.title}: ${p.description} [التقنيات: ${p.technologies.join(', ')}]`).join('\n');

    const contextPrompt = `
# QUDRA Capability Passport Context
**المهندس:** ${profile.fullName}
**المسمى:** ${profile.headline}
**الموقع:** ${profile.location}
**الموثوقية الهندسية:** 88% (معتمد بمنهجية Evidence-Driven)
**الرقم التسلسلي في قُدرة:** ${passportSerial}

## النبذة المهنية:
${profile.bio}

## الكفاءات المبرهنة بأدلة كود حقيقية (Proven Capabilities):
${provenSkills}

## المهارات المدعاة ذاتياً (Claimed Skills):
${claimedSkills}

## أبرز المشاريع البرمجية المعتمدة:
${recentProjects}

## أوزان التقييم المعتمدة في قُدرة (Multi-Factor DNA):
- الاختبارات العملية: 40% (Score: 92/100)
- المشاريع المنجزة: 30% (Score: 86/100)
- التقييم الشفوي/المعماري: 20% (Score: 84/100)
- حداثة النشاط: 10% (Score: 90/100)

## الفجوة الحالية والخطوة القادمة (Next Best Action):
- الفجوة المرصودة: بنية الأنظمة الموزعة عالية التزامن (High-Concurrency Distributed Systems).
- التحدي الموصى به: حل تحدي معالجة 10 آلاف طلب متزامن على FastAPI.
`.trim();

    try {
      await navigator.clipboard.writeText(contextPrompt);
      setCopiedContext(true);
      setTimeout(() => setCopiedContext(false), 2500);
    } catch {
      alert('تم تجهيز السياق بنجاح');
    }
  };

  const handleCopyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // ignore
    }
  };

  const provenSkills = profile.skills.filter(s => s.isProven);
  const claimedSkills = profile.skills.filter(s => !s.isProven);

  return (
    <div className={styles.container}>
      {/* Back to Hub */}
      <div style={{ marginBottom: '1.25rem' }}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(ROUTES.HOME)}
          leftIcon={<ArrowRight size={15} />}
        >
          العودة للوحة التحكم
        </Button>
      </div>

      {/* AI Context Hero Banner */}
      <div className={styles.actionPanel}>
        <div className={styles.actionPanelContent}>
          <h3>
            <Sparkles size={20} style={{ color: '#00B8B8' }} /> سياق الذكاء الاصطناعي الفوري (AI Context Layer)
          </h3>
          <p>
            بدل أن تشرح نفسك وخبراتك لكل أداة ذكاء اصطناعي من الصفر؛ انسخ سياق جواز قُدرة بضغطة زر وألصقه في ChatGPT أو Claude ليفهم مسارك الهندسي وأدلتك وفجواتك فوراً!
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Button
            variant="proof"
            size="md"
            onClick={handleCopyAIContext}
            leftIcon={copiedContext ? <Check size={16} /> : <Copy size={16} />}
          >
            {copiedContext ? 'تم نسخ سياق الـ AI بنجاح! ✓' : 'نسخ سياق الـ AI (Prompt)'}
          </Button>
          <Button
            variant="outline"
            size="md"
            onClick={handleCopyShareLink}
            leftIcon={copiedLink ? <Check size={16} /> : <Share2 size={16} />}
          >
            {copiedLink ? 'تم نسخ الرابط!' : 'مشاركة الجواز'}
          </Button>
        </div>
      </div>

      {/* The Digital Passport Card */}
      <div className={styles.passportCard}>
        {/* Passport Header */}
        <div className={styles.passportHeader}>
          <div className={styles.passportTitleArea}>
            <div className={styles.passportLogo}>
              <QudraLogo size={32} />
            </div>
            <div>
              <h1 className={styles.passportMainTitle}>جواز القدرات المهني المعتمد (QUDRA Passport)</h1>
              <p className={styles.passportSubTitle}>
                وثيقة الكفاءات الحية القائمة على الأدلة البرمجية · بديل السيرة الذاتية التقليدية
              </p>
            </div>
          </div>
          <div style={{ textAlign: 'left', fontFamily: 'var(--fm)', fontSize: '0.85rem' }}>
            <span style={{ color: 'rgba(255,255,255,0.6)', display: 'block', fontSize: '0.72rem' }}>الرقم التسلسلي</span>
            <strong style={{ color: '#00B8B8', letterSpacing: '0.08em' }}>{passportSerial}</strong>
          </div>
        </div>

        {/* Passport Body */}
        <div className={styles.passportBody}>
          {/* Identity Row */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem',
            paddingBottom: '1.5rem',
            borderBottom: '1px solid var(--line)',
            marginBottom: '1.75rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <img
                src={profile.avatarUrl}
                alt={profile.fullName}
                style={{ width: 72, height: 72, borderRadius: '50%', border: '3px solid #00B8B8', objectFit: 'cover' }}
              />
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '0 0 0.2rem', color: 'var(--ink)' }}>
                  {profile.fullName}
                </h2>
                <p style={{ fontSize: '0.92rem', color: 'var(--ink-2)', margin: 0 }}>
                  {profile.headline}
                </p>
                <span style={{ fontSize: '0.8rem', color: 'var(--ink-3)', marginTop: '0.2rem', display: 'block' }}>
                  📍 {profile.location}
                </span>
              </div>
            </div>

            <div style={{ textAlign: 'left' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--ink-3)', display: 'block' }}>الموثوقية الهندسية الشاملة</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
                <ShieldCheck size={28} style={{ color: '#00B8B8' }} />
                <span style={{ fontFamily: 'var(--fm)', fontSize: '1.8rem', fontWeight: 800, color: '#00B8B8' }}>
                  88%
                </span>
              </div>
            </div>
          </div>

          {/* Grid: DNA Breakdown & Proven vs Claimed */}
          <div className={styles.gridTwo}>
            {/* Multi-Factor DNA Breakdown */}
            <div className={styles.dnaSection}>
              <h3 className={styles.dnaTitle}>
                <Code size={18} style={{ color: '#00B8B8' }} /> تفكيك الـ DNA الهندسي (Multi-Factor Scoring)
              </h3>
              
              <div className={styles.dnaItem}>
                <div className={styles.dnaItemLabel}>
                  <span>الأدلة العملية والكود البرمجي (40%)</span>
                  <strong style={{ fontFamily: 'var(--fm)', color: '#00B8B8' }}>92%</strong>
                </div>
                <Bar value={92} size="sm" variant="proof" />
              </div>

              <div className={styles.dnaItem}>
                <div className={styles.dnaItemLabel}>
                  <span>المشاريع المنجزة على GitHub (30%)</span>
                  <strong style={{ fontFamily: 'var(--fm)', color: '#00B8B8' }}>86%</strong>
                </div>
                <Bar value={86} size="sm" variant="proof" />
              </div>

              <div className={styles.dnaItem}>
                <div className={styles.dnaItemLabel}>
                  <span>التقييم المعماري والشفوي (20%)</span>
                  <strong style={{ fontFamily: 'var(--fm)', color: '#00B8B8' }}>84%</strong>
                </div>
                <Bar value={84} size="sm" variant="proof" />
              </div>

              <div className={styles.dnaItem}>
                <div className={styles.dnaItemLabel}>
                  <span>حداثة النشاط والتحديث (10%)</span>
                  <strong style={{ fontFamily: 'var(--fm)', color: '#00B8B8' }}>90%</strong>
                </div>
                <Bar value={90} size="sm" variant="proof" />
              </div>
            </div>

            {/* Evidence & Verification Sources */}
            <div className={styles.dnaSection}>
              <h3 className={styles.dnaTitle}>
                <FileCheck size={18} style={{ color: '#00B8B8' }} /> مصادر الأدلة المربوطة والمحققة
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.86rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 0.85rem', background: 'var(--surface)', borderRadius: '8px', border: '1px solid var(--line)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={16} style={{ color: '#00B8B8' }} />
                    <span>مستودعات GitHub الرسمية ({profile.githubUsername})</span>
                  </div>
                  <strong style={{ color: '#00B8B8' }}>مفحوص آلياً ✓</strong>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 0.85rem', background: 'var(--surface)', borderRadius: '8px', border: '1px solid var(--line)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={16} style={{ color: '#00B8B8' }} />
                    <span>شهادات Meta & Coursera</span>
                  </div>
                  <strong style={{ color: '#00B8B8' }}>شهادة محققة ✓</strong>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 0.85rem', background: 'var(--surface)', borderRadius: '8px', border: '1px solid var(--line)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={16} style={{ color: '#00B8B8' }} />
                    <span>مشاريع إنتاجية مسلّمة (Dawaa & Shifa / Qudra)</span>
                  </div>
                  <strong style={{ color: '#00B8B8' }}>دليل تطبيقي ✓</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Proven Capabilities Section */}
          <div style={{ marginBottom: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <strong style={{ fontSize: '1rem', color: 'var(--ink)' }}>الكفاءات المبرهنة بالأدلة (Proven Capabilities):</strong>
              <span style={{ fontSize: '0.8rem', color: '#00B8B8' }}>{provenSkills.length} مهارات مثبتة هندسياً</span>
            </div>
            <div className={styles.tagList}>
              {provenSkills.map(skill => (
                <span key={skill.id} className={styles.provenTag}>
                  <CheckCircle2 size={13} /> {skill.name} ({skill.evidenceCount} أدلة)
                </span>
              ))}
            </div>
          </div>

          {/* Claimed Skills Section */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <strong style={{ fontSize: '1rem', color: 'var(--ink)' }}>المهارات قيد التعزيز والإثبات (Claimed / In Progress):</strong>
              <span style={{ fontSize: '0.8rem', color: '#FFC107' }}>تحتاج تحديات عملية للإثبات</span>
            </div>
            <div className={styles.tagList}>
              {claimedSkills.map(skill => (
                <span key={skill.id} className={styles.claimedTag}>
                  <AlertCircle size={13} /> {skill.name} (ادعاء ذاتي)
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Passport Footer */}
        <div className={styles.passportFooter}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={15} /> تم التحديث والتحقق الأخير: منذ ساعتين
          </div>
          <div style={{ fontFamily: 'var(--fm)', color: 'var(--ink-2)' }}>
            رابط المشاركة المشفر: <span style={{ color: '#00B8B8' }}>{shareUrl}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CapabilityPassportPage;
