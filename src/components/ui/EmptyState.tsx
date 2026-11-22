import React from 'react';
import { PackageOpen, Sparkles } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../lib/utils';

export interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-card bg-surface/70 border border-dashed border-border/80 my-4',
        className
      )}
    >
      <div className="w-16 h-16 rounded-full bg-mint flex items-center justify-center text-primary mb-4 shadow-sm">
        {icon || <PackageOpen className="w-8 h-8 opacity-70" />}
      </div>
      <h3 className="font-heading text-lg font-bold text-app-text">{title}</h3>
      {description && (
        <p className="text-sm text-muted max-w-sm mt-1.5 leading-relaxed">{description}</p>
      )}
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          variant="primary"
          size="md"
          className="mt-6"
          icon={<Sparkles className="w-4 h-4" />}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

