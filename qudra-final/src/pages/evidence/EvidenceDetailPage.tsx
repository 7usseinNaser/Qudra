/**
 * EvidenceDetailPage — صفحة تفصيل الدليل المستقلة.
 *
 * مطابق لـ evd في prototype.html (تبويب تفصيل الدليل في الملف الشخصي).
 * تعرض:
 *   - عنوان الدليل + مصدره + مستوى التحقق
 *   - شبكة إشارات (التعقيد، الاكتمال، تغطية الاختبارات، وضوح التوثيق)
 *   - المهارات المستخرجة من الدليل
 *   - تأثير الدليل على المهارات (delta)
 *   - نص "كيف تحقّقنا منه"
 *
 * راجع PROJECT_MAP.md → src/pages/evidence/EvidenceDetailPage.tsx
 */

import { useParams, useNavigate } from 'react-router-dom'
import { demoEvidence, demoEvidenceSignals, demoEvidenceImpact, demoVerificationText } from '../../data'
import { Badge, Bar, Button, Tag } from '../../components/ui'
import type { EvidenceSource } from '../../types'
import styles from './EvidenceDetailPage.module.css'

const SOURCE_LABELS: Record<EvidenceSource, string> = {
  github: 'GitHub',
  project: 'مشروع',
  challenge: 'تحدٍّ عملي',
  peer: 'تقييم أقران',
  cert: 'شهادة',
  claim: 'ادعاء ذاتي',
  leetcode: 'LeetCode',
  qudra: 'قُدرة',
}

export function EvidenceDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const evidence = demoEvidence.find((e) => e.id === id) ?? demoEvidence[0]

  return (
    <div className={styles.page} dir="rtl">
      <div className={styles.container}>
        <button className={styles.back} onClick={() => navigate(-1)} aria-label="رجوع">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          رجوع
        </button>

        <header className={styles.header}>
          <div className={styles.headerTop}>
            <span className={styles.sourceTag}>{SOURCE_LABELS[evidence.source]}</span>
            <Badge variant="proof">{evidence.level}</Badge>
          </div>
          <h1>{evidence.title}</h1>
          <p className={styles.meta}>
            {evidence.type} · {evidence.skill} · {evidence.date}
            {evidence.path && <span className={styles.path}>{evidence.path}</span>}
          </p>
        </header>

        {evidence.outcome && (
          <section className={styles.section}>
            <h2>المخرج</h2>
            <p>{evidence.outcome}</p>
          </section>
        )}

        <section className={styles.section}>
          <h2>الإشارات</h2>
          <div className={styles.signals}>
            {demoEvidenceSignals.map((sig) => (
              <div key={sig.label} className={styles.signal}>
                <div className={styles.signalLabel}>
                  <span>{sig.label}</span>
                  <span className={styles.signalValue}>{sig.value}%</span>
                </div>
                <Bar value={sig.value} />
              </div>
            ))}
          </div>
        </section>

        {evidence.skills && evidence.skills.length > 0 && (
          <section className={styles.section}>
            <h2>المهارات المستخرجة</h2>
            <div className={styles.skills}>
              {evidence.skills.map((skill) => (
                <Tag key={skill} name={skill} variant="proven" evidenceCount={1} size="sm" />
              ))}
            </div>
          </section>
        )}

        <section className={styles.section}>
          <h2>تأثير الدليل</h2>
          <div className={styles.impact}>
            <div className={styles.impactTotal}>
              <span className={styles.impactDelta}>+{demoEvidenceImpact.totalDelta}</span>
              <span className={styles.impactLabel}>إجمالي الرفع</span>
            </div>
            <div className={styles.impactSkills}>
              {demoEvidenceImpact.skillDeltas.map((d) => (
                <div key={d.skill} className={styles.impactSkill}>
                  <span>{d.skill}</span>
                  <span className={styles.impactSkillDelta}>+{d.delta}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2>كيف تحقّقنا منه</h2>
          <p className={styles.verification}>{demoVerificationText}</p>
        </section>

        <div className={styles.actions}>
          <Button variant="ghost" onClick={() => navigate(-1)}>إغلاق</Button>
          <Button variant="primary" onClick={() => navigate('/profile/evidence')}>كل أدلتي</Button>
        </div>
      </div>
    </div>
  )
}
