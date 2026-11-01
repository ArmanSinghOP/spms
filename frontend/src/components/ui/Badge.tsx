import React from 'react';
import { cn } from '../../lib/utils';

export type BadgeVariant = 
  | 'default' 
  | 'primary' 
  | 'success' 
  | 'warning' 
  | 'danger' 
  | 'outline' 
  | 'purple' 
  | 'cyan';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-slate-800 text-slate-300 border-slate-700',
  primary: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  danger: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  outline: 'bg-transparent text-slate-400 border-slate-700',
  purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
};

export const Badge: React.FC<BadgeProps> = ({ 
  variant = 'default', 
  className, 
  children, 
  ...props 
}) => {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-colors',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export const EligibilityBadge: React.FC<{ eligible: boolean }> = ({ eligible }) => (
  <Badge variant={eligible ? 'success' : 'danger'}>
    {eligible ? 'Eligible' : 'Ineligible'}
  </Badge>
);

export const ApplicationStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getVariant = (s: string): BadgeVariant => {
    switch (s.toLowerCase()) {
      case 'selected':
      case 'placed':
        return 'success';
      case 'shortlisted':
        return 'primary';
      case 'rejected':
        return 'danger';
      case 'under review':
      case 'applied':
      default:
        return 'warning';
    }
  };
  return <Badge variant={getVariant(status)}>{status}</Badge>;
};
