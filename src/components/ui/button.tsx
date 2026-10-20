import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer',
          {
            // Default: bouton sombre blanc sur noir (style shadcn signature)
            'bg-zinc-100 text-zinc-900 shadow-sm hover:bg-zinc-200 active:scale-[0.98]':
              variant === 'default',
            // Secondary
            'bg-zinc-800/80 text-zinc-100 hover:bg-zinc-700/80 active:scale-[0.98]':
              variant === 'secondary',
            // Outline
            'border border-zinc-800 bg-transparent text-zinc-200 hover:bg-zinc-850 hover:text-white':
              variant === 'outline',
            // Ghost
            'text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-100':
              variant === 'ghost',
            // Destructive
            'bg-rose-950/60 text-rose-300 border border-rose-900/60 hover:bg-rose-900/60':
              variant === 'destructive',
          },
          {
            'h-9 px-4 py-2': size === 'default',
            'h-7 rounded-md px-2.5 text-[11px]': size === 'sm',
            'h-10 rounded-lg px-6 text-sm': size === 'lg',
            'h-8 w-8 p-0': size === 'icon',
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
