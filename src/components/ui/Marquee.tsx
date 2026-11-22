import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import { Pause, Play } from 'lucide-react';

export interface MarqueeProps {
  children: React.ReactNode;
  duration?: number; // duration in seconds
  direction?: 'left' | 'right';
  gap?: string; // CSS gap string, e.g. "48px"
  pauseOnHover?: boolean;
  fadeEdges?: boolean;
  showToggle?: boolean;
  className?: string;
  repeatCount?: number; // times to repeat items inside group
}

export const Marquee: React.FC<MarqueeProps> = ({
  children,
  duration = 40,
  direction = 'left',
  gap = '48px',
  pauseOnHover = true,
  fadeEdges = true,
  showToggle = false,
  className,
  repeatCount = 1,
}) => {
  const [isPaused, setIsPaused] = useState(false);

  const styleVars: React.CSSProperties = {
    ['--marquee-duration' as any]: `${duration}s`,
    ['--marquee-gap' as any]: gap,
    ['--marquee-direction' as any]: direction === 'right' ? 'reverse' : 'normal',
    ...(fadeEdges
      ? {
          WebkitMaskImage:
            'linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)',
          maskImage:
            'linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)',
        }
      : {}),
  };

  const renderedGroup = (
    <div className="marquee__group">
      {Array.from({ length: repeatCount }).map((_, rIdx) => (
        <React.Fragment key={rIdx}>{children}</React.Fragment>
      ))}
    </div>
  );

  return (
    <div
      className={cn('marquee relative group', className)}
      style={styleVars}
      data-paused={isPaused}
    >
      <div
        className={cn('marquee__track', pauseOnHover && 'hover:[animation-play-state:paused]')}
        style={{
          animationPlayState: isPaused ? 'paused' : undefined,
        }}
      >
        {renderedGroup}
        <div aria-hidden="true" className="marquee__group">
          {Array.from({ length: repeatCount }).map((_, rIdx) => (
            <React.Fragment key={rIdx}>{children}</React.Fragment>
          ))}
        </div>
      </div>

      {showToggle && (
        <button
          type="button"
          onClick={() => setIsPaused(!isPaused)}
          aria-label={isPaused ? 'Play marquee animation' : 'Pause marquee animation'}
          className="absolute right-2 bottom-2 z-20 p-1.5 rounded-full bg-white/80 dark:bg-forest/80 backdrop-blur-xs border border-line text-ink hover:text-forest transition-colors shadow-xs opacity-0 group-hover:opacity-100 focus:opacity-100"
        >
          {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5 fill-current" />}
        </button>
      )}
    </div>
  );
};

export default Marquee;
