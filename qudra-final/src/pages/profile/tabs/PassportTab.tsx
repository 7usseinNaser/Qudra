import { useState } from 'react'
import styles from '../ProfilePage.module.css'
import { ShareBox } from '../../../components/overlays'
import { Tag } from '../../../components/ui/Tag'

interface PassportTabProps {
  user: { name: string; avatar: string }
}

export function PassportTab({ user }: PassportTabProps) {
  const [copied, setCopied] = useState(false)
  const [showShare, setShowShare] = useState(false)

  const shareUrl = 'https://qudra.sa/p/mash'

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = shareUrl
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      try { document.execCommand('copy') } catch { /* ignore */ }
      document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="screen" id="u5">
      <div className={styles.headrow}>
        <div>
          <span className={styles.eyebrow}>Evidence Passport</span>
          <h1 className={styles.scrt}>بديل السيرة الذاتية</h1>
          <p className={styles.scrp}>
            رابط واحد تشاركه بدل ملف PDF. من يفتحه يرى ما أثبتّه فعلًا — لا ما كتبته عن نفسك.
          </p>
        </div>
      </div>

      <div className={styles.pgrid}>
        <div className={styles.pmain}>
          <div className={styles.passport}>
            <div className={styles.ph}>
              <div>
                <h3>{user.name || 'حسابك'}</h3>
                <p className="note" style={{ marginTop: '0.2rem' }}>
                  مهندس برمجيات · <span className="num">11</span> دليلًا · محدّث قبل ساعتين
                </p>
              </div>
              <span className="pill ready">جاهز الآن · Backend</span>
            </div>

            <div className={styles.pb}>
              <div>
                <span className={styles.lbl}>Proven Skills</span>
                <div className="row" style={{ gap: '0.4rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                  <Tag name="Problem Solving" variant="proven" evidenceCount={4} size="sm" />
                  <Tag name="UI/UX" variant="proven" evidenceCount={3} size="sm" />
                  <Tag name="Product Thinking" variant="proven" evidenceCount={2} size="sm" />
                  <Tag name="Backend" variant="proven" evidenceCount={2} size="sm" />
                </div>
              </div>
              <div>
                <span className={styles.lbl}>Verified Evidence Sources</span>
                <div style={{ display: 'grid', gap: '0.4rem', marginTop: '0.4rem', fontSize: '0.84rem' }}>
                  <div>• GitHub: 3 مستودعات موثّقة واختبارات فُحصت آليًا.</div>
                  <div>• Qudra Simulation: محاكاة هندسية حقيقية قيّمت الأداء والحلول.</div>
                  <div>• Client Projects: مشروعان سُلّما فعليًا لعملاء عبر المنصة.</div>
                </div>
              </div>
            </div>

            <div className={styles.pf}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <button className="btn" onClick={handleCopy}>{copied ? 'تم نسخ الرابط!' : 'انسخ رابط الجواز'}</button>
                <button className="btn ghost" onClick={() => setShowShare(true)}>مشاركة</button>
                <span className="note">رابط عام مشفّر للقراءة فقط</span>
              </div>
              <span className="mono" style={{ fontSize: '0.78rem', color: 'var(--ink-3)' }}>{shareUrl}</span>
            </div>
          </div>
        </div>
      </div>

      {showShare && (
        <ShareBox
          open={showShare}
          onClose={() => setShowShare(false)}
          name={user.name || 'حسابك'}
          role="مهندس برمجيات"
          verifiedEvidence={6}
          provenCapabilities={3}
          fileStrength={72}
          shareUrl={shareUrl}
        />
      )}
    </section>
  )
}
