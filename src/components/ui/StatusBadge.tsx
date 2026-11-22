import React from 'react';
import { cn } from '../../lib/utils';
import { OrderStatus, StockStatus, PaymentStatus } from '../../types';

export interface StatusBadgeProps {
  status: OrderStatus | StockStatus | PaymentStatus | 'Active' | 'Inactive' | string;
  size?: 'sm' | 'md';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm', className }) => {
  let colorStyle = 'bg-[#EAF4E4] text-[#14612A] border-[#CDE5C2]';

  switch (status) {
    // Order Statuses
    case 'Pending':
      colorStyle = 'bg-[#FFF3D6] text-[#8A5A00] border-[#F2DEAA]';
      break;
    case 'Confirmed':
    case 'Processing':
      colorStyle = 'bg-[#EAF4E4] text-[#14612A] border-[#CDE5C2]';
      break;
    case 'Out for Delivery':
      colorStyle = 'bg-[#E3F0FF] text-[#1B4F8F] border-[#BDDCFF] font-medium';
      break;
    case 'Delivered':
      colorStyle = 'bg-[#DFF3E4] text-[#14612A] border-[#BDE5C7]';
      break;
    case 'Cancelled':
      colorStyle = 'bg-[#FCE4E4] text-[#B01F1F] border-[#F5BDBD]';
      break;

    // Stock Statuses
    case 'In Stock':
      colorStyle = 'bg-[#EAF4E4] text-[#14612A] border-[#CDE5C2]';
      break;
    case 'Low Stock':
      colorStyle = 'bg-[#FFF3D6] text-[#8A5A00] border-[#F2DEAA] font-medium';
      break;
    case 'Out of Stock':
      colorStyle = 'bg-[#FCE4E4] text-[#B01F1F] border-[#F5BDBD] font-medium';
      break;

    // Active/Inactive
    case 'Active':
      colorStyle = 'bg-[#EAF4E4] text-[#14612A] border-[#CDE5C2]';
      break;
    case 'Inactive':
      colorStyle = 'bg-[#F4F4F0] text-[#5B6A5F] border-[#DDE6D6]';
      break;

    // Payment statuses
    case 'Paid (simulated)':
    case 'Paid':
      colorStyle = 'bg-[#EAF4E4] text-[#14612A] border-[#CDE5C2]';
      break;
    case 'Pending (COD)':
      colorStyle = 'bg-[#FFF3D6] text-[#8A5A00] border-[#F2DEAA]';
      break;
    case 'Refunded':
      colorStyle = 'bg-[#E3F0FF] text-[#1B4F8F] border-[#BDDCFF]';
      break;
    case 'Failed':
      colorStyle = 'bg-[#FCE4E4] text-[#B01F1F] border-[#F5BDBD]';
      break;

    default:
      colorStyle = 'bg-[#EAF4E4] text-[#14612A] border-[#CDE5C2]';
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
