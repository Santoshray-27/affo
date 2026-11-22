import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../lib/utils';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'We encountered an error while loading this content. Please try again.',
  onRetry,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center rounded-card bg-red-50/50 border border-brand-red/20 my-4',
        className
      )}
    >
      <div className="w-14 h-14 rounded-full bg-brand-red-light flex items-center justify-center text-brand-red mb-3">
        <AlertCircle className="w-7 h-7" />
      </div>
      <h3 className="font-heading text-lg font-bold text-app-text">{title}</h3>
      <p className="text-sm text-muted max-w-sm mt-1">{message}</p>
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          size="sm"
          className="mt-4"
          icon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          Try Again
        </Button>
      )}
    </div>
  );
};

