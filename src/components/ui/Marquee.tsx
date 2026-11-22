import React from 'react';
import { cn } from '../../lib/utils';

export interface MarqueeProps {
  children: React.ReactNode;
  speed?: 'slow' | 'normal' | 'fast';
  direction?: 'left' | 'right';
  pauseOnHover?: boolean;
  gap?: string;
  fadeEdges?: boolean;
  fadeColor?: string; // e.g., 'from-cream', 'from-forest-deep', 'from-white'
  className?: string;
}

export const Marquee: React.FC<MarqueeProps> = ({
  children,
  speed = 'normal',
  direction = 'left',
  pauseOnHover = true,
  gap = 'gap-8',
  fadeEdges = true,
  fadeColor = 'from-cream',
  className,
}) => {
  const speedClass = {
    slow: direction === 'left' ? 'animate-marquee-slow' : 'animate-marquee-reverse',
    normal: direction === 'left' ? 'animate-marquee' : 'animate-marquee-reverse',
    fast: direction === 'left' ? 'animate-marquee-fast' : 'animate-marquee-reverse-fast',
  }[speed];

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden select-none',
        pauseOnHover && 'pause-on-hover',
        className
      )}
    >
      {/* Edge Fades for seamless premium look */}
      {fadeEdges && (
        <>
          <div
            className={cn(
              'pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-12 sm:w-24 bg-gradient-to-r to-transparent',
              fadeColor
            )}
          />
          <div
            className={cn(
              'pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-12 sm:w-24 bg-gradient-to-l to-transparent',
              fadeColor
            )}
          />
        </>
      )}

      {/* Marquee Track with duplicated content for infinite loop */}
      <div className="flex w-fit marquee-track">
        <div className={cn('flex shrink-0 items-center', gap, speedClass)}>
          {children}
        </div>
        <div aria-hidden className={cn('flex shrink-0 items-center', gap, speedClass)}>
          {children}
        </div>
      </div>
    </div>
  );
};
export default Marquee;

