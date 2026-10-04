import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './AnchorNav.module.css';

interface AnchorLink {
  id: string;
  label: string;
  path: string;
  icon?: React.ReactNode;
}

interface AnchorNavProps {
  anchors: AnchorLink[];
  title?: string;
}

export const AnchorNav: React.FC<AnchorNavProps> = ({ anchors, title }) => {
  return (
    <nav className={styles.anchorNav} aria-label={title || 'شاشات الارتكاز'}>
      {title && (
        <span className={styles.title} aria-hidden="true">{title}</span>
      )}
      <div className={styles.links}>
        {anchors.map((anchor) => (
          <NavLink
            key={anchor.id}
            to={anchor.path}
            className={({ isActive }) =>
              isActive
                ? `${styles.link} ${styles.active}`
                : styles.link
            }
            aria-current={isActive ? 'page' : undefined}
          >
            {anchor.icon && <span className={styles.icon} aria-hidden="true">{anchor.icon}</span>}
            <span className={styles.label}>{anchor.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default AnchorNav;