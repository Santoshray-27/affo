import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  placement?: 'right' | 'left' | 'bottom';
  widthClass?: string;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  placement = 'right',
  widthClass = 'max-w-md w-full',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const containerClasses = {
    right: 'inset-y-0 right-0',
    left: 'inset-y-0 left-0',
    bottom: 'inset-x-0 bottom-0 max-h-[85vh] rounded-t-card-lg',
  };

  const slideInClasses = {
    right: 'translate-x-0 animate-slide-in-right',
    left: 'translate-x-0 animate-slide-in-left',
    bottom: 'translate-y-0 animate-slide-in-bottom',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop (Left Empty Space) - Click to close */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="fixed inset-0 bg-forest/40 backdrop-blur-sm cursor-pointer transition-opacity duration-300 animate-fade-in"
        aria-label="Close cart backdrop"
      />

      {/* Drawer Panel Container */}
      <div className={cn('fixed flex pointer-events-none', containerClasses[placement])}>
        <div
          className={cn(
            'relative bg-surface shadow-floating flex flex-col h-full border-border pointer-events-auto transition-transform duration-300 ease-out',
            slideInClasses[placement],
            placement === 'right' && 'border-l',
            placement === 'left' && 'border-r',
            placement === 'bottom' && 'border-t w-full',
            widthClass
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-cream/40 shrink-0">
            <div>
              {title && <h3 className="font-heading text-lg font-bold text-app-text">{title}</h3>}
              {subtitle && <p className="text-xs text-muted mt-0.5">{subtitle}</p>}
            </div>
            {/* Close "X" Cross Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="w-8 h-8 flex items-center justify-center text-muted hover:text-app-text rounded-full hover:bg-mint/60 transition-colors ml-auto cursor-pointer border border-transparent hover:border-line"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5 stroke-[2]" />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-6">{children}</div>

          {/* Optional Footer */}
          {footer && (
            <div className="px-6 py-4 border-t border-border bg-cream/30 shrink-0">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Drawer;
