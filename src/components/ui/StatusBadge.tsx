import React from 'react';
import { cn } from '../../lib/utils';
import { OrderStatus, StockStatus, PaymentStatus } from '../../types';

export interface StatusBadgeProps {
  status: OrderStatus | StockStatus | PaymentStatus | 'Active' | 'Inactive' | string;
  size?: 'sm' | 'md';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm', className }) => {
  let colorStyle = 'bg-mint text-primary-dark border-mint-dark';

  switch (status) {
    // Order Statuses
    case 'Pending':
      colorStyle = 'bg-marigold-light text-marigold-dark border-marigold/30';
      break;
    case 'Confirmed':
      colorStyle = 'bg-blue-50 text-blue-700 border-blue-200';
      break;
    case 'Processing':
      colorStyle = 'bg-purple-50 text-purple-700 border-purple-200';
      break;
    case 'Out for Delivery':
      colorStyle = 'bg-lime/20 text-primary-dark border-lime/50 font-bold';
      break;
    case 'Delivered':
      colorStyle = 'bg-emerald-50 text-emerald-800 border-emerald-300';
      break;
    case 'Cancelled':
      colorStyle = 'bg-brand-red-light text-brand-red border-brand-red/30';
      break;

    // Stock Statuses
    case 'In Stock':
      colorStyle = 'bg-mint text-primary-dark border-leaf/30';
      break;
    case 'Low Stock':
      colorStyle = 'bg-marigold-light text-marigold-dark border-marigold/40 font-semibold';
      break;
    case 'Out of Stock':
      colorStyle = 'bg-red-50 text-brand-red border-red-200 font-semibold';
      break;

    // Active/Inactive
    case 'Active':
      colorStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200';
      break;
    case 'Inactive':
      colorStyle = 'bg-stone-100 text-stone-600 border-stone-200';
      break;

    // Payment statuses
    case 'Paid (simulated)':
      colorStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200';
      break;
    case 'Pending (COD)':
      colorStyle = 'bg-amber-50 text-amber-800 border-amber-300';
      break;
    case 'Refunded':
      colorStyle = 'bg-blue-50 text-blue-700 border-blue-200';
      break;
    case 'Failed':
      colorStyle = 'bg-rose-50 text-rose-700 border-rose-200';
      break;

    default:
      colorStyle = 'bg-mint text-primary-dark border-mint-dark';
  }

  const sizeClasses = {
    sm: 'text-[11px] px-2.5 py-0.5',
    md: 'text-xs px-3 py-1',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium border leading-none tracking-wide select-none',
        colorStyle,
        sizeClasses[size],
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {status}
    </span>
  );
};

