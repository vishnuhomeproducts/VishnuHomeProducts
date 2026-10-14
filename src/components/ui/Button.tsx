'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading = false, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brandAccent focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.98]';
    
    const variants = {
      primary: 'bg-brandAccent hover:bg-brandAccent-mid text-white shadow-sm font-semibold rounded-button',
      secondary: 'bg-brandAccent-light text-brandAccent hover:bg-brandAccent-subtle font-semibold rounded-button',
      outline: 'border border-brandAccent text-brandAccent hover:bg-brandAccent hover:text-white rounded-button bg-white',
      ghost: 'text-brandText hover:bg-brandBorder/50 rounded-button',
      danger: 'bg-brandRed text-white hover:bg-red-700 rounded-button',
      dark: 'bg-brandDark text-white hover:bg-black rounded-button font-medium',
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5 h-8 gap-1.5',
      md: 'text-sm px-4 py-2.5 h-10 gap-2',
      lg: 'text-base px-6 py-3 h-12 gap-2.5',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
