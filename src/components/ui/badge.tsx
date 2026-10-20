import React from 'react';
import { cn } from './button';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'success' | 'secret';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-medium tracking-tight transition-colors',
        {
          'bg-zinc-800 text-zinc-200 border border-zinc-700/60': variant === 'default',
          'bg-zinc-900 text-zinc-400 border border-zinc-800': variant === 'secondary',
          'border border-zinc-700 text-zinc-300': variant === 'outline',
          'bg-emerald-950/40 text-emerald-300 border border-emerald-900/40': variant === 'success',
          'bg-rose-950/40 text-rose-300 border border-rose-900/40': variant === 'secret',
        },
        className
      )}
      {...props}
    />
  );
}
