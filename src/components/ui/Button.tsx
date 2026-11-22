import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'primary-red' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'tertiary';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      isLoading = false,
      icon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    // 10px radius per design system rules, 48px default height on md
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-[10px] transition-colors duration-150 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.99]';

    const variants = {
      // Primary button is brand red per spec (main CTA / buy / add)
      primary:
        'bg-red text-white hover:bg-red-hover focus-visible:ring-red font-semibold',
      'primary-red':
        'bg-red text-white hover:bg-red-hover focus-visible:ring-red font-semibold',
      // Secondary: forest outline
      secondary:
        'border border-forest text-forest bg-transparent hover:bg-forest/5 font-semibold',
      outline:
        'border border-border text-ink bg-white hover:border-forest hover:text-forest',
      ghost:
        'text-ink hover:bg-mint/60 hover:text-forest',
      tertiary:
        'p-0 h-auto font-medium text-forest hover:text-forest-deep underline underline-offset-4 decoration-forest/40 hover:decoration-forest transition-all',
      danger:
        'bg-red/10 text-red hover:bg-red hover:text-white border border-red/20 focus-visible:ring-red',
    };

    const sizes = {
      sm: 'text-xs px-3.5 py-1.5 gap-1.5 h-9',
      md: 'text-sm px-5 py-2.5 gap-2 h-12', // 48px standard
      lg: 'text-base px-6 py-3 gap-2.5 h-13',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          variants[variant],
          variant !== 'tertiary' && sizes[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
        ) : icon ? (
          <span className="shrink-0">{icon}</span>
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
