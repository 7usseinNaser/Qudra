import { useLocation, useNavigate } from 'react-router-dom';
import {
  FolderGit2,
  Cpu,
  ShieldCheck,
  Sparkles,
  User,
  Sun,
  Moon,
  Home
} from 'lucide-react';
import { ROUTES } from '../../constants/routes';
import { useRole } from '../../contexts/useRole';
import type { Role } from '../../contexts/role-context-types';
import { useTheme } from '../../contexts/useTheme';
import { QudraLogo } from '../ui/QudraLogo';
import { ProfileEditorService } from '../../services/profile-editor.service';
import styles from './TopBar.module.css';

const STEPS = [
  { path: ROUTES.PROBLEM, label: 'المشكلة' },
  { path: ROUTES.CAPABILITIES, label: 'القدرات' },
  { path: ROUTES.SIMULATION, label: 'المحاكاة' },
  { path: ROUTES.EVALUATION, label: 'التقييم' },
  { path: ROUTES.SKILL_DNA, label: 'Skill DNA' },
  { path: ROUTES.RESULT, label: 'النتيجة' },
];

export function TopBar() {
  const { role, switchRole } = useRole();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const pathname = location.pathname;
  const currentStepIndex = STEPS.findIndex((s) => s.path === pathname);

  const profile = ProfileEditorService.getProfile();

  const handleRoleChange = (newRole: Role) => {
    switchRole(newRole);
    if (newRole === 'c') {
      navigate('/problems/match-report');
    } else {
      navigate('/profile/edit');
    }
  };

  const navItems = [
    { label: 'الرئيسية', path: '/', icon: <Home size={15} /> },
    { label: 'البروفايل المهني', path: '/profile/edit', icon: <User size={15} /> },
    { label: 'مستكشف الكود و GitHub', path: '/evidence/github/inspector', icon: <FolderGit2 size={15} /> },
    { label: 'مختبر التحديات', path: '/challenges/sandbox', icon: <Cpu size={15} /> },
    { label: 'المشكلات والمطابقة', path: '/problems/match-report', icon: <Sparkles size={15} /> },
    { label: 'جواز القدرات', path: '/passport', icon: <ShieldCheck size={15} /> },
  ];

  return (
    <header className={styles.topbar} dir="rtl">
      <div className={`wrap ${styles.in}`}>
        {/* Brand Group */}
        <button
          className={styles.brand}
          onClick={() => navigate('/')}
          title="قُدرة — منصة إثبات الكفاءات"
        >
          <QudraLogo size={32} aria-hidden="true" />
          <div className={styles.brandTextGroup}>
            <span className={styles.nm}>قُدرة</span>
            <span className={styles.tagline}>Evidence Intelligence OS</span>
          </div>
        </button>

        {/* Center Primary Navigation */}
        <nav className={styles.centerNav} aria-label="التنقل الرئيسي">
          {navItems.map((item) => {
            const isActive = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path));
            return (
              <button
                key={item.path}
                className={`${styles.navLink} ${isActive ? styles.active : ''}`}
                onClick={() => navigate(item.path)}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right User & Controls */}
        <div className={styles.whoami}>
          {/* Role Switcher */}
          <div className={styles.roles} role="tablist" aria-label="تبديل المنظور">
            <button
              role="tab"
              aria-selected={role === 'u'}
              onClick={() => handleRoleChange('u')}
              title="واجهة المهندس وصاحب الكفاءة"
            >
              مهندس
            </button>
            <button
              role="tab"
              aria-selected={role === 'c'}
              onClick={() => handleRoleChange('c')}
              title="واجهة الشركات وأصحاب المشكلات"
            >
              شركة
            </button>
          </div>

          {/* User Pill */}
          <div
            className={styles.userCard}
            onClick={() => navigate('/profile/edit')}
            title="فتح وتعديل ملفك الشخصي"
          >
            <img
              src={profile.avatarUrl}
              alt={profile.fullName}
              className={styles.av}
            />
            <span className={styles.navName}>{profile.fullName.split(' ')[0]}</span>
          </div>

          {/* Theme Switcher */}
          <button
            className={styles.themebtn}
            onClick={toggleTheme}
            aria-label="تبديل المظهر"
            title="تبديل الوضع الداكن/الفاتح"
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </div>
      </div>

      {/* Problem Stepper if inside step-by-step problem flow */}
      {role === 'c' && currentStepIndex !== -1 && (
        <div className={styles.stepper}>
          <div className="wrap">
            <nav className={styles.stepNav} aria-label="خطوات المطابقة">
              {STEPS.map((s, idx) => {
                const isCurrent = idx === currentStepIndex;
                const isDone = idx < currentStepIndex;
                return (
                  <button
                    key={s.path}
                    className={`${styles.stepBtn} ${isDone ? styles.done : ''}`}
                    aria-current={isCurrent ? 'step' : undefined}
                    onClick={() => navigate(s.path)}
                  >
                    <span className={styles.n}>{idx + 1}</span>
                    <span>{s.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
