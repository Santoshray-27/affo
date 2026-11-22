import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

  const slideVariants = {
    right: {
      initial: { x: '100%' },
      animate: { x: 0 },
      exit: { x: '100%' },
    },
    left: {
      initial: { x: '-100%' },
      animate: { x: 0 },
      exit: { x: '-100%' },
    },
    bottom: {
      initial: { y: '100%' },
      animate: { y: 0 },
      exit: { y: '100%' },
    },
  };

  const containerClasses = {
    right: 'inset-y-0 right-0',
    left: 'inset-y-0 left-0',
    bottom: 'inset-x-0 bottom-0 max-h-[85vh] rounded-t-card-lg',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-forest/40 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer Content */}
          <div className={cn('fixed flex', containerClasses[placement])}>
            <motion.div
              initial={slideVariants[placement].initial}
              animate={slideVariants[placement].animate}
              exit={slideVariants[placement].exit}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className={cn(
                'relative bg-surface shadow-floating flex flex-col h-full border-border',
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
                <button
                  onClick={onClose}
                  className="text-muted hover:text-app-text p-1.5 rounded-full hover:bg-mint/40 transition-colors ml-auto"
                  aria-label="Close drawer"
                >
                  <X className="w-5 h-5" />
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
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

