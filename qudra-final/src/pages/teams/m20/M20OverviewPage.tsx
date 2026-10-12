import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Bar } from '../../../components/ui/Bar';
import { QudraStore } from '../../../services/store';
import type { Team } from '../../../services/types';
import { ROUTES } from '../../../constants/routes';
import { M20EmptyPage } from './M20EmptyPage';
import styles from './m20.module.css';
import { PlusCircle, Sparkles, Info, Users, Target, CheckCircle, AlertTriangle, Trophy, TrendingUp, ArrowRight, GitFork } from 'lucide-react';

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
  forming: 'قيد التشكيل',
  active: 'نشط',
  completed: 'مكتمل',
  archived: 'مؤرشف',
};

const STATUS_VARIANT: Record<string, 'proof' | 'gap' | 'claimed' | 'info'> = {
  forming: 'claimed',
  active: 'proof',
  completed: 'info',
  archived: 'gap',
};

export const M20OverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [showExplain, setShowExplain] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await new Promise(res => setTimeout(res, 400));
      setTeams(QudraStore.getTeams());
      setLoading(false);
    };
    loadData();
  }, []);

  const activeTeams = teams.filter(t => t.status === 'active' || t.status === 'forming');
  const completedTeams = teams.filter(t => t.status === 'completed');
  const avgHarmony = teams.length > 0
    ? Math.round(teams.reduce((sum, t) => sum + t.harmonyScore, 0) / teams.length)
    : 0;
  const avgCoverage = teams.length > 0
    ? Math.round(teams.reduce((sum, t) => sum + t.coveragePercentage, 0) / teams.length)
    : 0;

  if (loading) {
    return (
      <div className={styles.container} dir="rtl">
        <div className={styles.loadingState}>
          <div className={styles.spinner} />
          <span>جاري تحميل فرقك...</span>
        </div>
      </div>
    );
  }

  if (teams.length === 0) {
    return (
      <div className={styles.container} dir="rtl">
        <M20EmptyPage />
      </div>
    );
  }

  return (
    <div className={styles.container} dir="rtl">
      <div className={styles.headerRow}>
        <div className={styles.headerContent}>
          <span className={styles.badgeQ}>M20 · Q-0761 · ⚓ Overview</span>
          <span className={styles.demoBadge}>[Demo / تجريبي] بيانات فرق محاكاة</span>
          <h1 className={styles.title}>مُركِّب الفرق: فرقك ومصفوفات التغطية</h1>
          <p className={styles.subtitle}>
            كل فريق يعرض تناغم الأعضاء (Harmony Score) ونسبة تغطية الثغرات (Coverage %) بصرياً.
            الخوارزمية ترشح الأعضاء بناءً على قدرات مثبتة (Proven) وتوزع الأدوار لتغطية 100% من المتطلبات.
          </p>
        </div>

        <div className={styles.actionRow}>
          <Button
            variant="proof"
            size="md"
            onClick={() => navigate(ROUTES.M20_CREATE)}
            leftIcon={<PlusCircle size={16} />}
          >
            تشكيل فريق جديد
          </Button>

          <Button
            variant="outline"
            size="md"
            onClick={() => setShowExplain(!showExplain)}
            leftIcon={<Sparkles size={16} />}
          >
            {showExplain ? 'إخفاء التفسير' : 'اشرح لي: خوارزمية تركيب الفرق'}
          </Button>
        </div>
      </div>

      {showExplain && (
        <div className={styles.explainDrawer}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
            <Info size={18} color="var(--proof)" />
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: 'var(--ink)' }}>
              تفسير الذكاء الاصطناعي: كيف يعمل تركيب الفرق
            </h3>
          </div>
          <p style={{ margin: '0 0 1rem', fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--ink-2)' }}>
            عند اختيار فرصة (M17) أو مشكلة، يستخرج المحرك <strong>المتطلبات المنظمة</strong> (Structured Requirements).
            ثم يبحث في قاعدة المرشحين عن أشخاص لديهم <strong>قدرات مثبتة بأدلة</strong> (Verified Capabilities + Evidences) تغطي هذه المتطلبات.
            <br />• <strong>Harmony Score</strong>: يقيس تناغم الفريق — تداخل الخبرات، تنوع الأدوار، وتاريخ العمل المشترك.
            <br />• <strong>Coverage %</strong>: نسبة المتطلبات الحرجة والمفضلة المغطاة بقدرات مثبتة (وليس ادعاءات).
            <br />• كل عضو يظهر بقدراته المثبتة والم ادعاة — فجواته واضحة وقابلة للسد عبر M21.
          </p>
          <div className={styles.grid3} style={{ marginBottom: 0 }}>
            <div className={styles.metricBox}>
              <span className={styles.metricLabel}>Proven ≠ Claimed</span>
              <span className={styles.metricHint}>التغطية تُحسب من القدرات المثبتة فقط — الادعاءات لا تدخل في Coverage %</span>
            </div>
            <div className={styles.metricBox}>
              <span className={styles.metricLabel}>تناغم الفريق</span>
              <span className={styles.metricHint}>خوارزمية توزع الأدوار لتقليل التداخل وزيادة التكامل</span>
            </div>
            <div className={styles.metricBox}>
              <span className={styles.metricLabel}>مسار سد الفجوات</span>
              <span className={styles.metricHint}>من كل فجوة في الفريق → تحدي / مورد / مشروع في M21</span>
            </div>
          </div>
        </div>
      )}

      <div className={styles.grid4}>
        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>إجمالي الفرق</span>
          <span className={styles.metricValue}><span className="num">{teams.length}</span></span>
          <span className={styles.metricHint}>{activeTeams.length} نشطة، {completedTeams.length} مكتملة</span>
        </div>
        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>متوسط التناغم</span>
          <span className={styles.metricValue} style={{ color: 'var(--proof)' }}><span className="num">{avgHarmony}</span>%</span>
          <span className={styles.metricHint}>درجة تكامل الأعضاء وتوزيع الأدوار</span>
        </div>
        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>متوسط التغطية</span>
          <span className={styles.metricValue} style={{ color: '#10B981' }}><span className="num">{avgCoverage}</span>%</span>
          <span className={styles.metricHint}>نسبة المتطلبات المغطاة بقدرات مثبتة</span>
        </div>
        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>أعضاء نشطون</span>
          <span className={styles.metricValue}><span className="num">{teams.reduce((sum, t) => sum + t.members.filter(m => m.status === 'active').length, 0)}</span></span>
          <span className={styles.metricHint}>إجمالي المساهمين في الفرق النشطة</span>
        </div>
      </div>

      <div className={styles.filterBar}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>التصفية</label>
          <div className={styles.typeFilters}>
            <button className={`${styles.typeFilterBtn} active`}>جميع الفرق</button>
            <button className={styles.typeFilterBtn}>نشطة ({activeTeams.length})</button>
            <button className={styles.typeFilterBtn}>مكتملة ({completedTeams.length})</button>
            <button className={styles.typeFilterBtn}>قيد التشكيل ({teams.filter(t => t.status === 'forming').length})</button>
          </div>
        </div>
      </div>

      <h2 className={styles.sectionTitle}>فرِقك</h2>

      <div className={styles.teamGrid}>
        {teams.map((team) => (
          <div key={team.id} className={styles.teamCard}>
            <div className={styles.teamCardHead}>
              <div>
                <h3 className={styles.teamTitle}>{team.name}</h3>
                <span className={styles.teamDesc}>{team.description}</span>
              </div>
              <Badge variant={STATUS_VARIANT[team.status]} size="sm">{STATUS_LABEL[team.status]}</Badge>
            </div>

            <div className={styles.teamMetrics}>
              <div className={styles.metricItem}>
                <Target size={14} style={{ color: 'var(--proof)' }} />
                <div>
                  <div className={styles.metricValueSmall}>{team.coveragePercentage}%</div>
                  <div className={styles.metricLabelSmall}>تغطية</div>
                </div>
              </div>
              <div className={styles.metricItem}>
                <Users size={14} style={{ color: '#F59E0B' }} />
                <div>
                  <div className={styles.metricValueSmall}>{team.members.length}</div>
                  <div className={styles.metricLabelSmall}>أعضاء</div>
                </div>
              </div>
              <div className={styles.metricItem}>
                <Trophy size={14} style={{ color: '#10B981' }} />
                <div>
                  <div className={styles.metricValueSmall}>{team.harmonyScore}%</div>
                  <div className={styles.metricLabelSmall}>تناغم</div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '0.5rem' }}>
              <Bar value={team.coveragePercentage} max={100} label="" variant={team.coveragePercentage >= 80 ? 'proof' : 'gap'} size="xs" />
            </div>

            <div className={styles.coveragePreview}>
              <span className={styles.coverageLabel}>مصفوفة التغطية:</span>
              <div className={styles.coverageTags}>
                {team.requiredCapabilities.slice(0, 5).map((cap) => {
                  const covered = team.members.some(m => m.verifiedCapabilities.includes(cap) || m.capabilities.includes(cap));
                  return (
                    <Badge key={cap} variant={covered ? 'proof' : 'gap'} size="xs">
                      {cap}
                    </Badge>
                  );
                })}
                {team.requiredCapabilities.length > 5 && (
                  <Badge variant="claimed" size="xs">+{team.requiredCapabilities.length - 5} أخرى</Badge>
                )}
              </div>
            </div>

            <div className={styles.teamMembers}>
              {team.members.slice(0, 4).map((member) => (
                <div key={member.id} className={styles.memberAvatar} title={member.name}>
                  <span>{member.name.charAt(0)}</span>
                  <span className={styles.roleBadge}>{ROLE_ICON[member.role] || '👤'}</span>
                </div>
              ))}
              {team.members.length > 4 && (
                <div className={styles.memberAvatar} style={{ background: 'var(--proof)', color: 'white' }}>
                  +{team.members.length - 4}
                </div>
              )}
            </div>

            <div className={styles.teamActions}>
              <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.M20_DETAILS.replace(':id', team.id))} style={{ flex: 1 }}>
                <GitFork size={14} /> التفاصيل
              </Button>
              <Button variant="proof" size="sm" onClick={() => navigate(ROUTES.M21_CREATE)} style={{ flex: 1 }}>
                <ArrowRight size={14} /> مساحة العمل
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.insightCard}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <TrendingUp size={20} style={{ color: 'var(--proof)' }} />
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--ink)' }}>
            رؤى سريعة
          </h3>
        </div>
        <div className={styles.insightGrid}>
          <div className={styles.insightItem}>
            <CheckCircle size={18} style={{ color: '#10B981' }} />
            <div>
              <div style={{ fontWeight: 600, color: 'var(--ink)' }}>
                {teams.filter(t => t.coveragePercentage === 100).length} فرق بتغطية 100%
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--ink-2)' }}>جاهزة للتسليم الفوري</div>
            </div>
          </div>
          <div className={styles.insightItem}>
            <AlertTriangle size={18} style={{ color: '#EF4444' }} />
            <div>
              <div style={{ fontWeight: 600, color: 'var(--ink)' }}>
                {teams.filter(t => t.coveragePercentage < 70).length} فرق بتغطية { '<' } 70%
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--ink-2)' }}>تحتاج أعضاء إضافيين أو سد فجوات</div>
            </div>
          </div>
          <div className={styles.insightItem}>
            <Target size={18} style={{ color: 'var(--proof)' }} />
            <div>
              <div style={{ fontWeight: 600, color: 'var(--ink)' }}>
                أعلى تناغم: {teams.reduce((max, t) => t.harmonyScore > max.harmonyScore ? t : max, teams[0])?.name || '—'}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--ink-2)' }}>{Math.max(...teams.map(t => t.harmonyScore))}%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default M20OverviewPage;







