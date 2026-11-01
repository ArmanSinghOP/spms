import React from 'react';
import { cn } from '../../lib/utils';
import { FolderSearch } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className
}) => {
  return (
    <div
      className={cn(
        'rounded-2xl glass-panel border border-slate-800/80 p-10 text-center flex flex-col items-center justify-center space-y-4 my-4',
        className
      )}
    >
      <div className="w-14 h-14 rounded-2xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-center text-slate-400">
        {icon || <FolderSearch className="w-7 h-7" />}
      </div>
      <div className="max-w-md space-y-1">
        <h4 className="text-base font-bold text-white">{title}</h4>
        <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
      </div>
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
};
