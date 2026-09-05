/**
 * InvitePage — شاشة قبول دعوة فريق واردة (#inv).
 *
 * مطابقة حرفية لـ prototype.html (#inv):
 * تفاصيل الدعوة الواردة من محمد الدوسري، المهارات المطلوبة،
 * ما يملكه وما ينقصه، ورسالته الشخصية، مع خيار قبول الدعوة أو الاعتذار.
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import styles from './InvitePage.module.css'

export function InvitePage() {
  const navigate = useNavigate()
  const [accepted, setAccepted] = useState(false)

  const handleAccept = () => {
    setAccepted(true)
    setTimeout(() => {
      navigate(ROUTES.PROFILE)
    }, 1200)
  }

  const handleDecline = () => {
    navigate(ROUTES.PROFILE)
  }

  return (
    <div className={styles.invScreen} dir="rtl">
      <button className={styles.skip} onClick={handleDecline}>
        → لاحقًا
      </button>

      <div className={styles.inner}>
        <div className={styles.invhead}>
          <span className={styles.invav}>م</span>
          <div>
            <span className="lbl">دعوة مشروع</span>
            <h1>محمد الدوسري يدعوك</h1>
            <p className="note" style={{ margin: '0.2rem 0 0' }}>
              وصلت قبل ٣ دقائق · تنتهي بعد ٧ أيام
            </p>
          </div>
        </div>

        <div className={`box ${styles.invbox}`}>
          <span className="lbl">المشكلة</span>
          <p className={styles.sumtxt} style={{ marginTop: '0.4rem' }}>
            تطبيق يساعد طلاب الجامعة على إيجاد موادهم ومواعيدهم — أول نسخة خلال شهرين.
          </p>
          <div className={styles.hr} />
          <span className="lbl">يحتاجك لـ</span>
          <div className="row" style={{ gap: '0.4rem', marginTop: '0.5rem' }}>
            <span className="tag proven">Backend</span>
            <span className="tag proven">Database</span>
          </div>
          <p className="note" style={{ marginTop: '0.7rem' }}>
            تغطيتك لهاتين القدرتين{' '}
            <b style={{ color: 'var(--accent)' }}>91%</b> — أنت أعلى مرشّح لديه.
          </p>
        </div>

        <div className="split" style={{ marginTop: '0.9rem' }}>
          <div className="box">
            <h3 style={{ fontSize: '0.95rem', marginBottom: '0.7rem', color: 'var(--ink)' }}>
              ما أثبته هو
            </h3>
            <div className="row" style={{ gap: '0.3rem' }}>
              <span className="tag proven">
                UI/UX <span className="c">3</span>
              </span>
              <span className="tag proven">
                Product <span className="c">2</span>
              </span>
            </div>
            <p className="note" style={{ marginTop: '0.7rem' }}>
              7 أدلة موثّقة · قوّة ملف 68
            </p>
          </div>

          <div className="box">
            <div className="flag">
              <h3 style={{ fontSize: '0.95rem', marginBottom: '0.7rem', color: 'var(--gapc, #e6a23c)' }}>
                ما ينقصه
              </h3>
              <div className="row" style={{ gap: '0.3rem' }}>
                <span className="tag claimed">Backend</span>
                <span className="tag claimed">Database</span>
              </div>
              <p className="note" style={{ marginTop: '0.7rem' }}>
                هذا سبب دعوتك — لا نخفيه عنك.
              </p>
            </div>
          </div>
        </div>

        <div className={`box ${styles.invmsg}`}>
          <span className="lbl">رسالته</span>
          <p>
            «أثبتُّ UI/UX وProduct Thinking في المحاكاة، وأحتاج من يغطّي الـBackend. تقدر تشوف ملفي وأدلتي قبل ما تقرّر.»
          </p>
        </div>

        <div className={styles.invact}>
          <button
            className={styles.cta}
            onClick={handleAccept}
            disabled={accepted}
            id="acceptInviteBtn"
          >
            {accepted ? 'تم قبول الدعوة! جارٍ التحويل…' : 'اقبل الدعوة'}
          </button>
          <button className="btn ghost" onClick={handleDecline}>
            اعتذر بلطف
          </button>
        </div>

        <p className="note" style={{ textAlign: 'center' }}>
          قبولك يفتح مساحة عمل مشتركة — ولا يلزمك بشيء قبل الاتفاق على النطاق.
        </p>
      </div>
    </div>
  )
}

export default InvitePage
