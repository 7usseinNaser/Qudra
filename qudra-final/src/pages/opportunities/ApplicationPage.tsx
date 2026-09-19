import { useMemo, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QudraStore } from '../../services/store';
import { MasterProfileService } from '../../services/master-profile.service';
import type { MasterProfileData } from '../../services/types';
import { ROUTES } from '../../constants/routes';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import styles from './ApplicationPage.module.css';

export function ApplicationPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const opp = useMemo(
    () => QudraStore.getOpportunities().find((o) => o.id === id),
    [id],
  );

  const [selectedEvidence, setSelectedEvidence] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const [profile, setProfile] = useState<MasterProfileData | null>(null);

  useEffect(() => {
    MasterProfileService.getProfile().then(setProfile);
  }, []);

  if (!opp) {
    return (
      <main id="main" className="wrap" tabIndex={-1} dir="rtl" style={{ padding: 'clamp(1.5rem,4vw,2.75rem) 0 5rem' }}>
        <EmptyState
          title="لم نعثر على هذه الفرصة"
          description="ربما تم حذفها أو أن الرابط غير صحيح."
          action={<button className="btn dark" onClick={() => navigate(ROUTES.OPPORTUNITIES)}>العودة للفرص</button>}
        />
      </main>
    );
  }

  const toggleEvidence = (evidenceId: string) => {
    setSelectedEvidence((prev) =>
      prev.includes(evidenceId) ? prev.filter((e) => e !== evidenceId) : [...prev, evidenceId],
    );
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  if (submitted) {
    const sharedItems: string[] = [];
    if (selectedEvidence.length > 0) sharedItems.push(`${selectedEvidence.length} دليل`);
    sharedItems.push('ملفك المهاري');
    if (message.trim()) sharedItems.push('رسالتك');

    return (
      <main id="main" className="wrap" tabIndex={-1} dir="rtl" style={{ padding: 'clamp(1.5rem,4vw,2.75rem) 0 5rem' }}>
        <div className={`box ${styles.confirmation}`}>
          <div className={styles.checkcircle} aria-hidden="true">✓</div>
          <h1 className="scr-t">تم إرسال طلبك</h1>
          <p className="scr-p">تم تقديمك على فرصة <strong>{opp.title}</strong> في {opp.organization}.</p>
          <div className={styles.sharedbox}>
            <h3 className={styles.sharedtitle}>ما تمت مشاركته:</h3>
            <ul className={styles.sharedlist}>
              {sharedItems.map((item) => (
                <li key={item} className={styles.shareditem}>
                  <span className={styles.bullet} aria-hidden="true">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.confirmactions}>
            <button className="btn dark" onClick={() => navigate(ROUTES.OPPORTUNITIES)}>الفرص الأخرى</button>
            <button className="btn ghost" onClick={() => navigate(ROUTES.HOME)}>الرئيسية</button>
          </div>
        </div>
      </main>
    );
  }

  const evidences = profile?.evidences || [];

  return (
    <main id="main" className="wrap" tabIndex={-1} dir="rtl" style={{ padding: 'clamp(1.5rem,4vw,2.75rem) 0 5rem' }}>
      <div className={styles.headrow}>
        <div>
          <button className="btn ghost" onClick={() => navigate(`/opportunities/${opp.id}`)} style={{ marginBottom: '0.8rem' }}>
            ← {opp.title}
          </button>
          <h1 className="scr-t">تقديم على الفرصة</h1>
          <p className="scr-p">اختر الأدلة التي تريد مشاركتها مع {opp.organization}.</p>
        </div>
        <div className={styles.oppsummary}>
          <span className={styles.opptitle}>{opp.title}</span>
          <span className={styles.opporg}>{opp.organization}</span>
          <Badge variant="proof">مطابقة {opp.matchScore}%</Badge>
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.main}>
          <div className={`box ${styles.panel}`}>
            <h3 className={styles.paneltitle}>اختر الأدلة</h3>
            {evidences.length === 0 ? (
              <p className={styles.text}>لا توجد أدلة متاحة. اربط مستودعات GitHub لإنشاء أدلة.</p>
            ) : (
              <div className={styles.evidencelist}>
                {evidences.map((ev) => {
                  const isSelected = selectedEvidence.includes(ev.id);
                  return (
                    <button
                      key={ev.id}
                      className={`${styles.evidenceitem} ${isSelected ? styles.evidenceSelected : ''}`}
                      onClick={() => toggleEvidence(ev.id)}
                      aria-pressed={isSelected}
                    >
                      <span className={styles.evidencecheck} aria-hidden="true">
                        {isSelected ? '✓' : ''}
                      </span>
                      <div className={styles.evidenceinfo}>
                        <span className={styles.evidencetitle}>{ev.title}</span>
                        <span className={styles.evidencemeta}>{ev.type} · {ev.capabilityId}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className={`box ${styles.panel}`}>
            <h3 className={styles.paneltitle}>رسالتك</h3>
            <textarea
              className={styles.textarea}
              placeholder="اكتب رسالة قصيرة تشرح فيها اهتمامك بالفرصة..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
            />
          </div>
        </div>

        <aside className={styles.side}>
          <div className={`box ${styles.panel}`}>
            <h3 className={styles.paneltitle}>معاينة ملفك</h3>
            <div className={styles.profilepreview}>
              <div className={styles.profilerow}>
                <span className={styles.profilelabel}>الاسم</span>
                <span className={styles.profileval}>{profile?.user.fullName || '—'}</span>
              </div>
              <div className={styles.profilerow}>
                <span className={styles.profilelabel}>المسمى</span>
                <span className={styles.profileval}>{profile?.user.headline || '—'}</span>
              </div>
              <div className={styles.profilerow}>
                <span className={styles.profilelabel}>الموثوقية</span>
                <span className={styles.profileval}>{profile?.trustScore || 0}%</span>
              </div>
              <div className={styles.profilerow}>
                <span className={styles.profilelabel}>المهارات المثبتة</span>
                <span className={styles.profileval}>{profile?.capabilities.filter((c) => c.isVerified).length || 0}</span>
              </div>
              <div className={styles.profilerow}>
                <span className={styles.profilelabel}>عدد الأدلة</span>
                <span className={styles.profileval}>{profile?.evidences.length || 0}</span>
              </div>
            </div>
          </div>

          <div className={`box ${styles.panel}`}>
            <h3 className={styles.paneltitle}>ملخص التقديم</h3>
            <div className={styles.summaryrow}>
              <span>الأدلة المختارة</span>
              <span className={styles.summaryval}>{selectedEvidence.length}</span>
            </div>
            <div className={styles.summaryrow}>
              <span>رسالة</span>
              <span className={styles.summaryval}>{message.trim() ? 'نعم' : 'لا'}</span>
            </div>
            <div className={styles.summaryrow}>
              <span>ملفك المهاري</span>
              <span className={styles.summaryval}>يُشارك تلقائياً</span>
            </div>
            <button
              className="btn dark"
              style={{ width: '100%', marginTop: '1rem' }}
              onClick={handleSubmit}
              disabled={selectedEvidence.length === 0}
            >
              إرسال الطلب
            </button>
            {selectedEvidence.length === 0 && (
              <p className={styles.hint}>اختر دليلاً واحداً على الأقل للتقديم.</p>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}

export default ApplicationPage;
