import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QudraStore } from '../../../services/store';
import { ROUTES } from '../../../constants/routes';
import { Badge } from '../../../components/ui/Badge';
import { Bar } from '../../../components/ui/Bar';
import { Button } from '../../../components/ui/Button';
import { EmptyState } from '../../../components/ui/EmptyState';
import styles from './m20.module.css';
import { ArrowRight, Users, Target, AlertTriangle, ArrowLeft, TrendingUp, Award, UserCheck, Sparkles } from 'lucide-react';

const ROLE_LABEL: Record<string, string> = {
  lead: 'قائد تقني',
  backend: 'مطور Backend',
  frontend: 'مطور Frontend',
  fullstack: 'Full Stack',
  devops: 'DevOps',
  designer: 'مصمم UI/UX',
  pm: 'مدير منتج',
  qa: 'مهندس جودة',
  ai_ml: 'مهندس AI/ML',
  data: 'مهندس بيانات',
};

const ROLE_ICON: Record<string, string> = {
  lead: '👑',
  backend: '⚙️',
  frontend: '🎨',
  fullstack: '🔧',
  devops: '☁️',
  designer: '🎯',
  pm: '📋',
  qa: '🔍',
  ai_ml: '🤖',
  data: '📊',
};

const STATUS_LABEL: Record<string, string> = {
  invited: 'مدعو',
  active: 'نشط',
  completed: 'مكتمل',
  left: 'غادر',
};

const STATUS_VARIANT: Record<string, 'proof' | 'gap' | 'claimed' | 'neutral'> = {
  invited: 'claimed',
  active: 'proof',
  completed: 'neutral',
  left: 'gap',
};

export const M20DetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const team = useMemo(
    () => QudraStore.getTeams().find((t) => t.id === id),
    [id],
  );

  if (!team) {
    return (
      <div className={styles.container} dir="rtl">
        <EmptyState
          title="لم نعثر على هذا الفريق"
          description="ربما تم حذفه أو أن الرابط غير صحيح."
          action={<button className="btn dark" onClick={() => navigate(ROUTES.M20_OVERVIEW)}>العودة للفرق</button>}
        />
      </div>
    );
  }

  const activeMembers = team.members.filter(m => m.status === 'active');
  const totalCapabilities = team.requiredCapabilities.length;
  const coveredCapabilities = team.requiredCapabilities.filter(cap => 
    team.members.some(m => m.verifiedCapabilities.includes(cap) || m.capabilities.includes(cap))
  ).length;
  const gapCapabilities = team.requiredCapabilities.filter(cap => 
    !team.members.some(m => m.verifiedCapabilities.includes(cap) || m.capabilities.includes(cap))
  );

  return (
    <div className={styles.container} dir="rtl">
      <div className={styles.headRow}>
        <div>
          <button className="btn ghost" onClick={() => navigate(ROUTES.M20_OVERVIEW)} style={{ marginBottom: '0.8rem' }}>
            <ArrowLeft size={14} /> الفرق
          </button>
          <h1 className={styles.title}>{team.name}</h1>
          <p className={styles.desc}>{team.description}</p>
        </div>
        <div className={styles.matchBox}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <span className={`${styles.matchNum} ${team.coveragePercentage >= 80 ? styles.highMatch : ''}`}>
              {team.coveragePercentage}%
            </span>
            <span className={styles.matchLabel}>تغطية</span>
            <Badge variant={team.harmonyScore >= 80 ? 'proof' : team.harmonyScore >= 60 ? 'claimed' : 'gap'} size="sm">
              تناغم {team.harmonyScore}%
            </Badge>
          </div>
          <Bar value={team.coveragePercentage} max={100} label="" variant={team.coveragePercentage >= 80 ? 'proof' : 'gap'} size="sm" />
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.main}>
          <div className={`box ${styles.panel}`}>
            <h3 className={styles.panelTitle}>
              <Users size={18} style={{ color: 'var(--proof)', marginInlineEnd: '0.5rem' }} />
              أعضاء الفريق ({team.members.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {team.members.map((member) => (
                <div key={member.id} className={styles.memberDetail}>
                  <div className={styles.memberHead}>
                    <div className={styles.memberAvatarLarge}>
                      <span>{member.name.charAt(0)}</span>
                    </div>
                    <div className={styles.memberInfo}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span className={styles.memberName}>{member.name}</span>
                        <Badge variant={STATUS_VARIANT[member.status]} size="xs">{STATUS_LABEL[member.status]}</Badge>
                        <span className={styles.roleBadge}>{ROLE_ICON[member.role] || '👤'} {ROLE_LABEL[member.role]}</span>
                      </div>
                      <span className={styles.memberUsername}>@{member.username}</span>
                    </div>
                    <div className={styles.memberScore}>
                      <span className={styles.scoreLabel}>مطابقة</span>
                      <span className={`${styles.scoreValue} ${member.matchScore >= 80 ? styles.highScore : member.matchScore >= 60 ? styles.midScore : styles.lowScore}`}>
                        {member.matchScore}%
                      </span>
                    </div>
                  </div>

                  <div className={styles.memberCaps}>
                    <div className={styles.capGroup}>
                      <span className={styles.capGroupLabel}>مثبتة ({member.verifiedCapabilities.length})</span>
                      <div className={styles.capTags}>
                        {member.verifiedCapabilities.map(cap => (
                          <Badge key={cap} variant="proof" size="xs">{cap}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className={styles.capGroup}>
                      <span className={styles.capGroupLabel}>م ادعاة ({member.claimedCapabilities.length})</span>
                      <div className={styles.capTags}>
                        {member.claimedCapabilities.map(cap => (
                          <Badge key={cap} variant="claimed" size="xs">{cap}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {member.contributionScore !== undefined && (
                    <div className={styles.contributionBar}>
                      <span className={styles.capGroupLabel}>مساهمة: {member.contributionScore}%</span>
                      <div style={{ flex: 1 }}>
                        <Bar value={member.contributionScore} max={100} label="" variant="proof" size="xs" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className={`box ${styles.panel}`}>
            <h3 className={styles.panelTitle}>
              <Target size={18} style={{ color: '#F59E0B', marginInlineEnd: '0.5rem' }} />
              مصفوفة التغطية الكاملة ({coveredCapabilities} / {totalCapabilities})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {team.requiredCapabilities.map((cap) => {
                const responsible = team.members.find(m => m.verifiedCapabilities.includes(cap) || m.capabilities.includes(cap));
                const isVerified = !!team.members.find(m => m.verifiedCapabilities.includes(cap));
                return (
                  <div key={cap} className={styles.coverageRow}>
                    <div className={styles.coverageCap}>
                      <Badge variant={isVerified ? 'proof' : responsible ? 'claimed' : 'gap'} size="sm">
                        {cap}
                      </Badge>
                      {responsible && !isVerified && (
                        <span className={styles.claimedBadge}>م ادعاء</span>
                      )}
                    </div>
                    <div className={styles.coverageStatus}>
                      {responsible ? (
                        <span className={isVerified ? styles.covered : styles.claimed}>
                          {isVerified ? 'مغطاة ✓' : 'م ادعاء ⚠'}
                        </span>
                      ) : (
                        <span className={styles.uncovered}>غير مغطاة ✗</span>
                      )}
                    </div>
                    <div className={styles.coverageOwner}>
                      {responsible ? responsible.name : '—'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {gapCapabilities.length > 0 && (
            <div className={`box ${styles.panel} ${styles.gapPanel}`}>
              <h3 className={styles.panelTitle}>
                <AlertTriangle size={18} style={{ color: '#EF4444', marginInlineEnd: '0.5rem' }} />
                فجوات الفريق ({gapCapabilities.length}) — إجراءات مقترحة
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {gapCapabilities.map((cap) => (
                  <div key={cap} className={styles.gapAction}>
                    <span className={styles.gapCap}>
                      <Badge variant="gap" size="sm">{cap}</Badge>
                    </span>
                    <div className={styles.gapActions}>
                      <button className="btn ghost" style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}>
                        <UserCheck size={12} /> البحث عن عضو
                      </button>
                      <button className="btn ghost" style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}>
                        <Sparkles size={12} /> تحدي عملي
                      </button>
                      <button className="btn ghost" style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}>
                        <Award size={12} /> تدريب
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className={styles.side}>
          <div className={`box ${styles.ctaPanel}`}>
            <h3 className={styles.panelTitle}>معلومات الفريق</h3>
            <div className={styles.infoRows}>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>الحالة</span>
                <Badge variant={STATUS_VARIANT[team.status]}>{STATUS_LABEL[team.status]}</Badge>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>تناغم الفريق</span>
                <span className={styles.infoValue}><strong>{team.harmonyScore}%</strong></span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>تغطية القدرات</span>
                <span className={styles.infoValue}><strong>{team.coveragePercentage}%</strong></span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>الأعضاء النشطون</span>
                <span className={styles.infoValue}><strong>{activeMembers.length}</strong> / {team.members.length}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>القدرات المطلوبة</span>
                <span className={styles.infoValue}><strong>{totalCapabilities}</strong></span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>تاريخ الإنشاء</span>
                <span className={styles.infoValue}>{new Date(team.createdAt).toLocaleDateString('ar-EG')}</span>
              </div>
              {team.opportunityId && (
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>مرتبطة بفرصة</span>
                  <span className={styles.infoValue}><strong>{team.opportunityId}</strong></span>
                </div>
              )}
            </div>
          </div>

          <div className={`box ${styles.ctaPanel}`}>
            <h3 className={styles.panelTitle}>الإجراءات</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <Button variant="proof" size="md" onClick={() => navigate(ROUTES.M21_CREATE)} leftIcon={<ArrowRight size={14} />} style={{ width: '100%' }}>
                فتح مساحة العمل (M21)
              </Button>
              <Button variant="outline" size="md" onClick={() => navigate(ROUTES.M20_CREATE)} leftIcon={<Users size={14} />} style={{ width: '100%' }}>
                تعديل الفريق
              </Button>
              <Button variant="ghost" size="md" onClick={() => navigate(ROUTES.M20_OVERVIEW)} leftIcon={<ArrowLeft size={14} />} style={{ width: '100%' }}>
                العودة للقائمة
              </Button>
            </div>
          </div>

          <div className={`box ${styles.ctaPanel}`}>
            <h3 className={styles.panelTitle}>
              <TrendingUp size={18} style={{ color: '#F59E0B', marginInlineEnd: '0.5rem' }} />
              مؤشرات الصحة
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                  <span>تناغم الفريق</span>
                  <span className="num">{team.harmonyScore}%</span>
                </div>
                <Bar value={team.harmonyScore} max={100} label="" variant={team.harmonyScore >= 80 ? 'proof' : 'gap'} size="xs" />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                  <span>تغطية القدرات</span>
                  <span className="num">{team.coveragePercentage}%</span>
                </div>
                <Bar value={team.coveragePercentage} max={100} label="" variant={team.coveragePercentage >= 80 ? 'proof' : 'gap'} size="xs" />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                  <span>أعضاء نشطون</span>
                  <span className="num">{activeMembers.length}/{team.members.length}</span>
                </div>
                <Bar value={Math.round((activeMembers.length / team.members.length) * 100)} max={100} label="" variant="accent" size="xs" />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                  <span>قدرات مثبتة</span>
                  <span className="num">{coveredCapabilities}/{totalCapabilities}</span>
                </div>
                <Bar value={Math.round((coveredCapabilities / totalCapabilities) * 100)} max={100} label="" variant="proof" size="xs" />
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default M20DetailsPage;