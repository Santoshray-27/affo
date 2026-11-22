import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface QuantityStepperProps {
  quantity: number;
  max: number;
  min?: number;
  onChange: (newQuantity: number) => void;
  size?: 'sm' | 'md' | 'lg';
  showDeleteAtMin?: boolean;
  disabled?: boolean;
}

export const QuantityStepper: React.FC<QuantityStepperProps> = ({
  quantity,
  max,
  min = 1,
  onChange,
  size = 'md',
  showDeleteAtMin = false,
  disabled = false,
}) => {
  const isMin = quantity <= min;
  const isMax = quantity >= max;

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (quantity > 0) {
      onChange(quantity - 1);
    }
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isMax) {
      onChange(quantity + 1);
    }
  };

  const sizeClasses = {
    sm: {
      wrapper: 'h-8 px-1 text-xs gap-1',
      btn: 'w-6 h-6',
      icon: 'w-3 h-3',
      num: 'w-6 text-xs',
    },
    md: {
      wrapper: 'h-10 px-1.5 text-sm gap-2',
      btn: 'w-7 h-7',
      icon: 'w-3.5 h-3.5',
      num: 'w-8 text-sm font-semibold',
    },
    lg: {
      wrapper: 'h-12 px-2 text-base gap-3',
      btn: 'w-8 h-8',
      icon: 'w-4 h-4',
      num: 'w-10 text-base font-bold',
    },
  };

  const s = sizeClasses[size];

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-[8px] bg-cream border border-line text-ink select-none',
        s.wrapper,
        disabled && 'opacity-50 pointer-events-none'
      )}
    >
      <button
        type="button"
        onClick={handleDecrement}
        className={cn(
          'flex items-center justify-center rounded-[6px] transition-colors hover:bg-white text-ink active:scale-95',
          s.btn,
          isMin && showDeleteAtMin ? 'text-red hover:bg-red/10' : ''
        )}
        title={isMin && showDeleteAtMin ? 'Remove item' : 'Decrease'}
        aria-label="Decrease quantity"
      >
        {isMin && showDeleteAtMin ? (
          <Trash2 className={cn('text-red', s.icon)} />
        ) : (
          <Minus className={s.icon} />
        )}
      </button>

      <span className={cn('text-center text-ink select-none tabular-nums font-semibold', s.num)}>
        {quantity}
      </span>

      <button
        type="button"
        onClick={handleIncrement}
        disabled={isMax}
        className={cn(
          'flex items-center justify-center rounded-[6px] transition-colors hover:bg-white text-ink active:scale-95 disabled:opacity-30 disabled:pointer-events-none',
          s.btn
        )}
        title={isMax ? 'Maximum stock reached' : 'Increase'}
        aria-label="Increase quantity"
      >
        <Plus className={s.icon} />
      </button>
    </div>
  );
};
