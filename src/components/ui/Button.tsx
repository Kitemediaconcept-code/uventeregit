import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { motion, HTMLMotionProps } from 'framer-motion';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'glass' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    
    // Map custom variant to CSS classes defined in globals.css
    const variantClasses = {
      primary: 'btn-primary',
      glass: 'btn-glass',
      outline: 'btn-outline',
      ghost: 'bg-transparent text-slate-300 hover:text-white hover:bg-white/5 transition-colors rounded-full',
    };

    const sizeClasses = {
      sm: 'px-4 py-2 text-sm',
      md: '', // Defaults handled in globals.css
      lg: 'px-8 py-4 text-lg',
      icon: 'p-3 rounded-full flex items-center justify-center',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          variantClasses[variant],
          variant !== 'primary' && variant !== 'glass' && variant !== 'outline' && sizeClasses[size], 
          (disabled || isLoading) && 'opacity-60 cursor-not-allowed transform-none hover:transform-none hover:shadow-none',
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
        {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
