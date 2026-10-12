import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styles from './m12.module.css';

const anchors = [
  { path: '/oral/overview', label: 'نظرة عامة', qid: 'Q-0441' },
  { path: '/oral/details', label: 'التفاصيل', qid: 'Q-0443' },
  { path: '/oral/create', label: 'إنشاء/جدولة', qid: 'Q-0444' },
  { path: '/oral/results', label: 'النتائج', qid: 'Q-0447' },
  { path: '/oral/empty', label: 'فارغ', qid: 'Q-0469' },
  { path: '/oral/error', label: 'خطأ', qid: 'Q-0471' },
] as const;

export const M12AnchorNav: React.FC = () => {
  const location = useLocation();

  return (
    <nav className={styles.anchorNav} aria-label="ممرات وحدة التحقق الشفهي M12">
      <ol className={styles.anchorList}>
        {anchors.map((a) => {
          const isActive = location.pathname === a.path;
          return (
            <li key={a.path} className={styles.anchorItem}>
              <NavLink
                to={a.path}
                className={({ isActive: active }) =>
                  `${styles.anchorLink} ${active ? styles.active : ''}`
                }
                aria-current={isActive ? 'page' : undefined}
              >
                <span className={styles.anchorQid}>{a.qid}</span>
                <span className={styles.anchorLabel}>{a.label}</span>
                {isActive && <span className={styles.anchorIndicator} aria-hidden="true" />}
              </NavLink>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default M12AnchorNav;