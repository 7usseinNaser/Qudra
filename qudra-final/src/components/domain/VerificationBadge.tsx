import React from 'react';
import { ShieldCheck, ShieldAlert, Clock } from 'lucide-react';
import { Badge } from '../ui/Badge';

export interface VerificationBadgeProps {
  isVerified?: boolean;
  state?: 'verified' | 'partial' | 'unverified';
  trustScore?: number;
  label?: string;
  className?: string;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({
  isVerified,
  state,
  trustScore,
  label,
  className = ''
}) => {
  const effectiveState = state ?? (isVerified ? 'verified' : 'unverified');

  if (effectiveState === 'verified') {
    return (
      <Badge 
        variant="proof" 
        className={className}
        icon={<ShieldCheck size={14} />}
      >
        <span>{label ?? `موثق بنسبة ${trustScore ?? 94}%`}</span>
      </Badge>
    );
  }

  if (effectiveState === 'partial') {
    return (
      <Badge 
        variant="gap" 
        className={className}
        icon={<Clock size={14} />}
      >
        <span>{label ?? 'توثيق جزئي'}</span>
      </Badge>
    );
  }

  return (
    <Badge 
      variant="gap" 
      className={className}
      icon={<ShieldAlert size={14} />}
    >
      <span>{label ?? 'غير موثق بأدلة'}</span>
    </Badge>
  );
};
