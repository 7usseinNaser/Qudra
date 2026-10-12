import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QudraStore } from '../../../services/store';
import { ROUTES } from '../../../constants/routes';
import { Badge } from '../../../components/ui/Badge';
import { Bar } from '../../../components/ui/Bar';
import { EmptyState } from '../../../components/ui/EmptyState';
import styles from './m17.module.css';
import { ArrowRight, ShieldCheck, Target, AlertTriangle, CheckCircle, XCircle, FileText, UserCheck, Users, MapPin, Briefcase, DollarSign, Calendar, GitFork, Sparkles, ExternalLink } from 'lucide-react';

export const M17DetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const opp = useMemo(
    () => QudraStore.getOpportunities().find((o) => o.id === id),
    [id],
  );

  if (!opp) {
    return (
      <div className={styles.container} dir="rtl">
        <EmptyState
          title="لم نعثر على هذه الفرصة"
          description="ربما تم حذفها أو أن الرابط غير صحيح."
          action={<button className="btn dark" onClick={() => navigate(ROUTES.M17_OVERVIEW)}>العودة للفرص</button>}
        />
      </div>
    );
  }

  const allCapabilities = QudraStore.getCapabilities();

  return (
    <div className={styles.container} dir="rtl">
      <div className={styles.headRow}>
        <div>
          <button className="btn ghost" onClick={() => navigate(ROUTES.M17_OVERVIEW)} style={{ marginBottom: '0.8rem' }}>
            <ArrowRight size={14} /> الفرص
          </button>
          <h1 className={styles.title}>{opp.title}</h1>
          <p className={styles.org}>
            {opp.organization}
            {opp.isVerifiedOrg && <span className={styles.verified} aria-label="جهة موثقة"> <ShieldCheck size={14} /> موثّق</span>}
          </p>
        </div>
        <div className={styles.matchBox}>
          <span className={`${styles.matchNum} ${opp.matchScore >= 80 ? styles.highMatch : ''}`}>
            {opp.matchScore}%
          </span>
          <span className={styles.matchLabel}>مطابقة</span>
          <div style={{ marginTop: '0.5rem' }}>
            <Bar value={opp.matchScore} max={100} label="" variant={opp.matchScore >= 80 ? 'proof' : 'gap'} size="xs" />
          </div>
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.main}>
          <div className={`box ${styles.panel}`}>
            <h3 className={styles.panelTitle}>
              <FileText size={18} style={{ color: 'var(--proof)', marginInlineEnd: '0.5rem' }} />
              الوصف
            </h3>
            <p className={styles.text}>{opp.description}</p>
          </div>

          <div className={`box ${styles.panel}`}>
            <h3 className={styles.panelTitle}>
              <Target size={18} style={{ color: '#F59E0B', marginInlineEnd: '0.5rem' }} />
              المتطلبات
            </h3>
            <ul className={styles.list}>
              {(opp.requirements || []).map((req) => (
                <li key={req} className={styles.listItem}>
                  <span className={styles.bullet} aria-hidden="true">•</span>
                  {req}
                </li>
              ))}
            </ul>
          </div>

          {(opp.structuredRequirements || []).length > 0 && (
            <div className={`box ${styles.panel}`}>
              <h3 className={styles.panelTitle}>
                <Sparkles size={18} style={{ color: 'var(--proof)', marginInlineEnd: '0.5rem' }} />
                المتطلبات المهارية المنظمة
              </h3>
              <div className={styles.structReq}>
                {(opp.structuredRequirements || []).map((sr) => (
                  <div key={sr.skill} className={styles.structRow}>
                    <span className={styles.structSkill}>{sr.skill}</span>
                    <Badge variant={sr.importance === 'critical' ? 'gap' : 'proof'} size="sm">
                      {sr.importance === 'critical' ? 'حرج' : 'مفضل'}
                    </Badge>
                    <span className={styles.structLevel}>{sr.level}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className={styles.evidenceGaps}>
            <div className={`box ${styles.panel} ${styles.evidencePanel}`}>
              <h3 className={styles.panelTitle}>
                <CheckCircle size={18} style={{ color: '#10B981', marginInlineEnd: '0.5rem' }} />
                أدلتك المطابقة ({opp.matchedEvidence?.length || 0})
              </h3>
              {(opp.matchedEvidence || []).length > 0 ? (
                <ul className={styles.list}>
                  {(opp.matchedEvidence || []).map((ev) => (
                    <li key={ev} className={styles.listItem}>
                      <span className={styles.check} aria-hidden="true"><CheckCircle size={14} style={{ color: '#10B981' }} /></span>
                      {ev}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={styles.text}>لا توجد أدلة مطابقة مباشرة بعد. اربط مستودعات GitHub أو أضف مشاريع لإثبات قدراتك.</p>
              )}
            </div>

            <div className={`box ${styles.panel} ${styles.gapPanel}`}>
              <h3 className={styles.panelTitle}>
                <AlertTriangle size={18} style={{ color: '#EF4444', marginInlineEnd: '0.5rem' }} />
                فجواتك المرتبطة ({opp.gaps?.length || 0})
              </h3>
              {(opp.gaps || []).length > 0 ? (
                <ul className={styles.list}>
                  {(opp.gaps || []).map((g) => (
                    <li key={g} className={styles.listItem}>
                      <span className={styles.cross} aria-hidden="true"><XCircle size={14} style={{ color: '#EF4444' }} /></span>
                      {g}
                      <button className="btn ghost" style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem', marginInlineStart: '0.5rem' }}>
                        خطة سد الفجوة
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={styles.text} style={{ color: '#10B981' }}>
                  <CheckCircle size={14} style={{ marginInlineEnd: '0.3rem' }} />
                  لا توجد فجوات — ملفك يغطي جميع المتطلبات الحرجة.
                </p>
              )}
            </div>
          </div>

          <div className={`box ${styles.panel}`}>
            <h3 className={styles.panelTitle}>
              <UserCheck size={18} style={{ color: 'var(--proof)', marginInlineEnd: '0.5rem' }} />
              لماذا أنت مطابق؟ ({opp.whyMatch?.length || 0})
            </h3>
            <ul className={styles.list}>
              {(opp.whyMatch || []).map((reason) => (
                <li key={reason} className={styles.listItem}>
                  <span className={styles.check} aria-hidden="true"><CheckCircle size={14} style={{ color: '#10B981' }} /></span>
                  {reason}
                </li>
              ))}
            </ul>
          </div>

          {(opp.requiredCapabilities || []).length > 0 && (
            <div className={`box ${styles.panel}`}>
              <h3 className={styles.panelTitle}>
                <GitFork size={18} style={{ color: '#F59E0B', marginInlineEnd: '0.5rem' }} />
                القدرات المطلوبة وتفصيل التغطية ({opp.requiredCapabilities?.length || 0})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {(opp.requiredCapabilities || []).map((capName) => {
                  const cap = allCapabilities.find(c => c.name === capName);
                  const isCovered = !!cap?.isVerified;
                  return (
                    <div key={capName} className={styles.capRow}>
                      <div className={styles.capInfo}>
                        <span className={styles.capName}>{capName}</span>
                        <span className={styles.capCategory}>{cap?.category || '—'}</span>
                      </div>
                      <div className={styles.capStatus}>
                        {isCovered ? (
                          <>
                            <Badge variant="proof" size="sm">مثبت ({cap?.strength}%)</Badge>
                            <div style={{ width: '120px' }}>
                              <Bar value={cap?.strength || 0} max={100} label="" variant="proof" size="xs" />
                            </div>
                          </>
                        ) : (
                          <>
                            <Badge variant="claimed" size="sm">غير مثبت</Badge>
                            <div style={{ width: '120px' }}>
                              <Bar value={cap?.strength || 0} max={100} label="" variant="gap" size="xs" />
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <aside className={styles.side}>
          <div className={`box ${styles.ctaPanel}`}>
            <h3 className={styles.panelTitle}>تفاصيل الفرصة</h3>
            <div className={styles.infoRows}>
              <div className={styles.infoRow}>
                <MapPin size={16} style={{ color: 'var(--ink-2)' }} />
                <div>
                  <span className={styles.infoLabel}>الموقع</span>
                  <span className={styles.infoValue}>
                    {opp.location === 'remote' ? 'عن بعد' : opp.location === 'hybrid' ? 'هجين' : 'حضوري'}
                  </span>
                </div>
              </div>
              <div className={styles.infoRow}>
                <MapPin size={16} style={{ color: 'var(--ink-2)' }} />
                <div>
                  <span className={styles.infoLabel}>المدينة</span>
                  <span className={styles.infoValue}>{opp.city}</span>
                </div>
              </div>
              <div className={styles.infoRow}>
                <Briefcase size={16} style={{ color: 'var(--ink-2)' }} />
                <div>
                  <span className={styles.infoLabel}>المجال</span>
                  <span className={styles.infoValue}>{opp.field}</span>
                </div>
              </div>
              <div className={styles.infoRow}>
                <Target size={16} style={{ color: 'var(--ink-2)' }} />
                <div>
                  <span className={styles.infoLabel}>الخبرة</span>
                  <span className={styles.infoValue}>{opp.experience}</span>
                </div>
              </div>
              <div className={styles.infoRow}>
                <DollarSign size={16} style={{ color: 'var(--ink-2)' }} />
                <div>
                  <span className={styles.infoLabel}>التعويض</span>
                  <span className={styles.infoValue}>{opp.compensation}</span>
                </div>
              </div>
              <div className={styles.infoRow}>
                <Calendar size={16} style={{ color: 'var(--ink-2)' }} />
                <div>
                  <span className={styles.infoLabel}>المدة</span>
                  <span className={styles.infoValue}>{opp.duration}</span>
                </div>
              </div>
              <div className={styles.infoRow}>
                <Calendar size={16} style={{ color: 'var(--ink-2)' }} />
                <div>
                  <span className={styles.infoLabel}>تاريخ النشر</span>
                  <span className={styles.infoValue}>{opp.postedDate}</span>
                </div>
              </div>
              {opp.deadline && (
                <div className={styles.infoRow} style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.75rem' }}>
                  <AlertTriangle size={16} style={{ color: '#F59E0B' }} />
                  <div>
                    <span className={styles.infoLabel}>الموعد النهائي</span>
                    <span className={styles.infoValue} style={{ color: '#F59E0B', fontWeight: 700 }}>
                      {new Date(opp.deadline).toLocaleDateString('ar-EG')}
                      {' '}
                      (<span style={{ fontSize: '0.75rem', fontWeight: 400 }}>
                        {Math.ceil((new Date(opp.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} يوم
                      </span>)
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '1.5rem' }}>
              <button className="btn dark" style={{ width: '100%' }} onClick={() => navigate(`/opportunities/${opp.id}/apply`)}>
                <GitFork size={14} /> تقديم على الفرصة
              </button>
              <button className="btn ghost" style={{ width: '100%' }} onClick={() => navigate(`/opportunities/${opp.id}/match`)}>
                <Target size={14} /> تفصيل المطابقة الكاملة
              </button>
              <button className="btn ghost" style={{ width: '100%' }} onClick={() => navigate(ROUTES.M20_CREATE)}>
                <Users size={14} /> تشكيل فريق لهذه الفرصة
              </button>
              <button className="btn ghost" style={{ width: '100%' }} onClick={() => navigate(ROUTES.M17_OVERVIEW)}>
                <ArrowRight size={14} /> رجوع
              </button>
            </div>
          </div>

          <div className={`box ${styles.ctaPanel}`}>
            <h3 className={styles.panelTitle}>نسبة المطابقة التفصيلية</h3>
            <Bar value={opp.matchScore} max={100} label="مطابقة عامة" variant={opp.matchScore >= 80 ? 'proof' : 'gap'} />
            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>المتطلبات الحرجة مغطاة</span>
                <span className="num" style={{ color: '#10B981' }}>
                  {opp.structuredRequirements?.filter(sr => sr.importance === 'critical').length || 0} /
                  {opp.structuredRequirements?.filter(sr => sr.importance === 'critical').length || 0}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>المتطلبات المفضلة مغطاة</span>
                <span className="num" style={{ color: '#F59E0B' }}>
                  {opp.structuredRequirements?.filter(sr => sr.importance === 'preferred').length || 0} /
                  {opp.structuredRequirements?.filter(sr => sr.importance === 'preferred').length || 0}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>فجوات حرجة</span>
                <span className="num" style={{ color: '#EF4444' }}>
                  {opp.gaps?.filter(g => g.includes('حرج') || g.includes('critical')).length || 0}
                </span>
              </div>
            </div>
          </div>

          <div className={`box ${styles.ctaPanel}`}>
            <h3 className={styles.panelTitle}>الإجراءات السريعة</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <a
                href="#"
                target="_blank"
                rel="noreferrer"
                className="btn outline"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <ExternalLink size={14} /> عرض المصدر الأصلي
              </a>
              <button className="btn ghost" style={{ width: '100%', justifyContent: 'center' }} onClick={() => navigate(ROUTES.M17_OVERVIEW)}>
                <ArrowRight size={14} /> العودة للقائمة
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default M17DetailsPage;