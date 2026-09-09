import React from 'react';
import styles from './Skeleton.module.css';

export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  circle?: boolean;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width,
  height,
  circle = false,
  className = ''
}) => {
  const inlineStyle: React.CSSProperties = {
    width: width ?? '100%',
    height: height ?? '1rem',
    borderRadius: circle ? '50%' : undefined
  };

  return (
    <div 
      className={`${styles.skeleton} ${circle ? styles.circle : ''} ${className}`} 
      style={inlineStyle}
      aria-hidden="true"
    />
  );
};
