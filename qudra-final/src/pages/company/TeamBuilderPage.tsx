import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { Tag } from '../../components/ui/Tag';
import { Badge } from '../../components/ui/Badge';
import styles from './TeamBuilderPage.module.css';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  capabilities: string[];
  selected: boolean;
}

const REQUIRED_CAPS = ['FastAPI', 'PostgreSQL', 'React', 'Docker', 'UI/UX Design'];

const AVAILABLE: TeamMember[] = [
  { id: 'lina', name: 'لينا الحربي', role: 'Senior Backend', capabilities: ['FastAPI', 'PostgreSQL', 'Docker'], selected: true },
  { id: 'mohammed', name: 'محمد الدوسري', role: 'Senior Backend', capabilities: ['Node.js', 'REST APIs', 'Docker'], selected: false },
  { id: 'majid', name: 'ماجد الشمري', role: 'Mid Backend', capabilities: ['Node.js', 'REST APIs'], selected: false },
  { id: 'reem', name: 'ريم القحطاني', role: 'Frontend', capabilities: ['React', 'Flutter'], selected: true },
  { id: 'sara', name: 'سارة العتيبي', role: 'Full Stack', capabilities: ['Python', 'React'], selected: false },
];

export function TeamBuilderPage() {
  const navigate = useNavigate();
  const [members, setMembers] = useState<TeamMember[]>(AVAILABLE);

  const selectedMembers = members.filter((m) => m.selected);
  const coveredCaps = new Set(selectedMembers.flatMap((m) => m.capabilities));
  const missingCaps = REQUIRED_CAPS.filter((c) => !coveredCaps.has(c));
  const completeness = Math.round(((REQUIRED_CAPS.length - missingCaps.length) / REQUIRED_CAPS.length) * 100);

  const toggleMember = (id: string) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, selected: !m.selected } : m)));
  };

  return (
    <main id="main" className="wrap" tabIndex={-1} dir="rtl" style={{ padding: 'clamp(1.5rem,4vw,2.75rem) 0 5rem' }}>
      <button className="btn ghost" onClick={() => navigate(ROUTES.PROBLEM_CANDIDATES)} style={{ marginBottom: '0.8rem' }}>
        ← المرشحون
      </button>
      <h1 className="scr-t">بناء الفريق</h1>
      <p className="scr-p">اختر المرشحين لتغطية القدرات المطلوبة. راجع مصفوفة التغطية.</p>

      <div className={`box ${styles.completenessBox}`}>
        <div className={styles.completenessHead}>
          <span className={styles.completenessLabel}>اكتمال الفريق</span>
          <span className={`${styles.completenessVal} num`}>{completeness}%</span>
        </div>
        <div className={styles.completenessBar}>
          <i style={{ width: `${completeness}%` }} />
        </div>
        {missingCaps.length > 0 ? (
          <div className={styles.missingCaps}>
            <span className={styles.missingLabel}>قدرات غير مغطاة:</span>
            {missingCaps.map((c) => (
              <Tag key={c} name={c} variant="claimed" size="sm" />
            ))}
          </div>
        ) : (
          <Badge variant="proof">✓ الفريق مكتمل</Badge>
        )}
      </div>

      <div className={`box ${styles.coverageSection}`}>
        <h2 className={styles.sectionTitle}>مصفوفة التغطية</h2>
        <div className={styles.coverageTable}>
          <div className={styles.coverageHeader}>
            <span>القدرة</span>
            <span>الحالة</span>
            <span>المسؤول</span>
          </div>
          {REQUIRED_CAPS.map((cap) => {
            const responsible = selectedMembers.find((m) => m.capabilities.includes(cap));
            return (
              <div key={cap} className={styles.coverageRow}>
                <Tag name={cap} variant={responsible ? 'proven' : 'claimed'} size="sm" />
                <span className={responsible ? styles.covered : styles.uncovered}>
                  {responsible ? 'مغطاة' : 'غير مغطاة'}
                </span>
                <span className={styles.responsible}>{responsible?.name || '—'}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className={`box ${styles.membersSection}`}>
        <h2 className={styles.sectionTitle}>المرشحون المتاحون</h2>
        <div className={styles.membersList}>
          {members.map((m) => (
            <button
              key={m.id}
              className={`${styles.memberCard} ${m.selected ? styles.memberSelected : ''}`}
              onClick={() => toggleMember(m.id)}
            >
              <div className={styles.memberHead}>
                <span className={styles.memberAvatar}>{m.name.charAt(0)}</span>
                <div className={styles.memberInfo}>
                  <span className={styles.memberName}>{m.name}</span>
                  <span className={styles.memberRole}>{m.role}</span>
                </div>
                <span className={styles.memberCheck}>{m.selected ? '✓' : ''}</span>
              </div>
              <div className={styles.memberTags}>
                {m.capabilities.map((c) => (
                  <Tag key={c} name={c} variant="proven" size="sm" />
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.actions}>
        <button className="btn ghost" onClick={() => navigate(ROUTES.PROBLEM_CANDIDATES)}>
          رجوع
        </button>
        <button
          className="btn dark"
          disabled={selectedMembers.length === 0}
          onClick={() => navigate(ROUTES.COMPANY_HOME)}
        >
          دعوة الفريق ({selectedMembers.length})
        </button>
      </div>
    </main>
  );
}

export default TeamBuilderPage;
