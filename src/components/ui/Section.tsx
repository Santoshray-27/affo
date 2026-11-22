import React from 'react';
import { cn } from '../../lib/utils';

export type SectionTone = 'cream' | 'white' | 'mint' | 'dark';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  tone?: SectionTone;
  container?: boolean;
  containerClassName?: string;
  children: React.ReactNode;
}

const TONE_CLASSES: Record<SectionTone, string> = {
  cream: 'tone-cream bg-cream text-ink',
  white: 'tone-white bg-white text-ink',
  mint: 'tone-mint bg-mint text-ink',
  dark: 'tone-dark bg-forest-deep text-on-dark',
};

const TONE_STYLES: Record<SectionTone, React.CSSProperties> = {
  cream: { backgroundColor: '#FAFAF3', color: '#1F2A22' },
  white: { backgroundColor: '#FFFFFF', color: '#1F2A22' },
  mint: { backgroundColor: '#EAF4E4', color: '#1F2A22' },
  dark: { backgroundColor: '#0B3D1A', color: '#FAFAF3' },
};

export const Section = React.forwardRef<HTMLElement, SectionProps>(
  (
    {
      tone = 'cream',
      container = true,
      containerClassName,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <section
        ref={ref}
        className={cn('w-full', TONE_CLASSES[tone], className)}
        style={{ ...TONE_STYLES[tone], ...style }}
        {...props}
      >
        {container ? (
          <div className={cn('max-w-[1280px] mx-auto px-4 sm:px-6', containerClassName)}>
            {children}
          </div>
        ) : (
          children
        )}
      </section>
    );
  }
);

Section.displayName = 'Section';
export default Section;
