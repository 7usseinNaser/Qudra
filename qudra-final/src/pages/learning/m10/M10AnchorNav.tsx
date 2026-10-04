import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styles from './m10.module.css';

const anchors = [
  { path: '/learn/overview', label: 'نظرة عامة', qid: 'Q-0361' },
  { path: '/learn/details', label: 'التفاصيل', qid: 'Q-0363' },
  { path: '/learn/create', label: 'إنشاء', qid: 'Q-0364' },
  { path: '/learn/results', label: 'النتائج', qid: 'Q-0367' },
  { path: '/learn/empty', label: 'فارغ', qid: 'Q-0389' },
  { path: '/learn/error', label: 'خطأ', qid: 'Q-0391' },
] as const;

export const M10AnchorNav: React.FC = () => {
  const location = useLocation();

  return (
    <nav className={styles.anchorNav} aria-label="ممرات وحدة التعلم M10">
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

export default M10AnchorNav;