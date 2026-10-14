import React from 'react';
import { cn } from '@/lib/utils';
import { BadgeType } from '@/types';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  type?: BadgeType | 'custom';
  variant?: 'red' | 'green' | 'amber' | 'neutral';
}

export const Badge: React.FC<BadgeProps> = ({ type, variant, className, children, ...props }) => {
  let badgeStyles = 'bg-brandAccent text-white';

  if (type === 'SALE' || variant === 'red') {
    badgeStyles = 'bg-brandRed text-white';
  } else if (type === 'NEW' || variant === 'green') {
    badgeStyles = 'bg-brandGreen text-white';
  } else if (type === 'HOT' || variant === 'amber') {
    badgeStyles = 'bg-brandAccent text-white';
  } else if (type === 'FESTIVE') {
    badgeStyles = 'bg-[#e11d48] text-white';
  } else if (type === 'COASTAL') {
    badgeStyles = 'bg-[#0284c7] text-white';
  } else if (variant === 'neutral') {
    badgeStyles = 'bg-brandBorder text-brandText2';
  }

  const label = children || type;
  if (!label) return null;

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center text-[10px] font-bold px-2 py-0.5 rounded shadow-sm tracking-wider uppercase',
        badgeStyles,
        className
      )}
      {...props}
    >
      {label}
    </span>
  );
};
