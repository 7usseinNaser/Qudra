import React from 'react';
import { User } from '../../services/types';
import { VerificationBadge } from './VerificationBadge';
import { Ring } from '../ui/Ring';
import styles from './ProfileHeader.module.css';

export interface ProfileHeaderProps {
  user: User;
  trustScore?: number;
  actions?: React.ReactNode;
  className?: string;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  trustScore = 94,
  actions,
  className = ''
}) => {
  const initials = user.fullName
    ? user.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)
    : 'ق';

  return (
    <div className={`${styles.header} ${className}`}>
      <div className={styles.left}>
        <div className={`${styles.avatar} ${user.isEmailVerified ? styles.avatarVerified : ''}`}>
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.fullName} style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
          ) : (
            <span>{initials}</span>
          )}
        </div>
        <div className={styles.info}>
          <div className={styles.nameRow}>
            <h2 className={styles.name}>{user.fullName}</h2>
            <VerificationBadge isVerified={user.isEmailVerified} trustScore={trustScore} />
          </div>
          {user.headline && <p className={styles.headline}>{user.headline}</p>}
          <span className={styles.username}>@{user.username}</span>
        </div>
      </div>

      <div className={styles.right}>
        <Ring 
          value={trustScore} 
          size={58} 
          strokeWidth={5} 
          variant="proof" 
          label="موثوقية الأدلة" 
        />
        {actions}
      </div>
    </div>
  );
};
