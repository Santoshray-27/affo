import React from 'react';
import { cn } from '../../lib/utils';

export interface BrandLogoProps {
  variant?: 'header' | 'footer' | 'admin' | 'wordmark';
  theme?: 'light' | 'dark';
  className?: string;
  plate?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'header',
  theme,
  className,
  plate = false,
}) => {
  const isDark = theme === 'dark' || variant === 'footer';

  if (variant === 'wordmark') {
    return (
      <div className={cn('inline-flex items-center gap-1.5 select-none', className)}>
        <span
          className="font-serif font-black text-2xl tracking-tight leading-none"
          style={{ fontFamily: "'Fraunces', serif" }}
        >
          <span
            style={{
              fontFamily: "'Tiro Devanagari Hindi', serif",
              color: isDark ? '#FF6B6B' : '#D62828',
            }}
          >
            अ
          </span>
          <span style={{ color: isDark ? '#FAFAF3' : '#14612A' }}>nnapurna</span>
        </span>
      </div>
    );
  }

  if (variant === 'footer') {
    // Crisp white rounded plate so the official logo renders with proper contrast on dark background
    return (
      <div className={cn('inline-flex items-center gap-3', className)}>
        <div className="bg-white p-2.5 px-4 rounded-[12px] shadow-sm inline-flex items-center">
          <img
            src="/brand/logo-full.png"
            alt="Annapurna Farm Fresh & Organics"
            className="h-10 w-auto object-contain"
          />
        </div>
      </div>
    );
  }

  if (variant === 'admin') {
    return (
      <div className={cn('flex items-center gap-2.5 select-none', className)}>
        <img
          src="/brand/logo-simple.png"
          alt="Annapurna Admin"
          className="h-8 w-auto object-contain"
        />
        <div className="flex items-baseline gap-1.5">
          <span className="font-heading font-medium text-white text-base tracking-tight">
            अन्नपूर्णा
          </span>
          <span className="text-[11px] font-mono text-lime uppercase tracking-wider font-semibold">
            Owner
          </span>
        </div>
      </div>
    );
  }

  // Header logo: rendered at height 44px (desktop) / 36px (mobile), width auto
  return (
    <div className={cn('flex items-center shrink-0', className)}>
      <img
        src="/brand/logo-full.png"
        alt="Annapurna Farm Fresh & Organics"
        className="h-9 lg:h-11 w-auto object-contain"
        style={{ imageRendering: 'auto' }}
      />
    </div>
  );
};

export default BrandLogo;
