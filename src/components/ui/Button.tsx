import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'primary-red' | 'secondary' | 'on-dark' | 'outline' | 'ghost' | 'danger' | 'tertiary';
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
      style,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-semibold rounded-[10px] transition-all duration-150 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-65';

    // Guaranteed variant styles using token classes with fallback styles
    const variantClasses = {
      primary: 'btn-primary shadow-sm',
      'primary-red': 'btn-primary shadow-sm',
      secondary: 'btn-secondary',
      'on-dark': 'btn-on-dark shadow-sm',
      outline: 'bg-white border border-line text-ink hover:border-forest hover:text-forest',
      ghost: 'bg-transparent text-ink hover:bg-mint hover:text-forest',
      danger: 'bg-red text-white hover:bg-red-dark',
      tertiary:
        'p-0 h-auto font-medium text-forest hover:text-forest-deep underline underline-offset-4 decoration-forest/40 hover:decoration-forest bg-transparent border-0',
    };

    // Specific inline style overrides for guaranteed rendering
    const variantStyles: Record<string, React.CSSProperties> = {
      primary: { backgroundColor: '#D62828', color: '#FFFFFF' },
      'primary-red': { backgroundColor: '#D62828', color: '#FFFFFF' },
      secondary: { backgroundColor: 'transparent', borderColor: '#14612A', color: '#14612A' },
      'on-dark': { backgroundColor: '#FAFAF3', color: '#0B3D1A' },
      outline: { backgroundColor: '#FFFFFF', borderColor: '#DDE6D6', color: '#1F2A22' },
      ghost: { backgroundColor: 'transparent' },
      danger: { backgroundColor: '#D62828', color: '#FFFFFF' },
      tertiary: {},
    };

    const sizes = {
      sm: 'text-xs px-3.5 h-9 min-h-[36px] gap-1.5',
      md: 'text-sm px-5 h-12 min-h-[48px] gap-2', // 48px standard height
      lg: 'text-base px-6 h-13 min-h-[52px] gap-2.5',
    };

    const isCustomHeight = className?.includes('h-') || className?.includes('py-');

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        style={{
          ...variantStyles[variant],
          ...(disabled ? { backgroundColor: '#DDE6D6', color: '#5B6A5F', borderColor: '#DDE6D6' } : {}),
          ...style,
        }}
        className={cn(
          baseStyles,
          variantClasses[variant],
          variant !== 'tertiary' && !isCustomHeight && sizes[size],
          disabled && 'btn-disabled cursor-not-allowed',
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
export default Button;
