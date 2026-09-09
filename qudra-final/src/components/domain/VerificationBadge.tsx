import React from 'react';
import { ShieldCheck, ShieldAlert } from 'lucide-react';
import { Badge } from '../ui/Badge';

export interface VerificationBadgeProps {
  isVerified: boolean;
  trustScore?: number;
  className?: string;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({
  isVerified,
  trustScore,
  className = ''
}) => {
  if (isVerified) {
    return (
      <Badge 
        variant="proof" 
        className={className}
        icon={<ShieldCheck size={14} />}
      >
        <span>موثق بنسبة {trustScore ?? 94}%</span>
      </Badge>
    );
  }

  return (
    <Badge 
      variant="gap" 
      className={className}
      icon={<ShieldAlert size={14} />}
    >
      <span>غير موثق بأدلة</span>
    </Badge>
  );
};
